/**
 * Catalog seed metadata.
 *
 * The catalog started as a 7-SKU seed, then moved through a 16-SKU launch set.
 * The current wave expansion keeps that dynamic data model and adds
 * operator-approved SKUs plus five stack bundles with corpus-backed, RUO-only
 * descriptions.
 *
 * Six historically-listed SKUs (tesamorelin-5mg, pt-141-10mg, melanotan-ii-10mg,
 * klow-80mg, reta-10mg, tirz-25mg) were REMOVED in v5.0.0 per Iron Law 2.7
 * PERPETUAL ban (extended via Iron Law 2.29). See
 * docs/DECISIONS/locked_override_2026-05-20.md.
 * Iron Law 2.11: canonical names only, no obfuscated codes.
 *
 * SCANNER_OK: reviewed-and-cso-passed (PROTECTED PATH — Iron Law 2.5/2.19).
 * Each new shortDescription audited against assertMarketingCopySafe in
 * lib/compliance.ts; verified by tests/unit/catalog-safety.test.ts which
 * iterates the full products array.
 */

export type ProductCategory =
  | "recovery"
  | "gh-axis"
  | "cosmetic-pathway"
  | "metabolic"
  | "nootropic"
  | "immune";

export interface Product {
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  dose: string;
  format: "vial";
  listPriceCents: number;
  perMgCents: number;
  category: ProductCategory;
  role: "loss-leader" | "volume-driver" | "catalog-filler";
  position: string;
  shortDescription: string;
}

export type CatalogAvailability = "in-stock" | "request-only" | "test-only";

export const publicLaunchProductSlugs = [
  "bpc-157-10mg",
  "tb-500-10mg",
  "ghk-cu-50mg",
  "cjc-1295-ipamorelin-5mg",
  "kpv-500mcg",
  "mots-c-10mg",
  "semax-10mg",
  "selank-10mg",
  "nad-500mg",
] as const;

export const checkoutVerificationProductSlug = "checkout-verification-1usd";

export const launchProductOrder = new Map<string, number>(
  publicLaunchProductSlugs.map((slug, index) => [slug, index]),
);

export function getProductAvailability(
  product: Pick<Product, "slug">,
): CatalogAvailability {
  if (product.slug === checkoutVerificationProductSlug) return "test-only";
  return launchProductOrder.has(product.slug) ? "in-stock" : "request-only";
}

export function isPublicLaunchProduct(product: Pick<Product, "slug">) {
  return getProductAvailability(product) === "in-stock";
}

export function isPurchasableProduct(product: Pick<Product, "slug">) {
  const availability = getProductAvailability(product);
  return availability === "in-stock" || availability === "test-only";
}

export function sortProductsByLaunchOrder(a: Product, b: Product) {
  const aOrder = launchProductOrder.get(a.slug);
  const bOrder = launchProductOrder.get(b.slug);

  if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
  if (aOrder !== undefined) return -1;
  if (bOrder !== undefined) return 1;
  return a.shortName.localeCompare(b.shortName);
}

export interface Bundle {
  slug: string;
  sku: string;
  name: string;
  constituents: string[];
  listPriceCents: number;
  effectiveDiscountPct: number;
  description: string;
}

