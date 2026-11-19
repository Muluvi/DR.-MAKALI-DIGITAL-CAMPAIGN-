```lead
Kitui has **{{register.2022}}** registered voters on the 2022 register, and Governor Malombe won in 2022 with **{{result.2022.gov.malombe}}** votes. The number to win is about **{{benchmark}}**, and no single region holds it.
```

Kitui has **{{register.2022}}** registered voters on the 2022 register, and Governor Malombe won in 2022 with **{{result.2022.gov.malombe}}** votes (Tier 1, IEBC). The number to win is about **{{benchmark}}** (target), and no single region holds it. This chapter sets out the electorate, how it has voted, where the votes are, and the arithmetic of winning.

## 2.1 The electorate and polling stations

```visual
kind: stats
items:
  - value: "{{register.2022}}"
    label: "registered voters, 2022"
    tier: 1
    body: "**{{register.2022}}** voters registered in wards, plus **{{register.2022.prisons}}** registered in prisons: **{{register.2022.with-prisons}}** in all (Tier 1, IEBC)."
  - value: "40"
    label: "wards across 8 constituencies"
    tier: 1
    body: "40 county assembly wards in eight constituencies (Tier 1, IEBC)."
  - value: "{{register.polling-stations}}"
    label: "polling stations"
    tier: 1
    body: "{{register.polling-stations}} polling stations (Tier 1, IEBC 2022 polling station register)."
  - value: "{{register.2026}}"
    label: "registered, July 2026"
    tier: 3
    body: "**{{register.2026}}** registered voters in July 2026 (Tier 3, reported by Venas News; unconfirmed until IEBC's own July 2026 figure is in hand). Of the **{{register.2026.growth}}** added since 2022 (Tier 3, unconfirmed), **{{register.2026.ecvr-drive}}** registered in ECVR Phase 1 (Tier 1, IEBC), the 30-day drive that closed on 28 April 2026, and **{{register.2026.continuous}}** through continuous registration outside it (modelled: the growth less the drive). A second ECVR phase ran from 25 June to 25 July 2026 (IEBC gazette notice, 24 June 2026); whether the July figure includes it is not stated, so the remainder may carry some of it. The 2026 register is not yet published by ward."
  - value: "{{turnout.2022}}%"
    label: "turnout, 2022"
    tier: 1
    body: "**{{turnout.2022}}%** certified: {{result.2022.gov.valid}} valid votes for governor, of {{register.2022}} registered (Tier 1, IEBC Form 37C). Chapter 2 carries this rate forward to 2027 as a stated assumption."
```

```figure
id: fig-2-1-register
```

**Which turnout.** Two turnout figures are in circulation, on different bases, and this plan says which it uses. **{{turnout.2022}}%** is governor valid votes ({{result.2022.gov.valid}}) divided by the register (Tier 1, IEBC Form 37C). The presidential turnout in Kitui was about **{{result.2022.pres.turnout}}%**, and it includes {{result.2022.pres.rejected}} rejected ballots (Tier 2, Equal Politics aggregation of IEBC results). Every calculation in this plan uses {{turnout.2022}}%.

The full 40-ward register, by constituency, is in Annex B.

## 2.2 Results from 2013 to 2022

```lead
Julius Malombe won 2022 with **{{result.2022.gov.malombe}} votes** on a certified turnout of **{{turnout.2022}}%** (Tier 1, IEBC Form 37C); Charity Ngilu won 2017 with **{{result.2017.gov.ngilu}} votes** (Tier 1).
```

