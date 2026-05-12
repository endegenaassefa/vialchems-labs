import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { updateAccessRequest } from "@/lib/db/access-requests";

const updateSchema = z.object({
  status: z.enum(["pending", "approved", "denied"])
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();

  if (!session.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid status." },
      { status: 400 }
    );
  }

  const updated = await updateAccessRequest(id, {
    status: parsed.data.status,
    reviewedBy: session.adminId
  });

  if (!updated) {
    return NextResponse.json(
      { ok: false, message: "Request not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, request: updated });
}
