# Modification Plan — UI Refactor & Hybrid Migration

## Goal
Refactor the frontend architecture to a multi-page React Router setup, migrating the base design from `New-style/New-web` into our current repository (`app/`) while strictly preserving existing business logic (i18n, RTL support, deterministic Chatbot). We will also selectively inject enhanced HTML designs from standalone templates for Events, Resources, and Stories.

## Architecture Guidelines
- **Routing Architecture**: The current app is a single long-scrolling SPA. We are splitting it into multiple routes. The `Chatbot`, `Navigation`, and `Footer` will be kept at the `AppShell` level so they persist across page navigations.
- **Tailwind Configuration**: The `New-style` design has its own `tailwind.config.js` and `index.css` (custom colors/tokens). We will overwrite the current project's styles with the new ones so the base design matches.

## Proposed Changes

### 1. Structural Migration & Setup
Merge the foundational UI layer from the new design into the active project, without breaking existing logic.

- **[MODIFY] `tailwind.config.js` & `src/index.css`**: Replace with the configuration and CSS variables from `New-style/New-web/app`.
- **[NEW] `src/components/`**: Copy new UI primitives from `New-style/New-web/app/src/components` into `app/src/components`.

### 2. Routing Configuration
Break the monolithic `App.tsx` into multiple distinct routes.

- **[MODIFY] `src/App.tsx`**: Set up `react-router` with the following route structure:
  - `/` (Main View: Home, ImmigrationHelp, CommunityResources, Testimonials/Stories)
  - `/rights` (Know Your Rights)
  - `/events` (Events)
  - `/contact` (Contact)

### 3. Page Construction & Specific Enhancements
Rebuild the sections using the new design components, injecting the specific HTML enhancements requested.

- **[MODIFY] `src/sections/Hero.tsx` / `src/sections/Events.tsx`**: Inject the "Next Event" design from `New-style/index.html`.
- **[MODIFY] `src/sections/CommunityResources.tsx`**: Inject the professional resources layout from `New-style/resources.html`.
- **[NEW] `src/pages/EventsPage.tsx`**: Use the enhanced list item design from `New-style/events.html`. Preserve the list structure (vertical stack) for list view, and keep the calendar view unchanged.
- **[MODIFY] `src/sections/Testimonials.tsx`**: Use the mixed card layout (clients, leaders, text-only) from `New-style/stories.html`. Re-integrate the existing video modal logic (popup when clicking a video story) from the old design.

### 4. Logic Preservation
Ensure that the active PRD requirements are not lost during the visual migration.

- Maintain `react-i18next` hooks (`useTranslation`) and translation keys in all new components.
- Maintain RTL support (logical tailwind properties).
- Ensure the `Chatbot` component remains untouched and functional on all routes.
- Preserve form validations (`zod` + `react-hook-form`).

## Verification Plan

### Automated Checks
- `tsc -b`: Ensure no TypeScript errors were introduced by copying new components.
- Linter checks to ensure imports are correct.

### Manual Verification
- Navigate between `/`, `/rights`, `/events`, and `/contact` to verify smooth routing.
- Test the language toggle to ensure translations and RTL work on the new UI.
- Click a video story in the Testimonials section to verify the modal popup triggers correctly.
- Verify the deterministic Chatbot remains accessible on all pages.
