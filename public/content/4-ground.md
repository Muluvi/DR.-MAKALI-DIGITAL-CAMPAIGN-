How field reporting and digital response feed each other, the SMS and USSD layer that reaches voters off the internet, and the volunteer and coalition programmes behind it.

## 4.1 Field and digital, working as one

Most campaigns run two separate operations: a ground team that knocks doors and
a digital team that buys ads. Neither learns from the other. The ground team
re-canvasses households digital already converted; digital keeps advertising to
voters the ground team has confirmed as committed opponents. In a county of
30,430 square kilometres, that duplication is unaffordable.

A campaign that operates field organizing and digital messaging as isolated silos will fail in a county where 86.4% of voters are offline. Digital content created in an air-conditioned command center in Nairobi or Kitui Town is worthless if it does not address the live anxieties voiced at the morning livestock auction in Nguni or the wellhead in Mutha.

The campaign establishes a **Closed-Loop Ground-Digital Integration Engine**. Field intelligence captured by the 40 Ward Coordinators directly dictates the daily digital and radio advertising content; conversely, digital and radio narratives are converted by field captains into physical talking points, print flyers, and audio notes distributed through local transport and commercial networks.

```
════════════════════════════════════════════════════════════════════════════════════
                  CLOSED-LOOP FIELD & DIGITAL INTEGRATION ENGINE
════════════════════════════════════════════════════════════════════════════════════

   INBOUND INTELLIGENCE PIPELINE              OUTBOUND AMPLIFICATION PIPELINE
 ┌───────────────────────────────┐          ┌───────────────────────────────┐
 │ 40 Ward Coordinators          │          │ Targeted Meta & TikTok Video  │
 │ 400 Ward Captains             │ ───────► │ Kikamba Radio Ads & Jingles   │
 │ Market Day Pulse Reports      │          │ Localized Direct 2G SMS       │
 │ Competitor Tracking Logs      │          │ WhatsApp Audio Bulletins      │
 └──────────────┬────────────────┘          └───────────────▲───────────────┘
                │                                           │
                ▼                                           │
 ┌──────────────────────────────────────────────────────────┴───────────────┐
 │                     WAR ROOM SYNCHRONIZATION HUB                         │
 │ • Incident Classification (Tiers 1-3) & Narrative Response               │
 │ • Rapid-Response Message Production & Fact-Checking                      │
 │ • Micro-Geofenced Ad Deployment (<4-Hour Turnaround)                     │
 └──────────────────────────────┬───────────────────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                     PHYSICAL DISTRIBUTION CHANNELS                       │
 │ • 1,200 Bodaboda Stage Champions  • Matatu / Sacco Commuter Routes      │
 │ • M-Pesa Kiosk Economic Desks     • Weekly Open-Air Market Caravans      │
 └──────────────────────────────────────────────────────────────────────────┘
════════════════════════════════════════════════════════════════════════════════════
```

### 4.1.1 What the 40 ward coordinators report, and how it is captured

