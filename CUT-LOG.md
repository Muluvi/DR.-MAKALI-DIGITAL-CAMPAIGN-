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
| C03 | M03 | §1.2.8 | Heading, plus the restated clauses "as documented by the NDMA January 2026 Alert bulletin", "Kitui's food security remains classified under IPC Phase 2 ('Stressed') as of September 2025" and "The county was also severely affected by the March 2026 national flooding" | Verbatim restatements of claims already made in §1.2.5's hazards panel. Every unique claim survived: the "multi-directional hazards" framing, the CECM 28,000-household food-reserve figure with its scale question against the 262,942 census households, and the disruption to rural transportation networks all moved into §1.2.5. `DroughtFoodSecurityPanel` moved with them. |
| C04 | M04 | §1.2.3 | The `#### The Complete, Integrated 40-Ward IEBC Voter Register` listing — 8 constituency sub-headings enumerating all 40 wards (~450 words) | Verbatim duplicate of the ranked 40-ward table in §1.3.2. Every ward name and every voter count survives there (verified: all 40 present), and in `data/ward-register.json`. §1.2.3 now carries an 8-row constituency table with the same subtotals, which is what its own "Mwingi Bloc Pivot" finding is derived from, and points to §1.3.2 for ward detail. No figure left the document. |
| C05 | M12 | §3.5 | Heading `## 3.5 Journalists, debates and radio strategy` and its lede "*New section. Paid and owned media reach the connected minority. Earned media — especially radio — reaches everyone else.*" | Section merged into §3.4. The lede survives as the merged section's opening line, reworded only to drop "New section" (it is no longer new). All six subsections moved. |
| C06 | M12 | §3.4 preamble, §3.4.3 diagrams | The label `Subsection 17A` (3 occurrences) | A pointer into a numbering scheme retired two restructures ago; `crossSectionTarget()` returned null so it rendered as inert text promising a section that did not exist. Replaced with `Section 3.4.3`, which is where the bypass architecture it named actually lives. ASCII box widths preserved. |
| C07 | M18 | §4.2 | Heading `## 4.2 The field-to-digital loop` and the five child headings beneath it | Section merged into §4.1, which described the same closed loop. All five bodies moved: "The problem it solves" became §4.1's opening, capture/latency/suppression joined the ward-coordinator reporting, "How the loop runs" joined the four-hour response cycle, and digital-to-field and governance became §4.1.3 and §4.1.4. No prose removed. |
| C08 | M18 | §4.1.5 | The cross-reference `(Section 4.2.4)` after "The 40 major market centers rotating across the county weekly" | A self-reference: it pointed at "Voice and audio", and the market-centre circuit it annotates is described three paragraphs below it in the same section. Pointer removed; the claim is untouched. |
| C09 | M18 | §6.3.1 | The dead pointer `& 10.1` in "Powers the offline communications engine (Section 4.3 & 10.1)" | §10.1 belongs to a numbering scheme retired two restructures ago and resolved to nothing. The surviving reference to the offline engine (now §4.2) is correct and kept. |
