#!/usr/bin/env node
/**
 * The consolidation pass's reader-facing check, in a real browser against a running copy of the
 * site (a local `next start`, a Vercel preview, or production).
 *
 * For "/" and "/full" at 390px and 1280px wide, and every chapter route at 390px, it scrolls the
 * whole page so every lazy section mounts, then checks:
 *   - console errors: none, except the React #418 hydration warning on /full and /needs, which
 *     pre-dates this pass (measured on a build of 2f29920; /full renders the needs section)
 *   - visible text: no section number, "X of 36", Roman numeral, T1/T2/T3, "§", "Phase −1…3" (IPC
 *     phases excepted) or "Annex A–H"
 *   - visible text: none of the retired contradictions (RETIRED below)
 * and saves a full-page screenshot of each run into the directory given as the second argument.
 *
 *     node scripts/consolidation/live-check.mjs http://localhost:3100 /path/to/screenshots
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// Playwright is installed globally in the build container, not as a project dependency.
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const SHOTS = process.argv[3] ?? null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

/** Wording the consolidation pass retired, and why. None of it may reach a reader again. */
const RETIRED = [
  [/\b460,000\b/, "the hardcoded offline reach (registry: reach.offline)"],
  [/\b320,000\b/, "an SMS reach above the SMS-only ceiling"],
  [/\b420,000\b|\b350,000\b|\b280,000\b/, "an unsourced offline-channel reach"],
  [/four pillars/i, "the message has three pillars"],
  [/Four phases run/i, "there are five phases"],
  [/climbs three levels/i, "the attack ladder is the four severity tiers"],
  [/These five indicators replace/i, "the five are named as the recognition indicators"],
  [/~?77,000 voters|80,000–105,000|25,000–35,000 registered/, "an unsourced segment size"],
  [/Ksh 100M/i, "the withdrawn per-ward guarantee (C6)"],
  [/Sang['’]u/, "a station in no ownership source (C7)"],
  [/Level 3, 30-minute|30-minute Level 3/, "the retired attack levels"],
];

const NUMBERING = [
  [/§/, "§"],
  [/\b\d+ of 36\b/, "X of 36"],
  [/\b(?:Part|Section|Chapter) (?:I|II|III|IV|V|VI|VII)\b/, "Roman numeral"],
  [/\bT[123]\b/, "tier code"],
  [/(?<!IPC )\bPhase (?:−1|-1|0|1|2|3)\b(?!\s*[,—–:(-]?\s*\(?(?:Stressed|Crisis|Emergency|Famine|Minimal))/, "numbered phase"],
  [/\bAnnex [A-H]\b/, "Annex letter"],
];

const src = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "..", "..", "lib", "content-files.ts"), "utf8");
const TABS = [...src.matchAll(/^\s*"?([a-z-]+)"?:\s*"[a-z-]+\.md"/gm)].map((m) => m[1]);
const RUNS = [["/", [390, 1280]], ["/full", [390, 1280]], ...TABS.filter((t) => t !== "cover").map((t) => [`/${t}`, [390]])];

const failures = [];
const browser = await chromium.launch();
for (const [route, widths] of RUNS) {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("pageerror", (e) => errs.push(String(e)));
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 120_000 });
    // Scroll in steps so every LazyMount section mounts.
    let last = -1;
    for (let i = 0; i < 400; i++) {
      const h = await page.evaluate(() => { window.scrollBy(0, window.innerHeight * 0.9); return document.documentElement.scrollHeight; });
      await page.waitForTimeout(60);
      const y = await page.evaluate(() => window.scrollY + window.innerHeight);
      if (y >= h - 2) { if (h === last) break; last = h; await page.waitForTimeout(400); }
    }
    await page.waitForTimeout(800);
    const text = await page.evaluate(() => document.body.innerText);
    const label = `${route} @${width}`;
    const real = errs.filter((e) => !((route === "/full" || route === "/needs") && /Minified React error #418/.test(e)));
    if (real.length) failures.push(`${label}: ${real.length} console error(s): ${real.slice(0, 3).join(" | ").slice(0, 400)}`);
    for (const [re, why] of RETIRED) { const m = re.exec(text); if (m) failures.push(`${label}: retired wording "${m[0]}" is visible (${why}): …${text.slice(Math.max(0, m.index - 80), m.index + 60).replace(/\s+/g, " ")}…`); }
    for (const [re, why] of NUMBERING) { const m = re.exec(text); if (m) failures.push(`${label}: ${why} visible: …${text.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\s+/g, " ")}…`); }
    console.log(`${label}: ${text.length.toLocaleString("en-GB")} characters, ${errs.length} console error(s)`);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${route === "/" ? "home" : route.slice(1)}-${width}.png`), fullPage: false });
    await ctx.close();
  }
}
await browser.close();
if (failures.length) {
  console.log(`\nlive-check: ${failures.length} problem(s)`);
  for (const f of failures) console.log("  - " + f);
  process.exit(1);
}
console.log("\nlive-check: pass");
