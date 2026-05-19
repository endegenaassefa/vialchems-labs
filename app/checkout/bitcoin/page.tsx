import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/content/products";
import { V2Footer, V2Header } from "@/components/v2/Shell";
import { Icon } from "@/components/v2/icons";
import { BitcoinReceiptForm } from "@/components/BitcoinReceiptForm";
import {
  buildBitcoinUri,
  getBitcoinDirectSigningSecret,
  verifyBitcoinDirectCheckoutSignature,
} from "@/lib/payments/bitcoin-direct";

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

function positiveInteger(value: string | null): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function safeBtcAmount(value: string | null): string {
  if (!value || !/^\d+(\.\d{1,8})?$/.test(value)) return "0";
  return value;
}

function safeAddress(value: string | null): string {
  if (!value || !/^[A-Za-z0-9]{26,120}$/.test(value)) return "";
  return value;
}

function safeText(value: string | null): string {
  if (!value || value.length > 2048) return "";
  return value;
}

function safeEmail(value: string | null): string {
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "abhinav@vialchemlabs.net";
  }
  return value;
}

function toSearchParams(
  params: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const raw = Array.isArray(value) ? value[0] : value;
    if (typeof raw === "string") search.set(key, raw);
  }
  return search;
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
  const mode = param(params, "mode");
  const signedParams = toSearchParams(params);
  const directSignatureValid =
    mode === "direct" &&
    verifyBitcoinDirectCheckoutSignature(
      signedParams,
      getBitcoinDirectSigningSecret(),
    );
  const btcSats = positiveInteger(param(params, "btc_sats"));
  const btcAmount = safeBtcAmount(param(params, "btc_amount"));
  const btcUsdCents = positiveInteger(param(params, "btc_usd_cents"));
  const address = safeAddress(param(params, "address"));
  const rateSource = safeText(param(params, "rate_source"));
  const quotedAt = safeText(param(params, "quoted_at"));
  const supportEmail = safeEmail(param(params, "support_email"));
  const signature = safeReference(param(params, "sig"));
  const bitcoinUri =
    directSignatureValid && address && btcAmount !== "0"
      ? buildBitcoinUri({ address, btcAmount, orderId: order })
      : null;

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
              This payment is created from VialChem Labs and does not route
              through the WooCommerce checkout.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container" style={{ maxWidth: 920 }}>
            {mode === "direct" && !directSignatureValid ? (
              <div className="card" style={{ padding: 28 }}>
                <p className="eyebrow" style={{ marginBottom: 18 }}>
                  Invalid checkout link
                </p>
                <h2 style={{ marginBottom: 12 }}>
                  Start Bitcoin checkout from your cart.
                </h2>
                <p style={{ color: "var(--fg-muted)", lineHeight: 1.6 }}>
                  The Bitcoin amount and receive address are protected against
                  link editing. Return to the cart and choose Bitcoin again.
                </p>
                <Link
                  className="btn btn-accent btn-lg"
                  href="/cart"
                  style={{ marginTop: 24 }}
                >
                  Back to cart
                </Link>
              </div>
            ) : (
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
                    <p
                      className="mono"
                      style={{ fontSize: 22, fontWeight: 500 }}
                    >
                      {order}
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: 8 }}>
                      Amount
                    </p>
                    <p
                      className="mono"
                      style={{ fontSize: 22, fontWeight: 500 }}
                    >
                      {formatPrice(amountCents)}
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: 8 }}>
                      {directSignatureValid
                        ? "Bitcoin quote"
                        : "BTCPay invoice"}
                    </p>
                    <p className="mono" style={{ fontSize: 14 }}>
                      {directSignatureValid ? `${btcAmount} BTC` : invoice}
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
                      Add BTCPAY_SERVER_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID,
                      and BTCPAY_WEBHOOK_SECRET to generate a live invoice.
                    </p>
                  </div>
                ) : null}

                {directSignatureValid ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "minmax(0, 1fr) minmax(300px, 380px)",
                      gap: 18,
                      alignItems: "start",
                      marginBottom: 24,
                    }}
                  >
                    <div className="card" style={{ padding: 18 }}>
                      <p className="eyebrow" style={{ marginBottom: 8 }}>
                        Send exactly
                      </p>
                      <p
                        className="mono"
                        style={{ fontSize: 26, fontWeight: 600 }}
                      >
                        {btcAmount} BTC
                      </p>
                      <p style={{ color: "var(--fg-muted)", marginTop: 8 }}>
                        {btcSats.toLocaleString()} sats. Quote source: Coinbase
                        BTC-USD spot at {quotedAt}.
                      </p>
                      <p className="eyebrow" style={{ margin: "18px 0 8px" }}>
                        Receive address
                      </p>
                      <p className="mono" style={{ wordBreak: "break-all" }}>
                        {address}
                      </p>
                      {bitcoinUri ? (
                        <a
                          className="btn btn-accent btn-lg"
                          href={bitcoinUri}
                          style={{ marginTop: 18 }}
                        >
                          Open wallet payment request
                        </a>
                      ) : null}
                    </div>
                    <div className="card" style={{ padding: 18 }}>
                      <p className="eyebrow" style={{ marginBottom: 14 }}>
                        Submit transaction
                      </p>
                      <BitcoinReceiptForm
                        order={order}
                        amountCents={amountCents}
                        btcSats={btcSats}
                        btcAmount={btcAmount}
                        btcUsdCents={btcUsdCents}
                        address={address}
                        rateSource={rateSource}
                        quotedAt={quotedAt}
                        supportEmail={supportEmail}
                        sig={signature}
                      />
                    </div>
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
            )}
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
