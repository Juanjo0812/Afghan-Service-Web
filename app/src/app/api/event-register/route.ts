import { Resend } from 'resend'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'
import { hashIP } from '@/lib/fingerprint'
import { escapeHtml } from '@/lib/escapeHtml'
import { generateEventRegistrationEmail } from '@/lib/emailTemplates'


// ── In-memory fallback rate limiting (independent from contact) ──
interface RateLimitEntry {
  count: number
  resetTime: number
}

const eventRateLimitMap = new Map<string, RateLimitEntry>()

function checkInMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const entry = eventRateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    eventRateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
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

// ── Validation ──
const eventRegisterSchema = z.object({
  name: z.string().min(1).max(100),
  contactMethod: z.enum(['phone', 'email']),
  contactValue: z.string().min(1).max(254),
  eventTitle: z.string().min(1).max(300),
  language: z.enum(['en', 'dari', 'uzbek']),
  website_url: z.string().optional(), // honeypot
})

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// ── Upstash Redis — independent limiters for event registration ──
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
const useUpstash = Boolean(upstashUrl && upstashToken)

let ipRatelimit: Ratelimit | null = null

if (useUpstash) {
  const redis = new Redis({ url: upstashUrl, token: upstashToken })
  // More tolerant than contact: 10 per hour per IP
  ipRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'event-register', // independent namespace from contact
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

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  dari: 'Dari (دری)',
  uzbek: 'Uzbek (Oʻzbekcha)',
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIP(request)

  // IP-based rate limiting (independent from contact)
  let ipLimitResult: { success: boolean; retryAfterSeconds?: number }
  if (useUpstash && ipRatelimit) {
    const result = await ipRatelimit.limit(`event-reg:${await hashIP(ip)}`)
    ipLimitResult = {
      success: result.success,
      retryAfterSeconds: result.reset
        ? Math.ceil((result.reset - Date.now()) / 1000)
        : undefined,
    }
  } else {
    // Fallback: 10 per hour per IP (more tolerant than contact's 5)
    ipLimitResult = checkInMemoryRateLimit(`event-reg:${ip}`, 10, 60 * 60 * 1000)
  }

  if (!ipLimitResult.success) {
    return jsonResponse(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
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

  const parseResult = eventRegisterSchema.safeParse(body)
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

  const { name, contactMethod, contactValue, eventTitle, language, website_url } =
    parseResult.data

  // Honeypot
  if (website_url && website_url.trim().length > 0) {
    return jsonResponse({ success: true }, 200)
  }

  const safeName = escapeHtml(name)
  const safeContact = escapeHtml(contactValue)
  const safeEventTitle = escapeHtml(eventTitle)
  const langLabel = LANGUAGE_LABELS[language] || language

  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!fromEmail) {
    return jsonResponse(
      { success: false, error: 'Failed to process registration. Please try again later.' },
      500
    )
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || 'Dpeshtaz@cc-az.org'

  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const logoUrl = `${protocol}://${host}/images/Catholic.png`

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Event Registration Request — ${safeEventTitle}`,
      html: generateEventRegistrationEmail({
        logoUrl,
        name: safeName,
        eventTitle: safeEventTitle,
        contactMethod,
        contactValue: safeContact,
        langLabel,
      }),
    })

    if (result.error) {
      return jsonResponse(
        { success: false, error: 'Failed to process registration. Please try again later.' },
        500
      )
    }

    return jsonResponse({ success: true }, 200)
  } catch {
    return jsonResponse(
      { success: false, error: 'Failed to process registration. Please try again later.' },
      500
    )
  }
}
