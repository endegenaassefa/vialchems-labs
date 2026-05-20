/**
 * v5 Phase 4 — Lighthouse CI thresholds per Iron Law 2.27 + 2.42.
 *
 * v5 raises v4 floor to production-grade for 200K-impression launch:
 *   - Performance      desktop ≥ 0.95 / mobile ≥ 0.92
 *   - Accessibility    ≥ 0.98
 *   - SEO              ≥ 0.98
 *   - Best Practices   ≥ 0.98
 *   - LCP < 2.0s on 4G mobile (was 2.5s)
 *   - CLS < 0.05 (was 0.10)
 *   - TBT < 100ms (was 200ms)
 *   - FCP < 1.5s (was 1.8s)
 *   - TTFB < 500ms (was 800ms)
 *
 * The CI workflow at .github/workflows/lighthouse.yml builds the app,
 * starts `npm start` on port 3200, and runs `lhci autorun` against the
 * URL list per form_factor (desktop + mobile via matrix). PR-blocking —
 * a single threshold breach blocks merge.
 *
 * LHCI_FORM_FACTOR env switches between desktop + mobile presets.
 */

const formFactor =
  process.env.LHCI_FORM_FACTOR === "mobile" ? "mobile" : "desktop";
const performanceTarget = formFactor === "mobile" ? 0.92 : 0.95;

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
        "categories:best-practices": ["error", { minScore: 0.98 }],
        "categories:seo": ["error", { minScore: 0.98 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1500 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-blocking-time": ["error", { maxNumericValue: 100 }],
        "server-response-time": ["error", { maxNumericValue: 500 }],
        "total-byte-weight": ["warn", { maxNumericValue: 800000 }],
        interactive: ["warn", { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
