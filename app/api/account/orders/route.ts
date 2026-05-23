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
import { cookies } from "next/headers";
import { serviceSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authenticatedEmail(): Promise<{
  email: string | null;
  code: "ok" | "no_session" | "supabase_unavailable";
}> {
  const supabase = serviceSupabase();
  if (!supabase) return { email: null, code: "supabase_unavailable" };
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;
  if (!token) return { email: null, code: "no_session" };
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) {
    return { email: null, code: "no_session" };
  }
  return { email: data.user.email, code: "ok" };
}

export async function GET(_request: NextRequest) {
  const { email, code } = await authenticatedEmail();
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
  const { data, error } = await supabase
    .from("orders")
    .select(
      "display_id, total_cents, status, payment_provider, placed_at, shipped_at, tracking_number, carrier, items",
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

  return NextResponse.json({ ok: true, orders: data ?? [] }, { status: 200 });
}
