import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import type { AdminSession } from "@/lib/db/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ADMIN_COOKIE = "mogtrix_admin";

function getPasscode() {
  if (process.env.MOGTRIX_ADMIN_PASSCODE) {
    return process.env.MOGTRIX_ADMIN_PASSCODE;
  }

  if (process.env.NODE_ENV !== "production") {
    return "mogtrix-demo-admin";
  }

  return "";
}

function getCookieSecret() {
  return (
    process.env.MOGTRIX_ADMIN_COOKIE_SECRET ||
    process.env.MOGTRIX_ADMIN_PASSCODE ||
    "mogtrix-local-dev-cookie-secret"
  );
}

function shouldUseSecureCookie() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return process.env.NODE_ENV === "production";
  }

  try {
    const url = new URL(siteUrl);
    const localHosts = new Set(["localhost", "127.0.0.1"]);

    return process.env.NODE_ENV === "production"
      && url.protocol === "https:"
      && !localHosts.has(url.hostname);
  } catch {
    return process.env.NODE_ENV === "production";
  }
}

function sign(value: string) {
  return createHmac("sha256", getCookieSecret()).update(value).digest("hex");
}

function verifySignedValue(value: string, signature: string) {
  const expected = sign(value);
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);

  return left.length === right.length && timingSafeEqual(left, right);
}

export async function loginWithPasscode(passcode: string) {
  const expectedPasscode = getPasscode();

  if (!expectedPasscode || passcode !== expectedPasscode) {
    return { ok: false as const };
  }

  const value = `demo-admin:${Date.now()}`;
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, `${value}.${sign(value)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return { ok: true as const };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

async function requireSupabaseAdmin(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: "missing-session" };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();

  if (error || data?.role !== "admin") {
    return { ok: false, reason: "not-admin" };
  }

  return { ok: true, adminId: user.id, mode: "supabase" };
}

async function requirePasscodeAdmin(): Promise<AdminSession> {
  const passcode = getPasscode();

  if (!passcode) {
    return { ok: false, reason: "disabled" };
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!raw) {
    return { ok: false, reason: "missing-session" };
  }

  const [value, signature] = raw.split(".");

  if (!value || !signature || !verifySignedValue(value, signature)) {
    return { ok: false, reason: "missing-session" };
  }

  return { ok: true, adminId: "demo-admin", mode: "demo-passcode" };
}

export async function requireAdmin(): Promise<AdminSession> {
  const supabaseAdmin = await requireSupabaseAdmin();

  if (supabaseAdmin?.ok) {
    return supabaseAdmin;
  }

  return requirePasscodeAdmin();
}
