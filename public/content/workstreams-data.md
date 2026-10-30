## 15.4 Data and technology (workstreams 11–14)

Four workstreams under the rest: the data layer, the voter model built on it, the technology stack that runs both, and the analytics that measure what the other ten produce.

### 15.4.1 Workstream 11 — The data layer

```lead
**Owner: Firefly**, as processor on the campaign's behalf, under a written processing agreement (Section 19.1).
```

**Owner: Firefly** , as processor on the campaign's behalf, under a written processing agreement (Section 19.1).

A precise campaign needs a data layer it can trust. No loose spreadsheets, unverified voter claims or ad-hoc phone lists: one structured database, with provenance and audit trails on every record, run within Kenyan privacy law.

This section defines the voter and supporter data model and the legal compliance workflows under Kenya's **Data Protection Act (DPA) 2019** and the **Office of the Data Protection Commissioner (ODPC)**. The three-tier provenance standard that grades every figure in this proposal (Annex A.1.1) and the protocol for when two sources disagree (Annex A.1.3) are set out alongside the evidence they govern.

```figure
id: data-layer
```

#### The voter and supporter data model

The campaign database is organized around a relational, entity-attribute-value schema optimized for speed, geographic aggregation, and privacy segmentation. Every supporter record is linked to an exact geographic locus and carries timestamped consent metadata:

```figure
id: supporter-schema
```

```visual
{"kind":"checklist","title":"Key Architecture Principles","items":[{"label":"Strict Anonymization & Encryption at Rest","body":"PII (Personally Identifiable Information), including mobile MSISDNs, is encrypted using **AES-256-GCM**. Read-only analytic dashboards (such as ward target monitors) access only hashed identifiers (`msisdn_hash`) and geographic aggregates."},{"label":"Granular Geographic Tagging","body":"No supporter entry exists in a vacuum; every record MUST map to an explicit Constituency, Ward, and Polling Station."},{"label":"Audit Trail Logging","body":"Every modification to a voter's `support_status` or contact detail logs the modifying user ID, timestamp, and field collection source."}]}
```

*The Data Protection Act obligations this layer works under, and its mandatory compliance safeguards, are set out with the rest of compliance in 19.2.*

### 15.4.2 Workstream 12 — Predictive voter modelling

```lead
**Owner: Firefly — gated on Section 19.2.** Until written sign-off, this runs as **ward-level aggregate scoring only**. Individual-level scoring waits for the opinion.
```

**Owner: Firefly — gated on Section 19.2.** Until written sign-off, this runs as **ward-level aggregate scoring only**, which delivers most of the targeting value at a fraction of the exposure. Individual-level scoring waits for the opinion.

```visual
{"kind":"stepper","items":[{"label":"What the model scores, and why","text":"The campaign will build a model scoring Kitui's polling stations and wards on two dimensions:","body":"likely support for the Wiper Patriotic Front ticket and likely turnout. Both are estimated from how each station actually voted in 2017 and 2022 (IEBC Forms 37A) and from the register, not from asking anyone how they will vote. This moves the campaign from broad messaging to disciplined prioritisation of persuasion and mobilisation effort, on the official record.\n\n**This entire section is conditional on the compliance gate in Section 19.2.**\nNo voter-file-based targeting is deployed until a Kenyan data-protection or\nelectoral-law specialist has reviewed and signed off the specific proposed\nprocessing. Nothing in this section should be read as a claim that such\nprocessing is already permissible.\n\n*The data sources the model draws on are listed in Annex E.2.*"},{"label":"Modelling methodology","body":"| Model | Purpose | Strength |\n|---|---|---|\n| **Logistic regression** | Baseline support and turnout scores | Interpretability; identifies driving variables |\n| **Random forest** | Non-linear pattern detection | Captures interactions; robust to outliers |\n| **Gradient boosting (XGBoost)** | Final ensemble scoring | Highest predictive accuracy at scale |\n| **Propensity score matching** | Volunteer conversion | Estimates causal effect of touchpoints on offline action |\n\nFinal output: an ensemble score (0–1) per polling station for likely support and\nturnout likelihood.\n\n*The model's variable dictionary is in Annex E.2.*"},{"label":"How the model is evaluated","body":"| Metric | Target | Frequency |\n|---|---|---|\n| Back-test against 2022 | Scores built on the 2017 record, checked against each station's 2022 result; the error is reported, not pre-set | Once, before first use |\n| Cross-validation stability | Variance < 5% across folds | Quarterly |\n| Opt-in rate on routed doors | Higher on doors the model routes than on doors it does not | Monthly |"},{"label":"Putting the model to work","body":"* **Ad targeting:** scored segments as custom audiences on Meta, Google, TikTok\n* **SMS/USSD segmentation:** priority broadcast lists for high-support,\nlow-turnout polling-station areas — the single most valuable GOTV segment\n* **Content personalisation:** different messages to station areas by their support\nand turnout history\n* **Volunteer routing:** ground teams directed to the highest-potential\npolling-station areas first (Section 15.3.2)"}]}
```

