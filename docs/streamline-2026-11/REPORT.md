# Streamline-for-purpose pass: what the run found and changed

10 November 2026. The prompt is `PROMPT.md` beside this file. Measurements were taken in Chromium
on a production build, at 390 x 844 unless stated.

## Headline

| "/" on a phone | Before | After |
|---|---|---|
| Page length | 441,013 px (about 520 screens) | about 37,100 px (about 44 screens) |
| Words visible on load, whole page | about 39,000 | 2,911 |
| Controls visible on load | 911 in the chapters alone | 163 on the whole page |
| Screens before the case | hero, four figures, a slogan panel, the ward map, the four figures again, a front-matter chapter | hero, four figures, the route, the ward map, a one-screen cover digest |
| Chapter markdown fetched by scrolling to the end | all 27 streamed chapters | 2 (the case and the ask); the rest only when opened |
| Taps to the ask from the top | none available; scroll about 250,000 px | 1 ("Go to the ask") |

No sentence, figure or source in `content/*.md` changed. `npm run verify`,
`npm run check:preservation`, lint, the type check and the build pass.

## Phase 1: the audit

### Every route

| Route | What it is | Finding | Action |
|---|---|---|---|
| `/` | The proposal as one scroll | 441,013 px; the decision is chapter 23 of 28 | Summary layer (below) |
| `/full` | Everything, server-rendered, for print | Correct for its job | Unchanged; print from `/` now goes here |
| `/<chapter>` x 28 | One chapter, for shared links | Correct for its job | Unchanged |
| `/dashboards` | The team's charts | Opened on eight empty cards before any chart with data | Charts with data first; empty ones as one list |
| `/explore` | Every dataset, searchable | A working table; length is the data | Left alone |
| `/strategies` | 79 objectives, strategies, workstreams | Filterable cards with search; reads as intended | Left alone |
| `/progress`, `/workspace`, `/history` | Team working pages | Short, task-shaped | Left alone |
| `/tools` and eight tools | Calculators and planners | Each opens on its control | Left alone |
| `/tools/visual-kinds` | Internal specimen page | Not linked from the story | Left alone |
| `/team/login`, `/team/data`, `/team/admin` | Sign-in and editing | Return 404 while team sign-in is switched off (PR #67) | Left alone; see "For the owner" |

### Every chapter (single-chapter route, before this pass)

| Chapter | Height px | Words on load | Paragraphs over 60 words | Figures | Folds | Buttons |
|---|---|---|---|---|---|---|
| cover | 3,842 | 540 | 0 | 2 | 4 | 2 |
| brief | 1,685 | 193 | 1 | 1 | 2 | 2 |
| kitui | 8,687 | 1,004 | 0 | 6 | 38 | 37 |
| needs | 16,946 | 2,825 | 0 | 9 | 124 | 126 |
| news | 13,253 | 1,522 | 0 | 8 | 47 | 55 |
| votes | 24,714 | 3,647 | 4 | 9 | 83 | 67 |
| race | 8,472 | 1,120 | 0 | 6 | 53 | 45 |
| record | 10,903 | 1,351 | 0 | 6 | 46 | 37 |
| diagnosis | 6,392 | 944 | 0 | 4 | 26 | 22 |
| goal | 5,040 | 580 | 0 | 7 | 19 | 10 |
| position | 2,547 | 272 | 0 | 1 | 9 | 9 |
| message | 18,481 | 2,853 | 1 | 14 | 66 | 66 |
| voters | 8,581 | 1,069 | 1 | 4 | 29 | 27 |
| channels | 15,241 | 2,085 | 1 | 15 | 43 | 21 |
| engagement | 19,886 | 2,113 | 0 | 14 | 88 | 51 |
| timeline | 14,817 | 1,841 | 0 | 14 | 50 | 41 |
| workstreams | 17,709 | 2,207 | 0 | 18 | 174 | 54 |
| success | 10,717 | 1,660 | 0 | 9 | 45 | 39 |
| lawful | 17,141 | 2,478 | 2 | 11 | 44 | 48 |
| response | 10,197 | 1,447 | 0 | 10 | 22 | 19 |
| platform | 2,193 | 273 | 0 | 4 | 1 | 1 |
| receives | 11,941 | 1,529 | 0 | 5 | 28 | 25 |
| ask | 1,931 | 149 | 0 | 1 | 10 | 3 |
| annex-evidence | 19,132 | 2,467 | 1 | 5 | 31 | 32 |
| annex-terms | 2,882 | 385 | 1 | 0 | 1 | 3 |
| annex-playbooks | 3,205 | 448 | 0 | 2 | 12 | 15 |
| annex-runbooks | 8,359 | 1,173 | 1 | 7 | 32 | 33 |
| annex-technology | 4,847 | 522 | 0 | 4 | 21 | 21 |
| **Total** | **289,741** | **38,697** | **14** | **196** | **1,148** | **911** |

What the table says: the earlier passes already did the work inside the chapters. Almost no long
paragraph is visible, and every chapter carries figures. The problem was one level up. Twenty-eight
well-made chapters laid end to end are still 290,000 px, and nothing told the reader what a chapter
concludes without reading it.

### Repetition at the top of "/"

The four cover figures appeared three times before the case (the hero strip, inside the ward-map
figure, and in the spine figure), the six parts appeared twice, and the "Decision map" panel held
four labels that named no finding ("Source-led", "40 wards", "5 phases", "200k") and a caption
about which chapter has the most words.

## Phase 2: the reading order, by purpose

| The reader asks | Where it is answered now |
|---|---|
| What is this, and is it for me? | The hero |
| What are the numbers? | The four figures under the hero, once |
| How long is this, and where is the decision? | The route: six questions, every chapter one tap, "Go to the ask" |
| What is the case? | "The case on one screen", open, third screen of content |
| Why should I believe each step? | Each chapter's digest; the chapter itself one tap below it |
| What do you want from me? | "The ask", open, and reachable from the route |
| Where does a figure come from? | The evidence shelf, after the proposal, as before |

No chapter was moved, renamed or renumbered.

## Phase 3: what was built

**A. Chapter digests** (`lib/digest.ts`, `components/flow/ChapterDigest.tsx`). On "/", 26 of the
28 chapters open as one screen: the takeaway, up to four numbers, the steps of the argument, and
"Read the chapter". The case and the ask stay open. Nothing in a digest is typed by hand:

- the takeaway is the chapter's first `lead` fence, rendered through the chapter's own components,
  so tier marks and the nomination window read as they do in the chapter;
- the numbers are the items of the chapter's first `stats` visual, tier included (12 chapters have
  one; the other 14 show the takeaway and the steps);
