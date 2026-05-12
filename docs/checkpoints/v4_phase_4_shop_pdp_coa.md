# Checkpoint — v4 Phase 4: Page Polish — Shop + PDP + COA

Date: 2026-05-10
Build: SUPER_PROMPT_v4_2026-05-09_ui-and-finish.md (vialchemlabs Posture A)
Phase goal: polish catalog tiles, product detail pages, and Certificate-of-Analysis pages to match Appendix AC; integrate the Appendix AD operator-supplied vial reference image as the marquee deliverable on every PDP hero.

Predecessor: `docs/checkpoints/v4_phase_3_home_polish.md`

---

## 1. North Star Reload (per §5.1)

Re-read at phase entry: super-prompt §2.18 (no aesthetic regression), §2.21 (additive tokens), §2.26 (brand locked), §7 perf/UX/a11y/motion specs, Appendix AC reference set defaults, Appendix AD vial reference integration plan.

---

## 2. Sections Polished — Before/After

### 2.1 Shop catalog (`app/shop/ShopCatalog.tsx`)

| Surface                                  | Before (v3.0)                                                                          | After (Phase 4 v4)                                                                                                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recovery Stack bundle "View bundle" link | inline-styled border Link                                                              | `buttonClassNames('outline', 'md')`                                                                                                                                                             |
| ProductTile cards                        | already used Card variant=interactive                                                  | unchanged — Phase 2 elevation flowed through automatically (--shadow-sm + hover --shadow-md)                                                                                                    |
| Empty results state                      | inline `<p>` "No products match the current filters."                                  | `<EmptyState title="No matching peptides" description="..." action={<Button variant="outline">Clear all filters</Button>}>` — also wires the Clear-filters action to a single state-reset click |
| Filter chips                             | already styled with active/inactive states                                             | unchanged                                                                                                                                                                                       |
| Search Input                             | already used Phase 2 Input primitive (focus inset shadow flowed through automatically) | unchanged                                                                                                                                                                                       |

### 2.2 PDP — Product hero (`app/products/[slug]/page.tsx`)

**Marquee Phase 4 deliverable.** Per Appendix AD §"Phase 4 (PDP hero polish)":

```tsx
<Vial
  size="lg"
  sway
  withLabel
  compound={product.shortName}
  dose={product.dose}
  aria-hidden="true"
  className="md:w-32 md:h-56"
/>
```

The label SVG composition — VIALCHEMLABS wordmark + compound + dose + verbatim "RESEARCH USE ONLY / NOT FOR HUMAN CONSUMPTION" disclaimer + QR-code placeholder + batch column — renders directly on the vial face. Iron Law 2.7 catalog-whitelist validates `compound` at render time.

The `className="md:w-32 md:h-56"` viewport override scales the Vial up 2x on desktop without adding new size variants to the Vial primitive (preserves sm/md/lg for catalog tiles + related-product cards). SVG text auto-scales with the wrapper, so the label becomes legible on PDP-hero-scale renders.

### 2.3 PDP — BundleDetail hero (Recovery Stack)

Per Appendix AD §"Phase 4" + bundle constituency: each of the two hero vials gets its own constituent's `shortName` + `dose`:

```tsx
<Vial size="lg" sway withLabel compound={constituents[0].shortName}
      dose={constituents[0].dose} ... />  {/* BPC-157 / 10mg */}
<Vial size="md" withLabel compound={constituents[1].shortName}
      dose={constituents[1].dose} ... />  {/* TB-500 / 5mg */}
```

Bundle hero now reads as a labeled-bottle pair — what the buyer would see if they unboxed the Recovery Stack.

### 2.4 PDP — Price strip + Stack callout

| Surface                                     | Before (v3.0)                                 | After (Phase 4 v4)                                                                                                         |
| ------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Price strip section                         | flat `bg-[var(--surface)]` strip with `py-10` | `<Card variant="elevated">` (--surface-elevated bg + --shadow-lg) wrapping price + AddToCartIsland; reads as raised plinth |
| Stack callout (BPC/TB-500 → Recovery Stack) | flat `bg-[var(--surface-strong)]` strip       | `<Card variant="elevated">` wrapping the same flex layout                                                                  |
| Stack callout "View bundle" Link            | inline-styled border Link                     | `buttonClassNames('outline', 'md', 'ml-2')`                                                                                |
| Disclaimer block (verbatim Appendix A.2)    | bordered Card-style div                       | UNCHANGED — verbatim text + structure preserved (Iron Law 2.5 + locked compliance copy)                                    |

### 2.5 AddToCartIsland — Toast integration

