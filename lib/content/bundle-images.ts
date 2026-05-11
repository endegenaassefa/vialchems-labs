export interface BundleStudioImage {
  src: string;
  alt: string;
}

const bundleStudioImages: Partial<Record<string, BundleStudioImage>> = {
  'recovery-stack': {
    src: '/bundle-shots/recovery-stack.png',
    alt: 'vialchemlabs Recovery Stack research bundle',
  },
  'gh-pulsatile-stack': {
    src: '/bundle-shots/gh-pulsatile-stack.png',
    alt: 'vialchemlabs GH Pulsatile Stack research bundle',
  },
  'khavinson-stack': {
    src: '/bundle-shots/khavinson-stack.png',
    alt: 'vialchemlabs Khavinson Bioregulator Stack research bundle',
  },
};

export function getBundleStudioImage(
  slug: string,
): BundleStudioImage | undefined {
  return bundleStudioImages[slug];
}
