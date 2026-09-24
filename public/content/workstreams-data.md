## 5.2.4 Data and technology


Four workstreams that sit under the rest: the data model, the voter model built on it, the technology stack that runs both, and the analytics layer that measures what the other ten produce.

### 5.2.4.1 Workstream 11 — The data layer

> **Owner: Firefly**, as processor on the campaign's behalf, under a written processing agreement
> (Section 5.7.5).


A modern, high-precision political operation requires an infallible data layer. The campaign rejects arbitrary spreadsheets, unverified voter claims, and ad-hoc phone lists. In their place, the strategy establishes a centralized, structured database architecture governed by strict mathematical provenance, audit trails, and rigorous adherence to Kenyan privacy legislation.

This section defines the voter and supporter data model and the legal compliance workflows under Kenya's **Data Protection Act (DPA) 2019** and the **Office of the Data Protection Commissioner (ODPC)**. The three-tier provenance standard that grades every figure in this proposal (Section A.1.1) and the protocol for when two sources disagree (Section A.1.3) are set out alongside the evidence they govern.

```figure
id: data-layer
```

#### The voter and supporter data model

The campaign database is organized around a relational, entity-attribute-value schema optimized for speed, geographic aggregation, and privacy segmentation. Every supporter record is linked to an exact geographic locus and carries timestamped consent metadata:

```figure
id: supporter-schema
```

##### Key Architecture Principles:
1.  **Strict Anonymization & Encryption at Rest:** PII (Personally Identifiable Information), including mobile MSISDNs, is encrypted using **AES-256-GCM**. Read-only analytic dashboards (such as ward target monitors) access only hashed identifiers (`msisdn_hash`) and geographic aggregates.
2.  **Granular Geographic Tagging:** No supporter entry exists in a vacuum; every record MUST map to an explicit Constituency, Ward, and Polling Station.
3.  **Audit Trail Logging:** Every modification to a voter's `support_status` or contact detail logs the modifying user ID, timestamp, and field collection source.

#### The Data Protection Act 2019, applied

Political messaging, bulk SMS broadcasting, and voter profiling operate under strict statutory oversight in Kenya. Non-compliance risks severe criminal penalties, regulatory injunctions, and catastrophic brand damage to Dr. Mulu's integrity-driven platform.

```figure
id: dpa-compliance
```

##### Mandatory Compliance Safeguards:
1.  **Ban on Commercial Database Ingestion:** The campaign strictly forbids purchasing or scraping phone directories, bank lists, student registers, or church rosters. Ingesting non-consented bulk phone numbers is a direct violation of Section 5.2.1.4 of the DPA 2019.
2.  **Automated Opt-Out Processing:** Any inbound SMS containing "STOP", "SIMAMA", "ONDOKA", or "CANCEL" is automatically processed by a webhook within 15 seconds, toggling `opt_out_status = True` and permanently halting outbound SMS transmissions.
3.  **Data Protection Officer (DPO):** The Campaign Secretariat will formally designate a certified Legal & Data Protection Officer to supervise all database access logs, consent registries, and vendor contracts.

---

### 5.2.4.2 Workstream 12 — Predictive voter modelling

> **Owner: Firefly — gated on Section 5.7.9.** Until written sign-off, this runs as **ward-level
> aggregate scoring only**, which delivers most of the targeting value at a fraction of the
> exposure. Individual-level scoring waits for the opinion.


#### What the model scores, and why

The campaign will build a model scoring registered voters in Kitui County on
two dimensions: likelihood to support Dr. Mulu and likelihood to turn out. This
moves the campaign from broad messaging to disciplined prioritisation of
persuasion and mobilisation effort.

**This entire section is conditional on the compliance gate in Section 5.7.9.**
No voter-file-based targeting is deployed until a Kenyan data-protection or
electoral-law specialist has reviewed and signed off the specific proposed
processing. Nothing in this section should be read as a claim that such
processing is already permissible.

#### Data sources

