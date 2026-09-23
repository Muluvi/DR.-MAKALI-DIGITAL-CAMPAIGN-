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
