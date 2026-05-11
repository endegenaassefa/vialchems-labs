'use client';

/**
 * Affiliate Program signup. Client component for form interactivity.
 * Posts to /api/affiliate (Phase 7 wiring). For Phase 5, the submit handler
 * surfaces a success message client-side; the API route stub is intentionally
 * not yet wired (the form is functional without persistence).
 *
 * Commission table: 5% min / 10% median / 15% max. 90-day cookie. FTC
 * compliance reminder is rendered prominently.
 */
import { useState, type FormEvent } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';

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
        {/* v4 hero — varied. Affiliate uses a tier-emphasis hero (5/10/15)
            because that's the actual product. Pattern inspired by rogo.ai's
            metrics-first display. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-10">
              A F F I L I A T E · P R O G R A M
            </p>
            <div className="flex items-baseline gap-2 mb-10 flex-wrap">
              <p className="font-mono tabular text-[clamp(72px,11vw,144px)] leading-none font-light text-[var(--text)]">
                5
              </p>
              <p className="font-mono text-[clamp(36px,5vw,72px)] leading-none text-[var(--text-subtle)]">
                /
              </p>
              <p className="font-mono tabular text-[clamp(72px,11vw,144px)] leading-none font-light text-[var(--text)]">
                10
              </p>
              <p className="font-mono text-[clamp(36px,5vw,72px)] leading-none text-[var(--text-subtle)]">
                /
              </p>
              <p className="font-mono tabular text-[clamp(72px,11vw,144px)] leading-none font-light text-[var(--accent)]">
                15
              </p>
              <p className="font-mono text-[clamp(36px,5vw,56px)] leading-none text-[var(--text-muted)] ml-2">
                %
              </p>
            </div>
            <h1 className="text-[clamp(28px,3.2vw,40px)] font-light leading-[1.2] tracking-tight text-[var(--text)] max-w-2xl mb-8">
              Three commission tiers for content creators with audiences
              aligned to research-use-only laboratory content.
            </h1>
            <p className="text-[16px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              90-day cookie window · Paid monthly via ACH or crypto ·
              disclosure required on every link and video. Detail below.
            </p>
          </div>
        </section>

        {/* COMMISSION TABLE */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              Commission tiers
            </p>
            <Card variant="elevated" className="p-0 divide-y divide-[var(--border)]">
              <Tier
                tier="Tier 1 / Entry"
                rate="5%"
                criteria="All approved affiliates start here."
              />
              <Tier
                tier="Tier 2 / Performance"
                rate="10%"
                criteria="Consistent compliant content and at least 15 tracked conversions in a rolling quarter."
              />
              <Tier
                tier="Tier 3 / Top"
                rate="15%"
                criteria="Reserved for high-performing creators with repeat compliant posts, strong audience fit, and reliable conversion quality."
              />
            </Card>
            <p className="mt-6 text-[13px] text-[var(--text-subtle)] leading-[1.6]">
              Cookie window: 90 days from first click. Last-click attribution
              within the window. Commissions paid monthly via ACH or
              cryptocurrency. Disputed orders, returns, and chargebacks are
              netted against the next payment cycle.
            </p>
          </div>
        </section>

        {/* CREATOR SEEDING REQUIREMENTS */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-4">
              Creator seeding
            </p>
            <Card className="p-6">
              <h2 className="text-[24px] font-light leading-tight tracking-tight text-[var(--text)] mb-4">
                Sample orders are approved case by case.
              </h2>
              <p className="text-[14px] leading-[1.65] text-[var(--text-muted)] mb-5">
                Approved creators may receive a first sample order of up to two
                vials after signing a creator seeding agreement. Sample orders
                are for compliant content evaluation only and do not permit
                health, dosing, outcome, clinical, or human-use claims.
              </p>
              <ul className="grid gap-3 text-[14px] text-[var(--text-muted)] md:grid-cols-3">
                <li className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <span className="block font-mono text-[18px] text-[var(--text)]">
                    1,000+
                  </span>
                  minimum relevant followers
                </li>
                <li className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <span className="block font-mono text-[18px] text-[var(--text)]">
                    2,000+
                  </span>
                  typical views per video
                </li>
                <li className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <span className="block font-mono text-[18px] text-[var(--text)]">
                    Niche fit
                  </span>
                  research, lab, biohacking-adjacent, or analytical audiences
                </li>
              </ul>
            </Card>
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
                Affiliates and sample recipients must disclose the relationship clearly and
                conspicuously in any post, video, or page that includes a
                vialchemlabs link, per the FTC Endorsement Guides (16 CFR
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
                    placeholder="Followers/subscribers across relevant platforms"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="aff-views" required>
                  Typical video views
                </FieldLabel>
                <div className="mt-2">
                  <Input
                    id="aff-views"
                    name="views"
                    required
                    placeholder="Average views per recent video"
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
                <Toast
                  message="Application logged. The team will review and respond within five business days."
                  tone="success"
                  duration={6000}
                  onDismiss={() => setStatus('idle')}
                />
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