* **IEBC Voter Register:** name, gender, age bracket, polling station, ward,
constituency, historical turnout flags — **subject to lawful access and the
Section 5.7.9 gate**
* **KNBS Census and county statistics:** ward-level demographics, education,
household characteristics, economic activity
* **Historical results:** ward and polling-station results from 2017 and 2022
to identify patterns and swing areas
* **Campaign first-party data:** interactions with campaign content, WhatsApp
membership, **SMS/USSD opt-ins**, volunteer sign-ups — all
consent-based
* **Field canvass returns** (Section 5.2.3.2)

**Explicitly excluded:** purchased third-party contact lists, scraped number
databases, and any inferred psychographic or personality attributes. Vendors
openly market bulk Kenyan mobile-number databases; the campaign will not buy
them. See Section 5.7.8.

#### Modelling methodology

| Model | Purpose | Strength |
|---|---|---|
| **Logistic regression** | Baseline support and turnout scores | Interpretability; identifies driving variables |
| **Random forest** | Non-linear pattern detection | Captures interactions; robust to outliers |
| **Gradient boosting (XGBoost)** | Final ensemble scoring | Highest predictive accuracy at scale |
| **Propensity score matching** | Volunteer conversion | Estimates causal effect of touchpoints on offline action |

Final output: an ensemble probability score (0–1) for support likelihood and
turnout likelihood.

#### Model variables

| Variable | Description | Source | Type | Format |
|---|---|---|---|---|
| `voter_id` | Unique identifier (hashed) | IEBC register | String | Alphanumeric |
| `gender` | Voter gender | IEBC register | Categorical | M/F |
| `age_bracket` | Age grouping | IEBC register | Categorical | 18–24, 25–34, … |
| `ward_code` | Electoral ward | IEBC register | String | 3-digit |
| `constituency` | Constituency | IEBC register | Categorical | 8 values |
| `subcounty` | Sub-county | Census | Categorical | 18 values |
| `polling_station` | Station identifier | IEBC register | String | Unique code |
| `turnout_2017` | Turned out 2017 | IEBC results | Binary | 0/1 |
| `turnout_2022` | Turned out 2022 | IEBC results | Binary | 0/1 |
| `ward_poverty_rate` | Ward poverty headcount | KNBS | Continuous | 0–100 |
| `ward_literacy_rate` | Adult literacy | KNBS | Continuous | 0–100 |
| `ward_water_access` | % households, improved water | KNBS | Continuous | 0–100 |
| `ward_connectivity_index` | **Internet/mobile use proxy — drives channel selection** | KNBS/CA | Continuous | 0–100 |
| `population_density` | Persons per km² | Census | Continuous | 9–251 |
| `household_size` | Average household size | Census | Continuous | 3.6–4.9 |
| `digital_engagement_score` | Composite of interactions | Campaign (consented) | Continuous | 0–100 |
| `sms_optin_status` | **Consented to SMS contact** | Campaign | Binary | 0/1 |
| `whatsapp_group_member` | Campaign group member | Campaign | Binary | 0/1 |
| `volunteer_status` | Sign-up status | Campaign | Categorical | None/Inactive/Active |
| `field_contact_outcome` | **Canvass result (Section 5.2.3.2)** | Field team | Categorical | Support/Undecided/Oppose/No contact |
| `support_score` | Predicted support (output) | Model | Continuous | 0–1 |
| `turnout_score` | Predicted turnout (output) | Model | Continuous | 0–1 |

**No psychographic, personality, ethnic, clan or religious variable appears in
this dictionary, and none may be added.** The `ward_connectivity_index` is the
most operationally important addition — it determines whether a scored voter is
reachable digitally or must be reached by SMS, USSD or radio.

#### How the model is evaluated

| Metric | Target | Frequency |
|---|---|---|
| Area under ROC curve (AUC) | ≥ 0.75 for support score | Monthly |
| Precision at 10% | ≥ 0.80 for top-decile supporters | Monthly |
| Recall at 10% | ≥ 0.70 for high-turnout voters | Monthly |
| Lift over random targeting | ≥ 3× at top decile | Monthly |
| Cross-validation stability | Variance < 5% across folds | Quarterly |
| Field validation match rate | ≥ 85% against ground canvass outcomes | Monthly |

#### Putting the model to work

