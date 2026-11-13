# 06 — Implementation plan (Phase 6)

Ten commits, in dependency order. Build runs after each. No commit leaves the tree red.

**Real script names** (from `package.json`, not assumed): `npm ci` · `npm run build` (runs
`prebuild` = `verify-ward-register.mjs` + `verify-figures.mjs`, and typechecks) · `npm run lint`
· `npm run verify` · `npx tsc --noEmit`. **There is no `typecheck` script and no bun.**

---

## A defect found while planning, which changes the plan

`components/markdown/HighlightedText.tsx:122` gates cross-reference linking on

```js
const crossRefMatch = /^Section\s+(22\.14|29\.1|31\.1|31\.7)$/i.exec(part);
```

**None of those four numbers exist anywhere in the content** (verified: 0 occurrences). The
broad `crossRefPattern` splits every "Section N.N" out of the text, and then this narrow regex
rejects all 173 of them, so they render as plain text. `crossSectionTarget()` — which resolves
them correctly — is effectively dead code. The four numbers are survivors of the previous
renumbering.

Consequence for this restructure: there is no working link behaviour to preserve, but the need
for one goes *up*, because after the move most references cross a part boundary. Fixing it is
in scope — it is the "re-routing" half of "moving and re-routing content", and it traces to a
fault documented in Phase 1 (§2.3 of the audit), not to taste. It is commit 4.

---

## Route and file structure

**Single route retained.** `/` stays the only page. Reasons: fragment-only deep links cannot be
server-redirected (Phase 0 §2), the 413-entry legacy map has no route-aware equivalent that is
cheaper than keeping it, and per-part routes would force every one of the ~262 in-document
anchors to carry a path as well as a fragment. Per-part routes are a separate proposal; the
restructure does not require them and would be riskier with them.

**Nine content files replace ten**, matching the five parts with Part 4's five parallel tracks
as sibling files:

| New file | `git mv` from | Rationale for the rename source |
|---|---|---|
| `1-decision.md` | `9-ask.md` | Largest contributor (4,023 of ~6,200 words). Best rename detection. |
| `2-evidence.md` | `1-race.md` | 8,449 of ~14,500. |
| `3-strategy.md` | `2-argument.md` | ~4,700 of ~7,600. |
| `4a-publishing.md` | `3-channels.md` | ~4,000 of ~6,900. |
| `4b-ground.md` | `4-ground.md` | Whole file. |
| `4c-defence.md` | `5-defence.md` | Whole file. |
| `4d-technology.md` | `6-data.md` | ~4,100 of ~4,800. |
| `4e-team.md` | `7-team.md` | §7.2 + §7.3; §7.1 leaves. |
| `5-delivery.md` | `8-measure.md` | ~3,750 of ~4,300. |
| — | `0-overview.md` | **Dissolved.** Its four sections split three ways (§0.1–.3 → `1-decision.md`, §0.4 → `5-delivery.md`). `git rm` only after every section has been moved out and the file is empty. A dissolved file is not a relocation, so Ground Rule 6 does not apply; `git log -M -C` still traces the lines. |

Every other move is a **section move between files**, executed as a scripted extraction so that
byte content is preserved exactly (see commit 2).

---

## The commits

### Commit 1 — `refactor(content): rename part files to the new spine`
Nine `git mv`s, no content change. Update the `FILES` map in `app/page.tsx` and the `SECTIONS`
array in `lib/heading-slug.ts` (ids, numbers, labels, blurbs) so the build still resolves.
Old tab ids (`overview`, `race`, …) become new ones (`decision`, `evidence`, `strategy`,
`publishing`, `ground`, `defence`, `technology`, `team`, `delivery`).

*Breaks:* every `HEADING_INSERTS` key, every hardcoded id, every legacy id. Fixed in commits 3–5.
*Build after:* expected green — components silently unmount but nothing throws. **This is the
dangerous property of this codebase and the reason for commit 6.**

### Commit 2 — `refactor(content): move sections to their target parts`
The 31 MOVED, 9 PROMOTED, 2 SPLIT, 1 DEMOTED rows of the migration map, executed by a script
that:
1. parses each source file into `##`-delimited section blocks (same fence-aware parser as
   `lib/section-index.ts`, so the split points agree with the index);
2. writes each block, **byte-for-byte**, into its destination file in the Phase 4 order;
3. asserts total word count and total byte count are unchanged across the whole corpus before
   writing anything.

The script lives in `scripts/` for the duration of the commit and is removed in commit 10; the
plan is not to keep a migration tool in the repo.

*Verification in-commit:* `npm run verify` (both build guards) plus the word/byte assertion.

### Commit 3 — `fix(viewer): repoint component mounts at the new section ids`
Rewrite all 38 `HEADING_INSERTS` keys in `components/MarkdownViewer.tsx` — same slugs, new tab
prefixes (`race-sec-1-2-3` → `evidence-sec-1-2-3`, `ask-sec-9-2-5` → `decision-sec-9-2-5`, and
so on). `MediaOwnershipBlock` at `3-4-1` moves to the `evidence` prefix with the §3.4 split.

Then the five `tabId`-keyed behaviours, which no id rewrite catches:

