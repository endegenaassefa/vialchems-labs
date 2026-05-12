---
url: https://biotechpeptides.com/
fetched_at: 2026-05-06T18:36:00Z
fetch_method: webfetch
http_status: 200
size_bytes: 1181484
relevant_excerpt_lines: 1-30
notes: |
  Homepage analyzed for SMS-marketing capture. Confirmed:
  - No popup/modal/banner requesting phone number for SMS marketing
  - No mentions of "text", "SMS", "Attentive", "Postscript", "Klaviyo SMS",
    "10DLC", or "msg & data rates"
  - No phone-number form fields visible on the homepage
  - No SMS provider scripts (cdn.attn.tv, postscript.io, klaviyo SMS,
    twilio, simpletexting) in the page source
  - Footer newsletter signup is exclusively email: "SUBSCRIBE TO OUR
    NEWSLETTER / Enjoy promotions and discounts."
  Bulk grep across cached HTML confirmed zero matches for SMS-platform
  hostnames and zero `<input type="tel">` fields on the home surface.
---

# Biotech Peptides — Homepage SMS-capture observation

Surface analyzed: https://biotechpeptides.com/ (root) on 2026-05-06.

## Verbatim newsletter capture (footer)

"SUBSCRIBE TO OUR NEWSLETTER

Enjoy promotions and discounts."

(Email-only signup; no phone field; no SMS-related opt-in language;
no SMS provider scripts present.)

## Negative findings (verbatim absence)

- No `<input type="tel">` element on home surface
- No `cdn.attn.tv`, `attentivemobile.com`, `postscript.io`,
  `cdn.postscript`, `tatango`, `emotive.io`, `simpletexting`, or
  `twilio.com` references in source
- No string match for "SMS", "text marketing", "by entering your
  phone", "recurring messages", "msg & data rates", or "10DLC" in
  page text
