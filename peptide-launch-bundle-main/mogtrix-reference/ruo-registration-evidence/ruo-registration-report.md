# RUO.bio Registration Flow Report

Generated: 2026-04-27 20:43:44 EDT (-0400)

Primary page:
- URL: `https://ruo.bio/registration/`
- Title: `Registration - RUO | Premium Research Material`
- Initial browser result: loaded directly, no redirect observed on first load

Observed redirect and gating behavior:
- Current in-app browser state at one point: `https://ruo.bio/registration/?redirect_to=https%3A%2F%2Fruo.bio%2Fshipping-refunds-returns-policy%2F`
- Direct request to `https://ruo.bio/mta/` returned `302` to `https://ruo.bio/registration/?redirect_to=https%3A%2F%2Fruo.bio%2Fmta%2F`
- The registration page contains a hidden redirect field that can send the user onward after login/registration

## Timeline

1. Opened `https://ruo.bio/registration/`.
2. Captured the page before interacting.
3. Activated the `Registration` tab.
4. Extracted the registration form HTML and the inline `Terms & Conditions` accordion text.
5. Revealed the conditional consent section by selecting a qualifying industry and credential, without checking the consent box or submitting the form.
6. Stopped before any legal acceptance, signature submission, or account creation.

## Required Fields And Controls

Visible required fields:
- `First Name*`
- `Last Name*`
- `Email*`
- `Enter Password*`
- `Confirm Password*`
- `Select Industry*`
- `Industry Credentials*`
- `Consent` checkbox
- `Signature` box

Visible optional fields:
- `Company / Lab Name (Optional)`
- `EIN (Optional)`

Field with mixed signals:
- `Date of Birth*`
  - Visible placeholder includes an asterisk.
  - The field label is just `Date`.
  - In the extracted HTML it is not marked with the same required class/ARIA flags used on clearly required fields.
  - It still appears to be intended for age verification.

Hidden field:
- `Redirect To`
  - Hidden input observed in HTML.
  - Example value on the base page: `https://ruo.bio/`
  - Example value on gated pages: `https://ruo.bio/shipping-refunds-returns-policy/`

Conditional display behavior observed in the page logic:
- `Select Industry` appears after first name, last name, and email are present.
- `Industry Credentials` appears after a non-`None` industry is selected.
- `Company / Lab Name`, `EIN`, the `Consent` checkbox, and the `Terms & Conditions` accordion appear after a non-`None` industry and credential are selected.
- The `Signature` box remains hidden until the consent checkbox is checked.
- The final `Create Research Account` submit step remains behind the consent/signature path.

## Checkbox, Consent, Accordion, Signature

### 1. Consent Checkbox

Required: `Yes`

Pre-checked: `No`

Exact visible text observed after the conditional fields were revealed:

`I, Fabricio Rodriguez, affirm that I hold the position of Research Scientist in the Analytical / Scientific Research sector. I am 21 years of age or older, trained in handling Research Use Only (RUO) materials, and work in a qualified research environment equipped with appropriate personal protective equipment (PPE). I have read and agree to the terms and conditions.`

Linked policy from this checkbox:
- `https://ruo.bio/terms-of-service`

Notes:
- The checkbox text is dynamically personalized with the entered name and selected role/sector.
- The checkbox was not checked.

### 2. Terms & Conditions Accordion

Required to read before acceptance path: functionally `Yes`

Default state: `Collapsed`

Visible label:
- `Terms & Conditions`

Notes:
- The registration page includes a full inline accordion containing the terms text.
- The consent checkbox separately links out to `https://ruo.bio/terms-of-service`.
- The inline accordion text and the standalone terms page are materially the same Terms of Service text, though the extracted standalone page dump includes more page chrome.

Full inline accordion text:
- See [registration-inline-terms.txt](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/registration-inline-terms.txt)

Standalone terms page source:
- See [terms-of-service.html](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/terms-of-service.html)
- See [terms-of-service.txt](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/terms-of-service.txt)

### 3. Signature Box

Required: `Yes`

Pre-filled: `No`

Visible label:
- `Signature`

