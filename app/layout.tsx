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

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  fallback: ['Georgia', 'Charter', 'serif'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
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

const TITLE = 'Kitui 2027 — Analysis, Strategy and Direction';
const DESCRIPTION =
  'Analysis, strategy and direction for the existing digital operation of Hon. Dr. Benson Makali Mulu, Kitui County. Prepared by Firefly Management, September 2026. Confidential.';

/**
 * The share card, and why there is one.
 *
 * `twitter:card` was already `summary_large_image` with no `og:image` behind it. A large-image
 * card with no image is the one preview shape that renders as broken rather than plain — and this
 * is a link-only document whose reader will almost certainly meet it as a WhatsApp message.
 *
 * It is typographic, not a photograph (DECISIONS.md D-8): a confidential proposal that paints the
 * candidate's face into every chat thread it is forwarded through has a different confidentiality
 * posture from the one §1.2 sets out, and that is Firefly's call to make, not a default to assume.
 *
 * Built by scripts/build-og-image.mjs and committed, so no image is generated at request time and
 * no third party is contacted to serve it. `noindex, nofollow` is untouched: a preview card is
 * shown to whoever was sent the link, which is not the same thing as being indexed.
 */
const OG_IMAGE = {
  url: '/og/kitui-2027.png',
  width: 1200,
  height: 630,
  alt: 'Kitui 2027 — Analysis, strategy and direction. Prepared for Hon. Dr. Benson Makali Mulu. Firefly Management, September 2026. Confidential.',
};

/**
 * The origin relative metadata URLs resolve against.
 *
 * WhatsApp, Slack and Twitter fetch `og:image` as an absolute URL and ignore a relative one, so
 * without this the card would be declared and never fetched.
 *
 * THE ORDER MATTERS, and it was wrong. `VERCEL_URL` is the DEPLOYMENT hostname
 * (`…-a1b2c3.vercel.app`), not the production domain — so on a custom domain every share card
 * pointed at a per-deployment URL that is not the one the reader has, and that changes on every
 * push. `NEXT_PUBLIC_SITE_ORIGIN` is read first for that reason: set it to the canonical domain
 * in the Vercel project and the card is stable and correct. `VERCEL_URL` stays as the fallback so
 * a preview deployment still previews its own card, and the production hostname behind that so a
 * local build has something absolute to resolve against.
 *
 * Whatever you set, send the link to yourself on WhatsApp once and look at the card. It is a
 * thirty-second test that catches a class of bug nothing else does.
 */
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://dr-makali-digital-campaign.vercel.app');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`dark ${montserrat.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}

