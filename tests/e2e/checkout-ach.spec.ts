/**
 * ACH checkout availability E2E (Phase 11 v4 — unskipped per D16 + D24).
 *
 * Plaid ACH is present in the local branch but remains disabled for live
 * checkout until create-intent support is fully merged and verified.
 */
import { expect, test } from "@playwright/test";
import { passAgeGate } from "./helpers/age-gate";

test.describe("ACH checkout (stub adapter)", () => {
  test("PDP → cart → checkout/address → checkout/method shows ACH disabled", async ({
    page,
  }) => {
    await passAgeGate(page);
    await page.goto("/products/bpc-157-10mg");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /^BPC-157$/i,
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
    await expect(page.getByText(/bank transfer \(us ach\)/i)).toBeVisible();
    await expect(page.getByText(/coming soon/i).first()).toBeVisible();
  });
});
