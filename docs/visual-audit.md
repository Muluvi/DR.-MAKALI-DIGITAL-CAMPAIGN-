# Visual audit — Phase 0

Read-only inventory. No code changed, no component created.

> **Revision 2.** A revision 1 of this audit exists from an earlier session and
> is retained in full as Appendix B. Where the two disagree, revision 2 is
> measured and revision 1 was not — the differences are listed in
> "Corrections to revision 1" below. Revision 1's block-by-block inventory,
> with line ranges for all 83 blocks, is data this revision does not duplicate
> and is the reason it is kept rather than replaced.

## Corrections to revision 1

| Revision 1 said | Measured |
|---|---|
| §3.4.3 is "105 columns wide, 820px min-width", overflowing horizontally and requiring blind panning | The block is **79 columns**. `DiagramViewer` scales it to fit the card — it does not overflow. The failure is type size, not panning |
| All 83 blocks are character art needing conversion | **45 of the 83 already render as real tables and key/value cards** through `lib/ascii-diagram.ts`. 38 are still character art |
| Tables need "the two-rendering treatment" | Both table paths already have it. The markdown path is JS-gated, which revision 1 did not catch |
| *(no placeholder register)* | Section 6 below. 23 markers, and the document's own claim of 17 verified |

Revision 1's mobile failure points 4 and 5 — the 694-word governance prose
wall and the three-tier deliverables comparison — are real, are not diagram
problems, and are not superseded by anything here. They are carried forward.


## Method

Every count here is produced by a script over the repo, not by reading and
tallying. Blocks are classified by running the repo's own parser
(`lib/ascii-diagram.ts`) over each fenced block in `public/content`, so the
"upgraded / not upgraded" split is what actually ships, not an estimate.
Widths are the longest line in the block. Anything not measured is marked as
such.

Reproduce with the scripts in `bun run verify`, plus:

```
grep -c '^```' public/content/*.md          # fenced blocks, ×2
grep -rnoE "\[Insert[^]]*\]" public/content  # bracketed placeholders
```

## What this audit changes about the plan

The phase commands were written for a repo with ~194 unconverted ASCII blocks
and no token layer. Neither is true now, and three of the six inventory items
this audit was asked to produce describe work that is already done:

- **83 fenced blocks, not ~194.** 45 already render as real tables and
  key/value cards. 38 are still character art.
- **Wide tables already have the two-rendering treatment.** Markdown tables
  card-stack on mobile (`InteractiveTable`); parser-derived tables stack
  themselves in CSS with `data-label` column headers, one DOM, no JS.
- **The token layer exists** — ~390 custom properties in `app/globals.css`.
  The hard-coded-value problem is real but narrow, and it is not spacing.

What is left is smaller than the plan assumed and differently shaped: 32 real
diagrams still drawn in monospace, one payload problem, and one missing map.

---

## 1. Character-art blocks

38 of 83 fenced blocks still reach the reader as fixed-width character art —
34 parsed as `panel` (scaled to fit the card, or opened in a zoom-and-pan
overlay) and 4 falling back to a raw `<pre>`. Neither path reflows.

Sorted by argumentative value, not file order or size.

| Route | Line | § | Depicts | W×H | Rating |
|---|---|---|---|---|---|
| `situation` | 788 | 3.6 | Electorate reachability audit — **the 86.4% offline split** | 90×14 | `structural` |
| `scope-ground` | 10 | 8.8 | Closed-loop field & digital integration engine | 84×27 | `complex` |
| `scope-ground` | 80 | 8.8.2 | The 4-hour ground-to-digital cycle | 84×23 | `structural` |
| `situation` | 386 | 3.4 | Kitui electoral register, 532,758 voters | 90×36 | `complex` |
| `situation` | 506 | 3.4.3 | Four structural paths to the 200,000 pool | 79×18 | `structural` |
| `scope-ground` | 212 | 8.9.1 | Field↔digital bidirectional sync loop *(raw `<pre>`)* | 67×13 | `structural` |
| `risk` | 10 | 13.1 | Rapid-response decision & escalation flow | 85×19 | `structural` |
| `scope-platforms` | 55 | 8.2.3 | What happens to a report *(raw `<pre>`)* | 66×20 | `structural` |
| `situation` | 997 | 3.7 | Kamba radio landscape & bypass architecture | 86×17 | `structural` |
| `situation` | 602 | — | Recognition deficit × decisive voter concentration | 86×23 | `complex` |
| `messaging` | 415 | 7.3.3 | Multilingual approval & sign-off chain | 80×25 | `complex` |
| `scope-ground` | 307 | 8.10.3 | USSD menu tree, Kikamba *(raw `<pre>`)* | 57×7 | `structural` |
| `scope-platforms` | 221 | — | USSD interactive menu tree `*483*77#` | 51×8 | `structural` |
| `risk` | 99 | 13.1.4 | Pre-drafted holding positions & citations | 112×52 | `complex` |
| `scope-ground` | 149 | 8.8.4 | Operational rhythm & governance cadence | 111×33 | `complex` |
| `risk` | 427 | 13.5 | Statutory compliance architecture | 91×25 | `complex` |
| `structure` | 6 | — | Lean core + specialist vendor model | 84×32 | `complex` |
| `structure` | 136 | 14.6 | Reporting lines org chart *(raw `<pre>`)* | 62×23 | `structural` |
| `scope-platforms` | 299 | 8.3.6 | Asset library directory tree | 66×26 | `complex` |
| `situation` | 198 | — | Malombe 2027 constitutional status, dual branch | 91×16 | `structural` |
| `situation` | 86 | 3.2.2 | Three-tier evidential classification | 79×20 | `simple` |
| `situation` | 118 | 3.2.3 | Four-step conflict resolution protocol | 78×18 | `structural` |
| `scope-data` | 10 | 8.12 | Campaign data layer architecture | 85×19 | `complex` |
| `scope-data` | 225 | 8.14 | Technology stack architecture | 84×19 | `complex` |
| `scope-platforms` | 134 | 8.3 | 360° content production pipeline | 84×19 | `structural` |
| `scope-platforms` | 269 | 8.3.5 | 4-step content approval gateway | 81×23 | `structural` |
| `messaging` | 10 | 7.1 | Message architecture hierarchy | 84×19 | `structural` |
| `messaging` | 34 | 7.1.1 | Central campaign claim & slogan | 79×11 | `simple` |
| `messaging` | 332 | 7.3 | Trilingual audience & channel matrix | 85×18 | `simple` |
| `measurement` | 87 | 11.1.3 | Victory-anchored KPI monitoring architecture | 70×23 | `complex` |
| `measurement` | 119 | 11.2 | Empirical research & service-delivery tracker | 85×13 | `simple` |
| `audiences` | 8 | — | Audience architecture overview | 84×16 | `simple` |

### The six that are not diagrams at all

Six blocks contain nothing but a framed title restating the heading directly
above them — `┌───┐ │ SECTION 3.6.1: CONNECTED MINORITY CHANNELS │ └───┘` sits
immediately under `### 3.6.1 The connected minority, and its limits`.

| Route | Line | § |
|---|---|---|
| `situation` | 814 | 3.6.1 |
| `situation` | 860 | 3.6.2 |
| `situation` | 935 | 3.6.3 |
| `audiences` | 29 | 5.1 |
| `scope-data` | 249 | 8.14.1 |
| `scope-ground` | 110 | 8.8.3 |

They carry no claim, figure or relationship that the heading does not already
carry. Deleting them removes duplicated presentation, not prose — but that is
a call for the author, not a conversion, and it is listed here rather than
acted on.

**Net: 32 real diagrams to convert.**

---

## 2. Tables

89 tables in total, and the mobile treatment the command asks for already
exists on both paths.

| Kind | Count | Mobile rendering |
|---|---|---|
| Markdown tables in `public/content` | 60 | `InteractiveTable` — card stack on phones, filterable table above. **JS-gated**, see below |
| Character-art tables parsed to real `<table>` | 29 | Stacks itself in CSS below `md`; each cell carries its column header in `data-label`. One DOM, no JS, a real `<table>` at every width |
| Character art that is *not* a table | 38 | **None** — see section 1 |

