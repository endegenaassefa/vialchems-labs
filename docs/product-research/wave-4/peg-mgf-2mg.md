# PEG-MGF 2mg Product Research

## Proposed Product Fields

```ts
{
  slug: 'peg-mgf-2mg',
  sku: 'PEG-MGF-2MG',
  name: 'PEG-MGF, 2mg vial',
  shortName: 'PEG-MGF',
  dose: '2mg',
  format: 'vial',
  listPriceCents: 5900,
  perMgCents: 2950,
  category: 'gh-axis',
  role: 'catalog-filler',
  position:
    'operator-requested premium 2mg price; above captured PEG-MGF p75 and most exact 2mg comparators',
  shortDescription:
    'PEGylated mechano growth factor research reference associated with the IGF-1 Ec splice-variant fragment. Supplied as a 2mg vial for peptide identity, PEGylation, stability, IGF-axis, and analytical workflow contexts.',
}
```

## Long Description

PEG-MGF is proposed as a 2mg lyophilized research vial for controlled laboratory and analytical workflows. The most stable identity frame in the corpus is PEGylated mechano growth factor: a polyethylene-glycol-modified material associated with the IGF-1 Ec splice-variant / MGF fragment rather than a full-length IGF-1 analog.

The PEG designation should do most of the explanatory work. Consulted pages consistently describe pegylation as a conjugation strategy that changes molecular size, stability, degradation behavior, solubility characteristics, and chromatographic handling. Because PEG chain details can vary by supplier, molecular weight, formula, salt form, and conjugation chemistry should defer to batch documentation. That batch-led approach also avoids locking static catalog copy to a single vendor's PEG length or analytical convention before supplier terms and COA format are confirmed.

Product copy can mention IGF-1 splice-variant signaling, peptide identity confirmation, PEGylation/stability comparison, and analytical method development. Those are research-context terms only. The page should not translate MGF literature into claims about biological outcomes, practical applications, subject response, or performance endpoints.

Exact 2mg support appears in Genoscience and IonPeptide pages, with Alpha Carbon Labs providing an additional 2mg PEG MGF listing and adjacent analytical fields. Raw Amino and BioEdge support broader PEG-MGF marketplace presence at 5mg, including lyophilized powder, HPLC, mass-spectrometry, purity, COA, and storage vocabulary that should remain lot-specific.

At $59.00, this SKU prices at $29.50 per mg. That is above the captured PEG-MGF full-distribution median and 75th percentile, above Genoscience and IonPeptide exact 2mg comparators, and below the Alpha Carbon 2mg sold-out page. It should therefore read as a premium catalog-completion listing, not a loss leader.

Final public language should be sparse: canonical name, 2mg vial format, lyophilized presentation when verified, batch/lot number, test date, lab name, COA link, HPLC, and mass confirmation. This material should be presented only for qualified non-clinical laboratory, in vitro, and analytical research contexts, with no preparation, route, exposure, protocol, or application guidance.

## Category And Role Rationale

Category: `gh-axis`. The existing catalog has no IGF-axis category, and PEG-MGF is most consistently framed as an IGF-1 Ec / mechano growth factor related reference rather than a metabolic, nootropic, immune, or cosmetic-pathway item. `gh-axis` is the closest available navigation bucket, but the category should remain taxonomy only.

Role: `catalog-filler`. PEG-MGF is absent from the locked opening SKU set and carries elevated copy risk because most raw pages move from identity into endpoint narratives. The requested $59 price equals $29.50/mg, above the captured PEG-MGF median of $13.9950/mg and p75 of $20.7350/mg. It also exceeds the broader MGF p75 of $17.9000/mg while sitting below the limited-coverage MGF (PEG-MGF) high of $33.00/mg. That supports premium catalog completion, not acquisition pricing.

## Corpus Search Notes

- Required site files read first: `lib/content/products.ts`, `lib/content/product-descriptions.ts`, and `SOURCING_LEDGER.md`.
- Targeted searches used `PEG-MGF`, `PEG MGF`, `Mechano Growth Factor`, and `MGF` across `/root/peptide-launch-bundle/corpus`.
- Authorized-folder search returned hits in `02_claude_code_outputs/sku_distributions.md`, `02_claude_code_outputs/compliance_disclaimers/enforcement_events.md`, and one strategic-frame operations file. No product-specific decision was found in `DECISIONS` or `04_synthesis`.
- Raw-fetch search returned many navigation and catalog hits. The five raw files consulted in full were selected for exact 2mg support, pricing signal, analytical fields, or claim-risk contrast.
- Exact 2mg pages support SKU existence, but pricing is scattered: Genoscience shows $30 sale / $45 original, IonPeptide shows $39, and Alpha Carbon Labs shows $66 sold out. BioEdge and Raw Amino support adjacent 5mg pricing and quality-document vocabulary.
- Vendor copy frequently uses endpoint, protocol, route, or customer-facing language. Those passages were treated as exclusion signals, not as reusable copy.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-3/aod-9604-5mg.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/compliance_disclaimers/enforcement_events.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/genoscience/product_10__peg-mgf-2mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/ionpeptide/product_2__peg-mgf.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/alpha-carbon-labs/product_37__peg-mgf.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/raw-amino/product_1__peg-mgf.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/bioedge-research-labs/product_14__peg-mgf-5mg.md`

## Omitted Unsupported Or High-Risk Claims

- No hypertrophy, satellite-cell, tissue-remodeling, orthopedic, cardiac, neural, dental, body-composition, performance, or customer-facing endpoint claims.
- No route, preparation, exposure amount, protocol, cycle, stack, solvent, or handling instructions outside batch-document context.
- No disease, diagnosis, treatment, prevention, approved-drug comparison, safety-profile, trial, or clinical-translation language.
- No generic purity, sterility, shelf-life, USA-manufacture, no-filler, same-day shipping, lab-accreditation, or third-party-testing claims unless matched by operator lot records.
- No customer review, subscription, educational-mechanism, FAQ, or "why researchers choose" copy from vendor pages.

## Thin-Corpus Note

The corpus is thin for clean, exact PEG-MGF 2mg support. Exact 2mg pages exist, but the full `PEG-MGF` distribution has only three priced rows, and the related `MGF (PEG-MGF)` distribution remains below the full-analysis threshold. Compliant claim depth is thinner still because most product pages rely on endpoint-heavy narratives. Final copy should therefore stay limited to identity, 2mg vial format, PEGylation, analytical traceability, pricing rationale, and strict RUO posture.
