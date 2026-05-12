import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("private catalog boundary", () => {
  it("keeps gated catalog pages out of the sitemap", () => {
    const entries = sitemap().map((entry) => entry.url);

    expect(entries.some((url) => url.endsWith("/shop"))).toBe(false);
    expect(entries.some((url) => url.includes("/products/"))).toBe(false);
  });

  it("disallows gated catalog pages to crawlers", () => {
    const robotRules = robots().rules;
    const rules = Array.isArray(robotRules) ? robotRules : [robotRules];
    const publicRule = rules.find((rule) => rule.userAgent === "*");

    expect(publicRule).toBeDefined();
    expect(JSON.stringify(publicRule)).toContain("/shop");
    expect(JSON.stringify(publicRule)).toContain("/products/");
    expect(JSON.stringify(publicRule)).not.toContain('"allow":["/","/shop","/products/');
  });
});
