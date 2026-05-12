import { formatOrderCurrency } from "@/lib/orders";
import type { OrderEmailEvent, OrderStatus, PaymentStatus } from "@/lib/types";

type OrderEmailOrder = {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalCents: number;
  customerEmail: string;
  shippingName: string | null;
  customerNextStep: string | null;
  shipmentTrackingReference: string | null;
  staffEmails?: string[];
};

type OrderEmailJob = {
  event: OrderEmailEvent;
  to: string;
  subject: string;
  text: string;
};

type OrderEmailTransport = {
  deliver(job: OrderEmailJob): Promise<void>;
};

function getEmailFromAddress() {
  return process.env.ORDER_EMAIL_FROM?.trim() || "orders@mogtrix.local";
}

function buildCustomerSubject(event: OrderEmailEvent, order: OrderEmailOrder) {
  switch (event) {
    case "payment_requested":
      return `Complete payment for order ${order.id}`;
    case "payment_failed":
      return `Payment needs attention for order ${order.id}`;
    case "paid":
      return `Payment received for order ${order.id}`;
    case "issue":
      return `Order ${order.id} needs follow-up`;
    case "shipped":
      return `Shipment update for order ${order.id}`;
  }
}

function buildStaffSubject(event: OrderEmailEvent, order: OrderEmailOrder) {
  switch (event) {
    case "payment_requested":
      return `Order ${order.id} requested payment`;
    case "payment_failed":
      return `Order ${order.id} payment needs attention`;
    case "paid":
      return `Order ${order.id} has been paid`;
    case "issue":
      return `Order ${order.id} needs follow-up`;
    case "shipped":
      return `Order ${order.id} shipment update sent`;
  }
}

function buildCustomerBody(event: OrderEmailEvent, order: OrderEmailOrder) {
  const name = order.shippingName?.trim() || "Customer";
  const total = formatOrderCurrency(order.totalCents);

  switch (event) {
    case "payment_requested":
      return [
        `Hello ${name},`,
        `Your Mogtrix order ${order.id} is ready for hosted payment.`,
        `Order total: ${total}.`,
        order.customerNextStep || "Complete your hosted payment to continue."
      ].join("\n\n");
    case "payment_failed":
      return [
        `Hello ${name},`,
        `Payment for order ${order.id} did not complete.`,
        `Order total: ${total}.`,
        order.customerNextStep || "Return to your order to retry payment or contact support."
      ].join("\n\n");
    case "paid":
      return [
        `Hello ${name},`,
        `Payment for order ${order.id} has been confirmed.`,
        `Order total: ${total}.`,
        "Your order is now moving into fulfillment review."
      ].join("\n\n");
    case "issue":
      return [
        `Hello ${name},`,
        `Order ${order.id} needs follow-up before it can move forward.`,
        order.customerNextStep || "Review the latest order status or contact support for help."
      ].join("\n\n");
    case "shipped":
      return [
        `Hello ${name},`,
        `Order ${order.id} has a shipment update.`,
        order.shipmentTrackingReference
          ? `Tracking reference: ${order.shipmentTrackingReference}.`
          : "Tracking details will follow shortly.",
        "You can check the latest status in your account order history."
      ].join("\n\n");
  }
}

function buildStaffBody(event: OrderEmailEvent, order: OrderEmailOrder) {
  const total = formatOrderCurrency(order.totalCents);

  switch (event) {
    case "payment_requested":
      return [
        `Order ${order.id} has requested hosted payment.`,
        `Customer: ${order.customerEmail}.`,
        `Total: ${total}.`
      ].join("\n\n");
    case "payment_failed":
      return [
        `Order ${order.id} had a failed or cancelled payment event.`,
        `Customer: ${order.customerEmail}.`,
        `Total: ${total}.`
      ].join("\n\n");
    case "paid":
      return [
        `Order ${order.id} has been marked paid.`,
        `Customer: ${order.customerEmail}.`,
        `Total: ${total}.`
      ].join("\n\n");
    case "issue":
      return [
        `Order ${order.id} needs follow-up.`,
        `Customer: ${order.customerEmail}.`,
        `Total: ${total}.`
      ].join("\n\n");
    case "shipped":
      return [
        `Shipment update sent for order ${order.id}.`,
        `Customer: ${order.customerEmail}.`,
        order.shipmentTrackingReference
          ? `Tracking reference: ${order.shipmentTrackingReference}.`
          : "No tracking reference supplied."
      ].join("\n\n");
  }
}

export function parseOrderStaffEmails(rawValue: string | null | undefined) {
  if (!rawValue) {
    return [];
  }

  return Array.from(
    new Set(
      rawValue
        .split(/[\s,;]+/)
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

export function buildOrderEmailJobs(event: OrderEmailEvent, order: OrderEmailOrder): OrderEmailJob[] {
  const staffEmails = order.staffEmails ?? parseOrderStaffEmails(process.env.ORDER_STAFF_EMAILS);

  return [
    {
      event,
      to: order.customerEmail.trim().toLowerCase(),
      subject: buildCustomerSubject(event, order),
      text: buildCustomerBody(event, order)
    },
    ...staffEmails.map((email) => ({
      event,
      to: email,
      subject: buildStaffSubject(event, order),
      text: buildStaffBody(event, order)
    }))
  ];
}

function createDefaultTransport(): OrderEmailTransport {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getEmailFromAddress();

  if (!apiKey) {
    return {
      async deliver(job) {
        console.info("[order-email]", {
          from,
          ...job
        });
      }
    };
  }

  return {
    async deliver(job) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from,
          to: [job.to],
          subject: job.subject,
          text: job.text
        })
      });

      if (!response.ok) {
        throw new Error(`Resend request failed with status ${response.status}.`);
      }
    }
  };
}

export async function sendOrderEmail(
  event: OrderEmailEvent,
  order: OrderEmailOrder,
  transport: OrderEmailTransport = createDefaultTransport()
) {
  const jobs = buildOrderEmailJobs(event, order);

  for (const job of jobs) {
    await transport.deliver(job);
  }

  return jobs;
}

export type { OrderEmailJob, OrderEmailOrder, OrderEmailTransport };
