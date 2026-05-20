---
name: Futuristic AI SaaS
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8b90a0'
  outline-variant: '#414754'
  surface-tint: '#aec6ff'
  primary: '#aec6ff'
  on-primary: '#002e6b'
  primary-container: '#0070f3'
  on-primary-container: '#ffffff'
  inverse-primary: '#0059c5'
  secondary: '#48ddbc'
  on-secondary: '#00382d'
  secondary-container: '#00bb9c'
  on-secondary-container: '#004437'
  tertiary: '#dbb8ff'
  on-tertiary: '#470083'
  tertiary-container: '#994eea'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#004397'
  secondary-fixed: '#6bfad8'
  secondary-fixed-dim: '#48ddbc'
  on-secondary-fixed: '#002019'
  on-secondary-fixed-variant: '#005142'
  tertiary-fixed: '#efdbff'
  tertiary-fixed-dim: '#dbb8ff'
  on-tertiary-fixed: '#2b0052'
  on-tertiary-fixed-variant: '#6600b7'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.7'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered to evoke a sense of hyper-intelligence, precision, and "day-after-tomorrow" technology. It targets a sophisticated audience of developers and enterprise leaders who value speed, clarity, and aesthetic refinement. 

The visual direction is a fusion of **Minimalism** and **Glassmorphism**, heavily inspired by the "Linear" aesthetic. It utilizes deep obsidian voids contrasted against vibrant, luminous accents. Every interface element should feel like a projection on a high-end glass display—ethereal yet structurally sound. High whitespace, generous tracking, and delicate glowing borders are the hallmarks of this style, creating an atmosphere that is both calm and technologically advanced.

## Colors

The palette is anchored in a deep, absolute black (#050505) to maximize the contrast of luminous UI elements. 

- **Primary (Electric Blue):** Used for primary actions and key interface signals.
- **Secondary (Cyan):** Reserved for success states and secondary highlights.
- **Tertiary (Violet):** Used in gradients to provide depth and a premium "AI" feel.
- **Surface Tiers:** Use semi-transparent white overlays (2% to 8% opacity) on the obsidian background to create distinct glass layers.
- **Glows:** Accent colors should be applied as soft, low-opacity box-shadows (blur > 20px) to simulate light emission.

## Typography

This design system utilizes **Geist** for its systematic, technical, and minimal character. The typography relies on high contrast between massive, tight-tracked headlines and highly legible, airy body text. 

- **Headlines:** Should be bold and impactful, using negative letter-spacing to create a "locked" architectural feel.
- **Labels:** Use uppercase with increased letter-spacing for a technical, HUD-like (Heads-Up Display) appearance.
- **Code:** As an AI SaaS, code blocks must use **JetBrains Mono** to provide a familiar environment for technical users, ensuring perfect alignment and readability.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with high horizontal breathing room. The interface should never feel cramped; information density is managed through generous vertical stacking and clear spatial grouping.

- **Grid:** Use a 12-column grid for desktop views. Content cards and chat interfaces should ideally span the central 8 columns to maintain focus.
- **Chat Feed:** The core interaction area uses a centered layout with a maximum width of 800px to ensure line lengths remain readable.
- **Padding:** Use "Safe Zones" for glassy containers. Internal padding for cards and modals should never drop below `stack-lg` (32px) to maintain the premium, spacious feel.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and tonal stacking rather than traditional drop shadows.

- **Layer 0 (Base):** Solid #050505 background.
- **Layer 1 (Surfaces):** Translucent background (White at 3% opacity) with a `backdrop-filter: blur(20px)`.
- **Borders:** Every elevated surface must have a 1px solid border. Use a linear gradient for the border (Top-left: White at 15% to Bottom-right: White at 5%) to simulate a subtle light catch on the "edge" of the glass.
- **Interactive Depth:** When an element is focused or active, apply a "Glow" effect—a box-shadow using the primary color at 20% opacity with a 30px blur radius.

## Shapes

The shape language is defined by extreme roundedness to soften the high-tech aesthetic and make the AI feel approachable.

- **Base Radius:** Elements use a minimum of 24px (1.5rem) for corners.
- **Action Elements:** Buttons and chips are fully pill-shaped (rounded-full) to distinguish them from structural layout containers.
- **Inputs:** Search and chat input bars should be pill-shaped to signal they are the primary interaction points.

## Components

### Buttons
Primary buttons feature a gradient background (Electric Blue to Violet) with a subtle outer glow. Hover states should increase the glow intensity. Secondary buttons use the "glass layer" style with a 1px border.

### Chat Bubbles
- **AI Response:** Glassy surface (blur 20px) with a subtle Cyan border gradient. Text is high-contrast white.
- **User Message:** Darker, solid surface (White at 6% opacity) with no blur, positioned to the right to create a clear visual dialogue.

### Input Fields
The main chat input is a floating pill-shaped glass container. It should appear as if it is hovering above the chat feed. On focus, the 1px border transitions from a muted grey to a vibrant Electric Blue glow.

### Action Chips
Small, pill-shaped triggers used for suggested prompts. They use a low-opacity Cyan background and high-contrast labels to encourage interaction without overwhelming the main content.

### Cards
Feature cards use the standard glassmorphism stack. They are used for displaying AI-generated summaries, data visualizations, or code snippets. All cards must have the 1px light-catching border.