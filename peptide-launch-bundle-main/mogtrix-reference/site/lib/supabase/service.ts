import { createClient } from "@supabase/supabase-js";
import type { SupabaseEnv } from "@/lib/supabase/env";
import { getServerSupabaseConfig } from "@/lib/supabase/env";

export function createServiceRoleSupabaseClient(env: SupabaseEnv = process.env as SupabaseEnv) {
  const server = getServerSupabaseConfig(env);
  if (!server.configured) return null;

  return createClient(server.url!, server.key!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
