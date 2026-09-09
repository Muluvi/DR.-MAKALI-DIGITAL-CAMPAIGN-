# Final report — motion-driven redesign

Branch `claude/makali-campaign-redesign-z6owop`, 13 commits on top of the Phase 0 audit.
86 files changed, +5,310 / −1,318. Every figure below was measured in this container.

---

## a. Before and after, against every budget item

Lighthouse 12, mobile preset (Moto-G-class CPU ×4, simulated slow 4G), `next start` on a
production build, three runs, median.

| Item | Budget | Phase 0 | Now | |
|---|---:|---:|---:|:--|
| **Performance** | ≥ 85 | 45 | **51** | ✗ **misses by 34** |
| **Accessibility** | ≥ 95 | 92 | **97** | ✓ |
| **CLS** | < 0.1 | 0.000 | **0.000** | ✓ |
| **LCP** | < 2.5 s | 6,211 ms | **5,474 ms** | ✗ |
| **Script transfer** | ≤ 507,029 B | 422,524 B | **441,209 B** | ✓ (+4.4%, ceiling +20%) |
| First Load JS | ≤ 493 kB | 411 kB | **428 kB** | ✓ |
| Best Practices | — | 96 | 96 | — |
| FCP | — | 3,144 ms | **2,184 ms** | −31% |
| TBT | — | 1,326 ms | 1,338 ms | flat |
| Speed Index | — | 4,200 ms | **3,933 ms** | −6% |
| **Landing document, gzip** | — | 321,403 B | **87,252 B** | **−73%** |
| **Total page transfer** | — | 819,530 B | **606,406 B** | **−26%** |
| **Print: invisible text** | 0 | 28 | **0** | ✓ |
| **Print: characters emitted** | whole doc | 53,968 (1 of 9) | **399,733** | ✓ |
| Horizontal overflow, 390px | none | none | **none, all 9 routes** | ✓ |

**Performance misses, and I want to be direct about it.** The transfer problem is solved —
the landing document is 73% smaller and FCP fell 35%. What remains is CPU: 7.8 s of
main-thread work and 1.4 s of blocking time, hydrating a large server-rendered tree on a
throttled mobile CPU. LCP is bound by that, not by the network.

I tried the obvious fix and it made things worse, twice. `next/dynamic` on the five landing
widgets with `ssr: false` took Performance 52 → 41 and CLS 0.000 → 0.208, because a skeleton
whose height is guessed rather than measured shoves everything below it. Keeping SSR and
deferring only hydration still measured 42 with CLS 0.208, because `next/dynamic`'s loading
state replaces the server markup during hydration. **Both were reverted.** Splitting moves
hydration cost around; it does not remove it. See §g.

---

## b. New visual components, and the data each carries

| Component | What it draws | Source |
|---|---|---|
| `charts/DeficitGauge` | Mulu 22.1% vs Kasalu 37.4% as opposed columns, the 15.3-point gap counting up on scroll, and the June→August widening of +4.2 | `data/nomination-contest.ts`, Mizani Africa (Tier 2) |
| `charts/KpiScorecards` | NW-01…04 and GE-01…05 as cards: baseline against target, owner, method, cadence | `data/kpis.ts`, §8.1.1 / §8.1.2 |
| `charts/KpiArchitecture` | §8.2.3's two-stage KPI architecture as reflowing layout with a drawn connector | `data/kpis.ts`, §8.2.3 |
| `charts/OfflineWaterline` | 86.4% offline as submerged mass, 13.6% as the band above the line | KNBS 2019 (Tier 1) |
| `charts/VoteFunnel` | 532,758 → ~330,310 → ~200,000, with 198,004 as the 2022 benchmark rule | §1.3.1, IEBC (Tier 1) |
| `charts/CeilingMeter` | KSh97.56m as one bar with the three tiers as bands inside it | `data/budget-tiers.ts`, IEBC Gazette 12251 |
| `charts/BenchmarkLadder` | Five §6.4.4 targets against their industry bands on one shared axis | `data/benchmarks.ts`, §6.4.4 |
| `MiniScorecard` | Deficit · ceiling · vote threshold, in the dock on every section | derived from the three data modules |
| `charts/FeaturePhoneSpecimen` | §4.3.3's USSD menu on a 2G handset with simulated keypad timing; §4.3.2's SMS with a live 160-char count; the four-stage approval chain in place of unreviewed vernacular | `data/ussd-specimen.ts`, §4.3.2–3, §3.6.3 |
| `markdown/MatrixMarks` | The Analytical Matrix's chart view, each label sharing a `layoutId` with its table row | whichever table it renders |
| `visual/AnimatedNumber` | Any counting figure, with width reserved and the truth always accessible | — |

