import type {
  CatalogAvailabilityStatus,
  CatalogDocumentationStatus
} from "@/lib/db/types";

export const catalogDocumentationOptions: Array<{
  value: CatalogDocumentationStatus;
  label: string;
}> = [
  { value: "coa-ready", label: "COA-ready record" },
  { value: "document-review", label: "Document review" },
  { value: "pending-records", label: "Pending records" }
];

export const catalogAvailabilityOptions: Array<{
  value: CatalogAvailabilityStatus;
  label: string;
}> = [
  { value: "requestable", label: "Requestable" },
  { value: "limited-review", label: "Limited review" },
  { value: "not-available", label: "Not available" }
];

export function getDocumentationLabel(status: CatalogDocumentationStatus) {
  return (
    catalogDocumentationOptions.find((option) => option.value === status)
      ?.label ?? status
  );
}

export function getAvailabilityLabel(status: CatalogAvailabilityStatus) {
  return (
    catalogAvailabilityOptions.find((option) => option.value === status)
      ?.label ?? status
  );
}

