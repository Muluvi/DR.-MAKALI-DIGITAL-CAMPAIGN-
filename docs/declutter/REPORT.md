# Declutter report

**Status: stopped at a hard stop, after Stage 10.** Stages 1 to 10 are committed and pushed on `claude/new-session-giw0mo`. No pull request has been opened, nothing is merged, and production is unchanged. It is still deployment `dpl_6Hrupsas8mjfw4tS7AWfTammsbQV`, built from `4bfc078`.

Brief section 11 lists this as a hard stop: the screens target is missed by more than 25% after every section is done. The target is 170 phone screens, so the stop line is 212. The site measures 362.

## Before and after

| Measure | Baseline (Brief mode, `4bfc078`) | Now (Stage 10) | Target |
|---|---:|---:|---:|
| Phone screens, all 19 tabs | 371 | **362** | ≤ 170 |
| Words visible on load | 62,286 | **42,962** | ≤ 26,000 |
| Paragraphs over 60 words visible | 82 | 12 | 0 |
| Raw `[CONFLICT` markers visible | 19 | 0 | 0 |
| Raw `CHECK REF` visible | 12 in source | 2 | 0 |
| Raw "(Tier N" parentheticals visible | 161 | 12 | 0 |
| Figures over 80 visible words | 92 | 83 of 89 | 0 |
| Reading-mode controls, code paths, storage reads | 3 / 11 files | 0 | 0 |
| First Load JS, shared | 103 kB | 103 kB | ≤ 110 kB |

Per-tab figures are in PROGRESS.md.

## What blocks the screens target

At 390 px the 362 screens break down as follows:

| Kind | Screens | Can the plan reduce it? |
|---|---:|---|
| Figures (89) | 118.8 | Not much more. Section 7 keeps the headline, the marks, the takeaway and the source line visible, and the marks are the height. The median figure is 948 px; tile maps, waffles, gauge lists and matrix cards run to 1,500–3,000 px. Notes are already behind "Details and notes". |
| Mounted components (39) | 87.4 | Not under the plan, which keeps every existing component. The tallest are the four-step register story in 2.1 (7,643 px), the media ownership map (3,310 px), the decisive-wards list (3,074 px), both scorecards and the ethics-charter component. |
| `visual` fences (115) | 63.7 | Partly, by tightening their CSS. Each fence replaced folded prose, which is why Stages 4 to 9 added screens while removing words. |
| Headings, spacing, chrome | 67.9 | Partly. There are 176 sections at about 330 px of overhead each. |
| Prose, callouts, lists | 24.2 | Already near the plan's prose target. |

Even if every mounted component over 400 px were collapsed to a one-line control (about −65 screens) and the visuals' height were halved (about −32), the site would sit near 265 screens. The figures alone take 119 screens, and section 7 requires their marks to stay visible.

**The target can only be reached by an owner decision.** At least one of these is needed:

1. **Collapse the mounted components** behind a one-line control. This is about −65 screens. It reverses the plan's "existing component: keep" for 37 panels.
2. **Collapse figure marks** behind a control, showing only the headline and takeaway. This could save up to about −100 screens. It reverses section 7's rule that the chart is visible.
3. **Accept a higher screens target.** About 240–260 is reachable within the brief's rules, using CSS compaction and option 1 only.

## What was done

- **One version.** Brief/Full and every reading-mode path are gone. Long prose sits in "Read the full text" folds that find-in-page, deep links, print and JS-off all reach.
- **Mechanisms:**
  - `lead` and `visual` fences, with 16 visual kinds;
  - inline chips for tiers, conflicts, pending sources, counsel notes, cross-references and the nomination window;
  - FoldBody;
  - a fixture page at `/tools/visual-kinds`.
- **Content.** Parts 1 to 6 and annexes A to G follow section 9:
  - 81 leads, all extractive, with hedges kept;
  - 112 logged cuts, moves and labels (CUTS.md);
  - all 283 tokens and 92 figure fences present;
  - 27 conflict markers placed.
- **Kept visible.** The commitments stay on load: the 5.3.3 charter, F.1, the 5.3.4 gate rule and fallback, the "not a legal opinion" statements and the 3.5.2 Boundary.
- **Figures.** Questions, measure lines, notes and item bodies are behind "Details and notes" (D-47). All 34 derived visuals are resolved (D-48).
- **Checks.** `npm run verify` passes. This covers the content, figure and anchor checks, `test:figures`, `test:declutter` and `check:declutter` (word conservation −0.15%, 81 leads, 283 tokens, 27 conflicts). Checks 10 to 17 (print, JS-off, deep links, Lighthouse, screenshots) were not run, because the work stopped before Stage 11.

## Found, not changed (values and sources are out of scope)

- **Deletion window.** The charter's clause 5 says personal data is deleted "within 90 days of the declaration of results". The mounted charter component says "30 days after gazettement" (D-36).
- **G.4 count.** G.4 says "the six core software components" and names five (D-45).
- **E.6 numbering.** The drill scenarios run 1 to 5, then 7 (D-44).
- **Stale figure numbers.** The register figure `fig-5-1-workstreams` still prints pre-restructure section numbers in its card meta lines (for example "Section 5.2.1.1" for what is now 4.5.1).
- **Raw marks still visible.** Two `[CHECK REF]` strings are visible, one on workstreams-ground and one on annex-runbooks. The annex-runbooks one is in a figure's source text (`lib/figures/annex.ts`), which the inline-mark renderer does not reach. Twelve "(Tier N" parentheticals are also visible: evidence has 10, decision and strategy 1 each. Neither group was traced further before the stop.
- **Long paragraphs.** Twelve paragraphs over 60 words remain visible. One is F.1's first paragraph (62 words), which stays in full under rule 7. The rest are in evidence (5), strategy (2), measurement (2), staffing (1) and annex-messages (1).

## Open items for the owner (brief section 13)

- **Pillar consolidation.** There are 21 items across five groupings. The crosswalk at 3.2 shows them without merging any.
- **Conflicts and citations.** C1 to C8 stay unresolved, and the 12 `[CHECK REF]` citations are still unchecked.
- **Sub-counties.** Six sub-counties fall in no zone.
- **Untiered statistics.** These are still "not yet tiered": 13.0%, 17.4%, 78.4% and 61%.
- **Stale dates** across the evidence base.
