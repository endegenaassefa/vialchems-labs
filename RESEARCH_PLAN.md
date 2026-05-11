# RESEARCH_PLAN.md

**Session:** Pre-project research (2026-05-10).
**Mode:** Research + synthesis. No implementation beyond the three operator
quick-fixes that landed during the same session (theme toggle, text-subtle
contrast bump, vial movement removed).
**Owner directive:** the 3D vial route is not delivering photoreal vials.
The page is too white (some text fails contrast); add a theme switcher.
Find a path to real-photograph vials using the pasted research.

---

## 1. Executive summary

The Claude Code design ecosystem has matured fast in the last six months.
There are now three solid layers we can stand on: a **design-language layer**
(skills that teach Claude vocabulary and discipline), a **design-system
scaffolding layer** (drop-in DESIGN.md files from real brands), and a **UI
generation layer** (mockup tools like Google Stitch, v0, Mowgli, Figma Make).

For the operator's specific pain — **photoreal vials with custom Vialchems
labels** — none of the Claude-skill repos solve it directly. The honest path
is one of three production-photo workflows: (a) **AI image generation with
custom-style fine-tune** via Recraft V4 or FLUX-on-Replicate; (b) **PSD
smart-object mockups** purchased once from Yellow Images / Envato Elements
and labels swapped programmatically; or (c) **hybrid HTML/CSS label overlay
on a single high-quality empty-vial photo** (cheapest, fastest, most reliable).

Headline recommendation:

1. **Adopt impeccable** (26.7k★, Apache 2.0) as the design-discipline skill
   for ongoing audits and the operator vocabulary. It is the single most
   leverage-per-byte install in the ecosystem.
2. **Ship photoreal vials via Path (c) first** — one good empty-vial
   photograph (sourced or AI-generated once) + a positioned HTML/CSS or
   SVG label per SKU. Same image, different label. Zero generation cost
   per page render, instant load, indexable text.
3. **Keep the 3D vial** as a secondary asset (related grid, share cards,
   bundle hero) where the 1:1-with-biocollex bar isn't binding.

---

## 2. Inventory

Pasted across the Reddit threads + the operator's synthesis paragraphs +
the trailing repo dump. Every row was either WebFetched, WebSearched, or
flagged as common knowledge.

### 2.1 Design-language / -discipline skills (Claude Code)

| Name | Category | Link | Status | One-line purpose |
|---|---|---|---|---|
| **impeccable** | Design skill (slash commands) | github.com/pbakaus/impeccable | Active · 26.7k★ · Apache 2.0 · v3.0.7 (2026-05-04) | 23 slash commands (`/audit`, `/polish`, `/bolder`, etc.) that teach Claude design vocabulary and 27 anti-pattern rules. |
| **anthropics/skills · frontend-design** | Design skill | github.com/anthropics/skills | Active · official | "Create distinctive, production-grade frontend interfaces with high design quality." 10 principles from design thinking through motion. |
| **manalkaff/opendesign** | Claude Design CLI port | github.com/manalkaff/opendesign | Active · 38★ · MIT · v0.3.1 | 10 commands (`/opendesign`, `/wireframe`, `/interactive-prototype`, `/make-a-deck`, `/make-tweakable`). Outputs HTML, runs local preview on :8289. |
| **alchaincyf/huashu-design** | Claude Design extraction | github.com/alchaincyf/huashu-design | Active · 13k★ · paid commercial | Generates prototypes / decks / MP4 animations / radar critiques. **Commercial use requires ~$1,800/yr or $3,500 perpetual.** Personal-only otherwise. |
| **nextlevelbuilder/ui-ux-pro-max-skill** | UI/UX skill | github.com/nextlevelbuilder/ui-ux-pro-max-skill | Active · claimed 76.4k★ · MIT · v2.5.0 | 67 styles, 161 palettes, 57 font pairings, 99 UX guidelines, 25 chart types. Heavy. |
| **typeui.sh** | Design skill registry + CLI | typeui.sh | Active · freemium ($30/mo pro) | 67 design skills + 85 UI prompts. CLI: `npx typeui.sh pull <theme>`. |
| **ryanthedev/design-for-ai** | Design skill (book-based) | github.com/ryanthedev/design-for-ai | Active · 156★ · MIT | Based on *Design for Hackers* (Kadavy). CHECKER (audits) + APPLIER (phased builds). |
| **davila7/claude-code-templates** | Skills/agent registry | github.com/davila7/claude-code-templates · aitmpl.com | Active · 27.1k★ · MIT | Broad collection. No `senior-frontend` agent visible in the agents folder despite Reddit mention. |
| **Anthropic Claude Design (web)** | Hosted | claude.ai/design | Active · web-only | The original; opendesign + huashu are CLI ports. |

