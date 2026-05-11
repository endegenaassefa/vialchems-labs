export const AGE_VERIFICATION_STORAGE_KEY = 'vcl_age_verified';
export const AGE_VERIFICATION_COOKIE = 'vcl_age_verified';
export const AGE_VERIFICATION_DAYS = 30;
export const AGE_VERIFICATION_MAX_AGE_SECONDS =
  AGE_VERIFICATION_DAYS * 24 * 60 * 60;
export const AGE_GATE_PATH = '/age-gate';
export const AGE_GATE_GOODBYE_URL = 'https://www.google.com';

export function isAgeVerificationCurrent(value: string | undefined | null) {
  if (!value) return false;

  const verifiedAt = Date.parse(value);
  if (!Number.isFinite(verifiedAt)) return false;

  const expiresAt =
    verifiedAt + AGE_VERIFICATION_MAX_AGE_SECONDS * 1000;
  return expiresAt > Date.now();
}

export function normalizeAgeGateNext(value: string | undefined | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  if (value.startsWith(AGE_GATE_PATH)) return '/';
  return value;
}
