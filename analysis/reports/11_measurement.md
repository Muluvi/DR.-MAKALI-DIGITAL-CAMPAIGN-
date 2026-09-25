# Stage 11 — Measurement design

What the Direct phase can actually detect, and how it will be measured.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-25*

![Minimum detectable effect by list size](../outputs/charts/11_mde.svg)

*Minimum detectable effect by list size*


## Power: what each list size can detect

Two-proportion tests at alpha 0.05 and 80% power, split into equal arms. The baseline rates are placeholders until the Week 1 audit measures a real one — the shape of the curve is the point, not the exact numbers.

| List size | Per arm | Baseline rate | MDE (pp) | MDE (relative) |
|---|---|---|---|---|
| 1,000 | 500 | 2% | 3.3 | 166% |
| 5,000 | 2,500 | 2% | 1.3 | 63% |
| 10,000 | 5,000 | 2% | 0.9 | 43% |
| 25,000 | 12,500 | 2% | 0.5 | 26% |
| 50,000 | 25,000 | 2% | 0.4 | 18% |
| 100,000 | 50,000 | 2% | 0.3 | 13% |
| 1,000 | 500 | 5% | 4.6 | 92% |
| 5,000 | 2,500 | 5% | 1.9 | 37% |
| 10,000 | 5,000 | 5% | 1.3 | 26% |
| 25,000 | 12,500 | 5% | 0.8 | 16% |
| 50,000 | 25,000 | 5% | 0.6 | 11% |
| 100,000 | 50,000 | 5% | 0.4 | 8% |
| 1,000 | 500 | 10% | 6.0 | 59% |
| 5,000 | 2,500 | 10% | 2.5 | 25% |
| 10,000 | 5,000 | 10% | 1.7 | 17% |
| 25,000 | 12,500 | 10% | 1.1 | 11% |
| 50,000 | 25,000 | 10% | 0.8 | 8% |
| 100,000 | 50,000 | 10% | 0.5 | 5% |

- **Small lists cannot detect small lifts.** At a 5% baseline, a 1,000-person list detects only a 4.6-point difference — a near-doubling of response. Anything subtler is invisible.
- **Test big, or do not test.** Meaningful A/B testing of message variants needs lists in the tens of thousands. Below that, run the better-judged message rather than pretending to measure.
- **Every test is constrained by the 48-hour lodging rule** [S53]. Both arms must be lodged in advance, so no test can be adapted mid-flight.


## Holdout assignment

8 of 40 wards assigned to holdout, stratified by constituency, seed 20270809. Stratifying is not optional here: an unstratified draw could put every holdout in Mwingi and confound the campaign effect with region.

| constituency | holdout | treatment |
|---|---|---|
| Kitui Central | 1 | 4 |
| Kitui East | 1 | 5 |
| Kitui Rural | 1 | 3 |
| Kitui South | 1 | 5 |
| Kitui West | 1 | 3 |
| Mwingi Central | 1 | 5 |
| Mwingi North | 1 | 4 |
| Mwingi West | 1 | 3 |

**The assignment itself is confidential** and is written to `data/processed/holdout_assignment.csv`, which git ignores. It is excluded from the site export by `site_export.never_publish`. If the field team or a rival learns which wards are controls, the experiment is dead — holdout wards must be left genuinely untreated, which only works if nobody is tempted to treat them.

Holding out 8 wards costs roughly 98,804 voters of campaign contact. That is the price of knowing whether any of it worked.


## Interrupted time series

`outputs/its_template.py` holds a segmented regression on weekly engagement. Three coefficients, three questions: the pre-launch trend, the immediate level shift at launch, and the change in slope afterwards. A campaign that produces a step but no slope change bought a spike, not momentum.

The template refuses to run on fewer than eight pre-launch weeks. Below that the slope terms are not identified, and the model would still print a confident-looking table. **Baseline collection must therefore start now**, not at launch: with a decision window in late 2026, the pre-period is already short.


## KPI definitions

| KPI | Formula | Source | Frequency | Owner |
|---|---|---|---|---|
| Consented contacts | count of opt-in records with timestamped consent | SMS platform | weekly | Firefly data lead |
| SMS delivery rate | delivered / sent | aggregator receipts | per send | Firefly ops |
| USSD completion rate | sessions reaching the final screen / sessions started | USSD platform | weekly | Firefly ops |
| Engagement rate | (reactions + comments + shares) / followers, per post | platform analytics | weekly | Campaign social team |
| Share of voice | mentions of Mulu / mentions of all four candidates | manual monitoring | weekly | Firefly analyst |
| Net sentiment | (positive − negative) / total coded comments | Stage 7 coding | fortnightly | Firefly analyst |
| Cost per consented contact | channel spend / net new consented contacts | finance + SMS platform | monthly | Campaign finance |
| Holdout gap | treatment ward metric − holdout ward metric | this stage's assignment | monthly | Firefly analyst |

Every KPI above is computable from a named source. One depends on an input that does not yet exist: net sentiment needs Stage 7's coded comments. None needs a survey: Firefly works from existing records and its own analysis only.


## Data gaps

- **[DATA NEEDED]** A measured baseline response rate, which replaces the illustrative rates in the power grid. This comes from the Week 1 audit.
- **[DATA NEEDED]** Consented list size by ward, without which the power grid cannot be tied to real arms.
- **[DATA NEEDED]** At least eight weeks of pre-launch weekly engagement, for the interrupted time series.
- **[DATA NEEDED]** Confirmation of whether the 8am–6pm sending window from the 2020 draft revision is in force [S55] — it constrains test scheduling.
