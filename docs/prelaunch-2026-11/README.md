# The pre-launch pass (November 2026)

What the site says to a reader before it launches. Firefly's brief, by section:

1. **No document numbering a reader can see.** Headings already drop their number on screen
   (`displayTitle`, `lib/heading-slug.ts`); the number stays in the markdown because it makes each
   heading's id (`#winning-sec-2-5`) and keys every content check, so no link or check moves. Every
   in-text reference ("Section 3.7", "§3.6.2", "Chapter 4", "Annex B", and the bare numbers in the
   deliverables schedule's last column) is now a link carrying the heading's own words
   (`scripts/prelaunch-2026-11/refs.mjs`). The text versions are kept word for word, so theirs are named on the page
   by the renderer, as are the citations in figure specs and hand-built panels
   (`lib/reader-text.ts`, from `lib/section-titles.generated.json`). Stage dots read "Stage: Data",
   not "Part 1 of 5"; figure labels and CSV links show no figure ids.
2. **Draft history leaves the chapters.** Notes about earlier drafts and corrections move, word for
   word, to "Source notes and corrections" in Evidence and sources, grouped by chapter.
3. **No tier tags in the prose.** "(Tier 1, KNBS 2019 Census)" reads "(KNBS 2019 Census)". Each
   figure's tier stays in Evidence and sources, in the figure registry (`lib/data/figures.ts`) and in
   every CSV; the tier column of the evidence tables is unchanged.
5. **Copy follows what is switched on.** While team sign-in (`PLATFORM_TEAM_LOGIN`) is off, nothing
   says the team can already edit, that records are live or that edits are logged.
7. **The headline register figure** is the IEBC's 2022 count; the unconfirmed July 2026 figure is
   explained where the register is.
8. **The Kikamba phrases** read "Awaiting native-speaker review", not "draft".
9. **One style for his name**: "Hon. Dr. Benson Makali Mulu" first in each chapter, then "Dr. Mulu".

Sections 4 and 6 (the ask, and the scope levels) wait on Firefly's wording; section 10 is a list of
lines for Firefly to judge, with no edits.

## How it is checked

`scripts/prelaunch-2026-11/apply.mjs` makes every content change and logs it in `ledger.json`
(`CHANGES.md` is generated from it). `npm run check:content` weighs the pass against its base
(057b474) and fails if a listed rewrite is undone or a numbered reference returns to reader text.
