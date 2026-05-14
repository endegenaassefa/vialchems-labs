import type { Address, Parcel } from "@/lib/shipping/shippo";

// Phase A — From-address + parcel defaults for one-click Shippo label-buy.
// Read from env (.env.local in dev, Vercel env vars in prod). The owner sets
// these once when configuring shipping; staff click "Buy USPS label" and
// these get sent to Shippo automatically.
//
// Why hardcoded in env: Phase A ships from a single physical location
// (CEO plan D3). When you grow to multiple locations we'd add a `locations`
// table; not v1.

export function getFromAddress(): Address {
  const env = process.env;
  const required = [
    "SHIPPING_FROM_NAME",
    "SHIPPING_FROM_STREET1",
    "SHIPPING_FROM_CITY",
    "SHIPPING_FROM_STATE",
    "SHIPPING_FROM_ZIP",
  ];
  for (const key of required) {
    if (!env[key]?.trim()) {
      throw new Error(
        `shipping_from_address_incomplete: ${key} is not set in env`,
      );
    }
  }
  return {
    name: env.SHIPPING_FROM_NAME!.trim(),
    street1: env.SHIPPING_FROM_STREET1!.trim(),
    street2: env.SHIPPING_FROM_STREET2?.trim() || undefined,
    city: env.SHIPPING_FROM_CITY!.trim(),
    state: env.SHIPPING_FROM_STATE!.trim(),
    zip: env.SHIPPING_FROM_ZIP!.trim(),
    country: env.SHIPPING_FROM_COUNTRY?.trim() || "US",
    phone: env.SHIPPING_FROM_PHONE?.trim() || undefined,
    email: env.SHIPPING_FROM_EMAIL?.trim() || undefined,
  };
}

// Default parcel size for a single-vial peptide shipment. Override per-order
// later if needed; v1 assumes one-size-fits-most padded mailer.
export function getDefaultParcel(): Parcel {
  const env = process.env;
  return {
    lengthIn: parseFloat(env.SHIPPING_DEFAULT_LENGTH_IN ?? "8"),
    widthIn: parseFloat(env.SHIPPING_DEFAULT_WIDTH_IN ?? "6"),
    heightIn: parseFloat(env.SHIPPING_DEFAULT_HEIGHT_IN ?? "2"),
    weightOz: parseFloat(env.SHIPPING_DEFAULT_WEIGHT_OZ ?? "8"),
  };
}

// Convert an orders.shipping_address_snapshot JSON blob into a Shippo
// Address. The snapshot shape lives in checkout — this is the documented
// reverse mapping. If checkout's snapshot format changes, update here.
export function snapshotToShippoAddress(
  snapshot: Record<string, unknown>,
  fallbackEmail: string,
): Address {
  return {
    name:
      (snapshot.name as string) ||
      (snapshot.full_name as string) ||
      "Recipient",
    street1: (snapshot.street1 as string) || (snapshot.line1 as string) || "",
    street2:
      (snapshot.street2 as string) || (snapshot.line2 as string) || undefined,
    city: (snapshot.city as string) || "",
    state: (snapshot.state as string) || (snapshot.region as string) || "",
    zip:
      (snapshot.zip as string) ||
      (snapshot.postal_code as string) ||
      (snapshot.postcode as string) ||
      "",
    country: (snapshot.country as string) || "US",
    phone: (snapshot.phone as string) || undefined,
    email: (snapshot.email as string) || fallbackEmail,
  };
}

// Pick the cheapest USPS rate from a list. Falls back to cheapest of any
// carrier if no USPS rates are returned (rare; Shippo USPS is broadly
// available).
export function pickCheapestRate<
  R extends { provider: string; amountCents: number; objectId: string },
>(rates: R[]): R | null {
  if (rates.length === 0) return null;
  const usps = rates.filter((r) => r.provider.toUpperCase() === "USPS");
  const pool = usps.length > 0 ? usps : rates;
  return pool.reduce((cheapest, current) =>
    current.amountCents < cheapest.amountCents ? current : cheapest,
  );
}