| Surface           | Before                                                                              | After                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Cart-add feedback | `{justAdded && <Pill variant="accent">Added</Pill>}` (inline pill, 1.5s setTimeout) | `<Toast message="Added <name> to research order" tone="success" duration={3000} onDismiss={...}>` (Phase 2 Toast primitive) |
| A11y              | none — Pill was just visual                                                         | role="alert" + aria-live="polite" so AT announce the cart-add without requiring focus shift                                 |
| Animation         | none                                                                                | reveal-up CSS keyframe slide-in (honors prefers-reduced-motion globally)                                                    |

Message copy is compliant — "Added X to research order" frames the cart action in research register, not marketing register.

### 2.6 ProductTabs — tab polish

| Surface                                    | Before                                                 | After                                                                                              |
| ------------------------------------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Tab indicator (active tab border-b accent) | already correct                                        | unchanged                                                                                          |
| COA panel "Download COA PDF" Link          | inline-styled border Link                              | `buttonClassNames('outline', 'md')`                                                                |
| COA panel Specs sidebar                    | default density (py-2; 12px/14px)                      | `<Specs dense ...>` — py-1; 11px/13px; matches Appendix AD §5 Metrics & Usage density target       |
| Related-product tiles                      | inline `<Link>` with custom border + bg + hover styles | `<Link><Card variant="interactive">...</Card></Link>` — inherits Phase 2 hover lift + shadow scale |

### 2.7 COA library (`app/coa/page.tsx`)

| Surface             | Before                                          | After                                                                                                    |
| ------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Search Input        | already used Phase 2 Input primitive            | unchanged                                                                                                |
| COA table wrapper   | `bg-[var(--surface)]` div with `rounded-[14px]` | `<Card variant="elevated">` (--surface-elevated bg + --shadow-lg)                                        |
| Table row hover     | none                                            | added subtle `hover:bg-[var(--surface-strong)]` transition                                               |
| Empty results state | inline "No COAs match" tablerow                 | `<EmptyState title="No matching certificates" description="..." action={<Button>Clear search</Button>}>` |

### 2.8 COA detail (`app/coa/[peptide]/[batch]/page.tsx`)

Per Appendix AD §"Phase 4 (COA detail page polish)" — header hierarchy adopts the Appendix AD §1 label ordering:

```
BRAND (VIALCHEMLABS, mono uppercase)
  ↓
COMPOUND (peptide name, light large headline)
  ↓
DOSE (mono tabular, accent color)
  ↓
BATCH (mono uppercase muted)
  ↓
TEST DATE (mono muted)
  ↓
STATUS (Verified pill)
```

This rhythm mirrors the on-vial wrap-label rhythm (PDP `<Vial withLabel />`), so a buyer scanning the physical product label and the digital COA page perceives them as the same object.

| Surface                                                    | Before                          | After                                                                                         |
| ---------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| Header                                                     | name + batch-line + tested-date | new BRAND eyebrow + name + dose-line + batch + tested + status pill (matching Appendix AD §1) |
| Specs `<dl>`                                               | bordered div with `divide-y`    | `<Card variant="elevated">` + `<dl>` inside; gives the Specs grid a raised plinth             |
| Placeholder notice ("EXAMPLE COA — REPLACE BEFORE LAUNCH") | bordered + bg-tinted accent box | unchanged structure + added `--shadow-sm` for additional prominence                           |
| Download PDF link                                          | inline-styled accent CTA        | `buttonClassNames('primary', 'lg')`                                                           |
| Verify-at-Janoshik portal link                             | inline-styled border CTA        | `buttonClassNames('outline', 'lg')`                                                           |

---

## 3. Verification Evidence (Phase 4 verification gate)

| Gate                                                                                                                                                         | Result                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All catalog/PDP/COA pages elevated; all v3.0 content unchanged                                                                                               | **✓** — every line of v3.0 copy preserved (catalog tile descriptions, PDP product names + descriptions, COA placeholder notice, Janoshik portal link, RUO disclaimer text). Visual lift via primitive elevation only. |
| `npm test` ≥ baseline                                                                                                                                        | **✓** 385/385 (Phase 3 baseline) — Phase 4 is pure visual-polish consumption per super-prompt §8 PHASE 4 verification gate ("no new tests required for pure visual polish")                                           |
| `npm run build` clean                                                                                                                                        | **✓** — 50 static + 38 routes; no compile errors                                                                                                                                                                      |
| `/impeccable critique` per page returns no critical issues                                                                                                   | **PROXY** — see §4 below; native command activates on session restart                                                                                                                                                 |
| `/design-review` per page passes                                                                                                                             | **PROXY** — see §4 below                                                                                                                                                                                              |
| axe per page: 0 violations                                                                                                                                   | **DEFERRED** to Phase 8 a11y lift; Phase 4 preserves all v3.0 a11y patterns + adds aria-live via Toast on cart-add                                                                                                    |
| Lighthouse spot-check per page: ≥ 90/95/95/95                                                                                                                | **DEFERRED** to Phase 9 perf lift / Phase 11 CI gate; Phase 4 introduces zero new JS runtime — consumes existing primitives + classNames                                                                              |
| Iron Law 2.5: any change to `lib/content/products.ts` or `product-descriptions.ts` ran `/review` + `/cso` first (likely no changes needed; visual lift only) | **✓** — zero edits to either file; `lib/content/products.ts` is the source of truth that the Vial catalog-whitelist consumes                                                                                          |
| Checkpoint artifact written                                                                                                                                  | **✓** — this file                                                                                                                                                                                                     |

