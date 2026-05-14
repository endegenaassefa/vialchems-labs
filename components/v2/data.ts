import {
  bundles,
  formatPrice,
  products,
  type Bundle,
  type Product,
} from "@/lib/content/products";

export type CatalogItem =
  | {
      kind: "product";
      slug: string;
      sku: string;
      name: string;
      shortName: string;
      dose: string;
      family: string;
      priceCents: number;
      description: string;
      restricted: boolean;
      stock: number;
      image: string;
      marketRange: string;
      source: Product;
    }
  | {
      kind: "bundle";
      slug: string;
      sku: string;
      name: string;
      shortName: string;
      dose: string;
      family: string;
      priceCents: number;
      description: string;
      restricted: boolean;
      stock: number;
      image: string;
      marketRange: string;
      source: Bundle;
    };

export const catalogFamilyOrder = [
  "Reference peptide",
  "Secretagogue",
  "Blend",
  "Neuropeptide",
  "Metabolic peptide",
  "Research peptide",
  "Growth factor",
  "Popular stack",
] as const;

const blendSlugs = new Set([
  "cjc-1295-ipamorelin-10mg",
  "sermorelin-ipamorelin-10mg",
]);

const familyBySlug = new Map<string, string>([
  ["bpc-157-10mg", "Reference peptide"],
  ["tb-500-5mg", "Reference peptide"],
  ["tb-500-10mg", "Reference peptide"],
  ["ghk-cu-50mg", "Reference peptide"],
  ["kpv-5mg", "Reference peptide"],
  ["kpv-10mg", "Reference peptide"],
  ["ipamorelin-10mg", "Secretagogue"],
  ["ipamorelin-5mg", "Secretagogue"],
  ["cjc-1295-no-dac-5mg", "Secretagogue"],
  ["cjc-1295-dac-2mg", "Secretagogue"],
  ["sermorelin-2mg", "Secretagogue"],
  ["sermorelin-5mg", "Secretagogue"],
  ["tesamorelin-5mg", "Secretagogue"],
  ["ghrp-2-5mg", "Secretagogue"],
  ["ghrp-6-5mg", "Secretagogue"],
  ["hexarelin-2mg", "Secretagogue"],
  ["selank-10mg", "Neuropeptide"],
  ["semax-30mg", "Neuropeptide"],
  ["semax-10mg", "Neuropeptide"],
  ["dsip-5mg", "Neuropeptide"],
  ["mots-c-10mg", "Metabolic peptide"],
  ["nad-500mg", "Metabolic peptide"],
  ["epitalon-50mg", "Metabolic peptide"],
  ["epitalon-10mg", "Metabolic peptide"],
  ["aod-9604-5mg", "Metabolic peptide"],
  ["pt-141-10mg", "Research peptide"],
  ["melanotan-ii-10mg", "Research peptide"],
  ["kisspeptin-10-10mg", "Research peptide"],
  ["thymosin-alpha-1-5mg", "Research peptide"],
  ["thymosin-alpha-1-10mg", "Research peptide"],
  ["ll-37-5mg", "Research peptide"],
  ["follistatin-344-1mg", "Growth factor"],
  ["igf-1-lr3-1mg", "Growth factor"],
  ["peg-mgf-2mg", "Growth factor"],
  ["igf-1-des-1mg", "Growth factor"],
]);

function catalogFamily(product: Product) {
  if (blendSlugs.has(product.slug)) return "Blend";
  return familyBySlug.get(product.slug) ?? "Research peptide";
}

