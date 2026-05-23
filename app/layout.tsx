import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/lib/content/site";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";
import "./v2-brand.css";
import "./v2-layout.css";

// Mobile-first viewport per Section 4.5 of SUPER_PROMPT_softlaunch_2026-05-22.
// Without `width=device-width`, mobile browsers assume a ~980px layout
// viewport and zoom out, defeating every @media (max-width) rule on the
// site. `initialScale: 1` keeps the first render at native size.
// Do NOT add `maximumScale` or `userScalable: false` — both are WCAG
// accessibility violations.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
      data-accent="cyan-navy"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="vc-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('vc.theme')||'dark';var a=localStorage.getItem('vc.accent')||'cyan-navy';document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'dark';document.documentElement.dataset.accent=a;}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.accent='cyan-navy';}})();`}
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
