"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import { coaRecords, type CoaRecord } from "@/lib/content/coa";
import { Icon } from "./icons";
import { V2Footer, V2Header } from "./Shell";

export function V2Coa() {
  const [query, setQuery] = useState("");
  const hasRecords = coaRecords.length > 0;
  const fuse = useMemo(
    () =>
      new Fuse<CoaRecord>(coaRecords, {
        keys: ["peptideName", "batch", "lab"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [],
  );
  const filtered = useMemo(
    () =>
      query.trim()
        ? fuse.search(query).map((result) => result.item)
        : coaRecords,
    [fuse, query],
  );

  return (
    <>
      <V2Header />
      <main id="main">
        <div className="catalog-hero">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              · COA lookup
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h1 style={{ fontSize: 42, marginBottom: 8 }}>COA status</h1>
                <p style={{ color: "var(--fg-muted)", maxWidth: 640 }}>
                  Verified Certificate of Analysis records appear here after
                  laboratory review, PDF upload, and release approval.
                </p>
                <div className="trust-strip">
                  <span className="trust-chip">
                    <span className="badge-dot" />
                    HPLC purity
                  </span>
                  <span className="trust-chip">
                    <span className="badge-dot" />
                    Sterility screen
                  </span>
                  <span className="trust-chip">
                    <span className="badge-dot" />
                    Endotoxin screen
                  </span>
                </div>
              </div>
              {hasRecords ? (
                <div style={{ position: "relative", width: 360 }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--fg-muted)",
                    }}
                  >
                    <Icon.search size={14} strokeWidth={1.5} />
                  </span>
                  <input
                    className="input mono"
                    placeholder="Search product, lot, lab..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    style={{ paddingLeft: 36 }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="card" style={{ overflow: "hidden" }}>
              {hasRecords ? (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.3fr 1.2fr 120px 1fr 120px 100px",
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--line)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      textTransform: "uppercase",
                      color: "var(--fg-muted)",
                    }}
                  >
                    <div>Material</div>
                    <div>Batch</div>
                    <div>Test date</div>
                    <div>Laboratory</div>
                    <div>HPLC</div>
                    <div />
                  </div>
                  {filtered.map((record, index) => (
                    <Link
                      key={`${record.peptide}-${record.batch}`}
                      href={`/coa/${record.peptide}/${record.batch}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "1.3fr 1.2fr 120px 1fr 120px 100px",
                        padding: "16px",
                        borderBottom:
                          index < filtered.length - 1
                            ? "1px solid var(--line)"
                            : "none",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>
                        {record.peptideName}
                      </div>
                      <div
                        className="mono"
                        style={{ fontSize: 11, color: "var(--fg-muted)" }}
                      >
                        {record.batch}
                      </div>
                      <div
                        className="mono"
                        style={{ fontSize: 11, color: "var(--fg-muted)" }}
                      >
                        {record.testDate}
                      </div>
                      <div style={{ color: "var(--fg-muted)" }}>
                        {record.lab}
                      </div>
                      <div className="mono">
                        {record.hplcPurityPct.toFixed(1)}%
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="badge badge-verified">Verified</span>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div
                  style={{
                    padding: "32px",
                    display: "grid",
                    gap: 14,
                    maxWidth: 680,
                  }}
                >
                  <span
                    className="badge badge-coa"
                    style={{ width: "fit-content" }}
                  >
                    Awaiting release records
                  </span>
                  <h2 style={{ fontSize: 24, margin: 0 }}>
                    No public COA records are posted yet.
                  </h2>
                  <p style={{ color: "var(--fg-muted)", lineHeight: 1.6 }}>
                    Product lots remain gated until documentation is cleared.
                    For current documentation on an order, contact support with
                    the SKU, order reference, or lot code.
                  </p>
                  <Link href="/contact" className="btn btn-accent btn-sm">
                    Contact support
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
