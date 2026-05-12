import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Toast } from "@/components/ui/Toast";

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the message", () => {
    render(<Toast message="Added to research order" />);
    expect(screen.getByText(/added to research order/i)).toBeInTheDocument();
  });

  it('uses role="alert" + aria-live="polite" for AT announcement', () => {
    render(<Toast message="ok" />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert.getAttribute("aria-live")).toBe("polite");
  });

  it("renders a dismiss button with accessible label", () => {
    render(<Toast message="ok" onDismiss={() => {}} />);
    expect(
      screen.getByRole("button", { name: /dismiss/i }),
    ).toBeInTheDocument();
  });

  it("fires onDismiss when dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    render(<Toast message="ok" onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("auto-dismisses after the default 4s duration", () => {
    const onDismiss = vi.fn();
    render(<Toast message="ok" onDismiss={onDismiss} />);
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not auto-dismiss when duration={0}", () => {
    const onDismiss = vi.fn();
    render(<Toast message="ok" onDismiss={onDismiss} duration={0} />);
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('applies tone="success" classes (accent-soft)', () => {
    render(<Toast message="ok" tone="success" data-testid="toast" />);
    expect(screen.getByTestId("toast").className).toMatch(
      /border-\[var\(--accent-soft\)\]/,
    );
  });

  it('applies tone="error" classes (pill-error)', () => {
    render(<Toast message="ok" tone="error" data-testid="toast" />);
    expect(screen.getByTestId("toast").className).toMatch(
      /border-\[var\(--pill-error\)\]/,
    );
  });
});
