/**
 * Phase 10.1 (v4) — D7 qualification persistence endpoint.
 *
 * POST /api/access
 *
 * Accepts a verbatim Appendix A.5 qualification submission, runs it through
 * lib/customer-qualification.ts validateQualification (zod + marketing-copy
 * filter), and persists to Supabase customer_qualifications +
 * attestations_audit when REQUIRE_SUPABASE=true. When false (Day-1), the
 * route is a 200-no-op so the qualification flow works end-to-end against
 * the stub adapter without DB credentials.
 *
 * Iron Law 2.4 / 2.13: research-purpose copy goes through assertMarketingCopySafe
 * via the qualificationSchema refine. Iron Law 2.5 / 2.19: this file joins
 * the protected paths list. Future edits require // SCANNER_OK annotations.
 */
import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import {
  ATTESTATIONS,
  validateQualification,
} from "@/lib/customer-qualification";
import { rateLimitByIp } from "@/lib/rate-limit";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

interface AuditAttestations {
  age_21_plus: boolean;
  ruo_acknowledged: boolean;
  jurisdictional_acknowledged: boolean;
  attestations_block_acknowledged: boolean;
}

async function sha256Hex(input: string): Promise<string> {
  return createHash("sha256").update(input).digest("hex");
}

export async function POST(request: Request): Promise<Response> {
  // Iron Law 2.34: anti-abuse gate before any work happens.
  const ip = getClientIp(request);
  const limit = rateLimitByIp("access", ip);
  if (!limit.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        retryAfter: limit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds),
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(limit.reset),
        },
      },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, errors: [{ field: "_", message: "JSON body required" }] },
      { status: 400 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: [{ field: "_", message: "Malformed JSON" }] },
      { status: 400 },
    );
  }

  const validation = validateQualification(raw);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 400 },
    );
  }

  const data = validation.data;
  const attestationLegalText = ATTESTATIONS.join("\n");
  const attestationHash = await sha256Hex(attestationLegalText);

  const audit: AuditAttestations = {
    age_21_plus: data.ageAcknowledgment,
    ruo_acknowledged: data.ruoAcknowledgment,
    jurisdictional_acknowledged: data.jurisdictionAcknowledgment,
    attestations_block_acknowledged: data.attestationsAcknowledged,
  };

  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  const sb = serviceSupabase();
  let qualificationId = randomUUID();

  if (sb) {
    const { data: inserted, error } = await sb
      .from("customer_qualifications")
      .insert({
        email: data.email,
        payload: data,
        attestation_text_sha256: attestationHash,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          errors: [
            {
              field: "_",
              message: `Persistence error: ${error.message}`,
            },
          ],
        },
        { status: 500 },
      );
    }

    if (inserted?.id) qualificationId = inserted.id;

    await sb.from("attestations_audit").insert({
      qualification_id: qualificationId,
      email: data.email,
      attestations: audit,
      legal_text_sha256: attestationHash,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    await sb.from("audit_log").insert({
      event_type: "qualification.submitted",
      details: {
        qualification_id: qualificationId,
        role: data.role,
        attestation_text_sha256: attestationHash,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  }

  return NextResponse.json({
    ok: true,
    id: qualificationId,
    attestationTextSha256: attestationHash,
  });
}
