import type { OrderStatus, PaymentStatus } from "@/lib/types";

type OrderPaymentSnapshot = {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

type PaymentEventSnapshot = {
  eventType: string;
  providerStatus: PaymentStatus;
};

type PaymentEventOutcome =
  | {
      apply: true;
      nextStatus: OrderStatus;
      nextPaymentStatus: PaymentStatus;
      reason?: undefined;
    }
  | {
      apply: false;
      reason: "stale" | "duplicate" | "unsupported";
      nextStatus?: undefined;
      nextPaymentStatus?: undefined;
    };

const FULFILLMENT_COMPLETE_STATUSES = new Set<OrderStatus>([
  "processing",
  "shipped",
  "completed",
  "delivered"
]);

export function getPaymentEventOutcome(
  current: OrderPaymentSnapshot,
  event: PaymentEventSnapshot
): PaymentEventOutcome {
  switch (event.eventType) {
    case "payment.requested":
      if (current.status !== "draft" || current.paymentStatus !== "pending") {
        return { apply: false, reason: "stale" };
      }

      return {
        apply: true,
        nextStatus: "payment_requested",
        nextPaymentStatus: "pending"
      };

    case "payment.pending":
      if (
        current.paymentStatus === "succeeded" ||
        FULFILLMENT_COMPLETE_STATUSES.has(current.status) ||
        current.status === "paid"
      ) {
        return { apply: false, reason: "stale" };
      }

      if (
        current.status === "payment_pending" &&
        current.paymentStatus === event.providerStatus
      ) {
        return { apply: false, reason: "duplicate" };
      }

      return {
        apply: true,
        nextStatus: "payment_pending",
        nextPaymentStatus: event.providerStatus
      };

    case "payment.paid":
      if (
        current.paymentStatus === "succeeded" &&
        (current.status === "paid" || FULFILLMENT_COMPLETE_STATUSES.has(current.status))
      ) {
        return { apply: false, reason: "duplicate" };
      }

      return {
        apply: true,
        nextStatus: FULFILLMENT_COMPLETE_STATUSES.has(current.status) ? current.status : "paid",
        nextPaymentStatus: event.providerStatus
      };

    case "payment.failed":
    case "payment.cancelled":
      if (current.status === "completed" || current.status === "delivered") {
        return { apply: false, reason: "stale" };
      }

      return {
        apply: true,
        nextStatus: "issue",
        nextPaymentStatus: event.providerStatus
      };

    default:
      return { apply: false, reason: "unsupported" };
  }
}

export type {
  OrderPaymentSnapshot,
  PaymentEventOutcome,
  PaymentEventSnapshot
};
