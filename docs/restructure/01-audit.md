# 01 — Structural audit (Phase 1)

Unit of analysis: the §X.Y sub-section (50 of them), because that is the unit that moves —
it owns a file position, a heading id, and in 38 cases a component mount point. Sub-parts
(§X.Y.Z, 212 of them) travel with their parent unless the Split column says otherwise.

Layers: **OBJ** what the campaign is trying to achieve, stated as a target · **DATA** observed
fact with a source · **DED** inference drawn from data · **STRAT** a choice about what to do ·
**EXEC** how the chosen thing is run.

---

## 1. Section-by-section classification

| § | Title | Words | Layer | Straddle — and the line it falls on |
|---|---|---|---|---|
| 0.1 | The bottleneck is the nomination, not the election | 323 | **DED** | DATA→DED. The poll-mechanism report and the 22.1/37.4 split are DATA; "the decisive hurdle is the nomination" is the inference. It leads with the inference, correctly. |
| 0.2 | What Firefly would run, and the credential it builds on | 272 | **STRAT** | STRAT + a compressed EXEC inventory. The scope list ("multi-channel governance, SMS/USSD gateway…") is EXEC summarised. |
| 0.3 | Three realities the campaign has to work inside | 236 | **DED** | DATA→DED. The 86% figure is DATA; "any digital plan must be built around it" is DED. Clean. |
| 0.4 | Why the operation is run remotely | 504 | **STRAT** | Pure delivery-model justification. Sits in the framing part but answers a question (§7/§9 territory) the reader has not asked yet. |
| 1.1 | The nomination, and how it will be decided | 877 | **DATA** | DATA + explicit uncertainty register. §1.1.6 ("if it becomes a delegate primary") is contingency STRAT. |
| 1.2 | The candidate and the county | 3,530 | **DATA** | Ten sub-parts of county evidence. §1.2.10 ("the legal ground to be careful on") is EXEC constraint hiding in an evidence section. |
| 1.3 | The arithmetic of winning | 3,534 | **DED** | The document's analytical core. §1.3.1–.4 derive the threshold and the target wards from §1.2 DATA. §1.3.6 is a DATA-gaps register — the honesty asset. |
| 1.4 | The county's three regions | 842 | **DED** | DATA→DED→STRAT in one section: ward counts (DATA), three-zone grouping (DED), "messaging here emphasises track record" (STRAT). Three layers, 842 words. |
| 2.1 | The Economist Governor | 602 | **STRAT** | The positioning choice. §2.1.1 "evidence behind the claim" is DATA supporting it; §2.1.2 resource paradox is DED. |
| 2.2 | The four campaign pillars | 275 | **STRAT** | Clean. Its lead paragraph is spent disambiguating itself from §2.6 and §2.7.1 — a structural symptom, not a writing problem. |
| 2.3 | The six campaign themes | 232 | **STRAT** | Each theme carries its own inline evidence, so DATA is embedded rather than referenced. |
| 2.4 | Who we are talking to | 2,161 | **DED** | DATA→DED. Segment definitions are DED over KNBS/IEBC/CA DATA. §2.4.2 restates census figures already given in §1.2.5. §2.4.3 is a second data-gaps register. |
| 2.5 | Voter segments and the messaging framework | 600 | **STRAT** | Segment→message mapping. Carries a hard ethical constraint (no ethnic targeting) that is really charter material from §6.5.4. |
| 2.6 | Message architecture | 2,408 | **STRAT** | STRAT + EXEC. §2.6.1–.3 are the message system (STRAT); §2.6.4 "answering disinformation" is EXEC and duplicates §5.1's remit. |
| 2.7 | Content production and asset governance | 1,676 | **EXEC** | Production pipeline, schedule, approvals, asset library. Unambiguously delivery. |
| 2.8 | Behavioural science and persuasion | 594 | **STRAT** | Technique selection. Its "Boundary" paragraph is charter material (§6.5.4) restated defensively. |
| 2.9 | AI-assisted creative and testing | 355 | **EXEC** | Tooling and weekly cycle. Opens with a disclosure commitment that is, again, §6.5.4. |
| 3.1 | The two-tier channel architecture | 1,891 | **DED** | **The most misfiled section in the document.** The digital-ceiling calculation ("100% of connected voters = ~72,000, still 125,549 short") is the single most decision-relevant deduction in the proposal, and it sits in Part 3 behind a channel-architecture heading. |
| 3.2 | Platform tactics | 405 | **EXEC** | Per-platform posting tactics. |
| 3.3 | Paid media and campaign financing | 1,492 | **EXEC** | EXEC + hard compliance. §3.3.3–.4 (financing rules, penalty exposure) are statutory constraint and duplicate §6.6.1. |
| 3.4 | Earned media and the radio landscape | 1,025 | **DATA** | **Straddles hard.** §3.4.1 (ownership map) is DATA — arguably the most valuable proprietary DATA in the document. §3.4.2 is DED. §3.4.3–.4 are STRAT/EXEC. The DATA half is buried in an execution part. |
| 3.5 | Journalists, debates and radio strategy | 1,209 | **EXEC** | Opens by re-stating §3.4's ownership finding, because the reader has probably lost it. |
| 3.6 | Working in three languages | 1,233 | **EXEC** | Language→channel mapping and QC pipeline. §3.6.1's mapping is arguably STRAT. |
| 3.7 | Accessibility and inclusion | 687 | **STRAT** | §3.7.4 is literally titled "Why this sits in the strategy, not an annex" — the document defending its own placement, which is evidence the placement is not self-evident. |
| 4.1 | Field and digital, working as one | 1,587 | **EXEC** | Integration model and operating rhythm. |
| 4.2 | The field-to-digital loop | 339 | **EXEC** | 339 words describing the same loop §4.1 just described in 1,587. Overlap, not sequence. |
| 4.3 | SMS, USSD and the offline majority | 909 | **STRAT** | **Straddles.** §4.3.1 "why this layer decides the race" is the strategic conclusion of §3.1's deduction — and restates §1.2.5's connectivity DATA a third time. §4.3.2–.6 are EXEC. |
| 4.4 | Digital organising and volunteers | 421 | **EXEC** | Tiers, gamification, tooling. Carries a §6.5.4 gate. |
| 4.5 | The coalition and endorsement calendar | 428 | **EXEC** | Sequenced calendar. Carries a §6.5.4 constraint. |
| 5.1 | Rapid response and opposition handling | 1,595 | **EXEC** | Decision tree, response times, holding lines. |
| 5.2 | The digital war room | 661 | **EXEC** | Staffing, shifts, tooling, drills. |
| 5.3 | Cybersecurity and manipulated media | 1,015 | **EXEC** | §5.3.1 threat model is DATA (CA advisory volumes); rest is EXEC. |
| 5.4 | Watching the other campaigns | 355 | **EXEC** | §5.4.5 "reading the current field" is DATA on rivals, and duplicates §1.2.2/§1.2.10. |
| 6.1 | The data layer | 1,730 | **EXEC** | **Straddles badly.** §6.1.2–.4 (provenance discipline, three source tiers, source conflicts) is the **epistemic method for the entire document** and is invoked from §2.6, §5.1 and elsewhere. It is method, not infrastructure, and it appears at word ~33,000. |
| 6.2 | Predictive voter modelling | 894 | **EXEC** | Conditional on §6.5.5. Reader must hold a forward reference for the whole section. |
| 6.3 | The technology stack | 1,451 | **EXEC** | Components, costs, procurement. |
| 6.4 | Analytics and attribution | 738 | **EXEC** | §6.4.4 "key metrics and benchmarks" is OBJ material sitting in Part 6. |
| 6.5 | Ethics, privacy and the data charter | 1,505 | **STRAT** | **Referenced 12× from elsewhere — the most cross-referenced target in the document** — and it is a governing commitment, not a data-layer detail. §6.5.5 (the sign-off gate) is a hard precondition on §6.2 and on any voter-file work. |
| 6.6 | Statutory and regulatory compliance | 1,137 | **DATA** | The legal envelope every plan sits inside: ECFA obligations, IEBC clearance checklist, offences liability. Currently the last thing in Part 6, read by almost nobody. |
| 7.1 | The scope of work | 485 | **STRAT** | What is being bought. This is the *offer*, filed at word ~38,000. |
| 7.2 | The team and how it is structured | 915 | **EXEC** | Core/surge, reporting lines, cadence. Forward-references §9.2 tiers it depends on. |
| 7.3 | Leadership roles and governance rhythm | 1,203 | **EXEC** | Lean-model justification (STRAT) + roles and cadence (EXEC). Overlaps §7.2.4–.5 and §9.3.1. |
| 8.1 | The headline scorecards | 819 | **OBJ** | **The document's objectives, at word ~41,000.** Two staged scorecards. This is the answer to "what are we buying", positioned as a measurement appendix. |
| 8.2 | What we measure, and why | 1,857 | **OBJ** | OBJ + EXEC. §8.2.3 is the KPI framework anchored to the threshold — pure OBJ. §8.2.1–.2 are research programme (EXEC). |
| 8.3 | The phased plan | 1,423 | **EXEC** | The delivery timeline. Contains each phase's objective, so OBJ is scattered here too. |
| 8.4 | The Kitui message lab | 469 | **EXEC** | Testing apparatus. §8.4.1 is a DED about metric bias that belongs with §3.1's ceiling argument. |
| 8.5 | The public service-delivery tracker | 714 | **STRAT** | **Misfiled.** §8.5.5 says what it is worth to the campaign — this is a differentiating strategic asset presented as a measurement tool, at the end of Part 8. |
| 9.1 | What the campaign gets | 800 | **OBJ** | Objectives by timeline, explicitly traceable to nomination share and the ~200,000 threshold. **The clearest OBJ statement in the document, and it is in Part 9.** Substantially overlaps §8.1. |
| 9.2 | Budget tiers and unit economics | 2,056 | **EXEC** | Ceiling, unit economics, three tiers, spend tracking. §9.2.1 is DATA (the gazetted ceiling) and duplicates §3.3.3 and §6.6.1. |
| 9.3 | Working together, and what happens next | 1,165 | **EXEC** | Ways of working + the ask. §9.3.7 is the close. |

