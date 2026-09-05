# INVENTORY — every section in the live site

Phase 1 of the consolidation audit. Generated from `public/content/*.md` and
`components/MarkdownViewer.tsx` so it cannot drift from the document it indexes;
re-runnable at any time.

**Definition of a "section":** a numbered `##` or `###` heading in
`public/content/*.md`. This is the definition the application itself uses —
`lib/section-index.ts` builds the table of contents from exactly these headings
(regex `/^(#{2,3})\s+(.+?)\s*$/`, skipping fenced blocks, requiring a leading
section number), and `lib/heading-slug.ts` mints a deep-link id
`<tab>-sec-<number>` for each. `####`/`#####` headings are *within* a section:
they become disclosure panels via `lib/collapse-groups.ts`, never index entries.

**Count: 262 sections** — 50 `##` sub-sections and 212 `###` parts, across ten
top-level documents. This matches the brief's figure exactly. Every one carries a
leading number, so there are no unindexed headings.

| Metric | Value |
|---|---|
| Sections (`##` + `###`) | **262** |
| Total words in section bodies | 49,663 |
| Median words per section | 154 |
| Mean words per section | 190 |
| Sections under 80 words | **78 (30%)** |
| Sections with a bound React component | 38 |
| Sections containing a markdown table | 59 |
| Sections containing an ASCII diagram | 80 |
| Sections containing an open `[Insert…]`/`[Confirm…]` placeholder | 21 |

**Content type** is assigned by rule (tables/diagrams/≥4 figures → data; component-only
→ visual; commitment language → call-to-action; credential/certification language →
social proof; otherwise narrative), then reviewed. Distribution: data 158, narrative 69,
visual 17, social proof 13, call-to-action 5.

**Columns.** *Dep.* lists React components bound to that section's id in
`HEADING_INSERTS` — these bindings key off the section **number**, so any renumbering
silently unbinds them. *Refs* lists outbound in-prose `Section X.Y` cross-references.
*Figures* is a sample of the unique numeric claims the section carries.

**Word counts use the site's own convention** — JavaScript `split(/\s+/)`, the same
count `app/page.tsx` computes and displays. (`wc -w` under a C locale returns ~9% lower
across this document because it does not treat all Unicode whitespace as a separator;
the numbers here are the ones the site itself reports.)


## `public/content/0-overview.md` — 4 sections, 1,335 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **0.1** | The bottleneck is the nomination, not the election | data | 323 | PollingTrajectorySimulator | §1.1 | 2027, 2026, 31.3%, 20.2%, 16.3%, 37.4% … (+3) |
| **0.2** | What Firefly would run, and the credential it builds on | social proof | 272 | — | §8.5 | — |
| **0.3** | Three realities the campaign has to work inside | narrative | 236 | — | §4.3, §3.5 | 2026, 86%, 95.2% |
| **0.4** | Why the operation is run remotely | call-to-action | 504 | — | — | 2026, 2027 |

## `public/content/1-race.md` — 30 sections, 8,099 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **1.1** | The nomination, and how it will be decided | visual | 103 | NominationPathPanel | §0.1, §8.2.3 | — |
| &nbsp;&nbsp;**1.1.1** | &nbsp;&nbsp;How Wiper picks its candidate | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**1.1.2** | &nbsp;&nbsp;Where the opinion-poll mechanism stands | narrative | 110 | — | — | — |
| &nbsp;&nbsp;**1.1.3** | &nbsp;&nbsp;What the poll would measure | data | 228 | — | — | 2022, 2027, 1,200, 1,500, 175, 220 … (+1) |
| &nbsp;&nbsp;**1.1.4** | &nbsp;&nbsp;Kitui Central's weight in the vote | narrative | 103 | — | — | 77,764 |
| &nbsp;&nbsp;**1.1.5** | &nbsp;&nbsp;The polling gap, as sourced | narrative | 132 | — | — | 2026, 37.4%, 22.1% |
| &nbsp;&nbsp;**1.1.6** | &nbsp;&nbsp;If it becomes a delegate primary | narrative | 117 | — | — | 1,200, 1,500, 400 |
| **1.2** | The candidate and the county | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**1.2.1** | &nbsp;&nbsp;The candidate's record | data | 312 | SectionPortrait | §8.5 | KSh 47 million, 12,573 |
| &nbsp;&nbsp;**1.2.2** | &nbsp;&nbsp;The field he is running against <br>*(3 h4 panels)* | data | 1014 | ConstitutionalBranchNavigator, CompetitiveQuadrantBlock | — | 2027, 2026, 2017, 169,990, 2022, 114,827 … (+8) |
| &nbsp;&nbsp;**1.2.3** | &nbsp;&nbsp;The 2022 baseline, ward by ward <br>*(10 h4 panels)* | data | 487 | WardCartogramBlock, PathTo200kBlock, ConstituencyWeightBlock | — | 2022, 532,758, 532,753, 1,578, 200,000, 198,004 … (+49) |
| &nbsp;&nbsp;**1.2.4** | &nbsp;&nbsp;What the governorship controls, and what it is worth <br>*(1 h4 panels)* | data | 203 | ResourceEnvelopeBlock | — | KSh 13.79 billion, KSh 11.64 billion, KSh 1.03 billion, KSh 1.339 billion, 339, 84.5% |
| &nbsp;&nbsp;**1.2.5** | &nbsp;&nbsp;Who lives here, and what they can reach online <br>*(2 h4 panels)* | data | 513 | DisputedFigure | — | 2019, 1,136,187, 549,003, 587,151, 2024, 262,942 … (+28) |
| &nbsp;&nbsp;**1.2.6** | &nbsp;&nbsp;Three election cycles, and the results in dispute | data | 180 | ElectoralHistoryPanel, ElectoralTimelineBlock | — | 2013, 2017, 169,990, 2018, 460, 114,827 … (+8) |
| &nbsp;&nbsp;**1.2.7** | &nbsp;&nbsp;County money and the audit record | data | 145 | FiscalAuditPanel, FiscalAuditChartBlock | — | KSh 670,000,000, KSh 1,090,000,000, KSh 621,500,000, KSh 356,200,000, KSh 1.3 billion, 670,000,000 … (+5) |
| &nbsp;&nbsp;**1.2.8** | &nbsp;&nbsp;Drought, food security and climate pressure | visual | 90 | DroughtFoodSecurityPanel | — | 2026, 2025, 28,000, 2019, 262,942 |
| &nbsp;&nbsp;**1.2.9** | &nbsp;&nbsp;Mui Basin coal and the displaced communities | visual | 69 | MuiBasinPanel | — | 2014 |
| &nbsp;&nbsp;**1.2.10** | &nbsp;&nbsp;Each rival, and the legal ground to be careful on | narrative | 225 | CompetitorFieldPanel | — | 2018, 2017, 2027 |
| **1.3** | The arithmetic of winning | data | 415 | — | — | 200,000, 532,758, 68,829, 74,231, 19,921, 14,525 … (+43) |
| &nbsp;&nbsp;**1.3.1** | &nbsp;&nbsp;The number of votes it takes | data | 201 | — | — | 532,758, 532,833, 200,000, 2022, 198,004, 330,310 … (+7) |
| &nbsp;&nbsp;**1.3.2** | &nbsp;&nbsp;The 40 wards, ranked, and the 12 that carry most <br>*(2 h4 panels)* | data | 829 | — | — | 13,319, 2022, 19,921, 19,538, 39,459, 18,020 … (+152) |
| &nbsp;&nbsp;**1.3.3** | &nbsp;&nbsp;Four routes to the threshold, with the working shown <br>*(4 h4 panels)* | data | 594 | PathTo200kCalculator | — | 200,000, 74,231, 77,764, 68,829, 75,372, 57,138 … (+33) |
| &nbsp;&nbsp;**1.3.4** | &nbsp;&nbsp;The constituencies that decide it <br>*(1 h4 panels)* | data | 338 | — | — | 77,764, 15,553, 75,372, 12,562, 74,231, 12,372 … (+28) |
| &nbsp;&nbsp;**1.3.5** | &nbsp;&nbsp;Where he is not yet known, and whether it matters <br>*(4 h4 panels)* | data | 718 | RecognitionDeficitOverlay | §4.3, §9.1.2 | 2013, 77,764, 200,198, 75,372, 65,377, 19,921 … (+29) |
| &nbsp;&nbsp;**1.3.6** | &nbsp;&nbsp;What ward-level data we still do not have | data | 326 | — | — | 2026, 2013, 2017, 169,990, 114,827, 74,681 … (+19) |
| **1.4** | The county's three regions | visual | 28 | GeographicZoneMatrix | — | — |
| &nbsp;&nbsp;**1.4.1** | &nbsp;&nbsp;The urban and central anchor: Kitui Central and Kitui West | data | 155 | — | — | 105,991, 251, 29,057, 70,871, 170, 17,497 … (+14) |
| &nbsp;&nbsp;**1.4.2** | &nbsp;&nbsp;The northern block: Mwingi | data | 159 | — | — | 108,713, 26,753, 76,867, 15,993, 29,344, 6,496 … (+5) |
| &nbsp;&nbsp;**1.4.3** | &nbsp;&nbsp;The arid and resource belt: Kitui South and East | data | 190 | — | §4.3 | 113,356, 23,044, 82,964, 16,679, 85,139, 18,730 … (+16) |
| &nbsp;&nbsp;**1.4.4** | &nbsp;&nbsp;How the zones are weighted | data | 115 | — | — | 19.7%, 20%, 25%, 22.5%, 35%, 36.6% … (+2) |

