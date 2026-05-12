---
url: https://limitlesslifenootropics.com/
fetched_at: 2026-05-06T18:36:00Z
fetch_method: webfetch+curl
http_status: 200
size_bytes: 505282
relevant_excerpt_lines: 1-30
notes: |
  Homepage analyzed. Email-only newsletter; no SMS-marketing capture
  or SMS-platform tag. Privacy policy fetched separately also contains
  zero SMS terms.
---

# Limitless Life — Homepage SMS-capture observation

## Verbatim newsletter capture (footer)

"Subscribe to our newsletter" with single "Email Address" field

(no phone field, no SMS opt-in checkbox).

## Negative findings

- No `<input type="tel">` element on home surface
- No `cdn.attn.tv`, `attentivemobile.com`, `postscript.io`,
  `cdn.postscript`, `tatango`, `emotive.io`, `simpletexting`, or
  `twilio.com` references in source
- No "SMS", "text marketing", "recurring messages", "msg & data
  rates", or "10DLC" string match in homepage text
- Privacy policy at /privacy-policy/ separately fetched: returned
  literal "No SMS or text-message terms found in privacy policy"
