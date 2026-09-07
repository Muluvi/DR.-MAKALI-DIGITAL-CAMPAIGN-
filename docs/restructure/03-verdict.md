# 03 — Verdict on the proposed spine (Phase 3)

## The verdict

**Adopt with named modifications.** The five layers are kept as the *organising logic of the
evidence and argument*. They are **not** adopted as the document's top-level reading order.

Three modifications, each non-optional:

1. **Objectives are promoted out of the chain and placed before it**, as a decision layer, not
   as layer 1 of a five-layer sequence.
2. **Data and Deduction are merged into one part**, not two. The split is the single change most
   likely to make the document worse.
3. **Execution is not one layer.** It is five parallel tracks and must be presented as parallel,
   not as a fifth step in a sequence.

Net effect: the author's five layers become **a two-layer architecture whose lower layer is
ordered by four of his five layers.** Details in Phase 4.

---

## The tension, resolved

The author's order — objectives, data, extrapolations, strategies, execution — reproduces the
analyst's journey. Minto's instruction is the opposite: reason bottom-up, communicate top-down,
because the executive reader wants the destination before the route
([ModelThinkers](https://modelthinkers.com/mental-model/minto-pyramid-scqa)).

These are not actually in conflict, and treating them as a conflict is what produces bad
restructures. Minto governs **presentation order**. The author's five layers are a claim about
**logical dependency**. A document can present its answer first and still lay its dependencies
out in derivation order underneath — that is what the pyramid *is*.

The real conflict is narrower and worth naming exactly: **does the reader traverse the chain to
reach the answer, or does the reader receive the answer and traverse the chain only if they
choose to audit it?**

For this reader, the answer is the second, and three independent lines converge on it:

- **The genre's own standard is objective-first.** NDI's methodology sets the vote goal in step
  one and derives targeting from it
  ([NDI Module 9](https://www.ndi.org/sites/default/files/Module%209_Campaign%20Planning_EN.pdf)).
  This reader is a campaign professional; the objective-first order is already in their head.
- **Position predicts readership**, and 75% of readers of a long piece never pass 10% scroll
  depth ([Digital Content Next](https://digitalcontentnext.org/blog/2020/03/09/the-truth-about-scroll-and-swipe-the-real-value-of-mobiles-most-famous-features/)).
  Under the current order, everything a buyer needs sits past word 38,000.
- **The document has already voted.** 173 prose cross-references, with §6.5.4 cited 12 times and
  §6.5.5 nine — a section cited nine times from upstream is a precondition filed as a detail.
  The author has been routing around this order for 173 sentences.

The bottom-up order is not wrong. It is **an internal working order presented as a reading
order**, which is precisely the mistake Minto's process/product split exists to name.

---

## The two-layer question

The brief asks whether a two-layer solution serves better: a decision layer for the fifteen-
minute reader, the full chain beneath it for the auditing reader.

**Yes, and the case is stronger than the brief implies — because this document already contains
both layers and does not admit it.**

The proposal is doing two jobs. It is a pitch (does Firefly get the engagement?) and it is the
operating manual for a 12-month engagement (§2.7 production schedules, §5.2 shift rosters, §6.3
procurement matrices, §9.2 unit economics). Consulting convention puts a pitch at 8–15 pages
([Slideworks](https://slideworks.io/resources/how-to-write-consulting-proposals-like-mckinsey));
this is 49,660 words. That gap is not bloat. It is **two documents sharing one spine, competing
for the same first screen.**

Naming the two layers resolves several faults at once:

- The pitch layer can be answer-first without any prose being rewritten, because the material it
  needs already exists — §8.1 scorecards, §9.1 objectives, §7.1 scope, §9.2 tiers, §1.3.1
  threshold, §3.1 ceiling.
- The manual layer can stay in derivation order, which is the right order for someone auditing
  the reasoning, and is what the author's spine actually describes.
- The independent data-storytelling convention prescribes exactly two layers — insight first,
  "a second layer of supporting evidence for skeptics"
  ([Effective Data Storytelling](https://www.effectivedatastorytelling.com/post/data-storytelling-demystifying-narrative-structure-in-data-stories)).
  Not five.

**Two layers, not two documents.** A separate executive summary would fail: it would restate
figures already stated in 14 places, and restatement is the disease. The decision layer must be
made of the *same sections*, promoted — the document's canonical home for the ~200,000
threshold, presented first, then referenced rather than repeated.

---

## Why each modification is required

### 1. Objectives come out of the chain

The author lists objectives as layer 1 of five. Treating them as the first step of a sequence
recreates the current failure in a new place: they become the thing you read before the data
rather than the thing you can read *instead of* everything else.

Objectives are not a layer in the chain. **They are the top of the pyramid** — the answer that
every layer beneath exists to support. In the target architecture the objectives section is the
decision layer's core, and the five-layer chain sits beneath it. This is also the only
modification that fixes Fault 1 (objectives absent until §8.1, then duplicated at §9.1) rather
than relocating it.

### 2. Data and Deduction merge

This is where I disagree with the author most concretely.

Separating "the available data" from "extrapolations drawn from the data" sounds rigorous and is
in practice the most damaging move available, for a measured reason. Comprehension under
scrolling degrades **specifically for inference across separated facts**
([Harvey & Walker 2018](https://journals.sagepub.com/doi/10.1080/17470218.2017.1363258);
[ACM CHI 2023](https://dl.acm.org/doi/fullHtml/10.1145/3544548.3581174)).
A Data/Deduction split *institutionalises* that separation — it guarantees that every deduction
in the document sits at scrolling distance from the fact it rests on.

The audit already shows the cost. Fault 2 is the ~200,000 threshold (§1.3) and the digital
ceiling leaving the campaign 125,549 short (§3.1) sitting 20,000 words apart. A Data/Deduction
split would put the ward register in part 2 and the threshold derived from it in part 3 —
reproducing Fault 2 as the architecture rather than as an accident.

Against that, the split buys a real thing: it makes visible which claims are observed and which
are inferred, and this document's provenance discipline (§6.1.2–.4, Tier 1/2/3 grading) is a
credibility asset worth protecting.

**Both are obtainable.** Keep evidence and inference adjacent — fact, then the deduction drawn
from it, in one section — and carry the observed/inferred distinction *at the claim level*,
which is what the Tier badges and `ClaimBadge` component already do. The distinction survives.
The scrolling distance does not.

### 3. Execution is parallel, not sequential

"How the strategies are executed" implies one layer. In this document it is 24 sections and
~29,000 words across five genuinely parallel tracks — what we publish (§2.7, §2.9, §3.2–3.6),
what we run on the ground (§4.x), how we defend it (§5.x), what it runs on (§6.1–6.4), and who
does it and for what (§7.x, §9.2–9.3) — plus a delivery timeline (§8.3) that cuts across all
five.

Presented as a fifth sequential step, the reader is invited to read 29,000 words in an order
that has no meaning: nothing in Part 5 depends on having read Part 4. Presented as parallel
tracks under one heading, the reader can enter at the track they own — the campaign manager at
ground game, the party official at compliance and budget — which is how this material is
actually used once the engagement starts.

---

## What I am not recommending

**Not "replace".** The author's chain is a correct account of the argument's dependency
structure, it is a genuine improvement on the current ten parts, and the merged Data+Deduction
part it implies fixes Fault 2 directly. Discarding it would lose that.

**Not "adopt as-is".** Adopted as the reading order, the five-layer spine leaves objectives
reachable only by reading everything before them, splits the two facts the reader must combine,
and flattens five parallel tracks into a false sequence. It would fix Fault 3 (compliance and
charter promoted into the logical chain) while leaving Fault 1 half-fixed and actively worsening
Fault 2.

**Not a separate executive summary document.** Restatement is the disease; a summary is more of
it. The decision layer is built from promoted sections, not new prose.

---

## One consequence the author should weigh

Answer-first ordering puts pressure on hedges. The claim that leads is the claim that gets
compressed, and this document's most valuable structural property — §1.1's admission that the
poll mechanism is a **single-source Tier 3 report**, §1.3.6's ward-data-gaps register, §2.4.3's
research gaps, 20 `[Insert…]` placeholders, `Not yet` in KPI baseline cells — is exactly what
compression removes first.

So the decision layer must carry the qualifications **with** the claims, not beneath them. The
15.3-point deficit and "this mechanism is not confirmed by Wiper" belong on the same screen.
That is not a caveat about the restructure; it is a design constraint on it, and Phase 4 treats
it as one. Handled properly it is an asset: a proposal that leads with what it does not know is
more credible to a professional reader, not less.
