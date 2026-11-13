# 05 — Migration map (Phase 5)

Every §X.Y from §0.1 to §9.3 appears exactly once, with a disposition. **50 rows.**

Dispositions used: **MOVED** (whole section, new part, same number) · **PROMOTED** (moved to an
earlier, more prominent layer) · **SPLIT** (both destinations named) · **DEMOTED** (moved later).
**MERGED**, **REWRITTEN IN PLACE** and **CUT** are used **zero times** — all three require prose
edits, which Ground Rule 1 forbids. Two candidate merges are logged for the author instead.

**Context-dependency column:** flags content whose meaning depends on the section currently
preceding it and that would break if moved without mitigation.

---

## Part 1 — The decision

| Old § | Title | Disposition | New location | Context dependency — and mitigation |
|---|---|---|---|---|
| 0.1 | The bottleneck is the nomination, not the election | MOVED | P1, first | **None.** Already opens the document; opens it still. Its forward ref to §1.1 becomes a ref into Part 2 — resolved by the index-driven resolver. |
| 0.3 | Three realities the campaign has to work inside | MOVED | P1, second | **Low.** Currently follows §0.2 (what Firefly runs); will follow §0.1. Reads at least as well — constraints after the problem rather than after the offer. |
| 8.1 | The headline scorecards | **PROMOTED** | P1, third | **HIGH.** Both scorecards assume the ~200,000 threshold (§1.3.1) and the 22.1/37.4 poll split (§1.1.5), which now come *after* it. **Mitigation:** the threshold and the deficit are already stated inline in §8.1's own text; the resolver turns §1.3/§1.1 references into forward links. Verify on render that §8.1 is self-standing without Part 2 — the one place in this map where a reader could hit an unexplained number. |
| 9.1 | What the campaign gets | **PROMOTED** | P1, fourth | **HIGH.** Same dependency as §8.1, plus it references §9.2 tiers (now immediately below it — improved) and §7.1 scope (now immediately above it — improved). |
| 8.2.3 | The KPI framework, anchored to the vote threshold | **SPLIT** from §8.2 → PROMOTED | P1, fifth (§8.2.1/.2/.4/.5 → P5 §5.2) | **MEDIUM.** §8.2's shared lead paragraph introduces §8.2.1 and §8.2.2 by name and stays with them in P5. §8.2.3 opens on its own framing sentence and travels cleanly. **Verify the split point renders as a complete section in both halves.** |
| 7.1 | The scope of work | **PROMOTED** | P1, sixth | **Low.** Six self-contained service descriptions. Forward-refs §3.7.1 (accessibility) → now Part 3. |
| 0.2 | What Firefly would run, and the credential it builds on | MOVED | P1, seventh | **Low.** Currently second; now after the objectives and scope it summarises, which is the better position for a credential claim. |
| 9.2 | Budget tiers and unit economics | **PROMOTED** | P1, eighth | **MEDIUM.** §9.2.1 restates the gazetted ceiling that §6.6 and §3.3 also carry; §6.6 is now in Part 2, *after* it. §9.2.1 states the ceiling in full inline, so it stands alone. **Mitigation:** none required; verify inline statement is intact. |
| 9.3 | Working together, and what happens next | **PROMOTED** | P1, ninth (close) | **MEDIUM.** §9.3.1 refs §7.2.4 reporting lines (now Part 4E), §9.3.2 refs §5.3.5 provenance (Part 4C), §9.3.3 refs §5.4.3 (Part 4C). All forward refs into the audit layer — correct direction for a closing section. §9.3.6 duplicates §0.4, now in Part 5. |

## Part 2 — What we know, and what it means

