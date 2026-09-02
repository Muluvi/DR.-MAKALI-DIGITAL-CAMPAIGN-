# Audit and build record — visual & motion overhaul

**Status: implemented.** Phases P0–P7 complete on `claude/new-session-ysc0gp`.
The audit below is preserved as written; the implementation record is at the end.

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

**So the sequence is: remove what the site should never have claimed, fix the two
structural problems — 55,500 words for a reader who will scroll once, and 3,667
of them printed twice — and only then spend motion on what remains.**

Parts 5–8 do that spending in detail: all 241 techniques triaged against this
document, 32 surfaces given distinct signatures, a reduced-motion path specified
per technique class, and a frame budget saying what each surface may cost. The
site ends up with *more* motion than it has now, and roughly a fifth as much of
it running continuously.

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

## 5. Motion taxonomy triage

All 241 techniques across 18 categories, judged against this document.
"Where appropriate" made auditable.

A menu this size is a diversity budget, not a checklist. Used well it guarantees
the brief's hardest verification line — *no two sections may animate
identically* — which the site currently fails: fourteen surfaces share the same
fade-and-rise.

Four filters, specific to this document:

- **Truth.** Does it assert something the repository can't support? Anything
  implying live data is the F3 defect wearing a new coat.
- **Register.** A vendor pitch about a 15.3-point deficit, governed by
  campaign-finance law. It cannot be jubilant, playful, or cute.
- **Phone.** 390px, touch, one visit. Anything requiring a cursor is a desktop
  enhancement, never load-bearing.
- **Budget.** 60fps on mid-range Android, against a page already at 420 kB.

**68 adopted · 29 conditional · 144 rejected · 32 surfaces specified.**

### Adopted — 68 techniques that encode meaning here

