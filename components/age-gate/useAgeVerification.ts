"use client";

import {
  AGE_VERIFICATION_STORAGE_KEY,
  isAgeVerificationCurrent,
} from "@/lib/age-verification";

export function readAgeVerification() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AGE_VERIFICATION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function hasCurrentAgeVerification() {
  return isAgeVerificationCurrent(readAgeVerification());
}

export async function persistAgeVerification() {
  if (typeof window === "undefined") return null;

  const response = await fetch("/api/age-gate/verify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ termsAccepted: true }),
  });

  if (!response.ok) {
    throw new Error("age_verification_failed");
  }

  const body = (await response.json()) as {
    verifiedAt?: string;
  };
  const value = body.verifiedAt ?? new Date().toISOString();

  try {
    window.localStorage.setItem(AGE_VERIFICATION_STORAGE_KEY, value);
  } catch {
    /* Storage can fail in private browsing; the cookie remains authoritative. */
  }

  return value;
}

export async function clearAgeVerification() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(AGE_VERIFICATION_STORAGE_KEY);
  } catch {
    /* ignore */
  }

  await fetch("/api/age-gate/verify", { method: "DELETE" }).catch(() => {});
}
