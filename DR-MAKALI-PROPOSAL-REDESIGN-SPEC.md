# Dr. Makali Digital Campaign Proposal
## Comprehensive Proposal Redesign & Implementation Specification

**Prepared:** 14 September 2026
**Subject:** `github.com/Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-` · `dr-makali-digital-campaign.vercel.app`
**Basis of review:** repository at `cc839a4` (branch `claude/makali-proposal-redesign-r6szv7`), live production deployment fetched 14 September 2026 (`x-vercel-cache: HIT`, `x-matched-path: /`), and the supplied structural audit, verified claim by claim.
**Status of the supplied audit:** materially out of date. Corrections are recorded in §0 and carried through every section below.

---

## 0. Corrections to the supplied audit — read this first

The supplied audit was written against an earlier state of this document. Six of its load-bearing claims no longer hold. Implementing it as written would waste effort and, in two cases, would remove work that is already correct.

| Supplied audit claim | Verified state | Verdict |
|---|---|---|
| "Situation analysis runs to approximately 418 lines" | `public/content/situation.md` is **1,043 lines / 11,810 words** | **Wrong — 2.5× understated.** The problem is far worse than diagnosed |
| "Risk section is approximately 389 lines" | `public/content/risk.md` is **514 lines / 4,441 words** | **Wrong — understated** |
| "Governance section is approximately 241 lines" | `public/content/governance.md` is **308 lines / 2,679 words** | **Wrong — understated** |
| "Executive summary sits at position 2, behind a cover and a dashboard" — implying it should move to 1 | True as to position, but the inference is wrong. `summary.md` is a 6-minute read that opens on four paragraphs of candidate biography. Promoting it does not fix the landing page, because **the landing page's problem is not which section is second — it is that no section is the decision** | **Directionally right, prescriptively wrong** |
| "Addition: Contest in one view" — create a high-impact visual of polling rounds, gap, nomination window, vote threshold, registered voters | **Already built and already live.** `components/charts/DeficitGauge.tsx` renders "The contest, as measured": the 15.3-point gap, 22.1% vs 37.4%, the June→August widening of +4.2, the nomination window (29 Aug – 15 Nov 2026), the general election (10 Aug 2027, threshold ≈200,000), both published rounds as an accessible table with a Tier-2 source line. `components/charts/VoteFunnel.tsx` renders 532,758 → ~330,310 → ~200,000 | **Do not build. Promote, deduplicate and attach an ask to what exists** |
| "40% vs 55% — make the distinction explicit" | **Already done**, verbatim, at `measurement.md:6` | **Partially closed.** The residual defect is placement, not absence — see §13 |

Two audit claims verify exactly as stated and are upheld: **the ask is buried** (§1.1), and **"Budget tiers" contradicts the confidentiality language** (§1.6).

The audit's central diagnosis — *"the content is not necessarily the primary problem; the reading path is"* — is **half right and half dangerous**. The reading path is broken. But this document is also 52,144 words and a 4 hour 9 minute read, and no reordering rescues that. Treating this as a sequencing exercise would leave the largest defect untouched.

---

## 1. Executive Verdict

### Current maturity level

**Evidence and engineering: senior-practitioner grade. Decision architecture: unbuilt.**

This is not a weak proposal. It is an unusually rigorous one wearing the wrong container. The evidence discipline is better than most commercial consultancy work: a three-tier source taxonomy (`situation.md` §3.2.2) that is actually applied, named data gaps that refuse to be estimated (§3.4.6, §5.3, `assumptions.md` §15.1), a counter-evidence paragraph in §3.3.2 that argues *against* the campaign's own core diagnosis, and six build-time guards (`scripts/verify-*.mjs`) that mechanically enforce ward-register arithmetic, figure provenance, mount uniqueness, 837 legacy deep links and body-text immutability. All six pass on HEAD. I ran them.

That machinery is an asset, and much of this specification exists to route changes *through* it rather than around it.

What has not been built is the layer a principal actually uses: a decision instrument.

### The central structural problem

**The landing route is a cover page, and the cover page has no ask.**

`app/[[...slug]]/page.tsx:41` sets `const LANDING = "cover"`. I fetched the live root and read it end to end. In order, a reader arriving at `/` gets: the Wiper banner, a confidentiality marker, the H1, the section-name word cycler, five quick-jump chips, four dashboard metrics, six key facts, the deficit gauge, a vote funnel, a 3D terrain widget, the toolbar, a 19-row index, then `cover.md` — proposal identification, confidentiality terms, and a 300-word explanation of how the document is organised — then a second 16-row index, then a print-kit panel, then the footer.

At no point on that page is the reader told what decision they are being asked to make, by when, or what happens if they do not make it.

The ask exists. It is good. It is specific: approve the Phase −1 pivot, authorise deployment, integrate with the ground network, by **15 September 2026**. It sits in `nextsteps.md`, which is route 19 of 19, **249 minutes into the document**.

That is the whole diagnosis. Everything in §2 follows from it.

### Second-order problem: the document is a four-hour read

| Measure | Value |
|---|---|
| Total words, `public/content/*.md` | **52,144** |
| Reading time, as the site's own counter reports it | **249 minutes (4h 09m)** |
| `situation.md` alone | 11,810 words / **54 minutes** |
| Fenced ASCII box-drawing blocks | **83** |
| Lines inside those blocks wider than 60 characters | **1,333** (max width **115 chars**) |
| Markdown table rows | **556**, of which **172** exceed 90 characters |
| "SECTION X STRATEGIC TAKEAWAY" summary boxes | **11**, across 11 files |

The skip-link in `ClientPage.tsx:534` is commented *"skip 55,000 words of navigation chrome."* The codebase already knows.

### Strongest elements — preserve these, do not touch them

1. **The evidence tier system** (`situation.md` §3.2, `data/types.ts`, `components/markdown/TierBadge.tsx`). Rare and genuinely differentiating.
2. **Named data gaps.** §3.4.6, §5.3, §15.1's 17-item placeholder register. A proposal that says "we do not know this and will not estimate it" buys more trust than one that fills the hole.
3. **The falsifiable strategic hypothesis.** `roadmap.md` §9.1.1 states the recognition-deficit thesis, then commits to testing it in Week 1 *before* budget commits, and says what changes if it fails. `situation.md` §3.3.2 supplies the counter-evidence (Kasalu's 201,899 votes in 2022, above Malombe's winning 198,004). This is the single most credible passage in the document and it is currently invisible.
4. **The six build guards.** They make this repo safe to restructure.
5. **`DeficitGauge`, `VoteFunnel`, `KeyFactsStrip`.** Already the right components. Wrongly placed and duplicated, but right.
6. **The equal-ward policy fork** in §3.3.2 — Firefly names a live contradiction in the campaign's own platform, recommends a resolution, and hands the call back to the client. That is what senior advice looks like.

### Biggest weaknesses — what must change

Ranked, in §2. In one line each: no ask on the landing page; a four-hour read with no ten-minute path; six verified internal contradictions; segmentation that is demographic rather than strategic; a measurement section that bans vanity metrics the roadmap then targets; and commercial framing that survived its own excision.

### What success looks like after the redesign

- A principal on a phone, on mobile data, reaches the ask **in under 60 seconds** and understands the arithmetic behind it in under three minutes.
- The full evidence base is **still there, undiminished** — reachable in one tap, never in the way.
- Zero surviving internal contradictions; every one either fixed or explicitly flagged as an open campaign decision.
- Nothing on any page implies a commercial term, consistent with §1.2.
- Every prose change passes `bun run verify` with all six guards green.

---

## 2. Executive Decision Summary

**What the decision-maker needs to understand.** He is 15.3 points behind (Tier 2, Mizani Africa, 7 Aug 2026), the gap widened 4.2 points between June and August, the ticket will likely be settled by a countywide opinion poll rather than a delegate contest (Tier 3, unconfirmed), and his deficit is probably geographic rather than reputational — a hypothesis Firefly proposes to test in Week 1 before spending against it.

**What the proposal is asking for.** Approval of the Phase −1 pivot, deployment authorisation, ground-team integration, and a meeting inside fourteen days. Target decision date: **15 September 2026**.

**That date is tomorrow.** The cover is dated August 2026. Today is 14 September 2026. The proposal's own critical deadline expires as this review is delivered, and the site states it as live. This is a P0 content correction independent of everything else in this document (§15, row 1).

**Why the existing architecture creates friction.** The reader must traverse 249 minutes, 19 routes, 83 ASCII diagrams and four separate renderings of the same polling figure before encountering the request. The landing page presents *facts* where it needs to present a *decision*. A political principal does not read a consultancy document linearly; he scans the top, forms a judgement about seriousness, and either books the meeting or does not. The current top screen answers "is this thorough?" (emphatically yes) but never answers "what do you want from me?"

**What the proposed architecture changes.** One new route, `/decision`, becomes `/`. It carries the ask, the arithmetic, and the mandate, in that order, in roughly 700 words. The cover's identification and confidentiality content moves inside it as a compact block. Everything else keeps its current number, its current file, its current deep links and its current content. The document loses nothing; it gains an entrance.

**Why the new reading path is superior.** It matches how the decision is actually made. Under the current architecture a reader who stops after ten minutes has learned that Firefly is careful. Under the proposed one, a reader who stops after ninety seconds has the ask, the gap, the deadline and the cost of delay — and the remaining four hours become what they should always have been: the proof, available on demand, for the reader who wants it.

---

## 3. Current-State Architecture

Position = route order in `SECTIONS`, `lib/heading-slug.ts:31`. Length = `wc -l` / words. Read time = as the live site computes it.

| # | Section / file | Len | Read | Current purpose | Problem | Action | New # |
|---|---|---|---|---|---|---|---|
| 1 | `cover.md` | 67 / 455 | 3m | Identification, confidentiality, how to read | **Is the landing route.** Spends the highest-value screen in the document on housekeeping; §1.3's 300-word structure explainer is meta-content | **DEMOTE** — absorb §1.1/§1.2 into the new decision route as a compact block; delete §1.3 | inside 1 |
| — | *(none)* | — | — | — | **No decision route exists** | **ADD** `/decision` | **1** |
| 2 | `summary.md` | 68 / 1,182 | 6m | Mandate, governing constraint, operating conditions, commitments | Opens on four paragraphs of candidate biography before naming the constraint. §2.2's polling table now duplicates `DeficitGauge` | **COMPRESS + RESEQUENCE** — constraint first, biography second; drop the duplicate table | 2 |
| 3 | `situation.md` | 1,043 / 11,810 | **54m** | Nomination mechanism, evidence standard, candidate, county, ward arithmetic, zones, channel reach, media ownership | **Seven sections' worth of material in one route.** §3.2 (evidence standard) is methodology, not situation. §3.3.7–3.3.10 (audit record, drought, Mui Basin, legal cautions) are reference. 19 ASCII blocks | **SPLIT** into 3 (contest + arithmetic + terrain) and move methodology/reference to annex | 3 / A1 / A2 |
| 4 | `objectives.md` | 55 / 802 | 4m | Five commitments across two clocks | **Best-constructed section in the document.** Only defect: states 40.0% without the reconciliation that lives at `measurement.md:6` | **KEEP** + inline the 40/55 note | 4 |
| 5 | `audiences.md` | 172 / 2,154 | 10m | Six voter segments, sizing matrix, research gaps | Segments are livelihood categories, not strategic universes. Sizes sum to ~1.02–1.06M against a 532,758 register, with no statement that they overlap | **RESTRUCTURE** — add a universe layer above the segments | 5 |
| 6 | `approach.md` | 86 / 1,156 | 6m | Economist Governor claim, four pillars, six themes | **Strong, clean, zero ASCII.** The resource paradox in §6.1.2 is the sharpest argument in the proposal and is 6 sections deep | **KEEP** — surface §6.1.2 on the decision route | 6 |
| 7 | `messaging.md` | 481 / 4,878 | 23m | Narrative spine, message assignment, persuasion principles, language strategy | §7.1.2/§7.1.3 assignment grids are operational reference. 12 ASCII blocks, 214 over-wide lines | **COMPRESS + ANNEX** the grids | 7 / A3 |
| 8A–8D | `scope-*.md` | 1,574 / 13,224 | 62m | Workstreams 1–14 | **Four routes, no consolidated view.** A reader cannot see all fourteen workstreams on one screen anywhere | **ADD an index above them**, keep the four detail routes | 8 + 8A–8D |
| 9 | `roadmap.md` | 255 / 1,845 | 9m | Phases −1 to 3, coalition sequencing | Phase KPI tables target reach/followers/views that §11.2.3 bans | **KEEP + reconcile KPIs** | 9 |
| 10 | `deliverables.md` | 130 / 1,322 | 7m | Three scope levels, deliverables schedule | Labelled "Budget tiers" in navigation while its own text says these are "not price lists" | **KEEP + relabel navigation** | 10 |
| 11 | `measurement.md` | 310 / 3,206 | 15m | Scorecards, indicator framework, message lab | NW/GE scorecards are 110-char ASCII. §11.1.3 cross-references §3.3.3 for the vanity-metric doctrine; §3.3.3 is "The 2022 baseline, ward by ward" | **CONVERT + fix ref** | 11 |
| 12 | `governance.md` | 308 / 2,679 | 13m | Operating rhythm, cadence, decision rights, escalation, ethics charter | §12.2 carries **two conflicting cadence models**; the ASCII one governs the *campaign's* internal board and invoice approvals — outside Firefly's scope | **COMPRESS + DELETE the overreach** | 12 / A4 |
| 13 | `risk.md` | 514 / 4,441 | 21m | Rapid response, war room, cybersecurity, competitor monitoring, compliance | Longest after situation. §13.1.2 decision tree, §13.3.2 key specs, §13.4.2 tool lists are operational annex material | **COMPRESS to ~7m + ANNEX** | 13 / A5 |
| 14 | `structure.md` | 164 / 1,356 | 7m | Lean core model, roles, reporting lines | Opens on a 40-line ASCII org chart before any prose. Says "four-person core"; `deliverables.md` says "3-person core" three times | **KEEP + resolve contradiction** | 14 |
| 15 | `assumptions.md` | 106 / 956 | 5m | Dependencies, outstanding regulatory guidance, seven assumptions | **Excellent and badly placed.** The seven assumptions in §15.3 are the honest core of the proposal, 245 minutes in | **KEEP + surface §15.3 summary early** | 15 |
| 16 | `nextsteps.md` | 71 / 678 | 4m | Decision protocol and the ask | **The ask, at route 19 of 19.** Decision target date has expired | **PROMOTE (copy, not move) + re-date** | 16 |

