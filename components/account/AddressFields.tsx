"use client";

/**
 * Reusable address sub-form. Used by /register, /account/addresses,
 * and /account/complete-profile. Maps to the addressSchema in
 * lib/validation/customer.ts.
 *
 * Controlled component — the parent owns the state object and passes
 * `value` + `onChange`. Keeps the form-level zod parse straightforward.
 */
import type { ChangeEvent } from "react";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";

export interface AddressValue {
  street1: string;
  street2?: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
}

interface AddressFieldsProps {
  prefix: string;
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  /** When true, every field is rendered with required attribute. */
  required?: boolean;
}

export function emptyAddress(country = "US"): AddressValue {
  return {
    street1: "",
    street2: "",
    city: "",
    region: "",
    postal_code: "",
    country,
  };
}

export function AddressFields({
  prefix,
  value,
  onChange,
  required = true,
}: AddressFieldsProps) {
  const onField =
    (field: keyof AddressValue) => (e: ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [field]: e.target.value });

  const id = (key: string) => `${prefix}-${key}`;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2 flex flex-col gap-1">
        <FieldLabel htmlFor={id("street1")} required={required}>
          Street address
        </FieldLabel>
        <Input
          id={id("street1")}
          name={`${prefix}_street1`}
          autoComplete="address-line1"
          required={required}
          value={value.street1}
          onChange={onField("street1")}
        />
      </div>
      <div className="sm:col-span-2 flex flex-col gap-1">
        <FieldLabel htmlFor={id("street2")}>Apt / Suite / Building</FieldLabel>
        <Input
          id={id("street2")}
          name={`${prefix}_street2`}
          autoComplete="address-line2"
          value={value.street2 ?? ""}
          onChange={onField("street2")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={id("city")} required={required}>
          City
        </FieldLabel>
        <Input
          id={id("city")}
          name={`${prefix}_city`}
          autoComplete="address-level2"
          required={required}
          value={value.city}
          onChange={onField("city")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={id("region")} required={required}>
          State / Region
        </FieldLabel>
        <Input
          id={id("region")}
          name={`${prefix}_region`}
          autoComplete="address-level1"
          required={required}
          value={value.region}
          onChange={onField("region")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={id("postal_code")} required={required}>
          Postal code
        </FieldLabel>
        <Input
          id={id("postal_code")}
          name={`${prefix}_postal_code`}
          autoComplete="postal-code"
          required={required}
          value={value.postal_code}
          onChange={onField("postal_code")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={id("country")} required={required}>
          Country
        </FieldLabel>
        <Input
          id={id("country")}
          name={`${prefix}_country`}
          autoComplete="country"
          required={required}
          maxLength={2}
          minLength={2}
          value={value.country}
          onChange={(e) =>
            onChange({ ...value, country: e.target.value.toUpperCase() })
          }
          placeholder="US"
        />
      </div>
    </div>
  );
}
