# REMOVAL MAP — Content Excision (Brief A, Phase 0)

**Status:** Phases 0–C complete and applied. See §5 for what was decided and what changed.
**Archive branch:** `archive/pre-excision` created at `4be4c43`.
**Baseline verification:** `npm run verify` passes clean at HEAD (recorded below).

---

## 0 · READ THIS FIRST — six ways the brief and the codebase disagree

The brief was written from the rendered site. Six things are visible only from the source, and
four of them change the plan materially.

### 0.1 The document is 49,774 words, not 6,686

The header badge shows **the active tab's** word count, not the document's. `6,686 wds` is
`1-decision.md` alone. Across the nine content files the document is **49,774 words** — roughly
**200 minutes**, not 31. `components/MiniScorecard.tsx` says so in its own comment: *"a reader
40,000 words into a 200-minute proposal."*

**Consequence for Phase D.** The length argument is not weaker than the brief thought, it is
seven times stronger. But it also means the three removal targets — even at their widest reading
below — take out **~11% of the document.** Excision alone will not make this a document anyone
reads in one sitting. Phase D is not a tidy-up after the real work; on these numbers it *is* the
real work. I would raise its priority and widen its remit, and I will argue that when we get there.

### 0.2 The word count, read time and section index are computed, not written

`lib/section-index.ts` derives the index from the markdown headings at build time; the badge in
`components/ClientPage.tsx:769` computes from live word counts. **Phase B items 4 and 5 are
largely no-ops** — the index, the nine-card grid, the sticky nav and the badge all self-heal.
What does *not* self-heal: `MiniScorecard`'s hardcoded `Ceiling` chip, `HEADING_INSERTS` mounts,
the `data/*.ts` figure stores, and the placeholders register (prose, hand-counted).

### 0.3 A build guard forbids prose edits — every REWRITE row will fail the build

`scripts/verify-content-integrity.mjs` runs on `prebuild` and asserts that **all 4,337 body
lines are unchanged** since commit `5470756`. Any rewrite fails it. This is not an obstacle, it
is a procedure: the guard's own comment records the sanctioned remedy, used once already —

> *"This guard exists to stop a redesign quietly editing a document of record. It does not exist
> to stop that document's author editing their own proposal... So the baseline moves to their
> commit rather than their commit being logged away as though it were a reflow."*

**So the excision commit becomes the new `BASE`,** and `CONTENT_BASELINE=5470756` continues to
diff against today's text for anyone auditing what came out. This must be a deliberate,
logged step. It is the one place where a careless Phase A could erase the document's chain of
custody.

### 0.4 There are four campaign-finance sections, not one — and two remote-defence sections, not one

The brief maps §9.2 and §9.3.3. It does not know about:

| Section | File | Words | Target |
|---|---|---:|---|
| **§3.3 Paid media and campaign financing** (with §3.3.1–3.3.4) | `4a-publishing.md` | **1,499** | 1 + 2 |
| **§6.6 Statutory and regulatory compliance** (§6.6.1 financing obligations) | `2-evidence.md` | **918** | 1 (partly) |
| **§3.1.3 Budget against reach** | `2-evidence.md` | **393** | 2 |
| **§6.3.1–6.3.2 Component costs and procurement matrix** | `4d-technology.md` | **1,246** | 2 |
| **§0.4 Why the operation is run remotely** | `5-delivery.md` | **512** | 3 (+2) |

That is **4,568 words** of in-scope content the brief does not mention — **more than the §9.2
block it does** (2,056 words). §3.3 alone is a whole top-level section containing the KSh64.5m
budget, the seven-row channel allocation table, the six statutory financing rules, and the
penalty exposure list. The brief refers to it only as *"the §3.3 target-vs-actual paid media
table."*

### 0.5 §9.3.4 does not ask for tier sign-off

The brief says *"§9.3.4 currently ends by asking for tier sign-off."* It does not. The ask ends
with a request for a meeting within fourteen days. **Only dependency 8 in §9.3.2 asks for tier
sign-off.** Under Decision 1 Option A the ask needs *one* change — "virtual meeting" → "meeting"
(Target 3) — and the commercial ask that C.3 sets out to replace **does not exist to replace.**
C.3 shrinks from "draft two replacement asks" to "delete dependency 8 and drop one adjective."

This is good news and it is worth saying plainly: **the strongest passage in the document
survives Option A almost untouched.**

### 0.6 `<CeilingMeter>` is built, not pending

`components/charts/CeilingMeter.tsx` (238 lines) exists and is mounted. So do
`BudgetScenarioModeler`, `TierComparisonCarousel`, `ComplianceCeilingPanel` /
`ComplianceCeilingPanelContent`, and `SpendingCeilingChart`. The brief's *"cancel these builds
in the visual brief"* is right about the visual brief and wrong about here: these are
**deletions**, not cancellations. `<CostCalculator>`, `<TwoQuantities>` and `<TierSelector>`
do not exist and never did — nothing to cancel.

---

## 1 · THE TWO DECISIONS — flagged, not taken

### Decision 1 — do the three budget tiers survive?

**I have not cut anything. Assuming Option A per the brief, but I recommend Option B**, and the
codebase is why.

The tiers are not just §9.2.5–9.2.6. They are load-bearing in **six** places:

| Dependent | What breaks under Option A |
|---|---|
| §7.2.3 Surge roles | Seven roles keyed *"activated by phase and tier"*; three rows name a tier explicitly |
| §7.2 opener (`4e-team.md:13`) | *"The structure below scales with the budget tier selected in Section 9.2"* |
| `4e-team.md:21` | *"everything in 7.2.2 and 7.2.3 is in scope for the tiers in Section 9.2"* |
| §9.3.2 dependency 8 | *"Sign-off on the budget tier so the team can be assembled"* |
| `data/budget-tiers.ts`, `data/tier-matrix.ts` | Both files exist only to carry tiers |
| `TierComparisonCarousel`, `BudgetScenarioModeler`, `TierBadge`, `CeilingMeter` | All orphaned |

Under **Option A**, §7.2.3 loses its activation logic entirely — *"Roles are not added
speculatively"* becomes an unsupported claim, because the thing that stopped them being added
speculatively was the tier. The team section then says a team exists without saying what
determines its size.

Under **Option B**, §7.2.3 keeps working unchanged (phase + service level), `data/tier-matrix.ts`
survives with its money rows stripped, `TierComparisonCarousel` survives as a scope comparator,
and dependency 8 becomes *"Sign-off on the service level."* Only `budget-tiers.ts`,
`BudgetScenarioModeler` and `CeilingMeter` die.

**Option B costs three components. Option A costs the team section's logic.** The brief already
suspected this — *"Option B preserves the ask and loses less structure"* — and from inside the
codebase it is not close.

### Decision 2 — does fundraising count as costs?

