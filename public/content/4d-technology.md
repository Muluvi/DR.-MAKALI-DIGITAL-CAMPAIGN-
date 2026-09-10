The data model, the voter model built on it, the technology stack, and the analytics layer that measures all of it.

## 6.1 The data layer

A modern, high-precision political operation requires an infallible data layer. The campaign rejects arbitrary spreadsheets, unverified voter claims, and ad-hoc phone lists. In their place, the strategy establishes a centralized, structured database architecture governed by strict mathematical provenance, audit trails, and rigorous adherence to Kenyan privacy legislation.

This section defines the voter and supporter data model and the legal compliance workflows under Kenya's **Data Protection Act (DPA) 2019** and the **Office of the Data Protection Commissioner (ODPC)**. The three-tier provenance standard that grades every figure in this proposal (Section 6.1.2) and the protocol for when two sources disagree (Section 6.1.4) are set out alongside the evidence they govern.

```
════════════════════════════════════════════════════════════════════════════════════
                        CAMPAIGN DATA LAYER ARCHITECTURE
════════════════════════════════════════════════════════════════════════════════════

  INGESTION & CAPTURE               PROCESSING & VALIDATION         OUTPUT & CHANNELS
 ┌──────────────────────┐         ┌────────────────────────┐      ┌─────────────────┐
 │ Offline SMS / USSD   │ ──────► │ • Provenance Tagger    │ ───► │ Target SMS / IVR│
 │ 400 Ward Captains    │         │ • DPA Consent Engine   │      │ Geofenced Ads   │
 │ WhatsApp / Webforms  │ ──────► │ • Duplicate Scrubber   │ ───► │ Polling Samples │
 │ Event Registration   │         │ • Tier Classifier (1-3)│      │ Field Logistics │
 └──────────────────────┘         └────────────────────────┘      └─────────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │ Encrypted Core Database │
                                 │ (Row-Level Security &   │
                                 │  Audit Provenance Log)  │
                                 └─────────────────────────┘
════════════════════════════════════════════════════════════════════════════════════
```

---

### 6.1.1 The voter and supporter data model

