import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.VECTOR_DEMO_PORT ?? 4179);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e-vector",
  timeout: 45_000,
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  webServer: {
    command: `node scripts/serve-vector-demo.mjs --port=${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 15"] }
    }
  ]
});
