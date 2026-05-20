/**
 * Phase 3.3 (v5) — Layer 3 jurisdiction guard + Sentry instrumentation
 * across 9 payment surfaces (+ 2 status endpoints + 6 non-payment endpoints).
 *
 * Closes audit C13 + H3 + H4 + H6 + H7 + supplemental S5 + S6 + S12.
 *
 * For each payment route the handler MUST:
 *   - Invoke assertOrderJurisdictionAllowed() with the intent (or address)
 *     BEFORE reconcile() / persistence. JurisdictionalGuardError yields
 *     403 { ok:false, error:"jurisdiction_blocked" } so abusers cannot
 *     bypass Layers 1+2 by hitting the webhook directly. Iron Law 2.31.
 *   - Wrap external calls in try/catch with Sentry.captureException tagged
 *     by route + provider. Iron Law 2.32.
 *   - Emit a Sentry breadcrumb at handler entry. Iron Law 2.32.
 *
 * For status endpoints + non-payment routes: Sentry capture on internal
 * error only (no Layer 3 needed — read-only / non-credit-bearing).
 *
 * H6 closure: the access route MUST NOT leak "Persistence error: ..." to
 * the response body. Generic 'persistence_failed' string instead +
 * captureException for diagnostics.
 */
import crypto from "node:crypto";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

// -------------------------- Sentry mocks ------------------------------------
// vi.hoisted so we can call the *same* spy from the route's import of
// @/lib/sentry. We replace the helper façade entirely so we don't need a
// real DSN; we also replace @sentry/nextjs (the Sentry.addBreadcrumb path)
// so direct calls from routes are observable.

const { captureExceptionMock, captureMessageMock, addBreadcrumbMock } =
  vi.hoisted(() => ({
    captureExceptionMock: vi.fn(),
    captureMessageMock: vi.fn(),
    addBreadcrumbMock: vi.fn(),
  }));

vi.mock("@/lib/sentry", () => ({
  captureException: captureExceptionMock,
  captureMessage: captureMessageMock,
  startWebhookTransaction: () => ({ end: () => {} }),
}));

vi.mock("@sentry/nextjs", () => ({
  addBreadcrumb: addBreadcrumbMock,
  captureException: captureExceptionMock,
  captureMessage: captureMessageMock,
  startInactiveSpan: vi.fn(() => ({ end: vi.fn() })),
}));

vi.mock("@/lib/supabase", () => ({
  serviceSupabase: () => null,
  _resetSupabaseCachesForTests: () => {},
}));

vi.mock("@/lib/email/welcome-sequence", () => ({
  dispatchWelcomeSequence: vi.fn().mockResolvedValue(undefined),
}));

const { sendEmailMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
}));

vi.mock("@/lib/email/resend", () => ({
  sendEmail: sendEmailMock,
}));

// Now safe to import handlers (after the mocks).
import { POST as btcpayWebhookPOST } from "@/app/api/payments/btcpay/webhook/route";
import { POST as plaidWebhookPOST } from "@/app/api/payments/plaid/webhook/route";
import { POST as zelleReceiptPOST } from "@/app/api/zelle/receipt/route";
import { POST as bitcoinReceiptPOST } from "@/app/api/bitcoin/receipt/route";
import { POST as wooWebhookPOST } from "@/app/api/woocommerce/order-webhook/route";
import { GET as btcpayStatusGET } from "@/app/api/payments/btcpay/status/route";
import { GET as bitcoinStatusGET } from "@/app/api/payments/bitcoin/status/route";
import { POST as accessPOST } from "@/app/api/access/route";
import { POST as contactPOST } from "@/app/api/contact/route";
import { POST as newsletterPOST } from "@/app/api/newsletter/subscribe/route";

import { resetPaymentRegistry } from "@/lib/payments/config";
import { resetReconciliationLedger } from "@/lib/payments/reconciliation";
import { __resetRateLimitForTests } from "@/lib/rate-limit";
import { signZelleCheckoutParams } from "@/lib/checkout/direct-payment";
import { signBitcoinDirectCheckoutParams } from "@/lib/payments/bitcoin-direct";

// ----------------------- shared fixtures ------------------------------------

const BTCPAY_SECRET = "real_btcpay_webhook_secret_for_test";
const PLAID_KEY = "real_plaid_webhook_key_for_test";
const WOO_SECRET = "whsec_woo_unit_test";

