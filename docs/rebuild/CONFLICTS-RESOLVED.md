# Conflicts resolved

Every consistency fix in the rebuild brief (§C), every conflict in `docs/visual-audit/CONFLICTS.md`,
and every disagreement the rebuild found between the brief, the prose and the repo's sourced data.
Rule applied throughout: the brief wins on intent, and the repo's sourced data wins on fact. Values
are given as the data layer (`lib/data/figures.ts`) now holds them, by figure id where one exists.

Status: **Applied** means the content and the data layer now carry the value, and the build checks
it where a check exists. **Phase 3** means the prose is fixed and the figure that draws it is
rebuilt in Phase 3.

---

## A. The brief's eight consistency fixes

| # | Issue | Value chosen | Reason | Status |
|---|---|---|---|---|
| 1 | Incumbency, Art. 180(7) | **Unclear → Section 5.8 only.** 3.5 states that the record does not settle it and points to 5.8.15, which carries the two branches. Annex C's "open seat" sentence is removed. | `data/competitors.ts` states both readings and resolves neither, and no court has ruled. The `a089642` edit to 3.5 asserted a term limit "under the official constitutional record"; that assertion had no source and was reverted. | Applied |
| 2 | Internet use | **26.2%** internet, **44.1%** phone (`ict.internet`, `ict.phone`, CA/KNBS 2023/24, T1). 2019's 13.6% / 42.9% appear only as the comparison column in 2.6. 86.4% offline is replaced everywhere by **73.8%** (`ict.offline`). | Recency: the latest measurement is current. `analysis/config/assumptions.yaml` already holds 2023/24 as the working rate. | Applied |
| 3 | Path B margin | One benchmark, **200,000** (`benchmark`), stated once in 3.1. Every route's margin is now **ballots at the 62% constant − 200,000**: A −75,877, B −68,447, C −75,214, D −81,077 (`path.*.margin`). | The old "+12,183" subtracted a vote threshold from a count of registered voters. On ballots, no route clears 200,000 on its own; 3.3 now says so. **This reverses Path B's finding** (reported in RECON conflict 3). | Applied |
| 4 | Deficit-ward counts | **5 of the 12 largest wards** lie where he has never held office (`pareto.top12.in-pool`): Kyuso, Tseikuru, Mumoni, Athi, Ikanga/Kyatune; **83,496** voters, **15.7%**. "3 of the top 7", "2 of the top 11", "4 of the top 8" and "5 of the top 8" are retired. | One denominator (the 12 largest), one numerator (the intersection with the pool: Mwingi ×3 and Kitui South), computed from the register. | Applied |
| 5 | 605,703 tier | **T1** (`register.2026`). | Tier of the primary document cited: the IEBC ECVR county annex, read directly (`assumptions.yaml`, `register.y2026_july`, CONFIRMED). `data/electoral-arithmetic.ts` called it "T3 uncertified"; that module is superseded. | Applied |
| 6 | Scope creep | 240 of 400 ward captains, 800 M-Pesa ambassadors, 1,200 boda Stage Champions, radio studio bookings and outside broadcasts, and sound-truck caravans are **campaign-owned recommendations**, listed as outside scope in 5.1.3 and marked so where they appear (3.8.1, 4.2, 5.2.3.1, 5.8). Workstream 10 stays out of scope. GE-02 (captains) is labelled campaign-owned. | Brief rule. | Applied |
| 7 | Budget language | "geofenced spend" → effort; "before further budget commits" → "before further effort commits" (2.3.1); "minimize redundant budget expenditure" → "avoid duplicated effort" (2.8); plus about thirty further instances in §§4–6. `scripts/check-copy.ts` now fails the build on engagement money language, with each county-money phrase allow-listed and its reason stated. | Brief rule. | Applied |
| 8 | 40.0% nomination threshold | **Removed**, with the 55.0% primary-voter threshold, from 1.1, 5.6 and the KPI data. | Unsourced: `assumptions.yaml` says `no_fixed_threshold: true`. The weekly-gain slider that used it was removed in Phase 1. | Applied |

## B. `docs/visual-audit/CONFLICTS.md`, C-1 to C-22

