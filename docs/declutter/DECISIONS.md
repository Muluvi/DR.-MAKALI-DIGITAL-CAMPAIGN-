# Decisions taken in carrying out the declutter brief

Each entry gives the decision, why it was taken, and where it applies. The brief's section 11 says: "Anything else: take the conservative option, log it in `docs/declutter/DECISIONS.md`, and continue."

## The rule that changed

**D-1. The Brief/Full reading mode is removed, and so is its rule.** `lib/reading-mode.tsx` recorded the rule the site was built under: *"Brief does not shorten the document. It shortens the FIRST READ … Nothing is deleted, nothing is summarised, and every word is one tap away."* The owner's revision 2 of the declutter brief (28 October 2026, brief section 2) replaces it. The site now has one version. A section may show a summary (a `lead`) and a visual in place of its prose, and verified duplicates may be deleted. What still holds is listed in brief section 2: no fact is lost, summaries are extractive, hedges, tokens, tiers and conflicts survive, commitments stay in full, and deep links land. The file is deleted; this entry is its record.

## Stage 2: mechanisms

**D-2. Branch.** The brief names `declutter/website-2026-10`. This session can only push to `claude/new-session-giw0mo`, so the work is there, restarted from `main` at `4bfc078` once PR #33 had merged.

**D-3. `hidden="until-found"` is set on the client.** React 19.2 renders `hidden` as a boolean and drops the value. So the server's markup hides a closed fold with CSS (`[data-fold-body="closed"]`), and after mount the fold sets `hidden="until-found"` itself (`components/markdown/FoldBody.tsx`). The height is the same either way, so there is no layout shift. Find in page reaches every closed fold, and `beforematch` opens it. A deep link opens every fold around its target before scrolling (`lib/fold.ts`, `lib/scroll-to-section.ts`). Print shows every fold through CSS (`app/declutter.css`). With scripts off, a `<noscript>` style in `app/layout.tsx` shows every fold and hides the controls that cannot work.

**D-4. One fold type.** `BriefFold` and `ProseFold` are merged into `ReadMore`, labelled "Read the full text (N words)" and closed by default. Text versions use the same fold, closed by default. Disclosure groups are an accordion with the first panel open, as Brief had them. Print, find in page and deep links open them all.

**D-5. How a section is laid out without a lead** (`lib/collapse-groups.ts`). A section shows its first paragraph when it is 60 words or fewer. It also shows a wholly bold paragraph of up to 40 words (the document writes its findings that way), every figure, visual and text version, and any block marked `<!-- keep -->`. Everything else folds, provided at least 40 words would fold. A section of 60 words or fewer shows as written. Two changes from the old Brief rules:
- Callouts now fold. Brief showed them all, and many are long. A callout a reader must see is marked `<!-- keep -->`.
- A first paragraph over 60 words folds rather than showing, because the target is no visible paragraph over 60 words.

A run of h4 blocks becomes an accordion from three panels, not two. Two-panel runs read better as a lead and a fold.

**D-6. `<!-- keep -->`.** This is a layout instruction for the published commitments that brief section 2, rule 7 keeps visible (the 5.3.3 charter, F.1, the 5.3.4 gate rule, the "not a legal opinion" statements, the 3.5.2 Boundary paragraph). The segmenter consumes the marker line, so it never renders and is not counted as a word.

**D-7. The `visual` fence is compiled at build.** YAML in `content/*.md` is parsed by `js-yaml`, now a direct dependency at the version already in the lockfile (4.3.2). It is checked against `lib/visual.ts` and written to `public/content` as one line of JSON (`lib/visual-compile.ts`). The page parses JSON and never ships a YAML parser. A malformed fence fails `npm run content` with its file and line.

**D-8. The new visual kinds are one renderer** (`components/visual/VisualFence.tsx`), alongside the existing partviz figures rather than inside `components/partviz/kinds.tsx`. The partviz kinds take numeric data the derived-visual generator computes, show labels only, and are clipped to fit. The fence kinds carry the document's own markdown and must keep every word reachable, so they need disclosures, tabs and markdown text. Bespoke layouts named in the plan (ObjectiveCard, CandidateCard, SegmentTabs and so on) are `cards` or `tabs` with a `preset`, as brief 5.2 asks.

