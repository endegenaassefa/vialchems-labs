import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

let reducedMotionValue: boolean | null = false;
vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return {
    ...actual,
    useReducedMotion: () => reducedMotionValue,
  };
});

import { PlaceOrderButton } from "@/components/ui/PlaceOrderButton";

/**
 * Phase 7 (v4) — place-order button micro-interaction.
 *
 * On click: brief loading state (button disabled, spinner visible) before
 * resolving the user-supplied submit handler. Visual scale-on-press handled
 * by motion's whileTap (honors useReducedMotion per Iron Law 2.18).
 */

describe("PlaceOrderButton", () => {
  beforeEach(() => {
    reducedMotionValue = false;
    vi.useFakeTimers();
  });

  it("renders the children label by default", () => {
    render(
      <PlaceOrderButton onSubmit={() => {}}>Place order</PlaceOrderButton>,
    );
    expect(
      screen.getByRole("button", { name: /place order/i }),
    ).toBeInTheDocument();
  });

  it("shows aria-busy + a spinner when clicked, before invoking onSubmit", async () => {
    const submit = vi.fn();
    render(<PlaceOrderButton onSubmit={submit}>Place order</PlaceOrderButton>);
    const button = screen.getByRole("button", { name: /place order/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("place-order-spinner")).toBeInTheDocument();
    // submit fires after the visible loading delay
    expect(submit).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("forwards disabled prop and skips submission when disabled", () => {
    const submit = vi.fn();
    render(
      <PlaceOrderButton onSubmit={submit} disabled>
        Place order
      </PlaceOrderButton>,
    );
    const button = screen.getByRole("button", { name: /place order/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(submit).not.toHaveBeenCalled();
  });

  it("does not double-submit on rapid double click while loading", () => {
    const submit = vi.fn();
    render(<PlaceOrderButton onSubmit={submit}>Place order</PlaceOrderButton>);
    const button = screen.getByRole("button", { name: /place order/i });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(submit).toHaveBeenCalledTimes(1);
  });
});
