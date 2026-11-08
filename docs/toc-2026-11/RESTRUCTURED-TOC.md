MODE A — REPOSITORY READ. Built from commit `b7bc346` (8 November 2026). Items tagged [UNVERIFIED] could not be read.

# Kitui 2027: the restructured table of contents

## 1. Mode and sources

**Mode A.** The repository was cloned and read at `b7bc346`. The live site was not opened, because its `robots` rule blocks automated reading. Nothing below confirms how a page looks today.

**Read directly**

| Surface | Files read | What was taken |
|---|---|---|
| (a) Chapters | All 28 files in `content/` | Path, every H2 and H3 (125 H2, 25 H3 = 150 headings), the H4s in `cover.md` and `ask.md`, every lead paragraph, word counts |
| (b) Reading order | `lib/heading-slug.ts` (`SECTIONS`, `PARTS`), `lib/flow.ts` (`FLOW_ORDER`, `FLOW_ACTS`), `lib/content-files.ts` | **Ground truth for the current sequence.** `FLOW_ORDER = SECTIONS.map(s => s.id)`, so the order in `SECTIONS` is the order rendered on both reading surfaces |
| (c) Published files | `public/content/` (28), `public/data/` (93 CSVs and `index.json`), `public/geo/`, `public/og/`, `public/portraits/` (10), `public/sw.js` | Counts, filenames, and a heading checksum against `content/` (identical for all 28) |
| (d) Platform and tools | All 21 `page.tsx` files under `app/`, `components/tools/ToolsHub.tsx`, `lib/platform/collections.ts`, `middleware.ts`, `app/robots.ts` | Routes, built and planned tools (33 slots, `BUILT` set of 7), 12 collections with their groups, the switched-off sign-in |
| Supporting checks | `docs/ownership-2026-11/HANDOFF.md`, `analysis/reports/findings.md`, `lib/data/figures.ts`, `CHANGE-LOG.md`, `components/flow/ChapterMarker.tsx`, `components/flow/ActMarker.tsx`, `components/MarkdownViewer.tsx`, `data/ward-register.json`, `data/analysis/projects-register.json` | Mismatch verdicts, heading levels as rendered, the 40-ward, 401-project and benchmark figures |
| Repository visibility | GitHub repository listing for this session | `visibility: public` |

**Taken from the purpose analysis:** the 45 numbered purposes, Group E (12 collections), Group F (8 tools), the audience table and the 8 named mismatches.

**Inferred:** the persuade/equip verdicts, the dependencies between chapters (from 476 counted cross-references and the leads), and the reading paths.

**Could not read:**
- the live rendered pages;
- whether `SITE_PASSCODE` is set in Vercel. If it is, the middleware passcode gate is on. [UNVERIFIED]
- the record of the decision to cut spending limits, beyond `CHANGE-LOG.md:203` ("The spend ceiling was excised at the campaign's instruction"). That line shows the cut happened. It does not show whether returning official per-ward limits in a tool was approved. [UNVERIFIED]

---

## 2. At a glance

**The case in brief**: who this is for, and the argument on one screen
- Who this is for
- The case on one screen

**Kitui today**: what is true about the county and its voters?
- The county in numbers
- What voters need
- How voters get news
- How Kitui voted

**The contest**: who is running, and where does Dr. Mulu stand?
- The race for 2027
- His record and reach
- The diagnosis

**The strategy**: what should the campaign do, and why?
- The goal
- The position
- The message
- The voters to win
- Channels and language

**The plan**: who does the work, in what order, and how?
- Who does what
- The timeline to August 2027
- The fourteen workstreams

**Proof and protection**: how would we know it worked, and stay safe?
- Measuring success
- Lawful and ethical
- Risks and response

**The decision**: what is Dr. Mulu being asked to decide?
- The platform in one view
- What you get and what you provide
- The ask

**The evidence behind it**: where does every figure come from, and on what terms?
- Evidence and sources
- Every ward in one table
- Fine print

**The working platform** (operations tier): where the team reads the data, keeps its records and plans the work
- Read the data · Follow the strategy · Working records · Planning tools · Operating references · Looking after the platform

---

## 3. The spine

Nine parts. Parts 1 to 7 are the argument. Part 8 is the evidence shelf, for readers who want to check it. Part 9 is the operations tier. Weights are shares of the 64,881 words of chapter prose; the split sections are counted where they now sit.

| # | Part | Question it answers | Chapters | Words | Share |
|---|---|---|---:|---:|---:|
| P1 | The case in brief | What is this, and why should I care? | 2 | 377 | 0.6% |
| P2 | Kitui today | What is true about Kitui? | 4 | 10,182 | 15.7% |
| P3 | The contest | What does that mean for him? | 3 | 5,213 | 8.0% |
| P4 | The strategy | What should the campaign do, and why? | 5 | 11,896 | 18.3% |
| P5 | The plan | Who does the work, in what order, and how? | 3 | 15,629 | 24.1% |
| P6 | Proof and protection | How would we know it worked, and stay safe? | 3 | 6,929 | 10.7% |
| P7 | The decision | What is he being asked to decide? | 3 | 2,925 | 4.5% |
| P8 | The evidence behind it | Where does each figure come from? | 3 | 7,079 | 10.9% |
| P9 | The working platform | Where does the team do the work? | 3 reference chapters + 6 groups | 4,651 | 7.2% |
| | **Total** | | **29 chapters** | **64,881** | **100.0%** |

Arithmetic: 377 + 10,182 + 5,213 + 11,896 + 15,629 + 6,929 + 2,925 + 7,079 + 4,651 = 64,881.

Funnel beats (architecture principle A): beat 1 = P1, beat 2 = P2, beat 3 = P3, beat 4 = P4 + P5, beat 5 = P6, beat 6 = P7. **Beat 4 spans two parts.** Strategy and plan answer different questions ("what" and "who, when"), and putting them in one part would make it 42% of the scroll. P8 and P9 follow the decision, so no beat is reordered.

**P1 The case in brief**: who this is for, and the argument on one screen.
Entering: curious, with no context. Leaving: knows the claim (a recognition gap outside Kitui Central, 51.7% of the register) and what Firefly offers.
Opening beat: "You are at the start. This part states the case; the next four parts test it against Kitui's own records."
Way to the tier: there is none from here. The reader is told the platform exists and is described in the decision part.

**P2 Kitui today**: what is true about the county and its voters?
Entering: wants proof that the claim rests on facts. Leaving: knows who lives in Kitui, what they lack, how they get information, and the vote arithmetic.
Opening beat: "Evidence first. This part settles what is true of Kitui; the next part settles what it means for Dr. Mulu."
Way to the tier: none mid-argument. The ward and data tools are named once, after the decision.

**P3 The contest**: who is running, and where does Dr. Mulu stand?
Entering: knows the county and wonders where he fits. Leaving: holds the diagnosis, framed as a hypothesis with its own test.
Opening beat: "From the county to the race. This part settles where he stands; the next settles what to do about it."
Way to the tier: none.

**P4 The strategy**: what should the campaign do, and why?
Entering: accepts the diagnosis and wants the answer. Leaving: knows the goal, the claim, the message, the voters and the channels.
Opening beat: "The evidence justifies a strategy. This part settles what to do; the next settles who does it, and when."
Way to the tier: none.

**P5 The plan**: who does the work, in what order, and how?
Entering: convinced of the direction and asking whether it can be done. Leaving: has seen the owners, the dated phases and the fourteen workstreams.
Opening beat: "From what to how. This part settles who works and when; the next settles how success is proven and the campaign kept safe."
Way to the tier: none. Workstream text that points to working records is flagged in section 10, not routed.

**P6 Proof and protection**: how would we know it worked, and stay safe?
Entering: wants assurance before committing. Leaving: knows the deciding indicator (recognition where he is least known), the legal gate and the response protocol.
Opening beat: "Before the decision, the safeguards. This part settles how results are judged and risks handled; the next puts the decision to him."
Way to the tier: none.

**P7 The decision**: what is Dr. Mulu being asked to decide?
Entering: ready to weigh the offer. Leaving: has seen the platform, the three scope levels, both sides' commitments and the ask.
Opening beat: "The argument is complete. This part sets out the offer and the decision."
Way to the tier: the platform chapter describes the tier; the reader is invited in only after the ask and the evidence shelf.

**P8 The evidence behind it**: where does every figure come from, and on what terms?
Entering: the decision has been put; a reviewer wants to check the working. Leaving: can trace any figure and knows the terms of use.
Opening beat: "The argument is over. What follows is the evidence for checking, and then the platform the team works on."
Way to the tier: a closing band at the end of this part names the working platform and states that it is for the campaign team. This is the tier's only door in the reading order.

**P9 The working platform** (operations tier): where the team reads the data, keeps its records and plans the work.
Entering: an operator with a task. Leaving: has found the data view, record, tool or runbook the task needs.
Opening beat: "This is the working layer. It is open to view; editing is switched off for now."

**Legacy verdicts (principle F)**

| Old part | Verdict | Reasoning |
|---|---|---|
| Opening | Kept, renamed "The case in brief" | Cover and summary are the right first beat; the name now says what the part does. |
| Kitui today | Kept, one chapter moved | "How Kitui voted" moves to the end, next to the contest it feeds. This also removes four forward references to the needs and news chapters. |
| The contest | Kept as is | Race, record, diagnosis is already the right order: field, then him, then the conclusion. |
| The strategy | Kept as is | Goal, position, message, voters, channels already runs from end to means. The voters chapter depends on the message's content types, so the order stays. |
| How the campaign runs | Renamed "The plan"; the platform chapter moved out | Its toolkit chapter interrupted the argument between strategy and timeline. |
| Proof and protection | Kept; two sections moved to the tier | The charter (a differentiator) stays. Account security and phishing are staff controls and join the runbooks. |
| The decision | Kept; takes in the platform chapter | The offer is a platform, so he sees it before he is asked. |
| Reference shelf | Dissolved | Evidence and fine print stay readable as "The evidence behind it". Playbooks, technology and runbooks equip operators and move to the tier. |