| Site | Now | Becomes |
|---|---|---|
| `MarkdownViewer:320` `PlatformSizingBlock` | `tabId === "race"` | `tabId === "evidence"` |
| `MarkdownViewer:326` `ClaimCards` | `tabId === "race"` | `tabId === "evidence"` |
| `MarkdownViewer:334` `MizaniSlopeBlock` | `tabId === "overview"` | `tabId === "decision"` |
| `MarkdownViewer:408` governing-reality emphasis | `tabId === "overview"` | `tabId === "decision"` |
| `MarkdownViewer:473` closing-section fold carve-out | `isClosingSection: tabId === "ask"` | `tabId === "decision"` — **the ask now closes Part 1, not the document.** The rule "the ask is never folded" must follow the ask. |
| `MarkdownViewer:526` `DecisionPanel` | `tabId === "ask"` | `tabId === "decision"` |

### Commit 4 — `fix(viewer): resolve in-prose cross-references against the built index`
Replaces leading-digit resolution, which cannot survive sections changing file.

- `buildSectionIndex()` additionally returns a `numberToId` map (`"6.5.4" → "strategy-sec-6-5-4"`),
  derived from the same headings, so it cannot disagree with the document.
- The map is threaded from `app/page.tsx` (server) into `MarkdownViewer`, which already receives
  `tabId`, and reaches `HighlightedText` the same way.
- `crossSectionTarget()` becomes a lookup in that map. The leading-digit `TAB_BY_NUMBER` path is
  deleted — it is the assumption "section number implies file" that this restructure breaks.
