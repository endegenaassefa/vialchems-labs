# RUO Agent Report: Fresh Logged-Out Legal Agreement Investigation

Access date: April 28, 2026  
Target: https://ruo.bio  
Scope: logged-out public investigation only. No account was created, no consent box was checked, no signature was entered, no passwords were entered, no CAPTCHA/security controls were bypassed, and no order was placed.

## Navigation Log

1. Opened `https://ruo.bio/` while logged out.
   - Result: redirected to `https://ruo.bio/registration/?redirect_to=https%3A%2F%2Fruo.bio%2F`.
   - Page title: `Registration - RUO | Premium Research Material`.
   - The page presented a sign-in requirement, a login panel, registration fields, popular product previews, and an inline legal terms accordion.
2. Inspected the main navigation and footer links visible on public pages.
   - Repeated nav links included Home, Shop, product categories, Top Products, New Arrivals, Coupons/Discounts, FAQs, Lab Results/COA Library, Order Tracking, Contact Us, Terms of Service, Wholesale/Bulk, and The RUO Canary Protocol.
   - Several links were present both in normal page chrome and a duplicated lower/menu block that appears to be mobile/off-canvas navigation.
3. Opened `https://ruo.bio/terms-of-service/`.
   - Result: standalone terms page loaded while logged out.
   - Page title: `Terms of Service - RUO | Premium Research Material`.
4. Opened `https://ruo.bio/shipping-refunds-returns-policy/`.
   - Result: redirected into the registration page with a `redirect_to` value pointing back to the requested policy URL.
5. Opened `https://ruo.bio/mta/`.
   - Result: redirected into the registration page with a `redirect_to` value pointing back to the MTA URL.
6. Opened `https://ruo.bio/faqs/`.
   - Result: redirected into the registration page with a `redirect_to` value pointing back to the FAQ URL.
7. Opened `https://ruo.bio/order-tracking/`.
   - Result: redirected into the registration page with a `redirect_to` value pointing back to order tracking.
8. Opened `https://ruo.bio/my-account/`.
   - Result: redirected to `https://ruo.bio/registration/`.
   - The visible form variant used labels like Research Industry and Industry Position.
9. Opened `https://ruo.bio/checkout/`.
   - Result: redirected to registration before any checkout fields or payment terms were shown.
10. Opened `https://ruo.bio/cart/`.
    - Result: cart page loaded but was empty in this browser session.
    - The page still displayed the footer legal disclaimer and a disclaimer gate with `I Agree` / `I Disagree` controls.
11. Opened `https://ruo.bio/about-us/`.
    - Result: public about page loaded.
12. Opened `https://ruo.bio/contact-us/`.
    - Result: public contact page loaded with a pre-submit acknowledgment checkbox tied to usage-guidance limits and blacklist policy.
13. Opened `https://ruo.bio/discounts/`.
    - Result: public discounts page loaded with payment method discounts, bulk access claims, and shipping promotion language.
14. Opened `https://ruo.bio/product-category/peptides/?per_page=30` and page 2.
    - Result: category pages loaded while logged out and showed product names, prices, availability, add-to-cart/select-options controls, footer disclaimer, and the same bottom disclaimer gate.
15. Opened product pages:
    - `https://ruo.bio/product/survodutide-10mg/` loaded publicly.
    - `https://ruo.bio/product/pnc-27-5mg/` loaded publicly.
    - `https://ruo.bio/product/ara-290-10mg/` loaded publicly.
    - `https://ruo.bio/product/peg-mgf-2mg/` loaded publicly.
    - `https://ruo.bio/product/bpc-157/`, `https://ruo.bio/product/cagrilintide/`, `https://ruo.bio/product/retatrutide/`, and some other product URLs redirected to registration.
16. Attempted cart/checkout path from public pages without accepting terms or logging in.
    - Public category pages displayed mini-cart state after add-to-cart style URLs/clicks, but direct cart was empty in the separate page session and checkout redirected to registration.
    - No pre-payment checkout terms, payment widget, shipping form, or checkout checkbox could be reached while logged out.

## Pages Visited

