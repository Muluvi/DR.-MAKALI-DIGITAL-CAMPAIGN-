# Stage 3 — Scenario simulation

Two models: where a nomination-poll gain is worth most, and what the ward arithmetic yields under stated assumptions.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-16*

> **Scenario model, not a forecast.**

Nothing in this report predicts an outcome. Every input is a placeholder from `config/assumptions.yaml`, and the models are a way of asking which assumptions matter.


## A. Nomination-poll leverage

![Countywide share gained per 10-point gain, by ward](../outputs/charts/03_nomination_leverage.svg)

*Countywide share gained per 10-point gain, by ward*

If the party's poll samples in proportion to registered voters, a ward's leverage is exactly its share of the register. Ten points gained among Kyuso's voters moves Mulu's countywide share by 0.37 points; ten points in Tharaka moves it by 0.14.

**The proportional-sampling assumption is unconfirmed.** WPF has published no sample frame, and the pack lists the nomination-poll terms as [DATA NEEDED]. If the real instrument over-samples urban wards — the failure mode the proposal's own §3.1.3 warns about — this ranking changes. The ranking is only as good as that assumption.

| Rank | Ward | Constituency | Voters | Share of register | Pts per 10-pt gain | Cumulative share |
|---|---|---|---|---|---|---|
| 1 | Kyuso | Mwingi North | 19,921 | 3.74% | 0.37 | 3.7% |
| 2 | Township | Kitui Central | 19,538 | 3.67% | 0.37 | 7.4% |
| 3 | Kwavonza/Yatta | Kitui Rural | 18,020 | 3.38% | 0.34 | 10.8% |
| 4 | Mutonguni | Kitui West | 17,979 | 3.37% | 0.34 | 14.2% |
| 5 | Tseikuru | Mwingi North | 16,471 | 3.09% | 0.31 | 17.3% |
| 6 | Kyangwithya West | Kitui Central | 15,931 | 2.99% | 0.30 | 20.2% |
| 7 | Mumoni | Mwingi North | 15,877 | 2.98% | 0.30 | 23.2% |
| 8 | Athi | Kitui South | 15,843 | 2.97% | 0.30 | 26.2% |
| 9 | Kauwi | Kitui West | 15,767 | 2.96% | 0.30 | 29.2% |
| 10 | Kyangwithya East | Kitui Central | 15,401 | 2.89% | 0.29 | 32.0% |
| 11 | Ikanga/Kyatune | Kitui South | 15,384 | 2.89% | 0.29 | 34.9% |
| 12 | Mulango | Kitui Central | 15,135 | 2.84% | 0.28 | 37.8% |

The top 12 wards hold 37.8% of the register. Concentration is the practical argument for a ward-ranked plan: the same effort is worth 2.7× more in the largest ward than the smallest.


### By constituency

| Constituency | Voters | Share of register | Pts per 10-pt gain |
|---|---|---|---|
| Kitui Central | 77,764 | 14.6% | 1.46 |
| Kitui South | 75,372 | 14.1% | 1.41 |
| Mwingi Central | 74,231 | 13.9% | 1.39 |
| Mwingi North | 68,829 | 12.9% | 1.29 |
| Kitui East | 65,377 | 12.3% | 1.23 |
| Kitui West | 59,047 | 11.1% | 1.11 |
| Mwingi West | 57,138 | 10.7% | 1.07 |
| Kitui Rural | 55,000 | 10.3% | 1.03 |


## B. General-election paths

