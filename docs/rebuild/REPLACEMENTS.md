# Replacement log

Every passage of prose removed in the rebuild, and what removed it. Brief non-negotiable 4: prose
is removed only by an explicit cut in the cut table (§C), or because a visual now does its job, in
which case the visual and a one-sentence takeaway replace it. Everything else stays in full.

Grounds used below:

- **Cut table: *row*.** The brief's cuts-and-moves table names the passage.
- **NN1 / NN2 / NN3.** Non-negotiable 1 (no polls in the argument, no new polling), 2 (no
  engagement money, no campaign finance) or 3 (no remote framing, no credentials).
- **NN5.** Non-negotiable 5: missing data is `[DATA NEEDED]`, never estimated. The passage stays;
  the estimate inside it is replaced by the named gap.
- **Stale orientation.** A one-line standfirst from a retired thirty-section chapter, left inside a
  new section by the migration and describing a section that no longer exists.
- **Visual.** The figure named replaces the prose, and its table view carries every value.

Moves are not listed here; `lib/anchors/rebuild-moves.json` and the mapping in `docs/rebuild/RECON.md`
record them. Where a passage was only reworded (a number corrected, "spend" to "effort"), it is
recorded in `docs/rebuild/CONFLICTS-RESOLVED.md` instead.

## Phase 2: cuts and fixes

