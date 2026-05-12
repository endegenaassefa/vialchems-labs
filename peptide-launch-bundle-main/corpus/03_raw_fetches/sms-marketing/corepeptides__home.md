---
url: https://corepeptides.com/
fetched_at: 2026-05-06T18:36:00Z
fetch_method: webfetch+curl
http_status: 200
size_bytes: 841570
relevant_excerpt_lines: 1-30
notes: |
  Homepage analyzed for SMS-capture surfaces.
  - No popup, modal, or banner requesting phone for SMS marketing
  - No mentions of "text", "SMS", "Attentive", "Postscript",
    "Klaviyo SMS", "10DLC", or "msg & data rates"
  - No phone-number form fields visible
  - No SMS provider scripts in source
  - Footer signup is email-only: "SUBSCRIBE TO OUR NEWSLETTER —
    ENJOY PROMOTIONS AND DISCOUNTS"
---

# Core Peptides — Homepage SMS-capture observation

## Verbatim newsletter capture (footer)

"SUBSCRIBE TO OUR NEWSLETTER — ENJOY PROMOTIONS AND DISCOUNTS"

(Email-only signup, no phone field, no SMS-related opt-in language.)

## Negative findings

- No `<input type="tel">` element on home surface
- No `cdn.attn.tv`, `attentivemobile.com`, `postscript.io`,
  `cdn.postscript`, `tatango`, `emotive.io`, `simpletexting`, or
  `twilio.com` references in source
- No string match for "by entering your phone", "recurring messages",
  "msg & data rates", "10DLC", or any TCPA opt-in disclosure language
