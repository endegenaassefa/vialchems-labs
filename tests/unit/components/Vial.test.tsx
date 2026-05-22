import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

    it("withLabel=true throws on tesamorelin (Iron Law 2.7 — still-banned per v5 §2.29)", () => {
      expect(() => {
        render(<Vial withLabel compound="tesamorelin" dose="5mg" />);
      }).toThrow(/iron law 2.7/i);
    });

    it("withLabel=true throws on semaglutide (Iron Law 2.7 — FDA enforcement)", () => {
      expect(() => {
        render(<Vial withLabel compound="semaglutide" dose="10mg" />);
      }).toThrow(/iron law 2.7/i);
    });

    it("withLabel=true throws on bremelanotide (Iron Law 2.7 — Vyleesi-approved)", () => {
      expect(() => {
        render(<Vial withLabel compound="bremelanotide" dose="10mg" />);
      }).toThrow(/iron law 2.7/i);
    });

    it("withLabel=true with case variation also rejects still-banned compounds", () => {
      // Case-insensitive defense
      expect(() => {
        render(<Vial withLabel compound="Tesamorelin" dose="5mg" />);
      }).toThrow(/iron law 2.7/i);
      expect(() => {
        render(<Vial withLabel compound="SEMAGLUTIDE" dose="10mg" />);
      }).toThrow(/iron law 2.7/i);
    });

    // Post-2026-05-22 override: tirzepatide + retatrutide + klow now pass
    // both gates per docs/DECISIONS/iron_law_2_7_override_2026-05-22.md.
    it("withLabel=true renders for override-allowed 'Tirz' (post-2026-05-22)", () => {
      expect(() => {
        render(<Vial withLabel compound="Tirz" dose="25mg" />);
      }).not.toThrow();
    });

    it("withLabel=true renders for override-allowed 'Reta' (post-2026-05-22)", () => {
      expect(() => {
        render(<Vial withLabel compound="Reta" dose="10mg" />);
      }).not.toThrow();
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

// Iron Law 2.29 — Vial double-gate (static blocklist OVERRIDES catalog allowlist).
//
// Audit C5 STILL-APPLIES: components/ui/Vial.tsx auto-derives allowedCompounds
// from products.map. Supplemental S1 demonstrated concretely that when an
// operator added shortName='Reta'/'Tirz'/'KLOW' to products.ts, the
// catalog-only gate auto-allowed them.
//
// Phase 2.4 GREEN adds a SECOND gate inside assertCompoundAllowed that calls
// isBannedCompound() from lib/compliance/banned-compounds.ts. Even if a banned
// compound is added back to products.ts, Vial.tsx refuses to render.
//
// The RED tests below render <Vial compound={c} /> WITHOUT withLabel. Pre-GREEN,
// the validation gate (`if (withLabel && compound)`) is skipped entirely, so
// these renders silently succeed. Post-GREEN, the gate fires whenever
// `compound` is provided, regardless of withLabel — so banned and not-in-catalog
// compounds throw at render time even in unlabeled vials.
describe("Iron Law 2.29 — Vial double-gate (static blocklist + catalog allowlist)", () => {
  // These compounds remain banned post-2026-05-22 operator override (which
  // unbanned ONLY klow/reta/retatrutide/tirz/tirzepatide). The blocklist
  // MUST continue refusing all of these even if a future commit adds them
  // back to the catalog.
  const STATIC_BANNED = [
    "tesamorelin",
    "Tesamorelin",
    "TESAMORELIN",
    "melanotan",
    "Melanotan II",
    "PT-141",
    "Bremelanotide",
    "semaglutide",
    "bacteriostatic water",
    "BAC water",
    "SS-31",
    "ss-31",
    "elamipretide",
    "liraglutide",
    "dulaglutide",
  ];

  for (const compound of STATIC_BANNED) {
    it(`Vial throws for banned compound '${compound}' (blocklist gate)`, () => {
      expect(() => render(<Vial compound={compound} />)).toThrow(
        /Iron Law 2\.(7|29)/,
      );
    });
  }

  // Negative case: safe catalog compounds pass without throwing
  const SAFE_CATALOG = [
    "BPC-157",
    "TB-500",
    "GHK-Cu",
    "MOTS-c",
    "Selank",
    "Semax",
    "Ipamorelin",
  ];
  for (const compound of SAFE_CATALOG) {
    it(`Vial renders for safe catalog compound '${compound}'`, () => {
      expect(() => render(<Vial compound={compound} />)).not.toThrow();
    });
  }

  // Edge case: not-in-catalog AND not-in-blocklist
  it("Vial throws for arbitrary not-in-catalog string", () => {
    expect(() => render(<Vial compound="foobar-123" />)).toThrow(
      /Iron Law 2\.7/,
    );
  });

  // Edge case: empty / whitespace input — must be rejected as malformed
  it("Vial throws for empty compound", () => {
    expect(() => render(<Vial compound="" />)).toThrow();
  });

  it("Vial throws for whitespace-only compound", () => {
    expect(() => render(<Vial compound="   " />)).toThrow();
  });
});

// Interactive click handler coverage (lines 226-234) — ensures the click
// rotation accumulation + onClick forwarding both fire and that
// non-interactive vials only forward onClick without mutating rotation state.
describe("Vial — interactive click handler", () => {
  it("interactive=true: click forwards to onClick AND increments internal rotation (transform applied)", () => {
    const onClick = vi.fn();
    const { getByTestId } = render(
      <Vial interactive onClick={onClick} data-testid="vial" />,
    );
    const el = getByTestId("vial");

    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
    // After 1 click, the rotation transform inline-style should be applied.
    expect(el.getAttribute("style") ?? "").toMatch(/rotate\(360deg\)/);

    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(2);
    // After 2 clicks, rotation accumulates to 720deg.
    expect(el.getAttribute("style") ?? "").toMatch(/rotate\(720deg\)/);
  });

  it("interactive=false: click forwards to onClick but does NOT apply rotation transform", () => {
    const onClick = vi.fn();
    const { getByTestId } = render(
      <Vial onClick={onClick} data-testid="vial" />,
    );
    const el = getByTestId("vial");

    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(el.getAttribute("style") ?? "").not.toMatch(/rotate/);
  });

  it("interactive=true with no onClick: still increments rotation safely (no throw)", () => {
    const { getByTestId } = render(<Vial interactive data-testid="vial" />);
    const el = getByTestId("vial");

    expect(() => fireEvent.click(el)).not.toThrow();
    expect(el.getAttribute("style") ?? "").toMatch(/rotate\(360deg\)/);
  });
});

// Additional animation-class coverage (spin + bob lines 246-249).
describe("Vial — spin and bob animation classes", () => {
  it("applies vial-spin animation class when spin=true", () => {
    render(<Vial spin data-testid="vial" />);
    expect(screen.getByTestId("vial").className).toMatch(/vial-spin/);
  });

  it("applies vial-bob animation class when bob=true", () => {
    render(<Vial bob data-testid="vial" />);
    expect(screen.getByTestId("vial").className).toMatch(/vial-bob/);
  });

  it("interactive=true adds cursor-pointer + transition classes", () => {
    render(<Vial interactive data-testid="vial" />);
    const cls = screen.getByTestId("vial").className;
    expect(cls).toMatch(/cursor-pointer/);
    expect(cls).toMatch(/hover:scale/);
  });
});
