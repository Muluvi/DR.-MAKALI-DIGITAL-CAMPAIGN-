# Restructure, November 2026 — Step 0: inventory, duplication and defects

Prepared 29 October 2026, before any rewriting. Nothing in `content/`, `lib/` or `public/` has been changed.

## How this was built

Every unit was numbered by a parser, not by hand, so the count is exact and repeatable. The parser reads the 19 files in `content/` in reading order (`FLOW_ORDER`) and makes one unit of each:

- heading (`##` to `#####`); lead, visual, figure and textversion fence; table; list; callout (blockquote); paragraph.
- Blank lines, `---` rules and `<!-- keep -->` markers are not units. A keep marker is recorded on the unit it protects (column *Keep*), because it means that unit's wording is fixed.

The *Description* column is the unit's first ten words (for fences, the component and its first label), so it can be checked against the file at the line given. *Anchor* is the unit's own heading id where it has one, otherwise the id of the numbered heading it sits under: that is the id an old link to it uses today. Only numbered `##` and `###` headings carry ids.

**Totals:** 1036 units; 176 live heading ids; 22 keep-marked units.

| Unit kind | Count |  | File | Units |
|---|---:|---|---|---:|
| paragraph | 350 |  | content/cover.md | 8 |
| heading | 287 |  | content/decision.md | 103 |
| visual | 116 |  | content/evidence.md | 152 |
| figure | 92 |  | content/strategy.md | 147 |
| lead | 82 |  | content/delivery.md | 59 |
| list | 42 |  | content/workstreams-platforms.md | 77 |
| callout | 32 |  | content/workstreams-media.md | 39 |
| table | 30 |  | content/workstreams-ground.md | 63 |
| textversion | 5 |  | content/workstreams-data.md | 40 |
|  |  |  | content/staffing.md | 33 |
|  |  |  | content/measurement.md | 91 |
|  |  |  | content/risks.md | 44 |
|  |  |  | content/annex-evidence.md | 20 |
|  |  |  | content/annex-county.md | 42 |
|  |  |  | content/annex-messages.md | 14 |
|  |  |  | content/annex-cadence.md | 8 |
|  |  |  | content/annex-runbooks.md | 42 |
|  |  |  | content/annex-terms.md | 5 |
|  |  |  | content/annex-spec.md | 49 |

## 1. Content inventory

