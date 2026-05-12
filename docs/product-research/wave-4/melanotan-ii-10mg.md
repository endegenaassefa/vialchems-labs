# Melanotan II 10mg Product Research

## Proposed Product Fields

Proposed only. This worker does not modify shared catalog files.

```ts
{
  slug: 'melanotan-ii-10mg',
  sku: 'MELANOTAN-II-10MG',
  name: 'Melanotan II, 10mg vial',
  shortName: 'Melanotan II',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 5900,
  perMgCents: 590,
  category: 'nootropic',
  role: 'catalog-filler',
  position:
    'operator-requested premium above captured Melanotan II p75; sensitive melanocortin-receptor SKU, documentation-led listing',
  shortDescription:
    'Melanotan II (MT-II/MT2) synthetic cyclic heptapeptide alpha-MSH analog supplied as a 10mg lyophilized research vial. Reference material for melanocortin receptor binding, peptide identity, HPLC/LC-MS, and comparative analytical workflows.',
}
```

## Long Description

Melanotan II is a synthetic cyclic heptapeptide analog of alpha-melanocyte-stimulating hormone, commonly abbreviated MT-II or MT2 in the raw corpus. The proposed 10mg vial should be presented first as a melanocortin-receptor reference material, not as a user-facing product category or practical-use article.

The strongest source-backed identity frame is narrow and technical: cyclic lactam peptide architecture, sequence Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2, molecular formula C50H69N15O9, and molecular weight near 1024.2 Da. Final sequence, salt form, fill mass, purity, and counterion should defer to the operator's own lot documentation.

For page copy, the compliant research context is receptor and analytical work. Suitable language includes melanocortin receptor binding, MC1R/MC3R/MC4R/MC5R comparison, GPCR second-messenger assay design, structure-activity review across alpha-MSH analogs, HPLC purity assessment, LC-MS identity confirmation, and peptide-stability profiling under controlled laboratory conditions.

The 10mg vial format is well supported by direct raw pages from Prime Lab Peptides, GenoScience, Planet Peptide, Eternal Peptides, Raw Amino, Silverstone Labs, and Snap Peptides. Several sources also show synonym support for Melanotan 2, Melanotan II, MT-II, MT-2, and MT2, which should be captured in search metadata rather than promoted as alternate brand language.

Quality language should stay batch-specific. Public copy can expose lot number, test date, lab name, COA link, HPLC result, mass confirmation, and any applicable endotoxin, sterility, microbial, or heavy-metal testing only when those records exist for the operator's inventory. Competitor purity percentages and lab names should not be reused as generic SKU claims.

At $59.00, this SKU prices at $5.90 per mg. The captured Melanotan II distribution shows a $5.00 median, $5.25 p75, and $5.50 high, while the separate Melanotan 2 bucket shows a lower $3.995 median. The requested price is therefore a premium catalog-completion position.

The final listing should remain sparse: canonical name, 10mg vial size, lyophilized format, receptor-class taxonomy, analytical traceability, and strict RUO restrictions. It should provide no preparation guidance, route language, protocol cues, study-subject interpretation, pathway-to-use translation, practical application language, or suitability language outside controlled laboratory workflows.

## Category And Role Rationale

Category: `nootropic`. This is the least disruptive fit inside the current catalog union because PT-141, the closest existing melanocortin-receptor sensitive SKU, already sits in the CNS-adjacent `nootropic` lane. The classification should function only as internal navigation for receptor-pathway research and should not imply cognition, mood, behavior, personal use, or any purchaser outcome.

Role: `catalog-filler`. Melanotan II is not part of the locked opening SKU set. The corpus supports commercial existence and 10mg vial availability, but the claim environment is high risk because many raw pages drift into restricted outcome, preparation, or clinical-adjacent language. It should not be treated as a loss leader or broad volume driver.

