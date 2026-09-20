
What can go wrong and what happens when it does: rapid response, the war room that runs it, the cybersecurity and manipulated-media protocols, competitor monitoring from public sources, and the statutory ground all of it stands on.

## 13.0 The risk register

Six risks decide whether this plan survives contact. Everything after this section is how each
is handled; Annex E carries the runbooks.

| # | Risk | Likelihood | Impact | Owner | Mitigation |
|---|---|---|---|---|---|
| R1 | **The nomination is decided by delegates, not an opinion poll.** The poll mechanism is Tier 3 and unconfirmed | Medium | Severe — the targeting model changes wholesale | Firefly Director + campaign | Section 3.1.6's delegate whip contingency; Section 3.1.2 states the verification test that would close this |
| R2 | **The recognition hypothesis is wrong.** The deficit may be about perceived distance, not unfamiliarity | Medium | Severe — the Phase −1 channel mix is built on it | Head of Research | Tested in Week 1 by the baseline instrument and message lab, **before anything is committed against it** (Section 1A.4) |
| R3 | **The data-protection reviewer is not appointed in time.** The long-lead campaign appointment | Medium | High — gates the voter-file work in Section 8.13 and the mass SMS layer | Campaign | Section 12.5.5's compliance gate; named as dependency 4 in Section 15.1 |
| R4 | **ODPC guidance prohibits the planned SMS approach.** The political-campaigning circular could not be retrieved | Low | High — Workstream 9 is the layer the race turns on | Campaign Legal Director | Section 15.2's three mandatory actions, before Phase −1 broadcasting |
| R5 | **A manipulated-media attack lands inside the nomination window** | Medium | High — a compressed window leaves no time to recover | Digital Director | Section 13.3.5's protocol; hardware-key 2FA from day one (Section 9.1.1) |
| R6 | **Firefly's brief and the team's judgement disagree.** The direction model puts an outside brief in front of people who know the ground better | High — it will happen, and should | Moderate if handled, severe if suppressed | Firefly Director + team lead | The brief states intent and the rule, never the caption. Where the team overrides, they log why in the calendar, and the monthly review reads the overrides as data rather than as non-compliance |

**R1 and R2 are the two that change the plan rather than damage it**, and both are resolved by
measurement rather than by contingency: one by obtaining the pollster's terms of reference, the
other by the Week 1 presence audit. Both resolve inside the first weeks, which is the argument for
starting there.

**R6 is the risk specific to this engagement's shape.** A direction model with no disagreement
protocol fails on its first collision — and it fails quietly, because a team that is overruled once
stops raising the objection rather than stopping the behaviour. The override log exists so that
friction surfaces as evidence instead of as attrition.

---

> **The runbooks are in Annex E.** The four-tier response decision tree (13.1.2), the response
> times by channel (13.1.3), the pre-drafted holding positions (13.1.4), the monitoring tooling
> (13.2.2, 13.4.2), the pre-approved message library (13.2.3), the red-team drill format
> (13.2.4), the threat model and security baseline (13.3.1–13.3.4) and the competitive
> intelligence outputs (13.4.3) are set out there in full. They are operational detail: what a
> principal approves is that they exist and are proportionate, which this section states.

## 13.1 Rapid-response protocol and opposition handling

In a high-stakes gubernatorial campaign, unchecked misinformation and coordinated political attacks can erode voter trust within hours. In Kitui County, ground rumors and hostile talking points travel primarily through two high-velocity vectors: **morning vernacular radio talk shows (06:00–09:00 EAT)** and **hyper-local ward WhatsApp groups**.

The campaign enforces a disciplined **Rapid Response & Opposition Handling System**. This framework is governed by strict **Defamation Law Safeguards (Section 3.2.1)**: all rebuttals focus exclusively on certified public records, legislative Hansard transcripts, and verifiable policy positions, completely eschewing personal invective or unsubstantiated allegations against political rivals.

```figure
id: rapid-response-flow
```

### 13.1.1 What we monitor, and how threats reach us

The campaign monitors four complementary intelligence streams 24 hours a day, 7 days a week:

1.  **Broadcast Vernacular Radio Triage (06:00–21:00 EAT):** Dedicated audio recording monitors tracking morning and evening talk shows across *Musyi FM, Mbaitu FM, Sang'u FM, County FM*, and *Athiani FM*. Immediate audio clipping of candidate mentions or political challenger assertions.
2.  **Ward WhatsApp Ingestion Network:** 40 Constituency Monitoring Assistants monitoring ~180 major community, market, church, and clan WhatsApp groups across all 8 sub-counties.
3.  **Social Listening Keyword Feeds:** Automated continuous tracking via Brand24 / Talkwalker of high-frequency keywords: *"Dr. Makali Mulu"*, *"Kitui Governor 2027"*, *"Kitui Central CDF"*, *"Ndengu price"*, and competitor candidate handles.
4.  **Field Captain Rumor Logs:** Twice-daily SMS pulse reports from the 400 Ward Captains logging prevalent market-day and baraza whispers.

### 13.1.5 Staying inside defamation law

All campaign communicators, surrogates, and media buyers are strictly bound by the following **Three Defamation Safeguards**:

1.  **Rule 1: Focus on Public Audit Records, Never Private Character:** Communicators are legally prohibited from making allegations regarding rivals' private lives, family affairs, or unadjudicated criminal accusations. All comparative critiques must strictly reference published statutory records (e.g., OAG reports, Ethics and Anti-Corruption Commission filings, Controller of Budget reports).
2.  **Rule 2: Accurate Linguistic Attribution:** When quoting rivals on Kikamba radio or social media, communicators must possess the original, unedited audio recording or verbatim Hansard/media link. Edited audio clips (*deepfakes or out-of-context splicing*) are strictly banned.
3.  **Rule 3: Automatic Legal Pre-Clearance for Comparative Media:** Any advertising spot, leaflet, or press release naming an opposing candidate must receive written legal pre-clearance from the Campaign Legal Counsel prior to broadcast or circulation.


