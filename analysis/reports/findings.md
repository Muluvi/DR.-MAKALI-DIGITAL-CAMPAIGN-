# Findings

The ten things this analysis establishes, what every one of them rests on, and what is still missing.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-17*


## The ten findings

**1. The 'widening deficit' cannot be substantiated.**  
The site reads 11.1 to 15.3 points as a trend. Neither Mizani round published a sample size, so the change returns cannot determine. June also excluded Ngilu while August included her at 17.0%, so part of the movement is a changed field rather than changed opinion. The deficit is real in each round; its direction is not measurable.  
*Source: Stage 2.*

**2. The SMS layer is half the size the proposal assumes.**  
On the confirmed 2023/24 rates, 108,419 voters own a phone but no data, against 177,473 on the 2019 rates the proposal was built on. Phone ownership rose 1.2 points in five years while internet use rose 12.6 — almost nobody new got a phone, people who had one got online. The 82/18 offline-digital weighting was set against superseded numbers, and SMS is carrying weight its audience no longer supports.  
*Source: Stage 9.*

**3. The bar for 2027 is about 27,000 votes higher than 2022's winning tally.**  
The register has grown from 532,758 to 605,703, confirmed against the IEBC annex. The 2022 winner took 37.2% of the register; the same share of today's register is about 225,322 votes, against the 198,004 the proposal measures everything against. Every target built on ~200,000 is set too low.  
*Source: Stage 3.*

**4. Only one of the three published polls can be tested, and its gap is real.**  
Politrack (12 March 2026, n = 2,927) is the sole poll with a published sample size. At that n its 9.0-point gap carries a margin of ±2.82 points and clears zero comfortably. Neither Mizani round published n, so nothing about their movement can be established.  
*Source: Stage 2.*

**5. The digital ceiling is roughly one voter in four, not one in seven.**  
158,696 voters are reachable by smartphone or data on current rates. That is the second-largest of the three segments. It does not make the case for a digital-first campaign — the no-phone segment is still larger than the other two combined — but it does remove the basis for capping digital at 18%.  
*Source: Stage 9.*

**6. The offline majority survives every update, and remains the strategic core.**  
338,588 voters own no phone at all — larger than the digital and SMS segments together. No ad budget, SMS send or USSD flow reaches them. This is the one structural claim in the proposal that has strengthened rather than weakened as the data improved.  
*Source: Stage 9.*

**7. The SMS layer cannot carry Kikamba.**  
CA/NCIC guidelines limit bulk political SMS to English or Kiswahili, with 48-hour advance lodging and an operator veto [S53, S54]. The SMS-only segment is the most rural and most likely to prefer Kikamba, so the language the campaign most needs is unavailable on the channel that reaches them — and that channel is now smaller than the proposal assumes.  
*Source: Stage 9.*

**8. NG-CDF beneficiary lists cannot become a campaign list.**  
ODPC's 2025 public-sector guidance bars reusing public-programme personal data for political mobilisation without explicit consent [S57, T1]. Project records remain usable as proof points. Consented opt-in is the only lawful route, which makes list building an objective rather than an assumption.  
*Source: Constraint.*

**9. Water is the strongest evidenced argument available.**  
Kitui has the lowest share of any county in Kenya with at least basic drinking-water service, at 21% [S41, T1], and the longest water trekking distance among semi-arid counties at 7.2 km in February 2026 [S43, T1]. Both are Tier 1, current and county-wide — a rare combination in this evidence base.  
*Source: Stage 10.*

**10. The site's prose now contradicts its own data blocks.**  
Several sections still state 13.6% internet use and an 86.4% offline majority, and size the channel mix against them, while the mounted data blocks show 26.2%. The fix is not a find-and-replace: 86.4% is the rhetorical spine of Section 3.6 and the justification for the 82/18 split, so the rate cannot be updated without revisiting the argument it supports.  
*Source: Stage 9.*


## Closed since the first audit

Four findings from earlier runs of this pipeline are no longer open. Three were fixed on the site; one was my own error.

