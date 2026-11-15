# Site flow: audit and implementation plan (November 2026)

> **What this is.** A complete audit of the site's flow and a step-by-step plan to rebuild it as one
> continuous story: **Welcome → Data → Analysis → Objectives → Strategies → Implementation**. It is
> written so a Claude Code session can carry it out work package by work package.
>
> **Source of the audit.** The repository at commit `333afa8` (PR #87). The live site
> (`https://dr-makali-digital-campaign.vercel.app/`) could not be fetched from the audit
> environment, so runtime states are inferred from code (see §11).
>
> **Owner.** Firefly Management. Built for Hon. Dr. Makali Mulu (first reader) and his campaign team
> (daily users, high-end phones; performance is not a constraint).

---

## Contents

0. How to use this document (read first)
1. Fixed decisions
2. Verdict
3. Current-state inventory
4. Flow problems, ranked, with evidence
5. Target flow map
6. Section-by-section specification
7. Dual-user navigation plan
8. Work packages (prioritised; top 5 marked ★)
9. Technical guardrails for every change
10. Open decisions for Firefly
11. Self-check, limits and assumptions
- Appendix A: every tool, current home → new home
- Appendix B: records, charts, visuals, countdowns, feed: current home → new home
- Appendix C: heading id moves (for the anchors file)
- Appendix D: commands

---

## 0. How to use this document (read first)

**For a Claude Code session working from this plan:**

1. Read `AGENTS.md` first. It requires deterministic, verifiable edits, full (unabridged)
   implementations, no placeholder stubs and no unsolicited features.
2. Do **one work package (WP) per branch and pull request**, in the order given in §8. The top five (★)
   come first. Every WP lists its files, its steps, its acceptance criteria and the checks to run.
3. Before editing, re-read the files a WP names. Line numbers in this document are as of `333afa8` and
   may have drifted. Search for the quoted code instead of trusting the number.
4. Follow §9 (guardrails) on every WP. The build fails loudly when a heading id is lost
   (`scripts/build-anchors.ts --check`), when an embed points at a missing heading
   (`scripts/verify-mounts.mjs`), or when content changes without a ledger entry (`npm run check:content`).
5. Anything marked **(new)** is a new idea, not something the site has today. Build it only if the WP
   says to.
6. Anything in §10 needs Firefly's decision. Do not guess wording for those items. Ask.
7. Do not commit to `main`. Do not open a pull request unless asked.

**Shorthand used below.** Stages: **W** Welcome · **D** Data · **A** Analysis · **O** Objectives ·
**S** Strategies · **I** Implementation · **U** Utility (sits after the story). Users: **M** Dr. Mulu ·
**T** team · **B** both. A heading id has the form `<chapter>-sec-<number>`, for example
`votes-sec-2-5`. The number is hidden on screen (`displayTitle` in `lib/heading-slug.ts`) but stays in
the id.

---

## 1. Fixed decisions

Respect all of these. Challenge one only with strong evidence, and explain why.

| # | Decision | What it means in this codebase |
|---|---|---|
| D1 | One continuous scrolling story: Welcome (Firefly's voice: what was built, its features, uses, benefits, how to use it) → Data → Analysis → Objectives → Strategies → Implementation | `SECTIONS` order in `lib/heading-slug.ts` is the flow order (`FLOW_ORDER` in `lib/flow.ts`). Part openers come from `FLOW_ACTS` |
| D2 | Interactive features (explore data, dashboards, tools, strategies, implementation, workspace, changes) live **inside** the story where each belongs, not in a separate platform section | Embeds are keyed to heading ids in `lib/story/embeds.ts` and `lib/tools/meta.ts` (`home`) |
| D3 | Everything is public to view. A login is needed only to edit | `PLATFORM_TEAM_LOGIN`; `useLive().signedIn` gates Add/Edit |
| D4 | No document-style section numbering | Numbers stay in ids only; never shown. In-prose "Section 2.5" renders as the heading's name (`SectionNumberMap.tsx`) |
| D5 | No current 2027 rival candidates. Past election results may stay | `docs/rivals-2026-11/DECISION.md` |
| D6 | A single general-election lens | See §4 problem P3 and WP5 |
| D7 | No text is removed unless a visual takes over its job | Every removal or move needs a ledger entry (§9) |

**The plan challenges none of these.** One placement needs a judgement call: Firefly's commercial close
("What you get and what you provide", "The ask") has no slot in D1's six stages. The plan puts it at the
end of Implementation, because the agreed order ends there and the site's first purpose (make
Firefly's case to Dr. Mulu without a meeting) needs a close. See §10, Q1.

---

## 2. Verdict

The parts of a good flow are already built: 36 tools, 10 live team records, 7 live team charts and a
change feed, each attached to a heading in the story. But the site still tells two stories that
contradict each other. The frame is still a proposal: the cover title "Analysis, Strategy and
Direction", a route map headed "6 questions, then one decision", shelves labelled "After the
proposal", a part named "The decision", and a footer that says "Status: Proposal for discussion…
please do not circulate". The Welcome, in Firefly's voice, says the opposite: "Firefly built this
platform." The Welcome is also the third block on the page, after the cover, four big numbers, the route
map and a county map. Below that, the nine parts don't match the six agreed stages. Objectives have no
part of their own, and the strongest analysis on the site is folded inside the "How Kitui voted" data
chapter. The goal still runs on two deadlines (the Wiper nomination and the general election). The
team's daily tools are split across seven chapters and the reference shelf at the very bottom. The fix is
mostly reordering and relabelling, not new building. Most moves are configuration in `lib/flow.ts`,
`lib/heading-slug.ts`, `lib/story/embeds.ts` and `lib/tools/meta.ts`.

---

## 3. Current-state inventory

### 3.1 How the page is assembled

| Layer | Where | Notes |
|---|---|---|
| Routes | `app/[[...slug]]/page.tsx` serves `/` (streamed flow), `/<chapter>` for each chapter, and `/full` (everything, for print and no-JS) | `PRERENDERED = 1`: only the first chapter is in the HTML |
| Chapter order and labels | `SECTIONS` in `lib/heading-slug.ts:46-73` | `part` groups chapters; `number` feeds in-prose "Section N" references |
| Parts (openers) | `FLOW_ACTS` in `lib/flow.ts:26-35`; `PARTS` in `lib/heading-slug.ts:80-90`; portraits in `lib/premium/acts.ts` (`ACT_PORTRAITS`, `ACT_ROMAN`) | Two after-story parts: `reference`, `working` (`AFTER_ACTS`) |
| Content | `content/*.md` (source) → `public/content/*.md` (built by `scripts/build-content.ts`; `npm run content`) | Edit `content/`, never `public/content/` by hand |
| Chapter → file | `lib/content-files.ts` (`CONTENT_FILES`) | Needed for every new chapter id |
| Page shell | `components/ClientPage.tsx` | Hero, preface, chapter loop, footer, dock, side rail, tour, notices |
| Components under headings | `HEADING_INSERTS` in `components/MarkdownViewer.tsx:269` (figures); `<StoryEmbeds id>` at `MarkdownViewer.tsx:680,706` (tools, records, charts, visuals) | Both keyed by heading id |
| Embed homes | `lib/story/embeds.ts` (`RECORD_HOMES`, `CHART_HOMES`, `PACK_HOMES`, `VISUAL_HOMES`, `COUNTDOWN_HOMES`, `FEED_HOME`); `lib/tools/meta.ts` (`TOOL_META[].home`) | Guarded by `scripts/verify-mounts.mjs` |
| Separate full-page views | `app/(platform)/*` with `components/platform/PlatformNav.tsx` | Their own menu: Story, Explore data, Dashboards, Tools, Strategies, Implementation, Workspace, Changes |

### 3.2 The story, in current order

Tools are in **bold**. *Italics* mark live records, live charts and story visuals. Word counts are from
`content/*.md`.

| # | Item (chapter id) | What it holds and does | Type | Stage | User | Issues |
|---|---|---|---|---|---|---|
| 1 | Cover hero (`CoverHero`, `ClientPage.tsx:427`) | Portrait, county drawing, title "Kitui 2027: Analysis, Strategy and Direction for Dr. Mulu's Campaign", "Prepared for Dr. Mulu, open to anyone with the link", four big numbers (from `fig-cover-map`) | Hero, stats | W | M | Comes before the Welcome; proposal framing |
| 2 | Preface strip (`ClientPage.tsx:442-465`): `RouteMap` + `fig-cover-map` | "6 questions, then one decision" (`RouteMap.tsx:41-43`); main button "Go to the ask"; button "The case on one screen"; a chip per chapter; "After the proposal" shelves (`RouteMap.tsx:82`) | Navigation, map | W | M | Proposal framing; the main button skips the whole story; the map repeats the hero's four numbers |
| 3 | A welcome from Firefly (`welcome`, 1,220 words) | Lead; 8 "What's inside" cards; row of 6 quick links; a 7-tab table of all 36 tools; "Your first ten minutes" stepper; "Why it helps" checklist | Prose, cards, tabs | W | B | Third on the page. The 36-tool table repeats the Tools panel. It says "the case on one screen… just below", but the cover chapter sits between |
| 4 | Who this is for (`cover`, 113 words) | Prepared for and by, contact, date, "Status: Proposal for discussion"; *ContactCard*; `fig-cover-spine` (digest mode) | Front matter | U | M | Document front matter; repeats the footer |
| 5 | The case on one screen (`brief`, 262 words) | Lead "Firefly Management offers a platform and asks him to approve it"; 3 stats (pool, pool share, offline); `fig-6-3-decision` | Prose, stats | W | M | "Approve it" contradicts the Welcome's "built". The same figures appear for the third time |
| — | Part opener "Kitui today" | Full-width portrait and title | Visual | — | M | |
| 6 | The county in numbers (`kitui`, 1,313) | 1.1 Who lives here; 1.2 Land and three regions (**Kitui Map Studio**); 1.4 How the county is run | Charts, tool | D | B | |
| 7 | What voters need (`needs`, 3,770) | 1.3 Households; 3.1 Water; 3.2 Food and drought (**Drought and Livelihood Watch**); 3.3–3.6 Health, roads, jobs, prices; 1.5 Budget (**County Money Explainer**); 3.7 How county money is spent (**Ward Equity Analyzer**, **Service-Delivery Tracker**, *sectors* pack chart, *Projects* record); 3.8 Mui Basin | Charts, 3 tools, record | D and A mixed | B | Spending analysis sits in a Data chapter |
| 8 | How voters get news (`news`, 2,569) | 4.1 Sources; 4.2 Ownership; 4.3 Reach (**Channel Mix by Sub-county**); 4.4 Offline majority (**Offline Waterline**, *Dispatch* record, *offline* chart) | Charts, 2 tools, record | D (record is I) | B | A daily team record sits in a Data chapter |
| 9 | How Kitui voted (`votes`, 2,422) | Folded "The analysis in four steps" (`premium/Story`, mounted at `ClientPage.tsx:490`); 2.1 Register (**Register Growth Tracker**, **Polling Station Explorer**); 2.2 Results (**2017 to 2022 Swing Viewer**); 2.3 Twelve largest wards (**Pareto Ward Planner**); 2.4 Constituencies (**Coalition Path Builder**, **Constituency Scorecard**, *voters* pack chart); 2.5 The number it takes (**Winning-Number Simulator**) | Charts, 7 tools, scroll story | D and A mixed | B | The site's best analysis is hidden in a fold |
| — | Part opener "His standing" | | Visual | — | M | |
| 10 | His record and reach (`record`, 1,605) | 6.1 Public record; 6.2 Where he is known; 6.3 Party loyalty; 6.4 His channels; 6.5 Online presence (*reach* chart) | Charts, prose | D and A mixed | M | |
| 11 | The diagnosis (`diagnosis`, 1,362) | 7.1 Evidence; 7.2 What could overturn it (*sentiment* chart); 7.3 What the data can't show; 7.4 Assumptions (**Assumptions Panel**) | Prose, chart, tool | A | M | |
| — | Part opener "The strategy" | | Visual | — | M | |
| 12 | The goal (`goal`, 1,273) | 8.1 The goal and its two deadlines (countdown, **Governor Nomination Path**); 8.2 Five objectives (5 visuals) | Prose, visuals, tool | O | M | Two deadlines breaks D6. No part opener of its own |
| 13 | The position (`position`, 482) | 9.1 Central claim (*proof*); 9.2 Resource paradox (*paradox*) | Visuals | S | M | |
| 14 | The message (`message`, 4,923) | 10.1 Claim, pillars, themes (**Ward Allocation Simulator**, **Issue-to-Message Matcher**); 10.2 Discipline (**Fact Card Generator**); 10.3 Framing; 10.4 Sample messages (**Message Studio**, *Creative tests* record) | Charts, 4 tools, record | S | B | "The incumbent" at `message.md:66, 74, 111, 166` (check against D5) |
| 15 | The voters to win (`voters`, 2,900) | 11.1 Universes; 11.2 Six segments, as an accordion (**Message Assignment Matrix**); 11.3 Sizes (**Youth and New Voter Calculator**) | Accordion, 2 tools | S | B | |
| 16 | Channels and language (`channels`, 1,934) | 12.1 Effort (**Ward Priority Scorer**, **Zone Effort Planner**); 12.2 Channel jobs; 12.3 Radio (**Radio Planner**); 12.4 Language (*languages*); 12.5 Dialect; 12.6 A week of publishing (**Weekly Content Calendar**, *Calendar* record and chart); 12.7 When the plan changes | 4 tools, record, chart | S, with I at the end | B | The team's weekly work sits in Strategies |
| — | Part opener "The plan" | | Visual | — | M | |
| 17 | Who does what (`engagement`, 3,591) | 13.1 Structure; 13.2 Owners (*roles*); 13.3 Out of scope; 13.4 Weekly rhythm (*Briefs* record); 13.5 Meetings (*Cadence* record); 17 The campaign team (17.1–17.5, merged in) | Prose, visual, 2 records | I | B | |
| 18 | Timeline to August 2027 (`timeline`, 2,676) | 14.1 First four weeks (countdown, **Governor Race Calendar**); 14.2 Phase 0; 14.3 Profile corrections; 14.4 Target ladder (*phase-now*); 14.5–14.7 Phases 1–3; 16 Coalitions and endorsements (16.1–16.3); 14.8 After the election | Timeline, tool | I | B | "First four weeks" counts from a 1 Sept 2026 signature (`PLANNING_SIGNATURE`, `lib/phases.ts`), so it has passed |
| 19 | The fourteen workstreams (`workstreams`, 8,845, the longest) | *WorkstreamMap*; 15.1 Owned platforms (*Implementation* record and chart); 15.2 Media; 15.3 Ground (*Field* record and chart, **Voter Density Finder**, **Polling Agent Planner**) | Map, 2 tools, 2 records | I | T | Text-heavy |
| — | Part opener "Proof and safeguards" | | Visual | — | M | An extra stage |
| 20 | Measuring success (`success`, 2,272) | 18.1 Judgement; 18.2 Scorecards (**KPI Ladder**, *KPI actuals* record, *kpis* chart); 18.3 Recognition; 18.4 Vanity metrics; 18.5 Presence audit (*Channel audit* record) | Tool, 2 records, chart | I | B | |
| 21 | Lawful and ethical (`lawful`, 2,807) | 19.1 Standard; 19.2 Data Protection Act (**Language and Compliance**); 19.3 Charter; 19.4 IEBC; 19.5 Open items | Prose, tool | I | B | |
| — | Part opener "The decision" | | Visual | — | M | An extra stage |
| 22 | The platform in one view (`platform`, 479) | Who sees, edits and runs what (*PlatformMap*) | Visual | W (content) | M | Explains how to use the site, but sits near the end |
| 23 | What you get and what you provide (`receives`, 1,930) | 21.1 Scope levels; 21.2 Deliverables (*deliverables*); 22 Commitments | Table, visual | I (commercial) | M | |
| 24 | The ask (`ask`, 546) | `fig-6-3-decision`; 23.1 The window that sets the pace (*ask window*) | Visual | I (close) | M | The window is dated "late Oct–Nov 2026" (`NOMINATION_WINDOW`, `lib/phases.ts`), so it goes stale this month |
| — | Part opener "The evidence behind it" | | Visual | — | — | |
| 25 | Evidence and sources (`annex-evidence`, 6,471) | A.1 Standard (**Sources and Data Gaps**); A.2 All sources (*change feed*, links to Every change, Explore, Edit data, Strategy library); B.1 40-ward register (**Ward Dossier**, **Ward Comparison**) | Table, 3 tools, feed | U, holding D tools | B | Welcome step 2, "Open your ward", sends people here, to the bottom of the page |
| 26 | Fine print (`annex-terms`, 588) | G.1 Terms; H.1 Glossary | Prose | U | M | |
| — | Part opener "The working platform" | | Visual | — | T | |
| 27 | Platform playbooks (`annex-playbooks`, 1,252) | C.1 Platform playbooks; C.2 Formats and copy samples (**USSD Flow Builder**); D.1 Volunteer programme | Prose, tool | S and I | T | Strategy and Implementation material placed after the story ends |
| 28 | Technology (`annex-technology`, 1,481) | E.1 Reference architecture (**Ward Link and QR Builder**); E.2 Voter-model dictionary | Prose, tool | U and A | T | |
| 29 | Footer (`ClientPage.tsx:596-627`) | "Prepared for… please do not circulate it further"; Print or save as PDF; Search the document; Prepared by, Date, "Status: Proposal for discussion"; live data line (`LiveFooterLine`) | Utility | U | B | Contradicts D3. Repeats item 4 |

### 3.3 Navigation and controls

| Item | Where | What it does | Stage | User | Issues |
|---|---|---|---|---|---|
| Top bar | `components/story/StoryBar.tsx` | Brand "Kitui 2027", live indicator "Team update X ago", Search, Tools, Sign in / Edit data / Team | U | B | Hides while scrolling (`useChromeVisible`) |
| Tools panel | `StoryBar.tsx` `ToolsSheet` | 36 tools and 10 records grouped **by chapter**, filter box, links to /explore and /tools, "Show me around" | U | T | Not grouped by stage |
| Bottom dock | `components/premium/Chrome.tsx` `Dock` | Current chapter label (opens the index), tools icon, theme switch | U | B | A second Tools button and a second index button |
| Index and search | `components/MobileTOCModal.tsx` | Chapters, headings, read times, visited marks | U | B | |
| Side rail of parts | `Chrome.tsx` `Spine` | Part progress | U | M | Hidden below 1024px (`app/premium.css:728`), so phones have no progress cue |
| Tour | `components/story/Tour.tsx:7-13` | Pill, then 5 stops: Search, Tools, live dot, dock, "Try it" strip in How Kitui voted | U | T | Aimed at the team, shown to the first visitor |
| Notices | `components/Toaster.tsx` | Resume where you left off, keyboard shortcuts, "link copied" | U | T | |
| Chapter summary card | `components/flow/ChapterDigest.tsx` | One-screen lead, stats, heading list, "Try it in this chapter", "Close this chapter" | All | B | Not used for `welcome`, `brief`, `ask` (`ALWAYS_OPEN`, `ClientPage.tsx:98`) |
| Tool card | `components/story/StoryEmbeds.tsx` `TryCard` / `ToolRail` | Animated preview, "Open it here", "✓ Used" flag (localStorage `sx-used-<slug>`), "Open on its own page" | All | B | |
| Small controls inside chapters | Heading share button (`SectionHeading.tsx`), glossary taps (`GlossTerm`), source and confidence labels (`ProvPill`), disputed-figure chips, "Read the full text" folds, text versions | All | B | |

### 3.4 Separate pages, guards and states

| Item | Where | What it is | User | Issues |
|---|---|---|---|---|
| /full, /<chapter> | `app/[[...slug]]/page.tsx` | Print, no-JS and deep-link routes | B | |
| /explore | `app/(platform)/explore` | "Every dataset, searchable" | T | |
| /dashboards | `app/(platform)/dashboards` | "The campaign at a glance" | T | Repeats the 7 charts already in the story |
| /tools, /tools/[slug], /tools/ward-dossier/[code] and others | `app/tools`, `app/(platform)/tools` | All tools, each on its own page | T | |
| /strategies | `app/(platform)/strategies` | "Objectives, strategies and solutions" | T | Repeats story content; only linked from the change feed at the bottom |
| /progress | `app/(platform)/progress` | "How each strategy is being carried out" | T | Same data as the *Implementation* record |
| /workspace, /workspace/[collection] | `app/(platform)/workspace` | "Where the team runs the campaign" | T | Same records as in the story |
| /history | `app/(platform)/history` | "Every change, who made it, and when" | T | |
| /team/login, /team/data, /team/admin | `app/(platform)/team` | Sign-in, data editor, account admin | T | |
| Menu on all of the above | `components/platform/PlatformNav.tsx` | Story, Explore data, Dashboards, Tools, Strategies, Implementation, Workspace, Changes | T | A second site's navigation, against D2 |
| /tools/visual-kinds | `app/tools/visual-kinds/page.tsx` | Developer test page (not indexed) | — | Orphaned |
| Passcode gate | `middleware.ts` | Off unless `SITE_PASSCODE` is set | — | |
| Loading states | `StoryEmbeds.tsx` | "Opening the tool…", "Reading the team's numbers…", "Reading the team's records…", "Reading the history…" | B | |
| Empty states | `StoryEmbeds.tsx` | Records: "Waiting for the first entry" or "The database is not connected yet". Charts: skeleton plus "This chart draws itself the moment the team saves a record". Feed: "No change has been recorded yet". Tools panel: "Nothing matches" | B | If login or the database is off in production, Dr. Mulu meets up to 10 empty records and 7 empty charts inside the story |

### 3.5 AI models

The brief mentions "AI scenario models". **No AI model is in the current code.** The optional AI step was
added in `3025757` and removed in `63a6dd9`. The scenario tools (Winning-Number Simulator, Coalition Path
Builder, Offline Waterline, Assumptions Panel and the rest) are fixed arithmetic. This plan does not add
one (AGENTS.md §3: no unsolicited features).

---

## 4. Flow problems, ranked, with evidence

| Rank | Problem | Evidence | Who it hurts |
|---|---|---|---|
| P1 | **Two voices.** A proposal frame wraps a Welcome that says the platform is built and running. The Welcome is the third block | `CoverHero` title; `RouteMap.tsx:41-43` "{n} questions, then one decision" and "Go to the ask"; `RouteMap.tsx:82` "After the proposal"; `ActOpener.tsx` "After the proposal"; `flow.ts:32` act "The decision"; `ClientPage.tsx:598-624` "please do not circulate" and "Status: Proposal for discussion"; `content/cover.md:20`; `content/brief.md` "asks him to approve it"; `welcome.md` "Firefly Management built this platform" | M first, B |
| P2 | **The parts don't match the six stages.** Nine parts with their own names. Objectives have no part. Data and Analysis are mixed in three chapters. "Proof and safeguards" and "The decision" are extra stages | `FLOW_ACTS` in `lib/flow.ts:26-35`; the four-step analysis folded inside `votes` (`ClientPage.tsx:490`); 3.7 inside `needs`; 6.2–6.5 inside `record` | M |
| P3 | **Two lenses instead of one** (breaks D6) | `goal.md:7-22` "two deadlines"; `lib/phases.ts` phase `neg1` "Nomination sprint"; `NOMINATION_WINDOW` (late Oct–Nov 2026); the `<window-chip>` in `goal`, `ask`; Governor Nomination Path at `goal-sec-8-1`; `ask.md:41` "The window that sets the pace" | M |
| P4 | **Daily tools are stranded.** Ward Dossier and Ward Comparison sit at `annex-evidence-sec-b-1` (bottom). Change feed, Explore and Edit data are at `annex-evidence-sec-a-2`. The USSD and QR builders are in the after-story sections. One week's work is split across five places | `TOOL_META` homes; `RECORD_HOMES`: calendar `channels-sec-12-6`, briefs `engagement-sec-13-4`, cadence `engagement-sec-13-5`, dispatch `news-sec-4-4`, tests `message-sec-10-4` | T |
| P5 | **A second site.** `PlatformNav` is a parallel navigation; /dashboards and /strategies repeat the story | `components/platform/PlatformNav.tsx`; `app/(platform)/*` | T |
| P6 | **Too many controls on a phone.** Tools opens from the top bar, the dock and each chapter's strip, plus the Welcome's tools table. Search opens from the top bar, the dock label and the footer. No stage progress on phones. The tour targets the team | `StoryBar.tsx`, `Chrome.tsx`, `ChapterDigest.tsx`, `premium.css:728`, `Tour.tsx:7-13` | B |
| P7 | **Dr. Mulu may see empty states** inside the story | `LiveRecord`, `LiveChart`, `ChangeFeed` in `StoryEmbeds.tsx` | M |
| P8 | **Repetition.** The hero's four numbers, then `fig-cover-map` (the same figures, `ClientPage.tsx:451`), then the brief's three stats. Firefly's offer sentence appears four times across `brief` and `ask`. The footer repeats the cover chapter | `CoverHero` reads `FIG_COVER_MAP`; `brief.md` stats; `ask.md` lead and blockquote | M |
| P9 | **Heavy text a visual could carry.** The fourteen workstreams (8,845 words; a workstream map already exists). The all-sources table in A.2 does the same job as the Sources and Data Gaps tool. Lawful and ethical runs to 2,807 words | `content/workstreams.md`; `content/annex-evidence.md` | M |

---

## 5. Target flow map

Section names only. No numbering in names.

- **Welcome**
  - Opening
  - A welcome from Firefly
  - What changed
  - The platform in one view
  - The case on one screen
- **Data**
  - The county in numbers
  - What voters need
  - How voters get news
  - How Kitui voted
  - His public record
- **Analysis**
  - The number it takes (opens with the four-step analysis)
  - Where he is known, and where not
  - Where county money goes
  - The diagnosis
- **Objectives**
  - The goal and five objectives
- **Strategies**
  - The position
  - The message
  - The voters to win
  - Channels and language
- **Implementation**
  - Who does what
  - This week
  - Timeline to August 2027
  - The fourteen workstreams
  - Measuring success
  - Lawful and ethical
  - What you get and what you provide
  - The ask
- **After the story (utility)**
  - Evidence and sources
  - Fine print
  - Technology
  - Footer

### 5.1 Target configuration

`FLOW_ACTS` (replaces `lib/flow.ts:26-35`). The `blurb` text is a proposal for Firefly to confirm (§10, Q6).

```ts
export const FLOW_ACTS: FlowAct[] = [
  { id: "data",           label: "Data",                   blurb: "What is true about Kitui, its voters and Dr. Mulu?", opensOn: "kitui" },
  { id: "analysis",       label: "Analysis",               blurb: "What does the data mean for the race?",             opensOn: "winning" },
  { id: "objectives",     label: "Objectives",             blurb: "What must the campaign achieve?",                   opensOn: "goal" },
  { id: "strategies",     label: "Strategies",             blurb: "How will it achieve it?",                           opensOn: "position" },
  { id: "implementation", label: "Implementation",         blurb: "Who does what, when, and how it is measured",       opensOn: "engagement" },
  { id: "reference",      label: "The evidence behind it", blurb: "Where every figure comes from, and the terms",      opensOn: "annex-evidence" },
];
// AFTER_ACTS = new Set(["reference"])
```

Act ids are internal (not heading ids), so `data`, `analysis` and the others are safe here even though
some were old chapter ids. Welcome has no act opener: `part: 0` chapters already render without one.

`SECTIONS` order and `part` (replaces `lib/heading-slug.ts:46-73`). New chapter ids are `winning`,
`known`, `spend` and `week`. None of them appears in any `lib/anchors/*.json`, so no old link already
points at them. Do **not** reuse `analysis`, `data`, `objectives`, `strategy`, `implementation`,
`delivery`, `reach`, `assumptions`, `publishing`, `presence`, `measure` or any other id found in
`lib/anchors/*.json`. Old links to those ids are still being redirected.

| Order | id | part | label | Status |
|---|---|---|---|---|
| 1 | `welcome` | 0 | A welcome from Firefly | Kept |
| 2 | `platform` | 0 | The platform in one view | Moved from the end |
| 3 | `brief` | 0 | The case on one screen | Kept |
| 4 | `kitui` | 1 | The county in numbers | Kept |
| 5 | `needs` | 1 | What voters need | 3.7 moves out |
| 6 | `news` | 1 | How voters get news | Embeds move out |
| 7 | `votes` | 1 | How Kitui voted | 2.5 and the four-step analysis move out |
| 8 | `record` | 1 | His public record | Relabelled; 6.2, 6.3, 6.5 move out |
| 9 | `winning` | 2 | The number it takes | **New chapter** |
| 10 | `known` | 2 | Where he is known, and where not | **New chapter** |
| 11 | `spend` | 2 | Where county money goes | **New chapter** |
| 12 | `diagnosis` | 2 | The diagnosis | Kept |
| 13 | `goal` | 3 | The goal and five objectives | Relabelled |
| 14 | `position` | 4 | The position | Kept |
| 15 | `message` | 4 | The message | Kept |
| 16 | `voters` | 4 | The voters to win | Kept |
| 17 | `channels` | 4 | Channels and language | 12.6 and 12.7 move out |
| 18 | `engagement` | 5 | Who does what | 13.4 and 13.5 move out |
| 19 | `week` | 5 | This week | **New chapter** (a merge of existing sections) |
| 20 | `timeline` | 5 | Timeline to August 2027 | Kept |
| 21 | `workstreams` | 5 | The fourteen workstreams | Kept |
| 22 | `success` | 5 | Measuring success | Kept |
| 23 | `lawful` | 5 | Lawful and ethical | Kept |
| 24 | `receives` | 5 | What you get and what you provide | Kept |
| 25 | `ask` | 5 | The ask | Kept |
| 26 | `annex-evidence` | 6 | Evidence and sources | Kept |
| 27 | `annex-terms` | 6 | Fine print | Kept |
| 28 | `annex-technology` | 6 | Technology | Kept |
| — | `cover` | — | (rendered in the footer) | **Removed from the flow** (WP1) |
| — | `annex-playbooks` | — | (sections dispersed) | **Removed from the flow** (WP9) |

`PARTS` in `lib/heading-slug.ts:80-90` must match: part 0 Welcome, 1 Data, 2 Analysis, 3 Objectives,
4 Strategies, 5 Implementation, 6 The evidence behind it. `ACT_PORTRAITS` and `ACT_ROMAN` in
`lib/premium/acts.ts` must have one entry per act (6). Keep the `number` field of each moved chapter
unchanged where in-prose references use it (`SectionNumberMap.tsx` maps chapter numbers to their first
heading). New chapters take `number: ""` unless a "Section N" reference needs them.

---

## 6. Section-by-section specification

Format for each: **job and takeaway** · **tools and live items inside** · **transition into the next
section** · **change** (move / merge / split / cut / convert).

### Welcome

**Opening** (today: `CoverHero` + preface strip)
- Job: "Firefly built this for you and your team; here is Kitui in four numbers."
- Inside: the four big numbers (`BigNumber`), portrait, county drawing.
- Into next: scroll straight into "A welcome from Firefly".
- Change: **merge** the hero into the Welcome. Retitle it away from "Analysis, Strategy and Direction"
  (wording: §10, Q2). **Replace** `RouteMap`'s "{n} questions, then one decision" with a six-stage route
  (Welcome, Data, Analysis, Objectives, Strategies, Implementation), each stage listing its chapters.
  **Cut** the "Go to the ask" main button. **Cut** the `fig-cover-map` that repeats the hero's numbers
  (the hero carries the same figures; it stays at `/full` and in print).

**A welcome from Firefly** (`welcome`)
- Job: what was built, what is inside, how to start.
- Inside: "What's inside" cards, "Your first ten minutes", "Why it helps", the quick-link row.
- Into next: "Here is what changed since you last looked."
- Change: **convert** the 7-tab, 36-tool table to one "Every tool" button (opens the Tools panel,
  `window.dispatchEvent(new Event("story:open-tools"))`). The table's text moves to the Tools panel,
  which already lists every tool with its one-line description, so a component takes over its job (D7).
  Repoint the quick links and the stepper to the new homes: Ward Dossier → `votes-sec-b-1`; "This week's
  content" → the `week` chapter; "Every change" → What changed. Fix "just below" so it is true.

**What changed** (today: the change feed at `annex-evidence-sec-a-2`)
- Job: for a returning team member, "what moved since yesterday".
- Inside: `ChangeFeed` (last 8 edits; links to Every change, Explore, Edit data).
- Change: **move** `FEED_HOME` to a Welcome heading. **Hide the block when there are no changes**,
  instead of showing "No change has been recorded yet" to a first reader.

**The platform in one view** (`platform`)
- Job: who sees what, who edits what, what Firefly runs.
- Inside: `PlatformMap`.
- Change: **move** from the end of the story into the Welcome (part 0).

**The case on one screen** (`brief`)
- Job: "The gap is recognition outside Kitui Central, and it can close."
- Inside: `fig-6-3-decision`.
- Into next: "The evidence starts with the county."
- Change: **cut** the three stats (the Opening's four numbers do the job, D7). Rewrite the offer
  sentence in the Welcome's tense (wording: §10, Q1).

### Data

**The county in numbers** (`kitui`)
- Job: who lives in Kitui, on what land, how it is run.
- Inside: Kitui Map Studio.
- Into next: "What those people need."
- Change: none.

**What voters need** (`needs`)
- Job: water first, then food, health, roads, jobs, prices.
- Inside: Drought and Livelihood Watch, County Money Explainer.
- Into next: "How they hear about it."
- Change: **split**. Section 3.7 (How county money is spent) moves to `spend`. 1.5 (budget) stays here
  as data.

**How voters get news** (`news`)
- Job: most of Kitui is offline, so phone, radio and people carry the race.
- Inside: Channel Mix, Offline Waterline.
- Into next: "And how they voted."
- Change: **move** the *Dispatch* record and *offline* chart from `news-sec-4-4` to the workstreams
  (15.3, ground and offline).

**How Kitui voted** (`votes`)
- Job: the register and the results since 2013.
- Inside: Register Growth Tracker, Polling Station Explorer, Swing Viewer, Pareto Ward Planner,
  Constituency Scorecard, *voters* pack chart, **plus Ward Dossier and Ward Comparison** (moved in).
- Into next: "And the candidate's record."
- Change: **move** 2.5 and the folded four-step analysis to `winning`. **Move** the Coalition Path
  Builder to `winning`. **Move** the B.1 heading ("The 40-ward register") from `annex-evidence` into this
  chapter, so the ward tools sit with the ward data. The register table travels with its heading; keep
  it in its fold.

**His public record** (`record`)
- Job: what he has done and where he publishes.
- Inside: none of the tools.
- Into next: close of the Data stage. "Now what the data means."
- Change: **split**. 6.1 and 6.4 stay; 6.2, 6.3 and 6.5 move to `known`. Relabel "His record and reach"
  to "His public record".

### Analysis

**The number it takes** (`winning`, new)
- Job: the benchmark vote count, and where it can come from.
- Inside: the four-step analysis (`premium/Story`, **unfolded**, as the chapter's opener), the
  Winning-Number Simulator, the Coalition Path Builder.
- Change: **new chapter** from `votes` 2.5 and the folded `Story`. In `ClientPage.tsx`, the
  `item.id === "votes"` block that mounts `<Story/>` becomes `item.id === "winning"`. Drop the
  `PanelFold` so the analysis opens unfolded (keep the `LazyMount` for performance).

**Where he is known, and where not** (`known`, new)
- Job: known in Kitui Central, not beyond.
- Inside: *reach* chart.
- Change: **new chapter** from `record` 6.2, 6.3 and 6.5.

**Where county money goes** (`spend`, new)
- Job: spend against need, ward by ward.
- Inside: Ward Equity Analyzer, Service-Delivery Tracker, *sectors* pack chart, *Projects* record.
- Change: **new chapter** from `needs` 3.7.

**The diagnosis** (`diagnosis`)
- Job: a recognition gap, stated as a hypothesis to test.
- Inside: *sentiment* chart, Assumptions Panel. Add a link to the voter-model dictionary (Technology,
  E.2).
- Into next: "So the goal is…"
- Change: none beyond the link.

### Objectives

**The goal and five objectives** (`goal`)
- Job: one general-election target and five objectives.
- Inside: the countdown to the next Gazette deadline.
- Into next: "How we will win them."
- Change: **reframe** to the single general-election lens (§10, Q3 for wording). **Move** the Governor
  Nomination Path tool and the nomination-window text to the Timeline as a dated milestone. Gets its
  own part opener (`FLOW_ACTS` `objectives`).

### Strategies

**The position** (`position`)
- Job: the Economist Governor, who can show where public money went.
- Inside: *proof*, *paradox* visuals.
- Change: none.

**The message** (`message`)
- Job: one claim, three pillars, six themes.
- Inside: Ward Allocation Simulator, Issue-to-Message Matcher, Fact Card Generator, Message Studio,
  plus the C.2 formats and copy samples moved in from the playbooks.
- Change: **move** the *Creative tests* record to workstreams 15.1 (Workstream 3, creative testing).
  **Check** the "incumbent" lines against D5 (§10, Q4).

**The voters to win** (`voters`)
- Job: three universes, six segments.
- Inside: Message Assignment Matrix, Youth and New Voter Calculator.
- Change: none.

**Channels and language** (`channels`)
- Job: which channel and which language reach whom.
- Inside: Ward Priority Scorer, Zone Effort Planner, Radio Planner, *languages*, plus C.1 "One job per
  platform" moved in from the playbooks.
- Into next: "Who does the work."
- Change: **move** 12.6 (A week of publishing) and 12.7 (When the plan changes) to `week`.

### Implementation

**Who does what** (`engagement`)
- Job: his team publishes, Firefly runs the platform.
- Inside: *roles* visual.
- Change: **move** 13.4 (weekly rhythm) and 13.5 (meetings) to `week`.

**This week** (`week`, new: a merge of existing sections)
- Job: the team's week in one place.
- Inside: Weekly Content Calendar, *Calendar* record and chart, *Briefs* record, *Cadence* record.
- Change: **merge** 13.4, 13.5 (from `engagement`) and 12.6, 12.7 (from `channels`). Heading order:
  13.4 weekly rhythm and approvals; 12.6 a week of publishing; 13.5 meetings and escalation; 12.7 when
  the plan changes.

**Timeline to August 2027** (`timeline`)
- Job: the phases, and which one is live now.
- Inside: Governor Race Calendar, *phase-now*, countdown, **Governor Nomination Path** (moved in).
- Change: mark 14.1 "The first four weeks" as passed, or reword it (§10, Q5).

**The fourteen workstreams** (`workstreams`)
- Job: what each workstream produces, who owns it, how often it reports.
- Inside: *WorkstreamMap*; *Implementation* record and chart; *Field* record and chart; Voter Density
  Finder; Polling Agent Planner; **plus** the USSD Flow Builder (from the playbooks), the Ward Link and QR
  Builder (from Technology), *Dispatch* record and *offline* chart (from `news`), *Creative tests* record
  (from `message`), and D.1 volunteer programme (from the playbooks).
- Change: **convert**. The workstream map becomes the way into the chapter: each card jumps to its
  sub-section, and the full text stays behind its fold (WP10).

**Measuring success** (`success`)
- Job: votes and recognition count, followers and likes do not.
- Inside: KPI Ladder, *KPI actuals* record, *kpis* chart, *Channel audit* record.
- Change: **move** out of "Proof and safeguards" into Implementation.

**Lawful and ethical** (`lawful`)
- Job: compliant by design.
- Inside: Language and Compliance checker.
- Change: same as above.

**What you get and what you provide** (`receives`)
- Job: scope levels, deliverables, commitments on both sides.
- Inside: *deliverables* visual.
- Change: **move** out of "The decision".

**The ask** (`ask`)
- Job: the one decision.
- Inside: *ask window* visual.
- Into next: the utility shelf.
- Change: update the window that is going stale (§10, Q5).

### After the story (utility)

**Evidence and sources** (`annex-evidence`): A.1 and A.2 stay, with the Sources and Data Gaps tool.
B.1 moves to `votes` (above). The feed moves to the Welcome.

**Fine print** (`annex-terms`): no change. Glossary terms are already reachable from inline taps.

**Technology** (`annex-technology`): E.1 stays. The QR builder moves to the workstreams. E.2 stays, with a
link to it from the Assumptions Panel.

**Footer**: **merge** in the `cover` chapter's text (prepared for, prepared by, contact, date) by
rendering `cover.md` in the footer. Replace "please do not circulate it further" and "Status: Proposal
for discussion" with text that matches D3, for example "Open to view; sign in to edit" (wording: §10,
Q2). Keep Print, Search and the live line.

**Separate pages**: they stay as full-screen views of what is embedded. **Replace** `PlatformNav` with
a single "Back to [chapter]" link that returns to the item's home in the story. /dashboards is reached
only from a "See every chart" link. **Cut** `/tools/visual-kinds`.

---

## 7. Dual-user navigation plan

One page serves both users. Nothing forks into a second site.

### 7.1 Dr. Mulu, first visit

| Moment | What he sees | Built from |
|---|---|---|
| Lands on `/` | Opening (portrait, four numbers, Firefly's line), then the Welcome | WP1 |
| Scrolls | A six-segment stage bar in the bottom dock fills as he moves Welcome → Implementation **(new on phones)** | WP7; reuse `components/flow/PartDots.tsx` |
| Each chapter | One screen (summary card) until he opens it | Existing `ChapterDigest` |
| Each stage | A part opener names the stage | `FLOW_ACTS` (WP2) |
| End | The ask, then the evidence shelf | WP2 |
| Not shown | The team tour does not pop up. Empty records and charts are hidden from him | WP7, WP6 |

### 7.2 The team, returning daily

| Need | Shortcut | Built from |
|---|---|---|
| "What changed?" | The top bar's "Team update X ago" opens What changed | WP4, WP7 |
| "This week's work" | Pinned first in the Tools panel; linked from the Welcome's quick row | WP4, WP11 |
| "The tool I used yesterday" | A "Recently used" row in the Tools panel, sorted from the existing `sx-used-<slug>` flags **(new)** | WP11 |
| "Find anything" | Search (one entry point: the dock label opens the index and search) | WP7 |
| "Go straight there" | Existing deep links (`/#week-sec-12-6`); the existing resume notice | Unchanged |
| "Edit" | Sign in from the top bar; Add and Edit appear on the embedded records only | Unchanged (D3) |

### 7.3 Phone controls, after WP7

| Control | Holds |
|---|---|
| Top bar (hides on scroll) | Brand, "Team update X ago" (opens What changed), Sign in / Edit data / Team |
| Bottom dock | Stage bar **(new on phones)**, current chapter label (opens index and search), Tools |
| Index sheet | Chapters by stage, search, theme switch (moved from the dock) |
| Footer | Print, prepared by, live line. The second Search button goes; the dock already has it |

---

## 8. Work packages

Ranked by impact against effort. **★ = do first.**

| Rank | WP | Change | Impact | Effort |
|---|---|---|---|---|
| ★1 | WP1 | Welcome first, one voice | High | Low–Med |
| ★2 | WP2 | Six stages | High | Low |
| ★3 | WP3 | Split Data from Analysis | High | Med |
| ★4 | WP4 | "This week" and stranded tools | High | Med |
| ★5 | WP5 | Single general-election lens | High | Med (needs Firefly's wording) |
| 6 | WP6 | Hide empty live blocks from viewers | Med–High | Low |
| 7 | WP7 | Phone controls | Med | Med |
| 8 | WP8 | Separate pages | Med | Low |
| 9 | WP9 | Disperse the playbooks | Med | Med |
| 10 | WP10 | Text to visual, repeats | Med | Low–Med |
| 11 | WP11 | Tools panel by stage, recently used | Med | Low |
| 12 | WP12 | "Incumbent" lines check | Low–Med | Low |

Dependencies: WP2 before WP3 and WP4 (they add chapters to `SECTIONS`). WP3 and WP4 both add anchor
entries, so do them in sequence or merge the anchors file carefully. WP5 and WP12 wait for Firefly's
answers in §10.

---

### ★ WP1. Welcome first, one voice

**Goal.** The page opens on the Welcome in Firefly's voice. No "proposal" framing remains on screen.

**Files.** `components/ClientPage.tsx`, `components/premium/CoverHero.tsx`, `components/flow/RouteMap.tsx`,
`components/premium/ActOpener.tsx`, `lib/heading-slug.ts`, `content/brief.md`, `content/welcome.md`,
`content/cover.md`.

**Steps.**
1. In `CoverHero`, replace the title and the "Prepared for" seal with the Welcome's opening line
   (wording from Firefly, §10, Q2). Keep the portrait, county and four numbers.
2. In `ClientPage.tsx:442-465`, remove the second `fig-cover-map` (it repeats the hero's numbers; keep
   it in `/full` and print). Replace `RouteMap`'s header with a six-stage route: stage name, then its
   chapters as buttons. Remove the "Go to the ask" button and the "After the proposal" kicker
   (`RouteMap.tsx:82`).
3. In `ActOpener.tsx`, replace "After the proposal" with "After the story". Remove the "For the
   campaign team" branch if the `working` act is retired (WP9).
4. Remove `cover` from `SECTIONS`. Render `public/content/cover.md` in the footer with `MarkdownViewer`
   in place of the footer's own "Prepared by / Date / Status" list, so the text is not duplicated and is
   not lost. Do **not** delete `content/cover.md` (`check:preservation` fails on a missing protected
   file). Update `cover.md`'s "Status" line and the footer's "please do not circulate" line with
   Firefly's wording (§10, Q2), with ledger entries.
5. In `brief.md`, remove the three stats (the Opening carries them) and align the offer sentence's tense
   (§10, Q1). Ledger both.
6. In `welcome.md`, fix "just below" and repoint the quick links (after WP4, repoint to new homes).

**Acceptance.**
- The first content block after the top bar is the Opening; the second is "A welcome from Firefly".
- No visible "proposal", "After the proposal", "questions, then one decision", "do not circulate" or
  "Proposal for discussion" on `/`.
- The four figures appear once above the fold, not three times.
- `npm run verify`, `npm run check:preservation`, `npm run build` pass.

---

### ★ WP2. Six stages

**Goal.** The part openers and navigation follow Welcome → Data → Analysis → Objectives → Strategies →
Implementation.

**Files.** `lib/flow.ts`, `lib/heading-slug.ts` (`SECTIONS`, `PARTS`), `lib/premium/acts.ts`,
`components/premium/Chrome.tsx` (`ROMAN`), `components/flow/RouteMap.tsx`, `components/MobileTOCModal.tsx`
(check part grouping), `components/story/Tour.tsx` (check the selector `#section-votes .sx-hands`).

**Steps.**
1. Replace `FLOW_ACTS` and `AFTER_ACTS` with §5.1.
2. Re-order `SECTIONS` and set `part` per §5.1 (without the new chapters yet; WP3 and WP4 add them).
   Move `platform` to part 0 after `welcome`. `goal` becomes part 3 with its own opener.
3. Update `PARTS` labels and blurbs to match.
4. Give `ACT_PORTRAITS` and `ACT_ROMAN` six entries. `Chrome.tsx` `ROMAN` is used by `actNumeral`; check
   it is not shown as document-style numbering (D4). If it is, drop it.
5. Re-run `scripts/measure-section-heights.mjs` if `data/section-heights.json` is keyed by order
   (check before running).

**Acceptance.**
- Part openers read Data, Analysis, Objectives, Strategies, Implementation, then "The evidence behind
  it".
- "Proof and safeguards" and "The decision" no longer exist as parts.
- The index lists chapters under the six stages.
- No heading id changes in this WP (chapter order only), so `build-anchors.ts --check` is unchanged.

---

### ★ WP3. Split Data from Analysis

**Goal.** Data chapters hold facts; Analysis chapters hold what they mean. The four-step analysis is no
longer folded.

**Files.** `content/votes.md`, `content/record.md`, `content/needs.md`, new `content/winning.md`,
`content/known.md`, `content/spend.md`; `lib/heading-slug.ts`; `lib/content-files.ts`;
`components/ClientPage.tsx` (the `item.id === "votes"` block at line 490);
`components/MarkdownViewer.tsx` (`HEADING_INSERTS` keys); `lib/story/embeds.ts`; `lib/tools/meta.ts`;
new `lib/anchors/flow-2026-11.json`; `scripts/build-anchors.ts`; new ledger `docs/flow-2026-11/ledger.json`;
`package.json` (`check:content` ledger list).

**Steps.**
1. Create `content/winning.md` with the full text of `## 2.5 The number it takes` (moved verbatim from
   `votes.md`). Keep the heading number: the id becomes `winning-sec-2-5`, and "Section 2.5"
   references still resolve through `SectionNumberMap`.
2. Create `content/known.md` with 6.2, 6.3 and 6.5 moved verbatim from `record.md`.
3. Create `content/spend.md` with 3.7 moved verbatim from `needs.md`.
4. Add `winning`, `known`, `spend` to `SECTIONS` (part 2, §5.1 order), to `CONTENT_FILES`, and give each
   a `blurb`. Set `opensOn: "winning"` for the `analysis` act.
5. In `ClientPage.tsx`, mount `<Story/>` on `item.id === "winning"` without the `PanelFold` (keep
   `LazyMount` on the streamed route).
6. Rekey every moved heading in `HEADING_INSERTS`, `embeds.ts` and `meta.ts` (Appendix A, B).
7. Write every old → new id into `lib/anchors/flow-2026-11.json` (`{"moves": {...}}`, Appendix C).
   Register it in `scripts/build-anchors.ts` the same way `rivals-2026-11.json` is registered (lines
   89-98). Run `npm run anchors`, then `build-anchors.ts --check`.
8. Write a ledger entry for each moved block in `docs/flow-2026-11/ledger.json` (same shape as
   `docs/toc-2026-11/ledger.json`; `kind` for a move). Add the ledger to `check:content` in
   `package.json`.
9. Run `npm run content` to rebuild `public/content/`.

**Acceptance.**
- `/#votes-sec-2-5`, `/#record-sec-6-2`, `/#needs-sec-3-7` (and the others in Appendix C) land on the
  same text in its new chapter.
- The four-step analysis shows unfolded at the top of "The number it takes".
- `scripts/verify-mounts.mjs` passes (every embed home resolves).
- `npm run verify`, `npm run check:content`, `npm run check:preservation`, `npm run build` pass.
- Word totals across `content/*.md` are unchanged (moves only).

---

### ★ WP4. "This week" and stranded tools

**Goal.** The team's weekly work sits in one chapter. Ward tools sit with ward data. The change feed is
in the Welcome.

**Files.** `content/engagement.md`, `content/channels.md`, new `content/week.md`,
`content/annex-evidence.md`, `content/votes.md`, `content/welcome.md`; `lib/heading-slug.ts`;
`lib/content-files.ts`; `lib/story/embeds.ts`; `lib/tools/meta.ts`; `components/story/StoryEmbeds.tsx`;
`lib/anchors/flow-2026-11.json`; ledger.

**Steps.**
1. Create `content/week.md` with, verbatim and in this order: 13.4, 12.6, 13.5, 12.7. Add `week` to
   `SECTIONS` (part 5, after `engagement`) and `CONTENT_FILES`.
2. Move `## B.1 The 40-ward register` (with its table) from `annex-evidence.md` to the end of
   `votes.md`. Its id becomes `votes-sec-b-1`.
3. Rehome per Appendix A and B: calendar, briefs, cadence records; calendar chart; Weekly Content
   Calendar tool → `week-sec-*`. Ward Dossier, Ward Comparison → `votes-sec-b-1`. Dispatch record and
   offline chart → `workstreams-sec-15-3`. Creative tests record → `workstreams-sec-15-1`.
4. Move `FEED_HOME` to a Welcome heading. The Welcome has no numbered heading, so add one to
   `welcome.md`: `## 0.1 What changed`, which yields `welcome-sec-0-1`. `LEADING_NUMBER` in
   `lib/heading-slug.ts` accepts digits, or the letters A–H only, so `W.1` would **not** work. No
   `welcome-sec-*` id exists in `lib/anchors/*.json` at `333afa8`, and no content says "Section 0.1".
   Run `build-anchors.ts --check` to confirm nothing old resolves onto it. If it does, mount
   `<ChangeFeed/>` from `ClientPage.tsx` after the welcome chapter instead (no deep link).
   Prefer the heading: it gives the block a deep link.
5. In `ChangeFeed`, return `null` when `changes.length === 0` (instead of the empty message).
6. Anchors and ledger as in WP3.

**Acceptance.**
- One chapter holds the calendar, the briefs and the cadence records and the calendar chart.
- The Welcome's "Open your ward" step lands on the Ward Dossier inside How Kitui voted.
- `/#engagement-sec-13-4`, `/#channels-sec-12-6`, `/#annex-evidence-sec-b-1` and the rest of
  Appendix C still land on the right text.
- All checks in WP3 pass.

---

### ★ WP5. Single general-election lens

**Goal.** The Objectives run on the general election only. The nomination becomes a dated
milestone in the Timeline.

**Blocked on** §10, Q3 and Q5 (Firefly's wording).

**Files.** `content/goal.md`, `content/timeline.md`, `content/ask.md`, `lib/phases.ts`,
`lib/tools/meta.ts`, ledger.

**Steps.**
1. Rewrite the 8.1 lead and heading ("The goal and its two deadlines") to one general-election target,
   with Firefly's wording. Move the nomination paragraphs verbatim to a Timeline heading (for example
   14.1). Ledger every move and rewrite.
2. Move the Governor Nomination Path tool home from `goal-sec-8-1` to that Timeline heading.
3. Keep the `goal-sec-8-1` countdown (it counts to the next Gazette deadline, which is the general
   election calendar).
4. Update `ask.md` 23.1 and `NOMINATION_WINDOW` per Firefly's answer (the window ends 30 Nov 2026).
5. Keep the `neg1` phase in `lib/phases.ts` only if Firefly confirms it; it drives the timeline figure.

**Acceptance.**
- The Objectives chapter names one deadline: 10 August 2027.
- The nomination appears only as a Timeline milestone and in the Nomination Path tool.
- Checks as in WP3.

---

### WP6. Hide empty live blocks from viewers

**Goal.** A viewer who isn't signed in never meets an empty record, an empty chart or "not connected".

**Files.** `components/story/StoryEmbeds.tsx`.

**Steps.**
1. `LiveRecord`: when `!live.signedIn` and (`c.count === 0` or `!live.editable`), render nothing.
2. `LiveChart`: when `!live.signedIn` and `chart.bars.length === 0`, render nothing.
3. `ChangeFeed`: when `changes.length === 0`, render nothing (also in WP4).
4. Keep the empty states for signed-in team members. They prompt the first entry.

**Acceptance.** Signed out, with an empty store, no "Waiting for the first entry", "not connected yet"
or empty-chart skeleton appears on `/`. Signed in, they still do.

---

### WP7. Phone controls

**Goal.** One way to each control. Stage progress on phones. No team tour for the first reader.

**Files.** `components/story/StoryBar.tsx`, `components/premium/Chrome.tsx`, `components/flow/PartDots.tsx`,
`components/MobileTOCModal.tsx`, `components/story/Tour.tsx`, `components/ClientPage.tsx` (footer).

**Steps.**
1. Remove the Tools button from the top bar; keep it in the dock. Make the "Team update X ago" indicator
   jump to What changed.
2. Add a six-segment stage bar to the dock, from `PartDots`, visible on all widths.
3. Move the theme switch from the dock into the index sheet.
4. Remove the footer's "Search the document" button.
5. Stop the tour pill from appearing on a first visit. Keep "Show me around" in the Tools panel.
6. Update the tour stops that point at removed controls (`Tour.tsx:7-13`) and the `#section-votes`
   selector.

**Acceptance.** Each of Tools, Search and theme has one entry point on a 390px screen. The stage bar
shows on a phone. The tour appears only from "Show me around". Run
`scripts/measure-chrome-occlusion.mjs` before and after; occlusion must not rise.

---

### WP8. Separate pages

**Goal.** The full-page views stay as expansions of the story, not as a second site.

**Files.** `components/platform/PlatformNav.tsx`, `app/(platform)/layout.tsx`, `app/tools/visual-kinds/`.

**Steps.**
1. Replace `PlatformNav` with one "Back to the story" link that returns to the item's story home (the
   tool's `home`, the record's `RECORD_HOMES` key, or `/` for /explore and /history). Keep "Edit data"
   for signed-in users.
2. Link /dashboards only from a "See every chart" link under the embedded charts.
3. Delete `app/tools/visual-kinds/` (a developer test page). Keep its fixture
   `docs/declutter/fixture-visual-kinds.md` if any test reads it (check first).

**Acceptance.** No page shows the eight-item platform menu. `npm run audit:routes` passes.
`/tools/visual-kinds` returns 404.

---

### WP9. Disperse the playbooks

**Goal.** Strategy and Implementation material sits in its stage, not after the story.

**Files.** `content/annex-playbooks.md`, `content/channels.md`, `content/message.md`,
`content/workstreams.md`, `content/annex-technology.md`, `lib/heading-slug.ts`, `lib/flow.ts`,
`lib/tools/meta.ts`, anchors, ledger.

**Steps.**
1. Move C.1 → end of `channels.md` (`channels-sec-c-1`); C.2 → end of `message.md` (`message-sec-c-2`);
   D.1 → `workstreams.md` under 15.3 (`workstreams-sec-d-1`).
2. Move the USSD Flow Builder home to `workstreams-sec-15-3` (Workstream 9 runs SMS, USSD and voice), and
   the Ward Link and QR Builder home from `annex-technology-sec-e-1` to `workstreams-sec-15-3`.
3. Remove `annex-playbooks` from `SECTIONS` and the `working` act. Leave `content/annex-playbooks.md` in
   place only if `check:preservation` requires the file (check the protected list first).
4. Add a link from the Assumptions Panel's section (7.4) to E.2.

**Acceptance.** No after-story part except "The evidence behind it". Every Appendix C id from the
playbooks lands. Checks as in WP3.

---

### WP10. Text to visual, repeats

**Goal.** Visuals carry the long chapters; nothing repeats.

**Steps.**
1. Fourteen workstreams: in `WorkstreamMap` (`components/story/Visuals.tsx:375`), make each card jump to
   its sub-section heading. Show the map first; keep every sub-section's text behind its existing fold.
   No text is removed.
2. Evidence and sources, A.2: put the Sources and Data Gaps tool first, and the all-sources table behind
   a fold. The table is kept (it is the evidence base).
3. Remove the repeated offer sentence in `ask.md` (the blockquote under "What the record does not yet
   show"), since the lead says it. Ledger it.

**Acceptance.** Workstreams opens on the map; each card lands on its section. Word counts on load
(`scripts/measure-text-load.mjs`) fall; total words in `content/` fall only by the ledgered repeat.

---

### WP11. Tools panel by stage, recently used

**Files.** `components/story/StoryBar.tsx` (`ToolsSheet`), `content/welcome.md`.

**Steps.**
1. Group the panel by stage (use `actOf(chapterOf(home))`), not by chapter.
2. Pin a "This week" group first (the `week` chapter's tools and records).
3. **(new)** Add a "Recently used" row: tools whose `sx-used-<slug>` flag is set, most recent first. To
   sort by recency, store a timestamp instead of `"1"` (keep reading `"1"` as "used, no time" for old
   flags).
4. Convert the Welcome's 36-tool table to an "Every tool" button (WP1 step 6 depends on this).

**Acceptance.** Opening the panel shows This week first, then Recently used, then the six stages.

---

### WP12. "Incumbent" lines check

**Blocked on** §10, Q4.

**Lines.** `content/message.md:66, 74, 111, 166`; `content/needs.md:246, 280`. They criticise the county
government's record and slogan; they don't name a 2027 candidate. Firefly decides whether they stay
(governance data) or are reworded (rival-adjacent). Ledger any change.

---

## 9. Technical guardrails for every change

| Guardrail | Why | How |
|---|---|---|
| Edit `content/`, then rebuild `public/content/` | `public/content` is generated | `npm run content`; `build-content.ts --check` is in `verify` |
| Every moved or removed heading id gets a redirect | Shared links must keep landing (`build-anchors.ts` fails on an orphan) | `lib/anchors/flow-2026-11.json` + register in `scripts/build-anchors.ts` + `npm run anchors` |
| Every embed home must exist | A stale key renders nothing, silently | `scripts/verify-mounts.mjs` (in `verify`) |
| Every content change has a ledger entry | D7; `check:content` fails otherwise | `docs/flow-2026-11/ledger.json`, added to `check:content` in `package.json` |
| Protected files are never deleted | `check:preservation` fails on a missing file | Keep `content/cover.md`; check before removing any file |
| No visible numbering | D4 | Keep heading numbers in source (they make ids); never render them; never add "Part I" style labels |
| No new rival content | D5 | `docs/rivals-2026-11/DECISION.md` |
| Moves are verbatim | AGENTS.md: deterministic, verifiable | Compare word counts before and after |
| Mobile first | The audience reads on phones | Check at 390px; run `scripts/measure-chrome-occlusion.mjs` for chrome changes |

---

## 10. Open decisions for Firefly

Do not implement these without an answer.

| # | Question | Why it matters | Blocks |
|---|---|---|---|
| Q1 | Is the platform **built and running** (the Welcome's voice) or **offered for approval** (the brief, receives and ask)? The site says both | The tense of the brief, receives and ask, and whether "The ask" stays as the close | WP1 step 5 |
| Q2 | Opening title and the footer's status line, to replace "Analysis, Strategy and Direction", "Prepared for Dr. Mulu personally", "please do not circulate" and "Proposal for discussion" | P1 and D3 | WP1 |
| Q3 | Wording of the single general-election goal (8.1 lead and heading) | D6 | WP5 |
| Q4 | Keep or reword the six "incumbent" lines | D5 | WP12 |
| Q5 | What replaces the dated items: 14.1 "The first four weeks" (counts from 1 Sept 2026) and 23.1 "The window that sets the pace" (window ends 30 Nov 2026) | They go stale this month | WP5 |
| Q6 | The stage blurbs in §5.1 | Shown on every part opener | WP2 |

---

## 11. Self-check, limits and assumptions

**Coverage.** Every item in §3 is placed in §5 and §6, or marked for cutting. The cuts are:
- the developer test page `/tools/visual-kinds` (WP8);
- the second `fig-cover-map` on `/` (the hero carries the same figures; kept in `/full` and print);
- the brief's three stats (the Opening's four numbers take over);
- the Welcome's 36-tool table (the Tools panel takes over);
- the repeated offer sentence in `ask.md`;
- `PlatformNav` (replaced by a back link).

In each case a visual or component takes over the job (D7). The `cover` and `annex-playbooks` chapters
leave the flow, but their text moves (to the footer and to their stages); none of it is deleted.

**Decisions respected.** One scrolling story in the agreed order. Tools stay inside the story. Everything
is viewable; login only edits. No numbers are shown. Past results are kept. No rivals are added. No text
is cut without a visual taking its job.

**Not accessed.** The live site (the audit environment's network proxy refused the connection). Not
verified:
- how the live site renders on a phone;
- whether `PLATFORM_TEAM_LOGIN` is on in production;
- whether the database holds records (so whether P7 is happening now);
- the real empty and loading states;
- the team's usage patterns.

**Assumptions.**
- The commercial close stays, at the end of Implementation (§10, Q1).
- "This week" is a new name for a merge of existing sections, not a new feature.
- New chapter ids `winning`, `known`, `spend`, `week` are unused in `lib/anchors/*.json` (checked at
  `333afa8`).
- `data/section-heights.json` and `scripts/visual-coverage.mjs` may need regenerating after chapters
  move; check their `--check` output.

---

## Appendix A. Every tool: current home → new home

Source: `lib/tools/meta.ts` (`home`). Unchanged homes are listed so the table is complete.

| Tool (slug) | Current home | New home | WP |
|---|---|---|---|
| Register Growth Tracker (`register-growth`) | `votes-sec-2-1` | unchanged | — |
| Polling Station Explorer (`polling-stations`) | `votes-sec-2-1` | unchanged | — |
| 2017 to 2022 Swing Viewer (`swing-viewer`) | `votes-sec-2-2` | unchanged | — |
| Pareto Ward Planner (`pareto-wards`) | `votes-sec-2-3` | unchanged | — |
| Coalition Path Builder (`coalition-path`) | `votes-sec-2-4` | `winning-sec-2-5` | WP3 |
| Constituency Scorecard (`constituency-scorecard`) | `votes-sec-2-4` | unchanged | — |
| Winning-Number Simulator (`winning-number`) | `votes-sec-2-5` | `winning-sec-2-5` | WP3 |
| Kitui Map Studio (`map-studio`) | `kitui-sec-1-2` | unchanged | — |
| Drought and Livelihood Watch (`drought-watch`) | `needs-sec-3-2` | unchanged | — |
| County Money Explainer (`county-money`) | `needs-sec-1-5` | unchanged | — |
| Ward Equity Analyzer (`ward-equity`) | `needs-sec-3-7` | `spend-sec-3-7` | WP3 |
| Service-Delivery Tracker (`service-delivery`) | `needs-sec-3-7` | `spend-sec-3-7` | WP3 |
| Channel Mix by Sub-county (`channel-mix`) | `news-sec-4-3` | unchanged | — |
| Offline Waterline (`offline-waterline`) | `news-sec-4-4` | unchanged | — |
| Assumptions Panel (`assumptions`) | `diagnosis-sec-7-4` | unchanged | — |
| Governor Nomination Path (`nomination-path`) | `goal-sec-8-1` | Timeline milestone heading | WP5 |
| Ward Allocation Simulator (`allocation`) | `message-sec-10-1` | unchanged | — |
| Issue-to-Message Matcher (`issue-matcher`) | `message-sec-10-1` | unchanged | — |
| Fact Card Generator (`fact-cards`) | `message-sec-10-2` | unchanged | — |
| Message Studio (`message-studio`) | `message-sec-10-4` | unchanged | — |
| Message Assignment Matrix (`message-matrix`) | `voters-sec-11-2` | unchanged | — |
| Youth and New Voter Calculator (`youth-voters`) | `voters-sec-11-3` | unchanged | — |
| Ward Priority Scorer (`priority-scorer`) | `channels-sec-12-1` | unchanged | — |
| Zone Effort Planner (`zone-effort`) | `channels-sec-12-1` | unchanged | — |
| Radio Planner (`radio`) | `channels-sec-12-3` | unchanged | — |
| Weekly Content Calendar (`calendar`) | `channels-sec-12-6` | `week-sec-12-6` | WP4 |
| Governor Race Calendar (`race-calendar`) | `timeline-sec-14-1` | unchanged | — |
| Voter Density Finder (`voter-density`) | `workstreams-sec-15-3` | unchanged | — |
| Polling Agent Planner (`polling-agents`) | `workstreams-sec-15-3` | unchanged | — |
| KPI Ladder (`kpis`) | `success-sec-18-2` | unchanged | — |
| Language and Compliance (`compliance`) | `lawful-sec-19-2` | unchanged | — |
| Sources and Data Gaps (`sources`) | `annex-evidence-sec-a-1` | unchanged | — |
| Ward Dossier (`ward-dossier`) | `annex-evidence-sec-b-1` | `votes-sec-b-1` | WP4 |
| Ward Comparison (`ward-compare`) | `annex-evidence-sec-b-1` | `votes-sec-b-1` | WP4 |
| USSD Flow Builder (`ussd`) | `annex-playbooks-sec-c-2` | `workstreams-sec-15-3` | WP9 |
| Ward Link and QR Builder (`links`) | `annex-technology-sec-e-1` | `workstreams-sec-15-3` | WP9 |

36 tools; 9 move.

## Appendix B. Records, charts, visuals, countdowns, feed

Source: `lib/story/embeds.ts`.

| Item | Kind | Current home | New home | WP |
|---|---|---|---|---|
| `projects` | Record | `needs-sec-3-7` | `spend-sec-3-7` | WP3 |
| `dispatch` | Record | `news-sec-4-4` | `workstreams-sec-15-3` | WP4 |
| `tests` | Record | `message-sec-10-4` | `workstreams-sec-15-1` | WP4 |
| `calendar` | Record | `channels-sec-12-6` | `week-sec-12-6` | WP4 |
| `briefs` | Record | `engagement-sec-13-4` | `week-sec-13-4` | WP4 |
| `cadence` | Record | `engagement-sec-13-5` | `week-sec-13-5` | WP4 |
| `implementation` | Record | `workstreams-sec-15-1` | unchanged | — |
| `field` | Record | `workstreams-sec-15-3` | unchanged | — |
| `kpi-actuals` | Record | `success-sec-18-2` | unchanged | — |
| `channel-audit` | Record | `success-sec-18-5` | unchanged | — |
| `offline` | Chart | `news-sec-4-4` | `workstreams-sec-15-3` | WP4 |
| `reach` | Chart | `record-sec-6-5` | `known-sec-6-5` | WP3 |
| `sentiment` | Chart | `diagnosis-sec-7-2` | unchanged | — |
| `calendar` | Chart | `channels-sec-12-6` | `week-sec-12-6` | WP4 |
| `implementation` | Chart | `workstreams-sec-15-1` | unchanged | — |
| `field` | Chart | `workstreams-sec-15-3` | unchanged | — |
| `kpis` | Chart | `success-sec-18-2` | unchanged | — |
| `voters` | Pack chart | `votes-sec-2-4` | unchanged | — |
| `sectors` | Pack chart | `needs-sec-3-7` | `spend-sec-3-7` | WP3 |
| `proof` | Visual | `position-sec-9-1` | unchanged | — |
| `paradox` | Visual | `position-sec-9-2` | unchanged | — |
| `ask` | Visual | `ask-sec-23-1` | unchanged | — |
| `roles` | Visual | `engagement-sec-13-2` | unchanged | — |
| `languages` | Visual | `channels-sec-12-4` | unchanged | — |
| `deliverables` | Visual | `receives-sec-21-2` | unchanged | — |
| `phase-now` | Visual | `timeline-sec-14-4` | unchanged | — |
| Countdown | Countdown | `goal-sec-8-1`, `timeline-sec-14-1` | unchanged | — |
| Change feed | Feed | `annex-evidence-sec-a-2` | Welcome (`welcome-sec-0-1`, or mounted after `welcome`) | WP4 |
| `PlatformMap` | Chapter extra | `platform` (end of flow) | `platform` (part 0) | WP2 |
| `ContactCard` | Chapter extra | `cover` | Footer | WP1 |
| `WorkstreamMap` | Chapter extra | `workstreams` | unchanged; becomes clickable | WP10 |
| `premium/Story` (four-step analysis) | Scroll story | `votes`, in a fold | `winning`, unfolded | WP3 |

Also rekey every `HEADING_INSERTS` entry (`components/MarkdownViewer.tsx:269`) whose heading moves.
At `333afa8` these keys move: `votes-sec-2-5` → `winning-sec-2-5`, `record-sec-6-2` → `known-sec-6-2`,
`needs-sec-3-7` → `spend-sec-3-7` (WP3), and `engagement-sec-13-4` → `week-sec-13-4` (WP4). The key
`annex-evidence-sec-a-2` stays (A.2 does not move). Search the map again for every id in Appendix C
before each WP, in case keys were added since.

## Appendix C. Heading id moves

For `lib/anchors/flow-2026-11.json` (`{"moves": {"<old>": "<new>"}}`). Sub-heading ids under each moved
heading (for example `-sec-2-5-1`) move with it; list them by running the section index before and after.

| Old id | New id | WP |
|---|---|---|
| `votes-sec-2-5` | `winning-sec-2-5` | WP3 |
| `record-sec-6-2` | `known-sec-6-2` | WP3 |
| `record-sec-6-3` | `known-sec-6-3` | WP3 |
| `record-sec-6-5` | `known-sec-6-5` | WP3 |
| `needs-sec-3-7` | `spend-sec-3-7` | WP3 |
| `engagement-sec-13-4` | `week-sec-13-4` | WP4 |
| `engagement-sec-13-5` | `week-sec-13-5` | WP4 |
| `channels-sec-12-6` | `week-sec-12-6` | WP4 |
| `channels-sec-12-7` | `week-sec-12-7` | WP4 |
| `annex-evidence-sec-b-1` | `votes-sec-b-1` | WP4 |
| `annex-playbooks-sec-c-1` | `channels-sec-c-1` | WP9 |
| `annex-playbooks-sec-c-2` | `message-sec-c-2` | WP9 |
| `annex-playbooks-sec-d-1` | `workstreams-sec-d-1` | WP9 |
| Goal 8.1 nomination paragraphs | Timeline milestone heading | WP5 (ids set once Firefly's wording is known) |

Also update in-content links that use the old ids, for example in `content/welcome.md`
(`/#channels-sec-12-6`, `/#annex-evidence-sec-b-1`, `/#annex-evidence-sec-a-2`). Redirects keep old
links working, but the site's own links should point at the live ids.

## Appendix D. Commands

```bash
npm ci                        # install
npm run content               # rebuild public/content from content/
npm run anchors               # rebuild lib/anchors/redirects.ts
npm run verify                # all data, content, anchor and mount checks
npm run check:content         # ledger check (add docs/flow-2026-11/ledger.json first)
npm run check:preservation    # protected files and counts
npm run lint
npx tsc --noEmit
npm run build
node scripts/measure-chrome-occlusion.mjs   # before and after WP7
node scripts/measure-text-load.mjs          # before and after WP10
npm run dev                   # check at 390px wide
```
