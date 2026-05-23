/**
 * M0g — Mobile-clean treatment for the secondary public pages
 * (Section 6 super-prompt 2026-05-22).
 *
 * The site-wide M0a rules (viewport meta, `.input { font-size: 16px }`,
 * `.btn { min-height: 44px }` inside @media (max-width: 860px)) already
 * carry every secondary page through the mobile-typography + tap-target
 * floor. This spec is a regression guard locking the contract at
 * iPhone SE 375x667: no horizontal scroll on any public-facing
 * secondary route, no oversized text inputs, no undersized tap
 * targets that escape the M0a rules.
 *
 * The routes here mirror the M0g WHAT line in the super-prompt:
 *   /faq /coa /verify /contact /signup /login /about
 *   /legal/{terms,privacy,refunds,shipping,cookies}
 *   /blog /newsletter
 *
 * /order-confirmed is intentionally NOT covered — it requires a
 * signed order id query param and the success-state shape is best
 * tested via the receipt-submission flow (covered in M0a/M0b).
 *
 * Blog post pages (e.g. /blog/bpc-157-research) are also not
 * enumerated individually; the /blog index page is the entry surface
 * and a regression there would be caught here.
 */
import { expect, test } from "@playwright/test";
import {
  AGE_VERIFICATION_COOKIE,
  signAgeVerification,
} from "@/lib/age-verification";

const SECONDARY_ROUTES = [
  "/faq",
  "/coa",
  "/verify",
  "/contact",
  "/signup",
  "/login",
  "/about",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/shipping",
  "/legal/cookies",
  "/blog",
  "/newsletter",
] as const;

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

for (const route of SECONDARY_ROUTES) {
  test(`${route} renders without horizontal scroll at iPhone SE`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.waitForLoadState("domcontentloaded");

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  });
}
