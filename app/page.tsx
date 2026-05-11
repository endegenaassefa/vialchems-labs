import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { buttonClassNames } from '@/components/ui/Button';
import { TrustTicker } from '@/components/ui/TrustTicker';
import { ComparativeTable } from '@/components/ui/ComparativeTable';
import { ProcessFlow } from '@/components/ui/ProcessFlow';
import { LabPartnerStrip } from '@/components/ui/LabPartnerStrip';
import { ProductStudioVisual } from '@/components/ui/ProductStudioVisual';
import { products, formatPrice, formatPerMg } from '@/lib/content/products';
import { siteConfig } from '@/lib/content/site';

/**
 * Home — v4 design overhaul.
 *
 * Replaces the previous "italic two-line hero + 3-column thesis cards +
 * Recovery Stack CTA" composition with a denser, more distinctive layout
 * borrowed from the v4 reference set:
 *
 *   - HERO: typography-only composition borrowed from aidesign-os.com (zero
 *     imagery; Plex Sans + Newsreader Italic carry everything) plus a
 *     biocollexresearch.com-style spaced-uppercase eyebrow + Plex Mono batch
 *     metadata tag. Iron Law 2.26: tagline "Counted, weighed, verified."
 *     remains verbatim, locked palette, locked type stack.
 *   - TRUST TICKER: borrowed verbatim in spirit from biocollexresearch.com's
 *     repeating trust banner. Charcoal bg, mono-uppercase claims, accent
 *     dividers. Marquee on md+, static stack on mobile, reduced-motion safe.
 *   - PURITY STANDARD: BioCollex-inspired full-width COA-emphasis section
 *     leading into a ComparativeTable (Titan-inspired "WITH vs WITHOUT")
 *     showing industry typical vs vialchemlabs standard.
 *   - PROCESS FLOW: Titan-inspired numbered 01-06 mono steps showing what
 *     every batch goes through.
 *   - RECOVERY STACK CTA: kept (it's already strong; just sits in a more
 *     paced page rhythm now).
 *   - LAB PARTNER STRIP: Composio-inspired logo strip; placeholder mode
 *     until additional lab relationships are confirmed.
 *   - NAMED ATTESTATION: Rogo/Titan-inspired pattern, placeholder mode for
 *     v4 launch (Iron Law 2.10 — no fake testimonials at launch).
 *
 * Section padding lifted to py-32/40/48 per Tier 1 plan to match the
 * reference set's breathing room (Rogo, Titan, Composio, AI Design OS).
 */

const TRUST_ITEMS = [
  'HPLC purity verified',
  'USP <71> sterility',
  'LAL endotoxin',
  'Third-party laboratory',
  '21+ qualified researchers',
  'US warehouse',
  'Same-business-day shipping',
];

const productCount = products.length;

const PURITY_ROWS = [
  {
    label: 'COA publication',
    industry:
      'Most vendors publish no Certificates of Analysis (only ≈11% of the 1,500-vendor universe publishes independent third-party COAs).',
    vialchemlabs:
      'Independent third-party lab testing with the COA published alongside the product. The data is on the table.',
  },
  {
    label: 'Identity & purity',
    industry:
      'In-house HPLC where reported, methodology often unstated, sometimes claimed without independent verification.',
    vialchemlabs:
      'Reverse-phase HPLC area-percent at 220nm through an independent third-party lab. Mass spectrometry available on request.',
  },
  {
    label: 'Sterility',
    industry: 'Rarely reported on research-grade peptides.',
    vialchemlabs:
      'USP <71> broth-based growth assay (Fluid Thioglycollate + Soybean-Casein Digest). 14-day incubation. PASS/FAIL reporting.',
  },
  {
    label: 'Endotoxin',
    industry:
      'Almost never reported; when reported, often as a single threshold number with no methodology.',
    vialchemlabs:
      'Limulus Amebocyte Lysate gel-clot in EU/mg. Numeric concentration with assay sensitivity limit.',
  },
  {
    label: 'Batch traceability',
    industry:
      'Mixed; aggregated lot reports common; vial number sometimes does not resolve to a specific COA.',
    vialchemlabs:
      'The number on the vial resolves to a published COA, on the order confirmation, and through the lab’s portal.',
  },
  {
    label: 'Two-tier risk',
    industry:
      'Tested-vs-shipped batches sometimes diverge; no enforcement mechanism for buyers.',
    vialchemlabs:
      'No two-tier system. The COA is the receipt for the vial in hand.',
  },
];