### More than four columns

Nine markdown tables and five parsed tables. All fourteen already stack; they
are listed because stacking a 7-column row produces a seven-line card, which
is legible but long.

| Cols | Location | § |
|---|---|---|
| 7 | `situation.md:454` | 40-ward registration ranking (IEBC 2022) |
| 7 | `measurement.md:12` | Nomination window KPIs *(parsed)* |
| 7 | `measurement.md:45` | General election KPIs, ≥200,000 votes *(parsed)* |
| 6 | `summary.md:28` | 2.2 The governing constraint |
| 6 | `situation.md:563` | Constituency structural power ranking *(parsed)* |
| 5 | `scope-data.md:157` | 8.13.4 Model variables |
| 5 | `scope-data.md:396` | 8.15.3 Analytics maturity roadmap |
| 5 | `scope-ground.md:354` | 8.10.6 KPIs for the offline layer |
| 5 | `situation.md:690` | 3.5.1 Urban and central anchor |
| 5 | `situation.md:710` | 3.5.2 The northern block: Mwingi |
| 5 | `situation.md:730` | 3.5.3 The arid and resource belt |
| 5 | `situation.md:768` | 3.5.4 How the zones are weighted |
| 5 | `audiences.md:124` | Audience segment comparative matrix *(parsed)* |
| 5 | `measurement.md:139` | Recognition-deficit research architecture *(parsed)* |

The 40-row × 7-column ward ranking at `situation.md:454` is the one worth
attention: as 40 seven-line cards it is roughly 280 lines of scroll on a
phone. It is also the table the ward map exists to replace.

### The markdown card view needs JavaScript

`InteractiveTable` selects its shape with `useIsMobile()`, whose
`getServerSnapshot()` returns `false` (`hooks/use-mobile.ts:16`). The branch is
`mounted && isMobile` (`InteractiveTable.tsx:323`), so **every server-rendered
markdown table is the horizontal-scroll table**, and the card view appears only
after hydration. With JS off, or on a slow connection before 421 kB of
JavaScript arrives, all 60 of them are side-scrolling tables on a phone.

The parsed character-art tables do not have this problem — they stack in CSS.
The fix is the same technique, applied to the markdown path.

---

## 3. Hard-coded values

180 arbitrary Tailwind values and 120 distinct hex literals. Grouped by what
they are, because the frequency ranking is misleading on its own.

| Value | Count | What it is | Verdict |
|---|---|---|---|
| `[44px]` | 80 | Touch-target minimum (commit `4be4c43`) | **Token it.** One number, 80 sites, a real design decision with no name |
| `#fff` / `#ffffff` / `#000` / `#000000` | 55 | Device chrome inside phone/terminal simulators | Leave. Literal black and white in a simulated UI |
| `#e31d2b` | 15 | Data red, in chart components | **Token it** — see below |
| `#00209f` | 11 | Data blue, in chart components | **Token it** — see below |
| `#0b1a30`, `#0056a8`, `#8295a9` | 26 | Terminal and chart surfaces | Review |
| `#f2f2f2`, `#667781`, `#54656f`, `#e4e6eb`, `#ced0d4` | 19 | WhatsApp / Facebook / Instagram brand chrome | Leave. Brand fidelity is the point of the simulator |
| `#b45309`, `#f59e0b`, `#d97706` | 8 | Amber warning states | **Token it.** `--estimate-*` already exists and means this |
| `[3px]` `[2px]` `[1px]` `[10px]` `[7px]` `[11px]` | 26 | Hairlines and micro-type | Leave. Below the spacing scale on purpose |
| `[220px]` `[190px]` `[150px]` `[240px]` `[260px]` `[480px]` | 15 | Chart and device heights | Leave |
| `400ms` `250ms` `150ms` `80ms` | 10 | Durations outside the motion tokens | **Token it.** The brief specifies three durations; there are at least nine |

### The one that matters

`#e31d2b` and `#00209f` are the Kenyan flag's red and blue used as **data
colours**, hard-coded across **15 files** — eight of them chart and data components
(`MizaniSlopeBlock`, `FiscalAuditChartBlockContent`, `PlatformSizingBlock`,
`ResourceEnvelopeBlock`, `MediaOwnershipBlockContent`, `PathTo200kBlockContent`,
`ElectoralTimelineBlockContent`, `CompetitiveQuadrantBlock`), plus
`ChartComponent`, `HeroVisual`, `StrategicAids` and `ClientPage`. The brief says colour in this document carries
meaning and is never decoration — which is exactly right, and is exactly why
those two values need names in `app/globals.css` before a sixteenth file
copies them. This is also where the `--kt-ground` / `--kt-digital` /
`--kt-physical` / `--kt-hub` decision gets settled, since none of the four is
defined today and `--phase-0..3` occupies that role.

Spacing, radii and type sizes are already tokenised and are **not** a problem.

---

## 4. Existing bespoke components

63 components under `components/markdown/`, plus the device simulators. They
establish four patterns the remaining work has to match:

**The instrumentation register.** `TerminalFrame` + four screens
(`GroundPulseScreen`, `IncidentScreen`, `MarketAuditScreen`, `TurnoutScreen`),
and `PhoneFrame` + seven (`UssdScreen`, `WhatsAppScreen`, and five social).
Monospace, device bezels, live-feed timestamps. The strongest work in the
document and the reason the brief reserves mono for field instrumentation.

**Sourced figures.** `TierBadge`, `ClaimBadge`, `ProvenanceLine`, `SourceLine`,
`DisputedFigure`, `DerivedFigureDrawer`, `FootnotePopover`. Every displayed
number can show where it came from and which evidential tier it sits in. This
is the document's credibility machinery rendered as UI, and it is enforced by
`scripts/verify-figures.mjs`.

**Data blocks with a content twin.** Eleven `*Block` / `*BlockContent` pairs —
`WardCartogram`, `PathTo200k`, `FiscalAuditChart`, `MediaOwnership`,
`ConstituencyWeight`, `ElectoralTimeline`. A server block that reads from
`data/` and a content component that renders it. This is the pattern a new
diagram should follow.

**Reading affordances.** `ProseFold`, `DisclosureGroup`, `InteractiveTable`,
`CrossSectionLink`, `SectionNumberMap`, `KeyTakeawayBanner`. Progressive
disclosure over a 241-section document.

Also live and not to be regressed: `ScrollProgressBar` (already CSS
`animation-timeline: scroll()` with a scroll-listener fallback),
`SectionStickyBar`, `FocusModeToggle`, `ReadingSettingsSheet`, the
`dark`/`sepia` theme.

---

## 5. Mobile failure points

The arithmetic first, because it settles four of the five. At ≤380px
`.ascii-pre` is 9px (`app/globals.css:1371`). JetBrains Mono advances 0.6em, so
5.4px per character. Usable width inside the card at 360px is about 312px after
the gutter and padding — **roughly 57 characters.** `DiagramViewer` scales
anything wider to fit, so effective type size is `57/width × 9px`.

| # | Where | Why a reader gives up |
|---|---|---|
| 1 | `risk.md:99` — holding positions, 112×52 | Scales to 0.51 → **4.6px type**. Below the size at which a glyph resolves at all. 52 lines deep, so the zoom overlay means pinch, drag, read four lines, drag again |
| 2 | `scope-ground.md:149` — operational rhythm, 111×33 | 4.6px. The governance cadence — who meets when — is one of the few things a principal actually checks |
| 3 | `situation.md:788` — reachability audit, 90×14 | 5.7px. **This is the 86.4% figure**, the strategic core of the proposal, rendered as an ASCII bar chart too small to read on the device the reader is holding |
| 4 | `situation.md:454` — 40-ward table, 7 columns | Stacks correctly, but into ~280 lines of scroll. Right answer, wrong shape: this wants the map |
| 5 | `situation.md:386` — electoral register, 90×36 | 5.7px, 36 lines. The vote arithmetic the entire strategy rests on |
| 6 | All 60 markdown tables, pre-hydration | The card view is JS-gated. Until the bundle lands, every one of them side-scrolls on a phone |

