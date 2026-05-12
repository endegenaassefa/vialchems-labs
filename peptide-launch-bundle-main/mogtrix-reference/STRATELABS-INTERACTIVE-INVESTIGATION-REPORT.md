# STRATELABS INTERACTIVE INVESTIGATION REPORT

Prepared: April 27, 2026  
Method: Live interactive browsing in the Codex in-app browser, plus limited page-source inspection where checkout rendering was blocked by Cloudflare  
Target site: [https://stratelabs.is/?utm_source=hoobe&utm_medium=social](https://stratelabs.is/?utm_source=hoobe&utm_medium=social)

## 1. Navigation Log

1. Opened homepage at `https://stratelabs.is/?utm_source=hoobe&utm_medium=social`.
What appeared: consumer storefront, product pricing, free-shipping promo, sterility/purity claims, cart icon, account icon, footer legal links.

2. Opened the mobile menu from the homepage header.
What appeared: a categories-style overlay with `Aliquots/Injectables`, `SARM's`, `Ancillaries`, `Capsules`, `Liquids`, `Supplies`, and `Wholesale`.
What did not appear: a separate, richer main menu. Clicking `Menu` and `Categories` did not materially change the visible overlay content during this session.

3. Scrolled to the footer on the homepage.
What appeared: `About Us`, `Contact Us`, `Ambassadors`, `FAQ's`, `Terms of Service`, `Privacy Policy`, `Return Policy`, newsletter signup field, social links, and `Contact@stratelabs.is`.

4. Visited the footer legal link destination for `Terms of Service`.
URL reached: `https://stratelabs.is/informed-consent-policy/`
Notable point: the footer calls this `Terms of Service`, but the destination is an `Informed Consent Policy` page rather than a standard terms page.

5. Visited the footer `Privacy Policy`.
URL reached: `https://stratelabs.is/privacy-policy-2/`

6. Visited the footer `Return Policy`.
URL reached: `https://stratelabs.is/return-policy/`

7. Visited the footer `FAQ's`.
URL reached: `https://stratelabs.is/faqs/`
Then opened hidden accordion content under `General`, `Products`, `Orders`, and `Shipping`.

8. Visited the footer `Contact Us`.
URL reached: `https://stratelabs.is/contact-us/`

9. Visited the footer `About Us`.
URL reached: `https://stratelabs.is/about-us/`

10. Visited `My account`.
URL reached: `https://stratelabs.is/my-account/`
Then opened the register view:
URL reached: `https://stratelabs.is/my-account/?action=register`

11. Opened the homepage promo popup by clicking `GET 10% OFF`.
What appeared: email capture modal with discount language and no visible checkbox-based legal consent.

12. Opened product page for `Semaglutide by Semathin | 10mg`.
URL reached: `https://stratelabs.is/product/semaglutide-by-semathin-10mg/`
Then opened the `Lab Results` tab.

13. Opened product page for `BPC-157`.
URL reached: `https://stratelabs.is/product/bpc-157-5mg/`
Then changed options from default to `10mg` and `10-Pack`.
Hidden result: the page switched into a sold-out waitlist state with an email capture field.

14. Added `Semaglutide by Semathin | 10mg` to cart from the product page.
Result: cart icon incremented from `0` to `1`.

15. Opened the cart page.
URL reached: `https://stratelabs.is/cart/`
What appeared: product line item, free-shipping progress prompt, subtotal, checkout link, shipping-calculated-at-checkout notice.

16. Attempted to open checkout.
URL reached: `https://stratelabs.is/checkout/`
Result: blocked by Cloudflare `Performing security verification` page.

17. Used the site’s native search route for `semaglutide`.
URL reached: `https://stratelabs.is/?s=semaglutide`
What appeared: semaglutide product hits, lab-result hits, and blog/article hits about weight loss.

18. Opened the search-result article `Semaglutide and Tirzepatide: Which is Better for Weight Loss`.
URL reached: `https://stratelabs.is/semaglutide-and-tirzepatide-which-is-better-for-weight-loss/`

## 2. Pages Visited

| URL | Title | How Reached | Key Findings |
|---|---|---|---|
| `https://stratelabs.is/?utm_source=hoobe&utm_medium=social` | `Home - Strate Labs` | Direct open | Consumer storefront, peptide pricing, free-shipping promo, research/lab branding, injectable-adjacent inventory |
| `https://stratelabs.is/informed-consent-policy/` | `Informed Consent Policy - Strate Labs` | Footer legal map | RUO language, no-human-use clause, indemnity, arbitration in Texas, as-is disclaimer |
| `https://stratelabs.is/privacy-policy-2/` | `Privacy Policy - Strate Labs` | Footer link | Names `Strate Labs LLC`, B2B-style `Authorized Customers` language, outdated/misaligned template feel |
| `https://stratelabs.is/return-policy/` | `Return Policy - Strate Labs` | Footer link | `All Sales are final`, proof burden for damage claims, cancellation only before shipment |
| `https://stratelabs.is/faqs/` | `FAQ's - Strate Labs` | Footer link | Hidden accordion answers on location, free shipping, cancellations, shipping insurance, discretion, packaging |
| `https://stratelabs.is/contact-us/` | `Contact Us - Strate Labs` | Footer link | Names `Strate Labs BV`, Netherlands HQ address, Texas/Delaware fulfillment claim |
| `https://stratelabs.is/about-us/` | `About Us - Strate Labs` | Footer link | Calls products `dietary supplements and natural products` for `health and wellness` |
| `https://stratelabs.is/my-account/` | `My account - Strate Labs` | Header/account icon | Login form, Google login, register entry point |
| `https://stratelabs.is/my-account/?action=register` | `My account - Strate Labs` | Account register path | Email-only registration, anti-spam field, privacy link, no age or research qualification attestation |
| `https://stratelabs.is/product/semaglutide-by-semathin-10mg/` | `Semaglutide by Semathin | 10mg - Strate Labs` | Product navigation | Sterility/purity claims, injectable-vial language, quantity discount table, lab-result tab |
| `https://stratelabs.is/product/bpc-157-5mg/` | `BPC-157 - Strate Labs` | Product navigation | Option-based hidden sold-out waitlist state, image alt text uses `premium peptide supplement` |
| `https://stratelabs.is/cart/` | `Cart - Strate Labs` | Cart icon / direct cart page | Item subtotal, shipping calculated at checkout, free-shipping threshold prompt |
| `https://stratelabs.is/checkout/` | `Just a moment...` | Checkout link | Cloudflare challenge blocked rendered checkout inspection |
| `https://stratelabs.is/?s=semaglutide` | `You searched for semaglutide - Strate Labs` | Native site search URL | Search exposes semaglutide products, lab results, and weight-loss article content |
| `https://stratelabs.is/semaglutide-and-tirzepatide-which-is-better-for-weight-loss/` | `Semaglutide and Tirzepatide: Which is Better for Weight Loss - Strate Labs` | Search result click path | Explicit human-use and weight-loss marketing content |
| `https://stratelabs.is/shipping-returns/` | `Page not found - Strate Labs` | FAQ shipping link | FAQ links users to a 404 shipping policy page |

## 3. Legal Terms Found

### Informed Consent / Terms Surface

Page: `https://stratelabs.is/informed-consent-policy/`

Key findings:

- The footer `Terms of Service` link goes to an `Informed Consent Policy`.
- The page says products are for `research purposes only`.
- It says they are `not for human consumption, veterinary use, or any other unauthorized applications`.
- It disclaims medical, therapeutic, diagnostic, dietary-supplement, pharmaceutical, and recreational use.
- It says the customer `expressly waives` claims tied to toxicity, contamination, accidental exposure, improper usage, or unauthorized transfer.
- It imposes indemnity: customer must `indemnify and hold Stratelabs, its employees, agents, and affiliates harmless`.
- It reserves the right to `Cancel or refuse any order without notice` and to `Request additional documentation`.
- It says customer certifies legal age `18+/21+, depending on jurisdiction`.
- It sells products `as-is` and disclaims direct, indirect, incidental, and consequential damages.
- It routes disputes to `binding arbitration in Texas` and waives jury trial and class action rights.

Important structural issue:

- The page says `By signing below`, but no visible signature field or actual signature gate appeared during inspection.

### Return / Refund

Page: `https://stratelabs.is/return-policy/`

Key findings:

- `All Sales are final.`
- Damaged products may be replaced only if the buyer provides `sufficient proof of damage`.
- Order cancellation must happen `before the order has shipped`.

FAQ expansion at `https://stratelabs.is/faqs/`:

- `No. All items are final sale. We do not offer refunds, returns, or exchanges.`
- Wrong, missing, or defective item claims are handled only after verification.
- Orders are held only `1 hour` for cancellation attempts.

### Privacy

Page: `https://stratelabs.is/privacy-policy-2/`

Key findings:

- Effective date shown: `June 8, 2022`.
- Entity named: `Strate Labs LLC`.
- Uses `Visitors` and `Authorized Customers` language that reads like a generic B2B web template.
- Says it may collect names, addresses, phone numbers, email addresses, and even `the nature and size of the advertising inventory` an authorized customer intends to buy or sell.
- Says third-party vendors including `credit card companies, clearinghouses and banks` may collect information.

Investigative significance:

- The privacy page’s B2B `Authorized Customers` framing does not cleanly match the retail storefront behavior observed elsewhere.

## 4. Checkout / Cart Findings

### Cart Page

Page: `https://stratelabs.is/cart/`

Observed directly:

- Cart icon updated from `0` to `1` after add-to-cart.
- Cart contained `Semaglutide by Semathin | 10mg` at `$99.95`.
- Cart said: `Shipping costs are calculated during checkout.`
- Cart displayed a free-shipping progress prompt: `Add $150.05 to cart and get free shipping!`
- The mini-cart overlay later showed estimated delivery dates: `April 28, 2026 – April 30, 2026`.

### Checkout Page

Page: `https://stratelabs.is/checkout/`

Observed directly:

- The rendered checkout flow was blocked by a Cloudflare security page titled `Just a moment...`.
- The page message said `Performing security verification`.
- No manual CAPTCHA solving or bypassing was attempted.

### Checkout / Payment Inference From Raw Cart Source

Because rendered checkout was blocked, I inspected the raw cart page source for store configuration signals.

Source-code findings:

- The WooCommerce store data exposed payment methods:
  - `mecom_paypal`
  - `mecom_stripe`
  - `btcpaygf_default`
- This strongly suggests configured payment rails include PayPal, Stripe, and a BTCPay-style crypto path.
- The cart source also referenced an Omnisend checkout newsletter block stylesheet:
  - `omnisend-woocommerce-checkout-block-checkout-newsletter-subscription-block.css`
- The preloaded store config showed:
  - `storePages.terms.permalink: false`

Interpretation:

- I could not confirm the exact payment-method labels shown to a live shopper on rendered checkout because Cloudflare blocked the page.
- The source strongly suggests multiple payment methods are configured, including a likely crypto-related path.
- The `terms.permalink: false` setting suggests WooCommerce may not have a native checkout terms page configured, though I could not confirm the rendered checkout checkbox state because the page was blocked.

### Shipping Contradictions

Observed conflicts:

- Homepage promo: `Free Shipping on all orders $250+`
- Cart free-shipping math also points to a `$250` threshold
- FAQ says U.S. free shipping applies on orders over `$100`

This is a concrete internal inconsistency.

### Shipping Policy Link Failure

- FAQ shipping content links users to `https://stratelabs.is/shipping-returns/`
- That URL returned `Page not found`

## 5. Registration Findings

### Login

Page: `https://stratelabs.is/my-account/`

Observed:

- Standard login form with username/email and password
- `Remember me` checkbox
- `Lost your password?` link
- Google social login option

Checkbox found:

- `Remember me`
- Optional
- Not pre-checked during inspection

### Comment-Form Checkbox

Page: `https://stratelabs.is/semaglutide-and-tirzepatide-which-is-better-for-weight-loss/`

Checkbox found:

- `Save my name, email, and website in this browser for the next time I comment.`
- Optional
- Not pre-checked during inspection
- Function: browser-side convenience storage for future comments

### Registration

Page: `https://stratelabs.is/my-account/?action=register`

Observed:

- Email-address field only
- Anti-spam field
- Notice that password setup link will be sent by email
- Privacy-policy reference

What was not required at registration:

- No age acknowledgment
- No research qualification statement
- No explicit no-human-use acknowledgment
- No separate informed-consent checkbox

Investigative significance:

- The account-creation flow is far lighter than the legal seriousness implied by the informed-consent page.

## 6. Product Page Claims

### Semaglutide by Semathin | 10mg

Page: `https://stratelabs.is/product/semaglutide-by-semathin-10mg/`

Observed claims:

- Public lab reports
- Purity language
- `Tamper-proof seal`
- `RTF vials` washed, depyrogenated, and ETO sterilized
- `Aliquot injectable vials are fully sterilized and filtered`
- Bulk discount ladder up to `31+`
- `Lab Results` tab with `Janoshik Lab Results`
- Purity displayed as `99.57%`
- Average mass displayed as `11.02mg`

Investigative significance:

- This is direct quasi-medical confidence signaling around an injectable-style semaglutide product.

### BPC-157

Page: `https://stratelabs.is/product/bpc-157-5mg/`

Observed claims:

- Same sterility/purity/injectable-style claim stack as above
- Variant selectors for `mg` and `Amount`
- Image alt text included `premium peptide supplement`

Investigative significance:

- `Premium peptide supplement` cuts against the site’s research-only posture and aligns more closely with consumer supplement framing.

## 7. Hidden / Conditional Text

### FAQ Accordions

The FAQ page hides important operational terms until tab and accordion interaction.

Hidden text surfaced:

- `Where are we located?`
  - HQ in `Gelderland, Netherlands`
  - fulfillment in `Texas and Delaware`

- `What services and products do we offer?`
  - `Third Party and In-house testing services`
  - `research compound sales`

- `How can I cancel my order?`
  - orders held only `1 hour`
  - registered users are told to cancel through order history

- `What is shipping insurance? Is it required?`
  - `We require this on all orders.`

- `What does the package look like, is it discrete?`
  - packaging is `nondescript`
  - label `does not mention research`
  - they can `remove product labels for discretion` if requested in checkout order notes

- `Do you offer free shipping?`
  - U.S. free shipping claimed above `$100`
  - international free shipping claimed above `$300`

### Variant-Triggered Sold-Out State

On `BPC-157`, switching to `10mg` plus `10-Pack` changed the page state.

Hidden conditional state:

- `This product is currently sold out.`
- Waitlist prompt with email field
- `Add to waitlist` link

### Search-Result Contradictions

Site search for `semaglutide` exposed:

- semaglutide products
- semaglutide lab-result pages
- a weight-loss article
- other weight-loss and hormone-related article content

### Promo Popup

Clicking `GET 10% OFF` opened a modal:

- `Here's 10% Off Your First Purchase`
- email field
- `GET MY DISCOUNT`
- `No thanks, I'll just pay full price.`

What was not visible:

- No checkbox consent
- No visible SMS opt-in disclosure
- No privacy or marketing disclaimer text adjacent to the field

### Checkout-Adjacent Overlay

The mini-cart overlay showed:

- estimated delivery dates
- subtotal
- free-shipping threshold prompt
- direct `View cart` and `Checkout` links

## 8. Parallels to RUO.bio

| Theme | RUO.bio Pattern | StrateLabs Finding |
|---|---|---|
| Research-use-only disclaimer | Yes | Yes, in informed consent |
| No human consumption language | Yes | Yes |
| Arbitration | Yes | Yes, Texas |
| Jury/class-action waiver | Yes | Yes |
| Indemnity | Yes | Yes |
| As-is liability shield | Yes | Yes |
| All sales final | Yes | Yes |
| No refunds / narrow remedies | Yes | Yes |
| Seller cancellation rights | Yes | Yes |
| Qualification / legal-age language | Yes | Yes, but weakly enforced in flow |
| Consumer storefront | Yes | Yes |
| Scientific branding + retail flow | Yes | Yes |
| Sterility / lab confidence signaling | Yes | Yes |
| Public lab-report trust building | Yes | Yes |
| Hidden or non-obvious terms surface | Yes | Yes |
| Entity mismatch / structure complexity | Yes | Yes |

### Specific RUO.bio-Type Similarities

- Legal distance on one page, consumer sales energy everywhere else
- No-human-use posture paired with semaglutide, BPC-157, HCG, reconstitution kits, bacteriostatic water, and injectable-vial language
- Heavy disclaimer stack paired with practical shopper guidance on cancellation, discreet packaging, delivery timing, and sales conversion
- Strong buyer-side risk shift through final-sale, proof burden, indemnity, and arbitration terms

### Additional StrateLabs-Specific Contradictions

- About page says `dietary supplements and natural products` for `health and wellness`
- Search results expose `Which is Better for Weight Loss`
- The article urges readers to contact the company to start their `journey to a better healthier weight`
- Product alt text includes `premium peptide supplement`

These contradictions are stronger than a pure disclaimer issue. They point to a broader intended-use tension across the site.

## 9. Strongest Red Flags

1. The footer `Terms of Service` link is actually an `Informed Consent Policy`, suggesting legal framing is being routed through a consent-style document rather than a conventional terms page.
2. The informed-consent page says `By signing below`, but no visible signature field or real signature gate appeared.
3. The site disclaims human use, dietary-supplement use, and therapeutic use, while the `About Us` page openly says it provides `dietary supplements and natural products` for `health and wellness`.
4. The semaglutide and tirzepatide article is explicit human-use weight-loss content and ends with a direct commercial invitation to contact the company.
5. Product pages emphasize sterility, tamper-proof seals, filtered injectable vials, purity, and public lab reports, which create a medical-confidence signal that undercuts the disclaimer posture.
6. The entity presentation is inconsistent:
   - privacy page: `Strate Labs LLC`
   - contact page: `Strate Labs BV`
   - informed-consent page: `Stratelabs`
7. FAQ shipping guidance links to a shipping-policy page that returns `404`.
8. Free-shipping thresholds conflict across surfaces:
   - homepage/cart imply `$250`
   - FAQ says U.S. free shipping over `$100`
9. Checkout was guarded by Cloudflare, but the raw cart source still exposed configured payment methods that appear to include PayPal, Stripe, and BTCPay/crypto.
10. No strong gating was encountered at registration:
   - no age gate
   - no research qualification check
   - no explicit no-human-use acceptance

## 10. Final Assessment

This was not a passive homepage read. The interactive flow showed a site that behaves like a consumer peptide storefront wrapped in research-compliance language.

The legal pages push risk onto the buyer through final-sale language, proof burdens, indemnity, arbitration, and liability waivers. But the product, FAQ, search, and article layers tell a different story: injectable-style semaglutide inventory, sterility assurances, discreet-shipping tactics, cancellation workflow guidance, weight-loss content, and even explicit health-and-wellness language.

The strongest investigative conclusion is that StrateLabs does not merely use research-use-only disclaimers. It combines those disclaimers with consumer-facing trust signals, operational conversion tools, and human-use-adjacent content in a way that closely parallels the RUO.bio pattern and in some places appears even more internally contradictory.

## Notes On Evidence Quality

- Live browsing was completed across homepage, footer legal links, FAQ accordions, account pages, product pages, cart, popup, and native search results.
- Rendered checkout could not be fully inspected because Cloudflare held the session on a security-verification page.
- Screenshot capture through the in-app browser timed out repeatedly on this site, so this report relies on live DOM inspection and text extraction rather than saved screenshots.
- Payment-method findings are source-code inferences from the live cart page, not direct visual confirmation from the rendered checkout form.
