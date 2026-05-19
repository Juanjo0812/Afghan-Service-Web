# Implementation Plan — Afghan Support Phoenix Next.js + Headless Production Closure

This is the execution plan to finish Afghan Support Phoenix for production from the current Next.js `app/` codebase. It reflects the migration to Next.js App Router with WordPress Headless for client-editable events and SEO/social metadata only.

**Source of truth:** `app/docs/PRD_Afghan_Support_Realistic.md`  
**Client input:** `app/docs/Website_Layout_Afghan_Immigration.md`  
**Default deployment target:** Vercel, with `app/` as the project root  
**Default CMS target:** WordPress on Hostinger, first validated locally with WordPress Studio  
**Default email provider:** Resend  
**Default production rate limit store:** Upstash Redis

---

## 0. Execution Rules

1. Do not rebuild the website from scratch.
2. Preserve the current visual direction: institutional, warm, simple, accessible.
3. Do not run `pnpm run build` unless the maintainer explicitly authorizes it.
4. Do not add generative AI, LLMs, embeddings, external chatbot APIs, auth, database persistence, booking, donations, blog/news features, or a general-purpose page builder.
5. Do not store PII in localStorage, analytics, logs, a database, or static files.
6. Verify claims against code before checking any task as done.
7. Keep each work packet small enough for review; prefer one sub-agent per bounded area.

---

## 1. Current State to Preserve

The active app is the Next.js App Router app under `app/`.

| Area | Current anchor |
|---|---|
| Entry | `src/app/layout.tsx` + `src/app/page.tsx` |
| Routes | Next.js App Router pages under `src/app/**/page.tsx` |
| Layout | `src/components/AppShell.tsx` wrapped in root layout |
| Header/Footer | `src/components/Header.tsx`, `src/components/Footer.tsx` |
| Active page views | `src/page-views/HomePage.tsx`, `ImmigrationPage.tsx`, `RightsPage.tsx`, `ResourcesPage.tsx`, `StoriesPage.tsx`, `ContactPage.tsx`; events render through `src/features/events/EventsClient.tsx` |
| Chatbot | `src/sections/Chatbot.tsx` + `src/data/chatbot-kb.json` |
| Contact API | `src/app/api/contact/route.ts` (Next.js Route Handler) |
| Styling | Tailwind + `src/app/globals.css` |

Do not restore removed design-reference folders. The deleted `app/docs/stitch_design/**` files are not runtime dependencies.

---

## 2. ~~Work Packet A — Runtime Cleanup and Dependency Hygiene~~ ✅ Completed

> Completed in commits `fed2de44` and Packet A execution. Legacy files, unused dependencies, and lint issues resolved.

### Required changes

- Delete unreachable runtime files:
  - `src/App.css`
  - `src/page-views/Home.tsx`
  - `src/hooks/useScrollReveal.ts`
  - `src/lib/animationDirection.ts`
  - `src/lib/dataLoader.ts`
  - every file under `src/sections/` except `src/sections/Chatbot.tsx`
- Do **not** delete these yet:
  - `src/data/events*.json`
  - `src/data/resources*.json`
  - `src/data/testimonials*.json`
  - locale JSON files
- Remove production-unneeded tooling if no active code needs it:
- `kimi-plugin-inspect-react` from `package.json` and lockfile if unused
- `tw-animate-css` from `package.json` and lockfile if unused
- Fix active lint issue in `src/components/Header.tsx` without changing navigation behavior.
- Keep generated artifacts out of source control: `.next/`, `out/`, and `*.tsbuildinfo`.

### Acceptance criteria

- No active imports point to deleted files.
- `pnpm lint` has no errors caused by deleted legacy code or `Header.tsx`.
- No visual/routing behavior is intentionally changed in this packet.

---

## 3. ~~Work Packet B — Real Contact Email Flow~~ ✅ Completed

> Implemented in `src/app/api/contact/route.ts`: Zod validation, honeypot, Resend with idempotency key, server-side sanitization, `Cache-Control: no-store`, no wildcard CORS, structured error responses. `ContactPage.tsx` submits to `POST /api/contact` with success/error/rate-limit states and visible fallback contact options.

### Frontend contract

