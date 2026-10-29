# October 2026 declutter: one website, no Brief/Full

The owner's brief is `brief.md` (revision 2, 28 October 2026). Its section 9, as data, is `plan.json`: 190 sections and a worklist of 839 flagged blocks. Where the two disagree, section 9 of the brief wins and the difference is logged in `DECISIONS.md`.

The aim is to turn the proposal from a document into a website. The site is read on a phone, from a WhatsApp link, so the target is at most 170 phone screens with nothing lost: every fact, figure, source, tier and hedge stays reachable.

| File | What it holds |
|---|---|
| `brief.md` | The owner's brief |
| `plan.json` | The per-section plan as data |
| `metrics-baseline.json` | The owner's measurement of `4bfc078` (Brief and Full, 390 × 844) |
| `metrics-baseline-remeasure.json` | The same measurement repeated here before any change |
| `metrics-after.json` | The final measurement (one version, `--single`) |
| `DECISIONS.md` | Every judgement taken in carrying out the plan |
| `CUTS.md` | Every deletion: file, section, opening words, word count, canonical home |
| `TIER-MISMATCHES.md` | Typed tier parentheticals that disagree with the token's data tier |
| `PROGRESS.md` | Before and after for each tab |
| `REPORT.md` | Before and after for the whole site, and the check results |
| `screenshots/` | The top of every tab at 390 and 1280 px, `before/` (`4bfc078`) and `after/` |
| `cuts.json` | The cut log as data; `CUTS.md` is generated from it |

## Re-measuring

The measurement needs a production build served locally, and the Playwright that ships with the container:

    npm run build
    npx next start -p 3100 &
    node scripts/measure-text-load.mjs http://localhost:3100 <label>            # Brief and Full (before)
    node scripts/measure-text-load.mjs http://localhost:3100 <label> --single   # one version (after)

The script writes `docs/declutter/metrics-<label>.json` and prints a table.

## Checks

    npm run verify                                         # checks 1-9, including check:declutter
    node scripts/declutter/live-checks.mjs <url>           # checks 10, 11, 13, 14 and 15, against any running copy
    node scripts/declutter/screenshots.mjs <url> <label>   # check 17

`check:declutter` runs `check-tokens`, `check-content` (conservation, duplicates, conflicts), `check-leads`, and the staleness checks for `CUTS.md` and `TIER-MISMATCHES.md`. The content edits of Stages 3 to 9 were made by the scripts in `scripts/declutter/stages/`, which are kept as the record of how each tab was changed. If `import "playwright"` does not resolve, link the global copy rather than installing another: `ln -s "$(npm root -g)/playwright" node_modules/playwright`.

## Stage 1 result

The baseline was re-measured on a production build of `4bfc078`. It matches the owner's file within ±2%:

| | Owner's file | Re-measured |
|---|---:|---:|
| Brief: phone screens | 371 | 371 |
| Brief: words | 62,218 | 62,286 (+0.1%) |
| Full: phone screens | 607 | 607 |
| Full: words | 77,724 | 77,744 (+0.03%) |
| Full: figure words | 25,405 | 25,418 |
| Raw conflict markers (Brief / Full) | 19 / 27 | 19 / 27 |
| Tier parentheticals (Brief / Full) | 161 / 169 | 161 / 169 |

The brief's section 1 table gives "paragraphs over 60 words" as 82 in both modes. The script counts 82 in Full and 54 in Brief, because Brief folds 28 of them. Both files agree on this; the brief's table carries the Full figure in both columns.
