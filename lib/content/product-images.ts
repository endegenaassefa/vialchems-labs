export interface ProductStudioImage {
  src: string;
  alt: string;
}

const productStudioImages: Partial<Record<string, ProductStudioImage>> = {
  'bpc-157-10mg': {
    src: '/product-shots/bpc-157-10mg.png',
    alt: 'vialchemlabs BPC-157 10mg research vial',
  },
  'tb-500-5mg': {
    src: '/product-shots/tb-500-5mg.png',
    alt: 'vialchemlabs TB-500 5mg research vial',
  },
  'ghk-cu-50mg': {
    src: '/product-shots/ghk-cu-50mg.png',
    alt: 'vialchemlabs GHK-Cu 50mg research vial',
  },
  'ipamorelin-10mg': {
    src: '/product-shots/ipamorelin-10mg.png',
    alt: 'vialchemlabs Ipamorelin 10mg research vial',
  },
  'cjc-1295-no-dac-5mg': {
    src: '/product-shots/cjc-1295-no-dac-5mg.png',
    alt: 'vialchemlabs CJC-1295 (no DAC) 5mg research vial',
  },
  'mots-c-10mg': {
    src: '/product-shots/mots-c-10mg.png',
    alt: 'vialchemlabs MOTS-c 10mg research vial',
  },
  'selank-10mg': {
    src: '/product-shots/selank-10mg.png',
    alt: 'vialchemlabs Selank 10mg research vial',
  },
  'sermorelin-2mg': {
    src: '/product-shots/sermorelin-2mg.png',
    alt: 'vialchemlabs Sermorelin 2mg research vial',
  },
  'ghrp-2-5mg': {
    src: '/product-shots/ghrp-2-5mg.png',
    alt: 'vialchemlabs GHRP-2 5mg research vial',
  },
  'ghrp-6-5mg': {
    src: '/product-shots/ghrp-6-5mg.png',
    alt: 'vialchemlabs GHRP-6 5mg research vial',
  },
  'hexarelin-2mg': {
    src: '/product-shots/hexarelin-2mg.png',
    alt: 'vialchemlabs Hexarelin 2mg research vial',
  },
  'semax-30mg': {
    src: '/product-shots/semax-30mg.png',
    alt: 'vialchemlabs Semax 30mg research vial',
  },
  'epitalon-50mg': {
    src: '/product-shots/epitalon-50mg.png',
    alt: 'vialchemlabs Epitalon 50mg research vial',
  },
  'thymosin-alpha-1-5mg': {
    src: '/product-shots/thymosin-alpha-1-5mg.png',
    alt: 'vialchemlabs Thymosin alpha-1 5mg research vial',
  },
  'dsip-5mg': {
    src: '/product-shots/dsip-5mg.png',
    alt: 'vialchemlabs DSIP 5mg research vial',
  },
  'kpv-5mg': {
    src: '/product-shots/kpv-5mg.png',
    alt: 'vialchemlabs KPV 5mg research vial',
  },
};

export function getProductStudioImage(
  slug: string,
): ProductStudioImage | undefined {
  return productStudioImages[slug];
}