The primary sensing mechanism of the campaign is the **40 Ward Coordinators**, who supervise the **400 Ward Captains** (10 per ward, Section 9.1.2). Each coordinator is equipped with a dual reporting channel: a **secure field WhatsApp bot** for smartphone-equipped coordinators in 3G/4G zones, and a **zero-rated USSD/SMS structured reporting tree** for offline/2G wards.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   WARD COORDINATOR FIELD REPORTING PROTOCOL                 │
├─────────────────────┬──────────────┬───────────────┬────────────────────────┤
│ Report Type         │ Frequency    │ Channel       │ Data Captured & Fields │
├─────────────────────┼──────────────┼───────────────┼────────────────────────┤
│ 1. Daily Ground     │ Daily        │ Encrypted SMS │ • Ward ID & Polling Stn│
│    Pulse (DGP)      │ by 18:00 EAT │ / USSD Tree   │ • Dominant Issue/Rumor │
│                     │              │               │ • Competitor Activity  │
│                     │              │               │ • Opt-in Supporter Cnt │
├─────────────────────┼──────────────┼───────────────┼────────────────────────┤
│ 2. Market Day Event │ Weekly on    │ WhatsApp Field│ • Crowd size estimates │
│    Audit (MEA)      │ Market Day   │ Bot / Voice   │ • Audio/video clips    │
│                     │ by 16:00 EAT │ Note Dispatch │ • Leaflet distribution │
│                     │              │               │ • Local leader feedback│
├─────────────────────┼──────────────┼───────────────┼────────────────────────┤
│ 3. Critical Threat  │ Real-Time    │ Direct Phone  │ • Opponent disinformation│
│    Flash (CTF)      │ (<30 mins)   │ / Red-Alert   │ • Security/clash alert │
│                     │              │ SMS Trigger   │ • Local defection risk │
├─────────────────────┼──────────────┼───────────────┼────────────────────────┤
│ 4. Weekly Ward Log  │ Weekly       │ Structured Web│ • Polling station grid │
│    & Supporter Roster│ (Sundays)   │ / Paper Sheet │ • Verified sign-up logs│
│                     │ by 20:00 EAT │ Ingestion     │ • Delegate loyalty map │
└─────────────────────┴──────────────┴───────────────┴────────────────────────┘
```

#### What Ward Coordinators Report:
1.  **Voter Sentiment & Dominant Anxieties:** E.g., *"Farmers in Kyuso are angry about uncollected green grams; opponents are claiming Dr. Mulu will eliminate county agricultural subsidies."*
2.  **Competitor Movement & Expenditure:** E.g., *"Opponent convoy visited Migwani market; distributed Ksh 500 notes to youth groups; promised new market shades."*
3.  **Ground Disinformation & Counter-Narratives:** E.g., *"Rumor circulating in Mutomo that Dr. Mulu's CDF bursary program excluded non-Kitui Central students."*
4.  **Field Inventory & Collateral Levels:** Current stock of Kikamba manifesto summary leaflets, posters, audio flash drives, and volunteer T-shirts.

#### Capture discipline, latency and suppression

* **Capture:** ward champions log outcomes via a simple mobile form —
four options, under thirty seconds per household. Complexity kills field
data collection.
* **Offline-first:** the form caches locally and syncs when signal returns.
Non-negotiable in Ikutha and Mutitu.
* **Latency target:** field outcomes reflected in digital targeting within
**24 hours**.
* **Suppression:** confirmed committed opponents are **removed from paid
targeting**, not messaged harder. This saves money and is the correct
practice.

---

### 4.1.2 From ground intel to a published response in four hours

When field intelligence reaches the War Room, it triggers an automated, standardized four-stage response cycle:

```
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                    THE 4-HOUR GROUND-TO-DIGITAL CYCLE                     │
  └───────────────────────────────────────────────────────────────────────────┘

   T + 00:00 ──► GROUND REPORT INGESTED
                 Ward Coordinator in Tseikuru logs competitor rumor via USSD.

   T + 01:00 ──► RAPID RESPONSE WAR ROOM TRIAGE
                 Comms Director assesses severity; verifies facts from Parliamentary
                 records (Tier 1 proof of CDF parity).

   T + 02:30 ──► CONTENT ASSET CREATION
                 Digital team produces:
                 • 30-second Kikamba video for TikTok/Facebook.
                 • 45-second audio note voiced by Dr. Mulu or respected elder.
                 • 160-character localized Kikamba SMS.

   T + 04:00 ──► SYNCHRONIZED MULTI-CHANNEL DEPLOYMENT
                 • Meta & TikTok Ads geofenced strictly to Mwingi North.
                 • Bulk SMS pushed to 14,000 consented voters in Tseikuru/Kyuso.
                 • Audio note pushed via WhatsApp to 40 Ward Captains for peer
                   forwarding at local tea kiosks and bodaboda stages.
                 • Talking point faxed/messaged to Musyi FM morning show panelists.
```

#### The loop, end to end

```
   FIELD                                    DIGITAL
   -----                                    -------
   Ward champion canvasses  ---------->  Contact outcome logged
   household                             (support/undecided/oppose)
        ^                                        |
        |                                        v
   Priority route                        Voter score updated
   delivered to                          (Section 6.2.4)
   champion's phone                              |
        ^                                        v
        |                                Ad audiences and SMS
   Highest-value  <----------------      lists re-segmented
   households first                      within 24 hours
