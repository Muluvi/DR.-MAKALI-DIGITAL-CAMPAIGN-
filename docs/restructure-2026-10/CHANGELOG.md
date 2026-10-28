# Restructure change log

Decisions taken while carrying out `preview.md`, in the order they were taken. Where the brief said "make the most conservative choice, log it, and continue", the entry says what the choice was and why.

## Stage 1: inventory and mapping data

1. **Branch.** The brief names `restructure/toc-2026-10`. This session is provisioned to push only to `claude/new-session-giw0mo`, so all stage commits go there and the PR is opened from it. The branch name has no effect on the content or the merge.
2. **Inventory count.** 333 headings, 205 numbered and 128 run-ins, as the brief expects. A heading counts as numbered only at levels 2 and 3, the two levels the site indexes; a level-4 run-in that opens "1." (the ward lists in B.1, the component list in old 5.2.4.3) is a list ordinal, not a section number.
3. **Preview title errors.** Preview section 6 carries three titles damaged by an old regex ("Langua register", and "Sta:" twice). `mapping.json` keeps the content's own titles. Recorded in BASELINE.md.
4. **No `npm test` or `npm run typecheck` script.** The baseline used `npm run test:figures` and `npx tsc --noEmit`, and every later stage uses the same two commands.

## Stage 2: new content file layout

The new `content/*.md` files are written by `scripts/restructure-2026-10/build-layout.py`, which reads every old file from the baseline commit and places each of the 333 old heading blocks exactly once (the script fails otherwise). Re-running it rewrites the same files. Stage 4 renumbers the citations on top of it.

### Rules applied throughout

