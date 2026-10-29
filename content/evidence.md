

## 2.1 The electorate and the number it takes

```lead
Governor Julius Malombe's certified 2022 winning total was {{result.2022.gov.malombe}} votes; this document rounds it to **{{benchmark}}**. [CALC, not a forecast] Held against the July 2026 register, the number to win is ≈{{benchmark}}–{{benchmark.2026-equivalent.rounded}}.
```

#### The electorate

```visual
kind: stats
items:
  - value: "{{register.2022}}"
    label: "registered voters, 2022"
    tier: 1
    body: "**Total Registered County Voters:** **{{register.2022}}** ward-registered voters (plus **{{register.2022.prisons}}** prison-registered voters, totalling **{{register.2022.with-prisons}}**) (Tier 1)."
  - value: "40"
    label: "wards across 8 constituencies"
    tier: 1
    body: "**Total Registered County Assembly Wards:** **40** across **8** constituencies (Tier 1)."
  - value: "{{register.polling-stations}}"
    label: "polling stations"
    tier: 1
    body: "**Total Polling Stations:** {{register.polling-stations}} (Tier 1)."
  - value: "{{register.2026}}"
    label: "registered, July 2026"
    tier: 3
    body: "**Registered voters, July 2026:** **{{register.2026}}** (Tier 3, reported by Venas News; unconfirmed until IEBC's own July 2026 figure is in hand). Of the **{{register.2026.growth}}** added since 2022, **{{register.2026.ecvr-drive}}** registered in ECVR Phase 1, the 30-day drive that closed on 28 April 2026 and **{{register.2026.continuous}}** through continuous registration outside it (modelled: the growth less the drive). A second ECVR phase ran from 25 June to 25 July 2026 (IEBC gazette notice, 24 June 2026); whether the July annex includes it is not stated, so the remainder may carry some of it. The 2026 register is not yet published by ward."
  - value: "{{benchmark}}"
    label: "the winning benchmark"
    body: "**Winning benchmark:** Governor Malombe won in 2022 with **{{result.2022.gov.malombe}} votes** (Section 2.2). Section 2.1 derives the working benchmark of {{benchmark}} from it."
  - value: "{{turnout.2022}}%"
    label: "turnout, 2022"
    tier: 1
    body: "**Turnout, 2022:** **{{turnout.2022}}%** certified: {{result.2022.gov.valid}} valid votes of {{register.2022}} registered (Tier 1, IEBC Form 37C). Section 2 carries this rate forward to 2027 as a stated assumption. [CONFLICT C8: see open items]"
```

```figure
id: fig-2-1-register
```

The full 40-ward register, by constituency, is in Annex B.1.

#### The number it takes

*   **Total Registered Electorate (July 2026, Tier 3, unconfirmed):** **{{register.2026}} voters** (Section 2.1). IEBC has
    not yet published the 2026 register by ward, so every ward figure in this section is the 2022
    register.
*   **The benchmark: {{benchmark}} votes.** Governor Julius Malombe's certified 2022 winning total was
    **{{result.2022.gov.malombe}} votes** (Section 2.2). This document rounds it to **{{benchmark}}** and uses that one figure
    as the benchmark everywhere: every route in Section 2.4, the digital ceiling in Section 2.9.3 and
    the objectives in Section 1 are measured against it.
*   **[CALC, not a forecast] The same share of a larger register.** In 2022 the winning tally was
    **{{benchmark.share-2022}}%** of the register. Held against the July 2026 register of {{register.2026}}, the equivalent tally is
    **≈{{benchmark.2026-equivalent.rounded}} votes**. Treat {{benchmark}} as the floor and ≈{{benchmark.2026-equivalent.rounded}} as the equivalent on today's register:
    the number to win is ≈{{benchmark}}–{{benchmark.2026-equivalent.rounded}}.
*   **The turnout rate: {{turnout.constant}}%.** The certified 2022 county turnout was **{{turnout.2022}}%**:
    {{result.2022.gov.valid}} valid votes of {{register.2022}} registered (Tier 1, IEBC Form 37C). Every calculation in this
    section carries that rate forward to 2027. The rate is measured; carrying it forward is an
    assumption, and the scenario model brackets it at 55–72%.
    *   At {{turnout.constant}}% of the 2022 register, total ballots cast equal approximately **{{ballots.2022}} votes**. [CONFLICT C8: see open items]
    *   To reach **{{benchmark}}**, a winning candidate must capture about **{{benchmark.share-of-ballots}}% of ballots cast**, which is
        **{{benchmark.share-of-register}}% of the registered electorate**.

```figure
id: fig-3-1-funnel
```

## 2.2 How Kitui has voted

```lead
Julius Malombe won 2022 with **{{result.2022.gov.malombe}} votes** on a certified turnout of **{{turnout.2022}}%** (Tier 1, IEBC Form 37C); Charity Ngilu won 2017 with **{{result.2017.gov.ngilu}} votes** (Tier 1).
```

*   **2013 General Election (Kitui Governor):** This cycle represents a **named data gap** in the official campaign records (Tier 1 gap). The research did not supply certified results, and the campaign does not use unverified recollections. The record that closes it is the IEBC's 2013 declaration and its Kenya Gazette notice.
*   **2017 General Election (Kitui Governor):** Won by Charity Ngilu (NARC) with **{{result.2017.gov.ngilu}} votes** (Tier 1), following a highly contested election confirmed by the Court of Appeal (*Malombe v Ngilu* [2018] KECA 460) (Tier 1). The certified runner-up was David Musila with **{{result.2017.gov.musila}} votes** (Tier 1), and the incumbent Julius Malombe finished third with **{{result.2017.gov.malombe}} votes** (Tier 1).
*   **2022 General Election (Kitui Governor):** Won by Julius Malombe (Wiper Democratic Movement, renamed the Wiper Patriotic Front in 2025) with **{{result.2022.gov.malombe}} votes** on a certified turnout of **{{turnout.2022}}%**, {{result.2022.gov.valid}} valid votes of {{register.2022}} registered (Tier 1, IEBC Form 37C). David Musila (Jubilee) was runner-up with **{{result.2022.gov.musila}} votes** (Tier 1); The Star's early total of {{result.2022.gov.musila.media}} is a media variant, and the certified share ({{result.2022.gov.musila.share}}%) matches {{result.2022.gov.musila}}. Jonathan Mueke (UDA) finished third with **{{result.2022.gov.mueke}} votes** (Tier 2).
*   **2022 Kitui Central MP:** Dr. Mulu was re-elected on the Wiper ticket with **{{result.2022.mp.mulu}} votes** (Tier 1, IEBC declaration as gazetted); Boniface Musambi was second with {{result.2022.mp.musambi}}. Early media totals differ from the gazetted figure and are not used. The figure reached this proposal through a press reproduction of the declaration; the Kenya Gazette notice itself is the record to hold.
*   **2022 Senate and Woman Representative Elections:** Senator Enoch Wambua (Wiper) secured his seat with **{{result.2022.senate.wambua}} votes** (Tier 2), and Woman Representative Irene Kasalu (Wiper) won with **{{result.2022.womanrep.kasalu}} votes** (Tier 2). Both totals are media reports. The certified declarations (IEBC Form 38C for the Senate, Form 39C for the Woman Representative) are the Tier 1 record and are not yet in hand; until they are, both figures stay Tier 2.
*   **Ward and polling-station results:** The constituency and polling-station forms for the 2017 and 2022 governor races (IEBC Forms 37B and 37A) are public records and are not yet in hand. They are the record Section 2.7 needs to test where each candidate's vote came from, ward by ward.

