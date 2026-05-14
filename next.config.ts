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

// Security response headers (CSO interim hardening, 2026-05-14).
//
// The strict directives below — frame-ancestors, base-uri, object-src,
// form-action, and the connect-src allowlist — are the ones that actually
// shrink the XSS blast radius (the ops panel and storefront share an origin,
// so any storefront XSS reaches ops). script-src/style-src keep
// 'unsafe-inline' because this CSP has NOT been browser-verified yet — the
// dev server still needs to be moved onto the consolidation branch. Once it
// is, tighten script-src to a nonce/hash and drop 'unsafe-inline'.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://*.ingest.sentry.io",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