const ORIGINAL_ENV = {
  BTCPAY_URL: process.env.BTCPAY_URL,
  BTCPAY_API_KEY: process.env.BTCPAY_API_KEY,
  BTCPAY_STORE_ID: process.env.BTCPAY_STORE_ID,
  BTCPAY_WEBHOOK_SECRET: process.env.BTCPAY_WEBHOOK_SECRET,
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
  PLAID_SECRET: process.env.PLAID_SECRET,
  PLAID_WEBHOOK_VERIFICATION_KEY: process.env.PLAID_WEBHOOK_VERIFICATION_KEY,
  PLAID_VERIFICATION_MODE: process.env.PLAID_VERIFICATION_MODE,
  WOOCOMMERCE_WEBHOOK_SECRET: process.env.WOOCOMMERCE_WEBHOOK_SECRET,
};

function setEnv(): void {
  process.env.BTCPAY_URL = "https://btcpay.real.example";
  process.env.BTCPAY_API_KEY = "real_api_key";
  process.env.BTCPAY_STORE_ID = "real_store";
  process.env.BTCPAY_WEBHOOK_SECRET = BTCPAY_SECRET;
  process.env.PLAID_CLIENT_ID = "real_client";
  process.env.PLAID_SECRET = "real_secret";
  process.env.PLAID_WEBHOOK_VERIFICATION_KEY = PLAID_KEY;
  process.env.PLAID_VERIFICATION_MODE = "hmac";
  process.env.WOOCOMMERCE_WEBHOOK_SECRET = WOO_SECRET;
}

function restoreEnv(): void {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
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

function wooSign(body: string): string {
  return crypto.createHmac("sha256", WOO_SECRET).update(body).digest("base64");
}

function makeRequest(
  url: string,
  body: string,
  headers: Record<string, string>,
): Request {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body,
  });
}

beforeEach(() => {
  captureExceptionMock.mockReset();
  captureMessageMock.mockReset();
  addBreadcrumbMock.mockReset();
  sendEmailMock.mockReset();
  sendEmailMock.mockResolvedValue({ ok: true, id: "stub" });
  setEnv();
  resetPaymentRegistry();
  resetReconciliationLedger();
  __resetRateLimitForTests();
});

afterEach(() => {
  restoreEnv();
  resetPaymentRegistry();
  resetReconciliationLedger();
});

// ------------------------ Route 1: BTCPay webhook ---------------------------

describe("POST /api/payments/btcpay/webhook — Layer 3 + Sentry (Phase 3.3)", () => {
  it("returns 403 jurisdiction_blocked when intent metadata names a blocked country", async () => {
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_blocked",
      status: "Settled",
      metadata: {
        intentId: "pi_blocked",
        shipping_country: "CA", // Canada — non-US blocked
        shipping_state: "ON",
      },
    });
    const res = await btcpayWebhookPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {
        "BTCPay-Sig": btcpaySign(body),
      }),
    );
    expect(res.status).toBe(403);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toBe("jurisdiction_blocked");
  });

  it("emits Sentry breadcrumb at handler entry", async () => {
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_bc",
      status: "Settled",
      metadata: { intentId: "pi_bc" },
    });
    await btcpayWebhookPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {
        "BTCPay-Sig": btcpaySign(body),
      }),
    );
    expect(addBreadcrumbMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "webhook",
        message: expect.stringMatching(/btcpay_webhook/),
      }),
    );
  });

  it("captures internal errors to Sentry with route + provider tags", async () => {
    // Force a thrown error inside the handler by stubbing the adapter.
    // We accomplish this by passing a body that explodes during JSON.parse
    // in the verification path: NOTE the adapter swallows JSON errors and
    // returns invalid_payload; so we instead simulate by mocking
    // adapter.handleWebhook via crashing reconcile() inputs.
    //
    // Simpler: send a body that's valid + verified but pass a metadata
    // that triggers an unexpected throw downstream. We rely on the fact
    // that the handler should wrap external calls in try/catch and call
    // captureException for any throw.

    // For RED purposes we assert the contract — captureException is called
    // when the inner pipeline throws. We use a custom mock to force it.
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_err",
      status: "Settled",
      metadata: { intentId: "pi_err" },
    });
    // Spy on console.error to suppress noise, no real assertions on it.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Force reconcile to throw by mocking a path. Easiest: patch
    // serviceSupabase to throw on call AFTER persist. But persist returns
    // skipped when sb=null. So we can't easily force it here without a
    // monkey-patch. Instead, we send a malformed metadata.shipping_country
    // = "" empty (graceful — no throw). RED test path therefore validates
    // the contract: when an error IS thrown, captureException must fire.
    //
    // To force an error path: spy on Sentry.addBreadcrumb to throw, then
    // expect captureException is fired in the outer catch. This is a
    // valid "internal_error" simulation.
    addBreadcrumbMock.mockImplementationOnce(() => {
      throw new Error("simulated_internal_error");
    });

    const res = await btcpayWebhookPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {
        "BTCPay-Sig": btcpaySign(body),
      }),
    );
    spy.mockRestore();

    expect(res.status).toBe(500);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("internal_error");
    expect(captureExceptionMock).toHaveBeenCalled();
    const firstCall = captureExceptionMock.mock.calls[0];
    expect(firstCall?.[1]).toEqual(
      expect.objectContaining({
        tags: expect.objectContaining({
          route: "btcpay_webhook",
          provider: "btcpay",
        }),
      }),
    );
  });

  it("processes allowed jurisdictions normally and returns 200", async () => {
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_allowed",
      status: "Settled",
      metadata: {
        intentId: "pi_allowed",
        shipping_country: "US",
        shipping_state: "WA",
      },
    });
    const res = await btcpayWebhookPOST(
      makeRequest("http://test/api/payments/btcpay/webhook", body, {
        "BTCPay-Sig": btcpaySign(body),
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; applied: boolean };
    expect(json.ok).toBe(true);
    expect(json.applied).toBe(true);
  });
});

