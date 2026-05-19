import type { NextConfig } from 'next'

const wpMediaHost = process.env.WORDPRESS_MEDIA_HOSTNAME
const wpApiBase = process.env.WORDPRESS_API_BASE_URL

function toUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
}

function resolveWordPressMediaUrl(): URL | null {
  const apiUrl = wpApiBase ? toUrl(wpApiBase) : null

  if (!wpMediaHost) {
    return apiUrl
  }

  const explicitMediaUrl = toUrl(wpMediaHost)
  if (explicitMediaUrl) {
    return explicitMediaUrl
  }

  if (apiUrl && apiUrl.hostname === wpMediaHost && isLocalHost(wpMediaHost)) {
    return apiUrl
  }

  return toUrl(`https://${wpMediaHost}`)
}

const wpMediaUrl = resolveWordPressMediaUrl()

// CSP uses 'unsafe-inline' for script-src and style-src.
// This is an accepted tradeoff for Next.js App Router hydration and Tailwind CSS.
// Future hardening path: nonce-based scripts and hashed styles.
// See: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
function buildCSP(): string {
  const isDev = process.env.NODE_ENV !== "production"
  const imgSrc = ["'self'", "data:", wpMediaUrl?.origin].filter(Boolean).join(" ")
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'"
  const connectSrc = isDev ? "'self' ws: wss:" : "'self'"

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "media-src 'self'",
    `connect-src ${connectSrc}`,
    "frame-src https://www.google.com",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ]

  if (!isDev) {
    directives.push("upgrade-insecure-requests")
  }

  return directives.join("; ")
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: (wpMediaUrl?.protocol.replace(":", "") || "https") as "http" | "https",
        hostname: wpMediaUrl?.hostname || wpMediaHost || "localhost",
        port: wpMediaUrl?.port || "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const csp = buildCSP()
    return [
      {
        source: "/api/contact",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/api/revalidate",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/api/event-register",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/assets/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "0" },
          // CSP only in production — in dev it blocks HMR WebSocket
          // via LAN IP, killing React hydration on mobile devices.
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Content-Security-Policy", value: csp }]
            : []),
        ],
      },
    ]
  },
}

export default nextConfig
