import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  completeCustomerQualification,
  signupCustomer
} from "@/app/auth/actions";

const {
  createServerSupabaseClient,
  getCustomerAccessState,
  redirect,
  signOut,
  signUp,
  updateCustomerProfile,
  upsertCustomerQualification
} = vi.hoisted(() => ({
  createServerSupabaseClient: vi.fn(),
  getCustomerAccessState: vi.fn(),
  redirect: vi.fn((target: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { target });
  }),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updateCustomerProfile: vi.fn(),
  upsertCustomerQualification: vi.fn()
}));

vi.mock("next/navigation", () => ({
  redirect
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient
}));

vi.mock("@/lib/customer", async () => {
  const actual = await vi.importActual<typeof import("@/lib/customer")>(
    "@/lib/customer"
  );
  return {
    ...actual,
    getCustomerAccessState
  };
});

vi.mock("@/lib/customer-qualification", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/customer-qualification")
  >("@/lib/customer-qualification");

  return {
    ...actual,
    updateCustomerProfileQualification: updateCustomerProfile,
    upsertCustomerQualification
  };
});

function signupForm(input: {
  email?: string;
  password?: string;
  fullName?: string;
  organization?: string;
}) {
  const data = new FormData();
  if (input.email !== undefined) data.set("email", input.email);
  if (input.password !== undefined) data.set("password", input.password);
  if (input.fullName !== undefined) data.set("fullName", input.fullName);
  if (input.organization !== undefined) data.set("organization", input.organization);
  return data;
}

function qualificationForm(input: {
  next?: string;
  institutionName?: string;
  institutionType?: string;
  institutionTypeOther?: string;
  roleTitle?: string;
  roleTitleOther?: string;
  procurementContext?: string;
  procurementContextOther?: string;
  supportingNotes?: string;
  attestationAge?: boolean;
  attestationRuo?: boolean;
  attestationNoHumanUse?: boolean;
}) {
  const data = new FormData();
  if (input.next !== undefined) data.set("next", input.next);
  if (input.institutionName !== undefined) {
    data.set("institutionName", input.institutionName);
  }
  if (input.institutionType !== undefined) {
    data.set("institutionType", input.institutionType);
  }
  if (input.institutionTypeOther !== undefined) {
    data.set("institutionTypeOther", input.institutionTypeOther);
  }
  if (input.roleTitle !== undefined) data.set("roleTitle", input.roleTitle);
  if (input.roleTitleOther !== undefined) {
    data.set("roleTitleOther", input.roleTitleOther);
  }
  if (input.procurementContext !== undefined) {
    data.set("procurementContext", input.procurementContext);
  }
  if (input.procurementContextOther !== undefined) {
    data.set("procurementContextOther", input.procurementContextOther);
  }
  if (input.supportingNotes !== undefined) {
    data.set("supportingNotes", input.supportingNotes);
  }
  if (input.attestationAge) data.set("attestationAge", "on");
  if (input.attestationRuo) data.set("attestationRuo", "on");
  if (input.attestationNoHumanUse) data.set("attestationNoHumanUse", "on");
  return data;
}

describe("customer auth actions", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    createServerSupabaseClient.mockReset();
    getCustomerAccessState.mockReset();
    redirect.mockClear();
    signOut.mockReset();
    signUp.mockReset();
    updateCustomerProfile.mockReset();
    upsertCustomerQualification.mockReset();
  });

  it("redirects signup into the inbox verification step", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://mogtrix.test");
    signUp.mockResolvedValue({ data: { user: { id: "customer_1" } }, error: null });
    createServerSupabaseClient.mockResolvedValue({
      auth: { signOut, signUp }
    });

    await expect(
      signupCustomer(
        signupForm({
          email: " lead@example.com ",
          password: "strong-password",
          fullName: " Research Lead ",
          organization: " Independent Research Lab "
        })
      )
    ).rejects.toMatchObject({
      target: "/verify?email=lead%40example.com"
    });

    expect(signUp).toHaveBeenCalledWith({
      email: "lead@example.com",
      password: "strong-password",
      options: {
        emailRedirectTo: "https://mogtrix.test/auth/callback",
        data: {
          full_name: "Research Lead",
          organization: "Independent Research Lab",
          account_type: "customer"
        }
      }
    });
    expect(signOut).toHaveBeenCalled();
  });

  it("requires all qualification attestations and institution fields", async () => {
    await expect(
      completeCustomerQualification(
        qualificationForm({
          next: "/checkout",
          institutionName: "Independent Research Lab",
          institutionType: "Private laboratory",
          roleTitle: "Research lead",
          procurementContext: "Bench analytics",
          attestationAge: true
        })
      )
    ).rejects.toMatchObject({
      target: "/qualify?error=required&next=%2Fcheckout"
    });
  });

  it("requires follow-up text when a structured choice is other", async () => {
    await expect(
      completeCustomerQualification(
        qualificationForm({
          next: "/checkout",
          institutionName: "Independent Research Lab",
          institutionType: "Other",
          roleTitle: "Research lead",
          procurementContext: "Bench analytics",
          attestationAge: true,
          attestationRuo: true,
          attestationNoHumanUse: true
        })
      )
    ).rejects.toMatchObject({
      target: "/qualify?error=required&next=%2Fcheckout"
    });
  });

  it("persists structured qualification details and allows supporting notes to stay optional", async () => {
    createServerSupabaseClient.mockResolvedValue({});
    getCustomerAccessState.mockResolvedValue({
      kind: "unqualified",
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
      }
    });
    updateCustomerProfile.mockResolvedValue(null);
    upsertCustomerQualification.mockResolvedValue(null);

    await expect(
      completeCustomerQualification(
        qualificationForm({
          next: "/checkout",
          institutionName: "Independent Research Lab",
          institutionType: "Private laboratory",
          roleTitle: "Research lead",
          procurementContext: "Bench analytics",
          attestationAge: true,
          attestationRuo: true,
          attestationNoHumanUse: true
        })
      )
    ).rejects.toMatchObject({
      target: "/checkout"
    });

    expect(upsertCustomerQualification).toHaveBeenCalledWith(
      expect.anything(),
      "customer_1",
      {
        institutionName: "Independent Research Lab",
        institutionType: "Private laboratory",
        roleTitle: "Research lead",
        procurementContext: "Bench analytics",
        supportingNotes: "",
        attestationAge: true,
        attestationRuo: true,
        attestationNoHumanUse: true
      }
    );
    expect(updateCustomerProfile).toHaveBeenCalledWith(
      expect.anything(),
      "customer_1",
      "Independent Research Lab"
    );
  });
});
