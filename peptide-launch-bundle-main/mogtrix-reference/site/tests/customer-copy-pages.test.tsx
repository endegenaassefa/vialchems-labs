import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FaqPage from "@/app/faq/page";
import HomePage from "@/app/page";
import LoginPage from "@/app/login/page";
import QualifyPage from "@/app/qualify/page";
import SignupPage from "@/app/signup/page";
import VerifyPage from "@/app/verify/page";

const {
  getCustomerAccessState,
  getCustomerAuthMode,
  getCustomerRouteDecision,
  redirect
} = vi.hoisted(() => ({
  getCustomerAccessState: vi.fn(),
  getCustomerAuthMode: vi.fn(),
  getCustomerRouteDecision: vi.fn(),
  redirect: vi.fn((target: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { target });
  })
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a>
}));

vi.mock("next/navigation", () => ({
  redirect
}));

vi.mock("@/lib/customer-auth", () => ({
  getCustomerAuthMode
}));

vi.mock("@/lib/customer", async () => {
  const actual = await vi.importActual<typeof import("@/lib/customer")>(
    "@/lib/customer"
  );

  return {
    ...actual,
    getCustomerAccessState,
    getCustomerRouteDecision
  };
});

vi.mock("@/components/home-actions", () => ({
  HomeActions: () => <div>Home actions</div>
}));

vi.mock("@/components/vial-hero", () => ({
  VialHero: () => <div>Hero visual</div>
}));

vi.mock("@/components/home-proof-row", () => ({
  HomeProofRow: () => (
    <div>
      <div>BPC-157 5mg</div>
      <div>BPC-157 + TB-500 5mg/5mg</div>
      <div>CJC-1295 No DAC 5mg</div>
    </div>
  )
}));

vi.mock("@/components/qualification-flow", () => ({
  QualificationFlow: () => <div>Qualification flow</div>
}));

describe("customer-facing page copy", () => {
  beforeEach(() => {
    getCustomerAuthMode.mockReset();
    getCustomerAccessState.mockReset();
    getCustomerRouteDecision.mockReset();
    redirect.mockClear();

    getCustomerAuthMode.mockReturnValue({
      configured: true,
      label: "Supabase customer auth configured",
      reason: "Email/password customer auth is available."
    });
  });

  it("uses direct clinical copy and immediate product proof on the home page", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /private catalog\. no runaround\./i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to view availability, batch records, and order status\./i)
    ).toBeInTheDocument();
    expect(screen.getByText("BPC-157 5mg")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /browse a preview before you sign in/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /clear requirements first\. easier ordering after\./i })
    ).not.toBeInTheDocument();
  });

  it("uses a shared direct-clinical sign-in shell without technical status copy", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "anonymous",
      supabase: {}
    });

    render(
      await LoginPage({
        searchParams: Promise.resolve({})
      })
    );

    expect(screen.getByRole("heading", { name: /^sign in$/i })).toBeInTheDocument();
    expect(
      screen.getByText(/view pricing, batch records, and order status\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/verified buyers only/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/supabase customer auth configured/i)
    ).not.toBeInTheDocument();
  });

  it("shows the access error when a non-customer session lands on login", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "forbidden",
      reason: "missing_profile",
      user: { id: "staff_1", email: "prodbykalebb@proton.me" },
      supabase: {}
    });

    render(
      await LoginPage({
        searchParams: Promise.resolve({})
      })
    );

    expect(
      screen.getByText(/this account is not currently approved for the full catalog\./i)
    ).toBeInTheDocument();
  });

  it("keeps signup short and consistent with the shared access shell", async () => {
    render(
      await SignupPage({
        searchParams: Promise.resolve({})
      })
    );

    expect(
      screen.getByRole("heading", { name: /^create account$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/create your account to view pricing, records, and order status\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/verified buyers only/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/supabase customer auth configured/i)
    ).not.toBeInTheDocument();
  });

  it("keeps the verification page focused on the next step", async () => {
    getCustomerAccessState.mockResolvedValue({
      kind: "unverified",
      user: { id: "customer_1", email: "lead@example.com" },
      profile: {
        id: "customer_1",
        email: "lead@example.com",
        fullName: "Research Lead",
        organization: "Independent Research Lab",
        ageVerified: false,
        ruoAcknowledged: false,
        qualified: false,
        qualifiedAt: null,
        blacklisted: false
      },
      supabase: {}
    });

    render(
      await VerifyPage({
        searchParams: Promise.resolve({ email: "lead@example.com" })
      })
    );

    expect(
      screen.getByRole("heading", { name: /verify your email/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/come back to finish your account setup/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/next steps/i)).toBeInTheDocument();
  });

  it("frames qualification as account setup instead of internal workflow jargon", async () => {
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
    getCustomerRouteDecision.mockReturnValue({ action: "allow" });

    render(
      await QualifyPage({
        searchParams: Promise.resolve({})
      })
    );

    expect(
      screen.getByRole("heading", { name: /finish your account setup/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/open pricing, product details, and checkout for your account/i)
    ).toBeInTheDocument();
  });

  it("uses customer-friendly support language on the FAQ page", () => {
    render(<FaqPage />);

    expect(
      screen.getByText(/sign-in, qualification, pilot checkout, supporting documents, and follow-up/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /who can access the full catalog\?/i })
    ).toBeInTheDocument();
  });
});