Update `src/page-views/ContactPage.tsx` to submit to `POST /api/contact`.

Payload:

```ts
interface ContactPayload {
  name: string
  phone: string
  message: string
  email?: string
  website_url?: string // hidden honeypot
  submissionId: string // stable per attempted submit for Resend idempotency
}
```

Form fields:

- Required: name, phone, message.
- Optional: email.
- Hidden honeypot: `website_url`.
- Generate `submissionId` client-side with `crypto.randomUUID()` when the form mounts or before submit.
- Disable submit while pending.
- Show clear states: sending, success, validation error, rate limited, generic failure.
- On API failure, keep direct fallback visible: WhatsApp, phone, and email.

### API contract

Update `api/contact.ts`:

- Accept the payload above.
- Validate server-side with Zod.
- Keep email optional; do not require it unless the UI also requires it.
- Sanitize/escape all values rendered into email HTML.
- Do not log submitted PII.
- Use only server-side env vars:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `CONTACT_TO_EMAIL`
- Do not hardcode `onboarding@resend.dev` as a production fallback.
- Send through Resend with an idempotency key derived from `submissionId`.
- Return JSON only.
- Add `Cache-Control: no-store` to every API response.
- Remove wildcard CORS; this is a same-origin form endpoint.
- Keep `OPTIONS` support only if required by the deployment/runtime, also without wildcard CORS.

### Success response

```json
{ "success": true, "message": "Thank you. We will contact you within 24 hours." }
```

### Error response shape

```json
{
  "success": false,
  "error": "Validation failed",
  "fields": { "phone": "Please enter a valid phone number" }
}
```

For rate limiting:

```json
{
  "success": false,
  "error": "Too many requests. Please call or WhatsApp us if this is urgent.",
  "retryAfterSeconds": 3600
}
```

---

## 4. ~~Work Packet C — Production Anti-Abuse and Resilience~~ ✅ Completed

> Implemented in `src/app/api/contact/route.ts`: Upstash Redis sliding window (5/h IP, 3/h phone), in-memory fallback when Upstash unavailable, honeypot silent success, safe generic error responses. No PII in rate-limit or provider errors.

### Required changes

- Add `@upstash/redis` and `@upstash/ratelimit`.
- Replace in-memory-only rate limiting with Upstash Redis.
- Use sliding window limits:
  - IP limit: 5 contact submissions per hour.
  - Secondary fingerprint limit when phone or email exists: 3 submissions per hour.
- Use IP extraction from trusted deployment headers, preferring Vercel-compatible headers when present.
- If Upstash is unavailable, fail open for legitimate users but return no sensitive details.
- Add lightweight abuse checks:
  - reject oversized JSON before processing where feasible
  - cap message length server-side
  - reject honeypot submissions as silent success
- Keep all rate-limit and provider errors free of PII.

### Acceptance criteria

- Repeated submissions from the same IP eventually return `429`.
- Honeypot submissions return success but do not send email.
- Resend failures return a safe generic error and do not expose provider internals.
- No contact data is persisted by app code.

---

## 5. ~~Work Packet D — Client Content Compliance~~ ✅ Completed

> Implemented in commit Packet D execution. RightsPage download cards linked to real PDFs (`/PDFs_Rights/`). StoriesPage wired to 5 real videos (`/videos/Stories/Story_1..5.mp4`) with honest placeholder metadata (no fake names/quotes). Homepage featured event made dynamic: `page.tsx` and `[lang]/page.tsx` now async, fetch closest upcoming event from WordPress via `getEvents()`, pass to `HomePage` as optional prop. Section hidden when no upcoming event exists.

**Goal:** align active pages with the company-requested layout and remove production placeholders.

### Resources page

`ResourcesPage.tsx` must show only the four required categories:

1. English classes
2. Mental health & wellness
3. Food banks
4. Health clinics

Replace `href="#"` with approved external links, phone numbers, or contact CTAs. External links must use `target="_blank"` and `rel="noopener noreferrer"`.

### Events page

- Remove all `alert(...)` handlers.
- Replace event CTAs with either:
  - approved registration URL, or
  - route to `/contact` with copy explaining registration/contact.
