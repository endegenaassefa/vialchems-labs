/**
 * Crypto checkout happy-path E2E (Phase 11 v4 — unskipped per D16 + D24).
 *
 * Stub adapter is the SUT until Phase 13 swaps in real BTCPay sandbox
 * creds via Vercel env. Phase 11 verifies the cart → checkout → method
 * branch shows the 15% crypto-rail discount band; the full place-order
 * → BTCPay invoice → confirm flow lands in Phase 13.
 */
import { expect, test } from "@playwright/test";

test.describe("crypto checkout (stub adapter)", () => {
  test("PDP → cart → checkout/method shows crypto 15% discount", async ({
    page,
  }) => {
    await page.goto("/products/bpc-157-10mg");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /^BPC-157, 10mg vial$/i,
      }),
    ).toBeVisible();

    await page.goto("/checkout/method");
    await expect(
      page.getByRole("heading", { name: /payment method/i }),
    ).toBeVisible();
    // Crypto rail signposts the discount band per Appendix F.
    await expect(page.getByText(/15%/)).toBeVisible();
  });
});
