# Glow Stack Research

## Proposed Bundle Fields

```ts
{
  slug: 'glow-stack',
  sku: 'BUNDLE-GLOW-STACK',
  name: 'Glow Stack',
  constituents: ['GHK-CU-50MG', 'TB-500-10MG', 'BPC-157-10MG'],
  listPriceCents: 16900,
  effectiveDiscountPct: 23.9,
  description:
    'Groups GHK-Cu 50mg, TB-500 10mg, and BPC-157 10mg as three separate research vials under the corpus-attested Glow Stack label, with the stack framed as catalog shorthand for component grouping, batch traceability, and analytical identity review.'
}
```

## Long Description

Glow Stack is a research catalog bundle built from three existing component SKUs: GHK-Cu 50mg, TB-500 10mg, and BPC-157 10mg. The name is used as a market-recognized catalog label for this grouping, not as a promise of a visual, cosmetic, biological, or subject-level effect. Each component remains individually identified for batch documentation, receipt review, and inventory control.

The corpus supports the Glow label through multiple competitor pages that present GHK-Cu, TB-500, and BPC-157 together in a 50mg/10mg/10mg composition. Most raw pages present the format as a combined 70mg blend, while this proposal uses the existing Bundle interface to group separate catalog vials. That distinction keeps the implementation aligned with current SKUs and avoids implying combined-vial specifications before operator batch records support them.

GHK-Cu 50mg anchors the stack as the copper-complexed tripeptide component, commonly associated in source pages with Copper Tripeptide-1 and glycyl-L-histidyl-L-lysine copper nomenclature. In compliant catalog language, its role is limited to identity, class, and research-pathway positioning around copper coordination and extracellular-matrix assay contexts. It should not be framed as an appearance or wellness product.

TB-500 10mg supplies the thymosin beta-4/TB4-associated catalog component. Source pages and prior wave research show inconsistent handling of exact TB-500 identity, with some vendors describing full-length thymosin beta-4 and others using fragment-style conventions. Static copy should therefore keep the language broad and defer exact sequence, molecular weight, and purity specifics to the applicable COA and batch records.

BPC-157 10mg completes the stack as the Body Protection Compound 157 catalog component. The opening catalog already carries BPC-157 as a standalone 10mg research vial, and Glow source pages repeatedly pair it with TB-500 and GHK-Cu. Its role in this bundle is organizational: it rounds out an attested three-component grouping without adding claims about effects, expected observations, or applied contexts.

For product-page use, the stack should emphasize separate-vial traceability, component-level labeling, and analytical documentation. The preferred tone is restrained: suitable for qualified laboratory, analytical, and in vitro research contexts only. Copy may mention HPLC, MS, COA, lot, test date, and component identity when supported by actual records. Batch-specific details should come from released documentation, not inherited competitor wording. It should avoid preparation directions, route language, exposure amounts, subject anecdotes, clinical translation, and any claim that the three components produce a combined effect.

## Rationale

The existing `Bundle` interface already supports this proposal without adding new catalog shape: `slug`, `sku`, `name`, `constituents`, `listPriceCents`, `effectiveDiscountPct`, and `description` cover the needed fields.

Current repository prices place the three constituent SKUs at $222 total: GHK-Cu 50mg at $89, TB-500 10mg at $79, and BPC-157 10mg at $54. The requested $169 price equals a 23.9% effective discount against current catalog pricing. That discount is deeper than the observed 8-15% convention used to justify the existing Recovery Stack, so it should be handled as an operator-requested price rather than as the default benchmark implied by the broader pricing corpus.

Raw source support is materially stronger for the exact 50mg/10mg/10mg component set than for the implementation detail of separate-vial bundling. The safest catalog approach is therefore to use the corpus-attested Glow Stack name and composition while keeping the bundle as a grouping of the existing standalone SKUs.

## Component Role Explanation

- `GHK-CU-50MG`: copper-complexed tripeptide component. Use Copper Tripeptide-1 / GHK-Cu identity language and research-pathway taxonomy only.
- `TB-500-10MG`: thymosin beta-4/TB4-associated component. Keep exact identity details batch-specific because prior source review found sequence and naming inconsistency across vendor pages.
- `BPC-157-10MG`: Body Protection Compound 157 component. Include as the BPC-157 10mg catalog vial already present in the repo and repeatedly paired with TB-500 and GHK-Cu in Glow source pages.
- Stack framing: present as a catalog bundle and inventory grouping, not as a combined-vial specification or a claim that the components act together.

## Search Notes

Required first reads were completed for `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.

Search terms covered `Glow Stack`, `glow stack`, `glow blend`, `glow bundle`, `GLOW-70`, `GHK-Cu`, `Copper Tripeptide`, `TB-500`, `Thymosin Beta-4`, `TB4`, `BPC-157`, `Body Protection Compound`, `BPC-157 TB-500`, `GHK-Cu BPC-157`, `bundle`, `stack`, and `combo`.

Direct Glow evidence was not present in the current catalog files. It was present in site research notes, the phase-one checkpoint, competitor JSON, pricing matrix rows, and many raw competitor pages. The highest-signal raw pages read in full were exact or near-exact GHK-Cu/TB-500/BPC-157 stack pages rather than unrelated component listings.

The authorized decision corpus supports BPC-157, TB-500, and GHK-Cu as known catalog components and supports BPC/TB stack logic, but does not lock Glow Stack as an opening bundle. The `04_synthesis` files checked for unified ranking and channel synthesis were placeholders, so they did not add independent support.

## Sources

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-site/docs/research/sub_5_site_anatomy.md`
- `/root/peptide-site/docs/checkpoints/phase_1_comprehension.md`
- `/root/peptide-site/docs/research/sub_2_pricing.md`
- `/root/peptide-site/docs/product-research/wave-1/ghk-cu-50mg.md`
- `/root/peptide-site/docs/product-research/wave-5/bpc-157-10mg-tb-500-10mg-variants.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/arcane-peptides/product_21__glow.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/alpha-carbon-labs/product_27__bpc-157-tb-500-ghk-cu-glow-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_25__glow-bpc-tb-ghk.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/core-peptides/product_08__bpc-157-tb-500-ghk-cu-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_33__bpc157-tb500-ghkcu-blend.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__bpc157-tb500-ghk.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_1__bpc-157-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_2__tb-500-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paradigm-peptides/product_3__ghk-cu-50mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_1__bpc-157-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_2__tb-500-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_030__ghk-cu-50mg.md`

## Omitted Claims

- Expected effect, result, benefit, before/after, testimonial, and subject-experience language from competitor pages.
- Preparation directions, route language, exposure amounts, schedules, or practical application instructions.
- Health, appearance, performance, inflammatory, pain, repair, hair, skin, age, or clinical translation claims.
- Vendor-specific quality or manufacturing assertions such as cGMP, ISO, sterility, USA-made, filler-free, same-day shipping, review scores, named laboratories, and purity percentages unless operator batch records independently support them.
- Free ancillary supply language observed on one raw page, because it conflicts with the restrained research-only catalog posture.

## Thin-Corpus Note

The corpus is not thin for the existence of Glow as a GHK-Cu/TB-500/BPC-157 market label; several raw pages use the exact 50mg/10mg/10mg composition. It is thinner for an authorized operator decision to launch Glow as a separate-vial bundle because current decision files emphasize the opening SKU set and BPC/TB Recovery Stack, while synthesis files remain placeholders and source terms remain pending.

The proposal should therefore be handled as a well-supported bundle candidate with an operator-requested price, not as a fully locked launch decision or as evidence for any combined-vial analytical specification.
