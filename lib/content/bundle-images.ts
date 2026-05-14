export interface BundleStudioImage {
  src: string;
  alt: string;
}

const bundleStudioImages = Object.fromEntries(
  [
    ["recovery-stack", "Structural Model Set"],
    ["glow-stack", "Copper Matrix Set"],
    ["wolverine-stack", "BPC/TB Reference Set"],
    ["neuro-stack", "Neuropeptide Reference Set"],
    ["longevity-stack", "Mitochondrial Reference Set"],
  ].map(([slug, label]) => [
    slug,
    {
      src: `/bundle-shots/${slug}-single-vial.png`,
      alt: `vialchemlabs ${label} single-vial research set`,
    },
  ]),
) as Partial<Record<string, BundleStudioImage>>;

export function getBundleStudioImage(
  slug: string,
): BundleStudioImage | undefined {
  return bundleStudioImages[slug];
}
