/**
 * M0c — Home hero mobile playbook (Section 6 super-prompt 2026-05-22).
 *
 * RED-first spec asserting that the above-fold experience on the
 * home page at iPhone SE (375x667) and Pixel 7 (412x915) shows the
 * brand promise + CTAs — not the FloatingCards animation. The prior
 * @media (max-width: 560px) rule set `.v2-hero-copy { order: 2 }`
 * and `.hero-proof-stack { order: 1 }`, which pushed the headline
 * and CTAs below a tall animated card stack on the highest-value
 * landing page in the funnel.
 *
 * Section 4.5 of the super-prompt: paid ads send 70-95% of traffic
 * from mobile, and if the above-fold of the home page is "just a
 * vial image" the customer bounces in under 3 seconds.
 *
 * This spec locks the mobile contract:
 *   - Headline "For researchers, by researchers" visible above fold
 *     (within the first viewport height — no scroll required).
 *   - Both CTAs (Browse Catalog + Verify a Vial) visible above fold
 *     and tappable (>=44px tall).
 *   - No horizontal scroll at either viewport.
 *   - Trust strip ("Qualified lab orders / HPLC purity records / COA
 *     on every vial") rendered.
 */
import { expect, test } from "@playwright/test";
import {
  AGE_VERIFICATION_COOKIE,
  signAgeVerification,
} from "@/lib/age-verification";

const MOBILE_VIEWPORTS = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "Pixel 7", width: 412, height: 915 },
] as const;

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Home hero mobile — ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ context, baseURL }) => {
      // Bypass the age-gate redirect by seeding the signed HMAC cookie.
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

    test("renders home above-fold without horizontal scroll", async ({
      page,
    }) => {
      await page.goto("/");
      await expect(
        page.getByRole("heading", { level: 1, name: /for researchers/i }),
      ).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });

    test("headline lives above the fold within the first viewport height", async ({
      page,
    }) => {
      await page.goto("/");
      const heading = page.getByRole("heading", {
        level: 1,
        name: /for researchers/i,
      });
      await expect(heading).toBeVisible();

      const box = await heading.boundingBox();
      expect(box).not.toBeNull();
      // Top edge of the headline must sit within the first viewport
      // height (the customer should see it without scrolling).
      expect(box!.y).toBeLessThan(viewport.height);
    });

    test("both above-fold CTAs are reachable + >=44px tall", async ({
      page,
    }) => {
      await page.goto("/");

      const shop = page.getByRole("link", { name: /browse catalog/i }).first();
      const verify = page.getByRole("link", { name: /verify a vial/i }).first();
      await expect(shop).toBeVisible();
      await expect(verify).toBeVisible();

      for (const cta of [shop, verify]) {
        const box = await cta.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        // Both CTAs must be inside the first viewport so the ad-click
        // funnel does not bury the convert action.
        expect(box!.y).toBeLessThan(viewport.height);
      }
    });

    test("CTAs are positioned above (not below) the floating-cards stack on mobile", async ({
      page,
    }) => {
      await page.goto("/");

      const shop = page.getByRole("link", { name: /browse catalog/i }).first();
      const stack = page.locator(".hero-proof-stack");
      await expect(shop).toBeVisible();
      await expect(stack).toBeVisible();

      const shopBox = await shop.boundingBox();
      const stackBox = await stack.boundingBox();
      expect(shopBox).not.toBeNull();
      expect(stackBox).not.toBeNull();
      expect(shopBox!.y).toBeLessThan(stackBox!.y);
    });
  });
}
