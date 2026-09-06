# 04 — Target architecture (Phase 4)

## The decision that shapes everything below: numbers are preserved

**Existing section numbers do not change.** §1.3 stays §1.3 wherever it lands; §6.5.4 stays
§6.5.4. Only the *part* level is renumbered, and parts are named rather than numbered where
that reads better.

Three reasons, in order of weight:

1. **Ground Rule 1 forbids editing prose.** The document contains **173 in-prose "Section N.N"
   references across 82 distinct targets**. Renumbering means editing 173 sentences of the
   author's prose. That is not re-routing; it is rewriting, and it puts Definition-of-Done #9
   at risk for a cosmetic gain.
2. **Re-routing achieves the same result without touching a word.** `crossSectionTarget()`
   currently resolves a reference by its *leading digit* → file. Changing it to resolve against
   the **built section index** makes every one of the 173 references keep working no matter
   which part a section moves to. The prose still reads "Section 6.5.4"; the link lands in
   Part 3. This is exactly the "moving and re-routing" the brief specifies.
3. **The cost is legibility, and it is affordable.** Part 2 will contain §1.1–§1.4, §2.4, §3.1,
   §3.4 and §6.6 — visibly non-contiguous. Mitigation: the derived TOC already renders a number
   column and a part label, so each section shows both its part and its number. A reader who
   knows the document by its numbers keeps their map; a reader who does not never notices.

A full renumber remains available as a follow-on. It needs an explicit waiver on prose edits and
should be a separate engagement, not a rider on this one. Logged in the risks file.

---

## The shape

Two layers, per the Phase 3 verdict.

- **Part 1 is the decision layer** — self-sufficient for a reader with fifteen minutes. It is
  built entirely from promoted existing sections. Not one word of new prose.
- **Parts 2–5 are the audit layer**, ordered by four of the author's five logical layers:
  evidence-with-its-inferences (Part 2) → strategy (Part 3) → execution (Part 4) → delivery and
  proof (Part 5).

Five parts replace ten. Lengths are approximate (±5%) and measured from section bodies.

---

## Part 1 — The decision

**~6,200 words.** Reader question: *"What am I buying, what will it achieve, what does it cost,
and why should I believe the numbers?"*

| Order | § | Title | From | Words | Answers |
|---|---|---|---|---|---|
| 1.1 | 0.1 | The bottleneck is the nomination, not the election | §0.1 MOVED | 323 | "Why now, and why is this not a 2027 general-election plan?" |
| 1.2 | 0.3 | Three realities the campaign has to work inside | §0.3 MOVED | 236 | "What constrains anything you propose?" |
| 1.3 | 8.1 | The headline scorecards | §8.1 **PROMOTED** from Part 8 | 819 | "What does success look like, staged?" |
| 1.4 | 9.1 | What the campaign gets | §9.1 **PROMOTED** from Part 9 | 800 | "What am I actually getting, on what timeline?" |
| 1.5 | 8.2.3 | The KPI framework, anchored to the vote threshold | §8.2 **SPLIT**, .3 promoted | ~370 | "How does every target tie back to winning?" |
| 1.6 | 7.1 | The scope of work | §7.1 **PROMOTED** from Part 7 | 485 | "What work is Firefly doing?" |
| 1.7 | 0.2 | What Firefly would run, and the credential it builds on | §0.2 MOVED | 272 | "Who is proposing this and on what basis?" |
| 1.8 | 9.2 | Budget tiers and unit economics | §9.2 **PROMOTED** from Part 9 | 2,056 | "What does it cost, and is it legal?" |
| 1.9 | 9.3 | Working together, and what happens next | §9.3 **PROMOTED** from Part 9 | 1,165 | "What happens if I say yes?" |

### Where the objectives section comes from — documented origin

The brief asks this explicitly. The answer is that **no objectives section is authored; three
existing ones are promoted and placed adjacent**:

- **§8.1** (819 w) — two staged scorecards, nomination window and general election.
- **§9.1** (800 w) — objectives by timeline, with the document's own statement that "every
  objective traces directly either to securing the Wiper nomination poll share or delivering the
  ~200,000 vote threshold."
