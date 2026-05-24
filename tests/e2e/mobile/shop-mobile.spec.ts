/**
 * M0d — Shop catalog grid mobile playbook (Section 6 super-prompt 2026-05-22).
 *
 * RED-first spec asserting the catalog grid collapses to one column
 * at <640px (per the super-prompt breakpoints: 1-col under 640,
 * 2-col 640-1023, 3+ col 1024+). The current stylesheet collapses
 * to 2-col at 860px and 1-col at 560px, so iPhone SE / Pixel 7
 * land in the right tier but a 600px viewport (small Android,
 * portrait-locked iPad-mini) gets the 2-col grid the super-prompt
 * wants saved for >=640.
 *
 * Also asserts no horizontal scroll and a reasonable image height
 * for the first product card on mobile.
 */
import { expect, test } from "@playwright/test";
import {
  AGE_VERIFICATION_COOKIE,
  signAgeVerification,
} from "@/lib/age-verification";

const VIEWPORTS = [
  {
    name: "iPhone SE",
    width: 375,
    height: 667,
    expectedColumns: 1,
  },
  {
    name: "Small Android portrait",
    width: 600,
    height: 800,
    expectedColumns: 1,
  },
  {
    name: "Tablet portrait",
    width: 768,
    height: 1024,
    expectedColumns: 2,
  },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`Shop grid — ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ context, baseURL }) => {
      const verifiedAt = new Date().toISOString();
      const signed = await signAgeVerification(verifiedAt);
      const url = new URL(baseURL ?? "http://127.0.0.1:3200");
      await context.addCookies([
        {
          name: AGE_VERIFICATION_COOKIE,
          value: signed,
          domain: url.hostname,
          path: "/",
          httpOnly: false,
          secure: false,
          sameSite: "Lax",
        },
      ]);
    });

    test("renders /shop without horizontal scroll", async ({ page }) => {
      await page.goto("/shop");
      await expect(page.locator(".catalog-grid")).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });

    test(`renders the catalog grid at ${viewport.expectedColumns} column(s)`, async ({
      page,
    }) => {
      await page.goto("/shop");
      const cards = page.locator(".catalog-grid .product-card");
      await expect(cards.first()).toBeVisible();
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(2);

      // Inspect the X positions of the first row of cards. If two
      // consecutive cards share the same X, the grid is 1-col; if
      // their X positions differ, the grid is 2+ col. Three different
      // X values in the first three cards means 3-col.
      const firstX = (await cards.nth(0).boundingBox())!.x;
      const secondX = (await cards.nth(1).boundingBox())!.x;

      if (viewport.expectedColumns === 1) {
        expect(secondX).toBeCloseTo(firstX, 0);
      } else {
        expect(Math.abs(secondX - firstX)).toBeGreaterThan(20);
      }
    });

    test("renders at least 6 SKU cards on the page", async ({ page }) => {
      await page.goto("/shop");
      const cards = page.locator(".catalog-grid .product-card");
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(6);
    });
  });
}

// Tier-1 mobile-specific assertion: product-card image area must remain
// visually substantial. The current `.product-card .product-media` rule
// uses aspect-ratio 1/1 which on a 1-col grid at 375px gives ~327-card
// width minus padding → ~265px wide. >=160 keeps the SKU recognisable.
test.describe("Shop grid — product card image floor (iPhone SE)", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ context, baseURL }) => {
    const verifiedAt = new Date().toISOString();
    const signed = await signAgeVerification(verifiedAt);
    const url = new URL(baseURL ?? "http://127.0.0.1:3200");
    await context.addCookies([
      {
        name: AGE_VERIFICATION_COOKIE,
        value: signed,
        domain: url.hostname,
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
  });

  test("first product card image area is at least 160px on the short edge", async ({
    page,
  }) => {
    await page.goto("/shop");
    const media = page
      .locator(".catalog-grid .product-card .product-media")
      .first();
    await expect(media).toBeVisible();
    const box = await media.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.min(box!.width, box!.height)).toBeGreaterThanOrEqual(160);
  });
});