| C | File:line | Current heading | Anchor | Unit | Keep | Description |
|---|---|---|---|---|---|---|
| C1 | cover.md:1 | (preamble) | — | paragraph |  | Who this proposal is for, who prepared it, the terms… |
| C2 | cover.md:3 | Prepared for, prepared by, and on what terms | — | heading |  | h2: Prepared for, prepared by, and on what terms |
| C3 | cover.md:5 | Prepared for, prepared by, and on what terms | — | paragraph |  | Confidential. Prepared for Hon. Dr. Benson Makali Mulu personally, and… |
| C4 | cover.md:7 | Prepared for, prepared by, and on what terms | — | paragraph |  | Prepared for: Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS… |
| C5 | cover.md:12 | Prepared for, prepared by, and on what terms | — | paragraph |  | Prepared by: Firefly Management Strategic Communications & Digital Campaign Consultancy… |
| C6 | cover.md:18 | Prepared for, prepared by, and on what terms | — | paragraph |  | Date: September 2026 |
| C7 | cover.md:20 | Prepared for, prepared by, and on what terms | — | paragraph |  | Status: Proposal for discussion. |
| C8 | cover.md:22 | Prepared for, prepared by, and on what terms | — | paragraph |  | Firefly holds no publishing credentials to any of Dr. Mulu's… |
| C9 | decision.md:3 | 1.1 The ask: one week and one export | **decision-sec-1-1** | heading |  | h2: 1.1 The ask: one week and one export |
| C10 | decision.md:5 | 1.1 The ask: one week and one export | decision-sec-1-1 | lead |  | lead: Firefly Management asks for one week and one export. Firefly… |
| C11 | decision.md:10 | 1.1 The ask: one week and one export | decision-sec-1-1 | figure `fig-6-3-decision` |  | figure component `fig-6-3-decision` |
| C12 | decision.md:14 | 1.1 The ask: one week and one export | decision-sec-1-1 | visual `stats` |  | visual `stats`: voters in the pool wards |
| C13 | decision.md:34 | 1.1 The ask: one week and one export | decision-sec-1-1 | callout |  | callout: THE WINDOW, NOT THE DEADLINE What sets the pace. That… |
| C14 | decision.md:49 | 1.1 The ask: one week and one export › The ask | decision-sec-1-1 | heading |  | h4: The ask |
| C15 | decision.md:51 | 1.1 The ask: one week and one export › The ask | decision-sec-1-1 | paragraph |  | Dr. Makali Mulu has the credentials, the experience and the… |
| C16 | decision.md:58 | 1.1 The ask: one week and one export › The ask | decision-sec-1-1 | paragraph |  | But the timeline is not the one the planning cycle… |
| C17 | decision.md:63 | 1.1 The ask: one week and one export › The ask | decision-sec-1-1 | paragraph |  | This proposal sets out the layer that turns an active… |
| C18 | decision.md:72 | 1.1 The ask: one week and one export › The ask | decision-sec-1-1 | paragraph |  | It is built on one premise: Kitui voters are ready… |
| C19 | decision.md:76 | 1.1 The ask: one week and one export › The ask | decision-sec-1-1 | paragraph |  | Firefly would like one week and one export. Everything after… |
| C20 | decision.md:80 | 1.1 The ask: one week and one export › The ask, in full | decision-sec-1-1 | heading |  | h4: The ask, in full |
| C21 | decision.md:82 | 1.1 The ask: one week and one export › The ask, in full | decision-sec-1-1 | callout |  | callout: Firefly Management asks for one week and one export. |
| C22 | decision.md:84 | 1.1 The ask: one week and one export › The ask, in full | decision-sec-1-1 | paragraph |  | Dr. Mulu is already in the conversation. A verified page,… |
| C23 | decision.md:89 | 1.1 The ask: one week and one export › The ask, in full | decision-sec-1-1 | paragraph |  | Firefly supplies that layer in the three steps Section 1.4.1… |
| C24 | decision.md:93 | 1.1 The ask: one week and one export › The ask, in full | decision-sec-1-1 | paragraph |  | Firefly publishes nothing on Dr. Mulu's accounts and holds no… |
| C25 | decision.md:98 | 1.1 The ask: one week and one export › The ask, in full | decision-sec-1-1 | paragraph |  | Where the contest stands. Both Wiper rivals have already won… |
| C26 | decision.md:102 | 1.1 The ask: one week and one export › The ask, in full | decision-sec-1-1 | paragraph |  | What Firefly does not ask you to believe. This proposal… |
| C27 | decision.md:106 | 1.2 The goal and the two deadlines | **decision-sec-1-2** | heading |  | h2: 1.2 The goal and the two deadlines |
| C28 | decision.md:108 | 1.2 The goal and the two deadlines | decision-sec-1-2 | lead |  | lead: The campaign operates against two deadlines: the Wiper nomination and… |
| C29 | decision.md:112 | 1.2 The goal and the two deadlines | decision-sec-1-2 | paragraph |  | The campaign's objectives are structured across two separate timelines, each… |
| C30 | decision.md:114 | 1.2 The goal and the two deadlines › The goal: the Wiper ticket first, the county second | decision-sec-1-2 | heading |  | h4: The goal: the Wiper ticket first, the county second |
| C31 | decision.md:116 | 1.2 The goal and the two deadlines › The goal: the Wiper ticket first, the county second | decision-sec-1-2 | list |  | list: Active Period (Clock): From signature to the close of the… |
| C32 | decision.md:119 | 1.2 The goal and the two deadlines › The two deadlines | decision-sec-1-2 | heading |  | h4: The two deadlines |
| C33 | decision.md:121 | 1.2 The goal and the two deadlines › The two deadlines | decision-sec-1-2 | paragraph |  | The campaign operates against two non-negotiable temporal milestones: |
| C34 | decision.md:122 | 1.2 The goal and the two deadlines › The two deadlines | decision-sec-1-2 | list |  | list: 1. Q4 2026 Nomination Window (reported): Success requires demonstrating organized… |
| C35 | decision.md:125 | 1.2 The goal and the two deadlines › The two deadlines | decision-sec-1-2 | figure `fig-1-1-timeline` |  | figure component `fig-1-1-timeline` |
| C36 | decision.md:129 | 1.3 Five objectives for the digital operation | **decision-sec-1-3** | heading |  | h2: 1.3 Five objectives for the digital operation |
| C37 | decision.md:131 | 1.3 Five objectives for the digital operation | decision-sec-1-3 | figure `fig-1-3-objectives` |  | figure component `fig-1-3-objectives` |
| C38 | decision.md:135 | 1.3 Five objectives for the digital operation › 1.3.1 Be known where he isn't yet | **decision-sec-1-3-1** | heading |  | h3: 1.3.1 Be known where he isn't yet |
| C39 | decision.md:137 | 1.3 Five objectives for the digital operation › 1.3.1 Be known where he isn't yet | decision-sec-1-3-1 | visual `cards` |  | visual `cards`: Target", text: "At least {pool.share}% of his reach landing in… |
| C40 | decision.md:152 | 1.3 Five objectives for the digital operation › 1.3.2 Turn his record into visible proof | **decision-sec-1-3-2** | heading |  | h3: 1.3.2 Turn his record into visible proof |
| C41 | decision.md:154 | 1.3 Five objectives for the digital operation › 1.3.2 Turn his record into visible proof | decision-sec-1-3-2 | visual `cards` |  | visual `cards`: Target", text: "40 ward-specific achievement briefs detailing economic and devolved… |
| C42 | decision.md:169 | 1.3 Five objectives for the digital operation › 1.3.3 Build a direct line to the voters the internet doesn't reach | **decision-sec-1-3-3** | heading |  | h3: 1.3.3 Build a direct line to the voters the internet… |
| C43 | decision.md:171 | 1.3 Five objectives for the digital operation › 1.3.3 Build a direct line to the voters the internet doesn't reach | decision-sec-1-3-3 | visual `cards` |  | visual `cards`: Target", text: " {target.sms} active, verified SMS/USSD offline subscribers across… |
| C44 | decision.md:187 | 1.3 Five objectives for the digital operation › 1.3.4 Give every post a voter, a ward and a reason | **decision-sec-1-3-4** | heading |  | h3: 1.3.4 Give every post a voter, a ward and a… |
| C45 | decision.md:189 | 1.3 Five objectives for the digital operation › 1.3.4 Give every post a voter, a ward and a reason | decision-sec-1-3-4 | visual `cards` |  | visual `cards`: Target", text: "Every briefed post coded with segment, ward and… |
| C46 | decision.md:205 | 1.3 Five objectives for the digital operation › 1.3.5 Hold the home base while Kitui Central runs its own race | **decision-sec-1-3-5** | heading |  | h3: 1.3.5 Hold the home base while Kitui Central runs its… |
| C47 | decision.md:207 | 1.3 Five objectives for the digital operation › 1.3.5 Hold the home base while Kitui Central runs its own race | decision-sec-1-3-5 | visual `cards` |  | visual `cards`: Target", text: "Reach and engagement in Kitui Central held at… |
| C48 | decision.md:221 | 1.4 Who does what: ownership and boundaries | **decision-sec-1-4** | heading |  | h2: 1.4 Who does what: ownership and boundaries |
| C49 | decision.md:223 | 1.4 Who does what: ownership and boundaries | decision-sec-1-4 | paragraph |  | Seven of the fourteen are Firefly's to operate. Six your… |
| C50 | decision.md:227 | 1.4 Who does what: ownership and boundaries › 1.4.1 How this proposal is built | **decision-sec-1-4-1** | heading |  | h3: 1.4.1 How this proposal is built |
| C51 | decision.md:229 | 1.4 Who does what: ownership and boundaries › 1.4.1 How this proposal is built | decision-sec-1-4-1 | lead |  | lead: Firefly publishes nothing on Dr. Mulu's accounts and holds no… |
| C52 | decision.md:233 | 1.4 Who does what: ownership and boundaries › 1.4.1 How this proposal is built | decision-sec-1-4-1 | paragraph |  | The digital operation separates operational software, messaging infrastructure, and data… |
| C53 | decision.md:235 | 1.4 Who does what: ownership and boundaries › 1.4.1 How this proposal is built | decision-sec-1-4-1 | figure `fig-1-4-flow` |  | figure component `fig-1-4-flow` |
| C54 | decision.md:239 | 1.4 Who does what: ownership and boundaries › 1.4.1 How this proposal is built | decision-sec-1-4-1 | visual `stepper` |  | visual `stepper`: Analyse (Week 1) |
| C55 | decision.md:252 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner | **decision-sec-1-4-2** | heading |  | h3: 1.4.2 The fourteen workstreams, by owner |
| C56 | decision.md:254 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner | decision-sec-1-4-2 | lead |  | lead: Firefly is being proposed as the campaign's intelligence and strategy… |
| C57 | decision.md:258 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › Who owns what | decision-sec-1-4-2 | heading |  | h4: Who owns what |
| C58 | decision.md:260 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › Who owns what | decision-sec-1-4-2 | paragraph |  | Fourteen numbered workstreams sit behind this engagement, and the change… |
| C59 | decision.md:263 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › Who owns what | decision-sec-1-4-2 | list |  | list: Seven are Firefly's to operate — the service-delivery tracker, the… |
| C60 | decision.md:272 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › Who owns what | decision-sec-1-4-2 | paragraph |  | Section 1.4 sets out all fourteen with the owner named… |
| C61 | decision.md:276 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › The fourteen, by owner | decision-sec-1-4-2 | heading |  | h4: The fourteen, by owner |
| C62 | decision.md:278 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › The fourteen, by owner | decision-sec-1-4-2 | figure `fig-5-1-workstreams` |  | figure component `fig-5-1-workstreams` |
| C63 | decision.md:282 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › The fourteen, by owner | decision-sec-1-4-2 | visual `cards` |  | visual `cards`: Workstream 9 is the one Firefly operates and the one… |
| C64 | decision.md:291 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › The Firefly proposition | decision-sec-1-4-2 | heading |  | h4: The Firefly proposition |
| C65 | decision.md:293 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › The Firefly proposition | decision-sec-1-4-2 | paragraph |  | Firefly is being proposed as the campaign's intelligence and strategy… |
| C66 | decision.md:295 | 1.4 Who does what: ownership and boundaries › 1.4.2 The fourteen workstreams, by owner › The Firefly proposition | decision-sec-1-4-2 | paragraph |  | Firefly is a Kenya-based media and consulting company . The… |
| C67 | decision.md:297 | 1.4 Who does what: ownership and boundaries › 1.4.3 What is outside this scope | **decision-sec-1-4-3** | heading |  | h3: 1.4.3 What is outside this scope |
| C68 | decision.md:299 | 1.4 Who does what: ownership and boundaries › 1.4.3 What is outside this scope | decision-sec-1-4-3 | paragraph |  | Stated as plainly as what is inside, because a boundary… |
| C69 | decision.md:302 | 1.4 Who does what: ownership and boundaries › 1.4.3 What is outside this scope | decision-sec-1-4-3 | visual `inout` |  | visual `inout`: Publishing to Dr. Mulu's owned accounts |
| C70 | decision.md:333 | 1.5 What Dr. Mulu receives, and how often | **decision-sec-1-5** | heading |  | h2: 1.5 What Dr. Mulu receives, and how often |
| C71 | decision.md:334 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels | **decision-sec-1-5-1** | heading |  | h3: 1.5.1 The three scope levels |
| C72 | decision.md:336 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels | decision-sec-1-5-1 | lead |  | lead: These are levels of depth, not volume. What none of… |
| C73 | decision.md:340 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels | decision-sec-1-5-1 | paragraph |  | One definition per number. Four different quantities are in play… |
| C74 | decision.md:343 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels | decision-sec-1-5-1 | visual `nested` |  | visual `nested`: Contact universe |
| C75 | decision.md:360 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels | decision-sec-1-5-1 | paragraph |  | They are nested, not alternatives: consented contacts ⊂ contact universe,… |
| C76 | decision.md:363 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels | decision-sec-1-5-1 | paragraph |  | These are levels of depth, not volume. What each level… |
| C77 | decision.md:369 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels | decision-sec-1-5-1 | paragraph | keep | Accessibility is not a service level. Sign-language interpretation on flagship… |
| C78 | decision.md:373 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 1 — LEAN | decision-sec-1-5-1 | heading |  | h4: Level 1 — LEAN |
| C79 | decision.md:374 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 1 — LEAN | decision-sec-1-5-1 | paragraph |  | Purpose: win the nomination, prove the model, keep the analysis… |
| C80 | decision.md:375 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 1 — LEAN | decision-sec-1-5-1 | list |  | list: Firefly team: Strategy Director + Analyst; offline-layer operator part-activated Presence… |
| C81 | decision.md:386 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 2 — STANDARD (recommended) | decision-sec-1-5-1 | heading |  | h4: Level 2 — STANDARD (recommended) |
| C82 | decision.md:387 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 2 — STANDARD (recommended) | decision-sec-1-5-1 | paragraph |  | Purpose: find the recognition gap ward by ward, and direct… |
| C83 | decision.md:388 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 2 — STANDARD (recommended) | decision-sec-1-5-1 | list |  | list: Firefly team: the full 3-person core, plus surge roles activated… |
| C84 | decision.md:398 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 3 — PREMIUM | decision-sec-1-5-1 | heading |  | h4: Level 3 — PREMIUM |
| C85 | decision.md:399 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 3 — PREMIUM | decision-sec-1-5-1 | paragraph |  | Purpose: instrument everything, and refresh the read faster than the… |
| C86 | decision.md:400 | 1.5 What Dr. Mulu receives, and how often › 1.5.1 The three scope levels › Level 3 — PREMIUM | decision-sec-1-5-1 | list |  | list: Firefly team: 3-person core + full surge bench against agreed… |
| C87 | decision.md:412 | 1.5 What Dr. Mulu receives, and how often › 1.5.2 The scope levels compared | **decision-sec-1-5-2** | heading |  | h3: 1.5.2 The scope levels compared |
| C88 | decision.md:414 | 1.5 What Dr. Mulu receives, and how often › 1.5.2 The scope levels compared | decision-sec-1-5-2 | figure `fig-5-5-cadence` |  | figure component `fig-5-5-cadence` |
| C89 | decision.md:418 | 1.5 What Dr. Mulu receives, and how often › 1.5.2 The scope levels compared | decision-sec-1-5-2 | paragraph |  | Recommendation: Level 2 (Standard). Level 1 instruments only the twelve… |
| C90 | decision.md:427 | 1.5 What Dr. Mulu receives, and how often › 1.5.3 The deliverables schedule | **decision-sec-1-5-3** | heading |  | h3: 1.5.3 The deliverables schedule |
| C91 | decision.md:429 | 1.5 What Dr. Mulu receives, and how often › 1.5.3 The deliverables schedule | decision-sec-1-5-3 | lead |  | lead: Every row below is set somewhere else in this proposal,… |
| C92 | decision.md:433 | 1.5 What Dr. Mulu receives, and how often › 1.5.3 The deliverables schedule | decision-sec-1-5-3 | paragraph |  | Every row below is set somewhere else in this proposal,… |
| C93 | decision.md:438 | 1.5 What Dr. Mulu receives, and how often › 1.5.3 The deliverables schedule | decision-sec-1-5-3 | paragraph |  | The "Produced by" column is the point. Most of this… |
| C94 | decision.md:442 | 1.5 What Dr. Mulu receives, and how often › 1.5.3 The deliverables schedule | decision-sec-1-5-3 | table | keep | table: Deliverable Cadence Produced by Form Where it is set |
| C95 | decision.md:464 | 1.5 What Dr. Mulu receives, and how often › 1.5.3 The deliverables schedule | decision-sec-1-5-3 | visual `checklist` |  | visual `checklist`: Four deliverables are gated on decisions the campaign has not… |
| C96 | decision.md:475 | 1.6 What this proposal commits to | **decision-sec-1-6** | heading |  | h2: 1.6 What this proposal commits to |
| C97 | decision.md:477 | 1.6 What this proposal commits to | decision-sec-1-6 | paragraph |  | Firefly commits to a scope, a cadence and a standard.… |
| C98 | decision.md:480 | 1.6 What this proposal commits to | decision-sec-1-6 | visual `checklist` |  | visual `checklist`: The scope |
| C99 | decision.md:496 | 1.7 What this needs from the campaign | **decision-sec-1-7** | heading |  | h2: 1.7 What this needs from the campaign |
| C100 | decision.md:498 | 1.7 What this needs from the campaign | decision-sec-1-7 | paragraph |  | What this proposal needs from the campaign, what is still… |
| C101 | decision.md:500 | 1.7 What this needs from the campaign | decision-sec-1-7 | paragraph |  | Stated plainly, because these are the dependencies that determine delivery: |
| C102 | decision.md:502 | 1.7 What this needs from the campaign | decision-sec-1-7 | figure `fig-6-1-dependencies` |  | figure component `fig-6-1-dependencies` |
| C103 | decision.md:506 | 1.7 What this needs from the campaign | decision-sec-1-7 | textversion |  | text version: Nine dependencies, set out in full in Section 1.7. Three… |
| C104 | decision.md:521 | 1.8 Assumptions this proposal rests on | **decision-sec-1-8** | heading |  | h2: 1.8 Assumptions this proposal rests on |
| C105 | decision.md:523 | 1.8 Assumptions this proposal rests on | decision-sec-1-8 | lead |  | lead: Each assumption is stated so that if one fails, the… |
| C106 | decision.md:527 | 1.8 Assumptions this proposal rests on | decision-sec-1-8 | paragraph |  | This proposal is built on the following assumptions. Each is… |
| C107 | decision.md:531 | 1.8 Assumptions this proposal rests on | decision-sec-1-8 | visual `cards` |  | visual `cards`: 1. The Wiper ticket is decided by a party-run countywide… |
| C108 | decision.md:562 | 1.9 How success will be judged | **decision-sec-1-9** | heading |  | h2: 1.9 How success will be judged |
| C109 | decision.md:564 | 1.9 How success will be judged | decision-sec-1-9 | paragraph |  | Success is judged on measures Firefly can observe on his… |
| C110 | decision.md:566 | 1.9 How success will be judged | decision-sec-1-9 | figure `fig-1-5-scorecard` |  | figure component `fig-1-5-scorecard` |
| C111 | decision.md:570 | 1.9 How success will be judged | decision-sec-1-9 | paragraph |  | The indicators themselves are set out in 5.1. |
| C112 | evidence.md:3 | 2.1 The electorate and the number it takes | **evidence-sec-2-1** | heading |  | h2: 2.1 The electorate and the number it takes |
| C113 | evidence.md:5 | 2.1 The electorate and the number it takes | evidence-sec-2-1 | lead |  | lead: Governor Julius Malombe's certified 2022 winning total was {result.2022.gov.malombe} votes;… |
| C114 | evidence.md:9 | 2.1 The electorate and the number it takes › The electorate | evidence-sec-2-1 | heading |  | h4: The electorate |
| C115 | evidence.md:11 | 2.1 The electorate and the number it takes › The electorate | evidence-sec-2-1 | visual `stats` |  | visual `stats`: registered voters, 2022 |
| C116 | evidence.md:39 | 2.1 The electorate and the number it takes › The electorate | evidence-sec-2-1 | figure `fig-2-1-register` |  | figure component `fig-2-1-register` |
| C117 | evidence.md:43 | 2.1 The electorate and the number it takes › The electorate | evidence-sec-2-1 | paragraph |  | The full 40-ward register, by constituency, is in Annex B.1. |
| C118 | evidence.md:45 | 2.1 The electorate and the number it takes › The number it takes | evidence-sec-2-1 | heading |  | h4: The number it takes |
| C119 | evidence.md:47 | 2.1 The electorate and the number it takes › The number it takes | evidence-sec-2-1 | list |  | list: Total Registered Electorate (July 2026, Tier 3, unconfirmed): {register.2026} voters… |
| C120 | evidence.md:66 | 2.1 The electorate and the number it takes › The number it takes | evidence-sec-2-1 | figure `fig-3-1-funnel` |  | figure component `fig-3-1-funnel` |
| C121 | evidence.md:70 | 2.2 How Kitui has voted | **evidence-sec-2-2** | heading |  | h2: 2.2 How Kitui has voted |
| C122 | evidence.md:72 | 2.2 How Kitui has voted | evidence-sec-2-2 | lead |  | lead: Julius Malombe won 2022 with {result.2022.gov.malombe} votes on a certified… |
| C123 | evidence.md:76 | 2.2 How Kitui has voted | evidence-sec-2-2 | list |  | list: 2013 General Election (Kitui Governor): This cycle represents a named… |
| C124 | evidence.md:83 | 2.2 How Kitui has voted | evidence-sec-2-2 | figure `fig-2-2-results` |  | figure component `fig-2-2-results` |
| C125 | evidence.md:87 | 2.3 Where the votes are | **evidence-sec-2-3** | heading |  | h2: 2.3 Where the votes are |
| C126 | evidence.md:89 | 2.3 Where the votes are | evidence-sec-2-3 | paragraph |  | Voter registration in Kitui County is highly concentrated. Rather than… |
| C127 | evidence.md:91 | 2.3 Where the votes are | evidence-sec-2-3 | figure `fig-3-2-register-map` |  | figure component `fig-3-2-register-map` |
| C128 | evidence.md:95 | 2.3 Where the votes are | evidence-sec-2-3 | visual `stats` |  | visual `stats`: Critical Concentration Insights |
| C129 | evidence.md:113 | 2.3 Where the votes are › 2.3.1 The constituencies that decide it | **evidence-sec-2-3-1** | heading |  | h3: 2.3.1 The constituencies that decide it |
| C130 | evidence.md:115 | 2.3 Where the votes are › 2.3.1 The constituencies that decide it | evidence-sec-2-3-1 | lead |  | lead: Mwingi North, Mwingi West and Mwingi Central together command {bloc.mwingi}… |
| C131 | evidence.md:119 | 2.3 Where the votes are › 2.3.1 The constituencies that decide it | evidence-sec-2-3-1 | paragraph |  | A constituency's structural importance is determined by its total voter… |
| C132 | evidence.md:121 | 2.3 Where the votes are › 2.3.1 The constituencies that decide it | evidence-sec-2-3-1 | figure `constituency-power` |  | figure component `constituency-power` |
| C133 | evidence.md:125 | 2.3 Where the votes are › 2.3.1 The constituencies that decide it › The Mwingi bloc: necessary, not sufficient | evidence-sec-2-3-1 | heading |  | h4: The Mwingi bloc: necessary, not sufficient |
| C134 | evidence.md:127 | 2.3 Where the votes are › 2.3.1 The constituencies that decide it › The Mwingi bloc: necessary, not sufficient | evidence-sec-2-3-1 | paragraph |  | A key strategic finding emerges from this integrated database: Mwingi… |
| C135 | evidence.md:129 | 2.3 Where the votes are › 2.3.1 The constituencies that decide it › Analytical Hierarchy: | evidence-sec-2-3-1 | heading |  | h4: Analytical Hierarchy: |
| C136 | evidence.md:130 | 2.3 Where the votes are › 2.3.1 The constituencies that decide it › Analytical Hierarchy: | evidence-sec-2-3-1 | list |  | list: 1. The "Big 4" Electorate Engine ({big4.share}% of County): Kitui… |
| C137 | evidence.md:134 | 2.4 Four routes to the number | **evidence-sec-2-4** | heading |  | h2: 2.4 Four routes to the number |
| C138 | evidence.md:136 | 2.4 Four routes to the number | evidence-sec-2-4 | lead |  | lead: No route clears {benchmark} on its own ballots. A route… |
| C139 | evidence.md:140 | 2.4 Four routes to the number | evidence-sec-2-4 | paragraph |  | Each route below is a combination of constituencies or wards,… |
| C140 | evidence.md:142 | 2.4 Four routes to the number | evidence-sec-2-4 | figure `fig-3-3-paths` |  | figure component `fig-3-3-paths` |
| C141 | evidence.md:146 | 2.4 Four routes to the number | evidence-sec-2-4 | textversion |  | text version: Path A: The Northern Mwingi Triad (The "Mwingi Bloc") Constituency… |
| C142 | evidence.md:186 | 2.5 The nomination rules and the calendar | **evidence-sec-2-5** | heading |  | h2: 2.5 The nomination rules and the calendar |
| C143 | evidence.md:188 | 2.5 The nomination rules and the calendar | evidence-sec-2-5 | figure `fig-2-3-nomination` |  | figure component `fig-2-3-nomination` |
| C144 | evidence.md:192 | 2.5 The nomination rules and the calendar › 2.5.1 How Wiper picks its candidate | **evidence-sec-2-5-1** | heading |  | h3: 2.5.1 How Wiper picks its candidate |
| C145 | evidence.md:194 | 2.5 The nomination rules and the calendar › 2.5.1 How Wiper picks its candidate | evidence-sec-2-5-1 | lead |  | lead: The Wiper decision is expected in the final quarter of… |
| C146 | evidence.md:198 | 2.5 The nomination rules and the calendar › 2.5.1 How Wiper picks its candidate | evidence-sec-2-5-1 | paragraph |  | The Wiper flagbearer decision is expected to be settled by… |
| C147 | evidence.md:200 | 2.5 The nomination rules and the calendar › 2.5.1 How Wiper picks its candidate | evidence-sec-2-5-1 | paragraph |  | Section 1.2 opened with the claim this entire Phase −1… |
| C148 | evidence.md:206 | 2.5 The nomination rules and the calendar › 2.5.1 How Wiper picks its candidate | evidence-sec-2-5-1 | paragraph |  | If it turns out to be wrong — if Wiper… |
| C149 | evidence.md:211 | 2.5 The nomination rules and the calendar › 2.5.1 How Wiper picks its candidate | evidence-sec-2-5-1 | paragraph |  | What the 2022 record shows, and what it does not.… |
| C150 | evidence.md:218 | 2.5 The nomination rules and the calendar › 2.5.2 Where the selection method stands | **evidence-sec-2-5-2** | heading |  | h3: 2.5.2 Where the selection method stands |
| C151 | evidence.md:220 | 2.5 The nomination rules and the calendar › 2.5.2 Where the selection method stands | evidence-sec-2-5-2 | callout |  | callout: The party's name changed in 2025. The Office of the… |
| C152 | evidence.md:225 | 2.5 The nomination rules and the calendar › 2.5.2 Where the selection method stands | evidence-sec-2-5-2 | paragraph |  | The strategic assumption that the Wiper Patriotic Front will select… |
| C153 | evidence.md:227 | 2.5 The nomination rules and the calendar › 2.5.2 Where the selection method stands | evidence-sec-2-5-2 | visual `checklist` |  | visual `checklist`: To transition this selection mechanism from a Tier 3 strategic… |
| C154 | evidence.md:236 | 2.6 The field: rivals and an open seat | **evidence-sec-2-6** | heading |  | h2: 2.6 The field: rivals and an open seat |
| C155 | evidence.md:238 | 2.6 The field: rivals and an open seat › What his rivals have already proven | evidence-sec-2-6 | heading |  | h4: What his rivals have already proven |
| C156 | evidence.md:240 | 2.6 The field: rivals and an open seat › What his rivals have already proven | evidence-sec-2-6 | paragraph |  | The 2027 gubernatorial race in Kitui features a highly competitive,… |
| C157 | evidence.md:242 | 2.6 The field: rivals and an open seat › What his rivals have already proven | evidence-sec-2-6 | figure `fig-3-5-field` |  | figure component `fig-3-5-field` |
| C158 | evidence.md:246 | 2.6 The field: rivals and an open seat › 2.6.1 Stage One: the Wiper nomination | **evidence-sec-2-6-1** | heading |  | h3: 2.6.1 Stage One: the Wiper nomination |
| C159 | evidence.md:248 | 2.6 The field: rivals and an open seat › 2.6.1 Stage One: the Wiper nomination | evidence-sec-2-6-1 | paragraph |  | Every attribute below is stated from an official or documentary… |
| C160 | evidence.md:250 | 2.6 The field: rivals and an open seat › 2.6.1 Stage One: the Wiper nomination | evidence-sec-2-6-1 | visual `cards` |  | visual `cards`: Dr. Irene Kasalu |
| C161 | evidence.md:271 | 2.6 The field: rivals and an open seat › 2.6.1 Stage One: the Wiper nomination | evidence-sec-2-6-1 | visual `cards` |  | visual `cards`: The two positions cannot both be run. |
| C162 | evidence.md:280 | 2.6 The field: rivals and an open seat › 2.6.1 Stage One: the Wiper nomination | evidence-sec-2-6-1 | paragraph |  | The party's 2027 nomination list is the document that settles… |
| C163 | evidence.md:282 | 2.6 The field: rivals and an open seat › 2.6.2 Stage Two: the general election field | **evidence-sec-2-6-2** | heading |  | h3: 2.6.2 Stage Two: the general election field |
| C164 | evidence.md:284 | 2.6 The field: rivals and an open seat › 2.6.2 Stage Two: the general election field | evidence-sec-2-6-2 | paragraph |  | Beyond the Wiper nomination, the general election field is stated… |
| C165 | evidence.md:286 | 2.6 The field: rivals and an open seat › 2.6.2 Stage Two: the general election field | evidence-sec-2-6-2 | visual `cards` |  | visual `cards`: Charity Ngilu |
| C166 | evidence.md:311 | 2.6 The field: rivals and an open seat › 2.6.3 The incumbent is term-limited: 2027 is an open seat | **evidence-sec-2-6-3** | heading |  | h3: 2.6.3 The incumbent is term-limited: 2027 is an open seat |
| C167 | evidence.md:313 | 2.6 The field: rivals and an open seat › 2.6.3 The incumbent is term-limited: 2027 is an open seat | evidence-sec-2-6-3 | lead |  | lead: Article 180(7) of the Constitution of Kenya limits a governor… |
| C168 | evidence.md:317 | 2.6 The field: rivals and an open seat › 2.6.3 The incumbent is term-limited: 2027 is an open seat | evidence-sec-2-6-3 | paragraph |  | Governor Malombe served as Governor from 2013 to 2017, lost… |
| C169 | evidence.md:319 | 2.6 The field: rivals and an open seat › 2.6.3 The incumbent is term-limited: 2027 is an open seat | evidence-sec-2-6-3 | list |  | list: Strategic consequence: the 2027 race has no incumbent. Malombe's incumbency… |
| C170 | evidence.md:321 | 2.6 The field: rivals and an open seat › 2.6.3 The incumbent is term-limited: 2027 is an open seat | evidence-sec-2-6-3 | list | keep | list: What would change it: only a court ruling or an… |
| C171 | evidence.md:323 | 2.6 The field: rivals and an open seat › 2.6.4 Reading the current field | **evidence-sec-2-6-4** | heading |  | h3: 2.6.4 Reading the current field |
| C172 | evidence.md:325 | 2.6 The field: rivals and an open seat › 2.6.4 Reading the current field | evidence-sec-2-6-4 | lead |  | lead: The strategic implication is not to compete for the same… |
| C173 | evidence.md:329 | 2.6 The field: rivals and an open seat › 2.6.4 Reading the current field | evidence-sec-2-6-4 | paragraph |  | Dr. Kasalu's strength, on the record, is a countywide seat… |
| C174 | evidence.md:343 | 2.7 Where he is known and where he isn't | **evidence-sec-2-7** | heading |  | h2: 2.7 Where he is known and where he isn't |
| C175 | evidence.md:346 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not | **evidence-sec-2-7-1** | heading |  | h3: 2.7.1 Where he has held office, and where he has… |
| C176 | evidence.md:348 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not | evidence-sec-2-7-1 | lead |  | lead: Five of the twelve largest wards lie where he has… |
| C177 | evidence.md:351 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not | evidence-sec-2-7-1 | list |  | list: Candidate Profile: Dr. Benson Makali Mulu has served as Member… |
| C178 | evidence.md:358 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not › Do the deficit wards overlap the decisive ones? | evidence-sec-2-7-1 | heading |  | h4: Do the deficit wards overlap the decisive ones? |
| C179 | evidence.md:359 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not › Do the deficit wards overlap the decisive ones? | evidence-sec-2-7-1 | paragraph |  | Partly. Five of the twelve largest wards lie where he… |
| C180 | evidence.md:361 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not › Do the deficit wards overlap the decisive ones? | evidence-sec-2-7-1 | paragraph |  | The denominator is the twelve largest wards (Section 2.3). The… |
| C181 | evidence.md:363 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not › Do the deficit wards overlap the decisive ones? | evidence-sec-2-7-1 | list |  | list: 1. Mwingi North: Kyuso ( 1 countywide, {ward.kyuso} ), Tseikuru… |
| C182 | evidence.md:366 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not › Do the deficit wards overlap the decisive ones? | evidence-sec-2-7-1 | paragraph |  | Together the five hold {pareto.top12.in-pool.voters} registered voters , {pareto.top12.in-pool.share}% of… |
| C183 | evidence.md:368 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not › Do the deficit wards overlap the decisive ones? | evidence-sec-2-7-1 | visual `stats` |  | visual `stats`: Total Decisive Deficit Pool |
| C184 | evidence.md:381 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not › Do the deficit wards overlap the decisive ones? | evidence-sec-2-7-1 | paragraph |  | This represents {pool.share}% of the entire Kitui County voter register… |
| C185 | evidence.md:383 | 2.7 Where he is known and where he isn't › 2.7.1 Where he has held office, and where he has not › Do the deficit wards overlap the decisive ones? | evidence-sec-2-7-1 | figure `fig-3-4-footprint` |  | figure component `fig-3-4-footprint` |
| C186 | evidence.md:387 | 2.7 Where he is known and where he isn't › 2.7.2 Where party loyalty won't carry him | **evidence-sec-2-7-2** | heading |  | h3: 2.7.2 Where party loyalty won't carry him |
| C187 | evidence.md:389 | 2.7 Where he is known and where he isn't › 2.7.2 Where party loyalty won't carry him | evidence-sec-2-7-2 | lead |  | lead: Kitui Central will be fighting its own contest. Two constituencies… |
| C188 | evidence.md:393 | 2.7 Where he is known and where he isn't › 2.7.2 Where party loyalty won't carry him | evidence-sec-2-7-2 | paragraph |  | Kitui Central will be fighting its own contest. Stephen Kilonzo… |
| C189 | evidence.md:402 | 2.7 Where he is known and where he isn't › 2.7.2 Where party loyalty won't carry him | evidence-sec-2-7-2 | paragraph |  | Two constituencies will not carry party flow. Kitui East returned… |
| C190 | evidence.md:410 | 2.7 Where he is known and where he isn't › 2.7.2 Where party loyalty won't carry him | evidence-sec-2-7-2 | figure `fig-3-6-party-flow` |  | figure component `fig-3-6-party-flow` |
| C191 | evidence.md:414 | 2.8 The county: people, budget and three regions | **evidence-sec-2-8** | heading |  | h2: 2.8 The county: people, budget and three regions |
| C192 | evidence.md:416 | 2.8 The county: people, budget and three regions › 2.8.1 The county's people and economy | **evidence-sec-2-8-1** | heading |  | h3: 2.8.1 The county's people and economy |
| C193 | evidence.md:418 | 2.8 The county: people, budget and three regions › 2.8.1 The county's people and economy | evidence-sec-2-8-1 | paragraph |  | Kitui County's vast physical and demographic characteristics define its developmental… |
| C194 | evidence.md:420 | 2.8 The county: people, budget and three regions › 2.8.1 The county's people and economy | evidence-sec-2-8-1 | visual `stats` |  | visual `stats`: people, 2019 census |
| C195 | evidence.md:449 | 2.8 The county: people, budget and three regions › 2.8.1 The county's people and economy | evidence-sec-2-8-1 | figure `fig-2-4-people` |  | figure component `fig-2-4-people` |
| C196 | evidence.md:453 | 2.8 The county: people, budget and three regions › 2.8.1 The county's people and economy | evidence-sec-2-8-1 | paragraph |  | Livelihoods and wealth (NDMA, July 2025, Tier 1). {livelihood.mixed}% of… |
| C197 | evidence.md:455 | 2.8 The county: people, budget and three regions › 2.8.1 The county's people and economy | evidence-sec-2-8-1 | visual `timeline` |  | visual `timeline`: Natural Hazards and NDMA Early-Warning Context |
| C198 | evidence.md:474 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs | **evidence-sec-2-8-2** | heading |  | h3: 2.8.2 The budget the next governor runs |
| C199 | evidence.md:476 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs | evidence-sec-2-8-2 | lead |  | lead: According to the approved Kitui County Fiscal Strategy Paper for… |
| C200 | evidence.md:480 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs | evidence-sec-2-8-2 | paragraph |  | The Governor of Kitui is the supreme executive authority of… |
| C201 | evidence.md:482 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs | evidence-sec-2-8-2 | visual `checklist` |  | visual `checklist`: Agriculture and Water Infrastructure |
| C202 | evidence.md:495 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs › Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper): | evidence-sec-2-8-2 | heading |  | h4: Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper): |
| C203 | evidence.md:496 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs › Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper): | evidence-sec-2-8-2 | paragraph |  | The county budget represents a significant administrative responsibility. According to… |
| C204 | evidence.md:497 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs › Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper): | evidence-sec-2-8-2 | list |  | list: Equitable Share: KSh 11.64 billion ({budget.equitable.share}% of the envelope) (Tier… |
| C205 | evidence.md:501 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs › Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper): | evidence-sec-2-8-2 | figure `fig-2-5-budget` |  | figure component `fig-2-5-budget` |
| C206 | evidence.md:505 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs › Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper): | evidence-sec-2-8-2 | paragraph |  | The three parts sum to KSh 13.80 billion against a… |
| C207 | evidence.md:507 | 2.8 The county: people, budget and three regions › 2.8.2 The budget the next governor runs › Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper): | evidence-sec-2-8-2 | paragraph |  | The Strategic Opportunity: This KSh 13.79 billion envelope represents the… |
| C208 | evidence.md:509 | 2.8 The county: people, budget and three regions › 2.8.3 The three regions | **evidence-sec-2-8-3** | heading |  | h3: 2.8.3 The three regions |
| C209 | evidence.md:511 | 2.8 The county: people, budget and three regions › 2.8.3 The three regions | evidence-sec-2-8-3 | paragraph |  | Kitui is not a monolith. Its eight constituencies and 18… |
| C210 | evidence.md:515 | 2.8 The county: people, budget and three regions › 2.8.3 The three regions | evidence-sec-2-8-3 | figure `fig-3-7-zones` |  | figure component `fig-3-7-zones` |
| C211 | evidence.md:519 | 2.8 The county: people, budget and three regions › 2.8.3 The three regions | evidence-sec-2-8-3 | visual `tabs` |  | visual `tabs`: The urban and central anchor: Kitui Central and Kitui West |
| C212 | evidence.md:532 | 2.9 How voters get information, and what each channel can reach | **evidence-sec-2-9** | heading |  | h2: 2.9 How voters get information, and what each channel can… |
| C213 | evidence.md:534 | 2.9 How voters get information, and what each channel can reach › 2.9.1 How people get information | **evidence-sec-2-9-1** | heading |  | h3: 2.9.1 How people get information |
| C214 | evidence.md:536 | 2.9 How voters get information, and what each channel can reach › 2.9.1 How people get information | evidence-sec-2-9-1 | visual `stats` |  | visual `stats`: The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced) |
| C215 | evidence.md:556 | 2.9 How voters get information, and what each channel can reach › 2.9.1 How people get information | evidence-sec-2-9-1 | table |  | table: Connectivity Metric Current Sourced Value (2023/24) 2019 Historical Baseline Sourced… |
| C216 | evidence.md:565 | 2.9 How voters get information, and what each channel can reach › 2.9.1 How people get information | evidence-sec-2-9-1 | paragraph |  | Two bases, never averaged. {ict.phone}% and {ict.internet}% are shares of… |
| C217 | evidence.md:567 | 2.9 How voters get information, and what each channel can reach › 2.9.1 How people get information | evidence-sec-2-9-1 | figure `fig-2-6-connectivity` |  | figure component `fig-2-6-connectivity` |
| C218 | evidence.md:571 | 2.9 How voters get information, and what each channel can reach › 2.9.1 How people get information › Platform Sizing & Realistic In-County Reach | evidence-sec-2-9-1 | heading |  | h4: Platform Sizing & Realistic In-County Reach |
| C219 | evidence.md:573 | 2.9 How voters get information, and what each channel can reach › 2.9.1 How people get information › Platform Sizing & Realistic In-County Reach | evidence-sec-2-9-1 | paragraph |  | The digital footprint in Kitui County is concentrated in urban… |
| C220 | evidence.md:575 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | **evidence-sec-2-9-2** | heading |  | h3: 2.9.2 Who owns the airwaves |
| C221 | evidence.md:577 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | evidence-sec-2-9-2 | lead |  | lead: The highest-reach commercial radio stations broadcasting in Kikamba are owned,… |
| C222 | evidence.md:581 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | evidence-sec-2-9-2 | paragraph |  | Vernacular radio is the primary medium of political consciousness and… |
| C223 | evidence.md:583 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | evidence-sec-2-9-2 | paragraph |  | To ensure uninterrupted, high-credibility communication with the electorate, the campaign… |
| C224 | evidence.md:585 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | evidence-sec-2-9-2 | figure `fig-2-7-media` |  | figure component `fig-2-7-media` |
| C225 | evidence.md:589 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | evidence-sec-2-9-2 | paragraph |  | The ownership map, the frequencies and the resulting campaign posture… |
| C226 | evidence.md:594 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | evidence-sec-2-9-2 | callout |  | callout: Research Integrity Note on Listenership Data: The published audience share… |
| C227 | evidence.md:597 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | evidence-sec-2-9-2 | visual `checklist` |  | visual `checklist`: The three structural facts that drive the rest of this… |
| C228 | evidence.md:609 | 2.9 How voters get information, and what each channel can reach › 2.9.2 Who owns the airwaves | evidence-sec-2-9-2 | paragraph |  | Ownership associations are publicly reported rather than certified, and media… |
| C229 | evidence.md:614 | 2.9 How voters get information, and what each channel can reach › 2.9.3 What each channel can physically reach | **evidence-sec-2-9-3** | heading |  | h3: 2.9.3 What each channel can physically reach |
| C230 | evidence.md:616 | 2.9 How voters get information, and what each channel can reach › 2.9.3 What each channel can physically reach | evidence-sec-2-9-3 | lead |  | lead: If the campaign reached 100% of every internet-connected voter in… |
| C231 | evidence.md:620 | 2.9 How voters get information, and what each channel can reach › 2.9.3 What each channel can physically reach | evidence-sec-2-9-3 | paragraph |  | According to the official CA/KNBS ICT report on the 2023/24… |
| C232 | evidence.md:622 | 2.9 How voters get information, and what each channel can reach › 2.9.3 What each channel can physically reach | evidence-sec-2-9-3 | figure `fig-3-8-ceiling` |  | figure component `fig-3-8-ceiling` |
| C233 | evidence.md:626 | 2.9 How voters get information, and what each channel can reach › 2.9.3 What each channel can physically reach | evidence-sec-2-9-3 | callout |  | callout: [!CRITICAL] STRATEGIC REALITY CHECK: THE DIGITAL CEILING If the campaign… |
| C234 | evidence.md:633 | 2.9 How voters get information, and what each channel can reach › 2.9.3 What each channel can physically reach | evidence-sec-2-9-3 | paragraph |  | The SMS and USSD layer reaches more voters than the… |
| C235 | evidence.md:635 | 2.9 How voters get information, and what each channel can reach › 2.9.3 What each channel can physically reach | evidence-sec-2-9-3 | visual `contrast` |  | visual `contrast`: What digital can do |
| C236 | evidence.md:657 | 2.9 How voters get information, and what each channel can reach › 2.9.4 The offline majority, and the infrastructure that reaches it | **evidence-sec-2-9-4** | heading |  | h3: 2.9.4 The offline majority, and the infrastructure that reaches it |
| C237 | evidence.md:659 | 2.9 How voters get information, and what each channel can reach › 2.9.4 The offline majority, and the infrastructure that reaches it | evidence-sec-2-9-4 | lead |  | lead: The election will be won or lost across the {reach.offline}… |
| C238 | evidence.md:664 | 2.9 How voters get information, and what each channel can reach › 2.9.4 The offline majority, and the infrastructure that reaches it | evidence-sec-2-9-4 | paragraph |  | The election will be won or lost across the {reach.offline}… |
| C239 | evidence.md:666 | 2.9 How voters get information, and what each channel can reach › 2.9.4 The offline majority, and the infrastructure that reaches it | evidence-sec-2-9-4 | visual `cards` |  | visual `cards`: Kikamba Vernacular Radio (The Decisive Broadcast Medium) |
| C240 | evidence.md:693 | 2.9 How voters get information, and what each channel can reach › 2.9.4 The offline majority, and the infrastructure that reaches it | evidence-sec-2-9-4 | visual `week` |  | visual `week`: Market Rotation Map |
| C241 | evidence.md:723 | 2.10 His record and his channels today | **evidence-sec-2-10** | heading |  | h2: 2.10 His record and his channels today |
| C242 | evidence.md:725 | 2.10 His record and his channels today › 2.10.1 Dr. Mulu's public record | **evidence-sec-2-10-1** | heading |  | h3: 2.10.1 Dr. Mulu's public record |
| C243 | evidence.md:727 | 2.10 His record and his channels today › 2.10.1 Dr. Mulu's public record | evidence-sec-2-10-1 | lead |  | lead: Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS, has represented… |
| C244 | evidence.md:731 | 2.10 His record and his channels today › 2.10.1 Dr. Mulu's public record | evidence-sec-2-10-1 | paragraph |  | Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS, has represented… |
| C245 | evidence.md:733 | 2.10 His record and his channels today › 2.10.1 Dr. Mulu's public record | evidence-sec-2-10-1 | figure `fig-2-8-record` |  | figure component `fig-2-8-record` |
| C246 | evidence.md:737 | 2.10 His record and his channels today › 2.10.1 Dr. Mulu's public record | evidence-sec-2-10-1 | table |  | table: Asset Sourced Empirical Evidence Strategic Digital Application |
| C247 | evidence.md:746 | 2.10 His record and his channels today › 2.10.1 Dr. Mulu's public record | evidence-sec-2-10-1 | paragraph |  | The NG-CDF record, and its limits. The constituency's NG-CDF site… |
| C248 | evidence.md:752 | 2.10 His record and his channels today › 2.10.2 His channels today, and his rivals' | **evidence-sec-2-10-2** | heading |  | h3: 2.10.2 His channels today, and his rivals' |
| C249 | evidence.md:754 | 2.10 His record and his channels today › 2.10.2 His channels today, and his rivals' | evidence-sec-2-10-2 | figure `fig-2-9-channels` |  | figure component `fig-2-9-channels` |
| C250 | evidence.md:758 | 2.10 His record and his channels today › 2.10.2 His channels today, and his rivals' | evidence-sec-2-10-2 | paragraph |  | The NG-CDF site is the most under-used asset in this… |
| C251 | evidence.md:763 | 2.10 His record and his channels today › 2.10.3 What his current presence shows | **evidence-sec-2-10-3** | heading |  | h3: 2.10.3 What his current presence shows |
| C252 | evidence.md:765 | 2.10 His record and his channels today › 2.10.3 What his current presence shows | evidence-sec-2-10-3 | paragraph |  | These come from the profile as displayed, and finding them… |
| C253 | evidence.md:769 | 2.10 His record and his channels today › 2.10.3 What his current presence shows | evidence-sec-2-10-3 | figure `fig-3-9-audit` |  | figure component `fig-3-9-audit` |
| C254 | evidence.md:773 | 2.10 His record and his channels today › 2.10.3 What his current presence shows | evidence-sec-2-10-3 | visual `cards` |  | visual `cards`: What the audit produces |
| C255 | evidence.md:793 | 2.10 His record and his channels today › 2.10.3 What his current presence shows | evidence-sec-2-10-3 | paragraph |  | Each is drawn from the Week 1 export, never from… |
| C256 | evidence.md:796 | 2.11 What the data can't yet tell us | **evidence-sec-2-11** | heading |  | h2: 2.11 What the data can't yet tell us |
| C257 | evidence.md:798 | 2.11 What the data can't yet tell us | evidence-sec-2-11 | paragraph |  | In strict adherence to the campaign's data provenance standards, the… |
| C258 | evidence.md:800 | 2.11 What the data can't yet tell us | evidence-sec-2-11 | list |  | list: 1. Ward-level voter preference: Not measured, and not sought. This… |
| C259 | evidence.md:804 | 2.11 What the data can't yet tell us | evidence-sec-2-11 | figure `fig-3-10-gaps` |  | figure component `fig-3-10-gaps` |
| C260 | evidence.md:810 | 2.11 What the data can't yet tell us | evidence-sec-2-11 | paragraph |  | Three segment sizes in Section 3.4 are not published by… |
| C261 | evidence.md:812 | 2.12 The diagnosis, and the evidence that could overturn it | **evidence-sec-2-12** | heading |  | h2: 2.12 The diagnosis, and the evidence that could overturn it |
| C262 | evidence.md:814 | 2.12 The diagnosis, and the evidence that could overturn it | evidence-sec-2-12 | visual `hypothesis` |  | visual `hypothesis`: Dr. Mulu's gap is substantially a geography-of-recognition problem concentrated outside… |
| C263 | evidence.md:823 | 2.12 The diagnosis, and the evidence that could overturn it | evidence-sec-2-12 | figure `fig-3-11-evidence` |  | figure component `fig-3-11-evidence` |
| C264 | strategy.md:3 | 3.1 The position | **strategy-sec-3-1** | heading |  | h2: 3.1 The position |
| C265 | strategy.md:5 | 3.1 The position | strategy-sec-3-1 | lead |  | lead: Dr. Makali Mulu is the Economist Governor Kitui needs :… |
| C266 | strategy.md:9 | 3.1 The position | strategy-sec-3-1 | paragraph |  | Because Section 2.6: both Wiper Patriotic Front rivals have already… |
| C267 | strategy.md:11 | 3.1 The position | strategy-sec-3-1 | paragraph |  | The core narrative of the campaign: Dr. Makali Mulu is… |
| C268 | strategy.md:14 | 3.1 The position | strategy-sec-3-1 | paragraph |  | Parliamentary and professional records document his extensive credentials as a… |
| C269 | strategy.md:16 | 3.1 The position | strategy-sec-3-1 | paragraph |  | Dr. Mulu is not merely an economist; he is a… |
| C270 | strategy.md:20 | 3.1 The position › 3.1.1 The evidence behind the claim | **strategy-sec-3-1-1** | heading |  | h3: 3.1.1 The evidence behind the claim |
| C271 | strategy.md:22 | 3.1 The position › 3.1.1 The evidence behind the claim | strategy-sec-3-1-1 | lead |  | lead: Dr. Mulu's technocratic and delivery credentials are backed by verified,… |
| C272 | strategy.md:26 | 3.1 The position › 3.1.1 The evidence behind the claim | strategy-sec-3-1-1 | paragraph |  | Dr. Mulu's technocratic and delivery credentials are not abstract campaign… |
| C273 | strategy.md:27 | 3.1 The position › 3.1.1 The evidence behind the claim | strategy-sec-3-1-1 | list |  | list: The National Budget Seat: Sourced legislative records confirm Dr. Mulu's… |
| C274 | strategy.md:32 | 3.1 The position › 3.1.2 The resource paradox | **strategy-sec-3-1-2** | heading |  | h3: 3.1.2 The resource paradox |
| C275 | strategy.md:34 | 3.1 The position › 3.1.2 The resource paradox | strategy-sec-3-1-2 | lead |  | lead: Kitui has ample developmental resources; what it lacks is disciplined,… |
| C276 | strategy.md:38 | 3.1 The position › 3.1.2 The resource paradox | strategy-sec-3-1-2 | paragraph |  | The campaign's primary argument is anchored in a documented, structural… |
| C277 | strategy.md:40 | 3.1 The position › 3.1.2 The resource paradox | strategy-sec-3-1-2 | paragraph |  | According to the approved Kitui County Fiscal Strategy Paper for… |
| C278 | strategy.md:41 | 3.1 The position › 3.1.2 The resource paradox | strategy-sec-3-1-2 | visual `bars` |  | visual `bars`: unconfirmed, highly volatile cash balances |
| C279 | strategy.md:59 | 3.1 The position › 3.1.2 The resource paradox | strategy-sec-3-1-2 | paragraph |  | Furthermore, Controller of Budget reports reveal that the county carries… |
| C280 | strategy.md:61 | 3.1 The position › 3.1.3 Answering the charge that discipline is cold | **strategy-sec-3-1-3** | heading |  | h3: 3.1.3 Answering the charge that discipline is cold |
| C281 | strategy.md:63 | 3.1 The position › 3.1.3 Answering the charge that discipline is cold | strategy-sec-3-1-3 | paragraph |  | Competitors will seek to weaponize Dr. Mulu's technocratic and economic… |
| C282 | strategy.md:64 | 3.1 The position › 3.1.3 Answering the charge that discipline is cold | strategy-sec-3-1-3 | visual `qa` |  | visual `qa`: "Dr. Mulu is a cold, distant, Nairobi-facing intellectual who spends… |
| C283 | strategy.md:71 | 3.2 The pillar architecture | **strategy-sec-3-2** | heading |  | h2: 3.2 The pillar architecture |
| C284 | strategy.md:73 | 3.2 The pillar architecture | strategy-sec-3-2 | lead |  | lead: These four are the campaign's pillars. Three other groupings appear… |
| C285 | strategy.md:77 | 3.2 The pillar architecture | strategy-sec-3-2 | paragraph |  | Four pillars, extended from the original three. These four are… |
| C286 | strategy.md:84 | 3.2 The pillar architecture | strategy-sec-3-2 | visual `crosswalk` |  | visual `crosswalk`: Four campaign pillars, and the groupings that carry them |
| C287 | strategy.md:97 | 3.2 The pillar architecture › 3.2.1 Campaign pillars | **strategy-sec-3-2-1** | heading |  | h3: 3.2.1 Campaign pillars |
| C288 | strategy.md:99 | 3.2 The pillar architecture › 3.2.1 Campaign pillars | strategy-sec-3-2-1 | lead |  | lead: "The mission is for Kitui to prosper. From Poverty to… |
| C289 | strategy.md:103 | 3.2 The pillar architecture › 3.2.1 Campaign pillars › The four strategic pillars | strategy-sec-3-2-1 | heading |  | h4: The four strategic pillars |
| C290 | strategy.md:105 | 3.2 The pillar architecture › 3.2.1 Campaign pillars › The four strategic pillars | strategy-sec-3-2-1 | paragraph |  | "The mission is for Kitui to prosper. From Poverty to… |
| C291 | strategy.md:109 | 3.2 The pillar architecture › 3.2.1 Campaign pillars › The four campaign pillars in practice | strategy-sec-3-2-1 | heading |  | h4: The four campaign pillars in practice |
| C292 | strategy.md:111 | 3.2 The pillar architecture › 3.2.1 Campaign pillars › The four campaign pillars in practice | strategy-sec-3-2-1 | visual `cards` |  | visual `cards`: Fiscal accountability and devolution |
| C293 | strategy.md:131 | 3.2 The pillar architecture › 3.2.1 Campaign pillars › The four campaign pillars in practice | strategy-sec-3-2-1 | figure `fig-4-1-message-house` |  | figure component `fig-4-1-message-house` |
| C294 | strategy.md:135 | 3.2 The pillar architecture › 3.2.2 The central claim and its three pillars | **strategy-sec-3-2-2** | heading |  | h3: 3.2.2 The central claim and its three pillars |
| C295 | strategy.md:136 | 3.2 The pillar architecture › 3.2.2 The central claim and its three pillars | strategy-sec-3-2-2 | visual `cards` |  | visual `cards`: Message Pillar 1: Fiscal Integrity & Transparent Public Finance (carries… |
| C296 | strategy.md:161 | 3.2 The pillar architecture › 3.2.2 The central claim and its three pillars | strategy-sec-3-2-2 | visual `bars` |  | visual `bars`: What the two flagship commitments would take from the county… |
| C297 | strategy.md:173 | 3.2 The pillar architecture › 3.2.2 The central claim and its three pillars | strategy-sec-3-2-2 | callout |  | callout: Message assignment by segment (C.1) and by channel (C.2) is… |
| C298 | strategy.md:177 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | **strategy-sec-3-2-3** | heading |  | h3: 3.2.3 Production pillars and the visit-to-verification loop |
| C299 | strategy.md:179 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | strategy-sec-3-2-3 | lead |  | lead: The engine is the loop between pillar four and pillar… |
| C300 | strategy.md:183 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | strategy-sec-3-2-3 | paragraph |  | "The mission is for Kitui to prosper. From Poverty to… |
| C301 | strategy.md:187 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | strategy-sec-3-2-3 | paragraph |  | These are the production pillars : what the team makes,… |
| C302 | strategy.md:192 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | strategy-sec-3-2-3 | paragraph |  | The Kikamba name for each pillar comes from the native-speaker… |
| C303 | strategy.md:195 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | strategy-sec-3-2-3 | visual `matrix` |  | visual `matrix`:  |
| C304 | strategy.md:209 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | strategy-sec-3-2-3 | paragraph |  | The engine is the loop between pillar four and pillar… |
| C305 | strategy.md:212 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | strategy-sec-3-2-3 | figure `visit-loop` |  | figure component `visit-loop` |
| C306 | strategy.md:216 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop | strategy-sec-3-2-3 | paragraph |  | A commitment with no date is not logged. A date… |
| C307 | strategy.md:219 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop › The four content pillars | strategy-sec-3-2-3 | heading |  | h4: The four content pillars |
| C308 | strategy.md:221 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop › The four content pillars | strategy-sec-3-2-3 | callout |  | callout: Section 3.7 is the live version of this list. The… |
| C309 | strategy.md:225 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop › The four content pillars | strategy-sec-3-2-3 | paragraph |  | Production buckets, not a restatement of the campaign pillars in… |
| C310 | strategy.md:229 | 3.2 The pillar architecture › 3.2.3 Production pillars and the visit-to-verification loop › The four content pillars | strategy-sec-3-2-3 | visual `cards` |  | visual `cards`: Pillar A: The Integrity & Stewardship Ledger ( Kĩtĩo kya… |
| C311 | strategy.md:255 | 3.2 The pillar architecture › 3.2.4 The six campaign themes | **strategy-sec-3-2-4** | heading |  | h3: 3.2.4 The six campaign themes |
| C312 | strategy.md:257 | 3.2 The pillar architecture › 3.2.4 The six campaign themes | strategy-sec-3-2-4 | lead |  | lead: Six themes, each evidenced. Every figure below carries the tier… |
| C313 | strategy.md:261 | 3.2 The pillar architecture › 3.2.4 The six campaign themes | strategy-sec-3-2-4 | paragraph |  | Six themes, each evidenced. Every figure below carries the tier… |
| C314 | strategy.md:263 | 3.2 The pillar architecture › 3.2.4 The six campaign themes | strategy-sec-3-2-4 | visual `cards` |  | visual `cards`: Water Security and Climate Resilience |
| C315 | strategy.md:304 | 3.2 The pillar architecture › 3.2.4 The six campaign themes | strategy-sec-3-2-4 | paragraph |  | A further theme the evidence now supports: security and resource… |
| C316 | strategy.md:306 | 3.2 The pillar architecture › 3.2.4 The six campaign themes | strategy-sec-3-2-4 | paragraph |  | Underlying narrative throughout: "Kitui has resources. What it has lacked… |
| C317 | strategy.md:310 | 3.3 Where the effort goes, and which channel does which job | **strategy-sec-3-3** | heading |  | h2: 3.3 Where the effort goes, and which channel does which… |
| C318 | strategy.md:312 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes | **strategy-sec-3-3-1** | heading |  | h3: 3.3.1 Where the effort goes |
| C319 | strategy.md:314 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes | strategy-sec-3-3-1 | lead |  | lead: Because {pool.share}% of the county register sits where he has… |
| C320 | strategy.md:317 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | heading |  | h4: The weighting, and the finding it answers |
| C321 | strategy.md:318 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | paragraph |  | Because {pool.share}% of the county register sits where he has… |
| C322 | strategy.md:319 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | visual `stats` |  | visual `stats`: of Phase −1 digital reach effort, in the pool |
| C323 | strategy.md:330 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | list |  | list: The "Economist Governor" messaging in these wards must emphasize countywide… |
| C324 | strategy.md:333 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | paragraph |  | Where the voters are, and where the need is most… |
| C325 | strategy.md:336 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | lead |  | lead: Until the six are assigned, the Phase −1 weighting governs… |
| C326 | strategy.md:340 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | paragraph |  | Coverage note. The three zones above total {zones.population} residents —… |
| C327 | strategy.md:348 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | figure `fig-4-2-effort` |  | figure component `fig-4-2-effort` |
| C328 | strategy.md:352 | 3.3 Where the effort goes, and which channel does which job › 3.3.1 Where the effort goes › The weighting, and the finding it answers | strategy-sec-3-3-1 | paragraph |  | Phase −1 deliberately over-indexes on Mwingi and the arid belt… |
| C329 | strategy.md:358 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | **strategy-sec-3-3-2** | heading |  | h3: 3.3.2 Which channel does which job |
| C330 | strategy.md:360 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | strategy-sec-3-3-2 | lead |  | lead: The rebalancing target is the share of communications effort each… |
| C331 | strategy.md:364 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | strategy-sec-3-3-2 | paragraph |  | Because Section 2.9.3: digital alone reaches about {reach.smartphone} voters at… |
| C332 | strategy.md:366 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | strategy-sec-3-3-2 | paragraph |  | The table below is the rebalancing target — the direction… |
| C333 | strategy.md:371 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | strategy-sec-3-3-2 | figure `fig-4-6-channel-shift` |  | figure component `fig-4-6-channel-shift` |
| C334 | strategy.md:375 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | strategy-sec-3-3-2 | visual `donut` |  | visual `donut`: Communications weight, offline |
| C335 | strategy.md:385 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | strategy-sec-3-3-2 | paragraph |  | §3.3.2 in one view. |
| C336 | strategy.md:387 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | strategy-sec-3-3-2 | table |  | table: Figure |
| C337 | strategy.md:396 | 3.3 Where the effort goes, and which channel does which job › 3.3.2 Which channel does which job | strategy-sec-3-3-2 | paragraph |  | The {channel.offline.rebalanced}/{channel.digital.rebalanced} weighting stands on the 2023/24 rate. It was… |
| C338 | strategy.md:404 | 3.3 Where the effort goes, and which channel does which job › 3.3.3 The gatekeeper bottleneck | **strategy-sec-3-3-3** | heading |  | h3: 3.3.3 The gatekeeper bottleneck |
| C339 | strategy.md:406 | 3.3 Where the effort goes, and which channel does which job › 3.3.3 The gatekeeper bottleneck | strategy-sec-3-3-3 | paragraph |  | The political economy of Kamba broadcasting presents three structural hazards… |
| C340 | strategy.md:407 | 3.3 Where the effort goes, and which channel does which job › 3.3.3 The gatekeeper bottleneck | strategy-sec-3-3-3 | visual `cards` |  | visual `cards`: Editorial Blackouts on Key Milestones |
| C341 | strategy.md:419 | 3.4 Who we are trying to move | **strategy-sec-3-4** | heading |  | h2: 3.4 Who we are trying to move |
| C342 | strategy.md:421 | 3.4 Who we are trying to move | strategy-sec-3-4 | paragraph |  | Because Section 2.8.3: the three regions differ in economy, connectivity… |
| C343 | strategy.md:423 | 3.4 Who we are trying to move | strategy-sec-3-4 | figure `audience-overview` |  | figure component `audience-overview` |
| C344 | strategy.md:427 | 3.4 Who we are trying to move › 3.4.1 The universes: voter, turnout, victory, base, persuasion, mobilisation | **strategy-sec-3-4-1** | heading |  | h3: 3.4.1 The universes: voter, turnout, victory, base, persuasion, mobilisation |
| C345 | strategy.md:429 | 3.4 Who we are trying to move › 3.4.1 The universes: voter, turnout, victory, base, persuasion, mobilisation | strategy-sec-3-4-1 | lead |  | lead: Segments say where to speak and in what language; universes… |
| C346 | strategy.md:433 | 3.4 Who we are trying to move › 3.4.1 The universes: voter, turnout, victory, base, persuasion, mobilisation | strategy-sec-3-4-1 | paragraph |  | The six segments below describe who the voters are. This… |
| C347 | strategy.md:438 | 3.4 Who we are trying to move › 3.4.1 The universes: voter, turnout, victory, base, persuasion, mobilisation | strategy-sec-3-4-1 | visual `nested` |  | visual `nested`: Voter universe |
| C348 | strategy.md:455 | 3.4 Who we are trying to move › 3.4.1 The universes: voter, turnout, victory, base, persuasion, mobilisation | strategy-sec-3-4-1 | paragraph |  | No official source reports ward-level recognition or support (Section 2.11).… |
| C349 | strategy.md:464 | 3.4 Who we are trying to move › 3.4.2 The six voter segments | **strategy-sec-3-4-2** | heading |  | h3: 3.4.2 The six voter segments |
| C350 | strategy.md:466 | 3.4 Who we are trying to move › 3.4.2 The six voter segments | strategy-sec-3-4-2 | lead |  | lead: Each segment carries the production pillar that commissions for it… |
| C351 | strategy.md:470 | 3.4 Who we are trying to move › 3.4.2 The six voter segments | strategy-sec-3-4-2 | paragraph |  | Each segment carries the production pillar that commissions for it… |
| C352 | strategy.md:473 | 3.4 Who we are trying to move › 3.4.2 The six voter segments | strategy-sec-3-4-2 | paragraph |  | P4 — He came, and this is what he said… |
| C353 | strategy.md:477 | 3.4 Who we are trying to move › 3.4.2 The six voter segments | strategy-sec-3-4-2 | paragraph |  | Where an official indicator bears on it — drought and… |
| C354 | strategy.md:484 | 3.4 Who we are trying to move › 3.4.2 The six voter segments | strategy-sec-3-4-2 | paragraph |  | A segment that runs across the six: women, the household… |
| C355 | strategy.md:486 | 3.4 Who we are trying to move › 3.4.2 The six voter segments | strategy-sec-3-4-2 | visual `tabs` |  | visual `tabs`: The Rural Agrarian & Smallholder Baseline |
| C356 | strategy.md:554 | 3.4 Who we are trying to move › 3.4.3 Segment sizing, and the evidence for it | **strategy-sec-3-4-3** | heading |  | h3: 3.4.3 Segment sizing, and the evidence for it |
| C357 | strategy.md:556 | 3.4 Who we are trying to move › 3.4.3 Segment sizing, and the evidence for it | strategy-sec-3-4-3 | lead |  | lead: These six segments overlap, and the figures below are not… |
| C358 | strategy.md:560 | 3.4 Who we are trying to move › 3.4.3 Segment sizing, and the evidence for it | strategy-sec-3-4-3 | paragraph |  | These six segments overlap, and the figures below are not… |
| C359 | strategy.md:566 | 3.4 Who we are trying to move › 3.4.3 Segment sizing, and the evidence for it | strategy-sec-3-4-3 | paragraph |  | Check the base before quoting any percentage here. Two denominators… |
| C360 | strategy.md:572 | 3.4 Who we are trying to move › 3.4.3 Segment sizing, and the evidence for it | strategy-sec-3-4-3 | figure `fig-4-3-segments` |  | figure component `fig-4-3-segments` |
| C361 | strategy.md:579 | 3.5 What we say, and in which language | **strategy-sec-3-5** | heading |  | h2: 3.5 What we say, and in which language |
| C362 | strategy.md:581 | 3.5 What we say, and in which language | strategy-sec-3-5 | lead |  | lead: Under the campaign's Provenance Discipline (Section A.1.1), no claim is… |
| C363 | strategy.md:585 | 3.5 What we say, and in which language | strategy-sec-3-5 | paragraph |  | Because Sections 2.8.3 and 2.9.1: the three regions differ, and… |
| C364 | strategy.md:587 | 3.5 What we say, and in which language | strategy-sec-3-5 | paragraph |  | Under the campaign's Provenance Discipline (Section A.1.1), no claim is… |
| C365 | strategy.md:590 | 3.5 What we say, and in which language | strategy-sec-3-5 | paragraph |  | The incumbent's slogan already claims resources. The county scorecard runs… |
| C366 | strategy.md:591 | 3.5 What we say, and in which language | strategy-sec-3-5 | figure `fig-4-4-message-region` |  | figure component `fig-4-4-message-region` |
| C367 | strategy.md:595 | 3.5 What we say, and in which language › 3.5.1 Counter-messaging against disinformation | **strategy-sec-3-5-1** | heading |  | h3: 3.5.1 Counter-messaging against disinformation |
| C368 | strategy.md:597 | 3.5 What we say, and in which language › 3.5.1 Counter-messaging against disinformation | strategy-sec-3-5-1 | figure `counter-fire` |  | figure component `counter-fire` |
| C369 | strategy.md:604 | 3.5 What we say, and in which language › 3.5.2 Persuasion principles and message discipline | **strategy-sec-3-5-2** | heading |  | h3: 3.5.2 Persuasion principles and message discipline |
| C370 | strategy.md:605 | 3.5 What we say, and in which language › 3.5.2 Persuasion principles and message discipline › Framing true claims, transparently | strategy-sec-3-5-2 | heading |  | h4: Framing true claims, transparently |
| C371 | strategy.md:607 | 3.5 What we say, and in which language › 3.5.2 Persuasion principles and message discipline › Framing true claims, transparently | strategy-sec-3-5-2 | paragraph |  | The campaign applies behavioural economics to make every message psychologically… |
| C372 | strategy.md:612 | 3.5 What we say, and in which language › 3.5.2 Persuasion principles and message discipline › Framing true claims, transparently | strategy-sec-3-5-2 | paragraph | keep | Boundary. These are framing techniques applied to true claims ,… |
| C373 | strategy.md:617 | 3.5 What we say, and in which language › 3.5.2 Persuasion principles and message discipline › The principles we apply | strategy-sec-3-5-2 | heading |  | h4: The principles we apply |
| C374 | strategy.md:619 | 3.5 What we say, and in which language › 3.5.2 Persuasion principles and message discipline › The principles we apply | strategy-sec-3-5-2 | visual `cards` |  | visual `cards`: Loss aversion |
| C375 | strategy.md:657 | 3.5 What we say, and in which language › 3.5.2 Persuasion principles and message discipline › The principles we apply | strategy-sec-3-5-2 | paragraph |  | The final row is the campaign's signature move. It converts… |
| C376 | strategy.md:660 | 3.5 What we say, and in which language › 3.5.3 Framing, worked through in examples | **strategy-sec-3-5-3** | heading |  | h3: 3.5.3 Framing, worked through in examples |
| C377 | strategy.md:662 | 3.5 What we say, and in which language › 3.5.3 Framing, worked through in examples | strategy-sec-3-5-3 | visual `tabs` |  | visual `tabs`: Water scarcity |
| C378 | strategy.md:704 | 3.6 Language, register and dialect | **strategy-sec-3-6** | heading |  | h2: 3.6 Language, register and dialect |
| C379 | strategy.md:706 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | **strategy-sec-3-6-1** | heading |  | h3: 3.6.1 Which language reaches which voters, on which channel |
| C380 | strategy.md:708 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | lead |  | lead: While English functions as the language of statutory policy and… |
| C381 | strategy.md:712 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | paragraph |  | Kitui County is a deeply multilingual electoral ecosystem. While English… |
| C382 | strategy.md:714 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | paragraph |  | A flawed translation—or an urban, anglicized phrasing of a traditional… |
| C383 | strategy.md:716 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | figure `language-map` |  | figure component `language-map` |
| C384 | strategy.md:721 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | paragraph | keep | [conflict C1] [conflict C2] |
| C385 | strategy.md:723 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | paragraph |  | Language is central to trust in Kitui. |
| C386 | strategy.md:725 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | list |  | list: Kikamba — deep local resonance, especially on WhatsApp, TikTok, Facebook,… |
| C387 | strategy.md:732 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | visual `donut` |  | visual `donut`: Content mix for locally facing platforms |
| C388 | strategy.md:747 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel | strategy-sec-3-6-1 | visual `cards` |  | visual `cards`: "Kĩtui nĩ yethu, tũtethanĩe " |
| C389 | strategy.md:764 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel › Channel-by-language deployment | strategy-sec-3-6-1 | heading |  | h4: Channel-by-language deployment |
| C390 | strategy.md:766 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel › Channel-by-language deployment | strategy-sec-3-6-1 | figure `language-deployment` |  | figure component `language-deployment` |
| C391 | strategy.md:770 | 3.6 Language, register and dialect › 3.6.1 Which language reaches which voters, on which channel › Channel-by-language deployment | strategy-sec-3-6-1 | paragraph |  | [conflict C1] |
| C392 | strategy.md:772 | 3.6 Language, register and dialect › 3.6.2 Register, dialect and the discipline it takes | **strategy-sec-3-6-2** | heading |  | h3: 3.6.2 Register, dialect and the discipline it takes |
| C393 | strategy.md:774 | 3.6 Language, register and dialect › 3.6.2 Register, dialect and the discipline it takes | strategy-sec-3-6-2 | paragraph |  | Translating political concepts from statutory English into vernacular Kikamba requires… |
| C394 | strategy.md:776 | 3.6 Language, register and dialect › 3.6.2 Register, dialect and the discipline it takes | strategy-sec-3-6-2 | figure `cultural-registers` |  | figure component `cultural-registers` |
| C395 | strategy.md:780 | 3.6 Language, register and dialect › 3.6.2 Register, dialect and the discipline it takes | strategy-sec-3-6-2 | visual `cards` |  | visual `cards`: Linguistic Rules of Engagement |
| C396 | strategy.md:794 | 3.6 Language, register and dialect › 3.6.3 The production and quality-control pipeline | **strategy-sec-3-6-3** | heading |  | h3: 3.6.3 The production and quality-control pipeline |
| C397 | strategy.md:796 | 3.6 Language, register and dialect › 3.6.3 The production and quality-control pipeline | strategy-sec-3-6-3 | paragraph |  | The campaign implements a Translation & Quality-Control Gateway : |
| C398 | strategy.md:798 | 3.6 Language, register and dialect › 3.6.3 The production and quality-control pipeline | strategy-sec-3-6-3 | figure `qc-gateway` |  | figure component `qc-gateway` |
| C399 | strategy.md:802 | 3.7 A week of publishing, before and after | **strategy-sec-3-7** | heading |  | h2: 3.7 A week of publishing, before and after |
| C400 | strategy.md:804 | 3.7 A week of publishing, before and after | strategy-sec-3-7 | paragraph |  | Because Section 2.7: {pool.share}% of the register lives where he… |
| C401 | strategy.md:806 | 3.7 A week of publishing, before and after › One week, before and after | strategy-sec-3-7 | heading |  | h4: One week, before and after |
| C402 | strategy.md:808 | 3.7 A week of publishing, before and after › One week, before and after | strategy-sec-3-7 | paragraph |  | Same week. Same events. Same team. Different structure. |
| C403 | strategy.md:810 | 3.7 A week of publishing, before and after › One week, before and after | strategy-sec-3-7 | paragraph |  | The pattern below is the current one as observed from… |
| C404 | strategy.md:814 | 3.7 A week of publishing, before and after › One week, before and after | strategy-sec-3-7 | figure `fig-4-5-calendar` |  | figure component `fig-4-5-calendar` |
| C405 | strategy.md:818 | 3.7 A week of publishing, before and after › One week, before and after | strategy-sec-3-7 | paragraph |  | Two rules on top. At least two of the seven… |
| C406 | strategy.md:822 | 3.7 A week of publishing, before and after › One week, before and after | strategy-sec-3-7 | visual `contrast` |  | visual `contrast`: What changed |
| C407 | strategy.md:834 | 3.8 When the plan changes | **strategy-sec-3-8** | heading |  | h2: 3.8 When the plan changes |
| C408 | strategy.md:836 | 3.8 When the plan changes | strategy-sec-3-8 | paragraph |  | Because Section 2.12: the diagnosis is a hypothesis, and Week… |
| C409 | strategy.md:838 | 3.8 When the plan changes | strategy-sec-3-8 | paragraph |  | Stated as decision rules in advance, so the audit cannot… |
| C410 | strategy.md:841 | 3.8 When the plan changes | strategy-sec-3-8 | figure `fig-4-8-decision-rules` |  | figure component `fig-4-8-decision-rules` |
| C411 | delivery.md:3 | 4.1 How the engagement runs week to week | **delivery-sec-4-1** | heading |  | h2: 4.1 How the engagement runs week to week |
| C412 | delivery.md:4 | 4.1 How the engagement runs week to week › 4.1.1 Operating rhythm, tooling and reporting lines | **delivery-sec-4-1-1** | heading |  | h3: 4.1.1 Operating rhythm, tooling and reporting lines |
| C413 | delivery.md:6 | 4.1 How the engagement runs week to week › 4.1.1 Operating rhythm, tooling and reporting lines | delivery-sec-4-1-1 | paragraph |  | Firefly steers. Your team publishes. One brief a week holds… |
| C414 | delivery.md:8 | 4.1 How the engagement runs week to week › 4.1.1 Operating rhythm, tooling and reporting lines | delivery-sec-4-1-1 | visual `week` |  | visual `week`: Thursday, 16:00 |
| C415 | delivery.md:31 | 4.1 How the engagement runs week to week › 4.1.1 Operating rhythm, tooling and reporting lines | delivery-sec-4-1-1 | visual `checklist` |  | visual `checklist`: Asset centralisation |
| C416 | delivery.md:42 | 4.1 How the engagement runs week to week › 4.1.2 Who does what, in one table | **delivery-sec-4-1-2** | heading |  | h3: 4.1.2 Who does what, in one table |
| C417 | delivery.md:44 | 4.1 How the engagement runs week to week › 4.1.2 Who does what, in one table | delivery-sec-4-1-2 | paragraph |  | R responsible · A accountable · C consulted · I… |
| C418 | delivery.md:47 | 4.1 How the engagement runs week to week › 4.1.2 Who does what, in one table | delivery-sec-4-1-2 | table | keep | table: Activity Firefly Your team Dr. Mulu Counterpart Reviewer |
| C419 | delivery.md:64 | 4.1 How the engagement runs week to week › 4.1.2 Who does what, in one table | delivery-sec-4-1-2 | paragraph |  | Kitui roles are staffed by Kitui people. The Kikamba reviewer… |
| C420 | delivery.md:70 | 4.1 How the engagement runs week to week › 4.1.2 Who does what, in one table | delivery-sec-4-1-2 | callout |  | callout: The meeting cadence (D.1) and the escalation protocol (D.2) are… |
| C421 | delivery.md:74 | 4.1 How the engagement runs week to week › 4.1.3 Decision rights and content approval | **delivery-sec-4-1-3** | heading |  | h3: 4.1.3 Decision rights and content approval |
| C422 | delivery.md:76 | 4.1 How the engagement runs week to week › 4.1.3 Decision rights and content approval | delivery-sec-4-1-3 | paragraph |  | Three parties, not two. The column that matters is the… |
| C423 | delivery.md:78 | 4.1 How the engagement runs week to week › 4.1.3 Decision rights and content approval | delivery-sec-4-1-3 | figure `fig-5-7-approval` |  | figure component `fig-5-7-approval` |
| C424 | delivery.md:82 | 4.1 How the engagement runs week to week › 4.1.3 Decision rights and content approval | delivery-sec-4-1-3 | paragraph |  | Who holds the ad account: the campaign. Firefly's recommendation, approved… |
| C425 | delivery.md:89 | 4.2 The first weeks: audit, foundations, instrumentation | **delivery-sec-4-2** | heading |  | h2: 4.2 The first weeks: audit, foundations, instrumentation |
| C426 | delivery.md:91 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.1 The first four weeks | **delivery-sec-4-2-1** | heading |  | h3: 4.2.1 The first four weeks |
| C427 | delivery.md:93 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.1 The first four weeks | delivery-sec-4-2-1 | paragraph |  | Objective: close the recognition gap outside Kitui Central ahead of… |
| C428 | delivery.md:96 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.1 The first four weeks | delivery-sec-4-2-1 | paragraph |  | The strategic hypothesis being tested: Dr. Mulu's deficit is a… |
| C429 | delivery.md:105 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.1 The first four weeks | delivery-sec-4-2-1 | figure `fig-5-3-four-weeks` |  | figure component `fig-5-3-four-weeks` |
| C430 | delivery.md:109 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.1 The first four weeks | delivery-sec-4-2-1 | visual `timeline` |  | visual `timeline`: the presence audit (immediate) |
| C431 | delivery.md:126 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.1 The first four weeks | delivery-sec-4-2-1 | paragraph |  | Phase −1 KPIs: |
| C432 | delivery.md:128 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.1 The first four weeks | delivery-sec-4-2-1 | table |  | table: Metric Target |
| C433 | delivery.md:142 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.2 Phase 0: Instrumentation — Weeks 4–10 from signature | **delivery-sec-4-2-2** | heading |  | h3: 4.2.2 Phase 0: Instrumentation — Weeks 4–10 from signature |
| C434 | delivery.md:144 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.2 Phase 0: Instrumentation — Weeks 4–10 from signature | delivery-sec-4-2-2 | paragraph |  | Runs concurrently with the tail of Phase −1. Phases 1… |
| C435 | delivery.md:147 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.2 Phase 0: Instrumentation — Weeks 4–10 from signature | delivery-sec-4-2-2 | visual `timeline` |  | visual `timeline`: Activities |
| C436 | delivery.md:162 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.2 Phase 0: Instrumentation — Weeks 4–10 from signature | delivery-sec-4-2-2 | visual `checklist` |  | visual `checklist`: KPIs |
| C437 | delivery.md:175 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.3 Fix first: six profile corrections | **delivery-sec-4-2-3** | heading |  | h3: 4.2.3 Fix first: six profile corrections |
| C438 | delivery.md:177 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.3 Fix first: six profile corrections | delivery-sec-4-2-3 | lead |  | lead: The PhD is the one to fix first. Is the… |
| C439 | delivery.md:181 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.3 Fix first: six profile corrections | delivery-sec-4-2-3 | paragraph |  | Because Section 2.10.3: six entries on his own profile contradict… |
| C440 | delivery.md:184 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.3 Fix first: six profile corrections | delivery-sec-4-2-3 | figure `fig-4-7-profile-fixes` |  | figure component `fig-4-7-profile-fixes` |
| C441 | delivery.md:188 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.3 Fix first: six profile corrections | delivery-sec-4-2-3 | paragraph |  | The PhD is the one to fix first. The site… |
| C442 | delivery.md:192 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.3 Fix first: six profile corrections | delivery-sec-4-2-3 | paragraph |  | Is the Facebook presence a Page, or a personal profile… |
| C443 | delivery.md:194 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.3 Fix first: six profile corrections | delivery-sec-4-2-3 | paragraph |  | A visible friends list suggests the latter. The distinction is… |
| C444 | delivery.md:199 | 4.2 The first weeks: audit, foundations, instrumentation › 4.2.3 Fix first: six profile corrections | delivery-sec-4-2-3 | paragraph |  | One screenshot of Meta Business Suite, or of the Professional… |
| C445 | delivery.md:202 | 4.3 The phases to August 2027 | **delivery-sec-4-3** | heading |  | h2: 4.3 The phases to August 2027 |
| C446 | delivery.md:204 | 4.3 The phases to August 2027 | delivery-sec-4-3 | paragraph |  | Phase −1 and Phase 0 are set out in 4.2. |
| C447 | delivery.md:206 | 4.3 The phases to August 2027 | delivery-sec-4-3 | paragraph |  | Five phases: a new Phase −1 addressing the nomination contest,… |
| C448 | delivery.md:209 | 4.3 The phases to August 2027 | delivery-sec-4-3 | figure `fig-5-4-phases` |  | figure component `fig-5-4-phases` |
| C449 | delivery.md:213 | 4.3 The phases to August 2027 › 4.3.1 The target ladder | **delivery-sec-4-3-1** | heading |  | h3: 4.3.1 The target ladder |
| C450 | delivery.md:215 | 4.3 The phases to August 2027 › 4.3.1 The target ladder | delivery-sec-4-3-1 | figure `fig-5-4-ladder` |  | figure component `fig-5-4-ladder` |
| C451 | delivery.md:219 | 4.3 The phases to August 2027 › 4.3.1 The target ladder | delivery-sec-4-3-1 | textversion |  | text version: How to read the metric tables below. Rows marked °… |
| C452 | delivery.md:276 | 4.3 The phases to August 2027 › 4.3.2 Phase 1: Awareness and Community Building — October–December 2026 | **delivery-sec-4-3-2** | heading |  | h3: 4.3.2 Phase 1: Awareness and Community Building — October–December 2026 |
| C453 | delivery.md:278 | 4.3 The phases to August 2027 › 4.3.2 Phase 1: Awareness and Community Building — October–December 2026 | delivery-sec-4-3-2 | visual `checklist` |  | visual `checklist`: Activities |
| C454 | delivery.md:293 | 4.3 The phases to August 2027 › 4.3.3 Phase 2: Engagement and Persuasion — January–March 2027 | **delivery-sec-4-3-3** | heading |  | h3: 4.3.3 Phase 2: Engagement and Persuasion — January–March 2027 |
| C455 | delivery.md:295 | 4.3 The phases to August 2027 › 4.3.3 Phase 2: Engagement and Persuasion — January–March 2027 | delivery-sec-4-3-3 | visual `checklist` |  | visual `checklist`: Activities |
| C456 | delivery.md:310 | 4.3 The phases to August 2027 › 4.3.4 Phase 3: Mobilisation and GOTV — April–August 2027 | **delivery-sec-4-3-4** | heading |  | h3: 4.3.4 Phase 3: Mobilisation and GOTV — April–August 2027 |
| C457 | delivery.md:312 | 4.3 The phases to August 2027 › 4.3.4 Phase 3: Mobilisation and GOTV — April–August 2027 | delivery-sec-4-3-4 | visual `checklist` |  | visual `checklist`: Activities |
| C458 | delivery.md:327 | 4.3 The phases to August 2027 › 4.3.5 Post-election | **delivery-sec-4-3-5** | heading |  | h3: 4.3.5 Post-election |
| C459 | delivery.md:329 | 4.3 The phases to August 2027 › 4.3.5 Post-election | delivery-sec-4-3-5 | list |  | list: - Data deletion executed within 90 days of the declaration… |
| C460 | delivery.md:336 | 4.4 Coalitions and endorsements | **delivery-sec-4-4** | heading |  | h2: 4.4 Coalitions and endorsements |
| C461 | delivery.md:338 | 4.4 Coalitions and endorsements | delivery-sec-4-4 | lead |  | lead: Coalitions are built around shared economic and civic interests —… |
| C462 | delivery.md:341 | 4.4 Coalitions and endorsements › The principle behind the sequence | delivery-sec-4-4 | heading |  | h4: The principle behind the sequence |
| C463 | delivery.md:343 | 4.4 Coalitions and endorsements › The principle behind the sequence | delivery-sec-4-4 | paragraph |  | Coalitions are built around shared economic and civic interests —… |
| C464 | delivery.md:351 | 4.4 Coalitions and endorsements › The sequenced calendar | delivery-sec-4-4 | heading |  | h4: The sequenced calendar |
| C465 | delivery.md:353 | 4.4 Coalitions and endorsements › The sequenced calendar | delivery-sec-4-4 | visual `timeline` |  | visual `timeline`: Professional associations (economists, accountants, evaluators); Kitui teachers' networks; SEKU and… |
| C466 | delivery.md:398 | 4.4 Coalitions and endorsements › Managing endorsements | delivery-sec-4-4 | heading |  | h4: Managing endorsements |
| C467 | delivery.md:400 | 4.4 Coalitions and endorsements › Managing endorsements | delivery-sec-4-4 | visual `checklist` |  | visual `checklist`: Every endorsement is voluntary, documented and disclosed . No paid… |
| C468 | delivery.md:408 | 4.4 Coalitions and endorsements › Coalition KPIs | delivery-sec-4-4 | heading |  | h4: Coalition KPIs |
| C469 | delivery.md:410 | 4.4 Coalitions and endorsements › Coalition KPIs | delivery-sec-4-4 | visual `stats` |  | visual `stats`: Institutional engagements completed by end of Phase 2 |
| C470 | workstreams-platforms.md:1 | 4.5 The fourteen workstreams | **workstreams-platforms-sec-4-5** | heading |  | h2: 4.5 The fourteen workstreams |
| C471 | workstreams-platforms.md:3 | 4.5 The fourteen workstreams | workstreams-platforms-sec-4-5 | figure `fig-5-2-workstream-panels` |  | figure component `fig-5-2-workstream-panels` |
| C472 | workstreams-platforms.md:7 | 4.5 The fourteen workstreams | workstreams-platforms-sec-4-5 | visual `cards` |  | visual `cards`: The fourteen workstreams, in four groups |
| C473 | workstreams-platforms.md:26 | 4.5 The fourteen workstreams | workstreams-platforms-sec-4-5 | paragraph |  | The two scope lists below stay together, rather than being… |
| C474 | workstreams-platforms.md:28 | 4.5 The fourteen workstreams | workstreams-platforms-sec-4-5 | visual `checklist` |  | visual `checklist`: Digital infrastructure, brand and civic content |
| C475 | workstreams-platforms.md:40 | 4.5 The fourteen workstreams | workstreams-platforms-sec-4-5 | visual `checklist` |  | visual `checklist`: Growth, field advertising and reputation operations |
| C476 | workstreams-platforms.md:54 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker | **workstreams-platforms-sec-4-5-1** | heading |  | h3: 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker |
| C477 | workstreams-platforms.md:56 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker | workstreams-platforms-sec-4-5-1 | lead |  | lead: The service-delivery tracker is Firefly's to build and operate; the… |
| C478 | workstreams-platforms.md:60 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker | workstreams-platforms-sec-4-5-1 | callout |  | callout: Split ownership, and the split matters. The service-delivery tracker is… |
| C479 | workstreams-platforms.md:68 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker | workstreams-platforms-sec-4-5-1 | paragraph |  | The single clearest expression of the candidate's actual professional discipline. |
| C480 | workstreams-platforms.md:71 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › Why it exists | workstreams-platforms-sec-4-5-1 | heading |  | h4: Why it exists |
| C481 | workstreams-platforms.md:73 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › Why it exists | workstreams-platforms-sec-4-5-1 | paragraph |  | Every candidate in this race will promise water points, roads… |
| C482 | workstreams-platforms.md:78 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › What it is | workstreams-platforms-sec-4-5-1 | heading |  | h4: What it is |
| C483 | workstreams-platforms.md:80 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › What it is | workstreams-platforms-sec-4-5-1 | paragraph |  | A simple public tool through which any Kitui resident can… |
| C484 | workstreams-platforms.md:84 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › What it is | workstreams-platforms-sec-4-5-1 | paragraph |  | Deliberately multi-channel, because the people with the most to report… |
| C485 | workstreams-platforms.md:87 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › What it is | workstreams-platforms-sec-4-5-1 | visual `checklist` |  | visual `checklist`: USSD |
| C486 | workstreams-platforms.md:102 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › What happens to a report | workstreams-platforms-sec-4-5-1 | heading |  | h4: What happens to a report |
| C487 | workstreams-platforms.md:104 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › What happens to a report | workstreams-platforms-sec-4-5-1 | figure `fig-5-2-1-report-flow` |  | figure component `fig-5-2-1-report-flow` |
| C488 | workstreams-platforms.md:108 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › Design principles | workstreams-platforms-sec-4-5-1 | heading |  | h4: Design principles |
| C489 | workstreams-platforms.md:110 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › Design principles | workstreams-platforms-sec-4-5-1 | visual `checklist` |  | visual `checklist`: Public by default |
| C490 | workstreams-platforms.md:125 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › What it is worth to the campaign | workstreams-platforms-sec-4-5-1 | heading |  | h4: What it is worth to the campaign |
| C491 | workstreams-platforms.md:127 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › What it is worth to the campaign | workstreams-platforms-sec-4-5-1 | visual `checklist` |  | visual `checklist`: Narrative |
| C492 | workstreams-platforms.md:142 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › Build | workstreams-platforms-sec-4-5-1 | heading |  | h4: Build |
| C493 | workstreams-platforms.md:144 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › Build | workstreams-platforms-sec-4-5-1 | paragraph |  | Built on the USSD/SMS infrastructure the campaign is already deploying… |
| C494 | workstreams-platforms.md:148 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The opening register: the county's own scorecard | workstreams-platforms-sec-4-5-1 | heading |  | h4: The opening register: the county's own scorecard |
| C495 | workstreams-platforms.md:150 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The opening register: the county's own scorecard | workstreams-platforms-sec-4-5-1 | paragraph |  | The tracker does not start from an empty list. The… |
| C496 | workstreams-platforms.md:152 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The opening register: the county's own scorecard | workstreams-platforms-sec-4-5-1 | paragraph |  | The first verification questions are inconsistencies inside the county's document… |
| C497 | workstreams-platforms.md:154 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The opening register: the county's own scorecard | workstreams-platforms-sec-4-5-1 | visual `checklist` |  | visual `checklist`: The tracker's first questions |
| C498 | workstreams-platforms.md:178 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › Tracker KPIs | workstreams-platforms-sec-4-5-1 | heading |  | h4: Tracker KPIs |
| C499 | workstreams-platforms.md:180 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › Tracker KPIs | workstreams-platforms-sec-4-5-1 | table |  | table: Metric Phase 1 Phase 2 Phase 3 |
| C500 | workstreams-platforms.md:189 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The service-delivery performance tracker | workstreams-platforms-sec-4-5-1 | heading |  | h4: The service-delivery performance tracker |
| C501 | workstreams-platforms.md:191 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The service-delivery performance tracker | workstreams-platforms-sec-4-5-1 | paragraph |  | The campaign builds and maintains the Kitui County Service-Delivery Performance… |
| C502 | workstreams-platforms.md:193 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The service-delivery performance tracker | workstreams-platforms-sec-4-5-1 | figure `delivery-tracker` |  | figure component `delivery-tracker` |
| C503 | workstreams-platforms.md:197 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The service-delivery performance tracker | workstreams-platforms-sec-4-5-1 | heading |  | h5: Dual Operational Function: |
| C504 | workstreams-platforms.md:198 | 4.5 The fourteen workstreams › 4.5.1 Workstream 1 — Owned platforms and the service-delivery tracker › The service-delivery performance tracker | workstreams-platforms-sec-4-5-1 | list |  | list: 1. As a Campaign Credibility Asset (Pre-Election): Public Web &… |
| C505 | workstreams-platforms.md:208 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance | **workstreams-platforms-sec-4-5-2** | heading |  | h3: 4.5.2 Workstream 2 — The content brief and asset governance |
| C506 | workstreams-platforms.md:210 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance | workstreams-platforms-sec-4-5-2 | lead |  | lead: Owner: your team, to a Firefly brief. Your producers write,… |
| C507 | workstreams-platforms.md:214 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance | workstreams-platforms-sec-4-5-2 | callout |  | callout: Owner: your team, to a Firefly brief. Your producers write,… |
| C508 | workstreams-platforms.md:221 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance | workstreams-platforms-sec-4-5-2 | paragraph |  | Campaign communications succeed when production is treated as a pipeline… |
| C509 | workstreams-platforms.md:223 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance | workstreams-platforms-sec-4-5-2 | figure `production-pipeline` |  | figure component `production-pipeline` |
| C510 | workstreams-platforms.md:227 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance | workstreams-platforms-sec-4-5-2 | paragraph |  | The four content pillars are now in 3.2.3, with the… |
| C511 | workstreams-platforms.md:229 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › The weekly production schedule | workstreams-platforms-sec-4-5-2 | heading |  | h4: The weekly production schedule |
| C512 | workstreams-platforms.md:231 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › The weekly production schedule | workstreams-platforms-sec-4-5-2 | paragraph |  | The creative studio operates on a synchronized 7-Day Production Cadence… |
| C513 | workstreams-platforms.md:233 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › The weekly production schedule | workstreams-platforms-sec-4-5-2 | figure `weekly-cycle` |  | figure component `weekly-cycle` |
| C514 | workstreams-platforms.md:237 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › Who approves what, and when | workstreams-platforms-sec-4-5-2 | heading |  | h4: Who approves what, and when |
| C515 | workstreams-platforms.md:239 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › Who approves what, and when | workstreams-platforms-sec-4-5-2 | paragraph |  | To prevent defamatory statements, policy contradictions, electoral code infractions, or… |
| C516 | workstreams-platforms.md:241 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › Who approves what, and when | workstreams-platforms-sec-4-5-2 | figure `approval-gateway` |  | figure component `approval-gateway` |
| C517 | workstreams-platforms.md:245 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › The asset library | workstreams-platforms-sec-4-5-2 | heading |  | h4: The asset library |
| C518 | workstreams-platforms.md:247 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › The asset library | workstreams-platforms-sec-4-5-2 | paragraph |  | All creative assets are stored in a centralized, cloud-backed Digital… |
| C519 | workstreams-platforms.md:249 | 4.5 The fourteen workstreams › 4.5.2 Workstream 2 — The content brief and asset governance › The asset library | workstreams-platforms-sec-4-5-2 | figure `asset-library` |  | figure component `asset-library` |
| C520 | workstreams-platforms.md:256 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance | **workstreams-platforms-sec-4-5-3** | heading |  | h3: 4.5.3 Workstream 3 — Creative testing and AI assistance |
| C521 | workstreams-platforms.md:258 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance | workstreams-platforms-sec-4-5-3 | lead |  | lead: Owner: Firefly. Test design, variant selection and the read on… |
| C522 | workstreams-platforms.md:262 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance | workstreams-platforms-sec-4-5-3 | callout |  | callout: Owner: Firefly. Test design, variant selection and the read on… |
| C523 | workstreams-platforms.md:268 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › What AI is used for, and what it is never used for | workstreams-platforms-sec-4-5-3 | heading |  | h4: What AI is used for, and what it is never… |
| C524 | workstreams-platforms.md:270 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › What AI is used for, and what it is never used for | workstreams-platforms-sec-4-5-3 | visual `contrast` |  | visual `contrast`: What AI is used for |
| C525 | workstreams-platforms.md:286 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › Tools and platforms | workstreams-platforms-sec-4-5-3 | heading |  | h4: Tools and platforms |
| C526 | workstreams-platforms.md:288 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › Tools and platforms | workstreams-platforms-sec-4-5-3 | table |  | table: Tool Function Management |
| C527 | workstreams-platforms.md:296 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › Tools and platforms | workstreams-platforms-sec-4-5-3 | paragraph |  | Specific vendor selection at contracting; no tool is presented as… |
| C528 | workstreams-platforms.md:298 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › The weekly testing cycle | workstreams-platforms-sec-4-5-3 | heading |  | h4: The weekly testing cycle |
| C529 | workstreams-platforms.md:300 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › The weekly testing cycle | workstreams-platforms-sec-4-5-3 | visual `checklist` |  | visual `checklist`: Minimum 5 ad variations per objective per platform |
| C530 | workstreams-platforms.md:310 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › Performance benchmarks | workstreams-platforms-sec-4-5-3 | heading |  | h4: Performance benchmarks |
| C531 | workstreams-platforms.md:312 | 4.5 The fourteen workstreams › 4.5.3 Workstream 3 — Creative testing and AI assistance › Performance benchmarks | workstreams-platforms-sec-4-5-3 | table |  | table: Metric Global standard Campaign target |
| C532 | workstreams-platforms.md:324 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion | **workstreams-platforms-sec-4-5-4** | heading |  | h3: 4.5.4 Workstream 4 — Accessibility and inclusion |
| C533 | workstreams-platforms.md:326 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion | workstreams-platforms-sec-4-5-4 | lead |  | lead: Owner: Firefly sets the standard; your team applies it. In… |
| C534 | workstreams-platforms.md:330 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion | workstreams-platforms-sec-4-5-4 | callout |  | callout: Owner: Firefly sets the standard; your team applies it. Written… |
| C535 | workstreams-platforms.md:336 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion | workstreams-platforms-sec-4-5-4 | paragraph |  | The languages this standard works in, and the content mix… |
| C536 | workstreams-platforms.md:338 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion | workstreams-platforms-sec-4-5-4 | paragraph |  | Governance. A native Kikamba speaker is a named role at… |
| C537 | workstreams-platforms.md:344 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › What accessibility means here | workstreams-platforms-sec-4-5-4 | heading |  | h4: What accessibility means here |
| C538 | workstreams-platforms.md:346 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › What accessibility means here | workstreams-platforms-sec-4-5-4 | paragraph |  | In a county where {edu.none.women}% of women and {edu.none.men}% of… |
| C539 | workstreams-platforms.md:349 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › The case | workstreams-platforms-sec-4-5-4 | heading |  | h4: The case |
| C540 | workstreams-platforms.md:351 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › The case | workstreams-platforms-sec-4-5-4 | visual `stats` |  | visual `stats`: of women aged 6+ have no education |
| C541 | workstreams-platforms.md:365 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › The case | workstreams-platforms-sec-4-5-4 | paragraph |  | A campaign built on transparency that publishes only in dense… |
| C542 | workstreams-platforms.md:368 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › The case | workstreams-platforms-sec-4-5-4 | visual `checklist` |  | visual `checklist`: The commitments |
| C543 | workstreams-platforms.md:391 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › Why this is scope, not an annex | workstreams-platforms-sec-4-5-4 | heading |  | h4: Why this is scope, not an annex |
| C544 | workstreams-platforms.md:393 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › Why this is scope, not an annex | workstreams-platforms-sec-4-5-4 | paragraph |  | The plain-language and audio versions are not a parallel accessibility… |
| C545 | workstreams-platforms.md:400 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › Accessibility KPIs | workstreams-platforms-sec-4-5-4 | heading |  | h4: Accessibility KPIs |
| C546 | workstreams-platforms.md:402 | 4.5 The fourteen workstreams › 4.5.4 Workstream 4 — Accessibility and inclusion › Accessibility KPIs | workstreams-platforms-sec-4-5-4 | table |  | table: Metric Target |
| C547 | workstreams-media.md:1 | 4.5.5 Workstream 5 — Platform tactics and paid media | **workstreams-media-sec-4-5-5** | heading |  | h3: 4.5.5 Workstream 5 — Platform tactics and paid media |
| C548 | workstreams-media.md:3 | 4.5.5 Workstream 5 — Platform tactics and paid media | workstreams-media-sec-4-5-5 | lead |  | lead: Owner: your team, to a Firefly brief. Firefly writes the… |
| C549 | workstreams-media.md:7 | 4.5.5 Workstream 5 — Platform tactics and paid media | workstreams-media-sec-4-5-5 | callout |  | callout: Owner: your team, to a Firefly brief. Read every platform… |
| C550 | workstreams-media.md:14 | 4.5.5 Workstream 5 — Platform tactics and paid media | workstreams-media-sec-4-5-5 | paragraph |  | The platform-by-platform playbooks (Facebook, X, WhatsApp, TikTok, Instagram, YouTube and… |
| C551 | workstreams-media.md:16 | 4.5.6 Workstream 6 — Earned media, journalists and debates | **workstreams-media-sec-4-5-6** | heading |  | h3: 4.5.6 Workstream 6 — Earned media, journalists and debates |
| C552 | workstreams-media.md:18 | 4.5.6 Workstream 6 — Earned media, journalists and debates | workstreams-media-sec-4-5-6 | lead |  | lead: Owner: your team and the campaign, to a Firefly brief.… |
| C553 | workstreams-media.md:22 | 4.5.6 Workstream 6 — Earned media, journalists and debates | workstreams-media-sec-4-5-6 | callout |  | callout: Owner: your team and the campaign, to a Firefly brief.… |
| C554 | workstreams-media.md:29 | 4.5.6 Workstream 6 — Earned media, journalists and debates | workstreams-media-sec-4-5-6 | paragraph |  | Paid and owned media reach the connected minority. Earned media… |
| C555 | workstreams-media.md:32 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The radio problem, stated plainly | workstreams-media-sec-4-5-6 | heading |  | h4: The radio problem, stated plainly |
| C556 | workstreams-media.md:34 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The radio problem, stated plainly | workstreams-media-sec-4-5-6 | paragraph |  | Kamba-language radio is the dominant information channel for the {ict.offline}%… |
| C557 | workstreams-media.md:38 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The radio problem, stated plainly | workstreams-media-sec-4-5-6 | table |  | table: Station Kitui frequency Ownership association Campaign posture |
| C558 | workstreams-media.md:51 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The radio problem, stated plainly | workstreams-media-sec-4-5-6 | paragraph | keep | [conflict C7] |
| C559 | workstreams-media.md:53 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The radio problem, stated plainly | workstreams-media-sec-4-5-6 | paragraph |  | Strategic implication: the campaign's radio strategy runs through Musyi, County… |
| C560 | workstreams-media.md:59 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The radio problem, stated plainly | workstreams-media-sec-4-5-6 | paragraph |  | This map is based on publicly reported ownership associations. Before… |
| C561 | workstreams-media.md:64 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The journalist relationship programme | workstreams-media-sec-4-5-6 | heading |  | h4: The journalist relationship programme |
| C562 | workstreams-media.md:66 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The journalist relationship programme | workstreams-media-sec-4-5-6 | visual `cards` |  | visual `cards`: Tier A |
| C563 | workstreams-media.md:88 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The journalist relationship programme | workstreams-media-sec-4-5-6 | paragraph |  | Tier C is the underused opportunity. A gubernatorial aspirant who… |
| C564 | workstreams-media.md:92 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The journalist relationship programme | workstreams-media-sec-4-5-6 | paragraph |  | Standing press kit — permanently available: approved biography (short, medium,… |
| C565 | workstreams-media.md:98 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Candidate media training | workstreams-media-sec-4-5-6 | heading |  | h4: Candidate media training |
| C566 | workstreams-media.md:100 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Candidate media training | workstreams-media-sec-4-5-6 | paragraph |  | Three sessions, plus refreshers: |
| C567 | workstreams-media.md:102 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Candidate media training | workstreams-media-sec-4-5-6 | list |  | list: 1. Core message discipline — bridging from any question to… |
| C568 | workstreams-media.md:113 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Candidate media training | workstreams-media-sec-4-5-6 | paragraph |  | Refreshers before each debate or major forum, plus a recorded… |
| C569 | workstreams-media.md:116 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The debate and forum playbook | workstreams-media-sec-4-5-6 | heading |  | h4: The debate and forum playbook |
| C570 | workstreams-media.md:118 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The debate and forum playbook | workstreams-media-sec-4-5-6 | paragraph |  | Preparation: |
| C571 | workstreams-media.md:120 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The debate and forum playbook | workstreams-media-sec-4-5-6 | list |  | list: Full briefing pack: rival positions, likely lines of attack, verified… |
| C572 | workstreams-media.md:126 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The debate and forum playbook | workstreams-media-sec-4-5-6 | paragraph |  | Live clipping operation: |
| C573 | workstreams-media.md:128 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The debate and forum playbook | workstreams-media-sec-4-5-6 | table |  | table: Time Action Owner |
| C574 | workstreams-media.md:139 | 4.5.6 Workstream 6 — Earned media, journalists and debates › The debate and forum playbook | workstreams-media-sec-4-5-6 | paragraph |  | The rule: the clip is published before the coverage is… |
| C575 | workstreams-media.md:142 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Pre-drafted response lines | workstreams-media-sec-4-5-6 | heading |  | h4: Pre-drafted response lines |
| C576 | workstreams-media.md:144 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Pre-drafted response lines | workstreams-media-sec-4-5-6 | paragraph |  | Prepared, verified, and rehearsed in drills. Each is a structure,… |
| C577 | workstreams-media.md:147 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Pre-drafted response lines | workstreams-media-sec-4-5-6 | table |  | table: Likely attack Response structure |
| C578 | workstreams-media.md:158 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Earned media KPIs | workstreams-media-sec-4-5-6 | heading |  | h4: Earned media KPIs |
| C579 | workstreams-media.md:160 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Earned media KPIs | workstreams-media-sec-4-5-6 | visual `stats` |  | visual `stats`: Earned media items per month, Phase 1 onward |
| C580 | workstreams-media.md:177 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Getting on air around a hostile gatekeeper | workstreams-media-sec-4-5-6 | heading |  | h4: Getting on air around a hostile gatekeeper |
| C581 | workstreams-media.md:179 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Getting on air around a hostile gatekeeper | workstreams-media-sec-4-5-6 | paragraph |  | To guarantee uninhibited communication with all {register.2022} registered voters across… |
| C582 | workstreams-media.md:181 | 4.5.6 Workstream 6 — Earned media, journalists and debates › Getting on air around a hostile gatekeeper | workstreams-media-sec-4-5-6 | figure `bypass-architecture` |  | figure component `bypass-architecture` |
| C583 | workstreams-media.md:185 | 4.5.6 Workstream 6 — Earned media, journalists and debates › How we pitch: evidence first | workstreams-media-sec-4-5-6 | heading |  | h4: How we pitch: evidence first |
| C584 | workstreams-media.md:187 | 4.5.6 Workstream 6 — Earned media, journalists and debates › How we pitch: evidence first | workstreams-media-sec-4-5-6 | paragraph |  | To capture objective news coverage on mainstream national and regional… |
| C585 | workstreams-media.md:189 | 4.5.6 Workstream 6 — Earned media, journalists and debates › How we pitch: evidence first | workstreams-media-sec-4-5-6 | list |  | list: 1. Hansard & Audit Exclusives: Providing national media bureau chiefs… |
| C586 | workstreams-ground.md:1 | 4.5.7 Workstream 7 — Ground-digital integration | **workstreams-ground-sec-4-5-7** | heading |  | h3: 4.5.7 Workstream 7 — Ground-digital integration |
| C587 | workstreams-ground.md:3 | 4.5.7 Workstream 7 — Ground-digital integration | workstreams-ground-sec-4-5-7 | lead |  | lead: Owner: the campaign. Field intelligence captured by the 40 Ward… |
| C588 | workstreams-ground.md:7 | 4.5.7 Workstream 7 — Ground-digital integration | workstreams-ground-sec-4-5-7 | callout |  | callout: Owner: the campaign. The 40 ward coordinators are the campaign's… |
| C589 | workstreams-ground.md:13 | 4.5.7 Workstream 7 — Ground-digital integration | workstreams-ground-sec-4-5-7 | paragraph |  | A campaign that operates field organizing and digital messaging as… |
| C590 | workstreams-ground.md:15 | 4.5.7 Workstream 7 — Ground-digital integration | workstreams-ground-sec-4-5-7 | paragraph |  | The campaign establishes a Closed-Loop Ground-Digital Integration Engine . Field… |
| C591 | workstreams-ground.md:17 | 4.5.7 Workstream 7 — Ground-digital integration | workstreams-ground-sec-4-5-7 | figure `field-loop` |  | figure component `field-loop` |
| C592 | workstreams-ground.md:21 | 4.5.7 Workstream 7 — Ground-digital integration › What the 40 ward coordinators report | workstreams-ground-sec-4-5-7 | heading |  | h4: What the 40 ward coordinators report |
| C593 | workstreams-ground.md:23 | 4.5.7 Workstream 7 — Ground-digital integration › What the 40 ward coordinators report | workstreams-ground-sec-4-5-7 | paragraph |  | The primary sensing mechanism of the campaign is the 40… |
| C594 | workstreams-ground.md:25 | 4.5.7 Workstream 7 — Ground-digital integration › What the 40 ward coordinators report | workstreams-ground-sec-4-5-7 | figure `field-reports` |  | figure component `field-reports` |
| C595 | workstreams-ground.md:29 | 4.5.7 Workstream 7 — Ground-digital integration › What the 40 ward coordinators report | workstreams-ground-sec-4-5-7 | visual `cards` |  | visual `cards`: What Ward Coordinators Report |
| C596 | workstreams-ground.md:44 | 4.5.7 Workstream 7 — Ground-digital integration › From ground intel to a published response in four hours | workstreams-ground-sec-4-5-7 | heading |  | h4: From ground intel to a published response in four hours |
| C597 | workstreams-ground.md:46 | 4.5.7 Workstream 7 — Ground-digital integration › From ground intel to a published response in four hours | workstreams-ground-sec-4-5-7 | paragraph |  | When field intelligence reaches the War Room, it triggers an… |
| C598 | workstreams-ground.md:48 | 4.5.7 Workstream 7 — Ground-digital integration › From ground intel to a published response in four hours | workstreams-ground-sec-4-5-7 | figure `four-hour-cycle` |  | figure component `four-hour-cycle` |
| C599 | workstreams-ground.md:52 | 4.5.7 Workstream 7 — Ground-digital integration › Distribution beyond social media | workstreams-ground-sec-4-5-7 | heading |  | h4: Distribution beyond social media |
| C600 | workstreams-ground.md:54 | 4.5.7 Workstream 7 — Ground-digital integration › Distribution beyond social media | workstreams-ground-sec-4-5-7 | callout |  | callout: Campaign-owned recommendations, outside this engagement (Section 1.4.3). The four networks… |
| C601 | workstreams-ground.md:57 | 4.5.7 Workstream 7 — Ground-digital integration › Distribution beyond social media | workstreams-ground-sec-4-5-7 | paragraph |  | To bypass digital connectivity barriers, the campaign turns physical transportation,… |
| C602 | workstreams-ground.md:59 | 4.5.7 Workstream 7 — Ground-digital integration › Distribution beyond social media | workstreams-ground-sec-4-5-7 | visual `cards` |  | visual `cards`: The Boda Boda Stage Network ({target.stage-champions} Stage Champions) |
| C603 | workstreams-ground.md:89 | 4.5.7 Workstream 7 — Ground-digital integration › The operating rhythm | workstreams-ground-sec-4-5-7 | heading |  | h4: The operating rhythm |
| C604 | workstreams-ground.md:91 | 4.5.7 Workstream 7 — Ground-digital integration › The operating rhythm | workstreams-ground-sec-4-5-7 | paragraph |  | To maintain operational tempo across 8 constituencies and 40 wards,… |
| C605 | workstreams-ground.md:93 | 4.5.7 Workstream 7 — Ground-digital integration › The operating rhythm | workstreams-ground-sec-4-5-7 | figure `operating-rhythm` |  | figure component `operating-rhythm` |
| C606 | workstreams-ground.md:100 | 4.5.8 Workstream 8 — The field-to-digital loop | **workstreams-ground-sec-4-5-8** | heading |  | h3: 4.5.8 Workstream 8 — The field-to-digital loop |
| C607 | workstreams-ground.md:102 | 4.5.8 Workstream 8 — The field-to-digital loop | workstreams-ground-sec-4-5-8 | lead |  | lead: Owner: the campaign. Firefly supplies the instrument and its data… |
| C608 | workstreams-ground.md:106 | 4.5.8 Workstream 8 — The field-to-digital loop | workstreams-ground-sec-4-5-8 | callout |  | callout: Owner: the campaign. Firefly supplies the instrument and its data… |
| C609 | workstreams-ground.md:111 | 4.5.8 Workstream 8 — The field-to-digital loop › Operating architecture and bidirectional sync | workstreams-ground-sec-4-5-8 | heading |  | h4: Operating architecture and bidirectional sync |
| C610 | workstreams-ground.md:113 | 4.5.8 Workstream 8 — The field-to-digital loop › Operating architecture and bidirectional sync | workstreams-ground-sec-4-5-8 | paragraph |  | Most campaigns run two separate operations: a ground team that… |
| C611 | workstreams-ground.md:119 | 4.5.8 Workstream 8 — The field-to-digital loop › Operating architecture and bidirectional sync | workstreams-ground-sec-4-5-8 | figure `fig-5-2-3-field-loop` |  | figure component `fig-5-2-3-field-loop` |
| C612 | workstreams-ground.md:123 | 4.5.8 Workstream 8 — The field-to-digital loop › Operating architecture and bidirectional sync | workstreams-ground-sec-4-5-8 | visual `contrast` |  | visual `contrast`: Field to digital synchronization |
| C613 | workstreams-ground.md:149 | 4.5.8 Workstream 8 — The field-to-digital loop › Governance and data protection on the doorstep | workstreams-ground-sec-4-5-8 | heading |  | h4: Governance and data protection on the doorstep |
| C614 | workstreams-ground.md:151 | 4.5.8 Workstream 8 — The field-to-digital loop › Governance and data protection on the doorstep | workstreams-ground-sec-4-5-8 | visual `checklist` |  | visual `checklist`: Field data is campaign first-party data, collected with notice, and… |
| C615 | workstreams-ground.md:160 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice | **workstreams-ground-sec-4-5-9** | heading |  | h3: 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and… |
| C616 | workstreams-ground.md:162 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice | workstreams-ground-sec-4-5-9 | lead |  | lead: Owner: Firefly, end to end. Bulk political SMS cannot be… |
| C617 | workstreams-ground.md:166 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice | workstreams-ground-sec-4-5-9 | callout |  | callout: Owner: Firefly, end to end. Two pieces of infrastructure, held… |
| C618 | workstreams-ground.md:175 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › Why this layer decides the race | workstreams-ground-sec-4-5-9 | heading |  | h4: Why this layer decides the race |
| C619 | workstreams-ground.md:177 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › Why this layer decides the race | workstreams-ground-sec-4-5-9 | paragraph |  | {ict.internet}% of Kitui's residents use the internet and {ict.phone}% own… |
| C620 | workstreams-ground.md:182 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › Why this layer decides the race | workstreams-ground-sec-4-5-9 | paragraph |  | Put plainly: a purely digital campaign in Kitui addresses roughly… |
| C621 | workstreams-ground.md:186 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › Why this layer decides the race | workstreams-ground-sec-4-5-9 | paragraph |  | The phone side of this layer is larger than the… |
| C622 | workstreams-ground.md:188 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › Why this layer decides the race | workstreams-ground-sec-4-5-9 | paragraph |  | This is not an equity footnote. It is the central… |
| C623 | workstreams-ground.md:193 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › Why this layer decides the race | workstreams-ground-sec-4-5-9 | paragraph |  | The critical constraint: the campaign can only message consented numbers… |
| C624 | workstreams-ground.md:197 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The SMS layer | workstreams-ground-sec-4-5-9 | heading |  | h4: The SMS layer |
| C625 | workstreams-ground.md:199 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The SMS layer | workstreams-ground-sec-4-5-9 | paragraph |  | Consent-first architecture. Every number in the campaign database arrives by… |
| C626 | workstreams-ground.md:207 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The SMS layer | workstreams-ground-sec-4-5-9 | callout |  | callout: Bulk political SMS cannot be sent in Kikamba The CA/NCIC… |
| C627 | workstreams-ground.md:226 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The SMS layer | workstreams-ground-sec-4-5-9 | paragraph | keep | [conflict C2] |
| C628 | workstreams-ground.md:228 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The SMS layer | workstreams-ground-sec-4-5-9 | paragraph |  | Message architecture — 160 characters, English or Kiswahili only ,… |
| C629 | workstreams-ground.md:229 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The SMS layer | workstreams-ground-sec-4-5-9 | table |  | table: Type Frequency Language Example structure |
| C630 | workstreams-ground.md:238 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The SMS layer | workstreams-ground-sec-4-5-9 | visual `checklist` |  | visual `checklist`: Operational discipline |
| C631 | workstreams-ground.md:253 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The USSD layer | workstreams-ground-sec-4-5-9 | heading |  | h4: The USSD layer |
| C632 | workstreams-ground.md:255 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The USSD layer | workstreams-ground-sec-4-5-9 | paragraph |  | USSD works on every phone, requires no internet, and is… |
| C633 | workstreams-ground.md:259 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The USSD layer | workstreams-ground-sec-4-5-9 | paragraph |  | Proposed menu — dialled on the campaign's USSD shortcode: |
| C634 | workstreams-ground.md:260 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The USSD layer | workstreams-ground-sec-4-5-9 | figure `fig-5-2-3-ussd-menu` |  | figure component `fig-5-2-3-ussd-menu` |
| C635 | workstreams-ground.md:264 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The USSD layer | workstreams-ground-sec-4-5-9 | paragraph |  | Why option 3 matters most. The service-delivery tracker (Section 4.5.1)… |
| C636 | workstreams-ground.md:270 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The USSD layer | workstreams-ground-sec-4-5-9 | paragraph |  | Set-up: 5–7 working days for a shared code; 2–4 weeks… |
| C637 | workstreams-ground.md:273 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › Voice and audio | workstreams-ground-sec-4-5-9 | heading |  | h4: Voice and audio |
| C638 | workstreams-ground.md:275 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › Voice and audio | workstreams-ground-sec-4-5-9 | list |  | list: Kikamba voice notes from Dr. Mulu distributed by WhatsApp and… |
| C639 | workstreams-ground.md:282 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The mobile-money agent network | workstreams-ground-sec-4-5-9 | heading |  | h4: The mobile-money agent network |
| C640 | workstreams-ground.md:284 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The mobile-money agent network | workstreams-ground-sec-4-5-9 | paragraph |  | Kenya's registered mobile-money agents grew from {ict.agents.2025} in September 2025… |
| C641 | workstreams-ground.md:289 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › The mobile-money agent network | workstreams-ground-sec-4-5-9 | visual `cards` |  | visual `cards`: The mobile-money agent network: proposed use |
| C642 | workstreams-ground.md:299 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › KPIs for the offline layer | workstreams-ground-sec-4-5-9 | heading |  | h4: KPIs for the offline layer |
| C643 | workstreams-ground.md:301 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › KPIs for the offline layer | workstreams-ground-sec-4-5-9 | table |  | table: Metric Phase −1 Phase 1 Phase 2 Phase 3 |
| C644 | workstreams-ground.md:309 | 4.5.9 Workstream 9 — What Firefly operates: SMS, USSD and voice › KPIs for the offline layer | workstreams-ground-sec-4-5-9 | paragraph |  | Opt-out rate is the health metric. A rising opt-out rate… |
| C645 | workstreams-ground.md:316 | 4.5.10 Workstream 10 — Digital organising and volunteers | **workstreams-ground-sec-4-5-10** | heading |  | h3: 4.5.10 Workstream 10 — Digital organising and volunteers |
| C646 | workstreams-ground.md:318 | 4.5.10 Workstream 10 — Digital organising and volunteers | workstreams-ground-sec-4-5-10 | lead |  | lead: Outside this engagement. Firefly's contribution is the metric definitions the… |
| C647 | workstreams-ground.md:322 | 4.5.10 Workstream 10 — Digital organising and volunteers | workstreams-ground-sec-4-5-10 | callout |  | callout: Outside this engagement. Volunteer recruitment, tiers, gamification and ward-champion management… |
| C648 | workstreams-ground.md:329 | 4.5.10 Workstream 10 — Digital organising and volunteers | workstreams-ground-sec-4-5-10 | paragraph |  | The volunteer programme reference (tiers, gamification, tooling and KPIs) is… |
| C649 | workstreams-data.md:1 | 4.5.11 Workstream 11 — The data layer | **workstreams-data-sec-4-5-11** | heading |  | h3: 4.5.11 Workstream 11 — The data layer |
| C650 | workstreams-data.md:3 | 4.5.11 Workstream 11 — The data layer | workstreams-data-sec-4-5-11 | lead |  | lead: Owner: Firefly , as processor on the campaign's behalf, under… |
| C651 | workstreams-data.md:7 | 4.5.11 Workstream 11 — The data layer | workstreams-data-sec-4-5-11 | callout |  | callout: Owner: Firefly , as processor on the campaign's behalf, under… |
| C652 | workstreams-data.md:13 | 4.5.11 Workstream 11 — The data layer | workstreams-data-sec-4-5-11 | paragraph |  | A modern, high-precision political operation requires an infallible data layer.… |
| C653 | workstreams-data.md:15 | 4.5.11 Workstream 11 — The data layer | workstreams-data-sec-4-5-11 | paragraph |  | This section defines the voter and supporter data model and… |
| C654 | workstreams-data.md:17 | 4.5.11 Workstream 11 — The data layer | workstreams-data-sec-4-5-11 | figure `data-layer` |  | figure component `data-layer` |
| C655 | workstreams-data.md:21 | 4.5.11 Workstream 11 — The data layer › The voter and supporter data model | workstreams-data-sec-4-5-11 | heading |  | h4: The voter and supporter data model |
| C656 | workstreams-data.md:23 | 4.5.11 Workstream 11 — The data layer › The voter and supporter data model | workstreams-data-sec-4-5-11 | paragraph |  | The campaign database is organized around a relational, entity-attribute-value schema… |
| C657 | workstreams-data.md:25 | 4.5.11 Workstream 11 — The data layer › The voter and supporter data model | workstreams-data-sec-4-5-11 | figure `supporter-schema` |  | figure component `supporter-schema` |
| C658 | workstreams-data.md:29 | 4.5.11 Workstream 11 — The data layer › The voter and supporter data model | workstreams-data-sec-4-5-11 | visual `checklist` |  | visual `checklist`: Key Architecture Principles |
| C659 | workstreams-data.md:41 | 4.5.11 Workstream 11 — The data layer › The voter and supporter data model | workstreams-data-sec-4-5-11 | paragraph |  | The Data Protection Act obligations this layer works under, and… |
| C660 | workstreams-data.md:43 | 4.5.12 Workstream 12 — Predictive voter modelling | **workstreams-data-sec-4-5-12** | heading |  | h3: 4.5.12 Workstream 12 — Predictive voter modelling |
| C661 | workstreams-data.md:45 | 4.5.12 Workstream 12 — Predictive voter modelling | workstreams-data-sec-4-5-12 | lead |  | lead: Owner: Firefly — gated on Section 5.3.4. Until written sign-off,… |
| C662 | workstreams-data.md:49 | 4.5.12 Workstream 12 — Predictive voter modelling | workstreams-data-sec-4-5-12 | callout |  | callout: Owner: Firefly — gated on Section 5.3.4. Until written sign-off,… |
| C663 | workstreams-data.md:56 | 4.5.12 Workstream 12 — Predictive voter modelling | workstreams-data-sec-4-5-12 | visual `stepper` |  | visual `stepper`: What the model scores, and why |
| C664 | workstreams-data.md:70 | 4.5.12 Workstream 12 — Predictive voter modelling › The compliance gate this depends on | workstreams-data-sec-4-5-12 | heading |  | h4: The compliance gate this depends on |
| C665 | workstreams-data.md:72 | 4.5.12 Workstream 12 — Predictive voter modelling › The compliance gate this depends on | workstreams-data-sec-4-5-12 | paragraph |  | The compliance gate, and the fallback the model runs on… |
| C666 | workstreams-data.md:76 | 4.5.13 Workstream 13 — The technology stack | **workstreams-data-sec-4-5-13** | heading |  | h3: 4.5.13 Workstream 13 — The technology stack |
| C667 | workstreams-data.md:78 | 4.5.13 Workstream 13 — The technology stack | workstreams-data-sec-4-5-13 | lead |  | lead: Mostly outside this engagement. Firefly builds and operates three components… |
| C668 | workstreams-data.md:82 | 4.5.13 Workstream 13 — The technology stack | workstreams-data-sec-4-5-13 | callout |  | callout: Mostly outside this engagement. Dr. Mulu already holds accounts, hosting… |
| C669 | workstreams-data.md:90 | 4.5.13 Workstream 13 — The technology stack | workstreams-data-sec-4-5-13 | paragraph |  | The reference architecture the campaign owns (component by component, the… |
| C670 | workstreams-data.md:92 | 4.5.14 Workstream 14 — Analytics and attribution | **workstreams-data-sec-4-5-14** | heading |  | h3: 4.5.14 Workstream 14 — Analytics and attribution |
| C671 | workstreams-data.md:94 | 4.5.14 Workstream 14 — Analytics and attribution | workstreams-data-sec-4-5-14 | lead |  | lead: Owner: Firefly. This is the engine room of the engagement.… |
| C672 | workstreams-data.md:98 | 4.5.14 Workstream 14 — Analytics and attribution | workstreams-data-sec-4-5-14 | callout |  | callout: Owner: Firefly. This is the engine room of the engagement.… |
| C673 | workstreams-data.md:105 | 4.5.14 Workstream 14 — Analytics and attribution › Attribution model and offline conversion tracking | workstreams-data-sec-4-5-14 | heading |  | h4: Attribution model and offline conversion tracking |
| C674 | workstreams-data.md:107 | 4.5.14 Workstream 14 — Analytics and attribution › Attribution model and offline conversion tracking | workstreams-data-sec-4-5-14 | paragraph |  | Measurement moves beyond vanity metrics to what drives votes: multi-touch… |
| C675 | workstreams-data.md:111 | 4.5.14 Workstream 14 — Analytics and attribution › Attribution model and offline conversion tracking | workstreams-data-sec-4-5-14 | table |  | table: Touchpoint Attribution method Source |
| C676 | workstreams-data.md:123 | 4.5.14 Workstream 14 — Analytics and attribution › Attribution model and offline conversion tracking | workstreams-data-sec-4-5-14 | paragraph |  | To track offline-to-digital and physical engagement, four mechanisms bridge the… |
| C677 | workstreams-data.md:124 | 4.5.14 Workstream 14 — Analytics and attribution › Attribution model and offline conversion tracking | workstreams-data-sec-4-5-14 | list |  | list: Unique QR codes on printed materials and at barazas, tracking… |
| C678 | workstreams-data.md:129 | 4.5.14 Workstream 14 — Analytics and attribution › Key metrics and benchmarks | workstreams-data-sec-4-5-14 | heading |  | h4: Key metrics and benchmarks |
| C679 | workstreams-data.md:131 | 4.5.14 Workstream 14 — Analytics and attribution › Key metrics and benchmarks | workstreams-data-sec-4-5-14 | table |  | table: Metric Definition Global benchmark Campaign target |
| C680 | workstreams-data.md:141 | 4.5.14 Workstream 14 — Analytics and attribution › The analytics maturity roadmap | workstreams-data-sec-4-5-14 | heading |  | h4: The analytics maturity roadmap |
| C681 | workstreams-data.md:143 | 4.5.14 Workstream 14 — Analytics and attribution › The analytics maturity roadmap | workstreams-data-sec-4-5-14 | paragraph |  | A staged path, so the campaign is never blocked waiting… |
| C682 | workstreams-data.md:145 | 4.5.14 Workstream 14 — Analytics and attribution › The analytics maturity roadmap | workstreams-data-sec-4-5-14 | visual `timeline` |  | visual `timeline`: 0 — Baseline |
| C683 | workstreams-data.md:180 | 4.5.14 Workstream 14 — Analytics and attribution › The analytics maturity roadmap | workstreams-data-sec-4-5-14 | paragraph |  | No stage is skipped. A campaign that attempts predictive scoring… |
| C684 | workstreams-data.md:184 | 4.5.14 Workstream 14 — Analytics and attribution › Who owns the data | workstreams-data-sec-4-5-14 | heading |  | h4: Who owns the data |
| C685 | workstreams-data.md:186 | 4.5.14 Workstream 14 — Analytics and attribution › Who owns the data | workstreams-data-sec-4-5-14 | paragraph |  | A single named data-governance owner is accountable for both analytics… |
| C686 | workstreams-data.md:190 | 4.5.14 Workstream 14 — Analytics and attribution › Who owns the data | workstreams-data-sec-4-5-14 | paragraph |  | Responsibilities: |
| C687 | workstreams-data.md:191 | 4.5.14 Workstream 14 — Analytics and attribution › Who owns the data | workstreams-data-sec-4-5-14 | list |  | list: Maintains the data inventory: what is held, lawful basis, retention… |
| C688 | workstreams-data.md:201 | 4.5.14 Workstream 14 — Analytics and attribution › Who owns the data | workstreams-data-sec-4-5-14 | paragraph |  | At lean tier this role sits with the Digital Director;… |
| C689 | staffing.md:3 | 4.6 How the work is staffed | **staffing-sec-4-6** | heading |  | h2: 4.6 How the work is staffed |
| C690 | staffing.md:5 | 4.6 How the work is staffed | staffing-sec-4-6 | paragraph |  | Dr. Mulu already has a team that publishes every day.… |
| C691 | staffing.md:7 | 4.6 How the work is staffed | staffing-sec-4-6 | paragraph |  | The campaign runs a Lean Core Delivery Model : a… |
| C692 | staffing.md:9 | 4.6 How the work is staffed | staffing-sec-4-6 | figure `org-chart` |  | figure component `org-chart` |
| C693 | staffing.md:13 | 4.6 How the work is staffed | staffing-sec-4-6 | paragraph |  | Three cores, and they are not the same team. |
| C694 | staffing.md:15 | 4.6 How the work is staffed | staffing-sec-4-6 | list |  | list: The campaign's command structure — the Campaign Manager and three… |
| C695 | staffing.md:22 | 4.6 How the work is staffed | staffing-sec-4-6 | figure `fig-5-9-team` |  | figure component `fig-5-9-team` |
| C696 | staffing.md:26 | 4.6 How the work is staffed | staffing-sec-4-6 | paragraph |  | Where this section says "four-person core" it means the campaign's;… |
| C697 | staffing.md:29 | 4.6 How the work is staffed | staffing-sec-4-6 | paragraph |  | What the arrangement buys, stated without the usual claims about… |
| C698 | staffing.md:31 | 4.6 How the work is staffed | staffing-sec-4-6 | list |  | list: 1. Decisions in one place. A single named campaign-side counterpart… |
| C699 | staffing.md:42 | 4.6 How the work is staffed › 4.6.1 A lean core with a defined surge | **staffing-sec-4-6-1** | heading |  | h3: 4.6.1 A lean core with a defined surge |
| C700 | staffing.md:44 | 4.6 How the work is staffed › 4.6.1 A lean core with a defined surge | staffing-sec-4-6-1 | paragraph |  | Firefly delivers this engagement through a small senior core team… |
| C701 | staffing.md:50 | 4.6 How the work is staffed › 4.6.1 A lean core with a defined surge | staffing-sec-4-6-1 | paragraph |  | The structure below scales with the service level selected in… |
| C702 | staffing.md:54 | 4.6 How the work is staffed › 4.6.2 The core team, retained throughout | **staffing-sec-4-6-2** | heading |  | h3: 4.6.2 The core team, retained throughout |
| C703 | staffing.md:56 | 4.6 How the work is staffed › 4.6.2 The core team, retained throughout | staffing-sec-4-6-2 | paragraph |  | What this section covers, and what it does not. The… |
| C704 | staffing.md:63 | 4.6 How the work is staffed › 4.6.2 The core team, retained throughout | staffing-sec-4-6-2 | visual `cards` |  | visual `cards`: Strategy Director (Firefly principal) |
| C705 | staffing.md:83 | 4.6 How the work is staffed › 4.6.3 Surge roles, activated by phase and scope level | **staffing-sec-4-6-3** | heading |  | h3: 4.6.3 Surge roles, activated by phase and scope level |
| C706 | staffing.md:85 | 4.6 How the work is staffed › 4.6.3 Surge roles, activated by phase and scope level | staffing-sec-4-6-3 | lead |  | lead: Community management and video editing are not on this list,… |
| C707 | staffing.md:90 | 4.6 How the work is staffed › 4.6.3 Surge roles, activated by phase and scope level | staffing-sec-4-6-3 | table | keep | table: Role Activated Function |
| C708 | staffing.md:98 | 4.6 How the work is staffed › 4.6.3 Surge roles, activated by phase and scope level | staffing-sec-4-6-3 | paragraph |  | Community management and video editing are not on this list,… |
| C709 | staffing.md:102 | 4.6 How the work is staffed › 4.6.3 Surge roles, activated by phase and scope level | staffing-sec-4-6-3 | paragraph |  | Surge triggers are explicit. Each remaining surge role has a… |
| C710 | staffing.md:107 | 4.6 How the work is staffed › 4.6.4 Leadership roles and who owns what | **staffing-sec-4-6-4** | heading |  | h3: 4.6.4 Leadership roles and who owns what |
| C711 | staffing.md:109 | 4.6 How the work is staffed › 4.6.4 Leadership roles and who owns what | staffing-sec-4-6-4 | figure `role-ownership` |  | figure component `role-ownership` |
| C712 | staffing.md:115 | 4.6 How the work is staffed › 4.6.5 Reporting lines | **staffing-sec-4-6-5** | heading |  | h3: 4.6.5 Reporting lines |
| C713 | staffing.md:117 | 4.6 How the work is staffed › 4.6.5 Reporting lines | staffing-sec-4-6-5 | lead |  | lead: Two teams, one interface. The brief is the interface. Firefly… |
| C714 | staffing.md:121 | 4.6 How the work is staffed › 4.6.5 Reporting lines | staffing-sec-4-6-5 | paragraph |  | Two teams, one interface. The brief is the interface. |
| C715 | staffing.md:123 | 4.6 How the work is staffed › 4.6.5 Reporting lines | staffing-sec-4-6-5 | figure `reporting-lines` |  | figure component `reporting-lines` |
| C716 | staffing.md:127 | 4.6 How the work is staffed › 4.6.5 Reporting lines | staffing-sec-4-6-5 | paragraph |  | Firefly adds three people. It removes none. |
| C717 | staffing.md:129 | 4.6 How the work is staffed › 4.6.5 Reporting lines | staffing-sec-4-6-5 | paragraph |  | A single campaign-side counterpart is required. Firefly reports to one… |
| C718 | staffing.md:135 | 4.6 How the work is staffed › 4.6.6 How the existing team is assessed and upskilled | **staffing-sec-4-6-6** | heading |  | h3: 4.6.6 How the existing team is assessed and upskilled |
| C719 | staffing.md:137 | 4.6 How the work is staffed › 4.6.6 How the existing team is assessed and upskilled | staffing-sec-4-6-6 | paragraph |  | Firefly assesses the team Dr. Mulu has. It does not… |
| C720 | staffing.md:139 | 4.6 How the work is staffed › 4.6.6 How the existing team is assessed and upskilled | staffing-sec-4-6-6 | visual `timeline` |  | visual `timeline`: the capability map, not an appraisal |
| C721 | staffing.md:156 | 4.6 How the work is staffed › 4.6.6 How the existing team is assessed and upskilled | staffing-sec-4-6-6 | paragraph |  | Where a gap cannot be closed by upskilling — no… |
| C722 | measurement.md:3 | 5.1 The indicators | **measurement-sec-5-1** | heading |  | h2: 5.1 The indicators |
| C723 | measurement.md:5 | 5.1 The indicators | measurement-sec-5-1 | paragraph |  | Every indicator here is one Firefly can observe on his… |
| C724 | measurement.md:7 | 5.1 The indicators | measurement-sec-5-1 | figure `fig-5-6-kpis` |  | figure component `fig-5-6-kpis` |
| C725 | measurement.md:11 | 5.1 The indicators › 5.1.1 Stage scorecards: nomination window and general election | **measurement-sec-5-1-1** | heading |  | h3: 5.1.1 Stage scorecards: nomination window and general election |
| C726 | measurement.md:13 | 5.1 The indicators › 5.1.1 Stage scorecards: nomination window and general election › Stage 1: the nomination-window scorecard | measurement-sec-5-1-1 | heading |  | h4: Stage 1: the nomination-window scorecard |
| C727 | measurement.md:15 | 5.1 The indicators › 5.1.1 Stage scorecards: nomination window and general election › Stage 1: the nomination-window scorecard | measurement-sec-5-1-1 | paragraph |  | The nomination phase focuses on securing the Wiper Patriotic Front… |
| C728 | measurement.md:17 | 5.1 The indicators › 5.1.1 Stage scorecards: nomination window and general election › Stage 1: the nomination-window scorecard | measurement-sec-5-1-1 | figure `nomination-scorecard` |  | figure component `nomination-scorecard` |
| C729 | measurement.md:21 | 5.1 The indicators › 5.1.1 Stage scorecards: nomination window and general election › Stage 2: the general election scorecard | measurement-sec-5-1-1 | heading |  | h4: Stage 2: the general election scorecard |
| C730 | measurement.md:23 | 5.1 The indicators › 5.1.1 Stage scorecards: nomination window and general election › Stage 2: the general election scorecard | measurement-sec-5-1-1 | paragraph |  | The general election phase focuses on voter mobilization, ground network… |
| C731 | measurement.md:25 | 5.1 The indicators › 5.1.1 Stage scorecards: nomination window and general election › Stage 2: the general election scorecard | measurement-sec-5-1-1 | figure `ge-scorecard` |  | figure component `ge-scorecard` |
| C732 | measurement.md:28 | 5.1 The indicators › 5.1.2 Re-anchored: recognition and persuasion where he is least known | **measurement-sec-5-1-2** | heading |  | h3: 5.1.2 Re-anchored: recognition and persuasion where he is least known |
| C733 | measurement.md:30 | 5.1 The indicators › 5.1.2 Re-anchored: recognition and persuasion where he is least known | measurement-sec-5-1-2 | lead |  | lead: R-02 is the indicator this engagement lives or dies on.… |
| C734 | measurement.md:35 | 5.1 The indicators › 5.1.2 Re-anchored: recognition and persuasion where he is least known | measurement-sec-5-1-2 | paragraph | keep | Followers are not the target. Being known in Mwingi is. |
| C735 | measurement.md:37 | 5.1 The indicators › 5.1.2 Re-anchored: recognition and persuasion where he is least known | measurement-sec-5-1-2 | paragraph |  | Section 5.1.3 already rejects vanity metrics. These five indicators say… |
| C736 | measurement.md:41 | 5.1 The indicators › 5.1.2 Re-anchored: recognition and persuasion where he is least known | measurement-sec-5-1-2 | visual `cards` |  | visual `cards`: Followers located in Mwingi North, Central and West |
| C737 | measurement.md:77 | 5.1 The indicators › 5.1.2 Re-anchored: recognition and persuasion where he is least known | measurement-sec-5-1-2 | paragraph |  | R-02 is the indicator this engagement lives or dies on.… |
| C738 | measurement.md:82 | 5.1 The indicators › 5.1.2 Re-anchored: recognition and persuasion where he is least known | measurement-sec-5-1-2 | paragraph |  | Excluded, and named so the exclusion is visible: total followers,… |
| C739 | measurement.md:87 | 5.1 The indicators › 5.1.3 Why vanity metrics are excluded | **measurement-sec-5-1-3** | heading |  | h3: 5.1.3 Why vanity metrics are excluded |
| C740 | measurement.md:89 | 5.1 The indicators › 5.1.3 Why vanity metrics are excluded | measurement-sec-5-1-3 | paragraph |  | The campaign excludes vanity metrics from all executive dashboards, reporting… |
| C741 | measurement.md:91 | 5.1 The indicators › 5.1.3 Why vanity metrics are excluded | measurement-sec-5-1-3 | visual `cards` |  | visual `cards`: Offline Reality |
| C742 | measurement.md:106 | 5.1 The indicators › 5.1.4 Performance governance and executive escalation | **measurement-sec-5-1-4** | heading |  | h3: 5.1.4 Performance governance and executive escalation |
| C743 | measurement.md:108 | 5.1 The indicators › 5.1.4 Performance governance and executive escalation | measurement-sec-5-1-4 | paragraph |  | To ensure accountability across all divisions, the KPI framework is… |
| C744 | measurement.md:110 | 5.1 The indicators › 5.1.4 Performance governance and executive escalation | measurement-sec-5-1-4 | visual `stepper` |  | visual `stepper`: Weekly Monday KPI Standup (08:00 EAT) |
| C745 | measurement.md:123 | 5.2 The presence audit: method | **measurement-sec-5-2** | heading |  | h2: 5.2 The presence audit: method |
| C746 | measurement.md:125 | 5.2 The presence audit: method | measurement-sec-5-2 | paragraph |  | The first work of the engagement: ninety days of Dr.… |
| C747 | measurement.md:127 | 5.2 The presence audit: method › 5.2.1 The measurement set | **measurement-sec-5-2-1** | heading |  | h3: 5.2.1 The measurement set |
| C748 | measurement.md:129 | 5.2 The presence audit: method › 5.2.1 The measurement set | measurement-sec-5-2-1 | visual `checklist` |  | visual `checklist`: Audience |
| C749 | measurement.md:166 | 5.2 The presence audit: method › 5.2.2 The window | **measurement-sec-5-2-2** | heading |  | h3: 5.2.2 The window |
| C750 | measurement.md:168 | 5.2 The presence audit: method › 5.2.2 The window | measurement-sec-5-2-2 | lead |  | lead: Ninety days: 18 June to 16 September 2026. It is… |
| C751 | measurement.md:172 | 5.2 The presence audit: method › 5.2.2 The window | measurement-sec-5-2-2 | paragraph |  | Ninety days: 18 June to 16 September 2026. Two reasons,… |
| C752 | measurement.md:174 | 5.2 The presence audit: method › 5.2.2 The window | measurement-sec-5-2-2 | list |  | list: 1. It is the longest window Meta exports at post… |
| C753 | measurement.md:178 | 5.2 The presence audit: method › 5.2.2 The window | measurement-sec-5-2-2 | paragraph |  | The follower-growth curve is pulled over twelve months instead, for… |
| C754 | measurement.md:181 | 5.2 The presence audit: method › 5.2.3 Why this comes first | **measurement-sec-5-2-3** | heading |  | h3: 5.2.3 Why this comes first |
| C755 | measurement.md:183 | 5.2 The presence audit: method › 5.2.3 Why this comes first | measurement-sec-5-2-3 | lead |  | lead: What it has never been asked is the only question… |
| C756 | measurement.md:187 | 5.2 The presence audit: method › 5.2.3 Why this comes first | measurement-sec-5-2-3 | paragraph |  | Every other analysis in this document is about Kitui —… |
| C757 | measurement.md:190 | 5.2 The presence audit: method › 5.2.3 Why this comes first | measurement-sec-5-2-3 | paragraph |  | A verified Facebook presence, roughly {channel.fb.followers} followers and {channel.fb.posts} posts… |
| C758 | measurement.md:195 | 5.2 The presence audit: method › 5.2.3 Why this comes first | measurement-sec-5-2-3 | paragraph |  | Section 2.7 establishes that {pool} registered voters — {pool.share}% of… |
| C759 | measurement.md:201 | 5.2 The presence audit: method › 5.2.4 Method | **measurement-sec-5-2-4** | heading |  | h3: 5.2.4 Method |
| C760 | measurement.md:203 | 5.2 The presence audit: method › 5.2.4 Method | measurement-sec-5-2-4 | visual `stepper` |  | visual `stepper`: Confirm Page or profile |
| C761 | measurement.md:226 | 5.2 The presence audit: method › 5.2.5 What this section is not | **measurement-sec-5-2-5** | heading |  | h3: 5.2.5 What this section is not |
| C762 | measurement.md:228 | 5.2 The presence audit: method › 5.2.5 What this section is not | measurement-sec-5-2-5 | lead |  | lead: It is not an appraisal of the people doing the… |
| C763 | measurement.md:232 | 5.2 The presence audit: method › 5.2.5 What this section is not | measurement-sec-5-2-5 | paragraph |  | It is not an appraisal of the people doing the… |
| C764 | measurement.md:237 | 5.2 The presence audit: method › 5.2.6 Testing the hypothesis on existing records | **measurement-sec-5-2-6** | heading |  | h3: 5.2.6 Testing the hypothesis on existing records |
| C765 | measurement.md:239 | 5.2 The presence audit: method › 5.2.6 Testing the hypothesis on existing records | measurement-sec-5-2-6 | lead |  | lead: The campaign tests the "Recognition-Deficit Hypothesis" on records that already… |
| C766 | measurement.md:245 | 5.2 The presence audit: method › 5.2.6 Testing the hypothesis on existing records | measurement-sec-5-2-6 | figure `research-and-tracker` |  | figure component `research-and-tracker` |
| C767 | measurement.md:249 | 5.2 The presence audit: method › 5.2.6 Testing the hypothesis on existing records | measurement-sec-5-2-6 | paragraph |  | Before committing the campaign's broadcast and caravan effort to Northern… |
| C768 | measurement.md:251 | 5.2 The presence audit: method › 5.2.6 Testing the hypothesis on existing records | measurement-sec-5-2-6 | figure `research-modules` |  | figure component `research-modules` |
| C769 | measurement.md:255 | 5.3 Data protection, ethics and compliance | **measurement-sec-5-3** | heading |  | h2: 5.3 Data protection, ethics and compliance |
| C770 | measurement.md:256 | 5.3 Data protection, ethics and compliance › 5.3.1 The standard we hold ourselves to | **measurement-sec-5-3-1** | heading |  | h3: 5.3.1 The standard we hold ourselves to |
| C771 | measurement.md:258 | 5.3 Data protection, ethics and compliance › 5.3.1 The standard we hold ourselves to | measurement-sec-5-3-1 | lead |  | lead: Voter data is handled in a manner intended to comply… |
| C772 | measurement.md:262 | 5.3 Data protection, ethics and compliance › 5.3.1 The standard we hold ourselves to | measurement-sec-5-3-1 | paragraph |  | Voter data is handled in a manner intended to comply… |
| C773 | measurement.md:268 | 5.3 Data protection, ethics and compliance › 5.3.1 The standard we hold ourselves to | measurement-sec-5-3-1 | paragraph | keep | Important framing: this section describes the campaign's intended standard and… |
| C774 | measurement.md:273 | 5.3 Data protection, ethics and compliance › 5.3.1 The standard we hold ourselves to | measurement-sec-5-3-1 | paragraph |  | Who the controller is, channel by channel. This engagement splits… |
| C775 | measurement.md:278 | 5.3 Data protection, ethics and compliance › 5.3.1 The standard we hold ourselves to | measurement-sec-5-3-1 | table | keep | table: Channel Operated by Controller position to be confirmed |
| C776 | measurement.md:284 | 5.3 Data protection, ethics and compliance › 5.3.1 The standard we hold ourselves to | measurement-sec-5-3-1 | visual `cards` |  | visual `cards`: NG-CDF and bursary beneficiary lists are off-limits for campaign contact. |
| C777 | measurement.md:298 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures | **measurement-sec-5-3-2** | heading |  | h3: 5.3.2 The regulatory environment and compliance measures |
| C778 | measurement.md:300 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures | measurement-sec-5-3-2 | lead |  | lead: Vendors openly market databases of millions of Kenyan mobile numbers.… |
| C779 | measurement.md:304 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › The regulatory environment as it stands | measurement-sec-5-3-2 | heading |  | h4: The regulatory environment as it stands |
| C780 | measurement.md:306 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › The regulatory environment as it stands | measurement-sec-5-3-2 | visual `checklist` |  | visual `checklist`: Political SMS |
| C781 | measurement.md:328 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › The regulatory environment as it stands | measurement-sec-5-3-2 | paragraph |  | The commercial reality this creates. Vendors openly market databases of… |
| C782 | measurement.md:334 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › Compliance measures | measurement-sec-5-3-2 | heading |  | h4: Compliance measures |
| C783 | measurement.md:336 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › Compliance measures | measurement-sec-5-3-2 | visual `checklist` |  | visual `checklist`: Collection |
| C784 | measurement.md:369 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › The Data Protection Act 2019, applied | measurement-sec-5-3-2 | heading |  | h4: The Data Protection Act 2019, applied |
| C785 | measurement.md:371 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › The Data Protection Act 2019, applied | measurement-sec-5-3-2 | paragraph |  | Political messaging, bulk SMS broadcasting, and voter profiling operate under… |
| C786 | measurement.md:373 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › The Data Protection Act 2019, applied | measurement-sec-5-3-2 | figure `dpa-compliance` |  | figure component `dpa-compliance` |
| C787 | measurement.md:377 | 5.3 Data protection, ethics and compliance › 5.3.2 The regulatory environment and compliance measures › The Data Protection Act 2019, applied | measurement-sec-5-3-2 | visual `checklist` |  | visual `checklist`: Mandatory Compliance Safeguards |
| C788 | measurement.md:391 | 5.3 Data protection, ethics and compliance › 5.3.3 The Digital Ethics and Data Charter | **measurement-sec-5-3-3** | heading |  | h3: 5.3.3 The Digital Ethics and Data Charter |
| C789 | measurement.md:393 | 5.3 Data protection, ethics and compliance › 5.3.3 The Digital Ethics and Data Charter | measurement-sec-5-3-3 | lead |  | lead: Because a commitment nobody can read is a policy, and… |
| C790 | measurement.md:398 | 5.3 Data protection, ethics and compliance › 5.3.3 The Digital Ethics and Data Charter | measurement-sec-5-3-3 | paragraph | keep | Published on the campaign website in all three languages, in… |
| C791 | measurement.md:401 | 5.3 Data protection, ethics and compliance › 5.3.3 The Digital Ethics and Data Charter | measurement-sec-5-3-3 | paragraph |  | Why publish it. Because a commitment nobody can read is… |
| C792 | measurement.md:410 | 5.3 Data protection, ethics and compliance › 5.3.3 The Digital Ethics and Data Charter | measurement-sec-5-3-3 | callout | keep | callout: DIGITAL ETHICS & DATA CHARTER Kwĩyumya kwa Ũthaithi — Ahadi… |
| C793 | measurement.md:474 | 5.3 Data protection, ethics and compliance › 5.3.3 The Digital Ethics and Data Charter | measurement-sec-5-3-3 | paragraph |  | Operational backing. Each clause maps to a control: the consent… |
| C794 | measurement.md:480 | 5.3 Data protection, ethics and compliance › 5.3.4 The compliance sign-off gate | **measurement-sec-5-3-4** | heading |  | h3: 5.3.4 The compliance sign-off gate |
| C795 | measurement.md:482 | 5.3 Data protection, ethics and compliance › 5.3.4 The compliance sign-off gate | measurement-sec-5-3-4 | lead |  | lead: Before any voter-file-based targeting, list-building beyond first-party consented data, or… |
| C796 | measurement.md:486 | 5.3 Data protection, ethics and compliance › 5.3.4 The compliance sign-off gate | measurement-sec-5-3-4 | paragraph |  | Before any voter-file-based targeting, list-building beyond first-party consented data, or… |
| C797 | measurement.md:492 | 5.3 Data protection, ethics and compliance › 5.3.4 The compliance sign-off gate | measurement-sec-5-3-4 | paragraph | keep | This proposal does not assert that the micro-targeting programme described… |
| C798 | measurement.md:498 | 5.3 Data protection, ethics and compliance › 5.3.4 The compliance sign-off gate | measurement-sec-5-3-4 | visual `checklist` |  | visual `checklist`: On what lawful basis, if any, may a campaign process… |
| C799 | measurement.md:508 | 5.3 Data protection, ethics and compliance › 5.3.4 The compliance sign-off gate | measurement-sec-5-3-4 | visual `stepper` |  | visual `stepper`: Process |
| C800 | measurement.md:536 | 5.3 Data protection, ethics and compliance › 5.3.4 The compliance sign-off gate | measurement-sec-5-3-4 | paragraph | keep | Until step 4 is complete, the campaign operates on first-party… |
| C801 | measurement.md:541 | 5.3 Data protection, ethics and compliance › 5.3.5 Statutory compliance, IEBC clearance and liability | **measurement-sec-5-3-5** | heading |  | h3: 5.3.5 Statutory compliance, IEBC clearance and liability |
| C802 | measurement.md:543 | 5.3 Data protection, ethics and compliance › 5.3.5 Statutory compliance, IEBC clearance and liability › Statutory and regulatory compliance | measurement-sec-5-3-5 | heading |  | h4: Statutory and regulatory compliance |
| C803 | measurement.md:545 | 5.3 Data protection, ethics and compliance › 5.3.5 Statutory compliance, IEBC clearance and liability › Statutory and regulatory compliance | measurement-sec-5-3-5 | paragraph |  | Operating with strict legal adherence is both an ethical mandate… |
| C804 | measurement.md:547 | 5.3 Data protection, ethics and compliance › 5.3.5 Statutory compliance, IEBC clearance and liability › Statutory and regulatory compliance | measurement-sec-5-3-5 | figure `compliance-architecture` |  | figure component `compliance-architecture` |
| C805 | measurement.md:551 | 5.3 Data protection, ethics and compliance › 5.3.5 Statutory compliance, IEBC clearance and liability › The IEBC nomination and clearance checklist | measurement-sec-5-3-5 | heading |  | h4: The IEBC nomination and clearance checklist |
| C806 | measurement.md:553 | 5.3 Data protection, ethics and compliance › 5.3.5 Statutory compliance, IEBC clearance and liability › The IEBC nomination and clearance checklist | measurement-sec-5-3-5 | figure `iebc-clearance` |  | figure component `iebc-clearance` |
| C807 | measurement.md:557 | 5.3 Data protection, ethics and compliance › 5.3.5 Statutory compliance, IEBC clearance and liability › Data protection and election offences liability | measurement-sec-5-3-5 | heading |  | h4: Data protection and election offences liability |
| C808 | measurement.md:559 | 5.3 Data protection, ethics and compliance › 5.3.5 Statutory compliance, IEBC clearance and liability › Data protection and election offences liability | measurement-sec-5-3-5 | figure `liability-matrix` |  | figure component `liability-matrix` |
| C809 | measurement.md:563 | 5.3 Data protection, ethics and compliance › 5.3.6 Open regulatory action items | **measurement-sec-5-3-6** | heading |  | h3: 5.3.6 Open regulatory action items |
| C810 | measurement.md:565 | 5.3 Data protection, ethics and compliance › 5.3.6 Open regulatory action items | measurement-sec-5-3-6 | lead |  | lead: Two ODPC documents are now identified by name and should… |
| C811 | measurement.md:569 | 5.3 Data protection, ethics and compliance › 5.3.6 Open regulatory action items | measurement-sec-5-3-6 | callout |  | callout: [!WARNING] COMPLIANCE ACTION ITEM — ODPC DIRECTIVE CONFIRMATION REQUIRED: While… |
| C812 | measurement.md:582 | 5.3 Data protection, ethics and compliance › 5.3.6 Open regulatory action items | measurement-sec-5-3-6 | visual `checklist` |  | visual `checklist`: Conduct a formal legal review with the ODPC registry to… |
| C813 | risks.md:3 | 6.1 Risks and responses | **risks-sec-6-1** | heading |  | h2: 6.1 Risks and responses |
| C814 | risks.md:5 | 6.1 Risks and responses | risks-sec-6-1 | paragraph |  | Six risks decide whether this plan survives contact. Everything after… |
| C815 | risks.md:8 | 6.1 Risks and responses | risks-sec-6-1 | figure `fig-5-8-risk` |  | figure component `fig-5-8-risk` |
| C816 | risks.md:12 | 6.1 Risks and responses | risks-sec-6-1 | textversion |  | text version: R1 and R2 are the two that change the plan… |
| C817 | risks.md:26 | 6.1 Risks and responses | risks-sec-6-1 | callout |  | callout: The runbooks are in Annex E. The four-tier response decision… |
| C818 | risks.md:33 | 6.2 Rapid response and the war room | **risks-sec-6-2** | heading |  | h2: 6.2 Rapid response and the war room |
| C819 | risks.md:35 | 6.2 Rapid response and the war room › 6.2.1 Rapid-response protocol and opposition handling | **risks-sec-6-2-1** | heading |  | h3: 6.2.1 Rapid-response protocol and opposition handling |
| C820 | risks.md:37 | 6.2 Rapid response and the war room › 6.2.1 Rapid-response protocol and opposition handling | risks-sec-6-2-1 | lead |  | lead: In Kitui County, ground rumors and hostile talking points travel… |
| C821 | risks.md:41 | 6.2 Rapid response and the war room › 6.2.1 Rapid-response protocol and opposition handling | risks-sec-6-2-1 | paragraph |  | In a high-stakes gubernatorial campaign, unchecked misinformation and coordinated political… |
| C822 | risks.md:43 | 6.2 Rapid response and the war room › 6.2.1 Rapid-response protocol and opposition handling | risks-sec-6-2-1 | paragraph |  | The campaign enforces a disciplined Rapid Response & Opposition Handling… |
| C823 | risks.md:45 | 6.2 Rapid response and the war room › 6.2.1 Rapid-response protocol and opposition handling | risks-sec-6-2-1 | figure `rapid-response-flow` |  | figure component `rapid-response-flow` |
| C824 | risks.md:49 | 6.2 Rapid response and the war room › 6.2.1 Rapid-response protocol and opposition handling | risks-sec-6-2-1 | paragraph |  | Expect the scorecard's numbers. The incumbent's Delivering the Kitui Promise… |
| C825 | risks.md:51 | 6.2 Rapid response and the war room › 6.2.2 What we monitor, and how threats reach us | **risks-sec-6-2-2** | heading |  | h3: 6.2.2 What we monitor, and how threats reach us |
| C826 | risks.md:53 | 6.2 Rapid response and the war room › 6.2.2 What we monitor, and how threats reach us | risks-sec-6-2-2 | paragraph |  | The campaign monitors four complementary intelligence streams 24 hours a… |
| C827 | risks.md:55 | 6.2 Rapid response and the war room › 6.2.2 What we monitor, and how threats reach us | risks-sec-6-2-2 | visual `cards` |  | visual `cards`: Broadcast Vernacular Radio Triage (06:00–21:00 EAT) |
| C828 | risks.md:68 | 6.2 Rapid response and the war room › 6.2.3 Staying inside defamation law | **risks-sec-6-2-3** | heading |  | h3: 6.2.3 Staying inside defamation law |
| C829 | risks.md:70 | 6.2 Rapid response and the war room › 6.2.3 Staying inside defamation law | risks-sec-6-2-3 | paragraph |  | All campaign communicators, surrogates, and media buyers are bound by… |
| C830 | risks.md:72 | 6.2 Rapid response and the war room › 6.2.3 Staying inside defamation law | risks-sec-6-2-3 | visual `cards` |  | visual `cards`: Rule 1: Focus on Public Audit Records, Never Private Character |
| C831 | risks.md:86 | 6.2 Rapid response and the war room › 6.2.4 War room operating model, shift coverage and dashboard view | **risks-sec-6-2-4** | heading |  | h3: 6.2.4 War room operating model, shift coverage and dashboard view |
| C832 | risks.md:88 | 6.2 Rapid response and the war room › 6.2.4 War room operating model, shift coverage and dashboard view | risks-sec-6-2-4 | paragraph |  | The war room is the campaign's nerve centre for monitoring,… |
| C833 | risks.md:91 | 6.2 Rapid response and the war room › 6.2.4 War room operating model, shift coverage and dashboard view | risks-sec-6-2-4 | paragraph |  | During peak periods (January–August 2027), the war room operates on… |
| C834 | risks.md:92 | 6.2 Rapid response and the war room › 6.2.4 War room operating model, shift coverage and dashboard view | risks-sec-6-2-4 | table |  | table: Shift Hours (EAT) Focus |
| C835 | risks.md:98 | 6.2 Rapid response and the war room › 6.2.4 War room operating model, shift coverage and dashboard view | risks-sec-6-2-4 | paragraph |  | The command console centralises real-time metrics: live sentiment score; trending… |
| C836 | risks.md:100 | 6.3 Manipulated media and cybersecurity | **risks-sec-6-3** | heading |  | h2: 6.3 Manipulated media and cybersecurity |
| C837 | risks.md:101 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | **risks-sec-6-3-1** | heading |  | h3: 6.3.1 The deepfake and manipulated media protocol |
| C838 | risks.md:103 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | lead |  | lead: AI-generated video of serving Kenyan public figures has already circulated… |
| C839 | risks.md:107 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | paragraph |  | The threat that most warrants specific preparation. |
| C840 | risks.md:109 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | paragraph |  | Context. AI-generated video of serving Kenyan public figures has already… |
| C841 | risks.md:117 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | paragraph | keep | The two-sided risk. The obvious risk is a fabricated clip… |
| C842 | risks.md:123 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | visual `checklist` |  | visual `checklist`: Prevention — provenance by default |
| C843 | risks.md:133 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | visual `checklist` |  | visual `checklist`: Detection |
| C844 | risks.md:142 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | visual `timeline` |  | visual `timeline`: Rapid rebuttal — Level 3, 30-minute clock |
| C845 | risks.md:161 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | paragraph |  | The SMS component is what makes this work in Kitui.… |
| C846 | risks.md:167 | 6.3 Manipulated media and cybersecurity › 6.3.1 The deepfake and manipulated media protocol | risks-sec-6-3-1 | paragraph | keep | Standing rule: the campaign never claims genuine material is fabricated.… |
| C847 | risks.md:173 | 6.4 Competitor monitoring | **risks-sec-6-4** | heading |  | h2: 6.4 Competitor monitoring |
| C848 | risks.md:175 | 6.4 Competitor monitoring | risks-sec-6-4 | paragraph |  | Analysis of the rivals themselves is in 2.6.4; the tools… |
| C849 | risks.md:177 | 6.4 Competitor monitoring › 6.4.1 Public sources only, and the line we do not cross | **risks-sec-6-4-1** | heading |  | h3: 6.4.1 Public sources only, and the line we do not… |
| C850 | risks.md:179 | 6.4 Competitor monitoring › 6.4.1 Public sources only, and the line we do not cross | risks-sec-6-4-1 | paragraph |  | Systematic, lawful, public-source tracking of rivals' digital activity to anticipate… |
| C851 | risks.md:182 | 6.4 Competitor monitoring › 6.4.1 Public sources only, and the line we do not cross | risks-sec-6-4-1 | paragraph |  | Boundary. Public sources only: published ad libraries, public posts, public… |
| C852 | risks.md:188 | 6.5 If it becomes a delegate primary | **risks-sec-6-5** | heading |  | h2: 6.5 If it becomes a delegate primary |
| C853 | risks.md:190 | 6.5 If it becomes a delegate primary | risks-sec-6-5 | lead |  | lead: If Wiper party leadership departs from the reported countywide selection… |
| C854 | risks.md:194 | 6.5 If it becomes a delegate primary | risks-sec-6-5 | paragraph |  | If Wiper party leadership departs from the reported countywide selection… |
| C855 | risks.md:195 | 6.5 If it becomes a delegate primary | risks-sec-6-5 | visual `stepper` |  | visual `stepper`: Map the Delegate Registry |
| C856 | risks.md:208 | 6.5 If it becomes a delegate primary | risks-sec-6-5 | callout |  | callout: The evidence standard (A.1) is in Annex A , with… |
| C857 | annex-evidence.md:1 | (preamble) | — | paragraph |  | ANNEX A. The provenance rules every figure in this proposal… |
| C858 | annex-evidence.md:3 | A.1 Evidence standard: provenance and source tiers | **annex-evidence-sec-a-1** | heading |  | h2: A.1 Evidence standard: provenance and source tiers |
| C859 | annex-evidence.md:4 | A.1 Evidence standard: provenance and source tiers › A.1.1 Every figure carries its provenance | **annex-evidence-sec-a-1-1** | heading |  | h3: A.1.1 Every figure carries its provenance |
| C860 | annex-evidence.md:6 | A.1 Evidence standard: provenance and source tiers › A.1.1 Every figure carries its provenance | annex-evidence-sec-a-1-1 | paragraph |  | To ensure zero "data drift" across the strategic command, every… |
| C861 | annex-evidence.md:8 | A.1 Evidence standard: provenance and source tiers › A.1.1 Every figure carries its provenance | annex-evidence-sec-a-1-1 | figure `provenance-mandate` |  | figure component `provenance-mandate` |
| C862 | annex-evidence.md:12 | A.1 Evidence standard: provenance and source tiers › A.1.1 Every figure carries its provenance | annex-evidence-sec-a-1-1 | paragraph |  | Rule of Implementation: Any metric presented without all three parameters… |
| C863 | annex-evidence.md:14 | A.1 Evidence standard: provenance and source tiers › A.1.2 The three source tiers | **annex-evidence-sec-a-1-2** | heading |  | h3: A.1.2 The three source tiers |
| C864 | annex-evidence.md:16 | A.1 Evidence standard: provenance and source tiers › A.1.2 The three source tiers | annex-evidence-sec-a-1-2 | paragraph |  | The campaign classifies all intelligence into three evidential tiers: |
| C865 | annex-evidence.md:18 | A.1 Evidence standard: provenance and source tiers › A.1.2 The three source tiers | annex-evidence-sec-a-1-2 | figure `tier-classification` |  | figure component `tier-classification` |
| C866 | annex-evidence.md:22 | A.1 Evidence standard: provenance and source tiers › A.1.2 The three source tiers | annex-evidence-sec-a-1-2 | visual `cards` |  | visual `cards`: Standard Implementation Rules |
| C867 | annex-evidence.md:35 | A.1 Evidence standard: provenance and source tiers › A.1.2 The three source tiers › The Kitui source pack (October 2026), and how each document is tiered | annex-evidence-sec-a-1-2 | heading |  | h4: The Kitui source pack (October 2026), and how each document… |
| C868 | annex-evidence.md:37 | A.1 Evidence standard: provenance and source tiers › A.1.2 The three source tiers › The Kitui source pack (October 2026), and how each document is tiered | annex-evidence-sec-a-1-2 | table |  | table: Document Publisher, date Basis Tier |
| C869 | annex-evidence.md:44 | A.1 Evidence standard: provenance and source tiers › A.1.3 When two sources disagree | **annex-evidence-sec-a-1-3** | heading |  | h3: A.1.3 When two sources disagree |
| C870 | annex-evidence.md:46 | A.1 Evidence standard: provenance and source tiers › A.1.3 When two sources disagree | annex-evidence-sec-a-1-3 | paragraph |  | When multiple sources report conflicting metrics (e.g., voter registration counts,… |
| C871 | annex-evidence.md:48 | A.1 Evidence standard: provenance and source tiers › A.1.3 When two sources disagree | annex-evidence-sec-a-1-3 | figure `conflict-protocol` |  | figure component `conflict-protocol` |
| C872 | annex-evidence.md:52 | A.1 Evidence standard: provenance and source tiers › A.1.3 When two sources disagree | annex-evidence-sec-a-1-3 | paragraph |  | Ban on Guesswork: Under no circumstance will the analytics team… |
| C873 | annex-evidence.md:56 | A.1 Evidence standard: provenance and source tiers › A.1.4 The standard applied to our own measurement | **annex-evidence-sec-a-1-4** | heading |  | h3: A.1.4 The standard applied to our own measurement |
| C874 | annex-evidence.md:58 | A.1 Evidence standard: provenance and source tiers › A.1.4 The standard applied to our own measurement | annex-evidence-sec-a-1-4 | lead |  | lead: The presence audit in Section 4.2.1 is held to the… |
| C875 | annex-evidence.md:62 | A.1 Evidence standard: provenance and source tiers › A.1.4 The standard applied to our own measurement | annex-evidence-sec-a-1-4 | paragraph |  | The presence audit in Section 4.2.1 is held to the… |
| C876 | annex-evidence.md:64 | A.1 Evidence standard: provenance and source tiers › A.1.4 The standard applied to our own measurement | annex-evidence-sec-a-1-4 | visual `checklist` |  | visual `checklist`: Provenance |
| C877 | annex-county.md:1 | (preamble) | — | paragraph |  | ANNEX B. County reference: the 40-ward register, the audit record,… |
| C878 | annex-county.md:3 | B.1 The 40-ward register | **annex-county-sec-b-1** | heading |  | h2: B.1 The 40-ward register |
| C879 | annex-county.md:5 | B.1 The 40-ward register | annex-county-sec-b-1 | paragraph |  | Registered voters per county assembly ward, 2022 (IEBC, Tier 1).… |
| C880 | annex-county.md:7 | B.1 The 40-ward register › 1. Mwingi North Constituency ({{con.mwingi-north}} total registered voters, Tier 1) | annex-county-sec-b-1 | heading |  | h4: 1. Mwingi North Constituency ({con.mwingi-north} total registered voters, Tier 1) |
| C881 | annex-county.md:8 | B.1 The 40-ward register › 1. Mwingi North Constituency ({{con.mwingi-north}} total registered voters, Tier 1) | annex-county-sec-b-1 | list |  | list: Kyuso Ward: {ward.kyuso} voters Tseikuru Ward: {ward.tseikuru} voters Mumoni Ward:… |
| C882 | annex-county.md:14 | B.1 The 40-ward register › 2. Mwingi West Constituency ({{con.mwingi-west}} total registered voters, Tier 1) | annex-county-sec-b-1 | heading |  | h4: 2. Mwingi West Constituency ({con.mwingi-west} total registered voters, Tier 1) |
| C883 | annex-county.md:15 | B.1 The 40-ward register › 2. Mwingi West Constituency ({{con.mwingi-west}} total registered voters, Tier 1) | annex-county-sec-b-1 | list |  | list: Nguutani Ward: {ward.nguutani} voters Kyome/Thaana Ward: {ward.kyome-thaana} voters Migwani Ward:… |
| C884 | annex-county.md:20 | B.1 The 40-ward register › 3. Mwingi Central Constituency ({{con.mwingi-central}} total registered voters, Tier 1) | annex-county-sec-b-1 | heading |  | h4: 3. Mwingi Central Constituency ({con.mwingi-central} total registered voters, Tier 1) |
| C885 | annex-county.md:21 | B.1 The 40-ward register › 3. Mwingi Central Constituency ({{con.mwingi-central}} total registered voters, Tier 1) | annex-county-sec-b-1 | list |  | list: Central Ward: {ward.central} voters Nguni Ward: {ward.nguni} voters Nuu Ward:… |
| C886 | annex-county.md:28 | B.1 The 40-ward register › 4. Kitui West Constituency ({{con.kitui-west}} total registered voters, Tier 1) | annex-county-sec-b-1 | heading |  | h4: 4. Kitui West Constituency ({con.kitui-west} total registered voters, Tier 1) |
| C887 | annex-county.md:29 | B.1 The 40-ward register › 4. Kitui West Constituency ({{con.kitui-west}} total registered voters, Tier 1) | annex-county-sec-b-1 | list |  | list: Mutonguni Ward: {ward.mutonguni} voters Kauwi Ward: {ward.kauwi} voters Matinyani Ward:… |
| C888 | annex-county.md:34 | B.1 The 40-ward register › 5. Kitui Rural Constituency ({{con.kitui-rural}} total registered voters, Tier 1) | annex-county-sec-b-1 | heading |  | h4: 5. Kitui Rural Constituency ({con.kitui-rural} total registered voters, Tier 1) |
| C889 | annex-county.md:35 | B.1 The 40-ward register › 5. Kitui Rural Constituency ({{con.kitui-rural}} total registered voters, Tier 1) | annex-county-sec-b-1 | list |  | list: Kwa Vonza/Yatta Ward: {ward.kwa-vonza-yatta} voters Kisasi Ward: {ward.kisasi} voters Mbitini… |
| C890 | annex-county.md:40 | B.1 The 40-ward register › 6. Kitui Central Constituency ({{con.kitui-central}} total registered voters, Tier 1) | annex-county-sec-b-1 | heading |  | h4: 6. Kitui Central Constituency ({con.kitui-central} total registered voters, Tier 1) |
| C891 | annex-county.md:41 | B.1 The 40-ward register › 6. Kitui Central Constituency ({{con.kitui-central}} total registered voters, Tier 1) | annex-county-sec-b-1 | list |  | list: Township Ward: {ward.township} voters Kyangwithya West Ward: {ward.kyangwithya-west} voters Kyangwithya… |
| C892 | annex-county.md:47 | B.1 The 40-ward register › 7. Kitui East Constituency ({{con.kitui-east}} total registered voters, Tier 1) | annex-county-sec-b-1 | heading |  | h4: 7. Kitui East Constituency ({con.kitui-east} total registered voters, Tier 1) |
| C893 | annex-county.md:48 | B.1 The 40-ward register › 7. Kitui East Constituency ({{con.kitui-east}} total registered voters, Tier 1) | annex-county-sec-b-1 | list |  | list: Zombe/Mwitika Ward: {ward.zombe-mwitika} voters Chuluni Ward: {ward.chuluni} voters Nzambani Ward:… |
| C894 | annex-county.md:55 | B.1 The 40-ward register › 8. Kitui South Constituency ({{con.kitui-south}} total registered voters, Tier 1) | annex-county-sec-b-1 | heading |  | h4: 8. Kitui South Constituency ({con.kitui-south} total registered voters, Tier 1) |
| C895 | annex-county.md:56 | B.1 The 40-ward register › 8. Kitui South Constituency ({{con.kitui-south}} total registered voters, Tier 1) | annex-county-sec-b-1 | list |  | list: Athi Ward: {ward.athi} voters Ikanga/Kyatune Ward: {ward.ikanga-kyatune} voters Mutomo Ward:… |
| C896 | annex-county.md:63 | B.2 County money and the audit record | **annex-county-sec-b-2** | heading |  | h2: B.2 County money and the audit record |
| C897 | annex-county.md:65 | B.2 County money and the audit record | annex-county-sec-b-2 | lead |  | lead: According to the Office of the Auditor-General's FY2023/24 audit report,… |
| C898 | annex-county.md:69 | B.2 County money and the audit record | annex-county-sec-b-2 | paragraph |  | According to the Office of the Auditor-General's FY2023/24 audit report,… |
| C899 | annex-county.md:70 | B.2 County money and the audit record | annex-county-sec-b-2 | list |  | list: Unconfirmed Cash Balances: KSh {audit.cash} (Tier 1). Uncollected County Rates… |
| C900 | annex-county.md:75 | B.2 County money and the audit record | annex-county-sec-b-2 | paragraph |  | Additionally, Controller of Budget reports indicate that the county carried… |
| C901 | annex-county.md:77 | B.2 County money and the audit record › The incumbent's scorecard: where the itemised money went | annex-county-sec-b-2 | heading |  | h4: The incumbent's scorecard: where the itemised money went |
| C902 | annex-county.md:79 | B.2 County money and the audit record › The incumbent's scorecard: where the itemised money went | annex-county-sec-b-2 | paragraph |  | The county's Delivering the Kitui Promise scorecard (August 2022 –… |
| C903 | annex-county.md:81 | B.2 County money and the audit record › The incumbent's scorecard: where the itemised money went | annex-county-sec-b-2 | table |  | table: Constituency Projects KSh, itemised KSh per registered voter (2022) |
| C904 | annex-county.md:93 | B.2 County money and the audit record › The incumbent's scorecard: where the itemised money went | annex-county-sec-b-2 | paragraph |  | How to read it, and how not to. It covers… |
| C905 | annex-county.md:95 | B.3 Drought, food security and climate pressure | **annex-county-sec-b-3** | heading |  | h2: B.3 Drought, food security and climate pressure |
| C906 | annex-county.md:97 | B.3 Drought, food security and climate pressure | annex-county-sec-b-3 | lead |  | lead: Kitui's food security remains classified under IPC Phase 2 ("Stressed")… |
| C907 | annex-county.md:101 | B.3 Drought, food security and climate pressure | annex-county-sec-b-3 | paragraph |  | The county's climate profile features multi-directional hazards, as documented by… |
| C908 | annex-county.md:103 | B.3 Drought, food security and climate pressure | annex-county-sec-b-3 | paragraph |  | The long rains of 2025 (NDMA, July 2025, Tier 1).… |
| C909 | annex-county.md:105 | B.3 Drought, food security and climate pressure | annex-county-sec-b-3 | table |  | table: Rank Sub-county In the pool? Hotspot wards NDMA names |
| C910 | annex-county.md:116 | B.3 Drought, food security and climate pressure | annex-county-sec-b-3 | paragraph |  | NDMA names hotspot wards in every sub-county, the home base… |
| C911 | annex-county.md:118 | B.4 Mui Basin coal and the displaced communities | **annex-county-sec-b-4** | heading |  | h2: B.4 Mui Basin coal and the displaced communities |
| C912 | annex-county.md:120 | B.4 Mui Basin coal and the displaced communities | annex-county-sec-b-4 | lead |  | lead: The extensive coal deposits in the Mui Basin, straddling Kitui… |
| C913 | annex-county.md:124 | B.4 Mui Basin coal and the displaced communities | annex-county-sec-b-4 | paragraph |  | The extensive coal deposits in the Mui Basin, straddling Kitui… |
| C914 | annex-county.md:126 | B.5 Each rival, and the legal ground to be careful on | **annex-county-sec-b-5** | heading |  | h2: B.5 Each rival, and the legal ground to be careful… |
| C915 | annex-county.md:128 | B.5 Each rival, and the legal ground to be careful on | annex-county-sec-b-5 | lead |  | lead: Every adverse claim is explicitly attributed to its source, and… |
| C916 | annex-county.md:132 | B.5 Each rival, and the legal ground to be careful on | annex-county-sec-b-5 | paragraph |  | The general election field is treated with strict legal caution.… |
| C917 | annex-county.md:134 | B.5 Each rival, and the legal ground to be careful on | annex-county-sec-b-5 | paragraph |  | The field itself is analysed in 2.6; each line below… |
| C918 | annex-county.md:136 | B.5 Each rival, and the legal ground to be careful on | annex-county-sec-b-5 | list |  | list: Dr. Irene Kasalu (Woman Representative): Her 2022 countywide result (Section… |
| C919 | annex-messages.md:1 | (preamble) | — | paragraph |  | ANNEX C. Message assignment by segment and by channel —… |
| C920 | annex-messages.md:3 | C.1 Message assignment by segment | **annex-messages-sec-c-1** | heading |  | h2: C.1 Message assignment by segment |
| C921 | annex-messages.md:5 | C.1 Message assignment by segment | annex-messages-sec-c-1 | lead |  | lead: No segment in these grids carries a size. The grids… |
| C922 | annex-messages.md:9 | C.1 Message assignment by segment | annex-messages-sec-c-1 | callout |  | callout: Re-cut against the production pillars in Section 3.7. The segment… |
| C923 | annex-messages.md:15 | C.1 Message assignment by segment | annex-messages-sec-c-1 | paragraph |  | Cross-referencing the demographic and livelihood segments established in Section 3.4.2… |
| C924 | annex-messages.md:17 | C.1 Message assignment by segment | annex-messages-sec-c-1 | callout |  | callout: These segments overlap, and the percentages are shares of the… |
| C925 | annex-messages.md:33 | C.1 Message assignment by segment | annex-messages-sec-c-1 | figure `message-by-segment` |  | figure component `message-by-segment` |
| C926 | annex-messages.md:37 | C.1 Message assignment by segment | annex-messages-sec-c-1 | paragraph |  | Messaging is tailored to distinct economic realities, geographic interests and… |
| C927 | annex-messages.md:40 | C.1 Message assignment by segment | annex-messages-sec-c-1 | paragraph |  | Segmentation principle and hard constraint. Segmentation is by economic interest,… |
| C928 | annex-messages.md:51 | C.1 Message assignment by segment | annex-messages-sec-c-1 | table |  | table: Voter Segment Demographics & Primary Hubs Core Priorities Tailored Messaging… |
| C929 | annex-messages.md:61 | C.1 Message assignment by segment | annex-messages-sec-c-1 | paragraph |  | The final row is the most commercially significant addition in… |
| C930 | annex-messages.md:66 | C.2 Message assignment by channel | **annex-messages-sec-c-2** | heading |  | h2: C.2 Message assignment by channel |
| C931 | annex-messages.md:68 | C.2 Message assignment by channel | annex-messages-sec-c-2 | paragraph |  | Cross-referencing the channel reach realities established in Section 2.9.3 : |
| C932 | annex-messages.md:70 | C.2 Message assignment by channel | annex-messages-sec-c-2 | figure `message-by-channel` |  | figure component `message-by-channel` |
| C933 | annex-cadence.md:1 | (preamble) | — | paragraph |  | ANNEX D. The meeting cadence and the escalation protocol, in… |
| C934 | annex-cadence.md:3 | D.1 Cadence and the meeting rhythm | **annex-cadence-sec-d-1** | heading |  | h2: D.1 Cadence and the meeting rhythm |
| C935 | annex-cadence.md:5 | D.1 Cadence and the meeting rhythm | annex-cadence-sec-d-1 | lead |  | lead: This annex now carries only the rhythm the engagement itself… |
| C936 | annex-cadence.md:10 | D.1 Cadence and the meeting rhythm | annex-cadence-sec-d-1 | table | keep | table: Cadence Meeting Participants Output |
| C937 | annex-cadence.md:21 | D.1 Cadence and the meeting rhythm | annex-cadence-sec-d-1 | paragraph |  | The four-forum leadership cadence that stood here set the campaign's… |
| C938 | annex-cadence.md:28 | D.2 The escalation path | **annex-cadence-sec-d-2** | heading |  | h2: D.2 The escalation path |
| C939 | annex-cadence.md:30 | D.2 The escalation path | annex-cadence-sec-d-2 | paragraph |  | To prevent decision bottlenecks and operational confusion during high-pressure field… |
| C940 | annex-cadence.md:32 | D.2 The escalation path | annex-cadence-sec-d-2 | figure `escalation-ladder` |  | figure component `escalation-ladder` |
| C941 | annex-runbooks.md:1 | (preamble) | — | paragraph |  | ANNEX E. The runbooks: the rapid-response decision tree and its… |
| C942 | annex-runbooks.md:3 | E.1 The four-tier response decision tree | **annex-runbooks-sec-e-1** | heading |  | h2: E.1 The four-tier response decision tree |
| C943 | annex-runbooks.md:5 | E.1 The four-tier response decision tree | annex-runbooks-sec-e-1 | paragraph |  | To avoid elevating fringe attacks or wasting campaign capital, the… |
| C944 | annex-runbooks.md:7 | E.1 The four-tier response decision tree | annex-runbooks-sec-e-1 | figure `response-matrix` |  | figure component `response-matrix` |
| C945 | annex-runbooks.md:11 | E.2 Response times, by channel | **annex-runbooks-sec-e-2** | heading |  | h2: E.2 Response times, by channel |
| C946 | annex-runbooks.md:13 | E.2 Response times, by channel | annex-runbooks-sec-e-2 | figure `response-sla` |  | figure component `response-sla` |
| C947 | annex-runbooks.md:17 | E.3 Holding positions, pre-drafted | **annex-runbooks-sec-e-3** | heading |  | h2: E.3 Holding positions, pre-drafted |
| C948 | annex-runbooks.md:19 | E.3 Holding positions, pre-drafted | annex-runbooks-sec-e-3 | paragraph |  | The campaign maintains ready-to-deploy holding positions, evidential citations, and Kikamba… |
| C949 | annex-runbooks.md:21 | E.3 Holding positions, pre-drafted | annex-runbooks-sec-e-3 | figure `holding-positions` |  | figure component `holding-positions` |
| C950 | annex-runbooks.md:25 | E.4 Monitoring tools | **annex-runbooks-sec-e-4** | heading |  | h2: E.4 Monitoring tools |
| C951 | annex-runbooks.md:27 | E.4 Monitoring tools | annex-runbooks-sec-e-4 | visual `checklist` |  | visual `checklist`: Social monitoring dashboards |
| C952 | annex-runbooks.md:48 | E.5 Rapid-response protocol and pre-approved message library | **annex-runbooks-sec-e-5** | heading |  | h2: E.5 Rapid-response protocol and pre-approved message library |
| C953 | annex-runbooks.md:50 | E.5 Rapid-response protocol and pre-approved message library | annex-runbooks-sec-e-5 | visual `checklist` |  | visual `checklist`: Level 1 |
| C954 | annex-runbooks.md:70 | E.5 Rapid-response protocol and pre-approved message library | annex-runbooks-sec-e-5 | paragraph |  | To execute rapid containment without awaiting ad-hoc legal drafting, a… |
| C955 | annex-runbooks.md:71 | E.5 Rapid-response protocol and pre-approved message library | annex-runbooks-sec-e-5 | visual `checklist` |  | visual `checklist`: Standard rebuttals for false claims about Dr. Mulu's record |
| C956 | annex-runbooks.md:81 | E.6 Red-team drills | **annex-runbooks-sec-e-6** | heading |  | h2: E.6 Red-team drills |
| C957 | annex-runbooks.md:83 | E.6 Red-team drills | annex-runbooks-sec-e-6 | lead |  | lead: Quarterly at standard tier, monthly at premium, with a mandatory… |
| C958 | annex-runbooks.md:87 | E.6 Red-team drills | annex-runbooks-sec-e-6 | paragraph |  | Reactive protocols fail because they are first used under real… |
| C959 | annex-runbooks.md:89 | E.6 Red-team drills | annex-runbooks-sec-e-6 | paragraph |  | Cadence: quarterly at standard tier, monthly at premium, with a… |
| C960 | annex-runbooks.md:93 | E.6 Red-team drills | annex-runbooks-sec-e-6 | paragraph |  | Method: a small red-team panel — Firefly's crisis lead, one… |
| C961 | annex-runbooks.md:98 | E.6 Red-team drills | annex-runbooks-sec-e-6 | visual `checklist` |  | visual `checklist`: Standing scenario library |
| C962 | annex-runbooks.md:122 | E.6 Red-team drills | annex-runbooks-sec-e-6 | paragraph |  | Output: every drill produces a written report — actual response… |
| C963 | annex-runbooks.md:128 | E.6 Red-team drills | annex-runbooks-sec-e-6 | paragraph |  | KPI: by Phase 2, 90% of drill responses meet their… |
| C964 | annex-runbooks.md:133 | E.7 The threat model | **annex-runbooks-sec-e-7** | heading |  | h2: E.7 The threat model |
| C965 | annex-runbooks.md:135 | E.7 The threat model | annex-runbooks-sec-e-7 | lead |  | lead: Kenyan campaigns face account takeover, phishing of staff and volunteers,… |
| C966 | annex-runbooks.md:139 | E.7 The threat model | annex-runbooks-sec-e-7 | paragraph |  | Kenyan campaigns face account takeover, phishing of staff and volunteers,… |
| C967 | annex-runbooks.md:146 | E.7 The threat model | annex-runbooks-sec-e-7 | visual `checklist` |  | visual `checklist`: Compromise of the candidate's own social accounts |
| C968 | annex-runbooks.md:156 | E.8 Account security baseline | **annex-runbooks-sec-e-8** | heading |  | h2: E.8 Account security baseline |
| C969 | annex-runbooks.md:158 | E.8 Account security baseline | annex-runbooks-sec-e-8 | lead |  | lead: Hardware keys for the candidate and admins are non-negotiable and… |
| C970 | annex-runbooks.md:162 | E.8 Account security baseline | annex-runbooks-sec-e-8 | visual `checklist` |  | visual `checklist`: Hardware security keys (FIDO2) for two-factor authentication |
| C971 | annex-runbooks.md:195 | E.8 Account security baseline | annex-runbooks-sec-e-8 | paragraph |  | Hardware keys for the candidate and admins are non-negotiable and… |
| C972 | annex-runbooks.md:199 | E.9 Phishing awareness | **annex-runbooks-sec-e-9** | heading |  | h2: E.9 Phishing awareness |
| C973 | annex-runbooks.md:201 | E.9 Phishing awareness | annex-runbooks-sec-e-9 | visual `checklist` |  | visual `checklist`: Onboarding training for every staff member and Tier 3–4 volunteer… |
| C974 | annex-runbooks.md:210 | E.10 The incident response plan | **annex-runbooks-sec-e-10** | heading |  | h2: E.10 The incident response plan |
| C975 | annex-runbooks.md:212 | E.10 The incident response plan | annex-runbooks-sec-e-10 | visual `timeline` |  | visual `timeline`: Detect |
| C976 | annex-runbooks.md:247 | E.10 The incident response plan | annex-runbooks-sec-e-10 | paragraph |  | Leaked material protocol. If internal material surfaces publicly, the campaign… |
| C977 | annex-runbooks.md:252 | E.12 Competitive intelligence outputs and rapid alerts | **annex-runbooks-sec-e-12** | heading |  | h2: E.12 Competitive intelligence outputs and rapid alerts |
| C978 | annex-runbooks.md:254 | E.12 Competitive intelligence outputs and rapid alerts | annex-runbooks-sec-e-12 | lead |  | lead: The competitive intelligence workflow produces two operational outputs: the monthly… |
| C979 | annex-runbooks.md:258 | E.12 Competitive intelligence outputs and rapid alerts | annex-runbooks-sec-e-12 | paragraph |  | The competitive intelligence workflow produces two operational outputs: |
| C980 | annex-runbooks.md:260 | E.12 Competitive intelligence outputs and rapid alerts | annex-runbooks-sec-e-12 | list |  | list: 1. The monthly competitive brief: Rival digital activity: platforms, posting… |
| C981 | annex-runbooks.md:268 | E.12 Competitive intelligence outputs and rapid alerts › Competitor monitoring tools | annex-runbooks-sec-e-12 | heading |  | h4: Competitor monitoring tools |
| C982 | annex-runbooks.md:270 | E.12 Competitive intelligence outputs and rapid alerts › Competitor monitoring tools | annex-runbooks-sec-e-12 | table |  | table: Tool Function |
| C983 | annex-terms.md:2 | F.1 Confidentiality and use | **annex-terms-sec-f-1** | heading |  | h2: F.1 Confidentiality and use |
| C984 | annex-terms.md:5 | F.1 Confidentiality and use | annex-terms-sec-f-1 | paragraph | keep | This proposal is for Dr. Mulu. It is not addressed… |
| C985 | annex-terms.md:11 | F.1 Confidentiality and use | annex-terms-sec-f-1 | paragraph | keep | It should not be circulated beyond the campaign's decision-making group,… |
| C986 | annex-terms.md:16 | F.1 Confidentiality and use | annex-terms-sec-f-1 | paragraph | keep | Nothing in this document constitutes a binding commitment by either… |
| C987 | annex-terms.md:21 | F.1 Confidentiality and use | annex-terms-sec-f-1 | paragraph |  | Who this proposal is for, who prepared it, and its… |
| C988 | annex-spec.md:1 | (preamble) | — | paragraph |  | ANNEX G. Channel and technical specifications: the platform playbooks, formats… |
| C989 | annex-spec.md:3 | G.1 Platform playbooks | **annex-spec-sec-g-1** | heading |  | h2: G.1 Platform playbooks |
| C990 | annex-spec.md:5 | G.1 Platform playbooks | annex-spec-sec-g-1 | visual `cards` |  | visual `cards`: Facebook |
| C991 | annex-spec.md:34 | G.2 Formats, copy samples and USSD pointer | **annex-spec-sec-g-2** | heading |  | h2: G.2 Formats, copy samples and USSD pointer |
| C992 | annex-spec.md:36 | G.2 Formats, copy samples and USSD pointer | annex-spec-sec-g-2 | lead |  | lead: The shortcode and sender ID are those the aggregator provisions… |
| C993 | annex-spec.md:40 | G.2 Formats, copy samples and USSD pointer › Formats, by channel | annex-spec-sec-g-2 | heading |  | h4: Formats, by channel |
| C994 | annex-spec.md:42 | G.2 Formats, copy samples and USSD pointer › Formats, by channel | annex-spec-sec-g-2 | figure `format-specs` |  | figure component `format-specs` |
| C995 | annex-spec.md:46 | G.2 Formats, copy samples and USSD pointer › Copy samples: radio, SMS and USSD | annex-spec-sec-g-2 | heading |  | h4: Copy samples: radio, SMS and USSD |
| C996 | annex-spec.md:47 | G.2 Formats, copy samples and USSD pointer › Copy samples: radio, SMS and USSD | annex-spec-sec-g-2 | heading |  | h5: A. Vernacular Radio 45-Second Script Sample (Kikamba) |
| C997 | annex-spec.md:48 | G.2 Formats, copy samples and USSD pointer › Copy samples: radio, SMS and USSD | annex-spec-sec-g-2 | callout |  | callout: SFX: Ambient sounds of a busy grain market ( ndengu… |
| C998 | annex-spec.md:53 | G.2 Formats, copy samples and USSD pointer › Copy samples: radio, SMS and USSD | annex-spec-sec-g-2 | heading |  | h5: B. Direct 2G Bulk SMS Copy Sample (Ward-Specific) |
| C999 | annex-spec.md:54 | G.2 Formats, copy samples and USSD pointer › Copy samples: radio, SMS and USSD | annex-spec-sec-g-2 | callout |  | callout: "Kitui Rural / Mbitini: Dr. Makali Mulu guarantees Ksh {policy.ward-fund}M… |
| C1000 | annex-spec.md:56 | G.2 Formats, copy samples and USSD pointer › Copy samples: radio, SMS and USSD | annex-spec-sec-g-2 | heading |  | h5: C. USSD Interactive Menu Tree Structure |
| C1001 | annex-spec.md:58 | G.2 Formats, copy samples and USSD pointer › Copy samples: radio, SMS and USSD | annex-spec-sec-g-2 | paragraph |  | The menu is set out once, in Section 4.5.9, which… |
| C1002 | annex-spec.md:61 | G.3 Volunteer programme reference | **annex-spec-sec-g-3** | heading |  | h2: G.3 Volunteer programme reference |
| C1003 | annex-spec.md:63 | G.3 Volunteer programme reference | annex-spec-sec-g-3 | lead |  | lead: Data-handling training is a gate, not an option. No volunteer… |
| C1004 | annex-spec.md:67 | G.3 Volunteer programme reference › Turning online supporters into offline organisers | annex-spec-sec-g-3 | heading |  | h4: Turning online supporters into offline organisers |
| C1005 | annex-spec.md:69 | G.3 Volunteer programme reference › Turning online supporters into offline organisers | annex-spec-sec-g-3 | paragraph |  | A tiered volunteer programme converting passive online supporters into active… |
| C1006 | annex-spec.md:72 | G.3 Volunteer programme reference › Volunteer tiers | annex-spec-sec-g-3 | heading |  | h4: Volunteer tiers |
| C1007 | annex-spec.md:74 | G.3 Volunteer programme reference › Volunteer tiers | annex-spec-sec-g-3 | table |  | table: Tier Name Entry requirement Activities |
| C1008 | annex-spec.md:81 | G.3 Volunteer programme reference › Volunteer tiers | annex-spec-sec-g-3 | paragraph |  | Data-handling training is a gate, not an option. No volunteer… |
| C1009 | annex-spec.md:84 | G.3 Volunteer programme reference › Gamification mechanics | annex-spec-sec-g-3 | heading |  | h4: Gamification mechanics |
| C1010 | annex-spec.md:86 | G.3 Volunteer programme reference › Gamification mechanics | annex-spec-sec-g-3 | table |  | table: Mechanic Implementation Reward |
| C1011 | annex-spec.md:93 | G.3 Volunteer programme reference › Gamification mechanics | annex-spec-sec-g-3 | paragraph |  | Integrity rule. Points reward verified real-world action — a registered… |
| C1012 | annex-spec.md:99 | G.3 Volunteer programme reference › Management tooling | annex-spec-sec-g-3 | heading |  | h4: Management tooling |
| C1013 | annex-spec.md:101 | G.3 Volunteer programme reference › Management tooling | annex-spec-sec-g-3 | list |  | list: Custom WhatsApp bot for lightweight volunteer management: registration, point tracking,… |
| C1014 | annex-spec.md:109 | G.3 Volunteer programme reference › Volunteer KPIs | annex-spec-sec-g-3 | heading |  | h4: Volunteer KPIs |
| C1015 | annex-spec.md:111 | G.3 Volunteer programme reference › Volunteer KPIs | annex-spec-sec-g-3 | table |  | table: Metric Target |
| C1016 | annex-spec.md:121 | G.4 Technology reference architecture | **annex-spec-sec-g-4** | heading |  | h2: G.4 Technology reference architecture |
| C1017 | annex-spec.md:123 | G.4 Technology reference architecture | annex-spec-sec-g-4 | lead |  | lead: The technology stack must bridge the gap between digital command… |
| C1018 | annex-spec.md:127 | G.4 Technology reference architecture | annex-spec-sec-g-4 | paragraph |  | A data-driven political campaign requires robust, reliable, and compliant technical… |
| C1019 | annex-spec.md:129 | G.4 Technology reference architecture | annex-spec-sec-g-4 | paragraph |  | This section specifies the six core software components of the… |
| C1020 | annex-spec.md:131 | G.4 Technology reference architecture | annex-spec-sec-g-4 | figure `tech-stack` |  | figure component `tech-stack` |
| C1021 | annex-spec.md:135 | G.4 Technology reference architecture › Component by component, and what each does | annex-spec-sec-g-4 | heading |  | h4: Component by component, and what each does |
| C1022 | annex-spec.md:137 | G.4 Technology reference architecture › Component by component, and what each does | annex-spec-sec-g-4 | figure `fig-5-2-4-stack` |  | figure component `fig-5-2-4-stack` |
| C1023 | annex-spec.md:141 | G.4 Technology reference architecture › Component by component, and what each does | annex-spec-sec-g-4 | textversion |  | text version: 1. SMS / USSD Telecommunications Gateway Tooling Recommendation: Africa's Talking… |
| C1024 | annex-spec.md:188 | G.4 Technology reference architecture › Component by component, and what each does | annex-spec-sec-g-4 | paragraph |  | [conflict C5] |
| C1025 | annex-spec.md:190 | G.4 Technology reference architecture › The procurement matrix | annex-spec-sec-g-4 | heading |  | h4: The procurement matrix |
| C1026 | annex-spec.md:192 | G.4 Technology reference architecture › The procurement matrix | annex-spec-sec-g-4 | figure `procurement-matrix` |  | figure component `procurement-matrix` |
| C1027 | annex-spec.md:196 | G.4 Technology reference architecture › Technical risk and security protocols | annex-spec-sec-g-4 | heading |  | h4: Technical risk and security protocols |
| C1028 | annex-spec.md:198 | G.4 Technology reference architecture › Technical risk and security protocols | annex-spec-sec-g-4 | paragraph |  | To ensure 100% operational uptime and protect campaign systems from… |
| C1029 | annex-spec.md:200 | G.4 Technology reference architecture › Technical risk and security protocols | annex-spec-sec-g-4 | list |  | list: 1. Mandatory Hardware Security Keys / 2FA: All War Room… |
| C1030 | annex-spec.md:207 | G.5 Voter model: data sources and variable dictionary | **annex-spec-sec-g-5** | heading |  | h2: G.5 Voter model: data sources and variable dictionary |
| C1031 | annex-spec.md:209 | G.5 Voter model: data sources and variable dictionary | annex-spec-sec-g-5 | lead |  | lead: No psychographic, personality, ethnic, clan or religious variable appears in… |
| C1032 | annex-spec.md:213 | G.5 Voter model: data sources and variable dictionary | annex-spec-sec-g-5 | visual `checklist` |  | visual `checklist`: Data sources |
| C1033 | annex-spec.md:230 | G.5 Voter model: data sources and variable dictionary | annex-spec-sec-g-5 | paragraph |  | Explicitly excluded: purchased third-party contact lists, scraped number databases, and… |
| C1034 | annex-spec.md:235 | G.5 Voter model: data sources and variable dictionary › Model variables | annex-spec-sec-g-5 | heading |  | h4: Model variables |
| C1035 | annex-spec.md:237 | G.5 Voter model: data sources and variable dictionary › Model variables | annex-spec-sec-g-5 | table |  | table: Variable Description Source Type Format |
| C1036 | annex-spec.md:264 | G.5 Voter model: data sources and variable dictionary › Model variables | annex-spec-sec-g-5 | paragraph |  | No psychographic, personality, ethnic, clan or religious variable appears in… |

## 2. Duplication list

Units that say the same thing in more than one place. The three known examples are D-1, D-2 and D-3; all three are confirmed. The proposed resolution is the draft treatment in the reorganisation map; nothing is merged until you approve.

### D-1 Dr. Mulu's public record (known example: 2.10.1 and 3.1.1)

**Units:** C243 (evidence:727), C244 (evidence:731), C246 (evidence:737), C247 (evidence:746), C268 (strategy:14), C271 (strategy:22), C272 (strategy:26), C273 (strategy:27), C160 (evidence:250), C41 (decision:154)

**Resolution proposed:** Confirmed. 6.1 holds the record once: the 2.10.1 table is rewritten to carry every fact from 3.1 and 3.1.1 (PhD, Budget and Appropriations Committee, ESK, M&E Champion, UN roles, KSh 47m to {{record.bursary.recipients}} students, best-evaluated in the Eastern region FY2014/15 and first of 71, CBS, NG-CDF portal and FY2026/27 allocation), with each document still to be cited named against its line. The 5.3 candidate card and the 8.2 objective keep one clause and a cross-reference.

### D-2 Rapid response (known example: 6.2.1, Annex E.5, the pre-drafted lines in 4.5.6)

**Units:** C821 (risks:41), C953 (annex-runbooks:50), C954 (annex-runbooks:70), C577 (workstreams-media:147), C949 (annex-runbooks:21), C944 (annex-runbooks:7), C946 (annex-runbooks:13), C844 (risks:142)

**Resolution proposed:** Confirmed, and wider than listed: the four-tier decision tree (E.1), the response times (E.2), the holding positions (E.3) and the Level 3 clock (6.3.1) restate the same tiers. 20.2 carries the protocol once, in prose, and points to the runbooks; F.1/F.2/F.5 keep the tiers and times; the eight 4.5.6 lines merge into F.3 with the four holding positions (all twelve kept); 20.4 keeps the 30-minute manipulated-media clock and F.5's Level 3 row points to it.

### D-3 The pillar sets in 3.2 (known example: strategic, campaign, central-claim, content pillars, six themes)

**Units:** C286 (strategy:84), C292 (strategy:111), C295 (strategy:136), C303 (strategy:195), C310 (strategy:229), C314 (strategy:263), C922 (annex-messages:9)

**Resolution proposed:** Confirmed: five groupings (4 campaign pillars, 3 message pillars, 4 production pillars P1–P4, 4 content buckets A–D, 6 themes) under four different names, and three cross-references that point at the wrong one. 10.1 replaces them with one layered architecture: **one claim** (the Economist Governor) → **three pillars** (the message pillars; the crosswalk already maps campaign pillars 1+4 → MP1, 3 → MP2, 1+2 → MP3, so the four campaign pillars fold in without loss) → **six themes** (names here; evidence moves to Chapter 3) → **content types** (P1–P4, each absorbing its matching bucket's formats, tone and Kikamba working name). Every fact from all five is kept.

### D-4 "Firefly publishes nothing on Dr. Mulu's accounts and holds no credentials"

**Units:** C8 (cover:22), C24 (decision:93), C51 (decision:229), C52 (decision:233), C69 (decision:302), C704 (staffing:63), C775 (measurement:278)

**Resolution proposed:** Stated seven times (plus the 4.1.1 weekly rhythm). 13.2 states it once with the one exception (the offline layer); 13.3, 17 and 19.1 keep their functional uses (the boundary, the role's decision rights, the controller table) without restating the principle.

### D-5 "One week and one export"

**Units:** C10 (decision:5), C19 (decision:76), C21 (decision:82)

**Resolution proposed:** Three statements under one section. 23 keeps the lead; the other two merge into it.

### D-6 The pool: {{pool.share}}% of the register where he has never held office

**Units:** C16 (decision:58), C34 (decision:122), C176 (evidence:348), C184 (evidence:381), C321 (strategy:318), C400 (strategy:804), C758 (measurement:195)

**Resolution proposed:** The derivation lives once, in 6.2. Every other use becomes one clause with a cross-reference to 6.2.

### D-7 The digital ceiling (~{{reach.smartphone}} voters reachable online)

**Units:** C230 (evidence:616), C233 (evidence:626), C331 (strategy:364), C620 (workstreams-ground:182), C758 (measurement:195)

**Resolution proposed:** 4.3 states the ceiling and its working once (the lead and the callout merge). 8.2, 12.2, 15.3 and 18.5 cite it.

### D-8 The winning benchmark ({{benchmark}})

**Units:** C113 (evidence:5), C119 (evidence:47), C31 (decision:116)

**Resolution proposed:** The benchmark and its July 2026 equivalent are derived once, in 2.5. The 2.1 stats card keeps the number and points to 2.5.

### D-9 Mwingi: "necessary and not sufficient"

**Units:** C130 (evidence:115), C134 (evidence:127), C141 (evidence:146)

**Resolution proposed:** Lead and paragraph merge in 2.4; Path A in 2.5 keeps the arithmetic and drops its restated conclusion.

### D-10 The KSh 13.79bn envelope

**Units:** C199 (evidence:476), C203 (evidence:496), C206 (evidence:505), C277 (strategy:40), C292 (strategy:111), C314 (strategy:263), C990 (annex-spec:5)

**Resolution proposed:** 1.5 states the envelope, its parts and its tier once (Tier 3, CFSP); every other use cites the figure by token and points to 1.5. The tier is inconsistent today (Tier 1 in 3.1.2 and in the fiscal theme): see defect X-1.

### D-11 The audit findings and pending bills

**Units:** C278 (strategy:41), C279 (strategy:59), C898 (annex-county:69), C900 (annex-county:75), C282 (strategy:64), C295 (strategy:136)

**Resolution proposed:** 3.7 holds the four audit findings (as the bars visual, which replaces B.2's list), the KSh 1.3bn pending-bills figure (FY2020/21) and the 18% absorption rate once. 9.2 and 9.3 argue from them by cross-reference. Message Pillar 1's 'KSh 2.4bn' (a different measure) keeps its own year and scope note.

### D-12 Radio ownership and listenership

**Units:** C221 (evidence:577), C222 (evidence:581), C223 (evidence:583), C226 (evidence:594), C227 (evidence:597), C556 (workstreams-media:34), C557 (workstreams-media:38), C239 (evidence:666), C827 (risks:55)

**Resolution proposed:** The station table (which 2.9.2 says governs) moves into 4.2 with the three structural facts and the listenership note: one ownership map. 4.4, 11.2, 15.2 and 20.2 name stations by cross-reference. The station lists still disagree (Sang'u FM, Citizen Radio, Mwatu FM): conflict C7 stays marked.

### D-13 Bulk political SMS cannot be sent in Kikamba

**Units:** C616 (workstreams-ground:162), C626 (workstreams-ground:207), C387 (strategy:732), C94 (decision:442)

**Resolution proposed:** The rule and its consequences live once, in Workstream 9 (15.3); 12.4 states the channel consequence in one line. Conflict C2 (the language-map figure still lists Kikamba on bulk SMS) stays marked.

### D-14 The recognition-deficit hypothesis

**Units:** C262 (evidence:814), C428 (delivery:96), C765 (measurement:239), C767 (measurement:249), C328 (strategy:352)

**Resolution proposed:** Stated once, in 7.1; 7.2 carries what would overturn it; 18.5 carries how it is tested; 14.1 and 12.1 cite it.

### D-15 Page or personal profile

**Units:** C107 (decision:531), C438 (delivery:177), C443 (delivery:194), C760 (measurement:203)

**Resolution proposed:** 7.4 keeps the assumption and its risk; 14.3 keeps the consequences and the one-hour test; 18.5 keeps the method step.

### D-16 Hardware security keys

**Units:** C969 (annex-runbooks:158), C970 (annex-runbooks:162), C1029 (annex-spec:200)

**Resolution proposed:** F.8 governs. G.4's 'YubiKey or Google Authenticator' contradicts it (an authenticator app is not a hardware key): corrected in E.1.

### D-17 The compliance sign-off gate

**Units:** C796 (measurement:486), C663 (workstreams-data:56), C812 (measurement:582)

**Resolution proposed:** 19.2 holds the gate; 15.4 and 19.5 cite it.

### D-18 Dr. Kasalu's countywide result above the governor's tally

**Units:** C25 (decision:98), C160 (evidence:250), C173 (evidence:329), C918 (annex-county:136)

**Resolution proposed:** 5.3 card states the result; 5.5 reads it; 7.2 uses it as the case against the hypothesis.

### D-19 The open seat (Article 180(7))

**Units:** C168 (evidence:317), C918 (annex-county:136)

**Resolution proposed:** 5.1 holds it; 5.5 keeps the audit-record citation.

### D-20 The rivals: cards in 2.6 and records in B.5

**Units:** C165 (evidence:286), C918 (annex-county:136)

**Resolution proposed:** 5.3 says who is in the field; 5.5 says which document each attribute rests on and the legal ground. Each line keeps its facts; the repetition between them is cut.

### D-21 Mobile-money agents ({{ict.agents}})

**Units:** C214 (evidence:536), C239 (evidence:666), C640 (workstreams-ground:284)

**Resolution proposed:** 4.1 states the count; 4.4 the campaign's (out-of-scope) ambassador idea; 15.3 Firefly's distribution-only use. Two different uses, so both stay, with the figure stated once.

### D-22 Market days and sound-truck caravans

**Units:** C239 (evidence:666), C240 (evidence:693), C602 (workstreams-ground:59)

**Resolution proposed:** 4.4 keeps the rotation map; 15.3 keeps the field execution; the caravan description is stated once.

### D-23 Water evidence

**Units:** C194 (evidence:420), C314 (strategy:263), C295 (strategy:136), C377 (strategy:662)

**Resolution proposed:** 3.1 holds the water evidence (surface water, basic service, 30-minute access, broken water points, trekking distance, schools); 10.1 and 10.3 cite it. The new verified figures (safe drinking water 38.5%; piped 5.1%) join 3.1 with their definition stated.

### D-24 Poultry in over 90% of households

**Units:** C194 (evidence:420), C314 (strategy:263), C377 (strategy:662)

**Resolution proposed:** Stated once in 3.2 (Food, farming and drought); others cite it.

### D-25 KSh 47m in bursaries to {{record.bursary.recipients}} students

**Units:** C273 (strategy:27), C314 (strategy:263), C776 (measurement:284)

**Resolution proposed:** 6.1 holds it (D-1); the 'KSh 47m' literal becomes a token (defect X-6).

### D-26 Best-evaluated constituency in the Eastern region, FY2014/15

**Units:** C273 (strategy:27), C377 (strategy:662), C577 (workstreams-media:147)

**Resolution proposed:** 6.1 holds it with the evaluation report still to be cited; ten other mentions cite 6.1.

### D-27 Scope levels and the Level 2 recommendation

**Units:** C78 (decision:373), C89 (decision:418)

**Resolution proposed:** 'The one place this campaign cannot afford to be blind' appears in both; 21.1 keeps it once.

### D-28 Delegate primary

**Units:** C107 (decision:531), C854 (risks:194), C148 (evidence:206)

**Resolution proposed:** 5.4 holds the contingency; 7.4 keeps the assumption; 5.2 the trigger.

### D-29 The nomination window is a Tier 3 report

**Units:** C145 (evidence:194), C146 (evidence:198), C147 (evidence:200), C152 (evidence:225)

**Resolution proposed:** Four statements in 2.5; 5.2 keeps one, with the verification test.

### D-30 Defamation and legal caution

**Units:** C822 (risks:43), C830 (risks:72), C916 (annex-county:132)

**Resolution proposed:** 20.3 holds the three rules; 5.5 the per-rival legal ground; 20.2 cites 20.3 (fixing its [CHECK REF]).

### D-31 Competitor monitoring tools

**Units:** C951 (annex-runbooks:27), C982 (annex-runbooks:270), C850 (risks:179)

**Resolution proposed:** 20.5 the boundary; F.4 the tools (F.11's table merges into it).

### D-32 Manipulated media and AI

**Units:** C840 (risks:109), C524 (workstreams-platforms:270), C961 (annex-runbooks:98)

**Resolution proposed:** 20.4 the protocol; 15.1 the AI-use rule; 19.3 clause 2; F.6 the drill. Functional, not repeated prose: kept, cross-referenced.

### D-33 Consent and purchased lists

**Units:** C625 (workstreams-ground:199), C781 (measurement:328), C1033 (annex-spec:230)

**Resolution proposed:** 19.2 states the rule and its basis; 15.3 and E.2 cite it.

### D-34 Deleting data within 90 days

**Units:** C459 (delivery:329), C792 (measurement:410)

**Resolution proposed:** The charter clause (19.3, keep-marked) governs; 14.8 cites it.

### D-35 "Firefly adds three people" and the single counterpart

**Units:** C714 (staffing:121), C716 (staffing:127), C717 (staffing:129), C698 (staffing:31)

**Resolution proposed:** Chapter 17 says each once.

### D-36 Drought and IPC phase

**Units:** C197 (evidence:455), C907 (annex-county:101)

**Resolution proposed:** Both move to 3.2 and merge.

### D-37 Diaspora registration, 12 to 26 countries

**Units:** C455 (delivery:295), C465 (delivery:353), C928 (annex-messages:51)

**Resolution proposed:** Unsourced in all three (defect X-6). Needs a source and a token; stated once, in 11.2.

### D-38 The service-delivery tracker described three ways

**Units:** C483 (workstreams-platforms:80), C501 (workstreams-platforms:191), C1023 (annex-spec:141)

**Resolution proposed:** Conflict C5 (three scopes) stays marked; the descriptions sit together in 15.1.1 so the author can settle it in one place.

### D-39 Kitui Central's own MP contest

**Units:** C47 (decision:207), C188 (evidence:393)

**Resolution proposed:** 6.3 holds it; 8.2 cites it.

### D-40 The twelve largest wards

**Units:** C128 (evidence:95), C141 (evidence:146), C181 (evidence:363)

**Resolution proposed:** 2.3 states them; 2.5 (Path C) and 6.2 (the five in the pool) use them.

### D-41 "Kitui has resources. What it has lacked is leadership…"

**Units:** C282 (strategy:64), C316 (strategy:306), C365 (strategy:590)

**Resolution proposed:** 9.1 holds the line; 10.2 keeps the nomination-window rule on using only its verification half.

### D-42 "The mission is for Kitui to prosper. From Poverty to Wealth Creation."

**Units:** C288 (strategy:99), C290 (strategy:105), C300 (strategy:183)

**Resolution proposed:** Quoted once, in 10.1.

### D-43 Turnout: certified valid votes against modelled ballots (C8)

**Units:** C115 (evidence:11), C119 (evidence:47), C347 (strategy:438)

**Resolution proposed:** 2.1 states the base of each figure (governor valid votes ÷ register = 61.7%; presidential ≈62% including rejected ballots). C8 stays marked.

### D-44 Leads that repeat the paragraph beneath them word for word

**Units:** C51, C56, C72, C91, C172, C187, C199, C230, C237, C271, C288, C312, C325, C345, C350, C357, C362, C380, C438, C461, C506, C521, C607, C650, C661, C706, C713, C733, C750, C755, C762, C765, C771, C778, C789, C795, C810, C820, C838, C853, C874, C897, C906, C912, C915, C935, C957, C965, C969, C978, C992, C1003, C1017, C1031

**Resolution proposed:** A systematic pattern, not one passage: 54 leads (listed in the map as 'Merged with', note 'Lead repeats…'). Each chapter keeps the lead as its answer-first line and cuts the repetition from the paragraph, or the reverse where the paragraph carries more.

### Automatic sweep

A text-similarity pass over every paragraph, lead, list and callout longer than 80 characters found 37 pairs that open with the same 60 characters or match above 80%. All of them are covered by an entry above:

C24≈C51, C24≈C52, C51≈C52, C91≈C92, C199≈C203, C199≈C277, C203≈C277, C221≈C222, C237≈C238, C243≈C244, C288≈C290, C288≈C300, C290≈C300, C319≈C321, C350≈C351, C380≈C381, C461≈C463, C477≈C478, C506≈C507, C521≈C522, C533≈C538, C607≈C608, C650≈C651, C661≈C662, C671≈C674, C733≈C737, C750≈C752, C771≈C772, C795≈C796, C820≈C821, C853≈C854, C874≈C875, C897≈C898, C912≈C913, C957≈C959, C1003≈C1008, C1017≈C1018

## 3. Defect list

### 3.1 Leftover markers

| Marker | Count | Units |
|---|---:|---|
| [CHECK REF] | 11 | C211 (evidence.md:519), C211 (evidence.md:519), C493 (workstreams-platforms.md:144), C625 (workstreams-ground.md:199), C625 (workstreams-ground.md:199), C783 (measurement.md:336), C787 (measurement.md:377), C822 (risks.md:43), C1023 (annex-spec.md:141), C1023 (annex-spec.md:141), C1023 (annex-spec.md:141) |
| [CONFLICT C1: see open items] | 4 | C384 (strategy.md:721), C387 (strategy.md:732), C391 (strategy.md:770), C405 (strategy.md:818) |
| [CONFLICT C2: see open items] | 2 | C384 (strategy.md:721), C627 (workstreams-ground.md:226) |
| [CONFLICT C3: see open items] | 2 | C59 (decision.md:263), C98 (decision.md:480) |
| [CONFLICT C4: see open items] | 3 | C69 (decision.md:302), C474 (workstreams-platforms.md:28), C708 (staffing.md:98) |
| [CONFLICT C5: see open items] | 3 | C483 (workstreams-platforms.md:80), C501 (workstreams-platforms.md:191), C1024 (annex-spec.md:188) |
| [CONFLICT C6: see open items] | 5 | C161 (evidence.md:271), C295 (strategy.md:136), C310 (strategy.md:229), C577 (workstreams-media.md:147), C999 (annex-spec.md:54) |
| [CONFLICT C7: see open items] | 5 | C227 (evidence.md:597), C239 (evidence.md:666), C355 (strategy.md:486), C558 (workstreams-media.md:51), C827 (risks.md:55) |
| [CONFLICT C8: see open items] | 3 | C115 (evidence.md:11), C119 (evidence.md:47), C347 (strategy.md:438) |
| placeholder: [shortcode] | 3 | C239 (evidence.md:666), C504 (workstreams-platforms.md:198), C1023 (annex-spec.md:141) |
| placeholder: `[Confirm approach with campaign counsel — agent networks are regulated financial infrastructure and any commercial arrangement should be reviewed]` | 1 | C641 (workstreams-ground.md:289) |
| placeholder: `[VERIFY whether in force]` | 1 | C626 (workstreams-ground.md:207) |
| placeholder: `[campaign counsel, where voter-file work is live]` | 1 | C936 (annex-cadence.md:10) |
| placeholder: `[shortcode]` | 2 | C377 (strategy.md:662), C377 (strategy.md:662) |

The eight `[CONFLICT Cn]` markers are author decisions recorded in `docs/restructure-2026-10/OPEN-ITEMS.md` §1 (language mix C1; Kikamba on bulk SMS C2; workstream counts C3; who manages the owned platforms C4; the tracker's scope C5; the Ward Equalization Fund C6; the station lists C7; valid votes against modelled ballots C8). The restructure moves each marker with its text and does not settle them unless you tell me to. The `[CHECK REF]` markers are fixed in the map (each new target is in the unit's note). The shortcode, `[VERIFY whether in force]` and counsel placeholders are contracting items and stay.

### 3.2 Cross-references

**Pointing at no heading at all (4):**

| C | Where | Cites | Context |
|---|---|---|---|
| C625 | workstreams-ground.md:199 | 4.4.11 | t-in. **No purchased lists. Ever.** See Sections 4.4.11 [CHECK REF] and 5.7.4 [CHECK  |
| C787 | measurement.md:377 | 5.2.1.4 |  phone numbers is a direct violation of Section 5.2.1.4 [CHECK REF] of the DPA 2019." |
| C1023 | annex-spec.md:141 | 5.2.3.4 |  data constitutes direct personal data (Section 5.2.3.4 [CHECK REF]). Requires explic |
| C1023 | annex-spec.md:141 | 5.2.3.4 | ated sentiment metadata. Compliant with Section 5.2.3.4 [CHECK REF] provided individu |

**Pointing at a heading that exists but holds something else** (a link that resolves and lands on the wrong text; the eleven `[CHECK REF]`s above are the same failure, already flagged):

| C | Cites | What is actually there |
|---|---|---|
| C285 | Section 3.5 (message pillars), 4.5.2 (content buckets), 3.7 (production pillars) | Message pillars are 3.2.2; buckets and production pillars are 3.2.3; 3.7 is the week calendar. |
| C301 | Section 3.5 | Message pillars are 3.2.2. |
| C308 | Section 3.7 | Production pillars are 3.2.3. |
| C351 | Section 3.7 | Production pillars are 3.2.3. |
| C922 | Section 3.7 | Production pillars are 3.2.3. |
| C98 | Section 4.1.2 (cadence); Section 6 (conditions) | The rhythm is 4.1.1 (4.1.2 is the RACI table); the conditions are 1.7 (Section 6 is risks). |
| C147 | Section 1.2 | 1.2 does not state the claim; it is assumption 1 in 1.8. |
| C95 | Section 1.7 | 1.7's nine dependencies do not include the sign-language provider (1.8 assumption 4 does). |
| C549 | Section 4.1.3 'marks it open' | 4.1.3 says the recommendation was approved in September 2026. |
| C292 | Section 4.5.14 'quarterly evidence cadence' | 4.5.14 has no quarterly evidence cadence. |
| C23 | Section 4.2.1 'specifies exactly what Week 1 measures' | The measurement set is 5.2.1–5.2.4; 4.2.1 is the four-week plan. Same pattern in 1.1 (C17), 1.3.4, 1.8, A.1.4. |

Every cross-reference is renumbered in the restructure in any case. The old numbers are gone, so each reference is rewritten to its new chapter.section, which fixes all of these as a by-product.

### 3.3 Numbering

- **Annex E jumps from E.10 to E.12** (X-17). Renumbered F.1–F.11.
- **E.6 scenarios run 1, 2, 3, 4, 5, 7** (X-16). Renumbered 1–6.
- **1.8 assumptions run 1, (2 fused into 1), 3, 4, 4a, 4b, 4c, 4d, 5, 6, 7** (X-3).
- **Staffing is numbered 4.6 after the workstreams, and all four workstream routes carry the same number, 4.5** (`lib/heading-slug.ts` SECTIONS). Part 4 runs 4.1–4.4 in `delivery.md`, then 4.5 across four files, then 4.6. In the new structure the team is Chapter 17 and the workstreams Chapter 15 with 15.1–15.4.
- **The cover counts six sections and six annexes** (X-18); `FLOW_ACTS` has seven movements; the site has six Parts and seven annexes.
- **G.4 promises six components and lists five** (X-9).
- **One Phase 0 timeline item has no week** (X-15).

### 3.4 How the candidate is named

House style: full name and honours on the cover only (*Hon. Dr. Benson Makali Mulu, PhD, CBS*); *Dr. Makali Mulu* at first mention in each chapter; *Dr. Mulu* thereafter.

| Form | Uses | Where |
|---|---:|---|
| Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS | 3 | cover 1, evidence 2 |
| Hon. Dr. Benson Makali Mulu (no honours) | 2 | cover 1, evidence 1 |
| Dr. Benson Makali Mulu | 1 | evidence 1 |
| Dr. Makali Mulu | 13 | decision 1, strategy 3, measurement 1, risks 1, annex-spec 7 |
| Dr. Mulu | 110 | cover 1, decision 14, evidence 18, strategy 34, delivery 4, workstreams-platforms 4, workstreams-media 3, workstreams-ground 7, workstreams-data 2, staffing 5, measurement 6, risks 3, annex-runbooks 4, annex-terms 1, annex-spec 4 |
| Makali Mulu (bare, e.g. search terms) | 1 | annex-runbooks 1 |
| @MakaliMulu | 1 | measurement 1 |

Off-style today: the full name with honours appears outside the cover (2.6.1 card, 2.10.1 lead and paragraph); 'Dr. Benson Makali Mulu' (2.7.1); the cover and 2.10.1 say 'PhD (Economics), CBS' where the house form is 'PhD, CBS'. 'Dr. Mulu' is often the first mention in a section that will become a chapter opening. In the rewrite every chapter's first mention becomes 'Dr. Makali Mulu'. Proper uses that stay as they are: the handle `@MakaliMulu`, search keywords ('Makali Mulu', 'Dr. Makali Mulu' in Google Alerts and listening feeds), and the radio-script voiceover.

### 3.5 Against the verified data (checked 29 October 2026)

| Data point | Verified | On the site today | Finding |
|---|---|---|---|
| Population, 2019 | 1,136,187 (549,003 m; 587,151 f; 33 intersex) | `census.population` 1,136,187; `census.male` 549,003; `census.female` 587,151 (T1). Intersex 33 is a literal in 2.8.1. | Matches. The wrong 1,136,761 appears nowhere. Add `census.intersex` (33) as a token. |
| Households, 2019 | 262,942 (4.3 people) | `census.households` 262,942 (T1); 4.3 is a literal | Matches. Add `census.household-size` (4.3). |
| Area and density | ≈30,430 km²; 37/km² | `census.area` 30,430 (T1); 37 is a literal; 'national average of 82' is an untokenised, unsourced literal | Matches. Add `census.density` (37); source or cut the national 82. |
| Median age | 17 years (T2) | Not on the site | New token `census.median-age` (T2, KNBS 2019 via Stats Kenya). Age bands: [VERIFY] against KNBS Census Vol. III. |
| Urban share | [VERIFY]; draft 14.9% unsourced; secondary ≈86% rural | `census.rural.share` 95.2% and `census.urban.share` 4.8% (T1, CENSUS), with `census.rural` 1,082,168 and `census.urban` 54,019; used in 2.8.1, 3.4.2 segment sizes and C.1 | **Conflict.** The site's 95.2/4.8 is marked T1 but your table says no source settles the urban share and secondary sources put rural near 86%. Needs a decision: re-source 95.2/4.8 to KNBS Vol. II, or mark both [VERIFY] (which also unsizes the rural and urban segments in 11.2). |
| Administrative units | 8 constituencies, 40 wards, 18 sub-counties; 247 = villages | 8, 40 and 18 are literals throughout; '247' appears nowhere | Matches. 1.4 states villages only once the CIDP 2023–2027 confirms 247. |
| Poverty | Keep 55.2% (KNBS 2021); 58.3% (2022) [VERIFY]; 48.0% history only | `poverty.2021` 55.2% (T1); NDMA's 60.4% and 63.1% (T2) shown as other bases; 48.0% appears nowhere | Matches. 58.3% added as a [VERIFY] note under 1.3, not used. |
| Electricity | 17.2% of households (2019), from 4.8% (2009) | Not on the site | New tokens (T2, KNBS 2019 via Stats Kenya) in 1.3. National comparison [VERIFY]. |
| Safe drinking water | 38.5% of households (2019); piped 5.1% | Not on the site; the site has 21% with at least a basic service (KDHS 2022, T1, literal), ~400,000 on surface water (T1) and the 30-minute measures (T1) | New tokens (T2) in 3.1 with the measure named; the 21% KDHS figure is a different measure and stays, labelled. The draft's 53.2% appears nowhere. |
| Literacy | [VERIFY]; draft 56.3%/87.4% unsourced | The draft figures appear nowhere. `edu.literacy.men/women` (99.3%/94.8%, ages 15–49, T1, GDS) exist in figures.ts and are not in prose; G.5 has an `area_literacy_rate` variable | No change to prose. Nothing published until sourced. |
| 2022 presidential, Kitui | Odinga 235,400 (70.82%); Ruto 89,419 (26.90%); Wajackoyah 2,838; Mwaure 1,446; rejected 3,306; registered 532,758; turnout ≈62% (T2) | Not on the site | New tokens (T2, Equal Politics aggregation of IEBC results; T1 is Form 34B/34C) in 2.2. |
| Turnout base | Say which base each number uses | `turnout.2022` 61.7% = 328,760 governor valid votes ÷ 532,758 (note in figures.ts); prose says 'certified turnout' | Corrected: 2.1 states both bases. |
| 2022 governor | Malombe 198,004 (60.23%); Musila 117,606 (35.77%); of 328,760 | Same (T1, Form 37C) | Matches. |
| 2017 governor, 2022 senate, woman rep, Kitui Central MP | Keep the site's figures and tiers; 2013 a named gap | As stated | No change. |
| County budget FY2026/27 | Keep CFSP KSh 13.79bn (T3); ADP 14.27bn unconfirmed; label the document; budget unapproved after 30 June 2026 | `budget.total` 13.79bn (T3, CFSP); 14.27bn appears nowhere; prose calls the Paper 'approved' and in two places Tier 1 | Corrected: label CFSP, tier T3 everywhere, add the unapproved-budget note (The Star, 6 July 2026) as a new T2 citation. |
| CIDP 2023–2027 | Priority sectors and count [VERIFY] | 'CIDP III' cited once, for an untiered 61% water figure | 1.5 names the CIDP; no sector count published until confirmed. |

### 3.6 Numbers written into prose

`scripts/check-figures.ts` fails on bare literals of three or more digits, so none exists. Shorter data figures pass the guard and sit in prose untokenised: percentages, KSh amounts in millions and billions, densities and distances. 46 units carry at least one. Each becomes a token in `lib/data/figures.ts` (with source, tier and date) or, where no source exists, is marked [VERIFY] with the record that would settle it. Literals that are rules rather than data (2% opt-out, 1.5% CTR, 30% testing, 50/30/20 mix) are listed too, because some are targets that already have tokens and some are design choices that should say so.

| C | File:line | Literals |
|---|---|---|
| C41 | decision.md:154 | KSh 47m |
| C119 | evidence.md:47 | 72% |
| C128 | evidence.md:95 | 25%; 30.0%; 50% |
| C141 | evidence.md:146 | 80% |
| C194 | evidence.md:420 | 37 persons; 4.3 persons; 90% |
| C199 | evidence.md:476 | KSh 13.79 billion |
| C203 | evidence.md:496 | KSh 13.79 billion |
| C204 | evidence.md:497 | KSh 1.04 billion; KSh 1.12 billion; KSh 1.339 billion; KSh 11.64 billion |
| C206 | evidence.md:505 | KSh 0.01 billion; KSh 13.80 billion |
| C207 | evidence.md:507 | KSh 13.79 billion |
| C211 | evidence.md:519 | 19 persons; 9 persons |
| C246 | evidence.md:737 | KSh 47 million |
| C273 | strategy.md:27 | KSh 47 million |
| C277 | strategy.md:40 | KSh 13.79 billion |
| C279 | strategy.md:59 | KSh 1.3 billion |
| C282 | strategy.md:64 | KSh 1.3 billion |
| C292 | strategy.md:111 | KSh13.79 billion |
| C295 | strategy.md:136 | 32%; 61%; KSh 1.3 billion; KSh 13.79 billion; Ksh 2.4 billion |
| C296 | strategy.md:161 | 29%; 44%; KSh 13.79 billion; KSh 2.0 billion; KSh 3.8 billion; KSh 4.0 billion; KSh 40 ; KSh 6.0 billion; KSh 85 |
| C303 | strategy.md:195 | 90%; KSh13.79bn; KSh670m |
| C310 | strategy.md:229 | 1 km; Ksh 85 |
| C314 | strategy.md:263 | 13.0%; 17.4%; 21%; 37 persons; 50 persons; 7.2 km; 72.5%; 90%; 99%; KSh1.04bn; KSh1.12bn; KSh1.339bn; KSh11.64bn; KSh13.79bn; KSh47m |
| C355 | strategy.md:486 | 44% |
| C359 | strategy.md:566 | 44% |
| C377 | strategy.md:662 | 90%; KSh13.79 billion |
| C387 | strategy.md:732 | 20%; 30%; 50% |
| C451 | delivery.md:219 | 10%; 2%; 5%; 50%; 70%; 75%; 80%; 90% |
| C453 | delivery.md:278 | 20%; 25%; 30% |
| C474 | workstreams-platforms.md:28 | KSh13.79bn |
| C499 | workstreams-platforms.md:180 | 60%; 65%; 70%; 80%; 85%; 90% |
| C529 | workstreams-platforms.md:300 | 1.5%; 30%; 70% |
| C531 | workstreams-platforms.md:312 | 1.5%; 2%; 3%; 35%; 5%; 50%; 6%; 98%; 99.9% |
| C540 | workstreams-platforms.md:351 | 13.0%; 17.4% |
| C579 | workstreams-media.md:160 | 50% |
| C595 | workstreams-ground.md:29 | Ksh 500  |
| C643 | workstreams-ground.md:301 | 2% |
| C663 | workstreams-data.md:56 | 5% |
| C679 | workstreams-data.md:131 | 10%; 15%; 40%; 50%; 70%; 75%; 80% |
| C741 | measurement.md:91 | 60% |
| C780 | measurement.md:306 | KSh1.85m; KSh400,000 ; KSh5 million |
| C900 | annex-county.md:75 | 18%; 5%; KSh 1.3 billion |
| C928 | annex-messages.md:51 | 90%; KSh1.339bn |
| C963 | annex-runbooks.md:128 | 90% |
| C990 | annex-spec.md:5 | KSh1.339 billion; KSh13.79 billion |
| C997 | annex-spec.md:48 | Ksh 85 |
| C1015 | annex-spec.md:111 | 20%; 40%; 5%; 50%; 60% |

### 3.7 Other defects

- **X-1 Tier of the KSh 13.79bn envelope and the KSh 1.339bn own-source revenue is inconsistent.** C277, C314. Tier 1 in 3.1.2 and in the fiscal theme; Tier 3 in 2.8.2 and in `lib/data/figures.ts` (`budget.total`, `budget.osr.revised`). Corrected to Tier 3.
- **X-2 A population-density token is used as a percentage.** C924. 'The shares therefore sum to about {{sub.kitui-west.density}}%': a density value printed as a sum of shares. Either the sum is sourced and tokenised, or the clause is cut.
- **X-3 Assumption 2 is fused into assumption 1.** C107. Card 1's body runs on into '2. <window-chip> That is the window…'. The list also runs 1, (2), 3, 4, 4a, 4b, 4c, 4d, 5, 6, 7. Split and renumber 1–11.
- **X-4 The first four weeks run to Week 8; Phase 0 'Weeks 4–10' lists Weeks 1–8 tasks; ward champions recruited in 15 wards (Weeks 6–8) or 40 (Weeks 7–8).** C430, C435. Known since the October restructure (OPEN-ITEMS §3); still undecided. 14.1 is titled 'The first four weeks' in your table of contents; I propose keeping the title and moving Weeks 6–8 into 14.2, but that changes the plan's content, so it is your call.
- **X-5 The data-governance owner is named three ways.** C685, C704, C707. Digital Director at lean tier / Data Analyst from standard (15.4); the Analyst, for the audit scope (4.6.2); the Data Analyst/Modeller (4.6.3).
- **X-7 Role names that the team chapter never defines.** C953, C39. 'Digital Director' (E.5, E.8, E.10, 4.5.14, 4.5.6 Tier A), 'Director of Communications', 'Policy and Communications Research Lead', 'Campaign Field Operations Lead', 'Database and Ground Mobilization Coordinator', 'Campaign Communications Director', 'Firefly Director' (D.1), 'Paid Media & Analytics Manager' (4.5.14). 4.6 defines only Strategy Director, Analyst and Offline-layer Operator plus five surge roles. The 2026-09 change log raised this (§7 Q4) and it was never settled.
- **X-8 Level 1 has a two-person Firefly team; 4.6 says the three-person core is named at every level.** C80, C694. 
- **X-9 'Six core software components', five listed.** C1019. Known (OPEN-ITEMS §3).
- **X-10 HTML entities in the source.** C564, C546. `M&amp;E` and `&lt; 3 seconds`.
- **X-11 Missing space between sentences.** C168. '…throughout.The Auditor-General's…'.
- **X-12 Orphan line and a lead placed mid-section.** C324, C325. 
- **X-13 Dangling list introduction.** C386. 'Working examples, all requiring native-speaker verification before publication:' is followed by the Kiswahili bullet; the examples are the proverb cards further down.
- **X-14 A heading over one sentence.** C218. 
- **X-15 Timeline item with no 'when'.** C435. Last item of the Phase 0 timeline.
- **X-16 Annex E.6 scenarios run 1–5, 7.** C961. Known (OPEN-ITEMS §3).
- **X-17 Annex E jumps from E.10 to E.12.** C977. E.11 was folded into E.12 earlier; the number was kept. Renumbered F.1–F.11.
- **X-18 The cover counts the old structure.** C1. There are six Parts and seven annexes today; the new structure has six Parts and eight annexes.
- **X-19 Dates that have aged.** C6, C751, C13. Today is 29 October 2026. The cover says September 2026; the audit window ended 16 September; the box says the window 'opens in late October', which is now. These are the author's dates (OPEN-ITEMS §5); I will not change them without your instruction.
- **X-6 Unsourced or untiered figures in prose.** Besides 3.6: KSh 47m bursaries (no token); 'national average of 82' persons/km²; 21% basic drinking-water service; 7.2 km trekking distance; 72.5% food share of spending; 'diaspora registration from 12 to 26 countries' (no source anywhere); 84 solar boreholes (inventory to be supplied); the 61% CIDP water figure; KSh 85/kg and KSh 40 farm-gate prices; 17.4% completed secondary (already labelled 'not yet tiered').
- **X-20 Headings and labels in internal jargon** (house style): 'Critical Concentration Insights', 'Analytical Hierarchy', 'The "Big 4" Electorate Engine', 'Sourced Empirical Evidence', 'Strategic Digital Application', 'Total Decisive Deficit Pool', 'The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced)', 'Sourced Revenue Envelope', 'Platform Sizing & Realistic In-County Reach', 'Natural Hazards and NDMA Early-Warning Context', 'Linguistic Rules of Engagement', 'Key Architecture Principles', 'Mandatory Compliance Safeguards', 'Dual Operational Function', and the coined system names ('Closed-Loop Ground-Digital Integration Engine', 'Tri-Partite Metadata Mandate', 'Four-Step Conflict Resolution Protocol', 'Delegate Whip Contingency Plan', 'Evidence-First Pitch Engine', 'Trilingual Content Architecture', 'Translation & Quality-Control Gateway', '4-Step Governance Gateway', '7-Day Production Cadence', 'Three-Tier Escalation Hierarchy', 'Rapid Response & Opposition Handling System', 'Lean Core Delivery Model', 'The Out-of-County Kamba Diaspora Matrix'). Some of these names are also figure titles in `lib/figures`/`lib/register`, which the rewrite has to change in step.
- **X-21 Unearned adjectives and banned phrasing** (house style), counted in `content/`: 'empirical' 12, 'decisive' 10, 'outstanding' 4, 'unprecedented' 2 (both with an 80% beside them, so they may stay), 'robust' 2, 'leverage/leveraging' 3, and one each of 'surgical', 'pristine', 'irrefutable', 'infallible', 'immense', 'crippled', 'in strict adherence'. Also 'mathematically impossible', 'absolute, non-negotiable arithmetic necessity', '100% transparent' bursary formula (no source).
- **X-22 The generated copy.** `public/content/*.md` differs from `content/` in 16 files. That is by design: `scripts/build-content.ts` writes `public/content` from `content` with every token resolved and every visual compiled to JSON, so 'must match' means 'regenerated by `npm run content`', not 'identical'. `build-content --check` could not run here because `node_modules` is not installed; `build-anchors --check` passes (176 live headings, 1,546 redirects, 0 orphans). I will run `npm ci` before Step 2.
- **X-23 Opinion polling.** None found. The house rule holds today.

## 4. What the restructure touches outside `content/`

So you can see the size of Step 2 before approving it:

- `lib/heading-slug.ts` (SECTIONS, PARTS, TabId), `lib/flow.ts` (FLOW_ORDER, FLOW_ACTS), `lib/content-files.ts`: rebuilt to the new table of contents.
- `lib/anchors/`: a new `restructure-2026-11.json` moves file (old id → new id for all 176 live ids, plus every existing redirect key re-pointed), and `scripts/build-anchors.ts` reads it first, as it does the October file. The draft id table is in the reorganisation map.
- Components that mount on a heading (`HEADING_INSERTS`, `scripts/verify-mounts.mjs`), `lib/collapse-groups.ts`, `lib/section-heights.ts`, `lib/part-visuals.ts`, and the cover spine figure (`lib/register/specs/s0-cover.ts`) all name sections by id or number and move with them.
- The guards in `npm run verify` that pin the current text (`check:content` against base `8f10cb9`, the evidence ledger, `find-duplicates`, `visual-coverage`): their baselines move to the restructure commit, logged, as the October restructure did.
