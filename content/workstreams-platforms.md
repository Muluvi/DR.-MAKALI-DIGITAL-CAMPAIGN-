## 4.5 The fourteen workstreams

```figure
id: fig-5-2-workstream-panels
```

The fourteen workstreams, in four groups: 4.5 Platforms and content (workstreams 1 to 4), 4.5 Publishing and earned media (5 and 6), 4.5 Ground and offline reach (7 to 10) and 4.5 Data and technology (11 to 14). Each sets out what it produces, who owns it and how often it reports.

*The two scope lists below stay together, rather than being split across the workstreams that deliver them, until conflict C4 is settled.*

#### Digital infrastructure, brand and civic content

* **Web management and digital architecture:** Development and deployment of a high-performance campaign web portal hosting the manifesto, tracking media appearances, and capturing volunteer data. Lightweight, rapid-loading frameworks so the site is usable on 3G and on feature-phone browsers — non-negotiable in a county at {{ict.internet}}% internet use (CA/KNBS 2023/24). **WCAG 2.1 AA compliance from build, not retrofitted** (Section 4.5.4). Search engine optimisation for "Kitui Governor 2027", "Kitui development" and related terms. A "Meet Dr. Mulu" page with biography, parliamentary record, M&E credentials and vision for Kitui. **Audit before build:** an existing Kitui Central NG-CDF web presence is already live. Phase 0 audits and integrates it rather than duplicating it.
* **Brand management:** Core messaging matrix ensuring consistency across broadcast, print and digital. Dynamic digital press kits for media houses and influencers — approved biographies, high-resolution assets, policy briefs (Section 4.5.6). Daily management of Facebook, X, Instagram, TikTok, YouTube and WhatsApp. Community management: responses to comments, DMs and mentions within **2 hours** during peak periods. [CONFLICT C4: see open items]
* **Civic content and visual data:** Infographic analyses highlighting Kitui's economic challenges and Dr. Mulu's proposed solutions, anchored to the KSh13.79bn county envelope. Content calendars tailored to each segment in Section C.1. Graphics, short video, motion graphics and policy explainers in English, Kiswahili and Kikamba. Human-interest storytelling: constituent testimonials, verified project outcomes, vision-driven narratives. A weekly **"Dr. Mulu Explains"** series breaking down county budgets, revenue sources and development economics in plain language.

#### Growth, field advertising and reputation operations

* **Data analytics:** Real-time dashboards tracking reach, engagement, sentiment and conversion. Ward-level analytics identifying priority areas. Weekly A/B testing of messages, visuals and ad formats. Monthly voter sentiment reports to campaign leadership.
* **Digital advertising:** Targeted Meta ads by ward, age, gender and interest. Google Search and Display to capture high-intent voters. YouTube pre-roll before local and national content. TikTok ads reaching first-time and younger voters. Retargeting to convert engaged users into volunteers. Monthly allocation matrix based on ward-level registration and engagement data.
* **Crisis and reputation management:** Continuous sentiment monitoring across platforms. Rapid-response statements managing emerging narratives or opponent claims. Real-time monitoring and countering of misinformation and manipulated media (Sections 3.5 and 6.3).

---

### 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker

> **Split ownership, and the split matters.** The **service-delivery tracker is Firefly's to build
> and operate** — it is new infrastructure nobody currently runs. **The owned platforms stay with
> your team**, who run them now and will continue to; Firefly's contribution there is the brief,
> the calendar and the approval gate.
>
> **Group: Platforms and content** (workstreams 1 to 4).


*The single clearest expression of the candidate's actual
professional discipline.*

#### Why it exists

Dr. Mulu is a monitoring and evaluation specialist — a member of the Evaluation
Society of Kenya and an M&amp;E Champion recognised by the Ministry of Finance,
whose constituency was certified best evaluated in the Eastern region.

Every candidate in this race will promise water points, roads and markets. Only
one is professionally qualified in **verifying whether promises were kept**. A
public service-delivery tracker is not a campaign gadget; it is that
qualification, running in public, before the election rather than after it.

#### What it is

A simple public tool through which any Kitui resident can report and follow up
on a local service-delivery issue — a broken water point, an impassable feeder
road, a market without sanitation, a stalled project. [CONFLICT C5: see open items]

**Deliberately multi-channel, because the people with the most to report have
the least connectivity:**

| Channel | Access route |
|---|---|
| **USSD** | The campaign shortcode → option 3 → **works on any phone, no internet** |
| **SMS** | Text the issue to the campaign shortcode |
| **WhatsApp** | Message the campaign line |
| **Web** | Simple mobile-first form, WCAG compliant |
| **Ward champion** | Report in person; champion logs it |

#### What happens to a report

```figure
id: fig-5-2-1-report-flow
```

#### Design principles