## `public/content/2-argument.md` — 36 sections, 7,786 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **2.1** | The Economist Governor | visual | 47 | EconomistGovernorThesis | — | — |
| &nbsp;&nbsp;**2.1.1** | &nbsp;&nbsp;The evidence behind the claim | social proof | 170 | — | — | KSh 47 million, 12,573 |
| &nbsp;&nbsp;**2.1.2** | &nbsp;&nbsp;The resource paradox | data | 185 | — | — | KSh 13.79 billion, KSh 670,000,000, KSh 1,090,000,000, KSh 621,500,000, KSh 356,200,000, KSh 1.3 billion … (+4) |
| &nbsp;&nbsp;**2.1.3** | &nbsp;&nbsp;Answering the charge that discipline is cold | data | 179 | — | — | KSh 670 million, KSh 1.3 billion, 670, 86.4% |
| **2.2** | The four campaign pillars | visual | 7 | StrategicPillarsMatrix | — | — |
| &nbsp;&nbsp;**2.2.1** | &nbsp;&nbsp;Fiscal accountability and devolution | narrative | 49 | — | — | KSh13.79 billion |
| &nbsp;&nbsp;**2.2.2** | &nbsp;&nbsp;Data-driven civic engagement | narrative | 33 | — | — | — |
| &nbsp;&nbsp;**2.2.3** | &nbsp;&nbsp;Policy, translated into what it changes | narrative | 34 | — | — | — |
| &nbsp;&nbsp;**2.2.4** | &nbsp;&nbsp;Verification and follow-through | narrative | 62 | — | §8.5, §6.4, §6.5.4 | — |
| **2.3** | The six campaign themes | data | 232 | SloganBuilder | — | KSh13.79bn, KSh1.339bn, KSh47m, 400,000, 2025, 2026 … (+9) |
| **2.4** | Who we are talking to | data | 245 | AudienceSegmentationMatrix | — | 532,758, 2019, 86.2%, 44%, 86.4%, 13.8% … (+5) |
| &nbsp;&nbsp;**2.4.1** | &nbsp;&nbsp;The six voter segments <br>*(6 h4 panels)* | data | 1364 | — | §9.1.2 | 459,000, 2019, 455,000, 400, 80,000, 105,000 … (+25) |
| &nbsp;&nbsp;**2.4.2** | &nbsp;&nbsp;How large each segment is, and what the evidence says | data | 248 | — | — | 455,000, 80,000, 105,000, 234,000, 73,500, 2019 … (+5) |
| &nbsp;&nbsp;**2.4.3** | &nbsp;&nbsp;What we still need to research | data | 207 | — | — | 86.2%, 13.8%, 44%, 86.4% |
| **2.5** | Voter segments and the messaging framework | data | 602 | — | §6.5.4, §4.3 | KSh1.339bn, 2027, 2025, 12,573, 587,151, 262,942 … (+3) |
| **2.6** | Message architecture | data | 177 | MessagingPlayground, ToneVoiceSlider | §6.1.2 | Ksh 100M, 160 |
| &nbsp;&nbsp;**2.6.1** | &nbsp;&nbsp;The central claim and its three pillars <br>*(3 h4 panels)* | data | 453 | — | — | Ksh 12, Ksh 2.4, Ksh 100 M, 2013, 2025, 2021 … (+9) |
| &nbsp;&nbsp;**2.6.2** | &nbsp;&nbsp;What we say to each segment | data | 432 | — | §2.4 | Ksh 40, Ksh 85, Ksh 50,000, Ksh 120M, 174,745, 77,250 … (+16) |
| &nbsp;&nbsp;**2.6.3** | &nbsp;&nbsp;What we say on each channel | data | 290 | — | §3.1 | Ksh 100M, 420,000, 160, 320,000, 280,000, 72,455 … (+1) |
| &nbsp;&nbsp;**2.6.4** | &nbsp;&nbsp;Answering disinformation | data | 255 | — | §2.4 | Ksh 100M, 18,000, 65% |
| **2.7** | Content production and asset governance | data | 187 | — | §3.1.1 | 360, 160, 14% |
| &nbsp;&nbsp;**2.7.1** | &nbsp;&nbsp;The four content pillars | social proof | 246 | — | — | Ksh 85, Ksh 100 M, 100 |
| &nbsp;&nbsp;**2.7.2** | &nbsp;&nbsp;Formats, by channel | data | 282 | — | — | 160, 483, 2027 |
| &nbsp;&nbsp;**2.7.3** | &nbsp;&nbsp;Copy samples: radio, SMS and USSD <br>*(3 h4 panels)* | data | 272 | — | — | Ksh 85, Ksh 100M, 2027, 22340, 483 |
| &nbsp;&nbsp;**2.7.4** | &nbsp;&nbsp;The weekly production schedule | data | 304 | CommunityScheduler | — | 100,000 |
| &nbsp;&nbsp;**2.7.5** | &nbsp;&nbsp;Who approves what, and when | data | 149 | — | — | — |
| &nbsp;&nbsp;**2.7.6** | &nbsp;&nbsp;The asset library | data | 174 | — | — | — |
| **2.8** | Behavioural science and persuasion | visual | 0 | PersuasionFramingMatrix | — | — |
| &nbsp;&nbsp;**2.8.1** | &nbsp;&nbsp;Framing true claims, transparently | narrative | 59 | — | §6.5.4 | — |
| &nbsp;&nbsp;**2.8.2** | &nbsp;&nbsp;The principles we apply | data | 215 | — | — | — |
| &nbsp;&nbsp;**2.8.3** | &nbsp;&nbsp;Framing, worked through in examples | data | 301 | — | §6.5.4 | KSh13.79 billion, 400,000, 60.4%, 45.2%, 90%, 11.7% … (+1) |
| **2.9** | AI-assisted creative and testing | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**2.9.1** | &nbsp;&nbsp;What AI is used for, and what it is never used for | narrative | 86 | — | §6.5.4, §5.3.5 | — |
| &nbsp;&nbsp;**2.9.2** | &nbsp;&nbsp;Tools and platforms | data | 98 | — | — | — |
| &nbsp;&nbsp;**2.9.3** | &nbsp;&nbsp;The weekly testing cycle | data | 63 | — | §9.2.4 | 5,000, 30%, 70%, 1.5% |
| &nbsp;&nbsp;**2.9.4** | &nbsp;&nbsp;Performance benchmarks | data | 79 | — | — | 1.5%, 5%, 3%, 6%, 50%, 35% … (+3) |

