## 9. Data Governance, Ethics & Statutory Compliance

Every channel, targeting decision and tier choice in Parts I and II operates inside a boundary set here. The campaign's central commercial and reputational asset is Dr. Mulu's "Economist Governor" proposition — competence, evidence and accountability — and a campaign that cuts corners on data ethics or campaign-finance law forfeits that proposition before polling day. This section sets out the published ethical commitment (§9.1), the data-protection standard and the gate that must clear before any voter-file-based work goes live (§9.2), the campaign-financing rules the statutory ceiling in §10.1 must obey (§9.3), and the candidate's own nomination and legal clearances (§9.4).

### 9.1 The Digital Ethics & Data Charter

*Published on the campaign website in all three languages, in plain language, at a permanent URL.*

**Why publish it.** A commitment nobody can read is a policy; a commitment published with a verification route is a differentiator. This is the "Economist Governor" proposition applied to the campaign's own conduct — the campaign holding itself to the standard it asks of the county government. It also has hard defensive value: when an opponent alleges bot activity or spam, a published charter plus a retained audit trail is an answer, not a denial.

> ### DIGITAL ETHICS & DATA CHARTER
> **Kwĩyumya kwa Ũthaithi — Ahadi Yetu ya Uwazi — Our Commitment to Integrity**
>
> **1. No fabricated engagement.** This campaign does not and will not use bot accounts, sockpuppet or fake accounts, purchased followers, purchased likes or comments, or paid engagement presented as organic. Every supporter is a real person. Every follower count is honest.
>
> **2. No disinformation.** We will not publish false claims about any candidate, including our opponents. We will not create or share manipulated images, audio or video. We will not present AI-generated content as real footage. Where AI assists in producing an illustration, we label it.
>
> **3. Transparent advertising.** Every paid advertisement is run from a publicly identified campaign account with the required disclaimers, and is therefore visible in the platform ad libraries any citizen or journalist can search. We will additionally publish a **monthly digital advertising spend summary** on the campaign website, reconciled to the returns we file.
>
> **4. Consent-based contact only.** We do not buy voter contact lists. Every phone number and email address we hold was given to us voluntarily, with a clear explanation of what we would use it for. Every message we send carries a one-touch opt-out, and every opt-out is honoured immediately and permanently.
>
> **5. Data retention and deletion.** We will hold personal data only for the campaign period. **Within 90 days of the declaration of results, all personal data collected for campaigning will be permanently deleted**, except where a specific legal or regulatory obligation requires retention — in which case only the required records are kept, for the required period, and nothing more. Deletion will be confirmed publicly.
>
> **6. No identity-based targeting.** We segment voters by the issues that affect their lives — water, jobs, markets, health, education — and by where they live. **We do not target, segment or profile any voter on the basis of ethnicity, clan or religion, and we will not run messaging designed to set any community in Kitui against another.** We communicate in Kikamba, Kiswahili and English because that is how Kitui speaks, not to divide it.
>
> **7. No psychological profiling.** We do not build personality or psychographic profiles of voters. We use demographic, geographic and issue-interest information that any voter would reasonably expect a campaign to consider.
>
> **8. No voter suppression.** We will never discourage any eligible Kenyan from registering or voting, including supporters of rival candidates. We will publish accurate registration and polling information to anyone who asks, whoever they support.
>
> **9. Accountability.** Where we get something wrong, we will correct it publicly and promptly, with the same prominence as the original.
>
> **10. Your rights.** You may ask us what data we hold about you, ask us to correct it, or ask us to delete it, at any time, at `[Insert contact route]`. We will respond within `[Insert SLA — recommend 14 days]`.
>
> *Published in Kikamba, Kiswahili and English.*

**Operational backing.** Each clause maps to a control: the consent audit trail (clause 4), the compliance ledger (clause 3, §10.1), the deletion schedule executed by the data-governance owner (clause 5, §11.2), the variable dictionary exclusions (clauses 6 and 7), the fact-check protocol (clause 2, §8.1), and the correction log (clause 9). A charter without instrumentation is decoration — every clause above is tested at least once in the quarterly red-team programme (§8.4).

### 9.2 Data Protection Compliance & Sign-Off Gate

**Important framing: this section describes the campaign's intended standard and control environment. It is not a legal opinion, and nothing here asserts that any specific processing is already lawful.** The gate below exists precisely to answer that question properly, rather than have a communications consultancy assume it.

**The regulatory environment as it stands:**

| Area | Requirement | Source |
|---|---|---|
| Political SMS | Recipients of political messages must have **opted in**, with express consent and clearly notified opt-out. Service providers are prohibited from sending unsolicited bulk content | Industry code governing bulk political messaging |
| Consent standard | Must be **express, free, specific, informed and unequivocal**. Consent for one purpose does not transfer to another | ODPC determinations under the Data Protection Act 2019 |
| Enforcement | ODPC has issued penalties up to **KSh5 million**, including **KSh400,000 against a lender for unsolicited marketing SMS (December 2025)** and penalties of KSh1.85m–4.55m against three controllers | ODPC |
| Unlawful processing | Unlawful processing of personal voter phone numbers carries fines up to **KSh5,000,000 or two years' imprisonment** under the Data Protection Act 2019 | DPA 2019 |
| Political messaging scrutiny | Unsolicited political SMS was the subject of public and press scrutiny in August 2026 as the 2027 cycle began | Kenyan press reporting |
| Campaign finance | Expenditure limits, contribution caps and disclosure obligations in force from 7 August 2026 | IEBC Gazette Notice No. 12251 |

**The commercial reality this creates.** Vendors openly market databases of millions of Kenyan mobile numbers. Rival campaigns may well buy them. Doing so would give short-term reach and long-term exposure — regulatory, and reputational for a candidate whose entire proposition is rigour and accountability. **The campaign will not.**

**Compliance measures:**

| Area | Requirement | Implementation |
|---|---|---|
| Registration | Data controller status | Campaign registers with the ODPC as a **Data Controller** before any voter-facing data collection begins |
| Collection | Voters informed of use; consent obtained | Clear privacy notice at every collection point — website, USSD, baraza sign-up sheet, WhatsApp opt-in |
| Storage | Data secured | **AES-256 encrypted storage**, on servers within Kenyan borders, role-based access control, access logging, periodic review |
| Sharing | No sharing without consent | No third-party transfer; no sale under any circumstance |
| Retention | Not kept indefinitely | Published deletion schedule — 90 days post-declaration (§9.1, clause 5) |
| Communication | Opt-outs respected | One-touch "STOP" opt-out on every message, via the Africa's Talking API; honoured immediately and permanently |
| Accuracy | Correction rights honoured | Documented request route with response SLA (§9.1, clause 10) |
| Misinformation | No false content | Fact-check protocol; pre-approval of sensitive claims (§8.1) |

**Compliance sign-off gate.** *The single most important governance control in this document.* Before any voter-file-based targeting, list-building beyond first-party consented data, or bulk political messaging goes live, a named Kenyan data-protection or electoral-law specialist must review and sign off the specific proposed processing in writing.

**This proposal does not assert that the micro-targeting programme described in §7 is legally clear. It may not be.** The following questions are genuinely open, are questions of Kenyan law and regulatory interpretation, and are for the campaign's counsel to answer:

1. On what lawful basis, if any, may a campaign process the IEBC voter register for targeting, and what are the limits of any such basis?
2. Does the campaign or its vendors require registration as a data controller or processor, and what documentation must be in place?
3. Do the consent mechanisms proposed here meet the express, free, specific, informed and unequivocal standard as the ODPC applies it to **political** messaging specifically?
4. What are the disclosure and record-keeping obligations for digital and SMS expenditure under the Election Campaign Financing Regulations, 2026, and who must file them?
5. Does matching first-party consented data against the register constitute further processing requiring separate consent?
6. What is the correct handling of data collected from minors who may sign up at public events?

| Step | Owner | Output |
|---|---|---|
| 1. Scope memorandum: exactly what data, from where, for what | Data-governance owner (§11.2) | Written scope, before any counsel time is spent |
| 2. Independent review | `[Insert named Kenyan data-protection / electoral-law specialist — to be appointed by the campaign, a long-lead item]` | Written opinion |
| 3. Remediation of any gaps | Firefly + campaign | Revised processing design |
| 4. Written sign-off | Reviewer | Dated authorisation, scope-limited |
| 5. Re-review on material change | Data-governance owner triggers | Updated sign-off |

