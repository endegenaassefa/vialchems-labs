import { getBrowserSupabaseConfig, type SupabaseEnv } from "@/lib/supabase/env";

export function getCustomerAuthMode(env: SupabaseEnv = process.env as SupabaseEnv) {
  const browser = getBrowserSupabaseConfig(env);

  if (browser.configured) {
    return {
      configured: true,
      label: "Supabase customer auth configured",
      reason: "Email/password customer auth, session cookies, and gated catalog access are available."
    };
  }

  return {
    configured: false,
    label: "Local demo mode",
    reason: "Customer auth is disabled until the public Supabase URL and public key are configured."
  };
}
