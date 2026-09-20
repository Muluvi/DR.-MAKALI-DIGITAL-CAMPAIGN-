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
| **ASCII blocks** | 67 | **20** | 47 retired, 7,595 words · chapters 3, 7, 8 and 11 have none left |
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

Forty-seven box-drawing blocks are now figures — **every one in chapters 3, 7, 8 and 11**.
**7,595 words**, each declared in `scripts/figure-retirements.json` with the checklist of facts its
figure is held to. The word counts are the declared blocks' own, so this table cannot drift from
the file that authorises them:

| Section | Was | Words | Now |
|---|---|---|---|
| §3.3.2 | `GOVERNOR MALOMBE'S 2027 CONSTITUTIONAL STATUS` — a two-branch tree | 84 | `ConstitutionalBranchNavigator` |
| §3.4 | `KITUI COUNTY ELECTORAL REGISTER` — all 40 wards in two columns of panels | 315 | `register-map` |
| §3.4.1 | `THE 2027 VICTORY THRESHOLD ARITHMETIC` | 102 | `threshold-build-up`, `register-growth` |
| §3.4.3 | `FOUR STRUCTURAL PATHS TO THE 200,000 VOTER POOL` | 110 | `paths-to-threshold` |
| §3.4.4 | `CONSTITUENCY STRUCTURAL POWER RANKING` — eight rows with a Big 4 band | 183 | `constituency-power` |
| §3.4.5 | `CROSS-MATCHING RECOGNITION DEFICITS WITH DECISIVE VOTER CONCENTRATIONS` | 226 | `RecognitionDeficitOverlay` |
| §3.4.6 | `SECTION 3.4.6 STRATEGIC TARGETING SUMMARY` — eight restated bullet lines | 120 | `targeting-summary` |
| §3.6 | `THE DIGITAL CEILING` — the connectivity split | 65 | `reach-split` |
| §3.6.1 | `DIGITAL PLATFORM IN-COUNTY SIZING MATRIX` — five platforms as ranges | 174 | `platform-sizing` |
| §3.6.2 | `OFFLINE CHANNEL REACH & CAPACITY AUDIT` — six channels, three unsourced | 223 | `offline-channels` |
| §3.6.3 | `CAMPAIGN RESOURCE REBALANCING AUDIT` — five channels, before and after | 200 | `effort-rebalance` |
| §3.6 × 3 | Three section banners — headings drawn above the headings they restate | 29 | none needed |
| §3.7 | `KAMBA RADIO LANDSCAPE & BYPASS ARCHITECTURE` — four hostile stations, four bypass routes | 92 | `radio-gatekeepers` |
| §7.1 | `CAMPAIGN MESSAGE ARCHITECTURE HIERARCHY` — the claim over three pillars | 103 | `message-house` |
| §7.1.1 | `CENTRAL CAMPAIGN CLAIM & SLOGAN` — the claim in three languages | 86 | `message-house` |
| §7.1.4 | `GROUND RUMOR VS. FACTUAL COUNTER-FIRE PROTOCOL` — three rumours, three answers | 194 | `counter-fire` |
| §7.3 | `TRILINGUAL AUDIENCE & CHANNEL MATRIX` — a compressed copy of the matrix below it | 127 | `language-map` |
| §7.3.1 | `TRILINGUAL AUDIENCE & CHANNEL MAPPING MATRIX` — three languages × audience × channel | 291 | `language-map` |
| §7.3.2 | `CULTURAL REGISTERS & PROVERBIAL FRAMING PROTOCOL` — four terms, three framings each | 161 | `cultural-registers` |
| §7.3.3 | `MULTILINGUAL APPROVAL & SIGN-OFF CHAIN` — four gates | 129 | `qc-gateway` |
| §7.3.4 | `CHANNEL-BY-LANGUAGE DEPLOYMENT MATRIX` — seven media, each allocated | 151 | `language-deployment` |
| §8.3 | `CAMPAIGN 360° CONTENT PRODUCTION PIPELINE` — a core, two engines, one gateway | 110 | `production-pipeline` |
| §8.3.2 | `PRODUCTION FORMAT SPECIFICATIONS BY CHANNEL` — five channels, specified | 280 | `format-specs` |
| §8.3.3 | The USSD menu tree — four options under an unprovisioned shortcode | 62 | `ussd-menu` |
| §8.3.4 | `WEEKLY 7-DAY CONTENT PRODUCTION CYCLE` — focus and outputs per day | 291 | `weekly-cycle` |
| §8.3.5 | `4-STEP CONTENT APPROVAL GATEWAY` — draft, review, DPA check, sign-off | 117 | `approval-gateway` |
| §8.3.6 | The asset repository tree — seven vaults | 83 | `asset-library` |
| §8.7.7 | `THE GATEKEEPER BYPASS & DIRECT REACH ARCHITECTURE` — four pillars and their protocol | 266 | `bypass-architecture` |
| §8.8 | `CLOSED-LOOP FIELD & DIGITAL INTEGRATION ENGINE` — two pipelines and a war room | 138 | `field-loop` |
| §8.8.1 | `WARD COORDINATOR FIELD REPORTING PROTOCOL` — four report types | 208 | `field-reports` |
| §8.8.2 | `THE 4-HOUR GROUND-TO-DIGITAL CYCLE` — four timestamped stages | 137 | `four-hour-cycle` |
| §8.8.3 | A banner with nothing inside it | 9 | none needed |
| §8.8.4 | `CAMPAIGN OPERATIONAL RHYTHM & GOVERNANCE CADENCE` — seven standing forums | 332 | `operating-rhythm` |
| §8.12 | `CAMPAIGN DATA LAYER ARCHITECTURE` — three stages over an encrypted core | 103 | `data-layer` |
| §8.12.1 | `SUPPORTER RECORD SCHEMA SPECIFICATION` — nineteen fields, typed | 275 | `supporter-schema` |
| §8.12.2 | `DPA 2019 STATUTORY COMPLIANCE CHECKLIST` — six sections, six obligations | 170 | `dpa-compliance` |
| §8.14 | `CAMPAIGN TECHNOLOGY STACK ARCHITECTURE` — four tiers | 123 | `tech-stack` |
| §8.14.1 | A banner with nothing inside it | 8 | none needed |
| §8.14.2 | `TECHNOLOGY STACK MASTER PROCUREMENT MATRIX` — five components, none decided | 158 | `procurement-matrix` |
| §11.1.1 | `NOMINATION WINDOW KEY PERFORMANCE INDICATORS` — four KPIs, seven columns | 339 | `nomination-scorecard` |
| §11.1.2 | `GENERAL ELECTION KEY PERFORMANCE INDICATORS` — five KPIs, seven columns | 423 | `ge-scorecard` |
| §11.1.3 | `VICTORY-ANCHORED KPI MONITORING ARCHITECTURE` — two stages of targets | 108 | `kpi-architecture` |
| §11.2.0 | `EMPIRICAL RESEARCH & SERVICE-DELIVERY TRACKER` — 19A beside 19B | 88 | `research-and-tracker` |
| §11.2.1 | `RECOGNITION-DEFICIT RESEARCH ARCHITECTURE` — three instruments, five columns | 370 | `research-modules` |
| §11.2.2 | `PUBLIC SERVICE-DELIVERY TRACKER ARCHITECTURE` — four dimensions | 232 | `delivery-tracker` |

