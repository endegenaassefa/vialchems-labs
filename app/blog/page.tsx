/**
 * Blog index — Phase 5 lists 5 placeholder posts. Phase 6 will replace
 * each with a ≥1500-word article + ≥5 scientific citations.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { StaggerReveal } from '@/components/ui/StaggerReveal';
import { blogPosts } from '@/lib/content/blog';

export const metadata: Metadata = {
  title: 'Research Index',
  description:
    'Plain-language reference on Certificates of Analysis, lyophilized peptide storage, reconstitution workflows, and HPLC purity.',
};

export default function BlogIndexPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* v4 hero — varied. Research Index uses an editorial register
            inspired by anthropic.com's blog posture: large body type as the
            hero rather than a separate display headline. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-10">
              R E S E A R C H · I N D E X
            </p>
            <h1 className="text-[clamp(28px,3.2vw,40px)] font-light leading-[1.35] tracking-tight text-[var(--text)] max-w-3xl">
              Plain-language explainers for laboratory workflows. Reading a
              Certificate of Analysis. Storage and reconstitution conditions.
              HPLC purity. The difference between a vendor self-attestation
              and an independent-laboratory report.{' '}
              <span className="font-serif-italic text-[var(--accent-soft)]">
                Reference, not advice.
              </span>
            </h1>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              {blogPosts.length} articles · No outcome claims · Citations on every reference
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-16">
            <StaggerReveal as="ul" itemAs="li" className="space-y-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <Card as="article" variant="interactive" className="p-7">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] mb-2">
                      <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    </p>
                    <h2 className="text-[24px] md:text-[28px] font-medium leading-tight tracking-tight text-[var(--text)] mb-3 group-hover:text-[var(--accent-soft)] transition-colors duration-[var(--dur-short)]">
                      {post.title}
                    </h2>
                    <p className="text-[16px] leading-[1.6] text-[var(--text-muted)] mb-4">
                      {post.summary}
                    </p>
                    <span className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--accent)] group-hover:text-[var(--accent-soft)] transition-colors">
                      Read research <span aria-hidden="true">→</span>
                    </span>
                  </Card>
                </Link>
              ))}
            </StaggerReveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
