---
url: multiple (see content)
fetched_at: 2026-05-06T18:40:00Z
fetch_method: curl+wayback
http_status: 200
size_bytes: varies
relevant_excerpt_lines: full_doc
notes: |
  Bulk SMS-provider-tag scan across additional research-peptide
  vendors beyond the anchor universe to confirm the absence pattern
  generalizes. Scan looked for: klaviyo.com, attn.tv, attentivemobile,
  postscript.io, cdn.postscript, tatango, emotive.io, simpletexting,
  twilio.com — and `<input type="tel">` form fields.
---

# Second-tier vendor SMS-provider tag bulk scan

## Vendors scanned (URL → providers detected → tel-input count)

- modernaminos.com → none → 0
- chemyo.com → none → 0
- musclegelz.com → klaviyo.com/onsite → 0
- americanresearchpeptides.com → none → 0 (5KB stub)
- parameterpeptides.com → none → 0
- prohormonelab.com → none → 0
- juvenongroup.com → none → 0
- peptidewarehouse.com → none → 0 (1.7KB stub)
- blueskypeptide.com → none → 0
- elgenpharm.com → none → 0
- proteanlabs.com → none → 0 (1.7KB stub)
- mountainpeptides.com → none → 0
- syntheticpeptides.com → none → 0
- canlabsca.com → none → 0
- transcendcompany.com → klaviyo.com/onsite → 0 (clinical-posture
  telehealth, not a research-peptide vendor)
- marekhealth.com → none → 0 (clinical-posture concierge medicine)
- canlabssarms.com → none → 0
- thatsmartchick.com → none → 0
- empowerpharmacy.com → none → 0 (FDA-registered compounder)
- tailormadecompounding.com → klaviyo.com/onsite + 1 tel-input
  (FDA-registered 503B compounder, not a research-peptide vendor)
- pioneer-peptides.com → none → 0
- olympuslabz.com → unreachable
- nubreed-nutrition.com → unreachable
- kalpapharmaceutical.us → unreachable
- elixir-laboratories.com → unreachable

## Pattern observed

Across 25+ vendor URLs scanned (anchor + second-tier + posture-
reference), zero detected an Attentive, Postscript, SimpleTexting,
or Twilio SMS provider tag. Three detected Klaviyo onsite
(PureRawz, PeptideSciences via 2024 Wayback snapshot, Musclegelz,
Transcend, Tailormade Compounding) — but Klaviyo onsite alone is
not evidence of an active SMS program; it is the dominant Shopify
email-marketing tag, and Klaviyo's SMS module requires separate
provisioning that would be subject to the prescription-drug
prohibition documented in klaviyo__sms_prohibited_content.md.

The two vendors with both Klaviyo and a tel-input (Tailormade
Compounding, Transcend) are clinical-posture brands operating
under FDA-registered facilities (503B compounder; telehealth
prescriber network respectively) and therefore can argue past the
prescription-drug rule. None of the research-chemical / RUO-posture
vendors has both signals.
