# PRD — Afghan Support Phoenix (Realistic Production Version)

**Product**: Afghan Support — Community Resource Website  
**Version**: 3.1 — production closure alignment  
**Date**: 2026-05-10  
**Status**: Active PRD  
**Source input**: `app/docs/Website_Layout_Afghan_Immigration.md`

This is the only active PRD for the project. Older PRDs were moved to
`app/docs/archive/` and must be treated as historical context only.

---

## 1. Executive Summary

Afghan Support Phoenix is a public, mostly static, multilingual website for
Afghan families in Phoenix, Arizona. It centralizes immigration assistance,
Know Your Rights information, community resources, events, contact options, and
community impact stories.

The product should feel institutional, warm, simple, and trustworthy. It must
prioritize accessibility, legal safety, maintainability, and fast loading over
complex visual effects.

The chatbot is a value-added feature discussed outside the original client
layout. It is allowed only as a deterministic helper that selects curated local
JSON responses. It must not generate legal advice.

---

## 2. Product Decisions

| Area | Decision |
|---|---|
| App model | Static-first React SPA with language-aware routes |
| Main goal | Help users quickly find trusted support and contact staff |
| Content model | Curated static content and local JSON files |
| Multilingual coverage | Language toggle must update all primary visible page content, not only `html.dir` |
| Legal content | Static, reviewed, and not dynamically generated |
| Contact data | Sent by email only; not persisted in app storage or database |
| Chatbot | Deterministic keyword/scoring match from local JSON only |
| AI/LLMs | Out of scope and prohibited for chatbot/legal answers |
| Visual approach | Simple, accessible, no scroll hijacking or heavy animation |
| Active implementation path | Run `modification_plan.md` first, then continue with `implementation_plan.md` |

---

## 3. Goals and Non-Goals

### Goals

1. Give Afghan families a clear path to immigration help and urgent contact.
2. Provide Know Your Rights content in a legally safe, reviewed format.
3. Support English, Dari, Pashto, and Uzbek, including RTL for Dari/Pashto.
4. Keep the site fast and usable on mobile devices and limited connections.
5. Keep operations simple enough for a small team to maintain.

### Non-Goals

- User accounts or authentication.
- Database persistence for contact submissions.
- CMS/admin panel for MVP.
- AI chatbot, embeddings, LLMs, or external chatbot APIs.
- Online booking/reservation system.
- Dynamic legal advice.
- Donation/payment flow.
- Blog/news system requiring editorial maintenance.

---

## 4. Target Users

| User | Need |
|---|---|
| Afghan families in Phoenix | Find immigration help, rights information, resources, events, and contact options in a familiar language |
| Community leaders/volunteers | Refer families to trusted services quickly |
| Staff/partner organizations | Receive contact requests without managing a complex backend |
| Legal/community reviewers | Verify that public information is safe, accurate, and scoped |

Key constraints: users may have limited digital literacy, may be mobile-first,
may use lower-end devices, and may be under emotional/legal stress.

---

## 5. Client Requirement Compliance Matrix

