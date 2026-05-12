import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { buildAuthUrl, normalizeSafeNextPath } from "@/lib/auth-helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  OrderShipmentUpdateInput,
  OrderStatus,
  OrderStatusTransitionInput,
  PaymentStatus,
  RequestStatusTransitionInput,
  ResearchRequestDetail,
  ResearchRequestItemDetail,
  ResearchRequestListItem,
  ResearchRequestStatus,
  ResearchRequestStatusHistoryEntry,
  StaffNote,
  StaffNoteInput,
  StaffProfile
} from "@/lib/types";

const REQUEST_STATUS_OPTIONS = ["pending_review", "needs_more_info", "approved", "rejected"] as const;
const ORDER_STATUS_OPTIONS = [
  "draft",
  "payment_requested",
  "payment_pending",
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "completed",
  "delivered",
  "issue",
  "cancelled",
  "refunded"
] as const satisfies readonly OrderStatus[];
type RequestStatusOption = typeof REQUEST_STATUS_OPTIONS[number];
type OrderStatusOption = typeof ORDER_STATUS_OPTIONS[number];

type StaffProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
  role: StaffProfile["role"];
  staff_active: boolean;
  age_verified: boolean;
  blacklisted: boolean;
};

type QueueRow = {
  id: string;
  contact_name: string;
  organization: string;
  email: string;
  project_summary: string;
  status: ResearchRequestStatus;
  created_at: string;
  updated_at: string;
  last_status_changed_at: string;
};

type RequestRow = QueueRow & {
  request_origin: string | null;
  origin_ip_hash: string | null;
  user_agent: string | null;
};

type RequestItemRow = {
  product_id: string;
  product_sku: string;
  product_name: string;
  product_price_cents: number;
  quantity: number;
};

type ConsentLogRow = {
  attestation_id: string;
  clause: string;
  accepted: boolean;
  accepted_at: string;
  source: string;
};

type StatusHistoryRow = {
  id: number;
  previous_status: ResearchRequestStatus | null;
  next_status: ResearchRequestStatus;
  actor_type: "system" | "staff";
  actor_profile_id: string | null;
  note: string | null;
  created_at: string;
  actor?: {
    full_name: string | null;
    email: string | null;
  } | {
    full_name: string | null;
    email: string | null;
  }[] | null;
};

type StaffNoteRow = {
  id: number;
  request_id: string;
  author_profile_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    email: string | null;
  } | {
    full_name: string | null;
    email: string | null;
  }[] | null;
};

type SessionClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
type ReadySession = {
  kind: "ready";
  supabase: NonNullable<SessionClient>;
  user: User;
  profile: StaffProfile;
};

export const STAFF_AUTH_ERROR = {
  auth: "auth",
  config: "config",
  credentials: "credentials",
  inactive: "inactive",
  profile: "profile",
  signup: "signup",
  signupCredentials: "signup_credentials",
  signupDisabled: "signup_disabled"
} as const;

export const STAFF_AUTH_STATUS = {
  signupPending: "signup_pending"
} as const;

export type StaffAuthErrorCode =
  typeof STAFF_AUTH_ERROR[keyof typeof STAFF_AUTH_ERROR];

export type StaffAuthStatusCode =
  typeof STAFF_AUTH_STATUS[keyof typeof STAFF_AUTH_STATUS];

type StaffSessionState =
  | { kind: "unavailable" }
  | { kind: "anonymous"; supabase: NonNullable<SessionClient> }
  | { kind: "forbidden"; supabase: NonNullable<SessionClient>; reason: "missing_profile" | "inactive"; user: User; profile?: StaffProfile }
  | ReadySession;

export { REQUEST_STATUS_OPTIONS };

function isResearchRequestStatus(value: string): value is RequestStatusOption {
  return REQUEST_STATUS_OPTIONS.includes(value as RequestStatusOption);
}

function isOrderStatus(value: string): value is OrderStatusOption {
  return ORDER_STATUS_OPTIONS.includes(value as OrderStatusOption);
}

function buildLoginUrl(nextPath: string | null, error?: StaffAuthErrorCode) {
  return buildOpsAuthUrl({ error, next: nextPath ?? undefined });
}

function sanitizeSearchTerm(value: string | null | undefined) {
  return value?.trim().slice(0, 80) ?? "";
}

function escapeFilterValue(value: string) {
  return value.replace(/[%_,]/g, "");
}

function mapQueueRow(row: QueueRow): ResearchRequestListItem {
  return {
    id: row.id,
    contactName: row.contact_name,
    organization: row.organization,
    email: row.email,
    projectSummary: row.project_summary,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastStatusChangedAt: row.last_status_changed_at
  };
}

function mapRequestItemRow(row: RequestItemRow): ResearchRequestItemDetail {
  return {
    productId: row.product_id,
    productSku: row.product_sku,
    productName: row.product_name,
    productPriceCents: row.product_price_cents,
    quantity: row.quantity
  };
}

