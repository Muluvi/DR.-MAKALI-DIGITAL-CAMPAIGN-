```lead
Fourteen workstreams deliver the plan, in four groups: owned platforms and content, media, ground and offline reach, and data and technology. Each names what it produces, who owns it and how often it reports.
```

Fourteen workstreams deliver the plan, in four groups: owned platforms and content, media, ground and offline reach, and data and technology. Each names what it produces, who owns it and how often it reports. Seven are Firefly's to operate, six the existing team runs to a Firefly brief, and two are outside this engagement (Section 13.2).

```figure
id: fig-5-2-workstream-panels
```

```visual
kind: cards
preset: group
title: "The fourteen workstreams, in four groups"
note: "Each sets out what it produces, who owns it and how often it reports."
items:
  - title: "Platforms and content"
    badge: "workstreams 1 to 4"
  - title: "Publishing and earned media"
    badge: "5 and 6"
    text: "Two workstreams: paid media across the platforms that reach the connected minority, and earned media in a county whose Kamba-language radio is largely controlled by rivals."
  - title: "Ground and offline reach"
    badge: "7 to 10"
    text: "Four workstreams that reach voters off the internet: ground-digital integration, the field-to-digital loop, the SMS, USSD and voice layer, and the volunteer programme behind them."
  - title: "Data and technology"
    badge: "11 to 14"
    text: "Four workstreams that sit under the rest: the data model, the voter model built on it, the technology stack that runs both, and the analytics layer that measures what the other ten produce."
```

*The two scope lists below stay together, rather than being split across the workstreams that deliver them, until conflict C4 is settled.*

```visual
kind: checklist
title: "Digital infrastructure, brand and civic content"
items:
  - label: "Web management and digital architecture"
    body: "Development and deployment of a high-performance campaign web portal hosting the manifesto, tracking media appearances, and capturing volunteer data. Lightweight, rapid-loading frameworks so the site is usable on 3G and on feature-phone browsers — non-negotiable in a county at {{ict.internet}}% internet use (CA/KNBS 2023/24). **WCAG 2.1 AA compliance from build, not retrofitted** (Section 15.1.4). Search engine optimisation for \"Kitui Governor 2027\", \"Kitui development\" and related terms. A \"Meet Dr. Mulu\" page with biography, parliamentary record, M&E credentials and vision for Kitui. **Audit before build:** an existing Kitui Central NG-CDF web presence is already live. Phase 0 audits and integrates it rather than duplicating it."
  - label: "Brand management"
    body: "Core messaging matrix ensuring consistency across broadcast, print and digital. Dynamic digital press kits for media houses and influencers — approved biographies, high-resolution assets, policy briefs (Section 15.2.2). Daily management of Facebook, X, Instagram, TikTok, YouTube and WhatsApp. Community management: responses to comments, DMs and mentions within **2 hours** during peak periods. [CONFLICT C4: see open items]"
  - label: "Civic content and visual data"
    body: "Infographic analyses highlighting Kitui's economic challenges and Dr. Mulu's proposed solutions, anchored to the KSh {{budget.total|bn}} billion county envelope. Content calendars tailored to each segment in Section 10.4. Graphics, short video, motion graphics and policy explainers in English, Kiswahili and Kikamba. Human-interest storytelling: constituent testimonials, verified project outcomes, vision-driven narratives. A weekly **\"Dr. Mulu Explains\"** series breaking down county budgets, revenue sources and development economics in plain language."
```

```visual
kind: checklist
title: "Growth, field advertising and reputation operations"
items:
  - label: "Data analytics"
    body: "Real-time dashboards tracking reach, engagement, sentiment and conversion. Ward-level analytics identifying priority areas. Weekly A/B testing of messages, visuals and ad formats. Monthly voter sentiment reports to campaign leadership."
  - label: "Digital advertising"
    body: "Targeted Meta ads by ward, age, gender and interest. Google Search and Display to capture high-intent voters. YouTube pre-roll before local and national content. TikTok ads reaching first-time and younger voters. Retargeting to convert engaged users into volunteers. Monthly allocation matrix based on ward-level registration and engagement data."
  - label: "Crisis and reputation management"
    body: "Continuous sentiment monitoring across platforms. Rapid-response statements managing emerging narratives or opponent claims. Real-time monitoring and countering of misinformation and manipulated media (Sections 10.2 and 20.4)."
```

## 15.1 Owned platforms and content (workstreams 1–4)

