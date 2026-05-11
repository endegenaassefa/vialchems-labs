/**
 * Newsletter confirmation page. Reached after a user subscribes to the
 * newsletter; reminds them about the Reconstitution and Storage Guide and
 * the welcome promo code.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Pill } from '@/components/ui/Pill';
import { Card } from '@/components/ui/Card';
import { buttonClassNames } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Subscription confirmed',
  description:
    'Thank you for subscribing to vialchemlabs research updates. Your Reconstitution and Storage Guide PDF is in your inbox.',
};

export default function NewsletterThanksPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section>
          <div className="mx-auto max-w-3xl px-6 py-24 md:py-32 text-center">
            <div className="mb-8 inline-flex">
              <Pill variant="accent">Subscribed</Pill>
            </div>
            <h1 className="text-[clamp(40px,5.6vw,72px)] font-light leading-[1.05] tracking-tight text-[var(--text)] mb-6">
              <span className="block">You&apos;re on</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">the list.</span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] mx-auto max-w-xl mb-10">
              Check your inbox for the <em>Reconstitution and Storage Guide</em>{' '}
              PDF. We send research updates approximately twice a month, with no
              marketing fluff — operational notes, COA-publication summaries,
              and small-catalog updates.
            </p>

            <Card variant="elevated" className="px-6 py-8 text-left max-w-md mx-auto mb-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                Welcome offer
              </p>
              <p className="text-[14px] text-[var(--text-muted)] leading-[1.6] mb-4">
                Use this code at checkout for 15% off your first order:
              </p>
              <div className="flex items-center justify-center font-mono tabular text-[28px] font-semibold text-[var(--accent)] tracking-[0.06em] py-3 border border-dashed border-[var(--border-strong)] rounded-[10px]">
                WELCOME15
              </div>
            </Card>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/shop" className={buttonClassNames('primary', 'lg')}>
                Browse Catalog
              </Link>
              <Link href="/coa" className={buttonClassNames('outline', 'lg')}>
                View COAs
              </Link>
            </div>

            <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Counted, weighed, verified.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
