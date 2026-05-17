import { describe, expect, it } from "vitest";
import { checkBitcoinCheckoutStatus } from "@/lib/payments/bitcoin-status";

const address = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080";

describe("checkBitcoinCheckoutStatus", () => {
  it("uses direct checkout when BTCPay is blocked and direct Bitcoin is configured", async () => {
    const status = await checkBitcoinCheckoutStatus({
      env: {
        BTCPAY_SERVER_URL: "https://blocked.example.test",
        BTCPAY_API_KEY: "api",
        BTCPAY_STORE_ID: "store",
        BTCPAY_WEBHOOK_SECRET: "secret",
        BITCOIN_DIRECT_CHECKOUT_ENABLED: "true",
        BITCOIN_RECEIVE_ADDRESS: address,
        BITCOIN_DIRECT_SIGNING_SECRET: "direct-secret",
      },
      fetchImpl: async () => {
        throw new Error("read ECONNRESET");
      },
    });

    expect(status).toMatchObject({
      ok: true,
      mode: "direct",
      btcpayReachable: false,
      directConfigured: true,
    });
  });

  it("stays unavailable when both BTCPay and direct Bitcoin are unavailable", async () => {
    const status = await checkBitcoinCheckoutStatus({
      env: {
        BTCPAY_SERVER_URL: "https://blocked.example.test",
        BTCPAY_API_KEY: "api",
        BTCPAY_STORE_ID: "store",
        BTCPAY_WEBHOOK_SECRET: "secret",
      },
      fetchImpl: async () => {
        throw new Error("read ECONNRESET");
      },
    });

    expect(status).toMatchObject({
      ok: false,
      mode: "unavailable",
      btcpayReachable: false,
      directConfigured: false,
    });
  });
});