Checking the replacements against those checklists is what made them better than the blocks:

- §3.4.1's table stated the required share as a **band** — 60.0–60.5% of ballots, 37.2–37.5% of the
  register — and the first build-up carried only the lower bound. The band is now computed and
  shown, and only then was the block retired.
- The four-paths ASCII stated four register totals and stopped. The whole of §3.4 turns on a
  register not being a vote, so **every path now also shows the ballots it yields at 62%**.
- The platform matrix printed a share column it had computed by hand. `platform-sizing` computes
  the same column from the headcounts and the register, and **one cell disagreed**: 35,000 is 6.5%
  on the TikTok row and 6.6% on the YouTube row directly beneath, for the same number against the
  same denominator. Logged as **C-18**, not corrected — and the Under review note on the band is
  what keeps the printed `6.5%` in the document. Correcting it would have deleted a figure.
- The offline table gave six channels one visual weight. Three of them cite nothing, and the
  document says so. `offline-channels` **hatches the unsourced three and writes "Source needed" on
  the bar** (C-17), and carries the standing warning that the six overlap: summed, they would claim
  1,800,000 reachable voters in a county whose register is 532,758.
- The three banners were the only blocks retired with **no figure replacing them**, because they
  carried no facts — each restated, in box-drawing characters, the heading immediately above it.
