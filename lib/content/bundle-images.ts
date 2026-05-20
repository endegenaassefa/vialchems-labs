export interface BundleStudioImage {
  src: string;
  alt: string;
}

const bundleStudioImages = Object.fromEntries(
  [
    ["recovery-stack", "Structural Model Set"],
    ["dermal-research-triple", "Dermal Research Triple"],
    ["recovery-pair", "Recovery Pair"],
    ["nootropic-pair", "Nootropic Pair"],
    ["longevity-triple", "Longevity Triple"],
  ].map(([slug, label]) => [
    slug,
    {
      src: `/bundle-shots/${slug}-single-vial.png`,
      alt: `VialChem Labs ${label} single-vial research set`,
    },
  ]),
) as Partial<Record<string, BundleStudioImage>>;

export function getBundleStudioImage(
  slug: string,
): BundleStudioImage | undefined {
  return bundleStudioImages[slug];
}
