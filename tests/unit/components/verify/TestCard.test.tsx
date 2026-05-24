/**
 * TestCard — Iron Law 2.45 + accessibility unit tests.
 *
 * Iron Law 2.45: this component MUST NOT render any anchor that links
 * to janoshik.com / wuhanwansheng / any external lab portal. The
 * "External verification" CTA is a disabled placeholder reserved for a
 * future Vialchems-owned verification surface.
 */
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { TestCard } from "@/components/v2/verify/TestCard";
import type { ProductTest } from "@/lib/content/coa";

const AVAILABLE_PURITY: ProductTest = {
  available: true,
  testDate: "2026-05-21",
  pdfPath: "/coa/bpc-157-10mg-purity.pdf",
  thumbPath: "/coa-thumbnails/bpc-157-10mg-purity.png",
  resultSummary: "99.245%",
};

const PENDING_TEST: ProductTest = { available: false };

describe("TestCard — Iron Law 2.45 (no external lab links)", () => {
  it("does NOT render any anchor pointing at janoshik / wuhanwansheng", () => {
    const { container } = render(
      <TestCard
        test={AVAILABLE_PURITY}
        testKey="purity"
        productName="BPC-157 10mg"
      />,
    );
    const anchors = container.querySelectorAll("a");
    for (const a of anchors) {
      const href = a.getAttribute("href") ?? "";
      expect(
        href,
        `anchor href "${href}" must not link to lab portal`,
      ).not.toMatch(/janoshik|wuhanwansheng|wuhan|wansheng/i);
    }
  });

  it("renders the 'External verification — coming soon' placeholder as DISABLED", () => {
    render(
      <TestCard
        test={AVAILABLE_PURITY}
        testKey="purity"
        productName="BPC-157 10mg"
      />,
    );
    const placeholder = screen.getByText(/external verification.*coming soon/i);
    const button = placeholder.closest("button");
    expect(button).not.toBeNull();
    expect(button).toBeDisabled();
    expect(button?.getAttribute("aria-disabled")).toBe("true");
  });

  it("only renders the 'View Full Report' link for available tests with pdfPath", () => {
    render(
      <TestCard
        test={AVAILABLE_PURITY}
        testKey="purity"
        productName="BPC-157 10mg"
      />,
    );
    const link = screen.getByRole("link", {
      name: /view.*purity.*hplc.*report/i,
    });
    expect(link).toHaveAttribute("href", "/coa/bpc-157-10mg-purity.pdf");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("does NOT render the 'View Full Report' link when test is pending", () => {
    render(
      <TestCard
        test={PENDING_TEST}
        testKey="sterility"
        productName="BPC-157 10mg"
      />,
    );
    const link = screen.queryByRole("link", { name: /view.*report/i });
    expect(link).toBeNull();
    expect(screen.getByText(/report pending/i)).toBeInTheDocument();
  });
});

describe("TestCard — rendering each test type", () => {
  it("renders Purity (HPLC) with correct title + subtitle", () => {
    render(
      <TestCard
        test={AVAILABLE_PURITY}
        testKey="purity"
        productName="BPC-157 10mg"
      />,
    );
    expect(screen.getByText("Purity (HPLC)")).toBeInTheDocument();
    expect(
      screen.getByText("High-Performance Liquid Chromatography"),
    ).toBeInTheDocument();
  });

  it("renders Sterility with correct title + subtitle", () => {
    render(
      <TestCard
        test={{
          available: true,
          testDate: "2026-05-21",
          pdfPath: "/coa/bpc-157-10mg-sterility.pdf",
          thumbPath: "/coa-thumbnails/bpc-157-10mg-sterility.png",
          resultSummary: "PASS",
        }}
        testKey="sterility"
        productName="BPC-157 10mg"
      />,
    );
    expect(screen.getByText("Sterility")).toBeInTheDocument();
    expect(
      screen.getByText("Microbial Contamination Testing"),
    ).toBeInTheDocument();
  });

  it("renders Endotoxin with correct title + subtitle", () => {
    render(
      <TestCard
        test={{
          available: true,
          testDate: "2026-05-21",
          pdfPath: "/coa/bpc-157-10mg-endotoxin.pdf",
          thumbPath: "/coa-thumbnails/bpc-157-10mg-endotoxin.png",
          resultSummary: "<0.5 EU/mg",
        }}
        testKey="endotoxin"
        productName="BPC-157 10mg"
      />,
    );
    expect(screen.getByText("Endotoxin")).toBeInTheDocument();
    expect(screen.getByText("LAL Endotoxin Assay")).toBeInTheDocument();
  });

  it("renders Heavy Metals with correct title + subtitle", () => {
    render(
      <TestCard
        test={{
          available: true,
          testDate: "2026-05-21",
          pdfPath: "/coa/bpc-157-10mg-heavymetals.pdf",
          thumbPath: "/coa-thumbnails/bpc-157-10mg-heavymetals.png",
          resultSummary: "PASS",
        }}
        testKey="heavyMetals"
        productName="BPC-157 10mg"
      />,
    );
    expect(screen.getByText("Heavy Metals")).toBeInTheDocument();
    expect(
      screen.getByText("ICP-MS Heavy Metals Screening"),
    ).toBeInTheDocument();
  });

  it("shows 'Available' pill for available tests and 'Pending' for unavailable", () => {
    const { rerender } = render(
      <TestCard
        test={AVAILABLE_PURITY}
        testKey="purity"
        productName="BPC-157 10mg"
      />,
    );
    expect(screen.getByText("Available")).toBeInTheDocument();
    rerender(
      <TestCard
        test={PENDING_TEST}
        testKey="purity"
        productName="BPC-157 10mg"
      />,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("displays the result summary prominently for available tests", () => {
    render(
      <TestCard
        test={AVAILABLE_PURITY}
        testKey="purity"
        productName="BPC-157 10mg"
      />,
    );
    expect(screen.getByText("99.245%")).toBeInTheDocument();
  });
});