* **Ad targeting:** scored segments as custom audiences on Meta, Google, TikTok
* **SMS/USSD segmentation:** priority broadcast lists for high-support,
low-turnout voters — the single most valuable GOTV segment
* **Content personalisation:** different messages to persuadable voters,
strong supporters and low-propensity voters
* **Volunteer routing:** ground teams directed to highest-persuasion-potential
households first (Section 5.2.3.2)

#### The compliance gate this depends on

Model deployment is gated. If the Section 5.7.9 review does not clear
voter-file-based processing, the campaign operates the model on **first-party
consented data and aggregate ward-level statistics only** — a materially
weaker but fully lawful fallback that is planned into all three engagement
levels. The campaign is not exposed if the answer is no.

---

### 5.2.4.3 Workstream 13 — The technology stack

> **Mostly outside this engagement.** Dr. Mulu already holds accounts, hosting and the tooling in
> daily use, and procuring a stack the campaign already has is not a service. Firefly builds and
> operates three components only: the **service-delivery tracker**, the **supporter CRM**, and the
> **SMS/USSD/WhatsApp layer**. The rest of this section is the reference architecture the campaign
> owns and Firefly integrates against.


A data-driven political campaign requires robust, reliable, and compliant technical infrastructure. The technology stack must bridge the gap between digital command centers and offline rural wards, while adhering strictly to Kenya's **Data Protection Act (DPA) 2019** and cybersecurity best practices.

This section specifies the six core software components of the campaign: the **SMS/USSD Telecommunications Gateway**, the **Supporter CRM & Voter Database**, **Social Media Publishing & Social Listening Systems**, **Analytics & Business Intelligence Dashboard**, and the **Section 5.2.1.1 Service-Delivery Tracker**.

```figure
id: tech-stack
```

#### Component by component, and what each does

