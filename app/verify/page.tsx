import type { Metadata } from 'next';
import Link from 'next/link';
import { ClipboardCheck, FlaskConical, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { buttonClassNames } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Get Verified',
  description:
    'Researcher qualification and vial verification for vialchemlabs research products.',
};

const STEPS = [
  {
    icon: ClipboardCheck,
    title: 'Submit qualification',
    body: 'Create an account and provide the research-use context required before purchasing restricted laboratory materials.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance review',
    body: 'We review buyer details, shipping eligibility, and research-use acknowledgement before order access is approved.',
  },
  {
    icon: FlaskConical,
    title: 'Verify each vial',
    body: 'After purchase, match the lot code on the vial to the public COA record before it reaches the bench.',
  },
];

export default function VerifyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-28 md:grid-cols-[3fr_2fr] md:py-36">
            <div>
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                G E T · V E R I F I E D
              </p>
              <h1 className="mb-7 max-w-3xl text-[clamp(44px,6.5vw,88px)] font-light leading-[0.98] tracking-tight">
                Qualified research access. Batch-level vial verification.
              </h1>
              <p className="max-w-2xl text-[18px] leading-[1.65] text-[var(--text-secondary)]">
                vialchemlabs sells research materials only to qualified
                laboratory and analytical buyers. Verification keeps the buyer,
                the shipment, and the vial lot tied to the published COA.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/signup" className={buttonClassNames('primary', 'lg')}>
                  Start verification
                </Link>
                <Link href="/coa" className={buttonClassNames('outline', 'lg')}>
                  Verify a vial lot
                </Link>
              </div>
            </div>

            <Card className="border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-lg)]">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Required before order access
              </p>
              <dl className="space-y-5">
                {[
                  ['Age gate', '21+ only'],
                  ['Use case', 'Laboratory research only'],
                  ['Shipping', 'Eligible US jurisdictions'],
                  ['Lot check', 'COA before bench use'],
                ].map(([term, value]) => (
                  <div
                    key={term}
                    className="flex items-baseline justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {term}
                    </dt>
                    <dd className="text-right text-[15px] text-[var(--text-primary)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-5 md:grid-cols-3">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.title} className="p-6">
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className="mb-5 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    <h2 className="mb-3 text-[20px] font-medium tracking-tight text-[var(--text)]">
                      {step.title}
                    </h2>
                    <p className="text-[14px] leading-[1.65] text-[var(--text-muted)]">
                      {step.body}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