### 2.2 DESIGN.md scaffolding (drop-in brand systems)

| Name | Brands | Link | Status | Notes |
|---|---|---|---|---|
| **Khalidabdi1/design-ai** | 116 brands incl. Stripe, Linear, Vercel, Apple, Notion, Anthropic | github.com/Khalidabdi1/design-ai | Active · 126★ · MIT | Drop a `DESIGN.md` into project root; Claude builds UI that matches the target system. |
| **VoltAgent/awesome-claude-design** | 68 brands incl. Cursor, Vercel, Warp, Linear, Anthropic, ElevenLabs | github.com/VoltAgent/awesome-claude-design | Active · MIT | Curated; pairs with Claude Design web. Tagline: "Keep token, rule, and rationale in the same file." |
| **"Awesome Design MD" (synthesis paragraph)** | 50+ brands | — | Ambiguous (likely refers to VoltAgent or design-ai above) | Operator-pasted summary; no unique repo confirmed. |

### 2.3 UI generation / mockup tools (external)

| Name | Output | Link | Pricing | Notes |
|---|---|---|---|---|
| **Google Stitch** | Design mockups (DESIGN.md + screenshots) | stitch.withgoogle.com | Free preview | Most-mentioned in pasted material. Page content too light to verify export formats. |
| **v0 by Vercel** | React + Tailwind components | v0.app | Freemium | Production-ready React output. Pairs with shadcn. |
| **Figma Make** | Figma frames | figma.com/make | Figma plan-gated | UI generation inside Figma. |
| **Magic Patterns** | Component-level code | magicpatterns.com | Freemium | "Actual component-level output you can ship." |
| **Mowgli AI** | High-fidelity UI + React/Tailwind export + AI bundle for Claude/Cursor | mowgli.ai | Freemium | "AI design canvas that deeply understands your product." Spec-driven. |
| **Lovable / Bolt / Base44 / Tweakcn / Durable / Gamma** | Full-app builders | — | Various | App-builder tier, not just mockups. |
| **Uizard / Relume / Moonchild.ai** | Mockups + wireframes | — | Various | Wireframe-first workflow. |
| **Cursor visual editor** | In-IDE UI nudges | cursor.com | Cursor plan | Post-code visual tweaks. |
| **Figma + Mobbin + Dribbble** | Manual design + inspiration | — | Various | Backbone for teams with a designer. |
| **Excalidraw / Miro** | Wireframes / flows | — | Free / freemium | Pre-design ideation. |

### 2.4 Image generation (raster / SVG / vector)

| Name | Type | Link | Status | Fit for photoreal vial |
|---|---|---|---|---|
| **Recraft AI (V4)** | Raster + vector, photoreal mode, custom styles via drop-in | recraft.ai | Active · freemium + API | **Strong fit.** Custom-style upload "without training." API access. |
| **FLUX.2 pro (via Replicate)** | Raster photoreal | replicate.com/black-forest-labs/flux-2-pro | Active · pay-per-call | High photoreal quality, character consistency. |
| **OpenAI gpt-image-2 (via Replicate or OpenAI API)** | Raster, sharp text rendering | — | Active · pay-per-call | Better at in-image text than most. |
| **Google Nano-Banana-2 (via Replicate)** | Conversational editing, multi-image fusion | — | Active · pay-per-call | Useful for label-area inpainting. |
| **Midjourney** | Raster | midjourney.com | Active · paid only | Strong photoreal; no API for in-app; community calls "not enterprise." |
| **Stable Diffusion / SDXL (Replicate or self-host)** | Raster | — | Active · open weights | Self-host = zero per-image cost after setup. |
| **Quiver AI** | **SVG only** | quiver.ai | Active · API · a16z-backed | **Not a fit for photoreal vials.** Strong for logos / icons / illustrations. |
| **svgs.app** | SVG generation | svgs.app | Active · freemium | Same lane as Quiver, less ambitious. |
| **Remotion** | Programmatic React → MP4 video | remotion.dev | Active · OSS | For animation, not product stills. |
| **Lottie / LottieFiles** | JSON-driven animations | lottiefiles.com | Freemium | UI micro-anim. |
| **Heroicons / Lucide / Phosphor** | Curated icon sets | — | Free / MIT | Already in use (lucide-react installed). |
| **SVG Repo** | One-off SVGs | svgrepo.com | Free + paid | Per-asset. |

