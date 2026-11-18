## 2.5 The number it takes

```lead
Governor Julius Malombe's certified 2022 winning total was {{result.2022.gov.malombe}} votes; this document rounds it to **{{benchmark}}**. [CALC, not a forecast] Held against the July 2026 register, the number to win is ≈{{benchmark}}–{{benchmark.2026-equivalent.rounded}}.
```

*   **The electorate (July 2026, Tier 3, unconfirmed):** **{{register.2026}} voters** ([the electorate and polling stations](/#votes-sec-2-1)). IEBC has not yet published the 2026 register by ward, so every ward figure in this plan is the 2022 register.
*   **The benchmark: {{benchmark}} votes.** Governor Julius Malombe's certified 2022 winning total was **{{result.2022.gov.malombe}} votes** ([Results from 2013 to 2022](/#votes-sec-2-2)). This document rounds it to **{{benchmark}}** and uses that one figure as the benchmark everywhere: every route below, the digital ceiling in [what each channel can reach](/#news-sec-4-3) and the objectives in [the goal and five objectives](/#goal-sec-8-1) are measured against it.
*   **[CALC, not a forecast] The same share of a larger register.** In 2022 the winning tally was **{{benchmark.share-2022}}%** of the register (calculated). Held against the July 2026 register of {{register.2026}}, the equivalent tally is **≈{{benchmark.2026-equivalent.rounded}} votes** (calculated). Treat {{benchmark}} as the floor and ≈{{benchmark.2026-equivalent.rounded}} as the equivalent on today's register: the number to win is ≈{{benchmark}}–{{benchmark.2026-equivalent.rounded}} (calculated).
*   **The turnout rate: {{turnout.constant}}%.** The certified 2022 county turnout was **{{turnout.2022}}%**: {{result.2022.gov.valid}} valid votes of {{register.2022}} registered (Tier 1, IEBC Form 37C). Every calculation here carries that rate forward to 2027. The rate is measured; carrying it forward is an assumption, and the scenario model brackets it at 55–72%.
    *   At {{turnout.constant}}% of the 2022 register, total ballots cast were **{{ballots.2022}} votes**: the certified count of valid votes for governor (Tier 1, IEBC Form 37C).
    *   To reach **{{benchmark}}**, a winning candidate needs about **{{benchmark.share-of-ballots}}% of ballots cast**, which is **{{benchmark.share-of-register}}% of the registered electorate** (calculated).

```figure
id: fig-3-1-funnel
```

#### Four routes to the number

```lead
**No route clears {{benchmark}} on its own ballots.** A route is where the margin is built, not where the whole number lives.
```

Each route below is a group of constituencies or wards, measured the same way: registered voters, then the ballots they would cast at the {{turnout.constant}}% turnout rate, then those ballots against the {{benchmark}} benchmark. The ballot count is a ceiling, because it assumes every ballot in the route goes to one candidate. **No route clears {{benchmark}} on its own ballots.** A route is where the margin is built, not where the whole number lives.

```figure
id: fig-3-3-paths
```

```textversion
#### Path A: The Northern Mwingi Triad (The "Mwingi Bloc")
*   **Constituency Composition:** Mwingi Central ({{con.mwingi-central}}) + Mwingi North ({{con.mwingi-north}}) + Mwingi West ({{con.mwingi-west}}).
*   **Total Registered Voters:** **{{bloc.mwingi}} voters** across **15 wards** (**{{bloc.mwingi.share}}%** of county total).
*   **Mathematical Proof:**
    *   `Total (Mwingi) = {{con.mwingi-central}} + {{con.mwingi-north}} + {{con.mwingi-west}} = {{bloc.mwingi}} registered voters`
    *   `Ballots at {{turnout.constant}}% turnout = {{bloc.mwingi}} × {{turnout.rate}} = {{path.a.ballots}}`
    *   `Against the benchmark = {{path.a.ballots}} − {{benchmark}} = −{{path.a.margin|abs}} votes, even at 100% of ballots`
*   **Turnout Reality:** Even an unprecedented 80% share of those ballots ({{path.a.at80}} votes) leaves the campaign **{{path.a.at80.short}} votes short** of {{benchmark}}.
*   **Strategic Implication:** The Mwingi bloc is the largest single reservoir of votes in the county and the campaign cannot win without a decisive margin in it — but it cannot win on it alone either. Mwingi is the necessary foundation, paired with Kitui South and the home belt.

#### Path B: The Central-South-West Urban/Rural Axis
*   **Constituency Composition:** Kitui Central ({{con.kitui-central}}) + Kitui South ({{con.kitui-south}}) + Kitui West ({{con.kitui-west}}).
*   **Total Registered Voters:** **{{path.b.registered}} voters** across **15 wards** (**{{path.b.share}}%** of county total).
*   **Mathematical Proof:**
    *   `Total (Central-South-West) = {{con.kitui-central}} + {{con.kitui-south}} + {{con.kitui-west}} = {{path.b.registered}} registered voters`
    *   `Ballots at {{turnout.constant}}% turnout = {{path.b.registered}} × {{turnout.rate}} = {{path.b.ballots}}`
    *   `Against the benchmark = {{path.b.ballots}} − {{benchmark}} = −{{path.b.margin|abs}} votes, even at 100% of ballots`
*   **Strategic Implication:** Combining the candidate's home base (Kitui Central) with the county's largest southern constituency (Kitui South) and the peri-urban west (Kitui West) forms a contiguous southern/central coalition with more *registered voters* than the benchmark, but its ballots fall **{{path.b.margin|abs}} short** of {{benchmark}} even if every one of them were his. It is the largest route, and it still needs Mwingi.

#### Path C: The "Top 12 Megawards" Coalition
*   **Ward Composition (12 Wards):** Kyuso ({{ward.kyuso}}) + Township ({{ward.township}}) + Kwa Vonza/Yatta ({{ward.kwa-vonza-yatta}}) + Mutonguni ({{ward.mutonguni}}) + Tseikuru ({{ward.tseikuru}}) + Kyangwithya West ({{ward.kyangwithya-west}}) + Mumoni ({{ward.mumoni}}) + Athi ({{ward.athi}}) + Kauwi ({{ward.kauwi}}) + Kyangwithya East ({{ward.kyangwithya-east}}) + Ikanga/Kyatune ({{ward.ikanga-kyatune}}) + Mulango ({{ward.mulango}}).
*   **Total Registered Voters:** **{{pareto.top12}} voters** across **12 wards** (**{{pareto.top12.share}}%** of county total).
*   **Mathematical Proof:**
    *   `∑ (12 Wards) = {{ward.kyuso}} + {{ward.township}} + {{ward.kwa-vonza-yatta}} + … + {{ward.mulango}} = {{pareto.top12}} registered voters`
    *   `Ballots at {{turnout.constant}}% turnout = {{pareto.top12}} × {{turnout.rate}} = {{path.c.ballots}}`
    *   `Against the benchmark = {{path.c.ballots}} − {{benchmark}} = −{{path.c.margin|abs}} votes, even at 100% of ballots`
*   **Strategic Implication:** The campaign does not need to contest all 40 wards with equal intensity. Concentrated effort across these 12 high-yield wards reaches {{pareto.top12}} registered voters, which is where the margin is cheapest to build.

#### Path D: The Home-Belt Ceiling (the trap)
*   **Constituency Composition:** Kitui Central ({{con.kitui-central}}) + Kitui West ({{con.kitui-west}}) + Kitui Rural ({{con.kitui-rural}}).
*   **Total Registered Voters:** **{{path.d.registered}} voters** across **13 wards** (**{{path.d.share}}%** of county total).
*   **Mathematical Proof:**
    *   `Total (Home-Belt) = {{con.kitui-central}} + {{con.kitui-west}} + {{con.kitui-rural}} = {{path.d.registered}} registered voters`
    *   `Ballots at {{turnout.constant}}% turnout = {{path.d.registered}} × {{turnout.rate}} = {{path.d.ballots}}`
    *   `Against the benchmark = {{path.d.ballots}} − {{benchmark}} = −{{path.d.margin|abs}} votes, even at 100% of ballots`
*   **Turnout Reality:** These {{path.d.registered}} registered voters cast only **{{path.d.ballots}} ballots**. Even if Dr. Mulu captured an unprecedented 80% of all votes cast across this entire home belt ({{path.d.at80}} votes), he would still fall **{{path.d.at80.short}} votes short** of the {{benchmark}} victory threshold.
*   **Strategic Conclusion:** **A home-constituency strategy cannot reach the number.** Dr. Mulu cannot win by maximising margins in Kitui Central, Kitui West and Kitui Rural alone. Expansion into Mwingi and Kitui South is an arithmetic necessity, not a choice.
```

**What it means for the campaign.** The margin is built in Mwingi and Kitui South, where Dr. Mulu has never held office ([where he is known, and where not](/#known-sec-6-2)), and the home belt is held, not relied on.
