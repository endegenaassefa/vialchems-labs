---
url: https://skyepeptides.com/test-reports/
fetched_at: 2026-05-06T22:55Z
fetch_method: curl (HTTP 200 from skyepeptides.com via direct fetch — CDN allowed; WebFetch via the harness was returning a different Cloudflare-cached login screen for the homepage at /).
notes: Skye's homepage at "/" is GATED (login form only — no public content). The /test-reports/ public page is full and includes the site's footer disclaimer. All other policy paths probed (/terms-and-conditions/, /shipping-and-payments/, /privacy-policy/, /about-us/) return HTTP 200 but the same 65,459-byte gated login HTML — i.e., they 200 to the login screen rather than 404. Verbatim disclaimer captured from /test-reports/ footer.
---

# Footer Disclaimer Block (Verbatim, from /test-reports/)

"Please note that all products featured on this website are intended exclusively for research and development purposes. They are not designed for any form of human consumption. The claims made on this website have not undergone evaluation by the U.S. Food and Drug Administration. Neither the statements nor the products of this company aim to diagnose, treat, cure, or ward off any disease. Skye Peptides is a chemical supplier. Skye Peptides is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic act. Skye Peptides is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic act."

# Footer Address & Contact (Verbatim)

"Skye Research, 11400 West Olympic Blvd, Los Angeles, CA 90064 +1 424-294-0603"

Useful links: Homepage, About Us, Shop Peptides, Lab Results, Contact Us, Wholesale.
Legal obligations: Shipping and Payments, Terms and Conditions, Refund and Returns Policy, Privacy Policy.
Copyright: "© Skye Peptides 2026. All rights reserved"

# Test Reports Page Header (Verbatim)

"We send every batch of peptide to a third party lab for testing. Testing includes peptide validation, purity, and quantification. Analysis is done by HPLC. All manufacturers are tested for sterility."

# Lab Partner

External test reports link to verify.janoshik.com — i.e., **Janoshik Analytical** is the third-party lab. (See WebFetch summary; janoshik.com / verify.janoshik.com referenced.)

# COA / Batch Transparency (observed)

Per-product, per-batch test data shown publicly: HPLC purity %, endotoxin (EU/mg with 5 EU/mg limit), sterility, heavy metals on selected batches. Examples:
- BPC-157 BPC25-10-001: 99.9% purity, endotoxin 0.016 EU/mg
- BPC-157 BPC25-20-003: 99.9% purity, endotoxin 0.005 EU/mg
- BPC-157 BPC25-05-002: 99.7% purity, endotoxin 0.100 EU/mg
- "GLOW" GHK-Cu/TB-500/BPC-157 blends, "KLOW" KPV/GHK-Cu/TB-500/BPC-157 blends, "2X"/"3X"/"4X" Tesamorelin/Ipamorelin/MGF/GHRP-2 blends.

# Tech-stack

WordPress + WooCommerce-compatible theme ("xoo-wsc-footer" cart plugin observed; wp-json schema URLs; UpSolution / "us-global-settings" theme indicator).

# Age-gate / payment / ID

No public age-gate observed (login required for shop access). No payment-method or ID-verification text surfaced from the public pages. Shop and price details not viewable without account.

# Public Homepage state

GET https://skyepeptides.com/ → HTTP 200 65,459 bytes — page text reduced to:
"Skye Peptides Login Username or email address Required Password Required Remember me Log in Lost your password? Register 0 Your Cart Your cart is empty Return to Shop Continue Shopping"
