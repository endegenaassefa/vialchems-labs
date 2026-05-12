---
url: https://nextgencompounds.com/
fetched_at: 2026-05-08T01:28:18Z
fetch_method: curl
http_status: 200
sha256: 42921db08593ce3cd28dc3c8e1c3b6e60508ef19c028fb875821b4d51eb62f57
---
Next Gen Compounds - Homepage Source Tech Stack Analysis

Main Site: https://nextgencompounds.com
Server: Vercel (confirmed by server: Vercel header and x-vercel-id header)
CDN: Vercel Edge Network (x-vercel-cache: HIT, x-vercel-id: iad1::...)
Framework: Next.js (confirmed by _next/ static chunks, x-nextjs-prerender: 1, x-nextjs-stale-time: 300 headers)
Theme class: "theme-luxury" (body className in HTML)
Fonts: Inter (inter_945a872f), Outfit (outfit_50536036) - Google Fonts style preloading

Analytics detected:
- Facebook Pixel: Present via fbq() in JS bundle 1421gc9h82e50.js
  * Code: fbq('init', '${i.META_PIXEL_ID}'); fbq('track', 'PageView');
  * Pixel ID injected from environment variable META_PIXEL_ID (not hardcoded)
- Google Analytics / GA4: NOT detected in static JS bundles
- GTM: NOT detected
- Klaviyo: NOT detected
- TikTok Pixel: NOT detected
- Intercom: NOT detected
- Tawk: NOT detected

Checkout Backend: https://checkout.nextgencompounds.com
- Platform: WooCommerce on WordPress
- Server: nginx
- Plugins: woocommerce, woocommerce-payments, woocommerce-paypal-payments, nowpayments, mycred, jetpack, woo-coupon-usage-pro, breeze
- CSP confirms iframe relationship with main site

JS Bundles (dpl=dpl_BQVLoKMJiew3wf26pxHgypTXVFrL):
- turbopack (Next.js Turbopack bundler)
- Multiple small async chunks
- Main app bundle: 02piu_k-vlbyz.js (59,689 bytes)
- Facebook pixel bundle: 1421gc9h82e50.js (33,158 bytes)

Response Headers of Note:
- x-frame-options: DENY (main site)
- content-security-policy: frame-ancestors 'self'
- permissions-policy: camera=(), microphone=(), geolocation=()
- referrer-policy: strict-origin-when-cross-origin
- strict-transport-security: max-age=63072000

