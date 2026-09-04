# CUT LOG

Every removal made during the structural consolidation, with its source section
and the reason. Nothing disappears silently.

**What counts as a cut.** Text deleted from `public/content/*.md`. Text *moved*
between sections is not a cut and is not listed here — the merges that move
material are specified in [`MERGE-PLAN.md`](./MERGE-PLAN.md), and the material
survives in the target section, verbatim unless noted.

**The preservation rule** is enforced mechanically as well as by review:
`scripts/verify-figures.mjs` runs on every build and fails it if any numeric
literal rendered by a component no longer appears in `public/content/*.md` or
`data/`. No figure below was removed from the document as a whole.

| # | Merge | Source | Removed | Reason |
|---|---|---|---|---|
| C01 | M01 | §1.1.1 | Heading `### 1.1.1 How Wiper picks its candidate` | Entirely empty — zero words, no child headings — but live in the table of contents and the mobile TOC as an entry that landed on nothing. No content removed; the heading text itself was the only thing there. §1.1's opening paragraph already states how the nominee will be picked. |
| C02 | M02 | §1.2.10 | Heading `### 1.2.10 Each rival, and the legal ground to be careful on` | Heading only. The attribution principle and all eight per-rival sourcing bullets moved verbatim into §1.2.2 as the panel "The legal ground we are careful on, rival by rival", where they sit with the profiles they qualify. `CompetitorFieldPanel` moved with them. |
