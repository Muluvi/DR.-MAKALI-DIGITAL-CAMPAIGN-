/**
 * The listed rewrites of the pre-launch pass (scripts/prelaunch-2026-11/apply.mjs), by section of
 * the brief. Each: { f, from, to, all?, kind?: "moved", dest?, note? }. A "moved" rewrite takes the
 * text out of its chapter; the rewrite that sets it down in Evidence and sources is `unlogged`,
 * because the move's own entry already weighs it at its destination.
 */
import fs from "node:fs";

/** Section 2: generated from the exact source text, and kept as data so no quote is mis-escaped. */
const S2 = JSON.parse(fs.readFileSync(new URL("./rewrites-s2.json", import.meta.url), "utf8"));
/** Section 3: the tier words in running prose, reworded one by one (the parenthesised tags are generated, tiers.mjs). */
const S3 = JSON.parse(fs.readFileSync(new URL("./rewrites-s3.json", import.meta.url), "utf8"));
/** Section 5: copy that promised editing, live records or a change log while team sign-in is off. */
const S5 = JSON.parse(fs.readFileSync(new URL("./rewrites-s5.json", import.meta.url), "utf8"));
/** Section 8: the Kikamba review label. */
const S8 = JSON.parse(fs.readFileSync(new URL("./rewrites-s8.json", import.meta.url), "utf8"));

const REFS_GLOSS = "Pre-launch pass, section 1 (docs/prelaunch-2026-11): the gloss after a numbered reference repeated the heading's own words once the reference became a link carrying them, so it goes.";

const REFS_NUM = "Pre-launch pass, section 1 (docs/prelaunch-2026-11): a bare section number becomes a link that carries the heading's own words.";

const REFS_PLAIN = "Pre-launch pass, section 1 (docs/prelaunch-2026-11): this field is drawn as plain text, so the reference is named in words rather than linked; the phase field's reference pointed at its own section and goes.";

export const REWRITES = [
  // 1. A gloss that now repeats the link it followed
  { f: "content/goal.md", from: "[Where the effort goes](/#channels-sec-12-1) (where the effort goes) and", to: "[Where the effort goes](/#channels-sec-12-1) and", note: REFS_GLOSS },
  { f: "content/goal.md", from: "[Which channel does which job](/#channels-sec-12-2) (which channel does which job) and", to: "[Which channel does which job](/#channels-sec-12-2) and", note: REFS_GLOSS },
  // 1. The target ladder's "Where it is set" fields opened with a bare section number
  { f: "content/timeline.md", from: '"Where it is set", text: "21.1: ~', to: '"Where it is set", text: "[The three scope levels, compared](/#receives-sec-21-1): ~', note: REFS_NUM },
  { f: "content/timeline.md", from: '"text": "15.3.3: {{target.sms}} by Phase 3"', to: '"text": "[What your team operates: SMS, USSD and voice](/#workstreams-sec-15-3-3): {{target.sms}} by Phase 3"', note: REFS_NUM },
  { f: "content/timeline.md", from: '"Where it is set", text: "18.2 GE-01: {{target.pledged-voters}} target"', to: '"Where it is set", text: "[Scorecards for each stage](/#success-sec-18-2), GE-01: {{target.pledged-voters}} target"', note: REFS_NUM },
  { f: "content/timeline.md", from: '"text": "8.2.4: {{target.supporters}} target"', to: '"text": "[Give every post a voter, ward and reason](/#goal-sec-8-2-4): {{target.supporters}} target"', note: REFS_NUM },
  // 1. Two visual fields the renderer draws as plain text, where a link would show its markdown
  { f: "content/timeline.md", from: 'when: "Phase 0 (Weeks 4–10 from the go-ahead, [Phase 0: instrumentation](/#timeline-sec-14-2))"', to: 'when: "Phase 0 (Weeks 4–10 from the go-ahead)"', note: REFS_PLAIN },
  { f: "content/timeline.md", from: 'label: "Community organisers (volunteer Tier 3, [the volunteer programme reference](/#workstreams-sec-d-1)) recruited from cooperative networks"', to: 'label: "Community organisers (volunteer Tier 3; see the volunteer programme reference) recruited from cooperative networks"', note: REFS_PLAIN },
  // 2. Draft history, moved word for word to Source notes and corrections (Evidence and sources)
  ...S2,
  // 2. A figure note's draft history (lib/data/figures.ts, water.safe.2019), kept with the chapter's other notes
  { f: "content/annex-evidence.md", from: "No verified figure is available yet for its number of priority sectors: an earlier draft said 16, led by agriculture, water, health, education and roads, and the record that would settle it is the plan itself.\n", to: "No verified figure is available yet for its number of priority sectors: an earlier draft said 16, led by agriculture, water, health, education and roads, and the record that would settle it is the plan itself.\n\nSafe drinking water: households with safe drinking water are 38.5% on the census definition. An earlier draft's 53.2% likely used a different definition and is not used.\n", unlogged: true },
  // 3. Tier words in running prose
  ...S3,
  // 5. Copy that follows the sign-in switch
  ...S5,
  // 8. The Kikamba phrases' label
  ...S8,
];