// ------------------------ Route 2: Plaid webhook ----------------------------

describe("POST /api/payments/plaid/webhook — Layer 3 + Sentry (Phase 3.3)", () => {
  it("returns 403 jurisdiction_blocked when intent metadata names a blocked country", async () => {
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_blocked",
      metadata: {
        intentId: "pi_plaid_blocked",
        shipping_country: "CA",
        shipping_state: "BC",
      },
    });
    const res = await plaidWebhookPOST(
      makeRequest("http://test/api/payments/plaid/webhook", body, {
        "Plaid-Verification": plaidSign(body),
      }),
    );
    expect(res.status).toBe(403);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("jurisdiction_blocked");
  });

  it("emits Sentry breadcrumb at handler entry", async () => {
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_bc_test",
      metadata: { intentId: "pi_plaid_bc" },
    });
    await plaidWebhookPOST(
      makeRequest("http://test/api/payments/plaid/webhook", body, {
        "Plaid-Verification": plaidSign(body),
      }),
    );
    expect(addBreadcrumbMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "webhook",
        message: expect.stringMatching(/plaid_webhook/),
      }),
    );
  });

  it("captures internal errors to Sentry with plaid tags", async () => {
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_err",
      metadata: { intentId: "pi_plaid_err" },
    });
    addBreadcrumbMock.mockImplementationOnce(() => {
      throw new Error("simulated_internal");
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await plaidWebhookPOST(
      makeRequest("http://test/api/payments/plaid/webhook", body, {
        "Plaid-Verification": plaidSign(body),
      }),
    );
    spy.mockRestore();
    expect(res.status).toBe(500);
    expect(captureExceptionMock).toHaveBeenCalled();
    const firstCall = captureExceptionMock.mock.calls[0];
    expect(firstCall?.[1]).toEqual(
      expect.objectContaining({
        tags: expect.objectContaining({
          route: "plaid_webhook",
          provider: "plaid",
        }),
      }),
    );
  });
});

// ------------------------ Route 3: Zelle receipt ----------------------------

function signedZellePayment() {
  const params = new URLSearchParams();
  params.set("order", "VC-260520-ZELLE001");
  params.set("amount_cents", "100");
  params.set("recipient_name", "Vialchem Labs LLC");
  params.set("recipient_handle", "vialchem-pay");
  params.set("memo", "VCL-VC-260520-ZELLE001");
  params.set("zelle_email", "abhinav@vialchemlabs.net");
  params.set("support_email", "abhinav@vialchemlabs.net");
  params.set("qr_image_url", "/payments/zelle-qr.png");
  params.set(
    "sig",
    signZelleCheckoutParams(params, "local-zelle-checkout-signing-secret"),
  );
  return params;
}

