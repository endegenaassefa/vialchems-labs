/**
 * Phase 11 (I2 super-prompt 2026-05-22) — Lighthouse CI thresholds
 * tuned for soft-launch reality.
 *
 * The v5 thresholds (perf desktop ≥ 0.95 / mobile ≥ 0.92, all
 * categories ≥ 0.98, LCP < 2.0s) were aspirational and have been
 * breaking CI on every PR since v5 landed. Super-prompt §6 I2
 * authorizes relaxing to realistic-but-strict floors:
 *
 *   - Performance      desktop ≥ 0.90 / mobile ≥ 0.85 (min 80 floor)
 *   - Accessibility    ≥ 0.98 (unchanged)
 *   - Best Practices   ≥ 0.95
 *   - SEO              ≥ 0.95
 *   - LCP < 2.5s mobile (Web Vitals "good" threshold)
 *   - CLS < 0.10 (Web Vitals "good")
 *   - TBT < 200ms
 *   - FCP < 1.8s
 *   - TTFB < 800ms
 *
 * These match the v4 baseline that was passing pre-v5; v5's
 * tightened-then-broke pattern reverts to v4 with a small
 * accessibility uplift (0.95 → 0.98). PROTECTED — operator opted
 * into this relaxation per the super-prompt's "minimum 80" floor.
 *
 * The CI workflow at .github/workflows/lighthouse.yml builds the
 * app, starts `npm start` on port 3200, and runs `lhci autorun`
 * against the URL list per form_factor (desktop + mobile via matrix).
 *
 * LHCI_FORM_FACTOR env switches between desktop + mobile presets.
 */

const formFactor =
  process.env.LHCI_FORM_FACTOR === "mobile" ? "mobile" : "desktop";
const performanceTarget = formFactor === "mobile" ? 0.85 : 0.9;

/** @type {import('@lhci/cli').LighthouseCIConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start -- -p 3200",
      url: [
        "http://127.0.0.1:3200/",
        "http://127.0.0.1:3200/shop",
        "http://127.0.0.1:3200/products/bpc-157-10mg",
        "http://127.0.0.1:3200/products/recovery-stack",
        "http://127.0.0.1:3200/products/recovery-pair",
        "http://127.0.0.1:3200/coa",
        "http://127.0.0.1:3200/blog",
        "http://127.0.0.1:3200/blog/reading-a-coa",
        "http://127.0.0.1:3200/faq",
        "http://127.0.0.1:3200/about",
      ],
      numberOfRuns: 3,
      settings: {
        preset: formFactor,
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: performanceTarget }],
        "categories:accessibility": ["error", { minScore: 0.98 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
        "server-response-time": ["error", { maxNumericValue: 800 }],
        "total-byte-weight": ["warn", { maxNumericValue: 1500000 }],
        interactive: ["warn", { maxNumericValue: 3800 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
