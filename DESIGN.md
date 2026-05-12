# DESIGN.md — vialchemlabs

Source-of-truth design system for `vialchemlabs.net` — the artifact that
lets a fresh AI agent or external designer match the brand without
reading every file in `lib/design/`.

Status: closes D26 from `CODEBASE_UNDERSTANDING.md` §8 Tier 1 (Phase 13.1
v4). Derived from `lib/design/tokens.ts` + `app/globals.css` + Phase 4
anti-pattern catalog. Re-derive when those files change — do not edit
by hand.

## Brand identity (LOCKED — Iron Law 2.26)

| Attribute   | Value                                          | Source                      |
| ----------- | ---------------------------------------------- | --------------------------- |
| Brand name  | vialchemlabs                                   | `lib/content/site.ts:9`     |
| Tagline     | "Counted, weighed, verified."                  | `lib/content/site.ts:15`    |
| Posture     | A — Clean Clinical Labs                        | Appendix V.2                |
| Wordmark    | "vialchemlabs" + "LABS" chip                   | `components/SiteHeader.tsx` |
| Domain      | `vialchemlabs.net`                             | `lib/content/site.ts:12`    |
| Lab partner | Janoshik Analytical (default; env-overridable) | `lib/content/site.ts:24`    |

The brand expression is non-negotiable per Iron Law 2.26. Color values,
type stack, wordmark composition, and Posture A label do NOT change
without explicit operator instruction in chat.

## Color tokens

Surface scale (dark only — no light mode):

| Token                | Value                   | Use                                            |
| -------------------- | ----------------------- | ---------------------------------------------- |
| `--bg`               | `#0a0e0f`               | Page background                                |
| `--surface`          | `#141a1c`               | Card surfaces, footer                          |
| `--surface-strong`   | `#1a2226`               | Header on scroll, pressed states               |
| `--surface-elevated` | `#202a2e`               | Elevated cards (Recovery CTA, PDP price strip) |
| `--surface-muted`    | `rgba(20, 26, 28, 0.6)` | Overlays                                       |

Accent + electric scale:

| Token           | Value     | Use                               |
| --------------- | --------- | --------------------------------- |
| `--accent`      | `#3dd4c8` | Primary CTAs, links, eyebrow text |
| `--accent-soft` | `#5eebdf` | Hover state, italic accents       |
| `--accent-glow` | `#7ff1e8` | Glow effects (subtle)             |
| `--accent-deep` | `#2cb5aa` | Pressed state                     |
| `--electric`    | `#67e8f9` | Atmospheric secondary, RUO pills  |

Text scale:

| Token           | Value                       | Contrast             | Use                                                                            |
| --------------- | --------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| `--text`        | `rgba(255, 255, 255, 0.92)` | 17.4:1 on `--bg`     | Body, headings                                                                 |
| `--text-muted`  | `rgba(255, 255, 255, 0.62)` | 9.4:1 on `--bg`      | Secondary text, descriptions                                                   |
| `--text-subtle` | `rgba(255, 255, 255, 0.55)` | 5.0:1 on `--surface` | Captions, eyebrow text — bumped from 0.42 in Phase 11.2 to clear WCAG AA 4.5:1 |

Border:

| Token             | Value     | Use                    |
| ----------------- | --------- | ---------------------- |
| `--border`        | `#1f2a2e` | Default 1px borders    |
| `--border-strong` | `#2a3a40` | Active / hover borders |

Status pills (always paired with text label per Iron Law 2.27 a11y):

| Token             | Value     | Use                    |
| ----------------- | --------- | ---------------------- |
| `--pill-accent`   | `#3dd4c8` | "In stock", "Verified" |
| `--pill-info`     | `#5eebdf` | Category labels        |
| `--pill-electric` | `#67e8f9` | "RUO only"             |
| `--pill-error`    | `#f87171` | Error states           |

## Typography stack

| Token               | Family        | Weights                     | Use                              |
| ------------------- | ------------- | --------------------------- | -------------------------------- |
| `--font-plex-sans`  | IBM Plex Sans | 300 / 400 / 500 / 600 / 700 | Body + headings                  |
| `--font-plex-mono`  | IBM Plex Mono | 300 / 400 / 500 / 600       | SKUs, batch numbers, data        |
| `--font-newsreader` | Newsreader    | 400 italic                  | Hero pull-quotes, italic accents |

Loaded via `next/font/google` in `app/layout.tsx` (auto-subset, self-hosted).

Type scale (responsive where indicated):