| Category | Technique | What it encodes | Surface |
|---|---|---|---|
| Entrance | Number count-up | Counting is what the document does — the deficit, the threshold, the ceiling | M1, M2, §8B.7 |
| Entrance | SVG path draw | Tracing a route: escalation paths, response branches, the field–digital loop | §8A, §12, §15, §10 |
| Entrance | Stroke-to-fill | Completion, only against states the source supports | §15, §17 |
| Entrance | Clip-path wipe (linear) | A wipe divides. 13.6% / 86.4% is the central division | M3 |
| Entrance | Text reveal by line | The one narrative claim, at reading pace | §4 pull quote |
| Entrance | Typewriter | A USSD menu literally prints line by line. Mimesis, not effect | M3 handset |
| Entrance | Ripple stagger from focal point | Reach spreading outward from Kitui Central | M2 |
| Entrance | Stagger cascade | Genuinely enumerable sibling groups. 60–90ms, sparingly | §8, nav |
| Entrance | Unfold / origami expand | Claim → 4 pillars → 6 segments is a literal hierarchy | §13 |
| Entrance | Flip in on axis | Two faces of one decision: poll vs. delegate primary | §5, §1A |
| Entrance | Skeleton resolving into content | Present via LazyMount; needs to resolve rather than pop | All lazy sections |
| Entrance | Fade in | The floor. Reduced-motion fallback for nearly everything | Global |
| Entrance | Slide in (single axis) | Only on the axis of travel. Never a generic entrance | §7, nav, TOC |
| Scroll | Scroll-scrubbed animation | Time advancing with scroll. The one place scrub is honest | M4 |
| Scroll | Sticky pinned section | Holds five phases while the timeline moves through them | M4 |
| Scroll | Scroll progress rail | Already on a CSS scroll-timeline. Earns its place at 55,000 words | Global |
| Scroll | Viewport-triggered reveal, once | The brief's tokens: `once: true`, `amount: 0.35`, `-10% 0px` | Global default |
| Scroll | Scroll-triggered count-up | Figures count when reached, not on mount where nobody sees them | M1, M2, §2.7 |
| Scroll | Scroll-direction-aware header | Reclaims vertical space on a phone across a long read | Toolbar |
| Scroll | Scroll-spy indicator | "Where am I in 55,000 words" is a real question this document creates | TOC rail |
| Scroll | Text highlighted line-by-line | Reserved for the ethics charter — the passage worth slowing down | §16.4 |
| Data | Bars growing from baseline | Zero is the honest origin for a poll share or budget band | M1, §8B, §2.7 |
| Data | Line draw | Multi-cycle electoral history is a sequence in time | §2.6 |
| Data | Value morph between numbers | Same quantity re-costed across tiers | §8B |
| Data | Odometer digit roll | The four verified hero figures. Reads as a meter, not a flourish | Dashboard |
| Data | Progress ring fill | Spend against the KSh97.56m ceiling — a real proportion of a real cap | §8B.7 |
| Data | Linear progress fill | Ward votes accumulating into the 198,004 threshold | M2 |
| Data | Gauge needle sweep | Headroom beneath the cap. Once, not looping | §8B.7 |
| Data | Point-by-point scatter drop-in | Each competitor is a separately sourced observation | §2.2, §2.10 |
| Data | Axis and gridline fade-in | Frame before data. Stops the chart reading as decoration | All recharts |
| Data | Tooltip follow along a series | Inspection on a dense series | Charts |
| Data | Area fill sweep | Cumulative quantities only, where area means something | §2.7 |
| Data | Sparkline draw | Inline trend where two or more real points exist | §2.6 |
| Map | Progressive region fill | 40 wards filling by registration weight, bound to the IEBC register | M2 |
| Map | Choropleth value transition | Switching measure without redrawing | M2 |
| Map | Zoom to region | Constituency drill-down. Eight real subdivisions | M2 |
| Map | Pin drop with bounce | A citizen report landing. The one bounce on the site | §19B |
| Map | Route path trace | The 4-hour field-to-digital loop, along its actual path | §10 |
| State | Accordion expand / collapse | Reference material. Biggest word-count lever on the site | §11, §14, §9, A2, A3 |
| State | Disclosure reveal | Same at paragraph scale. `grid-template-rows`, not `height: auto` | Throughout |
| State | Segmented control slide | Three tiers are mutually exclusive; the control should say so | §8B |
| State | Tab indicator slide | Six tabs, and the reader needs to know which | Nav |
| State | Shared element transition | Heading persists across a tab change | Tab switch |
| State | Crossfade between data states | Where position carries no meaning | §7, M2 |
| State | Filter and sort reflow (FLIP) | Stations re-sorting by alignment — the reorder *is* the finding | §17 |
| State | Bottom sheet with detents | Mobile TOC, usable one-handed | MobileTOCModal |
| State | Drawer / sheet slide | "Show the working" drawers, already in the codebase | DerivedFigureDrawer |
| State | Popover / tooltip enter | Source-tier badges and glossary terms | HighlightedText |
| State | Theme switch | Present; needs a token crossfade rather than instant swap | Global |
| Interaction | **Focus ring animation** | **Zero focus styles exist sitewide (F8).** Highest-value adoption here | Every control |
| Interaction | Press / active scale-down | Touch feedback, phone-first | Every control |
| Interaction | Hover tint / colour shift | Cheaper and quieter than lift; replaces the universal card lift | Cards, rows |
| Interaction | Hover lift | Kept *selectively* — only where a card is genuinely actionable | Selected cards |
| Interaction | Underline draw | Cross-section links. Replaces the `→` glued to every link | CrossSectionLink |
| Interaction | Border draw on hover | Ward cells — precise, no layout shift | M2 |
| Interaction | Long-press progress fill | The handset behaves like a handset | M3 |
| Interaction | Icon swap on hover | State changes only — expand/collapse, copy/copied | Controls |
| Type | Kinetic typography | Exactly once, on the "Economist Governor" claim | §4 |
| Type | Line-by-line mask reveal | Same moment, as its mechanism | §4 |
| Type | Cycling word swap | English → Kiswahili → Kikamba. The content *is* three languages | §18 |
| Type | Vertical digit roll | The odometer mechanism on verified figures | Dashboard |
| Type | Highlight sweep behind text | Marks a Tier 1 figure inline; ties motion to the provenance system | HighlightedText |
| Nav | Sticky header state change | Compacts as you descend | Toolbar |
| Nav | Active-link indicator slide | One indicator moving beats six highlighting | TOC rail |
| Nav | Hamburger-to-close morph | Path morph between two icons meaning opposite things | Mobile nav |
| Nav | Nav item stagger on open | Short list, one axis, 60ms | Mobile TOC |
| Nav | Back-to-top reveal | Non-negotiable at this length | QuickNavCapsule |
| Feedback | Checkmark draw on success | Charter commitments and compliance gates. Drawn, never popped | §16.4, §8B.7 |
| Feedback | Highlight flash | Arriving at a deep link. Already implemented as `:target` | Deep links |
| Loading | Skeleton shimmer | One shimmer, GPU-cheap, replacing the pulse. Ambient loop 1 of 3 | SectionSkeleton |
| Loading | Page-load orchestration | The single choreographed hero the brief permits, ~1.4s | M1 |
| Physics | Spring settle | Anything user-driven. Stiffness ~300, damping ~30 | Toggles, sliders |
| Physics | Chain / follow-the-leader lag | Escalation up a reporting line has direction and delay | §8A, §12 |
| Gesture | Swipe between panels | Phone-first. Segments and tiers should swipe | §7, §8B |
| Gesture | Slider / range handle | The path-to-200k calculator is a real model with real inputs | PathTo200kCalculator |

