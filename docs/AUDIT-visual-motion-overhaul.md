# Pre-build audit — visual & motion overhaul

Phase 1, read-only. No application code modified. Baseline `bun run lint` and
`bun run build` both verified clean before and after.

Rendered version: https://claude.ai/code/artifact/eb7c2728-5d7f-4f4f-a11a-925c39211a66

---

## 0. Read this before the tables

The brief describes a site where "the content is largely walls of markdown
rendered through a generic renderer," where "motion is nearly absent" and "icons
are nearly absent." None of that is true of this repository.

What is actually here: a bespoke markdown pipeline that intercepts headings and
tables by content and swaps in **52 purpose-built React visualisations**; **26
files** already animating with `motion`; **89 distinct lucide icons** in use; a
five-colour campaign-phase token system; a three-tier source-provenance scheme
with badges; a build-time integrity check that verifies the IEBC ward register
sums correctly before it will compile.

The real defect is different. Alongside the verified data spine sits a second,
decorative layer — roughly fifty widgets — that **fabricates campaign figures and
renders them in the same visual language as the sourced ones**.

The document polices this explicitly. Appendix A is headed: *"Every unverified
figure in this document, consolidated. **No figure has been invented to fill any
of these.**"* The UI breaks that promise in at least eleven places.

**So this is not a proposal to add motion. It is a proposal to remove what the
site should never have claimed, then spend the remaining effort on the two
structural problems — 55,500 words for a reader who will scroll once, and 3,667
of them printed twice — that no easing curve fixes.**

### Severity classes

| Class | Meaning |
|---|---|
| **Blocking** | Ships a false claim to Dr. Mulu. Resolve before any visual work. |
| **Structural** | Costs the reader comprehension or trust. Fix during the build. |
| **Craft** | The work the brief actually commissioned. |

---

## Findings

### F1 — Ward voter figures in the UI contradict the IEBC register in this repo · BLOCKING

`data/ward-register.json` carries the Tier 1 IEBC file — 40 wards, 8
constituencies, and a prebuild script that refuses to compile unless they sum to
532,758. `components/markdown/GeographicZoneMatrix.tsx` ignores it:

| Ward | Displayed | IEBC register | Overstated by |
|---|---:|---:|---:|
| Waita | 18,920 | 10,472 | +81% |
| Mwingi Central *(not a ward)* | 21,940 | 14,525 | +51% |
| Kitui Township | 28,412 | 19,538 | +45% |
| Kyangwithya West | 22,105 | 15,931 | +39% |
| Kyangwithya East | 19,400 | 15,401 | +26% |
| Matinyani | 16,980 | 14,279 | +19% |
| Mulango | 17,200 | 15,135 | +14% |

Every figure is inflated, none matches, and "Mwingi Central" is a constituency
displayed as a ward. The zone subtotal — "134,544 (2022 baseline)" — lands near
the true Kitui Central + Kitui West sum of 136,811, which is the signature of
numbers invented to look right rather than copied from a stale source.

`RecognitionDeficitOverlay.tsx` then attaches per-ward polling baselines to the
same wards (`muluPollingBaseline: 64.2`, `kasaluPollingBaseline: 41.2`). No
ward-level poll exists; the proposal says so itself.

### F2 — The budget comparator fills in placeholders the proposal deliberately left open · BLOCKING

`operations.md` §8B.5 leaves ad spend unresolved pending the verified ceiling,
and Appendix A logs it as an open item owned by the campaign.
`BudgetScenarioModeler.tsx` answers it anyway, with numbers that do not match the
document's own recommendation bands:

| Tier | Proposal says | Component displays |
|---|---|---|
| Lean | `[Insert — recommend 15–20% of ceiling]` | 18%–22% · KSh 17.5M–21.4M · KSh 3.5M Meta ads |
| Standard | `[Insert — recommend 30–40% of ceiling]` | 38%–42% · KSh 37.0M–40.9M · KSh 12.5M ad budget |
| Premium | `[Insert — recommend 45–55% of ceiling]` | 50%–55% · KSh 48.7M–53.6M · KSh 22.0M blitz |
| SMS volume | `up to [Insert] messages/month` | 40k / 120,000 / 250k contact universes |
| USSD code | Appendix A: "vendor allocation, Phase 0" | "Shared USSD (*384#) active" |

The Premium tier also advertises *"Total share-of-voice dominance (>65%)"* — an
invented **performance guarantee** in a vendor proposal, absent from the source.

