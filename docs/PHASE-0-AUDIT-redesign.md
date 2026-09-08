# Phase 0 audit — motion-driven redesign

Branch `claude/makali-campaign-redesign-z6owop`. Measured 8 September 2026 against
commit `d1c1559`. Every number below was measured in this container, not estimated.

---

## 0. The headline

**`bun run build` does not currently pass on this branch.** The `prebuild` guard
`scripts/verify-content-integrity.mjs` fails on HEAD. This predates any work in this
session and is a gate the brief requires, so it is finding B1 below and the first thing
to fix.

Two structural facts dominate everything else:

1. **82.3% of the served HTML is a React Server Component flight payload for eight
   sections the reader is not looking at.** 2.05 MB of the 2.49 MB document.
2. **The entire document body ships at `opacity: 0` in the SSR HTML**, waiting on
   hydration. This is the single biggest cause of the 6.2 s LCP, and it is the exact
   state the brief forbids.

Fixing those two is worth more than every animation in Phases 2 and 3 combined.

---

## 1. Component map

167 TypeScript modules. 46 import `motion/react`; 22 import `lib/motion.ts`; the
remaining 24 animating files carry their own values. 86 `fx-*` CSS utility classes and
48 `@keyframes` in `app/visual-fx.css` form a *second*, parallel motion system.

### Entry points

| File | Role | Motion | Data |
|---|---|---|---|
| `app/page.tsx` | Server. Reads nine markdown files, renders all nine through `MarkdownViewer`, passes all nine as props | none | all |
| `app/layout.tsx` | Montserrat variable font, `noindex`, viewport | none | — |
| `components/ClientPage.tsx` (845 ln) | Shell: tabs, index rail, Focus / Zero Chrome / Expand All / Print / Theme, sticky header | motion | — |
| `components/MarkdownViewer.tsx` (543 ln) | Server. Intercepts headings and tables by id/content and swaps in 52 visualisations | none | all |
| `lib/heading-slug.ts` (735 ln) | Slug + legacy-id map, `SECTIONS` | none | — |
| `lib/section-index.ts` | Derives the index from the markdown headings | none | — |

### Chrome and navigation

`MobileBottomNav` (css) · `MobileTOCModal` (motion) · `QuickNavCapsule` (motion) ·
`ScrollProgressBar` (none) · `SectionStickyBar` (css) · `PhaseRail` (motion) ·
`LazySection`/`LazyMount` (IntersectionObserver gate) · `SectionSkeleton`.

### Data visualisations — 52 mounted, by section

| Section | Mounted visualisations |
|---|---|
| **(1) The decision** | PollingTrajectorySimulator · ObjectivesIndex · BudgetScenarioModeler · ComplianceCeilingPanel · SectionPortrait · HeroVisual · Dashboard · NominationScorecard · NominationVerdict · DecisionPanel · MizaniSlopeBlock |
| **(2) What we know** | NominationPathPanel · ConstitutionalBranchNavigator · CompetitiveQuadrantBlock · **WardCartogramBlock · PathTo200kBlock · ConstituencyWeightBlock** · ResourceEnvelopeBlock · DisputedFigure · ElectoralHistoryPanel · ElectoralTimelineBlock · FiscalAuditPanel · FiscalAuditChartBlock · DroughtFoodSecurityPanel · MuiBasinPanel · CompetitorFieldPanel · PathTo200kCalculator · RecognitionDeficitOverlay · GeographicZoneMatrix · AudienceSegmentationMatrix · ReachArchitecture3D · PhoneShowcase · MediaOwnershipBlock · PlatformSizingBlock · ClaimCards |
| **(3) What we will do** | EconomistGovernorThesis · StrategicPillarsMatrix · SloganBuilder · MessagingPlayground · ToneVoiceSlider · PersuasionFramingMatrix · DataSecurityEthicsCharter · PublicServiceDeliveryTracker |
| **(4A) What we publish** | CommunityScheduler · MediaPlaybackMockup · MediaRadioLandscapeCard · RadioAircoverDial |
| **(4B) On the ground** | TerminalShowcase · FlywheelSchematic · ReachSplit · SMSFeedbackVisualizer |
| **(4C) Defending** | CounterMessagingGrid · CrisisWarRoomMatrix |
| **(4D) What it runs on** | **— nothing —** |
| **(4E) Who does the work** | CampaignOrgChart |
| **(5) Delivery and proof** | PhaseRail · KpiPhaseBlock |