---

## 4. The chapter TOC

**Heading tree.** The site title is H1, each chapter is H2 and each section is H3. On a chapter's own page, the chapter title takes H1 and everything moves up one level. Parts are labelled bands, as the current part markers already are, not headings. Where a source file nests further (`###`), the sub-sections are listed inline on their section's line and do not form a fourth level. ‹n› shows the old heading number so the team can find its way back; it is not part of any title.

**Reading surfaces.** The chapters below appear on both surfaces in the same order:
- **S1, the continuous scroll**: the phone-first reading, one thumb-scroll from cover to evidence.
- **S2, the complete printable version**: every chapter rendered on the server, for PDF and readers without JavaScript.

### The case in brief: who this is for, and the argument on one screen

- **Who this is for**: prepared for Dr. Mulu by Firefly Management, and on what terms [P1.C1] [persuade] [THIN] [CONTENT CONFLICT]
  - No H2/H3 sections. The block of names, date and status sits under an H4 with no parent; see section 10.
- **The case on one screen**: the gap, why it can close, and what Firefly offers [P1.C2] [persuade] [THIN] [CONTENT CONFLICT]
  - No sections. A lead paragraph and two body paragraphs.

### Kitui today: what is true about the county and its voters?

- **The county in numbers**: who lives in Kitui, on what land, and how it is run [P2.C1] [persuade]
  - Who lives here ‹1.1›
  - The land and its three regions ‹1.2›
  - How the county is run ‹1.4›
- **What voters need**: water first, then food, health, roads, jobs, prices and public money [P2.C2] [persuade]
  - How households live ‹1.3›
  - Water ‹3.1›
  - Food, farming and drought ‹3.2›
  - Health ‹3.3›
  - Roads and access ‹3.4›
  - Jobs and the young ‹3.5›
  - The cost of living ‹3.6›
  - The county's budget and plan ‹1.5›
  - How county money is spent ‹3.7›
  - Mui Basin coal and displaced communities ‹3.8›
- **How voters get news**: 73.8% are offline, so phone, radio and people carry the race [P2.C3] [persuade]
  - Where people get information ‹4.1›
  - Who owns the airwaves ‹4.2›
  - What each channel can reach ‹4.3›
  - Reaching the offline majority ‹4.4›
- **How Kitui voted**: the register, the results since 2013, and the number it takes [P2.C4] [persuade]
  - The electorate and polling stations ‹2.1›
  - Results from 2013 to 2022 ‹2.2›
  - The twelve largest wards ‹2.3›
  - The constituencies that decide it ‹2.4›
  - The number it takes ‹2.5›

### The contest: who is running, and where does Dr. Mulu stand?

- **The race for 2027**: an open seat, a two-stage contest, and the rivals within the law [P3.C1] [persuade]
  - An open seat ‹5.1›
  - How Wiper chooses its candidate ‹5.2›
  - The field in both stages ‹5.3›
  - If it becomes a delegate primary ‹5.4›
  - Each rival, and the legal limits ‹5.5›
- **His record and reach**: a documented record, known mainly in Kitui Central [P3.C2] [persuade]
  - The public record ‹6.1›
  - Where he is known, and where not ‹6.2›
  - Where party loyalty will not carry him ‹6.3›
  - His channels and his rivals' ‹6.4›
  - What his online presence shows ‹6.5›
- **The diagnosis**: a recognition gap outside Kitui Central, stated as a hypothesis to test [P3.C3] [persuade]
  - What the evidence says ‹7.1›
  - What could overturn it ‹7.2›
  - What the data cannot yet show ‹7.3›
  - The assumptions the plan rests on ‹7.4›

### The strategy: what should the campaign do, and why?

- **The goal**: the Wiper ticket first, then the county, with five objectives [P4.C1] [persuade]
  - The goal and its two deadlines ‹8.1›
  - Five objectives ‹8.2›. Inline: be known where he is not yet known ‹8.2.1›; turn his record into visible proof ‹8.2.2›; reach voters the internet does not ‹8.2.3›; give every post a voter, ward and reason ‹8.2.4›; hold the home base ‹8.2.5›
- **The position**: the Economist Governor, who can show where public money went [P4.C2] [persuade]
  - The central claim ‹9.1›
  - The resource paradox ‹9.2›
  - Answering the charge of coldness ‹9.3›
- **The message**: one claim, three pillars, six themes, four content types [P4.C3] [persuade]
  - One claim, three pillars, six themes ‹10.1›
  - Discipline and persuasion principles ‹10.2›
  - Framing, in worked examples ‹10.3›
  - Sample messages from the weekly brief ‹10.4›
  - Countering disinformation ‹10.5›
- **The voters to win**: three universes and six segments, by interest, place and life stage [P4.C4] [persuade]
  - The base, persuasion and turnout universes ‹11.1›
  - The six voter segments ‹11.2›
  - How large each segment is ‹11.3›
- **Channels and language**: where the effort goes, on which channel, in which language [P4.C5] [persuade]
  - Where the effort goes ‹12.1›
  - Which channel does which job ‹12.2›
  - The radio gatekeepers ‹12.3›
  - Which language reaches which voters ‹12.4›
  - Register, dialect and quality control ‹12.5›
  - A week of publishing, before and after ‹12.6›
  - When the plan changes ‹12.7›

### The plan: who does the work, in what order, and how?

- **Who does what**: his team publishes, Firefly runs the platform, one brief a week [P5.C1] [persuade]
  - How the work is built ‹13.1›
  - Who owns what ‹13.2›
  - What is outside the scope ‹13.3›
  - The weekly rhythm and approvals ‹13.4›
  - Meetings and escalation ‹13.5›
  - The campaign team ‹17›. Inline: three teams and how they fit ‹17.1›; the strategy core and Firefly's part ‹17.2›; surge roles ‹17.3›; leadership, reporting lines and local roles ‹17.4›; assessing and upskilling the team ‹17.5›
- **The timeline to August 2027**: five phases, dated by the electoral calendar [P5.C2] [persuade]
  - The first four weeks ‹14.1›
  - Setting up measurement ‹14.2›
  - Six profile corrections ‹14.3›
  - The target ladder ‹14.4›
  - Awareness, October to December 2026 ‹14.5› (dates kept; staleness flagged in section 10)
  - Persuasion, January to March 2027 ‹14.6›
  - Mobilisation and turnout, April to August 2027 ‹14.7›
  - Coalitions and endorsements, in order ‹16›. Inline: the principle behind the order ‹16.1›; the sequenced calendar ‹16.2›; managing endorsements and measuring coalitions ‹16.3›
  - After the election ‹14.8›
- **The fourteen workstreams**: what each produces, who owns it, and how often it reports [P5.C3] [persuade]
  - Owned platforms and content ‹15.1›. Inline: owned platforms and the service-delivery tracker; the content brief and asset governance; creative testing and AI assistance; accessibility and inclusion ‹15.1.1–15.1.4›
  - Media ‹15.2›. Inline: platform tactics and paid media; earned media, journalists and debates ‹15.2.1–15.2.2›
  - Ground and offline reach ‹15.3›. Inline: ground-digital integration; the field-to-digital loop; SMS, USSD and voice; digital organising and volunteers ‹15.3.1–15.3.4›
  - Data and technology ‹15.4›. Inline: the data layer; predictive voter modelling; the technology stack; analytics and attribution ‹15.4.1–15.4.4›
  - (The volunteer programme reference ‹D.1› moves to Platform playbooks in the tier.)

### Proof and protection: how would we know it worked, and stay safe?

- **Measuring success**: votes and recognition count; followers and likes do not [P6.C1] [persuade] [CONTENT CONFLICT]
  - How success will be judged ‹18.1›
  - Scorecards for each stage ‹18.2›
  - Recognition where he is least known ‹18.3›
  - Why vanity metrics are left out ‹18.4›
  - How the presence audit works ‹18.5›
- **Lawful and ethical**: a data-protection gate, a published charter and IEBC clearance [P6.C2] [persuade]
  - Our standard ‹19.1›
  - The Data Protection Act and the regulator ‹19.2›
  - The Digital Ethics and Data Charter ‹19.3›
  - IEBC clearance and liability ‹19.4›
  - Open regulatory items ‹19.5›
  - (Account security baseline ‹F.8› and phishing awareness ‹F.9› move to Runbooks in the tier.)
- **Risks and response**: six risks, and a rehearsed answer to attack [P6.C3] [persuade]
  - Risks and responses ‹20.1›
  - The war room ‹20.2›
  - Four tiers of response ‹F.1›
  - Response times by channel ‹F.2›
  - The protocol and message library ‹F.5›
  - Staying inside defamation law ‹20.3›
  - Manipulated media and cyber security ‹20.4›
  - Monitoring competitors from public sources ‹20.5›

### The decision: what is Dr. Mulu being asked to decide?

- **The platform in one view**: who sees what, who edits what, and what Firefly runs [P7.C1] [persuade] [THIN] [CONTENT CONFLICT]
  - No sections. Four visuals: open to view or sign in to edit; how an edit reaches the site; the work and where the team does it; what Firefly runs behind the scenes. The chapter ends in a row of links into the tier (flagged).