---

## 13.2 The digital war room

### 13.2.1 War room operating model, shift coverage and dashboard view

The war room is the campaign's nerve centre for monitoring, response and
rapid decision-making.

During peak periods (January–August 2027), the war room operates on a three-shift rotation:
| Shift | Hours (EAT) | Focus |
|---|---|---|
| Morning | 06:00–14:00 | Scheduling, sentiment check, news and radio monitoring |
| Afternoon | 14:00–22:00 | Live coverage, engagement, rapid response |
| Night | 22:00–06:00 | Monitoring only; escalation to on-call strategist at crisis threshold |

The command console centralises real-time metrics: live sentiment score; trending hashtags; competitor activity alerts; misinformation tracking log; response status tracker; hourly engagement; **SMS delivery and opt-out rates**; and **spend against the agreed envelope**.

## 13.3 Cybersecurity and manipulated media

### 13.3.5 The deepfake and manipulated media protocol

*The threat that most warrants specific preparation.*

**Context.** AI-generated video of serving Kenyan public figures has already
circulated widely. Kenya's National Intelligence Service leadership has publicly
warned that domestic and foreign actors are weaponising social media and AI. A
UN scientific panel reported in July 2026 that AI-generated content can now be
produced instantly, personalised and continuously adapted, outpacing
fact-checking.

**The two-sided risk.** The obvious risk is a fabricated clip of Dr. Mulu. The
subtler and more dangerous risk is the **liar's dividend**: once voters know
convincing fakes exist, genuine footage can be dismissed as fabricated, and
public trust in all evidence degrades. A campaign that cries "deepfake"
carelessly damages its own ability to be believed when it matters.

**Prevention — provenance by default:**
* All official video and audio published from verified campaign channels first,
with a consistent visual identity
* **Original files retained with timestamps and device metadata**, so
authenticity can be evidenced rather than asserted
* Public education content, in all three languages, teaching supporters how to
verify whether a clip came from an official channel — this doubles as
civic-education content consistent with the campaign's brand
* A single canonical location where every genuine speech and clip is listed

**Detection:**
* Monitoring for candidate-name mentions attached to video and audio across
platforms and, critically, in WhatsApp groups where ward champions can report
what monitoring tools cannot see
* Ward champions briefed to report suspicious media immediately through a
dedicated channel — **the human network is the primary detection layer** for
private-group circulation
* Detection tooling at premium tier `[Insert vendor — selected at contracting]`

**Rapid rebuttal — Level 3, 30-minute clock:**
| Minute | Action |
|---|---|
| 0–5 | Ward champion or monitoring flags; crisis lead confirms receipt |
| 5–15 | Verify against the campaign's own archive: was Dr. Mulu there, on that date, saying that? Retrieve original footage if it exists |
| 15–20 | Candidate and senior leadership briefed; response approved |
| 20–30 | Publish: plain statement of falsity, the verified original where one exists, and provenance evidence. Simultaneously in Kikamba, Kiswahili and English, across all channels **except bulk SMS, which the 48-hour lodging rule rules out of rapid response entirely** (Section 8.10.2) |
| 30–120 | Platform reports filed; journalists briefed directly (Section 8.7); ward champions supplied with a forwarding-friendly correction card for WhatsApp |
| Same day | Legal options reviewed with counsel |

**The SMS component is what makes this work in Kitui.** A rebuttal published
only online cannot reach a fabrication that is spreading by WhatsApp forward
into offline social networks. The correction must travel the same route as the
lie.

**Standing rule:** the campaign never claims genuine material is fabricated.
This is stated in the charter, rehearsed in drills, and is the reason the
campaign's own deepfake denials will be believed.

---

## 13.4 Competitor monitoring

### 13.4.1 Public sources only, and the line we do not cross

Systematic, lawful, public-source tracking of rivals' digital activity to
anticipate attacks, identify messaging vulnerabilities and find openings.

**Boundary.** Public sources only: published ad libraries, public posts, public
statements, published polling, public records. **No hacking, no impersonation,
no infiltration of private groups, no purchase of private data, and no
research into rivals' families or private lives.** Opposition research means
knowing what opponents say publicly, not surveilling them.

### 13.4.4 Reading the current field

The August 2026 published survey shows Dr. Kasalu's strength built on
countywide grassroots touring under a branded programme. The strategic
implication is not to replicate her method — the campaign cannot out-tour a
Woman Representative in the time available — but to **compete on a dimension
she is not occupying**: verifiable fiscal and delivery competence, distributed
by channels that reach where touring has not yet reached. Her documented
critique of the incumbent's equal-ward allocation model also opens a technical
policy debate Dr. Mulu is better equipped to win than any candidate in the
field.

---

## 13.5 Statutory and regulatory compliance

This compliance pack consolidates all statutory, constitutional, and regulatory requirements governing Dr. Makali Mulu’s 2027 Kitui County gubernatorial campaign. Operating with strict legal adherence is both an ethical mandate and an essential defense against administrative disqualification or election petition exposure.

```figure
id: compliance-architecture
```

### 13.5.1 The IEBC nomination and clearance checklist

```figure
id: iebc-clearance
```

### 13.5.2 Data protection and election offences liability

```figure
id: liability-matrix
```
