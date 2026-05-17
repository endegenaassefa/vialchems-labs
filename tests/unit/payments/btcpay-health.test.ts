import { describe, expect, it, vi, afterEach } from "vitest";
import { checkBtcpayHealth } from "@/lib/payments/btcpay-health";

const env = {
  BTCPAY_SERVER_URL: "https://pay.example.com",
  BTCPAY_API_KEY: "real_api_key",
  BTCPAY_STORE_ID: "store-1",
  BTCPAY_WEBHOOK_SECRET: "webhook-secret",
};

describe("checkBtcpayHealth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fails closed when credentials are missing", async () => {
    const result = await checkBtcpayHealth({
      env: { ...env, BTCPAY_API_KEY: "" },
    });

    expect(result).toMatchObject({
      ok: false,
      configured: false,
      reachable: false,
      reason: "missing_credential",
    });
    expect(result.message).toContain("BTCPAY_API_KEY");
  });

  it("passes when the configured store is reachable", async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify({ name: "vialchemlabs" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const result = await checkBtcpayHealth({
      env,
      fetchImpl: fetchMock,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://pay.example.com/api/v1/stores/store-1",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "token real_api_key",
        }),
      }),
    );
    expect(result).toMatchObject({
      ok: true,
      configured: true,
      reachable: true,
      reason: "ok",
      serverUrl: "https://pay.example.com",
      storeId: "store-1",
      storeName: "vialchemlabs",
    });
  });

  it("reports rejected API keys without exposing secrets", async () => {
    const result = await checkBtcpayHealth({
      env,
      fetchImpl: async () => new Response("Unauthorized", { status: 401 }),
    });

    expect(result).toMatchObject({
      ok: false,
      configured: true,
      reachable: true,
      reason: "api_rejected",
    });
    expect(JSON.stringify(result)).not.toContain(env.BTCPAY_API_KEY);
  });

  it("reports network failures as unreachable", async () => {
    const result = await checkBtcpayHealth({
      env,
      fetchImpl: async () => {
        throw new Error("read ECONNRESET");
      },
    });

    expect(result).toMatchObject({
      ok: false,
      configured: true,
      reachable: false,
      reason: "network_error",
    });
    expect(result.message).toContain("read ECONNRESET");
  });
});