## `public/content/3-channels.md` — 33 sections, 7,674 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **3.1** | The two-tier channel architecture | data | 203 | PhoneShowcase | §4.3, §4.2 | 2019, 532,758, 72,455, 460,303, 230, 100 … (+7) |
| &nbsp;&nbsp;**3.1.1** | &nbsp;&nbsp;The connected minority, and its limits <br>*(3 h4 panels)* | data | 458 | — | — | 2019, 65,000, 80,000, 50,000, 35,000, 45,000 … (+17) |
| &nbsp;&nbsp;**3.1.2** | &nbsp;&nbsp;The offline majority, and the infrastructure that reaches it <br>*(5 h4 panels)* | data | 738 | — | — | 460,303, 200,000, 420,000, 210, 320,000, 160 … (+20) |
| &nbsp;&nbsp;**3.1.3** | &nbsp;&nbsp;Budget against reach | data | 325 | — | — | 72,455, 200,000, 45.0%, 18.0%, 13.6%, 20.0% … (+11) |
| **3.2** | Platform tactics <br>*(7 h4 panels)* | data | 405 | MediaPlaybackMockup | §3.7.1 | KSh13.79 billion, KSh1.339 billion, 2026, 339, 2027 |
| **3.3** | Paid media and campaign financing | data | 215 | — | §3.1 | Ksh 97,560,000, Ksh 64,500,000, Ksh 31,500,000, Ksh 23,200,000, Ksh 9,800,000, 97,560,000 … (+11) |
| &nbsp;&nbsp;**3.3.1** | &nbsp;&nbsp;Where the paid budget goes, by reachable population | data | 282 | — | §3.1 | Ksh 10,800,000, Ksh 2,850,000, Ksh 14,500,000, Ksh 6,200,000, Ksh 1,850,000, Ksh 21,500,000 … (+36) |
| &nbsp;&nbsp;**3.3.2** | &nbsp;&nbsp;Rate cards we still have to obtain | data | 251 | — | — | Ksh 8, Ksh 0.60, Ksh 30, Ksh 0.15, 483, 200,000 |
| &nbsp;&nbsp;**3.3.3** | &nbsp;&nbsp;The campaign financing rules we work inside | data | 295 | — | — | Ksh 97,560,000, Ksh 64.50M, Ksh 19,512,000, Ksh 1,000,000, 97,560,000, 12251 … (+5) |
| &nbsp;&nbsp;**3.3.4** | &nbsp;&nbsp;Penalty exposure, and how we stay clear of it | data | 173 | — | — | Ksh 2,000,000, Ksh 64.5M, Ksh 97.56M, Ksh 19.51M, Ksh 1M, 2,000,000 … (+3) |
| **3.4** | Earned media and the radio landscape | data | 183 | — | — | 483 |
| &nbsp;&nbsp;**3.4.1** | &nbsp;&nbsp;Who owns the Kamba-language stations, and who they favour | data | 516 | MediaOwnershipBlock | §6.1.2 | 102, 107 |
| &nbsp;&nbsp;**3.4.2** | &nbsp;&nbsp;The gatekeeper bottleneck | narrative | 92 | — | — | — |
| &nbsp;&nbsp;**3.4.3** | &nbsp;&nbsp;Getting on air around a hostile gatekeeper | data | 303 | — | — | 532,758, 320,000, 483, 160, 400, 180 |
| &nbsp;&nbsp;**3.4.4** | &nbsp;&nbsp;How we pitch: evidence first | data | 196 | — | — | 400 |
| **3.5** | Journalists, debates and radio strategy | visual | 19 | MediaRadioLandscapeCard, RadioAircoverDial | — | — |
| &nbsp;&nbsp;**3.5.1** | &nbsp;&nbsp;The radio problem, stated plainly | data | 298 | — | §5.2.2 | 100, 102, 105, 103, 2023, 86% |
| &nbsp;&nbsp;**3.5.2** | &nbsp;&nbsp;The journalist relationship programme | data | 193 | — | — | — |
| &nbsp;&nbsp;**3.5.3** | &nbsp;&nbsp;Candidate media training | narrative | 117 | — | — | — |
| &nbsp;&nbsp;**3.5.4** | &nbsp;&nbsp;The debate and forum playbook | data | 199 | — | — | — |
| &nbsp;&nbsp;**3.5.5** | &nbsp;&nbsp;Pre-drafted response lines | data | 270 | — | §5.3.5 | — |
| &nbsp;&nbsp;**3.5.6** | &nbsp;&nbsp;Earned media KPIs | data | 80 | — | — | 100, 100%, 50% |
| **3.6** | Working in three languages | data | 223 | — | — | 76%, 16%, 8% |
| &nbsp;&nbsp;**3.6.1** | &nbsp;&nbsp;Which language reaches which voters, on which channel | data | 294 | — | — | 32.8%, 52.1%, 76%, 43.9%, 16%, 8% |
| &nbsp;&nbsp;**3.6.2** | &nbsp;&nbsp;Register, dialect and the discipline it takes <br>*(1 h4 panels)* | data | 298 | — | — | — |
| &nbsp;&nbsp;**3.6.3** | &nbsp;&nbsp;The production and quality-control pipeline | data | 153 | — | — | — |
| &nbsp;&nbsp;**3.6.4** | &nbsp;&nbsp;Channel-by-language deployment | data | 235 | — | — | 100, 100%, 80%, 20%, 50%, 70% … (+7) |
| **3.7** | Accessibility and inclusion | data | 256 | — | §7.2.3 | 50%, 30%, 20% |
| &nbsp;&nbsp;**3.7.1** | &nbsp;&nbsp;What accessibility means here | narrative | 19 | — | — | 13.0% |
| &nbsp;&nbsp;**3.7.2** | &nbsp;&nbsp;The case | narrative | 71 | — | — | 13.0%, 17.4%, 86% |
| &nbsp;&nbsp;**3.7.3** | &nbsp;&nbsp;The commitments | data | 181 | — | §4.3 | — |
| &nbsp;&nbsp;**3.7.4** | &nbsp;&nbsp;Why this sits in the strategy, not an annex | narrative | 67 | — | — | — |
| &nbsp;&nbsp;**3.7.5** | &nbsp;&nbsp;Accessibility KPIs | data | 66 | — | — | 100, 100% |

## `public/content/4-ground.md` — 29 sections, 3,546 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **4.1** | Field and digital, working as one | data | 251 | TerminalShowcase | — | 400, 1,200, 86.4% |
| &nbsp;&nbsp;**4.1.1** | &nbsp;&nbsp;What the 40 ward coordinators report <br>*(1 h4 panels)* | data | 357 | — | §9.1.2 | Ksh 500, 400, 500 |
| &nbsp;&nbsp;**4.1.2** | &nbsp;&nbsp;From ground intel to a published response in four hours | data | 155 | — | — | 160, 14,000 |
| &nbsp;&nbsp;**4.1.3** | &nbsp;&nbsp;Distribution beyond social media <br>*(4 h4 panels)* | data | 365 | — | §4.3.4 | 1,200, 12,000 |
| &nbsp;&nbsp;**4.1.4** | &nbsp;&nbsp;The operating rhythm | data | 428 | — | — | 1,200, 86.4% |
| **4.2** | The field-to-digital loop | visual | 0 | FlywheelSchematic | — | — |
| &nbsp;&nbsp;**4.2.1** | &nbsp;&nbsp;The problem it solves | narrative | 56 | — | — | 30,430 |
| &nbsp;&nbsp;**4.2.2** | &nbsp;&nbsp;How the loop runs | data | 47 | — | §6.2.4 | — |
| &nbsp;&nbsp;**4.2.3** | &nbsp;&nbsp;Field to digital | social proof | 73 | — | — | — |
| &nbsp;&nbsp;**4.2.4** | &nbsp;&nbsp;Digital to field | social proof | 65 | — | — | — |
| &nbsp;&nbsp;**4.2.5** | &nbsp;&nbsp;Who governs it | social proof | 71 | — | §6.5.4 | 85% |
| **4.3** | SMS, USSD and the offline majority | visual | 0 | ReachSplit, SMSFeedbackVisualizer | — | — |
| &nbsp;&nbsp;**4.3.1** | &nbsp;&nbsp;Why this layer decides the race | data | 118 | — | — | 143,340, 1,136,187, 452,948, 13.6%, 42.9%, 63.7% |
| &nbsp;&nbsp;**4.3.2** | &nbsp;&nbsp;The SMS layer | data | 243 | — | §3.6.4, §9.2.3 | KSh0.25, KSh30,000, 160, 120,000, 000, 72,000 |
| &nbsp;&nbsp;**4.3.3** | &nbsp;&nbsp;The USSD layer | data | 171 | — | §8.5 | KSh34,800, KSh140,000, KSh5,000, 800, 000 |
| &nbsp;&nbsp;**4.3.4** | &nbsp;&nbsp;Voice and audio | social proof | 62 | — | §3.5 | 13.0% |
| &nbsp;&nbsp;**4.3.5** | &nbsp;&nbsp;The mobile-money agent network | data | 137 | — | — | 480,216, 2025, 602,470, 2026 |
| &nbsp;&nbsp;**4.3.6** | &nbsp;&nbsp;KPIs for the offline layer | data | 142 | — | — | KSh0.60, KSh0.50, KSh0.40, KSh0.35, 15,000, 40,000 … (+9) |
| **4.4** | Digital organising and volunteers | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**4.4.1** | &nbsp;&nbsp;Turning online supporters into offline organisers | narrative | 17 | — | — | — |
| &nbsp;&nbsp;**4.4.2** | &nbsp;&nbsp;Volunteer tiers | data | 106 | — | §4.2, §6.5.4 | — |
| &nbsp;&nbsp;**4.4.3** | &nbsp;&nbsp;Gamification mechanics | data | 133 | — | §6.5.4 | — |
| &nbsp;&nbsp;**4.4.4** | &nbsp;&nbsp;Management tooling | narrative | 59 | — | §4.3.3 | — |
| &nbsp;&nbsp;**4.4.5** | &nbsp;&nbsp;Volunteer KPIs | data | 82 | — | — | 100, 5%, 40%, 20%, 60%, 50% |
| **4.5** | The coalition and endorsement calendar | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**4.5.1** | &nbsp;&nbsp;The principle behind the sequence | narrative | 68 | — | — | — |
| &nbsp;&nbsp;**4.5.2** | &nbsp;&nbsp;The sequenced calendar | data | 234 | — | — | 2026, 2027 |
| &nbsp;&nbsp;**4.5.3** | &nbsp;&nbsp;Managing endorsements | social proof | 51 | — | §6.5.4 | — |
| &nbsp;&nbsp;**4.5.4** | &nbsp;&nbsp;Coalition KPIs | data | 55 | — | — | — |

