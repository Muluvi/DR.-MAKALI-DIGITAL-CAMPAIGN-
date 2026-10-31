# Text-to-visual map

Every section, the job its prose does, and the visual that carries it. "Visible words" use the
page's own rules (`lib/collapse-groups.ts`): leads, shown prose and the visible part of every
visual. Folded prose ("Read the full text") is not counted. Nothing is deleted: every converted
passage stays word for word in its section's fold, which `npm run check:content` enforces.

## How this pass converts

Earlier passes did most of the prose-to-fold work: 34 of 36 sections already open on a `lead`
and fold their running prose. What this pass found, and changes, is the other half of the brief:
**the visuals were folded too.** Every register figure and every mounted panel was closed behind
"Show the figure" / "Show the panel" (the owner's instruction of 29 October 2026, made to cut
phone-screen count). A reader of headlines and visuals saw a figure's title and one sentence, not
its marks.

So the conversion has three global steps, then per-section work:

| Step | Change | Effect on the reader |
|---|---|---|
| G-1 | Figure **marks** show on load; question, notes, item bodies, source names and data table stay behind the control, now labelled "Show the details" | The chart carries the argument; the text is one tap away |
| G-2 | Mounted panels (interactive charts) open on load | Same, for the bespoke panels |
| G-3 | A chapter intro that only restates the lead folds | The lead is said once |
| Per section | New `visual` fences where a prose job has no visual (below) | Prose-only screens fall |

## Acts I–III (Parts I–III), detailed

Visible words before → after are per section. "Moved" is prose newly placed in the fold.

### §1 Kitui at a glance — visible 554 → see table at foot

| Subsection | Prose job | Visual form | Effect | Words moved out of view | Kept visible (reason) |
|---|---|---|---|---|---|
| 1.1 People | Quantities | `stats` (population, households, median age) + figure fig-2-4 (age bands) | Count-up once; bars grow from baseline | — (already folded) | — |
| 1.2 Land | Quantities, comparison of regions | `stats` (area, rural share) + fig-3-7 zone map + zone `tabs` | Tile map fills outward | — | Source-conflict note on the rural share (statement of uncertainty) |
| 1.3 Living standards | Quantities | `checklist` + register figures | Bars grow | — | — |
| 1.4 How the county is run | Hierarchy (county → 8 constituencies → 40 wards) | Existing figure | — | — | — |
| 1.5 Money | Quantities | Existing resource-envelope panel (G-2 opens it) | Bars grow | — | Tier 3 caveat on the envelope |

### §2 How Kitui voted — visible 331

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| Intro | Key statement | Lead (once; G-3 folds the restating intro) | — | intro paragraph | — |
| 2.1 Electorate | Quantities, 2022/2026 | `stats` + register funnel with 2022/2026 toggle | Morphing toggle, counters | — | The "two versions in this document" turnout flag (uncertainty) |
| 2.2 Results 2013–2022 | Quantities over time | Figures (results, threshold) | Bars grow | — | — |
| 2.3 Where the votes are | Ranking, concentration | Ranked bar + running-total figure, `stats` | Scroll-linked line draw | — | — |
| 2.4 Constituencies that decide it | Comparison | Constituency-weight panel (G-2) | — | — | — |
| 2.5 The number it takes | Comparing options (four routes) | Path-to-200k panel + figure | Bars grow | — | "[CALC, not a forecast]" marker |

### §3 What voters need — visible 476

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 3.1–3.6 Water, food, health, roads, jobs, cost of living | Needs and issues | **Icon cards, one headline number and one source badge each** (`stats`, added), plus existing bars and timeline | Stagger reveal | — (prose already folded) | — |
| 3.7 County money | Quantities, audit record | Fiscal-audit panel (G-2) | Bars grow | — | — |
| 3.8 Mui Basin | Issue with legal sensitivity | Mui Basin panel (G-2) | — | — | Legal caution wording |

### §4 How voters get news — visible 606

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 4.1 Where people get information | Shares | `stats` + figures (G-1) | Bars grow | — | — |
| 4.2 Who owns the airwaves | Hierarchy / ownership | Media-ownership panel (G-2) | — | — | — |
| 4.3 Reach by channel | Comparison | `cards` + `contrast` | — | — | — |
| 4.4 Offline majority | Quantities | Offline waterline + `week` | Line draw | — | — |

