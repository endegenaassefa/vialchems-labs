# Clean Codex Prompt: RUO + StrateLabs Legal Disclosure Audit

## Mission

Document the legal disclosures, registration notices, checkout notices, refund terms, research-use disclaimers, and user-facing agreements shown on:

- https://ruo.bio
- https://stratelabs.is

This is a browser-assisted research audit. The goal is to record what a normal user can see during public browsing, registration, account pages, cart, and checkout, while keeping all legal acceptance and security checks under human control.

## Hard Boundaries

- Do not create accounts for the user.
- Do not click "I agree," "I accept," "Register," "Create account," "Submit," or any equivalent legal acceptance button.
- Do not sign any form or enter a signature.
- Do not solve CAPTCHA, Cloudflare checks, email verification, or other security checks.
- Do not enter payment card details.
- Do not place an order.
- Do not use scraping, bypassing, evasion, or security workaround language.
- Do not store or report passwords, cookies, session tokens, private account data, or payment data.

When one of those steps is needed, pause and ask the human to complete it in the visible browser. After the human completes the step, continue documenting the next screen.

## What To Inspect

For each site, inspect:

1. Homepage
2. Main navigation
3. Mobile navigation
4. Footer links
5. Terms of Service or equivalent legal page
6. Privacy Policy
7. Refund, return, and shipping policy
8. FAQ sections and accordions
9. Contact page
10. About page
11. Login page
12. Register page
13. Account dashboard, only after the human logs in or creates the account
14. At least two product pages
15. Search results, if search is available
16. Popups and newsletter forms
17. Cart page
18. Checkout page up to the point where payment or legal acceptance would be required

## Product Scope

Inspect at least two products per site:

- One GLP-1 or weight-loss-related product, if available
- One common peptide, research product, or representative item

Add an item to cart only if it can be done without accepting legal terms or placing an order. Stop before payment.

## What To Record

For every page:

- URL
- Page title
- Logged-out or logged-in state
- How the page was reached
- Screenshot path, if available
- Important legal wording
- Research-use or no-human-use language
- Refund or return limits
- Arbitration, indemnity, liability, or warranty language
- Qualification, age, or professional-use requirements
- Conditional text that appears after clicking menus, tabs, accordions, or product options
- Any blocked, redirected, broken, or unavailable page

For every checkbox, consent notice, registration notice, or signature area:

- Exact short wording shown near the control
- Whether it is required or optional
- Whether it is checked by default
- What action it blocks
- Whether the human had to complete the step

## Checkout Rules

In checkout, record only what appears before payment:

- Cart item used
- Cart URL
- Checkout URL
- Shipping claims
- Refund warnings
- Terms links
- Consent checkbox wording
- Payment method names visible before entering payment data
- Any verification block or human handoff point

Do not enter payment details and do not place an order.

## Output

Create one master report:

# RUO + STRATELABS LEGAL DISCLOSURE AUDIT

## 1. Executive Summary
## 2. Method and Boundaries
## 3. RUO Navigation Log
## 4. StrateLabs Navigation Log
## 5. Pages Visited
## 6. Registration Findings
## 7. Account Page Findings
## 8. Cart and Checkout Findings
## 9. Product Page Claims
## 10. Refund, Return, and Shipping Terms
## 11. Arbitration, Indemnity, Liability, and Warranty Terms
## 12. Research-Use-Only and No-Human-Use Language
## 13. Age, Qualification, and Signature Requirements
## 14. Conditional Text and Popups
## 15. Side-by-Side Comparison
## 16. Strongest Evidence
## 17. Evidence Gaps and Human-Handoff Points
## 18. Source URLs and Screenshot Index

## Success Condition

The final report should clearly show what a user is presented with and what the user is asked to agree to, without the agent accepting terms, signing forms, solving security checks, entering payment details, or placing an order.
