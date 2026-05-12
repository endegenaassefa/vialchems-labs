---
url: https://behemothlabz.com/
fetched_at: 2026-05-06T18:36:00Z
fetch_method: webfetch+curl
http_status: 200
size_bytes: 1181484
relevant_excerpt_lines: 1-30
notes: |
  Homepage analyzed. No SMS marketing capture or SMS-platform tag.
  Footer offers an email-only newsletter incentive ("15% Off + FREE
  Hand Strengthener"). No phone-number form field. Privacy policy
  contains zero references to SMS or text messaging (separately
  fetched: see behemothlabz__privacy_policy.md).
---

# Behemoth Labz — Homepage SMS-capture observation

## Verbatim newsletter capture (footer)

"Join & Receive 15% Off + FREE Hand Strengthener"

with email-only collection: "Your email will never be shared because
we detest spam!"

## Negative findings

- No `<input type="tel">` element on home surface
- No `cdn.attn.tv`, `attentivemobile.com`, `postscript.io`,
  `cdn.postscript`, `tatango`, `emotive.io`, `simpletexting`, or
  `twilio.com` references
- No "SMS", "text marketing", "by entering your phone", "recurring
  messages", "msg & data rates", or "10DLC" string anywhere on the
  homepage
- Checkout (separately curl-fetched, ~554KB) also produced zero SMS
  provider tags and zero `<input type="tel">` elements
