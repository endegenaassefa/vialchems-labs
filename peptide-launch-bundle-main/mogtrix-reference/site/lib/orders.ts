import type {
  CartItem,
  OrderItemRecord,
  OrderRecord,
  OrderStatus,
  PaymentStatus
} from "@/lib/types";

export type CustomerOrderState = {
  label: string;
  actionRequired: boolean;
  tone: "neutral" | "positive" | "warning";
};

export type CheckoutProductSnapshot = {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  active: boolean;
  checkoutEnabled: boolean;
};

export type OrderShippingInput = {
  shippingName: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  billingSameAsShipping?: boolean;
  notes?: string;
};

export type BuildOrderDraftInput = {
  customerId: string;
  idempotencyKey: string;
  items: CartItem[];
  products: CheckoutProductSnapshot[];
  shipping: OrderShippingInput;
};

export type BuiltOrderDraft = {
  order: Omit<
    OrderRecord,
    | "createdAt"
    | "updatedAt"
    | "paymentRequestedAt"
    | "paidAt"
    | "shippedAt"
    | "completedAt"
    | "deliveredAt"
    | "cancelledAt"
    | "paymentProvider"
    | "paymentIntentId"
    | "paymentMethodSummary"
  >;
  items: Array<
    Omit<OrderItemRecord, "id" | "createdAt"> & {
      orderId: string;
    }
  >;
};

export function createOrderId() {
  return `ord_${crypto.randomUUID().replace(/-/g, "").slice(0, 18)}`;
}

export function buildOrderDraft(input: BuildOrderDraftInput): BuiltOrderDraft {
  if (!input.items.length) {
    throw new Error("At least one item is required.");
  }

  if (input.shipping.shippingCountry.trim().toUpperCase() !== "US") {
    throw new Error("US shipping is required for the first-sale pilot.");
  }

  const productMap = new Map(input.products.map((product) => [product.id, product]));
  const orderId = createOrderId();
  const items = input.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product || !product.active) {
      throw new Error(`Product ${item.productId} is not available.`);
    }

    if (!product.checkoutEnabled) {
      throw new Error(`Product ${item.productId} is outside the pilot checkout set.`);
    }

    return {
      orderId,
      productId: item.productId,
      productSku: product.sku,
      productName: product.name,
      priceCents: product.priceCents,
      quantity: item.quantity
    };
  });

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );
  const taxCents = 0;
  const shippingCents = 0;
  const totalCents = subtotalCents + taxCents + shippingCents;

  if (totalCents <= 0) {
    throw new Error("Order total must be positive.");
  }

  return {
    order: {
      id: orderId,
      customerId: input.customerId,
      status: "draft" satisfies OrderStatus,
      paymentStatus: "pending" satisfies PaymentStatus,
      externalPaymentUrl: null,
      externalPaymentReference: null,
      paymentLastEventId: null,
      customerNextStep: "Return to checkout to request your hosted payment link.",
      subtotalCents,
      taxCents,
      shippingCents,
      totalCents,
      shippingName: input.shipping.shippingName.trim(),
      shippingAddressLine1: input.shipping.shippingAddressLine1.trim(),
      shippingAddressLine2: input.shipping.shippingAddressLine2?.trim() || null,
      shippingCity: input.shipping.shippingCity.trim(),
      shippingState: input.shipping.shippingState.trim(),
      shippingPostalCode: input.shipping.shippingPostalCode.trim(),
      shippingCountry: input.shipping.shippingCountry.trim() || "US",
      billingSameAsShipping: input.shipping.billingSameAsShipping ?? true,
      notes: input.shipping.notes?.trim() || null,
      idempotencyKey: input.idempotencyKey,
      shipmentTrackingReference: null,
      shipmentTrackingUrl: null,
      shipmentNote: null
    },
    items
  };
}

export function formatOrderCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function getOrderStatusLabel(status: OrderStatus) {
  switch (status) {
    case "payment_requested":
      return "Payment requested";
    case "payment_pending":
    case "pending_payment":
      return "Payment pending";
    case "paid":
      return "Paid";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "completed":
      return "Completed";
    case "delivered":
      return "Delivered";
    case "issue":
      return "Issue";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    default:
      return "Draft";
  }
}

export function getPaymentStatusLabel(status: PaymentStatus) {
  switch (status) {
    case "processing":
      return "Processing";
    case "succeeded":
      return "Succeeded";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    default:
      return "Pending";
  }
}

export function getCustomerOrderState(input: Pick<OrderRecord, "status" | "paymentStatus">): CustomerOrderState {
  if (
    input.status === "issue" ||
    input.status === "cancelled" ||
    input.status === "refunded" ||
    input.paymentStatus === "failed" ||
    input.paymentStatus === "cancelled" ||
    input.paymentStatus === "refunded"
  ) {
    return {
      label: "Issue / follow-up required",
      actionRequired: true,
      tone: "warning"
    };
  }

  switch (input.status) {
    case "draft":
    case "payment_requested":
      return {
        label: "Action needed",
        actionRequired: true,
        tone: "neutral"
      };
    case "payment_pending":
    case "pending_payment":
      return {
        label: "Payment pending",
        actionRequired: false,
        tone: "neutral"
      };
    case "paid":
      return {
        label: "Paid, under review",
        actionRequired: false,
        tone: "positive"
      };
    case "processing":
    case "shipped":
      return {
        label: "Preparing shipment",
        actionRequired: false,
        tone: "positive"
      };
    case "completed":
    case "delivered":
      return {
        label: "Completed",
        actionRequired: false,
        tone: "positive"
      };
    default:
      return {
        label: "Issue / follow-up required",
        actionRequired: true,
        tone: "warning"
      };
  }
}
