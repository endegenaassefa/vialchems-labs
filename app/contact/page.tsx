"use client";

/**
 * Contact form. Posts to /api/contact (stub route — JSON ok).
 *
 * Per Iron Law 2.4: We do not respond to dosing questions. The disclaimer
 * is part of the page UI; the message-input placeholder reinforces it.
 *
 * Form submission is intentionally minimal — we render an in-page success
 * message rather than navigating away. No user-facing PII is logged client-side.
 */
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";

type Status = "idle" | "submitting" | "ok" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("topic") !== "custom-order") return;
    const customSku = params.get("sku");
    const customProduct = params.get("product");
    if (!messageRef.current || messageRef.current.value) return;
    messageRef.current.value = [
      "Custom order request",
      customProduct ? `Product: ${customProduct}` : null,
      customSku ? `SKU: ${customSku}` : null,
      "",
      "Laboratory context:",
      "Quantity requested:",
    ]
      .filter(Boolean)
      .join("\n");
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      form.reset();
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* v4 hero — varied. Contact gets an immediate, address-first hero
            (mono email + response-time stat, akin to akiflow.com's no-fluff
            CTA section). */}
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] mb-10">
              C O N T A C T
            </p>
            <h1 className="text-[clamp(36px,4.8vw,60px)] font-light leading-[1.1] tracking-tight text-[var(--text)] mb-10">
              Reach the team in one business day.
            </h1>
            <div className="grid gap-px bg-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden grid-cols-1 md:grid-cols-2 mb-8">
              <div className="bg-[var(--surface)] px-6 py-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)] mb-3">
                  Email
                </p>
                <p className="font-mono text-[16px] text-[var(--accent)]">
                  research@vialchemlabs.net
                </p>
              </div>
              <div className="bg-[var(--surface)] px-6 py-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)] mb-3">
                  Response window
                </p>
                <p className="font-mono tabular text-[16px] text-[var(--text)]">
                  ≤ 1 business day
                </p>
              </div>
            </div>
            <p className="text-[16px] leading-[1.55] text-[var(--text-muted)] max-w-2xl">
              For Certificate of Analysis records, the public library is at{" "}
              <Link
                href="/coa"
                className="text-[var(--accent)] hover:text-[var(--accent-soft)]"
              >
                /coa
              </Link>{" "}
              — no contact form needed.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl px-6 py-16">
            <Card
              variant="elevated"
              className="mb-10 px-6 py-5 text-[14px] text-[var(--text-muted)] leading-[1.6]"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2">
                Scope
              </p>
              <p>
                We do not respond to dosing questions per Iron Law 2.4. Dosing
                for laboratory experimental design is at the discretion of the
                qualified researcher per their study protocol.
              </p>
            </Card>

            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="contact-name" required>
                    Name
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Researcher name"
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="contact-email" required>
                    Email
                  </FieldLabel>
                  <div className="mt-2">
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="research@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="contact-message" required>
                  Message
                </FieldLabel>
                <div className="mt-2">
                  <textarea
                    id="contact-message"
                    ref={messageRef}
                    name="message"
                    required
                    rows={6}
                    placeholder="Order ID, COA batch number, or operational question."
                    className="
                      w-full
                      bg-[var(--surface-strong)] text-[var(--text)]
                      placeholder:text-[var(--text-subtle)]
                      border border-[var(--border)] rounded-[10px]
                      px-3 py-3
                      text-[16px] leading-[1.5]
                      transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
                      hover:border-[var(--border-strong)]
                      focus-visible:outline-2 focus-visible:outline-[var(--accent)]
                      resize-y min-h-[140px]
                    "
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Response within one business day
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </Button>
              </div>

              {status === "ok" ? (
                <Toast
                  message="Message logged. The team will respond within one business day."
                  tone="success"
                  duration={6000}
                  onDismiss={() => setStatus("idle")}
                />
              ) : null}
              {status === "error" ? (
                <Toast
                  message={
                    errorMsg
                      ? `Submission could not be transmitted: ${errorMsg}. Please retry, or email research@vialchemlabs.net.`
                      : "Submission could not be transmitted. Please retry, or email research@vialchemlabs.net."
                  }
                  tone="error"
                  duration={0}
                  onDismiss={() => setStatus("idle")}
                />
              ) : null}
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
