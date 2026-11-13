# Kitui 2027 rebuild: report

Brief: `kitui-rebuild-prompt.md` (repo root). Phase 0 is in `docs/rebuild/RECON.md`; the
replacement log is `docs/rebuild/REPLACEMENTS.md`; every consistency fix and conflict is in
`docs/rebuild/CONFLICTS-RESOLVED.md`. Nothing is merged to production.

## 1. Branch and preview

- **Branch:** `claude/kitui-2027-rebuild-m7aij6`
- **Vercel preview (stable for the branch):** https://dr-makali-digital-campaign-git-cl-18955d-brian-muluvis-projects.vercel.app
- **Preview of the Phase 4 commit (`a9b0d8a`):** https://dr-makali-digital-campaign-oew1vvc6c-brian-muluvis-projects.vercel.app
  (state READY, target: preview, not production). Later commits on the branch deploy to the same branch alias.
- **Merged to `main`** after approval (24 September 2026); production deploys from `main`.
- **Commits:** `82f9054` Phase 0 · `6aefb7a` Phase 1 · `218adc2` Phase 2 · `996e7e8` pilot ·
  `b0886ac` Cover–§3 · `a92bfbc` §4–§6 · `a9b0d8a` Phase 4 · this report.

## 2. Old → new mapping

The full mapping, row by row against what was on disk, is RECON §1. What it became:

| New | Content file | Built from |
|---|---|---|
| Cover | `cover.md` + the hero | old cover/colophon; the stat strip is replaced by `fig-cover-map` and `fig-cover-spine` |
| 1 Objectives | `objectives.md` | old §1 goal, deadlines, objectives; the 40% threshold cut |
| 2 The Data | `data.md` | old §2–§3 facts: register, results, nomination, people, budget, connectivity, media, record, channels |
| 3 The Analysis | `analysis.md` | old §3.1–§3.4 arithmetic and targeting, §3.6 reach, the profile audit, gaps, diagnosis |
| 4 The Strategy | `strategy.md` | old §4–§7 position, weighting, segments, messaging, pillars, channel mix; 4.7 fixes and 4.8 rules from old `presence.md` |
| 5 Implementation | `implementation.md`, `workstreams-*.md`, `delivery.md` | old scope, workstreams, roadmap, deliverables, measurement, governance, risk, team |
| 6 Next steps | `nextsteps.md` | old decision and dependencies |
| Annexes A–G | `annex-*.md` | evidence standard, county reference (with the 40-ward table), polls (reference only), messages, cadence, runbooks, terms |

Old routes are gone; every pre-rebuild heading id resolves through `lib/anchors/redirects.ts`
(210 live headings, 1,341 redirects, 0 orphans; the build fails on an orphan).

## 3. Replacement log

Every prose passage removed, and the explicit cut or the visual that replaced it, is in
`docs/rebuild/REPLACEMENTS.md` (Phase 2 cuts, then Phase 3 visuals, including the six legacy
figures removed for unsourced or poll-derived data and the last three ASCII diagrams). The removed
text itself is kept in the git history of each commit named above.

## 4. Every figure built

All **46** figures of the brief's §N register are built, plus three process figures that replace
the last ASCII diagrams (49 in all). My working notes said "52"; the register lists 46 ids, and
`public/data/index.json` matches it exactly. Each renders from one spec in `lib/register/specs/`
that also writes its table view and `public/data/<id>.csv`.

