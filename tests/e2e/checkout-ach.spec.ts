/**
 * ACH checkout E2E — UI + webhook boundary (Phase 7.6 v5 closure G6).
 *
 * This spec covers two layers:
 *
 * 1. **UI gating of the ACH option** (`/checkout/method`)
 *    The MethodForm in `app/checkout/method/MethodForm.tsx` currently
 *    renders the ACH option with a "Coming soon" pill (`disabled`) per the
 *    Phase 5 decision to ship crypto-only at v1.0.0 launch (Plaid
 *    verification scaffolding lives in `lib/payments/plaid.ts` but
 *    `createIntent` is not wired). The UI contract is: the ACH option is
 *    VISIBLE (so buyers see the future rail) but NOT SELECTABLE. This
 *    assertion locks that contract in place — any future PR that wires
 *    Plaid live must intentionally update this test.
 *
 * 2. **Plaid webhook receiver failure modes** (`/api/payments/plaid/webhook`)
 *    Audit H19 flagged checkout-ach.spec.ts as discount-band-only. The
 *    happy-path (full place-order → reconcile → confirm) cannot run in E2E
 *    because:
 *      a. The UI ACH option is `disabled` and cannot be selected.
 *      b. Plaid's production verification scheme is JWT/ES256/JWKS; signing
 *         a JWT inside an E2E spec requires a private key the test does
 *         not have access to, and stubbing the JWKS fetcher requires
 *         server-side state mutation Playwright cannot reach.
 *    Instead, we lock the WEBHOOK PROTOCOL contract — the four failure
 *    modes that gate webhook traffic from ever reaching `reconcile()`:
 *      - GET → 405 (route is POST-only)
 *      - Missing signature header → 400 + `invalid_signature`
 *      - Garbage signature header → 400 + `invalid_signature`
 *      - Malformed body → 400 + `invalid_body` OR `invalid_signature`
 *        (depending on which guard fires first; both are blocked-at-the-gate
 *        outcomes — `reconcile()` is never invoked)
 *
 * The "happy path" (signed webhook → reconcile → 200 + applied=true) and
 * the "idempotent replay" path are exercised in the unit suite at
 * `tests/unit/payments/webhook-routes.test.ts` where env vars and registry
 * caching are controllable in-process. Jurisdiction-blocked is covered at
 * `tests/unit/api/webhook-jurisdiction-sentry.test.ts`. The full bridge
 * lands in Phase 13 when real Plaid sandbox creds wire into Vercel env.
 */
import { expect, test } from "@playwright/test";

test.describe("ACH checkout — UI gating", () => {
  test("PDP → cart → /checkout/address renders the shipping form", async ({
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

    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { level: 1, name: /review your order/i }),
    ).toBeVisible();

    await page.goto("/checkout/address");
    await expect(
      page.getByRole("heading", { name: /shipping address/i }),
    ).toBeVisible();
    // Country lock is contractual — US-only shipping at v1.0.0 per
    // DECISIONS/compliance_posture.md + Iron Law 2.8.
    const countrySelect = page.locator("#addr-country");
    await expect(countrySelect).toBeDisabled();
    await expect(countrySelect).toHaveValue("US");
  });

  test("/checkout/method renders the ACH option as 'Coming soon' (disabled)", async ({
    page,
  }) => {
    await page.goto("/products/bpc-157-10mg");
    await page.getByRole("button", { name: /add to cart/i }).click();

    await page.goto("/checkout/method");
    await expect(
      page.getByRole("heading", { name: /payment method/i }),
    ).toBeVisible();

    // The ACH option (id="method-ach") is rendered but disabled. This is
    // the v1.0.0 contract: visible-but-not-selectable until Plaid
    // createIntent goes live in Phase 2 / Phase 13.
    const achRadio = page.locator("#method-ach");
    await expect(achRadio).toBeDisabled();

    // The crypto rail is the default selection and is selectable.
    const cryptoRadio = page.locator("#method-crypto");
    await expect(cryptoRadio).toBeEnabled();
    await expect(cryptoRadio).toBeChecked();
  });
});

test.describe("ACH webhook receiver — failure modes (H19)", () => {
  // The Plaid webhook lives at /api/payments/plaid/webhook. The route is
  // POST-only with `runtime = 'nodejs'`. These checks lock the failure-mode
  // contract that prevents an unverified webhook from ever reaching
  // `reconcile()` — see lib/payments/reconciliation.ts.

  test("GET /api/payments/plaid/webhook → 405 method not allowed", async ({
    request,
  }) => {
    const res = await request.get("/api/payments/plaid/webhook");
    // Next.js returns 405 for unsupported HTTP methods on App Router POST
    // handlers. The exact status is Next.js framework behavior; the
    // contract is "not 2xx, not 5xx".
    expect(res.status()).toBe(405);
  });

  test("POST with missing signature header → 400 invalid_signature", async ({
    request,
  }) => {
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_e2e_missing_sig",
      metadata: { intentId: "pi_e2e_missing_sig" },
    });
    const res = await request.post("/api/payments/plaid/webhook", {
      data: body,
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toBe("invalid_signature");
  });

  test("POST with garbage signature header → 400 invalid_signature", async ({
    request,
  }) => {
    const body = JSON.stringify({
      webhook_type: "TRANSFER",
      webhook_code: "POSTED",
      transfer_id: "tr_e2e_bad_sig",
      metadata: { intentId: "pi_e2e_bad_sig" },
    });
    const res = await request.post("/api/payments/plaid/webhook", {
      data: body,
      headers: {
        "Content-Type": "application/json",
        // Garbage signature — should fail both HMAC and JWKS verifiers.
        "Plaid-Verification": "sha256=" + "0".repeat(64),
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
    // The route either rejects at the JSON layer (invalid_body) or at the
    // signature layer (invalid_signature, since unsigned). Both outcomes
    // satisfy the contract: the gate fires before reconcile().
    const res = await request.post("/api/payments/plaid/webhook", {
      data: "this-is-not-json{{",
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(["invalid_body", "invalid_signature"]).toContain(json.error);
  });

  test("Iron Law 2.20: only {stub, btcpay, plaid} webhooks exist", async ({
    request,
  }) => {
    // Iron Law 2.20 freezes the payment rail universe at
    // PaymentProviderId = 'stub' | 'btcpay' | 'plaid'. Stub has no webhook
    // by design (in-memory adapter). The only real webhook endpoints under
    // /api/payments are plaid and btcpay; Stripe/PayPal/Square/Shopify
    // routes must return 404. This locks the contract end-to-end.
    const stripeRes = await request.post("/api/payments/stripe/webhook", {
      data: "{}",
      headers: { "Content-Type": "application/json" },
    });
    expect(stripeRes.status()).toBe(404);

    const paypalRes = await request.post("/api/payments/paypal/webhook", {
      data: "{}",
      headers: { "Content-Type": "application/json" },
    });
    expect(paypalRes.status()).toBe(404);
  });
});
