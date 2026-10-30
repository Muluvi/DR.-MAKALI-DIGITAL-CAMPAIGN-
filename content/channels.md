#### Where the effort goes, and which channel does which job

## 12.1 Where the effort goes

```lead
Because **{{pool.share}}% of the county register sits where he has never held office** (Section 6.2), output and targeting are weighted accordingly.
```

#### The weighting, and the finding it answers

Because **{{pool.share}}% of the county register sits where he has never held office** (Section 6.2), the campaign cannot rely on organic spillover from Kitui Central. Output and targeting are weighted accordingly:

```visual
kind: stats
items:
  - value: "{{effort.digital.pool}}%"
    label: "of Phase −1 digital reach effort, in the pool"
    body: "**{{effort.digital.pool}}% of all Phase −1 digital reach effort (Meta, Google, YouTube)** must be geofenced exclusively to Mwingi North, Mwingi Central, Mwingi West, and Kitui South — the weighting is on output and targeting, measured by R-02 in Section 18.3."
  - value: "{{effort.sms.pool}}%"
    label: "of SMS/USSD onboarding, in the pool's 21 wards"
    body: "**{{effort.sms.pool}}% of the offline SMS/USSD onboarding effort** (Section 15.3.3) goes to the 21 wards of the pool: the 15 Mwingi wards and the 6 of Kitui South. The campaign's own ward-captain network ({{target.captains.pool}} of {{target.captains}} captains, recommended for the same wards) is campaign-owned and outside this engagement (Section 13.3)."
```

*   The "Economist Governor" messaging in these wards must emphasize countywide fiscal redistribution, showing how Dr. Mulu's public finance oversight will direct water and health infrastructure investment into rural wards like Kyuso, Tseikuru, Athi, and Mutha. Calling any ward neglected needs the county's development expenditure by ward, from the Controller of Budget's county budget implementation reports and the county's own budget documents; until that is in hand, the message names the ward and the need, not the neglect.

**Where the voters are, and where the need is most severe.** NDMA ranks Mwingi North first and Kitui South second of the eight sub-counties for food-insecurity severity, and Kitui Central eighth (July 2025, Tier 1; the full ranking is in Section 3.2). Its hotspot wards in the three most severe sub-counties include Kyuso, Tseikuru and Athi, three of the twelve largest wards (Section 2.3). The county's own scorecard now supplies part of the ward-level expenditure data this weighting needs: on its {{scorecard.itemised}} itemised projects the pool's four constituencies receive {{scorecard.pool.share}}% of constituency-attributed expenditure against {{pool.share}}% of the register, so the pool as a whole was not passed over and the proposal does not claim it was. The gap is Mwingi West, at KSh {{scorecard.mwingi-west.per-voter}} per registered voter against KSh {{scorecard.kitui-central.per-voter}} in Kitui Central (Section 3.7).
Effort and content allocation across zones, by phase.

```lead
**Until the six are assigned, the Phase −1 weighting governs only the three zones, and the six unassigned sub-counties receive the rotating share alone.** Assigning them is a Week 2 task for the strategy lead.
```

**Coverage note.** The three zones above total {{zones.population}} residents — **{{zones.share}}% of the county's
{{census.population}}**. They name 12 of the county's 18 sub-counties; the remaining six, about {{zones.excluded}}
residents, are not in any zone. The weightings below therefore distribute 100% of communications effort
across zones covering under four-fifths of the population. **Until the six are assigned, the
Phase −1 weighting governs only the three zones, and the six unassigned sub-counties receive
the rotating share alone.** Assigning them is a Week 2 task for the strategy lead, against the
Section 1.2 regions and the IEBC register, and the table is restated when it is done.

```figure
id: fig-4-2-effort
```

Phase −1 deliberately over-indexes on Mwingi and the arid belt relative to
population share, on the working hypothesis that his gap is one of recognition,
concentrated outside the home base (Section 7.1). If Week 1 refutes it, Section 12.7
sets out how the weighting changes. Weightings are reviewed monthly against
the reach data in Section 18.1 and reallocated.

## 12.2 Which channel does which job

```lead
The rebalancing target is the share of communications effort each domain should carry: {{channel.offline.rebalanced}}% offline and {{channel.digital.rebalanced}}% digital, re-read at each monthly review.
```

Because Section 4.3: digital alone reaches about {{reach.smartphone}} voters at most, short of the {{benchmark}} benchmark even if every one of them voted for him.