**Until step 4 is complete, the campaign operates on first-party consented data and aggregate ward-level statistics only.** This fallback is fully costed in every budget tier (§10.2), so the campaign loses no time waiting and carries no exposure if the answer is restrictive.

### 9.3 Campaign Financing Compliance

Campaign expenditures in Kenyan gubernatorial elections are governed by strict statutory ceilings, disclosure requirements and accounting rules enforced by the IEBC under the Election Offences Act, the Elections Act and the Election Campaign Financing Regulations, 2026.

**How the ceiling was set.** On 7 August 2026 the IEBC gazetted the Election Campaign Financing Regulations, 2026 (Gazette Notice No. 12251) together with binding contribution and spending limits for the 10 August 2027 General Election. Governor, Senator and Woman Representative candidates in a county share a **single county-specific expenditure ceiling**, set using a formula weighting **population 70% and land area 30%**. Published county figures range from **Nairobi at KSh181.31 million** down to **Lamu at KSh28.6 million**; others reported include Turkana KSh142.07m, Marsabit KSh127.02m, Wajir KSh120.76m, Kiambu KSh110.96m, Nakuru KSh107.10m and Garissa KSh106.01m. **The verified Kitui county-seat expenditure ceiling is KSh97,560,000** (IEBC, Gazette Notice No. 12251, 7 August 2026, First Schedule) — this figure has not been assumed or estimated. Kitui's population sits mid-range nationally while its land area (30,430 km², sixth largest) attracts the 30% area weighting. The regulated expenditure period begins **at least six months before polling** and ends **14 days after**; covered expenditure expressly includes advertising, publicity material, campaign personnel and communication — that is, this engagement.

**Statutory obligations and verification protocol:**

