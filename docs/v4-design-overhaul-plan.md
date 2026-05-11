# vialchemlabs UI Elevation Plan — From 11 Reference Sites

**Date:** 2026-05-10
**Source dissections:** biocollexresearch.com, designingui.com, klokki.com, tetrisly.com, handy.graphics, composio.dev, getmitra.com, aidesign-os.com, rogo.ai, akiflow.com, titanintake.com
**Constraints respected:** Iron Law 2.21 (additive tokens only, no renames), Iron Law 2.26 (brand expression locked: charcoal + teal + Plex pairing, "Counted, weighed, verified."), Iron Law 2.10 (no fake reviews), Iron Law 2.4 (no forbidden marketing patterns)

---

## Part 1 — Cross-Site Pattern Matrix

The 11 dissections converge on a small set of moves that distinguish premium sites from generic ones. Each row below is a pattern, with which sites do it and how.

| # | Pattern | Strongest examples | What lesser sites do instead |
|---|---|---|---|
| **P1** | **One distinctive hero artifact, not a stock visual** | Composio's ASCII art lockups; Mitra's dialogue transcript; Rogo's single editorial hero image; Klokki's product-in-context screenshot | 3-column icon grid, generic gradient hero, stock laptop photo |
| **P2** | **Trust hierarchy: peer validation BEFORE feature claims** | Rogo (3 named-exec testimonials before "Why choose Rogo"); Titan (named clinic directors with title + organization) | Features-first, then "what people say" buried at bottom |
| **P3** | **Quantified comparative proof, not adjectives** | Titan ("Referrals: 1 min WITH vs 15 min WITHOUT" — 6-row table); Rogo ("35K+ users, 50K+ daily queries, 250+ institutions"); Designingui (4.98 / 769 pages / 25+ years) | "Faster," "better," "more efficient" |
| **P4** | **Demo as proof, not screenshot as feature** | Composio (live agent UI showing real OAuth flow); Mitra (chat-bubble dialogue with actual airline refund scenario); Akiflow (drag-task-to-calendar) | Static feature screenshot with caption |
| **P5** | **Domain-specific design tells** | Composio ASCII art = terminal/CLI; Titan numbered 01-04 mono steps = clinical process; Rogo navy + restrained palette = enterprise finance; AI Design OS lowercase + line breaks = experimental thinking | Generic SaaS template (purple/blue gradients, three feature cards, smiling stock photos) |
| **P6** | **Dark mode + monospace + restraint = premium** | Composio (canonical: dark `#1a1a1a` + ASCII + code blocks); Rogo (deep navy/charcoal, no accent color competition) | Light bg + saturated accent + heavy illustration |
| **P7** | **Named/organizational credibility, not generic testimonials** | Rogo (Tom Hackett, Patrice Maffre, Ross Williams + firm names); Titan (Srini Reddy at Wake Spine and Pain Specialists) | "John D., Marketing Director" or "★★★★★" with no source |
| **P8** | **One CTA, repeated with discipline** | Akiflow ("Start for free" + "7 days free. Cancel anytime." 8x with identical subtext); Mitra ("Try Mitra" linking only to App Store) | 4 different CTA verbs scattered across the page |
| **P9** | **Compliance handled deliberately, not bolted on** | Titan (zero "HIPAA Compliant" theater — handles it quietly in product); Rogo (compliance badges placed AFTER value prop, not before) | Compliance disclaimer in every section, age-gate modals, scary legal blocks |
| **P10** | **Generous section breathing, ONE idea per section** | Rogo, Titan, Composio (each section gets 2-4rem padding + single thesis); Mitra (3 columns max, never more) | Cramming 6 features into one section to "save scroll" |
| **P11** | **Real photography or zero photography — never stock** | Rogo (single 4060×2538 editorial hero); Mitra (real airline scenario, no stock); AI Design OS (zero imagery — typography carries everything); Designingui (real Twitter avatars in social proof) | Smiling-team-around-laptop stock |
| **P12** | **Footer as extended IA, not afterthought** | Framer (70+ links); Rogo (multi-column products/solutions/resources/company); Composio (multi-column with social) | Single row of Privacy / Terms / © |
| **P13** | **Self-referential proof when possible** | Tetrisly (uses its own components to show its components); Handy.graphics (each font specimen displays itself); AI Design OS (the manifesto IS the product demo) | Generic mockups disconnected from product |
| **P14** | **Process narrative > feature list** | Titan ("From Fax to Act" — Capture → Extract → Organize → Integrate); Composio's ASCII flow diagrams | Bulleted "Features" section |
| **P15** | **Honest scope language reduces friction** | Klokki ("status banner explaining development pause" — vulnerability builds trust); Akiflow ("Cancel anytime" lowers commitment cost); Mitra ("9:41" status bar = real product, not mockup) | Hype words, vague promises |