**Proceeding on the brief's default.** One correction: the compliance wrapper is not only in
§7.1.2. `components/markdown/DataSecurityEthicsCharter.tsx:57–59` hardcodes a charter row —
*"20% Single-Source Contribution Ceiling... KSh 19.51M (20% of the KSh 97.56M county ceiling)"*
— inside the **Digital Ethics and Data Charter**, which §5.3 of the brief says must not be
touched. The row is campaign finance wearing the charter's clothes. **It goes; the charter
stays.** Row 8 below.

### Decision 3 — one the brief did not anticipate: §3.1.3

**§3.1.3 "Budget against reach"** argues that campaigns over-fund digital and starve rural
infrastructure, and it argues it entirely in **percentages of the communications budget**
(digital 45%→18%, radio 20%→37%, SMS/USSD 10%→20%). Under Target 2 that is a spend allocation
and it goes. But it is also **the whole justification for the two-tier channel architecture** —
the reason the document builds a USSD layer at all.

The argument does not survive being stripped of its numbers, because the numbers *are* the
argument. I see three options and I want a decision before Phase A:

- **A** — delete §3.1.3 with the rest of Target 2. Cleanest; loses the channel thesis's proof.
- **B** — keep it, recast from *share of budget* to *share of effort/weight*. Same shape, same
  point, no shillings. **My recommendation.**
- **C** — keep it, recast against **reach** instead of spend (radio reaches 78.8%, digital 13.6%
  — already in §3.1.1–3.1.2). Strongest version, most work, and it is arguably what the section
  was always trying to say.

---

## 2 · THE REMOVAL MAP

Class: **`DELETE`** (exists only to carry removed content) · **`REWRITE`** (entangled — the
passage survives, the money/regulation/remoteness comes out) · **`KEEP`** (keyword false positive,
logged so nobody cuts it later).

### 2.1 Target 1 — Campaign finance and regulatory ceiling

| ID | Location | Text or component | Class | Referenced from | Proposed action |
|---|---|---|---|---|---|
| T1-01 | §9.2.1 · `1-decision.md:256–295` (383 wds) | Regulatory ceiling: Gazette 12251, KSh97.56m, 70/30 formula, 8 county comparators, shared-ceiling question, "Verified" annotation | `DELETE` | `MiniScorecard` chip · §9.2.4 · §9.2.5 · §9.2.7 · `LEGACY_IDS` ×3 | Delete whole. Retire `decision-sec-9-2-1` in `LEGACY_IDS`. |
| T1-02 | §9.2.4 · `1-decision.md:345–369` (235 wds) | Compliance instrumentation: reconciliation ledger, IEBC return, 20% cap records, counsel question, "not legal advice" disclaimer | `DELETE` | §9.3.1 · §4a `2.9.3` (`:262`) · §4c `5.1.4` (`:250`) · §5-del `8.3.1` (`:36`) | Delete whole. **Four inbound refs must be repaired — see 2.5.** |
| T1-03 | §9.2.7 · `1-decision.md:471–482` (75 wds) | Spending against the ceiling: 20% cap, dedicated account, authorised person, KSh1m audit threshold, expenditure window, penalties | `DELETE` | Mount `decision-sec-9-2-7` | Delete whole + unmount. |
| T1-04 | `4a-publishing.md:347–356` (~180 wds) | **§3.3 opener** + STATUTORY BUDGET ALLOCATION ASCII panel (KSh97.56m ceiling, KSh64.5m budget, 3-way split) | `DELETE` | §3.1.3 (`2-ev:874`) · §9.2.5 (`:372`) | Delete. Not in brief. |
| T1-05 | §3.3.3 · `4a-publishing.md:470–500` (~330 wds) | **The campaign financing rules we work inside** — all six statutory mandates | `DELETE` | §9.2.4 (`:347`) | Delete whole. Not in brief. |
| T1-06 | §3.3.4 · `4a-publishing.md:507–528` (~250 wds) | **Penalty exposure** — fines, disqualification, forfeiture + strategic-takeaway panel | `DELETE` | — | Delete whole. Not in brief. |
| T1-07 | §6.6 intro · `2-evidence.md:1258–1266` | STATUTORY COMPLIANCE ARCHITECTURE panel, **block 1 only** (ceiling, 20% cap, trust account, KSh1m reporting, 90-day audit) | `REWRITE` | — | **Cut block 1 of four. Blocks 2 (IEBC nomination), 3 (DPA 2019) and 4 (Election Offences) stay** — nomination clearance and data protection are not campaign finance. Renumber 2–4 → 1–3 inside the ASCII panel. |
| T1-08 | §6.6.1 · `2-evidence.md:1296–1330` (~300 wds) | **Campaign financing obligations under the ECFA** — full statutory obligations table | `DELETE` | §3.3.3 (`4a:492`) · §9.2.5 (`:372`) | Delete whole. Not in brief. Leave §6.6.2/6.6.3 numbering alone (gaps are safe). |
| T1-09 | `components/MiniScorecard.tsx:38–46` | Sticky footer chip **`Ceiling KSh97.56m`**, linked to `decision-sec-9-2-1` | `DELETE` | Renders in bottom dock on every route | Delete the entry; drop the `CEILING` import. **Leaves a 2-chip rail — see 2.6.** |
| T1-10 | `components/markdown/DataSecurityEthicsCharter.tsx:55–60` | Charter row *"20% Single-Source Contribution Ceiling — KSh 19.51M (20% of KSh 97.56M county ceiling)"* | `DELETE` | Mounted at `strategy-sec-6-5` | **Campaign finance inside the ethics charter.** Delete the row; charter survives. Per Decision 2. |
| T1-11 | `components/markdown/ComplianceCeilingPanel*.tsx` · `charts/SpendingCeilingChart.tsx` | Compliance and spending-ceiling panel + its chart | `DELETE` | Mount `decision-sec-9-2-7` | Delete both files + mount + import. |
| T1-12 | `data/spending-ceiling.ts` (59 lines) | Ceiling figure store | `DELETE` | `CeilingMeter`, `SpendingCeilingChart` | Delete once consumers go. |
| T1-13 | §7.1.2 · `1-decision.md:239` | *"with every shilling logged against the IEBC expenditure return (Section 9.2.4)"* | `REWRITE` | — | Cut the clause. Keep *"Monthly allocation matrix based on ward-level registration and engagement data."* |
| T1-14 | §7.1.2 · `1-decision.md:238` | *"All fundraising structured for compliance with the Election Campaign Financing Regulations, 2026 — including the 20% single-source contribution cap and full contribution records"* | `REWRITE` | — | Cut per Decision 2. **Donation page, M-Pesa and diaspora fundraising survive.** |
| T1-15 | §7.2.5 · `4e-team.md:87` | Monthly row: *"Analytics report; competitive brief; spend reconciliation against IEBC ceiling"* | `REWRITE` | — | **Cell-level edit, not row deletion.** Cut only the third clause. **The brief is wrong that the row needs replacing** — it already carries two surviving outputs, and its Participants cell (`[campaign counsel, where voter-file work is live]`) is data-protection and stays. Rename the meeting *"Performance review"*. |
| T1-16 | §9.3.1 · `1-decision.md:489` | *"...plus the competitive brief (5.4.3), the compliance ledger reconciliation (9.2.4), and progress against the analytics maturity roadmap (6.4.3)"* | `REWRITE` | — | Drop the middle clause only. |
| T1-17 | §9.3.2 dep. 4 · `1-decision.md:499–500` | *"Appointment of the compliance reviewer (Section 6.5.5) — the long-lead item"* | `REWRITE` | §6.5.5 | → *"Appointment of the data-protection reviewer."* **§6.5.5 names a "data-protection / electoral-law reviewer" and survives in full.** Keep as the long-lead gating item. |
| T1-18 | §9.3.2 dep. 5 · `1-decision.md:501` | *"The verified expenditure ceiling from the gazette schedule"* | `DELETE` | — | Delete; renumber 1–7 (under Option B; 1–7 with dep. 8 rewritten under Option A this becomes 1–7 too — see T2-14). |
| T1-19 | Placeholders register · `1-decision.md:509–526` | *"There are 19"* + row **Dedicated USSD code quotation \| 9.2.2**; **tested conversion rate \| 9.2.3** | `REWRITE` | — | Remove the USSD-quotation row; drop *"tested conversion rate"* from the last row and repoint. **Recount — see 2.7.** |
| T1-20 | §4c `5.1.4` · `4c-defence.md:250` | Holding row 6: *"Allegation of exceeding the IEBC spending ceiling \| Ledger reconciliation retrieval (Section 9.2.4)"* | `DELETE` | — | Delete the row. **Judgement call — flagged in 3.1.** |
| T1-21 | §5-delivery `8.3.1` · `5-delivery.md:36` | Phase −1 task *"Establish the compliance ledger (Section 9.2.4)"* | `DELETE` | — | Delete the bullet. |
| T1-22 | §4a `2.9.3` · `4a-publishing.md:262` | *"Every test logged to the compliance ledger (Section 9.2.4)"* | `DELETE` | — | Delete the bullet. |
| T1-23 | §9.2.4 · `1-decision.md:347–349` | Counsel question naming §3.3.3 and §9.2.1 on the regulated spending window | `DELETE` | — | Dies with T1-02. Also a **live contradiction** (§3.3.3 and §9.2.1 disagree on the window) — logged in 3.3, not silently resolved. |

