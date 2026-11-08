# The restructure, as applied

This records how `RESTRUCTURED-TOC.md` was applied to the site, where the build differs from the proposal and why, and the preservation audit for the change. Body copy was not rewritten. Routes, data and figures are unchanged.

## What changed on the site

**Reading order** (`lib/heading-slug.ts`, which `lib/flow.ts` follows on both reading surfaces):

| Part | Chapters, in order |
|---|---|
| The case in brief | Who this is for · The case on one screen |
| Kitui today | The county in numbers · What voters need · How voters get news · How Kitui voted |
| The contest | The race for 2027 · His record and reach · The diagnosis |
| The strategy | The goal · The position · The message · The voters to win · Channels and language |
| The plan | Who does what · Timeline to August 2027 · The fourteen workstreams |
| Proof and protection | Measuring success · Lawful and ethical · Risks and response |
| The decision | The platform in one view · What you get and what you provide · The ask |
| The evidence behind it | Evidence and sources · Fine print |
| The working platform | Platform playbooks · Runbooks · Technology |

**What moved:**
- "How Kitui voted" moved to the end of Kitui today.
- "How the platform works" moved to the start of The decision, as "The platform in one view".
- Playbooks, runbooks and technology now come after the evidence shelf, under their own band, "The working platform". That band carries no part dots and is introduced as "For the campaign team".

**Sections moved between chapters.** Each was moved word for word with `scripts/consolidation/move-section.mjs` and logged in `docs/consolidation-2026-11/ledger.json`. A one-line pointer was left where each section had been.

| Section | From | To |
|---|---|---|
| The 40-ward register (B.1) | How Kitui voted | Evidence and sources, after the source table |
| Volunteer programme reference (D.1) | The fourteen workstreams | Platform playbooks, at the end |
| Account security baseline (F.8) | Lawful and ethical | Runbooks, before the incident response plan |
| Phishing awareness (F.9) | Lawful and ethical | Runbooks, before the incident response plan |

**Titles:**
- Chapter titles and subtitles follow the TOC.
- Part names and questions follow the TOC.
- 62 section headings were retitled. Each kept its number, so every anchor id and every word-balance key is unchanged. The full before-and-after list is in `retitles.json`.

**Links.** Old links to the four moved sections now redirect to their new homes. `scripts/consolidation/anchor-moves.mjs` now also covers ids that were live at `b7bc346`. Section links from figures now resolve correctly for living standards, the county's money and the response tiers (`lib/register/specs/_util.ts`).

## Where the build differs from the proposal

| Proposal | As built | Why |
|---|---|---|
| "Every ward in one table" as its own chapter | The ward register is the last section of Evidence and sources | A new chapter needs a new lead paragraph, and every chapter must open with one (`check-leads`). That would be new copy, which the brief excludes. The reader finds it in the same part, straight after the sources. |
| Phase headings retitled (e.g. "Awareness, October to December 2026") | "Phase 0", "Phase 1" and the other phase names kept in their headings | The timeline, the phase rail and the body text all refer to phases by these names. Removing them from headings would leave readers unable to match them. |
| Workstream headings without numbers | "Workstream 1" to "Workstream 14" kept | The body refers to workstreams by number more than 50 times, and so do the strategy lists. |
| Minor retitles: "The levels", "Side by side", "Terms used on this site" | Original headings kept | The originals already read plainly, and "proposal" is how the whole site describes itself. |
| Part names in the cover's spine figure | Updated to match the new parts | The figure is the site's own table of contents. |

## Preservation audit

- **Words:** every content check passes, against all three earlier bases (`npm run verify`).
- **Tokens and names:** 430 units and 2,307 tokens, acronyms and names, all present where their passage now lives. `scripts/restructure-2026-11/check-preservation.mjs` now follows a chain of moves to its end, not just the first move.
- **Counts:** no chapter count is below its baseline across the site (`npm run check:preservation`):
  - headings: 278 before, 278 after
  - visual fences: 119 before, 123 after
  - lead fences: 107 before, 108 after
  - table rows: 542 before, 544 after
- **Per-chapter counts:** they fall only in the three chapters that handed a section on: How Kitui voted, The fourteen workstreams, and Lawful and ethical. `scripts/check-preservation.js` allows a fall only for a chapter with a logged move out, and only while the site-wide total holds.
- **Unchanged:** figures (630), wards (40), projects (401), CSV downloads (93) and figure fences (92).
- **Earlier pass's guard:** the ownership pass's rewrite check (`scripts/ownership-2026-11/roles.mjs`) now expects today's wording for the eight lines this pass changed. Each still gives the work to the campaign team, not to Firefly.

## The six content conflicts, fixed

`scripts/toc-2026-11/content-fixes.mjs` applies 25 rewordings. Every change to the chapters is logged word for word in `ledger.json` and `CHANGES.md`. Its `--check` mode runs in `npm run verify`, so the old wording cannot return unnoticed.

| Chapter | It said | It now says |
|---|---|---|
| Who this is for | "Confidential … shared by link only"; "six Parts and eight annexes" | Prepared for Dr. Mulu personally, open to anyone with the link and kept out of search engines; "the parts that follow". The hero seal, the footer and the share-card text match. |
| The case on one screen | "asks for one week, one export" | Asks him to approve the platform; his team runs the campaign through it |
| Measuring success | The team enters indicators on the platform (sign-in is off) | It does so once the engagement starts |
| The platform in one view | "Dr. Mulu's team signs in to change it" | Once the engagement starts, his team signs in to change it |
| The ask | "one week and one export", plus read-only access and an "Access granted" first day in the decision figure | Approve the platform at the recommended Standard level; on day 1 the team signs in, and on days 1–2 the team enters its own export. Firefly holds no credentials. |
| Fine print | "submitted in confidence" | Submitted to him and those he authorises. It is open to anyone with the link, and the request not to circulate it stays. |

## Still to do

- **What the campaign provides** still lists read-only analytics access as one of three gating dependencies. That wording sits partly in a text-version block, which the content guard allows to change only through a logged dispute decision.
- The leads of Platform playbooks and Runbooks still point to "Annex D" and "Lawful & ethical".
- The cover date is still "September 2026".
- The ward dossier still shows spending limits, which the site's own rules exclude (`docs/consolidation-2026-11/HOW-TO-UPDATE.md`, "No campaign-finance ceilings").
