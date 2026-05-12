# Mogtrix Design — Claude.ai Design Canvas Handoff

> **Use this:** Open a fresh Claude.ai conversation (or Project) with design canvas / artifacts enabled. Paste the **System Context** block (§1) as your first message. Then iterate freely. When you have approved designs, bring them back here using the **Handoff-Back Protocol** at the bottom (§10).

> **Date written:** 2026-05-05
> **Current code state:** `mogtrix-website` repo, branch `main`, commit `28ae2a7` (sub-project A — Design System Foundation — landed locally; not yet pushed)
> **Live dev server (right now):** http://localhost:3200/
> **Visual reference:** http://localhost:8765/preview-v2.html

---

## §1. Copy-paste this into Claude.ai as your opening message

Everything Claude.ai needs to pick up where we are. Paste this verbatim:

```
You are helping me design Mogtrix — a research-grade peptide catalog. We've already locked the design system foundation in code; I want to iterate on appearance and visual polish here in the Claude.ai design canvas. Generate HTML/CSS artifacts I can preview, iterate on, and refine.

# Brand thesis (non-negotiable)
"Mogtrix is the peptide catalog where serious researchers want to buy — because every signal says it's the right one."

Four pillars (every design decision must serve at least 2; ideally 3+):
1. REAL — premium dark + density. Looks like an actual research lab, not a Shopify template.
2. BEAUTIFUL — peptides as premium objects. Vials are jewels under spotlight. Animation-heavy.
3. FOR RESEARCHERS — audience-first. Technical density assumed. Bodybuilders self-deselect.
4. VERIFIABLE — proof at every step. COA, sequence, batch, sourcing chain visible everywhere.

# Locked design tokens (DO NOT CHANGE without strong reason)

## Color palette
--background:       #020202   /* page bg */
--scaffold:         #050505   /* body scaffold under gradients */
--surface:          #111111   /* card / panel */
--surface-strong:   #171717   /* elevated / hover surface */
--surface-data:     #0a1f24   /* research-data surfaces (specs, COA) */
--border:           #1f1f1f
--border-strong:    #2a2a2a

--accent:           #7cff00   /* acid-green primary CTA / verify / focus — RARE */
--accent-soft:      #b4ff2e   /* hover variant */
--acid-glow:        #bfef8f   /* halo / radial highlight */

--electric:         #22d3ee   /* electrolyte cyan secondary accent */
--electric-soft:    #67e8f9   /* editorial italic color, soft halo */

--muted-blue:       #7c93a8   /* info pill / secondary metadata */
--amber:            #ffb04f   /* warn pill */
--error:            #ff4d6d   /* error pill */

--text:             rgba(255,255,255,0.92)
--text-muted:       rgba(255,255,255,0.62)
--text-subtle:      rgba(255,255,255,0.36)

NEVER USE: warm amber as a primary accent (reads like Anthropic's brand). Cyan + acid-green is the locked secondary-accent strategy.
NEVER USE: purple/violet (banned).
NEVER USE: Inter, Geist, Roboto, Space Grotesk, system-ui as primary fonts (convergence trap).

## Atmospheric body background (4 layered radial gradients on --background)
background:
  radial-gradient(ellipse at 78% 8%,  rgba(124,255,0,0.16), transparent 32rem),
  radial-gradient(ellipse at 22% 22%, rgba(34,211,238,0.13), transparent 28rem),
  radial-gradient(ellipse at 8% 84%,  rgba(10,31,36,0.7),    transparent 30rem),
  radial-gradient(ellipse at 92% 90%, rgba(124,255,0,0.06), transparent 26rem),
  var(--background);

Plus subtle SVG fractal-noise overlay (mix-blend-mode: overlay, opacity 0.6).

## Typography (loaded via Bunny Fonts CDN)
Display + Body:    IBM Plex Sans      (300, 400, 500, 600, 700)
Mono / Data:       IBM Plex Mono      (300, 400, 500, 600)
Editorial italic:  Newsreader         (400, 400i, 500, 500i)

Bunny Fonts URL:
https://fonts.bunny.net/css?family=ibm-plex-sans:300,400,500,600,700|ibm-plex-mono:300,400,500,600|newsreader:400,400i,500,500i&display=swap

Use IBM Plex Mono for: technical data (CAS, MW, sequence, batch IDs, lab readouts, status pills, eyebrow labels, code chips). Tabular numerals always on (`font-feature-settings: 'tnum' on, 'zero' on`).
Use Newsreader italic for: pull-quote em phrases ("for *serious researchers*"), editorial moments, about/methods/standards page poster moments. Color: var(--electric-soft).

## Type scale
display.heroXl   88 / 0.94 / -0.035em / 600   — hero h1
display.heroLg   60 / 1.00 / -0.025em / 600   — page hero
display.editorial 56-64 / 1.00 / -0.005em / 400 italic   — Newsreader italic moments
headline.lg      32 / 1.15 / -0.020em / 600
title.md         20 / 1.30 / -0.010em / 600
body.md          16 / 1.55 / normal / 400
caption          13 / 1.45 / normal / 400
mono.body        14 / 1.55 / 0.005em / 500   — IBM Plex Mono
label            11 / 1.30 / 0.16em / 500    — IBM Plex Mono uppercase

## Spacing (4px base)
2xs 2  /  xs 4  /  sm 8  /  md 12  /  lg 16  /  xl 24  /  2xl 32  /  3xl 48  /  4xl 64  /  5xl 96  /  6xl 128

## Border radius
sm 4  /  md 10  /  lg 14  /  xl 16  /  2xl 18  /  full 999

## Motion vocabulary
Easings:
  ease-premium-out: cubic-bezier(0.16, 1, 0.3, 1)   — default for hovers/reveals
  ease-in: ease-in                                  — exits
  ease-move: cubic-bezier(0.4, 0, 0.2, 1)
  linear: linear                                    — only continuous

Durations (ms):
  micro 80, short 200, medium 320, long 540, slow 720

Locked patterns:
  - Vial sway: rotateY(-12deg ↔ +12deg), 6.4s ease-in-out infinite. NOT 360° rotation.
  - Vial float: translateY(0 ↔ -10px), 7.8s ease-in-out infinite, stacks with sway.
  - Vial sheen: acid-green sheen sweeps across vial body, 5.4-5.8s.
  - Vial glow: radial halo behind vial (--accent for center vial, --electric for sides).
  - Hover unfurl: card lifts 2-4px, border shifts to --accent, 200ms premium-ease.
  - Page transition: View Transitions API for routes, 540ms.
  - Reduced-motion: HARD fallback — animation: none !important on all *.

# Components I've locked in code (don't redesign)
1. Header — small wordmark "Mogtrix" + uppercase mono "LABS" chip (small caps in pill, --border-strong outline). NO logo image (read as Anthropic-affiliated).
2. Button — 4 variants: primary (acid CTA), outline (backdrop-blur outline → highlights to acid on hover), ghost (text only), data (mono font, surface-data background, code-style).
3. Pill — 5 status variants: accent (RUO/VERIFIED), info (SHIPS US/ARCHIVED), electric (ALLOCATED/PENDING), warn, error.
4. Input — surface-strong bg, accent focus ring (2px outline + 2px offset).
5. Card — 3 variants: surface, strong, data.
6. Specs — definition list, mono font, dotted separators.
7. CoaRow — batch (mono) + info (sans) + status pill.
8. Vial — CSS-based 3D sway composition with cream-tinted powder mound (NOT green liquid), grain noise overlay, sheen sweep, dome highlight, instrument-style mono label panel showing name/CAS/MW/batch/purity.

# What I want YOU (Claude.ai design canvas) to design

Open work — these are the surfaces I haven't locked yet. Generate HTML/CSS artifacts I can preview and refine:

## Highest priority
1. CURSOR-REACTIVE VIAL — when cursor is on the page, vials should subtly tilt TOWARD the cursor (parallax). When cursor is far, default to the locked sway. Smooth lerp. NOT a draggable / spinnable thing — just subtle reactivity. Approximation: rotateY based on cursor X delta from vial center, rotateX based on Y delta. Max ~6° each axis. Use requestAnimationFrame for smoothing. Show me the JS hook + how it composes with the existing CSS sway.

2. HOMEPAGE HERO — full reimagining. Currently a single static PNG vial in the corner. I want: scroll-driven hero composition with three vials on a "lab bench," motion-rich proof points scrolling in, brand thesis copy in display.heroXl with Newsreader italic for "where serious researchers want to buy" em-phrase. Density should feel like Bloomberg × Linear × Bang & Olufsen. Don't be afraid to push.

3. PRODUCT DETAIL PAGE ("instrument page") — vial as art object, NOT in a rectangular card/box (the user explicitly hates box-in-box layouts; vial sits on body atmosphere directly). Specs sheet on the right (mono CAS, MW, sequence, purity, batch). Price as 38px display (e.g., "$49"). Primary CTA "Add to research order" + outline "Verify COA". Tabs below: Documentation / COA Library / Sourcing Chain / Method Validation. Density goal: technical, dense, instrument-grade.

4. BUTTONS POLISH — current primary button is solid acid-green with shadow. User says buttons need to be "much better." Try alternatives: bevel/3D effect, subtle inner highlight, more dramatic shadow, custom shape (slight angle?), better focus state, more memorable hover. Ship 3 variants for me to compare.

## Medium priority
5. BACKGROUND EXPLORATION — current is 4-layer radial gradients + SVG noise. Try: (a) animated mesh gradient, (b) subtle particle field (acid-green dust particles drifting up), (c) scan-line CRT effect (very subtle), (d) animated noise overlay. Don't reinvent the palette — same colors, different motion/depth.

6. PRODUCT CARDS (catalog grid) — for the /shop page. Each card: rotating vial preview, name in title.md, scientific name in caption, price + acid-green CTA, status pills. Hover state should feel like a real reaction (not just elevation). Show ~4-6 card design options.

7. QUALIFY FLOW — currently a 3-step form. Make it feel like CLEARANCE, not a form. Staged motion. "Step 02 / 03" mono indicator with pulsing acid dot. Big display heading per step. Progress feels tactile.

8. COA LIBRARY — currently a utility page. Elevate to flagship trust feature. Search input + recent batches with verified/archived states. Make verifying a batch feel like a satisfying interaction.

9. ABOUT / METHODS / STANDARDS pages (NEW) — don't exist yet. Need: scientific legitimacy storytelling. Founder/lab story (no consumer marketing copy), analytical methods detail, RUO compliance posture. Newsreader italic editorial moments. Pull-quotes. Photography-free (no stock).

# Constraints
- Mobile + desktop responsive
- Honor prefers-reduced-motion (animation:none !important)
- Light mode supported but dark is primary; light desaturates by 20-30%
- All copy MUST avoid: "weight loss", "human use", "diagnose", "treatment", "cure", "prevent disease", "dose", "dosing", "protocol", "bodybuilding" (RUO research-only register only)
- Audience signal: copy and visual choices should occasionally REPEL the wrong audience (peptides-for-bodybuilding crowd) — that's a feature
- No purple/violet gradients, no 3-column SaaS feature grids with icons in colored circles, no centered-everything, no bubble-radius on every element, no stock photography, no system-ui as primary font

# What I'll bring back to my dev environment
HTML/CSS artifacts (single self-contained files I can drop into a preview server). When I bring them back, I'll wire them into the existing components/ui/ primitives.

Now let's start. Generate the highest priority artifacts first (cursor-reactive vial, homepage hero, product detail) — one at a time, full HTML files I can preview.
```

