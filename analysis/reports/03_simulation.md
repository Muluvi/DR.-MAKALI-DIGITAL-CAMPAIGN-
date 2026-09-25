# Stage 3 — Scenario simulation

What the ward arithmetic yields under stated assumptions, against two published benchmarks.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-25*

> **Scenario model, not a forecast.**

Nothing in this report predicts an outcome. Every input is an official record or a placeholder from `config/assumptions.yaml`, and the model is a way of asking which assumptions matter.


## General-election paths

![Distribution of Mulu's total votes under the competitive scenario](../outputs/charts/03_vote_distribution.svg)

*Distribution of Mulu's total votes under the competitive scenario*

**There is no 50% threshold.** Kenyan governor races are won by the most votes. The two reference lines are the 2022 winning tally (198,004) and 37.2% of the register — the share that tally represented. Exceeding either is not winning, and the percentages below are **not win probabilities**.

**A true win probability needs rival vote ranges.** None have been supplied, so `rivals.model_rivals` is false and no rival is modelled. Set it true in `assumptions.yaml` with per-rival ranges and this section changes to a contested model. Until then, these are benchmark comparisons only.

| Register | Scenario | Median | 90% interval | Above 198,004 | Above 37.2% of register |
|---|---|---|---|---|---|
| Reported July 2026 (605,703, T3, verify) — current | Competitive general election | 200,158 | 158,083 – 250,790 | 53.0% | 21.2% |
| IEBC 2022 (532,758) — for comparison | Competitive general election | 176,056 | 139,048 – 220,591 | 21.3% | 21.2% |


### What this says

- **Under a competitive scenario the benchmark is reachable but not comfortable.** Median 200,158, with 53.0% of draws above 198,004. The competitive range is anchored on the 2022 winner's own ~60% of ballots cast.
- **The register grew, so the bar rose.** On the July 2026 register of 605,703, as reported (Tier 3, verify), the 37.2% benchmark is about 225,317 votes, against the 198,004 the proposal measures against. The same performance now clears a higher bar.
- **Which benchmark you choose changes the answer more than the model does.** The simulated total clears the 2022 tally in 53% of draws, but clears 37.2% of today's register in only 21%. Same model, same draws; a 32-point swing from the choice of yardstick alone. Measuring a 2027 campaign against a 2022 tally on a register 13.7% larger flatters it.


## What matters most

![Sensitivity of the median county total to each parameter](../outputs/charts/03_tornado.svg)

*Sensitivity of the median county total to each parameter*

| Parameter | At low end | At high end | Status | Midpoint | Swing |
|---|---|---|---|---|---|
| Mulu's ward support (40%–60%) | 142,225 | 213,358 | PLACEHOLDER | 177,796 | 71,133 |
| Ward turnout (55%–72%) | 154,001 | 201,580 | PLACEHOLDER | 177,796 | 47,579 |
| Home advantage (1.00–1.35×) | 169,149 | 177,796 | PLACEHOLDER | 177,796 | 8,647 |

**Mulu's ward support (40%–60%)** moves the median most, by 71,133 votes; **Home advantage (1.00–1.35×)** moves it least, by 8,647. That ordering is the useful output: it says which placeholder most needs an official record behind it.


### Wards that carry the total

| Ward | Mean votes | SD | Share of county total |
|---|---|---|---|
| Township | 9,494 | 1,517 | 4.7% |
| Kyangwithya West | 7,741 | 1,231 | 3.8% |
| Kyangwithya East | 7,495 | 1,197 | 3.7% |
| Mulango | 7,358 | 1,173 | 3.6% |
| Kyuso | 7,168 | 1,144 | 3.6% |
| Kwavonza/Yatta | 6,494 | 1,033 | 3.2% |
| Mutonguni | 6,467 | 1,028 | 3.2% |
| Tseikuru | 5,926 | 952 | 2.9% |
| Mumoni | 5,719 | 910 | 2.8% |
| Miambani | 5,716 | 911 | 2.8% |
| Athi | 5,709 | 899 | 2.8% |
| Kauwi | 5,683 | 906 | 2.8% |


## Method and limits

- 10,000 draws, seed 20270809, fully reproducible.
- Turnout and support are drawn once per draw at county level, then varied by ward. Independent per-ward draws would average out across 40 wards and collapse the county distribution to false precision.
- Ward shares are capped at 1.0. The cap binds only in the home wards at the top of the competitive range.
- The county register of 605,703 is Tier 3 (verify), and reported at county level only. Ward figures scale every 2022 ward by the same factor, which is known to be wrong in detail because the drive was ward-based and growth was uneven. County totals are not affected; ward totals are indicative.
- No rival is modelled, so nothing here is a win probability.
- Every parameter is a PLACEHOLDER. The tornado chart ranks the assumptions, not the world.


## Data gaps

- **[DATA NEEDED]** Ward-level 2022 results (Forms 37A/37B) — would replace the placeholder support range with measured party strength per ward.
- **[DATA NEEDED]** Ward-level turnout — would replace the placeholder turnout range.
- **[DATA NEEDED]** The IEBC 2026 ward annex — would remove the uniform scaling assumption entirely.
- **[DATA NEEDED]** Rival vote ranges — required before any win probability can be produced.