1. **Text moves verbatim.** The only words the script writes are heading lines, one-line purpose lines, the bridging pointers listed below, and the `[CONFLICT Cn: see open items]` markers.
2. **Titles.** An old heading carried into a numbered slot keeps its exact title and takes the new number. New titles are used only where preview section 7.4 renames a section (6.3 → 1.1, 5.1 → 1.4, 5.7 → 4.1, 5.2 → 4.5, 5.6 → 5.1; 5.3's new title goes on the new 4.2 container), where several old headings combine into one new heading, and where the new heading has no old heading behind it. Preview section 5 abbreviates some titles (for example it drops the date range from the three phase headings); those abbreviations are not adopted, because section 7.4 is the rename register and lists none of them. The full list is in the table "Preview section 5 shorthand not adopted" below.
3. **Merged headings.** Where several old numbered headings combine, each keeps its title as an unnumbered run-in inside the new section, so no heading text is lost. Exceptions: an empty heading marked Removed is dropped (4.4.3, 5.1.5, 5.4.5, 5.6.3, 5.7.4, 5.8.4, 5.8.6, 5.8.8); a heading whose title is now the title of the section it sits in is dropped rather than repeated (4.4.7 under 3.6, 4.4.8 under 3.6.1); and 4.5 "What gets published" is dropped because its two halves went to 3.2.3 and 3.7.
4. **Old file preambles** travel with the first heading of their old file: objectives → 1.2, data → the opening line of `evidence.md`, analysis → inside 2.1 ahead of "The number it takes", strategy → the opening line of `strategy.md`, implementation → the head of 1.4, delivery → the head of 4.2.1, nextsteps → the head of 1.7. New files with no old preamble open on a one-line purpose: `decision.md`, `delivery.md`, `staffing.md`, `measurement.md`, `annex-spec.md`.
5. **Workstream banners.** The four group headings (5.2.1 to 5.2.4) dissolve. Each workstream banner gains a line "Group: …" carrying its old group intro word for word (5.2.1 had none, so its label and "(workstreams 1 to 4)" come from the 5.2 overview).
6. **Figures stay with their text.** Every `figure` fence moves with the paragraph it sat under. Two fences change the heading they attach to, because preview section 5 puts a new sub-heading between them and their old heading: `fig-5-4-ladder` (old 5.4 → new 4.3.1 "The target ladder", with its text version) and `research-and-tracker` (its paragraph returns to open 5.2.6, as the brief directs). `tech-stack` moves with the reference-architecture paragraphs to G.4.
7. **Subsection count.** The new main text has 6 Parts, 43 sections and **102** subsections. Preview section 5 counts 96 because it lists 4.6 without its six subsections; the mapping (the master) keeps 4.6.1 to 4.6.6, so they stay. 102 = 96 + 6.

### Where the brief's conflict rule overrides a preview cut

The brief says to keep both versions of every conflicting passage. Where the preview marked a conflict location "cut to a cross-reference", the text is moved whole instead:

- **C4.** Old 5.1.6 and 5.1.7 stay together, unchanged, as two run-ins under 4.5 with a one-line note saying why. They are not split across the workstreams.
- **C5.** Old 5.6.6, with its `delivery-tracker` figure and the "Dual Operational Function" list, moves whole into 4.5.1, after Tracker KPIs. Workstream 13 component 5 stays word for word inside the G.4 text version; text versions must survive unchanged in any case.
- **C7.** Old 2.7.1 keeps all its text in 2.9.2; only its heading line goes.

### Preview cuts not applied, and why

- **B.5 per-rival lines.** Kept. They carry tier labels and citation notes that 2.6 does not, for example Sen. Wambua's committee roles as Tier 1, and David Musila's Senate tenure "to be cited from the Senate record and the Kenya Gazette". Cutting them would lose provenance (hard rule 2). A pointer to 2.6 now opens the list.
- **Old 3.8.1 "what the campaign would run" bullets.** Kept in 2.9.4. They are not duplicated in workstreams 7 or 9 (the radio bookings, OB vans and church visits appear nowhere else), and the M-Pesa bullet carries `{{target.ambassadors}}`, which may not be lost (hard stop).
- **E.11.** Its table is not folded into E.4's rows. Two of its five rows (X lists; social listening described as "mentions, supporter sentiment, emerging narratives") exist nowhere else, and the shared rows are worded differently. The table moves whole under E.12 as the run-in "Competitor monitoring tools".
- **Old 5.2.1.4 language block.** Moved, not cut: it opens 3.6.1 after the language map, and a pointer stands in 4.5.4. The Governance paragraph on the Kikamba reviewer stays in 4.5.4.

### Orphaned and stranded passages returned

- The 5.8 intro ("What can go wrong…"), stranded at the end of old 5.7.9, is the opening line of `risks.md`, directly ahead of 6.1.
- The 5.9 opening paragraphs and the `org-chart` figure, stranded under old 5.8.14, open 4.6 ahead of "Three cores…".
- The trailing paragraph of old 5.6.4 ("Political strategy without empirical measurement…") and its `research-and-tracker` figure open 5.2.6.
- The 3.7.3 lead-in ("What digital reach can and cannot deliver…") opens 2.9.3, as the brief directs.
- The Annex A pointer stays where it stood, at the end of 6.5. Part 6 is now the last thing before Annex A, so it sits directly ahead of the annex it points to. This is the most conservative reading of "the Annex A pointer to Annex A": a pointer to Annex A placed inside Annex A would point at itself.
- The D.1/D.2 pointer box that followed "The Firefly proposition" stays at the end of 4.1.2, where its "the table below" still points at 4.1.3. The proposition itself moves to 1.4.2.

### Other placements

- 4.3 gains the one-line pointer "Phase −1 and Phase 0 are set out in 4.2." directly under its heading.
- 4.2.1 keeps the title "The first four weeks". The mapping notes a retitle to "The first ten weeks" pending the 5.3/5.3.7 timing decision, so it waits for that decision (OPEN-ITEMS.md).
- 4.5 sits at the head of `workstreams-platforms.md`. The brief's file table gives `delivery.md` 4.1 to 4.4 and the workstream files 4.5.1 to 4.5.14, and 4.5 heads the first of those.
- The five old files `objectives.md`, `data.md`, `analysis.md`, `implementation.md` and `nextsteps.md` are deleted. Their text is all in the new files.

### Build status at this stage

Content-level guards pass: `check-figures` (337 figures valid, no numeric literal in content), `check-copy`, `heading-inventory --strict` (no repeated number, no fourth numbered level) and `check-conservation.py`. The site build cannot pass at this stage, because `lib/content-files.ts` still names the old files. Stage 3 points it at the new ones.

### Word conservation

```
{
 "wordsBefore": 47768,
 "wordsAfter": 48356,
 "wordsCut": 319,
 "groupIntroWordsReusedInBanners": 84,
 "headingWordsDropped": 141,
 "wordsAdded(headings,banners,pointers,purpose,markers)": 1132,
 "unexplained": 0,
 "unexplainedPct": 0.0,
 "figures": 92,
 "textversions": 5,
 "tokens": 621
}
check-conservation: figures, text versions and tokens conserved; words reconcile within 1%
```

Words after = words before − words cut − group intros removed from their dissolved group headings − heading lines dropped + words the restructure writes (headings, banner group lines, purpose lines, pointers, markers). Unexplained: 0.

### Cuts (preview 7.2, applied)

| Old ref | Old heading | Words cut | Reason | Pointer left in its place |
|---|---|---|---|---|
| 5.1.4 | 5.1.4 How the levels change what runs | 163 | 5.1.4 repeats 5.5.1 and 5.5.2: the Level 2 recommendation is stated near-verbatim in 5.5.2 (D2); canonical home 1.5.1 | — |
| 6.3.1 | 6.3.1 The ask | 23 | The closing sign-off block repeats the cover's 'Prepared by' block word for word; canonical home the cover | — |
| 6.3.1 | 6.3.1 The ask | 1 | rule line above the cut sign-off block | — |
| F.2 | F.2 Who this is for, and on what terms | 78 | F.2 restates the cover: parties, status and confidentiality; canonical home the cover, full terms F.1 | — |
| — | The compliance gate this depends on | 54 | Restates the fallback 5.7.9 (now 5.3.4) sets out: 'Until step 4 is complete, the campaign operates on first-party consented data and aggregate ward-level statistics only' (mapping: 'Last item reduces to a pointer to 5.3.4') | *The compliance gate, and the fallback the model runs on until it clears, are set out in 5.3.4.* |

The removed text, word for word:

<details><summary>5.1.4 — 163 words</summary>

```text
The three engagement levels in Section 5.5 change the **depth of the intelligence**, not the volume
of Firefly's output: how often the presence audit is refreshed, how many wards carry reach reporting,
how often creative is tested, and how far the team upskilling goes. They do
not change the list above, they never move a workstream from one owner to another, and they never
change Workstream 4 — accessibility applies in full at every level and is not a line to trade away
(Section 5.5.1).

**Firefly recommends Level 2 (Standard).** Level 1 instruments only the twelve decisive wards and
leaves the recognition deficit measured at county level, which is the one place this campaign cannot
afford to be blind. Level 3 refreshes the analysis faster than a nomination sprint can act on it.
Standard is the level at which all 40 wards carry both reach reporting and an active SMS and USSD
layer — and reaching the arid belt is the whole argument.
```
</details>

<details><summary>6.3.1 — 23 words</summary>

```text
**Prepared by:**
Firefly Management
Strategic Communications & Digital Campaign Consultancy
6th Floor, Next Gen Mall, Mombasa Road, Nairobi
fireflymanagement.ke@gmail.com · 0726 766 800
```
</details>

<details><summary>F.2 — 78 words</summary>

```text
**Prepared for:** Hon. Dr. Benson Makali Mulu, PhD (Economics), CBS — Member of Parliament, Kitui
Central; Gubernatorial Aspirant, Kitui County. Personally, and not for any party organ.

**Prepared by:** Firefly Management, Strategic Communications & Digital Campaign Consultancy.

**Status:** Proposal for discussion.

**Confidential.** Submitted in confidence for the purpose of evaluating this engagement, and not to
be circulated beyond Dr. Mulu and those he authorises. Section F.1 states the full terms; Section
1.4 explains how the document is organised.
```
</details>

<details><summary>None — 54 words</summary>

```text
Model deployment is gated. If the Section 5.7.9 review does not clear
voter-file-based processing, the campaign operates the model on **first-party
consented data and aggregate ward-level statistics only** — a materially
weaker but fully lawful fallback that is planned into all three engagement
levels. The campaign is not exposed if the answer is no.
```
</details>

### Heading lines dropped (text kept unless listed under Cuts)

| Old heading | Why |
|---|---|
| 5.2.1 Platforms and content | group heading dissolves; its purpose line moves into each workstream banner |
| 5.2.2 Publishing and earned media | group heading dissolves; its purpose line moves into each workstream banner |
| 5.2.3 Ground and offline reach | group heading dissolves; its purpose line moves into each workstream banner |
| 5.2.4 Data and technology | group heading dissolves; its purpose line moves into each workstream banner |
| 5.1.4 How the levels change what runs | Removed: Repeats 5.5.1 and 5.5.2 (the Level 2 recommendation appears three times); canonical home is 1.5.1 |
| 2.7.1 Who owns the Kamba-language stations, and who they favour | Removed: Defers to the table in old 5.2.2.2 and restates the three structural facts; kept as one short paragraph plus the research-integrity note |
| 3.10.1 Segment sizes the record does not publish | Merged: Folded in as its closing paragraph |
| 4.4.3 Persuasion principles and message discipline | Removed: Empty heading directly above 4.4.4; the two merge |
| 4.4.7 Language, register and dialect | Merged: Language section starts here |
| 4.4.8 Which language reaches which voters, on which channel | Merged: Same language map as 4.4.11 at a different level of detail |
| 4.5 What gets published | Merged: Intro of production pillars moves to 3.2.3; weekly pattern stays here |
| 5.4.5 Coalition and endorsement sequencing | Removed: Empty heading directly above 5.4.6 |
| 5.1.5 Scope summary and workstream boundaries | Removed: Empty heading |
| 5.6.3 Indicators, and why these | Removed: Empty heading; its orphan paragraph is moved to open 5.2.6 |
| 5.3.3 What is measured | Removed: Thirty-word intro that sits out of order after 5.3.1; becomes the section purpose line |
| 5.7.4 Data ethics, privacy and the data charter | Removed: Empty heading; "5.3 Data protection, ethics and compliance" replaces it |
| 6.2 Open items | Split: ODPC action box to 5.3.6; assumptions to 1.8; heading itself removed |
| 5.8.4 The digital war room | Removed: Empty heading above 5.8.5 |
| 5.8.6 Cybersecurity and manipulated media | Removed: Empty heading above 5.8.7 |
| 5.8.8 Competitor monitoring | Removed: Empty heading above 5.8.9 |
| F.2 Who this is for, and on what terms | Merged: Restates the cover; reduced to a pointer |

### Passages moved apart from their heading

| From | Fragment | Words | Opens with |
|---|---|---|---|
| 3.7.3 | lead-in-3.8 | 24 | What digital reach can and cannot deliver against the winning number, the infrastructure t |
| 4.1.4 | pillar-cross-list | 78 | Four pillars, extended from the original three. **These four are the campaign's pillars.** |
| 4.3 | universe-table | 344 | The six segments below describe **who** the voters are. This table describes **what the ca |
| 4.5 | production-pillar-intro | 127 | *"The mission is for Kitui to prosper. From Poverty to Wealth Creation."* That line is alr |
| 5.2.1.4 | ws4-language-block | 199 | Language is central to trust in Kitui. |
| 5.2.4.3 | ws13-reference-intro | 83 | A data-driven political campaign requires robust, reliable, and compliant technical infras |
| 5.4 | target-ladder | 403 | ```figure |
| 5.6.4 | audit-two-part-intro | 53 | Political strategy without empirical measurement risks misallocating scarce campaign effor |
| The Firefly proposition | annex-d-pointer | 38 | --- |
| 5.7.9 | risks-intro | 37 | What can go wrong and what happens when it does: rapid response, the war room that runs it |
| 5.8.14 | staffing-opening | 97 | Dr. Mulu already has a team that publishes every day. This section is about how three more |
| 6.2 | odpc-action-box | 264 | > [!WARNING] |

### Conflict markers placed

| Conflict | Old location | Anchor |
|---|---|---|
| C1 | 5.2.1.4 | `/ **Kikamba** / **50%** /` |
| C1 | 4.4.8 | `id: language-map` |
| C1 | 4.4.11 | `id: language-deployment` |
| C1 | 4.5.5 | `are checked in the Monday review.` |
| C2 | 4.4.8 | `id: language-map` |
| C2 | The SMS layer | ``[VERIFY whether in force]`` |
| C3 | 5.1.1 | `Dr. Mulu already holds.` |
| C3 | 5.5.4 | `and boundaries stated so that what is outside them` |
| C4 | 5.1.3 | `Firefly operates end to end.` |
| C4 | 5.1.6 | `within **2 hours** during peak periods.` |
| C4 | 5.9.3 | `campaign has.` |
| C5 | What it is | `road, a market without sanitation, a stalled project.` |
| C5 | 5. Public Service-Delivery Tracker (Section 5.2.4 Digital Charter Platform) | `Displays verifiable records of 13 years` |
| C5 | 5.6.6 | `**Governor's Day-One Public Delivery Dashboard**.` |
| C6 | Stage One: the Wiper nomination | `but it is the campaign's policy call.**` |
| C6 | Message Pillar 3: Devolution Equity, Universal Water Access & Healthcare *(carries campaign pillars 1 and 2, Section 4.1.5)* | `Million per ward annually` |
| C6 | The four content pillars | `Ward Equalization Fund, solar water within 1 km` |
| C6 | B. Direct 2G Bulk SMS Copy Sample (Ward-Specific) | `Reply STOP to opt out.` |
| C6 | Pre-drafted response lines | `methodology-first allocation formula` |
| C7 | 2.7.1 | `These are the placement targets.` |
| C7 | Kikamba Vernacular Radio (The Decisive Broadcast Medium) | `so it ranks the stations rather than sizing Kitui's audience` |
| C7 | 4.3.2 | `**Primary:** Kamba Vernacular Radio` |
| C7 | The radio problem, stated plainly | `/ **KBC Mwatu FM** /` |
| C7 | 5.8.2 | `**Broadcast Vernacular Radio Triage` |
| C8 | 2.1 | `**Turnout, 2022:**` |
| C8 | 3.1 | `total ballots cast equal approximately` |
| C8 | 4.3 | `/ Expected turnout universe /` |

### Pointers and purpose lines written

| Where | Text |
|---|---|
| 4.5.12 | The compliance gate, and the fallback the model runs on until it clears, are set out in 5.3.4. |
| decision.md opening | The decision first: what is being asked, what Dr. Mulu receives and at which level, who does what, and what the campaign must decide or provide. |
| 1.4.3 (pointer for removed 5.1.4) | How the three engagement levels change what runs, and the Level 2 recommendation, are set out once, in 1.5.1. |
| 1.9 | The indicators themselves are set out in 5.1. |
| delivery.md opening | How the engagement is run, when and by whom: the weekly operating rhythm, the first weeks, the phases to August 2027 and the coalition calendar. |
| 4.5 (old 5.1.6 and 5.1.7) | The two scope lists below stay together, rather than being split across the workstreams that deliver them, until conflict C4 is settled. |
| 4.5.2 | The four content pillars are now in 3.2.3, with the other production pillars. Formats by channel and the radio, SMS and USSD copy samples are in Annex G.2. |
| 4.5.4 | The languages this standard works in, and the content mix for locally facing platforms, are set out in 3.6.1. |
| 4.5.5 | The platform-by-platform playbooks (Facebook, X, WhatsApp, TikTok, Instagram, YouTube and Google Ads) are in Annex G.1. |
| 4.5.10 | The volunteer programme reference (tiers, gamification, tooling and KPIs) is in Annex G.3. |
| 4.5.11 | The Data Protection Act obligations this layer works under, and its mandatory compliance safeguards, are set out with the rest of compliance in 5.3.2. |
| 4.5.12 | The data sources the model draws on are listed in Annex G.5. |
| 4.5.12 | The model's variable dictionary is in Annex G.5. |
| 4.5.13 | The reference architecture the campaign owns (component by component, the procurement matrix and the technical security protocols) is in Annex G.4. |
| staffing.md opening | Who does the work: the Firefly core, the surge roles activated by phase and level, and how the existing team is assessed and upskilled. |
| measurement.md opening | How progress is measured, how the Week 1 presence audit is run, and how the work is kept lawful. |
| 6.4 | Analysis of the rivals themselves is in 2.6.4; the tools and outputs are in Annex E.4 and E.12. |
| B.5 | The field itself is analysed in 2.6; each line below records the documents a rival's attributes rest on. |
| Annex F (pointer for F.2) | Who this proposal is for, who prepared it, and its status are stated once, on the cover. |
| annex-spec.md opening | ANNEX G. Channel and technical specifications: the platform playbooks, formats and copy samples, the volunteer programme reference, the technology reference architecture, and the voter model's data sources and variables. Reference the main text points to, not argues from. |
| 4.3 | Phase −1 and Phase 0 are set out in 4.2. |

### Preview section 5 shorthand not adopted

Each of these headings has a single old heading behind it, so it keeps that heading's title (rule 2). Preview section 7.4, the rename register, lists none of them.

| New ref | Preview section 5 reads | Heading as built (the old title) |
|---|---|---|
| 1.4.1 | How the engagement runs in three steps | How this proposal is built |
| 1.5 | What Dr. Mulu receives, and at which level | What Dr. Mulu receives, and how often |
| 1.6 | What this proposal commits to, and what it does not | What this proposal commits to |
| 1.7 | What the campaign must provide | What this needs from the campaign |
| 1.8 | What this proposal rests on | Assumptions this proposal rests on |
| 2.6.1 / 2.6.2 | Stage one / Stage two … | Stage One / Stage Two … |
| 2.7.1 | The deficit pool | Where he has held office, and where he has not |
| 2.8.1 | People and economy | The county's people and economy |
| 2.9.1 | Connectivity | How people get information |
| 2.9.3 | The digital ceiling: what digital can and cannot do | What each channel can physically reach |
| 2.9.4 | The offline majority and the infrastructure that reaches it | The offline majority, and the infrastructure that reaches it |
| 2.10.1 | His public record | Dr. Mulu's public record |
| 3.2.2 | Message pillars and their proof points | The central claim and its three pillars |
| 3.3.1 | The weighting, and the finding it answers | Where the effort goes (the old run-in "The weighting, and the finding it answers" sits directly beneath it) |
| 3.5 | What we say: claims, counter-messaging and framing | What we say, and in which language |
| 4.2.1 | Week-by-week plan and KPIs | The first four weeks |
| 4.2.2 | Phase 0: instrumentation | Phase 0: Instrumentation — Weeks 4–10 from signature |
| 4.3.2 to 4.3.4 | Phase n titles without dates | Phase n titles with their date ranges |
| 5.1.2 | Recognition and persuasion where he is least known | Re-anchored: recognition and persuasion where he is least known |
| 5.3.1 | The standard we hold ourselves to, and who is controller | The standard we hold ourselves to |
| 6.1 | The six risks that decide whether the plan survives | Risks and responses |
| 6.2.4 | … dashboard | … dashboard view |
| 6.5 | If the nomination becomes a delegate primary | If it becomes a delegate primary |

## Stage 3: navigation, loader and anchors

### Navigation and loader

| File | Change |
|---|---|
| `lib/heading-slug.ts` | `SECTIONS`: 19 routes in the new order (cover, decision, evidence, strategy, delivery, the four workstream routes, staffing, measurement, risks, Annexes A to G). Part numbers 1 to 6 plus annexes; labels and blurbs from preview section 5 (the blurb is the question each part answers). The four workstream routes carry number 4.5, replacing the letters 5A to 5D, and are told apart by labels that already differ from their first word ("Platforms & content", "Publishing & earned media", "Ground & offline reach", "Data & technology"), so they cannot truncate to identical prefixes in the mobile dock. 5E had no single successor and is gone. `PARTS`: the six parts plus the annexes. Annex F's blurb drops "who this was prepared for" (F.2 is now a pointer to the cover). The comment above `SECTIONS` describes the new order. |
| `lib/content-files.ts` | `CONTENT_FILES` names the 19 new files. |
| `lib/flow.ts` | `FLOW_ORDER` in the new reading order. `FLOW_ACTS`: seven acts, one per part plus the annexes, so the seven numerals and seven portraits the chrome assumes still line up. |
| `components/MobileTOCModal.tsx` | Icons for the new routes; the argument rail shows six parts, not five. |
| `lib/register/specs/s0-cover.ts` | The cover's "shape of the argument" figure (`fig-cover-spine`) is the document's own table of contents, so its steps, links, title, takeaway and rows now describe the six new parts, using preview section 5's part titles and questions. Its old links (`/objectives`, `/data`, `/analysis`, `/implementation`) would have pointed at retired routes. |
| `lib/register/specs/_util.ts` | `secHref` resolves a section number to its new route: Part 4 splits across `delivery`, the four workstream files (by workstream number) and `staffing`; letters A to G go to the annex routes. |
| `components/MarkdownViewer.tsx`, `components/ClientPage.tsx`, `components/markdown/ObjectivesIndex.tsx`, `lib/highlight-patterns.ts`, `app/[[...slug]]/page.tsx` | Tab ids follow the text they test for: `data`/`analysis` → `evidence` (table renderers, governing-reality list items, the scrollytelling Story), `nextsteps` → `decision` (the decision panel, which now closes Part 1, and the closing-section rule), `delivery` → `risks` for the deepfake banner line, and `delivery` → `measurement` for the KPI index's self-exclusion. The two portrait kickers carry the new numbers (§2.10.1, §4.1). |
| `lib/collapse-groups.ts` | `1.1`, the ask, joins `NEVER_COLLAPSE`. The rule that the ask is never folded was tied to the document's last section; the ask is now first. (`9.2` was already a stale number at the baseline and is left alone; see OPEN-ITEMS.md.) |
| `scripts/check-copy.ts` | The engagement-money gate now applies to `decision`, `strategy`, `delivery`, the four workstream files, `staffing`, `measurement`, `risks`, `annex-spec` and `cover`. Part 2 (`evidence`) is exempt, as `data` and `analysis` were, because it carries the county's money. The gate passes. |
| `next.config.ts` | The five retired routes and their markdown redirect (307, temporary, so a rollback is not fought by cached redirects): `/objectives` and `/implementation` and `/nextsteps` → `/decision`; `/data` and `/analysis` → `/evidence`. |
| `components/ClientPage.tsx` | A legacy fragment that arrives on a single-section route but names text now on another route is handed to the whole document (`/#id`), as `navigateToSection` already did for in-page links. Without this, `/delivery#delivery-sec-5-6` (now `measurement-sec-5-1`) would land on nothing. |
| `public/content/` | Regenerated by `npm run content`. The five retired files are deleted, because `scripts/content-routes.mjs` treats every file there as a route. |
| `data/section-heights.json` | Re-measured at 390 px against a production build. Two runs agree to within 2%; the second is checked in. `scripts/measure-section-heights.mjs` used to wait for a fixed 1,400 px placeholder that the site no longer uses, so it reported a section's previous reservation as a fresh measurement. It now switches content visibility off while measuring and walks until two passes agree. |
| `data/duplicates.json` | Empty, with a note. Both declared repetitions now sit inside one chapter, and the detector leaves those to the Brief fold; the Level 2 duplicate was cut. `find-duplicates --check` passes. |
| `data/section-visuals.generated.json` | Regenerated (38 → 34 derived visuals). The derivation reads each heading's own prose, so merged and promoted headings derive differently. Gained: G.5, 1.4.2, 2.6.1, 2.6.2, 2.7.1. Lost: 1.2, 2.6, 2.7, 3.4.2, 4.5, 4.5.1, 4.5.11. Changed kind: 3.2.3. `visual-coverage --check` passes. |

### Anchors

- `scripts/restructure-2026-10/build-moves.py` writes `lib/anchors/restructure-2026-10.json`: each of the 205 ids live at the baseline goes to the heading that now holds its text (the mapping row's new ref; a run-in to its parent, a merge to its target, a removal to its canonical home). Each of the 1,369 older redirect keys goes wherever its old target now goes, so a link that worked yesterday lands on the same text today.
- `scripts/build-anchors.ts` reads that file ahead of every older move, adds its keys to the set of old ids, and fails the build if any of them lands anywhere other than where the file says. Result: **176 live headings, 1,546 redirects, 0 orphans, 0 misdirected.**
- Two special targets: F.2 → `annex-terms-sec-f-1` (F.2 merged into the cover, which has no numbered heading; F.1 carries the pointer to the cover), and 6.2 (split) → `measurement-sec-5-3-6` (its own text, the ODPC box; 6.2.1 has its own row → 1.8).
- **Two collisions.** Two ancient ids, from earlier route sets, now spell new live headings: `evidence-sec-2-4` (an old "evidence" route, last redirecting to `strategy-sec-3-4-2`) and `strategy-sec-3-7` (last redirecting to `workstreams-platforms-sec-4-5-4`). A live id always wins (`resolveLegacySectionId` checks live ids first, and a link minted today must work), so these two old links now open the new 2.4 and 3.7. Recorded in OPEN-ITEMS.md.

### Re-keyed ids (`scripts/restructure-2026-10/update-keys.py`)

Two placements are judgement calls:

- The two mount sets that sat under old 2.1 and old 3.1 both now key to `evidence-sec-2-1`, so they are merged under one key in old reading order (ward cartogram, path to 200k, constituency weight, then the vote funnel and register comparison).
- The workstream 1 tracker visual (`PublicServiceDeliveryTracker`) was keyed to the old platforms group heading, the line directly above workstream 1. It goes to 4.5.1, beside the workstream it draws, not to the 4.5 overview the group heading merged into.

One section-visual override is dropped. Old 4.3.3 ("no figure") is now a run-in inside 3.4.2 and carries no visual of its own; mapping the override onto 3.4.2 would have suppressed 3.4.2's own visual.

Register figure `section` fields are set to the heading each figure now sits under. The objectives figure's finding, serves and measure links are renumbered through the mapping. In `fig-1-3-objectives`, objective 1.3.4's old "serves 4.5" becomes 3.7, the merge target the mapping names.

### Checks at the end of Stage 3

`npm run lint` clean; `npx tsc --noEmit` clean; `npm run verify` passes every guard (stale content, open items, CSVs, figures, copy, section visuals, ward register, analysis exports, figure verification, 92 figure fences, duplicates, 39 mount points, anchors, visual coverage, 35 of 35 figure tests); `npm run build` passes (27 static pages). A local production server serves the 19 sections in the new order, and `/analysis` answers 307 → `/evidence`.

| Change |
|---|
| HEADING_INSERTS delivery-sec-5-6 -> measurement-sec-5-1 |
| HEADING_INSERTS data-sec-2-3 -> evidence-sec-2-5 |
| HEADING_INSERTS strategy-sec-4-1 -> strategy-sec-3-1 |
| HEADING_INSERTS data-sec-2-8 -> evidence-sec-2-10-1 |
| HEADING_INSERTS data-sec-2-1 -> evidence-sec-2-1 |
| HEADING_INSERTS data-sec-2-5 -> evidence-sec-2-8-2 |
| HEADING_INSERTS data-sec-2-4 -> evidence-sec-2-8-1 |
| HEADING_INSERTS data-sec-2-2 -> evidence-sec-2-2 |
| HEADING_INSERTS analysis-sec-3-1 -> evidence-sec-2-1 |
| HEADING_INSERTS analysis-sec-3-2 -> evidence-sec-2-3 |
| HEADING_INSERTS analysis-sec-3-3 -> evidence-sec-2-4 |
| HEADING_INSERTS analysis-sec-3-4 -> evidence-sec-2-7 |
| HEADING_INSERTS strategy-sec-4-3-1 -> strategy-sec-3-4-2 |
| HEADING_INSERTS analysis-sec-3-8 -> evidence-sec-2-9-3 |
| HEADING_INSERTS data-sec-2-6 -> evidence-sec-2-9-1 |
| HEADING_INSERTS strategy-sec-4-4-1 -> strategy-sec-3-2-2 |
| HEADING_INSERTS strategy-sec-4-4 -> strategy-sec-3-5 |
| HEADING_INSERTS delivery-sec-5-8-1 -> risks-sec-6-2-1 |
| HEADING_INSERTS data-sec-2-7-1 -> evidence-sec-2-9-2 |
| HEADING_INSERTS delivery-sec-5-7 -> delivery-sec-4-1 |
| HEADING_INSERTS strategy-sec-4-1-4 -> strategy-sec-3-2-1 |
| HEADING_INSERTS analysis-sec-3-7 -> evidence-sec-2-8-3 |
| HEADING_INSERTS workstreams-data-sec-5-2-4-4 -> workstreams-data-sec-4-5-14 |
| HEADING_INSERTS delivery-sec-5-5-1 -> decision-sec-1-5-1 |
| HEADING_INSERTS delivery-sec-5-5-2 -> decision-sec-1-5-2 |
| HEADING_INSERTS workstreams-ground-sec-5-2-3-1 -> workstreams-ground-sec-4-5-7 |
| HEADING_INSERTS workstreams-ground-sec-5-2-3-2 -> workstreams-ground-sec-4-5-8 |
| HEADING_INSERTS workstreams-ground-sec-5-2-3-3 -> workstreams-ground-sec-4-5-9 |
| HEADING_INSERTS strategy-sec-4-4-3 -> strategy-sec-3-5-2 |
| HEADING_INSERTS delivery-sec-5-7-4 -> measurement-sec-5-3 |
| HEADING_INSERTS workstreams-media-sec-5-2-2-1 -> workstreams-media-sec-4-5-5 |
| HEADING_INSERTS workstreams-media-sec-5-2-2-2 -> workstreams-media-sec-4-5-6 |
| HEADING_INSERTS strategy-sec-4-1-6 -> strategy-sec-3-2-4 |
| HEADING_INSERTS workstreams-platforms-sec-5-2-1 -> workstreams-platforms-sec-4-5-1 |
| HEADING_INSERTS delivery-sec-5-4 -> delivery-sec-4-3 |
| HEADING_INSERTS delivery-sec-5-7-1 -> delivery-sec-4-1-1 |
| section-visual override delivery-sec-5-3-2 -> measurement-sec-5-2-2 |
| section-visual override strategy-sec-4-8 -> strategy-sec-3-8 |
| section-visual override strategy-sec-4-4-9 -> strategy-sec-3-6-2 |
| section-visual override workstreams-platforms-sec-5-2-1-2 -> workstreams-platforms-sec-4-5-2 |
| section-visual override workstreams-platforms-sec-5-2-1-4 -> workstreams-platforms-sec-4-5-4 |
| section-visual override delivery-sec-5-7-8 -> measurement-sec-5-3-3 |
| section-visual override delivery-sec-5-9-6 -> staffing-sec-4-6-6 |
| section-visual override strategy-sec-4-6-1 -> strategy-sec-3-3-3 |
| section-visual override strategy-sec-4-3-3 dropped: the heading is now a run-in inside 3.4.2 (run-in) and carries no visual of its own |
| section-visual override delivery-sec-5-3-7 -> delivery-sec-4-2-2 |
| s1-objectives.ts fig-1-1-timeline: section 1.1–1.2 -> 1.2 |
| s1-objectives.ts fig-1-4-flow: section 1.4 -> 1.4.1 |
| s1-objectives.ts fig-1-5-scorecard: section 1.5 -> 1.9 |
| s1-objectives.ts finding: 3.4 -> 2.7 |
| s1-objectives.ts measure: 5.6.1 -> 5.1.1 |
| s1-objectives.ts serves: 4.2 -> 3.3.1 |
| s1-objectives.ts finding: 3.5 -> 2.6 |
| s1-objectives.ts measure: 5.6.4 -> 5.1.2 |
| s1-objectives.ts serves: 4.1 -> 3.1 |
| s1-objectives.ts finding: 3.8 -> 2.9.3 |
| s1-objectives.ts measure: 5.6.1 -> 5.1.1 |
| s1-objectives.ts serves: 4.6 -> 3.3.2 |
| s1-objectives.ts finding: 3.2 -> 2.3 |
| s1-objectives.ts measure: 5.6.4 -> 5.1.2 |
| s1-objectives.ts serves: 4.5 -> 3.7 |
| s1-objectives.ts finding: 3.6 -> 2.7.2 |
| s1-objectives.ts measure: 5.5.3 -> 1.5.3 |
| s1-objectives.ts serves: 4.2 -> 3.3.1 |
| s2-data.ts fig-2-3-nomination: section 2.3 -> 2.5 |
| s2-data.ts fig-2-4-people: section 2.4 -> 2.8.1 |
| s2-data.ts fig-2-5-budget: section 2.5 -> 2.8.2 |
| s2-data.ts fig-2-6-connectivity: section 2.6 -> 2.9.1 |
| s2-data.ts fig-2-7-media: section 2.7 -> 2.9.2 |
| s2-data.ts fig-2-8-record: section 2.8 -> 2.10.1 |
| s2-data.ts fig-2-9-channels: section 2.9 -> 2.10.2 |
| s3-analysis.ts fig-3-1-funnel: section 3.1 -> 2.1 |
| s3-analysis.ts fig-3-2-register-map: section 3.2 -> 2.3 |
| s3-analysis.ts fig-3-3-paths: section 3.3 -> 2.4 |
| s3-analysis.ts fig-3-4-footprint: section 3.4 -> 2.7.1 |
| s3-analysis.ts fig-3-5-field: section 3.5 -> 2.6 |
| s3-analysis.ts fig-3-6-party-flow: section 3.6 -> 2.7.2 |
| s3-analysis.ts fig-3-7-zones: section 3.7 -> 2.8.3 |
| s3-analysis.ts fig-3-8-ceiling: section 3.8 -> 2.9.3 |
| s3-analysis.ts fig-3-9-audit: section 3.9 -> 2.10.3 |
| s3-analysis.ts fig-3-10-gaps: section 3.10 -> 2.11 |
| s3-analysis.ts fig-3-11-evidence: section 3.11 -> 2.12 |
| s4-strategy.ts fig-4-1-message-house: section 4.1 -> 3.2.1 |
| s4-strategy.ts fig-4-2-effort: section 4.2 -> 3.3.1 |
| s4-strategy.ts fig-4-3-segments: section 4.3 -> 3.4.3 |
| s4-strategy.ts fig-4-4-message-region: section 4.4 -> 3.5 |
| s4-strategy.ts fig-4-5-calendar: section 4.5 -> 3.7 |
| s4-strategy.ts fig-4-6-channel-shift: section 4.6 -> 3.3.2 |
| s4-strategy.ts fig-4-7-profile-fixes: section 4.7 -> 4.2.3 |
| s4-strategy.ts fig-4-8-decision-rules: section 4.8 -> 3.8 |
| s5-implementation.ts fig-5-1-workstreams: section 5.1 -> 1.4.2 |
| s5-implementation.ts fig-5-2-workstream-panels: section 5.2 -> 4.5 |
| s5-implementation.ts fig-5-3-four-weeks: section 5.3 -> 4.2.1 |
| s5-implementation.ts fig-5-4-phases: section 5.4 -> 4.3 |
| s5-implementation.ts fig-5-4-ladder: section 5.4 -> 4.3.1 |
| s5-implementation.ts fig-5-5-cadence: section 5.5 -> 1.5.2 |
| s5-implementation.ts fig-5-6-kpis: section 5.6 -> 5.1 |
| s5-implementation.ts fig-5-7-approval: section 5.7 -> 4.1.3 |
| s5-implementation.ts fig-5-8-risk: section 5.8 -> 6.1 |
| s5-implementation.ts fig-5-9-team: section 5.9 -> 4.6 |
| s5-workstreams.ts fig-5-2-1-report-flow: section 5.2.1.1 -> 4.5.1 |
| s5-workstreams.ts fig-5-2-3-field-loop: section 5.2.3.2 -> 4.5.8 |
| s5-workstreams.ts fig-5-2-3-ussd-menu: section 5.2.3.3 -> 4.5.9 |
| s5-workstreams.ts fig-5-2-4-stack: section 5.2.4.3 -> G.4 |
| s6-nextsteps.ts fig-6-1-dependencies: section 6.1 -> 1.7 |
| s6-nextsteps.ts fig-6-3-decision: section 6.3 -> 1.1 |

## Stage 4: cross-references

`scripts/renumber-citations.ts` rewrites every citation from the old numbers to the new, from `mapping.json`: a run-in goes to its parent, a merge to its target, a removal to its canonical home.

### Result

| | Count |
|---|---|
| Citations rewritten in `content/` | **400** to **103** distinct targets (the brief expected about 407 to 116). By form: section 366, table cell 26, bare 6, parenthesis 2 |
| Citations rewritten in code (figure captions and notes, data-module strings, component copy, and comments in `lib/figures` and `lib/register/specs`) | **524** |
| Marked `[CHECK REF]` | 11 in content, 88 in code (OPEN-ITEMS.md section 2) |
| Second run | Changes nothing (`--check` passes) |

Every change is a row in `citations.csv` (file, line, form, before, after, note).

### How it stays idempotent

Old and new numbers overlap (old 3.1 is new 2.1, and new 3.1 is the position), so renumbering content in place twice would move a citation twice. The script therefore always derives `content/` from the baseline: it regenerates the layout into a scratch directory (`build-layout.py --out=`) and renumbers from there. For code it rewrites each baseline line that carries a citation, and applies the result only where that exact line still stands. Two lines had been edited in Stage 3 and are reported, not overwritten: the cover spine takeaway, rewritten for the new parts, and a `MarkdownViewer.tsx` comment about the decision panel.

### Rules

- **Forms:** "Section(s) N.N" with lists, ranges and line breaks; "§N.N"; "Section N" (a part); "Annex X.n"; a parenthesis holding only section numbers; a table cell that opens with section numbers (the "Where it is set" columns in 1.5.1 and 1.5.3, and the 3.4.2 segment table); and a bare three-level number in prose ("4.4.1 above"). Heading numbers, `{{tokens}}`, figure fences, conflict markers and the layout's own pointers are never touched.
- **Parts:** old 1 → 1, 2 → 2, 3 → 2, 4 → 3, 6 → 1. Old Part 5 split across new Parts 1, 4, 5 and 6, so a bare "Section 5" is flagged.
- **Given by the brief:** "the phasing in Section 1.5" (old 2.3.1, now 2.5.1; also `data/nomination-path.ts`) → Section 4.3, the phases. "Section 1.2" in the same passage maps to the new 1.2 mechanically.
- **Flagged, not guessed** (preview 3.3 rows 1 to 9 and brief §5): "Section 3.3.3" and "SMS/USSD (Section 4.3)" in old 3.7.3; "(Section 4.3)" in workstream 1's Build; "(16.4)"; "Defamation Law Safeguards (Section A.1.1)"; "Section 5.2.1.4 of the DPA"; "Section 5.2.3.4" twice as the DPA; "Section 5.2.4 Digital Charter Platform"; "Sections 4.4.11 and 5.7.4 for the regulatory basis". Any number with no heading at the baseline is flagged the same way.
- **Text versions:** citations inside text versions are renumbered like any other. Renumbering is the one prose change the brief permits, and the conservation check compares text versions with citation numbers masked.
- **Comments outside `lib/figures` and `lib/register/specs`** are not renumbered: they record history in the numbers of their own time. Strings in those files that a reader sees are renumbered. `data/*.ts` changes are section-reference strings only (method and source notes); no value changes, and each is a row in `citations.csv`.

### Knock-on change

`lib/highlight-patterns.ts`: the in-text cross-reference linker no longer links a citation followed by `[CHECK REF]`. That number was wrong before it moved, and linking it would send a reader to whatever carries it now.

### Checks at the end of Stage 4

Lint and typecheck clean; `npm run verify` passes, including `verify-figures`, which caught a component note still citing §3.11; the conservation check passes (92 figures, 5 text versions, 621 tokens, words reconcile to 0); `heading-inventory --strict` passes.