### 2.2 Target 2 — Costs and money

| ID | Location | Text or component | Class | Referenced from | Proposed action |
|---|---|---|---|---|---|
| T2-01 | §9.2.2 · `1-decision.md:296–317` (199 wds) | Unit economics table: SMS KSh0.25–1.06, sender ID KSh4.5k–14.1k, USSD ~KSh34.8k / ~KSh140k / ~KSh5k pm, WhatsApp ~KSh0.50+ | `DELETE` | §3.3.2 ×2 (`4a:452,455`) · §8.5.6 (`3-str:768`) · placeholders | Delete whole. **Four inbound refs.** |
| T2-02 | §9.2.3 · `1-decision.md:318–344` (205 wds) | Cost-per-contact model: 3-scenario table, KSh0.30/0.60 columns, canvassing comparison, ≤KSh200/persuaded-voter | `DELETE` **except the consent paragraph** | §4b `4.3.2` (`:304`) · §9.2.5 (`:392`) | See **T2-02b** — the consent argument is extracted first. |
| **T2-02b** | `1-decision.md:335–339` | *"The critical constraint: the campaign can only message consented numbers (6.5). List building is therefore a KPI in its own right from Phase −1, not an afterthought — consented contacts are a campaign asset that compounds, and the only lawful route to this cost structure."* | `REWRITE` **+ RELOCATE** | — | **Strip the final six words. Relocate to §4.3 (`4b-ground.md`, offline layer) — see 2.8.** The brief is right that this must not die with the cost model. |
| T2-03 | §9.2.5 · `1-decision.md:370–450` (772 wds) | The three tiers; ad-spend %-of-ceiling bands; KSh64.5m reconciliation; four-quantity definitions table | `DELETE` or `REWRITE` | §7.2 opener · §7.2.3 · dep. 8 · `budget-tiers.ts` · 4 components | **Blocked on Decision 1.** Option A: delete whole. Option B: strip every shilling and %-of-ceiling, keep service levels. |
| T2-04 | §9.2.6 · `1-decision.md:451–470` (187 wds) | Tiers compared — nine-attribute matrix | `DELETE` or `REWRITE` | `TierComparisonCarousel` · `tier-matrix.ts` · `DecisionPanel` | **Blocked on Decision 1.** Option B: drop the money rows, keep the seven scope rows. |
| T2-05 | §3.3.1 · `4a-publishing.md:363–436` (~640 wds) | Channel allocation vs reachable population: 7-row KSh64.5m table, the *(est.)* caveat, the 3.1.3 divergence table, the KSh14m gap | `DELETE` | §3.1.3 (`2-ev:874`) | Delete. **But see 3.2 — this carries two live accuracy flags that must not vanish silently.** |
| T2-06 | §3.3.2 · `4a-publishing.md:438–466` (~290 wds) | Rate-card research & procurement status — radio Ksh8k–14k, USSD session fee Ksh0.15, four "awaiting procurement" rows | `DELETE` | — | Delete whole. Not in brief. |
| T2-07 | §3.1.3 · `2-evidence.md:862–917` (393 wds) | Budget against reach — the rebalancing table in % of communications budget | **`REWRITE`** | §3.3.1 (`4a:418,421,430,433`) | **Blocked on Decision 3.** Recommend recast to share-of-effort (Option B). |
| T2-08 | §6.3.1 · `4d-technology.md:282–352` (~700 wds) | Component costs: sender ID Ksh30–50k, USSD Ksh25k/mo, SMS Ksh0.60–0.80 (~Ksh900k–1.2M lifecycle), DB Ksh20–35k/mo, publishing Ksh15–25k/mo, listening Ksh30–45k/mo, tracker hosting, CDN | `REWRITE` | — | **Not in brief. Strip every cost line; keep every component, vendor-class and function.** Retitle §6.3.1 *"Component by component, and what each does."* The stack survives entire. |
| T2-09 | §6.3.2 · `4d-technology.md:353–379` (~350 wds) | Procurement matrix — cost column (Ksh950k–1.3M, 350–500k, 45–70k/mo, 10–15k/mo, 5k/mo) | `REWRITE` | — | **Not in brief. Drop the cost column only.** Keep item, vendor, DPA-risk and procurement-status columns — the DPA risk column is data protection and is doing real work. |
| T2-10 | §8.5.6 · `3-strategy.md:766–771` | *"Build and cost"* — USSD ~Ksh34,800/network, ~Ksh140,000, ~Ksh5,000/mo, cross-ref to §9.2.2 | `REWRITE` | — | **Not in brief.** Retitle *"Build"*; cut costs and the §9.2.2 ref; keep *"a lightweight public register on the campaign site."* |
| T2-11 | §4.3.2 · `4b-ground.md:302–304` | *"**Cost:** at KSh0.25–0.60 per message, a fortnightly touch to 120,000 consented voters costs approximately KSh30,000–72,000 per send — see Section 9.2.3."* | `DELETE` | — | Delete the paragraph. **Keep 120,000 and the fortnightly cadence** — both are volumes (T2-K06). |
| T2-12 | §4.3.3 · `4b-ground.md:328–330` | *"**Cost:** shared code approximately KSh34,800 per network, development approximately KSh140,000, hosting approximately KSh5,000 per month."* | `DELETE` | — | Delete the paragraph. USSD layer untouched. |
| T2-13 | §4.3.6 · `4b-ground.md:369` | KPI row *"Cost per consented contact \| ≤KSh0.60 \| ≤KSh0.50 \| ≤KSh0.40 \| ≤KSh0.35"* | `DELETE` | `4d:438` mirrors it | Delete the row. **Five other KPI rows survive; the opt-out-rate paragraph below is untouched.** |
| T2-14 | §9.3.2 dep. 8 · `1-decision.md:505` | *"Sign-off on the budget tier so the team can be assembled"* | `DELETE` or `REWRITE` | §7.2 opener | **Blocked on Decision 1.** Option A: delete, list runs 1–6. Option B: → *"Sign-off on the service level."* |
| T2-15 | §9.1.1 Commitment 1 · `1-decision.md:~64` | *"trigger immediate reallocation of **40% of the digital ad budget** to localized Kikamba voice-note broadcast and USSD push messaging"* | `REWRITE` | — | → *"trigger immediate reallocation of paid-media weight to localised Kikamba voice-note broadcast and USSD push messaging."* Trigger kept. |
| T2-16 | §7.1.2 · `1-decision.md:239` | *"Monthly **spend** allocation matrix"* | `REWRITE` | — | → *"Monthly allocation matrix"*. Same line as T1-13. |
| T2-17 | §6.4.2 · `4d-technology.md:437–438` | *"Cost per persuaded voter — ≤ KSh200"*; *"Cost per consented contact — ≤ KSh0.60 falling to KSh0.35"* | `DELETE` | `BenchmarkLadder` mounted at `technology-sec-6-4-2` | Delete both rows. **Check `BenchmarkLadder` for hardcoded copies — 2.6.** |
| T2-18 | §8.1.2 · `5-delivery.md:177` | Scorecard row *"Cost per persuaded voter \| ≤ KSh200"* | `DELETE` | `KpiScorecards` · `data/kpis.ts` | Delete the row + its store entry. |
| T2-19 | §8.2.1 · `5-delivery.md:255–285` | Research programme table **Cost (Ksh) column** — 1.2–1.6M, 850k–1.1M, 250–400k | `REWRITE` | — | **Not in brief.** Drop the cost column; keep method, sample, timing and decision-unlocked columns. |
| T2-20 | §7.3.3 · `4e-team.md:210` | Escalation trigger *"Unexpected budget overruns (>Ksh 100,000)"* | `REWRITE` | — | **Not in brief.** → *"Unexpected cost or scope overruns"*, or cut the clause and keep the other two triggers. |
| T2-21 | `data/budget-tiers.ts` (88 ln) · `data/tier-matrix.ts` (69 ln) | Tier + ceiling figure stores | `DELETE` / `REWRITE` | 4 components | **Blocked on Decision 1.** |
| T2-22 | `charts/CeilingMeter.tsx` (238 ln) · `markdown/BudgetScenarioModeler.tsx` · `markdown/TierBadge.tsx` · `charts/TierComparisonCarousel.tsx` | Tier and ceiling visualisations | `DELETE` (A) / partial (B) | Mounts `decision-sec-9-2-5`, `-9-2-6` · `DecisionPanel` | **Blocked on Decision 1.** `CeilingMeter` dies either way (it is the ceiling). |
| T2-23 | `4a-publishing.md:288`, `:298` | Sample ad copy *"Kitui County will handle KSh13.79 billion this year"* | **`KEEP`** | — | **County money. Do not touch.** Logged because it sits inside a paid-media section being cut around. |
| T2-24 | Vendor shortlist · `4d:361–375`, `3.3.2` | Celcom Africa, Africa's Talking, Advanta, Oramobile, AirTouch, Mobitech, Hootsuite, Brand24, Metabase | `REWRITE` | — | Rates go (T2-06/09). **Whether the names go is a Phase D question, not a Phase A one — I recommend keeping them in §6.3.2 and cutting them from §3.3.2 with the rest of it.** Reasoning in 3.4. |

