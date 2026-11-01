# Consolidation pass, November 2026: decision log

Every judgement call this pass made, the rule it applied, and where the change landed. Steps follow
the consolidation brief: Step 0 set-up, Step 1 contradictions, Step 2 one source per number, Step 3
the legacy figure system, Step 4 section merges, Step 5 the model reads the site, Step 6 guards.

The owner's standing rules are cited by number:

1. No text is removed unless a visual or a link takes over its job.
2. No new polling or data collection.
3. No campaign-finance ceilings, Firefly budget tiers or fee figures.
4. No document-style numbering visible to readers.
5. One scrolling story, one general-election lens.
6. Every figure keeps its provenance.
7. The site stays open.
8. Visual-first, for high-end phones.

## Step 0: set-up

### Baseline (main at 2f29920, 1 November 2026)

| Check | Result |
|---|---|
| `npm ci` | pass |
| `npm run verify` | pass (all guards; `check:content` checks 3, 4, 5, 9 and the preservation guard) |
| `npm run lint` | pass |
| `npm run build` | pass (`/[[...slug]]` 91.3 kB, 384 kB first load) |

`main` was green, so Step 0 needed no repair.

### D0.1 The pass's content base is 2f29920

The brief asks for `CONTENT_BASE` set to the Step 0 commit. Step 0 changes no file under `content/`,
so the content at 2f29920 (the `main` it branched from) is byte-identical to the content at the Step 0
commit, and 2f29920 is a stable, already-published id. The base is set to 2f29920.
Rule applied: the check must weigh this pass's own changes, and nothing else.

### D0.2 The restructure's check keeps running, with this pass's ledger added to it

`check:content` already weighs the content against a767371 (the restructure) with
`docs/restructure-2026-11/ledger.json`. Rather than replace that run with a new base, this pass
**adds** a second run against 2f29920 and keeps the first one, feeding it both ledgers.
`scripts/declutter/sections.mjs` `loadCuts()` now accepts a comma-separated `CONTENT_LEDGER`. The
earlier check is no weaker: every entry it read before, it still reads.
Rule applied: never weaken a verification check.

### D0.3 Re-measured: there are no conflict markers left

The brief says to keep "the 27 conflict markers". Re-measured at 2f29920: content holds **0**
`[CONFLICT Cn: see open items]` markers. All eight (C1 to C8) were settled by logged decision in #47
(`docs/disputes-resolved.json`), and check 9 already fails if a settled marker returns or an
unsettled one moves. Nothing to preserve, and check 9 stays in the chain unchanged.
The figure fences are re-measured at **92**, and the text-version fences at **5**; both are held by
check 3.

### D0.4 What `scan-literals.mjs` counts, and why it reports fewer copies than the audit

The audit counted 269 of 629 registry figures restated as literals. That count included small
values (2, 3, 6, 40, 60.8 and similar), which match CSS weights, list counts, layout numbers and
percentages that are not copies of anything. A guard that fires on those cannot be made to pass
honestly, so the scan counts only literals of **1,000 or more**, excluding **years 1900 to 2100**
and **bare powers of ten** (1,000, 10,000, 1,000,000: millisecond timings and unit scales such as
"/ 1000"), in code, strings and prose, with comments, tests, generated files and the registry's
own sources skipped. A literal is graded `exact` (equals a registry value as printed) or `rounded`
(equals a registry value rounded to the nearest thousand, for values of 10,000 or more).

Baseline at 2f29920, written to `literals-before.json`:

- 293 files scanned, 295 distinct registry values in range
- **180 exact** and **13 rounded** copies, in **44 files**

Two refinements were made during Steps 1 and 2, and the baseline was re-measured on 2f29920 with
the final rules, so before and after are counted the same way:

- The powers-of-ten rule, after a first run showed `1000` and `1_000_000` matching every unit
  conversion.
- Comment ranges now come from the TypeScript parser, because a hand-written stripper was confused
  by apostrophes in JSX text and missed comments after a comma.

