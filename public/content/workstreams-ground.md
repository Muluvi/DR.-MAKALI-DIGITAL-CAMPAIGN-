### 4.5.7 Workstream 7 — Ground-digital integration

```lead
**Owner: the campaign.** Field intelligence captured by the 40 Ward Coordinators directly dictates the daily digital and radio advertising content; Firefly supplies the reporting template and the analysis of what comes back.
```

> **Owner: the campaign.** The 40 ward coordinators are the campaign's people. Firefly supplies
> the reporting template and the analysis of what comes back.
>
> **Group: Ground and offline reach.**


A campaign that operates field organizing and digital messaging as isolated silos will fail in a county where 73.8% of residents are offline (CA/KNBS 2023/24).

The campaign establishes a **Closed-Loop Ground-Digital Integration Engine**. Field intelligence captured by the 40 Ward Coordinators directly dictates the daily digital and radio advertising content; conversely, digital and radio narratives are converted by field captains into physical talking points, print flyers, and audio notes distributed through local transport and commercial networks.

```figure
id: field-loop
```

#### What the 40 ward coordinators report

The primary sensing mechanism of the campaign is the **40 Ward Coordinators**, who supervise the campaign's ward captains (400 recommended, 10 per ward; campaign-owned, Section 1.4.3). Each coordinator is equipped with a dual reporting channel: a **secure field WhatsApp bot** for smartphone-equipped coordinators in 3G/4G zones, and a **zero-rated USSD/SMS structured reporting tree** for offline/2G wards.

```figure
id: field-reports
```

```visual
{"kind":"cards","preset":"report","title":"What Ward Coordinators Report","items":[{"title":"Issues Raised in Public","text":"What residents raised at barazas, markets and public meetings, logged as it was said. E.g., *\"Farmers at the Kyuso market raised uncollected green grams; opponents are claiming Dr. Mulu will eliminate county agricultural subsidies.\"* No coordinator canvasses opinion or asks anyone how they will vote: the report records what was said in public, not a measured sentiment."},{"title":"Competitor Movement & Expenditure","text":"E.g., *\"Opponent convoy visited Migwani market; distributed Ksh 500 notes to youth groups; promised new market shades.\"*"},{"title":"Ground Disinformation & Counter-Narratives","text":"E.g., *\"Rumor circulating in Mutomo that Dr. Mulu's CDF bursary program excluded non-Kitui Central students.\"*"},{"title":"Field Inventory & Collateral Levels","text":"Current stock of Kikamba manifesto summary leaflets, posters, audio flash drives, and volunteer T-shirts."}]}
```

#### From ground intel to a published response in four hours

When field intelligence reaches the War Room, it triggers an automated, standardized four-stage response cycle:

```figure
id: four-hour-cycle
```

#### Distribution beyond social media

> **Campaign-owned recommendations, outside this engagement (Section 1.4.3).** The four networks
> below are the campaign's to recruit, equip and run. Firefly writes the brief each one carries.

To bypass digital connectivity barriers, the campaign turns physical transportation, trade, and civic networks into active information distribution conduits:

