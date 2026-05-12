import { describe, expect, it, vi } from "vitest";

import {
  buildOrderEmailJobs,
  parseOrderStaffEmails,
  sendOrderEmail
} from "@/lib/order-email";

const baseOrder = {
  id: "ord_test",
  status: "payment_requested",
  paymentStatus: "pending",
  totalCents: 16700,
  customerEmail: "lead@example.com",
  shippingName: "Research Lead",
  customerNextStep: "Complete your hosted payment to continue.",
  shipmentTrackingReference: null
} as const;

describe("order email helpers", () => {
  it("parses and normalizes staff recipients from env-style input", () => {
    expect(
      parseOrderStaffEmails("ops@mogtrix.bio, shipping@mogtrix.bio  , ops@mogtrix.bio")
    ).toEqual(["ops@mogtrix.bio", "shipping@mogtrix.bio"]);
  });

  it("builds customer and staff jobs for payment-requested orders", () => {
    const jobs = buildOrderEmailJobs("payment_requested", {
      ...baseOrder,
      staffEmails: ["ops@mogtrix.bio"]
    });

    expect(jobs).toHaveLength(2);
    expect(jobs[0]).toMatchObject({
      to: "lead@example.com",
      event: "payment_requested"
    });
    expect(jobs[1]).toMatchObject({
      to: "ops@mogtrix.bio",
      event: "payment_requested"
    });
    expect(jobs[0].subject).toMatch(/payment/i);
  });

  it("builds follow-up copy for payment failures and issue states", () => {
    const failedJobs = buildOrderEmailJobs("payment_failed", {
      ...baseOrder,
      status: "issue",
      paymentStatus: "failed",
      customerNextStep: "Retry payment from your order page."
    });
    const issueJobs = buildOrderEmailJobs("issue", {
      ...baseOrder,
      status: "issue",
      paymentStatus: "pending",
      customerNextStep: "Review the latest order update."
    });

    expect(failedJobs[0].subject).toMatch(/needs attention/i);
    expect(failedJobs[0].text).toMatch(/retry payment/i);
    expect(issueJobs[0].subject).toMatch(/needs follow-up/i);
    expect(issueJobs[0].text).toMatch(/latest order update/i);
  });

  it("uses the configured transport for every email job", async () => {
    const deliver = vi.fn().mockResolvedValue(undefined);

    await sendOrderEmail(
      "shipped",
      {
        ...baseOrder,
        status: "shipped",
        paymentStatus: "succeeded",
        shipmentTrackingReference: "1Z999AA10123456784",
        staffEmails: ["ops@mogtrix.bio"]
      },
      { deliver }
    );

    expect(deliver).toHaveBeenCalledTimes(2);
    expect(deliver).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "shipped",
        to: "lead@example.com"
      })
    );
  });
});
