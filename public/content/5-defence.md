Rapid response, the war room that runs it, the cybersecurity and manipulated-media protocols behind it, and how rivals are monitored from public sources.

## 5.1 Rapid response and the war room

In a high-stakes gubernatorial campaign, unchecked misinformation and coordinated political attacks can erode voter trust within hours. In Kitui County, ground rumors and hostile talking points travel primarily through two high-velocity vectors: **morning vernacular radio talk shows (06:00–09:00 EAT)** and **hyper-local ward WhatsApp groups**.

The campaign enforces a disciplined **Rapid Response & Opposition Handling System**. This framework is governed by strict **Defamation Law Safeguards (Section 5.1.5)**: all rebuttals focus exclusively on certified public records, legislative Hansard transcripts, and verifiable policy positions, completely eschewing personal invective or unsubstantiated allegations against political rivals.

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

### 5.1.1 What we monitor, and with what

The campaign runs a single sensing operation. It serves two purposes — detecting
threats and tracking rivals — and the table below is deliberately one table,
because most of the same instruments serve both. The *Serves* column records
which of the campaign's two monitoring briefs each tool answers to.

#### The four intelligence streams

The campaign monitors four complementary intelligence streams 24 hours a day, 7 days a week:

1.  **Broadcast Vernacular Radio Triage (06:00–21:00 EAT):** Dedicated audio recording monitors tracking morning and evening talk shows across *Musyi FM, Mbaitu FM, Sang'u FM, County FM*, and *Athiani FM*. Immediate audio clipping of candidate mentions or political challenger assertions.
2.  **Ward WhatsApp Ingestion Network:** 40 Constituency Monitoring Assistants monitoring ~180 major community, market, church, and clan WhatsApp groups across all 8 sub-counties.
3.  **Social Listening Keyword Feeds:** Automated continuous tracking via Brand24 / Talkwalker of high-frequency keywords: *"Dr. Makali Mulu"*, *"Kitui Governor 2027"*, *"Kitui Central CDF"*, *"Ndengu price"*, and competitor candidate handles.
4.  **Field Captain Rumor Logs:** Twice-daily SMS pulse reports from the 400 Village Ward Captains logging prevalent market-day and baraza whispers.

#### The monitoring stack

| Tool | What it watches | Serves |
|---|---|---|
| Social monitoring dashboards | Real-time X and cross-platform keyword, hashtag and competitor tracking | Threats + rivals |
| Social listening and sentiment (premium tier) | Cross-platform sentiment analysis; mentions, supporter sentiment, emerging narratives | Threats + rivals |
| Meta Business Suite | Facebook and Instagram monitoring; competitor content | Threats + rivals |
| Google Alerts | "Makali Mulu," "Kitui Governor 2027," rival names | Threats |
| **Meta Ad Library** | Competitor ad spend, creative and creative themes, targeting estimates, frequency | Rivals |
| **Google Ads Transparency Centre** | Competitor search advertising and keywords | Rivals |
| **X lists** | Curated rival, surrogate and influencer accounts | Rivals |
| Custom BI dashboard | Centralised real-time metrics | Threats |
| **Radio monitoring** | Kamba-language station tracking, coverage and airtime share (Section 3.4) — critical, as most attacks on Dr. Mulu will originate on air, not online | Threats + rivals |
| **Published polling tracker** | Mizani Africa and other published surveys, logged with dates and methodology notes | Rivals |

---

### 5.1.2 How severe is it, and who authorises the response

Two severity scales are in force in this proposal and they do not agree. Both
are reproduced here, unaltered, so the campaign can choose between them rather
than discover the conflict during an incident.

`[Confirm which severity scale governs rapid response. The decision tree below defines four tiers in which Level 1 receives no public response and Level 3 carries a <15-minute clock. The authority matrix beneath it defines three levels in which Level 1 carries a <=4-hour clock and Level 3 <=30 minutes. Section 5.1.7's red-team drills and Section 9.3.4 both name the three-level matrix as governing, and Section 7.2.6's approval table uses it; the four-tier tree is the only place the fourth tier and the ignore-and-log posture appear. Neither has been changed here.]`

#### The response decision tree — four tiers

