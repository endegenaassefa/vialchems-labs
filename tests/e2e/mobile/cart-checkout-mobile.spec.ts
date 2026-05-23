/**
 * M0f — Cart + checkout-review mobile regression guard
 * (Section 6 super-prompt 2026-05-22).
 *
 * Both /cart and /checkout/review already collapse cleanly on mobile
 * via the legacy `.v2-cart-layout` (560px → 1fr stack) and the
 * Tailwind `lg:grid-cols-[3fr_2fr]` (≥1024 only) rules. The 16px
 * input-font and 44px tap-target floors come from the site-wide
 * mobile rules landed in M0a (`.input` 16px + `.btn` 44px min-height
 * inside @media (max-width: 860px)). The Bitcoin form already routes
 * through the `.input` class as of M0b; the cart and checkout/review
 * pages render with shared headers/footers that follow the same
 * site-wide rules.
 *
 * This spec locks the only assertion that benefits from a dedicated
 * e2e check: no horizontal scroll on either page at iPhone SE +
 * Pixel 7. Input font-size + tap-target assertions are covered for
 * the highest-value flows by the Zelle (M0a) + Bitcoin (M0b) specs
 * which test the actual receipt-submission forms; expanding the
 * coverage to the cart page-shell would require seeding the
 * zustand-persist cart store which has a hydration race with the
 * empty-cart render branch and is best left to a follow-up.
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

async function ageGateBypass({
  context,
  baseURL,
}: {
  context: import("@playwright/test").BrowserContext;
  baseURL?: string;
}) {
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
}

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Cart + checkout/review — ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ context, baseURL }) => {
      await ageGateBypass({ context, baseURL });
    });

    test("/cart renders without horizontal scroll", async ({ page }) => {
      await page.goto("/cart");
      await expect(
        page.getByRole("heading", { name: /review your order/i }),
      ).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });

    test("/checkout/review renders without horizontal scroll", async ({
      page,
    }) => {
      await page.goto("/checkout/review");
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });
  });
}
