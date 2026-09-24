# Premium visual pass: Phase 0 (recon and style frames)

Brief: `claude-code-visual-overhaul-prompt.md` (Firefly, 24 September 2026). Baseline `3f16f0b`.
**This is the Phase 0 checkpoint. Nothing in the live document has changed; work stops here until
Firefly approves or redirects.**

## 0. How to review

| | |
|---|---|
| Branch | `claude/new-session-tvsa47` (see §9.1: the brief named `claude/visual-premium-pass`) |
| Commit | `13e42e0` (frames and evidence), then this report |
| Preview, branch alias (stable) | https://dr-makali-digital-campaign-git-cl-d04902-brian-muluvis-projects.vercel.app/style-frames |
| Preview, this deployment | https://dr-makali-digital-campaign-7tnmzt3en-brian-muluvis-projects.vercel.app/style-frames |
| Review switches | top bar of the page, or `?theme=light`, `?display=mona` in the URL |

If the preview has `SITE_PASSCODE` set, open it once with your usual `?k=` passcode link. The
frames are one page, in order: cover hero (scroll through it: it is three screens of story),
the four cover figures, the Act III opener, `fig-3-1-funnel` in chart kit v2, the §2.7 station
table, the two typefaces, and the dock and spine (fixed on every screen of the page). Try it on
a phone: drag the county sideways, tap a ward, flip the register toggle, scroll up and down to
see the dock step away and return.

Screenshots of every frame, in both themes at 390 and 1440 px, are in
[`phase-0/frames/`](phase-0/frames/). JS-off and reduced-motion views are there too.

## 1. Commands and results

| Command | Result |
|---|---|
| `npm ci` | clean install, exit 0 |
| `npm run verify` (baseline) | pass: 340 figures valid, copy gates clean, 114 section-visual specs, ward register sums to 532,758, 210 live headings, 1,341 redirects, 0 orphans, 38/38 figure tests |
| `npm run build` (baseline) | pass: `/[[...slug]]` 321 kB, first load 427 kB, shared 103 kB |
| `npm run verify` (after the frames) | pass, identical counts |
| `npm run build` (after the frames) | pass: `/[[...slug]]` 297 kB, first load **428 kB** (+1 kB); `/style-frames` 23.8 kB, first load 152 kB; the 3D scene is a separate chunk loaded only when WebGL is available and motion is allowed |

## 2. The site today, measured (the "before" column)

Method: `next build && next start` on `3f16f0b`, Playwright Chromium, dark theme, **Brief mode**,
every route walked top to bottom so every lazy figure mounts, then measured. Words are
`document.body.innerText`, so they include chrome and figure text. Route contact sheets (360,
390, 1440 px; top, middle, bottom) are in [`phase-0/routes/`](phase-0/routes/).

