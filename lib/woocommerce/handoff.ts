/**
 * WooCommerce cart handoff.
 *
 * Codebase evidence:
 * - app/cart/page.tsx renders components/v2/Cart.tsx, so cart handoff belongs
 *   behind the v2 cart UI rather than the older multi-step checkout pages.
 * - components/v2/Cart.tsx uses line objects from lib/cart-store.ts
 *   (sku, slug, name, unitPriceCents, qty).
 *
 * Official Woo evidence:
 * - Woo REST API v3 is the current API and uses /wp-json/wc/v3 endpoints.
 * - Orders expose order_key, line_items, shipping_lines, meta_data, and
 *   set_paid fields; POST /wp-json/wc/v3/orders creates an order.
 * - HTTPS Basic Auth accepts Consumer Key as username and Consumer Secret as
 *   password.
 */

export interface WooHandoffLine {
  sku: string;
  slug: string;
  name: string;
  unitPriceCents: number;
  qty: number;
}

export interface WooOrderPayloadInput {
  lines: WooHandoffLine[];
  shippingCents: number;
  preferredPaymentMethod: string;
  sourceUrl: string;
  returnUrl: string;
}

interface WooMeta {
  key: string;
  value: string;
}

export interface WooOrderPayload {
  status: "pending";
  currency: "USD";
  created_via: "vialchemlabs-nextjs-cart";
  set_paid: false;
  customer_note: string;
  line_items: {
    name: string;
    quantity: number;
    subtotal: string;
    total: string;
    meta_data: WooMeta[];
  }[];
  shipping_lines: {
    method_id: string;
    method_title: string;
    total: string;
  }[];
  meta_data: WooMeta[];
}

export interface CreateWooOrderInput {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
  order: WooOrderPayload;
}

export interface CreatedWooOrder {
  id: number;
  orderKey: string;
  checkoutUrl: string;
}

export class WooHandoffError extends Error {
  constructor(
    message: string,
    readonly status = 500,
  ) {
    super(message);
    this.name = "WooHandoffError";
  }
}

function formatWooMoney(cents: number): string {
  return (cents / 100).toFixed(2);
}

function normalizeStoreUrl(storeUrl: string): string {
  return storeUrl.replace(/\/+$/, "");
}

function normalizeSourceHost(sourceUrl: string): string {
  try {
    return new URL(sourceUrl).hostname;
  } catch {
    return "vialchemlabs.net";
  }
}

export function buildWooCheckoutUrl(
  storeUrl: string,
  orderId: number,
  orderKey: string,
): string {
  const base = normalizeStoreUrl(storeUrl);
  return `${base}/checkout/order-pay/${orderId}/?key=${encodeURIComponent(orderKey)}`;
}

export function buildWooOrderPayload({
  lines,
  shippingCents,
  preferredPaymentMethod,
  sourceUrl,
  returnUrl,
}: WooOrderPayloadInput): WooOrderPayload {
  return {
    status: "pending",
    currency: "USD",
    created_via: "vialchemlabs-nextjs-cart",
    set_paid: false,
    customer_note: "Secure checkout order created from vialchemlabs.net cart.",
    line_items: lines.map((line) => {
      const lineTotalCents = line.unitPriceCents * line.qty;
      return {
        name: `Research Supply Order - SKU ${line.sku}`,
        quantity: line.qty,
        subtotal: formatWooMoney(lineTotalCents),
        total: formatWooMoney(lineTotalCents),
        meta_data: [
          { key: "_real_sku", value: line.sku },
          { key: "_real_name", value: line.name },
          { key: "_real_slug", value: line.slug },
          {
            key: "_real_unit_price_cents",
            value: String(line.unitPriceCents),
          },
          { key: "_real_line_total_cents", value: String(lineTotalCents) },
        ],
      };
    }),
    shipping_lines:
      shippingCents > 0
        ? [
            {
              method_id: "vialchemlabs_main_site_flat_rate",
              method_title: "Shipping",
              total: formatWooMoney(shippingCents),
            },
          ]
        : [],
    meta_data: [
      { key: "_handoff_source", value: normalizeSourceHost(sourceUrl) },
      { key: "_handoff_source_url", value: sourceUrl },
      { key: "_handoff_return_url", value: returnUrl },
      { key: "_preferred_payment_method", value: preferredPaymentMethod },
      { key: "_handoff_version", value: "2026-05-15.1" },
    ],
  };
}

export function getWooConfigFromEnv(env: NodeJS.ProcessEnv = process.env) {
  const storeUrl =
    env.WOOCOMMERCE_STORE_URL?.trim() || "https://shop.vialchemlabs.net";
  const consumerKey = env.WOOCOMMERCE_CONSUMER_KEY?.trim();
  const consumerSecret = env.WOOCOMMERCE_CONSUMER_SECRET?.trim();

  if (!consumerKey) {
    throw new WooHandoffError(
      "Missing required credential: WOOCOMMERCE_CONSUMER_KEY",
      503,
    );
  }
  if (!consumerSecret) {
    throw new WooHandoffError(
      "Missing required credential: WOOCOMMERCE_CONSUMER_SECRET",
      503,
    );
  }

  return {
    storeUrl,
    consumerKey,
    consumerSecret,
  };
}

export async function createWooOrder({
  storeUrl,
  consumerKey,
  consumerSecret,
  order,
}: CreateWooOrderInput): Promise<CreatedWooOrder> {
  const base = normalizeStoreUrl(storeUrl);
  const response = await fetch(`${base}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as {
    id?: unknown;
    order_key?: unknown;
    message?: unknown;
  } | null;

  if (!response.ok) {
    const message =
      typeof body?.message === "string"
        ? body.message
        : `WooCommerce order create failed with status ${response.status}`;
    throw new WooHandoffError(message, response.status);
  }

  if (typeof body?.id !== "number" || typeof body.order_key !== "string") {
    throw new WooHandoffError(
      "WooCommerce order response did not include id and order_key",
    );
  }

  return {
    id: body.id,
    orderKey: body.order_key,
    checkoutUrl: buildWooCheckoutUrl(base, body.id, body.order_key),
  };
}
