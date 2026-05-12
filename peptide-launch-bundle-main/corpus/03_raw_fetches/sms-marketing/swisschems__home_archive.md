---
url: https://web.archive.org/web/2025/https://swisschems.is/
fetched_at: 2026-05-06T18:39:00Z
fetch_method: archive-org+curl
http_status: 200
size_bytes: 394580
relevant_excerpt_lines: 1-30
notes: |
  Live URL behind Cloudflare bot challenge; Wayback snapshot used.
  No Klaviyo, Attentive, Postscript, or SimpleTexting tag. Single
  `tel:` link in source is a phone-call link ("tel:Call"), not a
  form input — no SMS-marketing capture surface present.
---

# Swiss Chems — Homepage SMS-capture observation (Wayback)

## Tel-link found (verbatim)

`tel:Call`

(This is a tel-protocol click-to-call link, NOT a phone-number form
input. Used to dial customer support, not capture phone numbers for
marketing.)

## Negative findings

- No `<input type="tel">` form element on the homepage
- No `klaviyo.com`, `cdn.attn.tv`, `attentivemobile.com`,
  `postscript.io`, `cdn.postscript`, `tatango`, `emotive.io`,
  `simpletexting`, or `twilio.com` references in source
- No "SMS", "text marketing", "recurring messages", "msg & data
  rates", or "10DLC" anywhere in page text
- Privacy policy archive separately fetched (~306KB); only `phone`
  hits were the standard WooCommerce/Elementor `phone_field` form
  configuration, not SMS marketing language