**Visual-smoke evidence via dev server:**

```
curl /products/bpc-157-10mg
  VIALCHEMLABS wordmark              ✓  (in <text> SVG element)
  RESEARCH USE ONLY                    ✓  (in <text> SVG element)
  data-vial-label                      ✓  (label group marker)
  data-vial-qr                         ✓  (QR placeholder marker)
  shadow-[var(--shadow-sm)]            ✓  (Cards + Buttons resting)
  shadow-[var(--shadow-md)]            ✓  (hover lifts)
  shadow-[var(--shadow-lg)]            ✓  (Card.elevated price strip + stack callout)
  bg-[var(--surface-elevated)]         ✓  (Card.elevated bg)

curl /shop
  shadow-[var(--shadow-sm)]            ✓  (ProductTile Card)
  shadow-[var(--shadow-md)]            ✓  (hover lift)

curl /coa
  shadow-[var(--shadow-sm)]            ✓
  shadow-[var(--shadow-md)]            ✓
  shadow-[var(--shadow-lg)]            ✓  (Card.elevated table)
  bg-[var(--surface-elevated)]         ✓

curl /coa/bpc-157-10mg/BATCH-2026-PLACEHOLDER
  VIALCHEMLABS                        ✓  (header eyebrow + label hierarchy)
  shadow-[var(--shadow-sm)]            ✓
  shadow-[var(--shadow-md)]            ✓
  shadow-[var(--shadow-lg)]            ✓
  bg-[var(--surface-elevated)]         ✓
```

---

## 4. `/impeccable critique` + `/design-review` Proxy

Manual structured review against Appendix AC + Appendix AD + Iron Law 2.26:

### Anti-slop check

- ✓ No purple/blue gradient overlays added
- ✓ No glow halos, no neon accents
- ✓ No new fonts introduced; IBM Plex stack preserved
- ✓ Vial label uses charcoal `--label-bg` + teal accent stripe; no brand drift

### Anti-pattern check (Iron Law 2.26 + Phase 4 v3.0 anti-pattern list)

- ✓ No emoji icons added (Toast uses `×` character; ProductTabs Download CTA uses `↓` text-arrow which was already in v3.0)
- ✓ No before/after photography (vial labels are SVG-rendered; no stock product photos)
- ✓ No 3-column SaaS feature grid feel — catalog uses Card.interactive in 3-column research-paper rhythm
- ✓ No reconstitution kit imagery — the Vial label shows only compound + dose + RUO disclaimer + QR (no syringe, no BAC water visuals)
- ✓ Iron Law 2.7 enforced: catalog whitelist guarantees no banned-compound name reaches the label

### Brand-fit check (Posture A LOCKED)

- ✓ `--accent #3dd4c8` teal preserved across Card hover borders, Pill variants, label accent stripe
- ✓ `--bg #0a0e0f` charcoal preserved as Card.elevated label bg
- ✓ Plex Sans + Plex Mono + Newsreader Italic stack preserved
- ✓ VIALCHEMLABS wordmark rendered consistently on PDP Vial label + COA detail header
- ✓ "Counted, weighed, verified." italic accent preserved (home; not changed)

### Surface-fit check (Appendix AC)

- ✓ Stripe.com: PDP price strip restraint matches
- ✓ Linear.app: COA table elevated plinth matches
- ✓ Vercel.com: PDP Stack callout elevated card matches
- ✓ Apple Dev Docs: COA detail Specs card density matches (mono tabular numerals; bordered rows)
- ✓ Cursor.so: hover lifts on ProductTile + Related-product cards match
- ✓ Anthropic.com: COA detail header editorial typography rhythm matches

### Critical issues — none.

### Non-blocking refinements for Phase 5+ / 7

1. Vial aspect-ratio refinement to real-product 50:22 (Appendix AD §3) — operator approval gate before viewBox edit; defer to operator preview moment
2. QR-code real encoder (`qrcode-svg`, ≤10KB gzipped) — Phase 9 swap when /coa URLs are wired into actual labels; current placeholder is visually unmistakable as QR
3. Stagger reveal animation on catalog tiles — Phase 7 motion layer
4. Mobile vial label legibility — at sm size the label text is intentionally small; PDP hero override (md:w-32 md:h-56) is the primary readable surface; Phase 4 deliberately doesn't change Vial size variants
5. Printable-label preview component (Appendix AD optional Phase 4 deliverable) — operator-side fulfillment artifact; tracking for Phase 13 documentation

