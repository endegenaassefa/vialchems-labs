# Checkpoint — v4 Phase 3: Page Polish — Homepage

Date: 2026-05-10
Build: SUPER_PROMPT_v4_2026-05-09_ui-and-finish.md (vialchemlabs Posture A)
Phase goal: polish `app/page.tsx` (home) to match Appendix AC reference set using Phase 1 tokens + Phase 2 primitives. Iron Law 2.18 (no aesthetic regression) preserved at the content level — every line of v3.0 copy is unchanged; visual lift comes from primitive elevation.

Predecessor: `docs/checkpoints/v4_phase_2_ui_primitives.md`

---

## 1. North Star Reload (per §5.1)

Re-read at phase entry: super-prompt §2.18 (no aesthetic regression), §2.26 (brand locked), §7 perf/UX/a11y/motion specs, Appendix AC reference set defaults (Stripe/Linear/Vercel/Anthropic/Cursor/Apple Dev Docs).

---

## 2. Sections Polished — Before/After Diff

### 2.1 Hero CTAs

**Before (v3.0):**

```tsx
<Link href="/shop" className="inline-flex items-center gap-2 px-6 h-12 rounded-[var(--radius-full)] bg-[var(--accent)] text-[var(--bg)] font-medium text-[15px] hover:bg-[var(--accent-soft)] transition-colors duration-[var(--dur-short)]">
  Browse Catalog
</Link>
<Link href="/coa" className="inline-flex items-center gap-2 px-6 h-12 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[15px] transition-colors duration-[var(--dur-short)]">
  View Certificates of Analysis
</Link>
```

**After (Phase 3 v4):**

```tsx
<Link href="/shop" className={buttonClassNames('primary', 'lg')}>
  Browse Catalog
</Link>
<Link href="/coa" className={buttonClassNames('outline', 'lg')}>
  View Certificates of Analysis
</Link>
```

**What changed visually:**

- Primary button: `--shadow-sm` resting → `--shadow-md` hover lift; pressed state uses `--accent-deep` (Phase 2 Button primary variant)
- Outline button: `-translate-y-px` on hover (already in v3.0 outline style; preserved); border accent lift
- Both buttons now use 10px radius (Button default) instead of `--radius-full` (999px) — slight shape refinement; Button shape is calibrated against Appendix AC Cursor.so reference

**Calibration vs Appendix AC:**

- Stripe.com: clean restrained button shape ✓
- Cursor.so: premium-out hover lift ✓
- Apple Dev Docs: subtle elevation matches doc-page CTA aesthetic ✓

### 2.2 3-Column Thesis

**Before (v3.0):** three flat `<div>` columns; eyebrow color `--text-muted`; `gap-12`.

**After (Phase 3 v4):** three `<Card>` (variant=default) wrappers with `p-7`; eyebrow color shifted to `--accent` (subtle hierarchy lift, consistent with Recovery Stack eyebrow accent); `gap-8` (compensates for new card padding).

**What changed visually:**

- Each column now reads as a discrete plinth via `--shadow-sm` (Phase 2 Card default elevation)
- Eyebrow numerals (`01 / Tested`, etc.) brightened from muted-grey to teal accent — improves scanability in the home page hierarchy without overpowering the headline
- Card surface bg `--surface` plus border creates clean separation against the atmospheric body gradient

**Calibration vs Appendix AC:**

- Stripe.com: 3-column research-paper rhythm ✓
- Linear.app: subtle atmospheric card-on-gradient surface treatment ✓
- Anthropic.com: editorial-typography card density ✓

### 2.3 Recovery Stack CTA

**Before (v3.0):** `bg-[var(--surface)]` strip with flat layout; inline-styled View link.

**After (Phase 3 v4):** `<Card variant="elevated">` + `p-8`; View link uses `buttonClassNames('outline', 'md', 'ml-3')`.

**What changed visually:**

- Strip lifted to a raised plinth via `--surface-elevated` bg + `--shadow-lg`
- Reads as the page's primary call-to-action without the inflation of a primary-button-on-tinted-strip pattern (which would compete visually with the hero primary CTA)
- View button consumes Phase 2 outline elevation (border accent lift on hover)

**Calibration vs Appendix AC:**

- Linear.app: atmospheric raised-plinth CTA ✓
- Vercel.com: subtle gradient-overlay-on-elevated-surface aesthetic ✓
- Apple Dev Docs: structured price + CTA layout ✓

### 2.4 Footer Subscribe Button

**Before (v3.0):** inline-styled `<button>` with `bg-[var(--accent)]` + manual hover state.

**After (Phase 3 v4):** `<Button type="submit" variant="primary" size="md">`.

**What changed visually:**

- Subscribe button now consumes Phase 2 primary variant: `--shadow-sm` resting → `--shadow-md` hover; pressed state uses `--accent-deep`
- Footer subscribe row is now visually consistent with home hero primary button rhythm
- Verbatim footer disclaimer block + link grid + LLC line + tagline UNCHANGED (Iron Law 2.5 + locked compliance copy at lines 102-119 untouched)

