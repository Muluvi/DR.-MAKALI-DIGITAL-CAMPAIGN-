# Visual tools baseline (V0)

Recorded on 30 October 2026 at commit `5c04e18`, before any work from `KITUI-VISUAL-TOOLS-BRIEF.md` (V0). Nothing in the site changed to produce it. Every later work package reports its bundle delta against the figures below.

## Bundle size, `next build` (Next.js 15.5, Node 22)

| Route | Size | First Load JS |
|---|---:|---:|
| `/[[...slug]]` (main route: `/`, `/cover`, `/brief` and 35 more paths) | 69.1 kB | **477 kB** |
| `/tools` | 6.16 kB | 112 kB |
| `/tools/visual-kinds` | 485 B | 405 kB |
| `/_not-found` | 124 B | 103 kB |
| First Load JS shared by all | | 103 kB |
| Middleware | | 34.9 kB |

The main route's First Load JS (477 kB) is the reference figure.

## Bundle deltas by work package

| Work package | Route | First Load JS | Delta against baseline |
|---|---|---:|---:|
| V0 baseline | `/[[...slug]]` | 477 kB | — |
| V1.3 Projects register (open-data WP6) | `/[[...slug]]` | 476 kB | −1 kB (rounding; the register's data is not imported here) |
| V1.3 Projects register (open-data WP6) | `/tools/service-delivery` (new) | 137 kB | New route: 26.1 kB of its own, most of it the 401-project export |
| V1.2 Projects bubble chart, fig-3-12-projects (open-data WP6) | `/[[...slug]]` | 480 kB | +3 kB: the figure store (lib/data/figures.ts, in the shared bundle) now reads the 40 ward totals from data/analysis/projects-by-ward.json. The chart itself is server-rendered behind the existing lazy figure boundary |

## Work packages not built

| Work package | State | Why |
|---|---|---|
| V1.1 Settlement heatmap | Waiting on data | Needs the open-data brief's WP5 (Microsoft building footprints), not yet fetched. |
| V2 Budget Sankey | **[DATA NEEDED]** | `data/analysis/county-finance-2026-27.json` carries the sources side only (equitable share, own-source revenue, grants; KSh 13.79bn). A Sankey needs the uses side: departmental allocations from the FY2026/27 programme-based budget, a Tier 1 document not in the data pack. `d3-sankey` is not installed, and no figure draws sources into a single "Total" node. |
| V3 Print route, guided tour | Not started | Optional; needs Firefly's yes. |
| V4 Mermaid in docs | Not started | Docs only; no reader-facing change. |
| V5 Explainer clips | Not started | Optional, off-site; needs Firefly's yes. |

## Section coverage, `node scripts/visual-coverage.mjs`

`--check` passes: 147 sections (122 sub-sections, 25 parts). 39 are hand-built, 1 is derived from its own content, and 107 carry no figure because their content measures nothing.

| # | Part | Lvl | Section | Entrance | Figure |
|---:|---|---|---|---|---|
| 1 | annex-county | h2 | B.1 The 40-ward register | clip wipe ← | — (none) |
| 2 | annex-evidence | h2 | A.1 Evidence standard: provenance and source tiers | clip wipe ← | — (none) |
| 3 | annex-evidence | h3 | A.1.1 Every figure carries its provenance | rise 6px | — (none) |
| 4 | annex-evidence | h3 | A.1.2 The three source tiers | rise 6px | — (none) |
| 5 | annex-evidence | h3 | A.1.3 When two sources disagree | rise 6px | — (none) |
| 6 | annex-evidence | h3 | A.1.4 The standard applied to our own measurement | rise 6px | — (none) |
| 7 | annex-evidence | h2 | A.2 Source table | clip wipe ← | — (none) |
| 8 | annex-glossary | h2 | H.1 Terms used in this proposal | clip wipe ← | — (none) |
| 9 | annex-playbooks | h2 | C.1 Platform playbooks | clip wipe ← | — (none) |
| 10 | annex-playbooks | h2 | C.2 Formats, copy samples and the USSD pointer | clip wipe ← | — (none) |
| 11 | annex-runbooks | h2 | F.1 The four-tier response decision tree | clip wipe ← | — (none) |
| 12 | annex-runbooks | h2 | F.2 Response times, by channel | clip wipe ← | — (none) |
| 13 | annex-runbooks | h2 | F.3 Holding positions, pre-drafted | clip wipe ← | — (none) |
| 14 | annex-runbooks | h2 | F.4 Monitoring tools | clip wipe ← | — (none) |
| 15 | annex-runbooks | h2 | F.5 Rapid-response protocol and pre-approved message library | clip wipe ← | — (none) |
| 16 | annex-runbooks | h2 | F.6 Red-team drills | clip wipe ← | — (none) |
| 17 | annex-runbooks | h2 | F.7 The threat model | clip wipe ← | — (none) |
| 18 | annex-runbooks | h2 | F.8 Account security baseline | clip wipe ← | — (none) |
| 19 | annex-runbooks | h2 | F.9 Phishing awareness | clip wipe ← | — (none) |
| 20 | annex-runbooks | h2 | F.10 The incident response plan | clip wipe ← | — (none) |
| 21 | annex-runbooks | h2 | F.11 Competitive intelligence outputs and rapid alerts | clip wipe ← | — (none) |
| 22 | annex-technology | h2 | E.1 Technology reference architecture | clip wipe ← | — (none) |
| 23 | annex-technology | h2 | E.2 Voter model: data sources and variable dictionary | clip wipe ← | — (none) |
| 24 | annex-terms | h2 | G.1 Confidentiality and use | clip wipe ← | — (none) |
| 25 | annex-volunteers | h2 | D.1 Volunteer programme reference | clip wipe ← | — (none) |
| 26 | ask | h2 | 23.1 The window, not the deadline | clip wipe ← | — (none) |
| 27 | channels | h2 | 12.1 Where the effort goes | clip wipe ← | — (none) |
| 28 | channels | h2 | 12.2 Which channel does which job | clip wipe ← | — (none) |
| 29 | channels | h2 | 12.3 The gatekeeper bottleneck | clip wipe ← | — (none) |
| 30 | channels | h2 | 12.4 Which language reaches which voters | clip wipe ← | — (none) |
| 31 | channels | h2 | 12.5 Register, dialect and quality control | clip wipe ← | — (none) |
| 32 | channels | h2 | 12.6 A week of publishing, before and after | clip wipe ← | — (none) |
| 33 | channels | h2 | 12.7 When the plan changes | clip wipe ← | — (none) |
| 34 | coalitions | h2 | 16.1 The principle behind the sequence | clip wipe ← | — (none) |
| 35 | coalitions | h2 | 16.2 The sequenced calendar | clip wipe ← | — (none) |
| 36 | coalitions | h2 | 16.3 Managing endorsements, and how coalitions are measured | clip wipe ← | — (none) |
| 37 | commitments | h2 | 22.1 What Firefly commits to | clip wipe ← | — (none) |
| 38 | commitments | h2 | 22.2 What the campaign provides | clip wipe ← | — (none) |
| 39 | diagnosis | h2 | 7.1 What the evidence says | clip wipe ← | — (none) |
| 40 | diagnosis | h2 | 7.2 What could overturn it | clip wipe ← | — (none) |
| 41 | diagnosis | h2 | 7.3 What the data cannot yet tell us | clip wipe ← | — (none) |
| 42 | diagnosis | h2 | 7.4 The assumptions this plan rests on | clip wipe ← | — (none) |
| 43 | engagement | h2 | 13.1 How this proposal is built | clip wipe ← | — (none) |
| 44 | engagement | h2 | 13.2 Who owns what: Firefly, the existing team, the campaign | clip wipe ← | — (none) |
| 45 | engagement | h2 | 13.3 What is outside this scope | clip wipe ← | — (none) |
| 46 | engagement | h2 | 13.4 The weekly rhythm, decision rights and approvals | clip wipe ← | bespoke component · |
| 47 | engagement | h2 | 13.5 Meetings and the escalation path | clip wipe ← | — (none) |
| 48 | goal | h2 | 8.1 The goal and the two deadlines | clip wipe ← | — (none) |
| 49 | goal | h2 | 8.2 Five objectives for the digital operation | clip wipe ← | — (none) |
| 50 | goal | h3 | 8.2.1 Be known where he isn't yet | rise 6px | — (none) |
| 51 | goal | h3 | 8.2.2 Turn his record into visible proof | rise 6px | — (none) |
| 52 | goal | h3 | 8.2.3 Build a direct line to the voters the internet doesn't reach | rise 6px | — (none) |
| 53 | goal | h3 | 8.2.4 Give every post a voter, a ward and a reason | rise 6px | — (none) |
| 54 | goal | h3 | 8.2.5 Hold the home base while Kitui Central runs its own race | rise 6px | — (none) |
| 55 | kitui | h2 | 1.1 The people: population, gender, age, households | clip wipe ← | bespoke component · |
| 56 | kitui | h2 | 1.2 The land: area, density, rural and urban, the three regions | clip wipe ← | bespoke component · |
| 57 | kitui | h2 | 1.3 Living standards: poverty, water, electricity, phones and internet | clip wipe ← | bespoke component · |
| 58 | kitui | h2 | 1.4 How the county is run: 8 constituencies, 40 wards, sub-counties and villages | clip wipe ← | — (none) |
| 59 | kitui | h2 | 1.5 The county's money: the budget envelope, the development plan, the audit record | clip wipe ← | bespoke component · |
| 60 | lawful | h2 | 19.1 Our standard | clip wipe ← | — (none) |
| 61 | lawful | h2 | 19.2 The Data Protection Act and the regulator | clip wipe ← | — (none) |
| 62 | lawful | h2 | 19.3 The Digital Ethics and Data Charter | clip wipe ← | bespoke component · |
| 63 | lawful | h2 | 19.4 IEBC clearance and liability | clip wipe ← | — (none) |
| 64 | lawful | h2 | 19.5 Open regulatory items | clip wipe ← | — (none) |
| 65 | message | h2 | 10.1 One claim, three pillars, six themes | clip wipe ← | bespoke component · |
| 66 | message | h2 | 10.2 Message discipline and persuasion principles | clip wipe ← | bespoke component · |
| 67 | message | h2 | 10.3 Framing, worked through in examples | clip wipe ← | bespoke component · |
| 68 | message | h2 | 10.4 Sample messaging: what Firefly would hand the team | clip wipe ← | — (none) |
| 69 | message | h2 | 10.5 Countering disinformation | clip wipe ← | bespoke component · |
| 70 | needs | h2 | 3.1 Water | clip wipe ← | bespoke component · |
| 71 | needs | h2 | 3.2 Food, farming and drought | clip wipe ← | bespoke component · |
| 72 | needs | h2 | 3.3 Health | clip wipe ← | — (none) |
| 73 | needs | h2 | 3.4 Roads and access | clip wipe ← | — (none) |
| 74 | needs | h2 | 3.5 Jobs and the young | clip wipe ← | checklist |
| 75 | needs | h2 | 3.6 The cost of living | clip wipe ← | — (none) |
| 76 | needs | h2 | 3.7 How county money is spent: the audit record and the incumbent's scorecard | clip wipe ← | bespoke component · |
| 77 | needs | h2 | 3.8 Mui Basin coal and the displaced communities | clip wipe ← | bespoke component · |
| 78 | news | h2 | 4.1 Where people get information | clip wipe ← | bespoke component · |
| 79 | news | h2 | 4.2 Who owns the airwaves | clip wipe ← | bespoke component · |
| 80 | news | h2 | 4.3 What each channel can physically reach | clip wipe ← | bespoke component · |
| 81 | news | h2 | 4.4 The offline majority, and the infrastructure that reaches it | clip wipe ← | — (none) |
| 82 | position | h2 | 9.1 The central claim | clip wipe ← | bespoke component · |
| 83 | position | h2 | 9.2 The resource paradox | clip wipe ← | — (none) |
| 84 | position | h2 | 9.3 Answering the charge that discipline is cold | clip wipe ← | — (none) |
| 85 | race | h2 | 5.1 An open seat: the incumbent is term-limited | clip wipe ← | — (none) |
| 86 | race | h2 | 5.2 How Wiper chooses its candidate, and when | clip wipe ← | bespoke component · |
| 87 | race | h2 | 5.3 The field: the nomination contest and the general election | clip wipe ← | — (none) |
| 88 | race | h2 | 5.4 If it becomes a delegate primary | clip wipe ← | — (none) |
| 89 | race | h2 | 5.5 Each rival, and the legal ground to be careful on | clip wipe ← | bespoke component · |
| 90 | receives | h2 | 21.1 The three scope levels, compared | clip wipe ← | — (none) |
| 91 | receives | h3 | 21.1.1 The three scope levels | rise 6px | bespoke component · |
| 92 | receives | h3 | 21.1.2 The scope levels compared | rise 6px | bespoke component · |
| 93 | receives | h2 | 21.2 The deliverables schedule | clip wipe ← | — (none) |
| 94 | record | h2 | 6.1 The public record | clip wipe ← | bespoke component · |
| 95 | record | h2 | 6.2 Where he is known, and where he is not | clip wipe ← | bespoke component · |
| 96 | record | h2 | 6.3 Where party loyalty will not carry him | clip wipe ← | — (none) |
| 97 | record | h2 | 6.4 His channels today, and his rivals' | clip wipe ← | — (none) |
| 98 | record | h2 | 6.5 What his current online presence shows | clip wipe ← | — (none) |
| 99 | response | h2 | 20.1 Risks and responses | clip wipe ← | — (none) |
| 100 | response | h2 | 20.2 The war room and rapid-response protocol | clip wipe ← | — (none) |
| 101 | response | h2 | 20.3 Staying inside defamation law | clip wipe ← | — (none) |
| 102 | response | h2 | 20.4 Manipulated media and cyber security | clip wipe ← | — (none) |
| 103 | response | h2 | 20.5 Monitoring competitors: public sources only | clip wipe ← | — (none) |
| 104 | success | h2 | 18.1 How success will be judged | clip wipe ← | bespoke component · |
| 105 | success | h2 | 18.2 The scorecards for each stage | clip wipe ← | — (none) |
| 106 | success | h2 | 18.3 Recognition where he is least known | clip wipe ← | — (none) |
| 107 | success | h2 | 18.4 Why vanity metrics are excluded | clip wipe ← | — (none) |
| 108 | success | h2 | 18.5 The presence audit: method | clip wipe ← | — (none) |
| 109 | team | h2 | 17.1 Three teams, and how they fit | clip wipe ← | — (none) |
| 110 | team | h2 | 17.2 The Firefly core | clip wipe ← | — (none) |
| 111 | team | h2 | 17.3 Surge roles | clip wipe ← | — (none) |
| 112 | team | h2 | 17.4 Leadership, reporting lines and local roles | clip wipe ← | — (none) |
| 113 | team | h2 | 17.5 How the existing team is assessed and upskilled | clip wipe ← | — (none) |
| 114 | timeline | h2 | 14.1 The first four weeks | clip wipe ← | — (none) |
| 115 | timeline | h2 | 14.2 Phase 0: instrumentation | clip wipe ← | — (none) |
| 116 | timeline | h2 | 14.3 Fix first: six profile corrections | clip wipe ← | — (none) |
| 117 | timeline | h2 | 14.4 The target ladder | clip wipe ← | bespoke component · |
| 118 | timeline | h2 | 14.5 Phase 1: awareness, October–December 2026 | clip wipe ← | — (none) |
| 119 | timeline | h2 | 14.6 Phase 2: engagement and persuasion, January–March 2027 | clip wipe ← | — (none) |
| 120 | timeline | h2 | 14.7 Phase 3: mobilisation and turnout, April–August 2027 | clip wipe ← | — (none) |
| 121 | timeline | h2 | 14.8 After the election | clip wipe ← | — (none) |
| 122 | voters | h2 | 11.1 The universes: base, persuasion, turnout | clip wipe ← | — (none) |
| 123 | voters | h2 | 11.2 The six voter segments | clip wipe ← | bespoke component · |
| 124 | voters | h2 | 11.3 How large each segment is, and the evidence | clip wipe ← | — (none) |
| 125 | votes | h2 | 2.1 The electorate: registered voters in 2022 and 2026, polling stations, turnout | clip wipe ← | bespoke component · |
| 126 | votes | h2 | 2.2 Results, 2013 to 2022 | clip wipe ← | bespoke component · |
| 127 | votes | h2 | 2.3 Where the votes are: the twelve largest wards | clip wipe ← | bespoke component · |
| 128 | votes | h2 | 2.4 The constituencies that decide it: the Mwingi bloc and the Big Four | clip wipe ← | bespoke component · |
| 129 | votes | h2 | 2.5 The number it takes: the winning benchmark and four routes to it | clip wipe ← | bespoke component · |
| 130 | workstreams-data | h2 | 15.4 Data and technology (workstreams 11–14) | clip wipe ← | — (none) |
| 131 | workstreams-data | h3 | 15.4.1 Workstream 11 — The data layer | rise 6px | — (none) |
| 132 | workstreams-data | h3 | 15.4.2 Workstream 12 — Predictive voter modelling | rise 6px | — (none) |
| 133 | workstreams-data | h3 | 15.4.3 Workstream 13 — The technology stack | rise 6px | — (none) |
| 134 | workstreams-data | h3 | 15.4.4 Workstream 14 — Analytics and attribution | rise 6px | bespoke component · |
| 135 | workstreams-ground | h2 | 15.3 Ground and offline (workstreams 7–10) | clip wipe ← | — (none) |
| 136 | workstreams-ground | h3 | 15.3.1 Workstream 7 — Ground-digital integration | rise 6px | bespoke component · |
| 137 | workstreams-ground | h3 | 15.3.2 Workstream 8 — The field-to-digital loop | rise 6px | bespoke component · |
| 138 | workstreams-ground | h3 | 15.3.3 Workstream 9 — What Firefly operates: SMS, USSD and voice | rise 6px | bespoke component · |
| 139 | workstreams-ground | h3 | 15.3.4 Workstream 10 — Digital organising and volunteers | rise 6px | — (none) |
| 140 | workstreams-media | h2 | 15.2 Media (workstreams 5–6) | clip wipe ← | — (none) |
| 141 | workstreams-media | h3 | 15.2.1 Workstream 5 — Platform tactics and paid media | rise 6px | bespoke component · |
| 142 | workstreams-media | h3 | 15.2.2 Workstream 6 — Earned media, journalists and debates | rise 6px | bespoke component · |
| 143 | workstreams-platforms | h2 | 15.1 Owned platforms and content (workstreams 1–4) | clip wipe ← | — (none) |
| 144 | workstreams-platforms | h3 | 15.1.1 Workstream 1 — Owned platforms and the service-delivery tracker | rise 6px | bespoke component · |
| 145 | workstreams-platforms | h3 | 15.1.2 Workstream 2 — The content brief and asset governance | rise 6px | — (none) |
| 146 | workstreams-platforms | h3 | 15.1.3 Workstream 3 — Creative testing and AI assistance | rise 6px | — (none) |
| 147 | workstreams-platforms | h3 | 15.1.4 Workstream 4 — Accessibility and inclusion | rise 6px | — (none) |
