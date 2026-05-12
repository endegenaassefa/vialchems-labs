"use client";

type ShippingValues = {
  shippingName: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
};

type ShippingErrors = Partial<Record<keyof ShippingValues, string>>;

export function ShippingForm({
  values,
  errors,
  locked,
  loading,
  submitDisabled = false,
  onChange,
  onSubmit
}: {
  values: ShippingValues;
  errors: ShippingErrors;
  locked: boolean;
  loading: boolean;
  submitDisabled?: boolean;
  onChange: (field: keyof ShippingValues, value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="metal rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Shipping
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            Where should this order go?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Keep this short and operational. The summary rail stays visible while you
            prepare the order for payment.
          </p>
        </div>
        {locked ? (
          <span className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-white">
            Locked for payment
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Shipping name"
          name="shippingName"
          value={values.shippingName}
          error={errors.shippingName}
          disabled={locked}
          onChange={onChange}
        />
        <Field
          label="Country"
          name="shippingCountry"
          value={values.shippingCountry}
          error={errors.shippingCountry}
          disabled={locked}
          readOnly
          helpText="US shipping only in the first-sale pilot."
          onChange={onChange}
        />
        <Field
          label="Address line 1"
          name="shippingAddressLine1"
          value={values.shippingAddressLine1}
          error={errors.shippingAddressLine1}
          disabled={locked}
          onChange={onChange}
          className="sm:col-span-2"
        />
        <Field
          label="Address line 2"
          name="shippingAddressLine2"
          value={values.shippingAddressLine2}
          error={errors.shippingAddressLine2}
          disabled={locked}
          onChange={onChange}
          className="sm:col-span-2"
          optional
        />
        <Field
          label="City"
          name="shippingCity"
          value={values.shippingCity}
          error={errors.shippingCity}
          disabled={locked}
          onChange={onChange}
        />
        <Field
          label="State"
          name="shippingState"
          value={values.shippingState}
          error={errors.shippingState}
          disabled={locked}
          onChange={onChange}
        />
        <Field
          label="Postal code"
          name="shippingPostalCode"
          value={values.shippingPostalCode}
          error={errors.shippingPostalCode}
          disabled={locked}
          onChange={onChange}
        />
      </div>

      {!locked ? (
        <button
          type="button"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
          disabled={loading || submitDisabled}
          onClick={onSubmit}
        >
          {loading ? "Preparing payment..." : "Continue to payment"}
        </button>
      ) : null}
    </section>
  );
}

function Field({
  className,
  label,
  name,
  value,
  error,
  disabled,
  readOnly = false,
  optional = false,
  helpText,
  onChange
}: {
  className?: string;
  label: string;
  name: keyof ShippingValues;
  value: string;
  error?: string;
  disabled: boolean;
  readOnly?: boolean;
  optional?: boolean;
  helpText?: string;
  onChange: (field: keyof ShippingValues, value: string) => void;
}) {
  return (
    <label className={`grid gap-2 ${className ?? ""}`}>
      <span>
        {label}
        {optional ? (
          <span className="text-[var(--text-muted)]"> (optional)</span>
        ) : null}
      </span>
      <input
        name={name}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(event) => onChange(name, event.target.value)}
        className="min-h-11 rounded-2xl border border-[var(--border)] bg-black px-4 text-white disabled:opacity-70"
      />
      {helpText ? (
        <span className="text-sm text-[var(--text-muted)]">{helpText}</span>
      ) : null}
      {error ? (
        <span className="text-sm text-[#ffb1a3]">{error}</span>
      ) : null}
    </label>
  );
}
