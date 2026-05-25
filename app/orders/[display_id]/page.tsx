/**
 * Guest order view — /orders/[display_id]?token=...
 *
 * Server component. Validates an HMAC token from the email link, fetches the
 * order by display_id + verified email (no IDOR), and renders a read-only
 * receipt. No auth required — the token IS the auth grant for this one order.
 *
 * Token expired / invalid / missing → fresh-link form (inline /track-order
 * shortcut). Order not found → same UI (don't leak which case it was).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClassNames } from "@/components/ui/Button";
import { formatPrice } from "@/lib/content/products";
import { verifyOrderToken } from "@/lib/auth/order-token";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Your order — VialChem Labs",
  robots: { index: false, follow: false },
};

interface OrderRow {
  display_id: string;
  email: string;
  status: string;
  payment_provider: string;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  total_cents: number;
  placed_at: string;
  shipped_at: string | null;
  tracking_number: string | null;
  carrier: string | null;
  refunded_at: string | null;
  order_items: Array<{
    name_snapshot: string;
    quantity: number;
    unit_price_cents: number;
  }> | null;
}

function statusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Paid";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "refunded":
      return "Refunded";
    case "payment_rejected":
      return "Payment rejected";
    case "awaiting_payment":
      return "Awaiting payment";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function statusVariant(
  status: string,
): "accent" | "info" | "electric" | "error" {
  if (status === "paid" || status === "shipped" || status === "delivered")
    return "electric";
  if (
    status === "payment_rejected" ||
    status === "refunded" ||
    status === "cancelled"
  )
    return "error";
  return "accent";
}

function FreshLinkPrompt({ displayId }: { displayId: string }) {
  return (
    <Card variant="elevated" className="p-6 max-w-xl">
      <Pill variant="info">Link expired</Pill>
      <h2 className="mt-3 text-[22px] font-medium text-[var(--text)]">
        This link is no longer valid.
      </h2>
      <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-muted)]">
        Enter the email on this order and we&apos;ll send you a fresh link.
      </p>
      <div className="mt-5">
        <Link
          href={`/track-order?display_id=${encodeURIComponent(displayId)}`}
          className={buttonClassNames("primary", "md")}
        >
          Get a fresh link
        </Link>
      </div>
    </Card>
  );
}

export default async function GuestOrderViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ display_id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { display_id } = await params;
  const sp = await searchParams;
  const tokenRaw = sp?.token;
  const token = typeof tokenRaw === "string" ? tokenRaw : null;

  // Missing token → bounce to /track-order which preserves intent.
  if (!token) {
    redirect(`/track-order?display_id=${encodeURIComponent(display_id)}`);
  }

  const verified = verifyOrderToken(token);
  // Token doesn't match this display_id → render expired UI (don't leak).
  const tokenValid = verified !== null && verified.orderId === display_id;

  let order: OrderRow | null = null;
  if (tokenValid && verified) {
    const supabase = serviceSupabase();
    if (supabase) {
      // PII-minimised select: no shipping_address_snapshot. The guest
      // tokenized link is forwardable by design; we only expose what the
      // confirmation email already showed (status, items, totals, carrier
      // + tracking). Full address stays inside /account/orders/[id] which
      // requires a real Supabase session.
      const { data } = await supabase
        .from("orders")
        .select(
          "display_id, email, status, payment_provider, subtotal_cents, discount_cents, shipping_cents, total_cents, placed_at, shipped_at, tracking_number, carrier, refunded_at, order_items(name_snapshot, quantity, unit_price_cents)",
        )
        .eq("display_id", display_id)
        .eq("email", verified.email)
        .maybeSingle();
      order = (data as OrderRow | null) ?? null;
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-3">
              Order {display_id}
            </p>
            <h1 className="text-[32px] md:text-[40px] font-light tracking-tight text-[var(--text)]">
              Your order
            </h1>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
            {!tokenValid || !order ? (
              <FreshLinkPrompt displayId={display_id} />
            ) : (
              <>
                <Card className="p-6 flex flex-wrap items-center gap-4 justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-[14px] tabular text-[var(--text)]">
                      {order.display_id}
                    </p>
                    <p className="text-[13px] text-[var(--text-muted)] mt-1">
                      Placed{" "}
                      {new Date(order.placed_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {order.shipped_at ? (
                        <>
                          {" · Shipped "}
                          {new Date(order.shipped_at).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}
                        </>
                      ) : null}
                    </p>
                    {order.refunded_at ? (
                      <p className="text-[13px] text-[var(--text-muted)] mt-1">
                        Refunded{" "}
                        {new Date(order.refunded_at).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <Pill variant={statusVariant(order.status)}>
                      {statusLabel(order.status)}
                    </Pill>
                    <span className="font-mono tabular text-[18px] text-[var(--text)]">
                      {formatPrice(order.total_cents)}
                    </span>
                  </div>
                </Card>

                {order.tracking_number ? (
                  <Card className="p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                      Tracking
                    </p>
                    <p className="font-mono text-[15px] text-[var(--text)]">
                      {order.carrier ? `${order.carrier} · ` : ""}
                      {order.tracking_number}
                    </p>
                  </Card>
                ) : null}

                <Card className="p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-3">
                    Items
                  </p>
                  <ul className="space-y-3">
                    {(order.order_items ?? []).map((item, idx) => (
                      <li
                        key={`${item.name_snapshot}-${idx}`}
                        className="flex items-baseline justify-between gap-4"
                      >
                        <span className="text-[14px] text-[var(--text)]">
                          {item.name_snapshot}{" "}
                          <span className="text-[var(--text-muted)]">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="font-mono tabular text-[14px] text-[var(--text)]">
                          {formatPrice(item.unit_price_cents * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-[var(--border)] space-y-1">
                    <div className="flex justify-between font-mono text-[13px] text-[var(--text-muted)]">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal_cents)}</span>
                    </div>
                    {order.discount_cents > 0 ? (
                      <div className="flex justify-between font-mono text-[13px] text-[var(--text-muted)]">
                        <span>Discount</span>
                        <span>−{formatPrice(order.discount_cents)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between font-mono text-[13px] text-[var(--text-muted)]">
                      <span>Shipping</span>
                      <span>{formatPrice(order.shipping_cents)}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[15px] text-[var(--text)] pt-1">
                      <span>Total</span>
                      <span>{formatPrice(order.total_cents)}</span>
                    </div>
                  </div>
                </Card>

                <EmptyState
                  title="Need a hand?"
                  description="Reply to your confirmation email or write support@vialchemlabs.net with your order id. Sign in at vialchemlabs.net/login to see the full shipping address and account history."
                />
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