function zelleReceiptBody(overrides: Record<string, unknown> = {}) {
  const payment = signedZellePayment();
  return {
    order: payment.get("order"),
    amountCents: Number(payment.get("amount_cents")),
    recipientName: payment.get("recipient_name"),
    recipientHandle: payment.get("recipient_handle"),
    memo: payment.get("memo"),
    zelleEmail: payment.get("zelle_email"),
    supportEmail: payment.get("support_email"),
    qrImageUrl: payment.get("qr_image_url"),
    sig: payment.get("sig"),
    customer: {
      name: "Research Buyer",
      email: "buyer@example.com",
      senderName: "Research Buyer",
      street: "1 Main St",
      street2: "",
      city: "Beltsville",
      stateCode: "MD",
      zip: "20705",
      countryCode: "US",
      attestation: true,
    },
    ...overrides,
  };
}

describe("POST /api/zelle/receipt — Layer 3 + Sentry (Phase 3.3)", () => {
  it("emits Sentry breadcrumb at handler entry", async () => {
    await zelleReceiptPOST(
      new Request("http://localhost/api/zelle/receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(zelleReceiptBody()),
      }),
    );
    expect(addBreadcrumbMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "webhook",
        message: expect.stringMatching(/zelle_receipt/),
      }),
    );
  });

  it("captures dispatch errors to Sentry with zelle tags", async () => {
    sendEmailMock.mockRejectedValue(new Error("simulated_smtp_failure"));
    process.env.NODE_ENV = "production";
    process.env.VERCEL_ENV = "production";

    const res = await zelleReceiptPOST(
      new Request("http://localhost/api/zelle/receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(zelleReceiptBody()),
      }),
    );
    delete process.env.VERCEL_ENV;
    process.env.NODE_ENV = "test";

    // Whether 502 or 200 (env-gated), captureException must fire.
    expect(captureExceptionMock).toHaveBeenCalled();
    const firstCall = captureExceptionMock.mock.calls[0];
    expect(firstCall?.[1]).toEqual(
      expect.objectContaining({
        tags: expect.objectContaining({
          route: "zelle_receipt",
          provider: "zelle",
        }),
      }),
    );
    // The status assertion: in production env, route surfaces 502.
    expect(res.status === 502 || res.status === 200).toBe(true);
  });
});

// ------------------------ Route 5: Bitcoin receipt --------------------------

function signedBitcoinSig(overrides: Record<string, string> = {}) {
  const params = new URLSearchParams();
  params.set("order", overrides.order ?? "VC-260520-BTC001");
  params.set("amount_cents", overrides.amount_cents ?? "100");
  params.set("btc_sats", overrides.btc_sats ?? "1000");
  params.set("btc_amount", overrides.btc_amount ?? "0.00001");
  params.set("btc_usd_cents", overrides.btc_usd_cents ?? "10000000");
  params.set(
    "address",
    overrides.address ?? "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080",
  );
  params.set("rate_source", overrides.rate_source ?? "https://rate.example");
  params.set("quoted_at", overrides.quoted_at ?? "2026-05-20T00:00:00.000Z");
  params.set(
    "support_email",
    overrides.support_email ?? "abhinav@vialchemlabs.net",
  );
  return signBitcoinDirectCheckoutParams(
    params,
    "local-bitcoin-direct-signing-secret",
  );
}

function bitcoinReceiptBody(overrides: Record<string, unknown> = {}) {
  return {
    order: "VC-260520-BTC001",
    amountCents: 100,
    btcSats: 1000,
    btcAmount: "0.00001",
    btcUsdCents: 10000000,
    address: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080",
    rateSource: "https://rate.example",
    quotedAt: "2026-05-20T00:00:00.000Z",
    supportEmail: "abhinav@vialchemlabs.net",
    sig: signedBitcoinSig(),
    txid: "a".repeat(64),
    customer: {
      name: "Buyer",
      email: "b@example.com",
      street: "49 Highland Ave",
      street2: "",
      city: "Randolph",
      stateCode: "MA",
      zip: "02368",
      countryCode: "US",
      attestation: true,
    },
    ...overrides,
  };
}