### 2.3 Target 3 — Remote-work framing

| ID | Location | Text | Class | Proposed action |
|---|---|---|---|---|
| T3-01 | §9.3.3 · `1-decision.md:529–563` (308 wds) | *"Why a remote operation works"* — heading, "not a compromise" opener, no-physical-office argument | `DELETE` **after salvage** | Delete heading + framing. **Salvage the capability list (T3-03) and the qualification (T3-04) first.** |
| T3-02 | **§0.4 · `5-delivery.md:430–470` (512 wds)** | *"Why the operation is run remotely"* — decentralized command centre; three advantages (**cost arbitrage**, information security, speed) | `DELETE` **after salvage** | **Not in brief — this is a second, longer remote defence.** Advantage 1 is *also* Target 2 (budget redirection). **But it ends with the CAMPAIGN DECISION PROTOCOL block and the "mathematically undeniable candidate" line — both must be salvaged. See 2.9.** |
| T3-03 | `1-decision.md:534–546` | The capability list inside §9.3.3 | `REWRITE` **+ PROMOTE** | Lift out, drop *"within a governed compliance framework"* and *"and regulated-spend reconciliation"* (Target 1), rebuild as **"What Firefly runs"**. No framing. |
| T3-04 | `1-decision.md:554–560` | *"One honest qualification"* — focus groups facilitated in Kitui, native-speaker Kikamba producer, local ward network, *"budgeted as local appointments, not absorbed into a remote retainer"* | `REWRITE` **+ INVERT** | Strip remote framing and *"budgeted as"*. Becomes **"Firefly staffs Kitui roles with Kitui people"** — a positive commitment, promoted into the main body. |
| T3-05 | §0.2 · `1-decision.md:246` | *"a comprehensive, **remotely managed** digital campaign apparatus"* | `REWRITE` | → *"a comprehensive digital campaign apparatus"* |
| T3-06 | §0.3 · `1-decision.md:43` | *"a **remote** digital war room executing structured red-team simulations"* | `REWRITE` | → *"a digital war room..."* (also a Phase D buzzword candidate — 3.4) |
| T3-07 | §7.1 opener · `1-decision.md:226–228` | *"Operating remotely allows for a dedicated digital war room, maintaining a continuous, high-quality digital footprint without the logistical overhead of being physically present on the campaign trail."* | `DELETE` | Delete the sentence. §7.1's scope list needs no preamble. |
| T3-08 | §9.3.1 · `1-decision.md:487` | *"A scheduled **virtual** briefing"* | `REWRITE` | → *"A scheduled weekly briefing."* Do not specify the medium. |
| T3-09 | §9.3.4 · `1-decision.md:593` | *"We respectfully request a **virtual** meeting"* | `REWRITE` | → *"a meeting"*. **Not in brief.** One word, in the document's single most important sentence. |
| T3-10 | §5.2.1 · `4c-defence.md:189` | *"The **remote** war room is the campaign's nerve centre for monitoring, response and..."* | `REWRITE` | → *"The war room is the campaign's nerve centre..."*. **Not in brief.** |
| T3-11 | `5-delivery.md:1` | File orientation line: *"...and **why the operation runs remotely**."* | `REWRITE` | Cut the final clause. Dies with T3-02. |
| T3-12 | §5.1.4 · `4c-defence.md:137–145` | Holding position 3: **"THE 'REMOTE OPERATING MODEL / NAIROBI TECHNOCRAT' QUESTION"** | `REWRITE` | **Not in brief. Judgement call — 3.1.** The attack line is about *the candidate's* Nairobi committee time, not Firefly's delivery model. **Retitle to "THE 'NAIROBI TECHNOCRAT' QUESTION" and keep the row.** It answers a real attack on Dr. Mulu. |
| T3-13 | `4a-publishing.md:246–247` | Table cells *"Remote dashboard"* (Meta Advantage+, Google RSA) | **`KEEP`** | False positive — a tool-access column, not delivery framing. |
| T3-14 | `4a-publishing.md:307` | *"Ward-level group admins trained **remotely**"* | `REWRITE` | → *"trained by Firefly"*. Low stakes, but it is delivery framing. |
| T3-15 | `5-delivery.md:96` | *"recruit and train 40 ward digital champions **remotely**"* | `REWRITE` | Cut the adverb. |
| T3-16 | `2-evidence.md:620`, `4b-ground.md:127` | *"Geographically remote"*, *"remote interior villages"* | **`KEEP`** | Geography, not delivery model. |
| T3-17 | `2-evidence.md:774` | *"...transforms them into active campaign donors and **remote family influencers**"* | **`KEEP`** | Diaspora, not Firefly. |
| T3-18 | All *"War Room"* uses — `1-dec:181`, `4a:123`, `4b:24,91,170,202`, `4c:67,185–229`, `4d:336,384`, `4e:240`, `5-del:294,368` | | **`KEEP`** | *"War room"* is not remote framing; §5.2 is a whole section built on it. Only the modifier *"remote"* goes (T3-06, T3-10). |
| T3-19 | *"Real-time"*, *"rapid response"*, *"continuous availability"* — throughout | | **`KEEP`** | Explicitly protected by the brief's §3. |

