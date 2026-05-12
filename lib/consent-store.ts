/**
 * Phase 10.6 (v4) — D14 cookie consent state.
 *
 * Iron Law 2.23 contract:
 *   - "necessary" category always on (auth + cart + CSRF cookies)
 *   - other categories opt-in by default (analytics + marketing + functional)
 *   - GPC signal honored (auto opt-out)
 *   - persisted via first-party cookie `vc-consent`
 *   - serialized as JSON (small + auditable)
 *
 * Iron Law 2.5 / 2.19: this file joins the protected paths list as
 * regulatory-artifact storage.
 */

export const CONSENT_COOKIE = "vc-consent" as const;

export const CONSENT_CATEGORIES = [
  "necessary",
  "functional",
  "analytics",
  "marketing",
] as const;
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export const STRICTLY_NECESSARY_CATEGORIES: ConsentCategory[] = ["necessary"];

export interface ConsentState {
  version: number;
  /** ISO timestamp of the user's decision; null = no decision yet. */
  decidedAt: string | null;
  categories: Record<ConsentCategory, boolean>;
}

const CURRENT_VERSION = 1;

export function defaultConsent(): ConsentState {
  return {
    version: CURRENT_VERSION,
    decidedAt: null,
    categories: {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    },
  };
}

function isStrictlyNecessary(cat: ConsentCategory): boolean {
  return STRICTLY_NECESSARY_CATEGORIES.includes(cat);
}

export function serializeConsent(state: ConsentState): string {
  return JSON.stringify(state);
}

export function parseConsent(raw: string | null): ConsentState {
  if (!raw) return defaultConsent();
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    const fallback = defaultConsent();
    const categories: Record<ConsentCategory, boolean> = {
      necessary: true, // ALWAYS true regardless of input
      functional: Boolean(parsed.categories?.functional),
      analytics: Boolean(parsed.categories?.analytics),
      marketing: Boolean(parsed.categories?.marketing),
    };
    return {
      version:
        typeof parsed.version === "number" ? parsed.version : fallback.version,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : null,
      categories,
    };
  } catch {
    return defaultConsent();
  }
}

export function consentEnabled(
  state: ConsentState,
  category: ConsentCategory,
): boolean {
  if (isStrictlyNecessary(category)) return true;
  return state.categories[category] === true;
}

export function detectGPC(nav: Navigator | undefined): boolean {
  if (!nav) return false;
  return Boolean(
    (nav as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl,
  );
}

/**
 * GPC opt-out is a real decision, not "no decision yet". Stamp decidedAt
 * so the banner does not re-prompt a user who already signaled GPC.
 */
export function applyGPCDefaults(state: ConsentState): ConsentState {
  return {
    ...state,
    decidedAt: new Date().toISOString(),
    categories: {
      necessary: true,
      functional: state.categories.functional, // GPC doesn't speak to functional
      analytics: false,
      marketing: false,
    },
  };
}

export function acceptAll(): ConsentState {
  return {
    version: CURRENT_VERSION,
    decidedAt: new Date().toISOString(),
    categories: {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    },
  };
}

export function rejectAll(): ConsentState {
  return {
    version: CURRENT_VERSION,
    decidedAt: new Date().toISOString(),
    categories: {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    },
  };
}

/**
 * Customize: caller passes per-category booleans; necessary is forced true.
 */
export function customize(
  input: Partial<Record<ConsentCategory, boolean>>,
): ConsentState {
  return {
    version: CURRENT_VERSION,
    decidedAt: new Date().toISOString(),
    categories: {
      necessary: true,
      functional: Boolean(input.functional),
      analytics: Boolean(input.analytics),
      marketing: Boolean(input.marketing),
    },
  };
}