```visual
{"kind":"cards","preset":"network","items":[{"title":"The Boda Boda Stage Network (1,200 Stage Champions)","badge":"campaign-owned","head":{"label":"Operational Role","text":"The campaign identifies 1,200 \"Stage Champions\" (30 per ward) across all 40 wards."},"fields":[{"label":"Infrastructure","text":"Commercial motorcycle operators in Kitui, organized into distinct stage associations (*masese*). About **14,000 riders** by a 2026 estimate, of whom 10,921 were reported riding without a valid licence (Tier 3; an estimate, not an NTSA register). In August 2026 the county and NTSA issued smart licences to 783 operators drawn from all 40 wards (Tier 2)."},{"label":"Execution","text":"- Champions receive high-visibility reflective campaign vests branded with \"Uchumi na Kazi\" and safety helmets.\n- Equipped with mobile phone charging hubs at stages, playing looped Kikamba campaign audio podcasts and speeches to passengers awaiting transport.\n- Act as rapid physical distributors of print materials to remote interior villages inaccessible by four-wheel vehicles."}]},{"title":"Matatu & Sacco Commuter Transit Routes","badge":"campaign-owned","head":{"label":"Operational Role","text":"Capturing passengers during long transit journeys (3–6 hours)."},"fields":[{"label":"Infrastructure","text":"Matatu SACCOs connecting Kitui Town, Mwingi, Mutomo, Nairobi, and Mombasa (e.g., Kitui Classic, Mwingi Travelers, TSS, Buscar)."},{"label":"Execution","text":"- Provision of branded onboard audio USB flash drives to matatu drivers featuring popular Kamba secular and gospel music interspersed with 60-second policy messages from Dr. Mulu.\n- Placement of seatback information cards in commuter vans detailing Dr. Mulu's 5-point Economic Charter."}]},{"title":"Weekly Market Days & Caravan Circuits","badge":"campaign-owned","head":{"label":"Operational Role","text":"Concentrated voter aggregation points."},"fields":[{"label":"Infrastructure","text":"The 40 major market centers rotating across the county weekly (Section 4.5.9)."},{"label":"Execution","text":"- Coordinated arrival of the *Mulu Economic Caravan* sound trucks at 10:00 AM on market days.\n- Ward Coordinators lead door-to-door merchant walk-throughs, distributing Kikamba business charters to shopkeepers, vegetable vendors (*mama mboga*), and hardware dealers."}]},{"title":"Community Barazas & Chief's Gatherings (Protocol-Compliant)","badge":"campaign-owned","head":{"label":"Operational Mandate & Civility","text":"Campaign teams respect that civil service barazas are strictly non-partisan by law."},"fields":[{"label":"Infrastructure","text":"Monthly administrative barazas convened by National Government Administrative Officers (NGAO—Chiefs and Assistant Chiefs)."},{"label":"Execution","text":"- Ward Captains attend barazas as active community citizens to listen to localized grievances (water, security, relief food).\n- Post-baraza informal engagement: Engaging elders and attendees outside official proceedings, answering questions, and sharing Dr. Mulu's policy solutions for the specific community issues raised during the baraza."}]}]}
```

#### The operating rhythm

To maintain operational tempo across 8 constituencies and 40 wards, the campaign executes a strict, synchronized rhythm with assigned single-point-of-contact (SPOC) owners:

```figure
id: operating-rhythm
```


---

### 4.5.8 Workstream 8 — The field-to-digital loop

```lead
**Owner: the campaign.** Firefly supplies the instrument and its data governance. **Opt-in rate on routed doors** is the joint KPI holding both sides honest.
```

> **Owner: the campaign.** Firefly supplies the instrument and its data governance.
>
> **Group: Ground and offline reach.**


#### Operating architecture and bidirectional sync

Most campaigns run two separate operations: a ground team that knocks doors and
a digital team that buys ads. Neither learns from the other. The ground team
re-visits households digital already reached; digital keeps advertising to
households that have asked not to be contacted. In a county of
30,430 square kilometres, that duplication is unaffordable.

```figure
id: fig-5-2-3-field-loop
```

```visual
{"kind":"contrast","left":{"title":"Field to digital synchronization","items":[{"label":"Capture","text":"ward champions log the contact via a simple mobile form — four options (opted in;","body":"reached, no opt-in; asked not to be contacted; no one home), under thirty seconds per household. Complexity kills field data collection. The form never asks how anyone will vote."},{"label":"Offline-first","text":"the form caches locally and syncs when signal returns.","body":"Non-negotiable in Ikutha and Mutitu."},{"label":"Latency target","text":"field outcomes reflected in digital targeting within **24 hours**."},{"label":"Suppression","text":"households that ask not to be contacted are **removed from paid targeting and every contact list**, not messaged harder. This is the correct practice, and the Data Protection Act requires it."}]},"right":{"title":"Digital to field routing","items":[{"label":"Warm-lead routing","text":"voters who engaged with content, opened an SMS, or completed a USSD session are routed to ward champions as priority doors."},{"label":"Pre-briefing","text":"champions receive the issue the household engaged with — water, bursaries, market fees — so the conversation starts where the voter's interest already is."},{"label":"Event conversion","text":"digital sign-ups for barazas are handed to ground organisers with attendance follow-up."}]}}
```

#### Governance and data protection on the doorstep

