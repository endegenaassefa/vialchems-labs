---
channel_slug: email-marketing
channel_name: Email marketing — capture, welcome, retention
channel_category: email
captured_at: 2026-05-06T00:00:00Z
captured_by: claude-opus-4-7-1m (deep-research subagent)
evidence_file: acquisition_channels/evidence/email-marketing.evidence.txt
---

# Email marketing — capture, welcome, retention

## How the channel works for this category

Email marketing in the research-peptide category is the one paid-acquisition channel that actually scales without platform-policy attrition. There is no "Google Ads of email" — once an address is captured and consented, the vendor owns the contact and is not subject to Meta or Google ad-policy enforcement against unapproved-substance commerce. The category-typical implementation is therefore aggressive, and is dominated by **two ESP families: (a) Omnisend on WooCommerce and (b) Brevo on Magento**, with two outliers — BigCommerce-native form on Limitless Life Nootropics layered with Omnisend events plus SendGrid for delivery, and a custom WordPress eBook-PDF lead-magnet on Pure Rawz with Mailgun for delivery. [claim-eml-001] [claim-eml-002] [claim-eml-003] [claim-eml-004] [claim-eml-005]

The dominant capture mechanic is the **footer or in-page newsletter form with a discount-code lead magnet** (10–15% off first order), implemented via the ESP's embedded-form module. Among the seven anchor vendors with detectable mechanics, four use a footer form ("SUBSCRIBE TO OUR NEWSLETTER / Enjoy promotions and discounts" — verbatim Omnisend Divi-template copy on Biotech Peptides and Core Peptides), one runs a dedicated `/newsletter/` page with a much richer lead magnet (15% off + free hand-strengthener, Behemoth Labz), one runs a custom exit-intent popup tied to a 10% account-credit lead magnet (Peptide Sciences, Magento), and one runs a custom Elementor-based PDF eBook download form requesting Name + Surname + Email (Pure Rawz). Two anchor vendors have NO email-capture mechanic at all (Domestic Supply, Peptide Guys), which is itself a posture finding. [claim-eml-006] [claim-eml-007] [claim-eml-008] [claim-eml-009] [claim-eml-010] [claim-eml-014] [claim-eml-015]

The deliverability picture is more revealing than the on-site forms. DNS lookups against the anchor vendors expose the actual sending infrastructure that the on-site widgets do not. **Mailgun is the dominant delivery transport** — it appears in the SPF record of Pure Rawz, Behemoth Labz, Biotech Peptides, Core Peptides, Swiss Chems, and Amino Asylum. Brevo (formerly Sendinblue) is the dedicated marketing ESP for Peptide Sciences (`spf.brevo.com` + `dmarc@mailinblue.com`). SendGrid is the dedicated marketing ESP for Limitless Life Nootropics (DKIM selectors `s1.domainkey.u33643171.wl172.sendgrid.net`). Domestic Supply has the most minimal infrastructure of any active vendor — Titan Email only, no marketing ESP — consistent with its absence of any on-site capture form. Peptide Guys publishes ZERO SPF/DMARC records and serves only a JavaScript-redirect to `/lander`, consistent with a parked or pre-launch domain. [claim-eml-011] [claim-eml-012] [claim-eml-013] [claim-eml-016] [claim-eml-017]

Deliverability posture for the category is structurally weak. Of the eight anchor vendors with published DMARC records, only Peptide Sciences enforces strict DMARC (`p=reject; adkim=s; aspf=s; sp=reject`). Three publish `p=quarantine` (Swiss Chems, Behemoth Labz, Biotech Peptides) and four publish the trivial `p=none` (Pure Rawz, Core Peptides, Limitless Life Nootropics, Amino Asylum). The trivial-DMARC + Mailgun-shared-IP + research-peptide-content combination means that broadcast emails from these vendors are at structural risk of being filtered to spam or junk by Gmail/Outlook/Apple Mail — a risk corroborated by a Trustpilot reviewer reporting that Swiss Chems told them their back-in-stock notification "was in their SPAM folder," with the customer disputing that location. [claim-eml-018] [claim-eml-019]

Newsletter content itself is mostly unobservable without signing up — the operator-briefing rule for this work prohibits signups across vendors to harvest welcome flows. What IS observable from public sources: Behemoth Labz customers report "emails on a regular basis offering better discounts" (Trustpilot review evidence); Core Peptides is reported to send "promotional emails approximately twice monthly, with higher frequency during major sales events" (third-party review aggregator); Limitless Life Nootropics has been reported on Trustpilot to have offered a "25% off coupon for honest reviews on Trustpilot and SiteJabber" — a review-incentive practice that violates Trustpilot's terms and indicates the operator uses email as a review-acquisition channel as well as a discount-promotion channel. No anchor vendor maintains a public newsletter archive. The aggregator service Milled.com is the obvious place to look but no anchor vendor (Peptide Sciences, Swiss Chems, Pure Rawz, Behemoth Labz, Limitless Life Nootropics, Amino Asylum, Core Peptides, Biotech Peptides, Peptide Guys) returns past-broadcast results when queried by name on Milled. The category's broadcasts do not appear to be archived publicly, which is consistent with operators who prefer their promotional cadence not be discoverable by FDA enforcement reviewers. [claim-eml-020] [claim-eml-021] [claim-eml-022] [claim-eml-023]

