# Modification Plan — Next.js + WordPress Headless Migration

This plan re-routes Afghan Support Phoenix from the current Vite/React SPA toward a Next.js App Router frontend backed by WordPress Headless for the two client-managed areas: events and SEO/social metadata.

The migration must preserve the current frontend design, multilingual behavior, deterministic chatbot, contact flow, and legal/content safety constraints. WordPress is a content admin, not a page builder for this project.

---

## 0. Decision Summary

| Area | Decision |
|---|---|
| Frontend target | Next.js App Router on Vercel |
| CMS target | WordPress Headless, first via WordPress Studio locally, then Hostinger WordPress |
| Editable by client | Events and SEO/Open Graph metadata only |
| Not editable by client yet | Layout, navigation, legal content, chatbot KB, contact flow, resources, global design |
| Supported languages | English, Dari, and Uzbek only |
| Removed language | Pashto must be fully deleted from code, data, routes, types, docs, and CMS schemas |
| Current design | Preserve as-is; this is an architecture migration, not a redesign |
| Current public URLs | Preserve `/`, `/events`, `/stories`, `/contact`, etc., plus existing language-prefixed variants |
| Contact backend | Preserve behavior by moving `api/contact.ts` to a Next.js Route Handler |
| Validation | Lint/type/manual checks only unless maintainer explicitly authorizes build |

**Why this is the right tradeoff:** the client keeps the familiar WordPress admin experience for events and campaign metadata, while the project keeps a modern React architecture suitable for Vercel, SEO metadata, and portfolio value.

---

## 1. Current State to Preserve

The active project root is `app/`.

| Current area | Current anchor |
|---|---|
| Runtime | Vite + React 19 + TypeScript |
| Entry | `src/main.tsx` |
| Routes | `src/App.tsx` with `react-router` lazy pages |
| Shell | `src/components/Layout.tsx` with Header, Footer, Chatbot, Toaster |
| Pages | `src/pages/HomePage.tsx`, `ImmigrationPage.tsx`, `RightsPage.tsx`, `ResourcesPage.tsx`, `EventsPage.tsx`, `StoriesPage.tsx`, `ContactPage.tsx` |
| i18n | `src/lib/i18n.ts`, `src/locales/**`, `LanguageProvider`, language-aware route prefixes |
| RTL | `src/lib/direction.ts` + `document.documentElement.dir` updates |
| SEO | `src/components/SEO.tsx` using `react-helmet-async` |
| Contact API | `api/contact.ts` using Resend, Zod, Upstash rate limiting |
| Deployment config | `vercel.json` with SPA fallback, headers, and API cache rules |
| Editable data today | Events/stories are still component/local-data driven; no CMS integration exists yet |

Do not remove working UX behavior just because the framework changes. This migration is successful only if the user-facing website feels the same or better.

---

## 2. Editorial Contract

WordPress Headless must be scoped tightly. If the client later wants more editable areas, that becomes a new change request.

### Editable in WordPress

| Content | Required fields |
|---|---|
| Events | title, description, category, start date/time, end date/time if needed, location, CTA label, registration/contact URL, featured image, language-specific copy |
| Event metadata | SEO title, meta description, Open Graph title, Open Graph description, Open Graph image |
| Page metadata | route key, SEO title, meta description, Open Graph title, Open Graph description, Open Graph image, language |

### Not editable in WordPress for this phase

- Page layout and section order.
- Navigation structure.
- Legal/Know Your Rights content.
- Deterministic chatbot logic and curated KB.
- Contact form behavior and email/rate-limit logic.
- Resources data unless a later approved scope adds it.
- Design tokens, colors, typography, animations, and component structure.

**Client explanation:** WordPress will let staff edit approved content records. It will not let them redesign the React site without a code change. Esa claridad evita prometer humo.

---

## 3. Target Architecture

