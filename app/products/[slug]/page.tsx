/**
 * Product Detail Page (PDP).
 *
 * Server component. Routes:
 *   /products/[slug]  matches the 7 SKU slugs + the Recovery Stack bundle slug.
 *
 * generateStaticParams pre-renders all 8 routes at build time.
 *
 * Anatomy (Phase 5 / SUPER_PROMPT_v3 §8):
 *   - Hero (Vial lg + name + sku)
 *   - Price strip + Add-to-Cart island
 *   - Tabs: Description / COA / Related (client tabs)
 *   - Disclaimer block (verbatim Appendix A.2)
 *   - Stack callout (BPC-157 / TB-500 → Recovery Stack)
 *
 * Phase 6 will replace `shortDescription` with the verbatim 336-345 word
 * descriptions from Appendix E.1; for now, shortDescription is the body.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Pill } from '@/components/ui/Pill';
import { Vial } from '@/components/ui/Vial';
import {
  bundles,
  formatPerMg,
  formatPrice,
  getBundleBySlug,
  getProductBySlug,
  productCategories,
  products,
  type Product,
} from '@/lib/content/products';
import { siteConfig } from '@/lib/content/site';
import { ProductTabs } from './ProductTabs';
import { AddToCartIsland } from './AddToCartIsland';

interface PdpParams {
  slug: string;
}

export function generateStaticParams(): PdpParams[] {
  return [
    ...products.map((p) => ({ slug: p.slug })),
    ...bundles.map((b) => ({ slug: b.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PdpParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const bundle = getBundleBySlug(slug);
  const target = product ?? bundle;
  if (!target) {
    return { title: 'Not found' };
  }
  const description =
    'shortDescription' in target
      ? target.shortDescription
      : (target as { description: string }).description;
  return {
    title: target.name,
    description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<PdpParams>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const bundle = getBundleBySlug(slug);

  if (!product && !bundle) {
    notFound();
  }

  if (bundle && !product) {
    return <BundleDetail slug={slug} />;
  }

  if (!product) {
    notFound();
  }

  const categoryLabel =
    productCategories.find((c) => c.id === product.category)?.label ??
    product.category;
  const showRecoveryStack =
    product.sku === 'BPC-157-10MG' || product.sku === 'TB-500-5MG';
  const recovery = bundles[0];

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid gap-12 md:grid-cols-[auto_1fr]">
            <div className="flex items-center justify-center md:justify-start">
              <Vial size="lg" sway aria-hidden="true" />
            </div>
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Pill variant="info">{categoryLabel}</Pill>
                <Pill variant="accent">In stock</Pill>
                <Pill variant="electric">RUO only</Pill>
              </div>
              <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-3">
                {product.name}
              </h1>
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-6">
                {product.sku} · {product.dose} · lyophilized vial
              </p>
              <p className="text-[16px] leading-[1.6] text-[var(--text-muted)] max-w-2xl">
                {product.shortDescription}
              </p>
            </div>
          </div>
        </section>

        {/* PRICE STRIP */}
        <section className="border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6 md:grid-cols-[2fr_3fr] items-center">
            <div className="flex items-baseline gap-4">
              <span className="font-mono tabular text-[40px] font-semibold text-[var(--text)] leading-none">
                {formatPrice(product.listPriceCents)}
              </span>
              <span className="font-mono text-[14px] text-[var(--text-muted)]">
                {formatPerMg(product.perMgCents)}
              </span>
            </div>
            <AddToCartIsland
              sku={product.sku}
              slug={product.slug}
              name={product.name}
              unitPriceCents={product.listPriceCents}
            />
          </div>
        </section>

        {/* TABS */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-16">
            <ProductTabs slug={product.slug} />
          </div>
        </section>

        {/* STACK CALLOUT */}
        {showRecoveryStack && (
          <section className="border-t border-[var(--border)] bg-[var(--surface-strong)]">
            <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                  Pair this with the Recovery Stack
                </p>
                <h3 className="text-[24px] font-medium tracking-tight text-[var(--text)] mb-2">
                  BPC-157 + TB-500 bundle
                </h3>
                <p className="text-[14px] text-[var(--text-muted)] max-w-xl leading-relaxed">
                  {recovery.description}
                </p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono tabular text-[24px] font-semibold text-[var(--text)]">
                  {formatPrice(recovery.listPriceCents)}
                </span>
                <Link
                  href={`/products/${recovery.slug}`}
                  className="ml-2 inline-flex items-center gap-2 px-5 h-10 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
                >
                  View bundle
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* DISCLAIMER (verbatim Appendix A.2 — LOCKED) */}
        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--surface)] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                Research use only
              </p>
              <p className="text-[14px] leading-[1.7] text-[var(--text-muted)]">
                For research use only. Not for human or veterinary use. These products
                are not intended for human dosing, injection, or ingestion. Bodily
                introduction of any kind into humans or animals is strictly forbidden
                by law.
              </p>
              <p className="mt-3 text-[12px] text-[var(--text-subtle)] font-mono">
                Lab partner: {siteConfig.labPartner.name}.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function BundleDetail({ slug }: { slug: string }) {
  const bundle = getBundleBySlug(slug);
  if (!bundle) notFound();

  const constituents: Product[] = bundle.constituents
    .map((sku) => products.find((p) => p.sku === sku))
    .filter((p): p is Product => Boolean(p));

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid gap-12 md:grid-cols-[auto_1fr]">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Vial size="lg" sway aria-hidden="true" />
              <Vial size="md" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Pill variant="accent">Bundle</Pill>
                <Pill variant="info">Recovery</Pill>
                <Pill variant="electric">RUO only</Pill>
              </div>
              <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-3">
                {bundle.name}
              </h1>
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-6">
                {bundle.sku} · {bundle.constituents.join(' + ')}
              </p>
              <p className="text-[16px] leading-[1.6] text-[var(--text-muted)] max-w-2xl">
                {bundle.description}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6 md:grid-cols-[2fr_3fr] items-center">
            <div className="flex items-baseline gap-4">
              <span className="font-mono tabular text-[40px] font-semibold text-[var(--text)] leading-none">
                {formatPrice(bundle.listPriceCents)}
              </span>
              <span className="font-mono text-[14px] text-[var(--text-muted)]">
                {bundle.effectiveDiscountPct}% off à la carte
              </span>
            </div>
            <AddToCartIsland
              sku={bundle.sku}
              slug={bundle.slug}
              name={bundle.name}
              unitPriceCents={bundle.listPriceCents}
            />
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              Bundle contents
            </p>
            <ul className="grid gap-6 sm:grid-cols-2">
              {constituents.map((c) => (
                <li
                  key={c.slug}
                  className="border border-[var(--border)] rounded-[var(--radius-lg)] p-5 bg-[var(--surface)]"
                >
                  <div className="flex items-center gap-4">
                    <Vial size="sm" aria-hidden="true" />
                    <div>
                      <h3 className="text-[16px] font-medium text-[var(--text)]">
                        {c.name}
                      </h3>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                        {c.sku}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.55] text-[var(--text-muted)]">
                    {c.shortDescription}
                  </p>
                  <Link
                    href={`/products/${c.slug}`}
                    className="mt-3 inline-flex font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)] hover:text-[var(--accent-soft)]"
                  >
                    View product →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--surface)] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                Research use only
              </p>
              <p className="text-[14px] leading-[1.7] text-[var(--text-muted)]">
                For research use only. Not for human or veterinary use. These products
                are not intended for human dosing, injection, or ingestion. Bodily
                introduction of any kind into humans or animals is strictly forbidden
                by law.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

