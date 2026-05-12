import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin";
import { CatalogUnavailableError } from "@/lib/catalog";
import { updateCatalogItem } from "@/lib/db/catalog-items";
import { parseCatalogItem } from "@/lib/validation/catalog";

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
  const parsed = parseCatalogItem(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid catalog entry." },
      { status: 400 }
    );
  }

  let item = null;

  try {
    item = await updateCatalogItem(id, {
      ...parsed.data,
      reviewedBy: session.adminId
    });
  } catch (error) {
    if (error instanceof CatalogUnavailableError) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 503 }
      );
    }

    throw error;
  }

  if (!item) {
    return NextResponse.json(
      { ok: false, message: "Catalog item not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, item });
}
