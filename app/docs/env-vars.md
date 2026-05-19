# Environment Variables

This document lists all environment variables required for the Afghan Support Phoenix Next.js application.

## WordPress Headless CMS

| Variable | Required | Description |
|---|---|---|
| `WORDPRESS_API_BASE_URL` | Yes | WordPress REST API root. Example: `https://cms.example.org/wp-json/wp/v2` |
| `WORDPRESS_REVALIDATE_SECRET` | Yes | Secret token for the `/api/revalidate` ISR webhook. Must match the value configured in WordPress. |
| `WORDPRESS_MEDIA_HOSTNAME` | Yes | Hostname for WordPress media uploads. Used for Next.js `images.remotePatterns` and CSP `img-src`. Example: `cms.example.org` |

## Site Configuration

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL used for canonical links and Open Graph. Example: `https://example.org` |

## Contact Form & Email

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key for sending contact form emails. |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address in Resend. |
| `CONTACT_TO_EMAIL` | Yes | Recipient address for contact form submissions. |

## Rate Limiting

| Variable | Required | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Yes | Upstash Redis REST URL for rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Upstash Redis REST token. |

## Local Development

Copy `.env.example` to `.env.local` and fill in the values. `NEXT_PUBLIC_SITE_URL` can be `http://localhost:3000` for local development.

## Security Notes

- Never commit `.env.local` or real secrets to the repository.
- `WORDPRESS_REVALIDATE_SECRET` should be a long random string.
- All CMS fetches are server-side only; no WordPress credentials are exposed to the browser.