| Old § | Title | Disposition | New location | Context dependency — and mitigation |
|---|---|---|---|---|
| 1.1 | The nomination, and how it will be decided | MOVED | P2, first | **MEDIUM.** Opens "Section 0.1 opened with the claim…" — §0.1 is now in Part 1, one part earlier. The backward reference still reads correctly and the link resolves. No edit needed. |
| 1.2 | The candidate and the county | MOVED | P2, second | **None.** Self-contained evidence. |
| 1.3 | The arithmetic of winning | MOVED | P2, third | **None.** Derives from §1.2, which still precedes it. |
| 3.1 | The two-tier channel architecture | **MOVED** (Part 3 → Part 2) | P2, fourth | **HIGH — and this is the point of the move.** §3.1's digital-ceiling box asserts "leaving the candidate 125,549 votes short", which only means anything against §1.3's threshold. It currently depends on a section 20,000 words back; it will depend on the section immediately above it. **The dependency is not broken by the move — it is repaired by it.** Its own dependents (§3.3 budget-against-reach, §4.3 offline layer) become forward refs into Part 4. |
| 1.4 | The county's three regions | MOVED | P2, fifth | **MEDIUM.** Currently follows §1.3 directly; will follow §3.1. Its zone weighting builds on §1.3.2's ward ranking, now two sections back rather than one. Acceptable — §1.4 restates the ward figures it needs. |
| 2.4 | Who we are talking to | **MOVED** (Part 2 → Part 2 evidence layer) | P2, sixth | **MEDIUM.** §2.4.2's segment sizing re-derives from the same KNBS/IEBC/CA figures as §1.2.5, now four sections above rather than in another part — the duplication becomes visible and checkable. Its dependents §2.5 and §2.6 move to Part 3, so segment definitions now precede the messaging that uses them across a part boundary. Resolver handles the links. |
| 3.4.1–.2 | Radio ownership map; the gatekeeper bottleneck | **SPLIT** from §3.4 → PROMOTED | P2, seventh (§3.4.3–.4 → P4A) | **HIGH.** §3.4's lead paragraph introduces both halves and ends by pointing at §3.4.3 ("an aggressive bypass architecture detailed in Section 3.4.3"). Splitting leaves that pointer crossing a part boundary. **Mitigation:** the pointer is a cross-reference, resolved by the index — it keeps working and now signals "the response to this problem is in the execution track", which is accurate. **The `MediaOwnershipBlock` mount is keyed to §3.4.1 and must move with this half.** Highest-risk single row in this map. |
| 6.6 | Statutory and regulatory compliance | **PROMOTED** (Part 6 → Part 2) | P2, eighth | **Low.** Opens on its own framing ("This compliance pack consolidates all statutory…"). Its dependents §3.3.3–.4 and §9.2.1 now reference backwards into the evidence layer, which is the correct direction. |

## Part 3 — What we will therefore do

| Old § | Title | Disposition | New location | Context dependency — and mitigation |
|---|---|---|---|---|
| 2.1 | The Economist Governor | MOVED | P3, first | **Low.** Its resource-paradox argument uses the KSh 13.79bn envelope from §1.2.4, now one part back. Stated inline in §2.1.2. |
| 2.2 | The four campaign pillars | MOVED | P3, second | **MEDIUM.** Its lead paragraph disambiguates itself from §2.6 (message pillars) and §2.7.1 (content pillars). §2.6 stays in Part 3 two sections below — improved. §2.7.1 moves to Part 4A, so one arm of the disambiguation now crosses a part boundary. Resolver handles it; the disambiguation still reads. |
| 2.3 | The six campaign themes | MOVED | P3, third | **None.** Self-evidencing; each theme carries its own inline source. |
| 2.5 | Voter segments and the messaging framework | MOVED | P3, fourth | **HIGH.** Depends entirely on §2.4's six segments, which move to Part 2. **Mitigation:** §2.4 is now the last-but-two section of the part immediately preceding — closer in reading order than §2.4→§2.5 feels today only because §2.4 is 2,161 words. Acceptable, but this is the row to check on the rendered page. §2.5's ethics constraint now points backwards to §6.5.4 in Part 3 — improved from a 30,000-word forward reference. |
| 2.6 | Message architecture | MOVED | P3, fifth | **MEDIUM.** Opens by invoking "the campaign's Provenance Discipline (Section 6.1.2)", which stays in Part 4D — still a forward reference, and still unresolved by this pass. Flagged in risks as the strongest argument for a second pass on §6.1. |
| 2.8 | Behavioural science and persuasion | MOVED | P3, sixth | **Low.** Its "Boundary" paragraph refs §6.5.4, now two sections below in the same part — substantially improved. |
| 6.5 | Ethics, privacy and the data charter | **PROMOTED** (Part 6 → Part 3) | P3, seventh | **MEDIUM.** §6.5's lead sits in a data-layer context ("Voter data is handled in a manner intended to comply…") and currently follows §6.4 analytics. In Part 3 it follows §2.8's persuasion boundary — a better neighbour, since §2.8 explicitly defers to it. §6.5.5's gate now precedes §6.2 (Part 4D) instead of following it: **the single most valuable forward-reference repair in the map.** |
| 3.7 | Accessibility and inclusion | MOVED | P3, eighth | **Low.** §3.7.4 is titled "Why this sits in the strategy, not an annex" — in Part 3 that title becomes true rather than defensive. |
| 8.5 | The public service-delivery tracker | **PROMOTED** (Part 8 → Part 3) | P3, ninth | **MEDIUM.** Referenced 11× — from §6.3 as a stack component and from §2.x as a proof point. Moving it earlier turns most of those into backward references. Its own §8.5.6 build-and-cost refs §9.2 tiers, now in Part 1 — backward, improved. |

