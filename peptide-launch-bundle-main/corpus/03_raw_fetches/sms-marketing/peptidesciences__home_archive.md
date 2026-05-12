---
url: https://web.archive.org/web/20240301151733/https://www.peptidesciences.com/
fetched_at: 2026-05-06T18:43:00Z
fetch_method: archive-org+curl
http_status: 200
size_bytes: 1214191
relevant_excerpt_lines: 1-30
notes: |
  Live URL returns Cloudflare 403 to non-browser clients. March 2024
  Wayback snapshot was usable. Klaviyo onsite tracker is present;
  no Attentive / Postscript / SimpleTexting tag; no SMS-capture form
  element; no SMS opt-in language anywhere on the page.
---

# Peptide Sciences — Homepage SMS-capture observation (Wayback Mar 2024)

## Provider tag detected (verbatim from source)

`klaviyo.com/onsite/js/klaviyo.js?company_id=XY6ahM`

(Klaviyo onsite present. Klaviyo offers SMS as a paid module; no
SMS-specific form was observed.)

## Customer-data shape

`KlaviyoCustomerData` block present, no SMS opt-in attributes.

## Negative findings

- No `<input type="tel">` form element on home surface
- No `cdn.attn.tv`, `attentivemobile.com`, `postscript.io`,
  `cdn.postscript`, `tatango`, `emotive.io`, `simpletexting`, or
  `twilio.com` references in source
- No "SMS"/"text marketing"/"by entering your phone"/"recurring
  messages"/"msg & data rates"/"10DLC" string matches in homepage text
- The only `phone` references in the page are content-marketing prose
  ("phone call and asking for the address", "phone number of the
  laboratory facility") — not opt-in capture surfaces
