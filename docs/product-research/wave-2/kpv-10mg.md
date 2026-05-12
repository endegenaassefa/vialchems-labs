# KPV 10mg Product Research

## Proposed Product Object Fields

Proposed only. This worker does not modify shared catalog files.

```ts
{
  slug: 'kpv-10mg',
  sku: 'KPV-10MG',
  name: 'KPV, 10mg vial',
  shortName: 'KPV',
  dose: '10mg',
  format: 'vial',
  listPriceCents: 6900,
  perMgCents: 690,
  category: 'recovery',
  role: 'catalog-filler',
  position: 'above median, below 75th percentile; requested 10mg format',
  shortDescription:
    'Synthetic tripeptide (Lys-Pro-Val) corresponding to alpha-MSH residues 11-13. Supplied as a lyophilized research vial for cytokine-expression and inflammatory-pathway signaling studies.',
}
```

## Long Description

KPV is a synthetic tripeptide, Lys-Pro-Val, corresponding to the C-terminal sequence of alpha-MSH. The 10mg vial extends the existing KPV catalog lane from the current 5mg presentation while keeping the same research-use-only posture, compound identity, and recovery-category navigation already used in the site catalog.

The corpus supports a concise identity frame: KPV appears as a three-amino-acid material with molecular weight around 342 Da, sequence Lys-Pro-Val or H-Lys-Pro-Val-OH, and direct 10mg lyophilized powder listings. Those facts are sufficient for a clear product page without importing outcome language from vendor copy.

Mechanism-level wording should stay narrow. Consulted pages connect KPV with melanocortin signaling, cytokine-expression assays, epithelial-cell models, and inflammatory-pathway research; Edge and Vici also tie it to alpha-MSH fragment language. The page can state these as non-clinical research contexts, not as product benefits or effects for purchasers.

The 10mg format is commercially attested but not uniquely strategic. Direct raw pages show 10mg products from Paramount, Planet Peptide, Snap Peptides, and Edge, with observed prices ranging from low single-vial offers to premium-position pages. The parsed distribution places KPV at 49 vendors, 55 SKU rows, and a $5.00 per-mg median.

At the requested $69.00 list price, this SKU lands at $6.90 per mg, above the captured median and below the 75th percentile of $7.50 per mg. That supports a premium catalog-filler position rather than a loss-leader claim, especially because KPV was not included in the locked seven-SKU opening set.

Quality language should defer to the operator's own batch records. Competitor pages mention COAs, HPLC, mass checks, third-party testing, and purity percentages, but source-side terms remain pending in the decisions corpus. The page should therefore expose actual lot, test date, lab name, and COA link when available instead of making blanket supplier claims.

Final copy should preserve the storefront's clinical-commerce tone: precise name, dose, vial format, price, batch traceability, and RUO limits. Avoid disease terms, anti-inflammatory promises, gut, skin, wound, immune, dosing, route, reconstitution, or customer-use guidance.

## Short Description

Synthetic tripeptide (Lys-Pro-Val) corresponding to alpha-MSH residues 11-13. Supplied as a lyophilized research vial for cytokine-expression and inflammatory-pathway signaling studies.

## Category And Role Rationale

Category: `recovery`. The existing catalog already classifies KPV 5mg as `recovery`, and the raw corpus places KPV in recovery, extracellular-matrix, KLOW, and inflammatory-pathway research clusters. This category should function as navigation shorthand only. It should not imply human recovery, wound healing, tissue repair, gut support, or anti-inflammatory benefit.

Role: `catalog-filler`. KPV is commercially real, with 49 vendors and 55 captured SKU rows in the parsed distribution, but it was not part of the locked seven-SKU opening set. At $69 for 10mg, the SKU sits above the $5.00 per-mg median and below the $7.50 per-mg 75th percentile. That is a premium catalog-completion position, not a price-led loss leader or a core volume driver.

## Corpus Search Notes

