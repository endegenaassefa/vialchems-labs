"use client";

/**
 * /register — multi-section customer registration form.
 *
 * Spec §3.1 + §6. Sections (top-to-bottom; submit at the end):
 *   1. Identity            full_name, email, phone, date_of_birth
 *   2. Research context    research_org_type (+ other), research_focus
 *   3. Mailing address     AddressFields
 *   4. Shipping address    same-as-mailing toggle + optional AddressFields
 *   5. Password            password + confirm + zxcvbn-driven feedback
 *   6. Terms               terms_accepted checkbox
 *
 * Validation: registrationSchema (single source of truth). On submit,
 * the same zod schema runs server-side at POST /api/auth/register.
 *
 * Anti-enum: the server returns a uniform 200 regardless of branch.
 * The client always shows the "check your inbox" card on a 200.
 */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import { AddressFields, emptyAddress, type AddressValue } from "@/components/account/AddressFields";
import {
  RESEARCH_ORG_TYPES,
  registrationSchema,
  evaluatePasswordStrength,
  type ResearchOrgType,
} from "@/lib/validation/customer";

const ORG_TYPE_LABELS: Record<ResearchOrgType, string> = {
  university: "University / academic lab",
  biotech: "Biotech / pharma company",
  independent_research: "Independent research organization",
  cro: "Contract research organization (CRO)",
  government: "Government / public-sector lab",
  individual: "Individual researcher",
  other: "Other",
};

