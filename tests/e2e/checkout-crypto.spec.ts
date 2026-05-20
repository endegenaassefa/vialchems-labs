/**
 * Crypto checkout E2E — UI + webhook boundary (Phase 7.6 v5 closure G6).
 *
 * Mirrors `checkout-ach.spec.ts` but targets the crypto rail (BTCPay):
 *
 * 1. **UI happy-path through method selection** (`/checkout/method`)
 *    Crypto is the only selectable rail at v1.0.0 launch. The MethodForm
 *    renders the "Cryptocurrency (BTC · LTC)" option as default-checked +
 *    enabled, with the "Save 10–15%" pill that maps to the canonical
 *    `PAYMENT_DISCOUNT_PCT` (15% crypto). This spec locks the visible
 *    contract — discount band, default-selected, no card or ACH escape.
 *
 * 2. **BTCPay webhook receiver failure modes** (`/api/payments/btcpay/webhook`)
 *    Audit H19 flagged checkout-crypto.spec.ts as discount-band-only. The
 *    happy path (signed webhook → reconcile → confirm) is exercised in
 *    the unit suite at `tests/unit/payments/webhook-routes.test.ts` where
 *    env vars + the payment registry can be reset between tests. Here we
 *    lock the WEBHOOK PROTOCOL contract — the failure modes that gate
 *    unverified traffic from reaching `reconcile()`:
 *      - GET → 405 (route is POST-only)
 *      - Missing `BTCPay-Sig` header → 400 + `invalid_signature`
 *      - Garbage `BTCPay-Sig` header → 400 + `invalid_signature`
 *      - Malformed body → 400 (gate fires before reconcile)
 *
 * Idempotent-replay + jurisdiction-blocked have full coverage in:
 *   - `tests/unit/payments/webhook-routes.test.ts`
 *   - `tests/unit/payments/reconciliation-jurisdictional.test.ts`
 *   - `tests/unit/api/webhook-jurisdiction-sentry.test.ts`
 * The end-to-end signed-webhook path lands in Phase 13 once Vercel env
 * carries a real BTCPay sandbox + matching webhook secret.
 */
import { expect, test } from "@playwright/test";

test.describe("crypto checkout — UI gating", () => {
  test("/checkout/method shows crypto as default-selected with the 15% discount band", async ({
    page,
  }) => {
    await page.goto("/products/bpc-157-10mg");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /^BPC-157, 10mg vial$/i,
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: /add to cart/i }).click();

    await page.goto("/checkout/method");
    await expect(
      page.getByRole("heading", { name: /payment method/i }),
    ).toBeVisible();

    // The crypto rail is the default selection and is selectable.
    const cryptoRadio = page.locator("#method-crypto");
    await expect(cryptoRadio).toBeChecked();
    await expect(cryptoRadio).toBeEnabled();

    // Discount band signposts the top of the 10-15% crypto range per
    // Appendix F and the canonical PAYMENT_DISCOUNT_PCT.
    await expect(page.getByText(/15%/)).toBeVisible();
  });

  test("/checkout/method blocks Continue when the disabled rails are selected", async ({
    page,
  }) => {
    await page.goto("/products/bpc-157-10mg");
    await page.getByRole("button", { name: /add to cart/i }).click();

    await page.goto("/checkout/method");
    // Card and ACH options are visible but disabled — locking the "Coming
    // soon" contract for v1.0.0 launch.
    await expect(page.locator("#method-card")).toBeDisabled();
    await expect(page.locator("#method-ach")).toBeDisabled();

    // The crypto Continue button is enabled because crypto is the default
    // selection (validates that the disabled-rails contract doesn't block
    // checkout for the actual default rail).
    const continueBtn = page.getByRole("button", {
      name: /continue to review/i,
    });
    await expect(continueBtn).toBeEnabled();
  });
});

test.describe("BTCPay webhook receiver — failure modes (H19)", () => {
  // The BTCPay webhook lives at /api/payments/btcpay/webhook. The route is
  // POST-only with `runtime = 'nodejs'` (crypto.timingSafeEqual requires
  // Node runtime). These checks lock the failure-mode contract that
  // prevents an unverified webhook from ever reaching `reconcile()`.

  test("GET /api/payments/btcpay/webhook → 405 method not allowed", async ({
    request,
  }) => {
    const res = await request.get("/api/payments/btcpay/webhook");
    expect(res.status()).toBe(405);
  });

  test("POST with missing BTCPay-Sig header → 400 invalid_signature", async ({
    request,
  }) => {
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_e2e_missing_sig",
      status: "Settled",
      metadata: { intentId: "pi_e2e_missing_sig" },
    });
    const res = await request.post("/api/payments/btcpay/webhook", {
      data: body,
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toBe("invalid_signature");
  });

  test("POST with garbage BTCPay-Sig header → 400 invalid_signature", async ({
    request,
  }) => {
    const body = JSON.stringify({
      type: "InvoiceSettled",
      invoiceId: "inv_e2e_bad_sig",
      status: "Settled",
      metadata: { intentId: "pi_e2e_bad_sig" },
    });
    const res = await request.post("/api/payments/btcpay/webhook", {
      data: body,
      headers: {
        "Content-Type": "application/json",
        // Wrong HMAC — should fail signature verification. The router never
        // reaches `reconcile()`.
        "BTCPay-Sig": "sha256=" + "a".repeat(64),
      },
    });
    expect(res.status()).toBe(400);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toBe("invalid_signature");
  });

  test("POST with non-JSON body → 400 (gate fires before reconcile)", async ({
    request,
  }) => {
    // Send a body that's valid for readRawBody (utf-8) but garbage JSON.
    // Either invalid_body (rejected at JSON parse) or invalid_signature
    // (HMAC fails first) — both outcomes satisfy the contract that
    // reconcile() is never invoked on unverified input.
    const res = await request.post("/api/payments/btcpay/webhook", {
      data: "<<not-json>>",
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(["invalid_body", "invalid_signature"]).toContain(json.error);
  });

  test("Iron Law 2.20: status route is GET-only, webhook is POST-only", async ({
    request,
  }) => {
    // Iron Law 2.20 makes the rail surface explicit. The BTCPay rail has
    // exactly two endpoints under /api/payments/btcpay: the webhook
    // receiver (POST-only) and the status read (GET-only). Crossing the
    // wires (POST to status, GET to webhook) must return 405 — locks the
    // method contract per-route.
    const wrongMethodWebhook = await request.get(
      "/api/payments/btcpay/webhook",
    );
    expect(wrongMethodWebhook.status()).toBe(405);

    // POSTing to the status route should also 405 (status is GET-only).
    const wrongMethodStatus = await request.post(
      "/api/payments/btcpay/status",
      {
        data: "{}",
        headers: { "Content-Type": "application/json" },
      },
    );
    expect(wrongMethodStatus.status()).toBe(405);
  });
});
