# Visual Feature Triage
## Dr. Makali Mulu Digital Campaign — Firefly Management

Triage of `docs/visual-features-brief.md` (the 22-category candidate pool) against the
repository as it stands, under the four governing rules: substitution not reduction, the
load-bearing test, mandatory progressive enhancement, and a 150KB gzipped runtime-JS budget.

Measurements in this document were taken on this branch with `npm install && npm run build`
on 11 September 2026. Every figure marked **measured** is reproducible by the commands named
beside it. Figures marked `⚑` are assumptions and are listed together in §7.

---

## 1. Normalisation report

### 1.1 Pool size

| | Count | Method |
|---|---:|---|
| Raw bullets in the brief | **534** | `grep -c '^-   ' docs/visual-features-brief.md` |
| After exact-name collapse | 472 | stemmed key match |
| **After semantic synonym collapse** | **182** | the working set for every later phase |

The brief is duplicated by roughly two thirds. 352 of the 534 bullets are a second or third
naming of a technique already present.

The existing `docs/VISUAL-FEATURE-LEDGER.md` counts the same brief at "524 bullets, about 480
distinct technique names." That count is a near-raw count — it collapses exact string repeats
and almost nothing else, which is why it produces 480 canonical names where honest semantic
deduplication produces 182. **A pool of 480 invites magpie selection; a pool of 182 can be
triaged line by line.** This is the first substantive disagreement with the prior work and it
propagates into every later section: the ledger's 282 "Live" rows are, after deduplication,
far fewer distinct decisions than the number suggests.

### 1.2 The duplication the brief itself contains

Cross-category repeats, by count of categories a single technique appears in:

| Technique | Appears in categories |
|---|---|
| Particle field | 1, 2, 4, 14, 17, 22 |
| Aurora / mesh gradient drift | 4, 13, 14, 17, 22 |
| Liquid / blob morph | 1, 4, 14, 17, 22 |
| 360° product viewer | 5, 6, 14, 21 |
| WebGL / Three.js scene | 4, 14, 17, 21 |
| Weather-like background | 4, 13, 21, 22 |
| Animated CSS pattern | 4, 13, 21, 22 |
| Clip-path wipe | 1, 2, 3, 12, 13 |
| Drawer / sheet slide | 2, 7, 15 |
| Toast / snackbar | 2, 7, 10, 11, 21 |
| Progressive image load | 1, 13, 19, 20 |
| Vertical digit roll | 8, 12 |
| Typewriter | 1, 12 |
| Ken Burns | 1, 13 |

Categories 14 (Spatial & 3D), 21 (Emerging & Niche) and 22 (Background & Environmental)
contain **no technique that is not already homed in an earlier category**. They are
restatements, not new ground. Each still receives an explicit verdict in §3.

### 1.3 Synonym groups (the 35 largest)

Canonical name ← aliases collapsed into it.

| Canonical | Aliases absorbed |
|---|---|
| Hover elevation (card lift) | hover lift · card lift effect · hover scale · button & icon scaling · floating elements |
| Number count-up | animated counter · scroll-triggered count-up · percentage counter |
| SVG path draw | SVG line drawing · line draw · sparkline draw · route path trace · checkmark draw on success · cross draw on failure |
| Clip-path wipe | clip-path reveals · clip-path shape reveal · mask reveal · image mask reveal · text reveal via masks · wipe out |
| Preloader / splash | animated preloader · branded loading sequence · curtain/shutter open · curtain reveal · logo animation · choreographed hero sequence · page-load orchestration |
| Drawer / sheet slide | drawer/sheet exit · slide-out panels · sidebar slide-in · off-canvas menu · bottom sheet with detents |
| Dropdown / menu open | dropdown animations · menu open and close · mega menu · nav item stagger · full-screen overlay nav |
| Aurora / mesh gradient drift | animated gradient background · gradient shift · mesh gradient animations · gradient mesh backgrounds |
| Particle field | particle overlay · 3D particle systems · disintegrate/particle dissolve |
| Liquid / blob morph | liquid/morphing background · liquid/fluid animation · fluid simulations · blob/metaball morph |
| Bounce / wobble / jello family | bounce · wobble · jiggle · jello · rubber band · swing · tada · text bounce · bounce out · roll out · light speed out |
| Pointer spotlight / glow | spotlight effect · glow tracking the pointer · border glow · glow pulse · pulse effect |
| Pulse / breathe loop | pulse or breathe · live-status blink · heartbeat · attention nudge · attention seekers |
| Split text (line/word/char) | kinetic typography · line-by-line mask reveal · character stagger · split text animation |
| Progressive image load | image lazy loading · lazy loading everything · image optimization · high-resolution imagery |
| Card flip (3D) | 3D card flip · flip in on an axis · axis rotation · cube/carousel rotation |
| Theme switch | dark/light toggle · colour theme selector · brand colour animations · theme persistence · logo variations |
| Shared element transition | layout animation · FLIP reflow · expand card to full screen |
| Page / route transition | View Transitions API |
| Accordion / disclosure | accordion expand and collapse · disclosure reveal · expandable cards |
| Tab indicator slide | active-link indicator slide · tab bar switch · segmented control slide |
| Tab content crossfade | tab switching animations · section-to-section crossfade · pagination transitions |
| Marquee / ticker | conveyor/belt motion · logo wall loop |
| Carousel | carousel autoplay · image carousel/slider · swipe between panels |
| Shine / shimmer sweep | shimmer sweep · shine/sweep effect · skeleton shimmer |
| Skeleton placeholder | skeleton pulse · loading skeletons · optimistic UI placeholder |
| Slider / range handle | slider handle animation · range fill · dial/knob rotation |
| Custom checkbox / toggle | toggle and switch · animated toggles · checkbox/radio custom animation |
| Spring settle | damped oscillation · elastic overshoot · collision and bounce · gravity drop · follow-the-leader lag |
| Rubber-band overscroll | fling with momentum · inertia and momentum decay · snap-back on release |
| Hardware acceleration | requestAnimationFrame · CSS containment · Web Animations API · debounced scroll handlers |
| WebGL / Three.js scene | WebGL shaders · generative canvas/shader motion · canvas generative art |
| Underline draw | hover underline animation · animated text underline · marker-style underline draw |
| Icon morph / swap | icon swap on hover · icon rotation · path morphing between icons · hamburger-to-close · animated icon sets |
| Progress ring fill | circular progress indicators · progress ring animation |

---

## 2. Repository inventory

### 2.1 What is actually here

This is not the site the existing specification was written against. `docs/VISUAL-FEATURES.md`
(F-01 to F-20) was, by its own §0, written "without read access to the deployed site or the
source files." It describes a short pitch page with a hero, a countdown and a handful of
figures.

The repository is a **47,867-word proposal document** across 19 markdown files, rendered
through one Next.js catch-all route as 19 tabs, with **241 indexed headings** (68 sub-sections
at h2, 173 parts at h3) and **39 bespoke visualisation mount points**.

| | Value | Source |
|---|---:|---|
| Content words | 47,867 | `cat public/content/*.md \| wc -w` |
| Content files | 19 | `public/content/*.md` |
| Indexed headings | 241 | `node scripts/verify-mounts.mjs` |
| — sub-sections (h2) | 68 | `node scripts/visual-coverage.mjs` |
| — parts (h3) | 173 | same |
| Bespoke visualisation mounts | 39 | `HEADING_INSERTS` in `components/MarkdownViewer.tsx` |
| Chart / panel components | 100+ | `components/charts/`, `components/markdown/`, `components/terminal/` |
| Routes | 1 catch-all, 20 static paths | `app/[[...slug]]/page.tsx` |

`docs/VISUAL-FEATURE-LEDGER.md` states 262 headings throughout. The live count is **241**.
The ledger is stale by 21 sections and its per-section table has not been regenerated since
the restructure. Its own instructions say to regenerate it; that has not been done.

### 2.2 Section classification

All 68 sub-sections, with word count (including their h3 parts), current visual coverage, and
classification. `~` in the coverage column means covered indirectly by a parent-section mount.

**CONVERTIBLE** — claim is quantitative, geographic, sequential or comparative.
**RETAINED** — claim is argument, judgement, positioning, or "if… then". Needs a home, not a chart.
**HOLLOW** — looks substantial, asserts nothing checkable. Flagged for Firefly, not for design.

