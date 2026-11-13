#!/usr/bin/env node
/**
 * Live checks 14 to 17 of the restructure brief, in a real browser against a running copy of the site.
 *
 *  14. "/" loads; the sections stream in the new order; the index lists the parts in preview
 *      section 5's order, with Part 1 "The decision" first.
 *  15. Every route opens (200, and its own heading ids present). 30 old deep links (15 drawn from
 *      lib/anchors/pre-rebuild.json, 15 from the ids live before the restructure) and 10 new ids,
 *      each opened as "/#id", land with their heading in view. Two legacy route links (a retired
 *      route, and a fragment that moved to another route) land too.
 *  16. Search in the index finds a figure by its finding, not only by a heading.
 *  17. At 380px the dock's current-section label for the four workstream routes never truncates to
 *      the same visible prefix.
 *
 *     node scripts/restructure-2026-10/live-checks.mjs http://localhost:3210
 *
 * Uses the Playwright the container ships (require('playwright') resolves from any directory).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const BASE = (process.argv[2] ?? "http://localhost:3210").replace(/\/$/, "");
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  for (const dir of (process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean)) {
    try { ({ chromium } = require(path.join(dir, "playwright"))); break; } catch { /* next */ }
  }
}
if (!chromium) {
  console.error("live-checks: playwright not found; set NODE_PATH to the global node_modules");
  process.exit(1);
}

const errors = [];
const say = (s) => console.log(s);

// The site's own tables, read from source so the checks cannot drift from the build.
const redirectsSrc = fs.readFileSync(path.join(ROOT, "lib", "anchors", "redirects.ts"), "utf8");
const REDIRECTS = JSON.parse(redirectsSrc.slice(redirectsSrc.indexOf("{"), redirectsSrc.lastIndexOf("}") + 1));
const pre = JSON.parse(fs.readFileSync(path.join(ROOT, "lib", "anchors", "pre-rebuild.json"), "utf8"));
const moves = JSON.parse(fs.readFileSync(path.join(ROOT, "lib", "anchors", "restructure-2026-10.json"), "utf8"));
const flowSrc = fs.readFileSync(path.join(ROOT, "lib", "flow.ts"), "utf8");
const FLOW_ORDER = [...flowSrc.slice(flowSrc.indexOf("FLOW_ORDER"), flowSrc.indexOf("];", flowSrc.indexOf("FLOW_ORDER"))).matchAll(/^\s*"([a-z-]+)",/gm)].map((m) => m[1]);

// A seeded draw, so a rerun checks the same links.
let seed = 20261028;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const draw = (list, n) => [...list].sort((a, b) => (a < b ? -1 : 1)).map((v) => [rand(), v]).sort((a, b) => a[0] - b[0]).slice(0, n).map((p) => p[1]);

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}
);
const context = await browser.newContext({ viewport: { width: 380, height: 844 } });
const page = await context.newPage();

/**
 * Open a URL and wait until the heading `id` is on screen near the top (within the dock's height of
 * it either way), or give up.
 */
async function landsOn(url, id) {
  // A fresh page per link, as a shared link arrives: on a page already showing "/", a hash-only
  // goto is a same-document navigation, which tests the in-page handler instead of arrival.
  const tab = await context.newPage();
  try {
    await tab.goto(url, { waitUntil: "load", timeout: 120000 });
    const at = () => tab.evaluate((target) => document.getElementById(target)?.getBoundingClientRect().top ?? null, id);
    for (let i = 0; i < 60; i++) {
      const top = await at();
      if (top !== null && top > -120 && top < 420) {
        await tab.waitForTimeout(600);
        const settled = await at();
        if (settled !== null && settled > -120 && settled < 420) return { ok: true, top: Math.round(settled), at: tab.url() };
      }
      await tab.waitForTimeout(500);
    }
    return { ok: false, top: await at(), at: tab.url() };
  } finally {
    if (tab !== page) await tab.close();
  }
}

/* ---------------------------------------------------------------- 14 */
await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 120000 });
const order = await page.evaluate(() => [...document.querySelectorAll('[id^="section-"]')].map((e) => e.id.replace("section-", "")));
if (JSON.stringify(order) !== JSON.stringify(FLOW_ORDER)) errors.push(`14: section order ${order.join(",")} is not FLOW_ORDER`);
await page.getByRole("button", { name: "Open the index" }).first().click();
await page.waitForSelector(".pf-idx__act", { timeout: 20000 });
const acts = await page.$$eval(".pf-idx__act .pf-idx__text", (els) => els.map((e) => e.textContent.trim()));
const expectedActs = ["The decision", "The evidence", "The strategy", "Delivery", "Measurement and governance", "Risks and response", "Annexes"];
const actsOk = expectedActs.every((label, i) => (acts[i] ?? "").startsWith(label));
if (!actsOk) errors.push(`14: index acts read ${JSON.stringify(acts)}`);
say(`14. "/" loads; ${order.length} sections in FLOW_ORDER: ${order.slice(0, 4).join(", ")}, …; index acts: ${acts.map((a) => a.split(/\s{2,}|What|How|Method/)[0].trim()).join(" · ")} ${actsOk ? "(preview 5 order)" : "(WRONG)"}`);

