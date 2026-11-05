#!/usr/bin/env node
/**
 * The site's motion, checked in a real browser against a running copy of the site (app/motion-draw.css,
 * app/chart-kit.css, components/register/RegisterMotion.tsx).
 *
 * Motion must never be the only way to see something, so this checks the ends rather than the
 * middle:
 *
 *   0. Statically, before any browser: app/motion-draw.css moves nothing but compositor
 *      properties (opacity, translate, scale, rotate, transform, stroke-dashoffset), so motion
 *      cannot shift the layout around it.
 *   1. Every chapter at 390px, scrolled through a screen at a time: at no step is a figure (.rf)
 *      or content visual (.vz) still pending while it sits in view. At the end, any visual the
 *      scroll passed while its section was still streaming in is scrolled to and must draw. Every
 *      mark the motion moves has settled at full opacity with no leftover offset. Layout shift is
 *      reported with motion on and off, not enforced: some chapters shift as their sections
 *      stream in, with or without motion, and check 0 is what rules motion out.
 *
 *   The browser is told it runs on an eight-core, 8 GB device: RegisterMotion leaves motion off
 *   on four cores or fewer, and a build container is often that small.
 *   2. Reduced motion: the same, and the stagger rules do not apply.
 *   3. JavaScript off: nothing is ever pending, so every visual is drawn in the HTML.
 *   4. Print: every visual is drawn.
 *   5. A fold opened by a tap plays its disclosure once, and the mark is gone afterwards. A
 *      workstream tab switch moves one highlight and marks the arriving panel from the side its
 *      tab sits on.
 *   6. Frame timing, reported (not enforced): the 95th-percentile frame while scrolling a heavy
 *      chapter at 4x CPU slowdown.
 *
 *     node scripts/consolidation/motion-check.mjs http://localhost:3100
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)("playwright");
const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");

const src = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "..", "..", "lib", "content-files.ts"), "utf8");
const ROUTES = [...src.matchAll(/^\s*"?([a-z-]+)"?:\s*"[a-z-]+\.md"/gm)].map((m) => m[1]).filter((t) => t !== "cover");

const fails = [];
const ok = (cond, msg) => { if (cond) console.log(`  ok  ${msg}`); else { console.log(`  FAIL ${msg}`); fails.push(msg); } };

/** A capable phone, or a low-end one, as RegisterMotion reads them. */
const device = (cores) => `Object.defineProperty(navigator, "hardwareConcurrency", { get: () => ${cores} }); Object.defineProperty(navigator, "deviceMemory", { get: () => ${cores} });`;
const CLS = `window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });`;

/** Pending visuals that sit in the part of the screen a reader is looking at. */
const pendingInView = (page) => page.evaluate(() => Array.from(document.querySelectorAll(".rf.is-pending, .vz.is-pending"))
  .filter((el) => { if (!el.getClientRects().length || el.closest("[hidden]")) return false; const r = el.getBoundingClientRect(); return r.height > 0 && r.top < innerHeight * 0.8 && r.bottom > innerHeight * 0.1; })
  .map((el) => el.id || el.className));

/**
 * Scroll the whole page a screen at a time (instantly: the site's smooth scrolling would let one
 * step cut off the last), so every streamed section mounts and every visual enters view. After each
 * step, nothing pending may sit in view. Returns what was seen pending in view.
 */
async function scrollThrough(page) {
  const seen = new Set();
  let last = -1;
  for (let i = 0; i < 500; i++) {
    const h = await page.evaluate(() => { window.scrollBy({ top: window.innerHeight * 0.7, behavior: "instant" }); return document.documentElement.scrollHeight; });
    await page.waitForTimeout(120);
    for (const id of await pendingInView(page)) seen.add(id);
    const y = await page.evaluate(() => window.scrollY + window.innerHeight);
    if (y >= h - 2) { if (h === last) break; last = h; await page.waitForTimeout(400); }
  }
  await page.waitForTimeout(2200); // the longest stagger is about two seconds
  return [...seen];
}

/**
 * Visuals still pending at the end: the scroll passed them while their section was streaming in.
 * Each is scrolled to, as a reader scrolling back would reach it; any that does not draw is stuck.
 */
async function stuck(page) {
  const ids = await page.evaluate(() => Array.from(document.querySelectorAll(".rf.is-pending, .vz.is-pending"))
    .filter((el) => el.getClientRects().length > 0 && !el.closest("[hidden]"))
    .map((el, n) => { if (!el.id) el.setAttribute("data-mc", String(n)); return el.id ? `#${CSS.escape(el.id)}` : `[data-mc="${n}"]`; }));
  const bad = [];
  for (const sel of ids) {
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: "start", behavior: "instant" }), sel);
    await page.waitForTimeout(500);
    if (await page.evaluate((sel) => document.querySelector(sel)?.classList.contains("is-pending"), sel)) bad.push(sel);
  }
  if (ids.length) await page.waitForTimeout(2200);
  return { revisited: ids.length, bad };
}

