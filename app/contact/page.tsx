'use client';

/**
 * Contact form. Posts to /api/contact (stub route — JSON ok).
 *
 * Per Iron Law 2.4: We do not respond to dosing questions. The disclaimer
 * is part of the page UI; the message-input placeholder reinforces it.
 *
 * Form submission is intentionally minimal — we render an in-page success
 * message rather than navigating away. No user-facing PII is logged client-side.
 */
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type Status = 'idle' | 'submitting' | 'ok' | 'error';

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      form.reset();
      setStatus('ok');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-6">
              Contact
            </p>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              <span className="block">One</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">business day.</span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              Operational, order, or COA questions reach the team within one business day.
              For Certificate of Analysis records, the full library is at{' '}
              <Link href="/coa" className="text-[var(--accent)] hover:text-[var(--accent-soft)]">/coa</Link>.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-16">
            <div className="mb-10 rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-5 text-[14px] text-[var(--text-muted)] leading-[1.6]">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                Scope
              </p>
              <p>
                We do not respond to dosing questions per Iron Law 2.4. Dosing for
                laboratory experimental design is at the discretion of the qualified
                researcher per their study protocol.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="contact-name" required>
                    Name
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Researcher name"
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="contact-email" required>
                    Email
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="research@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="contact-message" required>
                  Message
                </FieldLabel>
                <div className="mt-2">
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Order ID, COA batch number, or operational question."
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
                      resize-y min-h-[140px]
                    "
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Response within one business day
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send message'}
                </Button>
              </div>

              {status === 'ok' ? (
                <div
                  role="status"
                  className="rounded-[14px] border border-[var(--accent)] bg-[var(--surface)] px-6 py-5 text-[15px] text-[var(--text)]"
                >
                  Message logged. The team will respond within one business day.
                </div>
              ) : null}
              {status === 'error' ? (
                <div
                  role="alert"
                  className="rounded-[14px] border border-[var(--pill-error)] bg-[var(--surface)] px-6 py-5 text-[15px] text-[var(--text)]"
                >
                  Submission could not be transmitted. Please retry, or email{' '}
                  <a className="text-[var(--accent)]" href="mailto:research@vialchems.labs">
                    research@vialchems.labs
                  </a>
                  .
                  {errorMsg ? (
                    <span className="block font-mono text-[12px] text-[var(--text-subtle)] mt-2">
                      {errorMsg}
                    </span>
                  ) : null}
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
