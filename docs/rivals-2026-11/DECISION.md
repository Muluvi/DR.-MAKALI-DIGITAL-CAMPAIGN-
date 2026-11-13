# The rivals pass: Firefly's decision (14 November 2026)

**Decision.** Firefly Management, which owns and runs the platform, decided that no current 2027
rival for the Kitui governorship is mentioned anywhere on the site, and that the material about
answering attacks from opponents is removed. Three questions were settled with Firefly before any
change:

| Question | Firefly's answer |
|---|---|
| Past election results that name candidates | Keep the data on previous elections and how candidates performed. Do not mention the current 2027 rival candidates. |
| Risks and response, the rapid-response desk, the runbooks | Remove them. |
| The race for 2027 chapter | Remove the whole chapter. |

## What was removed

- **Chapters:** The race for 2027 (`race`), Risks and response (`response`) and Runbooks
  (`annex-runbooks`), with their figures: the nomination method, the field at the ballot, the
  risk register, the response matrix and SLA, the holding positions and the rapid-response flow.
- **Sections:** 9.3 Answering the charge of coldness; 10.5 Countering disinformation; the
  four-hour response cycle in 15.3.1.
- **Rivals everywhere else:** every line naming, profiling, comparing or monitoring a 2027 rival
  (the "case against" names, the two nomination rivals in the audit, the competitive baseline and
  brief, the ad-library comparison, the "both Wiper rivals" hero figure, the ward-fund line, the
  Ngilu-associated station labels, now "politically affiliated ownership", and the
  rival-gap figure `gap.wambua-to-benchmark-2022`).
- **Attack response everywhere else:** the crisis tier and crisis role, red-team drills and their
  indicators, rebuttal rows, the opponent-claim field reports, the incident screen in the field
  terminal.
- **Platform:** the Competitor watch and Rapid response collections in the workspace, the
  rapid-response dashboard chart, the contenders, severity-tier and risk lists in the data editor
  and data explorer, and the Rapid Response Runbook, Rumour Log and Rival & Ad-Library Monitor
  entries in the Tools hub.
- **Data and code:** `data/competitors.ts`, `data/escalation.ts`, `data/risks.ts`, the components
  that drew them, and the internal competitor benchmark in the analysis pipeline (Stage 8, its
  report and its template).

## What stayed

- The results of the 2013, 2017 and 2022 races, with candidates' names, as history: the results
  figure, the electoral history, the disputed Musila total, the evidence table.
- The incumbent's record (term-limited under Article 180(7), so not in the 2027 field).
- The campaign's own conduct commitments (no disinformation, no voter suppression), reworded so
  they name no one.
- The nomination window chip, which no longer links to the removed chapter.

## How the guards account for it

The site's content guards fail on any unlogged deletion. This pass is logged, and every guard
excuses only what it logged:

- `docs/rivals-2026-11/ledger.json`: every changed section, the words removed and the removed text
  (`scripts/rivals-2026-11/build-ledger.mjs`; `CHANGES.md` is generated from it).
- `docs/rivals-2026-11/fences.json`: the figure fences removed and the text-version fences edited.
- `docs/rivals-2026-11/removed-files.json`: the files removed.
- `docs/rivals-2026-11/count-drops.json`: each preservation count the pass lowered, with its floor.
- `lib/anchors/rivals-2026-11.json`: where a shared link into a removed heading now lands
  (`scripts/rivals-2026-11/anchors.mjs`).

`scripts/rivals-2026-11/retired.mjs` is the one place the guards read this record from.

## What it does not change

The repository is public, and git history keeps every earlier version of the removed material.
Removing it from history would mean rewriting `main`, which is a separate decision for Firefly.