| Client request | Product implementation | Priority | Status |
|---|---|---:|---|
| Header with logo/menu/language toggle/CTA | Navigation with page links, language switcher, Get Help Now CTA | P0 | Required |
| Language toggle EN/Dari/Pashto/Uzbek | All active route copy, form labels, CTA text, chatbot labels, validation messages, and legal/resource/event/story content must change language; Dari/Pashto must also use RTL | P0 | Required before launch |
| Home hero | Welcome message, family image/video fallback, clear CTA | P0 | Required |
| Quick access icons | Four large buttons: Immigration, Rights, Resources, Events | P0 | Required |
| About snapshot | Short institutional support statement | P0 | Required |
| Announcements/events preview | Highlight next important event | P1 | Required |
| Immigration Help page/section | Static service cards/list for asylum, work permit, TPS, green card/family reunification, Afghan Adjustment Act | P0 | Required |
| Contact block for Daoud | Phone, email, hours, office, Request a Call Back | P0 | Required |
| Know Your Rights | Police/immigration agents, ICE at home, documents | P0 | Required |
| Rights downloads | PDF cards in English, Dari, Pashto, Uzbek | P0 | Required before launch |
| Videos section | Community leaders and client experience videos | P1 | Needed if assets are provided |
| Community resources | English classes, mental health, food banks, health clinics | P0 | Required |
| Events calendar | Simple upcoming events list; no heavy booking system | P1 | Required |
| Contact page | Name, phone, question/message form + quick contact links | P0 | Required |
| WhatsApp/phone/email/maps | Direct links and address/map | P0 | Required |
| Stories/community impact | Simple testimonial/video grid or cards | P1 | Required if assets are provided |
| Chatbot | Deterministic helper from curated JSON | P2 | Value add, not from original layout |

---

## 6. Functional Scope

### 6.1 Home / Welcome

- Header with logo, menu, language toggle, and CTA.
- Language toggle is functional only when all active-route visible copy changes language; RTL alone is not enough.
- Hero with high-contrast headline and subtext.
- Static image or single optimized video only; no parallax layers.
- Quick access buttons for the four main tasks.
- Short about snapshot and featured event.

### 6.2 Immigration Help

- Explain free and confidential immigration assistance.
- Include five service areas:
  - Asylum applications
  - Work permit assistance
  - TPS
  - Green card and family reunification
  - Afghan Adjustment Act assistance
- Include direct contact block for Daoud and office hours.
- CTA: Request a Call Back → contact form.

### 6.3 Know Your Rights

- Static, reviewed content only.
- Three required scenarios:
  - Interacting with police or immigration agents
  - If ICE comes to your home
  - Carrying/storing documents safely
- PDF downloads in all target languages.
- Legal disclaimer and “last reviewed” date.

### 6.4 Community Resources

- Four required categories from the client layout:
  - English classes
  - Mental health and wellness
  - Food banks
  - Health clinics
- Prefer local JSON data so updates are isolated from component logic.
- External links must open safely with `rel="noopener noreferrer"`.

### 6.5 Events

- Simple list/card view for upcoming workshops, legal clinics, cultural events,
  and Afghan holidays.
- No booking engine in MVP.
- If registration is needed, link to approved external registration/contact.

### 6.6 Contact

- Form fields: name, phone, email if used by current implementation, and
  question/message.
- Submit to serverless email endpoint or approved provider.
- Do not store form submissions in localStorage, database, or analytics.
- Provide WhatsApp, phone, email, office address, and map/location.

### 6.7 Stories / Community Impact

- Show client/community leader testimonials only when approved assets exist.
- Avoid social-media-style complexity.
- Video embeds must be lazy-loaded or lightweight.

### 6.8 Deterministic Chatbot

- Floating widget.
- Quick actions for Immigration Help, Rights, Resources, Events, Contact, and
  Speak to Someone.
- Free-text input maps to curated responses through deterministic scoring.
- Responses must come from local JSON only.
- Must include fallback contact path when no match is found.

### 6.9 Multilingual Content Coverage

- The client-requested language toggle is P0 functionality, not decorative UI.
- Every active route must support English, Dari, Pashto, and Uzbek for primary visible text:
  - navigation, footer, page headings, section body copy, CTA text, form labels, validation messages, event/resource/story labels, rights content, downloads, and chatbot UI/actions.
- Proper names, phone numbers, addresses, organization names, URLs, and legally approved document titles may remain unchanged when appropriate.
- Dari and Pashto must set RTL direction and remain visually usable.
- Machine translation may be used only as a draft; launch requires fluent/native human review for Dari, Pashto, and Uzbek.
- If any active page remains English-only, the language toggle cannot be considered complete.

---

## 7. User Stories

