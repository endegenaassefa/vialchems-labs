"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#020202",
          color: "rgba(255,255,255,0.82)",
          fontFamily: "Avenir Next, Inter, ui-sans-serif, system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          padding: "32px"
        }}
      >
        <section
          style={{
            maxWidth: "560px",
            width: "100%",
            background: "#111111",
            border: "1px solid #1f1f1f",
            borderRadius: "22px",
            padding: "32px",
            textAlign: "center"
          }}
        >
          <p style={{ color: "#7cff00", fontSize: "12px", textTransform: "uppercase", fontWeight: 600, marginBottom: "12px" }}>
            Critical fault
          </p>
          <h1 style={{ color: "white", fontSize: "32px", margin: "0 0 16px", fontWeight: 900 }}>
            The application failed to load.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: "14px", lineHeight: 1.6 }}>
            The error has been logged. Reloading should restore the catalog.
          </p>
          {error.digest ? (
            <p style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(255,255,255,0.58)", marginTop: "12px" }}>
              ref: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "28px",
              minHeight: "44px",
              padding: "12px 20px",
              borderRadius: "16px",
              background: "#7cff00",
              color: "black",
              fontWeight: 600,
              fontSize: "14px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Reload
          </button>
        </section>
      </body>
    </html>
  );
}
