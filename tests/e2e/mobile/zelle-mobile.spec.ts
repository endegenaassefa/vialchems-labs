/**
 * M0a — Zelle checkout mobile playbook (Section 6 super-prompt 2026-05-22).
 *
 * RED-first spec asserting the mobile-responsive contract for
 * /checkout/zelle. The desktop layout uses an inline two-column grid
 * (`minmax(0, 1fr) minmax(280px, 360px)`) that does not collapse below
 * the page-level container; on a 375px viewport the right rail forces
 * horizontal scroll and the QR + amount slip below readable thresholds.
 *
 * This spec locks the mobile contract: no horizontal scroll, QR visible
 * at >=240px, total prominent (>=24px), tap-targets >=44px on every
 * copy/submit button, and form inputs at >=16px (iOS auto-zoom guard).
 *
 * The spec uses dev-default secrets:
 *   - signZelleCheckoutParams(...) signs the checkout URL with the dev
 *     default `local-zelle-checkout-signing-secret`
 *   - signAgeVerification() sets the HMAC-signed age-gate cookie with the
 *     dev default `dev-only-age-gate-secret`
 * (see lib/checkout/direct-payment.ts + lib/age-verification.ts).
 */
import { expect, test } from "@playwright/test";
import {
  getZelleCheckoutSigningSecret,
  signZelleCheckoutParams,
} from "@/lib/checkout/direct-payment";
import {
  AGE_VERIFICATION_COOKIE,
  signAgeVerification,
} from "@/lib/age-verification";

// Derive the signing secret from the same helper the server uses so the test
// stays correct when CI sets `ZELLE_CHECKOUT_SIGNING_SECRET` or `AGE_GATE_SECRET`
// (production-runtime path). Codex-review finding [P2] (M0a follow-up):
// hard-coding `"local-zelle-checkout-signing-secret"` only matched the dev
// fallback and landed on the invalid-link branch in any environment with a
// configured secret. The webServer and the test share process.env, so reading
// through the same helper guarantees the two sides agree.
const SIGNING_SECRET = getZelleCheckoutSigningSecret();

const MOBILE_VIEWPORTS = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "Pixel 7", width: 412, height: 915 },
] as const;

function buildSignedZelleUrl(): string {
  const params = new URLSearchParams();
  params.set("order", "VCL-M0A-TEST");
  params.set("amount_cents", "12300");
  params.set("recipient_name", "Vialchem Labs LLC");
  params.set("recipient_handle", "vialchem-pay");
  params.set("memo", "VCL-VCL-M0A-TEST");
  params.set("zelle_email", "");
  params.set("zelle_phone", "");
  params.set("support_email", "research@vialchemlabs.net");
  params.set("qr_image_url", "/payments/zelle-qr.png");
  const sig = signZelleCheckoutParams(params, SIGNING_SECRET);
  params.set("sig", sig);
  return `/checkout/zelle?${params.toString()}`;
}

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Zelle mobile — ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
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

    test("renders signed checkout layout without horizontal scroll", async ({
      page,
    }) => {
      await page.goto(buildSignedZelleUrl());

      // The "Invalid checkout link" branch is the negative path; the test
      // must hit the GREEN branch where signature verifies.
      await expect(
        page.getByRole("heading", { name: /send zelle payment/i }),
      ).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });

    test("QR code is visible and at least 240px on the long edge", async ({
      page,
    }) => {
      await page.goto(buildSignedZelleUrl());

      const qr = page.getByAltText(/zelle qr code/i);
      await expect(qr).toBeVisible();

      const box = await qr.boundingBox();
      expect(box).not.toBeNull();
      expect(Math.max(box!.width, box!.height)).toBeGreaterThanOrEqual(240);
    });

    test("Zelle handle is visible with a >=44px tap-to-copy button", async ({
      page,
    }) => {
      await page.goto(buildSignedZelleUrl());

      await expect(page.getByText("vialchem-pay")).toBeVisible();

      const copyHandle = page.getByRole("button", { name: /copy zelle id/i });
      await expect(copyHandle).toBeVisible();
      const box = await copyHandle.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test("memo is visible with a >=44px tap-to-copy button", async ({
      page,
    }) => {
      await page.goto(buildSignedZelleUrl());

      await expect(page.getByText("VCL-VCL-M0A-TEST")).toBeVisible();

      const copyMemo = page.getByRole("button", { name: /copy memo/i });
      await expect(copyMemo).toBeVisible();
      const box = await copyMemo.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test("total amount renders at >=24px font-size", async ({ page }) => {
      await page.goto(buildSignedZelleUrl());

      // $123.00 — the formatted output of 12300 cents.
      const amount = page.getByTestId("zelle-amount");
      await expect(amount).toBeVisible();
      await expect(amount).toContainText("$123.00");

      const fontSizePx = await amount.evaluate(
        (el) =>
          Number.parseFloat(window.getComputedStyle(el).fontSize ?? "0") || 0,
      );
      expect(fontSizePx).toBeGreaterThanOrEqual(24);
    });

    test("receipt form inputs render at >=16px to prevent iOS auto-zoom", async ({
      page,
    }) => {
      await page.goto(buildSignedZelleUrl());

      // Covers BOTH `.input` and `.input.mono` selectors. State + ZIP use
      // the mono variant which previously inherited `font-size: 13px` and
      // would auto-zoom on iOS even with the .input mobile override —
      // see codex-review finding [P2] in the M0a follow-up.
      const inputs = [
        page.locator("#zelle-name"),
        page.locator("#zelle-email"),
        page.locator("#zelle-state"),
        page.locator("#zelle-zip"),
      ];
      for (const input of inputs) {
        await expect(input).toBeVisible();
      }

      for (const input of inputs) {
        const fontSizePx = await input.evaluate(
          (el) =>
            Number.parseFloat(window.getComputedStyle(el).fontSize ?? "0") || 0,
        );
        expect(fontSizePx).toBeGreaterThanOrEqual(16);
      }
    });

    test("submit-receipt button is reachable + >=44px tall", async ({
      page,
    }) => {
      await page.goto(buildSignedZelleUrl());

      const submit = page.getByRole("button", { name: /submit zelle receipt/i });
      await expect(submit).toBeVisible();
      const box = await submit.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });
  });
}