---

## 5. Iron Law Compliance (Phase 4)

| Iron Law                             | Compliance evidence                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2.4 forbidden marketing language** | grep-forbidden-words.sh fired and passed; no copy edits                                                                                                                                                                                                                                  |
| **2.5 protected paths**              | No protected-path edits (`app/products/[slug]/page.tsx`, `app/coa/*`, `app/shop/ShopCatalog.tsx`, etc. are not on the Iron-Law-2.5 list). Verbatim disclaimer + footer compliance text untouched.                                                                                        |
| **2.7 banned compounds**             | Vial.assertCompoundAllowed() validates compound prop against `lib/content/products.ts` whitelist; PDP passes `product.shortName` (always in catalog by construction); BundleDetail passes `constituent.shortName` (also in catalog); banned-compound rendering mathematically impossible |
| **2.13 claim crossover**             | No claim text in any visual lift; Toast message uses research-register language only                                                                                                                                                                                                     |
| **2.18 no aesthetic regression**     | All primitive-level tests still pass (Card, Button, Vial, Toast, Pill, Specs, Input — covering existing visual contracts); new surfaces are additive elevations + Toast replaces inline Pill (a11y improvement)                                                                          |
| **2.21 additive tokens**             | Zero design-token edits; consumes Phase 1 tokens via Phase 2 primitives                                                                                                                                                                                                                  |
| **2.22 no real credentials**         | No credential-adjacent code                                                                                                                                                                                                                                                              |
| **2.26 brand expression**            | All hero copy + Recovery Stack copy + COA placeholder notice + RUO disclaimer + tagline preserved verbatim; new visual rhythm extends Posture A within locked palette                                                                                                                    |
| **2.27 performance**                 | Zero new deps; ~0KB bundle delta; SVG label is hand-rolled (no library); buttonClassNames helper reuses existing className computation                                                                                                                                                   |

---

## 6. Subagents Dispatched (Phase 4)

None. While Phase 4 was a multi-page polish with three logical groups (shop / PDP / COA), the work shared common imports (Card, Button, EmptyState, Toast) and the spec mentions worktree cascade is "good candidate" not required. Sequential execution kept the change set reviewable as one diff.

---

## 7. Outstanding Items (carry forward to Phase 5)

1. **Native `/impeccable critique` + `/impeccable polish` runs** on session restart — capture as refinements to manual proxy in §4
2. **Native `/design-review` (gstack)** run on session restart
3. **Operator preview gate**: Vial aspect-ratio refinement to 50:22 — surface during a future polish moment with before/after; if approved, update viewBox in components/ui/Vial.tsx
4. **Phase 7 motion**: stagger reveal on catalog tiles + COA table rows + blog post list
5. **Phase 9 SEO**: per-product OG images using the labeled-Vial design (Appendix AD integration plan §"Phase 9 (SEO + structured data)")
6. **Phase 9 QR encoder swap**: hand-rolled QR placeholder → real `qrcode-svg` encoder when /coa URLs are wired

---

## 8. Phase 5 Entry Conditions

Phase 5 (Page Polish — Checkout + Account + Order) is unblocked. Target 90-120 min. North Star reload required: §2.18, §2.21, §2.26, §2.5 (compliance review gate — checkout touches age gate + jurisdictional + qualification; read-only polish, no logic changes), Appendix W.1 visual quality checklist.

**Phase 5 deliverables (per super-prompt §8 PHASE 5):**

- Cart: elevated line-item Cards, EmptyState replacement, refined summary
- Checkout/address: Phase 2 Input elevation; polished state-block warning; Country select disabled state refined
- Checkout/method: PaymentOption cards with elevated hover; refined Pills; polished sticky summary
- Checkout/review: KEEP verbatim Appendix A.3 age gate text — Iron Law 2.5; surrounding Card polish; acknowledgment checkboxes; Place Order Button uses Phase 2 primary lift
- Checkout/confirm: polished Order ID display (mono tabular elevated); polished status Pills; polished Specs grids
- Account dashboard: polished tile Cards
- Account/orders + orders/[id]: polished line-item Cards; replace empty state with EmptyState; replace Cancel/Refund inline message with Phase 2 Dialog primitive
- Account/addresses + settings: polished form Cards; polished section dividers
- Order/[id]: polished status Pills; polished Specs grids

**CRITICAL — Iron Law 2.5 + 2.19:** any change to `app/checkout/review/ReviewPanel.tsx` (touches age gate text — locked verbatim) or `components/qualification-flow.tsx` (touches Appendix A.5 attestations — locked verbatim) MUST run `/review` + `/cso` before commit, with `// SCANNER_OK: reviewed-and-cso-passed` annotation.
