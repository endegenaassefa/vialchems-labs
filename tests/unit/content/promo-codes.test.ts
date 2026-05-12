import { describe, expect, it } from "vitest";
import {
  calculatePromoDiscount,
  getPromoCode,
  promoCodes,
} from "@/lib/content/promo-codes";

describe("promo-codes", () => {
  it("exposes WELCOME15 as the 15% intro code", () => {
    const code = getPromoCode("WELCOME15");
    expect(code).toBeDefined();
    expect(code?.discountPct).toBe(0.15);
    expect(code?.firstOrderOnly).toBe(true);
    expect(code?.requiresAgeGate).toBe(true);
    expect(code?.requiresRuoAck).toBe(true);
  });

  it("case-insensitive lookup", () => {
    expect(getPromoCode("welcome15")).toBeDefined();
    expect(getPromoCode("Welcome15")).toBeDefined();
  });

  it("returns undefined for unknown code", () => {
    expect(getPromoCode("UNKNOWN")).toBeUndefined();
  });

  it("calculates discount in cents correctly", () => {
    const result = calculatePromoDiscount("WELCOME15", 10000);
    expect(result).toBeDefined();
    expect(result?.discountCents).toBe(1500);
  });

  it("rounds discount to whole cents", () => {
    const result = calculatePromoDiscount("WELCOME15", 9999);
    expect(result?.discountCents).toBe(1500);
  });

  it("returns null for unknown code", () => {
    expect(calculatePromoDiscount("UNKNOWN", 10000)).toBeNull();
  });

  it("only WELCOME15 is registered Day-1", () => {
    expect(Object.keys(promoCodes)).toEqual(["WELCOME15"]);
  });
});
