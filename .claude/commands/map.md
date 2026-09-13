---
description: Phase 2 — build the reusable Kitui County ward map component, the biggest missing asset in the document.
---

Build the Kitui County map. This is the single biggest missing visual in the
proposal: eight constituencies, forty wards. Almost every geographic claim in
the document currently has no picture attached to it.

Use plan mode first. Show me the data model and the component API before you
write anything.

## One component, many uses

Build it once with a ward-keyed data API so it can be re-skinned for every use
the document already makes: coordinator coverage, connectivity index, geofenced
deployment, caravan circuits, SMS ward tagging, the KPI ward-count targets.
A second map component is a design failure.

## Requirements

- Source ward boundaries from an open dataset. Commit a **simplified** topology
  and report the committed file size in KB. This payload is on the critical path
  for a reader on mobile data.
- The component renders; it does not fetch. Props take ward-keyed data plus a
  colour scale.
- **Ships with no default data.** Passing nothing renders an unfilled map, not
  invented values.
- Inline SVG. Themeable via `app/tokens.css`. No bitmap fallback.
- Accessible: every ward keyboard-reachable, named, with its value announced.
  Render a text-equivalent list alongside — for a choropleth the list is not
  optional, it is the only way the data is readable non-visually.
- Constituency boundaries visually distinct from ward boundaries.
- Legible at 360px. If forty ward labels cannot fit, labels are progressive —
  never drop wards to make it fit.

## Verify before reporting

Confirm the ward list against the content in the repo. If the document names
wards the dataset does not have, or vice versa, report the discrepancy rather
than reconciling it yourself.

Report the committed topology size, the rendered SVG node count, and the
measured weight the component adds to a route.
