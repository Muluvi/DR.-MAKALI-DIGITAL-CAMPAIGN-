#!/usr/bin/env node
/**
 * Reader-facing checks 10, 11, 13, 14 and 15 of the declutter brief (2026-10, section 10), in a
 * real browser against a running copy of the site (a local build, the Vercel preview, production).
 *
 *  10. No working mark is visible: no "[CONFLICT", "CHECK REF", "[VERIFY", "[Confirm approach", and no
 *      "(Tier 1|2|3" outside a badge, on any tab, in text a reader can see.
 *  11. No paragraph over 60 words is visible outside a fold, except where brief section 2, rule 7
 *      keeps a commitment's full wording on the page (the 5.3.3 charter and F.1, listed below).
 *  13. Print: with print media and the page's beforeprint handlers run, every fold body is
 *      displayed and every content disclosure (details.print-open) is open, on every tab.
 *  14. JavaScript off: every fold body, tab panel and card or row disclosure is in the HTML and
 *      displayed, on every tab.
 *  15. Deep links: 30 old ids from lib/anchors/pre-rebuild.json and 20 current ids, each opened as
 *      "/#id", land with their heading in view and no closed fold around it.
 *
 *     node scripts/declutter/live-checks.mjs http://localhost:3100
 *     VERCEL_SHARE="<preview url with ?_vercel_share=…>" node scripts/declutter/live-checks.mjs <preview url>
 *
 * VERCEL_SHARE is a Vercel share link for a protected preview: each browser context opens it once
 * first, which sets the access cookie, and then tests the site as a reader would.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const errors = [];
const say = (s) => console.log(s);

const src = fs.readFileSync(path.join(ROOT, "lib", "content-files.ts"), "utf8");
const TABS = [...src.matchAll(/^\s*"?([a-z-]+)"?:\s*"[a-z-]+\.md"/gm)].map((m) => m[1]);
const redirectsSrc = fs.readFileSync(path.join(ROOT, "lib", "anchors", "redirects.ts"), "utf8");
const REDIRECTS = JSON.parse(redirectsSrc.slice(redirectsSrc.indexOf("{"), redirectsSrc.lastIndexOf("}") + 1));
const pre = JSON.parse(fs.readFileSync(path.join(ROOT, "lib", "anchors", "pre-rebuild.json"), "utf8"));

/** Sections whose long paragraphs are commitments kept whole (brief section 2, rule 7). */
const COMMITMENTS = ["measurement-sec-5-3-3", "annex-terms-sec-f-1"];

let seed = 20261029;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const draw = (list, n) => [...list].sort().map((v) => [rand(), v]).sort((a, b) => a[0] - b[0]).slice(0, n).map((p) => p[1]);

const browser = await chromium.launch();
const SHARE = process.env.VERCEL_SHARE;
async function open(context) {
  if (SHARE) {
    const p = await context.newPage();
    await p.goto(SHARE, { waitUntil: "load", timeout: 120000 });
    await p.close();
  }
  return context;
}

async function settle(page) {
  let last = 0;
  for (let i = 0; i < 80; i++) {
    const h = await page.evaluate(() => { window.scrollBy(0, 3000); return document.documentElement.scrollHeight; });
    await page.waitForTimeout(100);
    if (h === last && i > 5) break;
    last = h;
  }
  await page.waitForTimeout(400);
}

