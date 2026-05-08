import { Resend } from 'resend';
import { z } from 'zod';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
  website_url: z.string().optional(),
});

function sanitizeInput(input: string, maxLength: number): string {
  const stripped = input.replace(/<[^>]*>/g, '');
  return stripped.slice(0, maxLength);
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60_000 });
    return true;
  }

  if (entry.count >= 5) {
    return false;
  }

  entry.count += 1;
  return true;
}

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders?: Record<string, string>
): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...extraHeaders,
  });
  return new Response(JSON.stringify(body), { status, headers });
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const ip = getClientIP(req);
  if (!checkRateLimit(ip)) {
    return jsonResponse({ error: 'Too many requests' }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const parseResult = contactSchema.safeParse(body);
  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      const path = issue.path.join('.');
      if (path && !(path in fieldErrors)) {
        fieldErrors[path] = issue.message;
      }
    }
    return jsonResponse(
      { error: 'Validation failed', fields: fieldErrors },
      400
    );
  }

  const { name, phone, email, message, website_url } = parseResult.data;

  if (website_url && website_url.trim().length > 0) {
    return jsonResponse(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
      },
      200
    );
  }

  const safeName = sanitizeInput(name, 100);
  const safePhone = sanitizeInput(phone, 50);
  const safeEmail = sanitizeInput(email, 254);
  const safeMessage = sanitizeInput(message, 2000);

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const result = await resend.emails.send({
      from: fromEmail,
      to: 'Dpeshtaz@cc-az.org',
      subject: `New Contact Form Submission from ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (result.error) {
      return jsonResponse(
        { error: 'Failed to send message. Please try again later.' },
        500
      );
    }

    return jsonResponse(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
      },
      200
    );
  } catch {
    return jsonResponse(
      { error: 'Failed to send message. Please try again later.' },
      500
    );
  }
}
