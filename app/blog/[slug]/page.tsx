/**
 * Blog post dynamic route — Phase 6 long-form rendering.
 *
 * Renders structured post body (sections + paragraphs) and a citations
 * footnote block. No markdown parser is used; the data is already structured
 * in lib/content/blog.ts so the renderer can stay declarative and audited.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { blogPosts, getBlogPostBySlug } from '@/lib/content/blog';
import { siteConfig } from '@/lib/content/site';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  serializeJsonLdSafe,
} from '@/lib/seo/jsonLd';

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
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const articleLd = articleJsonLd(
    {
      slug: post.slug,
      title: post.title,
      summary: post.excerpt,
      publishedAt: post.publishedAt,
      author: post.author,
    },
    siteConfig.url,
  );
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', url: `${siteConfig.url}/` },
    { name: 'Research Index', url: `${siteConfig.url}/blog` },
    { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(breadcrumbLd) }}
      />
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
              <span className="mx-2 text-[var(--text-subtle)]">·</span>
              <span>{post.author}</span>
            </p>
            <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.08] tracking-tight text-[var(--text)] mb-6">
              {post.title}
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] mb-12">
              {post.excerpt}
            </p>

            <div className="space-y-10 text-[16px] leading-[1.7] text-[var(--text-muted)]">
              {post.sections.map((section, idx) => (
                <section key={idx} className="space-y-5">
                  {section.heading ? (
                    <h2 className="text-[22px] md:text-[26px] font-medium tracking-tight text-[var(--text)] mt-2">
                      {section.heading}
                    </h2>
                  ) : null}
                  {section.paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </section>
              ))}
            </div>

            <section className="mt-16 border-t border-[var(--border)] pt-10">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
                References
              </h2>
              <ol className="space-y-4 text-[14px] leading-[1.6] text-[var(--text-muted)]">
                {post.citations.map((citation, i) => (
                  <li key={citation.id} className="flex gap-3">
                    <span className="font-mono text-[12px] text-[var(--text-subtle)] shrink-0 w-6">
                      [{i + 1}]
                    </span>
                    <span>{citation.text}</span>
                  </li>
                ))}
              </ol>
            </section>

            <Card variant="elevated" className="mt-12 px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                Research-only positioning
              </p>
              <p className="text-[14px] leading-[1.6] text-[var(--text)]">
                This article is a research register for in-vitro and animal-model
                contexts. {siteConfig.name} supplies research reference materials
                with independent third-party Certificates of Analysis. See{' '}
                <Link href="/coa" className="text-[var(--accent)] hover:text-[var(--accent-soft)]">
                  /coa
                </Link>{' '}
                for the COA index.
              </p>
            </Card>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
