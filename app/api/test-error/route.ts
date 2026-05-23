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

  // Surface as 500 so the operator's curl sees the failure + the
  // Vercel logs also surface the synthetic error.
  return NextResponse.json(
    {
      ok: false,
      code: "sentry_probe_fired",
      message:
        "Synthetic exception captured. Check the Sentry dashboard for a " +
        "SentryProbeError event within ~1 minute.",
    },
    { status: 500 },
  );
}
