import { createClient } from "@supabase/supabase-js";
import type { SupabaseEnv } from "@/lib/supabase/env";
import { getBrowserSupabaseConfig } from "@/lib/supabase/env";

export function createPublicSupabaseClient(env: SupabaseEnv = process.env as SupabaseEnv) {
  const browser = getBrowserSupabaseConfig(env);
  if (!browser.configured) return null;

  return createClient(browser.url!, browser.key!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