- Keep required categories: immigration workshops, legal clinics, cultural gatherings, Afghan holidays.

### Know Your Rights page

- Download cards must link to actual approved PDFs:
  - English
  - Dari
  - Uzbek
- If approved PDFs are missing, keep the task open and mark launch blocked.
- Keep legal disclaimer and last-reviewed date visible.

### Stories page

- Do not use fake names, fake quotes, or stock-photo testimonials as real stories.
- If approved assets are missing, replace story cards with an honest placeholder explaining that community stories will be added after approval.

### Images and media

- Remove Unsplash/runtime external images from active pages.
- Use approved local assets from `public/images` and `public/videos`.
- Do not delete unused public assets until active page replacements are complete.

### Homepage featured event (dynamic)

The "Announcements / Events Preview" required by the client layout currently renders hardcoded English text in `HomePage.tsx` (title, description, date, location). It must show the closest upcoming event from WordPress dynamically.

- Convert `src/app/page.tsx` to an `async` server component that calls `getEvents()`.
- Select the event whose `startDate` is closest to and after `Date.now()`.
- Pass the selected `EventContent` as an optional prop to `HomePage`.
- `HomePage` renders the existing featured-event card design using the dynamic data.
- If no upcoming event exists, hide the featured-event section or show a translatable fallback message.
- Event content (title, description, date, location) comes from WordPress, not from locale JSON. UI labels ("Upcoming Event", "Register Now") remain in locale JSON via `react-i18next`.

### Acceptance criteria

- No active page contains `href="#"`.
- No active page uses `alert(...)` for production actions.
- No active page uses Unsplash URLs or other unapproved runtime stock media.
- Required client layout items are represented in active routes.
- Homepage featured event renders the closest upcoming event from WordPress or degrades gracefully when none exist.

---

## 5.1 ~~Work Packet D.2 — Chatbot Contextual Navigation~~ ✅ Completed

> Implemented in commit Packet D.2 execution. Added `title` field to `KBEntry` interface and all 17 existing KB entries for disambiguation. Fixed duplicate candidate buttons (Chatbot.tsx line 493 now uses `entry.title` with dedup via `Set`). Added 6 new KB entries: 3 download entries for rights PDFs, 1 upcoming-events entry, 1 call-Daoud entry (`tel:`), 1 WhatsApp entry. Updated `handleKBAction` to handle external links, `tel:`, PDF downloads, and internal routes. Filled complete Dari and Uzbek translations (keywords + responses) for all 23 KB entries from approved translation docs.

**Goal:** upgrade the chatbot from a section-finder to a contextual navigation assistant that feels professional and integrated with the site.

### Known bugs to fix

- **Duplicate candidate buttons**: when `multiCandidate` is true, `Chatbot.tsx` line 493 uses `actions[0].label` as button text. Multiple entries in the same KB section share the same first action label (e.g., three rights entries all show "Know Your Rights"). Fix: use a unique descriptive title per entry, not `actions[0].label`.
- **Missing deduplication**: candidates with identical labels must be merged or filtered before display.

### Contextual actions

Upgrade the KB and chatbot UI to support richer, site-integrated responses:

- **Downloads**: add KB entries for "download rights in Dari/Uzbek/English" that include direct PDF links rendered as download buttons in the chat bubble.
- **Events**: add a KB entry for "next event" / "upcoming event" that links to `/events` or to the specific event slug when available.
- **Contact shortcuts**: "call Daoud", "WhatsApp" → render clickable `tel:` and WhatsApp links directly in the chat.
- **Section deep links**: "how to apply for asylum" → link to `/immigration` with an anchor or highlight, not just the generic page.

### KB structure improvements

- Add a `title` field to each KB entry for human-readable disambiguation (used in multiCandidate buttons instead of `actions[0].label`).
- Split overlapping entries: `know-your-rights-police`, `know-your-rights-ice`, and `documents` must have distinct titles like "Your rights with police", "If ICE comes to your home", "Carrying documents safely".
- Add entries for downloads: `download-rights-dari`, `download-rights-uzbek`, `download-rights-english`.
- Add entry for "upcoming events" / "next workshop".
- Fill missing `keywords_dari` and `keywords_uzbek` across all entries.
- Fill missing `response_dari` and `response_uzbek` across all entries.

