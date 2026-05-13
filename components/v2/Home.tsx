"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogItems, displayPrice, skuCode } from "./data";
import { Icon } from "./icons";
import { V2Footer, V2Header } from "./Shell";
import { MoleculeBg, ProductVisual, Reveal, Stat } from "./Visuals";

const featured = [
  "bpc-157-10mg",
  "tb-500-5mg",
  "ghk-cu-50mg",
  "semax-10mg",
  "selank-10mg",
  "mots-c-10mg",
]
  .map((slug) => catalogItems.find((item) => item.slug === slug))
  .filter((item): item is (typeof catalogItems)[number] => Boolean(item));

export function V2Home() {
  return (
    <>
      <V2Header />
      <main id="main">
        <Hero />
        <AssuranceBand />
        <HowItWorks />
        <Features />
        <ProductPreview />
      </main>
      <V2Footer />
    </>
  );
}

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <MoleculeBg />
      </div>
      <div
        className="container v2-hero-grid"
        style={{
          position: "relative",
          padding: "72px 24px 88px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.12fr) minmax(340px, 0.92fr)",
          gap: 72,
          alignItems: "center",
          minHeight: 612,
        }}
        data-v2-home-hero=""
      >
        <div className="v2-hero-copy">
          <div className="badge badge-ruo" style={{ marginBottom: 24 }}>
            <span className="badge-dot" />
            VAILCHEM.LABS · RESEARCH USE ONLY
          </div>
          <h1 style={{ marginBottom: 24 }}>
            Research-grade peptides,{" "}
            <em style={{ fontStyle: "normal", color: "var(--fg-muted)" }}>
              shipped with the COA.
            </em>
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--fg-muted)",
              maxWidth: 520,
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            Batch-traceable materials for verified research organizations. Every
            vial links back to its certificate of analysis, lot history, and
            release documentation.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 40,
              flexWrap: "wrap",
            }}
          >
            <Link className="btn btn-accent btn-lg" href="/shop">
              Browse Catalog <Icon.arrow size={14} strokeWidth={1.5} />
            </Link>
            <Link className="btn btn-ghost btn-lg" href="/coa">
              Verify a Vial
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--fg-muted)",
              textTransform: "uppercase",
            }}
          >
            <span>· Qualified lab orders</span>
            <span>· HPLC purity records</span>
            <span>· COA on every vial</span>
          </div>
        </div>
        <FloatingCards />
      </div>
    </section>
  );
}