- **What you get and what you provide**: three scope levels, the deliverables, and both sides' commitments [P7.C2] [persuade]
  - The three scope levels compared ‹21.1›. Inline: the levels ‹21.1.1›; side by side ‹21.1.2›
  - The deliverables schedule ‹21.2›
  - Commitments on both sides ‹22›. Inline: what Firefly commits to ‹22.1›; what the campaign provides ‹22.2›
- **The ask**: the decision in front of him, and the window that sets the pace [P7.C3] [persuade] [THIN] [CONTENT CONFLICT]
  - The window that sets the pace ‹23.1›
  - (Its H4 "What the record does not yet show" sits outside the tree; see section 10.)

### The evidence behind it: where does every figure come from, and on what terms?

- **Evidence and sources**: the standard every figure meets, and where each comes from [P8.C1] [persuade]
  - The evidence standard ‹A.1›. Inline: every figure carries its provenance ‹A.1.1›; the three source tiers ‹A.1.2›; when two sources disagree ‹A.1.3›; the standard applied to our own measurement ‹A.1.4›
  - Every source, in one table ‹A.2›
- **Every ward in one table**: the 40-ward register behind the vote arithmetic [P8.C2] [persuade] [THIN]
  - The 40-ward register ‹B.1›
- **Fine print**: confidentiality, use, and the terms used throughout [P8.C3] [persuade] [CONTENT CONFLICT]
  - Confidentiality and use ‹G.1›
  - Terms used on this site ‹H.1›

Verdict lines for the three reference chapters that move to the tier are in section 5, under "Operating references". Every chapter's retention or demotion is justified in one line in the Rationale column of the migration map (section 7).

---

## 5. The operations tier

**How it is entered:** once, after the evidence shelf, through a closing band that names the working platform and says it is for the campaign team; nothing in Parts 1 to 7 sends the reader there.

**Status note:** team sign-in is switched off at this commit. Every working-record view and data view can be read, and none can be edited. No title below promises editing.

"Current identifier" gives the route as it exists today, so the team can find each node. These are not proposals.

### The working platform: where the team reads the data, keeps its records and plans the work

**T1 Read the data**: every dataset, searchable and downloadable
| ID | Node | Subtitle | Current identifier |
|---|---|---|---|
| T1.1 | Explore the data | search, filter, share and export any dataset | `/explore` |
| T1.2 | Dashboards | indicators against target, reach, sends, sentiment, incidents | `/dashboards` |
| T1.3 | Data downloads | 93 CSV tables behind the site's figures, with the figure index | `public/data/` (93 CSV + `index.json`) |

**T2 Follow the strategy**: each objective traced to its evidence and its actions
| T2.1 | Strategies | objectives, strategies, workstreams and risks, each linked to its data | `/strategies` |
|---|---|---|---|
| T2.2 | Implementation | owner, channel and status of every action, and which strategies have none | `/progress` |

**T3 Working records**: the team's twelve record collections, view only for now
| ID | Group | Collection | Subtitle | Current identifier |
|---|---|---|---|---|
| T3.0 | | Working records index | all twelve collections in five groups | `/workspace` |
| T3.1 | Direct the team | Weekly brief | the week's pillar weights, which must total 100%, and its must-post items | `/workspace/briefs` |
| T3.2 | Direct the team | Content calendar | each post from draft to approved to published; Kikamba needs native review | `/workspace/calendar` |
| T3.3 | Direct the team | Meetings and decisions | the meeting rhythm and what was decided | `/workspace/cadence` |
| T3.4 | Run the channels | SMS, USSD and WhatsApp dispatch | planned and sent messages, checked against the sending rules | `/workspace/dispatch` |
| T3.5 | Measure | KPI tracker | each indicator against its target | `/workspace/kpi-actuals` |
| T3.6 | Measure | Channel audit | reach by constituency, language and format | `/workspace/channel-audit` |
| T3.7 | Measure | Creative tests | each test, its result and the decision | `/workspace/tests` |
| T3.8 | Measure | Field and sentiment | what each ward is saying | `/workspace/field` |
| T3.9 | Measure | Competitor watch | rivals, from public sources only | `/workspace/competitors` |
| T3.10 | Protect | Rapid response | each attack, its severity, drafter and approver | `/workspace/incidents` |
| T3.11 | Deliver | Implementation | how each strategy is being carried out | `/workspace/implementation` |
| T3.12 | Deliver | Service-delivery tracker | verification status of county projects | `/workspace/projects` |

**T4 Planning tools**: 33 slots: 7 built, 26 [PLANNED]
| ID | Tool | Subtitle | Status | Current identifier |
|---|---|---|---|---|
| T4.0 | Tools hub | the full toolkit, with a quick simulator | built | `/tools` |
| T4.1 | Ward dossier | one reference page per ward, for all 40 wards | built ("Ready") | `/tools/ward-dossier` + 40 ward pages |
| T4.2 | Winning-number simulator | turnout and share by constituency against the benchmark; a scenario, not a forecast | built ("Live") | `/tools/winning-number` |
| T4.3 | Governor race calendar | every Gazette deadline, passed and upcoming | built ("Live") | `/tools/race-calendar` |
| T4.4 | Polling agent planner | agents, reserves and supervisors from station counts | built ("Live") | `/tools/polling-agents` |
| T4.5 | Governor nomination path | open confirmations and dated filings, saved on the device | built ("Live") | `/tools/nomination-path` |
| T4.6 | Sources and data gaps | where official figures come from, and what is missing | built ("Ready") | `/tools/sources` |
| T4.7 | Service-delivery tracker | 401 county projects, easy to verify and share | built ("Ready") | `/tools/service-delivery` |
| T4.8 | Planned tools | 26 slots shown as "Not built yet" | [PLANNED] ×26 | hub cards with no page |

The 26 [PLANNED] slots, by hub family, with names as they appear in `ToolsHub.tsx`:
- **Data & targeting (7 planned of 11 slots):** Kitui Map Studio [PLANNED]; Coalition Path Builder [PLANNED]; Ward Priority Scorer [PLANNED]; Presence Audit Loader [PLANNED]; Published Margin Tracker [PLANNED]; Assumptions Panel [PLANNED]; Register Growth Tracker [PLANNED]
- **Messaging & channels (9 planned):** Message Studio [PLANNED]; USSD Flow Builder [PLANNED]; WhatsApp Template Planner [PLANNED]; Message Assignment Matrix [PLANNED]; Language & Compliance [PLANNED]; Weekly Content Calendar [PLANNED]; Radio Planner [PLANNED]; Rapid Response Runbook [PLANNED]; Rumour Log [PLANNED]
- **Ground & field (5 planned):** Field Network Tracker [PLANNED]; Market-Day Planner [PLANNED]; Event Saturation Heatmap [PLANNED]; Ward Allocation Simulator [PLANNED]; Data Update Wizard [PLANNED]
- **Measurement & reach (5 planned):** KPI Ladder Dashboard [PLANNED]; Rival & Ad-Library Monitor [PLANNED]; Ward Link & QR Builder [PLANNED]; Offline Waterline [PLANNED]; After-Action Review [PLANNED]
- Count: 7 + 9 + 5 + 5 = **26 [PLANNED]**. Built: 4 (Data & targeting) + 0 (Messaging) + 3 (Ground & field: Service-Delivery Tracker, Polling Agent Planner, Governor Nomination Path) + 0 (Measurement) = **7**. 26 + 7 = **33**.

**T5 Operating references**: the playbooks and runbooks the team works from
- **Platform playbooks**: one job per platform, its formats, copy samples and volunteers [T5.1] [equip] [demoted]
  - Platform playbooks ‹C.1›
  - Formats, copy samples and the USSD pointer ‹C.2›
  - Volunteer programme reference ‹D.1› (moved from the workstreams chapter)
  - Verdict: equip. It is copy and format detail for the publishing team; the argument for each channel's job stays in Channels and language.
- **Runbooks**: holding lines, drills, the threat model, incidents and account security [T5.2] [equip] [demoted]
  - Holding positions, pre-drafted ‹F.3›
  - Monitoring tools ‹F.4›
  - Red-team drills ‹F.6›
  - The threat model ‹F.7›
  - Account security baseline ‹F.8› (moved from Lawful and ethical)
  - Phishing awareness ‹F.9› (moved from Lawful and ethical)
  - The incident response plan ‹F.10›
  - Competitor intelligence outputs and alerts ‹F.11›
  - Verdict: equip. Its own lead calls it detail "a principal approves the existence of"; the protocol he approves stays in Risks and response.
- **Technology**: the reference architecture and the voter-model dictionary [T5.3] [equip] [demoted]
  - The reference architecture ‹E.1›
  - The voter model and its variables ‹E.2›
  - Verdict: equip. A build specification; the commitment he weighs is the technology-stack workstream inside The fourteen workstreams.

**T6 Looking after the platform**: change history and the switched-off editing pages
| ID | Node | Subtitle | Status | Current identifier |
|---|---|---|---|---|
| T6.1 | Changes | who changed what, and when | built | `/history` |
| T6.2 | Edit data | figures, ward register and strategy lists, with validation | switched off (returns "not found") | `/team/data` |
| T6.3 | Team accounts | Firefly adds and removes accounts | switched off | `/team/admin` |
| T6.4 | Team sign-in | where members would sign in | switched off | `/team/login` |
| T6.5 | Visual-kinds fixture | a test page that renders every visual type; not linked, not indexed | built, unlinked | `/tools/visual-kinds` |

---

## 6. Reading paths

Each path is a route through the same table of contents. Every node on a path is also on another audience's path or in the shared funnel, so no audience depends on a node built only for it.

