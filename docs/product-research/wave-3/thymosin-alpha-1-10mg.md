# Thymosin Alpha-1 10mg Product Research

## Proposed Product Fields

Proposed only. This worker does not modify shared catalog files.

```ts
{
  slug: 'thymosin-alpha-1-10mg',
  sku: 'THYMOSIN-ALPHA-1-10MG',
  name: 'Thymosin Alpha-1, 10mg vial',
  shortName: 'Thymosin Alpha-1',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 9900,
  perMgCents: 990,
  category: 'immune',
  role: 'catalog-filler',
  position:
    'operator-requested 10mg format; above captured median and below captured Thymosin Alpha-1 p75',
  shortDescription:
    'Synthetic 28-amino-acid thymic peptide supplied as a 10mg lyophilized research vial. Reference material for peptide identity, HPLC/LC-MS analysis, and cell-signaling pathway models.',
}
```

## Long Description

Thymosin Alpha-1 is a synthetic 28-amino-acid thymic peptide proposed here as a 10mg lyophilized research vial. Public copy should treat the material first as an identity-controlled peptide reference: canonical name, vial strength, lyophilized format, and batch-specific analytical documentation, without borrowing outcome-oriented language from vendor pages.

The raw corpus supports core identity markers across multiple exact or near-exact product pages: 28-amino-acid sequence, CAS 62304-98-7, molecular formula C129H215N33O55, and molecular weight near 3108 Da. Final sequence, salt form, counterion, fill, purity, and mass confirmation should defer to the operator's actual lot documentation.

Appropriate research context is limited to RUO cell-model and pathway work. Supported mechanism vocabulary includes T-lymphocyte differentiation models, dendritic-cell marker assays, cytokine-expression profiling, Toll-like-receptor pathway mapping, peptide-cell interaction studies, and comparative thymic-peptide signaling workflows. These are research topics only, not purchaser outcomes or practical guidance.

The 10mg presentation is directly attested by BioEdge Research Labs, BioLongevity Labs, Paramount Peptides, Raw Amino, and Planet Peptide, with Edge Peptides showing a 10-vial wholesale box. Those pages also show common quality-document patterns: COA links, HPLC purity fields, mass-spectrometry references, lot identifiers, and test dates.

Because the catalog already contains a 5mg Thymosin Alpha-1 item, this page should distinguish only vial strength and purchasing format. The underlying identity and research posture remain the same; no new pathway claims are created by the larger fill size.

Static product copy should not repeat competitor quality claims unless the storefront has matching source records. Vendor assertions about USA manufacture, GMP status, sterility, heavy metals, shelf life, no fillers, independent laboratories, reviewer credentials, shipping speed, and customer ratings belong outside the listing unless independently verified for the exact source and batch.

This SKU should read as a controlled research-commerce page: compound identity, 10mg vial format, analytical traceability, and restrained pathway taxonomy. Avoid synonym-led copy, and keep alternate spellings to search support or metadata where needed. The page should provide no preparation, route, exposure, protocol, or study-interpretation language.

## Category And Role Rationale

Category: `immune`. The existing catalog already places Thymosin Alpha-1 5mg in `immune`, and raw pages commonly cluster the compound with thymic-peptide or immune-signaling research categories. The category should function as navigation shorthand only, not as an effect, treatment, or purchaser-use claim.

Role: `catalog-filler`. Thymosin Alpha-1 is not in the locked seven-SKU opening set, and the existing 5mg catalog item is also a catalog-filler. The 10mg format has broad corpus support but needs restrained copy because many competitor pages lean into medicalized research narratives.

Price posture: the requested $99.00 list price equals $9.90/mg. `sku_distributions.md` reports a captured Thymosin Alpha-1 median of $8.80/mg and p75 of $12.9985/mg, so the proposed price is above median but below p75. It is close to BioEdge's $98 list price, below Raw Amino's $120, Paramount's $115, and BioLongevity's $129.97, but above several discount, sale, and bulk-box signals.

## Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Targeted corpus searches used `Thymosin Alpha-1`, `Thymosin alpha 1`, `Talpha1`, `Tα1`, and `Zadaxin`.
- Priority corpus review followed the existing wave pattern: decision/compliance files, pricing distribution files, then exact raw-fetch product pages.
- `02_claude_code_outputs/sku_distributions.md` supports broad market presence: 46 vendors carrying Thymosin Alpha-1, 38 vendors with full pricing captured, 54 total SKU rows, and 45 priced rows.
- Exact 10mg raw-fetch support was found from BioEdge Research Labs, BioLongevity Labs, Paramount Peptides, Raw Amino, and Planet Peptide. Edge Peptides supports a 10mg-per-vial wholesale box rather than a single-vial listing.
- Search-term risk: `Zadaxin`, `Thymalfasin`, `TA1`, `Tα1`, and `Talpha1` are useful for discovery, but public canonical copy should avoid synonym-led positioning because several synonyms pull the page toward regulated or medicalized narratives.
- Several raw pages include reconstitution, route, storage-duration, disease, infection, oncology, vaccine, sepsis, immune-enhancement, and clinical-study language. Those passages were treated as risk signals, not copy support.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_7__thymosin-alpha-1-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/biolongevity-labs/product_8__thymosin-alpha-1-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_018__thymosin-alpha1-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_21__thymosin-alpha1-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__thymosin-alpha-1.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_23__thymosin-alpha-1.md`

## Omitted Unsupported Or High-Risk Claims

- No treatment, prevention, mitigation, diagnosis, immune-enhancement, immune-support, antiviral, antimicrobial, antifungal, vaccine-response, sepsis, autoimmune, respiratory, oncology, cancer, tumor, COVID-19, hepatitis, HIV, cystic-fibrosis, metabolic-disorder, or therapeutic-adjuvant narratives.
- No approved-drug, Zadaxin, Thymalfasin, prescription, compounding, pharmacy, physician-reviewed, or medical-use positioning.
- No dosing, route, injection, reconstitution, BAC water, post-reconstitution stability, cycle, protocol, working solution, or exposure guidance.
- No customer-review, same-day-shipping, bulk-savings, coupon, free-shipping, guaranteed-purity, no-fillers, USA-manufactured, GMP, ISO-lab, sterility, endotoxin, heavy-metals, or shelf-life claims unless backed by the operator's own batch records.
- No claim that $99.00 is a discount, loss-leader, or market-leading price. It is an above-median, below-p75 operator-requested 10mg format.

## Thin-Corpus Note

The corpus is not thin for SKU existence, 10mg vial support, identity markers, or price benchmarking. It is thin for compliant long-form copy because many source pages rely on medicalized, disease-specific, or protocol-adjacent narratives. Final product copy should remain narrower than competitor pages and stay limited to compound identity, 10mg lyophilized format, analytical documentation, RUO cell-model/pathway context, and batch-specific COA posture.
