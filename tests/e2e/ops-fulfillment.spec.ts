/**
 * Phase A ops fulfillment — Playwright E2E happy path.
 *
 * Walks through the order admin from login → list → detail → fulfill →
 * ship (manual tracking variant) → verify status. Requires:
 *
 *   - Dev server running (playwright.config.ts boots it)
 *   - OPS_API_TOKEN set in env
 *   - SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL configured
 *   - `npx tsx scripts/seed-test-orders.ts` run first so TEST-SEED-*
 *     orders exist in `paid` state
 *
 * Auto-skipped when those env vars aren't set (so CI and dev runs without
 * a real Supabase project don't fail). To run locally:
 *
 *   OPS_API_TOKEN=... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     npx playwright test tests/e2e/ops-fulfillment.spec.ts
 *
 * One thin spec, not the full QA pool — the QA pool dispatch (post-merge
 * on Vercel preview) covers adversarial paths.
 */
import { expect, test, type Page } from "@playwright/test";

const opsToken = process.env.OPS_API_TOKEN;
const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

test.describe("ops fulfillment happy path", () => {
  test.skip(
    !opsToken || !supabaseConfigured,
    "Set OPS_API_TOKEN + Supabase env vars + run seed-test-orders.ts to enable",
  );

  test.beforeEach(async ({ page }) => {
    // Seed the localStorage token directly so we don't have to type it.
    // This mirrors what /ops/login does on a successful verify.
    await page.goto("/ops/login");
    await page.evaluate((token) => {
      window.localStorage.setItem("vialchems_ops_token_v1", token);
    }, opsToken!);
  });

  test("login screen rejects empty + wrong tokens", async ({ page }) => {
    // Clear so we're really unauthed.
    await page.evaluate(() => window.localStorage.clear());
    await page.goto("/ops/login");

    // Empty token
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/token is required/i)).toBeVisible();

    // Wrong token
    await page.getByLabel(/token/i).fill("definitely-not-the-real-token");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/token rejected/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("with token, the orders list loads and shows test orders when toggled", async ({
    page,
  }) => {
    await page.goto("/ops/orders");
    await expect(page.getByRole("heading", { name: /orders/i })).toBeVisible();

    // Production orders (default) — test orders should NOT be visible.
    await expect(page.getByText(/test-seed-/i).first()).toHaveCount(0);

    // Toggle test orders on.
    await page.getByLabel(/show test orders/i).check();
    await expect(page.getByText(/test-seed-/i).first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test("can fulfill a paid order, then ship it manually", async ({ page }) => {
    await page.goto("/ops/orders");
    await page.getByLabel(/show test orders/i).check();

    // Filter to paid status so we land on a paid TEST-SEED order.
    await page.getByRole("button", { name: /^paid$/i }).click();

    // Click the first paid TEST-SEED row.
    const firstPaidLink = page
      .getByRole("link", { name: /TEST-SEED-/i })
      .first();
    await expect(firstPaidLink).toBeVisible({ timeout: 5_000 });
    await firstPaidLink.click();

    // We're on the detail page now.
    await expect(page.getByText(/Mark fulfilled/i)).toBeVisible();

    // Click "Mark fulfilled" — server transitions paid → fulfilled.
    await page
      .getByRole("button", { name: /mark fulfilled/i })
      .click();

    // After refresh, fulfilled badge appears and Ship form is visible.
    await expect(page.getByText(/Attach tracking/i)).toBeVisible({
      timeout: 5_000,
    });

    // Paste manual tracking + carrier + click Mark shipped.
    await page.getByPlaceholder(/tracking number/i).fill("9400111E2E12345678");
    await page
      .getByRole("button", { name: /mark shipped/i })
      .click();

    // After refresh, status badge says "shipped" somewhere on the page,
    // and the Shippo-webhook explainer is visible.
    await expect(page.getByText(/shipped/i).first()).toBeVisible({
      timeout: 5_000,
    });
    await expect(
      page.getByText(/Delivery status will update automatically/i),
    ).toBeVisible();
  });

  test("rejects refund amounts greater than total", async ({ page }) => {
    await page.goto("/ops/orders");
    await page.getByLabel(/show test orders/i).check();

    // Need a non-terminal order with a refund form — fulfilled works.
    await page.getByRole("button", { name: /^fulfilled$/i }).click();
    const firstFulfilledLink = page
      .getByRole("link", { name: /TEST-SEED-/i })
      .first();

    // If no fulfilled test orders exist (because the previous test mutated
    // one), skip this assertion — the seeder seeds 2 fulfilled at a time.
    if ((await firstFulfilledLink.count()) === 0) {
      test.skip();
    }

    await firstFulfilledLink.click();

    // Refund form: try to refund more than total.
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill("99999.99");
    await page.getByPlaceholder(/customer request/i).fill("E2E test overrefund");

    // Button should be disabled because amount > max (HTML attr).
    const refundBtn = page.getByRole("button", { name: /^refund$/i });
    await expect(refundBtn).toBeDisabled();
  });
});