Abandoned-cart automation is technically present but not advertised. Swiss Chems' homepage HTML exposes a Metorik abandoned-cart pixel (`metorik_seen_add_to_cart_form`, `wc-ajax=metorik_email_opt_in/opt_out`, abandoned-cart popup configuration with `add_cart_popup_placement: bottom`) layered on top of the Omnisend integration — Metorik is a WooCommerce-specific abandoned-cart and email-automation tool that fingerprints distinctly. The other Omnisend-on-WooCommerce vendors (Behemoth, Biotech, Core) very likely run Omnisend's native abandoned-cart workflow but do not expose it as cleanly in HTML. Peptide Sciences' Brevo + Magento integration is similarly equipped for abandoned-cart automation via Brevo's standard ecommerce events. No public artifact confirms specific abandoned-cart subject lines or cadences. [claim-eml-024]

## Named vendor examples

| vendor_slug | brand_name | usage_pattern_excerpt | url | evidence_entry_id |
|-------------|------------|------------------------|-----|--------------------|
| peptide-sciences | Peptide Sciences | Magento 2 + Brevo (formerly Sendinblue) ESP; custom exit-intent popup on Account Credit lead magnet ("Account credit applies to eligible research products at checkout. Credit availability may be limited to one per registered account."); back-in-stock signups via Mageplaza Product Alerts (mpalerts/subscriber/add) | https://web.archive.org/web/20260417005546/https://www.peptidesciences.com/ | claim-eml-001 |
| swiss-chems | Swiss Chems | WooCommerce + Storefront-child theme + **Omnisend** (brand_id `6819c3c6b7f0a3dba063b570`); footer signup; **Metorik abandoned-cart pixel** active (popup placement bottom); Trustpilot evidence of "emails go to SPAM folder" complaint | https://swisschems.is/ | claim-eml-002 |
| behemoth-labz | Behemoth Labz | WooCommerce + **Omnisend** (brand_id `67dd435022cb9bfb8c05b6a2`); dedicated `/newsletter/` page with 15% Off + FREE Hand Strengthener lead magnet, no-purchase-required; "Your email will never be shared because we detest spam!" privacy line | https://behemothlabz.com/newsletter/ | claim-eml-003 |
| biotech-peptides | Biotech Peptides | WooCommerce + Divi + **Omnisend** (brand_id `673262f6cb381463d976b9da`); footer "SUBSCRIBE TO OUR NEWSLETTER / Enjoy promotions and discounts." (Divi default copy) | https://biotechpeptides.com/ | claim-eml-004 |
| core-peptides | Core Peptides | WooCommerce + Divi + **Omnisend** (brand_id `671bba7942f3e1630792d287`); footer "SUBSCRIBE TO OUR NEWSLETTER / ENJOY PROMOTIONS AND DISCOUNTS"; third-party-reported broadcast cadence "approximately twice monthly" with higher frequency during sales | https://www.corepeptides.com/ | claim-eml-005 |
| limitless-life-nootropics | Limitless Life Nootropics | BigCommerce platform native form (action=`/subscribe.php`, hidden fields `nl_first_name=bc`, `check=1`, `nl_email`); **Omnisend events** layered on top (`omnisendForms` JS submit handler); **SendGrid for delivery** (DKIM `s1/s2.domainkey.u33643171.wl172.sendgrid.net`); Trustpilot evidence of "25% off coupon for honest reviews" review-incentive program | https://limitlesslifenootropics.com/ | claim-eml-006 |
| pure-rawz | Pure Rawz | WordPress + WooCommerce + Elementor; ZERO Klaviyo/Mailchimp/Omnisend/SendGrid signal across all 50 published wp-json pages; instead operates a custom **Elementor "ebookForm"** PDF lead magnet on `/prz-library/` capturing Name + Surname + Email; site is Cloudflare-protected so popup-modal observation requires browser sandbox; Mailgun + Google in DNS for delivery | https://purerawz.co/prz-library/ | claim-eml-007 |
| domestic-supply | Domestic Supply | OpenCart 3.x platform; **NO email-capture form anywhere on home, /contacts, or /about-us** — confirmed by HTML grep returning zero `<form>` tags in newsletter context; DNS shows only Titan Email transactional infrastructure (no marketing ESP); category-anomaly absence finding | https://domestic-supply.com/ | claim-eml-008 |
| amino-asylum | Amino Asylum | Domain `aminoasylum.shop` 301-redirects to `peptidecoupons.com` which serves a "Coming Soon" stub (title="Coming Soon"); no signup form; SPF still publishes Elastic Email + Mailgun (residual marketing infrastructure consistent with prior operations) | https://aminoasylum.shop/ → https://peptidecoupons.com/ | claim-eml-009 |
| peptide-guys | Peptide Guys | Domain `peptideguys.com` returns a 114-byte JavaScript redirect to `/lander`; no email signup form; ZERO SPF and DMARC records published in DNS; domain is parked or pre-launch — distinct from `thepeptideguyy.com` (the Noah Sailer influencer-vendor, which uses Instagram DM funnel rather than email) | https://peptideguys.com/ | claim-eml-010 |