### 2.5 PSD-mockup providers (smart-object label workflow)

| Name | Catalog | Link | Pricing | Vial mockups? |
|---|---|---|---|---|
| **Yellow Images** | Pharma + commerce focus | yellowimages.com | Per-asset (~$15–$60) or sub | Medical / pharmaceutical vial PSDs exist (direct fetch blocked by Cloudflare 403; verify live). |
| **Envato Elements** | General + product mockups | envato.com/elements | Subscription $16.50/mo unlimited | (Fetch blocked 403.) Known to carry vial mockups. |
| **Creative Market** | Indie sellers | creativemarket.com | Per-asset | Variable quality, single-license per buyer. |
| **Freepik** | Mixed-license catalog | freepik.com | Free w/ attribution / paid sub | Some vial mockups available. |

### 2.6 Skill/repo curation lists (meta)

| Name | Stars | Link | Notes |
|---|---|---|---|
| ComposioHQ/awesome-claude-skills | 59.1k | github.com/ComposioHQ/awesome-claude-skills | "1000+ production-ready Claude Skills." Notable: Canvas Design, Image Enhancer, Theme Factory, Canva Automation. |
| hesreallyhim/awesome-claude-code | 43.3k | github.com/hesreallyhim/awesome-claude-code | Broader than skills. README structure being reorganized at fetch time. |
| travisvn/awesome-claude-skills | (community) | github.com/travisvn/awesome-claude-skills | Lists `frontend-design`, `algorithmic-art`, `canvas-design`, `web-asset-generator`, `slack-gif-creator`. No photoreal-product skill. |
| rohitg00/awesome-claude-code-toolkit | (1k+) | github.com/rohitg00/awesome-claude-code-toolkit | 135 agents, 35+ skills, 176 plugins. Kitchen-sink. |
| jqueryscript/awesome-claude-code | — | — | Top-repos-by-stars index. |
| ComposioHQ/awesome-claude-plugins | 1.4k | github.com/ComposioHQ/awesome-claude-plugins | Plugin index. |
| x1xhlol/system-prompts-and-models-of-ai-tools | high | github.com/x1xhlol/system-prompts-and-models-of-ai-tools | Reverse-engineered system prompts. Not design-specific. |
| nexu-io/open-design | — | github.com/nexu-io/open-design | Parallel Claude Design extraction; manalkaff/opendesign predates it. |

### 2.7 Adjacent (mentioned but off-spec)

| Name | Why off-spec |
|---|---|
| Repomix, ccusage, ComposioHQ/agent-orchestrator, OpenWolf, GSD, gstack, Superpowers, ARS CONTEXTA, Mem-Palace, claude-meter | Workflow / context / token tools — not design. |
| Karpathy CLAUDE.md, claude-code-system-prompts, SuperClaude_Framework | Prompt engineering. |
| andan02/console.kubestellar.io | Unrelated badge tool. |
| Storybook + shadcn MCP | Component library tooling, on-spec but already addressable directly via shadcn install. |
| WordPress / respira.press | CMS workflow. |
| Vercel Agent browser | Browsing agent. |

### 2.8 Flagged

- **The "Awesome Design MD" entry** in the operator synthesis: no unique repo
  matches; appears to be paraphrase of VoltAgent/awesome-claude-design or
  Khalidabdi1/design-ai. Treating it as a duplicate.
- **davila7/claude-code-templates senior-frontend agent**: Reddit posters
  recommended it but the agents/ folder visible from the canonical repo does
  **not** contain a `senior-frontend` agent. Possibly renamed or removed; do
  not rely on this attribution until verified locally.