## `public/content/5-defence.md` — 26 sections, 3,433 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **5.1** | Rapid response and opposition handling | data | 178 | CounterMessagingGrid | §6.1.2 | 400 |
| &nbsp;&nbsp;**5.1.1** | &nbsp;&nbsp;What we monitor, and how threats reach us | narrative | 129 | — | — | 180, 2027, 400 |
| &nbsp;&nbsp;**5.1.2** | &nbsp;&nbsp;The four-tier response decision tree | data | 287 | — | — | — |
| &nbsp;&nbsp;**5.1.3** | &nbsp;&nbsp;Response times, by channel | data | 149 | — | — | 160 |
| &nbsp;&nbsp;**5.1.4** | &nbsp;&nbsp;Holding positions, pre-drafted | data | 557 | — | §8.5 | Ksh 100 M, Ksh 2.4, 140, 18,000, 2027, 100 … (+7) |
| &nbsp;&nbsp;**5.1.5** | &nbsp;&nbsp;Staying inside defamation law | data | 200 | — | — | 100, 100% |
| **5.2** | The digital war room | visual | 0 | CrisisWarRoomMatrix | — | — |
| &nbsp;&nbsp;**5.2.1** | &nbsp;&nbsp;What the war room is for | call-to-action | 15 | — | — | — |
| &nbsp;&nbsp;**5.2.2** | &nbsp;&nbsp;Monitoring tools | data | 114 | — | §3.5 | 2027 |
| &nbsp;&nbsp;**5.2.3** | &nbsp;&nbsp;The shift schedule | data | 53 | — | — | 2027 |
| &nbsp;&nbsp;**5.2.4** | &nbsp;&nbsp;The rapid-response protocol | data | 73 | — | — | 10,000 |
| &nbsp;&nbsp;**5.2.5** | &nbsp;&nbsp;The pre-approved message library | narrative | 51 | — | §5.3.5 | — |
| &nbsp;&nbsp;**5.2.6** | &nbsp;&nbsp;The dashboard view | narrative | 24 | — | — | — |
| &nbsp;&nbsp;**5.2.7** | &nbsp;&nbsp;Red-team drills | data | 295 | — | §5.2.4, §6.5.4, §3.5, §5.3.4, §9.2.4 | 90% |
| **5.3** | Cybersecurity and manipulated media | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**5.3.1** | &nbsp;&nbsp;The threat model | social proof | 105 | — | — | — |
| &nbsp;&nbsp;**5.3.2** | &nbsp;&nbsp;Account security baseline | data | 167 | — | — | — |
| &nbsp;&nbsp;**5.3.3** | &nbsp;&nbsp;Phishing awareness | narrative | 80 | — | — | — |
| &nbsp;&nbsp;**5.3.4** | &nbsp;&nbsp;The incident response plan | data | 170 | — | — | — |
| &nbsp;&nbsp;**5.3.5** | &nbsp;&nbsp;The deepfake and manipulated media protocol | data | 465 | — | §3.5 | 2026, 120 |
| **5.4** | Watching the other campaigns | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**5.4.1** | &nbsp;&nbsp;Public sources only, and the line we do not cross | narrative | 66 | — | — | — |
| &nbsp;&nbsp;**5.4.2** | &nbsp;&nbsp;Monitoring tools | data | 85 | — | §3.5 | — |
| &nbsp;&nbsp;**5.4.3** | &nbsp;&nbsp;The monthly competitive brief | narrative | 55 | — | — | — |
| &nbsp;&nbsp;**5.4.4** | &nbsp;&nbsp;The rapid alert system | narrative | 20 | — | — | — |
| &nbsp;&nbsp;**5.4.5** | &nbsp;&nbsp;Reading the current field | narrative | 95 | — | — | 2026 |

## `public/content/6-data.md` — 36 sections, 7,259 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **6.1** | The data layer | data | 193 | — | — | 2019, 400 |
| &nbsp;&nbsp;**6.1.1** | &nbsp;&nbsp;The voter and supporter data model <br>*(1 h4 panels)* | data | 395 | — | — | 256, 2019, 8601 |
| &nbsp;&nbsp;**6.1.2** | &nbsp;&nbsp;Every figure carries its provenance | data | 131 | — | — | 2019, 2022, 2026 |
| &nbsp;&nbsp;**6.1.3** | &nbsp;&nbsp;The three source tiers <br>*(1 h4 panels)* | data | 266 | — | — | 532,758, 198,004, 2026, 37.4%, 22.1% |
| &nbsp;&nbsp;**6.1.4** | &nbsp;&nbsp;When two sources disagree | data | 140 | — | — | — |
| &nbsp;&nbsp;**6.1.5** | &nbsp;&nbsp;The Data Protection Act 2019, applied <br>*(1 h4 panels)* | data | 307 | — | §3.7 | 2019, 256 |
| &nbsp;&nbsp;**6.1.6** | &nbsp;&nbsp;The ODPC guidance we are still waiting on | data | 253 | — | §6.1.5, §6.6.3 | 2019, 2021, 256, 100, 100% |
| **6.2** | Predictive voter modelling | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**6.2.1** | &nbsp;&nbsp;What the model scores, and why | narrative | 89 | — | §6.5.5 | — |
| &nbsp;&nbsp;**6.2.2** | &nbsp;&nbsp;Data sources | narrative | 112 | — | §6.5.5, §4.2, §6.5.4 | 2017, 2022 |
| &nbsp;&nbsp;**6.2.3** | &nbsp;&nbsp;Modelling methodology | data | 84 | — | — | — |
| &nbsp;&nbsp;**6.2.4** | &nbsp;&nbsp;Model variables | data | 367 | — | §4.2 | 2017, 2022, 100, 251 |
| &nbsp;&nbsp;**6.2.5** | &nbsp;&nbsp;How the model is evaluated | data | 90 | — | — | 10%, 5%, 85% |
| &nbsp;&nbsp;**6.2.6** | &nbsp;&nbsp;Putting the model to work | narrative | 54 | — | §4.2 | — |
| &nbsp;&nbsp;**6.2.7** | &nbsp;&nbsp;The compliance gate this depends on | narrative | 56 | — | §6.5.5 | — |
| **6.3** | The technology stack | data | 205 | — | §8.5 | 2019, 256 |
| &nbsp;&nbsp;**6.3.1** | &nbsp;&nbsp;Component by component, and what each costs <br>*(5 h4 panels)* | data | 851 | — | §4.3, §4.4, §6.1.1, §8.5 | Ksh 30,000, Ksh 25,000, Ksh 0.60, Ksh 900,000, Ksh 20,000, Ksh 150,000 … (+32) |
| &nbsp;&nbsp;**6.3.2** | &nbsp;&nbsp;The procurement matrix | data | 202 | — | — | Ksh 950, Ksh 350, Ksh 45, Ksh 10, Ksh 5 |
| &nbsp;&nbsp;**6.3.3** | &nbsp;&nbsp;Technical risk and security protocols | data | 172 | — | — | 100, 256, 2019, 100% |
| **6.4** | Analytics and attribution | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**6.4.1** | &nbsp;&nbsp;Measuring what moves votes, not vanity | narrative | 23 | — | — | 200,000 |
| &nbsp;&nbsp;**6.4.2** | &nbsp;&nbsp;Multi-touch attribution | data | 105 | — | §4.2 | — |
| &nbsp;&nbsp;**6.4.3** | &nbsp;&nbsp;Tracking offline conversion | narrative | 50 | — | — | — |
| &nbsp;&nbsp;**6.4.4** | &nbsp;&nbsp;Key metrics and benchmarks | data | 181 | — | — | KSh200, KSh0.60, KSh0.35, 200,000, 40%, 50% … (+5) |
| &nbsp;&nbsp;**6.4.5** | &nbsp;&nbsp;The analytics maturity roadmap | data | 210 | — | §6.5.5 | — |
| &nbsp;&nbsp;**6.4.6** | &nbsp;&nbsp;Who owns the data | narrative | 135 | — | §5.2.7, §6.5.4, §6.5.5 | — |
| **6.5** | Ethics, privacy and the data charter | visual | 0 | DataSecurityEthicsCharter | — | — |
| &nbsp;&nbsp;**6.5.1** | &nbsp;&nbsp;The standard we hold ourselves to | narrative | 82 | — | §6.5.5 | 2019 |
| &nbsp;&nbsp;**6.5.2** | &nbsp;&nbsp;The regulatory environment as it stands | data | 208 | — | — | KSh5 million, KSh400,000, KSh1.85m, 2019, 000, 2025 … (+3) |
| &nbsp;&nbsp;**6.5.3** | &nbsp;&nbsp;Compliance measures | data | 123 | — | — | — |
| &nbsp;&nbsp;**6.5.4** | &nbsp;&nbsp;The Digital Ethics and Data Charter | narrative | 697 | — | — | — |
| &nbsp;&nbsp;**6.5.5** | &nbsp;&nbsp;The compliance sign-off gate | data | 365 | — | §6.2, §6.2.7 | 2026 |
| **6.6** | Statutory and regulatory compliance | data | 269 | — | — | Ksh 97,560,000, Ksh 64.5M, Ksh 19,512,000, Ksh 1,000,000, 2027, 12251 … (+11) |
| &nbsp;&nbsp;**6.6.1** | &nbsp;&nbsp;Campaign financing obligations under the ECFA | data | 312 | — | — | Ksh 97,560,000, Ksh 64,500,000, Ksh 33.06M, Ksh 500,000, Ksh 19,512,000, Ksh 1,000,000 … (+9) |
| &nbsp;&nbsp;**6.6.2** | &nbsp;&nbsp;The IEBC nomination and clearance checklist | data | 315 | — | — | 180, 500, 250, 10,000 |
| &nbsp;&nbsp;**6.6.3** | &nbsp;&nbsp;Data protection and election offences liability | data | 217 | — | — | Ksh 5,000,000, 2019, 5,000,000, 2016 |

