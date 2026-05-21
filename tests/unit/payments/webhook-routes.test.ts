/**
 * Webhook route handler tests. Use real Next.js Request shapes so we exercise
 * the same code path that the runtime hits.
 *
 * Strategy: set env vars BEFORE the adapters cache via getPaymentRegistry,
 * call resetPaymentRegistry to force a fresh build, dispatch a request, then
 * assert. Reset state afterward.
 */
import crypto from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST as btcpayPOST } from "@/app/api/payments/btcpay/webhook/route";
import { POST as plaidPOST } from "@/app/api/payments/plaid/webhook/route";
import { resetPaymentRegistry } from "@/lib/payments/config";
import { resetReconciliationLedger } from "@/lib/payments/reconciliation";

const BTCPAY_SECRET = "real_btcpay_webhook_secret_for_test";
const PLAID_KEY = "real_plaid_webhook_key_for_test";

const ORIGINAL_ENV = {
  BTCPAY_URL: process.env.BTCPAY_URL,
  BTCPAY_API_KEY: process.env.BTCPAY_API_KEY,
  BTCPAY_STORE_ID: process.env.BTCPAY_STORE_ID,
  BTCPAY_WEBHOOK_SECRET: process.env.BTCPAY_WEBHOOK_SECRET,
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
  PLAID_SECRET: process.env.PLAID_SECRET,
  PLAID_WEBHOOK_VERIFICATION_KEY: process.env.PLAID_WEBHOOK_VERIFICATION_KEY,
  PLAID_VERIFICATION_MODE: process.env.PLAID_VERIFICATION_MODE,
};

function setEnv(): void {
  process.env.BTCPAY_URL = "https://btcpay.real.example";
  process.env.BTCPAY_API_KEY = "real_api_key";
  process.env.BTCPAY_STORE_ID = "real_store";
  process.env.BTCPAY_WEBHOOK_SECRET = BTCPAY_SECRET;
  process.env.PLAID_CLIENT_ID = "real_client";
  process.env.PLAID_SECRET = "real_secret";
  process.env.PLAID_WEBHOOK_VERIFICATION_KEY = PLAID_KEY;
  // Phase 3.1 (v5): the integration tests below sign with HMAC. JWKS is the
  // new production default, so we pin HMAC for this legacy integration flow.
  process.env.PLAID_VERIFICATION_MODE = "hmac";
}

function restoreEnv(): void {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function btcpaySign(body: string): string {
  return (
    "sha256=" +
    crypto.createHmac("sha256", BTCPAY_SECRET).update(body).digest("hex")
  );
}

function plaidSign(body: string): string {
  return (
    "sha256=" +
    crypto.createHmac("sha256", PLAID_KEY).update(body).digest("hex")
  );
}

function makeRequest(
  url: string,
  body: string,
  headers: Record<string, string>,
): Request {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body,
  });
}

describe("POST /api/payments/btcpay/webhook", () => {
  beforeEach(() => {
    setEnv();
    resetPaymentRegistry();
    resetReconciliationLedger();
  });

  afterEach(() => {
    restoreEnv();
    resetPaymentRegistry();
    resetReconciliationLedger();
  });

  it("400s on missing signature", async () => {
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_1",
      status: "Settled",
      metadata: { intentId: "pi_1" },
    });
    const res = await btcpayPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {}),
    );
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("invalid_signature");
  });

  it("400s on invalid signature", async () => {
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_1",
      status: "Settled",
      metadata: { intentId: "pi_1" },
    });
    const res = await btcpayPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {
        "BTCPay-Sig": "sha256=" + "a".repeat(64),
      }),
    );
    expect(res.status).toBe(400);
  });

  it("200s + applies on a verified settled invoice", async () => {
    // B3: Layer 3 jurisdictional guard now fails closed for credit-bearing
    // intents with unresolvable addresses. Production resolution path is
    // metadata.order_id → Supabase orders.shipping_address_snapshot, but
    // this unit test doesn't mock Supabase. Inject shipping_country/state
    // via the cheap-path metadata so the guard can validate inline.
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_1",
      status: "Settled",
      metadata: {
        intentId: "pi_1",
        shipping_country: "US",
        shipping_state: "WA",
      },
    });
    const res = await btcpayPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {
        "BTCPay-Sig": btcpaySign(body),
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; applied: boolean };
    expect(json.ok).toBe(true);
    expect(json.applied).toBe(true);
  });

  it("idempotent on duplicate verified delivery", async () => {
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_1",
      status: "Settled",
      metadata: {
        intentId: "pi_dupe",
        shipping_country: "US",
        shipping_state: "WA",
      },
    });
    const sig = btcpaySign(body);
    const first = await btcpayPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {
        "BTCPay-Sig": sig,
      }),
    );
    const second = await btcpayPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {
        "BTCPay-Sig": sig,
      }),
    );
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const firstJson = (await first.json()) as { applied: boolean };
    const secondJson = (await second.json()) as {
      applied: boolean;
      reason: string;
    };
    expect(firstJson.applied).toBe(true);
    expect(secondJson.applied).toBe(false);
    expect(secondJson.reason).toBe("already_at_status");
  });
});

describe("POST /api/payments/plaid/webhook", () => {
  beforeEach(() => {
    setEnv();
    resetPaymentRegistry();
    resetReconciliationLedger();
  });

  afterEach(() => {
    restoreEnv();
    resetPaymentRegistry();
    resetReconciliationLedger();
  });

  it("400s on missing signature", async () => {
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_1",
      metadata: { intentId: "pi_1" },
    });
    const res = await plaidPOST(
      makeRequest("http://test/api/payments/plaid/webhook", body, {}),
    );
    expect(res.status).toBe(400);
  });

  it("200s + applies on verified TRANSFER:POSTED", async () => {
    // B3: see btcpay test above — inject shipping_country/state for the
    // cheap-path Layer 3 resolution.
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_1",
      metadata: {
        intentId: "pi_77",
        shipping_country: "US",
        shipping_state: "WA",
      },
    });
    const res = await plaidPOST(
      makeRequest("http://test/api/payments/plaid/webhook", body, {
        "Plaid-Verification": plaidSign(body),
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      applied: boolean;
      eventType: string;
    };
    expect(json.ok).toBe(true);
    expect(json.applied).toBe(true);
    expect(json.eventType).toBe("TRANSFER:POSTED");
  });

  it("idempotent on duplicate verified delivery", async () => {
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_1",
      metadata: {
        intentId: "pi_dupe",
        shipping_country: "US",
        shipping_state: "WA",
      },
    });
    const sig = plaidSign(body);
    const first = await plaidPOST(
      makeRequest("http://test/api/payments/plaid/webhook", body, {
        "Plaid-Verification": sig,
      }),
    );
    const second = await plaidPOST(
      makeRequest("http://test/api/payments/plaid/webhook", body, {
        "Plaid-Verification": sig,
      }),
    );
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const firstJson = (await first.json()) as { applied: boolean };
    const secondJson = (await second.json()) as { applied: boolean };
    expect(firstJson.applied).toBe(true);
    expect(secondJson.applied).toBe(false);
  });
});