- **§8.2.3** (~370 w) — the KPI framework anchored to the vote threshold, split out of §8.2.

Together these are the objectives layer, at ~1,990 words, and they already exist in full. What
they lack is position: currently at word ~41,000 and ~45,000 of a 49,660-word document.

**§8.1 and §9.1 substantially overlap** — §8.1.1/§8.1.2 are stage-1/stage-2 scorecards and
§9.1.1/§9.1.2 are nomination-window/general-election objectives. Placing them adjacent makes
that duplication visible for the first time. **I am not merging them** — merging is a prose edit.
The overlap is logged as an open question for the author in `07-risks-open-questions.md`; it is
his call whether one absorbs the other.

**Nine further KPI blocks stay with their tracks** — §3.5.6 earned media, §3.7.5 accessibility,
§4.3.6 offline layer, §4.4.5 volunteers, §4.5.4 coalition, §8.4.5 message lab, §8.5.7 tracker,
§6.4.4 analytics benchmarks. These are track-level targets and belong beside the work they
measure. Part 1's objectives section **indexes** them (a generated list of links, which is nav
chrome, not content) so the reader can see the full measurement surface without it being
relocated.

### The honesty requirement, made structural

§1.1's admission that the poll mechanism is a **Tier 3 single-source report not confirmed by
Wiper**, and §1.3.6's ward-data-gaps register, live in Part 2. Part 1 leads with a 15.3-point
deficit and a ~200,000-vote threshold derived from data the document itself flags as
incomplete.

**Constraint on implementation:** the decision layer must surface its own qualifications on the
same screen as the claims they qualify. The mechanism already exists — `ClaimBadge` with the
`awaiting` status, the Tier 1/2/3 provenance markers, and `DisputedFigure`. Part 1 must render
them at full strength, never in a collapsed panel. Specified in Phase 6 as a hard rule, not a
preference.

---

## Part 2 — What we know, and what it means

**~14,500 words.** Reader question: *"Is the analysis sound, and does the evidence actually
support the conclusions?"*

Data and deduction are **merged, not split** — the Phase 3 verdict. Each deduction sits
adjacent to the evidence it rests on.

| Order | § | Title | From | Words | Answers |
|---|---|---|---|---|---|
| 2.1 | 1.1 | The nomination, and how it will be decided | Part 1 | 877 | "What exactly is the contest, and how sure are we?" |
| 2.2 | 1.2 | The candidate and the county | Part 1 | 3,530 | "What is the terrain?" |
| 2.3 | 1.3 | The arithmetic of winning | Part 1 | 3,534 | "How many votes, and from where?" |
| 2.4 | 3.1 | The two-tier channel architecture | Part 3 **MOVED** | 1,891 | "Can digital alone deliver that number?" |
| 2.5 | 1.4 | The county's three regions | Part 1 | 842 | "How does the county divide?" |
| 2.6 | 2.4 | Who we are talking to | Part 2 **MOVED** | 2,161 | "Who are these voters, and how many of each?" |
| 2.7 | 3.4.1–.2 | Radio ownership and the gatekeeper bottleneck | §3.4 **SPLIT** | ~500 | "Who controls the channel that reaches the offline majority?" |
| 2.8 | 6.6 | Statutory and regulatory compliance | Part 6 **PROMOTED** | 1,137 | "What are the legal limits on anything you propose?" |

