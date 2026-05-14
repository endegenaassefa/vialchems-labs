import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export const manualPaymentConfirmationSchema = z.object({
  displayId: z.string().trim().min(1),
  provider: z.literal("zelle"),
  actor: z.string().trim().min(1),
  note: z.string().trim().max(500).optional(),
  confirmedAt: z.string().datetime().optional(),
});

export type ManualPaymentConfirmationInput = z.infer<
  typeof manualPaymentConfirmationSchema
>;

export interface ManualPaymentConfirmationResult {
  ok: true;
  orderId: string;
  displayId: string;
  status: "paid";
  alreadyConfirmed: boolean;
}

interface DbError {
  message?: string;
}

interface DbResult {
  data?: unknown;
  error?: DbError | null;
}

interface ManualPaymentDb {
  rpc(functionName: string, args: Record<string, unknown>): Promise<DbResult>;
}

interface ManualPaymentConfirmationRow {
  order_id: string;
  display_id: string;
  status: "paid";
  already_confirmed: boolean;
}

export async function confirmManualPayment(
  supabase: SupabaseClient,
  input: ManualPaymentConfirmationInput,
): Promise<ManualPaymentConfirmationResult> {
  const parsed = manualPaymentConfirmationSchema.parse(input);
  const db = supabase as unknown as ManualPaymentDb;
  const confirmedAt = parsed.confirmedAt ?? new Date().toISOString();

  const result = await db.rpc("confirm_zelle_manual_payment", {
    p_display_id: parsed.displayId,
    p_actor: parsed.actor,
    p_note: parsed.note ?? null,
    p_confirmed_at: confirmedAt,
  });

  if (result.error) {
    throw new Error(
      `manual_payment_confirmation_failed: ${result.error.message ?? "unknown database error"}`,
    );
  }

  const row = Array.isArray(result.data)
    ? (result.data[0] as ManualPaymentConfirmationRow | undefined)
    : (result.data as ManualPaymentConfirmationRow | undefined);

  if (!row) {
    throw new Error("manual_payment_confirmation_empty_result");
  }

  return {
    ok: true,
    orderId: row.order_id,
    displayId: row.display_id,
    status: row.status,
    alreadyConfirmed: row.already_confirmed,
  };
}
