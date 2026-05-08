# Modification Plan — Current Code Cleanup

This document is the **bridge between the current codebase and the realistic
PRD**. It does not add new functionality. It only removes over-engineering and
leaves the codebase ready to execute `implementation_plan.md`.

**Active PRD**: `app/docs/PRD_Afghan_Support_Realistic.md`

---

## Main Rule

Preserve the current behavior that already works:

- navigation
- existing sections
- i18n/RTL
- form/contact flow
- deterministic chatbot
- local JSON data
- baseline SEO

Cleanup must reduce complexity without breaking the product. This is
architecture, not “deleting for the sake of deleting.”

---

## 1. Dependency Cleanup

Remove libraries related to complex DOM manipulation, scroll hijacking, heavy
JS animations, or unused components.

```bash
npm uninstall @gsap/react gsap framer-motion lenis next-themes recharts react-resizable-panels input-otp cmdk react-day-picker vaul
```

Radix/Shadcn: remove only packages/components that have no real imports in the
final code. Do not assume: verify imports before deleting.

```bash
npm uninstall @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip embla-carousel-react
```

Keep functional dependencies if they are in use:

- `react`
- `react-router`
- `react-i18next` / `i18next`
- `react-hook-form`
- `zod`
- `resend`
- `sonner`
- `lucide-react`
- `react-helmet-async`
- `tailwindcss`
- `tailwindcss-animate`

---

## 2. Global Cleanup

### `src/App.tsx`

- [ ] Remove the `useLenis` import and usage.
- [ ] Keep `SEO`, `Navigation`, sections, `Footer`, `Chatbot`, and `Toaster`.

### `src/hooks/`

- [ ] Remove `useLenis.ts`.
- [ ] Remove `useReducedMotion.ts` only when no imports remain.
- [ ] Use native CSS with `prefers-reduced-motion` for remaining animations.

### `src/components/ui/`

- [ ] Delete shadcn/ui components that no longer have imports.
- [ ] Do not delete components still used by sections or forms.

---

## 3. Replace JS Animations with CSS/Tailwind

| Current effect | Recommended replacement |
|---|---|
| GSAP fade/slide | `animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out` |
| Framer modal scale | `animate-in fade-in zoom-in-95 duration-300 ease-out` |
| Card hover | `transition-all duration-300 hover:-translate-y-1 hover:shadow-lg` |
| Buttons | `transition-colors duration-300` |

### Hero

- [ ] Remove `gsap` imports/references.
- [ ] Remove timelines and refs used only for animation.
- [ ] Keep either an image or one optimized video.
- [ ] Remove video/parallax layers.
- [ ] Keep overlay and CTA.

### Sections

Apply to:

- `QuickAccess`
- `About`
- `KnowYourRights`
- `CommunityResources`
- `Events`
- `Contact`
- `Testimonials`

Checklist per section:

- [ ] No `gsap` import.
- [ ] No `ScrollTrigger`.
- [ ] No `motion.div`/`AnimatePresence` unless the team decides to keep
  Framer, which this plan does not recommend.
- [ ] Simple states/interactions with React + CSS.
- [ ] RTL support is not degraded.

---

## 4. Chatbot

- [ ] Keep the deterministic engine and local KB.
- [ ] Do not add AI, embeddings, or external APIs.
- [ ] Replace JS animations with CSS/Tailwind if any exist.
- [ ] Verify fallback to contact.
- [ ] Verify RTL text does not break the layout.

---

## 5. Post-Cleanup Acceptance Criteria

Cleanup is complete when:

- [ ] No imports remain for `gsap`, `@gsap/react`, `framer-motion`, or `lenis`.
- [ ] `src/App.tsx` does not use `useLenis`.
- [ ] `package.json` does not keep removed unused dependencies.
- [ ] Scrolling is native again.
- [ ] Main sections remain visible.
- [ ] i18n/RTL still works.
- [ ] Contact and chatbot remain present.
- [ ] `npm run dev` works for manual review.

Do not run `npm run build` unless the maintainer explicitly authorizes it.

---

## After Completion

1. Mark this document as completed or move it to archive.
2. Execute `implementation_plan.md`.
3. Do not reintroduce heavy JS animations without a real product reason.
