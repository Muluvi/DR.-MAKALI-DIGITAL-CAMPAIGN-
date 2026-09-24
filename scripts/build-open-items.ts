/**
 * Every open item in the proposal, generated, never typed (brief §N fig-3-10-gaps and fig-6-2-open-items).
 *
 * Reads three places, so nothing marked open can be missing from the tables that list what is open:
 *   1. every `[DATA NEEDED …]` and `[CONFIRM/EDIT …]` marker in the resolved content (public/content)
 *   2. every figure in lib/data/figures.ts whose state is `needed`
 *   3. every row of a register spec marked `needed` (except the two tables this file feeds)
 *
 * Items with the same closing document are merged, keeping every section they appear in. Writes
 * lib/register/generated/open-items.json.   --check fails if the file on disk is stale.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FIGURES } from "../lib/data/figures.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");
const OUT = path.join(ROOT, "lib", "register", "generated", "open-items.json");
const CHECK = process.argv.includes("--check");
const SELF = new Set(["fig-3-10-gaps", "fig-6-2-open-items"]);

export interface OpenItem {
  kind: "data" | "confirm" | "placeholder";
  gap: string;
  closes: string;
  holder: string;
  status: "Open";
  where: string[];
}

/** Who holds the closing document: read off the document's own name, first match wins. */
const HOLDERS: [RegExp, string][] = [
  [/IEBC/, "IEBC"],
  [/Meta|Insights|Week 1|post coding|export/i, "His team: the Week 1 export"],
  [/Wiper|party|pollster|NEC/i, "Wiper Patriotic Front secretariat"],
  [/Communications Authority|CA\/KNBS/, "Communications Authority"],
  [/KNBS/, "KNBS"],
  [/TSC|Public Service Board|Ministry of Health/, "Public-sector employers"],
  [/GeoPoll|KARF|listenership/i, "Audience-research publishers"],
  [/Central Bank|Safaricom/, "Central Bank of Kenya or Safaricom"],
  [/NTSA|transport/i, "NTSA or the county transport department"],
  [/NG-CDF/, "NG-CDF Kitui Central"],
  [/county|diocesan|denominational/i, "County government or church offices"],
  [/public/i, "Public pages, Week 1 audit"],
];
const holderOf = (doc: string) => HOLDERS.find(([re]) => re.test(doc))?.[1] ?? "To be named";

