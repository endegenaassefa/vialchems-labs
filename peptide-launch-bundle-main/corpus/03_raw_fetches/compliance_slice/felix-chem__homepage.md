---
url: https://felixchem.is
fetched_at: 2026-05-06T22:50Z
fetch_method: webfetch
notes: Site is GATED behind login. Public-facing homepage shows ONLY age-gate/login form. Substantive disclaimer text not visible without authentication. WordPress detected via /wp-content/. No further info reachable without account creation; respecting "no anti-bot bypass" rule.
---

# Visible Footer / Hero Compliance (Verbatim)

Only:
- "You Must Be 21 To Login"
- "By accessing our site, you confirm you are 21+ years old."

# Technical Platform Signals

- WordPress (URL paths: `/wp-content/uploads/...`)
- No Shopify, WooCommerce, Next.js, or /cdn/shop/ signals visible in pre-login markup

# Age Gate / Jurisdiction

Hard age gate at 21+ AND login wall before any product, policy, payment, COA, or compliance content is reachable.

# Pages Probed (All Returned Login Wall or 404)

- felixchem.is/about-us/ → login wall
- felixchem.is/Testing/ → login wall
- felixchem.is/contact-us/ → login wall
- felixchem.is/shop/ → login wall
- felixchem.is/products → 404
- felixchem.is/terms-of-service → 404
- felixchem.is/privacy-policy → 404
- felixchem.is/about → 404 (about-us is the canonical slug, but also gated)
