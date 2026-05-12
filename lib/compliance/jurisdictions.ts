/**
 * Jurisdictional restrictions per DECISIONS/compliance_posture.md and Iron Law 2.8.
 *
 * Default domestic coverage: all US states.
 * Default international: US-only for launch.
 *
 * Operators can tighten this list if counsel requires it.
 *
 * Validated at three points (defense in depth):
 *   1. Address entry (lib/validation/access.ts via Zod refinement)
 *   2. Checkout review (app/checkout/review/page.tsx server component)
 *   3. Post-payment confirmation (lib/payments/reconciliation.ts)
 */

export const BLOCKED_US_STATES = [] as const;
export type BlockedState = never;

export const ALLOWED_COUNTRIES = ["US"] as const;
export type AllowedCountry = (typeof ALLOWED_COUNTRIES)[number];

export function isBlockedState(stateCode: string): boolean {
  const upper = stateCode.toUpperCase();
  return (BLOCKED_US_STATES as readonly string[]).includes(upper);
}

export function isAllowedCountry(countryCode: string): boolean {
  const upper = countryCode.toUpperCase();
  return (ALLOWED_COUNTRIES as readonly string[]).includes(upper);
}

export function validateShippingAddress(address: {
  countryCode: string;
  stateCode?: string;
}): { ok: true } | { ok: false; reason: string } {
  if (!isAllowedCountry(address.countryCode)) {
    return {
      ok: false,
      reason: `vialchemlabs ships to United States addresses only at this time. International shipping is not currently available.`,
    };
  }
  if (address.stateCode && isBlockedState(address.stateCode)) {
    return {
      ok: false,
      reason: `vialchemlabs is not currently accepting orders to ${address.stateCode}. The customer assumes all regulatory compliance responsibility for their jurisdiction.`,
    };
  }
  return { ok: true };
}
