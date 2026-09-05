The data model and its provenance rules, the voter model built on it, the technology stack, the analytics layer, and the ethics, privacy and statutory obligations governing all of it.

## 6.1 The data layer

A modern, high-precision political operation requires an infallible data layer. The campaign rejects arbitrary spreadsheets, unverified voter claims, and ad-hoc phone lists. In their place, the strategy establishes a centralized, structured database architecture governed by strict mathematical provenance, audit trails, and rigorous adherence to Kenyan privacy legislation.

This section defines the voter and supporter data model, the three-tier empirical provenance standard, protocols for handling disputed electoral figures, and legal compliance workflows under Kenya's **Data Protection Act (DPA) 2019** and the **Office of the Data Protection Commissioner (ODPC)**.

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

### 6.1.2 Every figure carries its provenance

To ensure zero "data drift" across the strategic command, every figure cited in memos, ad targeting budgets, field operations, and executive briefings must satisfy the **Tri-Partite Metadata Mandate**:

```
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                    TRI-PARTITE PROVENANCE MANDATE                         │
  ├───────────────────┬───────────────────────────────────────────────────────┤
  │ 1. Primary Source │ Exact institutional publishing entity                 │
  │                   │ (e.g., "IEBC Certified Register", "KNBS 2019 Census") │
  ├───────────────────┼───────────────────────────────────────────────────────┤
  │ 2. Timestamp Date │ Exact date/year of survey or official gazettement     │
  │                   │ (e.g., "August 2022", "7 August 2026")                │
  ├───────────────────┼───────────────────────────────────────────────────────┤
  │ 3. Geographic Unit│ Exact administrative boundary to which data applies   │
  │                   │ (e.g., "Countywide", "Mwingi North", "Kyuso Ward")    │
  └───────────────────┴───────────────────────────────────────────────────────┘
```

**Rule of Implementation:** Any metric presented without all three parameters is classified as **Unverified Draft Data** and is strictly prohibited from informing field allocations or financial expenditures.

---

### 6.1.3 The three source tiers

The campaign classifies all intelligence into three immutable evidential tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE THREE-TIER EVIDENTIAL CLASSIFICATION                 │
├────────┬─────────────────────────────┬──────────────────────────────────────┤
│ Tier   │ Source Types                │ Authorized Strategic Use             │
├────────┼─────────────────────────────┼──────────────────────────────────────┤
│ TIER 1 │ Certified Official Records: │ Unconditional baseline for all       │
│        │ • IEBC Gazetted Registers   │ target mathematics, ward quotas,     │
│        │ • KNBS Census Bulletins     │ budgets, and statutory compliance.   │
│        │ • Auditor-General Reports   │ Absolute authority.                  │
├────────┼─────────────────────────────┼──────────────────────────────────────┤
│ TIER 2 │ Independent Field Research: │ Directional tracking of candidate    │
│        │ • Reputable Public Polls    │ popularity, issue salience, and      │
│        │ • Commissioned Survey Waves │ message resonance. Used with stated  │
│        │ • Academic Demographic Data │ confidence intervals and error bars. │
├────────┼─────────────────────────────┼──────────────────────────────────────┤
│ TIER 3 │ Internal / Unverified Intel:│ Hypothesis generation and field lead │
│        │ • Single-source field notes │ tracking ONLY. Strictly prohibited   │
│        │ • Campaign hearsay/rumors   │ from driving financial or resource   │
│        │ • Self-reported crowd counts│ reallocation without escalation.     │
└────────┴─────────────────────────────┴──────────────────────────────────────┘
```

#### Standard Implementation Rules:
*   *Tier 1 Data* (e.g., 532,758 registered voters, 40 wards, 198,004 winning vote baseline) is hardcoded into operational models and cannot be modified without gazetted IEBC addenda.
*   *Tier 2 Data* (e.g., Mizani Africa 7 August 2026 survey: Kasalu 37.4%, Mulu 22.1%) is treated as empirical snapshots carrying declared margins of error ($\pm 2.53\%$).
*   *Tier 3 Data* (e.g., informal reports that Wiper party primaries will use polling rather than delegates) is explicitly watermarked as single-source until validated by formal party communiques.

---

### 6.1.4 When two sources disagree

When multiple sources report conflicting metrics (e.g., voter registration counts, polling leads, or demographic proportions), the analytical unit applies a standardized **Four-Step Conflict Resolution Protocol**:

```
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                   FOUR-STEP CONFLICT RESOLUTION PROTOCOL                  │
 └───────────────────────────────────────────────────────────────────────────┘

   STEP 1: TIER HIERARCHY TEST
   └── Tier 1 always overrides Tier 2; Tier 2 always overrides Tier 3.

   STEP 2: METHODOLOGICAL AUDIT (FOR TIER-EQUIVALENT CONFLICTS)
   └── Audit sample sizes, sampling frame (IEBC register vs. random dial),
       fieldwork dates, and non-response bias.

   STEP 3: CONSERVATIVE BASELINE SELECTION
   └── In electoral modeling, adopt the lower, more demanding performance
       assumption to prevent operational complacency.

   STEP 4: EXPLICIT DUAL-LABELING
   └── If unreconciled, report both numbers explicitly side-by-side with 
       their respective sources rather than calculating an artificial average.
