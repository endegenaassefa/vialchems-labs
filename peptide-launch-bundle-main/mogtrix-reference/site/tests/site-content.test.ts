import { describe, expect, it } from "vitest";

import {
  footerExploreLinks,
  footerPolicyLinks,
  sharedResearchLinks,
  siteConfig
} from "@/lib/content/site";

describe("site navigation and support content", () => {
  it("keeps shared research support routes available to storefront pages", () => {
    expect(sharedResearchLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/coa", label: "COA Library" }),
        expect.objectContaining({ href: "/testing", label: "Testing" }),
        expect.objectContaining({ href: "/faq", label: "FAQ" })
      ])
    );
  });

  it("defines footer sections that match the hybrid storefront surfaces", () => {
    expect(footerExploreLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/shop", label: "Shop" }),
        expect.objectContaining({ href: "/coa", label: "COA Library" })
      ])
    );
    expect(footerPolicyLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/legal/terms", label: "Terms of Service" }),
        expect.objectContaining({
          href: "/legal/shipping",
          label: "Shipping, Refunds & Returns"
        })
      ])
    );
    expect(siteConfig.description.toLowerCase()).toContain("private research-use-only storefront");
  });
});