function mapStatusHistoryRow(row: StatusHistoryRow): ResearchRequestStatusHistoryEntry {
  const actor = Array.isArray(row.actor) ? row.actor[0] ?? null : row.actor ?? null;

  return {
    id: row.id,
    previousStatus: row.previous_status,
    nextStatus: row.next_status,
    actorType: row.actor_type,
    actorProfileId: row.actor_profile_id,
    note: row.note,
    createdAt: row.created_at,
    actorName: actor?.full_name ?? null,
    actorEmail: actor?.email ?? null
  };
}

function mapStaffNoteRow(row: StaffNoteRow): StaffNote {
  const author = Array.isArray(row.author) ? row.author[0] ?? null : row.author ?? null;

  return {
    id: row.id,
    requestId: row.request_id,
    authorProfileId: row.author_profile_id,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: author?.full_name ?? null,
    authorEmail: author?.email ?? null
  };
}

export function normalizeOpsNextPath(value: string | null | undefined) {
  return normalizeSafeNextPath(value, {
    fallback: "/ops",
    isAllowedPath: (nextPath) => nextPath.startsWith("/ops"),
    disallowedPrefixes: ["/ops/login"]
  });
}

export function buildOpsAuthUrl(params: {
  mode?: "signup";
  error?: StaffAuthErrorCode;
  status?: StaffAuthStatusCode;
  next?: string;
}) {
  return buildAuthUrl("/ops/login", {
    error: params.error,
    status: params.status,
    next: params.next,
    normalizeNextPath: normalizeOpsNextPath,
    extra: {
      mode: params.mode
    }
  });
}

export function mapStaffProfileRow(row: StaffProfileRow): StaffProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    organization: row.organization,
    role: row.role,
    staffActive: row.staff_active,
    ageVerified: row.age_verified,
    blacklisted: row.blacklisted
  };
}

export function validateRequestStatusTransitionInput(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { ok: false as const, errors: ["Invalid request status payload."], input: null };
  }

  const nextStatus = typeof (payload as RequestStatusTransitionInput).nextStatus === "string"
    ? (payload as RequestStatusTransitionInput).nextStatus.trim()
    : "";
  const rawNote = (payload as RequestStatusTransitionInput).note;
  const note = typeof rawNote === "string"
    ? rawNote.trim()
    : "";

  const errors: string[] = [];
  if (!isResearchRequestStatus(nextStatus)) errors.push("Choose a valid request status.");
  if (note.length > 1000) errors.push("Keep the status note under 1000 characters.");

  return {
    ok: errors.length === 0,
    errors,
    input: errors.length ? null : { nextStatus: nextStatus as OrderStatus, note: note || undefined }
  } as const;
}

export function validateStaffNoteInput(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { ok: false as const, errors: ["Invalid note payload."], input: null };
  }

  const rawBody = (payload as StaffNoteInput).body;
  const body = typeof rawBody === "string"
    ? rawBody.trim()
    : "";
  const errors: string[] = [];

  if (!body) errors.push("Enter a note before saving.");
  if (body.length > 2000) errors.push("Keep the note under 2000 characters.");

  return {
    ok: errors.length === 0,
    errors,
    input: errors.length ? null : { body }
  } as const;
}

export function validateOrderStatusTransitionInput(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { ok: false as const, errors: ["Invalid order status payload."], input: null };
  }

  const nextStatus = typeof (payload as OrderStatusTransitionInput).nextStatus === "string"
    ? (payload as OrderStatusTransitionInput).nextStatus.trim()
    : "";
  const rawNote = (payload as OrderStatusTransitionInput).note;
  const note = typeof rawNote === "string"
    ? rawNote.trim()
    : "";

  const errors: string[] = [];
  if (!isOrderStatus(nextStatus)) errors.push("Choose a valid order status.");
  if (note.length > 1000) errors.push("Keep the status note under 1000 characters.");

  return {
    ok: errors.length === 0,
    errors,
    input: errors.length ? null : { nextStatus, note: note || undefined }
  } as const;
}

export function validateOrderShipmentInput(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { ok: false as const, errors: ["Invalid shipment payload."], input: null };
  }

  const rawTrackingReference = (payload as OrderShipmentUpdateInput).trackingReference;
  const rawTrackingUrl = (payload as OrderShipmentUpdateInput).trackingUrl;
  const rawShipmentNote = (payload as OrderShipmentUpdateInput).shipmentNote;

  const trackingReference = typeof rawTrackingReference === "string"
    ? rawTrackingReference.trim()
    : "";
  const trackingUrl = typeof rawTrackingUrl === "string"
    ? rawTrackingUrl.trim()
    : "";
  const shipmentNote = typeof rawShipmentNote === "string"
    ? rawShipmentNote.trim()
    : "";

  const errors: string[] = [];
  if (trackingReference.length > 120) errors.push("Keep the tracking reference under 120 characters.");
  if (shipmentNote.length > 1000) errors.push("Keep the shipment note under 1000 characters.");

  if (trackingUrl) {
    try {
      const parsed = new URL(trackingUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.push("Enter a valid tracking URL.");
      }
    } catch {
      errors.push("Enter a valid tracking URL.");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    input: errors.length ? null : {
      trackingReference: trackingReference || undefined,
      trackingUrl: trackingUrl || undefined,
      shipmentNote: shipmentNote || undefined
    }
  } as const;
}

