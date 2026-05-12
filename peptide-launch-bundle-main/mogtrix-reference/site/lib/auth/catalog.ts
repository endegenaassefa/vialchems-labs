import "server-only";

import type { AdminSession } from "@/lib/db/types";
import { requireAdmin } from "@/lib/auth/admin";

export async function requireCatalogAccess(): Promise<AdminSession> {
  return requireAdmin();
}