| Audience | Route (in order) | Also used by |
|---|---|---|
| Dr. Mulu (decides) | The case on one screen [P1.C2] → The diagnosis [P3.C3] → The position [P4.C2] → The timeline to August 2027 [P5.C2] → Measuring success [P6.C1] → What you get and what you provide [P7.C2] → The ask [P7.C3] | P1.C2, P3.C3 and P7.C2 by the decision group; P5.C2 by the teams; P4.C2, P6.C1 and P7.C3 sit in the shared funnel every reader scrolls |
| Decision-making group (reviews) | The case on one screen [P1.C2] → The race for 2027 [P3.C1] → The diagnosis [P3.C3] → Lawful and ethical [P6.C2] → Risks and response [P6.C3] → What you get and what you provide [P7.C2] → Evidence and sources [P8.C1] | P8.C1 by Firefly; P6.C3 by the teams; P1.C2, P3.C3 and P7.C2 by Dr. Mulu |
| Publishing and field teams (operate) | The message [P4.C3] → Channels and language [P4.C5] → Who does what [P5.C1] → The fourteen workstreams [P5.C3] → Working records [T3] → Planning tools [T4] → Platform playbooks [T5.1] | P5.C1 by Firefly; T3, T4 and T5.1 are also used by Firefly to support the team |
| Firefly Management (builds and runs) | The platform in one view [P7.C1] → Who does what [P5.C1] → Evidence and sources [P8.C1] → Read the data [T1] → Looking after the platform [T6] → Technology [T5.3] | T1 by the teams; T6.1 (Changes) by the teams to revert an edit; T5.3 by the decision group's reviewer |

Each row has 6 or 7 nodes. Every node cited is in sections 4 or 5, and every one is shared with at least one other audience or the common scroll.

---

## 7. The migration map

Phase 1 ledger: **59 rows (L01–L59)**. Migration map: **59 rows**. Every L-ID appears exactly once. The rows are sorted by new location in reading order: S1, S2, then P1 to P8, then T1 to T6.

**Worked examples**
- **L04, `content/votes.md`, split.** Sections 2.1–2.5 stay together as "How Kitui voted" and move to the end of Kitui today [P2.C4]. The 40-ward table ‹B.1›, which interrupted the arithmetic between 2.3 and 2.4, becomes "Every ward in one table" [P8.C2]. Both destinations are named, and no text is lost.
- **L16, `content/platform.md`, moved.** It moves from between "How it works" and "Timeline" (old Part 5) to the start of The decision [P7.C1]. It is a persuasion node, because the offer is a platform and he should see it before the ask. It no longer interrupts the plan.
- **L25, `content/annex-playbooks.md`, demoted to operations tier.** It becomes Platform playbooks [T5.1] and also receives ‹D.1› from L18, so the volunteer programme rejoins the reference it was written with.

| ID | Old file / heading | Old location | New location | Status | Rationale |
|---|---|---|---|---|---|
| L36 | `/`, the continuous scroll (`app/[[...slug]]/page.tsx`, also one route per chapter) | Primary surface | S1, the continuous scroll | kept | The reading surface itself; only the chapter order inside it changes. |
| L34 | `public/og/kitui-2027.png`: share-card image | Link previews | S1, supporting asset | kept | Draws the preview when a link is forwarded; no reader node. |
| L35 | `public/sw.js`: offline reading worker | Whole site | S1, supporting asset | kept | Lets a phone reopen what it has read when the signal drops (purpose 44). |
| L33 | `public/portraits/`: 10 images (5 portraits × 2 sizes) | Cover and chapter visuals | S1 and S2, supporting asset | kept | Visual-first reading (purpose 43). |
| L32 | `public/geo/kitui-wards.topo.json`: ward boundaries | Maps in Kitui today and the ward tools | S1 and S2, supporting asset for P2.C4 and T4.1 | kept | Base map for the cartograms; unchanged. |
| L29 | `public/content/*.md`: 28 published chapter copies | Fetched by the scroll as the reader approaches | S1 and S2, following their chapters | kept | Compiled copies (tokens resolved) with headings identical to `content/`; each follows its chapter's move. |
| L37 | `/full`, the complete server-rendered version | Print and no-JavaScript surface | S2, the complete printable version | kept | Same order as S1, with every chapter rendered on the server. |
| L01 | `content/cover.md`: "Cover" | P1 Opening, chapter 1 | P1.C1 Who this is for | renamed | Persuade: names the reader and the terms first. Tagged for its "confidential" and "eight annexes" claims. |
| L02 | `content/brief.md`: "In brief" | P1 Opening, chapter 2 | P1.C2 The case on one screen | renamed | Persuade: the hook. Tagged because it still asks for "one week, one export". |
| L03 | `content/kitui.md`: "Kitui at a glance" | P2 Kitui today, chapter 1 | P2.C1 The county in numbers | renamed | Persuade: the evidence base starts with the people; it stays first. |
| L05 | `content/needs.md`: "What voters need" | P2 Kitui today, chapter 3 | P2.C2 What voters need | kept | Persuade: needs follow the people they describe. Its relative order with news is unchanged, and it moves up one place only because votes moved. |
| L06 | `content/news.md`: "How voters get news" | P2 Kitui today, chapter 4 | P2.C3 How voters get news | kept | Persuade: reach is evidence the channel strategy needs. Its relative order is unchanged. |
| L04 | `content/votes.md`: "How Kitui voted" (2.1–2.5; B.1 The 40-ward register) | P2 Kitui today, chapter 2 | 2.1–2.5 → P2.C4 How Kitui voted; B.1 → P8.C2 Every ward in one table | split | Persuade: the arithmetic now sits next to the contest it feeds, and four references back to needs and news no longer point forward. The 40-row table is checking material and leaves the argument. |
| L07 | `content/race.md`: "The race for 2027" | P3 The contest, chapter 1 | P3.C1 The race for 2027 | kept | Persuade: the field, then him, then the conclusion. This order works. |
| L08 | `content/record.md`: "Record and reach" | P3 The contest, chapter 2 | P3.C2 His record and reach | renamed | Persuade: the title now names whose record it is. |
| L09 | `content/diagnosis.md`: "The diagnosis" | P3 The contest, chapter 3 | P3.C3 The diagnosis | kept | Persuade: the conclusion of the evidence, and the strategy's premise. |
| L10 | `content/goal.md`: "The goal" | P4 The strategy, chapter 1 | P4.C1 The goal | kept | Persuade: the end before the means. |
| L11 | `content/position.md`: "The position" | P4 The strategy, chapter 2 | P4.C2 The position | kept | Persuade: the claim the message argues. |
| L12 | `content/message.md`: "The message" | P4 The strategy, chapter 3 | P4.C3 The message | kept | Persuade: defines the content types the voters chapter uses. |
| L13 | `content/voters.md`: "The voters to win" | P4 The strategy, chapter 4 | P4.C4 The voters to win | kept | Persuade: segments by interest, place and life stage; the ban on ethnic and clan segmentation is unchanged. |
| L14 | `content/channels.md`: "Channels & language" | P4 The strategy, chapter 5 | P4.C5 Channels and language | renamed | Persuade: the ampersand is spelled out; the chapter closes the strategy. |
| L15 | `content/engagement.md`: "How it works" (13.1–13.5; 17 The team, 17.1–17.5) | P5 How the campaign runs, chapter 1 | P5.C1 Who does what | renamed | Persuade: defines the relationship (purpose 3). The timeline and workstreams cite its ownership, rhythm and team sections 10 times, so it stays first in the part. |
| L17 | `content/timeline.md`: "Timeline to Aug 2027" | P5 How the campaign runs, chapter 3 | P5.C2 The timeline to August 2027 | renamed | Persuade: dated proof that the plan can be done. It now follows Who does what directly. |
| L18 | `content/workstreams.md`: "The workstreams" (15.1–15.4; D.1 Volunteer programme reference) | P5 How the campaign runs, chapter 4 | 15.1–15.4 → P5.C3 The fourteen workstreams; D.1 → T5.1 Platform playbooks | split | Persuade: what the plan produces and who owns it. D.1 calls itself "reference" and is equipment. |
| L19 | `content/success.md`: "Measuring success" | P6 Proof and protection, chapter 1 | P6.C1 Measuring success | kept | Persuade: the deciding indicator before he decides. Tagged because the team "enters" KPIs while editing is off. |
| L20 | `content/lawful.md`: "Lawful & ethical" (19.1–19.5; F.8 Account security baseline; F.9 Phishing awareness) | P6 Proof and protection, chapter 2 | 19.1–19.5 → P6.C2 Lawful and ethical; F.8, F.9 → T5.2 Runbooks | split | Persuade: the gate and the charter are the differentiator. Account security and phishing are staff controls, and their F numbers show they were written as runbooks. |
| L21 | `content/response.md`: "Risks & response" (20.1–20.5 with F.1, F.2, F.5) | P6 Proof and protection, chapter 3 | P6.C3 Risks and response | renamed | Persuade: F.1, F.2 and F.5 stay. The tiered protocol and response times are what he is asked to trust. |
| L16 | `content/platform.md`: "How the platform works" | P5 How the campaign runs, chapter 2 | P7.C1 The platform in one view | moved | Persuade: the offer is a platform, so it opens the decision. Taking it out of the plan removes the toolkit interruption. Tagged for "signs in to change it". |
| L22 | `content/receives.md`: "What you get and what you provide" (21.1–21.2; 22, 22.1–22.2) | P7 The decision, chapter 1 | P7.C2 What you get and what you provide | kept | Persuade: scope levels and commitments on both sides. |
| L23 | `content/ask.md`: "The ask" (23.1) | P7 The decision, chapter 2 | P7.C3 The ask | kept | Persuade: the terminal beat. Tagged because it still asks for "one week and one export". |
| L24 | `content/annex-evidence.md`: "Evidence & sources" | P8 Reference shelf, chapter 1 | P8.C1 Evidence and sources | renamed | Persuade: traceability is how the reviewer checks the case (purpose 14). It stays readable after the ask. |
| L28 | `content/annex-terms.md`: "Fine print" (G.1, H.1) | P8 Reference shelf, chapter 5 | P8.C3 Fine print | kept | Persuade: terms of use and plain-language definitions for every reader. G.1 is tagged. |
| L30 | `public/data/*.csv`: 93 CSV downloads | Linked from tables and figures in every part | T1.3 Data downloads | kept | Equip: reuse of the data (purpose 15). The links inside chapters stay. |
| L31 | `public/data/index.json`: figure index | Feeds figures and downloads | T1.3 Data downloads | kept | Equip: the catalogue behind the CSVs. |
| L38 | `/explore`: "Explore the data" | Platform, linked from the platform chapter | T1.1 Explore the data | kept | Equip: search, filter and export. |
| L39 | `/dashboards`: "Dashboards" | Platform | T1.2 Dashboards | kept | Equip: indicators against target. |
| L40 | `/strategies`: "Strategies and solutions" | Platform | T2.1 Strategies | kept | Equip: each strategy traced to its evidence. |
| L41 | `/progress`: "Implementation" | Platform | T2.2 Implementation | kept | Equip: the status of every action. |
| L42 | `/workspace`: "Workspace" | Platform | T3.0 Working records index | renamed | Equip: "Working records" says what is kept there. |
| L43 | `/workspace/[collection]`: 12 collections (briefs, calendar, cadence, dispatch, kpi-actuals, channel-audit, tests, field, competitors, incidents, implementation, projects) | Platform | T3.1–T3.12 | kept | Equip: the team's records. View only while sign-in is off. |
| L48 | `/tools`: "Tools" hub (`ToolsHub.tsx`, 33 slots) | Platform, unlinked from the scroll | T4.0 Tools hub | kept | Equip: the toolkit directory. |
| L49 | `/tools/ward-dossier`: ward dossier index | Platform | T4.1 Ward dossier | kept | Equip: ward reference. Spending-limits heading flagged (mismatch 5). |
| L50 | `/tools/ward-dossier/[code]`: 40 ward pages | Platform | T4.1 Ward dossier (40 pages) | kept | Equip: one page per ward. |
| L51 | `/tools/winning-number`: "Winning-number simulator" | Platform | T4.2 Winning-number simulator | kept | Equip: a scenario model with its limits panel. |
| L52 | `/tools/race-calendar`: "Governor race calendar" | Platform | T4.3 Governor race calendar | kept | Equip: Gazette deadlines. |
| L53 | `/tools/polling-agents`: "Polling agent planner" | Platform | T4.4 Polling agent planner | kept | Equip: agent sizing. |
| L54 | `/tools/nomination-path`: "Governor nomination path" | Platform | T4.5 Governor nomination path | kept | Equip: the nomination checklist. |
| L55 | `/tools/sources`: "Sources and data gaps" | Platform | T4.6 Sources and data gaps | kept | Equip: source gaps, and the operational twin of P8.C1. |
| L56 | `/tools/service-delivery`: "Service-delivery tracker" | Platform | T4.7 Service-delivery tracker | kept | Equip: project verification. |
| L57 | `data/analysis/projects-register.json`: 401 itemised county projects | Data behind the tracker | T4.7 Service-delivery tracker (401 projects) | kept | Equip: the tracker's records. |
| L58 | 26 hub slots with no page (names in section 5) | Tools hub, "Not built yet" | T4.8 Planned tools [PLANNED] ×26 | kept | Equip, intent only. Never presented as live. |
| L25 | `content/annex-playbooks.md`: "Playbooks" (C.1, C.2) | P8 Reference shelf, chapter 2 | T5.1 Platform playbooks (+ D.1 from L18) | demoted to operations tier | Equip: copy samples and formats for publishers. Receives D.1; sources L25 + L18 (D.1). |
| L27 | `content/annex-runbooks.md`: "Runbooks" (F.3, F.4, F.6, F.7, F.10, F.11) | P8 Reference shelf, chapter 4 | T5.2 Runbooks (+ F.8, F.9 from L20) | demoted to operations tier | Equip: operating procedure. Receives F.8 and F.9; sources L27 + L20 (F.8, F.9). |
| L26 | `content/annex-technology.md`: "Technology" (E.1, E.2) | P8 Reference shelf, chapter 3 | T5.3 Technology | demoted to operations tier | Equip: a build specification. The principal-level commitment stays in the technology-stack workstream. |
| L44 | `/history`: "Changes" | Platform | T6.1 Changes | kept | Equip: audit trail and revert. |
| L45 | `/team/data`: "Edit data" | Platform, switched off | T6.2 Edit data | kept | Equip: switched off; listed so it is not lost, and not promised. |
| L46 | `/team/admin`: "Team accounts" | Platform, switched off | T6.3 Team accounts | kept | Equip: switched off. |
| L47 | `/team/login`: "Team sign-in" | Platform, switched off | T6.4 Team sign-in | kept | Equip: switched off. |
| L59 | `/tools/visual-kinds`: "Visual kinds" fixture | Unlinked test page (not in the baseline) | T6.5 Visual-kinds fixture | kept | Maintenance only; reported as dead weight in section 9. |

