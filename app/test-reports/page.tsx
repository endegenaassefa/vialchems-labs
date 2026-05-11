/**
 * Lab / Test methodology page — v1.3 lab-agnostic.
 *
 * v1.3 operator override: removed all references to specific named labs
 * (previously "Janoshik Analytical"). Site now presents testing as
 * "independently / third-party verified" without naming the lab. The actual
 * contractual partner is operator-side / private. Iron Law 2.26 — operator
 * authorized.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { buttonClassNames } from '@/components/ui/Button';
import { ComparativeTable } from '@/components/ui/ComparativeTable';
import { ProcessFlow } from '@/components/ui/ProcessFlow';

export const metadata: Metadata = {
  title: 'Independently tested · Testing standard',
  description:
    'HPLC purity, USP <71> sterility, and LAL endotoxin testing through an independent third-party laboratory. Batch-lot transparency and the vialchemlabs testing standard.',
};

const STANDARD_ROWS = [
  {
    label: 'Identity & purity',
    industry:
      'In-house HPLC where reported, methodology often unstated, sometimes self-attested without independent verification.',
    vialchemlabs:
      'Reverse-phase HPLC area-percent at 220nm through an independent third-party laboratory. Mass spectrometry available on request.',
  },
  {
    label: 'Sterility',
    industry:
      'Rarely reported on research-grade peptides; when reported, often as a single PASS/FAIL with no methodology cited.',
    vialchemlabs:
      'USP <71> broth-based growth assay (Fluid Thioglycollate + Soybean-Casein Digest). 14-day incubation. PASS/FAIL reporting.',
  },
  {
    label: 'Endotoxin',
    industry:
      'Almost never reported; when reported, often a single threshold number without methodology.',
    vialchemlabs:
      'Limulus Amebocyte Lysate gel-clot in EU/mg, with assay sensitivity limit so values are comparable.',
  },
  {
    label: 'Batch traceability',
    industry:
      'Mixed; aggregated lot reports common; the number on the vial sometimes does not resolve to a specific COA.',
    vialchemlabs:
      'The number on the vial resolves to a published COA, the order confirmation, and the shipping manifest.',
  },
];

const TESTING_STEPS = [
  {
    n: 1,
    title: 'Sample drawn',
    description:
      'Sample drawn under chain-of-custody at the warehouse and shipped to the independent third-party lab.',
  },
  {
    n: 2,
    title: 'Identity + purity',
    description:
      'Reverse-phase HPLC area-percent purity at 220nm. Industry-standard primary identity confirmation.',
  },
  {
    n: 3,
    title: 'Sterility',
    description:
      'USP <71> broth-based growth assay. Test articles inoculated, incubated 14 days, evaluated for turbidity.',
  },
  {
    n: 4,
    title: 'Endotoxin',
    description:
      'LAL gel-clot quantifying bacterial endotoxin in EU/mg. Numeric concentration with assay sensitivity limit.',
  },
  {
    n: 5,
    title: 'COA published',
    description:
      'Certificate of Analysis posted to /coa with batch number, test date, and methodology so the data is on file.',
  },
];

export default function TestReportsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO — technical-stat composition. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-10">
              T E S T I N G · S T A N D A R D
            </p>
            <h1 className="text-[clamp(40px,5.6vw,80px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-12 max-w-4xl">
              <span className="block">Independently</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                tested.
              </span>
            </h1>
            <div className="grid gap-10 md:grid-cols-[2fr_1fr] items-end">
              <p className="text-[clamp(18px,2vw,22px)] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
                vialchemlabs runs an independent third-party testing
                program — HPLC purity, USP &lt;71&gt; sterility, and LAL
                endotoxin — and publishes the Certificate of Analysis
                alongside the product so the data is on the table.
              </p>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)] leading-relaxed border-l border-[var(--border-strong)] pl-5">
                <p className="text-[var(--accent)] mb-1">Industry context</p>
                <p className="text-[var(--text)]">Independent third-party COAs</p>
                <p className="mt-1">≈ 11% of vendors publish them</p>
                <p className="text-[var(--text-subtle)]">(per 1,500-vendor research)</p>
              </div>
            </div>
            <div className="mt-14 flex flex-wrap gap-3">
              <Link href="/coa" className={buttonClassNames('primary', 'lg')}>
                Browse COAs
              </Link>
              <Link href="/about" className={buttonClassNames('outline', 'lg')}>
                About the standard
              </Link>
            </div>
          </div>
        </section>

        {/* COMPARATIVE TABLE */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              S I D E · B Y · S I D E
            </p>
            <h2 className="text-[clamp(32px,4vw,52px)] font-light leading-[1.1] tracking-tight text-[var(--text)] mb-12 max-w-3xl">
              The four dimensions, side by side.
            </h2>
            <ComparativeTable rows={STANDARD_ROWS} />
          </div>
        </section>

        {/* PROCESS FLOW */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
            <ProcessFlow
              eyebrow="Pipeline"
              headline="What happens to a batch sample between the warehouse and the COA library."
              steps={TESTING_STEPS}
              layout="vertical"
            />
          </div>
        </section>

        {/* TRANSPARENCY */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)] mb-6">
              B A T C H - L O T · T R A N S P A R E N C Y
            </p>
            <h2 className="text-[clamp(32px,4vw,48px)] font-light leading-[1.15] tracking-tight text-[var(--text)] mb-10">
              The number on the vial is the number on the COA.
            </h2>
            <div className="space-y-5 text-[16px] leading-[1.65] text-[var(--text-muted)]">
              <p>
                Each vial carries a batch number that resolves to a published
                Certificate of Analysis. The same number appears on the order
                confirmation and on the shipping manifest. No two-tier system —
                no &quot;test articles&quot; that differ from sale articles,
                no aggregated lot reports that combine multiple production
                runs.
              </p>
              <p>
                Approximately 11% of the 1,500+ vendor universe publishes
                independent third-party COAs at all. vialchemlabs operates
                an independent third-party testing program with the COA
                published alongside the product so the data is on the table —
                not behind a sales call.
              </p>
              <p>
                <Link
                  href="/coa"
                  className="inline-flex items-center gap-2 mt-4 font-mono text-[14px] uppercase tracking-[0.16em] text-[var(--accent)] hover:text-[var(--accent-soft)] transition-colors"
                >
                  Browse the COA library →
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