- Ran targeted `rg -i` searches under `/root/peptide-launch-bundle/corpus` for `KPV`, `Lys-Pro-Val`, and `alpha-MSH`.
- Ran matching directory-name checks for `kpv`, `lys`, `alpha*msh`, and `msh`; no matching corpus directory names were found. Relevant matches were filenames and file contents, mostly under `03_raw_fetches`.
- `KPV` produced broad corpus coverage, including pricing/distribution outputs, vendor/evidence JSON and TXT files, product pages, and blend pages. High-signal priority files were `opening_sku_recommendation.md` and `sku_distributions_summary.json`.
- `Lys-Pro-Val` produced 26 file matches, all in raw fetches. The strongest consulted matches were Edge, Paramount, and Vici because they tied the sequence directly to KPV or KPV-containing product pages.
- `alpha-MSH` produced 25 file matches, all in raw fetches. Edge and Vici were the most useful KPV-specific matches; other hits included KLOW blends and melanocortin-adjacent products.
- `01_strategic_frame` had only a KPV list mention in the research operations playbook. `04_synthesis` files were placeholders with no KPV-specific guidance. `DECISIONS` and `03_final` did not add KPV-specific product evidence beyond the locked opening-set omission and compliance posture.
- Raw-fetch review prioritized five relevant product pages: four direct KPV 10mg listings plus one KPV-containing KLOW page for sequence, alpha-MSH, and blend-context support.

## Source Files Consulted

- `/root/peptide-site/lib/content/products.ts`
- `/root/peptide-site/lib/content/product-descriptions.ts`
- `/root/peptide-site/SOURCING_LEDGER.md`
- `/root/peptide-site/docs/product-research/wave-1/mots-c-10mg.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/opening_sku_recommendation.md`
- `/root/peptide-launch-bundle/corpus/02_claude_code_outputs/sku_distributions_summary.json`
- `/root/peptide-launch-bundle/corpus/01_strategic_frame/research_operations_playbook.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/unified_decision_brief.md`
- `/root/peptide-launch-bundle/corpus/04_synthesis/master_channel_ranking.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/opening_sku_set.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/compliance_posture.md`
- `/root/peptide-launch-bundle/corpus/DECISIONS/source_terms.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/edge-peptides/product_031__kpv-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/paramount-peptides/product_24__kpv-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/planet-peptide/product_19__kpv-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/snappeptides/product_5__kpv-peptide-10mg.md`
- `/root/peptide-launch-bundle/corpus/03_raw_fetches/vicipeptides/product_3__klow-tb-bpc-157-ghk-kpv.md`

## Omitted Unsupported Claims

- Human outcome, clinical application, treatment, prevention, diagnostic, or disease-specific claims from raw vendor pages and linked paper titles.
- Ulcerative colitis, inflammatory bowel disease, mucositis, gastrointestinal, dermal, wound, tissue-regeneration, collagen, antibacterial, immune, and mucosal-benefit claims.
- Anti-inflammatory effect or anti-inflammatory potential statements as product claims, even where raw pages or cited papers use that wording.
- Dosing, route, administration, reconstitution, oral, topical, parenteral, injection, ingestion, or protocol guidance.
- Vendor-specific claims such as Made in USA, Janoshik testing, 7x tested, third-party tested, 99% purity, same-day shipping, free shipping, in-stock count, satisfaction guarantee, and unbranded wholesale packaging unless independently confirmed for this SKU's own source and batch.
- Definitive MC1R, MC3R, PepT1, ROS, keratinocyte, or mucosal-mechanism claims beyond high-level research-context language.
- Any implication that the 10mg presentation is a superior or recommended format. The corpus supports commercial attestation, not comparative superiority.

## Thin-Corpus Note

The corpus is not thin for SKU existence, sequence identity, 10mg format, or pricing support. KPV has broad vendor coverage, multiple exact 10mg raw pages, and parsed market statistics. It is thinner for clean, site-ready biological language because many raw pages rely on disease, outcome, route, or therapeutic-adjacent framing. Source-specific quality claims are also thin until source-side terms and batch COA format are locked.