*   **Governor, 2013:** a **named data gap** (Tier 1 gap). No certified result is in hand, and the plan does not use recollection in its place. The record that closes it is the IEBC's 2013 declaration and its Kenya Gazette notice.
*   **Governor, 2017:** Charity Ngilu (NARC) won with **{{result.2017.gov.ngilu}} votes** (Tier 1), in an election the Court of Appeal confirmed (*Malombe v Ngilu* [2018] KECA 460) (Tier 1). David Musila was the certified runner-up with **{{result.2017.gov.musila}} votes** (Tier 1), and the incumbent, Julius Malombe, came third with **{{result.2017.gov.malombe}} votes** (Tier 1).
*   **Governor, 2022:** Julius Malombe (Wiper Democratic Movement, renamed the Wiper Patriotic Front in 2025) won with **{{result.2022.gov.malombe}} votes** on a certified turnout of **{{turnout.2022}}%**, {{result.2022.gov.valid}} valid votes of {{register.2022}} registered (Tier 1, IEBC Form 37C). David Musila (Jubilee) was runner-up with **{{result.2022.gov.musila}} votes** (Tier 1); The Star's early total of {{result.2022.gov.musila.media}} is a media variant, and the certified share ({{result.2022.gov.musila.share}}%, calculated) matches {{result.2022.gov.musila}}. Jonathan Mueke (UDA) came third with **{{result.2022.gov.mueke}} votes** (Tier 2).
*   **President, 2022 (Kitui):** Raila Odinga won **{{result.2022.pres.odinga}}** votes (**{{result.2022.pres.odinga.share}}%**) and William Ruto **{{result.2022.pres.ruto}}** (**{{result.2022.pres.ruto.share}}%**); George Wajackoyah won {{result.2022.pres.wajackoyah}} and David Mwaure {{result.2022.pres.mwaure}}, with {{result.2022.pres.rejected}} ballots rejected (Tier 2, Equal Politics aggregation of IEBC results). The Tier 1 record is IEBC Forms 34B and 34C, not yet in hand.
*   **Kitui Central MP, 2022:** Dr. Makali Mulu was re-elected on the Wiper ticket with **{{result.2022.mp.mulu}} votes** (Tier 1, IEBC declaration as gazetted); Boniface Musambi was second with {{result.2022.mp.musambi}}. Early media totals differ from the gazetted figure and are not used. The figure reached this plan through a press reproduction of the declaration; the Kenya Gazette notice itself is the record to hold.
*   **Senator and Woman Representative, 2022:** Senator Enoch Wambua (Wiper) won with **{{result.2022.senate.wambua}} votes** (Tier 2), and Woman Representative Irene Kasalu (Wiper) with **{{result.2022.womanrep.kasalu}} votes** (Tier 2). Both totals are media reports. The certified declarations (IEBC Form 38C for the Senate, Form 39C for the Woman Representative) are the Tier 1 record and are not yet in hand; until they are, both figures stay Tier 2.
*   **Ward and polling-station results:** the constituency and polling-station forms for the 2017 and 2022 governor races (IEBC Forms 37B and 37A) are public records, not yet in hand. Section 6.2 needs them to test where each candidate's vote came from, ward by ward.

```figure
id: fig-2-2-results
```

**What it means for the campaign.** Kitui voted for the opposition presidential ticket by more than two to one in 2022, and for Wiper candidates in every countywide race.

## 2.3 The twelve largest wards

The register is concentrated. Spread evenly, the 40 wards would hold {{register.2022.ward-mean}} voters each (calculated); in fact voters cluster in urban corridors, farming belts and sub-county headquarters.

```figure
id: fig-3-2-register-map
```

```visual
kind: stats
preset: battery
title: "Where the votes concentrate"
items:
  - value: "{{pareto.top12.share}}%"
    label: "of the register in the 12 largest wards"
    tier: 1
    body: "**Twelve wards, 30% of the total, hold {{pareto.top12}} registered voters** ({{pareto.top12.share}}% of the county, calculated from IEBC's 2022 register). That is as many registered voters as the 2022 winning tally, but registration is not turnout: at the {{turnout.constant}}% turnout rate they cast about **{{path.c.ballots}} ballots** (calculated)."
  - value: "{{pareto.top20.share}}%"
    label: "in the largest 20"
    tier: 1
    body: "**The largest 20 wards**, half the total, hold **{{pareto.top20}} registered voters** (**{{pareto.top20.share}}%** of the county, calculated)."
  - value: "{{pareto.bottom10.share}}%"
    label: "in the smallest 10"
    tier: 1
    body: "**The ten smallest wards** (from Mui down to Tharaka), a quarter of the total, hold **{{pareto.bottom10}} registered voters** (**{{pareto.bottom10.share}}%** of the register, calculated) across large areas that are slow and costly to cover on the ground."
```

```lead
This annex holds the 40-ward register: background the argument rests on rather than part of the argument.
```

This annex holds the 40-ward register: background the argument rests on rather than part of the argument. The audit record is now in Section 3.7, drought and food security in Section 3.2, and the Mui Basin in Section 3.8.

The register of every ward, with its voters and polling stations, is at the end of Evidence and sources.

## 2.4 The constituencies that decide it

```lead
Mwingi North, Mwingi West and Mwingi Central together command {{bloc.mwingi}} registered voters (Tier 1), roughly {{path.a.ballots}} ballots at the certified turnout. Mwingi is therefore **necessary and not sufficient**: no path to {{benchmark}} runs around it, and none ends there.
```

A constituency's weight comes from its voters, the density of its wards, and its role in past party nominations:

```figure
id: constituency-power
```

#### The Mwingi bloc: necessary, not sufficient

**Mwingi North, Mwingi West and Mwingi Central together command {{bloc.mwingi}} registered voters (Tier 1).** That is more *registered voters* than the 2022 winning tally ({{result.2022.gov.malombe}} votes, Tier 1), but registration is not turnout. At the certified {{turnout.2022}}% turnout the bloc casts roughly **{{path.a.ballots}} ballots**, so even every vote there leaves the campaign about {{path.a.margin|abs}} short of {{benchmark}} (calculated). Mwingi is therefore **necessary and not sufficient**: no path to {{benchmark}} runs around it, and none ends there. So SMS, USSD and digital outreach go into Mwingi first, to establish Dr. Mulu as the leading alternative there.

