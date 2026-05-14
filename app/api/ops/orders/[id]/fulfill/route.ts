import { NextResponse } from "next/server";
import { z } from "zod";
import { assertOpsToken, getOpsActor, jsonError } from "@/lib/ops/auth";
import { transitionStatus } from "@/lib/ops/orders";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/ops/orders/[id]/fulfill
// Body: { expectedStatus: "paid", reason?: string }
//
// Moves an order from paid → fulfilled. Optimistic-lock on expectedStatus
// to prevent two staff from double-marking.

const bodySchema = z.object({
  expectedStatus: z.literal("paid"),
  reason: z.string().trim().max(500).optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const authError = assertOpsToken(request);
  if (authError) return authError;
  const { id } = await context.params;
  const actor = getOpsActor(request);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError("invalid_body", 400, parsed.error.message);
  }

  let supabase;
  try {
    supabase = serviceSupabase();
  } catch (error) {
    return jsonError("supabase_not_configured", 503, (error as Error).message);
  }
  if (!supabase) return jsonError("supabase_not_configured", 503);

  try {
    const order = await transitionStatus(supabase, {
      orderId: id,
      expectedStatus: "paid",
      targetStatus: "fulfilled",
      actor,
      reason: parsed.data.reason,
    });
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    const message = (error as Error).message;
    const status = message === "stale_status" ? 409 : 400;
    return jsonError("fulfill_failed", status, message);
  }
}