Notes:
- Implemented as a signature canvas, not a typed name field.
- Hidden until the consent checkbox is checked.
- I did not check the box and did not sign.

## Linked Policies And Legal URLs

Directly linked from the consent box:
- `https://ruo.bio/terms-of-service`

Referenced inside the terms:
- `https://ruo.bio/mta/`
  - Access-controlled at the time of capture.
  - Direct request redirected to registration with a `redirect_to` parameter.

Related policy pages found in the site sitemap / policy stack:
- `https://ruo.bio/shipping-refunds-returns-policy/`

Saved local copies:
- [registration.html](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/registration.html)
- [gform1.html](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/gform1.html)
- [registration-inline-terms.txt](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/registration-inline-terms.txt)
- [terms-of-service.html](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/terms-of-service.html)
- [terms-of-service.txt](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/terms-of-service.txt)
- [shipping-refunds-returns-policy.html](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/shipping-refunds-returns-policy.html)
- [shipping-refunds-returns-policy.txt](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/shipping-refunds-returns-policy.txt)
- [mta.html](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/mta.html)

## Clauses That Look Most Significant

Research-use-only / no-human-consumption:
- Products are for `laboratory research purposes only`.
- Repeated `not for human or animal consumption`.
- Repeated `not intended to diagnose, treat, cure, or prevent any disease`.
- Repeated `not medical advice`.

Age gate / qualification gate:
- Customer affirms they are `at least 21 years of age`.
- Customer must be a `qualified researcher`.
- Consent text requires the user to affirm training in handling RUO materials and use in a qualified environment with PPE.

Account and access restrictions:
- `ZERO-TOLERANCE POLICY` and permanent blacklist language.
- Requests for usage guidance may be treated as evidence of lack of qualification and may lead to order cancellation or account termination.
- RUO.bio reserves the right to deny access or sales to underage or unqualified individuals.

Refund / payment / chargeback terms:
- `ALL SALES ARE FINAL`
- `Orders are non-cancellable once payment is processed`
- `NO RETURNS OR REFUNDS` except verified manufacturing defects
- `No exchanges`
- Chargeback language includes `Immediate account termination`, `Collections proceedings`, and a `$2,500 liquidated damages fee`

Liability / indemnity:
- Broad limitation of liability
- Broad indemnity / hold harmless clause
- Total liability cap language and disclaimer of indirect/consequential damages

Arbitration / dispute resolution:
- Binding arbitration under the AAA Commercial Arbitration Rules
- Wyoming governing law and Wyoming forum language
- Prevailing-party fees language

Material Transfer Agreement:
- Terms say each order requires execution and return of RUO.bio’s `Material Transfer Agreement (MTA)`
- The MTA is incorporated by reference into the Terms
- The MTA URL redirected back to registration during capture

Privacy / data collection:
- Terms say account creation may require first name, last name, and email
- Terms say date of birth may be required for age verification
- Terms say order information may include billing/shipping addresses, phone number, and payment information
- Terms say information may be shared with payment processors, shipping carriers, and legal/regulatory authorities

## Screenshots

- Initial page before interaction: [01-registration-initial-full.png](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/01-registration-initial-full.png)
- Registration tab visible: [02-registration-tab-full.png](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/02-registration-tab-full.png)
- Registration state with consent section revealed in the DOM path: [05-registration-consent-state-full.png](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/05-registration-consent-state-full.png)
- Browser-captured legal page attempts (these resolved back into registration-gated state during browser capture): [03-terms-of-service-full.png](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/03-terms-of-service-full.png), [04-shipping-refunds-returns-full.png](/Users/fabriciorodriguez/Desktop/ruo-registration-evidence/04-shipping-refunds-returns-full.png)

## Hidden / Accordion / Disabled / Gated Notes

- The `Terms & Conditions` text is tucked inside a collapsed accordion.
- The single consent checkbox is hidden until the user supplies name, email, industry, and credentials.
- The signature box is hidden until the consent checkbox is checked.
- The MTA is referenced in the Terms but redirected back to registration during access.
- I did not click the consent checkbox.
- I did not sign the signature box.
- I did not press `Create Research Account`.
