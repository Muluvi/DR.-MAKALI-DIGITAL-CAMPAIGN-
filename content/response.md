## 20.1 Risks and responses

Six risks decide whether this plan survives contact. Everything after this section is how each
is handled; Annex F carries the runbooks.

```figure
id: fig-5-8-risk
```

```textversion
**R1 and R2 are the two that change the plan rather than damage it**, and both are resolved by
measurement rather than by contingency: one by obtaining the party's 2027 nomination rules, the
other by the Week 1 presence audit. Both resolve inside the first weeks, which is the argument for
starting there.

**R6 is the risk specific to this engagement's shape.** A direction model with no disagreement
protocol fails on its first collision — and it fails quietly, because a team that is overruled once
stops raising the objection rather than stopping the behaviour. The override log exists so that
friction surfaces as evidence instead of as attrition.
```

## 20.2 The war room and rapid-response protocol

> **The runbooks are in Annex E.** The four-tier response decision tree (E.1), the response
> times by channel (E.2), the pre-drafted holding positions (E.3), the monitoring tooling
> (F.4, F.11), the pre-approved message library (E.5), the red-team drill format
> (E.6), the threat model and security baseline (E.7–E.10) and the competitive
> intelligence outputs (E.12) are set out there in full. They are operational detail: what a
> principal approves is that they exist and are proportionate, which this section states.

#### Rapid response and the war room

#### Rapid-response protocol and opposition handling

```lead
In Kitui County, ground rumors and hostile talking points travel primarily through two high-velocity vectors: **morning vernacular radio talk shows (06:00–09:00 EAT)** and **hyper-local ward WhatsApp groups**.
```

In a high-stakes gubernatorial campaign, unchecked misinformation and coordinated political attacks can erode voter trust within hours. In Kitui County, ground rumors and hostile talking points travel primarily through two high-velocity vectors: **morning vernacular radio talk shows (06:00–09:00 EAT)** and **hyper-local ward WhatsApp groups**.

The campaign enforces a disciplined **Rapid Response & Opposition Handling System**. This framework is governed by strict **Defamation Law Safeguards (Section A.1.1 [CHECK REF])**: all rebuttals focus exclusively on certified public records, legislative Hansard transcripts, and verifiable policy positions, completely eschewing personal invective or unsubstantiated allegations against political rivals.

```figure
id: rapid-response-flow
```

**Expect the scorecard's numbers.** The incumbent's *Delivering the Kitui Promise* scorecard is the main attack and defence document in this race. Its headline figures ({{scorecard.claimed}} projects, {{scorecard.boreholes.drilled}} boreholes, {{scorecard.roads.graded}} km of roads graded) will come up in debates and on air. The answers are prepared from its own itemised tables: {{scorecard.itemised}} projects worth KSh {{scorecard.itemised.ksh|bn}} billion, the itemised totals by constituency in Section 3.7, and the tracker's questions in Section 15.1.1. They are put as questions, never as accusations.

#### What we monitor, and how threats reach us

The campaign monitors four complementary intelligence streams 24 hours a day, 7 days a week:

```visual
kind: cards
items:
  - title: "Broadcast Vernacular Radio Triage (06:00–21:00 EAT)"
    body: "Dedicated audio recording monitors tracking morning and evening talk shows across *Musyi FM, Mbaitu FM, Sang'u FM, County FM*, and *Athiani FM*. Immediate audio clipping of candidate mentions or political challenger assertions. [CONFLICT C7: see open items]"
  - title: "Ward WhatsApp Ingestion Network"
    body: "40 Constituency Monitoring Assistants monitoring ~{{target.whatsapp-groups}} major community, market, church, and clan WhatsApp groups across all 8 sub-counties."
  - title: "Social Listening Keyword Feeds"
    body: "Automated continuous tracking via Brand24 / Talkwalker of high-frequency keywords: *\"Dr. Makali Mulu\"*, *\"Kitui Governor 2027\"*, *\"Kitui Central CDF\"*, *\"Ndengu price\"*, and competitor candidate handles."
  - title: "Field Captain Rumor Logs"
    body: "Twice-daily SMS pulse reports from the campaign's ward captains (campaign-owned, Section 13.3) logging prevalent market-day and baraza whispers."
```

#### War room operating model, shift coverage and dashboard view

The war room is the campaign's nerve centre for monitoring, response and
rapid decision-making.

During peak periods (January–August 2027), the war room operates on a three-shift rotation:

| Shift | Hours (EAT) | Focus |
|---|---|---|
| Morning | 06:00–14:00 | Scheduling, sentiment check, news and radio monitoring |
| Afternoon | 14:00–22:00 | Live coverage, engagement, rapid response |
| Night | 22:00–06:00 | Monitoring only; escalation to on-call strategist at crisis threshold |

The command console centralises real-time metrics: live sentiment score; trending hashtags; competitor activity alerts; misinformation tracking log; response status tracker; hourly engagement; and **SMS delivery and opt-out rates**.

## 20.3 Staying inside defamation law

All campaign communicators, surrogates, and media buyers are bound by the following **Three Defamation Safeguards**:

```visual
kind: cards
preset: rule
items:
  - title: "Rule 1: Focus on Public Audit Records, Never Private Character"
    body: "Communicators are legally prohibited from making allegations regarding rivals' private lives, family affairs, or unadjudicated criminal accusations. All comparative critiques must reference published statutory records (e.g., OAG reports, Ethics and Anti-Corruption Commission filings, Controller of Budget reports)."
  - title: "Rule 2: Accurate Linguistic Attribution"
    body: "When quoting rivals on Kikamba radio or social media, communicators must possess the original, unedited audio recording or verbatim Hansard/media link. Edited audio clips (*deepfakes or out-of-context splicing*) are strictly banned."
  - title: "Rule 3: Automatic Legal Pre-Clearance for Comparative Media"
    body: "Any advertising spot, leaflet, or press release naming an opposing candidate must receive written legal pre-clearance from the Campaign Legal Counsel prior to broadcast or circulation."
```

## 20.4 Manipulated media and cyber security

#### Manipulated media and cybersecurity

#### The deepfake and manipulated media protocol

```lead
AI-generated video of serving Kenyan public figures has already circulated widely.
```

*The threat that most warrants specific preparation.*

**Context.** AI-generated video of serving Kenyan public figures has already
circulated widely. Kenya's National Intelligence Service leadership has publicly
warned that domestic and foreign actors are weaponising social media and AI. A
UN scientific panel reported in July 2026 that AI-generated content can now be
produced instantly, personalised and continuously adapted, outpacing
fact-checking.

<!-- keep -->
**The two-sided risk.** The obvious risk is a fabricated clip of Dr. Mulu. The
subtler and more dangerous risk is the **liar's dividend**: once voters know
convincing fakes exist, genuine footage can be dismissed as fabricated, and
public trust in all evidence degrades. A campaign that cries "deepfake"
carelessly damages its own ability to be believed when it matters.

```visual
kind: checklist
title: "Prevention — provenance by default"
items:
  - label: "All official video and audio published from verified campaign channels first, with a consistent visual identity"
  - label: "**Original files retained with timestamps and device metadata**, so authenticity can be evidenced rather than asserted"
  - label: "Public education content, in all three languages, teaching supporters how to verify whether a clip came from an official channel — this doubles as civic-education content consistent with the campaign's brand"
  - label: "A single canonical location where every genuine speech and clip is listed"
```

```visual
kind: checklist
title: "Detection"
items:
  - label: "Monitoring for candidate-name mentions attached to video and audio across platforms and, critically, in WhatsApp groups where ward champions can report what monitoring tools cannot see"
  - label: "Ward champions briefed to report suspicious media immediately through a dedicated channel — **the human network is the primary detection layer** for private-group circulation"
  - label: "Detection tooling at premium tier, selected at contracting from a shortlist tested against a sample of real Kikamba and Kiswahili media: Deeptrack (Nairobi), Phan0s by CADMUS Cyber Solutions (built to the Data Protection Act 2019) and Sumsub's deepfake detector for Africa."
```

```visual
kind: timeline
title: "Rapid rebuttal — Level 3, 30-minute clock"
items:
  - when: "0–5"
    label: "Ward champion or monitoring flags; crisis lead confirms receipt"
  - when: "5–15"
    label: "Verify against the campaign's own archive: was Dr. Mulu there, on that date, saying that? Retrieve original footage if it exists"
  - when: "15–20"
    label: "Candidate and senior leadership briefed; response approved"
  - when: "20–30"
    label: "Publish: plain statement of falsity, the verified original where one exists, and provenance evidence."
    body: "Simultaneously in Kikamba, Kiswahili and English, across all channels **except bulk SMS, which the 48-hour lodging rule rules out of rapid response entirely** (Section 15.3.3)"
  - when: "30–120"
    label: "Platform reports filed; journalists briefed directly (Section 15.2.2); ward champions supplied with a forwarding-friendly correction card for WhatsApp"
  - when: "Same day"
    label: "Legal options reviewed with counsel"
```

**The SMS component is what makes this work in Kitui.** A rebuttal published
only online cannot reach a fabrication that is spreading by WhatsApp forward
into offline social networks. The correction must travel the same route as the
lie.

<!-- keep -->
**Standing rule:** the campaign never claims genuine material is fabricated.
This is stated in the charter, rehearsed in drills, and is the reason the
campaign's own deepfake denials will be believed.

## 20.5 Monitoring competitors: public sources only

#### Competitor monitoring

*Analysis of the rivals themselves is in 5.5; the tools and outputs are in Annex F.4 and F.11.*

#### Public sources only, and the line we do not cross

Systematic, lawful, public-source tracking of rivals' digital activity to
anticipate attacks, identify messaging vulnerabilities and find openings.

**Boundary.** Public sources only: published ad libraries, public posts, public
statements, public records. **No hacking, no impersonation,
no infiltration of private groups, no purchase of private data, and no
research into rivals' families or private lives.** Opposition research means
knowing what opponents say publicly, not surveilling them.