const PROCESS_STEPS = [
  {
    n: 1,
    title: 'Sourced',
    description:
      'Synthesized at GMP-licensed facility against the canonical sequence; release documents reviewed before warehouse intake.',
  },
  {
    n: 2,
    title: 'Sampled',
    description:
      'Sample drawn under chain-of-custody and shipped to an independent third-party laboratory for test.',
  },
  {
    n: 3,
    title: 'Tested',
    description:
      'HPLC area-percent purity, USP <71> sterility, LAL endotoxin in EU/mg. Mass spec available on request.',
  },
  {
    n: 4,
    title: 'Published',
    description:
      'COA posted to /coa with batch number, test date, and methodology so the data is on file.',
  },
  {
    n: 5,
    title: 'Lyophilized & vialed',
    description:
      'Pharmaceutical-grade lyophilization, vialed and labeled with batch number that resolves to the published COA.',
  },
  {
    n: 6,
    title: 'Shipped',
    description:
      'Same-business-day on US orders before 3pm Mon-Fri via USPS Priority or FedEx 2-Day, tracked end-to-end.',
  },
];

/* v1.3 — operator override per Iron Law 2.26 — removed specific lab names.
 * The methods strip below presents the testing methodology rather than the
 * partner identity. Operator may re-introduce named partners by editing
 * this array OR by using the LAB_PARTNER_NAME env override system. */
const TEST_METHODS = [
  { name: 'HPLC', caption: 'Identity + purity · 220nm', primary: true },
  { name: 'USP <71>', caption: 'Sterility · 14-day broth' },
  { name: 'LAL', caption: 'Endotoxin · gel-clot' },
  { name: 'Mass Spec', caption: 'Confirmation · on request' },
];

const FEATURED_PRODUCT_SLUGS = [
  'ghk-cu-50mg',
  'tb-500-5mg',
  'mots-c-10mg',
  'selank-10mg',
  'bpc-157-10mg',
  'ipamorelin-10mg',
];