export function canAutoAdvanceOrderToShipped(input: {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}) {
  if (input.paymentStatus !== "succeeded") {
    return false;
  }

  return input.status === "paid" || input.status === "processing";
}

export async function getStaffSessionState(existingClient?: NonNullable<SessionClient>): Promise<StaffSessionState> {
  const supabase = existingClient ?? await createServerSupabaseClient();
  if (!supabase) return { kind: "unavailable" };

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { kind: "anonymous", supabase };
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, organization, role, staff_active, age_verified, blacklisted")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profileRow) {
    return { kind: "forbidden", supabase, reason: "missing_profile", user };
  }

  const profile = mapStaffProfileRow(profileRow);
  if (!profile.staffActive || profile.blacklisted || !["staff", "admin"].includes(profile.role)) {
    return { kind: "forbidden", supabase, reason: "inactive", user, profile };
  }

  return { kind: "ready", supabase, user, profile };
}

export async function requireStaffPageSession(nextPath: string) {
  const session = await getStaffSessionState();

  if (session.kind === "unavailable") {
    redirect(buildLoginUrl(nextPath, "config"));
  }

  if (session.kind === "anonymous") {
    redirect(buildLoginUrl(nextPath));
  }

  if (session.kind === "forbidden") {
    await session.supabase.auth.signOut();
    redirect(buildLoginUrl(nextPath, session.reason === "missing_profile" ? "profile" : "inactive"));
  }

  return session;
}

export async function listResearchRequestQueue(
  supabase: ReadySession["supabase"],
  input: { status?: string | null; query?: string | null }
) {
  let query = supabase
    .from("research_order_requests")
    .select("id, contact_name, organization, email, project_summary, status, created_at, updated_at, last_status_changed_at")
    .order("created_at", { ascending: false })
    .range(0, 99);

  if (input.status && isResearchRequestStatus(input.status)) {
    query = query.eq("status", input.status);
  }

  const search = sanitizeSearchTerm(input.query);
  if (search) {
    const value = escapeFilterValue(search);
    query = query.or([
      `id.ilike.%${value}%`,
      `contact_name.ilike.%${value}%`,
      `organization.ilike.%${value}%`,
      `email.ilike.%${value}%`
    ].join(","));
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => mapQueueRow(row as QueueRow));
}

export async function getResearchRequestDetail(
  supabase: ReadySession["supabase"],
  requestId: string
): Promise<ResearchRequestDetail | null> {
  const requestQuery = supabase
    .from("research_order_requests")
    .select("id, contact_name, organization, email, project_summary, status, request_origin, origin_ip_hash, user_agent, created_at, updated_at, last_status_changed_at")
    .eq("id", requestId)
    .maybeSingle();
  const itemsQuery = supabase
    .from("research_order_items")
    .select("product_id, product_sku, product_name, product_price_cents, quantity")
    .eq("request_id", requestId)
    .order("id", { ascending: true });
  const consentQuery = supabase
    .from("consent_logs")
    .select("attestation_id, clause, accepted, accepted_at, source")
    .eq("request_id", requestId)
    .order("id", { ascending: true });
  const historyQuery = supabase
    .from("request_status_history")
    .select("id, previous_status, next_status, actor_type, actor_profile_id, note, created_at, actor:profiles!actor_profile_id(full_name, email)")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });
  const notesQuery = supabase
    .from("staff_notes")
    .select("id, request_id, author_profile_id, body, created_at, updated_at, author:profiles!author_profile_id(full_name, email)")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });

  const [requestResult, itemsResult, consentResult, historyResult, notesResult] = await Promise.all([
    requestQuery,
    itemsQuery,
    consentQuery,
    historyQuery,
    notesQuery
  ]);

  if (requestResult.error || !requestResult.data) return null;

  return {
    ...mapQueueRow(requestResult.data as RequestRow),
    requestOrigin: requestResult.data.request_origin,
    originIpHash: requestResult.data.origin_ip_hash,
    userAgent: requestResult.data.user_agent,
    items: (itemsResult.data ?? []).map((row) => mapRequestItemRow(row as RequestItemRow)),
    consentLogs: (consentResult.data ?? []).map((row) => ({
      attestationId: (row as ConsentLogRow).attestation_id,
      clause: (row as ConsentLogRow).clause,
      accepted: (row as ConsentLogRow).accepted,
      acceptedAt: (row as ConsentLogRow).accepted_at,
      source: (row as ConsentLogRow).source
    })),
    statusHistory: (historyResult.data ?? []).map((row) => mapStatusHistoryRow(row as StatusHistoryRow)),
    notes: (notesResult.data ?? []).map((row) => mapStaffNoteRow(row as StaffNoteRow))
  };
}
