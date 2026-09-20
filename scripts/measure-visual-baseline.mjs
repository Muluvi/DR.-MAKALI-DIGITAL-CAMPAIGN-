#!/usr/bin/env node
/**
 * The numbers behind docs/visual-audit/BASELINE.md and, after the work, REPORT.md.
 *
 * WHY THIS IS A SCRIPT AND NOT A PARAGRAPH. "The site got shorter" is a claim, and this proposal
 * is a document about not making claims you cannot show the working for. Every before/after figure
 * in the audit comes out of this file, so the after-column is measured the same way as the
 * before-column and the comparison means something.
 *
 * It reports four things:
 *
 *   1. Page metrics per route and viewport — scroll height, requests, bytes, sideways scroll.
 *      Vitals include INP, measured by clicking the controls this redesign added rather than
 *      inferred: an unclicked page has no INP at all, and reporting its absence as a pass would
 *      be the same class of mistake as drawing an unmeasured baseline at zero.
 *   2. Core Web Vitals on a mid-range Android profile (4x CPU throttle, slow 4G), because the
 *      reader this document is written for opens it on a phone on mobile data.
 *   3. Word counts three ways — the source markdown, the whole DOM, and what is actually laid
 *      out. The gap between the first two is duplicated text nodes; the gap between the second
 *      and third is reading mode and content-visibility.
 *   4. Whether the hero's figures are final with JavaScript off. A counter that server-renders
 *      zero is reporting a figure of zero.
 *
 *     npm run build && npx next start -p 3210 &
 *     node scripts/measure-visual-baseline.mjs http://localhost:3210
 *
 * Playwright is not a dependency of this project — install it in a scratch directory and point
 * NODE_PATH at it, or run this from a checkout that has it. Same arrangement as
 * scripts/measure-section-heights.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] ?? "http://localhost:3000";

/**
 * Resolve playwright from wherever it happens to be.
 *
 * A bare `import("playwright")` ignores NODE_PATH — ESM resolution does not consult it — so the
 * instruction at the top of this file would be a lie for anyone who followed it. Fall back to
 * CommonJS resolution, which does honour NODE_PATH, before giving up.
 */
async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const { createRequire } = await import("node:module");
    const req = createRequire(import.meta.url);
    for (const dir of (process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean)) {
      try { return req(path.join(dir, "playwright")); } catch { /* try the next one */ }
    }
    console.error("measure-visual-baseline: playwright is not installed. See the note at the top of this file.");
    process.exit(1);
  }
}

const { chromium } = await loadPlaywright();

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}
);

const VIEWPORTS = [
  { width: 390, height: 844, tag: "390" },
  { width: 1440, height: 900, tag: "1440" },
];
const ROUTES = ["/", "/full"];

const report = { measuredAt: new Date().toISOString(), base: BASE };

/** Words in the source markdown — the figure the hero's reading time is computed from. */
function sourceWords() {
  const dir = path.join(ROOT, "public", "content");
  const per = {};
  let total = 0;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const n = (fs.readFileSync(path.join(dir, file), "utf8").match(/\S+/g) ?? []).length;
    per[file.replace(/\.md$/, "")] = n;
    total += n;
  }
  return { total, per };
}

/**
 * Box-drawing blocks and tables, counted from the markdown rather than the DOM.
 *
 * The target for the ASCII count is zero. Counting it here rather than by eye is the only way
 * "zero remain" is a fact rather than an impression.
 */
function blockCensus() {
  const dir = path.join(ROOT, "public", "content");
  const BOX = /[┌│└═▼█┐┘├┤┬┴┼─╔╗╚╝║╠╣╦╩╬▲◄►]/;
  let fenced = 0, ascii = 0, tables = 0, rows = 0, figureFences = 0;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    for (const m of text.matchAll(/^```([^\n]*)\n(.*?)^```/gms)) {
      fenced += 1;
      if (m[1].trim() === "figure") figureFences += 1;
      else if (BOX.test(m[2])) ascii += 1;
    }
    const lines = text.replace(/^```.*?^```/gms, "").split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*\|.*\|\s*$/.test(lines[i]) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? "")) {
        tables += 1;
        let j = i + 2;
        while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j])) j += 1;
        rows += j - (i + 2);
        i = j;
      }
    }
  }
  return { fencedBlocks: fenced, asciiBlocks: ascii, figureFences, markdownTables: tables, tableRows: rows };
}

