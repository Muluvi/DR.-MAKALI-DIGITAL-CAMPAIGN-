# Kitui 2027 analysis pipeline — standing rules

These rules bind every stage. They are not advisory. Where a rule and a convenient
result conflict, the rule wins and the gap is reported.

Written in British English throughout, including in generated reports.

## 1. Never invent data

- If an input is missing, skip that step, write `[DATA NEEDED]` in the report, and continue.
- No silent imputation. A feature with missing data is **dropped and listed**, never filled.
- Where the data pack gives two values for one figure, keep both rows and set
  `status = conflict`. Never average them, never drop one.
- Synthetic data exists only inside `tests/`. It is marked as synthetic at the point of
  creation and is never written to `data/processed/` or `outputs/`.

## 2. Provenance on every number

- Every figure carries `source_id` and `tier` (1 official, 2 media/research, 3 local/aggregator).
- **Every T3 figure carries `status = "verify"` wherever it appears.** No exceptions.
- The pack's `[VERIFY]`, `[DATA NEEDED]` and `[CALC]` tags survive parsing as a `status` column.
- `method` is one of `official`, `calculated`, `modelled`. Firefly arithmetic on published
  figures is `calculated`, not `official`.
- State the sample size and the limits beside every result.

## 3. Data protection (Kenya DPA 2019, ODPC guidance)

- **Ward-level aggregates only.** No scoring of individual voters. No personal data in any
  output, ever.
- Comments are loaded with names, handles and profile IDs stripped at read time. Only
  `post_id`, `date` and `text` survive into memory.
- **Never combine NG-CDF or any other public-programme beneficiary data with campaign data.**
  ODPC's 2025 public-sector guidance [S57] bars reusing public-programme personal data for
  political mobilisation without explicit consent. NG-CDF *project records* remain usable as
  proof points; *beneficiary lists* do not.
- Nothing sensitive may sit in a folder git will commit. `analysis/data/` and
  `analysis/outputs/` are gitignored. `analysis/reports/` is committed, so reports must carry
  no personal data and no raw rival intelligence.

## 4. Modelling honesty

- **Label every modelled figure "modelled". Never present a simulation as a forecast.**
  Every simulation output carries the caption "Scenario model, not a forecast."
- Governor races are won by the most votes. **There is no 50% threshold.** Do not model a
  fixed win threshold. Compare against two benchmarks instead:
  (a) the 2022 winning tally of 198,004; (b) 37.2% of the register figure in use.
- A true win probability requires rival vote ranges. Unless `assumptions.yaml` carries
  `rivals.model_rivals: true` with ranges, the report states that it shows **benchmark
  comparisons, not win probability**.
- Prefer simple, explainable methods over sophisticated ones.

## 5. No polls, no new research

- **Firefly works from existing records and its own analysis only.** No stage commissions,
  models or reads a new study, survey, poll or focus group to form strategy (September 2026).
- **Opinion polls appear nowhere**: not as a stage, a model input, an export, a finding or a
  "for reference only" table. Stage 2, which modelled the published polls, has been removed;
  the other stages keep their numbers.
- **Candidate attributes come from official or documentary records**: IEBC declarations and
  forms, Hansard, the Kenya Gazette, OAG and Controller of Budget reports, NG-CDF records,
  Kenya Law, party nomination records and official biographies. Where the record is missing,
  write `[DATA NEEDED]` and name it; never fill it with a measure of opinion.
- Stage 1's `poll-on-site` check flags any opinion-poll material that reaches the site.

## 6. Naming and currency of facts

- The party is **Wiper Patriotic Front (WPF)**. ORPP certified the change from Wiper
  Democratic Movement in August 2025 [S6]. "Wiper Democratic Movement" is stale everywhere
  except in a historical statement about 2022, where "WDM (now WPF)" is correct.
- Today is **16 September 2026**. Judge staleness against that date.
- The 2022 register (532,758) is not the current register. Any site figure presenting it as
  current is a finding.

## 7. Reproducibility

- Fixed random seeds, read from `config/assumptions.yaml` (`seed`), never hard-coded in a module.
- **One command runs everything: `python -m src.run_all`** (from `analysis/`, with `.venv` active).
- Stages are independent and degrade cleanly: a stage with no input data still runs, writes its
  report with `[DATA NEEDED]`, and exits zero.
- `pytest` covers parsing, sums and exports.

## 8. Assumptions

- **Every assumption lives in `config/assumptions.yaml`, never hard-coded in a module.**
- Each entry carries `value`, `rationale` and `status` of `PLACEHOLDER` or `CONFIRMED`.
- A `PLACEHOLDER` is a number nobody has confirmed. Reports say so beside the result.

## 9. Repo and deployment safety

- `requirements.txt` lives in `analysis/`, never at the repo root.
- `analysis/` is in `.vercelignore`. The pipeline never deploys with the site.
- Write nothing outside `/analysis` except `.gitignore` and `.vercelignore`.
- **Never run `git commit`, `git push` or any deploy command without the user's approval.**
- **Do not edit the site's files.** Stage 12 proposes mappings for approval; only after
  approval are approved JSON files copied into the site's content folder.
- Before any copy to the site, strip anything unsuitable for a public URL: vulnerabilities,
  rival analysis, holdout assignments, nomination leverage rankings.

## 10. Reports

- Charts first, then short sentences. Cut filler.
- State small-sample limits beside every result. n = 40 wards is a small sample and limits
  every cluster and regression claim made about wards.

## 11. Labelling workloads (Stages 6–7)

- Up to ~300 items: label in-session, in batches.
- More than that: use `src/label_api.py`, which reads `ANTHROPIC_API_KEY` from the environment.
  **Never print or commit the key.** Report the item count and ask before running it.

## 12. Post-stage quality check

After every stage, confirm and state:
1. ward totals reconcile to constituency and county totals;
2. every number traces to a source ID and tier;
3. assumptions live in `assumptions.yaml`, not hard-coded;
4. no personal or sensitive data is in any output or in any folder git will commit;
5. small-sample limits are stated.