### Acceptance criteria

- No multiCandidate response shows duplicate button labels.
- Asking "download rights in Dari" provides a direct download link or button.
- Asking "next event" or "upcoming workshop" links to the events page or specific event.
- Asking "call" or "WhatsApp" renders a clickable contact link in the chat.
- All KB entries have non-empty `keywords_dari`, `keywords_uzbek`, `response_dari`, and `response_uzbek`.
- Chatbot remains deterministic: local JSON + keyword/scoring only, no LLMs.

---

## 6. ~~Work Packet E — Full i18n, RTL, and Chatbot Routing~~ ✅ Completed

> Implemented in commit Packet E execution. All 11 Dari and Uzbek locale namespaces restructured to match English canonical key structure exactly. Real translations populated from `Website_Layout_Afghan_Immigration_Dari.md` and `Website_Layout_Afghan_Immigration_Uzbek.md`. Missing strings marked `[MT]` for human reviewer attention. RTL wiring verified intact (LanguageProvider, middleware, direction.ts). Chatbot action buttons use real routes. Fixed `immigration-help.json` EN duplicate key. Lint and TypeScript pass. **Language persistence fix** applied across all components: created `src/lib/navigation.ts` with `localizePath()` utility, updated Header, Footer, all page components, EventsClient, and Chatbot to prepend `/dari` or `/uzbek` to internal navigation links. Fixes bug where switching language then navigating to another page would reset to English.

**Goal:** fulfill the current language toggle for English, Dari, and Uzbek. RTL alone is not acceptable; the selected language must change the visible product copy across active routes.

### Current problem to fix

The active route pages currently contain substantial hardcoded English copy. The sub-agent must audit and migrate user-visible copy for:

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/page-views/HomePage.tsx`
- `src/page-views/ImmigrationPage.tsx`
- `src/page-views/RightsPage.tsx`
- `src/page-views/ResourcesPage.tsx`
- `src/features/events/EventsClient.tsx`
- `src/page-views/StoriesPage.tsx`
- `src/page-views/ContactPage.tsx`
- `src/sections/Chatbot.tsx`

### Required changes

- Treat multilingual coverage as P0 launch work for the currently approved language set: EN, Dari, and Uzbek.
- Move active-route visible copy into locale JSON or an equivalent typed local content layer consumed by `react-i18next`.
- Cover at minimum: nav labels, footer copy, page headers, body copy, cards, CTA text, form labels/placeholders/errors, success/error states, resources, events, rights content, download labels, stories/placeholder copy, chatbot labels/actions/responses.
- Proper names, phone numbers, addresses, URLs, and reviewed organization names may remain unchanged.
- Remove placeholder translation prefixes like `[FA]` and `[UZ]` from active locale JSON.
- Keep Dari RTL behavior working through `LanguageProvider`, middleware, and `direction.ts`.
- Update chatbot actions from hash-only targets such as `#contact` to real routes:
  - `/contact`
  - `/immigration`
  - `/rights`
  - `/resources`
  - `/events`
- Keep chatbot deterministic: local JSON + keyword/scoring only.
- Chatbot legal/right responses must include safe educational framing and contact fallback.
- Machine translation may be used only as a draft; production launch remains blocked until fluent/native review confirms Dari and Uzbek.

### Replace placeholder locale translations

The current Dari and Uzbek locale JSON files contain English placeholder text. Replace all namespaces with the approved translations from:

- Dari: `app/docs/Website_Layout_Afghan_Immigration_Dari.md`
- Uzbek: `app/docs/Website_Layout_Afghan_Immigration_Uzbek.md`

Namespaces to update: `about`, `chatbot`, `common`, `contact`, `events`, `hero`, `immigration-help`, `resources`, `rights`, `services`, `testimonials`.

### WordPress event translation strategy

**Decision required before launch.** The CMS adapter already accepts a language parameter (`getEvents(lang)`), but the content authoring workflow must be defined:

- If the client enters events only in English, Dari/Uzbek users will see English event content surrounded by translated UI labels. This may be acceptable for time-sensitive operational content.
- If full event translation is required, add a WordPress multilingual plugin (Polylang) so the client can provide translated versions of each event.
- Regardless of the chosen strategy, the frontend must implement a fallback: when no translated event version exists for a language, display the English version with translated UI labels (category badge, CTA button, date/time formatting).

Document the chosen strategy and communicate it to the client before launch.

### Acceptance criteria

- Switching EN/Dari/Uzbek updates all primary visible copy on every active route.
- Dari updates `html[dir="rtl"]` and layout remains usable.
- No active user-visible path contains `[FA]`, `[UZ]`, or English-only copy except approved proper nouns/contact details.
- Chatbot action buttons navigate to real routes.
- No LLM, embedding, or external chatbot dependency is introduced.
- Human translation review is documented before production launch.
- All locale JSON namespaces contain approved Dari and Uzbek translations, not English placeholders.
- WordPress event translation strategy is documented and communicated to the client.

---

## 7. ~~Work Packet F — Next.js/Vercel Deployment and Security Headers~~ ✅ Completed

> Implemented in `next.config.ts`: dynamic CSP builder (dev vs production), security headers (X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options, X-XSS-Protection), cache headers (immutable for assets, no-store for API routes), WordPress media remote patterns. Revalidation endpoint at `src/app/api/revalidate/route.ts` with secret validation.

### Required changes

Configure `next.config.ts` in the `app/` project root:

- Image remote patterns for `WORDPRESS_MEDIA_HOSTNAME`.
- Security headers for all pages via `async headers()`:
  - `Content-Security-Policy` (including WordPress media domain in `img-src`)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - restrictive `Permissions-Policy`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 0`
- Cache headers:
  - immutable cache for `/assets/*`
  - `no-store` for `/api/contact` and `/api/revalidate`
- Delete legacy `vercel.json` if present; App Router handles routing natively.

### CSP target

Next.js App Router needs a CSP that allows hydration scripts. Keep the production policy explicit and upgrade to nonce/hash-based scripts when security hardening starts.

```txt
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://<WORDPRESS_MEDIA_HOSTNAME>;
media-src 'self';
connect-src 'self';
frame-src https://www.google.com;
form-action 'self';
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
upgrade-insecure-requests
```

Local `next dev` additionally needs `script-src 'unsafe-eval'` and `connect-src ws: wss:` for Turbopack/HMR. Do not copy those dev-only allowances blindly into production.

### Required production env vars

Set these in Vercel Project Settings for Preview and Production:

- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `WORDPRESS_API_BASE_URL`
- `WORDPRESS_REVALIDATE_SECRET`
- `WORDPRESS_MEDIA_HOSTNAME`

Rotate any local Resend key already used before production.

### WordPress setup references

- **WordPress Studio proof:** See `modification_plan.md` Packet D for local CPT and plugin setup.
- **Hostinger production WordPress:** Deploy the `afghan-support-headless` plugin to Hostinger, confirm REST API is public, and configure the ISR webhook to `https://<site>/api/revalidate`.

---

## 8. Work Packet G — Verification and Launch Gate

**Goal:** prove the site is ready without depending on assumptions.

**Code verification status:** All automated checks pass. Manual QA remains pending.

### Allowed verification

Run:

```bash
pnpm lint        # ✅ PASS
pnpm tsc --noEmit # ✅ PASS
```

### Manual QA checklist

- [ ] Desktop navigation works on all routes.
- [ ] Mobile menu opens, closes, and locks body scroll correctly.
- [ ] Language switcher preserves route intent.
- [ ] EN/Dari/Uzbek update all primary visible active-route copy.
- [ ] Dari renders RTL correctly on first paint.
- [ ] Events page fetches from WordPress with graceful fallback when offline.
- [ ] Keyboard-only navigation reaches header, main content, chatbot, form, and footer.
- [ ] Contact form handles success, validation errors, API failure, honeypot, and rate limit.
- [ ] Contact fallback options remain visible when API fails.
- [ ] Rights PDFs open/download correctly in all three active languages (EN, Dari, Uzbek).
- [ ] Events CTAs go to approved registration/contact flows.
- [x] External links use safe attributes. _(verified in code)_
- [x] No fake testimonials remain. _(verified in code — honest placeholder only)_
- [x] No active `href="#"`, `alert(...)`, `[FA]`, `[UZ]`, hardcoded English-only route copy, or Unsplash URLs remain. _(verified in code — 0 occurrences)_
- [ ] Page metadata (title, description, OG tags) renders from WordPress or safe defaults.
- [ ] ISR revalidation endpoint returns 200 with valid secret and 401 without.
- [x] Generated artifacts (`.next/`, `out/`, `*.tsbuildinfo`) are absent from commits. _(verified in .gitignore)_

### Launch blockers

Do not mark production-ready if any of these are missing:

- [ ] Real contact email delivery works.
- [ ] Resend/Upstash env vars exist in the deployment platform.
- [x] Security headers are configured. _(implemented in next.config.ts)_
- [x] Rights PDFs are approved and linked. _(3 PDFs in public/PDFs_Rights/, linked from RightsPage)_
- [ ] Legal/rights content has reviewer approval and last-reviewed date.
- [x] All active route copy is translated for EN/Dari/Uzbek. _(Dari/Uzbek populated; [MT] strings pending human review)_
- [ ] Dari/Uzbek translations have human review or are explicitly marked pending.
- [ ] WordPress REST URL is configured and tested.
- [ ] ISR revalidation secret is configured in Vercel and WordPress.
- [ ] API key used locally has been rotated before production.

---

## 9. Final Handoff Requirements

**Updated: 2026-05-15**

### What shipped

| Packet | Status |
|---|---|
| A — Runtime Cleanup | ✅ Removed legacy files, unused deps, lint fixes |
| B — Real Contact Email Flow | ✅ Zod validation, Resend, honeypot, structured errors |
| C — Production Anti-Abuse | ✅ Upstash Redis sliding window + in-memory fallback |
| D — Client Content Compliance | ✅ PDFs linked, stories wired, homepage WP dynamic |
| D.2 — Chatbot Contextual Navigation | ✅ KB titles, dedup, downloads/events/contact entries, Dari/Uzbek KB translations |
| E — Full i18n + RTL | ✅ 11 locale namespaces restructured, real Dari/Uzbek translations, language persistence fix across all navigation |
| F — Deployment & Security Headers | ✅ CSP, security headers, cache, revalidation endpoint |
| G — Verification | ✅ Automated checks pass (lint, tsc, code scans) |

### What remains blocked by client assets/review

- Dari/Uzbek locale strings marked `[MT]` need human review (native/fluent speakers)
- Legal/rights content needs qualified reviewer sign-off
- WordPress event translation strategy decision (English-only events with translated UI labels vs. Polylang multilingual plugin)

### Env vars required in production

```
NEXT_PUBLIC_SITE_URL
RESEND_API_KEY
RESEND_FROM_EMAIL
CONTACT_TO_EMAIL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
WORDPRESS_API_BASE_URL
WORDPRESS_REVALIDATE_SECRET
WORDPRESS_MEDIA_HOSTNAME
```

### Manual QA still needed

- Browser testing: navigation, language toggle, RTL, keyboard access, contact form E2E
- WordPress connectivity and ISR revalidation
- API key rotation before production

### Key new files this session

| File | Purpose |
|---|---|
| `src/lib/navigation.ts` | Shared `localizePath(path, lang)` — language-aware internal routing |
| `src/locales/dari/*.json` (10 files) | Restructured to EN canonical keys, real Dari translations |
| `src/locales/uzbek/*.json` (10 files) | Restructured to EN canonical keys, real Uzbek translations |
| Updated `chatbot-kb.json` | +6 new entries, +titles field, full Dari/Uzbek keywords+responses |

### Known risks

- **[MT] translations**: Machine-translated strings not covered by approved translation docs. Human review required before accepting as production-quality.
- **WordPress availability**: Homepage featured event and events page depend on WordPress REST API. Graceful fallback hides/messages when unavailable, but the event-dependent features won't show content without WP.
- **In-memory rate limiting**: If Upstash is configured but connection fails, the endpoint falls back to in-memory map. This resets on serverless cold starts.

---

## References

- [OWASP HTTP Security Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [OWASP Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js caching and revalidation](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Upstash Rate Limit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