function FloatingCards() {
  const [verified, setVerified] = useState(false);
  const semax =
    catalogItems.find((item) => item.slug === "semax-10mg") ?? catalogItems[0];

  useEffect(() => {
    const timer = window.setTimeout(() => setVerified(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="hero-proof-stack"
      style={{ position: "relative", height: 500, perspective: 1200 }}
    >
      <div
        className="hero-proof-glow"
        style={{
          position: "absolute",
          inset: "12% 12%",
          background:
            "radial-gradient(circle, var(--accent-soft), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="hero-proof-card hero-proof-card-product"
        style={{
          position: "absolute",
          top: 18,
          left: 8,
          width: 212,
          animation: "float-y 6s ease-in-out infinite",
        }}
      >
        <div
          className="card"
          style={{ padding: 14, boxShadow: "var(--shadow-lg)" }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <span className="badge badge-ruo">RESEARCH USE</span>
            <span className="badge badge-coa">COA</span>
          </div>
          <div className="product-media" style={{ marginBottom: 10 }}>
            <ProductVisual item={semax} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
            {semax.shortName.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-muted)",
            }}
          >
            {skuCode(semax.sku)} · {semax.dose}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
              paddingTop: 10,
              borderTop: "1px solid var(--line)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {displayPrice(semax.priceCents)}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ok)",
              }}
            >
              · IN STOCK
            </span>
          </div>
        </div>
      </div>

      <div
        className="hero-proof-card hero-proof-card-coa"
        style={{
          position: "absolute",
          top: 68,
          right: 8,
          width: 250,
          animation: "float-y 7s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      >
        <div
          className="card"
          style={{ padding: 16, boxShadow: "var(--shadow-lg)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span className="eyebrow">COA · Verification</span>
            <Icon.shield size={14} strokeWidth={1.5} />
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              marginBottom: 14,
              padding: "8px 10px",
              background: "var(--bg-sunken)",
              borderRadius: "var(--r-sm)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "var(--fg-muted)" }}>LOT</span>
            <span>VC-014-A2604</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <Stat label="PURITY" value="99.4%" highlight={verified} />
            <Stat label="MASS DEV" value="±0.02" />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              border: `1px solid ${verified ? "var(--ok)" : "var(--line)"}`,
              borderRadius: "var(--r-sm)",
              background: verified ? "var(--ok-soft)" : "transparent",
              transition: "all 600ms var(--ease)",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: verified ? "var(--ok)" : "var(--line-strong)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
              }}
            >
              {verified ? (
                <Icon.check size={11} strokeWidth={2} />
              ) : (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: verified ? "var(--ok)" : "var(--fg-muted)",
              }}
            >
              {verified ? "VERIFIED · RELEASED" : "VERIFYING SIGNATURE"}
            </span>
          </div>
        </div>
      </div>

      <div
        className="hero-proof-card hero-proof-card-timeline"
        style={{
          position: "absolute",
          bottom: 8,
          left: 48,
          right: 44,
          animation: "float-y 8s ease-in-out infinite",
          animationDelay: "1s",
        }}
      >
        <div
          className="card"
          style={{ padding: 18, boxShadow: "var(--shadow-lg)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <span className="eyebrow">Batch Traceability</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--fg-muted)",
              }}
            >
              VC-014-A2604
            </span>
          </div>
          <Timeline />
        </div>
      </div>
    </div>
  );
}

function AssuranceBand() {
  const assurances = [
    {
      title: "COA-linked lots",
      body: "Batch documents stay one tap from each vial.",
      icon: <Icon.doc size={18} strokeWidth={1.5} />,
    },
    {
      title: "Identity checks",
      body: "Release records are framed around analytical verification.",
      icon: <Icon.shield size={18} strokeWidth={1.5} />,
    },
    {
      title: "Protected shipment",
      body: "Cold-chain packaging and replacement support are visible before order.",
      icon: <Icon.download size={18} strokeWidth={1.5} />,
    },
    {
      title: "Secure checkout",
      body: "Buyer qualification and payment status stay documented.",
      icon: <Icon.check size={18} strokeWidth={1.5} />,
    },
  ];

  return (
    <section className="v2-assurance-band" aria-label="Ordering assurances">
      <div className="container v2-assurance-grid">
        {assurances.map((item) => (
          <div key={item.title} className="v2-assurance-item">
            <div className="v2-assurance-icon">{item.icon}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  const steps = [
    { label: "Synthesized", date: "MAR 12" },
    { label: "HPLC Tested", date: "MAR 14" },
    { label: "QC Released", date: "MAR 18" },
    { label: "Inventoried", date: "MAR 22" },
    { label: "Available", date: "NOW" },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setActive((value) => (value + 1) % (steps.length + 2)),
      900,
    );
    return () => window.clearInterval(id);
  }, [steps.length]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          right: 8,
          height: 1,
          background: "var(--line)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          height: 1,
          background: "var(--accent-hi)",
          width: `calc(${(Math.min(active, steps.length - 1) / (steps.length - 1)) * 100}% - ${active >= steps.length - 1 ? 16 : 0}px)`,
          transition: "width 900ms var(--ease)",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
          gap: 8,
          position: "relative",
        }}
      >
        {steps.map((step, i) => (
          <div key={step.label}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background:
                  i <= active ? "var(--accent-hi)" : "var(--bg-elevated)",
                border: `1px solid ${i <= active ? "var(--accent-hi)" : "var(--line-strong)"}`,
                marginBottom: 10,
                display: "grid",
                placeItems: "center",
              }}
            >
              {i <= active && (
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--bg-elevated)",
                  }}
                />
              )}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 2 }}>
              {step.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "var(--fg-muted)",
              }}
            >
              {step.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    [
      "01",
      "Confirm Lab Context",
      "Create an account with organization, role, and research-use details so orders stay tied to qualified lab procurement.",
    ],
    [
      "02",
      "Review Lot Documents",
      "Open the catalog by compound, mass, and COA status. Each item keeps identity, lot, and analytical context visible before cart.",
    ],
    [
      "03",
      "Place the Order",
      "Add vials to cart, accept the research-use terms, enter any partner code, and check out through the configured payment rail.",
    ],
    [
      "04",
      "Receive With COA",
      "Shipment records and vial labels reference the same batch-specific certificate, so receiving teams can match inventory to release data.",
    ],
    [
      "05",
      "Verify Anytime",
      "Use the vial verification page to re-check a lot number, purity record, and release documentation whenever the material is reviewed.",
    ],
  ];

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="section-hd">
            <div className="hd-l">
              <div className="eyebrow">How it works</div>
              <h2>From lab account to documented vial in five steps.</h2>
            </div>
            <div
              style={{ maxWidth: 280, fontSize: 14, color: "var(--fg-muted)" }}
            >
              A peptide supplier built for labs that need documentation, not
              promises.
            </div>
          </div>
        </Reveal>
        <div
          className="v2-steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          {steps.map(([n, title, body], i) => (
            <Reveal key={n} delay={i * 80}>
              <div
                style={{
                  padding: "32px 20px",
                  borderRight:
                    i < steps.length - 1 ? "1px solid var(--line)" : "none",
                  minHeight: 220,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--accent-hi)",
                    marginBottom: 24,
                  }}
                >
                  {n}
                </div>
                <h4 style={{ marginBottom: 8 }}>{title}</h4>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--fg-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    [
      "In-House Synthesis",
      "Solid-phase peptide sourcing and release documents reviewed before warehouse intake.",
      <Icon.beaker key="i" size={20} strokeWidth={1.5} />,
    ],
    [
      "HPLC-Verified Purity",
      "Each batch is framed around analytical identity, purity, and batch release documentation.",
      <Icon.shield key="i" size={20} strokeWidth={1.5} />,
    ],
    [
      "COA With Every Vial",
      "Each shipment includes the batch-specific certificate record. No exceptions.",
      <Icon.doc key="i" size={20} strokeWidth={1.5} />,
    ],
    [
      "Verified Buyers Only",
      "A research-use attestation is required before restricted order access.",
      <Icon.link key="i" size={20} strokeWidth={1.5} />,
    ],
    [
      "Cold-Chain Shipping",
      "Lyophilized materials packed cold and shipped to the registered lab address.",
      <Icon.download key="i" size={20} strokeWidth={1.5} />,
    ],
    [
      "Re-Verify Anytime",
      "Enter the lot number to re-confirm release data online.",
      <Icon.qr key="i" size={20} strokeWidth={1.5} />,
    ],
  ];

  return (
    <section className="section" style={{ background: "var(--bg-sunken)" }}>
      <div className="container">
        <Reveal>
          <div className="section-hd">
            <div className="hd-l">
              <div className="eyebrow">Platform</div>
              <h2>Documentation, not promises.</h2>
            </div>
          </div>
        </Reveal>
        <div
          className="v2-features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            border: "1px solid var(--line)",
            background: "var(--bg-elevated)",
            borderRadius: "var(--r-md)",
          }}
        >
          {features.map(([title, body, icon], i) => (
            <Reveal key={String(title)} delay={i * 60}>
              <div
                style={{
                  padding: 32,
                  borderRight: i % 3 < 2 ? "1px solid var(--line)" : "none",
                  borderBottom: i < 3 ? "1px solid var(--line)" : "none",
                  minHeight: 200,
                }}
              >
                <div style={{ color: "var(--accent)", marginBottom: 20 }}>
                  {icon}
                </div>
                <h4 style={{ marginBottom: 8 }}>{title}</h4>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--fg-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="section-hd">
            <div className="hd-l">
              <div className="eyebrow">Catalog preview</div>
              <h2>In stock now.</h2>
            </div>
            <Link className="btn btn-ghost" href="/shop">
              View full catalog <Icon.arrow size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>
        <div
          className="v2-preview-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {featured.map((item, i) => (
            <Reveal key={item.slug} delay={i * 40}>
              <Link
                href={`/products/${item.slug}`}
                className="card card-hover"
                style={{ padding: 16, display: "block", cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <span className="badge badge-ruo">RESEARCH USE</span>
                  <span className="badge badge-coa">COA</span>
                  {item.restricted && (
                    <span className="badge badge-restricted">RESTRICTED</span>
                  )}
                </div>
                <div className="product-media" style={{ marginBottom: 14 }}>
                  <ProductVisual item={item} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 6,
                  }}
                >
                  <h4>{item.shortName}</h4>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {displayPrice(item.priceCents)}
                  </span>
                </div>
                <div className="product-code-line">
                  {skuCode(item.sku)} · {item.dose} · {item.family}
                </div>
                <div className="card-action">
                  <span style={{ color: "var(--ok)" }}>
                    · {item.stock} IN STOCK
                  </span>
                  <span>VIEW LOT →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