| ID | § | Question | Data source (tier) | Chart |
|---|---|---|---|---|
| `fig-cover-map` | Cover | Where does the electorate sit, and where has he held office? | IEBC, Registered Voters per County Assembly Ward (2022) (T1); Parliament of Kenya record (T1); The pool: a sum of the four constituencies, derived (modelled T1) | tilemap + stats |
| `fig-cover-spine` | Cover | What is the shape of the argument? | This proposal's structure (target) | spine |
| `fig-1-1-timeline` | 1.1–1.2 | How long is there? | Nomination window: a single-source campaign report (Section 2.3) (T3); General election date: Constitution of Kenya, Article 101 (T1) | timeline |
| `fig-1-3-objectives` | 1.3 | What are the five objectives, and what does each serve? | This proposal, Sections 3 and 5.6 (target) | cards |
| `fig-1-4-flow` | 1.4 | How does the engagement run? | This proposal, Sections 5.3 and 5.7 (target) | steps |
| `fig-1-5-scorecard` | 1.5 | How will success be judged? | Baselines: [DATA NEEDED — Meta Insights export, Week 1] (data needed); Targets: this proposal (target) | gauges |
| `fig-2-1-register` | 2.1 | How big is the register, and how did it get there? | IEBC, Registered Voters per County Assembly Ward (2022) (T1); IEBC, Enhanced Continuous Voter Registration county annex (July 2026) (T1); Continuous registration: the growth less the drive, derived (modelled T1) | waterfall + bars + bars |
| `fig-2-2-results` | 2.2 | What does it take to win a countywide seat in Kitui? | Court of Appeal, Malombe v Ngilu [2018] KECA 460 (T1); IEBC certified result, Kitui governor 2022 (Form 37C), per Firefly's Public Data & Evidence Audit (24 Sep 2026) (T1); IEBC declaration, Kitui Central MP 2022, as gazetted (via The Star), per Firefly's Public Data & Evidence Audit (24 Sep 2026) (T1); Senator and Woman Representative 2022: media reporting of the IEBC declaration (T2) | multiples |
| `fig-2-3-nomination` | 2.3 | What is the nomination method, and how confident are we? | Nomination method and window: single-source campaign report (T3); Party name change: Office of the Registrar of Political Parties (August 2025) (T1) | cards + matrix |
| `fig-2-4-people` | 2.4 | Who lives in Kitui? | KNBS, 2019 Kenya Population and Housing Census (T1); KNBS, Kenya Poverty Report (2021) (T1); NDMA Long Rains Food Security Assessment, citing KNBS (the other poverty rate) (T2); Kitui County livestock statistics, as cited in the evidence pack (T1); NDMA drought bulletin, January 2026 (T1) | icons + bars + cards |
| `fig-2-5-budget` | 2.5 | What does the next governor actually control? | Kitui County Fiscal Strategy Paper FY2026/27: equitable share and conditional grants (T1); The same Paper, via secondary reporting: the total and own-source revenue (T3); County Assembly revision of the Paper: own-source revenue (T3) | stack |
| `fig-2-6-connectivity` | 2.6 | How do people get online, and has that changed? | KNBS, 2019 Kenya Population and Housing Census (T2); Communications Authority / KNBS, ICT Analytical Report on the 2023/24 Kenya Housing Survey (T1) | slope |
| `fig-2-7-media` | 2.7 | Who owns the airwaves, and where do we place vs monitor? | Local media ownership reporting (publicly reported, not certified) (T3); Corporate and denominational ownership records (T2); CA/KARF audience report, Lower Eastern (Kitui, Machakos, Makueni), per Firefly's audit (T2) | network + bars |
| `fig-2-8-record` | 2.8 | What has he actually done? | Kitui Central NG-CDF bursary record (T1); Parliament of Kenya record; NG-CDF Board evaluation, FY2014/15 (T1); Kitui Central Project Inventory 2013–2026, awaiting line items (T3) | timeline + stats |
| `fig-2-9-channels` | 2.9 | What does his presence look like against the field? | Public Facebook page, approximate count as displayed (T3); Public pages of each candidate, Week 1 audit (data needed) | matrix + matrix |
| `fig-3-1-funnel` | 3.1 | What is the winning number? | IEBC, Registered Voters per County Assembly Ward (2022) (T1); IEBC, Enhanced Continuous Voter Registration county annex (July 2026) (T1); Turnout of 61.7%: IEBC Form 37C, Kitui governor 2022, carried forward to 2027 (T1); Benchmark: the 2022 governor's winning total, rounded (target) | funnel |
| `fig-3-2-register-map` | 3.2 | Where are the votes? | IEBC, Registered Voters per County Assembly Ward (2022) (T1); Shares and running totals, derived (modelled T1) | tilemap + pareto |
| `fig-3-3-paths` | 3.3 | Which route to the number is real, and which is a trap? | IEBC, Registered Voters per County Assembly Ward (2022) (T1); Ballots at the 61.7% turnout constant, derived (modelled T1) | paths |
| `fig-3-4-footprint` | 3.4 | Where has he held office, and what does that leave untouched? | IEBC, Registered Voters per County Assembly Ward (2022) (T1); Parliament of Kenya record (T1); The pool: Mwingi North, West, Central and Kitui South, summed (modelled T1) | tilemap + stats |
| `fig-3-5-field` | 3.5 | What has each contender already proven at the ballot? | Media reporting of the IEBC 2022 declaration (The Star; Nation; Standard) (T2); Court of Appeal, Malombe v Ngilu [2018] KECA 460 (T1); IEBC declaration, Kitui Central MP 2022, as gazetted (via The Star), per Firefly's Public Data & Evidence Audit (24 Sep 2026) (T1) | bars |
| `fig-3-6-party-flow` | 3.6 | Where will party loyalty not carry him? | Constituency records, 2022 (single-source) (T3); IEBC, Registered Voters per County Assembly Ward (2022) (T1); Kitui Central succession reports (T3) | tilemap + stats |
| `fig-3-7-zones` | 3.7 | How do the three zones differ, and who is left out? | KNBS, 2019 Kenya Population and Housing Census (T1); IEBC, Registered Voters per County Assembly Ward (2022) (T1); This proposal's zoning; shares derived (modelled T1) | tilemap + dumbbell |
| `fig-3-8-ceiling` | 3.8 | What can digital physically reach? | analysis pipeline, stage 09 (published rates × July 2026 register) (modelled T1); Communications Authority / KNBS, ICT Analytical Report on the 2023/24 Kenya Housing Survey (T1) | stack |
| `fig-3-9-audit` | 3.9 | What does his current presence actually show? | His public profile, as displayed; Parliament of Kenya record (T1); [DATA NEEDED — Meta Insights export, Week 1] (data needed) | mock + bars + bars + bars + bars |
| `fig-3-10-gaps` | 3.10 | What can't the data tell us yet, and what closes each gap? | Generated from every [DATA NEEDED] in this document (scripts/build-open-items.ts) (data needed) | matrix |
| `fig-3-11-evidence` | 3.11 | How strong is the diagnosis, and what would overturn it? | Derived in lib/data/figures.ts (modelled T1); Media reporting of the IEBC 2022 declaration (The Star; Nation; Standard) (T2); The Week 1 test: [DATA NEEDED — Meta Insights export, Week 1] (data needed) | balance + decision |
| `fig-4-1-message-house` | 4.1 | What is the position, and what holds it up? | Kitui Central NG-CDF bursary record (T1); Parliament of Kenya record; NG-CDF Board evaluation FY2014/15; Ministry of Finance designation (T1) | house |
| `fig-4-2-effort` | 4.2 | Where does the effort go in Phase −1? | Firefly's weighting, this proposal (target); Derived in lib/data/figures.ts (modelled T1) | tilemap + heatmap |
| `fig-4-3-segments` | 4.3 | Who are we trying to move, and how much do they matter? | KNBS, 2019 Kenya Population and Housing Census (T1); Segment sizes: census shares applied to the 2022 register, derived (modelled T1) | matrix |
| `fig-4-4-message-region` | 4.4 | What do we say where, and in which language? | This proposal, Sections 3.7 and 4.4; political-messaging rules (Section 5.2.3.3) (target) | matrix + cards |
| `fig-4-5-calendar` | 4.5 | What gets published, and when? | His public page, as observed: [CONFIRM against the Week 1 export] (T3); The briefed week: this proposal (target) | calendar |
| `fig-4-6-channel-shift` | 4.6 | How does effort move between channels? | Firefly's weighting, this proposal (target); analysis pipeline, stage 09 (published rates × July 2026 register) (modelled T1) | slope + matrix |
| `fig-4-7-profile-fixes` | 4.7 | What gets fixed first? | His public profile, as displayed; Parliament of Kenya record (T1) | cards |
| `fig-4-8-decision-rules` | 4.8 | When does the plan change? | This proposal; the test waits on [DATA NEEDED — Meta Insights export, Week 1] (target) | decision |
| `fig-5-1-workstreams` | 5.1 | Who owns what? | This proposal, Sections 5.1–5.9 (target) | cards |
| `fig-5-2-workstream-panels` | 5.2 | What does each group produce? | This proposal, Sections 5.1–5.9 (target) | cards |
| `fig-5-3-four-weeks` | 5.3 | What happens in the first four weeks? | This proposal, Sections 5.1–5.9 (target); The audit waits on [DATA NEEDED — Meta Insights export, Week 1] (data needed) | steps + cards |
| `fig-5-4-phases` | 5.4 | How does the plan run to August 2027? | This proposal, Sections 5.1–5.9 (target); Nomination window: single-source report (T3) | timeline |
| `fig-5-5-cadence` | 5.5 | What does he receive, and how often? | This proposal, Sections 5.1–5.9 (target) | matrix + matrix |
| `fig-5-6-kpis` | 5.6 | How is progress measured? | This proposal, Sections 5.1–5.9 (target); Baselines: [DATA NEEDED — Meta Insights export, Week 1] (data needed) | gauges + tilemap |
| `fig-5-7-approval` | 5.7 | How are decisions made? | This proposal, Sections 5.1–5.9 (target) | steps + decision |
| `fig-5-8-risk` | 5.8 | What could go wrong? | This proposal, Sections 5.1–5.9 (target); Article 180(7): published commentary reads it both ways; no court has ruled (T2) | risk |
| `fig-5-9-team` | 5.9 | What shape is the team? | This proposal, Sections 5.1–5.9 (target) | cards + cards + cards |
| `fig-5-2-1-report-flow` | 5.2.1.1 | What happens to a report in the service-delivery tracker? | This proposal, Section 5.2 (target) | steps |
| `fig-5-2-3-field-loop` | 5.2.3.2 | How do the field and digital operations learn from each other? | This proposal, Section 5.2 (target) | steps |
| `fig-5-2-3-ussd-menu` | 5.2.3.3 | What does the USSD menu offer? | This proposal, Section 5.2 (target); Shortcode: [Insert shortcode] at contracting (data needed) | mock |
| `fig-6-1-dependencies` | 6.1 | What does the campaign provide? | This proposal, Section 6.1 (target) | steps |
| `fig-6-3-decision` | 6.3 | What is being asked? | Nomination window: single-source report (T3); This proposal (target) | cards + steps |

