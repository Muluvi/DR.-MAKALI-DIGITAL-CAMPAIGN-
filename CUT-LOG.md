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

## Summary

22 removals across 36 merges. Categorised:

| Kind | Count | What it was |
|---|--:|---|
| Section headings whose bodies moved intact | 8 | C01, C02, C05, C07, C10, C14, C18, C19 — the heading is gone, every word beneath it survives in the named target |
| Dead pointers into retired numbering | 5 | C06, C09, C13, C17, C22 — `Subsection 17A`, `19A`, `19B`, `Section 16.4`, `16.5`, `16A`, `& 10.1`; none resolved to anything |
| Mis-targeted cross-references, repointed | 3 | C08, C12, C16 — pointed at real sections about other subjects |
| Verbatim duplicated content | 3 | C03, C04, C11 — the same claims or the same 40 numbers printed twice |
| Stale numbering shown to the reader | 2 | C15, C21 — twelve `SECTION nn STRATEGIC TAKEAWAY` banners |
| Duplicated thesis | 1 | C20 — §9.3.3 restating §0.4 |

**No figure was removed from the document.** All 601 distinct figures present in
the pre-merge baseline are present now, verified mechanically, and
`scripts/verify-figures.mjs` independently asserts the same on every build.

**No claim, promise, commitment, target, price or scope statement was removed.**
The removals above are headings whose content moved, references that pointed at
nothing or at the wrong thing, text printed twice, and retired numbering.

---

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
| C10 | M22 | §5.2 | Heading `## 5.2 The digital war room` and its seven child headings | Section merged into §5.1. Every body moved: "What the war room is for" became part of §5.1.6, the monitoring tools joined the unified inventory in §5.1.1, the shift schedule and dashboard view became §5.1.6, the rapid-response protocol became the authority half of §5.1.2, the pre-approved library the second panel of §5.1.4, and red-team drills became §5.1.7. No prose removed. |
| C11 | M22 | §5.2.2 / §5.4.2 | Four duplicated table rows — Meta Ad Library, Google Ads Transparency Centre, social listening (premium tier) and radio monitoring appeared in both monitoring tables | The two descriptions of each were merged into one row carrying **both** wordings' claims (e.g. Meta Ad Library now reads "spend, creative and creative themes, targeting estimates, frequency" — the union of the two). Nothing a row claimed was dropped. |
| C12 | M22 | §5.1 preamble | The cross-reference target `Section 6.1.2` in "Defamation Law Safeguards (Section 6.1.2)" | Mis-targeted: §6.1.2 is "Every figure carries its provenance". The defamation safeguards it names are §5.1.5, in the same section. Repointed, wording otherwise untouched. |
| C13 | M28 | §6.5.2 | The dead pointer `(16.4)` in "Published deletion schedule (16.4)" | §16.4 belongs to a retired numbering scheme and resolved to nothing. Replaced with the live target — the deletion commitment is clause 5 of the Digital Ethics and Data Charter, now §6.5.2. |
| C14 | M31 | §7.3 | Heading `## 7.3 Leadership roles and governance rhythm` and its four child headings | Section merged into §7.2, which described the same team. Every body moved: the Lean Core Delivery Model preamble and "Why the delivery model is lean" opened the merged section, the leadership ownership chart joined the core-team table, the three-tier escalation hierarchy joined the reporting lines, and the four leadership touchpoints joined the operating cadence. No prose removed. |
| C15 | M31 | §7.3 | The banner label `SECTION 12 STRATEGIC TAKEAWAY` | Numbered under a scheme retired two restructures ago, and rendered to the reader inside the ASCII box. Relabelled by subject at the same rule width. |
| C16 | M32 | §8.2.3 | The clause "In accordance with the foundational strategic doctrine established in **Section 1.2.3**," | Mis-targeted: §1.2.3 is "The 2022 baseline, ward by ward" and contains no doctrine about metrics. The vanity-metrics doctrine is stated in this section itself, so the deferral was circular. The sentence now states the position directly; nothing else changed. |
| C17 | M32 | §8.2 | The labels `Subsection 19A` and `Subsection 19B` (5 occurrences, prose and ASCII), and the banner labels `SECTION 19 STRATEGIC TAKEAWAY` and `SECTION 20 STRATEGIC TAKEAWAY` | Retired numbering. §8.2 announced its two halves by names that no longer resolved to anything. Replaced with §8.2.1 and §8.2.2, which are the halves they named; banners relabelled by subject at the same rule width. |
| C18 | M33 | §3.4.6, §3.6.3, §4.2.6, §4.3.4, §4.4.2, §8.4.5, §8.5.7 | Seven KPI section headings | Headings only. All seven tables moved verbatim into the consolidated ledger at §8.2.4, each under a panel naming the programme and the section it came from. Every metric and target is unchanged, including §4.4.2's unfilled `[Insert target]` for endorsements, which the ledger now makes visible by comparison. Each source section carries a one-line pointer to the ledger. |
| C19 | M35 | §9.3.2, §9.3.3, §9.3.4 | Three headings ("Asset centralisation", "Performance tracking", "Escalation") | Headings only. All three bodies survive verbatim as bolded points inside the merged §9.3.1. Also repairs §9.3.3's reference to the analytics maturity roadmap, which pointed at §5.1.5 ("Staying inside defamation law"); the roadmap is §6.4.3. |
| C20 | M36 | §9.3.3 | The sentences "A remote digital operation is not a compromise. Digital campaigning does not require a physical office in Kitui; it requires speed, data, creative discipline and continuous availability." | Restatement of §0.4, which argues the same thesis at length with three named advantages (resource arbitrage, information security, speed and specialisation). Replaced by a pointer to §0.4 so the closing section reaches its distinctive content — the delivery scope, the Firefly proposition, and the honest qualification about what remote delivery cannot do — without re-arguing a point already made. Heading widened to name what the section actually covers. |
| C21 | Phase 5 | §2.4, §2.5, §2.7, §3.1, §3.4, §3.5, §4.1, §5.1, §6.1 | Ten banner labels reading `SECTION 7`–`SECTION 20 STRATEGIC TAKEAWAY` | All numbered under a scheme retired two restructures ago, and all rendered to the reader inside ASCII boxes — so the site displayed section numbers that matched nothing in its own table of contents. Relabelled by subject at the same rule width; the takeaway content beneath each is untouched. |
| C22 | Phase 5 | §4.2.2, §7.1 | The dead pointers `Section 16.5` and `Section 16A` | Retired numbering, resolving to nothing. §4.2.2's consent claim now cites §6.1.5 (the Data Protection Act applied) and §6.5.1 (the regulatory environment and controls) — its actual regulatory basis, where it previously also cited §3.5.4, the language-mix section. §7.1's manipulated-media bullet now cites §2.6.2 (answering disinformation) and §5.2.4 (the deepfake protocol). |