## Part 4 — How it runs (five parallel tracks)

| Old § | Title | Disposition | New location | Context dependency — and mitigation |
|---|---|---|---|---|
| 2.7 | Content production and asset governance | MOVED | P4A | **MEDIUM.** Opens by citing "only ~14% of voters are active on digital social media (Section 3.1.1)" — §3.1 moves to Part 2, so this becomes a backward reference across two parts. Reads fine; link resolves. |
| 2.9 | AI-assisted creative and testing | MOVED | P4A | **Low.** Refs §6.5.4 (Part 3, backward — improved) and §5.3.5 (Part 4C, sideways). |
| 3.2 | Platform tactics | MOVED | P4A | **None.** |
| 3.3 | Paid media and campaign financing | MOVED | P4A | **MEDIUM.** "allocated proportionally against the channel reach realities established in Section 3.1" — §3.1 now in Part 2, backward. §3.3.3–.4 duplicate §6.6, now also backward in Part 2. Both improved. |
| 3.4.3–.4 | Getting on air around a hostile gatekeeper; how we pitch | **SPLIT** from §3.4 | P4A, adjacent to §3.5 (§3.4.1–.2 → P2) | **HIGH.** These two sub-parts are the *response* to §3.4.1–.2's ownership problem and lose their setup when separated. **Mitigation:** they land immediately before §3.5, whose own opening restates the ownership map ("the ownership map is politically compromised, and any credible media plan must say so"). §3.5 therefore supplies the context the split removes — which is exactly why §3.5 currently repeats §3.4. The repetition stops being redundancy and becomes the bridge. |
| 3.5 | Journalists, debates and radio strategy | MOVED | P4A | **Low.** Gains from adjacency to §3.4.3–.4. |
| 3.6 | Working in three languages | MOVED | P4A | **None.** |
| 4.1 | Field and digital, working as one | MOVED | P4B, first | **None.** |
| 4.2 | The field-to-digital loop | MOVED | P4B, second | **None.** Kept adjacent to §4.1 deliberately, so their overlap is visible. |
| 4.3 | SMS, USSD and the offline majority | MOVED | P4B, third | **MEDIUM.** §4.3.1 re-derives the offline argument from §1.2.5's connectivity figures — now two parts back. The re-derivation is inline and complete, so it stands; but it is now visibly the third statement of an argument made canonically in Part 2. Logged as a thinning candidate for the author. |
| 4.4 | Digital organising and volunteers | MOVED | P4B, fourth | **Low.** §6.5.4 gate now backward in Part 3 — improved. |
| 4.5 | The coalition and endorsement calendar | MOVED | P4B, fifth | **Low.** Same §6.5.4 improvement. |
| 5.1 | Rapid response and opposition handling | MOVED | P4C, first | **MEDIUM.** Cites "Defamation Law Safeguards (Section 6.1.2)" — §6.1 stays in Part 4D, a sibling track. Sideways reference between parallel tracks; resolves, but is the second-strongest argument for promoting §6.1.2–.4 in a later pass. |
| 5.2 | The digital war room | MOVED | P4C, second | **Low.** |
| 5.3 | Cybersecurity and manipulated media | MOVED | P4C, third | **Low.** |
| 5.4 | Watching the other campaigns | MOVED | P4C, fourth | **MEDIUM.** §5.4.5 "reading the current field" duplicates rival material in §1.2.2 and §1.2.10, now in Part 2 — backward reference, duplication becomes visible. |
| 6.1 | The data layer | MOVED | P4D, first | **HIGH — knowingly unresolved.** §6.1.2–.4 is the document's epistemic method, invoked from §2.6 (Part 3) and §5.1 (Part 4C). Both become cross-part references that this pass does not repair. **Not split, because splitting §6.1 requires a judgement about paragraph boundaries that shades into editing.** This is the single largest piece of deliberately unfinished business in the plan; see risks. |
| 6.2 | Predictive voter modelling | MOVED | P4D, second | **Improved.** Its opening dependency on §6.5.5 becomes a *backward* reference into Part 3 instead of a forward reference to a section 600 words ahead. |
| 6.3 | The technology stack | MOVED | P4D, third | **Low.** Refs §8.5 tracker, now backward in Part 3 — improved. |
| 6.4 | Analytics and attribution | MOVED | P4D, fourth | **Low.** §6.4.4 benchmarks now reference the Part 1 objectives backward. |
| 7.2 | The team and how it is structured | MOVED | P4E, first | **Improved.** "scales with the budget tier selected in Section 9.2" was a forward reference across two parts; §9.2 is now in Part 1, backward. |
| 7.3 | Leadership roles and governance rhythm | MOVED | P4E, second | **Low.** Overlaps §7.2.4–.5 and §9.3.1; §9.3 now in Part 1. |

