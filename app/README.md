# Afghan Support Phoenix

Public, mostly-static, multilingual website for Afghan families in Phoenix, Arizona.

## Stack
- **Frontend**: Next.js 16 App Router + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **i18n**: react-i18next (English, Dari, Uzbek)
- **CMS**: WordPress Headless (events and SEO metadata)
- **Email**: Resend (contact form)
- **Rate limiting**: Upstash Redis
- **Hosting**: Vercel (frontend), Hostinger (WordPress)

## Setup
pnpm install
pnpm run dev

## Scripts
- `pnpm run dev` — development server
- `pnpm lint` — ESLint
- `pnpm tsc --noEmit` — TypeScript check
- `pnpm test` — Vitest (unit tests)

## Env vars
See implementation_plan.md for full list.

## Project Docs
- `docs/PRD_Afghan_Support_Realistic.md` — active PRD
- `docs/implementation_plan.md` — execution plan
- `docs/Website_Layout_Afghan_Immigration.md` — client input
