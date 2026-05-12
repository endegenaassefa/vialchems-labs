---
channel_slug: sms-marketing
channel_name: SMS Marketing
channel_category: email
captured_at: 2026-05-06T19:00:00Z
captured_by: deep-research-subagent (Opus 4.7 1M)
evidence_file: acquisition_channels/evidence/sms-marketing.evidence.txt
---

# SMS Marketing

## How the channel works for this category

SMS marketing in US e-commerce is a closed system: the merchant
contracts with an SMS marketing platform (Attentive, Postscript,
Klaviyo SMS, SimpleTexting, RingCentral, Twilio direct, or a
similar A2P provider), the platform either resells short-code
inventory or provisions 10DLC long-code campaigns through The
Campaign Registry (TCR), and every campaign passes through a
brand-vetting + content-review gate enforced by both the platform
and the carrier coalition (T-Mobile, AT&T, Verizon). The carrier-
coalition rules are codified in the CTIA Short Code Monitoring
Handbook v1.9 (Jan 2024) and re-articulated downstream in every
provider's prohibited-content article. The two clauses that bind
the research-peptide vertical are CTIA §3.5.1 — "Endorsement of
illegal drugs or controlled substances" and "Reference to the
abuse of controlled substances is prohibited" (see
sms-marketing.carrier_policy.ctia.handbook_unlawful_content) — and
the parallel provider-level rules that translate the CTIA rule
into a registration filter, of which the cleanest formulation is
HighLevel's "Offers for drugs that cannot be sold over the counter
in the U.S./Canada are forbidden" (see
sms-marketing.platform_policy.highlevel.prescription_drug_rule).

For a research-peptide vendor, the operative legal/contractual
trap is that BPC-157, TB-500, MK-677, semaglutide, retatrutide,
tesofensine, and the rest of the catalog are NOT FDA-approved OTC
products under DSHEA AND NOT FDA-approved prescription drugs for
the indications vendors imply. They sit inside a third category —
"research chemicals, research use only" — that is recognized by
no carrier filter or SMS platform vetting workflow. Klaviyo's
prohibited-content article lists "Prescription medication that
cannot legally be sold over-the-counter" as an Illegal/Restricted
Substance (see
sms-marketing.platform_policy.klaviyo.prescription_clause), and
RingCentral goes broader still, banning the entire category of
"Pharmaceutical, vitamin, or other drug advertisements" (see
sms-marketing.platform_policy.ringcentral.pharmaceutical_ban).
The 10DLC brand-vetting reviewer at TCR will read the storefront,
not the disclaimer, and will reject the campaign — that's why the
vertical-specific peptide marketing agency at peptidemarketing.com
sells four services, of which SMS is conspicuously not one (see
sms-marketing.industry_signal.peptidemarketing_agency_no_sms).

The TCPA layer compounds the carrier-platform layer. Postscript
publishes the verbatim damages exposure: "Violations of the TCPA
can lead to damages of $500-$1,500 per message, while violations
of CTIA guidelines can lead to being prevented from using the
wireless carrier networks" (see
sms-marketing.platform_policy.postscript.tcpa_penalty_exposure).
TCPA is a private-right-of-action statute; class actions over
non-consented marketing texts are prolific (TCPA filings spiked
283% in September 2025 per published litigation trackers), and a
research-peptide brand running a list collected without the exact
prescribed opt-in language is a class-action plaintiff magnet
because the underlying product invites scrutiny.

This combination — carrier filtering, platform-policy rejection
at provisioning, TCPA private-right-of-action exposure on top —
is why SMS adoption in the research-peptide vertical is not just
low but essentially absent on the public web. Across the 10
named anchor vendors plus 15+ second-tier and posture-reference
peptide brands actually scanned, exactly zero had an Attentive,
Postscript, SimpleTexting, or Twilio-direct tag in source, zero
displayed a TCPA-compliant opt-in disclosure on a popup or
checkout, and zero showed a phone-number opt-in form labelled
for marketing rather than transactional/order purposes. Two
vendors disclosed SMS in privacy-policy language — Biotech
Peptides and Core Peptides — but neither runs an active capture
surface, so the policy clauses appear to reserve a future option
rather than describe a live program.

## Named vendor examples

The dominant finding is widespread absence. The table documents
the per-vendor capture surface (or lack thereof), the SMS-platform
provider tag detected (or absence), the privacy-policy opt-in
language (verbatim where present), and the location/channel where
the SMS posture is observable.

