/**
 * AddressForm — client island for /checkout/address.
 *
 * Live validation for state-blocking via validateShippingAddress. Submit blocks
 * if blocked-state selected. On valid submit: navigate to /checkout/method.
 *
 * Persistence is local (sessionStorage) for Phase 5; Phase 9 swaps in Supabase.
 */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import {
  BLOCKED_US_STATES,
  validateShippingAddress,
} from "@/lib/compliance/jurisdictions";
import { useSessionStorageItem } from "@/lib/use-session-storage";

const addressSchema = z.object({
  name: z.string().trim().min(2, "Recipient name is required"),
  email: z.string().trim().email("Valid email required"),
  street: z.string().trim().min(3, "Street address is required"),
  street2: z.string().trim().optional().default(""),
  city: z.string().trim().min(2, "City is required"),
  stateCode: z.string().min(2, "Select a state"),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit US zip code"),
  countryCode: z.literal("US"),
});

const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

interface AddressFields {
  name: string;
  email: string;
  street: string;
  street2: string;
  city: string;
  stateCode: string;
  zip: string;
  countryCode: string;
}

const STORAGE_KEY = "vialchemlabs:checkout:address";

const EMPTY_ADDRESS: AddressFields = {
  name: "",
  email: "",
  street: "",
  street2: "",
  city: "",
  stateCode: "",
  zip: "",
  countryCode: "US",
};

export function AddressForm() {
  const router = useRouter();
  // Hydrate from sessionStorage via useSyncExternalStore. SSR snapshot is
  // null, so first render emits empty fields and the post-hydration render
  // applies any saved partial.
  const stored = useSessionStorageItem<Partial<AddressFields>>(STORAGE_KEY);
  const [overrides, setOverrides] = useState<Partial<AddressFields>>({});
  const fields: AddressFields = { ...EMPTY_ADDRESS, ...stored, ...overrides };
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof AddressFields, string>>
  >({});

  const stateValidation = fields.stateCode
    ? validateShippingAddress({
        countryCode: fields.countryCode,
        stateCode: fields.stateCode,
      })
    : { ok: true as const };

  const showStateWarning = !stateValidation.ok;

  function set<K extends keyof AddressFields>(key: K, value: AddressFields[K]) {
    setOverrides((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const parsed = addressSchema.safeParse(fields);
    if (!parsed.success) {
      const errors: Partial<Record<keyof AddressFields, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof AddressFields;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      setSubmitError("Fix the highlighted fields and try again.");
      return;
    }

    const validation = validateShippingAddress({
      countryCode: fields.countryCode,
      stateCode: fields.stateCode,
    });
    if (!validation.ok) {
      setSubmitError(validation.reason);
      return;
    }
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    }
    router.push("/checkout/method");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="addr-name" required>
            Recipient name
          </FieldLabel>
          <div className="mt-2">
            <Input
              id="addr-name"
              name="name"
              autoComplete="name"
              required
              value={fields.name}
              onChange={(e) => set("name", e.target.value)}
              error={fieldErrors.name}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="addr-email" required>
            Email
          </FieldLabel>
          <div className="mt-2">
            <Input
              id="addr-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={fields.email}
              onChange={(e) => set("email", e.target.value)}
              error={fieldErrors.email}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="addr-street" required>
            Street address
          </FieldLabel>
          <div className="mt-2">
            <Input
              id="addr-street"
              name="street"
              autoComplete="address-line1"
              required
              value={fields.street}
              onChange={(e) => set("street", e.target.value)}
              error={fieldErrors.street}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="addr-street2">Apt / suite / unit</FieldLabel>
          <div className="mt-2">
            <Input
              id="addr-street2"
              name="street2"
              autoComplete="address-line2"
              value={fields.street2}
              onChange={(e) => set("street2", e.target.value)}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="addr-city" required>
            City
          </FieldLabel>
          <div className="mt-2">
            <Input
              id="addr-city"
              name="city"
              autoComplete="address-level2"
              required
              value={fields.city}
              onChange={(e) => set("city", e.target.value)}
              error={fieldErrors.city}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="addr-state" required>
            State
          </FieldLabel>
          <div className="mt-2">
            <select
              id="addr-state"
              name="stateCode"
              required
              value={fields.stateCode}
              onChange={(e) => set("stateCode", e.target.value)}
              aria-invalid={showStateWarning ? "true" : "false"}
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-strong)] text-[14px] text-[var(--text)]"
            >
              <option value="">Select state…</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
          {showStateWarning && !stateValidation.ok && (
            <p
              role="alert"
              className="mt-2 text-[12px] font-mono text-[var(--pill-error)]"
            >
              {stateValidation.reason}
            </p>
          )}
          {fieldErrors.stateCode && !showStateWarning && (
            <p
              role="alert"
              className="mt-2 text-[12px] font-mono text-[var(--pill-error)]"
            >
              {fieldErrors.stateCode}
            </p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="addr-zip" required>
            Zip
          </FieldLabel>
          <div className="mt-2">
            <Input
              id="addr-zip"
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              value={fields.zip}
              onChange={(e) => set("zip", e.target.value)}
              error={fieldErrors.zip}
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="addr-country">Country</FieldLabel>
          <div className="mt-2">
            <select
              id="addr-country"
              name="countryCode"
              value={fields.countryCode}
              disabled
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-strong)] text-[14px] text-[var(--text-muted)] cursor-not-allowed"
            >
              <option value="US">United States</option>
            </select>
          </div>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            US shipping only · International coming after Day-90.
          </p>
        </div>
      </div>

      {submitError && (
        <div
          role="alert"
          className="border border-[var(--pill-error)] rounded-[var(--radius-md)] p-3 text-[14px] text-[var(--pill-error)]"
        >
          {submitError}
        </div>
      )}

      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
        Blocked states (Day-1): {BLOCKED_US_STATES.join(" · ")}
      </p>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={showStateWarning}
        >
          Continue to payment
        </Button>
      </div>
    </form>
  );
}
