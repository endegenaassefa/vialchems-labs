"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Client-side gate for /ops/* pages. Reads OPS_API_TOKEN from localStorage;
// if missing, redirects to /ops/login. The login page sets the token and
// redirects back. This is NOT a real security boundary — the actual auth
// check is on every /api/ops/* endpoint via assertOpsToken (constant-time
// HMAC compare against env OPS_API_TOKEN). The UI gate is a UX nicety so
// staff don't see broken pages with 401 errors everywhere.
//
// Token expiry: there is none. Rotate by changing OPS_API_TOKEN in Vercel
// env vars; all staff get logged out (their stored token stops working).

const STORAGE_KEY = "vialchems_ops_token_v1";

export function getOpsToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setOpsToken(token: string): void {
  window.localStorage.setItem(STORAGE_KEY, token.trim());
}

export function clearOpsToken(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

// Fetch wrapper that auto-attaches the Bearer token. Throws on missing
// token (caller should handle by redirecting to login).
export async function opsFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getOpsToken();
  if (!token) throw new Error("ops_no_token");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...init, headers });
}

export function OpsAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/ops/login") {
      setReady(true);
      return;
    }
    const token = getOpsToken();
    if (!token) {
      router.replace("/ops/login");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[11px] tracking-[0.24em] uppercase text-[var(--text-muted)]">
        Checking access...
      </div>
    );
  }
  return <>{children}</>;
}
