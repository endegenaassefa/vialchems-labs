import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseEnv } from "@/lib/supabase/env";
import { getBrowserSupabaseConfig } from "@/lib/supabase/env";

export async function createServerSupabaseClient(env: SupabaseEnv = process.env as SupabaseEnv) {
  const browser = getBrowserSupabaseConfig(env);
  if (!browser.configured) return null;

  const cookieStore = await cookies();

  return createServerClient(browser.url!, browser.key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components can't write cookies. The proxy handles refreshes there.
        }
      }
    }
  });
}

export const createSupabaseServerClient = createServerSupabaseClient;
export {
  createServiceRoleSupabaseClient as createSupabaseServiceClient
} from "@/lib/supabase/service";
