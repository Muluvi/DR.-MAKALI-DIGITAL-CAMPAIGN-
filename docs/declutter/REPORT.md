# Declutter report

**Status.** Stages 1 to 11 are done on `claude/new-session-giw0mo`.

After Stage 10 the work stopped at a hard stop (brief section 11): the screens target was missed by more than 25%, at 362 phone screens against 170. The owner then chose option 2 of that report: "Collapse figure charts behind a control, showing only the headline and takeaway" (D-51). That brought the site to 264 screens. The 170 target is still not met; the owner chose this option knowing that.

## Before and after

All figures are from `scripts/measure-text-load.mjs` at 390 × 844 on a production build.
- **Before:** `4bfc078`, which was the live site, in Brief mode (its default) and Full mode.
- **After:** the single version of the site.

| Measure | Before: Brief | Before: Full | After | Target |
|---|---:|---:|---:|---:|
| Phone screens, all 19 tabs | 371 | 607 | **264** | ≤ 170 (not met) |
| Words visible on load | 62,286 | 77,744 | **29,408** | ≤ 26,000 (not met) |
| Words behind a closed fold, reachable | — | — | 53,251 | |
| Paragraphs over 60 words visible | 54 | 82 | **0**, plus 3 kept whole by rule 7 | 0 |
| Raw `[CONFLICT` markers visible | 19 | 27 | **0** | 0 |
| Raw "(Tier N" parentheticals visible | 161 | 169 | **0** | 0 |
| Reading-mode controls, code paths, storage reads | 3 / 11 files | | **0** (one line clears the old storage key) | 0 |
| Lighthouse accessibility, mobile (/, /evidence, /strategy) | 99 / 98 / 98 | | **100 / 100 / 100** | 100 |
| Lighthouse performance (same) | 44 / 16 / 49 | | 44 / 42 / 54 | ≥ before − 3 |
| CLS (same) | 0 / 0.48 / 0 | | **0 / 0 / 0** | < 0.1 |
| First Load JS, shared | 103 kB | | 103 kB | ≤ 110 kB |

Notes on the table:
- **Rule 7 exceptions.** The three long paragraphs are two clauses of the 5.3.3 charter and F.1's first paragraph. Rule 7 keeps them whole and visible.
- **Lighthouse method.** The figures come from Lighthouse 12.6.1 run against local production builds of `4bfc078` and of this branch, on the same machine.

Per-tab screens and words are in PROGRESS.md.

## What blocks 170 screens

At Stage 10 the site measured 362 screens: figures 119, mounted components 87, `visual` fences 64, headings and spacing 68, prose 24. Option 2 folded the figures' marks and took the site to 264.

The two remaining levers are larger owner decisions:
- **Collapse the mounted components** behind a one-line control. This would save about 65 screens.
- **Tighten the visuals and section spacing.** This is CSS only and would save roughly 20 to 30 screens.

Together they would bring the site near 170–180.

## What changed

**One version.** Brief/Full and every reading-mode path are gone. Long prose sits in "Read the full text" folds that use `hidden="until-found"`. Find in page, deep links, print and scripts-off all reach them.

**Mechanisms:**
- the `lead` fence;
- the `visual` fence, with 16 kinds;
- inline chips for tiers, conflicts, pending sources, counsel notes, cross-references and the nomination window, also applied to component text (D-53);
- FoldBody;
- a fixture page at `/tools/visual-kinds`.

**Treatment codes**, applied to Parts 1–6 and Annexes A–G:

| Code | Result |
|---|---|
| SUM | 82 leads, all extractive, hedges kept, at most 45 words. |
| CUT, and say-once | 113 logged cuts, moves and labels (CUTS.md). Word conservation is −0.15%. |
| CARDS, TABS, STEPS, TIME, WEEK, MATRIX, CROSS, HYP, QA, INOUT, STAT, CHART | 115 visual fences, text moved verbatim. |
| REUSE | Folded rather than deleted (D-21). |
| KEEP | The commitments stay visible: the 5.3.3 charter, F.1, the 5.3.4 gate rule and fallback, the "not a legal opinion" statements, and 3.5.2's Boundary. |