The small counted values the scan cannot see ("six risks", "four pillars", "five indicators") are
covered by the Step 6 contradiction check instead, which reads each count from its data source.
Rule applied: a guard must be satisfiable without suppressing true positives.

## Step 1: the seven contradictions, and the others found

Each fix is made at the data source. Prose changes are logged in `ledger.json` (kind `replaced`)
and listed in `CHANGES.md`.

### D1.1 Offline reach: the registry, and "not measured" where nothing is measured

- `lib/figures/reach.ts` no longer holds `DIGITAL_REACH = 72_000`, `OFFLINE_REACH = 460_000` or the
  offline-channel table. The connectivity split (`reach-split`) now draws `reach.smartphone`
  (158,696), `reach.sms-only` (108,419) and `reach.nophone` (338,588), with `reach.offline` (447,007)
  in its measure line. All are registry reads through the new bridge `lib/figures/from-registry.ts`.
  The digital-ceiling note reads `reach.smartphone.short` and `benchmark`. Before, it printed a
  shortfall against 198,004 that did not match the registry's 200,000 benchmark.
- The offline-channel figure (`offline-channels`) draws one measured bar: the SMS layer, sized by
  `reach.sms-only`, with `target.sms` (120,000) named as the list target. Radio, church, markets,
  USSD and mobile-money agents show "Not measured" with their basis kept as context. They have no
  number.
- The headline "Kikamba radio reaches more Kitui voters than every digital platform combined" rested
  on the unsourced 420,000. It is now "Only one offline channel has a measured reach".
- The same unsourced reaches were restated in the message-by-channel table (`lib/figures/annex.ts`)
  and the gatekeeper-bypass list (`lib/figures/media.ts`, "to 320,000 voters"). Both now read the
  registry or say "reach not measured".
- No SMS reach above `reach.sms-only` or `target.sms` remains anywhere.
- Rule: never invent a source. A number with no defensible basis is replaced by its qualitative
  context.

### D1.2 Pillars: three, from one file

`data/message-architecture.ts` holds the three pillars and the four content types (P1 to P4).

- fig-4-1 (the message house) draws the three pillars. Each names the earlier campaign pillars it
  now carries, so nothing from the four-pillar version is lost.
- fig-4-5 (the briefed week) is coloured by content type, which is what its P1 to P4 always were,
  and its title says "four content types".
- fig-4-3's "Pillar" column held P-codes, and they were content types too. It is relabelled
  "Content type" and prints the name.
- The production-pipeline figure said "4 core content pillars". It now names the content types.

Rule: the message section's "one claim, three pillars, six themes" is canonical.

### D1.3 Phases and the nomination window: one calendar

`lib/phases.ts` is the single calendar. It holds the five phases, `NOMINATION_WINDOW` and
`ELECTION_DAY`.

- The Nomination sprint is Firefly's work period, Weeks 1–6 from signature. The decision window is
  Wiper's, "How Wiper chooses its candidate", reported late October to November 2026, Tier 3.
- fig-5-4 used to say "Four phases" and stretch the sprint "from signature through the reported
  window". It now lists all five phases from `PHASES`, draws the decision window as a separate
  event, and builds its title from `PHASES.length`.
- fig-1-1, the nomination status figure, the ask figure, the decision panel and the inline window
  chip all read `NOMINATION_WINDOW`.
- The two phases counted from signature need a date to be drawn on the timeline. They are placed
  from `PLANNING_SIGNATURE` (September 2026), the same assumption the figures already made through
  `TODAY`. The reader sees the weeks, not invented dates.

### D1.4 Escalation: the same thing, so the four-tier tree everywhere

