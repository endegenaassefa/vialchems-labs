import { NextResponse } from "next/server";
import { assertOpsToken, jsonError } from "@/lib/ops/auth";
import { getOrderById } from "@/lib/ops/orders";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/ops/orders/[id] — order detail with items, payments, history.

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const authError = assertOpsToken(request);
  if (authError) return authError;

  const { id } = await context.params;

  let supabase;
  try {
    supabase = serviceSupabase();
  } catch (error) {
    return jsonError("supabase_not_configured", 503, (error as Error).message);
  }
  if (!supabase) {
    return jsonError("supabase_not_configured", 503);
  }

  try {
    const order = await getOrderById(supabase, id);
    if (!order) {
      return jsonError("order_not_found", 404);
    }
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return jsonError("order_detail_failed", 400, (error as Error).message);
  }
}
