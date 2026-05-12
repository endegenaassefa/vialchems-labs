# RUO Registration Human Evidence Update

Access date: April 27, 2026 / April 28, 2026 session context  
Evidence source: user-provided screenshots and `/Users/abhinavkumar/Downloads/Untitled document.txt`  
Privacy note: personal email, birth date, and password fields shown in screenshots are intentionally not reproduced here.

## Evidence Items Reviewed

- `/Users/abhinavkumar/Downloads/Untitled document.txt`
- `/Users/abhinavkumar/Desktop/Screenshot 2026-04-27 at 11.00.53 PM.png`
- `/Users/abhinavkumar/Desktop/Screenshot 2026-04-27 at 11.01.38 PM.png`
- `/Users/abhinavkumar/Desktop/Screenshot 2026-04-27 at 11.01.59 PM.png`
- `/Users/abhinavkumar/Desktop/Screenshot 2026-04-27 at 11.03.17 PM.png`

Two other provided screenshots appear unrelated to this RUO/StrateLabs legal-disclosure flow:

- Domain registration cart for `mogtrixlabs.bio`
- Xcode project window

## Registration Gate Observed

The RUO registration page shows a tabbed card with `Log In` and `Registration`. The registration form requires the user to provide:

- First name
- Last name
- Email address
- Date field/date of birth
- Password
- Confirm password
- Industry
- Industry credentials
- Consent/terms acknowledgement
- Signature

The screenshot evidence shows the page after selecting the `Registration` tab and before final account creation.

## Industry Qualification Gate

The `Select Industry*` dropdown includes these observed options:

- Analytical / Scientific Research
- Academic / University Research
- Biotechnology / R&D
- Chemical / Material Sciences
- Private / Independent CRO
- Toxicology / Environmental Research
- Wholesale / Chemical Company
- None

The selected industry in the screenshot is `Analytical / Scientific Research`.

After industry selection, the form reveals:

- `Industry Credentials*`
- `Company / Lab Name (Optional)`
- `EIN (Optional)`

The page also displays three trust/compliance badges at the bottom of the form:

- `Verified`
- `Qualified`
- `Compliant`

## Terms and Conditions Gate

The user-provided terms file is titled:

`TERMS AND CONDITIONS OF SERVICE`

It states a last-updated date of December 15, 2025.

The terms shown in the registration flow include these key user-facing commitments and restrictions:

- Accessing or using the site is framed as agreement to the full Terms.
- The user affirms they are at least 21 years old.
- Products are described as laboratory research materials only.
- Products are not for human or animal consumption.
- Products are not intended to diagnose, treat, cure, or prevent disease.
- Products should not be used as food, drugs, cosmetics, or household products.
- Users must ensure legal compliance in their own jurisdiction.
- Website information is not medical advice.
- The customer represents that they are qualified or operate in a controlled laboratory environment.
- The customer represents they have the training, equipment, and facilities to handle research materials.
- RUO.bio states it is not a compounding pharmacy, medical provider, or 503A/503B outsourcing facility.

## Blacklist and No-Guidance Language

The terms contain a strict blacklist/no-guidance structure:

- Communications suggesting human/animal use or other prohibited use may trigger a refusal-to-sell or blacklist response.
- The blacklist is described as permanent.
- Prohibited uses include human/animal consumption, diagnostic/therapeutic/clinical applications, compounding under 503A/503B, performance enhancement, aesthetic purposes, consumer/agricultural/commercial applications, and human/animal educational demonstrations.
- Requests for usage guidance may be treated as evidence of lack of qualification.
- RUO.bio may cancel orders or terminate accounts based on perceived lack of qualification.

## Order, Payment, and Refund Terms

The terms state:

- Listed prices are invitations to conduct business, not binding offers.
- A contract forms only after RUO.bio provides written order acceptance.
- Accepted payment categories include major cards, ACH/wire, and cryptocurrency including BTC, ETH, and USDT.
- `ALL SALES ARE FINAL`.
- Orders are non-cancellable once payment is processed.
- Refunds are limited to verified manufacturing defect situations.
- Chargebacks may trigger account termination, collections/attorney fees, a $2,500 liquidated damages fee, and possible regulatory reporting.

## Shipping and MTA Terms

The terms state:

- Shipping is limited to the continental United States.
- UPS and FedEx are the listed carriers.
- RUO.bio may refuse high-risk addresses.
- Each order requires execution and return of RUO.bio's Material Transfer Agreement.
- The MTA is incorporated into the Terms by reference.

## Liability, Warranty, and Indemnity

The terms state:

- Products are provided as-is unless otherwise required by law.
- RUO.bio makes no guarantee of experimental outcomes, application performance, or batch-to-batch consistency beyond specifications.
- Liability is capped at the purchase price of the specific product or $500 where allowed.
- Customer indemnity covers claims arising from site use, handling, misuse, transfer, or violation of the Terms.

## Dispute Resolution

The terms state:

- Wyoming law governs.
- Disputes require a 30-day informal negotiation period before formal proceedings.
- Unresolved disputes go to AAA arbitration in Wyoming.
- Prevailing-party fee shifting may apply.
- RUO.bio reserves court access for injunctive/equitable relief involving IP, confidential information, or payment enforcement.

## Final Registration Step Observed

The final screenshot shows:

- A visible `Signature (Required)` field.
- A visible `Create Research Account` button.
- The embedded terms pane scrolled near the beginning of `AGREEMENT TO TERMS`.

This is a human-handoff point. The agent should not sign or click the final account-creation button. The human must decide whether to sign and create the account. After that, the next evidence target is the post-signup dashboard and any redirected legal/MTA/checkout page.

## Next Evidence Needed

After the human signs and clicks `Create Research Account`, capture screenshots of:

- Any success or error message
- Account dashboard
- Any post-signup legal notice
- `/mta/` while logged in
- `/shipping-refunds-returns-policy/` while logged in
- `/faqs/` while logged in
- Cart page while logged in
- Checkout page before payment
- Any checkout terms checkbox or order-level MTA requirement
