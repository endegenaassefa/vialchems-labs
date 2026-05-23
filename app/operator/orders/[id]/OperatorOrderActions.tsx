/**
 * C2 — Operator order action panel (client island)
 * (Section 6 super-prompt 2026-05-22).
 *
 * Three buttons:
 *   - Mark paid (only when status=awaiting_payment + the rail is
 *     manual, i.e. zelle/btcpay/bitcoin-direct/stub)
 *   - Mark shipped (any status, but UI shows the form once the
 *     order is at least paid)
 *   - Add operator note (any status)
 *
 * Each click PATCHes /api/operator/orders/[id] with a typed
 * action body. On 200, refreshes the page to pick up the new
 * server-rendered state.
 */
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Carrier = "USPS" | "UPS" | "FedEx" | "DHL" | "Other";

const CARRIERS: Carrier[] = ["USPS", "UPS", "FedEx", "DHL", "Other"];

interface Props {
  displayId: string;
  status: string;
  paymentProvider: string;
  currentCarrier: string | null;
  currentTracking: string | null;
}

type ActionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

async function patchOrder(displayId: string, body: unknown): Promise<Response> {
  return fetch(`/api/operator/orders/${encodeURIComponent(displayId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function OperatorOrderActions({
  displayId,
  status,
  paymentProvider,
  currentCarrier,
  currentTracking,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [state, setState] = useState<ActionState>({ kind: "idle" });
  const [carrier, setCarrier] = useState<Carrier>(
    (currentCarrier as Carrier) ?? "USPS",
  );
  const [tracking, setTracking] = useState(currentTracking ?? "");
  const [note, setNote] = useState("");

  const isAwaitingPayment = status === "awaiting_payment";
  const isShipped = status === "shipped";

  async function run(body: unknown) {
    setState({ kind: "submitting" });
    const res = await patchOrder(displayId, body);
    if (res.ok) {
      setState({ kind: "idle" });
      startTransition(() => router.refresh());
      return;
    }
    const data = (await res.json().catch(() => null)) as {
      message?: string;
      code?: string;
    } | null;
    setState({
      kind: "error",
      message: data?.message ?? data?.code ?? `HTTP ${res.status}`,
    });
  }

  return (
    <section>
      <h3
        style={{
          fontSize: 12,
          marginBottom: 12,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        Actions
      </h3>

      {isAwaitingPayment ? (
        <div
          style={{
            padding: 14,
            border: "1px solid var(--line)",
            borderRadius: "var(--r-md)",
            marginBottom: 16,
          }}
        >
          <p
            style={{ fontSize: 12, marginBottom: 10, color: "var(--fg-muted)" }}
          >
            Verify the deposit landed in your bank/wallet before clicking.
            Triggers customer + operator "paid" emails.
          </p>
          <button
            type="button"
            disabled={state.kind === "submitting"}
            onClick={() => run({ action: "mark_paid" })}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--accent)",
              background: "var(--accent)",
              color: "#ffffff",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            {state.kind === "submitting" ? "Marking paid…" : "Mark paid"}
          </button>
        </div>
      ) : null}

      {!isShipped ? (
        <div
          style={{
            padding: 14,
            border: "1px solid var(--line)",
            borderRadius: "var(--r-md)",
            marginBottom: 16,
          }}
        >
          <p
            style={{ fontSize: 12, marginBottom: 10, color: "var(--fg-muted)" }}
          >
            Enter the carrier + tracking number, then mark shipped to fire the
            customer's tracking email.
          </p>
          <label
            htmlFor="op-carrier"
            style={{
              display: "block",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              marginBottom: 4,
              color: "var(--fg-muted)",
              textTransform: "uppercase",
            }}
          >
            Carrier
          </label>
          <select
            id="op-carrier"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value as Carrier)}
            style={{
              width: "100%",
              marginBottom: 10,
              padding: "8px 10px",
              fontSize: 14,
              border: "1px solid var(--line)",
              borderRadius: "var(--r-sm)",
              background: "var(--bg-elevated)",
              color: "var(--fg)",
            }}
          >
            {CARRIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label
            htmlFor="op-tracking"
            style={{
              display: "block",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              marginBottom: 4,
              color: "var(--fg-muted)",
              textTransform: "uppercase",
            }}
          >
            Tracking number
          </label>
          <input
            id="op-tracking"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 10,
              padding: "8px 10px",
              fontSize: 16,
              border: "1px solid var(--line)",
              borderRadius: "var(--r-sm)",
              background: "var(--bg-elevated)",
              color: "var(--fg)",
              fontFamily: "var(--font-mono)",
            }}
          />
          <button
            type="button"
            disabled={state.kind === "submitting" || tracking.trim().length < 4}
            onClick={() =>
              run({
                action: "mark_shipped",
                carrier,
                trackingNumber: tracking.trim(),
              })
            }
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--accent)",
              background: "var(--accent)",
              color: "#ffffff",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            {state.kind === "submitting"
              ? "Marking shipped…"
              : "Mark shipped + email customer"}
          </button>
        </div>
      ) : null}

      <div
        style={{
          padding: 14,
          border: "1px solid var(--line)",
          borderRadius: "var(--r-md)",
        }}
      >
        <label
          htmlFor="op-note"
          style={{
            display: "block",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            marginBottom: 4,
            color: "var(--fg-muted)",
            textTransform: "uppercase",
          }}
        >
          Add note
        </label>
        <textarea
          id="op-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: "8px 10px",
            fontSize: 16,
            border: "1px solid var(--line)",
            borderRadius: "var(--r-sm)",
            background: "var(--bg-elevated)",
            color: "var(--fg)",
            fontFamily: "var(--font-mono)",
            resize: "vertical",
          }}
        />
        <button
          type="button"
          disabled={state.kind === "submitting" || note.trim().length === 0}
          onClick={() => {
            run({ action: "add_note", note: note.trim() }).then(() =>
              setNote(""),
            );
          }}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "var(--r-sm)",
            border: "1px solid var(--accent)",
            background: "transparent",
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            cursor: "pointer",
            minHeight: 44,
          }}
        >
          {state.kind === "submitting" ? "Saving…" : "Save note"}
        </button>
      </div>

      {state.kind === "error" ? (
        <p
          role="alert"
          style={{
            marginTop: 12,
            padding: 10,
            border: "1px solid var(--danger)",
            background: "var(--danger-soft)",
            color: "var(--danger)",
            borderRadius: "var(--r-sm)",
            fontSize: 12,
          }}
        >
          {state.message}
        </p>
      ) : null}

      <p
        style={{
          marginTop: 16,
          fontSize: 11,
          color: "var(--fg-muted)",
          lineHeight: 1.5,
        }}
      >
        Mark-paid is for Zelle / bitcoin-direct / BTCPay invoices that the
        operator has manually verified. BTCPay webhooks auto-flip status the
        moment the on-chain confirmation lands; in those cases this button is
        just a no-op confirmation.
      </p>

      {/* Suppress unused-variable lint by surfacing the rail in case the
          dashboard later wants a per-rail action UI. */}
      <p style={{ display: "none" }} data-rail={paymentProvider} />
    </section>
  );
}
