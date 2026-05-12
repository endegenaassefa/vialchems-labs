# Design System — Mogtrix

> Canonical source of truth for visual + interaction design across `mogtrix-website`.
> Always read this file before making any UI decision. Do not deviate without explicit approval.
> See `/qa` and `/design-review` for enforcement.

---

## 1. Product Context

- **What this is:** Mogtrix is a research-grade peptide catalog. Customers are RUO-qualified researchers and scientific buyers; staff are operators handling order fulfillment.
- **Who it's for:** Serious researchers in academic, clinical-research, and biotech labs. NOT consumers. NOT bodybuilders.
- **Space / industry:** RUO peptide research supplies. The category is bifurcated between institutional incumbents (Sigma-Aldrich, Bachem, Cell Signaling — credible but visually 2008-corporate) and gray-market sellers (Trust Labs, RUO.bio, Vector Bio Supply — visually 2012-Shopify, often theatrical compliance). Trust is the bottleneck.
- **Project type:** E-commerce web app + ops dashboard.

## 2. Brand thesis

> *"Mogtrix is the peptide catalog where serious researchers want to buy — because every signal says it's the right one."*

Four pillars (every design decision must serve at least 2; ideally 3+):
1. **Real** — premium dark + density. The site looks and feels like an actual lab, not a Shopify template.
2. **Beautiful** — peptides as premium objects. Vials are jewels under spotlight. Continuous motion.
3. **For researchers** — audience-first. Technical density. Bodybuilding crowd self-deselects.
4. **Verifiable** — proof at every step. COA, sequence, batch, sourcing visible everywhere.

## 3. Aesthetic Direction

- **Direction:** Industrial-scientific instrument — premium dark precision. Think Bloomberg terminal × Linear × Bang & Olufsen, applied to a research lab.
- **Decoration level:** *Intentional* — subtle film grain, layered atmospheric radial gradients (acid-green + electrolyte cyan + deep cyan-data), `SPECIMEN BENCH` framing labels, equipment-readout metadata. No decorative blobs, no purple gradients, no 3-column SaaS feature grids.
- **Mood:** Moody premium lab. Dark, technical, slightly intimidating, deeply trustworthy. Reads "this is the real one" within 3 seconds.
- **Reference vocabulary:** Linear, Vercel, Raycast, Arc, Warp (premium dark dev tools), Bang & Olufsen product pages, Bloomberg Terminal, IBM Research aesthetic, Bell & Ross watch brand atmosphere.

### Anti-patterns (NEVER ship)

- Geist / Inter / Roboto / Space Grotesk as primary fonts (convergence trap)
- Purple or violet gradient accents
- 3-column feature grid with icons in colored circles
- Centered everything with uniform spacing
- Bubble-radius on every element
- Stock-photo hero sections
- "Built for X" / "Designed for Y" SaaS marketing copy patterns
- ANY content that violates `lib/compliance.ts` `assertMarketingCopySafe` (no "weight loss", "human use", "diagnose", "dose", "protocol", etc.)

## 4. Typography

