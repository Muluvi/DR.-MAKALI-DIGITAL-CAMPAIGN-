---
description: Phase 5 — enforce the performance budget with measured numbers on a throttled mobile profile.
---

Enforce the performance budget from CLAUDE.md. **Measured numbers only. If you
did not measure it, do not report it.**

## Fix

- Route-level code splitting. Confirm no animation library loads on a route that
  does not use one — check the actual chunk graph, not the import statements.
- Font loading: variable font, subset to the characters the document actually
  uses, preloaded, `font-display: swap`, zero layout shift.
- Image pipeline: AVIF with WebP fallback, `srcset` at ~2×, explicit dimensions
  on every image.
- Confirm `Save-Data` and `prefers-reduced-motion` paths skip the Tier 2
  dynamic imports entirely rather than loading and then not running them.

## Measure

Every route, on Slow 4G with 4× CPU throttling. Build a table:

| Route | Transferred | JS gzipped | LCP | INP | CLS | Pass |

Then fix every failing route, one per turn, and re-measure. Do not batch fixes
across routes — you will not know which change moved which number.

## The check that matters most

Simulate the actual reader: a mid-range Android phone on a Kitui 3G connection,
cold cache. Report time to first legible content. If that number is bad, nothing
else in this table matters — the document's own argument is that campaigns fail
when they are built for the connected minority, and a slow proposal proves it
against itself.
