# Dr. Makali Digital Campaign: Table of Contents Restructure Preview

*Read-only analysis for approval. Prepared 28 October 2026. British English. No change has been made to the repository or the live site.*

## 1. Summary of changes

**Headline finding.** The repository is not in the shape your brief's outline describes. In the repository (HEAD `9681948`, 29 September 2026) Part 1 is Objectives, Part 2 is The Data, Part 3 is The Analysis, and the decision requested sits last, in Part 6, about 89% of the way through. Part 5 is 49.3% of all words.

**The ten most significant changes**

1. Put the decision first. Part 1 becomes "The decision": the ask (old 6.3), goal and objectives (old 1.1 to 1.3), ownership and scope (old 5.1), levels and deliverables (old 5.5), commitments, dependencies (old 6.1) and assumptions (old 6.2.1).
2. Merge The Data and The Analysis into one Part 2, "The evidence" (old Parts 2 and 3: 20 numbered sections become 12). The two already cite each other on almost every page.
3. Break up Part 5 (23,549 words, four-level numbering, tab letters 5A to 5E that do not match the 5.2.n numbers). It becomes Delivery (Part 4), Measurement and governance (Part 5) and Risks and response (Part 6).
4. Give each of the fourteen workstreams one page (4.5.1 to 4.5.14) and move specification material to a new Annex G: platform playbooks, copy samples, volunteer programme, technology stack, model variable dictionary.
5. One home for data protection and compliance (5.3): old 5.7.4 to 5.7.9, 5.8.11 to 5.8.13, the DPA text in workstream 11, and the ODPC action box in old 6.2.
6. One pillar architecture (3.2) for the five groupings now spread over 4.1.4, 4.1.5, 4.4.1, 4.5.1 to 4.5.4 and 5.2.1.2.
7. One language section (3.6) from old 4.4.7 to 4.4.11. Old 4.4.8 and 4.4.11 are the same language map at two levels of detail.
8. One home each for the service-delivery tracker (4.5.1), rival monitoring (6.4, with analysis in 2.6.4 and outputs in E.12), the Level 2 recommendation (1.5.1, now stated three times near-verbatim), and rapid response (6.2, runbooks in Annex E).
9. Remove 11 empty, orphaned or out-of-order headings and return four stranded passages to their sections (old 5.8 intro, 5.9 intro, 5.6.4 trailing paragraph, Annex A pointer).
10. Cap numbering at three levels and list 21 numbering, cross-reference and wording errors to repair (section 3.3), plus eight content conflicts for you to decide (section 10).

**The numbers** (computed from the heading inventory unless marked estimate)

| Measure | Old | New |
|---|---|---|
| Headings, levels 2 to 6 | 333 (205 numbered, 128 unnumbered run-ins) | 145 numbered entries in the main text (6 Parts, 43 sections, 96 subsections), plus 7 annexes and 5 new Annex G entries; run-ins stay unnumbered |
| Content files | 18 | 18 mapped; final file layout is your call (section 10) |
| Deepest numbering | 4 levels (5.2.1.2), plus unnumbered levels to H6 | 3 levels |
| Largest Part | Part 5: 23,549 words (49.3%) | Not estimated: sizes depend on how Annex G is cut |
| Headings kept as they are | n/a | 40 (annexes A to F, objectives 1.3.x) |
| Headings moved | n/a | 209, of which 244 (all dispositions) land in a different Part |
| Headings merged | n/a | 67 |
| Headings removed (empty, orphan or duplicate; idea kept elsewhere) | n/a | 11 |
| Headings split | n/a | 5 |
| Headings renamed | n/a | 1 formally; Part titles and 10 section titles change (section 7.4) |
| Repeated prose removed or cut to a cross-reference | n/a | **Estimate:** about 2,000 words, about 4% of 47,768. Counted from the body text of the sections concerned, not by text comparison. About 30% of the text changes place. |

The mapping covers all 333 headings. Nothing is unmapped.

## 2. Coverage and method statement