```visual
{"kind":"checklist","items":[{"label":"Field data is campaign first-party data, collected with notice, and governed by the same charter as all other personal data (Section 5.3.3)."},{"label":"Ward champions receive data-handling training before being issued the form, and cannot export or retain contact data on personal devices."},{"label":"Opt-in rate on routed doors","body":"is the joint KPI holding both sides honest: if doors the model routes do not opt in at a higher rate than doors it does not, the routing is wrong."}]}
```

### 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice

```lead
**Owner: Firefly, end to end.** **Bulk political SMS cannot be sent in Kikamba**: the CA/NCIC guidelines restrict political SMS to **English or Kiswahili** (Tier 1, Communications Authority), lodged with the mobile operator at least 48 hours before sending.
```

> **Owner: Firefly, end to end.** Two pieces of infrastructure, held and run by Firefly: the
> **WhatsApp Business API line** and the **USSD shortcode**.
>
> It is also the one place where Firefly is a **data controller or joint controller** rather than a
> processor — see Section 5.3.1, which must be settled in writing before the first dispatch.
>
> **Group: Ground and offline reach.**


#### Why this layer decides the race

**26.2%** of Kitui's residents use the internet and **44.1%** own a mobile phone (CA/KNBS
2023/24, Tier 1). Nationally, smartphones are 59.7% of active SIMs (CA Q3 FY2025/26, Tier 2),
meaning feature phones remain a substantial share, and disproportionately so in rural, older and
lower-income populations.

Put plainly: **a purely digital campaign in Kitui addresses roughly one in
four residents, and the three it misses are concentrated in exactly the wards
where Dr. Mulu's recognition deficit is largest.**

This is not an equity footnote. It is the central strategic problem of
campaigning in this county, and solving it is the clearest demonstration of the
"Economist Governor" proposition: allocating resources to where the need is,
rather than where measurement is convenient.

The critical constraint: the campaign can only message consented numbers
(Section 5.3). List building is therefore a KPI in its own right from Phase −1,
not an afterthought — consented contacts are a campaign asset that compounds.

#### The SMS layer

**Consent-first architecture.** Every number in the campaign database arrives
by opt-in: a USSD self-registration, a signed baraza sheet with a clear data
notice, a WhatsApp opt-in confirmation, a website form, or a missed-call
opt-in. **No purchased lists. Ever.** See Sections 4.4.11 [CHECK REF] and 5.7.4 [CHECK REF] for the
regulatory basis; the short version is that the industry code requires express
opt-in for political messages and the ODPC has demonstrated willingness to
penalise unsolicited messaging.

> ### Bulk political SMS cannot be sent in Kikamba
>
> The CA/NCIC guidelines on political bulk messaging restrict political SMS to **English or
> Kiswahili** (Tier 1, Communications Authority). They also require every bulk political message
> to be **lodged with the mobile operator at least 48 hours before sending**, with the verbatim
> text and a signed authorisation, and they allow the operator to **refuse** a non-compliant
> message outright.
>
> **This changes the channel plan, not the language strategy.** Kikamba remains the campaign's
> strongest register — it simply cannot ride the bulk SMS rail. It belongs on **radio, WhatsApp
> voice notes, USSD menu text, barazas and person-to-person**, which is where the Section 3.7
> pillars already put it. SMS carries the Kiswahili and English versions of the same message.
>
> Two practical consequences the operating rhythm must absorb: a 48-hour lodging lead time makes
> **same-day SMS rapid response impossible** — the rebuttal row below runs on WhatsApp and radio
> instead — and a **2020 draft revision** proposed narrowing the sending window to 08:00–18:00
> `[VERIFY whether in force]`.

<!-- keep -->
[CONFLICT C2: see open items]

**Message architecture** — 160 characters, **English or Kiswahili only**, ward-tagged:
| Type | Frequency | Language | Example structure |
|---|---|---|---|
| **Policy drop** | Weekly | Kiswahili / English | One issue, one commitment, one verification promise |
| **Community message** | Fortnightly | Kiswahili | Policy anchor in plain register. *The Kikamba proverb version of this message goes out as a WhatsApp voice note, not as SMS* |
| **Registration drive** | Phase-specific | Kiswahili / English | Deadline, nearest centre, what to bring |
| **Event notice** | As scheduled | Kiswahili | Ward-targeted baraza details |
| **GOTV sequence** | Final 30 days | Kiswahili / English | Countdown, polling station, time |
| **Rapid rebuttal** | On trigger | — | **Not an SMS channel.** The 48-hour lodging rule rules it out; runs on WhatsApp, radio and the ward networks |

