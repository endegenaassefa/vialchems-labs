'use client';

import {
  AGE_VERIFICATION_COOKIE,
  AGE_VERIFICATION_MAX_AGE_SECONDS,
  AGE_VERIFICATION_STORAGE_KEY,
  isAgeVerificationCurrent,
} from '@/lib/age-verification';

function secureCookieSuffix() {
  if (typeof location === 'undefined') return '';
  return location.protocol === 'https:' ? '; Secure' : '';
}

export function readAgeVerification() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AGE_VERIFICATION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function hasCurrentAgeVerification() {
  return isAgeVerificationCurrent(readAgeVerification());
}

export function persistAgeVerification(value = new Date().toISOString()) {
  if (typeof document === 'undefined') return value;

  try {
    window.localStorage.setItem(AGE_VERIFICATION_STORAGE_KEY, value);
  } catch {
    /* Storage can fail in private browsing; the cookie remains authoritative. */
  }

  document.cookie = `${AGE_VERIFICATION_COOKIE}=${encodeURIComponent(
    value,
  )}; Max-Age=${AGE_VERIFICATION_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secureCookieSuffix()}`;
  return value;
}

export function clearAgeVerification() {
  if (typeof document === 'undefined') return;

  try {
    window.localStorage.removeItem(AGE_VERIFICATION_STORAGE_KEY);
  } catch {
    /* ignore */
  }

  document.cookie = `${AGE_VERIFICATION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secureCookieSuffix()}`;
}