```figure
id: fig-2-2-results
```

## 2.3 Where the votes are

Voter registration in Kitui County is highly concentrated. Rather than a flat geographic distribution across all 40 wards (which would average {{register.2022.ward-mean}} voters per ward), the electorate exhibits density clustering in urban corridors, agricultural belts, and sub-county headquarters.

```figure
id: fig-3-2-register-map
```

```visual
kind: stats
title: "Critical Concentration Insights"
items:
  - value: "{{pareto.top12.share}}%"
    label: "of the register in the 12 largest wards"
    tier: 1
    body: "**The \"12 Megawards\" Rule:** The top **12 largest wards** (representing just 30.0% of all wards) contain **{{pareto.top12}} registered voters** ({{pareto.top12.share}}% of the entire county electorate). They hold as many registered voters as the 2022 winning tally, but registration is not turnout: at the {{turnout.constant}}% turnout rate they cast about **{{path.c.ballots}} ballots**."
  - value: "{{pareto.top20.share}}%"
    label: "in the largest 20"
    tier: 1
    body: "**The Upper Half Domination:** The top **20 wards** (50% of the wards) command **{{pareto.top20}} registered voters** (**{{pareto.top20.share}}%** of the county total)."
  - value: "{{pareto.bottom10.share}}%"
    label: "in the smallest 10"
    tier: 1
    body: "**The Lower Tail Dispersal:** The bottom **10 smallest wards** (from Mui down to Tharaka) aggregate to **{{pareto.bottom10}} registered voters** (only **{{pareto.bottom10.share}}%** of the county register across 25% of the total wards), yet cover vast geographic areas with severe logistical transit costs."
```

### 2.3.1 The constituencies that decide it

```lead
Mwingi North, Mwingi West and Mwingi Central together command {{bloc.mwingi}} registered voters (Tier 1), roughly {{path.a.ballots}} ballots at the certified turnout. Mwingi is therefore **necessary and not sufficient**: no path to {{benchmark}} runs around it, and none ends there.
```

A constituency's structural importance is determined by its total voter weight, the density of its wards, and its historical role in party nominating conventions:

```figure
id: constituency-power
```

#### The Mwingi bloc: necessary, not sufficient

A key strategic finding emerges from this integrated database: **Mwingi North, Mwingi West, and Mwingi Central together command exactly {{bloc.mwingi}} registered voters (Tier 1).** That is more *registered voters* than the 2022 winning vote total ({{result.2022.gov.malombe}} votes, Tier 1) — but registration is not turnout. At the county's certified {{turnout.2022}}% turnout baseline the Mwingi bloc yields roughly **{{path.a.ballots}} ballots**, so even total dominance there leaves the campaign about {{path.a.margin|abs}} votes short of {{benchmark}}. Mwingi is therefore **necessary and not sufficient**: no path to {{benchmark}} runs around it, and none ends there. This finding informs the campaign's geographic prioritization, directing immediate SMS/USSD and digital outreach to establish Dr. Mulu as the dominant alternative in Mwingi.

#### Analytical Hierarchy:
1.  **The "Big 4" Electorate Engine ({{big4.share}}% of County):** Kitui Central, Kitui South, Mwingi Central, and Mwingi North command **{{big4}} registered voters** across 22 wards. Securing parity or dominance in these four sub-counties decides the gubernatorial election.
2.  **The Northern Anchor (Mwingi North - {{con.mwingi-north}} voters):** While 4th in total voters, Mwingi North carries outsized structural leverage: it hosts the #1 largest ward in the county (**Kyuso, {{ward.kyuso}} voters**), the ancestral political base of Wiper Patriotic Front leader Hon. Kalonzo Musyoka (**Tseikuru, {{ward.tseikuru}} voters**), and **Mumoni ({{ward.mumoni}} voters)**. It is both a voter powerhouse and the party's spiritual heartland.
3.  **The Southern Bulwark (Kitui South - {{con.kitui-south}} voters):** The second-largest constituency by volume, Kitui South is anchored by high-density wards in Athi ({{ward.athi}}) and Ikanga/Kyatune ({{ward.ikanga-kyatune}}).

## 2.4 Four routes to the number

```lead
**No route clears {{benchmark}} on its own ballots.** A route is where the margin is built, not where the whole number lives.
```

Each route below is a combination of constituencies or wards, measured the same way: registered voters, then the ballots they would cast at the {{turnout.constant}}% turnout rate, then that ballot count against the {{benchmark}} benchmark from Section 2.1. The ballot count is the ceiling, since it assumes every ballot in the route goes to one candidate. **No route clears {{benchmark}} on its own ballots.** A route is where the margin is built, not where the whole number lives.

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
*   **Strategic Conclusion:** **A home-constituency strategy is mathematically impossible.** Dr. Mulu cannot win by simply maximizing margins in Kitui Central, Kitui West, and Kitui Rural. Aggressive outward expansion into Mwingi and Kitui South is an absolute, non-negotiable arithmetic necessity.
```

## 2.5 The nomination rules and the calendar

```figure
id: fig-2-3-nomination
```

### 2.5.1 How Wiper picks its candidate

```lead
The Wiper decision is expected in the final quarter of 2026, late October to November on the reported timetable: **a Tier 3, single-source report, not a confirmed party decision.** The 2022 precedent was selected delegates and panels (Tier 1, Kenya Law).
```

The Wiper flagbearer decision is expected to be settled by a party-run countywide selection in the final quarter of 2026 — late October to November on the reported timetable (Tier 3, Section 2.5.2).

Section 1.2 opened with the claim this entire Phase −1 strategy is built on:
that the Wiper Kitui gubernatorial ticket will be settled by a party-run
countywide selection rather than a competitive primary. That claim deserves to be stated plainly
for what it is — **a Tier 3, single-source report, not a confirmed party
decision.**

If it turns out to be wrong — if Wiper instead runs a competitive primary, or
delegate vote, or some hybrid — the phasing in Section 4.3 needs to be revised
before further effort commits against it. This section exists so that
re-check happens deliberately rather than by accident.

**What the 2022 record shows, and what it does not.** The High Court judgment in *Kilonzo v Wiper
Democratic Movement* (2022) records that Wiper's rules allowed nomination by consensus, and by
direct or indirect methods, with the National Executive Council deciding the mode; and that for
the 2022 Kitui gubernatorial ticket the party's board reached its decision through selected
delegates and panels (Tier 1, Kenya Law). That is the 2022 precedent. It is not the 2027
procedure, which rests on the party documents listed in Section 2.5.2.

### 2.5.2 Where the selection method stands

> **The party's name changed in 2025.** The Office of the Registrar of Political Parties issued a
> certificate of change of name from **Wiper Democratic Movement (WDM)** to **Wiper Patriotic Front
> (WPF)** in August 2025 (Tier 1, ORPP). This document uses WPF throughout; WDM appears only where
> a 2022 record is quoted as it was filed.

The strategic assumption that the Wiper Patriotic Front will select its Kitui gubernatorial nominee through a party-run countywide selection is classified as **Tier 3 (single-sourced campaign report, not confirmed by party officials)**. This mechanism remains highly fluid and subject to internal party negotiations.

```visual
kind: checklist
title: "To transition this selection mechanism from a Tier 3 strategic assumption to a Tier 1 verified operational constraint, the campaign requires"
items:
  - label: "An official, signed resolution by the **Wiper National Executive Council (NEC)**."
  - label: "**The party's nomination rules and timetable for 2027**"
    body: "the documentary record the party files with the IEBC and the Office of the Registrar of Political Parties. This is the obtainable test, and the operationally useful one: it states who selects, by what mode, and when. A signed communique from the party leader would settle the question but is not something the campaign can produce on demand."
