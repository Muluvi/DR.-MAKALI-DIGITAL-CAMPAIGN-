```lead
**{{ict.offline}}%** of Kitui's residents are offline, and the Kikamba radio stations with the widest reach are tied to political rivals. Digital alone reaches about **{{reach.smartphone}} voters** (modelled), so the election is reached mainly by phone, radio and in person.
```

**{{ict.offline}}%** of Kitui's residents are offline, and the Kikamba radio stations with the widest reach are tied to political rivals. Digital alone reaches about **{{reach.smartphone}} voters** (modelled), so the election is reached mainly by phone, radio and in person. This chapter sets out where people get information, who owns the airwaves, what each channel can reach, and the infrastructure that reaches the offline majority.

## 4.1 Where people get information

```visual
kind: stats
title: "Phones, internet and money agents (CA/KNBS)"
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
    label: "mobile-money agents, nationally"
    tier: 1
    body: "Up from {{ict.agents.2025}} in late 2025 (Tier 1). In settlements without broadband, the agent kiosk is a trusted local point of contact, and it is commercially motivated."
body: "The **2023/24 Kenya Continuous Household Survey and Communications Authority reports** (Tier 1) put internet use in Kitui at **{{ict.internet}}%** (up from {{ict.internet.2019}}% in the 2019 KNBS Census), leaving **{{ict.offline}}% of residents offline**. Mobile phone ownership is **{{ict.phone}}%** (up from {{ict.phone.2019}}% in 2019)."
```

| Measure | Kitui, 2023/24 | Kitui, 2019 | National context |
|---|---|---|---|
| Mobile phone ownership | **{{ict.phone}}%** of residents (CA/KNBS 2023/24) (Tier 1) | {{ict.phone.2019.people}} people ({{ict.phone.2019}}%) (Tier 1) | {{ict.sims.national|m1}} million active SIM cards; {{ict.sim-penetration}}% penetration (CA, Q3 FY2025/26) |
| Internet use | **{{ict.internet}}%** ({{ict.offline}}% offline) (Tier 1) | {{ict.internet.2019.people}} people ({{ict.internet.2019}}%) (Tier 1) | {{ict.broadband.national|m1}} million mobile broadband subscriptions (Tier 1) |
| Devices | Feature-phone and USSD-capable devices dominate | Feature phones dominate (Tier 1) | Smartphones are {{ict.smartphone-share}}% of active SIMs nationally ({{ict.smartphones.national|m1}} million of {{ict.sims.national|m1}} million, CA Q3 FY2025/26, Tier 2); a national rate, which overstates Kitui |
| Mobile money | Near-universal use of mobile transactions | Mobile money dominant | {{ict.momo.national|m1}} million subscriptions ({{ict.momo-penetration}}%); **{{ict.agents}} registered agents** (March 2026) |
| Phone ownership, adults (KDHS 2022) | Men 18+ **{{ict.phone.adult.men}}%**, women 18+ **{{ict.phone.adult.women}}%** (County Gender Data Sheet, October 2025) (Tier 1) | — | Kenya: men {{ict.kenya.phone.adult.men}}%, women {{ict.kenya.phone.adult.women}}% (Tier 1) |
| Internet use, ages 15–49 (KDHS 2022) | Men **{{ict.internet.1549.men}}%**, women **{{ict.internet.1549.women}}%** (Tier 1) | — | Kenya: men {{ict.kenya.internet.1549.men}}%, women {{ict.kenya.internet.1549.women}}% (Tier 1) |

**Two bases, never averaged.** {{ict.phone}}% and {{ict.internet}}% are shares of all residents, children included. The register holds adults only, and adults own phones at about three times in four. Section 4.3 models voter reach on both bases and says which it uses.

```figure
id: fig-2-6-connectivity
```

## 4.2 Who owns the airwaves

```lead
**The highest-reach commercial radio stations broadcasting in Kikamba are owned, financed, or editorially steered by active political rivals or entrenched party gatekeepers.** The ownership map and posture for every station are set out once, below.
```

