---
url: https://aminoasylum.shop/
fetched_at: 2026-05-06T18:38:00Z
fetch_method: webfetch+curl
http_status: 301_then_200
size_bytes: 3355
relevant_excerpt_lines: 1-30
notes: |
  Live aminoasylum.shop returned a 301 redirect to peptidecoupons.com
  in the WebFetch path. Direct curl to aminoasylum.shop returned a
  3.3KB stub. aminoasylum.com returned 477 bytes "Loading..." and a
  ~948-byte page in Wayback. No SMS infrastructure reachable on
  either apex; no SMS-platform tag, no `<input type="tel">`, no
  SMS-related text strings found.
---

# Amino Asylum — Homepage SMS-capture observation

## Behaviors observed

- `https://aminoasylum.shop/` → 301 → `https://peptidecoupons.com/`
  (per WebFetch redirect notice)
- Direct curl of `https://aminoasylum.shop/` returned a 3,355-byte
  stub with no provider tags
- `https://aminoasylum.com/` returned a tiny 477-byte page
  containing only "Loading..." text
- Wayback snapshots for aminoasylum.com from 2025 are 600–950 bytes
  each — also stub pages

## Negative findings

Across all reachable surfaces:

- No `<input type="tel">` form element
- No `klaviyo.com`, `cdn.attn.tv`, `attentivemobile.com`,
  `postscript.io`, `cdn.postscript`, `tatango`, `emotive.io`,
  `simpletexting`, or `twilio.com` references
- No SMS-related text strings ("SMS", "text marketing", etc.)
- The vendor presents an apex behavior consistent with anti-bot
  cloaking + fronting, plausibly to keep their actual storefront
  off public crawls. SMS posture is therefore "not observable from
  open web fetches" — no positive evidence of SMS detected.
