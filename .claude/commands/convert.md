---
description: Convert one ASCII diagram to a themeable, accessible component. Pass the section number or file path as an argument.
argument-hint: "[section ref or file path, e.g. 8.8.3 or app/scope-media/page.tsx]"
---

Convert exactly one diagram: $ARGUMENTS

If no argument was given, read `docs/visual-audit.md` and take the highest-impact
unconverted block, then say which one you picked.

## Before writing anything

Read the surrounding prose. The diagram has to carry the same claims the prose
around it makes, or the two will contradict each other. Note any figure in the
diagram that also appears in the prose — those must match exactly.

## Requirements

- Identical information content. Every label, figure, arrow and relationship
  preserved verbatim. If the original drew a duplicate edge (the same path
  expressed twice), you may draw it once — say so explicitly in your report.
- Real headings, lists or tables, so the markup is its own text equivalent.
  Connectors are `aria-hidden`. No duplicated sr-only paragraph.
- Reads tokens from `app/globals.css` only. No hard-coded colours, sizes or
  durations.
- Reflows legibly at 360px with no horizontal scroll.
- Server component. No `"use client"` unless it genuinely needs state.
- **Static in this pass.** No animation. Correct and crisp first; motion is a
  later phase. If a future Tier 2 pass will need to drive something, give the
  relevant elements stable ids and note them in a comment.
- Styled the way the repo is styled — Tailwind v4 utilities over the tokens in
  `app/globals.css`, no CSS Modules. Follow the semantic accent convention in
  CLAUDE.md.

## Then

Delete the fenced ASCII block and any standalone title line that the component
now renders as its own caption — otherwise the title appears twice.

Run typecheck and build. Report: what changed, anything you could not preserve
and why, and any assumption you made.

Do not convert a second diagram in the same turn.
