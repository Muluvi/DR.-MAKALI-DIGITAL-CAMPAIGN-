### 4.5.11 Workstream 11 — The data layer

> **Owner: Firefly**, as processor on the campaign's behalf, under a written processing agreement
> (Section 5.3.1).
>
> **Group: Data and technology.** Four workstreams that sit under the rest: the data model, the voter model built on it, the technology stack that runs both, and the analytics layer that measures what the other ten produce.


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

*The Data Protection Act obligations this layer works under, and its mandatory compliance safeguards, are set out with the rest of compliance in 5.3.2.*

### 4.5.12 Workstream 12 — Predictive voter modelling

> **Owner: Firefly — gated on Section 5.3.4.** Until written sign-off, this runs as **ward-level
> aggregate scoring only**, which delivers most of the targeting value at a fraction of the
> exposure. Individual-level scoring waits for the opinion.
>
> **Group: Data and technology.** Four workstreams that sit under the rest: the data model, the voter model built on it, the technology stack that runs both, and the analytics layer that measures what the other ten produce.


#### What the model scores, and why

The campaign will build a model scoring Kitui's polling stations and wards on
two dimensions: likely support for the Wiper Patriotic Front ticket and likely turnout. Both are
estimated from how each station actually voted in 2017 and 2022 (IEBC Forms 37A)
and from the register, not from asking anyone how they will vote. This moves the
campaign from broad messaging to disciplined prioritisation of persuasion and
mobilisation effort, on the official record.

**This entire section is conditional on the compliance gate in Section 5.3.4.**
No voter-file-based targeting is deployed until a Kenyan data-protection or
electoral-law specialist has reviewed and signed off the specific proposed
processing. Nothing in this section should be read as a claim that such
processing is already permissible.

*The data sources the model draws on are listed in Annex G.5.*

#### Modelling methodology

| Model | Purpose | Strength |
|---|---|---|
| **Logistic regression** | Baseline support and turnout scores | Interpretability; identifies driving variables |
| **Random forest** | Non-linear pattern detection | Captures interactions; robust to outliers |
| **Gradient boosting (XGBoost)** | Final ensemble scoring | Highest predictive accuracy at scale |
| **Propensity score matching** | Volunteer conversion | Estimates causal effect of touchpoints on offline action |

Final output: an ensemble score (0–1) per polling station for likely support and
turnout likelihood.

*The model's variable dictionary is in Annex G.5.*

#### How the model is evaluated

| Metric | Target | Frequency |
|---|---|---|
| Back-test against 2022 | Scores built on the 2017 record, checked against each station's 2022 result; the error is reported, not pre-set | Once, before first use |
| Cross-validation stability | Variance < 5% across folds | Quarterly |
| Opt-in rate on routed doors | Higher on doors the model routes than on doors it does not | Monthly |

#### Putting the model to work

* **Ad targeting:** scored segments as custom audiences on Meta, Google, TikTok
* **SMS/USSD segmentation:** priority broadcast lists for high-support,
low-turnout polling-station areas — the single most valuable GOTV segment
* **Content personalisation:** different messages to station areas by their support
and turnout history
* **Volunteer routing:** ground teams directed to the highest-potential
polling-station areas first (Section 4.5.8)

#### The compliance gate this depends on

*The compliance gate, and the fallback the model runs on until it clears, are set out in 5.3.4.*

---

### 4.5.13 Workstream 13 — The technology stack

> **Mostly outside this engagement.** Dr. Mulu already holds accounts, hosting and the tooling in
> daily use, and procuring a stack the campaign already has is not a service. Firefly builds and
> operates three components only: the **service-delivery tracker**, the **supporter CRM**, and the
> **SMS/USSD/WhatsApp layer**. The rest of this section is the reference architecture the campaign
> owns and Firefly integrates against.
>
> **Group: Data and technology.** Four workstreams that sit under the rest: the data model, the voter model built on it, the technology stack that runs both, and the analytics layer that measures what the other ten produce.

*The reference architecture the campaign owns (component by component, the procurement matrix and the technical security protocols) is in Annex G.4.*

### 4.5.14 Workstream 14 — Analytics and attribution

> **Owner: Firefly. This is the engine room of the engagement.** It is numbered fourteenth because
> that is where the original numbering put it; it is read first, in Section 4.2.1, and it is the
> workstream every other one is measured by.
>
> **Group: Data and technology.** Four workstreams that sit under the rest: the data model, the voter model built on it, the technology stack that runs both, and the analytics layer that measures what the other ten produce.


#### Attribution model and offline conversion tracking

Measurement moves beyond vanity metrics to what drives votes: multi-touch
attribution, offline conversion tracking and effort-per-vote analysis, all
anchored to the ~{{benchmark}}-vote threshold.

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
| **Field canvass contact** | Direct event | Ward champion form (Section 4.5.8) |

To track offline-to-digital and physical engagement, four mechanisms bridge the gap:
* **Unique QR codes** on printed materials and at barazas, tracking which content drove physical attendance
* **SMS keyword short codes** — text a keyword to the campaign shortcode to register support and opt in
* **USSD completions** as a direct offline-to-digital bridge
* **Volunteer-reported contact outcomes** from the doorstep form (Section 4.5.8)

#### Key metrics and benchmarks

| Metric | Definition | Global benchmark | Campaign target |
|---|---|---|---|
| Share of voice | % of Kitui gubernatorial mentions about Dr. Mulu | 30–40% for leader | ≥ 50% |
| Net sentiment | (Positive − negative) / total | +20 to +30 | ≥ +40 |
| **Reach share in the deficit pool** | Share of his reach landing in Mwingi and Kitui South (R-02, Section 5.1.2) | — | **≥ {{pool.share}}%, the pool's share of the register** |
| Voter registration lift | Increase in target wards from campaign drives | 5–10% | ≥ 10% |
| Digital-to-offline conversion | % of engagers attending or volunteering | 5–15% | ≥ 10% |
| GOTV contact rate | % of target voters reached | 60–80% | ≥ 70% |
| **Contact share of win threshold** | Contacted voters ÷ {{benchmark}} | — | **≥ 75% by election week** |

#### The analytics maturity roadmap

*A staged path, so the campaign is never blocked waiting on capability.*

| Stage | Window | Capability | Prerequisite | Owner |
|---|---|---|---|---|
| **0 — Baseline** | Phase −1 | Platform-native dashboards; manual weekly report; SMS delivery reporting; single source of truth established | Accounts and pixel installed | Paid Media & Analytics Manager |
| **1 — Integrated** | Phase 0–1 | Unified BI dashboard across paid, organic, SMS, USSD, web; ward-level segmentation; A/B testing discipline | Consistent tagging taxonomy | Paid Media & Analytics Manager |
| **2 — Predictive** | Phase 1–2 | Voter scoring live; field-digital loop operating; audience segments driven by score | **Section 5.3.4 compliance gate cleared** | Data Analyst (surge) |
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
**24 hours** — the standard the Section E.6 drill tests
* Owns the deletion schedule and executes it (Section 5.3.3)
* Is the campaign's standing point of contact for the Section 5.3.4 compliance
reviewer
* Holds authority to **suspend any targeting activity** pending review, without
requiring commercial sign-off

At lean tier this role sits with the Digital Director; from standard tier it
sits with the Data Analyst. It is named in writing either way.
