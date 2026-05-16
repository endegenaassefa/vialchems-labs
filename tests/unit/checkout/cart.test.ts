import { describe, expect, it } from "vitest";
import {
  CHECKOUT_VERIFICATION_SKU,
  calculateCheckoutTotals,
  resolveCheckoutCartLines,
} from "@/lib/checkout/cart";

describe("checkout cart totals", () => {
  it("keeps the checkout verification SKU at a $1 shipped total", () => {
    const resolved = resolveCheckoutCartLines([
      {
        sku: CHECKOUT_VERIFICATION_SKU,
        slug: "checkout-verification-1usd",
        qty: 1,
      },
    ]);

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    expect(calculateCheckoutTotals(resolved.lines)).toEqual({
      subtotalCents: 100,
      shippingCents: 0,
      totalCents: 100,
    });
  });
});