```

## 2.6 The field: rivals and an open seat

#### What his rivals have already proven

The 2027 gubernatorial race in Kitui features a highly competitive, multi-candidate field. The campaign's strategic and digital architecture must navigate a distinct, two-stage contest.

```figure
id: fig-3-5-field
```

### 2.6.1 Stage One: the Wiper nomination

Every attribute below is stated from an official or documentary record, and each line names the record that carries it. Where the record is not yet in hand, the line says so and makes no claim in its place.

```visual
kind: cards
preset: candidate
items:
  - title: "Dr. Irene Kasalu"
    text: "Woman Representative, Kitui County"
    body: "Holds the county's Woman Representative seat, a countywide constituency. Her 2022 result is the highest in the field: **{{result.2022.womanrep.kasalu}} votes** as Woman Representative, above the {{result.2022.gov.malombe}} that won the governorship the same year (Tier 2, a media report of the declaration; the IEBC Form 39C declaration is the record to hold, Section 2.2). As Woman Representative she is patron of the Kitui allocation of the National Government Affirmative Action Fund; the Auditor-General's reports on that allocation are the documentary record of her stewardship of public money, and they are not yet in hand."
    value: "{{result.2022.womanrep.kasalu}}"
    tier: 2
  - title: "Sen. Enoch Wambua"
    text: "Senator, Kitui County"
    body: "Won the 2022 Senate race with **{{result.2022.senate.wambua}} votes** (Tier 2; the IEBC Form 38C declaration is the record to hold), within {{gap.wambua-to-benchmark-2022}} of the winning governor's tally. His Senate committee roles are a matter of parliamentary record, to be cited from the Senate Hansard and committee membership lists."
    value: "{{result.2022.senate.wambua}}"
    tier: 2
  - title: "Hon. Dr. Benson Makali Mulu"
    text: "Member of Parliament, Kitui Central"
    body: "Holds a PhD in Economics and sits on the National Assembly's Budget and Appropriations Committee (Tier 1, Section 2.10.1). His largest electorate to date is Kitui Central's {{con.kitui-central}} registered voters, where he was re-elected in 2022 with **{{result.2022.mp.mulu}} votes** (Tier 1). He has not yet stood for a countywide office, so his proof at the ballot is constituency-bounded."
    value: "{{result.2022.mp.mulu}}"
    tier: 1
```

```visual
kind: cards
preset: policy
items:
  - title: "The two positions cannot both be run."
    text: "**Firefly's recommendation is the second, because a published allocation methodology is the stronger fit with the verification pillar in Section 3.2.1 — but it is the campaign's policy call.** [CONFLICT C6: see open items]"
    body: "Her public criticism of the incumbent's equal-ward funding allocation is a live policy argument, and one where the campaign's own position needs settling first: Section 3.2.2 currently proposes an equal-ward guarantee of its own. Either the equal-ward guarantee is the platform, and this line of argument is not available to the campaign, or the argument is made and the guarantee is restated as a needs-weighted formula."
```

The party's 2027 nomination list is the document that settles who contests Stage One.

### 2.6.2 Stage Two: the general election field

Beyond the Wiper nomination, the general election field is stated on the same rule: the official record, attributed, and nothing in its place where the record is missing. No candidacy below is established until the party nomination records and the IEBC's gazetted nominations for 2027 are published.

```visual
kind: cards
preset: candidate
items:
  - title: "Charity Ngilu"
    text: "Former Governor, Kitui County - NARC"
    body: "Won the court-confirmed 2017 gubernatorial election with {{result.2017.gov.ngilu}} votes (Tier 1). She did not defend the seat in the 2022 general election (Tier 2; the IEBC's gazetted 2022 candidate list is the record)."
    value: "{{result.2017.gov.ngilu}}"
    tier: 1
  - title: "David Musila"
    text: "Former Senator, Kitui County"
    body: "Runner-up in both the 2017 and 2022 gubernatorial elections (Tier 1): {{result.2017.gov.musila}} votes in 2017 (Tier 1), and {{result.2022.gov.musila}} in 2022 (Tier 1, certified; The Star's early total of {{result.2022.gov.musila.media}} is a media variant). Where his vote came from is a question for the ward and polling-station forms (Section 2.2); until they are in hand, this proposal makes no claim about his geographic base."
    value: "{{result.2022.gov.musila}}"
    tier: 1
  - title: "Peninah Malonza"
    text: "Former Deputy Governor & Former Cabinet Secretary"
    body: "Served as Deputy Governor from 2013–2017 (Tier 1) and subsequently as Cabinet Secretary for Tourism, Wildlife, and Heritage (Tier 1). Both appointments are Kenya Gazette records."
  - title: "Nicholas Mulila"
    text: "Safaricom PLC Executive"
    body: "Holds executive roles at Safaricom PLC (Tier 2); the company's published annual reports are the documentary record of those roles. His prospective candidacy has been reported in local news (Tier 2)."
  - title: "Francis Musili Kauta"
    text: "Governance Activist"
    body: "A legal professional and civil society advocate in Kitui (Tier 2). His litigation on community rights and public land use is a matter of court record, to be cited from Kenya Law."