**D-9. The tier badge** (X1) shows the tier's short label: T1, T2 or "T3 Unconfirmed". For a Tier 3 figure that keeps the visible "unconfirmed" marker the source-discipline rule requires. Words in the parenthetical's head after the tier ("gap", "/ Tier 2") stay on the badge. Everything after the first comma or semicolon goes behind the tap, with a link to the tier legend in A.1.2. Nothing is dropped.

**D-10. The conflict chip has no reader-facing list to link to.** The brief asks for the chip to link to the open-items list. Conflicts C1 to C8 are listed only in `docs/restructure-2026-10/OPEN-ITEMS.md`, which is not part of the site, and no section of the proposal lists them. Adding a list to the proposal would be new content. So the chip reads "Two versions in this document — under review" and opens to say which open item it is (C1 to C8) and that both versions are kept until the campaign decides. The source marker is unchanged. This is listed for the owner.

**D-11. `[CHECK REF]` keeps its citation as text.** When a mark follows a citation, the citation is wrapped in a span the cross-reference linker does not reach. The number was wrong before the renumbering moved it, so it is never drawn as a link or a § chip.

**D-12. Group banners (X5).** "**Group: X.** sentence" renders as a "Group · X" chip, with the sentence behind it. The content stage sets each group's sentence out once, in 4.5.

**D-13. One reading time.** The hero shows "~N min read", measured from what each section shows on load: leads, shown prose and the visible part of each visual. Figures are not counted, as they were not before. The index and the overview card use the same measure. The overview card used to say "N min full read" from the full word count, which would have given a second reading time.

