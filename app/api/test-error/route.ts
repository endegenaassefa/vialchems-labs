/**
 * D2 verification endpoint (super-prompt §6 D2)
 * --------------------------------------------
 * Triggers a synthetic exception so the operator can confirm the
 * Sentry pipeline is wired and the PII scrubber is doing its job.
 * The super-prompt's D2 success criteria:
 *
 *   > Trigger a test exception (curl /api/test-error) and verify it
 *   > shows up in Sentry within 1 minute.
 *
 * The route is shipped to production but token-gated so a random
 * visitor can't fill the Sentry queue. The operator runs:
 *
 *   curl -i 'https://vialchemlabs.net/api/test-error?token=vc-sentry-probe'
 *
 * and watches the Sentry dashboard for a `SentryProbeError` event
 * tagged `route=test-error`, `probe=sentry`. If the event arrives
 * with no PII in the payload (no headers, no body, no email), the
 * Iron Law 2.32 PII scrubber is also confirmed working.
 *
 * Returns 500 with a JSON body so the operator's curl reports a
 * recognizable failure (Vercel logs surface the 500 too).
 */
import { NextResponse, type NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { captureException } from "@/lib/sentry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROBE_TOKEN = "vc-sentry-probe";

class SentryProbeError extends Error {
  readonly probe = "sentry" as const;
  constructor(message: string) {
    super(message);
    this.name = "SentryProbeError";
  }
}

export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token");
  if (token !== PROBE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        code: "forbidden",
        hint: "Add ?token=vc-sentry-probe to fire the Sentry probe.",
      },
      { status: 403 },
    );
  }

  // Diagnostic checkpoints — surface the exact reason if the event
  // ever fails to reach the Sentry dashboard. Captured in the
  // response body so the operator can curl + see what the runtime
  // observed without needing log access.
  const dsnPresent = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
  const dsnSnippet = process.env.NEXT_PUBLIC_SENTRY_DSN
    ? `${process.env.NEXT_PUBLIC_SENTRY_DSN.slice(0, 12)}...@...${process.env.NEXT_PUBLIC_SENTRY_DSN.slice(-12)}`
    : null;
  const clientInitialized = Boolean(Sentry.getClient());
  const sentryEnv = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown";
  const nextRuntime = process.env.NEXT_RUNTIME ?? "unset";

  const err = new SentryProbeError(
    "VialChem Labs Sentry probe — intentional synthetic exception. " +
      "If you see this in Sentry, the pipeline is wired correctly.",
  );

  captureException(err, {
    tags: { route: "test-error", probe: "sentry" },
    extra: {
      vc_probe_timestamp: new Date().toISOString(),
      vc_probe_note: "intentional — see super-prompt §6 D2",
    },
  });

  // Force-flush before returning. In serverless (Vercel), the worker
  // is frozen the moment we return — any in-flight Sentry HTTP send
  // gets dropped. Sentry.flush(2000) waits up to 2 seconds for the
  // event queue to drain to the ingest endpoint. Returns true if all
  // events transmitted, false if the timeout fired (events were
  // pending). This is the classic Sentry-in-serverless gotcha that
  // the v10 instrumentation hook does NOT auto-handle for ad-hoc
  // captureException calls in route handlers.
  let flushed: boolean | null = null;
  let flushError: string | null = null;
  try {
    flushed = await Sentry.flush(2000);
  } catch (e) {
    flushError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(
    {
      ok: false,
      code: "sentry_probe_fired",
      message:
        "Synthetic exception captured. Check the Sentry dashboard for a " +
        "SentryProbeError event within ~1 minute.",
      diagnostics: {
        dsn_env_present: dsnPresent,
        dsn_snippet: dsnSnippet,
        client_initialized: clientInitialized,
        flush_returned: flushed,
        flush_error: flushError,
        sentry_environment: sentryEnv,
        next_runtime: nextRuntime,
        captured_at: new Date().toISOString(),
      },
    },
    { status: 500 },
  );
}
