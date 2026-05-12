import { NextResponse } from "next/server";

import { getStaffSessionState, validateStaffNoteInput } from "@/lib/ops";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getStaffSessionState();

  if (session.kind === "unavailable") {
    return NextResponse.json({ error: "Ops auth is unavailable until Supabase public keys are configured." }, { status: 503 });
  }

  if (session.kind === "anonymous") {
    return NextResponse.json({ error: "Sign in to add internal notes." }, { status: 401 });
  }

  if (session.kind === "forbidden") {
    return NextResponse.json({ error: "This account is not an active Mogtrix operator." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid note payload." }, { status: 400 });
  }

  const validation = validateStaffNoteInput(payload);
  if (!validation.ok || !validation.input) {
    return NextResponse.json({
      error: validation.errors[0] ?? "Invalid note payload.",
      details: validation.errors
    }, { status: 400 });
  }

  const { id } = await context.params;
  const { data, error } = await session.supabase
    .from("order_staff_notes")
    .insert({
      order_id: id,
      author_profile_id: session.profile.id,
      body: validation.input.body
    })
    .select("id, order_id, author_profile_id, body, created_at, updated_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "The note could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ note: data }, { status: 201 });
}
