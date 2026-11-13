
The effort goes where he is least known, in the languages and on the channels that reach those voters: {{channel.offline.rebalanced}}% offline, {{channel.digital.rebalanced}}% digital, and Kikamba first.

## Where the effort goes

Because **{{pool.share}}% of the county register sits where he has never held office** (see [Where he is known, and where not](#record-where-he-is-known-and-where-not)), output and targeting are weighted accordingly. The campaign cannot rely on reach spilling over from Kitui Central.

```visual
kind: stats
items:
  - value: "{{effort.digital.pool}}%"
    label: "of Phase −1 digital reach effort, in the pool"
    body: "**{{effort.digital.pool}}% of all Phase −1 digital reach effort (Meta, Google, YouTube)** is geofenced to Mwingi North, Mwingi Central, Mwingi West and Kitui South. The weighting is on output and targeting, and R-02 measures it (see [Recognition where he is least known](#success-recognition-where-he-is-least-known))."
  - value: "{{effort.sms.pool}}%"
    label: "of SMS/USSD onboarding, in the pool's 21 wards"
    body: "**{{effort.sms.pool}}% of the offline SMS and USSD onboarding effort** (see [Workstream 9 — What your team operates: SMS, USSD and voice](#workstreams-workstream-9-what-your-team-operates-sms-ussd-and-voice)) goes to the 21 wards of the pool: the 15 Mwingi wards and the six of Kitui South. The campaign's own ward-captain network (a target of {{target.captains.pool}} of {{target.captains}} captains, recommended for the same wards) is campaign-owned and outside this engagement (see [What the operation does not cover](#engagement-what-the-operation-does-not-cover))."
```

**What the message says there.** In these wards the Economist Governor message stresses fair distribution across the county: how Dr. Makali Mulu's oversight of public money would direct water and health investment into rural wards such as Kyuso, Tseikuru, Athi and Mutha. Calling any ward neglected needs the county's development expenditure by ward, from the Controller of Budget's implementation reports and the county's own budget documents; until that is in hand, the message names the ward and the need, not the neglect.

**Where the voters are, and where the need is worst.** NDMA ranks Mwingi North first and Kitui South second of the eight sub-counties for food-insecurity severity, and Kitui Central eighth (July 2025; [Food, farming and drought](#needs-food-farming-and-drought)). Its hotspot wards in the three most severe sub-counties include Kyuso, Tseikuru and Athi, three of the twelve largest wards (see [The twelve largest wards](#votes-the-twelve-largest-wards)). The county's own scorecard supplies part of the ward-level expenditure data this weighting needs: on its {{scorecard.itemised}} itemised projects the pool's four constituencies receive {{scorecard.pool.share}}% of constituency-attributed expenditure against {{pool.share}}% of the register, so the pool as a whole was not passed over and the plan does not claim it was. The gap is Mwingi West, at KES {{scorecard.mwingi-west.per-voter}} per registered voter against KES {{scorecard.kitui-central.per-voter}} in Kitui Central (see [How county money is spent](#needs-how-county-money-is-spent)).


**Coverage note.** The three zones of [The land and its three regions](#kitui-the-land-and-its-three-regions) total {{zones.population}} residents, **{{zones.share}}% of the county's {{census.population}}** (from the 2019 census). They name 12 of the county's {{census.subcounties}} sub-counties; the remaining six, about {{zones.excluded}} residents, are in no zone. The weightings below therefore spread all of the communications effort across zones covering under four-fifths of the population. **Until the six are assigned, the Phase −1 weighting governs only the three zones, and the six unassigned sub-counties receive the rotating share alone.** Assigning them is a Week 2 task for the strategy lead, against the [The land and its three regions](#kitui-the-land-and-its-three-regions) regions and the IEBC register, and the weighting is restated when it is done.

*Effort and content allocation across zones, by phase:*

```figure
id: fig-4-2-effort
```

Phase −1 deliberately puts more effort into Mwingi and the arid belt than their share of the population, on the working hypothesis that his gap is one of recognition, concentrated outside the home base (see [What the evidence says](#diagnosis-what-the-evidence-says)). If Week 1 refutes it, [When the plan changes](#channels-when-the-plan-changes) sets out how the weighting changes. The weightings are reviewed monthly against the reach data (see [Recognition where he is least known](#success-recognition-where-he-is-least-known)) and reallocated.

<model-embed slug="reach-by-channel">
</model-embed>

## Which channel does which job


Digital alone reaches about {{reach.smartphone}} voters at most, short of the {{benchmark}} benchmark even if every one of them voted for him (see [What each channel can reach](#news-what-each-channel-can-reach)). So the weighting below is a **rebalancing target**: the direction of travel away from the conventional digital pitch, argued from reach. It sets the share of communications *effort* each domain should carry — production time, team attention, weekly output and channel priority — and so where the campaign's weight goes.

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

**The reach behind the weighting** is set out channel by channel, with its bases, in How voters get news.

**The {{channel.offline.rebalanced}}/{{channel.digital.rebalanced}} weighting stands on the 2023/24 rate.** It was first set when digital reach was put at {{ict.internet.2019}}% of residents (the 2019 census rate). On the 2023/24 rate of {{ict.internet}}% digital still reaches at most {{reach.smartphone}} voters, {{reach.smartphone.short}} short of the {{benchmark}} benchmark (see [What each channel can reach](#news-what-each-channel-can-reach)), so the case for an offline-led mix is unchanged. The split is re-read at each monthly review against the reach data (confirmed by Firefly, September 2026).

## The radio gatekeepers

The stations with the widest Kikamba reach are tied to rivals (see [Who owns the airwaves](#news-who-owns-the-airwaves)), and that creates three hazards for the campaign:

```visual
kind: cards
preset: hazard
items:
  - title: "Achievements kept off air"
    text: "Development achievements (for example clean audit certificates from the Office of the Auditor-General (OAG), or budget wins in Parliament) are routinely played down or denied airtime on politically aligned stations."
  - title: "Ambush in the studio"
    text: "Morning talk shows (*06:00–09:00 EAT*) often host panels stacked with rivals' proxies, set up to draw the candidate into unverified local controversies."
  - title: "Unequal access to prime slots"
    text: "Politically aligned stations refuse prime morning slots to competing campaigns, or offer them on worse terms."
```

The routes around these stations are in [Workstream 6 — Earned media, journalists and debates](#workstreams-workstream-6-earned-media-journalists-and-debates).

## Which language reaches which voters


Kitui speaks three languages, each with its own job. While English functions as the language of statutory policy and constitutional governance, and Kiswahili serves as the commercial lingua franca of urban trading centers, **Kikamba is the primary language of emotional connection, rural trust, cultural authority, and grassroots electoral mobilization**.

A poor translation, or an urban, anglicised version of a traditional Kikamba idiom, can alienate rural elders and smallholders. So each language is mapped to its audience, its main channel, its register and its own native-speaker sign-off.

```figure
id: language-map
```

<!-- keep -->
**Which number governs.** The shares in the language map describe who speaks what; the target for what the campaign publishes is the 50 / 30 / 20 content mix below. Bulk SMS carries Kiswahili and English only, by law (see [Workstream 9 — What your team operates: SMS, USSD and voice](#workstreams-workstream-9-what-your-team-operates-sms-ussd-and-voice)), and the weekly rule of at least four Kikamba-first posts in seven (see [A week of publishing, before and after](#channels-a-week-of-publishing-before-and-after)) sits above the 50% floor.

Language is central to trust in Kitui.

* **Kikamba** — deep local resonance, especially on WhatsApp, TikTok, Facebook, voice notes and radio. Local proverbs, idioms and cultural reference; the working examples below all need native-speaker verification before publication.
* **Kiswahili** — broader reach, urban and younger audiences, national framing
* **English** — policy depth, professional audiences, national media

**One channel consequence.** Bulk political SMS cannot be sent in Kikamba (see [Workstream 9 — What your team operates: SMS, USSD and voice](#workstreams-workstream-9-what-your-team-operates-sms-ussd-and-voice)), so Kikamba travels by radio, WhatsApp voice notes, USSD menu text, barazas and in person, and SMS carries the Kiswahili and English versions of the same message.

```visual
kind: donut
title: "Content mix for locally facing platforms"
items:
  - label: "Kikamba"
    value: "50%"
    body: "WhatsApp, TikTok, Facebook grassroots, voice notes, radio, USSD — **not bulk SMS** (see [Workstream 9 — What your team operates: SMS, USSD and voice](#workstreams-workstream-9-what-your-team-operates-sms-ussd-and-voice))"
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
note: "These are working drafts, not verified copy: every Kikamba proverb and phrase is reviewed and corrected by a native speaker before publication."
items:
  - title: "*\"Kĩtui nĩ yethu, tũtethanĩe\"*"
    text: "Kitui is ours, let us help each other"
  - title: "The Kamba call-and-response form — opening a video with *\"Mbee! Mbee!\"* (Forward! Forward!)"
  - title: "*\"Kĩla kĩndũ kĩ na thayũ, ĩtina nĩ kũmenya\"*"
    text: "everything has a solution, the key is knowledge — framing his expertise"
  - title: "Imagery: the baobab as resilience, the calabash as shared resources"
```

#### Channel-by-language deployment

```figure
id: language-deployment
```

<model-embed slug="send-check">
</model-embed>

## Register, dialect and quality control

Putting political ideas from statutory English into Kikamba takes care. Kikamba varies between sub-counties, from the *Kitui Central and South dialect* to the *northern, Mwingi dialect*, and its proverbs must be used correctly:

```figure
id: cultural-registers
```

```visual
kind: cards
preset: rule
title: "The language rules"
items:
  - title: "One vocabulary for north and south (Kitui Central and Mwingi North)"
    text: "Radio scripts, voiceovers and SMS copy use standard, pan-Kamba vocabulary while respecting northern pronunciation (*so that the words sound natural to listeners in both Mwingi and Kitui South*)."
  - title: "No machine translation"
    text: "Automated translation tools (for example Google Translate) are **not used** for Kikamba or Kiswahili public material."
    body: "They miss cultural nuance and produce unnatural sentences, and the candidate loses credibility."
  - title: "Bilingual print"
    text: "Every major printed baraza flyer, photobook and summary is bilingual: Kikamba on the main spread, a Kiswahili or English summary on the back."
```

#### The production and quality-control pipeline

Every Kikamba and Kiswahili item passes four gates between an English draft and broadcast:

```figure
id: qc-gateway
```

## A week of publishing, before and after

{{pool.share}}% of the register lives where he has never held office (see [Where he is known, and where not](#record-where-he-is-known-and-where-not)), and nothing published so far argues his case there.

**Same week. Same events. Same team. Different structure.**

The current pattern, as observed from the public page, is a daily record of where Dr. Mulu was, mostly in English, with no ward named outside Kitui Central, no commitment attached and no ask. Week 1 checks it against his actual week before it is put in front of him.

```figure
id: fig-4-5-calendar
```

**Two rules on top.** At least two of the seven originate in a ward inside the deficit pool. At least four are Kikamba-first. Both rules are set by the Week 1 audit rather than by preference, and both are checked in the Monday review.

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

## When the plan changes

The diagnosis is a hypothesis, and Week 1 tests it (see [What could overturn it](#diagnosis-what-could-overturn-it)). The decision rules below are stated in advance, so the audit cannot be read backwards into whatever was already planned.

```figure
id: fig-4-8-decision-rules
```
