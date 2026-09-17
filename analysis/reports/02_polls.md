# Stage 2 — Poll uncertainty

Three polls, two pollsters, one published sample size.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-17*

![Published shares with 95% margins of error, by poll](../outputs/charts/02_poll_shares.svg)

*Published shares with 95% margins of error, by poll*

![Gap to the leader, with 95% margins](../outputs/charts/02_gap_to_leader.svg)

*Gap to the leader, with 95% margins*

![Margin of error against sample size, Mizani August round](../outputs/charts/02_moe_sensitivity.svg)

*Margin of error against sample size, Mizani August round*


## The finding

- **Mulu trails in all three polls, and in Politrack the gap is real.** At n = 2,927 the 9.0-point March gap carries a margin of ±2.82 points, so it clears zero comfortably.
- **The Mizani movement cannot be tested.** Neither Mizani round published a sample size, so the June-to-August change in Mulu's share and in the gap both return **cannot determine**.
- **The two Mizani rounds are not like-for-like.** June excluded Ngilu; August included her at 17.0%. A candidate entering the field redistributes everyone's share, so part of any apparent movement is the changed field, not changed opinion.
- **The two pollsters measure differently.** Politrack reports 0.6% undecided, Mizani 6.0%. A tenfold difference in undecideds points to different question wording, prompting or filtering. Their levels are not comparable.


## Can the June-to-August change be called significant?

No. Both tests return **cannot determine**, for the same reason: no published n.

| Test | Change | Verdict | Would need |
|---|---|---|---|
| Mulu's share, Jun → Aug | 20.2 → 22.1 (+1.9 pts) | cannot determine | n ≥ 3,550 per round |
| Gap to leader, Jun → Aug | 11.1 → 15.3 (+4.2 pts) | cannot determine | n ≥ 2,340 per round |

The 'would need' column is the equal per-round sample at which a change of that size would reach 95% significance. Both exceed any sample Mizani is likely to have run in a single county, and the larger one, 3,550, is above Politrack's county-wide 2,927. This is context, not a result: the honest answer remains that without n, nothing can be concluded.

**This matters for the proposal.** The site describes a 'widening' deficit and treats 11.1 → 15.3 points as a trend. On the published evidence that reading is not supported: two points from one pollster, with no sample sizes and a changed candidate field between them, cannot establish a direction. The deficit is real in each round. Its movement is not measurable.


## Margins on each share

Where n is published the margin is a fact. Where it is not, three illustrative panels show what the margin would be at n = 500, 1,000 and 2,000. These are not estimates of Mizani's precision — they are the range within which it is unknown.

| Poll | Candidate | Share % | n | 95% MoE | Basis |
|---|---|---|---|---|---|
| Politrack Africa 12 Mar 2026 | Mulu | 26.2 | 2,927 | ±1.59 | published n |
| Politrack Africa 12 Mar 2026 | Kasalu | 35.2 | 2,927 | ±1.73 | published n |
| Politrack Africa 12 Mar 2026 | Wambua | 18.8 | 2,927 | ±1.42 | published n |
| Politrack Africa 12 Mar 2026 | Ngilu | 18.6 | 2,927 | ±1.41 | published n |
| Mizani Africa 23 Jun 2026 | Mulu | 20.2 | 500 (illustrative) | ±3.52 | n NOT published |
| Mizani Africa 23 Jun 2026 | Mulu | 20.2 | 1,000 (illustrative) | ±2.49 | n NOT published |
| Mizani Africa 23 Jun 2026 | Mulu | 20.2 | 2,000 (illustrative) | ±1.76 | n NOT published |
| Mizani Africa 23 Jun 2026 | Kasalu | 31.3 | 500 (illustrative) | ±4.06 | n NOT published |
| Mizani Africa 23 Jun 2026 | Kasalu | 31.3 | 1,000 (illustrative) | ±2.87 | n NOT published |
| Mizani Africa 23 Jun 2026 | Kasalu | 31.3 | 2,000 (illustrative) | ±2.03 | n NOT published |
| Mizani Africa 23 Jun 2026 | Wambua | 16.3 | 500 (illustrative) | ±3.24 | n NOT published |
| Mizani Africa 23 Jun 2026 | Wambua | 16.3 | 1,000 (illustrative) | ±2.29 | n NOT published |
| Mizani Africa 23 Jun 2026 | Wambua | 16.3 | 2,000 (illustrative) | ±1.62 | n NOT published |
| Mizani Africa 7 Aug 2026 | Mulu | 22.1 | 500 (illustrative) | ±3.64 | n NOT published |
| Mizani Africa 7 Aug 2026 | Mulu | 22.1 | 1,000 (illustrative) | ±2.57 | n NOT published |
| Mizani Africa 7 Aug 2026 | Mulu | 22.1 | 2,000 (illustrative) | ±1.82 | n NOT published |
| Mizani Africa 7 Aug 2026 | Kasalu | 37.4 | 500 (illustrative) | ±4.24 | n NOT published |
| Mizani Africa 7 Aug 2026 | Kasalu | 37.4 | 1,000 (illustrative) | ±3.00 | n NOT published |
| Mizani Africa 7 Aug 2026 | Kasalu | 37.4 | 2,000 (illustrative) | ±2.12 | n NOT published |
| Mizani Africa 7 Aug 2026 | Wambua | 14.3 | 500 (illustrative) | ±3.07 | n NOT published |
| Mizani Africa 7 Aug 2026 | Wambua | 14.3 | 1,000 (illustrative) | ±2.17 | n NOT published |
| Mizani Africa 7 Aug 2026 | Wambua | 14.3 | 2,000 (illustrative) | ±1.53 | n NOT published |
| Mizani Africa 7 Aug 2026 | Ngilu | 17.0 | 500 (illustrative) | ±3.29 | n NOT published |
| Mizani Africa 7 Aug 2026 | Ngilu | 17.0 | 1,000 (illustrative) | ±2.33 | n NOT published |
| Mizani Africa 7 Aug 2026 | Ngilu | 17.0 | 2,000 (illustrative) | ±1.65 | n NOT published |