```text
User Browser
  ↓
Next.js on Vercel
  ├─ Server Components fetch public content from WordPress REST API
  ├─ generateMetadata() resolves SEO/Open Graph tags per route
  ├─ Route Handler keeps contact form API
  └─ Client Components preserve interactive UI: Header, language switcher, chatbot, calendars, modals
      ↓
WordPress on Hostinger / WordPress Studio during local proof
  ├─ Custom Post Type: asp_event exposed as /wp-json/wp/v2/events
  ├─ Custom Post Type: asp_page_meta exposed as /wp-json/wp/v2/site-metadata
  └─ Media Library for event/OG images
```

### Dependency direction

Components must not consume raw WordPress responses directly.

Use this boundary:

```text
WordPress REST shape → Zod validation → mapper → internal domain model → UI components
```

This keeps WordPress replaceable and protects the frontend from plugin/API shape changes.

---

## 4. Proposed Next.js File Shape

Use `src/app` so the repository root `app/` does not collide conceptually with Next.js App Router.

```text
app/
  src/
    app/
      layout.tsx
      page.tsx
      events/page.tsx
      stories/page.tsx
      contact/page.tsx
      immigration/page.tsx
      rights/page.tsx
      resources/page.tsx
      [lang]/page.tsx
      [lang]/events/page.tsx
      [lang]/stories/page.tsx
      [lang]/contact/page.tsx
      [lang]/immigration/page.tsx
      [lang]/rights/page.tsx
      [lang]/resources/page.tsx
      api/contact/route.ts
      api/revalidate/route.ts
    components/
      AppShell.tsx
      Header.tsx
      Footer.tsx
      LanguageProvider.tsx
      LanguageSwitcher.tsx
      SEO removed after metadata migration
    features/
      events/
        EventsRoute.tsx
        EventsClient.tsx
      stories/
        StoriesRoute.tsx
        StoriesClient.tsx
    server/
      cms/
        wordpress.ts
        wordpress.types.ts
        wordpress.mappers.ts
        cms-cache.ts
      seo/
        metadata.ts
    domain/
      content.ts
      language.ts
    i18n/
      dictionaries.ts
      provider.tsx
```

### Routing rule

Preserve current public routes:

- English/default: `/`, `/events`, `/stories`, `/contact`, `/immigration`, `/rights`, `/resources`
- Other languages: `/dari`, `/dari/events`, `/uzbek`, `/uzbek/events`, etc.
- Pashto routes such as `/pashto` and `/pashto/events` must not be recreated. If redirects are needed for old links, redirect them to English or a client-approved fallback route.

Root English route files and `[lang]` route files should import the same shared route modules to avoid duplicate page logic.

---

## 5. Migration Packets

### Packet A — Next.js Skeleton Without Visual Change

**Goal:** replace Vite runtime with Next.js while keeping the same UI behavior.

Required changes:

- Replace Vite scripts with Next.js scripts:
  - `dev`: `next dev`
  - `lint`: keep `eslint .`
  - do not run `build` unless explicitly authorized.
- Add `next` and required Next-compatible config.
- Remove Vite-only files after equivalent Next wiring exists:
  - `vite.config.ts`
  - `index.html`
  - `src/main.tsx`
  - Vite-specific env usage.
- Move global CSS import from `src/main.tsx` into `src/app/layout.tsx`.
- Preserve existing Tailwind tokens and `src/index.css` content by moving or importing it as `src/app/globals.css`.
- Keep current font packages unless there is a specific reason to change; do not redesign typography.
- Replace `react-router` routes with App Router pages.
- Replace `Layout.tsx` with `AppShell` used from Next layout/page composition.

Acceptance criteria:

- Header, footer, chatbot, toast container, mobile menu, language switcher, and page layout remain visually equivalent.
- Current route list remains reachable.
- No intentional copy/design changes are introduced.

---

### Packet B — i18n, RTL, and Pashto Removal