export const products: Product[] = [
  {
    slug: "bpc-157-10mg",
    sku: "BPC-157-10MG",
    name: "BPC-157, 10mg vial",
    shortName: "BPC-157",
    dose: "10mg",
    format: "vial",
    listPriceCents: 4200,
    perMgCents: 420,
    category: "recovery",
    role: "loss-leader",
    position: "operator-approved live catalog price",
    shortDescription:
      "Synthetic 15-amino-acid peptide fragment isolated from bovine gastric juice. Subject of in-vitro and animal-model research on tissue-protective signaling.",
  },
  {
    slug: "tb-500-5mg",
    sku: "TB-500-5MG",
    name: "TB-500, 5mg vial",
    shortName: "TB-500",
    dose: "5mg",
    format: "vial",
    listPriceCents: 6900,
    perMgCents: 1380,
    category: "recovery",
    role: "volume-driver",
    position: "operator override; premium to locked launch-matrix price",
    shortDescription:
      "TB-500 research peptide supplied as a lyophilized 5mg vial. Corpus-supported nomenclature connects the SKU with thymosin beta-4/TB4 research and actin/cell-migration study contexts.",
  },
  {
    slug: "tb-500-10mg",
    sku: "TB-500-10MG",
    name: "TB-500, 10mg vial",
    shortName: "TB-500",
    dose: "10mg",
    format: "vial",
    listPriceCents: 4800,
    perMgCents: 480,
    category: "recovery",
    role: "volume-driver",
    position: "operator-approved live catalog price",
    shortDescription:
      "TB-500 research peptide supplied as a lyophilized 10mg vial. Corpus-supported nomenclature connects the SKU with thymosin beta-4/TB4, actin-binding, cell-migration assay, and peptide-identity workflow contexts.",
  },
  {
    slug: "ghk-cu-50mg",
    sku: "GHK-CU-50MG",
    name: "GHK-Cu, 50mg vial",
    shortName: "GHK-Cu",
    dose: "50mg",
    format: "vial",
    listPriceCents: 5000,
    perMgCents: 100,
    category: "cosmetic-pathway",
    role: "catalog-filler",
    position: "operator-approved live catalog price",
    shortDescription:
      "Copper-complexed Gly-His-Lys tripeptide supplied as a lyophilized research vial. Studied in cell-culture and tissue-model work on fibroblast activity, extracellular-matrix signaling, and collagen metabolism.",
  },
  {
    slug: "ipamorelin-10mg",
    sku: "IPAMORELIN-10MG",
    name: "Ipamorelin, 10mg vial",
    shortName: "Ipamorelin",
    dose: "10mg",
    format: "vial",
    listPriceCents: 5000,
    perMgCents: 500,
    category: "gh-axis",
    role: "volume-driver",
    position: "just below 25th percentile",
    shortDescription:
      "Selective pentapeptide growth-hormone-releasing peptide agonist. Studied in animal-model research on isolated GH-axis activation.",
  },
  {
    slug: "ipamorelin-5mg",
    sku: "IPAMORELIN-5MG",
    name: "Ipamorelin, 5mg vial",
    shortName: "Ipamorelin",
    dose: "5mg",
    format: "vial",
    listPriceCents: 6900,
    perMgCents: 1380,
    category: "gh-axis",
    role: "volume-driver",
    position: "premium 5mg format; not benchmarked in the locked opening set",
    shortDescription:
      "Selective synthetic pentapeptide growth-hormone-secretagogue receptor agonist. Studied in cell-culture and animal-model research on GH-axis signaling and somatotroph response.",
  },
  {
    slug: "cjc-1295-no-dac-5mg",
    sku: "CJC-1295-NO-DAC-5MG",
    name: "CJC-1295 No DAC, 5mg vial",
    shortName: "CJC-1295 No DAC",
    dose: "5mg",
    format: "vial",
    listPriceCents: 7900,
    perMgCents: 1580,
    category: "gh-axis",
    role: "volume-driver",
    position: "operator-specified premium research SKU",
    shortDescription:
      "Synthetic GHRH analog also identified as Modified GRF 1-29, supplied without Drug Affinity Complex. Research reference for short-acting GH-axis and pulsatile-secretion model work.",
  },
  {
    slug: "cjc-1295-dac-2mg",
    sku: "CJC-1295-DAC-2MG",
    name: "CJC-1295 DAC, 2mg vial",
    shortName: "CJC-1295 DAC",
    dose: "2mg",
    format: "vial",
    listPriceCents: 5900,
    perMgCents: 2950,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested 2mg DAC variant; premium catalog-completion SKU above Swiss/Paradigm exact 2mg comparators and below Strate exact 2mg high",
    shortDescription:
      "Drug Affinity Complex-modified CJC-1295 research peptide supplied as a 2mg vial. Catalog reference for DAC vs No DAC identity, GH-axis taxonomy, and analytical confirmation workflows.",
  },
  {
    slug: "cjc-1295-ipamorelin-10mg",
    sku: "CJC-1295-IPAMORELIN-10MG",
    name: "CJC-1295 + Ipamorelin Blend, 10mg vial",
    shortName: "CJC-1295 + Ipamorelin",
    dose: "10mg",
    format: "vial",
    listPriceCents: 9900,
    perMgCents: 990,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested premium 10mg blend; above thin captured blend benchmark and direct 5mg/5mg comparators",
    shortDescription:
      "Combined-vial GH-axis research blend containing CJC-1295 No DAC and Ipamorelin at 5mg each. Reference material for dual-component identity, GHRH/GHSR pathway taxonomy, and analytical separation workflows.",
  },
  {
    slug: "cjc-1295-ipamorelin-5mg",
    sku: "CJC-1295-IPAMORELIN-5MG",
    name: "CJC-1295 + Ipamorelin Blend, 5mg vial",
    shortName: "CJC-1295 + Ipamorelin",
    dose: "5mg",
    format: "vial",
    listPriceCents: 8000,
    perMgCents: 1600,
    category: "gh-axis",
    role: "catalog-filler",
    position: "operator-approved live catalog price",
    shortDescription:
      "Combined-vial GH-axis research blend containing CJC-1295 No DAC and Ipamorelin. Reference material for dual-component identity, GHRH/GHSR pathway taxonomy, and analytical separation workflows.",
  },
  {
    slug: "mots-c-10mg",
    sku: "MOTS-C-10MG",
    name: "MOTS-c, 10mg vial",
    shortName: "MOTS-c",
    dose: "10mg",
    format: "vial",
    listPriceCents: 6500,
    perMgCents: 650,
    category: "metabolic",
    role: "catalog-filler",
    position: "operator-approved live catalog price",
    shortDescription:
      "Mitochondrial-derived 16-amino-acid peptide encoded within the mitochondrial 12S rRNA region. Studied in cell-culture and animal-model research on mitochondrial signaling and metabolic-pathway models.",
  },
  {
    slug: "nad-500mg",
    sku: "NAD-500MG",
    name: "NAD+, 500mg vial",
    shortName: "NAD+",
    dose: "500mg",
    format: "vial",
    listPriceCents: 7500,
    perMgCents: 15,
    category: "metabolic",
    role: "catalog-filler",
    position: "operator-approved live catalog price",
    shortDescription:
      "Nicotinamide adenine dinucleotide supplied as a lyophilized 500mg research vial. Coenzyme reference for redox, mitochondrial, sirtuin, and PARP-pathway laboratory models.",
  },
  {
    slug: "selank-10mg",
    sku: "SELANK-10MG",
    name: "Selank, 10mg vial",
    shortName: "Selank",
    dose: "10mg",
    format: "vial",
    listPriceCents: 6500,
    perMgCents: 650,
    category: "nootropic",
    role: "catalog-filler",
    position: "operator-approved live catalog price",
    shortDescription:
      "Synthetic heptapeptide derived from tuftsin. Studied in cell-culture and animal-model research on immune-cell activation and neuroprotection.",
  },
  /* ===== v1.3 catalog expansion (9 new SKUs) ===== */
  {
    slug: "sermorelin-2mg",
    sku: "SERMORELIN-2MG",
    name: "Sermorelin, 2mg vial",
    shortName: "Sermorelin",
    dose: "2mg",
    format: "vial",
    listPriceCents: 3000,
    perMgCents: 1500,
    category: "gh-axis",
    role: "volume-driver",
    position: "just below market median",
    shortDescription:
      "Synthetic 29-amino-acid analog of growth-hormone-releasing hormone (GHRH 1-29). Research tool for somatotroph activation studies in cell culture and animal models.",
  },
  {
    slug: "sermorelin-5mg",
    sku: "SERMORELIN-5MG",
    name: "Sermorelin, 5mg vial",
    shortName: "Sermorelin",
    dose: "5mg",
    format: "vial",
    listPriceCents: 5900,
    perMgCents: 1180,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested 5mg price; above captured Sermorelin p75 and below highest captured 5mg comparator",
    shortDescription:
      "Synthetic GHRH 1-29 / GRF 1-29 peptide supplied as a 5mg lyophilized research vial. Reference material for peptide identity, GHRH receptor-family taxonomy, HPLC/LC-MS, and analytical workflow contexts.",
  },
  {
    slug: "sermorelin-ipamorelin-10mg",
    sku: "SERMORELIN-IPAMORELIN-10MG",
    name: "Sermorelin + Ipamorelin Blend, 10mg vial",
    shortName: "Sermorelin + Ipamorelin",
    dose: "10mg",
    format: "vial",
    listPriceCents: 8900,
    perMgCents: 890,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested premium 10mg blend; above exact $59.99 comparator and adjacent $80-$87 related blend signals",
    shortDescription:
      "Combined-vial GH-axis research blend containing Sermorelin and Ipamorelin at 5mg each. Reference material for GHRH/GHSR pathway taxonomy, component identity, and analytical separation workflows.",
  },
  {
    slug: "igf-1-lr3-1mg",
    sku: "IGF-1-LR3-1MG",
    name: "IGF-1 LR3, 1mg vial",
    shortName: "IGF-1 LR3",
    dose: "1mg",
    format: "vial",
    listPriceCents: 9900,
    perMgCents: 9900,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested above-median 1mg price; below captured IGF-1 LR3 p75 and not price-led",
    shortDescription:
      "Synthetic 83-amino-acid IGF-1 class analog with an N-terminal extension and position-3 Arg substitution. Research reference for IGF-axis identity, receptor-interaction, and analytical workflow contexts.",
  },
  {
    slug: "ghrp-2-5mg",
    sku: "GHRP-2-5MG",
    name: "GHRP-2, 5mg vial",
    shortName: "GHRP-2",
    dose: "5mg",
    format: "vial",
    listPriceCents: 3900,
    perMgCents: 780,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested premium 5mg price above captured GHRP-2 p75; exact 5mg raw comparators support SKU existence but not price-led positioning",
    shortDescription:
      "Synthetic hexapeptide Growth Hormone Releasing Peptide-2 supplied as a 5mg lyophilized research vial. Reference material for GHS-R1a identity, ghrelin-receptor pathway, HPLC/LC-MS, and GH-axis assay workflows.",
  },
  {
    slug: "ghrp-6-5mg",
    sku: "GHRP-6-5MG",
    name: "GHRP-6, 5mg vial",
    shortName: "GHRP-6",
    dose: "5mg",
    format: "vial",
    listPriceCents: 3900,
    perMgCents: 780,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested $39 price; above captured GHRP-6 p75 and below highest captured 5mg comparator",
    shortDescription:
      "Synthetic growth-hormone-releasing hexapeptide supplied as a 5mg lyophilized research vial. Reference material for GHS-R1a, pituitary somatotroph, GH-axis, and peptide-identity assay contexts.",
  },
  {
    slug: "hexarelin-2mg",
    sku: "HEXARELIN-2MG",
    name: "Hexarelin, 2mg vial",
    shortName: "Hexarelin",
    dose: "2mg",
    format: "vial",
    listPriceCents: 3500,
    perMgCents: 1750,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested $35 2mg price; above captured Hexarelin p75 and below highest exact 2mg comparator",
    shortDescription:
      "Synthetic six-amino-acid growth-hormone-releasing peptide supplied as a 2mg lyophilized research vial. Reference material for GHRP-class identity, GHS-R1a pathway, and analytical workflow contexts.",
  },
  {
    slug: "peg-mgf-2mg",
    sku: "PEG-MGF-2MG",
    name: "PEG-MGF, 2mg vial",
    shortName: "PEG-MGF",
    dose: "2mg",
    format: "vial",
    listPriceCents: 5900,
    perMgCents: 2950,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested premium 2mg price; above captured PEG-MGF p75 and most exact 2mg comparators",
    shortDescription:
      "PEGylated mechano growth factor research reference associated with the IGF-1 Ec splice-variant fragment. Supplied as a 2mg vial for peptide identity, PEGylation, stability, IGF-axis, and analytical workflow contexts.",
  },
  {
    slug: "igf-1-des-1mg",
    sku: "IGF-1-DES-1MG",
    name: "IGF-1 DES, 1mg vial",
    shortName: "IGF-1 DES",
    dose: "1mg",
    format: "vial",
    listPriceCents: 6900,
    perMgCents: 6900,
    category: "gh-axis",
    role: "catalog-filler",
    position:
      "operator-requested 1mg DES format; below captured exact 1mg Extreme and Paradigm rows, above uncertain discount-homepage signal, and not price-led",
    shortDescription:
      "IGF-1 class research peptide listed in the corpus as IGF-1 DES, IGF DES, and IGF-1 DES 1,3. Reference material for peptide identity, IGF-axis taxonomy, and analytical workflow contexts.",
  },
  {
    slug: "semax-30mg",
    sku: "SEMAX-30MG",
    name: "Semax, 30mg vial",
    shortName: "Semax",
    dose: "30mg",
    format: "vial",
    listPriceCents: 6000,
    perMgCents: 200,
    category: "nootropic",
    role: "volume-driver",
    position: "just below market median",
    shortDescription:
      "Synthetic heptapeptide derived from ACTH (4-10). Subject of Russian-published research literature on neuropeptide signaling and cognitive-paradigm investigation in animal models.",
  },
  {
    slug: "semax-10mg",
    sku: "SEMAX-10MG",
    name: "Semax, 10mg vial",
    shortName: "Semax",
    dose: "10mg",
    format: "vial",
    listPriceCents: 6500,
    perMgCents: 650,
    category: "nootropic",
    role: "catalog-filler",
    position: "operator-approved live catalog price",
    shortDescription:
      "Synthetic heptapeptide derived from ACTH (4-10), supplied as a 10mg lyophilized research vial. Studied in Russian-published cell-culture and animal-model literature on neuropeptide signaling and neurotrophic-marker pathways.",
  },
  {
    slug: "kisspeptin-10-10mg",
    sku: "KISSPEPTIN-10-10MG",
    name: "Kisspeptin-10, 10mg vial",
    shortName: "Kisspeptin-10",
    dose: "10mg",
    format: "vial",
    listPriceCents: 10900,
    perMgCents: 1090,
    category: "nootropic",
    role: "catalog-filler",
    position:
      "operator-requested premium above captured Kisspeptin-10 range; thin corpus, documentation-led listing",
    shortDescription:
      "Kisspeptin-10 decapeptide, also identified as Metastin or a KISS1-derived peptide, supplied as a 10mg lyophilized research vial. Reference material for RF-amide identity, KISS1R binding, LC-MS, and peptide-stability assay workflows.",
  },
  {
    slug: "epitalon-50mg",
    sku: "EPITALON-50MG",
    name: "Epitalon, 50mg vial",
    shortName: "Epitalon",
    dose: "50mg",
    format: "vial",
    listPriceCents: 6000,
    perMgCents: 120,
    category: "metabolic",
    role: "catalog-filler",
    position: "market median",
    shortDescription:
      "Synthetic tetrapeptide (Ala-Glu-Asp-Gly) of the Khavinson bioregulator class. Studied in cell-culture research on telomere-related cellular signaling and in animal-model longevity paradigms.",
  },
  {
    slug: "epitalon-10mg",
    sku: "EPITALON-10MG",
    name: "Epitalon, 10mg vial",
    shortName: "Epitalon",
    dose: "10mg",
    format: "vial",
    listPriceCents: 4900,
    perMgCents: 490,
    category: "metabolic",
    role: "catalog-filler",
    position: "operator-requested premium 10mg format above captured p75",
    shortDescription:
      "Synthetic tetrapeptide (Ala-Glu-Asp-Gly; AEDG) of the Khavinson bioregulator class, supplied as a 10mg lyophilized research vial. Studied in cell-culture and animal-model work on telomere-related cellular signaling and pineal-axis models.",
  },
  {
    slug: "thymosin-alpha-1-5mg",
    sku: "THYMOSIN-ALPHA-1-5MG",
    name: "Thymosin Alpha-1, 5mg vial",
    shortName: "Thymosin α-1",
    dose: "5mg",
    format: "vial",
    listPriceCents: 7500,
    perMgCents: 1500,
    category: "immune",
    role: "catalog-filler",
    position: "market median",
    shortDescription:
      "Synthetic 28-amino-acid peptide identical to the naturally occurring thymic peptide. Studied in cell-culture and animal-model research on immune-cell signaling and lymphocyte differentiation.",
  },
  {
    slug: "thymosin-alpha-1-10mg",
    sku: "THYMOSIN-ALPHA-1-10MG",
    name: "Thymosin Alpha-1, 10mg vial",
    shortName: "Thymosin Alpha-1",
    dose: "10mg",
    format: "vial",
    listPriceCents: 9900,
    perMgCents: 990,
    category: "immune",
    role: "catalog-filler",
    position:
      "operator-requested 10mg format; above captured median and below captured Thymosin Alpha-1 p75",
    shortDescription:
      "Synthetic 28-amino-acid thymic peptide supplied as a 10mg lyophilized research vial. Reference material for peptide identity, HPLC/LC-MS analysis, and cell-signaling pathway models.",
  },
  {
    slug: "ll-37-5mg",
    sku: "LL-37-5MG",
    name: "LL-37, 5mg vial",
    shortName: "LL-37",
    dose: "5mg",
    format: "vial",
    listPriceCents: 7900,
    perMgCents: 1580,
    category: "immune",
    role: "catalog-filler",
    position: "operator-requested 5mg price above LL-37 median and below p75",
    shortDescription:
      "Cathelicidin-derived 37-amino-acid peptide supplied as a 5mg lyophilized research vial. Reference material for peptide identity, membrane-interaction, LC-MS, HPLC, and comparative assay workflows.",
  },
  {
    slug: "follistatin-344-1mg",
    sku: "FOLLISTATIN-344-1MG",
    name: "Follistatin-344, 1mg vial",
    shortName: "Follistatin-344",
    dose: "1mg",
    format: "vial",
    listPriceCents: 14900,
    perMgCents: 14900,
    category: "recovery",
    role: "catalog-filler",
    position:
      "operator-requested premium 1mg format above captured median and below captured p75",
    shortDescription:
      "Recombinant human Follistatin-344 research reference supplied as a 1mg lyophilized vial. Cataloged for protein identity, TGF-beta-family ligand-binding, myostatin/activin pathway, and analytical workflow contexts only.",
  },
  {
    slug: "dsip-5mg",
    sku: "DSIP-5MG",
    name: "DSIP, 5mg vial",
    shortName: "DSIP",
    dose: "5mg",
    format: "vial",
    listPriceCents: 4900,
    perMgCents: 980,
    category: "nootropic",
    role: "catalog-filler",
    position: "operator-requested premium above captured DSIP 75th percentile",
    shortDescription:
      "Delta Sleep-Inducing Peptide, a nine-amino-acid neuropeptide supplied as a 5mg lyophilized research vial. Studied in non-clinical research on CNS signaling, circadian-pathway models, and neurotransmitter-system assay contexts.",
  },
  {
    slug: "kpv-5mg",
    sku: "KPV-5MG",
    name: "KPV, 5mg vial",
    shortName: "KPV",
    dose: "5mg",
    format: "vial",
    listPriceCents: 4500,
    perMgCents: 900,
    category: "recovery",
    role: "catalog-filler",
    position: "just below market median",
    shortDescription:
      "Synthetic tripeptide (Lys-Pro-Val) corresponding to the C-terminal sequence of alpha-MSH. Studied in cell-culture research on inflammatory pathway signaling.",
  },
  {
    slug: "kpv-10mg",
    sku: "KPV-10MG",
    name: "KPV, 10mg vial",
    shortName: "KPV",
    dose: "10mg",
    format: "vial",
    listPriceCents: 6900,
    perMgCents: 690,
    category: "recovery",
    role: "catalog-filler",
    position: "above median, below 75th percentile; requested 10mg format",
    shortDescription:
      "Synthetic tripeptide (Lys-Pro-Val) corresponding to alpha-MSH residues 11-13. Supplied as a lyophilized research vial for cytokine-expression and inflammatory-pathway signaling studies.",
  },
  {
    slug: "kpv-500mcg",
    sku: "KPV-500MCG",
    name: "KPV, 500mcg vial",
    shortName: "KPV",
    dose: "500mcg",
    format: "vial",
    listPriceCents: 4800,
    perMgCents: 9600,
    category: "recovery",
    role: "catalog-filler",
    position: "operator-approved live catalog price",
    shortDescription:
      "Synthetic tripeptide (Lys-Pro-Val) supplied as a 500mcg lyophilized research vial. Reference material for peptide identity, purity review, and inflammatory-pathway assay contexts.",
  },
  {
    slug: "aod-9604-5mg",
    sku: "AOD-9604-5MG",
    name: "AOD-9604, 5mg vial",
    shortName: "AOD-9604",
    dose: "5mg",
    format: "vial",
    listPriceCents: 5900,
    perMgCents: 1180,
    category: "metabolic",
    role: "catalog-filler",
    position:
      "operator-requested 5mg price; above captured AOD-9604 median and below captured p75",
    shortDescription:
      "Synthetic growth-hormone-derived peptide fragment supplied as a 5mg lyophilized research vial. Reference material for lipid-metabolism pathway, peptide-identity, and analytical workflow contexts.",
  },
  {
    slug: "checkout-verification-1usd",
    sku: "CHECKOUT-VERIFY-1USD",
    name: "Checkout Verification, 1 unit",
    shortName: "Checkout Verification",
    dose: "1 unit",
    format: "vial",
    listPriceCents: 100,
    perMgCents: 100,
    category: "recovery",
    role: "catalog-filler",
    position: "operator-requested $1 live payment verification SKU",
    shortDescription:
      "One-unit RUO checkout verification item for live payment-flow testing and order reconciliation. Dispatch occurs only after staff confirms the matching manual payment.",
  },
];

