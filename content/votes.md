
Kitui has **{{register.2022}}** registered voters on the 2022 register, and Governor Malombe won in 2022 with **{{result.2022.gov.malombe}}** votes (IEBC). The number to win is about **{{benchmark}}**, and no single region holds it.

## The electorate and polling stations

```visual
kind: stats
items:
  - value: "{{register.2022}}"
    label: "registered voters, 2022"
    body: "**{{register.2022}}** voters registered in wards, plus **{{register.2022.prisons}}** registered in prisons: **{{register.2022.with-prisons}}** in all (IEBC)."
  - value: "40"
    label: "wards across 8 constituencies"
    body: "40 county assembly wards in eight constituencies (IEBC)."
  - value: "{{register.polling-stations}}"
    label: "polling stations"
    body: "{{register.polling-stations}} polling stations (IEBC 2022 polling station register)."
  - value: "{{register.2026}}"
    label: "registered, July 2026"
    body: "**{{register.2026}}** registered voters in July 2026 (reported by Venas News). Of the **{{register.2026.growth}}** added since 2022, **{{register.2026.ecvr-drive}}** registered in ECVR Phase 1 (IEBC), the 30-day drive that closed on 28 April 2026, and **{{register.2026.continuous}}** through continuous registration outside it (the growth less the drive). A second ECVR phase ran from 25 June to 25 July 2026 (IEBC gazette notice, 24 June 2026); whether the July figure includes it is not stated, so the remainder may carry some of it. The 2026 register is not yet published by ward."
  - value: "{{turnout.2022}}%"
    label: "turnout, 2022"
    body: "**{{turnout.2022}}%** certified: {{result.2022.gov.valid}} valid votes for governor, of {{register.2022}} registered (IEBC Form 37C). [How Kitui voted](#votes) carries this rate forward to 2027 as a stated assumption."
```

```figure
id: fig-2-1-register
```

**Which turnout.** Two turnout figures are in circulation, on different bases, and this plan says which it uses. **{{turnout.2022}}%** is governor valid votes ({{result.2022.gov.valid}}) divided by the register (IEBC Form 37C). The presidential turnout in Kitui was about **{{result.2022.pres.turnout}}%**, and it includes {{result.2022.pres.rejected}} rejected ballots (Equal Politics aggregation of IEBC results). Every calculation in this plan uses {{turnout.2022}}%.