| Page / URL | Logged-out result | Legal or investigative notes |
| --- | --- | --- |
| `https://ruo.bio/` | Redirected to registration | Home access is gated; registration page embeds terms and qualification fields. |
| `https://ruo.bio/registration/` | Loaded | Central access gate with login, registration, qualification fields, consent, terms accordion, and signature requirement visible in page text. |
| `https://ruo.bio/terms-of-service/` | Loaded | Main legal source. Includes RUO, age/qualification, no guidance, blacklist, payment, returns, MTA, privacy, arbitration, liability, indemnity, and affiliate terms. |
| `https://ruo.bio/shipping-refunds-returns-policy/` | Redirected to registration | Public policy page not reachable logged out in this run; return/refund content is still summarized inside Terms. |
| `https://ruo.bio/mta/` | Redirected to registration | MTA is referenced in Terms but not accessible logged out. |
| `https://ruo.bio/faqs/` | Redirected to registration | FAQ public access blocked by registration gate. |
| `https://ruo.bio/order-tracking/` | Redirected to registration | Order tracking blocked by registration gate. |
| `https://ruo.bio/my-account/` | Redirected to registration | Account area unavailable without login/registration. |
| `https://ruo.bio/cart/` | Loaded empty cart | Footer terms and disclaimer gate visible; checkout not reachable without registration/login. |
| `https://ruo.bio/checkout/` | Redirected to registration | Checkout flow blocked before shipping/payment/legal checkout fields. |
| `https://ruo.bio/about-us/` | Loaded | Claims founding in late 2025, vertical integration, AI-driven discovery, and six-layer validation. |
| `https://ruo.bio/contact-us/` | Loaded | Contact form includes a required acknowledgment of no usage advice and zero-tolerance blacklist policy. |
| `https://ruo.bio/discounts/` | Loaded | Lists payment method discounts, free shipping threshold, free bulk access threshold, monthly discounts, and bulk sister site. |
| `https://ruo.bio/product-category/peptides/?per_page=30` | Loaded | Public category inventory with product names, prices, add-to-cart/select-options controls, and disclaimer gate. |
| `https://ruo.bio/product-category/peptides/page/2/?per_page=30` | Loaded | More product listings including Mazdutide and Survodutide. |
| `https://ruo.bio/product/survodutide-10mg/` | Loaded | GLP-1/GCGR-related product page with sale pricing, stock, test-status claims, lab result link, and RUO terms. |
| `https://ruo.bio/product/pnc-27-5mg/` | Loaded | Common peptide product page with price, test-status claims, properties, and RUO terms. |
| `https://ruo.bio/product/ara-290-10mg/` | Loaded | Product page with quantity discount, lab result details, and RUO terms. |
| `https://ruo.bio/product/peg-mgf-2mg/` | Loaded | Product page with sale pricing, test-status claims, and RUO terms. |
| `https://ruo.bio/product/bpc-157/` | Redirected to registration | Direct product page access blocked logged out in this run. |
| `https://ruo.bio/product/cagrilintide/` | Redirected to registration | Direct product page access blocked logged out in this run, though category and search results showed product name/pricing. |
| `https://ruo.bio/product/retatrutide/` | Redirected to registration | Direct product page access blocked logged out in this run. |

## Registration Findings

- The registration page is the central gate for home, shop, FAQ, refund/shipping, MTA, checkout, and account flows.
- Required visible fields included name, email, date/date of birth placeholder, password, confirm password, industry, industry credential/position, consent, and signature.
- Optional or conditional fields appeared in one registration variant as company/lab name and EIN.
- Industry options included analytical/scientific research, academic/university research, biotechnology/R&D, chemical/material sciences, private/independent CRO, toxicology/environmental research, wholesale/chemical company, and None.
- Credential/position options included analytical chemist, research scientist, formulation chemist, laboratory technician, postdoc researcher, materials engineer, chemical distributor, and None.
- The form displays negative gate messaging if the user selects a non-qualifying industry or position.
- Short exact UI fragments observed: `Consent(Required)`, `Signature(Required)`, `I Agree`, `I Disagree`.
- The inline terms page ended with signature-related signals and three status words: Verified, Qualified, Compliant.
- I did not fill the form, check consent, sign, or submit account creation.

## Account/Post-Signup Findings

- Blocked/pending human: no account was created, so the account dashboard, post-signup terms, post-signup notices, and logged-in checkout could not be inspected.
- Direct `my-account` access redirects to registration.
- Direct checkout redirects to registration, so any logged-in checkout agreement, payment terms checkbox, order MTA presentation, or post-registration MTA could not be confirmed.
- The Terms say each order requires execution and return of a Material Transfer Agreement, but the MTA URL itself redirects to registration while logged out.

## Legal Terms Found

Source: `https://ruo.bio/terms-of-service/`