| Finding | How it closed |
|---|---|
| The party name was wrong on the site | Corrected to Wiper Patriotic Front throughout |
| Politrack was missing from the site | Added alongside Mizani, on a separate series |
| The 2026 register was unverified | Confirmed against the IEBC annex: 605,703, Tier 1 |
| The two 2026 register figures 'did not reconcile' | WITHDRAWN — my error. They measure different windows and were never meant to sum. See Stage 1. |


## What the models do and do not say

- **Scenario model, not a forecast.** Stage 3 draws turnout and support from placeholder ranges. It shows what the ward arithmetic yields under stated assumptions.
- **No win probability is produced anywhere.** That needs rival vote ranges, which have not been supplied. Governor races are won by plurality, so there is no threshold to clear — 198,004 is a benchmark.
- **The ward priority index has one of six features.** It currently reproduces the register ranking, which is faithful but not useful. Five features are dropped and named; nothing is imputed.
- **Stage 9's figures are modelled, not measured** — published rates times ward registers, with the rate and its year printed beside every number.


## Every assumption

31 entries in `config/assumptions.yaml` are marked PLACEHOLDER — nobody has confirmed them. Each carries a rationale in the file.

| Assumption | Value | Why it is a placeholder |
|---|---|---|
| compliance.send_window_draft | 08:00-18:00 | A 2020 draft revision proposed this window. [VERIFY] whether it is in force. |
| index_weights.connectivity | 0.1 | Channel-mix proxy, not persuasion weight — it says how to reach a ward, not how much the ward matters. Requires ward-level coverage data. [DATA NEEDED |
| index_weights.drought_exposure | 0.1 | Issue-salience proxy. NDMA publishes at county level only in the pack; sub-county detail is [DATA NEEDED]. A county-wide constant has zero variance ac |
| index_weights.party_strength_2022 | 0.1 | Requires 2022 Forms 37A/37B by ward. [DATA NEEDED] (pack gap 7). |
| index_weights.recognition_gap | 0.25 | Highest weight after voter weight, because the campaign's own diagnosis is that his deficit is a recognition problem. Requires the baseline survey. [D |
| index_weights.registered_voters | 0.3 | Raw electoral weight. The only feature with complete T1 data today. |
| index_weights.registration_growth | 0.15 | Requires the 2026 register by ward. [DATA NEEDED] — currently dropped. |
| labelling.low_confidence_threshold | 0.7 | Labels below this confidence are flagged for human review. |
| measurement.baseline_rates | [0.02, 0.05, 0.1] | Illustrative baseline response rates for the two-proportion MDE grid. No campaign has run yet, so there is no measured baseline. Replaced by the Week  |
| measurement.holdout_share | 0.15 | Share of wards held out as untreated controls, stratified by constituency. 15% of 40 is 6 wards. Large enough to read an effect, small enough to cost  |
| measurement.list_sizes | [1000, 5000, 10000, 25000, 50000, 100000] | Illustrative SMS list sizes spanning ward-level to countywide sends. |
| nomination.method_is_opinion_poll | True | The County Diary, May 2026. T3, not confirmed by the party. The entire nomination strategy rests on this. If WPF runs a delegate primary instead, Stag |
| nomination.poll_samples_proportional_to_register | True | UNCONFIRMED. The brief instructs this assumption for the leverage model. WPF has not published the sample frame, and the pack lists the nomination-pol |
| reach.ward_uniformity | True | The model applies county rates uniformly across all 40 wards, because no ward-level connectivity data exists ([DATA NEEDED], pack gap 20). This is kno |
| register.by_ward_2026 | None | [DATA NEEDED] The 2026 register by ward. The ECVR drive was ward-based, so growth is uneven and cannot be distributed pro rata without inventing data. |
| register.y2026_uniform_scale_factor | 1.1369 | 605,703 / 532,758 = 1.1369. Used ONLY to project the 2022 ward register onto the 2026 county total so the simulation can report against both register  |
| rivals.model_rivals | False | No rival vote ranges have been supplied. While this is false, Stage 3 reports benchmark comparisons and explicitly states it is NOT a win probability. |
| sensitivity.dirichlet_concentration | 10.0 | Concentration for the Dirichlet draw around the stated weights. 10.0 gives meaningful spread without producing degenerate weight vectors. Lower = more |
| sensitivity.unstable_rank_range | 8 | A ward whose rank spans more than 8 places across the 1,000 draws is flagged unstable. 8 is one fifth of 40 wards — a judgement line, stated so it can |
| support.competitive_ward_high | 0.6 | Upper bound for the competitive scenario: the share the 2022 winner actually achieved. Using the observed winning share as the ceiling keeps the scena |
| support.competitive_ward_low | 0.4 | Lower bound for the competitive general-election scenario, as a share of ballots cast in the ward. Anchored on 2022: Malombe took roughly 60% of the v |
| support.home_advantage_multiplier | 1.35 | Multiplier on the drawn share in his home constituency's five wards. He has been its MP since 2013 [S18]. No measured home-ward support figure exists  |
| support.mulu_ward_high | 0.32 | Upper bound. See mulu_ward_low. |
| support.mulu_ward_low | 0.18 | Lower bound of Mulu's per-ward vote share draw. Anchored on his published countywide nomination-poll range (20.2%–26.2%, three polls, Mar–Aug 2026) an |
| support.mwingi_narrative_multiplier | 1.0 | Set to 1.00 deliberately, i.e. no effect. The "Kavaa Makali" narrative is reported to be gaining traction in Mwingi [S30], but that is a single T3 out |
| support.ward_dispersion | 0.05 | Plus or minus 5 percentage points of ward-level variation around the countywide support drawn for each draw. Same reasoning as turnout.ward_dispersion |
| turnout.distribution | uniform | Uniform, not normal. With no ward-level turnout data there is no basis for claiming a central tendency, and a uniform draw does not pretend to one. |
| turnout.ward_dispersion | 0.06 | Plus or minus 6 percentage points of ward-level variation around the county turnout drawn for each scenario. Turnout is drawn once per draw for the wh |
| turnout.ward_high | 0.72 | Upper bound of the per-ward turnout draw. See ward_low. |
| turnout.ward_low | 0.55 | Lower bound of the per-ward turnout draw. The site's §3.4.1 asserts a ~62% county average; the pack supplies no turnout figure at all and no ward-leve |


## Every data gap

| Missing | What it unlocks | Stages blocked |
|---|---|---|
| IEBC ECVR county/ward annex | Settles the 605,703 conflict; unlocks registration growth | Stages 1, 3, 4 |
| Mizani sample sizes and method | Makes the June-to-August comparison testable | Stage 2 |
| 2022 Forms 37A/37B by ward | Ward-level party strength and turnout | Stages 3, 4 |
| Baseline survey (ward aggregates) | Recognition gap and the whole credibility axis | Stages 4, 10 |
| posts.csv | The entire Existing Presence Audit | Stage 6 |
| comments.csv | Themes, sentiment and behavioural salience | Stage 7 |
| competitors.csv | Any rival benchmark at all | Stage 8 |
| KNBS Housing Survey 2023/24, Kitui ICT row | Replaces seven-year-old reach rates | Stage 9 |
| Ward boundary file | All maps | Stage 5 |
| Ward-level 2G/3G/4G coverage | Connectivity feature and real ward reach variation | Stages 4, 9 |
| Kikamba radio audience by sub-county | Converts the offline segment into a radio audience | Stage 9 |
| WPF nomination-poll terms | The premise the whole nomination strategy rests on | Stage 3 |
| Rival vote ranges | Required before any win probability | Stage 3 |
| A Kikamba-speaking reviewer | Staffing, not data — blocks Kikamba sentiment coding | Stage 7 |


## Audit findings still open

3 high-severity findings from Stage 1. Full list in `data/processed/audit_findings.csv`.
