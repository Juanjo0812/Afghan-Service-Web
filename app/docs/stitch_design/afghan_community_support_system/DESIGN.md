---
name: Afghan Community Support System
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#43483f'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#73796e'
  outline-variant: '#c3c8bc'
  surface-tint: '#47663c'
  primary: '#173410'
  on-primary: '#ffffff'
  primary-container: '#2d4b24'
  on-primary-container: '#98bb89'
  inverse-primary: '#add19d'
  secondary: '#725c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed000'
  on-secondary-container: '#6f5900'
  tertiary: '#223300'
  on-tertiary: '#ffffff'
  tertiary-container: '#344b00'
  on-tertiary-container: '#9abd56'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8edb8'
  primary-fixed-dim: '#add19d'
  on-primary-fixed: '#042102'
  on-primary-fixed-variant: '#304e27'
  secondary-fixed: '#ffe07f'
  secondary-fixed-dim: '#edc200'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#564500'
  tertiary-fixed: '#caf082'
  tertiary-fixed-dim: '#afd369'
  on-tertiary-fixed: '#131f00'
  on-tertiary-fixed-variant: '#364e00'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  target-min: 44px
---

## Brand & Style

The design system is anchored in the concept of **Institutional Warmth**. It balances the formal reliability of a government agency with the welcoming embrace of a community center. The brand personality is dignified, resilient, and clear, specifically designed to support Afghan families navigating new environments.

The visual style follows a **Modern Institutional** approach:
- **Dignity over Decoration:** Clean layouts and generous whitespace convey respect and stability.
- **Cultural Resonance:** Subtle use of geometric patterns inspired by Afghan weaving and architectural motifs (e.g., the *girih*) acts as a silent welcome.
- **Accessibility First:** Visual clarity is the priority, ensuring users under stress or with limited digital literacy can navigate with ease.
- **Atmosphere:** Calm and grounded. It avoids the coldness of "corporate blue" in favor of organic, earth-rooted tones that feel domestic and safe.

## Colors

The palette is derived from nature and traditional Afghan aesthetics, rejecting the standard "nonprofit blue" for a more culturally specific and warm harmony.

- **Primary (Deep Forest Green):** Used for headers, primary actions, and branding. It represents growth, stability, and is a color of significant cultural importance.
- **Secondary (Warm Amber/Gold):** Reserved for highlights, calls to action, and subtle accents. It provides warmth and high visibility without being alarming.
- **Tertiary (Olive Green):** A supporting shade for secondary information, success states, and decorative elements.
- **Neutral (Ivory):** The primary background color. It is softer on the eyes than pure white, providing a "paper-like" warmth that feels institutional yet approachable.
- **Text:** A very dark charcoal (#1A1D1A) is used for all body text to maintain high contrast (WCAG AAA) against the ivory background.

## Typography

This design system uses **Inter** exclusively to ensure maximum legibility across digital devices and printed materials. 

- **Readability:** The minimum body size is set to 16px, with 18px preferred for general content to accommodate non-native speakers and elder users.
- **RTL Optimization:** Typography is optimized for bi-directional support. When switching to Dari or Pashto, the system maintains the same vertical rhythm and weight hierarchy.
- **Line Height:** Tight line heights are avoided. A generous 1.6x ratio is applied to body text to prevent "crowding," which aids in comprehension and translation.

## Layout & Spacing

The layout philosophy uses a **Fixed Grid** approach for desktop to create a sense of contained, organized information, transitioning to a fluid model for mobile devices.

- **Rhythm:** A strict 8px baseline grid ensures alignment across all components.
- **RTL-Ready:** Layouts must use logical properties (`padding-inline-start` instead of `padding-left`) to ensure seamless mirroring for Dari and Pashto translations.
- **Safe Targets:** All interactive elements (buttons, links, inputs) have a minimum touch target height of 44px to accommodate users with varying motor skills.
- **Composition:** Information is grouped into "content blocks" with clear margins to prevent cognitive overload.

## Elevation & Depth

To maintain a calm and "flat" institutional feel, this design system avoids heavy shadows, 3D effects, and glassmorphism.

- **Tonal Layering:** Depth is communicated through color contrast. A slightly darker "Surface" color (a light sand tone) is used to distinguish the background from "Cards" (Ivory).
- **Low-Contrast Outlines:** Instead of shadows, cards and input fields use a 1px border in a muted olive or soft grey. This provides structure without the visual "noise" of shadows.
- **Focus States:** High-contrast 2px Amber borders are used for keyboard navigation and active states to ensure clear visibility for all users.

## Shapes

The shape language is **Rounded**, moving away from sharp, aggressive corners to project a friendlier, community-focused persona.

- **Corners:** Components like buttons and cards use a 0.5rem (8px) radius. This "softened square" look feels modern and professional while remaining approachable.
- **Patterns:** Subtle cultural motifs are applied using sharp-edged geometric vector paths, but only as decorative background accents (opacity 5-10%) to provide a high-contrast counterpoint to the rounded UI elements.

## Components

Consistency across components reinforces the "government-service" reliability of the design system.

- **Buttons:** Large (min 44px height), with high-contrast text. Primary buttons use the Deep Forest Green with White text. Secondary buttons use an Olive border with Green text.
- **Input Fields:** Generous padding (12px 16px) with clear labels above the field. Errors are indicated with a deep red and a supporting icon to ensure accessibility.
- **Cards:** Used to group family services or resource links. They feature a 1px muted border and no shadow. Headers within cards should use the Deep Forest Green.
- **Lists:** High-density lists are avoided. List items are separated by subtle horizontal rules and include icons to aid visual scanning.
- **Pattern Accents:** Use a subtle "Afghan border" pattern on the top edge of primary cards or as a header background element to ground the UI in the cultural context of the community.
- **RTL Support:** Every component is designed to be mirrored. Icons that imply direction (arrows, progress bars) must flip when the language is changed.