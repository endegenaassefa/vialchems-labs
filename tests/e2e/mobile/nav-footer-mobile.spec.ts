/**
 * M0h — Mobile nav + footer polish
 * (Section 6 super-prompt 2026-05-22).
 *
 * The legacy stylesheet already pulls `.nav-links` off-screen at
 * @media (max-width: 860px) and exposes the hamburger button via
 * `.v2-nav-menu { display: grid }`, and collapses `.foot-grid` to
 * `1fr 1fr` at 860 / `1fr` at 560. The Shell.tsx hamburger renders
 * a `role="dialog"` overlay with primary CTAs + nav links + an X
 * close button (client-side state via useState).
 *
 * This spec locks the structural mobile contract at iPhone SE
 * 375x667:
 *   - hamburger button is visible + >=44px tappable
 *   - footer renders without horizontal scroll
 *   - footer columns stack 1-col below 560 (any two adjacent
 *     `.foot-grid > div` share the same x-position)
 *
 * Open/close interaction of the dialog is covered by the unit-test
 * suite (V2Header + MobileNavMenu component tests run under jsdom
 * with React 19's fully hydrated render). End-to-end click
 * scripting through React 19 client-island hydration in Playwright
 * dev-mode is flaky enough that asserting the open/close cycle here
 * would block on harness behavior, not product behavior.
 */
import { expect, test } from "@playwright/test";
import {
  AGE_VERIFICATION_COOKIE,
  signAgeVerification,
} from "@/lib/age-verification";

const VIEWPORT = { width: 375, height: 667 } as const;

test.use({ viewport: VIEWPORT });

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

test("hamburger button is visible + >=44px tappable on mobile", async ({
  page,
}) => {
  await page.goto("/");
  const hamburger = page.getByRole("button", { name: /open menu/i });
  await expect(hamburger).toBeVisible();
  const box = await hamburger.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.min(box!.width, box!.height)).toBeGreaterThanOrEqual(44);
});

test("footer columns stack to a single column on mobile", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();

  const cols = page.locator("footer .foot-grid > div");
  const count = await cols.count();
  expect(count).toBeGreaterThanOrEqual(2);

  const firstBox = await cols.nth(0).boundingBox();
  const secondBox = await cols.nth(1).boundingBox();
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  // 1-col stack means consecutive columns share the same x-position
  // (within a 2px tolerance for sub-pixel rounding).
  expect(Math.abs(firstBox!.x - secondBox!.x)).toBeLessThanOrEqual(2);
});

test("footer renders without horizontal scroll on mobile", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
});
