# Keeping the site current

The site is one page: the opening, then Data, Analysis, Objectives, Strategies and Implementation.
There is no sign-in and nothing is saved from the site. Firefly makes every change in this
repository; a push to `main` that passes the checks deploys to production on Vercel.

## Where things live

| What | Where |
|---|---|
| Chapter text | `content/<chapter>.md`. Numbers are written as `{{figure-id}}` tokens, never typed. |
| Which chapters sit in which stage, and their titles | `lib/story/stages.ts` |
| Which tool sits after which chapter | `AFTER` in `app/page.tsx` |
| Every figure the text and charts print | `lib/data/figures.ts` (with corrections in `data/team/*.json`) |
| Chart specs (the figures drawn in chapters) | `lib/register/specs/` |
| The IEBC and Gazette data pack | `data/public-2026-11/*.csv`, built by `node scripts/build-public-data.mjs` |
| Analysis exports (the dashboards) | `data/analysis/*.json`, written by the Python pipeline in `analysis/` |
| Models (the scenario arithmetic) | `lib/models/` (tested in `lib/models/models.test.ts`) |
| Tools and models on the page | `components/tools/` |

## Rules for content

- Show figures plainly: no reliability tags, no "official", "estimated" or similar labels. Give each
  chart or table one plain source line.
- No document numbering in headings or text. Link to a heading by its id: `[The goal](#goal)` or
  `[The twelve largest wards](#votes-the-twelve-largest-wards)`. A heading's id is its chapter id,
  a hyphen, then its words.
- Scenario inputs live only in the browser. Nothing a visitor sets is stored or sent.

## Checks

```bash
npm ci
npm run verify   # data pack check, unit tests, lint, type check
npm run build
```

`.github/workflows/verify.yml` runs the same on every pull request and push to `main`.
