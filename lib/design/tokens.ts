/**
 * Design tokens for vialchemlabs (Posture A: Clean Clinical).
 *
 * Source: SUPER_PROMPT_v3 Appendix V.2.
 *
 * These constants mirror the CSS custom properties defined in app/globals.css.
 * Use TypeScript values in component logic (e.g., motion timings); use the
 * CSS variables in styling (e.g., colors via `bg-[var(--accent)]`).
 *
 * LOCKED via DECISIONS/brand_pick.md. Operator may strengthen, never weaken.
 * Anti-patterns enforced in design-review (Appendix V.2 anti-patterns column).
 */

export const colors = {
  bg: '#0a0e0f',
  surface: '#141a1c',
  surfaceStrong: '#1a2226',
  surfaceMuted: 'rgba(20, 26, 28, 0.6)',
  // Phase 1 v4 addition — one step above surfaceStrong on the dark-mode value
  // ramp; used for hover/active states on Card and Button.
  surfaceElevated: '#202a2e',
  accent: '#3dd4c8',
  accentSoft: '#5eebdf',
  accentGlow: '#7ff1e8',
  // Phase 1 v4 addition — one step deeper than accent for pressed states.
  // 15% darker on perceptual scale (~ teal #2cb5aa).
  accentDeep: '#2cb5aa',
  text: 'rgba(255, 255, 255, 0.92)',
  textMuted: 'rgba(255, 255, 255, 0.62)',
  // Phase 11.2 (v4): bumped from 0.42 to 0.55 to clear WCAG AA 4.5:1
  // body-text contrast on --surface and --surface-elevated. Iron Law 2.27.
  textSubtle: 'rgba(255, 255, 255, 0.55)',
  border: '#1f2a2e',
  borderStrong: '#2a3a40',
  electric: '#67e8f9',
  // Status pills (always paired with text per A11y rules)
  pillAccent: '#3dd4c8',
  pillInfo: '#5eebdf',
  pillElectric: '#67e8f9',
  pillError: '#f87171',
} as const;

export const typography = {
  sans: 'IBM Plex Sans, system-ui, sans-serif',
  mono: 'IBM Plex Mono, ui-monospace, monospace',
  serifItalic: 'Newsreader, ui-serif, Georgia, serif',
  scale: {
    heroXl: 'clamp(48px, 7vw, 96px)',
    heroLg: '60px',
    headlineLg: '32px',
    headlineMd: '28px',
    headlineSm: '24px',
    titleMd: '20px',
    titleSm: '18px',
    bodyLg: '18px',
    bodyMd: '16px',
    bodySm: '14px',
    caption: '13px',
    monoBody: '14px',
    monoSm: '12px',
    labelUppercase: '11px',
  },
  tracking: {
    label: '0.16em',
    fieldLabel: '0.12em',
  },
} as const;

export const spacing = {
  '2xs': '2px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '96px',
  '6xl': '128px',
  // Phase 1 v4 additions — hero atmospheric breathing room beyond v3.0's 6xl=128px.
  '7xl': '192px',
  '8xl': '256px',
} as const;

export const radius = {
  sm: '4px',
  md: '10px',
  lg: '14px',
  xl: '16px',
  '2xl': '18px',
  full: '999px',
  // Phase 1 v4 addition — clarity alias for `full`. Use `pill` on
  // Pill / Badge components and `full` on round avatars/icons.
  pill: '999px',
} as const;

/**
 * Phase 1 v4 addition — drop-shadow scale for elevation hierarchy.
 *
 * Calibrated against Appendix AC reference set (Linear/Vercel/Cursor dark-mode
 * surface elevation). Values darken at the bottom-right axis to read as
 * physical depth on charcoal #0a0e0f without becoming muddy.
 *
 * Usage:
 *   sm  — resting state on interactive cards (1px subtle separation)
 *   md  — hover lift on Card variant=interactive (4px definition)
 *   lg  — Dialog / popover overlay (12px elevation)
 *   xl  — Sheet / drawer surface (24px overlay depth)
 *   2xl — Modal / focused overlay (32px max depth)
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.32)',
  md: '0 4px 12px -2px rgba(0, 0, 0, 0.42)',
  lg: '0 12px 32px -4px rgba(0, 0, 0, 0.5)',
  xl: '0 24px 64px -12px rgba(0, 0, 0, 0.6)',
  '2xl': '0 32px 96px -16px rgba(0, 0, 0, 0.7)',
} as const;

/**
 * Phase 1 v4 addition — gradient token category.
 *
 * The hero atmospheric gradient already exists inline in app/globals.css body
 * background; v4 promotes it into the token system so other surfaces (PDP
 * hero, CTA backdrops) can reuse the exact stops without ad-hoc duplication.
 */
export const gradients = {
  heroAtmospheric:
    'radial-gradient(ellipse 80% 60% at 80% 0%, rgba(61, 212, 200, 0.08) 0%, transparent 60%), ' +
    'radial-gradient(ellipse 60% 40% at 20% 100%, rgba(103, 232, 249, 0.04) 0%, transparent 70%)',
  accentRadial:
    'radial-gradient(circle at 50% 50%, rgba(61, 212, 200, 0.18) 0%, transparent 70%)',
} as const;

export const motion = {
  ease: {
    premiumOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    in: 'ease-in',
    move: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
  },
  duration: {
    micro: '80ms',
    short: '200ms',
    medium: '320ms',
    long: '540ms',
    slow: '720ms',
    continuousMin: '14000ms',
    continuousMax: '22000ms',
  },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  motion,
  zIndex,
  shadows,
  gradients,
} as const;

export type Tokens = typeof tokens;