```

**Ban on Guesswork:** Under no circumstance will the analytics team interpolate, smooth, or invent numbers to fill gaps between conflicting datasets.

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
             THE DATA LAYER — TAKEAWAY
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

**This entire section is conditional on the compliance gate in Section 6.5.3.**
No voter-file-based targeting is deployed until a Kenyan data-protection or
electoral-law specialist has reviewed and signed off the specific proposed
processing. Nothing in this section should be read as a claim that such
processing is already permissible.

### 6.2.2 Data sources

* **IEBC Voter Register:** name, gender, age bracket, polling station, ward,
constituency, historical turnout flags — **subject to lawful access and the
Section 6.5.3 gate**
* **KNBS Census and county statistics:** ward-level demographics, education,
household characteristics, economic activity
* **Historical results:** ward and polling-station results from 2017 and 2022
to identify patterns and swing areas
* **Campaign first-party data:** interactions with campaign content, WhatsApp
membership, **SMS/USSD opt-ins**, volunteer sign-ups, donor status — all
consent-based
* **Field canvass returns** (Section 4.1)

**Explicitly excluded:** purchased third-party contact lists, scraped number
databases, and any inferred psychographic or personality attributes. Vendors
openly market bulk Kenyan mobile-number databases; the campaign will not buy
them. See Section 6.5.2.

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
| `field_contact_outcome` | **Canvass result (Section 4.1)** | Field team | Categorical | Support/Undecided/Oppose/No contact |
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
households first (Section 4.1)

### 6.2.7 The compliance gate this depends on

Model deployment is gated. If the Section 6.5.3 review does not clear
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

### 6.3.1 Component by component, and what each costs

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK DETAILED SPECIFICATION                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 1. SMS / USSD Telecommunications Gateway
*   **Tooling Recommendation:** **Africa's Talking API Suite** (or Safaricom Direct Enterprise SDP Gateway).
*   **Function & Purpose:** Powers the offline communications engine (Section 4.2). Dispatches targeted, opt-in bulk 2G SMS to registered voters across 40 wards, manages the zero-rated interactive USSD menu (`*483*XX#`), and handles inbound field report ingestion from the 400 Ward Captains.
*   **Cost Structure:**
    *   *Dedicated Sender ID / Shortcode Setup:* ~Ksh 30,000–50,000 (one-off CAK/Telco registration).
    *   *Dedicated USSD Channel:* ~Ksh 25,000/month hosting fee.
    *   *Per-Message SMS Traffic:* Ksh 0.60–0.80 per 160-character SMS (Volume Tier: ~1,500,000 outbound messages across campaign lifecycle = ~Ksh 900,000–1,200,000).