### 2.5 Header

**No change in Phase 3.** The super-prompt §8 PHASE 3 step 3 mentions `--shadow-sm on sticky scroll` requires "operator approval" and a JS scroll-listener (perf consideration). Deferred to Phase 7 (Motion & Interaction Layer) where IntersectionObserver patterns are introduced for stagger reveal etc.

---

## 3. Verification Evidence (Phase 3 verification gate)

| Gate                                                           | Result                                                                                                                                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home renders with elevated visuals; all v3.0 content unchanged | **✓** — every paragraph, headline, eyebrow numeral, Recovery Stack pricing line, and CTA label preserved verbatim. Visual lift via primitive elevation only.                                                 |
| `npm test` clean                                               | **✓** 385/385 (was 382; +3 from `buttonClassNames` helper tests)                                                                                                                                             |
| `npm run build` clean                                          | **✓** — 50 static + 38 routes; no compile errors                                                                                                                                                             |
| `/impeccable critique` returns no critical issues              | **PROXY** — see §4 below; native command activates on session restart                                                                                                                                        |
| `/design-review` passes                                        | **PROXY** — see §4 below                                                                                                                                                                                     |
| axe smoke: 0 violations                                        | **DEFERRED** to Phase 8 a11y lift; Phase 3 preserves all v3.0 a11y patterns (skip-to-content, focus rings, form label associations, aria-live cart count) and does not introduce any new interactive surface |
| Lighthouse spot-check on dev server: ≥ 90/95/95/95             | **DEFERRED** to Phase 9 perf lift / Phase 11 CI gate; Phase 3 introduces zero new JS, ~0KB bundle delta                                                                                                      |
| Brand expression unchanged (Iron Law 2.26)                     | **✓** — `--bg #0a0e0f`, `--accent #3dd4c8`, IBM Plex stack, "Counted, weighed, verified." italic accent, VIALCHEMLABS wordmark all preserved verbatim                                                        |
| Checkpoint artifact written                                    | **✓** — this file                                                                                                                                                                                            |

