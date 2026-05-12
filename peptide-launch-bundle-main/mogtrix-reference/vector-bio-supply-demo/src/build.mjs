import fs from "node:fs";
import path from "node:path";
import {
  blogPosts,
  checkoutAgreements,
  faqItems,
  nav,
  products,
  ruoDisclaimer,
  site
} from "./content.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const specPath =
  process.env.VBSC_BUILD_SPEC ||
  "/Users/abhinavkumar/Downloads/BUILD-SPEC.md";

const htmlPages = [];

function ensureDir(dir) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(path.join(root, file), content);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textToParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .filter((line) => line.trim().startsWith("- "))
          .map((line) => `<li>${escapeHtml(line.replace(/^- /, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${escapeHtml(block).replaceAll("\n", "<br>")}</p>`;
    })
    .join("\n");
}

function readLegalSections() {
  const spec = fs.readFileSync(specPath, "utf8");
  const matches = [...spec.matchAll(/^### (11\.[A-F])[\s\S]*?\n\n```([\s\S]*?)```/gm)];
  const sections = Object.fromEntries(matches.map((match) => [match[1], match[2].trim()]));
  for (const id of ["11.A", "11.B", "11.C", "11.D", "11.E", "11.F"]) {
    if (!sections[id]) {
      throw new Error(`Could not extract legal section ${id} from ${specPath}`);
    }
  }
  return sections;
}

const legal = readLegalSections();

function depthFor(currentPath) {
  return currentPath.split("/").filter(Boolean).length - 1;
}

function href(currentPath, target) {
  if (/^(https?:|mailto:|tel:|#)/.test(target)) return target;
  const depth = depthFor(currentPath);
  return `${"../".repeat(depth)}${target.replace(/^\//, "")}`;
}

function headAssets(currentPath, asset) {
  return href(currentPath, `/${asset}`);
}

function header(currentPath) {
  return `
    <header class="site-header">
      <a class="brand" href="${href(currentPath, "/index.html")}" aria-label="VECTOR BIO SUPPLY CO. home">
        <img src="${headAssets(currentPath, "assets/logo.svg")}" alt="VECTOR BIO SUPPLY CO." width="120" height="32">
      </a>
      <nav class="main-nav" aria-label="Primary navigation">
        ${nav
          .map((item) => `<a href="${href(currentPath, item.href)}">${item.label}</a>`)
          .join("")}
      </nav>
      <div class="header-actions">
        <button class="icon-button" data-cart-toggle type="button" aria-label="Open cart">
          <span aria-hidden="true">Cart</span><span class="cart-count" data-cart-count>0</span>
        </button>
        <a class="account-link" data-account-link href="${href(currentPath, "/login.html")}">Login</a>
      </div>
    </header>`;
}

function footer(currentPath) {
  const shopLinks = products
    .map((product) => `<li><a href="${href(currentPath, `/products/${product.slug}.html`)}">${product.name.replace(" 30mL", "")}</a></li>`)
    .join("");
  const legalLinks = [
    ["/terms.html", "Terms of Service"],
    ["/privacy.html", "Privacy Policy"],
    ["/shipping-and-returns.html", "Shipping & Returns"],
    ["/refund-policy.html", "Refund Policy"],
    ["/mta.html", "Material Transfer Agreement"]
  ]
    .map(([target, label]) => `<li><a href="${href(currentPath, target)}">${label}</a></li>`)
    .join("");

  return `
    <footer class="site-footer">
      <div class="footer-grid">
        <section>
          <img src="${headAssets(currentPath, "assets/logo.svg")}" alt="${site.name}" width="120" height="32">
          <p>${site.tagline}</p>
          <p>${site.address}<br>${site.supportEmail}<br>${site.supportPhone}</p>
        </section>
        <section><h2>Shop</h2><ul>${shopLinks}</ul></section>
        <section><h2>Company</h2><ul>
          <li><a href="${href(currentPath, "/about.html")}">About</a></li>
          <li><a href="${href(currentPath, "/testing.html")}">Testing</a></li>
          <li><a href="${href(currentPath, "/coa.html")}">COA Library</a></li>
          <li><a href="${href(currentPath, "/blog/index.html")}">Blog</a></li>
          <li><a href="${href(currentPath, "/affiliate.html")}">Affiliate Program</a></li>
        </ul></section>
        <section><h2>Legal</h2><ul>${legalLinks}</ul></section>
      </div>
      <div class="footer-bottom">
        <p>${ruoDisclaimer}</p>
        <p>© 2026 ${site.name} By using this site you agree to our <a href="${href(currentPath, "/terms.html")}">Terms of Service</a> and <a href="${href(currentPath, "/privacy.html")}">Privacy Policy</a>.</p>
      </div>
    </footer>`;
}

function cartDrawer(currentPath) {
  return `
    <aside id="cart-drawer" class="cart-drawer" aria-hidden="true">
      <div class="drawer-head">
        <h2>Cart</h2>
        <button class="icon-button" data-cart-close type="button" aria-label="Close cart">×</button>
      </div>
      <div data-cart-drawer-items></div>
      <div class="progress-stack">
        <div><span data-free-shipping-text>Free shipping at $250</span><div class="progress"><span data-free-shipping-bar></span></div></div>
        <div><span data-free-gift-text>Free Bac Water at $300</span><div class="progress"><span data-free-gift-bar></span></div></div>
      </div>
      <div class="drawer-actions">
        <a class="button button-secondary" href="${href(currentPath, "/cart.html")}">View Cart</a>
        <a class="button button-primary" href="${href(currentPath, "/checkout.html")}">Checkout</a>
      </div>
    </aside>`;
}

function gates() {
  return `
    <div id="storage-warning" class="storage-warning" hidden>This browser blocked persistent storage. Demo state will reset when you navigate.</div>
    <div id="cookie-banner" class="cookie-banner" hidden>
      <p>This demo uses localStorage to remember cookie choice, age confirmation, cart, account state, and consent actions. No analytics or tracking pixels are installed.</p>
      <div><button class="button button-primary" data-cookie-choice="all" type="button">Accept All</button><button class="button button-secondary" data-cookie-choice="essential" type="button">Essential Only</button></div>
    </div>
    <div id="age-gate" class="modal-backdrop" hidden>
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
        <p class="eyebrow">Access disclaimer</p>
        <h2 id="age-gate-title">Researcher access gate</h2>
        <label class="check-row"><input id="age-confirm-age" type="checkbox"> <span>Are you 21 years of age or older?</span></label>
        <label class="check-row"><input id="age-confirm-researcher" type="checkbox"> <span>Are you a qualified researcher operating in a controlled laboratory environment?</span></label>
        <div class="button-row"><button class="button button-primary" id="age-confirm" type="button">Confirm access</button><button class="button button-secondary" id="age-deny" type="button">No</button></div>
      </section>
    </div>
    <div id="soft-block" class="modal-backdrop" hidden>
      <section class="modal" role="dialog" aria-modal="true"><h2>Access not permitted</h2><p>Access to this Website is not permitted without your acceptance to these Terms.</p></section>
    </div>`;
}

function layout({ currentPath, title, main, extraScripts = [], bodyClass = "" }) {
  const depth = depthFor(currentPath);
  const base = depth ? "../".repeat(depth).replace(/\/$/, "") : ".";
  const scriptList = [
    "js/storage.js",
    "js/catalog-data.js",
    "js/state.js",
    "js/consent-log.js",
    "js/cart.js",
    ...extraScripts
  ];
  htmlPages.push(currentPath);
  return `<!doctype html>
<html lang="en" data-base="${base}" data-page="${currentPath}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- DEMO BUILD - no analytics, no tracking, no real payments. -->
  <title>${escapeHtml(title)} | ${site.name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${headAssets(currentPath, "css/main.css")}">
</head>
<body class="gate-pending ${bodyClass}">
  ${gates()}
  <div class="page-shell">
    ${header(currentPath)}
    <main>${main}</main>
    ${footer(currentPath)}
  </div>
  ${cartDrawer(currentPath)}
  ${scriptList.map((script) => `<script src="${headAssets(currentPath, script)}"></script>`).join("\n  ")}
</body>
</html>`;
}

function trustStrip() {
  return `<div class="trust-strip"><span>✓ Third-Party Tested</span><span>✓ Wyoming Registered Entity</span><span>✓ Discreet US Shipping</span></div>`;
}

function pills() {
  return `<div class="pill-row"><span>Verified</span><span>Qualified</span><span>Compliant</span></div>`;
}

function ruoBanner() {
  return `<aside class="ruo-banner"><strong>Research Use Only.</strong> ${ruoDisclaimer}</aside>`;
}

function productCard(product, currentPath) {
  return `<article class="product-card">
    <a href="${href(currentPath, `/products/${product.slug}.html`)}"><img src="${headAssets(currentPath, `assets/images/${product.slug}.svg`)}" alt="${product.name} vial illustration"></a>
    <div class="product-card-body">
      <p class="eyebrow">${product.category}</p>
      <h3>${product.name}</h3>
      <p>${product.short}</p>
      <p class="price">$${product.price.toFixed(2)} / ${product.slug.includes("water") ? "bottle" : "vial"}</p>
      <div class="card-actions">
        <button class="button button-primary" data-add-to-cart="${product.slug}" type="button">Add to Cart</button>
        <a class="coa-badge" href="${href(currentPath, `/assets/coa/${product.coaFile || `${product.slug}-coa.pdf`}`)}">View COA →</a>
      </div>
    </div>
  </article>`;
}

function productGrid(currentPath, list = products) {
  return `<div class="product-grid">${list.map((product) => productCard(product, currentPath)).join("")}</div>`;
}

function pageHero(title, subtitle, eyebrow = "VECTOR BIO SUPPLY CO.") {
  return `<section class="page-hero"><div class="container narrow"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${subtitle}</p></div></section>`;
}

function homePage() {
  const currentPath = "/index.html";
  const featured = products.slice(0, 3);
  const main = `
    <section class="home-hero" style="background-image: linear-gradient(rgba(15,42,71,.66), rgba(15,42,71,.66)), url('${headAssets(currentPath, "assets/images/hero-lab.svg")}')">
      <div class="hero-copy">
        <p class="eyebrow">Verified · Qualified · Compliant · Wyoming-Registered</p>
        <h1>Premium Research Material</h1>
        <p>Research-grade peptides. Verified. Qualified. Compliant.</p>
        <div class="button-row"><a class="button button-primary" href="${href(currentPath, "/shop.html")}">Browse Catalog →</a><a class="button button-ghost" href="${href(currentPath, "/coa.html")}">View COA Library</a></div>
      </div>
    </section>
    ${trustStrip()}
    <section class="section"><div class="container">${pills()}<h2>Featured products</h2>${productGrid(currentPath, featured)}</div></section>
    <section class="section section-bone"><div class="container three-col">
      <article><h3>Third-party purity testing.</h3><p>Every batch is independently analyzed for identity and purity by an external lab. Current Certificates of Analysis are available in our public COA library.</p></article>
      <article><h3>Wyoming-registered compliance.</h3><p>Vector Bio Supply LLC is a Wyoming limited liability company operating under United States federal and state law. We do not ship outside the continental U.S.</p></article>
      <article><h3>Discreet, fast shipping.</h3><p>Orders ship UPS or FedEx in plain, nondescript packaging within one business day. Free shipping on orders over $250.</p></article>
    </div></section>
    <section class="section"><div class="container"><h2>Recent research notes</h2><div class="two-col">${blogPosts.map((post) => `<article class="info-card"><h3>${post.title}</h3><p>${post.excerpt}</p><a href="${href(currentPath, `/blog/${post.slug}.html`)}">Read more →</a></article>`).join("")}</div></div></section>
    <section class="section section-bone"><div class="container narrow"><h2>Join our Research Updates list</h2><form class="inline-form" data-newsletter-form><input name="email" type="email" required placeholder="researcher@example.org"><label class="check-row"><input checked name="terms" type="checkbox"> <span>I agree to receive research updates and accept the Terms of Service.</span></label><button class="button button-primary" type="submit">Subscribe</button></form></div></section>`;
  write("index.html", layout({ currentPath, title: "Home", main }));
}

function shopPage() {
  const currentPath = "/shop.html";
  const filters = ["GLP-1 Analogs", "Recovery Peptides", "Growth Hormone Secretagogues", "Reconstitution Supplies"]
    .map((label) => `<label class="check-row"><input type="checkbox"> <span>${label}</span></label>`)
    .join("");
  const main = `${pageHero("Catalog.", "Volume discounts: 5+ units 10% off, 10+ units 18% off, 25+ units 25% off.", "Bulk pricing available")}
    <section class="section"><div class="container catalog-layout"><aside class="filter-panel"><h2>Filters</h2>${filters}<label>Price ceiling <input type="range" min="15" max="150" value="150"></label><span class="badge">Bulk pricing available</span></aside><div>${productGrid(currentPath)}</div></div></section><section class="section"><div class="container">${ruoBanner()}</div></section>`;
  write("shop.html", layout({ currentPath, title: "Catalog", main }));
}

function productPage(product) {
  const currentPath = `/products/${product.slug}.html`;
  const related = products.filter((candidate) => candidate.slug !== product.slug).slice(0, 2);
  const coaFile = product.coaFile || `${product.slug}-coa.pdf`;
  const main = `<section class="section"><div class="container product-layout">
      <div>
        <img class="product-hero-img" src="${headAssets(currentPath, `assets/images/${product.slug}.svg`)}" alt="${product.name} product visual">
        <div class="thumb-row"><img src="${headAssets(currentPath, `assets/images/${product.slug}.svg`)}" alt=""><a class="button button-secondary" href="${href(currentPath, `/assets/coa/${coaFile}`)}">Download Current COA (PDF)</a></div>
      </div>
      <div class="product-buy-box">
        <p class="eyebrow">RESEARCH USE ONLY</p><h1>${product.name}</h1><p>${product.descriptor}</p>
        <dl class="spec-list"><dt>Purity</dt><dd>${product.purity}</dd><dt>Form</dt><dd>${product.form}</dd><dt>Vial size</dt><dd>${product.vialSize}</dd><dt>Storage</dt><dd>${product.storage}</dd><dt>CAS</dt><dd>${product.cas}</dd></dl>
        <p class="price">$${product.price.toFixed(2)} / ${product.slug.includes("water") ? "bottle" : "vial"}</p>
        <p class="ladder">5+ vials: $${(product.price * 0.9).toFixed(2)} ea · 10+ vials: $${(product.price * 0.82).toFixed(2)} ea · 25+ vials: $${(product.price * 0.75).toFixed(2)} ea</p>
        <div class="quantity-row"><input data-product-qty="${product.slug}" min="1" value="1" type="number" aria-label="Quantity"><button class="button button-primary" data-add-to-cart="${product.slug}" type="button">Add to Cart</button></div>
        <p class="trust-line">✓ Third-party tested · ✓ Ships from Wyoming, USA · ✓ Discreet packaging.</p>${ruoBanner()}
      </div>
    </div></section>
    <section class="section"><div class="container">
      <div class="tabs">
        ${["Description", "Specifications", "COA & Testing", "Reconstitution", "Shipping"].map((label, index) => `<input ${index === 0 ? "checked" : ""} id="tab-${index}-${product.slug}" name="tabs-${product.slug}" type="radio"><label for="tab-${index}-${product.slug}">${label}</label>`).join("")}
        <article class="tab-panel">${product.description.map((p) => `<p>${p}</p>`).join("")}</article>
        <article class="tab-panel"><dl class="spec-list wide"><dt>Molecular formula</dt><dd>${product.formula}</dd><dt>Molecular weight</dt><dd>${product.weight}</dd><dt>Sequence</dt><dd>${product.sequence}</dd><dt>Batch number</dt><dd>${product.batch}</dd><dt>Manufacture date</dt><dd>April 2026</dd><dt>Expiration date</dt><dd>April 2028</dd></dl></article>
        <article class="tab-panel"><img class="chromatogram" src="${headAssets(currentPath, "assets/images/chromatogram.svg")}" alt="Analytical chromatogram placeholder"><p>Each batch is independently analyzed by Janoshik Analytical for identity and purity using HPLC and LC-MS. Current and historical COAs are available in our public COA Library.</p><a class="button button-secondary" href="${href(currentPath, `/assets/coa/${coaFile}`)}">Download Current COA (PDF)</a></article>
        <article class="tab-panel"><p>Reconstitution requires bacteriostatic water, sold separately on this Website. We recommend our 30mL bacteriostatic water in polypropylene vials. Reconstitution should be performed by a qualified researcher in a controlled environment using sterile technique.</p><button class="button button-secondary" data-add-to-cart="bacteriostatic-water-30ml" type="button">Add Bacteriostatic Water 30mL ($14.99) →</button></article>
        <article class="tab-panel"><p>Ships UPS Ground or FedEx Express within one business day. Continental U.S. only. Discreet packaging - the outer label does not reference Vector Bio Supply Co. or describe the contents.</p></article>
      </div>
      <h2>Frequently bought together</h2>${productGrid(currentPath, related)}${ruoBanner()}
    </div></section>`;
  write(`products/${product.slug}.html`, layout({ currentPath, title: product.name, main }));
}

function coaPage() {
  const currentPath = "/coa.html";
  const tiles = products
    .map((product) => `<article class="info-card"><h3>${product.name}</h3><p>Batch ${product.batch}<br>Test date: April 28, 2026</p><a class="button button-secondary" href="${href(currentPath, `/assets/coa/${product.coaFile || `${product.slug}-coa.pdf`}`)}">Download PDF</a></article>`)
    .join("");
  write("coa.html", layout({ currentPath, title: "Certificate of Analysis Library", main: `${pageHero("Certificate of Analysis Library.", "Every batch we sell is independently analyzed by a third-party lab. Below are the current COAs for our active inventory. Historical COAs are available on request to compliance@vectorbiosupply.co.")}<section class="section"><div class="container card-grid">${tiles}</div></section>` }));
}

function simplePages() {
  write("testing.html", layout({ currentPath: "/testing.html", title: "Testing & Methods", main: `${pageHero("Testing & Methods.", "Identity, purity, mass confirmation, water content, and residual-solvent review for research integrity.")}<section class="section"><div class="container legal-document"><article class="info-card"><h2>Why we test.</h2><p>Testing connects catalog claims to batch-level records. It helps qualified researchers review identity and purity before any controlled laboratory handling.</p><p>Testing does not convert an RUO material into a drug, food, cosmetic, or consumer item.</p></article><article class="info-card"><h2>What we test for.</h2><ul><li>Identity: HPLC retention time match</li><li>Purity: HPLC area %</li><li>Mass confirmation: LC-MS</li><li>Water content: Karl Fischer</li><li>Residual solvents: GC</li></ul><p>Sterility, endotoxin, and stability testing are not performed on research-use-only materials.</p></article><article class="info-card"><h2>Our partner lab.</h2><p>Janoshik Analytical is referenced as the third-party lab for this demo storefront.</p></article><article class="info-card"><h2>How to read a COA.</h2><img class="chromatogram" src="${headAssets("/testing.html", "assets/images/chromatogram.svg")}" alt="Annotated COA-style chromatogram"></article></div></section>` }));

  write("about.html", layout({ currentPath: "/about.html", title: "About", main: `${pageHero("About.", "Vector Bio Supply Co. exists to provide qualified researchers with verified, analyzed laboratory materials at scale.")}<section class="section"><div class="container"><p class="lead">Vector Bio Supply Co. exists to provide qualified researchers with verified, analyzed laboratory materials at scale, with full disclosure of testing methods and origin. We do not sell to consumers. We do not provide medical advice. We do not provide dosing guidance.</p><div class="three-col"><article class="info-card"><h3>Compliance Officer</h3><p>Reviews access policy, attestations, and legal-version records.</p></article><article class="info-card"><h3>Operations Lead</h3><p>Coordinates batch documentation, discreet shipping workflow, and support records.</p></article><article class="info-card"><h3>Lab QA Manager</h3><p>Maintains COA library review and analytical documentation standards.</p></article></div><aside class="ruo-banner">Vector Bio Supply LLC is a Wyoming limited liability company. We are not a compounding pharmacy under Section 503A or 503B of the Federal Food, Drug, and Cosmetic Act. We are not an outsourcing facility. We do not manufacture finished pharmaceutical products. We supply analyzed bulk and lyophilized materials to qualified research customers.</aside></div></section>` }));

  write("faq.html", layout({ currentPath: "/faq.html", title: "FAQ", main: `${pageHero("FAQ.", "Research-use boundary, shipping, verification, and account policy.")}<section class="section"><div class="container legal-document">${faqItems.map(([q, a], index) => `<details ${index === 2 ? 'id="dosing-question"' : ""} class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>` }));
}

function blogPages() {
  const indexPath = "/blog/index.html";
  write("blog/index.html", layout({ currentPath: indexPath, title: "Blog", main: `${pageHero("Blog.", "VBSC Editorial notes for research material handling and documentation.")}<section class="section"><div class="container card-grid">${blogPosts.map((post) => `<article class="info-card"><p class="eyebrow">VBSC Editorial · April 28, 2026</p><h2>${post.title}</h2><p>${post.excerpt}</p><a href="${href(indexPath, `/blog/${post.slug}.html`)}">Read more →</a></article>`).join("")}</div></section>` }));
  for (const post of blogPosts) {
    const currentPath = `/blog/${post.slug}.html`;
    write(`blog/${post.slug}.html`, layout({ currentPath, title: post.title, main: `${pageHero(post.title, "VBSC Editorial · April 28, 2026", "Research note")}<article class="section"><div class="container legal-document">${post.body.map((p) => `<p>${p}</p>`).join("")}</div></article>` }));
  }
}

function registerPage() {
  const currentPath = "/register.html";
  const main = `${pageHero("Researcher Registration.", "Access to Vector Bio Supply Co. is restricted to qualified researchers operating within controlled laboratory environments. Registration requires you to confirm your eligibility and sign our standard research-use attestation. Fields appear progressively as you complete the form.")}
    <section class="section"><div class="container form-layout">
      <form id="register-form" class="form-panel stack">
        <div class="demo-warning">DEMO BUILD: account state and signature data are stored in browser localStorage for this local simulation only.</div>
        <section data-stage="1"><h2>Stage 1 — Identity</h2><div class="form-grid"><label>First name<input name="firstName" required></label><label>Last name<input name="lastName" required></label><label>Email<input name="email" required type="email" autocomplete="off"></label><label>Password<input name="password" required type="password" minlength="8" autocomplete="new-password"></label><label>Confirm password<input name="confirmPassword" required type="password" minlength="8" autocomplete="new-password"></label></div></section>
        <section data-stage="2" hidden><h2>Stage 2 — Sector</h2><label>Industry<select name="industry"><option value="">Select industry</option><option>Academia</option><option>Biotech</option><option>Pharma</option><option>Independent Research</option><option>Other</option></select></label><p class="subtle">Select the sector you are operating in.</p></section>
        <section data-stage="3" hidden><h2>Stage 3 — Credential</h2><label>Credential<select name="credential"><option value="">Select credential</option><option>PhD</option><option>MD</option><option>MS</option><option>BS</option><option>Lab Technician</option><option>Independent Researcher</option><option>Other</option></select></label><p class="subtle">Select your highest professional credential.</p></section>
        <section data-stage="4" hidden><h2>Stage 4 — Bundled multi-attestation checkbox</h2><label class="check-row"><input name="attestation" type="checkbox"> <span id="attestation-text">I affirm that I am 21 years of age or older, trained in handling Research Use Only (RUO) materials, and work in a qualified research environment equipped with appropriate personal protective equipment (PPE). I have read and agree to the Terms of Service, Privacy Policy, Material Transfer Agreement, and Refund Policy.</span></label></section>
        <section data-stage="5" hidden><h2>Stage 5 — Signature pad</h2><p>Draw your signature using your mouse, trackpad, or touchscreen.</p><canvas class="sig-pad" id="sig-pad" width="400" height="150"></canvas><button class="button button-secondary" id="clear-signature" type="button">Clear</button></section>
        <p class="form-error" data-register-error></p><button class="button button-primary" id="create-account" disabled type="submit">Create Account</button>
      </form>
      <aside class="info-card"><h2>Registration provides</h2><ul><li>Access to product catalog</li><li>COA library</li><li>Volume discounts</li><li>Batch notifications</li></ul><p><a href="${href(currentPath, "/terms.html")}">Terms of Service</a> · <a href="${href(currentPath, "/privacy.html")}">Privacy Policy</a></p></aside>
    </div></section>`;
  write("register.html", layout({ currentPath, title: "Researcher Registration", main, extraScripts: ["js/registration.js"] }));
}

function loginAccountMtaPages() {
  write("login.html", layout({ currentPath: "/login.html", title: "Login", main: `${pageHero("Login.", "Access your local demo account.")}<section class="section"><div class="container narrow"><form id="login-form" class="form-panel stack"><div class="demo-warning">DEMO BUILD: this login checks browser-local demo state only.</div><label>Email<input name="email" required type="email" autocomplete="off"></label><label>Password<input name="password" required type="password" autocomplete="off"></label><p class="form-error" data-login-error></p><button class="button button-primary" type="submit">Login</button><button class="link-button" data-forgot-password type="button">Forgot password</button></form></div></section>`, extraScripts: ["js/registration.js"] }));

  write("account.html", layout({ currentPath: "/account.html", title: "Account", main: `${pageHero("Account.", "Orders, profile, MTA status, Your Consent Record, and Affiliate.")}<section class="section"><div class="container"><div class="tabs account-tabs"><a href="#orders">Orders</a><a href="#profile">Profile</a><a href="#mta-status">MTA Status</a><a href="#consent-record">Your Consent Record</a><a href="#affiliate">Affiliate</a></div><section id="orders" class="account-panel"></section><section id="profile" class="account-panel"></section><section id="mta-status" class="account-panel"></section><section id="consent-record" class="account-panel"></section><section id="affiliate" class="account-panel"></section></div></section>`, extraScripts: ["js/registration.js"] }));

  write("mta.html", layout({ currentPath: "/mta.html", title: "Material Transfer Agreement", main: `${pageHero("Material Transfer Agreement.", "The customer must sign before any order can ship.")}<section class="section"><div class="container legal-layout"><article class="legal-document"><pre class="legal-pre">${escapeHtml(legal["11.E"])}</pre><form id="mta-form" class="form-panel stack"><label>By typing my full legal name below I am signing this Agreement electronically with the same effect as a hand-written signature<input name="typedName" required autocomplete="off"></label><canvas class="sig-pad" id="mta-sig-pad" width="400" height="150"></canvas><button class="button button-secondary" id="clear-mta-signature" type="button">Clear</button><p class="form-error" data-mta-error></p><button class="button button-primary" disabled id="sign-mta" type="submit">Sign and Return</button></form></article></div></section>`, extraScripts: ["js/registration.js"] }));
}

function cartCheckoutPages() {
  write("cart.html", layout({ currentPath: "/cart.html", title: "Cart", main: `${pageHero("Cart.", "Review quantities, thresholds, and final-sale policy before checkout.")}<section class="section"><div class="container cart-layout"><div><div class="notice">Reminder: All sales are final. Please review our <a href="${href("/cart.html", "/refund-policy.html")}">Refund Policy</a> before placing your order.</div><div id="cart-page-items"></div>${ruoBanner()}</div><aside class="info-card"><h2>Summary</h2><dl class="totals"><dt>Subtotal</dt><dd data-cart-subtotal>$0.00</dd><dt>Shipping</dt><dd data-cart-shipping>$9.99</dd><dt>Total</dt><dd data-cart-total>$0.00</dd></dl><div class="progress-stack"><div><span data-free-shipping-text>Free shipping at $250</span><div class="progress"><span data-free-shipping-bar></span></div></div><div><span data-free-gift-text>Free Bac Water at $300</span><div class="progress"><span data-free-gift-bar></span></div></div></div><label>Promo code<input placeholder="RESEARCH"></label><a class="button button-primary" href="${href("/cart.html", "/checkout.html")}">Proceed to Checkout</a></aside></div></section>` }));

  const agreementList = checkoutAgreements.map(([clauseRef, title], index) => `<li><strong>${index + 1}. ${title}</strong> <a href="${href("/checkout.html", clauseRef === "mta" ? "/mta.html" : clauseRef.startsWith("shipping") ? "/shipping-and-returns.html" : clauseRef.startsWith("privacy") ? "/privacy.html" : "/terms.html")}">View →</a></li>`).join("");
  write("checkout.html", layout({ currentPath: "/checkout.html", title: "Checkout", main: `${pageHero("Checkout.", "No backend. No real payment integration. This form writes client-side demo state only.")}<section class="section"><div class="container checkout-layout"><form id="checkout-form" class="form-panel stack" autocomplete="off"><div class="demo-warning">DEMO BUILD: payment fields are visual-only. No card, ACH, or crypto data is submitted or stored.</div><section><h2>Shipping address</h2><div class="form-grid"><label>Full name<input name="shipName" required></label><label>Address<input name="shipAddress" required></label><label>City<input name="shipCity" required></label><label>State<select name="shipState" required><option>WY</option><option>CA</option><option>NY</option><option>TX</option><option>FL</option></select></label><label>ZIP<input name="shipZip" required></label><label>Phone<input name="phone" required></label></div></section><label class="check-row"><input checked name="sameBilling" type="checkbox"> <span>Same as shipping</span></label><section><h2>Payment method</h2><label class="check-row"><input checked name="paymentMethod" value="card" type="radio"> <span>Credit Card</span></label><div class="form-grid payment-visual"><input data-payment-field inputmode="numeric" autocomplete="off" placeholder="Card number (visual only)"><input data-payment-field autocomplete="off" placeholder="MM / YY"><input data-payment-field inputmode="numeric" autocomplete="off" placeholder="CVC"><input data-payment-field autocomplete="off" placeholder="Name on card"></div><label class="check-row"><input name="paymentMethod" value="ach" type="radio"> <span>ACH/Wire</span></label><p class="subtle">Wire instructions: VBSC Demo Operating Account · Routing 000000000 · Account 000000000.</p><label class="check-row"><input name="paymentMethod" value="crypto" type="radio"> <span>Cryptocurrency</span></label><p class="subtle">BTC demo-address · ETH demo-address · USDT demo-address.</p><p class="subtle">Note: payments are processed by Verified-Pay, our third-party payment provider. Your card statement will read 'VECTOR BIO LLC.'</p></section><label class="check-row"><input checked name="newsletter" type="checkbox"> <span>Receive Vector Bio Supply Co. research updates via email.</span></label><label class="check-row"><input checked name="sms" type="checkbox"> <span>Receive shipping notifications via SMS. Standard messaging rates apply.</span></label><label class="check-row"><input id="final-terms" name="finalTerms" type="checkbox"> <span>I confirm I have read and agree to the Terms of Service, Privacy Policy, Shipping & Returns Policy, and Refund Policy. I understand all sales are final and that I have signed the Material Transfer Agreement.</span></label><details class="consent-review"><summary>Review your agreements (17 items)</summary><ol>${agreementList}</ol></details><p class="form-error" data-checkout-error></p><button class="button button-primary" disabled id="place-order" type="submit">Place Order</button></form><aside class="info-card"><h2>Order summary</h2><div id="checkout-summary"></div>${ruoBanner()}</aside></div></section>`, extraScripts: ["js/checkout.js"] }));

  write("order-confirmation.html", layout({ currentPath: "/order-confirmation.html", title: "Order Confirmation", main: `${pageHero("Thank you. Your order is confirmed.", "Order ID: pending local demo lookup.")}<section class="section"><div class="container"><div id="confirmation-content" class="legal-document"></div><article class="info-card audit-callout"><h2>Audit Trail Available.</h2><p>For your records and for compliance purposes, every agreement and consent action you have completed is logged in your account. View your full consent record:</p><a class="button button-primary" href="${href("/order-confirmation.html", "/account.html")}#consent-record">View Your Consent Record</a></article><article class="info-card"><h2>Affiliate referral</h2><p>Earn 12% on every order from researchers you refer. View affiliate program.</p><a href="${href("/order-confirmation.html", "/affiliate.html")}">View affiliate program</a></article></div></section>`, extraScripts: ["js/checkout.js"] }));
}

function legalPages() {
  const pages = [
    ["terms.html", "/terms.html", "Terms of Service", "11.A"],
    ["privacy.html", "/privacy.html", "Privacy Policy", "11.B"],
    ["shipping-and-returns.html", "/shipping-and-returns.html", "Shipping & Returns", "11.C"],
    ["refund-policy.html", "/refund-policy.html", "Refund Policy", "11.D"]
  ];
  for (const [file, currentPath, title, id] of pages) {
    const toc = legal[id]
      .split("\n")
      .filter((line) => /^[A-Z0-9][A-Z0-9 &;.,'()/-]{4,}$/.test(line.trim()))
      .slice(0, 12)
      .map((line, index) => `<a href="#section-${index}">${escapeHtml(line)}</a>`)
      .join("");
    const body = legal[id]
      .split(/\n{2,}/)
      .map((block, index) => `<section id="section-${index}" class="legal-block">${textToParagraphs(block)}</section>`)
      .join("");
    write(file, layout({ currentPath, title, main: `${pageHero(`${title}.`, "Full policy text rendered from BUILD-SPEC Section 11.")}<section class="section"><div class="container legal-layout"><aside class="legal-nav">${toc}</aside><article class="legal-document">${body}</article></div></section>` }));
  }
}

function affiliateContactPages() {
  write("affiliate.html", layout({ currentPath: "/affiliate.html", title: "Affiliate Program", main: `${pageHero("Affiliate Program.", "Commission tiers, net-30 payouts, and program rules.")}<section class="section"><div class="container legal-document"><article class="info-card"><h2>Program overview</h2><p>Qualified account holders may enroll in the affiliate program. Commission tiers: 10% standard, 12% high-volume, 15% B2B referrals. Payout schedule: net-30, $100 minimum.</p><button class="button button-primary" data-affiliate-enroll type="button">Enroll account</button></article><pre class="legal-pre">${escapeHtml(legal["11.F"])}</pre></div></section>`, extraScripts: ["js/registration.js"] }));

  write("contact.html", layout({ currentPath: "/contact.html", title: "Contact", main: `${pageHero("Contact.", "Support, compliance questions, wholesale inquiries, and COA requests.")}<section class="section"><div class="container form-layout"><form id="contact-form" class="form-panel stack"><label>Name<input name="name" required></label><label>Email<input name="email" required type="email"></label><label>Subject<select name="subject"><option>Order Status</option><option>COA Request</option><option>Compliance Question</option><option>Wholesale Inquiry</option><option>Other</option></select></label><label>Message<textarea name="message" required></textarea></label><button class="button button-primary" type="submit">Submit</button></form><aside class="info-card"><h2>Support</h2><p>${site.supportEmail}<br>${site.supportPhone}<br>Mon-Fri, 9am-5pm Mountain<br>${site.address}</p></aside></div></section><div id="refusal-modal" class="modal-backdrop" hidden><section class="modal"><h2>Refusal to Provide Guidelines.</h2><p>Vector Bio Supply Co. assumes that the Customer is familiar with the products being purchased and does not provide guidelines or suggestions regarding their use. Your message has been flagged as a request for usage guidance, which under our Terms of Service may be considered evidence of lack of qualification. We are unable to respond to your inquiry. If you believe this was sent in error, please contact compliance@vectorbiosupply.co.</p><button class="button button-primary" data-refusal-close type="button">Close</button></section></div>`, extraScripts: ["js/blacklist.js"] }));
}

function dataFile() {
  const data = {
    products: products.map((product) => ({
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      coaFile: product.coaFile || `${product.slug}-coa.pdf`
    })),
    agreements: checkoutAgreements.map(([clauseRef, title]) => ({ clauseRef, title }))
  };
  write("js/catalog-data.js", `window.VBSC_DATA = ${JSON.stringify(data, null, 2)};\n`);
}

function logo() {
  write("assets/logo.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" width="120" height="32">
  <g fill="#0F2A47">
    <polygon points="0,4 10,4 18,12 10,12"/>
    <polygon points="0,14 12,14 20,22 8,22"/>
    <polygon points="0,24 14,24 22,32 6,32"/>
  </g>
  <text x="28" y="14" font-family="'Source Serif 4', Georgia, serif" font-size="13" font-weight="700" fill="#0F2A47" letter-spacing="1.5">VECTOR</text>
  <text x="28" y="26" font-family="'Inter', sans-serif" font-size="7" font-weight="500" fill="#3A6B7A" letter-spacing="1.2">BIO SUPPLY CO.</text>
</svg>
`);
}

function imageSvg(title, color = "#3A6B7A") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${escapeHtml(title)}">
  <rect width="800" height="800" fill="#FAF7F2"/>
  <path d="M0 640 C180 520 300 720 480 560 C620 430 690 500 800 430 L800 800 L0 800Z" fill="#E5E0D6"/>
  <g transform="translate(250 120)" stroke="#0F2A47" stroke-width="10" fill="none">
    <path d="M110 80 v250 c0 60 -52 110 -110 110 h220 c-58 0 -110 -50 -110 -110 V80"/>
    <path d="M65 80 h90"/>
    <path d="M25 300 h170"/>
  </g>
  <rect x="260" y="460" width="280" height="120" rx="8" fill="${color}" opacity=".92"/>
  <text x="400" y="525" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#fff">${escapeHtml(title)}</text>
  <path d="M180 650 h440" stroke="#C8780B" stroke-width="8"/>
</svg>`;
}

function assets() {
  logo();
  write("assets/images/hero-lab.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 900"><rect width="1920" height="900" fill="#0F2A47"/><g opacity=".34" fill="none" stroke="#FAF7F2" stroke-width="8"><path d="M120 700 C320 480 520 820 760 540 S1240 520 1500 300 S1780 220 1900 160"/><path d="M260 160 h240 v460 h-240z"/><path d="M680 110 h160 v520 h-160z"/><path d="M1030 170 h280 v370 h-280z"/></g><g fill="#C8780B" opacity=".8"><circle cx="1480" cy="230" r="30"/><circle cx="1530" cy="290" r="16"/><circle cx="1400" cy="330" r="12"/></g></svg>`);
  write("assets/images/chromatogram.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420"><rect width="900" height="420" fill="#fff"/><g stroke="#E5E0D6"><path d="M70 350 h760"/><path d="M70 70 v280"/></g><path d="M80 340 C190 340 220 336 250 335 C300 333 315 90 340 334 C390 334 410 335 440 330 C470 325 490 230 520 330 C620 338 700 340 820 340" fill="none" stroke="#0F2A47" stroke-width="5"/><text x="90" y="55" font-family="Inter, sans-serif" font-size="24" fill="#0F2A47">Sample analytical chromatogram</text><text x="690" y="385" font-family="Inter, sans-serif" font-size="18" fill="#6B7785">DEMO COA</text></svg>`);
  const colors = ["#3A6B7A", "#0F2A47", "#C8780B", "#587B63", "#7A4C3A", "#6B7785"];
  products.forEach((product, index) => write(`assets/images/${product.slug}.svg`, imageSvg(product.name, colors[index % colors.length])));
}

function pdfFor(product) {
  const lines = [
    "VECTOR BIO SUPPLY CO.",
    "SAMPLE CERTIFICATE OF ANALYSIS - DEMO RECORD",
    `Product: ${product.name}`,
    `Batch: ${product.batch}`,
    `Purity: ${product.purity}`,
    "Method: HPLC / LC-MS placeholder",
    "This PDF is generated for investigative demo use only."
  ];
  const stream = `BT /F1 14 Tf 72 740 Td ${lines
    .map((line, index) => `${index ? "0 -24 Td " : ""}(${line.replace(/[()\\]/g, "\\$&")}) Tj`)
    .join(" ")} ET`;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n",
    `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj\n`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n"
  ];
  let offset = "%PDF-1.4\n".length;
  const xref = [0];
  for (const object of objects) {
    xref.push(offset);
    offset += object.length;
  }
  const body = objects.join("");
  const table = `xref\n0 ${xref.length}\n0000000000 65535 f \n${xref
    .slice(1)
    .map((item) => `${String(item).padStart(10, "0")} 00000 n \n`)
    .join("")}`;
  const trailer = `trailer << /Root 1 0 R /Size ${xref.length} >>\nstartxref\n${offset}\n%%EOF\n`;
  return `%PDF-1.4\n${body}${table}${trailer}`;
}

function pdfs() {
  products.forEach((product) => write(`assets/coa/${product.coaFile || `${product.slug}-coa.pdf`}`, pdfFor(product)));
}

function manifest() {
  write("manifest.json", JSON.stringify({ pages: htmlPages.sort(), pageCount: htmlPages.length }, null, 2));
}

homePage();
shopPage();
products.forEach(productPage);
coaPage();
simplePages();
blogPages();
registerPage();
loginAccountMtaPages();
cartCheckoutPages();
legalPages();
affiliateContactPages();
dataFile();
assets();
pdfs();
manifest();

console.log(`Generated ${htmlPages.length} VECTOR BIO demo pages in ${root}`);