Six rather than five, because the sixth is the only one that fails with
JavaScript on *and* off, and it fails hardest on exactly the connection the
document is about.

Three of the first five are the document's central quantitative claims. The
proposal argues that campaigns fail when they are built for the connected
minority; its own evidence is currently delivered at 5px to a reader on a
phone.

Not measured: no throttled-device session, no field testing. These are
computed from the stylesheet and the source, and should be confirmed on a real
handset.

---

## 6. Placeholder register

23 marked placeholders in two classes. Both must survive every later phase
visibly. `/drift` and `content-integrity` check against this table.

### Class A — bracketed inserts (17)

The document asserts in `assumptions.md:20` that there are 17. There are
exactly 17. That claim currently holds.

| # | Location | Placeholder |
|---|---|---|
| 1 | `governance.md` | `[Insert SLA — recommend 14 days]` |
| 2 | `governance.md` | `[Insert named Kenyan data-protection / electoral-law specialist — to be appointed by the campaign]` |
| 3 | `measurement.md` | `[Insert — independent Kenyan qualitative research facilitator; Firefly to recommend, campaign to appoint]` |
| 4 | `messaging.md` | `[Insert verified number]` |
| 5 | `risk.md` | `[Insert specified hardware security key model — two keys per critical account holder for redundancy]` |
| 6 | `risk.md` | `[Insert vendor — selected at contracting]` |
| 7 | `roadmap.md` | `[Insert baseline audit results — Week 1 deliverable]` |
| 8 | `roadmap.md` | `[Insert target]` |
| 9 | `roadmap.md` | `[Insert — native-speaker developed]` |
| 10 | `scope-data.md` | `[Insert shortcode]` |
| 11 | `scope-ground.md` | `[Insert shortcode]` |
| 12–14 | `scope-platforms.md` | `[Insert shortcode]` ×2, `[Insert threshold — recommend 1.5% CTR]` |
| 15 | `scope-platforms.md` | `[Insert additional authentic Kikamba proverbs and phrases — all to be reviewed and corrected by a native speaker before any publication. The examples above are working drafts, not verified copy.]` |
| 16 | `scope-platforms.md` | `[Insert — Kenya National Association of the Deaf or an accredited interpreter service]` |
| 17 | `structure.md` | `[Insert threshold — recommend 150/day]` |

### Class B — "Awaiting campaign decision" (6)

| # | Location | Decision pending |
|---|---|---|
| 1 | `scope-data.md:261` | Africa's Talking vs. Safaricom SDP Enterprise |
| 2 | `scope-data.md:271` | Custom PostgreSQL vs. open-source CiviCRM |
| 3 | `scope-data.md:283` | Monthly software subscription allocation |
| 4 | `scope-data.md:293` | Technical hosting environment sign-off |
| 5 | `scope-data.md:304` | Design mockups and domain registration |
| 6 | `scope-data.md:348` | *(in-diagram reference to the marker itself)* |

Occurrence 6 sits **inside** a fenced block. Any conversion of that block must
carry the phrase through verbatim and visibly.

---

## 7. Vernacular register

Not asked for, but `content-integrity` cannot do its job without it. Every
Kikamba string in the repo, in full. Nothing outside this list may appear
anywhere, and none of these may be altered by a byte.

Canonical source: `data/ussd-specimen.ts`.

| Key | Kikamba | English gloss |
|---|---|---|
| header | `KITUI NA MULU` | — |
| 1 | `Sisemo sya Mulu` | Mulu's plan for my ward |
| 2 | `Andikithya kuvota` | Voter registration info |
| 3 | `Ripoti wia` | Report a local issue |
| 4 | `Kuthukuma` | Volunteer |
| 5 | `Kwithukiisya` | Get updates (opt-in) |
| 6 | *(none — English label)* | Kiswahili / English |

The same seven strings appear as character art at `scope-ground.md:307` and
`scope-platforms.md:221`. Converting either block means reusing these exact
bytes, not retyping them.

The four-stage review chain the document claims for this copy is in
`data/ussd-specimen.ts:71-74`. Placeholder 15 above states in the document's
own words that the proverbs are working drafts, not verified copy — which is
the claim a generated string would destroy.

---

## Appendix A — measured payload

Not part of the six items, recorded because it outranks them.

```
next build, production, single route /[[...slug]]

First Load JS          421 kB gzipped      budget 300 kB    FAIL  (+40%)
Route size             319 kB
All static JS          597 kB gzipped      (raw 1.99 MB)
Largest chunk          197 kB gzipped
Shared baseline        103 kB gzipped
```

`framer-motion`, `motion` and `recharts` are all in the dependency graph.
Every later phase adds to this number, and no phase after this one can tell
you which change moved it while the starting point is already failing.

Not measured: LCP, INP, CLS, or anything on Slow 4G with 4× CPU throttling.
Those need a served build against a throttled profile and belong to `/perf`.

---

## State

Audit only. Nothing converted. 32 diagrams, one map, and one payload problem
outstanding.


---

# Appendix B — revision 1, retained in full

Written in an earlier session, before `lib/ascii-diagram.ts` and
`DiagramViewer` were measured against the blocks they render. Its per-block
inventory with line ranges is accurate and useful; its claims about how those
blocks currently *render* are superseded by the corrections above.

### 1. Fenced ASCII / <pre> Character-Art Diagrams

Total fenced ASCII/character-art diagrams identified: **83 instances** across 19 markdown files.

