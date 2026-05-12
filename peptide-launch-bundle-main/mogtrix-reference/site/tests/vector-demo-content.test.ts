import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const demoRoot = path.resolve(process.cwd(), "../vector-bio-supply-demo");
const manifest = JSON.parse(
  fs.readFileSync(path.join(demoRoot, "manifest.json"), "utf8")
) as { pages: string[]; pageCount: number };

function readDemo(relative: string) {
  return fs.readFileSync(path.join(demoRoot, relative), "utf8");
}

function stripFragment(href: string) {
  return href.split("#")[0].split("?")[0];
}

describe("VECTOR BIO static demo artifact", () => {
  it("generates the required 28 HTML pages", () => {
    expect(manifest.pageCount).toBe(28);
    for (const page of manifest.pages) {
      expect(fs.existsSync(path.join(demoRoot, page))).toBe(true);
    }
  });

  it("renders required legal and consent text", () => {
    expect(readDemo("terms.html")).toContain("TERMS AND CONDITIONS OF SERVICE");
    expect(readDemo("terms.html")).toContain("BLACKLIST — ZERO-TOLERANCE POLICY");
    expect(readDemo("privacy.html")).toContain("Signed Material Transfer Agreement: Including typed name and digital signature.");
    expect(readDemo("shipping-and-returns.html")).toContain("Discreet packaging: outer label does not reference Vector Bio Supply Co. or the contents");
    expect(readDemo("refund-policy.html")).toContain("A $2,500 liquidated damages fee");
    expect(readDemo("mta.html")).toContain("MATERIAL TRANSFER AGREEMENT");
    expect(readDemo("affiliate.html")).toContain("AFFILIATE PROGRAM TERMS");
    expect(readDemo("checkout.html")).toContain("Review your agreements (17 items)");
  });

  it("keeps scripts local and avoids tracking scripts", () => {
    for (const page of manifest.pages) {
      const html = readDemo(page.slice(1));
      expect(html).toContain("DEMO BUILD - no analytics, no tracking, no real payments.");
      expect(html).not.toMatch(/<script[^>]+src=["']https?:/i);
      expect(html).not.toMatch(/gtag|google-analytics|facebook-pixel/i);
    }
  });

  it("does not leave broken internal hrefs in generated pages", () => {
    for (const page of manifest.pages) {
      const html = readDemo(page.slice(1));
      const dir = path.dirname(page.slice(1));
      const hrefs = [...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)].map(
        (match) => match[1]
      );

      for (const rawHref of hrefs) {
        if (/^(https?:|mailto:|tel:|#)/.test(rawHref)) continue;
        const cleanHref = stripFragment(rawHref);
        if (!cleanHref) continue;
        const resolved = path.resolve(demoRoot, dir, cleanHref);
        expect(
          fs.existsSync(resolved),
          `${page} points to missing ${rawHref}`
        ).toBe(true);
      }
    }
  });

  it("includes all product data, COA PDFs, and agreement records", () => {
    const dataSource = readDemo("js/catalog-data.js");
    for (const slug of [
      "semaglutide-5mg",
      "tirzepatide-10mg",
      "retatrutide-10mg",
      "bpc-157-5mg",
      "cagrilintide-5mg",
      "bacteriostatic-water-30ml"
    ]) {
      expect(dataSource).toContain(slug);
      expect(fs.existsSync(path.join(demoRoot, "products", `${slug}.html`))).toBe(true);
    }
    expect(fs.readdirSync(path.join(demoRoot, "assets/coa")).filter((name) => name.endsWith(".pdf"))).toHaveLength(6);
    expect(dataSource.match(/clauseRef/g)).toHaveLength(17);
  });
});
