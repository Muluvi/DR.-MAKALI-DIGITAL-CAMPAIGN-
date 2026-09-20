# Report — the visual compaction pass

Branch `claude/code-visual-audit-prompt-gh8n7r`, against the Phase 0 baseline at `bc1dc9e`.
Every figure below is measured by `scripts/measure-visual-baseline.mjs`, which is committed and
was used identically for the before and after columns.

**Read `CONFLICTS.md` first, and C-2 before anything else.** The §2.2 simulator's headline outcome
does not hold from today's date. It is the first interactive element in the proposal and it
currently tells Dr. Mulu he wins.

---

## 1. What changed, in one table

| | Before | After | |
|---|---|---|---|
| **LCP on `/`**, mid-range Android, slow 4G | 5,164 ms | **1,932 ms** | −63%, inside the 2,500 ms budget |
| **CLS** | 0 | **0** | held |
| **Page height** at 390 px | 467,728 px | **362,319 px** | −22.5% |
| **Reading time offered** | 289 min, take it or leave it | **Brief 121 min · Full 288 min** | a choice, both measured |
| **Words shown on a first read** | 63,337 (all of them) | **26,438 (41.7%)** | nothing deleted |
| **First-load JS** | 458 kB | **453 kB** | ≤ baseline, as required |
| **Figures under headings** | 272, of which 99 measured nothing | **152, all measuring something** | 102 headings now carry none |
| **Wrong table aggregates** | "Combined 68.7%" and three more, shipped | **none** | opt-in, per table, by name |
| **Figures reading zero with JS off** | `KSh0.00bn`, `0.0%`, `≈0k` | **none** | |
| **Duplicated text nodes** | headline ×2, every counter ×3 | **removed at source** | |
| **ASCII blocks** | 67 | **63** | 4 retired, 710 words |
| **`og:image`** | absent, with `summary_large_image` | **1200×630 typographic card** | |
| Third-party requests | none | **none** | held |
| Sideways scroll at 390 px | none | **none** | held |
| `noindex, nofollow` | intact | **intact** | held |

---

## 2. The four ways the site got shorter

### 2.1 Brief / Full — the largest single change

The hero used to close on "30 sections, 289 minutes". A true number, and a closed door: it is the
first thing a reader learns about a document they were sent on WhatsApp, on a phone, while
deciding whether to spend an hour on it.

Brief does not shorten the document — it shortens the **first read**. Every subsection opens on its
lead paragraph, its callouts and its figures; the rest sits behind one control that says how many
words are behind it.

- **26,438 of 63,337 words — 41.7%. 121 minutes against 288.**
- Both figures are computed **on the server from the segmentation the renderer actually uses**, so
  neither can drift from what the page does.
- Nothing is deleted and nothing is summarised. The folded prose stays in the DOM, clipped by a
  grid collapse rather than dropped, so the **printed briefing kit is still complete**.
- **Full means full.** `ProseFold` and `DisclosureGroup` used to keep their own defaults regardless
  of the choice, so "Full" would have returned a row of closed drawers with one open. Verified on
  §3A: Brief 3 of 11 folds open, Full 11 of 11, persisted across a reload.
- **A deep link always opens in full.** A cold visit to `#situation-sec-3-3-2` opens all 11.

The control is in the hero with both reading times, and again as a `B`/`F` button in the flow
chrome — the hero only exists on `/` and `/full`, and a reader arriving on a chapter route through
a deep link would otherwise have no way back to the whole text.

### 2.2 Figures replace the repeats

Four box-drawing blocks in §3B are now figures — **710 words**, each declared in
`scripts/figure-retirements.json` with the checklist of facts its figure is held to:

| Section | Was | Words | Now |
|---|---|---|---|
| §3.4 | `KITUI COUNTY ELECTORAL REGISTER` — all 40 wards in two columns of ASCII panels | 315 | `register-map` |
| §3.4.4 | `CONSTITUENCY STRUCTURAL POWER RANKING` — eight rows with a Big 4 band | 183 | `constituency-power` |
| §3.4.3 | `FOUR STRUCTURAL PATHS TO THE 200,000 VOTER POOL` | 110 | `paths-to-threshold` |
| §3.4.1 | `THE 2027 VICTORY THRESHOLD ARITHMETIC` | 102 | `threshold-build-up`, `register-growth` |

Checking the replacements against those checklists is what made them better than the blocks:

- §3.4.1's table stated the required share as a **band** — 60.0–60.5% of ballots, 37.2–37.5% of the
  register — and the first build-up carried only the lower bound. The band is now computed and
  shown, and only then was the block retired.
- The four-paths ASCII stated four register totals and stopped. The whole of §3.4 turns on a
  register not being a vote, so **every path now also shows the ballots it yields at 62%**.

### 2.3 A figure has to earn its place