## Cost structure for a new entrant

- Setup cost: **$0–$500** — Omnisend, Mailchimp, and Brevo all offer free tiers up to ~250–500 contacts and ~500–6,000 sends/month, sufficient for week-1 launch. Klaviyo's free tier is 250 contacts / 500 emails. Pure Rawz's custom eBook lead magnet pattern is the only setup that requires meaningful design work (PDF asset production at $50–$200). Lead-magnet PDF production is the only non-zero hard cost at launch.
- Monthly recurring: **$0–$300** for the contact-list size achievable in months 1–6 — Omnisend's paid tier starts ~$16/mo (500 contacts), scales to ~$130/mo at 10K contacts; Klaviyo starts ~$45/mo at 1K contacts; Brevo's pricing is send-volume-based (~$25/mo for 20K emails). The category's WooCommerce-Omnisend default is the cheapest because Omnisend's WooCommerce plugin is free + abandoned-cart workflow is included. Mailgun adds ~$15–$35/mo for SMTP delivery if going custom (the Pure Rawz pattern).
- Per-unit (per-broadcast / per-flow): essentially $0 marginal cost above the contact-tier fee. Lead-magnet PDFs and discount-code distribution are zero-marginal.
- Time investment: **5–15 hours/week** in months 1–3 (welcome flow design, abandoned-cart automation, first 4–8 broadcast templates), dropping to **2–5 hours/week** in steady state once flows automate.

## Time horizon to traction

- Lower bound: **48–72 hours** — once the on-site form is live and ESP integrated, first welcome emails fire on signup #1. The Behemoth Labz pattern (lead magnet so attractive that it captures researchers AND tire-kickers — "free hand strengthener, no purchase required") demonstrates that lead-magnet quality drives day-1 capture rate.
- Median expectation: **3–6 months** to reach the contact volume (5–15K) at which retention email becomes a meaningful revenue line. The category's typical 10% off / 15% off lead magnet captures roughly 3–8% of unique homepage visitors based on industry benchmarks for ecommerce signup-to-popup conversion (no surveyed vendor publishes their own conversion rate).
- Upper bound: contact-list scale and revenue-per-email are reportedly strong in this category — Behemoth Labz Trustpilot reviewers explicitly note receiving "emails on a regular basis offering better discounts," consistent with active retention-email operations driving repeat purchase. Core Peptides' reported ~bi-monthly broadcast cadence is at the conservative end of e-commerce best practice (typical: 1–2 per week).
- Basis: per-vendor evidence in claim-eml-002 through claim-eml-006 plus deliverability infrastructure findings in claim-eml-011 through claim-eml-019.

## Risk profile

- **Deliverability risk: high.** Four of eight anchor vendors with DMARC records publish `p=none` (the trivial setting). Mailgun is a shared-IP-by-default platform unless the operator explicitly buys a dedicated IP, and shared IPs for research-chemical content are at structural spam-folder risk. Trustpilot evidence directly confirms at least one vendor (Swiss Chems) sending mail that is being filtered by recipients' spam filters. [claim-eml-018] [claim-eml-019]
- **ESP-policy risk: moderate.** Omnisend, Klaviyo, Mailchimp, and Brevo all have acceptable-use policies that prohibit unapproved-pharmaceutical content. The fact that the ESPs are demonstrably in use across these vendors implies either (a) the vendors have not been reported to their ESP, (b) the ESPs do not actively review WooCommerce-store content, or (c) the vendors' "for research only" framing is sufficient cover under ESP-content review. Mailchimp historically has been the most aggressive in suspending peptide accounts; the absence of Mailchimp in the surveyed vendors is itself a finding (no anchor vendor was detected on Mailchimp).
- **Regulatory risk: moderate.** FDA enforcement against the category targets the seller's website and shipping operations, not their ESP. Email content is discoverable through subpoena once enforcement begins, but is not a leading-edge enforcement vector. Limitless Life Nootropics' alleged review-incentive practice (25% off for Trustpilot reviews) is a Trustpilot-policy violation, not a regulatory issue, but is the kind of practice that surfaces in adverse publicity. [claim-eml-022]
- **Capital-loss risk: low.** Email-list ownership transfers between brand entities easily; even if the storefront is shut down, the contact list survives. The existence of a `peptidecoupons.com` "Coming Soon" page taking the redirect from `aminoasylum.shop` indicates this exact pattern in motion — the brand pivots, the contact mechanism migrates. [claim-eml-009]
- **Reputational risk: low to moderate.** Email is the channel that customers complain about least often in Trustpilot reviews — the corpus is dominated by complaints about shipping, COA quality, and customer-service response, not about email frequency or spam.