Checked for every figure: title states the finding; subtitle is the question; takeaway beneath;
source with a shape-coded tier pill; table in a native `<details>` (keyboard-reachable, open with
JS off, opened for print); CSV link. At 320, 360 and 1440 px no page or figure scrolls
horizontally (every route, JS on and off). Every figure was checked in greyscale: the three data states read by pattern and
label, and stacked bars label their large segments in place. The pilot was also checked in print.
Axe, run over every figure on /full, finds no contrast violations in either theme (it was not run over the prose).

## 5. Consistency fixes

All eight of the brief's fixes are **applied**; values, reasons and verification are in
CONFLICTS-RESOLVED §A. In short: incumbency unsettled, carried as two branches in 5.8.15; 26.2% /
44.1% / 73.8% connectivity (2023/24) with 2019 only in 2.6; one 200,000 benchmark with every route
measured on ballots (**Path B no longer clears it**); 5 of the 12 largest wards in the pool; 605,703
at T1; campaign-owned items marked outside scope; engagement money language removed and linted;
the 40% threshold removed. C-1 to C-21 are applied; the 82/18 channel split is confirmed on the
2023/24 rate (R-20); the two USSD menus are one (R-19); **C-22** (endorsement count per sub-county or
in total) stays open as a `[CONFIRM/EDIT]`. R-1 to R-28 record (R-23 to R-28 enter Firefly's Public Data & Evidence Audit of 24 September 2026) what the rebuild found and changed.

## 6. What is still open

Generated by `scripts/build-open-items.ts`. After the removal of 24 September 2026 (R-29 to R-31)
no marker remains in the served content. What is left is **3 named analytical limits**, rendered
as `fig-3-10-gaps`; `fig-6-2-open-items` is removed.

| Gap | Closing document | Holder | Where |
|---|---|---|---|
| Ward-level voter preference | Not published | No source publishes it | Section 3.10 |
| Historical 2013 Gubernatorial Ward-by-Ward Certified Returns | Not published | IEBC | Section 3.10 |
| Historical 2017 Gubernatorial Ward-by-Ward Tallies | Not published | IEBC | Section 3.10 |

## 7. Performance, before and after

Same method both times (RECON §7): `next build && next start`, Chromium at 390×844, DPR 2, 150 ms
RTT, 1.6 Mbps down, CPU 4×. "Before" is `6af5d18` built locally, because production could not be
reached from this environment.

| | Before `/` | After `/` | Before `/full` | After `/full` | Ceiling |
|---|---|---|---|---|---|
| LCP | 2,056 ms | **2,016 ms** | 2,140 ms | **2,080 ms** | ≤ 2.5 s |
| CLS | 0 | **0** | 0 | **0** | < 0.1 |
| First-load JS (Next) | 448 kB | **430 kB** | 448 kB | 430 kB | ≤ 473 kB |
| JS transferred | 487 kB | **516 kB** | 487 kB | 516 kB | — |
| Total transferred | 766 kB | **788 kB** | 1,223 kB | **1,287 kB** | < 1.5 MB |
| Page height at 390 px | 324,447 px | 325,047 px | 324,848 px | 327,468 px | — |
| `<h1>` count | 1 | **1** | 2 | **1** | 1 |
| INP, §3.1 register toggle | not measured | **88–104 ms** after load settles; up to 416 ms if tapped during hydration | | | ≤ 200 ms |

The brief's "JavaScript < 300 KB" line is **not met** (430 kB first-load); the "baseline + 25 kB"
ceiling is met on first-load JS. JS transferred rose by 29 kB, which is over +25 kB on that measure.

## 8. Assumptions, and what is not done

**Assumed rather than verified**

- The brief's second paste, with no other text, was read as approval to proceed past Phase 0.
- The nomination window is drawn as 20 October to 30 November 2026 on the axis, from "late October
  to November" (T3); its text label never states a day.
- The general election date is cited to Article 101 of the Constitution (second Tuesday of August).
- `register.2026.continuous` (11,106) is a remainder, so it is marked modelled; the brief's data
  keys implied a sourced figure.
- Station posture: "Priority" is placement, "Secondary" is drawn as a third state, and the rest are
  monitoring, read from `data/media-ownership.ts`.
- The cover's four figures: "Both" Wiper rivals (Kasalu, Wambua) have won countywide, from the 2022
  results (T2).
- Heading fences placed before a file's first heading attach to no section in search.

**Not done, with reason**

- **WhatsApp share-card preview.** The OG image (1200 × 630, data-free) and metadata are set, but
  no WhatsApp client is reachable from this environment. Send the preview link to yourself once.
- **Lighthouse.** Not installed here; the numbers above are Playwright measurements, stated as such.
- **The 300 KB JavaScript line** (above).
- **Screenshots** of every route at 320, 360 and 1440 px were taken and reviewed but are not
  committed (the long routes run to 325,000 px). Per-figure screenshots were reviewed for every figure.
- **Legacy figures kept.** Figures from the earlier registry that carry sourced or structural data
  (e.g. `constituency-power`, the two §5.6 scorecards, the language and compliance figures) stay;
  each passes `verify-figures`. Their data modules (`lib/figures/*.ts`) are not yet moved onto
  `lib/data/figures.ts`.
- **Tile-map layer switching.** The component supports six layers with a CSS-only switch, and each
  of the seven appearances shows the one layer its section needs. No appearance combines several
  layers, so the switch is exercised only by the §3.1 register toggle.