**§4D "What it runs on" has zero anchored visualisations.** It is the one section that
is currently a wall of text, and it is the section describing the technology stack —
the part of the proposal a reader is most likely to test against the artifact itself.
§4C and §4E have one and two respectively. Those three are the Phase 2 priorities the
brief's coverage requirement will bind on.

### Data layer

`data/ward-register.json` + `.ts` (40 wards, 8 constituencies, build-time assertion that
they sum to 532,758) · `sources.ts` · `spending-ceiling.ts` · `fiscal-audit.ts` ·
`electoral-history.ts` · `media-ownership.ts` · `competitors.ts` · `nomination-path.ts` ·
`drought-food-security.ts` · `mui-basin.ts` · `disputed-figures.ts` · `external-figures.ts`
· `terminal-showcase.ts` · `phone-showcase.ts`.

Six `prebuild` guards enforce this: ward-register sum, figure provenance, content
integrity, mount uniqueness, deep links, visual coverage. **They are an asset. Nothing in
Phases 1–3 should weaken them.**

---

## 2. Existing motion primitives

Extend these; do not duplicate them.

**React (`components/visual/`)**
`Reveal`, `Stagger`, `RevealVariant` · `SplitText`, `Typewriter`, `Scramble`, `WordCycler`
· `CountUp`, `CountUpText`, `Odometer`, `ProgressRing` · `TiltCard`, `SpotlightCard`,
`MagneticButton`, `RippleButton` · `AmbientField` · `NavDots`, `CustomCursor`.

**`lib/motion.ts`** — `EASE_ENTRANCE`, `EASE_OUT`, `DURATION` (5 steps), `STAGGER` (3),
`SPRING`/`SPRING_SOFT`, `VIEWPORT`/`VIEWPORT_TALL`, variants `fadeIn` `riseIn` `slideInX`
`slideInY` `cascade` `flipInX` `flipInY` `growFromBaseline` `drawPath` `collapse`, and
`stillVariants`/`variantsFor` for reduced motion.

**CSS (`app/visual-fx.css`)** — 86 `fx-*` classes, 48 keyframes: 19 entrance variants,
marquee, shimmer, skeleton, grain, mesh, aurora, tilt, press, ripple, glass, odometer.

**Hooks** — `use-in-view`, `use-marquee-active`, `use-media-query`, `use-mobile`
(`useSyncExternalStore`), `use-pointer-fx`, `use-reduced-motion-safe`, `use-scroll-shell`,
`use-chrome-visible`.

**The six the brief names, located:**

| Brief's name | File |
|---|---|
| Count-up statistic pairs | `components/visual/Numerals.tsx` → `AnimatedMetric.tsx`, `Dashboard.tsx` |
| Milestone marquee | `MarqueeCarousel.tsx` (`ClientPage.tsx:117`) |
| 40-ward register stream | `charts/WardRegisterTicker.tsx` |
| Spatial Strategy Command (3D Terrain / Pipeline / 3D Pillars) | `HeroVisual.tsx:203–500` |
| Wiper Nomination Viability Simulator | `markdown/PollingTrajectorySimulator.tsx` |
| Analytical Matrix chart/table switcher | `markdown/InteractiveTable.tsx` |
| Index controls | `ClientPage.tsx:566–680` |

### The finding

There is not one motion system, there are three: `lib/motion.ts` (22 files), the
`fx-*` CSS layer (widespread), and ad-hoc inline values (24 files). Measured spread of
inline literals: **20 distinct `duration:` values** (0, 0.18, 0.2, 0.25, 0.3, 0.35, 0.36,
0.42, 0.46, 0.5, 0.52, 0.6, 0.62, 0.64, 0.72, 1.1, 1.2, 1.8, 6) and 3 inline easing
strings. `lib/motion.ts` also does not yet expose the scale the brief specifies
(instant/quick/base/slow/deliberate), the four named springs, `fadeUp`, `scaleIn`,
`staggerContainer`, `revealMask`, or a `useReducedMotion`-aware wrapper. Phase 1 is a
consolidation, not a greenfield build.

