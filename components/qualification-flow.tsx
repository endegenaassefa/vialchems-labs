"use client";

// Pattern adapted from mogtrix-website/site/components/qualification-flow.tsx
// Adapted with peptide-context attestation language per Appendix A.5.

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import {
  ATTESTATIONS,
  QualificationRoles,
  qualificationRoleLabels,
  validateQualification,
  type QualificationInput,
  type QualificationRole,
} from "@/lib/customer-qualification";
import { FUNNEL_EVENTS } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/plausible";

interface QualificationFlowProps {
  onSubmit: (data: QualificationInput) => void;
  defaultEmail?: string;
}

export function QualificationFlow({
  onSubmit,
  defaultEmail = "",
}: QualificationFlowProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [role, setRole] = useState<QualificationRole>("academic-researcher");
  const [researchPurpose, setResearchPurpose] = useState("");
  const [ageAck, setAgeAck] = useState(false);
  const [ruoAck, setRuoAck] = useState(false);
  const [jurisdictionAck, setJurisdictionAck] = useState(false);
  const [attestationsAck, setAttestationsAck] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = validateQualification({
      email,
      role,
      researchPurpose,
      ageAcknowledgment: ageAck,
      ruoAcknowledgment: ruoAck,
      jurisdictionAcknowledgment: jurisdictionAck,
      attestationsAcknowledged: attestationsAck,
    });
    if (!result.ok) {
      const errMap: Record<string, string> = {};
      for (const err of result.errors) {
        errMap[err.field] = err.message;
      }
      setErrors(errMap);
      return;
    }
    setErrors({});
    // D4 funnel event — fires after validation passes, before the
    // parent's onSubmit (which may persist or fetch). Decoupling means
    // the event tracks the user intent even if the persistence call
    // later fails / retries.
    track({ event: FUNNEL_EVENTS.QUALIFICATION_COMPLETED });
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <FieldLabel htmlFor="qual-email" required>
          Email
        </FieldLabel>
        <Input
          id="qual-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
      </div>

      <div>
        <FieldLabel htmlFor="qual-role" required>
          Institution / role
        </FieldLabel>
        <select
          id="qual-role"
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value as QualificationRole)}
          className="w-full h-11 px-3 rounded-[var(--radius-md)] bg-[var(--surface-strong)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] focus:outline-none"
        >
          {QualificationRoles.map((r) => (
            <option key={r} value={r}>
              {qualificationRoleLabels[r]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel htmlFor="qual-purpose" required>
          Research purpose
        </FieldLabel>
        <textarea
          id="qual-purpose"
          name="researchPurpose"
          required
          minLength={20}
          maxLength={2000}
          rows={4}
          value={researchPurpose}
          onChange={(e) => setResearchPurpose(e.target.value)}
          className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-strong)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] focus:outline-none"
          aria-describedby={
            errors.researchPurpose ? "qual-purpose-error" : undefined
          }
          aria-invalid={errors.researchPurpose ? "true" : "false"}
        />
        {errors.researchPurpose ? (
          <p
            id="qual-purpose-error"
            role="alert"
            className="mt-2 text-[12px] text-[var(--pill-error)]"
          >
            {errors.researchPurpose}
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-3 border border-[var(--border)] rounded-[var(--radius-lg)] p-5 bg-[var(--surface)]">
        <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] px-2">
          Acknowledgments
        </legend>
        <label className="flex gap-3 text-[14px] text-[var(--text-muted)] leading-[1.5]">
          <input
            type="checkbox"
            checked={ageAck}
            onChange={(e) => setAgeAck(e.target.checked)}
            className="mt-1 accent-[var(--accent)]"
          />
          <span>
            I confirm that I am 21+ years of age and will use these products
            solely for laboratory research in non-clinical settings.
          </span>
        </label>
        {errors.ageAcknowledgment ? (
          <p role="alert" className="ml-6 text-[12px] text-[var(--pill-error)]">
            {errors.ageAcknowledgment}
          </p>
        ) : null}

        <label className="flex gap-3 text-[14px] text-[var(--text-muted)] leading-[1.5]">
          <input
            type="checkbox"
            checked={ruoAck}
            onChange={(e) => setRuoAck(e.target.checked)}
            className="mt-1 accent-[var(--accent)]"
          />
          <span>
            I acknowledge research-use-only framing. Products are not for human
            consumption.
          </span>
        </label>

        <label className="flex gap-3 text-[14px] text-[var(--text-muted)] leading-[1.5]">
          <input
            type="checkbox"
            checked={jurisdictionAck}
            onChange={(e) => setJurisdictionAck(e.target.checked)}
            className="mt-1 accent-[var(--accent)]"
          />
          <span>
            I assume all regulatory compliance responsibility for my
            jurisdiction.
          </span>
        </label>
      </fieldset>

      <fieldset className="space-y-2 border border-[var(--border)] rounded-[var(--radius-lg)] p-5 bg-[var(--surface)]">
        <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] px-2">
          Attestations
        </legend>
        <p className="text-[13px] text-[var(--text-subtle)] mb-3">
          By submitting this form I attest that:
        </p>
        <ol className="list-decimal list-outside ml-5 space-y-1 text-[13px] text-[var(--text-muted)] leading-[1.5]">
          {ATTESTATIONS.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
        <label className="mt-4 flex gap-3 text-[13px] text-[var(--text)] leading-[1.5]">
          <input
            type="checkbox"
            checked={attestationsAck}
            onChange={(e) => setAttestationsAck(e.target.checked)}
            className="mt-1 accent-[var(--accent)]"
          />
          <span>I affirm all 7 attestations above.</span>
        </label>
      </fieldset>

      <Button type="submit" variant="primary" size="lg">
        Submit qualification
      </Button>
    </form>
  );
}