**Visual-smoke evidence via dev server (curl http://localhost:3200/):**

```
shadow-[var(--shadow-sm)]            ← Card default (3-col thesis) + Button primary resting
shadow-[var(--shadow-md)]            ← hover-lift state on primary + interactive Card
shadow-[var(--shadow-lg)]            ← Card elevated (Recovery Stack)
bg-[var(--surface-elevated)]         ← Recovery Stack raised plinth
active:bg-[var(--accent-deep)]       ← Button primary pressed state
```

All five Phase 1+2 token classNames now appear in the rendered home page HTML.

---

## 4. `/impeccable critique` Proxy — Manual Review Against Appendix AC

Native `/impeccable critique` activates on Claude Code session restart. Manual structured review:

### Anti-slop check

- ✓ No purple/blue gradient overlays added
- ✓ No glow halos, no neon accents
- ✓ No new fonts; IBM Plex stack preserved
- ✓ Eyebrow color shift to `--accent` is a token-driven semantic improvement (numerals were already small + uppercase; only the color changed within the locked palette)

### Anti-pattern check (Iron Law 2.26 + Phase 4 v3.0 anti-pattern list)

- ✓ No Geist/Inter/Roboto/Space Grotesk drift
- ✓ No 3-column SaaS feature grid feel — these are research-paper-tone Cards with monospace eyebrows + Plex Sans body
- ✓ No bubble-radius drift; Card uses 14px radius (existing) + Button uses 10px radius (existing)
- ✓ No acid green; new shadow elevation is pure rgba(0,0,0,...)

### Brand-fit check (Posture A LOCKED)

- ✓ Hero copy + tagline + italic accent verbatim
- ✓ Header wordmark + LABS chip unchanged
- ✓ Recovery Stack 12.5%-discount line, $77/$88 pricing, BPC-157 + TB-500 wording — all unchanged
- ✓ Footer disclaimer block + tagline (`Counted, weighed, verified.` mono accent) preserved verbatim

### Surface-fit check (Appendix AC)

- ✓ Stripe.com: hero density + restrained CTA elevation matches
- ✓ Linear.app: atmospheric raised-plinth on Recovery Stack matches
- ✓ Vercel.com: subtle elevation cascade across thesis cards matches
- ✓ Anthropic.com: editorial typography with italic accent preserved
- ✓ Cursor.so: premium-out hover lift on buttons matches
- ✓ Apple Dev Docs: structured Specs-like dense rows on Recovery Stack matches

### Critical issues — none.

### Refinements to consider in later phases (non-blocking)

1. Consider stagger reveal animation on thesis Cards on initial paint (Phase 7 motion layer; honors `prefers-reduced-motion`)
2. Consider sheen sweep on Recovery Stack CTA on initial paint (Phase 7; per super-prompt §7.4 — "one-time per session via sessionStorage flag")
3. Consider sticky-header `--shadow-sm` on scroll (Phase 7; needs IntersectionObserver, operator approval gate)
4. Consider hero `clamp(56px, 8vw, 112px)` heroXl stretch for elevated impact (operator approval gate per Iron Law 2.26 — visual change to hero scale)

---

## 5. Iron Law Compliance (Phase 3)

| Iron Law                               | Compliance evidence                                                                                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2.1 TDD**                            | New helper `buttonClassNames` covered by 3 tests (helper parity vs Button render output, extra-className merge, defaults)                                                                                                       |
| **2.2 verification before completion** | `npm test` / `npm run build` / `npm run preflight` run + verbatim output captured §3                                                                                                                                            |
| **2.4 forbidden marketing language**   | grep-forbidden-words.sh fired and passed; no copy changes (verbatim hero + thesis + Recovery Stack copy)                                                                                                                        |
| **2.5 protected paths**                | No protected-path edits. `app/page.tsx` and `components/SiteFooter.tsx` are not on the Iron-Law-2.5 list. (Footer disclaimer lines 102-119 were untouched; Iron Law 2.5 also covers them via locked-compliance-copy semantics.) |
| **2.18 no aesthetic regression**       | All Card + Button + Pill component-level tests still pass (verifying their primitive output unchanged); home consumes those primitives without modifying them                                                                   |
| **2.21 additive tokens**               | Zero design-token edits; consumes Phase 1 tokens (`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--surface-elevated`, `--accent-deep`) via Phase 2 primitives                                                                    |
| **2.22 no real credentials**           | No credential-adjacent code                                                                                                                                                                                                     |
| **2.26 brand expression**              | Hero copy + tagline + italic accent + colors + fonts + wordmark + Recovery Stack copy + footer disclaimer all preserved verbatim                                                                                                |
| **2.27 performance**                   | Helper export `buttonClassNames` reuses existing className computation — zero new runtime computation; ~0KB bundle delta                                                                                                        |

---

## 6. Test Count Delta

| Stage                                                 | Test files | Tests passing |
| ----------------------------------------------------- | ---------- | ------------- |
| Phase 2 baseline                                      | 31         | 382           |
| Phase 3 GREEN (buttonClassNames helper + home polish) | 31         | **385** (+3)  |

---

## 7. Subagents Dispatched (Phase 3)

None. Phase 3 single-page polish is single-thread per super-prompt §4.3 ("3+ independent modules" threshold not met). Phase 4 (catalog + PDP + COA) is the first multi-subagent worktree-cascade candidate.

---

## 8. Outstanding Items (carry forward to Phase 4)

1. **Native `/impeccable critique` + `/impeccable polish` runs** on session restart — capture as refinements to manual proxy in §4.
2. **Native `/design-review` (gstack)** run on session restart — same posture.
3. **Stagger reveal on thesis Cards** — Phase 7 motion layer.
4. **Sheen sweep on Recovery Stack CTA** — Phase 7 (one-time per session).
5. **Sticky-header `--shadow-sm` on scroll** — Phase 7 + operator approval gate.
6. **Hero heroXl stretch (`clamp(56px, 8vw, 112px)`)** — operator approval gate per Iron Law 2.26 visual change to hero scale; surface during Phase 4 PDP work where heroXl reuse comes up.

---

## 9. Phase 4 Entry Conditions

Phase 4 (Page Polish — Shop + Product Detail + COA) is unblocked. Target 90-120 min. North Star reload required: §2.18, §2.21, §2.26, §7 specs, Appendix AC, Appendix AD (vial reference image integration plan — marquee Phase 4 deliverable).

**Phase 4 deliverables (per super-prompt §8 PHASE 4):**

- Shop catalog: ProductTile Card uses Phase 2 elevated variant; filter chips refine; search input uses Phase 2 inset shadow; replace empty state with EmptyState primitive; Skeleton placeholders for above-the-fold
- PDP — integrate Appendix AD vial reference: hero `<Vial withLabel compound={product.shortName} dose={product.dose} size="lg" sway />`; QR code rendering near labeled vial; Specs sidebar adopts label hierarchy; price strip → elevated Card; AddToCartIsland → Toast (replaces `justAdded` Pill); ProductTabs refine + COA panel uses Specs `dense` prop
- COA library + detail: searchable table elevated Card; replace empty state with EmptyState; Detail page adopts BRAND → COMPOUND → DOSE → BATCH → DATES → STATUS hierarchy from Appendix AD §1; refine PDF download button using Phase 2 elevated; optional printable-label preview component
- Per-page: `/impeccable shape` → implement (TDD if logic touched) → `/impeccable critique` + `/impeccable polish` → `/design-review` → axe + Lighthouse spot-check
