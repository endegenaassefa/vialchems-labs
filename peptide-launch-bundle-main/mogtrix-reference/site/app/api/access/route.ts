import { NextResponse } from "next/server";

import { createAccessRequest } from "@/lib/db/access-requests";
import { getFieldErrors, parseAccessRequest } from "@/lib/validation/access";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = parseAccessRequest(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Check required fields and acknowledgements.",
        errors: getFieldErrors(parsed.error)
      },
      { status: 400 }
    );
  }

  try {
    const accessRequest = await createAccessRequest(parsed.data);
    return NextResponse.json({ ok: true, request: accessRequest });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "The access request could not be saved."
      },
      { status: 500 }
    );
  }
}