`hooks/useAnimatedNumber.ts` and `hooks/useSectionProgress.ts` exist (added in `d1c1559`)
but **have no consumers** and do not meet the brief: the number hook uses `requestAnimationFrame`
rather than `useSpring`/`useTransform`, its `useInView` margin is `-10% 0px` not `-80px`,
and it initialises its display to `format(0)` — so the server renders **0** for every
figure, which is a false value in a document of record and would print as 0.

---

## 3. The four suspected defects

### (a) Duplicated register and dual-mounted matrix — **CONFIRMED, and worse than described; the matrix half is already fixed**

Corrected locations — the document was renumbered by commit `9f25f89`, so the brief's
§9.2.5/§9.2.6 are now §1.2.3 and §1.3.2 of *What we know*.

**Ward register: rendered three times, 240 ward cards, in one section.**

| Where | Path | Cards |
|---|---|---|
| §1.2.3 via `WardCartogramBlockContent:26` | `MarkdownViewer.tsx:220` | 80 |
| §1.2.3 via `PathTo200kBlockContent:69` | same heading insert | 80 |
| §1.3.2 via `InteractiveTable:210` (auto-detects the 40-row register table) | markdown table | 80 |

`WardRegisterTicker` renders each set **twice** — a real list and an `aria-hidden` clone
for the seamless marquee loop — so each mount is 80 cards, not 40. The screen-reader
half of the suspicion is already handled by that `aria-hidden`; the paint cost is not.
Both §1.2.3 tickers are mounted at the *same heading*, back to back.

**Analytical Matrix: already conditionally rendered.** `InteractiveTable.tsx:288` is
`mounted && isMobile ? cards : table`, and `:276` is `showChart ? chart : …`. One variant
at a time. *However*, that branch is hydration-gated, so a phone paints the desktop table
first and swaps after JS — a latent CLS source that currently measures 0 only because the
body is invisible until hydration anyway.

**The real dual mount is `AsciiDiagram.tsx`**, which the suspicion did not name:
lines 84 (`block md:hidden`) and 145 (`hidden md:block`) mount the card view *and* the
table view concurrently for **all 30 parsed diagram tables**. Duplicated DOM and paint;
`aria-hidden` on the card half already prevents duplicated screen-reader output.

### (b) "Item 2 / Item 3 / Item 4" artifacts — **CONFIRMED, source located, scope corrected**

Source: **`components/markdown/AsciiDiagram.tsx:124`** —
`const header = d.headers && d.headers[colIdx] ? d.headers[colIdx] : \`Item ${colIdx + 1}\`;`
in the mobile card view.

It fires when a parsed ASCII table has fewer headers than columns. I ran the parser over
all 89 fenced blocks in the nine markdown files. **Exactly one block triggers it**, and it
is not the KPI tables:

```
3-strategy.md:295  "MESSAGE-BY-CHANNEL MATRIX & EVIDENCE DEPLOYMENT"  headers=0 width=3
```

The Stage 1 / Stage 2 KPI block parses as `kind: "panel"`, not a table, so it never
reaches this code. The artifacts the brief saw are from the §3 message matrix. The
fallback label should be dropped entirely — an unlabelled value beats a wrong label.

### (c) LaTeX rendering as raw markup — **CONFIRMED, but largely already fixed; 2 instances remain**

Commit `d1c1559` (authored by the repository owner, not by an agent) converted most of it
to Unicode already. What remains:

```
5-delivery.md:366   $>10\%$
5-delivery.md:368   $<40\%$
```

Everything else matching `$…$` is genuine US-dollar currency (`$1–$5`, `$150–$250/mo`)
and must not be touched.

**Recommendation: convert to Unicode; do not add rehype-katex.** Reasoning —
`rehype-katex` plus the KaTeX CSS and fonts is roughly 270 kB of CSS and WOFF2 before any
JS, to render two comparison operators. The document's own §7.1.1 makes 3G loading
"non-negotiable". Two characters do not justify a font payload larger than the entire
current shared JS chunk. `> 10%` and `< 40%` in plain Unicode are also what a screen
reader announces correctly, whereas KaTeX needs MathML fallback markup to match. **This
also matters because commit `d1c1559` already made this conversion for the rest of the
document — adding KaTeX now would leave the document rendering two operators in a
different typeface from the forty already converted.**