**Goal:** preserve language-aware routing for English, Dari, and Uzbek while deleting every Pashto trace.

Required changes:

- Keep `LangCode`: `en | dari | uzbek`.
- Move shared language constants to `src/domain/language.ts`.
- Replace browser-path detection with explicit route-derived language resolution.
- Root layout reads language from middleware-provided request headers and sets initial `<html lang>` and `<html dir>`.
- Client `LanguageProvider` still exists for interactive components, but it receives initial language from the route/server instead of guessing from `window.location`.
- `LanguageSwitcher` uses `next/navigation` and a single route helper to preserve the current page while swapping language prefix.
- Keep existing English, Dari, and Uzbek locale JSON files; expose them through a dictionary loader rather than rewriting all translations during the framework migration.
- Delete Pashto locale/data files and imports, including `src/locales/pashto/**`, `src/data/*.pashto.json`, and any Pashto-only references in `src/lib/i18n.ts`.
- Delete Pashto fields from chatbot/data models, including `keywords_pashto`, `response_pashto`, `ps` locale maps, and Pashto language labels.
- Delete Pashto route handling, switcher options, tests/checks, docs references, and CMS schema fields.
- Do not leave dead compatibility types such as `pashto?: string` unless a verified external API still requires them.

Acceptance criteria:

- `/events` renders English.
- `/dari/events` renders RTL after first paint, not only after user interaction.
- `/uzbek/events` renders LTR and remains available from the language switcher.
- Searching the codebase for `pashto`, `Pashto`, `پښتو`, `keywords_pashto`, `response_pashto`, and `/pashto` returns no active runtime references.
- Switching language preserves route intent.
- Existing translation namespaces remain available to client components.

---

### Packet C — Contact API Migration

**Goal:** preserve the current contact form backend inside Next.js.

Required changes:

- Move `api/contact.ts` to `src/app/api/contact/route.ts`.
- Keep request method: `POST /api/contact`.
- Preserve:
  - Zod validation.
  - Resend email delivery.
  - Upstash IP/phone rate limits.
  - honeypot silent success.
  - `Cache-Control: no-store`.
  - no PII persistence.
- Adapt handler signature to Next Route Handler style:
  - `export async function POST(request: Request)`
  - `export async function OPTIONS()` only if still needed.
- Use `NextResponse.json()` or a shared JSON helper.
- Keep env vars:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `CONTACT_TO_EMAIL`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`

Acceptance criteria:

- Existing contact page can submit to the same path.
- Failure states remain safe and generic.
- No form data is written to WordPress, localStorage, logs, analytics, or a database.

---

### Packet D — WordPress Studio Proof of Concept

**Goal:** prove locally that the client can edit events/metadata in WordPress without touching frontend code.

Required local setup:

- Install and create a local site with WordPress Studio.
- Create a small custom plugin named `afghan-support-headless`.
- The plugin registers:
  - `asp_event` with REST base `events`.
  - `asp_page_meta` with REST base `site-metadata`.
- Register required post meta using `register_post_meta(..., ['show_in_rest' => true])`.
- Add admin metaboxes or field UI inside the plugin so the client sees clear form fields in WordPress.
- Enable featured images for events and metadata records.
- Create seed content:
  - at least 2 events.
  - metadata for home and events pages.
  - one event with featured image and Open Graph image.

Do not depend on a page builder for the proof. The whole point is to prove structured content, not layout editing.

Acceptance demo:

1. Edit an event title/date in WordPress Studio.
2. Refresh the Next.js events page.
3. The event updates without code changes.
4. Edit metadata for the Events page.
5. Inspect the rendered page metadata/Open Graph tags.
6. The metadata updates without touching React code.

---

### Packet E — CMS Adapter and Domain Models

**Goal:** add the headless boundary without leaking WordPress structures into UI components.

Required internal types:

```ts
type LangCode = 'en' | 'dari' | 'uzbek'

