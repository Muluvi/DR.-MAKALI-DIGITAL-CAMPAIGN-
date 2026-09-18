# The vertical flow — one page, in one direction

**What changed:** the proposal stopped being a set of destinations behind a menu and became a
single continuous scroll, in the order the argument is built, with a figure under every one of its
273 headings.

**Who it is for:** one reader, on a phone, in Kitui, on a connection that is not fast.

---

## 1. The problem

The site was a tabbed reader. Nineteen routes, and on top of them a nineteen-item desktop sidebar,
a five-icon mobile dock, a floating quick-navigation capsule, a sticky section bar, a seven-button
toolbar and a full-screen index — **five simultaneous ways to reach a section**, on a document
whose reader is one person holding a phone.

Three consequences, and they compound:

1. **The first act was a navigation decision about an unread document.** The ask, the evidence and
   the engagement levels were each behind a different tap, and nothing told the reader which to
   take first.
2. **Chrome covered the figures.** Measured at 390px, the sticky toolbar sat over the prose it was
   scrolling past; measured at 1440px, the quick-nav capsule covered content in every section
   sampled.
3. **222 of the 273 sections had no visualisation at all.** Fifty headings carried a hand-built
   component. The rest were prose, tables and box-drawing diagrams in fenced code blocks.

## 2. The flow

`lib/flow.ts` holds the reading order. It is **not** the filed order.

The numbered order is the order a proposal is *filed* — cover sheet, confidentiality, summary,
analysis, scope, annexes. The order below is the order it is *read* when nobody can skip:

| Act | Sections | What it does |
|---|---|---|
| I — The ask | §0, §2 | What is being requested, and the short version of why |
| II — What we know | §1A, §3A, §3B, §3C | His channels, the contest, the number, the reach |
| III — What it implies | §4, §5, §6, §6A, §7 | Objectives, audiences, approach, engine, words |
| IV — What we will run | §8, §8A–§8D | Fourteen workstreams and their boundaries |
| V — How it is delivered | §9–§14 | Phasing, deliverables, measurement, governance, risk, team |
| VI — The close | §15, §16 | What this needs, and the decision |
| VII — Terms and reference | §1, Annexes A–E | Confidentiality, method, reference |

Two moves are deliberate:

- **§1 leaves the front.** Title, confidentiality and "how to read this" are front matter for a
  printed document and a closed door on a scrolling one: nobody arrives wanting the terms of a
  document they have not seen. §1 keeps its number, its route and every link into it, and sits with
  the annexes as the colophon.
- **§2 moves up behind the ask**, so a reader who stops after ninety seconds still has the whole
  offer.

**Nothing is renumbered.** Section numbers are the document's own addressing system and 837 deep
links depend on them. The flow is a reading order laid over the numbering, not a replacement.

## 3. What replaced the chrome

One element: a capsule at the foot of the screen carrying how far through the reader is, which
section they are in, and a way into the index. Beside it, one control — brightness, because this
document is read in daylight in Kitui and at night on a sofa. Print sits at the end of the
document, where a reader who wants a PDF has just arrived.

Everything else either became the default (Expand All) or was a way of undoing the tab layout
(density, focus mode, reading view) that no longer exists.

Punctuation comes from the document itself: **seven act seams** (the only full-bleed elements in
the reading column) and **thirty chapter markers**, each carrying the section number, its name,
what it is for, and how far through the document this is — the one thing a tab bar gave away for
free and a continuous scroll does not.

## 4. A figure under every heading

```
273 headings
 ├─  50  hand-built components   (components/markdown/*, unchanged)
 ├─ 191  derived figures          (scripts/build-section-visuals.mjs)
 ├─  31  their own interactive table
 └─   1  unnumbered, un-indexed
```

### How the derived figures work

`scripts/build-section-visuals.mjs` reads each heading's own prose and classifies it by the
relationship it expresses, following the chooser in the visuals handbook:

| The content says… | The figure |
|---|---|
| "Baseline … Target …" | Bullet chart — actual against target, with the escalation trigger behind a tap |
| "First …, then …" | Vertical stepper (also read out of the numbered spine of a text diagram) |
| "If …, then …" | Response playbook — trigger against response |
| "Phase −1 …", dated bullets | Vertical timeline |
| a × b × c = d | Build-up waterfall |
| shares that sum to ~100 | Waffle, one square per percent |
| likelihood × impact | 2 × 2 quadrant, tap a marker |
| many labelled magnitudes | Ordered horizontal bars, tap to hold one |
| one share of one whole | Donut, or an arc where it is a percentage |
| one count | Big number with context — never an arc, which would assert a ceiling the document does not state |
| a handful of figures | KPI stat rail with count-ups |
| criteria across items | The section's own interactive table |
| grouped definitions | Hub — tap a node to read it |
| an enumerated commitment set | Checklist grid |
| a sub-section opening onto its parts | Chapter map, with a glyph naming each part's own figure |
| one governing sentence | Pull quote, or a claim panel |

