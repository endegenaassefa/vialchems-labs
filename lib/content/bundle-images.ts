export interface BundleStudioImage {
  src: string;
  alt: string;
}

const bundleStudioImages = Object.fromEntries(
  [
    ['recovery-stack', 'Recovery Stack'],
    ['glow-stack', 'Glow Stack'],
    ['wolverine-stack', 'Wolverine Stack'],
    ['neuro-stack', 'Neuro Stack'],
    ['longevity-stack', 'Longevity Stack'],
  ].map(([slug, label]) => [
    slug,
    {
      src: `/bundle-shots/${slug}-single-vial.png`,
      alt: `vialchemlabs ${label} single-vial research stack`,
    },
  ]),
) as Partial<Record<string, BundleStudioImage>>;

export function getBundleStudioImage(
  slug: string,
): BundleStudioImage | undefined {
  return bundleStudioImages[slug];
}
