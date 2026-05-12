"use client";

import { type FormEvent, useState } from "react";

import type { StaffProfile } from "@/lib/types";

type StaffMutationResult = {
  ok: true;
  result: {
    profile: StaffProfile;
    hadCustomerProfile: boolean;
    metadataSynced: boolean;
  };
} | {
  ok: false;
  message: string;
};

export function StaffAccessAdminPanel({
  configured,
  initialProfiles
}: {
  configured: boolean;
  initialProfiles: StaffProfile[];
}) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [repairEmail, setRepairEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [repairing, setRepairing] = useState(false);

  async function activateProfile(profileId: string) {
    setError("");
    setStatus("");
    setLoadingId(profileId);

    const response = await fetch(`/api/admin/staff-access/${profileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "activate" })
    });

    const result = (await response.json()) as StaffMutationResult;
    setLoadingId(null);

    if (!response.ok || !result.ok) {
      setError(result.ok ? "The staff profile could not be activated." : result.message);
      return;
    }

    setProfiles((current) => current.filter((item) => item.id !== profileId));
    setStatus(`Activated ${result.result.profile.email} for ops access.`);
  }

  async function repairAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setRepairing(true);

    const response = await fetch("/api/admin/staff-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: repairEmail, activate: true })
    });

    const result = (await response.json()) as StaffMutationResult;
    setRepairing(false);

    if (!response.ok || !result.ok) {
      setError(result.ok ? "The auth user could not be repaired." : result.message);
      return;
    }

    setRepairEmail("");
    setProfiles((current) =>
      current.filter((item) => item.id !== result.result.profile.id)
    );

    const stateDetail = result.result.hadCustomerProfile
      ? " A customer profile already existed and was left intact."
      : "";
    const metadataDetail = result.result.metadataSynced
      ? ""
      : " Auth metadata could not be updated, but the staff profile was repaired.";

    setStatus(
      `Repaired and activated ${result.result.profile.email}.${stateDetail}${metadataDetail}`
    );
  }

  return (
    <section className="admin-subpanel">
      <p className="eyebrow">Staff access</p>
      <h2>Repair and activate staff sign-in</h2>
      <p className="subtle">
        Ops sign-in only succeeds when the auth user has a matching active
        staff profile.
      </p>

      {!configured ? (
        <div className="alert alert-error">
          Server-owned Supabase access is unavailable here, so staff repair and
          activation are disabled.
        </div>
      ) : null}

      {error ? <div className="alert alert-error">{error}</div> : null}
      {status ? <div className="alert alert-success">{status}</div> : null}

      <form className="stack" onSubmit={repairAccess}>
        <div className="field">
          <label htmlFor="staff-repair-email">Repair auth user by email</label>
          <input
            id="staff-repair-email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={!configured || repairing}
            placeholder="lead@example.com"
            value={repairEmail}
            onChange={(event) => setRepairEmail(event.target.value)}
          />
        </div>
        <button
          className="button button-secondary"
          disabled={!configured || repairing}
          type="submit"
        >
          {repairing ? "Repairing..." : "Repair and activate"}
        </button>
      </form>

      <div className="admin-list">
        {profiles.length ? (
          profiles.map((profile) => (
            <article className="admin-request" key={profile.id}>
              <div className="admin-request-header">
                <div>
                  <h3>{profile.fullName || profile.email}</h3>
                  <p className="subtle">
                    {profile.email}
                    {profile.organization ? ` · ${profile.organization}` : ""}
                  </p>
                </div>
                <span className="status-pill status-pending">Pending</span>
              </div>
              <p className="subtle">
                Role: {profile.role} · Access not active yet
              </p>
              <div className="admin-actions">
                <button
                  className="button button-primary"
                  disabled={!configured || loadingId === profile.id}
                  onClick={() => activateProfile(profile.id)}
                  type="button"
                >
                  {loadingId === profile.id ? "Activating..." : "Activate staff"}
                </button>
              </div>
            </article>
          ))
        ) : (
          <article className="admin-request">
            <h3>No pending staff profiles</h3>
            <p className="subtle">
              New signups will appear here until an owner activates them.
            </p>
          </article>
        )}
      </div>
    </section>
  );
}
