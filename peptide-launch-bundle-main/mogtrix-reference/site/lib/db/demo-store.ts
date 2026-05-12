import "server-only";

import { productPreviews } from "@/lib/content/products";
import type {
  AccessRequest,
  AccessStatus,
  CatalogItem
} from "@/lib/db/types";

type DemoStore = {
  catalogItems: CatalogItem[];
  requests: AccessRequest[];
};

const globalForDemo = globalThis as typeof globalThis & {
  __mogtrixDemoStore?: DemoStore;
};

function demoProductCatalogItems(now: string): CatalogItem[] {
  return productPreviews.map((product, index) => ({
    id: `demo-catalog-${String(index + 1).padStart(3, "0")}`,
    slug: product.slug,
    catalogCode: product.catalogCode,
    categoryTitle: product.categoryTitle,
    title: product.name,
    neutralDescriptor: `${product.descriptor} ${product.form}, ${product.vialSize}. Batch ${product.batchId}. ${product.documentation}.`,
    priceCents: 0,
    active: true,
    documentationStatus:
      product.documentation === "COA-ready" ? "coa-ready" : "document-review",
    availabilityStatus: index < 5 ? "requestable" : "limited-review",
    visibleToApproved: true,
    checkoutEnabled: index < 5,
    submittedAt: now,
    updatedAt: now,
    source: "demo"
  }));
}

export function getDemoStore(): DemoStore {
  if (!globalForDemo.__mogtrixDemoStore) {
    const now = new Date().toISOString();
    globalForDemo.__mogtrixDemoStore = {
      catalogItems: demoProductCatalogItems(now),
      requests: [
        {
          id: "demo-request-001",
          fullName: "Demo Reviewer",
          email: "reviewer@example.test",
          company: "Example Research Group",
          industry: "Analytical / Scientific Research",
          roleTitle: "Research Scientist",
          credentials: "Internal demo credential for admin dashboard testing.",
          researchEnvironment:
            "Controlled lab environment description used for local UI review.",
          intendedUseSummary:
            "Documentation workflow review and batch verification interface testing.",
          legalName: "Demo Reviewer",
          attestations: {
            age: true,
            qualified: true,
            ruoBoundary: true,
            noPersonalUse: true,
            legalReview: true
          },
          status: "pending",
          submittedAt: now,
          updatedAt: now,
          source: "demo"
        }
      ]
    };
  }

  return globalForDemo.__mogtrixDemoStore;
}

export function addDemoRequest(
  request: Omit<AccessRequest, "id" | "status" | "submittedAt" | "updatedAt" | "source">
) {
  const now = new Date().toISOString();
  const stored: AccessRequest = {
    ...request,
    id: crypto.randomUUID(),
    status: "pending",
    submittedAt: now,
    updatedAt: now,
    source: "demo"
  };

  getDemoStore().requests.unshift(stored);
  return stored;
}

export function updateDemoRequestStatus(id: string, status: AccessStatus) {
  const store = getDemoStore();
  const match = store.requests.find((request) => request.id === id);

  if (!match) {
    return null;
  }

  match.status = status;
  match.updatedAt = new Date().toISOString();
  return match;
}