The campaign database is organized around a relational, entity-attribute-value schema optimized for speed, geographic aggregation, and privacy segmentation. Every supporter record is linked to an exact geographic locus and carries timestamped consent metadata:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUPPORTER RECORD SCHEMA SPECIFICATION                    │
├───────────────────┬──────────────┬──────────────────────────────────────────┤
│ Field Name        │ Data Type    │ Description & Constraints                │
├───────────────────┼──────────────┼──────────────────────────────────────────┤
│ supporter_id      │ UUIDv4       │ Unique, anonymized internal primary key  │
│ msisdn_hash       │ SHA-256      │ One-way hashed phone identifier          │
│ phone_encrypted   │ AES-256-GCM  │ Reversibly encrypted for authorized SMS  │
│ first_name        │ String (35)  │ First name (for personalized SMS)        │
│ last_name         │ String (35)  │ Last name                                │
│ constituency_id   │ Enum (1..8)  │ 1 of 8 Kitui constituencies              │
│ ward_id           │ Enum (1..40) │ 1 of 40 County Assembly wards            │
│ polling_station   │ String (80)  │ IEBC Polling Station Name / Code         │
│ age_cohort        │ Enum         │ 18-24 | 25-34 | 35-49 | 50+ | Unknown    │
│ gender            │ Enum         │ Male | Female | Unknown                  │
│ livelihood_group  │ Enum         │ Smallholder | Pastoralist | Bodaboda |   │
│                   │              │ MSME Trader | Professional | Student     │
│ language_pref     │ Enum         │ Kikamba (Default) | Kiswahili | English  │
│ support_status    │ Enum         │ Hard Supporter | Soft Supporter | Lean   │
│                   │              │ Mulu | Undecided | Opposed | Inactive    │
│ acquisition_source│ Enum         │ SMS_Inbound | Ward_Captain | USSD_Tree | │
│                   │              │ Web_Signup | Town_Hall | WhatsApp_Bot    │
│ consent_status    │ Boolean      │ Explicit Opt-In Confirmation (DPA 2019)  │
│ consent_timestamp │ ISO-8601     │ UTC timestamp of explicit consent        │
│ consent_channel   │ Enum         │ SMS_CONFIRM | FORM_CHECKBOX | PAPER_SIGN │
│ opt_out_status    │ Boolean      │ True if user texted STOP / requested del │
│ data_tier_source  │ Enum (1..3)  │ Provenance rating of record verification │
└───────────────────┴──────────────┴──────────────────────────────────────────┘
```

#### Key Architecture Principles:
1.  **Strict Anonymization & Encryption at Rest:** PII (Personally Identifiable Information), including mobile MSISDNs, is encrypted using **AES-256-GCM**. Read-only analytic dashboards (such as ward target monitors) access only hashed identifiers (`msisdn_hash`) and geographic aggregates.
2.  **Granular Geographic Tagging:** No supporter entry exists in a vacuum; every record MUST map to an explicit Constituency, Ward, and Polling Station.
3.  **Audit Trail Logging:** Every modification to a voter's `support_status` or contact detail logs the modifying user ID, timestamp, and field collection source.

---

### 6.1.5 The Data Protection Act 2019, applied

Political messaging, bulk SMS broadcasting, and voter profiling operate under strict statutory oversight in Kenya. Non-compliance risks severe criminal penalties, regulatory injunctions, and catastrophic brand damage to Dr. Mulu's integrity-driven platform.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DPA 2019 STATUTORY COMPLIANCE CHECKLIST                  │
├─────────────────────────┬───────────────────────────────────────────────────┤
│ Legal Requirement       │ Operational Campaign Implementation               │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 1. Lawful Basis for     │ Explicit, affirmative opt-in consent captured     │
│    Processing (Sec 30)  │ before any voter receives bulk political SMS.     │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 2. Purpose Limitation   │ Supporter contact details collected for campaign  │
│    (Sec 25)             │ updates will NEVER be sold, shared, or repurposed.│
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 3. Data Minimization    │ Collect only necessary operational fields; avoid  │
│    (Sec 25)             │ harvesting unnecessary biometric/sensitive data.  │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 4. Mandatory Opt-Out    │ EVERY broadcast message MUST include an immediate,│
│    (Sec 34)             │ free opt-out mechanism (e.g., "Reply STOP to OptOut").│
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 5. Data Security &      │ Role-based access control (RBAC), end-to-end      │
│    Encryption (Sec 41)  │ encryption (AES-256), and local cloud hosting.    │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 6. Right to Rectify /   │ Direct automated USSD/SMS command to allow users  │
│    Erasure (Sec 40)     │ to request complete deletion of their profile.    │
└─────────────────────────┴───────────────────────────────────────────────────┘
```

#### Mandatory Compliance Safeguards:
1.  **Ban on Commercial Database Ingestion:** The campaign strictly forbids purchasing or scraping phone directories, bank lists, student registers, or church rosters. Ingesting non-consented bulk phone numbers is a direct violation of Section 3.7 of the DPA 2019.
2.  **Automated Opt-Out Processing:** Any inbound SMS containing "STOP", "SIMAMA", "ONDOKA", or "CANCEL" is automatically processed by a webhook within 15 seconds, toggling `opt_out_status = True` and permanently halting outbound SMS transmissions.
3.  **Data Protection Officer (DPO):** The Campaign Secretariat will formally designate a certified Legal & Data Protection Officer to supervise all database access logs, consent registries, and vendor contracts.

---

### 6.1.6 The ODPC guidance we are still waiting on

