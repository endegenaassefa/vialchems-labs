/**
 * Design tokens for Vialchems Labs (Posture A: Clean Clinical).
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
  accent: '#3dd4c8',
  accentSoft: '#5eebdf',
  accentGlow: '#7ff1e8',
  text: 'rgba(255, 255, 255, 0.92)',
  textMuted: 'rgba(255, 255, 255, 0.62)',
  textSubtle: 'rgba(255, 255, 255, 0.42)',
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
} as const;

export const radius = {
  sm: '4px',
  md: '10px',
  lg: '14px',
  xl: '16px',
  '2xl': '18px',
  full: '999px',
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
} as const;

export type Tokens = typeof tokens;