| # | Conflict | Resolution | Status |
|---|---|---|---|
| C-1 | The weekly-gain simulator contradicted itself | Component removed with the slider (non-negotiable 1). | Applied |
| C-2 | The simulator's 14 weeks had partly elapsed | Removed with the simulator. | Applied |
| C-3 | 40% benchmark sourced to party polls | Removed (consistency fix 8). | Applied |
| C-4 | Path B margin against the wrong number | Superseded by fix 3: every margin is now ballots − 200,000. | Applied |
| C-5 | "5 of top 8 wards" | Superseded by fix 4: 5 of the 12 largest. | Applied |
| C-6 | 51.72% or 51.73% | 275,570 / 532,758 = 51.725%. Printed as **51.7%** to one decimal throughout (`pool.share`), which is also how the brief states it. | Applied |
| C-7 | "24 deficit wards" | **21** (`pool.wards`): 5 + 4 + 6 + 6. Corrected in 4.2 and R-04. | Applied |
| C-8 | Poll tier labels disagree | Annex C now carries each round's tier as the pipeline holds it: Politrack T3, Mizani June T2, Mizani August T3. No poll appears outside Annex C. | Applied |
| C-9 | 2026 register T1 and T3 | T1 (fix 5). 3.1's "Tier 3, [VERIFY], not used in any calculation" callout rewritten. | Applied |
| C-10 | Margin of error at one end of a range | The passage (old §3.1.3, "What the poll would measure") is cut by the brief's cut table. Annex C's own margins are computed per candidate from Politrack's published n. | Applied |
| C-11 | Developer path visible to the client | The export note now reads "Every input is a stated modelling assumption, listed in Section 6.2.1; none is a measurement." in both copies of the export and in `stage12_synthesis.py`. | Applied |
| C-12 | Who owns the six | 5.1 prose aligned to the 5.1.2 table, which `fig-5-1-workstreams` draws: seven Firefly (WS 1 tracker, 3, 4, 9, 11, 12, 14), six team-run (WS 1 platforms, 2, 5, 6, 7, 8), two outside (10, 13). | Applied |
| C-13 | Two connectivity rates | Fix 2. | Applied |
| C-14 | Two nomination windows | The component carrying "29 Aug – 15 Nov" (DeficitGauge) was removed. The window is "final quarter of 2026, late October to November, reported (T3)" everywhere. | Applied |
| C-15 | Hero labels the Mwingi bloc as the digital stage | HeroVisual, StateOfTheRace and VoterProjectionsChart are deleted; the cover is `fig-cover-map` and `fig-cover-spine`. | Applied |
| C-16 | Zones mix sub-counties with a constituency register | Zone totals computed from the sub-county census figures (`zone.*`); `fig-3-7-zones` states the unit mismatch on the figure and uses the nearest constituency match for the register share. | Applied |
| C-17 | Offline reach figures carry no tier | The `offline-channels` figure is removed (REPLACEMENTS.md, §3.8.1); each channel reads `[DATA NEEDED — …]` with its closing document. | Applied |
| C-18 | 35,000 printed as 6.5% and 6.6% | The `platform-sizing` figure is removed with its unsourced ranges; in-county users per platform are `[DATA NEEDED — Meta Audience Insights export, Week 1]`. | Applied |
| C-19 | 3.1.x sub-numbers under 3.6 | Removed in Phase 1. | Applied |
| C-20 | Musyi FM hostile and priority | `fig-2-7-media` is drawn from `data/media-ownership.ts`: Musyi is a placement station. The bypass diagram (`radio-gatekeepers`) is replaced. | Applied |
| C-21 | Kikamba on the bulk-SMS rail | Resolved in #12 and kept: bulk political SMS is English or Kiswahili only; Kikamba travels by voice note and radio (3.8.1, 4.3.2, 5.2.3.3). | Applied |
| C-22 | 500 signatures per sub-county or in total | Unchanged: still two readings in 5.8.11 and 5.8.12. Needs the IEBC nomination rules document; listed in 6.1. | Open, `[CONFIRM/EDIT]` |

## C. Found by the rebuild

