import { NextResponse } from "next/server";
import { assertOpsToken, jsonError } from "@/lib/ops/auth";
import { listOrdersForOps } from "@/lib/ops/orders";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/ops/orders?status=paid&email=foo@bar.com&dateFrom=...&page=1&pageSize=50&includeTest=false
//
// Ops list view. Service role so RLS is bypassed (we want to see is_test
// rows when the staff toggles "Show test orders"). Default scope is
// production-only (includeTest=false).

export async function GET(request: Request): Promise<Response> {
  const authError = assertOpsToken(request);
  if (authError) return authError;

  const url = new URL(request.url);
  const params = url.searchParams;

  // Parse query params; listFilterSchema applies defaults + bounds.
  const filter: Record<string, unknown> = {};
  const status = params.get("status");
  if (status) filter.status = status;
  const email = params.get("email");
  if (email) filter.email = email;
  const dateFrom = params.get("dateFrom");
  if (dateFrom) filter.dateFrom = dateFrom;
  const dateTo = params.get("dateTo");
  if (dateTo) filter.dateTo = dateTo;
  const includeTest = params.get("includeTest");
  if (includeTest === "true") filter.includeTest = true;
  const page = params.get("page");
  if (page) filter.page = Number.parseInt(page, 10);
  const pageSize = params.get("pageSize");
  if (pageSize) filter.pageSize = Number.parseInt(pageSize, 10);

  let supabase;
  try {
    supabase = serviceSupabase();
  } catch (error) {
    return jsonError("supabase_not_configured", 503, (error as Error).message);
  }
  if (!supabase) {
    return jsonError(
      "supabase_not_configured",
      503,
      "Service-role Supabase access required for ops list view.",
    );
  }

  try {
    const result = await listOrdersForOps(supabase, filter);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return jsonError("orders_list_failed", 400, (error as Error).message);
  }
}