/* ---------------------------------------------------------------- 16 */
await page.fill('input[aria-label="Search sections by number, title or part"]', "ten smallest wards");
await page.waitForTimeout(800);
const hits = await page.$$eval(".pf-idx__body button", (els) => els.map((e) => e.textContent.replace(/\s+/g, " ").trim()).filter((t) => /^\d+\.\d/.test(t)));
const found = hits.some((t) => t.startsWith("2.3"));
if (!found) errors.push(`16: search for a figure's finding returned ${JSON.stringify(hits.slice(0, 5))}`);
say(`16. search "ten smallest wards" (a phrase only in figure fig-3-2-register-map's takeaway) → ${hits.slice(0, 3).join(" | ") || "nothing"} ${found ? "(finds 2.3, the figure's section)" : "(MISSING)"}`);
await page.keyboard.press("Escape");

/* ---------------------------------------------------------------- 15 */
let routes = 0;
for (const tab of FLOW_ORDER) {
  const res = await page.goto(`${BASE}/${tab}`, { waitUntil: "load", timeout: 120000 });
  const ids = await page.evaluate((t) => document.querySelectorAll(`[id^="${t}-sec-"]`).length, tab);
  if (res.status() !== 200 || (tab !== "cover" && ids === 0)) errors.push(`15: /${tab} returned ${res.status()} with ${ids} headings`);
  else routes++;
}
say(`15. every route opens: ${routes} of ${FLOW_ORDER.length} return 200 with their own headings`);

const oldLive = draw(Object.keys(moves.moves).filter((k) => !pre.ids.includes(k) && REDIRECTS[k]), 15);
const oldPre = draw(pre.ids.filter((k) => REDIRECTS[k]), 15);
const newIds = draw([...new Set(Object.values(REDIRECTS))], 10);
let landed = 0;
const failures = [];
for (const id of [...oldPre, ...oldLive, ...newIds]) {
  const target = REDIRECTS[id] ?? id;
  const r = await landsOn(`${BASE}/#${id}`, target);
  if (r.ok) landed++;
  else failures.push(`${id} -> ${target} (top ${r.top}, at ${r.at})`);
}
for (const f of failures) errors.push(`15: deep link did not land: ${f}`);
say(`15. deep links: ${landed} of ${oldPre.length + oldLive.length + newIds.length} land in view (15 pre-rebuild ids, 15 ids live before the restructure, 10 new ids)`);

for (const [url, target] of [
  [`${BASE}/analysis#analysis-sec-3-4`, "evidence-sec-2-7"],
  [`${BASE}/delivery#delivery-sec-5-6`, "measurement-sec-5-1"],
]) {
  const r = await landsOn(url, target);
  if (!r.ok) errors.push(`15: legacy route link ${url} did not land on ${target} (at ${r.at}, top ${r.top})`);
  say(`15. legacy link ${url.replace(BASE, "")} → ${r.at.replace(BASE, "")}: ${r.ok ? `lands on ${target}` : "DID NOT LAND"}`);
}

/* ---------------------------------------------------------------- 17 */
const dock = [];
for (const tab of ["workstreams-platforms", "workstreams-media", "workstreams-ground", "workstreams-data", "delivery", "staffing", "measurement", "risks"]) {
  // Sections above the target stream in as the page settles, so scroll until the section's top
  // holds still at the top of the screen, then move a little way in and back up so the dock (which
  // steps away on the way down) is showing.
  await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 120000 });
  for (let i = 0, last = null; i < 20; i++) {
    const top = await page.evaluate((t) => {
      const el = document.getElementById(`section-${t}`);
      el?.scrollIntoView();
      return el ? Math.round(el.getBoundingClientRect().top) : null;
    }, tab);
    await page.waitForTimeout(500);
    const now = await page.evaluate((t) => Math.round(document.getElementById(`section-${t}`)?.getBoundingClientRect().top ?? NaN), tab);
    if (top !== null && Math.abs(now) < 2 && last !== null && Math.abs(last) < 2) break;
    last = now;
  }
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(900);
  const shown = await page.evaluate(() => {
    const el = document.querySelector(".pf-dock__label");
    if (!el) return null;
    const text = el.textContent.replace(/\s+/g, " ").trim();
    const ratio = el.scrollWidth > el.clientWidth ? el.clientWidth / el.scrollWidth : 1;
    return { text, visible: text.slice(0, Math.floor(text.length * ratio)), truncated: ratio < 1 };
  });
  dock.push({ tab, ...shown });
}
// Each label must name its own route's number (preview section 5), or the read lagged a section.
const DOCK_NUMBER = { "workstreams-platforms": "4.5", "workstreams-media": "4.5", "workstreams-ground": "4.5", "workstreams-data": "4.5", delivery: "4", staffing: "4.6", measurement: "5", risks: "6" };
for (const d of dock) if (!(d.text ?? "").startsWith(`§${DOCK_NUMBER[d.tab]} `)) errors.push(`17: dock on ${d.tab} reads ${JSON.stringify(d.text)}`);
const ws = dock.slice(0, 4).map((d) => d.visible);
if (new Set(ws).size !== 4) errors.push(`17: workstream dock labels truncate to the same prefix: ${JSON.stringify(ws)}`);
say(`17. dock at 380px: ${dock.map((d) => `${d.tab} → "${d.visible}${d.truncated ? "…" : ""}"`).join("; ")}`);

await browser.close();
if (errors.length) {
  console.log("\nlive-checks: FAILED");
  for (const e of errors) console.log("  - " + e);
  process.exit(1);
}
console.log("\nlive-checks: 14, 15, 16 and 17 pass");
