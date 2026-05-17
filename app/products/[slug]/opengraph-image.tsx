/**
 * Phase 9 (v4) — per-product OpenGraph image per Appendix AD integration plan.
 *
 * One image per PDP showing the labeled vial design (compound + dose +
 * vialchemlabs.net wordmark + RUO). Launch SKUs + request-only records.
 *
 * Iron Law 2.7 reminder: only the LOCKED catalog SKUs render. The slug
 * gate + product/bundle lookup ensures the carve-out compounds named in
 * Iron Law 2.7 can never appear here — getProductBySlug returns
 * undefined for any slug not in lib/content/products.ts.
 */
import { ImageResponse } from "next/og";
import { getBundleBySlug, getProductBySlug } from "@/lib/content/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "vialchemlabs.net research peptide";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const bundle = getBundleBySlug(slug);
  const compound = product?.shortName ?? bundle?.name ?? "vialchemlabs.net";
  const dose = product?.dose ?? bundle?.constituents.join(" + ") ?? "";
  const sku = product?.sku ?? bundle?.sku ?? "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0e0f",
        display: "flex",
        color: "rgba(255,255,255,0.92)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* LEFT: vial illustration block */}
      <div
        style={{
          width: "460px",
          height: "100%",
          background: "linear-gradient(180deg, #141a1c 0%, #0a0e0f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid #1f2a2e",
        }}
      >
        {/* Simplified vial silhouette: cap + body + label band */}
        <div
          style={{
            width: "180px",
            height: "420px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "110px",
              height: "32px",
              background: "linear-gradient(180deg, #5a6065 0%, #3a4045 100%)",
              borderRadius: "6px 6px 2px 2px",
            }}
          />
          <div
            style={{
              width: "160px",
              height: "380px",
              marginTop: "6px",
              background:
                "linear-gradient(180deg, rgba(61,212,200,0.06) 0%, rgba(61,212,200,0.02) 100%)",
              border: "1px solid rgba(61,212,200,0.2)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              position: "relative",
            }}
          >
            {/* label band */}
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "-10px",
                right: "-10px",
                height: "180px",
                background: "#0a0e0f",
                border: "1px solid #2a3a40",
                borderRadius: "4px",
                padding: "14px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "ui-monospace, Menlo, monospace",
                color: "rgba(255,255,255,0.92)",
                transform: "translateY(-50%)",
              }}
            >
              <div style={{ color: "#3dd4c8" }}>VIALCHEMLABS</div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                {compound}
              </div>
              {dose ? <div style={{ color: "#5eebdf" }}>{dose}</div> : null}
              <div
                style={{
                  fontSize: "8px",
                  color: "rgba(255,255,255,0.42)",
                  marginTop: "4px",
                }}
              >
                Research use only · Not for human use
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: text block */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "18px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#3dd4c8",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#3dd4c8",
            }}
          />
          VIALCHEMLABS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 300,
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
              maxWidth: "600px",
            }}
          >
            {compound}
          </div>
          {dose ? (
            <div
              style={{
                fontSize: "32px",
                fontWeight: 300,
                fontStyle: "italic",
                color: "#5eebdf",
              }}
            >
              {dose}
            </div>
          ) : null}
          {sku ? (
            <div
              style={{
                fontSize: "16px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.62)",
                fontFamily: "ui-monospace, Menlo, monospace",
              }}
            >
              {sku}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.62)",
            fontFamily: "ui-monospace, Menlo, monospace",
          }}
        >
          <span>Counted, weighed, verified</span>
          <span>Independent third-party COA</span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