| # | Conflict | Value chosen | Reason | Status |
|---|---|---|---|---|
| R-1 | §2.5 envelope: 12.38bn (`a089642`) vs 13.79bn | **KSh 13.79bn = 11.64 + 1.12 + 1.04**, with a **−0.01bn rounding segment** (`budget.*`). Own-source revenue carries both published values, 1.12bn (the Paper) and 1.339bn (the Assembly's revision). | `data/analysis/county-finance-2026-27.json` cites the CFSP [S47, S48]; nothing in the repo sources 12.38. `ResourceEnvelopeBlock` also carried a third set (1.03bn grants, 84.5%) and now reads the data layer. | Applied |
| R-2 | Envelope shares: computed 84.4%, published 84.3% | **84.3% / 8.1% / 7.5%**, as the Paper prints them. | The published figure is the sourced one; the recomputation is ours. | Applied |
| R-3 | Top-12 total: 201,385 vs 201,267 | **201,267 (37.78%)** (`pareto.top12`). | Summed from the ward register. | Applied |
| R-4 | 2022 governor results: T1 vs T2 | **T2** until an IEBC Form 37C is cited (`result.2022.*`). 2017 results stay T1 (the Court of Appeal judgment). | `assumptions.yaml` and the pipeline hold 2022 as T2, cited through The Star, the Nation and the Standard; `data/electoral-history.ts` cited only the IEBC home page. | Applied |
| R-5 | Musila 2022: 114,606 "certified" vs 117,606 | **Both shown, neither preferred** (`result.2022.gov.musila`, `alt`). | The pipeline records two published totals and no certified one. | Applied |
| R-6 | Poverty: 60.4% vs 55.2% | **Both shown**: KNBS Poverty Report 2021, **55.2%** (current, T1), and NDMA citing KNBS, 60.4% (T2). The 4.4.6 example uses 55.2%. | Disputed figures show both values (brief §S). | Applied |
| R-7 | Digital ceiling: ~72,000 vs 158,696 | **158,696 voters** reachable online (`reach.smartphone`, modelled on the July 2026 register at 26.2%); **108,419** SMS-only; **338,588** no phone; **447,007** not reachable online. | The ~72,000 came from the 2019 rate. The finding survives: 158,696 is still 41,304 short of 200,000 before reach becomes votes. The 82/18 effort split in 4.6 was argued from the old rate and is marked `[CONFIRM/EDIT]`. | Applied; weighting open |
| R-8 | Smartphone share: 63.7% vs 59.7% | **59.7%** of active SIMs, national (`ict.smartphone-share`, CA Q3 FY2025/26, T2). | `assumptions.yaml` computes 50.2m / 84.1m. | Applied |
| R-9 | 62% turnout "(Tier 1)" | **A modelling constant, not a measurement** (`turnout.constant`, target). | `assumptions.yaml`: "the pack supplies no turnout figure at all". | Applied |
| R-10 | ~460,000 offline voters | **447,007** (`reach.offline`). | The pipeline's modelled reach. | Applied |
| R-11 | Annex C poll Tier 2 labels and "±2.53%" on Mizani | Pipeline tiers; Mizani margin **unknown** (no sample published). ±2.53% belonged to the cut §3.1.3 hypothetical design, not to any poll. | Applied |
| R-12 | Segment sizes without sources (4.3.3, 4.3.6, 4.3.7, smartphone shares) | `[DATA NEEDED]` with the document that closes each (3.10.1). | Non-negotiable 5; fig-4-3 "no invented sizes". | Applied |
| R-13 | Scenario export: "current measured preference" | Removed from the export and from `stage12_synthesis.py`; only the competitive scenario is published, labelled modelled, with no share-of-draws rows. | Brief cut table (3.4.2) and non-negotiable 1. | Applied |
| R-14 | Nomination KPIs NW-01 to NW-03 rested on a tracking poll, a CATI booster and a salience survey | Replaced with observable indicators: reach share in the pool, followers in Mwingi, consented contacts in the pool. | Non-negotiable 1; brief 1.5 and 5.6. | Applied |
| R-15 | §2.1: continuous registration, 11,106, printed as Tier 1 | Marked **modelled** (`register.2026.continuous`): July 2026 less 2022 less the ECVR drive. The IEBC annex publishes the total and the drive, not this remainder. | Brief §H: modelled figures are marked. | Applied |
| R-16 | §6.1.1: "Seven dependencies … the remaining four" against eight numbered in §6.1 | **Eight**; the remaining five now include sign-off on the engagement level. | The §6.1 list is the fuller statement. | Applied |
| R-17 | check-figures excused any literal within twelve characters of a year | An allow-list match must now cover the literal itself. Five figures that had slipped through (605,703 twice, 61,839, 11,106, 198,004 twice, 2,927) are tokens. | Non-negotiable 6. | Applied |
| R-18 | Effort and channel-shift shares typed in prose (35/30/20/15 in §5.3; 82/18 and 37/20/18/7 in §4.6) | Tokens on `effort.*` and `channel.*`; the offline share is derived from its four channels. | Non-negotiable 6. | Applied |
