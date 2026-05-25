"use client";

/**
 * /account/complete-profile — legacy magic-link customer migration.
 *
 * Spec §3.8. The dashboard redirects here when a signed-in
 * customer has no customer_profiles row (i.e. they registered
 * via the old magic-link-only flow before the rebuild).
 *
 * Form mirrors /register without password fields — the customer
 * keeps magic-link as their auth method. They can optionally set
 * a password later from /account/security.
 *
 * On submit:
 *   1. POST /api/account/complete-profile with the parsed payload
 *   2. On 200 → router.replace('/account?welcome=1')
 *   3. On any error → surface inline; never echo whether the
 *      email/phone is already on file (anti-enum)
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import {
  AddressFields,
  emptyAddress,
  type AddressValue,
} from "@/components/account/AddressFields";
import {
  RESEARCH_ORG_TYPES,
  completeProfileSchema,
  type ResearchOrgType,
} from "@/lib/validation/customer";
import { useSupabaseUser } from "@/lib/auth/use-supabase-user";

const ORG_TYPE_LABELS: Record<ResearchOrgType, string> = {
  university: "University / academic lab",
  biotech: "Biotech / pharma company",
  independent_research: "Independent research organization",
  cro: "Contract research organization (CRO)",
  government: "Government / public-sector lab",
  individual: "Individual researcher",
  other: "Other",
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, session, loading, unavailable } = useSupabaseUser();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [orgType, setOrgType] = useState<ResearchOrgType>("university");
  const [orgOther, setOrgOther] = useState("");
  const [researchFocus, setResearchFocus] = useState("");
  const [mailing, setMailing] = useState<AddressValue>(emptyAddress());
  const [shipSame, setShipSame] = useState(true);
  const [shipping, setShipping] = useState<AddressValue>(emptyAddress());
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);

  const initial = useMemo(() => user?.email ?? "", [user]);

  if (unavailable || (!loading && !user)) {
    if (typeof window !== "undefined" && !loading && !user) {
      router.replace("/login?next=/account/complete-profile");
    }
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-md px-6 py-32 text-center">
          <p className="text-sm text-slate-500">
            {unavailable
              ? "Account is temporarily unavailable."
              : "Redirecting to sign in..."}
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setFieldErrors({});
    setTopError(null);

    const body = {
      full_name: fullName,
      email: initial,
      phone: phone.trim() === "" ? undefined : phone,
      date_of_birth: dob,
      research_org_type: orgType,
      research_org_other: orgType === "other" ? orgOther : undefined,
      research_focus: researchFocus,
      terms_accepted: terms,
      mailing_address: mailing,
      shipping_same_as_mailing: shipSame,
      shipping_address: shipSame ? undefined : shipping,
    };

    const parsed = completeProfileSchema.safeParse(body);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "_form";
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setTopError("Please fix the highlighted fields and submit again.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/account/complete-profile", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        setTopError(
          "We could not save your profile. Please verify your details and try again.",
        );
        return;
      }
      router.replace("/account?welcome=1");
    } catch {
      setTopError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <Card>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-6 p-6"
            noValidate
          >
            <header>
              <Pill variant="info">One-time setup</Pill>
              <h1 className="mt-3 text-2xl font-semibold">
                Complete your VialChem Labs profile
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Your account was created before we required full profile
                details. Add what we need to ship reliably and we&rsquo;ll
                land you on the dashboard.
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

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-medium">Identity</h2>
              <p className="text-xs text-slate-500">
                Email on file: <span className="font-mono">{initial}</span>
              </p>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="cp-full_name" required>
                  Full legal name
                </FieldLabel>
                <Input
                  id="cp-full_name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {fieldErrors.full_name && (
                  <p className="text-sm text-red-700">{fieldErrors.full_name}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="cp-phone">Phone (optional)</FieldLabel>
                  <Input
                    id="cp-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="cp-dob" required>
                    Date of birth
                  </FieldLabel>
                  <Input
                    id="cp-dob"
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  {fieldErrors.date_of_birth && (
                    <p className="text-sm text-red-700">
                      {fieldErrors.date_of_birth}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">Must be 21 or older.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-medium">Research context</h2>
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="cp-org_type" required>
                  Research organization type
                </FieldLabel>
                <select
                  id="cp-org_type"
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
                  <FieldLabel htmlFor="cp-org_other" required>
                    Describe your organization
                  </FieldLabel>
                  <Input
                    id="cp-org_other"
                    value={orgOther}
                    onChange={(e) => setOrgOther(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="cp-research_focus" required>
                  Research focus
                </FieldLabel>
                <textarea
                  id="cp-research_focus"
                  required
                  minLength={10}
                  maxLength={500}
                  rows={3}
                  value={researchFocus}
                  onChange={(e) => setResearchFocus(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white p-3 text-sm"
                />
                <p className="text-xs text-slate-500">
                  {researchFocus.length}/500 characters.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-medium">Mailing address</h2>
              <AddressFields
                prefix="cp-mailing"
                value={mailing}
                onChange={setMailing}
                required
              />
            </div>

            <div className="flex flex-col gap-3">
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
                  prefix="cp-shipping"
                  value={shipping}
                  onChange={setShipping}
                  required
                />
              )}
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                required
                className="mt-1"
              />
              <span>
                I confirm I am 21 or older and acknowledge VialChem Labs
                research materials are research-use-only under our{" "}
                <Link
                  href="/legal/terms"
                  className="underline underline-offset-2"
                >
                  Terms
                </Link>
                .
              </span>
            </label>

            <Button type="submit" disabled={submitting} variant="primary" size="lg">
              {submitting ? "Saving..." : "Complete profile"}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Want to add a password instead of using magic-link?{" "}
              <Link
                href="/account/security"
                className="underline underline-offset-2"
              >
                Set one later in account settings
              </Link>
              .
            </p>
          </form>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