§8B exists to demonstrate that Firefly understands the Election Campaign
Financing Act. A tier comparator that invents its own percentages of a statutory
ceiling demonstrates the opposite.

### F3 — Fabricated progress metrics sit adjacent to verified ones, in the hero · BLOCKING

`Dashboard.tsx` opens with four correctly sourced figures — 22.1%, KSh13.79bn,
86.4%, ≈200k — then renders milestone rings reading "75% Wiper Nomination Target"
and "65% Mwingi-West Support". Adjacency launders them.

The pattern repeats down the widget shelf:

- `KPIDashboardGrid` — "320,000 Target Voters Segment Reach", "75% delegates Lock", "54,200 Offline SMS Log databases Complete"
- `ChecklistProgressRings` — 85% / 90% / 95% complete, on a campaign not yet engaged
- `StatusBadgeMatrix` — "Delegate Nomination Consensus: Done"
- `ProjectBurndownChart` — an "Actual Complete" trend line
- `LiveGroundActivityTracker` — four operations pulsing "Active / Synced / Live"
- `DeficitSlider`, `VoterFunnel` — "185,000 Wiper Loyalists Base"
- `AudienceSegmentationMatrix` — "44.5% of County (approx. 237,000 voters)" and two further sizings absent from source

Appendix §14 "Deliberate non-claims" lists what must never be fabricated:
*performance results, the Kitui spending ceiling, the current ward register.*
F1–F3 breach all three.

### F4 — Two of the six tabs are the same document · STRUCTURAL

Sections 17–19B of `strategy.md` and the entirety of `tactics.md` are the same
3,667 words. Diffed: the only variance is `-` vs `*` bullet markers and line
wrapping.

It also produces two colliding section-number universes. `exec.md` numbers its
own sections 1–20 with different titles, so "§17" resolves to "Earned Media &
Vernacular Radio" in one tab and "Platform-Specific Tactics" in two others.

### F5 — 55,500 words, one reader, one sitting, one phone · STRUCTURAL

Roughly four hours of reading for a man who "opens it, probably on a phone,
probably once." `exec.md` alone is 30,809 words. §2 runs 3,344; §6 runs 3,479.

The page also ships **420 kB of first-load JavaScript** (318 kB route-specific) to
argue that 86.4% of Kitui is bandwidth-excluded.

### Secondary findings

| # | Finding | Evidence | Class |
|---|---|---|---|
| F6 | **"15.3 points" rendered as "15.3%" in six places**, including at 5xl display size. A percentage-point gap stated as a percentage is a different claim about a protected number. | StrategicAids ×3, HighlightedText, BudgetScenarioModeler, ClientPage | Blocking |
| F7 | **Reduced motion is not honoured by any JS animation.** `globals.css:556` zeroes CSS transitions only; every `motion.div` ignores it. No `useReducedMotion` except the marquee hook. | globals.css:556; 26 animating files | Structural |
| F8 | **Zero `focus-visible` styles**, against ~90 interactive elements. | grep: 0 matches | Structural |
| F9 | **Two motion runtimes ship together.** `framer-motion` v13 (ClientPage, QuickNavCapsule) and `motion` v12 (24 files). | package.json + imports | Structural |
| F10 | **Layout-triggering animation in 12 places** — `width: 0 → "76%"`, `height: 0 → "auto"`. | StrategicAids ×6, ClientPage ×3, others | Craft |
| F11 | **Icon sprawl, not scarcity.** 89 distinct lucide icons with near-duplicate pairs: CheckCircle/CheckCircle2, FileCheck/FileCheck2, Users/Users2, Clock/Clock3, AlertCircle/AlertTriangle/AlertOctagon. | import analysis | Craft |
| F12 | **No motion tokens.** 20 distinct durations, 4 easings, all ad hoc. `lib/motion.ts` does not exist. | grep | Craft |
| F13 | **The widget shelf is divorced from the prose.** `renderSectionExtras()` appends ~50 visualisations after each tab's entire text. | ClientPage.tsx:350–485 | Structural |
| F14 | **`StrategyRail` is the anti-pattern list, rendered.** 01/02/03 on a non-sequence, tracked-out uppercase eyebrow, five identical rounded cards, uniform staggered fade-up, a `›` glued on hover. | StrategyRail.tsx | Craft |
| F15 | **`lib/document-content.ts` is dead code** — 76 lines of a stale, differently-worded copy of the proposal, imported by nothing. | no importers | Craft |