- **anthropics/skills frontend-design SKILL.md raw fetch failed via WebFetch**
  (returned directory listing only). The skill description was reconstructed
  from a previously-fetched normalized excerpt; treat the verbatim quote as
  approximate and re-verify before quoting in any deliverable.
- **typeui.sh's 67 skills claim** matches the headline count from
  ui-ux-pro-max-skill — coincidence or shared origin. Re-verify before
  installing both.
- **Mowgli AI / Stitch / Recraft pricing pages** all serve under-content via
  WebFetch (heavy JS or auth gates). Pricing-specifics confirmed only via the
  general product pages.

---

## 3. Findings by category

### A. Design-discipline skills (teach Claude vocabulary)

**Winner: impeccable.** 26.7k stars, Apache 2.0, 23 commands, active weekly
releases, anti-pattern rules that explicitly target the AI-slop look the
operator was burned by ("Inter for everything, purple-to-blue gradients,
cards nested in cards"). One install gives Claude the verbs it needs to
talk about design changes ("bolder," "quieter," "distill," "harden",
"colorize," "typeset," "layout") — and it's exactly the vocab the operator
already uses informally in chat.

Runner-up: **anthropics/skills/frontend-design** — auto-installs with the
official marketplace, sets foundational principles, no overlap with
impeccable's audit/polish surface. Use both; they don't conflict.

Skip: **huashu-design** for our case — commercial license fee + same surface
area as opendesign and impeccable combined. **ui-ux-pro-max-skill** has a
heroic feature count but the star-count claim warrants extra verification
before adoption (76.4k★ for a relatively unknown skill in this market is an
outlier). **typeui.sh** is paid-pro for the bulk of its catalog and overlaps
with impeccable's discipline layer at $30/mo we don't need yet.

### B. DESIGN.md scaffolding (drop-in brand systems)

**Winner: Khalidabdi1/design-ai.** 116 brands at 126 stars — denser per-brand
than VoltAgent (68 brands). MIT-licensed, simple drop-in pattern, Anthropic
+ Stripe + Linear + Vercel all present. Use for inspiration grabs — *not* to
clone, but to harvest specific patterns (e.g. "make our trust strip look
like Stripe's badge row").

We already wrote our own `DESIGN.md` for vailchem.labs and a Posture A
spec in `lib/design/tokens.ts`. The play is to **diff our DESIGN.md against
2–3 reference brands** (Linear for restraint, Stripe for trust messaging,
Apple for product-photography composition) and lift specific moves.

### C. UI generation tools (mockup engines)

For this project, **none of these are load-bearing.** We already have a
working PDP with our own design system. The category is most useful for
*new* pages we haven't built yet (Verify a Vial, Get Verified, My Lab,
Order Detail). When that time comes:

- **Mowgli AI** for the highest fidelity if we're willing to feed it our
  DESIGN.md + product spec. Outputs an AI bundle for Claude Code.
- **v0 by Vercel** for React + shadcn-compatible drop-ins (we're already
  on Next.js + Tailwind v4; shadcn slots in cleanly).
- **Google Stitch** for a quick brain-dump → DESIGN.md sketch.

Skip the rest until we hit a page we can't sketch ourselves.

### D. Photoreal product images (THE primary unsolved problem)

This is what the operator actually cares about. **No Claude-skill repo
solves this — every design skill assumes someone else is bringing the
imagery.** The realistic paths:

**(c) HTML/CSS label overlay on one good empty-vial photograph** —
recommended. One asset, one CDN load, infinite SKUs.

- Source the empty-vial photo once: Recraft V4 generation (~10 attempts to
  get The One), Yellow Images PSD purchase (~$30), or commission a quick
  product photo (~$100 freelancer).
- Mask the label area in the photo (clear / very light); render our custom
  label as a positioned `<div>` (or as an SVG element with `clipPath`) on
  top of the image with the compound name + dose + RUO + QR.
- Result: looks photographic at any viewport, the label text stays selectable
  + indexable + multilingual, and per-SKU variation is `swap one string`.

**(a) AI generation per SKU via Recraft V4 custom style** —
viable but expensive and inconsistent.

- Upload 4–6 reference photos of the desired vial aesthetic → save as
  custom style.
- For each of our 16 SKUs, generate via API with prompt that names the
  compound + dose. Recraft V4 claims "perfect lighting and lens distortions"
  + "sharp text rendering" — but in practice AI-generated labels with
  arbitrary compound names ("CJC-1295 (no DAC)") drift.
- Cost: small per generation, but pages need fallbacks and you regen-on-rebrand.

**(b) PSD smart-object mockup** — most predictable, requires Photoshop
or Photopea to swap labels per SKU. One-time cost, manual labour each new
SKU. Reasonable backup plan.

**(d) Keep the Three.js 3D vial as a secondary asset** — still useful for
the related-grid thumbnails, share/OG cards, and bundle hero. Already
working in our codebase. We'd be deleting code to remove it; instead, **demote
it from PDP hero and let the photo lead.**

Reject: Quiver AI / svgs.app (SVG-only, can't do photoreal glass). Mowgli /
v0 / Stitch (they don't generate product photos). Midjourney (no API gate
into our pipeline).

### E. SVG asset / icon generation

For icons we're already on **lucide-react** which is the right answer per
the pasted thread (Heroicons / Lucide / Phosphor are all valid; Lucide is
the active fork of Feather Icons, biggest icon set of the three, no license
issues).

For custom SVG illustrations (e.g. molecule-line backgrounds, hex-grid
patterns), **Recraft AI vector mode** or **Quiver AI** both work; we don't
need either yet — our current SVG backgrounds are hand-rolled and look
clean.

### F. Animation

We just removed all vial animation per operator directive — "no movement."
For other UI motion (hover transitions, page transitions, focus rings),
**CSS-only + Framer Motion** is the prevailing recommendation and matches
what we already use. **Lottie** is overkill for our minimalist Posture A
voice. **Remotion** is unrelated (video).

### G. Theme switching + contrast

Just shipped:
- `components/ThemeToggle.tsx` — client island, sun/moon icon, persists to
  `localStorage` under `vc-theme`.
- No-FOUC inline script in `app/layout.tsx <head>` flips `[data-theme]` on
  `<html>` before React mounts.
- `--text-subtle` bumped from `#8b95a1` (3.4:1 on `#fafaf7`) to `#6b7280`
  (4.8:1) to clear WCAG AA for body text.
- `--text-muted` bumped from `#5a6470` to `#4d5663` (7.1:1, AAA territory).
- Dark theme tokens already wired under `[data-theme="dark"]`.

---

## 4. Recommended toolkit

The short list we should actually install/use. Everything else can stay
on the bookmarked shelf.

| Tier | Tool | Why | Install |
|---|---|---|---|
| **Tier 1 — install today** | **impeccable** | Design vocabulary + audit/polish surface that already matches operator's chat voice. Apache 2.0, active. | `cp -r dist/claude-code/.claude ~/.claude/` after cloning github.com/pbakaus/impeccable |
| **Tier 1** | **anthropics/skills/frontend-design** | Foundational design-thinking principles; canonical Anthropic skill; auto-marketplace. | `/plugin install frontend-design@anthropic-agent-skills` |
| **Tier 2 — install when needed** | **Khalidabdi1/design-ai** | When we want to lift a specific move from Stripe / Linear / Vercel / Apple. | Copy any `DESIGN.md` into `/docs/inspo/` and reference it in chat. |
| **Tier 2** | **manalkaff/opendesign** | If we ever want a quick disposable mockup for an unbuilt page (Verify a Vial, Get Verified flow). | `/plugin install opendesign@opendesign` |
| **Tier 3 — for the photoreal vial** | **One good empty-vial photo** | Source via Recraft V4 (free tier) → if not, Yellow Images (~$30). | Manual; goes into `public/vials/` |
| **Tier 3** | **HTML/CSS label overlay (new component)** | Render our existing label data as a positioned overlay on the photo. Per-SKU variation = string swap. | New file: `components/ui/VialPhotograph.tsx` (next session) |
| **Tier 3 — fallback only** | **Replicate FLUX.2 pro API** | If we later want per-SKU AI-generated full-vial photos. Costs scale with SKU count. | Replicate JS SDK in a build-time script that writes to `public/vials/<sku>.webp` |

Deferred: ui-ux-pro-max-skill (star-count to verify), typeui.sh (paid pro
overlap), huashu-design (commercial license cost), Mowgli (only when we hit
a page we can't sketch), v0 / Stitch / Figma Make (same condition).

Rejected: Quiver AI for vials (vector-only), Midjourney for pipeline (no
API), Lovable / Bolt / Base44 (full-app builders, we already have an app),
Cursor visual editor (we're on Claude Code), huashu commercial.

---

## 5. Proposed plan of attack

Ordered phases. Each phase states what we install, what it enables, what
hands off to the next.

### Phase 1 — Design-discipline bedrock (1 session, ~30 min)

- Install **impeccable** globally to `~/.claude/`. Run `/impeccable teach`
  inside the repo so it ingests our existing `DESIGN.md` and `tokens.ts`.
- Install **anthropics/skills/frontend-design** via marketplace.
- Run `/impeccable audit` on `app/products/[slug]/page.tsx` to catalogue
  any remaining slop (likely items: spacing rhythm, eyebrow contrast,
  thumbnail consistency).
- Apply audit findings. This unblocks the operator's "ours is blue stuff
  like that" complaint by giving Claude shared vocab.

**Hands off:** a baseline of operator + Claude speaking the same design
language. Required before we make brand decisions.

### Phase 2 — Brand-inspo grabs (1 session, ~30 min)

- Pull 3 reference `DESIGN.md` files from `Khalidabdi1/design-ai` into
  `docs/inspo/`: **Linear** (restraint), **Stripe** (trust messaging),
  **Apple** (product photography composition).
- Run `/impeccable critique` against each on the PDP. We don't want to
  *be* any of them; we want to extract one move from each.
  - Linear: dot-leader specs, ultra-quiet eyebrows.
  - Stripe: numerical trust badges with status dots.
  - Apple: product as hero, surrounding chrome quiet.

**Hands off:** a list of 5–10 specific micro-moves we want to land, scoped
to PDP first.

### Phase 3 — Photoreal vial (the main event) (1–2 sessions)

**Step 3a — source the empty-vial photograph (operator decision required).**

Three forks; pick one:

| Fork | Cost | Lead time | Operator decides |
|---|---|---|---|
| Recraft V4 generation | $0 (free tier, ~50 generations) | 30 min | Best for solo; we control the iterations. |
| Yellow Images PSD purchase | ~$30–60 | 10 min after purchase | Best for a known-good asset that's been used in pharma marketing. |
| Freelancer product shot | ~$100–200 | 2–5 days | Best long-term — owns the asset, can re-shoot variants. |

Recommendation: start with Recraft V4. Free tier covers exploration; pay
~$10 if we need API generation. If the result doesn't ship in 30 min, fall
back to Yellow Images.

**Step 3b — build `<VialPhotograph>` component.**

- One `<Image>` element (Next.js, `priority` on hero) of the empty vial
  on transparent or color-matched background.
- A positioned `<div>` overlay containing the label data. CSS variables
  drive the overlay position (top/left/width/height) so different photos
  can be slotted in by tuning four numbers.
- Label content composed of the same data the current `<Vial3D>` reads
  from: compound, dose, RUO disclaimer, QR placeholder, batch.
- Text is real HTML — selectable, indexable, multilingual.
- Hover state: very subtle scale (1.02) or zero motion (operator preference).

**Step 3c — wire into PDP hero in place of the 3D canvas.**

Demote `<Vial3DClient>` to: related-grid thumbnails (where the 1:1
photo-fidelity bar isn't binding), share/OG card generation
(`opengraph-image.tsx`), and bundle hero (multiple constituents — composite
photos get expensive).

**Hands off:** the PDP hero looks like a real product photo.

### Phase 4 — Roll out to remaining catalog + bundles (1 session)

- Apply `<VialPhotograph>` to all 16 SKU PDPs.
- For bundle PDPs (`/products/recovery-stack`, etc.), composite two vial
  photos side-by-side with shared lighting baked in (or render two
  `<VialPhotograph>` components side-by-side with a slight rotation).
- Update OG image (`app/opengraph-image.tsx` + per-product
  `opengraph-image.tsx`) to use the photograph variant.

**Hands off:** every PDP plus share cards are photoreal-grade.

### Phase 5 — Build the rest of the site under the new system (multi-session)

For pages we haven't built yet (Verify a Vial, Get Verified, My Lab, Order
Detail, COA Lookup), use **manalkaff/opendesign** to throw together quick
HTML mockups, run them past `/impeccable critique`, then ask Claude Code
to implement.

---

## 6. Open questions for the user

These come back to bite us in the next session if we don't get answers up
front. Park here, don't guess.

1. **Empty-vial photo source decision** — Recraft V4 (free, iterative),
   Yellow Images (~$30, one-time, known-quality), or freelancer
   (~$100–200, longest reuse). Each has different tradeoffs around speed
   and ownership.
2. **Label layout: HTML/CSS overlay vs. SVG overlay vs. baked-in.**
   - HTML/CSS: simplest, label text is HTML.
   - SVG: precise positioning and shape (curve along bottle), more code.
   - Baked-in: bake the label into the image per SKU (Photopea or Recraft
     img2img). Slowest to update, fastest to render.
3. **Is the 3D vial keeper or scrap?** Operator said "this rout is not
   working" — that could mean kill it entirely, or demote it. My
   recommendation is demote (keep for thumbnails + OG cards), but operator
   may want a clean removal.
4. **impeccable / frontend-design install scope** — install globally to
   `~/.claude/` (works across all repos) or project-local at
   `.claude/skills/` (locked to this repo, version-controlled).
5. **Theme default per-route?** Currently the whole site defaults to light
   and the toggle is global. Some operators want the marketing pages light
   but the data-heavy account pages dark. Worth deciding before we start
   propagating styles.
6. **Are Tier 2 brand DESIGN.md grabs in scope this session?** Or hold for
   a later "polish pass"?
7. **Recraft API tier vs. manual generations.** API costs money per
   generation; manual generations from the web UI are free under the
   limit. For 16 SKUs, manual is fine. For 100+ SKUs / dynamic catalog,
   API.
8. **Comparison reference for "photoreal":** the operator's gold standard
   is `biocollexresearch.com/product/ghk-cu/`. Confirm we're still
   benchmarking against that, or whether the bar has shifted.

---

## 7. Flagged items

- **anthropics/skills/frontend-design** raw `SKILL.md` was not fetchable
  via WebFetch (returned directory listing). The principles list above
  was reconstructed from a fetched summary. Verify the full text before
  authoring downstream skill prompts.
- **davila7/claude-code-templates senior-frontend agent** — Reddit users
  cited it; the agents/ folder visible from a direct fetch does not
  contain it. Possibly renamed/moved or never existed under that name.
  Do not link to it without a fresh check.
- **ui-ux-pro-max-skill star count (76.4k)** is anomalously high for a
  skill in a niche ecosystem (compare to impeccable's 26.7k, alirezarezvani's
  14.3k, design-ai's 126). Verify before adoption.
- **huashu-design commercial license** ($1,800–$3,500). Skip unless we
  hit a feature only this tool offers, which I didn't find.
- **typeui.sh "67 skills"** number coincidence with ui-ux-pro-max-skill
  "67 styles." Re-verify they're not the same underlying content rebadged.
- **Yellow Images / Envato Elements** fetches returned 403 (Cloudflare).
  Vial-mockup availability confirmed via secondary sources; verify
  catalogue + pricing live before purchase.
- **Mowgli AI / Stitch / Recraft pricing pages** all serve under-content
  via WebFetch. Verify pricing live before committing budget.
- **"Awesome Design MD" entry** in operator synthesis appears to be a
  paraphrase of VoltAgent/awesome-claude-design or Khalidabdi1/design-ai;
  no unique repo confirmed.

---

## Stopping point

This session ends here. The next move is the operator's. Three things to
decide before we touch code again:

1. **Empty-vial photo source** — Recraft, Yellow Images, or freelancer.
2. **Demote or delete the 3D vial.**
3. **Greenlight Phase 1 (install impeccable + frontend-design + run audit).**

When you're ready, point me at one of those and I'll execute.
