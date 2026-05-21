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

  it("falls back to 'unknown network error' when the thrown value is not an Error", async () => {
    const result = await checkBtcpayHealth({
      env,
      fetchImpl: async () => {
        // Non-Error throws happen in real life (e.g. some fetch polyfills).
        throw "boom";
      },
    });

    expect(result).toMatchObject({
      ok: false,
      configured: true,
      reachable: false,
      reason: "network_error",
    });
    expect(result.message).toContain("unknown network error");
  });

  it("reports invalid_url when BTCPAY_SERVER_URL cannot be parsed", async () => {
    const result = await checkBtcpayHealth({
      env: { ...env, BTCPAY_SERVER_URL: "not a url" },
    });

    expect(result).toMatchObject({
      ok: false,
      configured: false,
      reachable: false,
      reason: "invalid_url",
    });
    expect(result.message).toContain("valid absolute URL");
  });

  it("reports invalid_url when BTCPAY_SERVER_URL uses an unsupported protocol", async () => {
    const result = await checkBtcpayHealth({
      env: { ...env, BTCPAY_SERVER_URL: "ftp://pay.example.com" },
    });

    expect(result).toMatchObject({
      ok: false,
      configured: false,
      reachable: false,
      reason: "invalid_url",
    });
    expect(result.message).toContain("https:// or http://");
  });

  it("reports permission_denied when BTCPay rejects with HTTP 403", async () => {
    const result = await checkBtcpayHealth({
      env,
      fetchImpl: async () => new Response("Forbidden", { status: 403 }),
    });

    expect(result).toMatchObject({
      ok: false,
      configured: true,
      reachable: true,
      reason: "permission_denied",
    });
    expect(result.message).toContain("lacks store access");
  });

  it("tolerates a body that fails to read on non-2xx responses", async () => {
    // Simulate a Response where .text() throws (some platforms surface partial
    // responses this way). The implementation has a `.catch(() => "")` to keep
    // the health check from blowing up.
    const fakeResponse = {
      ok: false,
      status: 502,
      text: () => Promise.reject(new Error("body stream errored")),
      json: () => Promise.resolve({}),
    } as unknown as Response;
    const result = await checkBtcpayHealth({
      env,
      fetchImpl: async () => fakeResponse,
    });

    expect(result).toMatchObject({
      ok: false,
      configured: true,
      reachable: true,
      reason: "http_error",
    });
    expect(result.message).toContain("502");
  });

  it("reports http_error on other non-2xx responses with the response status", async () => {
    const result = await checkBtcpayHealth({
      env,
      fetchImpl: async () =>
        new Response("Internal Server Error", { status: 500 }),
    });

    expect(result).toMatchObject({
      ok: false,
      configured: true,
      reachable: true,
      reason: "http_error",
    });
    expect(result.message).toContain("500");
    expect(result.message).toContain("Internal Server Error");
  });

  it("tolerates a JSON body that fails to parse on success", async () => {
    const result = await checkBtcpayHealth({
      env,
      fetchImpl: async () =>
        new Response("not-json", {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    });

    expect(result).toMatchObject({
      ok: true,
      configured: true,
      reachable: true,
      reason: "ok",
    });
    // No store name in the response → null fallback.
    expect(result.storeName).toBeNull();
  });

  it("URL-encodes the store ID in the BTCPay endpoint path", async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ name: "x" }), { status: 200 }),
    );

    await checkBtcpayHealth({
      env: { ...env, BTCPAY_STORE_ID: "store/with spaces" },
      fetchImpl: fetchMock,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://pay.example.com/api/v1/stores/store%2Fwith%20spaces",
      expect.any(Object),
    );
  });

  it("defaults to globalThis.fetch when no fetchImpl option is passed", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ name: "x" }), { status: 200 }),
      );

    const result = await checkBtcpayHealth({ env });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
  });

  it("defaults to process.env when no env option is passed", async () => {
    const originalKeys = [
      "BTCPAY_SERVER_URL",
      "BTCPAY_URL",
      "BTCPAY_API_KEY",
      "BTCPAY_STORE_ID",
      "BTCPAY_WEBHOOK_SECRET",
    ];
    const saved: Record<string, string | undefined> = {};
    for (const k of originalKeys) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
    try {
      // No env set, no options.env, no options.fetchImpl — exercises the
      // process.env fallback and the missing_credential short-circuit.
      const result = await checkBtcpayHealth();
      expect(result.configured).toBe(false);
      expect(result.reason).toBe("missing_credential");
      // serverUrl from getBtcpayServerUrl on empty env is "" → undefined branch.
      expect(result.serverUrl).toBeUndefined();
    } finally {
      for (const [k, v] of Object.entries(saved)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    }
  });

  it("treats AbortController timeout as a network error", async () => {
    const result = await checkBtcpayHealth({
      env,
      timeoutMs: 1,
      fetchImpl: async (_input, init) => {
        // Honor the signal and reject like real fetch does.
        return new Promise((_resolve, reject) => {
          const signal = (init as RequestInit | undefined)?.signal;
          if (signal?.aborted) {
            reject(new Error("aborted"));
            return;
          }
          signal?.addEventListener("abort", () => {
            reject(new Error("aborted"));
          });
        });
      },
    });

    expect(result).toMatchObject({
      ok: false,
      configured: true,
      reachable: false,
      reason: "network_error",
    });
  });
});