| § | Section | Words | Parts | Carried by today | Class |
|---|---|---:|---:|---|---|
| 1.1 | Proposal identification | 62 | 0 | text | RETAINED |
| 1.2 | Confidentiality and use | 106 | 0 | text | RETAINED |
| 1.3 | How this proposal is structured | 241 | 0 | text | CONVERTIBLE (sequential) |
| 2.1 | The mandate | 393 | 0 | text | RETAINED |
| 2.2 | The governing constraint | 324 | 0 | `PollingTrajectorySimulator` | CONVERTIBLE ✓ |
| 2.3 | The operating conditions | 263 | 0 | text | RETAINED |
| 2.4 | What this proposal commits to | 152 | 0 | text | CONVERTIBLE (comparative) |
| 3.1 | Nomination contest and selection mechanism | 827 | 6 | `NominationPathPanel` | CONVERTIBLE ✓ |
| 3.2 | Evidence standard: provenance and source tiers | 528 | 3 | text + code block | CONVERTIBLE (comparative) |
| 3.3 | The candidate and the county | 3,438 | 10 | 10 mounts (cartogram, funnel, audit, timeline…) | CONVERTIBLE ✓ |
| 3.4 | The vote arithmetic | 3,459 | 6 | `VoteFunnel`, `PathTo200kCalculator`, `RecognitionDeficitOverlay` | CONVERTIBLE ✓ |
| 3.5 | The county's three regions | 806 | 4 | `GeographicZoneMatrix` | CONVERTIBLE ✓ |
| 3.6 | Channel reach and the digital ceiling | 1,832 | 3 | `PhoneShowcase` | CONVERTIBLE ✓ |
| 3.7 | Media ownership and access to air | 492 | 2 | `MediaOwnershipBlock` | CONVERTIBLE ✓ |
| 4.1 | Objectives for the nomination window | 358 | 2 | ~ via `ObjectivesIndex` (§11.1) | CONVERTIBLE (quantitative) |
| 4.2 | Objectives for the general election | 326 | 3 | ~ via `ObjectivesIndex` (§11.1) | CONVERTIBLE (quantitative) |
| 5.1 | The six voter segments | 1,370 | 6 | `AudienceSegmentationMatrix` | CONVERTIBLE ✓ |
| 5.2 | Segment sizing, and the evidence for it | 246 | 0 | text + code block | CONVERTIBLE (quantitative) |
| 5.3 | Segment research still outstanding | 204 | 0 | text | RETAINED |
| 6.1 | The governing claim: the Economist Governor | 581 | 3 | `EconomistGovernorThesis` | RETAINED ✓ (housed) |
| 6.2 | The four strategic pillars | 271 | 1 | `StrategicPillarsMatrix` | CONVERTIBLE ✓ |
| 6.3 | The six campaign themes | 231 | 0 | `SloganBuilder` | CONVERTIBLE ✓ |
| 7.1 | Narrative spine and message architecture | 2,962 | 4 | `MessagingPlayground`, `ToneVoiceSlider` | CONVERTIBLE ✓ |
| 7.2 | Persuasion principles and message discipline | 576 | 3 | `PersuasionFramingMatrix` | RETAINED ✓ (housed) |
| 7.3 | Language, register and dialect | 1,186 | 4 | code blocks only | CONVERTIBLE (comparative) |
| 8.1 | Scope summary and workstream boundaries | 383 | 2 | text | CONVERTIBLE (comparative) |
| 8.2 | WS1 — Owned platforms / service-delivery tracker | 668 | 7 | `PublicServiceDeliveryTracker` | CONVERTIBLE ✓ |
| 8.3 | WS2 — Content production and asset governance | 1,620 | 6 | `CommunityScheduler` (on 8.3.4 only) | CONVERTIBLE (sequential) |
| 8.4 | WS3 — AI-assisted creative and testing | 316 | 4 | table only | CONVERTIBLE (sequential) |
| 8.5 | WS4 — Accessibility and inclusion | 656 | 5 | table only | RETAINED |
| 8.6 | WS5 — Platform tactics and paid media | 406 | 0 | `MediaPlaybackMockup` | CONVERTIBLE ✓ |
| 8.7 | WS6 — Earned media, journalists and debates | 1,662 | 8 | `MediaRadioLandscapeCard`, `RadioAircoverDial` | CONVERTIBLE ✓ |
| 8.8 | WS7 — Ground-digital integration | 1,540 | 4 | `TerminalShowcase` | CONVERTIBLE ✓ |
| 8.9 | WS8 — The field-to-digital loop | 320 | 2 | `FlywheelSchematic` | CONVERTIBLE ✓ |
| 8.10 | WS9 — Offline reach: SMS, USSD and voice | 862 | 6 | `FeaturePhoneSpecimen`, `ReachSplit`, `SMSFeedbackVisualizer` | CONVERTIBLE ✓ |
| 8.11 | WS10 — Digital organising and volunteers | 396 | 5 | table only | CONVERTIBLE (sequential) |
| 8.12 | WS11 — The data layer | 908 | 2 | code block only | CONVERTIBLE (sequential) |
| 8.13 | WS12 — Predictive voter modelling | 852 | 7 | `ModelVariablesDrawer` (inline) | CONVERTIBLE (quantitative) |
| 8.14 | WS13 — The technology stack | 1,255 | 3 | code block only | CONVERTIBLE (comparative) |
| 8.15 | WS14 — Analytics and attribution | 675 | 4 | `BenchmarkLadder` (on 8.15.2) | CONVERTIBLE ✓ |
| 9.1 | Phasing, engagement to election period | 1,326 | 6 | `PhaseRail`, `KpiPhaseBlock` | CONVERTIBLE ✓ |
| 9.2 | Coalition and endorsement sequencing | 407 | 4 | table only | CONVERTIBLE (sequential) |
| 10.1 | Scope levels and what each carries | 829 | 2 | `ServiceLevelSelector`, `TierComparisonCarousel` | CONVERTIBLE ✓ |
| 10.2 | The deliverables schedule | 454 | 0 | table only | CONVERTIBLE (sequential) |
| 11.1 | The headline scorecards | 1,098 | 3 | `ObjectivesIndex` | CONVERTIBLE ✓ |
| 11.2 | Indicators, and why these | 1,530 | 4 | code blocks only | CONVERTIBLE (comparative) |
| 11.3 | The Kitui message lab | 451 | 2 | table only | CONVERTIBLE (geographic) |
| 12.1 | Engagement model and operating rhythm | 385 | 2 | `SectionPortrait` | RETAINED |
| 12.2 | Cadence and the meeting rhythm | 477 | 0 | table + code block | CONVERTIBLE (sequential) |
| 12.3 | Decision rights and content approval | 124 | 0 | table only | CONVERTIBLE (comparative) |
| 12.4 | The escalation path | 153 | 0 | code block only | CONVERTIBLE (sequential) |
| 12.5 | Data ethics, privacy and the data charter | 1,422 | 5 | `DataSecurityEthicsCharter` | RETAINED ✓ (housed) |
| 13.1 | Rapid-response protocol and opposition handling | 1,541 | 5 | `CounterMessagingGrid` | CONVERTIBLE ✓ |
| 13.2 | The digital war room | 628 | 4 | table only | CONVERTIBLE (sequential) |
| 13.3 | Cybersecurity and manipulated media | 986 | 5 | table only | CONVERTIBLE (sequential) |
| 13.4 | Competitor monitoring | 339 | 4 | table only | RETAINED |
| 13.5 | Statutory and regulatory compliance | 730 | 2 | code block only | CONVERTIBLE (sequential) |
| 14.1 | The lean core delivery model | 205 | 0 | text | RETAINED |
| 14.2 | A lean core with a defined surge | 71 | 0 | text | **HOLLOW** |
| 14.3 | The core team, retained throughout | 199 | 0 | table only | CONVERTIBLE (comparative) |
| 14.4 | Surge roles, activated by phase and scope level | 220 | 0 | table only | CONVERTIBLE (comparative) |
| 14.5 | Leadership roles and who owns what | 284 | 0 | code block only | CONVERTIBLE (comparative) |
| 14.6 | Reporting lines | 103 | 0 | code block only | CONVERTIBLE (sequential) |
| 15.1 | What the campaign must provide | 331 | 0 | table only | RETAINED |
| 15.2 | Regulatory guidance still outstanding | 251 | 0 | code block only | RETAINED |
| 15.3 | Assumptions this proposal rests on | 331 | 0 | text | RETAINED |
| 16.1 | The decision in front of the campaign | 313 | 0 | text | RETAINED |
| 16.2 | The ask | 337 | 0 | text | CONVERTIBLE (sequential) |

**Totals: 48 CONVERTIBLE · 19 RETAINED · 1 HOLLOW.**
Of the 48 CONVERTIBLE, **25 already carry a converting visual** (marked ✓) and **23 do not**.
Of the 19 RETAINED, 3 already sit inside a housing component (marked ✓ housed).

### 2.3 The one HOLLOW section

**§14.2 "A lean core with a defined surge"** — 71 words, no figure, no table, and no
checkable assertion. It restates §14.1's title as a sentence and hands off to §14.3.
Per Rule 1 this is **not a deletion decision for design to make**. It is raised here as a
copy question for Firefly: either it acquires a claim (what size is the core, what triggers a
surge, on what notice) or it merges into §14.1. Visualising it as-is would make the
emptiness conspicuous, which is the one outcome worse than leaving it alone.

### 2.4 Where the 23 unconverted CONVERTIBLE sections are

