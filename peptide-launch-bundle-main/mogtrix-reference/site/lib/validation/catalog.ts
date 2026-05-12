import { z } from "zod";

export const catalogItemSchema = z.object({
  documentationStatus: z.enum([
    "coa-ready",
    "document-review",
    "pending-records"
  ]),
  availabilityStatus: z.enum([
    "requestable",
    "limited-review",
    "not-available"
  ]),
  visibleToApproved: z.boolean(),
  checkoutEnabled: z.boolean()
});

export function parseCatalogItem(input: unknown) {
  return catalogItemSchema.safeParse(input);
}