> [!WARNING]
> **COMPLIANCE ACTION ITEM — ODPC DIRECTIVE CONFIRMATION REQUIRED:**
>
> While the general provisions of the **Data Protection Act 2019** and the **Data Protection (General) Regulations 2021** are fully integrated, the campaign notes that the **Office of the Data Protection Commissioner (ODPC)** has periodically issued specific sector-guidelines and advisory circulars regarding **"Processing of Personal Data in Political Campaigns and Direct Marketing"**.
>
> **Current Status:** The specific, finalized official circular document from the ODPC regarding political campaign messaging could not be retrieved during the archival research phase.
>
> **Mandatory Action:** Prior to launching Phase −1 mass SMS/USSD broadcasting, the Campaign Legal Director MUST:
> 1. Conduct a formal legal review with the ODPC registry to obtain the latest gazetted political campaigning guidelines and advisory notes.
> 2. Formally register the campaign entity as a **Data Controller / Data Processor** with the ODPC if aggregate supporter records exceed statutory thresholds (Section 6.1.5 & Section 6.6.3).
> 3. Verify compliance of telecommunication aggregator contracts (Safaricom / Airtel bulk SMS gateways) with the latest ODPC direct marketing codes.

```
════════════════════════════════════════════════════════════════════════════════════
                          SECTION 6.1.6 STRATEGIC TAKEAWAY
════════════════════════════════════════════════════════════════════════════════════
 • Architecture: Relational, AES-256 encrypted voter model mapped to 40 wards.
 • Provenance:   Tri-partite metadata standard (Source, Date, Geography) on every
                 figure; 3-tier evidential hierarchy prevents data drift.
 • Ethics & Law: 100% compliant with DPA 2019—affirmative opt-ins, instant STOP
                 opt-outs, zero purchased phone lists, and active DPO oversight.
 • Compliance:   ODPC political campaigning advisory flagged for mandatory formal
                 legal confirmation before mass broadcasting.
════════════════════════════════════════════════════════════════════════════════════
```

---

## 6.2 Predictive voter modelling

### 6.2.1 What the model scores, and why

The campaign will build a model scoring registered voters in Kitui County on
two dimensions: likelihood to support Dr. Mulu and likelihood to turn out. This
moves the campaign from broad messaging to disciplined prioritisation of
persuasion and mobilisation effort.

**This entire section is conditional on the compliance gate in Section 6.5.5.**
No voter-file-based targeting is deployed until a Kenyan data-protection or
electoral-law specialist has reviewed and signed off the specific proposed
processing. Nothing in this section should be read as a claim that such
processing is already permissible.

### 6.2.2 Data sources

* **IEBC Voter Register:** name, gender, age bracket, polling station, ward,
constituency, historical turnout flags — **subject to lawful access and the
Section 6.5.5 gate**
* **KNBS Census and county statistics:** ward-level demographics, education,
household characteristics, economic activity
* **Historical results:** ward and polling-station results from 2017 and 2022
to identify patterns and swing areas
* **Campaign first-party data:** interactions with campaign content, WhatsApp
membership, **SMS/USSD opt-ins**, volunteer sign-ups, donor status — all
consent-based
* **Field canvass returns** (Section 4.2)

**Explicitly excluded:** purchased third-party contact lists, scraped number
databases, and any inferred psychographic or personality attributes. Vendors
openly market bulk Kenyan mobile-number databases; the campaign will not buy
them. See Section 6.5.4.

### 6.2.3 Modelling methodology

| Model | Purpose | Strength |
|---|---|---|
| **Logistic regression** | Baseline support and turnout scores | Interpretability; identifies driving variables |
| **Random forest** | Non-linear pattern detection | Captures interactions; robust to outliers |
| **Gradient boosting (XGBoost)** | Final ensemble scoring | Highest predictive accuracy at scale |
| **Propensity score matching** | Volunteer and donor conversion | Estimates causal effect of touchpoints on offline action |

Final output: an ensemble probability score (0–1) for support likelihood and
turnout likelihood.

### 6.2.4 Model variables

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
| `donor_status` | Donation history | Campaign | Categorical | None/One-time/Recurring |
| `field_contact_outcome` | **Canvass result (Section 4.2)** | Field team | Categorical | Support/Undecided/Oppose/No contact |
| `support_score` | Predicted support (output) | Model | Continuous | 0–1 |
| `turnout_score` | Predicted turnout (output) | Model | Continuous | 0–1 |

