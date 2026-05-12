import { describe, expect, it } from "vitest";

import { getPaymentEventOutcome } from "@/lib/payments/reconciliation";

describe("payment reconciliation", () => {
  it("moves requested orders to paid on a paid webhook event", () => {
    expect(
      getPaymentEventOutcome(
        {
          status: "payment_requested",
          paymentStatus: "pending"
        },
        {
          eventType: "payment.paid",
          providerStatus: "succeeded"
        }
      )
    ).toMatchObject({
      apply: true,
      nextStatus: "paid",
      nextPaymentStatus: "succeeded"
    });
  });

  it("keeps stale pending events from downgrading paid orders", () => {
    expect(
      getPaymentEventOutcome(
        {
          status: "paid",
          paymentStatus: "succeeded"
        },
        {
          eventType: "payment.pending",
          providerStatus: "pending"
        }
      )
    ).toMatchObject({
      apply: false,
      reason: "stale"
    });
  });

  it("pushes failed payments into an issue state with customer action required", () => {
    expect(
      getPaymentEventOutcome(
        {
          status: "payment_pending",
          paymentStatus: "pending"
        },
        {
          eventType: "payment.failed",
          providerStatus: "failed"
        }
      )
    ).toMatchObject({
      apply: true,
      nextStatus: "issue",
      nextPaymentStatus: "failed"
    });
  });
});
