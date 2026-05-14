/**
 * Payment types + discount calculation tests.
 *
 * Verifies the locked discount bands per DECISIONS/payment_stack.md:
 *   - crypto = 15% (top of 10-15% band)
 *   - ach    = 5%
 *   - card   = 0% (Phase 2 only; never gets a discount)
 *   - zelle  = 0% (manual bank-payment rail)
 *
 * Reference SKU: BPC-157 ($54.00 = 5400 cents)
 *   crypto → discount 810,  total 4590  ($45.90)
 *   ach    → discount 270,  total 5130  ($51.30)
 *   card   → discount 0,    total 5400  ($54.00)
 *   zelle  → discount 0,    total 5400  ($54.00)
 */
import { describe, expect, it } from "vitest";
import {
  applyPaymentMethodDiscount,
  PAYMENT_DISCOUNT_PCT,
} from "@/lib/payments/types";

describe("PAYMENT_DISCOUNT_PCT", () => {
  it("locks crypto at 15%", () => {
    expect(PAYMENT_DISCOUNT_PCT.crypto).toBe(0.15);
  });

  it("locks ACH at 5%", () => {
    expect(PAYMENT_DISCOUNT_PCT.ach).toBe(0.05);
  });

  it("locks card at 0% (Phase 2; never gets a discount)", () => {
    expect(PAYMENT_DISCOUNT_PCT.card).toBe(0);
  });

  it("locks Zelle at 0% because it is manual bank payment", () => {
    expect(PAYMENT_DISCOUNT_PCT.zelle).toBe(0);
  });
});

describe("applyPaymentMethodDiscount", () => {
  it("BPC-157 $54.00 + crypto → $45.90", () => {
    const result = applyPaymentMethodDiscount(5400, "crypto");
    expect(result.discountCents).toBe(810);
    expect(result.totalCents).toBe(4590);
    expect(result.method).toBe("crypto");
  });

  it("BPC-157 $54.00 + ACH → $51.30", () => {
    const result = applyPaymentMethodDiscount(5400, "ach");
    expect(result.discountCents).toBe(270);
    expect(result.totalCents).toBe(5130);
    expect(result.method).toBe("ach");
  });

  it("BPC-157 $54.00 + card → $54.00 (no discount)", () => {
    const result = applyPaymentMethodDiscount(5400, "card");
    expect(result.discountCents).toBe(0);
    expect(result.totalCents).toBe(5400);
    expect(result.method).toBe("card");
  });

  it("BPC-157 $54.00 + Zelle → $54.00 (manual bank payment)", () => {
    const result = applyPaymentMethodDiscount(5400, "zelle");
    expect(result.discountCents).toBe(0);
    expect(result.totalCents).toBe(5400);
    expect(result.method).toBe("zelle");
  });

  it("rounds half-cents using banker-safe Math.round", () => {
    // 333 cents * 0.05 = 16.65 → rounds to 17
    const result = applyPaymentMethodDiscount(333, "ach");
    expect(result.discountCents).toBe(17);
    expect(result.totalCents).toBe(316);
  });

  it("handles zero subtotal", () => {
    const result = applyPaymentMethodDiscount(0, "crypto");
    expect(result.discountCents).toBe(0);
    expect(result.totalCents).toBe(0);
  });

  it("handles a Recovery Stack bundle ($77.00 → crypto $65.45)", () => {
    const result = applyPaymentMethodDiscount(7700, "crypto");
    expect(result.discountCents).toBe(1155);
    expect(result.totalCents).toBe(6545);
  });
});
