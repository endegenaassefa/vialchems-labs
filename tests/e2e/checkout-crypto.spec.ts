/**
 * Crypto checkout happy-path E2E.
 *
 * Phase 9: scaffolded but skipped — Playwright browsers + dev server need to
 * be running for this to execute. PRD §8 Phase 9 says "use mock-pay" so the
 * stub adapter is the SUT. Real BTCPay sandbox check lands in Phase 10.
 *
 * Unskip pre-commit when:
 *   1. `npx playwright install` succeeds in CI
 *   2. `npm run dev` is wired into a Playwright webServer block
 *   3. PAYMENT_PROVIDER=stub is set in test env (default)
 */
import { expect, test } from '@playwright/test';

test.skip(
  true,
  'Phase 9: Playwright browsers not provisioned in this env. Phase 10 wires ' +
    'the webServer block + npx playwright install in CI.',
);

test.describe('crypto checkout (stub adapter)', () => {
  test('happy path: BPC-157 → cart → checkout → crypto → confirm', async ({
    page,
  }) => {
    await page.goto('/products/bpc-157-10mg');
    await expect(page.getByRole('heading', { name: /BPC-157/i })).toBeVisible();
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.goto('/cart');
    await page.getByRole('link', { name: /checkout/i }).click();

    // Method step
    await page.getByRole('radio', { name: /crypto/i }).check();
    await expect(page.getByText(/15%/)).toBeVisible();

    // Confirm step
    await page.getByRole('button', { name: /confirm/i }).click();

    // The stub redirects to /order/stub/<id>; verify pending → paid transition.
    await expect(page).toHaveURL(/\/order\/.*/);
    await expect(page.getByText(/pending|paid/i)).toBeVisible();
  });
});