Kikamba radio is the main source of news and political talk in rural and peri-urban Kitui, and it is the dominant information channel for the {{ict.offline}}% of residents outside the internet-using population (CA/KNBS 2023/24). But ownership is concentrated: **the highest-reach commercial radio stations broadcasting in Kikamba are owned, financed, or editorially steered by active political rivals or entrenched party gatekeepers**. So the campaign works with the commercial stations on disciplined terms, and builds routes around the rest (Section 15.2.2).

```figure
id: fig-2-7-media
```

```visual
kind: checklist
title: "The three facts that shape the radio plan"
items:
  - label: "**Two stations are associated with Charity Ngilu**, a declared general-election rival:"
    text: "**Mbaitu FM** and **Syokimau FM**. Both are monitoring targets, not placement targets."
  - label: "**One station is associated with Kalonzo Musyoka**, the Wiper party leader:"
    text: "**Athiani FM**. It is party-sensitive rather than hostile, and it matters most during the nomination window, when coverage may track party leadership sentiment rather than merit."
  - label: "**The stations open to the campaign are commercially or institutionally independent**:"
    text: "**Musyi FM** (Royal Media Services), **County FM** (Kitui-based independent) and **Wikwatyo FM** (Seventh-Day Adventist Church, Kitui). These are the placement targets. [CONFLICT C7: see open items]"
```

**The ownership map.** This table governs. It is the version reconciled against `data/media-ownership.ts`, which the site renders directly.

| Station | Kitui frequency | Ownership association | Campaign posture |
|---|---|---|---|
| **Mbaitu FM** | 100.4 (Kitui/Mwingi) | Associated with **Charity Ngilu** — a declared rival | Monitor closely; expect unfavourable framing; do not rely on placement |
| **Syokimau FM** | — | Associated with **Charity Ngilu** | As above |
| **Athiani FM** | 97.7 | Associated with **Kalonzo Musyoka**, Wiper Patriotic Front leader | Party-aligned, not neutral. Relevant during the nomination window — coverage may track party leadership sentiment rather than merit |
| **Musyi FM** | 102.2 (regional) | Royal Media Services | **Priority — commercially independent, broad Ukambani reach** |
| **County FM** | 90.3 Kitui / 91.8 Mwingi | Kitui-based independent | **Priority — local, independent, Mwingi reach** |
| **Wikwatyo FM** | 105.3 | Seventh-Day Adventist Church, Kitui-based | Priority for community and service-delivery programming |
| **Ene FM** | 90.6 (Kitui) | Makueni-based | Secondary |
| **Akamba FM** | 103.3 (Kitui) | Independent, launched 2023 | Secondary — newer, may be more accessible |
| **KBC Mwatu FM** | 93.1 | Public broadcaster | Institutional coverage |

<!-- keep -->
[CONFLICT C7: see open items]

**What it means for the campaign:** the radio plan runs through Musyi, County FM and Wikwatyo, treats Athiani as party-sensitive, and treats Mbaitu and Syokimau as monitoring targets rather than placement targets. Attacks on Dr. Makali Mulu are more likely to start on air than online, which is why radio monitoring sits in the war room (Annex F.4).

> **Listenership.** The published audience share is regional: the CA/KARF report for **Lower Eastern** (Kitui, Machakos and Makueni together) puts Musyi FM at {{radio.musyi}}%, Athiani FM at {{radio.athiani}}%, Mbaitu FM at {{radio.mbaitu}}% and County FM at {{radio.county}}% of listeners (Tier 2, an earlier measurement). It ranks the stations; it does not size Kitui's own audience.

Ownership associations are publicly reported rather than certified, and ownership changes. The certifiable records are the Communications Authority's register of broadcast licensees and the Business Registration Service's company records. The map is checked against both before any placement is booked, and updated when either changes.

## 4.3 What each channel can physically reach

```lead
If the campaign reached 100% of every internet-connected voter in Kitui County, it would reach about **{{reach.smartphone}} voters** (modelled), and even if every one of them voted for him he would be **{{reach.smartphone.short}} votes short** of the {{benchmark}} benchmark.
```