The public service-delivery tracker, the content brief, creative testing and the accessibility standard.

### 15.1.1 Workstream 1 — Owned platforms and the service-delivery tracker

```lead
**The service-delivery tracker is Firefly's to build and operate; the owned platforms stay with your team.** Every candidate will promise water points, roads and markets. Only one is professionally qualified in **verifying whether promises were kept**.
```

**The service-delivery tracker is Firefly's to build and operate; the owned platforms stay with your team.** **Split ownership, and the split matters.** The tracker is new infrastructure nobody currently runs. The owned platforms stay with your team, who run them now and will continue to; Firefly's contribution there is the brief, the calendar and the approval gate.

*The single clearest expression of the candidate's actual
professional discipline.*

#### Why it exists

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

```visual
kind: checklist
items:
  - label: "USSD"
    text: "The campaign shortcode → option 3 → **works on any phone, no internet**"
  - label: "SMS"
    text: "Text the issue to the campaign shortcode"
  - label: "WhatsApp"
    text: "Message the campaign line"
  - label: "Web"
    text: "Simple mobile-first form, WCAG compliant"
  - label: "Ward champion"
    text: "Report in person; champion logs it"
```

#### What happens to a report

```figure
id: fig-5-2-1-report-flow
```

#### Design principles

```visual
kind: checklist
items:
  - label: "Public by default"
    body: "The register is visible to anyone, mapped by ward, with counts by category. Transparency is the point."
  - label: "No personal data published"
    body: "Reports appear with ward, category and status only. Contact details are used to update the reporter and nothing else, under the Section 19.3 charter."
  - label: "Outcomes published honestly — including failures"
    body: "Where an issue is not resolved, the register says so. A tracker that only shows successes is marketing, and voters recognise it instantly. Publishing unresolved items is what makes the resolved ones credible."
  - label: "No false authority"
    body: "Dr. Mulu is not the county government. The tracker records what was reported, what was raised, and what happened — never implying powers he does not hold. Overclaiming here would invite exactly the attack the tool exists to pre-empt."
  - label: "Continues after the election"
    body: "Stated up front. A tracker that closes on polling day was a campaign tactic; one that continues is a governance commitment — and the commitment is the persuasive element."
```

#### What it is worth to the campaign

```visual
kind: checklist
items:
  - label: "Narrative"
    body: "the strongest possible proof of the Verification pillar (Section 10.1) — evidence rather than assertion"
  - label: "Data"
    body: "the issues citizens report, ward by ward, counted from what arrives rather than assumed, feeding directly into the weekly brief"
  - label: "Organising"
    body: "every report is a consented contact and a warm lead for ward champions"
  - label: "Earned media"
    body: "a public register of county service-delivery failures is a standing story for county correspondents (Section 15.2.2)"
  - label: "Defensive"
    body: "it makes \"he is not close to ordinary people\" a difficult attack to sustain against a candidate publishing their reported problems"
```

#### Build

Built on the USSD and SMS layer Firefly operates (Section 15.3.3), plus a lightweight public register on the campaign site. **It reuses a
layer the campaign is building anyway; nothing comparable exists in this race.**

#### The opening register: the county's own scorecard

The tracker does not start from an empty list. The county's *Delivering the Kitui Promise* scorecard (August 2022 – August 2025) claims {{scorecard.claimed}} projects and itemises {{scorecard.itemised}} of them with value, ward and status, KSh {{scorecard.itemised.ksh|bn}} billion in all (Tier 1 as a record of what the county claims, not evidence that the claims are true). Those rows load as the tracker's opening register ([kitui-scorecard-projects.csv](/data/kitui-scorecard-projects.csv)): each becomes a public row, *County says: complete. Residents say: ___*, and reports through USSD option 3 fill the second column.

The first verification questions are inconsistencies inside the county's document or against an official statistic. Each is a question to publish and test, not an accusation, and a county correspondent can check the first six independently (Section 15.2.2).

