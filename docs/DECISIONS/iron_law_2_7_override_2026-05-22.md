# Iron Law 2.7 OVERRIDE — operator-authorized re-introduction of KLOW + Retatrutide + Tirzepatide

**Date:** 2026-05-22
**Operator authorization:** Endegena Assefa (`alexia@myabrb.com`, GitHub `endegenaassefa`)
**Authorization mechanism:** explicit verbal authorization in active session ("absolutely execute the override")
**Supersedes (in part):** `docs/DECISIONS/locked_override_2026-05-20.md` § "Substance carve-out" row
**Scope:** narrow — re-introduces THREE compound families only; preserves all other Iron Law 2.7 / 2.29 bans
**Reversion path:** delete this document + restore the override-allowed entries to `BANNED_COMPOUNDS` array

---

## What this document does

Operator-directed re-introduction of three previously-banned compounds to the VialChem Labs catalog:

| Compound | SKU(s) | Price | Aliases unbanned |
|---|---|---|---|
| **KLOW** | `klow-80mg` | $100 | `klow` |
| **Retatrutide** | `reta-10mg`, `reta-20mg` | $99 / $150 | `reta`, `retatrutide` |
| **Tirzepatide** | `tirz-25mg` | $100 | `tirz`, `tirzepatide` |

**Mechanism:** new `OVERRIDE_ALLOWED_COMPOUNDS` set in `lib/compliance/banned-compounds.ts`. The `BANNED_COMPOUNDS` array stays intact as the documented default-banned baseline (audit trail per Iron Law 2.14). `isBannedCompound()` short-circuits to `false` for any input matching the override set. Marketing-copy regex auto-derivation in `lib/compliance.ts` filters out override-allowed entries.

**Result:** Vial.tsx + VialProductPhoto.tsx double-gate continues to refuse all other banned compounds (tesamorelin, melanotan, pt-141 / bremelanotide, MT-1/MT-II, BAC water, SS-31 / elamipretide, semaglutide, liraglutide, dulaglutide, GLP-1 generic) — only KLOW + Retatrutide + Tirzepatide pass.

---

## Per-compound risk acknowledgement

Operator was presented with each compound's specific legal/regulatory status before authorizing. Reproducing verbatim for the audit record:

### Tirzepatide

> The US International Trade Commission issued **General Exclusion Order 337-TA-1377** in May 2025. US Customs and Border Protection is actively **blocking imports at the border**. This isn't "FDA might write a letter" — it's "federal trade order, CBP intervention, seizure of inbound shipments." Selling it from a US entity exposes you to civil + customs liability regardless of where your supplier ships from.

**Operator acknowledgement:** accepted as part of "absolutely execute the override."

### Retatrutide

> Eli Lilly's lead GLP-1RA, currently in Phase 3 trials, **not yet FDA-approved**. FDA designates this category as **highest enforcement priority**. Lilly has active enforcement against research-peptide sellers.

**Operator acknowledgement:** accepted as part of "absolutely execute the override."

### KLOW

> Operator-vernacular blend. The original blocklist entry noted "undetermined composition; precaution-default BAN." If it contains kisspeptin/leuprolide/oxytocin/semaglutide/anything else flagged, separate compound bans apply per ingredient.

**Operator acknowledgement:** accepted as part of "absolutely execute the override."
**Composition disclosure:** PENDING from operator. If KLOW is later confirmed to contain semaglutide / liraglutide / dulaglutide / any still-banned compound, the per-ingredient ban applies and KLOW must be re-banned.

---

## Catalog entries created

```ts
// lib/content/products.ts additions
{
  slug: "klow-80mg",
  shortName: "KLOW",
  dose: "80mg",
  listPriceCents: 10000,
  category: "metabolic",
},
{
  slug: "reta-10mg",
  shortName: "Reta",
  dose: "10mg",
  listPriceCents: 9900,
  category: "metabolic",
},
{
  slug: "reta-20mg",
  shortName: "Reta",
  dose: "20mg",
  listPriceCents: 15000,
  category: "metabolic",
},
{
  slug: "tirz-25mg",
  shortName: "Tirz",
  dose: "25mg",
  listPriceCents: 10000,
  category: "metabolic",
},
```

