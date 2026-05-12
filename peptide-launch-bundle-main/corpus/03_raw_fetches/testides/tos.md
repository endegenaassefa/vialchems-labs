---
url: https://testides.com/terms-of-service
fetched_at: 2026-05-07T02:30:55Z
fetch_method: curl
http_status: 200
sha256: 8e82197d5508a25a84a4e493869ebdcb0343d9c925b6f623c25f893f308f0361
---
=== /terms-of-service response (HTML SHELL ONLY) ===
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/favicon.png" />
  <title>Testides - Client Portal</title>
  <script type="module" crossorigin src="/assets/index-C7iQRKk4.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-CyJShvBe.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>

=== ANALYSIS ===
This route returns the React SPA shell (same as /, 502 bytes empty <div id=root>).
TOS body is rendered client-side by React Router resolving the /terms-of-service route.
The actual TOS body content lives in the JS bundle and/or is fetched dynamically when the
user authenticates (Service Agreement is at /api/client/service-agreement/download which
requires a valid session — returns 401 to unauthenticated requests).

The grep-able TOS-related strings in the JS bundle (homepage.md):
370:"I have read and accepted the terms and conditions as outlined in the"
782:"Service Agreement"
840:"Terms of Service"
853:"Testides-Service-Agreement-Signed.pdf"
3128:"/terms-of-service"

The TOS body itself is NOT retrievable without account creation, which §11 forbids.
