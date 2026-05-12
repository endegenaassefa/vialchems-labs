// site/lib/design/tokens.ts
// Mogtrix Design System v2 — TypeScript export of color/spacing/type tokens.
// Source of truth: /DESIGN.md and /site/app/globals.css.
// Update both files together when changing any token.

export const color = {
  background: '#020202',
  scaffold: '#050505',
  surface: '#111111',
  surfaceStrong: '#171717',
  surfaceData: '#0a1f24',
  border: '#1f1f1f',
  borderStrong: '#2a2a2a',
  accent: '#7cff00',
  accentSoft: '#b4ff2e',
  acidGlow: '#bfef8f',
  electric: '#22d3ee',
  electricSoft: '#67e8f9',
  mutedBlue: '#7c93a8',
  amber: '#ffb04f',
  error: '#ff4d6d',
  text: 'rgba(255, 255, 255, 0.92)',
  textMuted: 'rgba(255, 255, 255, 0.62)',
  textSubtle: 'rgba(255, 255, 255, 0.36)',
} as const;

export const cssVar = {
  background: 'var(--background)',
  scaffold: 'var(--scaffold)',
  surface: 'var(--surface)',
  surfaceStrong: 'var(--surface-strong)',
  surfaceData: 'var(--surface-data)',
  border: 'var(--border)',
  borderStrong: 'var(--border-strong)',
  accent: 'var(--accent)',
  accentSoft: 'var(--accent-soft)',
  acidGlow: 'var(--acid-glow)',
  electric: 'var(--electric)',
  electricSoft: 'var(--electric-soft)',
  mutedBlue: 'var(--muted-blue)',
  amber: 'var(--amber)',
  error: 'var(--error)',
  text: 'var(--text)',
  textMuted: 'var(--text-muted)',
  textSubtle: 'var(--text-subtle)',
} as const;

export const space = {
  px: '1px',
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

export const type = {
  displayHeroXl: { size: '88px', line: '0.94', letter: '-0.035em', weight: 600, family: 'sans' },
  displayHeroLg: { size: '60px', line: '1.0', letter: '-0.025em', weight: 600, family: 'sans' },
  displayEditorial: { size: '64px', line: '1.0', letter: '-0.005em', weight: 400, family: 'serif', italic: true },
  headlineLg: { size: '32px', line: '1.15', letter: '-0.020em', weight: 600, family: 'sans' },
  headlineMd: { size: '28px', line: '1.18', letter: '-0.018em', weight: 600, family: 'sans' },
  headlineSm: { size: '24px', line: '1.20', letter: '-0.015em', weight: 600, family: 'sans' },
  titleMd: { size: '20px', line: '1.30', letter: '-0.010em', weight: 600, family: 'sans' },
  titleSm: { size: '18px', line: '1.35', letter: '-0.008em', weight: 600, family: 'sans' },
  bodyLg: { size: '18px', line: '1.55', letter: 'normal', weight: 400, family: 'sans' },
  bodyMd: { size: '16px', line: '1.55', letter: 'normal', weight: 400, family: 'sans' },
  bodySm: { size: '14px', line: '1.50', letter: 'normal', weight: 400, family: 'sans' },
  caption: { size: '13px', line: '1.45', letter: 'normal', weight: 400, family: 'sans' },
  monoBody: { size: '14px', line: '1.55', letter: '0.005em', weight: 500, family: 'mono' },
  monoSm: { size: '12px', line: '1.50', letter: '0.020em', weight: 500, family: 'mono' },
  label: { size: '11px', line: '1.30', letterSpacing: '0.16em', weight: 500, family: 'mono', uppercase: true },
} as const;

export const tokens = { color, cssVar, space, radius, type };