export const bundles: Bundle[] = [
  {
    slug: "recovery-stack",
    sku: "BUNDLE-RECOVERY-STACK",
    name: "Structural Model Set",
    constituents: ["BPC-157-10MG", "TB-500-10MG", "KPV-10MG"],
    listPriceCents: 12900,
    effectiveDiscountPct: 36.1,
    description:
      "Single-vial RUO set labeled with BPC-157 10mg, TB-500 10mg, and KPV 10mg. Built around component identity, canonical naming, and batch-led analytical documentation.",
  },
  {
    slug: "glow-stack",
    sku: "BUNDLE-GLOW-STACK",
    name: "Copper Matrix Set",
    constituents: ["GHK-CU-50MG", "TB-500-10MG", "BPC-157-10MG"],
    listPriceCents: 16900,
    effectiveDiscountPct: 23.9,
    description:
      "Single-vial RUO set labeled with GHK-Cu 50mg, TB-500 10mg, and BPC-157 10mg. Framed around component identity, batch traceability, and analytical review.",
  },
  {
    slug: "wolverine-stack",
    sku: "BUNDLE-WOLVERINE-STACK",
    name: "BPC/TB Reference Set",
    constituents: ["BPC-157-10MG", "TB-500-10MG"],
    listPriceCents: 9900,
    effectiveDiscountPct: 25.6,
    description:
      "Single-vial RUO set labeled with BPC-157 10mg and TB-500 10mg. Presented as a two-component reference material with batch-led analytical documentation.",
  },
  {
    slug: "neuro-stack",
    sku: "BUNDLE-NEURO-STACK",
    name: "Neuropeptide Reference Set",
    constituents: ["SEMAX-10MG", "SELANK-10MG"],
    listPriceCents: 6900,
    effectiveDiscountPct: 28.9,
    description:
      "Single-vial RUO set labeled with Semax 10mg and Selank 10mg. Built for ACTH-fragment and tuftsin-derived peptide identity, component comparison, and batch-led analytical documentation workflows.",
  },
  {
    slug: "longevity-stack",
    sku: "BUNDLE-LONGEVITY-STACK",
    name: "Mitochondrial Reference Set",
    constituents: ["MOTS-C-10MG", "EPITALON-10MG", "NAD-500MG"],
    listPriceCents: 17900,
    effectiveDiscountPct: 13.5,
    description:
      "Single-vial RUO set labeled with MOTS-c 10mg, Epitalon 10mg, and NAD+ 500mg. Use as pathway/category framing only: mitochondrial-derived peptide, Khavinson tetrapeptide, and redox coenzyme reference materials.",
  },
];

export const productCategories: { id: ProductCategory; label: string }[] = [
  { id: "recovery", label: "Structural Models" },
  { id: "gh-axis", label: "Endocrine Models" },
  { id: "cosmetic-pathway", label: "Copper Systems" },
  { id: "metabolic", label: "Mitochondrial Systems" },
  { id: "nootropic", label: "Neuropeptide Systems" },
  { id: "immune", label: "Host-Response Models" },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBundleBySlug(slug: string): Bundle | undefined {
  return bundles.find((b) => b.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatPerMg(cents: number): string {
  return `$${(cents / 100).toFixed(2)}/mg`;
}