##### 1. SMS / USSD Telecommunications Gateway
*   **Tooling Recommendation:** **Africa's Talking API Suite** (or Safaricom Direct Enterprise SDP Gateway).
*   **Function & Purpose:** Powers the offline communications engine (Section 5.2.3.3). Dispatches targeted, opt-in bulk 2G SMS to registered voters across 40 wards, manages the zero-rated interactive USSD menu (`*[shortcode]#`), and handles inbound field report ingestion from the campaign's ward network (campaign-owned, Section 5.1.3).
*   **Data Held & Processed:** Voter mobile phone numbers (MSISDN), geolocation ward tags, inbound USSD menu responses, delivery receipt timestamps, and opt-out trigger logs.
*   **DPA 2019 Exposure & Compliance:** **HIGH RISK.** Telecommunications data constitutes direct personal data (Section 5.2.3.4). Requires explicit opt-in confirmation logs, automated STOP opt-out processing within 15 seconds, and signed Data Processing Agreements (DPA) with the gateway aggregator.
*   **Procurement Status:** **Awaiting campaign decision** *(Vendor selection between Africa's Talking vs. Safaricom SDP Enterprise)*.

---

##### 2. Supporter Relationship Management (CRM) & Voter Database
*   **Tooling Recommendation:** **Custom PostgreSQL Database with Hasura / Directus Headless Admin UI** (or CiviCRM instance).
*   **Function & Purpose:** The centralized single-source-of-truth supporter data warehouse (Section 5.2.4.1). Stores supporter profiles, 40-ward geographic linkages, demographic classifications, volunteer skills, delegate tracking status, and contact history.
*   **Data Held & Processed:** Encrypted voter names, phone numbers (AES-256), constituency/ward/polling station IDs, gender, age cohort, livelihood classification, consent timestamps, and interaction logs.
*   **DPA 2019 Exposure & Compliance:** **CRITICAL RISK.** Core repository of sensitive and personal supporter data. Requires strict Row-Level Security (RLS), multi-factor authentication (MFA) for all campaign operators, role-based access control (RBAC), daily encrypted off-site backups, and full audit logging of every query.
*   **Procurement Status:** **Awaiting campaign decision** *(Architecture approval for custom PostgreSQL instance vs. open-source CiviCRM)*.

---

##### 3. Social Publishing, Scheduling & Listening Suite
*   **Tooling Recommendation:** **Buffer / Hootsuite Enterprise** (Publishing) + **Brand24 / Talkwalker** (Social Listening & Media Monitoring).
*   **Function & Purpose:** 
    *   *Publishing:* Multi-account scheduling across Facebook, X (Twitter), Instagram, TikTok, and YouTube.
    *   *Listening:* 24/7 automated monitoring of Kamba and national political keywords (e.g., "Dr. Makali Mulu", "Kitui Governor 2027", "Kitui Central CDF", "Wiper Primaries", "Kalonzo Musyoka"). Flags emerging viral rumors, competitor attacks, and trending local issues in real time.
*   **Data Held & Processed:** Public social media posts, comments, engagement metrics, sentiment scores, influencer handles, and public reach metrics.
*   **DPA 2019 Exposure & Compliance:** **LOW TO MODERATE RISK.** Processes only publicly accessible posts and aggregated sentiment metadata. Compliant with Section 5.2.3.4 provided individual user profiles are not scraped or merged into private voter records without consent.
*   **Procurement Status:** **Awaiting campaign decision** *(Approval of the software subscription)*.

---

##### 4. Campaign Analytics & Business Intelligence Dashboard
*   **Tooling Recommendation:** **Metabase Open Source** (Self-Hosted on private cloud) or **Apache Superset**.
*   **Function & Purpose:** Delivers real-time analytical dashboards to the Campaign Manager and Dr. Mulu. Tracks the 200,000 vote threshold progress across all 40 wards, monitors SMS delivery rates, maps daily field pulse reports, and tracks effort per ward.
*   **Data Held & Processed:** Aggregated, fully anonymized statistical data: voter counts, ward completion percentages and reach cross-tabulations. No raw unencrypted PII displayed.
*   **DPA 2019 Exposure & Compliance:** **MINIMAL RISK.** Operates on aggregated, anonymized analytical views. Restricted to authorized War Room IP addresses via VPN and MFA.
*   **Procurement Status:** **Awaiting campaign decision** *(Sign-off on technical hosting environment)*.

---

##### 5. Public Service-Delivery Tracker (Section 5.2.4 Digital Charter Platform)
*   **Tooling Recommendation:** **Next.js App Router Web Platform with Interactive GIS Ward Map (Vercel / Cloudflare Edge Hosting)**.
*   **Function & Purpose:** The public-facing evidence engine supporting Dr. Mulu's good-governance brand. Displays verifiable records of 13 years of Kitui Central NG-CDF projects (schools, boreholes, dispensaries, bursary audits) and provides an interactive "Kitui Economic Blueprint" where citizens can track proposed ward-level investments for the 2027–2032 gubernatorial term.
*   **Data Held & Processed:** Public infrastructure records, project GPS coordinates, photo/video documentation, project completion certificates, and public comment/feedback forms.
*   **DPA 2019 Exposure & Compliance:** **LOW RISK.** Public government and campaign policy data. Feedback forms collect standard consented contact details governed by an explicit privacy policy.
*   **Procurement Status:** **Awaiting campaign decision** *(Approval of digital design mockups and public domain registration)*.

#### The procurement matrix

```figure
id: procurement-matrix
```

#### Technical risk and security protocols

To ensure 100% operational uptime and protect campaign systems from infiltration or cyber disruption:

1.  **Mandatory Hardware Security Keys / 2FA:** All War Room operators, Ward Coordinators accessing digital dashboards, and database administrators must use hardware 2FA (e.g., YubiKey or Google Authenticator).
2.  **Daily Automated Off-Site Backups:** The PostgreSQL Supporter CRM executes automated hourly WAL archiving and daily encrypted snapshots stored in geographically isolated cloud buckets.
3.  **Role-Based Data Redaction:** Ground field staff and Ward Captains see only voter data relevant to their specific assigned ward. Exporting full countywide voter lists is programmatically blocked and restricted exclusively to the Data Protection Officer and Campaign Manager.


---

### 5.2.4.4 Workstream 14 — Analytics and attribution

> **Owner: Firefly. This is the engine room of the engagement.** It is numbered fourteenth because
> that is where the original numbering put it; it is read first, in Section 5.3, and it is the
> workstream every other one is measured by.


#### Attribution model and offline conversion tracking

Measurement moves beyond vanity metrics to what drives votes: multi-touch
attribution, offline conversion tracking and effort-per-vote analysis, all
anchored to the ~200,000-vote threshold.

| Touchpoint | Attribution method | Source |
|---|---|---|
| Facebook ad view | Position-based | Meta Pixel |
| Google search click | Last-click | Google Ads |
| **SMS delivery and click** | Campaign-specific short links | SMS platform |
| **USSD session completion** | Direct event | USSD platform |
| WhatsApp message open | Tracking links | Link shortener |
| YouTube view | View-through | Google Ads |
| Website visit | Multi-touch weighted | GA4 |
| Email open | Position-based | Email platform |
| **Field canvass contact** | Direct event | Ward champion form (Section 5.2.3.2) |

To track offline-to-digital and physical engagement, four mechanisms bridge the gap:
* **Unique QR codes** on printed materials and at barazas, tracking which content drove physical attendance
* **SMS keyword short codes** — text a keyword to the campaign shortcode to register support and opt in
* **USSD completions** as a direct offline-to-digital bridge
* **Volunteer-reported contact outcomes** recording prior campaign awareness

#### Key metrics and benchmarks

| Metric | Definition | Global benchmark | Campaign target |
|---|---|---|---|
| Share of voice | % of Kitui gubernatorial mentions about Dr. Mulu | 30–40% for leader | ≥ 50% |
| Net sentiment | (Positive − negative) / total | +20 to +30 | ≥ +40 |
| **Reach share in the deficit pool** | Share of his reach landing in Mwingi and Kitui South (R-02, Section 5.6.4) | — | **≥ 51.7%, the pool's share of the register** |
| Voter registration lift | Increase in target wards from campaign drives | 5–10% | ≥ 10% |
| Digital-to-offline conversion | % of engagers attending or volunteering | 5–15% | ≥ 10% |
| GOTV contact rate | % of target voters reached | 60–80% | ≥ 70% |
| **Contact share of win threshold** | Contacted voters ÷ 200,000 | — | **≥ 75% by election week** |

#### The analytics maturity roadmap

*A staged path, so the campaign is never blocked waiting on capability.*

| Stage | Window | Capability | Prerequisite | Owner |
|---|---|---|---|---|
| **0 — Baseline** | Phase −1 | Platform-native dashboards; manual weekly report; SMS delivery reporting; single source of truth established | Accounts and pixel installed | Paid Media & Analytics Manager |
| **1 — Integrated** | Phase 0–1 | Unified BI dashboard across paid, organic, SMS, USSD, web; ward-level segmentation; A/B testing discipline | Consistent tagging taxonomy | Paid Media & Analytics Manager |
| **2 — Predictive** | Phase 1–2 | Voter scoring live; field-digital loop operating; audience segments driven by score | **Section 5.7.9 compliance gate cleared** | Data Analyst (surge) |
| **3 — Attributed** | Phase 2–3 | Multi-touch attribution; offline conversion tracking; effort per persuaded voter reported against actuals | Stage 2 stable ≥ 6 weeks | Data Analyst |
| **4 — Optimised** | Phase 3 | Continuous reallocation against modelled marginal return; GOTV list prioritisation | Stage 3 validated against field returns | Data Analyst + Director |

**No stage is skipped.** A campaign that attempts predictive scoring before its
tagging is consistent produces confident nonsense, and a campaign that attempts
it before the compliance gate produces legal exposure.

#### Who owns the data

A **single named data-governance owner** is accountable for both analytics
performance and data compliance — deliberately one role, because splitting them
creates an incentive to treat compliance as someone else's obstacle.

Responsibilities:
* Maintains the data inventory: what is held, lawful basis, retention period,
who has access
* Owns the consent audit trail and can produce it on demand within
**24 hours** — the standard the Section F.6 drill tests
* Owns the deletion schedule and executes it (Section 5.7.8)
* Is the campaign's standing point of contact for the Section 5.7.9 compliance
reviewer
* Holds authority to **suspend any targeting activity** pending review, without
requiring commercial sign-off

At lean tier this role sits with the Digital Director; from standard tier it
sits with the Data Analyst. It is named in writing either way.
