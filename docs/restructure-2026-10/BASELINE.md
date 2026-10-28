# Baseline before the October 2026 restructure

Recorded 28 October 2026, before any content was moved. Every later check in this folder compares against these results.

## Repository

| Item | Value |
|---|---|
| HEAD | `96819482501daa0983c000e3a8c05d64d7654745` (`9681948`), 29 September 2026, "Merge pull request #31 from Muluvi/v0/optimize-mobile-layout" |
| Node / npm | v22.22.0 / 10.9.4 |
| Working branch | `claude/new-session-giw0mo`. The brief names `restructure/toc-2026-10`; this session can push only to `claude/new-session-giw0mo`, so the PR is opened from it (logged in CHANGELOG.md). |

## Build and checks

| Command | Result |
|---|---|
| `npm ci` | Pass. One npm deprecation notice (eslint 9.39.1 is past its support window); no other warning. |
| `npm run content` | Pass. `build-content: 621 figure tokens resolved into public/content`. |
| `npm run build` | Pass. Prebuild guards all pass (`check-figures: 337 figures valid`, `check-copy` clean, `build-anchors: 205 live headings, 1369 redirects, 0 orphans`). Next.js 15.5.25 compiled; 26 static pages. |
| `npm run lint` | Pass, no findings. |
| `npx tsc --noEmit` (the repo has no `typecheck` script) | Pass. |
| `npm run test:figures` (the repo's `npm test` equivalent; there is no `test` script) | Pass, 35 of 35. |
| `npm run verify` (stale-content, open-items, CSV, figures, copy, section visuals, ward register, analysis exports, figure fences, duplicates, mounts, anchors, visual coverage, figure tests) | Pass. |

## Content inventory

`node --experimental-strip-types scripts/heading-inventory.ts`:

> heading-inventory: 333 headings (205 numbered, 128 unnumbered run-ins); h2 74, h3 132, h4 105, h5 22, h6 0

This matches the brief's expected 333 (205 numbered, 128 run-ins). `--strict` reports the fourteen four-level workstream headings (5.2.1.1 to 5.2.4.4) as deeper than three numbered levels, which is the condition the restructure removes.

| Measure | Baseline |
|---|---|
| Words in `content/*.md` (whitespace tokens) | 47,768 |
| ```` ```figure ```` fences | 92 (92 distinct ids) |
| ```` ```textversion ```` blocks | 5 |
| `{{token}}` occurrences | 621 |

Per-file words, the figure id list and the token counts are frozen in `baseline-snapshot.json` beside this file.

## Mapping

`docs/restructure-2026-10/mapping.json` is parsed from preview section 6 by `scripts/restructure-2026-10/parse-mapping.py`: 333 rows, every inventory heading matched exactly once, in reading order. Dispositions: Moved 209, Merged 67, Kept 40, Removed 11, Split 5, Renamed 1. It agrees row for row with the owner's `makali-toc-mapping.json` export.

Three titles in preview section 6 differ from the content, and the content governs: 4.4.7 ("Langua register" for "Language, register"), 5.6.1 and 5.6.2 ("Sta:" for "Stage 1:" and "Stage 2:"). The preview copied them from `data/section-visuals.generated.json` as it was before the fix recorded in `scripts/build-section-visuals.mjs`.

## Live site

The session's network policy refuses a direct connection to `dr-makali-digital-campaign.vercel.app`, so the live check went through the Vercel connector.

- Current production deployment: `dpl_JTUesQGkdinwRvk5CAvDyF3QqZFb` (`dr-makali-digital-campaign-ntodm3b52-brian-muluvis-projects.vercel.app`), READY, built from `main` at `9681948`, the same commit as HEAD. **This is the rollback target** (brief section 8).
- `/content/objectives.md` fetched from production matches `public/content/objectives.md` at HEAD.
- Navigation is defined in `lib/heading-slug.ts` (`SECTIONS`, `PARTS`) and `lib/flow.ts` (`FLOW_ORDER`, `FLOW_ACTS`), and the deployment is built from this commit, so the deployed navigation is the repository's: Cover; 1 Objectives; 2 The Data; 3 The Analysis; 4 The Strategy; 5 Implementation with tabs 5A to 5E; 6 Next Steps; Annexes A to F. No difference found.
