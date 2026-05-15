import { describe, expect, it } from "vitest";
import {
  CHECKOUT_PAYMENT_METHOD_INFO,
  getCheckoutActionLabel,
  getCheckoutApiRoute,
  isMainSiteCheckoutMethod,
  isWooCheckoutMethod,
  type CheckoutPaymentMethod,
} from "@/lib/checkout/payment-routing";

describe("split checkout payment routing", () => {
  it.each<CheckoutPaymentMethod>(["bitcoin", "zelle"])(
    "keeps %s on the main site",
    (method) => {
      expect(isMainSiteCheckoutMethod(method)).toBe(true);
      expect(isWooCheckoutMethod(method)).toBe(false);
      expect(getCheckoutApiRoute(method)).not.toBe("/api/create-woo-order");
    },
  );

  it.each<CheckoutPaymentMethod>([
    "link_money",
    "card",
    "apple_pay",
    "google_pay",
    "paypal",
  ])("routes %s through WooCommerce", (method) => {
    expect(isWooCheckoutMethod(method)).toBe(true);
    expect(isMainSiteCheckoutMethod(method)).toBe(false);
    expect(getCheckoutApiRoute(method)).toBe("/api/create-woo-order");
  });

  it("uses payment-specific action labels", () => {
    expect(getCheckoutActionLabel("bitcoin")).toBe("Continue with Bitcoin");
    expect(getCheckoutActionLabel("zelle")).toBe("Continue with Zelle");
    expect(getCheckoutActionLabel("link_money")).toBe(
      "Proceed to Secure Checkout",
    );
  });

  it("labels the visible route for every payment option", () => {
    expect(CHECKOUT_PAYMENT_METHOD_INFO).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "bitcoin", route: "main-site" }),
        expect.objectContaining({ id: "zelle", route: "main-site" }),
        expect.objectContaining({ id: "paypal", route: "woocommerce" }),
      ]),
    );
  });
});