---

## 4. Recommended Final Architecture

The principle: **two layers, one document.** A Decision Layer a principal can finish in ten minutes, and an Evidence Layer that proves every word of it. Nothing is deleted from the Evidence Layer except verified duplication and template filler.

### Decision Layer

**1 · The Decision** — `/` (new route, new file `public/content/decision.md`)
- **Question answered:** What am I being asked to approve, and by when?
- **Content:** One-sentence ask. Decision date + cost of delay (3 bullets, from `nextsteps.md` §16.1 III). The deficit and the window as two figures. The recommended scope level (Standard) in one line. Confidentiality marker + "Prepared for / Prepared by" as a compact block (from `cover.md` §1.1/§1.2). A single primary CTA.
- **Remove:** `cover.md` §1.3's structure explainer — the navigation is the structure.
- **Visual:** `DecisionPanel` (restored, corrected), then `DeficitGauge` beneath it.
- **Mobile length:** ~700 words, **≈2 screens.**
- **Placement:** Main proposal. This route *is* the proposal for 70% of readers.

**2 · Contest in One View** — `/contest`
- **Question:** How bad is it, how long have we got, and what is the winning number?
- **Content:** As specified in §6 below.
- **Visual:** `DeficitGauge` + `ElectoralTimelineChart` + `VoteFunnel`, one accessible table each.
- **Mobile length:** ~350 words + 3 visuals, **≈3 screens.** Annex: no.