| Route | Height 390 | Height 1440 | Figures | Tables | `<details>` | SVGs | Words |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/cover` | 4,163 | 3,052 | 2 | 2 | 2 | 6 | 629 |
| `/objectives` | 10,163 | 7,921 | 12 | 4 | 4 | 58 | 2,155 |
| `/data` | 36,307 | 24,116 | 9 | 19 | 10 | 79 | 6,272 |
| `/analysis` | 46,851 | 34,308 | 19 | 14 | 15 | 226 | 8,195 |
| `/strategy` | 47,418 | 35,284 | 35 | 19 | 19 | 270 | 11,990 |
| `/implementation` | 8,716 | 6,340 | 9 | 2 | 2 | 37 | 2,032 |
| `/workstreams-platforms` | 12,614 | 9,577 | 8 | 8 | 13 | 97 | 1,703 |
| `/workstreams-media` | 9,241 | 6,630 | 1 | 1 | 6 | 90 | 1,023 |
| `/workstreams-ground` | 14,817 | 10,977 | 6 | 8 | 11 | 121 | 2,272 |
| `/workstreams-data` | 17,133 | 11,933 | 8 | 7 | 10 | 127 | 2,559 |
| `/delivery` | 67,992 | 50,288 | 43 | 24 | 38 | 411 | 17,697 |
| `/nextsteps` | 10,617 | 7,817 | 7 | 2 | 3 | 37 | 2,527 |
| `/annex-evidence` | 5,111 | 3,964 | 5 | 5 | 3 | 24 | 1,041 |
| `/annex-county` | 12,581 | 9,078 | 1 | 2 | 0 | 82 | 1,976 |
| `/annex-polls` | 4,042 | 3,034 | 0 | 0 | 1 | 16 | 979 |
| `/annex-messages` | 2,767 | 2,124 | 2 | 4 | 3 | 11 | 1,769 |
| `/annex-cadence` | 2,305 | 1,838 | 1 | 1 | 2 | 10 | 569 |
| `/annex-runbooks` | 12,577 | 9,125 | 8 | 5 | 9 | 67 | 2,576 |
| `/annex-terms` | 1,864 | 1,489 | 0 | 0 | 0 | 7 | 275 |
| **Sum of routes** | **327,279** | **236,941** | | | | | |

Counts are at 390 px (the 1440 counts differ slightly: some components render tables only on
wide screens). Every route has exactly one `<h1>`; none scrolls sideways at 360, 390 or 1440 px.
The brief's table matches within a few percent; the differences are the cover (the brief measured
`/` with the hero at ≈4,000; this is `/cover`) and figure counts that now include legacy figures
mounted inside `<figure>`. **Reading time, before: Brief 93 min, Full 216 min** (the hero's own
measured figures).

## 3. Defect register, verified

Evidence images are in [`phase-0/defects/`](phase-0/defects/).

| ID | Status | What was observed (local build of `3f16f0b`) | Evidence |
|---|---|---|---|
| D-01 | **Confirmed, and wider than listed** | §3.2.1 bars "123,522 ballots" against "Kyuso, 19,921 voters" and "Mumoni (15,877 voters)". §3.8.1 bars 158,696 · 45 · 24 · 06 · 4.4. See §5: most of the 60 quantitative auto-visuals fail the same way | `D-01_*` |
| D-02 | **Confirmed** | §1.3.1 "1% now / 51.7% required"; §1.3.2 "0 now / 40 required"; §1.3.5 "78k now / 1 required" | `D-02_*` |
| D-03 | **Confirmed** | Station table headers and cells break one to three characters per line at 390 px ("St-at-io-n", "M-b-ai-tu F-M") | `D-03_station_table` |
| D-04 | **Confirmed** | §2.6 connectivity key-value cards: right-aligned values wrap into a ragged column ("44.1% of / residents / (CA/KNBS / 2023/24) / (Tier 1)") | `D-04_2-6_scan` |
| D-05 | **Not reproduced locally** | At 360 and 390 px the 73.8% ring and its label sit side by side without overlap in this build and font set. It may depend on the device's font fallback; the ring is rebuilt in Phase 3 regardless, with the label below the ring on narrow screens | `D-05_ring_*` |
| D-06 | **Confirmed, in two forms** | The five stage names are `truncate`d in every width ("Ward Field …", "County / As…"); on phones the category chips below them collide into each other ("Water InfrastFeeder RoHealthMarket…") | `D-06_protocol_*` |
| D-07 | **Confirmed** | Dock 48 px tall, 12 px off the bottom; body text and table rows are read through it. `main` has 112 px bottom padding at the very end, but nothing reserves the dock's band while reading | `D-07_*`, `D-03_*` |
| D-08 | **Confirmed, cause found** | At first load the label is right ("Cover"). After any programmatic jump (menu, deep link) and a scroll back to the top it stays on the jumped-to section ("§5B Publishing & earned media") indefinitely. `ClientPage` sets the label only when a section *enters* a band 25–35% down the viewport; above the first section nothing is in the band, so the last value sticks | `D-08_after_jump_top_*` |
| D-09 | **Confirmed** | `main` 768 px wide at 1440 (figures 720 px); 19 unlabelled 2 px ticks on the right edge | `D-09_desktop_column` |
| D-10 | **Confirmed** | Section-lead drop cap sits detached from its line ("T  he campaign's objectives…") | `D-10_D-13_*` |
| D-11 | **Confirmed** | Tile labels cut at 10 characters + "…"; the full name exists only in an SVG `<title>` (hover on desktop, nothing on tap) | `D-11_tilemap_names` |
| D-12 | **Confirmed** | §5.6 reach-share tile map: all 40 tiles "—" | `D-12_reach_tiles` |
| D-13 | **Confirmed** | Act opener is a hairline, a small roman numeral and a one-line blurb | `D-10_D-13_*` |
| D-14 | **Confirmed** | Hero portrait 104 × 171 px on a 390 px phone; 220 × 363 px on desktop (beside the map); `03-three-piece-formal` unused | `D-14_*` |
| D-15 | **Confirmed** | 33 prose blockquotes on `/full`, one style | `D-15_pullquotes` |
| D-16 | **Confirmed** | 48 register figures, one frame style; no lead figure is distinguished | `D-16_figure_cards` |
| D-17 | **Confirmed by reading**, not measured | Shared fade-and-rise entrances remain on part visuals and several inserts (`fx-in-up` etc.) | — |
| D-18 | **Confirmed** | 95 leaf elements on `/full` set in uppercase with letter-spacing above 0.5 px (kickers, pills, "RANKED BY SIZE", "SHARE OF THE WHOLE", "BASELINE AGAINST TARGET") | — |

### New defects

| ID | Where | What is wrong |
|---|---|---|
| D-19 | Component copy (rendered strings) | Section numbers from before the 2026 renumbering still appear in rendered component text: e.g. "§8.2 has not been built — §8.2.6 sets out…" (`PublicServiceDeliveryTracker.tsx:125`), "§8.10.2" (`FeaturePhoneSpecimen.tsx:344`), "The engagement model — §12.1" (`MarkdownViewer.tsx`, the `delivery-sec-5-7` portrait kicker), "Section 3.7.1's own 'Campaign posture' column" (`MediaOwnershipBlockContent.tsx`). 155 old-style "§7–§19" references in `components/`, most in comments; the rendered ones, to be counted string by string in Phase 1, point readers at sections that no longer exist under that number. Fix in Phase 1 by mapping each to the current number (the redirect table already holds the mapping); no wording otherwise changes |
| D-20 | §2.7 radio landscape matrix, 390 px | The note "Position carries the reading — nothing here is drawn…" is clipped at the right edge of its card (`D-03_station_table` top) |
| D-21 | `components/figures/registry.tsx` | 16 of the 60 legacy registry ids are no longer mounted anywhere (§4). Dead code, not a visible defect; listed so Phase 3 can delete rather than restyle them |
| D-22 | `delivery.md:1119` | The legacy `org-chart` is mounted under "5.8.14 If it becomes a delegate primary", not under §5.9 (team). Phase 3 merges it into the one team visual (brief §10, 5E) at §5.9 |
| D-23 | Theme toggle | The toggle cycles three themes (dark → light → **sepia**). The brief and this pass define two. See question Q-5 |
| D-24 | Hero, `/` | The hero `<h1>` uses the sans at 1.7 rem on phones; with the portrait squeezed beside it at 104 px, the first screen has no dominant element (`D-14_hero_390`) |

## 4. Legacy figures and heading inserts: what each actually draws

### 4.1 Legacy registry (`components/figures/registry.tsx`): 60 ids, 44 mounted, 16 not

"Draws" is the set of mark components the entry renders. Mount is the content file and heading.

| Id | Draws | What it shows (the entry's own note) | Mounted at |
|---|---|---|---|
| `audience-overview` | TierGrid | six ways of cutting the electorate | strategy.md, 4.3 |
| `visit-loop` | Stepper | visit, commitment, twelve weeks, verification, published either way | strategy.md, 4.5.4 |
| `provenance-mandate` | SpecTable | the three things every figure has to carry | annex-evidence.md, A.1.1 |
| `tier-classification` | SpecTable | three evidential tiers and what each may be used for | annex-evidence.md, A.1.2 |
| `conflict-protocol` | Stepper | four steps for when two sources disagree | annex-evidence.md, A.1.3 |
| `message-by-segment` | SpecTable | six segments, their message and the evidence behind it | annex-messages.md, D.1 |
| `message-by-channel` | SpecTable | five channels, their register and their proof points | annex-messages.md, D.2 |
| `escalation-ladder` | Stepper | three escalation levels and who decides at each | annex-cadence.md, E.2 |
| `response-matrix` | SpecTable | four threat severities, their protocol and SLA | annex-runbooks.md, F.1 |
| `response-sla` | SpecTable | mandatory response time per channel | annex-runbooks.md, F.2 |
| `holding-positions` | (inline table) | four attack lines with pre-drafted answers and sources | annex-runbooks.md, F.3 |
| `rapid-response-flow` | RapidResponseFlowDiagram | monitoring → decision tree → legal gateway → channels | delivery.md, 5.8.1 |
| `compliance-architecture` | TierGrid | the three statutes the campaign operates under | delivery.md, 5.8.11 |
| `iebc-clearance` | SpecTable | seven clearances, standard and status | delivery.md, 5.8.12 |
| `liability-matrix` | SpecTable | three statutory exposures and mitigations | delivery.md, 5.8.13 |
| `org-chart` | Hierarchy | the lean core and the specialists each lead directs | delivery.md, 5.8.14 (see D-22) |
| `role-ownership` | SpecTable | four core roles, what each owns | delivery.md, 5.9.4 |
| `reporting-lines` | Hierarchy, TierGrid | two teams, the weekly brief and the line upward | delivery.md, 5.9.5 |
| `nomination-scorecard` | KpiScorecards | four nomination-window indicators, baselines as absences | delivery.md, 5.6.1 |
| `ge-scorecard` | KpiScorecards | five general-election indicators | delivery.md, 5.6.2 |
| `research-and-tracker` | TierGrid | the research programme and the tracker | delivery.md, 5.6.4 |
| `research-modules` | SpecTable | three research instruments and the decision each unlocks | delivery.md, 5.6.5 |
| `delivery-tracker` | SpecTable | four delivery dimensions, statutory sources, cadence | delivery.md, 5.6.6 |
| `production-pipeline` | TierGrid | four pillars, two engines, one approval gateway | workstreams-platforms.md, 5.2.1.2 |
| `format-specs` | SpecTable | five channels, spec and creative treatment | workstreams-platforms.md, "Formats, by channel" |
| `weekly-cycle` | SpecTable | the seven-day production cycle | workstreams-platforms.md, "The weekly production schedule" |
| `approval-gateway` | Stepper | four steps every asset passes before dispatch | workstreams-platforms.md, "Who approves what" |
| `asset-library` | Tree | the seven vaults of the asset repository | workstreams-platforms.md, "The asset library" |
| `field-loop` | TierGrid | the closed loop between field intelligence and response | workstreams-ground.md, 5.2.3.1 |
| `field-reports` | SpecTable | four report types, frequency, channel, fields | workstreams-ground.md, "What the 40 ward coordinators report" |
| `four-hour-cycle` | Stepper | ground report to deployment, on the clock | workstreams-ground.md, "…in four hours" |
| `operating-rhythm` | SpecTable | seven standing forums, owners, participants | workstreams-ground.md, "The operating rhythm" |
| `data-layer` | TierGrid | capture, validation, output, encrypted core | workstreams-data.md, 5.2.4.1 |
| `supporter-schema` | SpecTable | the supporter record, field by field | workstreams-data.md, "The voter and supporter data model" |
| `dpa-compliance` | PairedRows | six sections of the Data Protection Act 2019 | workstreams-data.md, "The Data Protection Act 2019, applied" |
| `tech-stack` | TierGrid | the four tiers of the technology stack | workstreams-data.md, 5.2.4.3 |
| `procurement-matrix` | SpecTable | five components, DPA risk, decision status | workstreams-data.md, "The procurement matrix" |
| `bypass-architecture` | Stepper | the four bypass pillars and the protocol for each | workstreams-media.md, "Getting on air around a hostile gatekeeper" |
| `counter-fire` | PairedRows | three ground rumours paired with evidence | strategy.md, 4.4.2 |
| `cultural-registers` | PairedRows | four terms, failed literal translation, approved idiom | strategy.md, 4.4.9 |
| `qc-gateway` | Stepper | four gates from English draft to Kikamba broadcast | strategy.md, 4.4.10 |
| `language-map` | ShareBar | three languages, reach, audiences, channels | strategy.md, 4.4.8 |
| `language-deployment` | Allocation | seven output media, each allocated across languages | strategy.md, 4.4.11 |
| `constituency-power` | BarList | the eight constituencies, ranked, with the Big 4 bracket | analysis.md, 3.2.1 |

Not mounted (D-21): `reach-split`, `platform-sizing`, `offline-channels`, `effort-rebalance`,
`audience-segments`, `kpi-architecture`, `ussd-menu`, `message-house`, `radio-gatekeepers`,
`targeting-summary`, `register-map`, `threshold-build-up`, `register-growth`, `ward-ranking`,
`paths-to-threshold`, `deficit-pool`.

Two notes on the brief's §10 list: `field-loop` (a TierGrid of the loop) and `four-hour-cycle`
(a Stepper of the four-hour clock) draw different views of one process, as do
`fig-5-2-3-field-loop` and `FlywheelSchematic`, so the §5C merge is justified and will keep the
clock's timings. And **`message-house` is not mounted**; §4.1 uses `fig-4-1-message-house` plus
`StrategicPillarsMatrix`.

### 4.2 Heading inserts (`HEADING_INSERTS`): 43 keys

| Heading | Component(s) |
|---|---|
| `data-sec-2-1` | WardCartogramBlock, PathTo200kBlock, ConstituencyWeightBlock |
| `data-sec-2-2` | ElectoralHistoryPanel, ElectoralTimelineBlock |
| `data-sec-2-3` | NominationPathPanel |
| `data-sec-2-4` | OfflineWaterline, DisputedFigure |
| `data-sec-2-5` | ResourceEnvelopeBlock |
| `data-sec-2-6` | ChannelReachBlock |
| `data-sec-2-7-1` | MediaOwnershipBlock (the D-03 table) |
| `data-sec-2-8` | SectionPortrait |
| `analysis-sec-3-1` | VoteFunnel, RegisterComparisonBlock |
| `analysis-sec-3-2` | ScenarioBenchmarkBlock |
| `analysis-sec-3-3` | PathTo200kCalculator |
| `analysis-sec-3-4` | RecognitionDeficitOverlay |
| `analysis-sec-3-5` | ConstitutionalBranchNavigator, CompetitiveQuadrantBlock |
| `analysis-sec-3-7` | GeographicZoneMatrix |
| `analysis-sec-3-8` | PhoneShowcase |
| `strategy-sec-4-1` | EconomistGovernorThesis |
| `strategy-sec-4-1-4` | StrategicPillarsMatrix |
| `strategy-sec-4-1-6` | SloganBuilder |
| `strategy-sec-4-3-1` | AudienceSegmentationMatrix |
| `strategy-sec-4-4` | MessagingPlayground, ToneVoiceSlider |
| `strategy-sec-4-4-1` | IssueEvidenceBlock |
| `strategy-sec-4-4-3` | PersuasionFramingMatrix |
| `workstreams-platforms-sec-5-2-1` | PublicServiceDeliveryTracker (the D-06 protocol) |
| `workstreams-platforms-sec-5-2-1-2` | CommunityScheduler (O-6) |
| `workstreams-media-sec-5-2-2-1` | MediaPlaybackMockup |
| `workstreams-media-sec-5-2-2-2` | MediaRadioLandscapeCard, RadioAircoverDial |
| `workstreams-ground-sec-5-2-3-1` | TerminalShowcase |
| `workstreams-ground-sec-5-2-3-2` | FlywheelSchematic |
| `workstreams-ground-sec-5-2-3-3` | FeaturePhoneSpecimen, ReachSplit, SMSFeedbackVisualizer (O-1, O-2, O-5) |
| `workstreams-data-sec-5-2-4-4` | BenchmarkLadder |
| `delivery-sec-5-4` | PhaseRail, KpiPhaseBlock |
| `delivery-sec-5-5-1` | ServiceLevelSelector |
| `delivery-sec-5-5-2` | TierComparisonCarousel (O-7 row) |
| `delivery-sec-5-6` | ObjectivesIndex |
| `delivery-sec-5-7` | SectionPortrait (seated-grey) |
| `delivery-sec-5-7-1` | DirectionWeek |
| `delivery-sec-5-7-4` | DataSecurityEthicsCharter |
| `delivery-sec-5-8-1` | CounterMessagingGrid |
| `annex-polls-sec-c-1` | PollMarginsBlock |
| `annex-county-sec-b-2` | FiscalAuditPanel, FiscalAuditChartBlock |
| `annex-county-sec-b-3` | DroughtFoodSecurityPanel |
| `annex-county-sec-b-4` | MuiBasinPanel |
| `annex-county-sec-b-5` | CompetitorFieldPanel |

Not in the brief's list and worth a look in Phase 3: `EconomistGovernorThesis`,
`ConstitutionalBranchNavigator`, `CompetitiveQuadrantBlock`, `NominationPathPanel`,
`OfflineWaterline`, `DisputedFigure`, `ObjectivesIndex`, `PollMarginsBlock` (Annex C: it must stay
reference-styled, rule 3.1.3), and `StrategicAids`' "Interactive FM Broadcasters Sync" and
"Opposition Counter-Narrative Matrix" panels (O-8 family).

## 5. The auto-generated part visuals: first look (full audit is Phase 3)

114 entries: 21 stats, 21 checklist, 18 stepper, 15 bars, 15 timeline, 8 gauge, 5 contrast,
5 bullet, 4 donut, 2 waterfall. A first pass over the 60 quantitative entries (stats, bars,
gauge, contrast, bullet, donut, waterfall) finds that **almost none plots one measure in one
unit**. Examples, verbatim from `data/section-visuals.generated.json`:

- §3.1 bars: 532,758 voters · 75 prison voters · 198,004 votes · 200,000
- §3.3 waterfall: 200,000 · 200,198 voters · 15 wards · 37.58
- §5.2.4.2 waterfall: "Owner 5.7 · entire is conditional 5.7 · subject 5.7 · Canvass result 5.2" (section numbers)
- §5.8.2 bars: 24 hours a day · 7 days a week · 40 · 180
- §4.4 gauge: "160 character Kiswahili SMS"; §6.1.1 gauge: "3 hours"; §5.4.4 gauge: "90 days"
- §4.5.1 bars: 275,570 registered voters · 45 seconds · 15 Eastern region
- all four "contrast" entries render "the assumption / the finding" with no content from their section

Expectation for Phase 3: keep most checklist, stepper and timeline entries (genuine lists),
retire nearly every quantitative entry, and replace a handful with register figures where an
honest one exists. The generator change (no quantitative kinds from regex) goes with it.

## 6. Owner decisions (report only; nothing here was edited)

| ID | File and line | Text, verbatim | Recommendation |
|---|---|---|---|
| O-1 | `components/ReachSplit.tsx:236` | Hosting · "~KSh5,000" · "per month" | Remove the hosting cell (engagement cost); keep the two build-time cells |
| O-2 | `components/charts/FeaturePhoneSpecimen.tsx:167, 339–344` | "At {unit}{from}–{to} a message, one send to {CONSENTED_CONTACTS} consented contacts costs KSh…–KSh…" | Remove the sentence, or restate as "a per-message price is set at contracting" with no figure |
| O-3 | `data/benchmarks.ts:86` (and **`:80`**) | "Cost per consented contact … ≤ KSh0.60 falling to KSh0.35"; also "Cost per persuaded voter … ≤ KSh200" | Both are engagement money; remove both rows from the ladder |
| O-4 | `scripts/check-copy.ts:21, 71` | the money gate reads `content/*.md` only | Extend the scan to string literals in `components/**` and `data/**` (O-1 to O-3 and O-7 would all have been caught) |
| O-5 | `components/StrategicAids.tsx:461–471` | "Grassroots USSD Message Feed" · badge "Verified Ingestion Feed" · two quoted messages from "+254 712 *** 324" and "+254 723 *** 892" | Remove, or relabel "Illustrative mockup: no message has been received" and drop "Verified" |
| O-6 | `components/StrategicAids.tsx:490–493` | "Upcoming Market Assembly Schedules" · "Sept 12, 2026 … Kabati Market Square" · "Sept 18, 2026 … Mwingi Town Council" | Remove; both dates are past and the events are invented |
| O-7 | **`data/tier-matrix.ts:54–57`** (rendered in §5.5 by `ServiceLevelSelector` / `TierComparisonCarousel`; it is not in `delivery.md`) | "Digital ad share of the agreed spend envelope" · lean 15–20% · standard 30–40% · premium 45–55% | Confirm whether a spend share belongs in an engagement scope; if it stays, it is the campaign's media budget, not Firefly's fee, and could say so |
| O-8 | `components/terminal/TerminalShowcase.tsx`, `components/tools/KiemsTabletInspector.tsx`, `components/StrategicAids.tsx:204` (MessagingPlayground), `:415` (SloganBuilder) | None of the four carries an "Illustrative" label; TerminalShowcase says "Sample Ward" only | Add a visible "Illustrative mockup" label to each in Phase 4 (G-10 does this for every frame); confirm the wording |
| **O-9 (new)** | `components/markdown/PublicServiceDeliveryTracker.tsx:125–126` | "The tracker described in §8.2 has not been built — §8.2.6 sets out its build and cost." | "cost" points at engagement money and "§8.2.6" no longer exists (D-19). Recommend "…has not been built; Section 5.2.1.1 sets out how it would be." |
| **O-10 (new)** | `components/markdown/PublicServiceDeliveryTracker.tsx` sample rows | Dated sample reports ("28 Aug 2026 · Raised with County", "25 Aug 2026 · Escalated") under an "Interface preview" note | The note is honest; the past dates and statuses still read as events. Recommend undated samples |

## 7. The style frames: what was built, and the choices in them

All of it is scoped to `/style-frames`; the live document is untouched. Everything reads its
numbers from `lib/data/figures.ts`, the register specs and the ward register, and every caption
is text the document already carries.

### 7.1 Frame 1: the cover hero and `<CountyScene>` (G-2)

- **Real geography**, licensed (§8): 40 wards, each extruded by its 2022 registered voters.
  Kitui Central in accent blue from the start; the pool in neutral, resolving to laterite with the
  kiondo weave **last**, as the brief asks.
- **One scroll value, three movements** over a pinned stage of three and a half screens:
  relief (tilted from the south-west) → top-down, north up → each ward **morphs from its true
  outline into its tile** on the existing tile map (`lib/geo/wards.ts` positions) → the pool
  resolves. The morph is GPU morph targets: each outline is resampled to 72 points, the tile's
  perimeter to the same 72, and the triangulation carries over (valid because the tile is
  convex). No geometry is rebuilt per frame; the canvas renders on demand only, never off
  screen, and nothing loops.
- **Interaction:** tap or click a ward for a card with its full name, constituency and register
  (the D-11 fix in the scene); drag sideways to turn the county (±35°, clamped). Vertical drags
  are left to the page (`touch-action: pan-y`), so the scene cannot trap scroll.
- **Portrait** `01-hero-clasped-hands` at 64% of the viewport height on phones, in front, then
  it steps down and away as the map needs the room; on desktop it stands between the title and
  the county. The original cut-outs already have transparent backgrounds, so **no background
  removal was needed and no pixel of the person was altered**.
- **Title** in the display face with a line-mask reveal (the text is in the DOM once).
  "Confidential — personal, link-only." kept, as a quiet seal with a woven mark.
- **Fallbacks:** the static SVG county (same encoding) is always in the HTML; it is what
  reduced motion, no-WebGL, JS-off and print get. The four figures are true in the HTML
  (`nojs_390_hero`, `reduced_390_hero`).
- **The four figures** as `<BigNumber>`s (G-8): 605,703 (T1), ≈200,000–225,000 (Modelled · T1),
  51.7% (Modelled · T1), "Both" (T2, from the 2022 Senate and Woman Representative results). The
  digits roll once, in view, then the DOM returns to the plain string.

### 7.2 Frame 2: the Act III opener (G-3)

Full viewport. Back to front: the weave field at 6% (5% light), the county as a quiet static
layer, the act numeral, the `04-gesture-explaining` cut-out, the copy. The words are
`lib/flow.ts`'s label and blurb only ("This act answers: the winning number, where it lives, and
why he isn't yet reaching it."). Layers move at different rates on scroll; the title's weight
axis settles from 300 to 800 as it arrives. Reduced motion and JS-off: everything still, final
weight, nothing hidden (the reveal is only armed for an opener that starts below the fold).
`print:break-before-page` kept.

Proposed portrait rotation across the seven acts (hero keeps 01): I `02-seated-grey`,
II `03-three-piece-formal`, **III `04-gesture-explaining`**, IV `01-hero-clasped-hands`,
V `02-seated-grey`, VI `03-three-piece-formal` (as the brief assigns), VII `04-gesture-explaining`.

### 7.3 Frame 3: `fig-3-1-funnel` in chart kit v2 (G-5), hero treatment

- d3 linear scale; **one scale for both registers**, so the toggle compares honestly.
- The register toggle is two radios and CSS: bars carry both widths as custom properties and
  morph with a transform (compositor only); it works with scripts off.
- Marks by provenance, shape first: sourced is a solid fill fading toward the baseline;
  modelled carries the kiondo weave; the target is an open bar with a double rule and is the
  one accent mark. Hairline gridlines, fewer tick labels on phones, direct labels, values that
  count up once (and end on the exact printed string).
- Every row is focusable; its note opens on hover, focus or tap, and prints inline.
- The contract is intact: finding-first title, question, takeaway, every source with its
  shape-coded pill, the table in an open native `<details>`, the CSV link.

### 7.4 Frame 4: the §2.7 station table in G-6

Real table on wide screens (sticky header, station column pinned if it ever scrolls, reach as a
three-dot glyph beside its word); **label-above-value card rows on phones**. This is the D-03
fix, and the same rules fix D-04. Words and tiers exactly as in `data/media-ownership.ts`.

### 7.5 Frame 5: typefaces

**Bricolage Grotesque** (weight 200–800, width 75–100, optical size 12–96) against **Mona Sans**
(weight 200–900, width 75–125, no optical size). Both self-hosted through `next/font`, both
shown on the same strings. Prose stays Newsreader; codes stay JetBrains Mono. The switch in the
top bar sets the whole page in either. Recommendation: **Bricolage**, set slightly condensed
(`font-stretch: 88%`) for display. Its optical sizes let the same family work as the small
UI face, and its slightly irregular grotesque reads as made rather than templated. Mona Sans is
cleaner but closer to the product-UI look Guide §1.7 warns about.

### 7.6 Frame 6: the dock and the spine (G-7)

- **Dock:** one glass pill (56 px), act numeral + section, a Brief/Full segmented control with a
  sliding thumb, index and theme. The page **reserves** its height plus the safe-area inset
  (D-07). It hides on the way down and returns on the way up. Its label comes from a probe (which
  section contains the line 30% down the viewport, and above the first section, the first) on
  every scroll frame: the D-08 fix, demonstrated on the frames' own sections.
- **Spine (desktop):** seven act segments, each as long as the act is on the page (from
  `data/section-heights.json`), filling with the weave; every segment is a labelled button on
  hover and focus. On this page it maps the page's scroll across the seven acts so it can be
  judged in motion; on the live page it will be wired to the document. On phones the spine is
  absent and the menu carries a tap target per act (Phase 1).

### 7.7 Palette and contrast

Tokens are OKLCH, scoped to `.pf` for now; in Phase 1 they replace the values of the existing
token names in `app/globals.css`, keeping the text / `-solid` split.

| Pair | Dark | Light | Needs |
|---|---:|---:|---:|
| ink on ground | 17.6 | 14.9 | 4.5 |
| muted on raised | 9.0 | 7.1 | 4.5 |
| accent (text) on raised | 7.7 | 8.6 | 4.5 |
| earth (text) on raised | 7.4 | 6.4 | 4.5 |
| sisal (text) on raised | 11.0 | 5.6 | 4.5 |
| rival (text) on raised | 7.9 | 6.1 | 4.5 |
| white on accent-solid | 6.3 | 7.3 | 4.5 |
| white on earth-solid | 5.7 | 5.7 | 4.5 |
| accent-solid on ground (mark) | 3.1 | 6.7 | 3.0 |
| earth-solid on ground (mark) | 3.4 | 5.2 | 3.0 |
| neutral tile on ground (mark) | 3.5 | 3.4 | 3.0 |

Computed from the OKLCH values (OKLab → linear sRGB, WCAG relative luminance). An axe sweep of
the frames is part of Phase 1, when these become the site's tokens.

### 7.8 Dependencies added (Phase 0)

| Package | Why |
|---|---|
| `three`, `@react-three/fiber` | The 3D county. `drei` was not needed |
| `d3-geo`, `topojson-client` | Projecting the licensed boundaries |
| `d3-scale` | Chart kit v2 scales |
| `@types/three`, `@types/d3-geo`, `@types/d3-scale`, `@types/topojson-client` (dev) | Types |

`gsap`, `lenis` and `@number-flow/react` are not added yet: the hero's scrub is one scroll value
and a ref, and `<BigNumber>`'s roll is 60 lines that guarantee the final value is in the HTML.
GSAP arrives with the `<Story>` engine in Phase 2 if pinning needs it. `mapshaper` was used
once, outside the repo, and is not a dependency; the command is in `GEOGRAPHY.md`.

Bundle: the document route is unchanged (first load 427 → 428 kB). three.js and R3F load only
on the frames page, as their own chunk, and only when WebGL is present and motion is allowed.

## 8. Geography (G-2)

**Usable, with a clear licence:** Omare & Omare (2017), *Kenya County Assembly Boundaries*,
CC BY 4.0, digitised at 1:50,000 from the IEBC's 2012 ward delimitation. All 40 Kitui wards join
to `data/ward-register.json` (two spelling aliases; one mislabelled Kiambu polygon dropped).
Simplified to an 11 KB TopoJSON at `public/geo/kitui-wards.topo.json`. Full record, caveats and
the attribution line in [`GEOGRAPHY.md`](GEOGRAPHY.md). HDX was not reachable from this
environment (egress policy), so its version was not compared.

## 9. Deviations from the brief, and why

1. **Branch.** This session is bound to push only to `claude/new-session-tvsa47`, so the work is
   there, not on `claude/visual-premium-pass`. Say if you want it moved; it is one push.
2. **`docs/ultimate-website-visuals.md` is not copied.** The handbook was not supplied with the
   brief and is not in the repository. Guide § references were read from the brief's own
   summaries. Please attach it before Phase 1.
3. **One line changed in the live route file:** `app/[[...slug]]/page.tsx` now declares
   `dynamicParams = false`. Without it Next.js resolved `/style-frames` through the root
   catch-all (and 404ed). Behaviour of the document is unchanged: every unknown slug was already
   a 404, and all 19 routes, `/` and `/full` still return 200 (checked).
4. **Two type-only edits** in `PersuasionFramingMatrix.tsx` and `StrategicPillarsMatrix.tsx`:
   their icon prop was `React.ElementType`, which React Three Fiber's JSX types turn into
   `never`. Narrowed to the component type they actually receive. No runtime change.
5. **Act numeral size.** The brief says "clamp up to ≈ 18vw" for act numerals on phones; the
   frame follows it (70 px at 390). It reads as a label rather than a monument on a phone; see Q-3.
6. **The 3D morph uses each ward's largest polygon**; multi-part wards lose their small parts
   during the morph only (the static SVG draws every part).

## 10. Questions that need an answer before Phase 1

- **Q-1. Direction.** Approve the language as shown (laterite and royal blue on indigo-black,
  the kiondo weave, the 3D county, portrait-led openers), or redirect.
- **Q-2. Display face.** Bricolage Grotesque (recommended) or Mona Sans?
- **Q-3. Act numerals on phones.** Keep ≈18vw as briefed, or let them run large (≈40vw) as a
  background layer behind the title?
- **Q-4. Boundaries.** Use the Omare & Omare CC BY 4.0 boundaries as recorded in GEOGRAPHY.md,
  with the attribution line in each figure's source? If Firefly wants the HDX version or an IEBC
  file instead, supply it and it drops in.
- **Q-5. Themes.** The site has a third theme (sepia) the brief does not mention. Keep it (it
  gets the new palette too), or retire it and make the toggle dark/light only?
- **Q-6. Portrait rotation.** Approve the act assignment in §7.2.
- **Q-7. O-1 to O-10.** Decisions, whenever convenient; nothing in Phases 1–5 depends on them
  except that the affected components are styled but not reworded until they are made.
- **Q-8. The handbook.** Please attach `ultimate-website-visuals.md`.

## 11. Not done in Phase 0, by design

Everything past the checkpoint: no live-document styling, tokens, chrome, figures, part visuals
or prose have changed. Frame-timing traces on a real 120 Hz device are not possible from this
environment (headless Chromium with a software GPU); the scene is built to be cheap (render on
demand, morph on the GPU, transform and opacity only in CSS), and Phase 5 will record traces on
a Chrome DevTools 120 Hz profile and say exactly how.
