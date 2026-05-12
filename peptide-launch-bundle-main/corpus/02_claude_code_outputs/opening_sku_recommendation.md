---
generated_at: 2026-05-08T11:00:00Z
based_on_pricing_matrix_rows: 3388
based_on_distinct_vendors: 169
operator_capital_target: low four-figure trial-run budget per combined_context.md §1.6, restated as constraint not as evidence
---

# Opening SKU Recommendation, Trial-Run Brand

## Selection logic

Per Bible §15 the Opening SKU Decision weights are: per-mg margin at the team's source price (35%), demand signal in the buyer profile (35%), supply availability and restocking reliability (20%), compliance simplicity (10%). The matrix data does not surface source cost, so the margin axis is approximated by the per-mg distribution band the recommendation lands at. Demand is proxied by `vendor_count` (number of vendors carrying the peptide, OBSERVED from `sku_distributions.md`). Supply reliability is proxied by `oos_vendor_count` and CV. Compliance simplicity is enforced as a constraint by excluding GLP-1 analogues from the opening set.

GLP-1 carve-out: Tirzepatide (207 vendors), Semaglutide (153 vendors), and Retatrutide (222 vendors) are the highest-demand peptides in the matrix. Bible §15.4 directs avoidance of "the most enforcement-active categories (e.g., GLP-1 analogues if Slice 5 surfaces FDA escalation)." Slice 5 output is not in scope for this synthesis. Applying the constraint conservatively, this memo excludes GLP-1 analogues from the opening set. The trade-off is that the operator forfeits the largest demand pools in exchange for compliance simplicity. INFERRED: this is the right default for a Day 1 throwaway brand operating from Maryland with a small first stock buy. Operator may override after Slice 5 lands.

Pricing rule applied per Bible §15:
- Top 3 loss-leaders: 5–10% under median per-mg.
- Volume drivers (positions 4–5): match or beat the 25th percentile.
- Catalog filler (position 6+): match the median.

## Recommended opening SKU set

### 1. BPC-157, 10mg vial

- **Recommended list price:** $54.00
- **Recommended per-mg price:** $5.4000
- **Lands at:** 10% below median (median $5.9995, p25 $4.3000, p75 $8.0000 per `sku_distributions.md` § BPC-157)
- **Reasoning:** Largest single demand pool in the captured universe (150 vendors carrying, 245 priced SKU rows). Loss-leader role per Bible §15 pricing rubric. Pricing 10% below median puts the SKU at $5.40/mg, still inside the IQR ($4.30–$8.00) so it does not trigger scam-suspicion filtering, but visibly cheaper on per-mg comparison threads where this audience price-checks (Bible §6).
- **Source-side considerations:** Operator-question. The matrix does not surface source MOQs or restocking lead time. Confirm with the existing US-based source per combined_context.md §1.6.
- **Why this SKU is a launch fit:** BPC-157 is the canonical recovery peptide for the looksmaxxing/mogging cohort and the gym/fitness adjacent pool (Bible §6). High vendor density means the buyer expects to find it on Day 1 of any new vendor. Skipping it reads as catalog incompleteness.

### 2. TB-500, 5mg vial

- **Recommended list price:** $34.00
- **Recommended per-mg price:** $6.8000
- **Lands at:** 5% below median (median $7.2000, p25 $4.9990, p75 $9.6000 per `sku_distributions.md` § TB-500)
- **Reasoning:** Second-largest recovery-stack demand pool (125 vendors, 148 priced rows). Loss-leader role per Bible §15. The 5% under-median position protects margin while still beating roughly half the captured competitors on direct per-mg comparison.
- **Source-side considerations:** Operator-question. Note that `sku_distributions.md` § TB-500 shows a CV of 4.0285 driven by Bachem reference-grade rows ($475–$594/mg); ignore those for competitive positioning, they are not addressing the same buyer.
- **Why this SKU is a launch fit:** BPC-157 + TB-500 is the canonical recovery stack across the buyer profile. Pairing it as the #1 and #2 SKUs makes the bundle (below) buildable from inventory the operator must already hold.

### 3. GHK-Cu, 50mg vial

- **Recommended list price:** $34.00
- **Recommended per-mg price:** $0.6800
- **Lands at:** 9% below median (median $0.7500, p25 $0.5424, p75 $1.0000 per `sku_distributions.md` § GHK-Cu)
- **Reasoning:** Third loss-leader. Strong demand (131 vendors, 163 priced rows) with broad format coverage (vial, nasal, topical). Per-mg is already low across the market (median $0.75), so the loss-leader discount is a small absolute dollar move. Vendor density suggests this is a low-friction add to opening catalog.
- **Source-side considerations:** Operator-question. The 13 OOS vendor rows are the highest OOS count in the candidate set; confirm with source that 50mg vialing is reliably restockable.
- **Why this SKU is a launch fit:** GHK-Cu serves both the looksmaxxing audience (skin/hair appearance signaling) and the biohacking adjacent (anti-aging, copper biology). Cross-cohort fit per Bible §6 reduces dependence on a single channel for sell-through.

