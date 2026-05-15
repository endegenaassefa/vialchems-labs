import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/content/products";
import { V2Footer, V2Header } from "@/components/v2/Shell";
import { Icon } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: "Bitcoin Checkout",
};

type BitcoinCheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function param(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | null {
  const value = params[key];
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || null;
}

function safeReference(value: string | null): string {
  if (!value || !/^[A-Za-z0-9_-]{1,80}$/.test(value)) return "Pending";
  return value;
}

function safeExternalUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function cents(value: string | null): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default async function BitcoinCheckoutPage({
  searchParams,
}: BitcoinCheckoutPageProps) {
  const params = await searchParams;
  const order = safeReference(param(params, "order"));
  const invoice = safeReference(param(params, "invoice"));
  const amountCents = cents(param(params, "amount_cents"));
  const invoiceUrl = safeExternalUrl(param(params, "invoice_url"));
  const isPlaceholder = param(params, "placeholder") === "true";

  return (
    <>
      <V2Header />
      <main id="main">
        <section className="catalog-hero">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Bitcoin checkout
            </div>
            <h1 style={{ fontSize: 42, marginBottom: 8 }}>
              Complete Bitcoin payment
            </h1>
            <p style={{ color: "var(--fg-muted)" }}>
              This payment is created from vialchemlabs.net and does not route
              through the WooCommerce checkout.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: 920 }}>
            <div className="card" style={{ padding: 28 }}>
              <div
                style={{
                  display: "grid",
                  gap: 16,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  marginBottom: 24,
                }}
              >
                <div>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>
                    Order
                  </p>
                  <p className="mono" style={{ fontSize: 22, fontWeight: 500 }}>
                    {order}
                  </p>
                </div>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>
                    Amount
                  </p>
                  <p className="mono" style={{ fontSize: 22, fontWeight: 500 }}>
                    {formatPrice(amountCents)}
                  </p>
                </div>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>
                    BTCPay invoice
                  </p>
                  <p className="mono" style={{ fontSize: 14 }}>
                    {invoice}
                  </p>
                </div>
              </div>

              {isPlaceholder ? (
                <div
                  className="card"
                  style={{
                    padding: 18,
                    background: "var(--warn-soft)",
                    marginBottom: 22,
                  }}
                >
                  <p style={{ fontWeight: 500, marginBottom: 6 }}>
                    BTCPay credentials are placeholders in this environment.
                  </p>
                  <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>
                    Add BTCPAY_SERVER_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID, and
                    BTCPAY_WEBHOOK_SECRET to generate a live invoice.
                  </p>
                </div>
              ) : null}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {invoiceUrl ? (
                  <a
                    className="btn btn-accent btn-lg"
                    href={invoiceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open BTCPay invoice{" "}
                    <Icon.arrow size={14} strokeWidth={1.5} />
                  </a>
                ) : null}
                <Link
                  className="btn btn-primary btn-lg"
                  href={`/order-confirmed?order=${encodeURIComponent(order)}`}
                >
                  Return to order status
                </Link>
                <Link className="btn btn-ghost btn-lg" href="/cart">
                  Back to cart
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
