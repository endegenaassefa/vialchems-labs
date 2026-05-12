export type ProductCategory = "analytical" | "reference" | "handling";

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  summary: string;
  category: ProductCategory;
  format: string;
  priceCents: number;
  checkoutEnabled: boolean;
  researchUseOnly: boolean;
  storage: string;
};

export type StaffRole = "staff" | "admin";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CustomerProfile = {
  id: string;
  email: string;
  fullName: string | null;
  organization: string | null;
  ageVerified: boolean;
  ruoAcknowledged: boolean;
  qualified: boolean;
  qualifiedAt: string | null;
  blacklisted: boolean;
};

export type CustomerQualification = {
  institutionName: string;
  institutionType: string;
  roleTitle: string;
  procurementContext: string;
  supportingNotes: string;
  attestationAge: boolean;
  attestationRuo: boolean;
  attestationNoHumanUse: boolean;
};

export type Attestation = {
  id: string;
  label: string;
  clause: string;
  required: true;
};

export type ResearchRequestStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_more_info";

export type ResearchRequestSubmission = {
  clientRequestId: string;
  contactName: string;
  organization: string;
  email: string;
  projectSummary: string;
  attestationIds: string[];
  items: CartItem[];
};

export type ResearchOrderRequest = {
  id: string;
  contactName: string;
  organization: string;
  email: string;
  projectSummary: string;
  status: ResearchRequestStatus;
  items: CartItem[];
  consentLogs: ConsentLog[];
};

export type ConsentLog = {
  attestationId: string;
  clause: string;
  accepted: boolean;
  acceptedAt: string;
  source: string;
};

export type StaffProfile = {
  id: string;
  email: string;
  fullName: string | null;
  organization: string | null;
  role: StaffRole;
  staffActive: boolean;
  ageVerified: boolean;
  blacklisted: boolean;
};

export type ResearchRequestItemDetail = {
  productId: string;
  productSku: string;
  productName: string;
  productPriceCents: number;
  quantity: number;
};

export type ResearchRequestListItem = {
  id: string;
  contactName: string;
  organization: string;
  email: string;
  projectSummary: string;
  status: ResearchRequestStatus;
  createdAt: string;
  updatedAt: string;
  lastStatusChangedAt: string;
};

export type ResearchRequestStatusHistoryEntry = {
  id: number;
  previousStatus: ResearchRequestStatus | null;
  nextStatus: ResearchRequestStatus;
  actorType: "system" | "staff";
  actorProfileId: string | null;
  note: string | null;
  createdAt: string;
  actorName: string | null;
  actorEmail: string | null;
};

export type StaffNote = {
  id: number;
  requestId: string;
  authorProfileId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  authorName: string | null;
  authorEmail: string | null;
};

export type ResearchRequestDetail = ResearchRequestListItem & {
  requestOrigin: string | null;
  originIpHash: string | null;
  userAgent: string | null;
  items: ResearchRequestItemDetail[];
  consentLogs: ConsentLog[];
  statusHistory: ResearchRequestStatusHistoryEntry[];
  notes: StaffNote[];
};

export type RequestStatusTransitionInput = {
  nextStatus: ResearchRequestStatus;
  note?: string;
};

export type StaffNoteInput = {
  body: string;
};

export type OrderStatus =
  | "draft"
  | "payment_requested"
  | "payment_pending"
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "delivered"
  | "issue"
  | "cancelled"
  | "refunded";

export type OrderStatusTransitionInput = {
  nextStatus: OrderStatus;
  note?: string;
};

export type OrderShipmentUpdateInput = {
  trackingReference?: string;
  trackingUrl?: string;
  shipmentNote?: string;
};

export type OrderEmailEvent =
  | "payment_requested"
  | "payment_failed"
  | "paid"
  | "issue"
  | "shipped";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export type OrderRecord = {
  id: string;
  customerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentProvider: string | null;
  paymentIntentId: string | null;
  paymentMethodSummary: string | null;
  externalPaymentUrl: string | null;
  externalPaymentReference: string | null;
  paymentLastEventId: string | null;
  customerNextStep: string | null;
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  shippingName: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  billingSameAsShipping: boolean;
  notes: string | null;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  paymentRequestedAt: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  completedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  shipmentTrackingReference: string | null;
  shipmentTrackingUrl: string | null;
  shipmentNote: string | null;
};

export type OrderItemRecord = {
  id: number;
  orderId: string;
  productId: string;
  productSku: string;
  productName: string;
  priceCents: number;
  quantity: number;
  createdAt: string;
};

export type OrderStatusHistoryRecord = {
  id: number;
  orderId: string;
  previousStatus: OrderStatus | null;
  nextStatus: OrderStatus;
  actorType: string;
  actorId: string | null;
  note: string | null;
  createdAt: string;
};
