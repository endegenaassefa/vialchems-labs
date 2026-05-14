import { describe, expect, it, beforeEach } from "vitest";
import {
  assertOrderJurisdictionAllowed,
  JurisdictionalGuardError,
  resetReconciliationLedger,
} from "@/lib/payments/reconciliation";

/**
 * Phase 10.1 (v4) — D15 Layer 3 jurisdictional guard.
 *
 * Layer 1 is AddressForm client-side validation. Layer 2 is the place-order
 * server re-check in ReviewPanel. Layer 3 is THIS: the final guard at
 * webhook-reconcile time, so a spoofed or ineligible address does not credit.
 */

describe("assertOrderJurisdictionAllowed (D15 Layer 3)", () => {
  beforeEach(() => {
    resetReconciliationLedger();
  });

  it("passes for US shipping states", () => {
    for (const stateCode of ["WA", "CA", "TX", "NY", "FL"]) {
      expect(() =>
        assertOrderJurisdictionAllowed({
          countryCode: "US",
          stateCode,
        }),
      ).not.toThrow();
    }
  });

  it("throws for non-US country codes (US-only Day-1)", () => {
    expect(() =>
      assertOrderJurisdictionAllowed({
        countryCode: "CA",
        stateCode: "ON",
      }),
    ).toThrow(JurisdictionalGuardError);
  });

  it("error includes the rejection reason from validateShippingAddress", () => {
    try {
      assertOrderJurisdictionAllowed({
        countryCode: "CA",
        stateCode: "ON",
      });
      throw new Error("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(JurisdictionalGuardError);
      expect((err as Error).message).toMatch(/United States/);
      expect((err as Error).message).toMatch(/International shipping/);
    }
  });
});
