/**
 * M0b — Bitcoin checkout mobile playbook (Section 6 super-prompt 2026-05-22).
 *
 * RED-first spec asserting the mobile-responsive contract for
 * /checkout/bitcoin?mode=direct. The desktop layout uses an inline
 * two-column grid (`minmax(0, 1fr) minmax(300px, 380px)`) and inline
 * font-sizes (22, 26) that on a 375px viewport push the "Send exactly
 * BTC" amount and address card into a cramped column with the receipt
 * form alongside. The form inputs also use an inline FIELD_STYLE
 * object (not the `.input` class), so the M0a `.input { font-size:
 * 16px }` mobile rule never applies and every focus event triggers
 * iOS Safari auto-zoom.
 *
 * This spec locks the mobile contract for the Bitcoin checkout flow:
 * no horizontal scroll, layout stacks to one column, BTC amount
 * prominent (>=24px), receive address visible with a tap-to-copy
 * button (>=44px), form inputs at >=16px on every field, submit
 * button reachable + >=44px tall. QR-code generation is deferred to
 * a follow-up PR (would require adding `qrcode` npm dependency); the
 * existing `bitcoin:` URI deep-link button satisfies the mobile
 * wallet-handoff for the M0b ship-bar.
 */
import { expect, test } from "@playwright/test";
import {
  getBitcoinDirectSigningSecret,
  signBitcoinDirectCheckoutParams,
} from "@/lib/payments/bitcoin-direct";
import {
  AGE_VERIFICATION_COOKIE,
  signAgeVerification,
} from "@/lib/age-verification";

const SIGNING_SECRET = getBitcoinDirectSigningSecret();

const MOBILE_VIEWPORTS = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "Pixel 7", width: 412, height: 915 },
] as const;

const TEST_ADDRESS = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";

function buildSignedBitcoinUrl(): string {
  const params = new URLSearchParams();
  params.set("mode", "direct");
  params.set("order", "VCL-M0B-TEST");
  params.set("amount_cents", "12300");
  params.set("btc_sats", "210000");
  params.set("btc_amount", "0.00210000");
  params.set("btc_usd_cents", "5850000");
  params.set("address", TEST_ADDRESS);
  params.set("rate_source", "https://api.coinbase.com/v2/prices/BTC-USD/spot");
  params.set("quoted_at", "2026-05-22T20:00:00.000Z");
  params.set("support_email", "research@vialchemlabs.net");
  const sig = signBitcoinDirectCheckoutParams(params, SIGNING_SECRET);
  params.set("sig", sig);
  return `/checkout/bitcoin?${params.toString()}`;
}

for (const viewport of MOBILE_VIEWPORTS) {
  test.describe(`Bitcoin mobile — ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ context, baseURL }) => {
      // Bypass the age-gate redirect by seeding the signed HMAC cookie —
      // mirrors the M0a Zelle spec setup.
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

    test("renders signed direct-mode layout without horizontal scroll", async ({
      page,
    }) => {
      await page.goto(buildSignedBitcoinUrl());

      await expect(
        page.getByRole("heading", { name: /complete bitcoin payment/i }),
      ).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });

    test("BTC amount renders at >=24px font-size", async ({ page }) => {
      await page.goto(buildSignedBitcoinUrl());

      const amount = page.getByTestId("bitcoin-amount");
      await expect(amount).toBeVisible();
      await expect(amount).toContainText("0.00210000");

      const fontSizePx = await amount.evaluate(
        (el) =>
          Number.parseFloat(window.getComputedStyle(el).fontSize ?? "0") || 0,
      );
      expect(fontSizePx).toBeGreaterThanOrEqual(24);
    });

    test("receive address is visible with a >=44px tap-to-copy button", async ({
      page,
    }) => {
      await page.goto(buildSignedBitcoinUrl());

      await expect(page.getByTestId("bitcoin-address")).toContainText(
        TEST_ADDRESS,
      );

      const copyAddress = page.getByRole("button", {
        name: /copy bitcoin address/i,
      });
      await expect(copyAddress).toBeVisible();
      const box = await copyAddress.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test("open-wallet button is reachable + >=44px tall", async ({ page }) => {
      await page.goto(buildSignedBitcoinUrl());

      const openWallet = page.getByRole("link", {
        name: /open wallet payment request/i,
      });
      await expect(openWallet).toBeVisible();
      const box = await openWallet.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test("receipt form inputs render at >=16px to prevent iOS auto-zoom", async ({
      page,
    }) => {
      await page.goto(buildSignedBitcoinUrl());

      // Cover every text input on the BitcoinReceiptForm. The form
      // shipped with inline FIELD_STYLE that bypassed the .input class,
      // so the M0a auto-zoom guard does not reach these fields until
      // M0b rewires the markup.
      const inputs = [
        page.locator('input[name="txid"]'),
        page.locator('input[name="name"]'),
        page.locator('input[name="email"]'),
        page.locator('input[name="street"]'),
        page.locator('input[name="city"]'),
        page.locator('input[name="stateCode"]'),
        page.locator('input[name="zip"]'),
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
      await page.goto(buildSignedBitcoinUrl());

      const submit = page.getByRole("button", {
        name: /submit bitcoin receipt/i,
      });
      await expect(submit).toBeVisible();
      const box = await submit.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });
  });
}