**Read in full.** All 18 content files in `public/content/` (the resolved copies of `content/*.md`, with `{{figure}}` tokens replaced by values): cover, objectives, data, analysis, strategy, implementation, the four workstream files, delivery, nextsteps and the six annex files, 47,768 words. I also read `lib/heading-slug.ts` (the site's part and tab labels), `lib/content-files.ts`, `lib/section-index.ts`, `lib/figures/language.ts`, and `docs/restructure/03-verdict.md` and `04-target-architecture.md`.

**Not read, so unverified:**
- **The live site.** I could not fetch https://dr-makali-digital-campaign.vercel.app/ (the fetch tool refused a URL not seen earlier in the session, and a web search did not surface it). The as-is structure below comes from the repository, including the site's own navigation definitions. Anything the site assembles at runtime is unchecked. Please confirm that the deployment matches HEAD.
- **The 92 `figure` blocks.** Their tables and charts are drawn from TypeScript in `lib/` and `components/`. I read only the language figures. Duplication or conflict inside figures is therefore not assessed, and the claims below about figure-based sections rest on the section prose and captions.
- `content/` (the unresolved source), `data/*.ts`, `public/content/analysis/*.json`, `lib/register/specs/*`, `scripts/*`, and the git history were not read beyond HEAD.
- One line (the Kasalu bullet in 3.5) was truncated in my first pass and was read in full afterwards.
- Word counts are of the markdown, so a section that is mostly figure shows a low count.

**Assumptions I made:**
1. The repository at HEAD is what is deployed.
2. Where your brief's outline and the repository differ, the repository governs (your instruction in the context block).
3. "Section" references in the brief's hypotheses were mapped to the current numbering where they differ.
4. Today's date (28 October 2026) matters: the document is dated September 2026, so some of its forward dates have arrived (section 10).

**Self-check against the hard rules.** Read-only: yes, nothing was edited, committed or deployed. Every heading is in the mapping: yes (333 of 333). Every removal names a canonical home: yes (section 7.2). No prose was rewritten: yes, only headings, purposes and bridging notes are proposed. Figures and provenance: no figure is dropped; conflicts are listed, not resolved (section 10). Not met in full: rule 3 as regards figure data and the live site, disclosed above.

## 3. As-is table of contents

### 3.1 How the site presents it

From `lib/heading-slug.ts` (the navigation) and the markdown headings.

| Nav label | Tab | File | Words | Numbering in the file |
|---|---|---|---|---|
| Cover | cover | cover.md | 149 | none |
| 1 Objectives | objectives | objectives.md | 1,221 | 1.1 to 1.5 |
| 2 The Data | data | data.md | 2,824 | 2.1 to 2.9 |
| 3 The Analysis | analysis | analysis.md | 5,471 | 3.1 to 3.11 |
| 4 The Strategy | strategy | strategy.md | 8,197 | 4.1 to 4.8 |
| 5 Implementation | implementation | implementation.md | 1,346 | 5.1, 5.2 |
| 5A Platforms & content | workstreams-platforms | workstreams-platforms.md | 2,623 | 5.2.1 (workstreams 1 to 4) |
| 5B Publishing & earned media | workstreams-media | workstreams-media.md | 1,951 | 5.2.2 (5 and 6) |
| 5C Ground & offline reach | workstreams-ground | workstreams-ground.md | 2,936 | 5.2.3 (7 to 10) |
| 5D Data & technology | workstreams-data | workstreams-data.md | 3,239 | 5.2.4 (11 to 14) |
| 5E Plan, measures & governance | delivery | delivery.md | 11,454 | 5.3 to 5.9 |
| 6 Next Steps | nextsteps | nextsteps.md | 1,893 | 6.1 to 6.3 |
| Annex A Evidence standard | annex-evidence | annex-evidence.md | 507 | A.1 |
| Annex B County reference | annex-county | annex-county.md | 1,126 | B.1 to B.5 |
| Annex C Message assignment | annex-messages | annex-messages.md | 957 | C.1, C.2 |
| Annex D Cadence & escalation | annex-cadence | annex-cadence.md | 297 | D.1, D.2 |
| Annex E Response runbooks | annex-runbooks | annex-runbooks.md | 1,361 | E.1 to E.12 |
| Annex F Terms | annex-terms | annex-terms.md | 216 | F.1, F.2 |

Words per Part: Cover 149; 1 1,221; 2 2,824; 3 5,471; 4 8,197; **5 23,549 (49.3%)**; 6 1,893; Annexes 4,464; total 47,768.

The tab letters 5A to 5E are navigation labels only. The headings inside them are 5.2.1 to 5.2.4 and 5.3 to 5.9, so a reader sees "5C" on the tab and "5.2.3.3" on the page.

### 3.2 Section-level contents (second numbering level, with words including all subsections)

| Ref | Heading | Words | Sub-headings |
|---|---|---|---|
| 1.1 | The goal: the Wiper ticket first, the county second | 73 | 0 |
| 1.2 | The two deadlines | 111 | 0 |
| 1.3 | Five objectives for the digital operation | 683 | 5 |
| 1.4 | How this proposal is built | 189 | 0 |
| 1.5 | How success will be judged | 22 | 0 |
| 2.1 | The electorate | 226 | 0 |
| 2.2 | How Kitui has voted | 371 | 0 |
| 2.3 | The nomination rules and the calendar | 398 | 2 |
| 2.4 | The county's people and economy | 296 | 0 |
| 2.5 | The budget the next governor runs | 275 | 0 |
| 2.6 | How people get information | 296 | 0 |
| 2.7 | Who owns the airwaves | 338 | 1 |
| 2.8 | Dr. Mulu's public record | 416 | 0 |
| 2.9 | His channels today, and his rivals' | 62 | 0 |
| 3.1 | The number it takes | 270 | 0 |
| 3.2 | Where the votes are | 427 | 1 |
| 3.3 | Four routes to the number | 647 | 0 |
| 3.4 | Where he is known and where he isn't | 388 | 0 |
| 3.5 | What his rivals have already proven | 831 | 0 |
| 3.6 | Where party loyalty won't carry him | 213 | 0 |
| 3.7 | The three regions | 647 | 3 |
| 3.8 | What each channel can physically reach | 1,070 | 1 |
| 3.9 | What his current presence shows | 156 | 1 |
| 3.10 | What the data can't yet tell us | 212 | 1 |
| 3.11 | The diagnosis, and the evidence that could overturn it | 207 | 0 |
| 4.1 | The position | 1,811 | 6 |
| 4.2 | Where the effort goes | 373 | 0 |
| 4.3 | Who we are trying to move | 2,431 | 8 |
| 4.4 | What we say, and in which language | 1,851 | 11 |
| 4.5 | What gets published | 727 | 5 |
| 4.6 | Which channel does which job | 395 | 1 |
| 4.7 | Fix first: six profile corrections | 160 | 0 |
| 4.8 | When the plan changes | 35 | 0 |
| 5.1 | Who owns what: fourteen workstreams | 1,208 | 7 |
| 5.2 | The workstreams in detail | 10,197 | 18 |
| 5.3 | The first four weeks | 1,624 | 7 |
| 5.4 | The phases to August 2027 | 1,216 | 9 |
| 5.5 | What Dr. Mulu receives, and how often | 1,408 | 4 |
| 5.6 | How progress is measured | 1,057 | 8 |
| 5.7 | How decisions are made | 2,758 | 9 |
| 5.8 | Risks and responses | 1,837 | 15 |
| 5.9 | How the work is staffed | 1,040 | 6 |
| 6.1 | What this needs from the campaign | 148 | 0 |
| 6.2 | Open items | 875 | 1 |
| 6.3 | The decision: one week and one export | 817 | 2 |
| A.1 | Evidence standard: provenance and source tiers | 428 | 4 |
| B.1 | The 40-ward register | 223 | 0 |
| B.2 | County money and the audit record | 140 | 0 |
| B.3 | Drought, food security and climate pressure | 90 | 0 |
| B.4 | Mui Basin coal and the displaced communities | 69 | 0 |
| B.5 | Each rival, and the legal ground to be careful on | 435 | 0 |
| C.1 | Message assignment by segment | 819 | 0 |
| C.2 | Message assignment by channel | 13 | 0 |
| D.1 | Cadence and the meeting rhythm | 234 | 0 |
| D.2 | The escalation path | 23 | 0 |
| E.1 | The four-tier response decision tree | 24 | 0 |
| E.2 | Response times, by channel | 4 | 0 |
| E.3 | Holding positions, pre-drafted | 22 | 0 |
| E.4 | Monitoring tools | 114 | 0 |
| E.5 | Rapid-response protocol and pre-approved message library | 131 | 0 |
| E.6 | Red-team drills | 277 | 0 |
| E.7 | The threat model | 105 | 0 |
| E.8 | Account security baseline | 179 | 0 |
| E.9 | Phishing awareness | 80 | 0 |
| E.10 | The incident response plan | 170 | 0 |
| E.11 | Competitor monitoring tools | 67 | 0 |
| E.12 | Competitive intelligence outputs and rapid alerts | 81 | 0 |
| F.1 | Confidentiality and use | 123 | 0 |
| F.2 | Who this is for, and on what terms | 78 | 0 |

The full heading list, with each unnumbered run-in, is in the mapping table (section 6).

### 3.3 Differences from your outline, and errors found

**Differences from the brief's outline**

| Outline says | Repository has |
|---|---|
| Part 1 The Data (1.1 to 1.9) | Part 1 is Objectives (1.1 to 1.5). The Data is Part 2 (2.1 to 2.9) |
| Part 2 The Analysis (2.1 to 2.11) | The Analysis is Part 3 (3.1 to 3.11) |
| Part 3 Objectives (3.1 to 3.5) | Objectives is Part 1 |
| Parts 4 and 6, Annexes A to F | Match |
| Part 5 split 5A to 5E | True of the navigation tabs only; headings use 5.2.1 to 5.2.4 and 5.3 to 5.9 |
| Workstream 14 nested under 13 | Not found: 5.2.4.4 is a sibling of 5.2.4.3 |

**Numbering and wording errors (all verified in the text)**

| # | Where | Error |
|---|---|---|
| 1 | 2.3.1 | Opens "Section 1.2 opened with the claim this entire Phase −1 strategy…" and refers to the phasing in "Section 1.5". Those numbers are now the deadlines and the scorecard (legacy numbering). |
| 2 | 3.7.3 | Cites "Section 3.3.3" (3.3 has no subsections) and "SMS/USSD (Section 4.3)" (4.3 is voter segments; should be 5.2.3.3 or 4.6). |
| 3 | 3.7.3 end | An orphan lead-in sentence ("What digital reach can and cannot deliver…") sits above 3.8 and belongs to it. |
| 4 | 5.2.1.1 Build | "(Section 4.3)" for the USSD/SMS layer; should be 5.2.3.3. |
| 5 | 5.2.4.1 | Cites "Section 5.2.1.4 of the DPA 2019"; in this document 5.2.1.4 is Accessibility. |
| 6 | 5.2.4.3 | Cites "Section 5.2.3.4" as the DPA twice (it is Volunteers); component 5 is headed "Section 5.2.4 Digital Charter Platform" (no such section); the intro promises "six core software components" and lists five. |
| 7 | 5.2.3.3 | "See Sections 4.4.11 and 5.7.4 for the regulatory basis": 4.4.11 is channel-by-language deployment and 5.7.4 is an empty heading. |
| 8 | 5.7.7 | "Published deletion schedule (16.4)": no section 16.4 exists. |
| 9 | 5.8.1 | Names "Defamation Law Safeguards (Section A.1.1)"; the safeguards are 5.8.3 and A.1.1 is provenance. |
| 10 | 5.7 / 5.7.3 | A pointer says "the table below" is who decides what; the table above it is 5.7.2. |
| 11 | 5.7.9 to 5.8 | The intro sentence of 5.8 ("What can go wrong…") is stranded at the end of 5.7.9. |
| 12 | 5.8.14 to 5.8.15 | The opening paragraphs and org-chart figure of 5.9 ("Dr. Mulu already has a team…") and the Annex A pointer sit under 5.8.14, above the 5.8.15 heading. |
| 13 | 5.6.4 | A trailing paragraph ("Political strategy without empirical measurement…") introduces 5.6.5 and 5.6.6 but sits under 5.6.4; 5.6.3 is empty. |
| 14 | 5.3.3 | A 30-word intro sits after 5.3.1 and 5.3.2, out of order. |
| 15 | 5.1.1 vs 5.5.4 | Ownership counts differ: seven Firefly, six team, two outside (15, because workstream 1 is split) against six, six, two (14). |
| 16 | 5.2.1.2 | Says the four content pillars are kept "because the message grids in Annex C index against them"; Annex C states it was re-cut against the 4.5 pillars. |
| 17 | 5.3 / 5.3.7 | "The first four weeks" runs to Week 8; Phase 0 is "Weeks 4–10" but lists Weeks 1 to 4 tasks; champions are recruited in 15 wards (5.3, Weeks 6 to 8) or 40 (5.3.7, Weeks 7 to 8). |
| 18 | E.6 | Scenario table numbers run 1, 2, 3, 4, 5, 7 (no 6). |
| 19 | 6.2.1 | List numbering runs 4, 4a, 4b, 4c, 4d, 5. |
| 20 | Phase −1 | 15 uses in 7 files. 5.4 defines Phase −1 and Phase 0 but has no subsection for either (5.4.1 to 5.4.3 are Phases 1 to 3). |

Minor: HTML entities (`&amp;`, `&lt;`) appear in three places in the workstream files and may render literally.

## 4. Diagnosis

### 4.1 Your hypotheses, tested

| Hypothesis | Result | Evidence |
|---|---|---|
| Pillar content told several times | Confirmed | Five groupings: campaign pillars (4.1.4, 4.1.5), message pillars (4.4.1), production pillars (4.5.1 to 4.5.4), content pillars A to D (5.2.1.2), plus six themes (4.1.6). 4.1.4 itself lists the others. |
| Rapid response and war room in several places | Partly | Workstream 2 (5.2.1.2) holds the content approval gateway, not rapid response. The four-hour response cycle is in workstream 7 (5.2.3.1). Otherwise confirmed: 5.8.1, 5.8.5, 5.8.7, D.2, E.1 to E.6. |
| Competitor monitoring repeated | Partly | 5.8.8 to 5.8.10, B.5, E.11 and E.12 confirmed. Opposition tracking is in workstream 7's field reports (5.2.3.1), not workstream 2. E.4 and E.11 share three identical tool rows (Meta Ad Library, Google Ads Transparency Centre, radio monitoring). |
| Data protection repeated | Confirmed, wider | 5.7.4 to 5.7.9, 5.8.11 to 5.8.13, workstream 11, plus workstreams 8, 9 and 12, 5.2.4.3 per-component risk, and the ODPC box in 6.2. |
| Measurement repeated | Confirmed | 1.5, 5.3, 5.4 tables, 5.6, workstream 14, and KPI tables inside workstreams 1 and 9. The 5.4 phase tables and the 5.2.3.3 offline KPI table carry the same targets (consented contacts 15,000/40,000/80,000/120,000; tracker reports 500/3,000/8,000). |
| Scope levels repeated | Confirmed | The Level 2 recommendation and its justification are stated near-verbatim in 5.1.1, 5.1.4 and 5.5.2. |
| Segments (4.3 vs Annex C); 4.4.8 vs 4.4.11 | Confirmed | C.1 says it is a different cut of the same electorate. `lib/figures/language.ts` records that 4.4.8 and 4.4.11 state one language map at two levels of detail. |
| Offline and vernacular reach repeated | Confirmed | 2.6, 2.7, 3.8, 3.8.1, 4.6, 5.2.3.1, 5.2.3.3. Five different Kamba station lists (conflict C7). |
| Staffing and roles repeated | Partly | 5.7.2, 5.9.2, 5.9.4 overlap, but the larger problem is three different "cores" in 5.9 that the text has to disambiguate. |
| Part 5 too large; lettering hard to navigate | Confirmed | 49.3% of words; tab letters 5A to 5E against 5.2.n numbers; four numbering levels plus run-ins. |
| Numbering glitches | Partly | WS14 nesting not found; 21 other errors in section 3.3. |
| 5.3 and Phase 0 timing inconsistent | Confirmed | Section 3.3, row 17. |

### 4.2 Duplication register

| # | Topic | Locations | Overlap | Strongest version |
|---|---|---|---|---|
| D1 | Pillars | 4.1.4, 4.1.5, 4.1.6, 4.4.1, 4.5 opener to 4.5.4, 5.2.1.2 | Partial (five taxonomies, shared ideas) | 4.5 for production, 4.4.1 for evidence |
| D2 | Level 2 recommendation | 5.1.1, 5.1.4, 5.5.2 | Full | 5.5.2 |
| D3 | Scope lists | 5.1.6, 5.1.7 against 5.1.3, 5.2.x | Substantial, and contradictory (C4) | 5.1.3 and the workstream pages |
| D4 | Service-delivery tracker | 4.1, 4.4.5, 5.2.1.1, 5.2.3.3 option 3, 5.2.4.3 component 5, 5.6.6 | Substantial, three scope definitions (C5) | 5.2.1.1 |
| D5 | Rapid response and escalation | 5.2.3.1, 5.8.1, 5.8.5, 5.8.7, D.2, E.1 to E.5 | Substantial (by title and caption; figure bodies not read) | E.5 for severity; 5.8.7 for the 30-minute clock |
| D6 | Rival monitoring and analysis | 3.5, 5.8.8 to 5.8.10, B.5, E.4, E.11, E.12, 5.3.5 steps 5 and 6 | B.5 vs 3.5: substantial (same seven rivals); E.4 vs E.11: substantial | 3.5 for people; E.12 for outputs |
| D7 | Data protection and ethics | 5.7.4 to 5.7.9, 5.8.11 to 5.8.13, 5.2.4.1, 5.2.4.2, 5.2.4.3, 5.2.3.3, 5.2.3.2, 6.2 | Partial, six locations | 5.7.8 (charter), 5.7.9 (gate) |
| D8 | Measurement targets | 1.3.x, 5.3, 5.4, 5.6, 5.2.1.1, 5.2.3.3, 5.2.4.4 | Substantial for the offline KPIs | 5.4 ladder |
| D9 | Offline reach | 3.8.1 against 5.2.3.1 and 5.2.3.3; 2.6 against 5.2.3.3 | Substantial (market days, SMS, USSD, M-Pesa agents) | 5.2.3.3 for what Firefly runs; 3.8.1 for the reach facts |
| D10 | Language map | 4.4.7, 4.4.8, 4.4.11, 5.2.1.4 | Substantial; numbers differ (C1) | 4.4.8 |
| D11 | The electorate and benchmark | 2.1 and 3.1 (532,758; 605,703; 198,004; 61.7%) | Substantial | 3.1 for the arithmetic; 2.1 for the 2026 decomposition (61,839 and 11,106) |
| D12 | Ask, parties, terms | Cover, 1.4, 6.3.1, 6.3.2, F.1, F.2 | Substantial | Cover and 6.3.2 |
| D13 | Radio ownership | 2.7.1, 3.8.1, 4.3.2, 5.2.2.2, 5.8.2 | Substantial; lists differ (C7) | 5.2.2.2 table |

### 4.3 Misplacement register

| # | Content | Now in | Reader would look in |
|---|---|---|---|
| M1 | Term limits: 2027 is an open seat | 5.8.15 (risks) | The field, 2.6 |
| M2 | Analysis of Dr. Kasalu's position | 5.8.10 (competitor monitoring) | The field, 2.6.4 |
| M3 | Six profile corrections | 4.7 (strategy) | First weeks, 4.2.3 |
| M4 | Tracker dual function | 5.6.6 (measurement) | Workstream 1, 4.5.1 |
| M5 | Audit method | 5.3 (a plan section) | Measurement, 5.2 |
| M6 | Data charter and compliance gate | 5.7 ("How decisions are made") | Compliance, 5.3 |
| M7 | Outside-scope list | 5.1.3 at word ~17,900 | The decision, 1.4.3 |
| M8 | Dependencies and assumptions | 6.1 and 6.2.1 at word ~41,400 onward | The decision, 1.7 and 1.8 |
| M9 | Variable dictionary (416 words), component specs, platform playbooks, copy samples | 5.2.1.2, 5.2.2.1, 5.2.4.2, 5.2.4.3 | Annex G |
| M10 | Workstream 10, which its own banner places outside the engagement (504 words) | 5.2.3.4 | Boundary only in 4.5.10; detail in G.3 |

### 4.4 Fragmentation register

- **Language:** five fragments in 4.4.7 to 4.4.11 (two have four words of text and a figure each); a sixth in 5.2.1.4.
- **Compliance:** 5.7.4 to 5.7.9, 5.8.11 to 5.8.13, three workstreams, 6.2.
- **First-weeks timeline:** 5.3, 5.3.7, the Phase −1 and Phase 0 rows of 5.4.7, the box in 6.3, assumption 2 in 6.2.1.
- **Tracker:** six places (D4). **Competitor monitoring:** nine (D6). **Rapid response:** nine (D5).
- **The operated layer (what Firefly runs):** 5.1.1, 5.2.3.3, 5.7.5 (controller position), 5.9.2, cover.

### 4.5 Flow assessment

Reader journey: decision and ask, evidence, strategy, delivery and who, governance and measurement, risks, reference.

- **The decision arrives last.** Part 6 begins at about word 41,400 of 47,768 (87%); the ask itself (6.3.1 and 6.3.2) falls at about word 42,500 (89%). Estimate from file word counts. The earlier restructure in `docs/restructure/03-verdict.md` reached the same conclusion about the previous layout and promoted a decision layer; the present layout puts Objectives first but still ends on the ask.
- **Forward references in Part 1.** Each of 1.3.1 to 1.3.5 cites "finding it answers" in Sections 3.x and "served by" 4.x, 5.x. A reader must hold five objectives with no evidence yet.
- **Unresolved questions carried forward.** The nomination method is Tier 3 (2.3.2) but acted on from 1.2 onward; the gate that decides whether modelling is lawful (5.7.9) is met at word ~38,000 after the model (5.2.4.2).
- **Detail before reason.** Workstream specifications (variable dictionaries, tool matrices, platform copy) arrive before the staffing, levels and measurement that tell the reader which of them they are buying.
- **Backward jumps.** Leaders of 4.x sections are well done ("Because Section 3.5: …"); keep them. The jumps back come from 5.x ("Section 4.6 puts the reach…") and 6.x.

### 4.6 Purpose-fit assessment

| Old Part | Kind of content | Fit |
|---|---|---|
| 1 Objectives | Decision and specification | Good. Five objectives share one six-field structure. |
| 2 The Data | Register of graded facts | Good. Two sections (2.3, 2.6) are mostly empty headings above figures. |
| 3 The Analysis | Argument with proofs | Good, but split from Part 2, with a 5,471-word file and orphaned lead-ins. |
| 4 The Strategy | Argument and reference | Mixed. Six 250-word segment cards (4.3.2 to 4.3.7) are reference; 4.4.7 to 4.4.11 is five fragments. |
| 5 Implementation | Specification, schedule, register, governance, runbook and staffing in one Part | Poor. 333-heading corpus, one 11,454-word file (5E), four numbering levels. |
| 6 Next Steps | Decision | Right content, wrong position. |
| Annexes | Reference and runbooks | Good. Annex D and E are close in kind (see 7.1). |

### 4.7 Navigation assessment

- A leader looking for "who decides what" finds it at 5.7.2 inside 5E; for "what is outside scope" at 5.1.3; for "what I must provide" at 6.1. Under 30 seconds is not realistic for any of these without search.
- Tab letters do not match heading numbers (5C against 5.2.3).
- `lib/section-index.ts` indexes levels 2 and 3 only, so the 105 level-4 and 22 level-5 headings are reachable only by scrolling.
- Workstream 14 is read first (5.3 says so) but numbered last.

## 5. Proposed new table of contents

Three numbering levels at most. Run-in headings below level 3 stay unnumbered. The reader question is under each Part.

**Cover and terms.** Who it is for, who prepared it, status, and the line that Firefly holds no credentials.


### PART 1 — The decision
*Question: What is being asked, what do I get, who does what, and what must I decide or provide?*

    - **1.1** The ask: one week and one export — The ask and the window behind it (old 6.3, 6.3.1, 6.3.2).
    - **1.2** The goal and the two deadlines — Wiper nomination first, county second; the 200,000-vote benchmark (old 1.1, 1.2).
    - **1.3** Five objectives for the digital operation — Each objective with finding, baseline, target, owner, measure (old 1.3, 1.3.1 to 1.3.5).
        - **1.3.1** Be known where he isn't yet
        - **1.3.2** Turn his record into visible proof
        - **1.3.3** Build a direct line to the voters the internet doesn't reach
        - **1.3.4** Give every post a voter, a ward and a reason
        - **1.3.5** Hold the home base while Kitui Central runs its own race
    - **1.4** Who does what: ownership and boundaries — Fourteen workstreams by owner, and what is outside scope (old 1.4, 5.1).
        - **1.4.1** How the engagement runs in three steps — Analyse, strategise, direct (old 1.4).
        - **1.4.2** The fourteen workstreams, by owner — Old 5.1.1, 5.1.2; includes the Firefly proposition (old 5.7.2 run-in).
        - **1.4.3** What is outside this scope — Old 5.1.3, unchanged.
    - **1.5** What Dr. Mulu receives, and at which level — Old 5.5.
        - **1.5.1** The three scope levels — Definitions of the four nested quantities, then Lean, Standard, Premium; the Level 2 recommendation is stated here once.
        - **1.5.2** The scope levels compared — Old 5.5.2.
        - **1.5.3** The deliverables schedule — Old 5.5.3.
    - **1.6** What this proposal commits to, and what it does not — Old 5.5.4.
    - **1.7** What the campaign must provide — Old 6.1: nine dependencies, three that gate everything.
    - **1.8** What this proposal rests on — Old 6.2.1: assumptions and what moves if each fails.
    - **1.9** How success will be judged — One-paragraph summary of old 1.5, pointing to 5.1.

### PART 2 — The evidence
*Question: What does the record show, and why is the plan shaped this way? (Old Parts 2 and 3 merged.)*

    - **2.1** The electorate and the number it takes — Old 2.1 and 3.1.
    - **2.2** How Kitui has voted — Old 2.2.
    - **2.3** Where the votes are — Old 3.2.
        - **2.3.1** The constituencies that decide it — Old 3.2.1.
    - **2.4** Four routes to the number — Old 3.3.
    - **2.5** The nomination rules and the calendar — Old 2.3.
        - **2.5.1** How Wiper picks its candidate — Old 2.3.1.
        - **2.5.2** Where the selection method stands — Old 2.3.2.
    - **2.6** The field: rivals and an open seat — Old 3.5, 5.8.10, 5.8.15.
        - **2.6.1** Stage one: the Wiper nomination — Old 3.5 Stage One.
        - **2.6.2** Stage two: the general election field — Old 3.5 Stage Two.
        - **2.6.3** The incumbent is term-limited: 2027 is an open seat — Old 5.8.15.
        - **2.6.4** Reading the current field — Old 5.8.10.
    - **2.7** Where he is known and where he isn't — Old 3.4 and 3.6.
        - **2.7.1** The deficit pool — Old 3.4.
        - **2.7.2** Where party loyalty won't carry him — Old 3.6.
    - **2.8** The county: people, budget and three regions — Old 2.4, 2.5, 3.7.
        - **2.8.1** People and economy — Old 2.4.
        - **2.8.2** The budget the next governor runs — Old 2.5.
        - **2.8.3** The three regions — Old 3.7, 3.7.1 to 3.7.3.
    - **2.9** How voters get information, and what each channel can reach — Old 2.6, 2.7, 3.8.
        - **2.9.1** Connectivity — Old 2.6.
        - **2.9.2** Who owns the airwaves — Old 2.7, 2.7.1; the station table lives in 4.5.6.
        - **2.9.3** The digital ceiling: what digital can and cannot do — Old 3.8.
        - **2.9.4** The offline majority and the infrastructure that reaches it — Old 3.8.1.
    - **2.10** His record and his channels today — Old 2.8, 2.9, 3.9.
        - **2.10.1** His public record — Old 2.8.
        - **2.10.2** His channels today, and his rivals' — Old 2.9.
        - **2.10.3** What his current presence shows — Old 3.9, 3.9.1.
    - **2.11** What the data can't yet tell us — Old 3.10, 3.10.1.
    - **2.12** The diagnosis, and the evidence that could overturn it — Old 3.11.

### PART 3 — The strategy
*Question: What do we do about it, and why that?*

    - **3.1** The position — Old 4.1.
        - **3.1.1** The evidence behind the claim — Old 4.1.1.
        - **3.1.2** The resource paradox — Old 4.1.2.
        - **3.1.3** Answering the charge that discipline is cold — Old 4.1.3.
    - **3.2** The pillar architecture — One hierarchy for the five groupings now scattered across 4.1, 4.4, 4.5 and 5.2.1.2.
        - **3.2.1** Campaign pillars — Old 4.1.4, 4.1.5.
        - **3.2.2** Message pillars and their proof points — Old 4.4.1, with the flagship-commitment sizing note.
        - **3.2.3** Production pillars and the visit-to-verification loop — Old 4.5 opener, 4.5.1 to 4.5.4, and the content pillars A to D of old 5.2.1.2.
        - **3.2.4** The six campaign themes — Old 4.1.6.
    - **3.3** Where the effort goes, and which channel does which job — Old 4.2, 4.6, 4.6.1.
        - **3.3.1** The weighting, and the finding it answers — Old 4.2.
        - **3.3.2** Which channel does which job — Old 4.6.
        - **3.3.3** The gatekeeper bottleneck — Old 4.6.1.
    - **3.4** Who we are trying to move — Old 4.3.
        - **3.4.1** The universes: voter, turnout, victory, base, persuasion, mobilisation — Old 4.3 opening table.
        - **3.4.2** The six voter segments — Old 4.3.1 to 4.3.7.
        - **3.4.3** Segment sizing, and the evidence for it — Old 4.3.8.
    - **3.5** What we say: claims, counter-messaging and framing — Old 4.4 (without the language material).
        - **3.5.1** Counter-messaging against disinformation — Old 4.4.2.
        - **3.5.2** Persuasion principles and message discipline — Old 4.4.3 to 4.4.5.
        - **3.5.3** Framing, worked through in examples — Old 4.4.6.
    - **3.6** Language, register and dialect — Old 4.4.7 to 4.4.11 as one section.
        - **3.6.1** Which language reaches which voters, on which channel — Old 4.4.7, 4.4.8, 4.4.11.
        - **3.6.2** Register, dialect and the discipline it takes — Old 4.4.9.
        - **3.6.3** The production and quality-control pipeline — Old 4.4.10.
    - **3.7** A week of publishing, before and after — Old 4.5.5.
    - **3.8** When the plan changes — Old 4.8.

### PART 4 — Delivery
*Question: How is it run, when, by whom?*

    - **4.1** How the engagement runs week to week — Old 5.7 (the operating model; compliance moves to 5.3).
        - **4.1.1** Operating rhythm, tooling and reporting lines — Old 5.7.1.
        - **4.1.2** Who does what, in one table — Old 5.7.2.
        - **4.1.3** Decision rights and content approval — Old 5.7.3.
    - **4.2** The first weeks: audit, foundations, instrumentation — Old 5.3 plan and KPIs, 5.3.7 Phase 0, 4.7.
        - **4.2.1** Week-by-week plan and KPIs — Old 5.3.
        - **4.2.2** Phase 0: instrumentation — Old 5.3.7 (timing to be reconciled with 4.2.1).
        - **4.2.3** Fix first: six profile corrections — Old 4.7.
    - **4.3** The phases to August 2027 — Old 5.4.
        - **4.3.1** The target ladder — Old 5.4 opening tables.
        - **4.3.2** Phase 1: Awareness and community building — Old 5.4.1.
        - **4.3.3** Phase 2: Engagement and persuasion — Old 5.4.2.
        - **4.3.4** Phase 3: Mobilisation and GOTV — Old 5.4.3.
        - **4.3.5** Post-election — Old 5.4.4.
    - **4.4** Coalitions and endorsements — Old 5.4.5 to 5.4.9.
    - **4.5** The fourteen workstreams — One page each: owner, what it produces, KPIs, boundaries. Specifications go to Annex G.
        - **4.5.1** Workstream 1 — Owned platforms and the service-delivery tracker — Group: platforms and content. Absorbs old 5.6.6.
        - **4.5.2** Workstream 2 — The content brief and asset governance — Group: platforms and content.
        - **4.5.3** Workstream 3 — Creative testing and AI assistance — Group: platforms and content.
        - **4.5.4** Workstream 4 — Accessibility and inclusion — Group: platforms and content.
        - **4.5.5** Workstream 5 — Platform tactics and paid media — Group: publishing and earned media.
        - **4.5.6** Workstream 6 — Earned media, journalists and debates — Group: publishing and earned media. Owns the station table.
        - **4.5.7** Workstream 7 — Ground-digital integration — Group: ground and offline reach.
        - **4.5.8** Workstream 8 — The field-to-digital loop — Group: ground and offline reach.
        - **4.5.9** Workstream 9 — What Firefly operates: SMS, USSD and voice — Group: ground and offline reach.
        - **4.5.10** Workstream 10 — Digital organising and volunteers (outside the engagement) — Group: ground and offline reach. Boundary only.
        - **4.5.11** Workstream 11 — The data layer — Group: data and technology.
        - **4.5.12** Workstream 12 — Predictive voter modelling — Group: data and technology.
        - **4.5.13** Workstream 13 — The technology stack (mostly outside the engagement) — Group: data and technology.
        - **4.5.14** Workstream 14 — Analytics and attribution — Group: data and technology.
    - **4.6** How the work is staffed — Old 5.9, 5.9.1 to 5.9.6.

### PART 5 — Measurement and governance
*Question: How will we know it is working, and how is it kept lawful?*

    - **5.1** The indicators — Old 5.6 (without the tracker).
        - **5.1.1** Stage scorecards: nomination window and general election — Old 5.6.1, 5.6.2.
        - **5.1.2** Recognition and persuasion where he is least known — Old 5.6.4.
        - **5.1.3** Why vanity metrics are excluded — Old 5.6.7.
        - **5.1.4** Performance governance and executive escalation — Old 5.6.8.
    - **5.2** The presence audit: method — Old 5.3.1 to 5.3.6 and 5.6.5.
        - **5.2.1** The measurement set — Old 5.3.1.
        - **5.2.2** The window — Old 5.3.2.
        - **5.2.3** Why this comes first — Old 5.3.4.
        - **5.2.4** Method — Old 5.3.5.
        - **5.2.5** What this section is not — Old 5.3.6.
        - **5.2.6** Testing the hypothesis on existing records — Old 5.6.5.
    - **5.3** Data protection, ethics and compliance — Old 5.7.4 to 5.7.9, 5.8.11 to 5.8.13, DPA content in WS11, ODPC action item in 6.2.
        - **5.3.1** The standard we hold ourselves to, and who is controller — Old 5.7.5.
        - **5.3.2** The regulatory environment and compliance measures — Old 5.7.6, 5.7.7, DPA safeguards from WS11.
        - **5.3.3** The Digital Ethics and Data Charter — Old 5.7.8.
        - **5.3.4** The compliance sign-off gate — Old 5.7.9.
        - **5.3.5** Statutory compliance, IEBC clearance and liability — Old 5.8.11 to 5.8.13.
        - **5.3.6** Open regulatory action items — Old 6.2 ODPC box.

### PART 6 — Risks and response
*Question: What could go wrong, and what happens when it does?*

    - **6.1** The six risks that decide whether the plan survives — Old 5.8 opening.
    - **6.2** Rapid response and the war room — Old 5.8.1 to 5.8.5.
        - **6.2.1** Rapid-response protocol and opposition handling — Old 5.8.1.
        - **6.2.2** What we monitor, and how threats reach us — Old 5.8.2.
        - **6.2.3** Staying inside defamation law — Old 5.8.3.
        - **6.2.4** War room operating model, shift coverage and dashboard — Old 5.8.4, 5.8.5.
    - **6.3** Manipulated media and cybersecurity — Old 5.8.6.
        - **6.3.1** The deepfake and manipulated media protocol — Old 5.8.7.
    - **6.4** Competitor monitoring — Old 5.8.8, 5.8.9; analysis of rivals is in 2.6.4.
        - **6.4.1** Public sources only, and the line we do not cross — Old 5.8.9.
    - **6.5** If the nomination becomes a delegate primary — Old 5.8.14.

**ANNEX A — Evidence standard.** Unchanged (A.1 to A.1.4).


**ANNEX B — County reference.** B.1 to B.4 unchanged; B.5 cut to legal-attribution guidance.


**ANNEX C — Message assignment.** Unchanged (C.1, C.2).


**ANNEX D — Cadence and escalation.** Unchanged (D.1, D.2).


**ANNEX E — Response runbooks.** E.1 to E.10 and E.12 retained; E.11 folded into E.12.


**ANNEX F — Terms.** F.1 retained; F.2 reduced to a pointer to the cover.


**ANNEX G — Channel and technical specifications (new).** Reference that the main text points to, not argues from.

    - **G.1** Platform playbooks — Facebook, X, WhatsApp, TikTok, Instagram, YouTube, Google Ads (old 5.2.2.1).
    - **G.2** Formats, copy samples and USSD pointer — Old 5.2.1.2 formats and samples.
    - **G.3** Volunteer programme reference — Old 5.2.3.4 detail.
    - **G.4** Technology reference architecture — Old 5.2.4.3 components, procurement matrix, technical risk.
    - **G.5** Voter model: data sources and variable dictionary — Old 5.2.4.2 data sources and variables.

## 6. Old-to-new mapping table

Unnumbered headings are shown as `[file]`. "(run-in)" means the heading stays as an unnumbered sub-heading inside the new section.

| Old ref | Old heading | Disposition | New ref | Note |
|---|---|---|---|---|
| [cover] | Prepared for, prepared by, and on what terms | Merged | Cover | Joins F.2 and the sign-off block in old 6.3.1; one statement of parties, status and the no-credentials line |
| 1.1 | The goal: the Wiper ticket first, the county second | Merged | 1.2 | With old 1.2: one goal-and-deadlines section |
| 1.2 | The two deadlines | Merged | 1.2 | With old 1.1 |
| 1.3 | Five objectives for the digital operation | Kept | 1.3 | Promoted into the decision layer; sub-numbers unchanged in form (1.3.1 to 1.3.5) |
| 1.3.1 | Be known where he isn't yet | Kept | 1.3.1 | Content unchanged; cross-references to Sections 3.x and 4.x re-pointed |
| 1.3.2 | Turn his record into visible proof | Kept | 1.3.2 | Content unchanged; cross-references to Sections 3.x and 4.x re-pointed |
| 1.3.3 | Build a direct line to the voters the internet doesn't reach | Kept | 1.3.3 | Content unchanged; cross-references to Sections 3.x and 4.x re-pointed |
| 1.3.4 | Give every post a voter, a ward and a reason | Kept | 1.3.4 | Content unchanged; cross-references to Sections 3.x and 4.x re-pointed |
| 1.3.5 | Hold the home base while Kitui Central runs its own race | Kept | 1.3.5 | Content unchanged; cross-references to Sections 3.x and 4.x re-pointed |
| 1.4 | How this proposal is built | Moved | 1.4.1 | Becomes the three-step opener of the ownership section |
| 1.5 | How success will be judged | Merged | 1.9 | Retained as a one-paragraph summary pointing to Part 5.1 |
| 2.1 | The electorate | Merged | 2.1 | With old 3.1: electorate and the number it takes become one section |
| 2.2 | How Kitui has voted | Moved | 2.2 | Renumbered only |
| 2.3 | The nomination rules and the calendar | Moved | 2.5 | Renumbered only; follows the field so the reader meets rivals before party mechanics |
| 2.3.1 | How Wiper picks its candidate | Moved | 2.5.1 | Opening paragraph cites stale Sections 1.2 and 1.5; re-pointed to 1.8 and 4.3 |
| 2.3.2 | Where the selection method stands | Moved | 2.5.2 | Renumbered only |
| 2.4 | The county's people and economy | Merged | 2.8.1 | With old 2.5 and 3.7: one county profile section |
| [data] | Natural Hazards and NDMA Early-Warning Context: | Moved | 2.8.1 (run-in) | Stays under the county profile; B.3 keeps the longer record |
| 2.5 | The budget the next governor runs | Merged | 2.8.2 | Budget sits beside people and regions |
| [data] | Sourced Revenue Envelope, FY2026/27 (Approved Fiscal Strategy Paper): | Moved | 2.8.2 (run-in) |  |
| 2.6 | How people get information | Merged | 2.9.1 | Connectivity joins reach arithmetic (old 3.8) |
| [data] | The Defining Digital and Telecommunications Constraints (CA/KNBS Sourced): | Moved | 2.9.1 (run-in) |  |
| [data] | Platform Sizing & Realistic In-County Reach | Moved | 2.9.1 (run-in) |  |
| 2.7 | Who owns the airwaves | Merged | 2.9.2 | Ownership of the airwaves has one home |
| 2.7.1 | Who owns the Kamba-language stations, and who they favour | Removed | 2.9.2 | Defers to the table in old 5.2.2.2 and restates the three structural facts; kept as one short paragraph plus the research-integrity note |
| 2.8 | Dr. Mulu's public record | Moved | 2.10.1 | Record and presence read together |
| 2.9 | His channels today, and his rivals' | Merged | 2.10.2 | With old 3.9 (what his presence shows) |
| 3.1 | The number it takes | Merged | 2.1 | Combined with old 2.1 |
| 3.2 | Where the votes are | Moved | 2.3 |  |
| [analysis] | Critical Concentration Insights: | Moved | 2.3 (run-in) |  |
| 3.2.1 | The constituencies that decide it | Moved | 2.3.1 |  |
| [analysis] | The Mwingi bloc: necessary, not sufficient | Moved | 2.3.1 (run-in) |  |
| [analysis] | Analytical Hierarchy: | Moved | 2.3.1 (run-in) |  |
| 3.3 | Four routes to the number | Moved | 2.4 |  |
| [analysis] | Path A: The Northern Mwingi Triad (The "Mwingi Bloc") | Moved | 2.4 (run-in) | Four routes stay as run-in headings |
| [analysis] | Path B: The Central-South-West Urban/Rural Axis | Moved | 2.4 (run-in) | Four routes stay as run-in headings |
| [analysis] | Path C: The "Top 12 Megawards" Coalition | Moved | 2.4 (run-in) | Four routes stay as run-in headings |
| [analysis] | Path D: The Home-Belt Ceiling (the trap) | Moved | 2.4 (run-in) | Four routes stay as run-in headings |
| 3.4 | Where he is known and where he isn't | Moved | 2.7 |  |
| [analysis] | Where he has held office, and where he has not | Moved | 2.7.1 |  |
| [analysis] | Do the deficit wards overlap the decisive ones? | Moved | 2.7.1 (run-in) |  |
| [analysis] | Total Decisive Deficit Pool: | Moved | 2.7.1 (run-in) |  |
| 3.5 | What his rivals have already proven | Merged | 2.6 | With old 5.8.10 and 5.8.15; the field has one home |
| [analysis] | Stage One: the Wiper nomination | Moved | 2.6.1 |  |
| [analysis] | Stage Two: the general election field | Moved | 2.6.2 |  |
| 3.6 | Where party loyalty won't carry him | Moved | 2.7.2 | Party flow follows the deficit pool |
| 3.7 | The three regions | Merged | 2.8.3 | Regions join the county profile |
| 3.7.1 | The urban and central anchor: Kitui Central and Kitui West | Moved | 2.8.3 (run-in) | Three zone tables stay; the unmapped six sub-counties are an open question |
| 3.7.2 | The northern block: Mwingi | Moved | 2.8.3 (run-in) | Three zone tables stay; the unmapped six sub-counties are an open question |
| 3.7.3 | The arid and resource belt: Kitui South and East | Moved | 2.8.3 (run-in) | Three zone tables stay; the unmapped six sub-counties are an open question |
| 3.8 | What each channel can physically reach | Merged | 2.9.3 | Digital ceiling and what each channel can reach |
| [analysis] | What digital can do | Moved | 2.9.3 (run-in) |  |
| [analysis] | What digital cannot do | Moved | 2.9.3 (run-in) |  |
| 3.8.1 | The offline majority, and the infrastructure that reaches it | Split | 2.9.4 | Offline infrastructure analysis stays; "what the campaign would run" bullets reduce to cross-references to workstreams 7 and 9 |
| [analysis] | Kikamba Vernacular Radio (The Decisive Broadcast Medium) | Merged | 2.9.4 (run-in) | Reach facts retained; operating detail points to old 5.2.3.1 and 5.2.3.3 |
| [analysis] | Direct 2G Bulk SMS & USSD Service | Merged | 2.9.4 (run-in) | Reach facts retained; operating detail points to old 5.2.3.1 and 5.2.3.3 |
| [analysis] | Mobile-Money (M-Pesa) Agent Network Strategy | Merged | 2.9.4 (run-in) | Reach facts retained; operating detail points to old 5.2.3.1 and 5.2.3.3 |
| [analysis] | Open-Air Market Day Barazas & Caravan Circuits | Merged | 2.9.4 (run-in) | Reach facts retained; operating detail points to old 5.2.3.1 and 5.2.3.3 |
| [analysis] | Church Fellowships & Clergy Engagement | Merged | 2.9.4 (run-in) | Reach facts retained; operating detail points to old 5.2.3.1 and 5.2.3.3 |
| 3.9 | What his current presence shows | Merged | 2.10.3 | With old 2.9 |
| 3.9.1 | What the audit produces | Moved | 2.10.3 (run-in) |  |
| 3.10 | What the data can't yet tell us | Moved | 2.11 |  |
| 3.10.1 | Segment sizes the record does not publish | Merged | 2.11 | Folded in as its closing paragraph |
| 3.11 | The diagnosis, and the evidence that could overturn it | Moved | 2.12 |  |
| 4.1 | The position | Moved | 3.1 |  |
| 4.1.1 | The evidence behind the claim | Moved | 3.1.1 |  |
| 4.1.2 | The resource paradox | Moved | 3.1.2 |  |
| 4.1.3 | Answering the charge that discipline is cold | Moved | 3.1.3 |  |
| 4.1.4 | The four strategic pillars | Merged | 3.2.1 | Pillar framework paragraph joins 4.1.5; its cross-list of the other pillar groupings becomes the opening of 3.2 |
| 4.1.5 | The four campaign pillars in practice | Merged | 3.2.1 |  |
| 4.1.6 | The six campaign themes | Moved | 3.2.4 |  |
| 4.2 | Where the effort goes | Merged | 3.3.1 | With old 4.6: effort weighting and channel jobs are one argument |
| [strategy] | The weighting, and the finding it answers | Moved | 3.3.1 (run-in) |  |
| 4.3 | Who we are trying to move | Moved | 3.4 | Opening universe table becomes 3.4.1 |
| 4.3.1 | The six voter segments | Moved | 3.4.2 |  |
| 4.3.2 | The Rural Agrarian & Smallholder Baseline | Moved | 3.4.2 (run-in) | Six segment profiles become run-in headings; segment-to-pillar table stays |
| 4.3.3 | The Agro-Pastoralist & Arid-Zone Livestock Keepers | Moved | 3.4.2 (run-in) | Six segment profiles become run-in headings; segment-to-pillar table stays |
| 4.3.4 | The Youth Cohort (Ages 18–35: Students, Bodaboda, Unemployed Graduates & Creativ | Moved | 3.4.2 (run-in) | Six segment profiles become run-in headings; segment-to-pillar table stays |
| 4.3.5 | The Urban & Peri-Urban Commercial Informal Sector (MSMEs & Traders) | Moved | 3.4.2 (run-in) | Six segment profiles become run-in headings; segment-to-pillar table stays |
| 4.3.6 | The Formal Sector Professionals, Civil Servants & Educators | Moved | 3.4.2 (run-in) | Six segment profiles become run-in headings; segment-to-pillar table stays |
| 4.3.7 | The Out-of-County Kamba Diaspora Matrix (Nairobi, Coast & Nationwide) | Moved | 3.4.2 (run-in) | Six segment profiles become run-in headings; segment-to-pillar table stays |
| 4.3.8 | Segment sizing, and the evidence for it | Moved | 3.4.3 |  |
| 4.4 | What we say, and in which language | Moved | 3.5 |  |
| 4.4.1 | The central claim and its three pillars | Merged | 3.2.2 | Message pillars join the pillar architecture; the two flagship-commitment sizing note stays with them |
| [strategy] | Message Pillar 1: Fiscal Integrity & Transparent Public Finance (carries campaig | Moved | 3.2.2 (run-in) |  |
| [strategy] | Message Pillar 2: Household Economic Empowerment & Agrarian Value Addition (carr | Moved | 3.2.2 (run-in) |  |
| [strategy] | Message Pillar 3: Devolution Equity, Universal Water Access & Healthcare (carrie | Moved | 3.2.2 (run-in) |  |
| 4.4.2 | Counter-messaging against disinformation | Moved | 3.5.1 |  |
| 4.4.3 | Persuasion principles and message discipline | Removed | 3.5.2 | Empty heading directly above 4.4.4; the two merge |
| 4.4.4 | Framing true claims, transparently | Merged | 3.5.2 | With 4.4.5 |
| 4.4.5 | The principles we apply | Merged | 3.5.2 |  |
| 4.4.6 | Framing, worked through in examples | Moved | 3.5.3 |  |
| 4.4.7 | Langua register and dialect | Merged | 3.6.1 | Language section starts here |
| 4.4.8 | Which language reaches which voters, on which channel | Merged | 3.6.1 | Same language map as 4.4.11 at a different level of detail |
| 4.4.9 | Register, dialect and the discipline it takes | Moved | 3.6.2 |  |
| [strategy] | Linguistic Rules of Engagement: | Moved | 3.6.2 (run-in) |  |
| 4.4.10 | The production and quality-control pipeline | Moved | 3.6.3 |  |
| 4.4.11 | Channel-by-language deployment | Merged | 3.6.1 | Channel allocation joins the map; carries conflict C-21 until resolved |
| 4.5 | What gets published | Merged | 3.7 | Intro of production pillars moves to 3.2.3; weekly pattern stays here |
| 4.5.1 | Pillar 1 — Where the money went | Moved | 3.2.3 | One entry per production pillar, as run-in headings |
| 4.5.2 | Pillar 2 — From poverty to wealth creation, one household | Moved | 3.2.3 | One entry per production pillar, as run-in headings |
| 4.5.3 | Pillar 3 — The economist explains | Moved | 3.2.3 | One entry per production pillar, as run-in headings |
| 4.5.4 | Pillar 4 — He came, and this is what he said he would do | Moved | 3.2.3 | One entry per production pillar, as run-in headings |
| 4.5.5 | One week, before and after | Moved | 3.7 |  |
| 4.6 | Which channel does which job | Merged | 3.3.2 | With old 4.2 |
| 4.6.1 | The gatekeeper bottleneck | Moved | 3.3.3 |  |
| 4.7 | Fix first: six profile corrections | Moved | 4.2.3 | First-week action, so it sits with the first four weeks |
| 4.8 | When the plan changes | Moved | 3.8 |  |
| 5.1 | Who owns what: fourteen workstreams | Merged | 1.4 | Ownership and scope become part of the decision layer |
| 5.1.1 | Who owns what | Merged | 1.4.2 | With 5.1.2 |
| 5.1.2 | The fourteen, by owner | Merged | 1.4.2 |  |
| 5.1.3 | What is outside this scope | Moved | 1.4.3 | Outside-scope list stays whole |
| 5.1.4 | How the levels change what runs | Removed | 1.5.1 | Repeats 5.5.1 and 5.5.2 (the Level 2 recommendation appears three times); canonical home is 1.5.1 |
| 5.1.5 | Scope summary and workstream boundaries | Removed | 4.5 | Empty heading |
| 5.1.6 | Digital infrastructure, brand and civic content | Merged | 4.5 | Bullets go to the workstream that delivers each (1, 2, 3, 14). Daily platform management and 2-hour community replies conflict with 1.4.3 and 4.6.3; held until conflict C4 is settled |
| 5.1.7 | Growth, field advertising and reputation operations | Merged | 4.5 | Bullets go to workstreams 5 and 14 and to 6.2; paid-media and ad-account wording is checked against 4.1.3 (campaign holds the ad account) before it moves |
| 5.2 | The workstreams in detail | Renamed | 4.5 | "The fourteen workstreams" |
| 5.2.1 | Platforms and content | Merged | 4.5 | Group heading dissolves; workstreams are siblings 4.5.1 to 4.5.14 with a group label in each purpose line |
| 5.2.1.1 | Workstream 1 — Owned platforms and the service-delivery tracker | Merged | 4.5.1 | Receives old 5.6.6 and WS13 component 5 |
| [workstreams-platforms] | Why it exists | Moved | 4.5.1 (run-in) | "Build" cites Section 4.3 in error; should be 5.2.3.3 |
| [workstreams-platforms] | What it is | Moved | 4.5.1 (run-in) | "Build" cites Section 4.3 in error; should be 5.2.3.3 |
| [workstreams-platforms] | What happens to a report | Moved | 4.5.1 (run-in) | "Build" cites Section 4.3 in error; should be 5.2.3.3 |
| [workstreams-platforms] | Design principles | Moved | 4.5.1 (run-in) | "Build" cites Section 4.3 in error; should be 5.2.3.3 |
| [workstreams-platforms] | What it is worth to the campaign | Moved | 4.5.1 (run-in) | "Build" cites Section 4.3 in error; should be 5.2.3.3 |
| [workstreams-platforms] | Build | Moved | 4.5.1 (run-in) | "Build" cites Section 4.3 in error; should be 5.2.3.3 |
| [workstreams-platforms] | Tracker KPIs | Moved | 4.5.1 (run-in) | "Build" cites Section 4.3 in error; should be 5.2.3.3 |
| 5.2.1.2 | Workstream 2 — The content brief and asset governance | Moved | 4.5.2 |  |
| [workstreams-platforms] | The four content pillars | Merged | 3.2.3 | Fifth pillar grouping; kept as the index Annex C uses, cross-referenced from 3.2 |
| [workstreams-platforms] | Formats, by channel | Moved | G.2 |  |
| [workstreams-platforms] | Copy samples: radio, SMS and USSD | Moved | G.2 |  |
| [workstreams-platforms] | A. Vernacular Radio 45-Second Script Sample (Kikamba) | Moved | G.2 | Samples move to the specification annex; USSD tree pointer to 4.5.9 remains |
| [workstreams-platforms] | B. Direct 2G Bulk SMS Copy Sample (Ward-Specific) | Moved | G.2 | Samples move to the specification annex; USSD tree pointer to 4.5.9 remains |
| [workstreams-platforms] | C. USSD Interactive Menu Tree Structure | Moved | G.2 | Samples move to the specification annex; USSD tree pointer to 4.5.9 remains |
| [workstreams-platforms] | The weekly production schedule | Moved | 4.5.2 (run-in) |  |
| [workstreams-platforms] | Who approves what, and when | Moved | 4.5.2 (run-in) |  |
| [workstreams-platforms] | The asset library | Moved | 4.5.2 (run-in) |  |
| 5.2.1.3 | Workstream 3 — Creative testing and AI assistance | Moved | 4.5.3 |  |
| [workstreams-platforms] | What AI is used for, and what it is never used for | Moved | 4.5.3 (run-in) |  |
| [workstreams-platforms] | Tools and platforms | Moved | 4.5.3 (run-in) |  |
| [workstreams-platforms] | The weekly testing cycle | Moved | 4.5.3 (run-in) |  |
| [workstreams-platforms] | Performance benchmarks | Moved | 4.5.3 (run-in) |  |
| 5.2.1.4 | Workstream 4 — Accessibility and inclusion | Moved | 4.5.4 | Opening language block (Kikamba, Kiswahili, English, 50/30/20 mix) moves to 3.6 with a cross-reference |
| [workstreams-platforms] | What accessibility means here | Moved | 4.5.4 (run-in) |  |
| [workstreams-platforms] | The case | Moved | 4.5.4 (run-in) |  |
| [workstreams-platforms] | The commitments | Moved | 4.5.4 (run-in) |  |
| [workstreams-platforms] | Why this is scope, not an annex | Moved | 4.5.4 (run-in) |  |
| [workstreams-platforms] | Accessibility KPIs | Moved | 4.5.4 (run-in) |  |
| 5.2.2 | Publishing and earned media | Merged | 4.5 | Group heading dissolves |
| 5.2.2.1 | Workstream 5 — Platform tactics and paid media | Moved | 4.5.5 |  |
| [workstreams-media] | Facebook | Moved | G.1 | Platform playbooks are specification; 4.5.5 keeps ownership, targeting rule and KPIs |
| [workstreams-media] | X | Moved | G.1 | Platform playbooks are specification; 4.5.5 keeps ownership, targeting rule and KPIs |
| [workstreams-media] | WhatsApp | Moved | G.1 | Platform playbooks are specification; 4.5.5 keeps ownership, targeting rule and KPIs |
| [workstreams-media] | TikTok | Moved | G.1 | Platform playbooks are specification; 4.5.5 keeps ownership, targeting rule and KPIs |
| [workstreams-media] | Instagram | Moved | G.1 | Platform playbooks are specification; 4.5.5 keeps ownership, targeting rule and KPIs |
| [workstreams-media] | YouTube | Moved | G.1 | Platform playbooks are specification; 4.5.5 keeps ownership, targeting rule and KPIs |
| [workstreams-media] | Google Ads | Moved | G.1 | Platform playbooks are specification; 4.5.5 keeps ownership, targeting rule and KPIs |
| 5.2.2.2 | Workstream 6 — Earned media, journalists and debates | Moved | 4.5.6 | Ownership table is the canonical station map for 2.9.2 and 6.4 |
| [workstreams-media] | The radio problem, stated plainly | Moved | 4.5.6 (run-in) |  |
| [workstreams-media] | The journalist relationship programme | Moved | 4.5.6 (run-in) |  |
| [workstreams-media] | Candidate media training | Moved | 4.5.6 (run-in) |  |
| [workstreams-media] | The debate and forum playbook | Moved | 4.5.6 (run-in) |  |
| [workstreams-media] | Pre-drafted response lines | Moved | 4.5.6 (run-in) |  |
| [workstreams-media] | Earned media KPIs | Moved | 4.5.6 (run-in) |  |
| [workstreams-media] | Getting on air around a hostile gatekeeper | Moved | 4.5.6 (run-in) |  |
| [workstreams-media] | How we pitch: evidence first | Moved | 4.5.6 (run-in) |  |
| 5.2.3 | Ground and offline reach | Merged | 4.5 | Group heading dissolves |
| 5.2.3.1 | Workstream 7 — Ground-digital integration | Moved | 4.5.7 |  |
| [workstreams-ground] | What the 40 ward coordinators report | Moved | 4.5.7 (run-in) |  |
| [workstreams-ground] | What Ward Coordinators Report: | Moved | 4.5.7 (run-in) |  |
| [workstreams-ground] | From ground intel to a published response in four hours | Moved | 4.5.7 (run-in) |  |
| [workstreams-ground] | Distribution beyond social media | Moved | 4.5.7 (run-in) |  |
| [workstreams-ground] | 1. The Boda Boda Stage Network (1,200 Stage Champions) | Moved | 4.5.7 (run-in) |  |
| [workstreams-ground] | 2. Matatu & Sacco Commuter Transit Routes | Moved | 4.5.7 (run-in) |  |
| [workstreams-ground] | 3. Weekly Market Days & Caravan Circuits | Moved | 4.5.7 (run-in) |  |
| [workstreams-ground] | 4. Community Barazas & Chief's Gatherings (Protocol-Compliant) | Moved | 4.5.7 (run-in) |  |
| [workstreams-ground] | The operating rhythm | Moved | 4.5.7 (run-in) |  |
| 5.2.3.2 | Workstream 8 — The field-to-digital loop | Moved | 4.5.8 |  |
| [workstreams-ground] | Operating architecture and bidirectional sync | Moved | 4.5.8 (run-in) |  |
| [workstreams-ground] | Governance and data protection on the doorstep | Moved | 4.5.8 (run-in) |  |
| 5.2.3.3 | Workstream 9 — What Firefly operates: SMS, USSD and voice | Moved | 4.5.9 | The SMS, USSD and WhatsApp layer is the one Firefly operates; stays in the main body |
| [workstreams-ground] | Why this layer decides the race | Moved | 4.5.9 (run-in) |  |
| [workstreams-ground] | The SMS layer | Moved | 4.5.9 (run-in) |  |
| [workstreams-ground] | The USSD layer | Moved | 4.5.9 (run-in) |  |
| [workstreams-ground] | Voice and audio | Moved | 4.5.9 (run-in) |  |
| [workstreams-ground] | The mobile-money agent network | Moved | 4.5.9 (run-in) |  |
| [workstreams-ground] | KPIs for the offline layer | Moved | 4.5.9 (run-in) |  |
| 5.2.3.4 | Workstream 10 — Digital organising and volunteers | Split | 4.5.10 | One-paragraph boundary stays; programme detail moves to G.3 |
| [workstreams-ground] | Turning online supporters into offline organisers | Moved | G.3 | Outside the engagement by its own banner; reference for the campaign coordinator |
| [workstreams-ground] | Volunteer tiers | Moved | G.3 | Outside the engagement by its own banner; reference for the campaign coordinator |
| [workstreams-ground] | Gamification mechanics | Moved | G.3 | Outside the engagement by its own banner; reference for the campaign coordinator |
| [workstreams-ground] | Management tooling | Moved | G.3 | Outside the engagement by its own banner; reference for the campaign coordinator |
| [workstreams-ground] | Volunteer KPIs | Moved | G.3 | Outside the engagement by its own banner; reference for the campaign coordinator |
| 5.2.4 | Data and technology | Merged | 4.5 | Group heading dissolves |
| 5.2.4.1 | Workstream 11 — The data layer | Moved | 4.5.11 |  |
| [workstreams-data] | The voter and supporter data model | Moved | 4.5.11 (run-in) |  |
| [workstreams-data] | Key Architecture Principles: | Moved | 4.5.11 (run-in) |  |
| [workstreams-data] | The Data Protection Act 2019, applied | Merged | 5.3.2 | DPA obligations have one home |
| [workstreams-data] | Mandatory Compliance Safeguards: | Merged | 5.3.2 |  |
| 5.2.4.2 | Workstream 12 — Predictive voter modelling | Moved | 4.5.12 | Gated on 5.3.4 |
| [workstreams-data] | What the model scores, and why | Moved | 4.5.12 (run-in) | Last item reduces to a pointer to 5.3.4 |
| [workstreams-data] | Data sources | Moved | G.5 | Specification |
| [workstreams-data] | Modelling methodology | Moved | 4.5.12 (run-in) | Last item reduces to a pointer to 5.3.4 |
| [workstreams-data] | Model variables | Moved | G.5 | Specification |
| [workstreams-data] | How the model is evaluated | Moved | 4.5.12 (run-in) | Last item reduces to a pointer to 5.3.4 |
| [workstreams-data] | Putting the model to work | Moved | 4.5.12 (run-in) | Last item reduces to a pointer to 5.3.4 |
| [workstreams-data] | The compliance gate this depends on | Moved | 4.5.12 (run-in) | Last item reduces to a pointer to 5.3.4 |
| 5.2.4.3 | Workstream 13 — The technology stack | Split | 4.5.13 | Ownership statement stays; reference architecture moves to G.4 |
| [workstreams-data] | Component by component, and what each does | Moved | G.4 | Component 5 duplicates the tracker in 4.5.1 and is cut to a pointer |
| [workstreams-data] | 1. SMS / USSD Telecommunications Gateway | Moved | G.4 | Component 5 duplicates the tracker in 4.5.1 and is cut to a pointer |
| [workstreams-data] | 2. Supporter Relationship Management (CRM) & Voter Database | Moved | G.4 | Component 5 duplicates the tracker in 4.5.1 and is cut to a pointer |
| [workstreams-data] | 3. Social Publishing, Scheduling & Listening Suite | Moved | G.4 | Component 5 duplicates the tracker in 4.5.1 and is cut to a pointer |
| [workstreams-data] | 4. Campaign Analytics & Business Intelligence Dashboard | Moved | G.4 | Component 5 duplicates the tracker in 4.5.1 and is cut to a pointer |
| [workstreams-data] | 5. Public Service-Delivery Tracker (Section 5.2.4 Digital Charter Platform) | Moved | G.4 | Component 5 duplicates the tracker in 4.5.1 and is cut to a pointer |
| [workstreams-data] | The procurement matrix | Moved | G.4 | Component 5 duplicates the tracker in 4.5.1 and is cut to a pointer |
| [workstreams-data] | Technical risk and security protocols | Moved | G.4 |  |
| 5.2.4.4 | Workstream 14 — Analytics and attribution | Moved | 4.5.14 | Read first, listed last; placed fourteenth to keep numbering, flagged in its banner |
| [workstreams-data] | Attribution model and offline conversion tracking | Moved | 4.5.14 (run-in) | Phase labels in the roadmap need aligning to 4.3 |
| [workstreams-data] | Key metrics and benchmarks | Moved | 4.5.14 (run-in) | Phase labels in the roadmap need aligning to 4.3 |
| [workstreams-data] | The analytics maturity roadmap | Moved | 4.5.14 (run-in) | Phase labels in the roadmap need aligning to 4.3 |
| [workstreams-data] | Who owns the data | Moved | 4.5.14 (run-in) | Phase labels in the roadmap need aligning to 4.3 |
| 5.3 | The first four weeks | Merged | 4.2.1 | "First four weeks" spans weeks 1 to 8; retitled "The first ten weeks" pending decision on old 5.3.7 |
| 5.3.1 | The measurement set | Moved | 5.2.1 |  |
| 5.3.2 | The window | Moved | 5.2.2 |  |
| 5.3.3 | What is measured | Removed | 5.2 | Thirty-word intro that sits out of order after 5.3.1; becomes the section purpose line |
| 5.3.4 | Why this comes first | Moved | 5.2.3 |  |
| 5.3.5 | Method | Moved | 5.2.4 |  |
| 5.3.6 | What this section is not | Moved | 5.2.5 |  |
| 5.3.7 | Phase 0: Instrumentation — Weeks 4–10 from signature | Merged | 4.2.2 | Phase 0 timing (weeks 4 to 10) reconciled with 4.2.1 (weeks 1 to 8); see open question |
| 5.4 | The phases to August 2027 | Moved | 4.3 |  |
| 5.4.1 | Phase 1: Awareness and Community Building — October–December 2026 | Moved | 4.3.2 |  |
| 5.4.2 | Phase 2: Engagement and Persuasion — January–March 2027 | Moved | 4.3.3 |  |
| 5.4.3 | Phase 3: Mobilisation and GOTV — April–August 2027 | Moved | 4.3.4 |  |
| 5.4.4 | Post-election | Moved | 4.3.5 |  |
| 5.4.5 | Coalition and endorsement sequencing | Removed | 4.4 | Empty heading directly above 5.4.6 |
| 5.4.6 | The principle behind the sequence | Merged | 4.4 | Section opener |
| 5.4.7 | The sequenced calendar | Merged | 4.4 |  |
| 5.4.8 | Managing endorsements | Merged | 4.4 |  |
| 5.4.9 | Coalition KPIs | Merged | 4.4 |  |
| 5.5 | What Dr. Mulu receives, and how often | Moved | 1.5 |  |
| 5.5.1 | The three scope levels | Moved | 1.5.1 | Definitions table (four quantities) stays |
| [delivery] | Level 1 — LEAN | Moved | 1.5.1 (run-in) |  |
| [delivery] | Level 2 — STANDARD (recommended) | Moved | 1.5.1 (run-in) |  |
| [delivery] | Level 3 — PREMIUM | Moved | 1.5.1 (run-in) |  |
| 5.5.2 | The scope levels compared | Moved | 1.5.2 |  |
| 5.5.3 | The deliverables schedule | Moved | 1.5.3 |  |
| 5.5.4 | What this proposal commits to | Moved | 1.6 |  |
| 5.6 | How progress is measured | Moved | 5.1 |  |
| 5.6.1 | Sta: the nomination-window scorecard | Merged | 5.1.1 |  |
| 5.6.2 | Sta: the general election scorecard | Merged | 5.1.1 |  |
| 5.6.3 | Indicators, and why these | Removed | 5.1.2 | Empty heading; its orphan paragraph is moved to open 5.2.6 |
| 5.6.4 | Re-anchored: recognition and persuasion where he is least known | Moved | 5.1.2 |  |
| 5.6.5 | Testing the hypothesis on existing records | Moved | 5.2.6 |  |
| 5.6.6 | The service-delivery performance tracker | Merged | 4.5.1 | Duplicates workstream 1 and WS13 component 5; the post-election "day-one dashboard" paragraph is kept in 4.5.1 |
| [delivery] | Dual Operational Function: | Merged | 4.5.1 |  |
| 5.6.7 | Why vanity metrics are excluded | Moved | 5.1.3 |  |
| 5.6.8 | Performance governance and executive escalation | Moved | 5.1.4 |  |
| 5.7 | How decisions are made | Moved | 4.1 |  |
| 5.7.1 | Operating rhythm, tooling and reporting lines | Moved | 4.1.1 |  |
| 5.7.2 | Who does what, in one table | Moved | 4.1.2 |  |
| [delivery] | The Firefly proposition | Moved | 1.4 (run-in) | Who Firefly is belongs with who does what |
| 5.7.3 | Decision rights and content approval | Moved | 4.1.3 |  |
| 5.7.4 | Data ethics, privacy and the data charter | Removed | 5.3 | Empty heading; "5.3 Data protection, ethics and compliance" replaces it |
| 5.7.5 | The standard we hold ourselves to | Moved | 5.3.1 |  |
| 5.7.6 | The regulatory environment as it stands | Merged | 5.3.2 |  |
| 5.7.7 | Compliance measures | Merged | 5.3.2 | Retention line cites "(16.4)", a section that does not exist |
| 5.7.8 | The Digital Ethics and Data Charter | Moved | 5.3.3 |  |
| 5.7.9 | The compliance sign-off gate | Moved | 5.3.4 |  |
| 5.8 | Risks and responses | Moved | 6.1 | The orphan intro sentence stranded at the end of 5.7.9 is reunited with this heading |
| 5.8.1 | Rapid-response protocol and opposition handling | Moved | 6.2.1 | Cites Section A.1.1 for defamation safeguards; the safeguards are old 5.8.3 |
| 5.8.2 | What we monitor, and how threats reach us | Moved | 6.2.2 |  |
| 5.8.3 | Staying inside defamation law | Moved | 6.2.3 |  |
| 5.8.4 | The digital war room | Removed | 6.2.4 | Empty heading above 5.8.5 |
| 5.8.5 | War room operating model, shift coverage and dashboard view | Merged | 6.2.4 | Shift model and dashboard view |
| 5.8.6 | Cybersecurity and manipulated media | Removed | 6.3 | Empty heading above 5.8.7 |
| 5.8.7 | The deepfake and manipulated media protocol | Moved | 6.3.1 |  |
| 5.8.8 | Competitor monitoring | Removed | 6.4 | Empty heading above 5.8.9 |
| 5.8.9 | Public sources only, and the line we do not cross | Merged | 6.4.1 |  |
| 5.8.10 | Reading the current field | Moved | 2.6.4 | Rival analysis belongs with the field; 6.4 points to it |
| 5.8.11 | Statutory and regulatory compliance | Merged | 5.3.5 |  |
| 5.8.12 | The IEBC nomination and clearance checklist | Merged | 5.3.5 |  |
| 5.8.13 | Data protection and election offences liability | Merged | 5.3.5 |  |
| 5.8.14 | If it becomes a delegate primary | Moved | 6.5 | Stranded 5.9 opening paragraphs that follow it are returned to 4.6 |
| 5.8.15 | The incumbent is term-limited: 2027 is an open seat | Moved | 2.6.3 | A fact about the race, not a risk response |
| 5.9 | How the work is staffed | Moved | 4.6 | Opening paragraphs recovered from under old 5.8.14 |
| 5.9.1 | A lean core with a defined surge | Moved | 4.6.1 |  |
| 5.9.2 | The core team, retained throughout | Moved | 4.6.2 |  |
| 5.9.3 | Surge roles, activated by phase and scope level | Moved | 4.6.3 |  |
| 5.9.4 | Leadership roles and who owns what | Moved | 4.6.4 |  |
| 5.9.5 | Reporting lines | Moved | 4.6.5 |  |
| 5.9.6 | How the existing team is assessed and upskilled | Moved | 4.6.6 |  |
| 6.1 | What this needs from the campaign | Moved | 1.7 |  |
| 6.2 | Open items | Split | 5.3.6 / 1.8 | ODPC action box to 5.3.6; assumptions to 1.8; heading itself removed |
| 6.2.1 | Assumptions this proposal rests on | Moved | 1.8 |  |
| 6.3 | The decision: one week and one export | Merged | 1.1 | Moved to the front; the "window, not the deadline" box leads the ask |
| 6.3.1 | The ask | Merged | 1.1 | Closing sign-off block duplicates the cover and F.2 and is cut |
| 6.3.2 | The ask, in full | Merged | 1.1 |  |
| A.1 | Evidence standard: provenance and source tiers | Kept | A.1 | Anchor retained |
| A.1.1 | Every figure carries its provenance | Kept | A.1.1 |  |
| A.1.2 | The three source tiers | Kept | A.1.2 |  |
| [annex-evidence] | Standard Implementation Rules: | Kept | A.1.2 (run-in) |  |
| A.1.3 | When two sources disagree | Kept | A.1.3 |  |
| A.1.4 | The standard applied to our own measurement | Kept | A.1.4 |  |
| B.1 | The 40-ward register | Kept | B.1 |  |
| [annex-county] | 1. Mwingi North Constituency (68,829 total registered voters, Tier 1) | Kept | B.1 (run-in) | Per-constituency ward lists unchanged |
| [annex-county] | 2. Mwingi West Constituency (57,138 total registered voters, Tier 1) | Kept | B.1 (run-in) | Per-constituency ward lists unchanged |
| [annex-county] | 3. Mwingi Central Constituency (74,231 total registered voters, Tier 1) | Kept | B.1 (run-in) | Per-constituency ward lists unchanged |
| [annex-county] | 4. Kitui West Constituency (59,047 total registered voters, Tier 1) | Kept | B.1 (run-in) | Per-constituency ward lists unchanged |
| [annex-county] | 5. Kitui Rural Constituency (55,000 total registered voters, Tier 1) | Kept | B.1 (run-in) | Per-constituency ward lists unchanged |
| [annex-county] | 6. Kitui Central Constituency (77,764 total registered voters, Tier 1) | Kept | B.1 (run-in) | Per-constituency ward lists unchanged |
| [annex-county] | 7. Kitui East Constituency (65,377 total registered voters, Tier 1) | Kept | B.1 (run-in) | Per-constituency ward lists unchanged |
| [annex-county] | 8. Kitui South Constituency (75,372 total registered voters, Tier 1) | Kept | B.1 (run-in) | Per-constituency ward lists unchanged |
| B.2 | County money and the audit record | Kept | B.2 |  |
| B.3 | Drought, food security and climate pressure | Kept | B.3 |  |
| B.4 | Mui Basin coal and the displaced communities | Kept | B.4 |  |
| B.5 | Each rival, and the legal ground to be careful on | Split | B.5 | Legal-attribution guidance stays; the per-rival lines are cut to pointers to 2.6 |
| C.1 | Message assignment by segment | Kept | C.1 |  |
| C.2 | Message assignment by channel | Kept | C.2 |  |
| D.1 | Cadence and the meeting rhythm | Kept | D.1 | Candidate for folding into Annex E; not proposed here so anchors hold |
| D.2 | The escalation path | Kept | D.2 | Candidate for folding into Annex E; not proposed here so anchors hold |
| E.1 | The four-tier response decision tree | Kept | E.1 |  |
| E.2 | Response times, by channel | Kept | E.2 |  |
| E.3 | Holding positions, pre-drafted | Kept | E.3 |  |
| E.4 | Monitoring tools | Kept | E.4 |  |
| E.5 | Rapid-response protocol and pre-approved message library | Kept | E.5 |  |
| E.6 | Red-team drills | Kept | E.6 |  |
| E.7 | The threat model | Kept | E.7 |  |
| E.8 | Account security baseline | Kept | E.8 |  |
| E.9 | Phishing awareness | Kept | E.9 |  |
| E.10 | The incident response plan | Kept | E.10 |  |
| E.11 | Competitor monitoring tools | Merged | E.12 | Tool list folded into E.12 and E.4; the competitor-monitoring home in the body is 6.4 |
| E.12 | Competitive intelligence outputs and rapid alerts | Kept | E.12 | Receives E.11 |
| F.1 | Confidentiality and use | Kept | F.1 |  |
| F.2 | Who this is for, and on what terms | Merged | Cover | Restates the cover; reduced to a pointer |

## 7. Change log

### 7.1 Merges

| Into | From | Reason |
|---|---|---|
| Cover | [cover], F.2 | Cover and F.2 state the same parties and status. |
| 1.2 | 1.1, 1.2 | The goal and its two clocks are one idea for a reader deciding. |
| 1.9 | 1.5 | Summary of 1.5, pointing to 5.1. |
| 2.1 | 2.1, 3.1 | The same four figures (532,758; 605,703; 198,004; 61.7%) appear in both; one section keeps the strongest of each. |
| 2.8.1 | 2.4 | County profile. |
| 2.8.2 | 2.5 | County profile. |
| 2.9.1 | 2.6 | Connectivity read beside what channels can reach. |
| 2.9.2 | 2.7 | Ownership of the airwaves has one home. |
| 2.10.2 | 2.9 | His channels and the audit of them. |
| 2.6 | 3.5 | The field has one home, including term limits and rival analysis. |
| 2.8.3 | 3.7 | County profile. |
| 2.9.3 | 3.8 | Digital ceiling. |
| 2.9.4 (run-in) | [analysis], [analysis], [analysis], [analysis], [analysis] | Reach facts retained; operating detail points to workstreams 7 and 9. |
| 2.10.3 | 3.9 | His channels and the audit of them. |
| 2.11 | 3.10.1 | 3.10.1 is a four-line note on 3.10. |
| 3.2.1 | 4.1.4, 4.1.5 | 4.1.4 announces four pillars and lists none; 4.1.5 lists them. |
| 3.3.1 | 4.2 | Effort weighting (4.2) and channel jobs (4.6) argue one point from the same 158,696 ceiling. |
| 3.2.2 | 4.4.1 | Message pillars are one of five pillar groupings. |
| 3.5.2 | 4.4.4, 4.4.5 | 4.4.3 is an empty heading above 4.4.4. |
| 3.6.1 | 4.4.7, 4.4.8, 4.4.11 | One language map, with the SMS conflict (C2) visible in one place. |
| 3.7 | 4.5 | The pillar introduction moves to 3.2.3; the weekly pattern remains. |
| 3.3.2 | 4.6 | One home for one topic; see mapping note. |
| 1.4 | 5.1 | A reader needs to know who does what before the detail. |
| 1.4.2 | 5.1.1, 5.1.2 | Two lists of the same fourteen workstreams. |
| 4.5 | 5.1.6, 5.1.7, 5.2.1, 5.2.2, 5.2.3, 5.2.4 | Group headings (5.2.1 to 5.2.4) carry no content of their own. |
| 4.5.1 | 5.2.1.1, 5.6.6, [delivery] | One tracker, one page. |
| 3.2.3 | [workstreams-platforms] | The four content pillars are one more production taxonomy. |
| 5.3.2 | [workstreams-data], [workstreams-data], 5.7.6, 5.7.7 | The DPA, regulatory table and compliance measures say one thing three times. |
| 4.2.1 | 5.3 | Plan and KPIs in one place. |
| 4.2.2 | 5.3.7 | Phase 0 and the first weeks are one schedule. |
| 4.4 | 5.4.6, 5.4.7, 5.4.8, 5.4.9 | Five short coalition sections form one. |
| 5.1.1 | 5.6.1, 5.6.2 | Two scorecards read together. |
| 6.2.4 | 5.8.5 | 4.8.4 is empty above 5.8.5. |
| 6.4.1 | 5.8.9 | The line we do not cross belongs with competitor monitoring. |
| 5.3.5 | 5.8.11, 5.8.12, 5.8.13 | Three one-figure sections on one statutory subject. |
| 1.1 | 6.3, 6.3.1, 6.3.2 | The ask, the window and the sign-off are one ask; the closing sign-off block repeats the cover. |
| E.12 | E.11 | E.11 is a tool list that E.4 already carries. |

### 7.2 Removals, with the canonical section that keeps the idea

| Old | Removed because | Canonical home |
|---|---|---|
| 2.7.1 Who owns the Kamba-language stations, and who they favour | Defers to the table in old 5.2.2.2 and restates the three structural facts; kept as one short paragraph plus the research-integrity note | 2.9.2 |
| 4.4.3 Persuasion principles and message discipline | Empty heading directly above 4.4.4; the two merge | 3.5.2 |
| 5.1.4 How the levels change what runs | Repeats 5.5.1 and 5.5.2 (the Level 2 recommendation appears three times); canonical home is 1.5.1 | 1.5.1 |
| 5.1.5 Scope summary and workstream boundaries | Empty heading | 4.5 |
| 5.3.3 What is measured | Thirty-word intro that sits out of order after 5.3.1; becomes the section purpose line | 5.2 |
| 5.4.5 Coalition and endorsement sequencing | Empty heading directly above 5.4.6 | 4.4 |
| 5.6.3 Indicators, and why these | Empty heading; its orphan paragraph is moved to open 5.2.6 | 5.1.2 |
| 5.7.4 Data ethics, privacy and the data charter | Empty heading; "5.3 Data protection, ethics and compliance" replaces it | 5.3 |
| 5.8.4 The digital war room | Empty heading above 5.8.5 | 6.2.4 |
| 5.8.6 Cybersecurity and manipulated media | Empty heading above 5.8.7 | 6.3 |
| 5.8.8 Competitor monitoring | Empty heading above 5.8.9 | 6.4 |

**Cut to a cross-reference (heading kept or merged, repeated prose reduced):** 5.1.6 and 5.1.7 (to 4.5.x, subject to C4); 5.6.6 (to 4.5.1); 5.2.4.3 component 5 (to 4.5.1); E.11 (to E.12 and 6.4); F.2 and the 6.3.1 sign-off block (to Cover); the per-rival lines of B.5 (to 2.6.1 and 2.6.2); the "what the campaign would run" bullets in 3.8.1 (to 4.5.7 and 4.5.9); the language block opening 5.2.1.4 (to 3.6.1).

### 7.3 Moves

209 headings move. Most are renumbering. Moves that change Part and reader position:

| Content | From | To | Reason |
|---|---|---|---|
| Ask, objectives, ownership, levels, dependencies, assumptions | Parts 1, 5, 6 | Part 1 | The decision-maker should meet the offer first. |
| Data and analysis | Parts 2 and 3 | Part 2 | One evidence chain. |
| Workstreams | 5.2.1 to 5.2.4 | 4.5.1 to 4.5.14 | One page per workstream, consistent. |
| Specification detail | 5.2.x | Annex G | Reference, not argument. |
| Compliance | 5.7.4 to 5.7.9, 5.8.11 to 5.8.13 | 5.3 | Governance, not process. |
| Audit method | 5.3.1 to 5.3.6 | 5.2 | Measurement spec. |
| Open seat; rival analysis | 5.8.15, 5.8.10 | 2.6.3, 2.6.4 | Facts about the race. |
| Profile corrections | 4.7 | 4.2.3 | First-week action. |
| Risks | 5.8 | Part 6 | A Part of its own, after governance. |

### 7.4 Renames

| Old | New |
|---|---|
| 5.1 Who owns what: fourteen workstreams | 1.4 Who does what: ownership and boundaries |
| 5.2 The workstreams in detail | 4.5 The fourteen workstreams |
| 5.3 The first four weeks | 4.2 The first weeks: audit, foundations, instrumentation |
| 5.6 How progress is measured | 5.1 The indicators |
| 5.7 How decisions are made | 4.1 How the engagement runs week to week |
| 5.8 Risks and responses | Part 6 Risks and response |
| 6.3 The decision: one week and one export | 1.1 The ask: one week and one export |
| Part 1 Objectives; Parts 2 and 3 | Part 1 The decision; Part 2 The evidence |
| Part 5 Implementation | Parts 4 to 6 |

### 7.5 Splits

| Old | Into | Reason |
|---|---|---|
| 3.8.1 The offline majority, and the infrastructure that reaches it | 2.9.4 | Offline infrastructure analysis stays; "what the campaign would run" bullets reduce to cross-references to workstreams 7 and 9 |
| 5.2.3.4 Workstream 10 — Digital organising and volunteers | 4.5.10 | One-paragraph boundary stays; programme detail moves to G.3 |
| 5.2.4.3 Workstream 13 — The technology stack | 4.5.13 | Ownership statement stays; reference architecture moves to G.4 |
| 6.2 Open items | 5.3.6 / 1.8 | ODPC action box to 5.3.6; assumptions to 1.8; heading itself removed |
| B.5 Each rival, and the legal ground to be careful on | B.5 | Legal-attribution guidance stays; the per-rival lines are cut to pointers to 2.6 |
| 5.2.1.2, 5.2.2.1, 5.2.4.2 (partial) | 4.5.x and G.1, G.2, G.5 | Ownership and KPIs stay; formats, copy, playbooks and dictionary move. |

## 8. Retained repetition

| # | What stays repeated | Where | Why |
|---|---|---|---|
| R1 | "Firefly publishes nothing on the owned accounts and holds no credentials" | Cover, 1.1, 1.4.3, row in 4.1.2 | Every decision point where a reader weighs risk; it is the engagement's central boundary. |
| R2 | The Level 2 recommendation | Stated in full in 1.5.1; one line in 1.1 | The ask includes choosing a level. |
| R3 | The "Because Section …" opening line of 3.1, 3.3 to 3.8 | As now | Recaps the finding each choice answers; it is the document's best navigation device. |
| R4 | 73.8% offline and the 158,696 ceiling | 2.9.3 (canonical), summary lines in 1.3.3, 3.3.2, 4.5.9 | Each is a decision point; each cross-refers to 2.9.3. |
| R5 | Target ladder rows (consented contacts, USSD sessions, tracker reports) | 4.3.1 canonical; own rows in 4.5.1 and 4.5.9 | Owners read their own page. Ideally drawn from one data file (`data/kpis.ts`, not opened) so they cannot diverge. |
| R6 | Tier 3 status of the nomination method | 1.2, 1.8, 2.5.2, 1.1 | Decisions hang on it; each is one line with a cross-reference. |
| R7 | Pointer boxes to annexes | 4.1, 6.1, A | They tell a senior reader what to skip. |

## 9. Impact on the rest of the site

- **Anchors.** 168 of 177 numbered main-text headings change number. The site resolves old ids through `lib/anchors/redirects.ts`, generated from `pre-rebuild.json` and `rebuild-moves.json` by `scripts/build-anchors.ts`, and the build fails if an old id lands nowhere. Every change needs a move entry. I did not open the script.
- **Cross-references.** The prose carries about 407 "Section" or § citations to 116 distinct targets (my count). Renumbering means editing them, which hard rule 8 forbids in this phase. The earlier restructure (`docs/restructure/04-target-architecture.md`) avoided this by routing links through the built section index. Whether that mechanism is still in use is unverified.
- **Navigation.** `SECTIONS` and `PARTS` in `lib/heading-slug.ts`, `CONTENT_FILES` in `lib/content-files.ts`, and the tab labels (5A to 5E) change. A new Annex G needs a tab and a content file.
- **Figures.** Figures attach to the heading they sit under (`lib/section-index.ts`), so moving a heading moves its figures. Comments and text inside `lib/figures/*.ts` cite old section numbers (for example §4.4.8 in `language.ts`). Not opened beyond that.
- **Likely touched, not opened:** `lib/part-visuals.ts`, `lib/phases.ts`, `data/section-visuals.generated.json`, `data/section-heights.json`, `components/flow/*`, `scripts/check-copy.ts`, `scripts/check-figures.ts`.
- **Figures and provenance.** No figure or tier note is lost. The merge of 2.1 and 3.1 must keep both the July 2026 decomposition (61,839 and 11,106) and the share arithmetic (37.2%, about 225,000).

## 10. Risks, conflicts and open questions

### 10.1 Conflicts between duplicated passages (listed, not resolved)

| # | Conflict | Locations |
|---|---|---|
| C1 | Language mix: 50/30/20 for locally facing platforms against 76/16/8 "estimated primary reach" (Tier 3) and 80/20 Kiswahili/English on SMS; plus a rule of at least 4 of 7 weekly posts Kikamba-first. Different measures, unreconciled. | 5.2.1.4, 4.4.8, 4.4.11, 4.5.5 |
| C2 | 4.4.8 lists "2G Bulk SMS & USSD" as a Kikamba channel; bulk political SMS cannot be Kikamba (CA/NCIC, Tier 1). The repository already tracks this as C-21. | 4.4.8, 5.2.3.3 |
| C3 | Workstream ownership counts: 7/6/2 against 6/6/2. | 5.1.1, 5.5.4 |
| C4 | 5.1.6 has Firefly managing Facebook, X, Instagram, TikTok, YouTube and WhatsApp daily and replying within 2 hours; 5.1.3 says it does not publish, and 5.9.3 says community management is the team's. | 5.1.3, 5.1.6, 5.9.3 |
| C5 | Three scopes for the tracker: citizen-report register (5.2.1.1); NG-CDF project showcase plus a "Kitui Economic Blueprint" for 2027 to 2032 (5.2.4.3); open-data ledger with Treasury integration after the election (5.6.6). 5.2.1.1 principle 4 warns against implying powers he does not hold. | 5.2.1.1, 5.2.4.3, 5.6.6 |
| C6 | Ward Development Equalization Fund of KSh 100 million per ward (about KSh 4.0bn, 29% of the envelope) is campaign copy in 4.4.1, 5.2.1.2 and an SMS sample, while 3.5 says the equal-ward guarantee and attacking the incumbent's allocation cannot both be run, and recommends a needs-weighted formula. 5.2.2.2 has a methodology-first response line. The document marks this the campaign's call. | 3.5, 4.4.1, 5.2.1.2, 5.2.2.2 |
| C7 | Station lists differ. Sang'u FM appears in 4.3.2, 4.3.3 and 5.8.2 but not in the 5.2.2.2 table, which says it governs. Citizen Radio and Mwatu FM appear only in 3.8.1. | 2.7.1, 3.8.1, 4.3.2, 5.2.2.2, 5.8.2 |
| C8 | Certified valid votes 328,760 (2.1, 2.2) against modelled ballots 328,712 (3.1, 4.3 universe table). Both are labelled; the section merge should say which is which. | 2.1, 3.1, 3.4 |

### 10.2 Things I was unsure of

- The live site was not checked (section 2). A screenshot or export of its table of contents would close this.
- Duplication inside figures is unassessed.
- The Part 2 merge makes an 8,295-word file or two files under one heading; the loader assumes one file per tab.
### 10.3 Decisions I need from you

1. **Decision-first order** (Part 1 as drafted), or keep Objectives first and move only 5.1, 5.5, 6.1 and 6.3 forward.
2. **Cross-references:** edit the roughly 407 citations in a later phase, or re-route through the section index.
3. **Annex G** as a new letter, or fold the reference material into Annexes C and E. Also whether Annex D folds into E.
4. **Dates.** The document is dated September 2026. Today is 28 October 2026, so Phase 1 (October to December) has begun and the reported nomination window (late October to November) is opening. Do the dates in 1.1, 1.8, 4.2 and 4.3 stay as submitted or are they refreshed?
5. **Phase labels.** Keep Phase −1 and Phase 0, or restate 4.2 as weeks and drop them (15 uses).
6. **Conflicts C1 to C8:** settle before the restructure so a merge does not freeze a contradiction in place.
7. **Workstream 14** is read first but listed last. I keep the numbering because 'Workstream 14' is cited across the document.

Preview complete. No changes have been made to the repository or the live site. Reply with approval, or with amendments, before I proceed.