The table below is the **rebalancing target** — the direction of travel away from the
conventional pitch, argued from reach. It states the share of communications *effort* each
domain should carry: production time, team attention, weekly output and channel priority. It
is a statement of where the campaign's weight goes.

```figure
id: fig-4-6-channel-shift
```

```visual
kind: donut
items:
  - label: "Communications weight, offline"
    value: "{{channel.offline.rebalanced}}%"
    body: "radio {{channel.radio.rebalanced}}%, SMS {{channel.sms.rebalanced}}%, caravans {{channel.markets.rebalanced}}%, church {{channel.church.rebalanced}}%"
  - label: "Communications weight, digital"
    value: "{{channel.digital.rebalanced}}%"
```

**§12.2 in one view.**

| | Figure |
|---|---|
| Reachable by smartphone or data, in county | ~{{reach.smartphone}} voters (modelled: {{ict.internet}}% of the July 2026 register) |
| Share of the {{benchmark}} benchmark digital could reach | **{{reach.smartphone.of-benchmark}}%**, reach not votes |
| Reachable by SMS only | ~{{reach.sms-only}} voters (modelled: {{ict.phone}}% phone ownership less {{ict.internet}}% internet use) |
| Phone owners: the SMS and USSD layer | ~{{reach.phone.resident}} voters on the resident rate ({{ict.phone}}%); ~{{reach.phone.adult}} on the adult rate (KDHS 2022: {{ict.phone.adult}}%). Both modelled, never averaged (Section 4.3) |
| No phone: radio or in person only | ~{{reach.nophone}} voters on the resident rate; ~{{reach.nophone.adult}} on the adult rate (both modelled) |
| Vernacular radio reach | Lower Eastern shares: Musyi FM {{radio.musyi}}%, Athiani FM {{radio.athiani}}%, Mbaitu FM {{radio.mbaitu}}%, County FM {{radio.county}}% (CA/KARF, an earlier measurement, Tier 2). |

**The {{channel.offline.rebalanced}}/{{channel.digital.rebalanced}} weighting stands on the 2023/24 rate.** It was first set when digital reach was put at
{{ict.internet.2019}}% of residents (the 2019 census rate); on the 2023/24 rate of {{ict.internet}}% digital still reaches at most
{{reach.smartphone}} voters, {{reach.smartphone.short}} short of the {{benchmark}} benchmark (Section 4.3), so the case for an
offline-led mix is unchanged. The split is re-read at each monthly review against the reach data
in Section 18.1 (confirmed by Firefly, September 2026).

## 12.3 The gatekeeper bottleneck

The political economy of Kamba broadcasting presents three structural hazards for the campaign:

```visual
kind: cards
preset: hazard
items:
  - title: "Editorial Blackouts on Key Milestones"
    text: "High-profile developmental achievements (e.g., OAG clean audit certificates, parliamentary budget wins) are routinely downplayed or denied airtime on politically captured Tier 1 stations."
  - title: "Surrogate Studio Ambush Tactics"
    text: "Morning talk shows (*06:00–09:00 EAT*) frequently host adversarial panels stacked with rival proxies, designed to draw the candidate into unverified local controversies."
  - title: "Unequal access to prime slots"
    text: "Politically steered media houses refuse prime morning slots to competitive campaigns, or offer them on worse terms."
```

## 12.4 Which language reaches which voters

#### Language, register and dialect

#### Which language reaches which voters, on which channel

```lead
While English functions as the language of statutory policy and constitutional governance, and Kiswahili serves as the commercial lingua franca of urban trading centers, **Kikamba is the primary language of emotional connection, rural trust, cultural authority, and grassroots electoral mobilization**.
```

Kitui County is a deeply multilingual electoral ecosystem. While English functions as the language of statutory policy and constitutional governance, and Kiswahili serves as the commercial lingua franca of urban trading centers, **Kikamba is the primary language of emotional connection, rural trust, cultural authority, and grassroots electoral mobilization**.

A flawed translation—or an urban, anglicized phrasing of a traditional Kikamba idiom—can alienate rural elders and smallholder farmers. The campaign therefore establishes a **Trilingual Content Architecture** that maps each language to its demographic audience, dominant communication channel, cultural register, and dedicated linguistic quality-control sign-off protocol.

```figure
id: language-map
```

<!-- keep -->
[CONFLICT C1: see open items] [CONFLICT C2: see open items]