| Token            | Value                    | Use                                     |
| ---------------- | ------------------------ | --------------------------------------- |
| `heroXl`         | `clamp(48px, 7vw, 96px)` | Home hero                               |
| `heroLg`         | `60px`                   | PDP h1                                  |
| `headlineLg`     | `32px`                   | Section h2                              |
| `bodyLg`         | `18px`                   | Hero subtext, lead paragraphs           |
| `bodyMd`         | `16px`                   | Default body                            |
| `bodySm`         | `14px`                   | Secondary text                          |
| `monoSm`         | `12px`                   | Tabular data                            |
| `labelUppercase` | `11px`                   | Eyebrow labels (with `0.16em` tracking) |

Tabular numerals (`font-feature-settings: "tnum"`) on every numeric
display: prices, batch numbers, dates, dose strengths.

## Spacing scale (4px base)

| Token      | Value   | Use                                |
| ---------- | ------- | ---------------------------------- |
| `--sp-2xs` | `2px`   | Hairline gaps                      |
| `--sp-xs`  | `4px`   | Tight gaps                         |
| `--sp-sm`  | `8px`   | Inline gaps, pill padding          |
| `--sp-md`  | `12px`  | Card-internal, FieldLabel-to-Input |
| `--sp-lg`  | `16px`  | Standard gap                       |
| `--sp-xl`  | `24px`  | Card padding, section padding      |
| `--sp-2xl` | `32px`  | Larger card padding                |
| `--sp-3xl` | `48px`  | Hero internal                      |
| `--sp-4xl` | `64px`  | Section spacing                    |
| `--sp-5xl` | `96px`  | Page hero spacing                  |
| `--sp-6xl` | `128px` | Major section breaks               |
| `--sp-7xl` | `192px` | Hero-to-section gaps               |
| `--sp-8xl` | `256px` | Page-edge hero                     |

7xl + 8xl added in Phase 1 v4 for elevated hero compositions.

## Radius

| Token           | Value    | Use                      |
| --------------- | -------- | ------------------------ |
| `--radius-sm`   | `4px`    | Pills                    |
| `--radius-md`   | `8px`    | Inputs                   |
| `--radius-lg`   | `12px`   | Buttons                  |
| `--radius-xl`   | `14px`   | Cards                    |
| `--radius-2xl`  | `20px`   | Large surface containers |
| `--radius-pill` | `9999px` | Status pills             |

## Shadows

Added in Phase 1 v4 for additive depth (Iron Law 2.21):

| Token          | Value                               | Use                                               |
| -------------- | ----------------------------------- | ------------------------------------------------- |
| `--shadow-sm`  | `0 1px 2px 0 rgba(0,0,0,0.32)`      | Default Card                                      |
| `--shadow-md`  | `0 4px 12px -2px rgba(0,0,0,0.42)`  | Card hover lift                                   |
| `--shadow-lg`  | `0 12px 32px -4px rgba(0,0,0,0.5)`  | Elevated surfaces (Recovery CTA, PDP price strip) |
| `--shadow-xl`  | `0 24px 64px -12px rgba(0,0,0,0.6)` | Modals, sheets                                    |
| `--shadow-2xl` | `0 32px 96px -16px rgba(0,0,0,0.7)` | Dialog backdrops                                  |

## Gradients

Added in Phase 1 v4 (additive):

- `--gradient-hero-atmospheric` — subtle radial atmospheric glow on the
  page body; Posture A "instrument-grade" texture without garish color
- `--gradient-accent-radial` — rare hero accent (used sparingly)

## Motion vocabulary

Easings (`--ease-*`):

- `--ease-premium-out`: `cubic-bezier(0.16, 1, 0.3, 1)` — primary
- `--ease-spring`: spring physics (motion library; for whileTap)

Durations (`--dur-*`):

- `--dur-short`: 150ms — color transitions, hover state
- `--dur-medium`: 320ms — reveal-up, sheen, scale
- `--dur-long`: 540ms — page transitions

Animation keyframes (in `app/globals.css`):

- `vial-sway` — Posture A signature: -12° → +12° / 6.4s ease-in-out infinite
- `vial-float` — subtle floor-to-ceiling translate
- `vial-sheen` — slow shimmer across vial body
- `reveal-up` — opacity 0 + translateY(8px) → 1 + 0; used by
  `.reveal-up` class + `[data-stagger-row]` (COA table)
- `recovery-sheen` — one-time-per-session left→right gradient sweep
  on Recovery Stack CTA (Phase 7)

Reduced-motion contract (Iron Law 2.18 NON-NEGOTIABLE):

- `@media (prefers-reduced-motion: reduce)` rule in `app/globals.css:235-242`
  hard-disables all CSS animations + transitions
