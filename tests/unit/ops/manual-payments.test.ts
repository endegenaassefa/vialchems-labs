import { describe, expect, it } from "vitest";
import { confirmManualPayment } from "@/lib/ops/manual-payments";

function makeSupabase({
  alreadyConfirmed = false,
  error,
}: {
  alreadyConfirmed?: boolean;
  error?: { message: string };
} = {}) {
  const calls: { functionName: string; args: Record<string, unknown> }[] = [];
  return {
    client: {
      rpc: (functionName: string, args: Record<string, unknown>) => {
        calls.push({ functionName, args });
        return Promise.resolve(
          error
            ? { data: null, error }
            : {
                data: [
                  {
                    order_id: "order-db-1",
                    display_id: "VC-ABCD1234",
                    status: "paid",
                    already_confirmed: alreadyConfirmed,
                  },
                ],
                error: null,
              },
        );
      },
    } as never,
    calls,
  };
}

describe("confirmManualPayment", () => {
  it("confirms a pending Zelle order through the transactional RPC", async () => {
    const db = makeSupabase();

    const result = await confirmManualPayment(db.client, {
      displayId: "VC-ABCD1234",
      provider: "zelle",
      actor: "ops@example.com",
      note: "Matched bank receipt.",
    });

    expect(result).toEqual({
      ok: true,
      orderId: "order-db-1",
      displayId: "VC-ABCD1234",
      status: "paid",
      alreadyConfirmed: false,
    });
    expect(db.calls).toContainEqual({
      functionName: "confirm_zelle_manual_payment",
      args: expect.objectContaining({
        p_display_id: "VC-ABCD1234",
        p_actor: "ops@example.com",
        p_note: "Matched bank receipt.",
      }),
    });
  });

  it("is idempotent for an already-paid Zelle order", async () => {
    const db = makeSupabase({ alreadyConfirmed: true });

    const result = await confirmManualPayment(db.client, {
      displayId: "VC-ABCD1234",
      provider: "zelle",
      actor: "ops@example.com",
    });

    expect(result.alreadyConfirmed).toBe(true);
    expect(db.calls).toHaveLength(1);
  });

  it("surfaces database validation failures from the transactional RPC", async () => {
    const db = makeSupabase({
      error: { message: "manual_payment_provider_mismatch: order uses btcpay" },
    });

    await expect(
      confirmManualPayment(db.client, {
        displayId: "VC-ABCD1234",
        provider: "zelle",
        actor: "ops@example.com",
      }),
    ).rejects.toThrow(/manual_payment_provider_mismatch/);
  });
});