const clean = (s: string) =>
  s.replace(/`/g, "").replace(/\*\*|__|\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();

/** The sentence around a marker, without the marker, as the description of what is missing. */
function sentenceAround(line: string, at: number): string {
  const before = line.slice(0, at);
  const cut = Math.max(before.lastIndexOf(". "), before.lastIndexOf("| "), before.lastIndexOf("* "));
  const start = cut === -1 ? 0 : cut + 2;
  const rest = line.slice(at);
  const endRel = rest.search(/\.\s|\s\||$/);
  let s = clean((line.slice(Math.max(0, start), at) + rest.slice(0, endRel)).replace(/\[(DATA NEEDED|CONFIRM\/EDIT|CAMPAIGN DECISION REQUIRED|VERIFIED FIGURE REQUIRED|KIKAMBA REVIEW NEEDED|CONFIRM|Insert)[^\]]*\]/g, ""));
  s = s.replace(/[\s:;,.(—-]+$/, "").replace(/^[\s:;,.)—-]+/, "");
  if (s.length > 140) s = s.slice(0, 137).replace(/\s\S*$/, "") + "…";
  return s || "Not stated";
}

const items = new Map<string, OpenItem>();
function add(kind: OpenItem["kind"], gap: string, closes: string, where: string, byGap = false) {
  // A figure row whose document is already listed from the text joins that item.
  if (byGap && kind !== "placeholder") {
    const same = [...items.values()].find((i) => i.kind === kind && i.closes.toLowerCase() === closes.toLowerCase() && !i.where.every((w) => w.startsWith("Figure")));
    if (same) {
      if (!same.where.includes(where)) same.where.push(where);
      return;
    }
  }
  const key = byGap || kind !== "data" || closes === "To be named" ? `${kind}|${gap.toLowerCase()}` : `${kind}|${closes.toLowerCase()}`;
  const it = items.get(key);
  if (it) {
    if (!it.where.includes(where)) it.where.push(where);
    return;
  }
  items.set(key, { kind, gap, closes, holder: kind === "data" ? holderOf(closes) : closes === "Kikamba reviewer" ? "Kikamba reviewer" : "The campaign", status: "Open", where: [where] });
}

// 1. content markers. Read per file as one string, so a marker that wraps across lines is caught.
// A bare marker quoted to describe the convention itself ("is marked `[DATA NEEDED]` with…") is not
// a gap, and is skipped by the three phrasings the document uses for that.
const MARK = /\[(DATA NEEDED|CONFIRM\/EDIT|CAMPAIGN DECISION REQUIRED|VERIFIED FIGURE REQUIRED|KIKAMBA REVIEW NEEDED|CONFIRM|Insert)(?:\s*—\s*([^\]]+)|\s+([^\]]+))?\]/g;
const CONVENTION = /(marked|rest|reads)\s+`$/;
for (const file of fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md")).sort()) {
  const text = fs.readFileSync(path.join(CONTENT, file), "utf8").replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, " "));
  const heads = [...text.matchAll(/^#{2,4}\s+([0-9A-G][0-9.]*)\s+(.+)$/gm)].map((h) => ({ at: h.index ?? 0, num: h[1], title: clean(h[2]) }));
  for (const m of text.matchAll(MARK)) {
    const at = m.index ?? 0;
    if (!m[2] && CONVENTION.test(text.slice(Math.max(0, at - 12), at))) continue;
    const head = [...heads].reverse().find((h) => h.at < at);
    const where = `Section ${head?.num ?? file.replace(/\.md$/, "")}`;
    const lineStart = text.lastIndexOf("\n", at) + 1;
    const lineEnd = text.indexOf("\n", at + m[0].length);
    const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    const raw = m[2] ?? m[3];
    const body = raw ? clean(raw.replace(/\n>\s?/g, " ")).replace(/\.$/, "") : "";
    if (m[1] !== "DATA NEEDED" && m[1] !== "CONFIRM/EDIT") {
      // The document's other placeholders: a decision, a review, or a value to insert at contracting.
      const around = sentenceAround(line, at - lineStart);
      const detail = body || (around === "Not stated" && head ? head.title : around);
      const what = m[1] === "Insert" ? `To insert: ${detail}` : `${m[1].charAt(0)}${m[1].slice(1).toLowerCase()}: ${detail}`;
      add("placeholder", what.length > 160 ? what.slice(0, 157).replace(/\s\S*$/, "") + "…" : what, m[1] === "KIKAMBA REVIEW NEEDED" ? "Kikamba reviewer" : m[1] === "Insert" ? "At contracting" : "Campaign decision", where, true);
      continue;
    }
    if (m[1] === "CONFIRM/EDIT") {
      const gap = body || sentenceAround(line, at - lineStart);
      add("confirm", gap.length > 160 ? gap.slice(0, 157).replace(/\s\S*$/, "") + "…" : gap, "Campaign decision", where);
      continue;
    }
    let gap: string, closes: string;
    const semi = body.indexOf(";");
    if (semi > 0) {
      gap = body.slice(0, semi).trim();
      closes = body.slice(semi + 1).trim();
    } else if (/^[a-z]/.test(body) && body.includes(", ") && body.length <= 70) {
      // "health insurance coverage, KNBS county bulletin": what is missing, then the document.
      gap = body.slice(0, body.indexOf(", "));
      closes = body.slice(body.indexOf(", ") + 2);
    } else {
      closes = body || "To be named";
      gap = sentenceAround(line, at - lineStart);
      if (gap.length < 24 || !/^[A-Z"“]/.test(gap)) gap = head ? head.title : gap;
    }
    add("data", gap.charAt(0).toUpperCase() + gap.slice(1), closes, where);
  }
}

// 2. figures with no value
for (const f of Object.values(FIGURES)) {
  if (f.state === "needed") add("data", clean(f.note ?? f.id), f.closesWith ?? "To be named", `Data layer: ${f.id}`);
}

// 3. register rows marked needed (imported late so a stale JSON cannot break the import order)
const { REGISTER_ORDER } = await import("../lib/register/specs/index.ts");
for (const spec of REGISTER_ORDER) {
  if (SELF.has(spec.id)) continue;
  for (const r of spec.rows) {
    if (r.state !== "needed") continue;
    const first = String(Object.values(r.cells)[0] ?? spec.title);
    const missing = spec.columns.filter((c) => c.key in r.cells && r.cells[c.key] === null).map((c) => c.label.toLowerCase());
    add("data", clean(missing.length ? `${first}: ${missing.join(", ")}` : first), r.closesWith ?? "To be named", `Figure ${spec.id}`, true);
  }
}

// The same gap reached two ways ("listenership by station; GeoPoll or KARF" in one section, bare
// "listenership by station" in another) is one item: fold an item whose document names another's gap.
for (const [key, it] of [...items]) {
  if (it.kind !== "data") continue;
  const twin = [...items.values()].find((o) => o !== it && o.kind === "data" && o.gap.toLowerCase() === it.closes.toLowerCase());
  if (!twin) continue;
  for (const w of it.where) if (!twin.where.includes(w)) twin.where.push(w);
  items.delete(key);
}

const ORDER = { data: 0, confirm: 1, placeholder: 2 };
const list = [...items.values()].sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);
const body = JSON.stringify(list, null, 2) + "\n";

if (CHECK) {
  if (!fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== body) {
    console.error("build-open-items: lib/register/generated/open-items.json is stale — run `npm run content`");
    process.exit(1);
  }
  console.log(`build-open-items: ${list.length} open items current`);
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, body);
  console.log(`build-open-items: ${list.filter((i) => i.kind === "data").length} data gaps, ${list.filter((i) => i.kind === "confirm").length} to confirm, ${list.filter((i) => i.kind === "placeholder").length} placeholders`);
}
