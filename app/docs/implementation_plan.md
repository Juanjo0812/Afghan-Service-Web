# Implementation Plan — Afghan Support Phoenix

This plan starts **after** completing `app/docs/modification_plan.md`.
It is not a rebuild-from-scratch plan: it is the plan to finish the website from
the cleaned codebase, preserving what works and completing the active PRD’s
remaining items.

**Source of truth**: `app/docs/PRD_Afghan_Support_Realistic.md`  
**Client input**: `app/docs/Website_Layout_Afghan_Immigration.md`

---

## Execution Principle

1. Do not rewrite the website from scratch.
2. Do not add features that are not in the active PRD.
3. Do not make the chatbot “intelligent”; it must remain deterministic.
4. Do not store PII.
5. Do not run build unless the maintainer explicitly authorizes it.
6. Verify claims against code before marking anything as done.

---

## Phase 0 — Post-Cleanup Gate

Before implementing pending work:

- [ ] `useLenis` removed from `src/App.tsx`.
- [ ] No imports remain for `gsap`, `@gsap/react`, `framer-motion`, or `lenis`.
- [ ] Animations replaced with Tailwind/native CSS.
- [ ] `package.json` does not keep removed unused dependencies.
- [ ] The site preserves navigation, contact, chatbot, i18n, and current sections.
- [ ] `npm run dev` works for manual review.

> If this gate fails, go back to `modification_plan.md`. Do not move into new
> features on top of an over-engineered foundation.

---

## Phase 1 — Client Layout Compliance

Goal: ensure every item from `Website_Layout_Afghan_Immigration.md` has a real
representation on the page.

- [ ] Home: hero, quick access, about snapshot, featured event, and CTA.
- [ ] Immigration Help: 5 required services and a visible Daoud contact block.
- [ ] Know Your Rights: police/agents, ICE at home, documents.
- [ ] Downloads: PDFs in English, Dari, Pashto, and Uzbek.
- [ ] Community Resources: English classes, mental health, food, health clinics.
- [ ] Events: workshops, legal clinics, cultural gatherings, Afghan holidays.
- [ ] Contact: form + WhatsApp + phone + email + address/map.
- [ ] Stories/Impact: testimonials or an honest placeholder if assets are missing.

Deliverable: updated compliance checklist against the PRD.

---

## Phase 2 — Real Content and Editorial Review

Goal: replace placeholders with approved content.

- [ ] Confirm phone, email, address, and hours.
- [ ] Confirm featured event and upcoming events.
- [ ] Confirm real external resources and safe links.
- [ ] Load approved Know Your Rights PDFs.
- [ ] Confirm approved videos/testimonials.
- [ ] Add legal disclaimer and last-reviewed date.
- [ ] Complete human review of Dari/Pashto/Uzbek translations.

Do not publish legal or immigration content without review. We do not improvise
here: in immigration, a badly worded sentence can cause harm.

---

## Phase 3 — Production, Security, and Resilience

Goal: make sure the website does not depend on fragile assumptions.

- [ ] Choose deployment platform: Vercel, Netlify, or Cloudflare Pages.
- [ ] Configure HTTPS, redirects, and SPA fallback for the chosen platform.
- [ ] Configure CSP/security headers.
- [ ] Validate that API keys exist only in server-side environment variables.
- [ ] Harden `/api/contact`:
  - server-side validation
  - sanitization
  - honeypot
  - production rate limit
  - email provider quota/error handling
- [ ] Decide whether to add Turnstile/hCaptcha if real spam appears.

Note: in-memory rate limiting works as a first layer, but it is not enough as a
production guarantee in serverless. For something stronger, use provider/CDN
rate limiting or shared storage such as KV/Redis/Upstash.

---

## Phase 4 — Accessibility, Performance, and SEO

Goal: validate that the website works for real users, not just on our monitor.

- [ ] Mobile review on small screen sizes.
- [ ] Keyboard-only review.
- [ ] RTL review in Dari/Pashto.
- [ ] Minimum 44x44px tap targets.
- [ ] WCAG AA contrast.
- [ ] Lazy-loaded videos/maps or lightweight fallback.
- [ ] Optimized images.
- [ ] SEO metadata, OG tags, sitemap/robots if applicable.
- [ ] Documented Lighthouse/manual audit.

We do not need to chase artificial perfection, but we must avoid basic mistakes
that hurt vulnerable users directly.

---

## Phase 5 — MVP Closure

Goal: leave a clear deliverable for stakeholder review.

- [ ] Active PRD updated.
- [ ] Modification plan marked as completed or archived.
- [ ] Remaining backlog classified as P0/P1/P2.
- [ ] Launch checklist complete or explicit risks documented.
- [ ] Short handoff: what is ready, what remains, what needs approval.

---

## Out of This Implementation

- Generative AI.
- Database.
- Login/admin panel.
- Booking system.
- Donations.
- Blog/news.
- Full rebuild in another framework.
