import type { NextConfig } from 'next'
import path from 'path'

const wpMediaHost = process.env.WORDPRESS_MEDIA_HOSTNAME

function buildCSP(): string {
  const imgSrc = wpMediaHost
    ? `'self' data: https://${wpMediaHost}`
    : "'self' data:"

  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "media-src 'self'",
    "connect-src 'self'",
    "frame-src https://www.google.com",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join("; ")
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wpMediaHost || "localhost",
        port: "",
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
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ]
  },
  turbopack: {
    resolveAlias: {
      "react-router": path.resolve(__dirname, "src/lib/react-router-shim.tsx"),
    },
  },
}

export default nextConfig