---

## 1. Section inventory

Word counts measured, not estimated. Failure modes are typed rather than
restated 65 times:

- **FAB** carries a fabricated figure · **DUP** printed verbatim elsewhere
- **WALL** over 1,000 words undifferentiated · **ORPHAN** visual parked far from its prose
- **BURIED** load-bearing number mid-paragraph · **REF** reference matter, should collapse
- **WORKS** already doing its job

### Tab 1 — Executive Summary · exec.md · 30,809 words

| § | Section | Words | Current treatment | 5-second takeaway | Failure |
|---|---|---:|---|---|---|
| 1 | Executive Summary | 1,501 | Prose + PollingTrajectorySimulator | 15.3 points behind; the poll, not the primary, decides | WALL BURIED |
| 1A | The Nomination Path | 103 | NominationPathPanel | Two routes to the ballot; one is live | WORKS |
| 2 | Strategic Context | 3,344 | 10 panels bound to §2.1–2.10 | Kitui's numbers, his credentials, the field | WALL FAB |
| 3 | Objectives & Commitments | 721 | Prose, two timelines | Two clocks: nomination, then general | BURIED |
| 4 | The "Economist Governor" | 610 | Prose + PullQuote | The one line the campaign hangs on | WORKS |
| 5 | Nomination Path & Deficit | 736 | Prose | An opinion poll picks the flagbearer | ORPHAN |
| 6 | Ward-Level Targeting | 3,479 | Cartogram, PathTo200k, calculator, overlay | ~200,000 votes; here is where they are | WALL FAB |
| 7 | Audience Architecture | 2,095 | AudienceSegmentationMatrix | Six segments, sized and channelled | FAB WALL |
| 8 | The Data Layer | 1,736 | Prose + tier badges | Every figure tiered and traceable | WALL |
| 9 | Channel Architecture | 1,752 | Prose, tables | 86.4% are offline; plan for both tiers | WALL ORPHAN |
| 10 | Field & Digital Integration | 1,589 | Prose, ASCII diagram | Ground intel to digital response in 4 hours | WALL |
| 11 | Technology Stack | 1,452 | Procurement tables | What gets bought, from whom | REF |
| 12 | Team & Operating Rhythm | 1,209 | Prose, matrices | Three people core, surge on triggers | ORPHAN |
| 13 | Message Architecture | 1,639 | Prose, two matrices | One claim, four pillars, six segments | WALL |
| 14 | Content Pillars & Pipeline | 1,659 | Prose, cadence tables | What gets made, weekly | WALL |
| 15 | Rapid Response | 1,541 | Prose, response tree | Four tiers, pre-drafted, timed | ORPHAN |
| 16 | Paid Media & ECFA | 1,253 | Prose, allocation table | Spend inside a KSh97.56m ceiling | BURIED |
| 17 | Earned Media & Radio | 1,325 | MediaOwnershipBlock | Kamba radio is gatekept; here's the way round | WALL |
| 18 | Multilingual Strategy | 1,232 | Prose, language tables | Three languages, per channel | ORPHAN |
| 19 | Research & Service Tracker | 1,246 | PublicServiceDeliveryTracker | A public tool residents actually use | WORKS |
| 20 | KPI Framework | 1,405 | KpiPhaseBlock | Metrics tied to votes, not vanity | ORPHAN |
| A1 | Data Gaps Register | 1,098 | DataGapsRegister | What we don't know, and who gets it | REF |
| A2 | Source & Provenance Register | 1,003 | Tables | Every citation, tiered | REF |
| A3 | Statutory Compliance Pack | 1,143 | Tables | ECFA, IEBC, DPA obligations | REF |
| A4 | Master Honesty Ledger | 937 | Tables | Assumptions and Tier 3 claims, owned | BURIED |

### Tab 2 — Strategy & Targeting · strategy.md · 5,833 words