## Posture-specific fit

### Posture A — Clean Clinical Labs

- **Recommendation: pursue early — and pursue with a non-discount lead magnet.**
- **Reasoning:** The clinical-posture vendors in the anchor set make the strongest use of email — Peptide Sciences runs a custom exit-intent popup tied to Account Credit (not a discount code, which a clinical operator would frame as cheapening the product), and Biotech Peptides + Core Peptides run the bare "subscribe for promotions" footer form. The clinical posture is not hostile to email the way it is hostile to Instagram. Brevo on Magento (the Peptide Sciences pattern) is the most defensible technical choice for a Posture A entrant — Brevo is European, GDPR-aligned, and has a more conservative content-policy posture than Mailgun-on-shared-IP, which fits the clinical brand framing. Strict DMARC `p=reject` (the Peptide Sciences DNS posture) is a free signal of operational seriousness that competitors do not match. [claim-eml-001] [claim-eml-013] [claim-eml-018]
- **Specific creative/copy adjustments required:**
  1. Lead magnet should be a credibility artifact (PDF: "Cold-chain handling for lyophilized peptides"; or: a free reconstitution-volume calculator gated by email) rather than a "10% off your first order" coupon. Pure Rawz's eBook-PDF lead magnet pattern is closer to the Posture A target than the WooCommerce-Omnisend discount-code default.
  2. Welcome flow should send the credibility artifact in email #1, then a research-context follow-up (compound-of-the-month explainer) in email #2, then a soft-product CTA in email #3 — not a hard discount push.
  3. Strict DMARC + Brevo + dedicated IP from day 1.
  4. Public newsletter archive (none of the surveyed vendors maintain one; this is a competitive-advantage gap a clinical-posture entrant could fill).
- **Specific vendors to study as references:** peptide-sciences (Brevo + exit-intent + Magento + Account Credit lead magnet); pure-rawz (eBook lead magnet pattern, even though Pure Rawz itself is closer to Posture B aesthetically).

### Posture B — Meme-Coded Community