*   **Data Held & Processed:** Voter mobile phone numbers (MSISDN), geolocation ward tags, inbound USSD survey responses, delivery receipt timestamps, and opt-out trigger logs.
*   **DPA 2019 Exposure & Compliance:** **HIGH RISK.** Telecommunications data constitutes direct personal data (Section 4.4 of the DPA 2019). Requires explicit opt-in confirmation logs, automated STOP opt-out processing within 15 seconds, and signed Data Processing Agreements (DPA) with the gateway aggregator.
*   **Procurement Status:** **Awaiting campaign decision** *(Vendor selection between Africa's Talking vs. Safaricom SDP Enterprise)*.

---

#### 2. Supporter Relationship Management (CRM) & Voter Database
*   **Tooling Recommendation:** **Custom PostgreSQL Database with Hasura / Directus Headless Admin UI** (or CiviCRM instance).
*   **Function & Purpose:** The centralized single-source-of-truth supporter data warehouse (Section 6.1.1). Stores supporter profiles, 40-ward geographic linkages, demographic classifications, volunteer skills, delegate tracking status, and contact history.
*   **Cost Structure:**
    *   *Managed Cloud Database Hosting (AWS Cape Town / GCP South Africa Region for African data residency):* ~Ksh 20,000–35,000/month ($150–$250/mo).
    *   *Deployment & Custom Schema Configuration:* ~Ksh 150,000 (one-off technical setup).
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
    *   *Social Publishing Tier (Hootsuite/Buffer Team Plan):* ~Ksh 15,000–25,000/month ($120–$200/mo).
    *   *Social Listening & Monitoring Tier (Brand24 Pro/Enterprise):* ~Ksh 30,000–45,000/month ($250–$350/mo).
*   **Data Held & Processed:** Public social media posts, comments, engagement metrics, sentiment scores, influencer handles, and public reach metrics.
*   **DPA 2019 Exposure & Compliance:** **LOW TO MODERATE RISK.** Processes only publicly accessible posts and aggregated sentiment metadata. Compliant with Section 4.4 of the DPA 2019 provided individual user profiles are not scraped or merged into private voter records without consent.
*   **Procurement Status:** **Awaiting campaign decision** *(Approval of monthly software subscription allocation)*.

---

#### 4. Campaign Analytics & Business Intelligence Dashboard
*   **Tooling Recommendation:** **Metabase Open Source** (Self-Hosted on private cloud) or **Apache Superset**.
*   **Function & Purpose:** Delivers real-time analytical dashboards to the Campaign Manager and Dr. Mulu. Tracks the 200,000 vote threshold progress across all 40 wards, monitors SMS delivery rates, maps daily field pulse reports, visualizes polling trends, and audits budget efficiency per ward.
*   **Cost Structure:**
    *   *Software License:* Ksh 0 (Open Source self-hosted).
    *   *Hosting & Infrastructure (Shared cloud VM):* ~Ksh 8,000–12,000/month ($60–$90/mo).
*   **Data Held & Processed:** Aggregated, fully anonymized statistical data: voter counts, ward completion percentages, polling cross-tabulations, financial expenditure summaries. No raw unencrypted PII displayed.
*   **DPA 2019 Exposure & Compliance:** **MINIMAL RISK.** Operates on aggregated, anonymized analytical views. Restricted to authorized War Room IP addresses via VPN and MFA.
*   **Procurement Status:** **Awaiting campaign decision** *(Sign-off on technical hosting environment)*.

---

#### 5. Public Service-Delivery Tracker (Section 8.5 Digital Charter Platform)
*   **Tooling Recommendation:** **Next.js App Router Web Platform with Interactive GIS Ward Map (Vercel / Cloudflare Edge Hosting)**.
*   **Function & Purpose:** The public-facing evidence engine supporting Dr. Mulu's good-governance brand. Displays verifiable records of 13 years of Kitui Central NG-CDF projects (schools, boreholes, dispensaries, bursary audits) and provides an interactive "Kitui Economic Blueprint" where citizens can track proposed ward-level investments for the 2027–2032 gubernatorial term.
*   **Cost Structure:**
    *   *Domain & Edge CDN Hosting (Cloudflare/Vercel Pro):* ~Ksh 3,500–5,000/month ($25–$40/mo).
    *   *Platform Development & Verification Data Population:* Integrated within core campaign web infrastructure.
*   **Data Held & Processed:** Public infrastructure records, project GPS coordinates, photo/video documentation, project completion certificates, and public comment/feedback forms.
*   **DPA 2019 Exposure & Compliance:** **LOW RISK.** Public government and campaign policy data. Feedback forms collect standard consented contact details governed by an explicit privacy policy.
*   **Procurement Status:** **Awaiting campaign decision** *(Approval of digital design mockups and public domain registration)*.

---

### 6.3.2 The procurement matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                TECHNOLOGY STACK MASTER PROCUREMENT MATRIX                                   │
├─────────────────────┬──────────────────────┬──────────────────────┬──────────────────┬──────────────────────┤
│ System Component    │ Recommended Vendor   │ Estimated Budget     │ DPA Risk Level   │ Decision Status      │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 1. SMS/USSD Gateway │ Africa's Talking /   │ Ksh 950k–1.3M        │ **HIGH RISK**    │ **Awaiting campaign  │
│                     │ Safaricom Enterprise │ (Lifecycle Total)    │ (Direct PII)     │ decision**           │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 2. Supporter CRM    │ PostgreSQL + Hasura  │ Ksh 350k–500k        │ **CRITICAL**     │ **Awaiting campaign  │
│    Database         │ (Cape Town Region)   │ (Hosting + Config)   │ (Encrypted PII)  │ decision**           │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 3. Social Publishing│ Buffer / Hootsuite + │ Ksh 45k–70k / month  │ **LOW-MODERATE** │ **Awaiting campaign  │
│    & Listening      │ Brand24 Monitoring   │ (SaaS Subscription)  │ (Public Data)    │ decision**           │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 4. BI Analytics     │ Metabase Open Source │ Ksh 10k–15k / month  │ **MINIMAL**      │ **Awaiting campaign  │
│    Dashboard        │ (Self-Hosted Cloud)  │ (Server Compute)     │ (Anonymized)     │ decision**           │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────┼──────────────────────┤
│ 5. Public Service   │ Next.js Web Platform │ Ksh 5k / month       │ **LOW RISK**     │ **Awaiting campaign  │
│    Tracker (19B)    │ + Cloudflare Edge    │ (Domain & Edge)      │ (Public Policy)  │ decision**           │
└─────────────────────┴──────────────────────┴──────────────────────┴──────────────────┴──────────────────────┘
```

---

### 6.3.3 Technical risk and security protocols

To ensure 100% operational uptime and protect campaign systems from infiltration or cyber disruption:

1.  **Mandatory Hardware Security Keys / 2FA:** All War Room operators, Ward Coordinators accessing digital dashboards, and database administrators must use hardware 2FA (e.g., YubiKey or Google Authenticator).
2.  **Daily Automated Off-Site Backups:** The PostgreSQL Supporter CRM executes automated hourly WAL archiving and daily encrypted snapshots stored in geographically isolated cloud buckets.
3.  **Role-Based Data Redaction:** Ground field staff and Ward Captains see only voter data relevant to their specific assigned ward. Exporting full countywide voter lists is programmatically blocked and restricted exclusively to the Data Protection Officer and Campaign Manager.

```
════════════════════════════════════════════════════════════════════════════════════
            DATA & COMPLIANCE — TAKEAWAY
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

Measurement moves beyond vanity metrics to what drives votes: multi-touch
attribution, offline conversion tracking and cost-per-vote analysis, all
anchored to the ~200,000-vote threshold.

### 6.4.1 Multi-touch attribution, online and offline

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
| **Field canvass contact** | Direct event | Ward champion form (Section 4.1) |

#### Tracking offline conversion

* **Unique QR codes** on printed materials and at barazas, tracking which
content drove physical attendance
* **SMS keyword short codes** — text a keyword to `[Insert shortcode]` to
register support and opt in
* **USSD completions** as a direct offline-to-digital bridge
* **Volunteer-reported contact outcomes** recording prior campaign awareness

---

### 6.4.2 Key metrics and benchmarks

| Metric | Definition | Global benchmark | Campaign target |
|---|---|---|---|
| Share of voice | % of Kitui gubernatorial mentions about Dr. Mulu | 30–40% for leader | ≥ 50% |
| Net sentiment | (Positive − negative) / total | +20 to +30 | ≥ +40 |
| **Measured preference shift** | Change in published survey share | — | **Close the deficit to ≤5 points by nomination window** |
| Voter registration lift | Increase in target wards from campaign drives | 5–10% | ≥ 10% |
| Cost per persuaded voter | Total spend ÷ estimated persuaded | $1–$5 | ≤ KSh200 |
| **Cost per consented contact** | Total channel spend ÷ consented contacts | — | ≤ KSh0.60 falling to KSh0.35 |
| Digital-to-offline conversion | % of engagers attending or volunteering | 5–15% | ≥ 10% |
| GOTV contact rate | % of target voters reached | 60–80% | ≥ 70% |
| **Contact share of win threshold** | Contacted voters ÷ 200,000 | — | **≥ 75% by election week** |

### 6.4.3 The analytics maturity roadmap

*New. A staged path, so the campaign is never blocked waiting on capability.*

| Stage | Window | Capability | Prerequisite | Owner |
|---|---|---|---|---|
| **0 — Baseline** | Phase −1 | Platform-native dashboards; manual weekly report; SMS delivery reporting; single source of truth established | Accounts and pixel installed | Paid Media & Analytics Manager |
| **1 — Integrated** | Phase 0–1 | Unified BI dashboard across paid, organic, SMS, USSD, web; ward-level segmentation; A/B testing discipline | Consistent tagging taxonomy | Paid Media & Analytics Manager |
| **2 — Predictive** | Phase 1–2 | Voter scoring live; field-digital loop operating; audience segments driven by score | **Section 6.5.3 compliance gate cleared** | Data Analyst (surge) |
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
**24 hours** — the standard the Section 5.1.7 drill tests
* Owns the deletion schedule and executes it (Section 6.5.2)
* Is the campaign's standing point of contact for the Section 6.5.3 compliance
reviewer
* Holds authority to **suspend any targeting activity** pending review, without
requiring commercial sign-off

At lean tier this role sits with the Digital Director; from standard tier it
sits with the Data Analyst. It is named in writing either way.

---

## 6.5 Ethics, privacy and the data charter

Voter data is handled in a manner intended to comply with Kenya's Data
Protection Act 2019, the Communications Authority framework governing political
messaging, and IEBC regulations. This protects the campaign from legal risk and
reinforces Dr. Mulu's brand as a trustworthy, accountable leader.

**Important framing: this section describes the campaign's intended standard
and control environment. It is not a legal opinion, and nothing here asserts
that any specific processing is already lawful. Section 6.5.3 establishes the
gate that answers that question properly.**

### 6.5.1 The regulatory environment, and the controls that answer it

#### What the law and the regulators require

| Area | Requirement | Source |
|---|---|---|
| **Political SMS** | Recipients of political messages must have **opted in**, with express consent and clearly notified opt-out. Service providers are prohibited from sending unsolicited bulk content | Industry code governing bulk political messaging |
| **Consent standard** | Must be **express, free, specific, informed and unequivocal**. Consent for one purpose does not transfer to another | ODPC determinations under the Data Protection Act 2019 |
| **Enforcement** | ODPC has issued penalties up to **KSh5 million**, including **KSh400,000 against a lender for unsolicited marketing SMS (December 2025)** and penalties of KSh1.85m–4.55m against three controllers | ODPC |
| **Political messaging scrutiny** | Unsolicited political SMS was the subject of public and press scrutiny in August 2026 as the 2027 cycle began | Kenyan press reporting |
| **Campaign finance** | Expenditure limits, contribution caps and disclosure obligations in force from 7 August 2026 | IEBC Gazette Notice No. 12251 |

**The commercial reality this creates.** Vendors openly market databases of
millions of Kenyan mobile numbers. Rival campaigns may well buy them. Doing so
would give short-term reach and long-term exposure — regulatory, and
reputational for a candidate whose entire proposition is rigour and
accountability. The campaign will not.

#### The control that answers each requirement

| Area | Requirement | Implementation |
|---|---|---|
| Collection | Voters informed of use; consent obtained | Clear privacy notice at every collection point — website, USSD, baraza sign-up sheet, WhatsApp opt-in |
| Storage | Data secured | Encrypted storage, role-based access control, access logging, periodic review |
| Sharing | No sharing without consent | No third-party transfer; no sale under any circumstance |
| Retention | Not kept indefinitely | Published deletion schedule (Section 6.5.2, clause 5) |
| Communication | Opt-outs respected | One-touch opt-out on every message; honoured immediately and permanently |
| Accuracy | Correction rights honoured | Documented request route with response SLA |
| Misinformation | No false content | Fact-check protocol; pre-approval of sensitive claims |

---

### 6.5.2 The Digital Ethics and Data Charter

*New. Published on the campaign website in all three languages, in plain
language, at a permanent URL.*

**Why publish it.** Because a commitment nobody can read is a policy, and a
commitment published with a verification route is a differentiator. This is the
"Economist Governor" proposition applied to the campaign's own conduct: it is
the campaign holding itself to the standard it asks of the county government.
It also has hard defensive value — when an opponent alleges bot activity or
spam, a published charter plus a retained audit trail is an answer, not a
denial.

> ### DIGITAL ETHICS & DATA CHARTER
> **Kwĩyumya kwa Ũthaithi — Ahadi Yetu ya Uwazi — Our Commitment to Integrity**
>
> **1. No fabricated engagement.**
> This campaign does not and will not use bot accounts, sockpuppet or fake
> accounts, purchased followers, purchased likes or comments, or paid
> engagement presented as organic. Every supporter is a real person. Every
> follower count is honest.
>
> **2. No disinformation.**
> We will not publish false claims about any candidate, including our
> opponents. We will not create or share manipulated images, audio or video. We
> will not present AI-generated content as real footage. Where AI assists in
> producing an illustration, we label it.
>
> **3. Transparent advertising.**
> Every paid advertisement is run from a publicly identified campaign account
> with the required disclaimers, and is therefore visible in the platform ad
> libraries any citizen or journalist can search. We will additionally publish
> a **monthly digital advertising spend summary** on the campaign website,
> reconciled to the returns we file.
>
> **4. Consent-based contact only.**
> We do not buy voter contact lists. Every phone number and email address we
> hold was given to us voluntarily, with a clear explanation of what we would
> use it for. Every message we send carries a one-touch opt-out, and every
> opt-out is honoured immediately and permanently.
>
> **5. Data retention and deletion.**
> We will hold personal data only for the campaign period. **Within 90 days of
> the declaration of results, all personal data collected for campaigning will
> be permanently deleted**, except where a specific legal or regulatory
> obligation requires retention — in which case only the required records are
> kept, for the required period, and nothing more. Deletion will be confirmed
> publicly.
>
> **6. No identity-based targeting.**
> We segment voters by the issues that affect their lives — water, jobs,
> markets, health, education — and by where they live. **We do not target,
> segment or profile any voter on the basis of ethnicity, clan or religion, and
> we will not run messaging designed to set any community in Kitui against
> another.** We communicate in Kikamba, Kiswahili and English because that is
> how Kitui speaks, not to divide it.
>
> **7. No psychological profiling.**
> We do not build personality or psychographic profiles of voters. We use
> demographic, geographic and issue-interest information that any voter would
> reasonably expect a campaign to consider.
>
> **8. No voter suppression.**
> We will never discourage any eligible Kenyan from registering or voting,
> including supporters of rival candidates. We will publish accurate
> registration and polling information to anyone who asks, whoever they support.
>
> **9. Accountability.**
> Where we get something wrong, we will correct it publicly and promptly, with
> the same prominence as the original.
>
> **10. Your rights.**
> You may ask us what data we hold about you, ask us to correct it, or ask us
> to delete it, at any time, at `[Insert contact route]`. We will respond
> within `[Insert SLA — recommend 14 days]`.
>
> *Published in Kikamba, Kiswahili and English.*

**Operational backing.** Each clause maps to a control: the consent audit trail
(clause 4), the compliance ledger (clause 3), the deletion schedule executed by
the data-governance owner (clause 5), the variable dictionary exclusions
(clauses 6 and 7), the fact-check protocol (clause 2), and the correction log
(clause 9). A charter without instrumentation is decoration.

### 6.5.3 The compliance sign-off gate

*New. The single most important governance control in this document.*

**Before any voter-file-based targeting, list-building beyond first-party
consented data, or bulk political messaging goes live, a named Kenyan
data-protection or electoral-law specialist must review and sign off the
specific proposed processing in writing.**

**This proposal does not assert that the micro-targeting programme described in
Section 6.2 is legally clear. It may not be.** The questions below are genuinely
open, are questions of Kenyan law and regulatory interpretation, and are for
the campaign's counsel to answer — not for a communications consultancy to
assume:

1. On what lawful basis, if any, may a campaign process the IEBC voter register
for targeting, and what are the limits of any such basis?
2. Does the campaign or its vendors require registration as a data controller
or processor, and what documentation must be in place?
3. Do the consent mechanisms proposed here meet the express, free, specific,
informed and unequivocal standard as the ODPC applies it to **political**
messaging specifically?
4. What are the disclosure and record-keeping obligations for digital and SMS
expenditure under the Election Campaign Financing Regulations, 2026, and who
must file them?
5. Does matching first-party consented data against the register constitute
further processing requiring separate consent?
6. What is the correct handling of data collected from minors who may sign up
at public events?

**Process:**
| Step | Owner | Output |
|---|---|---|
| 1. Scope memorandum: exactly what data, from where, for what | Data-governance owner | Written scope, before any counsel time is spent |
| 2. Independent review | `[Insert named Kenyan data-protection / electoral-law specialist — to be appointed by the campaign]` | Written opinion |
| 3. Remediation of any gaps | Firefly + campaign | Revised processing design |
| 4. Written sign-off | Reviewer | Dated authorisation, scope-limited |
| 5. Re-review on material change | Data-governance owner triggers | Updated sign-off |

**Until step 4 is complete, the campaign operates on first-party consented data
and aggregate ward-level statistics only.** This fallback is fully costed in
every budget tier (Section 6.2.7), so the campaign loses no time waiting and
carries no exposure if the answer is restrictive.

---

## 6.6 Statutory and regulatory compliance

This compliance pack consolidates all statutory, constitutional, and regulatory requirements governing Dr. Makali Mulu’s 2027 Kitui County gubernatorial campaign. Operating with strict legal adherence is both an ethical mandate and an essential defense against administrative disqualification or election petition exposure.

```
════════════════════════════════════════════════════════════════════════════════════
                        STATUTORY COMPLIANCE ARCHITECTURE
════════════════════════════════════════════════════════════════════════════════════

   1. CAMPAIGN FINANCING COMPLIANCE (IEBC Gazette No. 12251 & ECFA 2026)
   • Strict Ksh 97,560,000 Total Expenditure Ceiling (Utilization capped at Ksh 64.5M)
   • 20% Single-Source Donor Cap (Max Ksh 19,512,000 per entity)
   • Dedicated Campaign Trust Bank Account & Certified Signatory Notification
   • Mandatory Reporting on all Receipts/Expenditures ≥ Ksh 1,000,000
   • 90-Day Post-Election Audited Accounts Submission to IEBC
                                      │
                                      ▼
   2. IEBC NOMINATION & STATUTORY CLEARANCE REQUIREMENTS
   • University Degree Recognition & Commission for University Education (CUE) Clearance
   • EACC Chapter Six Integrity Clearance Self-Declaration
   • Kenya Revenue Authority (KRA) Tax Compliance Certificate
   • Directorate of Criminal Investigations (DCI) Police Clearance Certificate
   • Higher Education Loans Board (HELB) Clearance Certificate
   • 500 Registered Voter Nomination Endorsement Signatures per Sub-County
                                      │
                                      ▼
   3. DATA PROTECTION ACT (DPA 2019) & TELCO PRIVACY COMPLIANCE
   • Lawful Basis: Explicit Opt-In Consent for 2G SMS & USSD Registry
   • Certificate of Registration with the Office of the Data Protection Commissioner (ODPC)
   • 100% On-Premise Encrypted Storage (AES-256) within Kenyan Borders
   • Direct "STOP" Opt-Out Mechanism via Africa's Talking API
                                      │
                                      ▼
   4. ELECTION OFFENCES ACT (EOA 2016) DEFENSE & LIABILITY MATRIX
   • Prohibition of Bribery, Treating & Undue Influence
   • Defamation & Hate Speech Quarantine (NCIC / Penal Code Compliance)
   • Strict Campaign Ad Blackout Window (48 Hours Prior to Polling Station Opening)
════════════════════════════════════════════════════════════════════════════════════
```

---

### 6.6.1 Campaign financing obligations under the ECFA

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           ELECTION CAMPAIGN FINANCING STATUTORY OBLIGATIONS                                 │
├──────────────────────────┬───────────────────────────────────────────┬──────────────────────────────────────┤
│ Statutory Requirement    │ Operational Rule & Legal Threshold        │ Verification & Compliance Protocol   │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 1. County Expenditure    │ • Total campaign spend must not exceed    │ • Campaign budget strictly capped    │
│    Ceiling               │   **Ksh 97,560,000** (IEBC Gazette        │   at Ksh 64,500,000 (66.1% limit),   │
│                          │   Notice No. 12251, 7 August 2026).       │   leaving Ksh 33.06M safety margin.  │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 2. Single-Source Donor   │ • No single individual or corporate donor │ • All donations > Ksh 500,000 undergo│
│    Contribution Cap      │   may contribute > **20% of the ceiling** │   source-of-funds verification by the│
│                          │   (**Max: Ksh 19,512,000**).              │   Compliance Officer before receipt. │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 3. Dedicated Campaign    │ • All campaign funds must flow through a  │ • Formal account opening at a Tier-1 │
│    Bank Account          │   single dedicated bank account titled    │   commercial bank; certified bank    │
│                          │   *"Dr. Makali Mulu Campaign Trust"*.     │   statements filed monthly.          │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 4. Campaign Expenditure  │ • Campaign Expenditure Committee must be  │ • Formal written notification of 3–5 │
│    Committee & Signatory │   notified to the IEBC at least 3 months  │   committee members and Authorized   │
│                          │   prior to the general election.          │   Signatory submitted to IEBC Chair. │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 5. Large Transaction     │ • Mandatory itemized disclosure of all    │ • Certified invoices, contracts, and │
│    Reporting Threshold   │   receipts and payments **≥ Ksh 1,000,000**│   receipts logged in real time.      │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 6. Post-Election Audited │ • Certified, audited campaign expenditure │ • External ICPAK-registered audit    │
│    Final Accounts        │   accounts must be submitted to the IEBC  │   firm commissioned to deliver final │
│                          │   within **90 days** post-election.       │   filing within 60 days of election. │
└──────────────────────────┴───────────────────────────────────────────┴──────────────────────────────────────┘
```

---

### 6.6.2 The IEBC nomination and clearance checklist

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 IEBC STATUTORY NOMINATION CLEARANCE CHECKLIST                               │
├──────────────────────────┬───────────────────────────────────────────┬──────────────────────────────────────┤
│ Clearance Dimension      │ Statutory Standard & Issuing Authority    │ Current Status & Legal Verification  │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 1. Academic Degree       │ • Bachelor's Degree from a recognized     │ • **Verified:** Ph.D. in Economics,  │
│    Requirement           │   university (Article 180(2) & Elections  │   valid Master's and Bachelor's from │
│                          │   Act Sec. 22). CUE Recognition Letter.   │   University of Nairobi.             │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 2. Chapter Six Integrity │ • Self-Declaration Form cleared by the    │ • **Pending Filing Window:** Formal  │
│    Clearance             │   Ethics and Anti-Corruption Commission   │   clearance submitted during official│
│                          │   (EACC). Zero pending corruption trials. │   statutory nomination window.       │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 3. Tax Compliance        │ • Valid Tax Compliance Certificate (TCC)  │ • **Active / Current:** Annual KRA   │
│    Certificate (TCC)     │   issued by the Kenya Revenue Authority.  │   clearance renewed annually.        │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 4. Police Clearance      │ • Valid Certificate of Good Conduct from  │ • **Scheduled:** Application to be   │
│    Certificate (CID/DCI) │   the Directorate of Criminal Invest.     │   filed 60 days prior to IEBC date.  │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 5. HELB Clearance        │ • Certificate of Compliance from Higher   │ • **Verified:** Clear record with no │
│    Certificate           │   Education Loans Board (HELB).           │   outstanding student debt arrears.  │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 6. Voter Nomination      │ • 500 registered voter signatures from at │ • **Operationalized:** Field Ops     │
│    Endorsement Roll      │   least 5 of the 8 Sub-Counties (Elections│   registering 250 signatures per     │
│                          │   Act Regulations).                       │   ward (10,000 total buffer roll).   │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 7. Party Nomination /    │ • Certificate of Nomination issued by the │ • **[Requires Legal Confirmation]:** │
│    Direct Ticket Seal    │   Wiper Democratic Movement NEC/NEB.      │   Exact internal party dispute filing│
│                          │                                           │   timelines and gazette deadlines.   │
└──────────────────────────┴───────────────────────────────────────────┴──────────────────────────────────────┘
```

---

### 6.6.3 Data protection and election offences liability

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DPA 2019 & ELECTION OFFENCES STATUTORY MATRIX                               │
├──────────────────────────┬───────────────────────────────────────────┬──────────────────────────────────────┤
│ Legal Dimension          │ Statutory Obligation / Exposure Risk      │ Campaign Risk Mitigation Protocol    │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 1. Data Protection Act   │ • Unlawful processing of personal voter   │ • Campaign registered with ODPC as a │
│    (DPA 2019) Compliance │   phone numbers carries fines up to       │   Data Controller; all voter phone   │
│                          │   **Ksh 5,000,000** or 2 years jail.      │   numbers sourced via opt-in barazas;│
│                          │                                           │   mandatory "STOP" SMS opt-out.      │
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 2. Election Offences Act │ • Voter bribery, distribution of cash, or │ • Strict prohibition of direct cash  │
│    (EOA 2016) - Bribery  │   free merchandise at rallies is an       │   handouts at rallies; all logistics │
│                          │   electoral offence causing candidate     │   payments to agents made via audited│
│                          │   disqualification and 5-year jail.       │   M-Pesa bulk business disbursements.│
├──────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ 3. 48-Hour Campaign      │ • All campaign advertising, broadcasts,   │ • All radio spots, SMS engines, and  │
│    Blackout Window       │   and public rallies must cease **48 hours│   sound caravans terminate exactly   │
│                          │   prior to polling station opening**.     │   at 18:00 EAT on the 2nd day prior  │
│                          │                                           │   to polling day.                    │
└──────────────────────────┴───────────────────────────────────────────┴──────────────────────────────────────┘
```

---