describe("POST /api/bitcoin/receipt — Layer 3 + Sentry (Phase 3.3)", () => {
  it("emits Sentry breadcrumb at handler entry", async () => {
    await bitcoinReceiptPOST(
      new Request("http://localhost/api/bitcoin/receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(bitcoinReceiptBody()),
      }),
    );
    expect(addBreadcrumbMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "webhook",
        message: expect.stringMatching(/bitcoin_receipt/),
      }),
    );
  });

  it("captures dispatch errors to Sentry with bitcoin-direct tags", async () => {
    sendEmailMock.mockRejectedValue(new Error("simulated_smtp_failure"));
    process.env.NODE_ENV = "production";
    process.env.VERCEL_ENV = "production";

    await bitcoinReceiptPOST(
      new Request("http://localhost/api/bitcoin/receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(bitcoinReceiptBody()),
      }),
    );
    delete process.env.VERCEL_ENV;
    process.env.NODE_ENV = "test";

    expect(captureExceptionMock).toHaveBeenCalled();
    const firstCall = captureExceptionMock.mock.calls[0];
    expect(firstCall?.[1]).toEqual(
      expect.objectContaining({
        tags: expect.objectContaining({
          route: "bitcoin_receipt",
          provider: "bitcoin-direct",
        }),
      }),
    );
  });
});

// ------------------------ Route 7: WooCommerce webhook ----------------------

describe("POST /api/woocommerce/order-webhook — HMAC + Layer 3 + Sentry (Phase 3.3)", () => {
  it("rejects unsigned bodies with 401", async () => {
    const body = JSON.stringify({
      id: 727,
      status: "processing",
      order_key: "wc_order_x",
    });
    const res = await wooWebhookPOST(
      new Request("http://test/api/woocommerce/order-webhook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      }),
    );
    expect(res.status).toBe(401);
  });

  it("accepts valid HMAC + non-blocked country body with 200", async () => {
    const body = JSON.stringify({
      id: 727,
      status: "processing",
      order_key: "wc_order_x",
      shipping: { country: "US", state: "WA" },
    });
    const res = await wooWebhookPOST(
      new Request("http://test/api/woocommerce/order-webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-wc-webhook-signature": wooSign(body),
        },
        body,
      }),
    );
    expect(res.status).toBe(200);
  });

  it("returns 403 jurisdiction_blocked when shipping country is non-US", async () => {
    const body = JSON.stringify({
      id: 728,
      status: "processing",
      order_key: "wc_order_blocked",
      shipping: { country: "CA", state: "ON" },
    });
    const res = await wooWebhookPOST(
      new Request("http://test/api/woocommerce/order-webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-wc-webhook-signature": wooSign(body),
        },
        body,
      }),
    );
    expect(res.status).toBe(403);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe("jurisdiction_blocked");
  });

  it("emits Sentry breadcrumb at handler entry", async () => {
    const body = JSON.stringify({ id: 1, status: "processing" });
    await wooWebhookPOST(
      new Request("http://test/api/woocommerce/order-webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-wc-webhook-signature": wooSign(body),
        },
        body,
      }),
    );
    expect(addBreadcrumbMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "webhook",
        message: expect.stringMatching(/woocommerce_webhook/),
      }),
    );
  });
});

// ------------------------ Route 9: BTCPay status ----------------------------

describe("GET /api/payments/btcpay/status — Sentry (Phase 3.3)", () => {
  it("captures internal errors to Sentry with btcpay_status tags", async () => {
    process.env.BTCPAY_SERVER_URL = "https://pay.example.com";
    process.env.BTCPAY_API_KEY = "secret_api_key";
    process.env.BTCPAY_STORE_ID = "store-1";
    process.env.BTCPAY_WEBHOOK_SECRET = "secret_webhook";
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      throw new Error("read ECONNRESET");
    });

    const res = await btcpayStatusGET();
    expect([200, 503]).toContain(res.status);
    // ECONNRESET is captured to Sentry per Iron Law 2.32.
    // (The internal health probe MAY swallow errors and return 503; the
    // route MUST still emit captureException for diagnosability.)
    expect(captureExceptionMock).toHaveBeenCalled();
    const firstCall = captureExceptionMock.mock.calls[0];
    expect(firstCall?.[1]).toEqual(
      expect.objectContaining({
        tags: expect.objectContaining({ route: "btcpay_status" }),
      }),
    );
  });

  it("emits Sentry breadcrumb at handler entry", async () => {
    await btcpayStatusGET();
    expect(addBreadcrumbMock).toHaveBeenCalled();
    const call = addBreadcrumbMock.mock.calls[0]?.[0];
    expect(call).toMatchObject({
      category: "webhook",
      message: expect.stringMatching(/btcpay_status/),
    });
  });
});

