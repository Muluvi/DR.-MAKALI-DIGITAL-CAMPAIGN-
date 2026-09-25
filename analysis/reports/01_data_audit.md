# Stage 1 — Data audit

What the pack contains, what the site claims, and where the two disagree.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-25*


## What was parsed

| File | Rows |
|---|---|
| `sources.csv` | 69 |
| `wards.csv` | 40 |
| `constituencies.csv` | 8 |
| `results_2022.csv` | 7 |
| `channels.csv` | 25 |
| `county_finance.csv` | 6 |
| `drought.csv` | 6 |
| `claims_register.csv` | 950 |

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

4 high, 2 medium, 5 checks passed. Full list in `data/processed/audit_findings.csv`.


### High severity

**2026 register — register-2026**  
The July 2026 total of 605,703 is T3, reported by Venas News [S4], and is marked verify. From 17 September 2026 this pipeline recorded it as Tier 1, read off the IEBC ECVR county annex [S3]. That was withdrawn on 25 September 2026: [S3] is IEBC's April release on the drive and cannot carry a July total, and no IEBC document giving the July total is in hand. The drive figure, 61,839, is unaffected.  
*Action:* Obtain IEBC's county register as at July 2026 and add one Tier 1 row, with its document URL, to data/templates/register_2026_by_county.csv.

**Malombe eligibility — pack-vs-site**  
The pack states the seat is open: Malombe was elected in 2013 and 2022, and Article 180(7) limits governors to two terms [S63]. The site treats his eligibility as an unresolved two-branch question in analysis.md, delivery.md.  
*Action:* Resolve. If the pack is right, the branching scenario is dead content and the framing should change to an open-seat race.

**Nomination method — t3-dependency**  
The reported WPF nomination method is T3, single-sourced to The County Diary [S10], and the whole nomination strategy rests on it.  
*Action:* Obtain the WPF NEC resolution, or the 2027 nomination rules and timetable as filed with the IEBC and the Registrar of Political Parties.

**Site content — claim-sourcing**  
739 of 950 numeric claims (78%) carry no visible tier marker within 70 characters.  
*Action:* Most are restatements of figures tiered elsewhere on the page. Prioritise the ones that state a figure for the first time.


### Medium severity

**Site content — stale-party-name**  
Bare 'Wiper' without 'Patriotic Front' appears in 10 files.  
*Action:* Acceptable as shorthand after the full name is used once per page; check first use.

**Site content — claim-sourcing**  
11 site claims are explicitly marked Tier 3.  
*Action:* Each must render with a visible unconfirmed marker.


### Checks that passed

- Kitui County: 40 wards sum to 532,758, matching the IEBC 2022 county register exactly.
- All 40 wards: Every ward's voter count in the pack matches the site's ward-register.json.
- 2026 register: The apparent 11,106-voter discrepancy is resolved, and was never a discrepancy. Of the 72,945 growth, 61,839 came from the 30-day ECVR drive that ended 28 April 2026; the remaining 11,106 is ordinary continuous registration outside that window, which opened on 29 September 2025 and continued after the drive closed. The July total post-dates the drive by three months.
- channels: All 13 T3 rows in channels.csv carry status 'verify'.
- county_finance: All 2 T3 rows in county_finance.csv carry status 'verify'.


## The claims register

950 numeric claims across 16 content files. 739 (78%) carry no tier marker within 70 characters of the figure.

That percentage overstates the problem and should not be quoted on its own. The site tiers a figure where it is introduced and then restates it in summaries, tables and callouts without repeating the marker. The register is a worklist, not a verdict: sort it by file and look for figures that appear for the first time without a tier.

| File | Claims | Unsourced |
|---|---|---|
| analysis.md | 299 | 248 |
| strategy.md | 167 | 117 |
| data.md | 128 | 55 |
| delivery.md | 98 | 91 |
| annex-county.md | 59 | 43 |
| workstreams-data.md | 40 | 40 |
| workstreams-ground.md | 32 | 28 |
| objectives.md | 31 | 29 |


## Templates written

7 templates and a schema README are in `data/templates/`. Headers only, no example rows. The ward boundary file location is documented in `data/raw/boundaries/README.md`.

- `data/templates/posts.csv`
- `data/templates/comments.csv`
- `data/templates/competitors.csv`
- `data/templates/register_2026_by_ward.csv`
- `data/templates/register_2026_by_county.csv`
- `data/templates/results_2022_by_ward.csv`
- `data/templates/issues.csv`
- `data/templates/README.md`
- `data/raw/boundaries/README.md`


## Data gaps

- **[DATA NEEDED]** `posts.csv` is empty — Every public post from the candidate's channels, for the Existing Presence Audit.
- **[DATA NEEDED]** `comments.csv` is empty — Public comments for theme and sentiment coding.
- **[DATA NEEDED]** `competitors.csv` is empty — Rival channel benchmarks for Kasalu, Wambua and Ngilu.
- **[DATA NEEDED]** `register_2026_by_ward.csv` is empty — The post-ECVR 2026 register, by ward — the IEBC annex figure.
- **[DATA NEEDED]** `register_2026_by_county.csv` is empty — The post-ECVR 2026 register at COUNTY level — the IEBC annex row for Kitui.
- **[DATA NEEDED]** `results_2022_by_ward.csv` is empty — 2022 governor and Woman Rep results by ward, from IEBC Forms 37A/37B.
- **[DATA NEEDED]** `issues.csv` is empty — Issue salience and candidate credibility, for the Stage 10 matrix.
- **[DATA NEEDED]** IEBC's county register as at July 2026 — the T1 source for the 2026 total. 605,703 is Tier 3 [S4] and verify until it is in hand.


## What this means for later stages

- Stage 3 can run on the 2022 ward register. Turnout and support ranges are placeholders until ward-level 2022 results arrive.
- Stage 4 has one of 5 features with data. The others are dropped and listed, never imputed.
- Stage 5 needs a boundary file. Two ward-name variants are already known and will need the normalisation described in the boundary README.
- Stages 6, 7 and 8 have no input yet and will report [DATA NEEDED].
