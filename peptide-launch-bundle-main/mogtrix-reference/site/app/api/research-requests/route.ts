import { NextResponse } from "next/server";
import {
  buildResearchRequestMeta,
  buildResearchRequestWriteInput,
  validateResearchRequestSubmission
} from "@/lib/request.server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";

function requiresSupabase() {
  return process.env.REQUIRE_SUPABASE === "true";
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: "POST, OPTIONS"
    }
  });
}

function mapRequestError(message: string) {
  const normalized = message.toUpperCase();

  if (normalized.includes("RATE_LIMITED")) {
    return { status: 429, error: "Too many request attempts from this network. Wait a few minutes and retry." };
  }

  if (normalized.includes("INVALID_PRODUCT_IDS")) {
    return { status: 400, error: "One or more requested products are no longer available. Refresh the catalog and retry." };
  }

  if (
    normalized.includes("REQUEST_ITEMS_REQUIRED")
    || normalized.includes("CONSENT_LOGS_REQUIRED")
    || normalized.includes("INVALID_REQUEST_ITEMS")
    || normalized.includes("INVALID_CONSENT_LOGS")
    || normalized.includes("IDEMPOTENCY_KEY_REQUIRED")
  ) {
    return { status: 400, error: "Invalid research request payload." };
  }

  return { status: 500, error: "The request could not be saved. Check the connection and retry." };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid research request payload." }, { status: 400 });
  }

  const validation = validateResearchRequestSubmission(payload);
  if (!validation.ok || !validation.submission) {
    return NextResponse.json({
      error: "Invalid research request payload.",
      details: validation.errors
    }, { status: 400 });
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    if (requiresSupabase()) {
      return NextResponse.json({
        error: "Request intake is not connected to the production database. Try again later."
      }, { status: 503 });
    }

    return NextResponse.json({
      id: validation.submission.clientRequestId,
      status: "pending_review",
      mode: "local-demo"
    });
  }

  const writeInput = buildResearchRequestWriteInput(
    validation.submission,
    buildResearchRequestMeta(request, "web-request-form")
  );

  const { data, error } = await supabase.rpc("create_research_order_request", {
    p_contact_name: writeInput.contactName,
    p_organization: writeInput.organization,
    p_email: writeInput.email,
    p_project_summary: writeInput.projectSummary,
    p_items: writeInput.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity
    })),
    p_consent_logs: writeInput.consentLogs.map((log) => ({
      attestation_id: log.attestationId,
      clause: log.clause,
      accepted: log.accepted,
      accepted_at: log.acceptedAt,
      source: log.source
    })),
    p_idempotency_key: writeInput.idempotencyKey,
    p_request_origin: writeInput.requestOrigin,
    p_origin_ip_hash: writeInput.originIpHash,
    p_user_agent: writeInput.userAgent
  });

  if (error) {
    const mapped = mapRequestError(error.message);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.id || !row?.status) {
    return NextResponse.json({ error: "The request could not be saved. Check the connection and retry." }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: row.id,
      status: row.status,
      duplicate: Boolean(row.duplicate),
      mode: "supabase"
    },
    { status: row.duplicate ? 200 : 201 }
  );
}