| Where it was | What was removed | Ground | Replaced by |
|---|---|---|---|
| §2.0 | The heading "2.0 What the official record shows", which carried no body | Stale orientation | The section's standfirst |
| §2.2, end | "The ground as it is: how the nomination will be decided, the evidence standard…" | Stale orientation (old §3 standfirst) | — |
| §2.3.2 | "(Section C.2 sets the parameters to judge it against)" | Cut table: §3.1.3–3.1.4 party poll method | — |
| §2.6 | "What Digital CAN Do", item 2: the diaspora as "active campaign donors and remote family influencers" | NN2 (campaign finance), NN3 | — |
| §2.6 → §3.8 | The "What digital can / cannot do" lists | Moved (split: the digital ceiling is analysis) | — |
| §2.1 → Annex B.1 | The 40-ward list | Cut table: §3.3.3 (full list → Annex B) | Moved intact |
| §3.2 | The 40-row "Comprehensive 40-Ward Registration Ranking" markdown table | Visual | `ward-ranking` figure; its table view carries all 40 rows and the cumulative share |
| §3.4 | "YES. THERE IS AN ABSOLUTE, DIRECT 1:1 OVERLAP", the "3 of the top 7" and "2 of the top 11" counts, and "Severe Deficit" labels | Consistency fix 4 | "Partly. Five of the twelve largest wards…" |
| §3.4 → §4.2 | "Strategic Operational Mandate" (the effort weighting) | Cut table: §3.5 zone weighting → 4.2 | Moved; "24 deficit wards" corrected to 21 |
| §3.5 | Kasalu "current frontrunner in public preference at 37.4%"; Wambua "declining from 16.3% to 14.3%" | NN1; cut table: §3.3.2 rebuild on certified results | Their certified 2022 results |
| §3.5 | "Strategic Diagnosis" and "The counter-evidence this diagnosis has to survive" | Moved to 3.11, where the diagnosis is argued; the counter-evidence paragraph duplicated 3.11's and was merged into it | — |
| §3.5 | "Under the official constitutional record, Article 180(7)… establishing an open-seat election" | Consistency fix 1 (unclear → 5.8 only) | One sentence pointing to 5.8.15 |
| §3.8 | "Empirical Reach" estimates: radio ~420,000, SMS ~320,000, mobile money ~180,000 across 1,800+ kiosks, markets ~280,000, churches ~350,000 | NN5 | `[DATA NEEDED]` with the closing document for each |
| §3.8.2 | "The operating conditions", whole subsection | Cut table: §2.3 Operating conditions (covered in 2.6, 2.7, 3.8) | — |
| §3.9 | The "Fix" column of the profile table, and "Item 5 is the one to fix first" | Cut table: §1A.2.5 (fixes → 4.7) | Moved to 4.7 |
| §3.9, issue 6 | "in a contest the site itself measures at 15.3 points behind" | NN1 | — |
| §3.10, item 1 | "(such as the Mizani Africa surveys of June 2026 and 7 August 2026)… (e.g., Kasalu 37.4% vs. Mulu 22.1%)" | NN1 | The named gap and the document that would close it |
| §3.10.1 | "formally cataloged for commissioning in the Phase −1 baseline survey"; "requires primary household sampling"; "never been measured by an empirical survey" | NN1 (no new surveys) | Each gap named with the existing document that closes it |
| §3.11 | The decision-rules table | Cut table: §1A.4 Decision rules → 4.8 | Moved to 4.8 |
| §4.1.0 | "The mandate": the orientation line and five paragraphs (the developmental inflection point; the nomination bottleneck; "Dr. Mulu is already in the conversation"; the Firefly layer; the core narrative restated) | Cut table: §2.1 The mandate (cut prose; M&E/verification asset → 4.1) | The M&E paragraphs stay, as "The asset no rival holds" |
| §4.4 | Standfirst from old §7 | Stale orientation | — |
| §4.4.5 | "closing fundraising appeals" in the scarcity row | NN2 | — |
| §4.4.6 | "Only 11.7% of Kitui residents have health insurance"; "1 in 4 children in Kitui is stunted"; "93% of Kitui families still cook with solid fuels" | NN5 (4.1.6 itself says these are untiered and not to be published) | `[DATA NEEDED]` with the closing KNBS document |
| §4.3.3, 4.3.6, 4.3.7 and three smartphone shares | Segment sizes: ~80,000–105,000 agro-pastoralists; ~25,000–35,000 formal sector; "150,000+" diaspora; "~70%+", "~45%–55%", ">90%", ">95%" smartphone shares | NN5; fig-4-3 "no invented sizes" | `[DATA NEEDED]` with the closing document |
| §4.3.8 | "Summed, the sizes come to roughly twice the register" | No longer true once the invented sizes were removed | A sentence saying where sizes are sourced, derived or needed |
| §4.5 | Standfirst from old §6A | Stale orientation | — |
| §4.6 | "It is a statement of where the campaign's weight goes, not a schedule of what anything costs" (the second clause); "Vernacular radio reach ~420,000"; "Direct 2G SMS reach ~320,000"; "~72,000 (13.6%)" and "36.2%" | NN2; NN5; consistency fix 2 | The modelled reach on the July 2026 register, and `[DATA NEEDED]` for radio |
| §5.1 | Standfirst from old §8 | Stale orientation | — |
| §5.1.3 | "Campaign finance administration — expenditure returns, IEBC financial compliance filing…" | NN2 (no campaign-finance material) | — |
| §5.1.3 | "Commissioning the nomination tracking poll. Section C.2 specifies the instrument…" | NN1 (no new polling) | The campaign-owned field recommendations (consistency fix 6) |
| §5.1.7 | "Online fundraising… Secure donation page integrated with M-Pesa… Email, SMS and WhatsApp fundraising to diaspora and local supporters…"; "into donors" | NN2 | — |
| §5.3 | Phase −1 KPI "Measured preference movement: deficit reduced to ≤10 points" | NN1; brief 5.6 | "Profile corrections shipped, 6 of 6 by Week 2" |
| §5.3.2 | Reason 2: "It brackets both published Mizani rounds…" | NN1 | — (the window keeps its two other reasons) |
| §5.3.7 | "the donation portal live"; "with donation and volunteer forms" | NN2 | — |
| §5.4 | Standfirst from old §9 | Stale orientation | — |
| §5.4.1–5.4.3 | "Online fundraising launch"; "fundraising every three weeks"; "Final fundraising surge"; the three "Online donors" KPIs; "Spend reconciled against the agreed envelope and the campaign's IEBC return" | NN2 | — |
| §5.4.7 | "diaspora fundraising" | NN2 | — |
| §5.5.3 | Deliverable row "Tracking survey wave, bi-weekly, Firefly commissions the instrument" | NN1 | — |
| §5.6 | Standfirst from old §11, and the opening paragraph on the 40.0% and 55.0% preference thresholds | Consistency fix 8; NN1 | One sentence: every indicator is observable on his channels or the SMS list |
| §5.6.4 | R-01 "Aided name recognition… Sub-county CATI booster, N = 600"; R-05 "First-choice preference… Rolling tracking poll, N = 400 CATI" | NN1; brief 5.6 | R-01 followers located in Mwingi; R-05 Kikamba-first share of output |
| §5.6.5 | "Nomination Window Tracking Poll Design (The 6-Week Squeeze)", whole block | NN1 | — |
| §5.6.5 (figure data) | Research module 1 "Baseline countywide quantitative poll" and module 3 "SMS micro-surveys" | NN1 | Module 1 the Week 1 channel audit; module 3 the inbound feedback log |
| §5.6.1 (KPI data) | NW-01 "Wiper Ballot Preference Share" (tracking poll), NW-02 "Northern Sub-County Name ID" (CATI), NW-03 "Fiscal Integrity Salience" (survey) | NN1; brief 5.6 | Reach share in the pool, followers in Mwingi, consented contacts in the pool |
| §5.7 | Standfirst from old §12 | Stale orientation | — |
| §5.7.8 | "a monthly digital advertising spend summary on the campaign website, reconciled to the returns we file" | NN2 | "a monthly summary of every paid placement" |
| §5.8.10 | "The August 2026 published survey shows…" | NN1 | Her certified 2022 result |
| §5.8.14 | "the estimated 1,200 to 1,500 official delegates" | NN5 | `[DATA NEEDED — Wiper delegate register]` |
| §6.1 | Open-item rows for "Mizani sample sizes" (polls are reference only) and the KNBS 2023/24 ICT row (closed: received 17 September 2026) | NN1; closed | — |
| §6.3 | Standfirsts from old §16; "Between June and August 2026 the front-runner gained 6.1 points to Dr. Mulu's 1.9" | Stale orientation; NN1 | — |
| §6.3.1 | "The published trend has Dr. Mulu at 22.1% against a front-runner at 37.4%" | NN1 | "Half the register, 51.7%, lives where he has never held office" |
| §6.3.2 | "Where the contest stands. Dr. Mulu is at 22.1% against… 37.4% — a 15.3-point deficit…"; the three-step list (Analyse, Strategise, Direct) | NN1; cut table: §0.1 The ask → 6.3, trimmed (the steps are stated once, in 1.4) | Both rivals' certified results; one sentence pointing to 1.4 |
| Annex C.1 | The "Gap" column; "The deficit, within the Mizani series… a real signal"; "Honest deficit assessment…"; "this is an open seat" | NN1 (polls for reference only); consistency fix 1 | Method-difference notes for each round |
| Annex C.2 | "What the poll would measure", whole section | Cut table: §3.1.3–3.1.4 party poll method; weighting | — |
| Annex C.3 | "Kitui Central's weight in the vote", whole section | Cut table: §3.1.3–3.1.4 | — |
| Annex D | The segment-size reconciliation (~97,000 / ~77,000 / ~45,000) and "When the Phase −1 baseline survey returns…" | NN5; NN1 | One note: the grids assign messages and carry no sizes |
| Annex F.12 | "Polling movement: changes in published surveys…" | NN1 | — |

