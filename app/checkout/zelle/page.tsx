import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/content/products";
import { V2Footer, V2Header } from "@/components/v2/Shell";
import { Icon } from "@/components/v2/icons";

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

export default async function ZelleCheckoutPage({
  searchParams,
}: ZelleCheckoutPageProps) {
  const params = await searchParams;
  const order = safeReference(param(params, "order"));
  const amountCents = cents(param(params, "amount_cents"));
  const recipientName = safeReference(param(params, "recipient_name"));
  const recipientHandle = safeReference(param(params, "recipient_handle"));
  const memo = safeReference(param(params, "memo"));
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
              This payment is completed on vialchemlabs.net and verified
              manually after receipt.
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
            <div className="card" style={{ padding: 28 }}>
              <p className="eyebrow" style={{ marginBottom: 18 }}>
                Zelle payment instructions
              </p>

              <div style={{ display: "grid", gap: 14 }}>
                <InstructionBlock label="Amount to send">
                  {formatPrice(amountCents)}
                </InstructionBlock>
                <InstructionBlock label="Send to">
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
                    Use this exact memo so the payment can be matched to your
                    order.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <Link
                  className="btn btn-accent btn-lg"
                  href={`/order-confirmed?order=${encodeURIComponent(order)}`}
                >
                  I&apos;ve sent the payment{" "}
                  <Icon.arrow size={14} strokeWidth={1.5} />
                </Link>
                <Link className="btn btn-ghost btn-lg" href="/cart">
                  Back to cart
                </Link>
              </div>
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