### 2.4 Protected — county fiscal and policy money (`KEEP`, all)

Verified against §3 of the brief. **None of these may be removed. All are money the county
spends or the candidate pledges, not money the campaign spends.**

| Figure | Where |
|---|---|
| **KSh13.79bn** FY2026/27 resource envelope | `2-ev:315,320` · `3-str:19,45,68,180,385` · `4a:288,298` · `1-dec:234` · `ResourceEnvelopeBlock` |
| **KSh11.64bn** equitable share · **KSh1.03bn** conditional grants | `2-ev:316–317` |
| **KSh1.339bn** own-source revenue target | `2-ev:318` · `3-str:69` · `4a:298` |
| **KSh47m** bursaries to 12,573 students | `2-ev:167` · `3-str:11,80,319` · `4c:121` |
| Audit record: **KSh670m** · **KSh1.09bn** · **KSh621.5m** · **KSh356.2m** · **KSh1.3bn** pending bills · **KSh2.4bn** contested | `2-ev:361–366` · `3-str:20–25,31,171` · `4c:154` · `FiscalAuditPanel` |
| **KSh100m/ward** Equalization Fund (manifesto pledge) | `3-str:143,180,196,282,314` · `4a:46,97,103` · `4c:129` · `5-del:275,332,347` |
| **KSh85/kg** ndengu floor · **KSh40** farm-gate · **KSh50,000** table-banking · **KSh120M** women CBOs | `3-str:183–184,234–252` · `4a:42,93,104` |
| **KSh12+ billion** narrative statement | `3-str:168` |
| **ODPC penalties: KSh5m**, **KSh400,000**, **KSh1.85m–4.55m** | `3-str:439` · `2-ev:1378` — **data-protection enforcement, protected by brief §5.3** |
| **KSh500 notes** (opponent conduct, field-intel example) | `4b:73` |
| Own-source revenue growth strategy · "Dr. Mulu Explains" · the M&E credential · the service-delivery tracker | throughout — **the strategic centre; brief §3** |

**Also protected as non-monetary quantities** (brief §6.3): 532,758 · ~200,000 · 198,004 · 40
wards · 1,578 polling stations · 30,430 km² · 1,136,187 · 86.4%/13.6% · 22.1%/37.4%/15.3 pts ·
120,000 consented contacts · 220,000 pledged · 400 ward captains · 1,200 boda stages · every
scorecard target and baseline. **And every capability**: SMS, USSD, WhatsApp, sender ID,
shortcode, Meta/Google/TikTok/YouTube paid media, the donation page. Only the price tags go.

### 2.5 Dangling anchors — and the good news

`scripts/verify-deep-links.mjs` asserts **608 legacy ids and 240 live ids all resolve**, and it
runs on `prebuild`. **Dangling anchors cannot reach production** — the build fails first. That
is a materially better position than the brief assumes.

Legacy ids that will stop resolving (each has 3–6 generational aliases in `LEGACY_IDS`):

| Retired heading | Alias keys in `lib/heading-slug.ts` |
|---|---|
| §9.2.1 | `decision-sec-9-2-1`, `ask-sec-9-2-1` |
| §9.2.2 | `decision-sec-9-2-2`, `ask-sec-9-2-2` |
| §9.2.3 | `decision-sec-9-2-3`, `ask-sec-9-2-3` |
| §9.2.4 | `decision-sec-9-2-4`, `ask-sec-9-2-4` |
| §9.2.5 / §9.2.6 / §9.2.7 *(Decision 1)* | `decision-sec-9-2-{5,6,7}`, `ask-sec-9-2-{5,6,7}` |
| §9.2 parent *(Decision 1)* | `decision-sec-9-2`, `ask-sec-9-2`, `exec-sec-9-2`, `programme-sec-9-2` |
| §9.3.3 | `decision-sec-9-3-3`, `ask-sec-9-3-3` |
| §3.3 + §3.3.1–3.3.4 | `publishing-sec-3-3`, `channels-sec-3-3`, `channels-sec-3-3-{1,2,3,4}`, `exec-sec-3-3` |
| §6.6.1 | `evidence-sec-6-6-1`, `data-sec-6-6-1` |
| §0.4 | `delivery-sec-0-4`, `overview-sec-0-4` |