| vendor_slug | brand_name | usage_pattern_excerpt | url | evidence_entry_id |
|-------------|------------|------------------------|-----|--------------------|
| biotech-peptides | Biotech Peptides | "Users may receive promotional advertisements via SMS messaging if they opt-in on our website." (privacy policy only — no live capture surface, no SMS-platform tag, no tel-input on home or checkout) | https://biotechpeptides.com/privacy-policy/ | sms-marketing.vendor_table.biotechpeptides.privacy_clause |
| core-peptides | Core Peptides | "You may opt-in for marketing communications on our website. These include emails and SMS messaging, which you can opt-out of at any time. ... Standard message and data rates may apply." (privacy policy only — no Attentive/Postscript/Klaviyo SMS form on site) | https://corepeptides.com/privacy-policy/ | sms-marketing.vendor_table.corepeptides.privacy_clause |
| pure-rawz | Pure Rawz | Klaviyo onsite tag (`klaviyo.com/onsite/js/klaviyo.js?company_id=UGUHq7`) present — Klaviyo can do SMS but is configured here for email; checkout collects phone for shipping only; privacy policy expressly forbids non-order use of phone numbers | https://web.archive.org/web/2025/https://purerawz.co/ | sms-marketing.vendor_table.purerawz.klaviyo_present_no_sms |
| behemoth-labz | Behemoth Labz | Email-only newsletter "Join & Receive 15% Off + FREE Hand Strengthener"; privacy policy contains zero references to SMS, text messaging, or any TCPA disclosure language; no provider tag on home or checkout | https://behemothlabz.com/ | sms-marketing.vendor_table.behemothlabz.email_only_signup |
| limitless-life-nootropics | Limitless Life Nootropics | Email-only "Subscribe to our newsletter" with single Email Address field; privacy policy contains zero SMS terms; no provider tag in source | https://limitlesslifenootropics.com/ | sms-marketing.vendor_table.limitlesslifenootropics.email_only_signup |
| swiss-chems | Swiss Chems | Single `tel:Call` click-to-call link (NOT a form input); no Klaviyo / Attentive / Postscript / Twilio / SimpleTexting tag; no SMS marketing language in source | https://web.archive.org/web/2025/https://swisschems.is/ | sms-marketing.vendor_table.swisschems.tel_link_only |
| peptide-sciences | Peptide Sciences | Klaviyo onsite tag (`klaviyo.com/onsite/js/klaviyo.js?company_id=XY6ahM`) present — configured for email; no Attentive/Postscript/SimpleTexting tag; no `<input type="tel">` opt-in surface | https://web.archive.org/web/20240301151733/https://www.peptidesciences.com/ | sms-marketing.vendor_table.peptidesciences.klaviyo_present_no_sms |
| peptide-guys | Peptide Guys | Apex is a 114-byte JS-redirect stub to /lander; no live storefront on the apex; no SMS infrastructure observable | https://peptideguys.com/ | sms-marketing.vendor_table.peptideguys.parked_redirect |
| amino-asylum | Amino Asylum | aminoasylum.shop 301-redirects to peptidecoupons.com per WebFetch; aminoasylum.com returns "Loading..." stub; no SMS-platform tag observable on either apex | https://aminoasylum.shop/ | sms-marketing.vendor_table.aminoasylum.unreachable_apex |
| domestic-supply | Domestic Supply | domesticsupply.net is a 10KB Sedo-style aggregator template (not the live storefront, which operates principally through invite/forum-DM channels); no SMS-platform tag observable | https://www.domesticsupply.net/ | sms-marketing.vendor_table.domesticsupply.parked_aggregator |

Per-vendor detail (per the directive's request for a specific
column shape):

