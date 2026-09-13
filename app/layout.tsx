import type { Metadata, Viewport } from 'next';
import { Montserrat, Newsreader, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

// The variable axis, not a pair of static cuts.
//
// Loading the variable fonts via next/font self-hosts and subsets them,
// ensuring crisp, consistent type rendering on iOS, Android, and Desktop.
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  adjustFontFallback: true,
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

// Preloaded: Montserrat only.
//
// Four faces used to be preloaded on every route — 199 kB on the critical path before anything
// could paint, of which the single largest file was the italic cut of the serif at 64.5 kB.
// Body text is Montserrat, so that is the face first paint actually waits on. The serif carries
// headings and the mono is reserved for field instrumentation; both still load, still with
// display: swap and an adjusted fallback so the substitution does not shift layout — they are
// simply no longer allowed to compete with body text for the first bytes on a 1.6 Mbit/s link.
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  preload: false,
  adjustFontFallback: true,
  fallback: ['Georgia', 'Charter', 'serif'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
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
    <html lang="en" className={`dark ${montserrat.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}

