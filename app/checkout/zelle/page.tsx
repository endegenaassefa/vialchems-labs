import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/content/products";
import {
  getZelleCheckoutSigningSecret,
  verifyZelleCheckoutSignature,
} from "@/lib/checkout/direct-payment";
import { ZelleReceiptForm } from "@/components/ZelleReceiptForm";
import { V2Footer, V2Header } from "@/components/v2/Shell";

export const metadata: Metadata = {
  title: "Zelle Checkout",
};

type ZelleCheckoutPageProps = {
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
  if (!value || !/^[A-Za-z0-9_.@+ -]{1,120}$/.test(value)) return "Pending";
  return value;
}

function cents(value: string | null): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function safeImageUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
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

export default async function ZelleCheckoutPage({
  searchParams,
}: ZelleCheckoutPageProps) {
  const params = await searchParams;
  const signedParams = toSearchParams(params);
  const signatureValid = verifyZelleCheckoutSignature(
    signedParams,
    getZelleCheckoutSigningSecret(),
  );
  const order = safeReference(param(params, "order"));
  const amountCents = cents(param(params, "amount_cents"));
  const recipientName = safeReference(param(params, "recipient_name"));
  const recipientHandle = safeReference(param(params, "recipient_handle"));
  const memo = safeReference(param(params, "memo"));
  const zelleEmail = param(params, "zelle_email");
  const supportEmail = safeReference(param(params, "support_email"));
  const signature = safeReference(param(params, "sig"));
  const qrImageUrl = safeImageUrl(param(params, "qr_image_url"));

  return (
    <>
      <V2Header />
      <main id="main">
        <section className="catalog-hero">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Zelle checkout
            </div>
            <h1 style={{ fontSize: 42, marginBottom: 8 }}>
              Send Zelle payment
            </h1>
            <p style={{ color: "var(--fg-muted)" }}>
              Complete payment in your bank app, then return here with the order
              memo intact.
            </p>
          </div>
        </section>

        <section className="section">
          <div
            className="container"
            style={{
              maxWidth: 1040,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
              gap: 24,
              alignItems: "start",
            }}
          >
            {!signatureValid ? (
              <div className="card" style={{ padding: 28 }}>
                <p className="eyebrow" style={{ marginBottom: 18 }}>
                  Invalid checkout link
                </p>
                <h2 style={{ marginBottom: 12 }}>
                  Start Zelle checkout from your cart.
                </h2>
                <p style={{ color: "var(--fg-muted)", lineHeight: 1.6 }}>
                  The payment amount and memo are protected against link
                  editing. Return to the cart and choose Zelle again.
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
              <>
                <div className="card" style={{ padding: 28 }}>
                  <p className="eyebrow" style={{ marginBottom: 18 }}>
                    Zelle payment instructions
                  </p>

                  <div style={{ display: "grid", gap: 14 }}>
                    <InstructionBlock label="Amount to send">
                      {formatPrice(amountCents)}
                    </InstructionBlock>
                    <InstructionBlock label="Zelle ID">
                      {recipientHandle}
                      <span
                        style={{
                          display: "block",
                          color: "var(--fg-muted)",
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        {recipientName}
                      </span>
                    </InstructionBlock>
                    <div
                      className="card"
                      style={{
                        padding: 18,
                        borderColor: "var(--accent-hi)",
                        background: "var(--accent-soft)",
                      }}
                    >
                      <p className="eyebrow" style={{ marginBottom: 8 }}>
                        Memo / note
                      </p>
                      <p
                        className="mono"
                        style={{
                          fontSize: 24,
                          fontWeight: 600,
                          wordBreak: "break-word",
                        }}
                      >
                        {memo}
                      </p>
                      <p
                        style={{
                          color: "var(--fg-muted)",
                          fontSize: 13,
                          marginTop: 10,
                        }}
                      >
                        Use this exact memo so the payment can be matched to
                        your order.
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <ZelleReceiptForm
                      order={order}
                      amountCents={amountCents}
                      recipientName={recipientName}
                      recipientHandle={recipientHandle}
                      memo={memo}
                      zelleEmail={zelleEmail}
                      supportEmail={supportEmail}
                      signature={signature}
                    />
                  </div>
                  <p
                    style={{
                      color: "var(--fg-muted)",
                      fontSize: 13,
                      lineHeight: 1.6,
                      marginTop: 18,
                    }}
                  >
                    Staff verifies Zelle receipt before dispatch. For payment
                    questions, email {supportEmail}. Need to change items? Use
                    the cart button below before submitting this receipt.
                  </p>
                  <Link
                    className="btn btn-ghost btn-lg"
                    href="/cart"
                    style={{ marginTop: 14 }}
                  >
                    Back to cart
                  </Link>
                </div>

                <aside className="card" style={{ padding: 22 }}>
                  <p className="eyebrow" style={{ marginBottom: 14 }}>
                    Order reference
                  </p>
                  <p className="mono" style={{ fontSize: 22, fontWeight: 500 }}>
                    {order}
                  </p>
                  <div className="spec-table" style={{ marginTop: 18 }}>
                    <table>
                      <tbody>
                        <tr>
                          <td>Total</td>
                          <td>{formatPrice(amountCents)}</td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td>Awaiting Zelle</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {qrImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Zelle QR"
                      src={qrImageUrl}
                      style={{
                        width: "100%",
                        marginTop: 18,
                        border: "1px solid var(--line)",
                        borderRadius: "var(--r-md)",
                      }}
                    />
                  ) : null}
                </aside>
              </>
            )}
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}

function InstructionBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>
        {label}
      </p>
      <p className="mono" style={{ fontSize: 20, wordBreak: "break-word" }}>
        {children}
      </p>
    </div>
  );
}
