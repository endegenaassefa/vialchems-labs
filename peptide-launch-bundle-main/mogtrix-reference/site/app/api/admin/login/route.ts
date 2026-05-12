import { NextResponse } from "next/server";

import { loginWithPasscode } from "@/lib/auth/admin";

function safeRedirectPath(value: FormDataEntryValue | null) {
  const redirectTo = typeof value === "string" ? value : "";
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/admin";
  }

  return redirectTo;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    const result = await loginWithPasscode(String(form.get("passcode") ?? ""));

    if (!result.ok) {
      return NextResponse.redirect(new URL("/admin/login?error=access", request.url), {
        status: 303
      });
    }

    return NextResponse.redirect(new URL(safeRedirectPath(form.get("redirectTo")), request.url), {
      status: 303
    });
  }

  const body = (await request.json().catch(() => ({}))) as { passcode?: string };
  const result = await loginWithPasscode(body.passcode ?? "");

  if (!result.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