**Derived visuals.** All 34 derived heading visuals are resolved: 27 by visual fences, 7 by override (D-48).

**Figures.** Each figure shows its headline, takeaway, source line with tier, and any conflict flag. One "Show the figure" control opens the marks, question, notes, item text, data table and CSV (D-47, D-51).

**Fixes found in verification:**
- folds did not print (D-52);
- figure `role="group"` was not an allowed role;
- the dock's accessible name did not match its visible text;
- the heading outline skipped levels inside figures (`components/HeadingOutline.tsx`);
- the 2.1 story's layout shift (CLS 0.48 → 0), fixed by a pre-paint flag.

## Checks (brief section 10)

| # | Check | Result |
|---:|---|---|
| 1 | `npm run verify` | Pass |
| 2 | Tokens present at `4bfc078` | Pass: 283 of 283 |
| 3 | 92 figure and 5 textversion fences unchanged | Pass |
| 4 | Word conservation ±1%, no section losing over 2% unlogged | Pass: −0.15% |
| 5 | Duplicate cuts have their facts at home | Pass: 29 checked |
| 6 | Leads extractive | Pass: 82 |
| 7 | Hedges survive | Pass |
| 8 | No values changed | Pass. Under `lib/data/figures.ts`, `lib/figures` and `data`, only the generated derived-visual list changed. |
| 9 | 27 conflict markers, each in its passage | Pass |
| 10 | No working marks rendered | Pass: 0 on 19 tabs |
| 11 | No paragraph over 60 words outside folds; no reading-mode code | Pass. The charter clauses and F.1 are exempt under rule 7; the grep finds only the storage-key cleanup. |
| 12 | Section 3 targets | **Not met** for screens (264) and visible words (29,408). Met for the rest. `metrics-after.json` |
| 13 | Print | Pass: 885 fold bodies and 91 content disclosures displayed under print; /delivery's PDF holds the folded text |
| 14 | Scripts off | Pass: 885 fold bodies (20 of them tab panels) in the HTML and displayed |
| 15 | Deep links | Pass: 50 of 50 (30 pre-rebuild ids, 20 current) land with no closed fold around them |
| 16 | Lighthouse | Pass: accessibility 100 on all three, performance at or above baseline, CLS 0 |
| 17 | Screenshots | `screenshots/before` and `screenshots/after`, every tab at 390 and 1280 px |

Checks 10–16 are run by `scripts/declutter/live-checks.mjs` (10, 11, 13, 14, 15) and Lighthouse. They are run again against the Vercel preview and production as the PR proceeds.

## Found, not changed (values and sources are out of scope)

- **Deletion window.** Charter clause 5 says personal data is deleted within 90 days; the mounted charter component says 30 days (D-36).
- **G.4 count.** G.4 says "six core software components" and names five (D-45).
- **E.6 numbering.** The drill scenarios run 1 to 5, then 7 (D-44).
- **Stale figure numbers.** `fig-5-1-workstreams` still prints pre-restructure section numbers in its card meta lines (for example "Section 5.2.1.1" for 4.5.1). The feature-phone specimen cites "§8.5".
- **Tier mismatches.** Two tokens carry a different tier in the data from the one typed beside them (TIER-MISMATCHES.md).

## Open items for the owner (brief section 13)

1. **Pillar consolidation.** There are 21 items in five groupings. The crosswalk at 3.2 shows them without merging any.
2. **Conflicts and citations.** C1–C8 and the 12 `[CHECK REF]` citations remain open (`docs/restructure-2026-10/OPEN-ITEMS.md`).
3. **Sub-counties.** Six sub-counties are in no zone (3.3.1).
4. **Untiered statistics.** These are "not yet tiered" and now shown on cards: 13.0% never attended school, 17.4% completed secondary, 78.4% farm-dependent, 61% water access.
5. **Stale dates** (`docs/restructure-2026-10/TODO-dates.md`). The nomination window, "late October to November 2026", is now the present.
