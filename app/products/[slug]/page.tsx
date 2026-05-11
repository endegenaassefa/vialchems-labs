/**
 * Product Detail Page (PDP).
 *
 * Server component. Routes:
 *   /products/[slug]  matches the 16 SKU slugs + the 3 bundle slugs.
 *
 * generateStaticParams pre-renders all routes at build time.
 *
 * v4 layout overhaul (2026-05-10) — operator directive: match the
 * biocollexresearch.com PDP structure 1:1 in section ordering and copy
 * weight, while keeping the vialchemlabs Posture A dark theme + tokens.
 *
 * Anatomy (top to bottom):
 *   1. Breadcrumb (Back to shop)
 *   2. Two-column hero: vial gallery (left) + product info, price, badges,
 *      qty, Add-to-Cart (right)
 *   3. Trust strip (3 feature pills: 99%+ Purity, Same-day ship, Lab certified)
 *   4. Frequently researched together (anchor + 2 partners w/ checkbox bundle CTA)
 *   5. Research Use Only block (verbatim Appendix A.2)
 *   6. Certificate of Analysis block (with CTA to download)
 *   7. Important notice (lyophilized handling)
 *   8. Long description (rich text from Appendix E.1) + Specs sidebar
 *   9. Related products grid (6 cards)
 *  10. Footer
 */
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  FlaskConical,
  Download,
  Lock,
  BadgeCheck,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Pill } from '@/components/ui/Pill';
import { ProductStudioVisual } from '@/components/ui/ProductStudioVisual';
import { BundleStudioVisual } from '@/components/ui/BundleStudioVisual';
import { Card } from '@/components/ui/Card';
import { Specs } from '@/components/ui/Specs';
import { buttonClassNames } from '@/components/ui/Button';
import { coaRecords } from '@/lib/content/coa';
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
import { getProductDescription } from '@/lib/content/product-descriptions';
import { siteConfig } from '@/lib/content/site';
import {
  breadcrumbJsonLd,
  productJsonLd,
  serializeJsonLdSafe,
} from '@/lib/seo/jsonLd';
import { AddToCartIsland } from './AddToCartIsland';
import { FrequentlyTogetherIsland } from './FrequentlyTogetherIsland';

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

/** Pick two complementary SKUs for the "Frequently Together" rail.
 *  Strategy: prefer same-category siblings, fall back to adjacent categories. */