### 4. Ipamorelin, 10mg vial

- **Recommended list price:** $50.00
- **Recommended per-mg price:** $5.0000
- **Lands at:** Slightly below 25th percentile (p25 $5.0625, median $6.7495, p75 $8.4000 per `sku_distributions.md` § Ipamorelin)
- **Reasoning:** Volume driver position per Bible §15 (match or beat p25). 84 vendors carrying, 87 priced rows, low OOS (6 vendors). Pairs structurally with CJC-1295 below; the GH-secretagogue stack is the canonical second purchase for the same buyer who bought BPC-157+TB-500.
- **Source-side considerations:** Operator-question. CV of 0.5008 indicates a reasonably orderly market (no pathological clustering or extreme dispersion).
- **Why this SKU is a launch fit:** GH-secretagogue stacks are core to the looksmaxxing/aesthetics narrative and to the broader gym/fitness pool (Bible §6). Without them the catalog reads as recovery-only, which the audience reads as incomplete.

### 5. CJC-1295 (no DAC), 5mg vial

- **Recommended list price:** $25.00
- **Recommended per-mg price:** $5.0000
- **Lands at:** Slightly below 25th percentile of the (no DAC) variant (p25 $5.5750, median $6.8990, p75 $9.0498 per `sku_distributions.md` § CJC-1295 (no DAC); reference also § CJC-1295 broader bucket: median $8.0000 across 60 vendors)
- **Reasoning:** Volume driver. The (no DAC) variant is the right pairing for Ipamorelin pulsatile-stack protocols; (with DAC) is a one-vendor outlier in the matrix and should not be opening-set. Match or beat p25 lets the bundle math work cleanly with Ipamorelin at the same per-mg price.
- **Source-side considerations:** Operator-question. The broader CJC-1295 bucket shows wider dispersion (CV 0.6443); confirm the source delivers (no DAC) specifically and not a generic CJC-1295 SKU.
- **Why this SKU is a launch fit:** Same as Ipamorelin. Together they form the second canonical stack and the foundation of the bundle below.

### 6. MOTS-c, 10mg vial

- **Recommended list price:** $48.00
- **Recommended per-mg price:** $4.8000
- **Lands at:** Median (median $4.8000, p25 $3.5000, p75 $6.5000 per `sku_distributions.md` § MOTS-c)
- **Reasoning:** Catalog filler at median per Bible §15. 111 vendors carrying, 122 priced rows. Strong demand without being one of the top-3 commodity peptides where price competition is sharpest.
- **Source-side considerations:** Operator-question. Low OOS (5 vendors) suggests reliable supply across the universe.
- **Why this SKU is a launch fit:** MOTS-c sits at the intersection of biohacking (mitochondrial-coded peptide narrative) and the looksmaxxing edge case (body composition / metabolic angle). Catalog signaling: serious researchers expect this to be present.

### 7. Selank, 10mg vial

- **Recommended list price:** $48.00
- **Recommended per-mg price:** $4.8000
- **Lands at:** Slightly below median (median $4.9000, p25 $3.5990, p75 $6.5000 per `sku_distributions.md` § Selank)
- **Reasoning:** Catalog filler / volume driver hybrid. 77 vendors, 87 priced rows, only 5 OOS. Nasal and vial formats both attested. Pairs with Semax for nootropic-stack buyers who overlap the looksmaxxing audience (cognitive-edge framing).
- **Source-side considerations:** Operator-question. Note nasal form is attested but operationally harder; opening with vial only is the lower-risk path.
- **Why this SKU is a launch fit:** Adds a non-recovery, non-GH category to the opening set. Avoids the "this brand only carries the obvious 5" critique in source-review threads (Bible §6 on forum culture).

## Pricing summary table

| # | SKU | Format | List | Per-mg | Lands at | Role |
|---|---|---|---|---|---|---|
| 1 | BPC-157 10mg | vial | $54.00 | $5.4000 | 10% below median | loss-leader |
| 2 | TB-500 5mg | vial | $34.00 | $6.8000 | 5% below median | loss-leader |
| 3 | GHK-Cu 50mg | vial | $34.00 | $0.6800 | 9% below median | loss-leader |
| 4 | Ipamorelin 10mg | vial | $50.00 | $5.0000 | just below p25 | volume driver |
| 5 | CJC-1295 (no DAC) 5mg | vial | $25.00 | $5.0000 | just below p25 | volume driver |
| 6 | MOTS-c 10mg | vial | $48.00 | $4.8000 | median | catalog filler |
| 7 | Selank 10mg | vial | $48.00 | $4.8000 | just below median | catalog filler |

## Recommended bundle