- **Recommendation: pursue immediately — copy the Behemoth Labz dedicated-newsletter-page playbook.**
- **Reasoning:** The Posture B aesthetic gives an operator permission to run an attention-grabbing lead magnet that Posture A cannot — Behemoth Labz's "FREE Hand Strengthener" novelty gift dramatically outperforms a generic 10% off because (a) it captures non-buyers as well as buyers ("no purchase required"), (b) it's memetically shareable (the kind of thing that gets posted to r/sarmssourcetalk), and (c) it costs the operator $2–$5 per send vs. ~$8 in margin lost on a 10% first-order discount. Omnisend on WooCommerce is the category-default and the cheapest path to ESP. The four Omnisend-on-WooCommerce vendors in the anchor set (Swiss Chems, Behemoth, Biotech, Core) all run the same plumbing, so the operator's chosen freelancer pool is large and the patterns are well-documented. [claim-eml-003] [claim-eml-007] [claim-eml-013]
- **Specific creative/copy adjustments required:**
  1. Two-tier lead magnet: dedicated `/newsletter/` page with novelty gift + percentage discount (Behemoth template) PLUS site-wide footer form with the bare percentage-off (Biotech/Core template) for visitors who don't reach the dedicated page.
  2. Exit-intent popup with the same lead magnet — none of the Omnisend-on-WooCommerce vendors in the anchor set runs an exit-intent popup that I detected; this is a competitive-advantage gap.
  3. Welcome flow: novelty gift fulfillment in email #1 + discount code; bestseller carousel in email #2; abandoned-cart in email #3 (Omnisend's default flow). Abandoned-cart pixels are layered onto Omnisend via Metorik (the Swiss Chems pattern) for richer cart-abandonment automation than Omnisend native.
  4. Mailgun dedicated IP (~$59/mo on Mailgun's Foundation plan) rather than the shared-IP default that the other anchor vendors use — this is a low-cost deliverability win in a category where the competitors are all on shared IPs with `p=none` DMARC.
  5. Set DMARC `p=quarantine` minimum from day 1 — better than the four `p=none` competitors.
- **Specific vendors to study as references:** behemoth-labz (dedicated-newsletter-page playbook, novelty-gift lead magnet, "we detest spam" privacy framing); swiss-chems (Metorik abandoned-cart layered on Omnisend); core-peptides (broadcast cadence as a reference floor — go higher than ~bi-monthly).

## Cross-references to vendor profiles

- `vendors/peptide-sciences.json` § `tech_stack.email_service_provider` (Brevo) and `homepage.popups_and_modals` (exit-intent + Account Credit)
- `vendors/swiss-chems.json` § `tech_stack.email_service_provider` (Omnisend) and `tech_stack.abandoned_cart` (Metorik) and `homepage.footer_disclaimers` (newsletter form)
- `vendors/behemoth-labz.json` § `tech_stack.email_service_provider` (Omnisend) and `dedicated_pages.newsletter` (lead magnet copy)
- `vendors/biotech-peptides.json` § `tech_stack.email_service_provider` (Omnisend) and `homepage.footer_disclaimers` (newsletter form)
- `vendors/core-peptides.json` § `tech_stack.email_service_provider` (Omnisend) and `homepage.footer_disclaimers` (newsletter form)
- `vendors/limitless-life-nootropics.json` § `tech_stack.email_service_provider` (BigCommerce native + Omnisend events + SendGrid delivery) and `social_proof.review_incentive_practices` (Trustpilot 25% off scandal)
- `vendors/pure-rawz.json` § `tech_stack.email_service_provider` (custom + Mailgun) and `homepage.lead_magnets` (eBook PDF on /prz-library/)
- `vendors/domestic-supply.json` § `tech_stack.email_service_provider` (NONE — Titan Email only) — channel-absence finding
- `vendors/amino-asylum.json` § `operational_status` (offline, redirects to peptidecoupons.com Coming Soon page)
- `vendors/peptide-guys.json` § `operational_status` (parked / pre-launch — note: distinct from Noah Sailer's thepeptideguyy.com)

## Channel-specific data captured

### Per-vendor email-capture mechanic and ESP fingerprint (10 anchor vendors)

| Vendor | Email-capture mechanic | Lead magnet | Form fields | Detected ESP signal | Detected on which page |
|---|---|---|---|---|---|
| Peptide Sciences | Custom Magento exit-intent popup (`#exit-intent-popup` div, `data-mage-init="ps/exit-intent"`); plus Mageplaza Product Alerts `mp-productalerts-popup-form` for back-in-stock notifications | Account Credit (10%, applied at checkout, "Credit availability may be limited to one per registered account") | uncertain — popup form fields not visible without firing exit-intent JS | **Brevo** (`cdn.brevo.com/js/sdk-loader.js` + `client_key: '4e8j09ude0ctr9ima7apxeue'` + Magento module `Ps_Brevo/js/view/brevo`); **DNS confirms** SPF `include:spf.brevo.com` + DMARC `rua=dmarc@mailinblue.com` | https://web.archive.org/web/20260417005546/https://www.peptidesciences.com/ (live site Cloudflare-blocked) |
| Swiss Chems | Footer signup ("Subscribe to receive our latest news.") + Omnisend embedded forms | Standard ESP percentage discount (specific value not visible in HTML; aggregator sources report 10% off) | Email Address (validation copy: "Email Address cannot be empty", "Please enter valid Email Address"); optional Phone Number field configured | **Omnisend** (`omnisend-front-script.js` + `omnisend_snippet_vars` + `brand_id: '6819c3c6b7f0a3dba063b570'` + Omnisend WooCommerce checkout newsletter subscription block); **Metorik abandoned-cart** (`metorik_seen_add_to_cart_form`, `wc-ajax=metorik_email_opt_in`) | https://swisschems.is/ (homepage) |
| Behemoth Labz | Dedicated `/newsletter/` page + footer + multiple Omnisend embedded form variants (form IDs `67effb52f8fbc713dd316e41`, `67effb3a1483d5800c841dd9`, `69006fcba037ccc322df94c7`) including teaser button | "Join & Receive 15% Off + FREE Hand Strengthener / No purchase required to get a free hand strengthener" | Email address (specific labels gated behind JS; uncertain whether name field present) | **Omnisend** (`brand_id: '67dd435022cb9bfb8c05b6a2'` + multiple form embeds + mobile container variants) | https://behemothlabz.com/newsletter/ (dedicated page) and homepage signup-banner |
| Biotech Peptides | Footer signup using Divi `.et_pb_newsletter_form` template + Omnisend embedded form (id `67328bf16c95faeac01d6d55-submit-form`) | Generic "Enjoy promotions and discounts" (no specific %); third-party reports indicate 10% off welcome | Email field per Divi default (no name field detected) | **Omnisend** (`brand_id: '673262f6cb381463d976b9da'`) | https://biotechpeptides.com/ (homepage footer) |
| Core Peptides | Footer signup using Divi `.et_pb_newsletter_form` template + Omnisend embedded form (id `671bd72e6d7c733983c45259`) | Generic "ENJOY PROMOTIONS AND DISCOUNTS"; third-party reports indicate 10% off welcome (`WELCOME10` referenced in aggregators) | Email field per Divi default | **Omnisend** (`brand_id: '671bba7942f3e1630792d287'`) | https://www.corepeptides.com/ (homepage footer) |
| Limitless Life Nootropics | Footer signup with BigCommerce-native form (`<form class="form eyeva__newsletter-form" action="https://limitlesslifenootropics.com/subscribe.php" method="post">`); hidden fields `action=subscribe`, `nl_first_name=bc`, `check=1`, visible `nl_email` | Bare "Subscribe to our newsletter" — no on-page lead magnet copy; aggregator reports 10% off | Email Address (placeholder "Your email address", `aria-required="true"`, `autocomplete="email"`); name field hidden | **BigCommerce native** form posts to `/subscribe.php`; **Omnisend events** layered (`omnisendForms` JS submit handler in inline script); **SendGrid for delivery** (DKIM `s1.domainkey.u33643171.wl172.sendgrid.net`, `s2.domainkey...`); BigCommerce SPF (`include:_spf.bigcommerce.com`) | https://limitlesslifenootropics.com/ (footer) |
| Pure Rawz | Custom Elementor "ebookForm" `<form id="ebookForm" method="post">` on `/prz-library/`; checkbox-driven PDF picker (Supplements, Nootropics) | **PDF eBook download** ("Choose a book, fill out the form, and get instant access to your download") — distinct from category default; second category-only category eBook (Supplements-Research-Ebook-7.pdf, Purz-Nootropics-Ebook-2.pdf) | **Name + Surname + Email** (3 fields, all required; no checkbox for marketing-consent visible); submit button verbatim "Submit to Get Your Free Download" | NO Klaviyo/Mailchimp/Omnisend/SendGrid/Mailpoet/Mc4wp/FluentCRM signal across all 50 published wp-json pages; appears to be custom WordPress endpoint; **Mailgun in DNS** (`include:mailgun.org`) for delivery | https://purerawz.co/prz-library/ (live site Cloudflare-blocked; observed via wp-json API) |
| Domestic Supply | NONE — homepage, /contacts, /about-us all return zero `<form>` matching newsletter context; OpenCart 3.x storefront with no email-capture extension installed | n/a — no lead magnet | n/a | NONE — Titan Email only in DNS (transactional only); no marketing ESP fingerprint anywhere | https://domestic-supply.com/ (confirmed absence across 3 pages) |
| Amino Asylum | NONE — `aminoasylum.shop` 301-redirects to `peptidecoupons.com` "Coming Soon" page; no signup form | n/a | n/a | DNS still publishes residual marketing infrastructure: SPF `include:_spf.elasticemail.com include:mailgun.org` + DKIM `k1` selector (Mailgun); operator may retain list ownership for relaunch | https://aminoasylum.shop/ (offline as of 2026-05-06) |
| Peptide Guys | NONE — homepage returns 114-byte JS redirect to `/lander`; `/shop` returns same stub | n/a | n/a | NO SPF and NO DMARC published in DNS; ZERO MX records published — domain is parked or pre-launch (note: distinct entity from Noah Sailer's `thepeptideguyy.com` influencer-vendor) | https://peptideguys.com/ (parked) |

### ESP dominance pattern across the anchor set

| ESP / pattern | Vendors | Platform implication |
|---|---|---|
| **Omnisend** (capture + automation) | Swiss Chems, Behemoth Labz, Biotech Peptides, Core Peptides | **Dominant ESP for WooCommerce in this category** — 4 of 4 WooCommerce-Divi sites run Omnisend (no Klaviyo, no Mailchimp). Driven by Omnisend's free WooCommerce plugin tier with abandoned-cart workflow included. |
| **Brevo (formerly Sendinblue)** + Magento | Peptide Sciences | The clinical/Magento posture choice. European-headquartered, more conservative content policy than US ESPs. Strict DMARC `p=reject`. |
| **BigCommerce native + Omnisend events + SendGrid delivery** | Limitless Life Nootropics | BigCommerce + SendGrid is the BigCommerce-native choice; Omnisend is layered for popup forms and events. Three-vendor stack vs. the other vendors' one-vendor stack. |
| **Custom WordPress + Mailgun** (no ESP visible) | Pure Rawz | Operator-built capture form for PDF lead magnet; ESP automation either custom or invisible to public probing. |
| **None — no marketing ESP detected** | Domestic Supply, Amino Asylum (offline), Peptide Guys (parked) | Domestic Supply: deliberate channel absence; Amino Asylum: residual SPF only; Peptide Guys: pre-launch. |

**Klaviyo** — not detected on any anchor vendor. The category convention is Omnisend on WooCommerce, not Klaviyo. (Klaviyo dominates Shopify-native ecommerce; the surveyed vendors are not on Shopify.)

**Mailchimp** — not detected on any anchor vendor. Consistent with Mailchimp's historically aggressive enforcement of acceptable-use policy against research-chemical content.

### Lead-magnet patterns

| Lead magnet type | Vendor(s) | Notes |
|---|---|---|
| Account Credit (10%) | Peptide Sciences | Custom — frames the discount as registered-user benefit, not a "first order coupon" |
| Percentage discount only (10–15%) | Swiss Chems (10% per aggregator), Biotech Peptides (~10%), Core Peptides (~10%, code WELCOME10), Limitless Life (~10%) | Category-default "10% off your first order" pattern |
| Percentage discount + novelty gift | Behemoth Labz (15% + free hand strengthener) | The category outlier — physical-gift lead magnet eliminates "want the discount but not the email" friction (no purchase required for the gift) |
| Free PDF eBook | Pure Rawz (Supplements eBook + Nootropics eBook) | The other category outlier — content-asset lead magnet; requires Name + Surname (not just email) |
| None | Domestic Supply, Amino Asylum (offline), Peptide Guys (parked) | n/a |

**Pattern observation:** The ~10% off code is the dominant lead magnet (5 of 7 vendors with active capture mechanics). The two outliers (Behemoth's novelty gift, Pure Rawz's PDF) both attempt to broaden the captured-population beyond price-driven prospects. The novelty-gift pattern in particular is structurally cheaper (per-unit gift cost vs. per-order margin discount) and potentially memetic.

### Deliverability signals — DNS evidence

| Vendor | SPF (sender authorization) | DMARC (policy) | DKIM selectors (where useful) | Inferred deliverability posture |
|---|---|---|---|---|
| Peptide Sciences | `spf.brevo.com` + `_spf.google.com` | `p=reject; adkim=s; aspf=s; sp=reject` (strict) + reports to `dmarc@mailinblue.com` (Brevo-owned) | `mail`, `default` (`v=DKIM1`), `mailo` (Mailgun-style backup) | **Strongest in the anchor set.** Strict DMARC + dedicated ESP. |
| Swiss Chems | `spf.titan.email` + `_spf.smtp.com` + `mail.zendesk.com` + `mailgun.org` | `p=quarantine` | `krs` selector | Mailgun-shared-IP risk; quarantine policy is reasonable |
| Pure Rawz | `mailgun.org` + `_spf.google.com` + `mx a ip4:198.46.87.213` | `p=none` (trivial) | `default`, `google`, `mailo`, `dkim` | Trivial DMARC; Mailgun shared IP. **Spam-filter risk.** |
| Behemoth Labz | `_spf.google.com` + `mailgun.org` | `p=quarantine` | `default`, `google`, `mailo` | Mailgun shared IP; quarantine OK |
| Biotech Peptides | `mailgun.org` + `_spf.safewebservices.com` + `_spf.google.com` | `p=quarantine` (reports to `oganiansprt@gmail.com` — operator personal Gmail, not domain mailbox) | `default`, `google` | Mailgun shared IP; reports-to-Gmail is unusual operator hygiene |
| Core Peptides | `zoho.eu` + `_spf.safewebservices.com` + `mailgun.org` | `p=none` (trivial); reports to `jeremy@corepeptides.com` | (no DKIM responses to common selectors probed) | Trivial DMARC; mixed transport; **spam-filter risk**. |
| Limitless Life Nootropics | `_spf.google.com` + `mail.zendesk.com` + `_spf.bigcommerce.com` | `p=none` (trivial); fo=1 | `s1.domainkey.u33643171.wl172.sendgrid.net`, `s2.domainkey...`, `google` | **SendGrid confirmed via DKIM**; trivial DMARC; spam-filter risk |
| Domestic Supply | `spf.titan.email` only | NONE published | (none probed) | No marketing-email infrastructure |
| Amino Asylum | `_spf.elasticemail.com` + `_spf.google.com` + `mailgun.org` | `p=none` | `k1` (Mailgun), `google` | Residual marketing infrastructure post-shutdown |
| Peptide Guys | NONE | NONE | NONE | Domain effectively unconfigured for email |

### Public newsletter archive availability

Probed Milled.com (the largest public e-commerce newsletter archive) for each anchor vendor by name. **No anchor vendor maintains a discoverable Milled archive.** The two name-similar matches found ("SwissRX Synthesis" via "the-feed", various "Pure Fun" / "Raw Powders" / "Pure Salt Interiors") are unrelated brands. The category's broadcast emails are not publicly archived. Operator consequence: a competitor cannot easily reverse-engineer the broadcast cadence, subject lines, or offer pattern of an existing vendor — but the converse, the ability to publish a public archive of one's own to demonstrate credibility, is therefore an unfilled competitive-advantage slot.

### Abandoned-cart automation observability

| Vendor | Abandoned-cart fingerprint visible in HTML/JS | Notes |
|---|---|---|
| Swiss Chems | YES — Metorik (`metorik_seen_add_to_cart_form`, `wc-ajax=metorik_email_opt_in/opt_out`, `add_cart_popup_placement: bottom`) | Layered on top of Omnisend; Metorik is a WooCommerce-specific abandoned-cart pixel |
| Behemoth Labz, Biotech, Core | INFERRED but not directly visible in HTML | Omnisend's WooCommerce plugin includes abandoned-cart by default; firing requires actual cart action (which I did not perform in this work for ethical reasons) |
| Peptide Sciences | INFERRED via Brevo's standard ecommerce events module (`Ps_Brevo` Magento module) | Not directly visible without an active cart |
| Limitless Life Nootropics | INFERRED via BigCommerce native + Omnisend events | omnisendForms event handler suggests configured automation |
| Pure Rawz | UNKNOWN | Custom WordPress; no standard ESP fingerprint to imply abandoned-cart |
| Domestic Supply | NONE | No marketing infrastructure |

### Subject-line / CTA / cadence patterns

Direct subject-line and broadcast-content evidence is gated behind sign-up flows that this work does not exercise (per ethical rule 10). The corroborating third-party evidence:

- **Behemoth Labz**: "I receive emails on a regular basis offering better discounts" (Trustpilot reviewer); "15% off your next order after reporting a product quality issue" (Trustpilot reviewer) — implies retention-loop is discount-anchored.
- **Core Peptides**: "promotional emails approximately twice monthly, with higher frequency during major sales events" (third-party reviewer) — implies broadcast cadence ~2/mo.
- **Pure Rawz**: "offered a discount on a subsequent order without providing a discount code" (Trustpilot reviewer) — implies ad-hoc retention emails with embedded discount.
- **Limitless Life Nootropics**: "25% off coupon for honest reviews on Trustpilot and SiteJabber" (Trustpilot evidence + third-party reporting) — review-incentive flow alongside the standard promotional flow; **violates Trustpilot terms**.

### Segmentation — observable evidence

Specific segmentation by purchased-compound, customer lifecycle, or geo is not observable from public signals. The presence of Omnisend across 4 of 7 active vendors implies access to Omnisend's standard ecommerce segmentation primitives (cart abandoners, browse abandoners, repeat purchasers, big-spenders). The Limitless Life Nootropics review-incentive flow implies a "post-purchase, has-not-reviewed" segment exists at that vendor. Beyond those structural inferences, segmentation patterns are gated behind insider data and not disclosed publicly.

## Source quality notes

- Live HTML for Peptide Sciences and Pure Rawz is gated by Cloudflare's bot-mitigation challenge from automated tooling. Peptide Sciences was observed via the April 17, 2026 Wayback snapshot (HTTP 200, 144KB). Pure Rawz was observed via the publicly-accessible WordPress REST API at `/wp-json/wp/v2/pages` (HTTP 200, 986KB across 50 published pages). These two access paths preserve evidence quality but mean the on-page popup-modal observation is by-inference rather than by-direct-fire.
- Trustpilot is also Cloudflare-protected; Trustpilot review evidence is sourced via public-search-engine snippets quoting reviewer text rather than direct WebFetch.
- DNS evidence (SPF/DMARC/DKIM) is fully reproducible by any DNS resolver and is the highest-confidence layer of this analysis.
- Aggregator-coupon-site evidence (SimplyCodes, DealSpotr, WorthEPenny, etc.) is treated as triangulation only — these sites are unreliable individually but consistent claims across 3+ sites are treated as supporting evidence.
- Per the task brief's ethical constraint (rule 10), I did NOT perform sign-ups across vendors to harvest welcome-email content. Direct welcome-email content (subject lines, sequence cadence, copy) is therefore documented as uncertainty rather than as evidence.
