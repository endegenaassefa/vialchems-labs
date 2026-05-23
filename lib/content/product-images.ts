export interface ProductStudioImage {
  src: string;
  alt: string;
}

const productStudioImages = Object.fromEntries(
  [
    ["bpc-157-10mg", "BPC-157 10mg"],
    ["checkout-verification-1usd", "Checkout Verification 1 unit"],
    ["tb-500-5mg", "TB-500 5mg"],
    ["tb-500-10mg", "TB-500 10mg"],
    ["ghk-cu-50mg", "GHK-Cu 50mg"],
    ["ipamorelin-10mg", "Ipamorelin 10mg"],
    ["ipamorelin-5mg", "Ipamorelin 5mg"],
    ["cjc-1295-no-dac-5mg", "CJC-1295 No DAC 5mg"],
    ["cjc-1295-dac-2mg", "CJC-1295 DAC 2mg"],
    ["cjc-1295-ipamorelin-5mg", "CJC-1295 + Ipamorelin 5mg"],
    ["cjc-1295-ipamorelin-10mg", "CJC-1295 + Ipamorelin 10mg"],
    ["mots-c-10mg", "MOTS-c 10mg"],
    ["nad-500mg", "NAD+ 500mg"],
    ["selank-10mg", "Selank 10mg"],
    ["sermorelin-2mg", "Sermorelin 2mg"],
    ["sermorelin-5mg", "Sermorelin 5mg"],
    ["sermorelin-ipamorelin-10mg", "Sermorelin + Ipamorelin 10mg"],
    ["igf-1-lr3-1mg", "IGF-1 LR3 1mg"],
    ["ghrp-2-5mg", "GHRP-2 5mg"],
    ["ghrp-6-5mg", "GHRP-6 5mg"],
    ["hexarelin-2mg", "Hexarelin 2mg"],
    ["peg-mgf-2mg", "PEG-MGF 2mg"],
    ["igf-1-des-1mg", "IGF-1 DES 1mg"],
    ["semax-30mg", "Semax 30mg"],
    ["semax-10mg", "Semax 10mg"],
    ["kisspeptin-10-10mg", "Kisspeptin-10 10mg"],
    ["epitalon-50mg", "Epitalon 50mg"],
    ["epitalon-10mg", "Epitalon 10mg"],
    ["thymosin-alpha-1-5mg", "Thymosin Alpha-1 5mg"],
    ["thymosin-alpha-1-10mg", "Thymosin Alpha-1 10mg"],
    ["ll-37-5mg", "LL-37 5mg"],
    ["follistatin-344-1mg", "Follistatin-344 1mg"],
    ["dsip-5mg", "DSIP 5mg"],
    ["kpv-5mg", "KPV 5mg"],
    ["kpv-10mg", "KPV 10mg"],
    ["kpv-500mcg", "KPV 500mcg"],
    ["aod-9604-5mg", "AOD-9604 5mg"],
    // Operator-override SKUs per docs/DECISIONS/iron_law_2_7_override_2026-05-22.md
    ["klow-80mg", "KLOW 80mg"],
    ["reta-10mg", "Reta 10mg"],
    ["reta-20mg", "Reta 20mg"],
    ["tirz-25mg", "Tirz 25mg"],
  ].map(([slug, label]) => [
    slug,
    {
      src: `/product-shots/${slug}.png`,
      alt: `VialChem Labs ${label} research vial`,
    },
  ]),
) as Partial<Record<string, ProductStudioImage>>;

export function getProductStudioImage(
  slug: string,
): ProductStudioImage | undefined {
  return productStudioImages[slug];
}

/**
 * Returns the responsive srcset string for a product-shot path
 * (e.g. "/product-shots/bpc-157-10mg.png"). Variants live alongside
 * the source PNG in `public/product-shots/responsive/<slug>-<width>.png`
 * and are generated at commit time by
 * `scripts/generate-mobile-image-variants.mjs`. Returns null if the
 * source path doesn't match the catalog convention.
 *
 * The 4 widths (256/384/512/768) match the M0i spec in
 * SUPER_PROMPT_softlaunch_2026-05-22 §6 and span the iPhone SE
 * 1-column grid (~265px wide) through the 3-col desktop grid
 * (~340px per card at 1280 viewport). The browser picks the
 * smallest variant >= the rendered pixel width (after DPR scaling).
 */
const VARIANT_WIDTHS = [256, 384, 512, 768] as const;

export function getProductImageSrcset(src: string): string | null {
  const match = /^\/product-shots\/([^/]+)\.png$/.exec(src);
  if (!match) return null;
  const slug = match[1];
  return VARIANT_WIDTHS.map(
    (w) => `/product-shots/responsive/${slug}-${w}.png ${w}w`,
  ).join(", ");
}

/**
 * Default `sizes` attribute for catalog product cards rendered through
 * `ProductVisual`. Maps to the M0d grid breakpoints:
 *   - under 640px (1-col grid): each card spans ~100vw minus container
 *     padding → roughly 90vw upper bound
 *   - 640-1023px (2-col grid): each card spans ~50vw
 *   - 1024+ (3-col grid): each card spans ~33vw
 */
export const PRODUCT_CARD_IMAGE_SIZES =
  "(max-width: 639px) 90vw, (max-width: 1023px) 50vw, 33vw";