```

### 2.6.3 The incumbent is term-limited: 2027 is an open seat

```lead
Article 180(7) of the Constitution of Kenya limits a governor to two terms (Tier 1). Governor Malombe is serving his second, so he cannot stand in 2027.
```

Governor Malombe served as Governor from 2013 to 2017, lost the 2017 election to Charity Ngilu (court-confirmed, Tier 1), and won again in 2022. Article 180(7) of the Constitution of Kenya limits a governor to two terms (Tier 1). He is serving his second, so he cannot stand in 2027, and this proposal plans for an open-seat election throughout.The Auditor-General's and Controller of Budget's reports on the county executive are the documentary record of his administration (Annex B.2). 

*   **Strategic consequence:** the 2027 race has no incumbent. Malombe's incumbency advantage does not carry into it, the Wiper Patriotic Front's nomination is a contest for an open seat, and factional realignment within the party and across independent coalitions follows. Dr. Mulu positions himself as the high-integrity successor to lead the county's economic transition, measured against the outgoing administration's record (Annex B.2).
<!-- keep -->
*   **What would change it:** only a court ruling or an IEBC decision to accept his nomination papers. The campaign's electoral-law reviewer (Section 5.3.4) reads Kenya Law and the IEBC's gazetted 2027 nominations for either, and the plan changes only if one appears.

### 2.6.4 Reading the current field

```lead
The strategic implication is not to compete for the same countywide presence but to **compete on a dimension she is not occupying**: verifiable fiscal and delivery competence.
```

Dr. Kasalu's strength, on the record, is a countywide seat and a 2022 result
above the governor's winning tally (Section 2.6; Tier 2 until the IEBC
declaration is in hand). The strategic implication is not to compete for the
same countywide presence — the campaign cannot match a sitting Woman
Representative's countywide constituency in the time available — but to
**compete on a dimension she is not occupying**: verifiable fiscal and delivery
competence, distributed by channels that reach the wards where he has never held
office. Her documented
critique of the incumbent's equal-ward allocation model also opens a technical
policy debate Dr. Mulu is better equipped to win than any candidate in the
field.

---

## 2.7 Where he is known and where he isn't


### 2.7.1 Where he has held office, and where he has not

```lead
**Five of the twelve largest wards lie where he has never held office.** The pool is {{pool.share}}% of the entire Kitui County voter register. The pool is structural: it is derived from where he has held office, not from any measure of opinion.
```
*   **Candidate Profile:** Dr. Benson Makali Mulu has served as Member of Parliament for Kitui Central for **13 consecutive years (since 2013, Tier 1)**.
*   **High-Recognition / Core Anchor Zone:** Kitui Central ({{con.kitui-central}} voters) and immediate adjacent wards in Kitui West (Matinyani, Kauwi) and Kitui Rural (Kisasi, Mbitini).
*   **Where he has never held office:**
    1.  **The Mwingi Sub-Counties (Mwingi North, Mwingi Central, Mwingi West):** Total **{{bloc.mwingi}} registered voters** (**{{bloc.mwingi.share}}%** of the county register). He has never held office in these northern constituencies. The hypothesis is that his identity as a "Kitui Central MP" limits recall there compared with countywide office holders; Week 1 tests it against his own channel data (Section 2.12).
    2.  **Kitui South (6 Wards):** Total **{{con.kitui-south}} registered voters** (**{{con.kitui-south.share}}%** of the county register). Geographically remote, separated by long transit corridors, and traditionally influenced by local southern leadership dynamics.
    3.  **Kitui East (outside the pool):** Total **{{con.kitui-east}} registered voters** (particularly Endau/Malalani, Voo/Kyamatu, and Mutito/Kaliku). He has not held office here either, but Kitui East is not counted in the pool below; it is a direct-contact target on the party-flow finding in Section 2.7.2.

#### Do the deficit wards overlap the decisive ones?
**Partly. Five of the twelve largest wards lie where he has never held office.**

The denominator is the twelve largest wards (Section 2.3). The numerator is those of them in Mwingi North, Mwingi West, Mwingi Central or Kitui South, the constituencies where he has never held office. Kitui Central, Kitui West and Kitui Rural, which hold the other seven, sit in or beside the constituency he has represented since 2013.

1.  **Mwingi North:** Kyuso (#1 countywide, **{{ward.kyuso}}**), Tseikuru (#5, **{{ward.tseikuru}}**) and Mumoni (#7, **{{ward.mumoni}}**).
2.  **Kitui South:** Athi (#8, **{{ward.athi}}**) and Ikanga/Kyatune (#11, **{{ward.ikanga-kyatune}}**).

Together the five hold **{{pareto.top12.in-pool.voters}} registered voters**, **{{pareto.top12.in-pool.share}}%** of the county register. Mwingi Central, the pool's largest constituency, has no ward in the twelve: its weight is spread across six mid-sized wards, led by Central ({{ward.central}}), Nguni ({{ward.nguni}}) and Nuu ({{ward.nuu}}).

```visual
kind: stats
title: "Total Decisive Deficit Pool"
items:
  - value: "{{pool}}"
    label: "registered voters in the pool"
    tier: 1
    body: "`Deficit Pool (Mwingi + South) = {{bloc.mwingi}} (Mwingi) + {{con.kitui-south}} (Kitui South) = {{pool}} registered voters`"
  - value: "{{pareto.top12.in-pool.voters}}"
    label: "in the five of the twelve largest wards that lie in it"
    tier: 1
```

This represents **{{pool.share}}% of the entire Kitui County voter register**. The pool is structural: it is derived from where he has held office, not from any measure of opinion.

```figure
id: fig-3-4-footprint
```

### 2.7.2 Where party loyalty won't carry him

```lead
**Kitui Central will be fighting its own contest.** **Two constituencies will not carry party flow:** Kitui East returned a UDA MP and Kitui South a Jubilee MP in 2022 (Tier 3, constituency records).
```

**Kitui Central will be fighting its own contest.** Stephen Kilonzo ("Kitundumo") has reportedly
entered the Kitui Central MP race, and NLP leader Augustus Muli is weighing a bid there (Tier 3 and
Tier 2 respectively; both become record only when the party nomination lists and the IEBC's gazetted
nominations are published, and Mr Muli's party leadership is a matter of the Registrar of Political
Parties' register). Dr. Mulu's home constituency — {{con.kitui-central}} voters, {{con.kitui-central.share}}% of the register — will
therefore have its own succession fight running through the same window as his gubernatorial bid.
**Anchor-zone loyalty cannot be left on autopilot**, and the Section 3.7 pillar weights should not
assume it.

**Two constituencies will not carry party flow.** Kitui East returned a **UDA** MP and Kitui South a
**Jubilee** MP in 2022 (Tier 3, constituency records; the IEBC's 2022 declarations for both seats
are the record to cite). Together they hold **{{east-south}} registered
voters — {{east-south.share}}% of the county**. Party structures do not reach those local networks, which means
reach into them is a direct-contact problem rather than a party-mobilisation one. Kitui South sits
inside the pool and Kitui East beside it, where he has also never held office, so this compounds
rather than offsets the Section 2.7 finding.

```figure
id: fig-3-6-party-flow
```

## 2.8 The county: people, budget and three regions

### 2.8.1 The county's people and economy

Kitui County's vast physical and demographic characteristics define its developmental and electoral context:

```visual
kind: stats
items:
  - value: "{{census.population}}"
    label: "people, 2019 census"
    tier: 1
    body: "**Demographic Base:** Sourced from the official 2019 Kenya Population and Housing Census, the county population is **{{census.population}}** (comprising {{census.male}} males, {{census.female}} females, and 33 intersex individuals) (Tier 1). Projections estimate a population base of approximately 1.2 million by 2024 (Tier 2)."
  - value: "{{census.households}}"
    label: "households"
    tier: 1
    body: "**Total Households:** **{{census.households}}** (Tier 1), with an average household size of **4.3 persons** (Tier 1)."
  - value: "{{census.area}} km²"
    label: "Kenya's sixth-largest county"
    tier: 1
    body: "**Vast Land Area:** **{{census.area}} km²** (Tier 1), establishing Kitui as Kenya's sixth-largest county, with a low population density of **37 persons/km²** (Tier 1) compared to the national average of 82."
  - value: "{{census.rural.share}}%"
    label: "rural"
    tier: 1
    body: "**Rural-Urban Split:** **{{census.rural.share}}% rural** ({{census.rural}} residents) vs **{{census.urban.share}}% urban** ({{census.urban}} residents) (Tier 1)."
  - value: "{{poverty.2021}}%"
    label: "in poverty, 2021"
    tier: 1
    body: "**Socio-Economic Vulnerability:** the **KNBS Kenya Poverty Report** puts **{{poverty.2021}}% of Kitui residents, about {{poverty.2021.people}} people, in poverty in 2021** (Tier 1). This is the official poverty rate; the 60.4% in the NDMA Long Rains Food Security Assessment is a food-security figure, not a poverty-report rate, and is not used. Approximately **{{water.surface}} residents rely on untreated surface water** as their primary domestic source (Tier 1)."
  - value: "over 90%"
    label: "of households keep poultry"
    tier: 1
    body: "**Livestock Economy:** Anchored by approximately {{livestock.cattle}} cattle, {{livestock.goats}} goats, {{livestock.poultry}} poultry, and {{livestock.donkeys}} donkeys (Tier 1). **Poultry farming is practiced by over 90% of households** (Tier 1), serving as a highly inclusive, gender-focused entry point for economic empowerment messaging."
```

```figure
id: fig-2-4-people
```

```visual
kind: timeline
title: "Natural Hazards and NDMA Early-Warning Context"
items:
  - when: "September 2025"
    label: "IPC Phase 2 (\"Stressed\")"
    tier: 1
  - when: "January 2026"
    label: "NDMA drought status: Alert Phase"
    tier: 1
  - when: "March 2026"
    label: "National flooding"
    tier: 2
