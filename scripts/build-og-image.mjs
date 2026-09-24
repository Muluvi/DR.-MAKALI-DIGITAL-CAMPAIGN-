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
 * WHY THESE FONTS (2026). The card embeds Bricolage Grotesque and Newsreader for this one render
 * (OG_FONT_DISPLAY, OG_FONT_SERIF; see face() below) and falls back to the declared fallbacks
 * without them. The note below is the earlier arrangement. The real faces were Montserrat and Newsreader, self-hosted by next/font under
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
      try { return req(path.join(dir, "playwright")); } catch { /* try the next one */ }
      try { return req(path.join(dir, "playwright-core")); } catch { /* next */ }
    }
    console.error("build-og-image: playwright is not installed. See the note at the top of this file.");
    process.exit(1);
  }
}

/** The kiondo weave as a CSS background (the same generator as components/premium/weave.tsx). */
function weave(color, tile = 14) {
  const c = tile / Math.SQRT2, h = c / 2, t = c * 0.36, f = (n) => n.toFixed(3);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${tile}' height='${tile}'><defs><pattern id='w' patternUnits='userSpaceOnUse' width='${f(c)}' height='${f(c)}' patternTransform='rotate(45)'>` +
    `<g fill='${color}'><rect x='${f(h / 2 - t / 2)}' y='0.3' width='${f(t)}' height='${f(h - 0.6)}' rx='${f(t / 2)}'/><rect x='${f(h + h / 2 - t / 2)}' y='${f(h + 0.3)}' width='${f(t)}' height='${f(h - 0.6)}' rx='${f(t / 2)}'/>` +
    `<rect x='${f(h + 0.3)}' y='${f(h / 2 - t / 2)}' width='${f(h - 0.6)}' height='${f(t)}' rx='${f(t / 2)}' fill-opacity='0.6'/><rect x='0.3' y='${f(h + h / 2 - t / 2)}' width='${f(h - 0.6)}' height='${f(t)}' rx='${f(t / 2)}' fill-opacity='0.6'/></g>` +
    `</pattern></defs><rect width='${tile}' height='${tile}' fill='url(%23w)'/></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/</g, "%3C").replace(/>/g, "%3E")}")`;
}
const WEAVE = weave("rgb(236,224,196)");

/**
 * The site's real faces, embedded for this one render (the PNG is committed; nothing is fetched at
 * request time). Point OG_FONT_DISPLAY and OG_FONT_SERIF at the Bricolage Grotesque and Newsreader
 * variable woff2 files (Google Fonts, latin subset); without them the card uses the fallbacks.
 */
function face(family, file) {
  if (!file || !fs.existsSync(file)) return "";
  const b64 = fs.readFileSync(file).toString("base64");
  return `@font-face { font-family: "${family}"; src: url(data:font/woff2;base64,${b64}) format("woff2"); font-weight: 200 800; font-stretch: 75% 100%; }`;
}
const FONTS = face("Bricolage Grotesque", process.env.OG_FONT_DISPLAY) + face("Newsreader", process.env.OG_FONT_SERIF);

const CARD = `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  ${FONTS}
  /* The 2026 dark-theme tokens, copied from app/globals.css and app/premium.css. */
  :root {
    --paper: oklch(0.16 0.03 262);
    --card: oklch(0.205 0.032 262);
    --ink: oklch(0.965 0.008 250);
    --muted: oklch(0.78 0.025 255);
    --line: oklch(0.31 0.03 262);
    --accent: oklch(0.74 0.14 262);   /* Wiper royal blue, as text */
    --gold: oklch(0.74 0.13 45);      /* laterite, as text */
    --gold-solid: oklch(0.53 0.15 40);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: var(--paper); color: var(--ink);
    font-family: "Bricolage Grotesque", "Liberation Sans", "DejaVu Sans", sans-serif;
    display: flex; position: relative; overflow: hidden;
  }
  /* The kiondo weave: the site's one texture, as the card's left band. */
  .weave { width: 132px; flex: none; background-color: var(--gold-solid);
           background-image: ${WEAVE}; background-size: 18px 18px; }
  .glow { position: absolute; inset: 0; background: radial-gradient(55% 60% at 88% 70%, oklch(0.5 0.2 265 / 0.28), transparent 70%); }
  .body { position: relative; flex: 1; padding: 60px 72px 54px 64px; display: flex; flex-direction: column; }
  .mark { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; }
  .who { font-size: 26px; font-weight: 750; color: var(--accent); letter-spacing: -0.01em; }
  .where { font-size: 19px; font-weight: 500; color: var(--muted); margin-top: 3px; }
  h1 { font-size: 104px; font-weight: 800; font-stretch: 88%; line-height: 0.96; letter-spacing: -0.035em; color: var(--accent); }
  h1 .sub { display: block; margin-top: 14px; font-family: Newsreader, Charter, "DejaVu Serif", Georgia, serif;
            font-size: 44px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); line-height: 1.1; }
  .foot { margin-top: auto; padding-top: 26px; border-top: 1px solid var(--line);
          display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }
  .prepared { font-size: 23px; font-weight: 600; color: var(--ink); line-height: 1.4; }
  .prepared span { display: block; font-size: 19px; font-weight: 500; color: var(--muted); margin-top: 4px; }
  .conf { display: flex; align-items: center; gap: 10px; white-space: nowrap; padding: 10px 18px 10px 12px;
          border-radius: 999px; border: 1px solid var(--line); background: var(--card);
          font-size: 20px; font-weight: 700; color: var(--ink); }
  .seal { width: 22px; height: 22px; border-radius: 50%; background-color: var(--gold-solid);
          background-image: ${WEAVE}; background-size: 8px 8px; box-shadow: inset 0 0 0 2px var(--gold); }
</style></head><body>
  <div class="weave"></div>
  <div class="glow"></div>
  <div class="body">
    <div class="mark">
      <!-- The Wiper umbrella, the same path the site header draws. -->
      <svg width="56" height="56" viewBox="0 0 120 120" fill="none">
        <path d="M60 20 C30 20 16 42 12 58 C24 53 42 53 60 58 Z" fill="#00209f"/>
        <path d="M60 20 C90 20 104 42 108 58 C96 53 78 53 60 58 Z" fill="#e31d2b"/>
        <path d="M60 20 V58" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <path d="M57 11 H63 L60 20 Z" fill="#e31d2b"/>
        <path d="M60 58 V92 C60 99 51 99 51 92" stroke="#6f8cff" stroke-width="6" stroke-linecap="round" fill="none"/>
      </svg>
      <div>
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
      <div class="conf"><span class="seal"></span>Confidential</div>
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