They cluster, and the cluster is informative. Sections §8.11–§8.14, §11.2, §12.2–§12.4,
§13.2–§13.5 and §14.3–§14.6 — the operational, technical and governance half of the
document — carry **7,955 words between them and not one bespoke visualisation**. Every
mount point in `HEADING_INSERTS` sits in the first half: the situation analysis, the
audiences, the messaging and the scope narrative.

That is the single largest structural finding of this inventory, and it is what Phase 3
assigns against. A reader who reaches §11.2 has passed from an instrument panel into a
plain document, at exactly the point where an economist starts checking whether the
operation is real.

---

## 3. Triage — all 22 categories, all 182 canonical techniques

Every category appears. Every canonical technique receives one verdict. A technique homed in
an earlier category is not re-judged where it re-appears; the row points to its home and the
verdict stands.

Reject grounds: **(a)** decorative only · **(b)** wrong register · **(c)** exceeds the weight
budget for value returned · **(d)** hostile to mobile/touch/low-end · **(e)** duplicates an
adopted technique · **(f)** accessibility cost · **(g)** credibility risk.

`†` marks a technique currently **live in this repository** that this triage rejects. All of
them are collected in §5.3.

### 1. Entrance & Reveal — 31 canonical

| Technique | Verdict | Reason |
|---|---|---|
| Clip-path wipe | **ADOPT** | §all 68 h2 — the heading signature that distinguishes "a new argument opens" from "a step inside one". Absorbs §1.3's paragraph explaining the numbering hierarchy. |
| Fade in | **ADOPT** | §all — the floor, and the reduced-motion fallback for everything else. |
| Number count-up | **ADOPT** | §3.4.1, §4.1–4.2, §11.1 — absorbs every sentence of the form "the threshold is N votes". |
| SVG path draw | **ADOPT** | §9.1 phasing, §8.9 field–digital loop, §12.4 escalation path, §13.1.2 response tree — absorbs the prose describing a route through stages. |
| Progressive image load | **ADOPT** | The four portraits. Enabling; already `next/image` with blur placeholder. |
| Skeleton placeholder | **ADOPT** | `SectionSkeleton` under `LazyMount` — reserves height, which is what holds CLS at 0. |
| Split text (line/word/char) | **ADOPT** | Hero title only, line-mask, once per session. The single orchestrated moment. |
| Page / route transition | **ADOPT** | The 19 tabs are real routes. View Transitions API, behind `no-preference`. |
| Blur-to-sharp | REJECT (e) | Duplicates fade-in with a filter cost on the compositor. |
| Iris open | REJECT (a) | Removes nothing. Unreachable in the current build (see §5.4). |
| Rotate in | REJECT (a) | Same. |
| Scale up / pop in | REJECT (a) | Overshoot on a metric card implies excitement about a number. Wrong register. |
| Scale down / settle in | REJECT (a) | Same, inverted. |
| Slide in (entrance) | REJECT (e) | Duplicates clip-path wipe as a section entrance. |
| Stagger cascade | REJECT (a) | Adopted only as a property of the adopted reveals, not as a technique in its own right. |
| Ripple stagger from focal point | REJECT (a) | Decorative refinement of stagger. |
| Fold / unfold | REJECT (a) | Origami on a proposal document. |
| Card flip (3D) | REJECT (d) | A flip hides one face behind a gesture. Fights Rule 1. |
| Ken Burns pan and zoom † | REJECT (a) | A slow zoom on a portrait of the candidate is campaign-poster register, and it is a 22-second looping transform above the fold. |
| Parallax hero / layers † | REJECT (a) | Pre-judged. Removes nothing; costs scroll-linked work on a mid-range Android. |
| Particle field † | REJECT (a) | Pre-judged. |
| Liquid / blob morph † | REJECT (a) | Pre-judged. |
| Pointer spotlight / glow † | REJECT (a) | Pre-judged (shimmer/glow decorative). No hover on the likely device. |
| Typewriter † | REJECT (b) | Pre-judged. Simulated typing on a document about trust in figures reads as theatre. |
| Text shadow / 3D text | REJECT (b) | Pre-judged. |
| Outline-to-fill text | REJECT (a) | No outlined mark in this document needs a second state. |
| Glitch | REJECT (b) | Pre-judged. |
| Preloader / splash | REJECT (c) | Time added before a reader on a slow link sees anything. |
| Lottie | REJECT (c) | Runtime + JSON for animations CSS keyframes already produce here. |
| Video background / autoplay | REJECT (c) | No video asset exists. Bandwidth with no argument behind it. |
| Bounce / wobble / jello family | REJECT (b) | Pre-judged. |

### 2. Exit & Dismissal — 13 canonical (8 homed, 5 cross-listed)

| Technique | Verdict | Reason |
|---|---|---|
| Drawer / sheet slide | **ADOPT** | `MobileTOCModal`, `ReadingSettingsSheet`, `DerivedFigureDrawer`, `ModelVariablesDrawer` — houses the methodology and model-variable prose from §8.13.4 without moving it out of reach. |
| Fade out | REJECT (e) | Already the exit half of the adopted route transition. |
| Modal enter/exit | REJECT (e) | Duplicates drawer/sheet. |
| Slide out | REJECT (e) | Same. |
| Scale and fade collapse | REJECT (e) | Same. |
| Shrink to origin | REJECT (a) | Decorative. |
| Fly to target | REJECT (a) | No cart, no destination. |
| Toast / snackbar | REJECT (a) | Nothing on this page performs an action that needs confirming. |
| Clip-path wipe · Card flip · Particle field · Stagger cascade · Bounce family | — | See §1. |

### 3. Scroll-Driven & Scroll-Triggered — 23 canonical (18 homed, 5 cross-listed)

| Technique | Verdict | Reason |
|---|---|---|
| Scroll progress rail | **ADOPT** | `PhaseRail`, §9.1 — reading position doubles as position in the campaign calendar. Absorbs the prose in §9.1 that names each phase window. |
| Scroll-spy indicator | **ADOPT** | 241 sections. The index has to say where you are or it is a list, not a map. |
| Sticky header state change | **ADOPT** | `SectionStickyBar` — keeps the section number visible through a 3,459-word section (§3.4). Absorbs nothing; earns its place as the navigation of a document this long, which is a structural claim about §1.3. |
| Sticky pinned section | **ADOPT** | §9.1 phasing — the five phases advance against a pinned timeline. Absorbs the phase-by-phase narrative ordering. |
| Viewport reveal (fires once) | **ADOPT** | Every figure and table in all 241 sections. `once: true`; never re-fires. |
| Highlight sweep behind text | **ADOPT** | `HighlightedText` — marks Tier-1 sourced figures inside running prose. Absorbs §3.2.1's paragraph asserting that every figure carries provenance, by showing which ones do. |
| Back-to-top reveal | **ADOPT** | A 47,867-word document. Utility, not decoration. |
| Counter re-fire on re-entry | REJECT (g) | A number that recounts looks like an animation rather than a measurement. |
| Tab content crossfade | REJECT (e) | Duplicates the adopted route transition. |
| Scroll-scrubbed animation | REJECT (d) | Scroll-linked work per frame on the target device. |
| Scroll-linked colour shift | REJECT (a) | Encodes nothing the phase rail does not already encode. |
| Zoom/rotate on scroll | REJECT (a) | Decorative. |
| Focus rack / DoF blur | REJECT (d) | Filter on scroll; expensive and removes nothing. |
| Horizontal scroll section | REJECT (d) | Hides peer content off-axis with no indication of extent. |
| Scroll-snap between panels | REJECT (d) | Takes scroll position away from the reader in a document they need to scan. |
| Infinite scroll | REJECT (f) | Pre-judged. Breaks in-page find and the footer. |
| Scroll-linked video / image sequence | REJECT (c) | Pre-judged. No asset. |
| Camera dolly / orbit | REJECT (c) | Pre-judged. |
| Clip-path wipe · Number count-up · Parallax · Slide in · Stagger | — | See §1. |

### 4. Continuous & Looping — 18 canonical (16 homed, 2 cross-listed)

Whole-category verdict: **REJECT, with no exception.** A loop implies a running system.
`MOTION-SYSTEM.md` states the position correctly and this triage endorses it: *"Nothing on
this page is live: it is a proposal for work not yet commissioned."* Every technique in this
category asserts liveness the engagement does not yet have. The repo's own budget of three
permitted ambient loops is **reduced to zero** by this triage — see §5.2.

