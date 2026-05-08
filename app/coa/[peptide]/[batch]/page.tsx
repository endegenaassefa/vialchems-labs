/**
 * Per-batch COA detail page. Phase 5 renders structured data for the placeholder
 * batch and links to a placeholder PDF. The "EXAMPLE COA — REPLACE BEFORE
 * LAUNCH" notice is rendered prominently per the dispatch.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Pill } from '@/components/ui/Pill';
import { coaRecords, getCoa } from '@/lib/content/coa';

interface PageProps {
  params: Promise<{ peptide: string; batch: string }>;
}

export function generateStaticParams() {
  return coaRecords.map((r) => ({
    peptide: r.peptide,
    batch: r.batch,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { peptide, batch } = await params;
  const coa = getCoa(peptide, batch);
  if (!coa) return { title: 'COA not found' };
  return {
    title: `${coa.peptideName} · ${coa.batch}`,
    description: `Independent third-party Certificate of Analysis for ${coa.peptideName}, batch ${coa.batch}, tested by ${coa.lab}.`,
  };
}

export default async function CoaDetailPage({ params }: PageProps) {
  const { peptide, batch } = await params;
  const coa = getCoa(peptide, batch);
  if (!coa) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              <Link href="/coa" className="hover:text-[var(--accent-soft)]">
                ← All Certificates
              </Link>
            </p>
            <h1 className="text-[clamp(36px,5vw,60px)] font-light leading-[1.08] tracking-tight text-[var(--text)] mb-3">
              {coa.peptideName}
            </h1>
            <p className="font-mono text-[14px] text-[var(--text-muted)] mb-8">
              Batch {coa.batch} · Tested {coa.testDate}
            </p>

            <div
              role="note"
              aria-label="Placeholder notice"
              className="mb-10 rounded-[14px] border border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_8%,transparent)] px-6 py-5"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                Example COA — replace before launch
              </p>
              <p className="text-[14px] text-[var(--text)] leading-[1.6]">
                This record is a placeholder. The first production COA will replace
                this entry before public order acceptance. The route table is in shape
                today so internal linking is correct from day one.
              </p>
            </div>

            <dl className="rounded-[14px] border border-[var(--border)] divide-y divide-[var(--border)]">
              <Row label="Peptide" value={coa.peptideName} />
              <Row label="Batch" value={coa.batch} mono />
              <Row label="Test date" value={coa.testDate} mono />
              <Row label="Laboratory" value={coa.lab} />
              <Row
                label="HPLC purity"
                value={`${coa.hplcPurityPct.toFixed(1)}% (area-percent, UV 220nm)`}
                mono
              />
              <Row
                label="USP <71> sterility"
                value={coa.sterilityResult}
                mono
              />
              <Row
                label="LAL endotoxin"
                value={coa.endotoxinEU_per_mg}
                mono
              />
              <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Status
                </dt>
                <dd className="text-[14px]">
                  <Pill variant="accent">Verified</Pill>
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={coa.pdfPath}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-[var(--radius-full)] bg-[var(--accent)] text-[var(--bg)] font-medium text-[15px] hover:bg-[var(--accent-soft)] transition-colors"
              >
                Download PDF
              </a>
              <a
                href="https://janoshik.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-[var(--radius-full)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[15px] transition-colors"
              >
                Verify at Janoshik portal ↗
              </a>
            </div>

            <p className="mt-10 text-[13px] text-[var(--text-subtle)] leading-[1.6]">
              Test methodology: HPLC area-percent purity (reverse-phase, UV 220nm),
              USP &lt;71&gt; sterility (broth-based growth assay), and Limulus
              Amebocyte Lysate (LAL) gel-clot endotoxin. Test article retained for
              re-verification per laboratory standard practice.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </dt>
      <dd
        className={`text-[15px] text-[var(--text)] ${
          mono ? 'font-mono tabular' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
