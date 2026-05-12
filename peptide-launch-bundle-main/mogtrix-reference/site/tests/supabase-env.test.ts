import { describe, expect, it } from "vitest";
import {
  deriveSupabaseUrlFromServiceRoleKey,
  getBrowserSupabaseConfig,
  getServerSupabaseConfig,
  getSupabaseMode
} from "@/lib/supabase/env";

const serviceRole = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "eyJyb2xlIjoic2VydmljZV9yb2xlIiwicmVmIjoidmx6c3B1anphdmtzdHZ2cGJiZXQifQ",
  "signature"
].join(".");

describe("supabase env contract", () => {
  it("reports local demo mode when nothing usable is configured", () => {
    expect(getSupabaseMode({})).toEqual({
      configured: false,
      browserConfigured: false,
      serverConfigured: false,
      label: "Local demo mode",
      reason: "Supabase environment values are missing or malformed."
    });
  });

  it("reports full configured mode when public browser config exists", () => {
    expect(getSupabaseMode({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_example",
      SUPABASE_SERVICE_ROLE_KEY: serviceRole
    })).toEqual({
      configured: true,
      browserConfigured: true,
      serverConfigured: true,
      label: "Supabase configured",
      reason: "Catalog reads, staff auth, and server-owned request writes are available."
    });
  });

  it("reports secure server mode when only service-role access is valid", () => {
    expect(getSupabaseMode({
      NEXT_PUBLIC_SUPABASE_URL: "sb_publishable_badly_mapped",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_secret_should_not_be_public",
      SUPABASE_SERVICE_ROLE_KEY: serviceRole
    })).toEqual({
      configured: true,
      browserConfigured: false,
      serverConfigured: true,
      label: "Secure server mode",
      reason: "Catalog/request writes can reach Supabase server-side, but browser auth and public client features are unavailable."
    });
  });

  it("derives the project URL from a service-role key", () => {
    expect(deriveSupabaseUrlFromServiceRoleKey(serviceRole)).toBe("https://vlzspujzavkstvvpbbet.supabase.co");
  });

  it("exposes browser and server config separately", () => {
    expect(getBrowserSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_example"
    })).toEqual({
      url: "https://example.supabase.co",
      key: "sb_publishable_example",
      configured: true
    });

    expect(getServerSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "sb_publishable_badly_mapped",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_secret_should_not_be_public",
      SUPABASE_SERVICE_ROLE_KEY: serviceRole
    })).toEqual({
      url: "https://vlzspujzavkstvvpbbet.supabase.co",
      key: serviceRole,
      configured: true
    });
  });
});