- §3.4.5's cross-match could not be retired as it stood. The panel already mounted at that heading
  drew the same twelve wards, and checking it against the block's checklist found **two gaps**: it
  collapsed the table's four recognition grades into three, losing the distinction between Kwa
  Vonza/Yatta's campus-town recall and Kitui West's border-belt recall, and it stated the overlap
  only in the top-8 window. The block's own claim — *5 of the top 11 … 83,496 voters* — is exactly
  right against the register; it is §3.4.6's "5 of top 8" that is not. **Both windows are now
  computed and shown**, with C-5 beneath them, and only then was the block retired.
- §3.4.6's banner is the textbook "restated summary table". Every one of its eight lines is now
  computed from the register rather than transcribed, and **each names the subsection that
  established it** — which turns a second copy of §3.4 into a way back into it. Three of the eight
  are in dispute (C-5, C-6, C-7); those rows print what §3.4.6 stated beside what the register says.
- §3.3.2's branch tree is the **only block retired without a new figure or a checklist gap**: the
  two prose bullets directly beneath it state every fact it carried, in fuller words, and the
  branch navigator at that heading draws the fork. It was a third copy between the other two.
- **Retiring §11.1.3 found a live figure on the site five points below the one the proposal
  states.** `data/kpis.ts` held the Stage 1 headline targets twice — correctly inside the
  scorecard data, and again in a hand-typed summary feeding the architecture figure, where
  "≥ 70.0%" had become ">65%" and "Branch Executive" had become "Delegate". The stale copy is
  corrected, `figures.test.ts` now asserts every line of both stage summaries against the KPI it
  summarises, and **no content was changed** — this was a transcription in the repository
  disagreeing with the source it transcribes. **D-14** has the working.
- **§11's two scorecards were already being substituted, from the wrong side.** `KpiScorecards`
  has rendered in place of those blocks since an earlier pass, matched on the block's own banner
  text inside `MarkdownViewer` — a substitution that depended on a banner nobody could rename, and
  that left the seven-column ASCII in the markdown carrying the words anyway. Both are now
  `figure` fences resolved by the registry, and the string matching is deleted.
- **Nine KPI baselines, and only one of them is a number.** "Not yet measured (Week 1)" is drawn
  as an absence rather than a bar at zero, because an unmeasured quantity reported at nil is a
  different and false claim. The test now pins the three kinds so a later edit cannot quietly turn
  an absence into a figure.
- **Two §8.3 blocks were trees, and a tree drawn in characters is only a picture of one.** The
  USSD menu and the asset repository are now nested lists: the nesting *is* the structure and is
  announced as such, each path wraps inside its own indent instead of running into the next
  branch's, and the guides are borders rather than characters, so they never land in a copy-paste.
  The USSD figure carries the warning with it — the shortcode is not provisioned, the root still
  reads `*[Insert shortcode]#`, and a menu tree lifted into a slide is exactly how an
  unprovisioned shortcode reaches a flyer.
- **§8.3.2 is C-21 from the other end, and there the document is right.** Its SMS row states the
  constraint twice: "Kiswahili or English only (CA rule)", and GSM-7 encoding with no accented
  unicode — which independently rules out the ĩ and ũ Kikamba needs. §7.3.1 still lists 2G bulk
  SMS among Kikamba's channels.
- **§8.8.2's clock is the one thing an ASCII block did better than a paragraph**, so the figure
  keeps it. The four-hour cycle runs down the margin as a monospaced offset in front of each stage
  rather than sitting in a caption, because the claim *is* the clock: a rumour logged by USSD in
  Tseikuru, triaged, answered in three languages and deployed across four channels, all inside a
  morning. `Stepper` grew an optional offset for it.