```visual
kind: checklist
title: "The tracker's first questions"
items:
  - label: "Q1. Livestock vaccinated"
    text: "{{scorecard.vaccinated}} claimed (Tier 1, county scorecard); the itemised rows total {{scorecard.vaccinated.itemised}} animals (calculated)."
  - label: "Q2. Infant mortality"
    text: "Claimed to fall from {{scorecard.imr.from}} to {{scorecard.imr.to}} per thousand births; KDHS 2022 puts Kitui at {{health.imr}}. Is the scorecard's figure a facility rate or a county rate?"
  - label: "Q3. Roads graded"
    text: "{{scorecard.roads.graded}} km claimed; the itemised row of {{scorecard.roads.row.km}} km (Tier 1) comes to KSh {{scorecard.roads.row.per-km}} a km (calculated)."
  - label: "Q4. Boreholes"
    text: "{{scorecard.boreholes.drilled}} drilled and {{scorecard.boreholes.equipped}} equipped: are the rest not yet equipped?"
  - label: "Q5. Health beneficiaries"
    text: "Two health projects list {{scorecard.health.beneficiaries}} beneficiaries (Tier 1, county scorecard), more than the county's 2019 population of {{census.population}}: a catchment, not people served?"
  - label: "Q6. The unitemised projects"
    text: "{{scorecard.claimed}} claimed, {{scorecard.itemised}} itemised: where is the list of the other {{scorecard.unitemised}} (calculated)?"
  - label: "Q7. Kangu Kangu"
    text: "KSh {{scorecard.kangu.ksh|m1}} million for {{scorecard.kangu.households}}+ households (Tier 1, county scorecard), commissioned after the period the scorecard covers: what has been delivered since?"
  - label: "Q8. Boda boda sheds"
    text: "{{scorecard.boda.sheds}} claimed; {{scorecard.boda.sheds.itemised}} itemised."
  - label: "Q9. Ward attributions"
    text: "Some rows place wards in the wrong constituency (Voo/Kyamatu under Kitui South; it is in Kitui East): a data-quality point for any ward-level use."
```

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

#### Dual Operational Function:

1.  **As a Campaign Credibility Asset (Pre-Election):**
    *   *Public Web & USSD Transparency:* Voters can dial `*[shortcode]#` or visit the web portal to query exact project GPS coordinates, contract values, and completion certificates in their own village.
    *   *Debate & Media Weapon:* Equips candidate and spokespersons with instant, primary-sourced factual data to rebut rival exaggerations on live radio and television debates.
2.  **As a Day-One Governing Tool (Post-Election):**
    *   *Statutory Ward Equalization Tracking:* Establishes the operational framework for managing the **Ksh {{policy.ward-fund|m}} Million/Ward Annual Fund**, tracking execution velocity and contractor payments across all 40 wards in real time.
    *   *Zero Pending Bills Enforcer:* Integrates directly into the County Treasury accounting system to ensure all ward projects are verified before invoice settlement, preventing the recurrence of county debt.

### 15.1.2 Workstream 2 — The content brief and asset governance

```lead
**Owner: your team, to a Firefly brief.** Your producers write, film, edit and publish, as they do today. What this workstream adds is the brief and the approval gate.
```

**Owner: your team, to a Firefly brief.** Your producers write, film, edit and publish, as they do today. What this workstream adds is the brief that tells them which pillar, which ward, which language and which format — and the approval gate on new policy claims and Kikamba output.

Campaign communications succeed when production is treated as a pipeline rather than ad-hoc creative posting. In a county where only {{ict.internet}}% of residents use the internet (CA/KNBS 2023/24, Section 4.1), the content production engine must be **predominantly focused on offline and broadcast formats**—vernacular radio scripts, 2G bulk SMS, USSD menu trees, printed baraza photobooks, and market PA audio jingles—while maintaining a high-fidelity digital and video pipeline for youth and the diaspora.

```figure
id: production-pipeline
```

*The four content pillars are now in 10.1, with the other production pillars. Formats by channel and the radio, SMS and USSD copy samples are in Annex C.2.*

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

### 15.1.3 Workstream 3 — Creative testing and AI assistance

```lead
**Owner: Firefly.** Test design, variant selection and the read on the result are analysis. Your team produces the variants.
```

**Owner: Firefly.** Test design, variant selection and the read on the result are analysis. Your team produces the variants.

#### What AI is used for, and what it is never used for

```visual
kind: contrast
left:
  title: "What AI is used for"
  items:
    - { label: "AI is used to test and optimise content so that every regulated ad placement delivers maximum persuasive impact." }
    - { label: "AI assists production and optimisation." }
right:
  title: "What it is never used for"
  items:
    - { label: "to fabricate imagery of real people" }
    - { label: "to simulate events that did not occur" }
    - { label: "to generate synthetic voices of the candidate or any other person" }
body: "**Disclosure commitment.** AI assists production and optimisation. It is never used to fabricate imagery of real people, simulate events that did not occur, or generate synthetic voices of the candidate or any other person. Where AI-generated illustration appears in published material, it is labelled. This is a published commitment (Section 19.3) and a defensive necessity in an environment where opponents may deploy manipulated media (Section 20.4)."
```

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