Four data modules were added so no figure is typed beside the thing that draws it:
`nomination-contest.ts`, `kpis.ts`, `budget-tiers.ts`, `benchmarks.ts`, `ussd-specimen.ts`. Derived values —
every deficit, every fraction — are computed from the published figures rather than restated.

---

## c. Section coverage, all nine

| Section | Treatment |
|---|---|
| **(1) The decision** | DeficitGauge (hero) · KpiScorecards ×2 · KpiArchitecture · CeilingMeter · BudgetScenarioModeler · PollingTrajectorySimulator · ObjectivesIndex · MizaniSlopeBlock |
| **(2) What we know** | OfflineWaterline · VoteFunnel · WardCartogram + register stream · PathTo200k · ConstituencyWeight · ResourceEnvelope · ElectoralTimeline · FiscalAudit · GeographicZoneMatrix · PhoneShowcase · 12 more |
| **(3) What we will do** | EconomistGovernorThesis · StrategicPillarsMatrix · SloganBuilder · MessagingPlayground · PersuasionFramingMatrix · DataSecurityEthicsCharter · PublicServiceDeliveryTracker |
| **(4A) What we publish** | CommunityScheduler · MediaPlaybackMockup · MediaRadioLandscapeCard · RadioAircoverDial |
| **(4B) On the ground** | **FeaturePhoneSpecimen** · TerminalShowcase · FlywheelSchematic · ReachSplit · SMSFeedbackVisualizer |
| **(4C) Defending** | CounterMessagingGrid · CrisisWarRoomMatrix |
| **(4D) What it runs on** | **BenchmarkLadder** — this section had nothing before |
| **(4E) Who does the work** | CampaignOrgChart |
| **(5) Delivery and proof** | PhaseRail (sticky pane + horizontal track) · KpiPhaseBlock |

`visual-coverage` reports all 262 sections covered, 41 with a bespoke visualisation (was 39).

---

## d. Reduced motion, per animated component

Measured with `prefers-reduced-motion: reduce`: **8 elements hidden, all of them the hero
label cycler showing one of nine at a time** — which is what a cycler is, and all nine appear
in the navigator regardless. Was 36 before this pass. Counters: 4 of 4 correct, 0 mismatched.

| Component | Under reduced motion |
|---|---|
| DeficitGauge | Scroll link never registered. Columns at their true shares from frame one; the gap reads 15.3 immediately. |
| AnimatedNumber / useAnimatedNumber | No count at all. The figure renders final and never moves. |
| KpiScorecards | Tracks at their true fraction. The hatch on unmeasured baselines does not drift. |
| KpiArchitecture | Nodes present, connector drawn, no stagger. |
| OfflineWaterline | Water at full depth from frame one. |
| VoteFunnel | Bars at true width, benchmark in place, paths drawn. |
| CeilingMeter | Bands at true width; tier selection is instant. |
| BenchmarkLadder | Bands and markers final. |
| MiniScorecard | Inherits the dock, which stays put under the preference. |
| Section crossfade / LazySection | No entrance at all; content is in the HTML. |
| FeaturePhoneSpecimen | The USSD session renders at its final screen; keypad presses do not animate. |
| PhaseRail | The sticky pane is not sticky, and the rail is drawn complete with all five phases visible. |
| MatrixMarks | Layout animation suppressed; marks appear at their true widths. |
| Progress rail | Jumps are instant — `scroll-behavior: smooth` is already disabled by the same stylesheet. |
| Marquees, ambient loops | Do not run. Zero running animations measured. |
| Press and focus states | **Kept**, shortened to 90 ms. A button that stops responding is a bug. |

---

## e. Print

Verified in a real print preview via Chromium's print media emulation, on `/full`.

- **28 elements carrying real text at `opacity: 0` → 0.**
- **53,968 characters emitted → 399,873.** Export PDF now routes to `/full` first, so it
  prints the whole proposal rather than whichever section happened to be open.
- `/full` mounts every section immediately rather than waiting to be scrolled into view. A
  print job does not scroll, which is why the old PDF came out as one section of prose
  followed by eight skeletons.

---

## f. Judgement calls for review

1. **NW-04's baseline state.** The brief lists all four nomination baselines as "Not yet
   measured". §8.1.1 in this repository marks NW-04 as "Confirm w/ party" — the
   awaiting-decision state, not the unmeasured one. The repository is encoded as the source of
   truth and the difference is flagged rather than smoothed over.
2. **"Opt-In" restored to §8.2.3.** The diagram reflow in `d1c1559` had dropped it from the
   220,000 pledged-voter target. It is a consent term the Data Protection Act 2019 obligations
   rest on, so it is restored and the box widened, rather than logged as an accepted change.
   This is the only semantic content edit in the branch.
