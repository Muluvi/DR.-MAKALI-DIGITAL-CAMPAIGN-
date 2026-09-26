# Stage 4 — Ward priority index and segments

One of five features has data. This is the honest state of the index.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-26*

![Ward priority index, top 20](../outputs/charts/04_ward_priority.svg)

*Ward priority index, top 20*

![Ward segments](../outputs/charts/04_ward_segments.svg)

*Ward segments*


## The headline

**1 of 5 features have data.** With only registered voters available, the priority index reproduces the register ranking exactly. That is a faithful result, not a useful one: an index of one variable is that variable. The machinery below is built and tested so it produces a real index the day the missing inputs arrive, and the report is explicit about what is currently missing rather than presenting a register sort as a strategic ranking.


## Features used and dropped

| Feature | Status | Weight (stated) | Weight (applied) | Why |
|---|---|---|---|---|
| Registered voters | used | 0.30 | 1.00 | IEBC 2022 [S1] |
| Registration growth since 2022 | DROPPED | 0.15 | — | The 2026 register by ward is not published. The drive was ward-based, so growth is uneven and cannot be distributed pro rata without inventing it. Pack gap 6. |
| Connectivity proxy | DROPPED | 0.10 | — | No ward-level connectivity data exists. The pack records USO coverage gains in several Mwingi North wards [S35] but says nothing about the other 37, and inferring that the rest are worse would be inventing data. Pack gap 20. |
| Drought exposure | DROPPED | 0.10 | — | NDMA publishes Kitui at county level in this pack. A county-wide constant has no variance across wards and cannot rank them. Sub-county bulletins are [DATA NEEDED]. |
| 2022 party strength | DROPPED | 0.35 | — | Ward-level 2022 results are not published in the pack. Pack gap 7. |

**Nothing was imputed.** The four dropped features carry 70% of the stated weight between them. That weight was not redistributed by judgement — the surviving weights were renormalised arithmetically, which with one feature means it takes the whole 1.0.


## Weight sensitivity

1,000 Dirichlet-perturbed weight sets (concentration 10.0), re-ranking the wards each time.

**The test cannot run meaningfully and must not be reported as a pass.** With one feature, every weight vector is [1.0], so every draw produces an identical ranking and every ward's rank range is zero. That is degeneracy, not stability. A reader shown 'all 40 wards stable under 1,000 perturbations' would draw exactly the wrong conclusion. The test becomes informative at two or more features.


## Segments

| k | Silhouette | Segment sizes |
|---|---|---|
| 3 | 0.592 | [22, 4, 14] |
| 4 | 0.613 | [4, 18, 4, 14] |
| 5 | 0.625 | [4, 7, 11, 4, 14] |

Ward linkage on standardised features. k = 5 scores highest at 0.625.

- **Segment 1** — Low registered voters (n=4)
- **Segment 2** — Low registered voters (n=7)
- **Segment 3** — Low registered voters (n=11)
- **Segment 4** — High registered voters (n=4)
- **Segment 5** — High registered voters (n=14)

**n = 40 limits confidence in any of this.** Forty objects is a small sample for clustering: silhouette scores are unstable at this size, boundary wards move between segments under small changes, and no segmentation here should be treated as a settled structure.

**More specifically, these are size bands.** Clustering one standardised variable cuts it into contiguous ranges, so the high silhouette reflects that a single variable separates cleanly, not that the wards fall into strategic types. Segment names describe the only feature present. Real segmentation needs the 2022 ward results and ward-level coverage data.


## Output

`ward_priority.csv` — all 40 wards with score, rank, rank range, stability flag and segment.

| Rank | Ward | Constituency | Voters | Score | Segment |
|---|---|---|---|---|---|
| 1 | Kyuso | Mwingi North | 19,921 | 1.000 | High registered voters (n=4) |
| 2 | Township | Kitui Central | 19,538 | 0.969 | High registered voters (n=4) |
| 3 | Kwavonza/Yatta | Kitui Rural | 18,020 | 0.848 | High registered voters (n=4) |
| 4 | Mutonguni | Kitui West | 17,979 | 0.845 | High registered voters (n=4) |
| 5 | Tseikuru | Mwingi North | 16,471 | 0.724 | High registered voters (n=14) |
| 6 | Kyangwithya West | Kitui Central | 15,931 | 0.681 | High registered voters (n=14) |
| 7 | Mumoni | Mwingi North | 15,877 | 0.676 | High registered voters (n=14) |
| 8 | Athi | Kitui South | 15,843 | 0.674 | High registered voters (n=14) |
| 9 | Kauwi | Kitui West | 15,767 | 0.667 | High registered voters (n=14) |
| 10 | Kyangwithya East | Kitui Central | 15,401 | 0.638 | High registered voters (n=14) |


## Data gaps

- **[DATA NEEDED]** Registration growth since 2022 — The 2026 register by ward is not published. The drive was ward-based, so growth is uneven and cannot be distributed pro rata without inventing it. Pack gap 6.
- **[DATA NEEDED]** Connectivity proxy — No ward-level connectivity data exists. The pack records USO coverage gains in several Mwingi North wards [S35] but says nothing about the other 37, and inferring that the rest are worse would be inventing data. Pack gap 20.
- **[DATA NEEDED]** Drought exposure — NDMA publishes Kitui at county level in this pack. A county-wide constant has no variance across wards and cannot rank them. Sub-county bulletins are [DATA NEEDED].
- **[DATA NEEDED]** 2022 party strength — Ward-level 2022 results are not published in the pack. Pack gap 7.
