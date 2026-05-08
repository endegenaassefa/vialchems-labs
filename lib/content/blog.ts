/**
 * Blog post stubs. Phase 6 will replace these with full ≥1500-word articles.
 *
 * For Phase 5 we expose only metadata: slug + title + summary + the published
 * date. The dynamic route at app/blog/[slug]/page.tsx renders any matching
 * slug with placeholder body copy.
 */

export interface BlogPostMeta {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'reading-a-coa',
    title: 'How to Read a Certificate of Analysis',
    summary:
      'A primer on the four data points that matter on every COA: identity (mass spectrometry), purity (HPLC area-percent), sterility (USP <71>), and endotoxin (LAL).',
    publishedAt: '2026-04-15',
  },
  {
    slug: 'lyophilized-peptide-storage',
    title: 'Lyophilized Peptide Storage: Conditions and Stability',
    summary:
      'Sealed lyophilized vials at 2-8°C versus reconstituted solutions. What the literature reports on shelf-life under varied storage conditions.',
    publishedAt: '2026-04-22',
  },
  {
    slug: 'reconstitution-best-practices',
    title: 'Reconstitution: A Laboratory Workflow Reference',
    summary:
      'Bench-side reference on reconstitution workflows for in-vitro research, including solvent selection considerations and concentration calculation.',
    publishedAt: '2026-04-29',
  },
  {
    slug: 'hplc-purity-explained',
    title: 'HPLC Purity: What Area-Percent Actually Measures',
    summary:
      'Reverse-phase HPLC with UV detection is the industry-standard purity assay. What the area-percent number includes, excludes, and tells a researcher.',
    publishedAt: '2026-05-06',
  },
  {
    slug: 'third-party-testing-context',
    title: 'Why Independent Third-Party Testing Matters',
    summary:
      'A vendor self-published COA is a self-attestation. An independent-laboratory COA is a primary-source document. The distinction is operational, not cosmetic.',
    publishedAt: '2026-05-08',
  },
];

export function getBlogPostBySlug(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
