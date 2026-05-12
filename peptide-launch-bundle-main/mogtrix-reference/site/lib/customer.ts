import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { buildAuthUrl, normalizeSafeNextPath } from "@/lib/auth-helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CustomerProfile } from "@/lib/types";

type SessionClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type CustomerProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
  age_verified: boolean;
  ruo_acknowledged: boolean;
  qualified?: boolean | null;
  qualified_at?: string | null;
  blacklisted: boolean;
};

export type ReadyCustomerSession = {
  kind: "ready";
  supabase: NonNullable<SessionClient>;
  user: User;
  profile: CustomerProfile;
};

export type CustomerSessionState =
  | { kind: "unavailable" }
  | { kind: "anonymous"; supabase: NonNullable<SessionClient> }
  | { kind: "unverified"; supabase: NonNullable<SessionClient>; user: User; profile: CustomerProfile }
  | { kind: "unqualified"; supabase: NonNullable<SessionClient>; user: User; profile: CustomerProfile }
  | { kind: "forbidden"; supabase: NonNullable<SessionClient>; user: User; reason: "missing_profile" | "blacklisted"; profile?: CustomerProfile }
  | ReadyCustomerSession;

type CustomerRouteDecision =
  | { action: "allow" }
  | { action: "redirect"; location: string };

const CUSTOMER_AUTH_PATHS = new Set(["/login", "/signup"]);

export function mapCustomerProfileRow(row: CustomerProfileRow): CustomerProfile {
  const qualified = Boolean(row.qualified || (row.age_verified && row.ruo_acknowledged));

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    organization: row.organization,
    ageVerified: row.age_verified,
    ruoAcknowledged: row.ruo_acknowledged,
    qualified,
    qualifiedAt: row.qualified_at ?? null,
    blacklisted: row.blacklisted
  };
}

export function isCustomerProtectedPath(pathname: string) {
  return pathname === "/cart"
    || pathname === "/request"
    || pathname === "/checkout"
    || pathname.startsWith("/account");
}

export function normalizeCustomerNextPath(value: string | null | undefined) {
  return normalizeSafeNextPath(value, {
    fallback: "/shop",
    isAllowedPath: (nextPath) =>
      nextPath === "/shop"
      || nextPath === "/cart"
      || nextPath === "/request"
      || nextPath === "/checkout"
      || nextPath.startsWith("/products/")
      || nextPath.startsWith("/account")
  });
}

function buildLoginUrl(nextPath: string, params?: { error?: string; status?: string }) {
  return buildAuthUrl("/login", {
    error: params?.error,
    status: params?.status,
    next: nextPath,
    normalizeNextPath: normalizeCustomerNextPath
  });
}

function buildQualificationUrl(nextPath: string) {
  return buildAuthUrl("/qualify", {
    next: nextPath,
    normalizeNextPath: normalizeCustomerNextPath
  });
}

export function getCustomerRouteDecision(pathname: string, state: CustomerSessionState): CustomerRouteDecision {
  const nextPath = normalizeCustomerNextPath(pathname);
  const authPath = CUSTOMER_AUTH_PATHS.has(pathname);
  const protectedPath = isCustomerProtectedPath(pathname);
  const qualificationPath = pathname === "/qualify";

  if (state.kind === "unavailable") {
    return { action: "allow" };
  }

  if (state.kind === "anonymous") {
    if (protectedPath || qualificationPath) {
      return { action: "redirect", location: buildLoginUrl(nextPath) };
    }
    return { action: "allow" };
  }

  if (state.kind === "forbidden") {
    if (authPath) {
      return { action: "allow" };
    }
    return { action: "redirect", location: buildLoginUrl("/shop", { error: "access" }) };
  }

  if (state.kind === "unverified") {
    if (protectedPath || qualificationPath) {
      return { action: "redirect", location: buildLoginUrl(nextPath, { error: "verify" }) };
    }
    return { action: "allow" };
  }

  if (state.kind === "unqualified") {
    if (authPath) {
      return { action: "redirect", location: buildQualificationUrl("/shop") };
    }
    if (protectedPath && !qualificationPath) {
      return { action: "redirect", location: buildQualificationUrl(nextPath) };
    }
    return { action: "allow" };
  }

  if (authPath || qualificationPath) {
    return { action: "redirect", location: "/shop" };
  }

  return { action: "allow" };
}

export async function getCustomerAccessState(existingClient?: NonNullable<SessionClient>): Promise<CustomerSessionState> {
  const supabase = existingClient ?? await createServerSupabaseClient();
  if (!supabase) return { kind: "unavailable" };

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { kind: "anonymous", supabase };
  }

  const { data, error } = await supabase
    .from("customer_profiles")
    .select("id, email, full_name, organization, age_verified, ruo_acknowledged, qualified, qualified_at, blacklisted")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return { kind: "forbidden", supabase, user, reason: "missing_profile" };
  }

  const profile = mapCustomerProfileRow(data as CustomerProfileRow);
  if (profile.blacklisted) {
    return { kind: "forbidden", supabase, user, reason: "blacklisted", profile };
  }

  if (!user.email_confirmed_at) {
    return { kind: "unverified", supabase, user, profile };
  }

  if (!profile.qualified) {
    return { kind: "unqualified", supabase, user, profile };
  }

  return { kind: "ready", supabase, user, profile };
}

export function customerCanViewPrivatePricing(state: CustomerSessionState) {
  return state.kind === "ready";
}

export function getCatalogAccessAction(
  pathname: string,
  state: CustomerSessionState
): { href: string; label: string; note: string } {
  const nextPath = normalizeCustomerNextPath(pathname);

  if (state.kind === "unqualified") {
    return {
      href: buildQualificationUrl(nextPath),
      label: "Finish setup",
      note: "Finish your account setup to view pricing and add items to your cart."
    };
  }

  if (state.kind === "forbidden") {
    return {
      href: buildLoginUrl("/shop", { error: "access" }),
      label: "Contact support",
      note: "This account is not currently approved for full catalog access."
    };
  }

  return {
    href: buildLoginUrl(nextPath, {
      error: state.kind === "unverified" ? "verify" : undefined
    }),
    label: state.kind === "unverified" ? "Verify email and sign in" : "Sign in for full access",
    note: "Sign in and complete qualification to view pricing and add items to your cart."
  };
}

export async function requireCustomerPageSession(pathname: string) {
  const state = await getCustomerAccessState();
  const decision = getCustomerRouteDecision(pathname, state);

  if (decision.action === "redirect") {
    redirect(decision.location);
  }

  return state.kind === "ready" ? state : null;
}
