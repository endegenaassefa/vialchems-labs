"use client";

import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";

import {
  catalogAvailabilityOptions,
  catalogDocumentationOptions
} from "@/lib/content/catalog";
import { formatPrice } from "@/lib/catalog";
import type { CatalogItem, CatalogItemInput } from "@/lib/db/types";

function payloadFromForm(form: HTMLFormElement): CatalogItemInput {
  const data = new FormData(form);

  return {
    documentationStatus: String(
      data.get("documentationStatus") ?? ""
    ) as CatalogItem["documentationStatus"],
    availabilityStatus: String(
      data.get("availabilityStatus") ?? ""
    ) as CatalogItem["availabilityStatus"],
    visibleToApproved: data.get("visibleToApproved") === "on",
    checkoutEnabled: data.get("checkoutEnabled") === "on"
  };
}

export function AdminCatalogManager({
  initialItems,
  initialError = ""
}: {
  initialItems: CatalogItem[];
  initialError?: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState(initialError);
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState("");

  async function updateItem(id: string, form: HTMLFormElement) {
    setError("");
    setMessage("");
    setLoadingId(id);

    const response = await fetch(`/api/admin/catalog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadFromForm(form))
    });

    setLoadingId("");

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      setError(payload?.message ?? "Catalog entry was not updated.");
      return;
    }

    const result = (await response.json()) as { item: CatalogItem };
    setItems((current) =>
      current.map((item) => (item.id === id ? result.item : item))
    );
    setMessage(`${result.item.catalogCode} metadata updated.`);
  }

  return (
    <section
      className="admin-subpanel stack"
      aria-labelledby="catalog-admin-title"
    >
      <div>
        <p className="eyebrow">Canonical catalog</p>
        <h2 id="catalog-admin-title">Catalog controls</h2>
        <p className="subtle">
          The storefront fixture owns slug, SKU, title, summary, and pricing.
          Admin can review canonical rows and adjust the metadata that controls
          qualified visibility.
        </p>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}
      {message ? <div className="alert alert-success">{message}</div> : null}

      <div className="admin-catalog-list">
        {items.map((item) => (
          <form
            className="catalog-edit-card"
            key={item.id}
            onSubmit={(event) => {
              event.preventDefault();
              updateItem(item.id, event.currentTarget);
            }}
          >
            <div className="catalog-card-header">
              <div>
                <p className="eyebrow">{item.categoryTitle}</p>
                <h3>{item.title}</h3>
                <p className="subtle">
                  {item.catalogCode} · {formatPrice(item.priceCents)} / vial ·{" "}
                  {item.active ? "Active" : "Inactive"}
                </p>
              </div>
              <span className="status-pill">
                {item.visibleToApproved ? (
                  <Eye size={14} aria-hidden="true" />
                ) : (
                  <EyeOff size={14} aria-hidden="true" />
                )}
                {item.visibleToApproved ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="catalog-admin-form catalog-admin-form-compact">
              <div className="field">
                <label>Slug</label>
                <p className="subtle">{item.slug}</p>
              </div>
              <div className="field">
                <label>Summary</label>
                <p className="subtle">{item.neutralDescriptor}</p>
              </div>
              <div className="field">
                <label>Qualified storefront visibility</label>
                <p className="subtle">
                  {item.visibleToApproved
                    ? "Visible to qualified customers"
                    : "Hidden from qualified customers"}
                </p>
              </div>
              <div className="field">
                <label>Pilot checkout</label>
                <p className="subtle">
                  {item.checkoutEnabled
                    ? "Eligible for the hosted checkout pilot"
                    : "Manual request only"}
                </p>
              </div>
              <div className="field">
                <label htmlFor={`documentation-${item.id}`}>Documentation</label>
                <select
                  defaultValue={item.documentationStatus}
                  id={`documentation-${item.id}`}
                  name="documentationStatus"
                  required
                >
                  {catalogDocumentationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor={`availability-${item.id}`}>Availability</label>
                <select
                  defaultValue={item.availabilityStatus}
                  id={`availability-${item.id}`}
                  name="availabilityStatus"
                  required
                >
                  {catalogAvailabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <label
                className="check-row catalog-check"
                htmlFor={`visible-${item.id}`}
              >
                <input
                  defaultChecked={item.visibleToApproved}
                  id={`visible-${item.id}`}
                  name="visibleToApproved"
                  type="checkbox"
                />
                <span>Visible in qualified storefront</span>
              </label>
              <label
                className="check-row catalog-check"
                htmlFor={`checkout-${item.id}`}
              >
                <input
                  defaultChecked={item.checkoutEnabled}
                  id={`checkout-${item.id}`}
                  name="checkoutEnabled"
                  type="checkbox"
                />
                <span>Eligible for pilot checkout</span>
              </label>
              <button
                className="button button-secondary"
                disabled={loadingId === item.id}
                type="submit"
              >
                <Save size={16} aria-hidden="true" />
                {loadingId === item.id ? "Saving..." : "Save metadata"}
              </button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
