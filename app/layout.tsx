import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/lib/content/site";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

// Storefront typography: Space Grotesk gives the large type a more physical
// product-brand feel than Geist's AI/SaaS default; Inter Tight keeps body copy
// compact without fighting the display face.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${spaceGrotesk.variable} ${interTight.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* No-FOUC theme script: applies stored theme before React mounts so
          the page never flashes the wrong palette during hydration. Dark is
          the default because product pages lead with black studio imagery. */}
      <head>
        <Script id="vc-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('vc-theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'dark'}catch(e){document.documentElement.dataset.theme='dark'}})();`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
