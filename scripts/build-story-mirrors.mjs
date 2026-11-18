/**
 * The three tables the story's interactive visuals read, taken straight from the text so they can
 * never drift from it (story integration, November 2026):
 *
 *   glossary      content/annex-terms.md, H.1 "Terms used in this proposal"
 *   raci          content/engagement.md, 13.2 "Who does what, in one table"
 *   deliverables  content/receives.md, 21.2 "The deliverables schedule"
 *   workstreams   content/workstreams.md, the fourteen workstream headings
 *   contact       content/cover.md, Firefly's phone and email
 *
 * Writes lib/story/mirrors.generated.json. With --check, fails if that file is stale.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "lib", "story", "mirrors.generated.json");
const read = (f) => fs.readFileSync(path.join(ROOT, "content", f), "utf8");
const plain = (s) => s.replace(/\*\*/g, "").replace(/\*([^*\s][^*]*?)\*/g, "$1").trim();

/** The first pipe table after `marker` in `text`, as rows of cells (header row included). */
function tableAfter(text, marker) {
  const at = text.indexOf(marker);
  if (at < 0) throw new Error(`build-story-mirrors: "${marker}" not found`);
  const lines = text.slice(at).split("\n");
  const start = lines.findIndex((l) => l.startsWith("|"));
  const rows = [];
  for (const l of lines.slice(start)) {
    if (!l.startsWith("|")) break;
    if (/^\|\s*-/.test(l)) continue;
    rows.push(l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  }
  return rows;
}

const terms = tableAfter(read("annex-terms.md"), "## H.1 ").slice(1).map(([t, d]) => ({ term: plain(t), text: plain(d) }));

const [rhead, ...rrows] = tableAfter(read("engagement.md"), "#### Who does what, in one table");
const roles = rhead.slice(1).map(plain);
const raci = { roles, rows: rrows.map(([a, ...cells]) => ({ activity: plain(a), cells: cells.map(plain) })) };

const deliverables = tableAfter(read("receives.md"), "## 21.2 ").slice(1).map(([d, cadence, by, form, where]) => ({
  deliverable: plain(d), cadence: plain(cadence), by: plain(by), form: plain(form),
  // The column links the headings that set each row: their words, and the first one's id.
  where: plain(where).replace(/\[([^\]]+)\]\([^)]*\)/g, "$1"),
  whereId: /\]\(\/#([^)]+)\)/.exec(where)?.[1] ?? null,
}));

// The fourteen workstreams, from their headings, with the group each belongs to.
const ws = read("workstreams.md");
const groups = [...ws.matchAll(/^## (15\.\d) (.+)$/gm)].map((m) => ({ number: m[1], title: m[2].replace(/\s*\(workstreams [^)]*\)\s*$/, "") }));
const workstreams = [...ws.matchAll(/^### (15\.\d\.\d) Workstream (\d+) — (.+)$/gm)].map((m) => ({
  id: `workstreams-sec-${m[1].replace(/\./g, "-")}`, number: Number(m[2]), title: m[3].trim(), group: m[1].split(".").slice(0, 2).join("."),
}));

// Firefly's contact line on the cover, so the call and WhatsApp buttons use the number printed there.
const cover = read("cover.md");
const phone = cover.match(/·\s*(0\d{3} \d{3} \d{3})/)?.[1];
const email = cover.match(/([\w.+-]+@[\w-]+\.[\w.]+)\s*·/)?.[1];
if (!phone || !email) throw new Error("build-story-mirrors: the cover's contact line was not found");
const contact = { phone, email, intl: `254${phone.replace(/\s/g, "").slice(1)}` };

const json = JSON.stringify({ terms, raci, deliverables, groups, workstreams, contact }, null, 2) + "\n";
if (process.argv.includes("--check")) {
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (now !== json) { console.error("build-story-mirrors: lib/story/mirrors.generated.json is stale. Run: node scripts/build-story-mirrors.mjs"); process.exit(1); }
  console.log(`build-story-mirrors: ${terms.length} terms, ${raci.rows.length} RACI rows, ${deliverables.length} deliverables match the text.`);
} else {
  fs.writeFileSync(OUT, json);
  console.log(`build-story-mirrors: wrote ${terms.length} terms, ${raci.rows.length} RACI rows, ${deliverables.length} deliverables.`);
}