- **Constituents:** BPC-157 10mg vial + TB-500 5mg vial (the recovery stack)
- **Bundle price:** $77.00
- **Implied per-mg discount vs à la carte:** $54.00 + $34.00 = $88.00 à la carte, so $77.00 bundle is a 12.5% effective discount across the constituent per-mg values.
- **Reasoning:** OBSERVED: the BPC-157 + TB-500 pairing is the most-attested bundle pattern in the matrix's `bundle_membership` column under multiple labels (`BPC-TB-blend`, `BPC-TB500-blend`, `BNDL-LOOKSMAX`, `bpc-157-tb-500`, `arcane-peptides:bpc-tb-stack`, `wolverine`). 298 of 3388 rows have non-empty bundle_membership values; the recovery-stack labels are the most frequent. INFERRED: ~10–15% bundle discount is consistent with cross-vendor convention. A second canonical bundle (CJC-1295 + Ipamorelin) is also commonly attested and may be added as bundle #2 once initial volume signal lands.
- **Data-quality gap:** The reciprocal `stack_bundle_catalog.csv` referenced in `PILLAR_C_SCHEMA.md` is not present in `02_claude_code_outputs`. The bundle math here uses constituent per-mg values from `pricing_matrix.csv` directly; if the operator wants a tighter cross-vendor discount benchmark, that catalog needs to be built separately.

## Recommended introductory promotion

- **Mechanic:** First-order 15% off via newsletter signup, gated behind a research-use-only acknowledgment and an age-gate.
- **Why this mechanic:** OBSERVED: many vendors in the matrix carry crypto-discount conventions (`crypto_discount_pct` field is populated with values like 10, 15, 20 across multiple vendor rows). 15% off first order matches the upper end of the observed crypto-discount band and is a familiar mechanic for the buyer (Bible §6 on the audience reading source-review threads where these discounts circulate). INFERRED: a newsletter-first promo also builds owned-list inventory that does not depend on platform algorithms (Bible §6 on the platform-policy / audience tension).
- **Risk profile:**
  - Platform: low. Newsletter providers (Klaviyo, Postmark, etc.) classify peptide content cautiously; copy must stay research-framed.
  - Processor: low. Discount on first order is a normal e-commerce mechanic, not a structuring signal.
  - Regulatory: medium. The signup landing page must not market to "consumers"; keep "research use only" framing per Bible §9 compliance posture.
  - Reputational: low. First-order-discount is industry-normal in this niche and does not read as desperation when the catalog is solid.

## Pricing sensitivity caveats

- This is a per-mg market (Bible §6, restated): buyers compare per-mg directly across vendors on forums and in source-review threads. The recommendations above are designed to win on direct per-mg comparison without dropping below the implausibility threshold that triggers scam-suspicion in this audience.
- Risk of pricing too high: a Day 1 brand with no reputation cannot win at or above median on the high-demand SKUs (BPC-157, TB-500, GHK-Cu) because the buyer has no reason to choose an unknown vendor over an established one at the same per-mg.
- Risk of pricing too low: the matrix's lowest-tier per-mg values (BPC-157 at $0.0152, GHK-Cu at $0.006, Epithalon at $0.0143) are attached to vendors and SKU dose configurations that read as anomalies (kit listings or mis-parsed dose math). OBSERVED: `nantong-guangyuan-chemical-gyc` and `nexaph` consistently hold the lowest extreme across many peptides per `sku_distributions.md` "Aggressive undercutters" section, but their pricing reads as wholesale/upstream rather than retail competitive-vendor pricing. INFERRED: the trial-run brand should not chase those rates because doing so signals either fraud or a non-retail vendor identity.
- Premium positioner reference: OBSERVED: `pure-rawz`, `paramount-peptides`, `blue-sky-peptide`, and others hold the highest extreme on multiple peptides. They are pricing the brand premium of an established US vendor with reputation; a Day 1 brand cannot replicate that positioning until reputation accrues.

## What this recommendation does NOT cover

- Source-side terms. MOQ, restocking lead time, lab-test passthrough format, and contingency posture are not in the matrix. Operator must close these directly with the existing US-based source per `combined_context.md` §1.6.
- Insurance posture. Settled constraint per `combined_context.md` §1.6 (no underwriter writes a research-chemicals policy on a Day 1 vendor); not addressable here.
- Regulatory exposure of specific peptides. This memo's GLP-1 carve-out is conservative and Bible-directed; the operator decides actual jurisdictional risk per `PILLAR_C_SCHEMA.md` template language.
- Demand-volume measurement at the channel level. `vendor_count` is a supply-side proxy for demand. True demand ranking by buyer-profile search volume comes from Pillar B / Slice 4 (search queries) and Slice 3 (forum mentions) and would tighten the ranking among MOTS-c, Selank, Semax, Epithalon, and KPV.
- Bundle catalog. `stack_bundle_catalog.csv` is not in `02_claude_code_outputs` and would need a separate pass to compute cross-vendor bundle-discount conventions precisely. The bundle recommendation here uses the constituent values from `pricing_matrix.csv` and notes the gap.
