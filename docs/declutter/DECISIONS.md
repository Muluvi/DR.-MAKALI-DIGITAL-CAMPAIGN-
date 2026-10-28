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
