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
    ["tesamorelin-5mg", "Tesamorelin 5mg"],
    ["igf-1-lr3-1mg", "IGF-1 LR3 1mg"],
    ["ghrp-2-5mg", "GHRP-2 5mg"],
    ["ghrp-6-5mg", "GHRP-6 5mg"],
    ["hexarelin-2mg", "Hexarelin 2mg"],
    ["peg-mgf-2mg", "PEG-MGF 2mg"],
    ["igf-1-des-1mg", "IGF-1 DES 1mg"],
    ["semax-30mg", "Semax 30mg"],
    ["semax-10mg", "Semax 10mg"],
    ["pt-141-10mg", "PT-141 10mg"],
    ["melanotan-ii-10mg", "Melanotan II 10mg"],
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
    ["klow-80mg", "Klow 80mg"],
    ["reta-10mg", "Reta 10mg"],
    ["reta-20mg", "Reta 20mg"],
    ["tirz-25mg", "Tirz 25mg"],
  ].map(([slug, label]) => [
    slug,
    {
      src: `/product-shots/${slug}.png`,
      alt: `vialchem.labs ${label} research vial`,
    },
  ]),
) as Partial<Record<string, ProductStudioImage>>;

export function getProductStudioImage(
  slug: string,
): ProductStudioImage | undefined {
  return productStudioImages[slug];
}
