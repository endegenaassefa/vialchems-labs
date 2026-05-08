/**
 * Lab Partner page — explains testing methodology and links to the
 * third-party portal at janoshik.com (Appendix R).
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { siteConfig } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Tested by Janoshik Analytical',
  description:
    'Per-batch HPLC purity, USP <71> sterility, and LAL endotoxin testing by independent third-party laboratory Janoshik Analytical. Batch-lot transparency.',
};

export default function TestReportsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              Quality / Lab Partner
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-8">
              <span className="block">Tested by</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                {siteConfig.labPartner.name}.
              </span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              Every batch we ship is tested by an independent third-party laboratory
              before it leaves the warehouse. The full Certificate of Analysis,
              including raw chromatograms when available, is published on the COA
              library and linked from each product page.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/coa"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-[var(--radius-full)] bg-[var(--accent)] text-[var(--bg)] font-medium text-[15px] hover:bg-[var(--accent-soft)] transition-colors"
              >
                Browse COAs
              </Link>
              <a
                href={siteConfig.labPartner.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[15px] transition-colors"
              >
                {siteConfig.labPartner.name} portal ↗
              </a>
            </div>
          </div>
        </section>

        {/* METHODOLOGY GRID */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-20 grid gap-10 md:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                01 / Identity + Purity
              </p>
              <h2 className="text-[24px] font-medium leading-tight mb-3">
                HPLC area-percent
              </h2>
              <p className="text-[15px] text-[var(--text-muted)] leading-[1.65]">
                Reverse-phase HPLC with UV detection at 220nm. Area-percent purity
                quantifies the test article relative to all detected peaks within
                the chromatographic window. Industry-standard primary identity
                confirmation; mass spectrometry available on request.
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                02 / Sterility
              </p>
              <h2 className="text-[24px] font-medium leading-tight mb-3">
                USP &lt;71&gt;
              </h2>
              <p className="text-[15px] text-[var(--text-muted)] leading-[1.65]">
                United States Pharmacopeia chapter 71 sterility — broth-based growth
                assay. Test articles inoculated into Fluid Thioglycollate Medium and
                Soybean-Casein Digest Medium, incubated 14 days, evaluated for
                turbidity. PASS/FAIL result reported per batch.
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                03 / Endotoxin
              </p>
              <h2 className="text-[24px] font-medium leading-tight mb-3">
                LAL gel-clot
              </h2>
              <p className="text-[15px] text-[var(--text-muted)] leading-[1.65]">
                Limulus Amebocyte Lysate gel-clot assay quantifies bacterial
                endotoxin in EU/mg. Reported as a numeric concentration with the
                assay sensitivity limit, allowing direct comparison across batches
                and against laboratory thresholds.
              </p>
            </div>
          </div>
        </section>

        {/* TRANSPARENCY */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              04 / Batch-lot transparency
            </p>
            <h2 className="text-[32px] md:text-[40px] font-light leading-tight tracking-tight text-[var(--text)] mb-8">
              The number on the vial is the number on the COA.
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.65] text-[var(--text-muted)]">
              <p>
                Every vial carries a batch number that resolves to a published
                Certificate of Analysis. The same number appears on the order
                confirmation, the shipping manifest, and the lab&apos;s third-party
                portal. There is no two-tier system — no &quot;test articles&quot; that
                differ from sale articles, no aggregated lot reports that combine
                multiple production runs.
              </p>
              <p>
                Approximately 11% of the 1,500+ vendor universe publishes
                independent third-party COAs. We publish on every batch. Coverage,
                not occasional spot-checks, is the operational difference.
              </p>
            </div>
          </div>
        </section>

        {/* PORTAL LINK */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              05 / Verify at source
            </p>
            <h2 className="text-[32px] md:text-[40px] font-light leading-tight tracking-tight text-[var(--text)] mb-8">
              Independent verification.
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.65] text-[var(--text-muted)]">
              <p>
                {siteConfig.labPartner.name} maintains a public-facing portal where
                each batch report can be retrieved directly from the laboratory
                without going through the brand. Verifying the COA at source is
                what makes the report independent.
              </p>
              <a
                href={siteConfig.labPartner.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 font-mono text-[14px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
              >
                {siteConfig.labPartner.portalUrl} ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
