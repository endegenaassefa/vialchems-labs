/**
 * Accessibility E2E suite — runs axe-core against every static + dynamic route.
 *
 * Phase 8 ships the suite skipped (browsers not provisioned here). Phase 11
 * unskips, runs `npx playwright install --with-deps` in CI, and gates merges
 * on 0 critical / 0 serious axe violations per Iron Law 2.18 + the v4 §7.2
 * a11y baseline.
 *
 * Phase 7.6 (v5 closure G6) — H20 closure. The original suite covered only
 * 18 static routes; this revision adds dynamic-route coverage so audit
 * H20 (a11y dynamic route gap) lands GREEN:
 *   - PDP: `/products/bpc-157-10mg`
 *   - Blog post: `/blog/reading-a-coa`
 *   - Checkout subpages: `/checkout/address`, `/checkout/method`,
 *     `/checkout/review`, `/checkout/confirm`
 *
 * COA detail (`/coa/[peptide]/[batch]`) intentionally deferred — `coaRecords`
 * in `lib/content/coa.ts` is the empty array (`[]`) at v1.0.0 launch, so
 * every `/coa/<peptide>/<batch>` URL renders Next.js's `notFound()` boundary
 * and therefore returns a 404 status that the dev server reports back as the
 * Next.js default 404 page. axe-testing the default 404 chrome adds zero
 * signal for the dynamic-route content layer. When the operator uploads the
 * first real COA (Phase 7.7 placeholder PDFs already shipped), this suite
 * SHOULD be extended to cover one real `/coa/<peptide>/<batch>` URL.
 *
 * Account dynamic routes (`/account/orders/[id]`) likewise deferred — Phase 9
 * gates auth, and an unauthenticated request to `/account/*` either renders
 * a login redirect or an empty-state placeholder; coverage waits until Phase
 * 9 lands the seeded-user fixture.
 *
 * Checkout subpages render an empty-cart redirect placeholder when no cart
 * is hydrated (see `components/CheckoutGuard.tsx`). That placeholder is the
 * a11y surface for unauthenticated/no-cart visitors and is a legitimate
 * target — axe runs against whatever DOM is present after page load.
 */
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Phase 11 (v4): unskipped per D16 + D24. CI workflow installs Chromium
// via `npx playwright install --with-deps` before running this suite.

const STATIC_ROUTES = [
  "/",
  "/shop",
  "/blog",
  "/coa",
  "/faq",
  "/about",
  "/contact",
  "/affiliate",
  "/test-reports",
  "/cart",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/shipping",
  "/legal/cookies",
  "/login",
  "/signup",
  "/newsletter/thanks",
] as const;

// Phase 7.6 (v5 closure G6) — dynamic routes covered with no fixture
// dependency. PDP and blog post hit `generateStaticParams` so SSR returns
// real content; checkout subpages render the CheckoutGuard placeholder when
// no cart is hydrated, which is the contract for first-time visitors.
const DYNAMIC_ROUTES = [
  "/products/bpc-157-10mg",
  "/blog/reading-a-coa",
  "/checkout/address",
  "/checkout/method",
  "/checkout/review",
  "/checkout/confirm",
] as const;

const ALL_ROUTES = [...STATIC_ROUTES, ...DYNAMIC_ROUTES];

test.describe("axe-core a11y smoke", () => {
  for (const route of ALL_ROUTES) {
    test(`${route} has no critical or serious axe violations`, async ({
      page,
    }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      expect(
        blocking,
        `Critical/serious axe violations on ${route}: ${blocking
          .map((v) => `${v.id} (${v.impact})`)
          .join(", ")}`,
      ).toHaveLength(0);
    });
  }

  test("keyboard tab order from landing page reaches the primary CTAs", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab"); // skip-link
    await page.keyboard.press("Tab"); // header — site mark
    await page.keyboard.press("Tab"); // header — first nav link
    // Should reach an in-page focusable element without hitting hidden traps.
    const active = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON", "INPUT"].includes(active ?? "")).toBe(true);
  });

  test("stagger surfaces render and the reduced-motion CSS rule disables animation", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/shop");
    // The wrapper is present regardless of mode (data-stagger-reveal
    // attribute is the SSR-stable hook). The real reduced-motion contract
    // is enforced by the global @media (prefers-reduced-motion: reduce)
    // rule in app/globals.css:235-242, which sets `animation: none !important`
    // on every element — verifiable via computed style on a known
    // animation-bearing element.
    const wrapper = page.locator("[data-stagger-reveal]").first();
    await expect(wrapper).toBeVisible();
    // Verify the CSS reduced-motion rule fires. Pick the COA stagger row
    // (pure-CSS animation: reveal-up) — under reduced-motion the computed
    // animationName must be 'none'.
    await page.goto("/coa");
    const animationName = await page
      .locator("[data-stagger-row]")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).toBe("none");
  });
});
