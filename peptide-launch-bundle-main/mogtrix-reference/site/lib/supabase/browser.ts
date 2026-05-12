import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseEnv } from "@/lib/supabase/env";
import { getBrowserSupabaseConfig } from "@/lib/supabase/env";

let browserClient: ReturnType<typeof createBrowserClient> | null | undefined;

export function createBrowserSupabaseClient(env: SupabaseEnv = process.env as SupabaseEnv) {
  if (browserClient !== undefined) return browserClient;

  const browser = getBrowserSupabaseConfig(env);
  browserClient = browser.configured
    ? createBrowserClient(browser.url!, browser.key!)
    : null;

  return browserClient;
}
