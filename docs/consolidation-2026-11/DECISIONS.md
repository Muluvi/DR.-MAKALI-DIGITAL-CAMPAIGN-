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
- **181 exact** and **13 rounded** copies, in **45 files**, of 78 distinct values

(The powers-of-ten rule was added during Step 1, after a first run showed `1000` and `1_000_000`
matching every unit conversion; the baseline was re-measured on 2f29920 with the final rule.)

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