To avoid elevating fringe attacks or wasting campaign capital, the campaign evaluates every incident against a standardized **Response Decision Tree**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   RAPID RESPONSE DECISION MATRIX                                            │
├────────────┬─────────────────────────────┬─────────────────────────────────┬────────────────────────────────┤
│ Threat     │ Threat Definition & Impact  │ Strategic Response Protocol     │ Turnaround Time Target         │
│ Severity   │ Threshold                   │                                 │ (SLA)                          │
├────────────┼─────────────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ LEVEL 1:   │ • Isolated comment or post  │ • **IGNORE / PASSIVE MONITOR**  │ • No public response.          │
│ NEGLIGIBLE │   with <50 views.           │ • Log into intelligence feed;   │ • Continued observation for    │
│            │ • Fringe blog / anonymous.  │   do NOT amplify or refute.     │   velocity changes.            │
├────────────┼─────────────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ LEVEL 2:   │ • Rumor active in 3+ Ward   │ • **CONTAIN AT WARD LEVEL**     │ • **< 30 Minutes:**            │
│ MODERATE   │   WhatsApp groups or one    │ • Deploy 45s WhatsApp Kikamba   │   Deploy audio voice note to   │
│            │   market center baraza.     │   voice note & fact-check card. │   affected Ward groups.        │
├────────────┼─────────────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ LEVEL 3:   │ • Morning vernacular radio  │ • **HIGH-VELOCITY REBUTTAL**    │ • **< 15 Minutes:** Call-in    │
│ HIGH       │   on-air mention; prominent │ • Authorize live studio call-in │ • **< 45 Minutes:** Fact-check │
│            │   rival press conference.   │   or release signed media card. │   infographic on social media. │
├────────────┼─────────────────────────────┼─────────────────────────────────┼────────────────────────────────┤
│ LEVEL 4:   │ • Coordinated county-wide   │ • **EXECUTIVE CRISIS COUNTER**  │ • **< 15 Minutes:** War Room   │
│ CRITICAL   │   smear; national TV story; │ • Candidate live broadcast or   │ • **< 1 Hour:** Official Press │
│            │   legal/regulatory threat.  │   Constituency Lead joint press.│ • **< 2 Hours:** 2G Ward SMS.  │
└────────────┴─────────────────────────────┴─────────────────────────────────┴────────────────────────────────┘
```

#### Response authority and approval — three levels

| Severity | Definition | Response time | Approval |
|---|---|---|---|
| **Level 1** | Minor negative comment or isolated misinformation | ≤ 4 hours | Digital Director |
| **Level 2** | Coordinated attack; viral misinformation (>10,000 views) | ≤ 2 hours | Campaign Communications Director |
| **Level 3** | Major crisis — false allegation, **manipulated or AI-generated media**, legal threat | ≤ 30 minutes | **Candidate + senior leadership** |

---

### 5.1.3 Response times, by channel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RAPID RESPONSE SLA BY CHANNEL                            │
├────────────────────────────────┬────────────────────────────────────────────┤
│ Channel & Platform             │ Mandatory Response Time Target             │
├────────────────────────────────┼────────────────────────────────────────────┤
│ 1. Live Vernacular Radio       │ • **< 15 Minutes:** Studio call-in by      │
│    (Musyi, Mbaitu, Sang'u)     │   authorized Campaign Spokesperson / Lead. │
├────────────────────────────────┼────────────────────────────────────────────┤
│ 2. WhatsApp Community Groups   │ • **< 30 Minutes:** Dispatch of 45s        │
│    (40-Ward Network)           │   debunking Kikamba audio clip by Ward Cap.│
├────────────────────────────────┼────────────────────────────────────────────┤
│ 3. Digital Platforms (X, Meta) │ • **< 45 Minutes:** Verified evidence card │
│                                │   with primary document citation.          │
├────────────────────────────────┼────────────────────────────────────────────┤
│ 4. Direct 2G Bulk SMS Push     │ • **< 2 Hours:** Corrective 160-char SMS to│
│    (Targeted Wards Only)       │   registered voters in affected sub-county.│
├────────────────────────────────┼────────────────────────────────────────────┤
│ 5. Printed Baraza Fact Sheets  │ • **< 24 Hours:** Overnight print & courier│
│                                │   to market center distribution champions. │
└────────────────────────────────┴────────────────────────────────────────────┘
```

---

### 5.1.4 The pre-drafted message library

Two libraries are maintained against the same incidents: long-form holding
positions with their evidential citations and Kikamba framing, and the short
pre-approved assets that go out while a holding position is being cleared.

#### Pre-drafted holding positions and evidence citations

