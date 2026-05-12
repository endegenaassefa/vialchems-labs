import { chromium } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const WIDTH = 1200;
const HEIGHT = 1600;
const outDir = new URL("../public/visuals/products/mogtrix-vials/", import.meta.url);
const productSource = new URL("../lib/content/products.ts", import.meta.url);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeLabel(value) {
  return escapeHtml(value).replaceAll("-", "&#8209;");
}

function formatProductLabel(value) {
  const escaped = escapeLabel(value);
  return value.length > 28 ? escaped.replaceAll(" + ", " +<br>") : escaped;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getStringProperty(objectLiteral, propertyName) {
  const property = objectLiteral.properties.find((item) => {
    if (!ts.isPropertyAssignment(item)) {
      return false;
    }

    const name = item.name;
    return ts.isIdentifier(name)
      ? name.text === propertyName
      : ts.isStringLiteral(name) && name.text === propertyName;
  });

  if (!property || !ts.isPropertyAssignment(property)) {
    return null;
  }

  const value = property.initializer;
  return ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)
    ? value.text
    : null;
}

function extractProducts(sourceText) {
  const source = ts.createSourceFile(
    productSource.pathname,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );
  const products = [];

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "productPreviews" &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const element of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) {
          continue;
        }

        const slug = getStringProperty(element, "slug");
        const name = getStringProperty(element, "name");
        const vialSize = getStringProperty(element, "vialSize");

        if (slug && name && vialSize) {
          products.push({ slug, name, vialSize });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return products;
}

function splitLabel(product) {
  const dosagePattern = escapeRegExp(product.vialSize).replaceAll("\\ ", "\\s*");
  const dosageAtEnd = new RegExp(`\\s+${dosagePattern}$`, "i");
  const genericDoseAtEnd = /\s+\d+(?:mg)(?:\s*\/\s*\d+mg)?$/i;
  const productName = product.name
    .replace(dosageAtEnd, "")
    .replace(genericDoseAtEnd, "")
    .trim();

  return {
    productName: productName || product.name,
    dosage: product.vialSize
  };
}

function labelMetrics(productName, dosage) {
  const productLength = productName.length;
  const productFont =
    productLength > 28 ? 32 : productLength > 21 ? 38 : productLength > 14 ? 46 : 54;
  const dosageFont = dosage.length > 14 ? 28 : dosage.length > 9 ? 34 : 40;
  const labelGap = productLength > 28 ? 9 : 13;
  return { productFont, dosageFont, labelGap };
}

