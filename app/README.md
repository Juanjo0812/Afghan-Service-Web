# Afghan Support Phoenix

Community resource website for Afghan families in Phoenix, Arizona. The current app is a React/Vite single-page MVP with strong visual sections already in place, but the PRD still has critical implementation gaps: contact delivery, deterministic chatbot matching, accessibility, SEO, i18n/RTL, and data externalization.

## Quick path

```bash
cd app
npm install
npm run dev
npm run lint
```

Maintainer rule: do **not** run `npm run build` after changes unless explicitly asked.

## Current stack

| Area | Current setup |
|---|---|
| Runtime | React 19, TypeScript, Vite 7 |
| Styling | Tailwind CSS 3.4 + many inline styles |
| Motion | GSAP/ScrollTrigger, Lenis, Framer Motion in testimonials |
| UI kit | shadcn/Radix files are generated, but the live page mostly uses custom section markup |
| Assets | Local images and videos in `public/` |
| Backend | None currently |

## Source map

| Area | File(s) | Current state |
|---|---|---|
| App composition | `src/App.tsx` | Renders a single scroll page with all sections |
| Navigation | `src/sections/Navigation.tsx` | Sticky nav + mobile overlay; language toggle is placeholder |
| Hero | `src/sections/Hero.tsx` | Video parallax and CTA implemented |
| Services | `src/sections/QuickAccess.tsx` | Visual service cards; Learn More is not real navigation |
| Rights | `src/sections/KnowYourRights.tsx` | Static content; PDF link is placeholder |
| Resources | `src/sections/CommunityResources.tsx` | Static resource names; links are placeholders |
| Events | `src/sections/Events.tsx` | Static hardcoded events |
| Contact | `src/sections/Contact.tsx` | UI-only submit state; no email provider, no labels, no honeypot |
| Testimonials | `src/sections/Testimonials.tsx` | Modal and media strip implemented |
| Chatbot | `src/sections/Chatbot.tsx` | UI + quick actions; free-text always returns fallback |

## Docs to use

- `docs/PRD_Afghan_Support_Part1.md` — product scope and functional audit.
- `docs/PRD_Afghan_Support_Part2.md` — non-functional requirements, backlog, and sub-agent work packets.
- `../AGENTS.md` — agent rules for OpenCode/sub-agent execution.

## Verified cleanup notes

- `info.md` was removed because it was a generated setup note with stale paths and duplicated README-level information.
- `src/pages/Home.tsx` and `src/App.css` are leftover Vite template files and are not part of the rendered app.
- There is no `src/data/`, `src/locales/`, or `src/types/` directory yet.