| § | Section | Words | Current treatment | 5-second takeaway | Failure |
|---|---|---:|---|---|---|
| 5 | Communication Pillars | 206 | StrategicPillarsMatrix | Four pillars | WORKS |
| 6 | Audiences & Segments | 602 | AudienceSegmentationMatrix (reused) | Who to reach, with what | FAB |
| 7 | Geographic Dynamics | 685 | GeographicZoneMatrix | Three zones, weighted | FAB |
| 10 | Behavioural Science | 589 | PersuasionFramingMatrix | How the message is framed | WORKS |
| 17 | Platform-Specific Tactics | 405 | Prose | Per-platform playbook | DUP |
| 17A | Earned Media & Radio | 1,294 | MediaRadioLandscapeCard | The radio problem | DUP WALL |
| 18 | Multilingual Strategy | 256 | Prose | Three languages | DUP |
| 18A | Accessibility & Inclusion | 425 | Prose | KSL, plain language, commitments | DUP |
| 19 | Key Campaign Themes | 232 | Prose | What to amplify | DUP |
| 19A | Kitui Message Lab | 464 | Prose | Qualitative research design | DUP |
| 19B | Service-Delivery Tracker | 710 | PublicServiceDeliveryTracker | Report a broken borehole | DUP |

### Tab 3 — Operations & Architecture · operations.md · 10,315 words

| § | Section | Words | Current treatment | 5-second takeaway | Failure |
|---|---|---:|---|---|---|
| 8 | Remote Scope of Work | 486 | Prose, six sub-pillars | Everything Firefly runs | ORPHAN |
| 8A | Team & Operating Structure | 840 | CampaignOrgChart | Lean core, surge bench | WORKS |
| 8B | Budget & Unit Economics | 1,483 | BudgetScenarioModeler + ceiling panel | Three tiers under KSh97.56m | FAB WALL |
| 9 | Predictive Voter Modelling | 881 | Prose, data dictionary | How voters get scored | REF |
| 9A | Field–Digital Integration | 329 | Prose | The two-way loop | ORPHAN |
| 9B | Low-Connectivity Strategy | 906 | Prose + USSD ASCII menu | SMS and USSD reach the other 86.4% | BURIED |
| 11 | AI Content Optimisation | 344 | Prose | Weekly creative testing | WORKS |
| 12 | Digital Organising | 416 | Prose | Volunteer tiers, gamified | ORPHAN |
| 12A | Coalition Calendar | 422 | Prose, sequence table | Endorsements, sequenced | ORPHAN |
| 13 | Digital War Room | 657 | CrisisWarRoomMatrix | Who responds, how fast | WORKS |
| 14 | Analytics & Attribution | 733 | Prose, benchmark tables | What gets measured | REF |
| 15 | Competitive Intelligence | 344 | Prose | Watching the field | ORPHAN |
| 16 | Ethical Data Use | 1,506 | DataSecurityEthicsCharter | The published charter | WORKS |
| 16A | Campaign Cybersecurity | 1,012 | Prose | Threat model, incident plan | WALL ORPHAN |

### Tab 4 — Tactics & Themes · tactics.md · 3,667 words

| § | Section | Words | Current treatment | 5-second takeaway | Failure |
|---|---|---:|---|---|---|
| 17–19B | All seven sections | 3,667 | Identical render to Tab 2 | Nothing new | **DUP** |

### Tab 5 — Implementation & KPIs · execution.md · 2,323 words

| § | Section | Words | Current treatment | 5-second takeaway | Failure |
|---|---|---:|---|---|---|
| 20 | Phased Plan & KPIs | 1,418 | Phase-coloured headings, KpiPhaseBlock | Five phases, Aug 2026 → Aug 2027 | ORPHAN |
| 21 | Execution & Workflow | 275 | Prose | Weekly rhythm; what Firefly needs | BURIED |
| 22 | Why Remote Works | 301 | Prose | The Firefly proposition | BURIED |
| 23 | Conclusion & Call to Action | 329 | Prose. No CTA component. | *What he is being asked to do* | BURIED |

### Tab 6 — Appendix · appendix.md · 2,559 words

| § | Section | Words | Current treatment | 5-second takeaway | Failure |
|---|---|---:|---|---|---|
| — | Firefly Internal Audit | 1,837 | Prose + raw HTML cards | Firefly's own delivery plan | WALL |
| A | Placeholder Register | 391 | Table + awaiting badges | 22 open items, owned and dated | WORKS |
| B | Source Notes | 287 | Prose | Where the figures came from | REF |
| C | Data Gaps Register | 39 | DataGapsRegister | Named gaps | WORKS |

**The shape of it:** 11 sections carry a fabricated figure. 11 are printed twice.
16 are walls. 15 have a visualisation parked far from the prose it explains. Only
10 are working as intended — and those ten are the ones bound to real data in
`data/`.

That correlation is the whole diagnosis. **Where this site is bound to verified
data, it is already excellent. Where it is not, it invents.**

