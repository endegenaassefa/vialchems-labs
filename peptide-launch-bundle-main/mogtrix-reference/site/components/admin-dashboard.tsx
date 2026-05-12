"use client";

import { useState } from "react";
import { Check, Clock3, X } from "lucide-react";

import { AdminCatalogManager } from "@/components/admin-catalog-manager";
import { StaffAccessAdminPanel } from "@/components/staff-access-admin-panel";
import { StatusPill } from "@/components/status-pill";
import type {
  AccessRequest,
  AccessStatus,
  CatalogItem
} from "@/lib/db/types";
import type { StaffProfile } from "@/lib/types";

export function AdminDashboard({
  catalogItems,
  catalogError = "",
  requests,
  staffAccessConfigured,
  pendingStaffProfiles
}: {
  catalogItems: CatalogItem[];
  catalogError?: string;
  requests: AccessRequest[];
  staffAccessConfigured: boolean;
  pendingStaffProfiles: StaffProfile[];
}) {
  const [items, setItems] = useState(requests);
  const [error, setError] = useState("");

  async function updateStatus(id: string, status: AccessStatus) {
    setError("");
    const response = await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      setError("Could not update request status.");
      return;
    }

    const result = (await response.json()) as { request: AccessRequest };
    setItems((current) =>
      current.map((item) => (item.id === id ? result.request : item))
    );
  }

  return (
    <div className="admin-panel admin-sections">
      <section className="admin-subpanel">
        <p className="eyebrow">Review queue</p>
        <h1>Access requests</h1>
        <p className="subtle">
          Review submitted attestations and move requests between pending,
          approved, and denied states.
        </p>
        {error ? <div className="alert alert-error">{error}</div> : null}
        <div className="admin-list">
          {items.map((request) => (
            <article className="admin-request" key={request.id}>
              <div className="admin-request-header">
                <div>
                  <h3>{request.fullName}</h3>
                  <p className="subtle">
                    {request.email} · {request.company || "No company listed"}
                  </p>
                </div>
                <StatusPill status={request.status} />
              </div>
              <p>
                <strong>{request.roleTitle}</strong> in {request.industry}
              </p>
              <p className="subtle">{request.researchEnvironment}</p>
              <ul className="tag-list">
                <li>Legal name: {request.legalName}</li>
                <li>Source: {request.source}</li>
                <li>{new Date(request.submittedAt).toLocaleString()}</li>
              </ul>
              <div className="admin-actions">
                <button
                  className="button button-secondary"
                  onClick={() => updateStatus(request.id, "pending")}
                  type="button"
                >
                  <Clock3 size={16} aria-hidden="true" />
                  Pending
                </button>
                <button
                  className="button button-primary"
                  onClick={() => updateStatus(request.id, "approved")}
                  type="button"
                >
                  <Check size={16} aria-hidden="true" />
                  Approve
                </button>
                <button
                  className="button button-danger"
                  onClick={() => updateStatus(request.id, "denied")}
                  type="button"
                >
                  <X size={16} aria-hidden="true" />
                  Deny
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <StaffAccessAdminPanel
        configured={staffAccessConfigured}
        initialProfiles={pendingStaffProfiles}
      />
      <AdminCatalogManager
        initialItems={catalogItems}
        initialError={catalogError}
      />
    </div>
  );
}