**Layer totals:** OBJ 3 · DATA 5 · DED 6 · STRAT 12 · EXEC 24. Sections straddling two or more
layers: **19 of 50**.

---

## 2. Scatter analysis

### 2.1 Where each layer currently lives

| Layer | Every location it appears | Verdict |
|---|---|---|
| **OBJ** | §8.1, §8.1.1, §8.1.2, §8.2.3, §8.3 (per-phase objectives ×6), §9.1, §9.1.1, §9.1.2, §6.4.4, plus nine free-standing KPI blocks: §3.5.6, §3.7.5, §4.3.6, §4.4.5, §4.5.4, §8.4.5, §8.5.7 | **Objectives appear in 4 of 10 parts and nowhere in the first 33,000 words.** The two fullest statements (§8.1, §9.1) are near-duplicates of each other, 5,000 words apart. |
| **DATA** | §1.1, §1.2 (×10), §1.3.2, §3.4.1, §5.3.1, §5.4.5, §6.6, §9.2.1, plus inline evidence in §2.3 and §2.1.1 | Mostly consolidated in Part 1 — the document's biggest structural success. Four leaks: the radio ownership map (§3.4.1), the statutory envelope (§6.6, §9.2.1), the threat model (§5.3.1), the rival field (§5.4.5). |
| **DED** | §0.1, §0.3, §1.3, §1.4, §2.4, §3.1, §3.4.2, §4.3.1, §8.4.1 | **Split across three parts.** The two most load-bearing deductions in the proposal — the ~200,000 threshold (§1.3) and the digital ceiling (§3.1) — are 20,000 words apart and neither cites the other at the point of use. |
| **STRAT** | §0.2, §0.4, §2.1, §2.2, §2.3, §2.5, §2.6, §2.8, §3.7, §6.5, §7.1, §8.5 | Nominally Part 2, but §6.5 (the charter), §7.1 (the offer), §8.5 (the tracker) and §0.4 (the delivery model) are strategy filed under data, delivery, measurement and framing respectively. |
| **EXEC** | §2.7, §2.9, §3.2, §3.3, §3.5, §3.6, §4.1–4.5, §5.1–5.4, §6.1–6.4, §7.2, §7.3, §8.2.1–.2, §8.3, §8.4, §9.2, §9.3 | 24 sections, ~29,000 words, spread across seven parts with no internal ordering principle. Parts 3, 4, 5 and 6 are four parallel execution tracks presented as a sequence. |

