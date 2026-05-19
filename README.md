# Afghan Support Phoenix

> Free, confidential support for Afghan families in Phoenix, Arizona.

**Afghan Support Phoenix** is a public, multilingual website that centralizes immigration assistance, Know Your Rights information, community resources, events, and contact options for Afghan families in the Phoenix metropolitan area.

Built with accessibility, legal safety, and fast loading as first principles. The site feels institutional, warm, and trustworthy — designed for users with limited digital literacy on mobile-first, low-bandwidth connections.

---

## Features

| Feature | Description |
|---|---|
| 🌐 **Multilingual** | Full English, Dari, and Uzbek support with RTL layout for Dari |
| 📋 **Know Your Rights** | Static, reviewed legal content with downloadable PDF cards in 3 languages |
| 🤖 **Deterministic Chatbot** | Local JSON knowledge base with keyword/scoring matching — no AI, no LLMs |
| 📅 **Events Calendar** | WordPress Headless-driven event listings with list/calendar views and ISR caching |
| ✉️ **Contact Form** | Serverless email delivery via Resend with Zod validation, honeypot, and rate limiting |
| 🔒 **Privacy-First** | No PII persistence. IPs HMAC-hashed. User data HTML-escaped. Upstash Redis for rate limiting. |
| 📱 **Accessible** | WCAG AA target, keyboard navigation, screen-reader support, 44px tap targets |
| 🗺️ **Community Resources** | English classes, mental health, food banks, and health clinics with curated local data |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router) + React 19 + TypeScript |
| **Styling** | Tailwind CSS |
| **i18n** | react-i18next (11 locale namespaces per language) |
| **CMS** | WordPress Headless on Hostinger (events + SEO metadata) |
| **Email** | Resend (contact form + event registration) |
| **Rate Limiting** | Upstash Redis (sliding window + HMAC-hashed identifiers) |
| **Testing** | Vitest (15 tests across 4 suites) |
| **Hosting** | Vercel (frontend) + Hostinger (WordPress admin) |

---

## Quick Start

```bash
# Prerequisites: Node.js 20+, pnpm 9+
cd app
pnpm install
pnpm run dev        # http://localhost:3000
```

### Scripts

| Command | Purpose |
|---|---|
| `pnpm run dev` | Development server with Turbopack HMR |
| `pnpm lint` | ESLint (flat config) |
| `pnpm tsc --noEmit` | TypeScript type checking |
| `pnpm test` | Vitest unit tests |
| `pnpm audit --prod` | Production dependency audit |

> **Note:** Do not run `pnpm run build` locally. Vercel handles production builds on deploy.

---

## Architecture

```
app/
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── layout.tsx          # Root layout (static English)
│   │   ├── page.tsx            # Home (async, fetches WP events)
│   │   ├── [lang]/             # Dari/Uzbek localized routes
│   │   │   ├── layout.tsx      # Segment layout (dynamic lang/dir)
│   │   │   └── **/page.tsx     # Localized pages
│   │   ├── api/contact/        # Contact form endpoint
│   │   ├── api/event-register/ # Event registration endpoint
│   │   └── api/revalidate/     # ISR webhook endpoint
│   ├── components/             # Shared UI (Header, Footer, AppShell)
│   ├── features/events/        # Events client, detail, registration modal
│   ├── pages/                  # Page views (Home, Immigration, Rights, etc.)
│   ├── sections/               # Chatbot widget
│   ├── locales/                # i18n JSON (en, dari, uzbek)
│   ├── data/                   # Chatbot KB, local JSON
│   ├── lib/                    # Utilities (navigation, fingerprint, sanitize, etc.)
│   ├── hooks/                  # React hooks (useLanguage, useChatbotKB)
│   ├── server/cms/             # WordPress adapter + cache layer
│   ├── domain/                 # Shared types (language, content)
│   └── i18n/                   # i18next configuration
├── public/
│   ├── images/                 # Static images
│   ├── videos/Stories/         # Community story videos
│   └── PDFs_Rights/            # Know Your Rights PDFs (EN/Dari/Uzbek)
└── docs/                       # PRD, implementation plan, client input
```

### Key Design Decisions

- **English at root**: Canonical English routes live at `/`, `/immigration`, etc. — no `/en` prefix. `/en/*` returns 404.
- **Localized at `[lang]`**: Dari at `/dari/*`, Uzbek at `/uzbek/*`. `assertValidLang()` guards reject invalid params.
- **Static root layout**: English routes are fully static/ISR. Only `[lang]/layout.tsx` calls `headers()` for dynamic lang/dir detection.
- **WordPress Headless scope**: Events and SEO metadata only. All other content is local (locale JSON, static pages).
- **ISR with tag-based cache**: `fetch()` uses `next: { tags: ['events', 'metadata'] }`. Webhook calls `revalidateTag()` + `revalidatePath()`.
- **Deterministic chatbot**: 23 curated KB entries with keyword scoring. Local JSON only. No external APIs.

---

## Environment Variables

Required for production:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `WORDPRESS_API_BASE_URL` | WP REST API base (e.g., `https://cms.example.com/wp-json/wp/v2`) |
| `WORDPRESS_MEDIA_HOSTNAME` | WP media domain for CSP `img-src` + next/image |
| `WORDPRESS_REVALIDATE_SECRET` | Secret for ISR webhook authentication |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender email |
| `CONTACT_TO_EMAIL` | Inbox receiving contact submissions |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `RATE_LIMIT_HASH_SECRET` | HMAC secret for IP hashing |

---

## Documentation

| Document | Purpose |
|---|---|
| [`PRD_Afghan_Support_Realistic.md`](app/docs/PRD_Afghan_Support_Realistic.md) | Active product requirements document |
| [`implementation_plan.md`](app/docs/implementation_plan.md) | Execution plan — Packets A-F |
| [`production_readiness_fix_plan.md`](app/docs/production_readiness_fix_plan.md) | P0/P1 hardening audit and fixes |
| [`Website_Layout_Afghan_Immigration.md`](app/docs/Website_Layout_Afghan_Immigration.md) | Original client layout input |
| [`AGENTS.md`](AGENTS.md) | Agent instructions and project conventions |

---

## License

Proprietary — Catholic Charities Community Services of Arizona. All rights reserved.