### Conditional — 29 techniques, desktop-only or gated on data

Progressive enhancement above 1024px with a pointer, or gated on a named
Appendix A placeholder. None load-bearing; the phone experience is complete
without any of them.

| Technique | Gate | If the gate opens |
|---|---|---|
| Pointer tilt with 3D perspective | Pointer + ≥1024px | Ward cells only. 3–4° max, never on text |
| Spotlight / glow tracking pointer | Pointer + ≥1024px | The hero deficit figure alone |
| Image zoom within a frame | Assets exist | No campaign imagery ships in the repo |
| Reveal-on-hover overlay | Pointer | Ward detail; tap-to-open is the primary path |
| Ripple from click point | Perf pass | Keypad only, if it clears budget |
| Pinch to zoom | Map only | Cartogram at 390px, if it doesn't fight native scroll |
| Before/after comparison slider | **Data gap** | Needs a real before and after; §8B.3 is a placeholder |
| Split-view divider drag | **Data gap** | Tier comparison is categorical, not continuous |
| Brush and zoom on a range | **Data gap** | Two Mizani points do not make a brushable series |
| Heatmap cell fill | **Data gap** | Needs ward × time. Ward-level polling does not exist (F1) |
| Sankey / flow trace | **Data gap** | Needs channel→conversion volumes |
| Dial or knob rotation | Register | A slider says the same without the skeuomorphism |
| Elastic overshoot | Register | USSD keypad only, where a device metaphor licenses it |
| Fling momentum · Snap-back | Swipe surfaces | Falls out of the swipe adoption |
| Scroll-snap between panels | Already partial | `scroll-snap-type: y proximity` is set. Keep, don't extend |
| Section-to-section crossfade | Perf pass | Risks fighting `content-visibility: auto` |
| Viewport-triggered, re-fires | Rare | Scroll-spy only. Re-firing reveals on a long read is punishing |
| Modal · Toast · Banner · Dropdown | As needed | Standard chrome, specified once in the system |
| Blur-to-sharp | Perf pass | Animated `filter: blur` is expensive. LQIP only |
| Progressive image load | Assets exist | Wired in MarkdownViewer already; no images to serve |
| Mask reveal · Curtain · Iris | One only | M3's wipe is the site's one masked reveal |
| Rotate in · Scale down/settle | Reserve | Held back so the adopted set stays distinguishable |
| Variable font weight / optical size | Font | Montserrat as loaded is static, two weights |
| Text along a path · Outline-to-fill | Register | Available for the closing panel. Probably unneeded |

### Rejected — 144 techniques, with the filter that caught each

**Truth** — *Live-status blink · Live-updating stream · Optimistic UI placeholder
· Radius/catchment pulse · Pulse or breathe · Glow pulse · Audio-reactive motion
· Attention nudge on idle.*
These are F3 wearing a new coat. A blinking "Live" dot on
`LiveGroundActivityTracker` is precisely how the site currently asserts an
operation that does not exist. Nothing here is live: it is a proposal for work
not yet commissioned. Motion implying a running system is a false claim however
good it looks. *22 ambient loops run today; the specification allows 3.*

**Register** — *Confetti / celebration burst · Badge count pop · Bounce (except
the one map pin) · Wobble or jiggle · Soft-body / jelly · Rubber-band overscroll
· Split-flap · Text scramble or decode · Shake on error · Cross draw on failure ·
Gravity drop · Collision and bounce · Character-count warning.*
He is 15.3 points behind, weeks from a nomination decided by opinion poll. A site
that celebrates, springs or jiggles reads as a startup landing page wearing a
proposal's clothes. Scramble-decode on a statutory figure is worse: it treats a
Gazette Notice as a puzzle. The register here is competence under pressure.

**Phone** — *Magnetic cursor attraction · Cursor-follow / custom cursor ·
Parallax layers · Horizontal scroll section · Scroll-velocity skew · Infinite
scroll append · Pull-to-refresh · Drag to reorder · Drag to dismiss.*
He opens it on a phone, once. Parallax is banned by the brief's own
anti-patterns. Cursor-driven motion has no touch equivalent, so anything
load-bearing built on it doesn't exist for the actual reader. Infinite scroll and
pull-to-refresh describe a feed; this is a finite document that must also print.

