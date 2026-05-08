import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { siteConfig } from '@/lib/content/site';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
                Research peptides · Per-batch independent COA
              </p>
              <h1 className="text-[clamp(48px,7vw,96px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-8">
                <span className="block">Counted, weighed,</span>
                <span className="font-serif-italic block text-[var(--accent-soft)]">verified.</span>
              </h1>
              <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl mb-10">
                {siteConfig.name} supplies a small catalog of research peptides with one
                differentiator: every batch is independently tested by{' '}
                <span className="text-[var(--text)]">{siteConfig.labPartner.name}</span>,
                and every Certificate of Analysis is published. No lifestyle imagery,
                no hype, no claims. Data, on file.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-[var(--radius-full)] bg-[var(--accent)] text-[var(--bg)] font-medium text-[15px] hover:bg-[var(--accent-soft)] transition-colors duration-[var(--dur-short)]"
                >
                  Browse Catalog
                </Link>
                <Link
                  href="/coa"
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[15px] transition-colors duration-[var(--dur-short)]"
                >
                  View Certificates of Analysis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* THESIS / What it means */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 md:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                01 / Tested
              </p>
              <h2 className="text-[24px] font-medium leading-tight mb-3">Per-batch HPLC</h2>
              <p className="text-[15px] text-[var(--text-muted)] leading-[1.6]">
                Every batch tested for purity (HPLC), sterility (USP &lt;71&gt;), and endotoxin
                (LAL). Independent third-party lab. PDF on the product page. Batch-lot traceable.
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                02 / Compliant
              </p>
              <h2 className="text-[24px] font-medium leading-tight mb-3">Research use only</h2>
              <p className="text-[15px] text-[var(--text-muted)] leading-[1.6]">
                Sold strictly for in-vitro laboratory and analytical purposes. Not for
                human or veterinary use. Buyer qualification required at first checkout.
                US shipping only at this time, with state-level restrictions.
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                03 / Focused
              </p>
              <h2 className="text-[24px] font-medium leading-tight mb-3">Seven peptides</h2>
              <p className="text-[15px] text-[var(--text-muted)] leading-[1.6]">
                BPC-157, TB-500, GHK-Cu, Ipamorelin, CJC-1295 (no DAC), MOTS-c, and Selank.
                Recovery, GH-axis, cosmetic-pathway, metabolic, and nootropic research
                pathways. Catalog stays small until a peptide can clear the verification bar.
              </p>
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                Recovery Stack
              </p>
              <p className="text-[20px] font-medium">BPC-157 10mg + TB-500 5mg</p>
              <p className="text-[14px] text-[var(--text-muted)]">12.5% effective discount vs à la carte.</p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono tabular text-[28px] font-semibold text-[var(--text)]">$77.00</span>
              <span className="font-mono text-[12px] text-[var(--text-subtle)] line-through">$88.00</span>
              <Link
                href="/products/recovery-stack"
                className="ml-3 inline-flex items-center gap-2 px-5 h-10 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[14px] transition-colors"
              >
                View
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