#### The four constituencies that decide it

1.  **The Big Four ({{big4.share}}% of the county):** Kitui Central, Kitui South, Mwingi Central and Mwingi North hold **{{big4}} registered voters** across 22 wards (calculated from IEBC's 2022 register, Tier 1). The candidate who leads in these four, or holds level in them, is in reach of the governorship.
2.  **Mwingi North ({{con.mwingi-north}} voters, Tier 1):** fourth by voters, but it holds the county's largest ward (**Kyuso, {{ward.kyuso}} voters**), the political home of the Wiper Patriotic Front leader, Hon. Kalonzo Musyoka (**Tseikuru, {{ward.tseikuru}} voters**), and **Mumoni ({{ward.mumoni}} voters)**, all Tier 1 (IEBC). It is both a large electorate and the party's heartland.
3.  **Kitui South ({{con.kitui-south}} voters):** the second-largest constituency, anchored by the dense wards of Athi ({{ward.athi}}) and Ikanga/Kyatune ({{ward.ikanga-kyatune}}).

## B.1 The 40-ward register

Registered voters per county assembly ward, 2022 (IEBC, Tier 1). The 2026 register is not yet published by ward.

#### 1. Mwingi North Constituency ({{con.mwingi-north}} total registered voters, Tier 1)

*   **Kyuso Ward:** {{ward.kyuso}} voters
*   **Tseikuru Ward:** {{ward.tseikuru}} voters
*   **Mumoni Ward:** {{ward.mumoni}} voters
*   **Ngomeni Ward:** {{ward.ngomeni}} voters
*   **Tharaka Ward:** {{ward.tharaka}} voters

#### 2. Mwingi West Constituency ({{con.mwingi-west}} total registered voters, Tier 1)

*   **Nguutani Ward:** {{ward.nguutani}} voters
*   **Kyome/Thaana Ward:** {{ward.kyome-thaana}} voters
*   **Migwani Ward:** {{ward.migwani}} voters
*   **Kiomo/Kyethani Ward:** {{ward.kiomo-kyethani}} voters

#### 3. Mwingi Central Constituency ({{con.mwingi-central}} total registered voters, Tier 1)

*   **Central Ward:** {{ward.central}} voters
*   **Nguni Ward:** {{ward.nguni}} voters
*   **Nuu Ward:** {{ward.nuu}} voters
*   **Kivou Ward:** {{ward.kivou}} voters
*   **Mui Ward:** {{ward.mui}} voters
*   **Waita Ward:** {{ward.waita}} voters

#### 4. Kitui West Constituency ({{con.kitui-west}} total registered voters, Tier 1)

*   **Mutonguni Ward:** {{ward.mutonguni}} voters
*   **Kauwi Ward:** {{ward.kauwi}} voters
*   **Matinyani Ward:** {{ward.matinyani}} voters
*   **Kwa Mutonga/Kithumula Ward:** {{ward.kwa-mutonga-kithumula}} voters

#### 5. Kitui Rural Constituency ({{con.kitui-rural}} total registered voters, Tier 1)

*   **Kwa Vonza/Yatta Ward:** {{ward.kwa-vonza-yatta}} voters
*   **Kisasi Ward:** {{ward.kisasi}} voters
*   **Mbitini Ward:** {{ward.mbitini}} voters
*   **Kanyangi Ward:** {{ward.kanyangi}} voters

#### 6. Kitui Central Constituency ({{con.kitui-central}} total registered voters, Tier 1)

*   **Township Ward:** {{ward.township}} voters
*   **Kyangwithya West Ward:** {{ward.kyangwithya-west}} voters
*   **Kyangwithya East Ward:** {{ward.kyangwithya-east}} voters
*   **Mulango Ward:** {{ward.mulango}} voters
*   **Miambani Ward:** {{ward.miambani}} voters

#### 7. Kitui East Constituency ({{con.kitui-east}} total registered voters, Tier 1)

*   **Zombe/Mwitika Ward:** {{ward.zombe-mwitika}} voters
*   **Chuluni Ward:** {{ward.chuluni}} voters
*   **Nzambani Ward:** {{ward.nzambani}} voters
*   **Voo/Kyamatu Ward:** {{ward.voo-kyamatu}} voters
*   **Mutito/Kaliku Ward:** {{ward.mutito-kaliku}} voters
*   **Endau/Malalani Ward:** {{ward.endau-malalani}} voters

#### 8. Kitui South Constituency ({{con.kitui-south}} total registered voters, Tier 1)

*   **Athi Ward:** {{ward.athi}} voters
*   **Ikanga/Kyatune Ward:** {{ward.ikanga-kyatune}} voters
*   **Mutomo Ward:** {{ward.mutomo}} voters
*   **Ikutha Ward:** {{ward.ikutha}} voters
*   **Mutha Ward:** {{ward.mutha}} voters
*   **Kanziko Ward:** {{ward.kanziko}} voters
