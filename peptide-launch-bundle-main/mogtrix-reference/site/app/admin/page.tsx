import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdmin } from "@/lib/auth/admin";
import { CatalogUnavailableError } from "@/lib/catalog";
import { listAccessRequests } from "@/lib/db/access-requests";
import { listCatalogItems } from "@/lib/db/catalog-items";
import { listPendingStaffProfiles } from "@/lib/staff-access-admin";

export const metadata: Metadata = {
  title: "Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();

  if (!session.ok) {
    redirect("/admin/login");
  }

  let catalogError = "";
  const [catalogItems, requests, staffAccess] = await Promise.all([
    listCatalogItems({ includeHidden: true }).catch((error) => {
      if (error instanceof CatalogUnavailableError) {
        catalogError = error.message;
        return [];
      }

      throw error;
    }),
    listAccessRequests(),
    listPendingStaffProfiles()
  ]);

  return (
    <section className="section">
      <div className="container">
        <AdminDashboard
          catalogItems={catalogItems}
          catalogError={catalogError}
          requests={requests}
          staffAccessConfigured={staffAccess.configured}
          pendingStaffProfiles={staffAccess.pendingProfiles}
        />
      </div>
    </section>
  );
}