The campaign maintains ready-to-deploy holding positions, evidential citations, and Kikamba framing for the four primary lines of attack:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     PRE-DRAFTED HOLDING POSITIONS & EVIDENCE CITATIONS                                      │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. THE "TERM-LIMIT / CAREER POLITICIAN" QUESTION                                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ • Attack Line:     "He has been in Parliament for three terms (15 years); it is time for new blood."        │
│ • Holding Message: "Service is measured by verifiable results and integrity, not turnover. Dr. Makali Mulu │
│                     used his 13 years in Parliament to build the top-ranked CDF infrastructure in Kenya,     │
│                     serve as Ranking Member on Finance, and maintain a spotless anti-corruption record."    │
│ • Kikamba Framing: "Kũthũkũma nĩ wĩtĩkĩlo na wathi mũseo. Nĩ mũthũkũmi mũmanya meko, ũte na kambĩ sya kũya │
│                     mbesa sya mwananchi."                                                                   │
│ • Primary Source:  National Assembly Hansard; Kitui Central NG-CDF Project Inventory (84 solar boreholes,    │
│                     140+ classrooms, 18,000+ secondary/tertiary bursaries).                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. THE "NORTHERN & SOUTHERN RECOGNITION DEFICIT" QUESTION                                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ • Attack Line:     "He is a Kitui Central leader who does not understand the challenges of Mwingi North,   │
│                     Mwingi Central, or Kitui South."                                                        │
│ • Holding Message: "Kitui's economic challenges—water scarcity, unpaved feeder roads, and broker cartels—do │
│                     not carry a sub-county boundary. As an economist, Dr. Mulu's 2027 Blueprint establishes │
│                     a statutory Ksh 100 Million/Ward Annual Equalization Fund ensuring every single ward in │
│                     Mwingi North and Kitui South receives guaranteed, direct capital investment."           │
│ • Kikamba Framing: "Mwanya wa maendeeo nĩ wa kĩla mũndũ. Mbesa sya Ward Fund syĩithiwa kwa kĩla kĩtheka     │
│                     kũtetheesya mĩsyĩ yonthe ya Kitui ta ĩmwe."                                             │
│ • Primary Source:  Kitui Economic Blueprint 2027–2032; Section 8.5 Ward Allocations Schedule.               │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. THE "REMOTE OPERATING MODEL / NAIROBI TECHNOCRAT" QUESTION                                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ • Attack Line:     "He is a bookish technocrat who spends his time in Nairobi committees rather than on the│
│                     ground with ordinary wananchi."                                                         │
│ • Holding Message: "Dr. Mulu's presence in Nairobi was spent on the floor of the National Assembly fighting │
│                     punitive taxes, defending devolved county revenue allocations, and bringing national    │
│                     treasury resources directly home to build schools and water pans across the county."    │
│ • Kikamba Framing: "Nĩwe wĩkalaa mbungene akĩsũngĩĩa mwananchi mbesa itie kũtelemw'a. Meko make me mĩũndanĩ."│
│ • Primary Source:  Commission on Revenue Allocation (CRA) County Allocation Defenses; Parliamentary Hansard│
│                     Division of Revenue Bills 2017–2024.                                                    │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. THE "COUNTY GOVERNMENT DEBT & PENDING BILLS COLLAPSE" COMPARISON                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ • Attack Line:     "All politicians make promises, but once in office, public funds disappear."            │
│ • Holding Message: "Look at the record, not the rhetoric. In 13 years managing public funds in Kitui        │
│                     Central, Dr. Makali Mulu achieved 13 consecutive unqualified clean audit certificates   │
│                     from the Auditor-General. By contrast, Kitui County executive accounts accumulated over │
│                     Ksh 2.4 Billion in pending bills and audit queries under previous administrations."     │
│ • Kikamba Framing: "Tala meko, ndũkatale ndeto. Kĩtĩo kya Kũthũkũma nĩ kĩũ kĩtheu kĩte na ũkĩlyo wa ũkũli." │
│ • Primary Source:  Office of the Auditor-General (OAG) Certified Audit Reports 2013–2025; OAG County         │
│                     Executive Audit Reports FY 2021/22 and FY 2022/23.                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### The pre-approved message library

Maintained for rapid response without waiting on approvals:
* Standard rebuttals for false claims about Dr. Mulu's record
* Kikamba, Kiswahili and English versions of key messages
* Template statements for policy positions issued in response to attack
* Fact-check cards linking to verified sources
* **Deepfake first-response templates** (Section 5.2.4)

---

### 5.1.5 Staying inside defamation law

All campaign communicators, surrogates, and media buyers are strictly bound by the following **Three Defamation Safeguards**:

1.  **Rule 1: Focus on Public Audit Records, Never Private Character:** Communicators are legally prohibited from making allegations regarding rivals' private lives, family affairs, or unadjudicated criminal accusations. All comparative critiques must strictly reference published statutory records (e.g., OAG reports, Ethics and Anti-Corruption Commission filings, Controller of Budget reports).
2.  **Rule 2: Accurate Linguistic Attribution:** When quoting rivals on Kikamba radio or social media, communicators must possess the original, unedited audio recording or verbatim Hansard/media link. Edited audio clips (*deepfakes or out-of-context splicing*) are strictly banned.
3.  **Rule 3: Automatic Legal Pre-Clearance for Comparative Media:** Any advertising spot, leaflet, or press release naming an opposing candidate must receive written legal pre-clearance from the Campaign Legal Counsel prior to broadcast or circulation.

