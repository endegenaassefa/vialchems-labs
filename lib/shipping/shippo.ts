import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

// Phase A — Shippo REST client. Just the three calls we need:
//
//   1. createShipment()    — POST /shipments with from/to/parcel, returns rates
//   2. purchaseLabel()     — POST /transactions with rateId, returns tracking
//   3. verifyWebhookSignature() — HMAC-SHA256 check for incoming webhooks
//
// We deliberately do NOT use the official Shippo SDK. It pulls in a lot of
// dependencies and we only need three endpoints. Native fetch is enough.
//
// Auth: Authorization: ShippoToken <SHIPPO_API_KEY>
// Webhook signing: X-Shippo-Signature header = HMAC-SHA256(body, SHIPPO_WEBHOOK_SECRET)

const SHIPPO_BASE_URL = "https://api.goshippo.com";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Address {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface Parcel {
  // Inches + ounces. Sensible defaults for a single vial shipment in a
  // small bubble mailer.
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  weightOz: number;
}

export interface ShippoRate {
  objectId: string;
  provider: "USPS" | "UPS" | "FedEx" | "DHL Express" | string;
  servicelevel: string; // e.g. "Priority", "Ground Advantage"
  amountCents: number;
  currency: string;
  estimatedDays: number | null;
}

export interface ShippoShipment {
  objectId: string;
  rates: ShippoRate[];
}

export interface ShippoTransaction {
  objectId: string;
  trackingNumber: string;
  trackingUrl: string | null;
  labelUrl: string | null;
  carrier: string;
  rateObjectId: string;
}

interface ShippoConfig {
  apiKey: string;
  baseUrl?: string;
  // Test mode forces SHIPPO_TEST=true (uses Shippo's test carrier). When
  // ENABLE_SHIPPO_TEST_MODE is set or the API key starts with "shippo_test_"
  // we route through test endpoints automatically.
  testMode?: boolean;
}

function loadConfig(): ShippoConfig {
  const apiKey = process.env.SHIPPO_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("SHIPPO_API_KEY is not configured");
  }
  const testMode =
    process.env.ENABLE_SHIPPO_TEST_MODE === "true" ||
    apiKey.startsWith("shippo_test_");
  return { apiKey, testMode };
}

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function shippoFetch<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  configOverride?: ShippoConfig,
): Promise<T> {
  const config = configOverride ?? loadConfig();
  const url = `${config.baseUrl ?? SHIPPO_BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `ShippoToken ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "<unreadable body>");
    throw new Error(
      `shippo_request_failed: ${response.status} ${response.statusText} — ${text.slice(0, 500)}`,
    );
  }

  return (await response.json()) as T;
}

// ---------------------------------------------------------------------------
// 1. createShipment — get rates for a from/to/parcel combo
// ---------------------------------------------------------------------------

