import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders the title as an <h2>", () => {
    render(<EmptyState title="No orders yet" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "No orders yet" }),
    ).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(
      <EmptyState
        title="No orders yet"
        description="Your account history will appear here once you place an order."
      />,
    );
    expect(
      screen.getByText(/your account history will appear/i),
    ).toBeInTheDocument();
  });

  it("does not render description paragraph when omitted", () => {
    const { container } = render(<EmptyState title="x" />);
    // No <p> child for description
    expect(container.querySelectorAll("p").length).toBe(0);
  });

  it("renders the icon ReactNode when provided", () => {
    render(
      <EmptyState
        title="x"
        icon={<svg data-testid="empty-icon" aria-hidden />}
      />,
    );
    expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
  });

  it("renders the action ReactNode when provided", () => {
    render(
      <EmptyState
        title="x"
        action={<button type="button">Browse catalog</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: /browse catalog/i }),
    ).toBeInTheDocument();
  });

  it("uses centered layout (flex + items-center)", () => {
    render(<EmptyState title="x" data-testid="empty" />);
    const root = screen.getByTestId("empty");
    expect(root.className).toMatch(/flex/);
    expect(root.className).toMatch(/items-center/);
    expect(root.className).toMatch(/text-center/);
  });
});