- **§8.12.1's schema is the block that proves not every diagram wants to be a chart.** Nineteen
  typed fields with nothing to plot and nothing to rank: what it needed was to stop being an
  *image* of a table. Inside a code fence it could not wrap, could not be searched word by word,
  could not be read in order by a screen reader, and scrolled sideways on a phone. It is now a real
  `<table>` whose rows become labelled blocks at narrow widths. The content is identical — every
  field name, type and enum member transcribed, because a schema paraphrased is a schema wrong —
  and only its form changed. That is the whole of the improvement, and it is a large one.
- **§8.14.2's five procurement rows all read "Awaiting campaign decision", and all five still do.**
  A figure that rendered a pending procurement as settled would be inventing the most consequential
  kind of thing in that chapter.
- §7's other five blocks are the message house, the counter-fire table, the cultural registers
  and the QC gateway. Two things in them were worth protecting and are now protected by the
  figures rather than by luck. The **Kikamba orthography** in §7.3.2 — ĩ and ũ are distinct
  letters, not decorated vowels — is transcribed character for character, which is what §7.3.2's
  own ban on machine translation exists to insist on. And §7.1.4's bursary rebuttal ends
  **"Share pending the ledger"**: the document declining to claim a proportion it has not verified,
  inside its own counter-messaging table. It is the most creditable sentence in the block and it is
  kept exactly.
- §7.3's three blocks found **C-21, the one conflict here with a regulator attached.** §7.3.1
  lists "2G Bulk SMS & USSD" among Kikamba's dominant channels; §8.10.2 states, citing the
  Communications Authority at Tier 1, that political bulk SMS is restricted to English or Kiswahili
  and that an operator may **refuse** a non-compliant message. Six other places agree with
  §8.10.2 — including §7.3.4, in the same subsection, which gives the SMS rail 80% Kiswahili and
  20% English and allocates Kikamba none of it. `language-map` prints §7.3.1's channel list
  verbatim, bulk SMS included, and carries the flag: dropping the words quietly would have hidden a
  conflict that can have a message refused after the campaign has committed a 48-hour lodging lead
  time. The SMS rail is the channel §3.6.2 sizes at 320,000 voters.
- §3.7's radio landscape is the block that **found C-20**. Its hostile tier opens with Musyi FM;
  twelve lines later §3.7.1 gives Musyi FM the placement budget, the station data reads "Priority
  — commercially independent", and §3.6.3 scales radio effort up into it. `radio-gatekeepers`
  draws each station's posture from the ownership map §3.7.1 says governs and prints what the
  diagram said beside it, on the two rows where they differ. **Sang'u FM and Mang'elete, both named
  in the diagram, are in none of the eight rows of that map**; they render as "Not in the ownership
  map" rather than being dropped, because an omission a reader cannot see is the worse failure.

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

## 4. Conflicts: 20 confirmed, 1 corrected

`CONFLICTS.md` has the working for each. Every one was checked against the source rather than
copied from the brief, and the arithmetic against `data/ward-register.json`, which sums exactly.

**Four of them the brief did not know about**, and all three came out of the figure work itself.
A figure that computes its labels rather than transcribing them disagrees out loud with a document
that has drifted (**C-18**, a tenth of a percentage point); a figure that cites its section has to
decide which number that section is (**C-19**, eight stale heading numbers); and a figure that
draws a station's posture from the station data has to notice when the prose above it says the
opposite (**C-20**, which is the one with a spending decision attached — §3.7 files Musyi FM under
hostile gatekeepers while §3.7.1 gives it the placement budget). **C-21** is the fourth and the
most serious of them: §7.3.1 puts Kikamba on the bulk SMS rail that the Communications Authority
closes to it, against six other places in the document and a Tier 1 source. None has been
corrected in the content.

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

