# September 2026 audit: what was implemented

The audit applied three rules to the proposal:

1. **Existing data and Firefly's own analysis only.** No new study, survey, poll, focus group or
   primary research forms strategy.
2. **No opinion polls anywhere**, not even "for reference only".
3. **Every candidate attribute comes from an official or documentary record.** This covers
   Dr. Mulu and every rival, in the nomination and the general election.

This file records how each part of the audit was carried out. The build now enforces rule 2
mechanically: `scripts/check-copy.ts` fails on any poll, pollster, survey or focus group in
content, components, figure specs, data modules or `lib/`. Election-day terms ("polling
station", "polling day") and KNBS statistical instruments are allowed, each with its reason.

## Removed

- **Annex C (published polls):**
  - the content file and its generated copy
  - the route, navigation and icon
  - the poll-margin block
  - the `published-polls-2026` analysis export
  - the Politrack and Mizani sources and the `poll.politrack.n` figure
  - the Mizani tests and the "polling deficit" glossary entry
  - the deficit working drawer entry
  - Old `#annex-polls-*` links redirect to Annex A.
- **Every poll share on the page:**
  - the competitive quadrant (rivals' "measured preference")
  - the Mizani slope chart
  - the "Countywide polling deficit −15.3" tile in §3.4
  - the poll-share caption in the §3.2 scenario block
  - the "measured preference shift" benchmark
  - the unused mini-scorecard that led with the poll deficit
  - Dr. Kasalu's "leading on measured preference" note
- **Every new-research commitment:**
  - the Kitui message lab and focus groups (§5.6.9–§5.6.11 and their rows in §5.3, §5.4, §5.5, §5.7, the cadence figure and the tier matrix)
  - the focus-group module of the research programme
  - the qualitative research facilitator
  - the "strategic polling firm"
  - "Polling samples"
  - the "7-day tracking poll"
  - USSD "live polling"
  - the survey-dependent segment sizing
  - the "Soft opposition" universe
  - the "baseline survey" language

## Revised

- **The Wiper nomination** now rests on party documents: an NEC resolution, or the 2027 nomination
  rules as filed with the IEBC and the Registrar of Political Parties. The pollster's terms of
  reference are gone. The reported method is described as a party-run countywide selection
  (Tier 3). The change runs through §1, §2.3, §5.8 (R1 and the delegate contingency), §6 and the
  decision panel.
- **Candidate attributes** in §3.5 and Annex B.5 state only what a record carries, and name the
  record where it is not yet in hand. The media, commentary and "critics / analysts allege"
  attributions are gone, as are claims about rivals' support bases. The incumbent's position in
  the Wiper nomination is stated as unestablished. Dr. Mulu's committee role is "member" until
  the committee records confirm more.
- **Workstream 12** scores polling stations from certified results (IEBC Forms 37A), not from
  doorstep voting intention. The doorstep form records contact and consent only, and the joint
  KPI is the opt-in rate on routed doors. Model variables that no official source publishes at
  that grain are corrected.
- **Strategy claims** carry their record:
  - the recognition deficit is a working hypothesis wherever it is used
  - the FY2014/15 evaluation and the "zero audit queries" line are held until the Auditor-General's reports are in hand, including for the rival comparison
  - the neglected-wards claim needs county development expenditure by ward
  - segment "core anxieties" are marked as hypotheses
- **Consistency:**
  - the stale ~86% / ~14% offline figures now read 73.8% / 26.2% by token
  - the health indicators are Tier 1 KDHS
  - Malombe's result is Tier 1
  - turnout is 61.7%
  - Kitui East sits outside the pool
  - the Week 1 comparison set is the two nomination rivals
  - Phase −1 runs from signature
  - there are nine dependencies
  - the six unassigned sub-counties get an explicit Week 2 rule
- **Annexes** are re-lettered A–F, with every cross-reference, heading and anchor updated
  (1,369 redirects, 0 orphans). The cover now counts six annexes.

## Records named but not yet in hand

The audit's "Add" items are official records. None was invented to fill a gap: each is named in
the text where the claim needs it.

| Record | Where it is needed |
|---|---|
| IEBC Forms 38C and 39C (2022 Senate, Woman Representative) | §2.2, §3.5, B.5 |
| IEBC 2013 governor declaration and Kenya Gazette notice | §2.2 |
| IEBC Forms 37A / 37B, 2017 and 2022 (ward and polling station) | §2.2, §3.4, §3.10, §5.6.5, Workstream 12 |
| IEBC 2022 MP declarations, Kitui East and Kitui South | §3.6 |
| Kenya Gazette notice of the Kitui Central MP result; the CBS award | §2.2, §2.8 |
| National Assembly and Senate committee records, Hansard | §2.8, §3.5, §4.1.1, B.5 |
| The FY2014/15 evaluation report and its issuing body; the M&E Champion designation | §2.8, §4.1.1 |
| Auditor-General: Kitui Central NG-CDF 2013–2025; NGAAF Kitui; county executive | §4.4.1, §5.2.1.2, §3.5, B.5 |
| Controller of Budget: county development expenditure by ward | §4.2 |
| Wiper NEC resolution; 2027 nomination rules and timetable | §2.3.2, §6.1 |
| Party nomination lists and IEBC gazetted nominations, 2027 | §3.5, §3.6, B.5 |
| Kenya Law: Article 180(7) and any judgment; rival litigation | §5.8.15, B.5 |
| Kenya Gazette: Malonza's appointments; Musila's Senate tenure | B.5 |
| Safaricom PLC annual reports (Mulila) | §3.5, B.5 |
| CA broadcast-licence register; Business Registration Service records | §2.7.1, §5.2.2.2 |

## Outside the website

- **`analysis/`**, the Python pipeline behind the analysis exports, no longer handles polls or
  surveys (follow-up change):
  - Stage 2 (poll uncertainty) and its maths module, tests and report are removed. The other
    stages keep their numbers.
  - Stage 3 drops the "nomination-poll leverage" model and the poll-share scenario. It keeps the
    competitive general-election model, the one the site shows. Its sensitivity chart is now
    based on the competitive range.
  - Stage 1 no longer parses the pack's poll table.
  - Stage 12 no longer exports `published-polls-2026` or reports poll findings.
  - The "baseline survey" is removed: its template, the recognition-gap feature in the Stage 4
    index (its weight moves to 2022 ward results), the survey axis in Stage 10 and the
    survey-based KPI in Stage 11.
  - Stage 1's check now flags any opinion-poll material that reaches the site.
  - The pipeline's rules (`analysis/CLAUDE.md` §5) now state the no-polls, no-new-research
    principle.
  - Every export the pipeline regenerates matches the file already on the site.
  - Every report has since been regenerated from the data pack (compiled 16 September 2026).
    The hand-edited findings and site-mapping reports came out unchanged. The Stage 1 audit
    now counts claims against the restructured site (950 claims across 16 content files) and
    lists 7 passed checks. No poll figure from the pack reaches a report or an export.
  - One Stage 1 test still fails: the IEBC annex row in
    `data/templates/register_2026_by_county.csv`, supplied by the campaign on 17 September
    with its document URL, is gitignored and needs re-entering. It is not in the pack.
- **Left as history:**
  - **`scripts/rebuild/`, `scripts/audit-*.json`, `scripts/visual-inventory-plan.json`** are
    records of earlier migrations and mention the old Annex C as history.
  - **`components/markdown/KpiPhaseBlock.tsx`** is no longer mounted: `fig-5-4-ladder` carries
    its targets (`docs/visual-premium/REPLACEMENTS.md`).
