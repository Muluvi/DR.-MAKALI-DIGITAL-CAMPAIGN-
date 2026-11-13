import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1322" },
  ],
};

const TITLE = "Dr. Makali Digital Campaign Platform | Kitui 2027";
const DESCRIPTION =
  "Explore the Dr. Makali Digital Campaign Platform: an integrated digital workspace for research, public information, data analysis, dashboards, strategic documentation and implementation planning for Kitui 2027.";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://dr-makali-digital-campaign.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", images: [{ url: "/og/kitui-2027.png", width: 1200, height: 630, alt: "Dr. Makali Digital Campaign Platform — Kitui 2027" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og/kitui-2027.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        {/* Chart styles are needed only once a chapter loads below the first screen, so they are
            requested after the page has loaded and never compete with the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: `addEventListener("load",function(){var l=document.createElement("link");l.rel="stylesheet";l.href="/charts.css";document.head.appendChild(l)})` }} />
        {/* eslint-disable-next-line @next/next/no-css-tags -- the same sheet for readers without JavaScript */}
        <noscript><link rel="stylesheet" href="/charts.css" /></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
