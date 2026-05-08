'use client';

/**
 * Affiliate Program signup. Client component for form interactivity.
 * Posts to /api/affiliate (Phase 7 wiring). For Phase 5, the submit handler
 * surfaces a success message client-side; the API route stub is intentionally
 * not yet wired (the form is functional without persistence).
 *
 * Commission table: 10% min / 15% median / 20% max. 90-day cookie. FTC
 * compliance reminder is rendered prominently.
 */
import { useState, type FormEvent } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';

type Status = 'idle' | 'submitting' | 'ok';

export default function AffiliatePage() {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    // Phase 5: client-only ack. Phase 7 will POST to /api/affiliate.
    await new Promise((r) => setTimeout(r, 250));
    e.currentTarget.reset();
    setStatus('ok');
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              Affiliate Program
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              <span className="block">For researchers</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">with audiences.</span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              Researchers and content creators in adjacent fields can apply to
              the Vialchems Labs affiliate program. Commissions are paid in USD
              to qualifying conversions tracked through a 90-day cookie window.
            </p>
          </div>
        </section>

        {/* COMMISSION TABLE */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              Commission tiers
            </p>
            <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
              <Tier
                tier="Tier 1 / Entry"
                rate="10%"
                criteria="All approved affiliates start here."
              />
              <Tier
                tier="Tier 2 / Performance"
                rate="15%"
                criteria="≥ 30 day-90 conversions sustained over a quarter."
              />
              <Tier
                tier="Tier 3 / Top"
                rate="20%"
                criteria="Negotiated; reserved for affiliates with consistent content output and audience alignment."
              />
            </div>
            <p className="mt-6 text-[13px] text-[var(--text-subtle)] leading-[1.6]">
              Cookie window: 90 days from first click. Last-click attribution
              within the window. Commissions paid monthly via ACH or
              cryptocurrency. Disputed orders, returns, and chargebacks are
              netted against the next payment cycle.
            </p>
          </div>
        </section>

        {/* FTC COMPLIANCE */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <div className="rounded-[14px] border border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_8%,transparent)] px-6 py-5">
              <div className="flex items-baseline gap-3 mb-3">
                <Pill variant="accent">FTC</Pill>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                  Disclosure required
                </p>
              </div>
              <p className="text-[14px] text-[var(--text)] leading-[1.6]">
                Affiliates must disclose the relationship clearly and
                conspicuously in any post, video, or page that includes a
                Vialchems Labs link, per the FTC Endorsement Guides (16 CFR
                Part 255). Affiliates may not make outcome, performance, or
                clinical-application claims about any product. Linking to
                product or COA pages is permitted; producing standalone
                editorial that describes a product is permitted only when
                consistent with the research-use-only framing of the source
                page.
              </p>
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              Apply
            </p>
            <h2 className="text-[28px] md:text-[32px] font-light leading-tight tracking-tight text-[var(--text)] mb-8">
              Tell us about your audience.
            </h2>

            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="aff-name" required>
                    Name
                  </FieldLabel>
                  <div className="mt-2">
                    <Input id="aff-name" name="name" required autoComplete="name" />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="aff-email" required>
                    Email
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="aff-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="aff-audience" required>
                  Audience size
                </FieldLabel>
                <div className="mt-2">
                  <Input
                    id="aff-audience"
                    name="audience"
                    required
                    placeholder="Total reach across platforms (number)"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="aff-handles" required>
                  Social handles
                </FieldLabel>
                <div className="mt-2">
                  <Input
                    id="aff-handles"
                    name="handles"
                    required
                    placeholder="@research-handle, youtube.com/@channel, …"
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="aff-focus" required>
                  Content focus
                </FieldLabel>
                <div className="mt-2">
                  <textarea
                    id="aff-focus"
                    name="focus"
                    required
                    rows={5}
                    placeholder="What you cover, who you reach, why your audience aligns with research-use-only content."
                    className="
                      w-full
                      bg-[var(--surface-strong)] text-[var(--text)]
                      placeholder:text-[var(--text-subtle)]
                      border border-[var(--border)] rounded-[10px]
                      px-3 py-3
                      text-[16px] leading-[1.5]
                      transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
                      hover:border-[var(--border-strong)]
                      focus-visible:outline-2 focus-visible:outline-[var(--accent)]
                      resize-y min-h-[120px]
                    "
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Review within five business days
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending…' : 'Apply'}
                </Button>
              </div>

              {status === 'ok' ? (
                <div
                  role="status"
                  className="rounded-[14px] border border-[var(--accent)] bg-[var(--surface)] px-6 py-5 text-[15px] text-[var(--text)]"
                >
                  Application logged. The team will review and respond within
                  five business days.
                </div>
              ) : null}
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Tier({
  tier,
  rate,
  criteria,
}: {
  tier: string;
  rate: string;
  criteria: string;
}) {
  return (
    <div className="px-6 py-5 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
      <div className="flex items-baseline gap-4">
        <span className="font-mono tabular text-[24px] font-semibold text-[var(--accent)]">
          {rate}
        </span>
        <span className="text-[15px] font-medium text-[var(--text)]">{tier}</span>
      </div>
      <p className="text-[14px] text-[var(--text-muted)] md:max-w-md">
        {criteria}
      </p>
    </div>
  );
}
