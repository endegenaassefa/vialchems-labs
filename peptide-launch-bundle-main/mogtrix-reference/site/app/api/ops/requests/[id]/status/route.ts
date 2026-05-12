import { NextResponse } from "next/server";
import { getStaffSessionState, validateRequestStatusTransitionInput } from "@/lib/ops";

function mapTransitionError(message: string) {
  const normalized = message.toUpperCase();

  if (normalized.includes("REQUEST_NOT_FOUND")) {
    return { status: 404, error: "That request no longer exists." };
  }

  if (normalized.includes("NO_OP_STATUS")) {
    return { status: 400, error: "Choose a different status before saving." };
  }

  if (normalized.includes("INVALID_STATUS")) {
    return { status: 400, error: "Choose a valid request status." };
  }

  if (normalized.includes("NOTE_TOO_LONG")) {
    return { status: 400, error: "Keep the status note under 1000 characters." };
  }

  return { status: 500, error: "The request status could not be updated." };
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getStaffSessionState();

  if (session.kind === "unavailable") {
    return NextResponse.json({ error: "Ops auth is unavailable until Supabase public keys are configured." }, { status: 503 });
  }

  if (session.kind === "anonymous") {
    return NextResponse.json({ error: "Sign in to update request statuses." }, { status: 401 });
  }

  if (session.kind === "forbidden") {
    return NextResponse.json({ error: "This account is not an active Mogtrix operator." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request status payload." }, { status: 400 });
  }

  const validation = validateRequestStatusTransitionInput(payload);
  if (!validation.ok || !validation.input) {
    return NextResponse.json({
      error: validation.errors[0] ?? "Invalid request status payload.",
      details: validation.errors
    }, { status: 400 });
  }

  const { id } = await context.params;
  const { data, error } = await session.supabase.rpc("transition_research_request_status", {
    p_request_id: id,
    p_next_status: validation.input.nextStatus,
    p_note: validation.input.note ?? null
  });

  if (error) {
    const mapped = mapTransitionError(error.message);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.id || !row?.status) {
    return NextResponse.json({ error: "The request status could not be updated." }, { status: 500 });
  }

  return NextResponse.json({
    id: row.id,
    status: row.status,
    lastStatusChangedAt: row.last_status_changed_at ?? null
  });
}