function pickPartners(product: Product): Product[] {
  const sameCat = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const others = products.filter(
    (p) => p.category !== product.category && p.slug !== product.slug,
  );
  return [...sameCat, ...others].slice(0, 2);
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
  const partners = pickPartners(product);
  const coa = coaRecords.find((r) => r.peptide === product.slug);
  const fullDescription = getProductDescription(product.sku);
  const paragraphs = fullDescription.split('\n\n').filter((p) => p.trim().length > 0);
  const related = products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      const aSame = a.category === product.category ? 0 : 1;
      const bSame = b.category === product.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, 6);

  const productLd = productJsonLd(
    {
      slug: product.slug,
      name: product.name,
      shortName: product.shortName,
      sku: product.sku,
      priceCents: product.listPriceCents,
      dose: product.dose,
      format: product.format,
      inStock: true,
      shortDescription: product.shortDescription,
      category: categoryLabel,
    },
    siteConfig.url,
  );
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', url: `${siteConfig.url}/` },
    { name: 'Shop', url: `${siteConfig.url}/shop` },
    { name: product.shortName, url: `${siteConfig.url}/products/${product.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(breadcrumbLd) }}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* 1. BREADCRUMB */}
        <div className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to shop
            </Link>
          </div>
        </div>

        {/* 2. TWO-COLUMN HERO — gallery + info */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 grid gap-12 md:grid-cols-[5fr_7fr]">
            {/* GALLERY — same label-matched product shot used by shop cards */}
            <div className="flex flex-col gap-4">
              <div className="w-full aspect-[3/4] rounded-[2px] border border-white/10 bg-black relative overflow-hidden shadow-[0_34px_80px_rgba(0,0,0,0.72)]">
                <ProductStudioVisual
                  product={product}
                  batch={coa?.batch ?? '2026-01'}
                  priority
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="absolute inset-0"
                  imageClassName="object-contain"
                />
              </div>

              {/* Thumbnail row — static black/silver product proof points */}
              <div
                className="grid grid-cols-4 gap-3"
                style={
                  {
                    '--proof-text-primary': '#ffffff',
                    '--proof-text-muted': 'rgba(255, 255, 255, 0.62)',
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  className="aspect-square rounded-[2px] border border-[var(--accent)] bg-black grid place-items-center overflow-hidden p-2 text-[var(--proof-text-primary)]"
                  aria-label="Vial — front view"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-center leading-tight text-[var(--proof-text-primary)]">
                    Photo<br/>view
                  </span>
                </button>
                <div className="aspect-square rounded-[2px] border border-[var(--border)] bg-black grid place-items-center text-[var(--proof-text-muted)]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-center leading-tight">
                    Front<br/>label
                  </span>
                </div>
                <div className="aspect-square rounded-[2px] border border-[var(--border)] bg-black grid place-items-center text-[var(--proof-text-muted)]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-center leading-tight">
                    QR<br/>verify
                  </span>
                </div>
                <div className="aspect-square rounded-[2px] border border-[var(--border)] bg-black grid place-items-center text-[var(--proof-text-muted)]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-center leading-tight">
                    COA<br/>scan
                  </span>
                </div>
              </div>
            </div>

            {/* INFO */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
                {categoryLabel} <span className="text-[var(--text-subtle)] mx-2">|</span>{' '}
                <span className="text-[var(--text-muted)]">99%+ Purity</span>
              </p>

              <h1 className="text-[clamp(36px,5vw,56px)] font-semibold leading-[1.05] tracking-tight text-[var(--text)] mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-mono tabular text-[40px] font-semibold text-[var(--text)] leading-none">
                  {formatPrice(product.listPriceCents)}
                </span>
                <span className="font-mono text-[14px] text-[var(--text-muted)]">
                  {formatPerMg(product.perMgCents)}
                </span>
              </div>

              <p className="text-[16px] leading-[1.65] text-[var(--text-muted)] max-w-2xl mb-7">
                {product.shortDescription}
              </p>

              {/* Trust strip — 3 feature stats (biocollex-style: dominant numbers,
                  small label below). Icon kept top-left as accent flag. */}
              <ul className="grid grid-cols-3 gap-3 mb-7" aria-label="Product guarantees">
                <li className="relative px-4 py-4 rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
                  <ShieldCheck
                    size={14}
                    strokeWidth={1.75}
                    className="absolute top-3 right-3 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <p className="text-[22px] font-semibold tracking-tight text-[var(--text)] leading-none mb-1">
                    99%+
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                    Purity (HPLC)
                  </p>
                </li>
                <li className="relative px-4 py-4 rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
                  <Truck
                    size={14}
                    strokeWidth={1.75}
                    className="absolute top-3 right-3 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <p className="text-[22px] font-semibold tracking-tight text-[var(--text)] leading-none mb-1">
                    Same-day
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                    US shipping
                  </p>
                </li>
                <li className="relative px-4 py-4 rounded-[12px] border border-[var(--border)] bg-[var(--surface)]">
                  <BadgeCheck
                    size={14}
                    strokeWidth={1.75}
                    className="absolute top-3 right-3 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <p className="text-[22px] font-semibold tracking-tight text-[var(--text)] leading-none mb-1">
                    Lab cert.
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                    3rd-party tested
                  </p>
                </li>
              </ul>

              {/* Quantity + Add to Cart */}
              <div className="mb-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                  {product.shortName} {product.dose} quantity
                </p>
                <AddToCartIsland
                  sku={product.sku}
                  slug={product.slug}
                  name={product.name}
                  unitPriceCents={product.listPriceCents}
                />
              </div>

              {/* Stock + meta */}
              <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-[var(--border)]">
                <Pill variant="accent">In stock</Pill>
                <Pill variant="electric">RUO only</Pill>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  SKU: {product.sku}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FREQUENTLY RESEARCHED TOGETHER */}
        <FrequentlyTogetherIsland anchor={product} partners={partners} />

        {/* 5 + 6. RESEARCH USE ONLY + COA — paired side-by-side */}
        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-14 grid gap-6 md:grid-cols-2">
            {/* RUO disclaimer */}
            <Card className="p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid place-items-center h-10 w-10 rounded-full bg-[color:color-mix(in_srgb,var(--pill-electric)_16%,transparent)] text-[var(--pill-electric)]">
                  <Lock size={18} strokeWidth={1.5} />
                </span>
                <h2 className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text)]">
                  Research use only
                </h2>
              </div>
              <p className="text-[14px] leading-[1.7] text-[var(--text-muted)]">
                {siteConfig.name} supplies research compounds exclusively for
                laboratory and scientific use. All materials are intended strictly
                for in&nbsp;vitro research, cell culture, and analytical reference
                — not for human dosing, injection, ingestion, or veterinary use.
                Bodily introduction of any kind into humans or animals is strictly
                forbidden by law.
              </p>
            </Card>

            {/* COA card */}
            <Card variant="elevated" className="p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid place-items-center h-10 w-10 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]">
                  <FlaskConical size={18} strokeWidth={1.5} />
                </span>
                <h2 className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text)]">
                  Certificate of analysis
                </h2>
              </div>
              <p className="text-[13px] leading-[1.6] text-[var(--text-muted)] mb-4">
                Third-party independently tested. Each batch passes reverse-phase
                HPLC, USP&nbsp;&lt;71&gt; sterility, and LAL endotoxin screens.
              </p>
              {coa ? (
                <>
                  <Specs
                    dense
                    items={[
                      { term: 'Latest batch', value: coa.batch },
                      { term: 'Test date', value: coa.testDate },
                      { term: 'HPLC purity', value: `${coa.hplcPurityPct}%` },
                      { term: 'Sterility (USP <71>)', value: coa.sterilityResult },
                      { term: 'Endotoxin (LAL)', value: coa.endotoxinEU_per_mg },
                    ]}
                    className="mb-5"
                  />
                  <Link
                    href={coa.pdfPath}
                    className={buttonClassNames('outline', 'md')}
                  >
                    <Download size={16} strokeWidth={1.75} />
                    View COA PDF
                  </Link>
                </>
              ) : (
                <p className="text-[13px] text-[var(--text-subtle)]">
                  Certificate of analysis pending for this batch.
                </p>
              )}
            </Card>
          </div>
        </section>

        {/* 7. IMPORTANT NOTICE */}
        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="rounded-[14px] border border-dashed border-[var(--border-strong)] bg-[color:color-mix(in_srgb,var(--accent)_4%,var(--surface))] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                Note
              </p>
              <p className="text-[14px] leading-[1.65] text-[var(--text-muted)]">
                Compounds are sold as individual lyophilized vials and do{' '}
                <span className="text-[var(--text)]">not</span> include
                bacteriostatic water, syringes, or any reconstitution supplies.
                Each product must be properly reconstituted prior to use in
                laboratory or research applications.
              </p>
            </div>
          </div>
        </section>

        {/* 8. LONG DESCRIPTION + SPECS SIDEBAR */}
        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-[3fr_2fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
                Description
              </p>
              <h2 className="text-[28px] font-semibold tracking-tight text-[var(--text)] mb-6">
                {product.shortName} research register
              </h2>
              <div className="space-y-5 text-[15px] leading-[1.7] text-[var(--text-muted)]">
                {paragraphs.map((para, i) => (
                  <p key={i} className={i === 0 ? 'text-[var(--text)] text-[16px]' : undefined}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <aside className="md:sticky md:top-24 md:self-start">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
                Specifications
              </p>
              <Card className="p-6">
                <Specs
                  items={[
                    { term: 'SKU', value: product.sku },
                    { term: 'Format', value: 'Lyophilized vial' },
                    { term: 'Dose', value: product.dose },
                    { term: 'Storage', value: '2-8 °C, sealed' },
                    { term: 'Reconstitution', value: 'Sterile BAC water' },
                    { term: 'Category', value: categoryLabel },
                    { term: 'List price', value: formatPrice(product.listPriceCents) },
                    { term: 'Per mg', value: formatPerMg(product.perMgCents) },
                  ]}
                />
              </Card>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                Independent lab partner: third-party verified
              </p>
            </aside>
          </div>
        </section>

        {/* 9. RELATED PRODUCTS GRID */}
        <section className="border-t border-[var(--border)] bg-[var(--surface-muted)]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                  Related products
                </p>
                <h2 className="text-[28px] font-semibold tracking-tight text-[var(--text)]">
                  Continue exploring the catalog
                </h2>
              </div>
              <Link
                href="/shop"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
              >
                View all →
              </Link>
            </div>
            <ul className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {related.map((p) => {
                const pCat =
                  productCategories.find((c) => c.id === p.category)?.label ??
                  p.category;
                return (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="group/product block h-full">
                      <Card variant="interactive" className="p-4 h-full flex flex-col">
                        <div className="aspect-[3/4] rounded-[6px] border border-[var(--border)] mb-4 overflow-hidden relative">
                          <ProductStudioVisual
                            product={p}
                            className="absolute inset-0"
                            sizes="(min-width: 1024px) 16vw, 45vw"
                            fallbackClassName="scale-[0.86]"
                          />
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-subtle)] mb-1">
                          {pCat}
                        </p>
                        <h3 className="text-[14px] font-medium text-[var(--text)] group-hover:text-[var(--accent-soft)] transition-colors leading-tight mb-1">
                          {p.shortName}
                        </h3>
                        <p className="font-mono text-[11px] text-[var(--text-subtle)] mb-3">
                          {p.dose}
                        </p>
                        <p className="font-mono tabular text-[15px] font-semibold text-[var(--text)] mt-auto">
                          {formatPrice(p.listPriceCents)}
                        </p>
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>
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

  const productLd = productJsonLd(
    {
      slug: bundle.slug,
      name: bundle.name,
      shortName: bundle.name,
      sku: bundle.sku,
      priceCents: bundle.listPriceCents,
      dose: bundle.constituents.join(' + '),
      format: 'bundle',
      inStock: true,
      shortDescription: bundle.description,
      category: 'Recovery bundle',
    },
    siteConfig.url,
  );
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', url: `${siteConfig.url}/` },
    { name: 'Shop', url: `${siteConfig.url}/shop` },
    { name: bundle.name, url: `${siteConfig.url}/products/${bundle.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(breadcrumbLd) }}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <div className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to shop
            </Link>
          </div>
        </div>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 grid gap-12 md:grid-cols-[5fr_7fr]">
            <BundleStudioVisual
              bundle={bundle}
              priority
              className="aspect-[4/3] rounded-[6px] border border-white/10 shadow-[0_34px_80px_rgba(0,0,0,0.72)]"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
                Research bundle <span className="text-[var(--text-subtle)] mx-2">|</span>{' '}
                <span className="text-[var(--text-muted)]">
                  {bundle.effectiveDiscountPct}% off à la carte
                </span>
              </p>
              <h1 className="text-[clamp(36px,5vw,56px)] font-semibold leading-[1.05] tracking-tight text-[var(--text)] mb-4">
                {bundle.name}
              </h1>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-mono tabular text-[40px] font-semibold text-[var(--text)] leading-none">
                  {formatPrice(bundle.listPriceCents)}
                </span>
                <span className="font-mono text-[14px] text-[var(--text-muted)]">
                  {bundle.constituents.join(' + ')}
                </span>
              </div>
              <p className="text-[16px] leading-[1.65] text-[var(--text-muted)] max-w-2xl mb-7">
                {bundle.description}
              </p>
              <div className="mb-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                  {bundle.name} quantity
                </p>
                <AddToCartIsland
                  sku={bundle.sku}
                  slug={bundle.slug}
                  name={bundle.name}
                  unitPriceCents={bundle.listPriceCents}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-[var(--border)]">
                <Pill variant="accent">Bundle</Pill>
                <Pill variant="electric">RUO only</Pill>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  SKU: {bundle.sku}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
              Bundle contents
            </p>
            <h2 className="text-[28px] font-semibold tracking-tight text-[var(--text)] mb-6">
              What&apos;s in the box
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {constituents.map((c) => (
                <li key={c.slug}>
                  <Card className="p-5 h-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-[4px] border border-white/10">
                        <ProductStudioVisual product={c} className="absolute inset-0" sizes="64px" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-medium text-[var(--text)]">
                          {c.name}
                        </h3>
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                          {c.sku}
                        </p>
                      </div>
                    </div>
                    <p className="text-[13px] leading-[1.6] text-[var(--text-muted)] mb-3">
                      {c.shortDescription}
                    </p>
                    <Link
                      href={`/products/${c.slug}`}
                      className="inline-flex font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)] hover:text-[var(--accent-soft)]"
                    >
                      View product →
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <Card className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                Research use only
              </p>
              <p className="text-[14px] leading-[1.7] text-[var(--text-muted)]">
                For research use only. Not for human or veterinary use. These
                products are not intended for human dosing, injection, or
                ingestion. Bodily introduction of any kind into humans or
                animals is strictly forbidden by law.
              </p>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