1. **Public by default.** The register is visible to anyone, mapped by ward,
with counts by category. Transparency is the point.
2. **No personal data published.** Reports appear with ward, category and
status only. Contact details are used to update the reporter and nothing
else, under the Section 5.3.3 charter.
3. **Outcomes published honestly — including failures.** Where an issue is not
resolved, the register says so. A tracker that only shows successes is
marketing, and voters recognise it instantly. Publishing unresolved items is
what makes the resolved ones credible.
4. **No false authority.** Dr. Mulu is not the county government. The tracker
records what was reported, what was raised, and what happened — never
implying powers he does not hold. Overclaiming here would invite exactly the
attack the tool exists to pre-empt.
5. **Continues after the election.** Stated up front. A tracker that closes on
polling day was a campaign tactic; one that continues is a governance
commitment — and the commitment is the persuasive element.

#### What it is worth to the campaign

* **Narrative:** the strongest possible proof of the Verification pillar
(Section 3.2.1) — evidence rather than assertion
* **Data:** the issues citizens report, ward by ward, counted from what arrives
rather than assumed, feeding directly into the weekly brief
* **Organising:** every report is a consented contact and a warm lead for ward
champions
* **Earned media:** a public register of county service-delivery failures is a
standing story for county correspondents (Section 4.5.6)
* **Defensive:** it makes "he is not close to ordinary people" a difficult
attack to sustain against a candidate publishing their reported problems

#### Build

Built on the USSD/SMS infrastructure the campaign is already deploying (Section
4.3 [CHECK REF]), plus a lightweight public register on the campaign site. **It reuses a
layer the campaign is building anyway; nothing comparable exists in this race.**

#### Tracker KPIs

| Metric | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| Reports received | {{target.tracker.phase-1}} | {{target.tracker.phase-2}} | {{target.tracker.phase-3}} |
| Wards with at least one report | 25 | 40 | 40 |
| Reports with published status update | ≥ 80% | ≥ 85% | ≥ 90% |
| Median time to first status update | 14 days | 10 days | 7 days |
| Reports converting to consented contacts | ≥ 60% | ≥ 65% | ≥ 70% |
| Earned media items citing the tracker | 1 | 3 | 5 |

#### The service-delivery performance tracker

The campaign builds and maintains the **Kitui County Service-Delivery Performance Tracker**, a live analytical dashboard and open-data ledger that serves a dual purpose: during the campaign, it operates as an **irrefutable evidence asset** countering opposition claims; post-election, it transitions into the **Governor's Day-One Public Delivery Dashboard**. [CONFLICT C5: see open items]

```figure
id: delivery-tracker
```

##### Dual Operational Function:
1.  **As a Campaign Credibility Asset (Pre-Election):**
    *   *Public Web & USSD Transparency:* Voters can dial `*[shortcode]#` or visit the web portal to query exact project GPS coordinates, contract values, and completion certificates in their own village.
    *   *Debate & Media Weapon:* Equips candidate and spokespersons with instant, primary-sourced factual data to rebut rival exaggerations on live radio and television debates.
2.  **As a Day-One Governing Tool (Post-Election):**
    *   *Statutory Ward Equalization Tracking:* Establishes the operational framework for managing the **Ksh {{policy.ward-fund|m}} Million/Ward Annual Fund**, tracking execution velocity and contractor payments across all 40 wards in real time.
    *   *Zero Pending Bills Enforcer:* Integrates directly into the County Treasury accounting system to ensure all ward projects are verified before invoice settlement, preventing the recurrence of county debt.

---


### 4.5.2 Workstream 2 — The content brief and asset governance

> **Owner: your team, to a Firefly brief.** Your producers write, film, edit and publish, as they
> do today. What this workstream adds is the brief that tells them which pillar, which ward, which
> language and which format — and the approval gate on new policy claims and Kikamba output.
> Firefly holds no credentials and publishes nothing here.
>
> **Group: Platforms and content** (workstreams 1 to 4).


Campaign communications succeed when production is treated as a rigorous, industrial pipeline rather than ad-hoc creative posting. In a county where only {{ict.internet}}% of residents use the internet (CA/KNBS 2023/24, Section 2.9.1), the content production engine must be **predominantly focused on offline and broadcast formats**—vernacular radio scripts, 2G bulk SMS, USSD menu trees, printed baraza photobooks, and market PA audio jingles—while maintaining a high-fidelity digital and video pipeline for youth and the diaspora.

```figure
id: production-pipeline
```

*The four content pillars are now in 3.2.3, with the other production pillars. Formats by channel and the radio, SMS and USSD copy samples are in Annex G.2.*

#### The weekly production schedule

The creative studio operates on a synchronized **7-Day Production Cadence**:

```figure
id: weekly-cycle
```

#### Who approves what, and when

To prevent defamatory statements, policy contradictions, electoral code infractions, or Data Protection Act (DPA) violations, **no asset may be broadcast or printed without passing through the 4-Step Governance Gateway**:

```figure
id: approval-gateway
```

#### The asset library

All creative assets are stored in a centralized, cloud-backed Digital Asset Management repository structured as follows:

```figure
id: asset-library
```


---

### 4.5.3 Workstream 3 — Creative testing and AI assistance

> **Owner: Firefly.** Test design, variant selection and the read on the result are analysis.
> Your team produces the variants.
>
> **Group: Platforms and content** (workstreams 1 to 4).