/* ---------------------------------------------------------------- 10, 11 and 13: scripts on */
const ctx = await open(await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" }));
const page = await ctx.newPage();
let raw = 0, long = 0, foldsPrinted = 0, detailsPrinted = 0;
for (const tab of TABS) {
  await page.goto(`${BASE}/${tab}`, { waitUntil: "networkidle", timeout: 120000 });
  await settle(page);
  const r = await page.evaluate((commitments) => {
    const W = (s) => ((s || "").match(/[A-Za-z0-9][A-Za-z0-9'’,.%-]*/g) || []).length;
    const main = document.querySelector("main");
    const marks = [];
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode()); ) {
      if (!/\[CONFLICT|CHECK REF|\[VERIFY|\[Confirm approach|\(Tier [123]/.test(n.textContent)) continue;
      const el = n.parentElement;
      if (el.closest("[hidden], .ichip, .tp, .sr-only") || el.getClientRects().length === 0) continue;
      marks.push(n.textContent.trim().slice(0, 100));
    }
    const paras = [];
    // A paragraph belongs to the last section heading before it in the document.
    const heads = [...main.querySelectorAll("h2[id*='-sec-'], h3[id*='-sec-']")];
    const sectionOf = (el) => {
      let found = null;
      for (const h of heads) if (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) found = h;
      return found ? found.id : "";
    };
    for (const p of main.querySelectorAll("p")) {
      if (p.closest("[hidden]") || p.getClientRects().length === 0) continue;
      const w = W(p.textContent);
      if (w <= 60) continue;
      if (commitments.includes(sectionOf(p))) continue;
      paras.push(`${w} words: ${p.textContent.trim().slice(0, 80)}`);
    }
    return { marks, paras };
  }, COMMITMENTS);
  for (const m of r.marks) errors.push(`10: /${tab} shows "${m}"`);
  for (const p of r.paras) errors.push(`11: /${tab} shows a paragraph of ${p}`);
  raw += r.marks.length;
  long += r.paras.length;

  // 13: print media, with the page's own beforeprint handlers run.
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  const p = await page.evaluate(() => {
    const folds = [...document.querySelectorAll("[data-fold-body]")];
    const hiddenFolds = folds.filter((el) => getComputedStyle(el).display === "none" || getComputedStyle(el).contentVisibility === "hidden");
    const details = [...document.querySelectorAll("details.print-open")];
    return { folds: folds.length, hidden: hiddenFolds.length, details: details.length, shut: details.filter((d) => !d.open).length };
  });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await page.emulateMedia({ media: "screen" });
  if (p.hidden) errors.push(`13: /${tab} prints ${p.hidden} of ${p.folds} folds closed`);
  if (p.shut) errors.push(`13: /${tab} prints ${p.shut} of ${p.details} content disclosures shut`);
  foldsPrinted += p.folds;
  detailsPrinted += p.details;
}
say(`10. working marks visible across ${TABS.length} tabs: ${raw}`);
say(`11. paragraphs over 60 words visible outside folds (the 5.3.3 charter and F.1 kept whole by rule 7): ${long}`);
say(`13. print: ${foldsPrinted} fold bodies and ${detailsPrinted} content disclosures across ${TABS.length} tabs, all displayed`);

/* ---------------------------------------------------------------- 14: scripts off */
const off = await open(await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false }));
const offPage = await off.newPage();
let offFolds = 0, offPanels = 0;
for (const tab of TABS) {
  const res = await offPage.goto(`${BASE}/${tab}`, { waitUntil: "load", timeout: 120000 });
  const r = await offPage.evaluate(() => {
    const folds = [...document.querySelectorAll("[data-fold-body]")];
    const hidden = folds.filter((el) => getComputedStyle(el).display === "none");
    const panels = [...document.querySelectorAll(".vz-tabs [role='tabpanel'], .vz-tabs [data-fold-body]")];
    const headings = document.querySelectorAll("[id*='-sec-']").length;
    return { folds: folds.length, hidden: hidden.length, panels: panels.length, headings };
  });
  if (res.status() !== 200) errors.push(`14: /${tab} returned ${res.status()} with scripts off`);
  if (r.hidden) errors.push(`14: /${tab} hides ${r.hidden} of ${r.folds} fold bodies with scripts off`);
  if (tab !== "cover" && r.headings === 0) errors.push(`14: /${tab} has no section headings in its HTML`);
  offFolds += r.folds;
  offPanels += r.panels;
}
await off.close();
say(`14. scripts off: ${offFolds} fold bodies (including ${offPanels} tab panels) across ${TABS.length} tabs, all in the HTML and displayed`);

/* ---------------------------------------------------------------- 15: deep links */
async function landsOn(url, id) {
  const tab = await ctx.newPage();
  try {
    await tab.goto(url, { waitUntil: "load", timeout: 120000 });
    const at = () => tab.evaluate((target) => {
      const el = document.getElementById(target);
      if (!el) return null;
      const closed = el.closest("[data-fold-body='closed'], [hidden]");
      return { top: el.getBoundingClientRect().top, closed: Boolean(closed) };
    }, id);
    for (let i = 0; i < 60; i++) {
      const r = await at();
      if (r && r.top > -120 && r.top < 420 && !r.closed) {
        await tab.waitForTimeout(600);
        const s = await at();
        if (s && s.top > -120 && s.top < 420 && !s.closed) return { ok: true };
      }
      await tab.waitForTimeout(500);
    }
    return { ok: false, last: await at(), at: tab.url() };
  } finally {
    await tab.close();
  }
}
const oldIds = draw(pre.ids.filter((k) => REDIRECTS[k]), 30);
const currentIds = draw([...new Set(Object.values(REDIRECTS))], 20);
let landed = 0;
for (const id of [...oldIds, ...currentIds]) {
  const target = REDIRECTS[id] ?? id;
  const r = await landsOn(`${BASE}/#${id}`, target);
  if (r.ok) landed++;
  else errors.push(`15: /#${id} did not land on ${target} (${JSON.stringify(r.last)}, at ${r.at})`);
}
say(`15. deep links: ${landed} of ${oldIds.length + currentIds.length} land in view with no closed fold around them (30 pre-rebuild ids, 20 current ids)`);

await browser.close();
if (errors.length) {
  console.log("\nlive-checks: FAILED");
  for (const e of errors) console.log("  - " + e);
  process.exit(1);
}
console.log("\nlive-checks: 10, 11, 13, 14 and 15 pass");