The three-level attack ladder (fig-5-7 and the runbooks' Level 1–3 checklist) and the four-tier
decision tree (runbooks F.1) both classify an incident by severity and set who answers and how fast.
They model the same thing, and their clocks disagreed: a moderate rumour got 30 minutes in the tree
and four hours in the ladder. **The four-tier tree is kept**, in `data/escalation.ts`, read by the
`response-matrix` figure and by fig-5-7.

- Each tier carries its drafter and approver, taken from the ladder level it absorbs: Level 1 becomes
  Moderate, Level 2 becomes High, Level 3 becomes Critical.
- The checklist's thresholds (">10,000 views", "manipulated or AI-generated media") move into the
  High and Critical tiers.
- Tiers are named (Negligible, Moderate, High, Critical), not numbered, because "Tier 1" on this
  site means evidence strength.
- Where the two conflicted on "your team lead" versus "Digital Director" as the first approver,
  "your team lead" is kept, because it matches the settled C3/C4 model (your team runs the owned
  platforms).
- The runbooks' Level 1–3 checklist becomes a one-line pointer to F.1.
- "Level 3" in How it works, The team, Risks & response and the drill library now names the
  critical tier.
- The 30-minute manipulated-media clock stays. It sits inside the critical tier's one-hour
  official-response target.
- The **operational** escalation ladder in How it works (who resolves a logistics, scope or
  governance issue inside the campaign) is a different thing. It keeps three **decision levels**,
  and its figure and text now link to the severity tiers.

### D1.5 Indicators: name the five

The scorecards hold nine indicators: four for the nomination (`NOMINATION_KPIS`) and five for the
election (`GENERAL_ELECTION_KPIS`). The "these five indicators" in Measuring success are a third
set, the recognition indicators R-01 to R-05.

- The sentence now names them and says how they sit beside the scorecards.
- `RECOGNITION_INDICATORS` in `data/kpis.ts` lists them, so the count has a data source the Step 6
  check reads.
- fig-5-6's title builds "Nine … four … five" from the two KPI lists.

### D1.6 Model versus site

The site registry is authoritative.

- The model's 605,693 appears only as the stated reason its scale factor carries seven decimal
  places, so that the scaled wards sum to 605,703. It is a note, not a figure, and stays.
- The model's "about 225,300" came from a rate rounded to 37.2%. The like-for-like bar is now the
  registry figure `benchmark.like-for-like.2026` = 198,004 / 532,758 × 605,703 = **225,115**
  (modelled, Tier 3, because `register.2026` is Tier 3). Step 5 makes the model read it from
  `data/registry.export.json` instead of retyping it.

### D1.7 Segment sizes: one file, and "not sized" where nothing sizes them

`data/segments.ts` holds the six segments. Each size is a registry id (`segment.rural.voters`,
`segment.youth.voters`, `segment.urban.voters`) or `null`. Read by: the segmentation matrix, fig-4-3
and the playbooks' segment summary.

- **~77,000 agro-pastoralists (14.5%)** and **~80,000–105,000**: no published source gives voters
  by livelihood. The 215,003 livestock-farming households are households, not voters, and turning
  them into voters would be an estimate. **Not sized**, with the households kept as context.
- The same applies to 25,000–35,000 professionals and 150,000+ diaspora.
- The message-by-segment table carried four more unsourced sizes: 32.8% and ~175,000 smallholders,
  52.1% and ~278,000 women, 18.2% and ~97,000 traders, 8.5% and ~45,000 professionals.
  - Youth and urban traders now read the registry.
  - Women read `census.female.share`, which is residents, not voters, and says so.
  - Smallholders and professionals are not sized.
- The matrix's "Commissioning this is a Phase −1 research priority" implied new data collection
  (rule 2). It now names the document that would size the segment.
- Its "3 of the 6 segments" counter (rule 4) now reads "Three segments".

### Other contradictions found and fixed

| | Found | Fixed to | Rule |
|---|---|---|---|
| D1.8 | Sang'u FM, which C7 took out of the operating lists, was still a primary station in The voters to win (agro-pastoralists), the message-by-channel table, the response-time ladder and the asset library | The ownership map's stations: placement stations (Musyi, County FM, Wikwatyo) where something is placed, monitored stations where something is monitored; County FM for the agro-pastoralists, being the priority station with a separate Mwingi frequency | C7 (#47) |
| D1.9 | The response-time ladder and the critical tier sent a corrective bulk SMS "under 2 hours", while Ground & offline and Risks & response rule bulk SMS out of rapid response (the 48-hour lodging rule) | The SMS rung says it is not a rapid-response channel; the critical tier drops it | The law (CA/NCIC lodging rule) |
| D1.10 | The KSh 100m-per-ward guarantee, withdrawn from copy by C6, was still promised in the SMS phone mock, the USSD menus, the message-house proof point, the counter-fire commitment and the message-by-channel SMS sample | The needs-weighted formula, published before any allocation; the SMS mock now quotes the settled sample in the playbooks verbatim | C6 (#47) |
| D1.11 | Counted titles typed by hand: "Six profile corrections", "Two of the six risks", "Three indicators climb", "Nine indicators … four … five" | Each builds its count from its list (`lib/count-word.ts`) | One source |
| D1.12 | A figure pointer printed its internal section code ("Figure, §2.3") to readers | It prints "Figure" | Rule 4 |

**Examined, not changed:**

- The surge roles (five, in the figure and in the table), the assumptions (eleven) and the risks
  (six) agree with their lists.
- The four-step content approval gateway in Platforms & content (drafter, Communications Lead,
  Data Protection Officer, Campaign Manager) covers creative and broadcast assets. fig-5-7's
  approval path covers posts. They overlap on broadcasts, where fig-5-7 names the campaign
  counterpart and the gateway names the Campaign Manager. Settling which role signs a broadcast is
  the campaign's decision, not a fact this pass can source, so it is **flagged for the owner**, not
  changed.

## Step 2: one source of truth for every number

### D2.1 Every registry value in site code is a registry read

The read helper is `lib/data/read.ts`: `val(id)`, `fmt(id, mod)` and `figure(id)`. Code outside
the legacy figure system now carries **no exact registry-valued literal**, except the allowed
coincidences in D2.4.

Files converted:

- `components/`: the decision panel, KPI architecture, derived-figure drawer, electoral timeline,
  zone matrix, path-to-200,000 block and calculator, persuasion and pillars matrices, terminal
  turnout screen, tools hub, and the legacy figure registry's notes and headlines.
- `data/`: electoral arithmetic, electoral history, disputed figures, drought, fiscal audit, KPIs,
  scope-level matrix, USSD specimen and terminal showcase. The showcase's ward registers now read
  `ward.*`.
- `lib/`: the highlight patterns.

`lib/figures/*` is left to Step 3, which retires the module, so its literals are counted there.
After Step 2: **31 exact and 3 rounded**, all in `lib/figures/`.

### D2.2 Claims that were wrong, not just retyped

- **"IEBC Benchmark: Minimum winning threshold is 198,004 – 200,000 valid votes in a 3-way
  contest"** (path calculator). There is no fixed threshold, and the IEBC sets no benchmark. It now
  reads: the 2022 winning tally (Form 37C) rounded to the 200,000 benchmark, and the most votes
  wins. "Threshold" becomes "benchmark" wherever it named 200,000 (terminal showcase, KPI
  architecture, derived-figure drawer, paths figure).
- **"Over 14,000 families … have already signed the sand dam resolution"** (persuasion matrix
  script). It had no source. It only coincided with `boda.riders` (14,000), which counts something
  else. The number is removed and the script line keeps its ask.
- **"1,200 households walking 8km"** in a sample tracker report. It is illustrative, but it stated
  an unsourced fact about Kyuso. The numbers and the ward name are removed; the sample keeps its
  shape.

### D2.3 Dead code deleted

Nothing imported these, so they were removed instead of rewired:

- `components/markdown/KpiPhaseBlock.tsx` and `components/charts/KpiPhaseBarChart.tsx` (16 literal
  phase targets, two with no registry home)
- `components/tools/KiemsTabletInspector.tsx`
- `data/county-profile.ts`

### D2.4 Literals allowed to stand

`scripts/consolidation/literals-allow.json` lists 13 literals that equal a registry value by
coincidence or are illustrative. Each entry gives a reason.

- **Coincidences:**
  - pixel sizes: the Open Graph image width and a maximum section height
  - millisecond timings: a confirmation timeout, a phone-mock animation and a scroll hold
  - a chart axis rule that prints millions from two million up
  - the ward map's legend bin edges
  - the ad kill rule's 5,000-impression sample, already allowed in `lib/data/allow.ts`
- **Illustrative mock data, shown under `IllustrativeTag`:** the terminal showcase's market-day
  crowd estimate. The rest of the terminal and phone showcases (follower counts, polling-station
  progress, leaflet counts) uses values that match no registry figure. They are illustrative, and
  the scan does not flag them.

### D2.5 Reference lists, one module each

| List | One home | Retired |
|---|---|---|
| Tiers | `data/types.ts` `TIER_META`, with `tierWord()` and `tierCode()` | `lib/tier-word.ts`; the local maps in `lib/reader-text.ts` and `StationTable.tsx` |
| Phases | `lib/phases.ts` (Step 1) | — |
| Sources | `data/sources.ts`: the nine documents the registry shares with the rest of the site are defined there, and `lib/data/figures.ts` reads their names | Two spellings of the same IEBC register, census, CFSP, OAG, CoB, KDHS, Court of Appeal judgment, 2022 media declaration and July 2026 aggregator report. The registry's wording is kept. The evidence table still lists 65 documents |
| Wards | `data/ward-register.json`, read by the registry (`ward.*`, `con.*`) | Ward totals retyped in the terminal showcase and the legacy figures (the latter in Step 3) |
| USSD menu | `data/ussd-specimen.ts`: the six-option bilingual menu, what each option does, and option 1's plan items | The four-option tree in `lib/figures/production.ts` and `lib/phone-showcase.ts`, and the copies in `components/ReachSplit.tsx` and the register figure. All read the one menu |
| KPIs | Registry `target.*`, with `data/kpis.ts` holding metadata and reading targets by id (`val`/`fmt`) | Literal targets in the stage summaries |
| Risks | `data/risks.ts`, read by fig-5-8 | The list inside the figure spec |

On the USSD menu: the four-option tree and the six-option menu disagreed. The six-option menu is
kept because it is the one quoted in the proposal's Ground & offline section, with Kikamba first.
The tree's "Privacy policy & data opt-out" option is covered by the charter's requirement that the
opt-out be reachable from the menu, with its position set when the shortcode is provisioned. That
is the note the menu figure already carries.

### D2.6 The served analysis copy is generated

`public/content/analysis/` (12 files, byte-identical to `data/analysis/`) is no longer committed.

- `scripts/copy-analysis.mjs` writes it from `data/analysis/` in `prebuild`, `predev`, `content`
  and before `verify-analysis-exports.mjs`, which still compares the two byte for byte.
- `.gitignore` lists it.
- The pipeline (`analysis/src/publish.py`) now publishes to `data/analysis/` only.
- `analysis/tests/test_repo_safety.py` checks that `data/analysis` exists and that neither folder
  is excluded from deployment.
- `.vercelignore` needs no change: its anchored `/analysis/` already leaves both folders in.

### D2.7 Tests ported

`lib/figures/figures.test.ts` pinned the stage-2 summary's literal "220,000", "400 Captains" and
"1,578". It now asserts that the summary and the scorecard row read the same registry ids, and that
the registry holds those values. That is the guarantee the test was written for (D-14).

The analysis tests give **102 passed, 11 failed, 45 skipped** on 2f29920 and on this branch alike.
The 11 failures need the pipeline's data pack (`analysis/data/`), which is gitignored and not in
the repository. They are not caused by this pass. Running them rewrites three committed reports
with "no data" stubs, and those changes were reverted, not committed.

## Step 3: the legacy figure system

### D3.1 No hardcoded registry fact remains in it

Every registry value in `lib/figures/*` and `components/figures/registry.tsx` is now a registry read.

- Bursary counts, the winning tally and the benchmark go through `regFmt` and `val`.
- "1,200 bodaboda stage champions" reads `target.stage-champions`.
- An example SMS "to 14,000 consented voters" had no source and only coincided with `boda.riders`.
  It now names the consented list and the 48-hour lodging.
- Two coincidences stay, with reasons in `literals-allow.json`: a proposed KSh 50,000 seed grant and
  the statutory KSh 5,000,000 penalty.

**`scan-literals.mjs --check` passes: 0 exact and 0 rounded copies.**

### D3.2 Unreachable figures and modules deleted

Sixteen entries in `components/figures/registry.tsx` had no fence in any content file, and nothing
else rendered them:

- reach-split, platform-sizing, offline-channels, effort-rebalance
- audience-segments, kpi-architecture, ussd-menu, message-house
- radio-gatekeepers, targeting-summary, register-map, threshold-build-up
- register-growth, ward-ranking, paths-to-threshold, deficit-pool

They were deleted with everything only they used:

- `lib/figures/reach.ts`, `lib/figures/targeting.ts` and `lib/figures/threshold.ts` (no importer
  left)
- 21 unused exports across the remaining modules
- the `MessageHouse` mark

Sixteen retirement records in `scripts/figure-retirements.json` named these figures as the holders
of facts from earlier retired blocks. Each now has a `consolidation.nowHeldBy` entry naming the
register figure that holds those facts today, or saying the facts were retired as unsourced (D1.1).

Five figure tests pinned `reach.ts`: platform bands, offline-channel shares, the effort rebalance
and the 72,000 digital ceiling. They go with it. The registry-based "three reach segments sum to the
2026 register" test holds the connectivity split.

### D3.3 Collapsed into the register figure that already drew the same facts

`nomination-scorecard` and `ge-scorecard` drew the nine indicators that `fig-5-6-kpis` draws three
headings above them in Measuring success.

- fig-5-6's table gains the stage, definition, method and owner columns the scorecards added, so no
  fact is lost.
- Both fences stay in place, so check 3 holds, and render a pointer to fig-5-6 (`COLLAPSED` in the
  registry).
- The mapping is recorded under `collapsed` in `scripts/figure-retirements.json`.
- `KpiScorecards`, `KpiArchitecture` and the hand-typed `STAGE_1_TARGETS` / `STAGE_2_TARGETS` they
  drew are deleted. The D-14 figure test guarded agreement between those summaries and the
  scorecards, and it is retired with them, because no second copy is left to disagree.

### D3.4 What stays in the legacy system, and why

**42 legacy figures remain**, drawn by `components/figures/registry.tsx` from `lib/figures/*`
(about 3,500 lines, down from 4,900). They are qualitative:

- process steps
- RACI and responsibility tables
- holding lines
- the technology stack
- compliance matrices
- the field loop

They carry no registry figure. None duplicates a register figure: the org chart was checked against
fig-5-9 and holds the specialists each lead directs, which fig-5-9 does not.

Moving each to a `FigureSpec` (option a) would re-express qualitative tables in a new chart
vocabulary, which is a rewrite of their presentation, not a consolidation of facts. It was not done
in this pass and is reported as outstanding. The two systems now share one data rule: neither types
a registry value.

## Step 4: section merges

**Stops: 36 → 31.** Six parts plus the reference shelf, unchanged.

### Merge machinery (built once, used for every merge)

- **`scripts/consolidation/merge-chapter.mjs`** moves a whole chapter file into another, word for
  word.
  - Every section keeps its number, so its anchor id and its check-content key travel with it.
  - Each section is logged as `moved` with `whole: true`.
  - The heading added for an absorbed chapter is logged as `added`.
- **`scripts/declutter/check-content.mjs`** accepts a section that has left its file only when the
  ledger moves its words elsewhere; an unlogged disappearance still fails. A section moved
  **whole** is credited with its words as they stood at the base being checked. Otherwise, words
  that earlier passes added between a767371 and 2f29920 would count as cut. Measured after the
  merges: 0.85% drift against a767371 (the baseline was 0.88%), and 0.04% against 2f29920.
- **`scripts/restructure-2026-11/check-preservation.mjs`** also looks for a unit in every file its
  file's passages were moved to by a logged move. All 430 units and 2,307 tokens, names and
  acronyms are still found.
- **`scripts/consolidation/anchor-moves.mjs`** writes `lib/anchors/consolidation-2026-11.json`:
  every heading live at 2f29920 that moved, mapped to the heading with the same number today, or to
  `anchor-overrides.json` (none were needed). There are 30 moves.
  - `scripts/build-anchors.ts` reads it first, and checks each lands where it says.
  - November's and October's targets now land through it.
  - `verify` runs it with `--check`.
- **`next.config.ts`** redirects every retired route: `/commitments`, `/team`, `/coalitions`,
  `/annex-county`, `/annex-glossary` and the four `/workstreams-*` routes.

### Done

| | Merge | How |
|---|---|---|
| D4.1 | **M** Commitments into What he receives | `commitments` moved whole into `receives` under "What Firefly commits to, and what the campaign provides". Receives is relabelled **"What you get and what you provide"**. The decision panel follows the text. `ask` stays separate |
| D4.2 | **O** Terms and Glossary, one "Fine print" | `annex-glossary` moved whole into `annex-terms`, relabelled **"Fine print"** |
| D4.3 | **J** Coalitions into the timeline | `coalitions` moved whole into `timeline`, before After the election, as "Coalitions and endorsements, in sequence" |
| D4.4 | **I** The team into How it works | `team` moved whole into `engagement` as "The team" |
| D4.5 | **D** The ward register into How Kitui voted | `annex-county`'s 40-ward register moved whole into `votes`, beside where the votes are |
| D4.6 | **D** One layered ward map | fig-3-2 (How Kitui voted) is the one ward map. Six layers, switched by radio, which also works without JavaScript: register size, the twelve largest wards (new layer), the three zones, where he has held office, party flow and in-reach share. The full ward list opens beneath it, and the figure's own table is the sortable 40-ward table. The footprint, party-flow and zones figures keep their findings, stats and charts, but their own tile maps become a link to the right layer (`/votes#ward-map-footprint`), so "where he is known" in Record and reach opens the map on that layer. The cover's footprint map, the effort map (strategy) and the reach-target map (measurement) are not geography views of the contest and stay |
| D4.7 | **H** The workstreams, one section with four tabs | The four `workstreams-*` routes moved whole into `workstreams`, "The workstreams". The tabs (Platforms & content · Media · Ground & offline · Data & technology) are drawn from a marker where each group begins, because the page lays prose out section by section and a wrapper cannot span sections. The tab bar hides blocks outside the active group's range. Every group is server-rendered, so all four show with JavaScript off and in print. An old anchor, such as `workstreams-media-sec-15-2-1` or `/workstreams-media`, opens the right tab (through `revealAround`), and `#ws-media` names a tab |
| D4.8 | **H** One summary of the fourteen workstreams | fig-5-1 (owners, How it works) collapsed into fig-5-2 (groups, The workstreams). fig-5-2 draws both, and its table gives every workstream its group, owner, product and rhythm. The fig-5-1 fence points to it |
| D4.9 | **N** The data explorer | In Evidence & sources, above the generated source table. It is searchable by name, source or value. Filters: topic, reliability (in words) and state. It downloads the whole registry as CSV, and `#data-<id>` links to any figure. It reads the registry directly. The generated table stays beneath as the print and JavaScript-off copy |

### Not done in this pass, and why

**A, B, C, E, K, L** (living conditions, county money, reach, results, escalation protocol,
security) and the filtered indicator views of **G**:

- Each is a passage-level move inside chapters: dozens of paragraphs, each needing a ledger entry,
  a pointer written in words, and a check that the two copies of a fact meet in one place.
- Done properly, that is the larger half of Step 4. It could not be finished to that standard
  alongside the structural merges and the remaining steps in this session, so it is reported as
  outstanding, not done badly.
- **The data they depend on is already single-sourced:**
  - reach: `reach.*` (Step 1)
  - segments: `data/segments.ts`
  - escalation: `data/escalation.ts`
  - indicators: `data/kpis.ts` with registry targets
  - fiscal: `data/fiscal-audit.ts` reads the registry

  So the remaining merges move prose, not facts.

**Volunteers into Workstream 10 (J):** not done, for the same reason.
