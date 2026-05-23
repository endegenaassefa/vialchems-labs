/**
 * C2 — Operator order detail page
 * (Section 6 super-prompt 2026-05-22).
 *
 * Server component that renders the full order detail + an
 * `OperatorOrderActions` client island for the Mark-paid /
 * Mark-shipped / Add-note buttons. The auth-guard in
 * `app/operator/layout.tsx` ensures only operator sessions
 * reach this page.
 *
 * When Supabase isn't configured, renders the same stub-mode
 * banner pattern as the orders list — the page is reachable
 * without crashing.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceSupabase } from "@/lib/supabase";
import { OperatorOrderActions } from "./OperatorOrderActions";

export const dynamic = "force-dynamic";

interface OrderDetail {
  display_id: string;
  email: string;
  total_cents: number;
  status: string;
  payment_provider: string;
  placed_at: string;
  shipped_at?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
  operator_notes?: string | null;
  items?: { name: string; qty: number; unit_price_cents: number }[] | null;
}

async function loadOrder(id: string): Promise<{
  order: OrderDetail | null;
  source: "supabase" | "stub";
}> {
  const supabase = serviceSupabase();
  if (!supabase) return { order: null, source: "stub" };
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("display_id", id)
    .maybeSingle();
  if (error || !data) {
    return { order: null, source: "supabase" };
  }
  return { order: data as OrderDetail, source: "supabase" };
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default async function OperatorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id || !/^[A-Za-z0-9_-]{1,80}$/.test(id)) {
    notFound();
  }
  const { order, source } = await loadOrder(id);

  if (source === "stub") {
    return (
      <main>
        <Link
          href="/operator/orders"
          style={{ color: "var(--accent)", textDecoration: "underline" }}
        >
          ← All orders
        </Link>
        <h1 style={{ fontSize: 24, margin: "16px 0 12px" }}>{id}</h1>
        <div
          role="status"
          style={{
            padding: 16,
            border: "1px solid var(--warn)",
            borderRadius: "var(--r-md)",
            background: "var(--warn-soft)",
            color: "var(--warn)",
            fontSize: 13,
          }}
        >
          Supabase is not configured. The order detail and operator actions
          activate the moment the operator provisions REQUIRE_SUPABASE +
          NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY +
          SUPABASE_SERVICE_ROLE_KEY.
        </div>
      </main>
    );
  }

  if (!order) {
    notFound();
  }

  return (
    <main>
      <Link
        href="/operator/orders"
        style={{ color: "var(--accent)", textDecoration: "underline" }}
      >
        ← All orders
      </Link>

      <header style={{ margin: "16px 0 24px" }}>
        <h1
          style={{
            fontSize: 28,
            marginBottom: 4,
            fontFamily: "var(--font-mono)",
          }}
        >
          {order.display_id}
        </h1>
        <p style={{ color: "var(--fg-muted)", fontSize: 13 }}>
          {order.status} · {order.payment_provider} ·{" "}
          {formatPrice(order.total_cents)} · placed{" "}
          {formatDate(order.placed_at)}
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: 32,
          alignItems: "start",
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>Items</h2>
          {order.items && order.items.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--line)",
                    textAlign: "left",
                    fontSize: 11,
                    color: "var(--fg-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  <th style={{ padding: "6px 0" }}>Item</th>
                  <th style={{ padding: "6px 0" }}>Qty</th>
                  <th style={{ padding: "6px 0", textAlign: "right" }}>
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: "1px solid var(--line-faint)" }}
                  >
                    <td style={{ padding: "8px 0" }}>{item.name}</td>
                    <td style={{ padding: "8px 0" }}>{item.qty}</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>
                      {formatPrice(item.unit_price_cents * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "var(--fg-muted)", fontSize: 13 }}>
              No itemised data on this order record.
            </p>
          )}

          <h2 style={{ fontSize: 16, margin: "24px 0 12px" }}>Customer</h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
            {order.email}
          </p>

          <h2 style={{ fontSize: 16, margin: "24px 0 12px" }}>Shipping</h2>
          <dl
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "6px 16px",
            }}
          >
            <dt style={{ color: "var(--fg-muted)" }}>Carrier</dt>
            <dd>{order.carrier ?? "—"}</dd>
            <dt style={{ color: "var(--fg-muted)" }}>Tracking</dt>
            <dd>{order.tracking_number ?? "—"}</dd>
            <dt style={{ color: "var(--fg-muted)" }}>Shipped at</dt>
            <dd>{formatDate(order.shipped_at)}</dd>
          </dl>

          {order.operator_notes ? (
            <>
              <h2 style={{ fontSize: 16, margin: "24px 0 12px" }}>
                Operator notes
              </h2>
              <pre
                style={{
                  background: "var(--bg-sunken)",
                  padding: 12,
                  borderRadius: "var(--r-sm)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  whiteSpace: "pre-wrap",
                  margin: 0,
                }}
              >
                {order.operator_notes}
              </pre>
            </>
          ) : null}
        </div>

        <aside>
          <OperatorOrderActions
            displayId={order.display_id}
            status={order.status}
            paymentProvider={order.payment_provider}
            currentCarrier={order.carrier ?? null}
            currentTracking={order.tracking_number ?? null}
          />

          <h3
            style={{
              fontSize: 12,
              marginTop: 32,
              marginBottom: 8,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              color: "var(--fg-muted)",
            }}
          >
            Refunds
          </h3>
          <p
            style={{ fontSize: 12, lineHeight: 1.5, color: "var(--fg-muted)" }}
          >
            Refund flows live in the operator-runbook L1 section. Initiate from
            the rail-specific dashboard (BTCPay / bank Zelle / wallet), then
            send the customer confirmation manually until the operator UI lands
            a Refund button.
          </p>
        </aside>
      </section>
    </main>
  );
}
