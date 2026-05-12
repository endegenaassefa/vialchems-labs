import type { AccessRequestInput } from "@/lib/validation/access";

export type AccessStatus = "pending" | "approved" | "denied";

export type AccessRequest = AccessRequestInput & {
  id: string;
  status: AccessStatus;
  submittedAt: string;
  updatedAt: string;
  source: "supabase" | "demo";
};

export type AccessRequestUpdate = {
  status: AccessStatus;
  reviewedBy: string;
};

export type CatalogDocumentationStatus =
  | "coa-ready"
  | "document-review"
  | "pending-records";

export type CatalogAvailabilityStatus =
  | "requestable"
  | "limited-review"
  | "not-available";

export type CatalogItemInput = {
  documentationStatus: CatalogDocumentationStatus;
  availabilityStatus: CatalogAvailabilityStatus;
  visibleToApproved: boolean;
  checkoutEnabled: boolean;
};

export type CatalogItem = CatalogItemInput & {
  id: string;
  slug: string;
  catalogCode: string;
  categoryTitle: string;
  title: string;
  neutralDescriptor: string;
  priceCents: number;
  active: boolean;
  checkoutEnabled: boolean;
  submittedAt: string;
  updatedAt: string;
  source: "supabase" | "demo";
};

export type CatalogItemUpdate = CatalogItemInput & {
  reviewedBy: string;
};

export type AdminSession =
  | { ok: true; adminId: string; mode: "supabase" | "demo-passcode" }
  | { ok: false; reason: "missing-session" | "not-admin" | "disabled" };
