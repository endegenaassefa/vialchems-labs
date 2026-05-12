import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { activateStaffProfile } from "@/lib/staff-access-admin";

const actionSchema = z.object({
  action: z.literal("activate")
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();

  if (!session.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = actionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid staff action." },
      { status: 400 }
    );
  }

  const { id } = await context.params;
  const result = await activateStaffProfile(id);

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
