# Production Readiness Fix Plan

This project is close, but it is **not production-ready yet**. Agents should fix the blockers below before deploy, then run the allowed verification checks.

## Agent rules

- Use `pnpm`, never `npm`.
- Do **not** run `pnpm run build`.
- Keep changes small and reviewable.
- Do not add AI attribution or `Co-Authored-By`.

## Allowed verification

```bash
pnpm lint
pnpm exec tsc --noEmit --incremental false
# after P1-9 adds a test script:
pnpm test
```

Manual checks still required after code fixes: browser QA, RTL QA, contact form E2E, Lighthouse/accessibility, WordPress REST + ISR webhook, env vars, and key rotation.

---

## P0 blockers

| ID | Problem | Files | Required fix | Acceptance |
|---|---|---|---|---|
| P0-1 | Dari/Uzbek locale files contain visible `[MT]` markers. | `src/locales/dari/*.json`, `src/locales/uzbek/*.json` | Remove `[MT]` only after human/fluent review, or keep launch blocked and clearly mark pending review. | No `[MT]` appears in production UI. |
| P0-2 | Contact rate limiting stores raw phone numbers as keys, violating no-PII policy. | `src/app/api/contact/route.ts` | Hash normalized phone before using it as an Upstash/in-memory rate-limit key. | No raw phone appears in Redis/in-memory keys. |
| P0-3 | `[lang]` routes accept invalid language params by casting `lang as LangCode`. | `src/app/[lang]/**/page.tsx` | Validate with `isValidLang(lang)` and call `notFound()` for invalid values. | `/foo`, `/foo/contact`, etc. do not render valid pages. |
| P0-4 | ISR webhook revalidates paths but does not clear custom CMS cache. | `src/app/api/revalidate/route.ts`, `src/server/cms/cms-cache.ts` | Call `clearCmsCache()` during successful revalidation; revisit dynamic event slug revalidation strategy. | WordPress update + webhook refreshes visible event/metadata content. |
| P0-5 | Event detail renders WordPress HTML without app-side sanitization. | `src/app/events/[slug]/page.tsx`, `src/app/[lang]/events/[slug]/page.tsx` | Sanitize/allowlist WordPress HTML before `dangerouslySetInnerHTML`, or constrain trusted HTML server-side. | Unsafe tags/attributes cannot render executable HTML. |
| P0-6 | Contact phone is inconsistent: chatbot references `+1 (602) 666-6170`; site uses `480.416.2333`. | `src/locales/*/chatbot.json`, `src/locales/*/common.json`, `src/data/chatbot-kb.json` | Replace stale phone with approved contact number. | One canonical phone number across UI/chatbot. |
| P0-7 | Rights page has `lastReviewed` locale key but does not render it. | `src/pages/RightsPage.tsx`, `src/locales/*/rights.json` | Render `lastReviewed` near the legal disclaimer. | Legal content visibly shows review date. |
| P0-8 | WordPress plugin metabox save lacks capability checks. | `../wordpress-plugin/afghan-support-headless.php` | Add `current_user_can('edit_post', $post_id)` before saving metadata. | Unauthorized users cannot save plugin meta fields. |
| P0-9 | `/en/*` can become a duplicate English route if `[lang]` validation accepts every `LangCode`. | `src/app/[lang]/**/page.tsx`, `src/domain/language.ts`, `src/proxy.ts` | Treat `[lang]` routes as localized-only (`dari`, `uzbek`) or redirect `/en/*` to the canonical English path. Do not allow duplicate English pages under `/en`. | `/en/contact`, `/en/events`, etc. redirect to `/contact`, `/events`, etc. or return 404; canonical metadata stays English-root only. |
| P0-10 | Chatbot KB multi-candidate titles and action labels are English-only in Dari/Uzbek flows. | `src/data/chatbot-kb.json`, `src/lib/matchKeywords.ts`, `src/sections/Chatbot.tsx`, `src/locales/*/chatbot.json` | Add localized KB title/action fields or map KB action labels through locale keys before rendering. | Dari/Uzbek chatbot responses, candidate buttons, and action buttons contain no English-only UI labels except proper nouns/approved terms. |
| P0-11 | ISR webhook includes dynamic paths like `/events/[slug]` without passing the required `type` argument. | `src/app/api/revalidate/route.ts` | For dynamic route patterns, call `revalidatePath(path, 'page')`; for specific URLs, call `revalidatePath(path)` normally. Keep this with the `clearCmsCache()` fix. | Webhook revalidates static and dynamic event routes without runtime revalidation errors. |