### (d) §8.2.3 ASCII diagram overflowing — **CONFIRMED, and the problem is 55 blocks wide, not one**

`public/content/1-decision.md:195–217`. Commit `d1c1559` already reflowed it from a
two-column, 84-character layout to a stacked, 66-character one — which helps, but it still
parses as `kind: "panel"`, meaning monospace text in a scaled/scrollable frame rather than
real layout.

Across the document, **55 of 89 fenced blocks fall back to `panel`**, and the widest is
114 characters (`5-delivery.md:252`, "RECOGNITION-DEFICIT RESEARCH ARCHITECTURE"). At a
390 px viewport, 114 monospace characters cannot be read without either a scroll or a
scale-down past legibility. §8.2.3 is one instance of a class.

*Note:* the page as a whole does **not** overflow horizontally — measured
`scrollWidth === clientWidth === 390`. The panels scroll inside their own frames. So this
is a legibility defect, not a layout-break defect.

---

## 4. Lighthouse mobile baseline

Lighthouse 12 (mobile preset: Moto-G-class CPU ×4 throttle, simulated slow 4G), against
`next start` on the production build, three runs, median reported. Chromium 1194 headless.

| Metric | Run 1 | Run 2 | Run 3 | **Median** | Budget | Status |
|---|---:|---:|---:|---:|---:|---|
| **Performance** | 47 | 45 | 42 | **45** | ≥ 85 | ✗ −40 |
| **Accessibility** | 92 | 92 | 92 | **92** | ≥ 95 | ✗ −3 |
| Best Practices | 96 | 96 | 96 | **96** | — | — |
| SEO | 63 | 63 | 63 | **63** | — | n/a — `noindex` is deliberate |
| **LCP** | 5,911 ms | 6,211 ms | 6,262 ms | **6,211 ms** | < 2,500 ms | ✗ 2.5× |
| **CLS** | 0.000 | 0.000 | 0.000 | **0.000** | < 0.1 | ✓ |
| FCP | 3,144 | 3,101 | 3,255 | **3,144 ms** | — | — |
| **TBT** | 1,215 | 1,326 | 1,689 | **1,326 ms** | — | very high |
| Speed Index | 4,167 | 4,200 | 4,706 | **4,200 ms** | — | — |
| TTI | 6,098 | 6,282 | 6,901 | **6,282 ms** | — | — |
| Main-thread work | 8.2 s | 8.4 s | 10.5 s | **8.4 s** | — | — |
| JS bootup | — | 2.8 s | — | **2.8 s** | — | — |

### Transfer — the budget baseline

| Item | Baseline | +20% ceiling |
|---|---:|---:|
| **Script transfer (gzip, over the wire)** | **422,524 B (412.6 KiB)** | **507,029 B (495.1 KiB)** |
| Document transfer (gzip) | 319,180 B (311.7 KiB) | — |
| Total page transfer | 818,493 B (799.3 KiB) | — |
| First Load JS (`next build`) | 411 kB | 493 kB |
| `/` route JS | 308 kB | — |
| Shared chunks | 103 kB | — |
| Raw JS on disk | 1,968,259 B | — |
| Raw JS gzipped | 583,932 B | — |
| **Prerendered HTML (uncompressed)** | **2,489,116 B** | — |
| DOM nodes at 390 px, after networkidle | 5,175 | — |

**The 20% JS ceiling I will hold to is 507,029 B of script transfer** (Lighthouse's
`resourceType: Script` sum), with First Load JS ≤ 493 kB as the secondary check.

### Where the time goes

- `unused-javascript`: est. savings **211 KiB**.
- Largest chunks: `902-*.js` 629 kB raw, `app/page-*.js` 466 kB raw.
- **2,048,252 B of the 2,489,116 B HTML (82.3%) is the RSC flight payload.** `app/page.tsx`
  renders all nine `MarkdownViewer` trees and passes them as props to a client component,
  so Next serialises all nine into the document even though `ClientPage` displays one.
  Eight ninths of that payload is parsed and never shown.