Language is central to trust in Kitui.

* **Kikamba** — deep local resonance, especially on WhatsApp, TikTok, Facebook,
SMS and radio. Local proverbs, idioms and cultural reference. Working
examples, all requiring native-speaker verification before publication:

* **Kiswahili** — broader reach, urban and younger audiences, national framing
* **English** — policy depth, professional audiences, national media

```visual
kind: donut
title: "Content mix for locally facing platforms"
items:
  - label: "Kikamba"
    value: "50%"
    body: "WhatsApp, TikTok, Facebook grassroots, voice notes, radio, USSD — **not bulk SMS** (§15.3.3) [CONFLICT C1: see open items]"
  - label: "Kiswahili"
    value: "30%"
    body: "General social, national reach, SMS"
  - label: "English"
    value: "20%"
    body: "Policy documents, website, X, YouTube, national media"
```

```visual
kind: cards
preset: proverb
note: "The examples above are working drafts, not verified copy: every Kikamba proverb and phrase is reviewed and corrected by a native speaker before publication."
items:
  - title: "*\"Kĩtui nĩ yethu, tũtethanĩe\"*"
    text: "Kitui is ours, let us help each other"
    badge: "draft"
  - title: "The Kamba call-and-response form — opening a video with *\"Mbee! Mbee!\"* (Forward! Forward!)"
    badge: "draft"
  - title: "*\"Kĩla kĩndũ kĩ na thayũ, ĩtina nĩ kũmenya\"*"
    text: "everything has a solution, the key is knowledge — framing his expertise"
    badge: "draft"
  - title: "Imagery: the baobab as resilience, the calabash as shared resources"
    badge: "draft"
```

#### Channel-by-language deployment

```figure
id: language-deployment
```

[CONFLICT C1: see open items]

## 12.5 Register, dialect and quality control

#### Register, dialect and the discipline it takes

Translating political concepts from statutory English into vernacular Kikamba requires precise cultural calibration. Kikamba varies across sub-counties—from the *Kitui Central/South dialect* to the *Northern/Mwingi dialect*—and uses rich proverbial allegories that must be deployed correctly:

```figure
id: cultural-registers
```

```visual
kind: cards
preset: rule
title: "Linguistic Rules of Engagement"
items:
  - title: "Dialect Inclusivity (Kitui Central vs. Mwingi North)"
    text: "Radio scripts, broadcast voiceovers, and SMS copy must use standardized, pan-Kamba vocabulary while respecting northern phonetics (*e.g., ensuring vocabulary is natural to both Mwingi and Kitui South listeners*)."
  - title: "No Direct Machine Translation"
    text: "Automated translation tools (e.g., Google Translate) are **strictly forbidden** for Kikamba and Kiswahili public collateral."
    body: "Automated outputs fail to capture cultural nuance and produce unnatural syntax that destroys candidate credibility."
  - title: "Bilingual Print Packaging"
    text: "All major printed baraza flyers, photobooks, and summaries must be packaged bilingually (Kikamba on primary spread, Swahili/English summary on reverse)."
```

#### The production and quality-control pipeline

The campaign implements a **Translation & Quality-Control Gateway**:

```figure
id: qc-gateway
```

## 12.6 A week of publishing, before and after

Because Section 6.2: {{pool.share}}% of the register lives where he has never held office, and nothing published so far argues his case there.

#### One week, before and after

**Same week. Same events. Same team. Different structure.**

The pattern below is the current one as observed from the public page: a daily record of where
Dr. Mulu was, mostly in English, with no ward named outside Kitui Central, no commitment attached
and no ask. Week 1 checks it against his actual week before it is put in front of him.

```figure
id: fig-4-5-calendar
```

**Two rules on top.** At least two of the seven originate in a ward inside the deficit pool. At least
four are Kikamba-first. Both rules are set by the Week 1 audit rather than by preference, and both
are checked in the Monday review. [CONFLICT C1: see open items]

```visual
kind: contrast
left:
  title: "What changed"
  items:
    - { label: "two fields on a Thursday post, and a language rule." }
right:
  title: "What did not change"
  items:
    - { label: "who takes the photograph, who writes the caption, and who presses publish." }
```

## 12.7 When the plan changes

Because Section 7.1: the diagnosis is a hypothesis, and Week 1 tests it.

Stated as decision rules in advance, so the audit cannot be read backwards into whatever was already
planned.

```figure
id: fig-4-8-decision-rules
```
