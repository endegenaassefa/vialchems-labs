export type SupabaseEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof atob === "function") {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  return Buffer.from(padded, "base64").toString("utf8");
}

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload)) as { ref?: string; role?: string };
  } catch {
    return null;
  }
}

export function isSupabaseUrl(value?: string | null) {
  return Boolean(value && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value));
}

export function isPublicApiKey(value?: string | null) {
  if (!value) return false;
  if (value.startsWith("sb_publishable_")) return true;
  const payload = decodeJwtPayload(value);
  return payload?.role === "anon";
}

export function isServiceRoleKey(value?: string | null) {
  if (!value) return false;
  if (value.startsWith("sb_secret_")) return true;
  const payload = decodeJwtPayload(value);
  return payload?.role === "service_role";
}

export function deriveSupabaseUrlFromServiceRoleKey(value?: string | null) {
  if (!isServiceRoleKey(value)) return null;
  const ref = decodeJwtPayload(value ?? "")?.ref;
  return ref ? `https://${ref}.supabase.co` : null;
}

function getPublicApiKey(env: SupabaseEnv) {
  const candidates = [env.NEXT_PUBLIC_SUPABASE_ANON_KEY, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY];
  return candidates.find((value) => isPublicApiKey(value)) ?? null;
}

export function getBrowserSupabaseConfig(env: SupabaseEnv) {
  const url = isSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL) ? env.NEXT_PUBLIC_SUPABASE_URL! : null;
  const key = getPublicApiKey(env);
  return { url, key, configured: Boolean(url && key) };
}

export function getServerSupabaseConfig(env: SupabaseEnv) {
  const key = isServiceRoleKey(env.SUPABASE_SERVICE_ROLE_KEY) ? env.SUPABASE_SERVICE_ROLE_KEY! : null;
  const url = getBrowserSupabaseConfig(env).url ?? deriveSupabaseUrlFromServiceRoleKey(key);
  return { url, key, configured: Boolean(url && key) };
}

export function hasSupabasePublicEnv(env: SupabaseEnv = process.env as SupabaseEnv) {
  return getBrowserSupabaseConfig(env).configured;
}

export function hasSupabaseServiceEnv(env: SupabaseEnv = process.env as SupabaseEnv) {
  return getServerSupabaseConfig(env).configured;
}

export function getSupabaseMode(env: SupabaseEnv = process.env as SupabaseEnv) {
  const browser = getBrowserSupabaseConfig(env);
  const server = getServerSupabaseConfig(env);

  if (browser.configured && server.configured) {
    return {
      configured: true,
      browserConfigured: true,
      serverConfigured: true,
      label: "Supabase configured",
      reason: "Catalog reads, staff auth, and server-owned request writes are available."
    };
  }

  if (server.configured) {
    return {
      configured: true,
      browserConfigured: false,
      serverConfigured: true,
      label: "Secure server mode",
      reason: "Catalog/request writes can reach Supabase server-side, but browser auth and public client features are unavailable."
    };
  }

  if (browser.configured) {
    return {
      configured: false,
      browserConfigured: true,
      serverConfigured: false,
      label: "Local demo mode",
      reason: "Public Supabase features are configured, but server-owned request writes are unavailable."
    };
  }

  return {
    configured: false,
    browserConfigured: false,
    serverConfigured: false,
    label: "Local demo mode",
    reason: "Supabase environment values are missing or malformed."
  };
}