- **20 of 67 ASCII blocks remain.** Chapters 3, 7, 8 and 11 are clear — no box-drawing blocks
  left in any of them. The remaining 20 are in §5, §6A, §13, §14 and the annexes: every one is
  inventoried with a named target component in `INVENTORY.md`, and the mechanism — the `figure`
  fence, the registry, the retirement declaration with its facts checklist, the migration
  declaration for a figure leaving the markdown, and now a guard that fails the build if a fence
  does not resolve — is built and proven on fifteen. Every remaining block is inventoried with a
  named target component in `INVENTORY.md`, and the mechanism to retire them — the `figure` fence,
  the registry, the retirement declaration with its facts checklist, the migration declaration for
  any figure leaving the markdown — is built and proven on eleven. What each one still needs is its
  own typed data module and figure.
- **Duplicates are inventoried, not yet collapsed.** D-1 lists 11 blocks (718 words) plus the Tier 3
  poll statement in six places and the 86.4% statement in twelve chapters. `CrossRef` is specified;
  it is not built. The 86.4% case cannot be collapsed until C-13 is answered anyway.
- **The desktop figure rail** (Phase 5 item 5) is not built. Figures stack on all widths.
- **INP** was not measured directly; LCP, CLS and FCP were.
- **Phases 4 P2/P3** — §4–§16 and the annexes — are mapped in the conversion map and the inventory,
  and untouched in the markdown.

The inventory's headline count of "4,275 words retired" is the **plan**, not the state. The state
is **7,595 words**, itemised in §2.2 above and in `figure-retirements.json`.

---

## 6. Verification

`npm run verify` — ten guards and 38 arithmetic assertions, all passing:

```
Ward register integrity ... 40 wards across 8 constituencies sum to 532,758
Analysis exports ......... 9 exports, 96 values, all carrying source, tier, date, method, status
Figure verification ...... every numeric literal in the UI traces to the source
Figure fences ............ all 39 ```figure fences resolve to one of 41 registered figures
Figure retention ......... all 1,055 figures present at the baseline survive; all 552 content
                           figures still reach the print path (52 declared migrations)
Content integrity ........ all 3,616 body lines unchanged since 228eb02, apart from 45 entries
                           covering 47 blocks retired under rule 1a and declared
verify-mounts ............ 50 mount points resolve
verify-deep-links ........ 880 legacy ids and 272 live ids resolve
visual-coverage .......... no retired figure kind has returned
figures.test.ts .......... 38 passed
```

Three guards were improved by the work rather than worked around, and a fourth was written:

- `verify-figure-retention` indexed `section-visuals.generated.json`, a file **derived from**
  `public/content`, which made it circular: regenerating it reported section 6.2 as a lost figure.
- Rule 1 never consulted the declared-migrations list, so a figure declared "removed, not moved"
  satisfied rule 2 and still failed rule 1, surviving only when its digits happened to appear
  inside another number.
- `measure-section-heights.mjs` could not be run as its own documentation instructed — it said to
  point `NODE_PATH` at playwright, and ESM resolution does not consult `NODE_PATH`. That is why the
  heights were stale.

`verify-figure-fences.mjs` is the new one, and it exists because the bug it catches **shipped**. A
```figure fence body must read `id: some-figure-id`; two of them were written as a bare id, which
renders a visible "Malformed figure fence" banner exactly where the retired ASCII block used to be.
Neither existing guard could see it: retention passed because the figures still lived in the test
file and the data modules — it asks whether a number survives somewhere, not whether the figure
meant to show it renders — and content integrity passed because the retirements were properly
declared, which authorises removing the block but cannot know the replacement is broken. So a block
could be retired, its retirement correctly declared, and the figure that justified the retirement
silently replaced by an error banner: rule 1a's exact failure mode, arriving through a typo. The
guard parses every fence and checks the id against the registry, and it was tested against both
forms of the bug before being added to `npm run verify`.

**Print reach was verified, not assumed.** Retiring the power-ranking table moved 14 literals into a
figure that computes them. Emulating print on `/arithmetic` finds all 14 in the rendered text, and
`figures.test.ts` pins every one in the document's own notation so the computation cannot drift. The
same check was run for every later batch: `/reach` for the §3.6 and §3.7 figures, `/arithmetic` for
§3.4.5's 83,496 and every fact on its retirement checklist. All render in print, and at 390px with
no horizontal scroll.

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
