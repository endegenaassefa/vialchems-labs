/**
 * Intro promo codes per SUPER_PROMPT_v3 Appendix E intro promo + Appendix K
 * Email 4. LOCKED: WELCOME15 is the 15% off first-order code.
 *
 * Day-1 implementation: single shared code, validated at checkout against the
 * email used at newsletter signup (placeholder check; real wiring in Phase 10).
 *
 * Phase 2 candidate: per-email unique codes generated server-side at signup.
 */

export interface PromoCode {
  code: string;
  discountPct: number;
  description: string;
  firstOrderOnly: boolean;
  requiresNewsletterSignup: boolean;
  requiresAgeGate: boolean;
  requiresRuoAck: boolean;
}

export const promoCodes: Record<string, PromoCode> = {
  WELCOME15: {
    code: 'WELCOME15',
    discountPct: 0.15,
    description:
      '15% off first order via newsletter signup, gated behind RUO acknowledgment and 21+ age verification.',
    firstOrderOnly: true,
    requiresNewsletterSignup: true,
    requiresAgeGate: true,
    requiresRuoAck: true,
  },
};

export function getPromoCode(code: string): PromoCode | undefined {
  return promoCodes[code.toUpperCase()];
}

export function calculatePromoDiscount(
  code: string,
  subtotalCents: number,
): { discountCents: number; promo: PromoCode } | null {
  const promo = getPromoCode(code);
  if (!promo) return null;
  const discountCents = Math.round(subtotalCents * promo.discountPct);
  return { discountCents, promo };
}
