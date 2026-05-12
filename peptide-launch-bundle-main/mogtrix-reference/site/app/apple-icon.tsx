import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 70% 20%, rgba(124,255,0,0.32), transparent 50%), #020202",
          color: "#7cff00",
          fontSize: "120px",
          fontWeight: 900,
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
          borderRadius: "36px"
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