| # | File Path | Section / Heading | Line Range | Description | Difficulty |
|---|---|---|---|---|---|
| 1 | `public/content/assumptions.md` | 15.2 Regulatory guidance still outstanding | L53–L65 (11 lines, max 84 cols) | • Architecture: Relational, AES-256 encrypted voter model... | **structural** |
| 2 | `public/content/audiences.md` | Pre-section | L8–L25 (16 lines, max 84 cols) | KITUI COUNTY AUDIENCE ARCHITECTURE OVERVIEW | **complex** |
| 3 | `public/content/audiences.md` | 5.1 The six voter segments | L29–L33 (3 lines, max 79 cols) | ELECTORAL SEGMENTATION MASTER MATRIX | **simple** |
| 4 | `public/content/audiences.md` | 5.2 Segment sizing, and the evidence for it | L124–L148 (23 lines, max 111 cols) | AUDIENCE SEGMENT COMPARATIVE SUMMARY MATRIX | **complex** |
| 5 | `public/content/audiences.md` | 5.3 Segment research still outstanding | L160–L171 (10 lines, max 84 cols) | • Audience Architecture: 95.2% Rural, 4.8% Urban, ~44% Yo... | **structural** |
| 6 | `public/content/governance.md` | 12.2 Cadence and the meeting rhythm | L57–L79 (21 lines, max 111 cols) | CAMPAIGN LEADERSHIP GOVERNANCE CADENCE | **complex** |
| 7 | `public/content/governance.md` | 12.2 Cadence and the meeting rhythm | L81–L92 (10 lines, max 86 cols) | • Agile Architecture:  The campaign's four-person core st... | **structural** |
| 8 | `public/content/governance.md` | 12.4 The escalation path | L115–L139 (23 lines, max 80 cols) | THREE-TIER ESCALATION PROTOCOL | **complex** |
| 9 | `public/content/measurement.md` | 11.1.1 Stage 1: the nomination-window scorecard | L12–L39 (26 lines, max 112 cols) | NOMINATION WINDOW KEY PERFORMANCE INDICATORS | **complex** |
| 10 | `public/content/measurement.md` | 11.1.2 Stage 2: the general election scorecard | L45–L77 (31 lines, max 112 cols) | GENERAL ELECTION KEY PERFORMANCE INDICATORS (≥ 200,000 VO... | **complex** |
| 11 | `public/content/measurement.md` | 11.1.3 The indicator framework, anchored to the vote threshold | L87–L111 (23 lines, max 70 cols) | VICTORY-ANCHORED KPI MONITORING ARCHITECTURE | **complex** |
| 12 | `public/content/measurement.md` | 11.2 Indicators, and why these | L119–L133 (13 lines, max 85 cols) | EMPIRICAL RESEARCH & SERVICE-DELIVERY TRACKER | **complex** |
| 13 | `public/content/measurement.md` | 11.2.1 The research programme and the nomination tracking poll | L139–L172 (32 lines, max 100 cols) | RECOGNITION-DEFICIT RESEARCH ARCHITECTURE | **complex** |
| 14 | `public/content/measurement.md` | 11.2.2 The service-delivery performance tracker | L187–L210 (22 lines, max 112 cols) | PUBLIC SERVICE-DELIVERY TRACKER ARCHITECTURE | **complex** |
| 15 | `public/content/measurement.md` | Dual Operational Function: | L220–L234 (13 lines, max 93 cols) | • Section 11.2.1 (Research):   Deploys N 1,600 CATI poll ... | **structural** |
| 16 | `public/content/measurement.md` | 11.2.4 Performance governance and executive escalation | L252–L266 (13 lines, max 91 cols) | • Zero Vanity Metrics:         Explicitly bans social fol... | **structural** |
| 17 | `public/content/messaging.md` | 7.1 The narrative spine and message architecture | L10–L30 (19 lines, max 84 cols) | CAMPAIGN MESSAGE ARCHITECTURE HIERARCHY | **complex** |
| 18 | `public/content/messaging.md` | 7.1.1 The central claim and its three pillars | L34–L46 (11 lines, max 79 cols) | CENTRAL CAMPAIGN CLAIM & SLOGAN | **complex** |
| 19 | `public/content/messaging.md` | 7.1.2 Message assignment by segment | L107–L142 (34 lines, max 112 cols) | MESSAGE-BY-DEMOGRAPHIC SEGMENT MATRIX | **complex** |
| 20 | `public/content/messaging.md` | 7.1.3 Message assignment by channel | L177–L203 (25 lines, max 115 cols) | MESSAGE-BY-CHANNEL MATRIX & EVIDENCE DEPLOYMENT | **complex** |
| 21 | `public/content/messaging.md` | 7.1.4 Counter-messaging against disinformation | L207–L232 (24 lines, max 79 cols) | GROUND RUMOR VS. FACTUAL COUNTER-FIRE PROTOCOL | **complex** |
| 22 | `public/content/messaging.md` | 7.1.4 Counter-messaging against disinformation | L234–L245 (10 lines, max 85 cols) | • Central Proposition: "The Proven Economist for Kitui's ... | **structural** |
| 23 | `public/content/messaging.md` | 7.3 Language, register and dialect | L332–L351 (18 lines, max 85 cols) | TRILINGUAL AUDIENCE & CHANNEL MATRIX | **complex** |
| 24 | `public/content/messaging.md` | 7.3.1 Which language reaches which voters, on which channel | L355–L380 (24 lines, max 111 cols) | TRILINGUAL AUDIENCE & CHANNEL MAPPING MATRIX | **complex** |
| 25 | `public/content/messaging.md` | 7.3.2 Register, dialect and the discipline it takes | L386–L404 (17 lines, max 112 cols) | CULTURAL REGISTERS & PROVERBIAL FRAMING PROTOCOL | **complex** |
| 26 | `public/content/messaging.md` | 7.3.3 The production and quality-control pipeline | L415–L441 (25 lines, max 80 cols) | MULTILINGUAL APPROVAL & SIGN-OFF CHAIN | **complex** |
| 27 | `public/content/messaging.md` | 7.3.4 Channel-by-language deployment | L445–L465 (19 lines, max 111 cols) | CHANNEL-BY-LANGUAGE DEPLOYMENT MATRIX | **complex** |
| 28 | `public/content/messaging.md` | 7.3.4 Channel-by-language deployment | L467–L480 (12 lines, max 89 cols) | • Trilingual Segmentation:     Kikamba drives grassroots ... | **structural** |
| 29 | `public/content/risk.md` | 13.1 Rapid-response protocol and opposition handling | L10–L30 (19 lines, max 85 cols) | RAPID RESPONSE DECISION & ESCALATION FLOW | **complex** |
| 30 | `public/content/risk.md` | 13.1.2 The four-tier response decision tree | L45–L68 (22 lines, max 111 cols) | RAPID RESPONSE DECISION MATRIX | **complex** |
| 31 | `public/content/risk.md` | 13.1.3 Response times, by channel | L72–L93 (20 lines, max 79 cols) | RAPID RESPONSE SLA BY CHANNEL | **complex** |
| 32 | `public/content/risk.md` | 13.1.4 Holding positions, pre-drafted | L99–L152 (52 lines, max 112 cols) | PRE-DRAFTED HOLDING POSITIONS & EVIDENCE CITATIONS | **complex** |
| 33 | `public/content/risk.md` | 13.1.5 Staying inside defamation law | L162–L173 (10 lines, max 90 cols) | • 4-Tier Decision Matrix:      Prevents elevating fringe ... | **structural** |
| 34 | `public/content/risk.md` | 13.5 Statutory and regulatory compliance | L427–L453 (25 lines, max 91 cols) | STATUTORY COMPLIANCE ARCHITECTURE | **complex** |
| 35 | `public/content/risk.md` | 13.5.1 The IEBC nomination and clearance checklist | L457–L488 (30 lines, max 111 cols) | IEBC STATUTORY NOMINATION CLEARANCE CHECKLIST | **complex** |
| 36 | `public/content/risk.md` | 13.5.2 Data protection and election offences liability | L492–L513 (20 lines, max 111 cols) | DPA 2019 & ELECTION OFFENCES STATUTORY MATRIX | **complex** |
| 37 | `public/content/scope-data.md` | 8.12 Workstream 11 — The data layer | L10–L30 (19 lines, max 85 cols) | CAMPAIGN DATA LAYER ARCHITECTURE | **complex** |
| 38 | `public/content/scope-data.md` | 8.12.1 The voter and supporter data model | L36–L65 (28 lines, max 79 cols) | SUPPORTER RECORD SCHEMA SPECIFICATION | **complex** |
| 39 | `public/content/scope-data.md` | 8.12.2 The Data Protection Act 2019, applied | L76–L100 (23 lines, max 83 cols) | DPA 2019 STATUTORY COMPLIANCE CHECKLIST | **complex** |
| 40 | `public/content/scope-data.md` | 8.14 Workstream 13 — The technology stack | L225–L245 (19 lines, max 84 cols) | CAMPAIGN TECHNOLOGY STACK ARCHITECTURE | **complex** |
| 41 | `public/content/scope-data.md` | 8.14.1 Component by component, and what each does | L249–L253 (3 lines, max 79 cols) | TECHNOLOGY STACK DETAILED SPECIFICATION | **simple** |
| 42 | `public/content/scope-data.md` | 8.14.2 The procurement matrix | L308–L329 (20 lines, max 88 cols) | TECHNOLOGY STACK MASTER PROCUREMENT MATRIX | **complex** |
| 43 | `public/content/scope-data.md` | 8.14.3 Technical risk and security protocols | L339–L350 (10 lines, max 87 cols) | • Modular Architecture: 5 integrated components connectin... | **structural** |
| 44 | `public/content/scope-ground.md` | 8.8 Workstream 7 — Ground-digital integration | L10–L38 (27 lines, max 84 cols) | CLOSED-LOOP FIELD & DIGITAL INTEGRATION ENGINE | **complex** |
| 45 | `public/content/scope-ground.md` | 8.8.1 What the 40 ward coordinators report | L44–L68 (23 lines, max 81 cols) | WARD COORDINATOR FIELD REPORTING PROTOCOL | **complex** |
| 46 | `public/content/scope-ground.md` | 8.8.2 From ground intel to a published response in four hours | L80–L104 (23 lines, max 84 cols) | THE 4-HOUR GROUND-TO-DIGITAL CYCLE | **complex** |
| 47 | `public/content/scope-ground.md` | 8.8.3 Distribution beyond social media | L110–L114 (3 lines, max 79 cols) | PHYSICAL & CIVIC DISTRIBUTION INFRASTRUCTURE | **simple** |
| 48 | `public/content/scope-ground.md` | 8.8.4 The operating rhythm | L149–L183 (33 lines, max 111 cols) | CAMPAIGN OPERATIONAL RHYTHM & GOVERNANCE CADENCE | **complex** |
| 49 | `public/content/scope-ground.md` | 8.8.4 The operating rhythm | L185–L198 (12 lines, max 84 cols) | • Closed-Loop Engine:   Field intel from 40 Ward Coordina... | **structural** |
| 50 | `public/content/scope-ground.md` | 8.9.1 Operating architecture and bidirectional sync | L212–L226 (13 lines, max 67 cols) | FIELD                                    DIGITAL | **complex** |
| 51 | `public/content/scope-ground.md` | 8.10.3 The USSD layer | L307–L315 (7 lines, max 57 cols) | KITUI NA MULU | **simple** |
| 52 | `public/content/scope-media.md` | 8.7.7 Getting on air around a hostile gatekeeper | L199–L226 (26 lines, max 111 cols) | THE GATEKEEPER BYPASS & DIRECT REACH ARCHITECTURE | **complex** |
| 53 | `public/content/scope-media.md` | 8.7.8 How we pitch: evidence first | L236–L250 (13 lines, max 89 cols) | • Structural Vulnerability:    Tier 1 commercial Kamba ra... | **structural** |
| 54 | `public/content/scope-platforms.md` | 8.2.3 What happens to a report | L55–L76 (20 lines, max 66 cols) | Report submitted (any channel) | **structural** |
| 55 | `public/content/scope-platforms.md` | 8.3 Workstream 2 — Content production and asset governance | L134–L154 (19 lines, max 84 cols) | CAMPAIGN 360° CONTENT PRODUCTION PIPELINE | **complex** |
| 56 | `public/content/scope-platforms.md` | 8.3.2 Formats, by channel | L181–L207 (25 lines, max 111 cols) | PRODUCTION FORMAT SPECIFICATIONS BY CHANNEL | **complex** |
| 57 | `public/content/scope-platforms.md` | C. USSD Interactive Menu Tree Structure (`*483*77#`) | L221–L230 (8 lines, max 51 cols) | *483*77  (Zero-Rated Gateway) | **complex** |
| 58 | `public/content/scope-platforms.md` | 8.3.4 The weekly production schedule | L236–L263 (26 lines, max 112 cols) | WEEKLY 7-DAY CONTENT PRODUCTION CYCLE | **complex** |
| 59 | `public/content/scope-platforms.md` | 8.3.5 Who approves what, and when | L269–L293 (23 lines, max 81 cols) | 4-STEP CONTENT APPROVAL GATEWAY | **complex** |
| 60 | `public/content/scope-platforms.md` | 8.3.6 The asset library | L299–L326 (26 lines, max 66 cols) | /CAMPAIGN_ASSET_REPOSITORY_2027/ | **complex** |
| 61 | `public/content/scope-platforms.md` | 8.3.6 The asset library | L328–L340 (11 lines, max 88 cols) | • Offline Broadcast Dominance: Content engine prioritizes... | **structural** |
| 62 | `public/content/situation.md` | 3.2.1 Every figure carries its provenance | L65–L78 (12 lines, max 79 cols) | TRI-PARTITE PROVENANCE MANDATE | **complex** |
| 63 | `public/content/situation.md` | 3.2.2 The three source tiers | L86–L107 (20 lines, max 79 cols) | THE THREE-TIER EVIDENTIAL CLASSIFICATION | **complex** |
| 64 | `public/content/situation.md` | 3.2.3 When two sources disagree | L118–L137 (18 lines, max 78 cols) | FOUR-STEP CONFLICT RESOLUTION PROTOCOL | **complex** |
| 65 | `public/content/situation.md` | The Incumbent Term-Limit Constitutional Question: A Dual-Branch Strategic Scenario | L198–L215 (16 lines, max 91 cols) | GOVERNOR MALOMBE'S 2027 CONSTITUTIONAL STATUS | **complex** |
| 66 | `public/content/situation.md` | 3.4 The vote arithmetic | L386–L423 (36 lines, max 90 cols) | KITUI COUNTY ELECTORAL REGISTER (532,758 VOTERS) | **complex** |
| 67 | `public/content/situation.md` | 3.4.1 The number of votes it takes | L436–L446 (9 lines, max 79 cols) | THE 2027 VICTORY THRESHOLD ARITHMETIC | **complex** |
| 68 | `public/content/situation.md` | 3.4.3 Four routes to the threshold, with the working shown | L506–L525 (18 lines, max 79 cols) | FOUR STRUCTURAL PATHS TO THE 200,000 VOTER POOL | **complex** |
| 69 | `public/content/situation.md` | 3.4.4 The constituencies that decide it | L563–L583 (19 lines, max 79 cols) | CONSTITUENCY STRUCTURAL POWER RANKING | **complex** |
| 70 | `public/content/situation.md` | Candidate Recognition Baseline & Deficit Geography: | L602–L626 (23 lines, max 86 cols) | CROSS-MATCHING RECOGNITION DEFICITS WITH DECISIVE VOTER C... | **complex** |
| 71 | `public/content/situation.md` | 3.4.6 What ward-level data we still do not have | L664–L678 (13 lines, max 91 cols) | • Registered Electorate:    532,758 voters across 40 ward... | **structural** |
| 72 | `public/content/situation.md` | 3.6 Channel reach and the digital ceiling | L788–L803 (14 lines, max 90 cols) | KITUI COUNTY ELECTORATE REACHABILITY AUDIT | **structural** |
| 73 | `public/content/situation.md` | 3.6.1 The connected minority, and its limits | L814–L818 (3 lines, max 79 cols) | SECTION 3.6.1: CONNECTED MINORITY CHANNELS | **simple** |
| 74 | `public/content/situation.md` | 3.1.1.1 Platform Sizing & Realistic In-County Reach | L824–L845 (20 lines, max 111 cols) | DIGITAL PLATFORM IN-COUNTY SIZING MATRIX | **complex** |
| 75 | `public/content/situation.md` | 3.6.2 The offline majority, and the infrastructure that reaches it | L860–L864 (3 lines, max 79 cols) | SECTION 3.6.2: OFFLINE MAJORITY CHANNELS | **simple** |
| 76 | `public/content/situation.md` | 3.6.2 The offline majority, and the infrastructure that reaches it | L868–L892 (23 lines, max 111 cols) | OFFLINE CHANNEL REACH & CAPACITY AUDIT | **complex** |
| 77 | `public/content/situation.md` | 3.6.3 Weight against reach | L935–L939 (3 lines, max 79 cols) | EFFORT WEIGHTING VS. ELECTORAL REACH REALITY AUDIT | **simple** |
| 78 | `public/content/situation.md` | 3.6.3 Weight against reach | L951–L973 (21 lines, max 111 cols) | CAMPAIGN RESOURCE REBALANCING AUDIT | **complex** |
| 79 | `public/content/situation.md` | 3.6.3 Weight against reach | L975–L987 (11 lines, max 84 cols) | • The Digital Ceiling: Digital reaches ~72,000 voters (13... | **structural** |
| 80 | `public/content/situation.md` | 3.7 Media ownership and access to air | L997–L1015 (17 lines, max 86 cols) | KAMBA RADIO LANDSCAPE & BYPASS ARCHITECTURE | **complex** |
| 81 | `public/content/structure.md` | Pre-section | L6–L39 (32 lines, max 84 cols) | LEAN CORE   SPECIALIST VENDOR MODEL | **complex** |
| 82 | `public/content/structure.md` | 14.5 Leadership roles and who owns what | L103–L130 (26 lines, max 111 cols) | CORE CAMPAIGN ROLES & OWNERSHIP MATRIX | **complex** |
| 83 | `public/content/structure.md` | 14.6 Reporting lines | L136–L160 (23 lines, max 62 cols) | Dr. Makali Mulu | **structural** |

---

### 2. Table Inventory & Semantic Markup Analysis

#### A. Markdown Pipeline Tables (Content Files)
Total Markdown pipe tables: **60 tables** across 14 content files.
- **Rendering Mechanism:** Rendered via `InteractiveTable.tsx` (`components/markdown/InteractiveTable.tsx`).
- **Semantic Status:** 
  - **Desktop / SSR Viewport:** Fully semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` with interactive sort triggers and search filtering.
  - **Mobile Viewport (<768px):** Transformed into **faked `<div>` card stacks** (`space-y-2.5`) with header badges and paired key-value rows to eliminate horizontal scrolling on phone screens.

| # | File Path | Section / Context | Rows | Header Sample | Markup Model |
|---|---|---|---:|---|---|
| 1 | `public/content/assumptions.md` | The marked placeholders, in one list | 10 | `/ What is needed / Where it appears / From whom /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 2 | `public/content/deliverables.md` | 10.1.1 The three scope levels | 6 | `/ Term / Means / Where it is set /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 3 | `public/content/deliverables.md` | 10.1.2 The scope levels compared | 10 | `/ / Lean / Standard / Premium /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 4 | `public/content/deliverables.md` | 10.2 The deliverables schedule | 21 | `/ Deliverable / Cadence / Form / Where it is set /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 5 | `public/content/governance.md` | 12.2 Cadence and the meeting rhythm | 10 | `/ Cadence / Meeting / Participants / Output /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 6 | `public/content/governance.md` | 12.3 Decision rights and content approval | 10 | `/ Content type / Approver / Turnaround /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 7 | `public/content/governance.md` | 12.5.2 The regulatory environment as it stands | 6 | `/ Area / Requirement / Source /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 8 | `public/content/governance.md` | 12.5.3 Compliance measures | 9 | `/ Area / Requirement / Implementation /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 9 | `public/content/governance.md` | 12.5.5 The compliance sign-off gate | 7 | `/ Step / Owner / Output /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 10 | `public/content/measurement.md` | 11.3.1 Rationale, structure and zone coverage | 8 | `/ Element / Specification /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 11 | `public/content/measurement.md` | 11.3.2 Qualitative hypotheses, feedback loops and KPIs | 6 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 12 | `public/content/messaging.md` | 7.1.2 Message assignment by segment | 9 | `/ Voter Segment / Demographics & Primary Hubs /...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 13 | `public/content/messaging.md` | 7.2.2 The principles we apply | 10 | `/ Principle / Definition / Campaign application /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 14 | `public/content/risk.md` | 13.2.1 War room operating model, shift coverage and dashboard view | 5 | `/ Shift / Hours (EAT) / Focus /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 15 | `public/content/risk.md` | 13.2.2 Monitoring tools | 10 | `/ Tool class / Function /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 16 | `public/content/risk.md` | 13.2.3 Rapid-response protocol and pre-approved message library | 5 | `/ Severity / Definition / Response time / Appro...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 17 | `public/content/risk.md` | 13.2.4 Red-team drills | 8 | `/ # / Scenario / Tests /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 18 | `public/content/risk.md` | 13.3.2 Account security baseline | 9 | `/ Control / Standard / Applies to /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 19 | `public/content/risk.md` | 13.3.4 The incident response plan | 8 | `/ Phase / Action / Owner / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 20 | `public/content/risk.md` | 13.3.5 The deepfake and manipulated media protocol | 8 | `/ Minute / Action /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 21 | `public/content/risk.md` | 13.4.2 Monitoring tools | 8 | `/ Tool / Function /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 22 | `public/content/roadmap.md` | 9.1.1 Phase −1: Nomination Sprint — August–September 2026 | 15 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 23 | `public/content/roadmap.md` | 9.1.3 Phase 1: Awareness and Community Building — October–December 2026 | 13 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 24 | `public/content/roadmap.md` | 9.1.4 Phase 2: Engagement and Persuasion — January–March 2027 | 13 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 25 | `public/content/roadmap.md` | 9.1.5 Phase 3: Mobilisation and GOTV — April–August 2027 | 15 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 26 | `public/content/roadmap.md` | 9.2.2 The sequenced calendar | 10 | `/ Phase / Target constituencies / Engagement / ...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 27 | `public/content/roadmap.md` | 9.2.4 Coalition KPIs | 6 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 28 | `public/content/scope-data.md` | 8.13.3 Modelling methodology | 6 | `/ Model / Purpose / Strength /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 29 | `public/content/scope-data.md` | 8.13.4 Model variables | 25 | `/ Variable / Description / Source / Type / Form...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 30 | `public/content/scope-data.md` | 8.13.5 How the model is evaluated | 8 | `/ Metric / Target / Frequency /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 31 | `public/content/scope-data.md` | 8.15.1 Attribution model and offline conversion tracking | 11 | `/ Touchpoint / Attribution method / Source /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 32 | `public/content/scope-data.md` | 8.15.2 Key metrics and benchmarks | 9 | `/ Metric / Definition / Global benchmark / Camp...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 33 | `public/content/scope-data.md` | 8.15.3 The analytics maturity roadmap | 7 | `/ Stage / Window / Capability / Prerequisite / ...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 34 | `public/content/scope-ground.md` | 8.10.2 The SMS layer | 8 | `/ Type / Frequency / Example structure /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 35 | `public/content/scope-ground.md` | 8.10.6 KPIs for the offline layer | 7 | `/ Metric / Phase −1 / Phase 1 / Phase 2 / Phase...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 36 | `public/content/scope-ground.md` | 8.11.2 Volunteer tiers | 6 | `/ Tier / Name / Entry requirement / Activities /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 37 | `public/content/scope-ground.md` | 8.11.3 Gamification mechanics | 6 | `/ Mechanic / Implementation / Reward /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 38 | `public/content/scope-ground.md` | 8.11.5 Volunteer KPIs | 9 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 39 | `public/content/scope-media.md` | 8.7.1 The radio problem, stated plainly | 11 | `/ Station / Kitui frequency / Ownership associa...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 40 | `public/content/scope-media.md` | 8.7.2 The journalist relationship programme | 6 | `/ Tier / Who / Cadence / Offer /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 41 | `public/content/scope-media.md` | 8.7.4 The debate and forum playbook | 10 | `/ Time / Action / Owner /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 42 | `public/content/scope-media.md` | 8.7.5 Pre-drafted response lines | 10 | `/ Likely attack / Response structure /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 43 | `public/content/scope-media.md` | 8.7.6 Earned media KPIs | 8 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 44 | `public/content/scope-platforms.md` | 8.2.2 What it is | 7 | `/ Channel / Access route /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 45 | `public/content/scope-platforms.md` | 8.2.7 Tracker KPIs | 8 | `/ Metric / Phase 1 / Phase 2 / Phase 3 /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 46 | `public/content/scope-platforms.md` | 8.4.2 Tools and platforms | 7 | `/ Tool / Function / Management /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 47 | `public/content/scope-platforms.md` | 8.4.4 Performance benchmarks | 9 | `/ Metric / Global standard / Campaign target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 48 | `public/content/scope-platforms.md` | 8.5 Workstream 4 — Accessibility and inclusion | 5 | `/ Language / Share / Primary use /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 49 | `public/content/scope-platforms.md` | 8.5.3 The commitments | 9 | `/ Area / Commitment /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 50 | `public/content/scope-platforms.md` | 8.5.5 Accessibility KPIs | 8 | `/ Metric / Target /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 51 | `public/content/situation.md` | 3.3.1 The candidate's record | 8 | `/ Asset / Sourced Empirical Evidence / Strategi...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 52 | `public/content/situation.md` | The Defining Digital and Telecommunications Constraints (KNBS & CA Sourced): | 6 | `/ Connectivity Metric / Sourced Kitui County Va...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 53 | `public/content/situation.md` | Comprehensive 40-Ward Registration Ranking (Official 2022 IEBC Register, Tier 1) | 42 | `/ Rank / Ward / Constituency / Registered Voter...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 54 | `public/content/situation.md` | 3.5.1 The urban and central anchor: Kitui Central and Kitui West | 6 | `/ Sub-County / Population / Density/km² / House...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 55 | `public/content/situation.md` | 3.5.2 The northern block: Mwingi | 7 | `/ Sub-County / Population / Density/km² / House...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 56 | `public/content/situation.md` | 3.5.3 The arid and resource belt: Kitui South and East | 8 | `/ Sub-County / Population / Density/km² / House...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 57 | `public/content/situation.md` | 3.5.4 How the zones are weighted | 6 | `/ Zone / Share of population / Phase −1 (nomina...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 58 | `public/content/structure.md` | 14.3 The core team, retained throughout | 5 | `/ Role / Function / Decision rights /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 59 | `public/content/structure.md` | 14.4 Surge roles, activated by phase and scope level | 9 | `/ Role / Activated / Function /` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |
| 60 | `public/content/summary.md` | 2.2 The governing constraint | 4 | `/ Survey / Kasalu / **Mulu** / Ngilu / Wambua /...` | Hybrid (Desktop `<table>` / Mobile `<div>` cards) |

#### B. Component-Level Tables & Matrices

| Component Path | Structural Role | Markup Implementation | Analysis |
|---|---|---|---|
| `components/markdown/InteractiveTable.tsx` | Master markdown table wrapper | **Hybrid**: Semantic `<table>` on desktop, faked with `<div>` cards on mobile | Prevents mobile overflow; breaks native table accessibility semantics on mobile screen-readers. |
| `components/charts/DeficitGauge.tsx` | Margin deficit breakdown | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Accessible semantic table with numeric alignment. |
| `components/charts/VoteFunnel.tsx` | Voter conversion stages | **Semantic `<table>`** with `<tbody>`, `<tr>`, `<th>`, `<td>` | Tabular metric stages with progress bar indicators. |
| `components/charts/WardRegisterTicker.tsx` | 40-ward voter roll | **Faked with `<div>`** flex/grid rows | Uses styled div containers for marquee/ticker animation rather than tabular semantics. |
| `components/markdown/AsciiDiagram.tsx` | Parsed ASCII table fallback | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Structured box-drawing parser transforms monospace rows into real HTML tables. |
| `components/markdown/AudienceSegmentationMatrix.tsx` | Demographic voter segments | **Faked with `<div>`** grid (`grid-cols-1 md:grid-cols-3`) | Segment cards with icon headers and bullet lists. |
| `components/markdown/ConstituencyWeightBlockContent.tsx` | 8-constituency voting weights | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Strict numeric ledger with percentage calculations. |
| `components/markdown/ElectoralHistoryPanel.tsx` | 2013–2022 historical election data | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Multi-election historical audit table. |
| `components/markdown/ElectoralTimelineBlockContent.tsx` | Statutory election milestones | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Milestone dates, legal mandates, and compliance owners. |
| `components/markdown/FiscalAuditChartBlockContent.tsx` | Kitui county budget allocation | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Financial accounting breakdown with fiscal line items. |
| `components/markdown/FiscalAuditPanel.tsx` | County fiscal performance audit | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Full fiscal comparative table. |
| `components/markdown/GeographicZoneMatrix.tsx` | Zone allocations & turnout targets | **Faked with `<div>`** grid layout | Visual card matrix with geographic badges. |
| `components/markdown/MatrixMarks.tsx` | Interactive scatter/mark view | **Faked with `<div>`** flex layout | Visual data-point plotter toggleable from InteractiveTable. |
| `components/markdown/MediaOwnershipBlockContent.tsx` | Kitui radio station reach & ownership | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Tabular station roster with audience shares. |
| `components/markdown/PathTo200kBlockContent.tsx` | 200k victory path arithmetic | **Semantic `<table>`** with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Arithmetic ledger with voter targets per constituency. |
| `components/markdown/PersuasionFramingMatrix.tsx` | Message framing by voter archetype | **Faked with `<div>`** grid layout | Messaging matrix using responsive column cards. |
| `components/markdown/StrategicPillarsMatrix.tsx` | Five campaign policy pillars | **Faked with `<div>`** grid layout | Policy pillar card deck with priority badges. |

---

### 3. Hard-Coded Tokens & Recurrence Frequency

#### A. Hard-Coded Colours
Total unique hardcoded color values: **171 unique values**.

#### High Recurrence (≥ 10 occurrences)
- `#ffffff` / `#fff`: **52 occurrences** (Pure white surfaces, SVG icon fills, card backings).
- `#e31d2b`: **15 occurrences** (Campaign red accent, alert states, competitor markers).
- `#0b1a30`: **12 occurrences** (Dark navy background token in terminal and phone frame chassis).
- `#0056a8`: **11 occurrences** (Azimio / Jubilee party corporate blue).
- `#00209f`: **11 occurrences** (Wiper Democratic Movement brand blue).
- `#000000` / `#000`: **14 occurrences** (Pure black text and border overrides).

#### Medium Recurrence (4 to 9 occurrences)
- `#8295a9`: **6 occurrences** (Muted blue-grey border/line accent).
- `rgba(0, 0, 0, 0.13)`: **5 occurrences** (Subtle shadow/divider wash).
- `#4e6178`: **4 occurrences** (Secondary text slate).
- `#b45309`: **4 occurrences** (Amber warning/disputed figure badge).
- `rgba(0, 0, 0, 0.55)`: **4 occurrences** (Scrim overlay wash).
- `#667781`: **4 occurrences** (WhatsApp metadata timestamp gray).
- `#54656f`: **4 occurrences** (WhatsApp secondary text gray).
- `#25d366`: **3 occurrences** (WhatsApp official brand green).
- `#ffd700` / `#f59e0b`: **3 occurrences** (Gold / Amber campaign accent).

#### Low Recurrence (1 to 2 occurrences)
- 152 single-use hex/rgba values found predominantly in simulated phone interface mockups (`phone/screens/*`) and Recharts stroke/fill properties.

---

#### B. Hard-Coded Font Sizes
Total unique hardcoded font size declarations: **35 unique sizes**.

#### High Recurrence (≥ 10 occurrences)
- `10px` / `text-[10px]`: **27 occurrences** (Micro badges, timestamp labels, chart axis ticks).
- Fluid/computed values (`0.625px`, `0.5625px`, `0.6875px`, `0.75px`, `0.78125px`, `0.84375px` rem conversions): **98 occurrences** across SVG elements and responsive typography hooks.
- `9px` / `text-[9px]`: **11 occurrences** (Sub-micro labels in simulated terminal and phone screens).

#### Medium Recurrence (4 to 9 occurrences)
- `16px`: **5 occurrences** (Standard body scale overrides in mockups).
- `11px` / `text-[11px]`: **3 occurrences** (Floating badge labels).
- `8px` / `text-[8px]`: **3 occurrences** (Smallest SVG chart tick annotations).
- `12px` / `text-[12px]`: **3 occurrences** (Input field and button sub-labels).
- `14px`: **3 occurrences** (Table cell typography overrides).

#### Low Recurrence (1 to 2 occurrences)
- Display scale overrides: `text-[4.75rem]`, `text-[5.5rem]` (`NominationVerdict.tsx`), `text-[8rem]` (Watermark numbers in `MarkdownViewer.tsx`).

---

#### C. Hard-Coded Spacing Values
Total unique arbitrary spacing classes: **75 unique values**.

#### High Recurrence (≥ 10 occurrences)
- `min-h-[44px]`: **53 occurrences** (WCAG AA touch target compliance on buttons, inputs, tabs, and filters).
- `min-w-[44px]`: **28 occurrences** (WCAG AA touch target width on icon buttons and navigation chips).

#### Medium Recurrence (2 to 9 occurrences)
- `max-w-[220px]`: **3 occurrences** (Phone simulator column widths).
- `max-w-[85%]`: **3 occurrences** (Chat bubble max widths).
- `h-[3px]` / `w-[3px]`: **3 occurrences** (Decorative bullet / timeline node pips).
- `h-[240px]`: **2 occurrences** (Chart container fixed heights).
- `w-[480px]`: **2 occurrences** (Desktop mockup wrappers).
- `h-[150px]`: **2 occurrences** (Mini-chart and card frame heights).
- `h-[190px]`: **2 occurrences** (Terminal screen heights).
- `min-h-[32px]`: **2 occurrences** (Compact chip heights).
- `min-h-[52px]`: **2 occurrences** (Prominent CTA heights).
- `left-[15px]`: **2 occurrences** (Timeline alignment offsets).

---

#### D. Hard-Coded Durations
Total unique transition/animation durations: **11 unique values**.

#### High / Medium Recurrence
- `0.01s` / `10ms`: **4 occurrences** (Near-instant layout spring transitions).
- `0.08s` / `0.09s`: **4 occurrences** (Rapid hover and ripple transitions).
- `0.2s` / `200ms`: **2 occurrences** (Card expand/collapse durations).
- `0.34s` / `340ms`: **2 occurrences** (H3 heading entrance elevation).

#### Specialized / Long Durations
- `150s`: **1 occurrence** (Marquee continuous background drift).
- `26s`, `32s`, `38s`: **3 occurrences** (Staggered ambient particle loop durations).
- `0.5s` / `500ms`: **1 occurrence** (Modal backdrop fade).

---

### 4. Bespoke Visual Components & Established Patterns

The codebase establishes distinct, reusable visual patterns across 39 mounted insertions and core application chrome:

#### 1. The TAC-40 Terminal Emulator (`TerminalFrame.tsx`, `TerminalShowcase.tsx`, `terminal/screens/*`)
- **Pattern:** Rigorous retro-tactical command interface. Monospace typography, CRT phosphor glow effects, live status tickers, command prompt cues, and tabular operational data feeds.
- **Role:** Grounds the "ground operations" narrative (§8.8) in an authoritative, real-time command-and-control visual language.

#### 2. The Multi-Channel Handset & USSD Simulator (`PhoneFrame.tsx`, `PhoneShowcase.tsx`, `FeaturePhoneSpecimen.tsx`, `phone/screens/*`)
- **Pattern:** True-to-scale mobile handset bezel with interactive channel tabs (USSD, WhatsApp, SMS, Radio Audio, Social feeds).
- **Role:** Demonstrates how Dr. Mulu's message physically renders on both low-cost feature phones (monochrome USSD) and smartphones (§3.6).

#### 3. The Offline / Connected Waterline (`OfflineWaterline.tsx`, `ReachSplit.tsx`)
- **Pattern:** High-contrast bifurcated progress bar and split visualizer separating the 86.4% offline population from the 13.6% connected minority.
- **Role:** Serves as the central architectural proof of the core thesis (§3.3.5)—visually dramatizing why digital-only campaigns fail in Kitui.

#### 4. Interactive Ledger & Arithmetic Blocks (`PathTo200kBlock.tsx`, `PathTo200kCalculator.tsx`, `ConstituencyWeightBlock.tsx`)
- **Pattern:** Tabular arithmetic balance sheets with dynamic sliders, margin gap gauges, and instant formula re-calculation.
- **Role:** Speaks directly to Dr. Mulu's economist background, replacing abstract political claims with verifiable electoral accounting (§3.4.3).

#### 5. Spatial Cartogram & Demographic Heatmaps (`WardCartogram.tsx`, `WardCartogramBlock.tsx`, `GeographicZoneMatrix.tsx`)
- **Pattern:** 40-ward topological grid colored by turnout potential and margin targets, featuring tap-to-inspect drawers and sync with IEBC baselines.
- **Role:** Replaces standard geographic maps with voter-weighted geometric cells, illustrating strategic density rather than empty land area (§3.3.3).

#### 6. Interactive Table Engine with Viewport Adaptation (`InteractiveTable.tsx`, `MatrixMarks.tsx`)
- **Pattern:** Searchable, sortable tabular grid with statistical summary drawer (Avg, Max, Sum) and scatter-plot mark mode; automatically transforms into stacked paired cards on mobile.
- **Role:** Standardizes all 60 markdown tables into interactive data exploration stations.

#### 7. Non-Occluding Reading & Theme Controls (`SectionStickyBar.tsx`, `ReadingSettingsSheet.tsx`, `MobileBottomNav.tsx`)
- **Pattern:** Ambient scroll-aware navigation chrome with "Zero Chrome" mode, font size adjusters, and dark/light/contrast toggles.
- **Role:** Empowers the reader to strip away chrome for focused long-form reading on constrained mobile screens.

---

### 5. Five Sections Where a Reader on a Phone Would Most Likely Give Up

#### 1. §3.4.3: Four Structural Paths to the Threshold (`public/content/situation.md`, Lines 506–525)
- **Failure Cause:** **Massive Monospace Table Overflow (105 columns wide, 820px min-width).**
- **Mobile Experience:** Renders a huge ASCII box-drawing arithmetic table detailing the four turnout scenarios to 200,000 votes. On a 360px phone screen, this preformatted block triggers severe horizontal overflow, requiring the reader to pan back and forth blindly across 5 columns. The numbers dissociate from their constituency row headers.
- **Economist Reader Impact:** Dr. Mulu cannot inspect the arithmetic coherence without extreme physical friction, undermining the campaign's central mathematical case.

#### 2. §8.15.2: Model Variables Dictionary & Feature Matrix (`public/content/scope-data.md`, Lines 140–280)
- **Failure Cause:** **Vertical Card Fatigue (3,200px Continuous Scroll) or Extreme Column Pinching.**
- **Mobile Experience:** Contains a 23-row by 5-column table of voter modeling variables (`Support/Undecided/Oppose/No (4-way)`, `cost-per-persuaded-voter`). When rendered through the mobile card unrolling pipeline, this produces 23 tall cards that consume over 3,000 vertical pixels. 
- **Reader Impact:** Navigating past this section requires dozens of thumb flings. The reader loses narrative continuity and is likely to close the tab out of scroll exhaustion.

#### 3. §3.3.3: 40 Wards Register & Electoral Weight Ledger (`public/content/situation.md`, Lines 240–380)
- **Failure Cause:** **Cognitive & DOM Overload on Low-Memory Mobile Browsers.**
- **Mobile Experience:** Presents all 40 IEBC administrative wards with voter counts, target margins, and turnout ratios. Rendering 40 detailed cards or a wide table alongside the Ward Cartogram and Path to 200k Block creates high layout contention, stuttering scroll frames (dropping well below 60fps on 4G Android devices), and overwhelming density.
- **Reader Impact:** On a mid-range phone over an 8 Mbps connection, the sudden surge in DOM nodes and paint complexity induces touch lag, tempting the reader to abandon the page.

#### 4. §12.5: Digital Ethics, Consent & Data Governance Charter (`public/content/governance.md`, Lines 180–310)
- **Failure Cause:** **Monolithic 694-Word Unbroken Prose Wall.**
- **Mobile Experience:** Represents the single longest uninterrupted text block in the entire document. On a 360–412px screen, 694 words equal approximately 8 to 10 full viewport heights of dense, uniform, legalistic typography without visual breaks, metric callouts, diagrams, or intermediate headings.
- **Reader Impact:** A senior principal reading while distracted or on the move will experience immediate cognitive fatigue from the unbroken visual monotony.

#### 5. §10.1–§10.1.2: Deliverables, Service Level Selector & Tier Comparison (`public/content/deliverables.md`, Lines 50–190)
- **Failure Cause:** **Horizontal Tier Squeeze & Sticky Chrome Viewport Occlusion.**
- **Mobile Experience:** Compares three intricate operational service tiers (Lean, Standard, Premium) across multiple deliverables. Side-by-side columns on mobile compress into unreadable 65px-wide strips with severe single-word hyphenation. When switched to a tabbed or carousel view, comparing Tier 1 vs Tier 3 requires continuous toggling while pinned top bars (toolbar + sticky section bar) occlude up to 27% of the viewport.
- **Reader Impact:** The decision-making comparison becomes frustrating to parse, obscuring the exact scope Firefly is proposing to deliver.