/** What app/motion-draw.css moves. A mark that ends below full opacity by design is not among them. */
const MOVED = [
  ".kx-matrix tbody tr", ".kx-card", ".kx-heat__cell", ".kx-riskgrid td", ".kx-riskgrid .kx-riskpin", ".kx-day", ".kx-phone__fields li", ".kx-phone .kx-pin",
  ".vz-seq__mark", ".vz-seq--stepper .vz-seq__text", ".vz-seq--timeline .vz-seq__text", ".vz-card", ".vz-stat__value", ".vz-stat__label", ".vz-bars__fill",
  ".vz-donut__seg", ".vz-col", ".vz-col__item", ".vz-week__day", ".vz-table tbody tr", ".vz-panel",
].join(", ");

/** Moved marks inside drawn visuals that have not reached their end state. */
const unsettled = (page) => page.evaluate((MOVED) => {
  const bad = [];
  for (const el of document.querySelectorAll(`:is(.rf, .vz).is-drawn :is(${MOVED})`)) {
    if (!el.getClientRects().length) continue;
    const cs = getComputedStyle(el);
    if (Number(cs.opacity) < 0.99 || (cs.translate !== "none" && cs.translate !== "0px") || (cs.scale !== "none" && cs.scale !== "1") || (cs.rotate !== "none" && cs.rotate !== "0deg")) bad.push(`${el.getAttribute("class")} (opacity ${cs.opacity}, translate ${cs.translate}, scale ${cs.scale}, rotate ${cs.rotate})`);
  }
  return bad;
}, MOVED);

// 0. Motion moves compositor properties only.
console.log("\nstatic: what the motion moves");
{
  const css = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "..", "..", "app", "motion-draw.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const ALLOWED = new Set(["opacity", "translate", "scale", "rotate", "transform", "stroke-dashoffset"]);
  const bad = new Set();
  // Properties set in a pending state or in a keyframe: what the browser animates away from.
  for (const m of css.matchAll(/(?:\.is-pending[^{]*|from|to|\d+%)\s*\{([^{}]*)\}/g)) {
    for (const d of m[1].split(";")) { const prop = d.split(":")[0].trim(); if (prop && !prop.startsWith("--") && !ALLOWED.has(prop) && !["stroke-dasharray", "transform-origin", "transform-box"].includes(prop)) bad.add(prop); }
  }
  // Properties named in a transition.
  for (const m of css.matchAll(/transition:\s*([^;]+);/g)) {
    for (const part of m[1].split(/,(?![^(]*\))/)) { const prop = part.trim().split(/\s+/)[0]; if (!ALLOWED.has(prop)) bad.add(prop); }
  }
  ok(bad.size === 0, `app/motion-draw.css animates only compositor properties${bad.size ? ` (found: ${[...bad].join(", ")})` : ""}`);
}

const browser = await chromium.launch();
/** A context on a capable device, so motion is on. */
const capable = async (opts = {}) => { const c = await browser.newContext(opts); await c.addInitScript(device(8)); return c; };

// 1. Every chapter, motion on.
console.log("\nmotion on, 390px");
let drawn = 0;
/** One scroll through a chapter on a device with `cores` cores: what drew in, and the layout shift. */
async function run(r, cores) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(device(cores));
  await ctx.addInitScript(CLS);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${r}`, { waitUntil: "networkidle", timeout: 120_000 });
  const inView = await scrollThrough(page);
  const cls = await page.evaluate(() => window.__cls);
  const st = await stuck(page);
  const out = {
    inView,
    stuck: st.bad,
    revisited: st.revisited,
    unsettled: await unsettled(page),
    drawn: await page.evaluate(() => document.querySelectorAll(".rf.is-drawn, .vz.is-drawn").length),
    cls,
  };
  await ctx.close();
  return out;
}
for (const r of ROUTES) {
  const on = await run(r, 8);
  const off = await run(r, 2);
  drawn += on.drawn;
  ok(on.inView.length === 0 && on.stuck.length === 0 && on.unsettled.length === 0,
    `/${r}: ${on.drawn} drawn in (${on.revisited} on the way back up), ${on.inView.length} pending in view, ${on.stuck.length} stuck, ${on.unsettled.length} unsettled; layout shift ${on.cls.toFixed(3)} with motion, ${off.cls.toFixed(3)} without` +
    `${on.inView.length ? ` [in view: ${on.inView.slice(0, 3).join(", ")}]` : ""}${on.stuck.length ? ` [${on.stuck.slice(0, 2).join(", ")}]` : ""}${on.unsettled.length ? ` [${on.unsettled.slice(0, 2).join(" | ")}]` : ""}`);
}
ok(drawn > 100, `${drawn} visuals drew in across the chapters`);

// 2. Reduced motion.
console.log("\nreduced motion");
for (const r of ["votes", "response", "workstreams"]) {
  const ctx = await capable({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${r}`, { waitUntil: "networkidle", timeout: 120_000 });
  const inView = await scrollThrough(page);
  const s = (await stuck(page)).bad.concat(inView);
  const u = await unsettled(page);
  const moved = await page.evaluate(() => Array.from(document.querySelectorAll('.vz.is-drawn .vz-card, .rf.is-drawn .kx-matrix tbody tr')).filter((el) => getComputedStyle(el).transitionDelay.split(",").some((d) => parseFloat(d) > 0)).length);
  ok(s.length === 0 && u.length === 0 && moved === 0, `/${r}: ${s.length} stuck, ${u.length} unsettled, ${moved} staggered`);
  await ctx.close();
}

