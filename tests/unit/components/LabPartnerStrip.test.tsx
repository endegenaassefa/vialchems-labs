import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LabPartnerStrip } from "@/components/ui/LabPartnerStrip";

describe("LabPartnerStrip", () => {
  // v1.3 — component is now used in lab-agnostic mode (test methods strip
  // rather than named partners). Test data uses methodology names.
  const partners = [
    { name: "HPLC", caption: "Identity + purity", primary: true },
    { name: "USP <71>", caption: "Sterility" },
  ];

  it("renders all partner names and captions", () => {
    render(<LabPartnerStrip partners={partners} />);
    expect(screen.getByText("HPLC")).toBeInTheDocument();
    expect(screen.getByText("Identity + purity")).toBeInTheDocument();
    expect(screen.getByText("USP <71>")).toBeInTheDocument();
  });

  it('marks the primary partner with a "Day 1 default" tag', () => {
    render(<LabPartnerStrip partners={partners} />);
    expect(screen.getByText("Day 1 default")).toBeInTheDocument();
  });

  it("renders the default eyebrow when none is provided", () => {
    render(<LabPartnerStrip partners={partners} />);
    expect(screen.getByText("Independent verification")).toBeInTheDocument();
  });

  it("renders a custom eyebrow when provided", () => {
    render(<LabPartnerStrip partners={partners} eyebrow="Lab universe" />);
    expect(screen.getByText("Lab universe")).toBeInTheDocument();
  });

  it("renders one li per partner", () => {
    const { container } = render(<LabPartnerStrip partners={partners} />);
    const items = container.querySelectorAll("li");
    expect(items.length).toBe(2);
  });
});