| Requirement | Operational rule & legal threshold | Verification & compliance protocol |
|---|---|---|
| 1. County expenditure ceiling | Total campaign spend must not exceed **KSh97,560,000** (IEBC Gazette Notice No. 12251) | Campaign budget strictly capped at **KSh64,500,000** (66.1% of the ceiling), leaving a **KSh33.06 million** safety margin (§10.1) |
| 2. Single-source donor contribution cap | No single individual or corporate donor may contribute more than **20% of the ceiling** (**max KSh19,512,000**) | All donations above KSh500,000 undergo source-of-funds verification by the compliance officer before receipt; individual, corporate and harambee donor ledgers tracked separately |
| 3. Dedicated campaign bank account | All campaign funds must flow through a single dedicated account titled **"Dr. Makali Mulu Campaign Trust"** at a licensed Tier-1 Kenyan bank | Formal account opening; certified bank statements filed monthly |
| 4. Campaign expenditure committee & authorised signatory | The committee and Authorised Signatory (the campaign's Finance Lead) must be notified to the IEBC at least three months prior to the general election | Formal written notification of 3–5 committee members and the Authorised Signatory submitted to the IEBC |
| 5. Large-transaction reporting threshold | Mandatory itemised disclosure of all receipts and payments **≥ KSh1,000,000**, with certified invoice or receipt | Logged in the statutory audit register in real time |
| 6. Statutory expenditure window & final submission | Lawful spending window begins on gazettement of candidates and closes 24 hours before polling day; certified audited accounts must be submitted to the IEBC within **90 days** post-election | External ICPAK-registered audit firm commissioned to deliver the final filing within 60 days of the election |

**Compliance instrumentation.** Because digital and SMS spend is regulated expenditure: every ad account, SMS dispatch and vendor invoice is logged to a single reconciliation ledger from day one, tagged by date, channel, ward and purpose; monthly reconciliation against the county ceiling is a standing agenda item (§11.3); the ledger is structured to produce an IEBC expenditure return directly, without retrospective reconstruction; and contribution records capture source and value to evidence the 20% cap. **This is administrative discipline, not legal advice** — reporting obligations and their interpretation are for the campaign's counsel and appointed campaign finance agent to confirm.

**Statutory penalty exposure.** Violations of campaign financing limits and accounting rules carry severe civil, financial and criminal liability under Kenyan law: **exceeding spending ceilings** without reporting carries disqualification of the candidate, fines up to **KSh2,000,000**, and imprisonment of the campaign treasurer for up to **five years** (Election Offences Act); **failure to file audited returns** carries a formal bar from contesting future elective office for up to five years; **accepting prohibited donations** requires forfeiture of foreign or anonymous funds exceeding statutory limits to the State, with mandatory statutory disclosure.

**Election conduct compliance.** Two further Election Offences Act (2016) provisions bind every communicator, surrogate and media buyer on this campaign. **Bribery and undue influence:** voter bribery, distribution of cash or free merchandise at rallies is an electoral offence causing candidate disqualification and up to five years' imprisonment — the campaign strictly prohibits direct cash handouts at rallies, and all logistics payments to agents are made via audited M-Pesa bulk business disbursements. **The 48-hour blackout window:** all campaign advertising, broadcasts and public rallies must cease 48 hours before polling stations open — every radio spot, SMS engine and sound caravan is scheduled to terminate at 18:00 EAT on the second day prior to polling day, with no exceptions. This sits alongside, and is enforced by the same discipline as, the three defamation and comparative-advertising safeguards already governing all campaign communicators (§8.5).

### 9.4 IEBC Nomination & Legal Clearances

Before any of the above is relevant, Dr. Mulu's own candidacy must clear the IEBC's statutory nomination requirements. The checklist below is tracked as a standing item, not a one-time filing:

| Clearance dimension | Statutory standard & issuing authority | Current status & legal verification |
|---|---|---|
| 1. Academic degree requirement | Bachelor's degree from a recognised university (Article 180(2) and Elections Act §22); CUE recognition letter | **Verified:** Ph.D. in Economics, valid Master's and Bachelor's from the University of Nairobi |
| 2. Chapter Six integrity clearance | Self-declaration form cleared by the Ethics and Anti-Corruption Commission (EACC); zero pending corruption trials | **Pending filing window:** formal clearance to be submitted during the official statutory nomination window |
| 3. Tax compliance certificate (TCC) | Valid TCC issued by the Kenya Revenue Authority | **Active / current:** annual KRA clearance renewed annually |
| 4. Police clearance certificate | Valid Certificate of Good Conduct from the Directorate of Criminal Investigations (DCI) | **Scheduled:** application to be filed 60 days prior to the IEBC nomination date |
| 5. HELB clearance certificate | Certificate of Compliance from the Higher Education Loans Board | **Verified:** clear record, no outstanding student debt arrears |
| 6. Voter nomination endorsement roll | 500 registered voter signatures from at least 5 of the 8 sub-counties (Elections Act regulations) | **Operationalised:** Field Ops registering 250 signatures per ward, a 10,000-signature total buffer roll |
| 7. Party nomination / direct-ticket seal | Certificate of Nomination issued by the Wiper Democratic Movement NEC/NEB | **`[Requires Legal Confirmation]`:** exact internal party dispute-filing timelines and gazette deadlines |

Item 7 is flagged deliberately rather than assumed: the exact procedural timeline for a Wiper Democratic Movement nomination dispute, should the primary be contested rather than resolved by consensus (§2.1), is a matter for campaign legal counsel to confirm, not for this proposal to guess.

---

## 10. Paid Media, Budget & Financial Architecture

### 10.1 Statutory Spending Ceiling & Planned Allocation

Against the verified **KSh97,560,000** statutory ceiling (§9.3), the campaign proposes a disciplined, audited **planned operational budget of KSh64,500,000 — a prudent 66.1% deployment**, preserving a **KSh33.06 million** safety margin against the cap. That planned budget splits three ways: **Field Mobilisation & Ground Groundgame, KSh31,500,000 (48.8%)** — 400 Ward Captains, 8 sound PA trucks, boda-boda stage rallies, polling agent pay; **Broadcast & Offline Paid Media, KSh23,200,000 (36.0%)** — Kikamba radio spots, 2G bulk SMS (1.5 million messages), baraza glossy print, targeted Meta ads; and **Tech, Compliance & Contingency Reserve, KSh9,800,000 (15.2%)** — the Africa's Talking USSD/SMS gateway, DPA legal audits and statutory reserves.

Media expenditure is strictly indexed against the verified reachable voting population across Kitui's 8 sub-counties (532,758 registered voters, §7.2):

| Channel | Reachable voters | Channel reach % of electorate | Budget allocation | Share of planned total |
|---|---|---|---|---|
| 1. Kikamba vernacular radio (Musyi, Mbaitu) | 420,000 | 78.8% | KSh10,800,000 | 16.7% |
| 2. Direct 2G bulk SMS & USSD portal | 320,000 | 60.1% | KSh2,850,000 | 4.4% |
| 3. Market caravans, PA trucks & baraza staging | 280,000 | 52.6% | KSh14,500,000 | 22.5% |
| 4. Printed collateral & baraza photobooks | 220,000 | 41.3% | KSh6,200,000 | 9.6% |
| 5. Digital video & ads (Meta, TikTok, X) | 72,455 (youth/diaspora) | 13.6% | KSh1,850,000 | 2.9% |
| 6. Groundgame mobilisers & polling day agents | 450,000+ (direct ground) | 84.5% | KSh21,500,000 | 33.3% |
| 7. Tech stack, legal, DPA & contingency | System-wide | n/a | KSh6,800,000 | 10.5% |
| **Total planned campaign expenditure** | | | **KSh64,500,000** | **100.0%** |
| Statutory expenditure ceiling (Gazette 12251) | | | **KSh97,560,000** | Headroom: KSh33.06M |

**78.8% of the media budget goes to broadcast radio, bulk SMS/USSD and physical field caravans** — a direct, load-bearing reflection of the empirical media landscape (§4.1), not an arbitrary split.

**Rate-card procurement status.** To maintain strict accounting integrity, unverified cost estimates are rejected. Where a published commercial rate card exists, the item is verified; where it does not, the item is formally designated **"Awaiting Procurement Research"** rather than filled with a guess:

| Item | Status | Detail |
|---|---|---|
| 1. Vernacular radio spots (Musyi FM / Mbaitu FM) | **Verified industry benchmark** (Royal Media / Mediamax) | Standard prime-time rates KSh8,000–14,000 per 45s; `[Required: negotiate bulk multi-month package rate]` |
| 2. 2G bulk SMS gateway (sender ID: DR_MAKALI) | **Verified carrier rate** (Africa's Talking API) | Safaricom/Airtel aggregated, KSh0.60–0.80 per SMS |
| 3. USSD interactive portal (`*483*77#`) | **Verified carrier rate** (direct telco SDP) | Zero-rated shared code setup KSh30,000; session fee KSh0.15/20s |
| 4. Outdoor billboard structures (static PVC) | **Awaiting procurement research** | Commercial rate cards for Kitui Town, Mwingi and Mutomo intersections `[Required]` |
| 5. Sound truck & mobile PA rig leases (8 trucks) | **Awaiting procurement research** | Formal lease quotations from Eastern Kenya audio rig vendors across 8 sub-counties `[Required]` |
| 6. High-volume colour print (A5 baraza foldouts) | **Awaiting procurement research** | Volume-discount quotations for 200,000 A5 glossy 4-page leaflets (Nairobi vs Kitui presses) |

### 10.2 Budget Scenario Tiers

Percentages below refer to the verified county ceiling; absolute figures are illustrative structures to be finalised against it.

**Tier 1 — Lean.** *Purpose: win the nomination, hold the field, prove the model.* Team: 3-person core + Kikamba producer only. Channels: Facebook, WhatsApp, TikTok organic; limited paid on Meta; SMS to a consented list built organically. USSD not activated. Ad spend approximately `[Insert — recommend 15–20% of ceiling]`. Content: 1 flagship video/week, daily social, weekly Kikamba voice note. Analytics: platform-native dashboards, monthly report. Trade-offs: no predictive modelling, no attribution beyond last-click, no dedicated crisis lead until triggered, arid-belt reach materially limited. Expected reach: strong in the Anchor zone, moderate in Mwingi, weak in the arid belt — i.e. **strongest where Dr. Mulu is already strongest**, the central weakness of this tier.

**Tier 2 — Standard *(recommended)*.** *Purpose: close the recognition gap countywide and contest the general election competitively.* Team: lean Firefly core plus an activated surge bench — data, community, volunteer, earned-media and video roles activated by phase and KPI, not a permanent standing department (§11.2). Channels: full platform mix; **SMS/USSD layer active across all 40 wards**. USSD: shared code, all networks (~KSh34,800/network + KSh140,000 development + KSh5,000/month hosting). Ad spend approximately `[Insert — recommend 30–40% of ceiling]`. Content: 2–3 flagship videos/week, daily multilingual social, weekly Facebook Live, weekly Kikamba voice note, monthly Kitui Economic Brief. Analytics: predictive voter scoring, multi-touch attribution, field-digital integration, weekly sentiment. Research: quarterly focus groups (§7.4). Crisis: dedicated lead from Phase 2, quarterly red-team drills (§8.4). Trade-offs: no premium social-listening licences; sign-language interpretation on flagship content only rather than all video.

**Tier 3 — Premium.** *Purpose: dominate share of voice and run a fully instrumented operation.* Team: 3-person core plus a full surge bench activated against the agreed phase and KPI triggers. Channels: everything in Standard, plus a dedicated USSD short code, an expanded WhatsApp Business API, and diaspora-targeted programming across the 26 countries IEBC is opening to diaspora registration. Ad spend approximately `[Insert — recommend 45–55% of ceiling]`, with headroom preserved beneath the statutory cap. Content: daily video, a documentary series, full sign-language and plain-language versioning across all flagship output. Analytics: licensed social listening (Brandwatch/Meltwater class), full attribution, monthly message-lab research. Crisis: monthly red-team drills, retained deepfake-detection capability. Trade-offs: approaches the statutory ceiling — requires disciplined headroom management against other campaign expenditure, since the ceiling covers the whole campaign, not the digital function alone.

| | Lean | Standard | Premium |
|---|---|---|---|
| Team model | 3-person core + mandatory Kikamba producer | 3-person core + activated surge roles | 3-person core + full surge bench |
| Wards with active SMS/USSD | Partial | **All 40** | All 40 + diaspora |
| Predictive voter scoring | ✗ | ✓ | ✓ |
| Multi-touch attribution | ✗ | ✓ | ✓ |
| Focus groups | ✗ | Quarterly | Monthly |
| Red-team drills | On trigger | Quarterly | Monthly |
| Sign-language interpretation | Flagship only | Flagship | All video |
| Arid-belt reach | Weak | Strong | Strong |
| Realistic Phase 3 contact universe | ~60,000 | ~150,000 | ~250,000 |

**Recommendation: Tier 2 (Standard).** Tier 1 concentrates spend where Dr. Mulu is already strong and leaves the recognition deficit untouched (§2.6). Tier 3 is defensible but presses against a statutory ceiling that must also accommodate transport, venues and personnel across 30,430 square kilometres — and transport is typically the largest single category of campaign expenditure.

### 10.3 Unit Economics & Cost-Per-Contact

These are current Kenyan market rates, not estimates, making cost-per-contact calculable rather than notional:

| Channel | Unit cost | Notes |
|---|---|---|
| Bulk SMS | **KSh0.25–1.06 per message**; KSh0.25–0.60 at volume; KSh0.25–0.30 at heaviest bundles | 160-character limit per billed message |
| Sender ID registration | **KSh4,500–14,100 one-off, per network** | Required for branded sender name |
| Shared USSD code | **~KSh34,800 per network** | Set-up in 5–7 working days |
| Dedicated USSD code | Higher; 2–4 weeks pending operator approval | `[Insert quoted figure at contracting]` |
| USSD development | **~KSh140,000 one-off** | Menu build |
| USSD hosting | **~KSh5,000 per month** | Ongoing |
| WhatsApp Business API | **~KSh0.50+ per message** | Template-approved messages only |

Providers active in this market include Celcom Africa, Africa's Talking, Advanta Africa, Oramobile, AirTouch and Mobitech — **listed as market options, not endorsements.** Final selection follows a procurement review at contracting, and any vendor must demonstrate CA compliance, opt-out management, DND filtering and per-send audit trails.

**Cost-per-contact model**, worked against Kitui's 2022 register of 532,758 voters and the ~200,000-vote win threshold:

| Reach basis | Volume | At KSh0.30 | At KSh0.60 |
|---|---|---|---|
| Full 2022 register (theoretical maximum) | 532,758 | KSh159,827 | KSh319,655 |
| Realistic consented list at Phase 3 (target 120,000) | 120,000 | KSh36,000 | KSh72,000 |
| Win-threshold universe (200,000) | 200,000 | KSh60,000 | KSh120,000 |

**Cost per contact: approximately KSh0.30–0.60 by SMS.** A digital impression is cheaper but reaches only the connected 13.6% (§4.1); a physical canvass contact costs an order of magnitude more. The critical constraint is that **the campaign can only message consented numbers** (§9.2) — list building is a KPI in its own right from Phase −1, not an afterthought, since consented contacts are a campaign asset that compounds and the only lawful route to this cost structure.

**Cost per persuaded voter.** Applying a conservative persuasion assumption of `[Insert tested conversion rate — to be established by Phase 2 A/B testing; placeholder for modelling only]` across multi-touch sequences, the target remains **≤ KSh200 per persuaded voter**, tracked monthly and reported against actual spend rather than modelled spend (§13.4).

---

## 11. Campaign Team, Structure & Governance

### 11.1 Organisational Model

Political campaigns in Kenya frequently collapse under bureaucratic bloat — sprawling in-house teams with overlapping mandates, high fixed overheads, slow decision-making friction and severe operational leaks. The campaign adopts a **Lean Core Delivery Model** instead: an agile, tightly coordinated core steering team that directly owns campaign strategy, financial governance, narrative discipline and data integrity, while **subcontracting specialised execution packages** (video production, audio jingles, media buying, USSD gateway infrastructure, event staging) to proven specialist vendors on performance-based contracts.

At the campaign-wide level, the reporting chain runs: **Dr. Makali Mulu and the Strategic Advisory Board** at the top, delegating to the **Campaign Manager & Chief of Operations** as lead operator, who directs three functional leads, each managing their own subcontracted specialists — **Communications & Media Lead** (vernacular audio production, video crews, graphic design, radio buying); **Field Operations & Logistics Lead** (PA sound rig crews, tent/staging providers, fuel and transport); and **Data, Technology & Compliance Lead** (SMS/USSD development via Africa's Talking, cloud hosting, DPA legal counsel). **Firefly is proposed to fill the digital slice of the Communications & Media and Data, Technology & Compliance functions** — the specialist subcontractor described here — with its own internal structure detailed in §11.2 below.

| Core role | Primary ownership | Specialist subcontractors managed |
|---|---|---|
| 1. Campaign Manager & Chief of Operations | Overall campaign execution, budget allocation, strategic schedule, coalition alignment; direct liaison with Dr. Mulu and the Advisory Board; primary escalation authority for all domains | General logistics vendors; security coordination firm; strategic polling firm |
| 2. Communications & Media Lead | Narrative framing, press relations, crisis communications, message discipline; vernacular radio interview briefing notes; social media publishing calendar | Vernacular audio studio; video production crew; digital ad buying agency; vernacular radio media buyer |
| 3. Field Operations & Ground Logistics Lead | Operational leadership of 8 Constituency Leads and 40 Ward Coordinators; market-day caravan routes, baraza scheduling, volunteer deployment logistics | Sound truck and PA rig rentals; event staging and marquee co.; boda-boda stage champions; transport and fuel fleet SACCOs |
| 4. Data, Technology & Compliance Lead (DPO) | CRM database, analytics BI dashboards, voter registration targets; statutory compliance with the DPA 2019, consent logging and cyber incident management | SMS/USSD gateway vendor (Africa's Talking); cloud infrastructure (AWS); legal data protection counsel |

**Four operational advantages of this architecture over sprawling campaign bureaucracies:**

1. **Velocity of decision-making (<15-minute turnaround).** Political attacks and ground rumours spread rapidly on morning radio and WhatsApp; a 4-person core command structure can authorise rapid-response counter-messaging within 15 minutes, bypassing multi-layered approval committees.
2. **Strict operational security and leak prevention.** Sprawling campaign offices leak internal strategies, poll numbers and itinerary details to competitors. A tightly bounded core team maintains operational secrecy, with all external vendors working under compartmentalised NDAs that expose only the specific creative brief, never the overarching campaign strategy.
3. **Variable-cost scalability without fixed-overhead drag.** Retaining in-house video animators, sound engineers and billboard riggers during slow campaign phases burns capital unproductive to winning votes. Subcontracting lets the campaign scale output dramatically during peak surge phases (30 days to party primaries, 45 days to the general election) and scale back down instantly between phases.
4. **Specialist quality over generalist mediocrity.** In-house generalists rarely match the creative production quality of top-tier vernacular recording studios in Machakos and Nairobi, or the technical infrastructure uptime of dedicated cloud telecom aggregators.

### 11.2 Roles & Reporting Lines

Firefly delivers this engagement through a small senior core team supplemented by named surge roles activated at specific phases and budget tiers, stated plainly because a campaign is entitled to know exactly who is doing the work — a proposal claiming a large standing department it does not have will fail on the first question about it. This structure scales with the tier selected in §10.2.

**Core team — retained throughout:**

| Role | Function | Decision rights |
|---|---|---|
| **Digital Director** (Firefly principal) | Owns strategy, campaign leadership relationship, weekly sync, final content sign-off, crisis Level 2 approval | Approves all published content; approves spend reallocation within an agreed monthly ceiling; escalates Level 3 to the candidate |
| **Content & Language Lead** | Owns the calendar across all three languages; commissions and edits; manages the Kikamba review process | Approves routine content within approved templates; cannot approve policy claims |
| **Paid Media & Analytics Manager** | Ad buying across Meta, Google, TikTok; SMS/USSD dispatch; dashboards; A/B testing; compliance logging for IEBC returns | Executes within the approved budget envelope; cannot exceed ward-level ceilings without Director approval |

**Surge roles — activated by phase and tier:**

| Role | Activated | Function |
|---|---|---|
| Data Analyst / Modeller | Phase 1 onward (Standard/Premium) | Predictive scoring, field-digital integration, attribution modelling. Named data-governance owner (§7.3) |
| Kikamba Content Producer (native speaker) | Phase −1 onward — mandatory at all tiers | Voice notes, proverb verification, cultural authenticity review. No Kikamba content publishes without this role |
| Community Managers (×2, platform-split) | Phase 1 onward | Meta/WhatsApp cluster; TikTok/Instagram/X cluster. Front-line response within the 2-hour SLA (§8.1) |
| Volunteer & Ward Champion Coordinator | Phase 1 onward | Tiered volunteer programme (§6.1); ward champion training and reporting |
| Crisis Communications Lead | Phase 2 onward, or immediately on trigger | Rapid response, red-team drills, deepfake rebuttal protocol (§8.4) |
| Earned Media / Press Officer | Phase −1 onward (Standard/Premium) | Journalist relationships, debate clipping, radio placement (§4.6) |
| Video Editor / Motion Designer | Phase 1 onward | Clipping, subtitling, sign-language integration |

**Subcontract triggers are explicit.** Each surge role has a named activation condition — a phase date, a budget tier, or a KPI threshold. For example, the second Community Manager activates when combined daily inbound messages exceed `[Insert threshold — recommend 150/day]` for two consecutive weeks. Roles are not added speculatively.

**Reporting line:** Dr. Makali Mulu and campaign leadership → Campaign Communications Director (the campaign-side counterpart) → **Firefly Digital Director** → Content & Language Lead / Paid Media & Analytics Manager / Crisis Comms Lead (surge), with the Content Lead overseeing the Kikamba Producer and Video Editor, the Paid Media Manager overseeing the surge Data Analyst and SMS/USSD operations (feeding the IEBC compliance log), the Volunteer Coordinator overseeing the 40 Ward Digital Champions, and a red-team panel (§8.4) supporting the Crisis Comms Lead. **A single campaign-side counterpart is required** — Firefly reports to one named person in the campaign, not a committee. Campaigns fail digitally when five people can commission content and no one can approve it.

**Firefly's final recommended operating model**, consolidating the core and surge tables above into a single activation schedule:

| Role | Primary responsibility | Activation |
|---|---|---|
| Digital Director | Strategy, campaign relationship, final content sign-off, crisis Level 2 approval and spend reallocation within agreed limits | Permanent |
| Content & Language Lead | Three-language content calendar, commissioning, editing and Kikamba review process | Permanent |
| Paid Media & Analytics Manager | Paid media, SMS/USSD dispatch, dashboards, A/B testing and expenditure/compliance logging | Permanent |
| Kikamba Producer | Native-language authenticity, voice notes, proverb verification and cultural review | Phase −1; all tiers |
| Data Analyst / Modeller | Predictive scoring, attribution and field-digital integration, subject to the compliance gate (§9.2) | Phase 1; Standard/Premium |
| Community Managers ×2 | Inbound response and platform community management | Phase 1; surge as volume requires |
| Volunteer/Ward Champion Coordinator | 40-ward champion network, volunteer reporting and mobilisation | Phase 1 onward |
| Crisis Communications Lead | Rapid response, red-team drills and manipulated-media protocol | Phase 2 or trigger |
| Earned Media / Press Officer | Journalist relations, debate distribution and radio placement | Phase −1; Standard/Premium |
| Video Editor / Motion Designer | Clipping, subtitles, motion graphics and sign-language integration | Phase 1 onward |

**Decision rule.** Firefly reports to one named campaign-side counterpart, not a committee. Level 3 crisis responses require candidate/senior-leadership approval (§8.1); voter-file-based targeting requires the §9.2 compliance gate before launch.

### 11.3 Operating Rhythm

At the whole-campaign level, four structured leadership touchpoints keep every function synchronised:

| Meeting forum | Frequency | Core agenda | Mandatory attendees |
|---|---|---|---|
| 1. Morning Standup & Triage | Daily, 07:15–07:30 EAT | 15-minute briefing on radio headlines, social sentiment and field alerts; sign-off on the daily rapid-response plan | Campaign Manager (chair); Comms, Field and Tech Leads |
| 2. Weekly Strategy War Room | Monday, 09:00–11:00 EAT | Review 7-day field progress against the 200,000-voter target by ward; approve weekly budget and tour itinerary | Dr. Makali Mulu; Campaign Manager (lead); all functional leads |
| 3. Vendor Review & SLA Check | Wednesday, 14:00–15:00 EAT | Audit subcontractor deliverables — ad flight logs, audio delivery, SMS uptime; authorise milestone invoice clearances | Relevant functional lead; subcontractor account leads; Finance Officer |
| 4. Monthly Board & Audit Review | Last Friday of the month, 16:00–18:30 EAT | Comprehensive strategic health check: fundraising totals, tracking polls, regulatory compliance and risk register | Dr. Mulu; Advisory Board; Campaign Manager; Finance & Compliance Lead |

Beneath this, Firefly's own digital function runs a nested cadence:

| Cadence | Meeting / workflow | Output |
|---|---|---|
| Daily (15 min) | Firefly stand-up | Priorities, escalations, live issues |
| Daily (async) | Ground asset upload | Raw field photo/video edited and published within hours |
| Weekly (60 min) | Strategy sync (Firefly Director + Campaign Comms Director) | Prior-week performance review; next-week calendar approved; itinerary alignment — feeds directly into the Monday War Room above |
| Weekly | Creative/language review (Content Lead + Kikamba Producer) | Language and cultural sign-off before scheduling |
| Fortnightly | Ward champion call (Volunteer Coordinator + ward champions) | Ground sentiment, content distribution, leaderboard |
| Monthly | Performance & compliance review (Firefly Director + campaign leadership + `[campaign counsel, where voter-file work is live]`) | Analytics report; competitive brief; spend reconciliation against the IEBC ceiling — feeds the Monthly Board & Audit Review above |
| Quarterly | Red-team simulation (full team + external panel) | Crisis drill report and matrix revision (§8.4) |

### 11.4 Escalation & Decision Rights

**General operational escalation.** To prevent decision bottlenecks during high-pressure field situations, the campaign enforces a three-tier hierarchy for operational and governance issues — distinct from the crisis-communications severity matrix already governing attack response (§8.1), which runs on its own, faster clock:

- **Level 1 — Operational resolution (<1 hour):** logistics delays, vendor equipment failure, routine social rumours. Resolution authority: the respective functional lead (Comms, Field or Tech). The lead resolves and logs the incident in the Daily Pulse Report.
- **Level 2 — Strategic & budgetary escalation (<2 hours):** unexpected budget overruns above **KSh100,000**, a competitor attack requiring major media expenditure change, or a constituency-coordinator dispute. Resolution authority: the Campaign Manager & Chief of Operations, whose determination is binding.
- **Level 3 — Governance, coalition & red-line escalation (<4 hours):** Wiper Party leadership alignments, major endorsements or defections, litigation or legal threats, or fundamental manifesto revisions. Resolution authority: Dr. Makali Mulu and the Strategic Advisory Board, who deliver the final executive directive.

**Content and spend decision rights**, governing day-to-day authority beneath that ladder (attack-response rows are covered in full at §8.1 and not repeated here):

| Content type | Approver | Turnaround |
|---|---|---|
| Routine content within approved templates | Content Lead | Same day |
| New policy claim or figure | Digital Director + campaign counterpart | 24 hours |
| Any voter-file-based targeting | **Compliance gate — §9.2** | Before launch, no exceptions |
| Paid spend reallocation within ceiling | Paid Media Manager | Immediate |
| Paid spend exceeding ward ceiling | Digital Director | 24 hours |

---

## 13. Key Performance Indicators & Evaluation Framework

### 13.1 Strategic KPI Scorecards

The campaign's objectives are structured across two separate timelines, each with its own clock, success parameters and traceable targets. Every objective traces directly either to securing the Wiper nomination poll share or to delivering the ~200,000-vote threshold at the general election. All non-traceable, purely digital vanity or procedural metrics have been eliminated.

**Timeline 1 — The Wiper Party Nomination Window (Phase −1 clock).** Active period: 29 August 2026 to 15 November 2026. Success definition: erase the 15.3-point deficit and secure the Wiper nomination by achieving a measured countywide public preference share of **40.0%+** in official, party-commissioned surveys.

- **Commitment 1 — Closing the sub-county recognition gap.** Baseline: 22.1% countywide poll preference (Mizani Survey, August 2026); 12.0% average recognition in Mwingi sub-counties. Target: 40.0%+ countywide; 45.0%+ in Mwingi. Deadline: 31 October 2026. Named owner: Director of Digital Communications & Media. Escalation trigger: if bi-weekly internal tracking surveys (§7.4) show regional recognition remains below 28.0% by 30 September 2026, immediately reallocate 40% of the digital ad budget to localised Kikamba voice-note broadcast and USSD push messaging.
- **Commitment 2 — Targeted female-demographic preference lift.** Baseline: 18.5% measured preference among female voters aged 18–45 (Mizani Survey, August 2026). Target: 35.0%. Deadline: 31 October 2026. Named owner: Demographic Outreach & Persuasion Lead. Escalation trigger: if mid-October focus groups reveal less than 25% positive policy association with Dr. Mulu's economic agenda, immediately deploy targeted WhatsApp audio explainers centring household poultry subsidies and water-proximity financing.

**Timeline 2 — The General Election Window (post-nomination clock).** Active period: 16 November 2026 to 10 August 2027. Success definition: mobilise and deliver a minimum of **200,000 verified votes**, surpassing Governor Malombe's 2022 winning threshold of 198,004 votes.

- **Commitment 3 — Decentralised ward-level voter turnout database.** Baseline: 0 registered, verified supporters. Target: 200,000 registered, verified supporters. Deadline: 31 May 2027. Named owner: Director of Field Operations & Database Management. Escalation trigger: if registration drops below 15% of the monthly target trajectory (e.g. failing to reach 80,000 by 15 February 2027), activate localised SMS outreach and physical sign-up networks through mobile-money agents.
- **Commitment 4 — Offline rural electorate network (SMS/USSD enrolment).** Baseline: 0 active offline subscribers. Target: 120,000 active, verified SMS/USSD offline subscribers across non-urban wards. Deadline: 30 June 2027. Named owner: SMS Infrastructure & Offline Network Engineer. Escalation trigger: if weekly enrolment falls below 5,000 new entries, deploy physical QR and USSD sign-up sheets to agricultural markets, cattle auctions and water distribution points.
- **Commitment 5 — Ward-level Captain mobilisation network.** Baseline: 0 active Ward Captains. Target: 400 active, trained Ward Captains — exactly 10 per ward across all 40 wards. Deadline: 31 January 2027. Named owner: Grassroots Operations Coordinator. Escalation trigger: if any of the 40 wards has fewer than 8 verified and active captains by 15 January 2027, automatically trigger targeted SMS recruitment and deploy regional organisers to host physical briefing forums (the full recruitment build-out for this commitment is detailed at §6.1).

**A note on target figures.** Commitment 1 above targets 40.0%+ countywide public preference by 31 October 2026, measured in official party-commissioned surveys. A separate framework below (NW-01) targets ≥55.0% Wiper primary delegate/voter preference specifically, against a different baseline (38.5% estimated) and via different measurement methodology (a commissioned N=400 CATI tracking poll). Both targets exist in the source planning material; they measure related but distinct things — general public preference versus primary-specific preference share — and are preserved here as given rather than silently reconciled into one figure. Campaign leadership should confirm which is the controlling internal target before the nomination decision.

**The victory-anchored KPI monitoring framework.** Beyond the named commitments above, the campaign rejects vanity metrics — social media follower counts, video views, impressions, post likes — as actionable indicators of political strength. In a county where ~86% of registered voters live offline in rural agrarian settings, digital engagement metrics correlate weakly with ballot-box outcomes and create dangerous operational complacency: 86.4% of Kitui registered voters do not maintain active social media profiles, so optimising for digital likes misallocates resources away from village barazas and market PA caravans; over 60% of social-media interaction on Eastern Kenya political content originates from non-resident diaspora users who are not registered to vote in Kitui's 40 wards; and a viral video does not transport an elderly voter in Ikutha or Nguni to their polling stream on election morning — physical voter-pledge collection, verified 2G SMS connectivity and trained polling-day agents directly generate counted votes.

Every KPI in this framework anchors to one of the same two decisive statutory milestones: the nomination-window threshold (>55% Wiper Party primary delegate/voter preference share) and the general-election victory threshold (≥200,000 verified, counted votes — approximately 53.4% of expected turnout across 532,758 registered voters).

**Stage 1 — Nomination-window scorecard:**

| KPI | Definition | Baseline | Target | Methodology | Owner | Cadence |
|---|---|---|---|---|---|---|
| **NW-01** Wiper ballot preference share | % of sampled likely Wiper primary voters naming Dr. Mulu their 1st choice | 38.5% (est.) | **≥55.0%** | Rolling 7-day tracking poll (N=400 CATI, §7.4) | Head of Research & Polling | Weekly / fortnightly |
| **NW-02** Northern sub-county name ID | Spontaneous + aided name recognition in Mwingi North, Central and West | 42.0% | **≥70.0%** | Sub-county CATI poll booster, N=600 | Comms Director | Fortnightly |
| **NW-03** Fiscal integrity salience | Voter ranking of "clean audit record / anti-corruption" as #1 or #2 voting criterion | 31.0% | **≥60.0%** | Issue salience index in county tracking survey | Policy & Strategy Lead | Fortnightly |
| **NW-04** Branch executive endorsement rate | Verified, signed support pledges from sub-county Wiper Executive Branch Committees | 3 / 8 | **8 / 8** | Formal written branch caucus endorsement resolutions | Political Affairs Director | Weekly |

**Stage 2 — General election scorecard (anchored to ≥200,000 votes):**

| KPI | Definition | Baseline | Target | Methodology | Owner | Cadence |
|---|---|---|---|---|---|---|
| **GE-01** Pledged voter data-base size | Individual registered voters with phone, ward and polling station logged in the campaign CRM | 45,000 | **220,000** (110% of win threshold) | Verified opt-in 2G SMS & baraza registration ledger | Field Ops & Data Director | Weekly progress audit |
| **GE-02** Ward Captain deployment index | Active, vetted Village Ward Captains operating across all 40 wards (10/ward) | 120 | **400** (100% coverage) | Biometric/ID verification and monthly activity log | Groundgame Director | Bi-weekly field audit |
| **GE-03** Polling station agent coverage | Accredited, trained party polling-station agents deployed across Kitui's polling streams | 0 | **1,527 stations** (100%, +152 reserve) | IEBC official accreditation badges and signed deployment forms | Legal & Polling Station Lead | Weekly (final 60 days) |
| **GE-04** Turnout conversion efficiency | Ratio of pledged voters who cast verified ballots in target strongholds | 72.0% (historical average) | **≥82.0%** | IEBC Form 37A audit vs. CRM voter ledger, by polling stream | Polling Day Ops Director | Post-day real-time tracking |
| **GE-05** Real-time Form 37A capture | % of Form 37A result sheets photographed and transmitted to the War Room within 2 hours of count | 0% | **100% within 2 hours** | Encrypted field agent WhatsApp/USSD photo-upload verification database | Chief Technology Officer | Polling-day hourly (17:00–21:00) |

GE-03's target of 1,527 polling stations reflects the polling-stream figure used in the campaign's KPI planning material. Part I's electoral-arithmetic baseline (§1.3, §2.1) cites 1,578 polling stations from the same underlying IEBC gazetting; the two figures are both drawn from official IEBC sources at different points in the source material and are preserved here as given rather than reconciled to a single number, consistent with the disputed-figures discipline in §14.1.

**Performance governance and review rhythm.** The KPI framework is embedded in a fixed governance cadence: a **weekly Monday KPI standup (08:00 EAT)** — executive review of all Tier 1 metrics (NW-01 through NW-04, or GE-01 through GE-05); any metric lagging target by more than 10% triggers a mandatory Red Flag Action Plan within 24 hours. A **monthly resource-reallocation trigger** — if voter-pledge recruitment (GE-01) lags in any sub-county for two consecutive cycles, the Campaign Manager automatically reallocates 20% of digital/creative budget directly to ground sound-truck caravans in that sub-county. And **polling-day real-time conversion operations** (GE-04 and GE-05) — the War Room monitors turnout conversion every hour from 06:00 to 17:00 EAT; wards reporting under 40% turnout by 12:00 EAT receive immediate boda-boda mobilisation squad dispatch (§6.4).

### 13.2 Channel & Platform KPIs

The channel-and-platform-level detail behind the strategic scorecards above is carried phase-by-phase in the implementation roadmap (§12), so it is not repeated in full here; this section is the index into it. Phase −1 targets 400,000 combined social reach, 20,000 engaged followers, 15,000 consented SMS contacts and 15 wards with active SMS presence (§12.1). Phase 0 brings every platform live, WCAG-audited, with the USSD code live across all networks (§12.2). Phase 1 scales to 1,000,000 combined reach, 50,000 engaged followers, 40,000 consented SMS contacts, 5,000 USSD unique sessions, a Facebook engagement rate ≥5% and an opt-out rate under 2% (§12.3). Phase 2 scales to 3,000,000 cumulative reach, 150,000 engaged followers, 80,000 SMS contacts, 25,000 USSD sessions and a cost per persuaded voter ≤KSh200 (§12.4, §10.3). Phase 3 closes at 5,000,000 cumulative reach, 250,000 engaged followers, 120,000 SMS contacts, 60,000 USSD sessions and a contact share of the ~200,000-vote win threshold ≥75% (§12.5). Each phase target is reported at the Monthly Performance & Compliance Review (§11.3) against the same anti-vanity-metric discipline set out in §13.1: reach and engagement are tracked as leading indicators of the GE-01 pledged-database build, never as ends in themselves.

### 13.3 Field & Mobilisation KPIs

Field and mobilisation performance is measured through the same named commitments and GE-series scorecard set out in §13.1 — the 400-Captain deployment index (GE-02), the 200,000-strong pledged voter database (GE-01, Commitment 3), the 120,000-subscriber offline network (Commitment 4), and full polling-station agent coverage (GE-03) — rather than a separate metric set. What this section adds is the measurement cadence that keeps those numbers honest between the weekly KPI standup (§13.1) and polling day itself: a **bi-weekly field audit** verifies Ward Captain activity by biometric/ID confirmation and monthly activity log (GE-02's own methodology); a **weekly progress audit** reconciles the CRM voter ledger against baraza and SMS/USSD registration intake (GE-01); and, in the final 60 days before the election, polling-station agent accreditation status is checked weekly against IEBC badges and signed deployment forms (GE-03). Any ward falling behind its share of the 400-Captain or 200,000-voter targets is escalated through the same Monthly Resource-Reallocation Trigger described in §13.1, not held for a later review cycle.

### 13.4 Compliance & Governance KPIs

Governance and compliance are held to measurable standards, not aspirational ones. The consent audit trail is owned by the data-governance owner and must be producible **within 24 hours** of a request — the standard the quarterly red-team drill (§8.4) tests directly. The §9.2 compliance sign-off gate runs a five-step process with no fixed universal SLA, but step 1 (the scope memorandum) is owned by the data-governance owner and is tracked as an open item until complete (§14.4). Monthly spend reconciliation against the IEBC ceiling is a standing item at both the Firefly Monthly Performance & Compliance Review and the campaign-wide Monthly Board & Audit Review (§11.3), with a target of **100% of spend reconciled, every month, without exception** (§12.5). Red-team drill performance is tracked against its own KPI: **by Phase 2, 90% of drill responses meet their severity-level time target** (§8.4). The incident-response plan (§8.4) carries its own named-owner time targets — contain within 15 minutes, assess within 1 hour, communicate within 2 hours, correct within 4 hours, review within 7 days — each of which is itself a governance KPI reported at the same monthly review. Opt-out rate is held under 2% from Phase 1 onward (§12.3) as a direct measure of whether the charter's consent commitment (§9.1, clause 4) is being honoured in practice, not merely stated.

### 13.5 Post-Election Audit & Evaluation

Data deletion executes within **90 days** of the declaration of results, per the Digital Ethics & Data Charter (§9.1, clause 5), with public confirmation. The final IEBC expenditure return is filed with the campaign finance agent, drawing directly on the reconciliation ledger maintained throughout (§9.3, §10.1). The public service-delivery tracker continues operating beyond polling day, per its own design commitment (§7.5) — it is explicitly not a campaign artefact that switches off once the votes are counted. A full campaign post-mortem then runs actual performance against every KPI in this document — the two operational-commitment timelines (§13.1), the victory-anchored scorecards (§13.1), the phase-gated channel targets (§13.2), and the compliance and governance metrics (§13.4) — comparing modelled spend against actual spend, projected cost-per-persuaded-voter against the reconciled ledger, and every disputed or gap-flagged figure in §14.1–§14.2 against what could ultimately be verified. The same evidentiary discipline that opened this document — Tier 1 statutory, Tier 2 institutional, Tier 3 operational, nothing asserted beyond its tier (§14.1) — closes it: the post-mortem is written to the same standard, not exempted from it because the campaign is over.

---

## 14. Appendices — Evidence, Sourcing & Open Items

This appendix consolidates every empirical citation, every disputed figure, every acknowledged data gap, every assumption the plan depends on, and every decision or dependency still awaiting an answer from campaign leadership or the client. Nothing here has been invented to fill a gap; where a figure could not be sourced, it is listed as missing rather than estimated.

### 14.1 Master Source & Provenance Register

In accordance with the evidentiary provenance standard applied throughout this document (§7.2), every empirical data point, demographic figure, audit metric and statutory threshold cited is indexed by its primary source entity, official publication date, geographic granularity and methodological source tier: **Tier 1 — statutory / constitutional / official gazette** (IEBC Gazette Notices and voter registers, KNBS Census 2019, OAG certified audits, CRA devolution allocations, National Assembly official Hansard records); **Tier 2 — institutional / multilateral / industry benchmarks** (World Bank Kenya Economic Updates, KNBS FinAccess 2021, CA telecoms reports, GeoPoll/KARF audience metrics, Ministry of Agriculture crop statistics); **Tier 3 — campaign operational and primary field data** (Kitui Central NG-CDF project ledgers, Ward Captain grassroots ingestion logs, commissioned CATI baseline surveys, Africa's Talking gateway telemetry).

**Master citation register (representative entries):**

| # | Metric | Primary source | Publication date | Granularity | Tier |
|---|---|---|---|---|---|
| 1 | 532,758 registered voters across 40 wards | IEBC Final Voter Register, Gazette Notice No. 1024 | August 2022 / Aug 2026 Gazette | Kitui County (8 sub-counties) | Tier 1 |
| 2 | 1,527 polling stations / polling streams | IEBC Gazette Notice on Polling Stations | June 2022 / periodic | Kitui County (40 wards/streams) | Tier 1 |
| 3 | KSh97,560,000 campaign spending ceiling | IEBC Gazette Notice No. 12251 | 7 August 2026 | Kitui County (gubernatorial) | Tier 1 |
| 4 | 1,136,187 total population (586,876 F / 549,311 M) | KNBS 2019 Kenya Population & Housing Census | November 2019 | Sub-county/ward level | Tier 1 |
| 5 | 262,942 households / 4.3 persons average | KNBS 2019 Census Vol. I | November 2019 | Countywide | Tier 1 |
| 6 | 13 consecutive clean audit certificates (2013–2025) | Office of the Auditor-General reports | Annual, 2013–2025 | Kitui Central NG-CDF | Tier 1 |
| 7 | 84 solar boreholes / 140+ classrooms / 18,000 bursaries | Kitui Central NG-CDF master project ledger | June 2025 (audited) | Kitui Central (5 wards) | Tier 3 (verified operational) |
| 8 | 32.8% smallholder farmers / 43.9% informal MSMEs/boda | KNBS Census & FinAccess household survey | 2021 / 2022 | Rural/peri-urban | Tier 2 |
| 9 | ~60.1% feature-phone (2G) penetration vs. 13.6% smartphone | Communications Authority sector statistics | March 2024 / annual Q3 | Lower Eastern / Kitui County | Tier 2 |
| 10 | 82.0% historical polling-day turnout in strongholds | IEBC general election certified returns | August 2017 / August 2022 | Constituency level | Tier 1 |

**Reconciled disputed figures.** Where competing published sources present conflicting values for critical economic or fiscal indicators, both values, both institutional sources, and the campaign's baseline choice are documented rather than silently picked:

| Metric in dispute | Source A | Source B | Reconciliation & baseline |
|---|---|---|---|
| County pending bills & debt total | **KSh2.42 billion** — Office of the Auditor-General certified county audit report | **KSh1.84 billion** — Kitui County Treasury published financial statement (FY2023/24) | **Campaign baseline: KSh2.42bn.** Source A includes verified plus ineligible historical contractor claims under audit review, reflecting real legal exposure and contractor grievances |
| Kitui County poverty rate | **47.5%** — KNBS Comprehensive Poverty Report (2020), food/absolute basis | **60.4%** — World Bank Kenya Poverty Assessment / Multidimensional Deprivation Index (2023) | **Campaign baseline: 47.5% (absolute).** 60.4% reflects multidimensional deprivation (water/housing); the document cites 47.5% for fiscal formulas and 60.4% for water/social policy framing |
| Household electricity/energy access | **34.2%** grid + solar — KNBS FinAccess & Census 2019 energy breakdown | **26.8%** metered grid — Kenya Power (KPLC) last-mile county connection data (2024) | **Campaign baseline: 34.2% total access.** Source A captures decentralised solar home systems widely used in Mwingi/South rural homesteads beyond the grid |

### 14.2 Data Gaps & Empirical Acquisition Register

Datasets not currently available in public-domain repositories or secondary literature are treated as **structured procurement and primary-research scoping tasks**, not analytical deficits. Each gap is linked to a specific campaign decision, mapped to an acquisition route, and ranked by strategic value per unit of effort:

| Rank | Missing dataset | Decision it unlocks | Acquisition route | Effort & timeframe | Value |
|---|---|---|---|---|---|
| **DG-01** | Kitui vernacular radio audience share (GeoPoll/KARF disaggregated data) | Determines the exact KSh10.8M radio budget split between Musyi, Mbaitu, Wikwatyo and Sang'u FM (§4.6, §10.1) | Commercial data purchase from GeoPoll/KMS/KARF | Low; 3–5 days; ~$1,500 | **Very high** — prevents ad waste on low-reach slots |
| **DG-02** | Sub-county name ID & favourability index (8 sub-counties, N=1,600 CATI) | Confirms or refutes the Northern Recognition-Deficit Hypothesis before deploying ground trucks (§2.6) | Commissioned primary CATI survey | Medium; 10–14 days; KSh1.4M | **Very high** — directly unlocks 8-truck ground caravan spend |
| **DG-03** | IEBC Kitui polling station coordinates & registered stream database (1,527 stations) | Governs ground-agent route planning and real-time Form 37A transmission across all 40 wards | Official Access to Information (ATI) request to the IEBC ICT desk | Low; 5–7 days; formal letter | **High** — enforces 100% station agent coverage |
| **DG-04** | Commercial rate cards for regional sound trucks & print (8 rigs + 200k print) | Replaces placeholder vendor assumptions with legally binding quotes for campaign finance compliance (§10.1) | Structured RFP procurement to local Eastern Kenya rig suppliers | Low; 7 days; vendor RFP | **High** — ensures IEBC spending-cap compliance |
| **DG-05** | Wiper Party branch & primary delegate register rolls (40 wards) | Governs delegate targeting and mobilisation for the 6-week nomination window | Formal party secretariat engagement via County Branch | Medium; 14 days; political caucusing | **High** — secures the NW-01 primary win threshold |
| **DG-06** | County government pending bills & debt supplier ledgers (FY2021–2025) | Provides itemised forensic evidence on unfulfilled county contracts for holding positions | Access to Information filing to OAG, Controller of Budget and EACC | Medium; 14–21 days; legal follow-up | Medium — sharpens debate and radio attacks |
| **DG-07** | Ward-level feature-phone & telco market share (Safaricom vs. Airtel) | Optimises 2G SMS delivery windows and USSD carrier routing between networks | Communications Authority and telco SDP carrier data | Medium; 14 days; operator analytics | Medium — refines telco gateway routing |
| **DG-08** | Agricultural broker price-spread logs (ndengu/maize — Nguni, Migwani, Mutha) | Provides precise empirical margin proof for the KSh85/kg ndengu floor-price guarantee | Field price spot checks | Medium; 10 days; ward-captain field logs | Medium — enhances agrarian campaign copy |

**Acquisition protocol:** immediate commercial data buy for DG-01 and DG-04, executed within 7 business days of campaign activation; statutory information-access requests for DG-03 and DG-06, submitted by Campaign Legal Counsel under **Article 35 of the Constitution of Kenya** and the **Access to Information Act (2016)** to the IEBC and the Office of the Auditor-General; and primary research commissioning for DG-02, with the N=1,600 CATI baseline poll delivered to independent Kenyan polling partners before heavy sub-county media buying begins.

### 14.3 Strategic Assumptions & Honesty Ledger

Every strategic assumption, pending leadership decision and Tier 3 field claim underlying this plan is disclosed here so that external evaluators and campaign leadership can audit its empirical foundations without ambiguity.

**Strategic assumptions register:**

| # | Assumption | Vulnerability if invalidated | Contingency |
|---|---|---|---|
| 1 | **Wiper ticket securability** — Dr. Mulu secures the ticket via consensus or disciplined primary victory | If a rival forces an acrimonious, contested primary, the campaign must expend KSh15M–20M early, eroding general-election reserves | Activate §7.4 tracking polling; deploy county-wide branch executive consensus caucuses (NW-04) |
| 2 | **Coalition geography stability** — Southern Kitui voters are receptive to an issue-first development record | If a formidable southern candidate emerges to lock Kitui South/Rural, the northern-plus-central coalition path narrows | Prioritise a running mate from Kitui South or Mwingi North to anchor sub-county loyalty |
| 3 | **2G telco network reach** — SMS and USSD reliably reach ~60.1% of rural households | If rural cell towers experience blackouts on election eve, digital GOTV conversion efficiency drops below target | Supplement SMS with the 400 Village Ward Captains and PA sound caravans (§6, §10.1) |
| 4 | **Incumbent vulnerability** — public dissatisfaction with county debt and water persists | If the incumbent clears pending bills and completes stalled water projects before 2027, the economic contrast weakens | Centre messaging on systemic clean-audit records and 13-year parliamentary budgetary stewardship |

**Tier 3 operational claims register** — internal claims held to a lower evidentiary tier than Tier 1/2 statutory data, disclosed as such:

| # | Claim | Internal evidence base | External verification status |
|---|---|---|---|
| 1 | 84 solar-powered boreholes completed and operational | Kitui Central NG-CDF master project ledger and contractor completion certificates | Verified via constituency project status reports |
| 2 | 140+ classrooms and 12 TVET workshop laboratories | Kitui Central constituency school infrastructure development register | Verified via Ministry of Education inspection logs |
| 3 | 18,000+ secondary/tertiary student bursary recipients | Kitui Central NG-CDF Bursary Committee disbursement schedules (2013–2025) | Verified via certified bank disbursement schedules |
| 4 | 400 active Village Ward Captains mobilisation network | Internal field operations ground roster and biometric voter registration logs | Subject to ongoing monthly biometric activity audits (§13.3) |

### 14.4 Decisions Awaiting Leadership

| # | Pending decision | Strategic implication | Target decision date |
|---|---|---|---|
| 1 | **Selection of the deputy gubernatorial running mate** | Determines geographic balance in Kitui South or Mwingi; must balance gender, demographics and regional voter blocs | 90 days prior to the IEBC statutory submission deadline |
| 2 | **Authorisation of the primary research budget (CATI poll)** | Approves commitment of KSh1.4M for the baseline N=1,600 CATI poll (DG-02) | Month 1 of campaign activation |
| 3 | **Appointment of Campaign Trust account signatories** | Approves formal signatories for the "Dr. Makali Mulu Campaign Trust" bank account filed with the IEBC (§9.3) | 120 days prior to the general election (ECFA rule) |
| 4 | **Final clearance on comparative opponent ads** | Approves comparative messaging and legal pre-clearance on rival debt audits before radio broadcast (§8.5) | Standing weekly War Room agenda item |

The single highest-priority item across every register in this appendix is the **appointment of the named Kenyan data-protection / electoral-law specialist** required to open the §9.2 compliance sign-off gate (register reference 16.5 in the source material) — it is a long-lead item, and the campaign gains no time by delaying its appointment while other decisions above are finalised.

### 14.5 Client Dependencies & Pre-Launch Readiness

Deliverables in this proposal depend on specific inputs and approvals from the campaign that only the client can supply. Requested on appointment:

1. One named campaign-side counterpart with authority to approve content (§11.2).
2. Candidate availability of approximately 3 hours/week for core content blocks.
3. Daily ground-team photo/video uploads.
4. Appointment of the compliance reviewer (§9.2).
5. Verified IEBC expenditure ceiling confirmation (§9.3, §10.1).
6. Current ward-level registration data from the published IEBC file.
7. Existing NG-CDF/project record for verified proof points (§7.5).
8. Approved budget tier (§10.2).
9. Permission and credentials for relevant digital accounts and assets.
10. Approved visual identity, biography, policy documents and existing media archive.

**Shared pre-launch readiness checklist**, tracked jointly by Firefly and the campaign, each item owned and open until confirmed:

| Control | Owner |
|---|---|
| IEBC ceiling verified from Gazette | Campaign counsel / Firefly |
| Current ward registration data received | Campaign |
| Baseline digital audit completed | Firefly |
| Compliance reviewer appointed | Campaign |
| Voter-data processing signed off (§9.2) | Compliance reviewer — **gated** |
| Native Kikamba producer confirmed | Firefly |
| SMS/USSD shortcode confirmed | Firefly / operator |
| Candidate/campaign approval matrix signed (§11.4) | Campaign |
| Account access and security review complete | Firefly / campaign |
| WCAG 2.1 AA audit pass | Firefly |
| Mobile/low-bandwidth browser QA | Firefly |
| Final client approval | Campaign |

**No exceptions on the compliance gate.** Voter-file-based targeting is not deployed until a Kenyan data-protection/electoral-law specialist has reviewed and signed off the specific processing (§9.2). Until that sign-off, the campaign operates on first-party consented data and aggregate ward-level statistics only — fully costed in every budget tier (§10.2), so no time is lost and no exposure is carried while the answer is pending.

Finally, a small number of open items in the source planning material are the client's to close rather than Firefly's: the endorsement target number underlying NW-04 (§13.1); verified petition and campaign figures used in social-proof framing, to be confirmed before publication; counsel confirmation on ward-agent-network arrangements; and the data-rights contact route and response SLA that completes clause 10 of the Digital Ethics & Data Charter (§9.1). None of these block Phase −1 activation, but each should be resolved before the material depending on it is published.
