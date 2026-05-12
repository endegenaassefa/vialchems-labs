import { describe, expect, it } from "vitest";
import {
  productJsonLd,
  breadcrumbJsonLd,
  articleJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
} from "@/lib/seo/jsonLd";

/**
 * Phase 9 (v4) — JSON-LD structured data per §7.5.
 *
 * Helpers must emit schema.org-conforming payloads, escape strings safely
 * (no raw </script> sequences), and be deterministic so cached responses
 * are byte-stable.
 */

const BASE = "https://vialchemlabs.net";

describe("productJsonLd", () => {
  it("emits a schema.org Product with offers (price, currency, availability)", () => {
    const out = productJsonLd(
      {
        slug: "bpc-157-10mg",
        name: "BPC-157, 10mg vial",
        shortName: "BPC-157",
        sku: "BPC-157-10MG",
        priceCents: 5400,
        dose: "10mg",
        format: "vial",
        inStock: true,
        shortDescription: "Gastric-protective peptide research reference.",
      },
      BASE,
    );
    expect(out["@context"]).toBe("https://schema.org");
    expect(out["@type"]).toBe("Product");
    expect(out.name).toBe("BPC-157, 10mg vial");
    expect(out.sku).toBe("BPC-157-10MG");
    expect(out.brand?.["@type"]).toBe("Brand");
    expect(out.offers?.["@type"]).toBe("Offer");
    expect(out.offers?.price).toBe("54.00");
    expect(out.offers?.priceCurrency).toBe("USD");
    expect(out.offers?.availability).toBe("https://schema.org/InStock");
    expect(out.offers?.url).toBe(`${BASE}/products/bpc-157-10mg`);
  });

  it("reports OutOfStock availability when inStock is false", () => {
    const out = productJsonLd(
      {
        slug: "tb-500-5mg",
        name: "TB-500, 5mg vial",
        shortName: "TB-500",
        sku: "TB-500-5MG",
        priceCents: 3400,
        dose: "5mg",
        format: "vial",
        inStock: false,
        shortDescription: "...",
      },
      BASE,
    );
    expect(out.offers?.availability).toBe("https://schema.org/OutOfStock");
  });
});

describe("breadcrumbJsonLd", () => {
  it("emits BreadcrumbList with sequential positions", () => {
    const out = breadcrumbJsonLd([
      { name: "Home", url: BASE + "/" },
      { name: "Shop", url: BASE + "/shop" },
      { name: "BPC-157", url: BASE + "/products/bpc-157-10mg" },
    ]);
    expect(out["@type"]).toBe("BreadcrumbList");
    expect(out.itemListElement).toHaveLength(3);
    expect(out.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE + "/",
    });
    expect(out.itemListElement[2].position).toBe(3);
  });
});

describe("articleJsonLd", () => {
  it("emits Article with headline + datePublished + author + url", () => {
    const out = articleJsonLd(
      {
        slug: "reading-a-coa",
        title: "Reading a Certificate of Analysis",
        summary:
          "How HPLC purity, USP <71> sterility, and LAL endotoxin tests work.",
        publishedAt: "2026-04-12",
        author: "vialchemlabs Research",
      },
      BASE,
    );
    expect(out["@type"]).toBe("Article");
    expect(out.headline).toBe("Reading a Certificate of Analysis");
    expect(out.datePublished).toBe("2026-04-12");
    expect(out.author?.["@type"]).toBe("Organization");
    expect(out.author?.name).toBe("vialchemlabs Research");
    expect(out.mainEntityOfPage).toBe(`${BASE}/blog/reading-a-coa`);
  });
});

describe("faqPageJsonLd", () => {
  it("emits FAQPage with Question/Answer mainEntity items", () => {
    const out = faqPageJsonLd([
      { q: "What is RUO?", a: "Research Use Only." },
      { q: "Do you ship to CA?", a: "No." },
    ]);
    expect(out["@type"]).toBe("FAQPage");
    expect(out.mainEntity).toHaveLength(2);
    expect(out.mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: "What is RUO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Research Use Only.",
      },
    });
  });
});

describe("organizationJsonLd", () => {
  it("emits Organization with name + url + logo when supplied", () => {
    const out = organizationJsonLd({
      name: "vialchemlabs",
      url: BASE,
      logo: `${BASE}/icon.svg`,
    });
    expect(out["@type"]).toBe("Organization");
    expect(out.name).toBe("vialchemlabs");
    expect(out.url).toBe(BASE);
    expect(out.logo).toBe(`${BASE}/icon.svg`);
  });
});
