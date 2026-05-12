import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sheet } from "@/components/ui/Sheet";

describe("Sheet", () => {
  it("does NOT render when open=false", () => {
    render(
      <Sheet open={false} onClose={() => {}} title="Mobile menu">
        <p>body</p>
      </Sheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when open=true", () => {
    render(
      <Sheet open onClose={() => {}} title="Mobile menu">
        <p>body</p>
      </Sheet>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("uses bottom-anchored layout (slide-from-bottom)", () => {
    render(
      <Sheet open onClose={() => {}} title="x" data-testid="sheet">
        <p>body</p>
      </Sheet>,
    );
    const sheet = screen.getByTestId("sheet");
    // Bottom-anchored: positioned at the bottom of the viewport
    expect(sheet.className).toMatch(/bottom-0/);
  });

  it("fires onClose on Escape key", () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} title="x">
        <p>body</p>
      </Sheet>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fires onClose on backdrop click", () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} title="x">
        <p>body</p>
      </Sheet>,
    );
    fireEvent.click(screen.getByTestId("sheet-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
