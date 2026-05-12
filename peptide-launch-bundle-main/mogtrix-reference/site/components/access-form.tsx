"use client";

import { FormEvent, useMemo, useState } from "react";
import { Send, ShieldCheck } from "lucide-react";

import { accessFormOptions } from "@/lib/validation/access";

type SubmitState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

function readCheckbox(form: FormData, key: string) {
  return form.get(key) === "on";
}

export function AccessForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({ state: "idle" });
  const [fullName, setFullName] = useState("");
  const [industry, setIndustry] = useState(accessFormOptions.industries[0]);
  const [roleTitle, setRoleTitle] = useState(accessFormOptions.roles[0]);

  const consentPreview = useMemo(() => {
    const person = fullName.trim() || "the requester";
    return `${person} affirms that they hold the role of ${roleTitle} in ${industry}, are 21 or older, and are requesting access only for qualified research-use documentation and review.`;
  }, [fullName, industry, roleTitle]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ state: "loading" });

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      industry: String(form.get("industry") ?? ""),
      roleTitle: String(form.get("roleTitle") ?? ""),
      credentials: String(form.get("credentials") ?? ""),
      researchEnvironment: String(form.get("researchEnvironment") ?? ""),
      intendedUseSummary: String(form.get("intendedUseSummary") ?? ""),
      legalName: String(form.get("legalName") ?? ""),
      attestations: {
        age: readCheckbox(form, "age"),
        qualified: readCheckbox(form, "qualified"),
        ruoBoundary: readCheckbox(form, "ruoBoundary"),
        noPersonalUse: readCheckbox(form, "noPersonalUse"),
        legalReview: readCheckbox(form, "legalReview")
      }
    };

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        setSubmitState({
          state: "error",
          message: result.message ?? "The request could not be submitted."
        });
        return;
      }

      event.currentTarget.reset();
      setFullName("");
      setIndustry(accessFormOptions.industries[0]);
      setRoleTitle(accessFormOptions.roles[0]);
      setSubmitState({
        state: "success",
        message: "Manual access request received. Mogtrix staff can use it for follow-up review outside the normal pilot checkout path."
      });
    } catch {
      setSubmitState({
        state: "error",
        message: "Network error. Check your connection and try again."
      });
    }
  }

  return (
    <form className="form-panel stack" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Qualification request</p>
        <h1>Request controlled access</h1>
        <p className="subtle">
          Submit role, credential, environment, and legal acknowledgements when
          you need manual review or procurement help. This does not create an
          order or hosted payment.
        </p>
      </div>

      {submitState.state === "success" ? (
        <div className="alert alert-success">{submitState.message}</div>
      ) : null}
      {submitState.state === "error" ? (
        <div className="alert alert-error">{submitState.message}</div>
      ) : null}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            required
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" required type="email" />
        </div>
        <div className="field field-full">
          <label htmlFor="company">Company / lab name optional</label>
          <input id="company" name="company" />
        </div>
        <div className="field">
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            name="industry"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
          >
            {accessFormOptions.industries.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="roleTitle">Role / credential type</label>
          <select
            id="roleTitle"
            name="roleTitle"
            value={roleTitle}
            onChange={(event) => setRoleTitle(event.target.value)}
          >
            {accessFormOptions.roles.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field field-full">
          <label htmlFor="credentials">Credential details</label>
          <textarea id="credentials" name="credentials" required />
        </div>
        <div className="field field-full">
          <label htmlFor="researchEnvironment">Qualified environment</label>
          <textarea id="researchEnvironment" name="researchEnvironment" required />
        </div>
        <div className="field field-full">
          <label htmlFor="intendedUseSummary">Documentation purpose</label>
          <textarea id="intendedUseSummary" name="intendedUseSummary" required />
        </div>
        <div className="field field-full">
          <label htmlFor="legalName">Typed legal name / optional signature</label>
          <input id="legalName" name="legalName" required />
        </div>
      </div>

      <div className="form-note">
        <strong>
          <ShieldCheck size={16} aria-hidden="true" /> Consent preview:
        </strong>{" "}
        {consentPreview}
      </div>

      <div className="stack" aria-label="Required acknowledgements">
        <label className="check-row">
          <input name="age" type="checkbox" required />
          <span>I confirm I am 21 years of age or older.</span>
        </label>
        <label className="check-row">
          <input name="qualified" type="checkbox" required />
          <span>
            I confirm I am requesting access for a qualified research environment.
          </span>
        </label>
        <label className="check-row">
          <input name="ruoBoundary" type="checkbox" required />
          <span>
            I understand this site is structured around research-use documentation
            and controlled access.
          </span>
        </label>
        <label className="check-row">
          <input name="noPersonalUse" type="checkbox" required />
          <span>
            I will not use this request flow to seek personal-use or medical-use
            guidance.
          </span>
        </label>
        <label className="check-row">
          <input name="legalReview" type="checkbox" required />
          <span>
            I have reviewed the draft legal shell and understand final language
            requires attorney review before launch.
          </span>
        </label>
      </div>

      <button
        className="button button-primary"
        disabled={submitState.state === "loading"}
        type="submit"
      >
        <Send size={18} aria-hidden="true" />
        {submitState.state === "loading" ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