---

## Part 2 — What vialchemlabs Can Actually Borrow

### A. Directly portable (do these)

| Pattern | vialchemlabs application | Files affected | Iron Law check |
|---|---|---|---|
| **P1 — Distinctive hero artifact** | Replace `app/page.tsx` 3-column thesis hero with **single hero composition**: real photography of one vialchemlabs vial against charcoal `#0a0e0f` background, sheen catching the `#3dd4c8` teal accent. Vial label visible. Plex Mono batch number floating beside it. | `app/page.tsx`, new `public/hero-vial-bpc-157.webp` | ✓ 2.21 (uses existing tokens), ✓ 2.26 (palette locked) |
| **P3 — Quantified comparative** | Add "Industry standard COA vs vialchemlabs COA" table on `/test-reports` and `/coa`. Rows: HPLC % minimum, Sterility (USP <71>), Endotoxin (LAL EU/mg), Mass spec confirmation, Batch traceability, Lab independence. Columns: Industry typical / vialchemlabs standard. | `app/test-reports/page.tsx`, `app/coa/page.tsx`, new `components/ComparativeTable.tsx` | ✓ All — uses real research from corpus |
| **P4 — Demo as proof** | On PDP, replace generic `<Vial>` hero with a **scenario block**: "Order placed → COA fetched → Vial shipped" mini-flow with real batch number + real test date + real ship pattern. Even with placeholder data, looks like a real audit trail. | `app/products/[slug]/page.tsx` | ✓ 2.4 (no claims), ✓ 2.10 (no fake reviews — this is process not testimony) |
| **P5 — Domain-specific design tells** | **Lab-coded design language**: chemistry notation (Cu²⁺ in GHK-Cu), Plex Mono for SKU codes (already done), peptide sequence display (Gly-His-Lys for GHK-Cu), molecular weight values prominent, USP standard references inline. Borrow from Composio's "use technical aesthetics to build credibility." | PDP descriptions, `components/ui/Specs.tsx` extension, new `components/PeptideStructure.tsx` | ✓ All — research-grade enrichment |
| **P6 — Dark + mono + restraint** | Already locked. v4 adds: deepen restraint by **removing italic-two-line-hero from 11 pages**, varying it. Keep on home + about; replace elsewhere with all-Plex-Sans variants or quantified data displays. | `app/page.tsx`, `app/shop/page.tsx`, `app/coa/page.tsx`, `app/blog/page.tsx`, `app/faq/page.tsx`, `app/contact/page.tsx`, `app/affiliate/page.tsx`, `app/test-reports/page.tsx`, `app/not-found.tsx`, etc. | ✓ 2.21 (no token changes), ✓ 2.26 (brand voice expansion within Posture A) |
| **P8 — One CTA, repeated** | Pick ONE primary CTA — "Browse the Catalog" or "View a COA" — and use it consistently across all marketing pages with identical subtext. Stop scattering "Learn more" / "Start your research" / "Request COA" / etc. | All public marketing pages | ✓ All |
| **P9 — Compliance not bolted on** | Currently vialchemlabs has compliance disclaimers in 6+ places per page. Reduce to: footer (verbatim, locked), PDP disclaimer card (verbatim, locked), checkout review step (verbatim, locked). Remove duplicate disclaimer messaging in marketing copy. | Multiple — audit needed | ✓ 2.4 (the LOCKED disclaimers stay verbatim; what changes is duplicate marketing-side warnings) |
| **P10 — One idea per section + generous padding** | Audit `app/page.tsx`, `app/about/page.tsx`, `app/test-reports/page.tsx`, `app/affiliate/page.tsx` — increase section padding from current `--sp-3xl` (48px) to `--sp-6xl` (128px) between major sections. Add `--sp-7xl` (192px) and `--sp-8xl` (256px) tokens (already defined in v4 Phase 1) for hero sections. | `app/globals.css` (already has the tokens), `app/*/page.tsx` (apply `py-32` / `py-40` / `py-48` Tailwind classes) | ✓ 2.21 (tokens already added) |
| **P14 — Process narrative** | Add **"How a vial reaches you"** section (or "What every batch goes through") with 5-6 numbered Plex Mono steps, mirroring Titan's `01 / 02 / 03 / 04` pattern. Steps: 01 Synthesized at GMP facility / 02 Sampled per batch / 03 Tested at Janoshik / 04 COA published / 05 Lyophilized & vialed / 06 Shipped same business day. | `app/about/page.tsx` (replace dense paragraphs with this), or new home section | ✓ All |
| **P11 — Real photography or zero** | Currently vialchemlabs has 5 leftover Next.js scaffold SVGs and zero product photos. Either commission **3 real photos** (vial macro, lab equipment, packaging open) — OR — go full **zero-imagery editorial** like AI Design OS, where Plex typography + atmospheric backgrounds carry everything. The middle path (current state with SVGs and placeholder vibes) is the worst option. | `public/`, all marketing pages | ✓ 2.10 (no stock, no testimonial fakery), needs operator decision |
| **P15 — Honest scope language** | Add a small **"What's stubbed / What's live"** footer card on the homepage (or a quiet `/status` page) acknowledging what's placeholder. Counterintuitively, this builds trust for a Day-1 brand: "BPC-157 batch BATCH-2026-PLACEHOLDER ships on receipt of operator's first real production batch." | `app/page.tsx` (subtle footer), new `app/status/page.tsx` | ✓ All |

