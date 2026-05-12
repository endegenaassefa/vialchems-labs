# vailchem.labs — Design System Reference

Paste this into ChatGPT to get pixel-accurate changes back.

---

## 1. Brand & Voice

- **Name:** vailchem.labs
- **Category:** Research-grade peptide supplier (research use only)
- **Audience:** Verified laboratories and qualified research organizations
- **Voice:** Clinical, precise, minimal, restrained. Mono captions for metadata.
- **Tagline:** "Research-grade peptides, shipped with the COA."

---

## 2. Color Tokens

### Light theme (default)
| Role            | Hex       | Usage                          |
|-----------------|-----------|--------------------------------|
| `--bg`          | `#fafaf7` | Page background (warm off-white) |
| `--bg-elevated` | `#ffffff` | Cards, modals                  |
| `--bg-sunken`   | `#f4f4f0` | Inputs, code blocks            |
| `--bg-inverse`  | `#0a0e14` | Inverted sections              |
| `--fg`          | `#0a0e14` | Primary text                   |
| `--fg-muted`    | `#5a6470` | Secondary text                 |
| `--fg-subtle`   | `#8b95a1` | Tertiary / mono captions       |
| `--line`        | `#e6e4dc` | Hairlines (1px borders)        |
| `--line-strong` | `#c9c6bb` | Stronger dividers              |
| `--line-faint`  | `#efede6` | Whisper dividers               |

### Dark theme
| Role            | Hex       |
|-----------------|-----------|
| `--bg`          | `#0a0e14` |
| `--bg-elevated` | `#11161e` |
| `--bg-sunken`   | `#060a0f` |
| `--fg`          | `#f0f1ee` |
| `--fg-muted`    | `#8b95a1` |
| `--line`        | `#1f2630` |

### Accent palettes
| Variant        | `--accent` | `--accent-hi` | `--accent-soft` |
|----------------|------------|---------------|-----------------|
| **cyan-navy** (default) | `#0f3a5f` | `#06b6d4` | `#e8f7fb` |
| cyan           | `#0891b2` | `#22d3ee` | `#ecfeff` |
| cobalt         | `#0b5fff` | `#4d8bff` | `#eaf1ff` |
| forest         | `#0f5132` | `#1f8a5b` | `#e7f4ed` |
| graphite       | `#111111` | `#444444` | `#f0efea` |

### Status
- Success: `#1f8a5b` / soft `#e7f4ed`
- Warn: `#b08400` / soft `#fbf4dd`
- Danger: `#b3261e` / soft `#fbe9e7`

---

## 3. Typography

- **Sans-serif:** **Geist** (300 / 400 / 500 / 600)
  Fallback: `ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', sans-serif`
- **Monospace:** **Geist Mono** (400 / 500)
  Fallback: `ui-monospace, 'SF Mono', Menlo, monospace`

Loaded from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap
```

### Type scale
| Use            | Size  | Weight | Notes                       |
|----------------|-------|--------|-----------------------------|
| Display (h1)   | 64–80px | 400  | Tight tracking (-0.02em)    |
| Headline (h2)  | 36–48px | 400  |                             |
| Subhead (h3)   | 24–28px | 500  |                             |
| Body           | 16px  | 400    | Line-height 1.5             |
| Body small     | 14px  | 400    |                             |
| Caption        | 13px  | 400    | `--fg-muted`                |
| Eyebrow / mono | 11px  | 500    | Mono, uppercase, `0.05em` track |

---

## 4. Spacing, Radii, Shadows

- **Radii:** `--r-xs 2px`, `--r-sm 4px`, `--r-md 6px`, `--r-lg 10px`, `--r-pill 999px`
- **Borders:** Always 1px hairlines using `--line`. No 2px+ borders.
- **Shadows (very restrained):**
  - `--shadow-sm`: `0 1px 0 rgba(10,14,20,0.04)`
  - `--shadow-md`: `0 4px 16px -8px rgba(10,14,20,0.10), 0 1px 0 rgba(10,14,20,0.04)`
  - `--shadow-lg`: `0 24px 48px -24px rgba(10,14,20,0.18), 0 1px 0 rgba(10,14,20,0.04)`
- **Motion:** ease `cubic-bezier(0.2, 0.6, 0.2, 1)`, durations 160 / 280 / 600ms

---

## 5. Aesthetic Rules

- Lots of whitespace; never crowd.
- 1px hairline borders, never thicker.
- Mono font ONLY for metadata: lot codes, masses, IDs, timestamps, eyebrows.
- No gradients, no decorative emoji, no rounded "cards with left-border accent."
- Status dots on badges (`badge-dot`) for live/active states.
- Imagery: 3D vial (procedural, hover-tilts), faint molecule-line SVG backgrounds.
- "RESEARCH USE ONLY" footer badge on every page.

---

## 6. Components / Pages

- **Pages:** Home, Catalog, Product detail, COA lookup ("Verify a vial"), Get Verified, Cart, Checkout, My Lab (account), Order detail
- **Nav:** Shop Peptides · Verify a Vial · Get Verified · My Lab + "Get Verified" CTA
- **Vial component:** `vial3d.jsx` — three.js, separate meshes for cap / silver crimp / cyan ring / glass body / powder cake, hover-tilt with idle bob
- **Tweaks panel:** Light/dark theme + 5 accent variants

---

## 7. Files in the project

```
brand.css        — color/type/radius tokens (swap this to re-brand)
layout.css       — structural CSS, references tokens only
shared.jsx       — Nav, Footer, Badge, Icon, MoleculeBg, Reveal
vial3d.jsx       — three.js 3D vial component
home.jsx         — homepage
catalog.jsx      — catalog grid + filters
product.jsx      — product detail page
coa.jsx          — verify-a-vial lookup
verify.jsx       — get-verified stepper
cart.jsx         — cart
checkout.jsx     — checkout
account.jsx      — my-lab dashboard
order.jsx        — order detail
tweaks-panel.jsx — light/dark + accent picker
```

Each page has a matching `*.html` wrapper that loads:
1. Geist + Geist Mono from Google Fonts
2. `brand.css` then `layout.css`
3. React 18.3.1 + ReactDOM + Babel standalone (pinned)
4. `shared.jsx` → `vial3d.jsx` → page-specific JSX