| Technique | Verdict | Reason |
|---|---|---|
| Marquee / ticker † | REJECT (g) | Pre-judged for content that matters. `WardRegisterTicker` scrolls real IEBC ward figures past the reader at 36px/s — the one dataset an economist will want to stop and read. |
| Carousel † | REJECT (a) | Pre-judged. `TierComparisonCarousel` hides peer content behind a swipe. §10.1.2's table stays. |
| Pulse / breathe loop † | REJECT (g) | Includes live-status blink. False claim of liveness. |
| Shine / shimmer sweep † | REJECT (a) | Pre-judged as decorative. Retained only inside `SectionSkeleton`, which is a loading state, not ambient. |
| Float / drift loop † | REJECT (a) | Pre-judged. |
| Aurora / mesh gradient drift † | REJECT (a) | Pre-judged. |
| Grain / noise overlay † | REJECT (a) | Pre-judged; fails the load-bearing test by the existing spec's own admission (F-14). |
| Animated CSS pattern † | REJECT (a) | Pre-judged. |
| Weather-like background † | REJECT (b) | Pre-judged. In a county whose §3.3.8 is about drought, animated weather is worse than decorative. |
| Wave / ripple field | REJECT (a) | Pre-judged. |
| Audio-reactive motion | REJECT (b) | Pre-judged. |
| WebGL / Three.js scene | REJECT (c) | Pre-judged. |
| Ray marching | REJECT (c) | Pre-judged. |
| Caustics | REJECT (c) | Pre-judged. |
| Post-processing | REJECT (c) | Pre-judged. |
| Displacement | REJECT (c) | Pre-judged. |
| Liquid / blob morph · Particle field | — | See §1. |

### 5. Interaction-Driven (Hover, Focus, Cursor) — 26 canonical (23 homed, 3 cross-listed)

| Technique | Verdict | Reason |
|---|---|---|
| Focus ring animation | **ADOPT** | Every interactive element. A focus ring that never appears is a bug, not a preference. |
| Press / active scale-down | **ADOPT** | Tap feedback on touch, where hover does not exist. |
| Tooltip enter | **ADOPT** | `FootnotePopover` — houses source and provenance notes from §3.2 without breaking the sentence they qualify. A text-housing feature under Rule 1. |
| Custom cursor / cursor follow † | REJECT (b) | Pre-judged twice over. Currently ships a dot and a lagging ring driven by a `requestAnimationFrame` loop on `pointermove`. |
| Magnetic pointer attraction † | REJECT (a) | Pre-judged as an attention-seeker. |
| Hover elevation (card lift) † | REJECT (d) | Pre-judged. No hover on the device this is most likely opened on. |
| 3D pointer tilt † | REJECT (d) | Same, plus a perspective transform per frame. |
| Parallax on hover | REJECT (d) | Same. |
| Pointer spotlight / glow † | REJECT (a) | See §1. |
| Background slide on hover | REJECT (a) | Decorative. |
| Border draw on hover | REJECT (a) | Decorative. |
| Underline draw | REJECT (a) | A link that is already a link. |
| Image zoom in frame | REJECT (a) | Decorative. |
| Reveal-on-hover overlay | REJECT (f) | Hides content behind a gesture half the readers do not have. |
| Icon morph / swap | REJECT (a) | Decorative. |
| Click ripple | REJECT (e) | Duplicates press scale-down. |
| Highlight flash | REJECT (a) | Decorative. |
| Link arrow animation | REJECT (b) | Pre-judged: no arrows appended to button text. |
| Long-press confirm | REJECT (f) | No destructive action to confirm; hostile to motor impairment. |
| Shape morph | **CONDITIONAL** | §8.14 technology stack, if the component diagram needs state changes between procurement options. Precondition: Firefly confirms the stack has more than one candidate configuration to show. |
| Submit button state morph | REJECT (a) | No form submits anything. |
| Floating label | REJECT (a) | No form. |
| Neon glow / text | REJECT (b) | Pre-judged. |
| 360 product viewer | REJECT (c) | Pre-judged. |
| Focus ring · Tooltip · Underline (cross-listed) | — | As above. |

### 6. Gesture & Drag — 10 canonical

| Technique | Verdict | Reason |
|---|---|---|
| Slider / range handle | **ADOPT** | `PathTo200kCalculator` (§3.4.3), `PollingTrajectorySimulator` (§2.2), `ToneVoiceSlider` (§7.1). Absorbs §3.4.3's four worked routes to the threshold — he moves the input and watches the arithmetic. |
| Custom checkbox / toggle | **ADOPT** | `ServiceLevelSelector` (§10.1.1) — absorbs the prose comparing the three scope levels. |
| Before/after comparison slider | **CONDITIONAL** | §3.3.6, three election cycles. Precondition: Firefly confirms a 2017-vs-2022 ward comparison is a claim it wants to make; the results in that section are partly disputed (`data/disputed-figures.ts`), and a slider implies a settled before and after. |
| List reflow | REJECT (a) | `InteractiveTable` already sorts; animating the reflow adds nothing. |
| Custom scrollbar | REJECT (f) | Replaces a system affordance with a worse one. |
| Drag to reorder | REJECT (a) | Nothing here is the reader's to reorder. |
| Drag to dismiss | REJECT (f) | Nothing should be dismissible in a document under Rule 1. |
| Pinch to zoom | REJECT (e) | The browser already does this; overriding it is an accessibility cost. |
| Rubber-band overscroll † | REJECT (a) | Decorative. |
| Shake-to-undo | REJECT (b) | Pre-judged. |

### 7. Layout & State Transitions — 13 canonical

| Technique | Verdict | Reason |
|---|---|---|
| Accordion / disclosure | **ADOPT** | `ProseFold`, `DisclosureGroup`, native `<details>`. **The primary text-housing primitive.** Holds the retained prose of all 19 RETAINED sections and the explanatory layer of the 48 CONVERTIBLE ones. Degrades to fully expanded. |
| Tab indicator slide | **ADOPT** | The 19 document tabs. Encodes which of sixteen numbered sections is open. |
| Animated infographic (click-stepped) | **ADOPT** | §13.1.2 four-tier response tree, §8.9 field–digital loop, §12.4 escalation path. Reader-driven steps, not autoplay. Absorbs the longest sequential prose blocks in the document. |
| Shared element transition | REJECT (c) | The deep-link jump is instantaneous already; morphing it costs layout work for no argument. |
| Theme switch | REJECT (a) | One considered palette, argued in `globals.css`. A second is a second set of contrast decisions to get wrong. |
| Masonry / bento layout | REJECT (b) | Pre-judged: identical cards flatten hierarchy. |
| Empty / crossfade data state | REJECT (a) | No async data states on a static document. |
| Dropdown / menu open | REJECT (e) | Duplicates the adopted drawer/sheet. |
| Badge pop | REJECT (a) | Decorative. |
| Banner slide-down | REJECT (a) | Nothing to announce. |
| Command palette | REJECT (c) | A search UI over 241 sections is a real idea, but the browser's own in-page find already works and Rule 1 requires it keep working. |
| Animated search expand | REJECT (a) | No search. |
| Live typing indicator | REJECT (g) | Implies a person typing. Nothing is live. |

### 8. Data & Chart Visualizations — 17 canonical

| Technique | Verdict | Reason |
|---|---|---|
| Bars growing from baseline | **ADOPT** | §3.3.3 ward baseline, §8.15.2 benchmarks, §3.4.4 constituency weight. Absorbs every ranked comparison currently set as a table. |
| Choropleth value transition | **ADOPT** (see §9) | §3.3.3 / §3.5 ward cartogram. |
| Heatmap cell fill | **ADOPT** | §3.5.4 zone weighting, §5.1 segment matrix, §7.1.2 message-by-segment assignment. Absorbs the three largest cross-tabulations in the document. |
| Gauge needle sweep | **ADOPT** | §13.1.3 response times by channel, §8.7 radio air-cover. Absorbs the SLA sentences. |
| Progress ring fill | **ADOPT** | §11.1 scorecards, §3.4.5 recognition deficit. Absorbs percentage-of-target prose. |
| Value morph | **ADOPT** | §3.4.3 calculator output, §2.2 trajectory simulator — the number changes because an input changed, which is the claim. |
| Vertical digit roll | **ADOPT** | Countdown to 10 August 2027 only, per the pre-approved list. Nowhere else. |
| Data point highlight | **ADOPT** | The stable inspect panel on §3.3.3 wards and §3.4.2's 40-ward ranking. Houses the per-ward note; this is F-17's mechanism. |
| Chart tooltip follow | REJECT (d) | A cursor-following tooltip has no touch equivalent and moves the thing you are trying to read. The adopted inspect panel is position-stable. |
| Area fill sweep | REJECT (e) | Duplicates SVG path draw on the same charts. |
| Radial / pie sweep | REJECT (a) | Angle is the least accurate encoding available; bars already adopted. |
| Axis fade-in | REJECT (a) | Fading in the frame of reference before the data is backwards. |
| Scatter point drop-in | REJECT (a) | §3.3.2's quadrant chart reads at rest. |
| Linear progress fill | REJECT (e) | Duplicates bars from baseline. |
| Sankey / flow trace | REJECT (c) | §3.4.1's funnel already carries the flow claim; a Sankey needs a layout library. |
| Brush and zoom | **CONDITIONAL** | §3.4.2, the 40 wards ranked. Precondition: Firefly confirms the 40-row list tests badly on a phone. If the ranked bar chart is legible at 320px, this is weight for nothing. |
| Live-updating stream | **CONDITIONAL → effectively CUT** | §13.2 war room. Precondition: a real monitoring feed exists and Firefly will stand behind it. No such source is in the repository. Under Constraint 3 a feature with no real data source is cut, not faked. |
| Force-directed settle | REJECT (d) | Pre-judged. |