```

---

### 4.1.3 Digital to field

* **Warm-lead routing:** voters who engaged with content, opened an SMS, or
completed a USSD session are routed to ward champions as priority doors.
* **Pre-briefing:** champions receive the issue the household engaged with —
water, bursaries, market fees — so the conversation starts where the voter's
interest already is.
* **Event conversion:** digital sign-ups for barazas are handed to ground
organisers with attendance follow-up.

---

### 4.1.4 Who governs the loop, and the KPI that holds it honest

* Field data is campaign first-party data, collected with notice, and governed
by the same charter as all other personal data (Section 6.5.2).
* Ward champions receive data-handling training before being issued the form,
and cannot export or retain contact data on personal devices.
* **Field validation match rate ≥ 85%** is the joint KPI holding both sides
honest: if the model and the doorstep disagree, the model is wrong.

---

### 4.1.5 Distribution beyond social media

To bypass digital connectivity barriers, the campaign turns physical transportation, trade, and civic networks into active information distribution conduits:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PHYSICAL & CIVIC DISTRIBUTION INFRASTRUCTURE                │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 1. The Boda Boda Stage Network (1,200 Stage Champions)
*   **Infrastructure:** Over 12,000 youth in Kitui operate commercial motorcycles, organized into distinct stage associations (*masese*).
*   **Operational Role:** The campaign identifies 1,200 "Stage Champions" (30 per ward) across all 40 wards.
*   **Execution:**
    *   Champions receive high-visibility reflective campaign vests branded with "Uchumi na Kazi" and safety helmets.
    *   Equipped with mobile phone charging hubs at stages, playing looped Kikamba campaign audio podcasts and speeches to passengers awaiting transport.
    *   Act as rapid physical distributors of print materials to remote interior villages inaccessible by four-wheel vehicles.

#### 2. Matatu & Sacco Commuter Transit Routes
*   **Infrastructure:** Matatu SACCOs connecting Kitui Town, Mwingi, Mutomo, Nairobi, and Mombasa (e.g., Kitui Classic, Mwingi Travelers, TSS, Buscar).
*   **Operational Role:** Capturing passengers during long transit journeys (3–6 hours).
*   **Execution:**
    *   Provision of branded onboard audio USB flash drives to matatu drivers featuring popular Kamba secular and gospel music interspersed with 60-second policy messages from Dr. Mulu.
    *   Placement of seatback information cards in commuter vans detailing Dr. Mulu's 5-point Economic Charter.

#### 3. Weekly Market Days & Caravan Circuits
*   **Infrastructure:** The 40 major market centers rotating across the county weekly.
*   **Operational Role:** Concentrated voter aggregation points.
*   **Execution:**
    *   Coordinated arrival of the *Mulu Economic Caravan* sound trucks at 10:00 AM on market days.
    *   Ward Coordinators lead door-to-door merchant walk-throughs, distributing Kikamba business charters to shopkeepers, vegetable vendors (*mama mboga*), and hardware dealers.

#### 4. Community Barazas & Chief's Gatherings (Protocol-Compliant)
*   **Infrastructure:** Monthly administrative barazas convened by National Government Administrative Officers (NGAO—Chiefs and Assistant Chiefs).
*   **Operational Mandate & Civility:** Campaign teams respect that civil service barazas are strictly non-partisan by law.
*   **Execution:**
    *   Ward Captains attend barazas as active community citizens to listen to localized grievances (water, security, relief food).
    *   Post-baraza informal engagement: Engaging elders and attendees outside official proceedings, answering questions, and sharing Dr. Mulu's policy solutions for the specific community issues raised during the baraza.

---

### 4.1.6 The operating rhythm

To maintain operational tempo across 8 constituencies and 40 wards, the campaign executes a strict, synchronized rhythm with assigned single-point-of-contact (SPOC) owners:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               CAMPAIGN OPERATIONAL RHYTHM & GOVERNANCE CADENCE                              │
├───────────┬──────────────┬──────────────────────────────────────────┬──────────────────────┬────────────────┤
│ Cadence   │ Time (EAT)   │ Forum / Operational Agenda               │ Primary Owner        │ Participants   │
├───────────┼──────────────┼──────────────────────────────────────────┼──────────────────────┼────────────────┤
│ **DAILY** │ 07:00–07:30  │ **Morning Radio & Rapid Response Triage**│ Communications Lead  │ Digital Team,  │
│           │              │ Review morning radio bulletins, overnight│                      │ Media Monitor, │
│           │              │ social trends, and assign rapid responses│                      │ Legal Advisor  │
│           ├──────────────┼──────────────────────────────────────────┼──────────────────────┼────────────────┤
│           │ 18:00–18:45  │ **Daily Field Pulse Ingestion**          │ Field Operations     │ 8 Constituency │
│           │              │ Aggregate 40 Ward Coordinator reports,   │ Director             │ Coordinators,  │
│           │              │ flag hot-spots, evaluate SMS quotas      │                      │ Data Analyst   │
├───────────┼──────────────┼──────────────────────────────────────────┼──────────────────────┼────────────────┤
│ **WEEKLY**│ Monday       │ **Strategic Command War Room**           │ Campaign Manager /   │ Candidate, All │
│           │ 09:00–11:30  │ Review 7-day tracking poll, approve weekly│ Dr. Makali Mulu     │ Departmental   │
│           │              │ radio/digital ad spend, set tour route   │                      │ Directors      │
│           ├──────────────┼──────────────────────────────────────────┼──────────────────────┼────────────────┤
│           │ Thursday     │ **Market Day Logistics Briefing**        │ Ground Logistics     │ Caravan Teams, │
│           │ 16:00–17:00  │ Finalize weekend caravan routes, collateral│ Lead               │ Sound Ops,     │
│           │              │ dispatch, sound truck maintenance        │                      │ Security Team  │
│           ├──────────────┼──────────────────────────────────────────┼──────────────────────┼────────────────┤
│           │ Sunday       │ **Faith & Community Review**             │ Religious Affairs    │ Church Liaison │
│           │ 17:00–18:00  │ Review Sunday church visits, clergy synod│ Director             │ Officers       │
│           │              │ feedback, prayer network alignment       │                      │                │
├───────────┼──────────────┼──────────────────────────────────────────┼──────────────────────┼────────────────┤
│**MONTHLY**│ 1st Saturday │ **All-Wards Field Leadership Baraza**    │ Campaign Manager     │ 40 Ward Coords,│
│           │ 10:00–14:00  │ In-person strategic review, voter sign-up│                      │ 8 Constituency │
│           │              │ audit, training, and stipend disbursement│                      │ Leads, DPO     │
│           ├──────────────┼──────────────────────────────────────────┼──────────────────────┼────────────────┤
│           │ Last Day     │ **Audited Budget & Provenance Review**   │ Finance Director &   │ Candidate,     │
│           │ of Month     │ Reconciliation of ad spend against voter │ Analytics Director   │ Compliance DPO │
│           │              │ acquisition cost; DPA compliance audit   │                      │                │
└───────────┴──────────────┴──────────────────────────────────────────┴──────────────────────┴────────────────┘
```

