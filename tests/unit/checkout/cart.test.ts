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

  it("rejects custom-request catalog items at checkout", () => {
    const resolved = resolveCheckoutCartLines([
      {
        sku: "TB-500-5MG",
        slug: "tb-500-5mg",
        qty: 1,
      },
    ]);

    expect(resolved).toEqual({
      ok: false,
      message: "TB-500, 5mg vial is available by custom request only.",
    });
  });
});