### 9. Map & Geography — 5 canonical

| Technique | Verdict | Reason |
|---|---|---|
| Choropleth value transition | **ADOPT** | §3.3.3 / §3.5 — `WardCartogram` over the verified 40-ward, 8-constituency IEBC register. **The single highest-value conversion in the document.** Absorbs §3.3.3, §3.4.2 and §3.5.4's prose claiming ward-level granularity: a candidate tests a map of his own county against what he knows, and if it holds, credibility transfers to everything else on the page. |
| Zoom to region | **CONDITIONAL** | §3.5's three zones. Precondition: the cartogram can support it without a geo projection library at runtime. The current component is a pre-baked cartogram, so this is a layout question, not a data one. |
| Catchment pulse | REJECT (a) | §8.10's reach claim is carried better by `OfflineWaterline`, which shows the gap rather than pulsing at it. |
| Pin drop | REJECT (a) | No point data. The unit of analysis is the ward. |
| Flight-line arc | REJECT (a) | §5.1.6's diaspora is a segment, not a set of journeys. |

### 10. Feedback & Attention — 4 canonical

Whole-category verdict: **REJECT.** The document has no form, no submission, no destructive
action and nothing to celebrate.

| Technique | Verdict | Reason |
|---|---|---|
| Form field validation | REJECT (a) | No form. |
| Shake on error | REJECT (b) | Pre-judged. |
| Character count warning | REJECT (a) | No input. |
| Confetti burst | REJECT (b) | Pre-judged. |

### 11. Loading & Progress — 3 canonical (rest cross-listed)

| Technique | Verdict | Reason |
|---|---|---|
| Spinner | REJECT (e) | The adopted skeleton reserves height; a spinner does not, and CLS is the budget line that matters. |
| Multi-step form transition | REJECT (a) | No form. |
| Animated favicon | REJECT (b) | Pre-judged. |
| Skeleton placeholder · Progress ring · Linear progress · Shimmer · Toast | — | See §1, §8, §4, §2. |

### 12. Typographic Effects — 10 canonical

| Technique | Verdict | Reason |
|---|---|---|
| Responsive fluid type | **ADOPT** | The reading-token ramp in `globals.css`. A 47,867-word document read on a 320px screen. |
| Variable font axis animation | **CONDITIONAL** | §2.1 hero only. Precondition: Montserrat's width axis survives the `next/font` latin subset, and the animation runs once per session. If the hero already lands without it — and it does today — cut. |
| Gradient text † | REJECT (a) | Pre-judged. |
| Drop cap † | REJECT (b) | Pre-judged. |
| Text scramble / decode † | REJECT (b) | Pre-judged. Scrambling a figure before settling on it, in a document whose §3.2 is an evidence standard, is the worst possible pairing of technique and content. |
| Split-flap board † | REJECT (b) | Pre-judged as decorative use. |
| Letter-spacing animation | REJECT (a) | Decorative. |
| Cycling word swap | REJECT (a) | §6.3's six themes are peers; cycling them hides five of six. |
| Text along a path | REJECT (f) | Wrecks selection and in-page find. |
| Custom font pairing | REJECT (e) | Not a technique — a settled fact of the design. Folded into font loading strategy. |

### 13. Media (Images & Video) — 6 canonical

| Technique | Verdict | Reason |
|---|---|---|
| Image crossfade | REJECT (a) | Four portraits, each anchored to one section. Nothing to cross-fade between. |
| Lightbox | REJECT (a) | No gallery. |
| Duotone / colour grade | REJECT (b) | Grading a photograph of the candidate is campaign-poster register. |
| Photo frame effect | REJECT (b) | Same. |
| Glassmorphism † | REJECT (a) | A blur behind a panel is cost on a mid-range GPU for no encoded meaning. |
| Gradient divider † | REJECT (b) | Pre-judged: template chrome. A hairline rule says the same thing. |
| Ken Burns · Video · Progressive image load · Animated CSS pattern · Weather | — | See §1, §4. |

### 14. Spatial & 3D — 0 homed, 12 cross-listed

Whole-category verdict: **REJECT in full.** Every technique in this category is a restatement
of one already judged in §1, §4, §5 or §17. Nothing in this document has a third dimension:
the claims are quantities, places, sequences and comparisons, all of which are flat.

Cross-listed: Card flip (3D) · Fold/unfold · Text shadow/3D text · Particle field · Liquid/blob
morph · Aurora/mesh drift · WebGL/Three.js · Ray marching · Caustics · Post-processing ·
Displacement · Camera dolly/orbit · 3D pointer tilt · Parallax on hover · 360 product viewer ·
Shape morph (CONDITIONAL, §5) · Cloth/soft-body (§17).

### 15. Navigation — 2 homed, rest cross-listed

| Technique | Verdict | Reason |
|---|---|---|
| Breadcrumb transition | REJECT (e) | The section number *is* the breadcrumb. `SectionStickyBar` already shows it. |
| Dynamic island mimicry | REJECT (b) | Pre-judged. |
| Scroll-spy · Sticky header · Back-to-top · Tab indicator · Drawer · Dropdown · Icon morph · Badge pop · Animated search · Custom scrollbar · Theme switch | — | See §3, §7, §5, §6. |

### 16. Form Interactions — 4 homed, rest cross-listed

Whole-category verdict: **REJECT.** There is no form on this site and Constraint 1 forbids
adding one that would collect anything.

| Technique | Verdict | Reason |
|---|---|---|
| File upload progress | REJECT (a) | No upload. |
| Password strength meter | REJECT (a) | No account. |
| Autocomplete reveal | REJECT (a) | No input. |
| Field clearing | REJECT (a) | No input. |
| Slider/range · Custom checkbox/toggle | **ADOPT** | See §6 — adopted as *controls on a model*, not as form fields. |
| Floating label · Submit morph · Inline validation · Shake on error · Character count · Multi-step · Shake-to-undo | — | See §5, §10, §11, §6. |

### 17. Physics & Procedural — 2 homed, rest cross-listed

| Technique | Verdict | Reason |
|---|---|---|
| Spring settle | REJECT (a) | Adopted only as the easing of the two adopted sliders, not as a technique. Elsewhere it is overshoot on a number, which reads as imprecision. |
| Cloth / soft-body simulation | REJECT (c) | Pre-judged. |
| Particle field · Wave/ripple · Grain · Aurora · Liquid · WebGL · Force-directed · Rubber-band | — | See §4, §6, §8. |

### 18. Orchestration Patterns — 3 canonical

| Technique | Verdict | Reason |
|---|---|---|
| prefers-reduced-motion support | **ADOPT** | Mandatory under Rule 3. Two halves required — the CSS zeroing and `useReducedMotionSafe()` threaded through `variantsFor()`. |
| Interruptible transitions | REJECT (e) | An implementation property of `lib/motion.ts`, not a technique with a section to serve. |
| Loop pause on hover | REJECT (e) | No loops survive §4. |

### 19. Accessibility & Performance — 5 canonical

Whole-category verdict: **ADOPT in full.** These are the enabling layer Rule 3 and Rule 4
depend on. None carries an argument by itself; all five are preconditions for the baseline
tier carrying the same argument as the enhanced tier.

| Technique | Verdict | Reason |
|---|---|---|
| Progressive enhancement | **ADOPT** | Rule 3. Every disclosure container renders expanded with JS off. |
| Intersection Observer | **ADOPT** | Every reveal and counter. Never a scroll listener. |
| Hardware acceleration | **ADOPT** | Transform and opacity only; `grid-template-rows: 0fr → 1fr` for height. |
| Font loading strategy | **ADOPT** | `next/font/google`, self-hosted, latin subset, `display: swap`, `adjustFontFallback`. |
| Critical CSS | **ADOPT** | Rule 4. The 32KB gzipped stylesheet is the largest single non-JS asset; see §5.1. |

### 20. Brand & Theme — 2 homed, rest cross-listed

| Technique | Verdict | Reason |
|---|---|---|
| Time-of-day ambient shift † | REJECT (b) | Pre-judged. |
| Seasonal theme | REJECT (b) | Pre-judged. |
| Theme switch · Custom scrollbar · Gradient divider · Animated favicon · Icon sets · Progressive image load | — | See §7, §6, §13, §11, §5, §1. |

### 21. Emerging & Niche — 0 homed, 15 cross-listed