| vendor | SMS capture mechanic | SMS provider detected | opt-in language verbatim | location (popup / cart / checkout) |
|--------|----------------------|------------------------|---------------------------|------------------------------------|
| Biotech Peptides | None on live surfaces; privacy policy reserves SMS option | None detected | "Users may receive promotional advertisements via SMS messaging if they opt-in on our website." | Privacy policy only — no live capture |
| Core Peptides | None on live surfaces; privacy policy reserves SMS option | None detected | "You may opt-in for marketing communications on our website. These include emails and SMS messaging" | Privacy policy only — no live capture |
| Pure Rawz | Phone field at checkout (transactional only) | Klaviyo onsite (email config; SMS module not provisioned-as-observed) | (none — privacy policy forbids non-order use) | Checkout (transactional, not SMS opt-in) |
| Behemoth Labz | None | None detected | (no SMS terms in privacy policy at all) | n/a — absence |
| Limitless Life Nootropics | None | None detected | (no SMS terms in privacy policy) | n/a — absence |
| Swiss Chems | `tel:Call` click-to-call link (no form) | None detected | (none) | n/a — absence |
| Peptide Sciences | None | Klaviyo onsite (email config) | (no SMS opt-in language detected on home surface) | n/a — absence |
| Peptide Guys | None — apex is JS-redirect stub | None detected | (none) | n/a — apex unreachable |
| Amino Asylum | None — apex 301-redirects / cloaks | None detected | (none) | n/a — apex unreachable |
| Domestic Supply | None — apex is parked aggregator | None detected | (none) | n/a — apex unreachable / off-web |

## Verbatim policy excerpts from major SMS platforms on prohibited verticals

### Attentive (verbatim, content policy)

"To stay in compliance with carrier guidelines and the law, users
of the Attentive SMS- and MMS-specific services must follow
certain rules with respect to messaging content, in addition to
the content prohibited across all products and services above.
Attentive will not provide its service to any client that violates
the below content prohibitions." Then under Illegal Content:
"Endorsement of illegal or illicit drugs, including cannabis and
CBD (including hemp seed oil and hemp powder)." (See evidence
entries `sms-marketing.platform_policy.attentive.shaft_verbatim`
and `sms-marketing.platform_policy.attentive.illegal_content`.)

### Postscript (verbatim, compliance overview)

"While SHAFT content has been heavily regulated in SMS marketing
for years, the CTIA tightened its rules surrounding this content
in May 2021. As a result, Postscript can no longer service brands
that offer or communicate about sex, hate, firearms, tobacco
(CBD--included) products." Postscript additionally publishes the
TCPA penalty exposure verbatim: "Violations of the TCPA can lead
to damages of $500-$1,500 per message, while violations of CTIA
guidelines can lead to being prevented from using the wireless
carrier networks." (See evidence entries
`sms-marketing.platform_policy.postscript.shaft_carveout` and
`sms-marketing.platform_policy.postscript.tcpa_penalty_exposure`.)

### Klaviyo (verbatim, SMS/MMS prohibited content article)

"Prescription medication that cannot legally be sold over-the-
counter" is enumerated as an Illegal/Restricted Substance.
Klaviyo also publishes a behavioral catch-all that captures any
list with elevated dissatisfaction: "Even if your use case is not
listed here, you may receive a carrier violation error if you
previously experienced high opt-out rates (more than 2%)." (See
evidence entries
`sms-marketing.platform_policy.klaviyo.prescription_clause` and
`sms-marketing.platform_policy.klaviyo.opt_out_rate_catchall`.)

### RingCentral (verbatim, SMS/MMS content policies — most explicit)

The single broadest provider-level prohibition encountered:
"Pharmaceutical, vitamin, or other drug advertisements" is
listed as a prohibited campaign category. Combined with:
"Companies that promote, sell, or otherwise reference substances
defined as controlled substances under federal law, regardless
of legality, including marijuana (cannabis)." (See evidence
entries `sms-marketing.platform_policy.ringcentral.pharmaceutical_ban`
and `sms-marketing.platform_policy.ringcentral.controlled_substance_ban`.)

### SimpleTexting (verbatim, prohibited-content article)

"Note that you're prohibited from sending messages about the
abuse of controlled substances." (See evidence entry
`sms-marketing.platform_policy.simpletexting.controlled_abuse_ban`.)

### HighLevel / 10DLC re-articulation (verbatim)

"Offers for drugs that cannot be sold over the counter in the
U.S./Canada are forbidden." Listed under Illegal Substances
alongside "Prescription drugs", "Cannabis (United States)", and
"CBD (United States)". (See evidence entry
`sms-marketing.platform_policy.highlevel.prescription_drug_rule`.)

## 10DLC carrier registration friction reality for this category

