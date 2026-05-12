---
url: https://healthgev.com, https://healthgevity.com (TLS issue)
fetched_at: 2026-05-06T22:51Z
fetch_method: webfetch
status: 200 on healthgev.com; ERR_TLS_CERT_ALTNAME_INVALID on healthgevity.com
notes: Vendor's primary commerce domain is healthgev.com (Shopify-style storefront). The healthgevity.com hostname has a certificate altname mismatch, suggesting healthgevity.com is a marketing/redirect domain that points to healthgev.com (the actual store).
---

# Verbatim Extracted Content

## healthgev.com (homepage) (verbatim)

Footer payment methods section explicitly lists:
"American Express"
"Diners Club"
"Discover"
"JCB"
"Mastercard"
"Visa"

## OBSERVED Payment Methods (verbatim, all six exactly as listed in footer)

American Express, Diners Club, Discover, JCB, Mastercard, Visa.

(This is the standard Shopify Payments / Stripe / Braintree icon set — cards-only, no crypto, no Zelle, no Venmo, no PayPal, no Apple Pay/Google Pay disclosed in the fetched footer block.)

## Cross-Reference: peptideprotocolwiki.com/vendors/healthgevity (verbatim)

"Credit Card" — listed as the sole payment method
"Credit card accepted."
Cons section: "Credit card only payment"

## Cross-Reference: outliyr.com (verbatim)

"Healthgevity: CC, Venmo, PayPal"
(CONFLICTS with healthgev.com footer. Outliyr's "Venmo, PayPal" is NOT visible in the fetched footer.)

## Cross-Reference: search snippet (verbatim)

"Healthgevity is recommended as the best peptide company for beginners, combining user-friendly oral formats with competitive pricing and Venmo/PayPal payment options."

## Conflict resolution + significance

OBSERVED footer = cards-only.
CROSS-SOURCE claims: + Venmo + PayPal.

The OBSERVED card lineup (Visa/MC/AMEX/Discover/Diners/JCB) is INDISTINGUISHABLE from any standard mainstream e-commerce store. This is BECAUSE Healthgevity positions itself as a clinician-grade nutraceutical company (oral peptide formulations, SNAC tech), NOT a "research chemicals" / "for research only" vendor. That positioning is the entire reason mainstream processors don't terminate them — so Healthgevity is a EDGE CASE among the 15.

## Discovered Coverage Gap

- Cannot reach healthgevity.com directly (cert error) to verify whether it is a marketing site or a separate storefront.
- Cannot confirm whether Venmo/PayPal are supported at checkout without bypassing checkout (forbidden by anti-cheat rule 5).
- Whether Healthgevity uses Shopify Payments / Stripe / Braintree / etc. is INFERRED (the icon set strongly suggests one of these), not OBSERVED.
