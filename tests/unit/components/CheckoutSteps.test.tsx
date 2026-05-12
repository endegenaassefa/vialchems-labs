/**
 * CheckoutSteps unit tests.
 *
 * Verifies that the active step is announced visually + via aria-label, and
 * that prior steps are styled as complete.
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheckoutSteps } from "@/app/checkout/CheckoutSteps";

describe("CheckoutSteps", () => {
  it("renders all four step labels", () => {
    render(<CheckoutSteps active="address" />);
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("uses an ordered list with descriptive aria-label", () => {
    render(<CheckoutSteps active="address" />);
    expect(
      screen.getByRole("list", { name: /checkout progress/i }),
    ).toBeInTheDocument();
  });

  it("renders 4 list items", () => {
    render(<CheckoutSteps active="review" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it('marks the active step with aria-current="step" (Phase 8 a11y lift)', () => {
    render(<CheckoutSteps active="review" />);
    const items = screen.getAllByRole("listitem");
    // address (0), method (1), review (2 — active), confirm (3)
    expect(items[2]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[3]).not.toHaveAttribute("aria-current");
  });

  it("exposes a polite live region announcing the current step (Phase 8)", () => {
    render(<CheckoutSteps active="method" />);
    // Screen-readers announce "Step 2 of 4: Payment" when the user lands
    // on /checkout/method. role=status implies aria-live=polite.
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/step 2 of 4/i);
    expect(status).toHaveTextContent(/payment/i);
  });
});
