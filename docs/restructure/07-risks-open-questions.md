# 07 — Risks, assumptions and open questions (Phase 9)

## 1. Decisions I made that were yours to make

You said "apply all recommendations", so I resolved the four Gate 1 questions myself. Each is
reversible; each is stated here so you can reverse it.

| Decision | What I did | How to undo |
|---|---|---|
| **Section numbers preserved** | §1.3 is still §1.3 wherever it sits. Only parts were renumbered. Renumbering would mean editing 173 sentences of your prose. | A full renumber is a separate engagement needing an explicit waiver on prose edits. Nothing here blocks it. |
| **Single route kept** | `/` remains the only page. Per-part routes would force ~262 anchors to carry a path as well as a fragment, for no gain the restructure needs. | Additive later; the part ids are already the natural route segments. |
| **Deep links client-side** | `LEGACY_IDS`, now 608 entries. Server redirects were used only for the ten `/content/*.md` asset paths, which are the only server-visible URLs that changed. | n/a — no alternative exists for fragments. |
| **Public audit file deleted** | ~~Left in place.~~ **Done on your instruction.** `public/AUDIT-FINDINGS-PROMPTS-A-AND-B.md` no longer ships; it was an internal engineering audit served as a public static asset at `/AUDIT-FINDINGS-PROMPTS-A-AND-B.md`. Nothing imported it, and the byte-identical repo-root copy is untouched, so no content is lost. | `git revert` the deletion commit, or restore from the root copy. |

## 2. The one place I wrote text that is not a heading

Ground Rule 1 permits headings and nav labels only. Each content file carries a one-line
description of the part, shown above its content.

Nine of them described the old grouping and became false the moment sections moved —
`2-evidence.md`'s said "Four readings of the ground" for a part that now holds eight sections
including channel reach, voter segments, radio ownership and the statutory envelope. Leaving them
would have shipped nine false statements; deleting them would have removed a wayfinding aid.

**I rewrote eight and replaced the ninth with the document's title block. 224 words removed, 229
written.** I classify these as part labels, which they functionally are. If you disagree, they are
the first nine lines of the nine content files and are trivially revertible.

**Body prose delta is zero**, asserted by the migration script, which refuses to write otherwise.

## 2a. The one body-prose edit, quoted in full

The first and only change to the author's body text in this engagement, made on explicit
instruction after the §6.1 move left its lead paragraph inaccurate.

**`public/content/4d-technology.md`, §6.1 lead — before:**

> This section defines the voter and supporter data model, the three-tier empirical provenance
> standard, protocols for handling disputed electoral figures, and legal compliance workflows
> under Kenya's **Data Protection Act (DPA) 2019** and the **Office of the Data Protection
> Commissioner (ODPC)**.

**After:**

> This section defines the voter and supporter data model and the legal compliance workflows
> under Kenya's **Data Protection Act (DPA) 2019** and the **Office of the Data Protection
> Commissioner (ODPC)**. The three-tier provenance standard that grades every figure in this
> proposal (Section 6.1.2) and the protocol for when two sources disagree (Section 6.1.4) are
> set out alongside the evidence they govern.

The enumeration now matches what the section contains, and the two moved items are pointed at
rather than dropped — both render as working links into Part 2, verified in-browser. No claim,
figure, commitment or qualification is added or removed.

**Also corrected, in the same file:** that part's one-line description (my text, not the
author's) read "The data model **and its provenance rules**, the voter model built on it, …".
The bolded clause is deleted; the rest is unchanged.

**Corpus effect:** 49,665 → 49,682 words (+17). Sections 50, headings 262 — both unchanged.

## 2b. The second body-prose edit, quoted in full

Added on explicit instruction, after the reorder in §2a's sibling change put the two preference
figures within a screen of each other. §8.1 previously had no lead paragraph; this is the whole
of the addition, sitting between the `## 8.1` heading and `### 8.1.1`:

> Two preference figures appear in this proposal, and they measure different populations rather
> than revising one another. Section 9.1's **40.0%+** is a share of the **countywide public**, as
> reported in the party-commissioned surveys. NW-01 below is **≥ 55.0%** of **sampled likely
> Wiper primary voters** — a narrower universe, which is why the threshold sits higher. Section
> 8.2.3 states that same primary-voter threshold.

**No figure was altered, added or recomputed.** Both numbers are quoted exactly as the document
already states them, and their originals — §9.1.1's success definition, NW-01's target row, and
§8.2.3's threshold — are untouched and verified intact. The two cross-references render as
working links, confirmed in-browser.

**Corpus effect:** 49,682 → 49,743 words (+61, the sentence itself). Sections 50, headings 262 —
both unchanged. `verify-figures.mjs` still passes.

## 3. Deliberately unfinished

### ~~§6.1.2–.4 is still in Part 4D~~ — **done**

Moved into Part 2, directly after §1.1, on your instruction to apply all recommendations.

I had said this "shades into editing". On inspection it does not: §6.1's six sub-parts divide at
clean `###` boundaries, exactly like the §3.4 and §8.2 splits already executed. §6.1.2 (every
figure carries its provenance), §6.1.3 (the three source tiers) and §6.1.4 (when two sources
disagree) are 556 words of pure method and moved as a unit. §6.1.1 (the data model), §6.1.5 (DPA
2019) and §6.1.6 (the ODPC guidance awaited) — 1,179 words of infrastructure and legal — stayed
in Part 4D with the section lead.

**Placement rationale:** §1.1's second paragraph calls the poll mechanism "a Tier 3, single-source
report". Under the old order the reader met that grade 33,000 words before anything defined it.
The tiers now sit immediately after the section that first uses one, and ahead of §1.2's 3,530
words of Tier-graded evidence.

