"use client";

import { useRef, useState } from "react";

const institutionTypeOptions = [
  "University lab",
  "Private laboratory",
  "Procurement group",
  "Analytical services",
  "Other"
] as const;

const roleOptions = [
  "Research lead",
  "Procurement manager",
  "Lab operations",
  "QA / compliance",
  "Other"
] as const;

const procurementContextOptions = [
  "RUO procurement",
  "Bench analytics",
  "Method development",
  "Documentation review",
  "Other"
] as const;

type QualificationFlowProps = {
  action: (formData: FormData) => void | Promise<void>;
  customerEmail: string;
  customerName: string;
  defaultInstitutionName: string;
  nextPath: string;
};

function StepBadge({
  currentStep,
  step,
  label
}: {
  currentStep: number;
  step: number;
  label: string;
}) {
  const active = currentStep === step;
  const complete = currentStep > step;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ${
          complete || active
            ? "border-[var(--accent)] bg-[var(--accent)] text-black"
            : "border-[var(--border)] text-[var(--text-muted)]"
        }`}
      >
        {step}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Step {step} of 3
        </p>
        <p className={active ? "text-white" : "text-[var(--text-muted)]"}>
          {label}
        </p>
      </div>
    </div>
  );
}

export function QualificationFlow({
  action,
  customerEmail,
  customerName,
  defaultInstitutionName,
  nextPath
}: QualificationFlowProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [institutionName, setInstitutionName] = useState(defaultInstitutionName);
  const [institutionType, setInstitutionType] = useState("");
  const [institutionTypeOther, setInstitutionTypeOther] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [roleTitleOther, setRoleTitleOther] = useState("");
  const [procurementContext, setProcurementContext] = useState("");
  const [procurementContextOther, setProcurementContextOther] = useState("");
  const [supportingNotes, setSupportingNotes] = useState("");

  const hasStoredInstitution = Boolean(defaultInstitutionName);

  const summaryValues = {
    institutionName: institutionName || "Provided in setup",
    institutionType:
      institutionType
        ? institutionType === "Other"
          ? institutionTypeOther || "Selected during setup"
          : institutionType
        : "Selected during setup",
    roleTitle:
      roleTitle
        ? roleTitle === "Other"
          ? roleTitleOther || "Selected during setup"
          : roleTitle
        : "Selected during setup",
    procurementContext:
      procurementContext
        ? procurementContext === "Other"
          ? procurementContextOther || "Selected during setup"
          : procurementContext
        : "Selected during setup"
  };

  function validateStep(currentStep: number) {
    const form = formRef.current;
    if (!form) return false;

    const fieldNames =
      currentStep === 1
        ? hasStoredInstitution
          ? []
          : ["institutionName"]
        : currentStep === 2
          ? [
              "institutionType",
              ...(institutionType === "Other" ? ["institutionTypeOther"] : []),
              "roleTitle",
              ...(roleTitle === "Other" ? ["roleTitleOther"] : []),
              "procurementContext",
              ...(procurementContext === "Other"
                ? ["procurementContextOther"]
                : [])
            ]
          : [
              "attestationAge",
              "attestationRuo",
              "attestationNoHumanUse"
            ];

    for (const name of fieldNames) {
      const field = form.elements.namedItem(name);
      const element = Array.isArray(field) ? field[0] : field;
      if (
        element &&
        "checkValidity" in element &&
        typeof element.checkValidity === "function" &&
        !element.checkValidity()
      ) {
        if ("reportValidity" in element && typeof element.reportValidity === "function") {
          element.reportValidity();
        }
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(3, current + 1));
  }

  function previousStep() {
    setStep((current) => Math.max(1, current - 1));
  }

  return (
    <form action={action} className="grid gap-6" ref={formRef}>
      <input type="hidden" name="next" value={nextPath} />
      {hasStoredInstitution ? (
        <input type="hidden" name="institutionName" value={defaultInstitutionName} />
      ) : step !== 1 ? (
        <input type="hidden" name="institutionName" value={institutionName} />
      ) : null}

      {step !== 2 ? (
        <>
          <input type="hidden" name="institutionType" value={institutionType} />
          {institutionType === "Other" ? (
            <input type="hidden" name="institutionTypeOther" value={institutionTypeOther} />
          ) : null}
          <input type="hidden" name="roleTitle" value={roleTitle} />
          {roleTitle === "Other" ? (
            <input type="hidden" name="roleTitleOther" value={roleTitleOther} />
          ) : null}
          <input type="hidden" name="procurementContext" value={procurementContext} />
          {procurementContext === "Other" ? (
            <input
              type="hidden"
              name="procurementContextOther"
              value={procurementContextOther}
            />
          ) : null}
          <input type="hidden" name="supportingNotes" value={supportingNotes} />
        </>
      ) : null}

      <div className="grid gap-3 rounded-[24px] border border-[var(--border)] p-5">
        <div className="flex flex-wrap gap-3">
          <StepBadge currentStep={step} step={1} label="Account context" />
          <StepBadge currentStep={step} step={2} label="Workflow" />
          <StepBadge currentStep={step} step={3} label="Confirm" />
        </div>
      </div>

      {step === 1 ? (
        <section className="rounded-[24px] border border-[var(--border)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Step 1 of 3
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">Confirm your account details</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            We only need a few basics so we can match this account to the right research workflow.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-[var(--border)] bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Account name</p>
              <p className="mt-2 text-white">{customerName}</p>
            </div>
            <div className="rounded-[18px] border border-[var(--border)] bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Email on file</p>
              <p className="mt-2 text-white">{customerEmail}</p>
            </div>
          </div>

          {hasStoredInstitution ? (
            <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Organization on file</p>
              <p className="mt-2 text-white">{defaultInstitutionName}</p>
            </div>
          ) : (
            <label className="mt-4 grid gap-2">
              <span>Organization or lab name</span>
              <input
                className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                name="institutionName"
                onChange={(event) => setInstitutionName(event.target.value)}
                required
                value={institutionName}
              />
            </label>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
              onClick={nextStep}
              type="button"
            >
              Continue
            </button>
            <p className="text-sm text-[var(--text-muted)]">
              Next, choose the options that best describe your work.
            </p>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="rounded-[24px] border border-[var(--border)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Step 2 of 3
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">Choose the options that match your work</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Select the closest options below. Only type a custom answer if nothing fits.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span>Organization type</span>
              <select
                className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                name="institutionType"
                onChange={(event) => setInstitutionType(event.target.value)}
                required
                value={institutionType}
              >
                <option value="">Select one</option>
                {institutionTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            {institutionType === "Other" ? (
              <label className="grid gap-2">
                <span>Tell us about your organization type</span>
                <input
                className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                name="institutionTypeOther"
                onChange={(event) => setInstitutionTypeOther(event.target.value)}
                required
                value={institutionTypeOther}
              />
            </label>
          ) : null}

            <label className="grid gap-2">
              <span>Your role</span>
              <select
                className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                name="roleTitle"
                onChange={(event) => setRoleTitle(event.target.value)}
                required
                value={roleTitle}
              >
                <option value="">Select one</option>
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            {roleTitle === "Other" ? (
              <label className="grid gap-2">
                <span>Tell us about your role</span>
                <input
                className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                name="roleTitleOther"
                onChange={(event) => setRoleTitleOther(event.target.value)}
                required
                value={roleTitleOther}
              />
            </label>
          ) : null}

            <label className="grid gap-2 sm:col-span-2">
              <span>How you plan to use the catalog</span>
              <select
                className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                name="procurementContext"
                onChange={(event) => setProcurementContext(event.target.value)}
                required
                value={procurementContext}
              >
                <option value="">Select one</option>
                {procurementContextOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            {procurementContext === "Other" ? (
              <label className="grid gap-2 sm:col-span-2">
                <span>Tell us about your use case</span>
                <input
                className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white"
                name="procurementContextOther"
                onChange={(event) => setProcurementContextOther(event.target.value)}
                required
                value={procurementContextOther}
              />
            </label>
          ) : null}

            <label className="grid gap-2 sm:col-span-2">
              <span>Anything else we should know? (optional)</span>
              <textarea
                className="rounded-[22px] border border-[var(--border)] bg-black px-4 py-3 text-white"
                name="supportingNotes"
                onChange={(event) => setSupportingNotes(event.target.value)}
                placeholder="Share anything helpful that was not covered above."
                rows={4}
                value={supportingNotes}
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
              onClick={previousStep}
              type="button"
            >
              Back
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
              onClick={nextStep}
              type="button"
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="rounded-[24px] border border-[var(--border)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Step 3 of 3
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">Review and confirm</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Check your details below, agree to the required statements, and continue to the full catalog.
          </p>

          <div className="mt-6 rounded-[20px] border border-[var(--border)] bg-black/25 p-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Organization</p>
                <p className="mt-2 text-white">{summaryValues.institutionName || "Provided in setup"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Organization type</p>
                <p className="mt-2 text-white">{summaryValues.institutionType}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Role</p>
                <p className="mt-2 text-white">{summaryValues.roleTitle}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Use case</p>
                <p className="mt-2 text-white">{summaryValues.procurementContext}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <label className="flex min-h-11 items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
              <input className="mt-1 min-h-5 min-w-5 accent-[var(--accent)]" name="attestationAge" required type="checkbox" />
              <span>I confirm that I am at least 21 years old.</span>
            </label>
            <label className="flex min-h-11 items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
              <input className="mt-1 min-h-5 min-w-5 accent-[var(--accent)]" name="attestationRuo" required type="checkbox" />
              <span>I am using this account for legitimate research or purchasing activity and accept the research-use-only restrictions.</span>
            </label>
            <label className="flex min-h-11 items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
              <input className="mt-1 min-h-5 min-w-5 accent-[var(--accent)]" name="attestationNoHumanUse" required type="checkbox" />
              <span>I understand these materials are not for human use, clinical use, or consumer resale.</span>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-white hover:border-[var(--accent)]"
              onClick={previousStep}
              type="button"
            >
              Back
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
              type="submit"
            >
              Open full catalog
            </button>
          </div>
        </section>
      ) : null}
    </form>
  );
}