interface ShippoAddressPayload {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

function toShippoAddress(a: Address): ShippoAddressPayload {
  return {
    name: a.name,
    street1: a.street1,
    street2: a.street2,
    city: a.city,
    state: a.state,
    zip: a.zip,
    country: a.country,
    phone: a.phone,
    email: a.email,
  };
}

interface RawShippoRate {
  object_id: string;
  provider: string;
  servicelevel: { name: string; token: string };
  amount: string; // dollars, string
  currency: string;
  estimated_days: number | null;
}

interface RawShippoShipment {
  object_id: string;
  rates: RawShippoRate[];
}

export async function createShipment(
  from: Address,
  to: Address,
  parcel: Parcel,
  configOverride?: ShippoConfig,
): Promise<ShippoShipment> {
  const raw = await shippoFetch<RawShippoShipment>(
    "POST",
    "/shipments/",
    {
      address_from: toShippoAddress(from),
      address_to: toShippoAddress(to),
      parcels: [
        {
          length: parcel.lengthIn.toString(),
          width: parcel.widthIn.toString(),
          height: parcel.heightIn.toString(),
          distance_unit: "in",
          weight: parcel.weightOz.toString(),
          mass_unit: "oz",
        },
      ],
      async: false,
    },
    configOverride,
  );

  return {
    objectId: raw.object_id,
    rates: raw.rates.map((r) => ({
      objectId: r.object_id,
      provider: r.provider as ShippoRate["provider"],
      servicelevel: r.servicelevel.name,
      amountCents: Math.round(parseFloat(r.amount) * 100),
      currency: r.currency,
      estimatedDays: r.estimated_days,
    })),
  };
}

// ---------------------------------------------------------------------------
// 2. purchaseLabel — buy a specific rate, get tracking back
// ---------------------------------------------------------------------------

interface RawShippoTransaction {
  object_id: string;
  status: "QUEUED" | "WAITING" | "SUCCESS" | "ERROR";
  tracking_number: string;
  tracking_url_provider: string | null;
  label_url: string | null;
  rate: string; // rate object id
  // The carrier on the chosen rate is on the transaction's nested
  // `parent_carrier_account` but we capture it from the rate at call time.
  messages?: Array<{ source: string; code: string; text: string }>;
}

export async function purchaseLabel(
  rateObjectId: string,
  carrier: string,
  configOverride?: ShippoConfig,
): Promise<ShippoTransaction> {
  const raw = await shippoFetch<RawShippoTransaction>(
    "POST",
    "/transactions/",
    {
      rate: rateObjectId,
      label_file_type: "PDF",
      async: false,
    },
    configOverride,
  );

  if (raw.status !== "SUCCESS") {
    const messages =
      raw.messages?.map((m) => `${m.code}: ${m.text}`).join("; ") ||
      "no messages";
    throw new Error(`shippo_label_purchase_failed: ${raw.status} (${messages})`);
  }

  return {
    objectId: raw.object_id,
    trackingNumber: raw.tracking_number,
    trackingUrl: raw.tracking_url_provider,
    labelUrl: raw.label_url,
    carrier,
    rateObjectId: raw.rate,
  };
}

// ---------------------------------------------------------------------------
// 3. refundLabel — void/refund a purchased label
// ---------------------------------------------------------------------------

interface RawShippoRefund {
  object_id: string;
  status: "QUEUED" | "PENDING" | "SUCCESS" | "ERROR";
  transaction: string;
}

export interface ShippoRefund {
  objectId: string;
  status: string;
  transactionObjectId: string;
}

// Voids/refunds a purchased label. Used when a label was bought but the
// order could not be advanced to 'shipped' (e.g. a concurrent ship request
// won the optimistic lock first) — refunding the loser's label prevents an
// orphan paid label. Shippo processes refunds async; QUEUED/PENDING means
// accepted, the money comes back once the carrier confirms.
export async function refundLabel(
  transactionObjectId: string,
  configOverride?: ShippoConfig,
): Promise<ShippoRefund> {
  const raw = await shippoFetch<RawShippoRefund>(
    "POST",
    "/refunds/",
    { transaction: transactionObjectId, async: false },
    configOverride,
  );
  return {
    objectId: raw.object_id,
    status: raw.status,
    transactionObjectId: raw.transaction,
  };
}

// ---------------------------------------------------------------------------
// 4. Webhook signature verification (HMAC-SHA256)
// ---------------------------------------------------------------------------

// Shippo signs webhooks with HMAC-SHA256(body, SHIPPO_WEBHOOK_SECRET) and
// sends the hex digest in the X-Shippo-Signature header. Reject anything
// that doesn't match in constant time — never use string equality.
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  secret: string,
): boolean {
  if (!signatureHeader || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(signatureHeader.trim());
  if (expectedBuffer.length !== suppliedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, suppliedBuffer);
}

// Webhook payload schema (the subset we care about for tracking updates).
// Shippo sends many event types; we only act on track_updated for now.
export const trackingWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    tracking_number: z.string(),
    tracking_status: z
      .object({
        status: z.enum([
          "UNKNOWN",
          "PRE_TRANSIT",
          "TRANSIT",
          "DELIVERED",
          "RETURNED",
          "FAILURE",
        ]),
        status_date: z.string().optional(),
        location: z.unknown().optional(),
      })
      .nullable()
      .optional(),
    carrier: z.string().optional(),
  }),
});
export type TrackingWebhookPayload = z.infer<typeof trackingWebhookSchema>;

// Convenience for the route handler: map Shippo tracking_status enum to our
// internal order status. Only DELIVERED triggers a state transition v1;
// other events are recorded in audit_log but don't move the order.
export function shippoStatusToOrderStatus(
  shippoStatus: string,
): "delivered" | null {
  return shippoStatus === "DELIVERED" ? "delivered" : null;
}
