# Kitui 2027 — project brief

Confidential, link-only, `noindex` interactive proposal: *Campaign Strategy &
Digital Architecture — Hon. Dr. Benson Makali Mulu, Kitui County*, prepared by
Firefly Management. 241 numbered sections — 68 sub-sections and 173 parts —
across 19 routed pages, as counted by `scripts/verify-mounts.mjs`.

Next.js App Router · TypeScript · Tailwind v4 · Bun · Vercel. Content in
`public/content`, UI in `app/`, `components/`, `hooks/`, `lib/`. This file is
the brief. `AGENTS.md` carries execution parameters only; where the two
disagree on what to build, this file wins.

## Who reads this

One person: Dr. Mulu, an economist, plus a few campaign leaders. Kenyan,
senior. He opens the link on a phone, likely on mobile data, likely distracted.
He may never take a meeting. The site must make the whole case alone.

## The thesis the design must not contradict

The proposal argues that 86.4% of Kitui is offline — 143,340 internet users out
of 1,053,991 aged three and above — and that campaigns fail when they are built
for the connected minority. A slow, heavy site refutes its own argument in ten
seconds. **Performance is this design's strongest argument, not a limitation on
it.**

## Hard constraints

Violating any one of these fails the task, regardless of how good the result
looks.

1. **Presentation layer only.** Never add, delete, reword or "tighten"
   substantive prose. Prose is removed only when a visual takes over its exact
   job, carrying the same claims, figures and qualifications. Prose that cannot
   be converted stays in full.
2. **Never invent data.** Every number in any visual must trace to a figure
   already in the content. No placeholder or illustrative data, ever. If a
   visual needs a number the document does not have, build it without the
   number or do not build it.
3. **Never generate Kikamba or Kiswahili copy.** The document states that no
   vernacular copy is shown because none has cleared its four-stage review
   chain. Reuse only exact strings already in the repo. This is an argument the
   proposal makes about itself; breaking it discredits the document.
4. **Preserve every "Awaiting campaign decision" placeholder** as a visible,
   deliberate placeholder. They are an honesty claim, not an oversight.
5. **Preserve `noindex, nofollow`** and the confidentiality footer. Add no
   analytics, tracking, chat widgets, cookie banners, third-party embeds or
   external CDNs. Ask first, every time.
6. **Every animation degrades to a complete, legible static end-state.** No
   content is ever motion-gated.
7. **Never regress an existing bespoke component** — the TAC-40 terminal, USSD
   handset simulator, offline/connected split, Focus Mode, reading view, theme
   toggle. They stay and improve.

## Performance budget

Build-breaking. Measured on Slow 4G with 4× CPU throttling, never on localhost
unthrottled.

| Metric | Limit |
| --- | --- |
| Transferred per route | ≤ 1.5 MB |
| JS, gzipped | ≤ 300 KB |
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |

- Prefer native CSS scroll-driven animation (`animation-timeline: view()` /
  `scroll()`). It runs on the compositor at zero JS cost.
- A JS timeline library is permitted **only** for genuinely scrubbed or pinned
  sequences, dynamically imported, on the few routes that need it. Never load
  one on a route that does not use it.
- Honour `prefers-reduced-motion` and the `Save-Data` client hint. Under
  either, ship the static end-state and skip the Tier 2 import entirely.

## Resolution standard

"4K" here means resolution independence, not larger files.

- Vector-first. Diagrams, maps, charts and icons are inline SVG or DOM+CSS
  rendered from data — never exported bitmap artwork.
- Inline SVG, not `<img>`, so diagrams inherit theme tokens and can animate.
- Photos (if any): AVIF with WebP fallback, quality 80–85, `srcset` at ~2×
  rendered size, explicit `width`/`height`, ≤ 200 KB each. 2× is enough on a
  phone; 3× is wasted bandwidth.
- One variable font family. Fluid `clamp()` scale. Tabular lining numerals
  wherever figures appear. Body measure under ~75 characters.

## Motion system

Tokens live in `app/globals.css` (~390 custom properties). Three durations,
two easing curves. Two tiers:

- **Tier 1** — structural, CSS-only, near-free: scroll progress spine, section
  position indicator, state feedback, navigation continuity.
- **Tier 2** — five or six scrubbed signature sequences across the *entire*
  document, each dynamically imported.

**Entrance reveals are not applied to every section.** Blanket fade-and-slide-up
is the generic default and reads as machine-made. Reveals are reserved for the
few places where staged disclosure aids comprehension.

## House style

Avoid these — they are the standard tells of generated design:

- cream-and-terracotta or near-black-with-one-acid-accent palettes
- identical rounded cards, one border-radius, the same soft grey shadow on
  everything
- tracked-out ALL-CAPS eyebrow labels above every heading
- meta strings joined with middle dots
- "WORD — fragment" labels with spaced em dashes
- an arrow appended to every link
- gradient washes used as decoration

Colour carries meaning in this document and is never decoration. Semantic
accents: `--kt-ground` for inbound field intelligence, `--kt-digital` for
outbound digital, `--kt-physical` for physical distribution channels,
`--kt-hub` for the war room. **None of the four is defined yet** — the existing
layer names channels `--phase-0..3`. Define them in `app/globals.css`, or
settle on the existing names, before the first conversion reads either.

The terminal/monospace register is reserved for live field instrumentation
(TAC-40, USSD, feed timestamps) — it is a deliberate voice, not page chrome.

Spend boldness in one place per route. Everything around it stays quiet. A
proposal whose entire pitch is bespoke rigour cannot look templated.

## Working conventions

- Server components by default. Add `"use client"` only when a component
  genuinely needs state or effects, and say why in a comment.
- Styling is Tailwind v4 utilities plus `app/globals.css`; the repo has no CSS
  Modules. Follow that, or change it deliberately in one commit rather than one
  component at a time. No hard-coded colours, sizes or durations — read the
  tokens in `app/globals.css`.
- Diagrams are built from real headings, lists and tables so the markup is its
  own text equivalent. Connectors are `aria-hidden`. No duplicated sr-only
  paragraphs.
- One phase per branch, one PR per phase. Do not start a phase before the
  previous one is merged.
- Report measured numbers, never estimates. If you did not measure it, say so.

## Output style

No preamble. No restating this brief. No lists of what you are about to do.
Report what you did, what it measured, what you assumed, and what you could not
do.