Row count: **59**. Status tally:
- **kept (42):** L29, L36, L34, L35, L33, L32, L37, L05, L06, L07, L09, L10, L11, L12, L13, L19, L22, L23, L28, L30, L31, L38, L39, L40, L41, L43, L48, L49, L50, L51, L52, L53, L54, L55, L56, L57, L58, L44, L45, L46, L47, L59
- **renamed (10):** L01, L02, L03, L08, L14, L15, L17, L21, L24, L42
- **moved (1):** L16
- **split (3):** L04, L18, L20
- **demoted to operations tier (3):** L25, L26, L27

42 + 10 + 1 + 3 + 3 = **59**. This matches the ledger.

The two merges (D.1 into T5.1; F.8 and F.9 into T5.2) are recorded on both their source rows (L18, L20) and their receiving rows (L25, L27). They are not a separate row status, because each source is one file that splits.

---

## 8. Reconciliation

| Denominator | Baseline | Repository | In the map | Arithmetic and notes |
|---|---:|---:|---:|---|
| `.md` files in `content/` | 28 | 28 | 28 (L01–L28) | 28 = 28. The baseline names 5: `cover`, `brief`, `ask`, `timeline`, `annex-terms`. The other 23 are `kitui, votes, needs, news, race, record, diagnosis, goal, position, message, voters, channels, engagement, platform, workstreams, success, lawful, response, receives` (19) + `annex-evidence, annex-playbooks, annex-technology, annex-runbooks` (4). 5 + 23 = 28. |
| Chapters in rendered order (`SECTIONS`) | 28 | 28 | 28 | 1:1 with the files. |
| Published chapters in `public/content/` | n/a | 28 | 28 (one family row, L29) | Heading checksum identical for 28 of 28; body differs only where tokens are resolved. |
| Headings (H2 + H3) | n/a | 125 + 25 = 150 | 150 in the TOC | Every H2 is a TOC section line (125) and every H3 is listed inline (25). By chapter: kitui 3, needs 10, news 4, votes 6, race 5, record 5, diagnosis 4, goal 2+5, position 3, message 5, voters 3, channels 7, engagement 11, timeline 12, workstreams 5+14, success 5, lawful 7, response 8, receives 5+2, ask 1, evidence 2+4, terms 2, playbooks 2, runbooks 6, technology 2. H2 sum = 125; H3 sum = 5+14+2+4 = 25. |
| New chapter nodes | n/a | n/a | 29 | 28 files + 1 split-out chapter (P8.C2) = 29: 26 in the reading surfaces and 3 in the tier. D.1 and F.8/F.9 join existing tier chapters and create no new chapters. This is disclosed as non-1:1. |
| Routes (`page.tsx` files) | 12 named + 40 ward pages | 21 files | 21 + families | The baseline's 12: `/`, `/full`, `/explore`, `/dashboards`, `/strategies`, `/progress`, `/workspace`, `/history`, `/team/data`, `/team/admin`, `/team/login`, `/tools` → L36, L37, L38, L39, L40, L41, L42, L44, L45, L46, L47, L48. Tool pages: 7 → L49, L51–L56. Families: 40 ward pages (L50) and 12 collection pages (L43). **Not in the baseline:** `/tools/visual-kinds` (L59), and the `/workspace/[collection]` route as a page family. `/` and `/full` share one file (`app/[[...slug]]/page.tsx`). 21 files = 1 catch-all + 1 hub + 1 service-delivery + 1 visual-kinds + 17 under `(platform)`. |
| Tools | 33 (7 built, 26 planned) | 33 (7 in `BUILT`, 26 not) | 7 rows + 1 family row of 26 | 7 + 26 = 33. Names verified, so the "names unverified" fallback was not needed. |
| Workspace collections | 12 | 12 | 12 (L43 → T3.1–T3.12) | Names and the five groups match the baseline exactly. |
| Ward pages | 40 | 40 (`ward-register.json`) | L50 | 40 = 40. |
| CSV downloads | 93 | 93 | L30 | 93 = 93, plus 1 `index.json` (L31). |
| Service-delivery projects | 401 | 401 (`projects-register.json`, `values`) | L57 | 401 = 401. |
| Other public assets | not listed | 10 portraits, 1 map, 1 share image, 1 offline worker | L32–L35 | Not in the baseline; added to the ledger so they have a home. |

