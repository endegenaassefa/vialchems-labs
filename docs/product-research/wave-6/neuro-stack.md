# Neuro Stack Product Research

## Proposed Bundle Fields

```ts
{
  slug: 'neuro-stack',
  sku: 'BUNDLE-NEURO-STACK',
  name: 'Neuro Stack',
  constituents: ['SEMAX-10MG', 'SELANK-10MG'],
  listPriceCents: 6900,
  effectiveDiscountPct: 28.9,
  description:
    'Pairs Semax 10mg and Selank 10mg as separate nootropic research vials. Bundle for ACTH-fragment and tuftsin-derived peptide identity, component comparison, and batch-led analytical documentation workflows.',
}
```

## Long Description

Neuro Stack pairs the existing Semax 10mg and Selank 10mg vials as a two-item research bundle. It should not be built as a combined-vial blend unless a later source file confirms a co-vialed lot. The current catalog already has both standalone component SKUs in the nootropic group, so this bundle can be represented with bundle fields only and no change to product records.

Semax provides the ACTH-fragment side of the bundle. The existing product record and opened raw pages identify it as a synthetic heptapeptide associated with ACTH (4-10) / ACTH-fragment nomenclature, with the sequence Met-Glu-His-Phe-Pro-Gly-Pro appearing in multiple product-page captures. For bundle copy, that supports identity, peptide-family taxonomy, and analytical-documentation language only.

Selank provides the tuftsin-derived side of the bundle. The existing product record and opened raw pages identify it as a synthetic heptapeptide analog related to tuftsin, with the sequence Thr-Lys-Pro-Arg-Pro-Gly-Pro appearing in the raw product corpus. For this stack, Selank should be framed as a second standalone reference vial with its own identity, lot record, and nootropic-category placement.

The direct pairing signal is adequate but uneven. Ion Peptide shows Semax/Selank variants at 5/5mg and 10/10mg, MyPurePeptide lists a 20mg Selank and Semax product, NeuroTide lists Selank/Semax on a peptide-blends catalog page, Bulk Peptide Supply lists a 5mg/5mg ten-vial blend pack, and Skye has both a sitemap entry and COA-index entry for Selank | Semax 5/5mg. These sources support the paired catalog concept, not a claim about combined behavior.

Quality copy should be batch-led. A compliant implementation should point each constituent vial to its own lot number, test date, lab name, COA link, chromatographic purity field, and mass-oriented identity confirmation when operator records exist. Blend pages in the corpus often include vendor purity, storage, facility, and broad research claims; those should not be imported as evergreen copy.

At the requested $69.00 price, the bundle is materially below the current $97.00 a la carte catalog total for Semax 10mg and Selank 10mg. The resulting 28.9% effective discount is steeper than existing bundle discounts in `products.ts`, so this should be treated as an operator-requested promotional bundle rather than a benchmarked market-standard discount. Because the discount is calculated against two already-listed vials, future implementation should preserve the component SKUs and avoid representing the price as evidence for a separate market-standard blend format.

## Rationale

The catalog already carries both required constituent SKUs, so the clean implementation path is a bundle object rather than new product SKUs or shared catalog edits. Semax 10mg is currently $49.00 and Selank 10mg is currently $48.00, making the requested $69.00 stack a $28.00 discount versus separate purchase.

The corpus supports Semax/Selank pair awareness through several vendor captures, but the evidence is heterogeneous: some sources are combined-vial products, one is a nasal spray announcement, one is a COA index, and several include benefit-led copy that should be excluded. The report therefore supports `Neuro Stack` as a two-SKU commerce bundle, not as a new blended vial or claim-bearing product.

## Component-Role Explanation

Semax: existing nootropic-category SKU, 10mg vial, ACTH-fragment-derived heptapeptide identity. Use for component naming, sequence-class context, and analytical-documentation framing.

Selank: existing nootropic-category SKU, 10mg vial, tuftsin-derived heptapeptide identity. Use for component naming, tuftsin-analog taxonomy, and separate batch-documentation framing.

## Search Notes

I searched the corpus for `Neuro Stack`, `neuro-stack`, `Semax Selank`, `Selank Semax`, `Semax/Selank`, `Selank/Semax`, and pairings with `stack`, `blend`, and `bundle`. Authorized decision/synthesis files were checked first. The useful internal signal came from `opening_sku_recommendation.md` and `opening_sku_set.md`, which establish Selank as an opening SKU and note Semax as the paired nootropic-stack context. `04_synthesis` files were placeholders and did not add stack-specific evidence.

Raw-page review found multiple Semax/Selank pair signals, but no clean decision file for the requested exact `Neuro Stack` name. Exact or adjacent raw hits included Ion Peptide, NeuroTide, MyPurePeptide, Bulk Peptide Supply, Skye Peptides, and Modified Aminos. The Modified Aminos hit was nasal spray-only and used as an omitted-format signal rather than support for a vial bundle.

## Sources

- `lib/content/products.ts`
- `lib/content/product-descriptions.ts`
- `SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/ionpeptide/product_4__semax-selank.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bulk-peptide-supply/catalog_3.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/neurotide-research/catalog_4.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/skye-peptides/catalog_sitemap.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/skye-peptides/coa_index.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/modified-aminos/social_3_substack_new_products.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/mypurepeptide/homepage.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/next-generation-compounds/product_12__semax-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/next-generation-compounds/product_13__selank-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pepsynth-labs/product_4__semax-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pepsynth-labs/product_9__selank-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_010__semax-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_011__selank-10mg.md`

## Omitted Claims

- No route, reconstitution, schedule, protocol, exposure amount, or practical-use guidance.
- No interaction, amplification, synergy, outcome, wellness, mood, anxiety, stress, learning, attention, memory, focus, neuroprotection, or cognition-benefit claims.
- No human-use, veterinary-use, diagnostic, clinical, therapeutic, or approved-drug comparison language.
- No vendor-specific purity, sterility, facility, shipping, shelf-life, storage, or lab claims unless matched by operator batch documentation.
- No nasal-spray positioning, N-acetyl variant framing, or third-component bundle framing for the requested two-vial Semax 10mg + Selank 10mg stack.

## Thin-Corpus Note

The corpus is not thin for Semax and Selank standalone availability, and it is not empty for paired Semax/Selank market awareness. It is thin for a clean, decision-backed `Neuro Stack` bundle at exactly Semax 10mg plus Selank 10mg as two separate vials. Most direct pair evidence is combined-vial, nasal, catalog-only, or marketing-heavy, so the safest bundle posture is identity-led, documentation-led, and conservative.
