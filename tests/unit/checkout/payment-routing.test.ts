import { describe, expect, it } from "vitest";
import {
  CHECKOUT_PAYMENT_METHOD_INFO,
  getCheckoutActionLabel,
  getCheckoutApiRoute,
  isComingSoonCheckoutMethod,
  isLiveCheckoutMethod,
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
  ])("marks %s as a coming-soon WooCommerce method", (method) => {
    expect(isWooCheckoutMethod(method)).toBe(true);
    expect(isMainSiteCheckoutMethod(method)).toBe(false);
    expect(isComingSoonCheckoutMethod(method)).toBe(true);
    expect(isLiveCheckoutMethod(method)).toBe(false);
    expect(getCheckoutApiRoute(method)).toBeNull();
  });

  it("uses payment-specific action labels", () => {
    expect(getCheckoutActionLabel("bitcoin")).toBe("Continue with Bitcoin");
    expect(getCheckoutActionLabel("zelle")).toBe("Continue with Zelle");
    expect(getCheckoutActionLabel("link_money")).toBe("Coming Soon");
  });

  it("labels the route and availability for every payment option", () => {
    expect(CHECKOUT_PAYMENT_METHOD_INFO).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "bitcoin",
          route: "main-site",
          availability: "live",
        }),
        expect.objectContaining({
          id: "zelle",
          route: "main-site",
          availability: "live",
        }),
        expect.objectContaining({
          id: "paypal",
          route: "woocommerce",
          availability: "coming-soon",
        }),
      ]),
    );
  });
});
