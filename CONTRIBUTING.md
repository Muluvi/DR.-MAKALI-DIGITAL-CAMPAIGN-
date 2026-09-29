# Keeping the data pack current

The published site is refreshed through reviewed repository changes. Firefly's team can edit the data pack, assumptions, and `data/*.ts` files directly, then run `npm run verify` before committing. The verification workflow checks the content, figures, anchors, registers, and generated outputs; merge the change only after those checks pass.

A scheduled GitHub Action also collects public-source snapshots into `data/candidates/public-material.md`. Those entries are deliberately marked `verify`. They are leads for human review, not published facts: check the original source, reconcile any conflicting figure, preserve the source tier, and update the appropriate published file manually. No automated job can mark a value confirmed or deploy it without review and merge.

When changing a figure, keep its named source and status beside it. Do not add a number from a candidate snapshot directly to public content until the team has verified it against the source and run the repository checks.

## Data recency

The small “last verified” indicator belongs in the persistent site shell, beside the existing source/data-status context rather than in the cover hero. Its value should come from reviewed repository metadata—ideally a generated file written during the verification workflow from the merge commit timestamp—not from a hardcoded date or an unreviewed fetch timestamp. A future implementation should expose that generated value through the server-rendered layout and render an accessible `<time dateTime="...">` element.

The exact news feed or API remains a human decision. Until an approved source is selected, the scheduled workflow uses public snapshots only and must not be treated as a complete media-monitoring system.

## Local checks

```bash
npm run verify
npm run build
```

These commands are the same publication gate used by the repository workflow.