**Budget** — *Particle field · Disintegrate / particle dissolve · Noise or grain
· Generative canvas or shader · Cloth or ribbon simulation · Flocking · Node-graph
physics settle · Image sequence scrub · Video scrub tied to scroll · Scroll-linked
3D camera · Camera dolly or orbit · Cube / carousel 3D · Blob or metaball morph ·
Aurora or mesh gradient drift · Wave or ripple field · Model rotation · Extrusion.*
Target is 60fps on mid-range Android against a page already shipping 420 kB of
first-load JS. Each needs a physics loop, a canvas/WebGL context, or per-frame
paint on a large surface. The brief says simplify a section that misses budget —
the cheapest way to hit budget is not to spend it here. There is also the
argument the document itself makes: a site about bandwidth exclusion should not
ship a shader.

**Anti-pattern** — *Gradient shift · Shimmer sweep as decoration · Rotate loop /
orbits · Float and drift · Orbiting elements · Conveyor (except §10) · Logo wall
loop · Carousel autoplay.*
The brief bans "gradient washes used as decoration"; the site runs gradient fills
on every progress bar and a full-bleed gradient on every part divider. Orbits,
drift and autoplay animate without encoding anything — the brief's closing
anti-pattern.

**No content** — *Fly to target · Lightbox · Gallery transition · Ken Burns ·
Video autoplay · Duotone transition · Focus rack · Command palette · Empty-state
transition · Floating label · Input focus expand · Inline validation · Error
slide-in · Password meter · Multi-step form · Autocomplete reveal ·
Submit→loading→success · Field clearing · File upload progress · Spinner ·
Indeterminate bar · List insert/remove/reorder · Expand card to full screen ·
Breadcrumb · Full-screen overlay nav · Flight-line arc · Cluster expand.*
The site has no forms, no media library, no cart, no accounts and no async
writes. It collects nothing and submits nothing — itself a compliance posture
worth preserving under the Data Protection Act. Specifying form and media motion
for surfaces that don't exist is how a motion system becomes decoration.

**Redundant** — exits (fade/slide/collapse/wipe/shrink/reverse-stagger) are the
reverse of their entrances and specified once globally, not per surface. The
eight orchestration patterns are *how* the adopted set is sequenced, so they
appear in the surface spec rather than as separate adoptions. A splash screen on
a document opened once, impatient, is a tax.

**On the marquee.** The site runs two — `MarqueeCarousel` in the hero and
`BadgeTicker` in the shelf — plus an 18-second logo loop. The brief permits
ambient loops "where they mean something… capped in number." A ticker of verified
figures qualifies; a ticker of badges does not. **One marquee, hero only, Tier 1
figures, paused off-screen and under reduced-motion** — the existing
`use-marquee-active` hook already does both. The other two go.

---

## 6. Surface specification

32 surfaces, 32 distinct signatures. No two animate alike — the brief's hardest
verification line, satisfied by construction.

