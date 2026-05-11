import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.resolve(
  ROOT,
  '..',
  '_merge_refs',
  'vailchem-labs-website',
  'assets',
  'vailchem-products',
);
const OUTPUT_DIR = path.resolve(ROOT, 'public', 'product-shots');
const BUNDLE_OUTPUT_DIR = path.resolve(ROOT, 'public', 'bundle-shots');

const sourceImages = {
  bpc: 'vailchem_bpc-157_5-mg_suggested-59.png',
  tb500: 'vailchem_tb-500_5-mg_suggested-69.png',
  ghkcu: 'vailchem_ghk-cu_50-mg_suggested-89.png',
  selank: 'vailchem_selank_10-mg_suggested-49.png',
  semax: 'vailchem_semax_10-mg_suggested-49.png',
  epitalon: 'vailchem_epitalon_10-mg_suggested-49.png',
  motsc: 'vailchem_mots-c_10-mg_suggested-79.png',
  kisspeptin: 'vailchem_kisspeptin-10_10-mg_suggested-109.png',
  pt141: 'vailchem_pt-141_10-mg_suggested-59.png',
};

const products = [
  ['bpc-157-10mg', 'BPC-157', '10 MG', sourceImages.bpc],
  ['tb-500-5mg', 'TB-500', '5 MG', sourceImages.tb500],
  ['ghk-cu-50mg', 'GHK-Cu', '50 MG', sourceImages.ghkcu],
  ['ipamorelin-10mg', 'Ipamorelin', '10 MG', sourceImages.selank],
  ['cjc-1295-no-dac-5mg', 'CJC-1295', '5 MG', sourceImages.bpc, 'NO DAC'],
  ['mots-c-10mg', 'MOTS-c', '10 MG', sourceImages.motsc],
  ['selank-10mg', 'Selank', '10 MG', sourceImages.selank],
  ['sermorelin-2mg', 'Sermorelin', '2 MG', sourceImages.semax],
  ['ghrp-2-5mg', 'GHRP-2', '5 MG', sourceImages.tb500],
  ['ghrp-6-5mg', 'GHRP-6', '5 MG', sourceImages.tb500],
  ['hexarelin-2mg', 'Hexarelin', '2 MG', sourceImages.pt141],
  ['semax-30mg', 'Semax', '30 MG', sourceImages.semax],
  ['epitalon-50mg', 'Epitalon', '50 MG', sourceImages.epitalon],
  ['thymosin-alpha-1-5mg', 'Thymosin alpha-1', '5 MG', sourceImages.kisspeptin],
  ['dsip-5mg', 'DSIP', '5 MG', sourceImages.pt141],
  ['kpv-5mg', 'KPV', '5 MG', sourceImages.ghkcu],
];

const bundles = [
  {
    slug: 'recovery-stack',
    name: 'Recovery Stack',
    price: '$77',
    constituents: ['bpc-157-10mg', 'tb-500-5mg'],
  },
  {
    slug: 'gh-pulsatile-stack',
    name: 'GH Pulsatile Stack',
    price: '$70',
    constituents: ['cjc-1295-no-dac-5mg', 'ipamorelin-10mg'],
  },
  {
    slug: 'khavinson-stack',
    name: 'Khavinson Bioregulator Stack',
    price: '$125',
    constituents: ['epitalon-50mg', 'thymosin-alpha-1-5mg'],
  },
];

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nameText(name, subline) {
  const label = name.replace(' alpha-', ' \u03b1-');
  const upper = label.toUpperCase();

  if (subline) {
    return `
      <text x="337.5" y="481" text-anchor="middle" class="compound long">${escapeXml(upper)}</text>
      <text x="337.5" y="510" text-anchor="middle" class="compoundSub">${escapeXml(subline)}</text>
    `;
  }

  if (upper.length > 13) {
    const parts = upper.split(' ');
    return `
      <text x="337.5" y="478" text-anchor="middle" class="compound split">${escapeXml(parts[0])}</text>
      <text x="337.5" y="510" text-anchor="middle" class="compoundSub">${escapeXml(parts.slice(1).join(' '))}</text>
    `;
  }

  const klass =
    upper.length <= 4
      ? 'compound short'
      : upper.length <= 7
        ? 'compound'
        : upper.length <= 10
          ? 'compound medium'
          : 'compound long';

  return `<text x="337.5" y="493" text-anchor="middle" class="${klass}">${escapeXml(upper)}</text>`;
}