### 2.2 Facts stated more than once in a different context

Counted mechanically: every §X.Y containing each figure.

| Fact | Sections | Where |
|---|---|---|
| ~200,000 vote threshold | **14** | §1.2, §1.3, §2.1, §3.1, §3.3, §6.1, §6.3, §6.4, §7.3, §8.1, §8.2, §8.3, §9.1, §9.2 |
| 86.4% offline / ~86% | **13** | §0.3, §1.2, §1.3, §2.1, §2.4, §2.5, §3.1, §3.5, §3.7, §4.1, §8.2, §9.1, §9.3 |
| Gazette 12251 / 7 Aug 2026 | **10** | §0.1, §0.3, §1.2, §1.3, §3.3, §6.1, §6.5, §6.6, §9.1, §9.2 |
| 532,758 registered voters | **10** | §1.2, §1.3, §2.4, §2.6, §3.1, §3.3, §3.4, §6.1, §8.2, §9.2 |
| 13.6% internet use | **9** | §1.2, §1.3, §2.4, §3.1, §3.3, §4.3, §7.1, §8.4, §9.2 |
| KSh 13.79bn county envelope | **8** | §1.2, §2.1, §2.2, §2.3, §2.6, §2.8, §3.2, §7.1 |
| 22.1% Mulu poll share | **6** | §0.1, §1.1, §1.3, §6.1, §9.1, §9.3 |
| 37.4% Kasalu poll share | **6** | §0.1, §1.1, §1.2, §1.3, §6.1, §9.3 |
| 15.3-point deficit | **5** | §0.1, §0.4, §1.1, §1.3, §9.1 |
| 1,136,187 county population | **4** | §1.2, §1.4, §4.3, §9.1 |
| KSh 97,560,000 ceiling | **3** | §3.3, §6.6, §9.2 |
| 143,340 internet users · 452,948 phone owners | **2** each | §1.2, §4.3 |

