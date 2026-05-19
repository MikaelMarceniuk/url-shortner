---
name: Linkr Design System
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8b90a0'
  outline-variant: '#414754'
  surface-tint: '#aec6ff'
  primary: '#aec6ff'
  on-primary: '#002e6b'
  primary-container: '#0070f3'
  on-primary-container: '#ffffff'
  inverse-primary: '#0059c5'
  secondary: '#c6c5cf'
  on-secondary: '#2f3038'
  secondary-container: '#4a4b53'
  on-secondary-container: '#bcbbc5'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#de2e50'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#004397'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 20px
  container-max: 1200px
---

## Brand & Style
The design system is engineered for a high-performance, white-label SaaS environment. It draws inspiration from technical, developer-centric tools like Vercel and Linear, prioritizing utility, speed, and precision. The brand personality is "Technical Utility"—it feels like a professional instrument rather than a consumer app.

The design style is **Minimalist-Technical**. It utilizes heavy whitespace, a restricted color palette, and hyper-clear information hierarchy. Visual interest is generated through crisp typography and extreme attention to alignment rather than decorative flourishes. The interface should feel dense but scannable, evoking an emotional response of control and efficiency.

## Colors
The palette is centered on a "Zinc" scale of neutrals to provide a sophisticated, low-fatigue backdrop for technical data.

- **Primary (Electric Blue):** Used exclusively for primary actions, progress indicators, and active states. It must stand out against dark backgrounds without blooming.
- **Surface Tones:** A range of deep grays (Zinc 950 to 800) defines the UI layers.
- **Accents:** High-contrast semantic colors (Emerald-500 for success, Amber-400 for warnings, Rose-500 for errors) are used sparingly for status badges and destructive actions.
- **Implementation:** In dark mode, use subtle borders (#27272A) rather than shadows to define element boundaries.

## Typography
Typography is the primary driver of the hierarchy. We use **Inter** for all UI controls and prose to maintain a modern, neutral feel. **JetBrains Mono** is reserved for technical data—specifically URL slugs, API keys, and ID strings—to ensure character distinction (e.g., 0 vs O) and enhance the "developer-tool" aesthetic.

Headlines should use tighter letter spacing to feel "locked in." Labels for data tables and metadata should use the uppercase small-cap style for a distinct structural look.

## Layout & Spacing
This design system employs a **Fixed-Fluid Hybrid** grid. The main dashboard content is constrained to a 1200px container to maintain readability on ultra-wide monitors, while sidebars and navigation elements use fluid percentages.

- **Grid:** A 12-column system for dashboard layouts.
- **Spacing Scale:** A strict 4px base unit. Interaction elements (buttons, inputs) should standardise on 32px or 40px heights.
- **Mobile:** On mobile devices, margins reduce to 16px, and columns collapse to a single stack. Data tables should transition to card-based views or use horizontal scrolling with sticky primary columns.

## Elevation & Depth
Elevation is communicated through **Tonal Layering** rather than heavy shadows. 

- **Level 0 (Background):** The deepest layer, usually #09090B.
- **Level 1 (Cards/Sidebar):** Raised slightly using a one-step lighter fill (#18181B) and a 1px solid border (#27272A).
- **Level 2 (Modals/Popovers):** Highest elevation. Uses the Level 1 background but adds a subtle, 25% opacity black shadow with a 15px blur to separate it from the UI.

Avoid gradients. Depth should feel "flat-stacked," reminiscent of physical sheets of dark metal or glass.

## Shapes
In line with the professional SaaS aesthetic, we use a **Soft (0.25rem)** roundedness. This provides a modern touch without appearing overly "bubbly" or consumer-grade.

- **Standard Elements:** 4px (0.25rem) radius for buttons, inputs, and checkboxes.
- **Container Elements:** 8px (0.5rem) radius for cards and modals.
- **Selection Indicators:** 2px radius for focus rings to maintain a sharp, precise silhouette.

## Components
- **Buttons:** Primary buttons use the Electric Blue fill with white text. Secondary buttons use a subtle gray border with no fill. All buttons feature a 150ms transition on hover for a responsive feel.
- **URL Inputs:** Always pair the domain prefix (non-editable) with the slug input (editable). The slug input must use the `mono-md` typography level.
- **Status Badges:** Small, pill-shaped indicators. Use a "subtle" style: low-opacity background color with high-opacity text color (e.g., Success = 10% Emerald background, 100% Emerald text).
- **Data Tables:** High-density. Rows should have a subtle hover state (#18181B). Use monospaced fonts for "Clicks" and "Created At" columns to keep numerical data aligned.
- **Action Menu (Raycast-inspired):** A CMD+K interface component for quick navigation and link creation, featuring a semi-transparent backdrop blur and search-first layout.