- **The document body is served at `opacity: 0`.** 23 elements ship with inline
  `opacity:0` in the SSR HTML, including `<div id="content-area">`'s child
  (`ClientPage.tsx:45` `SectionTransition`, `initial={{ opacity: 0, y: 10 }}`). LCP cannot
  fire until hydration finishes. CLS reads 0.000 for the same reason — nothing is visible
  to shift. **The CLS budget is currently being met by not painting.**

### Accessibility — the 8 points

| Audit | Weight | Nodes | Detail |
|---|---:|---:|---|
| `color-contrast` | 7 | 4 | `#ffffff` on accent `#348ff9` = **3.25:1** (needs 4.5). `#bb4d00` on `#1b160c` = 3.57:1. `#677a8a` on `#040e1a` = 4.36:1 |
| `target-size` | 7 | 1 | Header icon button: 40 × 13 px effective |
| `heading-order` | 3 | 5 | Widget `<h3>`/`<h4>` inserted without an intervening level |

**The accent colour itself fails AA for white text.** That is a palette decision, and it
belongs in Phase 1 rather than being patched per component.

### Print / PDF — already broken

Rendered at `media: print` and measured: **28 elements carrying real text compute to
`opacity < 0.05`.** Confirmed samples: the nine section-title spans, and the §9 Objectives
cards ("Baseline Figure — 22.1% countywide poll preference share…", "Deadline 31 October
2026 · Named Owner — Director of Digital Communications & Media"). Several sit inside
`hidden print:block` containers, so they are revealed by the print stylesheet and then
hidden again by an inline `opacity:0` that Motion never cleared.

Separately: **Print emits only the active tab** (54,066 characters), because `window.print()`
at `ClientPage.tsx:646` does not set `isExpanded`. A reader who hits Export PDF on the
opening section gets one ninth of the document. Flagged as a judgement call in §7 — I have
not changed it.

---

## 5. `@google/genai`

**Not present.** It is absent from `package.json` and `bun.lock`, and no source file
imports `@google/genai`, `GoogleGenAI`, or reads a Gemini key. `.env.example` documents
that the key was removed as inherited AI Studio scaffolding. **No dead weight in the
client bundle.**

One residue: `metadata.json:5` still declares
`"majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]`. It is not read by
Next.js and ships nothing, but it is a false statement in a repository whose whole
argument is that claims match delivery. Recommend deleting the line.

### What *is* dead weight

**`framer-motion@12.43.0` is installed alongside `motion@12.43.0`** — the same library
under both its old and new names. Exactly one file imports it,
`components/InteractiveToolsHubModal.tsx` (448 lines), and **that file is imported by
nothing.** Deleting the component lets `framer-motion` be dropped from `package.json`,
removing a duplicate copy of the entire animation library from the dependency graph.
This is the cheapest single win available and I propose taking it in Phase 1.

---

## 6. Findings, ranked

| # | Finding | Class | Where |
|---|---|---|---|
| **B1** | `bun run build` fails — `verify-content-integrity.mjs` rejects the LaTeX→Unicode conversion and the §8.2.3 reflow made in `d1c1559` | **Blocking** | `scripts/verify-content-integrity.mjs` |
| **B2** | Document body served at `opacity: 0`, awaiting hydration | **Blocking** | `ClientPage.tsx:45` |
| **B3** | 2.05 MB of RSC flight payload for eight unseen sections | **Blocking** | `app/page.tsx:41–48` |
| **B4** | 28 text elements at `opacity: 0` in print output | **Blocking** | Motion `initial` props, various |
| S1 | Ward register mounted 3× / 240 cards in one section | Structural | `MarkdownViewer.tsx:220`, `InteractiveTable.tsx:210` |
| S2 | `AsciiDiagram` mounts card + table views concurrently, ×30 | Structural | `AsciiDiagram.tsx:84,145` |
| S3 | 55 diagram blocks fall back to monospace panels, up to 114 chars wide | Structural | `lib/ascii-diagram.ts` |
| S4 | Accent `#348ff9` fails AA with white text (3.25:1) | Structural | `app/globals.css` |
| S5 | §4D "What it runs on" has no visual treatment at all | Structural | `MarkdownViewer.tsx` |
| S6 | Three parallel motion systems; 20 inline duration literals | Structural | 24 files |
| S7 | `framer-motion` duplicated with `motion`; sole consumer is dead code | Structural | `package.json` |
| S8 | `"Item N"` fallback headers | Craft | `AsciiDiagram.tsx:124` |
| S9 | Two `$…$` LaTeX fragments remain | Craft | `5-delivery.md:366,368` |
| S10 | `heading-order` and `target-size` a11y failures | Craft | 6 nodes |
| S11 | `metadata.json` declares an unused Gemini capability | Craft | `metadata.json:5` |

---

## 7. Judgement calls and blockers for the commissioner

**7.1 — Ward boundary geometry cannot be sourced in this environment. Phase 2 item 2
falls back.** The brief requires real Kitui admin-level-4 boundaries and explicitly
forbids hand-drawing them. This container's egress policy returns `403` on `CONNECT` for
every boundary source tried (HDX/OCHA `data.humdata.org`, GADM `geodata.ucdavis.edu`);
only npm, PyPI and crates are reachable. The one npm candidate, `osm-kenya-boundaries`,
carries names and hierarchy but **zero polygon geometry** (`grep -c "coordinates"` → 0).
No geo asset exists in the repo. Per the brief's own FALLBACK clause I will ship the
cartogram view alone unless you either commit a verified, attributable GeoJSON to the
repo or have an administrator allow one of those hosts. **The "land is not votes" argument
survives in weaker form** — a cartogram alone states it, where the morph proves it.

**7.2 — How to fix the content-integrity guard (B1).** The guard exists to prove the
restructure moved prose without rewriting it, and it is right to have caught this. I
propose extending it with a narrow, auditable normalisation — strip `$…$` math delimiters
and `\%`/`\ge`/`\pm` escapes from both sides before comparing, and register the §8.2.3
reflow as a quoted, listed allowance in the same style as the existing
`SPINE_ORIENTATION_LINES`. That keeps every figure under guard while permitting notation
to change. **I will not simply move the baseline commit forward**, which would discard the
guard's value. Confirm you are happy with that approach.

**7.3 — Print currently emits one section, not nine.** Unchanged and unfixed pending your
call. Options: leave it; make Print set `isExpanded` first; or add a separate "Export full
document" control. This changes reader-facing behaviour, so it is yours to decide.

**7.4 — Placeholder count.** The brief cites 19 "Awaiting campaign decision" placeholders.
I count **20** `[Insert…]`/`[Confirm…]` markers: 1-decision 2, 3-strategy 7, 4a 1, 4b 3,
4c 2, 4d 1, 4e 1, 5-delivery 3. Flagging rather than choosing. **No figure is affected.**

**7.5 — Deleting `InteractiveToolsHubModal.tsx`.** 448 lines, imported by nothing, sole
reason `framer-motion` is installed. I propose deleting it. Say if it is being held for
a reason.

**7.6 — The "named data gap" provenance state does not exist yet.** `ClaimBadge` has
three states — `verified`, `estimate`, `awaiting` — where the brief asks for Verified /
Awaiting campaign decision / **named data gap**. "Not yet measured" (the four nomination
KPI baselines) currently has no badge of its own and is plain table text. Phase 1 adds a
fourth state; `estimate` stays, since the document uses it. Confirm that is what you want
rather than a three-way replacement.

---

## 8. Self-check

- (a) **No statistic, date, section number or KPI code was altered.** This phase wrote no
  code and edited no content; the only file added is this audit.
- (b) No baseline was drawn at all, so none was drawn as zero. Flagged for Phase 2:
  `useAnimatedNumber` currently server-renders **0**, which must not reach a KPI baseline.
- (c) N/A — no animation added yet.
- (d) N/A — no animated visual added yet.
- (e) **Print output measured and found already broken** (28 elements, §4). Recorded as
  the "before" state so the Phase 3 verification has something to compare against.
- (f) **`bun run build` FAILS on HEAD** (B1), before any change of mine.
  `bunx next build`, skipping the prebuild guards, compiles clean with zero TS errors.
- (g) JS budget recorded: 422,524 B script transfer; ceiling 507,029 B.

**Assumption stated:** the budget is measured as Lighthouse's `resourceType: Script`
transfer sum, on `next start` against a production build, at the mobile preset. If you
meant a different measure — raw disk bytes, or First Load JS as `next build` prints it —
say so now, because it changes what fits.
