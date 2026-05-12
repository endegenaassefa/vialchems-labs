# Recovery Stack Research

## Proposed Bundle Fields

Proposed only. This worker does not modify shared catalog files.

```ts
{
  slug: 'recovery-stack',
  sku: 'BUNDLE-RECOVERY-STACK',
  name: 'Recovery Stack',
  constituents: ['BPC-157-10MG', 'TB-500-10MG', 'KPV-10MG'],
  listPriceCents: 12900,
  effectiveDiscountPct: 36.1,
  description:
    'Collects BPC-157 10mg, TB-500 10mg, and KPV 10mg as a recovery-category RUO bundle. Built around component identity, canonical naming, and batch-led analytical documentation; recovery is navigation shorthand only.',
}
```

## Stack Long Description

Recovery Stack is proposed as a three-SKU bundle built from existing stack-compatible catalog items: BPC-157 10mg, TB-500 10mg, and KPV 10mg. That distinction matters because the current Bundle model references constituent SKUs, while combined-vial blends require separate identity and release documentation. It should be presented as a set of separate vial components, not as a new combined-vial blend. The recovery label is category shorthand for catalog navigation and should not be expanded into biological or practical-use claims.

BPC-157 supplies the established catalog anchor. The repo already carries `BPC-157-10MG`, and corpus material supports exact 10mg listings, Body Protection Compound nomenclature, and repeated placement beside TB-500 in stack and blend contexts. Public copy should keep BPC-157 as one identity-controlled peptide reference, with quality statements limited to the operator's own lot records. That also preserves continuity with prior research reports and existing product-page dependencies.

TB-500 supplies the thymosin beta-4/TB4-related component. Current catalog data includes `TB-500-10MG`, and exact raw pages support a 10mg vial presentation. Source language commonly connects TB-500 with actin-binding and cytoskeletal research contexts, but sequence descriptions vary across pages. Static stack copy should leave full-length-versus-fragment detail to supplier specifications and batch documentation.

KPV supplies the short-tripeptide component. The catalog contains `KPV-10MG`, and raw pages support Lys-Pro-Val, alpha-MSH C-terminal fragment naming, and 10mg lyophilized listings. KPV also appears in BPC/TB/KPV and KLOW-family pages, which makes it relevant to this recovery-category architecture without requiring the page to adopt broader competitor claims. The direct Ion page is the closest exact outside signal because it groups these three names without GHK-Cu, while KLOW pages provide adjacent evidence for the same trio inside a larger composition.

At the requested $129 price, the bundle is materially discounted against the current a la carte total of $202 for the three selected SKUs. That equals a 36.1% effective discount, far deeper than the locked two-component Recovery Stack's 12.5% benchmark. The price should therefore be described as an operator-requested bundle price, not as a general market convention.

The final storefront description should stay document-led: component SKUs, vial strengths, separate-component presentation, price, batch/lot identifiers, test dates, lab names, COA links, and applicable analytical fields when present. Quality language should be tied to the batch actually sold, since the corpus mixes storefront claims, COA images, and supplier-specific badges that cannot safely be generalized across Vialchems inventory. It should not read as experiment-design guidance or imply that placing the three items in one bundle changes their material behavior.

## Rationale

The requested component set is compatible with current catalog data: `BPC-157-10MG` at $54, `TB-500-10MG` at $79, and `KPV-10MG` at $69. The resulting current a la carte total is $202. The requested $129 bundle price creates a $73 savings and a 36.1% effective discount.

This is commercially aggressive relative to the locked opening-stack convention, which used BPC-157 10mg plus TB-500 5mg at $77 with a 12.5% effective discount. It is still directionally supported by the direct Ion Peptide BPC157+TB500+KPV 30mg page at $119 and by broader KLOW-family pages where BPC-157, TB-500, and KPV appear together, usually with GHK-Cu added.

Recommended positioning: treat the new Recovery Stack as an operator-requested three-item catalog bundle, not as a blended SKU and not as a market-standard discount. Keep the existing slug/SKU if the operator wants continuity with the current `recovery-stack` route, but update constituents only after implementation review.

## Component-Role Explanation

BPC-157: identity anchor for the recovery-category lane. Use canonical naming, 10mg vial strength, and batch-led documentation. Do not borrow endpoint language from raw pages.

TB-500: thymosin beta-4/TB4-related component for actin-binding and cytoskeletal research taxonomy. Keep sequence specifics batch-led because source pages disagree on identity framing.

KPV: short tripeptide component, supported as Lys-Pro-Val and alpha-MSH residues 11-13. Use short-peptide identity, melanocortin-fragment taxonomy, and analytical comparison language only.

Bundle role: catalog convenience and component clustering. It is not a combined-vial product, not an experiment plan, and not a claim that the components interact.

## Search Notes

I searched priority decision, brand, synthesis, and Claude-output files for `Recovery Stack`, `BPC-157`, `TB-500`, `KPV`, `BPC.*TB.*KPV`, `KPV.*BPC`, `KPV.*TB`, `blend`, and `bundle`. The decision corpus supports the original two-item BPC-157 plus TB-500 Recovery Stack and states that recovery-stack labels are the most-attested bundle pattern. The synthesis files were placeholders and added no stack-specific evidence.

Raw corpus search found one direct BPC157+TB500+KPV page from Ion Peptide, priced at $119 for a 30mg combined preparation. It also found multiple KLOW-family pages from BioEdge, Planet Peptide, Vici, Edge, and Oath where BPC-157, TB-500, and KPV appear together with GHK-Cu. BPC/TB-only blend pages remain much broader than exact BPC/TB/KPV support.

The current repo has all three stack-compatible standalone SKUs. It also still has the old `recovery-stack` bundle pointing to `BPC-157-10MG` and `TB-500-5MG`; no shared catalog files were edited.

## Sources Read

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-5/bpc-157-10mg-tb-500-10mg-variants.md`
- `/root/peptide-site/docs/product-research/wave-2/kpv-10mg.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/brand_pick.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/ionpeptide/product_3__bpc157-tb500-kpv.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/ionpeptide/product_3__bpc157-tb500-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_34__klow-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_34__bpc157-tb500-kpv-ghkcu-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/vicipeptides/product_3__klow-tb-bpc-157-ghk-kpv.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_038__klow.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oathpeptides/product_25__bpc-ghk-tb-500-kpv-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_031__kpv-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_19__kpv-10mg.md`

## Omitted Claims

I omitted preparation instructions, dosing language, route language, protocol guidance, end-user outcome claims, recovery-benefit claims, tissue-repair claims, wound or injury language, clinical translation, disease terms, human-use or veterinary-use suitability language, synergy claims, and any claim that the grouped products should be used together.

I also omitted competitor-specific claims about purity percentages, manufacturing location, sterility, storage windows, lab accreditation, third-party testing, shipping speed, reviews, ratings, discounts, and COA values unless those claims are independently present in the operator's own batch documentation.

## Thin-Corpus Note

The corpus is strong for BPC-157 plus TB-500 as the original recovery-category stack pattern and strong for each standalone 10mg SKU. It is thinner for the exact three-component BPC-157 plus TB-500 plus KPV bundle: Ion Peptide provides one direct BPC/TB/KPV page, while most other exact component-overlap evidence appears inside four-component KLOW blends that add GHK-Cu. Treat the proposed three-SKU Recovery Stack as supported but operator-shaped, especially at the requested $129 price.
