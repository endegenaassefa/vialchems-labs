/**
 * Checkout step 3 — Review.
 *
 * Renders address, payment method, line items, totals. Includes the verbatim
 * 21+ age-gate checkbox + RUO acknowledgment (Appendix A.3).
 *
 * Submit triggers Phase 5 stub: navigates to /checkout/confirm with a fresh
 * uuid in sessionStorage. Real order placement (BTCPay invoice / Plaid token)
 * lands in Phase 7 (payments).
 */
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CheckoutGuard } from '@/components/CheckoutGuard';
import { CheckoutSteps } from '../CheckoutSteps';
import { ReviewPanel } from './ReviewPanel';

export const metadata: Metadata = {
  title: 'Checkout — Review',
};

export default function CheckoutReviewPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-4">
              Checkout
            </p>
            <h1 className="text-[32px] md:text-[40px] font-light leading-tight tracking-tight text-[var(--text)] mb-6">
              Review your order
            </h1>
            <CheckoutSteps active="review" />
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-12">
            <CheckoutGuard>
              <ReviewPanel />
            </CheckoutGuard>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