## `public/content/7-team.md` — 19 sections, 2,423 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **7.1** | The scope of work | narrative | 27 | — | — | — |
| &nbsp;&nbsp;**7.1.1** | &nbsp;&nbsp;Web management and digital architecture | narrative | 108 | — | §3.7.1 | 2027, 13.6% |
| &nbsp;&nbsp;**7.1.2** | &nbsp;&nbsp;Brand management | narrative | 56 | — | §3.5 | — |
| &nbsp;&nbsp;**7.1.3** | &nbsp;&nbsp;Civic content and visual data | social proof | 71 | — | §2.5 | KSh13.79bn |
| &nbsp;&nbsp;**7.1.4** | &nbsp;&nbsp;Online fundraising and data analytics | narrative | 89 | — | §9.2.4 | 2026, 20% |
| &nbsp;&nbsp;**7.1.5** | &nbsp;&nbsp;Digital advertising | narrative | 69 | — | §9.2.4 | — |
| &nbsp;&nbsp;**7.1.6** | &nbsp;&nbsp;Crisis and reputation management | narrative | 30 | — | §2.6 | — |
| **7.2** | The team and how it is structured | visual | 0 | CampaignOrgChart | — | — |
| &nbsp;&nbsp;**7.2.1** | &nbsp;&nbsp;A lean core with a defined surge | narrative | 70 | — | §9.2 | — |
| &nbsp;&nbsp;**7.2.2** | &nbsp;&nbsp;The core team, retained throughout | data | 120 | — | — | — |
| &nbsp;&nbsp;**7.2.3** | &nbsp;&nbsp;Surge roles, activated by phase and tier | data | 218 | — | §6.4.6, §4.4, §3.5 | 150 |
| &nbsp;&nbsp;**7.2.4** | &nbsp;&nbsp;Reporting lines | data | 105 | — | §5.2.7 | — |
| &nbsp;&nbsp;**7.2.5** | &nbsp;&nbsp;Operating cadence | data | 161 | — | §5.2.7 | — |
| &nbsp;&nbsp;**7.2.6** | &nbsp;&nbsp;Who signs off on content | data | 124 | — | §6.5.5 | — |
| **7.3** | Leadership roles and governance rhythm | data | 226 | — | — | — |
| &nbsp;&nbsp;**7.3.1** | &nbsp;&nbsp;Why the delivery model is lean | call-to-action | 204 | — | — | — |
| &nbsp;&nbsp;**7.3.2** | &nbsp;&nbsp;Core leadership roles and who owns what | data | 286 | — | — | 2019 |
| &nbsp;&nbsp;**7.3.3** | &nbsp;&nbsp;How disagreements escalate | data | 155 | — | — | Ksh 100,000, 100,000 |
| &nbsp;&nbsp;**7.3.4** | &nbsp;&nbsp;The meeting cadence | data | 304 | — | — | 200,000 |

## `public/content/8-measure.md` — 30 sections, 5,083 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **8.1** | The headline scorecards | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**8.1.1** | &nbsp;&nbsp;Stage 1: the nomination-window scorecard | data | 348 | — | §8.4 | 400, 600, 38.5%, 55.0%, 42.0%, 70.0% … (+2) |
| &nbsp;&nbsp;**8.1.2** | &nbsp;&nbsp;Stage 2: the general election scorecard | data | 448 | — | — | 200,000, 45,000, 220,000, 110, 120, 400 … (+8) |
| **8.2** | What we measure, and why | data | 142 | — | — | — |
| &nbsp;&nbsp;**8.2.1** | &nbsp;&nbsp;The research programme and the nomination tracking poll <br>*(1 h4 panels)* | data | 600 | — | — | Ksh 1.2M, Ksh 1.6M, Ksh 850, Ksh 1.1M, Ksh 100M, Ksh 250 … (+9) |
| &nbsp;&nbsp;**8.2.2** | &nbsp;&nbsp;The service-delivery performance tracker <br>*(1 h4 panels)* | data | 485 | — | — | Ksh 100 M, Ksh 100M, 140, 2013, 2025, 18,000 … (+4) |
| &nbsp;&nbsp;**8.2.3** | &nbsp;&nbsp;The KPI framework, anchored to the vote threshold | data | 225 | — | §1.2.3 | 200,000, 532,758, 220,000, 400, 100, 1,527 … (+6) |
| &nbsp;&nbsp;**8.2.4** | &nbsp;&nbsp;Why we reject vanity metrics | narrative | 128 | — | — | 86.4%, 60% |
| &nbsp;&nbsp;**8.2.5** | &nbsp;&nbsp;Performance governance and executive escalation | data | 219 | — | — | 100, 200,000, 1,527, 20%, 100%, 55% … (+1) |
| **8.3** | The phased plan | visual | 25 | PhaseRail, KpiPhaseBlock | — | 2027 |
| &nbsp;&nbsp;**8.3.1** | &nbsp;&nbsp;Phase −1: Nomination Sprint — August–September 2026 | data | 553 | — | §5.3.2, §9.2.4, §6.5.5, §3.5.2, §8.4, §5.2.7 | 2026, 100, 15,000, 400,000, 20,000, 35% … (+4) |
| &nbsp;&nbsp;**8.3.2** | &nbsp;&nbsp;Phase 0: Digital Audit and Infrastructure — September–October 2026 | call-to-action | 159 | — | §8.5, §6.5.5 | 100 |
| &nbsp;&nbsp;**8.3.3** | &nbsp;&nbsp;Phase 1: Awareness and Community Building — October–December 2026 | data | 180 | — | — | 1,000,000, 50,000, 40,000, 5,000, 500, 1,000 … (+5) |
| &nbsp;&nbsp;**8.3.4** | &nbsp;&nbsp;Phase 2: Engagement and Persuasion — January–March 2027 | data | 197 | — | — | KSh200, 3,000,000, 150,000, 80,000, 25,000, 3,000 … (+6) |
| &nbsp;&nbsp;**8.3.5** | &nbsp;&nbsp;Phase 3: Mobilisation and GOTV — April–August 2027 | data | 204 | — | — | 5,000,000, 250,000, 120,000, 60,000, 8,000, 5,000 … (+8) |
| &nbsp;&nbsp;**8.3.6** | &nbsp;&nbsp;Post-election | narrative | 51 | — | §8.5.4 | — |
| **8.4** | The Kitui message lab | narrative | 11 | — | — | 13.6% |
| &nbsp;&nbsp;**8.4.1** | &nbsp;&nbsp;The problem with metrics-only optimisation | narrative | 71 | — | — | — |
| &nbsp;&nbsp;**8.4.2** | &nbsp;&nbsp;How the lab is designed | data | 123 | — | — | — |
| &nbsp;&nbsp;**8.4.3** | &nbsp;&nbsp;What gets tested | narrative | 119 | — | §2.8, §8.5 | — |
| &nbsp;&nbsp;**8.4.4** | &nbsp;&nbsp;The feedback loop | narrative | 64 | — | — | — |
| &nbsp;&nbsp;**8.4.5** | &nbsp;&nbsp;Message lab KPIs | data | 54 | — | — | 100, 100% |
| **8.5** | The public service-delivery tracker | visual | 12 | PublicServiceDeliveryTracker | — | — |
| &nbsp;&nbsp;**8.5.1** | &nbsp;&nbsp;Why it exists | social proof | 83 | — | — | — |
| &nbsp;&nbsp;**8.5.2** | &nbsp;&nbsp;What it is | data | 110 | — | — | — |
| &nbsp;&nbsp;**8.5.3** | &nbsp;&nbsp;What happens to a report | data | 67 | — | — | — |
| &nbsp;&nbsp;**8.5.4** | &nbsp;&nbsp;Design principles | narrative | 167 | — | §6.5.4 | — |
| &nbsp;&nbsp;**8.5.5** | &nbsp;&nbsp;What it is worth to the campaign | social proof | 96 | — | §2.2.4, §3.5 | — |
| &nbsp;&nbsp;**8.5.6** | &nbsp;&nbsp;Build and cost | data | 42 | — | §9.2.2 | KSh34,800, KSh140,000, KSh5,000, 800, 000 |
| &nbsp;&nbsp;**8.5.7** | &nbsp;&nbsp;Tracker KPIs | data | 100 | — | — | 500, 3,000, 8,000, 80%, 85%, 90% … (+3) |

## `public/content/9-ask.md` — 19 sections, 3,025 words

