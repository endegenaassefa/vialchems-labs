/**
 * ACH checkout happy-path E2E (Phase 11 v4 — unskipped per D16 + D24).
 *
 * Stub adapter is the SUT until Phase 13 swaps in real Plaid sandbox creds
 * via Vercel env. The test exercises the ACH method-selection branch up to
 * the review step; the full place-order → reconcile → confirm flow lands
 * in Phase 13 once persistence + reconciliation run end-to-end with
 * Supabase + Plaid sandbox.
 */
import { expect, test } from "@playwright/test";

test.describe("ACH checkout (stub adapter)", () => {
  test("PDP → cart → checkout/address → checkout/method shows ACH 5% discount", async ({
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

    await page.goto("/checkout/method");
    await expect(
      page.getByRole("heading", { name: /payment method/i }),
    ).toBeVisible();
    // The ACH option mentions the 5% discount band per Appendix F.
    await expect(page.getByText(/5%/)).toBeVisible();
  });
});