| ID | Story | Acceptance Criteria |
|---|---|---|
| US-01 | As an Afghan family member, I want to switch to Dari, Pashto, or Uzbek so I can understand the site. | Language switch updates all primary visible route text, chatbot labels/actions, form labels/errors, and legal/resource/event content; Dari/Pashto also set RTL direction. |
| US-02 | As a user needing immigration help, I want a clear “Get Help Now” path. | CTA scrolls/navigates to contact and contact options are visible. |
| US-03 | As a user worried about ICE/police interaction, I want quick rights information. | Know Your Rights section is readable, static, and has downloads. |
| US-04 | As a community volunteer, I want to share resource categories. | Resources are grouped clearly and links/contact details are easy to copy or tap. |
| US-05 | As staff, I want contact requests by email without managing accounts. | Serverless email works, validates inputs, and does not persist PII. |
| US-06 | As a user unsure where to go, I want the chatbot to guide me safely. | Chatbot suggests curated answers/sections and never generates new legal advice. |

---

## 8. Primary Navigation Flows

```text
Home → Get Help Now → Contact form / WhatsApp / Phone
Home → Language toggle → RTL page → Rights or Immigration Help
Home → Quick Access → Immigration Help / Rights / Resources / Events
Chatbot → curated response → section link or Contact
Know Your Rights → PDF download → Contact for assistance
Events → event details → registration/contact path if required
```

---

## 9. Data and Content Model

| Content | Storage | Notes |
|---|---|---|
| UI translations | Local locale JSON files | EN, Dari, Pashto, Uzbek; must cover all active routes, not only legacy sections |
| Events | Local JSON or typed constants | Easy to update without touching layout |
| Resources | Local JSON | Include category, title, description, link/contact |
| Testimonials | Local JSON | Only approved names/assets |
| Chatbot KB | `src/data/chatbot-kb.json` | Curated responses only |
| Contact submissions | Email provider/serverless only | No database persistence |
| PDFs/videos/images | Public assets or approved embeds | Must be reviewed and optimized |

---

## 10. Technical Architecture

| Layer | Decision |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS with native CSS transitions |
| Routing | SPA section navigation / language-aware route prefix |
| i18n | `react-i18next` with local resources |
| RTL | Dynamic `document.documentElement.dir` for Dari/Pashto |
| Forms | `react-hook-form` + `zod`, server-side validation too |
| Email | Resend or approved provider through serverless endpoint |
| Hosting | Static CDN + serverless function for contact |
| Analytics | Privacy-first only, if approved; no PII capture |

### Deployment Decision Needed

Choose one platform before production hardening:

| Option | Tradeoff |
|---|---|
| Vercel | Easiest fit for current `app/api/contact.ts`; serverless functions are straightforward. |
| Netlify | Good static hosting and functions; endpoint structure may need adjustment. |
| Cloudflare Pages | Strong CDN/security posture; contact endpoint likely needs Workers adaptation. |

---

## 11. Non-Functional Requirements

### Accessibility

- Target WCAG AA.
- Minimum 44x44px tap targets.
- Visible focus states.
- Skip-to-content link.
- No scroll hijacking.
- Respect `prefers-reduced-motion`.
- Use semantic headings and labels.

### Performance

- Static-first delivery via CDN.
- Avoid unnecessary JS animation libraries.
- Optimize image/video assets.
- Lazy-load non-critical videos/maps.
- Keep initial bundle small.

Targets:

| Metric | Target |
|---|---:|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | ≥ 90 |
| LCP | < 2.5s on reasonable mobile network |
| Slow 3G load | Usable under 5s where practical |

### SEO

- Descriptive title/meta.
- Open Graph tags.
- Structured organization data.
- Sitemap/robots where deploy supports it.
- Language-aware metadata if feasible in SPA.

---

## 12. Security, Privacy, and Reliability

### Core Rules