**~~One cost, and it is real.~~ Corrected on your instruction.** §6.1's lead paragraph enumerated
four things the section defined, two of which had moved to Part 2. See §2a below for the exact
change.

### ~~§8.1 and §9.1 overlap~~ — **resolved, and not by merging**

On instruction to choose for user experience, I read both properly. They are not duplicates, and
merging them would have been the wrong call:

- **§8.1** is two seven-column ASCII scorecards — KPI code, operational definition, baseline,
  target, measurement methodology, owner, reporting cadence. A reference instrument.
- **§9.1** is five Operational Commitments, each with a named owner, a deadline and an escalation
  trigger, rendered through the `CommitmentFields` layout. What Firefly commits to *do*.

Fusing them would produce a ten-column table — unreadable on the phone this document is written
for — and would force dropping either the escalation triggers or the CATI methodology. Both are
load-bearing, for different readers.

**What was actually wrong was the order.** The instrument preceded the commitment it scores.
§9.1 now comes first, then §8.1, then §8.2.3 — commitment, then instrument, then the principle
anchoring both to the vote threshold. A pure move: word count unchanged at 49,682.

**~~One thing the new adjacency surfaces, left untouched.~~ Made explicit on your instruction.**
§9.1.1's success definition is a **40.0%+ countywide public preference share**; §8.1.1's NW-01
target is **≥ 55.0% of sampled likely Wiper primary voters**; §8.2.3 restates the 55% figure.
Different denominators, so never a contradiction — but the two now sit within one screen of each
other, and a reader would reasonably pause. §8.1 had no lead paragraph, so one was added at
exactly that transition. See §2b below.

### §0.4 and §9.3.6 also overlap

"Why the operation is run remotely" (now closing Part 5) and "Why a remote operation works" (in
Part 1). Same argument, twice.

### The repeated figures were not thinned

The ~200,000-vote threshold still appears in 14 sections, 86.4% offline in 13, the gazetted
ceiling in 10. Each restatement was load-bearing under the old order. Now that canonical homes
exist, most could go — but every deletion is a prose edit. Logged, not performed.

## 4. Assumptions I made

1. **§3.4's split point is the h3 boundary.** §3.4.1–.2 (ownership, gatekeeper) went to Part 2;
   §3.4.3–.4 (bypass, pitching) to Part 4A. The lead paragraph stayed with the first half and
   still points forward at §3.4.3, which now resolves across a part boundary. It reads as "the
   response is in the execution track", which is accurate — but it is my reading, not yours.
2. **§8.2.3 travels alone.** §8.2's lead paragraph names §8.2.1 and §8.2.2 and stayed with them
   in Part 5. §8.2.3 opens on its own framing sentence, so it moves cleanly. Verify §8.2 still
   reads as complete.
3. **Part order within Part 4 is arbitrary and I made it so deliberately.** Publishing, ground,
   defence, technology, team. Nothing depends on that order — that is the point of calling them
   parallel tracks. If you want a different order it is one array in `lib/heading-slug.ts`.
4. **Two sections now open on a level-3 heading.** §8.2.3 in Part 1 and §3.4.3 in Part 4A are
   `###` headings without their `##` parent in that file. They index, link and render correctly;
   they are just visually one level lighter than their neighbours. Promoting them to `##` would
   mean authoring a heading level the author did not write.
5. **§8.1 and §9.1 arrive before the arithmetic that derives their figures.** Both state their
   numbers inline, so they stand alone. This is the deliberate answer-first trade and the thing
   most worth your eyes on the rendered page.

## 5. Risks that survive

| Risk | Severity | Mitigation in place |
|---|---|---|
| **A green build still does not prove a correct page** — six components were found silently unmounted mid-implementation, with the build green throughout | was **high** | `verify-mounts.mjs` now fails the build on any orphaned or duplicated mount key. This hole is closed. |
| ~~A hash change on an already-loaded page does not re-run the deep-link resolver~~ | **closed** | A `hashchange` listener now applies the same resolution. Verified in-browser: `#data-sec-6-1-3`, `#programme-sec-31-7` and `#exec-sec-1-1` all resolve when set on an open page, not only on a cold load. |
| `TAB_ALIASES` maps `strategy` → `programme`, and `strategy` is now also a live part id | low | Safe only because `resolveLegacySectionId` checks the live index first. Commented in the source; `verify-deep-links.mjs` asserts both directions. **Always pass `validIds`.** |
| The 608-entry map is now three generations deep and will keep growing | low | Generated by diffing indexes, never hand-written. The generator is the method; the map is output. |
| Disclosure bodies now render into the DOM always, for print completeness | low | +2 kB measured on a page that cares about mobile data. Judged worth it; reverting is two `className` changes. |
| A figure I could not check | — | None altered. `verify-figures.mjs` still passes: every numeric literal in the UI traces to source. |

## 6. What I need from you

1. **Read Part 1 on a phone.** Everything else was verified mechanically. Whether the decision
   layer *reads* as self-sufficient — scorecards and objectives landing before the arithmetic
   behind them — is the one thing no script can tell me.
2. **Decide §8.1 vs §9.1.** Merge, or keep both and say why.
3. ~~Say where §6.1's method ends and its infrastructure begins~~ — **done**, at the §6.1.1/§6.1.2
   boundary. Review the placement and the lead-paragraph cost noted above.
4. **Confirm the eight part descriptions** (§2 above) — the only non-heading text on this branch.
5. ~~Delete the public audit file~~ — **done.**

## 7. What I did not find

No secrets, in the working tree or anywhere in history — a filename scan across all refs returns
only `.env.example`, which holds no values. No figure altered. No section cut. `noindex/nofollow`
intact. All 20 `[Insert…]`/`[Confirm…]` placeholders present and now surfaced on collapsed panel
labels with an "Awaiting" badge, which they were not before.