Replaces the legacy `Avenir Next` stack. Loaded via [Bunny Fonts](https://fonts.bunny.net) (privacy-first Google Fonts CDN).

### Stack

| Role | Family | Weights | Why |
|---|---|---|---|
| Display + Body | **IBM Plex Sans** | 300, 400, 500, 600, 700 | Designed by IBM specifically for IBM Research. Scientific gravitas built into the letterforms. Free. Distinctive (not the new-Inter). Pairs natively with Plex Mono. |
| Mono / Data | **IBM Plex Mono** | 300, 400, 500, 600 | Same family, designed for technical content. Used for sequences, CAS numbers, batch IDs, MW, instrument-style numerals, code-style chips. Tabular numerals enabled (`'tnum' on, 'zero' on`). |
| Editorial accent | **Newsreader** (italic) | 400, 400i, 500, 500i | Italic display moments only — hero pull-quote em phrases ("for *serious researchers*"), section title em-text, about/methods/standards page poster moments. Newsreader (Production Type for Google Fonts) is designed for editorial reading at scale — has a research-paper feel that fits the scientific identity better than Instrument Serif's perfumey/luxe vibe. Color: `--electric-soft`. |

### Loading

```html
<link rel="preconnect" href="https://fonts.bunny.net" />
<link href="https://fonts.bunny.net/css?family=ibm-plex-sans:300,400,500,600,700|ibm-plex-mono:300,400,500,600|instrument-serif:400,400i&display=swap" rel="stylesheet" />
```

### Type scale

| Token | Size | Line | Letter | Weight | Use |
|---|---|---|---|---|---|
| `display.heroXl` | 88 / clamp(48,7vw,96) | 0.94 | -0.035em | 600 | Hero h1 |
| `display.heroLg` | 60 | 1.00 | -0.025em | 600 | Section opener / page hero |
| `display.editorial` | 56–64 | 1.00 | -0.005em | 400 italic | Newsreader italic moments only |
| `headline.lg` | 32 | 1.15 | -0.020em | 600 | Section title |
| `headline.md` | 28 | 1.18 | -0.018em | 600 | Subsection title |
| `headline.sm` | 24 | 1.20 | -0.015em | 600 | Card / panel title |
| `title.md` | 20 | 1.30 | -0.010em | 600 | Component title (product name in cards) |
| `title.sm` | 18 | 1.35 | -0.008em | 600 | Small panel title |
| `body.lg` | 18 | 1.55 | normal | 400 | Lead body, hero supporting copy |
| `body.md` | 16 | 1.55 | normal | 400 | Default body |
| `body.sm` | 14 | 1.50 | normal | 400 | Compact body |
| `caption` | 13 | 1.45 | normal | 400 | Small metadata, helper text |
| `mono.body` | 14 | 1.55 | 0.005em | 500 | Sequences, CAS, batch IDs, technical data |
| `mono.sm` | 12 | 1.50 | 0.02em | 500 | Inline data, code chips |
| `label.uppercase` | 11 | 1.30 | 0.16em | 500 mono | Labels, eyebrows, section meta |

`font-feature-settings: 'liga' on, 'calt' on, 'ss01' on` for Plex Sans.
`font-feature-settings: 'tnum' on, 'zero' on` for Plex Mono (tabular numerals always).

## 5. Color

13+ tokens, dark-first design. Light mode is supported but secondary — Mogtrix is a dark product, and light mode reads "less premium" by design.

### Tokens

| CSS variable | Value | Role |
|---|---|---|
| `--bg` | `#020202` | Page background |
| `--scaffold` | `#050505` | Body scaffold (under radial gradients) |
| `--surface` | `#111111` | Cards, panels, inputs |
| `--surface-strong` | `#171717` | Elevated surfaces, hover states |
| `--surface-data` | `#0a1f24` | **NEW** Research/data surfaces (specs sheets, COA rows, code chips) |
| `--border` | `#1f1f1f` | Default border |
| `--border-strong` | `#2a2a2a` | Hover/active border |
| `--accent` | `#7cff00` | Acid-green primary CTA, focus, verify, important state — **SPARING** |
| `--accent-soft` | `#b4ff2e` | Hover variant of accent |
| `--accent-glow` | `#bfef8f` | Halo / radial-gradient highlight |
| `--electric` | `#22d3ee` | Electrolyte cyan — atmospheric secondary accent, status, lab-readout chips |
| `--electric-soft` | `#67e8f9` | **NEW** Editorial italic color (Newsreader moments), softer cyan halo |
| `--info` | `#7c93a8` | Muted-blue informational state |
| `--error` | `#ff4d6d` | **NEW** Error / failure state (currently no formal error color) |
| `--text` | `rgba(255,255,255,0.92)` | Primary text |
| `--text-muted` | `rgba(255,255,255,0.62)` | Secondary text |
| `--text-subtle` | `rgba(255,255,255,0.36)` | **NEW** Tertiary / metadata text |

### Atmospheric layering

The body background uses 4 layered radial gradients on top of `--bg`:
```css
background:
  radial-gradient(ellipse at 78% 8%, rgba(124,255,0,0.16), transparent 32rem),
  radial-gradient(ellipse at 22% 22%, rgba(34,211,238,0.13), transparent 28rem),
  radial-gradient(ellipse at 8% 84%, rgba(10,31,36,0.7), transparent 30rem),
  radial-gradient(ellipse at 92% 90%, rgba(124,255,0,0.06), transparent 26rem),
  var(--bg);
```

Plus a subtle SVG film-grain overlay at `opacity: 0.6, mix-blend-mode: overlay`.

### Usage rules

- `--accent` (acid-green) is **the rarest color in the palette**. Use only for: primary CTA, "VERIFIED" badges, focus rings, "in stock" pills, the subtle pulse-dot in the brand mark. Do NOT use for body text accents, decorative dividers, or background fills.
- `--electric` (electrolyte cyan) is the second rare color. Use for: atmospheric radial gradients, editorial italic Newsreader moments (`--electric-soft`), allocated/in-flight status pills, lab-readout chips on data surfaces. Acid-green and electrolyte-cyan together read as a "lab instrument duo" — Cherenkov-glow + active-site-marker.
- `--info` for: shipping info pills, archived COA states, secondary metadata.
- `--error` is for failure states only (expired batches, payment failed, validation errors).
- `--surface-data` is reserved for **technical content surfaces** — specs sheets, COA rows, code chips. Subtly separates "data" from "narrative" surfaces.

### Light mode (secondary)

```
--bg #f6f6f4 / --scaffold #fafaf8 / --surface #ffffff / --surface-strong #f1f1ee
--surface-data #e9eef0 / --border #e3e3df / --border-strong #cfcfca
--accent #4ea600 / --accent-soft #5fbf00 / --accent-glow #b9e890
--electric #0891b2 / --electric-soft #06b6d4
--info #4d6478 / --warn #c47a18 / --error #c33052
--text rgba(0,0,0,0.86) / --text-muted rgba(0,0,0,0.58) / --text-subtle rgba(0,0,0,0.36)
```

Saturation reduced 20–30% for light mode to maintain seriousness without hurting eyes.

## 6. Spacing

- **Base unit:** 4px
- **Density:** Comfortable for marketing surfaces (home, about, methods, standards). Compact for catalog and data-dense surfaces (shop, product detail specs, COA library, ops dashboard).

### Scale

| Token | px | Use |
|---|---|---|
| `2xs` | 2 | Hairline |
| `xs` | 4 | Micro adjustments |
| `sm` | 8 | Tight gaps, chip padding |
| `md` | 12 | Default tight spacing |
| `lg` | 16 | Default comfortable spacing |
| `xl` | 24 | Section internals |
| `2xl` | 32 | Large gaps, mockup body padding |
| `3xl` | 48 | Section gaps |
| `4xl` | 64 | Hero internal spacing |
| `5xl` | 96 | Section padding (top/bottom) |
| `6xl` | 128 | Major section breaks |

## 7. Layout

- **Approach:** Hybrid — grid-disciplined for catalog/specs/data; creative-editorial for home/product detail/about.
- **Shell width:** `min(1280px, calc(100% - 32px))` (slightly wider than current 1160px for richer hero compositions).
- **Mobile:** All grids collapse to single column at ≤920px. Vial scenes scale to 60–70% of mobile viewport.
- **Border radius scale:** sm 4px / md 10px / lg 14px / xl 16px / 2xl 18px / full 999px. NO uniform bubble-radius on everything.

### Composition rules

- Home and product detail use **asymmetric vial compositions** (vial dominates one column, content/specs dominate the other). Avoid centered-symmetric.
- Catalog and ops surfaces use **grid-disciplined** rows with dense data tables.
- Section dividers use a 1px gradient: `linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 30%, transparent) 30%, color-mix(in srgb, var(--electric) 30%, transparent) 70%, transparent)` — connects atmosphere across sections.

## 8. Motion

Motion is the personality. Most peptide catalogs have ZERO motion; Mogtrix is the opposite extreme — but with discipline. Every animation honors `prefers-reduced-motion: reduce`.

### Easing

| Token | Curve | Use |
|---|---|---|
| `ease-premium-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default for hovers, reveals, enters |
| `ease-in` | `ease-in` | Exits, dismisses |
| `ease-move` | `cubic-bezier(0.4, 0, 0.2, 1)` | Material-style move |
| `linear` | `linear` | Continuous rotations only |

### Duration

| Token | ms | Use |
|---|---|---|
| `micro` | 80 | Hover state shifts (color, border) |
| `short` | 200 | Hover unfurl, button transform |
| `medium` | 320 | Stagger reveals, card lifts |
| `long` | 540 | Page transitions (View Transitions API) |
| `slow` | 720 | Sheen sweeps |
| `continuous` | 14000–22000 | Vial Y-axis rotation |

### Patterns

| Pattern | Spec |
|---|---|
| **Vial sway** | Subtle 3D Y-axis sway between -12° and +12°, 6.4s ease-in-out infinite. NOT full 360° rotation — vials rock gently, suggesting motion without spinning. Hover pauses (via `animationPlayState`); click opens "inspect" overlay. Reduced-motion stops the sway entirely. |
| **Vial float** | `translateY(0 ↔ -14px)`, 7.6s ease-in-out infinite. Stacked with rotation for parallax depth. |
| **Vial sheen** | Acid-green sheen sweeps across vial body, 5.4s ease-in-out infinite, offset per-vial. Layered on rotation. |
| **Vial glow** | Radial halo behind each vial — acid-green for center, electrolyte-cyan for sides. Pulse subtly with `pulse 3.6s` keyframe. |
| **Hover unfurl** | Card lifts 2–4px, border shifts to `--accent`, optional spec panel reveals. 200ms `ease-premium-out`. |
| **Stagger reveal** | Sibling rows reveal in sequence as parent enters viewport. 60–80ms stagger, 320ms duration. IntersectionObserver-driven. |
| **Page transition** | View Transitions API for top-level routes. Vial persists across navigation when present. 540ms total. |
| **Pulse** | Brand mark dot, status dots: `1 ↔ 0.65 opacity, 1 ↔ 0.92 scale`, 3.6s ease-in-out infinite. |
| **Fill ripple** | Vial liquid surface highlight: `0.45 ↔ 0.18 opacity`, 4s ease-in-out. |

### Reduced-motion fallback

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Hard fallback. No partial-motion modes.

## 9. Components (primitives — to be implemented in `components/ui/`)

### Buttons

| Variant | Use |
|---|---|
| `btn-primary` | Acid-green CTA. Add to order, Verify, Continue. |
| `btn-outline` | Secondary action. Backdrop-blurred outline that highlights to `--accent` on hover. |
| `btn-ghost` | Tertiary. Text-only, hover-color-shift. |
| `btn-data` | Data-styled (mono font, surface-data background). For developer-y / inspect actions. |

### Pills

| Variant | Use |
|---|---|
| `pill-accent` | RUO ONLY, VERIFIED, IN STOCK |
| `pill-info` | SHIPS US, ARCHIVED, secondary status |
| `pill-electric` | ALLOCATED, IN-FLIGHT, secondary lab-readout status |
| `pill-error` | EXPIRED, FAILED |

All pills use `IBM Plex Mono` 11px / 0.06em letter-spacing.

### Form

- `input` — `--surface-strong` background, `--border`, 10px radius, focus ring `2px var(--accent)` with 2px offset
- `qf-label` — IBM Plex Mono 10–11px uppercase 0.12em, `--text-muted`
- `qf-checkbox` — 18px square, 5px radius, checked = `--accent` background

### Data surfaces

- `specs` — definition list with mono dt/dd, dotted separators
- `coa-row` — grid row with batch (mono), info (sans), status pill
- `card-row` — icon + title + description, surface-strong background

### Mockup surface (for product detail)

- Vial stage with radial green glow, 3D rotation, atmospheric backdrop
- Specs sheet, price + unit (38px display), CTA pair (primary + outline)
- Status pills row beneath vial

## 10. Iconography

- **Library:** `lucide-react` (already installed, kept).
- **Sizes:** 14, 16, 18, 20 only. Default 16.
- **Stroke:** 1.75 (slightly heavier than lucide default 2 — feels more instrument-grade).
- **Color:** Inherit from text by default; `--accent` for status indicators only.
- **Custom icons:** Use mono font Greek letters / superscript notation for scientific marks (e.g., α / β / Ω) on data cards instead of generic icons.

## 11. Imagery

- **Vial photography:** Existing `public/visuals/products/mogtrix-vials-photo-v1/` SOURCE assets stay. Augmented with the 3D r3f rotating composition for hero / detail / hover-inspect.
- **No stock photography.** Ever. Lab interiors and product shots only when commissioned.
- **OG / social cards:** Generated via `app/opengraph-image.tsx` (`next/og`). Dark background, large product name in Plex Sans 600, Plex Mono metadata strip.

## 12. Accessibility floor

- **Contrast:** Minimum 4.5:1 for body text against backgrounds; 7:1 for primary text. `--text` on `--bg` is ~14:1; `--text-muted` on `--surface` is ~5.2:1.
- **Focus rings:** ALL interactive elements show a 2px `--accent` ring with 2px offset on `:focus-visible`. Never `outline: none` without replacement.
- **Keyboard nav:** Every interactive element reachable via Tab. Skip-to-content link present in header.
- **Reduced motion:** Hard fallback (see §8). All continuous animations stop.
- **Screen reader:** All status pills have `aria-label` describing their state. The 3D vial scene uses `aria-hidden="true"` on the visual layer with a sibling `sr-only` description.
- **Color independence:** Status is never communicated by color alone — pills always include text.
- **Form labels:** Every input has an associated `<label>`. Error messages reference the field by name.
- **Time:** No animations under 100ms (too fast for perception); no autoplay sound; no flashing > 3 Hz.

## 13. Mode toggling

- Default: dark.
- Toggle persists in `localStorage` as `mogtrix-theme`.
- `data-theme="dark|light"` on `<html>`.
- System preference (`prefers-color-scheme`) checked on first load if no stored preference.

## 14. Implementation map

The design system is implemented across these files (sub-project A.5):

```
site/app/globals.css              — All tokens (CSS variables), keyframes, base utilities
site/components/ui/Button.tsx     — Primitive
site/components/ui/Pill.tsx       — Primitive
site/components/ui/Input.tsx      — Primitive
site/components/ui/Card.tsx       — Primitive
site/components/ui/Specs.tsx      — Primitive (specs sheet)
site/components/ui/CoaRow.tsx     — Primitive
site/components/ui/Vial.tsx       — Primitive (CSS-based rotating vial)
site/components/ui/VialScene.tsx  — Primitive (3D r3f scene, upgraded existing)
site/components/ui/MockupFrame.tsx — Optional (browser-frame wrapper)
site/lib/design/tokens.ts          — TS export of tokens for runtime access
site/lib/design/motion.ts          — Easing + duration tokens
site/lib/design/types.ts           — Design system types
```

Components currently in `site/components/` get refactored in sub-project A.5 to use the new primitives. Existing `lib/utils.ts` `cn()` stays.

Migration of the existing `Avenir Next` font load to IBM Plex happens in `app/globals.css` and `app/layout.tsx` (`fonts.bunny.net` link in `<head>`).

## 15. Live preview reference

Working visual reference for this system:
`~/.gstack/projects/abhicloses7838-mogtrix-website/designs/design-system-20260505/preview-v2.html`

Local server: `http://localhost:8765/preview-v2.html` (when `python3 -m http.server 8765` is running in the design directory).

## 16. Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-05 | Initial design system v1 (Geist) proposed and rejected | Lost spirit + felt mainstream; vial animation invisible |
| 2026-05-05 | v2 (IBM Plex + 3D rotating vial bench + amber atmosphere) approved | Restored moodiness; vial animation visible; non-mainstream font with research gravitas |
| 2026-05-05 | Header refined: removed `mogtrix_logo.png`, kept wordmark + "LABS" mono chip | Two logo+wordmark pair read as Anthropic-affiliated; clean wordmark + sub-brand chip is more legitimate-business |
| 2026-05-05 | Vial rotation → vial sway (-12° to +12°, 6.4s ease-in-out) | User feedback: full 360° rotation looks "spinny/consumer"; gentle sway reads more "specimen on lab bench" |
| 2026-05-05 | Vial fill: green liquid → cream-tinted powder with grain noise | User feedback: vials need to look like LYOPHILIZED PEPTIDE POWDER, not green liquid. Cream + subtle acid tint at base + SVG noise overlay reads as fine powder |
| 2026-05-05 | Editorial italic font: Instrument Serif → Newsreader Italic | User feedback: Instrument Serif felt perfumey/luxe, didn't connect with the research identity. Newsreader (designed by Production Type for Google Fonts editorial reading) has the research-paper feel that fits Mogtrix |
| 2026-05-05 | Brand thesis: 4 pillars (real / beautiful / for-researchers / verifiable) | User chose all 4; meta-goal "make as much sales as possible by being beautiful + functional + complete + buyer-loved" |
| 2026-05-05 | Acid-green stays sparing; **electrolyte cyan** (#22d3ee) added as second atmospheric accent | User flagged the originally-proposed amber (#ffb04f / #ffc878) as too close to Anthropic's brand. Swapped to electrolyte cyan — reads "lab readout / ICU monitor / Cherenkov / oxygen sensor" and pairs with acid-green as a "lab instrument duo" cool-plus-cool combo |
| 2026-05-05 | Three-vial hero, not single-vial | Matches existing `HomeProofRow` pattern; multiple rotations stagger for organic feel |
| 2026-05-05 | View Transitions API for routes (vial persistence) | Ships in stable Chrome 126+; progressive enhancement; reduced-motion friendly |
| 2026-05-05 | Light mode supported but secondary | Mogtrix is a dark product; light is "less premium" by design |

---

*This document is enforced via `/qa` (functional bugs + auto-fix) and `/design-review` (visual + slop patterns + auto-fix).*
*Update this document FIRST when changing any visual/interaction decision; then update implementation.*
