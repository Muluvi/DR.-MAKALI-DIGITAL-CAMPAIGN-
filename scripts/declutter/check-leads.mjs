#!/usr/bin/env node
/**
 * Checks 6 and 7 (brief 2026-10 declutter, section 10): leads are extractive, and hedges survive.
 *
 *   6  Every {{token}} in a ```lead appears in that section's text (its prose and the text moved into
 *      its visuals). Every word of five or more letters in the lead appears there too; up to two
 *      that do not are allowed and printed for review. No lead is longer than 45 words.
 *   7  For each lead, the section's sentences that share most words with it are found; any hedge
 *      word (brief section 2, rule 3) in those sentences must appear in the lead.
 *
 *     node scripts/declutter/check-leads.mjs
 */
import { nowFiles, readNow, sectionsOf, partsOf, reachableText, words } from "./sections.mjs";

const HEDGES = [
  "reported", "not confirmed", "unconfirmed", "hypothesis", "working hypothesis", "modelled", "derived", "estimate",
  "CALC", "not a forecast", "to be cited", "to be confirmed", "pending", "awaiting", "Tier 2", "Tier 3",
  "not yet tiered", "media report", "single-source",
];
const errors = [];
const review = [];
let leads = 0;

const lc = (s) => s.toLowerCase();
const longWords = (s) => [...new Set((s.replace(/\{\{[^}]*\}\}/g, " ").match(/[A-Za-z][A-Za-z'’-]{4,}/g) ?? []).map(lc))];
const sentences = (s) =>
  s
    .replace(/\{\{[^}]*\}\}/g, (t) => t.replace(/\./g, "·"))
    .split(/(?<=[.!?])\s+|\n\s*\n|\n\s*[-*]\s+/)
    .map((x) => x.replace(/·/g, ".").trim())
    .filter(Boolean);

for (const f of nowFiles()) {
  for (const sec of sectionsOf(f, readNow(f))) {
    const parts = partsOf(sec.lines);
    if (!parts.leads.length) continue;
    const text = reachableText(sec.lines);
    const textLc = lc(text);
    for (const lead of parts.leads) {
      leads += 1;
      const where = `${sec.key}`;
      const n = words(lead);
      if (n > 45) errors.push(`6: ${where}: lead is ${n} words (at most 45)`);
      for (const t of lead.match(/\{\{[^}]*\}\}/g) ?? []) if (!text.includes(t)) errors.push(`6: ${where}: token ${t} is not in the section`);
      const foreign = longWords(lead).filter((w) => !textLc.includes(w));
      if (foreign.length > 2) errors.push(`6: ${where}: ${foreign.length} words not in the section: ${foreign.join(", ")}`);
      else if (foreign.length) review.push(`${where}: ${foreign.join(", ")}`);

      // 7: the sentences the lead draws on.
      const leadWords = new Set(longWords(lead));
      const scored = sentences(text)
        .map((s) => ({ s, score: longWords(s).filter((w) => leadWords.has(w)).length }))
        .filter((x) => x.score >= 2)
        .sort((a, b) => b.score - a.score);
      const leadSentences = sentences(lead);
      // Each sentence of the lead is matched to the section sentence that shares most with it.
      const sources = new Set();
      for (const ls of leadSentences) {
        const lw = new Set(longWords(ls));
        const best = sentences(text)
          .map((s) => ({ s, score: longWords(s).filter((w) => lw.has(w)).length }))
          .sort((a, b) => b.score - a.score)[0];
        if (best && best.score >= 2) sources.add(best.s);
      }
      if (!sources.size && scored[0]) sources.add(scored[0].s);
      for (const src of sources) {
        for (const h of HEDGES) {
          const re = new RegExp(`\\b${h.replace(/[-]/g, "[- ]")}\\b`, "i");
          if (re.test(src) && !re.test(lead)) errors.push(`7: ${where}: the lead drops the hedge "${h}" from: "${src.slice(0, 110)}…"`);
        }
      }
    }
  }
}

if (review.length) {
  console.log("Words in a lead that are not in its section (allowed, up to two each):");
  for (const r of review) console.log("   " + r);
}
if (errors.length) {
  console.log(`\ncheck-leads: FAILED (${leads} leads)`);
  for (const e of errors) console.log("  - " + e);
  process.exit(1);
}
console.log(`\ncheck-leads: ${leads} leads are extractive, at most 45 words, and keep their hedges`);