**Discrepancies, both directions**
1. The repository has `/tools/visual-kinds`; the baseline does not list it.
2. The repository has 14 public assets the baseline does not list (L32–L35).
3. The handoff report says "27 chapters of prose". The repository has 28, with `platform.md` added since.
4. The cover says "six Parts and eight annexes". The build has six numbered Parts plus five reference chapters; annexes B, D and H live inside other chapters.
5. The analysis's Group F counts the tools hub as one of eight tools. The hub is a directory, so it is T4.0 and not a tool slot. Built tools remain 7.
6. The baseline puts the service-delivery tracker among the platform routes. In the repository it lives outside the `(platform)` group (`app/tools/service-delivery/`). Its status is unchanged.

There are no shortfalls. Every denominator is matched by the map.

---

## 9. Purpose coverage

Phase 2 ledger: **65 rows (R01–R65)**: 45 numbered purposes, 12 collections and 8 tools. Matrix: **65 rows**. "P" marks the primary home and "S" a secondary one.

### (a) Matrix

| R | Analysis ref | Purpose | Primary | Secondary |
|---|---|---|---|---|
| R01 | A1 | Secure a decision from Dr. Mulu | P7.C3 The ask | P7.C2 |
| R02 | A2 | Make the whole case without a meeting | P1.C2 The case on one screen | S1 (whole scroll) |
| R03 | A3 | Define the relationship | P5.C1 Who does what | P7.C1, P1.C1 |
| R04 | A4 | Offer three scope levels | P7.C2 What you get and what you provide | — |
| R05 | A5 | Set out mutual commitments | P7.C2 | P5.C1 |
| R06 | A6 | Show the product as well as describe it | P7.C1 The platform in one view | P4.C5, P5.C3, T1.2 |
| R07 | B7 | Explain the county | P2.C1 The county in numbers | — |
| R08 | B8 | Explain the electorate | P2.C4 How Kitui voted | P8.C2, T4.1 |
| R09 | B9 | Document what voters need | P2.C2 What voters need | — |
| R10 | B10 | Document how county money is used | P2.C2 (county budget; how money is spent) | T4.7 |
| R11 | B11 | Map how voters get information | P2.C3 How voters get news | — |
| R12 | B12 | Map the contest | P3.C1 The race for 2027 | — |
| R13 | B13 | Assess Dr. Mulu's position | P3.C2 His record and reach | — |
| R14 | B14 | Make every number traceable | P8.C1 Evidence and sources | T4.6 |
| R15 | B15 | Publish the data for reuse | T1.3 Data downloads | T1.1 |
| R16 | C16 | State a testable diagnosis | P3.C3 The diagnosis | P1.C2 |
| R17 | C17 | Set the goal and deadlines | P4.C1 The goal | T4.2 |
| R18 | C18 | Set five objectives | P4.C1 | — |
| R19 | C19 | Establish the position | P4.C2 The position | — |
| R20 | C20 | Build the message system | P4.C3 The message | T5.1 |
| R21 | C21 | Define who to reach (no ethnic or clan segmentation) | P4.C4 The voters to win | — |
| R22 | C22 | Allocate effort | P4.C5 Channels and language | — |
| R23 | C23 | Sequence coalitions and endorsements | P5.C2 (coalitions and endorsements, in order) | — |
| R24 | D24 | Give a dated roadmap | P5.C2 The timeline to August 2027 | T4.3 |
| R25 | D25 | Specify fourteen workstreams | P5.C3 The fourteen workstreams | — |
| R26 | D26 | Assign ownership | P5.C1 (who owns what) | T2.2 |
| R27 | D27 | Fix a weekly rhythm | P5.C1 (weekly rhythm; meetings) | T3.1, T3.3 |
| R28 | D28 | Supply ready reference material | T5.1 Platform playbooks | T5.2, T5.3 |
| R29 | G29 | Keep it lawful | P6.C2 Lawful and ethical | — |
| R30 | G30 | Make ethics a differentiator | P6.C2 (the charter) | — |
| R31 | G31 | Keep personal data off the platform | P6.C2 | T3.0 (collections have no personal fields) |
| R32 | G32 | Manage risk and attack | P6.C3 Risks and response | T5.2, T3.10 |
| R33 | G33 | Bar NG-CDF beneficiary lists | P6.C2 | — |
| R34 | G34 | Exclude opinion polls | **ORPHAN**: see (b) | — |
| R35 | H35 | Judge success by votes and recognition | P6.C1 Measuring success | T3.5 |
| R36 | H36 | Exclude vanity metrics | P6.C1 | — |
| R37 | H37 | Baseline the 90-day presence | P6.C1 (presence audit) | P5.C2 (first four weeks), T3.6 |
| R38 | I38 | Refresh without code | T6.2 Edit data (switched off) | P7.C1, T6.1 |
| R39 | I39 | Watch public sources daily | **ORPHAN**: see (b) | — |
| R40 | I40 | Block errors before publication | P7.C1 (what Firefly runs: the automated checks) | P8.C1 |
| R41 | I41 | Reproduce the analysis | **ORPHAN**: see (b) | — |
| R42 | I42 | Keep an audit trail of the site's evolution | T6.1 Changes (edits only) | Partial: repository ledgers have no reader node; see (b) |
| R43 | J43 | Lead with visuals | S1 (cross-cutting) | P2, P4 |
| R44 | J44 | Work on phones and in print | S1 and S2 | — |
| R45 | J45 | Stay out of search engines | S1 and S2 (site-wide setting) | — |
| R46 | E | Weekly brief | T3.1 | P5.C1, P4.C3 |
| R47 | E | Content calendar | T3.2 | P5.C1 |
| R48 | E | Meetings and decisions | T3.3 | P5.C1 |
| R49 | E | SMS, USSD and WhatsApp dispatch | T3.4 | P5.C3, P4.C5 |
| R50 | E | KPI tracker | T3.5 | P6.C1 |
| R51 | E | Channel audit | T3.6 | P6.C1 |
| R52 | E | Creative tests | T3.7 | P5.C3 |
| R53 | E | Field and sentiment | T3.8 | P5.C3 |
| R54 | E | Competitor watch | T3.9 | P6.C3 |
| R55 | E | Rapid response | T3.10 | P6.C3 |
| R56 | E | Implementation | T3.11 | T2.2 |
| R57 | E | Service-delivery tracker (collection) | T3.12 | P5.C3, T4.7 |
| R58 | F | Tools hub | T4.0 | — |
| R59 | F | Ward dossier | T4.1 | P2.C4, P8.C2 |
| R60 | F | Winning-number simulator | T4.2 | P2.C4 |
| R61 | F | Race calendar | T4.3 | P3.C1 |
| R62 | F | Polling agent planner | T4.4 | P5.C3 |
| R63 | F | Nomination path | T4.5 | P3.C1 |
| R64 | F | Sources and gaps | T4.6 | P8.C1 |
| R65 | F | Service-delivery tracker (tool) | T4.7 | P2.C2, P5.C3 |

Rows: 65. Primary homes found: 62. Orphans: 3 (R34, R39, R41), plus R42 partly homed.

### (b) Orphans

| R | Purpose | Why it has no home | Proposed carrier |
|---|---|---|---|
| R34 | Exclude opinion polls | The rule exists only in the pipeline and build guards; no chapter states it. A text search of `content/` found no mention of polls. | P8.C1 Evidence and sources, beside the source tiers |
| R39 | Watch public sources daily | The daily snapshot job (`.github/workflows/public-refresh.yml`) is mentioned in no chapter or page. | P8.C1 Evidence and sources (how figures are kept current), with T6.1 Changes as the operational trace |
| R41 | Reproduce the analysis | The Python pipeline stays out of the deployed site by design. | P8.C1 Evidence and sources (method note); no new node |
| R42 (partial) | Audit trail of the site's own evolution | T6.1 records data edits. The change logs, ledgers and restructure records live only in the repository. | T6.1 Changes, with a pointer to the repository ledgers |

### (c) Dead weight

| Node | Ledger row | Why no purpose row is served |
|---|---|---|
| T6.5 Visual-kinds fixture | L59 | A developer test page: unlinked, not indexed and not in the purpose analysis. It is a candidate for the team to confirm it is wanted; it is listed, not deleted. |
| Share-card image (S1 supporting asset) | L34 | Serves link forwarding, which no purpose names. Reported, not removed. |

Every other node serves at least one R-row.

---

## 10. Rationale, flags, appendix

### (a) Rationale

**The decision part now shows the product before the ask.** In the old order, "How the platform works" sat between "How it works" and "Timeline". A reader who had just accepted the strategy met sign-in, edit flows and a row of links out to the toolkit before learning when anything would happen. That is the interruption the brief describes. The chapter is short (419 words) and argues one thing: what Dr. Mulu would be buying. It now opens The decision, so the plan runs strategy, owners, timeline, workstreams without a break, and the offer is concrete when the scope levels and the ask arrive.

**The vote arithmetic moves to the edge of the contest.** "How Kitui voted" was the second chapter of Kitui today. It cites the needs chapter three times and the news chapter once, all forward. Placed last in the part, it follows the evidence it uses and hands the benchmark and the deciding constituencies straight to "The race for 2027". The 40-ward table that sat between "the twelve largest wards" and "the constituencies that decide it" moves to the evidence shelf, so the arithmetic reads in one run.

**The reference shelf is split by who uses it.** The old Part 8 held five chapters with one label. Two serve the person checking the case: evidence and sources, and the fine print. Three serve the person doing the work: playbooks, technology and runbooks. The first two stay on the reading surface after the ask. The other three join the operations tier with the toolkit and records. The volunteer programme (from the workstreams) and account security and phishing (from lawful and ethical) go with them. Their old annex letters, D and F, show they were written as reference, and the consolidation pass folded them into argument chapters. 947 words of staff material leave the argument chapters, and nothing leaves the site.