```
════════════════════════════════════════════════════════════════════════════════════
                        SECTION 10 STRATEGIC TAKEAWAY
════════════════════════════════════════════════════════════════════════════════════
 • Closed-Loop Engine:   Field intel from 40 Ward Coordinators feeds digital/radio
                         messaging within a 4-hour rapid response cycle.
 • Physical Conduits:    1,200 Bodaboda Stage Champions, Matatu audio flash drives,
                         and weekly market caravans ensure message delivery across
                         the 86.4% offline population.
 • Operating Discipline: Synchronized daily (07:00 triage, 18:00 pulse), weekly
                         (Monday War Room), and monthly governance rhythms guarantee
                         continuous operational accountability.
════════════════════════════════════════════════════════════════════════════════════
```

---

## 4.2 SMS, USSD and the offline majority

### 4.2.1 Why this layer decides the race

Kitui has **143,340 internet users out of a population of 1,136,187** — 13.6%.
It has **452,948 mobile phone owners** — 42.9%. Nationally, smartphones are
63.7% of connected devices, meaning feature phones remain a substantial share,
and disproportionately so in rural, older and lower-income populations.

Put plainly: **a purely digital campaign in Kitui addresses roughly one in
seven residents, and the six it misses are concentrated in exactly the wards
where Dr. Mulu's recognition deficit is largest.**

This is not an equity footnote. It is the central strategic problem of
campaigning in this county, and solving it is the clearest demonstration of the
"Economist Governor" proposition: allocating resources to where the need is,
rather than where measurement is convenient.

### 4.2.2 The SMS layer

