#!/usr/bin/env node
/**
 * The WhatsApp preview card: public/og/kitui-2027.png, 1200x630.
 *
 * WHY IT EXISTS. `twitter:card` was set to `summary_large_image` with no `og:image` behind it, so
 * every share of this link — and this proposal is a link-only document that will be opened from a
 * WhatsApp message — rendered as bare text. A large-image card with no image is the one preview
 * shape that looks broken rather than plain.
 *
 * WHY IT IS TYPOGRAPHIC AND NOT A PHOTOGRAPH (D-8). A confidential proposal that renders the
 * candidate's face into every chat thread it is forwarded through has a different confidentiality
 * posture than the one §1.2 sets out. That is Firefly's decision, not this script's, so the
 * default is type only. The portrait can be added on approval.
 *
 * WHY THESE FONTS. The real faces are Montserrat and Newsreader, self-hosted by next/font under
 * hashed filenames that change on every build — resolving them here would couple this script to
 * Next's internals. It uses the site's OWN declared fallbacks instead (app/layout.tsx names
 * Charter for Newsreader and a grotesque stack for Montserrat), both installed in the build image.
 * The card is therefore drawn in the same typefaces a reader sees if the webfonts fail, which is
 * the right place for it to sit.
 *
 * Colours are the light-theme brand tokens from app/globals.css, written as the same oklch()
 * values rather than re-specified as hex, so this card cannot drift from the site's palette.
 *
 *     node scripts/build-og-image.mjs
 *
 * Playwright is not a dependency of this project — see scripts/measure-section-heights.mjs for the
 * NODE_PATH arrangement. The PNG is committed, so this only needs running when the card changes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "og", "kitui-2027.png");

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const { createRequire } = await import("node:module");
    const req = createRequire(import.meta.url);
    for (const dir of (process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean)) {
      try { return req(path.join(dir, "playwright")); } catch { /* next */ }
    }
    console.error("build-og-image: playwright is not installed. See the note at the top of this file.");
    process.exit(1);
  }
}

const CARD = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  /* The light-theme brand tokens, copied from app/globals.css. */
  :root {
    --ink: oklch(0.21 0.045 250);
    --muted: oklch(0.44 0.038 245);
    --paper: oklch(0.97 0.012 250);
    --line: oklch(0.89 0.02 245);
    --accent: oklch(0.35 0.22 265);   /* Wiper royal blue */
    --gold: oklch(0.46 0.16 48);      /* Wiper earth red */
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: var(--paper); color: var(--ink);
    font-family: "Liberation Sans", "DejaVu Sans", sans-serif;
    display: flex; flex-direction: column; position: relative; overflow: hidden;
  }
  /* The party's two colours as the card's top edge — the same pair the site's progress bar uses. */
  .rule { height: 10px; background: linear-gradient(90deg, var(--accent), var(--gold)); }
  .body { flex: 1; padding: 62px 72px 56px; display: flex; flex-direction: column; }
  .mark { display: flex; align-items: center; gap: 16px; margin-bottom: 44px; }
  .mark-text { line-height: 1.25; }
  .who { font-size: 27px; font-weight: 700; color: var(--accent); letter-spacing: -0.01em; }
  .where { font-size: 19px; font-weight: 600; color: var(--muted); margin-top: 3px; }
  h1 {
    font-family: Charter, "Bitstream Charter", "DejaVu Serif", Georgia, serif;
    font-size: 76px; font-weight: 700; line-height: 1.07; letter-spacing: -0.022em;
    max-width: 22ch;
  }
  h1 .sub { display: block; color: var(--accent); }
  .foot { margin-top: auto; padding-top: 30px; border-top: 2px solid var(--line);
          display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }
  .prepared { font-size: 25px; font-weight: 600; color: var(--ink); line-height: 1.4; }
  .prepared span { display: block; font-size: 20px; font-weight: 600; color: var(--muted); margin-top: 5px; }
  .conf { display: flex; align-items: center; gap: 11px; white-space: nowrap;
          font-size: 19px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--gold); }
  .dot { width: 11px; height: 11px; border-radius: 50%; background: var(--gold); }
</style></head><body>
  <div class="rule"></div>
  <div class="body">
    <div class="mark">
      <!-- The Wiper umbrella, the same path the site header draws. -->
      <svg width="58" height="58" viewBox="0 0 120 120" fill="none">
        <path d="M60 20 C30 20 16 42 12 58 C24 53 42 53 60 58 Z" fill="#00209f"/>
        <path d="M60 20 C90 20 104 42 108 58 C96 53 78 53 60 58 Z" fill="#e31d2b"/>
        <path d="M60 20 V58" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <path d="M57 11 H63 L60 20 Z" fill="#e31d2b"/>
        <path d="M60 58 V92 C60 99 51 99 51 92" stroke="#00209f" stroke-width="6" stroke-linecap="round" fill="none"/>
      </svg>
      <div class="mark-text">
        <div class="who">Hon. Dr. Benson Makali Mulu</div>
        <div class="where">Kitui County &mdash; 2027</div>
      </div>
    </div>

    <h1>Kitui 2027<span class="sub">Analysis, strategy and direction</span></h1>

    <div class="foot">
      <div class="prepared">
        Prepared for Hon. Dr. Benson Makali Mulu
        <span>Firefly Management &middot; September 2026</span>
      </div>
      <div class="conf"><span class="dot"></span>Confidential</div>
    </div>
  </div>
</body></html>`;

const { chromium } = await loadPlaywright();
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(CARD, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
await page.screenshot({ path: OUT });
await browser.close();

const { size } = fs.statSync(OUT);
console.log(`build-og-image: wrote public/og/kitui-2027.png (1200x630, ${(size / 1024).toFixed(1)} kB)`);
