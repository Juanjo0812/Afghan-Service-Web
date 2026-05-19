import { Resend } from 'resend'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { hashIP, hashPhone } from '@/lib/fingerprint'
import { escapeHtml } from '@/lib/escapeHtml'

// In-memory fallback rate limiting
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  message: z.string().min(1).max(2000),
  website_url: z.string().optional(),
  submissionId: z.string().min(1).optional(),
})

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function checkInMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { success: true }
  }

  if (entry.count >= limit) {
    return {
      success: false,
      retryAfterSeconds: Math.ceil((entry.resetTime - now) / 1000),
    }
  }

  entry.count += 1
  return { success: true }
}

// Upstash Redis setup
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
const useUpstash = Boolean(upstashUrl && upstashToken)

let ipRatelimit: Ratelimit | null = null
let phoneRatelimit: Ratelimit | null = null

if (useUpstash) {
  const redis = new Redis({ url: upstashUrl, token: upstashToken })
  ipRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: false,
  })
  phoneRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: false,
  })
}

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders?: Record<string, string>
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  })
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIP(request)

  // IP-based rate limiting
  let ipLimitResult: { success: boolean; retryAfterSeconds?: number }
  if (useUpstash && ipRatelimit) {
    const result = await ipRatelimit.limit(await hashIP(ip))
    ipLimitResult = {
      success: result.success,
      retryAfterSeconds: result.reset
        ? Math.ceil((result.reset - Date.now()) / 1000)
        : undefined,
    }
  } else {
    ipLimitResult = checkInMemoryRateLimit(ip, 5, 60 * 60 * 1000)
  }

  if (!ipLimitResult.success) {
    return jsonResponse(
      {
        success: false,
        error: 'Too many requests. Please call or WhatsApp us if this is urgent.',
        retryAfterSeconds: ipLimitResult.retryAfterSeconds,
      },
      429
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400)
  }

  const parseResult = contactSchema.safeParse(body)
  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parseResult.error.issues) {
      const path = issue.path.join('.')
      if (path && !(path in fieldErrors)) {
        fieldErrors[path] = issue.message
      }
    }
    return jsonResponse(
      { success: false, error: 'Validation failed', fields: fieldErrors },
      400
    )
  }

  const { name, phone, email, message, website_url, submissionId } =
    parseResult.data

  // Fingerprint-based rate limiting (phone)
  if (phone) {
    const phoneKey = `phone:${await hashPhone(phone)}`
    let phoneLimitResult: { success: boolean; retryAfterSeconds?: number }
    if (useUpstash && phoneRatelimit) {
      const result = await phoneRatelimit.limit(phoneKey)
      phoneLimitResult = {
        success: result.success,
        retryAfterSeconds: result.reset
          ? Math.ceil((result.reset - Date.now()) / 1000)
          : undefined,
      }
    } else {
      phoneLimitResult = checkInMemoryRateLimit(phoneKey, 3, 60 * 60 * 1000)
    }

    if (!phoneLimitResult.success) {
      return jsonResponse(
        {
          success: false,
          error: 'Too many requests. Please call or WhatsApp us if this is urgent.',
          retryAfterSeconds: phoneLimitResult.retryAfterSeconds,
        },
        429
      )
    }
  }

  if (website_url && website_url.trim().length > 0) {
    return jsonResponse(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
      },
      200
    )
  }

  const safeName = escapeHtml(name)
  const safePhone = escapeHtml(phone)
  const safeEmail = email ? escapeHtml(email) : ''
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!fromEmail) {
    return jsonResponse(
      { success: false, error: 'Failed to send message. Please try again later.' },
      500
    )
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || 'Dpeshtaz@cc-az.org'
  const idempotencyKey = submissionId || crypto.randomUUID()

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Contact Form Submission from ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    })

    if (result.error) {
      return jsonResponse(
        { success: false, error: 'Failed to send message. Please try again later.' },
        500
      )
    }

    return jsonResponse(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
      },
      200
    )
  } catch {
    return jsonResponse(
      { success: false, error: 'Failed to send message. Please try again later.' },
      500
    )
  }
}
