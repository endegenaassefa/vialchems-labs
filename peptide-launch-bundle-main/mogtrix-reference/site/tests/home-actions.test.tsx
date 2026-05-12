import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HomeActions } from "@/components/home-actions";

const { getCustomerAuthMode } = vi.hoisted(() => ({
  getCustomerAuthMode: vi.fn()
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a>
}));

vi.mock("@/lib/customer-auth", () => ({
  getCustomerAuthMode
}));

describe("home actions", () => {
  beforeEach(() => {
    getCustomerAuthMode.mockReset();
  });

  it("uses literal CTA copy for the home hero", () => {
    getCustomerAuthMode.mockReturnValue({
      configured: true,
      label: "Supabase customer auth configured",
      reason: "Email/password customer auth is available."
    });

    render(<HomeActions />);

    expect(
      screen.getByRole("link", { name: /^sign in$/i })
    ).toHaveAttribute("href", "/login");
    expect(
      screen.getByRole("link", { name: /view access rules/i })
    ).toHaveAttribute("href", "/legal/qualification");
    expect(screen.queryByRole("link", { name: /create account/i })).not.toBeInTheDocument();
  });
});