- the steps are the chapter's level-2 headings from the section index; each one opens the chapter
  and lands on that heading.

A closed chapter is not fetched and not mounted. Opening it streams it exactly as before. A link to
a heading inside a closed chapter mounts it, opens it and lands on the heading (tested with
`/#lawful-sec-19-3`). "Close this chapter" at the foot returns the reader to the chapter's head.

**B. The route map** (`components/flow/RouteMap.tsx`) replaces the "Decision map". Every word in
it is read from `lib/flow.ts` and `lib/heading-slug.ts`.

**C. The opening.** The spine figure moved from the preface into the cover chapter. The repeated
"Four figures" block inside the ward-map figure is hidden on "/" only. `/full`, `/cover` and print
keep both whole.

**D. Motion** (`app/streamline.css`). Digest numbers count up once in view (the existing
`CountUp`); the route's line draws down and each stop takes its colour as the line reaches it; a
digest's steps draw forward in order; an opened chapter unfolds from its control (the existing fold
entrance). All of it is gated on `html.motion-ok`, so the server HTML, a reader without scripts and
a reader with reduced motion see final values. Transform, opacity and colour only; existing tokens.

**E. Dashboards.** The charts with data lead. The eight team charts that are still empty are one
card that says what fills each. When the team enters records, those charts move to the top.

**Also:** "Print, or save as PDF" on "/" now opens `/full` before printing, since "/" no longer
holds every chapter. `components/VisualOverview.tsx` and its styles were removed.
`lib/digest.test.ts` (five tests) runs in `npm run verify`.

## Phase 4: verification

| Check | Result |
|---|---|
| `npm run lint`, `npx tsc --noEmit` | pass |
| `npm run verify` (all guards, 17 unit tests + figure tests) | pass |
| `npm run check:preservation` | 259 protected files present, no count below baseline |
| `npm run build` | pass, 41 static pages |
| Scroll "/" top to bottom | 2 chapter fetches, no console errors, no horizontal scroll at 390 px |
| Open and close a chapter | body mounts, 10 headings present; closes to the chapter head |
| Step link inside a digest | opens the chapter, lands on the heading |
| Deep link into a closed chapter | opens it, heading at the top of the screen |
| `/#section-<chapter>` | lands on the digest, chapter stays closed |
| `/full`, `/<chapter>` | no digests, heights unchanged |
| Dark theme, 1280 px | checked by eye |

## Deliberately left alone, and why

- **The wording.** The request said the content is right. The 101-word paragraph in "The case on
  one screen" is the longest visible on the page and is marked `<!-- keep -->` in the source; it is
  listed here rather than cut.
- **Inside the chapters.** They are already lead, visuals, then folded text. Their evidence panels
  are dense (tier and status badges on every row), which suits a reader who has chosen to open the
  chapter.
- **The platform pages other than the dashboards.** They are working tools; their length is data.

## For the owner

1. **Find in page on "/"** no longer reaches the text of chapters that have not been opened,
   because closed chapters are not loaded. The index search covers every heading and figure, and
   `/full` holds everything on one page. If browser find across the whole document matters more
   than the lighter page, closed chapters can be loaded in the background instead; that is a small
   change with a data and battery cost on phones.
2. **Fourteen chapters have no `stats` visual**, so their digests carry no numbers (the race, the
   diagnosis, the goal, the position, the message, the voters, who does what, measuring success,
   lawful, risks, the platform, what you get, and the annexes). Adding one to a chapter's source is
   all it takes for numbers to appear on its digest.
3. **`/team/login` returns 404** while sign-in is switched off. That was a decision in PR #67, not
   something this pass changed.