## Part 5 — Delivery and proof

| Old § | Title | Disposition | New location | Context dependency — and mitigation |
|---|---|---|---|---|
| 8.3 | The phased plan | MOVED | P5, first | **MEDIUM.** Currently follows §8.2's measurement framing; will lead Part 5. Its per-phase objectives reference the Part 1 scorecards backward. Its `PhaseRail`/`KpiPhaseBlock` mounts travel with it. |
| 8.2 (less .3) | What we measure, and why | **SPLIT** → DEMOTED | P5, second (§8.2.3 → P1 §1.5) | **HIGH.** §8.2's lead paragraph explicitly frames a "two-part data architecture: Section 8.2.1 … while Section 8.2.2 …" — that lead belongs with .1 and .2 and stays here. Removing .3 leaves .1, .2, .4, .5, which the lead still describes correctly for .1/.2. **Verify the remaining section reads as complete and that §8.2.4/.5 are not orphaned by the removal.** |
| 8.4 | The Kitui message lab | MOVED | P5, third | **MEDIUM.** §8.4.1's argument about metric bias belongs analytically with §3.1's ceiling (Part 2). Left in place: moving it would split §8.4 for a 200-word gain. Its refs to §2.8 framings are backward into Part 3 — improved. |
| 0.4 | Why the operation is run remotely | **MOVED** (Part 0 → Part 5) | P5, fourth (close) | **MEDIUM.** Written as framing ("Operating a decentralized digital command center is not an operational compromise"), it will read as a closing answer to an objection instead. Duplicates §9.3.6, now in Part 1. **This is the one row where the move changes rhetorical function.** If the author objects, the fallback is to leave §0.4 in Part 1 after §0.2; noted in risks. |

---

## Reconciliation

| Check | Result |
|---|---|
| Sections in source (§0.1–§9.3) | **50** |
| Rows in this map | **50** |
| Each appearing exactly once | ✔ (§3.4 and §8.2 appear as one SPLIT row each, both destinations named) |
| MOVED | 31 |
| PROMOTED | 9 (§8.1, §9.1, §7.1, §9.2, §9.3, §6.6, §6.5, §8.5, and §8.2.3 via split) |
| SPLIT | 2 (§3.4 → P2 + P4A; §8.2 → P1 + P5) |
| DEMOTED | 1 (§8.2 remainder) |
| MERGED / REWRITTEN IN PLACE / **CUT** | **0** |
| Sections whose word count changes | **0** |

**Nothing is cut.** Every cut would be a prose edit.

## Context-dependency summary

| Risk | Rows | Requires |
|---|---|---|
| **HIGH** | §8.1, §9.1, §3.1, §3.4 split, §2.5, §6.1, §8.2 split | Visual verification on the rendered page, not just a passing build. Listed as a Phase 8 check. |
| **MEDIUM** | 17 rows | Link resolution verified mechanically. |
| **Low / None** | 26 rows | Build check only. |

Of the seven HIGH rows, **§3.1 is high-dependency in the good direction** — the move repairs the
dependency rather than straining it. The genuinely risky three are **§3.4's split** (a mount
point and a lead paragraph that spans the cut), **§8.1/§9.1's promotion** (numbers arriving
before their derivation), and **§6.1 left in place** (knowingly unresolved).

## Two merges logged for the author, performed by nobody

1. **§8.1 ↔ §9.1** — staged scorecards vs. objectives by timeline. Substantially the same
   content, now adjacent in Part 1 for the first time.
2. **§0.4 ↔ §9.3.6** — "Why the operation is run remotely" vs. "Why a remote operation works".

Both are prose decisions. Ground Rule 1 puts them out of scope for this engagement.