#### What AI is used for, and what it is never used for

AI is used to test and optimise content so that every regulated ad placement
delivers maximum persuasive impact.

**Disclosure commitment.** AI assists production and optimisation. It is never
used to fabricate imagery of real people, simulate events that did not occur,
or generate synthetic voices of the candidate or any other person. Where
AI-generated illustration appears in published material, it is labelled. This
is a published commitment (Section 5.3.3) and a defensive necessity in an
environment where opponents may deploy manipulated media (Section 6.3.1).

#### Tools and platforms

| Tool | Function | Management |
|---|---|---|
| Meta Advantage+ Creative | Automatic variation testing and delivery reallocation | Platform dashboard |
| Google Responsive Search Ads | Headline/description combination testing | Platform dashboard |
| AI creative variation tools | Ad creative variations at scale | Cloud-based |
| Design tooling with AI assist | Rapid Kikamba-language infographics and cards | Cloud-based |
| AI writing assistance | First-draft copy for email, social and ads — **always human-edited, always native-speaker-reviewed for Kikamba** | Cloud-based |

*Specific vendor selection at contracting; no tool is presented as retained.*

#### The weekly testing cycle

* Minimum 5 ad variations per objective per platform
* Minimum 3 headline and 3 visual variations per ad set
* Monday–Thursday learning; Friday–Sunday optimisation and scaling
* Effort split: **30% testing, 70% proven performers**
* Automatic kill rule: any ad below **1.5% CTR**
after 5,000 impressions is paused

#### Performance benchmarks

| Metric | Global standard | Campaign target |
|---|---|---|
| Facebook CTR | 1.0–1.5% | ≥ 1.5% |
| Facebook CPM | $1–$5 | ≤ $2 |
| Google Search CTR | 2–5% | ≥ 3% |
| TikTok engagement rate | 3–6% | ≥ 5% |
| YouTube view rate | 30–50% | ≥ 35% |
| **SMS delivery rate** | 98–99.9% | ≥ 98% |
| **SMS opt-out rate** | — | **< 2%** |

---

### 4.5.4 Workstream 4 — Accessibility and inclusion

> **Owner: Firefly sets the standard; your team applies it.** Written into every weekly brief,
> at every engagement level, and never traded away.
>
> **Group: Platforms and content** (workstreams 1 to 4).


*The languages this standard works in, and the content mix for locally facing platforms, are set out in 3.6.1.*

**Governance.** A native Kikamba speaker is a named role at every engagement
level (Section 4.6.3), not an occasional reviewer. No Kikamba content publishes
without their sign-off. Proverbs carry cultural weight and misused proverbs
do cultural damage — in a campaign built on rigour, a mangled idiom is a
substantive error, not a cosmetic one.

#### What accessibility means here

*In a county where 13.0% of the population never attended school,
accessibility is reach, not compliance theatre.*

#### The case

* **13.0% of Kitui residents have never attended school**; only 17.4% completed
secondary education
* **{{ict.offline}}% are outside the internet-using population** (CA/KNBS 2023/24)
* Kenyans with disabilities are a substantial constituency systematically
under-served by campaign communication in every cycle
* Low bandwidth is itself an accessibility constraint

A campaign built on transparency that publishes only in dense written English
is not transparent. It is legible to the people who already had access.

#### The commitments

| Area | Commitment |
|---|---|
| **Sign language** | **Kenyan Sign Language interpretation on all flagship video** — manifesto launch, vision video, monthly Economic Brief, closing argument. Full-video coverage at premium tier. Interpreter engaged through the Kenya National Association of the Deaf or an accredited interpreter service |
| **Captioning** | Burned-in captions on **all** video, in the language of the audio. Non-negotiable: most social video is watched without sound |
| **Website** | **WCAG 2.1 AA** — semantic structure, keyboard navigation, contrast ratios, alt text on every image and infographic, no information conveyed by colour alone |
| **Plain language** | Every policy document paired with a **one-page plain-language summary** in all three languages, written to be read aloud |
| **Audio versions** | Every flagship policy item available as audio, distributable by WhatsApp, voice note and radio |
| **Low bandwidth** | Text-first fallbacks; compressed images; a site that loads on 3G; SMS and USSD paths to the same information (Section 4.5.9) |
| **Print** | Ward-level materials in large print with QR and USSD codes |

#### Why this is scope, not an annex

The plain-language and audio versions are not a parallel accessibility track —
they are the **primary format for the largest segment of the electorate**. A
one-page plain-language summary that can be read aloud at a baraza, sent as a
voice note, and broadcast on County FM is the most-used asset the campaign will
produce. Building it as an afterthought means building the campaign's most
important content last.

#### Accessibility KPIs

| Metric | Target |
|---|---|
| Flagship videos with KSL interpretation | 100% |
| Video with captions | 100% |
| WCAG 2.1 AA audit pass | Before public launch, re-audited quarterly |
| Policy documents with plain-language summary | 100% |
| Flagship content with audio version | 100% |
| Site load time on simulated 3G | &lt; 3 seconds |