---

## 2. Treatment map

| Section | Text to convert | Visual form | Motion | Icons | Words cut |
|---|---|---|---|---|---:|
| **§1** Executive Summary | §1.1–1.4 diagnostic prose (1,501w) | `NominationVerdict` — one screen, three facts: the deficit at scale, the poll-not-primary mechanism, the date it closes. Rest to a disclosure. | Orchestrated ~1.4s open: deficit counts 0→15.3 while the two poll bars diverge from a shared baseline; date rail draws last. The one hero moment. | `TrendingDown`, `CalendarClock` | ~1,050 |
| **§2.3 / §6** Ward targeting | Ward prose + 40-row register (≈2,400w) | Rebuild `WardCartogram` as the section spine, **bound to `ward-register.json`**. Selecting wards accumulates toward 198,004 live. | Cartogram fills outward from Kitui Central by registration weight; running total counts up; 198,004 is a fixed threshold the bar grows into. | `MapPin`, `Vote` | ~1,900 |
| **§7** Audience architecture | Six segment profiles in parallel prose (2,095w) | `SegmentDeck` — six panels, tabbed on mobile, matrix on desktop. **Sizes shown only where the source supports them**; the rest read "not yet sized" against the §7.3 gap register. | Panel change cross-fades and slides ±12px on the axis of travel. No entrance stagger — these are parallel, not sequential. | One per segment, fixed for the life of the site | ~1,300 |
| **§9 / §9B** Channel architecture | Two-tier channel prose + ASCII USSD menu (2,658w) | `ReachSplit`: a single proportional block, 13.6% / 86.4%, opening into the channels serving each side. USSD menu becomes a working phone mock running the real Kikamba script. | The block splits once on entry — the only "big claim" moment after the hero. Keypad responds to taps, drawing the real menu. | `Wifi`, `WifiOff`, `Radio`, `MessageSquare` | ~1,400 |
| **§8B** Budget tiers | Three tier bodies + comparison table (1,483w) | **Rebuild `BudgetScenarioModeler` from source verbatim.** Ad spend renders as the document's recommendation *band* against the KSh97.56m ceiling, with the open placeholder visible as a placeholder. | Tier toggle springs (stiffness 300, damping 30) — user-driven. Ceiling bar fixed; each tier's band grows into it from zero. | `Coins`, `Scale`, `ShieldCheck` | ~700 |
| **§20** Phased plan | Five phase blocks, deliverables + KPIs (1,418w) | `PhaseRail` — scroll-linked timeline Aug 2026 → Aug 2027, using the five existing `--phase-*` tokens. Nomination and election dates as fixed anchors. | The rail draws forward as you scroll; each node fills on arrival. Genuinely sequential — the one place 01/02/03 is earned. | One per phase + `Flag` at anchors | ~800 |
| **§8** Scope of work | Six service pillars in prose (486w) | `ScopeGrid` — six icon-led cards. This *is* the offer; it currently reads as a bulleted list. | 60ms stagger, opacity + 8px rise. Deliberately quiet — its neighbours are loud. | Six, one per pillar | ~200 |
| **§12 / §8A** Team | Roles, cadence, escalation (2,049w) | Extend `CampaignOrgChart` with a cadence lane: who meets whom, how often, who decides. | Escalation path traces along its connectors on hover — cause and effect, drawn. | `Users`, `ArrowUpRight`, `Clock` | ~900 |
| **§15** Rapid response | Four-tier decision tree + SLAs (1,541w) | `ResponseTree` — a real branching diagram with response times on the branches. | Branch expands on selection; SLA clock ticks once to its value. Nothing loops. | `AlertTriangle`, `Timer`, `Send` | ~850 |
| **§17** Radio landscape | Station-by-station ownership prose (1,325w) | Promote `MediaOwnershipBlock` to section spine — stations by tier and alignment, gatekeeping status encoded in form. | Stations settle into tier bands on entry; alignment filter re-sorts with layout-safe transforms. | `Radio`, `Lock`, `Unlock` | ~700 |
| **§16 / §16A** Ethics & security | Charter + threat model (2,518w) | Keep `DataSecurityEthicsCharter`. Collapse threat model behind a disclosure under a four-item summary. | Disclosure only. This section earns trust by being sober. | `ShieldCheck`, `Lock`, `FileCheck` | ~1,100 |
| **§11, §14, §9, A2, A3** | Procurement, cadence, data dictionary, citations, statutes (≈5,000w) | All behind disclosures, each under a two-line visual summary. Reference material, not reading material. | Disclosure expand only, height-safe via `grid-template-rows`. | Section markers only | ~1,200 |
| **§23** Call to action | 329w of conclusion prose | `DecisionPanel` — the tier recommendation, what Firefly needs, the next date. **The site currently has no closing component at all.** | Arrives complete. No animation. After 55,000 words, stillness is the effect. | `ArrowRight` once, on the single action | ~150 |
| **Tab 4** Tactics | 3,667 duplicated words | Resolve the duplication (see question below). | — | — | ~3,667 |

