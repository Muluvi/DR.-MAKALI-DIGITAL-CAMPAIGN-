# Keeping the data current

**The site is read-only, and there is no sign-in.** Anyone with the link sees everything; nothing on
the site can be changed by a visitor. The team sign-in, the in-site data editor, the workspace
editing and team-account management were removed in November 2026 (`docs/signin-2026-11/`).

**Firefly made the platform, owns it and runs it**: hosting, deployment, fixes, the automated data
checks and new features, and every change to the data, made at the team's request.

## How a change reaches the site

1. Dr. Mulu's team asks Firefly for the change: a figure, a ward register value, a strategy list entry,
   an analysis value or a working record.
2. Firefly makes it in a pull request. The data pack's own rules (`lib/data/rules.ts`) and
   `npm run verify` refuse anything that would break them.
3. The pull request merges only when the checks pass, and Vercel deploys `main`.

Past edits made through the former data editor remain in `data/team/figures.json` and
`data/team/lists.json` and are still applied; the change history (`/history`) still lists them.

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
asking for a figure to be updated. No automated job marks a value confirmed.

## Data recency

The small “last verified” indicator belongs in the persistent site shell, beside the existing source/data-status context rather than in the cover hero. Its value should come from reviewed repository metadata—ideally a generated file written during the verification workflow from the merge commit timestamp—not from a hardcoded date or an unreviewed fetch timestamp. A future implementation should expose that generated value through the server-rendered layout and render an accessible `<time dateTime="...">` element.

The exact news feed or API remains a human decision. Until an approved source is selected, the scheduled workflow uses public snapshots only and must not be treated as a complete media-monitoring system.
