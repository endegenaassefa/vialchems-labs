import http from "node:http";

const port = Number(
  process.env.WOO_MOCK_CHECKOUT_PORT ?? process.env.PORT ?? 3002,
);
const defaultMainSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  process.env.SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3001";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function parsePreviewItems(url) {
  const items = url.searchParams
    .getAll("preview_item")
    .map((item) => {
      const [sku, rawQty] = item.split(":");
      const qty = parsePositiveInt(rawQty, 1);
      if (!sku || qty < 1) return null;
      return { sku, qty };
    })
    .filter(Boolean);

  return items.length > 0 ? items : [{ sku: "LOCAL-PREVIEW", qty: 1 }];
}

function safeReturnUrl(value) {
  if (!value) return `${defaultMainSiteUrl}/order-confirmed`;

  try {
    const url = new URL(value);
    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "vialchemlabs.net"
    ) {
      return url.toString().replace(/\/+$/, "");
    }
  } catch {
    return `${defaultMainSiteUrl}/order-confirmed`;
  }

  return `${defaultMainSiteUrl}/order-confirmed`;
}

function completeUrl(returnUrl, orderId) {
  const url = new URL(returnUrl);
  url.searchParams.set("order", orderId);
  return url.toString();
}

function checkoutPage(url, orderId) {
  const returnUrl = safeReturnUrl(url.searchParams.get("return_url"));
  const mainSiteUrl = returnUrl.replace(/\/order-confirmed$/, "");
  const items = parsePreviewItems(url);
  const totalCents = parsePositiveInt(
    url.searchParams.get("preview_total_cents"),
    6900,
  );
  const shippingCents = parsePositiveInt(
    url.searchParams.get("preview_shipping_cents"),
    1500,
  );
  const subtotalCents = Math.max(totalCents - shippingCents, 0);
  const action = `/checkout/order-pay/${encodeURIComponent(orderId)}/complete?return_url=${encodeURIComponent(returnUrl)}`;

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td>
            <strong>Research Supply Order - SKU ${escapeHtml(item.sku)}</strong>
            <span>Quantity ${escapeHtml(item.qty)}</span>
          </td>
          <td class="right">Included</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Secure checkout - vialchem.labs</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0a0e14;
      --bg-elevated: #11161e;
      --bg-sunken: #060a0f;
      --fg: #f0f1ee;
      --fg-muted: #8b95a1;
      --fg-subtle: #5a6470;
      --line: #1f2630;
      --line-strong: #2c3540;
      --accent: #0f3a5f;
      --accent-hi: #06b6d4;
      --accent-soft: #0a2535;
      --accent-fg: #fff;
      --r-sm: 4px;
      --r-md: 6px;
      --r-lg: 10px;
      --r-pill: 999px;
      --font-sans: ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
      --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(6, 182, 212, 0.12), transparent 34rem),
        var(--bg);
      color: var(--fg);
      font-family: var(--font-sans);
    }
    a { color: inherit; text-decoration: none; }
    .skip { position: absolute; left: -999px; top: 8px; z-index: 20; padding: 8px 12px; background: var(--accent-hi); color: #061014; border-radius: var(--r-sm); }
    .skip:focus { left: 8px; }
    .container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
    .nav { position: sticky; top: 0; z-index: 10; border-bottom: 1px solid var(--line); background: color-mix(in oklab, var(--bg) 92%, transparent); backdrop-filter: blur(16px); }
    .nav-inner { height: 68px; display: flex; align-items: center; gap: 24px; }
    .brand { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em; text-transform: lowercase; white-space: nowrap; }
    .brand-mark { width: 9px; height: 9px; border-radius: 50%; background: var(--accent-hi); box-shadow: 0 0 18px rgba(6, 182, 212, 0.8); }
    .muted { color: var(--fg-muted); }
    .nav-links { display: flex; gap: 22px; color: var(--fg-muted); font-size: 13px; }
    .nav-links a:hover { color: var(--fg); }
    .spacer { flex: 1; }
    .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 0 16px; border-radius: var(--r-lg); border: 1px solid var(--line-strong); font-size: 14px; font-weight: 600; cursor: pointer; }
    .btn-accent { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }
    .hero { border-bottom: 1px solid var(--line); padding: 56px 0 42px; }
    .eyebrow { margin: 0 0 14px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent-hi); }
    h1 { margin: 0 0 14px; font-size: clamp(34px, 4vw, 54px); line-height: 1.03; font-weight: 300; letter-spacing: 0; }
    .hero p { margin: 0; max-width: 680px; color: var(--fg-muted); line-height: 1.6; }
    .shell { padding: 40px 0 72px; }
    .checkout-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 24px; align-items: start; }
    .card { background: var(--bg-elevated); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 24px; box-shadow: 0 24px 48px -28px rgba(0, 0, 0, 0.75); }
    h2 { margin: 0 0 18px; font-size: 18px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; }
    td { border-top: 1px solid var(--line); padding: 16px 0; vertical-align: top; color: var(--fg); font-size: 14px; }
    td span { display: block; margin-top: 5px; color: var(--fg-muted); font-size: 12px; }
    .right { text-align: right; color: var(--fg-muted); }
    .totals td { padding: 10px 0; color: var(--fg-muted); }
    .totals tr:last-child td { padding-top: 16px; color: var(--fg); font-size: 18px; font-weight: 700; }
    .payment-grid { display: grid; gap: 10px; }
    .payment { display: flex; justify-content: space-between; gap: 12px; padding: 14px; border: 1px solid var(--line); border-radius: var(--r-md); background: var(--bg-sunken); }
    .payment strong { font-size: 14px; }
    .payment span { color: var(--fg-muted); font-size: 12px; }
    .pill { height: 24px; padding: 0 8px; border-radius: var(--r-pill); border: 1px solid var(--line-strong); color: var(--accent-hi); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; display: inline-flex; align-items: center; white-space: nowrap; }
    .attestation { display: flex; gap: 12px; align-items: flex-start; margin: 18px 0; padding: 14px; border: 1px solid color-mix(in oklab, var(--accent-hi) 35%, var(--line)); border-radius: var(--r-md); background: var(--accent-soft); color: var(--fg-muted); font-size: 13px; line-height: 1.45; }
    input[type="checkbox"] { width: 18px; height: 18px; margin-top: 1px; accent-color: var(--accent-hi); }
    .complete { width: 100%; height: 48px; margin-top: 6px; font-size: 15px; }
    footer { border-top: 1px solid var(--line); padding: 56px 0 28px; background: var(--bg-sunken); }
    .foot-grid { display: grid; grid-template-columns: 2fr repeat(4, 1fr); gap: 40px; }
    .foot-col p, .foot-col a { color: var(--fg-muted); font-size: 13px; line-height: 1.7; }
    .foot-col h5 { margin: 0 0 12px; font-size: 11px; font-family: var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg); }
    .foot-col ul { list-style: none; margin: 0; padding: 0; }
    .badge { width: max-content; padding: 7px 10px; border: 1px solid var(--accent-hi); border-radius: var(--r-pill); color: var(--accent-hi); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
    .foot-base { margin-top: 46px; padding-top: 20px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 16px; color: var(--fg-subtle); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.04em; }
    @media (max-width: 820px) {
      .nav-links { display: none; }
      .checkout-grid { grid-template-columns: 1fr; }
      .foot-grid { grid-template-columns: 1fr 1fr; }
      .foot-base { flex-direction: column; }
    }
  </style>
</head>
<body>
  <a class="skip" href="#main">Skip to main content</a>
  <nav class="nav" aria-label="Site navigation">
    <div class="container nav-inner">
      <a class="brand" href="${escapeHtml(mainSiteUrl)}/" aria-label="vialchem.labs home"><span class="brand-mark" aria-hidden="true"></span><span>vialchem<span class="muted">.labs</span></span></a>
      <div class="nav-links"><a href="${escapeHtml(mainSiteUrl)}/shop">Shop Peptides</a><a href="${escapeHtml(mainSiteUrl)}/coa">Verify a Vial</a><a href="${escapeHtml(mainSiteUrl)}/affiliate">Affiliate Program</a><a href="${escapeHtml(mainSiteUrl)}/account">My Lab</a></div>
      <div class="spacer"></div>
      <a class="btn" href="${escapeHtml(mainSiteUrl)}/cart">Back to cart</a>
    </div>
  </nav>
  <main id="main">
    <section class="hero"><div class="container"><p class="eyebrow">shop.vialchemlabs.net · secure checkout</p><h1>Complete your order</h1><p>This is the local WooCommerce checkout preview. The production flow uses the same order-pay handoff on the checkout subdomain.</p></div></section>
    <section class="shell">
      <div class="container checkout-grid">
        <div class="card">
          <h2>Order ${escapeHtml(orderId)}</h2>
          <table aria-label="Order line items"><tbody>${itemRows}</tbody></table>
          <form method="post" action="${escapeHtml(action)}">
            <label class="attestation"><input type="checkbox" required><span>I confirm these products are for qualified laboratory research use only and are not for human or animal use.</span></label>
            <button class="btn btn-accent complete" type="submit">Complete secure checkout</button>
          </form>
        </div>
        <aside class="card">
          <h2>Order summary</h2>
          <table class="totals" aria-label="Order totals"><tbody><tr><td>Subtotal</td><td class="right">${escapeHtml(formatMoney(subtotalCents))}</td></tr><tr><td>Shipping</td><td class="right">${escapeHtml(formatMoney(shippingCents))}</td></tr><tr><td>Total</td><td class="right">${escapeHtml(formatMoney(totalCents))}</td></tr></tbody></table>
          <h2 style="margin-top:28px">Payment</h2>
          <div class="payment-grid">
            <div class="payment"><div><strong>Link Money</strong><span>Pay by bank</span></div><span class="pill">Bank</span></div>
            <div class="payment"><div><strong>Bitcoin</strong><span>BTCPay invoice</span></div><span class="pill">Crypto</span></div>
            <div class="payment"><div><strong>Cards</strong><span>Credit and debit cards</span></div><span class="pill">Card</span></div>
            <div class="payment"><div><strong>PayPal</strong><span>Available when enabled</span></div><span class="pill">PayPal</span></div>
          </div>
        </aside>
      </div>
    </section>
  </main>
  <footer>
    <div class="container">
      <div class="foot-grid">
        <div class="foot-col"><a class="brand" href="${escapeHtml(mainSiteUrl)}/"><span class="brand-mark"></span><span>vialchem<span class="muted">.labs</span></span></a><p>Research-grade peptides sold only to verified laboratories and qualified research organizations.</p><div class="badge">Research Use Only</div></div>
        <div class="foot-col"><h5>Shop</h5><ul><li><a href="${escapeHtml(mainSiteUrl)}/shop">Peptide Catalog</a></li><li><a href="${escapeHtml(mainSiteUrl)}/coa">Verify a Vial</a></li><li><a href="${escapeHtml(mainSiteUrl)}/account">My Lab</a></li></ul></div>
        <div class="foot-col"><h5>Compliance</h5><ul><li><a href="${escapeHtml(mainSiteUrl)}/legal/terms">Research Use Policy</a></li><li><a href="${escapeHtml(mainSiteUrl)}/faq">Quality Standards</a></li><li><a href="${escapeHtml(mainSiteUrl)}/coa">Documentation</a></li><li><a href="${escapeHtml(mainSiteUrl)}/legal/shipping">Shipping</a></li></ul></div>
        <div class="foot-col"><h5>Organization</h5><ul><li><a href="${escapeHtml(mainSiteUrl)}/about">About</a></li><li><a href="${escapeHtml(mainSiteUrl)}/contact">Contact</a></li><li><a href="${escapeHtml(mainSiteUrl)}/affiliate">Affiliate</a></li><li><a href="${escapeHtml(mainSiteUrl)}/blog">Research Notes</a></li></ul></div>
        <div class="foot-col"><h5>Legal</h5><ul><li><a href="${escapeHtml(mainSiteUrl)}/legal/terms">Terms</a></li><li><a href="${escapeHtml(mainSiteUrl)}/legal/privacy">Privacy</a></li><li><a href="${escapeHtml(mainSiteUrl)}/legal/refunds">Refunds</a></li><li><a href="${escapeHtml(mainSiteUrl)}/legal/cookies">Cookies</a></li></ul></div>
      </div>
      <div class="foot-base"><span>© 2026 VIALCHEM LABS - RESEARCH USE ONLY - NOT FOR HUMAN OR ANIMAL USE</span><span>BUILD 26.04 - STATUS: OPERATIONAL</span></div>
    </div>
  </footer>
</body>
</html>`;
}

function sendHtml(response, body, status = 200) {
  response.writeHead(status, {
    "cache-control": "no-store",
    "content-type": "text/html; charset=utf-8",
  });
  response.end(body);
}

function redirect(response, location, status = 303) {
  response.writeHead(status, { "cache-control": "no-store", location });
  response.end();
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const isReadRequest = request.method === "GET" || request.method === "HEAD";

  if (isReadRequest && url.pathname === "/robots.txt") {
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    response.end("User-agent: *\nDisallow: /\n");
    return;
  }

  if (isReadRequest && url.pathname === "/") {
    redirect(
      response,
      "/checkout/order-pay/260515001/?key=wc_order_local_preview",
      302,
    );
    return;
  }

  const completeMatch = url.pathname.match(
    /^\/checkout\/order-pay\/([0-9]+)\/complete$/,
  );
  if (request.method === "POST" && completeMatch) {
    redirect(
      response,
      completeUrl(
        safeReturnUrl(url.searchParams.get("return_url")),
        completeMatch[1],
      ),
    );
    return;
  }

  const checkoutMatch = url.pathname.match(
    /^\/checkout\/order-pay\/([0-9]+)\/?$/,
  );
  if (isReadRequest && checkoutMatch) {
    sendHtml(response, checkoutPage(url, checkoutMatch[1]));
    return;
  }

  sendHtml(
    response,
    "<!doctype html><title>Not found</title><h1>Checkout preview route not found</h1>",
    404,
  );
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Local Woo checkout preview: http://localhost:${port}`);
});
