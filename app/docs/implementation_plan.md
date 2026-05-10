# Implementation Plan — Afghan Support Phoenix Production Closure

This is the execution plan to finish Afghan Support Phoenix for production from the current `app/` codebase. It replaces the old post-cleanup checklist with a sub-agent-ready plan focused on runtime cleanup, real email delivery, security, resilience, content compliance, and launch verification.

**Source of truth:** `app/docs/PRD_Afghan_Support_Realistic.md`  
**Client input:** `app/docs/Website_Layout_Afghan_Immigration.md`  
**Default deployment target:** Vercel, with `app/` as the project root  
**Default email provider:** Resend  
**Default production rate limit store:** Upstash Redis

---

## 0. Execution Rules

1. Do not rebuild the website from scratch.
2. Preserve the current visual direction: institutional, warm, simple, accessible.
3. Do not run `npm run build` unless the maintainer explicitly authorizes it.
4. Do not add generative AI, LLMs, embeddings, external chatbot APIs, auth, CMS, database persistence, booking, donations, or blog/news features.
5. Do not store PII in localStorage, analytics, logs, a database, or static files.
6. Verify claims against code before checking any task as done.
7. Keep each work packet small enough for review; prefer one sub-agent per bounded area.

---

## 1. Current State to Preserve

The active app is the Vite/React app under `app/`.

| Area | Current anchor |
|---|---|
| Entry | `src/main.tsx` |
| Routes | `src/App.tsx` lazy page routes |
| Layout | `src/components/Layout.tsx` |
| Header/Footer | `src/components/Header.tsx`, `src/components/Footer.tsx` |
| Active pages | `src/pages/HomePage.tsx`, `ImmigrationPage.tsx`, `RightsPage.tsx`, `ResourcesPage.tsx`, `EventsPage.tsx`, `StoriesPage.tsx`, `ContactPage.tsx` |
| Chatbot | `src/sections/Chatbot.tsx` + `src/data/chatbot-kb.json` |
| Contact API | `api/contact.ts` |
| Styling | Tailwind + `src/index.css` |

Do not restore removed design-reference folders. The deleted `app/docs/stitch_design/**` files are not runtime dependencies.

---

## 2. Work Packet A — Runtime Cleanup and Dependency Hygiene

**Goal:** remove code that can confuse tooling, lint, and future maintenance without deleting data that still needs migration decisions.

### Required changes

- Delete unreachable runtime files:
  - `src/App.css`
  - `src/pages/Home.tsx`
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
  - `kimi-plugin-inspect-react` from `vite.config.ts`, `package.json`, and lockfile
  - `tw-animate-css` from `package.json` and lockfile if unused
- Fix active lint issue in `src/components/Header.tsx` without changing navigation behavior.

### Acceptance criteria

- No active imports point to deleted files.
- `npm run lint` has no errors caused by deleted legacy code or `Header.tsx`.
- No visual/routing behavior is intentionally changed in this packet.

---

## 3. Work Packet B — Real Contact Email Flow

**Goal:** make the contact form send real emails safely without persisting PII.

### Frontend contract

Update `src/pages/ContactPage.tsx` to submit to `POST /api/contact`.

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

## 4. Work Packet C — Production Anti-Abuse and Resilience

**Goal:** protect the one real backend surface: `/api/contact`.

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

## 5. Work Packet D — Client Content Compliance

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
  - Pashto
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

### Acceptance criteria

- No active page contains `href="#"`.
- No active page uses `alert(...)` for production actions.
- No active page uses Unsplash URLs or other unapproved runtime stock media.
- Required client layout items are represented in active routes.

---

## 6. Work Packet E — Full i18n, RTL, and Chatbot Routing

**Goal:** fulfill the client-requested language toggle. RTL alone is not acceptable; the selected language must change the visible product copy across active routes.

### Current problem to fix

The active route pages currently contain substantial hardcoded English copy. The sub-agent must audit and migrate user-visible copy for:

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/ImmigrationPage.tsx`
- `src/pages/RightsPage.tsx`
- `src/pages/ResourcesPage.tsx`
- `src/pages/EventsPage.tsx`
- `src/pages/StoriesPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/sections/Chatbot.tsx`

### Required changes

- Treat multilingual coverage as P0 launch work because `Website_Layout_Afghan_Immigration.md` explicitly requires `Language Toggle: EN | Dari | Pashto | Uzbek`.
- Move active-route visible copy into locale JSON or an equivalent typed local content layer consumed by `react-i18next`.
- Cover at minimum: nav labels, footer copy, page headers, body copy, cards, CTA text, form labels/placeholders/errors, success/error states, resources, events, rights content, download labels, stories/placeholder copy, chatbot labels/actions/responses.
- Proper names, phone numbers, addresses, URLs, and reviewed organization names may remain unchanged.
- Remove placeholder translation prefixes like `[FA]`, `[PS]`, `[UZ]` from active locale JSON.
- Keep Dari and Pashto RTL behavior working through `LanguageProvider` and `direction.ts`.
- Update chatbot actions from hash-only targets such as `#contact` to real routes:
  - `/contact`
  - `/immigration`
  - `/rights`
  - `/resources`
  - `/events`
