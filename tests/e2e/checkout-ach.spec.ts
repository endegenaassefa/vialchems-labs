/**
 * ACH checkout happy-path E2E.
 *
 * Phase 9: scaffolded but skipped — Playwright browsers not provisioned here.
 * Phase 10 wires the dev-server + browser-install in CI. SUT is the stub
 * adapter (PAYMENT_PROVIDER=stub) per PRD §8 "use mock-pay".
 */
import { expect, test } from '@playwright/test';

test.skip(
  true,
  'Phase 9: Playwright browsers not provisioned. Unskip in Phase 10 when ' +
    '`npx playwright install` succeeds in CI and the dev-server fixture is wired.',
);

test.describe('ACH checkout (stub adapter)', () => {
  test('happy path: BPC-157 → cart → checkout → ACH → confirm', async ({
    page,
  }) => {
    await page.goto('/products/bpc-157-10mg');
    await page.getByRole('button', { name: /add to cart/i }).click();
    await page.goto('/cart');
    await page.getByRole('link', { name: /checkout/i }).click();

    await page.getByRole('radio', { name: /ach/i }).check();
    await expect(page.getByText(/5%/)).toBeVisible();

    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page).toHaveURL(/\/order\/.*/);
  });
});
