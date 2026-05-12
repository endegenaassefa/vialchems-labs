import { ImageResponse } from "next/og";

export const alt = "Mogtrix - Research-use-only catalog request portal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#020202",
          backgroundImage:
            "radial-gradient(circle at 78% 18%, rgba(124,255,0,0.18), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.06), transparent 32%)",
          color: "white",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "999px",
              background: "#7cff00",
              boxShadow: "0 0 24px rgba(124,255,0,0.6)"
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#7cff00"
            }}
          >
            Mogtrix
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <span
            style={{
              fontSize: "104px",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "white"
            }}
          >
            Wake the Edge.
          </span>
          <span
            style={{
              fontSize: "32px",
              lineHeight: 1.3,
              color: "rgba(255,255,255,0.66)",
              maxWidth: "880px"
            }}
          >
            Research-use-only catalog request portal. Every request is reviewed before any next step.
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "20px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          <span>Manual review</span>
          <span>Server-owned consent</span>
          <span>Audit trail</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
