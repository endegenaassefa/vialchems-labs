/**
 * Blog post dynamic route. Phase 5 renders any matching slug with placeholder
 * body copy. Phase 6 will replace this with rendered article content (MDX or
 * structured field) and citation footnotes.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { blogPosts, getBlogPostBySlug } from '@/lib/content/blog';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Article not found' };
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <article className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              <Link href="/blog" className="hover:text-[var(--accent-soft)]">
                ← Research Index
              </Link>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] mb-3">
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </p>
            <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.08] tracking-tight text-[var(--text)] mb-6">
              {post.title}
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] mb-12">
              {post.summary}
            </p>

            <div className="space-y-6 text-[16px] leading-[1.7] text-[var(--text-muted)]">
              <div className="rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                  Placeholder
                </p>
                <p className="text-[15px] text-[var(--text)]">
                  Article content lands in Phase 6. The full reference will run ≥1500
                  words with ≥5 scientific citations and pass the marketing-copy safety
                  filter at build time.
                </p>
              </div>
              <p>
                This page exists in the route table so internal linking, sitemap
                generation, and the Research Index listing are all in shape ahead of
                content drop. The dynamic route resolves any of the five Phase-5 stub
                slugs and 404s on anything else.
              </p>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
