# Kisspeptin-10 10mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'kisspeptin-10-10mg',
  sku: 'KISSPEPTIN-10-10MG',
  name: 'Kisspeptin-10, 10mg vial',
  shortName: 'Kisspeptin-10',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 10900,
  perMgCents: 1090,
  category: 'nootropic',
  role: 'catalog-filler',
  position:
    'operator-requested premium above captured Kisspeptin-10 range; thin corpus, documentation-led listing',
  shortDescription:
    'Kisspeptin-10 decapeptide, also identified as Metastin or a KISS1-derived peptide, supplied as a 10mg lyophilized research vial. Reference material for RF-amide identity, KISS1R binding, LC-MS, and peptide-stability assay workflows.',
}
```

## Long Description

Kisspeptin-10 is a ten-amino-acid RF-amide peptide reference, also identified in vendor corpora as Metastin, KP-10, or a KISS1-derived fragment. The supported primary structure is Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH2, a C-terminally amidated decapeptide that gives product copy a concrete identity anchor without moving into application outcomes.

Multiple source pages support the same core analytical profile: lyophilized vial format, formula C63H83N17O14, and molecular weight near 1302.4 g/mol. CAS reporting is inconsistent across vendors, so the catalog entry should avoid treating any single CAS value as definitive unless it is repeated on the operator's own lot documentation.

For the product page, Kisspeptin-10 should be framed as an RUO reference material for receptor-pathway and peptide-identity workflows. Safe use cases include KISS1R binding assay controls, peptide-fragment comparison, LC-MS identity confirmation, HPLC purity review, chromatographic retention studies, and stability or degradation profiling under controlled laboratory conditions.

The 10mg vial size is commercially supported by BioEdge, Eternal Peptides, Oath Peptides, Ion Peptide, and Edge Peptides; Oros provides adjacent 5mg support for the same compound identity. The requested $109 list price sits above the captured direct 10mg pages and above the distribution study's observed Kisspeptin-10 range, so the price should be understood as an operator choice, not a market-low position.

Quality language should remain batch-specific. The compliant pattern is to present lot number, test date, independent lab name, COA link, HPLC purity, mass confirmation, and any applicable endotoxin, microbial, heavy-metal, or sterility checks only when those records exist for the operator's inventory. Vendor-sourced numbers should not be transplanted into the catalog as global claims.

The safest listing posture is narrow and technical: a 10mg lyophilized Kisspeptin-10 research vial for identity, comparison, and assay-development work. The copy should avoid preparation instructions, route language, exposure amounts, study-subject discussion, and pathway-to-outcome translation. This keeps the page aligned with RUO compliance while still giving researchers enough structure to understand what the material is and how it can be specified in analytical workflows.

## Category And Role Rationale

Category: `nootropic`. The current catalog category union has no RF-amide, KISS1R, or general receptor-assay bucket. `nootropic` is the least disruptive internal navigation fit because it already carries CNS-adjacent research peptides, but this classification should not be treated as a cognition or outcome claim.

Role: `catalog-filler`. Kisspeptin-10 is not part of the locked opening SKU set, and `sku_distributions.md` reports only three vendors and four priced rows. That makes it a niche research-listing candidate, not a loss leader or primary volume driver.

Price posture: $109.00 equals $10.90/mg for a 10mg vial. The requested price is above exact 10mg raw-fetch comparators from BioEdge, Eternal Peptides, Oath Peptides, Ion Peptide, and the Edge Peptides 10-vial box, and above the captured Kisspeptin-10 distribution high of $9.60/mg. The page should present this as an operator-requested premium listing.

## Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Targeted searches used `Kisspeptin-10`, `Kisspeptin 10`, `Metastin`, `KP-10`, and the storefront shorthand `KSPTN`.
- Direct corpus support appeared in `sku_distributions.md`, vendor raw fetches, and compliance-language findings. No Kisspeptin-specific support was found in the locked opening set, strategic synthesis, or final-source directories.
- The top raw-fetch priority was exact 10mg product evidence. BioEdge, Eternal Peptides, Oath Peptides, Ion Peptide, and Edge Peptides all support 10mg or 10mg variant availability. Oros was also opened during discovery and read in full; it supports the same compound identity in a 5mg vial, not the requested size.
- Corpus concern: the raw pages often pair compound identity with high-risk axis-output, life-stage, side-effect, and outcome narratives. Those themes should not be reused in catalog copy.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/research/sub_2_pricing.md`
- `/root/peptide-site/docs/product-research/wave-2/tesamorelin-5mg.md`
- `/root/peptide-site/docs/product-research/wave-2/pt-141-10mg.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/compliance_disclaimers/marketing_language_compliance.md`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_33__kisspeptin-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_064__kisspeptin10-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/eternal-peptides/product_21__kisspeptin-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oathpeptides/product_19__kisspeptin-10.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/ionpeptide/product_3__ksptn.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/oros-research/product_26__kisspeptin-10-5mg.md`

## Omitted Unsupported Or High-Risk Claims

- No fertility, puberty, HPG, GnRH, LH/FSH, steroidogenesis, hormone-therapy, endocrine-treatment, or reproductive-outcome language.
- No cancer, metastasis-suppression, body-composition, metabolic-output, wellness, vitality, or study-subject outcome claims.
- No clinical-trial, treatment-response, diagnostic, therapeutic, or approved-drug comparison language.
- No dosing, route, injection, ingestion, reconstitution, cycle, stack, protocol, or administration guidance.
- No side-effect discussion or claims about effects observed in research subjects.
- No generic 99% purity, sterility, cGMP, ISO, source-country, manufacturing, or pharmaceutical-grade claims without operator-owned batch documentation.
- No claim that the $109 price is competitive; the corpus supports treating it as a premium operator request.

## Thin-Corpus Note

The corpus is not thin for basic SKU existence: several raw product pages support Kisspeptin-10 in a 10mg vial or 10mg variant, and the distribution file captures priced market rows. It is thin for compliant, reusable product-page copy because there are only three captured vendors in the distribution study and much of the vendor text relies on restricted outcome or pathway-to-use language. Final catalog copy should therefore stay limited to identity, format, analytical workflows, KISS1R assay context, lot-specific documentation, and strict RUO positioning.
