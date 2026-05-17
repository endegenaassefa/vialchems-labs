/**
 * Phase 11.3 (v4) — D25 visual-regression baseline.
 *
 * Iron Law 2.18: every PR that touches user-facing surfaces runs this
 * suite. Diffs above 0.1% pixel ratio (Playwright default + project
 * config) require explicit operator approval before merge.
 * Iron Law 2.25: branch protection (Phase 12) requires the operator's
 * GitHub `approved` review state on visual diffs.
 *
 * Coverage: every static route in the table × 3 viewports.
 * Color scheme: dark default — vialchemlabs is Posture A LOCKED dark.
 * The spec note about "capture both for future-proof" is deferred to a
 * Phase 12+ expansion if the operator ever opens up a light-mode toggle.
 *
 * Snapshots commit to tests/e2e/__screenshots__/. CI runs
 * `--update-snapshots` only on the operator-approved baseline-refresh PR.
 */
import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  "/",
  "/shop",
  "/coa",
  "/about",
  "/blog",
  "/faq",
  "/contact",
  "/affiliate",
  "/test-reports",
  "/cart",
  "/login",
  "/signup",
  "/newsletter/thanks",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/shipping",
  "/legal/cookies",
  "/products/bpc-157-10mg",
  "/products/tb-500-10mg",
  "/products/ghk-cu-50mg",
  "/products/ipamorelin-10mg",
  "/products/cjc-1295-no-dac-5mg",
  "/products/mots-c-10mg",
  "/products/selank-10mg",
  "/products/recovery-stack",
  "/blog/bpc-157-research",
  "/blog/tb-500-research",
  "/blog/ghk-cu-research",
  "/blog/recovery-stack-synergy",
  "/blog/reading-a-coa",
  "/coa/bpc-157-10mg/BATCH-2026-PLACEHOLDER",
  "/coa/tb-500-10mg/BATCH-2026-PLACEHOLDER",
  "/coa/ghk-cu-50mg/BATCH-2026-PLACEHOLDER",
  "/checkout/address",
  "/checkout/method",
  "/checkout/review",
  "/checkout/confirm",
] as const;

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

async function dismissCookieConsent(page: Page): Promise<void> {
  // The CookieConsent banner is client-only and renders on first paint
  // only when the cookie is unset. Pre-set the consent cookie to a
  // "rejected-all" state so screenshots are stable across runs.
  await page.context().addCookies([
    {
      name: "vc-consent",
      value: encodeURIComponent(
        JSON.stringify({
          version: 1,
          decidedAt: "2026-01-01T00:00:00.000Z",
          categories: {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
          },
        }),
      ),
      url: page.url() === "about:blank" ? undefined : page.url(),
      domain: new URL(
        process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3200",
      ).hostname,
      path: "/",
    },
  ]);
}

test.describe("visual-regression baseline", () => {
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      test(`${route} @ ${viewport.name}`, async ({ page, context }) => {
        await context.addCookies([
          {
            name: "vc-consent",
            value: encodeURIComponent(
              JSON.stringify({
                version: 1,
                decidedAt: "2026-01-01T00:00:00.000Z",
                categories: {
                  necessary: true,
                  functional: false,
                  analytics: false,
                  marketing: false,
                },
              }),
            ),
            domain: new URL(
              process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3200",
            ).hostname,
            path: "/",
          },
        ]);
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(route, { waitUntil: "networkidle" });
        // Disable scroll-triggered + sheen animations for snapshot
        // stability — vialchemlabs motion vocabulary is otherwise
        // baseline-stable thanks to the global @media reduced-motion rule.
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.waitForTimeout(200);
        await expect(page).toHaveScreenshot(
          `${route.replace(/^\//, "").replace(/\//g, "_") || "home"}-${viewport.name}.png`,
          {
            fullPage: true,
            animations: "disabled",
          },
        );
        // Reference dismissCookieConsent so the import isn't a dead branch
        // when CI replays this suite without a cookie context.
        void dismissCookieConsent;
      });
    }
  }
});
