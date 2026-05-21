import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildWooCheckoutUrl,
  buildWooOrderPayload,
  createMockWooOrder,
  createWooOrder,
  getWooConfigFromEnv,
  isMockWooHandoffEnabled,
  WooHandoffError,
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
      preferredPaymentMethod: "link_money",
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
        { key: "_preferred_payment_method", value: "link_money" },
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
      } as unknown as NodeJS.ProcessEnv),
    ).toBe(false);

    expect(
      isMockWooHandoffEnabled({
        NODE_ENV: "production",
        ALLOW_WOO_MOCK_HANDOFF_IN_DEVELOPMENT: "true",
      } as unknown as NodeJS.ProcessEnv),
    ).toBe(false);

    expect(
      isMockWooHandoffEnabled({
        NODE_ENV: "development",
        ALLOW_WOO_MOCK_HANDOFF_IN_DEVELOPMENT: "true",
      } as unknown as NodeJS.ProcessEnv),
    ).toBe(true);
  });

  it("returns a second-origin checkout redirect for preview mode", () => {
    const result = createMockWooOrder({
      storeUrl: "http://localhost:3002/",
      lines,
      shippingCents: 1500,
      preferredPaymentMethod: "paypal",
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
    expect(checkoutUrl.searchParams.get("preview_payment_method")).toBe(
      "paypal",
    );
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

  it("throws WooHandoffError with the WooCommerce error message when the API returns non-2xx", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Invalid signature" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(
      createWooOrder({
        storeUrl: "https://shop.vialchemlabs.net",
        consumerKey: "ck_bad",
        consumerSecret: "cs_bad",
        order: buildWooOrderPayload({
          lines,
          shippingCents: 0,
          preferredPaymentMethod: "link_money",
          sourceUrl: "https://vialchemlabs.net/cart",
          returnUrl: "https://vialchemlabs.net/order-confirmed",
        }),
      }),
    ).rejects.toMatchObject({
      name: "WooHandoffError",
      message: "Invalid signature",
      status: 401,
    });
  });

  it("throws a generic WooHandoffError when WooCommerce returns no message on failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 500 }),
    );

    await expect(
      createWooOrder({
        storeUrl: "https://shop.vialchemlabs.net",
        consumerKey: "ck_test",
        consumerSecret: "cs_test",
        order: buildWooOrderPayload({
          lines,
          shippingCents: 0,
          preferredPaymentMethod: "link_money",
          sourceUrl: "https://vialchemlabs.net/cart",
          returnUrl: "https://vialchemlabs.net/order-confirmed",
        }),
      }),
    ).rejects.toMatchObject({
      name: "WooHandoffError",
      status: 500,
    });
  });

  it("throws WooHandoffError when the body fails to parse as JSON", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("plain text body, not json", { status: 502 }),
    );

    await expect(
      createWooOrder({
        storeUrl: "https://shop.vialchemlabs.net",
        consumerKey: "ck_test",
        consumerSecret: "cs_test",
        order: buildWooOrderPayload({
          lines,
          shippingCents: 0,
          preferredPaymentMethod: "link_money",
          sourceUrl: "https://vialchemlabs.net/cart",
          returnUrl: "https://vialchemlabs.net/order-confirmed",
        }),
      }),
    ).rejects.toMatchObject({
      name: "WooHandoffError",
      status: 502,
    });
  });

  it("throws WooHandoffError when the success response is missing id or order_key", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ order_key: "wc_order_x" }), {
        status: 201,
      }),
    );

    await expect(
      createWooOrder({
        storeUrl: "https://shop.vialchemlabs.net",
        consumerKey: "ck_test",
        consumerSecret: "cs_test",
        order: buildWooOrderPayload({
          lines,
          shippingCents: 0,
          preferredPaymentMethod: "link_money",
          sourceUrl: "https://vialchemlabs.net/cart",
          returnUrl: "https://vialchemlabs.net/order-confirmed",
        }),
      }),
    ).rejects.toThrow("did not include id and order_key");
  });
});

describe("normalizeSourceHost (indirect via buildWooOrderPayload)", () => {
  it("falls back to vialchemlabs.net when sourceUrl cannot be parsed", () => {
    const payload = buildWooOrderPayload({
      lines,
      shippingCents: 0,
      preferredPaymentMethod: "link_money",
      sourceUrl: "not-a-url",
      returnUrl: "https://vialchemlabs.net/order-confirmed",
    });
    const handoffSource = payload.meta_data.find(
      (m) => m.key === "_handoff_source",
    );
    expect(handoffSource?.value).toBe("vialchemlabs.net");
  });
});

describe("WooHandoffError", () => {
  it("defaults to HTTP 500 when no status is supplied", () => {
    const err = new WooHandoffError("boom");
    expect(err.name).toBe("WooHandoffError");
    expect(err.message).toBe("boom");
    expect(err.status).toBe(500);
  });

  it("uses the supplied status code", () => {
    const err = new WooHandoffError("rejected", 401);
    expect(err.status).toBe(401);
  });
});

