# Design tokens and component guide

The values the site is built from, as they stand after the visual-first pass. Hex values and
contrast ratios were computed in Chromium from the live custom properties (31 October 2026), not
copied from comments. Tokens live in `app/globals.css` (palette, type, spacing), `app/premium.css`
(`--pf-*` aliases, CSS durations) and `lib/motion.ts` (JavaScript motion).

## Type

Three families, self-hosted by `next/font` with `display: swap` and adjusted fallback metrics:
**Bricolage Grotesque** (display and UI; `wght`, `wdth` and `opsz` axes, the `wdth` axis sets the
condensed display type), **Newsreader** (prose, normal and italic), **JetBrains Mono** (figures and
labels; not preloaded).

| Token | Phone → laptop | Use |
|---|---|---|
| `--fs-display` | 36 → 72 px | Act and hero titles |
| `--fs-headline` | 30 → 48 px | Section titles |
| `--fs-figure` | 28 → 40 px | Hero statistics only |
| `--fs-lead` | 17 → 20 px | Key-finding leads |
| `--fs-body` | **16 → 18 px** (was 15 → 17) | Running prose |
| `--fs-small` | 14 → 15 px | Supporting copy |
| `--fs-label` | 13 → 14 px | Labels |
| `--fs-micro` | 12 → 13 px | Source lines, captions |

Line length: `--measure: 74ch` on laptop; the prose column is 736 px at 1440 wide and never
spans the screen. Hierarchy, in order: Act title, section title, key-finding lead, supporting
sentence, caption, source line, tier badge.

Global rules (end of `app/globals.css`): tabular, lining figures on every figure, visual block,
table and KPI; `text-wrap: balance` on h1–h4; `text-wrap: pretty` on paragraphs, list items and
captions; table cells hyphenate and break a word only when it cannot fit.

Known gap: 103 distinct `font-size` declarations remain across the eight stylesheets. New work
uses the tokens above; consolidating the old declarations is open (plan, item 4).

## Colour

Brand anchor `#060d1a` (dark ground). No pure black anywhere.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#f9f5ed` | `#060d1a` | Ground |
| `--card` | `#ffffff` | `#0f1726` | Raised surface |
| `--ink` | `#151f3e` | `#eff4f9` | Headings, primary text |
| `--prose-body` | `#27324d` | `#ced5de` | Running prose |
| `--muted` | `#4d586c` | `#adb9c8` | Secondary text |
| `--accent` | `#173ebb` | `#79a9ff` | Links, emphasis, held office |
| `--accent-solid` | `#1e49ce` | `#2955d3` | Accent fills (white text on them) |
| `--gold` | `#a63c0c` | `#ee8f63` | Laterite: the pool, the gap |
| `--gold-solid` | `#b0451a` | `#b0451a` | Laterite fills |
| `--line` | `#dcd7cd` | `#283140` | Hairlines |
| `--pf-t1` | `#09672e` | `#75d78d` | Tier 1 evidence |
| `--pf-t2` | `#8a5700` | `#ebbd57` | Tier 2 evidence |
| `--pf-t3` | `#af2b25` | `#ff7e70` | Tier 3 / unconfirmed |

### Contrast (WCAG 2.2; text needs 4.5:1)

| Text token | Light on paper | Light on card | Dark on paper | Dark on card |
|---|---|---|---|---|
| `--ink` | 14.9 | 16.2 | 17.6 | 16.2 |
| `--prose-body` | 11.7 | 12.7 | 13.1 | 12.1 |
| `--muted` | 6.6 | 7.2 | 9.8 | 9.0 |
| `--accent` | 7.9 | 8.6 | 8.3 | 7.6 |
| `--gold` | 5.9 | 6.4 | 8.1 | 7.5 |
| `--pf-t1` | 6.5 | 7.0 | 11.0 | 10.1 |
| `--pf-t2` | 5.6 | 6.1 | 11.1 | 10.2 |
| `--pf-t3` | 6.0 | 6.6 | 7.8 | 7.2 |

White on fills: `--accent-solid` 7.2 (light) / 6.3 (dark); `--gold-solid` 5.7.

`--line` measures 1.3–1.5 against its ground. It is used for hairlines and card edges where the
card also differs from the ground in fill, so no control or chart mark depends on it alone; a
border that is the only edge of a control should use `--muted` (≥ 6.6:1).

Lighthouse accessibility is 100 in both themes. The one failure found when the light theme was
first audited (overview card labels, 4.43:1) was fixed by raising `--overview-muted` to 72% ink.

### Second channels

Colour is never the only signal: tier badges print "T1/T2/T3" and use solid, dashed and dotted
outlines; tile-map layers print their labels and use hatch, weave and dashed outlines; the §2 story
names in each step card which wards are lit.

### Party colours (flag)

`--accent` is named in the source as Wiper royal blue, the candidate's own party, which is
intentional. **Laterite (`--gold`, an orange) may read as ODM orange** to a Kenyan reader. It marks
"the pool" and gaps, never a party; it is flagged here for Firefly's judgement rather than changed,
because changing it would alter every map's established encoding.

### Themes

Dark is the brand default. The page follows `prefers-color-scheme` until the reader chooses; the
choice persists (`localStorage`, wrapped). A pre-paint script in `app/layout.tsx` sets the theme
before first paint, so there is no flash of the wrong theme. Print always uses the light palette
(`@media print` in `app/premium.css`).

