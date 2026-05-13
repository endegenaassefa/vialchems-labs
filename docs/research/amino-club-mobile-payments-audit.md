# Amino Club Mobile + Payments Audit

Date: 2026-05-13

## CLI super-prompt used

Act as a senior ecommerce UX, frontend, compliance, and payments engineer with full CLI access. Use live browser inspection, mobile screenshots, DOM/network inspection, source-code search, and local test commands. Study `https://www.aminoclub.com/` on a 390px mobile viewport, including age gate, home, PDP, cart, and checkout entry. Extract only public, observable implementation facts. Compare those findings against the local Vailchem Labs Next.js codebase. Implement the highest-impact mobile fixes directly, verify with Playwright screenshots, run lint/type checks, and document payment recommendations without advising processor evasion, descriptor masking, miscoding, or policy circumvention.

## Amino Club findings

- Mobile first screen: product imagery appears before the headline, then a direct catalog CTA. The user sees actual vial photography immediately.
- Trust sequence: guarantee/assurance blocks appear directly after the hero, before long education content.
- Catalog pattern: mobile emphasizes product cards and horizontal browsing; filters do not block the first product impression.
- PDP pattern: the buy box stays near the top, shows accepted payment marks, delivery/protection trust points, and COA evidence before research references.
- Public payment marks observed on the PDP: Apple Pay, Visa, and Mastercard.
- Public implementation clues observed from assets/network: Next.js storefront, Medusa-related commerce assets/storage, and third-party analytics pixels. Checkout is gated behind email sign-in before payment details are shown.

## Payment conclusions

- Do not surface Apple Pay/cards as live until there is an approved merchant account/payment provider for this exact product category.
- Stripe direct is not a viable default for this posture: Stripe lists "Research chemicals" under prohibited goods.
- PayPal is high risk for this posture: PayPal prohibits controlled-substance-risk products and requires approval for prescription/medical items.
- Square direct is not a good default: its payment terms restrict internet/mail-order pharmacies, high-risk products/services, illegal/unauthorized transactions, and require compliance with card-network rules.
- Legitimate next steps are ACH and card/wallet underwriting, not policy workarounds. The local code already has BTCPay and Plaid scaffolding; Plaid ACH should be the first non-crypto rail once Transfer/Auth approval, credentials, authorization language, and webhook handling are complete.

Sources:

- Amino Club live site: https://www.aminoclub.com/
- Stripe restricted businesses: https://stripe.com/legal/restricted-businesses
- PayPal acceptable use policy: https://www.paypal.com/us/legalhub/paypal/acceptableuse-full
- Square payment terms: https://squareup.com/us/en/legal/general/payment
- Medusa Payment Module: https://docs.medusajs.com/resources/commerce-modules/payment
- Plaid Transfer docs: https://plaid.com/docs/transfer/
