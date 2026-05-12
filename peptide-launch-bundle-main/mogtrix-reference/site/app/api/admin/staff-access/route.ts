import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { repairStaffProfileByEmail } from "@/lib/staff-access-admin";

const repairSchema = z.object({
  email: z.string().email(),
  activate: z.boolean().optional()
});

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = repairSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const result = await repairStaffProfileByEmail(parsed.data.email, {
    activate: parsed.data.activate
  });

  if (!result.ok) {
    const status =
      result.reason === "config"
        ? 503
        : result.reason === "not_found"
          ? 404
          : 500;

    return NextResponse.json(
      { ok: false, message: result.message },
      { status }
    );
  }

  return NextResponse.json({ ok: true, result });
}