"A figure under every heading" (PR #10) produced 272 derived figures. **99 measured nothing**: 51
re-typeset the heading, 23 listed the subsections below it, 11 redrew its own bullets as a wheel, 6
quoted a truncated fragment — one ended mid-sentence on *"…the Office of the Registrar of Political
Parties issued a"* — and 8 drew a diagram from an empty node array. A further 37 were derived,
serialised into a 188 kB JSON file and shipped to the browser **in order to render null**.

272 → 152, every one drawing a measurable relationship. **102 headings now carry no figure**, which
is a complete answer. `scripts/visual-coverage.mjs` is inverted to match: it no longer fails the
build when a heading has no figure, it fails when a retired kind comes back.

### 2.4 Less chrome

- The table toolbar carried four controls on all 74 tables. Now: a row count, a filter **only above
  ten rows**, and CSV/Chart behind one overflow control.
- The hero's three counter cards — inside a tilting, spotlit, mesh-gradient panel that scrolled
  sideways on a phone and clipped its own labels — are one server-rendered strip.
- 14 components implementing denied effects were deleted outright, with their four files.

---

## 3. The defects that were fixed first

### 3.1 The hero was reporting zero

`CountUp` seeded its visible span with `useState(0)`, so the server HTML — and a slow phone before
hydration, a reader with JavaScript off, reader mode and print — carried **`KSh0.00bn`, `0.0%` and
`≈0k`**. The 390 px baseline screenshot caught the count mid-flight showing **`KSh13.49bn` and
`84.5%`**, neither of which is a figure in this document.

The effect on LCP was not the point but is the headline: **5,164 → 1,932 ms**. The largest element
was a counter whose text changed after hydration, so the measurement restarted.

### 3.2 Every figure was in the document up to three times

`AnimatedNumber` rendered each figure three times (`sr-only` + width sizer + value); `SplitText`
rendered the headline twice. `aria-hidden` and `sr-only` move a node in or out of the accessibility
tree and do **nothing else** — both halves were real text to copy-paste, find-in-page and reader
mode. Width is now reserved in `ch` against the final string.

### 3.3 "Combined 68.7%" — Kasalu's two poll shares, added together

The table strip computed Avg/Max/Combined over any column that *looked* numeric — a question about
characters, not about whether the numbers may be added. It shipped, among others, the workstream
identifiers averaged and a zone table counting its own Total row twice, for **832,002 voters in a
county of 532,758**.

Charts and aggregates are now opt-in per table in `lib/table-charts.ts`, with the aggregation
named, the column named and the total rows excluded. **73 of 74 tables opt into nothing.**

### 3.4 The three "heading typos" are not in the content

`Langua register and dialect` and two `Sta:` scorecard headings were logged as content typos to fix
by hand. **The markdown is correct and always was.** All three were corrupted on the way into
`section-visuals.generated.json` by an optional backslash in a LaTeX guard, which let
`/\s*\$?\\?ge\s*[\d,]+\$?/` eat the letters "ge" inside any word followed by a comma or a number.
It was waiting for `"Percentage 40"` → `"Percenta"` and `"Coverage 78.8%"` → `"Covera.8%"`.

One character fixed in the generator. **No content edited.**

### 3.5 The rest

- **3D terrain** defaults to 2D and offers itself only on a fine pointer, a wide viewport, no Data
  Saver and no reduced-motion request. It carries an Under review flag for C-15, whose labels
  contradict §3.6 and which stay as written.
- **`og:image`** — a typographic card, no photograph (D-8), built by a committed script, so a
  link-only proposal shared on WhatsApp stops previewing as a broken large-image card.
- **Reserved page heights** were measured before Brief mode existed, so the page claimed
  467,728 px while rendering far less. Re-measured: −22.8%.

---

## 4. Conflicts: 14 confirmed, 1 corrected

`CONFLICTS.md` has the working for each. Every one was checked against the source rather than
copied from the brief, and the arithmetic against `data/ward-register.json`, which sums exactly.

**C-2 is the one to read before Dr. Mulu opens the document.** The §2.2 simulator's 14 weeks run
from the 7 August poll, so six of them have already gone. Over the **8.3 weeks that remain**,
+1.2 points a week reaches **32.0%** — below Kasalu's 37.4%, so the panel's "overtakes Irene Kasalu
… establishes an undeniable mandate" **does not hold as written**. Overtaking her from today needs
+1.85 a week; the 40% benchmark needs +2.16, against a slider whose maximum is 2.5. The model also
holds Kasalu flat at 37.4% although she gained 6.1 points between June and August.

**C-3 did not survive checking and is corrected in place.** The 40% benchmark **is** sourced — §4.1,
Tier 2, a countywide public preference share — and §3.4.2 contains no statement about
general-election thresholds. The real defect is narrower: the simulator calls it a "Wiper Nomination
threshold" with neither the population nor the tier.

Confirmed by computation, in `lib/figures/figures.test.ts`: the deficit pool is 51.7252%, which
rounds to the panel's **51.73%** and not the prose's 51.72% (C-6); Ikanga/Kyatune ranks **11th**, so
"5 of top 8 wards" cannot be right (C-5); the deficit wards number **21**, not the 24 the mandate
sends 240 captains into (C-7); and Path B's 14,179 is the margin over 198,004, not over the 200,000
it names (C-4).

---

## 5. What is not done

Stated plainly, because a report that implies otherwise is worth less than no report.

- **63 of 67 ASCII blocks remain.** All four retired are in §3B, the chapter the brief names as the
  one place to spend the visual boldness. Every remaining block is inventoried with a named target
  component in `INVENTORY.md`, and the mechanism to retire them — the `figure` fence, the registry,
  the retirement declaration with its facts checklist — is built and proven on four. What each one
  still needs is its own data module and figure.
- **Duplicates are inventoried, not yet collapsed.** D-1 lists 11 blocks (718 words) plus the Tier 3
  poll statement in six places and the 86.4% statement in twelve chapters. `CrossRef` is specified;
  it is not built. The 86.4% case cannot be collapsed until C-13 is answered anyway.
- **The desktop figure rail** (Phase 5 item 5) is not built. Figures stack on all widths.
- **INP** was not measured directly; LCP, CLS and FCP were.
- **Phases 4 P2/P3** — §4–§16 and the annexes — are mapped in the conversion map and the inventory,
  and untouched in the markdown.

The inventory's headline count of "11,275 words retired" is the **plan**, not the state. The state
is **710 words**, itemised in §2.2 above and in `figure-retirements.json`.

---

## 6. Verification

`npm run verify` — nine guards and 27 arithmetic assertions, all passing:

```
Ward register integrity ... 40 wards across 8 constituencies sum to 532,758
Analysis exports ......... 9 exports, 96 values, all carrying source, tier, date, method, status
Figure verification ...... every numeric literal in the UI traces to the source
Figure retention ......... all 1,055 figures present at the baseline survive; all 552 content
                           figures still reach the print path (22 declared migrations)
Content integrity ........ all 4,512 body lines unchanged since 228eb02, apart from 4 blocks
                           retired under rule 1a and declared
verify-mounts ............ 50 mount points resolve
verify-deep-links ........ 880 legacy ids and 272 live ids resolve
visual-coverage .......... no retired figure kind has returned
figures.test.ts .......... 27 passed
```

Three guards were improved by the work rather than worked around:

- `verify-figure-retention` indexed `section-visuals.generated.json`, a file **derived from**
  `public/content`, which made it circular: regenerating it reported section 6.2 as a lost figure.
- Rule 1 never consulted the declared-migrations list, so a figure declared "removed, not moved"
  satisfied rule 2 and still failed rule 1, surviving only when its digits happened to appear
  inside another number.
- `measure-section-heights.mjs` could not be run as its own documentation instructed — it said to
  point `NODE_PATH` at playwright, and ESM resolution does not consult `NODE_PATH`. That is why the
  heights were stale.

**Print reach was verified, not assumed.** Retiring the power-ranking table moved 14 literals into a
figure that computes them. Emulating print on `/arithmetic` finds all 14 in the rendered text, and
`figures.test.ts` pins every one in the document's own notation so the computation cannot drift.

---

## 7. Screenshots

`docs/visual-audit/screenshots/` — `before/` and `after/`, same six routes, 390 × 844 and
1440 × 900: `/`, §0 decision, §2 summary, §3A situation, §3B arithmetic, §3C reach.

The clearest pair is `root-390`. Before: three counters mid-count at `KSh13.49bn` and `84.5%`,
clipping sideways. After: the gap — 22.1% against 37.4%, **15.3 points behind** — drawn as one
distance, above a Brief/Full control offering 121 minutes or 288.

---

## 8. Assumptions made

1. **Brief is the default** (D-2). Reversible in one line.
2. **Race-first hero** (D-3). The envelope keeps its place in the strip, one item down.
3. **A folded block that sat between two kept blocks moves below them** (D-2). One disclosure per
   subsection cannot hold blocks interleaved with visible ones without either reordering them or
   splitting into several controls, and several controls is the failure `DisclosureGroup` already
   warns about. Order within each group is untouched; Full restores the document's order exactly.
4. **No prose was rewritten, tightened or summarised.** The only content edits are the four declared
   retirements and the `figure` fences that replaced them.
5. **`statement`, `chapter`, `hub`, `quote`, `shape` and `table` are retired figure kinds.** The
   nine curated overrides that existed only to force a heading down to `statement` now say `none`.
6. **Four deviations from the conversion map**, each recorded in D-13 with the reason: §3.1.5,
   §3.3.6, §3.4.2's concentration bullets and §1A.5 were kept or collapsed rather than retired,
   because in each case the block carries reasoning or a specification no figure draws.
