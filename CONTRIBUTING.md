# Keeping the data current

**The data is updated on the site, not in GitHub.** There is no sign-in: anyone with the link
uses the data editor (`/edit-data`) for figures, the ward register, the strategy lists and the
analysis values, and the workspace (`/workspace`) for the day-to-day records: the weekly brief, the
content calendar, the dispatch log, the KPI tracker, saved model scenarios and the rest. Nobody needs
the repository, a terminal or code. `docs/ownership-2026-11/TEAM-GUIDE.md` is the team's guide.

**Firefly made the platform, owns it and runs it**: hosting, deployment, fixes, the automated data
checks, new features, and watching the change history, where any unwanted change is put back.
`docs/DEPLOY.md` lists every setting the live site needs.

## How a team edit reaches the site

1. The data editor checks the edit with the data pack's own rules (`lib/data/rules.ts`, the same code
   `npm run verify` runs) and refuses it, in plain language, if it would break them.
2. An accepted edit is committed to its own branch, `team-edit/<time>-<what>`.
3. `.github/workflows/team-edit.yml` regenerates the derived files and runs `npm run verify`,
   `npm run check:preservation`, the type check and the build. Only if all pass does it move the
   edit onto `main`, which Vercel deploys. A failing edit never reaches the site.
4. Every edit is in the change history (`/history`), attributed to "Anyone with the link", and can be reverted there.

Working records (the workspace) are saved to the platform's database and show on the next page load.

## Firefly's own changes

Code and content changes by Firefly go through a pull request; `.github/workflows/verify.yml` runs
lint, types, `npm run verify`, `npm run check:preservation` and the build.

```bash
npm run verify
npm run check:preservation
npm run build
```

A scheduled GitHub Action also collects public-source snapshots into `data/candidates/public-material.md`.
Those entries are marked `verify`: leads for the team to check against the original source before
updating a figure in the data editor. No automated job marks a value confirmed.

## Data recency

The small “last verified” indicator belongs in the persistent site shell, beside the existing source/data-status context rather than in the cover hero. Its value should come from reviewed repository metadata—ideally a generated file written during the verification workflow from the merge commit timestamp—not from a hardcoded date or an unreviewed fetch timestamp. A future implementation should expose that generated value through the server-rendered layout and render an accessible `<time dateTime="...">` element.

The exact news feed or API remains a human decision. Until an approved source is selected, the scheduled workflow uses public snapshots only and must not be treated as a complete media-monitoring system.
