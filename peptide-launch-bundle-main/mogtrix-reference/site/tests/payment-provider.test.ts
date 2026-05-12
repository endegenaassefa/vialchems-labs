import { describe, expect, it } from "vitest";

import { getPaymentAdapter } from "@/lib/payments";

describe("payment provider resolution", () => {
  it("fails closed outside local development when Stripe is not configured", () => {
    expect(() =>
      getPaymentAdapter({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://mogtrix.bio"
      } as NodeJS.ProcessEnv)
    ).toThrow(/stripe/i);
  });

  it("keeps stub payments available for explicit local development", async () => {
    const adapter = getPaymentAdapter({
      NODE_ENV: "development",
      PAYMENT_PROVIDER: "stub",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000"
    } as NodeJS.ProcessEnv);

    await expect(
      adapter.createHostedPaymentSession({
        amountCents: 4900,
        currency: "usd",
        orderId: "ord_local",
        customerEmail: "lead@example.com"
      })
    ).resolves.toMatchObject({
      provider: "stub",
      status: "payment_requested"
    });
  });
});