- Research-use structure: products are framed as laboratory/research materials and not as consumer, clinical, diagnostic, therapeutic, food, drug, cosmetic, veterinary, or household products.
- Access terms: continuing to access the site is framed as confirmation that the visitor has read the RUO disclaimer, is 21+, is a qualified researcher, and accepts the full terms.
- Qualification representations: customers represent that they have training, equipment, facilities, knowledge of chemical hazards, and legal compliance responsibility.
- FDA/503A/503B disclaimer: RUO.bio says it is a RUO chemical supplier and not a compounding pharmacy, medical provider, or outsourcing facility.
- Blacklist policy: the terms reserve the right to deny access, cancel/suspend accounts, blacklist customers permanently, and treat usage-guidance requests as evidence of lack of qualification.
- No guidance policy: RUO says it does not provide use guidelines or suggestions.
- Order formation: listed prices are characterized as invitations, not binding offers; a contract forms only upon written confirmation of order acceptance.
- Payment methods: terms say major credit cards, ACH/wire, and cryptocurrency through compliant providers are accepted.
- Payment finality: exact short phrase observed: `ALL SALES ARE FINAL`.
- Refund/returns: no returns, refunds, exchanges, or cancellations after payment, except limited verified manufacturing defect scenarios.
- Chargeback remedies: the terms list account termination, collections/attorney fees, a `2,500` dollar liquidated damages fee, and possible regulatory reporting if chargeback prerequisites are not followed.
- Shipping: continental United States only, UPS/FedEx only, customer address responsibility, and possible refusal of high-risk addresses.
- MTA: exact short label observed: `Material Transfer Agreement (MTA)`. Terms say it is incorporated by reference and required for each order.
- Privacy/data: first/last name, email, date of birth, billing/shipping address, payment information, phone, and order information may be collected; information may be shared with processors, carriers, and legal/regulatory authorities.
- Affiliate terms: affiliate misuse can lead to termination, forfeiture of unpaid commissions, and permanent bar from re-enrollment.
- Disputes: Wyoming law, informal negotiation period, AAA arbitration in Wyoming, fee-shifting for the prevailing party, and limited injunctive relief paths.
- Liability/indemnity: broad product disclaimer, no guarantee of research results, total liability capped at purchase price or 500 dollars where allowed, and broad indemnity/hold-harmless obligations.
- Terms changes: continued use or purchase after posted changes is treated as acceptance.

Source: `https://ruo.bio/contact-us/`

- The contact form limits support to shipping, payment, billing, damage/incomplete order, and other logistics topics.
- It says support does not assist with product usage or research protocol questions.
- It includes a pre-submit acknowledgment checkbox for the Important Notice and Zero Tolerance Policy.

Source: public footer/disclaimer blocks across About, Contact, Cart, Terms, product pages, and category pages.

- Footer disclaimers repeatedly connect site access and purchasing to compliance with laws, no medical advice, Terms of Service, and the 503A/503B non-pharmacy/non-outsourcing position.

## Checkout/Cart Findings

- Direct `https://ruo.bio/checkout/` redirected to registration while logged out.
- Direct `https://ruo.bio/cart/` loaded, but the cart was empty in the current page session.
- Public category/add-to-cart-style pages showed temporary mini-cart state and checkout links, but checkout still redirected to registration.
- Mini-cart observations from public listing pages:
  - Free delivery threshold shown as 250 dollars.
  - Remaining amount messaging appeared under mini-cart.
  - Checkout link was present but not reachable without registration/login.
- Discount page payment method claims:
  - Credit/debit card: no fee.
  - Zelle: free.
  - Bank transfer: 5 dollars off.
  - Cryptocurrency: 5 percent off.
- Terms payment method claims:
  - Major credit cards.
  - ACH/wire transfers.
  - BTC, ETH, and USDT through compliant providers.
- Stop point: no shipping fields, payment widgets, checkout terms checkbox, MTA execution screen, or final pre-payment terms were reachable without creating/logging into an account.

## Product Page Claims

### Product 1: Survodutide 10mg

URL: `https://ruo.bio/product/survodutide-10mg/`

- Publicly readable while logged out.
- Product category context: peptide list page showed Survodutide on page 2.
- Page showed sale pricing from 98 dollars to 58 dollars, 97 in stock, and add-to-cart control.
- Claims included passed sterility/endotoxins and net content/purity checks.
- Lab result metadata shown: analysis date November 12, 2025; lot `SUR001`; full report and historical links available.
- Properties shown included CAS 2805997-46-8, 10mg content, fine white lyophilized powder, and a PubChem safety summary link.
- The product page described Survodutide as a dual GLP-1/GCGR agonist in the synonyms field.
- Short exact RUO phrase on the page: `Laboratory research use only (RUO)`.

