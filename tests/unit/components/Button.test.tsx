import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button, buttonClassNames } from "@/components/ui/Button";
import { findMarketingCopyViolation } from "@/lib/compliance";

// Phase 3 v4 — reusable className helper for non-<button> consumers (Link CTAs).
describe("buttonClassNames helper", () => {
  it("returns the same className the Button component renders for a given variant+size", () => {
    const { container } = render(
      <Button variant="primary" size="lg">
        x
      </Button>,
    );
    const buttonClass = container.querySelector("button")!.className;
    expect(buttonClassNames("primary", "lg")).toBe(buttonClass);
  });

  it("merges extra className via cn() (tailwind-merge dedup)", () => {
    const cls = buttonClassNames("outline", "md", "mt-4");
    expect(cls).toMatch(/mt-4/);
    expect(cls).toMatch(/border-\[var\(--border-strong\)\]/);
  });

  it("defaults to primary + md when both args omitted", () => {
    expect(buttonClassNames()).toBe(buttonClassNames("primary", "md"));
  });
});

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Add to research order</Button>);
    expect(
      screen.getByRole("button", { name: /add to research order/i }),
    ).toBeInTheDocument();
  });

  it("defaults to variant=primary and size=md", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole("button");
    // primary => uses --accent
    expect(btn.className).toMatch(/bg-\[var\(--accent\)\]/);
    // md size => h-10 px-4
    expect(btn.className).toMatch(/h-10/);
    expect(btn.className).toMatch(/px-4/);
  });

  it("applies primary variant classes", () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-\[var\(--accent\)\]/);
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/border/);
    expect(btn.className).toMatch(/bg-transparent/);
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/bg-transparent/);
    expect(btn.className).not.toMatch(/border-\[/);
  });

  it("applies data variant classes (mono font + surface-strong bg)", () => {
    render(<Button variant="data">SKU-001</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/font-mono/);
    expect(btn.className).toMatch(/bg-\[var\(--surface-strong\)\]/);
  });

  it("applies sm size classes", () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/h-8/);
    expect(btn.className).toMatch(/px-3/);
  });

  it("applies md size classes", () => {
    render(<Button size="md">Medium</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/h-10/);
    expect(btn.className).toMatch(/px-4/);
  });

  it("applies lg size classes", () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/h-12/);
    expect(btn.className).toMatch(/px-6/);
  });

  it("respects disabled prop", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toMatch(/disabled:opacity-50/);
    expect(btn.className).toMatch(/disabled:cursor-not-allowed/);
  });

  it("fires native onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Click me
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards arbitrary native props (type, aria-label, name)", () => {
    render(
      <Button type="submit" aria-label="Submit research order" name="cta">
        Submit
      </Button>,
    );
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.type).toBe("submit");
    expect(btn.getAttribute("aria-label")).toBe("Submit research order");
    expect(btn.name).toBe("cta");
  });

  it("merges external className over defaults", () => {
    render(<Button className="custom-thing">x</Button>);
    expect(screen.getByRole("button").className).toMatch(/custom-thing/);
  });

  it("forwards ref (React 19 ref-as-prop)", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>refed</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("uses compliant copy in test labels (sanity)", () => {
    // Sanity: nothing in this test file uses forbidden marketing patterns
    expect(findMarketingCopyViolation("Add to research order")).toBeNull();
  });

  // Phase 2 v4 — visual elevation additions per Phase 1 token additions
  describe("Phase 2 v4 — elevated visuals", () => {
    it("primary variant carries --shadow-sm on resting state", () => {
      render(<Button variant="primary">Primary</Button>);
      const btn = screen.getByRole("button");
      expect(btn.className).toMatch(/shadow-\[var\(--shadow-sm\)\]/);
    });

    it("primary variant lifts to --shadow-md on hover", () => {
      render(<Button variant="primary">Primary</Button>);
      const btn = screen.getByRole("button");
      expect(btn.className).toMatch(/hover:shadow-\[var\(--shadow-md\)\]/);
    });

    it("primary variant uses --accent-deep on active (pressed) state", () => {
      render(<Button variant="primary">Primary</Button>);
      const btn = screen.getByRole("button");
      expect(btn.className).toMatch(/active:bg-\[var\(--accent-deep\)\]/);
    });

    it('exposes new "success" variant for transactional confirmations', () => {
      render(<Button variant="success">Confirm</Button>);
      const btn = screen.getByRole("button");
      // success uses --accent-soft (lighter teal) to read as "ok / confirmed"
      // within Posture A; not a green-out (Iron Law 2.26 — no acid green).
      expect(btn.className).toMatch(/bg-\[var\(--accent-soft\)\]/);
    });

    it('exposes new "danger" variant for destructive transactional surfaces', () => {
      render(<Button variant="danger">Cancel order</Button>);
      const btn = screen.getByRole("button");
      // danger uses --pill-error (red); Phase 5 Dialog cancel-order + refund flows.
      expect(btn.className).toMatch(/bg-\[var\(--pill-error\)\]/);
    });

    it("Specs[ButtonVariant] union includes success + danger", async () => {
      const mod = await import("@/components/ui/Button");
      // Type-level smoke: render with both new variants without TS error
      const { container } = render(
        <>
          <mod.Button variant="success">ok</mod.Button>
          <mod.Button variant="danger">no</mod.Button>
        </>,
      );
      expect(container.querySelectorAll("button")).toHaveLength(2);
    });
  });
});