export default function HomePage() {
  const heroProduct =
    products.find((product) => product.slug === 'ghk-cu-50mg') ?? products[0];
  const featuredProducts = FEATURED_PRODUCT_SLUGS.map((slug) =>
    products.find((product) => product.slug === slug),
  ).filter((product): product is (typeof products)[number] => Boolean(product));

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO — split storefront layout with studio vial imagery as the
            visual centerpiece. */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-32 md:py-40">
            <div className="grid gap-12 lg:grid-cols-[3fr_2fr] items-center">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-8">
                  R E S E A R C H · P E P T I D E S
                </p>
                <h1 className="text-[clamp(44px,6.4vw,88px)] font-semibold leading-[1.0] tracking-tight text-[var(--text)] mb-10">
                  <span className="block">Counted, weighed,</span>
                  <span className="block text-[var(--accent-soft)]">
                    verified.
                  </span>
                </h1>
                <p className="text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-[var(--text-muted)] max-w-xl mb-8">
                  {siteConfig.name} supplies research peptides with one
                  differentiator:{' '}
                  <span className="text-[var(--text)]">independent third-party verification</span>
                  , and the Certificate of Analysis is published alongside
                  every product. No lifestyle imagery. No hype. No claims.
                  Data, on file.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/shop" className={buttonClassNames('primary', 'lg')}>
                    Browse Catalog
                  </Link>
                  <Link href="/coa" className={buttonClassNames('outline', 'lg')}>
                    View Certificates of Analysis
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="aspect-[4/5] w-full max-w-[380px] overflow-hidden rounded-[2px] border border-white/10 bg-black shadow-[0_34px_80px_rgba(0,0,0,0.72)]">
                  <ProductStudioVisual
                    product={heroProduct}
                    batch="2026-05"
                    priority
                    sizes="380px"
                    className="h-full w-full"
                    fallbackClassName="scale-[0.94]"
                  />
                </div>
                {/* Static product-photo treatment: no sway/spin/bob controls. */}
              </div>
            </div>
          </div>
        </section>

        {/* TRUST TICKER */}
        <TrustTicker items={TRUST_ITEMS} />

        {/* FEATURED PRODUCTS — v1.3 BioCollex-inspired dense product row.
            Shows 6 SKUs as compact tile-cards with the new labeled vial,
            linking to PDPs. Carousel-style horizontal scroll on small
            viewports; grid on desktop. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-4">
                  P O P U L A R · P R O D U C T S
                </p>
                <h2 className="text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.1] tracking-tight text-[var(--text)] max-w-2xl">
                  {productCount} research peptides. Independent third-party verification.
                </h2>
              </div>
              <Link
                href="/shop"
                className={buttonClassNames('outline', 'md')}
              >
                View all {productCount} SKUs →
              </Link>
            </div>
            <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {featuredProducts.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group/product block h-full"
                  >
                    <Card
                      as="article"
                      variant="interactive"
                      className="h-full overflow-hidden p-0 flex flex-col"
                    >
                      <ProductStudioVisual
                        product={product}
                        sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                        className="aspect-[4/5] border-b border-[var(--border)]"
                        fallbackClassName="scale-[0.9]"
                      />
                      <div className="flex flex-1 flex-col items-center p-4 text-center">
                        <Pill variant="accent" className="mb-2">
                          In stock
                        </Pill>
                        <h3 className="text-[14px] font-semibold text-[var(--text)] leading-tight mb-1 group-hover/product:text-[var(--accent-soft)] transition-colors">
                          {product.shortName}
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-subtle)] mb-3">
                          {product.dose}
                        </p>
                        <p className="font-mono tabular text-[16px] font-semibold text-[var(--text)]">
                          {formatPrice(product.listPriceCents)}
                        </p>
                        <p className="font-mono text-[10px] text-[var(--text-subtle)]">
                          {formatPerMg(product.perMgCents)}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PURITY STANDARD — BioCollex-inspired full-width COA-emphasis +
            ComparativeTable. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              P U R I T Y · S T A N D A R D
            </p>
            <h2 className="text-[clamp(36px,6vw,76px)] font-semibold leading-[1.05] tracking-tight text-[var(--text)] mb-8">
              <span className="block">Third-party verified.</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                Published, on file.
              </span>
            </h2>
            <p className="text-[18px] leading-[1.55] text-[var(--text-muted)] max-w-3xl mb-16">
              The research-peptide industry has never had consistent
              third-party testing as a standard. Most vendors publish no
              Certificates of Analysis. Some publish claimed COAs without
              independent verification. We do the third thing — independent
              testing through a third-party laboratory, with the Certificate
              of Analysis published alongside the product.
            </p>
            <ComparativeTable
              eyebrow="Side by side"
              caption="Industry standard vs vialchemlabs standard for COA testing"
              rows={PURITY_ROWS}
            />
          </div>
        </section>

        {/* PROCESS FLOW — Titan-inspired numbered mono steps. */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
            <ProcessFlow
              eyebrow="From synthesis to ship"
              headline="The pipeline from sample draw to your bench."
              steps={PROCESS_STEPS}
              layout="vertical"
            />
          </div>
        </section>

        {/* v1.3.1 — "Featured Pairing" Recovery Stack CTA section removed
            from home per operator. Recovery Stack remains discoverable via
            /shop (renders as the bundle card at the top of the catalog) and
            /products/recovery-stack. */}

        {/* TEST METHODS STRIP — v1.3 lab-agnostic. Replaces the previous
            named-lab-partner strip with the methodology surface (operator
            override per Iron Law 2.26 — no specific lab affiliation in UI). */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <LabPartnerStrip
              eyebrow="Independent verification — methods we test for"
              partners={TEST_METHODS}
            />
            <p className="mt-6 text-[13px] text-[var(--text-subtle)] leading-[1.6] max-w-3xl">
              Tests are run by an independent third-party laboratory under
              chain-of-custody. The Certificate of Analysis is published per
              batch on /coa with the methodology and result.
            </p>
          </div>
        </section>

        {/* v1.3.2 — "We ship with no testimonials" section removed per
            operator. Iron Law 2.10 still bars adding fake testimonials;
            real ones populate organically through the qualification-gated
            buyer base. Until then, no surface. */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-6">
              T H E · S T A N D A R D
            </p>
            <h2 className="text-[32px] md:text-[40px] font-semibold leading-tight tracking-tight text-[var(--text)] mb-6">
              <span className="block">Research peptides,</span>
              <span className="font-serif-italic block text-[var(--accent-soft)]">
                independently verified.
              </span>
            </h2>
            <p className="text-[16px] text-[var(--text-muted)] leading-[1.65] mb-10">
              Third-party HPLC purity, USP &lt;71&gt; sterility, and LAL
              endotoxin testing. The Certificate of Analysis is published
              alongside the product so the data is on the table — not
              behind a sales call.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/coa" className={buttonClassNames('primary', 'lg')}>
                Browse Certificates
              </Link>
              <Link href="/test-reports" className={buttonClassNames('outline', 'lg')}>
                Testing standard
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
