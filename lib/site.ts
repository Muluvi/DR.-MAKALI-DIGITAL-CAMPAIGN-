/**
 * Where the site lives, in one place.
 *
 * SITE_ORIGIN is what share cards resolve against (app/layout.tsx explains the order): the
 * configured canonical domain, then this deployment, then the production hostname.
 *
 * CANONICAL_ORIGIN is for anything printed or shared to live beyond this deployment: a QR code on
 * a boarding pass or a poster, the link on a share image. It never uses VERCEL_URL, because a
 * per-deployment hostname changes on every push and a printed code must keep working.
 */
export const PRODUCTION_ORIGIN = "https://dr-makali-digital-campaign.vercel.app";

export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : PRODUCTION_ORIGIN);

export const CANONICAL_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? PRODUCTION_ORIGIN;

/** The site's address as a person reads it on a printed card: no scheme, no trailing slash. */
export const SITE_HOST = CANONICAL_ORIGIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
