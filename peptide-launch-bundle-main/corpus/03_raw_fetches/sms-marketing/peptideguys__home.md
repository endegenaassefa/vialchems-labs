---
url: https://peptideguys.com/
fetched_at: 2026-05-06T18:38:00Z
fetch_method: webfetch+curl
http_status: 200
size_bytes: 114
relevant_excerpt_lines: 1-3
notes: |
  Domain is a stub redirect — root HTML is just a JS redirect to
  `/lander`. No live storefront on the apex was reachable. No SMS
  capture surface or SMS-platform tag possible.
---

# Peptide Guys — Homepage SMS-capture observation

## Verbatim full HTML at root

`<!DOCTYPE html><html><head><script>window.onload=function(){window.location.href="/lander"}</script></head></html>`

## Investigator notes

The apex is a 114-byte JS-redirect stub that pushes the browser to a
landing page; no SMS infrastructure is reachable on the root URL.
Treated as a documented absence: no SMS marketing technology
detected. (For acquisition-channel modeling the operator should
treat this vendor's SMS posture as "not observed" rather than
"absent" — but no positive evidence of SMS exists either.)
