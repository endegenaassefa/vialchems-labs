import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin";

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  void request;

  return NextResponse.json(
    {
      ok: false,
      message:
        "Canonical catalog rows are seeded from the storefront fixture and cannot be created here."
    },
    { status: 405 }
  );
}