**Proposed resolution — repoint, do not delete.** A shared link should land somewhere sensible,
not 404. `decision-sec-9-2-*` → the surviving §9.3; `channels-sec-3-3-*` → §3.1 (channel
architecture); `evidence-sec-6-6-1` → §6.6; `delivery-sec-0-4` → §0.3. That preserves the
608-entry chain of custody the guard exists to protect.

**Inbound prose cross-references to repair** (each is a REWRITE row above, listed here so none is
missed): `4a:262` · `4a:418,421,430,433` · `4a:452,455` · `4a:492` · `4b:304` · `4c:250` ·
`2-ev:874` · `3-str:768` · `4e:13,21` · `5-del:36` · `1-dec:293,347,349,372,392,395,515,522`.

### 2.6 Orphaned components

| Component | Lines | Mount | Fate |
|---|---:|---|---|
| `charts/CeilingMeter.tsx` | 238 | `decision-sec-9-2-5` | **Delete** (both options) |
| `charts/SpendingCeilingChart.tsx` | ~60 | via ComplianceCeilingPanel | **Delete** |
| `markdown/ComplianceCeilingPanel.tsx` + `…PanelContent.tsx` | ~110 | `decision-sec-9-2-7` | **Delete** |
| `markdown/BudgetScenarioModeler.tsx` | ~290 | `decision-sec-9-2-5` | **Delete** (A) / rebuild without money (B) |
| `charts/TierComparisonCarousel.tsx` | ~110 | `decision-sec-9-2-6` | **Delete** (A) / survives (B) |
| `markdown/TierBadge.tsx` | ~40 | inline | **Delete** (A) / survives (B) |
| `data/spending-ceiling.ts` · `data/budget-tiers.ts` · `data/tier-matrix.ts` | 216 | — | **Delete** (A) / two survive stripped (B) |
| `components/DecisionPanel.tsx` | — | §9.3.2 + §9.2.6 tier recommendation | **`REWRITE`** — loses its tier half, keeps §9.3.2 |
| `components/MiniScorecard.tsx` | — | bottom dock | **`REWRITE`** — 3 chips → 2. **See below.** |
| `charts/BenchmarkLadder.tsx` | — | `technology-sec-6-4-2` | **`REWRITE`** — audit for the two cost benchmarks (T2-17) |
| `markdown/DataSecurityEthicsCharter.tsx` | — | `strategy-sec-6-5` | **`REWRITE`** — one row out (T1-10), charter stays |

**`MiniScorecard` needs a decision.** Losing the `Ceiling` chip leaves *Deficit* and *To win* —
two items in a rail built for three, in the sticky dock on every route. Two candidate
replacements, both already canonical figures: **`86.4% offline`** (the reach argument the whole
channel architecture rests on) or **`120,000 consented`** (the Phase 3 list target). **I
recommend `86.4% offline`** — it is the number the document's central strategic claim turns on,
and it belongs beside the deficit and the threshold. Flagging rather than choosing.

**Build guards will catch what I miss.** `verify-mounts` (42 mounts vs 240 headings),
`verify-figures` (no UI numeral without a source), `verify-deep-links` (608+240 ids),
`visual-coverage --check` (240 sections covered). All four run on `prebuild`. `visual-coverage`
is the one to watch: removing bespoke visualisations from sections that survive may drop coverage
below its threshold.

### 2.7 Word count, read time, placeholders

**Word count and read time are computed** (`ClientPage.tsx:514–521`) — no badge to update. The
brief's *"the header badge currently reads 31 min read · 6,686 wds and will be wrong"* is
half-right: the badge is not wrong now and will not be wrong after, because it is derived. What
is wrong is the **premise** — see 0.1.

Projected delta (Decision 1 Option A, Decision 3 Option B):