body: "The county experienced severe, chronic drought pressure throughout 2025 (Tier 1). Sourced from the National Drought Management Authority (NDMA) January 2026 bulletin, the county's drought early-warning status was designated as **Alert Phase** (Tier 1), and its food security was classified under **IPC Phase 2 (\"Stressed\")** as of September 2025 (Tier 1). This drought pressure was immediately followed by the **March 2026 national flooding** (Tier 2), which disrupted infrastructure across multiple sub-counties."
```

### 2.8.2 The budget the next governor runs

```lead
According to the approved Kitui County Fiscal Strategy Paper for FY2026/27, the total projected resource envelope is **KSh 13.79 billion**; the total itself is cited through secondary reporting of the Paper (Tier 3) until the Paper is cited directly.
```

The Governor of Kitui is the supreme executive authority of the county, responsible under the County Governments Act for administering public services to over one million residents. Key administrative and policy competencies include:

```visual
kind: checklist
items:
  - label: "Agriculture and Water Infrastructure"
    text: "Developing drought-resilient food production, sand dams, irrigation, and livestock markets."
  - label: "County Health Services"
    text: "Managing health facilities, personnel, pharmaceutical procurement, and sanitation."
  - label: "Economic Devolution and Infrastructure"
    text: "Constructing county road networks, market facilities, and trade support systems."
  - label: "Financial Administration"
    text: "Accountably managing public revenue allocations and local own-source collections."
```

#### Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper):
The county budget represents a significant administrative responsibility. According to the approved Kitui County Fiscal Strategy Paper for FY2026/27, the total projected resource envelope is **KSh 13.79 billion**, comprising:
*   **Equitable Share:** KSh 11.64 billion ({{budget.equitable.share}}% of the envelope) (Tier 1).
*   **Own-Source Revenue:** KSh 1.12 billion in the Fiscal Strategy Paper ({{budget.osr.share}}%), raised to **KSh 1.339 billion** by the County Assembly. The final approved FY2026/27 budget settles which applies; until it is in hand, both are shown (Tier 3, verify).
*   **Conditional Grants:** KSh 1.04 billion ({{budget.grants.share}}%) (Tier 1).

```figure
id: fig-2-5-budget
```

The three parts sum to KSh 13.80 billion against a published total of 13.79: the KSh 0.01 billion difference is rounding in the source, and is shown as its own segment rather than absorbed. The total itself is cited through secondary reporting of the Paper (Tier 3) until the Paper is cited directly.

**The Strategic Opportunity:** This KSh 13.79 billion envelope represents the actual fiscal ceiling of devolved governance. The campaign will translate this budget into clear, ward-level policy targets, demonstrating how an expert economist will optimize public resource allocation across the 40 wards.

### 2.8.3 The three regions

Kitui is not a monolith. Its eight constituencies and 18 sub-counties have
distinct economic bases, infrastructure needs and political histories. Digital
and SMS messaging is calibrated to each.

```figure
id: fig-3-7-zones
```

```visual
kind: tabs
preset: zone
items:
  - title: "The urban and central anchor: Kitui Central and Kitui West"
    body: "| Sub-County | Population | Density/km² | Households | Strategic value |\n|---|---|---|---|---|\n| Kitui Central | {{sub.kitui-central.population}} | {{sub.kitui-central.density}} | {{sub.kitui-central.households}} | Highest density; Dr. Mulu's home base |\n| Kitui West | {{sub.kitui-west.population}} | {{sub.kitui-west.density}} | {{sub.kitui-west.households}} | High density; contiguous |\n| Katulani | {{sub.katulani.population}} | {{sub.katulani.density}} | {{sub.katulani.households}} | Dense peri-urban |\n| **Total** | **{{zone.anchor.population}}** | — | **{{zone.anchor.households}}** | **{{zone.anchor.share}}% of county population** |\n\nKitui Central leads the county in registered voter density and is Dr. Mulu's\nhome base and highest-literacy zone — {{con.kitui-central}} registered voters in 2022 across\nfive wards (Township {{ward.township}}; Kyangwithya West {{ward.kyangwithya-west}}; Kyangwithya East {{ward.kyangwithya-east}};\nMulango {{ward.mulango}}; Miambani {{ward.miambani}}).\n\nMessaging here emphasises track record, professional competence and national\nreputation. **This base must be mobilised early and intensely — it is the only\nzone where Dr. Mulu starts with a structural advantage, and in a\ncountywide nomination contest, consolidating a base is cheaper than converting a\nstranger.**"
  - title: "The northern block: Mwingi"
    body: "| Sub-County | Population | Density/km² | Households | Key issues |\n|---|---|---|---|---|\n| Mwingi Central | {{sub.mwingi-central.population}} | 95 | {{sub.mwingi-central.households}} | Economic hub for the north |\n| Kyuso | {{sub.kyuso.population}} | 30 | {{sub.kyuso.households}} | Arid, livestock-focused |\n| Mumoni | {{sub.mumoni.population}} | 48 | {{sub.mumoni.households}} | Semi-arid agriculture |\n| Tseikuru | {{sub.tseikuru.population}} | 30 | {{sub.tseikuru.households}} | Pastoral/agricultural mix |\n| **Total** | **{{zone.mwingi.population}}** | — | **{{zone.mwingi.households}}** | **{{zone.mwingi.share}}% of county population** |\n\nBalancing representation between \"Kitui Proper\" and \"Mwingi\" is critical.\nMessaging must assure northern voters that devolved funds will be distributed\nequitably per ward without regional bias — a commitment Dr. Mulu can make more\ncredibly than any rival precisely because he can publish the allocation\nmethodology and then evaluate against it.\n\n**Nomination-window priority.** This zone represents nearly a quarter of the\ncounty and is where a Kitui Central MP is structurally least known. It carries\ndisproportionate Phase −1 weighting of effort and reach."
  - title: "The arid and resource belt: Kitui South and East"
    body: "| Sub-County | Population | Density/km² | Households | Characteristics |\n|---|---|---|---|---|\n| Mutomo | {{sub.mutomo.population}} | 40 | {{sub.mutomo.households}} | Largest population; arid |\n| Ikutha | {{sub.ikutha.population}} | 9 | {{sub.ikutha.households}} | Extremely low density; vast |\n| Mwingi East | {{sub.mwingi-east.population}} | 25 | {{sub.mwingi-east.households}} | Resource extraction potential |\n| Mutitu | {{sub.mutitu.population}} | 12 | {{sub.mutitu.households}} | Sparse; pastoral |\n| Migwani | {{sub.migwani.population}} | {{sub.migwani.density}} | {{sub.migwani.households}} | Higher density; market centre |\n| **Total** | **{{zone.arid.population}}** | — | **{{zone.arid.households}}** | **{{zone.arid.share}}% of county population** |\n\nOver a third of the county, at an average of 19 persons per square kilometre.\nFraming centres on transformative infrastructure — water pipelines, road\nnetworks, and responsible management of mineral resource wealth for local\nbenefit.\n\n**This is where the connectivity gap bites hardest and where SMS/USSD (Section\n4.3 [CHECK REF]) does the heavy lifting.** Digital-only reach into Ikutha at 9 persons/km²\nis not a strategy; it is an assumption. Mapped against the 2022 baseline register,\nregistered voters in Kitui South total {{con.kitui-south}}, distributed across six wards: Athi ({{ward.athi}}),\nIkanga/Kyatune ({{ward.ikanga-kyatune}}), Mutomo/Kibwea ({{ward.mutomo}}), Ikutha ({{ward.ikutha}}), Mutha ({{ward.mutha}}), and Kanziko ({{ward.kanziko}})."
