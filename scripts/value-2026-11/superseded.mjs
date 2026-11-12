/**
 * Text an earlier pass wrote that a later pass has since reworded, logged.
 *
 * Each earlier pass's --check (scripts/toc-2026-11/content-fixes.mjs, scripts/ownership-2026-11/
 * apply.mjs) fails when the words it wrote are no longer in the file. When a later, logged pass
 * rewrote those words, that is not a regression: this returns true when the earlier pass's words,
 * with every later rewrite of the same file applied to them, are what the file now holds. Anything
 * else (a lost rewrite, an unlogged edit) still fails.
 */
import { REWRITES as VALUE_2026_11 } from "./content-fixes.mjs";

/** Later passes, oldest first. */
const LATER = [...VALUE_2026_11];

export function superseded(file, written, text) {
  // The earlier words sat inside a larger passage a later pass replaced whole, and that replacement is in place.
  if (LATER.some((r) => r.f === file && r.from && r.from.includes(written) && r.from !== written && text.includes(r.to))) return true;
  const later = LATER.filter((r) => r.f === file && r.from && written.includes(r.from));
  if (!later.length) return false;
  const now = later.reduce((t, r) => t.split(r.from).join(r.to), written);
  return now !== written && text.includes(now);
}
