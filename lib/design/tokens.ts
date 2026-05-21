/**
 * Design tokens for VialChem Labs (Posture A: Clean Clinical — LIGHT variant).
 *
 * v5 LOCKED state (per docs/DECISIONS/locked_override_2026-05-20.md):
 * the runtime-authoritative palette ships in app/globals.css :root. This
 * TypeScript export mirrors those values for component logic that cannot
 * read CSS variables (e.g., motion timings, color references in JS-driven
 * libraries like recharts / pdf-lib).
 *
 * Iron Law 2.21 — design tokens are additive-only EXCEPT under explicit
 * LOCKED_OVERRIDE protocol per Iron Law 2.26/2.37 (which authorized the
 * v3/v4 dark → v5 light migration). The color values below match
 * app/globals.css :root verbatim; non-color tokens (typography, spacing,
 * radius, motion, shadows, gradients, zIndex) are unchanged from v3/v4 +
 * v4-Phase-1 additions.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH per Iron Law
 * 2.5/2.19 + 2.26/2.37).
 */

export const colors = {
  // Surfaces — light theme (matches app/globals.css :root)
  bg: "#fafaf7",
  surface: "#ffffff",
  surfaceStrong: "#f4f4f0",
  surfaceMuted: "rgba(244, 244, 240, 0.7)",
  surfaceElevated: "#ffffff",
  bgInverse: "#0a0e14",

  // Brand accents — cyan-navy (v5 LOCKED)
  accent: "#0f3a5f", // primary deep navy
  accentSoft: "#e8f7fb", // accent tint
  accentGlow: "#06b6d4", // cyan high-key
  accentDeep: "#082842", // pressed
  electric: "#06b6d4",

  // Text — light theme (WCAG AA verified on #fafaf7 bg)
  text: "#0a0e14", // 17:1 ratio
  textMuted: "#4d5663", // 7.1:1 ratio
  textSubtle: "#6b7280", // 4.8:1 ratio

  // Borders — hairline only
  border: "#e6e4dc",
  borderStrong: "#c9c6bb",
  borderFaint: "#efede6",

  // Status pills (always paired with text per A11y rules)
  pillAccent: "#0f3a5f",
  pillInfo: "#06b6d4",
  pillElectric: "#06b6d4",
  pillError: "#b3261e",
} as const;

export const typography = {
  sans: "IBM Plex Sans, system-ui, sans-serif",
  mono: "IBM Plex Mono, ui-monospace, monospace",
  serifItalic: "Newsreader, ui-serif, Georgia, serif",
  scale: {
    heroXl: "clamp(48px, 7vw, 96px)",
    heroLg: "60px",
    headlineLg: "32px",
    headlineMd: "28px",
    headlineSm: "24px",
    titleMd: "20px",
    titleSm: "18px",
    bodyLg: "18px",
    bodyMd: "16px",
    bodySm: "14px",
    caption: "13px",
    monoBody: "14px",
    monoSm: "12px",
    labelUppercase: "11px",
  },
  tracking: {
    label: "0.16em",
    fieldLabel: "0.12em",
  },
} as const;

export const spacing = {
  "2xs": "2px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
  "4xl": "64px",
  "5xl": "96px",
  "6xl": "128px",
  // Phase 1 v4 additions — hero atmospheric breathing room beyond v3.0's 6xl=128px.
  "7xl": "192px",
  "8xl": "256px",
} as const;

export const radius = {
  sm: "4px",
  md: "10px",
  lg: "14px",
  xl: "16px",
  "2xl": "18px",
  full: "999px",
  // Phase 1 v4 addition — clarity alias for `full`. Use `pill` on
  // Pill / Badge components and `full` on round avatars/icons.
  pill: "999px",
} as const;

/**
 * Phase 1 v4 addition — drop-shadow scale for elevation hierarchy.
 *
 * v5 LIGHT theme — shadow values softened from dark-mode opacity ramp
 * (0.32→0.7) to light-mode opacity ramp (0.06→0.16) to read as physical
 * depth on cream #fafaf7 background without becoming dirty/muddy.
 *
 * Usage:
 *   sm  — resting state on interactive cards (1px subtle separation)
 *   md  — hover lift on Card variant=interactive (4px definition)
 *   lg  — Dialog / popover overlay (12px elevation)
 *   xl  — Sheet / drawer surface (24px overlay depth)
 *   2xl — Modal / focused overlay (32px max depth)
 */
export const shadows = {
  sm: "0 1px 2px 0 rgba(15, 58, 95, 0.06)",
  md: "0 4px 12px -2px rgba(15, 58, 95, 0.08)",
  lg: "0 12px 32px -4px rgba(15, 58, 95, 0.10)",
  xl: "0 24px 64px -12px rgba(15, 58, 95, 0.13)",
  "2xl": "0 32px 96px -16px rgba(15, 58, 95, 0.16)",
} as const;

/**
 * Phase 1 v4 addition — gradient token category.
 *
 * v5 LIGHT theme — atmospheric gradients reset to cyan-navy mix on cream;
 * the hero ambient glow uses very low-opacity cyan to avoid heavy tinting.
 */
export const gradients = {
  heroAtmospheric:
    "radial-gradient(ellipse 80% 60% at 80% 0%, rgba(6, 182, 212, 0.06) 0%, transparent 60%), " +
    "radial-gradient(ellipse 60% 40% at 20% 100%, rgba(15, 58, 95, 0.04) 0%, transparent 70%)",
  accentRadial:
    "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
} as const;

export const motion = {
  ease: {
    premiumOut: "cubic-bezier(0.16, 1, 0.3, 1)",
    in: "ease-in",
    move: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
  },
  duration: {
    micro: "80ms",
    short: "200ms",
    medium: "320ms",
    long: "540ms",
    slow: "720ms",
    continuousMin: "14000ms",
    continuousMax: "22000ms",
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
