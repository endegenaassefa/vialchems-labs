import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseHost = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).host : "*.supabase.co";
  } catch {
    return "*.supabase.co";
  }
})();
const shouldUpgradeInsecureRequests = process.env.NODE_ENV === "production" && siteUrl.startsWith("https://");

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://vitals.vercel-insights.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.sentry.io`,
  "worker-src 'self' blob:",
  "media-src 'self'",
  "manifest-src 'self'",
  ...(shouldUpgradeInsecureRequests ? ["upgrade-insecure-requests"] : [])
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders
      }
    ];
  }
};

const sentryDisabled = !process.env.SENTRY_AUTH_TOKEN || !process.env.NEXT_PUBLIC_SENTRY_DSN;

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  sourcemaps: {
    disable: sentryDisabled
  }
});
