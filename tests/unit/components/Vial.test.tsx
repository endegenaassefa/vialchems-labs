import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Vial } from "@/components/ui/Vial";

describe("Vial", () => {
  it("renders a root element", () => {
    render(<Vial data-testid="vial" />);
    expect(screen.getByTestId("vial")).toBeInTheDocument();
  });

  it("renders SVG markup (clean clinical, not an emoji)", () => {
    const { container } = render(<Vial />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it('defaults to size="md"', () => {
    render(<Vial data-testid="vial" />);
    const vial = screen.getByTestId("vial");
    expect(vial.className).toMatch(/w-/);
  });

  // v1.3 — size classes refined to 50:22 aspect (real product proportions).
  // Updated assertions to match new sizes: sm=w-7, md=w-10, lg=w-14.
  // Added xl + 2xl for hero showcase contexts.
  it('applies size="sm" classes', () => {
    render(<Vial size="sm" data-testid="vial" />);
    expect(screen.getByTestId("vial").className).toMatch(/w-7/);
  });

  it('applies size="md" classes', () => {
    render(<Vial size="md" data-testid="vial" />);
    expect(screen.getByTestId("vial").className).toMatch(/w-10/);
  });

  it('applies size="lg" classes', () => {
    render(<Vial size="lg" data-testid="vial" />);
    expect(screen.getByTestId("vial").className).toMatch(/w-14/);
  });

  it('applies size="xl" classes (hero showcase)', () => {
    render(<Vial size="xl" data-testid="vial" />);
    expect(screen.getByTestId("vial").className).toMatch(/w-20/);
  });

  it('applies size="2xl" classes (grand showcase)', () => {
    render(<Vial size="2xl" data-testid="vial" />);
    expect(screen.getByTestId("vial").className).toMatch(/w-28/);
  });

  it("does NOT apply sway animation by default", () => {
    render(<Vial data-testid="vial" />);
    expect(screen.getByTestId("vial").className).not.toMatch(/animate.*sway/);
  });

  it("applies sway animation class when sway=true", () => {
    render(<Vial sway data-testid="vial" />);
    const vial = screen.getByTestId("vial");
    // class should reference the keyframe name vial-sway from globals.css
    expect(vial.className).toMatch(/vial-sway/);
  });

  it("applies aria-hidden when explicitly hidden", () => {
    render(<Vial aria-hidden data-testid="vial" />);
    expect(screen.getByTestId("vial").getAttribute("aria-hidden")).toBe("true");
  });

  it("does NOT carry aria-hidden by default", () => {
    render(<Vial data-testid="vial" />);
    // Components are not aria-hidden by default; consumer decides.
    expect(screen.getByTestId("vial").getAttribute("aria-hidden")).not.toBe(
      "true",
    );
  });

  it("does not render the green-liquid anti-pattern (only cream powder)", () => {
    // Sanity: the SVG fill should reference cream / powder color, not a
    // saturated green liquid. We assert no fill="#00ff00" / "lime" / "green".
    const { container } = render(<Vial />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/lime/i);
    expect(html).not.toMatch(/#00ff00/i);
    expect(html).not.toMatch(/fill="green"/i);
  });

  // Phase 2 v4 — withLabel overlay per Appendix AD operator-supplied vial
  // reference image. Renders the wrap-label SVG composition (VIALCHEMLABS
  // wordmark + compound + dose + verbatim Appendix A.2 RUO disclaimer + QR).
  describe("Phase 2 v4 — withLabel overlay (Appendix AD)", () => {
    it("default (withLabel undefined/false) renders no label content — preserves existing usages", () => {
      const { container } = render(<Vial />);
      // No VIALCHEMLABS wordmark, no compound text, no RUO disclaimer
      expect(container.textContent).not.toMatch(/VIALCHEMLABS/i);
      expect(container.textContent).not.toMatch(/research use only/i);
    });

    it("withLabel=true renders VIALCHEMLABS wordmark on the SVG label", () => {
      const { container } = render(
        <Vial withLabel compound="BPC-157" dose="10mg" />,
      );
      expect(container.textContent).toMatch(/VIALCHEMLABS/);
    });

    it("withLabel=true renders the compound prop value", () => {
      const { container } = render(
        <Vial withLabel compound="BPC-157" dose="10mg" />,
      );
      expect(container.textContent).toContain("BPC-157");
    });

    it("withLabel=true renders the dose prop value", () => {
      const { container } = render(
        <Vial withLabel compound="BPC-157" dose="10mg" />,
      );
      // v1.3 — dose is rendered uppercase on the label for parity with the
      // physical product label visual (Appendix AD §1).
      expect(container.textContent).toMatch(/10\s?mg/i);
    });

    it("withLabel=true renders the RUO disclaimer (matches verbatim Appendix A.2 family)", () => {
      const { container } = render(
        <Vial withLabel compound="BPC-157" dose="10mg" />,
      );
      expect(container.textContent).toMatch(/RESEARCH USE ONLY/i);
      expect(container.textContent).toMatch(/NOT FOR HUMAN/i);
    });

    it("withLabel=true renders QR-code marker placeholder (corner finders)", () => {
      const { container } = render(
        <Vial withLabel compound="BPC-157" dose="10mg" />,
      );
      // Hand-rolled QR placeholder: 3 position-finder squares (corner brackets)
      // identifiable by data-attribute
      expect(container.querySelector("[data-vial-qr]")).toBeInTheDocument();
    });

    it("withLabel=true throws on tirzepatide (Iron Law 2.7 — perpetual ITC GEO)", () => {
      expect(() => {
        render(<Vial withLabel compound="tirzepatide" dose="10mg" />);
      }).toThrow(/iron law 2.7/i);
    });

    it("withLabel=true throws on semaglutide (Iron Law 2.7 — FDA enforcement)", () => {
      expect(() => {
        render(<Vial withLabel compound="semaglutide" dose="10mg" />);
      }).toThrow(/iron law 2.7/i);
    });

    it("withLabel=true throws on retatrutide (Iron Law 2.7 — 90-day FDA carve-out)", () => {
      expect(() => {
        render(<Vial withLabel compound="retatrutide" dose="10mg" />);
      }).toThrow(/iron law 2.7/i);
    });

    it("withLabel=true with case variation also rejects banned compounds", () => {
      // Case-insensitive defense: "Tirzepatide" and "TIRZEPATIDE" both blocked.
      expect(() => {
        render(<Vial withLabel compound="Tirzepatide" dose="10mg" />);
      }).toThrow(/iron law 2.7/i);
      expect(() => {
        render(<Vial withLabel compound="SEMAGLUTIDE" dose="10mg" />);
      }).toThrow(/iron law 2.7/i);
    });

    it("outer wrapper carries --shadow-md drop-shadow filter for depth", () => {
      render(<Vial data-testid="vial" />);
      const vial = screen.getByTestId("vial");
      expect(vial.className).toMatch(/drop-shadow-\[var\(--shadow-md\)\]/);
    });

    it("reduced-motion fallback still works on withLabel variant (sway animation respects prefers-reduced-motion via globals.css)", () => {
      // The animation class is unchanged by withLabel; reduced-motion fallback
      // is enforced globally via @media (prefers-reduced-motion: reduce) in
      // globals.css:165-172. We assert the class is applied so the global rule
      // can override it.
      render(
        <Vial
          sway
          withLabel
          compound="BPC-157"
          dose="10mg"
          data-testid="vial"
        />,
      );
      expect(screen.getByTestId("vial").className).toMatch(/vial-sway/);
    });
  });
});