The CTIA Short Code Monitoring Handbook v1.9 (the carrier-coalition
binding document) §3.2 lists "Advertising of controlled substances"
as a wireless-provider onboarding requirement that falls outside the
generic Guidelines — i.e., subject to per-carrier extra review (see
`sms-marketing.carrier_policy.ctia.handbook_advertising_rule`). §3.5
prescribes that "Messaging content must: ... Be age-gated
appropriately for controlled substances and adult content" (see
`sms-marketing.carrier_policy.ctia.handbook_age_gate_rule`). §3.5.1
is the operative gate: "Programs ... should not promote unlawful or
illicit content. Such content may include, but is not limited to,
the following: ... Endorsement of illegal drugs or controlled
substances. ... Reference to the abuse of controlled substances is
prohibited." (See `sms-marketing.carrier_policy.ctia.handbook_unlawful_content`.)

How this translates to actual 10DLC registration outcomes for a
research-peptide vendor: at TCR brand-vetting, the website URL is
inspected by the campaign reviewer, the product catalog is read,
and the campaign is rejected with a code in the 30469 / 30897
family ("Disallowed: Illegal substances/articles" and
"Campaign vetting rejection — Disallowed Content" respectively per
Twilio's published error reference). The downstream consequence is
that even a vendor who buys campaign access at one provider and
gets pushed onto carrier networks faces a fine schedule of ~$1,000
per illegal-content message and ~$2,000 per phishing/social
engineering message under T-Mobile's published 2024 fine schedule,
escalating to network-wide blocking.

The behavioral evidence corroborates this in two directions:
(a) zero anchor vendor and zero second-tier vendor scanned
(25+ URLs total) carries an Attentive / Postscript / SimpleTexting
/ Twilio direct tag in source — the channel is not in production
use; (b) the vertical-specific marketing agency that explicitly
serves "peptides & research chemicals" brands (peptidemarketing.com)
publishes four services (Paid Advertising, E-mail Marketing, SEO,
Web Development), and SMS is not one of them — see
`sms-marketing.industry_signal.peptidemarketing_agency_no_sms`.
The agencies that work this vertical have priced the channel out
of their offering because it doesn't survive provisioning.

## TCPA exposure summary

The Telephone Consumer Protection Act, 47 U.S.C. § 227, governs
all autodialed marketing SMS to US recipients. The operative rules:

- Requires "prior express written consent" for autodialed marketing
  texts (FCC clarified in 2024 that marketing text messages are
  subject to do-not-call regulations as well; see Postscript's
  compliance overview verbatim).
- Burden of proof for consent rests with the sender ("federal law
  dictates that it is the burden of the person sending the messages
  to prove that the consumer provided express written consent" —
  Postscript verbatim).
- Statutory damages: $500 per non-willful violation, up to $1,500
  per willful violation, per message — verbatim from Postscript's
  policy disclosure.
- Private right of action — every recipient is a potential
  plaintiff; class actions in this vertical are particularly
  attractive to the plaintiffs' bar because the underlying product
  invites regulatory scrutiny that helps the merits.

The practical effect: even if a research-peptide vendor could
clear the platform/carrier provisioning gate (and per the
evidence above they cannot), the TCPA private-right-of-action
exposure on a non-perfectly-collected list would be ~$500-$1,500
multiplied by every single message sent. A 5,000-subscriber list
sending two messages a week for a year is 520,000 messages of
exposure, or $260M-$780M of statutory damages in worst case.

## The (likely) finding: how few vendors run SMS in this category and why

Across the 10 anchor vendors and 15+ second-tier / posture-reference
vendors actually scanned (25+ URLs total — see
`sms-marketing.bulk_scan.absence_pattern_25_vendors`):

- Zero displayed an Attentive, Postscript, SimpleTexting, or
  Twilio-direct tag in source.
- Zero displayed a TCPA-compliant opt-in disclosure on a popup or
  checkout.
- Zero displayed a phone-number form field labelled for SMS
  marketing (vs transactional/order purposes).
- Five displayed a Klaviyo onsite tag (Pure Rawz, Peptide Sciences,
  Musclegelz, Transcend, Tailormade Compounding) — but Klaviyo
  onsite alone is the dominant Shopify email-marketing tag and
  not evidence of an active SMS program. Three of those five
  (Pure Rawz, Peptide Sciences, Musclegelz) are research-peptide
  vendors with no SMS-specific form observed; the other two
  (Transcend, Tailormade Compounding) are clinical-posture brands
  operating under FDA-registered facilities with a different
  legal posture entirely.
- Two anchor vendors (Biotech Peptides, Core Peptides) reserved
  the contractual right to do SMS in their privacy policy but
  did not run an active capture surface as observed.

Compared to email, which is near-universal in the vertical (every
anchor vendor surveyed has an email newsletter signup in the
footer at minimum), SMS adoption is best characterized as
documented absence. The drivers, ranked by contribution:

1. **SMS-platform vetting at provisioning.** RingCentral
   ("Pharmaceutical, vitamin, or other drug advertisements"),
   Klaviyo ("Prescription medication that cannot legally be sold
   over-the-counter"), and HighLevel ("Offers for drugs that
   cannot be sold over the counter in the U.S./Canada are
   forbidden") will refuse to provision the campaign. Attentive,
   Postscript, and SimpleTexting will reach the same outcome
   through the broader "illegal content" / "abuse of controlled
   substances" / "endorsement of illegal drugs" clauses. The
   "research use only" disclaimer on the storefront does not
   rescue the vetting analysis because the reviewer reads the
   whole storefront, not just the disclaimer (and FDA itself has
   now repeatedly rejected RUO as a defense — see April 7 2026
   warning-letter cohort against seven peptide vendors marketing
   GLP-1 copycats as "research use only", per the
   policycanary.io / Health Law Alliance summary).

2. **Carrier filtering at the TCR brand-vetting and campaign-
   approval gate.** CTIA Handbook v1.9 §3.5.1's "Endorsement of
   illegal drugs or controlled substances" rule binds T-Mobile,
   AT&T, and Verizon, and is enforced via TCR's brand-vetting
   workflow. Even a merchant who could find a more permissive
   SMS aggregator would still face campaign-level rejection at
   the carrier coalition layer.

3. **TCPA private-right-of-action exposure.** $500-$1,500 per
   message on a non-perfectly-collected list, with the burden of
   proving consent on the merchant. The plaintiffs' bar is
   actively trolling for class actions in 2025/2026 (TCPA filings
   spiked 283% in September 2025 per ActiveProspect / TCPAWorld
   trackers). A throwaway brand without serious counsel is a
   particularly attractive target because the underlying product
   illegitimacy makes a quick settlement likely.

4. **Operational friction even if all of the above could be
   solved.** Postscript publishes the cart-recovery rule
   verbatim ("All automations related to abandoned shopping carts
   and abandoned checkouts should: Be limited to only one
   message. Send the message within 48 hours of the trigger
   event."), the quiet-hours rule (8 am - 9 pm in recipient's
   local time, tighter in 5 named states + Oklahoma 3-message
   daily cap), and the affirmative-consent prescription. A new
   throwaway brand cannot meaningfully outperform email's
   conversion economics through SMS once these constraints are
   applied.

The headline finding for the operator: SMS marketing is a
documented absence in the research-peptide vertical, not a
neglect or oversight. The few vendors that mention SMS in privacy-
policy language (Biotech Peptides, Core Peptides) appear to be
reserving a contractual right rather than running an active
program. A throwaway brand entering this vertical should treat
SMS as effectively unavailable.

## Cost structure for a new entrant

- Setup cost: $0–$500 (an SMS provider onboarding fee is nominal,
  but the vendor will be rejected at brand vetting before the
  campaign is approved, so the realistic cost-to-launch is
  uncertain because the channel is not provisionable)
- Monthly recurring: theoretically $50–$500/mo platform fee +
  $0.0075–$0.015 per outbound SMS in the US, but realistically
  uncertain because provisioning is the binding constraint
- Per-unit (CPM): n/a in the conventional sense — SMS is per-
  message, not impression
- TCPA litigation exposure: $500–$1,500 per message of statutory
  damages on a non-consented list (Postscript verbatim — see
  evidence)
- Time investment: weeks to attempt provisioning; uncertain
  payoff because of the provisioning gate

## Time horizon to traction

- Lower bound: never (channel does not provision under research-
  peptide product positioning at any major SMS platform surveyed)
- Median expectation: never
- Upper bound: theoretically achievable for a brand that
  reorganizes to a clinical-posture / FDA-registered facility
  operator (the Transcend / Tailormade Compounding pattern), but
  this is outside the throwaway-brand framework
- Basis: zero anchor or second-tier research-peptide vendor in
  the 25+ URL scan was observed running an active SMS program;
  vertical-specific peptide marketing agency does not offer SMS
  as a service

## Risk profile

- Platform-policy risk (account ban, post takedown): **critical**.
  RingCentral's "Pharmaceutical, vitamin, or other drug
  advertisements" ban, Klaviyo's "Prescription medication that
  cannot legally be sold over-the-counter" rule, Attentive's
  "Endorsement of illegal or illicit drugs" clause, and
  Postscript's broader CTIA-derived "abuse of controlled
  substances" enforcement will all reject provisioning of a
  research-peptide brand. (Evidence:
  `sms-marketing.platform_policy.ringcentral.pharmaceutical_ban`,
  `sms-marketing.platform_policy.klaviyo.prescription_clause`,
  `sms-marketing.platform_policy.attentive.illegal_content`,
  `sms-marketing.platform_policy.simpletexting.controlled_abuse_ban`.)

- Regulatory risk (FDA / FTC / state AG attention): **critical**.
  The April 7 2026 FDA warning-letter cohort (seven peptide
  vendors, GLP-1 copycats marketed as "research use only") shows
  that the RUO label is no longer a defense, and a brand that
  goes louder on the channel (which is what SMS optimization
  pressures the marketer to do) increases the surface area of
  attack proportionally.

- Reputational risk (community blowback, doxxing): **moderate**.
  Forum communities that source-list peptide vendors generally
  view SMS marketing as cringe / "supplement bro" branding, and
  several anchor vendors actively position against this kind of
  outreach in their marketing copy ("Your email will never be
  shared because we detest spam!" — Behemoth Labz). A brand that
  starts texting subscribers risks losing source-list standing.

- Capital-loss risk (sunk cost with no return): **high**. Any
  capital allocated to platform fees, onboarding, or list-
  building before the inevitable provisioning rejection is sunk;
  TCPA litigation exposure on a list collected before rejection
  could vastly exceed the trial budget.

## Posture-specific fit

### Posture A — Clean Clinical Labs

- **Recommendation:** avoid
- **Reasoning:** Even a clinical-posture brand can only get past
  SMS provider vetting if it's an actual FDA-registered facility
  (compounder, telehealth prescriber network, etc.). A
  throwaway-brand "clean clinical labs" wrapper around the same
  research-chemical catalog will be filtered identically to any
  other peptide vendor. The two clinical-posture brands in the
  scan that did show both Klaviyo and a tel-input (Transcend,
  Tailormade Compounding) are full FDA-registered operators, not
  posture-only.
- **Specific creative/copy adjustments required:** none —
  channel is not provisionable for a throwaway brand.
- **Specific vendors to study as references:** Transcend and
  Tailormade Compounding only as instructive examples of how
  much organizational machinery is required to clear the
  vetting gate (FDA-registered 503B compounder; nationwide
  telehealth prescriber network respectively); not actually
  copyable as a low-capital throwaway pattern.

### Posture B — Meme-Coded Community

- **Recommendation:** avoid
- **Reasoning:** The meme-coded community posture leans even
  harder on the language patterns that trip carrier filters
  (drug names, dosing language, transformation claims), and
  source-list communities actively penalize brands that text
  customers. The provisioning rejection would be more cleanly
  triggered, and the reputational backfire among source-list
  audiences would be more severe.
- **Specific creative/copy adjustments required:** none — channel
  is not provisionable.
- **Specific vendors to study as references:** none —
  documented absence pattern.

## Cross-references to vendor profiles

For every vendor named in the "Named vendor examples" table, the
SMS observation cross-references the vendor profile JSON section
`tech_stack.marketing_pixels_present` and `content_footprint`:

- `vendors/biotech-peptides.json` § `policies.privacy_clauses` and
  `tech_stack.marketing_pixels_present`
- `vendors/core-peptides.json` § `policies.privacy_clauses` and
  `tech_stack.marketing_pixels_present`
- `vendors/pure-rawz.json` § `tech_stack.marketing_pixels_present`
  (Klaviyo onsite confirmed) and `policies.privacy_clauses`
- `vendors/behemoth-labz.json` § `policies.privacy_clauses`
  (silent on SMS) and `tech_stack.marketing_pixels_present`
- `vendors/limitless-life-nootropics.json` §
  `policies.privacy_clauses` (silent) and
  `tech_stack.marketing_pixels_present`
- `vendors/swiss-chems.json` § `tech_stack.marketing_pixels_present`
- `vendors/peptide-sciences.json` § `tech_stack.marketing_pixels_present`
  (Klaviyo onsite confirmed via Wayback)
- `vendors/peptide-guys.json` § `apex_status` (parked redirect)
- `vendors/amino-asylum.json` § `apex_status` (cloaked / 301
  redirected)
- `vendors/domestic-supply.json` § `apex_status` (parked aggregator;
  primary distribution is invitation/forum-DM channels)

## Channel-specific data captured

- **SMS provider tags scanned for in source:** `klaviyo.com`,
  `cdn.attn.tv`, `attentivemobile.com`, `postscript.io`,
  `cdn.postscript`, `tatango`, `emotive.io`, `simpletexting`,
  `twilio.com` — full list scanned across 25+ vendor URLs
  including all 10 anchors plus 15+ second-tier and posture-
  reference brands. Detection rate: 5 vendors with Klaviyo
  onsite (email config), 0 vendors with Attentive / Postscript /
  SimpleTexting / Twilio direct tags.

- **Form-field signals scanned for:** `<input type="tel">`,
  `name="phone"`, `name="billing_phone"`, `name="shipping_phone"`,
  `name="sms_consent"`, `name="mobile"`. Detection across the
  anchor universe: zero on home pages, zero on checkout pages
  positioned as marketing opt-in (Pure Rawz / Swiss Chems
  embedded the WooCommerce `phone_field` for transactional
  shipping data only; their privacy policies explicitly limit
  use to order fulfillment).

- **TCPA opt-in disclosure phrases scanned for:** "by entering
  your phone", "recurring messages", "msg & data rates", "msg
  frequency varies", "Reply HELP for help", "Reply STOP to
  opt-out", "10DLC", "consent is not a condition of purchase".
  Detection: zero on any anchor vendor's home page.

- **Privacy-policy SMS clauses captured (verbatim):** Biotech
  Peptides (full disclosure including STOP keyword and originator
  consent carve-out); Core Peptides (single short paragraph
  reserving the option). Eight other anchor vendors: silent on
  SMS in privacy policy.

- **SMS-platform vendor policy excerpts captured (verbatim):**
  Attentive Content Policy (full), Postscript Compliance Overview
  (full), Klaviyo SMS/MMS Prohibited Content (full), RingCentral
  SMS/MMS Content Policies (relevant excerpts), SimpleTexting
  Prohibited Content article (relevant excerpts), HighLevel
  Forbidden Categories (relevant excerpts).

- **Carrier-coalition guidance captured (verbatim):** CTIA Short
  Code Monitoring Handbook v1.9 (Jan 2024) §3.2, §3.5, §3.5.1.

- **Industry-corroboration signal:** vertical-specific peptide
  marketing agency at peptidemarketing.com publishes four
  services and SMS is not on the menu — strong indirect
  confirmation that the channel is not productively
  provisionable for the vertical.

## Uncertainty notes

- **Cost structure beyond the provisioning gate is uncertain
  because the gate binds the analysis.** A vendor who somehow
  cleared provisioning would face $50–500/mo platform fees and
  $0.0075–$0.015 per outbound message, but no anchor vendor in
  the universe was observed actually doing this so the
  downstream cost economics are theoretical.

- **Pure Rawz and Peptide Sciences are observed running Klaviyo
  onsite (email) but NOT observed running Klaviyo SMS
  specifically.** The Klaviyo onsite JS tag does not by itself
  prove SMS provisioning; it's a strong base signal but not a
  positive identification. The vendors might be running SMS as
  a future-reserved option (consistent with their privacy
  policies) but no positive evidence of an active SMS program
  was found in source.

- **Amino Asylum, Peptide Guys, and Domestic Supply have
  unreachable / cloaked / parked apex behavior.** Their actual
  storefronts may have different infrastructure than the public
  apex; the SMS posture is documented as "not observable from
  open web fetches" rather than "absent."

- **"Research use only" defense status is in active flux.** The
  April 7 2026 FDA warning-letter cohort against seven peptide
  vendors who used the RUO framing is the most recent
  inflection; the regulatory and SMS-platform-policy responses
  to this cohort are still developing and could become more
  restrictive (in which case the documented-absence finding
  hardens further), not less.

- **No vendor in the universe was observed running a
  cryptocurrency-only / .onion-only checkout, which would
  potentially place them outside US carrier-coalition reach for
  SMS.** That theoretical posture was not observed and is
  outside the scope of this channel research. (Several vendors
  do accept crypto on a US-fronted clearnet site.)
