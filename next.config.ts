import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Phase 9 (v4) — bundle analyzer wired behind the ANALYZE env var.
 * Phase 10.3 (v4) — Sentry HOC wraps the export. No-op when
 * NEXT_PUBLIC_SENTRY_DSN / SENTRY_AUTH_TOKEN are empty (Day-1).
 */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
};

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.SENTRY_AUTH_TOKEN,
  // Don't tunnel events through the app domain Day-1; revisit when
  // operator confirms whether ad-blockers are an observed source of
  // dropped events.
  tunnelRoute: undefined,
  hideSourceMaps: true,
  disableLogger: true,
};

export default withSentryConfig(
  withBundleAnalyzer(nextConfig),
  sentryWebpackPluginOptions,
);