**Note on the count.** "Words cut" means removed from the reading path, not
deleted from the repository. Every figure, commitment and tier definition
survives — relocated into a visual, or placed behind a disclosure that remains
fully readable and printable. Nothing in the protected register is touched.

---

## 3. New modules

**M1 · `NominationVerdict` — the 15.3 points, once, at scale.** Shows the deficit
as one number, the two Mizani data points producing it, and the mechanism
(opinion poll, not primary) that makes it decisive. The argument is weaker
without it because this is the reason the proposal exists, and it currently
arrives as the fourth paragraph of §1.1 with generic stat cards above it. Data:
all present — `exec.md` §1.1 table; `DerivedFigureDrawer` already documents the
37.4 − 22.1 = 15.3 derivation. Position: replaces the current hero stat trio.

**M2 · `WardReachMap` — the register, bound and honest.** Replaces
`GeographicZoneMatrix`. Shows all 40 wards by registered voters, coloured by
zone, accumulating toward 198,004 as wards are selected. Without it, the
analytical centre of the proposal is 3,479 words of prose beside a matrix that
fabricates its numbers. Data: `data/ward-register.json` — verified, Tier 1,
already integrity-checked at build. Position: §2.3 and §6, as section spine.
Ward-level *polling* stays out: it does not exist, and M2 must show that as a
marked gap where `RecognitionDeficitOverlay` currently invents it.

**M3 · `ReachSplit` + the USSD handset.** Shows 13.6% / 86.4% as one proportional
block opening into the channels serving each side; then a working phone mock
running the real `KITUI NA MULU` menu. Without it, "86.4% of your voters cannot
see any of this" — the strongest argument in the document — is a sentence. The
handset is also the best proof-of-execution artefact available: the deliverable,
demonstrated. Data: `operations.md` §9B.3 carries the exact menu. Position: §9,
and again in the Tier 2 budget panel.

**M4 · `PhaseRail` — Aug 2026 to Aug 2027, scroll-linked.** Shows five phases
against a real calendar, nomination window and election day as fixed anchors.
Without it, the answer to "when does anything happen" is five prose blocks; a
campaign timeline is the one thing here that is irreducibly sequential. Data:
`lib/phases.ts` and `execution.md` §20 — complete, including colour tokens.
Position: Tab 5, replacing the phase headings as section spine.

**M5 · `DecisionPanel` — what he is actually being asked to do.** Shows the Tier
2 recommendation, the five things Firefly needs from the campaign (§21.5), the
open items he personally owns from Appendix A, and the next date. A proposal that
ends without stating its ask is a report; this is a vendor pitch to one
decision-maker and it currently trails off into 329 words with no closing
component of any kind. Data: §21.5, §8B.6, Appendix A owner column — all present.
Position: the last thing on the page.

**Candidates from the brief I am not proposing.** A live dashboard mock (reach,
sentiment, ward-level engagement) needs reach and sentiment figures that do not
exist — it is precisely what `KPIDashboardGrid` already is, and why it has to go.
A funnel diagram needs conversion rates; §8B.3's is an open placeholder. Both
become available the moment real data does.

---

## 4. Protected content register

Verified string-by-string at the end of every phase.