---

## §2. Resource paths in this repo (for reference if you bring designs back)

| File | What it is |
|---|---|
| `/root/mogtrix-website/DESIGN.md` | Canonical design system spec (the source of truth) |
| `/root/mogtrix-website/site/app/globals.css` | All CSS variables + keyframes implemented |
| `/root/mogtrix-website/site/lib/design/tokens.ts` | TS export of color/spacing/type tokens |
| `/root/mogtrix-website/site/lib/design/motion.ts` | Easing + duration tokens |
| `/root/mogtrix-website/site/components/ui/` | 7 shipped primitives (Button, Pill, Input, Card, Specs, CoaRow, Vial) |
| `/root/mogtrix-website/REPO_BRAIN.md` | Full repo context dump (44k lines summarized) |
| `/root/mogtrix-website/docs/superpowers/specs/2026-05-05-mogtrix-production-launch-master-plan.md` | The 21-sub-project master plan |
| `/root/mogtrix-website/docs/superpowers/plans/2026-05-05-design-system-foundation.md` | Sub-project A implementation plan |
| `/root/.gstack/projects/abhicloses7838-mogtrix-website/designs/design-system-20260505/preview-v2.html` | Visual reference HTML (live at http://localhost:8765/preview-v2.html) |
| `/root/mogtrix-website/site/public/brand/mogtrix_wordmark.png` | Wordmark asset (528×160 RGBA) |
| `/root/mogtrix-website/site/public/visuals/products/mogtrix-vials-photo-v1/` | Product vial photography (15 SKUs) |

---

## §3. Brand context (full)

The peptide research market has a trust bottleneck. Two buckets of competitors:

- **Institutional incumbents** (Sigma-Aldrich, Bachem, Cell Signaling) — credible but visually 2008-corporate. Look outdated.
- **Gray-market sites** (Trust Labs, RUO.bio, Vector Bio Supply) — visually 2012-Shopify, theatrical compliance, low trust.

Mogtrix's strategic moat: **be the first peptide catalog that LOOKS as trustworthy and modern as the science it sells.** Borrow the aesthetic of premium developer tools (Linear, Vercel, Arc, Raycast) — already trusted as a "technical credibility" signal — and apply it to research peptides where it's never been done. The aesthetic itself becomes proof of competence.

**Audience:** RUO-qualified researchers and scientific buyers. NOT consumers. NOT bodybuilders. Copy and visual choices should occasionally repel the wrong audience.

**Reference visual vocabulary:** Bloomberg terminal × Linear × Bang & Olufsen × IBM Research × Bell & Ross watch brand × Neuralink dark technical.

---

## §4. Decisions log (what we tried, what we kept)

**Locked decisions:**
- ✅ Approach: Hybrid polish + extend (kept dark + acid-green spirit, added new patterns + surfaces)
- ✅ Color: dark backgrounds + acid-green accent + electrolyte cyan secondary atmospheric (was warm amber, swapped because amber read as Anthropic-affiliated)
- ✅ Typography: IBM Plex Sans + IBM Plex Mono (was Geist; rejected because too mainstream / Vercel-tier)
- ✅ Editorial italic: Newsreader (was Instrument Serif; rejected because perfumey/luxe vibe didn't fit research identity)
- ✅ Header: small wordmark + "LABS" mono chip (was wordmark + logo image; logo removed because read as Anthropic affiliation)
- ✅ Vial animation: subtle sway -12° ↔ +12° at 6.4s ease-in-out (was full 360° Y-rotation; rejected because read as spinny/consumer)
- ✅ Vial fill: cream-tinted powder mound with grain noise (was green liquid; rejected because doesn't read as lyophilized peptide)
- ✅ Atmospheric body: 4 layered radial gradients + SVG fractal noise overlay
- ✅ Reduced-motion: hard fallback (animation:none on everything)

**Rejected at proposal stage:**
- ❌ Geist Sans + Geist Mono (mainstream tech)
- ❌ Inter / Roboto / Open Sans (overused)
- ❌ Space Grotesk (overused)
- ❌ Warm amber (#ffb04f / #ffc878) atmospheric accent (reads as Anthropic brand)
- ❌ Purple/violet gradients
- ❌ 3-column SaaS feature grids with icons in colored circles
- ❌ Bubble-radius on every element
- ❌ Stock photography
- ❌ Full 360° vial rotation (too consumer/spinny)
- ❌ Box-in-box layouts (rectangular frames around content blocks)

**Open / unresolved:**
- 🔄 Cursor-reactive vial parallax (deferred to Claude design)
- 🔄 Button polish ("buttons need to be much better")
- 🔄 Background experimentation (animated mesh? particle field? CRT scanlines?)
- 🔄 Homepage hero composition
- 🔄 Product detail page layout
- 🔄 New surfaces: about, methods, standards
- 🔄 Marketing landing variants
- 🔄 Wordmark quality (PNG transparency edge, may need SVG)

---

## §5. Standalone HTML preview snippet (for Claude.ai artifact canvas)

If Claude.ai wants a starting point HTML file with everything wired in, give it this minimal scaffold:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mogtrix — Design Canvas</title>
<link rel="preconnect" href="https://fonts.bunny.net" crossorigin="anonymous">
<link rel="stylesheet" href="https://fonts.bunny.net/css?family=ibm-plex-sans:300,400,500,600,700|ibm-plex-mono:300,400,500,600|newsreader:400,400i,500,500i&display=swap">
<style>
  :root {
    --background:#020202; --scaffold:#050505; --surface:#111111; --surface-strong:#171717;
    --surface-data:#0a1f24; --border:#1f1f1f; --border-strong:#2a2a2a;
    --accent:#7cff00; --accent-soft:#b4ff2e; --acid-glow:#bfef8f;
    --electric:#22d3ee; --electric-soft:#67e8f9;
    --muted-blue:#7c93a8; --amber:#ffb04f; --error:#ff4d6d;
    --text:rgba(255,255,255,0.92); --text-muted:rgba(255,255,255,0.62); --text-subtle:rgba(255,255,255,0.36);
  }
  *,*::before,*::after { box-sizing:border-box; }
  html,body { margin:0; padding:0; }
  body {
    background:
      radial-gradient(ellipse at 78% 8%, rgba(124,255,0,0.16), transparent 32rem),
      radial-gradient(ellipse at 22% 22%, rgba(34,211,238,0.13), transparent 28rem),
      radial-gradient(ellipse at 8% 84%, rgba(10,31,36,0.7), transparent 30rem),
      radial-gradient(ellipse at 92% 90%, rgba(124,255,0,0.06), transparent 26rem),
      var(--background);
    color:var(--text);
    font-family:'IBM Plex Sans', -apple-system, sans-serif;
    font-feature-settings:'liga' on,'calt' on,'ss01' on;
    line-height:1.5;
    min-height:100vh;
    overflow-x:hidden;
  }
  body::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:1; opacity:0.6; mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>");
  }
  .mono { font-family:'IBM Plex Mono', ui-monospace, monospace; font-feature-settings:'tnum' on,'zero' on; }
  .serif { font-family:'Newsreader','Iowan Old Style', Georgia, serif; font-feature-settings:'liga' on; }
  .label { font-family:'IBM Plex Mono', monospace; text-transform:uppercase; font-size:11px; letter-spacing:0.16em; color:var(--text-subtle); }
  .shell { width:min(1240px, calc(100% - 32px)); margin:0 auto; }
  ::selection { background:var(--accent); color:#000; }
  @keyframes vial-rotate { 0%,100% { transform:rotateY(-12deg); } 50% { transform:rotateY(12deg); } }
  @keyframes vial-float  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
  @keyframes vial-sheen  { 0% { transform:translateX(-180%) rotate(12deg); opacity:0; } 18% { opacity:0.12; } 48% { opacity:0.28; } 100% { transform:translateX(440%) rotate(12deg); opacity:0; } }
  @keyframes pulse       { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.65; transform:scale(0.92); } }
  .vial-rotate { animation:vial-rotate 6.4s ease-in-out infinite; transform-style:preserve-3d; }
  .vial-float  { animation:vial-float 7.8s ease-in-out infinite; transform-origin:center bottom; }
  .vial-sheen  { animation:vial-sheen 5.4s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation:none !important; transition:none !important; } }
</style>
</head>
<body>
  <div class="shell" style="padding:80px 0;">
    <h1 style="font-size:88px; line-height:0.94; letter-spacing:-0.035em; font-weight:600; margin:0 0 24px;">
      Reference-grade peptides <em class="serif" style="font-style:italic; font-weight:400; color:var(--electric-soft);">for serious researchers.</em>
    </h1>
    <p style="font-size:18px; line-height:1.6; color:var(--text-muted); max-width:540px;">
      Mogtrix is the peptide catalog where serious researchers want to buy. Premium dark, instrument-grade. Every product a precision instrument with receipts attached.
    </p>
    <!-- design here -->
  </div>
</body>
</html>
```

This is the foundation. Build on it.

---

## §6. Photography & assets

If Claude.ai design needs to reference real product photos:

- 15 canonical Mogtrix products with photographic vials at `site/public/visuals/products/mogtrix-vials-photo-v1/`
- Wordmark at `site/public/brand/mogtrix_wordmark.png` (528×160 RGBA, has a transparent W edge — may need SVG replacement)
- Logo at `site/public/brand/mogtrix_logo.png` (DEPRECATED — removed from header per latest decision)

You don't need to send the actual files to Claude.ai (it can't read them). For mockups in the canvas, use placeholder vials or generate SVG/CSS vials matching the locked Vial primitive style (cream-powder fill, dark glass, acid-green sheen).

---

## §7. RUO compliance copy guard

Marketing copy is automatically rejected if it contains any of:
- weight loss, bodybuilding, human use, human consumption
- diagnose, treatment, cure, prevent disease
- dose, dosing, protocol

Use the scientific RUO register: "research-grade", "reference-grade", "Research Use Only", "qualified buyers", "RUO-qualified researchers", "laboratory use only", "for in vitro investigations".

If Claude.ai design generates copy, run it through that guard mentally before locking.

---

## §8. The 15 canonical products (for product card / catalog mockups)

Real product names you can use in mockups:

1. BPC-157 5mg (MGX-REC-BPC-005, $49) — pilot
2. BPC-157 + TB-500 (MGX-REC-BT5-010, $79) — pilot
3. CJC-1295 No DAC 5mg (MGX-GH-CJC-005, $69) — pilot
4. CJC-1295 + Ipamorelin (MGX-GH-CJI-010, $82) — pilot
5. Ipamorelin 5mg (MGX-GH-IPA-005, $63) — pilot
6. Semax 5mg
7. Selank 5mg
8. Dihexa 5mg
9. GHK-Cu 50mg / 100mg
10. GHK-Cu + BPC-157 + TB-500 blend
11. HGH-Frag 176-191 5mg
12. Mazdutide 10mg
13. MOTS-c 10mg / 40mg
14. FOXO4-DRI 10mg
15. Humanin 10mg

Real CAS numbers for mono-display: BPC-157 = 137525-51-0; CJC-1295 = 863288-34-0; Ipamorelin = 170851-70-4.

---

## §9. Sample mockup prompts to feed Claude.ai

Once context is loaded, kick off iterations with prompts like:

**For cursor-reactive vial:**
> Build a single HTML file with the locked palette + fonts. Include three vials side-by-side using the locked sway animation. Add a JS hook that, on mousemove anywhere on the page, computes a parallax tilt for each vial — rotateY based on cursor X delta from vial center, rotateX based on Y delta, max 6° each axis. Lerp smoothly. When cursor is far (>500px), default to the locked sway. When cursor is close, the parallax overrides the sway smoothly. Use requestAnimationFrame for smoothing. Make me feel the vial reacting to my cursor.

**For homepage hero:**
> Design the Mogtrix homepage hero. Three vials on a "lab bench" composition (bench is implied by lighting, NOT a literal box). Hero copy in 88px IBM Plex Sans 600 with Newsreader italic for the em phrase "for *serious researchers*". Below: 3-4 motion-rich proof points (e.g., "Every batch verified", "RUO-qualified buyers only", "Cold-chain US fulfillment", "COA shipped with every order") that scroll-in with stagger. Below those: a band showing 3 representative product cards (CJC-1295, BPC-157, Ipamorelin) with rotating-vial previews + name + price + acid-green CTA. Density should feel like Bloomberg × Linear × Apple product page. Heavy on motion. NO box-in-box. Single full HTML file.

**For product detail page:**
> Design the BPC-157 5mg product detail page. Layout: vial dominates the left column (no box around it, sits on body atmosphere), specs sheet + price + CTA on the right. Specs use IBM Plex Mono: CAS 137525-51-0, MW 1419.56, Sequence GEPPPGKPADDAGLV, Purity 99.2% HPLC, Batch L0237. Price $49 in 38px display. CTAs: primary acid-green "Add to research order" + outline "Verify COA". Tabs below the fold: Documentation / COA Library / Sourcing Chain / Method Validation. Density technical. Vial subtly sways with cursor-reactivity (use the locked spec). Single HTML file.

**For button polish (3 variants):**
> Generate 3 alternative primary-button designs for Mogtrix using the locked palette. Each variant should feel "much better than a generic acid-green rectangle". Try: (1) a beveled / 3D-pressed look with subtle inner highlight + dramatic shadow, (2) a custom angular shape (slight chamfer or asymmetric corner), (3) something unexpected but on-brand. Show all three side-by-side in one HTML file with hover states. Mono "$ verify --batch L0237" data variant included for comparison.

---

## §10. Handoff-back protocol — when you bring designs from Claude back to me

When you're satisfied with a design in Claude.ai, copy it back here in one of these forms:

### Format A (preferred): Single self-contained HTML file
Save the Claude.ai artifact as an `.html` file (or just paste me the full markup). I'll:
1. Drop it at `/root/.gstack/projects/abhicloses7838-mogtrix-website/designs/design-system-20260505/<name>.html`
2. Diff it against the current implementation
3. Extract the design tokens and check they match the locked palette + fonts (catch drift)
4. Wire the design into the appropriate React component(s) in `site/components/` — for surface designs, into the page in `site/app/<route>/page.tsx`
5. Add tests for any new patterns
6. Run lint + tests + build, confirm green
7. Commit

### Format B: Description + a sketch
If Claude.ai gave you a verbal description + ASCII or a simple diagram, paste it. I'll write the HTML for you.

### Format C: Claude.ai conversation transcript
If you want me to see the conversation flow, paste the relevant messages. I'll synthesize.

### What NOT to bring back
- Designs that change the locked palette (acid-green, electric cyan, dark backgrounds) — flag the drift before bringing them
- Designs using forbidden fonts (Geist, Inter, Space Grotesk, system-ui)
- Designs with purple/violet gradients
- Marketing copy that violates the RUO compliance guard (§7)
- Box-in-box layouts (per the previous user feedback)

If anything's flagged, tell me what direction Claude went and we'll decide together whether to adapt or reject.

---

## §11. State checkpoint at handoff time

This is your save point. When you bring designs back, the world looks like this:

**Repo state:** `mogtrix-website` branch `main`, 22 commits ahead of origin/main, HEAD at `28ae2a7`.
**Tests:** 194/194 passing. Lint clean. Build green.
**Design system foundation:** Sub-project A LOCKED in code per `DESIGN.md`. Iterating on the visual layer for downstream surface sub-projects (C–M).
**Servers running locally (until you stop them):**
- Live dev: http://localhost:3200/ — Next.js dev server with the new baseline
- Visual reference: http://localhost:8765/preview-v2.html — preview HTML with Newsreader, sway, powder, no box-in-box
**Master plan:** 21 sub-projects defined. A is done; B (backend completion) and C (home reimagining) are next, both blocked on locking the visual direction.

---

## §12. Claude design quick-start checklist

When you start in Claude.ai, do this in order:
1. ☐ Open a fresh Claude.ai conversation (or Project — Project preserves context across sessions)
2. ☐ Paste the §1 system context block as your first message
3. ☐ Confirm Claude understood by asking it to list the 4 brand pillars + the locked color tokens (reads back = understood)
4. ☐ Drop the §5 starter HTML scaffold into a Claude.ai artifact / canvas
5. ☐ Pick the highest-priority open item (cursor-reactive vial, homepage hero, or product detail page) and use the matching §9 prompt
6. ☐ Iterate until satisfied — Claude's canvas is great for fast visual iteration
7. ☐ Lock each surface as a final HTML artifact you can save
8. ☐ Bring back to me using §10 protocol

---

*End of handoff. Good luck — bring back what you make.*
