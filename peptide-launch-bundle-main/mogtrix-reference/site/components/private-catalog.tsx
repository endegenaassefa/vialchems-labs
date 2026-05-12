import { Eye, EyeOff, FileCheck2, LockKeyhole } from "lucide-react";

import {
  getAvailabilityLabel,
  getDocumentationLabel
} from "@/lib/content/catalog";
import { formatPrice } from "@/lib/catalog";
import type { CatalogItem } from "@/lib/db/types";

export function PrivateCatalog({
  items,
  error = ""
}: {
  items: CatalogItem[];
  error?: string;
}) {
  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <LockKeyhole size={15} aria-hidden="true" />
            Admin review
          </p>
          <h1>Canonical catalog review</h1>
        </div>
        <p>
          Review the seeded product records that drive the qualified storefront.
          Prices are canonical here. Metadata controls whether each record is
          visible to qualified customers.
        </p>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {!items.length ? (
        <div className="alert">
          No canonical catalog records are available for admin review.
        </div>
      ) : (
        <div className="catalog-grid">
          {items.map((item) => (
            <article className="catalog-card" key={item.id}>
              <div className="catalog-card-header">
                <div>
                  <p className="eyebrow">{item.categoryTitle}</p>
                  <h2>{item.title}</h2>
                </div>
                <span className="catalog-code">{item.catalogCode}</span>
              </div>
              <p>{item.neutralDescriptor}</p>
              <ul className="tag-list">
                <li>
                  <FileCheck2 size={14} aria-hidden="true" />
                  {getDocumentationLabel(item.documentationStatus)}
                </li>
                <li>{getAvailabilityLabel(item.availabilityStatus)}</li>
                <li>{formatPrice(item.priceCents)} / vial</li>
                <li>{item.active ? "Active" : "Inactive"}</li>
                <li>
                  {item.visibleToApproved ? (
                    <>
                      <Eye size={14} aria-hidden="true" /> Visible in qualified
                      shop
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} aria-hidden="true" /> Hidden from
                      qualified shop
                    </>
                  )}
                </li>
              </ul>
              <div className="catalog-actions">
                <span className="subtle">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </span>
                <span className="subtle">Slug: {item.slug}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
