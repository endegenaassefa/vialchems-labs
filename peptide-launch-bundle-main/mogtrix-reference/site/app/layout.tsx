import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { ComplianceFooter } from "@/components/compliance-footer";
import { siteConfig } from "@/lib/content/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mogtrix | Research Materials",
    template: "%s | Mogtrix"
  },
  description: siteConfig.description,
  applicationName: "Mogtrix",
  authors: [{ name: "Mogtrix" }],
  generator: "Next.js",
  keywords: ["research materials", "RUO", "qualified research", "Mogtrix", "request portal"],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: "Mogtrix",
    title: "Mogtrix | Research Materials",
    description: siteConfig.description,
    url: siteUrl,
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mogtrix | Research Materials",
    description: siteConfig.description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
};

export const viewport: Viewport = {
  themeColor: "#020202",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        Static <head> over next/font: keeps parity with the design-system
        reference preview that uses the same Bunny Fonts CDN URL. See DESIGN.md §4.
      */}
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.bunny.net/css?family=ibm-plex-sans:300,400,500,600,700|ibm-plex-mono:300,400,500,600|newsreader:400,400i,500,500i&display=swap"
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <ComplianceFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