### Product 2: PNC-27 5mg

URL: `https://ruo.bio/product/pnc-27-5mg/`

- Publicly readable while logged out.
- Page showed 78 dollar price, in-stock status, and add-to-cart control.
- Claims included passed sterility/endotoxins and net content/purity checks.
- Product properties included PNC-27/p53-penetratin-related synonyms, sequence, molecular formula, molecular weight, 5mg content, and fine white lyophilized powder.
- The page included the same no-human/no-animal/no-diagnostic/no-household RUO restriction structure and the same footer disclaimer framework.

### Additional product pages checked

- `https://ruo.bio/product/ara-290-10mg/` loaded and showed in-stock status, 36 dollar price, quantity discount, lab result metadata, PubChem link, passed quality claims, and RUO terms.
- `https://ruo.bio/product/peg-mgf-2mg/` loaded and showed 28 dollar price, passed quality claims, cash-back/login messaging, PubChem link, and RUO terms.
- `https://ruo.bio/product/bpc-157/`, `https://ruo.bio/product/cagrilintide/`, and `https://ruo.bio/product/retatrutide/` redirected to registration when opened directly while logged out.

## Hidden or Conditional Text

- Registration redirects preserve the originally requested URL through a `redirect_to` parameter.
- The registration form has conditional qualification logic: non-qualifying industry/position choices trigger denial-style messaging.
- Consent and signature are part of the registration gate, but I did not interact with them.
- Several product and policy URLs are not consistently public: some product pages loaded, while others redirected to registration.
- The MTA is incorporated by reference in the terms but hidden behind registration when opened logged out.
- Footer/mobile/off-canvas page chrome repeats menu, login, mini-cart, and disclaimer blocks on many pages.
- The bottom disclaimer gate appears on product/category/cart pages with agree/disagree controls and warns that insufficient qualifications prevent access.

## Blocked/Missing Items

- Account creation: intentionally not performed.
- Consent checkbox: intentionally not checked.
- Signature: intentionally not entered.
- Password fields: intentionally not used.
- Logged-in dashboard: blocked until account creation/login.
- Post-signup legal screens: blocked until account creation/login.
- Checkout form: blocked by registration redirect while logged out.
- Checkout payment methods actually rendered at payment step: not reached.
- Checkout legal checkbox wording: not reached.
- MTA full text: not available logged out; URL redirects to registration.
- Shipping/refunds standalone page: not available logged out; URL redirects to registration.
- FAQ accordions: not available logged out; FAQ URL redirects to registration.
- Mobile menu screenshot: no image screenshot was captured, but duplicated menu blocks were visible in text-rendered page output.
- Screenshots: none created in this run.

## Raw Evidence Index

Primary live URLs inspected:

- `https://ruo.bio/`
- `https://ruo.bio/registration/`
- `https://ruo.bio/terms-of-service/`
- `https://ruo.bio/shipping-refunds-returns-policy/`
- `https://ruo.bio/mta/`
- `https://ruo.bio/faqs/`
- `https://ruo.bio/order-tracking/`
- `https://ruo.bio/my-account/`
- `https://ruo.bio/cart/`
- `https://ruo.bio/checkout/`
- `https://ruo.bio/about-us/`
- `https://ruo.bio/contact-us/`
- `https://ruo.bio/discounts/`
- `https://ruo.bio/lab-results/`
- `https://ruo.bio/product-category/peptides/?per_page=30`
- `https://ruo.bio/product-category/peptides/page/2/?per_page=30`
- `https://ruo.bio/product/survodutide-10mg/`
- `https://ruo.bio/product/pnc-27-5mg/`
- `https://ruo.bio/product/ara-290-10mg/`
- `https://ruo.bio/product/peg-mgf-2mg/`
- `https://ruo.bio/product/bpc-157/`
- `https://ruo.bio/product/cagrilintide/`
- `https://ruo.bio/product/retatrutide/`

Supplemental evidence:

- ARA-290 lab report image reached from the product page full-report link: `https://ruo.bio/wp-content/uploads/2025/09/Test-Report-64291.png`

Local checklist files consulted, not used as primary fresh evidence:

- `/Users/abhinavkumar/Desktop/mogtrixx-research/ruo-registration-evidence/ruo-registration-report.md`
- `/Users/abhinavkumar/Desktop/mogtrixx-research/ruo-registration-evidence/RUO_BIO_Legal_Report.md`