**D-14. The "finding" callout** (one per markdown pass, styled as the section's key claim) is now chosen by where the quote starts in the markdown, not by render order. React's development double render picked a different callout each time, which caused a hydration mismatch.

**D-15. A fixture page** at `/tools/visual-kinds` (not linked, not indexed) renders every visual kind, the lead fence, a fold and every inline chip from `docs/declutter/fixture-visual-kinds.md`. `lib/visual.test.ts` checks that it carries all 16 kinds and that every fence in the content fits its kind. `lib/inline-marks.test.ts` lists every tier parenthetical in the content and checks that each one, every conflict marker, every `[CHECK REF]` and every `[VERIFY]` is matched. Both run in `npm run verify` (`npm run test:declutter`).

## Stage 3: cross-cutting content

**D-16. The tab intros (X9) are cut, and their facts have homes.** Seven tabs opened with a "what this part covers" line directly under the chapter marker, which prints the same tab's navigation blurb: decision, evidence, strategy, delivery, staffing, measurement and risks. Where an intro names something the blurb does not, the section that states it is logged as a second home, and check 5 confirms it: 1.1 for Dr. Mulu; 2.1, 2.2, 2.8.2, 2.9.1, 2.10.1 and 2.10.2 for the evidence sources; 4.3 for August 2027; 5.2.1 for the Week 1 audit. The cover intro and the annex intros are kept, as the plan says.

**D-17. The nomination window's home did not state the timing, so the timing moved there first** (brief section 6: "If the restatement carries a detail the home lacks, move that detail to the home first"). Sections 2.5.1 and 2.5.2 grade the selection method as Tier 3 and set out what would confirm it, but they never say when the decision falls. The callout in 1.1 gave the one full statement: "…in the final quarter of 2026 — late October to November on the reported timetable (Tier 3, Section 2.5.2)". That sentence now opens 2.5.1, verbatim. Its five restatements carry the window chip instead: three in 1.1, one in 1.2 and one in 4.2.1. Assumption 2 in 1.8 also gets the chip. The chip reads "Wiper decision: late Oct–Nov 2026 · reported · Tier 3 · §2.5". In 4.2.1, "which party sources indicate" is the report that 2.5.2 grades as single-source Tier 3, so it goes with the restatement.

**D-18. "Strictly" stays where it states a prohibition.** X10 deletes intensifiers, and "strictly" is on the brief's list. In "strictly prohibited" (A.1.4) and "strictly forbidden" (3.6.3) it is the rule, not emphasis, so it stays. Elsewhere it is deleted. The framing the plan replaces whole paragraphs of goes with its tab: 2.1's "absolute mathematical certainty", 2.3's "extreme density clustering", 3.1's "turns standard political promotion on its head" and "forensic analysis", 3.5's "empty populist slogans", 3.6.3's "severe version-drift", 4.5.2's "industrial pipeline", 4.5.7's "air-conditioned command center" and 5.1.1's "unassailable". The "air-conditioned parliamentary offices" in 3.1.3 is the rivals' attack, quoted, and stays.

**D-19. Restatements inside a structure the plan rebuilds are handled with their tab.** Several of the say-once restatements in brief section 6 sit inside a list, table or field that a later stage turns into a card, tab or week strip. Examples are an objective's "Finding it answers" field, a level's trade-offs, the week's publishing day and a segment's channel row. Each is cut or kept when its structure is rebuilt, and logged in CUTS.md either way. A restatement that carries a `[CONFLICT Cn]` marker (1.4.3's publishing boundary, C4; 1.6's ownership split, C3; 3.3.2's radio row, C7) stays, because both versions of a conflict stay.

**D-20. Moves are logged with cuts.** Text that moves to its canonical home is logged as kind "moved" in `cuts.json`. The conservation check credits the section it left and debits the section it joined.

## Stages 4 to 6: Parts 1 to 3

**D-21. REUSE is carried out by folding, not deleting.** For a REUSE section, the plan says to delete the prose once every number in it is confirmed in the figure or component that shows it. The figures and components carry their own versions of these numbers, not always with the same wording, tiers or caveats, and a mismatch would lose a fact. So the conservative option (section 11) is taken: the prose moves into the section's "Read the full text" fold under a lead and the visual, and nothing is deleted unless it is a verified duplicate, a signpost or framing. The visible-prose targets are met either way, because a closed fold is not visible on load.

**D-22. Word conservation counts moved words, not added ones.** Check 4 counts the text in visual fences. A visual adds some words of its own: a stat tile's label, a card's badge, a crosswalk's cells. Counting those as "after" would let a gain hide a loss. So `scripts/declutter/check-content.mjs` matches each word of a visual against the section's original words that its prose no longer holds. A matched word counts as moved. An unmatched word is counted apart as added and reported, and does not count towards the ±1% balance. This is stricter than the brief's formula, not looser.

**D-23. Ordinals, bullets, pipes and dashes are not words.** Both counters (`scripts/declutter/sections.mjs` and `edit.py`) count whitespace-separated runs that contain a letter or digit, except list ordinals such as "1.". Without this, turning a numbered list into cards registered as a loss of its numbers.

**D-24. Labels that become a visual's structure are logged.** Some labels become a visual's structure: the four bold labels of 2.12 become the hypothesis card's panel titles, the "(Tier 1)" on each audit finding becomes the bar's tier badge, and the repeated Segment/Language/Channel/Format labels become matrix column heads. Each of these is logged in CUTS.md as kind "signpost" with its word count, so the balance shows where the words went.

**D-25. A conflict marker in a folded card also shows on its face.** The source marker stays where it was. A tile, card, row or visual whose folded text carries a `[CONFLICT Cn]` marker also shows the "under review" chip on its visible face, so closing the details never hides that a figure is disputed.

**D-26. 3.1's record restatement keeps its unique detail.** The credentials paragraph in 3.1 restates the record whose home is 2.10.1, but it also names "strategic planning", which 2.10.1 does not. Only the inflated opening ("Forensic analysis … highly powerful, under-utilized asset") is cut. The rest stays in 3.1's full text, so no detail is lost.

**D-27. The pillar crosswalk (3.2) shows only what the document states.** It lists the five groupings (campaign pillars, message pillars, production pillars P1 to P4, content buckets A to D, themes) with their counts, what each is for in the document's own words, and where each is set out. It does not map items across groupings, because the document states that mapping only for the message pillars (3.2.2). Inventing the rest would be a strategy decision, and pillar consolidation is listed for the owner.

**D-28. The segment tabs (3.4.2) carry the pillar table.** The pillar, language and channel table at the top of 3.4.2 becomes the first three fields of each segment's tab. The "core anxiety is a hypothesis" sentence becomes the tabs' standing note. Each tab shows its segment's fields in full, as the plan's list of fields (size, where, channels, anxiety, offer, proof) asks.

**D-29. 3.1.2's bars use the audit's four findings only.** The Controller of Budget's pending-bills figure is a different year, source and kind, so it stays in the text and is not added as a fifth bar.

## Stage 7: Part 4

**D-30. The phase sections 4.3.2 to 4.3.4 become per-section checklists, and their headings keep their ids.** The plan asks for one phase timeline across 4.3. Each phase is its own deep-linked heading (4.3.2, 4.3.3, 4.3.4), and merging them would move or retire three anchors. So each phase's deliverable list becomes a checklist under its own heading. The pointer each phase repeated to the target ladder is logged as a signpost, because the ladder is 4.3.1, directly above. 4.2.1 and 4.2.2 become timelines in place, and 4.4's sequenced calendar becomes a timeline.

**D-31. The workstream groups are described once, in 4.5.** Each workstream's banner ended with its group and, for the first workstream in a group, a sentence describing the group. Those sentences move, verbatim, into the group cards at the top of 4.5 (kind "moved"); the repeats in later banners are logged as duplicates. The "Group:" line itself stays in every banner, so a reader who lands on a single workstream by deep link still sees which group it belongs to. "Platforms and content" had no describing sentence in the source, so its card carries only its title and range.

**D-32. Each workstream's owner line opens its lead.** The banners under the workstream headings state who owns the work. A lead is extractive, so each lead opens with the banner's own owner sentence and stops before any detail; the banner stays in full below it. 4.5.12's lead keeps "gated on Section 5.3.4" and "ward-level aggregate scoring only", which are the 5.3.4 gate rule and must stay visible.

**D-33. Moved text counts for the section it joins.** When a sentence moves into another section's visual (D-31), check 4 now matches that visual's words against the moved text too, not only against the section's own original words. Without this, the moved words were debited from the destination and then excluded again as "added", counting the same words twice.

## Stage 8: Parts 5 and 6

**D-34. The withdrawn ">60%" note in 5.1.3 is folded, not cut.** The plan says to cut it from reader view and log it. The note is also the hedge on the claim it follows: it says the "large share" of interaction from non-residents is not yet supported by any source and will be replaced by the Week 1 measurement. Cutting it would leave the claim stated more strongly than the document supports (brief section 2, rules 2 and 3). So the note moves into the Geographic Skew card's details, and the card shows a "not yet tiered" badge on its face.

**D-35. The 5.3.3 charter stays in full, and the mounted charter component does not replace it.** The plan allows deleting the quoted charter if the mounted `DataSecurityEthicsCharter` renders all ten clauses verbatim. It does not: it renders five rules in its own words. So the quoted charter stays, marked to show on load, as does the line saying where and in which languages it is published. Only the "Why publish it" paragraph is summarised, as the lead, with the full paragraph and "Operational backing" in the fold.

**D-36. A value mismatch between the charter and the component is reported, not resolved.** Clause 5 of the charter says personal data is deleted "within 90 days of the declaration of results". The mounted component's deletion rule says "30 days after gazettement of final election results". Values are out of scope (brief section 3), so both stand, and the mismatch is listed in REPORT.md for the owner.

**D-37. The 5.3.4 gate stays visible.** The gate rule is the lead. The "does not assert … legally clear" paragraph (a "not a legal opinion" statement) and the "Until step 4 is complete" fallback are marked to show on load. 5.3.1's "not a legal opinion" framing is also marked to show. The five open legal questions become a checklist and the process table a stepper with Owner and Output in each step's details. The framing line "The single most important governance control in this document" is cut as a signpost.

**D-38. 5.3.6's three mandatory actions leave the warning callout.** The callout keeps its heading, the paragraph on ODPC guidance and the current status. The three actions follow it as a checklist, with the "Prior to any mass SMS/USSD broadcasting … MUST" sentence as the checklist's note, so who must act stays on the face.

**D-39. Inline chips and cross-references inside a row's face are drawn as text.** A visual row with details is a button, and a tier chip, conflict chip or section link inside it nested one control in another (a hydration error in development and an accessibility fault). Inside a row face these now render as plain badges and plain section numbers (`components/markdown/InertMarks.ts`). Each chip keeps the words it stands for as screen-reader text, and each reference keeps its section number; only the jump is lost on a face.

**D-40. Visual faces break at a sentence end, never at a semicolon or colon.** Stage 8's list and table conversions show an item's first sentence when it is short, the whole text when it has no sentence break and is short, and otherwise only the label, with the text in the details. Breaking at a colon had left faces such as "Publish:" and "X:".

## Stage 9: Annexes A to G

**D-41. B.1's ward register stays as eight constituency panels.** The plan asks for the forty ward bullets to become a sortable table in a disclosure. Each constituency heading carries that constituency's registered-voter total and its tier, which a ward table would have to restate as an extra row per constituency. The h4 accordion already shows one constituency open and seven closed, which meets the section's on-load target, so the bullets stay as found.

**D-42. F.1 is shown in full.** The terms of use are never summarised (brief section 2, rule 7). All three paragraphs are marked to show on load; the section has no lead.

**D-43. The annex intros stay.** The plan keeps the intros for annexes A, B, D, E and G. Annex C's intro callout ("Re-cut against the production pillars") is left as found rather than given a lead, because a lead above an annex's opening line would sit above the annex marker.

**D-44. E.6's scenario numbers are kept as found.** The standing scenario library runs 1 to 5, then 7. Each number now opens its scenario's label, so the gap stays visible; it is an open item, not a typo to fix.

**D-45. G.4's component count is reported, not corrected.** G.4 says it specifies "the six core software components" and then names five. The count is a value in the source, so it stands and is listed in REPORT.md.

**D-46. Stage scripts share their helpers.** From Stage 9, the block, list, sentence-face and keep helpers live in `scripts/declutter/stage_helpers.py`. Stage 8's script keeps its own copy, as it ran.

## Stage 10: figure slimming and the derived visuals

**D-47. Figures slim at the frame, not in the specs.** Section 7 moves a figure's notes, methodology and per-point text behind a "Method and notes" disclosure. Both figure frames (`components/register/Figure.tsx` for the register, `components/figures/FigureFrame.tsx` for series figures) now show the headline, the marks, the takeaway and the source line, with one "Details and notes" control. Behind it are the question or measure line, the notes, and, inside the register's text-shaped charts, each card's, step's, pillar's and point's body text (`components/register/FigureDetails.tsx`). No spec text, value, source, tier, date or kind was edited. Every piece behind the control is a FoldBody: in the HTML, opened by find in page or a deep link, printed, and shown with scripts off. "View the data" is unchanged.

**D-48. The last seven derived visuals are retired by override.** Of the 34 derived heading visuals, 27 were retired by option (a) as their sections gained `visual` fences in Stages 4 to 9. The remaining seven (2.2, 2.4, 2.11, 3.1.1, 4.6, B.5, E.12) redrew bullets that stay in their sections, so they are set to `kind: none` in `scripts/section-visual-overrides.json` with that reason (option c). `data/section-visuals.generated.json` now holds no derived visuals.

**D-49. The 80-words-per-figure target is not met by 83 of 89 figures.** About 40 figures are drawn by bespoke components that lay out their own records (holding positions, severity ladders, the scorecards, the compliance and procurement figures), and most register charts carry their text in the marks themselves (matrix cells, gauge targets and baselines, decision branches, tile-map labels). Meeting the target would mean rewriting those renderers one by one or folding marks, which section 7 keeps visible. This is recorded for the owner with the screens stop (REPORT.md).

**D-50. Hard stop: the screens target is missed by more than 25%.** After every section in the plan was done, the site measures 362 phone screens against a target of 170 (the stop line is 212). Visible words fell from 62,286 to 42,962 (target 26,000). The work stops here, before the PR and merge, as brief section 11 requires, and REPORT.md sets out what blocks the target.

## After the stop

**D-51. The owner chose to collapse figure charts (option 2 of REPORT.md).** On 2026-10-29 the owner chose: "Collapse figure charts behind a control, showing only the headline and takeaway." Both figure frames now show the headline and the takeaway. One "Show the figure" control opens the marks, the question or measure line, the notes, each item's body text, the data table and the CSV link. Two things stay visible next to the headline and takeaway, because brief section 2 keeps them in view whatever else is folded: the source line with its tier pills (rule 5) and a figure's conflict flag (rule 6). Everything behind the control is a FoldBody, so find in page, deep links, print and scripts-off still reach it. This replaces D-47's narrower fold. The site went from 362 to 266 phone screens and from 42,962 to 30,170 visible words. Mounted components (option 1) are unchanged.

## Stage 11: verification

**D-52. Folds now print.** `globals.css` drops `[hidden]` from paper with `display: none !important`. It comes after the fold rule in `app/declutter.css` at the same specificity, so every closed fold, which carries `hidden="until-found"`, was missing from print. The print rule now also matches `[data-fold-body][hidden]`, which outranks it. Measured on /delivery: the PDF went from 1,634 to 4,455 words, and check 13 counts every fold body displayed under print on all 19 tabs.

**D-53. Working marks in component text become chips too.** Five strings typed in components rather than content still showed a raw "(Tier N" or "[CHECK REF]": in the decision panel, the analysis-export figures, the disputed-figure note and the feature-phone specimen. They now pass through `InlineMarks`, the plain-string form of the same chips. No words changed.

**D-54. Long paragraphs that are notes, not commitments, fold.** Check 11 found long paragraphs in places the plan did not reach:
- The analysis panels' reading notes (60–87 words each) now sit behind "Read the notes".
- Two kept paragraphs are no longer kept: 3.7's "Two rules on top", and 4.6.3's, which becomes that section's lead and its full text.
- The 81-word callout at the top of Annex C moves to the head of C.1 (logged as moved).
- The ward overlay's computed sentence pair is split into two paragraphs.
- Four visual faces moved their long text into the item's folded fields: the radio card's reach and the three message pillars' narrative statements. The hypothesis card's closing sentence moved into its body.
The 5.3.3 charter clauses and F.1 stay whole under rule 7; check 11 lists them as the only exceptions.

**D-55. Tier mismatches are generated, not hand-listed.** `scripts/declutter/tier-mismatches.mjs` pairs each token with a "(Tier N" parenthetical that follows it within four words, and compares the two. It found 58 pairs; 2 disagree (2.9.1's 2019 census phone and internet shares, which are T2 in the data and typed "Tier 1"). The typed tier renders, as X1 requires, and TIER-MISMATCHES.md lists both for the owner. `check:declutter` fails if the file is stale.

**D-56. Accessibility and layout shift fixed at their source.** Lighthouse (mobile) scored the baseline 99, 98 and 98 on /, /evidence and /strategy, and this branch the same before these fixes. Three audits failed:
- **heading-order.** Figure, card and panel titles in 46 components are h4 or h5 wherever they are mounted, so under an h2 the outline skipped a level. `components/HeadingOutline.tsx` gives any heading deeper than one below its predecessor an `aria-level` one below it. Section headings keep their level, and no markup or style changes.
- **aria-allowed-role.** `role="group"` is removed from `<figure>`s, which take their name directly.
- **label-content-name-mismatch.** The dock button is named by its visible text plus a screen-reader-only ". Open the index."

The evidence page's CLS of 0.48 (0.48 at baseline too) came from the 2.1 story switching to its pinned layout after hydration. An inline script in `app/layout.tsx` now sets `data-story-pin` on `<html>` before the first paint, where WebGL exists and reduced motion is off. The pinned layout's CSS keys off that flag, so the layout is right from the start. With scripts off, nothing is set and the story stays unpinned, as before. Result: accessibility 100, 100 and 100; CLS 0 on all three; performance 44, 42 and 54 against a baseline of 44, 16 and 49.
