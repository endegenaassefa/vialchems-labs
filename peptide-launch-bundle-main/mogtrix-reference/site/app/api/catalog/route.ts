import { NextResponse } from "next/server";
import { getCatalogProductsByIds, listCatalogProducts } from "@/lib/catalog.server";
import { CatalogUnavailableError } from "@/lib/catalog";
import { getCustomerAccessState } from "@/lib/customer";

export async function GET(request: Request) {
  const state = await getCustomerAccessState();
  if (state.kind === "anonymous") {
    return NextResponse.json({ error: "Sign in to view the Mogtrix catalog." }, { status: 401 });
  }
  if (state.kind === "unverified" || state.kind === "unqualified" || state.kind === "forbidden") {
    return NextResponse.json({ error: "Complete the qualification step before viewing the Mogtrix catalog." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean) ?? [];

  try {
    const products = ids.length
      ? await getCatalogProductsByIds(ids)
      : await listCatalogProducts();
    const missingIds = ids.filter(
      (id) => !products.some((product) => product.id === id)
    );

    return NextResponse.json({ products, missingIds });
  } catch (error) {
    if (!(error instanceof CatalogUnavailableError)) {
      console.error("catalog route failed", error);
    }

    return NextResponse.json(
      { error: "The Mogtrix catalog is unavailable right now." },
      { status: 503 }
    );
  }
}
