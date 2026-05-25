/**
 * B2 — Customer order history API
 * (Section 6 super-prompt 2026-05-22).
 *
 * GET /api/account/orders — returns the authenticated customer's
 * orders, newest first. The customer is identified by the
 * Supabase Auth session's email (set by the magic-link callback
 * route at /auth/callback). Returns 401 without a session.
 *
 * Stub-mode contract: when REQUIRE_SUPABASE=false, returns 503 +
 * `{ ok: false, code: "supabase_unavailable" }` so the client
 * UI can render a "Supabase isn't configured" message instead of
 * an empty list.
 */
import { NextResponse, type NextRequest } from "next/server";
import { extractAuthenticatedUser } from "@/lib/auth/extract-user";
import { serviceSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Phase 2A4 — accept both cookie + Authorization Bearer auth. Browser
  // supabase-js stores the session in localStorage (not cookies), so the
  // client must forward the access token as a Bearer header. The cookie
  // path stays for any server-side caller using @supabase/ssr.
  const result = await extractAuthenticatedUser(request);
  const code =
    result.kind === "ok"
      ? "ok"
      : result.kind === "supabase_unavailable"
        ? "supabase_unavailable"
        : "no_session";
  const email = result.kind === "ok" ? result.user.email : null;
  if (code === "supabase_unavailable") {
    return NextResponse.json(
      { ok: false, code: "supabase_unavailable", orders: [] },
      { status: 503 },
    );
  }
  if (code === "no_session" || !email) {
    return NextResponse.json(
      { ok: false, code: "unauthorized", orders: [] },
      { status: 401 },
    );
  }

  const supabase = serviceSupabase()!;
  // P0-2 (PR #35 codex finding): the orders table has NO `items`
  // column. Line items live on the dedicated `order_items` table per
  // `supabase/migrations/20260510000001_init.sql:229-239`. Use
  // PostgREST's FK-embedded select syntax to inline order_items, then
  // transform server-side so the API contract (`items: [{name, qty}]`)
  // stays unchanged for the OrdersList client.
  const { data, error } = await supabase
    .from("orders")
    .select(
      "display_id, total_cents, status, payment_provider, placed_at, shipped_at, tracking_number, carrier, order_items(name_snapshot, quantity)",
    )
    .eq("email", email)
    .order("placed_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      { ok: false, code: "db_error", message: error.message, orders: [] },
      { status: 500 },
    );
  }

  type OrderRow = {
    display_id: string;
    total_cents: number;
    status: string;
    payment_provider: string;
    placed_at: string;
    shipped_at: string | null;
    tracking_number: string | null;
    carrier: string | null;
    order_items?: Array<{ name_snapshot: string; quantity: number }> | null;
  };
  const orders = ((data ?? []) as OrderRow[]).map((row) => ({
    display_id: row.display_id,
    total_cents: row.total_cents,
    status: row.status,
    payment_provider: row.payment_provider,
    placed_at: row.placed_at,
    shipped_at: row.shipped_at,
    tracking_number: row.tracking_number,
    carrier: row.carrier,
    items: (row.order_items ?? []).map((item) => ({
      name: item.name_snapshot,
      qty: item.quantity,
    })),
  }));

  return NextResponse.json({ ok: true, orders }, { status: 200 });
}