- HTTPS required.
- No API keys in frontend.
- Validate and sanitize all form input server-side.
- Do not store PII in localStorage, analytics, logs, or a database.
- Add CSP/security headers in deployment config.
- Use safe external links.

### Contact Endpoint Risk

The mostly static website can handle high traffic well through CDN. The real
operational bottleneck is the contact endpoint and email provider quota.

| Risk | Required Mitigation |
|---|---|
| Spam submissions | Honeypot + server-side validation + rate limiting |
| Serverless instance resets | Do not rely on in-memory rate limit for production-grade protection |
| Provider quota exhaustion | Monitor provider quota; set alerting/fallback contact path |
| Abuse from repeated IPs | Use platform rate limiting, KV/Redis/Upstash, or WAF rule |
| Bots bypassing honeypot | Consider Cloudflare Turnstile/hCaptcha if spam appears |

MVP can start with lightweight protections, but production should prefer
provider/CDN-level rate limiting or shared storage for rate-limit state.

---

## 13. Legal and Editorial Safety

- Know Your Rights and immigration content must be reviewed before launch.
- Add visible disclaimer:

> This information is for educational purposes only and does not constitute
> legal advice. For legal assistance, please contact an immigration attorney or
> an approved legal service provider.

- Add “Last reviewed” date to legal content.
- Translation review must be done by fluent/native reviewers, not only machine
  translation.
- Chatbot responses must be reviewed with the same standard as page content.

---

## 14. Prioritized Backlog

| Priority | Item | Notes |
|---|---|---|
| P0 | Finish cleanup from `modification_plan.md` | Remove GSAP/Lenis/Framer path before feature work |
| P0 | Confirm deploy platform | Needed for headers, API, rate limiting |
| P0 | Legal disclaimer and review date | Required for rights/legal sections and chatbot |
| P0 | Real contact email flow | Validate env vars, sender, recipient, fallback |
| P0 | Full multilingual coverage | All active route text changes for EN/Dari/Pashto/Uzbek; RTL for Dari/Pashto |
| P0 | Client requirement compliance pass | Verify every original layout item is represented |
| P1 | Rights PDFs in 4 languages | Must use approved files |
| P1 | Production anti-spam/rate-limit hardening | Shared store/CDN/WAF preferred |
| P1 | Translation review | Dari/Pashto/Uzbek human review |
| P1 | Resource/event data cleanup | Real links, phone numbers, dates |
| P1 | Accessibility and mobile QA | RTL, keyboard, tap targets |
| P2 | Videos/testimonials polish | Only if approved assets exist |
| P2 | Privacy-first analytics | Only if stakeholder approves |

---

## 15. Launch Checklist

- [ ] One active PRD confirmed: this file.
- [ ] Old PRDs remain archived, not active.
- [ ] `modification_plan.md` completed.
- [ ] `implementation_plan.md` reflects post-cleanup reality.
- [ ] Legal/rights content reviewed by qualified reviewer.
- [ ] All active route copy is wired to i18n/local JSON or an approved equivalent.
- [ ] Translations reviewed by fluent/native speakers.
- [ ] Contact form sends email and does not persist PII.
- [ ] Production rate limiting/anti-spam decision implemented.
- [ ] CSP/security headers configured for chosen host.
- [ ] PDFs and videos are approved and optimized.
- [ ] Mobile, keyboard, RTL, and screen-reader smoke checks completed.
- [ ] Lighthouse/accessibility/performance checks completed.

---

## 16. Documentation Map

| Document | Role |
|---|---|
| `Website_Layout_Afghan_Immigration.md` | Original client input |
| `PRD_Afghan_Support_Realistic.md` | Active source of truth |
| `modification_plan.md` | Temporary migration plan tied to current code |
| `implementation_plan.md` | Post-cleanup execution plan |
| `archive/PRD_Afghan_Support_Part1.md` | Historical reference only |
| `archive/PRD_Afghan_Support_Part2.md` | Historical reference only |