body: "**A note on the names in this table.** These are *administrative sub-counties*, which do not\nmap one-to-one onto the eight constituencies used for the ward register in Section 2.1.\nMigwani and Mwingi East appear here, while Migwani **Ward** sits in Mwingi West constituency\nin the northern bloc — the two are different units with the same name. Anyone reading the\nzone tables against the ward register should treat the constituency figures in 3.3.3 [CHECK REF] as\nauthoritative for targeting, and these as demographic context only."
```

## 2.9 How voters get information, and what each channel can reach

### 2.9.1 How people get information

```visual
kind: stats
title: "The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced)"
items:
  - value: "{{ict.internet}}%"
    label: "use the internet"
    tier: 1
  - value: "{{ict.offline}}%"
    label: "of residents offline"
    tier: 1
  - value: "{{ict.phone}}%"
    label: "own a mobile phone"
    tier: 1
  - value: "{{ict.agents}}"
    label: "mobile-money agents"
    tier: 1
    body: "The **{{ict.agents}} mobile-money agent network** (representing a rapid expansion from {{ict.agents.2025}} in late 2025, Tier 1) is a vital offline asset. These agents represent trusted, commercially motivated local touchpoints in settlements where broadband access is unavailable."
body: "According to the **2023/24 Kenya Continuous Household Survey & Communications Authority reports** (Tier 1), Kitui County has an active internet penetration rate of **{{ict.internet}}%** (up from {{ict.internet.2019}}% in the 2019 KNBS Census), leaving **{{ict.offline}}% of the population offline**. Mobile phone ownership stands at **{{ict.phone}}%** (up from {{ict.phone.2019}}% in 2019)."
```

| Connectivity Metric | Current Sourced Value (2023/24) | 2019 Historical Baseline | Sourced National Context |
|---|---|---|---|
| Mobile Device Ownership | **{{ict.phone}}%** of residents (CA/KNBS 2023/24) (Tier 1) | {{ict.phone.2019.people}} individuals ({{ict.phone.2019}}%) (Tier 1) | 84.1 million active SIM cards; {{ict.sim-penetration}}% penetration (CA, Q3 FY2025/26) |
| Active Internet Usage | **{{ict.internet}}%** ({{ict.offline}}% offline majority) (Tier 1) | {{ict.internet.2019.people}} individuals ({{ict.internet.2019}}%) (Tier 1) | 62.6 million mobile broadband subscriptions (Tier 1) |
| Core Device Profile | Feature-phone and USSD-compatible devices dominant | Feature-phone dominance (Tier 1) | Smartphones are {{ict.smartphone-share}}% of active SIMs nationally (50.2 million of 84.1 million, CA Q3 FY2025/26, Tier 2); a national rate, which overstates Kitui |
| Mobile Financial Services | Near-universal reliance on mobile transactions | Dominant mobile-money footprint | 53.4 million subscriptions ({{ict.momo-penetration}}%); **{{ict.agents}} registered agents** (March 2026) |

```figure
id: fig-2-6-connectivity
```

#### Platform Sizing & Realistic In-County Reach

The digital footprint in Kitui County is concentrated in urban nodes (Kitui Town, Mwingi Town, Kwa Vonza university corridor) and among educated youth. In-county active users per platform are not published; Section 2.9.3 sizes what digital can reach from the published rates alone.

### 2.9.2 Who owns the airwaves

```lead
**The highest-reach commercial radio stations broadcasting in Kikamba are owned, financed, or editorially steered by active political rivals or entrenched party gatekeepers.** The ownership map and posture for every station are set out once, in **Section 4.5.6**.
```

Vernacular radio is the primary medium of political consciousness and daily news in rural and peri-urban Kitui County. However, the media environment in Eastern Kenya is characterized by severe political concentration: **the highest-reach commercial radio stations broadcasting in Kikamba are owned, financed, or editorially steered by active political rivals or entrenched party gatekeepers**.

To ensure uninterrupted, high-credibility communication with the electorate, the campaign constructs a dual strategy: a disciplined operational engagement model for Tier 1 commercial networks, coupled with an aggressive bypass architecture detailed in **Section 4.5.6**.

```figure
id: fig-2-7-media
```

The ownership map, the frequencies and the resulting campaign posture for every
Kikamba-language station are set out once, in **Section 4.5.6**, and that table
governs. It is the version reconciled against `data/media-ownership.ts`, which
the site renders directly.

> **Research Integrity Note on Listenership Data:**  
> The published audience share is regional: the CA/KARF report for **Lower Eastern** (Kitui, Machakos and Makueni together) puts Musyi FM at {{radio.musyi}}%, Athiani FM at {{radio.athiani}}%, Mbaitu FM at {{radio.mbaitu}}% and County FM at {{radio.county}}% of listeners (Tier 2, an earlier measurement). It ranks the stations; it does not size Kitui's own audience.

```visual
kind: checklist
title: "The three structural facts that drive the rest of this section"
items:
  - label: "**Two stations are associated with Charity Ngilu**, a declared general-election rival:"
    text: "**Mbaitu FM** and **Syokimau FM**. Both are monitoring targets, not placement targets."
  - label: "**One station is associated with Kalonzo Musyoka**, the Wiper party leader:"
    text: "**Athiani FM**. It is party-sensitive rather than hostile, and it matters most during the nomination window, when coverage may track party leadership sentiment rather than merit."
  - label: "**The stations open to the campaign are commercially or institutionally independent**:"
    text: "**Musyi FM** (Royal Media Services), **County FM** (Kitui-based independent) and **Wikwatyo FM** (Seventh-Day Adventist Church, Kitui). These are the placement targets. [CONFLICT C7: see open items]"
```

Ownership associations are publicly reported rather than certified, and media
ownership changes. The certifiable records are the Communications Authority's register
of broadcast licensees and the Business Registration Service's company records; the map
is checked against both before any placement is booked (Section 4.5.6).

### 2.9.3 What each channel can physically reach

```lead
If the campaign reached 100% of every internet-connected voter in Kitui County, it would reach about **{{reach.smartphone}} voters** (modelled), and even if every one of them voted for him he would be **{{reach.smartphone.short}} votes short** of the {{benchmark}} benchmark.
```

According to the official **CA/KNBS ICT report on the 2023/24 Kenya Housing Survey** (Tier 1), **{{ict.internet}}% of Kitui's population uses the internet** (up from {{ict.internet.2019}}% in the 2019 KNBS Census), while **{{ict.offline}}% of the population resides in an offline media environment**, with mobile phone ownership at **{{ict.phone}}%**.

```figure
id: fig-3-8-ceiling
```

> [!CRITICAL]
> **STRATEGIC REALITY CHECK: THE DIGITAL CEILING**
>
> If the campaign reached **100% of every internet-connected voter in Kitui County**, it would reach about **{{reach.smartphone}} voters** (modelled: {{ict.internet}}% internet use applied to the July 2026 register). Reach is not votes, and even if every one of them voted for him he would be **{{reach.smartphone.short}} votes short** of the {{benchmark}} benchmark.
>
> Therefore, digital channels alone **cannot mathematically win this election**. Victory depends on dominating the offline media and field infrastructure (Section 4.5.9), while using digital channels (Section 4.5.8) with surgical precision to shape elite opinion, organize youth volunteers, and mobilize the out-of-county diaspora.

```visual
kind: contrast
left:
  title: "What digital can do"
  items:
    - label: "Elite Agenda Setting & Narrative Defense"
      body: "The working premise is that local radio producers, vernacular talk-show hosts, church leaders and county assembly members follow X and Facebook, so rapid response there can shape what radio goes on to discuss. No source in this proposal measures that link or its timing; the war room's monitoring log (Section 6.2.4) records it from the first month rather than assuming it."
    - label: "Youth Mobilization & Field Volunteer Recruitment"
      body: "Engaging the ~{{segment.youth.voters}} youth cohort via TikTok and WhatsApp generates high-energy field activists who operate the ground logistics and serve as polling agents."
    - label: "Efficient Micro-Targeting of Urban MSMEs"
      body: "Hyper-geofencing commercial centers (Kitui CBD, Mwingi Central) allows testing policy messages (\"The Economist's Single Business Permit\") with minimal waste."