**What stays.** The contest and strategy parts are already in the right order, and moving them would break real dependencies. The voters chapter uses the message's content types. The workstreams cite the ownership, rhythm and team sections of "How it works" ten times, so that chapter keeps its place at the head of the plan. The cross-index runs the other way too (it cites the workstreams nine times), but a reader needs to know who owns work before reading fourteen workstreams that each name an owner.

### (b) Before and after

| Beat | Old order: where the reader stands | New order: where the reader stands |
|---|---|---|
| 1 | Has read the claim and been asked for "one week, one export" before seeing any evidence | Has read the claim (the ask's wording is flagged for replacement) |
| 2 | Has read the vote arithmetic before learning what voters need | Has read people, needs and news, then the arithmetic built on them |
| 3 | Holds the diagnosis | Holds the diagnosis, and arrived at it straight from the benchmark |
| 4 | Has the strategy, then a sign-in and edit-flow chapter, then the timeline | Has the strategy, then owners, timeline and workstreams without a break |
| 5 | Has proof and protection, with phishing training inside the legal chapter | Has proof and protection at decision level; staff controls sit in the runbooks |
| 6 | Is asked to decide, then scrolls into playbooks and runbooks | Sees the platform, the offer and the ask, then evidence for checking, then a labelled door to the working platform |

### (c) Flags

**The eight known mismatches**

| # | Verdict | Evidence |
|---|---|---|
| 1 | **Confirmed** | All three team pages call `notFound()` when `teamLoginEnabled()` is false. `HANDOFF.md` records sign-in switched off. `platform.md` says "Dr. Mulu's team signs in to change it". `success.md` (7 places) and `workstreams.md` (5) describe entering records. Tagged [CONTENT CONFLICT] on P7.C1 and P6.C1. |
| 2 | **Confirmed** | `cover.md`: "**Confidential.** … shared by link only". `annex-terms.md` G.1 is submitted "in confidence". The repository is public (GitHub listing; `HANDOFF.md:141`, "GitHub Actions: None: the repository is public"). `middleware.ts` has a passcode gate, off unless `SITE_PASSCODE` is set; its live state is [UNVERIFIED]. |
| 3 | **Confirmed** (count). The "labelled Live" sub-claim is **refuted for display** | 33 slots and 7 in `BUILT`. Unbuilt cards render "Not built yet" (`ToolsHub.tsx:88`), so no planned tool shows "Live". The source data does assign "Live" to three unbuilt slots (Assumptions Panel, Language & Compliance, Data Update Wizard), which would surface if the override were removed. |
| 4 | **Confirmed** | `cover.md`: "Date: September 2026". `timeline.md` 14.5: "Phase 1: awareness, October–December 2026". `ask.md` 23.1: "a window that opens in late October". `race.md` 5.2 reports the Wiper decision for late October to November (Tier 3). As at 8 November 2026 that window is reported as open or imminent. The dates were not changed here. |
| 5 | **Confirmed** | The ward dossier index has the heading "Spending limits, 2027 General Election", and each ward page shows "MCA spending limit, 2027". `CHANGE-LOG.md:203`: "The spend ceiling was excised at the campaign's instruction." Whether returning it was approved is [UNVERIFIED]. |
| 6 | **Confirmed** | `lib/data/figures.ts:155`: benchmark 200,000 ("the 2022 winning tally, 198,004, rounded"). `analysis/reports/findings.md:15`: "about 225,115 votes … Every target built on ~200,000 is set too low" (Tier 3). |
| 7 | **Confirmed**, in the body text | Headings are displayed without numbers (`displayTitle` in `lib/heading-slug.ts`). The body still carries 415 "Section n" references, 42 "Annex X", 13 "Chapter n" and 6 "Part N", plus "This chapter opens Part IV" (`engagement.md`) and "six Parts and eight annexes" (`cover.md`). |
| 8 | **Confirmed** | "one week, one export" or "one week and one export" appears 2 times in `brief.md` and 3 in `ask.md`. The ask's blurb in `lib/heading-slug.ts` reads "One week and one export". `lib/register/specs/s6-nextsteps.ts:25` reads "A counterpart, read-only access … come first". Tagged [CONTENT CONFLICT] on P1.C2 and P7.C3. |

**Further structural problems**
- **F1 Flat heading tree on the scroll.** `ChapterMarker` renders the chapter name as H2, and `MarkdownViewer` renders each `##` section as H2 as well. Chapter and section are peers in the accessibility tree. Fixing this is a heading-level change downstream; it needs no copy change.
- **F2 Heading skips.** `cover.md` and `ask.md` use H4 with no H2 or H3 parent.
- **F3 Group headings at section level.** `## 17 The team`, `## 16 Coalitions…` and `## 22 What Firefly commits…` are H2s whose children are also H2s. The TOC treats them as one section each, with the children inline. In `timeline.md` the numbering runs 14.7 → 16 → 14.8.
- **F4 Foreign numbers inside chapters.** B.1 sits in votes, D.1 in workstreams, F.1/F.2/F.5 in response, F.8/F.9 in lawful, 1.3/1.5 in needs and H.1 in fine print. The numbers are hidden from view but still form the anchor ids.
- **F5 Exits mid-argument.** `platform.md` ends in a row of links into the tier. In its new place it is the last chapter before the scope levels. Signalling should say these are for the team, after the decision.
- **F6 Repeated lead.** `brief.md` and `ask.md` open with the same sentence, and the ask repeats it a third time in a quote block.
- **F7 Stale self-description.** The cover's "order of the six Parts and eight annexes" and the runbooks lead's "account security and phishing are in Lawful & ethical" both go out of date under this TOC. Re-wording them is downstream copy work.

**Cross-references.** Content holds **476** numbered textual references (415 + 42 + 13 + 6).
- **None lose their target.** Anchor ids are built from heading numbers, no route changes, and 1,704 legacy redirects already exist.
- **About 32 will read wrongly after the move.** 26 "Annex C/D/E/F" references in reading chapters now point into the operations tier. 4 "Annex B" references point to the evidence shelf. 2 bare mentions name the split sections.
- **All 476 still read as document numbering** (mismatch 7).

Relinking and relabelling are downstream work. Nothing was changed here.

### (d) Appendix: headings read, verbatim

The verbatim H2 and H3 headings of all 28 chapters, with paths, are listed below. They were extracted mechanically from `content/` at `b7bc346`: **28 of 28 chapters**, 150 headings, plus the two H4s that stand in for the missing sections in `cover.md` and `ask.md`.

**`content/cover.md`** (0 H2/H3)

- `#### Prepared for, prepared by, and on what terms` (H4, no parent)

**`content/brief.md`** (0 H2/H3)

- (no H2 or H3 headings)


**`content/kitui.md`** (3 H2/H3)

- `## 1.1 The people: population, gender, age, households`
- `## 1.2 The land: area, density, rural and urban, the three regions`
- `## 1.4 How the county is run: 8 constituencies, 40 wards, sub-counties and villages`

**`content/votes.md`** (6 H2/H3)

- `## 2.1 The electorate: registered voters in 2022 and 2026, polling stations, turnout`
- `## 2.2 Results, 2013 to 2022`
- `## 2.3 Where the votes are: the twelve largest wards`
- `## B.1 The 40-ward register`
- `## 2.4 The constituencies that decide it: the Mwingi bloc and the Big Four`
- `## 2.5 The number it takes: the winning benchmark and four routes to it`

**`content/needs.md`** (10 H2/H3)

- `## 1.3 Living standards: poverty, water, electricity, phones and internet`
- `## 3.1 Water`
- `## 3.2 Food, farming and drought`
- `## 3.3 Health`
- `## 3.4 Roads and access`
- `## 3.5 Jobs and the young`
- `## 3.6 The cost of living`
- `## 1.5 The county's money: the budget envelope, the development plan, the audit record`
- `## 3.7 How county money is spent: the audit record and the incumbent's scorecard`
- `## 3.8 Mui Basin coal and the displaced communities`

**`content/news.md`** (4 H2/H3)

- `## 4.1 Where people get information`
- `## 4.2 Who owns the airwaves`
- `## 4.3 What each channel can physically reach`
- `## 4.4 The offline majority, and the infrastructure that reaches it`

**`content/race.md`** (5 H2/H3)

- `## 5.1 An open seat: the incumbent is term-limited`
- `## 5.2 How Wiper chooses its candidate, and when`
- `## 5.3 The field: the nomination contest and the general election`
- `## 5.4 If it becomes a delegate primary`
- `## 5.5 Each rival, and the legal ground to be careful on`

**`content/record.md`** (5 H2/H3)

- `## 6.1 The public record`
- `## 6.2 Where he is known, and where he is not`
- `## 6.3 Where party loyalty will not carry him`
- `## 6.4 His channels today, and his rivals'`
- `## 6.5 What his current online presence shows`

**`content/diagnosis.md`** (4 H2/H3)

- `## 7.1 What the evidence says`
- `## 7.2 What could overturn it`
- `## 7.3 What the data cannot yet tell us`
- `## 7.4 The assumptions this plan rests on`

**`content/goal.md`** (7 H2/H3)

- `## 8.1 The goal and the two deadlines`
- `## 8.2 Five objectives for the digital operation`
- `### 8.2.1 Be known where he isn't yet`
- `### 8.2.2 Turn his record into visible proof`
- `### 8.2.3 Build a direct line to the voters the internet doesn't reach`
- `### 8.2.4 Give every post a voter, a ward and a reason`
- `### 8.2.5 Hold the home base while Kitui Central runs its own race`

**`content/position.md`** (3 H2/H3)

- `## 9.1 The central claim`
- `## 9.2 The resource paradox`
- `## 9.3 Answering the charge that discipline is cold`

**`content/message.md`** (5 H2/H3)

- `## 10.1 One claim, three pillars, six themes`
- `## 10.2 Message discipline and persuasion principles`
- `## 10.3 Framing, worked through in examples`
- `## 10.4 Sample messaging: what the weekly brief hands the team`
- `## 10.5 Countering disinformation`

**`content/voters.md`** (3 H2/H3)

- `## 11.1 The universes: base, persuasion, turnout`
- `## 11.2 The six voter segments`
- `## 11.3 How large each segment is, and the evidence`

**`content/channels.md`** (7 H2/H3)

- `## 12.1 Where the effort goes`
- `## 12.2 Which channel does which job`
- `## 12.3 The gatekeeper bottleneck`
- `## 12.4 Which language reaches which voters`
- `## 12.5 Register, dialect and quality control`
- `## 12.6 A week of publishing, before and after`
- `## 12.7 When the plan changes`

**`content/engagement.md`** (11 H2/H3)

- `## 13.1 How this proposal is built`
- `## 13.2 Who owns what: your team, the campaign, and Firefly's platform`
- `## 13.3 What is outside this scope`
- `## 13.4 The weekly rhythm, decision rights and approvals`
- `## 13.5 Meetings and the escalation path`
- `## 17 The team`
- `## 17.1 Three teams, and how they fit`
- `## 17.2 The strategy core, and Firefly's part`
- `## 17.3 Surge roles`
- `## 17.4 Leadership, reporting lines and local roles`
- `## 17.5 How the existing team is assessed and upskilled`

**`content/platform.md`** (0 H2/H3)

- (no H2 or H3 headings)


**`content/timeline.md`** (12 H2/H3)

- `## 14.1 The first four weeks`
- `## 14.2 Phase 0: instrumentation`
- `## 14.3 Fix first: six profile corrections`
- `## 14.4 The target ladder`
- `## 14.5 Phase 1: awareness, October–December 2026`
- `## 14.6 Phase 2: engagement and persuasion, January–March 2027`
- `## 14.7 Phase 3: mobilisation and turnout, April–August 2027`
- `## 16 Coalitions and endorsements, in sequence`
- `## 16.1 The principle behind the sequence`
- `## 16.2 The sequenced calendar`
- `## 16.3 Managing endorsements, and how coalitions are measured`
- `## 14.8 After the election`

**`content/workstreams.md`** (19 H2/H3)

- `## 15.1 Owned platforms and content (workstreams 1–4)`
- `### 15.1.1 Workstream 1 — Owned platforms and the service-delivery tracker`
- `### 15.1.2 Workstream 2 — The content brief and asset governance`
- `### 15.1.3 Workstream 3 — Creative testing and AI assistance`
- `### 15.1.4 Workstream 4 — Accessibility and inclusion`
- `## 15.2 Media (workstreams 5–6)`
- `### 15.2.1 Workstream 5 — Platform tactics and paid media`
- `### 15.2.2 Workstream 6 — Earned media, journalists and debates`
- `## 15.3 Ground and offline (workstreams 7–10)`
- `### 15.3.1 Workstream 7 — Ground-digital integration`
- `### 15.3.2 Workstream 8 — The field-to-digital loop`
- `### 15.3.3 Workstream 9 — What your team operates: SMS, USSD and voice`
- `### 15.3.4 Workstream 10 — Digital organising and volunteers`
- `## D.1 Volunteer programme reference`
- `## 15.4 Data and technology (workstreams 11–14)`
- `### 15.4.1 Workstream 11 — The data layer`
- `### 15.4.2 Workstream 12 — Predictive voter modelling`
- `### 15.4.3 Workstream 13 — The technology stack`
- `### 15.4.4 Workstream 14 — Analytics and attribution`

**`content/success.md`** (5 H2/H3)

- `## 18.1 How success will be judged`
- `## 18.2 The scorecards for each stage`
- `## 18.3 Recognition where he is least known`
- `## 18.4 Why vanity metrics are excluded`
- `## 18.5 The presence audit: method`

**`content/lawful.md`** (7 H2/H3)

- `## 19.1 Our standard`
- `## 19.2 The Data Protection Act and the regulator`
- `## 19.3 The Digital Ethics and Data Charter`
- `## F.8 Account security baseline`
- `## F.9 Phishing awareness`
- `## 19.4 IEBC clearance and liability`
- `## 19.5 Open regulatory items`

**`content/response.md`** (8 H2/H3)

- `## 20.1 Risks and responses`
- `## 20.2 The war room and rapid-response protocol`
- `## F.1 The four-tier response decision tree`
- `## F.2 Response times, by channel`
- `## F.5 Rapid-response protocol and pre-approved message library`
- `## 20.3 Staying inside defamation law`
- `## 20.4 Manipulated media and cyber security`
- `## 20.5 Monitoring competitors: public sources only`

**`content/receives.md`** (7 H2/H3)

- `## 21.1 The three scope levels, compared`
- `### 21.1.1 The three scope levels`
- `### 21.1.2 The scope levels compared`
- `## 21.2 The deliverables schedule`
- `## 22 What Firefly commits to, and what the campaign provides`
- `## 22.1 What Firefly commits to`
- `## 22.2 What the campaign provides`

**`content/ask.md`** (1 H2/H3)

- `## 23.1 The window, not the deadline`
- `#### What the record does not yet show` (H4, no parent)

**`content/annex-evidence.md`** (6 H2/H3)

- `## A.1 Evidence standard: provenance and source tiers`
- `### A.1.1 Every figure carries its provenance`
- `### A.1.2 The three source tiers`
- `### A.1.3 When two sources disagree`
- `### A.1.4 The standard applied to our own measurement`
- `## A.2 Source table`

**`content/annex-playbooks.md`** (2 H2/H3)

- `## C.1 Platform playbooks`
- `## C.2 Formats, copy samples and the USSD pointer`

**`content/annex-technology.md`** (2 H2/H3)

- `## E.1 Technology reference architecture`
- `## E.2 Voter model: data sources and variable dictionary`

**`content/annex-runbooks.md`** (6 H2/H3)

- `## F.3 Holding positions, pre-drafted`
- `## F.4 Monitoring tools`
- `## F.6 Red-team drills`
- `## F.7 The threat model`
- `## F.10 The incident response plan`
- `## F.11 Competitive intelligence outputs and rapid alerts`

**`content/annex-terms.md`** (2 H2/H3)

- `## G.1 Confidentiality and use`
- `## H.1 Terms used in this proposal`

Chapters quoted: 28. H2/H3 headings quoted: 150.

### (e) Tag summary

| Tag | Count | Where |
|---|---:|---|
| [UNVERIFIED] | 2 | The `SITE_PASSCODE` gate state; the approval of returned spending limits |
| [PLANNED] | 26 | T4.8: every unbuilt tool slot |
| [THIN] | 5 | P1.C1, P1.C2, P7.C1, P7.C3, P8.C2 |
| [CONTENT CONFLICT] | 6 | P1.C1 (confidential and link-only; "eight annexes"), P1.C2 and P7.C3 ("one week, one export"), P6.C1 and P7.C1 (editing described while switched off), P8.C3 (G.1 confidentiality) |
| [BASELINE] | 0 | Mode A |

The table of contents is sound. The content of the six [CONTENT CONFLICT] nodes is not, and needs copy work before the site meets its purpose.

### Gate table

| Gate | Status | Note |
|---|---|---|
| G1 Ledger completeness | PASS | 59 rows, L01–L59, counted in section 7 |
| G2 Map derived, not reconstructed | PASS | 59 map rows = 59 ledger rows; each L-ID appears once; status tally recounted to 59 |
| G3 Merge and split integrity | PASS | Splits L04, L18, L20 name both destinations; merges into L25 and L27 name their sources |
| G4 Coverage completeness | PASS | 65 rows (45 + 12 + 8); 3 orphans and 1 partial, each with a carrier |
| G5 Subtitle presence | PASS | 9 parts, 29 chapters and every tier node carry subtitles |
| G6 Title hygiene | PASS | No new title carries a number, annex letter or ID; old numbers appear only as ‹n› markers and in the map |
| G7 Dependency invariant | PASS | Dependencies listed in (a). The votes move removes 4 forward references. Engagement before workstreams is kept; the reverse references are a cross-index |
| G8 Operations tier separation | PASS | Distinct tier with one prose entry; 26 [PLANNED] |
| G9 No routing proposed | PASS | Route names appear only as "current identifier" |
| G10 Known mismatches answered | PASS | 8 verdicts |
| G11 Heading tree validity | PASS | TOC: H1 site, H2 chapter, H3 section; parts are bands. Build defects F1 and F2 flagged |
| G12 Reading paths valid | PASS | Every cited node is in the TOC; none is exclusive to one audience |

### Assumptions and open questions

- **Platform chapter before the ask.** It sits ahead of the ask as persuasion. If you see it as equipment, it moves to the head of the tier, and the decision part loses its only view of the product.
- **Two sections moved out of their chapters.** Account security, phishing and the volunteer reference are demoted, which reverses part of the November consolidation pass. Confirm that this is wanted.
- **Ward table on the evidence shelf.** The 40-ward table stays readable on the evidence shelf rather than going to the tier beside the ward dossiers.
- **Orphan purposes.** Opinion-poll exclusion, the daily source watch and the pipeline go to Evidence and sources as their carrier. This needs new copy, which is outside this brief.
- **Which benchmark the titles use.** Subtitles avoid the benchmark figure until the 200,000 versus 225,115 question (mismatch 6) is settled.
