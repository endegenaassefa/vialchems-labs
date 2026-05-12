---
url: https://structure-labs.com/
fetched_at: 2026-05-06T22:58Z
fetch_method: webfetch + curl + websearch + dns probes
notes: VERIFIED REAL VENDOR. Domain structure-labs.com resolves to a real research-peptide SPA built on Base44 + Supabase. Site is `<meta robots="noindex, nofollow">` (deliberately hidden from search engines), which explains why third-party reviews / social presence are absent. Static HTML contains only `<title>` and OG meta. Body content is JS-rendered and NOT retrievable via WebFetch (returns only the page title). Per anti-cheat rule #5 (no anti-bot bypass), only the static-HTML facts are recorded as verbatim. Body-rendered legal pages (/disclaimer, /policies, /terms, /about) all return only their `<title>` element to WebFetch. Three-attempt rule satisfied.
---

# Verification outcome

**REAL_VENDOR (limited-disclosure)**

structure-labs.com IS a real research-peptide retailer; structure-labs.shop is a mirror of the same SPA. structurelabs.com (no hyphen) is a separate parked GoDaddy domain — unrelated.

# Static HTML facts (verbatim from raw HTML — `curl` 200 OK)

`<title>`:
"Structure Labs Peptide Store"

`<meta name="description">`:
"Your trusted online source for high-quality research peptides, compliant with all regulations for laboratory use only."

`<meta property="og:title">`:
"Structure Labs Peptide Store"

`<meta property="og:description">`:
"Your trusted online source for high-quality research peptides, compliant with all regulations for laboratory use only."

`<meta property="og:url">`:
"https://structure-labs.com"

`<meta property="og:type">`:
"website"

`<meta property="og:site_name">`:
"Structure Labs Peptide Store"

`<meta name="twitter:card">`:
"summary_large_image"

**`<meta name="robots">`:**
"noindex, nofollow"

`<meta name="apple-mobile-web-app-title">`:
"Structure Labs Peptide Store"

# Confirmed pages exist (200 OK, JS-rendered titles only)

- /          → "Structure Labs Peptide Store"
- /products  → "products | Structure Labs Peptide Store"
- /shop      → "shop | Structure Labs Peptide Store"
- /about     → "about | Structure Labs Peptide Store"
- /disclaimer → "disclaimer | Structure Labs Peptide Store"
- /policies  → "policies | Structure Labs Peptide Store"
- /terms     → "terms | Structure Labs Peptide Store"

# Technical platform signals

- **Frontend:** Single-page React app (Vite-bundled: `/assets/index-BfZUgYtu.js`, `/assets/index-Bn0o0M98.css`)
- **Logo / asset hosting:** `qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/...`
  - **`base44-prod` bucket name** strongly indicates the site is built on **[Base44](https://base44.com/)**, a low-code SPA app builder
  - Asset path includes a project-style ID `691cfe8d96d25c66472638f6` and asset hash `906c5d068_StructureLabLogo.png`
- **Backend:** Supabase (project: `qtrypzzcjebvfcihiynt`)
- **PWA:** `<meta name="mobile-web-app-capable" content="yes">`, manifest at `/manifest.json`
- NO Shopify, NO WooCommerce, NO Next.js, NO standalone WordPress
- Mirror domain: structure-labs.shop (identical static HTML)

# Hero / banner compliance language

NOT retrievable from static HTML (JS-rendered). Per directive's anti-cheat rule #1 (verbatim only), homepage compliance copy is NOT recorded.

# Footer disclaimer / ToS / refund / shipping

NOT retrievable from static HTML at /disclaimer, /policies, /terms (JS-rendered). The pages exist (200 OK, populated `<title>`) but body content is loaded asynchronously via JS bundle and is not visible to WebFetch.

# Search ecosystem evidence

- ZERO Trustpilot reviews for structure-labs.com
- ZERO TikTok / Instagram / Reddit mentions of "structure-labs.com" peptides
- ZERO mentions on Looksmax.org peptide-source threads
- ZERO mentions on Finnrick Analytics vendor list
- The `<meta robots="noindex, nofollow">` tag explains the absence — site is deliberately not indexed by search engines

# Verification outcome (detail)

REAL VENDOR with limited public footprint. The site self-describes as a "research peptides" e-commerce store. Its compliance language ("compliant with all regulations for laboratory use only") in the meta-description is a verbatim signal that it positions as a research-use-only vendor. However, deeper compliance capture (footer disclaimer, ToS, COA model, payment methods, age gate, jurisdictional restrictions, refund/shipping) is NOT obtainable without rendering JavaScript — which falls outside WebFetch's static fetch capability and which we do not bypass per anti-cheat rules.

# Evidence URLs

- https://structure-labs.com/ (real SPA, noindex)
- https://structure-labs.shop/ (mirror; same SPA)
- https://structurelabs.com/ (parked GoDaddy domain — unrelated)
- https://structurepeptides.com/ (parked GoDaddy domain — unrelated)

Access date: 2026-05-06