function productOverlay({ name, dose, subline }) {
  const labelPath =
    'M199 390 C228 378 447 378 476 390 C486 463 486 609 476 681 C447 693 228 693 199 681 C189 609 189 463 199 390 Z';
  const glassPath =
    'M174 377 C204 365 471 365 501 377 C512 454 512 617 501 692 C471 706 204 706 174 692 C163 617 163 454 174 377 Z';

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="675" height="900" viewBox="0 0 675 900">
  <defs>
    <linearGradient id="glassFill" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#060d11" stop-opacity="0.88"/>
      <stop offset="20%" stop-color="#071016" stop-opacity="0.91"/>
      <stop offset="50%" stop-color="#081116" stop-opacity="0.89"/>
      <stop offset="80%" stop-color="#071016" stop-opacity="0.91"/>
      <stop offset="100%" stop-color="#060d11" stop-opacity="0.88"/>
    </linearGradient>
    <linearGradient id="glassHighlight" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="46%" stop-color="#ffffff" stop-opacity="0.26"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="54%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="labelFade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="black"/>
      <stop offset="5%" stop-color="white"/>
      <stop offset="95%" stop-color="white"/>
      <stop offset="100%" stop-color="black"/>
    </linearGradient>
    <linearGradient id="labelInk" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#05090d" stop-opacity="0.97"/>
      <stop offset="18%" stop-color="#080d12" stop-opacity="0.99"/>
      <stop offset="50%" stop-color="#080d12" stop-opacity="0.99"/>
      <stop offset="82%" stop-color="#080d12" stop-opacity="0.99"/>
      <stop offset="100%" stop-color="#05090d" stop-opacity="0.97"/>
    </linearGradient>
    <linearGradient id="cylinderShade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.18"/>
      <stop offset="20%" stop-color="#000000" stop-opacity="0.04"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="80%" stop-color="#000000" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="surfaceGlare" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="47%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="54%" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="glassClip"><path d="${glassPath}"/></clipPath>
    <clipPath id="labelClip"><path d="${labelPath}"/></clipPath>
    <mask id="fadeMask" maskUnits="userSpaceOnUse" x="189" y="378" width="297" height="315">
      <rect x="189" y="378" width="297" height="315" fill="url(#labelFade)"/>
    </mask>
    <filter id="soften" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.45"/>
    </filter>
    <style>
      .brand { font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 5px; fill: #f2f4f1; }
      .compound { font-family: Arial, Helvetica, sans-serif; font-size: 39px; font-weight: 800; letter-spacing: 0; fill: #ffffff; }
      .compound.short { font-size: 44px; }
      .compound.medium { font-size: 34px; }
      .compound.long { font-size: 27px; }
      .compound.split { font-size: 27px; }
      .compoundSub { font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 0; fill: #f7f7f3; }
      .small { font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0; fill: #f5f5ef; }
      .micro { font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0; fill: #d8dedc; }
    </style>
  </defs>

  <g clip-path="url(#glassClip)">
    <path d="${glassPath}" fill="url(#glassFill)"/>
    <ellipse cx="337.5" cy="379" rx="158" ry="18" fill="#c8f6ff" opacity="0.08"/>
    <ellipse cx="337.5" cy="694" rx="158" ry="22" fill="#02070a" opacity="0.38"/>
    <rect x="194" y="382" width="18" height="306" rx="9" fill="#ffffff" opacity="0.018" filter="url(#soften)"/>
    <rect x="468" y="382" width="17" height="306" rx="8.5" fill="#ffffff" opacity="0.016" filter="url(#soften)"/>
    <rect x="318" y="375" width="39" height="323" fill="url(#glassHighlight)" opacity="0.12"/>
  </g>

  <g mask="url(#fadeMask)" clip-path="url(#labelClip)" transform="matrix(0.95 0 0 1 16.875 0)">
    <path d="${labelPath}" fill="url(#labelInk)"/>

    <g opacity="0.27" fill="none" stroke="#10a7c8" stroke-width="3" stroke-linecap="round">
      <path d="M394 432 C421 462 367 491 394 521 C421 551 367 580 394 611 C421 641 367 650 394 660"/>
      <path d="M418 432 C391 462 445 491 418 521 C391 551 445 580 418 611 C391 641 445 650 418 660"/>
      <path d="M394 459 H418 M388 493 H424 M392 527 H420 M389 561 H423 M392 596 H420 M390 628 H422"/>
    </g>

    <g opacity="0.2" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M260 565 284 551 308 565 308 594 284 608 260 594Z"/>
      <path d="M260 594 242 607v26"/>
      <path d="M308 594 326 607"/>
    </g>

    <rect x="241" y="423" width="14" height="14" rx="3" fill="none" stroke="#dfe9e8" stroke-width="2"/>
    <circle cx="248" cy="430" r="3.8" fill="#15a7cb"/>
    <text x="337.5" y="432" text-anchor="middle" class="brand">VIALCHEMLABS</text>
    ${nameText(name, subline)}
    <rect x="286" y="519" width="103" height="40" rx="6" fill="none" stroke="#dfe9e8" stroke-width="2.2"/>
    <text x="337.5" y="548" text-anchor="middle" style="font-family: Arial, Helvetica, sans-serif; font-size: 25px; font-weight: 800; letter-spacing: 0; fill: #ffffff;">${escapeXml(dose)}</text>
    <line x1="259" x2="416" y1="575" y2="575" stroke="#dfe9e8" stroke-width="1.4" opacity="0.8"/>
    <text x="337.5" y="602" text-anchor="middle" class="small">RESEARCH USE ONLY</text>
    <text x="337.5" y="627" text-anchor="middle" style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 800; fill: #62d9ef;">NOT FOR HUMAN USE</text>
    <text x="337.5" y="653" text-anchor="middle" class="micro">FOR LABORATORY RESEARCH ONLY</text>
  </g>

  <g clip-path="url(#glassClip)">
    <path d="${glassPath}" fill="url(#cylinderShade)" opacity="0.9"/>
    <rect x="310" y="376" width="55" height="318" fill="url(#surfaceGlare)" opacity="0.7"/>
  </g>
</svg>`);
}

async function bundleVialLayer(slug) {
  const input = await sharp(path.join(OUTPUT_DIR, `${slug}.png`))
    .extract({ left: 84, top: 106, width: 507, height: 710 })
    .resize(440, 616, { fit: 'cover' })
    .modulate({ brightness: 1.06, saturation: 1.08 })
    .png()
    .toBuffer();

  const mask = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="440" height="616" viewBox="0 0 440 616">
  <defs>
    <radialGradient id="fade" cx="50%" cy="54%" r="58%">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="66%" stop-color="white" stop-opacity="1"/>
      <stop offset="89%" stop-color="white" stop-opacity="0.56"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="440" height="616" fill="url(#fade)"/>
</svg>`);

  return sharp(input)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

function bundleBackdrop() {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <radialGradient id="floorGlow" cx="50%" cy="74%" r="46%">
      <stop offset="0%" stop-color="#18c7ea" stop-opacity="0.46"/>
      <stop offset="32%" stop-color="#0b6f89" stop-opacity="0.24"/>
      <stop offset="72%" stop-color="#03080d" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="topGlow" cx="50%" cy="32%" r="56%">
      <stop offset="0%" stop-color="#102d3a" stop-opacity="0.62"/>
      <stop offset="62%" stop-color="#061017" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floorLine" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#0ac4e8" stop-opacity="0"/>
      <stop offset="50%" stop-color="#0ac4e8" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#0ac4e8" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="70" height="70" patternUnits="userSpaceOnUse">
      <path d="M70 0H0V70" fill="none" stroke="#0bbfe2" stroke-opacity="0.14" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="900" fill="#020406"/>
  <rect width="1200" height="900" fill="url(#topGlow)"/>
  <rect y="540" width="1200" height="360" fill="url(#floorGlow)"/>
  <rect y="610" width="1200" height="260" fill="url(#grid)" opacity="0.42"/>
  <path d="M100 706H1100" stroke="url(#floorLine)" stroke-width="3"/>
  <path d="M212 690C320 650 470 633 600 633C730 633 880 650 988 690" fill="none" stroke="#1bd7f3" stroke-opacity="0.3" stroke-width="2"/>
  <g opacity="0.16" fill="none" stroke="#18c7ea" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M124 244 180 212l56 32v66l-56 32-56-32Z"/>
    <path d="M236 310 290 342v62"/>
    <path d="M180 212v-54"/>
    <path d="M980 220 1036 188l56 32v66l-56 32-56-32Z"/>
    <path d="M980 286 924 318v62"/>
    <path d="M1036 188v-54"/>
  </g>
</svg>`);
}

function bundleForeground(bundle) {
  const constituentLine = bundle.constituents
    .map((slug) => slug.replace(/-/g, ' ').toUpperCase())
    .join('  +  ');

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bottomShade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="55%" stop-color="#000000" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.76"/>
    </linearGradient>
    <linearGradient id="sideShade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.74"/>
      <stop offset="18%" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="50%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="82%" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.74"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#sideShade)"/>
  <rect y="540" width="1200" height="360" fill="url(#bottomShade)"/>
  <text x="80" y="86" style="font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 700; letter-spacing: 8px; fill: #f5f7f5;">VIALCHEMLABS</text>
  <text x="80" y="122" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 5px; fill: #20c7e7;">RESEARCH BUNDLE</text>
  <text x="80" y="770" style="font-family: Arial, Helvetica, sans-serif; font-size: 58px; font-weight: 800; letter-spacing: 0; fill: #ffffff;">${escapeXml(bundle.name)}</text>
  <text x="84" y="814" style="font-family: Arial, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: 4px; fill: #9bb4bb;">${escapeXml(constituentLine)}</text>
  <text x="1084" y="774" text-anchor="end" style="font-family: Arial, Helvetica, sans-serif; font-size: 58px; font-weight: 800; letter-spacing: 0; fill: #ffffff;">${escapeXml(bundle.price)}</text>
  <text x="1084" y="814" text-anchor="end" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 5px; fill: #20c7e7;">RUO ONLY  /  COA INCLUDED</text>
</svg>`);
}

async function generate() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(BUNDLE_OUTPUT_DIR, { recursive: true });

  for (const [slug, name, dose, source, subline] of products) {
    const basePath = path.join(SOURCE_DIR, source);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);

    await sharp(basePath)
      .composite([
        {
          input: productOverlay({ name, dose, subline }),
          blend: 'over',
        },
      ])
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outputPath);

    console.log(`wrote ${path.relative(ROOT, outputPath)}`);
  }

  for (const bundle of bundles) {
    const outputPath = path.join(BUNDLE_OUTPUT_DIR, `${bundle.slug}.png`);
    const [left, right] = await Promise.all(
      bundle.constituents.map((slug) => bundleVialLayer(slug)),
    );

    await sharp(bundleBackdrop(bundle))
      .composite([
        { input: left, left: 170, top: 130, blend: 'over' },
        { input: right, left: 555, top: 130, blend: 'over' },
        { input: bundleForeground(bundle), left: 0, top: 0, blend: 'over' },
      ])
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outputPath);

    console.log(`wrote ${path.relative(ROOT, outputPath)}`);
  }
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