| Figure | Exact text | Source |
|---|---|---|
| Poll, Jun 2026 | `Kasalu 31.3% · Mulu 20.2% · Wambua 16.3% · deficit −11.1 points` | exec.md §1.1 |
| Poll, 7 Aug 2026 | `Kasalu 37.4% · Mulu 22.1% · Ngilu 17.0% · Wambua 14.3% · deficit −15.3 points` | exec.md §1.1 |
| Deficit | `15.3-point` — points, never percent (see F6) | — |
| Expenditure ceiling | `the Kitui county-seat expenditure ceiling is KSh97.56 million` | operations.md §8B.1 |
| Gazette | `IEBC, Gazette Notice No. 12251, 7 August 2026, First Schedule` | operations.md §8B.1 |
| Connectivity | `143,340 active internet users out of a demographic base of 1,053,991 aged 3 and above` · `13.6%` · `86.4% offline` | exec.md §2.5 |
| Win threshold | `~200,000` · `198,004 votes won the 2022 seat` | exec.md §6.1 |
| Ward register | `40 wards · 8 constituencies · 532,758 (532,833 incl. 75 prison voters)` | ward-register.json |
| Resource envelope | `KSh13.79 billion` · own-source revenue `KSh1.339 billion` | exec.md §2.4 |
| Fiscal audit | `KSh 670 million in unconfirmed cash balances` · `KSh 1.3 billion in pending bills` | exec.md §4.3 |
| Delivery record | `KSh47m in bursaries to 12,573 students` | exec.md §2.1 |
| Unit economics | `Bulk SMS KSh0.25–1.06 per message` · `~KSh34,800 per network + KSh140,000 development + KSh5,000/month hosting` | operations.md §8B.2 |
| Contact universes | `Lean ~60,000 · Standard ~150,000 · Premium ~250,000` | operations.md §8B.6 |
| Compliance | `20% single-source contribution cap` · `KSh1 million audited-report threshold` | operations.md §8B.7 |
| Geography | `30,430 square kilometres` · `sixth largest` · `30% area weighting` | operations.md §8B.1 |
| Diaspora | `26 countries IEBC is opening to diaspora registration` | operations.md §8B.5 |
| Phases | `−1 Aug–Sep 2026 · 0 Sep–Oct 2026 · 1 Oct–Dec 2026 · 2 Jan–Mar 2027 · 3 Apr–Aug 2027` | lib/phases.ts, execution.md §20 |

### Structures that may not change

- **The three budget tiers** — Lean / Standard / Premium, their purposes, team
  models, channels, trade-offs, and **Tier 2 as the recommendation**. Verbatim
  from `operations.md` §8B.5–8B.6, placeholders included and visible.
- **The scope of services** — the six pillars of §8 and everything enumerated
  under §1.2.
- **The Digital Ethics & Data Charter** — all commitments in `operations.md`
  §16.4, especially "No fabricated engagement", "No disinformation",
  "Consent-based contact only. We do not buy voter contact lists."
- **Appendix A** — all 22 placeholder rows with owners and dates, under the
  heading *"No figure has been invented to fill any of these."*
- **Appendix §14 "Deliberate non-claims"** — the do-not-fabricate and
  do-not-overstate lists, both of which currently govern content the UI violates.
- **The three-tier source system** and every Tier 1/2/3 attribution.
- **Names and titles** — *Hon. Dr. Benson Makali Mulu*, MP for Kitui Central;
  *Dr. Irene Kasalu*; *Charity Ngilu*; *David Musila / Wambua*; Wiper Democratic
  Movement; Wiper Patriotic Front (WPF); Firefly Management; the confidentiality
  and `noindex, nofollow` markers.

---

## 5. Build plan

| Phase | Work | Why here | Files |
|---|---|---|---:|
| **P0** *(blocking)* | **Truth pass.** Remove or rebind every fabricated figure (F1, F2, F3). Fix "15.3%" → "15.3 points" (F6). Delete `lib/document-content.ts` (F15). Add `scripts/verify-figures.mjs`, in the pattern of the existing ward-register check, that fails the build on a hardcoded campaign figure absent from `data/` or the markdown. | Nothing else is worth doing first. Also stops the problem recurring in anything built after it. | ~18 |
| **P1** | **Content resolution.** Resolve the strategy/tactics duplication (F4). Reconcile the two section-number universes so cross-references resolve. | Every later phase depends on knowing which sections exist. | ~6 |
| **P2** | **Motion & icon system.** `lib/motion.ts` with the brief's tokens; `MOTION-SYSTEM.md`; a `useReducedMotionSafe` hook wired through every variant (F7); consolidate onto `motion` v12 and drop `framer-motion` (F9); global `focus-visible` treatment (F8); freeze the lucide subset at ~30 icons, each mapped to a concept (F11). | The brief's own sequencing, and what makes P3–P6 one system rather than fifty opinions. | ~30 |
| **P3** | **Hero & §1.** M1 `NominationVerdict`; retire the three generic stat cards and `StrategyRail` (F14); rebuild `Dashboard` around the four verified figures only. | First screen, one orchestrated moment, where the boldness gets spent. | ~8 |
| **P4** | **Evidence sections.** M2 `WardReachMap` (§2.3, §6); `SegmentDeck` (§7); M3 `ReachSplit` + USSD handset (§9, §9B). | The analytical core, and the largest word reduction — ~4,600. | ~14 |
| **P5** | **Commercial sections.** Rebuild `BudgetScenarioModeler` from source (§8B); `ScopeGrid` (§8); team + cadence (§8A, §12); `ResponseTree` (§15); radio landscape (§17). | Where the engagement is won or lost, and where P0's corrections must hold visibly. | ~16 |
| **P6** | **Timeline, close, dissolve the shelf.** M4 `PhaseRail` (§20); M5 `DecisionPanel` (§23); dismantle `renderSectionExtras` and rehome surviving widgets next to their prose (F13); collapse reference sections behind disclosures. | Last because it moves everything the earlier phases built. | ~22 |
| **P7** | **Verification.** 390 / 768 / 1440px; CLS from motion at zero; keyboard traverse; reduced-motion path complete; protected register verified string-by-string; JS budget re-measured against the 420 kB baseline; confirm no two sections animate alike. | The brief's verification block, run as its own commit rather than claimed. | ~8 |

