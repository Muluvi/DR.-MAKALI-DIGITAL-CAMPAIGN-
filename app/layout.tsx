import type { Metadata, Viewport } from 'next';
import { Montserrat, JetBrains_Mono } from 'next/font/google';
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

// One text family, and the instrumentation register.
//
// The brief asks for one variable family. Montserrat is it: body, headings, and everything the
// .font-serif utility used to set in Newsreader, which is no longer loaded at all. That removes
// two faces — the serif's roman and its italic, the largest single file the document fetched.
//
// JetBrains Mono stays, and is the one deliberate exception. The monospace register is reserved
// for live field instrumentation — the TAC-40 terminal, the USSD handset, feed timestamps — and
// the brief names it as a voice rather than as chrome. Setting a terminal in the body face
// would regress those components, which is the one thing the brief forbids outright. It is not
// preloaded, so it costs nothing before first paint and arrives when instrumentation renders.
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
    <html lang="en" className={`dark ${montserrat.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}

