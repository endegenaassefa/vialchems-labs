'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/Button';

/**
 * Phase 7 (v4) — Newsletter form micro-interaction.
 *
 * Progressive enhancement:
 *   - The <form action="..." method="POST"> still posts natively without JS.
 *   - With JS, submit is intercepted; row collapses + success message fades in.
 *   - Reduced-motion (Iron Law 2.18) skips the visual transitions but the
 *     success state still appears.
 *
 * Server side: app/api/newsletter/subscribe/route.ts handles both fetch
 * (returns 200) and full-page submit (returns 303 redirect to
 * /newsletter/thanks). This component handles the fetch path; if fetch fails,
 * the form re-enables.
 */

type State = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterForm() {
  const reduced = useReducedMotion();
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'submitting' || state === 'success') return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    if (!email) return;

    setState('submitting');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 303 || res.status === 0) {
        setState('success');
      } else {
        setState('error');
        setErrorMsg(
          'We could not subscribe that email. Please check the address and try again.',
        );
      }
    } catch {
      setState('error');
      setErrorMsg('Network error. Please try again.');
    }
  }

  // Variants — collapse the form row vertically when success fires.
  const collapseDuration = reduced ? 0 : 0.32;
  const fadeDuration = reduced ? 0 : 0.4;

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        {state !== 'success' ? (
          <motion.form
            key="form"
            action="/api/newsletter/subscribe"
            method="POST"
            onSubmit={onSubmit}
            className="flex gap-2 max-w-sm"
            initial={false}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: collapseDuration },
            }}
            style={{ overflow: 'hidden' }}
          >
            <input
              type="email"
              name="email"
              required
              aria-label="Email address for newsletter"
              placeholder="research@example.com"
              disabled={state === 'submitting'}
              className="flex-1 h-10 px-3 rounded-[var(--radius-md)] bg-[var(--surface-strong)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] focus:outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={state === 'submitting'}
            >
              {state === 'submitting' ? 'Subscribing…' : 'Subscribe'}
            </Button>
          </motion.form>
        ) : (
          <motion.p
            key="success"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: fadeDuration }}
            className="font-mono text-[13px] text-[var(--accent)] py-2"
          >
            Subscribed. Check your inbox for the welcome email and 15% off
            promo code.
          </motion.p>
        )}
      </AnimatePresence>

      {errorMsg ? (
        <p
          role="alert"
          className="font-mono text-[12px] text-[var(--pill-error)] mt-2"
        >
          {errorMsg}
        </p>
      ) : null}
    </div>
  );
}