**Consent-first architecture.** Every number in the campaign database arrives
by opt-in: a USSD self-registration, a signed baraza sheet with a clear data
notice, a WhatsApp opt-in confirmation, a website form, or a missed-call
opt-in. **No purchased lists. Ever.** See Sections 3.5.4 and 16.5 for the
regulatory basis; the short version is that the industry code requires express
opt-in for political messages and the ODPC has demonstrated willingness to
penalise unsolicited messaging.

**Message architecture** — 160 characters, three languages, ward-tagged:
| Type | Frequency | Example structure |
|---|---|---|
| **Policy drop** | Weekly | One issue, one commitment, one verification promise |
| **Kikamba community message** | Fortnightly | Proverb or idiom + policy anchor |
| **Registration drive** | Phase-specific | Deadline, nearest centre, what to bring |
| **Event notice** | As scheduled | Ward-targeted baraza details |
| **GOTV sequence** | Final 30 days | Countdown, polling station, time |
| **Rapid rebuttal** | On trigger | Fact correction, plain language |

**Operational discipline:**
* Sending window **7am–7pm**, per market practice and DND norms
* Every message carries a clear opt-out; opt-outs honoured immediately and
permanently
* Ward-tagged segmentation so a message about mango prices reaches Kitui West
and not Kyuso
* Personalisation by first name where consent covers it
* Per-send audit trail retained for the compliance ledger

**Cost:** at KSh0.25–0.60 per message, a fortnightly touch to 120,000 consented
voters costs approximately **KSh30,000–72,000 per send** — see Section 9.2.3.

### 4.2.3 The USSD layer

USSD works on every phone, requires no internet, and costs the voter almost
nothing. It is the single most under-used civic channel in Kenyan county
politics.

**Proposed menu — `*[Insert shortcode]#`:**
```
KITUI NA MULU
1. Sisemo sya Mulu / Mulu's plan for my ward
2. Andikithya kuvota / Voter registration info
3. Ripoti wia / Report a local issue      <-- Section 8.5
4. Kuthukuma / Volunteer
5. Kwithukiisya / Get updates (opt-in)
6. Kiswahili / English
```

**Why option 3 matters most.** The service-delivery tracker (Section 8.5) is
reachable from a feature phone in Mutha. A constituent reports a broken water
point by dialling a short code; the report enters a public register; the
campaign follows up and publishes the outcome. That is the M&E credential
operating in public, before the election, on the cheapest possible technology.

**Cost:** shared code approximately **KSh34,800 per network**, development
approximately **KSh140,000**, hosting approximately **KSh5,000 per month**.
Set-up in 5–7 working days for a shared code; 2–4 weeks for a dedicated code
pending operator approval.

### 4.2.4 Voice and audio

* **Kikamba voice notes from Dr. Mulu** distributed by WhatsApp and by ward
champions to Bluetooth-share onward. Audio travels where text does not, and
carries the candidate's actual voice — the highest-trust format available.
* **Radio** — see Section 3.4.
* **Audio versions of all flagship policy content**, addressing both low
literacy (13.0% of the population never attended school) and low bandwidth.

### 4.2.5 The mobile-money agent network

Kenya's registered mobile-money agents grew from **480,216 in September 2025 to
602,470 in March 2026** — expanding roughly four times faster than
subscriptions. In rural Kitui, the agent kiosk is often the most reliable
commercial touchpoint in a settlement.

**Proposed use:** agent-sited printed materials carrying QR codes and the USSD
short code, offered on a straightforward commercial or voluntary basis with
proprietor consent, in wards with the lowest connectivity index.
* **This is a distribution channel, not a data channel.** The campaign does not
seek, receive or process any customer data from agents. Nothing about
transaction records, balances or customer identity enters this programme.
* Participation is by the proprietor's consent and is disclosed as campaign
material.
* `[Confirm approach with campaign counsel — agent networks are regulated financial infrastructure and any commercial arrangement should be reviewed]`


**Targets for the offline layer are in the consolidated KPI ledger at Section 8.2.4.**

## 4.3 Digital organising and volunteers

A tiered volunteer programme converting passive online supporters into active
offline organisers, with gamification driving sustained engagement.

### 4.3.1 Volunteer tiers