## Phase 3: visuals

Each figure below is built from a spec in `lib/register/specs/`; its table view and
`public/data/<id>.csv` carry every value the replaced passage held.

| Where it was | What was removed | Ground | Replaced by |
|---|---|---|---|
| Cover, hero | The headline "the intelligence behind what you already publish" | Brief §C (cover title) | The brief's title, as the page's one H1 |
| Cover | `content/cover.md` H1, a second copy of the same title | Duplicate H1 on /full | The hero H1 |
| Cover, preface | The "state of the race" strip: poll shares Kasalu v Mulu, "15.3 points behind", the offline share | NN1; cut table: hero stat strip | `fig-cover-map` (tile map, pool shaded, four data-only figures) and `fig-cover-spine` |
| After §6 | The closing hero visual and the voter projections chart | NN1 (poll-derived projection); cut table: hero stat strip | — (the four cover figures carry the data-only framing) |
| §1.2 | `election-timeline` figure | Visual | `fig-1-1-timeline` (nomination window drawn T3) |
| §1.3 | — (added, nothing removed) | Visual | `fig-1-3-objectives`, linking each objective to its finding, strategy and measure |
| §1.4 | `operational-swimlanes` figure | Visual | `fig-1-4-flow` |
| §1.5 | The five-row objectives table (objective, measure, target, finding, indicator) | Visual | `fig-1-5-scorecard`: empty gauges; its table carries objective, baseline, target, indicator. Finding references move to `fig-1-3-objectives`. |
| §2.1 | — (added) | Visual | `fig-2-1-register` |
| §2.2 | — (added) | Visual | `fig-2-2-results` |
| §2.3 | — (added) | Visual | `fig-2-3-nomination` |
| §2.4 | — (added) | Visual | `fig-2-4-people` |
| §2.5 | — (added) | Visual | `fig-2-5-budget` |
| §2.6 | `platform-sizing` figure: five platforms as ranges (Meta Audience Insights, no dated export cited) and the sentence introducing it | NN5 | The named gap `[DATA NEEDED — Meta Audience Insights export, Week 1]`, and `fig-2-6-connectivity` |
| §2.7 | `radio-gatekeepers` figure | Visual (C-20) | `fig-2-7-media`: owners, stations, placement or monitoring |
| §2.8 | — (added; the asset table stays, it carries the strategic application) | Visual | `fig-2-8-record` |
| §2.9 | The channel table (channel, handle, status) | Visual | `fig-2-9-channels`: the same five rows, plus the four-candidate comparison as named gaps |
| §3 opening | `register-map` figure (the register grouped by constituency) | Visual | `fig-3-2-register-map`, in §3.2 |
| §3.1 | `threshold-build-up` and `register-growth` figures | Visual | `fig-3-1-funnel`: register → ballots at the constant → benchmark, with the 2022/2026 register toggle |
| §3.2 | `ward-ranking` figure (the 40 wards ranked; the table itself moved to Annex B.1 in Phase 2) | Visual | `fig-3-2-register-map`: tile map and a one-axis Pareto; its table carries rank, voters, share and running total for all 40 |
| §3.3 | `paths-to-threshold` figure | Visual | `fig-3-3-paths`: two stacked bars per route against one 200,000 line; Path D labelled the trap |
| §3.4 | — (added) | Visual | `fig-3-4-footprint` |
| §3.5 | — (added) | Visual | `fig-3-5-field` |
| §3.6 | — (added) | Visual | `fig-3-6-party-flow` |
| §3.7 | — (added) | Visual | `fig-3-7-zones` |
| §3.8 | `reach-split` figure | Visual | `fig-3-8-ceiling`: one stacked bar of the July 2026 register, all three segments modelled and hatched |
| §3.8.1 | `offline-channels` figure: six channel reach counts (420,000 radio, 350,000 church, 320,000 SMS, 280,000 markets, 250,000 USSD, 180,000 agents), three with no source and none sourced to a Kitui figure | NN5 (C-17) | The `[DATA NEEDED — …]` lines already in §3.8.1, one per channel |
| §3.9 | The six-row profile-issues table (#, as displayed, the issue) | Visual | `fig-3-9-audit`: the profile mock numbered 1–6, with the same six rows in its table, and the four audit figures as named gaps |
| §3.10 | `targeting-summary` figure: eight §3.4 findings recomputed, including the stale "5 of the top 11 wards" | Visual; stale figure | `fig-3-10-gaps`, generated from every `[DATA NEEDED]` in the document; the findings it summarised are each drawn in §3.1–3.4 |
| §3.11 | — (added) | Visual | `fig-3-11-evidence` |
| §4.1 | — (added) | Visual | `fig-4-1-message-house` |
| §4.2 | The zone × phase effort table (share of population, three phases) | Visual | `fig-4-2-effort`: effort tile map and heatmap; its table carries the population share and every phase value |
| §4.3.8 | `audience-segments` figure (segment sizes, several unsourced) | Visual; NN5 | `fig-4-3-segments`: three sizes derived from the census and marked modelled, three as `[DATA NEEDED — …]` |
| §4.4 | `message-house` figure (the three message pillars; the position now sits in `fig-4-1-message-house`) | Visual | `fig-4-4-message-region`: region × message, and the language rules |
| §4.5.5 | The seven-day "now / after" table | Visual | `fig-4-5-calendar`: the same seven days, coloured by pillar, with both columns in each cell and the table |
| §4.6 | `effort-rebalance` figure | Visual | `fig-4-6-channel-shift`: slope of effort shares, and station posture from §2.7 |
| §4.7 | The six-row fixes table (order, finding, before, after) | Visual | `fig-4-7-profile-fixes`, PhD first |
| §4.8 | The seven-row decision table (if the audit finds / the strategy changes to) | Visual | `fig-4-8-decision-rules` |
| §5.1.2 | The fourteen-row owner table (owner, WS, workstream, contribution, level) | Visual | `fig-5-1-workstreams`, coloured and bordered by owner; the per-level detail stays in §5.5 |
| §5.2 | — (added) | Visual | `fig-5-2-workstream-panels` |
| §5.3 | — (added) | Visual | `fig-5-3-four-weeks` |
| §5.4 | — (added) | Visual | `fig-5-4-phases`, on the same date axis as `fig-1-1-timeline` |
| §5.5.2 | The scope-levels table (Lean, Standard, Premium) | Visual | `fig-5-5-cadence`: the cadence at Level 2 and the depth by level; rows for weekly brief, attribution, upskilling, red-team drills and arid-belt reach are carried in the §5.5.1 prose and §5.5.3 schedule |
| §5.6 | — (added; the two scorecards stay, they carry definitions and methods) | Visual | `fig-5-6-kpis` |
| §5.7.3 | The decision-rights table | Visual | `fig-5-7-approval`: approval path and escalation ladder; every row in its table |
| §5.8 | The six-row risk table | Visual | `fig-5-8-risk`: likelihood × impact matrix with both branch diagrams; owner, why and mitigation in its table |
| §5.9 | — (added) | Visual | `fig-5-9-team` |
| §6.1 | The numbered list of eight dependencies | Visual | `fig-6-1-dependencies`, the three gating items marked; each item's detail in its table |
| §6.2 | — (added) | Visual | `fig-6-2-open-items`, generated from every marker in the document |
| §6.3 | — (added) | Visual | `fig-6-3-decision` |
| §5.2.1.1 | ASCII diagram: "What happens to a report" (seven boxes joined by arrows) | Visual (brief §D.4) | `fig-5-2-1-report-flow` |
| §5.2.3.2 | ASCII diagram: the field ↔ digital loop | Visual (brief §D.4) | `fig-5-2-3-field-loop`, two lanes |
| §5.2.3.3 | ASCII block: the proposed USSD menu | Visual (brief §D.4) | `fig-5-2-3-ussd-menu`, the six options numbered on a phone-screen mock; Kikamba and English labels in its table |
| §5.2.1.2 C | `ussd-menu` figure: a second, different USSD menu (four options, including an unsourced KSh 85/kg ndengu floor price) | One menu, one owner: Section 5.2.3.3 | A sentence pointing to `fig-5-2-3-ussd-menu`; the charter's opt-out requirement moves onto that figure as a note |
