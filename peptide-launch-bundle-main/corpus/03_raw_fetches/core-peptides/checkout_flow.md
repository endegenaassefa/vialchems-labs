---
url: https://www.corepeptides.com/checkout/
fetched_at: 2026-05-07T17:09:40Z
fetch_method: gstack-browse
http_status: 200
sha256: e8aada7e7cb3cb487f38fc7f66aa7e637b24834be3aea9a5e43927290a3d8625
---
=== CHECKOUT FLOW OBSERVATION (gstack-browse + curl) ===

Cart page (with BPC-157 5mg item added via gstack-browse):
- Product: BPC-157 (5mg / 10mg) - 5mg @ $52.00
- Coupon code field present (Apply coupon button)
- "Calculate shipping" - dropdown for Country/State/City/ZIP
- Only US available in country selector
- Total: $52.00
- "Proceed to checkout" button

Checkout page (HTML source analysis):
- WooCommerce platform confirmed
- Payment gateways loaded: 
  1. payment_method_cheque (WooCommerce check - CSS shows PayPal logo img)
  2. payment_method_edd_ach (ACH/eCheck via EDD gateway)  
  3. inoviodirectmethod (Inovio credit card processor - WP plugin: zigu-payment-gateway)
- ship-to-different-address option: present
- AffiliateWP with Stripe: affwp-stripe-notice present (affiliate payouts)
- No age verification gate at product page or cart level
- Guest checkout available (WooCommerce option_guest_checkout: yes per JS)
- "SAVE 10%" popup button visible on cart page (Omnisend or similar email capture)

Billing fields visible (standard WooCommerce): first name, last name, address, city, state, ZIP, country, email, phone
