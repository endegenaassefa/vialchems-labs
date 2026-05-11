/**
 * Accessibility E2E suite — runs axe-core against every static route.
 *
 * Phase 8 ships the suite skipped (browsers not provisioned here). Phase 11
 * unskips, runs `npx playwright install --with-deps` in CI, and gates merges
 * on 0 critical / 0 serious axe violations per Iron Law 2.18 + the v4 §7.2
 * a11y baseline.
 *
 * Coverage: 13 of the 38 routes — the static, no-fixture-needed surfaces.
 * Dynamic routes (account, /coa/[peptide]/[batch], /products/[slug],
 * /blog/[slug]) are tested via Phase 11 fixtures that seed cart + auth.
 */
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Phase 11 (v4): unskipped per D16 + D24. CI workflow installs Chromium
// via `npx playwright install --with-deps` before running this suite.

const STATIC_ROUTES = [
  '/',
  '/shop',
  '/blog',
  '/coa',
  '/faq',
  '/about',
  '/contact',
  '/affiliate',
  '/test-reports',
  '/cart',
  '/legal/terms',
  '/legal/privacy',
  '/legal/refunds',
  '/legal/shipping',
  '/legal/cookies',
  '/login',
  '/signup',
  '/newsletter/thanks',
] as const;

test.describe('axe-core a11y smoke', () => {
  for (const route of STATIC_ROUTES) {
    test(`${route} has no critical or serious axe violations`, async ({
      page,
    }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      expect(
        blocking,
        `Critical/serious axe violations on ${route}: ${blocking
          .map((v) => `${v.id} (${v.impact})`)
          .join(', ')}`,
      ).toHaveLength(0);
    });
  }

  test('keyboard tab order from landing page reaches the primary CTAs', async ({
    page,
  }) => {
    await page.goto('/');
    await page.keyboard.press('Tab'); // skip-link
    await page.keyboard.press('Tab'); // header — site mark
    await page.keyboard.press('Tab'); // header — first nav link
    // Should reach an in-page focusable element without hitting hidden traps.
    const active = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT'].includes(active ?? '')).toBe(true);
  });

  test('stagger surfaces render and the reduced-motion CSS rule disables animation', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/shop');
    // The wrapper is present regardless of mode (data-stagger-reveal
    // attribute is the SSR-stable hook). The real reduced-motion contract
    // is enforced by the global @media (prefers-reduced-motion: reduce)
    // rule in app/globals.css:235-242, which sets `animation: none !important`
    // on every element — verifiable via computed style on a known
    // animation-bearing element.
    const wrapper = page.locator('[data-stagger-reveal]').first();
    await expect(wrapper).toBeVisible();
    // Verify the CSS reduced-motion rule fires. Pick the COA stagger row
    // (pure-CSS animation: reveal-up) — under reduced-motion the computed
    // animationName must be 'none'.
    await page.goto('/coa');
    const animationName = await page.locator('[data-stagger-row]').first().evaluate(
      (el) => getComputedStyle(el).animationName,
    );
    expect(animationName).toBe('none');
  });
});