**No psychographic, personality, ethnic, clan or religious variable appears in
this dictionary, and none may be added.** The `ward_connectivity_index` is the
most operationally important addition — it determines whether a scored voter is
reachable digitally or must be reached by SMS, USSD or radio.

### 6.2.5 How the model is evaluated

| Metric | Target | Frequency |
|---|---|---|
| Area under ROC curve (AUC) | ≥ 0.75 for support score | Monthly |
| Precision at 10% | ≥ 0.80 for top-decile supporters | Monthly |
| Recall at 10% | ≥ 0.70 for high-turnout voters | Monthly |
| Lift over random targeting | ≥ 3× at top decile | Monthly |
| Cross-validation stability | Variance < 5% across folds | Quarterly |
| Field validation match rate | ≥ 85% against ground canvass outcomes | Monthly |

### 6.2.6 Putting the model to work

* **Ad targeting:** scored segments as custom audiences on Meta, Google, TikTok
* **SMS/USSD segmentation:** priority broadcast lists for high-support,
low-turnout voters — the single most valuable GOTV segment
* **Content personalisation:** different messages to persuadable voters,
strong supporters and low-propensity voters
* **Volunteer routing:** ground teams directed to highest-persuasion-potential
households first (Section 4.2)

### 6.2.7 The compliance gate this depends on

Model deployment is gated. If the Section 6.5.5 review does not clear
voter-file-based processing, the campaign operates the model on **first-party
consented data and aggregate ward-level statistics only** — a materially
weaker but fully lawful fallback that has been costed into all three budget
tiers. The campaign is not exposed if the answer is no.

---

## 6.3 The technology stack

A data-driven political campaign requires robust, reliable, and compliant technical infrastructure. The technology stack must bridge the gap between digital command centers and offline rural wards, while adhering strictly to Kenya's **Data Protection Act (DPA) 2019** and cybersecurity best practices.

This section specifies the six core software components of the campaign: the **SMS/USSD Telecommunications Gateway**, the **Supporter CRM & Voter Database**, **Social Media Publishing & Social Listening Systems**, **Analytics & Business Intelligence Dashboard**, and the **Section 8.5 Service-Delivery Tracker**.

```
════════════════════════════════════════════════════════════════════════════════════
                     CAMPAIGN TECHNOLOGY STACK ARCHITECTURE
════════════════════════════════════════════════════════════════════════════════════

  TIER 1: OFFLINE TELECOM GATEWAY           TIER 2: CORE SUPPORTER CRM
 ┌─────────────────────────────────┐       ┌─────────────────────────────────┐
 │ • Africa's Talking / Safaricom  │ ────► │ • PostgreSQL (AWS/GCP Cape Town)│
 │ • Dedicated Shortcode & USSD    │       │ • AES-256 Encrypted PII Fields  │
 │ • Two-Way Inbound/Outbound SMS  │       │ • RBAC & Audit Access Logging   │
 └────────────────┬────────────────┘       └────────────────┬────────────────┘
                  │                                         │
                  ▼                                         ▼
  TIER 3: BROADCAST & LISTENING             TIER 4: ANALYTICS & WARD TRACKER
 ┌─────────────────────────────────┐       ┌─────────────────────────────────┐
 │ • Buffer / Hootsuite Enterprise │       │ • Metabase / Apache Superset    │
 │ • Brand24 / Talkwalker Monitor  │       │ • Section 8.5 Service-Delivery  │
 │ • Meta Business Suite & TikTok  │       │   Public Policy Tracker (Web)   │
 └─────────────────────────────────┘       └─────────────────────────────────┘
════════════════════════════════════════════════════════════════════════════════════
```

---