| § | Heading | Type | Words | Dep. (components) | Refs out | Figures / claims carried |
|---|---|---|--:|---|---|---|
| **9.1** | What the campaign gets | narrative | 53 | — | — | 200,000 |
| &nbsp;&nbsp;**9.1.1** | &nbsp;&nbsp;Through the nomination window <br>*(2 h4 panels)* | data | 292 | — | §8.4 | 2026, 40.0%, 22.1%, 12.0%, 45.0%, 28.0% … (+5) |
| &nbsp;&nbsp;**9.1.2** | &nbsp;&nbsp;Through the general election <br>*(3 h4 panels)* | data | 354 | — | — | 2026, 2027, 200,000, 2022, 198,004, 80,000 … (+5) |
| **9.2** | Budget tiers and unit economics | narrative | 0 | — | — | — |
| &nbsp;&nbsp;**9.2.1** | &nbsp;&nbsp;The regulatory ceiling comes first | data | 258 | — | §9.2.7 | KSh181.31 million, KSh28.6 million, KSh142.07m, KSh127.02m, KSh120.76m, KSh110.96m … (+11) |
| &nbsp;&nbsp;**9.2.2** | &nbsp;&nbsp;Unit economics at verified market rates | data | 191 | — | §2.9.4 | KSh0.25, KSh4,500, KSh34,800, KSh140,000, KSh5,000, KSh0.50 … (+5) |
| &nbsp;&nbsp;**9.2.3** | &nbsp;&nbsp;The cost-per-contact model | data | 200 | — | §6.5 | KSh0.30, KSh0.60, KSh159,827, KSh319,655, KSh36,000, KSh72,000 … (+11) |
| &nbsp;&nbsp;**9.2.4** | &nbsp;&nbsp;Compliance instrumentation | narrative | 101 | — | §7.2.5 | 20% |
| &nbsp;&nbsp;**9.2.5** | &nbsp;&nbsp;The three tiers <br>*(3 h4 panels)* | data | 445 | BudgetScenarioModeler | §8.4 | KSh34,800, KSh140,000, KSh5,000, 800, 000, 20% … (+2) |
| &nbsp;&nbsp;**9.2.6** | &nbsp;&nbsp;The tiers compared | data | 181 | — | — | 60,000, 150,000, 250,000, 30,430 |
| &nbsp;&nbsp;**9.2.7** | &nbsp;&nbsp;Spending against the ceiling | visual | 69 | ComplianceCeilingPanel | — | KSh97.56 million, KSh1
million, 20% |
| **9.3** | Working together, and what happens next | visual | 0 | SectionPortrait | — | — |
| &nbsp;&nbsp;**9.3.1** | &nbsp;&nbsp;Weekly strategy syncs | narrative | 30 | — | §7.2.4 | — |
| &nbsp;&nbsp;**9.3.2** | &nbsp;&nbsp;Asset centralisation | narrative | 47 | — | §5.3.5 | — |
| &nbsp;&nbsp;**9.3.3** | &nbsp;&nbsp;Performance tracking | narrative | 30 | — | §5.4.3, §9.2.4, §5.1.5 | — |
| &nbsp;&nbsp;**9.3.4** | &nbsp;&nbsp;Escalation | call-to-action | 32 | — | §7.2.6, §5.2.4, §5.2.7 | — |
| &nbsp;&nbsp;**9.3.5** | &nbsp;&nbsp;What Firefly needs from the campaign | narrative | 112 | — | §6.5.5 | — |
| &nbsp;&nbsp;**9.3.6** | &nbsp;&nbsp;Why a remote operation works <br>*(1 h4 panels)* | social proof | 301 | — | §4.2, §8.4 | — |
| &nbsp;&nbsp;**9.3.7** | &nbsp;&nbsp;The ask | data | 329 | — | — | 2026, 22.1%, 37.4%, 86% |


---

# PART 2 — Reconciliation: the merged site against this inventory

Phase 5. Every one of the 262 sections catalogued above is accounted for below as
kept, renumbered, merged into a named target, or logged in
[`CUT-LOG.md`](./CUT-LOG.md). Generated by resolving each original deep-link id
through `LEGACY_IDS` in `lib/heading-slug.ts` against the live section index, so
it reflects what the running site actually does — not what the plan intended.

| | Before | After |
|---|--:|--:|
| Sections (`##` + `###`) | 262 | **196** |
| Words in section bodies | 49,663 | 50,434 |
| Median words per section | 154 | **204** |
| Sections under 80 words | 78 (30%) | **32 (16%)** |
| Markdown tables | 59 | 49 |
| ASCII diagrams | 80 | 75 |
| Open `[Insert…]`/`[Confirm…]` markers | 21 | 25 |
| Unresolvable cross-references | 16 | **0** |
| Sections with no body (dead TOC entries) | 1 | **0** |
| Components rendered via `HEADING_INSERTS` | 46 | 46 |

The word count rises slightly because consolidation added the KPI ledger's framing,
four `[Confirm …]` markers naming contradictions found during the audit, and the
navigation lines pointing each programme at its targets. No source prose was
rewritten to be longer.

**Disposition of every original section.** "Kept" means the number and heading are
unchanged; "kept, retitled" means the anchor is unchanged but the heading was
widened to name merged-in material.

