import { beforeEach, describe, expect, it, vi } from "vitest";
import { login, requestStaffAccess } from "@/app/ops/actions";

const {
  createServerSupabaseClient,
  getStaffSessionState,
  redirect,
  signInWithPassword,
  signOut,
  signUp
} = vi.hoisted(() => ({
  createServerSupabaseClient: vi.fn(),
  getStaffSessionState: vi.fn(),
  redirect: vi.fn((target: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { target });
  }),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn()
}));

vi.mock("next/navigation", () => ({
  redirect
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient
}));

vi.mock("@/lib/ops", async () => {
  const actual = await vi.importActual<typeof import("@/lib/ops")>("@/lib/ops");
  return {
    ...actual,
    getStaffSessionState
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

function loginForm(input: {
  email?: string;
  password?: string;
  next?: string;
}) {
  const data = new FormData();
  if (input.email !== undefined) data.set("email", input.email);
  if (input.password !== undefined) data.set("password", input.password);
  if (input.next !== undefined) data.set("next", input.next);
  return data;
}

describe("ops auth actions", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    createServerSupabaseClient.mockReset();
    getStaffSessionState.mockReset();
    redirect.mockClear();
    signInWithPassword.mockReset();
    signOut.mockReset();
    signUp.mockReset();
  });

  it("fails closed when browser Supabase auth is unavailable for login", async () => {
    createServerSupabaseClient.mockResolvedValue(null);

    await expect(
      login(loginForm({ email: "lead@example.com", password: "strong-password" }))
    ).rejects.toMatchObject({ target: "/ops/login?error=config" });
  });

  it("validates login credentials before calling Supabase", async () => {
    createServerSupabaseClient.mockResolvedValue({
      auth: { signInWithPassword, signOut }
    });

    await expect(
      login(loginForm({ email: "", password: "" }))
    ).rejects.toMatchObject({
      target: "/ops/login?error=credentials&next=%2Fops"
    });

    expect(createServerSupabaseClient).toHaveBeenCalled();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("surfaces rejected email and password combinations", async () => {
    signInWithPassword.mockResolvedValue({ data: null, error: { message: "bad login" } });
    createServerSupabaseClient.mockResolvedValue({
      auth: { signInWithPassword }
    });

    await expect(
      login(loginForm({ email: "lead@example.com", password: "wrong-password" }))
    ).rejects.toMatchObject({
      target: "/ops/login?error=auth&next=%2Fops"
    });
  });

  it("maps missing staff provisioning to the explicit profile error", async () => {
    signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null });
    getStaffSessionState.mockResolvedValue({
      kind: "forbidden",
      reason: "missing_profile",
      supabase: { auth: { signOut } },
      user: { id: "user_1", email: "lead@example.com" }
    });
    createServerSupabaseClient.mockResolvedValue({
      auth: { signInWithPassword, signOut }
    });

    await expect(
      login(loginForm({ email: "lead@example.com", password: "strong-password" }))
    ).rejects.toMatchObject({
      target: "/ops/login?error=profile&next=%2Fops"
    });

    expect(signOut).toHaveBeenCalled();
  });

  it("keeps inactive staff profiles on the pending activation path", async () => {
    signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null });
    getStaffSessionState.mockResolvedValue({
      kind: "forbidden",
      reason: "inactive",
      supabase: { auth: { signOut } },
      user: { id: "user_1", email: "lead@example.com" },
      profile: { id: "user_1", email: "lead@example.com", role: "staff", staffActive: false }
    });
    createServerSupabaseClient.mockResolvedValue({
      auth: { signInWithPassword, signOut }
    });

    await expect(
      login(loginForm({ email: "lead@example.com", password: "strong-password" }))
    ).rejects.toMatchObject({
      target: "/ops/login?error=inactive&next=%2Fops"
    });
  });

  it("redirects ready staff sessions into ops", async () => {
    signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null });
    getStaffSessionState.mockResolvedValue({
      kind: "ready",
      supabase: {},
      user: { id: "user_1", email: "lead@example.com" },
      profile: {
        id: "user_1",
        email: "lead@example.com",
        fullName: "Research Lead",
        organization: "Independent Research Lab",
        role: "staff",
        staffActive: true,
        ageVerified: false,
        blacklisted: false
      }
    });
    createServerSupabaseClient.mockResolvedValue({
      auth: { signInWithPassword, signOut }
    });

    await expect(
      login(loginForm({ email: "lead@example.com", password: "strong-password" }))
    ).rejects.toMatchObject({ target: "/ops" });
  });

  it("rejects staff signup when the pilot signup switch is disabled", async () => {
    await expect(requestStaffAccess(signupForm({
      email: "lead@example.com",
      password: "strong-password",
      fullName: "Research Lead"
    }))).rejects.toMatchObject({ target: "/ops/login?error=signup_disabled&mode=signup" });

    expect(createServerSupabaseClient).not.toHaveBeenCalled();
  });

  it("fails closed when signup is enabled but public auth is unavailable", async () => {
    vi.stubEnv("OPS_SIGNUP_ENABLED", "true");
    createServerSupabaseClient.mockResolvedValue(null);

    await expect(requestStaffAccess(signupForm({
      email: "lead@example.com",
      password: "strong-password",
      fullName: "Research Lead"
    }))).rejects.toMatchObject({ target: "/ops/login?error=config&mode=signup" });
  });

  it("validates signup credentials before calling Supabase", async () => {
    vi.stubEnv("OPS_SIGNUP_ENABLED", "true");

    await expect(requestStaffAccess(signupForm({
      email: "not-an-email",
      password: "short",
      fullName: "Research Lead"
    }))).rejects.toMatchObject({ target: "/ops/login?error=signup_credentials&mode=signup" });

    expect(createServerSupabaseClient).not.toHaveBeenCalled();
  });

  it("creates a pending inactive staff account request", async () => {
    vi.stubEnv("OPS_SIGNUP_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://mogtrix.test");
    signUp.mockResolvedValue({ data: { user: { id: "user_1" }, session: null }, error: null });
    createServerSupabaseClient.mockResolvedValue({
      auth: { signOut, signUp }
    });

    await expect(requestStaffAccess(signupForm({
      email: "  LEAD@example.com ",
      password: "strong-password",
      fullName: "  Research Lead  ",
      organization: "  Independent Research Lab  "
    }))).rejects.toMatchObject({ target: "/ops/login?status=signup_pending&mode=signup" });

    expect(signUp).toHaveBeenCalledWith({
      email: "lead@example.com",
      password: "strong-password",
      options: {
        emailRedirectTo: "https://mogtrix.test/ops/login",
        data: {
          full_name: "Research Lead",
          organization: "Independent Research Lab",
          account_type: "staff"
        }
      }
    });
    expect(signOut).toHaveBeenCalled();
  });

  it("returns a generic signup error when Supabase rejects the request", async () => {
    vi.stubEnv("OPS_SIGNUP_ENABLED", "true");
    signUp.mockResolvedValue({ data: null, error: { message: "User already registered" } });
    createServerSupabaseClient.mockResolvedValue({
      auth: { signUp }
    });

    await expect(requestStaffAccess(signupForm({
      email: "lead@example.com",
      password: "strong-password",
      fullName: "Research Lead"
    }))).rejects.toMatchObject({ target: "/ops/login?error=signup&mode=signup" });
  });
});