Everything is SVG and CSS. **No charting runtime is mounted for any of them** — 272 figures down
one page cannot each pay for a chart library, and recharts now sits behind a `next/dynamic`
boundary for the few hand-built charts that need it.

### Three rules the derivation obeys

1. **Derive, do not hand-mount.** A mount table keyed by heading id drifts the moment a heading is
   renumbered; `HEADING_INSERTS`' own comment records that happening. The specs are regenerated by
   `npm run verify` and on `prebuild`, so a rewritten part gets a figure that matches the rewrite.
2. **A figure that says nothing is not drawn.** Every payload passes a quality gate — enough items,
   readable labels, shares that actually sum to a whole — and anything that fails falls through a
   cascade (stats → checklist → hub → bars → the part's governing sentence) rather than off a
   cliff. Figures embedded in a sentence rather than written as quantities are rejected outright:
   a stat tile reading "a Tier 3, single-source repo" is worse than no tile.
3. **The exceptions are visible.** Where the derivation reads a part wrongly — a clock read as two
   quantities, a standard's version number read as a magnitude — the correction is one entry in
   `scripts/section-visual-overrides.json`, with a sentence saying why. The rule stays general.

### What is deliberately not drawn twice

A part whose figure would be a list of its own table's rows gets **no derived figure**:
`InteractiveTable` already renders that table with search, sorting, CSV export and a card layout on
phones. Two readings of the same eight rows, one above the other, is not coverage.

## 5. Making 480,000 pixels affordable

The whole document server-rendered into one page came to **4.9 MB** — 2.8 MB of markup and 2.0 MB
of the hydration payload that repeats it, or 662 KB on the wire. That is thirteen seconds on the
3G connection §8.1.1 calls non-negotiable, paid in full by a reader who never scrolls past the
executive summary.

Four changes, in order of what they bought:

| Change | Effect |
|---|---|
| Stream sections past the opening pair from `public/content/*.md` as the reader approaches | `/` is **276 KB, 41.7 KB gzipped** |
| `content-visibility: auto` with each section's **measured** intrinsic height | The browser lays out one screenful; the scrollbar still tells the truth |
| recharts behind a `next/dynamic` boundary; a dead re-export removed | ~90 KB of charting runtime off the first load |
| Every derived figure mounts within ~700px of the viewport | 272 figures cost what the visible one or two cost |

`/full` still renders all thirty sections on the server. It is what print, Save-as-PDF and a
reader with JavaScript off get, and it is where the `<noscript>` path leads. Each section route
still serves its own section, so a shared deep link lands on real HTML.

### Landing a deep link on a page that is still arriving

A link to §13.4.3 scrolls past twenty-five sections whose heights are reserved from an estimate.
Three things make it land:

1. **Measured heights, not estimated ones** (`data/section-heights.json`, regenerated by
   `scripts/measure-section-heights.mjs`). A least-squares formula over words, table rows, fenced
   lines and headings was tried first: 24% mean error, and 294% on Annex C, whose one enormous
   table collapses into a disclosure panel. Layout is not a function of word count.
2. **Jump to the section container first.** It is always in the server HTML at its measured height,
   so the page travels there immediately instead of waiting for a heading that has not streamed in.
3. **Hold the target until it stops moving.** The helper re-seats it every 110 ms until it has held
   still for four checks *and* no section is still fetching (`lib/flow-pending.ts`) — because a
   document's height holds perfectly still while a fetch is in flight and then jumps by thirty
   thousand pixels. A reader's own gesture releases the hold immediately and permanently.

One more thing, and it cost more time than the rest combined: `html` carries
`scroll-behavior: smooth`, and per spec `scrollIntoView({ behavior: "auto" })` means *use the
computed scroll-behavior*. Every correction was animating a 340,000px journey at about 110,000px a
second. The value that actually means instant is `"instant"`.

## 6. What the guards now prove

```
verify-mounts:     50 mount points all resolve (272 headings indexed)
verify-deep-links: 880 legacy ids and 272 live ids all resolve
visual-coverage:   all 273 sections covered — 50 hand-built, 191 derived, 31 by their own table
figure-retention:  all 1,050 distinct figures present at the baseline survive
content-integrity: all 4,603 body lines unchanged
```

No content file was edited. The restructure is entirely in the presentation layer.
