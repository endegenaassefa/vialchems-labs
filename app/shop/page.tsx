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
import { ShopCatalog } from './ShopCatalog';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Research peptide catalog. Seven opening SKUs across recovery, GH-axis, cosmetic-pathway, metabolic, and nootropic research areas. Per-batch independent COA on every vial.',
};

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              Catalog / 7 SKUs + 1 bundle
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              <span className="block">Small catalog.</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">Deep transparency.</span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              Each opening SKU is a canonical research peptide. Each batch is independently
              tested for purity (HPLC), sterility (USP &lt;71&gt;), and endotoxin (LAL).
              Each Certificate of Analysis is published.
            </p>
          </div>
        </section>

        <ShopCatalog />
      </main>
      <SiteFooter />
    </>
  );
}
