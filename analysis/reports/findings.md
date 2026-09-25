# Findings

The things this analysis establishes, what every one of them rests on, and what is still missing.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-25*


## The eight findings

**1. The SMS layer is half the size the proposal assumes.**  
On the confirmed 2023/24 rates, 108,419 voters own a phone but no data, against 177,473 on the 2019 rates the proposal was built on. Phone ownership rose 1.2 points in five years while internet use rose 12.6 — almost nobody new got a phone, people who had one got online. The 82/18 offline-digital weighting was set against superseded numbers, and SMS is carrying weight its audience no longer supports.  
*Source: Stage 9.*

**2. The bar for 2027 is about 27,000 votes higher than 2022's winning tally.**  
The register has grown from 532,758 to 605,703, confirmed against the IEBC annex. The 2022 winner took 37.2% of the register; the same share of today's register is about 225,322 votes, against the 198,004 the proposal measures everything against. Every target built on ~200,000 is set too low.  
*Source: Stage 3.*

**3. The digital ceiling is roughly one voter in four, not one in seven.**  
158,696 voters are reachable by smartphone or data on current rates. That is the second-largest of the three segments. It does not make the case for a digital-first campaign — the no-phone segment is still larger than the other two combined — but it does remove the basis for capping digital at 18%.  
*Source: Stage 9.*

**4. The offline majority survives every update, and remains the strategic core.**  
338,588 voters own no phone at all — larger than the digital and SMS segments together. No ad budget, SMS send or USSD flow reaches them. This is the one structural claim in the proposal that has strengthened rather than weakened as the data improved.  
*Source: Stage 9.*

**5. The SMS layer cannot carry Kikamba.**  
CA/NCIC guidelines limit bulk political SMS to English or Kiswahili, with 48-hour advance lodging and an operator veto [S53, S54]. The SMS-only segment is the most rural and most likely to prefer Kikamba, so the language the campaign most needs is unavailable on the channel that reaches them — and that channel is now smaller than the proposal assumes.  
*Source: Stage 9.*

**6. NG-CDF beneficiary lists cannot become a campaign list.**  
ODPC's 2025 public-sector guidance bars reusing public-programme personal data for political mobilisation without explicit consent [S57, T1]. Project records remain usable as proof points. Consented opt-in is the only lawful route, which makes list building an objective rather than an assumption.  
*Source: Constraint.*

**7. Water is the strongest evidenced argument available.**  
Kitui has the lowest share of any county in Kenya with at least basic drinking-water service, at 21% [S41, T1], and the longest water trekking distance among semi-arid counties at 7.2 km in February 2026 [S43, T1]. Both are Tier 1, current and county-wide — a rare combination in this evidence base.  
*Source: Stage 10.*

**8. The site's prose now contradicts its own data blocks.**  
Several sections still state 13.6% internet use and an 86.4% offline majority, and size the channel mix against them, while the mounted data blocks show 26.2%. The fix is not a find-and-replace: 86.4% is the rhetorical spine of Section 3.6 and the justification for the 82/18 split, so the rate cannot be updated without revisiting the argument it supports.  
*Source: Stage 9.*


## Closed since the first audit

Four findings from earlier runs of this pipeline are no longer open. Three were fixed on the site; one was my own error.

| Finding | How it closed |
|---|---|
| The party name was wrong on the site | Corrected to Wiper Patriotic Front throughout |
| Opinion polls appeared on the site | Removed with Annex C, September 2026: Firefly works from existing records and its own analysis only, and the site build now refuses any poll |
| The 2026 register was unverified | Confirmed against the IEBC annex: 605,703, Tier 1 |
| The two 2026 register figures 'did not reconcile' | WITHDRAWN — my error. They measure different windows and were never meant to sum. See Stage 1. |


## What the models do and do not say