right:
  title: "What digital cannot do"
  items:
    - label: "It Cannot Deliver the {{benchmark}} Vote Benchmark Alone"
      body: "Capped at about {{reach.smartphone}} reachable voters inside Kitui County (modelled)."
    - label: "It Cannot Penetrate the Rural Agrarian Base"
      body: "{{ict.offline}}% of Kitui's residents are offline (CA/KNBS 2023/24), and the rural smallholder majority does not meet political content through social algorithms: few smartphones, high data costs, and weak 3G/4G coverage in rural wards (e.g., Tharaka, Tseikuru, Voo/Kyamatu, Endau, Mutha)."
    - label: "It Cannot Counteract Ground Rumors Directly"
      body: "WhatsApp and Facebook echo chambers rarely cross over into dryland farming communities without physical intermediaries."
```

### 2.9.4 The offline majority, and the infrastructure that reaches it

```lead
The election will be won or lost across the **{{reach.offline}} registered voters not reachable online** (modelled: the July 2026 register less the {{reach.smartphone}} reachable by smartphone or data).
```


The election will be won or lost across the **{{reach.offline}} registered voters not reachable online** (modelled: the July 2026 register less the {{reach.smartphone}} reachable by smartphone or data). Reaching this electorate requires an orchestrated combination of telecommunications protocol channels (SMS/USSD), broadcast audio (vernacular radio), financial agent touchpoints, and dense physical market presence.

```visual
kind: cards
preset: channel
items:
  - title: "Kikamba Vernacular Radio (The Decisive Broadcast Medium)"
    fields:
      - { label: "Reach", text: "the CA/KARF audience report for Lower Eastern (Kitui, Machakos and Makueni together) puts Musyi FM at {{radio.musyi}}% of listeners, Citizen Radio {{radio.citizen}}%, Athiani FM {{radio.athiani}}%, Mbaitu FM {{radio.mbaitu}}%, County FM {{radio.county}}% and Mwatu FM {{radio.mwatu}}% (Tier 2). It is a regional and an earlier measurement, so it ranks the stations rather than sizing Kitui's audience. [CONFLICT C7: see open items]" }
      - { label: "Station Hierarchy & Reach", text: "*   *Musyi FM (Royal Media Services):* Dominant market leader in Ukambani; commercially independent. **Priority placement.**\n    *   *County FM (Kitui-based independent):* Local ward news and debates, strong in Kitui Town, Kabati and Kwa Vonza. **Priority placement.**\n    *   *Wikwatyo FM (Seventh-Day Adventist Church, Kitui):* Broad rural community trust. **Priority for community and service-delivery programming.**\n    *   *Mbaitu FM, Syokimau FM (Ngilu-associated) and Athiani FM (Wiper leadership):* **monitoring targets, not placement targets** — see Section 4.5.6 for the ownership map and the posture each one carries." }
      - { label: null, text: "**What the campaign would run** (campaign-owned, outside this engagement, Section 1.4.3):\n*   *Prime-Time Strategic Bookings:* Secure weekly 2-hour interactive morning studio interviews (06:30–08:30) with Dr. Mulu during key policy rollout weeks.\n    *   *Kikamba Voice Jingles & Audio Testimonials:* 45-second micro-stories featuring real farmers from Mwingi North, Kitui South, and Kitui Rural explaining how Dr. Mulu's economic model protects their harvest prices.\n    *   *Live Event Feeds:* Sponsoring live outside broadcasting (OB) vans at major market rallies in Kalundu, Kabati, and Mutomo." }
  - title: "Direct 2G Bulk SMS & USSD Service"
    head: { label: "Reach", text: "mobile phone ownership is {{ict.phone}}% of residents countywide (CA/KNBS 2023/24, Tier 1); a feature phone is enough for SMS and USSD." }
    fields:
      - { label: null, text: "**What Firefly operates** (Section 4.5.9):\n*   *Zero-Rated USSD Portal (`*[shortcode]#`):* Allows feature phone users to dial a free code to read Dr. Mulu's 5-point manifesto in Kikamba, register as a volunteer, or locate their nearest Ward Captain.\n    *   *Hyper-Localised Bulk SMS:* Dispatching customised **Kiswahili** messages to consented supporters within specific wards on the eve of market days and on election morning for Get-Out-The-Vote (GOTV) mobilisation." }
  - title: "Mobile-Money (M-Pesa) Agent Network Strategy"
    head: { label: "Reach", text: "nationally there are {{ict.agents}} registered agents (March 2026, Tier 1, Section 2.9.1)." }
    fields:
      - { label: null, text: "**What the campaign would run** (campaign-owned, outside this engagement, Section 1.4.3):\n*   M-Pesa agents are trusted community hubs where residents deposit funds, buy airtime, and discuss local news. **Agent networks are regulated financial infrastructure**; Section 4.5.9 flags that any commercial arrangement with them must be reviewed by campaign counsel before recruitment begins. The ambassador network is untiered and needs a source.\n    *   The campaign will recruit {{target.ambassadors}}+ shopkeepers and M-Pesa agents as \"Economic Ambassadors,\" providing them with branded business ledgers, counter pens, calendar posters, and daily economic talking points." }
  - title: "Open-Air Market Day Barazas & Caravan Circuits"
    head: { label: "Reach", text: "for scale only: the 2023 Kitui Agricultural Show drew more than {{show.2023}} people over three days (Tier 3), and market days are gazetted by market. Neither is a market-day count." }
    fields:
      - { label: null, text: "**What the campaign would run** (campaign-owned, outside this engagement, Section 1.4.3): Deploying two high-output mobile sound trucks (*The Mulu Economic Caravans*) equipped with live PA systems, Kikamba music, and local youth speakers to dominate market entrances on their designated days." }
  - title: "Church Fellowships & Clergy Engagement"
    head: { label: "Reach", text: "denominations present: Catholic, AIC, Redeemed Gospel, Anglican and Baptist. The Catholic Diocese of Kitui alone counts over {{church.catholic}} baptised members (Tier 3), a floor for one denomination rather than attendance." }
    fields:
      - { label: null, text: "**What the campaign would run** (campaign-owned, outside this engagement, Section 1.4.3): Sunday morning worship visits across all 8 constituencies, respecting liturgical decorum, requesting pastoral prayers, and engaging parish development committees post-service." }
