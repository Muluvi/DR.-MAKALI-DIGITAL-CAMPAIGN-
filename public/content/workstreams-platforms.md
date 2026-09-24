## 5.2.1 Platforms and content

### 5.2.1.1 Workstream 1 — Owned platforms and the service-delivery tracker

> **Split ownership, and the split matters.** The **service-delivery tracker is Firefly's to build
> and operate** — it is new infrastructure nobody currently runs. **The owned platforms stay with
> your team**, who run them now and will continue to; Firefly's contribution there is the brief,
> the calendar and the approval gate.


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
road, a market without sanitation, a stalled project.

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
else, under the Section 5.7.8 charter.
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
(Section 4.1.5) — evidence rather than assertion
* **Data:** ward-level issue salience derived from citizens' own priorities
rather than from campaign assumptions, feeding directly into content and
message-lab design
* **Organising:** every report is a consented contact and a warm lead for ward
champions
* **Earned media:** a public register of county service-delivery failures is a
standing story for county correspondents (Section 5.2.2.2)
* **Defensive:** it makes "he is not close to ordinary people" a difficult
attack to sustain against a candidate publishing their reported problems

#### Build

Built on the USSD/SMS infrastructure the campaign is already deploying (Section
4.3), plus a lightweight public register on the campaign site. **It reuses a
layer the campaign is building anyway; nothing comparable exists in this race.**

#### Tracker KPIs

| Metric | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| Reports received | 500 | 3,000 | 8,000 |
| Wards with at least one report | 25 | 40 | 40 |
| Reports with published status update | ≥ 80% | ≥ 85% | ≥ 90% |
| Median time to first status update | 14 days | 10 days | 7 days |
| Reports converting to consented contacts | ≥ 60% | ≥ 65% | ≥ 70% |
| Earned media items citing the tracker | 1 | 3 | 5 |

---

### 5.2.1.2 Workstream 2 — The content brief and asset governance

> **Owner: your team, to a Firefly brief.** Your producers write, film, edit and publish, as they
> do today. What this workstream adds is the brief that tells them which pillar, which ward, which
> language and which format — and the approval gate on new policy claims and Kikamba output.
> Firefly holds no credentials and publishes nothing here.


Campaign communications succeed when production is treated as a rigorous, industrial pipeline rather than ad-hoc creative posting. In a county where only ~14% of voters are active on digital social media (Section 2.6), the content production engine must be **predominantly focused on offline and broadcast formats**—vernacular radio scripts, 2G bulk SMS, USSD menu trees, printed baraza photobooks, and market PA audio jingles—while maintaining a high-fidelity digital and video pipeline for youth and the diaspora.

```figure
id: production-pipeline
```

#### The four content pillars

> **Section 4.5 is the live version of this list.** The four pillars there are anchored on
> Dr. Mulu's own cover line and are set by the Week 1 audit. The four below are the thematic
> buckets they draw from, kept because the message grids in Annex D index against them.

Production buckets, not a restatement of the campaign pillars in Section 4.1.4 or the message
pillars in Section 4.4. Every piece of creative output anchors to one of these four, and each
carries one or more of the Section 4.1.4 pillars:

1.  **Pillar A: The Integrity & Stewardship Ledger (*Kĩtĩo kya Kũthũkũma*)**
    *   *Core Theme:* 13 years of spotless public financial management and zero Auditor-General queries in Kitui Central NG-CDF.
    *   *Tone:* Authoritative, calm, legally certified, transparent.
    *   *Primary Formats:* Radio debate evidence cards, documentary video case studies, audit certificate infographics, press statements.
2.  **Pillar B: The Agrarian & Household Wealth Engine (*Ũtonga wa Mĩsyĩ na Mĩũnda*)**
    *   *Core Theme:* Guaranteed minimum floor prices for *ndengu* (Ksh 85/kg), county aggregation cold-storage hubs, solar borehole irrigation, and livestock feed reserves.
    *   *Tone:* Pragmatic, empathetic, farmer-centric, culturally resonant Kikamba.
    *   *Primary Formats:* Vernacular morning radio skits, 2G market day SMS alerts, printed agricultural policy fold-outs.
3.  **Pillar C: Devolution Equity & Universal Basic Services (*Kĩla Kĩtheka na Mwanya Wayo*)**
    *   *Core Theme:* The statutory Ksh 100 Million/year Ward Equalization Fund, solar water within 1 km, functional maternity dispensaries, and bursary equity.
    *   *Tone:* Inclusive, forward-looking, accountable, grassroots-empowering.
    *   *Primary Formats:* Ward-by-ward budget pledge cards, USSD interactive budget explorer, market caravan speeches.
4.  **Pillar D: The Youth Enterprise & TVET Frontier (*Mwanya wa Mwanake na Wathi*)**
    *   *Core Theme:* Zero-interest equipment loans, digital cottage hubs, fee waivers for artisan TVET courses, and boda boda dignity.
    *   *Tone:* Energetic, aspirational, street-smart Sheng/Kikamba blend, action-oriented.
    *   *Primary Formats:* Vertical TikTok/Reels clips, sound truck music tracks, boda boda shed sticker banners, WhatsApp voice notes.