- **Scenario model, not a forecast.** Stage 3 draws turnout and support from placeholder ranges. It shows what the ward arithmetic yields under stated assumptions.
- **No win probability is produced anywhere.** That needs rival vote ranges, which have not been supplied. Governor races are won by plurality, so there is no threshold to clear — 198,004 is a benchmark.
- **The ward priority index has one of six features.** It currently reproduces the register ranking, which is faithful but not useful. Five features are dropped and named; nothing is imputed.
- **Stage 9's figures are modelled, not measured** — published rates times ward registers, with the rate and its year printed beside every number.


## Every assumption

26 entries in `config/assumptions.yaml` are marked PLACEHOLDER — nobody has confirmed them. Each carries a rationale in the file.

| Assumption | Value | Why it is a placeholder |
|---|---|---|
| compliance.send_window_draft | 08:00-18:00 | A 2020 draft revision proposed this window. [VERIFY] whether it is in force. |
| index_weights.connectivity | 0.1 | Channel-mix proxy, not persuasion weight — it says how to reach a ward, not how much the ward matters. Requires ward-level coverage data. [DATA NEEDED |
| index_weights.drought_exposure | 0.1 | Issue-salience proxy. NDMA publishes at county level only in the pack; sub-county detail is [DATA NEEDED]. A county-wide constant has zero variance ac |
| index_weights.party_strength_2022 | 0.35 | Requires 2022 Forms 37A/37B by ward. [DATA NEEDED] (pack gap 7). Carries the 0.25 the retired recognition-gap feature held: that feature needed a vote |
| index_weights.registered_voters | 0.3 | Raw electoral weight. The only feature with complete T1 data today. |
| index_weights.registration_growth | 0.15 | Requires the 2026 register by ward. [DATA NEEDED] — currently dropped. |
| labelling.low_confidence_threshold | 0.7 | Labels below this confidence are flagged for human review. |
| measurement.baseline_rates | [0.02, 0.05, 0.1] | Illustrative baseline response rates for the two-proportion MDE grid. No campaign has run yet, so there is no measured baseline. Replaced by the Week  |
| measurement.holdout_share | 0.15 | Share of wards held out as untreated controls, stratified by constituency. 15% of 40 is 6 wards. Large enough to read an effect, small enough to cost  |
| measurement.list_sizes | [1000, 5000, 10000, 25000, 50000, 100000] | Illustrative SMS list sizes spanning ward-level to countywide sends. |
| reach.ward_uniformity | True | The model applies county rates uniformly across all 40 wards, because no ward-level connectivity data exists ([DATA NEEDED], pack gap 20). This is kno |
| register.by_ward_2026 | None | [DATA NEEDED] The 2026 register by ward. The ECVR drive was ward-based, so growth is uneven and cannot be distributed pro rata without inventing data. |
| register.y2026_uniform_scale_factor | 1.1369 | 605,703 / 532,758 = 1.1369. Used ONLY to project the 2022 ward register onto the 2026 county total so the simulation can report against both register  |
| rivals.model_rivals | False | No rival vote ranges have been supplied. While this is false, Stage 3 reports benchmark comparisons and explicitly states it is NOT a win probability. |
| sensitivity.dirichlet_concentration | 10.0 | Concentration for the Dirichlet draw around the stated weights. 10.0 gives meaningful spread without producing degenerate weight vectors. Lower = more |
| sensitivity.unstable_rank_range | 8 | A ward whose rank spans more than 8 places across the 1,000 draws is flagged unstable. 8 is one fifth of 40 wards — a judgement line, stated so it can |
| support.competitive_ward_high | 0.6 | Upper bound for the competitive scenario: the share the 2022 winner actually achieved. Using the observed winning share as the ceiling keeps the scena |
| support.competitive_ward_low | 0.4 | Lower bound for the competitive general-election scenario, as a share of ballots cast in the ward. Anchored on 2022: Malombe took roughly 60% of the v |
| support.home_advantage_multiplier | 1.35 | Multiplier on the drawn share in his home constituency's five wards. He has been its MP since 2013 [S18]. No measured home-ward support figure exists  |
| support.mwingi_narrative_multiplier | 1.0 | Set to 1.00 deliberately, i.e. no effect. The "Kavaa Makali" narrative is reported to be gaining traction in Mwingi [S30], but that is a single T3 out |
| support.ward_dispersion | 0.05 | Plus or minus 5 percentage points of ward-level variation around the countywide support drawn for each draw. Same reasoning as turnout.ward_dispersion |
| turnout.distribution | uniform | Uniform, not normal. With no ward-level turnout data there is no basis for claiming a central tendency, and a uniform draw does not pretend to one. |
| turnout.ward_dispersion | 0.06 | Plus or minus 6 percentage points of ward-level variation around the county turnout drawn for each scenario. Turnout is drawn once per draw for the wh |
| turnout.ward_high | 0.72 | Upper bound of the per-ward turnout draw. See ward_low. |
| turnout.ward_low | 0.55 | Lower bound of the per-ward turnout draw. The site's §3.4.1 asserts a ~62% county average; the pack supplies no turnout figure at all and no ward-leve |


## What to collect next, in order

Ranked by what each unlocks against how hard it is to get. Every item is an existing record or the campaign's own data; nothing on this list is new research. The first three are the ones worth chasing; below those, the return falls off sharply.

| # | What | What it unlocks | How to get it | Stages |
|---|---|---|---|---|
| 1 | posts.csv — 90 days of public posts | The whole Existing Presence Audit: engagement by pillar, format and language, the day-and-hour heatmap, cadence, and what actually drives engagement. | Manual log from the public page, or a Professional Dashboard export if the account is a Page. Confirm which it is first — a personal profile has no export. Over ~300 posts, set ANTHROPIC_API_KEY and the labelling script runs. | Stage 6 |
| 2 | 2022 Forms 37A/37B by ward | Ward-level party strength and turnout. Replaces two placeholder ranges in the simulation with measured values and adds a fourth feature to the ward index. | IEBC, or party agents' copies. Presidential Forms 34A are already public and serve as a turnout proxy by polling station if 37A/37B are slow. | Stages 3, 4 |
| 3 | Ward boundary file | Five choropleth maps. geopandas is installed, the name-matching is written and tested, and two known spelling variants are already handled. | IEBC 2022 delimitation shapefiles, or ADM3 boundaries from Kenya Open Data or OCHA/HDX. Drop it in data/raw/boundaries/. | Stage 5 |
| 4 | Ward-level 2G/3G/4G coverage | The binding constraint on reach now that the county rates are confirmed. The KNBS household survey shows 56.6% urban against 25.0% rural, so one county rate across Township and Tharaka is the largest remaining error in Stage 9. | Safaricom and Airtel coverage maps; CA universal-service studies. | Stages 4, 9 |
| 5 | comments.csv — public comments | Theme and sentiment coding, and a behavioural read on issue salience to sit alongside the evidence ranking. | Export with names and handles already removed. Three columns only. A Kikamba-speaking reviewer is a staffing dependency, not a data one. | Stages 7, 10 |
| 6 | competitors.csv | Any rival benchmark at all. Currently there is none. | Manual audit of public pages plus Meta Ad Library. Internal only — never published. | Stage 8 |
| 7 | The 2026 register by ward | Removes the last modelled distribution: ward figures currently scale the confirmed county total on 2022 shares. | IEBC, if a ward-level annex exists. Lower priority than it was — the county figure is confirmed and carries the county-level conclusions. | Stages 3, 4, 9 |
| 8 | Kikamba radio audience by sub-county | Converts the 338,588 no-phone voters into an addressable radio audience. Until then that segment is a population count, not a reach estimate. | Published audience measurement: the CA/KARF, GeoPoll or Ipsos releases that already exist. Nothing is commissioned. | Stage 9 |

Two things are deliberately absent from this list. **Rival vote ranges** would be needed for a win probability, and are not being sought: any range supplied today would be a guess, and the benchmark comparisons are the honest output. **WPF's 2027 nomination rules** cannot be obtained by research — only the party can confirm the method, and the whole nomination strategy rests on a single T3 report until it does.


## Audit findings still open

3 high-severity findings from Stage 1. Full list in `data/processed/audit_findings.csv`.