- **The dead four-number regex at `HighlightedText.tsx:122` is replaced** by the broad
  `crossRefPattern` the surrounding code already computes, so all 173 references resolve. The
  self-link suppression (don't link a reference to the section you are already in) is kept.

*Net:* not one word of prose changes; every "Section N.N" the author wrote becomes a working
link to wherever that section now lives.

### Commit 5 — `fix(nav): regenerate the legacy deep-link map`
Fragment-only links cannot be redirected server-side, so `LEGACY_IDS` in `lib/heading-slug.ts`
remains the mechanism.

- **Generate, do not hand-write.** A script reads the pre-move section index (from
  `git show HEAD~4:…`) and the post-move index, and emits `oldId → newId` for every one of the
  ~262 current ids.
- The existing **413 legacy entries are re-pointed, not dropped** — each currently maps to an id
  whose tab prefix is about to change, so every value is rewritten through the new map. An entry
  whose target no longer resolves is dropped and listed in the commit message.
- `TAB_ALIASES` gains the nine old→new tab names, so a bare `#race-sec-1-3-2` from a shared link
  still lands.
- **Verification is mechanical, not by inspection:** a script asserts every key in `LEGACY_IDS`
  and every historical id resolves, via `resolveLegacySectionId`, to a member of the live section
  index. This is the Phase 8 deep-link check and it runs here first.

### Commit 6 — `test(build): fail the build on an orphaned component mount`
The codebase's worst property is that a wrong `HEADING_INSERTS` key removes a component with no
error. `MarkdownViewer`'s own comment records this happening before.

Adds `scripts/verify-mounts.mjs` to the existing `prebuild` chain: builds the section index from
`public/content/*.md` and asserts every `HEADING_INSERTS` key exists in it, failing with the
orphaned keys named. ~40 lines, no new dependency, same shape as the two existing guards.

This is scope the brief did not ask for. It is included because Phase 0 identified the mount
table as the highest-risk surface in the restructure and Phase 5 flagged §3.4's split as the
most likely row to orphan a mount. Without it, commits 1–3 are unverifiable.

### Commit 7 — `fix(nav): update the shortcut lists and the tools hub`
- `components/QuickNavCapsule.tsx` (7 ids) and `components/ClientPage.tsx:122–126` (5 ids):
  new prefixes, and `tab` fields updated. These two lists are near-duplicates; they are
  **left as two lists** — deduplicating them is refactoring beyond the restructure (Rule 10).
- `components/InteractiveToolsHubModal.tsx`: 16 `sectionTarget` values, all currently *legacy*
  ids that only work via the resolver. Replaced with live ids so the hub stops depending on the
  compatibility layer.

### Commit 8 — `feat(nav): part-grouped navigation and the objectives index`
- `SECTIONS` gains a `part` field (`1`–`5`); Part 4's five tracks group under one heading.
  `MobileBottomNav`, `MobileTOCModal`, `SectionStickyBar` and `PhaseRail` consume the derived
  index and need only the grouping, not per-section edits.
- **"Jump to" on mobile for a document this long:** the existing `MobileTOCModal` (search +
  tab filter over the derived index, showing section counts) is the right pattern and is kept.
  One change — its tab filter becomes a *part* filter with the five parts, so the first choice
  a reader makes is between five things rather than nine.
- **The objectives index in Part 1** is a generated list of links to the nine track-level KPI
  blocks (§3.5.6, §3.7.5, §4.3.6, §4.4.5, §4.5.4, §6.4.4, §8.4.5, §8.5.7) built from the section
  index by matching headings ending in "KPIs" / "Key metrics". Nav chrome derived from the
  document — no content moves, no list to drift.

### Commit 9 — `feat(a11y): disclosure and print rules for the new spine`

**Progressive disclosure.** `lib/collapse-groups.ts` is rule-driven and re-derives itself; no
edits needed for the move. One addition: a `neverFold` predicate for the comparisons Phase 2
says must not be split, applied by section number so it survives further moves —

- §1.3 and §3.1 (threshold ↔ ceiling, the 125,549-vote inference),
- §9.2 tier tables and §9.2.1's statutory ceiling,
- any block containing a `Not yet` KPI baseline cell,
- every `[Insert…]`/`[Confirm…]` placeholder and Tier 3 marker **in Part 1**.

This is the Phase 4 hard rule made mechanical: an answer-first document must not hide the
qualifications on the answer.

**Print / briefing kit.** `PrintReportGenerator` currently renders only inside the `ask` section
and only when focus mode is off, i.e. reachable only by scrolling to the end of Part 9. It moves
to Part 1 alongside the header `Print` button.

**The print output follows a different order from the screen.** On screen, Part 1 is answer-first
because the reader may stop at any point. A printed briefing kit is read linearly, off a phone,
usually after the decision to engage — and its job is to be *auditable*. So print order is:
Part 1, then Parts 2–5 in full, with Part 4's five tracks in track order. That is the same
sequence as the screen — with one exception: the two `@media print` blocks in `app/globals.css`
must expand every disclosure group and fold, because a collapsed panel prints as a heading with
nothing under it. That is a bug in the current build too, and fixing it is one selector.

### Commit 10 — `chore(content): redirect the raw markdown paths and remove migration scripts`
The **one place `next.config.ts` redirects genuinely apply**: `public/content/*.md` are real
server-side URLs and nine of them change. Adds a `redirects()` block with the nine
`/content/<old>.md → /content/<new>.md` mappings (permanent), plus `/content/0-overview.md →
/content/1-decision.md`. Removes the commit-2 and commit-5 migration scripts. `verify-mounts.mjs`
stays.

---

## Components that must change because their context moved

| Component | Change | Why |
|---|---|---|
| `DecisionPanel` | rewire `tabId === "ask"` → `"decision"` | Keyed to a file, not a section id. Silently disappears otherwise. |
| `PrintReportGenerator` | render on Part 1 | Currently gated on the `ask` section, now Part 1's tail; also promoted per commit 9. |
| `FocusModeToggle` | suppression `!== "overview"` → `!== "decision"` | Rule is "not on the landing view". |
| `MizaniSlopeBlock`, governing-reality emphasis | `overview` → `decision` | Table- and text-pattern matched, not id-keyed. |
| `PlatformSizingBlock`, `ClaimCards` | `race` → `evidence` | Table-header matched; these **replace** their markdown table, so failure re-exposes a raw table. |
| `MediaOwnershipBlock` | key follows §3.4.1 into `evidence` | Highest orphan risk in the map; commit 6 exists to catch it. |
| `collapse-groups` closing-section rule | `ask` → `decision` | "The ask is never folded" must follow the ask. |
| `PhaseRail`, `KpiPhaseBlock` | keys follow §8.3 into `delivery` | Mechanical. |
| `crossSectionTarget` consumers | index-driven lookup | Commit 4. |

**Unchanged and deliberately so:** every chart under `components/charts/`, every `data/` module,
`verify-ward-register.mjs`, `verify-figures.mjs`, all styling. The restructure touches routing,
mounting and ordering — not presentation.

---

## Deep-link preservation

| Link class | Count | Mechanism |
|---|---|---|
| Current section fragments `#<tab>-sec-<slug>` | ~262 | `TAB_ALIASES` (old tab → new tab) + regenerated `LEGACY_IDS`. Fragments never reach the server; this is the only mechanism that can work. |
| Two prior generations of legacy ids | 413 | Existing `LEGACY_IDS` entries re-pointed through the new map, commit 5. |
| In-prose "Section N.N" | 173 | Index-driven resolution, commit 4. Currently broken; will work for the first time. |
| Raw markdown asset URLs | 10 | `next.config.ts` `redirects()`, commit 10. **The only class where a server redirect is possible.** |

Verified mechanically in commit 5 and again in Phase 8: every old id, run through
`resolveLegacySectionId`, must land on a member of the live section index. No inspection.

---

## Risks this plan does not eliminate

1. **§6.1.2–.4 stays in Part 4D** while §2.6 (Part 3) and §5.1 (Part 4C) depend on it. Splitting
   §6.1 needs paragraph-level judgement that shades into editing. Deliberately unfinished.
2. **§8.1 and §9.1 arrive before the arithmetic that derives their numbers.** Both state their
   figures inline, but this needs eyes on the rendered page, not a green build.
3. **The §3.4 split** separates a lead paragraph from the sub-parts it introduces. Commit 6
   catches an orphaned mount; it cannot catch prose that reads oddly.
4. **A green build does not mean a correct page.** Commits 1–3 can leave components silently
   unmounted. That is exactly what commit 6 exists for, and it should land before anyone trusts
   a passing build in this repo.
