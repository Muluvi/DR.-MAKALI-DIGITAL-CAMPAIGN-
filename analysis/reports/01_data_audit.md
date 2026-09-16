# Stage 1 — Data audit

What the pack contains, what the site claims, and where the two disagree.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-16*


## What was parsed

| File | Rows |
|---|---|
| `sources.csv` | 69 |
| `wards.csv` | 40 |
| `constituencies.csv` | 8 |
| `polls.csv` | 12 |
| `results_2022.csv` | 7 |
| `channels.csv` | 25 |
| `county_finance.csv` | 6 |
| `drought.csv` | 6 |
| `claims_register.csv` | 1007 |

14 markdown tables and 69 sources parsed from the pack. Sources split T1/T2/T3 as 19/22/28.


## Reconciliation

**The ward arithmetic holds.** All 40 wards sum to 532,758, matching each of the eight constituency totals and the IEBC 2022 county register. The site's own `data/ward-register.json` carries the same 40 figures, ward for ward, so two independent copies agree.

| Constituency | Ward sum | Wards | Declared | Agrees |
|---|---|---|---|---|
| Kitui Central | 77764 | 5 | 77764 | yes |
| Kitui East | 65377 | 6 | 65377 | yes |
| Kitui Rural | 55000 | 4 | 55000 | yes |
| Kitui South | 75372 | 6 | 75372 | yes |
| Kitui West | 59047 | 4 | 59047 | yes |
| Mwingi Central | 74231 | 6 | 74231 | yes |
| Mwingi North | 68829 | 5 | 68829 | yes |
| Mwingi West | 57138 | 4 | 57138 | yes |


## Problems found

8 high, 3 medium, 5 checks passed. Full list in `data/processed/audit_findings.csv`.


### High severity

**2026 register — register-2026**  
The two T3 figures disagree: 532,758 (2022) + 61,839 new [S5] = 594,597, but Kitui's July 2026 total is reported as 605,703 [S4]. Gap of 11,106.  
*Action:* Both are kept, neither adjusted. Obtain the IEBC ECVR county annex [S3] — it is the T1 figure and settles this.

**Site content — stale-register**  
532,758 (the 2022 register) is presented as the current electorate in: arithmetic.md. As of 16 Sep 2026 the register has been through the 2026 ECVR drive [S3].  
*Action:* Relabel as 'IEBC 2022 register' and show the 2026 figure separately, marked verify.

**Site content — stale-party-name**  
'Wiper Democratic Movement' appears in: measurement.md (1), objectives.md (1), risk.md (1), situation.md (4), summary.md (1). ORPP certified the change to 'Wiper Patriotic Front' in August 2025 [S6].  
*Action:* Replace with 'Wiper Patriotic Front' except where describing 2022, where 'WDM (now WPF)' is correct.

**2026 register — register-2026**  
605,703 is a T3 aggregator figure. It carries status 'verify' in every output.  
*Action:* Never present it as official. Replace with the IEBC annex.

**Nomination method — t3-dependency**  
The opinion-poll nomination method is T3, single-sourced to The County Diary [S10], and the whole nomination strategy rests on it.  
*Action:* Obtain official WPF communication on the method, pollster, timing and sample design.

**Site content — claim-sourcing**  
850 of 1,007 numeric claims (84%) carry no visible tier marker within 70 characters.  
*Action:* Most are restatements of figures tiered elsewhere on the page. Prioritise the ones that state a figure for the first time.

**Malombe eligibility — pack-vs-site**  
The pack states the seat is open: Malombe was elected in 2013 and 2022, and Article 180(7) limits governors to two terms [S63]. The site treats his eligibility as an unresolved two-branch question in situation.md.  
*Action:* Resolve. If the pack is right, the branching scenario is dead content and the framing should change to an open-seat race.

**Site content — missing-poll**  
The site shows only the Mizani rounds. Politrack Africa (12 Mar 2026, n = 2,927) is a second published pollster and is absent [S9].  
*Action:* Add Politrack as a separate series. Never join it to Mizani as one trend line.


### Medium severity

