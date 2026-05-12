# LL-37 5mg Product Research

## Proposed Product Fields

Proposed only. This worker does not modify shared catalog files.

```ts
{
  slug: 'll-37-5mg',
  sku: 'LL-37-5MG',
  name: 'LL-37, 5mg vial',
  shortName: 'LL-37',
  dose: '5mg',
  format: 'vial',
  listPriceCents: 7900,
  perMgCents: 1580,
  category: 'immune',
  role: 'catalog-filler',
  position: 'operator-requested 5mg price above LL-37 median and below p75',
  shortDescription:
    'Cathelicidin-derived 37-amino-acid peptide supplied as a 5mg lyophilized research vial. Reference material for peptide identity, membrane-interaction, LC-MS, HPLC, and comparative assay workflows.',
}
```

## Long Description

LL-37 is a 37-amino-acid cathelicidin-derived peptide proposed here as a 5mg lyophilized research vial. The strongest source-backed identity frame is the defined linear sequence LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES and a molecular weight near 4493 Da. CAS number and formula renderings vary across raw pages, so final static identifiers should defer to batch documentation.

For product-page use, LL-37 should be presented as a controlled laboratory reference, not as an outcome-oriented material. Appropriate research context includes cathelicidin-class sequence comparison, amphipathic peptide structure profiling, peptide-membrane interaction modeling, and method development for long-chain cationic peptides. These are assay contexts, not purchaser-facing effect claims. The page can name hCAP18/cathelicidin lineage as nomenclature when supported by supplier documentation, while avoiding any statement that the vial performs a biological defense function.

The 5mg format is directly supported by Planet Peptide, Raw Amino, IonPeptide, BioEdge, and Edge's 10-vial 5mg box listing. Those pages also show why copy discipline matters: the same product class is frequently surrounded by antimicrobial, immune, dermatology, wound, pathogen, and disease-model language that should not be imported into this catalog.

Quality language should stay batch-specific. Suitable page elements include lot number, test date, lab name, COA link, HPLC purity assessment, LC-MS or mass-spectrometry identity confirmation, and storage information drawn from the operator's own source records. Researchers can orient the material around sequence verification, conformational comparison, solubility observation, and chromatography behavior under controlled laboratory conditions. Do not turn competitor purity percentages, sterility language, manufacturing claims, or shipping promises into generic SKU claims.

At the requested $79.00 list price, LL-37 5mg prices at $15.80 per mg. The parsed distribution records 23 vendors, 25 SKU rows, a $12.88 per-mg median, and a $16.77 per-mg 75th percentile. This supports an above-median catalog-completion position rather than a loss-leader claim.

This material should be described only for qualified laboratory, analytical, in vitro, and permitted non-clinical research workflows. The page should provide no preparation instructions, route language, exposure amounts, diagnostic framing, clinical translation, human or veterinary suitability language, or therapeutic positioning.

## Category And Role Rationale

Category: `immune`. LL-37 is consistently merchandised in cathelicidin, host-defense peptide, and immune-signaling product clusters, and the existing category union has an `immune` lane already used for Thymosin Alpha-1. The category should function only as navigation shorthand for qualified researchers. It should not imply immune support, antimicrobial effect, infection defense, skin repair, wound response, or any human outcome.

Role: `catalog-filler`. The corpus supports commercial existence and 5mg availability, but LL-37 is not in the locked seven-SKU opening set. It also carries elevated claim risk because raw pages repeatedly use antimicrobial, immune, wound, dermatology, pathogen, and disease language. At $79.00, it sits above the captured median and below p75, making it a premium catalog-completion SKU rather than a price-led driver.

## Corpus Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Ran targeted `rg -i` searches under `/root/peptide-launch-bundle/corpus` for `LL-37`, `Cathelicidin`, and `CAMP peptide`.
- Ran matching directory-name checks for `ll-37`, `ll37`, `cathelicidin`, and `camp`; no matching corpus directory names were found.
- `LL-37` produced broad search output across strategic inputs, pricing/distribution files, vendor JSON, raw product pages, catalogs, and blogs. The strongest authorized source was `sku_distributions.md`.
- `Cathelicidin` produced product-specific raw matches for IonPeptide, Edge, Alpha Carbon, Raw Amino, BioEdge, Certapeptides, and Limitless. `CAMP peptide` produced no exact phrase matches.
- Raw-fetch review prioritized five relevant product pages: exact 5mg pages from Planet Peptide, Raw Amino, and IonPeptide; Edge's exact 5mg-per-vial 10-vial box; and BioEdge's 5mg/10mg variant page for the cleanest analytical/RUO framing.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-2/kpv-10mg.md` (report format only)
- `/root/peptide-site/docs/product-research/wave-2/tesamorelin-5mg.md` (report format only)
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_032__ll37-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_20__ll-37-5mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__ll-37.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_13__ll-37.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/ionpeptide/product_2__ll-37.md`

## Omitted Unsupported Or High-Risk Claims

- Broad-spectrum antimicrobial activity, bacterial, viral, fungal, pathogen-clearance, biofilm, infection, or host-defense effect claims.
- Immune-support, immunomodulatory, cytokine, TLR, chemotactic, inflammatory-balance, or innate-defense benefit language.
- Skin, dermatology, epithelial barrier, tissue repair, wound healing, angiogenesis, vascular, respiratory, intestinal, joint, autoimmune, cancer, or other disease-model outcome claims.
- Dosing, route, reconstitution, administration, preparation, exposure amounts, or protocol guidance.
- Customer reviews, customer-use anecdotes, bulk-use claims, stock status, free shipping, same-day shipping, wholesale packaging, waitlist status, or other vendor commerce claims.
- Generic use of competitor claims such as USA-manufactured, sterile vial, third-party tested, 98-99% purity, ISO-accredited laboratory, no fillers, or batch verified unless the operator has matching documentation for this exact source and lot.
- Definitive CAS, formula, shelf-life, sterility, solubility, or storage claims where raw pages conflict or where source-side terms remain pending.

## Thin-Corpus Note

The corpus is not thin for LL-37 SKU existence, 5mg vial availability, sequence identity, lyophilized format, or price positioning. It is thin for clean, site-ready biological copy because most raw pages lean into antimicrobial, immune, skin, wound, pathogen, and disease-adjacent claims. The `CAMP peptide` synonym was not captured as an exact search phrase, and source-specific quality claims remain thin until supplier terms and batch COA records are locked.
