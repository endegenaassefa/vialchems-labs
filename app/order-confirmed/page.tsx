import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buttonClassNames } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

type OrderConfirmedPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function sanitizeOrderReference(
  value: string | string[] | undefined,
): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^[A-Za-z0-9_-]{1,64}$/.test(raw)) return null;
  return raw;
}

export default async function OrderConfirmedPage({
  searchParams,
}: OrderConfirmedPageProps) {
  const params = await searchParams;
  const orderReference = sanitizeOrderReference(params.order);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
              Order confirmation
            </p>
            <h1 className="mb-4 text-[32px] font-light leading-tight tracking-tight text-[var(--text)] md:text-[44px]">
              Checkout received
            </h1>
            <p className="max-w-2xl text-[16px] leading-[1.6] text-[var(--text-muted)]">
              Your order is being processed by the selected payment system.
              Include the order reference below when contacting support.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-12">
            <Card variant="elevated" className="p-8">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Order reference
              </p>
              <p className="mb-6 font-mono text-[28px] font-semibold tabular-nums text-[var(--text)]">
                {orderReference ?? "Pending reference"}
              </p>
              <p className="max-w-2xl text-[14px] leading-[1.6] text-[var(--text-muted)]">
                A confirmation email will be sent after payment authorization
                and order-status processing. Include the order reference above
                when contacting support.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className={buttonClassNames("primary", "md")}
                >
                  Continue shopping
                </Link>
                <Link
                  href="/contact"
                  className={buttonClassNames("outline", "md")}
                >
                  Contact support
                </Link>
                <Link
                  href="/account/orders"
                  className={buttonClassNames("outline", "md")}
                >
                  Account orders
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
