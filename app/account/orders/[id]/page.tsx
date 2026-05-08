/**
 * Account-context order detail — /account/orders/[id].
 *
 * Same data shape as /order/[id] but in the account context: includes
 * cancel + refund-request stubs (Phase 9).
 */
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AccountOrderDetail } from './AccountOrderDetail';

export const dynamic = 'force-dynamic';

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
              Account / Orders / {id}
            </p>
            <h1 className="text-[32px] md:text-[40px] font-light tracking-tight text-[var(--text)]">
              Order detail
            </h1>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-12">
            <AccountOrderDetail expectedId={id} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