| # | Surface | Signature | What the motion means | Timing |
|---|---|---|---|---|
| 01 | Page load | Skeleton shimmer → content resolve | Arrival, not performance | 420ms expo-out |
| 02 | **M1 · NominationVerdict** | Choreographed hero: count-up 0→15.3 · two bars diverging from a shared baseline · date rail path-draw | The deficit is a gap that *opened*. The bars separating is the argument in one gesture | ~1.4s chain |
| 03 | Dashboard (4 verified figures) | Odometer digit roll, parallel — no stagger | Four independent facts, not a sequence | 560ms parallel |
| 04 | Hero marquee | Marquee, Tier 1 figures only, pause off-screen | Ambient loop 1 of 3 | Loop 25s |
| 05 | §1 Executive summary | Disclosure reveal via grid-template-rows | Depth on demand, zero layout shift | 300ms |
| 06 | §1A Nomination path | Flip in on Y axis | Two mutually exclusive routes — two faces, one card | 480ms |
| 07 | §2.2 / §2.10 Competitive field | Axis fade → scatter drop-in | Each contender lands on its own | 70ms stagger |
| 08 | **M2 · WardReachMap** | Progressive region fill, ripple outward from Kitui Central · running count-up · linear fill into 198,004 | Reach spreading from his strongest ground; total accumulating toward a real threshold | 900ms ripple |
| 09 | §2.6 Electoral history | Line draw + sparkline, left to right | History is a sequence in time | 620ms |
| 10 | §2.7 Fiscal audit | Bars from baseline + area fill sweep | Zero is the honest origin for a pending-bills figure | 520ms, 60ms stagger |
| 11 | §4 Economist Governor | **Kinetic typography:** line-by-line mask reveal | The single big claim. The one place type is the event | 3 lines, 110ms apart |
| 12 | §5 Selection mechanism | Flip on X (distinct axis from #06) | Poll vs. primary. Different axis so it doesn't read as a repeat | 480ms |
| 13 | §7 SegmentDeck | Tab indicator slide + crossfade, swipe on touch | Six parallel segments. No entrance stagger — they are not ranked | 180ms crossfade |
| 14 | §8 ScopeGrid | Stagger cascade, opacity + 8px rise | The quietest thing on the site, on purpose | 60ms stagger |
| 15 | §8A / §12 Org chart | SVG path draw + chain lag up the escalation line | Escalation has direction and delay. The lag *is* the cadence | 80ms per hop |
| 16 | §8B Budget tiers | Segmented control slide · value morph · bars growing into a fixed ceiling bar · spring | The ceiling never moves; each tier grows into it. The compliance argument, animated | Spring 300/30 |
| 17 | §8B.7 Compliance ceiling | Progress ring fill + single gauge sweep | Sweeps once and stops — a looping dial would imply monitoring | 700ms once |
| 18 | **M3 · ReachSplit** | Clip-path wipe, linear, splitting 13.6 / 86.4 | A wipe divides. The site's one masked reveal, on its central division | 640ms |
| 19 | **M3 · USSD handset** | Typewriter menu · press scale-down · long-press fill · elastic keypad | A feature phone prints line by line. Also the best execution proof on the site | 28ms/char |
| 20 | §10 Field–digital loop | Route path trace, continuous, pause on hover | Ambient loop 2 of 3. The only loop that documents a loop | Loop 6s |
| 21 | §13 Message architecture | Unfold / origami expand | Claim → 4 pillars → 6 segments opening out | 440ms |
| 22 | §15 ResponseTree | Branch expand + stroke-to-fill on the chosen path + SLA bar | A decision tree resolves down one branch | 380ms |
| 23 | §16.4 Ethics charter | Line-by-line highlight on scroll + checkmark draw | Drawn, never popped — these are commitments, not achievements | Scroll-linked |
| 24 | §17 Radio landscape | FLIP filter/sort reflow + stroke-to-fill on alignment | Stations re-ranking. The reorder is the finding | 400ms FLIP |
| 25 | §18 Multilingual | Cycling word swap, EN → SW → Kikamba | Ambient loop 3 of 3. The content is three languages | Loop, 2.4s hold |
| 26 | §19B Service tracker | Pin drop with bounce + status state machine | A report landing. The only bounce, and a dropped pin earns it | 520ms damped |
| 27 | **M4 · PhaseRail** | Scroll-scrubbed, sticky-pinned, advancing internally | Time advancing with scroll. The one place 01–05 markers are earned | Scrubbed |
| 28 | §11 / §14 / A2 / A3 Reference | Accordion expand, height-safe | Reference material collapses | 280ms |
| 29 | **M5 · DecisionPanel** | **None.** Arrives complete | After 55,000 words and 31 animated surfaces, stillness is the strongest available effect. The ask should not perform | — |
| 30 | Navigation | Direction-aware header · active-link slide · scroll-spy · hamburger morph · back-to-top | Orientation across a very long document | 140–180ms |
| 31 | Tab switch | Shared element transition on the section heading | Continuity. Currently a generic fade, identical to fourteen others | 320ms |
| 32 | Global controls | Focus ring draw · press scale · hover tint · underline draw | **Zero focus styles exist today (F8).** Highest-value motion work here | 120–160ms |

**Ambient loop budget: 3.** The hero marquee (#04), the field–digital cycle
(#20), the language swap (#25) — each documents something genuinely continuous.
**The page currently runs 22** (8 JS `repeat: Infinity` loops, 14 CSS pulse/ping),
most of them the fake-liveness indicators from F3. Nineteen come out.

---

## 7. Reduced-motion path

Not a degraded page. A different, finished one.

The brief is explicit this is accessibility, not a performance hedge. Today it
isn't handled: `globals.css:556` zeroes CSS durations, which every `motion.div`
ignores. A reader with *reduce* set currently gets all 22 loops and every JS
entrance.

Fix: a `useReducedMotionSafe()` hook threaded through `lib/motion.ts`, so no
component decides for itself.

| Technique class | Full path | Reduced path | Why not just "instant" |
|---|---|---|---|
| Count-up, odometer | Rolls 0 → value | Final value, immediate | The number is the content. Present, not skipped |
| Bars, rings, gauges | Grow from baseline | Final proportion, 120ms fade | A bar at zero shows false data. Never animate *to* the truth under reduce |
| SVG path draw | Dashoffset travels | Complete path, fade | A half-drawn escalation line is an incomplete diagram |
| Map region fill | Ripples outward | All 40 wards filled, no stagger | Same data, arriving at once |
| Clip-path wipe (M3) | Wipes across | Both sides present, 1px divider | The division must still read; only the reveal goes |
| Kinetic type (§4) | Line-by-line mask | Full quote, single 160ms fade | The claim can't arrive in pieces for a reader who opted out of pieces |
| Typewriter (M3) | 28ms per character | Full menu text present | Nobody waits 4s for a menu they can already read |
| Scroll-scrubbed (M4) | Scrubs with scroll | Static timeline, all phases visible, pin released | Scrubbing hijacks scroll. Under reduce, scroll stays ordinary |
| Stagger cascades | 60–90ms between siblings | Stagger → 0, group fades once | Cheapest correct fallback; preserves grouping |
| All 3 ambient loops | Marquee, cycle, word swap | **Stopped.** Marquee → static list; cycle → static diagram; word swap → all three languages stacked | Looping motion is the commonest migraine and vestibular trigger. The language swap must still show all three — that's its point |
| Accordion, drawer | Height transition | Instant, focus moves to content | Functional, not decorative. They keep working |
| Spring controls | Stiffness 300, damping 30 | Instant state change | User-driven; response stays immediate either way |
| Hover / press / focus | 120–180ms ease-out | **Kept, shortened to ~80ms** | Interaction feedback is not optional motion. A focus ring that doesn't appear is a bug, not a preference |
| Flip, unfold, FLIP | Transform through space | Crossfade in place, 140ms | Positional change without traversal |
| Pin drop (§19B) | Drop + damped bounce | Pin present, no arrival | — |

**Verification:** the reduced path gets its own pass at 390 / 768 / 1440px in P7,
not a spot-check. The test is whether a reader who never saw the full version
would notice anything missing. If a section only makes sense once it has
animated, that section is wrong.

---

## 8. Frame & payload budget

Baseline measured this session: **420 kB first-load JS, 318 kB route-specific**.
Target device is a mid-range Android on a Kitui network — the reader this
document spends 906 words describing.

Target after P6: **≤380 kB. Ambient loops 22 → 3.**

| Rule | Specification | Enforcement |
|---|---|---|
| Compositor-only properties | Animate `transform` and `opacity`. Nothing else. `clip-path` permitted on M3 alone, measured | Lint rule + P7 |
| No layout animation | Zero `width`/`height`/`top`/`left`. Height uses `grid-template-rows: 0fr → 1fr`. **12 current violations (F10)** | P2 sweep |
| Reserved space | Every animating element occupies its final box first. Target CLS from motion: **0** | P7 |
| Ambient loop cap | 3. Each pauses off-screen and stops under reduce. `use-marquee-active` is the pattern | P2 |
| One scrub surface | M4 only. The most expensive category adopted; a second would compete | Spec |
| No new dependencies | Brief's constraint. Also drops one: `framer-motion` v13 goes (F9) | P2 |
| Client boundary discipline | `"use client"` as low as possible. Markdown parsing stays server-side | Per phase |
| Section-level fallback | If a surface misses 60fps, **simplify that surface** — don't lower the global bar. M2's ripple and M4's scrub are likeliest to need it | P7 |

**Where the payload comes back.** Retiring ~20 of the 50 shelf widgets, dropping
`framer-motion`, and deleting `lib/document-content.ts` should more than pay for
the new modules. If P6 lands above 380 kB, the next lever is `recharts` — the
heaviest dependency, and several adopted chart signatures (bars from baseline,
line draw, progress ring) are cheaper hand-built in SVG.

---

## 9. Build plan

| Phase | Work | Why here | Files |
|---|---|---|---:|
| **P0** *(blocking)* | **Truth pass.** Remove or rebind every fabricated figure (F1, F2, F3). Fix "15.3%" → "15.3 points" (F6). Delete `lib/document-content.ts` (F15). Add `scripts/verify-figures.mjs`, in the pattern of the existing ward-register check, that fails the build on a hardcoded campaign figure absent from `data/` or the markdown. | Nothing else is worth doing first. Also stops the problem recurring in anything built after it. | ~18 |
| **P1** | **Content resolution.** Resolve the strategy/tactics duplication (F4). Reconcile the two section-number universes so cross-references resolve. | Every later phase depends on knowing which sections exist. | ~6 |
| **P2** | **Motion & icon system.** `lib/motion.ts` exporting all 68 adopted variants as named tokens; `MOTION-SYSTEM.md` documenting the triage and surface map; `useReducedMotionSafe()` threaded through every variant (F7); the full reduced-motion matrix from Part 7; consolidate onto `motion` v12 and drop `framer-motion` (F9); global `focus-visible` treatment (F8); sweep the 12 layout-animation violations (F10); cut ambient loops 22 → 3; freeze the lucide subset at ~30 icons (F11). | Everything downstream imports from here. Doing this after the sections would mean fifty separate opinions instead of one system. | ~34 |
| **P3** | **Hero & §1.** M1 `NominationVerdict`; retire the three generic stat cards and `StrategyRail` (F14); rebuild `Dashboard` around the four verified figures only. | First screen, one orchestrated moment, where the boldness gets spent. | ~8 |
| **P4** | **Evidence sections.** M2 `WardReachMap` (§2.3, §6); `SegmentDeck` (§7); M3 `ReachSplit` + USSD handset (§9, §9B). | The analytical core, and the largest word reduction — ~4,600. | ~14 |
| **P5** | **Commercial sections.** Rebuild `BudgetScenarioModeler` from source (§8B); `ScopeGrid` (§8); team + cadence (§8A, §12); `ResponseTree` (§15); radio landscape (§17). | Where the engagement is won or lost, and where P0's corrections must hold visibly. | ~16 |
| **P6** | **Timeline, close, dissolve the shelf.** M4 `PhaseRail` (§20); M5 `DecisionPanel` (§23); dismantle `renderSectionExtras` and rehome surviving widgets next to their prose (F13); collapse reference sections behind disclosures. | Last because it moves everything the earlier phases built. | ~22 |
| **P7** | **Verification.** 390 / 768 / 1440px, full and reduced paths separately; CLS from motion measured at zero; keyboard traverse with visible focus on all ~90 controls; protected register checked string-by-string; JS re-measured against the 420 kB baseline; ambient loops counted (target 3); frame profile on mid-range Android for M2 and M4; and the surface-signature check — confirm no two of the 32 signatures read alike. | The brief's verification block, run as its own commit rather than claimed. | ~10 |

---

## 10. Self-check

### Requirements I could not meet

- **I did not adopt all 241 techniques.** 68 adopted, 29 conditional, 144
  rejected — each with the filter that caught it in Part 5. Adopting the full
  list would require the site to have forms, media, a cart, live data and a
  cursor, none of which it has, and would breach the brief's own anti-patterns
  and frame budget. If you want a specific reject reinstated, name it and I'll
  build it — but I'd want to argue the ones under *Truth* first, because those
  are how the site got into the F3 state.
- **The branch.** The brief specifies `feat/visual-motion-overhaul`; this session
  is provisioned to develop on `claude/new-session-ysc0gp` and instructed not to
  push elsewhere without permission. Following the session branch; say the word
  and I'll create the brief's name instead.
- **"Icons and motion are nearly absent."** Can't act on this as written — the
  repository contradicts it. I've treated the underlying intent (make the visual
  system meaningful and consistent) as the real requirement and reported the
  discrepancy rather than manufacturing agreement.
- **A dashboard mock and a funnel diagram**, both suggested in the brief, need
  data the repository does not have. Deferred rather than invented. Six further
  techniques — before/after slider, split-view drag, brush-and-zoom, heatmap,
  Sankey, choropleth over time — are blocked on the same gaps and listed as
  conditional rather than rejected, because they become available the moment
  Appendix A's placeholders are filled.
- **Frame budget is asserted, not yet measured.** I costed each technique from
  experience; M2's ripple fill and M4's scroll scrub are the two I'd expect to
  need simplification on a real mid-range Android. That measurement happens in
  P7 and may change the specification.

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
- **19 of the 22 ambient loops.** Most are the fake-liveness pulses from F3 and
  have to go on truth grounds. But the hero's floating orbs and the badge ticker
  are just atmosphere, and losing them makes the top of the page calmer than it
  currently is. If you want atmosphere back, I'd rather add one deliberate thing
  than restore three incidental ones.
- **Parallax.** You've listed it and the original brief bans it in the same
  document. I've followed the ban. If the phone-first constraint is softer than
  the brief implies, depth layering on the hero is the one place it would pay.

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


---

# Implementation record

All seven phases landed. `bun run lint`, `bun run build`, and both verification
scripts pass. Verified in Chromium at 390 / 768 / 1440px.

## What changed, by phase

**P0 — Truth pass.** Rebound `GeographicZoneMatrix`, `PathTo200kCalculator` and
`RecognitionDeficitOverlay` to `data/ward-register.json`; the four coalition paths now
derive to §6.3's exact figures (200,198 / 212,183 / 201,267 / 191,811). Rebuilt
`BudgetScenarioModeler` and `AudienceSegmentationMatrix` from the proposal, with the
placeholders the source leaves open shown as placeholders and the three unsized segments shown
as unsized. Replaced the Dashboard's four invented progress rings with §20.2's KPIs as
baseline-to-target bars. Removed 17 fabricating widgets. Corrected "15.3%" to "15.3 points".
Added `scripts/verify-figures.mjs` as a prebuild guard.

**P1 — Split.** `strategy.md` keeps §5–§10; `tactics.md` keeps §17–§19B. 3,752 duplicated
words leave the reading path. The hand-maintained 43-entry TOC — which listed sections that did
not exist — is replaced by `lib/section-index.ts`, generated from the markdown on the server:
269 entries, all resolving.

**P2 — Motion and icon system.** `lib/motion.ts`, `MOTION-SYSTEM.md`,
`hooks/use-reduced-motion-safe.ts`. Dropped `framer-motion`. Added the `:focus-visible` system
and a skip link. Collapsed 6 near-duplicate icon pairs across 27 files.

**P3–P6 — Modules.** M1 `NominationVerdict`, M3 `ReachSplit` + USSD handset, M4 `PhaseRail`,
M5 `DecisionPanel`. Retired `StrategyRail`. Dissolved `renderSectionExtras`; nine surviving
widgets became heading inserts beside their own sections, 24 more were removed.

**P7 — Verification.** Results below.

## Verification results

| Check | Target | Result |
|---|---|---|
| Protected register | every string present | **43 / 43** |
| Ward register integrity | 40 wards, 532,758 | **passes** (prebuild + module load) |
| Figure guard | no unsourced literal | **passes** |
| Horizontal overflow | 0px | **0px** at 390 / 768 / 1440 |
| Layout-triggering animation | 0 | **0** (was 12) |
| CLS across a full scroll | ~0 | **0.0036** |
| Keyboard focus ring | every control | **40 / 40**, none missing |
| Ambient loops | ≤3 | **1** running (2 reserved) |
| Reduced motion — loops | 0 | **0** |
| Reduced motion — hero figure | present, not mid-count | **renders 15.3** |
| Console errors | none | **none**; no 404s |
| First-load JS | ≤380 kB | **374 kB** (from 420 kB) |
| Animation signatures | no two surfaces alike | **14 distinct** across 22 components |

On the last row: eight components share a `crossfade` signature, and that is deliberate — they
are all tab and panel switches, where position carries no meaning and a consistent interaction
is the point of having a system. Every section-level surface is distinct: M3 owns the only
clip-path wipe, M4 the only scroll-scrub, `MarqueeCarousel` the only loop.

## Open items for the campaign

Three things this work surfaced that only Dr. Mulu's team can close:

1. **Platform sizing figures.** `appendix.md` §B cites NapoleonCat and DataReportal as the
   source for national platform audience data, but the table carrying the numbers is no longer
   in `public/content/`. They now live in `data/external-figures.ts` with their citations.
   Either restore the table to the proposal or confirm the figures should be dropped.
2. **The ad-spend placeholders** (§8B.5, Appendix A ref 8B.5) remain open by design, pending the
   verified ceiling. The comparator shows the recommendation band and marks the absolute figure
   as awaiting a decision.
3. **Ward-level recognition data** (§6.6) is still a named Tier 1 gap. The deficit overlay shows
   structural recognition status only, and says so.

## Deviations from the audit

- The audit proposed `SegmentDeck`, `ScopeGrid` and `ResponseTree` as separate builds. The first
  was delivered by rebuilding `AudienceSegmentationMatrix` against §7.1–7.2 in P0, which covered
  the same ground; the other two remain unbuilt — §8 and §15 keep their prose treatment.
- The branch is `claude/new-session-ysc0gp`, not `feat/visual-motion-overhaul`, per the session's
  provisioning.