### §5 The race — visible 459

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 5.1 Open seat | Key statement | Lead | — | — | — |
| 5.2 Wiper's process | Process | `stepper` | Steps reveal in sequence | — | — |
| 5.3 The field | Rivals | `cards` (candidate variant), competitor panel (G-2) | Card lift (laptop) | — | — |
| 5.4 Delegate primary | Process / options | Nomination-path panel (G-2) | — | — | — |
| 5.5 Each rival, legal ground | Rivals + legal caution | `checklist` | — | — | Defamation-safe wording (legal) |

### §6 Record and reach — visible 439

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 6.1 Public record | Record | `cards` (proof variant) | — | — | — |
| 6.2–6.3 Where he is known / where loyalty won't carry | Geography | Tile-map figures (G-1) | Map fills | — | — |
| 6.4–6.5 Channels and online presence | Quantities | `stats` + figures (G-1) | Counters | — | — |

### §7 The diagnosis — visible 598

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 7.1 What the evidence says | Key statements | `cards` + figures (G-1) | — | — | — |
| 7.2 What could overturn it | Risks / hypotheses | `hypothesis` | — | — | — |
| 7.3–7.4 Gaps and assumptions | Statements of uncertainty | — | — | — | **Kept**: statements of uncertainty |

### §8 The goal — visible 352

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 8.1 Goal and two deadlines | Decision, schedule | Figures (G-1) | — | — | — |
| 8.2.1–8.2.5 Five objectives | Comparing options | Five `cards` (objective variant) | Stagger | — | — |

### §9 The position — visible 279

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 9.1 Central claim | Key statement | Lead + pull-quote | Highlighter sweep | — | — |
| 9.2 Resource paradox | Comparison | Economist-Governor thesis panel (G-2) | — | — | — |
| 9.3 "Cold" | Counter-messaging | `qa` (attack / answer) | Flip on tap | — | — |

### §10 The message — visible 1,157

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 10.1 One claim → three pillars → six themes | Hierarchy | Strategic-pillars matrix (G-2), `tabs` | Expand on tap | — | — |
| 10.2 Discipline and persuasion | Rules | `cards` | — | — | — |
| 10.3 Framing examples | Before/after | `crosswalk` | — | — | — |
| 10.4 Samples | Samples | `cards` | — | — | — |
| 10.5 Counter-disinformation | Process | `matrix` + figures | — | — | Lawful-response wording |

### §11 The voters to win — visible 576

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 11.1 Universes | Hierarchy | `nested` | — | — | — |
| 11.2 Six segments | Comparing options | Accordion group (already) + segmentation panel (G-2) | — | — | — |
| 11.3 Segment sizes | Quantities | Figures (G-1) | Bars grow | — | Modelled-size caveats |

### §12 Channels & language — visible 718

| Subsection | Prose job | Visual form | Effect | Moved | Kept visible |
|---|---|---|---|---|---|
| 12.1 Where the effort goes | Shares | `donut` ×2 + figures | — | — | — |
| 12.2 Which channel does which job | Matrix | `cards` + figures | — | — | — |
| 12.3 Gatekeepers | Contrast | `contrast` | — | — | — |
| 12.4–12.5 Language | Comparison | `stats` + figures | — | — | — |
| 12.6 A week | Calendar | Week strip (existing `DirectionWeek`) | — | — | — |
| 12.7 When the plan changes | Triggers | `cards` | — | — | — |

## Parts IV–VI and annexes — converted

G-1 to G-3 opened every figure and panel in these Parts, and that, measured, was most of the
work: the prose here was already written as structured components (step lists, RACI and
workstream cards, scorecards, the escalation flow, the radio-station cards, the deliverables
table), which were closed behind "Show the panel". Per-section changes:

| § | Section | Visible before → after | Change | Kept visible (reason) |
|---|---|---|---|---|
| 13 | How it works | 870 → 798 | Panels open; §13.1 gets an extractive lead, so the paragraph restating its stepper folds | RACI table (keep-marked) |
| 14 | Timeline to Aug 2027 | 813 → 755 | Phased-plan panel, target ladder and the four-week strip open | — |
| 15.1 | Platforms & content | 933 → 877 | Promise tracker, verification protocol, asset repository open | Conflict C4 note (uncertainty) |
| 15.2 | Media | 236 → 236 | Radio landscape and broadcast player open | — |
| 15.3 | Ground & offline | 659 → 659 | Field terminal and offline-reach panels open | — |
| 15.4 | Data & technology | 288 → 288 | Panels open | — |
| 16 | Coalitions | 392 → 357 | Opening restatement folds | "Never built around ethnic, clan or religious bloc identity" (ethical standard) |
| 17 | The team | 459 → 405 | Team tree and surge-role cards open | — |
| 18 | Measuring success | 666 → 590 | Scorecards open | "Commits to the method, not an electoral outcome" (caveat) |
| 19 | Lawful & ethical | 1,390 → 1,327 | Charter panel open | **Legal standard, DPA, charter, IEBC clearance** (legal terms) |
| 20 | Risks & response | 616 → 549 | Risk and response panels open | — |
| 21 | What he receives | 630 → 570 | Service-level selector and three-tier comparison open | — |
| 22 | Commitments | 256 → 210 | Opening folds; lead carries the no-outcome commitment | — |
| 23 | The ask | 368 → 21 | Opening folds; the lead and the decision card carry the ask | — |
| A–H | Annexes | 4,568 → 4,322 | Openings fold | Annex G terms (legal) |

## Prose-only phone screens, final

Measured by `scripts/optimisation/prose-screens.mjs`: a 390 × 844 screen is prose-only when free
paragraphs (outside every figure, panel, card, table and fold) cover more than 60% of it.

**7 of 360 screens** across all 36 sections, every one text kept visible on purpose: §19 Lawful
(4, legal standard), Annex G Terms (1, confidentiality terms), In brief (1, the commitments: no
voter-file targeting until a named specialist signs off, method not outcome) and the cover (1,
title and byline).

The longest free-prose run between two visuals exceeds 60 words in some sections; itemised, those
runs are the section subtitle plus its key-finding lead plus one sentence, or legal and
uncertainty statements kept visible (§5 Article 180(7), §18 the no-outcome caveat). One real
restatement (§13.1) was fixed.

## Word counts

| | Visible before | Visible after (checkpoint) |
|---|---|---|
| Acts I–III (§1–§12) | 6,545 | **5,891** (−654, −10%) |
| Whole document | 20,016 of 58,472 | **18,118** (−1,898, −9%) after Parts IV–VI and the two keep-marks |

Per section, Acts I–III, before → after: §1 554 → 492 · §2 331 → 277 · §3 476 → 459 · §4 606 → 542 ·
§5 459 → 401 · §6 439 → 380 · §7 598 → 536 · §8 352 → 295 · §9 279 → 218 · §10 1,157 → 1,098 ·
§11 576 → 531 · §12 718 → 662. The drop is G-3 (each chapter's restating opening paragraph now
folds). Nothing left the document: `npm run check:content` passes, with 115 words of new visual
labels counted apart.

### Phone screens with marks (390 × 844, each section route, folds in their default state)

"Marks" means a chart SVG, image, canvas or data table at least 120 × 60 px is on screen
(`scripts/optimisation/screen-coverage.mjs`, run on `main` and on this branch).

| | Screens | Screens with no marks |
|---|---|---|
| `main` (figures and panels closed) | 196 | 189 (96%) |
| This branch | 356 | 259 (73%) |

The document is longer, because the visuals now take the space they need. Most of the remaining
screens without marks carry visual cards (`stats`, `cards`, `tabs`), which this strict measure
does not count. Counting those too (any `vz-*` visual block), Acts I–III have **61 of 166** screens
with no visual: §1 5/15, §2 14/30, §3 8/17, §4 2/16, §5 5/10, §6 7/14, §7 1/7, §8 3/6, §9 1/3,
§10 7/20, §11 2/10, §12 6/18. §2 is overstated: its pinned county stays on screen through all four
steps but is measured at one position. The brief's "every phone screen has a visual" is **not yet
met** for Acts I–III; §2 (unpinned parts), §3, §6, §10 and §12 are the next conversions.