| Tier | Name | Entry requirement | Activities |
|---|---|---|---|
| **1** | Digital Advocate | Follow on 2+ platforms | Share, comment, amplify |
| **2** | Ward Champion | Join ward WhatsApp group + data-handling briefing | Distribute content, report ground sentiment, recruit 5 advocates |
| **3** | Community Organiser | Complete online training module | Host groups, coordinate local events, **log canvass outcomes (Section 4.1)** |
| **4** | County Coordinator | Manage 3+ organisers | Oversee regional operations, attend weekly syncs |

**Data-handling training is a gate, not an option.** No volunteer collects
personal data before completing it (Section 6.5.2).

### 4.3.2 Gamification mechanics

| Mechanic | Implementation | Reward |
|---|---|---|
| Points | Awarded for shares, sign-ups, training completion, verified registration drives, canvass returns | Merchandise, recognition |
| Leaderboards | Ward and county rankings published weekly in WhatsApp groups | Public recognition, tier advancement |
| Badges | Milestones — "10 Voters Registered," "Content Creator," "Ward Champion" | Profile display, sharing |
| Streaks | Daily engagement tracked via WhatsApp bot | Bonus points, spotlight features |

**Integrity rule.** Points reward **verified real-world action** — a registered
voter, a canvassed household, a completed training — not raw posting volume.
Reward systems that pay for volume produce spam and, at scale, look
indistinguishable from inauthentic activity. That would breach both platform
policy and the Section 6.5.2 charter, and it is designed out from the start.

### 4.3.3 Management tooling

* **Custom WhatsApp bot** for low-cost volunteer management: registration,
point tracking, content distribution, leaderboards
* **USSD registration path** so volunteers without smartphones can join
(Section 4.2.3) — a genuine differentiator in the arid belt
* Forms and spreadsheets for baseline collection
* Task management via a shared board
* Purpose-built volunteer platforms only at premium tier, if budget allows


**Targets for the volunteer programme are in the consolidated KPI ledger at Section 8.2.4.**

## 4.4 The coalition and endorsement calendar

Coalitions are built around **shared economic and civic interests** — water,
credit, market access, employment, transparency. They are never built around
ethnic, clan or religious bloc identity. Faith and community networks are
engaged as **civic institutions with legitimate service-delivery concerns**,
which is both the ethical position and the effective one: a water commitment
made to a congregation is a policy conversation, while a bloc appeal is a
liability.

### 4.4.1 The sequenced calendar, and how endorsements are managed

| Phase | Target constituencies | Engagement | Digital output |
|---|---|---|---|
| **Phase −1** (Aug–Sep 2026) | Professional associations (economists, accountants, evaluators); Kitui teachers' networks; SEKU and MUT alumni | Roundtables on county fiscal management; leverage Evaluation Society of Kenya membership | Thought-leadership content; LinkedIn and X threads; earned media |
| **Phase 0** (Sep–Oct 2026) | Ward-level women's cooperatives and table-banking groups | Listening sessions; identify chairladies as Tier 3 organisers | Kikamba voice notes; testimonial series |
| **Phase 1** (Oct–Dec 2026) | MSME and market traders' associations (Kitui Town, Mwingi, Mutomo, Kabati, Kyuso) | Licensing, cess and market infrastructure forums | Policy briefs; Facebook Live Q&A |
| **Phase 1–2** | Youth groups, boda boda SACCOs, TVET student bodies | Enterprise and licensing sessions | TikTok series; first-time-voter drive |
| **Phase 2** (Jan–Mar 2027) | Farmer and livestock cooperatives; water user associations | Input supply, sand dams, drought and flood resilience | Ward-specific video; SMS policy drops |
| **Phase 2** | Faith leaders across denominations | Service delivery, integrity, civic participation — **issue-based, never sectarian** | Community-programming content |
| **Phase 2–3** | Diaspora chambers and associations | Investment, remittance, **the expansion of diaspora registration from 12 to 26 countries** | Webinars; diaspora fundraising |
| **Phase 3** (Apr–Aug 2027) | Consolidation and public endorsement sequencing | Staged announcements for sustained news cycles | Endorsement content series |

#### Managing endorsements

* Every endorsement is **voluntary, documented and disclosed**. No paid
endorsement is presented as organic — a breach of platform policy and of the
Section 6.5.2 charter.
* Influencer partnerships carry clear paid-partnership disclosure.
* Endorsements are sequenced for cadence rather than clustered, sustaining
momentum across the nomination and general-election windows.

---

**Targets for coalitions and endorsements are in the consolidated KPI ledger at Section 8.2.4.**
