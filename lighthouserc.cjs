/**
 * Phase 11.4 (v4) — Lighthouse CI thresholds per Iron Law 2.27.
 *
 * Per-page targets (every URL in `collect.url`):
 *   - Performance      ≥ 90 (mobile + desktop)
 *   - Accessibility    ≥ 95
 *   - SEO              ≥ 95
 *   - Best Practices   ≥ 95
 *   - LCP < 2.5s on 4G mobile
 *   - CLS < 0.1
 *   - INP / TBT proxy < 200ms (Lighthouse exposes TBT, not INP, in lab data)
 *   - FCP < 1.8s
 *   - TTFB < 800ms
 *
 * The CI workflow at .github/workflows/lighthouse.yml builds the app,
 * starts `npm start` on port 3200, and runs `lhci autorun` against the
 * URL list. PR-blocking — a single threshold breach blocks merge.
 */

/** @type {import('@lhci/cli').LighthouseCIConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start -- -p 3200',
      url: [
        'http://127.0.0.1:3200/',
        'http://127.0.0.1:3200/shop',
        'http://127.0.0.1:3200/products/bpc-157-10mg',
        'http://127.0.0.1:3200/products/recovery-stack',
        'http://127.0.0.1:3200/coa',
        'http://127.0.0.1:3200/blog',
        'http://127.0.0.1:3200/blog/reading-a-coa',
        'http://127.0.0.1:3200/faq',
        'http://127.0.0.1:3200/about',
        'http://127.0.0.1:3200/cart',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // Override for an additional mobile pass via the matrix below;
        // emulatedFormFactor=mobile is set in the assertion-only job.
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'server-response-time': ['error', { maxNumericValue: 800 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