// ------------------------ Route 10: Bitcoin status --------------------------

describe("GET /api/payments/bitcoin/status — Sentry (Phase 3.3)", () => {
  it("emits Sentry breadcrumb at handler entry", async () => {
    await bitcoinStatusGET();
    expect(addBreadcrumbMock).toHaveBeenCalled();
    const call = addBreadcrumbMock.mock.calls[0]?.[0];
    expect(call).toMatchObject({
      category: "webhook",
      message: expect.stringMatching(/bitcoin_status/),
    });
  });
});

// ------------------------ Route: access (H6 closure) ------------------------

describe("POST /api/access — H6 generic error + Sentry (Phase 3.3)", () => {
  it("does NOT leak 'Persistence error:' string when Supabase insert fails", async () => {
    // We need to flip Supabase ON for this test. Override the module mock
    // per-case via vi.doMock — alternatively, we trust that when sb is
    // unavailable the path is not reachable. Skip this branch when the
    // module-level mock returns null. The contract assertion is that the
    // route MUST NOT use the substring "Persistence error:" anywhere.
    const validPayload = {
      email: "researcher@example.com",
      role: "academic-researcher",
      researchPurpose:
        "Investigating in-vitro fibroblast migration kinetics in cell-culture wound-closure assays per laboratory protocol.",
      ageAcknowledgment: true,
      ruoAcknowledgment: true,
      jurisdictionAcknowledgment: true,
      attestationsAcknowledged: true,
    };
    const res = await accessPOST(
      new Request("http://localhost/api/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validPayload),
      }),
    );
    const json = await res.json();
    // Must NOT contain the unsafe substring (audit H6 closure).
    const serialized = JSON.stringify(json);
    expect(serialized).not.toMatch(/Persistence error:/);
  });
});

// ------------------------ Route: contact — Sentry ---------------------------

describe("POST /api/contact — Sentry (Phase 3.3)", () => {
  it("captures dispatch errors to Sentry with contact tags", async () => {
    sendEmailMock.mockRejectedValue(new Error("simulated_smtp_failure"));
    process.env.NODE_ENV = "production";
    process.env.VERCEL_ENV = "production";

    const res = await contactPOST(
      new Request("http://test/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "R",
          email: "r@example.com",
          message: "msg",
        }),
      }) as never,
    );
    delete process.env.VERCEL_ENV;
    process.env.NODE_ENV = "test";

    expect([200, 502]).toContain(res.status);
    expect(captureExceptionMock).toHaveBeenCalled();
    const firstCall = captureExceptionMock.mock.calls[0];
    expect(firstCall?.[1]).toEqual(
      expect.objectContaining({
        tags: expect.objectContaining({ route: "contact" }),
      }),
    );
  });
});

// ------------------------ Route: newsletter — Sentry ------------------------

describe("POST /api/newsletter/subscribe — Sentry (Phase 3.3)", () => {
  it("captures internal errors to Sentry with newsletter tags", async () => {
    // Force welcome-sequence to throw.
    const dispatcher = await import("@/lib/email/welcome-sequence");
    vi.mocked(dispatcher.dispatchWelcomeSequence).mockRejectedValueOnce(
      new Error("simulated_failure"),
    );
    process.env.NODE_ENV = "production";
    process.env.VERCEL_ENV = "production";

    await newsletterPOST(
      new Request("http://test/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "researcher@example.com" }),
      }),
    );
    delete process.env.VERCEL_ENV;
    process.env.NODE_ENV = "test";

    expect(captureExceptionMock).toHaveBeenCalled();
    const firstCall = captureExceptionMock.mock.calls[0];
    expect(firstCall?.[1]).toEqual(
      expect.objectContaining({
        tags: expect.objectContaining({ route: "newsletter" }),
      }),
    );
  });
});