| Original § | Heading | Disposition | Now at |
|---|---|---|---|
| §0.1 | The bottleneck is the nomination, not the election | kept | §0.1 |
| §0.2 | What Firefly would run, and the credential it builds on | kept | §0.2 |
| §0.3 | Three realities the campaign has to work inside | kept | §0.3 |
| §0.4 | Why the operation is run remotely | kept | §0.4 |
| §1.1 | The nomination, and how it will be decided | kept | §1.1 |
| §1.1.1 | How Wiper picks its candidate | kept, retitled | §1.1.1 |
| §1.1.2 | Where the opinion-poll mechanism stands | kept, retitled | §1.1.2 |
| §1.1.3 | What the poll would measure | kept, retitled | §1.1.3 |
| §1.1.4 | Kitui Central's weight in the vote | kept, retitled | §1.1.4 |
| §1.1.5 | The polling gap, as sourced | kept, retitled | §1.1.5 |
| §1.1.6 | If it becomes a delegate primary | merged / renumbered | §1.1.5 If it becomes a delegate primary |
| §1.2 | The candidate and the county | kept | §1.2 |
| §1.2.1 | The candidate's record | kept | §1.2.1 |
| §1.2.2 | The field he is running against | kept | §1.2.2 |
| §1.2.3 | The 2022 baseline, ward by ward | kept | §1.2.3 |
| §1.2.4 | What the governorship controls, and what it is worth | kept | §1.2.4 |
| §1.2.5 | Who lives here, and what they can reach online | kept, retitled | §1.2.5 |
| §1.2.6 | Three election cycles, and the results in dispute | kept | §1.2.6 |
| §1.2.7 | County money and the audit record | kept | §1.2.7 |
| §1.2.8 | Drought, food security and climate pressure | kept, retitled | §1.2.8 |
| §1.2.9 | Mui Basin coal and the displaced communities | merged / renumbered | §1.2.8 Mui Basin coal and the displaced communities |
| §1.2.10 | Each rival, and the legal ground to be careful on | merged / renumbered | §1.2.2 The field he is running against |
| §1.3 | The arithmetic of winning | kept | §1.3 |
| §1.3.1 | The number of votes it takes | kept | §1.3.1 |
| §1.3.2 | The 40 wards, ranked, and the 12 that carry most | kept | §1.3.2 |
| §1.3.3 | Four routes to the threshold, with the working shown | kept | §1.3.3 |
| §1.3.4 | The constituencies that decide it | kept | §1.3.4 |
| §1.3.5 | Where he is not yet known, and whether it matters | kept | §1.3.5 |
| §1.3.6 | What ward-level data we still do not have | kept | §1.3.6 |
| §1.4 | The county's three regions | kept | §1.4 |
| §1.4.1 | The urban and central anchor: Kitui Central and Kitui West | merged / renumbered | §1.4 The county's three regions |
| §1.4.2 | The northern block: Mwingi | merged / renumbered | §1.4 The county's three regions |
| §1.4.3 | The arid and resource belt: Kitui South and East | merged / renumbered | §1.4 The county's three regions |
| §1.4.4 | How the zones are weighted | merged / renumbered | §1.4 The county's three regions |
| §2.1 | The Economist Governor | kept | §2.1 |
| §2.1.1 | The evidence behind the claim | kept | §2.1.1 |
| §2.1.2 | The resource paradox | kept | §2.1.2 |
| §2.1.3 | Answering the charge that discipline is cold | kept | §2.1.3 |
| §2.2 | The four campaign pillars | kept | §2.2 |
| §2.2.1 | Fiscal accountability and devolution | merged / renumbered | §2.2 The four campaign pillars |
| §2.2.2 | Data-driven civic engagement | merged / renumbered | §2.2 The four campaign pillars |
| §2.2.3 | Policy, translated into what it changes | merged / renumbered | §2.2 The four campaign pillars |
| §2.2.4 | Verification and follow-through | merged / renumbered | §2.2 The four campaign pillars |
| §2.3 | The six campaign themes | kept | §2.3 |
| §2.4 | Who we are talking to | kept | §2.4 |
| §2.4.1 | The six voter segments | kept | §2.4.1 |
| §2.4.2 | How large each segment is, and what the evidence says | kept | §2.4.2 |
| §2.4.3 | What we still need to research | kept | §2.4.3 |
| §2.5 | Voter segments and the messaging framework | kept | §2.5 |
| §2.6 | Message architecture | kept | §2.6 |
| §2.6.1 | The central claim and its three pillars | kept | §2.6.1 |
| §2.6.2 | What we say to each segment | kept, retitled | §2.6.2 |
| §2.6.3 | What we say on each channel | merged / renumbered | §2.6.2 Answering disinformation |
| §2.6.4 | Answering disinformation | merged / renumbered | §2.6.2 Answering disinformation |
| §2.7 | Content production and asset governance | kept | §2.7 |
| §2.7.1 | The four content pillars | kept | §2.7.1 |
| §2.7.2 | Formats, by channel | kept, retitled | §2.7.2 |
| §2.7.3 | Copy samples: radio, SMS and USSD | kept | §2.7.3 |
| §2.7.4 | The weekly production schedule | kept | §2.7.4 |
| §2.7.5 | Who approves what, and when | kept, retitled | §2.7.5 |
| §2.7.6 | The asset library | merged / renumbered | §2.7.5 The asset library |
| §2.8 | Behavioural science and persuasion | kept | §2.8 |
| §2.8.1 | Framing true claims, transparently | kept, retitled | §2.8.1 |
| §2.8.2 | The principles we apply | kept, retitled | §2.8.2 |
| §2.8.3 | Framing, worked through in examples | merged / renumbered | §2.8.2 Framing, worked through in examples |
| §2.9 | AI-assisted creative and testing | kept | §2.9 |
| §2.9.1 | What AI is used for, and what it is never used for | kept, retitled | §2.9.1 |
| §2.9.2 | Tools and platforms | kept, retitled | §2.9.2 |
| §2.9.3 | The weekly testing cycle | merged / renumbered | §2.9.1 Tools, platforms and the weekly testing cycle |
| §2.9.4 | Performance benchmarks | merged / renumbered | §2.9.2 Performance benchmarks |
| §3.1 | The two-tier channel architecture | kept | §3.1 |
| §3.1.1 | The connected minority, and its limits | kept | §3.1.1 |
| §3.1.2 | The offline majority, and the infrastructure that reaches it | kept | §3.1.2 |
| §3.1.3 | Budget against reach | kept | §3.1.3 |
| §3.2 | Platform tactics | kept | §3.2 |
| §3.3 | Paid media and campaign financing | kept | §3.3 |
| §3.3.1 | Where the paid budget goes, by reachable population | kept | §3.3.1 |
| §3.3.2 | Rate cards we still have to obtain | kept | §3.3.2 |
| §3.3.3 | The campaign financing rules we work inside | kept, retitled | §3.3.3 |
| §3.3.4 | Penalty exposure, and how we stay clear of it | merged / renumbered | §3.3.3 The financing rules we work inside, and the penalties for breaking them |
| §3.4 | Earned media and the radio landscape | kept, retitled | §3.4 |
| §3.4.1 | Who owns the Kamba-language stations, and who they favour | kept | §3.4.1 |
| §3.4.2 | The gatekeeper bottleneck | kept | §3.4.2 |
| §3.4.3 | Getting on air around a hostile gatekeeper | kept | §3.4.3 |
| §3.4.4 | How we pitch: evidence first | kept, retitled | §3.4.4 |
| §3.5 | Journalists, debates and radio strategy | kept, retitled | §3.5 |
| §3.5.1 | The radio problem, stated plainly | kept, retitled | §3.5.1 |
| §3.5.2 | The journalist relationship programme | kept, retitled | §3.5.2 |
| §3.5.3 | Candidate media training | kept, retitled | §3.5.3 |
| §3.5.4 | The debate and forum playbook | kept, retitled | §3.5.4 |
| §3.5.5 | Pre-drafted response lines | merged / renumbered | §3.5.4 Language mix, idiom and who signs it off |
| §3.5.6 | Earned media KPIs | merged / renumbered | §8.2.4 What every programme is held to |
| §3.6 | Working in three languages | kept, retitled | §3.6 |
| §3.6.1 | Which language reaches which voters, on which channel | kept, retitled | §3.6.1 |
| §3.6.2 | Register, dialect and the discipline it takes | kept, retitled | §3.6.2 |
| §3.6.3 | The production and quality-control pipeline | merged / renumbered | §8.2.4 What every programme is held to |
| §3.6.4 | Channel-by-language deployment | merged / renumbered | §3.5.4 Language mix, idiom and who signs it off |
| §3.7 | Accessibility and inclusion | merged / renumbered | §3.6 Accessibility and inclusion |
| §3.7.1 | What accessibility means here | merged / renumbered | §3.6.1 The case for treating accessibility as reach |
| §3.7.2 | The case | merged / renumbered | §3.6.1 The case for treating accessibility as reach |
| §3.7.3 | The commitments | merged / renumbered | §3.6.2 The commitments |
| §3.7.4 | Why this sits in the strategy, not an annex | merged / renumbered | §3.5.4 Language mix, idiom and who signs it off |
| §3.7.5 | Accessibility KPIs | merged / renumbered | §8.2.4 What every programme is held to |
| §4.1 | Field and digital, working as one | kept | §4.1 |
| §4.1.1 | What the 40 ward coordinators report | kept, retitled | §4.1.1 |
| §4.1.2 | From ground intel to a published response in four hours | kept | §4.1.2 |
| §4.1.3 | Distribution beyond social media | kept, retitled | §4.1.3 |
| §4.1.4 | The operating rhythm | kept, retitled | §4.1.4 |
| §4.2 | The field-to-digital loop | kept, retitled | §4.2 |
| §4.2.1 | The problem it solves | kept, retitled | §4.2.1 |
| §4.2.2 | How the loop runs | kept, retitled | §4.2.2 |
| §4.2.3 | Field to digital | kept, retitled | §4.2.3 |
| §4.2.4 | Digital to field | kept, retitled | §4.2.4 |
| §4.2.5 | Who governs it | kept, retitled | §4.2.5 |
| §4.3 | SMS, USSD and the offline majority | kept, retitled | §4.3 |
| §4.3.1 | Why this layer decides the race | kept, retitled | §4.3.1 |
| §4.3.2 | The SMS layer | kept, retitled | §4.3.2 |
| §4.3.3 | The USSD layer | kept, retitled | §4.3.3 |
| §4.3.4 | Voice and audio | merged / renumbered | §4.3.3 Management tooling |
| §4.3.5 | The mobile-money agent network | merged / renumbered | §8.2.4 What every programme is held to |
| §4.3.6 | KPIs for the offline layer | merged / renumbered | §8.2.4 What every programme is held to |
| §4.4 | Digital organising and volunteers | kept, retitled | §4.4 |
| §4.4.1 | Turning online supporters into offline organisers | kept, retitled | §4.4.1 |
| §4.4.2 | Volunteer tiers | merged / renumbered | §8.2.4 What every programme is held to |
| §4.4.3 | Gamification mechanics | merged / renumbered | §4.3.2 Gamification mechanics |
| §4.4.4 | Management tooling | merged / renumbered | §8.2.4 What every programme is held to |
| §4.4.5 | Volunteer KPIs | merged / renumbered | §8.2.4 What every programme is held to |
| §4.5 | The coalition and endorsement calendar | merged / renumbered | §4.4 The coalition and endorsement calendar |
| §4.5.1 | The principle behind the sequence | merged / renumbered | §4.4.1 The sequenced calendar, and how endorsements are managed |
| §4.5.2 | The sequenced calendar | merged / renumbered | §4.4.1 The sequenced calendar, and how endorsements are managed |
| §4.5.3 | Managing endorsements | merged / renumbered | §4.3.2 Gamification mechanics |
| §4.5.4 | Coalition KPIs | merged / renumbered | §8.2.4 What every programme is held to |
| §5.1 | Rapid response and opposition handling | kept, retitled | §5.1 |
| §5.1.1 | What we monitor, and how threats reach us | kept, retitled | §5.1.1 |
| §5.1.2 | The four-tier response decision tree | kept, retitled | §5.1.2 |
| §5.1.3 | Response times, by channel | kept | §5.1.3 |
| §5.1.4 | Holding positions, pre-drafted | kept, retitled | §5.1.4 |
| §5.1.5 | Staying inside defamation law | kept | §5.1.5 |
| §5.2 | The digital war room | kept, retitled | §5.2 |
| §5.2.1 | What the war room is for | kept, retitled | §5.2.1 |
| §5.2.2 | Monitoring tools | kept, retitled | §5.2.2 |
| §5.2.3 | The shift schedule | kept, retitled | §5.2.3 |
| §5.2.4 | The rapid-response protocol | kept, retitled | §5.2.4 |
| §5.2.5 | The pre-approved message library | merged / renumbered | §5.2.4 The deepfake and manipulated media protocol |
| §5.2.6 | The dashboard view | merged / renumbered | §5.1.6 War-room shifts and the dashboard |
| §5.2.7 | Red-team drills | merged / renumbered | §5.1.7 Red-team drills |
| §5.3 | Cybersecurity and manipulated media | kept, retitled | §5.3 |
| §5.3.1 | The threat model | kept, retitled | §5.3.1 |
| §5.3.2 | Account security baseline | kept, retitled | §5.3.2 |
| §5.3.3 | Phishing awareness | kept, retitled | §5.3.3 |
| §5.3.4 | The incident response plan | merged / renumbered | §5.3.3 Reading the current field |
| §5.3.5 | The deepfake and manipulated media protocol | merged / renumbered | §5.2.4 The deepfake and manipulated media protocol |
| §5.4 | Watching the other campaigns | merged / renumbered | §5.3 Watching the other campaigns |
| §5.4.1 | Public sources only, and the line we do not cross | merged / renumbered | §5.3.1 Public sources only, and the line we do not cross |
| §5.4.2 | Monitoring tools | merged / renumbered | §5.1.1 What we monitor, and with what |
| §5.4.3 | The monthly competitive brief | merged / renumbered | §5.3.2 The monthly competitive brief, and real-time alerts |
| §5.4.4 | The rapid alert system | merged / renumbered | §5.3.3 Reading the current field |
| §5.4.5 | Reading the current field | merged / renumbered | §5.3.3 Reading the current field |
| §6.1 | The data layer | kept | §6.1 |
| §6.1.1 | The voter and supporter data model | kept | §6.1.1 |
| §6.1.2 | Every figure carries its provenance | kept | §6.1.2 |
| §6.1.3 | The three source tiers | kept | §6.1.3 |
| §6.1.4 | When two sources disagree | kept | §6.1.4 |
| §6.1.5 | The Data Protection Act 2019, applied | kept | §6.1.5 |
| §6.1.6 | The ODPC guidance we are still waiting on | kept | §6.1.6 |
| §6.2 | Predictive voter modelling | kept | §6.2 |
| §6.2.1 | What the model scores, and why | kept | §6.2.1 |
| §6.2.2 | Data sources | kept | §6.2.2 |
| §6.2.3 | Modelling methodology | kept | §6.2.3 |
| §6.2.4 | Model variables | kept | §6.2.4 |
| §6.2.5 | How the model is evaluated | kept | §6.2.5 |
| §6.2.6 | Putting the model to work | kept | §6.2.6 |
| §6.2.7 | The compliance gate this depends on | kept | §6.2.7 |
| §6.3 | The technology stack | kept | §6.3 |
| §6.3.1 | Component by component, and what each costs | kept | §6.3.1 |
| §6.3.2 | The procurement matrix | kept | §6.3.2 |
| §6.3.3 | Technical risk and security protocols | kept | §6.3.3 |
| §6.4 | Analytics and attribution | kept | §6.4 |
| §6.4.1 | Measuring what moves votes, not vanity | kept, retitled | §6.4.1 |
| §6.4.2 | Multi-touch attribution | kept, retitled | §6.4.2 |
| §6.4.3 | Tracking offline conversion | kept, retitled | §6.4.3 |
| §6.4.4 | Key metrics and benchmarks | kept, retitled | §6.4.4 |
| §6.4.5 | The analytics maturity roadmap | merged / renumbered | §6.4.4 Who owns the data |
| §6.4.6 | Who owns the data | merged / renumbered | §6.4.4 Who owns the data |
| §6.5 | Ethics, privacy and the data charter | kept | §6.5 |
| §6.5.1 | The standard we hold ourselves to | kept, retitled | §6.5.1 |
| §6.5.2 | The regulatory environment as it stands | kept, retitled | §6.5.2 |
| §6.5.3 | Compliance measures | kept, retitled | §6.5.3 |
| §6.5.4 | The Digital Ethics and Data Charter | merged / renumbered | §6.5.2 The Digital Ethics and Data Charter |
| §6.5.5 | The compliance sign-off gate | merged / renumbered | §6.5.3 The compliance sign-off gate |
| §6.6 | Statutory and regulatory compliance | kept | §6.6 |
| §6.6.1 | Campaign financing obligations under the ECFA | kept | §6.6.1 |
| §6.6.2 | The IEBC nomination and clearance checklist | kept | §6.6.2 |
| §6.6.3 | Data protection and election offences liability | kept | §6.6.3 |
| §7.1 | The scope of work | kept | §7.1 |
| §7.1.1 | Web management and digital architecture | merged / renumbered | §7.1 The scope of work |
| §7.1.2 | Brand management | merged / renumbered | §7.1 The scope of work |
| §7.1.3 | Civic content and visual data | merged / renumbered | §7.1 The scope of work |
| §7.1.4 | Online fundraising and data analytics | merged / renumbered | §7.1 The scope of work |
| §7.1.5 | Digital advertising | merged / renumbered | §7.1 The scope of work |
| §7.1.6 | Crisis and reputation management | merged / renumbered | §7.1 The scope of work |
| §7.2 | The team and how it is structured | kept, retitled | §7.2 |
| §7.2.1 | A lean core with a defined surge | kept, retitled | §7.2.1 |
| §7.2.2 | The core team, retained throughout | kept, retitled | §7.2.2 |
| §7.2.3 | Surge roles, activated by phase and tier | kept | §7.2.3 |
| §7.2.4 | Reporting lines | kept, retitled | §7.2.4 |
| §7.2.5 | Operating cadence | kept, retitled | §7.2.5 |
| §7.2.6 | Who signs off on content | kept, retitled | §7.2.6 |
| §7.3 | Leadership roles and governance rhythm | merged / renumbered | §7.2 The team, and how it is governed |
| §7.3.1 | Why the delivery model is lean | merged / renumbered | §7.2.1 Why the delivery model is lean |
| §7.3.2 | Core leadership roles and who owns what | merged / renumbered | §7.2.2 The core team, and who owns what |
| §7.3.3 | How disagreements escalate | merged / renumbered | §7.2.4 Reporting lines, and how disagreements escalate |
| §7.3.4 | The meeting cadence | merged / renumbered | §7.2.5 The operating cadence |
| §8.1 | The headline scorecards | kept | §8.1 |
| §8.1.1 | Stage 1: the nomination-window scorecard | kept | §8.1.1 |
| §8.1.2 | Stage 2: the general election scorecard | kept | §8.1.2 |
| §8.2 | What we measure, and why | kept | §8.2 |
| §8.2.1 | The research programme and the nomination tracking poll | kept | §8.2.1 |
| §8.2.2 | The service-delivery performance tracker | kept | §8.2.2 |
| §8.2.3 | The KPI framework, anchored to the vote threshold | kept, retitled | §8.2.3 |
| §8.2.4 | Why we reject vanity metrics | kept, retitled | §8.2.4 |
| §8.2.5 | Performance governance and executive escalation | kept | §8.2.5 |
| §8.3 | The phased plan | kept | §8.3 |
| §8.3.1 | Phase −1: Nomination Sprint — August–September 2026 | kept | §8.3.1 |
| §8.3.2 | Phase 0: Digital Audit and Infrastructure — September–October 2026 | kept | §8.3.2 |
| §8.3.3 | Phase 1: Awareness and Community Building — October–December 2026 | kept | §8.3.3 |
| §8.3.4 | Phase 2: Engagement and Persuasion — January–March 2027 | kept | §8.3.4 |
| §8.3.5 | Phase 3: Mobilisation and GOTV — April–August 2027 | kept | §8.3.5 |
| §8.3.6 | Post-election | kept | §8.3.6 |
| §8.4 | The Kitui message lab | kept | §8.4 |
| §8.4.1 | The problem with metrics-only optimisation | kept, retitled | §8.4.1 |
| §8.4.2 | How the lab is designed | kept, retitled | §8.4.2 |
| §8.4.3 | What gets tested | kept, retitled | §8.4.3 |
| §8.4.4 | The feedback loop | merged / renumbered | §8.4.3 The feedback loop |
| §8.4.5 | Message lab KPIs | merged / renumbered | §8.2.4 What every programme is held to |
| §8.5 | The public service-delivery tracker | kept | §8.5 |
| §8.5.1 | Why it exists | kept | §8.5.1 |
| §8.5.2 | What it is | kept | §8.5.2 |
| §8.5.3 | What happens to a report | kept | §8.5.3 |
| §8.5.4 | Design principles | kept | §8.5.4 |
| §8.5.5 | What it is worth to the campaign | kept | §8.5.5 |
| §8.5.6 | Build and cost | kept | §8.5.6 |
| §8.5.7 | Tracker KPIs | merged / renumbered | §8.2.4 What every programme is held to |
| §9.1 | What the campaign gets | kept | §9.1 |
| §9.1.1 | Through the nomination window | kept | §9.1.1 |
| §9.1.2 | Through the general election | kept | §9.1.2 |
| §9.2 | Budget tiers and unit economics | kept | §9.2 |
| §9.2.1 | The regulatory ceiling comes first | kept | §9.2.1 |
| §9.2.2 | Unit economics at verified market rates | kept | §9.2.2 |
| §9.2.3 | The cost-per-contact model | kept | §9.2.3 |
| §9.2.4 | Compliance instrumentation | kept | §9.2.4 |
| §9.2.5 | The three tiers | kept | §9.2.5 |
| §9.2.6 | The tiers compared | kept | §9.2.6 |
| §9.2.7 | Spending against the ceiling | kept | §9.2.7 |
| §9.3 | Working together, and what happens next | kept | §9.3 |
| §9.3.1 | Weekly strategy syncs | kept, retitled | §9.3.1 |
| §9.3.2 | Asset centralisation | kept, retitled | §9.3.2 |
| §9.3.3 | Performance tracking | kept, retitled | §9.3.3 |
| §9.3.4 | Escalation | kept, retitled | §9.3.4 |
| §9.3.5 | What Firefly needs from the campaign | merged / renumbered | §9.3.2 What Firefly needs from the campaign |
| §9.3.6 | Why a remote operation works | merged / renumbered | §9.3.3 What Firefly delivers remotely, and what it does not |
| §9.3.7 | The ask | merged / renumbered | §9.3.4 The ask |

**Totals: 190 kept in place, 72 merged or renumbered, 0 without a surviving anchor.**

**Content preservation, checked mechanically.** Comparing the pre-merge baseline
against the working tree:

- **601 of 601 distinct figures** (KSh amounts, percentages, counts of three digits
  or more) still present. Zero missing.
- **907 of 911 bolded claims** present verbatim. The four residuals are all
  accounted for and none is substantive: `Kwa Mutonga/Kithumula Ward:` (a bolded
  list label; the ward and its 11,022 voters survive in §1.3.2's ranked register),
  and `Subsection 17A`, `Subsection 19A`, `Subsection 19B` — dead pointers into a
  retired numbering scheme, removed deliberately and logged as C06 and C17.
- `scripts/verify-figures.mjs` passes, which independently asserts that every
  numeric literal rendered by a component still traces to `public/content/*.md`
  or `data/`.

