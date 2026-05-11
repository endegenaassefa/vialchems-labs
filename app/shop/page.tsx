/**
 * Shop / Catalog index — Phase 5.
 *
 * Server component shell with metadata + a client-side ShopCatalog island that
 * handles search (Fuse.js), category filters, sort, and the in-stock toggle.
 *
 * Initial render is SSR-safe: the catalog list is the same product array
 * imported on both server and client; client-side state controls visibility
 * filters only.
 */
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { breadcrumbJsonLd, serializeJsonLdSafe } from '@/lib/seo/jsonLd';
import { siteConfig } from '@/lib/content/site';
import { bundles, products } from '@/lib/content/products';
import { ShopCatalog } from './ShopCatalog';

const productCount = products.length;
const stackCount = bundles.length;
const categoryCount = new Set(products.map((product) => product.category)).size;

export const metadata: Metadata = {
  title: 'Shop',
  description: `Research peptide catalog. ${productCount} SKUs across recovery, GH-axis, cosmetic-pathway, metabolic, nootropic, and immune research areas. Independent third-party Certificate of Analysis published alongside the product.`,
};

export default function ShopPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', url: `${siteConfig.url}/` },
    { name: 'Shop', url: `${siteConfig.url}/shop` },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLdSafe(breadcrumbLd) }}
      />
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="relative overflow-hidden border-b border-[var(--border)] bg-[linear-gradient(180deg,var(--surface),var(--bg))]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_72%_18%,black,transparent_62%)] bg-[linear-gradient(90deg,transparent_0_11%,color-mix(in_srgb,var(--text)_5%,transparent)_11%_11.08%,transparent_11.08%_100%),repeating-linear-gradient(0deg,transparent_0_31px,color-mix(in_srgb,var(--text)_4%,transparent)_31px_32px)]"
          />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-5">
              Catalog
            </p>
            <div className="grid gap-8 md:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] md:items-end">
              <div>
                <h1 className="text-[clamp(34px,5vw,64px)] font-semibold leading-[1.02] tracking-tight text-[var(--text)] max-w-3xl">
                  Research peptides with published batch documentation.
                </h1>
                <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-[var(--text-muted)]">
                  {productCount} SKUs and {stackCount} single-vial stacks, filtered by research area,
                  lot traceability, and Certificate of Analysis availability.
                </p>
              </div>
              <div className="grid grid-cols-3 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
                {[
                  { n: String(productCount).padStart(2, '0'), label: 'SKUs' },
                  { n: String(stackCount).padStart(2, '0'), label: 'Stacks' },
                  { n: String(categoryCount).padStart(2, '0'), label: 'Areas' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="border-r border-[var(--border)] px-4 py-4 last:border-r-0"
                  >
                    <p className="font-mono tabular text-[26px] font-semibold leading-none text-[var(--text)]">
                      {stat.n}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Catalog assurances">
              {[
                'COA-linked lots',
                'RUO documentation',
                'Qualification gated',
                'US dispatch',
              ].map((item) => (
                <li
                  key={item}
                  className="inline-flex min-h-8 items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_86%,transparent)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_16px_var(--accent-soft)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ShopCatalog />
      </main>
      <SiteFooter />
    </>
  );
}
