# Declutter report

**Status.** Stages 1 to 11 are done on `claude/new-session-giw0mo`.

After Stage 10 the work stopped at a hard stop (brief section 11): the screens target was missed by more than 25%, at 362 phone screens against 170. The owner then chose option 2 of that report: "Collapse figure charts behind a control, showing only the headline and takeaway" (D-51). That brought the site to 264 screens.

The evidence pass (PR #35) left it at 265.4. The owner then asked to "collapse the mounted panels too to reach 170 screens" (D-57 to D-62). The site now measures **169.3 phone screens**, so the 170 target is met. Visible words are 18,883, against a target of 26,000, so that target is met too.

## Before and after

All figures are from `scripts/measure-text-load.mjs` at 390 × 844 on a production build.
- **Before:** `4bfc078`, which was the live site, in Brief mode (its default) and Full mode.
- **After:** the single version of the site.

The "After panels" column is the site after D-57 to D-62 (`metrics-panels.json`).

| Measure | Before: Brief | Before: Full | After | After panels | Target |
|---|---:|---:|---:|---:|---:|
| Phone screens, all 19 tabs | 371 | 607 | 264 | **169.3** | ≤ 170 (met) |
| Words visible on load | 62,286 | 77,744 | 29,408 | **18,883** | ≤ 26,000 (met) |
| Words behind a closed fold, reachable | — | — | 53,251 | 65,366 | |
| Paragraphs over 60 words visible | 54 | 82 | **0**, plus 3 kept whole by rule 7 | same | 0 |
| Raw `[CONFLICT` markers visible | 19 | 27 | **0** | 0 | 0 |
| Raw "(Tier N" parentheticals visible | 161 | 169 | **0** | 0 | 0 |
| Reading-mode controls, code paths, storage reads | 3 / 11 files | | **0** (one line clears the old storage key) | 0 | 0 |
| Lighthouse accessibility, mobile (/, /evidence, /strategy) | 99 / 98 / 98 | | **100 / 100 / 100** | **100 / 100 / 100** | 100 |
| Lighthouse performance (same) | 44 / 16 / 49 | | 44 / 42 / 54 | 54 / 53 / 58 | ≥ before − 3 |
| CLS (same) | 0 / 0.48 / 0 | | **0 / 0 / 0** | 0 / 0.006 / 0.004 | < 0.1 |
| First Load JS, shared | 103 kB | | 103 kB | 103 kB | ≤ 110 kB |

Notes on the table:
- **Rule 7 exceptions.** The three long paragraphs are two clauses of the 5.3.3 charter and F.1's first paragraph. Rule 7 keeps them whole and visible.
- **Lighthouse method.** The figures come from Lighthouse 12.6.1 run against local production builds of `4bfc078` and of this branch, on the same machine.

Per-tab screens and words are in PROGRESS.md.

## How 170 screens was reached

At Stage 10 the site measured 362 screens: figures 119, mounted components 87, `visual` fences 64, headings and spacing 68, prose 24. Option 2 folded the figures' marks and took the site to 264. The evidence pass added 1.4 screens.

The owner's second instruction, to collapse the mounted panels (DECISIONS.md D-57 to D-62), made six changes:
- **Panels.** 43 mounted panels sit behind one "Show the panel" control, each named by its own title. Alone, this took the site to 192 screens.
- **Sequences.** A sequence of six or more items shows its first four.
- **Figure sources.** A figure's source line folds, and its tier pills move onto the figure's control, so rule 5 still holds.
- **Tables.** Long tables show five rows.
- **The 2.10.1 asset table** joins its section's full text.
- **Phone spacing** is a little closer.

The result is 169.3 screens.

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

**Figures.** Each figure shows its headline, takeaway, any conflict flag, and its tier pills on the line of its "Show the figure" control. The control opens the marks, question, notes, item text, source line, data table and CSV (D-47, D-51, D-59).

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
| 12 | Section 3 targets | **Met** after the panels: 169.3 screens and 18,883 visible words (`metrics-panels.json`). At Stage 11 they were not met: 264 and 29,408 (`metrics-after.json`). |
| 13 | Print | Pass: 1,006 fold bodies (885 at Stage 11) and 91 content disclosures displayed under print; /delivery's PDF holds the folded text |
| 14 | Scripts off | Pass: 1,006 fold bodies (21 of them tab panels) in the HTML and displayed |
| 15 | Deep links | Pass: 50 of 50 (30 pre-rebuild ids, 20 current) land with no closed fold around them |
| 16 | Lighthouse | Pass: accessibility 100 on all three, performance at or above baseline, CLS 0 |
| 17 | Screenshots | `screenshots/before` and `screenshots/after`, every tab at 390 and 1280 px |

After the panels, checks 1–16 were run again on a local production build of this change; all pass. Before that, checks 10–16 were run by `scripts/declutter/live-checks.mjs` (10, 11, 13, 14, 15) and Lighthouse, on a local production build of `32774a8`. This container's network policy blocks `*.vercel.app`, so a browser here cannot open the Vercel preview. Instead the preview (`dpl_7EEh2ghfU57LzM8n6QXXxTqDbuwK`, same commit) was fetched through the Vercel connector and compared with the local build:
- `/evidence` renders the same 139,134 characters of text, with the same counts of every marker the checks look for;
- `/annex-terms` serves F.1 in full and the pre-paint story flag;
- no route offers a Brief or Full control.

`live-checks.mjs` also accepts a `VERCEL_SHARE` link, for running it against a protected preview from a network that can reach it.

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
6. **The objectives index at 5.1 is empty.** It lists other parts' indicator sets by matching their section titles. No title matches its pattern since the restructure, so it renders nothing (it was already empty on main). It is left out of the panel controls (D-57) until its pattern is updated.

## Production

PR #34 merged as `8f10cb9` (merge commit, stage commits kept). Production deployment `dpl_2J4Ke5GakhDSeCQxjgBgQsEMjoo1` is live on `dr-makali-digital-campaign.vercel.app`.

Checked through the Vercel connector, because this container cannot reach `*.vercel.app`:
- `/evidence` returns 200 and renders the same 139,446 characters of text, with the same marker counts, as the local production build that checks 10–16 ran on;
- the legacy `/analysis` route lands on the evidence content.

No rollback was needed. The previous production deployment, `dpl_6Hrupsas8mjfw4tS7AWfTammsbQV`, stays available for one.

