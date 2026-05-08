/**
 * Blog index — Phase 5 lists 5 placeholder posts. Phase 6 will replace
 * each with a ≥1500-word article + ≥5 scientific citations.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
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
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              Research Index
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              <span className="block">Reference,</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">not advice.</span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              Plain-language explainers for laboratory workflows. Reading a Certificate
              of Analysis. Storage and reconstitution conditions. HPLC purity. The
              difference between a vendor self-attestation and an independent-laboratory
              report. No outcome claims. Only references.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-16">
            <ul className="divide-y divide-[var(--border)]">
              {blogPosts.map((post) => (
                <li key={post.slug} className="py-8">
                  <article>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] mb-2">
                      <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    </p>
                    <h2 className="text-[24px] md:text-[28px] font-medium leading-tight tracking-tight text-[var(--text)] mb-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-[var(--accent-soft)] transition-colors duration-[var(--dur-short)]"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-[16px] leading-[1.6] text-[var(--text-muted)] mb-4">
                      {post.summary}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
                    >
                      Read research <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
