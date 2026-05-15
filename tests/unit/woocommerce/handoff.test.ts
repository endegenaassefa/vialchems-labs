import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildWooCheckoutUrl,
  buildWooOrderPayload,
  createMockWooOrder,
  createWooOrder,
  isMockWooHandoffEnabled,
} from "@/lib/woocommerce/handoff";

const lines = [
  {
    sku: "BPC-157-10MG",
    slug: "bpc-157-10mg",
    name: "BPC-157 - 10mg - Research Use Only",
    unitPriceCents: 5900,
    qty: 2,
  },
  {
    sku: "TB-500-5MG",
    slug: "tb-500-5mg",
    name: "TB-500 - 5mg - Research Use Only",
    unitPriceCents: 6900,
    qty: 1,
  },
];

describe("WooCommerce handoff payload", () => {
  it("uses generic public line item names and stores real details in metadata", () => {
    const payload = buildWooOrderPayload({
      lines,
      shippingCents: 1500,
      preferredPaymentMethod: "bitcoin",
      sourceUrl: "https://vialchemlabs.net/cart",
      returnUrl: "https://vialchemlabs.net/order-confirmed",
    });

    expect(payload.status).toBe("pending");
    expect(payload.currency).toBe("USD");
    expect(payload.set_paid).toBe(false);
    expect(payload.created_via).toBe("vialchemlabs-nextjs-cart");
    expect(payload.line_items).toHaveLength(2);

    expect(payload.line_items[0]).toMatchObject({
      name: "Research Supply Order - SKU BPC-157-10MG",
      quantity: 2,
      subtotal: "118.00",
      total: "118.00",
    });
    expect(payload.line_items[0].name).not.toContain("BPC-157 - 10mg");
    expect(payload.line_items[0].meta_data).toEqual(
      expect.arrayContaining([
        { key: "_real_sku", value: "BPC-157-10MG" },
        { key: "_real_name", value: "BPC-157 - 10mg - Research Use Only" },
        { key: "_real_slug", value: "bpc-157-10mg" },
        { key: "_real_unit_price_cents", value: "5900" },
        { key: "_real_line_total_cents", value: "11800" },
      ]),
    );

    expect(payload.shipping_lines).toEqual([
      {
        method_id: "vialchemlabs_main_site_flat_rate",
        method_title: "Shipping",
        total: "15.00",
      },
    ]);
    expect(payload.meta_data).toEqual(
      expect.arrayContaining([
        { key: "_handoff_source", value: "vialchemlabs.net" },
        { key: "_handoff_source_url", value: "https://vialchemlabs.net/cart" },
        {
          key: "_handoff_return_url",
          value: "https://vialchemlabs.net/order-confirmed",
        },
        { key: "_preferred_payment_method", value: "bitcoin" },
      ]),
    );
  });

  it("omits paid shipping lines for free-shipping orders", () => {
    const payload = buildWooOrderPayload({
      lines,
      shippingCents: 0,
      preferredPaymentMethod: "link_money",
      sourceUrl: "https://vialchemlabs.net/cart",
      returnUrl: "https://vialchemlabs.net/order-confirmed",
    });

    expect(payload.shipping_lines).toEqual([]);
  });
});

describe("WooCommerce checkout URL", () => {
  it("builds the locked order-pay URL for the shop subdomain", () => {
    expect(
      buildWooCheckoutUrl(
        "https://shop.vialchemlabs.net/",
        727,
        "wc_order_58d2d042d1d",
      ),
    ).toBe(
      "https://shop.vialchemlabs.net/checkout/order-pay/727/?key=wc_order_58d2d042d1d",
    );
  });
});

describe("development mock handoff", () => {
  it("is disabled unless explicitly enabled outside production", () => {
    expect(
      isMockWooHandoffEnabled({
        NODE_ENV: "development",
        ALLOW_WOO_MOCK_HANDOFF_IN_DEVELOPMENT: "false",
      } as NodeJS.ProcessEnv),
    ).toBe(false);

    expect(
      isMockWooHandoffEnabled({
        NODE_ENV: "production",
        ALLOW_WOO_MOCK_HANDOFF_IN_DEVELOPMENT: "true",
      } as NodeJS.ProcessEnv),
    ).toBe(false);

    expect(
      isMockWooHandoffEnabled({
        NODE_ENV: "development",
        ALLOW_WOO_MOCK_HANDOFF_IN_DEVELOPMENT: "true",
      } as NodeJS.ProcessEnv),
    ).toBe(true);
  });

  it("returns a second-origin checkout redirect for preview mode", () => {
    const result = createMockWooOrder({
      storeUrl: "http://localhost:3002/",
      lines,
      shippingCents: 1500,
      returnUrl: "http://localhost:3001/order-confirmed",
    });

    const checkoutUrl = new URL(result.checkoutUrl);

    expect(result).toMatchObject({
      id: 260515001,
      orderKey: "wc_order_local_preview",
    });
    expect(checkoutUrl.origin).toBe("http://localhost:3002");
    expect(checkoutUrl.pathname).toBe("/checkout/order-pay/260515001/");
    expect(checkoutUrl.searchParams.get("key")).toBe("wc_order_local_preview");
    expect(checkoutUrl.searchParams.getAll("preview_item")).toEqual([
      "BPC-157-10MG:2",
      "TB-500-5MG:1",
    ]);
    expect(checkoutUrl.searchParams.get("preview_total_cents")).toBe("20200");
    expect(checkoutUrl.searchParams.get("preview_shipping_cents")).toBe("1500");
    expect(checkoutUrl.searchParams.get("return_url")).toBe(
      "http://localhost:3001/order-confirmed",
    );
  });
});

describe("createWooOrder", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("posts to the WooCommerce REST API with Basic Auth and returns checkout data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 727,
          order_key: "wc_order_58d2d042d1d",
        }),
        { status: 201, headers: { "content-type": "application/json" } },
      ),
    );

    const result = await createWooOrder({
      storeUrl: "https://shop.vialchemlabs.net",
      consumerKey: "ck_test",
      consumerSecret: "cs_test",
      order: buildWooOrderPayload({
        lines,
        shippingCents: 1500,
        preferredPaymentMethod: "link_money",
        sourceUrl: "https://vialchemlabs.net/cart",
        returnUrl: "https://vialchemlabs.net/order-confirmed",
      }),
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(url).toBe("https://shop.vialchemlabs.net/wp-json/wc/v3/orders");
    expect(init?.method).toBe("POST");
    expect(init?.cache).toBe("no-store");
    expect((init?.headers as Record<string, string>).Authorization).toBe(
      `Basic ${Buffer.from("ck_test:cs_test").toString("base64")}`,
    );

    expect(result).toEqual({
      id: 727,
      orderKey: "wc_order_58d2d042d1d",
      checkoutUrl:
        "https://shop.vialchemlabs.net/checkout/order-pay/727/?key=wc_order_58d2d042d1d",
    });
  });
});
