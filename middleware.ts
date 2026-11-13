import { NextResponse, type NextRequest } from "next/server";

/**
 * An optional passcode gate for a document that says "Confidential — personal, link-only".
 *
 * THE PROBLEM IT ANSWERS. `noindex, nofollow` keeps this site out of search results and does
 * nothing whatever about a forwarded link. The proposal's own §3.6.2 builds the strategy on
 * WhatsApp forwarding being effortless, which is exactly what makes a link-only confidential
 * document a weak promise.
 *
 * IT IS OFF UNLESS `SITE_PASSCODE` IS SET, and that is deliberate. A gate that switched itself on
 * at deploy would lock the campaign out of their own document at the worst moment. With the
 * variable unset this middleware passes every request through untouched, which is the behaviour
 * the site has always had.
 *
 * TO TURN IT ON: set `SITE_PASSCODE` in the Vercel project (Production, and Preview if you want
 * previews covered too). Readers then open `https://…/?k=<passcode>` once; the cookie carries them
 * for thirty days and the link they forward keeps working the same way, which is the point — this
 * raises the cost of an accidental forward, it is not authentication. For real access control use
 * Vercel's own Password Protection, which sits in front of the deployment rather than inside it.
 *
 * WHAT IS DELIBERATELY NOT GATED: the Open Graph image. WhatsApp and Slack fetch it unauthenticated
 * to draw the preview card, and a gated `og:image` is a broken card on every share — which is a
 * worse leak, because a broken card invites the sender to paste the contents instead.
 */
const COOKIE = "kitui-pass";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function middleware(request: NextRequest) {
  const passcode = process.env.SITE_PASSCODE;
  if (!passcode) return NextResponse.next();

  const { searchParams, pathname } = request.nextUrl;

  // The preview card, and anything a link unfurler needs before a human has seen the page.
  if (pathname.startsWith("/og") || pathname === "/favicon.ico") return NextResponse.next();

  if (request.cookies.get(COOKIE)?.value === passcode) return NextResponse.next();

  if (searchParams.get("k") === passcode) {
    // Redirect so the passcode leaves the address bar, and so a screenshot of the page does not
    // carry it.
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("k");
    const response = NextResponse.redirect(clean);
    response.cookies.set(COOKIE, passcode, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });
    return response;
  }

  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
     <meta name="viewport" content="width=device-width,initial-scale=1">
     <meta name="robots" content="noindex, nofollow">
     <title>Confidential</title>
     <style>
       :root { color-scheme: dark }
       body { margin:0; min-height:100dvh; display:grid; place-items:center;
              background:#0b1a30; color:#e8eef6;
              font:400 16px/1.6 ui-sans-serif, system-ui, sans-serif; padding:24px }
       main { max-width:32rem; text-align:center }
       h1 { font-size:1.125rem; margin:0 0 .5rem }
       p { margin:0; color:#9fb1c6; font-size:.875rem }
     </style></head><body><main>
       <h1>This document is confidential</h1>
       <p>It opens with the link you were sent, passcode included. If your link has stopped
          working, ask the person who sent it for a new one.</p>
     </main></body></html>`,
    { status: 401, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export const config = {
  // Everything except Next's own assets and the static files a preview card needs.
  matcher: ["/((?!_next/static|_next/image|content/|.*\\.(?:png|jpg|jpeg|svg|ico|webp|txt)$).*)"],
};