```visual
{"kind":"checklist","title":"Operational discipline","items":[{"label":"Every bulk send lodged with the operator 48 hours ahead","body":", verbatim text plus signed authorisation, logged against the dispatch record"},{"label":"No attacks on individuals, families, ethnicity, religion or association","body":"in any message — a guideline requirement, and already a charter commitment (Section 5.3.3, clauses 2 and 6)"},{"label":"Sending window **7am–7pm**, per market practice and DND norms"},{"label":"Every message carries a clear opt-out; opt-outs honoured immediately and permanently"},{"label":"Ward-tagged segmentation so a message about mango prices reaches Kitui West and not Kyuso"},{"label":"Personalisation by first name where consent covers it"},{"label":"Per-send audit trail retained, per the charter (Section 5.3.3)"}]}
```

#### The USSD layer

USSD works on every phone, requires no internet, and is close to free for the
voter. It is the single most under-used civic channel in Kenyan county
politics.

**Proposed menu — dialled on the campaign's USSD shortcode:**
```figure
id: fig-5-2-3-ussd-menu
```

**Why option 3 matters most.** The service-delivery tracker (Section 4.5.1) is
reachable from a feature phone in Mutha. A constituent reports a broken water
point by dialling a short code; the report enters a public register; the
campaign follows up and publishes the outcome. That is the M&E credential
operating in public, before the election, on the cheapest possible technology.

**Set-up:** 5–7 working days for a shared code; 2–4 weeks for a dedicated code
pending operator approval.

#### Voice and audio

* **Kikamba voice notes from Dr. Mulu** distributed by WhatsApp and by ward
champions to Bluetooth-share onward. Audio travels where text does not, and
carries the candidate's actual voice — the highest-trust format available.
* **Radio** — see Section 4.5.6.
* **Audio versions of all flagship policy content**, addressing both low
literacy (13.0% of the population never attended school) and low bandwidth.

#### The mobile-money agent network

Kenya's registered mobile-money agents grew from **480,216 in September 2025 to
602,470 in March 2026** — expanding roughly four times faster than
subscriptions. In rural Kitui, the agent kiosk is often the most reliable
commercial touchpoint in a settlement.

```visual
{"kind":"cards","preset":"agent","items":[{"title":"The mobile-money agent network: proposed use","text":"agent-sited printed materials carrying QR codes and the USSD","fields":[{"label":"Conditions","text":"- **This is a distribution channel, not a data channel.** The campaign does not seek, receive or process any customer data from agents. Nothing about transaction records, balances or customer identity enters this programme.\n- Participation is by the proprietor's consent and is disclosed as campaign material.\n- `[Confirm approach with campaign counsel — agent networks are regulated financial infrastructure and any commercial arrangement should be reviewed]`"}]}]}
```

#### KPIs for the offline layer

| Metric | Phase −1 | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|---|
| Consented SMS contacts | 15,000 | 40,000 | 80,000 | **120,000** |
| USSD unique sessions | Not live | 5,000 | 25,000 | 60,000 |
| Issue reports via tracker | Not live | 500 | 3,000 | 8,000 |
| Opt-out rate | <2% | <2% | <2% | <2% |
| Wards with active SMS presence | 15 | 40 | 40 | 40 |

**Opt-out rate is the health metric.** A rising opt-out rate means the campaign
is being experienced as spam, which damages the brand of rigour and
accountability the whole strategy rests on. It is treated as a red-flag KPI, not
a vanity one.

---

### 4.5.10 Workstream 10 — Digital organising and volunteers

```lead
**Outside this engagement.** Firefly's contribution is the metric definitions the leaderboard reports against, and nothing else.
```

> **Outside this engagement.** Volunteer recruitment, tiers, gamification and ward-champion
> management belong to the ground campaign, which already runs them. Firefly's contribution is
> the metric definitions the leaderboard reports against, and nothing else. The material below is
> retained as reference for the campaign's own coordinator, not as a Firefly deliverable.
>
> **Group: Ground and offline reach.**

*The volunteer programme reference (tiers, gamification, tooling and KPIs) is in Annex G.3.*
