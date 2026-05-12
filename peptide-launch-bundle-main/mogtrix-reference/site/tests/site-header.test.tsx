import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "@/components/site-header";

const { getCustomerAccessState, getCustomerAuthMode } = vi.hoisted(() => ({
  getCustomerAccessState: vi.fn(),
  getCustomerAuthMode: vi.fn()
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a>
}));

vi.mock("next/image", () => ({
  default: ({
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    <img {...props} alt={props.alt ?? ""} />
  )
}));

vi.mock("@/lib/customer", () => ({
  customerCanViewPrivatePricing: (state: { kind: string }) => state.kind === "ready" || state.kind === "unavailable",
  getCustomerAccessState
}));

vi.mock("@/lib/customer-auth", () => ({
  getCustomerAuthMode
}));

vi.mock("@/app/auth/actions", () => ({
  signOutCustomer: vi.fn()
}));

describe("site header", () => {
  beforeEach(() => {
    getCustomerAccessState.mockReset();
    getCustomerAuthMode.mockReset();
    getCustomerAuthMode.mockReturnValue({
      configured: true,
      label: "Supabase customer auth configured",
      reason: "Email/password customer auth is available."
    });
  });

  it("reduces navigation for customers who still need onboarding", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "unqualified",
      user: { id: "customer_1", email: "lead@example.com" },
      profile: {
        id: "customer_1",
        email: "lead@example.com",
        fullName: "Research Lead",
        organization: "Independent Research Lab",
        ageVerified: true,
        ruoAcknowledged: false,
        qualified: false,
        qualifiedAt: null,
        blacklisted: false
      },
      supabase: {}
    });

    render(await SiteHeader());

    expect(screen.queryByRole("link", { name: "Shop" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Orders" })).not.toBeInTheDocument();
    expect(screen.queryByText("Cart")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /complete setup/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /finish setup/i })).toHaveAttribute(
      "href",
      "/qualify"
    );
    expect(screen.getByRole("link", { name: /access requirements/i })).toHaveAttribute(
      "href",
      "/legal/qualification"
    );
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
  });

  it("shows full storefront navigation for qualified customers", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "ready",
      user: { id: "customer_1", email: "lead@example.com" },
      profile: {
        id: "customer_1",
        email: "lead@example.com",
        fullName: "Research Lead",
        organization: "Independent Research Lab",
        ageVerified: true,
        ruoAcknowledged: true,
        qualified: true,
        qualifiedAt: "2026-05-03T20:00:00.000Z",
        blacklisted: false
      },
      supabase: {}
    });

    render(await SiteHeader());

    expect(screen.getByRole("link", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cart/i })).toHaveAttribute("href", "/cart");
    expect(screen.queryByRole("link", { name: /finish setup/i })).not.toBeInTheDocument();
  });
});