- Keep chatbot deterministic: local JSON + keyword/scoring only.
- Chatbot legal/right responses must include safe educational framing and contact fallback.
- Machine translation may be used only as a draft; production launch remains blocked until fluent/native review confirms Dari, Pashto, and Uzbek.

### Acceptance criteria

- Switching EN/Dari/Pashto/Uzbek updates all primary visible copy on every active route.
- Dari/Pashto update `html[dir="rtl"]` and layout remains usable.
- No active user-visible path contains `[FA]`, `[PS]`, `[UZ]`, or English-only copy except approved proper nouns/contact details.
- Chatbot action buttons navigate to real routes.
- No LLM, embedding, or external chatbot dependency is introduced.
- Human translation review is documented before production launch.

---

## 7. Work Packet F — Vercel Deployment and Security Headers

**Goal:** prepare production deployment with a safe static CDN + serverless API setup.

### Required changes

Create `vercel.json` in the `app/` project root.

Configuration must include:

- SPA fallback to `index.html` for deep links.
- Security headers for all pages:
  - `Content-Security-Policy`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - restrictive `Permissions-Policy`
  - `Strict-Transport-Security` only after HTTPS/domain is verified
- Cache headers:
  - immutable cache for hashed Vite assets
  - no-store for `/api/contact`

### CSP target

Start with this production target and adjust only when code proves a directive is required:

```txt
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
media-src 'self';
connect-src 'self';
frame-src https://www.google.com;
form-action 'self';
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
upgrade-insecure-requests
```

If Google Maps embed remains, keep `frame-src https://www.google.com`. If it is replaced with a link/static map, remove `frame-src`.

### Required production env vars

Set these in Vercel Project Settings for Preview and Production:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Rotate any local Resend key already used before production.

---

## 8. Work Packet G — Verification and Launch Gate

**Goal:** prove the site is ready without depending on assumptions.

### Allowed verification

Run:

```bash
npm run lint
```

Do **not** run:

```bash
npm run build
```

unless the maintainer explicitly overrides the project rule.

### Manual QA checklist

- [ ] Desktop navigation works on all routes.
- [ ] Mobile menu opens, closes, and locks body scroll correctly.
- [ ] Language switcher preserves route intent.
- [ ] EN/Dari/Pashto/Uzbek update all primary visible active-route copy.
- [ ] Dari and Pashto render RTL correctly.
- [ ] Keyboard-only navigation reaches header, main content, chatbot, form, and footer.
- [ ] Contact form handles success, validation errors, API failure, honeypot, and rate limit.
- [ ] Contact fallback options remain visible when API fails.
- [ ] Rights PDFs open/download correctly in all four languages.
- [ ] Events CTAs go to approved registration/contact flows.
- [ ] External links use safe attributes.
- [ ] No fake testimonials remain.
- [ ] No active `href="#"`, `alert(...)`, `[FA]`, `[PS]`, `[UZ]`, hardcoded English-only route copy, or Unsplash URLs remain.

### Launch blockers

Do not mark production-ready if any of these are missing:

- Real contact email delivery works.
- Resend/Upstash env vars exist in the deployment platform.
- Security headers are configured.
- Rights PDFs are approved and linked.
- Legal/rights content has reviewer approval and last-reviewed date.
- All active route copy is translated for EN/Dari/Pashto/Uzbek.
- Dari/Pashto/Uzbek translations have human review or are explicitly marked pending.
- API key used locally has been rotated before production.

---

## 9. Final Handoff Requirements

When all packets are complete, update this document or a short handoff note with:

- What shipped.
- What remains blocked by client assets/review.
- Which env vars must exist in production.
- Which manual QA checks passed.
- Known risks and fallback contact path.

---

## References

- [OWASP HTTP Security Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [OWASP Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [Vercel Vite deployment](https://vercel.com/docs/frameworks/vite)
- [Vercel `vercel.json`](https://vercel.com/docs/project-configuration/vercel-json)
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Upstash Rate Limit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