function renderHtml(product) {
  const { productName, dosage } = splitLabel(product);
  const { productFont, dosageFont, labelGap } = labelMetrics(productName, dosage);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      :root {
        color-scheme: only light;
      }

      html,
      body {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        margin: 0;
        overflow: hidden;
        background: transparent;
      }

      .stage {
        position: relative;
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        overflow: hidden;
        background: transparent;
        font-family: Inter, "Helvetica Neue", Arial, sans-serif;
      }

      .stage > svg {
        position: absolute;
        inset: 0;
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        transform: scaleX(1.1);
        transform-origin: 50% 50%;
      }

      .printed-label {
        position: absolute;
        left: 392px;
        top: 560px;
        width: 468px;
        height: 456px;
        box-sizing: border-box;
        padding: 26px 28px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${labelGap}px;
        color: #f7ffff;
        text-align: center;
        overflow: hidden;
      }

      .wordmark {
        position: relative;
        z-index: 1;
        margin: -4px 0 -2px;
        color: #ffffff;
        font-family: "Arial Black", Impact, Inter, sans-serif;
        font-size: 52px;
        font-style: italic;
        font-weight: 900;
        letter-spacing: -2px;
        line-height: 0.92;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.18);
        transform: skewX(-7deg);
      }

      .wordmark strong {
        color: #93bd29;
        font-weight: inherit;
      }

      .peptides {
        position: relative;
        z-index: 1;
        color: #9fce33;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 12px;
        line-height: 1;
        margin-left: 14px;
      }

      .brand,
      .product,
      .dose,
      .ruo,
      .lab {
        position: relative;
        z-index: 1;
        margin: 0;
        width: 100%;
        max-width: 100%;
        overflow-wrap: normal;
        word-break: normal;
        hyphens: manual;
      }

      .brand {
        display: none;
      }

      .product {
        color: #f5f7ee;
        font-size: ${productFont}px;
        line-height: 1.08;
        font-weight: 900;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .dose {
        display: inline-flex;
        width: auto;
        min-width: 132px;
        justify-content: center;
        border: 2px solid rgba(151, 205, 39, 0.78);
        color: #a9d83a;
        font-size: ${dosageFont}px;
        line-height: 1.08;
        font-weight: 900;
        letter-spacing: 0;
        padding: 5px 18px 4px;
      }

      .divider {
        position: relative;
        z-index: 1;
        width: 250px;
        height: 2px;
        border-radius: 999px;
        background: linear-gradient(90deg, transparent, #9fce33, #9fce33, transparent);
      }

      .ruo {
        color: #f7ffff;
        font-size: 19px;
        line-height: 1.05;
        font-weight: 850;
        letter-spacing: 0.5px;
      }

      .lab {
        color: #cedbda;
        font-size: 16px;
        line-height: 1.15;
        font-weight: 780;
        letter-spacing: 0.5px;
      }
    </style>
  </head>
  <body>
    <div class="stage">
      ${renderVialSvg()}
      <div class="printed-label" aria-hidden="true">
        <div class="wordmark"><span>MOG</span><strong>TRIX</strong></div>
        <div class="peptides">PEPTIDES</div>
        <div class="product">${formatProductLabel(productName)}</div>
        <div class="dose">${escapeLabel(dosage)}</div>
        <div class="divider"></div>
        <div class="ruo">RESEARCH USE ONLY</div>
        <div class="lab">FOR LABORATORY RESEARCH</div>
      </div>
      ${renderOverlaySvg()}
    </div>
  </body>
</html>`;
}

function renderVialSvg() {
  return `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="greenCap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#18b973"/>
      <stop offset="0.28" stop-color="#0a7c4d"/>
      <stop offset="0.72" stop-color="#08633f"/>
      <stop offset="1" stop-color="#06472f"/>
    </linearGradient>
    <linearGradient id="capGloss" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="0.22" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="0.48" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="0.72" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="crimp" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7f8f0"/>
      <stop offset="0.18" stop-color="#9d9e98"/>
      <stop offset="0.5" stop-color="#e0e0d6"/>
      <stop offset="0.78" stop-color="#6e716e"/>
      <stop offset="1" stop-color="#d4d6d0"/>
    </linearGradient>
    <linearGradient id="crimpSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.36"/>
      <stop offset="0.18" stop-color="#222" stop-opacity="0.22"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="0.82" stop-color="#111" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.38"/>
    </linearGradient>
    <linearGradient id="glassFill" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="0.1" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="0.22" stop-color="#d7ffff" stop-opacity="0.18"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.045"/>
      <stop offset="0.78" stop-color="#dfffea" stop-opacity="0.14"/>
      <stop offset="0.9" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.12"/>
    </linearGradient>
    <linearGradient id="glassEdge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="powderFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.55" stop-color="#ede9dc"/>
      <stop offset="1" stop-color="#c9c5b8"/>
    </linearGradient>
    <linearGradient id="labelInk" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0b0d0b" stop-opacity="0.82"/>
      <stop offset="0.14" stop-color="#050606" stop-opacity="0.98"/>
      <stop offset="0.52" stop-color="#010101" stop-opacity="1"/>
      <stop offset="0.86" stop-color="#050606" stop-opacity="0.98"/>
      <stop offset="1" stop-color="#0b0d0b" stop-opacity="0.82"/>
    </linearGradient>
    <filter id="softGlass" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>
    <filter id="capShadow" x="-20%" y="-40%" width="140%" height="180%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
    <clipPath id="vialClip">
      <path d="M445 332 H755 Q780 332 780 358 V430 Q780 458 822 486 Q862 514 862 598 V1332 Q862 1436 758 1436 H442 Q338 1436 338 1332 V598 Q338 514 378 486 Q420 458 420 430 V358 Q420 332 445 332 Z"/>
    </clipPath>
    <clipPath id="labelClip">
      <path d="M360 580 C440 548 760 548 840 580 V1018 C760 1048 440 1048 360 1018 Z"/>
    </clipPath>
  </defs>

  <g filter="url(#capShadow)">
    <rect x="410" y="158" width="380" height="78" rx="18" fill="url(#greenCap)"/>
    <ellipse cx="600" cy="158" rx="190" ry="28" fill="#19bd75"/>
    <ellipse cx="600" cy="160" rx="166" ry="18" fill="#087144" opacity="0.7"/>
    <rect x="410" y="158" width="380" height="78" rx="18" fill="url(#capGloss)" opacity="0.75"/>
    <path d="M428 181 C502 199 698 199 772 181" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4"/>
    <rect x="428" y="232" width="344" height="86" rx="18" fill="url(#crimp)"/>
    <rect x="428" y="232" width="344" height="86" rx="18" fill="url(#crimpSide)" opacity="0.75"/>
    <path d="M438 306 C510 331 690 331 762 306" fill="none" stroke="#0a0b0a" stroke-opacity="0.5" stroke-width="12"/>
  </g>

  <g clip-path="url(#vialClip)">
    <path d="M445 332 H755 Q780 332 780 358 V430 Q780 458 822 486 Q862 514 862 598 V1332 Q862 1436 758 1436 H442 Q338 1436 338 1332 V598 Q338 514 378 486 Q420 458 420 430 V358 Q420 332 445 332 Z" fill="url(#glassFill)"/>
    <rect x="348" y="334" width="504" height="1102" fill="url(#glassFill)" opacity="0.88"/>
    <rect x="384" y="1112" width="432" height="176" rx="54" fill="url(#powderFill)" opacity="0.88"/>
    <ellipse cx="600" cy="1112" rx="216" ry="42" fill="#fbfaf0" opacity="0.9"/>
    <ellipse cx="600" cy="1268" rx="218" ry="42" fill="#d9d5c7" opacity="0.5"/>
    <path d="M360 580 C440 548 760 548 840 580 V1018 C760 1048 440 1048 360 1018 Z" fill="url(#labelInk)"/>
    <g clip-path="url(#labelClip)" opacity="0.34">
      <path d="M735 566 C686 616 686 678 735 730 C784 782 784 842 735 894 C686 944 686 1000 735 1044" fill="none" stroke="#94c52e" stroke-width="4"/>
      <path d="M792 566 C743 616 743 678 792 730 C841 782 841 842 792 894 C743 944 743 1000 792 1044" fill="none" stroke="#94c52e" stroke-width="4"/>
      <path d="M736 602 H792 M722 660 H806 M737 720 H791 M722 784 H806 M737 846 H791 M722 910 H806 M736 978 H792" stroke="#94c52e" stroke-width="3"/>
      <path d="M390 642 l34 -18 l32 18 v36 l-32 18 l-34 -18 Z M450 678 l32 -18 l34 18 v36 l-34 18 l-32 -18 Z M406 746 l34 -18 l32 18" fill="none" stroke="#789e24" stroke-width="2"/>
    </g>
    <path d="M392 1000 C468 1018 732 1018 808 1000" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="4"/>
    <path d="M388 398 C470 424 730 424 812 398" fill="none" stroke="#ffffff" stroke-opacity="0.42" stroke-width="5"/>
    <path d="M394 1320 C472 1346 728 1346 806 1320" fill="none" stroke="#ffffff" stroke-opacity="0.26" stroke-width="6"/>
    <path d="M392 480 C356 706 358 1168 392 1400" fill="none" stroke="url(#glassEdge)" stroke-width="9" opacity="0.62"/>
    <path d="M808 480 C844 706 842 1168 808 1400" fill="none" stroke="url(#glassEdge)" stroke-width="7" opacity="0.45"/>
    <path d="M458 356 C438 694 440 1110 458 1408" fill="none" stroke="#ffffff" stroke-opacity="0.26" stroke-width="5"/>
    <path d="M740 356 C762 694 760 1110 740 1408" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="5"/>
  </g>

  <path d="M445 332 H755 Q780 332 780 358 V430 Q780 458 822 486 Q862 514 862 598 V1332 Q862 1436 758 1436 H442 Q338 1436 338 1332 V598 Q338 514 378 486 Q420 458 420 430 V358 Q420 332 445 332 Z" fill="none" stroke="#f7ffff" stroke-opacity="0.74" stroke-width="6"/>
  <path d="M422 336 C494 360 706 360 778 336" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="5"/>
  <ellipse cx="600" cy="1435" rx="134" ry="22" fill="#ffffff" opacity="0.32"/>
</svg>`;
}

function renderOverlaySvg() {
  return `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="frontSheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.0"/>
      <stop offset="0.34" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="0.42" stop-color="#8fffff" stop-opacity="0.18"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="frontClip">
      <path d="M445 332 H755 Q780 332 780 358 V430 Q780 458 822 486 Q862 514 862 598 V1332 Q862 1436 758 1436 H442 Q338 1436 338 1332 V598 Q338 514 378 486 Q420 458 420 430 V358 Q420 332 445 332 Z"/>
    </clipPath>
  </defs>
  <g clip-path="url(#frontClip)">
    <path d="M396 384 C468 568 490 1030 466 1418" fill="none" stroke="#ffffff" stroke-opacity="0.17" stroke-width="12"/>
    <path d="M804 384 C740 620 730 1066 752 1418" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="9"/>
    <path d="M324 492 L848 754" stroke="url(#frontSheen)" stroke-width="72" opacity="0.26"/>
  </g>
</svg>`;
}

async function main() {
  const sourceText = await readFile(productSource, "utf8");
  const products = extractProducts(sourceText);

  if (products.length === 0) {
    throw new Error("No products found in productPreviews.");
  }

  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1
  });

  for (const product of products) {
    await page.setContent(renderHtml(product), { waitUntil: "load" });
    await page.screenshot({
      path: path.join(outDir.pathname, `${product.slug}.png`),
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
      omitBackground: true
    });
    console.log(`generated ${product.slug}.png`);
  }

  await browser.close();
}

await main();