function RegisterInner() {
  const router = useRouter();
  const search = useSearchParams();
  const nextParam = (() => {
    const value = search?.get("next");
    if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
    return value;
  })();

  // Section 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  // Section 2
  const [orgType, setOrgType] = useState<ResearchOrgType>("university");
  const [orgOther, setOrgOther] = useState("");
  const [researchFocus, setResearchFocus] = useState("");
  // Section 3 + 4
  const [mailing, setMailing] = useState<AddressValue>(emptyAddress());
  const [shipSame, setShipSame] = useState(true);
  const [shipping, setShipping] = useState<AddressValue>(emptyAddress());
  // Section 5
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // Section 6
  const [terms, setTerms] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);

  // Live password feedback
  const passwordEval = useMemo(
    () => (password.length === 0 ? null : evaluatePasswordStrength(password)),
    [password],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setFieldErrors({});
    setTopError(null);

    const body = {
      full_name: fullName,
      email,
      phone: phone.trim() === "" ? undefined : phone,
      date_of_birth: dob,
      research_org_type: orgType,
      research_org_other: orgType === "other" ? orgOther : undefined,
      research_focus: researchFocus,
      password,
      confirm_password: confirm,
      terms_accepted: terms,
      mailing_address: mailing,
      shipping_same_as_mailing: shipSame,
      shipping_address: shipSame ? undefined : shipping,
    };

    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "_form";
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setTopError(
        "Please fix the highlighted fields and submit again.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      // Server returns uniform 200. Whatever the outcome, we show
      // the "check your inbox" card.
      setSubmitted(true);
    } catch {
      // Network failure → surface a generic retry; never echoes whether
      // the account actually got created.
      setTopError("Network error. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card>
        <div className="flex flex-col gap-4 p-6 text-center">
          <Pill variant="electric">Check your inbox</Pill>
          <h1 className="text-2xl font-semibold">
            Confirm your email to activate your account
          </h1>
          <p className="text-sm text-slate-600">
            We sent a confirmation link to{" "}
            <span className="font-mono">{email}</span>. Click it within 24
            hours to verify your email. If you don&rsquo;t see it, check spam
            or request a fresh link from the sign-in page.
          </p>
          <div className="flex justify-center gap-2">
            <Link
              href={`/login?next=${encodeURIComponent(nextParam)}`}
              className="text-sm font-medium text-slate-900 underline underline-offset-2"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 p-6" noValidate>
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-2">
            C R E A T E · A C C O U N T
          </p>
          <h1 className="text-3xl font-semibold">Register</h1>
          <p className="mt-2 text-sm text-slate-600">
            VialChem Labs serves verified research operators. We need a few
            details to activate your account.
          </p>
        </header>

        {topError && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            {topError}
          </div>
        )}

        {/* Section 1 — Identity */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">Identity</h2>
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="reg-full_name" required>
              Full legal name
            </FieldLabel>
            <Input
              id="reg-full_name"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={Boolean(fieldErrors.full_name)}
              aria-describedby={fieldErrors.full_name ? "err-full_name" : undefined}
            />
            {fieldErrors.full_name && (
              <p id="err-full_name" className="text-sm text-red-700">
                {fieldErrors.full_name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="reg-email" required>
              Email
            </FieldLabel>
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-700">{fieldErrors.email}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor="reg-phone">Phone (optional)</FieldLabel>
              <Input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+14155550100"
                aria-invalid={Boolean(fieldErrors.phone)}
              />
              {fieldErrors.phone && (
                <p className="text-sm text-red-700">{fieldErrors.phone}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor="reg-dob" required>
                Date of birth
              </FieldLabel>
              <Input
                id="reg-dob"
                type="date"
                autoComplete="bday"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                aria-invalid={Boolean(fieldErrors.date_of_birth)}
              />
              {fieldErrors.date_of_birth && (
                <p className="text-sm text-red-700">
                  {fieldErrors.date_of_birth}
                </p>
              )}
              <p className="text-xs text-slate-500">
                Must be 21 or older.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — Research context */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">Research context</h2>
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="reg-org_type" required>
              Research organization type
            </FieldLabel>
            <select
              id="reg-org_type"
              required
              value={orgType}
              onChange={(e) => setOrgType(e.target.value as ResearchOrgType)}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              {RESEARCH_ORG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ORG_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          {orgType === "other" && (
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor="reg-org_other" required>
                Describe your organization
              </FieldLabel>
              <Input
                id="reg-org_other"
                value={orgOther}
                onChange={(e) => setOrgOther(e.target.value)}
                required
                aria-invalid={Boolean(fieldErrors.research_org_other)}
              />
              {fieldErrors.research_org_other && (
                <p className="text-sm text-red-700">
                  {fieldErrors.research_org_other}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="reg-research_focus" required>
              Research focus
            </FieldLabel>
            <textarea
              id="reg-research_focus"
              required
              minLength={10}
              maxLength={500}
              rows={3}
              value={researchFocus}
              onChange={(e) => setResearchFocus(e.target.value)}
              className="rounded-md border border-slate-300 bg-white p-3 text-sm"
              placeholder="1-3 sentences describing your work."
              aria-invalid={Boolean(fieldErrors.research_focus)}
            />
            {fieldErrors.research_focus && (
              <p className="text-sm text-red-700">
                {fieldErrors.research_focus}
              </p>
            )}
            <p className="text-xs text-slate-500">
              {researchFocus.length}/500 characters.
            </p>
          </div>
        </section>

        {/* Section 3 — Mailing address */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">Mailing address</h2>
          <AddressFields
            prefix="reg-mailing"
            value={mailing}
            onChange={setMailing}
            required
          />
        </section>

        {/* Section 4 — Shipping */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">Shipping address</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={shipSame}
              onChange={(e) => setShipSame(e.target.checked)}
            />
            <span>Shipping address is the same as mailing</span>
          </label>
          {!shipSame && (
            <AddressFields
              prefix="reg-shipping"
              value={shipping}
              onChange={setShipping}
              required
            />
          )}
        </section>

        {/* Section 5 — Password */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">Password</h2>
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="reg-password" required>
              Password
            </FieldLabel>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {passwordEval && (
              <div className="flex flex-col gap-1 text-xs">
                <div
                  className={
                    passwordEval.acceptable
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }
                >
                  Strength: {["very weak", "weak", "ok", "good", "strong"][passwordEval.score]}
                </div>
                {!passwordEval.acceptable &&
                  passwordEval.feedback.length > 0 && (
                    <ul className="space-y-1 text-slate-600">
                      {passwordEval.feedback.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
              </div>
            )}
            {fieldErrors.password && (
              <p className="text-sm text-red-700">{fieldErrors.password}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="reg-confirm" required>
              Confirm password
            </FieldLabel>
            <Input
              id="reg-confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={Boolean(fieldErrors.confirm_password)}
            />
            {fieldErrors.confirm_password && (
              <p className="text-sm text-red-700">
                {fieldErrors.confirm_password}
              </p>
            )}
          </div>
        </section>

        {/* Section 6 — Terms */}
        <section className="flex flex-col gap-1">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              required
              className="mt-1"
            />
            <span>
              I confirm I am 21 or older and acknowledge VialChem Labs research
              materials are research-use-only under our{" "}
              <Link
                href="/legal/terms"
                className="underline underline-offset-2"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy"
                className="underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {fieldErrors.terms_accepted && (
            <p className="text-sm text-red-700">
              {fieldErrors.terms_accepted}
            </p>
          )}
        </section>

        <Button type="submit" disabled={submitting} variant="primary" size="lg">
          {submitting ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href={`/login?next=${encodeURIComponent(nextParam)}`}
            className="font-medium text-slate-900 underline underline-offset-2"
          >
            Sign in
          </Link>
          .
        </p>
      </form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-16">
        <Suspense fallback={null}>
          <RegisterInner />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
