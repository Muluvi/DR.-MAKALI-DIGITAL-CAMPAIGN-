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

## Parts IV–VI and annexes — planned

Not converted in this pass's first checkpoint; G-1 to G-3 apply to them already because they are
global. The forms below are the defaults from the brief, to be applied Act by Act after the
checkpoint.

| § | Section | Visible before | Prose job | Visual form planned |
|---|---|---|---|---|
| 13 | How it works | 870 | Process (approvals, escalation) | Flow diagram (`stepper`), RACI `matrix` |
| 14 | Timeline to Aug 2027 | 813 | Schedule | Horizontal timeline / Gantt (`timeline`), scroll-snap on mobile |
| 15.1–15.4 | Workstreams | 933 / 236 / 659 / 288 | Comparing options, process | `cards` per workstream; field loop as `stepper` |
| 16 | Coalitions | 392 | Sequence | `timeline` |
| 17 | The team | 459 | Hierarchy | Org chart (`nested`), core vs surge |
| 18 | Measuring success | 666 | Quantities | KPI scorecards (existing) |
| 19 | Lawful & ethical | 1,390 | Legal standard | **Kept visible** (legal terms); charter as `checklist` |
| 20 | Risks & response | 616 | Risks | Likelihood × impact `matrix` heat-map; response tiers `stepper` |
| 21 | What he receives | 630 | Comparing options | Three-level comparison `crosswalk` |
| 22 | Commitments | 256 | Two-sided commitments | `inout` |
| 23 | The ask | 368 | Decision | Full-width decision card (existing `DecisionPanel`) |
| A–H | Annexes | 2,740 / 118 / 184 / 23 / 128 / 840 / 145 / 390 | Reference | Filterable source table (A); register table (B); glossary popovers (H) |

## Word counts

| | Visible before | Visible after (checkpoint) |
|---|---|---|
| Acts I–III (§1–§12) | 6,545 | see checkpoint |
| Whole document | 20,016 of 58,472 | see checkpoint |