Price posture: $59.00 equals $5.90/mg. That is above the captured Melanotan II p75 of $5.25/mg and above the captured high of $5.50/mg in `sku_distributions.md`; it is also above most direct raw-fetch current prices except Prime's crossed-out $60.00 comparator. Present it as an operator-requested premium listing.

## Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Targeted corpus searches used `Melanotan II`, `Melanotan 2`, `MT-II`, and `MT2`, with case-insensitive filename and content passes under `/root/peptide-launch-bundle/corpus`.
- No direct product-copy guidance appeared in `DECISIONS`, `01_strategic_frame`, `04_synthesis`, or `03_final` for this SKU. Support came mainly from `sku_distributions.md`, vendor JSON/evidence rows, compliance-language files, and raw product fetches.
- Top raw-fetch priority was exact or near-exact 10mg evidence: Prime Lab Peptides, GenoScience, Planet Peptide, Eternal Peptides, and Raw Amino. Silverstone Labs and Snap Peptides were also read because they directly support the `MT2` search term and 10mg vial format.
- Search output showed fragmented canonical naming: `Melanotan II`, `Melanotan 2`, `Melanotan-II`, `Melanotan-2`, `MT-II`, `MT-2`, and `MT2` appear as separate vendor or distribution labels. The proposed SKU should use canonical `Melanotan II` while retaining synonyms only for search support.
- Corpus concern: raw pages often combine receptor terminology with prohibited or off-strategy themes. Those passages should be excluded from product copy even when attached to otherwise useful identity or quality details.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-2/pt-141-10mg.md` (sensitive-SKU pattern only)
- `/root/peptide-site/docs/product-research/wave-3/kisspeptin-10-10mg.md` (report format only)
- `/root/peptide-site/docs/product-research/wave-3/ll-37-5mg.md` (report format only)
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/compliance_disclaimers/marketing_language_compliance.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/prime-lab-peptides/product_01__melanotan-ii-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/genoscience/product_7__melanotan-ii-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_15__melanotan-ii-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/eternal-peptides/product_13__melanotan-ii-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__melanotan-2.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/silverstone-labs-co/product_1__mt2-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/snappeptides/product_7__mt2-peptide-10mg.md`

## Omitted Unsupported Or High-Risk Claims

- No tanning, sunless-tanning, skin-darkening, melanin, eumelanin, photoprotection, pigment-production, skin-color, or cosmetic-outcome language.
- No libido, arousal, erectile-response, sexual-function, HSDD, Bremelanotide/PT-141 comparison, or relationship-to-consumer-use narratives.
- No appetite, food-intake, energy-balance, metabolic-rate, insulin, body-weight, body-composition, or performance language.
- No disease, oncology, melanoma, renal infarction, neurodevelopmental, behavioral, therapeutic, diagnostic, clinical, safety, efficacy, side-effect, or approved-drug framing.
- No dosing, route, injection, ingestion, reconstitution, bacteriostatic-water, aliquoting, exposure amount, cycle, stack, subscription-protocol, or administration guidance.
- No customer reviews, shipping-speed promises, discount framing, satisfaction guarantees, age-gate copy borrowed from competitors, or consumer qualification language beyond the site's own controlled flow.
- No generic 98-99% purity, sterility, endotoxin, heavy-metal, Janoshik, Chromate, third-party lab, same-day shipping, USA-made, GMP, ISO, or pharmaceutical-grade claims unless confirmed for the operator's exact source and lot.

## Thin-Corpus Note

The corpus is not thin for SKU existence, synonym support, or 10mg vial availability: multiple direct raw pages support the requested format. It is thin for compliant, site-ready copy because the pricing matrix splits related names into small canonical buckets and much of the raw vendor prose relies on tanning, pigmentation, libido, appetite, preparation, or clinical-adjacent discussion. Final copy should therefore stay narrower than competitor pages and lean on identity, receptor taxonomy, analytical traceability, lot-specific documentation, and strict RUO positioning.
