---
url: https://web.archive.org/web/2025/https://purerawz.co/
fetched_at: 2026-05-06T18:39:00Z
fetch_method: archive-org+curl
http_status: 200
size_bytes: 3007695
relevant_excerpt_lines: 1-30
notes: |
  Homepage analyzed via Wayback (live URL behind a Cloudflare bot
  challenge). Klaviyo onsite tag is present in source. No
  Attentive / Postscript / Twilio SMS-platform tags. The platform
  injects "customerBillingPhone" as a checkout customer-data field
  but no SMS opt-in surface or `<input type="tel">` on the home page.
---

# Pure Rawz — Homepage SMS-capture observation (Wayback)

## Provider tag detected (verbatim from source)

`klaviyo.com/onsite/js/klaviyo.js?company_id=UGUHq7&amp;ver=3.3.4`

(Klaviyo onsite tracker present. Klaviyo supports SMS as a paid
add-on; no SMS-specific form ID was observed.)

## Checkout customer-data shape (verbatim)

`"customerBillingEmail":"","customerBillingEmailHash":"","customerBillingPhone":""`

(Phone is captured at checkout for billing/shipping, but not labelled
as an SMS-marketing opt-in.)

## Negative findings

- No `cdn.attn.tv`, `attentivemobile.com`, `postscript.io`, or
  `cdn.postscript` references
- No `<input type="tel">` on the homepage surface
- No "by entering your phone", "recurring messages", "msg & data
  rates", "10DLC", or "Reply HELP" disclosure language anywhere on
  the page
