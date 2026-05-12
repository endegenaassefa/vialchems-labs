import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createBtcpayAdapter } from "@/lib/payments/btcpay";

/**
 * Phase 10.5 (v4) — D10 BTCPay Greenfield POST createIntent.
 *
 * The adapter, when env is configured, posts a Greenfield invoice
 * payload at /api/v1/stores/{storeId}/invoices with the API key in
 * the Authorization header. Webhook verification (HMAC-SHA256) is
 * already shipped in v1.0.0 and unchanged here.
 */

const env = {
  BTCPAY_URL: "https://btcpay.example.com",
  BTCPAY_API_KEY: "real_test_key",
  BTCPAY_STORE_ID: "store-1",
  BTCPAY_WEBHOOK_SECRET: "whsec",
};

describe("BTCPay createIntent (real Greenfield)", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const initMethod =
        init?.method ??
        (typeof input === "object" ? (input as Request).method : "GET");
      if (
        url.endsWith("/api/v1/stores/store-1/invoices") &&
        initMethod === "POST"
      ) {
        return new Response(
          JSON.stringify({
            id: "INV-abc123",
            status: "New",
            amount: "54.00",
            currency: "USD",
            checkoutLink: "https://btcpay.example.com/i/INV-abc123",
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }
      return new Response("not found", { status: 404 });
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts an invoice and returns a PaymentIntent shaped to the response", async () => {
    const adapter = createBtcpayAdapter({ env });
    const intent = await adapter.createIntent({
      orderId: "VC-TEST-1",
      customerEmail: "researcher@example.com",
      amountCents: 5400,
      method: "crypto",
      metadata: { sku: "BPC-157-10MG" },
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const call = (
      globalThis.fetch as unknown as { mock: { calls: unknown[][] } }
    ).mock.calls[0];
    const url = call[0] as string;
    const init = call[1] as RequestInit;

    expect(url).toBe(
      "https://btcpay.example.com/api/v1/stores/store-1/invoices",
    );
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "token real_test_key",
    );
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
    const body = JSON.parse(init.body as string);
    expect(body.amount).toBe("54.00");
    expect(body.currency).toBe("USD");
    expect(body.metadata.intentId).toBe("VC-TEST-1");

    expect(intent.id).toBe("INV-abc123");
    expect(intent.provider).toBe("btcpay");
    expect(intent.method).toBe("crypto");
    expect(intent.amountCents).toBe(5400);
    expect(intent.status).toBe("pending");
    expect(intent.externalId).toBe("INV-abc123");
    expect(intent.metadata?.checkoutLink).toBe(
      "https://btcpay.example.com/i/INV-abc123",
    );
  });

  it("throws when env is unconfigured (stub values)", async () => {
    const adapter = createBtcpayAdapter({
      env: {
        BTCPAY_URL: "https://your-btcpay-server.example.com",
        BTCPAY_API_KEY: "",
        BTCPAY_STORE_ID: "",
        BTCPAY_WEBHOOK_SECRET: "",
      },
    });
    await expect(
      adapter.createIntent({
        orderId: "VC-TEST-2",
        customerEmail: "researcher@example.com",
        amountCents: 100,
        method: "crypto",
      }),
    ).rejects.toThrow(/btcpay_not_configured/);
  });

  it("throws when the Greenfield POST returns non-2xx", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      return new Response("Bad Request", { status: 400 });
    });
    const adapter = createBtcpayAdapter({ env });
    await expect(
      adapter.createIntent({
        orderId: "VC-TEST-3",
        customerEmail: "researcher@example.com",
        amountCents: 100,
        method: "crypto",
      }),
    ).rejects.toThrow(/btcpay_invoice_create_failed/);
  });
});