---

## P1 quality fixes

| ID | Problem | Files | Required fix |
|---|---|---|---|
| P1-1 | Event dates/calendar labels still force `en-US` in several places. | `src/features/events/EventsClient.tsx`, `src/server/cms/wordpress.mappers.ts`, `src/pages/HomePage.tsx` | Centralize locale-aware date/time formatting by `LangCode`. |
| P1-2 | Event detail pages duplicate markup and hardcode English labels like `Date:` / `Location:`. | `src/app/events/[slug]/page.tsx`, `src/app/[lang]/events/[slug]/page.tsx` | Extract shared event detail component and localize labels. |
| P1-3 | README is stale and still says Vite/npm/backend none. | `README.md` | Rewrite for current Next.js + pnpm + WordPress/Resend/Upstash stack. |
| P1-4 | Static sitemap only includes home. | `public/sitemap.xml` or App Router sitemap route | Add core routes and multilingual alternates, ideally via dynamic `sitemap.ts`. |
| P1-5 | Story cards are clickable articles, not keyboard-accessible controls. Videos lack captions. | `src/pages/StoriesPage.tsx` | Use buttons/links with keyboard support, modal semantics, Escape handling, and captions/tracks when available. |
| P1-6 | Unused/stale files remain. | See list below | Delete or archive after confirming no product need. |
| P1-7 | Font setup is inconsistent: Playfair is configured but not imported; Cormorant is imported but not configured. | `src/lib/i18n.ts`, `tailwind.config.js`, `package.json` | Choose one display font and align imports/dependencies. |
| P1-8 | shadcn config has stale paths/aliases. | `components.json` | Fix `tailwind.config` path and remove/restore missing aliases like `@/lib/utils`. |
| P1-9 | No automated regression tests or `test` script exist. | `package.json`, `src/lib/**`, focused extracted helpers from API/sanitizer code | Add a minimal test harness and focused tests for deterministic logic: chatbot scoring, localized route helper, phone fingerprint/hash helper, and HTML sanitizer. | `pnpm test`, `pnpm lint`, and `pnpm exec tsc --noEmit --incremental false` pass. |

---

## Candidate unused files

Verify once more before deleting:

- `src/pages/EventsPage.tsx`
- `src/i18n/dictionaries.ts`
- `src/server/cms/wordpress.types.ts`
- `src/data/events.json`
- `src/data/events.dari.json`
- `src/data/events.uzbek.json`
- `src/data/resources.json`
- `src/data/resources.dari.json`
- `src/data/resources.uzbek.json`
- `src/data/testimonials.json`
- `src/data/testimonials.dari.json`
- `src/data/testimonials.uzbek.json`

## Final production gate

Production-ready means all of this is true:

- [ ] P0 blockers fixed.
- [ ] `pnpm lint` passes.
- [ ] `pnpm exec tsc --noEmit --incremental false` passes.
- [ ] `pnpm test` passes after the test harness is added.
- [ ] Browser QA passes for EN, Dari RTL, and Uzbek.
- [ ] `/foo/*` and `/en/*` cannot render duplicate valid localized pages.
- [ ] Contact form works with production Resend + Upstash.
- [ ] WordPress REST production URL works.
- [ ] ISR webhook works with valid/invalid secrets.
- [ ] Chatbot KB labels/actions are localized for Dari and Uzbek.
- [ ] Legal/rights content has reviewer approval.
- [ ] Dari/Uzbek translations have human/fluent review.
- [ ] Lighthouse/accessibility checks meet PRD targets.
- [ ] Local/API keys used during development are rotated before launch.