---

## 6. Self-check

### Requirements I could not meet

- **The branch.** The brief specifies `feat/visual-motion-overhaul`; this session
  is provisioned to develop on `claude/new-session-ysc0gp` and instructed not to
  push elsewhere without permission. Following the session branch; say the word
  and I'll create the brief's name instead.
- **"Icons and motion are nearly absent."** Can't act on this as written — the
  repository contradicts it. I've treated the underlying intent (make the visual
  system meaningful and consistent) as the real requirement and reported the
  discrepancy rather than manufacturing agreement.
- **A dashboard mock and a funnel diagram**, both suggested in the brief, need
  data the repository does not have. Deferred rather than invented.

### Assumptions

- That the fabricated figures were generated, not supplied by the campaign.
  Nothing in `data/`, `sources.ts`, the markdown or `WRITING-LOG.md` supports any
  of them, and they contradict a build-verified register — but if any came from
  Dr. Mulu's team, say so and I'll source them properly instead of removing them.
- That `exec.md` is the current document and the other five tabs are earlier
  drafts retained as detail. Their section numbers collide and `exec.md` covers
  the full 1–20 structure independently.
- That "reduce reading time" outranks "preserve every sentence" where the two
  conflict — the brief says cutting words is the point.
- That the audience is one reader on a phone, once — which is why the 420 kB
  bundle is weighted as a real problem rather than a note.

### Things I'd cut that you might want back

- **The ~50-widget shelf.** Roughly 30 survive, rehomed next to their prose. The
  rest are decoration, fabrication, or both. That is a lot of existing work to
  retire and you may disagree about specific ones.
- **`StrategyRail`.** It hits five of the brief's own anti-patterns, but it is the
  only place the operating model appears as a single sequence. If kept, I'd
  rebuild it as a real process rail rather than five cards.
- **The audio briefing placard** at the top of every tab — a persistent CTA for a
  feature I could not confirm is wired to anything.
- **The three hero stat cards** ("Recognition Gap", "Low-connectivity layer",
  "Operating principle") with their 76% / 86% / 92% progress bars. Those
  percentages measure nothing; M1 replaces the slot.
- **Focus Mode and the reading-density cycler.** Genuine craft, but controls for a
  document problem that Part 2 solves by making the document shorter.

---

## One question before starting

**Tabs 2 and 4 carry the same 3,667 words.** Nothing downstream is safe to build
until that's resolved, and it changes what the site says, not just how it looks.

- **Merge.** Delete `tactics.md`, fold its sections into Strategy, drop to five
  tabs. Cleanest; loses a nav slot the reader may be using as a landmark.
- **Split.** Strategy keeps §5–§10 (audiences, geography, persuasion); Tactics
  keeps §17–§19B (platforms, radio, themes). A real division of labour, and both
  tabs get shorter.
- **Rebuild Tactics.** Something genuinely new lives there — the channel mix as a
  working system, per the brief's own candidate list.

Recommendation: **split** — smallest content change, makes both tabs honest,
needs no new material.

Also needed: should the P0 truth pass **remove** the fabricated figures outright,
or **replace each with a marked placeholder** in the style Appendix A already
uses?