**The digital ceiling.** If the campaign reached 100% of every internet-connected voter in Kitui County, it would reach about **{{reach.smartphone}} voters** (modelled: {{ict.internet}}% internet use applied to the July 2026 register), and even if every one of them voted for him he would be **{{reach.smartphone.short}} votes short** of the {{benchmark}} benchmark. Reach is not votes. Digital alone cannot win this election: the offline channels and the field operation (Section 15.3.3) carry the reach, and digital is used precisely, to shape opinion among those who set the agenda, to organise young volunteers, and to reach the diaspora.

Digital use is concentrated in towns (Kitui Town, Mwingi Town, the Kwa Vonza university corridor) and among educated young people. In-county users per platform are not published, so this section sizes what digital can reach from the published rates alone.

```figure
id: fig-3-8-ceiling
```

**The SMS and USSD layer reaches more voters than the resident rate implies.** On the resident basis ({{ict.phone}}% of all residents) about {{reach.phone.resident}} voters own a phone. On the adult basis ({{ict.phone.adult}}% of adults, KDHS 2022, weighted by the register's {{register.women.share}}% women) about **{{reach.phone.adult}}** do and about {{reach.nophone.adult}} do not (both modelled on the July 2026 register as reported, so Tier 3). That is roughly {{reach.phone.ratio}} times as many voters within reach of SMS and USSD. The digital ceiling does not move: internet use among adults aged 15–49 is {{ict.internet.1549.men}}% for men and {{ict.internet.1549.women}}% for women.

```visual
kind: contrast
left:
  title: "What digital can do"
  items:
    - label: "Set the agenda, and defend it"
      body: "The working premise is that local radio producers, vernacular talk-show hosts, church leaders and county assembly members follow X and Facebook, so rapid response there can shape what radio goes on to discuss. No source in this proposal measures that link or its timing; the war room's monitoring log (Section 20.2) records it from the first month rather than assuming it."
    - label: "Recruit young volunteers"
      body: "Reaching the ~{{segment.youth.voters}} young voters on TikTok and WhatsApp recruits field volunteers who run ground logistics and serve as polling agents."
    - label: "Target urban traders"
      body: "Geofencing commercial centres (Kitui CBD, Mwingi Central) tests policy messages (\"The Economist's Single Business Permit\") with little waste."
right:
  title: "What digital cannot do"
  items:
    - label: "Deliver the {{benchmark}} vote benchmark alone"
      body: "Capped at about {{reach.smartphone}} reachable voters inside Kitui County (modelled)."
    - label: "Reach the rural farming base"
      body: "{{ict.offline}}% of Kitui's residents are offline (CA/KNBS 2023/24), and rural smallholders do not meet political content through social media: few smartphones, high data costs, and weak 3G/4G coverage in rural wards (for example Tharaka, Tseikuru, Voo/Kyamatu, Endau, Mutha)."
    - label: "Answer rumours on the ground"
      body: "WhatsApp and Facebook rarely reach dryland farming communities without someone to carry the message in person."
```

## 4.4 The offline majority, and the infrastructure that reaches it

```lead
The election will be won or lost across the **{{reach.offline}} registered voters not reachable online** (modelled: the July 2026 register less the {{reach.smartphone}} reachable by smartphone or data).
```

The election will be won or lost across the **{{reach.offline}} registered voters not reachable online** (modelled: the July 2026 register less the {{reach.smartphone}} reachable by smartphone or data). They are reached by five channels together: SMS and USSD, Kikamba radio, mobile-money agents, market days and churches.

```visual
kind: cards
preset: channel
items:
  - title: "Kikamba radio"
    fields:
      - { label: "Reach", text: "the CA/KARF audience report for Lower Eastern (Kitui, Machakos and Makueni together) puts Musyi FM at {{radio.musyi}}% of listeners, Citizen Radio {{radio.citizen}}%, Athiani FM {{radio.athiani}}%, Mbaitu FM {{radio.mbaitu}}%, County FM {{radio.county}}% and Mwatu FM {{radio.mwatu}}% (Tier 2). It is a regional and an earlier measurement, so it ranks the stations rather than sizing Kitui's audience. [CONFLICT C7: see open items]" }
      - { label: "The stations", text: "*   *Musyi FM (Royal Media Services):* the market leader in Ukambani; commercially independent. **Priority placement.**\n    *   *County FM (Kitui-based independent):* local ward news and debates, strong in Kitui Town, Kabati and Kwa Vonza. **Priority placement.**\n    *   *Wikwatyo FM (Seventh-Day Adventist Church, Kitui):* broad rural trust. **Priority for community and service-delivery programming.**\n    *   *Mbaitu FM, Syokimau FM (Ngilu-associated) and Athiani FM (Wiper leadership):* **monitoring targets, not placement targets** — Section 4.2 has the ownership map and the posture for each." }
      - { label: null, text: "**What the campaign would run** (campaign-owned, outside this engagement, Section 13.3):\n*   *Weekly morning interviews:* two-hour studio interviews (06:30–08:30) with Dr. Mulu in the weeks a policy is launched.\n    *   *Kikamba jingles and testimonials:* 45-second stories from farmers in Mwingi North, Kitui South and Kitui Rural on how Dr. Mulu's economic plan protects their harvest prices.\n    *   *Outside broadcasts:* sponsored live broadcast vans at major market rallies in Kalundu, Kabati and Mutomo." }
  - title: "SMS and USSD"
    head: { label: "Reach", text: "mobile phone ownership is {{ict.phone}}% of residents countywide (CA/KNBS 2023/24, Tier 1); a feature phone is enough for SMS and USSD." }
    fields:
      - { label: null, text: "**What Firefly operates** (Section 15.3.3):\n*   *A free USSD menu (`*[shortcode]#`):* any feature phone can dial it to read Dr. Mulu's five-point manifesto in Kikamba, register as a volunteer, or find the nearest Ward Captain.\n    *   *Ward-targeted SMS:* **Kiswahili** messages to consented supporters in specific wards on the eve of market days, and on election morning to get out the vote." }
  - title: "Mobile-money agents"
    head: { label: "Reach", text: "nationally there are {{ict.agents}} registered agents (March 2026, Tier 1, Section 4.1)." }
    fields:
      - { label: null, text: "**What the campaign would run** (campaign-owned, outside this engagement, Section 13.3):\n*   M-Pesa agents are trusted community hubs where residents deposit money, buy airtime and talk about local news. **Agent networks are regulated financial infrastructure**; Section 15.3.3 requires campaign counsel to review any commercial arrangement with them before recruitment begins. The ambassador network is untiered and needs a source.\n    *   The campaign would recruit {{target.ambassadors}}+ shopkeepers and M-Pesa agents as \"Economic Ambassadors\", with branded ledgers, counter pens, calendar posters and daily economic talking points." }
  - title: "Market days and caravans"
    head: { label: "Reach", text: "for scale only: the 2023 Kitui Agricultural Show drew more than {{show.2023}} people over three days (Tier 3), and market days are gazetted by market. Neither is a market-day count." }
    fields:
      - { label: null, text: "**What the campaign would run** (campaign-owned, outside this engagement, Section 13.3): two sound trucks (*The Mulu Economic Caravans*) with PA systems, Kikamba music and local young speakers, at market entrances on market days. Section 15.3.1 sets out how the ground team runs them." }
  - title: "Churches and clergy"
    head: { label: "Reach", text: "denominations present: Catholic, AIC, Redeemed Gospel, Anglican and Baptist. The Catholic Diocese of Kitui alone counts over {{church.catholic}} baptised members (Tier 3), a floor for one denomination rather than attendance." }
    fields:
      - { label: null, text: "**What the campaign would run** (campaign-owned, outside this engagement, Section 13.3): Sunday visits across all eight constituencies, respecting the liturgy, asking for prayers, and meeting parish development committees after the service." }
```

```visual
kind: week
title: "Market rotation"
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

**What it means for the campaign.** The offline majority is reached through infrastructure that already exists in every ward, and the campaign's job is to put its message on it.