### B. Patterns to skip (conflict with Iron Laws or brand)

- ❌ **AI assistant framing** (Mitra, Akiflow's Aki) — wrong category
- ❌ **"Trusted by 35K+ users"-style scale claims** (Rogo) — vialchemlabs is a Day-1 brand; would be a lie until real
- ❌ **Compliance badges visible** (SOC2 / HIPAA imagery) — Titan smartly skips these even in healthcare; vialchemlabs should follow that lead
- ❌ **Bright accent color OR gradient hero** (most Onepagelove sites) — Iron Law 2.26
- ❌ **Three-column SaaS feature grid** (Akiflow uses it heavily) — vialchemlabs' own DESIGN.md anti-pattern catalog explicitly bans this
- ❌ **Faked testimonials in any form** (most sites) — Iron Law 2.10

### C. New design tokens / primitives needed (additive only)

| Token / Component | Purpose | File |
|---|---|---|
| `--shadow-hero-vial` | Soft drop shadow under the hero vial photo | `app/globals.css` |
| `--ratio-hero-photography` | 4:3 or 5:4 hero photo aspect | `lib/design/tokens.ts` |
| `<ComparativeTable>` primitive | "Industry standard vs vialchemlabs" table pattern | `components/ui/ComparativeTable.tsx` |
| `<ProcessFlow>` primitive | Numbered 01-06 mono steps with description | `components/ui/ProcessFlow.tsx` |
| `<DialogueBubble>` primitive | Chat-style scenario blocks (for "What does ordering look like" demo) | `components/ui/DialogueBubble.tsx` |
| `<NamedAttestation>` primitive (placeholder mode) | Card for future real testimonials with built-in placeholder UI until real ones exist | `components/ui/NamedAttestation.tsx` |
| `<LabPartnerStrip>` primitive (placeholder mode) | Logo strip for lab partners (Janoshik etc.); shows "Pending lab partnership" until real | `components/ui/LabPartnerStrip.tsx` |
| `<PeptideSpec>` primitive | Rich product display: peptide sequence, MW, CAS#, lyophilization notes | `components/ui/PeptideSpec.tsx` |
| `<HeroVialPhoto>` component | Wraps real product photo with mono batch overlay | `components/HeroVialPhoto.tsx` |

---

## Part 3 — Prioritized Implementation Plan

Ordered by impact × ease. Each item maps to specific files. All TDD per Iron Law 2.1 + 2.15.

### TIER 1 — Visual identity transformation (do these first; biggest perception shift)

**1.1 Replace home hero with single distinctive composition.**
- File: `app/page.tsx:14-35` (current hero block)
- Action: Replace 3-column thesis with hero VIAL photo (or, if photography unavailable, full-bleed atmospheric type composition à la AI Design OS — Plex Sans 700 88px "Counted, weighed," + Newsreader Italic 400 88px "verified." + Plex Mono 11px "BATCH 2026-05-10 / Janoshik HPLC 99.1%" floating tag)
- Pattern source: Rogo (single hero image), Composio (typography-first), AI Design OS (zero imagery)
- New primitive needed: `<HeroVialPhoto>` OR repurpose `<Vial>` at viewBox 22×50 + size="hero-xl" with `<HeroBatchTag>` overlay
- Risk: needs operator decision on photography vs typography-only

**1.2 Vary the italic-two-line-hero pattern.**
- Files: `app/shop/page.tsx`, `app/coa/page.tsx`, `app/blog/page.tsx`, `app/faq/page.tsx`, `app/contact/page.tsx`, `app/affiliate/page.tsx`, `app/test-reports/page.tsx`, `app/not-found.tsx`, `app/error.tsx`, `app/about/page.tsx`, `app/login/page.tsx`
- Action: Keep on `/` + `/about` (it's the brand voice). Replace on the other 9 with: large-number stat hero (shop = "7 SKUs"), all-Plex-Sans bold hero (legal pages), or all-mono data-display hero (COA library)
- Pattern source: Composio (varied section openers), Rogo (image-first then text-first variation)

**1.3 Increase section padding sitewide.**
- Files: All `app/**/page.tsx`
- Action: Replace `py-16` / `py-20` with `py-32` / `py-40` for major section breaks. Use the v4-Phase-1 `--sp-7xl` (192px) and `--sp-8xl` (256px) tokens that already exist in `lib/design/tokens.ts`.
- Pattern source: Rogo, Titan, Composio (all give sections major breathing room)

**1.4 Add real product photography slot OR commit to zero-imagery editorial.**
- Operator gate: which path?
- If photography path: 3-5 hero shots needed (vial macro on charcoal, vial wrap-label closeup, packaging open, COA document hero, lab partner workspace if Janoshik partnership confirmed)
- If editorial path: use Plex Mono atomic compositions, periodic table fragments, peptide sequence overlays
- Files: `public/`, `app/page.tsx`, PDPs

### TIER 2 — Trust + credibility infrastructure

**2.1 Add comparative table to `/test-reports` and `/coa`.**
- Files: `app/test-reports/page.tsx`, `app/coa/page.tsx`, new `components/ui/ComparativeTable.tsx`
- Pattern: Titan's "WITH vs WITHOUT" table + Rogo's restraint
- Content: 6 rows (HPLC purity floor, Sterility USP <71>, Endotoxin LAL, Mass spec, Batch traceability, Lab independence) × 2 columns (Industry typical / vialchemlabs standard)
- Source data: from `02_claude_code_outputs/coverage_report.md` (only 11% of universe publishes 3rd-party COAs)

**2.2 Add "What every batch goes through" process flow to `/about` or `/`.**
- New primitive: `components/ui/ProcessFlow.tsx`
- 6 numbered steps in Plex Mono `01 / 02 / 03 / 04 / 05 / 06`, each with one-sentence Plex Sans description
- Pattern source: Titan ("From Fax to Act" 4-step)

**2.3 Build `<NamedAttestation>` + `<LabPartnerStrip>` in placeholder mode.**
- Components exist + render visible "Pending real testimonials" / "Pending Janoshik partnership" honest placeholders
- When real attestations land, swap content; layout stays
- Pattern source: Klokki's "open letter" honesty + Rogo's named-exec discipline

### TIER 3 — Hide the Potemkin features (from previous audit Issue Category A)

**3.1 Hide unfinished surfaces from public nav until they're real.**
- File: `components/SiteHeader.tsx:6-14` (nav array)
- Action: Remove "Account" link until login/signup actually work. Move to a small footer "Returning customers →" link.
- Files: `app/login/page.tsx`, `app/signup/page.tsx`, `app/account/**` — render "We're not yet open for new accounts. Notify me when ready" form instead of stub form with "preview" copy
- Iron Law: 2.21 (no breaking renames; pages still exist, just the surface changes)

**3.2 Wire the qualification flow into the actual checkout.**
- File: `components/qualification-flow.tsx` (already built, 195 lines, never used)
- File: `app/checkout/review/ReviewPanel.tsx:194-231` (currently uses 2-checkbox simplified version with stub link)
- Action: Replace simplified checkboxes with real `<QualificationFlow>` component
- Iron Law 2.5 + 2.19: TOUCHES PROTECTED PATH — requires `/review` + `/cso` + `// SCANNER_OK` annotation

**3.3 Wire the WELCOME15 promo code into checkout.**
- File: `lib/content/promo-codes.ts` (defined, never consumed)
- File: `app/checkout/review/ReviewPanel.tsx`
- Action: Add promo input field; validate on submit; apply discount to total
- Iron Law 2.5 + 2.19: PROTECTED PATH

**3.4 Remove or fix the in-stock toggle placebo.**
- File: `app/shop/ShopCatalog.tsx:75-77` (`list.filter(() => true)` placebo)
- Action: Either delete the toggle or wire `inStock: boolean` field per product (already in type, just hardcoded `true`)

**3.5 Reconcile discount math.**
- Files: `lib/payments/types.ts:73` (says `crypto: 0.15`), `app/checkout/review/ReviewPanel.tsx:56` (says `crypto: 12.5`), FAQ Q7 (says "10-15%")
- Action: Pick one number, apply consistently. Recommend 15% to match payments/types.ts which is the canonical source.

### TIER 4 — Strategic / corpus reconciliation (operator-side, but plan tracks)

**4.1 Reconcile `DECISIONS/brand_pick.md` with vialchemlabs lock.**
- File: `/mnt/c/Users/endeg/Documents/peptide-research/peptide-research_cli/DECISIONS/brand_pick.md`
- Action: Update from `PENDING` to `LOCKED_OVERRIDE: vialchemlabs` with rationale (post-corpus Posture A pick adopting Numerus pattern)

**4.2 Lock `DECISIONS/source_terms.md`.**
- File: `DECISIONS/source_terms.md`
- Operator action: confirm supplier MOQ, lead time, COA passthrough, contingency posture
- Blocks: accurate fulfillment promises in checkout, real per-mg margin, COA template against real lab

**4.3 Fire Slice 3 community-channel research (B1 prompt).**
- File: `/mnt/c/Users/endeg/Downloads/slice_B1_reddit_and_forum_ecosystem_map.md`
- Operator action: paste into ChatGPT Pro Deep Research
- Output: regenerates `docs/operator-runbook.md` Slice 3 sections

**4.4 Replace placeholder COA PDFs with real.**
- File: `public/coa/*.pdf` (currently 7 × 726-byte stubs)
- Operator action: produce real first batch, get real Janoshik COAs, swap files in
- Until then: keep "EXAMPLE COA — REPLACE BEFORE LAUNCH" notice prominent

### TIER 5 — Polish (last; quality of life)

**5.1 Collapse 7-item nav to 5.**
- File: `components/SiteHeader.tsx:6-14`
- Action: Group "Quality / COA / Research" into one "Lab" or "Trust" dropdown. Keep Shop, Lab, About, FAQ, Contact = 5 items.

**5.2 Replace placeholder DOIs in blog citations.**
- File: `lib/content/blog.ts`
- Action: Either remove the `doi:placeholder/...` lines or do real PubMed lookups for the 30 citations across 5 posts.

**5.3 Newsletter promo entry consistency.**
- See 3.3 above (same fix applies).

---

## Part 4 — Tooling & Skills for Execution

When we move from plan to implementation, I'll invoke:
- `superpowers:writing-plans` — to formalize each Tier 1-3 item as a plan with checkpoints before coding
- `frontend-design:frontend-design` — Anthropic's design discipline for distinctive interface generation, not generic AI aesthetics
- `impeccable:impeccable` — Pretz's anti-slop critique pass (`/critique`, `/polish`, `/audit`) on every component before merge
- `ui-ux-pro-max:ui-ux-pro-max` — pattern library cross-reference (161 industry rules, 57 font pairings) for any new visual decision
- `superpowers:test-driven-development` — TDD per Iron Law 2.1 + 2.15
- `gstack:design-review` — visual polish QA after each tier completes
- `gstack:review` + `gstack:cso` — mandatory before any commit touching protected paths (Iron Law 2.5 + 2.19)

For implementation order: Tier 1 (visual identity) needs an upfront operator decision on photography path. Tier 2 (trust infrastructure) is mostly self-contained and can ship first. Tier 3 (hide stubs) is the highest-credibility-leak fix and the easiest to execute. Tier 4 is operator-side homework. Tier 5 is finishing.

**Recommended start: Tier 3 (1-2 days) → Tier 2 (3-4 days) → Tier 1 (1-2 weeks, gated on photography decision) → Tier 5 → Tier 4.**

---

## Appendix — Key verbatim quotes from references worth remembering

> **Composio:** "Your agent decides what to do. We handle the rest." [Two sentences; first establishes scope; second establishes value. No adjectives.]

> **Mitra:** "Never deal with calls again." [Five words. Defines the entire product.]

> **Rogo:** "For the most ambitious firms in finance / Rogo is the trusted AI partner to the world's leading financial institutions." [Aspiration + credibility in 22 words. Zero feature claims.]

> **AI Design OS:** "ai design os / artificial / operating / system / intelligence" [The structure IS the message. No tagline, no CTA above the fold.]

> **Titan Intake:** "From Fax to Act." [Names the pain (fax) and the outcome (act). Four words. The whole product strategy compressed.]

> **Akiflow:** "The calendar that works for you." [Possessive flips the relationship. You don't manage a calendar; the calendar serves you.]

For vialchemlabs' equivalent, the existing tagline already does this well: **"Counted, weighed, verified."** Three past-tense verbs. Zero adjectives. The work is done; the buyer just needs to see the receipts. The implementation plan above is about making the receipts actually visible.