describe("getWooConfigFromEnv", () => {
  const ORIGINAL_ENV: Record<string, string | undefined> = {
    WOOCOMMERCE_STORE_URL: process.env.WOOCOMMERCE_STORE_URL,
    WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
    WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  };

  beforeEach(() => {
    delete process.env.WOOCOMMERCE_STORE_URL;
    delete process.env.WOOCOMMERCE_CONSUMER_KEY;
    delete process.env.WOOCOMMERCE_CONSUMER_SECRET;
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("throws WooHandoffError(503) when consumer key is missing", () => {
    expect(() =>
      getWooConfigFromEnv({
        WOOCOMMERCE_CONSUMER_SECRET: "cs_test",
      } as unknown as NodeJS.ProcessEnv),
    ).toThrow(/WOOCOMMERCE_CONSUMER_KEY/);
    try {
      getWooConfigFromEnv({
        WOOCOMMERCE_CONSUMER_SECRET: "cs_test",
      } as unknown as NodeJS.ProcessEnv);
    } catch (err) {
      expect((err as WooHandoffError).status).toBe(503);
    }
  });

  it("throws WooHandoffError(503) when consumer secret is missing", () => {
    expect(() =>
      getWooConfigFromEnv({
        WOOCOMMERCE_CONSUMER_KEY: "ck_test",
      } as unknown as NodeJS.ProcessEnv),
    ).toThrow(/WOOCOMMERCE_CONSUMER_SECRET/);
  });

  it("returns the config with the supplied storeUrl when env is complete", () => {
    const config = getWooConfigFromEnv({
      WOOCOMMERCE_STORE_URL: "https://example.test",
      WOOCOMMERCE_CONSUMER_KEY: "ck_test",
      WOOCOMMERCE_CONSUMER_SECRET: "cs_test",
    } as unknown as NodeJS.ProcessEnv);
    expect(config).toEqual({
      storeUrl: "https://example.test",
      consumerKey: "ck_test",
      consumerSecret: "cs_test",
    });
  });

  it("defaults to https://shop.vialchemlabs.net when WOOCOMMERCE_STORE_URL is not set", () => {
    const config = getWooConfigFromEnv({
      WOOCOMMERCE_CONSUMER_KEY: "ck_test",
      WOOCOMMERCE_CONSUMER_SECRET: "cs_test",
    } as unknown as NodeJS.ProcessEnv);
    expect(config.storeUrl).toBe("https://shop.vialchemlabs.net");
  });

  it("defaults to process.env when no env arg is supplied", () => {
    process.env.WOOCOMMERCE_CONSUMER_KEY = "ck_env_test";
    process.env.WOOCOMMERCE_CONSUMER_SECRET = "cs_env_test";
    const config = getWooConfigFromEnv();
    expect(config.consumerKey).toBe("ck_env_test");
    expect(config.consumerSecret).toBe("cs_env_test");
  });

  it("trims whitespace from each credential value", () => {
    const config = getWooConfigFromEnv({
      WOOCOMMERCE_STORE_URL: "  https://shop.test  ",
      WOOCOMMERCE_CONSUMER_KEY: "  ck_pad  ",
      WOOCOMMERCE_CONSUMER_SECRET: "  cs_pad  ",
    } as unknown as NodeJS.ProcessEnv);
    expect(config.storeUrl).toBe("https://shop.test");
    expect(config.consumerKey).toBe("ck_pad");
    expect(config.consumerSecret).toBe("cs_pad");
  });
});

describe("createMockWooOrder edge cases", () => {
  it("omits preview totals when no lines are supplied", () => {
    const result = createMockWooOrder({
      storeUrl: "http://localhost:3002",
    });
    const url = new URL(result.checkoutUrl);
    expect(url.searchParams.get("preview_total_cents")).toBeNull();
    expect(url.searchParams.get("preview_shipping_cents")).toBeNull();
    expect(url.searchParams.getAll("preview_item")).toEqual([]);
  });

  it("omits the return_url query param when not supplied", () => {
    const result = createMockWooOrder({
      storeUrl: "http://localhost:3002",
      lines: [
        {
          sku: "X-1",
          slug: "x-1",
          name: "X",
          unitPriceCents: 100,
          qty: 1,
        },
      ],
    });
    const url = new URL(result.checkoutUrl);
    expect(url.searchParams.get("return_url")).toBeNull();
  });

  it("omits preview_payment_method when not supplied", () => {
    const result = createMockWooOrder({
      storeUrl: "http://localhost:3002",
      lines: [
        {
          sku: "X-1",
          slug: "x-1",
          name: "X",
          unitPriceCents: 100,
          qty: 1,
        },
      ],
    });
    const url = new URL(result.checkoutUrl);
    expect(url.searchParams.get("preview_payment_method")).toBeNull();
  });
});