type EventCategory = 'immigration' | 'legal' | 'cultural' | 'holiday'

interface EventContent {
  id: string
  slug: string
  title: string
  description: string
  category: EventCategory
  categoryLabel: string
  startDate: string
  endDate?: string
  timeLabel: string
  location: string
  ctaLabel: string
  ctaUrl?: string
  imageUrl?: string
  seo?: PageMetadata
}

interface PageMetadata {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalPath: string
}
```

Required adapter functions:

```ts
getEvents(lang: LangCode): Promise<EventContent[]>
getEventBySlug(slug: string, lang: LangCode): Promise<EventContent | null>
getPageMetadata(routeKey: string, lang: LangCode): Promise<PageMetadata | null>
```

Implementation rules:

- Fetch only from server-side modules.
- Validate WordPress responses with Zod before mapping.
- Return safe empty arrays or fallback metadata when WordPress is unreachable.
- Never let UI components know about `_embedded`, `acf`, raw `meta`, or WordPress-specific field names.
- Use environment variable `WORDPRESS_API_BASE_URL` for the REST API root.
- Do not expose private WordPress credentials to the browser.

Acceptance criteria:

- Events UI renders from internal `EventContent[]`.
- The events route still works if WordPress returns no events.
- Network/API failures produce safe UI fallback, not a crashed page.

---

### Packet F — Events Page Integration

**Goal:** replace hardcoded event data with WordPress-managed content while preserving current visual design.

Required changes:

- Move current interactive filters/calendar/list behavior into a client component.
- Fetch events in the route/server layer through `getEvents(lang)`.
- Pass normalized events to the existing visual component.
- Keep categories:
  - immigration workshops
  - legal clinics
  - cultural gatherings
  - Afghan holidays
- Keep current card/list/calendar visual treatment.
- If event CTA URL exists, render it safely.
- If no CTA URL exists, route to `/contact` with existing contact-oriented copy.
- If no WordPress events exist, show the current honest empty/coming-soon state.

Acceptance criteria:

- Editing an event in WordPress Studio updates the events page.
- Deleting all events does not break layout.
- Filters and calendar still work.
- No fake event data is presented as real production content.

---

### Packet G — Metadata Integration

**Goal:** let the client edit SEO/social metadata from WordPress while Next.js renders it server-side.

Required changes:

- Remove `react-helmet-async` after all metadata is migrated.
- Replace `SEO.tsx` usage with Next.js `generateMetadata()`.
- Metadata resolution order:
  1. WordPress metadata record for route + language.
  2. Event-specific metadata for event detail routes, if event detail pages are added.
  3. Current static default metadata fallback.
- Include:
  - title
  - description
  - canonical URL
  - Open Graph title/description/image
  - Twitter card fields
  - alternate language URLs
- Keep `SITE_URL` as `NEXT_PUBLIC_SITE_URL` or server env with a safe default for local dev.
- Configure `next.config.ts` image remote patterns for the WordPress media host.
- Update CSP/image policy to allow the approved WordPress media domain only.

Acceptance criteria:

- Page source/metadata contains WordPress-managed title and description.
- Facebook/Google ad previews have stable OG title, description, and image values.
- Missing WordPress metadata falls back to safe defaults.

---

### Packet H — Vercel and Hostinger Deployment Alignment

**Goal:** keep Vercel for the frontend and use Hostinger only for WordPress admin/content.

Required production topology:

```text
main domain        → Vercel Next.js frontend
cms/admin subdomain → Hostinger WordPress admin + REST API
```

Required env vars in Vercel:

```txt
WORDPRESS_API_BASE_URL=https://cms.example.org/wp-json/wp/v2
WORDPRESS_REVALIDATE_SECRET=<random-long-secret>
NEXT_PUBLIC_SITE_URL=https://example.org
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
CONTACT_TO_EMAIL=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Required WordPress/Hostinger rules:

- Keep WordPress admin protected with strong credentials and 2FA if available.
- Do not install unnecessary plugins.
- Keep the custom headless plugin under version control in this repo or a clearly documented handoff folder.
- Media uploaded for events/metadata must be optimized before publishing.
- Confirm REST API endpoints are public only for non-sensitive content.

Next/Vercel config:

- Remove the old SPA rewrite to `index.html`; App Router owns routing.
- Keep security headers either in `next.config.ts` or `vercel.json`, not duplicated in both.
- `connect-src` must allow the WordPress API only if client-side fetches are introduced; default should be server-side fetch only.
- `img-src` / Next image config must allow only the WordPress media host and local assets.

---

## 6. Verification Plan

Do not run `npm run build` unless the maintainer explicitly authorizes it.

Allowed checks:

```bash
npm run lint
npx tsc --noEmit
```

Manual checks:

- [ ] Home, Immigration, Rights, Resources, Events, Stories, and Contact routes render.
- [ ] Header scroll behavior and mobile menu still work.
- [ ] Chatbot opens and routes to real pages.
- [ ] Language switcher preserves route intent.
- [ ] Dari renders RTL correctly.
- [ ] Pashto has no active runtime, data, route, type, CMS schema, or documentation references except historical archive notes.
- [ ] Contact form posts to `/api/contact` and preserves current success/error behavior.
- [ ] WordPress Studio event edits appear on the events page.
- [ ] WordPress Studio metadata edits appear in rendered metadata.
- [ ] WordPress offline/failure state does not crash the site.
- [ ] No legal/chatbot content is fetched dynamically from WordPress.
- [ ] No PII is stored in WordPress, analytics, localStorage, static files, or logs.

Client demo checklist:

- [ ] Show WordPress admin event edit screen.
- [ ] Change event title/date.
- [ ] Refresh local Next.js page and show the update.
- [ ] Change Events page metadata.
- [ ] Show rendered metadata changed without touching code.
- [ ] Explain clearly: events and metadata are editable; layout changes remain developer work.

---

## 7. PRD and Implementation Plan Updates After Proof

Update `PRD_Afghan_Support_Realistic.md` only after the WordPress Studio proof works.

Required PRD changes:

- Change app model from `Static-first React SPA` to `Next.js static/server-rendered frontend with WordPress Headless for scoped editorial content`.
- Remove `CMS/admin panel for MVP` from non-goals and replace with `general-purpose page builder/editor is out of scope`.
- Update data model:
  - Events: WordPress Headless.
  - Page/event metadata: WordPress Headless.
  - Legal/chatbot/resources/contact: controlled by code/static reviewed data unless later approved.
- Update technical architecture from Vite to Next.js App Router.

Required `implementation_plan.md` changes:

- Replace Vite-specific deployment work with Next.js/Vercel work.
- Add WordPress Studio proof packet.
- Add Hostinger WordPress setup packet.
- Add CMS adapter and metadata packets.
- Preserve contact API, i18n, chatbot, and security requirements.

---

## 8. Launch Blockers

Do not call the migration complete until all are true:

- WordPress Studio proof shows event edits without code changes.
- Metadata can be edited from WordPress and rendered by Next.js.
- Events page does not depend on hardcoded production event data.
- Contact form behavior is preserved in Next.js.
- Vercel env vars are documented.
- Hostinger WordPress REST URL is known and tested.
- The client understands the editable scope.
- PRD and implementation plan have been updated after proof.

---

## 9. References

- WordPress Studio local development: https://developer.wordpress.com/docs/developer-tools/studio/
- WordPress REST API custom post types: https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/
- WordPress REST API custom fields/responses: https://developer.wordpress.org/rest-api/extending-the-rest-api/modifying-responses/
- Next.js metadata API: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js caching and revalidation: https://nextjs.org/docs/app/getting-started/caching-and-revalidating
- Vercel Next.js docs: https://docs.vercel.com/kb/nextjs
