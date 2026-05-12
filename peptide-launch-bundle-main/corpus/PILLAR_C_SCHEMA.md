# Pillar C Schema (pricing intelligence and product catalog)

Pillar C builds a complete reference dataset of every SKU at every
vendor in the universe, with per-mg pricing comparison, plus
distribution analyses and an opening-SKU recommendation memo.

Files:

- `02_claude_code_outputs/pricing_matrix.csv` — one row per SKU per
  vendor across the entire universe.
- `02_claude_code_outputs/sku_distributions.md` — per-peptide price
  distribution analyses.
- `02_claude_code_outputs/opening_sku_recommendation.md` — 1-page
  memo to the operator.
- `02_claude_code_outputs/stack_bundle_catalog.csv` — observed
  bundles and their constituent SKUs.

## `pricing_matrix.csv` — column spec

```
vendor_slug,vendor_brand,vendor_tier,sku_id,product_name,
peptide_canonical,peptide_variant,dose_value,dose_unit,
format,concentration,bottle_size,list_price_usd,sale_price_usd,
sale_observed_at,per_mg_price_usd,volume_tier_label,
bundle_membership,crypto_discount_pct,subscription_price_usd,
out_of_stock,product_url,fetched_at,raw_artifact,evidence_entry_id
```

Field rules:

- `sku_id`: `<vendor_slug>:<sku-slug>`. Globally unique across the
  matrix.
- `peptide_canonical`: the canonical name (e.g., `BPC-157`,
  `TB-500`, `MK-677`). Match the §2.3 named list when applicable;
  otherwise use the most-cited form across the universe.
- `peptide_variant`: salt form, formulation, or specific descriptor
  (e.g., `acetate`, `arginine_salt`, `nasal_spray`,
  `pre_mixed_2mg/ml`). Empty if the vendor doesn't specify.
- `dose_value` and `dose_unit`: numeric value + `mg` or `mcg`. Always
  parse-able as a number. If the vendor's site doesn't disclose
  dose, use `uncertain` (literal string) and flag in evidence.
- `format`: enum `vial | capsule | nasal | oral_liquid | topical |
  pre_mixed_pen | other`. Match `product_page_anatomy.format` from
  Pillar A.
- `concentration`: vendor-specified (e.g., `2mg/ml`). Empty if not
  disclosed.
- `bottle_size`: vendor-specified container size (e.g., `5ml vial`,
  `30 capsules`). Empty if N/A.
- `list_price_usd`: numeric. If the vendor displays in another
  currency, convert at the captured FX rate, store the numeric
  value, and add an entry to the evidence file noting the FX rate
  and conversion timestamp.
- `sale_price_usd`: numeric or empty. If a sale is observed, also
  populate `sale_observed_at` with the timestamp.
- `per_mg_price_usd`: computed as `(sale_price_usd ?? list_price_usd)
  / total_mg`. Always present if list and dose are present.
  Computed at extraction time, not by the consumer.
- `volume_tier_label`: e.g., `1-pack`, `5-pack`, `10-pack`. Empty if
  no volume tiering offered.
- `bundle_membership`: comma-separated bundle IDs the SKU
  participates in (cross-reference to `stack_bundle_catalog.csv`).
- `crypto_discount_pct`: numeric (e.g., `15` for 15% off when paying
  in crypto). Empty if no crypto discount documented.
- `subscription_price_usd`: numeric or empty.
- `out_of_stock`: `true | false | uncertain`. Captured at fetch
  time.
- `product_url`: the URL of the SKU's product page.
- `fetched_at`: ISO 8601.
- `raw_artifact`: path to the saved fetch artifact under
  `03_raw_fetches/`.
- `evidence_entry_id`: pointer into the vendor's evidence file (the
  entry that documents this SKU's price).

## `stack_bundle_catalog.csv` — column spec

```
bundle_id,vendor_slug,bundle_name,constituent_sku_ids,
bundle_list_price_usd,bundle_sale_price_usd,
implied_per_mg_discount_pct,product_url,fetched_at,
raw_artifact,evidence_entry_id
```

`constituent_sku_ids` is a `|`-separated list of `sku_id` values
matching `pricing_matrix.csv`. `implied_per_mg_discount_pct` is
computed against the sum of constituent list-price per-mg values.

## `sku_distributions.md`

Sectioned by canonical peptide. For each peptide that appears in ≥3
vendors:

```markdown
## <Canonical peptide name>

**Vendors carrying:** <count>
**Vendors with full pricing captured:** <count>
**Total SKU rows:** <count>

### Price distribution (per-mg, USD)

- Lowest: $<value> (vendor: <slug>, sku_id: <id>, observed
  <fetched_at>)
- 25th percentile: $<value>
- Median: $<value>
- 75th percentile: $<value>
- Highest: $<value> (vendor: <slug>, sku_id: <id>, observed
  <fetched_at>)
- IQR: $<value>
- Outlier flag: <named outliers + apparent cause: purity claim,
  lab-testing depth, brand premium, geographic factor, or
  uncertain>

### Stockout signal

<Vendors persistently out-of-stock on this peptide. Cite
`out_of_stock: true` rows.>

### Variant pricing comparison

<If multiple variants exist (acetate vs arginine, different
concentrations, different formats), per-variant per-mg medians.>

### Notes

<Any anomalies: vendors not carrying despite category staple
status; price uniformity that warrants attention; aggressive
undercutters; observed bundle behavior.>
```

For peptides appearing in <3 vendors, a single short paragraph
notes the rarity and the carrying vendors.

## `opening_sku_recommendation.md` (≤1 page)

```markdown
---
generated_at: <ISO 8601>
based_on_pricing_matrix_rows: <count>
based_on_distinct_vendors: <count>
operator_capital_target: <as captured from combined_context.md
§1.6, restated as constraint not as evidence>
---

# Opening SKU Recommendation — Trial-Run Brand

## Recommended opening SKU set (5–10 SKUs)

For each recommended SKU:

### <Peptide name> — <dose>mg <format>

- **Recommended list price:** $<value>
- **Recommended per-mg price:** $<value>
- **Lands at:** <competitive median | slightly below median |
  category low | premium>
- **Reasoning:** <1–3 sentences citing `sku_distributions.md` §
  for this peptide>
- **Source-side considerations:** <if surface-able from public
  data; otherwise note as a question for the operator's source
  conversation>
- **Why this SKU is a launch fit:** <looksmaxxing/mogging buyer
  fit, biohacker fit, supply-availability fit — cited>

## Recommended bundle

- **Constituents:** <SKU list>
- **Bundle price:** $<value>
- **Implied per-mg discount vs. à la carte:** <%>
- **Reasoning:** <citing observed cross-vendor bundle conventions>

## Recommended introductory promotion

- **Mechanic:** <e.g., "first-order 15% off via newsletter signup">
- **Why this mechanic:** <citing observed industry norms>
- **Risk:** <platform, processor, regulatory, reputational>

## Pricing sensitivity caveats

- Per-mg market means buyers compare directly. Specific risks of
  pricing too high or too low cited from observed vendor
  positioning.

## What this recommendation does NOT cover

- Source-side terms (operator must close with the existing US-
  based source).
- Insurance posture (settled constraint per
  `combined_context.md` §1.6, not addressable here).
- Regulatory exposure of specific peptides — this memo
  recommends commercially-traded SKUs only; the operator decides
  jurisdictional risk.
```

## Coverage requirements

- Every SKU appearing in any vendor profile JSON `skus` array
  must appear as a row in `pricing_matrix.csv`. No silent drops.
- Every category-staple peptide named in
  `research_directive.md` §2.3 must have a section in
  `sku_distributions.md`, even if the section reads "no vendor in
  the universe was observed carrying this peptide" (with cited
  evidence of the absence).
- Bundles must be enumerated even if only one or two vendors offer
  them, so the bundle pattern is visible to the operator.

## Quality requirements

- Per-mg arithmetic must be reproducible: the operator can
  recompute `per_mg_price_usd` from `list_price_usd`,
  `sale_price_usd`, `dose_value`, `dose_unit` and get the same
  number. Use 4 decimal places, round half-to-even.
- For currencies other than USD, store the conversion FX rate and
  timestamp in the evidence entry.
- For "out of stock" rows, the captured value must come from a
  visible UI signal on the product page (badge, text, disabled
  add-to-cart). Inferred stockouts ("price changed to N/A") must
  use Rule 19's `[INFERENCE]` block.

## Anti-collusion observation

If a peptide's per-mg distribution shows tight clustering (IQR <
20% of median across ≥5 vendors), flag it in the relevant
`sku_distributions.md` section as **"price clustering observed."**
This is an observation, not an accusation. Do not write
"collusion" without evidence of coordination — cite the IQR
number and let the operator interpret.