#### The compliance gate this depends on

*The compliance gate, and the fallback the model runs on until it clears, are set out in 19.2.*

### 15.4.3 Workstream 13 — The technology stack

```lead
**Mostly outside this engagement.** Firefly builds and operates three components only: the **service-delivery tracker**, the **supporter CRM**, and the **SMS/USSD/WhatsApp layer**.
```

**Mostly outside this engagement.** Dr. Mulu already holds accounts, hosting and the tooling in daily use, and procuring a stack the campaign already has is not a service. Firefly builds and operates three components only: the **service-delivery tracker**, the **supporter CRM**, and the **SMS/USSD/WhatsApp layer**. The reference architecture the campaign owns and Firefly integrates against — component by component, with the procurement matrix and the security protocols — is in Annex E.1.

### 15.4.4 Workstream 14 — Analytics and attribution

```lead
**Owner: Firefly. This is the engine room of the engagement.** Measurement moves beyond vanity metrics to what drives votes, anchored to the ~200,000-vote threshold. **No stage is skipped.**
```

**Owner: Firefly. This is the engine room of the engagement.** It is numbered fourteenth because that is where the original numbering put it; it is read first, in Section 14.1, and it is the workstream every other one is measured by.

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
| **Field canvass contact** | Direct event | Ward champion form (Section 15.3.2) |

To track offline-to-digital and physical engagement, four mechanisms bridge the gap:

* **Unique QR codes** on printed materials and at barazas, tracking which content drove physical attendance
* **SMS keyword short codes** — text a keyword to the campaign shortcode to register support and opt in
* **USSD completions** as a direct offline-to-digital bridge
* **Volunteer-reported contact outcomes** from the doorstep form (Section 15.3.2)

#### Key metrics and benchmarks

| Metric | Definition | Global benchmark | Campaign target |
|---|---|---|---|
| Share of voice | % of Kitui gubernatorial mentions about Dr. Mulu | 30–40% for leader | ≥ 50% |
| Net sentiment | (Positive − negative) / total | +20 to +30 | ≥ +40 |
| **Reach share in the deficit pool** | Share of his reach landing in Mwingi and Kitui South (R-02, Section 18.3) | — | **≥ 51.7%, the pool's share of the register** |
| Voter registration lift | Increase in target wards from campaign drives | 5–10% | ≥ 10% |
| Digital-to-offline conversion | % of engagers attending or volunteering | 5–15% | ≥ 10% |
| GOTV contact rate | % of target voters reached | 60–80% | ≥ 70% |
| **Contact share of win threshold** | Contacted voters ÷ 200,000 | — | **≥ 75% by election week** |

#### The analytics maturity roadmap

*A staged path, so the campaign is never blocked waiting on capability.*

```visual
{"kind":"timeline","items":[{"when":"Phase −1","label":"0 — Baseline","text":"Platform-native dashboards; manual weekly report; SMS delivery reporting; single source of truth established","fields":[{"label":"Prerequisite","text":"Accounts and pixel installed"},{"label":"Owner","text":"Paid Media & Analytics Manager"}]},{"when":"Phase 0–1","label":"1 — Integrated","text":"Unified BI dashboard across paid, organic, SMS, USSD, web; ward-level segmentation; A/B testing discipline","fields":[{"label":"Prerequisite","text":"Consistent tagging taxonomy"},{"label":"Owner","text":"Paid Media & Analytics Manager"}]},{"when":"Phase 1–2","label":"2 — Predictive","text":"Voter scoring live; field-digital loop operating; audience segments driven by score","fields":[{"label":"Prerequisite","text":"**Section 19.2 compliance gate cleared**"},{"label":"Owner","text":"Data Analyst (surge)"}]},{"when":"Phase 2–3","label":"3 — Attributed","text":"Multi-touch attribution; offline conversion tracking; effort per persuaded voter reported against actuals","fields":[{"label":"Prerequisite","text":"Stage 2 stable ≥ 6 weeks"},{"label":"Owner","text":"Data Analyst"}]},{"when":"Phase 3","label":"4 — Optimised","text":"Continuous reallocation against modelled marginal return; GOTV list prioritisation","fields":[{"label":"Prerequisite","text":"Stage 3 validated against field returns"},{"label":"Owner","text":"Data Analyst + Director"}]}]}
```

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
**24 hours** — the standard the Annex F.6 drill tests
* Owns the deletion schedule and executes it (Section 19.3)
* Is the campaign's standing point of contact for the Section 19.2 compliance
reviewer
* Holds authority to **suspend any targeting activity** pending review, without
requiring commercial sign-off

At Lean this role sits with the Digital Director, who heads the campaign's existing digital team; from Standard it sits with the Data Analyst / Modeller (Section 17.2). It is named in writing either way.
