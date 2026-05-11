import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  CONSENT_COOKIE,
  STRICTLY_NECESSARY_CATEGORIES,
  defaultConsent,
  parseConsent,
  serializeConsent,
  consentEnabled,
  detectGPC,
  applyGPCDefaults,
  type ConsentState,
} from '@/lib/consent-store';

/**
 * Phase 10.6 (v4) — D14 cookie consent banner.
 *
 * Iron Law 2.23 contract:
 *   - strictly-necessary cookies (auth, cart, csrf) always on
 *   - all other categories opt-in by default
 *   - GPC (Global Privacy Control) signal honors opt-out
 *   - persisted via first-party cookie (no third-party tracker)
 *   - accept-all / customize / reject-all options
 */

const FIXED_TS = '2026-05-10T00:00:00.000Z';

describe('consent-store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FIXED_TS));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('defaultConsent', () => {
    it('enables strictly-necessary categories and disables every other category', () => {
      const c = defaultConsent();
      expect(c.categories.necessary).toBe(true);
      expect(c.categories.functional).toBe(false);
      expect(c.categories.analytics).toBe(false);
      expect(c.categories.marketing).toBe(false);
      expect(c.version).toBeGreaterThanOrEqual(1);
      expect(c.decidedAt).toBeNull();
    });

    it('marks "necessary" as a STRICTLY_NECESSARY_CATEGORY', () => {
      expect(STRICTLY_NECESSARY_CATEGORIES).toContain('necessary');
    });
  });

  describe('serialize / parse round-trip', () => {
    it('round-trips a customized state', () => {
      const original: ConsentState = {
        version: 1,
        decidedAt: FIXED_TS,
        categories: {
          necessary: true,
          functional: true,
          analytics: false,
          marketing: false,
        },
      };
      const serialized = serializeConsent(original);
      const parsed = parseConsent(serialized);
      expect(parsed).toEqual(original);
    });

    it('returns defaultConsent() when the cookie value is malformed', () => {
      const fallback = parseConsent('not-json');
      expect(fallback.decidedAt).toBeNull();
      expect(fallback.categories.necessary).toBe(true);
      expect(fallback.categories.analytics).toBe(false);
    });

    it('returns defaultConsent() for null / empty cookie', () => {
      expect(parseConsent(null).decidedAt).toBeNull();
      expect(parseConsent('').decidedAt).toBeNull();
    });

    it('forces necessary=true even if a tampered cookie disables it', () => {
      const tampered = JSON.stringify({
        version: 1,
        decidedAt: FIXED_TS,
        categories: {
          necessary: false,
          functional: false,
          analytics: false,
          marketing: false,
        },
      });
      const parsed = parseConsent(tampered);
      expect(parsed.categories.necessary).toBe(true);
    });
  });

  describe('consentEnabled', () => {
    it('returns true for necessary regardless of state', () => {
      const c = defaultConsent();
      expect(consentEnabled(c, 'necessary')).toBe(true);
    });

    it('returns false for opt-in categories until decidedAt is set', () => {
      const c = defaultConsent();
      expect(consentEnabled(c, 'analytics')).toBe(false);
    });

    it('returns true for analytics once explicitly enabled', () => {
      const c: ConsentState = {
        version: 1,
        decidedAt: FIXED_TS,
        categories: {
          necessary: true,
          functional: true,
          analytics: true,
          marketing: false,
        },
      };
      expect(consentEnabled(c, 'analytics')).toBe(true);
      expect(consentEnabled(c, 'marketing')).toBe(false);
    });
  });

  describe('GPC signal', () => {
    it('detectGPC returns true when navigator.globalPrivacyControl is true', () => {
      const fakeNavigator = {
        globalPrivacyControl: true,
      } as unknown as Navigator;
      expect(detectGPC(fakeNavigator)).toBe(true);
    });

    it('detectGPC returns false otherwise', () => {
      const fakeNavigator = {} as unknown as Navigator;
      expect(detectGPC(fakeNavigator)).toBe(false);
    });

    it('applyGPCDefaults forces marketing/analytics off and stamps decidedAt', () => {
      const c = defaultConsent();
      const after = applyGPCDefaults(c);
      expect(after.categories.necessary).toBe(true);
      expect(after.categories.analytics).toBe(false);
      expect(after.categories.marketing).toBe(false);
      // GPC opt-out is a recorded decision, not an unset state.
      expect(after.decidedAt).toBe(FIXED_TS);
    });
  });

  describe('cookie name', () => {
    it('exports CONSENT_COOKIE = "vc-consent"', () => {
      expect(CONSENT_COOKIE).toBe('vc-consent');
    });
  });
});
