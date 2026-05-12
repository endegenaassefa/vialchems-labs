/**
 * Order detail (public-by-link) — /order/[id].
 *
 * Phase 5: stub. Real implementation reads from Supabase orders + lines tables
 * with a row-level token check (Phase 9). For now: client-side reads the most
 * recent order from sessionStorage and falls back to a "no order on file"
 * empty state.
 */
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { OrderDetailIsland } from "./OrderDetailIsland";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
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
              Order detail
            </p>
            <h1 className="text-[32px] md:text-[40px] font-light tracking-tight text-[var(--text)]">
              {id}
            </h1>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-12">
            <OrderDetailIsland expectedId={id} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
