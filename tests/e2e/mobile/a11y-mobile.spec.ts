/**
 * M0j — Mobile axe-core a11y sweep
 * (Section 6 super-prompt 2026-05-22).
 *
 * Locks the iPhone SE (375x667) a11y contract for the 14 most-
 * visited content routes + the two signed payment checkouts. All
 * 16 assertions pass green on the LOCKED v5 LIGHT clinical theme
 * (`docs/DECISIONS/locked_override_2026-05-20.md`) following the
 * theme-reconciliation PR that switched `data-theme="dark"` →
 * `"light"` in `app/layout.tsx`, bumped `--fg-muted` / `--fg-subtle`
 * to >=4.5:1 contrast values, darkened `--ok` / `--warn` for badge
 * AA, and added `aria-label="Sort catalog"` to the catalog sort
 * select.
 *
 * Scope: critical + serious only, mirroring the legacy
 * tests/e2e/a11y.spec.ts contract. The super-prompt §6 M0j SUCCESS
 * CRITERIA also calls for "axe-core reports zero violations on
 * every page" (i.e. moderate + minor inclusive). Lifting the gate
 * is an M0j-followup once we measure the moderate/minor surface.
 */
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  AGE_VERIFICATION_COOKIE,
  signAgeVerification,
} from "@/lib/age-verification";
import { signZelleCheckoutParams } from "@/lib/checkout/direct-payment";
import { signBitcoinDirectCheckoutParams } from "@/lib/payments/bitcoin-direct";

const VIEWPORT = { width: 375, height: 667 } as const;

const A11Y_ROUTES = [
  "/",
  "/shop",
  "/coa",
  "/faq",
  "/about",
  "/contact",
  "/cart",
  "/login",
  "/signup",
  "/legal/terms",
  "/legal/privacy",
  "/products/bpc-157-10mg",
  "/checkout/address",
  "/checkout/review",
] as const;

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

for (const route of A11Y_ROUTES) {
  test(`${route} has no critical/serious axe violations at iPhone SE`, async ({
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

// Signed payment-rail checkout pages — the legacy a11y spec
// skips these because they require a signed URL. Mobile is the
// dominant viewport for ad-traffic and the M0a/M0b PRs reshaped
// the layouts, so an a11y guard at iPhone SE here protects the
// conversion path from any future change that re-introduces a
// color-contrast or tap-target regression.
test("/checkout/zelle (signed) has no critical/serious axe violations at iPhone SE", async ({
  page,
}) => {
  const params = new URLSearchParams();
  params.set("order", "VCL-M0J-A11Y");
  params.set("amount_cents", "12300");
  params.set("recipient_name", "Vialchem Labs LLC");
  params.set("recipient_handle", "vialchem-pay");
  params.set("memo", "VCL-VCL-M0J-A11Y");
  params.set("zelle_email", "");
  params.set("zelle_phone", "");
  params.set("support_email", "research@vialchemlabs.net");
  params.set("qr_image_url", "/payments/zelle-qr.png");
  const sig = signZelleCheckoutParams(
    params,
    "local-zelle-checkout-signing-secret",
  );
  params.set("sig", sig);
  await page.goto(`/checkout/zelle?${params.toString()}`);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  expect(
    blocking,
    `Critical/serious axe violations on /checkout/zelle: ${blocking
      .map((v) => `${v.id} (${v.impact})`)
      .join(", ")}`,
  ).toHaveLength(0);
});

test("/checkout/bitcoin (signed direct) has no critical/serious axe violations at iPhone SE", async ({
  page,
}) => {
  const params = new URLSearchParams();
  params.set("mode", "direct");
  params.set("order", "VCL-M0J-A11Y");
  params.set("amount_cents", "12300");
  params.set("btc_sats", "210000");
  params.set("btc_amount", "0.00210000");
  params.set("btc_usd_cents", "5850000");
  params.set("address", "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq");
  params.set("rate_source", "https://api.coinbase.com/v2/prices/BTC-USD/spot");
  params.set("quoted_at", "2026-05-22T20:00:00.000Z");
  params.set("support_email", "research@vialchemlabs.net");
  const sig = signBitcoinDirectCheckoutParams(
    params,
    "local-bitcoin-direct-signing-secret",
  );
  params.set("sig", sig);
  await page.goto(`/checkout/bitcoin?${params.toString()}`);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  expect(
    blocking,
    `Critical/serious axe violations on /checkout/bitcoin: ${blocking
      .map((v) => `${v.id} (${v.impact})`)
      .join(", ")}`,
  ).toHaveLength(0);
});
