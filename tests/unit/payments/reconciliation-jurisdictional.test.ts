import { describe, expect, it, beforeEach } from 'vitest';
import {
  assertOrderJurisdictionAllowed,
  JurisdictionalGuardError,
  resetReconciliationLedger,
} from '@/lib/payments/reconciliation';

/**
 * Phase 10.1 (v4) — D15 Layer 3 jurisdictional guard.
 *
 * Iron Law 2.8: "NO SHIPPING TO BLOCKLISTED JURISDICTIONS." Layer 1 is
 * the AddressForm client-side block. Layer 2 is the place-order server
 * re-check in ReviewPanel. Layer 3 is THIS — the final guard at
 * webhook-reconcile time, so that if a buyer somehow bypasses Layers 1
 * and 2 (spoofed payload, race condition, future bug), the credited
 * order does not happen at all.
 */

describe('assertOrderJurisdictionAllowed (D15 Layer 3)', () => {
  beforeEach(() => {
    resetReconciliationLedger();
  });

  it('passes for a US address in an allowed state', () => {
    expect(() =>
      assertOrderJurisdictionAllowed({
        countryCode: 'US',
        stateCode: 'WA',
      }),
    ).not.toThrow();
  });

  it('throws JurisdictionalGuardError for blocklisted CA', () => {
    expect(() =>
      assertOrderJurisdictionAllowed({
        countryCode: 'US',
        stateCode: 'CA',
      }),
    ).toThrow(JurisdictionalGuardError);
  });

  it('throws for TX, NY, FL', () => {
    for (const stateCode of ['TX', 'NY', 'FL']) {
      expect(() =>
        assertOrderJurisdictionAllowed({
          countryCode: 'US',
          stateCode,
        }),
      ).toThrow(JurisdictionalGuardError);
    }
  });

  it('throws for non-US country codes (US-only Day-1)', () => {
    expect(() =>
      assertOrderJurisdictionAllowed({
        countryCode: 'CA',
        stateCode: 'ON',
      }),
    ).toThrow(JurisdictionalGuardError);
  });

  it('error includes the rejection reason from validateShippingAddress', () => {
    try {
      assertOrderJurisdictionAllowed({
        countryCode: 'US',
        stateCode: 'CA',
      });
      throw new Error('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(JurisdictionalGuardError);
      expect((err as Error).message).toMatch(/CA/);
      expect((err as Error).message).toMatch(/does not ship/);
    }
  });
});