The pattern the brief predicted holds and is worse than stated: the connectivity figures recur
across §1.2, §2.4.2, §3.1, §4.3 and §8.4 — five separate sections each re-deriving the offline
majority from scratch, because none of them can assume the reader has retained it. **Repetition
here is a symptom of ordering, not of redundancy.** Each restatement is load-bearing *given the
current order*; cutting them without fixing the order would make the document worse.

### 2.3 The cross-reference graph as evidence

173 prose "Section N.N" references, 82 distinct targets. The most-cited targets:

| Target | Cited | What that means |
|---|---|---|
| §6.5.4 Digital Ethics and Data Charter | **12** | A governing constraint invoked from §2.5, §2.8, §2.9, §4.4, §4.5, §6.2 and elsewhere — filed 33,000 words in, inside a section about data infrastructure. |
| §8.5 Service-delivery tracker | **11** | Referenced from Part 6 as a stack component and from Part 2 as a proof point, but defined in Part 8. |
| §6.5.5 Compliance sign-off gate | **9** | A hard precondition on all voter-file work, defined *after* the section (§6.2) it gates. |
| §3.5 Journalists/debates | 8 | — |
| §8.4 Message lab, §4.2 field loop | 7 each | — |

**A section cited nine or twelve times from across the document is not a subsection. It is a
foundation, filed as a detail.** The cross-reference count is the most objective evidence in
this audit that the current order is wrong — the author has already had to route around it 173
times.

