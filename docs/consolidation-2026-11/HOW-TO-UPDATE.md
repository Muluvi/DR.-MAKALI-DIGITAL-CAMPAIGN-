# How to update the site

Every number on the site lives in **one** file. Change it there, commit on GitHub, and every page,
chart, table, CSV, the data explorer and the analysis model pick it up on the next build. Never
retype a number anywhere else. The build fails if you do (`scan-literals --check`).

## Which file to edit

| You want to change… | Edit | Notes |
|---|---|---|
| **Any figure the proposal prints**: a register total, a result, a census or budget figure, an audit finding, a rate | `lib/data/figures.ts` (the registry) | Find the figure by its id (the data explorer in Evidence & sources shows every id). Change `value`, and keep `source`, `tier` and `asOf` honest. A figure from a new document gets that document's name as its source. |
| **A ward's or constituency's registered voters** | `data/ward-register.json` | The registry generates `ward.*` and `con.*` from it. Ward totals must still sum to the county total, which the build checks. |
| **A target** (SMS contacts, supporters, captains, reach) | `lib/data/figures.ts`, the `target(...)` lines | Each target says whose it is. |
| **What an indicator measures, its method or owner** | `data/kpis.ts` | Targets are read from the registry by id. Change the number in the registry, not here. |
| **A phase's dates, or the Wiper nomination window** | `lib/phases.ts` | One calendar. Every timeline, rail and chip reads it. |
| **A voter segment's wording, or which registry figure sizes it** | `data/segments.ts` | A segment with no published voter count stays "Not sized". Never estimate one. |
| **The message pillars or content types** | `data/message-architecture.ts` | |
| **Who approves an attack response, and how fast** | `data/escalation.ts` | The four severity tiers. |
| **The risk register** | `data/risks.ts` | |
| **The USSD menu** | `data/ussd-specimen.ts` | Read by every view of the menu. |
| **A source's name, date or link** | `data/sources.ts` | Nine documents are shared with the registry. Change the name here and the registry follows. |
| **Prose** | `content/<chapter>.md` | Write `{{figure.id}}` for any number, never the digits. `public/content/` is generated: never edit it. |
| **An analysis-model assumption** | `analysis/config/assumptions.yaml` | Only model-only assumptions carry a `value:`. A site figure there says `site_figure: <id>` and is read from the registry. Change it in the registry, not here. |

## What happens after you commit

1. **CI (`verify`) runs on the pull request.** It checks that:
   - every figure is valid (sourced figures have a source and tier, modelled ones say how)
   - no registry value is retyped as a literal anywhere in site code
   - counted phrases ("five phases", "three pillars") match their lists
   - the content checks still pass
2. **The build regenerates:**
   - the prose (`public/content/`)
   - the figure CSVs (`public/data/`)
   - the source table in Evidence & sources
   - the served analysis exports (`public/content/analysis/`, copied from `data/analysis/`)
   - `data/registry.export.json`, which the analysis model reads
3. **Vercel deploys `main`** automatically once the pull request is merged.
4. **The analysis model** (`cd analysis && python -m src.run_all`) reads the new values from
   `data/registry.export.json` on its next run. Its reports are regenerated from there.

## Automated refreshes

`.github/workflows/public-refresh.yml` collects public snapshots (IEBC, Controller of Budget, news)
into `data/candidates/public-material.md` and opens a review pull request. **Nothing in it is
confirmed.**

- If a source confirms a new figure, edit the registry on that branch, as above, citing the source.
- The workflow never writes a figure by itself, because a scraped value is unverified and the
  registry is what the site prints as fact.

## Rules that do not bend

- No new polling or data collection. Existing published data only.
- No campaign-finance ceilings, and no Firefly budget tiers or fee figures. County budget and audit
  data are fine.
- No section numbers, Roman numerals, "X of N" counters or tier codes shown to readers. Tiers print
  as words: Official, Reported, Unconfirmed.
- A number with no defensible source is not printed. Say what is known instead.