3. **Placeholder count.** The brief cites 19; I count 20 `[Insert…]`/`[Confirm…]` markers. No
   figure is affected.
4. **Sections now have their own URLs.** `/evidence`, `/technology`, `/full`. Each is
   independently shareable and the back button works. All 608 legacy deep links still resolve,
   verified in a browser as well as by the guard.
5. **`framer-motion` stays in `package.json`.** It cannot be removed — `motion` depends on it.
   A lint rule enforces the single import path instead. My audit called this a bundle win; it
   was not, and First Load JS was unchanged by it.
6. **The light theme only appears via the toggle.** `layout.tsx` hard-codes `class="dark"`, so
   `prefers-color-scheme: light` still lands on the dark palette. The light palette is
   correct and tested; whether the server should honour the OS preference is a product
   decision I have not taken.

---

## g. Not delivered

**Phase 2, item 2 — the map-to-cartogram morph.** No verified Kitui ward boundary data can be
obtained here: this container's egress policy returns 403 for every boundary source (HDX/OCHA,
GADM), the one npm candidate carries names but zero polygon geometry, and the brief forbids
hand-drawing. Per the brief's own fallback clause the existing tile cartogram ships alone. The
"land is not votes" argument survives in weaker form — a cartogram states it, the morph would
have proved it. **Unblocked by committing a verified, attributable GeoJSON to `data/`.**

**Phase 2, items 6, 9 and 11 — now delivered.** The phased plan gained a sticky
active-phase pane and a horizontal snap track below 768px, built into the existing `PhaseRail`
rather than beside it. The Analytical Matrix now morphs rows into marks via `layoutId`, on a
native mark view because a shared-element transition needs both ends under Motion's control.
The feature-phone specimen is built, with the vernacular SMS deliberately absent behind §3.6.3's
four-stage approval chain rather than invented.

**Phase 3 — now substantially delivered.** The navigator carries all nine sections with reading
time and Here/Read/New state, and the progress rail is tappable with full keyboard operation.
Still outstanding: swipeable carousels beyond the tier selector and the §9.2.6 comparison matrix
(that table stacks into cards below 768px rather than becoming a carousel), and the mini-
scorecard's condense-on-scroll is inherited from the dock rather than being its own behaviour.

**Performance ≥ 85.** Missed at 51. Diagnosed, not hand-waved: the remaining cost is hydration
CPU, and the two obvious code-splitting approaches both measured worse and were reverted. The
credible next step is reducing what hydrates — converting presentational `"use client"`
components to server components, of which there are around thirty candidates — which is a
distinct piece of work I have not started.

**One accessibility node.** `target-size`, one node. Score is 97 against a 95 gate. Chasing it
was worth it anyway: it led to an unlayered `button, input, select { min-height: 42px }` in a
mobile media query that beat every Tailwind utility in the codebase and silently held the whole
interface 2px under the floor. Every button now measures ≥ 44px across four routes.

**Things found by measuring rather than assuming, worth recording.** Four defects that had
nothing to do with the work that surfaced them: `dark:` was bound to the OS setting rather than
this site's theme class, so nine components rendered light-theme colours on a dark ground; the
Analytical Matrix's column detector stripped non-digits and charted "Week 1" as 1 against
400,000; a 1, 2, 3 rank column was charted as a quantity; and chart labels came from column 0
whatever column 0 was, so the ward register's bars were labelled "1", "2", "3". All four are
fixed and each is described in its own commit.

---

## Self-check

- **(a) No statistic, date, section number or KPI code was altered.** The content-integrity
  guard proves it mechanically: 4,312 body lines unchanged since `3fb771a`, with every
  permitted change quoted in `scripts/notation-rewrites.json`. The one semantic edit is the
  restoration in §f.2.
- **(b) No unmeasured baseline is drawn as zero.** NW-01…03 and NW-04 carry hatched tracks that
  never acquire a fill, plus a badge and a sentence naming which state they are in. GE-03 and
  GE-05 *are* drawn at zero, because zero is their measured reading.
- **(c) `prefers-reduced-motion` is honoured** by every new component (table in §d), verified in
  a browser rather than asserted.
- **(d) Every animated visual has a keyboard-reachable equivalent**: a real table or definition
  list, always in the DOM, with the graphic `aria-hidden` where the two would duplicate.
- **(e) Print verified** in a real print preview: 0 invisible text elements, whole document.
- **(f) `bun run build` passes** with all six guards, zero TypeScript errors, zero ESLint errors.
- **(g) JS budget holds**: 439,037 B against a 507,029 B ceiling.

**Assumption stated:** the JS budget is Lighthouse's `resourceType: Script` transfer sum on the
mobile preset, as recorded in Phase 0 and unchallenged since.