---

## 3. The three most damaging structural faults, by reader confusion caused

### Fault 1 — The objectives do not exist until §8.1, and then exist twice

The reader's first question is "what am I buying and what will it achieve". The document
answers it at word ~41,000 (§8.1 scorecards) and again at word ~45,000 (§9.1 objectives), in
two overlapping statements 5,000 words apart, with nine further KPI blocks scattered through
Parts 3, 4 and 8. Everything before §8.1 is therefore read without a success criterion to
judge it against.

*Confusion caused:* every strategic choice in Parts 2–6 is unfalsifiable on first read. A
decision-maker with fifteen minutes reads 33,000 words of method and never reaches the target.
This is the fault that most directly costs Firefly the engagement, because the reader who stops
early stops before the ask.

### Fault 2 — The two decisive deductions are 20,000 words apart and neither points at the other

§1.3 derives the ~200,000-vote threshold. §3.1 derives the digital ceiling: 100% of every
connected voter in Kitui is ~72,000 reachable people, **125,549 short of the threshold**. That
second number is only meaningful *because of* the first, and together they are the entire case
for the offline-first architecture that Parts 3 and 4 spend 10,000 words describing.

They sit in different parts, under headings ("The arithmetic of winning", "The two-tier channel
architecture") that do not signal they are the same argument. §4.3.1 then re-derives the
conclusion a third time from the raw connectivity figures.

*Confusion caused:* the reader cannot see the load-bearing inference of the whole proposal
without holding two sections 20,000 words apart in working memory. On mobile, that is not a
reasonable ask. The consequence is that the offline investment — the most differentiated and
most expensive thing Firefly proposes — reads as an equity gesture rather than as the
arithmetic necessity it is.

### Fault 3 — Compliance and the ethics charter are load-bearing constraints filed as appendix material

§6.5.4 is cited 12 times, §6.5.5 nine, and §6.6 sets the legal envelope (gazetted ceiling,
IEBC clearance, offences liability) that bounds §3.3, §9.2 and every voter-file operation in
§6.2. All three sit at the end of Part 6 of a ten-part document.

The document knows this. §6.2 opens "**This entire section is conditional on the compliance
gate in Section 6.5.5**" — a section the reader has not yet reached. §3.7.4 is titled "Why this
sits in the strategy, not an annex". §2.5, §2.8, §2.9, §4.4 and §4.5 each carry a defensive
paragraph restating a charter commitment because they cannot rely on the reader having read it.
Six sections are doing the work that correct placement would do once.

*Confusion caused:* forward references the reader cannot resolve, and — worse commercially —
the campaign's strongest trust differentiator reads as boilerplate because it arrives where
boilerplate lives. For a Kenyan campaign in the DPA-2019 environment, the charter is a selling
point, not a disclaimer.

---

## 4. Two structural strengths that constrain the redesign

Recorded because they are load-bearing for Phase 4, not as praise.

1. **Part 1 is a genuine, consolidated evidence layer** — §1.1–§1.4, 8,449 words, with §1.3.6
   and §2.4.3 as explicit data-gaps registers and a three-tier provenance grading applied
   throughout. Any new architecture must preserve this consolidation rather than redistribute
   evidence back into the argument that uses it.
2. **The uncertainty marking is systematic, not decorative** — Tier 1/2/3 source grading,
   20 `[Insert…]`/`[Confirm…]` placeholders, `Not yet` in KPI baseline cells, and §1.1's
   opening admission that the poll mechanism is a single-source Tier 3 report. This is currently
   *quieter* than the brief assumes: there is no "baseline not yet measured" label as such.
   Phase 4 must raise its visibility, and must not let a top-down restructure smooth it away —
   answer-first ordering is exactly the pressure that erases hedges.