## Spacing

Tailwind's 4 px scale for component spacing, plus two fluid tokens:

| Token | Value | Use |
|---|---|---|
| `--gutter` | `clamp(0.875rem, 0.55rem + 1.5vw, 2.5rem)` (14 → 40 px) | Page side margin |
| `--section-gap` | `clamp(1.75rem, 1.1rem + 2.6vw, 3.5rem)` (28 → 56 px) | Between sections |
| `--pf-gutter` | `max(16px, env(safe-area-inset-left))` on phones | Fixed UI and the hero |

Touch targets are at least 44 × 44 px; the inline tier badges reach that through an invisible hit
box on coarse pointers. Fixed UI (the dock, toasts) sits above `env(safe-area-inset-bottom)`.

Known gap: 91 distinct padding/margin/gap lengths remain in older stylesheets.

## Motion

One engine (Motion, `motion/react`) for component state; CSS for scroll-driven and hover effects.
See `docs/toolkit.md` for the division of work and `MOTION-SYSTEM.md` for the rules.

| Token | Value | Use |
|---|---|---|
| `DURATION.fast` (`lib/motion.ts`) | 150 ms | Taps, toggles |
| `DURATION.base` | 250 ms | Panels, disclosures |
| `DURATION.deliberate` | 400 ms | Chart reveals |
| `--pf-dur-fast` (CSS) | 180 ms | Hover, toast |
| `--pf-dur-entrance` | 520 ms | Entrances |
| `--pf-dur-deliberate` | 620 ms | Map fills, ward fill-in |
| `--pf-dur-settle` | 900 ms | Hero title, county trace |
| `--pf-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | The shared ease-out |
| `--pf-ease` / `EASE_PRIMARY` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances |

`MOTION-SYSTEM.md` still lists the earlier values (140 / 180 / 300 / 520 / 620 ms); the table above
is what the code uses today.

Reduced motion: CSS cuts every animation to 1 ms (final state shown), and `useReducedMotionSafe()`
stops JavaScript entrances. Reduced data: Ken Burns, the float loop, grain and the county trace
stop.

---

# Component guide

How the Firefly team adds a section or a visual. Content is markdown in `content/*.md`; numbers
are `{{tokens}}` resolved from `lib/data/figures.ts`, never typed into prose. After any edit:

```bash
npm run content
```

```bash
npm run verify
```

`verify` fails, naming the line, on a malformed fence, an unknown figure token, a lost word, a
changed figure fence or a tier that disagrees with the figure store.

## Read in full

Write a section's key finding as a `lead` fence at the top of the section: one or two sentences
taken from the section's own prose (checked by `check-leads`). The page then shows the lead and
every visual, and folds the prose into **"Read the full text (N words)"**, which stays in the
HTML, so search, print and screen readers reach it. A block that must stay visible (a legal term,
a caveat) is preceded by `<!-- keep -->`.

## Visuals (`visual` fences)

One component (`components/visual/VisualFence.tsx`) draws every kind from a YAML spec, so a new
visual is a fence, not code. Kinds: `stats`, `cards`, `tabs`, `timeline`, `stepper`, `checklist`,
`inout`, `contrast`, `hypothesis`, `qa`, `crosswalk`, `nested`, `week`, `matrix`, `bars`,
`donut`. `/tools/visual-kinds` renders one of each.

```visual
kind: bars
title: "Kitui against Kenya: births in a facility, KDHS 2022"
source: "KDHS 2022 (Tier 1)"
items:
  - label: "Births in a facility, Kitui"
    value: "{{health.facility-births}}%"
    tier: 1
  - label: "Births in a facility, Kenya"
    value: "{{health.facility-births.kenya}}%"
    tier: 1
```

Every item carries a `tier`. `lib/visual.ts` (`validateVisual`) checks each spec: a kind with no
items, a bar or donut item without a numeric value, or a stat without a value fails
`npm run content` with the line named. A fence that still reaches the page malformed renders a
visible "Malformed visual fence" notice in place, never a blank page or a crash.

| Prose job | Kind |
|---|---|
| Process, sequence | `stepper` |
| Schedule | `timeline`, `week` |
| Hierarchy | `nested` |
| Comparing options | `cards`, `crosswalk`, `tabs` |
| Quantities and shares | `bars`, `donut`, `stats` |
| Needs and issues | `stats` (one number and a tier each) |
| Risks | `matrix` |
| Attack and answer | `qa`, `contrast` |
| Two-sided commitments | `inout` |

## Figures (`figure` fences)

Register figures (`lib/register/specs/*.ts`) carry a title, takeaway, marks, notes, sources with
tiers, a data table and a CSV (`public/data/<id>.csv`, built by `npm run content`). Place one with:

```figure
id: fig-2-4-people
```

The marks show on load; "Show the details" opens the question, notes, sources and data.

## Panels

Interactive blocks mounted under a heading (the four-step story, cartograms, matrices) render
inside `PanelFold`, open on load, with one control to collapse them.

## Flow diagrams, timelines, cards, charts

These four systems are the `stepper`/`nested` kinds, the `timeline`/`week` kinds, the `cards`
kind and the register figure marks (`components/register/charts.tsx`). Reuse them; a one-off
component for a section is the exception and needs a reason in the plan.
