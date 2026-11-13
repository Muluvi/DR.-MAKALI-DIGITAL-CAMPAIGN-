# Streamline-for-purpose pass: the prompt

Written 10 November 2026 with the Lyra 4-D method (deconstruct, diagnose, develop, deliver) and run
the same day. `REPORT.md` beside this file records what the run changed and what it measured.

## The request, as given

> Content is in places that make the website not streamlined for purpose. The content is okay but
> does not flow well for purpose. There's too much text that can be summarised and also displayed
> using multiple visual tools, aids, enhancements, animations. Make a prompt that analyses the
> entire website without skipping anything and makes improvements.

## Diagnosis

Category: complex, multi-part (audit, information design, front-end build, verification).
Assumptions made instead of questions, because the run was unattended:

1. **Purpose** means the site's own stated purpose: one reader, Dr. Mulu, on a phone, deciding
   whether to approve the engagement. Everything else is reference for his team.
2. **"The content is okay"** means no claim, figure or sentence is rewritten or deleted. The work is
   order, summary and presentation.
3. **"Summarised"** means a summary layer drawn from the document's own words and numbers, with the
   full text one tap away, never a second authored version that can drift from the first.

## The prompt

```text
<role>
You are a senior editorial product designer and front-end engineer. You have shipped long-form
decision documents for political campaigns and for boards: scrollytelling proposals that one busy
person reads on a phone and then says yes or no to. You are fluent in Next.js 15 App Router,
React 19, Tailwind 4 and CSS-first motion, and you treat a repository's build guards as part of the
brief rather than as obstacles.
</role>

<context>
The repository is Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-: Firefly Management's proposal to
Hon. Dr. Benson Makali Mulu for his 2027 Kitui gubernatorial campaign, built as a website.

How it is built:
- 28 chapters of markdown in content/*.md (about 65,000 words). scripts/build-content.ts resolves
  {{tokens}} from the figure registry (lib/data/figures.ts) and writes public/content/*.md.
- "/" is the whole proposal as one scroll (components/ClientPage.tsx): cover hero, a preface, then
  every chapter in lib/heading-slug.ts SECTIONS order, grouped into eight acts (lib/flow.ts).
  Chapters after the first are fetched as the reader approaches (components/flow/StreamedSection.tsx).
- "/<chapter>" serves one chapter; "/full" serves everything server-rendered, for print.
- Inside a chapter, MarkdownViewer already shows a lead and visuals per section and folds the prose
  behind "Read the full text" (lib/collapse-groups.ts, lib/fold.ts).
- The working platform (/dashboards, /explore, /strategies, /progress, /workspace, /history, /tools
  and its eight tools) is what the campaign team uses day to day.

What the audit measured on a 390 x 844 phone before this pass:
- "/" is about 441,000 px tall: roughly 520 phone screens.
- 38,700 words are visible on load across the chapters, behind 1,187 folds and 772 buttons.
- The reader meets, in order: the hero, four figures, a generic "decision map" of four slogans, a
  ward map, the same four figures again, a front-matter chapter with a postal address, and only
  then the case. The decision he is asked for is the 23rd chapter.
- The chapters themselves are already visual. What is missing is a level above them: nothing tells
  the reader what a chapter concludes without reading it.
- /dashboards opens on nine empty cards ("No indicator has been measured yet") before any chart
  that has data.
</context>

<task>
Audit every route and every chapter, then make the site read as one argument a decision-maker can
finish in minutes, with the full evidence still one tap away. Work in four phases and do not start
a phase before finishing the one before it.

Phase 1. Audit, skipping nothing.
  1. List every route the build emits, including the catch-all's 30 static paths and every
     platform and tool page. Load each one at 390 px and at 1280 px.
  2. For each chapter record: rendered height, words visible on load, paragraphs over 60 words,
     visuals, folds, and what repeats something an earlier screen already showed.
  3. For each platform page record its height, its first screen, and anything empty or repeated.
  4. Write the findings as a table. Every later change must cite a row of it.

Phase 2. Decide the reading order by purpose.
  State the reader's questions in the order he asks them (what is this, what is the case, what do
  you want from me, why should I believe it, what happens next) and map each to a screen. Where the
  present order makes him scroll past reference material to reach an answer, change what shows by
  default. Do not renumber, rename or move a chapter: section ids are the document's addresses.

Phase 3. Build.
  A. A summary layer on "/". Each chapter opens as a one-screen digest: its takeaway, its key
     numbers, and the steps of its argument, all derived at build or request time from the
     chapter's own markdown (its first lead fence, its first stats visual, its level-2 headings).
     Nothing in a digest is typed by hand. The full chapter opens in place with one tap and closes
     again. The case and the ask stay open, because they are the pitch and the decision.
  B. One route map in place of the generic overview: the six parts as a journey, each with the
     question it answers and its chapters, every stop a jump, and a direct way to the decision.
  C. Remove repetition from the opening so each figure is introduced once before the case.
  D. Motion that carries meaning: numbers count up once in view, the route draws forward, a digest
     settles as it arrives, an opening chapter unfolds from its control. CSS first, transform and
     opacity only, tokens from MOTION-SYSTEM.md, final values in the server HTML, nothing under
     prefers-reduced-motion.
  E. Platform pages: lead with what has data; collapse empty states into one line that says what
     the team enters to fill them.

Phase 4. Verify and ship.
  Run lint, the type check, npm run verify, npm run check:preservation and the build. Re-measure
  every route from Phase 1 and report before and after. Exercise a deep link into a closed chapter,
  the index, print and both themes in a real browser. Open a pull request, merge when CI is green,
  and confirm the production deployment serves the new build.
</task>

<constraints>
- Change no sentence, figure or source in content/*.md. If a wording change seems necessary, stop
  and list it instead of making it.
- Retype no registry value in code (scripts/consolidation/scan-literals.mjs fails the build).
- Every existing deep link, legacy anchor and section route keeps working. A link to a heading
  inside a closed chapter opens the chapter and lands on the heading.
- "/full" and print still carry the entire document, opened.
- The copy gates in scripts/check-copy.ts apply to new interface text: no opinion-research words,
  no engagement money words, no "remote" framing.
- First load must not get heavier. A closed chapter costs no fetch and no hydration.
- No new dependency. No new colour, font or duration outside the existing tokens.
- Do not add features nobody asked for (AGENTS.md, scope discipline).
- Do not: add filler copy, restate what a heading already says, hide a tier or provenance mark,
  animate a number towards a value it does not end on, or leave an element invisible when
  JavaScript or IntersectionObserver is missing.
</constraints>

<output>
1. The code changes, on a branch, as focused commits.
2. docs/streamline-2026-11/REPORT.md: the Phase 1 table, the purpose map, what changed and why,
   before and after measurements per route, and what was deliberately left alone.
3. A final message of under 200 words: what the reader now sees, the headline numbers, anything
   that needs the owner's decision.
Write at the standard of a design lead's handover note: specific, measured, no adjectives doing the
work of numbers.
</output>

<self_check>
Before delivering, verify against every constraint above. Confirm by test, not by reading the code:
a deep link opens a closed chapter; the page is complete with JavaScript off at /full; reduced
motion shows final values; both themes pass contrast on the new components; no horizontal scroll at
390 px. Flag every assumption you made and every finding you chose not to act on.
</self_check>
```

## Why the prompt is shaped this way

1. **The purpose is stated as a reader and a decision.** "Streamlined for purpose" cannot be judged
   without naming whose purpose; the prompt fixes it so every change can be tested against it.
2. **The audit is a phase with an output.** "Without skipping anything" becomes a table of every
   route and chapter that later changes must cite, which is what stops a redesign from drifting
   into taste.
3. **The summary is derived, not written.** A hand-written summary of a 65,000-word evidence
   document is a second document that goes stale. Building digests from the chapter's own lead,
   numbers and headings keeps one source of truth and passes the repository's literal scan.
4. **The guards are in the brief.** This repository fails its build on a moved figure or a changed
   sentence. Naming those checks as constraints prevents work that could never merge.
5. **Motion has a rule.** "Animations" on their own invites decoration. Tying each one to what it
   shows, and to the existing motion tokens, keeps the additions consistent with the site.

## Reusing it

Run it again after any large content change: Phase 1 is cheap and shows whether new chapters have a
lead and a stats visual for their digest. To aim it at one chapter, replace Phase 3 with "apply A
to D inside <chapter> only" and keep everything else.
