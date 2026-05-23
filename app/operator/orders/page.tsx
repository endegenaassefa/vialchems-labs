/**
 * C1 — Operator orders dashboard
 * (Section 6 super-prompt 2026-05-22).
 *
 * Renders a table of orders with filter chips (status:
 * pending|paid|shipped|refunded) and a "newest first" default
 * sort. The auth-guard in `app/operator/layout.tsx` ensures this
 * route is only reachable for operator email sessions.
 *
 * When REQUIRE_SUPABASE=false (Day-1 default), the page renders
 * with an empty state + a "Supabase isn't configured" banner so
 * the operator knows what's blocking real data. The query path
 * is wired through `serviceSupabase()` so the moment env vars
 * land, the table populates from the orders table.
 */
import Link from "next/link";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "shipped"
  | "refunded"
  | "payment_rejected";

interface OrderRow {
  display_id: string;
  email: string;
  total_cents: number;
  status: OrderStatus;
  payment_provider: string;
  placed_at: string;
  shipped_at?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
}

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "awaiting_payment", label: "Awaiting payment" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "refunded", label: "Refunded" },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

async function loadOrders(status: string): Promise<{
  rows: OrderRow[];
  source: "supabase" | "stub";
}> {
  const supabase = serviceSupabase();
  if (!supabase) {
    return { rows: [], source: "stub" };
  }
  let query = supabase
    .from("orders")
    .select(
      "display_id, email, total_cents, status, payment_provider, placed_at, shipped_at, tracking_number, carrier",
    )
    .order("placed_at", { ascending: false })
    .limit(200);
  if (status !== "all") {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error || !data) {
    return { rows: [], source: "supabase" };
  }
  return { rows: data as OrderRow[], source: "supabase" };
}

export default async function OperatorOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawStatus = params.status;
  const status =
    typeof rawStatus === "string" &&
    STATUS_FILTERS.some((f) => f.value === rawStatus)
      ? rawStatus
      : "all";
  const { rows, source } = await loadOrders(status);

  return (
    <main>
      <header style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 28,
            marginBottom: 6,
            fontFamily: "var(--font-sans)",
          }}
        >
          Orders
        </h1>
        <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>
          {rows.length} order{rows.length === 1 ? "" : "s"} ·{" "}
          {source === "supabase" ? "live" : "stub mode"}
        </p>
      </header>

      {source === "stub" ? (
        <div
          role="status"
          style={{
            padding: 16,
            marginBottom: 24,
            border: "1px solid var(--warn)",
            borderRadius: "var(--r-md)",
            background: "var(--warn-soft)",
            color: "var(--warn)",
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          Supabase is not configured. Set <code>REQUIRE_SUPABASE=true</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel env vars to populate
          the order table from live data. The dashboard is otherwise wired
          end-to-end — no code change needed once env vars land.
        </div>
      ) : null}

      <nav
        aria-label="Filter orders by status"
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {STATUS_FILTERS.map((filter) => {
          const active = filter.value === status;
          return (
            <Link
              key={filter.value}
              href={
                filter.value === "all"
                  ? "/operator/orders"
                  : `/operator/orders?status=${filter.value}`
              }
              style={{
                padding: "6px 12px",
                borderRadius: "var(--r-pill)",
                border: `1px solid ${active ? "var(--accent)" : "var(--line)"}`,
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#ffffff" : "var(--fg-muted)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                textDecoration: "none",
              }}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      {rows.length === 0 ? (
        <p
          style={{
            padding: 32,
            border: "1px dashed var(--line-strong)",
            borderRadius: "var(--r-md)",
            color: "var(--fg-muted)",
            textAlign: "center",
            fontSize: 13,
          }}
        >
          No orders match this filter.
        </p>
      ) : (
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
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--fg-muted)",
              }}
            >
              <th style={{ padding: "10px 12px 10px 0" }}>Order</th>
              <th style={{ padding: "10px 12px" }}>Status</th>
              <th style={{ padding: "10px 12px" }}>Rail</th>
              <th style={{ padding: "10px 12px" }}>Total</th>
              <th style={{ padding: "10px 12px" }}>Customer</th>
              <th style={{ padding: "10px 12px" }}>Placed</th>
              <th style={{ padding: "10px 0 10px 12px" }}>Tracking</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.display_id}
                style={{ borderBottom: "1px solid var(--line-faint)" }}
              >
                <td style={{ padding: "10px 12px 10px 0" }}>
                  <Link
                    href={`/operator/orders/${encodeURIComponent(row.display_id)}`}
                    style={{ color: "var(--accent)", textDecoration: "none" }}
                  >
                    {row.display_id}
                  </Link>
                </td>
                <td style={{ padding: "10px 12px" }}>{row.status}</td>
                <td style={{ padding: "10px 12px" }}>{row.payment_provider}</td>
                <td style={{ padding: "10px 12px" }}>
                  {formatPrice(row.total_cents)}
                </td>
                <td style={{ padding: "10px 12px" }}>{row.email}</td>
                <td style={{ padding: "10px 12px" }}>
                  {formatDate(row.placed_at)}
                </td>
                <td style={{ padding: "10px 0 10px 12px" }}>
                  {row.tracking_number
                    ? `${row.carrier ?? "?"} ${row.tracking_number}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