### 6.3.1 Component by component, and what each does

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK DETAILED SPECIFICATION                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 1. SMS / USSD Telecommunications Gateway
*   **Tooling Recommendation:** **Africa's Talking API Suite** (or Safaricom Direct Enterprise SDP Gateway).
*   **Function & Purpose:** Powers the offline communications engine (Section 4.3 & 10.1). Dispatches targeted, opt-in bulk 2G SMS to registered voters across 40 wards, manages the zero-rated interactive USSD menu (`*483*XX#`), and handles inbound field report ingestion from the 400 Ward Captains.
*   **Cost Structure:**
*   **Data Held & Processed:** Voter mobile phone numbers (MSISDN), geolocation ward tags, inbound USSD survey responses, delivery receipt timestamps, and opt-out trigger logs.
*   **DPA 2019 Exposure & Compliance:** **HIGH RISK.** Telecommunications data constitutes direct personal data (Section 4.4). Requires explicit opt-in confirmation logs, automated STOP opt-out processing within 15 seconds, and signed Data Processing Agreements (DPA) with the gateway aggregator.
*   **Procurement Status:** **Awaiting campaign decision** *(Vendor selection between Africa's Talking vs. Safaricom SDP Enterprise)*.

---

#### 2. Supporter Relationship Management (CRM) & Voter Database
*   **Tooling Recommendation:** **Custom PostgreSQL Database with Hasura / Directus Headless Admin UI** (or CiviCRM instance).
*   **Function & Purpose:** The centralized single-source-of-truth supporter data warehouse (Section 6.1.1). Stores supporter profiles, 40-ward geographic linkages, demographic classifications, volunteer skills, delegate tracking status, and contact history.
*   **Cost Structure:**
*   **Data Held & Processed:** Encrypted voter names, phone numbers (AES-256), constituency/ward/polling station IDs, gender, age cohort, livelihood classification, consent timestamps, and interaction logs.
*   **DPA 2019 Exposure & Compliance:** **CRITICAL RISK.** Core repository of sensitive and personal supporter data. Requires strict Row-Level Security (RLS), multi-factor authentication (MFA) for all campaign operators, role-based access control (RBAC), daily encrypted off-site backups, and full audit logging of every query.
*   **Procurement Status:** **Awaiting campaign decision** *(Architecture approval for custom PostgreSQL instance vs. open-source CiviCRM)*.

---

#### 3. Social Publishing, Scheduling & Listening Suite
*   **Tooling Recommendation:** **Buffer / Hootsuite Enterprise** (Publishing) + **Brand24 / Talkwalker** (Social Listening & Media Monitoring).
*   **Function & Purpose:** 
    *   *Publishing:* Multi-account scheduling across Facebook, X (Twitter), Instagram, TikTok, and YouTube.
    *   *Listening:* 24/7 automated monitoring of Kamba and national political keywords (e.g., "Dr. Makali Mulu", "Kitui Governor 2027", "Kitui Central CDF", "Wiper Primaries", "Kalonzo Musyoka"). Flags emerging viral rumors, competitor attacks, and trending local issues in real time.
*   **Cost Structure:**
*   **Data Held & Processed:** Public social media posts, comments, engagement metrics, sentiment scores, influencer handles, and public reach metrics.
*   **DPA 2019 Exposure & Compliance:** **LOW TO MODERATE RISK.** Processes only publicly accessible posts and aggregated sentiment metadata. Compliant with Section 4.4 provided individual user profiles are not scraped or merged into private voter records without consent.
*   **Procurement Status:** **Awaiting campaign decision** *(Approval of monthly software subscription allocation)*.

---

#### 4. Campaign Analytics & Business Intelligence Dashboard
*   **Tooling Recommendation:** **Metabase Open Source** (Self-Hosted on private cloud) or **Apache Superset**.
*   **Function & Purpose:** Delivers real-time analytical dashboards to the Campaign Manager and Dr. Mulu. Tracks the 200,000 vote threshold progress across all 40 wards, monitors SMS delivery rates, maps daily field pulse reports, visualizes polling trends, and audits budget efficiency per ward.
*   **Cost Structure:**
*   **Data Held & Processed:** Aggregated, fully anonymized statistical data: voter counts, ward completion percentages, polling cross-tabulations, financial expenditure summaries. No raw unencrypted PII displayed.
*   **DPA 2019 Exposure & Compliance:** **MINIMAL RISK.** Operates on aggregated, anonymized analytical views. Restricted to authorized War Room IP addresses via VPN and MFA.
*   **Procurement Status:** **Awaiting campaign decision** *(Sign-off on technical hosting environment)*.

---

#### 5. Public Service-Delivery Tracker (Section 8.5 Digital Charter Platform)
*   **Tooling Recommendation:** **Next.js App Router Web Platform with Interactive GIS Ward Map (Vercel / Cloudflare Edge Hosting)**.
*   **Function & Purpose:** The public-facing evidence engine supporting Dr. Mulu's good-governance brand. Displays verifiable records of 13 years of Kitui Central NG-CDF projects (schools, boreholes, dispensaries, bursary audits) and provides an interactive "Kitui Economic Blueprint" where citizens can track proposed ward-level investments for the 2027–2032 gubernatorial term.
*   **Cost Structure:**
    *   *Platform Development & Verification Data Population:* Integrated within core campaign web infrastructure.
*   **Data Held & Processed:** Public infrastructure records, project GPS coordinates, photo/video documentation, project completion certificates, and public comment/feedback forms.
*   **DPA 2019 Exposure & Compliance:** **LOW RISK.** Public government and campaign policy data. Feedback forms collect standard consented contact details governed by an explicit privacy policy.
*   **Procurement Status:** **Awaiting campaign decision** *(Approval of digital design mockups and public domain registration)*.

---

### 6.3.2 The procurement matrix

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                TECHNOLOGY STACK MASTER PROCUREMENT MATRIX            │
├─────────────────────┬──────────────────────┬──────────────────┬──────────────────────┤
│ System Component    │ Recommended Vendor   │ DPA Risk Level   │ Decision Status      │
├─────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 1. SMS/USSD Gateway │ Africa's Talking /   │ **HIGH RISK**    │ **Awaiting campaign  │
│                     │ Safaricom Enterprise │ (Direct PII)     │ decision**           │
├─────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 2. Supporter CRM    │ PostgreSQL + Hasura  │ **CRITICAL**     │ **Awaiting campaign  │
│    Database         │ (Cape Town Region)   │ (Encrypted PII)  │ decision**           │
├─────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 3. Social Publishing│ Buffer / Hootsuite + │ **LOW-MODERATE** │ **Awaiting campaign  │
│    & Listening      │ Brand24 Monitoring   │ (Public Data)    │ decision**           │
├─────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 4. BI Analytics     │ Metabase Open Source │ **MINIMAL**      │ **Awaiting campaign  │
│    Dashboard        │ (Self-Hosted Cloud)  │ (Anonymized)     │ decision**           │
├─────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 5. Public Service   │ Next.js Web Platform │ **LOW RISK**     │ **Awaiting campaign  │
│    Tracker (19B)    │ + Cloudflare Edge    │ (Public Policy)  │ decision**           │
└─────────────────────┴──────────────────────┴──────────────────┴──────────────────────┘
```

---

### 6.3.3 Technical risk and security protocols

To ensure 100% operational uptime and protect campaign systems from infiltration or cyber disruption:

1.  **Mandatory Hardware Security Keys / 2FA:** All War Room operators, Ward Coordinators accessing digital dashboards, and database administrators must use hardware 2FA (e.g., YubiKey or Google Authenticator).
2.  **Daily Automated Off-Site Backups:** The PostgreSQL Supporter CRM executes automated hourly WAL archiving and daily encrypted snapshots stored in geographically isolated cloud buckets.
3.  **Role-Based Data Redaction:** Ground field staff and Ward Captains see only voter data relevant to their specific assigned ward. Exporting full countywide voter lists is programmatically blocked and restricted exclusively to the Data Protection Officer and Campaign Manager.

```
════════════════════════════════════════════════════════════════════════════════════
                          SECTION 6.3.3 STRATEGIC TAKEAWAY
════════════════════════════════════════════════════════════════════════════════════
 • Modular Architecture: 5 integrated components connecting offline 2G telecom 
                         gateways to encrypted cloud CRMs and public web trackers.
 • Strict Data Security: AES-256 encryption at rest, role-based access, and African 
                         data residency to ensure 100% DPA 2019 compliance.
 • Procurement Status:   All major software components formally structured with 
                         costings and marked "Awaiting campaign decision" for sign-off.
════════════════════════════════════════════════════════════════════════════════════
```

---

## 6.4 Analytics and attribution

### 6.4.1 Attribution model and offline conversion tracking

Measurement moves beyond vanity metrics to what drives votes: multi-touch
attribution, offline conversion tracking and cost-per-vote analysis, all
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
| **Field canvass contact** | Direct event | Ward champion form (Section 4.2) |

To track offline-to-digital and physical engagement, four mechanisms bridge the gap:
* **Unique QR codes** on printed materials and at barazas, tracking which content drove physical attendance
* **SMS keyword short codes** — text a keyword to `[Insert shortcode]` to register support and opt in
* **USSD completions** as a direct offline-to-digital bridge
* **Volunteer-reported contact outcomes** recording prior campaign awareness

### 6.4.2 Key metrics and benchmarks

| Metric | Definition | Global benchmark | Campaign target |
|---|---|---|---|
| Share of voice | % of Kitui gubernatorial mentions about Dr. Mulu | 30–40% for leader | ≥ 50% |
| Net sentiment | (Positive − negative) / total | +20 to +30 | ≥ +40 |
| **Measured preference shift** | Change in published survey share | — | **Close the deficit to ≤5 points by nomination window** |
| Voter registration lift | Increase in target wards from campaign drives | 5–10% | ≥ 10% |
| Digital-to-offline conversion | % of engagers attending or volunteering | 5–15% | ≥ 10% |
| GOTV contact rate | % of target voters reached | 60–80% | ≥ 70% |
| **Contact share of win threshold** | Contacted voters ÷ 200,000 | — | **≥ 75% by election week** |

### 6.4.3 The analytics maturity roadmap

*A staged path, so the campaign is never blocked waiting on capability.*

| Stage | Window | Capability | Prerequisite | Owner |
|---|---|---|---|---|
| **0 — Baseline** | Phase −1 | Platform-native dashboards; manual weekly report; SMS delivery reporting; single source of truth established | Accounts and pixel installed | Paid Media & Analytics Manager |
| **1 — Integrated** | Phase 0–1 | Unified BI dashboard across paid, organic, SMS, USSD, web; ward-level segmentation; A/B testing discipline | Consistent tagging taxonomy | Paid Media & Analytics Manager |
| **2 — Predictive** | Phase 1–2 | Voter scoring live; field-digital loop operating; audience segments driven by score | **Section 6.5.5 compliance gate cleared** | Data Analyst (surge) |
| **3 — Attributed** | Phase 2–3 | Multi-touch attribution; offline conversion tracking; cost-per-persuaded-voter reported against actuals | Stage 2 stable ≥ 6 weeks | Data Analyst |
| **4 — Optimised** | Phase 3 | Continuous reallocation against modelled marginal return; GOTV list prioritisation | Stage 3 validated against field returns | Data Analyst + Director |

**No stage is skipped.** A campaign that attempts predictive scoring before its
tagging is consistent produces confident nonsense, and a campaign that attempts
it before the compliance gate produces legal exposure.

### 6.4.4 Who owns the data

A **single named data-governance owner** is accountable for both analytics
performance and data compliance — deliberately one role, because splitting them
creates an incentive to treat compliance as someone else's obstacle.

Responsibilities:
* Maintains the data inventory: what is held, lawful basis, retention period,
who has access
* Owns the consent audit trail and can produce it on demand within
**24 hours** — the standard the Section 5.2.4 drill tests
* Owns the deletion schedule and executes it (Section 6.5.4)
* Is the campaign's standing point of contact for the Section 6.5.5 compliance
reviewer
* Holds authority to **suspend any targeting activity** pending review, without
requiring commercial sign-off

At lean tier this role sits with the Digital Director; from standard tier it
sits with the Data Analyst. It is named in writing either way.

---
