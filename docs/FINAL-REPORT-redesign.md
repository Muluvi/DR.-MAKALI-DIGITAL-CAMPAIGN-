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
| **LCP** | < 2.5 s | 6,211 ms | **5,500 ms** | ✗ |
| **Script transfer** | ≤ 507,029 B | 422,524 B | **439,037 B** | ✓ (+3.9%, ceiling +20%) |
| First Load JS | ≤ 493 kB | 411 kB | **425 kB** | ✓ |
| Best Practices | — | 96 | 96 | — |
| FCP | — | 3,144 ms | **2,044 ms** | −35% |
| TBT | — | 1,326 ms | 1,428 ms | worse |
| Speed Index | — | 4,200 ms | **3,922 ms** | −7% |
| **Landing document, gzip** | — | 321,403 B | **87,529 B** | **−73%** |
| **Total page transfer** | — | 819,530 B | **604,851 B** | **−26%** |
| **Print: invisible text** | 0 | 28 | **0** | ✓ |
| **Print: characters emitted** | whole doc | 53,968 (1 of 9) | **399,873** | ✓ |
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
| `visual/AnimatedNumber` | Any counting figure, with width reserved and the truth always accessible | — |

Four data modules were added so no figure is typed beside the thing that draws it:
`nomination-contest.ts`, `kpis.ts`, `budget-tiers.ts`, `benchmarks.ts`. Derived values —
every deficit, every fraction — are computed from the published figures rather than restated.

---

## c. Section coverage, all nine

| Section | Treatment |
|---|---|
| **(1) The decision** | DeficitGauge (hero) · KpiScorecards ×2 · KpiArchitecture · CeilingMeter · BudgetScenarioModeler · PollingTrajectorySimulator · ObjectivesIndex · MizaniSlopeBlock |
| **(2) What we know** | OfflineWaterline · VoteFunnel · WardCartogram + register stream · PathTo200k · ConstituencyWeight · ResourceEnvelope · ElectoralTimeline · FiscalAudit · GeographicZoneMatrix · PhoneShowcase · 12 more |
| **(3) What we will do** | EconomistGovernorThesis · StrategicPillarsMatrix · SloganBuilder · MessagingPlayground · PersuasionFramingMatrix · DataSecurityEthicsCharter · PublicServiceDeliveryTracker |
| **(4A) What we publish** | CommunityScheduler · MediaPlaybackMockup · MediaRadioLandscapeCard · RadioAircoverDial |
| **(4B) On the ground** | TerminalShowcase · FlywheelSchematic · ReachSplit · SMSFeedbackVisualizer |
| **(4C) Defending** | CounterMessagingGrid · CrisisWarRoomMatrix |
| **(4D) What it runs on** | **BenchmarkLadder** — this section had nothing before |
| **(4E) Who does the work** | CampaignOrgChart |
| **(5) Delivery and proof** | PhaseRail · KpiPhaseBlock |

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

**Phase 2, item 6 — sticky scrollytelling timeline.** Not built. The existing `PhaseRail` and
the four-stage Spatial Strategy Command still carry the phased plan.

**Phase 2, item 9 — `layoutId` on the Analytical Matrix.** Not built. The chart/table switcher
works and already renders one variant at a time, so this was a refinement rather than a defect.

**Phase 2, item 11 — the feature-phone USSD specimen.** Not built. `PhoneShowcase` already
carries a USSD screen; the animated 2G handset with keypad timing, the 160-character SMS
counter and the scoped Kikamba/Kiswahili/English toggle are not there.

**Phase 3 — partially.** Delivered: the mini-scorecard, the 44px tap-target floor, diagram
tables that stack instead of scrolling, first-paint choreography, and the preserved Focus /
Zero Chrome / Expand All / Theme controls. Not delivered: the bottom-sheet navigator rebuild
with per-section reading time and completion state (the existing `MobileTOCModal` is retained),
a tappable progress rail, and swipeable carousels beyond the tier selector.

**Performance ≥ 85.** Missed at 51. Diagnosed, not hand-waved: the remaining cost is hydration
CPU, and the two obvious code-splitting approaches both measured worse and were reverted. The
credible next step is reducing what hydrates — converting presentational `"use client"`
components to server components, of which there are around thirty candidates — which is a
distinct piece of work I have not started.

**One accessibility node.** `target-size` on a single dock button. Measured directly, no two
dock buttons intersect; WCAG 2.2 counts clear space as well as size and the row spacing is
still short of what axe wants. Score is 97 against a 95 gate.

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