**Site content — claim-sourcing**  
1 site claims are explicitly marked Tier 3.  
*Action:* Each must render with a visible unconfirmed marker.

**Mutito/Kaliku — ward-name-variant**  
The pack spells this 'Mutito/Kaliku'; the site spells it 'Mutitu/Kaliku' (similarity 0.923). Matched by similarity, not exactly.  
*Action:* Confirm against the IEBC ward list and fix one spelling. This will break a boundary-file join at Stage 5 if left.

**Site content — stale-party-name**  
Bare 'Wiper' without 'Patriotic Front' appears in 17 files.  
*Action:* Acceptable as shorthand after the full name is used once per page; check first use.


### Checks that passed

- All 40 wards: Every ward's voter count in the pack matches the site's ward-register.json.
- Kitui County: 40 wards sum to 532,758, matching the IEBC 2022 county register exactly.
- polls: All 8 T3 rows in polls.csv carry status 'verify'.
- channels: All 13 T3 rows in channels.csv carry status 'verify'.
- county_finance: All 2 T3 rows in county_finance.csv carry status 'verify'.


## The claims register

1,007 numeric claims across 27 content files. 850 (84%) carry no tier marker within 70 characters of the figure.

That percentage overstates the problem and should not be quoted on its own. The site tiers a figure where it is introduced and then restates it in summaries, tables and callouts without repeating the marker. The register is a worklist, not a verdict: sort it by file and look for figures that appear for the first time without a tier.

| File | Claims | Unsourced |
|---|---|---|
| arithmetic.md | 394 | 383 |
| situation.md | 166 | 81 |
| audiences.md | 41 | 27 |
| roadmap.md | 41 | 41 |
| reach.md | 39 | 36 |
| scope-data.md | 32 | 32 |
| objectives.md | 31 | 21 |
| scope-ground.md | 31 | 31 |


## Templates written

Seven templates and a schema README are in `data/templates/`. Headers only, no example rows. The ward boundary file location is documented in `data/raw/boundaries/README.md`.

- `data/templates/posts.csv`
- `data/templates/comments.csv`
- `data/templates/competitors.csv`
- `data/templates/baseline_survey.csv`
- `data/templates/register_2026_by_ward.csv`
- `data/templates/results_2022_by_ward.csv`
- `data/templates/issues.csv`
- `data/templates/README.md`
- `data/raw/boundaries/README.md`


## Data gaps

- **[DATA NEEDED]** `posts.csv` is empty — Every public post from the candidate's channels, for the Existing Presence Audit.
- **[DATA NEEDED]** `comments.csv` is empty — Public comments for theme and sentiment coding.
- **[DATA NEEDED]** `competitors.csv` is empty — Rival channel benchmarks for Kasalu, Wambua and Ngilu.
- **[DATA NEEDED]** `baseline_survey.csv` is empty — Ward-level survey aggregates: recognition, favourability, issue salience.
- **[DATA NEEDED]** `register_2026_by_ward.csv` is empty — The post-ECVR 2026 register, by ward — the IEBC annex figure.
- **[DATA NEEDED]** `results_2022_by_ward.csv` is empty — 2022 governor and Woman Rep results by ward, from IEBC Forms 37A/37B.
- **[DATA NEEDED]** `issues.csv` is empty — Issue salience and candidate credibility, for the Stage 10 matrix.
- **[DATA NEEDED]** The IEBC ECVR county annex [S3] — the T1 2026 register. It settles the 605,703 vs 594,597 conflict and is the highest-value missing input.


## What this means for later stages

- Stage 2 has three polls from two pollsters. They stay on separate series, and with fewer than five polls there is no Bayesian average.
- Stage 3 can run on the 2022 ward register. Turnout and support ranges are placeholders until ward-level 2022 results arrive.
- Stage 4 has one of six features with data. The other five are dropped and listed, never imputed.
- Stage 5 needs a boundary file. Two ward-name variants are already known and will need the normalisation described in the boundary README.
- Stages 6, 7 and 8 have no input yet and will report [DATA NEEDED].
