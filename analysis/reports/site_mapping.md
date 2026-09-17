# Proposed site mapping

Which exported JSON file belongs in which site section. Nothing is copied into the site until this is approved.

*Kitui 2027 analysis pipeline · data as of 2026-09-16 · generated 2026-09-17*


## Proposed mappings

| JSON file | Proposed site section | Why | Values |
|---|---|---|---|
| `ward-register-2022.json` | §3.4.2 — the 40-ward ranking table | Replaces a hand-maintained table with a provenanced file. | 40 |
| `register-comparison.json` | §3.4.1 — the number of votes it takes | Adds the 2026 figures the site currently lacks, with verify markers. | 4 |
| `published-polls-2026.json` | §3.1.5 — the polling gap, as sourced | Adds Politrack, which the site is missing, and margins of error. | 11 |
| `results-2022-governor.json` | §3.3.6 — electoral history | Carries the Musila conflict as two values, not one. | 5 |
| `channel-reach.json` | §8.10.1 / §9A.1 — offline reach | Replaces asserted reach figures with a modelled, labelled split. | 4 |
| `water-and-drought.json` | §3.3.8 — drought and food security | Adds the 21% water figure, the strongest Tier 1 line available. | 6 |
| `county-finance-2026-27.json` | §3.3.4 — the resource envelope | Updates to the FY2026/27 CFSP figures. | 5 |
| `issue-evidence.json` | §7 — messaging pillars | Evidence behind each pillar. Labelled as evidence strength, not salience. | 8 |
| `scenario-benchmarks.json` | §3.4.1 — the path to the threshold | Scenario model only. Must render with its scenario label visible. | 9 |


## Deliberately excluded

These exist in the pipeline and are **not** exported to the site:

| Excluded | Reason |
|---|---|
| Nomination leverage ranking (`nomination_leverage.csv`) | Tells rivals exactly which wards to defend. On the never-publish list. |
| Holdout assignment (`holdout_assignment.csv`) | Publishing which wards are controls destroys the experiment. |
| Competitor benchmark (Stage 8) | Rival analysis on a public URL shows what the campaign is watching. |
| Reported vulnerabilities (pack §6.4) | Never appears in any output. It is opposition-research material about our own candidate. |
| Ward-level priority scores | Targeting intelligence. The register ranking is already public; the prioritisation is not. |


## Rules for whoever wires these in

- Every value carries `source_id`, `tier`, `as_of`, `method` and `status`. All five must render, not just the number.
- **Any value with `status: verify` must show a visible unconfirmed marker.** This is the site's own Tier 3 rule and the pipeline enforces it on export.
- **Any chart with a `scenario_label` must display it.** A simulation shown without its label is a forecast, which is exactly what this pipeline refuses to produce.
- `method: modelled` figures must never be styled with the authority of `official` ones.
- The pipeline does not edit site files. These JSON files are copied into the site's content folder only after this mapping is approved.
