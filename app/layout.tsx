import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css'; // Global styles

// The variable axis, not a pair of static cuts.
//
// This previously loaded weight 400 and 600 only, while the UI asks for 500, 700, 800 and 900 in
// 547 places — every one of which the browser was faking by smearing the 400 or 600 outline.
// Synthesised bold is the single biggest reason type looks soft on a high-DPI screen, and it is
// worst exactly where this site uses it most: small uppercase labels and tabular figures.
//
// Loading the variable font fixes all of them from one file. Because next/font self-hosts and
// subsets it, the whole 100-900 range costs less over the wire than the two static cuts did.
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  // Keep metrics stable while the webfont loads, so nothing reflows on a slow connection.
  adjustFontFallback: true,
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f7fc' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  title: 'Kitui 2027 — Campaign Strategy & Digital Architecture',
  description: 'Campaign Strategy & Digital Architecture Proposal — Hon. Dr. Benson Makali Mulu, Kitui County. Prepared by Firefly Management, August 2026.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Kitui 2027 — Campaign Strategy & Digital Architecture',
    description: 'Campaign Strategy & Digital Architecture Proposal — Hon. Dr. Benson Makali Mulu, Kitui County. Prepared by Firefly Management, August 2026.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kitui 2027 — Campaign Strategy & Digital Architecture',
    description: 'Campaign Strategy & Digital Architecture Proposal — Hon. Dr. Benson Makali Mulu, Kitui County. Prepared by Firefly Management, August 2026.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`dark ${montserrat.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}