**§1.3 followed immediately by §3.1 is the single highest-value move in this architecture.** It
closes audit Fault 2: the ~200,000-vote threshold and the digital ceiling that leaves the
campaign 125,549 votes short currently sit ~20,000 words apart. Phase 2 found that comprehension
under scrolling degrades *specifically for inference across separated facts*
([Harvey & Walker 2018](https://journals.sagepub.com/doi/10.1080/17470218.2017.1363258)). This
is that inference, and adjacency removes the failure rather than mitigating it.

**§3.4.1–.2 promoted into the evidence layer** because the Kamba-radio ownership map is the most
valuable proprietary DATA in the document — who owns each station and which rival they favour —
and it currently sits inside an execution part, which is why §3.5 has to re-state it 1,000 words
later.

### Where compliance (§6.6) sits, and why — justified

**§6.6 goes into Part 2, at the end of the evidence layer.** It is not appendix material and it
is not execution detail. It is a *fact of the terrain*, in exactly the sense the ward register
and the census are facts of the terrain: the ECFA obligations, the IEBC nomination and clearance
checklist and the election-offences liability describe the box every plan in Parts 3–5 must fit
inside.

Three specific arguments:

1. **It bounds sections that currently precede it.** The gazetted KSh 97,560,000 ceiling appears
   in §3.3, §6.6 and §9.2 — three sections, three contexts, one legal fact. Placing it in the
   evidence layer gives it one canonical home that the other two reference.
2. **The reader's clock runs on it.** The IEBC clearance checklist is a deadline structure, and
   the nomination window closes September 2026. That is decision-relevant, not reference
   material.
3. **Currently it is the last thing in Part 6 of ten parts** — the position in the document
   where readership is lowest, for content whose omission is disqualifying.

---

## Part 3 — What we will therefore do

**~7,600 words.** Reader question: *"Given all that, what is the actual plan, and what will you
not do?"*

| Order | § | Title | From | Words | Answers |
|---|---|---|---|---|---|
| 3.1 | 2.1 | The Economist Governor | Part 2 | 602 | "What is the central claim?" |
| 3.2 | 2.2 | The four campaign pillars | Part 2 | 275 | "What does the claim break into?" |
| 3.3 | 2.3 | The six campaign themes | Part 2 | 232 | "What do we actually talk about?" |
| 3.4 | 2.5 | Voter segments and the messaging framework | Part 2 | 600 | "Who hears which of those?" |
| 3.5 | 2.6 | Message architecture | Part 2 | 2,408 | "How is the claim argued, channel by channel?" |
| 3.6 | 2.8 | Behavioural science and persuasion | Part 2 | 594 | "How is it framed to land?" |
| 3.7 | 6.5 | Ethics, privacy and the data charter | Part 6 **PROMOTED** | 1,505 | "What will you refuse to do?" |
| 3.8 | 3.7 | Accessibility and inclusion | Part 3 | 687 | "Who does the plan refuse to leave out?" |
| 3.9 | 8.5 | The public service-delivery tracker | Part 8 **PROMOTED** | 714 | "What makes this candidate different in kind?" |

### Where the data charter (§6.5) sits, and why — justified

**§6.5 goes into Part 3, immediately after the message strategy and before accessibility.** It is
a strategic commitment, not a data-layer implementation detail.

1. **It is cited 12 times — the most-referenced target in the document.** §2.5, §2.8, §2.9,
   §4.4, §4.5 and §6.2 each carry a defensive paragraph restating a charter commitment, because
   none of them can assume the reader has read it. Six sections doing work that correct placement
   does once.
2. **§6.5.5, the compliance sign-off gate, is cited nine times and gates §6.2 entirely.** §6.2
   opens by declaring itself "conditional on the compliance gate in Section 6.5.5" — a forward
   reference to a section 600 words further on. In Part 3, the gate is established before every
   section that depends on it.
3. **It is a differentiator, and position is telling the reader it is boilerplate.** Vendors
   openly market databases of millions of Kenyan voters; §6.5 is the campaign's refusal to buy
   them. Under DPA 2019 that refusal is a selling point to a party official assessing petition
   exposure. Filed as §6.5 of Part 6, it reads as a compliance annex. Placed as the campaign's
   stated limits — directly after what it *will* say and directly before who it *will not* leave
   out — it reads as strategy, which is what it is.

**§8.5 promoted for the same class of reason.** The service-delivery tracker is the candidate's
M&E credential running in public before the election. §8.5.5 is literally titled "What it is
worth to the campaign". It is a differentiating strategic asset filed at the end of the
measurement part, and it is referenced 11 times from across the document.

---

## Part 4 — How it runs

**~21,100 words.** Reader question: *"Concretely, what happens week to week — and who does it?"*

**Presented as five parallel tracks, not a sequence.** Nothing in the defence track depends on
having read the ground track. The reader enters at the track they own.

| Track | Sections | Words | Reader |
|---|---|---|---|
| **4A — What we publish, and where** | §2.7, §2.9, §3.2, §3.3, §3.4.3–.4, §3.5, §3.6 | ~6,900 | comms lead |
| **4B — What we run on the ground** | §4.1, §4.2, §4.3, §4.4, §4.5 | ~3,700 | field director |
| **4C — Defending the campaign** | §5.1, §5.2, §5.3, §5.4 | ~3,600 | campaign manager |
| **4D — What it runs on** | §6.1, §6.2, §6.3, §6.4 | ~4,800 | data lead |
| **4E — Who does the work** | §7.2, §7.3 | ~2,100 | candidate, party |

Notes on individual moves:

- **§6.1 stays in 4D but its provenance sub-parts are flagged.** §6.1.2–.4 (provenance
  discipline, three source tiers, source conflicts) are the epistemic method for the whole
  document, invoked from §2.6 and §5.1. The right structural answer is to promote them into
  Part 2. **I am not doing it in this pass**: §6.1 is a single section whose ten sub-parts
  interleave method and infrastructure, and splitting it cleanly needs a judgement about
  paragraph boundaries that shades into editing. Raised in the risks file as the strongest
  candidate for a second pass.
- **§3.4 splits.** §3.4.1–.2 (ownership map, gatekeeper bottleneck) → Part 2. §3.4.3–.4 (getting
  on air around a hostile gatekeeper, how we pitch) → 4A, adjacent to §3.5.
- **§7.2's forward reference to §9.2 tiers now points backwards**, into Part 1. Improvement, no
  edit required.
- **§4.1 and §4.2 stay adjacent and in order.** They overlap heavily (1,587 and 339 words on the
  same loop); adjacency makes that visible without merging.

---

## Part 5 — Delivery and proof

**~4,300 words.** Reader question: *"Over twelve months, in what order, and how will I know it
is working?"*

| Order | § | Title | From | Words | Answers |
|---|---|---|---|---|---|
| 5.1 | 8.3 | The phased plan | Part 8 | 1,423 | "What happens in what order?" |
| 5.2 | 8.2 (less .3) | What we measure, and why | Part 8 **SPLIT** | ~1,490 | "How is performance governed?" |
| 5.3 | 8.4 | The Kitui message lab | Part 8 | 469 | "How do we learn what works?" |
| 5.4 | 0.4 | Why the operation is run remotely | Part 0 **MOVED** | 504 | "Can a remote team actually deliver this?" |

**§0.4 moves out of the framing part.** It answers an objection ("can a Nairobi team run a Kitui
campaign?") that the reader does not yet hold at word 800, and that lands properly after they
have seen the twelve-month plan. It also duplicates §9.3.6 "Why a remote operation works" —
logged for the author, not merged.

**§8.3 leads Part 5, not §8.2**, because the phased plan is the cross-cutting timeline for all
five Part 4 tracks; measurement governs it rather than preceding it.

---

## Interactive components — where each lands

All 38 `HEADING_INSERTS` mounts follow their section automatically once the map is regenerated.
The ones that need a *judgement*, not just a key rewrite:

| Component | Now | New home | Why it is defensible |
|---|---|---|---|
| **Nomination viability simulator** (`PollingTrajectorySimulator`) | §0.1 | **Part 1**, §0.1 | Already the first interactive object the reader meets. In the decision layer it becomes what it should always have been: the reader testing the 15.3-point deficit themselves before reading the plan. |
| **Budget-tier reallocation slider** (`BudgetScenarioModeler`) | §9.2.5 | **Part 1**, §9.2.5 | This is a *decision* instrument, not an illustration. Moving §9.2 into the decision layer puts the tier trade-off in the hands of the person choosing a tier. |
| **Ward-level charts** (`WardCartogramBlock`, `PathTo200kBlock`, `ConstituencyWeightBlock`) | §1.2.3 | **Part 2**, §1.2.3 | Stays with the ward register it plots. Now two sections from §1.3's threshold and three from §3.1's ceiling — the three views of the same arithmetic finally within one part. |
| **`PathTo200kCalculator`** | §1.3.3 | **Part 2**, §1.3.3 | Unchanged relative to its section; gains from §3.1 adjacency. |
| **`ReachArchitecture3D` + `PhoneShowcase`** | §3.1 | **Part 2**, §3.1 | Moves with §3.1 into the evidence layer. The two-tier reach illustration now sits beside the threshold it is measured against. |
| **`ComplianceCeilingPanel`** | §9.2.7 | **Part 1**, §9.2.7 | Spend-against-ceiling belongs with price. Its data twin, §6.6, is now one part away in Part 2 rather than four. |
| **`DataSecurityEthicsCharter`** | §6.5 | **Part 3**, §6.5 | Follows the charter into the strategy layer. |
| **`PublicServiceDeliveryTracker`** | §8.5 | **Part 3**, §8.5 | Follows the tracker into the strategy layer. |
| **`MediaOwnershipBlock`** | §3.4.1 | **Part 2**, §3.4.1 | Follows the split half it illustrates. **Requires care** — this is the mount most likely to be orphaned by the §3.4 split. |
| **`PhaseRail` + `KpiPhaseBlock`** | §8.3 | **Part 5**, §8.3 | The timeline rail belongs with the timeline. |
| **`DecisionPanel`** | keyed `tabId === "ask"` | **Part 1**, end | Not keyed to a section number but to a *file*. Must be rewired to the new decision part or it disappears. |
| **Campaign Focus Mode** | suppressed on `overview` | suppressed on **Part 1** | The suppression rule is "not on the landing view". Part 1 is the new landing view. |
| **Print-to-briefing-kit** | rendered only on `ask` | **Part 1** + global header | Currently reachable only by scrolling to the end of Part 9. In an answer-first document the briefing kit is a decision-layer affordance. |

Five `MarkdownViewer` behaviours keyed on `tabId` rather than section id (`PlatformSizingBlock`,
`ClaimCards`, `MizaniSlopeBlock`, governing-reality emphasis, `DecisionPanel`) will silently stop
firing when their section changes file. Enumerated with fixes in Phase 6.

---

## Progressive disclosure — where it must not be used

Phase 2's inference finding sets a hard rule: **never collapse one half of a comparison the
reader needs to make.**

Must stay expanded, in every reading mode:

- §1.3's threshold and §3.1's ceiling — the 125,549-vote gap is the document's central inference.
- §9.2's tier table against §9.2.1's statutory ceiling, and against §6.6's obligations.
- Any KPI target against its `Not yet` baseline cell.
- Every `[Insert…]` / `[Confirm…]` placeholder and every Tier 3 provenance marker in Part 1.

Everything else keeps the existing rule-driven behaviour in `lib/collapse-groups.ts`, which
re-derives itself from content shape and needs no edits.

---

## What this architecture fixes

| Audit fault | Fix |
|---|---|
| **1 — objectives absent until §8.1, then duplicated** | §8.1, §9.1 and §8.2.3 promoted to Part 1, adjacent, with the overlap surfaced for the author rather than silently merged. |
| **2 — threshold and ceiling 20,000 words apart** | §3.1 moved adjacent to §1.3 in Part 2. Removes a measured comprehension failure, not a stylistic one. |
| **3 — compliance and charter filed as appendix** | §6.6 → Part 2 as terrain; §6.5 → Part 3 as strategic commitment, established before the six sections that reference it. |

Repetition is *not* addressed by deletion. The twelve repeated figures were load-bearing given
the old order; with canonical homes established, whether to thin them is the author's editorial
call, and it is a prose edit. Logged, not performed.