```
════════════════════════════════════════════════════════════════════════════════════
                        SECTION 15 STRATEGIC TAKEAWAY
════════════════════════════════════════════════════════════════════════════════════
 • 4-Tier Decision Matrix:      Prevents elevating fringe attacks while ensuring 
                                <15 min radio rebuttals and <30 min WhatsApp containment.
 • Pre-Drafted Holding Vault:   Full evidential counter-scripts ready for term-limit,
                                regional familiarity, technocrat, and fiscal attacks.
 • Strict Defamation Law Gate:  Focuses 100% on certified Auditor-General/CRA records;
                                prohibits private character attacks and unverified claims.
════════════════════════════════════════════════════════════
```

---

### 5.1.6 War-room shifts and the dashboard

The remote war room is the campaign's nerve centre for monitoring, response and
rapid decision-making.

#### The shift schedule

During peak periods (January–August 2027):
| Shift | Hours (EAT) | Focus |
|---|---|---|
| Morning | 06:00–14:00 | Scheduling, sentiment check, news and radio monitoring |
| Afternoon | 14:00–22:00 | Live coverage, engagement, rapid response |
| Night | 22:00–06:00 | Monitoring only; escalation to on-call strategist at crisis threshold |

#### The dashboard view

Live sentiment score; trending hashtags; competitor activity alerts;
misinformation tracking log; response status tracker; hourly engagement;
**SMS delivery and opt-out rates**; **spend against ceiling**.

---

### 5.1.7 Red-team drills

*New. Reactive protocols fail because they are first used under real pressure.*

**Cadence:** quarterly at standard tier, monthly at premium, with a mandatory
full-scale drill immediately before the nomination decision and again 60 days
before the general election.

**Method:** a small red-team panel — Firefly's crisis lead, one campaign
representative, and an external participant with no stake in the outcome — is
briefed to attack. The response team is **not** told which scenario is coming
or when. The drill runs in real time against the Section 5.1.2 clock.

**Standing scenario library:**
| # | Scenario | Tests |
|---|---|---|
| 1 | Fabricated audio of Dr. Mulu making an inflammatory statement, seeded on WhatsApp | Deepfake protocol; 30-minute Level 3 clock |
| 2 | Coordinated hashtag attack on his NG-CDF record | Fact-base readiness; rebuttal library |
| 3 | Claim that the campaign sent unsolicited SMS | Consent audit trail retrieval (Section 6.5.4) |
| 4 | Hostile radio segment on a station associated with a rival | Radio response pathway (Section 3.4) |
| 5 | Ward champion's account compromised; false messages sent to a ward group | Incident response (Section 5.2.3) |
| 6 | Allegation of exceeding the IEBC spending ceiling | Ledger reconciliation retrieval (Section 9.2.4) |
| 7 | Manufactured "grassroots" campaign attacking a rival, falsely attributed to Dr. Mulu | Charter defence; provenance evidence |

**Output:** every drill produces a written report — actual response times
against target, decision bottlenecks, gaps in the message library — and the
escalation matrix is revised. Drill reports are retained; a campaign that can
demonstrate it rehearsed is a campaign that can respond credibly when it
matters.

**KPI:** by Phase 2, **90% of drill responses meet their severity-level time
target**.

---

## 5.2 Cybersecurity and manipulated media

### 5.2.1 The threat model

Kenyan campaigns face account takeover, phishing of staff and volunteers,
leaked internal material, and increasingly the fabrication of audio and video.
Kenya's Communications Authority attributed rising cyber threat volumes in part
to **inadequate system patching, insufficient phishing awareness, and the
growing use of AI tools by malicious actors**, issuing 21.8 million threat
advisories in a single quarter.

For this campaign specifically, the highest-consequence scenarios are:
1. Compromise of the candidate's own social accounts
2. A ward champion's WhatsApp account compromised and used to message a ward
3. Leaked internal strategy material — including, if mishandled, this document
4. Fabricated audio or video of the candidate

### 5.2.2 Account security baseline, and the human attack surface