**3 · Executive Summary** — `/summary` (§2, resequenced)
- **Question:** What is the mandate and what governs it?
- **Content order changes to:** governing constraint → the three operating conditions → the candidate's distinguishing asset (M&E) → what Firefly commits to.
- **Remove:** the §2.2 polling table (now `DeficitGauge`'s job); two of the four biography paragraphs.
- **Mobile length:** 800 words, **≈4 screens** (from 1,182 / 6m).

**4 · What We Will Run** — `/scope` (new index route; §8 detail routes stay)
- **Question:** What exactly am I buying?
- **Content:** The consolidated fourteen-workstream table in §7 below, plus the explicit exclusions list (currently absent).
- **Mobile length:** ~600 words + card stack, **≈4 screens.**

**5 · The Ask** — `/nextsteps` (§16, unchanged position, re-dated)
- Kept at the end as the close. Identical content to route 1's ask so the document opens and shuts on the same request.

### Evidence Layer (order and numbering unchanged)

| # | Route | Purpose | Change | Target read |
|---|---|---|---|---|
| 5 | `/situation` | The contest, the candidate, the arithmetic | Split; §3.2 and §3.3.7–3.3.10 to annex | 54m → **22m** |
| 6 | `/objectives` | Five commitments, two clocks | Inline the 40/55 reconciliation | 4m (unchanged) |
| 7 | `/audiences` | Voter universes, then segments | Add universe layer (§9) | 10m → 12m |
| 8 | `/approach` | Governing claim, pillars, themes | Unchanged | 6m |
| 9 | `/messaging` | Narrative spine and discipline | Assignment grids to annex | 23m → **12m** |
| 10 | `/scope-platforms` … `/scope-data` | Workstreams 1–14 | Takeaway boxes removed; ASCII converted | 62m → **48m** |
| 11 | `/roadmap` | Five phases | KPI reconciliation | 9m |
| 12 | `/deliverables` | Scope levels + schedule | Relabel nav only | 7m |
| 13 | `/measurement` | Scorecards and research | Scorecards → `KpiScorecards`; fix §3.3.3 ref | 15m → **11m** |
| 14 | `/governance` | Decision rights, escalation, ethics | Delete the campaign-governance overreach; cadence → one table | 13m → **7m** |
| 15 | `/risk` | Rapid response, security, compliance | Operational protocols to annex | 21m → **8m** |
| 16 | `/structure` | Team shape | Org chart → component; resolve 3-vs-4 | 7m |
| 17 | `/assumptions` | Dependencies and the seven assumptions | Unchanged content, surfaced earlier | 5m |

### Annex Layer — `/annex` (new route, collapsed by default)

| Annex | Source | Why it moves |
|---|---|---|
| **A1** Evidence standard and source tiers | `situation.md` §3.2 | Methodology. Belongs where a sceptic can check it, not in the narrative |
| **A2** County reference: audit record, drought, Mui Basin, legal cautions | `situation.md` §3.3.7–3.3.10 | Background. Supports the argument; is not the argument |
| **A3** Message assignment grids | `messaging.md` §7.1.2, §7.1.3 | Production reference for the studio |
| **A4** Meeting cadence and escalation protocol | `governance.md` §12.2, §12.4 | Contract schedule material |
| **A5** Rapid-response decision tree, security baseline, monitoring tools | `risk.md` §13.1.2–13.1.4, §13.3.2–13.3.4, §13.4.2 | Runbooks. A principal approves *that* they exist |

**Target after redesign: Decision Layer ≈ 11 minutes; Evidence Layer ≈ 130 minutes; Annex ≈ 105 minutes.** Nothing is lost. The four-hour document becomes an eleven-minute document with four hours of proof behind it.

---

## 5. New Reading Path

### SCREEN 1 — The ask (0–15 seconds)

**Sees:** Confidential marker. "Campaign Strategy & Digital Architecture Proposal — Hon. Dr. Benson Makali Mulu, Kitui County." Then, at H1 weight:

> **We are asking for approval to run a Phase −1 nomination sprint, and a meeting to agree it.**

Beneath: one line of deficit (`15.3 points behind · Mizani Africa, 7 Aug 2026 · Tier 2`), one line of window (`Nomination decision expected Q4 2026`), one primary button.

**Understands:** This is a request, not a report. Somebody wants something specific from me.
**Prepares:** The whole decision.
**Why here:** Because every reader reaches screen 1 and roughly a third reach screen 4. Currently screen 1 carries a confidentiality notice.

### SCREEN 2 — The cost of delay (15–45 seconds)

**Sees:** Three bullets from `nextsteps.md` §16.1 III, re-dated: the ticket is the gateway to the governorship; the leader is growing three times faster; missing the window ends the candidacy before the general election. Then the decision date and a one-line "what happens on approval".

**Understands:** Why the answer cannot be "later."
**Prepares:** Urgency, honestly earned — every clause is sourced.
**Why here:** Cost of inaction is the most persuasive content in the document. It is currently at minute 246.

### SCREEN 3 — The arithmetic (45 s – 3 min)

**Sees:** `DeficitGauge`. 22.1 vs 37.4, the gap counting up, the June→August widening of +4.2, the nomination window and the general election threshold as two chips, and both published rounds as a table with its Tier-2 source line.

**Understands:** The problem is measured, not asserted. The people who wrote this show their numbers and label their confidence.
**Prepares:** Belief that the diagnosis is real.
**Why here:** This is the component that already exists and already works. It just needs an ask above it.

### SCREEN 4 — The winning number (3–4 min)

**Sees:** `VoteFunnel` — 532,758 registered → ~330,310 expected ballots at the 62.0% participation baseline → ~200,000 to win, with 198,004 (2022) as the benchmark rule.

**Understands:** Two contests, two numbers, two clocks.
**Prepares:** The two-stage objectives in §4.

### SCREEN 5 — The insight (4–6 min)

**Sees:** The resource paradox (`approach.md` §6.1.2) in three lines — KSh13.79bn envelope against KSh670m unconfirmed balances, KSh1.09bn uncollected revenue, KSh1.3bn pending bills — and one line: *Kitui has resources; what it lacks is verified deployment, and the candidate is a certified M&E specialist.*

**Understands:** Why *this* candidate, not just why *a* candidate.
**Prepares:** The Economist Governor positioning.
**Why here:** This is the proposal's actual strategic insight and it is currently at minute 83.

### SCREEN 6 — The honest caveat (6–7 min)

**Sees:** A short callout: the recognition hypothesis, the counter-evidence against it (Kasalu's 201,899 votes in 2022, above the winning threshold), and the commitment to test it in Week 1 before significant spend.

**Understands:** These people will tell me when they might be wrong.
**Prepares:** Trust — the scarcest commodity in a consultancy pitch.
**Why here:** Placing the strongest counter-argument *before* the sell is the single highest-leverage credibility move available, and the material already exists in `situation.md` §3.3.2 and `roadmap.md` §9.1.1.

### SCREEN 7 — What we will run (7–11 min)

**Sees:** Fourteen workstreams as five function groups, with the explicit exclusions beneath. Recommended scope level: Standard, one line of why.

**Understands:** The shape and boundary of what is being bought.
**Prepares:** The scope-level decision.

### SCREEN 8 — The repeat ask (11 min)

**Sees:** The same ask as screen 1, plus what Firefly needs from the campaign (`assumptions.md` §15.1, corrected) and the meeting request.

**Why here:** A proposal opens and closes on the same request. Everything between is evidence.

**Below screen 8:** "The full proposal — 16 sections, the evidence behind every figure above."

---

## 6. "Contest in One View"

Already ~80% built. This specifies the finished article, marks the duplication to remove, and flags the one figure that must not be printed without qualification.

**Route:** `/contest` · **File:** `public/content/contest.md` (new, short) · **Components:** existing.

### Headline
> **Two contests. Two numbers. Eleven weeks between them.**

### Subheadline
> The nomination is decided first, by a countywide opinion poll the party has not yet confirmed. Everything in this proposal is sequenced against that.

### Metric hierarchy

**Tier A — the two figures the decision turns on** (largest type, side by side):

| | Figure | Label | Provenance |
|---|---|---|---|
| A1 | **15.3 points** | Deficit to the leader | Mizani Africa, 7 Aug 2026 · **T2** |
| A2 | **≈200,000** | Votes to win the general election | Derived from IEBC register · **T1** |

**Tier B — the clocks** (chips, one row, horizontally scrollable on mobile):

| Chip | Value | Provenance |
|---|---|---|
| B1 | Nomination window: **29 Aug – 15 Nov 2026** | `objectives.md` §4.1 · **T3 — see caveat** |
| B2 | Party decision expected: **[VERIFIED FIGURE REQUIRED — see contradiction C1, §13]** | `summary.md` §2.2 / `nextsteps.md` §16.1 disagree |
| B3 | General election: **10 August 2027** | Constitutional cycle · **T1** |
| B4 | Registered voters: **532,758** across 40 wards, 8 constituencies | IEBC ward register · **T1** |
| B5 | 2022 winning vote: **198,004** | IEBC declared result · **T1** |

**Tier C — the trend** (chart + table):

| Candidate | Jun 2026 | Aug 2026 | Change |
|---|---|---|---|
| Dr. Irene Kasalu | 31.3% | 37.4% | **+6.1** |
| Dr. Makali Mulu | 22.1%* | 22.1% | +1.9 |
| Charity Ngilu | Not polled | 17.0% | — |
| Sen. Enoch Wambua | 16.3% | 14.3% | −2.0 |
| **Deficit (Kasalu over Mulu)** | **11.1 pts** | **15.3 pts** | **+4.2** |

\*June figure is 20.2%. Both rounds: Mizani Africa, Tier 2, ±2.53% at 95% CI.

### Explanatory notes — mandatory, not optional

1. **On the mechanism.** Print directly beneath B1/B2, not in a footnote:
   > The opinion-poll mechanism is a **Tier 3 single-source report and is not confirmed by Wiper**. `situation.md` §3.1.2 sets out exactly what would confirm it; §3.1.6 sets out what changes if it becomes a delegate primary.

   This already exists and is well written. It must travel with the figures, because a reader who sees "29 Aug – 15 Nov 2026" in large type on a summary screen will treat it as a fixed date. It is not.

2. **On the trend.** `situation.md` §3.1.5 is explicit: *"The two data points available are statistically insufficient to project a positive trend."* Keep that sentence adjacent to the chart. The `PollingTrajectorySimulator` mounted at `summary-sec-2-2` invites exactly the extrapolation §3.1.5 forbids — **review it against §3.1.5 or re-label it as scenario modelling, not projection.**

3. **On the two thresholds.** One line: *40.0%+ is countywide public preference (§4.1). ≥55.0% is preference among sampled likely Wiper primary voters (NW-01). Different populations, not competing targets.* Move this up from `measurement.md:6`.

### Mobile treatment

- Tier A: two cards, side by side at 390px. Figure ≥ 36px, label ≤ 3 words.
- Tier B: horizontal chip row, `scroll-snap`, first chip fully visible with a peek of the second.
- Tier C: `DeficitGauge`'s existing opposed-column chart, then the table. Table becomes a **stacked definition list below 480px** — four rows of five columns will not fit.
- Every figure carries an inline `TierBadge`. Source lines set at `t-micro`, never hidden behind a tap.
- **Total budget: ≤ 3 screens at 390px.** If it exceeds that, cut Tier C's chart and keep the table.

### Duplication to remove

The polling figures currently render **four times** on the landing route: `Dashboard` (22.1%, deficit 15.3), `KeyFactsStrip` (15.3 points), `DeficitGauge` (the full treatment), and `DataVisualizations`' "The immediate contest" bar chart. Keep `DeficitGauge`. **Delete the poll card from `Dashboard` and the "The immediate contest" panel from `DataVisualizations`.** Repeating a figure three times does not reinforce it; it reads as a template that was filled in more than once.

---

## 7. "What We Will Run"

Fourteen workstreams currently live across four routes with no consolidated view. A reader cannot see the offer in one place. This is the index route.

### The consolidated table (desktop ≥ 1024px)

| Function | WS | What Firefly does | What the campaign receives | KPI / outcome | Level |
|---|---|---|---|---|---|
| **Owned** | 1 | Build and run owned platforms + the public service-delivery tracker | Live tracker, hardened site, NG-CDF integration | Tracker KPIs §8.2.7 | All |
| **Owned** | 2 | Content production and asset governance | Flagship video, daily social, Kikamba voice notes, asset library | Cadence §10.2 | All |
| **Owned** | 3 | AI-assisted creative and testing | Weekly test cycle, performance benchmarks | §8.4.4 benchmarks | All |
| **Owned** | 4 | Accessibility and inclusion | KSL on flagship content, plain-language versioning | §8.5.5 | **All — not a level** |
| **Earned/Paid** | 5 | Platform tactics and paid media | Ad flights, targeting plans, spend logs | §8.6 | All |
| **Earned/Paid** | 6 | Earned media, journalists, debates | Media training, debate playbook, pre-drafted lines | §8.7.6 | All |
| **Ground** | 7 | Ground-digital integration | 40 ward coordinator reporting loop, 4-hour intel→response | §8.8.4 rhythm | Std+ |
| **Ground** | 8 | Field-to-digital loop | Bidirectional sync, doorstep data governance | §8.9 | Std+ |
| **Ground** | 9 | **Offline reach: SMS, USSD, voice** | Consented SMS list, USSD menu, voice broadcast, agent network | **120,000 consented contacts §8.10.6** | **Std = all 40 wards** |
| **Ground** | 10 | Digital organising and volunteers | Volunteer tiers, management tooling | §8.11.5 | Std+ |
| **Data** | 11 | The data layer | Voter/supporter model, DPA 2019 compliance | §8.12.2 | All |
| **Data** | 12 | Predictive voter modelling | Scored voter file | §8.13.5 evaluation | **Std+ — gated on §8.13.7** |
| **Data** | 13 | Technology stack | Procured, documented, secured stack | §8.14.3 | All |
| **Data** | 14 | Analytics and attribution | Attribution model, offline conversion tracking, dashboards | §8.15.2 | Std+ |

### Mobile alternative — required below 768px

A 6-column table with prose cells is unreadable at 390px. **Render as five collapsible function groups**, using the existing `DisclosureGroup` component (`components/markdown/DisclosureGroup.tsx`):

```
▸ OWNED — 4 workstreams          [All levels]
▸ EARNED & PAID — 2 workstreams  [All levels]
▸ GROUND — 4 workstreams         [Standard unlocks all 40 wards]
▸ DATA — 4 workstreams           [Standard+, modelling gated on compliance]
```

Each group expands to cards: workstream number + title, one line of "what you receive", one KPI, one level chip. Two taps to any workstream, zero horizontal scroll.

### What is missing and must be added: the exclusions block

**The document never states what the digital function will not do.** The supplied audit flagged this and it verifies. Scope boundaries are claimed in `summary.md` §2.4 ("with their boundaries stated so that what is outside them is as clear as what is inside") but no such list exists. That sentence is currently unearned.

Add beneath the table:

> **Outside this scope**
> - Physical event logistics, staging, PA systems and transport — subcontracted by the campaign (§14 names the vendor classes)
> - Campaign finance administration, expenditure returns and IEBC financial compliance filing
> - Legal representation, election-petition work and the data-protection legal review itself (§12.5.5 — the campaign appoints the reviewer; Firefly builds to their sign-off)
> - Candidate scheduling, tour management and constituency office operations
> - Party-level negotiation with Wiper organs
> - Polling agent recruitment, accreditation and payment (Firefly builds the GE-03 tracking; the campaign supplies the agents)
> - Commissioning the nomination tracking poll — Firefly specifies the instrument (§3.1.3), the campaign commissions it
> - `[CAMPAIGN DECISION REQUIRED]` — anything else the campaign wishes to place outside scope before contracting

This is the single highest-value *addition* available. A principal evaluating a consultancy cares more about the boundary than the list, and a proposal that draws its own boundary reads as senior.

---

## 8. Section-by-Section Change Specification

### `cover.md` → absorbed into `decision.md`

**Current role:** Landing route. Identification, confidentiality, structure explainer.
**Problem:** Occupies the highest-value screen in the document with housekeeping. §1.3's 300-word structure explainer restates what the navigation already shows.
**Keep:** §1.1 identification block; §1.2 confidentiality paragraphs (legally load-bearing).
**Change:** Render §1.1/§1.2 as a compact grey block at the *foot* of the new decision route, not as a page.
**Move:** Nothing.
**Delete:** §1.3 entirely (300 words). Also delete the `ObjectivesIndex` "What this proposal covers" grid that renders below it — the toolbar index above it already lists all 16 sections. **The landing page currently carries the same index twice.**
**Add:** `Status: Proposal for discussion` stays, re-dated.
**Copy structure:** Ask (H1) → cost of delay (3 bullets) → figures → CTA → identification block.
**Visual:** `DecisionPanel` then `DeficitGauge`.
**Mobile:** Identification block collapses to a `<details>` below 768px.
**Implementation:** New `public/content/decision.md`; add `decision` to `SECTIONS` at index 0; `LANDING = "decision"` in `app/[[...slug]]/page.tsx:41`; keep `cover` as a live route so existing links resolve; add both to `FILES`.
**Priority: P0.**

---

### `summary.md`

**Current role:** Mandate, governing constraint, operating conditions, commitments.
**Problem:** Four paragraphs of candidate biography precede the constraint. The §2.2 polling table duplicates `DeficitGauge`. Language is the densest in the document ("clinical policy credentials", "forensic strategic analysis of Dr. Mulu's record identifies a highly powerful, under-utilized asset") — register that reads as consultancy performance rather than advice.
**Keep:** §2.2 governing constraint (the strongest passage). §2.3's three structural constraints. §2.4's commitments — especially *"It does not commit to an electoral outcome"*, which is exactly right.
**Change:** Resequence to constraint → conditions → candidate asset → commitments. Compress the biography from 4 paragraphs to 1.
**Move:** The polling table out (now `DeficitGauge`).
**Delete:** §2.3's opening sentence — "predictive voter modeling, behavioral persuasion heuristics, AI-driven creative optimization, gamified volunteer networks... multi-touch attribution, competitive signal intelligence" — eleven capabilities in one sentence. This is the most jargon-dense line in the proposal and it sits in the executive summary. Replace with the three constraints, which are the actual content.
**Add:** One line pointing to the Week 1 hypothesis test.
**Visual:** Keep `PollingTrajectorySimulator` only if re-labelled per §6 note 2.
**Mobile:** Target 800 words / 4 screens.
**Implementation:** `public/content/summary.md`; every changed line needs a `scripts/notation-rewrites.json` entry (see §17).
**Priority: P1.**

---

### `situation.md`

**Current role:** Seven distinct subjects in one 54-minute route.
**Problem:** The largest single obstacle in the document after the missing ask. 1,043 lines, 19 ASCII blocks, 273 over-wide lines.
**Keep:** §3.1 (nomination mechanism — excellent, especially §3.1.1's "that claim deserves to be stated plainly for what it is"). §3.3.1–3.3.2 (candidate and field, including the counter-evidence paragraph). §3.4 (ward arithmetic — the analytical core). §3.5 (three zones). §3.6 (channel reach). §3.7 (media ownership).
**Change:** Split into three routes: `/situation` (§3.1, §3.3.1–3.3.6), `/arithmetic` (§3.4, §3.5), `/reach` (§3.6, §3.7).
**Move to annex:** §3.2 entire (evidence standard → **Annex A1**); §3.3.7–3.3.10 (audit record, drought, Mui Basin, legal cautions → **Annex A2**).
**Delete:** The §3.2 "STRATEGIC TAKEAWAY" box. The Tri-Partite Provenance Mandate ASCII (§3.2.1) — it is an internal working rule, not client-facing content.
**Add:** A 5-line section lede on each of the three new routes.
**Visual:** All existing mounts retain their anchors; `verify-mounts.mjs` will confirm.
**Mobile:** 54m → three routes of ~8m, ~9m, ~5m.
**Implementation:** File split changes the `tabId` prefix on ~80 heading ids → **every one needs a `LEGACY_IDS` entry in `lib/heading-slug.ts`**, and `verify-deep-links.mjs` will fail the build until they exist. This is the largest single piece of work in the plan. Budget it properly.
**Priority: P1** (P2 if the deep-link work cannot be done carefully — a botched split is worse than a long route).

---

### `objectives.md`

**Current role:** Five commitments, two clocks, named owners, escalation triggers.
**Problem:** Essentially none. This is the best-constructed section in the document — every commitment has traceability, baseline, target, deadline, owner and escalation trigger, and where a baseline does not exist it says so and refuses to estimate.
**Keep:** All of it.
**Change:** Inline the 40.0% / 55.0% reconciliation currently at `measurement.md:6`, as a one-line note under §4.1's success definition.
**Delete:** Nothing.
**Add:** Nothing.
**Mobile:** Already fine — 4m, no ASCII, no wide tables.
**Priority: P1** (the reconciliation only).

---

### `audiences.md`

**Current role:** Six livelihood segments, a sizing matrix, three research gaps.
**Problem — two, both serious.**

*(a) The sizing matrix reads as six exclusive buckets and is not.* §5.2 lists ~507,000 rural smallholders, 80–105,000 agro-pastoralists, ~234,000 youth, ~26,000 urban MSMEs, 25–35,000 professionals and 150,000+ diaspora. That sums to **~1.02–1.06 million against a register of 532,758.** The segments overlap heavily — a 26-year-old smallholder in Mwingi is in segments 1 and 3 — and the matrix nowhere says so. It also mixes bases: "~507,000 (95.2% of county)" is 95.2% of the *register*, while `summary.md` describes the county as "95.2% rural" (a *population* share). One number, two denominators, no label.

*(b) There is no strategic segmentation at all.* "Persuadable" appears **once** in 52,144 words (`scope-data.md:204`); "core supporter" once, as an ASCII box label. There is no persuasion universe, no mobilisation universe, no base-hold definition, no soft-opposition category. The proposal segments by *who people are*, never by *what the campaign needs them to do*.

**Keep:** The six segments as a **channel-and-message** framework. They are well researched and they correctly drive channel selection.
**Change:** Add a universe layer *above* them (specified in §9).
**Add:** A one-line note on the matrix: *"Segments overlap and are not additive — a voter may sit in two or three. Sizes are order-of-magnitude planning figures, not a partition of the register."* And a base label on every percentage: *of register* or *of population*.
**Delete:** The §5.3 "STRATEGIC TAKEAWAY" box.
**Visual:** `AudienceSegmentationMatrix` (mounted at `audiences-sec-5-1`) gains a universe row. The §5.2 ASCII matrix (111 chars) → `InteractiveTable`.
**Mobile:** ASCII conversion removes 50 over-wide lines.
**Priority: P1** — this is a strategic gap, not a presentation one.

---

### `approach.md`

**Current role:** Economist Governor claim, four pillars, six themes.
**Problem:** Almost none. 86 lines, zero ASCII, zero wide tables, one clear argument per subsection. It is also the only section that explicitly disambiguates its own taxonomy (§6.2: four *campaign* pillars vs §7.1's three *message* pillars vs §8.3.1's four *content* pillars) — a genuine editorial service.
**Keep:** All.
**Change:** Nothing structural.
**Move:** Surface §6.1.2's resource paradox onto the decision route as a three-line callout (copy, not move).
**Add:** Tier labels on §6.3's six themes. Several theme evidence lines carry precise figures — "approximately 400,000 people rely on surface water", "approximately 613,000 cattle and 2,000,000 goats", "poultry in over 90% of households", "11.7% health insurance coverage", "25% child stunting", "13.0% never attended school", "national smartphone adoption at 63.7%" — **none of which carries a tier label or a source**, in a document whose §3.2.1 forbids exactly that. This is the largest concentration of unlabelled figures in the proposal. Either label them or mark them `Evidence required`.
**Priority: P1** for the tier labels — an unsourced figure in a proposal that advertises source discipline costs more than one in a proposal that does not.

---

### `messaging.md`

**Current role:** Narrative spine, message assignment by segment and channel, persuasion principles, language strategy.
**Problem:** 481 lines / 23 minutes, 12 ASCII blocks, 214 over-wide lines. §7.1.2 and §7.1.3 are production reference tables. §7.2.1 ("Framing true claims, transparently") and §7.2.3 (worked framing examples) are genuinely good and are buried behind them.
**Keep:** §7.1.1 (central claim + three message pillars), §7.2 entire, §7.3.1 (language-to-voter-to-channel mapping — strategically load-bearing given the Kikamba/Kiswahili/English split).
**Move to Annex A3:** §7.1.2, §7.1.3.
**Change:** §7.3.2–7.3.4 compress to one production-pipeline table.
**Delete:** Both "STRATEGIC TAKEAWAY" boxes.
**Add:** Nothing — the messaging framework is complete. It is over-documented, not under-developed.
**Mobile:** 23m → 12m.
**Priority: P2.**

---

### `scope-platforms.md` / `scope-media.md` / `scope-ground.md` / `scope-data.md`

**Current role:** Workstreams 1–4, 5–6, 7–10, 11–14.
**Problem:** 1,574 lines / 62 minutes across four routes, with **no consolidated view of the offer anywhere.** The supplied audit recommends merging these into one. **Do not.** 13,224 words on one route is unreadable, and each route currently maps to a coherent function. The defect is the missing index, not the split.
**Keep:** All four routes, all content, all mounts.
**Add:** The `/scope` index route specified in §7, including the exclusions block.
**Delete:** The four "STRATEGIC TAKEAWAY" boxes (one per file).
**Change:** Convert the 33 ASCII blocks to `InteractiveTable` / `DisclosureGroup` where `lib/ascii-diagram.ts` parses them losslessly; leave true diagrams in `DiagramViewer`.
**Mobile:** 62m → ~48m; the index gives a 4-minute path to the whole offer.
**Priority: P0** for the index route, **P2** for the ASCII conversion.

---

### `roadmap.md`

**Current role:** Phases −1 through 3, post-election, coalition sequencing.
**Problem:** **Its KPI tables contradict §11.2.3.** `measurement.md` §11.2.3 states the campaign "strictly excludes vanity metrics... follower counts, video views, impressions, and post likes... from all executive dashboards, reporting meetings, and vendor performance contracts." The roadmap's phase scorecards then target *Combined social reach* (400,000 → 1,000,000 → 3,000,000 → 5,000,000), *Engaged followers* (20,000 → 50,000 → 150,000 → 250,000) and *Viral content pieces (>100,000 views) ≥ 10*.

A principal who reads both notices. It is the kind of inconsistency that makes a reader wonder what else was assembled from parts.

**Keep:** The phase structure and windows. §9.1.1's hypothesis-test framing — the best passage in the document.
**Change — resolve the contradiction one of two ways:**
1. **Recommended:** re-label these rows as **operational diagnostics**, explicitly not performance indicators, in a visually distinct sub-table headed *"Tracked for optimisation, not reported as performance."* This preserves the operational utility (you cannot tune an ad account without reach data) and honours §11.2.3.
2. Delete the rows and replace with the consented-SMS-contact and ward-coverage rows already in the same tables — which are the genuinely victory-anchored measures.

Do **not** leave it as is.
**Move:** Surface §9.1.1's hypothesis-test paragraph onto the decision route (screen 6).
**Delete:** Nothing else. Zero ASCII blocks — one of only four clean files.
**Priority: P0** — this is a self-contradiction in the two sections a sophisticated reader compares.

---

### `deliverables.md`

**Current role:** Three scope levels, level comparison, deliverables schedule.
**Problem:** Navigation calls it **"Budget tiers"** (`ClientPage.tsx:170`) while §10.1.1 says *"These are levels of scope, not price lists... What it costs is a conversation for the meeting, not a page in a proposal"* and `cover.md` §1.2 says commercial terms *"appear nowhere in these pages."* Three statements, two of them contradicting the third, and the contradicting one is the most visible — a chip on the landing page.
**Keep:** Everything. §10.1.1's four-term disambiguation table (consented contacts ⊂ contact universe; verified supporters ⊂ pledged voters) is exemplary. The "Accessibility is not a service level" paragraph is a genuine differentiator and should be surfaced.
**Change:** Relabel the quick-link to **"Scope levels"**. Verify the same label in `MobileTOCModal`, `QuickNavCapsule` and any `tier`/`budget` string in components.
**Delete:** Nothing.
**Add:** Nothing.
**Priority: P0** — a one-line fix that removes a visible contradiction.

---

### `measurement.md`

**Current role:** Nomination and general-election scorecards, indicator framework, research programme, message lab.
**Problem — three.**
1. §11.1.1 and §11.1.2 are the **decision-relevant** KPI content and are rendered as 110-character ASCII tables. On a 390px phone these scale to roughly 3.5px per character. The reader must tap into a full-screen zoom modal to read the scorecards. Note the mitigation already in place: `AsciiDiagram`/`DiagramViewer` scale-to-fit rather than hiding overflow, which is good engineering — but scale-to-fit on a 112-column table still means unreadable-without-zoom.
2. §11.1.3 cites *"the foundational strategic doctrine established in Section 3.3.3"* for the vanity-metric position. **§3.3.3 is "The 2022 baseline, ward by ward."** The correct target is §11.2.3, in this same file.
3. §11.2.3's supporting claim — *"Over 60% of social media interactions on Eastern Kenya political content originate from non-resident diaspora users"* — carries **no source and no tier label**, in the section whose entire purpose is evidence discipline. Classification: **Unsupported.**

**Keep:** The NW-01…04 / GE-01…05 indicator set. It is well built and genuinely victory-anchored.
**Change:** Route both scorecards through the existing `charts/KpiScorecards` component (already imported at `MarkdownViewer.tsx:24` and mounted at lines 382/392 — **verify it is actually replacing the ASCII rather than rendering alongside it**). Fix the §3.3.3 → §11.2.3 reference. Label or remove the 60% claim.
**Move:** The 40/55 reconciliation at line 6 → copy into `objectives.md` §4.1.
**Delete:** Both "STRATEGIC TAKEAWAY" boxes.
**Priority: P0** for the broken reference and the unsourced 60%; **P1** for the scorecard rendering.

---

### `governance.md`

**Current role:** Engagement model, cadence, decision rights, escalation, ethics charter.
**Problem — the most serious governance defect in the document.** §12.2 contains **two different, unreconciled meeting models**:

- A markdown table: Firefly's operating rhythm — daily stand-up, weekly strategy sync, creative review, fortnightly ward champion call, monthly performance review, quarterly red-team. Correct, proportionate, and Firefly's to propose.
- An ASCII block, "CAMPAIGN LEADERSHIP GOVERNANCE CADENCE": a *different* set of four meetings — 07:15 Morning Standup chaired by the Campaign Manager, Monday 09:00–11:00 War Room with the candidate, Wednesday Vendor Review authorising **milestone invoice clearances**, and a Monthly Board reviewing **fundraising totals**.

The second model governs the **campaign's own internal affairs** — its board, its vendors, its invoices, its fundraising. A digital consultancy does not set its client's board calendar or approve its invoice cycle. This reads as overreach, it contradicts §12.1.2 ("What Firefly runs"), and it is the passage most likely to irritate a principal who notices it.

Its takeaway box also says **"four-person core steering team"**, while `deliverables.md` says "3-person core" three times and `data/tier-matrix.ts` encodes the same. `structure.md` §14.1 repeats "four-person core". **Unresolved 3-vs-4 contradiction across four locations.**

§12.3 references *"Paid spend reallocation within ceiling"* and *"spend exceeding ward ceiling"* — see the orphan-ceiling finding in §12 below.

**Keep:** §12.1.2 (what Firefly runs), §12.3 decision-rights table (clean, useful, correctly places the compliance gate), §12.5 entire — the Digital Ethics and Data Charter is a real differentiator and `nextsteps.md` correctly sells it as one.
**Delete:** The "CAMPAIGN LEADERSHIP GOVERNANCE CADENCE" ASCII block **entirely**. The "STRATEGIC TAKEAWAY" box.
**Move to Annex A4:** §12.2's remaining cadence table and §12.4's three-tier escalation protocol.
**Change:** Resolve 3-vs-4 (see §13, contradiction C2).
**Mobile:** 13m → 7m.
**Priority: P0** for the overreach deletion and the team-size contradiction.

---

### `risk.md`

**Current role:** Rapid response, war room, cybersecurity, competitor monitoring, statutory compliance.
**Problem:** 514 lines / 21 minutes — the second-longest route. The supplied audit's "compress + annex" verdict is correct and, if anything, understated. §13.1.2's four-tier decision tree, §13.1.3's response-time matrix, §13.1.4's pre-drafted holding positions, §13.3.2's account-security baseline, §13.3.3's phishing content and §13.4.2's tool list are **runbooks**. A principal needs to know they exist and are credible; he will never read them, and their presence in the main path signals that the proposal cannot tell strategy from operations.
**Keep in main proposal (~8 minutes):** §13.1 opening (what we monitor, how threats reach us); §13.1.5 (staying inside defamation law — a real liability question a candidate cares about); §13.3.5 (deepfake and manipulated-media protocol — live and specific to 2027); §13.4.1 (public sources only, and the line we do not cross — an ethics commitment, keep it prominent); §13.5 (statutory and regulatory compliance) and §13.5.1's IEBC clearance checklist.
**Move to Annex A5:** §13.1.2, §13.1.3, §13.1.4, §13.2.2, §13.2.3, §13.3.2, §13.3.3, §13.3.4, §13.4.2, §13.4.3.
**Delete:** The "STRATEGIC TAKEAWAY" box.
**Add:** A single risk-register table at the top of §13 — top five risks, likelihood, impact, owner, mitigation, link to annex. This is what a principal reads. It does not exist.
**Mobile:** 21m → 8m + annex.
**Priority: P1.**

---

### `structure.md`

**Current role:** Lean core delivery model, core team, surge roles, leadership, reporting lines.
**Problem:** Opens with a **40-line ASCII org chart before any prose** — the reader's first contact with the section is a drawing at 111 characters wide. Says "four-person core" (contradiction C2). §14.5's role table is 10 rows × wide cells.
**Keep:** The lean-core-plus-surge model. §14.4's phase/level-triggered surge activation is a genuinely good commercial structure — it means the client is not paying for a standing department.
**Change:** Move the org chart below §14.1's prose; render via `CampaignOrgChart` if it still exists, else `DiagramViewer`. Resolve 3-vs-4.
**Delete:** The "STRATEGIC TAKEAWAY" box.
**Add:** One line stating which roles are Firefly's and which are the campaign's. The current org chart mixes both (Campaign Manager, Field Ops Lead, subcontracted PA crews) without distinguishing them — the same category error as §12.2.
**Priority: P1.**

---

### `assumptions.md`

**Current role:** Dependencies, outstanding regulatory guidance, the seven assumptions.
**Problem:** Placement only. §15.3's seven assumptions — each stated with what moves in the plan if it fails — are the honest core of the proposal, and they sit at minute 245.
**Keep:** All. §15.1's 17-item placeholder register and the closing line *"Nothing in the last row is a number the campaign can supply today; each is set by the Week 1 baseline... and each is left open deliberately rather than filled with an estimate"* is the single most credible sentence in the document.
**Change:** Nothing internal.
**Add:** A three-line "what this depends on" summary on the decision route, linking here.
**Delete:** The "STRATEGIC TAKEAWAY" box (§15.2's, which duplicates content from §8.12 and §13.5).
**Priority: P2** (surface early), but note the **P0 dependency on `DecisionPanel`** — see §17.

---

### `nextsteps.md`

**Current role:** The decision protocol and the ask.
**Problem:** Position 19 of 19. And **the decision target date is 15 September 2026 — tomorrow.** The evaluation window is stated as "Late October – November 2026 (Q4 2026)", which contradicts `summary.md` §2.2 and `assumptions.md` §15.3 assumption 2, both of which say the decision falls *before* the final quarter of 2026 (contradiction C1, §13).
**Keep:** All content. §16.1's decision protocol and §16.2's ask are well written — §16.2 in particular ("a recognition problem concentrated outside his home constituency — the most solvable category of deficit there is") is the best-argued paragraph in the proposal.
**Change:** Re-date. Resolve C1.
**Move:** Copy §16.1's structure to the decision route. Keep here as the close.
**Add:** Nothing.
**Priority: P0** — an expired deadline on a live proposal is the most damaging single defect on the site today.

---

## 9. Content Transformation Map

| Existing content | Destination | Transformation | Reason |
|---|---|---|---|
| `nextsteps.md` §16.1 decision protocol | Decision route, screens 1–2 | Blockquote → ask headline + 3 cost-of-delay bullets | The ask must be first as well as last |
| `cover.md` §1.3 structure explainer (300 w) | — | **DELETE** | Navigation already shows structure |
| `ObjectivesIndex` grid on landing | — | **DELETE** | Second index on a page that already has one |
| `Dashboard` poll card (22.1%) | — | **DELETE** | 1 of 4 renderings of the same figure |
| `DataVisualizations` "The immediate contest" | — | **DELETE** | 2 of 4 renderings |
| `DataVisualizations` "Budget scenario" slider | — | **DELETE** | Commercial framing on the landing page; see §12 |
| `situation.md` §3.2 evidence standard | Annex A1 | Route move, content unchanged | Methodology, not narrative |
| `situation.md` §3.3.7–3.3.10 | Annex A2 | Route move | Background reference |
| `situation.md` §3.4 ward arithmetic | New `/arithmetic` route | Split | 54-minute route is not readable |
| `approach.md` §6.1.2 resource paradox | Decision route, screen 5 | 400 words → 3-line callout | The strategic insight, surfaced |
| `roadmap.md` §9.1.1 hypothesis test | Decision route, screen 6 | Paragraph → callout | Strongest credibility signal |
| `messaging.md` §7.1.2/§7.1.3 grids | Annex A3 | Route move | Production reference |
| 14 workstreams across 4 routes | New `/scope` index | Four routes → one table + 4 detail routes | No consolidated view exists |
| `measurement.md` §11.1.1/§11.1.2 ASCII | `charts/KpiScorecards` | 110-char ASCII → responsive cards | Decision-relevant content must be readable on a phone |
| `measurement.md:6` 40/55 note | Also `objectives.md` §4.1 | Duplicate forward | Reconciliation must sit where the figure first appears |
| `governance.md` §12.2 ASCII cadence | — | **DELETE** | Scope overreach into client governance |
| `governance.md` §12.2 table + §12.4 | Annex A4 | Route move | Contract schedule material |
| `risk.md` §13.1.2–13.1.4, §13.3.2–13.3.4, §13.4.2–13.4.3 | Annex A5 | Route move | Runbooks |
| 11 × "STRATEGIC TAKEAWAY" boxes | — | **DELETE all** | Template filler; 84–115 chars wide; duplicates adjacent prose |
| 83 ASCII blocks (net ~70 after deletions) | `InteractiveTable` / `DisclosureGroup` / `DiagramViewer` | Lossless parse where possible | 1,333 lines exceed mobile width |
| `audiences.md` §5.2 matrix | `AudienceSegmentationMatrix` + overlap note | ASCII → component + caveat | Sums to ~2× the register with no overlap statement |
| Absent | New exclusions block on `/scope` | **ADD** | §2.4 promises boundaries that do not exist |
| Absent | New risk register at §13 head | **ADD** | 514 lines of risk content with no summary |
| Absent | Voter universe layer above `audiences.md` §5.1 | **ADD** | No persuasion/mobilisation split anywhere |

---

## 10. Exact Navigation Architecture

### Proposed primary navigation

**Group 1 — DECIDE** *(new, always expanded, visually distinct)*
1. **The Decision** — the ask, the date, the cost of delay
2. **The Contest** — deficit, windows, winning number
3. **What We Will Run** — 14 workstreams, and what is excluded

**Group 2 — THE ARGUMENT** *(default expanded)*
4. Executive Summary · 5. Situation · 6. Vote Arithmetic · 7. Channel Reach · 8. Objectives · 9. Voter Strategy · 10. Strategic Approach · 11. Messaging

**Group 3 — THE WORK** *(default collapsed)*
12. Platforms & Content · 13. Publishing & Earned Media · 14. Ground & Offline · 15. Data & Technology · 16. Roadmap · 17. Scope Levels · 18. Measurement

**Group 4 — TERMS** *(default collapsed)*
19. Governance · 20. Risk · 21. Delivery Structure · 22. Assumptions · 23. Next Steps

**Group 5 — ANNEXES** *(default collapsed)*
A1 Evidence Standard · A2 County Reference · A3 Message Grids · A4 Cadence & Escalation · A5 Response Runbooks

### Label changes — exact

| Current | New | Why |
|---|---|---|
| **"Budget tiers"** (`ClientPage.tsx:170`) | **"Scope levels"** | Contradicts §1.2 and §10.1.1 |
| "Title and confidentiality" | *(remove from nav; absorbed)* | Not a section a reader navigates to |
| "Audience segmentation" | **"Voter strategy"** | Reflects the universe layer added in §9 |
| "Scope of work — platforms and content" | **"Platforms & content"** | 38 chars; truncates on mobile |
| "Scope of work — publishing and earned media" | **"Publishing & earned media"** | 43 chars |
| "Scope of work — ground and offline reach" | **"Ground & offline reach"** | 40 chars |
| "Scope of work — data and technology" | **"Data & technology"** | 35 chars |
| "Engagement and governance model" | **"Governance"** | 31 chars |
| "Messaging and narrative framework" | **"Messaging"** | 33 chars |
| "Deliverables schedule" | **"Deliverables"** | — |
| "Assumptions and dependencies" | **"Assumptions"** | — |

The four scope labels average 39 characters. At 390px in the bottom-nav current-section slot they truncate, so a reader in §8C sees "Scope of work — ground and…" — the prefix that all four share, and none of the word that distinguishes them. Group prefixes belong in the group heading, not repeated in four labels.

### Count reconciliation

The site currently says **"16 sections"** (toolbar index), **"1 of 19"** (footer), and **"sixteen sections"** (`cover.md` §1.3) for the same document. Pick one: parts or routes. **Recommendation:** count routes, and say "23 sections + 5 annexes" after restructuring. Drive both strings from `SECTIONS.length` so they cannot diverge again.

### Sticky navigation behaviour

- **Keep** the existing hide-on-scroll-down / show-on-scroll-up toolbar (`use-scroll-shell.ts`) — correct pattern, well implemented.
- **Add** a persistent CTA to the sticky bar on every route: a single accent pill, *"Book the meeting"*, anchored to the decision route. At present a reader who is convinced at minute 40 has no way to act without navigating to route 19. **This is the highest-value single UX change in the document** and is roughly 15 lines in `SectionStickyBar.tsx`.
- Keep `MobileBottomNav`'s index / settings / back-to-top triad. Add the CTA as a fourth item, or replace "back to top" with it.

### Mobile menu behaviour

- `MobileTOCModal` gains the five groups above, with Groups 3–5 collapsed on open. A 23-item flat list is a scroll; a 3-item expanded list with 4 collapsed groups is a glance.
- Quick-jump chips on the decision route become: **The ask · The contest · What we run · Scope levels · Next steps** — replacing the current five, which lead to §11.1, §3.4.1, §3.4.2, §10.1 and §3.7.1 (four of five land deep inside the evidence layer).

---

## 11. Visual Design and UX Recommendations

The design language is strong and largely correct. These are corrections within it, not a redesign.

**Hierarchy.** One H1 per route, and on the decision route the H1 must be the ask — not the candidate's name, not the document title. Currently the landing H1 is *"Kitui 2027: the operating system for an Economist Governor."* That is a good line and it is a *positioning* line, not a *decision* line. Demote it to the deck.

**Density.** Enforce one figure-dense element per screen. The landing route currently stacks 4 dashboard metrics + 6 key facts + a deficit gauge + a vote funnel + a 3D terrain widget = **14 figures before a single sentence of prose.** A principal reads that as a dashboard, not a proposal. Cut to: 2 headline figures (screen 1), the gauge (screen 3), the funnel (screen 4).

**Rhythm.** Alternate assertion → evidence → assertion. The current landing is evidence → evidence → evidence.

**Whitespace.** The scorecards and the fourteen-workstream table need vertical breathing room more than they need horizontal compression. Prefer a taller card stack to a denser table on mobile.

**Cards.** `SpotlightCard`/`TiltCard` are well built. **Restraint note:** pointer-tracked light and 3D tilt on a card carrying a 15.3-point deficit reads as celebration. Use flat surfaces for adverse figures and reserve the treated cards for the ask and the commitments.

**Data visualisation.** Keep `DeficitGauge`, `VoteFunnel`, `KpiScorecards`, `OfflineWaterline`, `WardCartogram`, `BenchmarkLadder`. Every chart needs three things it does not uniformly have: an accessible table equivalent (most have this), a visible `TierBadge`, and a one-line "what this shows" caption. Retire `DataVisualizations` entirely — both its panels are duplicative or out of scope (§12).

**Callouts.** Introduce exactly three, and use them sparingly: `ASK` (accent), `CAVEAT` (amber — for Tier 3 assumptions and named data gaps), `EVIDENCE REQUIRED` (outline). The document's credibility rests on visibly marking what it does not know; give that its own visual token.

**Comparison tables.** Below 768px, any table wider than 3 columns becomes a stacked definition list. This covers §10.1.2 (4 cols), §5.2 (5 cols), §14.5 (3 wide cols) and the new workstream table (6 cols).

**Timeline.** `ElectoralTimelineChart` and `PhaseRail` both exist and both work. Use `PhaseRail` on the roadmap only; use the timeline chips on the contest route. Do not run both on one screen.

**KPI components.** `KpiScorecards` should be the *only* renderer of NW-01…04 and GE-01…05. Verify it is not rendering alongside the ASCII original.

**Evidence labels.** `TierBadge` exists and is good. Apply the rule in §12: badge every figure in Decision-Layer and headline positions; source-line per subsection elsewhere.

**CTA treatment.** One primary action, one accent colour, present on every route via the sticky bar. Never two competing CTAs on a screen. The "Export PDF" print-kit panel currently sits where the ask should be on the landing page — demote it to the footer.

**Typography.** Current scale is sound. One change: figures in Tier A positions need ≥ 36px at 390px; `Dashboard`'s `text-2xl` (24px) is too small for a headline number and too large for a supporting one.

**Mobile interaction.** Keep `scroll-snap` chip rows, 44px minimum targets (already enforced), and `DiagramViewer`'s scale-then-zoom. **One fix:** `Dashboard` renders both the desktop grid (`hidden sm:grid`) and the mobile carousel (`block sm:hidden`) into the DOM — both sets of markup ship to every phone. For a proposal explicitly written for mobile-data readers (§2.3 constraint 1), render one.

---

## 12. Evidence, Sources and Credibility Framework

The taxonomy already exists and is applied more consistently than in most commercial work. What is missing is a *placement* rule and three corrections.

### The four visible states

| State | Token | Meaning | Example on site |
|---|---|---|---|
| **T1 Verified** | Solid accent badge | Named public institution: IEBC, KNBS, Auditor-General, Controller of Budget, Kenya Gazette | 532,758 registered voters; 198,004 (2022) |
| **T2 Credible** | Outline badge + `±CI` where published | Independent field research, reputable polls | Mizani Africa 37.4% / 22.1%, ±2.53% @ 95% |
| **T3 Assumption** | Amber badge | Single-source, unconfirmed, planning hypothesis | The opinion-poll nomination mechanism |
| **Evidence required** | Dashed outline | Named gap; deliberately not estimated | Mwingi sub-county recognition baseline |

### Placement rule — the missing piece

1. **Decision Layer:** every figure carries an inline badge. No exceptions. These are the figures a reader quotes.
2. **Evidence Layer:** one source line per sub-section (`ProvenanceLine`, already built), plus inline badges only on figures that are T3 or Evidence-required. Badging every T1 figure in a 54-minute route is noise.
3. **Annexes:** source line per section.
4. **Any T3 figure rendered in large type anywhere** must carry its qualification *adjacent*, never in a footnote. This currently fails for the nomination window on the landing page.

### Three corrections required

**(a) The orphan ceiling.** `components/DataVisualizations.tsx` renders, on the landing route, *"Allocated ad budget: 15–20% / 30–40% / 45–55% of verified ceiling."* These strings are **hard-coded in the component**, sourced from no data module and no content file. `scripts/verify-content-integrity.mjs` records that commit `5ff79ce` removed campaign finance and cost content **on the client's instruction** — including "the statutory ceiling, the unit economics, the cost-per-contact model." The defining content went; **six referring sites stayed**:

| Location | Text |
|---|---|
| `components/DataVisualizations.tsx:27,34,41` | "15–20% / 30–40% / 45–55% of verified ceiling" |
| `governance.md:106` | "Paid spend reallocation within ceiling" |
| `governance.md:107` | "Paid spend exceeding ward ceiling" |
| `risk.md:191` | "spend against ceiling" |
| `roadmap.md:202` | "Spend reconciled against IEBC ceiling — 100%, monthly" |
| `structure.md:75,77` | "an agreed monthly ceiling", "ward-level ceilings" |

So the document commits to spend governance against a ceiling it never defines, and the **landing page quotes a percentage of it**. This directly contradicts `cover.md` §1.2. **Fix:** delete the "Budget scenario" panel from `DataVisualizations` (P0); rewrite the five content references to "the agreed spend envelope" (P1). Also note `DataVisualizations`' tier copy is a **second, divergent source of truth** for content already canonicalised in `data/tier-matrix.ts` — retire the component.

**(b) `DecisionPanel` has drifted from its source.** `components/DecisionPanel.tsx` documents itself as *"§15.1 (what Firefly needs)... Nothing here is new."* Two of its eight items no longer match `assumptions.md` §15.1:

| `DecisionPanel.tsx` | `assumptions.md` §15.1 |
|---|---|
| "The verified expenditure ceiling from the gazette schedule" | "Current ward-level registration data from the IEBC published file" |
| "Sign-off on the budget tier so the team can be assembled" | "Sign-off on the service level so the team can be assembled" |

The ask component — the most important component on the site — reintroduces the exact commercial framing the client had removed. **P0.**

**(c) Unlabelled figures.** `approach.md` §6.3 carries seven precise statistics with no tier and no source (400,000 on surface water; 613,000 cattle; 2,000,000 goats; 90% of households with poultry; 11.7% insurance coverage; 25% child stunting; 13.0% never attended school; 63.7% smartphone adoption). `measurement.md` §11.2.3 carries the unsourced "over 60% of social media interactions... originate from non-resident diaspora." Classification: **Unsupported.** Label from `data/sources.ts` where a source exists; otherwise mark `Evidence required` and keep the argument, which does not depend on the precision.

---

## 13. Campaign Strategy Integrity Check

**The logic chain, tested link by link.**

| Link | State | Assessment |
|---|---|---|
| **PROBLEM** | Strong | 15.3-point measured deficit, widening. Stated without spin (§3.1.5 explicitly refuses to claim a positive trend from two data points) |
| **EVIDENCE** | Strong | T1 register arithmetic; T2 polling with CI; T3 mechanism honestly flagged; gaps named |
| **INSIGHT** | **Strong but buried** | "The deficit is geographic, not reputational" — with counter-evidence acknowledged and a Week 1 falsification test. Sits at minutes 62 and 177 |
| **STRATEGY** | Strong | Economist Governor + verification credential + offline-first reach. The resource paradox (§6.1.2) is the sharpest argument in the document |
| **EXECUTION** | **Over-specified** | 14 workstreams, 13,224 words, no consolidated view, no exclusions |
| **MEASUREMENT** | **Internally contradictory** | §11.2.3 bans vanity metrics; §9.1 targets reach, followers and viral views |
| **DECISION** | **Broken** | The ask is at route 19, the decision date has expired, and no CTA exists on any other route |

**The weakest link is the last one, and it is the only one that matters to the outcome.** The chain is sound from Problem through Strategy. It frays at Execution (volume without boundary) and breaks at Decision.

### Situation → Objective → Audience → Message → Channel → Execution → Field → Measurement → Risk → Decision

| Connection | Status |
|---|---|
| Situation → Objective | **Connected.** Every commitment in §4 traces to poll share or the vote threshold, explicitly |
| Objective → Audience | **Broken.** §4 objectives are about countywide preference and a 200,000-vote universe. §5 segments are livelihood categories. Nothing maps one to the other — no segment carries a share of the 200,000, and no objective names a segment |
| Audience → Message | **Connected.** §7.1.2 assigns messages by segment |
| Message → Channel | **Connected.** §7.1.3 and §7.3.1 are thorough |
| Channel → Execution | **Connected.** §8's fourteen workstreams map cleanly to channels |
| Execution → Field | **Connected.** §8.8/§8.9 are the strongest integration content in the document — the 4-hour intel-to-published-response loop is concrete and credible |
| Field → Measurement | **Connected.** GE-01 to GE-05 are field-anchored |
| Measurement → Risk | Connected |
| Risk → Decision | **Broken.** The risk section never states what the campaign must decide in response to any risk |
| Decision → Situation | **Broken.** The ask does not close the loop back to the arithmetic that justifies it |

**Two structural breaks: Objective → Audience, and Risk → Decision.** The first is fixed by the universe layer (§9 / audiences spec). The second by the risk register (§8 / risk spec).

### The six verified contradictions

| ID | Contradiction | Locations | Fix | P |
|---|---|---|---|---|
| **C1** | Nomination timing. "Decision falls **before** the final quarter of 2026" vs "Evaluation Window: **Late October – November 2026 (Q4 2026)**" vs "nomination window 29 Aug – **15 Nov 2026**" vs "polling window commences in **late October**" | `summary.md` §2.2; `assumptions.md` §15.3(2); `nextsteps.md` §16.1 II; `objectives.md` §4.1 | Adopt one window. Recommended: **"expected Q4 2026, date not controlled by the campaign"**, flagged T3, everywhere | **P0** |
| **C2** | Core team size. "**four-person** core" vs "**3-person** core" ×3 + `data/tier-matrix.ts` | `governance.md` §12.2; `structure.md` §14.1 vs `deliverables.md` §10.1.1/§10.1.2 | Likely *Firefly's* 3-person core vs the *campaign's* 4-person command. **State which is which** — do not just pick a number | **P0** |
| **C3** | Vanity metrics. §11.2.3 bans them; §9.1 targets reach 400k→5m, followers 20k→250k, viral views >100k | `measurement.md` §11.2.3 vs `roadmap.md` §9.1 | Re-label roadmap rows as operational diagnostics, explicitly not performance indicators | **P0** |
| **C4** | Commercial terms. "appear nowhere in these pages" vs nav label "Budget tiers" vs landing-page "% of verified ceiling" | `cover.md` §1.2; `ClientPage.tsx:170`; `DataVisualizations.tsx:27,34,41` | Relabel to "Scope levels"; delete the budget panel | **P0** |
| **C5** | Section count. "16 sections" vs "1 of 19" vs "sixteen sections" | Toolbar; footer; `cover.md` §1.3 | Drive both from `SECTIONS.length` | **P1** |
| **C6** | Segment arithmetic. Six segments sum to ~1.02–1.06M against a 532,758 register, presented as a partition; "95.2%" applied to register in one place and population in another | `audiences.md` §5.2; `summary.md` §2.3 | Add overlap note; label every base | **P1** |

Plus one broken cross-reference: `measurement.md` §11.1.3 cites §3.3.3 for the vanity-metric doctrine; the correct target is §11.2.3. **P0** (one word).

---

## 14. Risk and Governance Redesign

### Stays on the main site (target ≈ 8 minutes for risk, ≈ 7 for governance)

**Risk**
- New: **risk register** — five rows. Likelihood / impact / owner / mitigation / annex link. Candidates from existing content: nomination mechanism changes to a delegate primary (§3.1.6); the recognition hypothesis is refuted by the Week 1 lab (§9.1.1); ODPC guidance prohibits the planned SMS approach (§15.2); a manipulated-media attack lands inside the nomination window (§13.3.5); the data-protection reviewer is not appointed in time (§12.5.5, §15.1 row 4 — the named long-lead item).
- §13.1 opening (what we monitor, escalation path in one line)
- §13.1.5 defamation boundaries
- §13.3.5 deepfake protocol
- §13.4.1 the monitoring line we do not cross
- §13.5 statutory compliance + §13.5.1 IEBC clearance checklist

**Governance**
- §12.1.2 what Firefly runs (with a matching "what the campaign runs" column — currently implicit)
- §12.3 decision-rights table, with the compliance gate kept prominent
- §12.5.4 the Digital Ethics and Data Charter — **keep in full and keep prominent.** `nextsteps.md` correctly identifies it as a differentiator; it is the most defensible competitive claim in the proposal
- §12.5.5 the compliance sign-off gate — this is a *decision* the campaign must make, and it belongs in the Decision Layer's dependency list

### Moves to annex

A4: §12.2 cadence table, §12.4 escalation protocol.
A5: §13.1.2 decision tree, §13.1.3 response times, §13.1.4 holding positions, §13.2.2–13.2.3 tools and message library, §13.3.2–13.3.4 security baseline / phishing / incident response, §13.4.2–13.4.3 monitoring tools and outputs.

### Deleted

The "CAMPAIGN LEADERSHIP GOVERNANCE CADENCE" ASCII block (§12.2) in full — see §8 for the reasoning. Firefly does not set the client's board calendar, chair its vendor reviews or authorise its invoice clearances, and proposing to do so undercuts the §12.1.2 boundary the proposal draws elsewhere.

### Decision rights — the missing column

§12.3 lists approvers and turnarounds but never states **who owns the decision when Firefly and the campaign disagree.** Add one line: *"Where Firefly's recommendation and the campaign's direction diverge, the campaign decides and Firefly records the recommendation in the weekly log."* That is both honest and protective, and it is the kind of clause a principal's advisor looks for.

### Cybersecurity — proportionality

Currently proportionate in substance, disproportionate in placement. Hardware-key 2FA on day one (§9.1.1) and the deepfake protocol are correct for a 2027 Kenyan county race. The phishing-awareness content and account-security baseline are staff training material. Annex them; keep the commitments.

### Compliance

Correctly identified and correctly prioritised: DPA 2019 (§8.12.2), the ODPC open item (§15.2), election-offence liability (§13.5.2), and the §12.5.5 gate. **The gate is a dependency with a long lead time and it should appear on the decision route**, not only at minute 245. It is one of the few things that can delay the whole engagement.

---

## 15. Proposal Content Cut List

| Content | Action | Why |
|---|---|---|
| `nextsteps.md` §16.1 decision date "15 September 2026" | **REWRITE** | Expires tomorrow. A live proposal with a lapsed deadline reads as abandoned |
| `DecisionPanel.tsx` — "verified expenditure ceiling" / "budget tier" items | **REWRITE** | Contradicts `cover.md` §1.2 and its own source §15.1 |
| `ClientPage.tsx:170` "Budget tiers" | **REWRITE** → "Scope levels" | Same contradiction, most visible instance |
| `DataVisualizations.tsx` "Budget scenario" panel | **DELETE** | Commercial framing on the landing page; cites an undefined ceiling; duplicates `data/tier-matrix.ts` divergently |
| `DataVisualizations.tsx` "The immediate contest" chart | **DELETE** | 4th rendering of the same polling figures |
| `Dashboard.tsx` poll metric card | **DELETE** | 3rd rendering |
| `Dashboard.tsx` duplicate desktop+mobile markup | **MERGE** | Both ship to every phone |
| `cover.md` §1.3 structure explainer | **DELETE** | Navigation is the structure |
| Landing `ObjectivesIndex` grid | **DELETE** | Second index on a page with an index |
| 11 × "SECTION X STRATEGIC TAKEAWAY" boxes | **DELETE** | Template filler. 84–115 chars wide. Every one restates adjacent prose |
| `situation.md` §3.2.1 Tri-Partite Mandate ASCII | **DELETE** | Internal working rule, not client content |
| `situation.md` §3.2 (rest) | **MOVE** → A1 | Methodology |
| `situation.md` §3.3.7–3.3.10 | **MOVE** → A2 | Background reference |
| `situation.md` §3.4, §3.5 | **MOVE** → new `/arithmetic` | 54-minute route |
| `messaging.md` §7.1.2, §7.1.3 | **MOVE** → A3 | Production reference |
| `messaging.md` §7.3.2–7.3.4 | **COMPRESS** | Three sub-sections, one pipeline table |
| `governance.md` §12.2 ASCII cadence block | **DELETE** | Scope overreach into client governance |
| `governance.md` §12.2 table, §12.4 | **MOVE** → A4 | Contract schedule |
| `risk.md` §13.1.2–13.1.4, §13.2.2–13.2.3, §13.3.2–13.3.4, §13.4.2–13.4.3 | **MOVE** → A5 | Runbooks |
| `summary.md` §2.3 opening jargon sentence | **REWRITE** | Eleven capabilities in one clause, in the executive summary |
| `summary.md` biography paragraphs 1–4 | **COMPRESS** to 1 | The constraint must come first |
| `summary.md` §2.2 polling table | **DELETE** | `DeficitGauge` does this better |
| `measurement.md` §11.1.1/§11.1.2 ASCII scorecards | **CONVERT TO VISUAL** | Decision-relevant content at 3.5px/char on a phone |
| `measurement.md` §11.1.3 "Section 3.3.3" | **REWRITE** → §11.2.3 | Broken reference |
| `measurement.md` §11.2.3 "over 60% of social media interactions" | **REWRITE** or label | Unsourced, in the evidence-discipline section |
| `approach.md` §6.3 seven unlabelled statistics | **REWRITE** with tiers | Unsourced figures in a source-disciplined document |
| `roadmap.md` reach / followers / viral-views KPI rows | **REWRITE** as diagnostics | Contradicts §11.2.3 |
| `structure.md` opening 40-line ASCII org chart | **MOVE** below §14.1 prose | A section should open on a sentence |
| ~70 remaining ASCII blocks | **CONVERT TO VISUAL** | 1,333 lines exceed mobile width |
| `objectives.md`, `approach.md`, `assumptions.md`, `nextsteps.md` | **KEEP** | The four strongest files. Do not touch beyond the specific fixes named |

---

## 16. Proposal Content Add List

**1. The Decision route**
Purpose: give the proposal an entrance. Evidence: existing (§16.1, §3.1.5, §6.1.2, §9.1.1). Placement: `/`, position 1. Size: ~700 words, 2 screens. Format: new `public/content/decision.md` + corrected `DecisionPanel`. **P0.**

**2. Persistent CTA in the sticky bar**
Purpose: let a reader act at the moment of conviction, from any route. Evidence: n/a. Placement: `SectionStickyBar` + `MobileBottomNav`. Size: one pill. **P0.**

**3. Scope exclusions block**
Purpose: draw the boundary §2.4 promises and never delivers. Evidence: derived from §8, §12.1.2, §14. Placement: `/scope`, beneath the workstream table. Size: ~150 words, 8 bullets. **P0.**

**4. Voter universe layer**
Purpose: repair the Objective → Audience break. Placement: `audiences.md`, new §5.0 above the six segments. Size: one table, ~200 words. **P1.** Structure:

| Universe | Definition | Size | Basis | Owns |
|---|---|---|---|---|
| Voter universe | All registered voters, Kitui County | **532,758** | IEBC · T1 | — |
| Expected turnout universe | Ballots expected at the 62.0% baseline | **~330,310** | Derived · T1 | — |
| **Victory universe** | Votes required to win | **~200,000** | §3.4.1 · T1 | GOTV |
| **Base-hold universe** | Kitui Central + Kitui West anchor | `[VERIFIED FIGURE REQUIRED]` — 77,764 registered in Kitui Central is a register count, not a support estimate | §3.5.1 · T1 register / support **Evidence required** | Mobilisation |
| **Persuasion universe** | Mwingi bloc + arid belt, where recognition is weakest | `[VERIFIED FIGURE REQUIRED]` — 200,198 registered in Mwingi is the ceiling, not the persuadable count | §3.4.5 · **Evidence required** — Week 1 baseline (§9.1.1) | Recognition |
| **Mobilisation universe** | Identified supporters requiring turnout contact | Target 200,000 verified (§4.2.1) | §4.2 · T1 target | Field + SMS |
| Soft opposition | Rival-leaning but movable | **Evidence required** | No instrument exists | Messaging |

Critically: **do not invent the persuasion-universe size.** §3.4.6 already names ward-level recognition as an open data gap and §9.1.1 commits to measuring it in Week 1. The placeholders above are the honest state and are consistent with how the rest of the document handles gaps.

**5. Risk register**
Purpose: a principal-readable summary above 514 lines of risk content; repairs the Risk → Decision break. Placement: head of §13. Size: 5 rows. **P1.**

**6. "What the campaign runs" column**
Purpose: §12.1.2 states Firefly's side only. Placement: `governance.md` §12.1.2. Size: one column. **P1.**

**7. Decision-rights tiebreaker clause**
Purpose: name who decides on disagreement. Placement: `governance.md` §12.3. Size: one sentence. **P1.**

**8. Fourteen-workstream index**
Purpose: no consolidated view of the offer exists. Placement: `/scope`. Size: one table / five collapsible groups. **P0.**

**9. Segment overlap note + base labels**
Purpose: stop six overlapping segments reading as a partition summing to 2× the register. Placement: `audiences.md` §5.2. Size: two lines. **P1.**

**10. Evidence-required token**
Purpose: give named data gaps a visual identity matching their rhetorical importance. Placement: `components/markdown/ClaimBadge.tsx` variant. **P2.**

---

## 17. Repository Implementation Plan

**All paths verified in the working tree at `cc839a4`.** Stack: Next.js 15.4 (App Router) · React 19.2 · TypeScript 5.9 · Tailwind 4.1 · Recharts 3.10 · Framer Motion 12 · `react-markdown` 10 with `remark-gfm` + `rehype-raw`. Content is 19 markdown files in `public/content/`, read server-side in `app/[[...slug]]/page.tsx`, one statically generated route per section.

### ⚠ The constraint that governs every content change

`scripts/verify-content-integrity.mjs` runs on `prebuild` and **fails the build if any body line in `public/content/` differs from baseline `a275e00`** — currently 4,036 lines, all passing. Two sanctioned channels exist for changing prose:

1. **Add a `{note, before, after}` entry to `scripts/notation-rewrites.json`** (currently 17 entries). This is the right channel for targeted edits.
2. **Move the baseline** (`const BASE` at line 58) to a new commit, and enumerate every change in `CHANGE-LOG.md` — the pattern the file's own header documents for the three previous moves.

**For a restructure of this size, move the baseline.** Attempting ~200 rewrite entries will be unmaintainable. Move it once, at the end of the content work, and log every change. Do not weaken or bypass the guard — it is the reason this repository is safe to restructure.

The other five guards must stay green: `verify-ward-register.mjs` (register sums to 532,758), `verify-figures.mjs` (every UI numeric literal traces to a source), `verify-mounts.mjs` (39 mount points resolve), `verify-deep-links.mjs` (**837 legacy ids + 241 live ids**), `visual-coverage.mjs`.

| # | Change | File / component | Action | Dependency | Effort | P |
|---|---|---|---|---|---|---|
| 1 | Re-date the decision target | `public/content/nextsteps.md` | Edit | notation-rewrites entry | 15 min | **P0** |
| 2 | Fix ceiling / budget-tier items in the ask | `components/DecisionPanel.tsx:31–37` | Edit | none | 20 min | **P0** |
| 3 | "Budget tiers" → "Scope levels" | `components/ClientPage.tsx:170` | Edit | check `MobileTOCModal`, `QuickNavCapsule` | 15 min | **P0** |
| 4 | Delete "Budget scenario" + "The immediate contest" | `components/DataVisualizations.tsx` | Delete component; remove from `ClientPage.tsx:657` | none | 30 min | **P0** |
| 5 | Fix §3.3.3 → §11.2.3 | `public/content/measurement.md` §11.1.3 | Edit | notation-rewrites | 10 min | **P0** |
| 6 | Resolve C1 (nomination timing) | `summary.md`, `assumptions.md`, `nextsteps.md`, `objectives.md` | Edit ×4 | **campaign decision on the canonical window** | 1 h | **P0** |
| 7 | Resolve C2 (3 vs 4 core) | `governance.md`, `structure.md` | Edit | **Firefly decision** | 30 min | **P0** |
| 8 | Resolve C3 (vanity KPIs) | `public/content/roadmap.md` §9.1 | Edit | none | 1 h | **P0** |
| 9 | New decision route | `public/content/decision.md`; `lib/heading-slug.ts` `SECTIONS`/`PARTS`; `app/[[...slug]]/page.tsx` `FILES` + `LANDING` | Add | **1, 2** | 1 day | **P0** |
| 10 | Move hero widgets off the landing route | `components/ClientPage.tsx:520–665` | Refactor | **9** | 4 h | **P0** |
| 11 | Persistent CTA in sticky bar | `components/SectionStickyBar.tsx`, `components/MobileBottomNav.tsx` | Add | **9** | 3 h | **P0** |
| 12 | `/scope` index + exclusions | `public/content/scope.md`; `SECTIONS`; reuse `DisclosureGroup` | Add | none | 1 day | **P0** |
| 13 | Delete 11 takeaway boxes | 11 files in `public/content/` | Delete | baseline move | 1 h | **P1** |
| 14 | Scorecards → `KpiScorecards` | `public/content/measurement.md`; verify `MarkdownViewer.tsx:382,392` | Convert | `data/kpis.ts` | 4 h | **P1** |
| 15 | Delete §12.2 governance-overreach ASCII | `public/content/governance.md` | Delete | baseline move | 30 min | **P1** |
| 16 | Voter universe layer | `public/content/audiences.md`; `components/markdown/AudienceSegmentationMatrix.tsx` | Add | none | 6 h | **P1** |
| 17 | Segment overlap note + base labels | `public/content/audiences.md` §5.2 | Add | none | 1 h | **P1** |
| 18 | Risk register | `public/content/risk.md` head | Add | none | 3 h | **P1** |
| 19 | Tier labels on `approach.md` §6.3 | `public/content/approach.md`; `data/sources.ts` | Edit | **source verification** | 4 h | **P1** |
| 20 | Fix / remove the unsourced 60% claim | `public/content/measurement.md` §11.2.3 | Edit | source verification | 30 min | **P1** |
| 21 | Rewrite 5 orphan ceiling references | `governance.md`, `risk.md`, `roadmap.md`, `structure.md` | Edit | **7** | 1 h | **P1** |
| 22 | Nav label shortening | `lib/heading-slug.ts` `SECTIONS` | Edit | check `verify-deep-links` | 1 h | **P1** |
| 23 | Section-count reconciliation | `ClientPage.tsx`, `cover.md` | Edit | derive from `SECTIONS.length` | 1 h | **P1** |
| 24 | `Dashboard` single-markup fix | `components/Dashboard.tsx:60,96` | Refactor | none | 2 h | **P1** |
| 25 | Nav grouping (5 groups) | `lib/heading-slug.ts` `PARTS`; `MobileTOCModal.tsx` | Refactor | **9, 12** | 1 day | **P1** |
| 26 | Split `situation.md` into 3 routes | `public/content/situation.md` → 3 files; `SECTIONS`; `FILES`; **`LEGACY_IDS`** | Split | **~80 legacy-id entries; `verify-deep-links` will fail until complete** | 2–3 days | **P1** |
| 27 | Annex routes A1–A5 | 5 new files; `SECTIONS`; `LEGACY_IDS` | Move | **26** | 2 days | **P2** |
| 28 | Compress `risk.md` to annex | `public/content/risk.md` | Move | **27** | 1 day | **P2** |
| 29 | Compress `messaging.md` to annex | `public/content/messaging.md` | Move | **27** | 6 h | **P2** |
| 30 | ~70 ASCII blocks → components | All content; `lib/ascii-diagram.ts` | Convert | none | 3–4 days | **P2** |
| 31 | Table → definition list < 768px | `components/markdown/InteractiveTable.tsx` | Add | none | 1 day | **P2** |
| 32 | `EVIDENCE REQUIRED` token | `components/markdown/ClaimBadge.tsx` | Add | none | 3 h | **P2** |
| 33 | Flat surfaces for adverse figures | `components/visual/Surfaces.tsx` usage | Refactor | none | 4 h | **P3** |
| 34 | Move baseline + log every change | `scripts/verify-content-integrity.mjs:58`; `CHANGE-LOG.md` | Edit | **all content changes** | 4 h | **P0** *(last)* |

### Components that can be reused as-is
`DeficitGauge` · `VoteFunnel` · `KpiScorecards` · `KpiArchitecture` · `OfflineWaterline` · `BenchmarkLadder` · `WardCartogram` · `ElectoralTimelineChart` · `TierComparisonCarousel` · `InteractiveTable` · `DisclosureGroup` · `TierBadge` · `ClaimBadge` · `ProvenanceLine` · `SourceLine` · `DiagramViewer` · `PhaseRail` · `SectionStickyBar` · `MobileBottomNav` · `MobileTOCModal`.

### Components to remove
`DataVisualizations.tsx` (both panels — duplicative and out of scope).

### Components to refactor
`Dashboard.tsx` (drop the poll card; single markup) · `DecisionPanel.tsx` (resync to §15.1; promote to the decision route) · `ClientPage.tsx` (hero block 520–665; landing widget stack) · `AudienceSegmentationMatrix.tsx` (universe layer) · `PollingTrajectorySimulator.tsx` (re-label per §3.1.5).

### Hard-coded content that should move to `data/`
`Dashboard.tsx:24–47` metric strings · `DataVisualizations.tsx:24–52` tier copy (divergent from `data/tier-matrix.ts`) · `DecisionPanel.tsx:23–38` dependency list (divergent from `assumptions.md` §15.1) · `ClientPage.tsx:166–172` `QUICK_LINKS`.

Each is a place where the site can — and currently does — disagree with the document. `verify-figures.mjs` catches numeric drift but not *prose* drift, which is how the `DecisionPanel` and `DataVisualizations` defects survived. **Recommended addition: a guard asserting that `DecisionPanel`'s dependency strings match `assumptions.md` §15.1.**

---

## 18. Implementation Priority Matrix

### P0 — must change before the proposal is next presented
Items 1–12 and 34. **Roughly 4–5 working days.**
Rationale: an expired decision date, a contradicted confidentiality clause on the landing page, a self-contradicting measurement framework, and a proposal with no ask above the fold. Every one of these is visible to the reader most likely to notice it. Items 1–8 are individually small; together they remove every verified contradiction.

**If only one day is available:** items 1, 2, 3, 4, 5 and 11. Six edits, under three hours, and they remove the expired deadline, the commercial contradiction, the broken reference, and the absence of any way to act. That is the highest return per hour available in this repository.

### P1 — high-value improvement
Items 13–26. **Roughly 8–10 working days.**
Converts the four-hour document into a two-hour one with a ten-minute decision path, repairs the two structural breaks in the strategy chain, and closes the evidence-labelling gaps.

### P2 — important refinement
Items 27–32. **Roughly 10–12 working days.**
The annex architecture and the ASCII conversion. High value, low risk, but neither blocks a presentation.

### P3 — optional polish
Item 33 and the visual-restraint recommendations in §11.

**Sequencing note.** Do items 1–8 first and independently: they are content-only, each is under an hour, and each removes a defect a sophisticated reader will find. Do not wait for the architecture work. Do item 34 last — moving the content baseline before the content changes are finished forfeits the guard's protection during exactly the period it is most needed.

---

## 19. Recommended Final Proposal Blueprint

```
/                      1 · THE DECISION            ~700 w   2 scr
                         The ask · decision date · cost of delay
                         Deficit 15.3 (T2) · Threshold ~200,000 (T1)
                         [BOOK THE MEETING]
                         Identification & confidentiality (collapsed)

/contest               2 · CONTEST IN ONE VIEW     ~350 w   3 scr
                         Two contests, two numbers, two clocks
                         DeficitGauge · timeline chips · VoteFunnel
                         T3 caveat on the mechanism, adjacent

/scope                 3 · WHAT WE WILL RUN        ~600 w   4 scr
                         14 workstreams in 5 groups
                         EXPLICIT EXCLUSIONS
                         Recommended level: Standard

──────────────────── DECISION LAYER ENDS · ~11 min ────────────────────

/summary               4 · Executive summary        800 w   4 scr
                         Constraint → conditions → candidate → commitments
/situation             5 · Situation                       ~8 min
/arithmetic            6 · Vote arithmetic                 ~9 min
/reach                 7 · Channel reach & media           ~5 min
/objectives            8 · Objectives (5 commitments)      ~4 min
/audiences             9 · Voter strategy                  ~12 min
                         UNIVERSES → segments → gaps
/approach             10 · Strategic approach              ~6 min
/messaging            11 · Messaging                       ~12 min

/scope-platforms      12 · Platforms & content             ~18 min
/scope-media          13 · Publishing & earned media       ~10 min
/scope-ground         14 · Ground & offline reach          ~16 min
/scope-data           15 · Data & technology               ~18 min
/roadmap              16 · Roadmap (Phase −1 → 3)          ~9 min
/deliverables         17 · Scope levels & deliverables     ~7 min
/measurement          18 · Measurement                     ~11 min

/governance           19 · Governance                      ~7 min
/risk                 20 · Risk (register first)           ~8 min
/structure            21 · Delivery structure              ~7 min
/assumptions          22 · Assumptions & dependencies      ~5 min
/nextsteps            23 · Next steps — THE ASK, AGAIN     ~4 min

──────────────────── EVIDENCE LAYER ENDS · ~130 min ───────────────────

/annex  A1 Evidence standard & source tiers
        A2 County reference (audit, drought, Mui Basin, legal)
        A3 Message assignment grids
        A4 Cadence & escalation
        A5 Response runbooks & security baselines
                                                   ~105 min

PERSISTENT ON EVERY ROUTE:
  sticky bar → [BOOK THE MEETING]
  bottom nav → Index · Settings · CTA
  every figure → T1/T2/T3/Evidence-required token
```

**Before:** 19 routes · 52,144 words · 249 minutes · no ask above the fold.
**After:** 23 routes + 5 annexes · same evidence, nothing lost · **11-minute decision path** · ask on screen 1, screen 8, and every sticky bar in between.

---

## 20. Final Acceptance Criteria

**Strategy**
- [ ] The logic chain PROBLEM → EVIDENCE → INSIGHT → STRATEGY → EXECUTION → MEASUREMENT → DECISION is traceable on the Decision Layer alone.
- [ ] Objective → Audience is connected: every objective names the universe it acts on.
- [ ] Risk → Decision is connected: the risk register names what the campaign must decide.
- [ ] The Week 1 falsification test appears before the sell, not after it.

**Structure**
- [ ] `/` carries the ask in the H1.
- [ ] No route exceeds 25 minutes.
- [ ] Every annexed item is reachable in ≤ 2 taps from its parent section.
- [ ] Section count is identical in every place it is stated, derived from `SECTIONS.length`.

**Evidence**
- [ ] Every figure in the Decision Layer carries T1 / T2 / T3 / Evidence-required.
- [ ] No T3 figure appears in large type without its qualification adjacent.
- [ ] Zero unsourced precise statistics (`approach.md` §6.3, `measurement.md` §11.2.3 cleared).
- [ ] `verify-figures.mjs` green.

**UX**
- [ ] One primary CTA, present on every route.
- [ ] No figure rendered more than once per route.
- [ ] Adverse figures on flat surfaces; treated surfaces reserved for the ask.
- [ ] Every chart has an accessible table equivalent.

**Mobile (390px, throttled)**
- [ ] Zero horizontal page overflow on every route.
- [ ] No content-bearing table requires horizontal scroll; ≥ 4 columns become definition lists.
- [ ] The NW/GE scorecards are readable without entering a zoom modal.
- [ ] `Dashboard` ships one markup tree, not two.
- [ ] Decision Layer reads in ≤ 11 minutes.

**Scope**
- [ ] Explicit exclusions published.
- [ ] All 14 workstreams visible on one route.
- [ ] Scope levels contain nothing a reader could price.
- [ ] Zero references to an undefined spend ceiling.

**Governance**
- [ ] Firefly's scope and the campaign's scope stated side by side.
- [ ] No Firefly-authored governance of the campaign's internal board, vendors or invoices.
- [ ] The disagreement tiebreaker is stated.
- [ ] The §12.5.5 compliance gate appears in the Decision Layer's dependency list.

**Risk**
- [ ] Five-row register at the head of §13.
- [ ] Main-path risk content ≤ 8 minutes.
- [ ] Every annexed runbook referenced from the main path.

**Measurement**
- [ ] Zero contradiction between §11.2.3 and §9.1.
- [ ] Every KPI traces to poll share or the vote threshold, or is explicitly labelled an operational diagnostic.
- [ ] The 40% / 55% reconciliation appears where 40% first appears.

**CTA / decision path**
- [ ] Ask reachable in < 60 seconds from `/`.
- [ ] Decision date is in the future and consistent everywhere.
- [ ] The ask appears first and last, identically worded.

**Consistency**
- [ ] All six contradictions C1–C6 resolved or explicitly flagged as open campaign decisions.
- [ ] Zero broken cross-references.
- [ ] Zero component strings that disagree with their source markdown.
- [ ] `bun run verify` green: all six guards, baseline moved and `CHANGE-LOG.md` updated.

### The ten strategic tests, scored

| # | Test | Now | After |
|---|---|---|---|
| 1 | Campaign problem in 30 seconds | **Partial** — figures visible, framing absent | ✓ |
| 2 | Solution in 90 seconds | **No** — §2 is 6 min and opens on biography | ✓ |
| 3 | What Firefly does, in 3 minutes | **No** — 14 workstreams over 62 min, no index | ✓ |
| 4 | Expected outcomes identifiable | **Partial** — §4 excellent, 4 routes deep | ✓ |
| 5 | Reader knows what to decide | **No** — ask at route 19, date expired | ✓ |
| 6 | Understandable on a phone | **Partial** — 1,333 over-wide lines, 4h read | ✓ |
| 7 | Developer can implement without guessing | ✓ (this document) | ✓ |
| 8 | Strategic / operational layers separated | **No** — runbooks in the main path | ✓ |
| 9 | Uncertain claims clearly identified | **Mostly** — strong system, 8 unlabelled figures | ✓ |
| 10 | Reads as an operating plan, not a section collection | **Partial** — 11 template boxes, 2 governance models | ✓ |

---

## Verification Notes

### Verified — inspected directly

**Repository** (`/home/user/DR.-MAKALI-DIGITAL-CAMPAIGN-`, branch `claude/makali-proposal-redesign-r6szv7`, HEAD `cc839a4`):
- All 19 files in `public/content/`; line, word, fence, table and width counts computed by script, reproduced in §1.
- `lib/heading-slug.ts` — `SECTIONS` (19), `PARTS` (16), `TAB_ALIASES`, legacy-id machinery.
- `app/[[...slug]]/page.tsx` — routing, `FILES`, `LANDING = "cover"`, `generateStaticParams`.
- `components/ClientPage.tsx` (966 ln) — hero, `QUICK_LINKS` (line 166–172, including `"Budget tiers"` at 170), widget stack, toolbar.
- `components/Dashboard.tsx`, `KeyFactsStrip.tsx`, `DecisionPanel.tsx`, `DataVisualizations.tsx`, `MarkdownViewer.tsx` (mount map, lines 195–309), `AsciiDiagram.tsx`, `DiagramViewer.tsx`, `MobileBottomNav.tsx`.
- `data/tier-matrix.ts`, `sources.ts`, `external-figures.ts`, `types.ts`; `lib/phases.ts`, `section-index.ts`.
- `scripts/verify-content-integrity.mjs` (baseline `a275e00`), `notation-rewrites.json` (17 entries).
- `package.json`, `AGENTS.md`, `docs/PHASE-0-AUDIT-redesign.md`, `docs/FINAL-REPORT-redesign.md`.

**Guards — executed, all green:**
```
Content integrity: 4,036 body lines unchanged since a275e00
Figures:           every numeric literal traces to source
Deep links:        837 legacy + 241 live ids resolve
Mounts:            39 mount points, 241 headings indexed
```

**Live site** (`https://dr-makali-digital-campaign.vercel.app/`, fetched 14 Sep 2026, `x-vercel-cache: HIT`, `x-matched-path: /`, `x-nextjs-prerender: 1`): full landing-route HTML retrieved and read end to end. Confirmed live: landing render order; the "Budget tiers" chip; the `DeficitGauge` "contest as measured" block with both rounds and the Tier-2 source line; `VoteFunnel`; the "16 sections" / "1 of 19" discrepancy; per-section reading times (situation 54 m; total 249 m); the absence of any ask or CTA on the landing route.

**Contradictions C1–C6** — each located in at least two files and quoted in §13.
**Orphan ceiling** — all six referring sites located and listed in §12.
**`DecisionPanel` drift** — both divergent strings diffed against `assumptions.md` §15.1.
**Vanity-metric contradiction** — §11.2.3 ban and §9.1 targets both quoted.
**Segment arithmetic** — §5.2 figures summed against the 532,758 register.
**Broken reference** — §11.1.3 → §3.3.3; §3.3.3's actual title confirmed at `situation.md:222`.

### Not verified — and why

- **Rendered mobile behaviour.** I read the production HTML and the CSS/component source, but did not run a browser at 390px against the live deployment. Overflow claims are derived from measured character widths (max 115 chars) and the components' own documented behaviour — `DiagramViewer`'s header states the widest diagram is 112 columns at ~690px inside a 400px card. **Confidence: high, but a device pass should confirm before sign-off.**
- **Lazy-mounted landing content.** `DataVisualizations` and `VoterProjectionsChart` sit inside `LazyMount` and so are absent from the SSR HTML. Their content is verified from source; their *rendered* appearance and position are inferred.
- **Current Lighthouse scores.** `docs/FINAL-REPORT-redesign.md` reports Performance 50 / LCP 5.6 s (8 Sep 2026, 86 files ago). Not re-measured. Performance is outside this brief's scope but items 4, 10 and 24 should improve it.
- **`KpiScorecards` render path.** Imported at `MarkdownViewer.tsx:24` and referenced at 382/392, but I did not confirm at runtime whether it *replaces* the ASCII scorecards or renders alongside them. §8 flags this as a check, not a finding.
- **Whether the equal-ward policy fork (§3.3.2) has since been decided** by the campaign.
- **Every one of the 837 legacy deep links** — the guard asserts they resolve; I ran the guard rather than auditing the table.

### Assumptions I am making

1. The `claude/makali-proposal-redesign-r6szv7` branch is the live source for the Vercel deployment. The landing content I fetched matches the working tree, which supports this.
2. The client's instruction that removed campaign-finance content (commit `5ff79ce`, per the integrity script's header) still stands — so the orphan ceiling references should be *removed*, not *restored*.
3. "Firefly" is the proposing consultancy and "the campaign" is the client organisation; the 3-vs-4 team contradiction is read on that basis.
4. The decision-maker is Dr. Mulu or a single senior delegate, reading on a phone — the brief's framing, and consistent with §15.1's "one named counterpart".
5. Restructuring effort estimates assume one developer familiar with this codebase. The `situation.md` split (item 26) is the least certain estimate because of the legacy-id work.

### Evidence required — open items for the campaign

| Item | Where | Needed from |
|---|---|---|
| **Canonical nomination window** — before Q4 2026, or late Oct–Nov 2026? | C1, §13 | Campaign / Wiper. Until settled, publish as "expected Q4 2026", T3 |
| **A decision date that is not in the past** | `nextsteps.md` §16.1 | Firefly, immediately |
| **Firefly core team size, and the campaign command team size, separately** | C2, §13 | Firefly |
| **Source for "over 60% of social media interactions... non-resident diaspora"** | `measurement.md` §11.2.3 | Firefly research, or delete |
| **Sources and tiers for the seven §6.3 theme statistics** | `approach.md` §6.3 | Firefly research, or mark Evidence required |
| **Persuasion universe size** (Mwingi + arid belt persuadables) | New §5.0 | Week 1 baseline instrument (§9.1.1). **Do not estimate** — §3.4.6 already names this a gap |
| **Base-hold universe size** (anchor support, not register count) | New §5.0 | Week 1 baseline. **Do not estimate** |
| **Soft-opposition sizing** | New §5.0 | No instrument exists; add to §5.3's research gaps |
| **Whether the spend ceiling stays excised** | §12(a) | Campaign — affects 6 locations |
| **Equal-ward guarantee vs needs-weighted formula** | `situation.md` §3.3.2 | Campaign policy call. Firefly has recommended; the document correctly leaves it open |
| **ODPC political-campaigning circular** | `assumptions.md` §15.2 | Campaign Legal Director, before Phase −1 SMS |

### What I did not do

I did not change any file in this repository other than adding this specification. No content was edited, no component modified, no guard weakened. Every recommendation above is a proposal for the person who owns this document — including the recommendation to move the content-integrity baseline, which should be a deliberate, logged decision and not a side effect of a redesign.