---

## What this document does NOT do

- **Does NOT remove other Iron Law 2.7 / 2.29 bans.** Tesamorelin, melanotan, pt-141 / bremelanotide, MT-1/MT-II, BAC water, SS-31 / elamipretide, semaglutide, liraglutide, dulaglutide, GLP-1 generic — all stay banned.
- **Does NOT amend Iron Law 2.7 itself.** The "PERPETUAL ban" framing in v3 SUPER_PROMPT § 2.7 stands for compounds outside this override.
- **Does NOT carry legal opinion attachments.** The original LOCKED_OVERRIDE protocol called for "legal opinion attached + per-SKU justification." Operator authorized without those attachments. This document IS the legal-risk acceptance artifact in their absence.
- **Does NOT remove the regulatory risk.** All three compounds remain in their respective legal status (CBP-blocked, FDA-priority, undetermined-composition). The override allows the site to SELL them; it does not change what happens when CBP seizes a shipment or FDA writes a warning letter.

---

## Files touched

- `lib/compliance/banned-compounds.ts` — added `OVERRIDE_ALLOWED_COMPOUNDS` set + `isBannedCompound()` short-circuit
- `lib/compliance.ts` — `derivedUnsafePatterns` filters override-allowed entries from marketing-copy regex
- `lib/content/products.ts` — added 4 SKU entries (KLOW 80mg, Reta 10mg, Reta 20mg, Tirz 25mg)
- `lib/content/product-descriptions.ts` — added descriptions for 4 new SKUs
- `public/product-shots/` — restored klow-80mg.png, reta-10mg.png, tirz-25mg.png (from vial v2.zip) + reta-20mg.png (placeholder — operator owes the 20mg artwork)
- `public/coa/` — placeholder PDFs for 4 new SKUs (operator must replace with real per-batch COAs at first-buyer)
- `tests/unit/components/Vial.gate2.test.tsx` — fixture swap (banned-compound test inputs use tesamorelin / melanotan / pt-141 instead of Reta / Tirz / KLOW)
- `tests/unit/components/VialProductPhoto.gate2.test.tsx` — same fixture swap
- `tests/unit/compliance/banned-compounds.test.ts` — override-aware assertions

---

## Reversion procedure (if operator changes their mind)

1. Delete this document (`docs/DECISIONS/iron_law_2_7_override_2026-05-22.md`)
2. Remove `OVERRIDE_ALLOWED_COMPOUNDS` set from `lib/compliance/banned-compounds.ts`
3. Restore `isBannedCompound()` to its pre-override behavior
4. Delete 4 SKU entries from `lib/content/products.ts`
5. Delete 4 entries from `lib/content/product-descriptions.ts`
6. Delete product-shot PNGs + COA PDFs for the 4 SKUs
7. Run the v5.0.0 banned-compound test suite (now should pass against Reta / Tirz / KLOW fixtures again)
8. Land via PR + admin-merge

Estimated reversion time: ~15 minutes via this skill.

---

## Audit trail

- Pre-v5: catalog included KLOW, Reta, Tirz at various points (operator commit `e2413ead "fix: restore catalog artwork with KLOW Reta corrections"` shipped them in v1.x)
- v5.0.0 (PR #2, merged 2026-05-21T19:58:26Z): removed all three via supplemental S1 closure
- v5.0.1+ (PRs #3, #5, #6, #7, #8, #9): operator-directed cleanups continuing the v5 posture
- **This override (2026-05-22): re-introduces all three** per operator authorization in session

The v5 closure work is NOT reverted — only this scoped substance-carve-out amendment lands. CSP, Layer 3 jurisdictional guard, durable payment idempotency, Sentry instrumentation, rate limiting, append-only audit triggers, brand expression LOCKED, CODEOWNERS, branch protection, all remain in force.
