import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  AGE_VERIFICATION_COOKIE,
  AGE_VERIFICATION_MAX_AGE_SECONDS,
  signAgeVerification,
} from "@/lib/age-verification";
import { captureException } from "@/lib/sentry";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  Sentry.addBreadcrumb({
    category: "webhook",
    level: "info",
    message: "age_gate_verify_entry",
    data: { route: "age_gate_verify" },
  });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const termsAccepted =
    typeof body === "object" &&
    body !== null &&
    "termsAccepted" in body &&
    body.termsAccepted === true;

  if (!termsAccepted) {
    return NextResponse.json(
      { ok: false, error: "terms_required" },
      { status: 400 },
    );
  }

  try {
    const verifiedAt = new Date().toISOString();
    const cookieValue = await signAgeVerification(verifiedAt);
    const response = NextResponse.json({ ok: true, verifiedAt });

    response.cookies.set({
      name: AGE_VERIFICATION_COOKIE,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AGE_VERIFICATION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (err) {
    captureException(err, {
      tags: { route: "age_gate_verify" },
    });
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 },
    );
  }
}

export async function DELETE(): Promise<Response> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AGE_VERIFICATION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
