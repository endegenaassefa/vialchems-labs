# Wolverine Stack Research

## Proposed Bundle Fields

```ts
{
  slug: 'wolverine-stack',
  sku: 'BUNDLE-WOLVERINE-STACK',
  name: 'Wolverine Stack',
  constituents: ['BPC-157-10MG', 'TB-500-10MG'],
  listPriceCents: 9900,
  effectiveDiscountPct: 25.6,
  description:
    'Pairs BPC-157 10mg and TB-500 10mg as a recovery-category RUO bundle. The Wolverine name is marketplace search vocabulary for the BPC/TB pairing, not an interaction or outcome claim.',
}
```

Notes: the current repo has `BPC-157-10MG` at $54.00 and `TB-500-10MG` at $79.00, so the current a la carte total is $133.00. The requested $99.00 bundle price creates a 25.6% effective discount. That is materially deeper than the locked opening Recovery Stack discount, so this should be treated as an operator-directed price, not as a market-convention claim.

## Stack Long Description

Wolverine Stack is proposed as a two-item research bundle containing BPC-157 10mg and TB-500 10mg as separate lyophilized vial SKUs. The name is supported as marketplace shorthand for the BPC-157/TB-500 pairing, but the public page should treat it as search vocabulary rather than as a scientific claim. The bundle belongs in the recovery-category navigation because the locked opening decision identifies BPC/TB labels as the most-attested stack pattern in the corpus for qualified laboratory context.

BPC-157 supplies the first component identity. Existing catalog copy and raw product pages support BPC-157 as a 15-amino-acid peptide associated with Body Protection Compound nomenclature and 10mg vial listings. In this bundle, BPC-157 should remain a standalone reference material with its own batch record, vial strength, COA link, test date, and analytical fields.

TB-500 supplies the second component identity. The current catalog includes the 10mg TB-500 SKU and connects it with thymosin beta-4/TB4 nomenclature, actin-binding research vocabulary, cell-migration assay contexts, and peptide-identity workflows. Because source pages vary on whether TB-500 is described as full-length thymosin beta-4 or a fragment, the bundle page should leave sequence-level detail to supplier documentation and live lot records.

The stack relationship is commercial and navigational. Raw pages from Raw Amino, Pepsynth, Edge, Soma Chems, and Next Gen Compounds show the BPC-157/TB-500 pair under blend, bundle, stack, or Wolverine labels, including 10mg-each and 10/20mg presentations. That support is enough to justify a named bundle, but not enough to imply interaction, rank the pair against separate components, or describe expected experimental results.

Quality language should be batch-led. Suitable page fields include the two constituent SKUs, lot numbers, test dates, lab names, COA links, HPLC review, mass-oriented identity confirmation, and any applicable endotoxin, microbial, heavy-metal, or sterility checks only when the operator has matching documentation. Competitor purity percentages, facility claims, shipping language, and bundled supplies should not be imported.

At $99.00, the bundle is an operator-requested price against the current $133.00 a la carte total for BPC-157 10mg plus TB-500 10mg. The page should present the discount plainly and avoid outcome-led language, preparation guidance, route terms, exposure amounts, subject translation, and broad claims copied from raw vendor pages. The final posture is a restrained RUO catalog bundle: two known vials, one recognizable marketplace label, and document-backed traceability.

## Rationale

This bundle can be proposed without adding new component SKUs because both constituents already exist in `lib/content/products.ts`. The main catalog distinction from the existing `recovery-stack` is the TB-500 strength: the locked opening bundle used TB-500 5mg, while this requested stack uses TB-500 10mg.

The corpus supports the BPC-157/TB-500 pairing more strongly than it supports the exact public name. `opening_sku_set.md` and `opening_sku_recommendation.md` identify BPC/TB recovery-stack labels as the most-attested bundle pattern, with `wolverine` among the observed labels. Raw pages then confirm that vendors use Wolverine, blend, bundle, and stack wording for the pair across several fill structures.

The requested $99.00 price is defensible only as an operator override. It is lower than Pepsynth's exact 10mg-each blend page, matches the 9+ unit discount floor on Raw Amino's 10mg total option, and is close to Next Gen's 10mg total Wolverine Blend list price. Because those are not direct two-vial bundle comparators, the copy should avoid market-leader or bargain positioning.

## Component-Role Explanation

BPC-157 role: catalog anchor and first vial identity. Use canonical name, 10mg vial strength, lyophilized format when verified, and batch-specific analytical documentation. Safe context is compound identity, Body Protection Compound nomenclature, and BPC/TB search architecture.

TB-500 role: second vial identity and stack-compatible 10mg variant. Use canonical name, 10mg vial strength, thymosin beta-4/TB4 nomenclature, actin-binding research vocabulary, and analytical workflow context. Keep sequence and fragment/full-length questions batch-led.

Bundle role: convenience and navigation only. It should help researchers find the common BPC/TB pairing while preserving two separate component records and avoiding blend-style claims about combined behavior.

## Search Notes

Repo files were read first as requested: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.

Corpus searches covered `wolverine`, `Wolverine Stack`, `Wolverine Blend`, `BPC-157 TB-500`, `BPC157 TB500`, `BPC/TB`, `bpc tb stack`, `bpc tb blend`, `bpc tb bundle`, `BPC-157 + TB-500`, and reversed TB/BPC forms. High-authority hits were strongest in `DECISIONS/opening_sku_set.md` and `02_claude_code_outputs/opening_sku_recommendation.md`.

Raw source hits were broad but heterogeneous. Useful commerce evidence included Raw Amino's 10mg/20mg BPC-157 & TB-500 page, Pepsynth's 10mg-each page, Edge's 10/10mg wholesale box page, Next Gen's 10mg Wolverine Blend page, and Soma Chems' catalog listing for `BPC157 + TB500 ("WOLVERINE STACK")`. Search also returned clinic, social, and claim-heavy pages; those were not used for copy.

## Sources

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-5/bpc-157-10mg-tb-500-10mg-variants.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__bpc157-tb500.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/pepsynth-labs/product_7__bpc157-tb500-bundle.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_034__bpc157-tb500-blend-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/next-generation-compounds/product_9__wolverine-blend-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/soma-chems/catalog_1.md`

## Omitted Claims

Omitted source-page material includes practical-use instructions, route language, schedule language, exposure amounts, combined-effect claims, subject outcomes, clinical framing, customer benefit language, disease terms, and sports or recovery promises.

Also omitted: competitor purity percentages, facility certifications, sterility assertions, shipping promises, bundled supplies, reviews, stock counts, and lab names unless they can be tied to the operator's actual lot documentation.

## Thin-Corpus Note

The corpus is not thin for the BPC-157/TB-500 pairing. It is thin for the exact requested structure: two separate catalog vials, each at 10mg, sold under the public name `Wolverine Stack` at $99.00. Most raw pages use combined-vial blends, 5mg+5mg formats, 10mg total formats, or bulk boxes. Treat this as an operator-directed bundle assembled from existing standalone SKUs, with raw pages supporting naming and pair recognition rather than exact format equivalence.