Whole-category verdict: **REJECT in full**, except View Transitions API, adopted in §1 as
page/route transition. Every other entry is a duplicate of a rejected technique or sits on the
pre-judged list: Lottie · 360° viewers · scroll-triggered audio · hover-activated 3D rotation ·
dynamic island · toast with progress bar · shake-to-undo · ambient time-of-day · weather-like ·
audio-reactive · canvas generative art · CSS blend modes · animated CSS patterns · animated
infographics (adopted separately in §7 in its click-stepped form only).

### 22. Background & Environmental — 0 homed, 10 cross-listed

Whole-category verdict: **REJECT in full.** Aurora/mesh drift · noise texture · particle field ·
wave/ripple · weather-like · time-of-day · animated CSS patterns · liquid background · caustics ·
gradient mesh. Every one is ambient motion behind content, and every one is either pre-judged
or fails the load-bearing test. This category is the purest test of Rule 2 in the whole pool
and it does not survive a single row.

---

## 4. Adoption summary

**39 adopted · 6 conditional · 137 rejected.** Under the forty-technique ceiling.

Every adopted technique below names the section it serves and the prose it absorbs or houses.
A technique with no section named would have been a preference, not a decision, and would
return to REJECT.

### 4.1 Converting techniques — 26

| # | Technique | Section(s) | Prose it absorbs | Feature |
|---:|---|---|---|---|
| 1 | Clip-path wipe | all 68 h2 | §1.3's explanation of the numbering hierarchy | F-15 |
| 2 | Fade in | all 241 | — (floor / reduced-motion fallback) | F-15 |
| 3 | Viewport reveal (once) | every figure | — (enabling) | F-16 |
| 4 | Split text, line-mask | §2.1 hero | — (the one orchestrated moment) | F-13 |
| 5 | Number count-up | §3.4.1, §4.1–4.2, §11.1 | "the threshold is N votes"; the five commitment targets | F-05 |
| 6 | Value morph | §3.4.3, §2.2 | §3.4.3's four worked routes stated as prose | F-12 |
| 7 | Vertical digit roll | countdown only | §16.1's sentence on how little time is left | F-01 |
| 8 | Bars growing from baseline | §3.3.3, §3.4.4, §8.15.2 | the ranked comparison tables | F-06 |
| 9 | Choropleth value transition | §3.3.3, §3.4.2, §3.5.4 | the ward-granularity claim, stated three times | F-03 |
| 10 | Heatmap cell fill | §3.5.4, §5.1, §7.1.2 | the three largest cross-tabulations | F-21 |
| 11 | Gauge needle sweep | §13.1.3, §8.7 | the response-time SLA sentences | F-09 |
| 12 | Progress ring fill | §11.1, §3.4.5 | percentage-of-target prose | F-05 |
| 13 | Data point highlight | §3.3.3, §3.4.2 | per-ward notes | F-17 |
| 14 | SVG path draw | §9.1, §8.9, §12.4, §13.1.2 | route-through-stages prose | F-08 |
| 15 | Animated infographic, click-stepped | §13.1.2, §8.9, §12.4 | the longest sequential blocks in the document | F-22 |
| 16 | Slider / range handle | §3.4.3, §2.2, §7.1 | §3.4.3's routes to threshold | F-12 |
| 17 | Custom checkbox / toggle | §10.1.1 | the three-scope-level comparison | F-23 |
| 18 | Highlight sweep behind text | running prose | §3.2.1's provenance assertion | F-24 |
| 19 | Scroll progress rail | §9.1 + global | §9.1's phase-window naming | F-02 |
| 20 | Sticky pinned section | §9.1 | the phase-by-phase ordering | F-02 |
| 21 | Scroll-spy indicator | index | — (241 sections need a position) | F-25 |
| 22 | Sticky header state change | all | — (structural, §1.3) | F-25 |
| 23 | Tab indicator slide | 19 tabs | §1.3's section list | F-25 |
| 24 | Page / route transition | 19 tabs | — (continuity) | F-25 |
| 25 | Back-to-top reveal | global | — (utility at 47,867 words) | F-25 |
| 26 | Press / active scale-down | all controls | — (touch feedback) | F-15 |

### 4.2 Text-housing techniques — 4

Every one degrades toward **more** text visible, never less.

| # | Technique | Section(s) | Prose it houses | Feature |
|---:|---|---|---|---|
| 27 | Accordion / disclosure | all 19 RETAINED + all 48 CONVERTIBLE | the retained argument, and the explanatory layer around every converted claim | F-16, F-20 |
| 28 | Drawer / sheet slide | §8.13.4, §3.2, index | model variables, derived-figure workings, the section index | F-18, F-26 |
| 29 | Tooltip enter | running prose | source and provenance notes from §3.2 | F-18 |
| 30 | Skeleton placeholder | lazy-mounted sections | — (reserves height; holds CLS) | F-27 |

### 4.3 Enabling techniques — 9

| # | Technique | Serves | Feature |
|---:|---|---|---|
| 31 | prefers-reduced-motion support | Rule 3, all | all |
| 32 | Intersection Observer | every reveal and counter | all |
| 33 | Progressive enhancement | Rule 3, all | all |
| 34 | Hardware acceleration | Rule 4, all motion | all |
| 35 | Progressive image load | the four portraits | F-28 |
| 36 | Font loading strategy | Rule 4 | §4.2 |
| 37 | Critical CSS | Rule 4 | §7 |
| 38 | Responsive fluid type | 320px reading | §4.2 |
| 39 | Focus ring animation | keyboard reach | all |

### 4.4 Conditional — 6

| Technique | Section | Precondition | Who confirms |
|---|---|---|---|
| Brush and zoom | §3.4.2 (40 wards) | the 40-row ranked list tests badly at 320px | Firefly, on a real device |
| Zoom to region | §3.5 (three zones) | the pre-baked cartogram supports it without a runtime geo library | Firefly engineering |
| Variable font axis animation | §2.1 hero | Montserrat's width axis survives the latin subset; runs once per session | Firefly engineering |
| Before/after comparison slider | §3.3.6 | Firefly wants a 2017-vs-2022 ward comparison despite the disputed results in `data/disputed-figures.ts` | Firefly, editorial |
| Shape morph | §8.14 | the technology stack has more than one candidate configuration to show | Firefly delivery |
| Live-updating stream | §13.2 | **a real monitoring feed exists and Firefly will stand behind it.** No such source is in the repository. Under Constraint 3 this is **cut, not deferred**, until one does. | Firefly delivery |

### 4.5 Section assignment — none left unassigned

All 68 sub-sections are assigned. 48 CONVERTIBLE get a converting visual; 19 RETAINED get a
text-housing feature; 1 HOLLOW is a copy question, not a design assignment.

| Class | Count | Assignment |
|---|---:|---|
| CONVERTIBLE, already converted | 25 | keep the existing component (see §2.2 ✓) |
| CONVERTIBLE, newly assigned | 23 | F-21 to F-31 (see `docs/VISUAL-FEATURES.md`) |
| RETAINED | 19 | F-16 annotation · F-20 progressive disclosure · F-18 margin notes |
| HOLLOW | 1 | §14.2 — raised to Firefly, no design action |

The 23 newly assigned CONVERTIBLE sections, with the technique that carries each:

| § | Section | Technique | Feature |
|---|---|---|---|
| 1.3 | How this proposal is structured | click-stepped infographic | F-22 |
| 2.4 | What this proposal commits to | count-up + ring | F-05 |
| 3.2 | Evidence standard and source tiers | heatmap cell fill | F-21 |
| 4.1 / 4.2 | Objectives, both windows | count-up + ring | F-05 |
| 5.2 | Segment sizing | bars from baseline | F-06 |
| 7.3 | Language, register and dialect | heatmap cell fill (channel × language) | F-21 |
| 8.1 | Scope summary and boundaries | heatmap cell fill | F-21 |
| 8.3 | Content production and governance | click-stepped infographic | F-22 |
| 8.4 | AI-assisted creative and testing | click-stepped infographic | F-22 |
| 8.11 | Digital organising and volunteers | bars from baseline (tiers) | F-06 |
| 8.12 | The data layer | SVG path draw | F-08 |
| 8.13 | Predictive voter modelling | bars from baseline + drawer | F-06, F-26 |
| 8.14 | The technology stack | heatmap cell fill (procurement matrix) | F-21 |
| 9.2 | Coalition and endorsement sequencing | SVG path draw on the phase rail | F-02 |
| 10.2 | The deliverables schedule | SVG path draw on the phase rail | F-02 |
| 11.2 | Indicators, and why these | heatmap cell fill | F-21 |
| 11.3 | The Kitui message lab | choropleth (zone coverage) | F-03 |
| 12.2 | Cadence and meeting rhythm | click-stepped infographic | F-22 |
| 12.3 | Decision rights and approval | heatmap cell fill (RACI) | F-21 |
| 12.4 | The escalation path | SVG path draw | F-08 |
| 13.2 | The digital war room | click-stepped infographic (shift coverage) | F-22 |
| 13.3 | Cybersecurity and manipulated media | SVG path draw (incident response) | F-08 |
| 13.5 | Statutory and regulatory compliance | click-stepped infographic (IEBC checklist) | F-22 |
| 14.3–14.6 | Team, surge, leadership, reporting | heatmap cell fill + SVG path draw | F-21, F-08 |
| 16.2 | The ask | click-stepped infographic | F-22 |

