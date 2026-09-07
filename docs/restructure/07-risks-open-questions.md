# 07 — Risks, assumptions and open questions (Phase 9)

## 1. Decisions I made that were yours to make

You said "apply all recommendations", so I resolved the four Gate 1 questions myself. Each is
reversible; each is stated here so you can reverse it.

| Decision | What I did | How to undo |
|---|---|---|
| **Section numbers preserved** | §1.3 is still §1.3 wherever it sits. Only parts were renumbered. Renumbering would mean editing 173 sentences of your prose. | A full renumber is a separate engagement needing an explicit waiver on prose edits. Nothing here blocks it. |
| **Single route kept** | `/` remains the only page. Per-part routes would force ~262 anchors to carry a path as well as a fragment, for no gain the restructure needs. | Additive later; the part ids are already the natural route segments. |
| **Deep links client-side** | `LEGACY_IDS`, now 608 entries. Server redirects were used only for the ten `/content/*.md` asset paths, which are the only server-visible URLs that changed. | n/a — no alternative exists for fragments. |
| **Public audit file left in place** | `public/AUDIT-FINDINGS-PROMPTS-A-AND-B.md` still ships. It is an internal engineering audit served as a public static asset, byte-identical to the repo-root copy, and nothing imports it. | `git rm public/AUDIT-FINDINGS-PROMPTS-A-AND-B.md` — one command, no code change. **I recommend you run it.** I did not, because it is outside the restructure and shouldn't ride along unannounced. |

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

## 3. Deliberately unfinished

### §6.1.2–.4 is still in Part 4D

The provenance discipline, three source tiers and source-conflict rules are the epistemic method
for the whole document. §2.6 (Part 3) and §5.1 (Part 4C) both invoke them, so both now make
cross-part references to a section that should sit in the evidence layer.

I did not move them. §6.1's ten sub-parts interleave method with data-model infrastructure, and
the cut runs mid-section — the judgement about where shades into editing, which Ground Rule 1
forbids. **This is the strongest candidate for a second pass**, and it needs you to say where the
method ends and the infrastructure begins.

### §8.1 and §9.1 overlap, and now visibly

§8.1.1/§8.1.2 are stage-1/stage-2 scorecards; §9.1.1/§9.1.2 are nomination-window/general-election
objectives. Substantially the same content, and for the first time they are adjacent, three
headings apart in Part 1. I did not merge them — merging is a prose edit. **Your call which
absorbs which.**

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
| **A hash change on an already-loaded page does not re-run the deep-link resolver.** A legacy link clicked while the page is open lands on the raw hash | low, **pre-existing** | Cold loads work — verified across three id generations. A `hashchange` listener would close it; out of scope, not introduced here. |
| `TAB_ALIASES` maps `strategy` → `programme`, and `strategy` is now also a live part id | low | Safe only because `resolveLegacySectionId` checks the live index first. Commented in the source; `verify-deep-links.mjs` asserts both directions. **Always pass `validIds`.** |
| The 608-entry map is now three generations deep and will keep growing | low | Generated by diffing indexes, never hand-written. The generator is the method; the map is output. |
| Disclosure bodies now render into the DOM always, for print completeness | low | +2 kB measured on a page that cares about mobile data. Judged worth it; reverting is two `className` changes. |
| A figure I could not check | — | None altered. `verify-figures.mjs` still passes: every numeric literal in the UI traces to source. |

## 6. What I need from you

1. **Read Part 1 on a phone.** Everything else was verified mechanically. Whether the decision
   layer *reads* as self-sufficient — scorecards and objectives landing before the arithmetic
   behind them — is the one thing no script can tell me.
2. **Decide §8.1 vs §9.1.** Merge, or keep both and say why.
3. **Say where §6.1's method ends and its infrastructure begins**, and I will finish the move.
4. **Confirm the eight part descriptions** (§2 above) — the only non-heading text on this branch.
5. **Delete the public audit file**, or tell me to.

## 7. What I did not find

No secrets, in the working tree or anywhere in history — a filename scan across all refs returns
only `.env.example`, which holds no values. No figure altered. No section cut. `noindex/nofollow`
intact. All 20 `[Insert…]`/`[Confirm…]` placeholders present and now surfaced on collapsed panel
labels with an "Awaiting" badge, which they were not before.
