/**
 * Phase 9 (v4) — JSON-LD structured-data helpers per §7.5.
 *
 * Each helper returns a plain object suitable for embedding via
 *   <script type="application/ld+json"
 *           dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
 *
 * Strings are NOT pre-escaped here — the consumer's JSON.stringify handles
 * it. Use serializeJsonLdSafe() if you need </script>-safe output.
 */

export type SchemaContext = "https://schema.org";

export interface ProductJsonLd {
  "@context": SchemaContext;
  "@type": "Product";
  name: string;
  description: string;
  sku: string;
  brand?: { "@type": "Brand"; name: string };
  category?: string;
  offers?: {
    "@type": "Offer";
    url: string;
    priceCurrency: string;
    price: string;
    availability:
      | "https://schema.org/InStock"
      | "https://schema.org/OutOfStock";
    itemCondition?: "https://schema.org/NewCondition";
  };
}

export interface BreadcrumbJsonLd {
  "@context": SchemaContext;
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export interface ArticleJsonLd {
  "@context": SchemaContext;
  "@type": "Article";
  headline: string;
  description?: string;
  datePublished: string;
  author?: { "@type": "Organization"; name: string };
  mainEntityOfPage?: string;
}

export interface FaqPageJsonLd {
  "@context": SchemaContext;
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }>;
}

export interface OrganizationJsonLd {
  "@context": SchemaContext;
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
}

const SCHEMA: SchemaContext = "https://schema.org";

interface ProductInput {
  slug: string;
  name: string;
  shortName: string;
  sku: string;
  priceCents: number;
  dose: string;
  format: string;
  inStock: boolean;
  shortDescription: string;
  category?: string;
}

export function productJsonLd(p: ProductInput, baseUrl: string): ProductJsonLd {
  return {
    "@context": SCHEMA,
    "@type": "Product",
    name: p.name,
    description: p.shortDescription,
    sku: p.sku,
    brand: { "@type": "Brand", name: "vialchemlabs.net" },
    ...(p.category ? { category: p.category } : {}),
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${p.slug}`,
      priceCurrency: "USD",
      price: (p.priceCents / 100).toFixed(2),
      availability: p.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): BreadcrumbJsonLd {
  return {
    "@context": SCHEMA,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface ArticleInput {
  slug: string;
  title: string;
  summary?: string;
  publishedAt: string;
  author?: string;
}

export function articleJsonLd(a: ArticleInput, baseUrl: string): ArticleJsonLd {
  return {
    "@context": SCHEMA,
    "@type": "Article",
    headline: a.title,
    ...(a.summary ? { description: a.summary } : {}),
    datePublished: a.publishedAt,
    author: {
      "@type": "Organization",
      name: a.author ?? "vialchemlabs.net",
    },
    mainEntityOfPage: `${baseUrl}/blog/${a.slug}`,
  };
}

export function faqPageJsonLd(
  faqs: Array<{ q: string; a: string }>,
): FaqPageJsonLd {
  return {
    "@context": SCHEMA,
    "@type": "FAQPage",
    mainEntity: faqs.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}

export function organizationJsonLd(opts: {
  name: string;
  url: string;
  logo?: string;
}): OrganizationJsonLd {
  return {
    "@context": SCHEMA,
    "@type": "Organization",
    name: opts.name,
    url: opts.url,
    ...(opts.logo ? { logo: opts.logo } : {}),
  };
}

/**
 * Escape `</script>` sequences in serialized JSON so embedded payloads
 * cannot break out of <script type="application/ld+json"> blocks.
 */
export function serializeJsonLdSafe(payload: unknown): string {
  return JSON.stringify(payload).replace(/<\/(script)/gi, "<\\/$1");
}