The full 40-ward register, by constituency, is in [the ward dossier](#ward-dossier).

## Results from 2013 to 2022

Julius Malombe won 2022 with **{{result.2022.gov.malombe}} votes** on a certified turnout of **{{turnout.2022}}%** (IEBC Form 37C); Charity Ngilu won 2017 with **{{result.2017.gov.ngilu}} votes**.

*   **Governor, 2013:** a **named data gap**. No certified result is in hand, and the plan does not use recollection in its place. The record that closes it is the IEBC's 2013 declaration and its Kenya Gazette notice.
*   **Governor, 2017:** Charity Ngilu (NARC) won with **{{result.2017.gov.ngilu}} votes**, in an election the Court of Appeal confirmed (*Malombe v Ngilu* [2018] KECA 460). David Musila was the certified runner-up with **{{result.2017.gov.musila}} votes**, and the incumbent, Julius Malombe, came third with **{{result.2017.gov.malombe}} votes**.
*   **Governor, 2022:** Julius Malombe (Wiper Democratic Movement, renamed the Wiper Patriotic Front in 2025) won with **{{result.2022.gov.malombe}} votes** on a certified turnout of **{{turnout.2022}}%**, {{result.2022.gov.valid}} valid votes of {{register.2022}} registered (IEBC Form 37C). David Musila (Jubilee) was runner-up with **{{result.2022.gov.musila}} votes**; The Star's early total of {{result.2022.gov.musila.media}} is a media variant, and the certified share ({{result.2022.gov.musila.share}}%, calculated) matches {{result.2022.gov.musila}}. Jonathan Mueke (UDA) came third with **{{result.2022.gov.mueke}} votes**.
*   **President, 2022 (Kitui):** Raila Odinga won **{{result.2022.pres.odinga}}** votes (**{{result.2022.pres.odinga.share}}%**) and William Ruto **{{result.2022.pres.ruto}}** (**{{result.2022.pres.ruto.share}}%**); George Wajackoyah won {{result.2022.pres.wajackoyah}} and David Mwaure {{result.2022.pres.mwaure}}, with {{result.2022.pres.rejected}} ballots rejected (Equal Politics aggregation of IEBC results). IEBC Forms 34B and 34C hold the certified figures and are not yet in hand.
*   **Kitui Central MP, 2022:** Dr. Makali Mulu was re-elected on the Wiper ticket with **{{result.2022.mp.mulu}} votes** (IEBC declaration as gazetted); Boniface Musambi was second with {{result.2022.mp.musambi}}. Early media totals differ from the gazetted figure and are not used. The figure reached this plan through a press reproduction of the declaration; the Kenya Gazette notice itself is the record to hold.
*   **Senator and Woman Representative, 2022:** Senator Enoch Wambua (Wiper) won with **{{result.2022.senate.wambua}} votes**, and Woman Representative Irene Kasalu (Wiper) with **{{result.2022.womanrep.kasalu}} votes**. Both totals are media reports. The certified declarations (IEBC Form 38C for the Senate, Form 39C for the Woman Representative) are not yet in hand; until they are, both figures are media totals.
*   **Ward and polling-station results:** the constituency and polling-station forms for the 2017 and 2022 governor races (IEBC Forms 37B and 37A) are public records, not yet in hand. [Where he is known, and where not](#record-where-he-is-known-and-where-not) needs them to test where each candidate's vote came from, ward by ward.

```figure
id: fig-2-2-results
```

**What it means for the campaign.** Kitui voted for the opposition presidential ticket by more than two to one in 2022, and for Wiper candidates in every countywide race.

## The twelve largest wards

The register is concentrated. Spread evenly, the 40 wards would hold {{register.2022.ward-mean}} voters each; in fact voters cluster in urban corridors, farming belts and sub-county headquarters.

```figure
id: fig-3-2-register-map
```

```visual
kind: stats
title: "Where the votes concentrate"
items:
  - value: "{{pareto.top12.share}}%"
    label: "of the register in the 12 largest wards"
    body: "**Twelve wards, 30% of the total, hold {{pareto.top12}} registered voters** ({{pareto.top12.share}}% of the county, calculated from IEBC's 2022 register). That is as many registered voters as the 2022 winning tally, but registration is not turnout: at the {{turnout.constant}}% turnout rate they cast about **{{path.c.ballots}} ballots**."
  - value: "{{pareto.top20.share}}%"
    label: "in the largest 20"
    body: "**The largest 20 wards**, half the total, hold **{{pareto.top20}} registered voters** (**{{pareto.top20.share}}%** of the county, calculated)."
  - value: "{{pareto.bottom10.share}}%"
    label: "in the smallest 10"
    body: "**The ten smallest wards** (from Mui down to Tharaka), a quarter of the total, hold **{{pareto.bottom10}} registered voters** (**{{pareto.bottom10.share}}%** of the register, calculated) across large areas that are slow and costly to cover on the ground."
```


The register of every ward, with its voters and polling stations, is at the end of Evidence and sources.

## The constituencies that decide it


A constituency's weight comes from its voters, the density of its wards, and its role in past party nominations:

```figure
id: constituency-power
```

#### The Mwingi bloc: necessary, not sufficient

**Mwingi North, Mwingi West and Mwingi Central together command {{bloc.mwingi}} registered voters.** That is more *registered voters* than the 2022 winning tally ({{result.2022.gov.malombe}} votes), but registration is not turnout. At the certified {{turnout.2022}}% turnout the bloc casts roughly **{{path.a.ballots}} ballots**, so even every vote there leaves the campaign about {{path.a.margin|abs}} short of {{benchmark}}. Mwingi is therefore **necessary and not sufficient**: no path to {{benchmark}} runs around it, and none ends there. So SMS, USSD and digital outreach go into Mwingi first, to establish Dr. Mulu as the leading alternative there.

#### The four constituencies that decide it

1.  **The Big Four ({{big4.share}}% of the county):** Kitui Central, Kitui South, Mwingi Central and Mwingi North hold **{{big4}} registered voters** across 22 wards (from IEBC's 2022 register). The candidate who leads in these four, or holds level in them, is in reach of the governorship.
2.  **Mwingi North ({{con.mwingi-north}} voters):** fourth by voters, but it holds the county's largest ward (**Kyuso, {{ward.kyuso}} voters**), the political home of the Wiper Patriotic Front leader, Hon. Kalonzo Musyoka (**Tseikuru, {{ward.tseikuru}} voters**), and **Mumoni ({{ward.mumoni}} voters)** (IEBC). It is both a large electorate and the party's heartland.
3.  **Kitui South ({{con.kitui-south}} voters):** the second-largest constituency, anchored by the dense wards of Athi ({{ward.athi}}) and Ikanga/Kyatune ({{ward.ikanga-kyatune}}).

## The number it takes

Governor Julius Malombe's certified 2022 winning total was {{result.2022.gov.malombe}} votes; this document rounds it to **{{benchmark}}**. Held against the July 2026 register, the number to win is ≈{{benchmark}}–{{benchmark.2026-equivalent.rounded}}.

*   **The electorate (July 2026, unconfirmed):** **{{register.2026}} voters** (see [The electorate and polling stations](#votes-the-electorate-and-polling-stations)). IEBC has not yet published the 2026 register by ward, so every ward figure in this plan is the 2022 register.
*   **The benchmark: {{benchmark}} votes.** Governor Julius Malombe's certified 2022 winning total was **{{result.2022.gov.malombe}} votes** (see [Results from 2013 to 2022](#votes-results-from-2013-to-2022)). This document rounds it to **{{benchmark}}** and uses that one figure as the benchmark everywhere: every route below, the digital ceiling in [What each channel can reach](#news-what-each-channel-can-reach) and the objectives in [The goal](#goal) are measured against it.
*   ** The same share of a larger register.** In 2022 the winning tally was **{{benchmark.share-2022}}%** of the register. Held against the July 2026 register of {{register.2026}}, the equivalent tally is **≈{{benchmark.2026-equivalent.rounded}} votes**. Treat {{benchmark}} as the floor and ≈{{benchmark.2026-equivalent.rounded}} as the equivalent on today's register: the number to win is ≈{{benchmark}}–{{benchmark.2026-equivalent.rounded}}.
*   **The turnout rate: {{turnout.constant}}%.** The certified 2022 county turnout was **{{turnout.2022}}%**: {{result.2022.gov.valid}} valid votes of {{register.2022}} registered (IEBC Form 37C). Every calculation here carries that rate forward to 2027. The rate is measured; carrying it forward is an assumption, and the scenario model brackets it at 55–72%.
    *   At {{turnout.constant}}% of the 2022 register, total ballots cast were **{{ballots.2022}} votes**: the certified count of valid votes for governor (IEBC Form 37C).
    *   To reach **{{benchmark}}**, a winning candidate needs about **{{benchmark.share-of-ballots}}% of ballots cast**, which is **{{benchmark.share-of-register}}% of the registered electorate**.

```figure
id: fig-3-1-funnel
```

#### Four routes to the number


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

**What it means for the campaign.** The margin is built in Mwingi and Kitui South, where Dr. Mulu has never held office (see [Where he is known, and where not](#record-where-he-is-known-and-where-not)), and the home belt is held, not relied on.

<model-embed slug="winning-number">
</model-embed>
