/**
 * Writes public/data/<id>.csv for every figure in the register, and public/data/index.json listing
 * them in document order (brief §O: CSV emitted statically at build; no API route).
 *
 * The CSV is written from the same spec rows the figure's table view prints, so the chart, the
 * table and the download cannot disagree. A named gap is written as its [DATA NEEDED] text, never
 * as an empty cell or a zero.
 *
 *   --check   fail if any file on disk differs from what would be written (used by `npm run verify`)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REGISTER_ORDER } from "../lib/register/specs/index.ts";
import type { Cell, FigureSpec } from "../lib/register/types.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "data");
const CHECK = process.argv.includes("--check");

const BASIS = { sourced: "Sourced", modelled: "Modelled", needed: "Data needed", target: "Target" } as const;

function cell(v: Cell, closesWith?: string): string {
  if (v === null) return `[DATA NEEDED — ${closesWith ?? "source"}]`;
  return String(v);
}

function quote(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csv(spec: FigureSpec): string {
  const head = [...spec.columns.map((c) => c.label), "Basis"];
  const lines = [head.map(quote).join(",")];
  for (const r of spec.rows) {
    lines.push([...spec.columns.map((c) => cell(c.key in r.cells ? r.cells[c.key] : "", r.closesWith)), BASIS[r.state ?? "sourced"]].map(quote).join(","));
  }
  return lines.join("\n") + "\n";
}

const files: Record<string, string> = {};
for (const spec of REGISTER_ORDER) files[`${spec.id}.csv`] = csv(spec);
files["index.json"] = JSON.stringify(
  REGISTER_ORDER.map((s) => ({ id: s.id, section: s.section, title: s.title, question: s.question, takeaway: s.takeaway })),
  null,
  2,
) + "\n";

const ids = new Set<string>();
for (const s of REGISTER_ORDER) {
  if (ids.has(s.id)) throw new Error(`build-csv: duplicate register id ${s.id}`);
  ids.add(s.id);
}

if (CHECK) {
  const stale = Object.entries(files).filter(([f, body]) => {
    const p = path.join(OUT, f);
    return !fs.existsSync(p) || fs.readFileSync(p, "utf8") !== body;
  });
  if (stale.length) {
    console.error(`build-csv: ${stale.length} file(s) stale — run \`npm run content\``);
    for (const [f] of stale) console.error(`  - public/data/${f}`);
    process.exit(1);
  }
  console.log(`build-csv: ${REGISTER_ORDER.length} figure CSVs current`);
} else {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [f, body] of Object.entries(files)) fs.writeFileSync(path.join(OUT, f), body);
  console.log(`build-csv: wrote ${REGISTER_ORDER.length} figure CSVs and index.json to public/data/`);
}
