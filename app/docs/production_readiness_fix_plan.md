# Remaining Production Readiness Checklist

This file now lists **only the items still needing review or correction** after the OpenCode production-readiness pass.

## Agent rules

- Use `pnpm`, never `npm`.
- Do **not** run `pnpm run build`.
- Keep changes small and reviewable.
- Do not add AI attribution or `Co-Authored-By`.

---

## Remaining code/content fixes

| Priority | Problem | Files | Required fix | Acceptance |
|---|---|---|---|---|
| P0 | Public Dari/Uzbek UI still contains visible `[MT]` markers. | `src/locales/dari/*.json`, `src/locales/uzbek/*.json` | Remove the literal `[MT]` prefix from rendered strings. Track machine-translation / pending-review status internally, not in public UI copy. | No `[MT]` appears in production UI or runtime locale files. |
| P0 | `/en/*` can still render duplicate English pages. | `src/lib/routeGuard.ts`, `src/domain/language.ts`, `src/proxy.ts`, `src/app/[lang]/**/page.tsx` | `[lang]` routes must accept only localized prefixes: `dari` and `uzbek`. Redirect `/en/*` to the canonical English path or return 404. | `/en/contact`, `/en/events`, etc. do not render duplicate pages; `/dari/*` and `/uzbek/*` still work. |
| P0 | Event time labels still hardcode `en-US`. | `src/server/cms/wordpress.mappers.ts`, `src/lib/formatDate.ts`, event UI files | Make event date/time labels locale-aware by `LangCode`, or stop formatting localized labels inside the WordPress mapper and format them at render time. | No runtime `toLocaleString('en-US')` / `toLocaleDateString('en-US')` remains except inside the English locale map. |
| P1 | shadcn config points to missing `@/lib/utils`. | `components.json`, `src/lib/utils.ts` | Either create the expected `src/lib/utils.ts` helper or remove/fix the stale alias. | shadcn aliases resolve cleanly; no config points to missing files. |
| P1 | Stories video captions are unresolved. | `src/pages/StoriesPage.tsx`, `public/videos/**` | If caption files exist, add `<track>` elements. If captions are not available yet, remove hidden TODOs and document the launch exception clearly. | No hidden caption TODO remains; accessibility decision is explicit. |

---

## Manual production checks still required

These are not code refactors, but production should not be approved until they pass:

- [ ] Browser QA for English, Dari RTL, and Uzbek.
- [ ] Contact form E2E with production Resend + Upstash.
- [ ] WordPress REST production URL works.
- [ ] ISR webhook works with valid and invalid secrets.
- [ ] Lighthouse/accessibility checks meet PRD targets.
- [ ] Legal/rights content is approved by the reviewer.
- [ ] Local/API keys used during development are rotated before launch.

## Verification after fixes

```bash
pnpm lint
pnpm exec tsc --noEmit --incremental false
pnpm test
```
