# Prose → visual conversions (brief §12)

Each conversion moves prose into a ```textversion fence directly under the figure that now does
its job. The fence renders as "Read the text version": closed in Brief, open in Full, open in
print, and present in the server HTML for readers without JavaScript. Every word of the original
is still there, and the copy and figure guards scan it exactly as they scanned it before it moved
(`scripts/check-copy.ts`, `scripts/check-figures.ts`).

Reading time is measured the way the site measures it (`briefWords` in `app/[[...slug]]/page.tsx`,
220 words a minute):

| | Before | After |
|---|---|---|
| Brief | 20,632 words, 94 min | 19,241 words, 87 min |
| Full | 47,804 words, 217 min | 47,899 words, 218 min |

"Before" is measured after the September 2026 audit edits and before any conversion. Full
rises slightly because the moved passages keep every word, and one new pointer line was added in
each of §5.4.1–§5.4.3.

## The conversions

| # | Location | What the prose did | The visual that now does it | Where the text lives now |
|---|---|---|---|---|
| 1 | §3.3, Paths A–D | For each route: composition, registered voters, ward count, share of the register, ballots at the turnout constant, the margin against 200,000, the 80%-of-ballots case (A and D), and the route's strategic implication | `fig-3-3-paths`, extended: a route card per path with a caption line (wards, share, margin), a third bar for the 80% case, Path C drawn ward by ward, and the implication as the card's closing note. The table and CSV gain wards, share and the 80% column | Text version under `fig-3-3-paths` |
| 2 | §5.2.4.3, "Component by component" | Five components, each with tool, function, data held, DPA 2019 exposure and procurement status | `fig-5-2-4-stack` (new): a card per component, exposure level as the kicker, the two personal-data components highlighted, and the pending decision as the footer; table and CSV with all six fields | Text version under `fig-5-2-4-stack` |
| 3 | §5.4.1–§5.4.3, the three KPI tables, and §5.4's "How to read the metric tables" | Every phase target, which rows are diagnostics (°) and which are performance indicators, and why diagnostics are excluded | `fig-5-4-ladder` (new): the three indicators that climb through every phase drawn as bars, every other target in a phase-by-phase table, and the ° rule and its reasons as the figure's notes. It replaces the older `KpiPhaseBlock` mount at §5.4, which drew a subset of the same targets | Text version under `fig-5-4-ladder`; each subsection's "KPIs" line points to it |
| 4 | §6.1.1, "What this asks of the campaign" | The dependencies, which three gate the rest, and why | `fig-6-1-dependencies`, which already lists all nine with "gates the rest" and the reason for each | Text version under `fig-6-1-dependencies`; `#nextsteps-sec-6-1-1` redirects to §6.1 |
| 5 | §5.8, the R1/R2 and R6 paragraphs | Which risks change the plan rather than damage it, when they resolve, and why R6 fails quietly | `fig-5-8-risk`, whose title and takeaway already carried R1/R2; its notes now carry the "first weeks" argument and the R6 reasoning | Text version under `fig-5-8-risk` |

## One rule changed to serve this

A Brief "fold" (a section with a long unbroken run of prose) used to fold everything after the
lead paragraph, figures included, so three sections showed no figure at all in Brief: §4.3
(`audience-overview`), §5.3 (`fig-5-3-four-weeks`) and Annex C.1 (`message-by-segment`).
`lib/collapse-groups.ts` now lifts figures and their text versions out of a fold, so only prose
folds. In both modes such a figure now sits above the prose it used to follow. No fold hides a figure
any more. A figure inside a disclosure group's second or later panel is still one tap away, as it
was before; `fig-5-2-4-stack` is one of those.

## What was not converted, and why

Most of what Brief still shows is argument: lead paragraphs, callouts and findings that no figure
states. A conversion is allowed only where a visual can hold every fact, so these stay as prose.
Two candidates were checked and left alone. §2.6's connectivity table carries national context
that its figure (a two-point slope) does not. §5.5.1's scope levels sit in a disclosure group whose
first panel is the only one Brief shows, so converting them would save little.
