/**
 * B2 — Customer single-order API
 * (Section 6 super-prompt 2026-05-22).
 *
 * GET /api/account/orders/[id] — returns one order if it belongs
 * to the authenticated customer; 404 if it exists but belongs to
 * someone else (prevents IDOR enumeration). 401 without a
 * session. 503 when Supabase isn't configured.
 */
import { NextResponse, type NextRequest } from "next/server";
import { extractAuthenticatedUser } from "@/lib/auth/extract-user";
import { serviceSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || !/^[A-Za-z0-9_-]{1,80}$/.test(id)) {
    return NextResponse.json(
      { ok: false, code: "invalid_id" },
      { status: 400 },
    );
  }

  // Phase 2A4 — same Bearer-or-cookie auth pattern as the list route.
  const userResult = await extractAuthenticatedUser(request);
  if (userResult.kind === "supabase_unavailable") {
    return NextResponse.json(
      { ok: false, code: "supabase_unavailable" },
      { status: 503 },
    );
  }
  if (userResult.kind !== "ok") {
    return NextResponse.json(
      { ok: false, code: "unauthorized" },
      { status: 401 },
    );
  }

  const supabase = serviceSupabase()!;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("display_id", id)
    .eq("email", userResult.user.email)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, code: "db_error", message: error.message },
      { status: 500 },
    );
  }
  if (!data) {
    // 404 rather than 403 so the customer can't enumerate other
    // customers' order ids by status-code differentiation.
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order: data }, { status: 200 });
}
