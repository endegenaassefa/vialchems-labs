/**
 * Phase 9 (v4) — default OpenGraph image, served at /opengraph-image.
 *
 * Posture A: charcoal bg + teal accent rule + IBM Plex-style wordmark
 * fallback (system font; next/og rasterizes a static SVG-equivalent).
 * No external font fetches — keeps image generation fast and
 * deterministic so build time stays predictable.
 */
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/content/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0e0f",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        color: "rgba(255,255,255,0.92)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          fontSize: "20px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#3dd4c8",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            background: "#3dd4c8",
          }}
        />
        {siteConfig.name}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            fontSize: "88px",
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: "-0.01em",
            maxWidth: "900px",
          }}
        >
          Counted, weighed,
        </div>
        <div
          style={{
            fontSize: "88px",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1.04,
            letterSpacing: "-0.01em",
            color: "#5eebdf",
          }}
        >
          verified.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "18px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.62)",
          fontFamily: "ui-monospace, Menlo, monospace",
        }}
      >
        <span>Independent third-party COA</span>
        <span>Research use only</span>
      </div>
    </div>,
    { ...size },
  );
}
