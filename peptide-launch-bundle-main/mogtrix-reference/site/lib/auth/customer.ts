import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CustomerSession =
  | { ok: true; customerId: string; email: string; qualified: boolean }
  | { ok: false; reason: "no-session" | "not-customer" | "unverified" };

type CustomerProfileSessionRow = {
  id: string;
  email: string;
  qualified: boolean | null;
  age_verified: boolean;
  ruo_acknowledged: boolean;
  blacklisted: boolean;
};

export async function getCustomerSession(): Promise<CustomerSession> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, reason: "no-session" };
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, reason: "no-session" };
  }

  if (!user.email_confirmed_at) {
    return { ok: false, reason: "unverified" };
  }

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("id, email, qualified, age_verified, ruo_acknowledged, blacklisted")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile as CustomerProfileSessionRow).blacklisted) {
    return { ok: false, reason: "not-customer" };
  }

  const row = profile as CustomerProfileSessionRow;

  return {
    ok: true,
    customerId: row.id,
    email: row.email,
    qualified: Boolean(row.qualified || (row.age_verified && row.ruo_acknowledged))
  };
}

export async function requireQualifiedCustomer() {
  const session = await getCustomerSession();
  if (!session.ok) {
    throw new Error(`Auth failed: ${session.reason}`);
  }
  if (!session.qualified) {
    throw new Error("Not qualified");
  }
  return session as Extract<CustomerSession, { ok: true }> & { qualified: true };
}
