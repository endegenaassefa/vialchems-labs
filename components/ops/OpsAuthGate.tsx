"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Client-side gate for /ops/* pages.
//
// CSO interim hardening (2026-05-14): the ops token used to live in
// localStorage, where any storefront XSS could read it. It now lives in an
// httpOnly cookie set by /api/ops/session — client JavaScript can NOT read
// it. So this gate verifies the session by asking the server
// (GET /api/ops/session) instead of reading a token directly. The real auth
// check still happens on every /api/ops/* endpoint via assertOpsToken.
//
// Session expiry: 12h (OPS_SESSION_MAX_AGE_SECONDS). Rotate by changing
// OPS_API_TOKEN in the host env — all existing cookies stop validating.

// Opens an ops session: POSTs the pasted token to the server, which verifies
// it and sets the httpOnly cookie. Returns the raw Response so the caller can
// distinguish a rejected token (401) from a server/network error.
export async function openOpsSession(token: string): Promise<Response> {
  return fetch("/api/ops/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

// Clears the ops session cookie (logout).
export async function closeOpsSession(): Promise<void> {
  await fetch("/api/ops/session", { method: "DELETE" });
}

// Fetch wrapper for ops API calls. The httpOnly session cookie rides along
// automatically on same-origin requests, so there is no token to attach. On
// a 401 it sends the user back to login.
export async function opsFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "same-origin",
  });
  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/ops/login";
  }
  return res;
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
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/ops/session", {
          credentials: "same-origin",
        });
        const data = (await res.json().catch(() => ({}))) as {
          authenticated?: boolean;
        };
        if (cancelled) return;
        if (data.authenticated) {
          setReady(true);
        } else {
          router.replace("/ops/login");
        }
      } catch {
        if (!cancelled) router.replace("/ops/login");
      }
    }
    check();
    return () => {
      cancelled = true;
    };
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