```visual
kind: checklist
items:
  - label: "Minimum 5 ad variations per objective per platform"
  - label: "Minimum 3 headline and 3 visual variations per ad set"
  - label: "Monday–Thursday learning; Friday–Sunday optimisation and scaling"
  - label: "Effort split: **30% testing, 70% proven performers**"
  - label: "Automatic kill rule: any ad below the **1.5% CTR** threshold after 5,000 impressions is paused"
```

#### Performance targets

| Metric | Campaign target |
|---|---|
| Facebook CTR | ≥ 1.5% |
| Facebook CPM | ≤ $2 |
| Google Search CTR | ≥ 3% |
| TikTok engagement rate | ≥ 5% |
| YouTube view rate | ≥ 35% |
| **SMS delivery rate** | ≥ 98% |
| **SMS opt-out rate** | **< 2%** |

### 15.1.4 Workstream 4 — Accessibility and inclusion

```lead
**Owner: Firefly sets the standard; your team applies it.** In a county where {{edu.none.women}}% of women and {{edu.none.men}}% of men aged six and over have no education, accessibility is reach, not compliance theatre.
```

**Owner: Firefly sets the standard; your team applies it.** Written into every weekly brief, at every engagement level, and never traded away.

*The languages this standard works in, and the content mix for locally facing platforms, are set out in 12.4.*

**Governance.** A native Kikamba speaker is a named role at every engagement
level (Section 17.3), not an occasional reviewer. No Kikamba content publishes
without their sign-off. Proverbs carry cultural weight and misused proverbs
do cultural damage — in a campaign built on rigour, a mangled idiom is a
substantive error, not a cosmetic one.

#### What accessibility means here

*In a county where {{edu.none.women}}% of women and {{edu.none.men}}% of men aged six and over have no education,
accessibility is reach, not compliance theatre.*

#### The case

```visual
kind: stats
items:
  - value: "{{edu.none.women}}%"
    label: "of women aged 6+ have no education"
    tier: 1
    body: "KDHS 2022 via the County Gender Data Sheet (October 2025): {{edu.none.women}}% of females and {{edu.none.men}}% of males aged six and over have no education. This replaces an untiered 13.0% (\"never attended school\", a different measure). 17.4% completed secondary is still not yet tiered."
  - value: "{{ict.offline}}%"
    label: "outside the internet-using population"
    tier: 1
    body: "**{{ict.offline}}% are outside the internet-using population** (CA/KNBS 2023/24)"
body: "Kenyans with disabilities are a substantial constituency systematically under-served by campaign communication in every cycle. In Kitui, {{disability.men}}% of men and {{disability.women}}% of women aged 15 and over have a disability (2022, Tier 1). Low bandwidth is itself an accessibility constraint"
```

A campaign built on transparency that publishes only in dense written English
is not transparent. It is legible to the people who already had access.

```visual
kind: checklist
title: "The commitments"
items:
  - label: "Sign language"
    text: "**Kenyan Sign Language interpretation on all flagship video** — manifesto launch, vision video, monthly Economic Brief, closing argument."
    body: "Full-video coverage at premium tier. Interpreter engaged through the Kenya National Association of the Deaf or an accredited interpreter service"
  - label: "Captioning"
    text: "Burned-in captions on **all** video, in the language of the audio."
    body: "Non-negotiable: most social video is watched without sound"
  - label: "Website"
    text: "**WCAG 2.1 AA** — semantic structure, keyboard navigation, contrast ratios, alt text on every image and infographic, no information conveyed by colour alone"
  - label: "Plain language"
    text: "Every policy document paired with a **one-page plain-language summary** in all three languages, written to be read aloud"
  - label: "Audio versions"
    text: "Every flagship policy item available as audio, distributable by WhatsApp, voice note and radio"
  - label: "Low bandwidth"
    text: "Text-first fallbacks;"
    body: "compressed images; a site that loads on 3G; SMS and USSD paths to the same information (Section 15.3.3)"
  - label: "Print"
    text: "Ward-level materials in large print with QR and USSD codes"
```

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