// 3. JavaScript off.
console.log("\nJavaScript off");
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  for (const r of ["votes", "response", "lawful"]) {
    await page.goto(`${BASE}/${r}`, { waitUntil: "load" });
    const pending = await page.locator(".is-pending").count();
    const vis = await page.locator(".rf, .vz").count();
    ok(pending === 0 && vis > 0, `/${r}: ${vis} visuals in the HTML, ${pending} pending`);
  }
  await ctx.close();
}

// 4. Print.
console.log("\nprint");
{
  const ctx = await capable({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/response`, { waitUntil: "networkidle" });
  for (let i = 0; i < 30; i++) { await page.evaluate(() => window.scrollBy(0, 300)); await page.waitForTimeout(30); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await page.waitForTimeout(300);
  const hidden = await page.evaluate(() => Array.from(document.querySelectorAll(':is(.rf, .vz) :is([style*="--i"], .vz-seq__mark)')).filter((el) => el.getClientRects().length && Number(getComputedStyle(el).opacity) < 0.99).length);
  ok(hidden === 0, `/response in print: ${hidden} marks below full opacity`);
  await ctx.close();
}

// 5. Folds and tabs.
console.log("\nfolds and tabs");
{
  const ctx = await capable({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/response`, { waitUntil: "networkidle" });
  await scrollThrough(page);
  const btn = page.locator(".vz-row__btn").first();
  await btn.scrollIntoViewIfNeeded();
  const id = await btn.getAttribute("aria-controls");
  await btn.click();
  const marked = await page.evaluate((id) => document.getElementById(id)?.hasAttribute("data-fold-enter"), id);
  await page.waitForTimeout(700);
  const after = await page.evaluate((id) => { const el = document.getElementById(id); return { mark: el?.hasAttribute("data-fold-enter"), open: el?.getAttribute("data-fold-body"), opacity: el ? getComputedStyle(el).opacity : null }; }, id);
  ok(marked === true && after.mark === false && after.open === "open" && after.opacity === "1", `a tapped fold plays its disclosure once (marked ${marked}, then ${JSON.stringify(after)})`);

  await page.goto(`${BASE}/workstreams`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  ok((await page.locator("[data-ws-enter]").count()) === 0, "workstreams: nothing moves on load");
  await page.click('a[role="tab"][href="#ws-ground"]');
  await page.waitForTimeout(60);
  const dirs = await page.evaluate(() => [...new Set(Array.from(document.querySelectorAll("[data-ws-enter]")).map((e) => e.getAttribute("data-ws-enter")))]);
  ok(JSON.stringify(dirs) === '["next"]', `workstreams: a later tab's panel arrives from the right (${JSON.stringify(dirs)})`);
  await page.waitForTimeout(900);
  await page.click('a[role="tab"][href="#ws-media"]');
  await page.waitForTimeout(60);
  const back = await page.evaluate(() => [...new Set(Array.from(document.querySelectorAll("[data-ws-enter]")).map((e) => e.getAttribute("data-ws-enter")))]);
  ok(JSON.stringify(back) === '["prev"]', `workstreams: an earlier tab's panel arrives from the left (${JSON.stringify(back)})`);
  await page.waitForTimeout(900);
  ok((await page.locator("[data-ws-enter]").count()) === 0, "workstreams: the entrance mark clears");
  ok((await page.locator('[data-ws-tabs] a[role="tab"] > span[aria-hidden="true"]').count()) === 1, "workstreams: one highlight, on the chosen tab");
  await ctx.close();
}

// 6. Frame timing, reported.
console.log("\nframe timing (reported)");
for (const r of ["votes", "workstreams"]) {
  const ctx = await capable({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(`${BASE}/${r}`, { waitUntil: "networkidle" });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.evaluate(() => { window.__f = []; let t = performance.now(); const tick = (n) => { window.__f.push(n - t); t = n; if (window.__f.length < 900) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 500); await page.waitForTimeout(40); }
  await page.waitForTimeout(1500);
  const f = (await page.evaluate(() => window.__f)).slice(5).sort((a, b) => a - b);
  const p = (q) => f[Math.min(f.length - 1, Math.floor(f.length * q))].toFixed(1);
  console.log(`  /${r} at 4x CPU slowdown: median ${p(0.5)} ms, 95th percentile ${p(0.95)} ms per frame over ${f.length} frames`);
  await ctx.close();
}

await browser.close();
if (fails.length) { console.log(`\nmotion-check: ${fails.length} failure(s)`); process.exit(1); }
console.log("\nmotion-check: pass");
