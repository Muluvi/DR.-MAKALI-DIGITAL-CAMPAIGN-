---
description: Phase 0 — inventory every ASCII block, table, hard-coded value and mobile failure point. Read-only.
---

Audit only. Change no code, create no components.

Use a subagent to scan the repo so this inventory does not fill the main
context window. Produce a single file at `docs/visual-audit.md` containing:

1. **ASCII / `<pre>` character-art blocks.** File path, route, section number,
   one line on what it depicts, and a rating: `simple` (a list or box),
   `structural` (a graph with directed edges), `complex` (needs a bespoke
   component or a data model).
2. **Tables.** Every one, and whether it is real `<table>` markup, a markdown
   table, or character art. Flag any with more than four columns — those cannot
   be read at 360px and need the two-rendering treatment.
3. **Hard-coded values.** Colours, font sizes, spacing, durations, grouped by
   how often each recurs. The top twenty by frequency are what the token layer
   has to cover.
4. **Existing bespoke components.** What each one does and what visual pattern
   it establishes, since the rest of the document has to rise to it.
5. **Mobile failure points.** The five sections where a reader on a phone would
   most likely give up, with your reasoning.
6. **Placeholder register.** Every "Awaiting campaign decision" occurrence, with
   path and section. This becomes the checklist that later phases verify
   against.

Sort sections 1 and 2 by impact, not by file order — highest-traffic routes and
worst mobile offenders first.

Then commit the audit on its own branch and stop. Do not begin converting
anything.