| | Words |
|---|---:|
| Now | **49,774** |
| Target 1 removals | −2,150 |
| Target 2 removals | −3,050 |
| Target 3 removals | −760 |
| Salvage re-added (T3-03, T3-04, T2-02b, T3-02's decision protocol) | +350 |
| **Projected** | **≈44,150** (**−11.3%**) |

Under Option B, roughly **−4,900** instead (≈44,900, −9.8%).

**Placeholders: 19 → 17.** Removed: *Dedicated USSD code quotation* (§9.2.2) and *tested
conversion rate* (§9.2.3). Retained: shortcode/sender ID, hardware-key + deepfake-vendor cost,
data-protection reviewer, qualitative facilitator, KSL interpreter, Kikamba proverbs, DSR SLA,
Week 1 baseline, surge threshold, ad kill-rate, endorsement target.

**One judgement call inside that count.** *"Hardware security key cost; deepfake detection vendor
and cost"* (§5.3.2, §5.3.5) are **costs** — Target 2 by the letter. But they are cybersecurity
procurement placeholders, not campaign spend modelling, and cutting them would leave two security
commitments with no acquisition path. **I recommend keeping both and rewording to "hardware
security key specification; deepfake detection vendor."** Row logged in 3.1.

### 2.8 Where the consent argument goes

**§4.3.1 "Why this layer decides the race"** (`4b-ground.md:258–273`), as the closing paragraph.

It is the right home for three reasons: §4.3 is the offline/SMS layer the argument constrains;
§4.3.1 already argues that this layer decides the race, and *"consented contacts compound"* is
the mechanism by which it does; and §4.3.6's consented-contact KPI ladder (15,000 → 120,000) sits
four screens below, which is exactly the evidence the paragraph asks the reader to take seriously.
The brief said §4.3 — this is the sub-section within it.

Final text (six words stripped, nothing else changed):

> The critical constraint: the campaign can only message consented numbers (Section 6.5). List
> building is therefore a KPI in its own right from Phase −1, not an afterthought — consented
> contacts are a campaign asset that compounds.

### 2.9 What must be salvaged out of §0.4 before it dies

§0.4 is not only a remote defence. Its last third is the document's **Phase −1 decision
protocol** — action required from leadership, the **15 September 2026** decision target, the
evaluation window, and the three-part *"strategic cost of inaction."* Plus the *"mathematically
undeniable candidate"* framing line. **None of that is remote-work content and none of it may be
lost.**

- **Salvage:** the CAMPAIGN DECISION PROTOCOL block and the framing sentence → relocate to §9.3.4
  (the ask) or §0.1, per Phase C.1.
- **Rewrite inside it:** *"Capital Allocation: Authorization of the initial Phase −1 budget..."*
  is Target 2 → *"Authorisation to begin Phase −1 deployment..."*.
- **Delete:** the heading, the *"not an operational compromise"* opener, and the three advantages.

**This is the single most dangerous row in the map.** A §0.4 delete-by-heading takes the
document's operational deadline with it.

---

## 3 · JUDGEMENT CALLS — the REWRITE rows I am least sure about

Listed most-uncertain first, as asked.

1. **T2-07 · §3.1.3 "Budget against reach"** — the channel thesis argued in budget shares. Escalated
   to **Decision 3** above because I do not think it can be settled inside a map row.
2. **T3-12 · The "Nairobi technocrat" holding position** — the brief's principle is *stop raising
   the objection on the client's behalf.* But this is a **pre-drafted crisis line for an attack a
   rival will make**, and the attack is on Dr. Mulu's parliamentary record, not on Firefly's
   delivery model. Deleting it removes a defence the campaign will need. **I recommend keeping it,
   retitled.** Argue me out of it if the concern is that the phrase "remote operating model"
   appears at all — in which case the retitle solves it.
3. **T1-20 · Holding row 6, "Allegation of exceeding the IEBC spending ceiling"** — same tension,
   opposite call. This one *is* campaign finance, and the remedy it names (ledger reconciliation)
   dies with §9.2.4. **Recommend delete.** But note the campaign will still face this allegation
   in 2027 and will now have no pre-drafted answer. Worth a sentence at the meeting.
4. **T2-08/09 · §6.3.1–6.3.2** — I am stripping costs from a section titled *"Component by
   component, and what each costs."* That is a retitle plus ~40 deleted sub-bullets. The
   alternative reading is that a stack section priced line by line is *entirely* a costs section
   and goes whole — which would take the technology stack with it. **I am confident the capability
   survives; I am less confident the section reads well after.** Show me the rewrite.
5. **T2-19 · §8.2.1 research programme cost column** — dropping it leaves a four-column table where
   *"Decision Unlocked"* was doing the work anyway. Low risk. Flagged only because the brief
   never mentions this table.
6. **§5.3.2 / §5.3.5 security cost placeholders** — see 2.7. Costs by the letter; security
   commitments in substance. **Recommend keep, reworded.**
7. **T1-15 · §7.2.5 monthly review row** — I am disagreeing with the brief, which says to replace
   the agenda item. The row already has two surviving outputs and a data-protection participant.
   **A cell edit, not a row replacement.** If you still want a fourth governance item, the brief's
   suggestion (consented-list growth against target) is a good one and I would add it as a *fifth*
   row rather than a substitute.
8. **T1-07 · §6.6 architecture panel** — I am cutting one of four blocks out of an ASCII diagram
   and renumbering inside it. Mechanical, but it is a hand-drawn box and it will need visual
   checking after.
9. **T2-24 · Vendor names** — see 3.4.
10. **`MiniScorecard` third chip** — 2.6. A design decision I should not take alone.

---

## 3.1 · Contradictions surfaced, not resolved

Per Guardrail 6, logged rather than fixed:

- **The regulated spending window contradicts itself.** §3.3.3 rule 6 says the lawful window
  *"begins upon formal gazettement of candidates"*; §9.2.1 says *"at least six months before
  polling."* §9.2.4 already flags this as a question for counsel. **Both sides of the
  contradiction are being deleted, which resolves it by removal rather than by decision.** If
  the campaign relies on that answer operationally, it needs to leave this document with it.
- **The KSh64.5m allocation contradicts the §3.1.3 reach targets by ~KSh14m** (§3.3.1). Also
  resolved by removal. The *underlying* strategic question — is the caravan programme over-funded
  relative to its reach? — is real and survives the money. **Recommend it moves to the meeting
  agenda, not the document.**
- **Two rows of §3.3.1 are marked *(est.)* with no source.** Printed collateral and groundgame
  reach. Dies with the table; noted because it was an honest flag and the honesty is worth keeping
  in whatever replaces it.

## 3.2 · What the removal does to the "we are careful" argument

Counting what is going: §9.2.4, §9.2.7, §3.3.3, §3.3.4, §6.6.1 and §6.6-intro block 1 are
**~1,300 words of "this vendor will not get you into trouble."** What is left to carry that
argument alone: the Digital Ethics and Data Charter (§6.5.4), the consent/opt-in discipline
(§6.5), the data-protection reviewer as a gating appointment (§6.5.5, §9.3.2 dep. 4), DPA 2019
applied (§6.1.5), the ODPC guidance still awaited (§6.1.6), §6.6.3, and the provenance-retention
practice (§6.1.2).

That is still substantial — **more than the brief's §5.3 assumes**, because §6.1.5, §6.1.6 and
§6.6.3 are not on its list. Phase C.2's job is smaller than feared: the argument does not need
rebuilding, it needs **promoting**. Concretely: §6.5 and §6.6.3 currently sit in the middle of
Strategy and Evidence respectively. Neither is anywhere near the ask.

## 3.3 · Phase D — first read (proposals only, nothing cut)

Deferred to Phase D as instructed, but two things are worth knowing now because they change its
scope:

- Phase D's premise is **seven times stronger than the brief thought** (0.1). At ~44,000 words
  post-excision, this is still a ~180-minute document.
- **The brief's own instinct to remove the read-time badge is one I would resist.** Removing the
  badge does not shorten the document; it hides the length from the one reader whose time we are
  spending. If the badge is embarrassing, the answer is Phase D, not the badge.

## 3.4 · The vendor-name question the brief asked me to answer

**Recommend: cut the vendor names from §3.3.2 (they die with the section anyway) and keep them in
§6.3.2.** The §3.3.2 list is procurement admin — *"awaiting rate card"* — and helps no one decide.
The §6.3.2 matrix is different: naming Africa's Talking, PostgreSQL/Hasura and Metabase is what
makes the stack *checkable*, and a reader who wants to test whether Firefly knows what it is
talking about will test it there. Anonymising it would cost credibility to save nine words.

---

## 4 · SELF-CHECK — Phase 0

| # | Item | Status |
|---|---|---|
| 1 | Every removal logged with class and dependents | ✅ 24 T1 + 24 T2 + 19 T3 rows |
| 2 | Removed passages preserved verbatim; archive branch exists | ⏳ Branch `archive/pre-excision` created at `4be4c43`. `/docs/REMOVED-CONTENT.md` is populated **during** Phase A — nothing removed yet |
| 3 | No surviving figure changed | ✅ **Nothing changed at all.** No product file touched |
| 4 | Zero dangling anchors / orphans / unused imports; `next build` clean | ⏳ Phase B. Baseline recorded: all five guards pass at HEAD |
| 5 | No county fiscal figure removed | ✅ **Checked.** Full protected register at 2.4 — 11 figure families, zero in any DELETE row |
| 6 | Consent argument survives with a home | ✅ §4.3.1, closing paragraph — 2.8 |
| 7 | "Kitui roles staffed locally" survives, positive-framed | ✅ T3-04 — inverted and promoted |
| 8 | §0.3 resolved to two or three constraints | ⏳ **Awaiting your approval.** Recommendation below |
| 9 | Word count / read time / placeholders recomputed | ✅ 2.7 — and the brief's baseline corrected |
| 10 | Every REWRITE judgement call listed | ✅ Ten, ranked, at §3 |
| 11 | Every Phase D item is a proposal | ✅ Nothing proposed as a cut; nothing cut |

### On §0.3 — I agree with you, and the codebase agrees harder

**Promote the selection method and the compressed window as the third constraint.** Beyond your
reasoning, three things from inside the source support it:

1. `decision-sec-0-1` mounts `<PollingTrajectorySimulator />` — the nomination timeline already
   has the document's most-used interactive component built against it.
2. §0.4 (being deleted) carries the **15 September 2026** decision target and the *"cost of
   inaction"* block. That content needs a home anyway (2.9). **§0.3 constraint 2 is that home.**
   The salvage and the gap solve each other.
3. `MiniScorecard`'s first chip is already `Deficit → decision-sec-0-1`. The reader is being
   pointed at this constraint from every screen in the document.

Draft of the rewritten module to follow in Phase C, before any build, as you asked.

---

*Phase 0 · Prepared for Firefly Management · Kitui 2027 · Nothing has been cut.*


---

## 5 · DECISIONS TAKEN, AND WHAT WAS APPLIED

All recommendations in §§0–4 were approved. This section records what that meant in practice,
including two places where executing the map corrected it.

### 5.1 The decisions, as settled

| Decision | Settled as |
|---|---|
| **1 — Budget tiers** | **Option B.** The three levels survive as *scope*. Every shilling figure and every percentage-of-ceiling is gone; team model, ward coverage, analytics depth, content cadence and research frequency remain. §9.2 is retitled **"Service levels"**, and Tier 1/2/3 become **Level 1/2/3** throughout. |
| **2 — Fundraising** | Capability stays, compliance wrapper goes — including the contribution-cap row hidden inside `DataSecurityEthicsCharter.tsx`. |
| **3 — §3.1.3** | **Option B.** Recast from *share of communications budget* to **share of communications effort**, and retitled **"Weight against reach"**. The channel thesis survives with its proof intact. |
| **§0.3** | Third constraint replaced with **the selection method and the compressed window**. |
| **MiniScorecard** | Ceiling chip → **86.4% offline**, linked to §4.3. |
| **"Nairobi technocrat" holding line** | **Kept**, retitled. It answers an attack on the candidate, not on the delivery model. |
| **Spending-ceiling holding row** | **Deleted** (T1-20). |
| **Security cost placeholders** | **Kept**, reworded to *"hardware security key specification; deepfake detection vendor."* |
| **§7.2.5** | Cell edit, not row replacement — plus a **fifth** governance row (consented-list review), as the brief suggested but as an addition rather than a substitute. |
| **Vendor names** | Cut from §3.3.2 (which died whole); **kept** in §6.3.2, where they make the stack checkable. |

### 5.2 Two corrections to this map, found while executing it

1. **`TierBadge.tsx` is not a budget-tier component.** Row T2-22 listed it for deletion. It is the
   **source-reliability badge** — *Tier 1 Official / Tier 2 Reported / Tier 3 Single-source* — used
   by **eighteen** components, and it is the visual catalogue's own *"Build — Tier badges"* item.
   It was never touched. This is also an argument for the Level 1/2/3 rename: the document was
   using "Tier" for two unrelated things on the same page.

2. **The §4.3.3 USSD cost paragraph carried the set-up timing.** T2-12 said delete the paragraph.
   Deleting it whole would have taken *"5–7 working days for a shared code; 2–4 weeks for a
   dedicated code pending operator approval"* — a delivery fact, not a price. The cost sentence
   went; the timing was promoted to a **Set-up:** line.

### 5.3 Phase C, as it actually resolved

- **C.1 — what §9 is now for.** **It dissolves under Option B.** C.1's premise was that finance and
  cost removal left §9 hollow; that was true of Option A. §9 still carries the five operational
  commitments (§9.1), the service levels (§9.2), the operating rhythm, the dependencies, what
  Firefly runs and the ask (§9.3). No restructure was made, and none is needed. Recommending one
  anyway would have been a change made to satisfy a plan rather than the document.
- **C.2 — what carries "we are careful".** As argued in §3.2, the argument needed promoting rather
  than rebuilding. Applied surgically: the ask now routes the reader to **§6.5.4** (the charter)
  and **§6.5.5** (the data-protection gate) by name, so the strongest surviving governance
  material is reachable from the document's closing page. Moving §6.5 or §6.6.3 bodily between
  files was rejected — that is a restructure, and `docs/restructure/` exists because the last one
  needed a fifty-row migration map.
- **C.3 — the new ask.** As §0.5 predicted, there was nothing to replace. The ask needed one
  adjective removed (*virtual*) and dependency 8 rewritten. The passage is otherwise untouched.

### 5.4 The visual catalogue, applied

**Part 9 — dead with the excised content.** `CeilingMeter`, `SpendingCeilingChart`,
`ComplianceCeilingPanel`(+`Content`), `BudgetScenarioModeler`, `data/spending-ceiling.ts` and
`data/budget-tiers.ts` deleted. `CostCalculator` and `TwoQuantities` never existed.

**Part 9 — cut on cost or return.** `ReachArchitecture3D` (3D terrain and pillar toggles),
`WardRegisterTicker` (looping ticker), `CrisisWarRoomMatrix` (war room dashboard),
`CampaignOrgChart` (organisation chart), and the header **read-time and word-count badge**.

> **One dissent, recorded and overridden.** §3.3 of this map argued for keeping the badge: removing
> it hides the length rather than fixing it. The catalogue cuts it explicitly, and the catalogue is
> the authority on the visual layer, so it is gone. The underlying point stands and belongs to
> Phase D: the document is still ~44,000 words.

**Part 5 — the held item resolves to Build.** *"Service level selector — depends on whether the
tiers survive as scope."* They do, so it is built: `components/markdown/ServiceLevelSelector.tsx`,
mounted at §9.2.5 in place of the deleted ceiling meter and budget modeller. One segmented control
(catalogue Part 6, *"Build — Segmented control thumb"*), one panel, and the **difference-only
matrix** from Part 5 as its default — of eight attributes, the identical rows are hidden so the
real difference between Standard and Premium is impossible to miss. Every string is read from
`data/tier-matrix.ts`; nothing is derived and no figure is invented.

**Already shipped, verified not rebuilt.** The phone pair, USSD simulator, slope chart, dot grid,
growth simulator, bullet scorecards, ward choropleth, source chips, tier badges, hatched tracks,
struck cells, the 48px single sticky bar, tabular numerals and 44px tap targets were all already
in the repository from the previous visual brief. `visual-coverage --check` confirms 229 sections
covered, 39 with a bespoke visualisation.

### 5.5 The content-integrity baseline

`scripts/verify-content-integrity.mjs` failed on the excision, exactly as §0.3 predicted (413 body
lines lost, 132 added). Per the remedy the guard's own comment sanctions, `BASE` moves to the
excision commit and `CONTENT_BASELINE=5470756` still diffs against the pre-excision text. The
chain of custody is preserved, not broken — and `archive/pre-excision` plus
`/docs/REMOVED-CONTENT.md` hold the removed prose verbatim.