| Control | Standard | Applies to |
|---|---|---|
| **Hardware security keys (FIDO2)** for two-factor authentication | **Mandatory** — SMS-based 2FA is not sufficient and is vulnerable to SIM-swap | Candidate, Digital Director, all admin-level accounts |
| App-based 2FA minimum | Where hardware keys are impractical | All staff and Tier 3–4 volunteers |
| Password manager | Unique generated credentials; no reuse | All staff |
| Role-based access | Least privilege; no shared logins ever | All platforms |
| Business Manager structure | Assets owned by the campaign entity, not individuals | All ad and page assets |
| Quarterly access review | Remove departed staff and volunteers within 24 hours of departure | Data-governance owner |
| Recovery contacts | Documented, verified, held by two named people | Candidate accounts |

**Hardware keys for the candidate and admins are non-negotiable and cost very
little.** `[Insert quoted cost — typically a modest per-key figure; two keys per critical account holder for redundancy]`

#### Phishing awareness

* Onboarding training for every staff member and Tier 3–4 volunteer before
account access is granted
* **Simulated phishing exercises quarterly**, with results used for coaching,
never for punishment — punitive programmes suppress reporting, which is the
opposite of the goal
* A no-blame reporting channel with a target of **under 15 minutes** from
suspicion to report
* Specific coverage of the patterns most likely here: fake platform security
alerts, fake IEBC or party communications, and fake media interview requests

---

### 5.2.3 The incident response plan

| Phase | Action | Owner | Target |
|---|---|---|---|
| **Detect** | Anomalous login, unexpected post, member report | Any team member | Immediate |
| **Contain** | Force password reset, revoke sessions and tokens, remove compromised access | Digital Director | ≤ 15 min |
| **Assess** | Determine what was accessed, posted or exfiltrated | Data-governance owner | ≤ 1 hour |
| **Communicate** | Notify leadership; if voter data is affected, assess notification obligations with counsel | Digital Director | ≤ 2 hours |
| **Correct** | Delete unauthorised content; issue public correction if it was seen | Crisis lead | ≤ 4 hours |
| **Review** | Written post-incident report; control revision | Data-governance owner | ≤ 7 days |

**Leaked material protocol.** If internal material surfaces publicly, the
campaign confirms or denies authenticity accurately and quickly. It does not
speculate about the source, and it does not deny the authenticity of genuine
material — a denial later disproved is worse than the original leak.

### 5.2.4 The deepfake and manipulated media protocol

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
* Detection tooling at premium tier `[Insert vendor and cost at contracting]`

**Rapid rebuttal — Level 3, 30-minute clock:**
| Minute | Action |
|---|---|
| 0–5 | Ward champion or monitoring flags; crisis lead confirms receipt |
| 5–15 | Verify against the campaign's own archive: was Dr. Mulu there, on that date, saying that? Retrieve original footage if it exists |
| 15–20 | Candidate and senior leadership briefed; response approved |
| 20–30 | Publish: plain statement of falsity, the verified original where one exists, and provenance evidence. Simultaneously in Kikamba, Kiswahili and English, across all channels **including SMS to the affected wards** |
| 30–120 | Platform reports filed; journalists briefed directly (Section 3.4); ward champions supplied with a forwarding-friendly correction card for WhatsApp |
| Same day | Legal options reviewed with counsel |

**The SMS component is what makes this work in Kitui.** A rebuttal published
only online cannot reach a fabrication that is spreading by WhatsApp forward
into offline social networks. The correction must travel the same route as the
lie.

**Standing rule:** the campaign never claims genuine material is fabricated.
This is stated in the charter, rehearsed in drills, and is the reason the
campaign's own deepfake denials will be believed.

## 5.3 Watching the other campaigns

### 5.3.1 Public sources only, and the line we do not cross

Systematic, lawful, public-source tracking of rivals' digital activity to
anticipate attacks, identify messaging vulnerabilities and find openings.

**Boundary.** Public sources only: published ad libraries, public posts, public
statements, published polling, public records. **No hacking, no impersonation,
no infiltration of private groups, no purchase of private data, and no
research into rivals' families or private lives.** Opposition research means
knowing what opponents say publicly, not surveilling them.

### 5.3.2 The monthly competitive brief, and real-time alerts

1. **Rival digital activity:** platforms, posting frequency, engagement rates,
follower growth
2. **Ad spend estimates:** from ad libraries and transparency data
3. **Messaging analysis:** themes, framing, target audiences
4. **Vulnerability assessment:** gaps, policy inconsistencies, negative
sentiment trends
5. **Polling movement:** changes in published surveys with sub-county detail
where available
6. **Recommendations:** counter-messaging and proactive content

**Between briefs.** New attacks or significant messaging shifts trigger real-time alerts to
campaign leadership with recommended responses drawn from the pre-approved
library.

---

### 5.3.3 Reading the current field

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