/** Scroll height, weight and sideways scroll, with the network settled. */
async function pageMetrics(route, viewport) {
  const ctx = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await ctx.newPage();

  // Bytes come off the wire through CDP rather than by awaiting response.body(). The body form
  // races the context close and silently under-counts whatever has not resolved yet, which made
  // consecutive runs of this script disagree by 3 MB on the same page — a measurement that
  // disagrees with itself is not evidence. encodedDataLength is the transferred size, after
  // compression, which is what the reader on mobile data actually pays for.
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  let bytes = 0, requests = 0;
  const thirdParty = new Set();
  const origin = new URL(BASE).host;
  cdp.on("Network.requestWillBeSent", (e) => {
    requests += 1;
    try {
      const host = new URL(e.request.url).host;
      if (host && host !== origin) thirdParty.add(host);
    } catch { /* data: and blob: URLs have no host, and no third party */ }
  });
  cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength ?? 0; });

  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 180_000 });
  await page.waitForTimeout(1200);
  const m = await page.evaluate(() => {
    /**
     * Words the document actually contains, which is not the same as `body.textContent`.
     *
     * `textContent` includes the contents of every <script>, and a React Server Components page
     * carries its whole flight payload inline in script tags — tens of thousands of "words" of
     * serialised JSON that no reader will ever see. Counting those made /full look like a
     * 124,000-word document against 63,433 words of markdown, and made a duplicated-text-node
     * problem look four times larger than it was. A TreeWalker over text nodes, skipping script,
     * style and template, counts what is in the document and nothing else.
     *
     * This is still a superset of the prose: it includes figure labels, chapter chrome and any
     * visually hidden duplicate. That is the point — it is the number that falls when duplication
     * is removed.
     */
    const SKIP = new Set(["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT"]);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement && SKIP.has(node.parentElement.tagName)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
    let domWords = 0;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      domWords += (n.nodeValue.match(/\S+/g) ?? []).length;
    }

    /**
     * Hidden text, and the part of it that is genuinely a SECOND COPY.
     *
     * An earlier version of this script reported every `.sr-only` word as a duplicate, and the
     * baseline write-up repeated the claim. That was wrong and it overstated the defect: most
     * hidden text is not a twin of anything. A table's `<caption class="sr-only">` names the
     * table for a screen reader and appears nowhere visibly; a `<span class="sr-only">Stage 2: </span>`
     * supplies an ordinal the eye gets from position. Neither is a duplicate, and removing them
     * would make the page worse.
     *
     * The defect worth counting is text that is in the document TWICE — once for assistive
     * technology and once for the eye — because both halves are real to copy-paste, reader mode
     * and find-in-page. So `duplicatedWords` checks each hidden string against the visible
     * rendering, and `hiddenWords` is reported separately and named for what it is.
     */
    const visibleText = document.body.innerText;
    let hiddenWords = 0;
    let duplicatedWords = 0;
    for (const el of document.querySelectorAll('.sr-only, [aria-hidden="true"]')) {
      const text = (el.textContent ?? "").trim();
      if (!text) continue;
      const words = (text.match(/\S+/g) ?? []).length;
      hiddenWords += words;
      // Three characters or fewer matches too much to mean anything.
      if (text.length > 3 && visibleText.includes(text)) duplicatedWords += words;
    }

    return {
      scrollHeight: document.documentElement.scrollHeight,
      domWords,
      hiddenWords,
      duplicatedWords,
      renderedWords: (document.body.innerText.match(/\S+/g) ?? []).length,
      domNodes: document.getElementsByTagName("*").length,
      // A page that scrolls sideways on a phone has failed before anything else is judged.
      horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  await ctx.close();
  return { ...m, requests, transferBytes: bytes, thirdParty: [...thirdParty] };
}

/**
 * LCP and CLS on the phone this document is written for.
 *
 * 4x CPU throttle and 1.6 Mbps / 150 ms is the mid-range Android on mobile data that §2.3 names
 * as a structural constraint on this electorate. Measuring on the build machine's own network
 * would be measuring the wrong reader.
 */
async function vitals(route) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    window.__inp = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
      .observe({ type: "layout-shift", buffered: true });
    /**
     * INP is the WORST interaction on the page, not the average, so every one is recorded and the
     * maximum reported. `interactionId` is what distinguishes a real interaction from an
     * incidental event, and `duration` is the full input-to-next-paint span.
     */
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (e.interactionId) window.__inp.push({ name: e.name, dur: e.duration });
    }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  });
  const started = Date.now();
  await page.goto(BASE + route, { waitUntil: "load", timeout: 240_000 });
  await page.waitForTimeout(5000);
  const loadMs = Date.now() - started;

  /**
   * CLS is read BEFORE anything is clicked, and that is not a convenience.
   *
   * Cumulative Layout Shift measures instability the reader did not ask for. Switching Brief to
   * Full reflows the document because the reader asked it to, and the API only discounts shifts
   * within 500ms of the input — so a script that clicks and then waits records a deliberate
   * reflow as instability. Measured across the load, `/` is 0; measured across the load plus a
   * Brief/Full toggle, it reads 0.0061, and that number would be a lie about the page.
   */
  const clsAtLoad = await page.evaluate(() => Number(window.__cls.toFixed(4)));

  /**
   * Then actually interact with it, because an unclicked page has no INP.
   *
   * The controls below are the ones this redesign added or kept: the Brief/Full switch, a
   * subsection disclosure, a figure's data table, a rule 1b cross-reference and a table control.
   * Anything that is not on this route is skipped rather than failing the run — `/` and `/full`
   * do not carry the same set.
   */
  const CONTROLS = [
    ["brief-full", "text=Full"],
    ["brief-full-back", "text=Brief"],
    ["subsection-disclosure", "summary"],
    ["figure-data-table", "figure summary"],
    ["cross-reference", "details.crossref > summary"],
    ["table-control", "button"],
  ];
  const clicked = [];
  for (const [label, selector] of CONTROLS) {
    try {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded({ timeout: 5000 });
      await el.click({ timeout: 5000, force: true });
      await page.waitForTimeout(900);
      clicked.push(label);
    } catch {
      // Not on this route.
    }
  }
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1200);

  const m = await page.evaluate(() => ({
    fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0),
    lcp: Math.round(window.__lcp),
    clsIncludingInteraction: Number(window.__cls.toFixed(4)),
    inp: window.__inp.length ? Math.round(Math.max(...window.__inp.map((e) => e.dur))) : null,
    /** The worst interaction, named. A bare INP number says nothing about what to fix. */
    worst: window.__inp.length
      ? window.__inp.reduce((a, b) => (b.dur > a.dur ? b : a)).name
      : null,
    interactions: window.__inp.length,
  }));
  await ctx.close();
  return { ...m, cls: clsAtLoad, clicked, loadMs };
}

/**
 * What a reader with JavaScript off is shown.
 *
 * Every figure in the returned text must be the real figure. A "0.0%" or a "KSh0.00bn" here is a
 * defect, not a loading state, and the audit treats it as one.
 */
async function noScript(route) {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "load", timeout: 180_000 });
  const text = await page.evaluate(() => document.body.innerText);
  await ctx.close();
  const ZEROED = /(?:KSh\s?0\.00\s?bn|≈\s?0k|\b0\.0%)/g;
  return { zeroedFigures: text.match(ZEROED) ?? [], excerpt: text.slice(0, 1600) };
}

report.source = sourceWords();
report.blocks = blockCensus();
report.pages = {};
for (const route of ROUTES) {
  for (const viewport of VIEWPORTS) {
    report.pages[`${route} @${viewport.tag}`] = await pageMetrics(route, viewport);
  }
}
report.vitals = {};
for (const route of ROUTES) report.vitals[route] = await vitals(route);
report.noScript = await noScript("/");

await browser.close();
console.log(JSON.stringify(report, null, 2));
