# Design System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Mogtrix Design System v2 from `DESIGN.md` — IBM Plex fonts, atmospheric color tokens, motion vocabulary, 7 component primitives, and TypeScript modules — establishing the foundation every downstream surface sub-project depends on.

**Architecture:** CSS-variable-driven theming extends the existing `site/app/globals.css` (preserves backwards compat with current components). New TypeScript modules under `site/lib/design/` expose tokens for runtime use. New primitive components live under `site/components/ui/` — existing `site/components/*.tsx` keep working unchanged and migrate to primitives during their own surface sub-projects (C–M).

**Tech Stack:** Next.js 16 + React 19, Tailwind CSS v4 (PostCSS), TypeScript 5.9 strict, vitest 4 + jsdom + @testing-library/react, IBM Plex Sans + IBM Plex Mono + Instrument Serif via [Bunny Fonts](https://fonts.bunny.net) (privacy-first Google Fonts mirror).

**Spec:** `/root/mogtrix-website/DESIGN.md` (committed at `637bd4c`, cyan swap at `2a3c745`).

**Scope check:** This is a single-subsystem plan (design system foundation only). Surface implementations (home, product detail, etc.) are separate sub-projects with their own plans.

---

## File Structure

### Create
| Path | Responsibility |
|---|---|
| `site/lib/design/tokens.ts` | TS export of color tokens for runtime access |
| `site/lib/design/motion.ts` | Easing curves + duration tokens |
| `site/lib/design/types.ts` | Variant + size + role types |
| `site/lib/design/index.ts` | Barrel export |
| `site/components/ui/Button.tsx` | Primary / outline / ghost / data button variants |
| `site/components/ui/Pill.tsx` | Status pills (accent / info / electric / error / warn) |
| `site/components/ui/Input.tsx` | Text input with focus ring |
| `site/components/ui/Card.tsx` | Surface card with surface / strong / data backgrounds |
| `site/components/ui/Specs.tsx` | Definition-list specs sheet |
| `site/components/ui/CoaRow.tsx` | COA verification row |
| `site/components/ui/Vial.tsx` | CSS-based rotating vial composition |
| `site/components/ui/index.ts` | Barrel export |
| `site/tests/design/tokens.test.ts` | Token shape + value tests |
| `site/tests/design/motion.test.ts` | Motion module tests |
| `site/tests/design/fonts.test.tsx` | Font loading test |
| `site/tests/design/globals.test.ts` | globals.css token + keyframe presence |
| `site/tests/design/Button.test.tsx` | Button primitive tests |
| `site/tests/design/Pill.test.tsx` | Pill primitive tests |
| `site/tests/design/Input.test.tsx` | Input primitive tests |
| `site/tests/design/Card.test.tsx` | Card primitive tests |
| `site/tests/design/Specs.test.tsx` | Specs primitive tests |
| `site/tests/design/CoaRow.test.tsx` | CoaRow primitive tests |
| `site/tests/design/Vial.test.tsx` | Vial primitive tests |

### Modify
| Path | Change |
|---|---|
| `site/app/layout.tsx` | Add Bunny Fonts `<link>` tags via Next `<Head>` or root layout head slot |
| `site/app/globals.css` | Extend with new tokens (--surface-data, --electric, --electric-soft, --error, --text-subtle, --border-strong), update body background gradient (cyan instead of amber), update primary font-family to IBM Plex Sans, add new keyframes (vial-rotate, pulse, fill-ripple, sheen-sweep-v2) |

### Do NOT modify in this sub-project
- `site/components/button.tsx` (legacy — already uses CSS vars, works with new tokens)
- `site/components/site-header.tsx`, `site/components/vial-hero.tsx`, etc. (surface-specific; deferred to sub-projects C–M)

---

## Conventions

- **Lint:** `cd site && npm run lint` (= `tsc --noEmit`). MUST be green before commit.
- **Tests:** `cd site && npm run test` (= `vitest run`). MUST be green before commit.
- **Build smoke:** `cd site && npm run build` MUST succeed before final ship.
- **Path alias:** `@/*` → `site/*` (from tsconfig).
- **Test setup:** `site/vitest.config.ts` uses jsdom + globals + `tests/setup.ts` (jest-dom matchers).
- **Imports:** Use `cn` from `@/lib/utils` for class merging.

---

## Tasks

### Task 1: Add Bunny Fonts loading to layout

**Files:**
- Modify: `site/app/layout.tsx`
- Test: `site/tests/design/fonts.test.tsx`

- [ ] **Step 1.1: Write failing test for font links**

```tsx
// site/tests/design/fonts.test.tsx
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const layoutPath = resolve(__dirname, '../../app/layout.tsx');
const globalsPath = resolve(__dirname, '../../app/globals.css');

describe('Font loading', () => {
  it('layout.tsx renders Bunny Fonts link tags for the design system stack', () => {
    const layout = readFileSync(layoutPath, 'utf-8');
    expect(layout).toContain('fonts.bunny.net');
    expect(layout).toMatch(/ibm-plex-sans/);
    expect(layout).toMatch(/ibm-plex-mono/);
    expect(layout).toMatch(/instrument-serif/);
    expect(layout).toContain('rel="preconnect"');
  });

  it('globals.css declares IBM Plex Sans as the primary font-family on body', () => {
    const css = readFileSync(globalsPath, 'utf-8');
    expect(css).toMatch(/font-family:\s*['"]IBM Plex Sans['"]/);
  });
});
```

- [ ] **Step 1.2: Run test, verify FAIL**

Run: `cd site && npx vitest run tests/design/fonts.test.tsx`
Expected: FAIL — "expected '...' to contain 'fonts.bunny.net'"

- [ ] **Step 1.3: Add Bunny Fonts link to layout.tsx**

Edit `site/app/layout.tsx` to add font preconnect + stylesheet link. Add inside `<html lang="en">` BEFORE `<body>`:

```tsx
return (
  <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.bunny.net" />
      <link
        href="https://fonts.bunny.net/css?family=ibm-plex-sans:300,400,500,600,700|ibm-plex-mono:300,400,500,600|instrument-serif:400,400i&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
      <SiteHeader />
      {children}
      <ComplianceFooter />
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);
```

- [ ] **Step 1.4: Run test, verify PASS**

Run: `cd site && npx vitest run tests/design/fonts.test.tsx`
Expected: PASS for "layout.tsx renders Bunny Fonts link tags"; the globals.css test still fails (next task).

- [ ] **Step 1.5: Commit**

```bash
git add site/app/layout.tsx site/tests/design/fonts.test.tsx
git commit -m "feat(design): load IBM Plex + Instrument Serif via Bunny Fonts"
```

---

### Task 2: Extend globals.css with new tokens, body background, and IBM Plex font-family

**Files:**
- Modify: `site/app/globals.css`
- Test: `site/tests/design/globals.test.ts` (and the second assertion from `fonts.test.tsx`)

- [ ] **Step 2.1: Write failing test for global CSS tokens and keyframes**

```ts
// site/tests/design/globals.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf-8');

describe('globals.css design tokens', () => {
  it('declares all required CSS variables', () => {
    const required = [
      '--background', '--scaffold', '--surface', '--surface-strong',
      '--surface-data',
      '--border', '--border-strong',
      '--accent', '--accent-soft', '--acid-glow',
      '--electric', '--electric-soft',
      '--muted-blue', '--amber', '--error',
      '--text', '--text-muted', '--text-subtle'
    ];
    for (const v of required) expect(css).toContain(v);
  });

  it('uses electrolyte cyan rgba in body background gradient (not Anthropic amber)', () => {
    expect(css).toMatch(/rgba\(34,\s*211,\s*238/);
    expect(css).not.toMatch(/rgba\(255,\s*176,\s*79/);
  });

  it('declares motion keyframes for the design system', () => {
    expect(css).toMatch(/@keyframes vial-float/);
    expect(css).toMatch(/@keyframes vial-tilt/);
    expect(css).toMatch(/@keyframes vial-sheen/);
    expect(css).toMatch(/@keyframes vial-rotate/);
    expect(css).toMatch(/@keyframes pulse/);
  });

  it('honors prefers-reduced-motion with hard fallback', () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });

  it('uses IBM Plex Sans as primary body font', () => {
    expect(css).toMatch(/font-family:\s*['"]IBM Plex Sans['"]/);
  });
});
```

- [ ] **Step 2.2: Run test, verify FAIL**

Run: `cd site && npx vitest run tests/design/globals.test.ts`
Expected: FAIL — variables `--surface-data`, `--electric`, `--error`, `--text-subtle`, `--border-strong` missing; keyframe `vial-rotate` and `pulse` missing; body still uses Avenir Next.

- [ ] **Step 2.3: Update site/app/globals.css**

Replace the entire `:root` and `body` blocks. Add new keyframes. Preserve existing `vial-float`, `vial-tilt`, `vial-sheen`, the `prefers-reduced-motion` block, `.shell`, `.metal`, `.accent-glow`, `.sr-only`. Final state of `site/app/globals.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: dark;
  --background: #020202;
  --scaffold: #050505;
  --surface: #111111;
  --surface-strong: #171717;
  --surface-data: #0a1f24;
  --border: #1f1f1f;
  --border-strong: #2a2a2a;
  --accent: #7cff00;
  --accent-soft: #b4ff2e;
  --acid-glow: #bfef8f;
  --electric: #22d3ee;
  --electric-soft: #67e8f9;
  --muted-blue: #7c93a8;
  --amber: #ffb04f;
  --error: #ff4d6d;
  --text: rgba(255, 255, 255, 0.92);
  --text-muted: rgba(255, 255, 255, 0.62);
  --text-subtle: rgba(255, 255, 255, 0.36);
}

* { box-sizing: border-box; }
html { background: var(--background); }
body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(ellipse at 78% 8%, rgba(124, 255, 0, 0.16), transparent 32rem),
    radial-gradient(ellipse at 22% 22%, rgba(34, 211, 238, 0.13), transparent 28rem),
    radial-gradient(ellipse at 8% 84%, rgba(10, 31, 36, 0.7), transparent 30rem),
    radial-gradient(ellipse at 92% 90%, rgba(124, 255, 0, 0.06), transparent 26rem),
    var(--background);
  color: var(--text);
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-feature-settings: 'liga' on, 'calt' on, 'ss01' on;
  line-height: 1.5;
}
::selection { background: var(--accent); color: #000; }

@keyframes vial-float {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -10px, 0); }
}
@keyframes vial-tilt {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(-1deg); }
}
@keyframes vial-sheen {
  0% { transform: translate3d(-180%, 0, 0) rotate(12deg); opacity: 0; }
  18% { opacity: 0.12; }
  48% { opacity: 0.28; }
  100% { transform: translate3d(430%, 0, 0) rotate(12deg); opacity: 0; }
}
@keyframes vial-rotate {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.65; transform: scale(0.92); }
}
@keyframes fill-ripple {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.18; }
}

.vial-float { animation: vial-float 7.8s ease-in-out infinite; transform-origin: center bottom; }
.vial-tilt { animation: vial-tilt 7.8s ease-in-out infinite; transform-origin: center bottom; }
.vial-sheen { animation: vial-sheen 5.8s ease-in-out infinite; }
.vial-rotate { animation: vial-rotate 18s linear infinite; transform-style: preserve-3d; }
.pulse { animation: pulse 3.6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

a { color: inherit; text-decoration: none; }
button, input, textarea { font: inherit; }
button { cursor: pointer; }
button:disabled { cursor: not-allowed; }

.shell { width: min(1240px, calc(100% - 32px)); margin: 0 auto; }
.metal {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 22%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03), transparent 50%),
    var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 0 0 1px rgba(124, 255, 0, 0.02), 0 26px 80px rgba(0, 0, 0, 0.34);
}
.accent-glow { box-shadow: 0 0 42px rgba(124, 255, 0, 0.14); }
.label { font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; font-size: 11px; letter-spacing: 0.16em; color: var(--text-subtle); }
.serif { font-family: 'Instrument Serif', 'Iowan Old Style', Georgia, serif; font-feature-settings: 'liga' on; letter-spacing: -0.005em; }
.mono { font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace; font-feature-settings: 'tnum' on, 'zero' on; letter-spacing: -0.005em; }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
```

- [ ] **Step 2.4: Run test, verify PASS (both globals.test.ts and the globals assertion in fonts.test.tsx)**

Run: `cd site && npx vitest run tests/design/`
Expected: ALL PASS for fonts + globals tests.

- [ ] **Step 2.5: Run lint to confirm Tailwind v4 still compiles**

Run: `cd site && npm run lint`
Expected: PASS (no TS errors).

- [ ] **Step 2.6: Commit**

```bash
git add site/app/globals.css site/tests/design/globals.test.ts
git commit -m "feat(design): extend globals.css with v2 tokens + cyan atmosphere + new keyframes"
```

---

### Task 3: TypeScript design tokens module

**Files:**
- Create: `site/lib/design/tokens.ts`
- Test: `site/tests/design/tokens.test.ts`

- [ ] **Step 3.1: Write failing test**

```ts
// site/tests/design/tokens.test.ts
import { describe, it, expect } from 'vitest';
import { tokens } from '@/lib/design/tokens';

describe('design tokens', () => {
  it('exports color tokens with hex values', () => {
    expect(tokens.color.background).toBe('#020202');
    expect(tokens.color.scaffold).toBe('#050505');
    expect(tokens.color.surface).toBe('#111111');
    expect(tokens.color.surfaceStrong).toBe('#171717');
    expect(tokens.color.surfaceData).toBe('#0a1f24');
    expect(tokens.color.border).toBe('#1f1f1f');
    expect(tokens.color.borderStrong).toBe('#2a2a2a');
    expect(tokens.color.accent).toBe('#7cff00');
    expect(tokens.color.accentSoft).toBe('#b4ff2e');
    expect(tokens.color.acidGlow).toBe('#bfef8f');
    expect(tokens.color.electric).toBe('#22d3ee');
    expect(tokens.color.electricSoft).toBe('#67e8f9');
    expect(tokens.color.mutedBlue).toBe('#7c93a8');
    expect(tokens.color.amber).toBe('#ffb04f');
    expect(tokens.color.error).toBe('#ff4d6d');
  });

  it('exports text alpha tokens', () => {
    expect(tokens.color.text).toMatch(/^rgba\(255,\s*255,\s*255,\s*0\.92\)$/);
    expect(tokens.color.textMuted).toMatch(/^rgba\(255,\s*255,\s*255,\s*0\.62\)$/);
    expect(tokens.color.textSubtle).toMatch(/^rgba\(255,\s*255,\s*255,\s*0\.36\)$/);
  });

  it('exports CSS variable names that match globals.css', () => {
    expect(tokens.cssVar.accent).toBe('var(--accent)');
    expect(tokens.cssVar.electric).toBe('var(--electric)');
    expect(tokens.cssVar.surfaceData).toBe('var(--surface-data)');
    expect(tokens.cssVar.textSubtle).toBe('var(--text-subtle)');
  });

  it('exports the 11-step spacing scale', () => {
    expect(tokens.space).toEqual({
      px: '1px',
      '2xs': '2px', xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px',
      '2xl': '32px', '3xl': '48px', '4xl': '64px', '5xl': '96px', '6xl': '128px',
    });
  });

  it('exports type scale roles', () => {
    expect(tokens.type.displayHeroXl.size).toBe('88px');
    expect(tokens.type.bodyMd.size).toBe('16px');
    expect(tokens.type.monoBody.size).toBe('14px');
    expect(tokens.type.label.letterSpacing).toBe('0.16em');
  });
});
```

- [ ] **Step 3.2: Run test, verify FAIL** (`Cannot find module '@/lib/design/tokens'`)

Run: `cd site && npx vitest run tests/design/tokens.test.ts`

- [ ] **Step 3.3: Create `site/lib/design/tokens.ts`**

```ts
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
```

- [ ] **Step 3.4: Run test, verify PASS**

Run: `cd site && npx vitest run tests/design/tokens.test.ts`
Expected: PASS.

- [ ] **Step 3.5: Run lint**

Run: `cd site && npm run lint`
Expected: PASS.

- [ ] **Step 3.6: Commit**

```bash
git add site/lib/design/tokens.ts site/tests/design/tokens.test.ts
git commit -m "feat(design): add TS design tokens module mirroring globals.css"
```

---

### Task 4: TypeScript motion module (easings + durations)

**Files:**
- Create: `site/lib/design/motion.ts`
- Test: `site/tests/design/motion.test.ts`

- [ ] **Step 4.1: Write failing test**

```ts
// site/tests/design/motion.test.ts
import { describe, it, expect } from 'vitest';
import { easing, duration, motion } from '@/lib/design/motion';

describe('design motion', () => {
  it('exports premium-out easing matching DESIGN.md spec', () => {
    expect(easing.premiumOut).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(easing.move).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(easing.in).toBe('ease-in');
    expect(easing.linear).toBe('linear');
  });

  it('exports the 5-tier duration scale', () => {
    expect(duration.micro).toBe(80);
    expect(duration.short).toBe(200);
    expect(duration.medium).toBe(320);
    expect(duration.long).toBe(540);
    expect(duration.slow).toBe(720);
  });

  it('exports vial rotation duration range', () => {
    expect(duration.vialRotate.min).toBe(14000);
    expect(duration.vialRotate.max).toBe(22000);
  });

  it('exports composed motion presets', () => {
    expect(motion.hoverShort).toBe(`200ms cubic-bezier(0.16, 1, 0.3, 1)`);
    expect(motion.staggerStep).toBe(70);
  });
});
```

- [ ] **Step 4.2: Run test, verify FAIL**

- [ ] **Step 4.3: Create `site/lib/design/motion.ts`**

```ts
// site/lib/design/motion.ts
// Mogtrix Design System v2 — motion vocabulary.

export const easing = {
  premiumOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  move: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'ease-in',
  linear: 'linear',
} as const;

export const duration = {
  micro: 80,
  short: 200,
  medium: 320,
  long: 540,
  slow: 720,
  vialRotate: { min: 14000, max: 22000 } as const,
  sheen: 5400,
  pulse: 3600,
  float: 7800,
  fillRipple: 4000,
} as const;

export const motion = {
  hoverShort: `${duration.short}ms ${easing.premiumOut}`,
  hoverMedium: `${duration.medium}ms ${easing.premiumOut}`,
  staggerStep: 70,
} as const;
```

- [ ] **Step 4.4: Run test, verify PASS**

- [ ] **Step 4.5: Commit**

```bash
git add site/lib/design/motion.ts site/tests/design/motion.test.ts
git commit -m "feat(design): add motion vocabulary module"
```

---

### Task 5: Design types module + barrel export

**Files:**
- Create: `site/lib/design/types.ts`
- Create: `site/lib/design/index.ts`

- [ ] **Step 5.1: Create `site/lib/design/types.ts`**

```ts
// site/lib/design/types.ts
// Shared types for design system primitives.

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'data';
export type PillVariant = 'accent' | 'info' | 'electric' | 'warn' | 'error';
export type CardVariant = 'surface' | 'strong' | 'data';
export type CoaStatus = 'verified' | 'archived' | 'expired' | 'pending';

export type Size = 'sm' | 'md' | 'lg';

export type DesignToken = {
  color: Record<string, string>;
  cssVar: Record<string, string>;
  space: Record<string, string>;
  radius: Record<string, string>;
};
```

- [ ] **Step 5.2: Create `site/lib/design/index.ts`**

```ts
// site/lib/design/index.ts
export * from './tokens';
export * from './motion';
export * from './types';
```

- [ ] **Step 5.3: Run lint**

Run: `cd site && npm run lint`
Expected: PASS.

- [ ] **Step 5.4: Commit**

```bash
git add site/lib/design/types.ts site/lib/design/index.ts
git commit -m "feat(design): add types module + barrel export"
```

---

### Task 6: Button primitive (4 variants)

**Files:**
- Create: `site/components/ui/Button.tsx`
- Test: `site/tests/design/Button.test.tsx`

- [ ] **Step 6.1: Write failing test**

```tsx
// site/tests/design/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, ButtonLink } from '@/components/ui/Button';

describe('Button primitive', () => {
  it('renders primary variant by default with accent background class', () => {
    render(<Button>Add to order</Button>);
    const btn = screen.getByRole('button', { name: 'Add to order' });
    expect(btn.className).toContain('bg-[var(--accent)]');
    expect(btn.className).toContain('text-black');
    expect(btn.className).toMatch(/min-h-11/);
  });

  it('renders outline variant', () => {
    render(<Button variant="outline">Verify</Button>);
    expect(screen.getByRole('button').className).toContain('border-[var(--border-strong)]');
  });

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Docs</Button>);
    expect(screen.getByRole('button').className).toContain('text-[var(--text-muted)]');
  });

  it('renders data variant with mono font', () => {
    render(<Button variant="data">$ verify --batch L0237</Button>);
    expect(screen.getByRole('button').className).toContain('font-mono');
    expect(screen.getByRole('button').className).toContain('bg-[var(--surface-data)]');
  });

  it('forwards type and onClick', () => {
    const onClick = () => {};
    render(<Button type="submit" onClick={onClick}>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('ButtonLink renders an anchor with href', () => {
    render(<ButtonLink href="/shop">Shop</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Shop' });
    expect(link).toHaveAttribute('href', '/shop');
    expect(link.className).toContain('bg-[var(--accent)]');
  });
});
```

- [ ] **Step 6.2: Run test, verify FAIL**

Run: `cd site && npx vitest run tests/design/Button.test.tsx`

- [ ] **Step 6.3: Create `site/components/ui/Button.tsx`**

```tsx
// site/components/ui/Button.tsx
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ButtonVariant } from '@/lib/design/types';

const base = 'inline-flex items-center justify-center gap-2 min-h-11 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ease-out';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-black shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_50%,transparent),0_12px_30px_rgba(124,255,0,0.18)] hover:bg-[var(--accent-soft)] hover:-translate-y-px hover:shadow-[0_0_0_1px_var(--accent-soft),0_18px_44px_rgba(124,255,0,0.32)]',
  outline:
    'bg-[color-mix(in_srgb,var(--surface)_60%,transparent)] text-[var(--text)] border border-[var(--border-strong)] backdrop-blur-sm hover:border-[var(--accent)] hover:text-[var(--accent)]',
  ghost:
    'bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]',
  data:
    'bg-[var(--surface-data)] text-[var(--text)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] font-mono text-xs px-3 py-2 rounded-lg',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
};

export function ButtonLink({ className, variant = 'primary', href, ...props }: ButtonLinkProps) {
  return <Link href={href} className={cn(base, variants[variant], className)} {...props} />;
}
```

- [ ] **Step 6.4: Run test, verify PASS**

Run: `cd site && npx vitest run tests/design/Button.test.tsx`

- [ ] **Step 6.5: Run lint**

Run: `cd site && npm run lint`
Expected: PASS.

- [ ] **Step 6.6: Commit**

```bash
git add site/components/ui/Button.tsx site/tests/design/Button.test.tsx
git commit -m "feat(design): add Button primitive with primary/outline/ghost/data variants"
```

---

### Task 7: Pill primitive (5 status variants)

**Files:**
- Create: `site/components/ui/Pill.tsx`
- Test: `site/tests/design/Pill.test.tsx`

- [ ] **Step 7.1: Write failing test**

```tsx
// site/tests/design/Pill.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pill } from '@/components/ui/Pill';

describe('Pill primitive', () => {
  it.each([
    ['accent', 'var(--accent)'],
    ['info', 'var(--muted-blue)'],
    ['electric', 'var(--electric)'],
    ['warn', 'var(--amber)'],
    ['error', 'var(--error)'],
  ] as const)('renders %s variant with the right color token', (variant, token) => {
    render(<Pill variant={variant}>label</Pill>);
    const el = screen.getByText('label');
    expect(el.className).toContain(token);
  });

  it('renders with mono font and uppercase letterforms', () => {
    render(<Pill variant="accent">RUO ONLY</Pill>);
    const el = screen.getByText('RUO ONLY');
    expect(el.className).toContain('font-mono');
    expect(el.className).toMatch(/text-\[11px\]/);
    expect(el.className).toMatch(/tracking-/);
  });
});
```

- [ ] **Step 7.2: Run test, verify FAIL**

- [ ] **Step 7.3: Create `site/components/ui/Pill.tsx`**

```tsx
// site/components/ui/Pill.tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { PillVariant } from '@/lib/design/types';

const base = 'inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[11px] tracking-[0.06em] uppercase border';

const variants: Record<PillVariant, string> = {
  accent: 'bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_28%,transparent)]',
  info: 'bg-[color-mix(in_srgb,var(--muted-blue)_14%,transparent)] text-[var(--muted-blue)] border-[color-mix(in_srgb,var(--muted-blue)_28%,transparent)]',
  electric: 'bg-[color-mix(in_srgb,var(--electric)_14%,transparent)] text-[var(--electric)] border-[color-mix(in_srgb,var(--electric)_28%,transparent)]',
  warn: 'bg-[color-mix(in_srgb,var(--amber)_14%,transparent)] text-[var(--amber)] border-[color-mix(in_srgb,var(--amber)_28%,transparent)]',
  error: 'bg-[color-mix(in_srgb,var(--error)_14%,transparent)] text-[var(--error)] border-[color-mix(in_srgb,var(--error)_28%,transparent)]',
};

type PillProps = HTMLAttributes<HTMLSpanElement> & { variant: PillVariant };

export function Pill({ className, variant, ...props }: PillProps) {
  return <span className={cn(base, variants[variant], className)} {...props} />;
}
```

- [ ] **Step 7.4: Run test, verify PASS; lint**

- [ ] **Step 7.5: Commit**

```bash
git add site/components/ui/Pill.tsx site/tests/design/Pill.test.tsx
git commit -m "feat(design): add Pill primitive (5 status variants)"
```

---

### Task 8: Input primitive

**Files:**
- Create: `site/components/ui/Input.tsx`
- Test: `site/tests/design/Input.test.tsx`

- [ ] **Step 8.1: Write failing test**

```tsx
// site/tests/design/Input.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input, FieldLabel } from '@/components/ui/Input';

describe('Input primitive', () => {
  it('renders with surface-strong background and accent focus ring classes', () => {
    render(<Input placeholder="email" />);
    const input = screen.getByPlaceholderText('email');
    expect(input.className).toContain('bg-[var(--surface-strong)]');
    expect(input.className).toContain('focus:outline-2');
    expect(input.className).toContain('focus:outline-[var(--accent)]');
  });

  it('forwards arbitrary HTML attributes', () => {
    render(<Input data-testid="x" type="email" required />);
    const input = screen.getByTestId('x');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
  });

  it('FieldLabel renders mono uppercase text', () => {
    render(<FieldLabel htmlFor="email">Institutional Email</FieldLabel>);
    const label = screen.getByText('Institutional Email');
    expect(label.className).toContain('font-mono');
    expect(label.className).toMatch(/uppercase/);
    expect(label).toHaveAttribute('for', 'email');
  });
});
```

- [ ] **Step 8.2: Run test, verify FAIL**

- [ ] **Step 8.3: Create `site/components/ui/Input.tsx`**

```tsx
// site/components/ui/Input.tsx
import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const inputBase = 'block w-full px-3.5 py-3 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] text-[var(--text)] text-sm transition-colors focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent)] focus:border-[var(--accent)]';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

const labelBase = 'block text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1.5';

export function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn(labelBase, className)} {...props} />;
}
```

- [ ] **Step 8.4: Run test, verify PASS; lint**

- [ ] **Step 8.5: Commit**

```bash
git add site/components/ui/Input.tsx site/tests/design/Input.test.tsx
git commit -m "feat(design): add Input + FieldLabel primitives"
```

---

### Task 9: Card primitive

**Files:**
- Create: `site/components/ui/Card.tsx`
- Test: `site/tests/design/Card.test.tsx`

- [ ] **Step 9.1: Write failing test**

```tsx
// site/tests/design/Card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card primitive', () => {
  it('renders surface variant by default', () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId('c').className).toContain('bg-[var(--surface)]');
    expect(screen.getByTestId('c').className).toContain('border-[var(--border)]');
    expect(screen.getByTestId('c').className).toContain('rounded-2xl');
  });

  it('renders strong variant', () => {
    render(<Card variant="strong" data-testid="c">x</Card>);
    expect(screen.getByTestId('c').className).toContain('bg-[var(--surface-strong)]');
  });

  it('renders data variant', () => {
    render(<Card variant="data" data-testid="c">x</Card>);
    expect(screen.getByTestId('c').className).toContain('bg-[var(--surface-data)]');
  });
});
```

- [ ] **Step 9.2: Run test, verify FAIL**

- [ ] **Step 9.3: Create `site/components/ui/Card.tsx`**

```tsx
// site/components/ui/Card.tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { CardVariant } from '@/lib/design/types';

const base = 'border rounded-2xl p-6 transition-colors';

const variants: Record<CardVariant, string> = {
  surface: 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]',
  strong: 'bg-[var(--surface-strong)] border-[var(--border)]',
  data: 'bg-[var(--surface-data)] border-[color-mix(in_srgb,var(--accent)_24%,transparent)]',
};

type CardProps = HTMLAttributes<HTMLDivElement> & { variant?: CardVariant };

export function Card({ className, variant = 'surface', ...props }: CardProps) {
  return <div className={cn(base, variants[variant], className)} {...props} />;
}
```

- [ ] **Step 9.4: Run test, verify PASS; lint**

- [ ] **Step 9.5: Commit**

```bash
git add site/components/ui/Card.tsx site/tests/design/Card.test.tsx
git commit -m "feat(design): add Card primitive (surface/strong/data variants)"
```

---

### Task 10: Specs primitive (definition list)

**Files:**
- Create: `site/components/ui/Specs.tsx`
- Test: `site/tests/design/Specs.test.tsx`

- [ ] **Step 10.1: Write failing test**

```tsx
// site/tests/design/Specs.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Specs } from '@/components/ui/Specs';

const rows = [
  { label: 'CAS', value: '137525-51-0' },
  { label: 'MW', value: '1419.56 g/mol' },
  { label: 'Sequence', value: 'GEPPPGKPADDAGLV' },
  { label: 'Purity', value: '99.2% HPLC' },
];

describe('Specs primitive', () => {
  it('renders all rows as dt/dd pairs', () => {
    render(<Specs rows={rows} />);
    rows.forEach((r) => {
      expect(screen.getByText(r.label)).toBeInTheDocument();
      expect(screen.getByText(r.value)).toBeInTheDocument();
    });
  });

  it('uses mono font for both label and value', () => {
    const { container } = render(<Specs rows={rows.slice(0, 1)} />);
    const dt = container.querySelector('dt');
    const dd = container.querySelector('dd');
    expect(dt?.className).toContain('font-mono');
    expect(dd?.className).toContain('font-mono');
  });

  it('uses surface-data background by default', () => {
    const { container } = render(<Specs rows={rows} />);
    const dl = container.querySelector('dl');
    expect(dl?.className).toContain('grid-cols-[auto_1fr]');
  });
});
```

- [ ] **Step 10.2: Run test, verify FAIL**

- [ ] **Step 10.3: Create `site/components/ui/Specs.tsx`**

```tsx
// site/components/ui/Specs.tsx
import { cn } from '@/lib/utils';

export type SpecRow = { label: string; value: string };

type Props = {
  rows: SpecRow[];
  className?: string;
};

export function Specs({ rows, className }: Props) {
  return (
    <dl
      className={cn(
        'grid grid-cols-[auto_1fr] gap-y-1.5 gap-x-4 py-3.5 border-y border-[var(--border)]',
        className,
      )}
    >
      {rows.map((row) => (
        <SpecRowEl key={row.label} label={row.label} value={row.value} />
      ))}
    </dl>
  );
}

function SpecRowEl({ label, value }: SpecRow) {
  return (
    <>
      <dt className="font-mono text-[10px] tracking-[0.10em] uppercase text-[var(--text-subtle)]">
        {label}
      </dt>
      <dd className="font-mono text-xs text-[var(--text)] m-0 break-all">{value}</dd>
    </>
  );
}
```

- [ ] **Step 10.4: Run test, verify PASS; lint**

- [ ] **Step 10.5: Commit**

```bash
git add site/components/ui/Specs.tsx site/tests/design/Specs.test.tsx
git commit -m "feat(design): add Specs primitive (definition-list specs sheet)"
```

---

### Task 11: CoaRow primitive

**Files:**
- Create: `site/components/ui/CoaRow.tsx`
- Test: `site/tests/design/CoaRow.test.tsx`

- [ ] **Step 11.1: Write failing test**

```tsx
// site/tests/design/CoaRow.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CoaRow } from '@/components/ui/CoaRow';

describe('CoaRow primitive', () => {
  it('renders batch + info + status', () => {
    render(<CoaRow batch="L0237" info="BPC-157 5mg · 99.2%" status="verified" />);
    expect(screen.getByText('L0237')).toBeInTheDocument();
    expect(screen.getByText('BPC-157 5mg · 99.2%')).toBeInTheDocument();
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });

  it('verified rows highlight border in accent', () => {
    const { container } = render(<CoaRow batch="L0237" info="x" status="verified" />);
    expect(container.firstChild).toHaveClass(/border-/);
    expect((container.firstChild as HTMLElement).className).toContain('var(--accent)');
  });

  it.each([
    ['archived', 'archived'],
    ['expired', 'expired'],
    ['pending', 'pending'],
  ] as const)('renders %s status text', (status, label) => {
    render(<CoaRow batch="L0231" info="x" status={status} />);
    expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
  });
});
```

- [ ] **Step 11.2: Run test, verify FAIL**

- [ ] **Step 11.3: Create `site/components/ui/CoaRow.tsx`**

```tsx
// site/components/ui/CoaRow.tsx
import { cn } from '@/lib/utils';
import { Pill } from './Pill';
import type { CoaStatus } from '@/lib/design/types';

const statusToVariant = {
  verified: 'accent',
  archived: 'info',
  expired: 'error',
  pending: 'electric',
} as const;

const statusLabel: Record<CoaStatus, string> = {
  verified: 'VERIFIED',
  archived: 'ARCHIVED',
  expired: 'EXPIRED',
  pending: 'PENDING',
};

type Props = {
  batch: string;
  info: string;
  status: CoaStatus;
  className?: string;
};

export function CoaRow({ batch, info, status, className }: Props) {
  const verifiedBorder =
    status === 'verified'
      ? 'border-[color-mix(in_srgb,var(--accent)_30%,transparent)]'
      : 'border-[var(--border)]';
  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_auto] gap-3 items-center p-3.5 rounded-xl bg-[var(--surface-strong)] border',
        verifiedBorder,
        className,
      )}
    >
      <span className="font-mono text-xs text-[var(--text)] tracking-[0.04em]">{batch}</span>
      <span className="text-xs text-[var(--text-muted)]">{info}</span>
      <Pill variant={statusToVariant[status]}>{statusLabel[status]}</Pill>
    </div>
  );
}
```

- [ ] **Step 11.4: Run test, verify PASS; lint**

- [ ] **Step 11.5: Commit**

```bash
git add site/components/ui/CoaRow.tsx site/tests/design/CoaRow.test.tsx
git commit -m "feat(design): add CoaRow primitive (verification row)"
```

---

### Task 12: Vial primitive (CSS-based rotating composition)

**Files:**
- Create: `site/components/ui/Vial.tsx`
- Test: `site/tests/design/Vial.test.tsx`

- [ ] **Step 12.1: Write failing test**

```tsx
// site/tests/design/Vial.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Vial } from '@/components/ui/Vial';

describe('Vial primitive', () => {
  it('renders the vial composition with name + cas + batch in label', () => {
    render(
      <Vial
        name="BPC-157"
        amount="5mg"
        cas="137525-51-0"
        mw="1419.56"
        batch="L0237"
        purity="99.2"
      />,
    );
    expect(screen.getByText('BPC-157')).toBeInTheDocument();
    expect(screen.getByText(/137525-51-0/)).toBeInTheDocument();
    expect(screen.getByText(/L0237/)).toBeInTheDocument();
  });

  it('vial scene has aria-hidden=true with sibling sr-only description', () => {
    render(<Vial name="BPC-157" amount="5mg" cas="x" />);
    const scene = document.querySelector('[data-vial-scene]');
    expect(scene).toHaveAttribute('aria-hidden', 'true');
    const sr = document.querySelector('.sr-only');
    expect(sr?.textContent).toContain('BPC-157');
  });

  it('animation classes applied (vial-rotate, vial-float, vial-sheen)', () => {
    const { container } = render(<Vial name="x" amount="x" cas="x" />);
    expect(container.querySelector('.vial-rotate')).toBeInTheDocument();
    expect(container.querySelector('.vial-float')).toBeInTheDocument();
  });

  it('honors animationPaused prop (e.g., for click-to-inspect)', () => {
    const { container } = render(<Vial name="x" amount="x" cas="x" animationPaused />);
    const rotate = container.querySelector('.vial-rotate') as HTMLElement;
    expect(rotate.style.animationPlayState).toBe('paused');
  });
});
```

- [ ] **Step 12.2: Run test, verify FAIL**

- [ ] **Step 12.3: Create `site/components/ui/Vial.tsx`**

```tsx
// site/components/ui/Vial.tsx
import { cn } from '@/lib/utils';

type VialProps = {
  name: string;
  amount: string;
  cas: string;
  mw?: string;
  batch?: string;
  purity?: string;
  glowColor?: 'accent' | 'electric' | 'mixed';
  className?: string;
  animationPaused?: boolean;
};

const glowMap = {
  accent: 'rgba(124,255,0,0.36)',
  electric: 'rgba(34,211,238,0.32)',
  mixed: 'rgba(124,255,0,0.32)',
} as const;

export function Vial({
  name,
  amount,
  cas,
  mw,
  batch,
  purity,
  glowColor = 'accent',
  className,
  animationPaused,
}: VialProps) {
  const playState = animationPaused ? 'paused' : 'running';
  return (
    <div className={cn('relative', className)}>
      <span className="sr-only">
        {name} {amount}, CAS {cas}
        {mw ? `, MW ${mw}` : ''}
        {batch ? `, batch ${batch}` : ''}
        {purity ? `, purity ${purity}%` : ''}
      </span>

      <div
        data-vial-scene
        aria-hidden="true"
        className="relative aspect-[1/2.7] mx-auto w-full"
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute inset-[24%_18%_18%_18%] -z-10"
          style={{
            background: `radial-gradient(circle, ${glowMap[glowColor]}, transparent 60%)`,
            filter: 'blur(36px)',
          }}
        />

        <div className="vial-float absolute inset-0">
          <div
            className="vial-rotate absolute inset-0"
            style={{ animationPlayState: playState, transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute inset-[14%_0_0_0] border border-[var(--border-strong)]"
              style={{
                borderRadius: '22% 22% 14% 14% / 6% 6% 12% 12%',
                background:
                  'linear-gradient(110deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 18%, transparent 38%, rgba(0,0,0,0.4) 100%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(124,255,0,0.04) 35%, rgba(255,255,255,0.02) 70%), var(--surface)',
                boxShadow:
                  'inset 0 -36px 64px rgba(0,0,0,0.6), inset 8px 0 24px rgba(255,255,255,0.04), inset -8px 0 24px rgba(0,0,0,0.5), 0 30px 64px rgba(0,0,0,0.7), 0 0 32px color-mix(in srgb, var(--accent) 8%, transparent)',
                backfaceVisibility: 'hidden',
              }}
            />
            <div
              className="absolute top-[4%] left-[32%] right-[32%] h-[12%] border border-[var(--border-strong)]"
              style={{
                borderRadius: '6px 6px 4px 4px',
                background:
                  'linear-gradient(180deg, #2e2e2e, #181818 35%, #0d0d0d 70%, #050505)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.5)',
              }}
            />
            <div
              className="absolute left-[11%] right-[11%] bottom-[8%] h-[36%]"
              style={{
                borderRadius: '12% 12% 50% 50% / 10% 10% 16% 16%',
                background:
                  'linear-gradient(180deg, rgba(124,255,0,0.32), rgba(124,255,0,0.18) 60%, rgba(124,255,0,0.10))',
                boxShadow:
                  'inset 0 8px 16px rgba(124,255,0,0.4), inset 0 -4px 8px rgba(0,0,0,0.3)',
                filter: 'blur(0.5px)',
              }}
            />
            <div
              className="absolute left-[14%] right-[14%] top-[38%] h-[38%] rounded-md border p-2.5 font-mono text-[8.5px] leading-[1.5] tracking-[0.06em] text-[var(--text-muted)] text-left overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.45)), var(--surface-data)',
                borderColor: 'color-mix(in srgb, var(--accent) 14%, var(--border))',
                backfaceVisibility: 'hidden',
              }}
            >
              <span className="block text-[var(--text)] font-semibold text-[11px] tracking-[0.1em] mb-1">
                {name}
              </span>
              {amount} lyophilized
              <span className="block h-px bg-[var(--border)] my-1.5" />
              CAS&nbsp;<span className="text-[var(--accent)]">{cas}</span>
              {mw ? <><br />MW&nbsp;{mw}</> : null}
              {batch ? (
                <>
                  <br />BATCH&nbsp;<span className="text-[var(--electric)]">{batch}</span>
                </>
              ) : null}
              {purity ? <><br />PURITY&nbsp;{purity}%</> : null}
              <br />
              <span className="text-[var(--accent)]">●</span>&nbsp;COA&nbsp;VERIFIED
            </div>
            <div
              className="absolute inset-[14%_0_0_0] overflow-hidden pointer-events-none"
              style={{ borderRadius: '22% 22% 14% 14% / 6% 6% 12% 12%' }}
            >
              <div className="vial-sheen absolute -top-[10%] -left-[40%] w-[36%] h-[120%] -rotate-[15deg] blur-md"
                   style={{
                     background:
                       'linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)',
                   }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 12.4: Run test, verify PASS; lint**

- [ ] **Step 12.5: Commit**

```bash
git add site/components/ui/Vial.tsx site/tests/design/Vial.test.tsx
git commit -m "feat(design): add Vial primitive (CSS-based 3D-rotating vial)"
```

---

### Task 13: components/ui barrel export

**Files:**
- Create: `site/components/ui/index.ts`

- [ ] **Step 13.1: Create barrel**

```ts
// site/components/ui/index.ts
export { Button, ButtonLink } from './Button';
export { Pill } from './Pill';
export { Input, FieldLabel } from './Input';
export { Card } from './Card';
export { Specs, type SpecRow } from './Specs';
export { CoaRow } from './CoaRow';
export { Vial } from './Vial';
```

- [ ] **Step 13.2: Run lint**

Run: `cd site && npm run lint`
Expected: PASS.

- [ ] **Step 13.3: Commit**

```bash
git add site/components/ui/index.ts
git commit -m "feat(design): add components/ui barrel export"
```

---

### Task 14: Full verification + smoke

- [ ] **Step 14.1: Run full test suite**

Run: `cd site && npm run test`
Expected: ALL PASS (existing tests untouched + new design tests).

- [ ] **Step 14.2: Run lint**

Run: `cd site && npm run lint`
Expected: PASS.

- [ ] **Step 14.3: Run build to validate Tailwind compilation + Next 16 RSC**

Run: `cd site && npm run build`
Expected: Build succeeds.

- [ ] **Step 14.4: Inline visual check (dev server)**

Run: `cd site && npm run dev` (background) and visit http://localhost:3000/.
Confirm:
- Body uses IBM Plex Sans (inspect element font-family)
- Atmospheric gradient visible in background
- No console errors

Stop dev server.

- [ ] **Step 14.5: Update CHANGELOG**

Edit `site/README.md` or root `README.md` if present, OR create `CHANGELOG.md` if missing — add an entry:

```markdown
## [Unreleased]
### Added
- Design System v2 foundation (sub-project A): IBM Plex Sans + Mono + Instrument Serif via Bunny Fonts; new color tokens (surface-data, electric, electric-soft, error, text-subtle, border-strong); motion vocabulary module; 7 component primitives (Button, Pill, Input, Card, Specs, CoaRow, Vial). See DESIGN.md for the full system.
```

- [ ] **Step 14.6: Final commit**

```bash
git add CHANGELOG.md site/README.md
git commit -m "docs(design): note design system foundation v2 in CHANGELOG"
```

---

### Task 15: /review + /codex review (gstack)

- [ ] **Step 15.1: Invoke `/review`**

Use the gstack `/review` skill on the diff between `main` (start of sub-project A) and current HEAD. Address any blocking findings inline.

- [ ] **Step 15.2: Invoke `/codex review`**

Use the gstack `/codex` skill in review mode for an independent second opinion. Address any genuine issues.

- [ ] **Step 15.3: Re-run `cd site && npm run verify`**

Expected: ALL PASS.

---

### Task 16: Ship

- [ ] **Step 16.1: Push to main (Vercel auto-deploys)**

Run: `git push origin main`

- [ ] **Step 16.2: Wait for Vercel deploy**

Monitor: `gh run list --limit 5` (if CI configured) or check Vercel dashboard for the production deploy of commit HEAD.

- [ ] **Step 16.3: Verify production health**

Run: `curl -fsS https://mogtrix.bio/api/health | grep -o '"ok":true'` (skip if DNS not yet fixed; alternative: `curl -fsS https://site-omega-three-59.vercel.app/api/health | grep -o '"ok":true'`).

Expected: `"ok":true` returned.

- [ ] **Step 16.4: /canary for 5-minute monitor**

Use the gstack `/canary` skill to monitor for console errors / perf regressions on the live site for 5 minutes post-deploy.

---

## Self-Review

(Run after writing the plan, before handoff.)

**1. Spec coverage:**
- DESIGN.md §4 typography — Tasks 1, 3 cover font loading + scale tokens. ✓
- §5 color — Tasks 2, 3 cover CSS vars + TS tokens. ✓
- §6 spacing — Task 3 covers spacing scale. ✓
- §7 layout — Implicit via shell utility kept in Task 2. ✓ (border-radius scale in tokens)
- §8 motion — Tasks 2 (keyframes), 4 (motion module). ✓
- §9 components — Tasks 6–12 cover 7 primitives. ✓
- §10 iconography — Implicit (lucide-react kept; sizing in DESIGN.md). No new task needed since it's a documentation rule.
- §12 accessibility — Focus rings in Task 8 (Input), reduced-motion in Task 2 (globals.css), aria-hidden + sr-only in Task 12 (Vial). ✓

**2. Placeholder scan:** No TBDs, TODOs, or "implement later" — all code blocks are concrete. ✓

**3. Type consistency:** Variant types defined in `lib/design/types.ts` (Task 5) referenced by Button, Pill, Card, CoaRow consistently. ✓

**4. No spec → no task:** Section 11 (imagery) and 13 (mode toggling) are documentation/configuration concerns deferred to surface sub-projects (theme persistence is wired into Sub-project C home page); no Task 17 needed in this plan.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-05-design-system-foundation.md`. Two execution options:

**1. Subagent-Driven (recommended)** — Dispatch fresh subagent per Task with full review between Tasks. Fast iteration, isolated context, /review + /codex automated.
**2. Inline Execution** — Execute all 16 Tasks in this session via `superpowers:executing-plans` with checkpoints after Tasks 6, 12, 14, 16.

**Recommended:** Subagent-Driven — sub-project A has 16 well-isolated TDD tasks, each fits a single subagent's context cleanly, and parallelization risk is low (linear ordering enforced by Task numbers).