No adopted technique is left unattached: each of the 39 appears in §4.1, §4.2 or §4.3 with a
named section or a named enabling role.

---

## 5. Contradictions with the existing specification and with the shipped site

Nine. Each is argued rather than asserted, because each reverses a decision someone already
made deliberately.

### 5.1 "0KB of new runtime dependencies" is false, and the budget is roughly 2× over

`docs/VISUAL-FEATURES.md` §7 states: *"Running total against the catalogue as specified: 0KB
of new runtime dependencies. Everything above is hand-rolled SVG, CSS, and browser APIs."*

Measured on this branch:

```
npm install && npm run build
Route (app)                     Size  First Load JS
└ ● /[[...slug]]               319 kB         421 kB
```

Confirmed independently by gzipping the emitted chunks (`gzip -c .next/static/chunks/*.js`),
which sum to exactly 421 KB — so Next's reported figures are gzipped, not raw.

| Component | gzipped | Method |
|---|---:|---|
| framework chunk (React + Next runtime) | 58 KB | measured |
| main chunk | 36 KB | measured |
| polyfills | 38 KB | measured |
| **Baseline subtotal** | **132 KB** | not "added" JS |
| app + library chunk `462-*` | 192 KB | measured |
| shared chunk `4bd1b696-*` | 52 KB | measured |
| shared chunk `255-*` | 45 KB | measured |
| **Added runtime JS** | **289 KB** | 421 − 132 |
| **Budget (Rule 4)** | **150 KB** | |
| **Overrun** | **+139 KB, 193% of budget** | |

Isolating the two largest libraries with esbuild (`--bundle --minify --format=esm`, React
external):

| Library | gzipped | Note |
|---|---:|---|
| `recharts`, full export surface | 158 KB | |
| **`recharts`, as actually imported here** | **123 KB** | 18 named exports across 11 files |
| `framer-motion` | 63 KB | **zero imports — see §5.5** |
| `react-markdown` + plugins | 35 KB | load-bearing: the document is markdown |
| `lucide-react`, 8 icons | 1 KB | tree-shakes correctly |

**Recharts alone is 82% of the entire budget.** The existing specification's own
anti-patterns table rejects it by name — "*~95KB gzipped… two-thirds of the budget for no
capability gain*" — and understates it by 28 KB.

**Argument.** The specification is right and the repository disagrees with it in code. Eleven
components import Recharts to draw bar charts, line charts and a scatter quadrant — all of
which are, as the specification says, forty lines of hand-rolled SVG. Recharts also drags in
eleven `d3-*` packages. Removing it is worth **~123 KB gzipped**, which is more than the
entire Rule 4 allowance, and it is the only change in this document that gets the project
inside its own budget. Replacing eleven charts is real work; it is also the highest
value-per-hour item in the whole triage, and every one of those chart types is already on the
adopted list as a hand-rolled technique (bars from baseline, line draw, scatter).

### 5.2 The instrument-panel concept versus "nothing here is live"

`MASTERPROMPT.md` sets the organising concept: *"Dr. Mulu should spend four minutes operating
a campaign nerve centre that appears to already be running on his behalf."*

`MOTION-SYSTEM.md`, written by whoever built this, says the opposite and is right:

> Nothing on this page is live: it is a proposal for work not yet commissioned. A blinking
> "Live" dot is a false claim however good it looks.

**Argument.** These cannot both hold, and the credibility constraint settles it. Constraint 3
says simulated live data is the single largest risk in the project. A nerve centre that
"appears to already be running" is simulated live data wearing a different word. The
resolution is to keep the *instrument* and drop the *liveness*: the reader operates real
controls over real, sourced figures — the ward cartogram, the threshold calculator, the scope
selector — and nothing pretends to be streaming. An instrument he drives is more persuasive
than a dashboard that appears to be receiving, because he can test the first and only believe
the second.

Consequences: **F-11 (live sentiment ticker) is cut, not deferred.** F-01's countdown stays —
a date is a fact, not a feed. F-02's rail stays as reading position, not as a live phase
readout. `MOTION-SYSTEM.md`'s ambient-loop budget of three is **reduced to zero** (§3, cat 4);
of its three permitted loops, the hero marquee and the language swap both hide peer content on
a timer, and the field–digital cycle is better as the click-stepped diagram adopted at F-22.

### 5.3 Twenty-six pre-judged rejections are live in the shipped site

Cross-referencing the pre-judged REJECT list against the 282 rows marked **Live** in
`docs/VISUAL-FEATURE-LEDGER.md` returns 43 rows, which collapse to **26 canonical techniques**:

| Live technique | Pre-judged ground | Where |
|---|---|---|
| Custom cursor + cursor trail | wrong register | `components/visual/Chrome.tsx` — a dot and a lagging ring on a `pointermove` rAF loop |
| Typewriter | wrong register | `SplitText.tsx`, `ReachSplit.tsx` |
| Text scramble / decode | wrong register | ledger cat 12 |
| Split-flap board | wrong register | ledger cat 12 |
| Drop cap | wrong register | ledger cat 12 |
| Gradient text | fails load-bearing | `.fx-text-gradient` |
| Weather-like background | wrong register | ledger cats 4, 13, 21, 22 |
| Time-of-day ambient shift | wrong register | ledger cats 20, 21, 22 |
| Parallax hero / layers | fails load-bearing | `AmbientField`, three wells at 0.6/1.0/1.5 |
| Particle field / overlay | fails load-bearing | `AmbientField motes={n}` |
| Aurora / mesh gradient drift | fails load-bearing | `.fx-aurora`, `.fx-mesh` |
| Liquid / blob morph | fails load-bearing | `.fx-aurora` wells |
| Grain / noise overlay | fails load-bearing | `.fx-grain` |
| Animated CSS pattern | fails load-bearing | `.fx-pattern-diagonal` |
| Shimmer sweep (decorative) | fails load-bearing | `.fx-shimmer`, `.fx-shine` |
| Float / drift loop | fails load-bearing | `.fx-loop-float`, the Wiper umbrella on a 4.2s cycle |
| Pulse / breathe, glow pulse | fails load-bearing | `.fx-loop-blink`, `.fx-spotlight` |
| Hover elevation (card lift) | fails load-bearing | `.fx-lift` |
| 3D pointer tilt | mobile-hostile | `TiltCard`, `.fx-tilt` |
| Magnetic pointer attraction | attention-seeker | `.fx-magnetic` |
| Pointer spotlight / glow | fails load-bearing | `SpotlightCard` |
| Carousel | hides peer content | `TierComparisonCarousel` |
| Marquee / ticker for content that matters | hides peer content | `WardRegisterTicker` — real IEBC ward figures scrolling at 36px/s |
| Logo wall loop | fails load-bearing | `.fx-loop-marquee` |
| Fade-and-slide-up on section entry | fails load-bearing | `.fx-in-up` |
| Rubber-band overscroll | fails load-bearing | `.fx-rubber` |

**Argument.** This is not a criticism of the prior work; it is the consequence of two
different standards. `VISUAL-FEATURE-LEDGER.md` §6 judges each technique by *"can we wire this
to a real surface?"* and adopts 282. This triage judges by *"if removed, does the site lose an
argument?"* and adopts 39. The second standard is the one the governing rules specify, and it
is the right one for this reader: an economist reading a vendor proposal counts decoration as
padding, and padding in a proposal is a signal about the vendor, not about the design.

The most consequential single row is `WardRegisterTicker`. The 40-ward IEBC register is the
most checkable dataset in the document and the one an economist will most want to stop on.
Putting it on a 36px/s conveyor is the one place where a rejected technique actively damages
the argument the site is making.

### 5.4 Eighteen CSS rules are unreachable, including nine the ledger claims are live

`VISUAL-FEATURE-LEDGER.md` §5 says the effects layer was trimmed of 181 unreachable classes
and concludes: *"Dead rules that imply a capability the site does not have are worse than no
rules at all."* Agreed — and eighteen remain:

```
fx-in-blur  fx-in-diagonal  fx-in-down  fx-in-flip-x  fx-in-flip-y  fx-in-iris
fx-in-pop*  fx-in-rotate    fx-in-unfold  fx-in-wipe-diag  fx-in-wipe-up
fx-kenburns  fx-loop-blink  fx-loop-float  fx-loop-marquee  fx-mask-fade-x
fx-pause-on-hover  fx-text-gradient
```

