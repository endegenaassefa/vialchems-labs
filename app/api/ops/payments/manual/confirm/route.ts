import { NextResponse } from "next/server";
import {
  confirmManualPayment,
  manualPaymentConfirmationSchema,
} from "@/lib/ops/manual-payments";
import { assertOpsToken, jsonError } from "@/lib/ops/auth";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const authError = assertOpsToken(request);
  if (authError) return authError;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError("invalid_json", 400);
  }

  const parsed = manualPaymentConfirmationSchema.safeParse({
    ...(typeof raw === "object" && raw !== null ? raw : {}),
    actor:
      request.headers.get("x-ops-actor") ??
      (typeof raw === "object" && raw !== null && "actor" in raw
        ? (raw as { actor?: unknown }).actor
        : undefined) ??
      "ops-api",
    provider: "zelle",
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_manual_payment_confirmation",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

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
      "Manual payment confirmation requires Supabase service-role access.",
    );
  }

  try {
    const result = await confirmManualPayment(supabase, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(
      "manual_payment_confirmation_failed",
      400,
      (error as Error).message,
    );
  }
}
