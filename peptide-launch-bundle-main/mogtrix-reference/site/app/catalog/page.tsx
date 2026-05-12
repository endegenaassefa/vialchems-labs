import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PrivateCatalog } from "@/components/private-catalog";
import { requireCatalogAccess } from "@/lib/auth/catalog";
import { CatalogUnavailableError } from "@/lib/catalog";
import { listCatalogItems } from "@/lib/db/catalog-items";

export const metadata: Metadata = {
  title: "Catalog Review"
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const session = await requireCatalogAccess();

  if (!session.ok) {
    redirect("/admin/login?next=/catalog");
  }

  let error = "";
  const items = await listCatalogItems({ includeHidden: true }).catch(
    (cause) => {
      if (cause instanceof CatalogUnavailableError) {
        error = cause.message;
        return [];
      }

      throw cause;
    }
  );

  return (
    <section className="section">
      <div className="container">
        <PrivateCatalog items={items} error={error} />
      </div>
    </section>
  );
}
