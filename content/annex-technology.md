## E.1 Technology reference architecture

```lead
The technology stack must bridge the gap between digital command centers and offline rural wards, while adhering to Kenya's **Data Protection Act (DPA) 2019** and cybersecurity best practices.
```

A data-driven political campaign requires robust, reliable, and compliant technical infrastructure. The technology stack must bridge the gap between digital command centers and offline rural wards, while adhering to Kenya's **Data Protection Act (DPA) 2019** and cybersecurity best practices.

This section specifies the six core software components of the campaign: the **SMS/USSD Telecommunications Gateway**, the **Supporter CRM & Voter Database**, **Social Media Publishing & Social Listening Systems**, **Analytics & Business Intelligence Dashboard**, and the **Section 15.1.1 Service-Delivery Tracker**.

```figure
id: tech-stack
```

#### Component by component, and what each does

```figure
id: fig-5-2-4-stack
```

```textversion
##### 1. SMS / USSD Telecommunications Gateway
*   **Tooling Recommendation:** **Africa's Talking API Suite** (or Safaricom Direct Enterprise SDP Gateway).
*   **Function & Purpose:** Powers the offline communications engine (Section 15.3.3). Dispatches targeted, opt-in bulk 2G SMS to registered voters across 40 wards, manages the zero-rated interactive USSD menu (`*[shortcode]#`), and handles inbound field report ingestion from the campaign's ward network (campaign-owned, Section 13.3).
*   **Data Held & Processed:** Voter mobile phone numbers (MSISDN), geolocation ward tags, inbound USSD menu responses, delivery receipt timestamps, and opt-out trigger logs.
*   **DPA 2019 Exposure & Compliance:** **HIGH RISK.** Telecommunications data constitutes direct personal data (Section 5.2.3.4 [CHECK REF]). Requires explicit opt-in confirmation logs, automated STOP opt-out processing within 15 seconds, and signed Data Processing Agreements (DPA) with the gateway aggregator.
*   **Procurement Status:** **Awaiting campaign decision** *(Vendor selection between Africa's Talking vs. Safaricom SDP Enterprise)*.

---

##### 2. Supporter Relationship Management (CRM) & Voter Database
*   **Tooling Recommendation:** **Custom PostgreSQL Database with Hasura / Directus Headless Admin UI** (or CiviCRM instance).
*   **Function & Purpose:** The centralized single-source-of-truth supporter data warehouse (Section 15.4.1). Stores supporter profiles, 40-ward geographic linkages, demographic classifications, volunteer skills, delegate tracking status, and contact history.
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
*   **DPA 2019 Exposure & Compliance:** **LOW TO MODERATE RISK.** Processes only publicly accessible posts and aggregated sentiment metadata. Compliant with Section 5.2.3.4 [CHECK REF] provided individual user profiles are not scraped or merged into private voter records without consent.
*   **Procurement Status:** **Awaiting campaign decision** *(Approval of the software subscription)*.

---

##### 4. Campaign Analytics & Business Intelligence Dashboard
*   **Tooling Recommendation:** **Metabase Open Source** (Self-Hosted on private cloud) or **Apache Superset**.
*   **Function & Purpose:** Delivers real-time analytical dashboards to the Campaign Manager and Dr. Mulu. Tracks the {{benchmark}} vote threshold progress across all 40 wards, monitors SMS delivery rates, maps daily field pulse reports, and tracks effort per ward.
*   **Data Held & Processed:** Aggregated, fully anonymized statistical data: voter counts, ward completion percentages and reach cross-tabulations. No raw unencrypted PII displayed.
*   **DPA 2019 Exposure & Compliance:** **MINIMAL RISK.** Operates on aggregated, anonymized analytical views. Restricted to authorized War Room IP addresses via VPN and MFA.
*   **Procurement Status:** **Awaiting campaign decision** *(Sign-off on technical hosting environment)*.

---

##### 5. Public Service-Delivery Tracker (Section 5.2.4 [CHECK REF] Digital Charter Platform)
*   **Tooling Recommendation:** **Next.js App Router Web Platform with Interactive GIS Ward Map (Vercel / Cloudflare Edge Hosting)**.
*   **Function & Purpose:** The public-facing evidence engine supporting Dr. Mulu's good-governance brand. Displays verifiable records of 13 years of Kitui Central NG-CDF projects (schools, boreholes, dispensaries, bursary audits) and provides an interactive "Kitui Economic Blueprint" where citizens can track proposed ward-level investments for the 2027–2032 gubernatorial term.
*   **Data Held & Processed:** Public infrastructure records, project GPS coordinates, photo/video documentation, project completion certificates, and public comment/feedback forms.
*   **DPA 2019 Exposure & Compliance:** **LOW RISK.** Public government and campaign policy data. Feedback forms collect standard consented contact details governed by an explicit privacy policy.
*   **Procurement Status:** **Awaiting campaign decision** *(Approval of digital design mockups and public domain registration)*.
```

[CONFLICT C5: see open items]

#### The procurement matrix

```figure
id: procurement-matrix
```

#### Technical risk and security protocols

To ensure 100% operational uptime and protect campaign systems from infiltration or cyber disruption:

1.  **Mandatory Hardware Security Keys / 2FA:** All War Room operators, Ward Coordinators accessing digital dashboards, and database administrators must use hardware 2FA (e.g., YubiKey or Google Authenticator).
2.  **Daily Automated Off-Site Backups:** The PostgreSQL Supporter CRM executes automated hourly WAL archiving and daily encrypted snapshots stored in geographically isolated cloud buckets.
3.  **Role-Based Data Redaction:** Ground field staff and Ward Captains see only voter data relevant to their specific assigned ward. Exporting full countywide voter lists is programmatically blocked and restricted exclusively to the Data Protection Officer and Campaign Manager.

## E.2 Voter model: data sources and variable dictionary

```lead
**No psychographic, personality, ethnic, clan or religious variable appears in this dictionary, and none may be added.**
```

```visual
kind: checklist
title: "Data sources"
items:
  - label: "IEBC Voter Register"
    text: "name, gender, age bracket, polling station, ward, constituency — **subject to lawful access and the Section 19.2 gate**."
    body: "The IEBC does not publish individual turnout history, and none is assumed."
  - label: "KNBS Census and county statistics"
    body: "demographics, education, household characteristics and economic activity, at the finest unit KNBS publishes (which for several measures is the sub-county, not the ward)"
  - label: "Historical results"
    body: "ward and polling-station results from 2017 and 2022 (IEBC Forms 37A and 37B) — the basis of the support and turnout scores"
  - label: "Campaign first-party data"
    text: "interactions with campaign content, WhatsApp membership, **SMS/USSD opt-ins**, volunteer sign-ups — all consent-based"
  - label: "Field contact log"
    text: "(Section 15.3.2): whether a household was reached, opted in, or asked not to be contacted — contactability, never voting intention"
```

**Explicitly excluded:** purchased third-party contact lists, scraped number
databases, and any inferred psychographic or personality attributes. Vendors
openly market bulk Kenyan mobile-number databases; the campaign will not buy
them. See Section 19.3.

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
| `station_turnout_2017` | Polling-station turnout, 2017 | IEBC Forms 37A | Continuous | 0–100 |
| `station_turnout_2022` | Polling-station turnout, 2022 | IEBC Forms 37A | Continuous | 0–100 |
| `station_wiper_share_2017` | Wiper governor share at the station, 2017 | IEBC Forms 37A | Continuous | 0–100 |
| `station_wiper_share_2022` | Wiper governor share at the station, 2022 | IEBC Forms 37A | Continuous | 0–100 |
| `area_poverty_rate` | Poverty headcount, finest published unit (not ward) | KNBS | Continuous | 0–100 |
| `area_literacy_rate` | Adult literacy, finest published unit | KNBS | Continuous | 0–100 |
| `area_water_access` | % households, improved water, finest published unit | KNBS | Continuous | 0–100 |
| `ward_connectivity_index` | **Internet/mobile use proxy — drives channel selection** | KNBS/CA | Continuous | 0–100 |
| `population_density` | Persons per km² | Census | Continuous | 9–{{sub.kitui-central.density}} |
| `household_size` | Average household size | Census | Continuous | 3.6–4.9 |
| `digital_engagement_score` | Composite of interactions | Campaign (consented) | Continuous | 0–100 |
| `sms_optin_status` | **Consented to SMS contact** | Campaign | Binary | 0/1 |
| `whatsapp_group_member` | Campaign group member | Campaign | Binary | 0/1 |
| `volunteer_status` | Sign-up status | Campaign | Categorical | None/Inactive/Active |
| `field_contact_outcome` | **Doorstep contact result (Section 15.3.2)** | Field team | Categorical | Opted in/Reached, no opt-in/Do not contact/No one home |
| `support_score` | Predicted Wiper support at the station (output) | Model | Continuous | 0–1 |
| `turnout_score` | Predicted turnout (output) | Model | Continuous | 0–1 |

**No psychographic, personality, ethnic, clan or religious variable appears in
this dictionary, and none may be added.** The `ward_connectivity_index` is the
most operationally important addition — it determines whether a scored voter is
reachable digitally or must be reached by SMS, USSD or radio.
