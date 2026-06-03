# AGENTS.md — Afghan Support Phoenix

These instructions apply to everything under this repository.

## Non-negotiables

- Use conventional commits only. Never add `Co-Authored-By` or AI attribution.
- NEVER use `npm` due to security constraints. ALWAYS use `pnpm` for all package management and script execution.
- Do not run `pnpm run build` after changes unless the maintainer explicitly overrides this rule.
- Keep answers, docs, PR notes, and handoffs short first. Expand only when the task genuinely needs detail.
- Verify claims against code before stating them. If a claim is wrong, explain why with file-level evidence.
- Treat AI as an execution tool, not the architect. Human intent leads; agents execute bounded work.

## Product constraints

- The public site is for Afghan families in Phoenix, Arizona.
- Legal and immigration content must be static, curated, and reviewed. Do not generate legal advice dynamically.
- The chatbot must be deterministic: local JSON knowledge base + keyword/scoring match only. No LLMs, embeddings, or external chatbot APIs.
- Do not store PII. Contact submissions may be emailed through an approved provider, but the app must not persist form data. IP addresses are HMAC-hashed before rate-limit key use. User data is HTML-escaped in email bodies.
- Multilingual support target: Dari default, English, Afghan Uzbek, and Pashto. Dari, Afghan Uzbek, and Pashto need RTL support. All 11 locale namespaces are populated for each language; machine-generated translations require human review before launch.

## Project shape

- App root: `app/`
- Main app entry: `app/src/app/layout.tsx` (Dari root) + `app/src/app/[lang]/layout.tsx` (English/Afghan Uzbek/Pashto routes) + `app/src/app/page.tsx` (Next.js App Router)
- Page views: `app/src/page-views/`
- Features: `app/src/features/events/` (EventsClient, EventDetail, EventRegistrationModal)
- Static assets: `app/public/images/`, `app/public/videos/`, `app/public/PDFs_Rights/`
- Product docs: `app/docs/PRD_Afghan_Support_Realistic.md` (active PRD)

## Testing

- Test runner: Vitest
- Test command: `pnpm test`
- Test files: `app/src/lib/*.test.ts`
- Coverage: deterministic pure functions (hashPhone, hashIP, escapeHtml, sanitizeHtml, matchKeywords, localizePath)
- 18 tests across 4 test files

## Verification before deploy

```bash
pnpm lint                              # ESLint — must exit 0
pnpm exec tsc --noEmit --incremental false  # TypeScript — must exit 0
pnpm test                              # Vitest — 15/15 must pass
pnpm audit --prod --audit-level moderate   # Production deps — must pass
```

Do NOT run `pnpm run build` locally. Vercel builds on deploy.

## Implementation guidance for sub-agents

- Start from the PRD and implement in small, reviewable slices.
- Prefer one sub-agent per bounded work packet: data extraction, contact flow, chatbot engine, accessibility, SEO, i18n/RTL, dependency cleanup.
- Preserve the current visual direction: institutional, warm, simple, accessible. No SaaS/glassmorphism/dark-mode gimmicks.
- Update the relevant Markdown when implementation changes product behavior, current status, or handoff instructions.