- `motion` library `useReducedMotion()` hook gates every JS-driven
  animation (StaggerReveal, RecoveryStackSheen, PlaceOrderButton,
  NewsletterForm)
- E2E test `tests/e2e/a11y.spec.ts:73` asserts the contract via
  `page.emulateMedia({ reducedMotion: 'reduce' })` + `getComputedStyle`

## Component primitives

Built around `lib/design/tokens.ts`:

- `Button` — primary / outline / ghost / data variants × sm / md / lg
  sizes; `buttonClassNames()` helper for non-`<button>` consumers
- `Card` — default / interactive (hover lift) / elevated (raised plinth)
- `Input` — paired with `FieldLabel` via `htmlFor`/`id`; `aria-invalid`
  - `role="alert"` error region
- `FieldLabel` — uppercase mono label + required marker
- `Pill` — accent / info / electric / error variants; `kind: 'status'
| 'category' | 'tag'` for semantic surface
- `Specs` — term/value table for dense numeric data
- `Vial` — Posture A SVG signature; `withLabel` prop renders the
  Appendix AD wrap-label overlay
- `Toast` — bottom-right transient feedback; `role="alert"` +
  `aria-live="polite"`; 3s auto-dismiss
- `Dialog` — focus-trapped modal; Esc + backdrop close
- `Sheet` — bottom-anchored mobile sheet
- `Skeleton` — loading shimmer
- `EmptyState` — empty-list shell with optional CTA
- `StaggerReveal` — list wrapper with motion variants; `as`/`itemAs`
  for semantic HTML
- `RecoveryStackSheen` — one-time-per-session sheen overlay
- `PlaceOrderButton` — checkout primary button with whileTap scale +
  loading state
- `CookieConsent` — bottom-anchored banner; accept-all / customize /
  reject-all; GPC-honored; first-party persistence

## Anti-patterns (Posture A)

Enforced at `/design-review` time (Iron Law 2.6):

- **NO** Geist / Inter / Roboto / Space Grotesk as primary font
- **NO** purple / violet gradients
- **NO** 3-column SaaS feature grid
- **NO** stock-photo lab interiors
- **NO** "Built for X" marketing copy patterns
- **NO** before/after photography (Iron Law 2.10)
- **NO** vibrant block-based e-commerce template
- **NO** emoji icons (SVG via Lucide React only)
- **NO** Material Design / Bootstrap defaults
- **NO** Webflow-template aesthetic
- **NO** acid-green or neon-magenta accent (Posture B territory)

## Anti-patterns (Posture B inadvertent reach)

Even though vialchemlabs is Posture A, watch for accidental drift:

- **NO** meme imagery in product photography
- **NO** ironic compliance copy ("LOL we're totally not for human use")
- **NO** race-to-the-bottom pricing language ("CHEAPEST", "DEAL")
- **NO** post-ironic register in body copy

## Performance budgets (Iron Law 2.27)

Per-page targets enforced by `.github/workflows/lighthouse.yml`:

| Metric                    | Threshold               |
| ------------------------- | ----------------------- |
| Lighthouse Performance    | ≥ 90 (mobile + desktop) |
| Lighthouse Accessibility  | ≥ 95                    |
| Lighthouse SEO            | ≥ 95                    |
| Lighthouse Best Practices | ≥ 95                    |
| LCP                       | < 2.5s on 4G mobile     |
| CLS                       | < 0.1                   |
| TBT (proxy for INP)       | < 200ms                 |
| FCP                       | < 1.8s                  |
| TTFB                      | < 800ms                 |
| Per-route initial JS      | ≤ 250KB gzipped         |
| Per-route initial CSS     | ≤ 80KB gzipped          |

A single threshold breach blocks PR merge.

## Visual regression baseline (Iron Law 2.18)

`tests/e2e/visual-regression.spec.ts-snapshots/` contains 114
baseline snapshots: 38 routes × 3 viewports (375 / 768 / 1440), dark
only. Diffs above 0.1% pixel ratio require operator approval per Iron
Law 2.25. Update via `npx playwright test
tests/e2e/visual-regression.spec.ts --update-snapshots`.

## Re-derivation

This file is derived from:

- `lib/design/tokens.ts` (typed token export)
- `app/globals.css` (CSS-variable mirror + keyframes + reduced-motion rule)
- Appendix V.2 in `SUPER_PROMPT_v3_2026-05-08.md` (Posture A row)
- Phase 4 v3.0 + Phase 1 v4 + Phase 11 v4 deliverables

When any of those source files change, regenerate this file by re-reading
them and updating the tables. Do not hand-edit token values here without
also updating the source.