#### Formats, by channel

```figure
id: format-specs
```

#### Copy samples: radio, SMS and USSD

##### A. Vernacular Radio 45-Second Script Sample (Kikamba)
> **SFX:** Ambient sounds of a busy grain market (*ndengu* bags being loaded, tractor engine idling).  
> **Elder Farmer (Male, 50s):** *"Mwaĩĩ, nĩtwamĩnyie kũthoozya ndengu ya mĩio mĩtheke kwa mbesa nini nũndũ wa makuli? (My brother, are we tired of selling our hard-earned green grams for pennies to exploitative middlemen?)"*  
> **Candidate (Dr. Makali Mulu, Calm & Authoritative):** *"Nĩ Mwanya Mweũ. Serikalĩ yitũ ya Kitui ĩkese kũũnganĩsya ndengu yonthe na kũthoozya kĩla kilo kĩvĩndĩ kĩla kĩũ (Ksh 85). Wathi witũ nĩ ũtonga wa mĩsyĩ. Nĩ ngwenda twĩthĩwe na mbesa mĩkonĩ yitũ. (A new dawn is here. Our Kitui government will aggregate all produce and guarantee a floor price of Ksh 85/kg. Our priority is household wealth. Real money in your hands.)"*  
> **Voiceover (Fast, Punchy):** *"Vota Dr. Makali Mulu – Gavana wa Kitui 2027. Muvisi Mũlũngalu, Mwĩkĩi wa Wathi! (Vote Dr. Makali Mulu – Governor Kitui 2027. The Proven Economist, The Trusted Leader!)"*

##### B. Direct 2G Bulk SMS Copy Sample (Ward-Specific)
> *"Kitui Rural / Mbitini: Dr. Makali Mulu guarantees Ksh 100M Ward Fund to pipe clean solar water to Mbitini Market & expand youth loans. Reply 1 to join. Reply STOP to opt out."*

##### C. USSD Interactive Menu Tree Structure

The menu is set out once, in Section 5.2.3.3, which governs the offline layer. The shortcode and
sender ID are those the aggregator provisions at contracting. Nothing here should be printed, dialled or published as a working number.

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

### 5.2.1.3 Workstream 3 — Creative testing and AI assistance

> **Owner: Firefly.** Test design, variant selection and the read on the result are analysis.
> Your team produces the variants.


#### What AI is used for, and what it is never used for

AI is used to test and optimise content so that every regulated ad placement
delivers maximum persuasive impact.

**Disclosure commitment.** AI assists production and optimisation. It is never
used to fabricate imagery of real people, simulate events that did not occur,
or generate synthetic voices of the candidate or any other person. Where
AI-generated illustration appears in published material, it is labelled. This
is a published commitment (Section 5.7.8) and a defensive necessity in an
environment where opponents may deploy manipulated media (Section 5.8.7).

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

### 5.2.1.4 Workstream 4 — Accessibility and inclusion

> **Owner: Firefly sets the standard; your team applies it.** Written into every weekly brief,
> at every engagement level, and never traded away.


Language is central to trust in Kitui.

* **Kikamba** — deep local resonance, especially on WhatsApp, TikTok, Facebook,
SMS and radio. Local proverbs, idioms and cultural reference. Working
examples, all requiring native-speaker verification before publication:
  * *"Kĩtui nĩ yethu, tũtethanĩe"* — Kitui is ours, let us help each other
  * The Kamba call-and-response form — opening a video with *"Mbee! Mbee!"*
(Forward! Forward!)
  * *"Kĩla kĩndũ kĩ na thayũ, ĩtina nĩ kũmenya"* — everything has a solution,
the key is knowledge — framing his expertise
  * Imagery: the baobab as resilience, the calabash as shared resources
  * The examples above are working drafts, not verified copy: every Kikamba proverb and phrase is reviewed and corrected by a native speaker before publication.
* **Kiswahili** — broader reach, urban and younger audiences, national framing
* **English** — policy depth, professional audiences, national media

**Content mix for locally facing platforms:**

| Language | Share | Primary use |
|---|---|---|
| **Kikamba** | **50%** | WhatsApp, TikTok, Facebook grassroots, voice notes, radio, USSD — **not bulk SMS** (§5.2.3.3) |
| **Kiswahili** | **30%** | General social, national reach, SMS |
| **English** | **20%** | Policy documents, website, X, YouTube, national media |

**Governance.** A native Kikamba speaker is a named role at every engagement
level (Section 5.9.3), not an occasional reviewer. No Kikamba content publishes
without their sign-off. Proverbs carry cultural weight and misused proverbs
do cultural damage — in a campaign built on rigour, a mangled idiom is a
substantive error, not a cosmetic one.

#### What accessibility means here

*In a county where 13.0% of the population never attended school,
accessibility is reach, not compliance theatre.*

#### The case

* **13.0% of Kitui residents have never attended school**; only 17.4% completed
secondary education
* Roughly **86% are outside the internet-using population**
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
| **Low bandwidth** | Text-first fallbacks; compressed images; a site that loads on 3G; SMS and USSD paths to the same information (Section 5.2.3.3) |
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
