# RUO.BIO REGISTRATION AGREEMENTS & LEGAL TERMS REPORT

## Title Page

**Prepared for:** Journalism, consumer-protection, and compliance research  
**Subject:** RUO.bio registration flow, consent language, and linked legal terms  
**Prepared on:** April 27, 2026  
**Primary URL reviewed:** `https://ruo.bio/registration/`  
**Status:** Evidence captured up to, but not including, checkbox acceptance, signature submission, or account creation

> **Method note**
>
> This report consolidates the registration-page evidence already captured during live review. It uses exact wording where it was directly captured from the flow, and detailed paraphrase where the legal text was too long, embedded, collapsed, or gated behind redirects. No checkbox was checked, no signature was submitted, and no account was created.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Registration Flow Overview](#2-registration-flow-overview)
3. [Required Fields](#3-required-fields)
4. [Optional Fields](#4-optional-fields)
5. [Consent Checkbox (Exact Text)](#5-consent-checkbox-exact-text)
6. [Terms of Service](#6-terms-of-service)
7. [Refund / Shipping / Returns Policy](#7-refund--shipping--returns-policy)
8. [Privacy & Data Collection Terms](#8-privacy--data-collection-terms)
9. [Arbitration & Dispute Resolution](#9-arbitration--dispute-resolution)
10. [Liability Waivers](#10-liability-waivers)
11. [Indemnity / Hold Harmless Terms](#11-indemnity--hold-harmless-terms)
12. [Chargeback Penalties & Fees](#12-chargeback-penalties--fees)
13. [Research Use Only / No Human Consumption Clauses](#13-research-use-only--no-human-consumption-clauses)
14. [Age & Qualification Requirements](#14-age--qualification-requirements)
15. [Hidden / Conditional Registration Text](#15-hidden--conditional-registration-text)
16. [Material Transfer Agreement (MTA)](#16-material-transfer-agreement-mta)
17. [Most Suspicious Clauses](#17-most-suspicious-clauses)
18. [Plain-English Explanation of What a User Is Agreeing To](#18-plain-english-explanation-of-what-a-user-is-agreeing-to)
19. [Final Risk Assessment](#19-final-risk-assessment)
20. [Appendix (Raw Quotes)](#20-appendix-raw-quotes)

---

## 1. Executive Summary

RUO.bio’s registration flow is not a simple account-creation form. It is a gated access funnel that conditions registration on a research-qualification narrative and a personalized consent statement. The user is pushed through industry and credential selections before the site reveals the legal acceptance layer. Once those selections are made, the site surfaces:

- a required personalized consent checkbox,
- a collapsed `Terms & Conditions` accordion,
- a required signature box that appears after consent,
- a final account-creation button that remains behind those legal steps.

The strongest legal and consumer-risk signals captured in this review were:

- an explicit `ALL SALES ARE FINAL` posture,
- a no-refund / no-cancellation structure except limited manufacturing-defect cases,
- a `$2,500 liquidated damages fee` tied to chargeback behavior,
- broad indemnity and hold-harmless language,
- binding arbitration in Wyoming,
- a permanent blacklist / refusal-to-sell regime,
- heavy `research use only` and `not for human or animal consumption` restrictions,
- incorporation of a separate `Material Transfer Agreement (MTA)` by reference,
- conditional and partially hidden legal text that only appears after the user fills enough of the form.

> **Assessment**
>
> The registration flow appears designed not only to collect account information, but also to generate a record that the registrant affirmatively represented age, research qualifications, role, sector, training, and agreement to a dense legal regime before receiving access.

---

## 2. Registration Flow Overview

### 2.1 Entry Page

The page opened at:

- `https://ruo.bio/registration/`
- Page title: `Registration - RUO | Premium Research Material`

The registration URL presents a combined login / registration layout. The registration tab is present but not foregrounded until selected.

### 2.2 What Happens Before the Legal Layer Appears

The site reveals form components in stages. Based on the extracted page logic:

1. Name and email must be present before the industry selector becomes materially usable.
2. A non-`None` industry selection is required before the credential selector is meaningfully available.
3. A non-`None` credential selection is required before the consent checkbox and terms accordion appear.
4. The signature pad remains hidden until the consent checkbox is checked.
5. The final `Create Research Account` step sits behind the checkbox-and-signature sequence.

### 2.3 Redirect and Gating Behavior

The registration flow also functions as an access-control gateway for other legal or commercial pages:

- A registration URL with `redirect_to` was observed during the live session.
- Direct request to the MTA URL redirected back into the registration flow.
- A hidden `Redirect To` field exists in the registration form HTML.

> **Why this matters**
>
> The legal pages are not fully separable from the registration gate. In practice, access to at least some referenced legal material appears to depend on going through the registration flow first.

---

## 3. Required Fields

The following fields or controls were captured as required in the live or extracted registration flow:

| Field / Control | Required | Notes |
| --- | --- | --- |
| First Name | Yes | Visible as `First Name*` |
| Last Name | Yes | Visible as `Last Name*` |
| Email | Yes | Visible as `Email*` |
| Date of Birth | Intended yes | Placeholder shows `Date of Birth*`; markup signals were less explicit than other required fields |
| Enter Password | Yes | Visible as `Enter Password*` |
| Confirm Password | Yes | Visible as `Confirm Password*` |
| Select Industry | Yes | Hidden/conditional logic tied to earlier fields |
| Industry Credentials | Yes | Hidden until qualifying industry selected |
| Consent Checkbox | Yes | Hidden until industry + credential selected |
| Signature Box | Yes | Hidden until checkbox is checked |

> **Note**
>
> The date-of-birth field is treated here as effectively required because the form presents it with an asterisk and the surrounding legal language ties access to age verification.

---

## 4. Optional Fields

The following fields were captured as optional:

| Field | Optional | Notes |
| --- | --- | --- |
| Company / Lab Name | Yes | Visible as `Company / Lab Name (Optional)` |
| EIN | Yes | Visible as `EIN (Optional)` |

These optional fields appear only after the qualification path is sufficiently advanced.

---

## 5. Consent Checkbox (Exact Text)

### 5.1 Exact Captured Text

The consent checkbox was captured in the live registration DOM after selecting:

- Industry: `Analytical / Scientific Research`
- Credential: `Research Scientist`

The exact visible checkbox text captured was:

> **Exact quote**
>
> I, Fabricio Rodriguez, affirm that I hold the position of Research Scientist in the Analytical / Scientific Research sector. I am 21 years of age or older, trained in handling Research Use Only (RUO) materials, and work in a qualified research environment equipped with appropriate personal protective equipment (PPE). I have read and agree to the terms and conditions.

### 5.2 Status

- Required: **Yes**
- Pre-checked: **No**
- Linked policy: `https://ruo.bio/terms-of-service`

### 5.3 Plain-English Meaning

This is not a neutral acknowledgment. It asks the registrant to make multiple factual and legal representations at once:

- that the stated role and sector are true,
- that the person is at least 21,
- that the person is trained to handle RUO materials,
- that the person works in an appropriately equipped research environment,
- and that the person agrees to the site’s legal terms.

> **Red flag**
>
> The checkbox is personalized and tied to professional identity, age, training, and safety practices. That makes it more than a basic “I agree” box; it is a bundled attestation.

---

## 6. Terms of Service

### 6.1 Form of Presentation

The terms were presented in two ways:

- as a collapsed `Terms & Conditions` accordion embedded inside the registration flow,
- as a linked standalone terms page at `https://ruo.bio/terms-of-service`.

The registration experience therefore places legal text directly inside the account-creation path while also linking out to a dedicated terms page.

### 6.2 Key Exact Phrases Captured

> **Exact quote**
>
> `at least 21 years of age`

> **Exact quote**
>
> `qualified researcher`

> **Exact quote**
>
> `ALL SALES ARE FINAL`

> **Exact quote**
>
> `binding arbitration`

### 6.3 Detailed Paraphrase of the Terms Structure

The captured terms page begins with an agreement-to-terms section stating that a user accessing the website or purchasing products affirms age eligibility and agrees to the terms. The access disclaimer then frames the site around a research-use-only regime. It states that the products are only for laboratory research, not for human or animal consumption, not for disease diagnosis/treatment/cure/prevention, and not for food, drug, cosmetic, or household use. It also says that no website information should be interpreted as medical advice.

The terms then require the user to confirm that they:

- read and understood the research-use disclaimer,
- are at least 21,
- are a qualified researcher,
- and accept the full terms by continuing to access the site.

The product-purpose section repeats the RUO-only restriction. The customer-representations section expands that restriction into competence and compliance statements: the user represents that they are qualified, understand hazards, possess the needed knowledge, training, equipment, and facilities, and will comply with applicable law.

The FDA/legal disclaimer says the site’s statements have not been evaluated by the FDA and that RUO.bio is not a compounding pharmacy, medical provider, or outsourcing facility under the cited federal provisions.

The blacklist section is unusually aggressive. It says that communication suggesting improper intended use can trigger a refusal-to-sell or blacklist response, that the customer may be added to a banned database, and that a ban is permanent. It lists prohibited uses including human or animal consumption, clinical uses, certain compounding uses, performance or aesthetic uses, consumer/agricultural/commercial uses, and educational demonstrations involving human or animal subjects.

The no-guidance / affiliation section says RUO.bio assumes customer familiarity with the products and will not provide guidelines for use. It also says requests for usage guidance can be treated as evidence of insufficient qualification. The same section states that the customer represents affiliation with a lab, university, institution, or research-based facility and that RUO.bio may require affiliation verification before order fulfillment.

The remainder of the terms covers website use restrictions, modification and availability disclaimers, order and payment terms, shipping restrictions, incorporation of the MTA, refund policy, product disclaimer, no-guarantee-of-results language, liability limitations, indemnity, privacy and data-use language, affiliate-program terms, Wyoming governing law, AAA arbitration, severability, force majeure, and final acknowledgment language.

### 6.4 Plain-English Meaning

The terms are drafted to do four things at once:

1. limit product use to research-only scenarios,
2. force the user to represent age and professional competence,
3. restrict remedies if something goes wrong,
4. shift legal and operational risk onto the customer.

---

## 7. Refund / Shipping / Returns Policy

### 7.1 Key Exact Phrases Captured

> **Exact quote**
>
> `No cancellations after payment`

> **Exact quote**
>
> `No exchanges`

> **Exact quote**
>
> `Cash refunds are not available`

> **Exact quote**
>
> `within seven (7) calendar days`

### 7.2 Detailed Paraphrase

The captured refund and returns language is hard-line. It says all sales are final, the site does not allow ordinary returns, cancellations, or exchanges after payment, and the only recognized exception is a verified manufacturing defect. Even then, the remedy is limited: RUO.bio may choose replacement or credit toward a future purchase, while cash refunds remain unavailable except where law requires otherwise.

The inspection section requires the customer to inspect shipments immediately and report problems in writing within seven calendar days of delivery. The customer is expected to provide photographs and, where reasonably available, analytical data to support a claim.

The shipping section says shipping is limited to the continental United States, that UPS and FedEx are used, and that the company may refuse high-risk addresses. It also shifts responsibility for incorrect or incomplete shipping information to the customer.

### 7.3 Plain-English Meaning

Once money is paid, the customer’s exit options are sharply limited. The site reserves discretion over remedies and makes the customer carry a prompt reporting burden if there is a defect or shipment issue.

> **Why this matters**
>
> This structure is especially important because it appears alongside aggressive chargeback language, meaning the site restricts both refund channels and dispute workarounds.

---

## 8. Privacy & Data Collection Terms

### 8.1 Presentation

No separately surfaced pre-account privacy page was cleanly available in the captured registration flow. Instead, privacy language appeared inside the Terms of Service text.

### 8.2 Key Exact Phrases Captured

> **Exact quote**
>
> `payment processors`

> **Exact quote**
>
> `shipping carriers`

> **Exact quote**
>
> `legal and regulatory authorities`

### 8.3 Detailed Paraphrase

The privacy section says RUO.bio may require first name, last name, and email for account creation. It also says date of birth may be required for age verification. For orders, it says the company may collect billing and shipping addresses, payment information processed through third-party providers, phone number, and email address.

The stated uses of information include:

- processing and fulfilling orders,
- verifying age and eligibility,
- communicating about orders and support,
- complying with legal and regulatory obligations,
- and preventing fraud.

The terms say information may be shared with payment processors, shipping carriers, and legal or regulatory authorities when required by law or to enforce the terms. They also say the company does not sell or rent personal information to third parties for marketing and does not use sensitive personal information without consent except as required by law or performance needs under the terms.

The privacy section also includes user-rights language covering access, deletion, correction, portability, restriction, withdrawal of consent, appeal rights, and communication preferences, subject to legal exceptions.

### 8.4 Plain-English Meaning

The privacy language is not just about marketing or cookies. It is tightly linked to account qualification, order enforcement, regulatory compliance, and dispute posture.

---

## 9. Arbitration & Dispute Resolution

### 9.1 Key Exact Phrase Captured

> **Exact quote**
>
> `binding arbitration`

### 9.2 Detailed Paraphrase

The dispute-resolution section says the terms are governed by Wyoming law. Before formal dispute proceedings begin, the parties must attempt informal negotiation for 30 days. If that fails, disputes are to be finally resolved by binding arbitration administered by the American Arbitration Association under its Commercial Arbitration Rules, with the arbitration conducted in Wyoming.

The clause also says:

- judgment on the arbitration award may be entered in a court with jurisdiction,
- each side bears its own costs and attorneys’ fees, subject to a prevailing-party fee rule in arbitration or litigation,
- RUO.bio may seek injunctive or equitable relief in court to protect IP, confidential information, or payment rights,
- the customer’s ability to seek injunctive relief is narrowed to Wyoming state or federal courts.

### 9.3 Plain-English Meaning

A customer is being steered away from ordinary court litigation and toward a Wyoming-centered arbitration process with additional procedural burdens.

> **Why this matters**
>
> Arbitration can increase cost and friction for consumers, especially when paired with forum-selection language and aggressive fee-shifting or chargeback language.

---

## 10. Liability Waivers

### 10.1 Detailed Paraphrase

The liability sections use several overlapping protections. The website and products are described as provided on an `as is` and `as available` basis, with broad disclaimers of warranties except where law requires otherwise. RUO.bio disclaims responsibility for indirect, incidental, consequential, special, and punitive damages and says its total liability will not exceed the purchase price of the specific product, while also including a damages cap framework in the terms.

The site also disclaims guarantees regarding:

- uninterrupted or error-free website use,
- experimental outcomes,
- product performance in specific applications,
- and batch-to-batch consistency beyond specifications.

### 10.2 Plain-English Meaning

If the product, order process, shipping experience, or site behavior causes a problem, the customer’s ability to recover meaningful damages is heavily constrained.

> **Red flag**
>
> The terms combine no-warranty language, damages caps, consequential-damages waivers, and RUO-only framing. That combination is strongly protective of the seller.

---

## 11. Indemnity / Hold Harmless Terms

### 11.1 Key Exact Phrase Captured

> **Exact quote**
>
> `indemnify, defend, and hold harmless`

### 11.2 Detailed Paraphrase

The indemnity clause says the customer must protect RUO.bio and related owners, managers, officers, employees, affiliates, and agents against claims, losses, liabilities, and expenses, including attorneys’ fees, arising from:

- the customer’s use of the website,
- the customer’s handling, misuse, or transfer of products,
- or any violation of the terms.

It also says this indemnity extends to actions by third parties resulting from the customer’s acts or omissions.

### 11.3 Plain-English Meaning

The clause attempts to shift downstream legal exposure from RUO.bio to the customer, including expenses of defending claims.

---

## 12. Chargeback Penalties & Fees

### 12.1 Key Exact Phrase Captured

> **Exact quote**
>
> `$2,500 liquidated damages fee`

### 12.2 Detailed Paraphrase

The chargeback clause says that if a customer initiates a chargeback without first contacting RUO.bio in writing and allowing 30 business days for investigation and good-faith resolution efforts, the company may treat the chargeback as a material breach of the terms.

The listed remedies include:

- immediate account termination,
- collections proceedings including attorneys’ fees,
- a $2,500 liquidated-damages fee,
- and reporting to regulatory authorities.

### 12.3 Plain-English Meaning

This is an unusually aggressive anti-chargeback posture. The terms attempt to create financial and legal consequences for using a standard payment-dispute channel.

> **Why this matters**
>
> When paired with `all sales final` and no-refund language, the chargeback clause becomes especially significant because it can deter customers from contesting a payment even when they believe they have grounds.

---

## 13. Research Use Only / No Human Consumption Clauses

### 13.1 Key Exact Phrases Captured

> **Exact quote**
>
> `not for human or animal consumption`

> **Exact quote**
>
> `not intended to diagnose, treat, cure, or prevent any disease`

### 13.2 Detailed Paraphrase

RUO.bio repeatedly defines its products as laboratory-research materials only. The site says they are not for human or animal consumption, not for diagnosis or treatment, and not for food, drug, cosmetic, household, clinical, consumer, agricultural, or commercial applications. The blacklist section makes this even stronger by warning that improper intended use can lead to permanent loss of access.

### 13.3 Plain-English Meaning

The company is trying to create maximum distance between product sales and any suggestion of human-use, therapeutic-use, or consumer-use scenarios.

---

## 14. Age & Qualification Requirements

### 14.1 Key Exact Phrases Captured

> **Exact quote**
>
> `at least 21 years of age`

> **Exact quote**
>
> `qualified researcher`

### 14.2 Detailed Paraphrase

Age and professional qualification are central to the flow. The terms and checkbox language together require the registrant to represent:

- that they are 21 or older,
- that they are a qualified researcher,
- that they understand the hazards of handling laboratory compounds,
- that they possess necessary training, facilities, and equipment,
- that they operate in a controlled or appropriate research environment,
- and that they comply with applicable laws and regulations.

The form architecture itself reinforces this by requiring industry and credential selection before the legal layer is shown.

### 14.3 Plain-English Meaning

The registration flow is built to collect not just identifying information, but also a professional-status narrative that may later be used to justify access decisions or defend the seller’s legal posture.

---

## 15. Hidden / Conditional Registration Text

### 15.1 Hidden or Collapsed Elements Observed

- The `Terms & Conditions` text is collapsed inside an accordion.
- The consent checkbox is hidden until prior form conditions are satisfied.
- The signature pad is hidden until the checkbox is checked.
- The final account-creation step remains behind those hidden/conditional elements.
- A hidden `Redirect To` input controls post-authentication routing.

### 15.2 Conditional Logic Observed

Based on extracted form logic:

- industry fields were dependent on earlier identity fields,
- credential fields were dependent on industry selection,
- consent and terms were dependent on both identity and qualification inputs,
- signature depended on checkbox completion.

### 15.3 Plain-English Meaning

The site does not surface all material legal text up front. A user must progress through qualification prompts before the legal acceptance layer fully appears.

> **Red flag**
>
> The user’s first impression is a standard registration screen, but the most consequential legal text is deferred and conditionally revealed later in the flow.

---

## 16. Material Transfer Agreement (MTA)

### 16.1 Key Exact Phrase Captured

> **Exact quote**
>
> `Material Transfer Agreement (MTA)`

### 16.2 Detailed Paraphrase

The terms say each order requires execution and return of RUO.bio’s MTA and that the current version of that agreement governs the transaction. The terms further say the MTA is incorporated by reference into the Terms of Service.

During capture, direct access to `https://ruo.bio/mta/` redirected back into the registration flow with a `redirect_to` parameter rather than freely displaying the agreement.

### 16.3 Plain-English Meaning

The site tells the user another agreement is part of the transaction, but the referenced agreement was not cleanly readable without going back through the access gate.

> **Why this matters**
>
> Incorporation by reference can bind users to a document that is not meaningfully surfaced during the immediate registration step.

---

## 17. Most Suspicious Clauses

### 17.1 `$2,500 liquidated damages fee`

> **Exact quote**
>
> `$2,500 liquidated damages fee`

**Explanation:** This is attached to the chargeback section and appears as a penalty-like remedy if the customer disputes payment without following RUO.bio’s required pre-chargeback process.

**Why it matters:** It may deter legitimate payment disputes by increasing the perceived financial risk of using chargeback protections.

### 17.2 Binding arbitration

> **Exact quote**
>
> `binding arbitration`

**Explanation:** Disputes are directed into AAA arbitration in Wyoming after an informal negotiation period.

**Why it matters:** It can increase friction, cost, and procedural disadvantage for customers.

### 17.3 All-sales-final posture

> **Exact quote**
>
> `ALL SALES ARE FINAL`

**Explanation:** The company sharply limits refunds, returns, cancellations, and exchanges.

**Why it matters:** Combined with chargeback penalties, it narrows the user’s practical remedies.

### 17.4 Broad indemnity

> **Exact quote**
>
> `indemnify, defend, and hold harmless`

**Explanation:** The customer takes on responsibility for legal claims and costs tied to use, misuse, transfer, or breach.

**Why it matters:** This shifts legal exposure downstream to the customer.

### 17.5 Blacklist / permanent ban language

**Paraphrase:** The terms say misuse-related communication or suspected improper intent can trigger refusal to sell, a banned-database entry, and a permanent ban.

**Why it matters:** It suggests aggressive enforcement and account-control discretion.

### 17.6 Qualification gatekeeping

**Paraphrase:** The form hides legal-acceptance elements until the user selects a qualifying research industry and role, then asks the user to attest to that role.

**Why it matters:** The form is collecting evidentiary representations, not just credentials for login.

### 17.7 MTA by reference

**Paraphrase:** Another agreement is incorporated into the transaction, but direct access was gated during capture.

**Why it matters:** The user may be asked to accept a broader legal bundle than what is plainly visible at the moment of registration.

### 17.8 Hidden legal flow

**Paraphrase:** Key legal text is hidden in a collapsed accordion and signature-gated behind checkbox progression.

**Why it matters:** A user can move through much of the form before the full legal burden is obvious.

---

## 18. Plain-English Explanation of What a User Is Agreeing To

If a user continues through this flow and accepts the terms, the user is effectively agreeing that:

- they are at least 21,
- they are genuinely a qualified researcher in the role and sector they selected,
- they have training and proper research facilities,
- they understand the materials are not for human or animal use,
- they will comply with all applicable laws,
- they accept that the seller can deny access, blacklist, or cancel based on misuse concerns,
- they accept that sales are effectively final,
- they accept limited remedies and narrow refund rights,
- they accept that disputes may be forced into Wyoming arbitration,
- they accept that chargeback behavior may trigger account termination and a large fee,
- they accept broad liability limitations and indemnity obligations,
- and they may also be agreeing to a separate MTA incorporated by reference.

In ordinary language, the user is not just registering for an account. The user is building a record that they represented themselves as a qualified, adult research buyer and accepted an unusually seller-protective legal package.

---

## 19. Final Risk Assessment

### Overall Risk Level: High

The legal architecture of this registration flow is unusually assertive for a standard account-creation process. The main drivers of that assessment are:

- mandatory professional-status attestation,
- heavy RUO/no-human-use restrictions,
- aggressive blacklist language,
- no-refund / all-sales-final posture,
- chargeback deterrence backed by a fixed-dollar fee,
- broad indemnity and liability constraints,
- arbitration in a seller-selected forum,
- and incorporation of a separate MTA that was not freely accessible during capture.

### Consumer-Protection Concern

From a consumer-protection perspective, the strongest concerns are not just the individual clauses, but the way they are staged:

- the user must advance through the form before material legal text appears,
- the most consequential legal language is partly hidden or collapsed,
- and the consent checkbox bundles multiple factual and legal representations into a single acceptance event.

### Investigative Significance

For investigative or watchdog review, the most important finding is that the flow appears designed to produce a strong evidentiary record in RUO.bio’s favor before granting access or enabling transactions.

---

## 20. Appendix (Raw Quotes)

### 20.1 Consent Checkbox

> I, Fabricio Rodriguez, affirm that I hold the position of Research Scientist in the Analytical / Scientific Research sector. I am 21 years of age or older, trained in handling Research Use Only (RUO) materials, and work in a qualified research environment equipped with appropriate personal protective equipment (PPE). I have read and agree to the terms and conditions.

### 20.2 Exact Clauses and Phrases Captured

> `ALL SALES ARE FINAL`

> `binding arbitration`

> `$2,500 liquidated damages fee`

> `indemnify, defend, and hold harmless`

> `at least 21 years of age`

> `qualified researcher`

> `not for human or animal consumption`

> `No cancellations after payment`

> `No exchanges`

> `Cash refunds are not available`

> `within seven (7) calendar days`

> `Material Transfer Agreement (MTA)`

### 20.3 Captured Evidence Files

- `registration.html`
- `gform1.html`
- `registration-inline-terms.txt`
- `terms-of-service.html`
- `terms-of-service.txt`
- `shipping-refunds-returns-policy.html`
- `shipping-refunds-returns-policy.txt`
- `mta.html`
- `01-registration-initial-full.png`
- `02-registration-tab-full.png`
- `05-registration-consent-state-full.png`

### 20.4 Boundary Observed

The review stopped before:

- checking the consent checkbox,
- submitting the signature,
- clicking the account-creation button,
- or completing account creation.

