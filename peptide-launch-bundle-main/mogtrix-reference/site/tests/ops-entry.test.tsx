import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComplianceFooter } from "@/components/compliance-footer";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as opsLoginMetadata } from "@/app/ops/login/page";
import { metadata as opsProtectedMetadata } from "@/app/ops/(protected)/layout";

describe("ops entry visibility", () => {
  it("exposes a staff footer link without listing ops in the sitemap", () => {
    render(<ComplianceFooter />);

    expect(screen.getByRole("link", { name: "Staff" })).toHaveAttribute("href", "/ops");
    expect(sitemap().some((entry) => entry.url.includes("/ops"))).toBe(false);
    expect(JSON.stringify(robots())).toContain("/ops");
  });

  it("marks ops pages as noindex", () => {
    expect(opsLoginMetadata.robots).toMatchObject({ index: false, follow: false });
    expect(opsProtectedMetadata.robots).toMatchObject({ index: false, follow: false });
  });
});
