import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/payments/btcpay/status/route";

const originalEnv = {
  BTCPAY_SERVER_URL: process.env.BTCPAY_SERVER_URL,
  BTCPAY_API_KEY: process.env.BTCPAY_API_KEY,
  BTCPAY_STORE_ID: process.env.BTCPAY_STORE_ID,
  BTCPAY_WEBHOOK_SECRET: process.env.BTCPAY_WEBHOOK_SECRET,
};

function restoreEnv() {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

describe("GET /api/payments/btcpay/status", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    restoreEnv();
  });

  it("returns 503 without leaking secrets when BTCPay is unreachable", async () => {
    process.env.BTCPAY_SERVER_URL = "https://pay.example.com";
    process.env.BTCPAY_API_KEY = "secret_api_key";
    process.env.BTCPAY_STORE_ID = "store-1";
    process.env.BTCPAY_WEBHOOK_SECRET = "secret_webhook";
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      throw new Error("read ECONNRESET");
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toMatchObject({
      ok: false,
      reason: "network_error",
      reachable: false,
    });
    expect(JSON.stringify(body)).not.toContain("secret_api_key");
    expect(JSON.stringify(body)).not.toContain("secret_webhook");
  });
});
