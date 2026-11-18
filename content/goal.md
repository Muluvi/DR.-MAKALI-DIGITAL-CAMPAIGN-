```lead
The goal is to win the general election on 10 August 2027, with at least **{{benchmark}} votes**.
```

The goal is to win the general election on 10 August 2027, with at least **{{benchmark}} votes**. Five objectives for the digital operation serve it, and every one traces to that result.

## 8.1 The goal and its deadline

```lead
The campaign works to one deadline: the general election on 10 August 2027. Being on the ballot comes first, and the Timeline tracks it as a milestone.
```

The campaign works to one deadline: the general election on 10 August 2027. Being on the ballot comes first, and the Timeline tracks it as a milestone. Every objective traces to delivering the ~{{benchmark}} vote threshold at the general election; digital measures that do not are left out ([why vanity metrics are left out](/#success-sec-18-4)).

```figure
id: fig-1-1-timeline
```

## 8.2 Five objectives

Each objective names its target, its owner, the finding it answers, its baseline, the strategy that serves it and the indicator that measures it.

```figure
id: fig-1-3-objectives
```

### 8.2.1 Be known where he is not yet known

```visual
kind: cards
preset: objective
items:
  - head: { label: "Target", text: "At least {{pool.share}}% of his reach landing in the pool, the pool's own share of the register, and a verified subscriber footprint across all 15 Mwingi wards and 6 Kitui South wards before the opening of the party nomination window." }
    chips: ["NW-01", "R-02"]
    text: "**Named Owner:** Director of Communications; the delivery ledger is the dispatch log on Firefly's platform."
    fields:
      - { label: "Traceability", text: "Nomination viability: name recognition and visible activity in northern Mwingi and the southern wards, where Hon. Dr. Benson Makali Mulu has been known mainly as the member for Kitui Central." }
      - { label: "Finding it answers", text: "{{pool.share}}% of the register, {{pool}} voters, lives in Mwingi and Kitui South, where he has never held office ([where he is known, and where not](/#known-sec-6-2))." }
      - { label: "Baseline", text: "set in Week 1, from his own Insights export. The hypothesis is that his reach concentrates in Kitui Central ([what the evidence says](/#diagnosis-sec-7-1)); Week 1 tests it." }
      - { label: "Served by", text: "[Where the effort goes](/#channels-sec-12-1) and [A week of publishing, before and after](/#week-sec-12-6) (what gets published)." }
      - { label: "Measured by", text: "NW-01 and R-02 ([how success will be judged](/#success-sec-18-1))." }
```

### 8.2.2 Turn his record into visible proof

```visual
kind: cards
preset: objective
items:
  - head: { label: "Target", text: "40 ward-specific briefs on his economic and devolved-governance record, distributed through local WhatsApp networks and audio digests." }
    chips: ["R-03"]
    text: "**Named Owner:** Policy and Communications Research Lead."
    fields:
      - { label: "Traceability", text: "Turns Dr. Mulu's 13-year parliamentary record ([the public record](/#record-sec-6-1): {{record.bursary.recipients}} bursary recipients, KSh 47m allocated, Kitui Central certified the best-evaluated constituency in the Eastern region, FY2014/15) into verifiable, shareable case studies set to the priorities of the dryland pastoral and farming zones." }
      - { label: "Finding it answers", text: "his distinguishing proof is his record ([the public record](/#record-sec-6-1))." }
      - { label: "Baseline", text: "His record is documented for Kitui Central, the only constituency he has represented ([the public record](/#record-sec-6-1)). Where content about it currently reaches is measured in Week 1." }
      - { label: "Served by", text: "[The central claim](/#position-sec-9-1) (the position) and the content type \"Where the money went\" ([one claim, three pillars, six themes](/#message-sec-10-1))." }
      - { label: "Measured by", text: "R-03, shares per 1,000 reached in the deficit wards ([how success will be judged](/#success-sec-18-1))." }
```

### 8.2.3 Reach voters the internet does not

```visual
kind: cards
preset: objective
items:
  - head: { label: "Target", text: "**{{target.sms}} active, verified SMS/USSD offline subscribers** across rural wards." }
    chips: ["NW-03", "R-04"]
    text: "**Named Owner:** Campaign Field Operations Lead, who operates the USSD/SMS dispatch and logs it on Firefly's platform."
    fields:
      - { label: "Traceability", text: "Answers the county's connectivity ceiling ({{ict.internet}}% internet use, {{ict.phone}}% mobile phone ownership, CA/KNBS 2023/24) with an offline channel the campaign owns." }
      - { label: "Finding it answers", text: "digital alone reaches about {{reach.smartphone}} voters at most, short of the {{benchmark}} benchmark ([what each channel can reach](/#news-sec-4-3))." }
      - { label: "Baseline", text: "No consented offline subscribers in a central campaign register today." }
      - { label: "Deadline", text: "30 June 2027." }
      - { label: "Served by", text: "[Which channel does which job](/#channels-sec-12-2) and Workstream 9 ([what your team operates: SMS, USSD and voice](/#workstreams-sec-15-3-3))." }
      - { label: "Measured by", text: "NW-03 and R-04 ([how success will be judged](/#success-sec-18-1))." }
```

### 8.2.4 Give every post a voter, ward and reason

```visual
kind: cards
preset: objective
items:
  - head: { label: "Target", text: "Every briefed post coded with segment, ward and pillar, checked in the Monday review." }
    chips: ["R-05"]
    text: "**Named Owner:** Database and Ground Mobilization Coordinator."
    fields:
      - { label: "Traceability", text: "Every post the weekly brief commissions names the voter segment it is for ([the six voter segments](/#voters-sec-11-2)), the ward it is aimed at ([the twelve largest wards](/#votes-sec-2-3)) and the content type that gives it a reason ([one claim, three pillars, six themes](/#message-sec-10-1))." }
      - { label: "Finding it answers", text: "his current output is a record of where he was, with no ward named outside Kitui Central and no ask ([A week of publishing, before and after](/#week-sec-12-6))." }
      - { label: "Baseline", text: "set in Week 1, from the post coding." }
      - { label: "Served by", text: "[The message](/#message-sec-10-1) to [Channels and language](/#channels-sec-12-1)." }
      - { label: "Measured by", text: "R-05 and the weekly post coding ([how the presence audit works](/#success-sec-18-5) and [how success will be judged](/#success-sec-18-1))." }
      - { label: "Campaign build target it supports", text: "**{{target.supporters}} registered, verified supporters** in the central database mapped across all {{register.polling-stations}} polling stations by 31 May 2027. The database is the campaign's own, outside Firefly's platform, which holds only its counts ([the data layer](/#workstreams-sec-15-4-1)); the recruitment is the campaign's." }
```

### 8.2.5 Hold the home base

```visual
kind: cards
preset: objective
items:
  - head: { label: "Target", text: "Reach and engagement in Kitui Central held at or above the Week 1 baseline while output weight moves to Mwingi and the arid belt." }
    text: "**Named Owner:** Kitui Central Constituency Campaign Committee."
    fields:
      - { label: "Traceability", text: "Avoids the home-belt trap (Path D, [the number it takes](/#winning-sec-2-5)) by holding Dr. Mulu's base in Kitui Central while its own MP succession plays out." }
      - { label: "Finding it answers", text: "Kitui Central will have its own MP succession contest through the same window ([where party loyalty will not carry him](/#known-sec-6-3))." }
      - { label: "Baseline", text: "{{con.kitui-central}} registered voters in Kitui Central. He was re-elected there in 2022 with {{result.2022.mp.mulu}} votes." }
      - { label: "Served by", text: "[Where the effort goes](/#channels-sec-12-1) (the anchor zone's weighting)." }
      - { label: "Measured by", text: "reach by constituency in the monthly performance report ([the deliverables schedule](/#receives-sec-21-2))." }
```