```

```visual
kind: week
title: "Market Rotation Map"
items:
  - day: "Mondays"
    items:
      - { label: "Nguni Livestock Market (Mwingi Central)" }
      - { label: "Kabati (Kitui West)" }
  - day: "Tuesdays"
    items:
      - { label: "Kalundu Market (Kitui Central)" }
      - { label: "Tseikuru (Mwingi North)" }
  - day: "Wednesdays"
    items:
      - { label: "Mbondoni (Mwingi West)" }
      - { label: "Mutomo (Kitui South)" }
  - day: "Thursdays"
    items:
      - { label: "Chuluni (Kitui East)" }
      - { label: "Kyuso (Mwingi North)" }
  - day: "Fridays"
    items:
      - { label: "Kisasi (Kitui Rural)" }
      - { label: "Migwani (Mwingi West)" }
  - day: "Saturdays"
    items:
      - { label: "Kitui Town Central Market" }
      - { label: "Mwingi Town Main Market" }
```

## 2.10 His record and his channels today

### 2.10.1 Dr. Mulu's public record

```lead
Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS, has represented Kitui Central in the National Assembly since 2013 (Tier 1). He is a member of the Budget and Appropriations Committee (Tier 1), the committee that scrutinises the national estimates.
```

Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS, has represented Kitui Central in the National Assembly since 2013 (Tier 1). He is a member of the Budget and Appropriations Committee (Tier 1), the committee that scrutinises the national estimates. Whether he has held a leadership position on it is confirmed from the National Assembly's committee membership records and Hansard; until it is, this proposal describes him as a member. The record below is what the public-finance message rests on, and each line names the document behind it.

```figure
id: fig-2-8-record
```

<!-- keep -->
| Asset | Sourced Empirical Evidence | Strategic Digital Application |
|---|---|---|
| Macroeconomic Leadership | PhD (Economics) (Tier 1); Budget and Appropriations Committee membership (Tier 1; any leadership role to be confirmed from the National Assembly's committee records) | Weekly "Dr. Mulu on Public Finance" explainer series |
| **Monitoring & Evaluation Expertise** | Certified Consultant in Project Management & M&E (Tier 1); Member, Evaluation Society of Kenya (ESK) (Tier 1); **Designated M&E Champion by the Ministry of Finance** (Tier 1; the issuing letter or notice is to be cited) | Launch of the interactive service-delivery tracker (Section 4.5.1) |
| International Executive Standing | United Nations — Project Management and Financial Advisory Roles (Tier 1) | Professional and diaspora network engagement and credibility |
| Legislative Delivery Record | KSh 47 million in educational bursaries allocated directly to {{record.bursary.recipients}} constituents (Tier 1); **Kitui Central certified as the best-evaluated constituency in the Eastern region, FY2014/15** (ranking first out of 71 constituencies in its national peer group) (Tier 1; the evaluating body's report is to be cited, see Section 3.1.1) | Micro-targeted, ward-level visual proof points |
| Administrative Longevity | 17 years in active political leadership, 13 years as Member of Parliament for Kitui Central (Tier 1); Commander of the Order of the Burning Spear (CBS) (Tier 1; the Kenya Gazette notice of the award is to be cited) | Steady, low-risk leadership framing contrasted with less-experienced candidates |
| Existing Web Footprint | Active, established Kitui Central NG-CDF digital portal (Tier 1) | Integration and leveraging of existing assets to avoid duplicated effort |

**The NG-CDF record, and its limits.** The constituency's NG-CDF site publishes project records,
proposals, allocations and Project Implementation Status reports across its five wards: Mulango,
Kyangwithya East, Kyangwithya West, Township and Miambani. The FY2026/27 allocation is
**KSh {{ngcdf.allocation.2026}}** (Tier 1). A project is described as completed only where its
implementation-status report says so.

### 2.10.2 His channels today, and his rivals'

```figure
id: fig-2-9-channels
```

**The NG-CDF site is the most under-used asset in this list.** It is a public, constituency-run
record of completed projects, and Pillar 1 exists to put exactly that record in front of voters who
have never heard of him. Note the boundary in Section 5.3.2: the **project record** is usable;
the **beneficiary personal data** behind it is not.

### 2.10.3 What his current presence shows

These come from the profile as displayed, and finding them took an afternoon. They are findings here
because a brief written over a profile that contradicts the parliamentary record inherits the
contradiction. The corrections are strategy, and are in Section 4.2.3.

```figure
id: fig-3-9-audit
```

```visual
kind: cards
preset: audit
title: "What the audit produces"
note: "Four figures and a two-page note. Not a report."
items:
  - title: "The reach map against the vote map"
    text: "reach by ward beside register share by ward, and the difference between them."
    badge: "set in Week 1"
  - title: "Ninety days, coded"
    text: "every day in the window, coloured by content pillar, sized by reach."
    badge: "set in Week 1"
  - title: "Which language travels"
    text: "engagement rate by post language."
    badge: "set in Week 1"
  - title: "Him against the field"
    text: "posts per week, median shares per post, and ads live, for him and the two nomination rivals named in Section 2.6."
    badge: "set in Week 1"
```

Each is drawn from the Week 1 export, never from an estimate: until the export lands, the figure
states that it is set in Week 1.

## 2.11 What the data can't yet tell us

In strict adherence to the campaign's data provenance standards, the analytical team explicitly marks empirical data gaps rather than interpolating unverified statistics:

1.  **Ward-level voter preference:** **Not measured, and not sought.** This proposal forms strategy from existing records and its own analysis only. The nearest official record is how each ward actually voted: the IEBC's ward and polling-station forms for 2017 and 2022 (Section 2.2), which the analysis uses as soon as they are in hand. Until then the analysis works from where he has held office.
2.  **Historical 2013 Gubernatorial Ward-by-Ward Certified Returns:** **Named Data Gap (Tier 1 Gap).** Official IEBC ward-by-ward certified return sheets for the 2013 gubernatorial race are not contained in the campaign's certified baseline archives.
3.  **Historical 2017 Gubernatorial Ward-by-Ward Tallies:** **Named Data Gap (Tier 1 Gap).** While the countywide certified totals are established (Ngilu {{result.2017.gov.ngilu}} vs. Musila {{result.2017.gov.musila}} vs. Malombe {{result.2017.gov.malombe}}, Tier 1), individual ward breakdown sheets are treated as unverified pending physical retrieval from the IEBC registry.

```figure
id: fig-3-10-gaps
```

---

Three segment sizes in Section 3.4 are not published by any official source: the agro-pastoral, the formal-sector and the diaspora voter counts. Section 3.4 gives the census context for each; none is estimated, and each stays unsized until an official source publishes it.

## 2.12 The diagnosis, and the evidence that could overturn it

```visual
kind: hypothesis
hypothesis: "Dr. Mulu's gap is substantially a **geography-of-recognition** problem concentrated outside Kitui Central, not a deficit of leadership credibility, and recognition is the most addressable kind of gap, through targeted digital output and SMS/USSD outreach. Phase −1 is built to close it."
for: "{{pool.share}}% of the register lives in the four constituencies where he has never held office (Section 2.7). Five of the twelve largest wards are among them (Section 2.7). Two constituencies, Kitui East and Kitui South, will not carry party flow (Section 2.7.2)."
against: "Dr. Kasalu won the 2022 Woman Representative race with **{{result.2022.womanrep.kasalu}} votes**, more than the **{{result.2022.gov.malombe}}** that won the governorship the same year (Section 2.2). She has already shown countywide vote-getting capacity above the benchmark. That is not the profile of a candidate leading on passive name recognition alone."
test: "Week 1 tests the hypothesis against Dr. Mulu's own channel data before anything is committed against it. If his reach is already landing in Mwingi and failing to convert, the problem is message rather than reach, and the response changes: Section 3.8 sets out, in advance, what each finding changes."
body: "That test is not a formality; it is the first deliverable."
```

```figure
id: fig-3-11-evidence
```