const imageBySlug: Record<string, string> = {
  "aod-9604-5mg": "vailchem_aod-9604_5-mg_suggested-59.png",
  "bpc-157-10mg": "vailchem_bpc-157_5-mg_suggested-59.png",
  "cjc-1295-dac-2mg": "vailchem_cjc-1295-dac_2-mg_suggested-59.png",
  "cjc-1295-no-dac-5mg": "vailchem_cjc-1295-no-dac_5-mg_suggested-79.png",
  "cjc-1295-ipamorelin-10mg":
    "vailchem_cjc-1295-plus-ipamorelin-blend_10-mg_suggested-99.png",
  "dsip-5mg": "vailchem_dsip_5-mg_suggested-49.png",
  "epitalon-10mg": "vailchem_epitalon_10-mg_suggested-49.png",
  "epitalon-50mg": "vailchem_epitalon_10-mg_suggested-49.png",
  "follistatin-344-1mg": "vailchem_follistatin-344_1-mg_suggested-149.png",
  "ghk-cu-50mg": "vailchem_ghk-cu_50-mg_suggested-89.png",
  "ghrp-2-5mg": "vailchem_ghrp-2_5-mg_suggested-39.png",
  "ghrp-6-5mg": "vailchem_ghrp-6_5-mg_suggested-39.png",
  "hexarelin-2mg": "vailchem_hexarelin_2-mg_suggested-35.png",
  "igf-1-des-1mg": "vailchem_igf-1-des_1-mg_suggested-69.png",
  "igf-1-lr3-1mg": "vailchem_igf-1-lr3_1-mg_suggested-99.png",
  "ipamorelin-5mg": "vailchem_ipamorelin_5-mg_suggested-69.png",
  "ipamorelin-10mg": "vailchem_ipamorelin_5-mg_suggested-69.png",
  "kisspeptin-10-10mg": "vailchem_kisspeptin-10_10-mg_suggested-109.png",
  "kpv-5mg": "vailchem_kpv_10-mg_suggested-69.png",
  "kpv-10mg": "vailchem_kpv_10-mg_suggested-69.png",
  "ll-37-5mg": "vailchem_ll-37_5-mg_suggested-79.png",
  "melanotan-ii-10mg": "vailchem_melanotan-ii_10-mg_suggested-59.png",
  "mots-c-10mg": "vailchem_mots-c_10-mg_suggested-79.png",
  "nad-500mg": "vailchem_nadplus_100-mg-500-mg_suggested-79.png",
  "peg-mgf-2mg": "vailchem_peg-mgf_2-mg_suggested-59.png",
  "pt-141-10mg": "vailchem_pt-141_10-mg_suggested-59.png",
  "selank-10mg": "vailchem_selank_10-mg_suggested-49.png",
  "semax-10mg": "vailchem_semax_10-mg_suggested-49.png",
  "semax-30mg": "vailchem_semax_10-mg_suggested-49.png",
  "sermorelin-5mg": "vailchem_sermorelin_5-mg_suggested-59.png",
  "sermorelin-2mg": "vailchem_sermorelin_5-mg_suggested-59.png",
  "sermorelin-ipamorelin-10mg":
    "vailchem_sermorelin-plus-ipamorelin-blend_10-mg_suggested-89.png",
  "tb-500-5mg": "vailchem_tb-500_5-mg_suggested-69.png",
  "tb-500-10mg": "vailchem_tb-500_5-mg_suggested-69.png",
  "tesamorelin-5mg": "vailchem_tesamorelin_5-mg_suggested-69.png",
  "thymosin-alpha-1-5mg": "vailchem_thymosin-alpha-1_10-mg_suggested-99.png",
  "thymosin-alpha-1-10mg": "vailchem_thymosin-alpha-1_10-mg_suggested-99.png",
  "glow-stack": "vailchem_glow-stack_suggested-169.png",
  "longevity-stack": "vailchem_longevity-stack_suggested-179.png",
  "neuro-stack": "vailchem_neuro-stack_suggested-69.png",
  "recovery-stack": "vailchem_recovery-stack_suggested-129.png",
  "wolverine-stack": "vailchem_wolverine-stack_suggested-99.png",
};

export function productImagePath(slug: string) {
  const file = imageBySlug[slug] ?? "vailchem_ghk-cu_50-mg_suggested-89.png";
  return `/v2-assets/vailchem-products/${file}`;
}

export function skuCode(sku: string) {
  const index = products.findIndex((p) => p.sku === sku);
  if (index >= 0) return `VC-${String(index + 1).padStart(3, "0")}`;
  const bundleIndex = bundles.findIndex((b) => b.sku === sku);
  return `VC-${String(products.length + bundleIndex + 1).padStart(3, "0")}`;
}

export function isRestricted(product: Product) {
  return product.category === "gh-axis" || product.role === "volume-driver";
}

export const catalogItems: CatalogItem[] = [
  ...products.map(
    (product, index): CatalogItem => ({
      kind: "product",
      slug: product.slug,
      sku: product.sku,
      name: product.name.replace(", ", " · "),
      shortName: product.shortName,
      dose: product.dose,
      family: catalogFamily(product),
      priceCents: product.listPriceCents,
      description: product.shortDescription,
      restricted: isRestricted(product),
      stock: 9 + ((index * 7) % 36),
      image: productImagePath(product.slug),
      marketRange: product.position,
      source: product,
    }),
  ),
  ...bundles.map(
    (bundle, index): CatalogItem => ({
      kind: "bundle",
      slug: bundle.slug,
      sku: bundle.sku,
      name: bundle.name,
      shortName: bundle.name,
      dose: "Set",
      family: "Popular stack",
      priceCents: bundle.listPriceCents,
      description: bundle.description,
      restricted: true,
      stock: 11 + index,
      image: productImagePath(bundle.slug),
      marketRange: `${bundle.effectiveDiscountPct.toFixed(1)}% effective discount`,
      source: bundle,
    }),
  ),
];

export function getCatalogItem(slug: string) {
  return catalogItems.find((item) => item.slug === slug);
}

export function displayPrice(cents: number) {
  return formatPrice(cents);
}