![Distribution of Mulu's total votes under two support scenarios](../outputs/charts/03_vote_distribution.svg)

*Distribution of Mulu's total votes under two support scenarios*

**There is no 50% threshold.** Kenyan governor races are won by the most votes. The two reference lines are the 2022 winning tally (198,004) and 37.2% of the register — the share that tally represented. Exceeding either is not winning, and the percentages below are **not win probabilities**.

**A true win probability needs rival vote ranges.** None have been supplied, so `rivals.model_rivals` is false and no rival is modelled. Set it true in `assumptions.yaml` with per-rival ranges and this section changes to a contested model. Until then, these are benchmark comparisons only.

| Register | Scenario | Median | 90% interval | Above 198,004 | Above 37.2% of register |
|---|---|---|---|---|---|
| IEBC 2022 (532,758) | Current measured preference | 88,154 | 64,152 – 116,047 | 0.0% | 0.0% |
| IEBC 2022 (532,758) | Competitive general election | 176,056 | 139,048 – 220,591 | 21.3% | 21.2% |
| T3 July 2026 (605,703) [VERIFY] | Current measured preference | 100,222 | 72,935 – 131,934 | 0.0% | 0.0% |
| T3 July 2026 (605,703) [VERIFY] | Competitive general election | 200,158 | 158,083 – 250,790 | 53.0% | 21.2% |


### What this says

- **Under his current measured preference, the arithmetic does not reach the benchmark.** Median 88,154 votes, and no draw in 10,000 reaches 198,004. That is not a prediction of defeat. It is the gap between a 20–26% nomination-poll share and what winning a general election in this county took in 2022.
- **Under a competitive scenario the benchmark is reachable but not comfortable.** Median 176,056, with 21.3% of draws above 198,004. The competitive range is anchored on the 2022 winner's own ~60% of ballots cast.
- **The register choice moves the target, not the result.** On the T3 2026 register the 37.2% benchmark rises to about 225,000, so the same performance clears a higher bar. The 605,703 figure is unverified and every figure derived from it carries 'verify'.
- **The two scenarios answer different questions.** The first asks what today's measured standing is worth. The second asks what winning looks like. The distance between them is the campaign's actual task.


## What matters most

![Sensitivity of the median county total to each parameter](../outputs/charts/03_tornado.svg)

*Sensitivity of the median county total to each parameter*

| Parameter | At low end | At high end | Status | Midpoint | Swing |
|---|---|---|---|---|---|
| Mulu's ward support (18%–32%) | 63,999 | 113,783 | PLACEHOLDER | 88,889 | 49,785 |
| Ward turnout (55%–72%) | 76,993 | 100,792 | PLACEHOLDER | 88,889 | 23,799 |
| Home advantage (1.00–1.35×) | 84,571 | 88,889 | PLACEHOLDER | 88,889 | 4,319 |

Support dominates turnout, and both dominate the home-advantage multiplier. That ordering is the useful output: it says the campaign's measurable objective is share, not mobilisation alone, and that the home-base assumption — the softest number in the file — changes the total least.


### Wards that carry the total

| Ward | Mean votes | SD | Share of county total |
|---|---|---|---|
| Township | 8,350 | 1,334 | 4.7% |
| Kyangwithya West | 6,809 | 1,083 | 3.8% |
| Kyangwithya East | 6,592 | 1,053 | 3.7% |
| Mulango | 6,472 | 1,032 | 3.6% |
| Kyuso | 6,305 | 1,007 | 3.6% |
| Kwavonza/Yatta | 5,712 | 909 | 3.2% |
| Mutonguni | 5,689 | 904 | 3.2% |
| Tseikuru | 5,212 | 838 | 2.9% |
| Mumoni | 5,030 | 800 | 2.8% |
| Miambani | 5,027 | 801 | 2.8% |
| Athi | 5,022 | 791 | 2.8% |
| Kauwi | 4,999 | 797 | 2.8% |


## Method and limits

- 10,000 draws per scenario, seed 20270809, fully reproducible.
- Turnout and support are drawn once per draw at county level, then varied by ward. Independent per-ward draws would average out across 40 wards and collapse the county distribution to false precision.
- Ward shares are capped at 1.0. The cap binds only in the home wards at the top of the competitive range.
- The 2026 register run scales every ward by the same factor. The registration drive was ward-based and growth was uneven, so this is known to be wrong in detail. It is used because inventing a per-ward growth pattern would be worse.
- No rival is modelled, so nothing here is a win probability.
- Every parameter is a PLACEHOLDER. The tornado chart ranks the assumptions, not the world.


## Data gaps

- **[DATA NEEDED]** Ward-level 2022 results (Forms 37A/37B) — would replace the placeholder support range with measured party strength per ward.
- **[DATA NEEDED]** Ward-level turnout — would replace the placeholder turnout range.
- **[DATA NEEDED]** The IEBC 2026 ward annex — would remove the uniform scaling assumption entirely.
- **[DATA NEEDED]** Rival vote ranges — required before any win probability can be produced.
- **[DATA NEEDED]** WPF's nomination-poll sample frame — the whole of Model A rests on it.