## Margins on the gap

The gap uses the multinomial variance of a difference within one poll: Var(p₁ − p₂) = [p₁ + p₂ − (p₁ − p₂)²] / n. Two candidates' shares are negatively correlated, because a respondent choosing one cannot also choose the other. That widens the gap's margin rather than narrowing it: subtracting a negative covariance adds to the variance. For Kasalu against Mulu at n = 1,000 the gap margin is ±4.69 points, against ±3.95 if the two shares were wrongly treated as independent. Independence is the optimistic assumption here, not the cautious one.

| Poll | Leader | Gap (pts) | n | 95% MoE on gap | Gap clears zero? |
|---|---|---|---|---|---|
| Politrack Africa 12 Mar 2026 | Kasalu | 9.0 | 2,927 | ±2.82 | yes |
| Mizani Africa 23 Jun 2026 | Kasalu | 11.1 | 500 (illustrative) | ±6.21 | yes |
| Mizani Africa 23 Jun 2026 | Kasalu | 11.1 | 1,000 (illustrative) | ±4.39 | yes |
| Mizani Africa 23 Jun 2026 | Kasalu | 11.1 | 2,000 (illustrative) | ±3.11 | yes |
| Mizani Africa 7 Aug 2026 | Kasalu | 15.3 | 500 (illustrative) | ±6.63 | yes |
| Mizani Africa 7 Aug 2026 | Kasalu | 15.3 | 1,000 (illustrative) | ±4.69 | yes |
| Mizani Africa 7 Aug 2026 | Kasalu | 15.3 | 2,000 (illustrative) | ±3.31 | yes |


## Bayesian poll average

**Skipped.** There are 3 published polls and the threshold is 5. With three rounds from two pollsters, two of them missing sample sizes and one covering a different candidate field, a pooled average would produce a confident-looking single line out of material that cannot support one. PyMC is deliberately not installed. Revisit at five or more polls.


## Data quality notes

| Poll | Named shares sum | Undecided | Unaccounted | Tier |
|---|---|---|---|---|
| Politrack Africa 12 Mar 2026 | 98.8 | 0.6 | 0.6 | T3 |
| Mizani Africa 23 Jun 2026 | 67.8 | — | 32.2 | T2 |
| Mizani Africa 7 Aug 2026 | 90.8 | 6.0 | 3.2 | T3 |

- June's 32.2-point unaccounted residual is mostly Ngilu's absent share plus an unpublished undecided figure. It is not a measurement of anything.
- All three polls reach this pipeline through T3 outlets [S7, S9] or a T2 social post [S8], not from the pollsters' own releases. Every poll figure carries status 'verify'.
- No pollster publishes a design effect, so every margin here is a floor on the true uncertainty, not the whole of it.


## Data gaps

- **[DATA NEEDED]** Mizani's sample sizes, method, fieldwork dates and sub-county splits (pack gap 8). This single item would make the June-to-August comparison testable.
- **[DATA NEEDED]** The original Politrack release, to confirm the figures and Ngilu's party label, which the write-up gives as NARC-Kenya against NARC elsewhere.
- **[DATA NEEDED]** Any poll of the WPF nomination electorate specifically. All three polls measure county-wide preference, which is not the same population as the nomination poll.
