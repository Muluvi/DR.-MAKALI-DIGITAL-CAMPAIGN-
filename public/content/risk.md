
What can go wrong and what happens when it does: rapid response, the war room that runs it, the cybersecurity and manipulated-media protocols, competitor monitoring from public sources, and the statutory ground all of it stands on.

## 13.0 The risk register

Five risks decide whether this plan survives contact. Everything after this section is how each
is handled; Annex E carries the runbooks.

| # | Risk | Likelihood | Impact | Owner | Mitigation |
|---|---|---|---|---|---|
| R1 | **The nomination is decided by delegates, not an opinion poll.** The poll mechanism is Tier 3 and unconfirmed | Medium | Severe — the targeting model changes wholesale | Firefly Director + campaign | Section 3.1.6's delegate whip contingency; Section 3.1.2 states the verification test that would close this |
| R2 | **The recognition hypothesis is wrong.** The deficit may be about perceived distance, not unfamiliarity | Medium | Severe — the Phase −1 channel mix is built on it | Head of Research | Tested in Week 1 by the baseline instrument and message lab, **before significant spend** (Section 9.1.1) |
| R3 | **The data-protection reviewer is not appointed in time.** The long-lead campaign appointment | Medium | High — gates the voter-file work in Section 8.13 and the mass SMS layer | Campaign | Section 12.5.5's compliance gate; named as dependency 4 in Section 15.1 |
| R4 | **ODPC guidance prohibits the planned SMS approach.** The political-campaigning circular could not be retrieved | Low | High — Workstream 9 is the layer the race turns on | Campaign Legal Director | Section 15.2's three mandatory actions, before Phase −1 broadcasting |
| R5 | **A manipulated-media attack lands inside the nomination window** | Medium | High — a compressed window leaves no time to recover | Digital Director | Section 13.3.5's protocol; hardware-key 2FA from day one (Section 9.1.1) |

**R1 and R2 are the two that change the plan rather than damage it**, and both are resolved by
measurement rather than by contingency: one by obtaining the pollster's terms of reference, the
other by the Week 1 test. Both resolve inside Phase −1, which is the argument for starting it.

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

```
════════════════════════════════════════════════════════════════════════════════════
                  RAPID RESPONSE DECISION & ESCALATION FLOW
════════════════════════════════════════════════════════════════════════════════════

   MONITORING FEEDS                                                RESPONSE CHANNELS
 ┌──────────────────┐                                             ┌─────────────────┐
 │• Morning Radio   │                                             │• Radio Live Call│
 │• WhatsApp Groups │                                             │• Ward SMS Alert │
 │• Social Listening│ ──► ┌─────────────────────────────────┐ ──► │• WhatsApp Audio │
 │• 400 Ward Capts  │    │     RESPONSE DECISION TREE       │     │• Fact-Check Card│
 └──────────────────┘    │ (Reach, Source, Virality Check)  │     └─────────────────┘
                         └─────────────────────────────────┘               ▲
                                          │                                │
                                          ▼                                │
                         ┌──────────────────────────────────┐              │
                         │   LEGAL / DEFAMATION GATEWAY     │ ─────────────┘
                         │ (OAG, Hansard, KNBS Verification)│
                         └──────────────────────────────────┘
════════════════════════════════════════════════════════════════════════════════════
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
| 20–30 | Publish: plain statement of falsity, the verified original where one exists, and provenance evidence. Simultaneously in Kikamba, Kiswahili and English, across all channels **including SMS to the affected wards** |
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

```
════════════════════════════════════════════════════════════════════════════════════
                        STATUTORY COMPLIANCE ARCHITECTURE
════════════════════════════════════════════════════════════════════════════════════

   1. IEBC NOMINATION & STATUTORY CLEARANCE REQUIREMENTS
   • University Degree Recognition & Commission for University Education (CUE) Clearance
   • EACC Chapter Six Integrity Clearance Self-Declaration
   • Kenya Revenue Authority (KRA) Tax Compliance Certificate
   • Directorate of Criminal Investigations (DCI) Police Clearance Certificate
   • Higher Education Loans Board (HELB) Clearance Certificate
   • 500 Registered Voter Nomination Endorsement Signatures per Sub-County
                                      │
                                      ▼
   2. DATA PROTECTION ACT (DPA 2019) & TELCO PRIVACY COMPLIANCE
   • Lawful Basis: Explicit Opt-In Consent for 2G SMS & USSD Registry
   • Certificate of Registration with the Office of the Data Protection Commissioner (ODPC)
   • 100% On-Premise Encrypted Storage (AES-256) within Kenyan Borders
   • Direct "STOP" Opt-Out Mechanism via Africa's Talking API
                                      │
                                      ▼
   3. ELECTION OFFENCES ACT (EOA 2016) DEFENSE & LIABILITY MATRIX
   • Prohibition of Bribery, Treating & Undue Influence
   • Defamation & Hate Speech Quarantine (NCIC / Penal Code Compliance)
   • Strict Campaign Ad Blackout Window (48 Hours Prior to Polling Station Opening)
════════════════════════════════════════════════════════════════════════════════════
```

### 13.5.1 The IEBC nomination and clearance checklist

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

### 13.5.2 Data protection and election offences liability

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
