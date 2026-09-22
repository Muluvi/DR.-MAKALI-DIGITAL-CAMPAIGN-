#!/usr/bin/env node
/**
 * The whole-site sweep: every route, at a phone width, checked for the things that break silently.
 *
 *     npm run build && npx next start -p 3210 &
 *     node scripts/audit-routes.mjs http://localhost:3210
 *
 * WHAT IT CHECKS, and why each one is here rather than in a unit test:
 *
 *   - **HTTP 200.** A route that 404s is a chapter that vanished, and the deep-link guard cannot
 *     see it because the links are fine — it is the page that is gone.
 *   - **No sideways scroll at 390px.** The single defect this whole redesign began with.
 *   - **No figure placeholder.** A malformed fence or an unregistered id renders a visible banner
 *     where a retired ASCII block used to be. verify-figure-fences catches it in the source; this
 *     catches it in the rendered page, which is where a reader meets it.
 *   - **No figure reading zero.** `KSh0.00bn` and `≈0k` were real defects: counters that began at
 *     zero in the server HTML. §3.4's scenario panel genuinely reports 0.0% of draws above
 *     198,004 — its 95th percentile is 131,934 — so that one is matched by its label and allowed.
 *   - **No page errors.** An exception during hydration leaves the page looking fine and the
 *     controls dead.
 *   - **axe-core**, where it is installed: colour contrast, names, roles, landmarks, table
 *     structure. The accessibility work in this document was done by hand, and hand work is what
 *     regresses silently.
 *
 * Playwright and axe are not dependencies of this project — the same arrangement as
 * scripts/measure-section-heights.mjs. Without them this exits 0 with a note, so a contributor
 * without the browser installed is told rather than blocked; CI installs both and gets the checks.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] ?? "http://localhost:3210";

async function optional(name) {
  try {
    return await import(name);
  } catch {
    const { createRequire } = await import("node:module");
    const req = createRequire(import.meta.url);
    for (const dir of (process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean)) {
      try { return req(path.join(dir, name)); } catch { /* next */ }
    }
    return null;
  }
}

// `playwright` in a full install, `playwright-core` where only the driver is present (the axe
// sidecar installs that one). Either drives the same browser.
const pw = (await optional("playwright")) ?? (await optional("playwright-core"));
if (!pw) {
  console.log("audit-routes: playwright is not installed — skipping. See the note at the top of this file.");
  process.exit(0);
}
const axeModule = await optional("@axe-core/playwright");
const AxeBuilder = axeModule?.default ?? axeModule?.AxeBuilder ?? null;

/**
 * Every route, derived from the content directory rather than listed here.
 *
 * The list used to be typed out, which was fine for three years and wrong for one commit: the
 * 2026 restructure replaced thirty routes with nineteen, and a hand-kept list would have gone on
 * auditing routes that no longer exist while missing every one that does.
 */
const ROUTES = ["/", "/full"].concat(
  fs
    .readdirSync(path.join(ROOT, "public", "content"))
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => "/" + f.replace(/\.md$/, ""))
);

const browser = await pw.chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}
);
// REDUCED MOTION IS THE HONEST SETTING, not a convenience. axe samples computed colour at the
// moment it runs, and a section caught mid fade-in reports the transient value — one pass here
// produced fifty contrast "failures" at ratios like 1.05:1, every one of them an element whose
// opacity was still animating. Reduced motion is also what print, `prefers-reduced-motion` and a
// reader with JavaScript off get, so it is the state worth holding to WCAG AA.
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const failures = [];
let axeChecked = 0;

for (const route of ROUTES) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).split("\n")[0].slice(0, 120)));

  const response = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 180_000 });
  // Materialise every section: content-visibility skips layout for what is off-screen, and a
  // figure that never lays out is a figure this sweep never sees.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 900) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 20));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);

  const found = await page.evaluate(() => {
    const text = document.body.innerText;
    const zeros = [...text.matchAll(/(?<![0-9.])0\.0%/g)].some(
      (m) => !/draws above/.test(text.slice(Math.max(0, m.index - 70), m.index))
    );
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      placeholder: /Malformed figure fence|is not in the figure registry/.test(text),
      zeroed: zeros || /KSh0\.00bn|≈0k/.test(text),
    };
  });

  const problems = [];
  if (response.status() !== 200) problems.push(`HTTP ${response.status()}`);
  if (found.overflow > 0) problems.push(`${found.overflow}px sideways scroll`);
  if (found.placeholder) problems.push("figure placeholder rendered");
  if (found.zeroed) problems.push("a figure reads zero");
  if (errors.length) problems.push(`page error: ${errors[0]}`);

  if (AxeBuilder) {
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    axeChecked++;
    for (const v of violations) {
      problems.push(`axe ${v.id} (${v.impact}) ×${v.nodes.length}: ${v.help}`);
    }
  }

  if (problems.length) failures.push({ route, problems });
  await page.close();
}
await browser.close();

if (failures.length) {
  console.error(`\nROUTE AUDIT FAILED — ${failures.length} of ${ROUTES.length} route(s):\n`);
  for (const f of failures) {
    console.error(`  ${f.route}`);
    for (const p of f.problems) console.error(`    • ${p}`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  `Route audit passed: ${ROUTES.length} routes — 200, no sideways scroll at 390px, no figure ` +
    `placeholders, no zeroed figures, no page errors` +
    (AxeBuilder ? `, and no axe violations on ${axeChecked} of them.` : ". axe not installed — accessibility not checked.")
);