`Reveal` constructs its class as `` `fx-in-${variant}` ``, so the `fx-in-*` rules are
reachable in principle. In practice the repository passes exactly **four** variants —
`variant="left"` (×2), `variant="right"` (×1), `variant="pop"` (×1). The other eight entrance
variants, and the six non-dynamic classes, match no element in any build.

Against a 32 KB gzipped stylesheet — the largest single non-JS asset on the page — this is
measurable, and it is the same defect the ledger already diagnosed once. The ledger's rows
marking Ken Burns, logo wall loop, live-status blink and gradient text as **Live** are
inaccurate: those rules exist but nothing reaches them.

### 5.5 `framer-motion` is a declared dependency with zero imports

```
grep -rl "from \"framer-motion\"" components/ hooks/ lib/ app/   →  0 files
grep -rl "from \"motion/react\""  components/ hooks/ lib/ app/   → 54 files
```

`package.json` declares both `framer-motion@^12.23.24` and `motion@^12.23.24`. `motion` is the
successor package; `framer-motion` is dead weight at 63 KB gzipped if anything ever imports it
by accident. Tree-shaking keeps it out of today's bundle, which is exactly what makes it
dangerous: the cost is invisible until one import lands. Remove it.

### 5.6 The dark control-room palette does not exist and should not be built

`VISUAL-FEATURES.md` §4.1 specifies `ink #12151C`, `dusk`, `bone`, `ochre`, `sisal`, `signal`
on a dark ground, reasoning that "control rooms are dark."

The repository ships a **light** OKLCH palette with contrast ratios argued inline in
`app/globals.css` — including a documented fix for a 3.25:1 failure found in an earlier audit,
and a deliberate separation of `--accent` (text/stroke) from `--accent-solid` (fill) so white
text clears 4.5:1. It carries a four-state provenance system (`verified` / `estimate` /
`unmeasured` / `disputed`) with its own tokens, and five phase colours keyed to §9.1.

**Argument.** The specification loses. Its palette was proposed without sight of what exists;
the shipped palette encodes provenance and campaign phase, which is information, and its
contrast decisions have already survived an audit. Rebuilding it dark would mean re-deriving
every one of those ratios against a new ground for an aesthetic reason. §4.1 of the
specification is amended to describe the shipped tokens.

### 5.7 Bricolage Grotesque is not worth a fourth font family

§4.2 specifies Bricolage Grotesque (display) and Newsreader (body). The repository ships
Montserrat, Newsreader and JetBrains Mono via `next/font/google`, self-hosted, latin-subset,
`display: swap`, with `adjustFontFallback`. Newsreader already matches. Adding a fourth family
costs a download on a metered connection to change the character of the display face, which
carries no argument. §4.2 is amended.

### 5.8 "Minimal text" is not the problem this site has

The brief in `MASTERPROMPT.md` says the site "must make the complete case on its own… while
running on minimal text." The repository is 47,867 words across 241 sections.

**Argument.** Rule 1 forbids getting shorter by subtraction, so conversion cannot shrink this
document — it can only make it navigable. That inverts the specification's own emphasis:
**Group G (text housing) is the primary group here, not the supporting one.** F-16 and F-20
are not scaffolding for the conversions; at 47,867 words they are the product. The build
sequence in §9 is reordered to match, and the specification's framing of Group G as existing
"because of §2.1" is amended to say it exists because of the document's size.

### 5.9 F-03 already exists, and the IEBC verification is already automated

The specification treats the ward map as the centrepiece still to be built, effort **L**, and
lists "Kitui boundaries and ward count verified against IEBC" as an open acceptance item.

Both are done. `components/charts/WardCartogram.tsx` renders all 40 wards across 8
constituencies from `data/ward-register.json`, sourced to IEBC's *Registered Voters per County
Assembly Ward*, and `scripts/verify-ward-register.mjs` runs on every `prebuild`:

```
Ward register integrity check passed: 40 wards across 8 constituencies
sum to 532758 (532833 including 75 prison voters).
```

Three further guards run alongside it — `verify-figures.mjs` (every numeric literal in the UI
traces to a source), `verify-content-integrity.mjs` (4,036 body lines unchanged since a known
commit), `verify-deep-links.mjs` (837 legacy ids resolve). **This is the strongest part of the
repository and nothing in this triage touches it.** F-03 is marked shipped; its acceptance
criterion is marked satisfied, with the command that satisfies it.

The poll date, however, is **not** machine-verified. `public/content/roadmap.md` states
10 August 2027 and `objectives.md` repeats it. It remains an open confirmation (§7).

---

## 6. Self-check

| Check | Result |
|---|---|
| All 22 categories appear in the triage table | **Pass** — §3 counts 1 through 22, each with a verdict; categories 14, 21 and 22 receive whole-category verdicts because they contain no technique not homed earlier. |
| Every adopted technique attached to a named section and named prose | **Pass** — §4.1 (26), §4.2 (4), §4.3 (9). The nine in §4.3 are enabling: each names the rule it serves rather than prose it absorbs, which is stated rather than hidden. |
| Every phase-1 section assigned | **Pass** — 48 CONVERTIBLE, 19 RETAINED assigned in §4.5; 1 HOLLOW raised to Firefly as a copy question, per Rule 1. |
| Every feature has a mobile baseline carrying the same argument | **Pass** — degradation matrix in `docs/VISUAL-FEATURES.md` §6, extended to F-31. |
| Text-housing features degrade toward more text | **Pass** — all four in §4.2 fall back to fully expanded. |
| Total dependency weight under 150 KB gzipped | **FAIL as shipped — 289 KB.** Arithmetic in §5.1. Passes at **~166 KB** once Recharts is removed (289 − 123), and at **~150 KB** once the eighteen dead CSS rules and the unused `framer-motion` declaration go with it. This is the one self-check the repository does not currently pass, and §5.1 is the route back inside it. |
| No invented data | **Pass** — no figure in this document originates here. Every number is measured from the build, counted from the source, or quoted from a repository file named at the point of use. |
| No cost, budget, fee or credentials content | **Pass** — no adopted feature requires any. §10.1's scope selector compares what each level *carries*, not what it costs. |
| Nothing pre-judged adopted without an override argument | **Pass** — zero overrides. The pre-judged list is applied as written; §5.3 lists 26 pre-judged techniques currently live that this triage rejects. |
| Adopted count under forty | **Pass — 39.** |

---

## 7. Assumptions and open confirmations

### 7.1 Assumptions made about repository contents

| ⚑ | Assumption | Basis | If wrong |
|---|---|---|---|
| 1 | `docs/visual-features-brief.md` is the "22-category candidate pool" the master prompt calls `docs/visual-features-taxonomy.md` | It is the only 22-category document in the repository, 534 bullets, matching the described shape | Phase 0's counts change; the verdicts do not |
| 2 | The uploaded `VISUALFEATURES.md` is the intended `docs/VISUAL-FEATURES.md` | No file of that name existed in `docs/`; the uploaded file matches the described F-01…F-20 shape exactly | It would have been written to a new path anyway |
| 3 | `HEADING_INSERTS` in `MarkdownViewer.tsx` is the complete mount table | `verify-mounts.mjs` reads it as the single source and reports 39 mounts resolving | Coverage counts in §2.2 shift |
| 4 | Next's reported "First Load JS" is gzipped | Independently confirmed: the gzipped chunk sum is 421 KB, matching exactly | §5.1's overrun would be smaller, but Recharts' isolated 123 KB is measured separately and stands |
| 5 | Recharts is imported with the 18 named exports measured | Grep across `components/`; a wider surface would cost more, not less | The 123 KB figure is a floor |
| 6 | Word counts include table and code-fence content | Stated in the method; excluding them lowers §3.4 and §7.1 most | Classification is unaffected — those sections are CONVERTIBLE either way |

### 7.2 Decisions that depend on a confirmation not held here

| Open item | Who confirms | Blocks |
|---|---|---|
| **The poll date, against IEBC.** Repository states 10 August 2027 in two files. Not machine-verified, unlike the ward register. | Firefly, against IEBC | F-01 ships with a wrong date otherwise — fatal on the hero of a pitch to a sitting MP |
| A real monitoring feed for §13.2 | Firefly delivery | Live-updating stream stays cut until then |
| The committed response SLA in §13.1.3 | Firefly delivery, not design | F-09's dial figure |
| Whether §14.2 acquires a claim or merges into §14.1 | Firefly, editorial | The one HOLLOW section |
| Whether the 2017-vs-2022 comparison is a claim Firefly wants to make | Firefly, editorial | Before/after slider |
| Whether the 40-row ward list tests badly at 320px | Firefly, on a real mid-range Android on real mobile data | Brush and zoom |
| Whether to remove Recharts | Firefly delivery — eleven components | Rule 4 compliance |

### 7.3 Not verified here

This triage did not open the deployed site, did not run Lighthouse, and did not test on a
physical device. The acceptance criterion that matters most — *"opened on an actual mid-range
Android phone on actual mobile data before the link is sent"* — remains unmet and cannot be
met from here.
