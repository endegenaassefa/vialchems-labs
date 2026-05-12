/**
 * Phase 11 (v4) — Playwright config for the unskipped E2E suite.
 *
 * Closes deferral D16. CI workflow at .github/workflows/e2e.yml runs
 * `npx playwright install --with-deps` and then `npx playwright test`
 * against a Next dev server fixture on port 3200.
 *
 * Iron Law 2.18 / 2.25: visual-regression diffs above 0.1% pixel
 * threshold require operator approval before merge — enforced via the
 * CI job posting diffs as a PR comment artifact + branch protection
 * rule (Phase 12).
 */
import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PLAYWRIGHT_PORT ?? "3200";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Vialchems Labs is dark-only (Posture A); default scheme is dark
    // for non-visual-regression specs.
    colorScheme: "dark",
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001, // 0.1% (Iron Law 2.18 default)
      animations: "disabled",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Phase 12+: add 'webkit' + 'firefox' projects after the Chromium
    // baseline is operator-approved.
  ],
  webServer: process.env.CI
    ? {
        command: "npm run start",
        port: parseInt(PORT, 10),
        timeout: 120_000,
        reuseExistingServer: false,
      }
    : {
        command: `npx next dev -p ${PORT} -H 0.0.0.0`,
        port: parseInt(PORT, 10),
        timeout: 120_000,
        reuseExistingServer: true,
      },
});
