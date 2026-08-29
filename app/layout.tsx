import type {Metadata} from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css'; // Global styles

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

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
    <html lang="en" className={montserrat.variable}>
      <body suppressHydrationWarning className="font-sans antialiased">{children}</body>
    </html>
  );
}
