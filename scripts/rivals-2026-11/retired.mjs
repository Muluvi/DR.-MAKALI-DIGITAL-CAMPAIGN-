/**
 * What the rivals pass retired, for the guards that would otherwise read its removals as losses.
 *
 * The pass (November 2026, docs/rivals-2026-11/DECISION.md) is Firefly's decision: no 2027 rival is
 * named, profiled, compared or monitored on the site, and the attack-response material is removed.
 * Results of past elections stay, with the candidates' names. Every guard that protects content from
 * quiet deletion (check-content, the preservation checks, the rewrite --check runs, the token check,
 * the protected-file manifest) consults this module, and excuses a missing item ONLY when it is in
 * what the pass recorded as removed:
 *
 *   - a file listed in docs/rivals-2026-11/removed-files.json (its text is read from RIVALS_BASE);
 *   - text logged as removed in docs/rivals-2026-11/ledger.json.
 *
 * Nothing outside that record is excused, so a later deletion still fails exactly as before.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const RIVALS_BASE = "d034eb1";
const DIR = path.join(ROOT, "docs", "rivals-2026-11");
const readJson = (f, d) => (fs.existsSync(path.join(DIR, f)) ? JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) : d);

/** Repository paths the pass removed. */
export const REMOVED_FILES = new Set(readJson("removed-files.json", { files: [] }).files);

const baseText = (rel) => {
  try {
    return execFileSync("git", ["show", `${RIVALS_BASE}:${rel}`], { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return "";
  }
};

let corpus = null;
/** Every word the pass removed: the logged text, and the removed files as they stood at its base. */
export function retiredText() {
  if (corpus !== null) return corpus;
  const ledger = readJson("ledger.json", []);
  corpus = [...ledger.map((e) => e.text ?? ""), ...[...REMOVED_FILES].map(baseText)].join("\n");
  return corpus;
}

const squash = (s) => s.replace(/\s+/g, " ").trim();
let squashed = null;

/** True when `text` (whitespace-insensitive) sits wholly inside what the pass removed. */
export function isRetiredText(text) {
  if (!text || !text.trim()) return false;
  if (squashed === null) squashed = squash(retiredText());
  return squashed.includes(squash(text));
}

/** True when the file was removed by the pass. */
export const isRetiredFile = (rel) => REMOVED_FILES.has(rel.replace(/^\.\//, ""));

/**
 * True when `text` was in place in `rel` at the pass's base and the pass has since changed that
 * file: an earlier pass's rewrite was applied, then the rivals pass edited the result (a row or a
 * clause about rivals or attack response taken out of it). The earlier rewrite is superseded, not
 * undone; check:content weighs the words themselves against the pass's ledger.
 */
export function isSupersededAtBase(rel, text) {
  const base = baseText(rel);
  if (!base || !base.includes(text)) return false;
  const now = fs.existsSync(path.join(ROOT, rel)) ? fs.readFileSync(path.join(ROOT, rel), "utf8") : "";
  return now !== base && !now.includes(text);
}
