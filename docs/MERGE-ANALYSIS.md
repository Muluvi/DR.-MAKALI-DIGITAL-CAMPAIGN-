# Merge analysis — which parts of this site can be consolidated

A survey of the whole application (app/, components/, hooks/, lib/, data/, scripts/, the two
stylesheets, and the nine markdown sections) looking for one thing: places where two or more
parts do the same job and could be merged into one.

Nothing here has been changed. This is the map, ordered by value against risk.

Method: every module was traced to its importers, every repeated markup idiom was counted by
its exact class string, and every duplicated mechanism (scroll listeners, IntersectionObservers,
count-up engines, provenance footers) was located by grepping for the API it is built on. Line
counts are `wc -l`. Where a claim depends on bundler behaviour it is marked as needing a build
to confirm — `node_modules` is not installed in this checkout, so no build was run.

---

## Summary

| # | Merge | Files | Lines involved | Confidence |
|---|-------|-------|----------------|------------|
| 1 | The `next/dynamic` chart wrappers — and the code-splitting they don't buy | 7 + 2 | 129 wrapper lines | High |
| 2 | Dead modules and dead exports | 9 | ~880 | High |
| 3 | The panel shell (icon + eyebrow + title header) | 14 | 3,356 total, ~250 duplicated | High |
| 4 | The figure block (accent bar + title + provenance footer) | 17 | 1,137 total, ~200 duplicated | High |
| 5 | Page-position sensing — 4 scroll listeners, 5 IntersectionObservers | 8 | ~200 | High |
| 6 | The six `verify-*` scripts | 6 | 1,073 | High |
| 7 | Phone and terminal showcases — tilt, stage-scale, roving tabs | 4 | 943, ~120 duplicated | High |
| 8 | Two count-up engines | 4 | ~370 | Medium-high |
| 9 | `SourceLine` → `ProvenanceLine`, a supersession that never finished | 2 | ~90 | Medium-high |
| 10 | Reader-facing: paired cards showing the same data twice | 6 | — | Medium (editorial) |
| 11 | `globals.css` / `visual-fx.css` describe the same components in two files | 2 | 2,928 | Medium |
| 12 | `StrategicAids.tsx` — the one that should be **split**, not merged | 1 | 560 | High |

---

## 1. The `next/dynamic` chart wrappers, and the split they don't buy

Seven files exist only to wrap one other file in `next/dynamic`:

```
ComplianceCeilingPanel.tsx      →  ComplianceCeilingPanelContent.tsx
ConstituencyWeightBlock.tsx     →  ConstituencyWeightBlockContent.tsx
ElectoralTimelineBlock.tsx      →  ElectoralTimelineBlockContent.tsx
FiscalAuditChartBlock.tsx       →  FiscalAuditChartBlockContent.tsx
MediaOwnershipBlock.tsx         →  MediaOwnershipBlockContent.tsx
PathTo200kBlock.tsx             →  PathTo200kBlockContent.tsx
WardCartogramBlock.tsx          →  WardCartogramBlockContent.tsx
```

129 lines across seven files, six of which carry the identical doc comment with one word
changed. Meanwhile five sibling blocks — `CompetitiveQuadrantBlock`, `KpiPhaseBlock`,
`MizaniSlopeBlock`, `PlatformSizingBlock`, `ResourceEnvelopeBlock` — solve the same problem in
one file, by putting `dynamic()` around the *chart* rather than around the whole block. Two
patterns for one job; the second is strictly smaller.

**But the more important finding is that neither pattern is currently buying anything.**
`ClientPage.tsx` statically imports two components that import recharts at module top level:

- `components/ClientPage.tsx:43` → `DataVisualizations.tsx:5` → `from 'recharts'`
- `components/ClientPage.tsx:44` → `VoterProjectionsChart.tsx:5` → `from "recharts"`

`ClientPage` is the shell for every route. So the charting runtime is already in the first load
on every page, and the seven wrapper files are deferring a module that has already arrived.

There is a third leak worth checking in the same pass: `StrategicAids.tsx:11` imports eight
recharts symbols and **uses none of them** — no `<BarChart>`, no `<ResponsiveContainer>`
anywhere in the file — and `ClientPage.tsx:21` imports `FocusModeToggle` and
`PrintReportGenerator` from it. Whether that unused import actually lands in the entry chunk
depends on tree-shaking; the import should go regardless.

**Merge:** delete the seven wrappers, fold each `*Content.tsx` back into its block, and apply
the five-sibling pattern (`dynamic()` around the chart import). Then either make
`DataVisualizations` and `VoterProjectionsChart` dynamic in `ClientPage`, or accept that
recharts is a first-load cost and drop the ceremony everywhere. What should not survive is the
current state: the ceremony without the benefit.

**Verify with a build** (`next build` and read the chunk report) before and after.

---

## 2. Dead modules and dead exports

Nothing imports these. They are reachable only from documentation prose.

| File | Lines | Note |
|---|---|---|
| `components/AnimatedMetric.tsx` | 98 | Named in `docs/PHASE-0-AUDIT-redesign.md:109` |
| `components/RadialProgress.tsx` | 90 | Named in `WRITING-LOG.md:537` |
| `hooks/useSectionProgress.ts` | 86 | Superseded by the IO-based resolvers (§5) |
| `lib/utils.ts` | 6 | `cn()`; zero call sites. `clsx` + `tailwind-merge` are then unused deps |
| `components/ChartComponent.tsx` | 261 | Reachable only via `StrategicAids.tsx:560`, a re-export nobody imports |

Plus exported-but-unused symbols inside live files:

- `visual/Numerals.tsx` — `CountUp` (~53 lines), `Odometer` (~42), `ProgressRing` (~32). Only
  `CountUpText` has a call site (`Dashboard.tsx`). Roughly 127 of 214 lines are unreachable.
- `visual/SplitText.tsx` — `Typewriter` (~21), `Scramble` (~36).
- `visual/Reveal.tsx` — `Stagger`.
- `StrategicAids.tsx` — `AudioSummaryPlayer` (~100), `BrandUmbrella`.

**~880 lines.** This is the cheapest item on the list and it makes every item below it easier to
reason about — several of the "two implementations of X" findings resolve to "one
implementation and one corpse" once these are gone.

---

## 3. The panel shell — 14 components, one header

Fourteen components open with byte-identical markup: an outer card, a header band, a 40px
accent-tinted icon tile, an uppercase eyebrow label, and a serif title.

```
my-6 sm:my-8 bg-card border border-line rounded-2xl shadow-sm overflow-hidden not-prose
  p-4 sm:p-5 border-b border-line bg-paper/50
    w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0
      t-label font-extrabold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded
```

`AudienceSegmentationMatrix`, `BudgetScenarioModeler`, `CampaignOrgChart`,
`ConstitutionalBranchNavigator`, `CrisisWarRoomMatrix`, `DataSecurityEthicsCharter`,
`GeographicZoneMatrix`, `MediaRadioLandscapeCard`, `PathTo200kCalculator`,
`PersuasionFramingMatrix`, `PollingTrajectorySimulator`, `PublicServiceDeliveryTracker`,
`RecognitionDeficitOverlay`, `StrategicPillarsMatrix`.

Five of them go further and share the same *behaviour* — pick one item from a list, show its
detail panel:

```tsx
const [activeId, setActiveId] = useState(ITEMS[0].id);
const active = ITEMS.find((x) => x.id === activeId) ?? ITEMS[0];
```

**Merge:** a `<PanelShell icon eyebrow title tier>` component, plus a `<SelectorPanel>` for the
five that share the selection behaviour. ~250 lines of duplicated markup, and one place to
change the house style instead of fourteen.

**Accessibility dividend.** Seven components declare `role="tablist"`, and only two of them —
`PhoneShowcase` and `TerminalShowcase` — implement arrow-key navigation. `CeilingMeter`,
`FeaturePhoneSpecimen`, `AudienceSegmentationMatrix`, `BudgetScenarioModeler` and
`GeographicZoneMatrix` declare the ARIA role without the keyboard contract it promises, which
is worse than no role at all. One shared `<Tabs>` primitive fixes five bugs in one edit.

---

## 4. The figure block — 17 components, one header and footer

A second, distinct card idiom: a 6px accent bar, an `h4`, an explanatory paragraph, the figure,
and a `<ProvenanceLine />` footer.

```
w-1.5 h-6 bg-accent rounded-full shrink-0
font-serif text-sm font-bold text-ink
```

Seventeen files, and the shell is copied into each of them. This is the more *load-bearing* of
the two idioms — it is where the document's provenance discipline is enforced — which is an
argument for extracting it, not against: a `<FigureBlock provenance={…}>` that requires its
provenance prop makes the discipline structural rather than a convention each new file has to
remember.

---

## 5. Page-position sensing — four scroll listeners, five observers

Every one of these is mounted at once on every route (`ClientPage.tsx:533–947`,
`MarkdownViewer.tsx:329`), and each independently works out where the reader is:

**Scroll listeners** (page-level, each with its own rAF throttle):

- `ScrollProgressBar.tsx:46`
- `QuickNavCapsule.tsx:39`
- `hooks/use-chrome-visible.ts`
- `hooks/use-scroll-shell.ts`

`ScrollProgressBar` and the dead `useSectionProgress` compute overall progress with the same
expression — `scrollY / (scrollHeight - innerHeight)` — in two separate listeners.

**"Which section is active" resolvers**, four independent IntersectionObservers:

- `ClientPage.tsx:347`
- `PhaseRail.tsx:117`
- `SectionStickyBar.tsx:31`
- `visual/Chrome.tsx:37` (NavDots)

**Merge:** one scroll/position broker — a provider or a `useSyncExternalStore` source exposing
`{ scrollY, direction, progress, activeSectionId, chromeVisible }` — with one listener and one
observer behind it. Besides the ~200 lines, this removes a class of bug the codebase has already
been bitten by: `use-chrome-visible.ts`'s own doc comment records the floating capsules and the
nav dock disagreeing about when to withdraw, and fixes it by *copying MobileBottomNav's
thresholds*. Copied thresholds drift. One source does not.

(`ReachArchitecture3D` and `TierComparisonCarousel` also add scroll listeners, but they are
element-local and should stay as they are.)

Two smaller merges in the same area: `LazyMount.tsx` hand-rolls the IntersectionObserver that
`hooks/use-in-view.ts` already provides — it can be rewritten on top of `useInView({ once: true,
margin: "300px 0px", amount: 0.01 })` — and `hooks/use-marquee-active.ts` is a third copy.

---

## 6. The six verification scripts

`package.json` runs six scripts in series on every `prebuild` and `verify`:

```
verify-ward-register → verify-figures → verify-content-integrity
→ verify-mounts → verify-deep-links → visual-coverage
```

1,073 lines. They derive `ROOT` three different ways (`process.cwd()`, `fileURLToPath` +
`path.join`, `__dirname`). Five of the six independently walk `public/content/*.md`. Two
independently parse `components/MarkdownViewer.tsx` as text to extract the mount registry
(`verify-mounts.mjs:74`, `visual-coverage.mjs:58`). Three independently extract headings. Each
has its own pass/fail reporting.

**Merge:** one `scripts/verify.mjs` with a shared preamble — load content once, parse the mount
registry once, run six checks over the in-memory result, report once. Six Node startups become
one, six content reads become one, and a contributor adding a seventh check writes the check
rather than the scaffolding.

Keep the six checks as six named functions. The value is in sharing the I/O and the reporting,
not in blurring what each one proves.

---

## 7. Phone and terminal showcases

`components/phone/` and `components/terminal/` are parallel implementations of "a device you can
tilt, with switchable screens". The device *specs* differ genuinely and should stay separate —
a phone is not a field terminal. Three mechanisms are copies:

**Pointer tilt.** `PhoneFrame.tsx:64–91` and `TerminalFrame.tsx:68–94` are the same twenty lines:
`useMotionValue` × 2 → `useSpring(SPRING.gentle)` × 2 → `useTransform` for the sheen →
`onPointerMove` normalising to `±MAX_ROTATE_*`. → `useDeviceTilt({ maxX, maxY, perspective })`.

**Stage scaling.** `PhoneShowcase.tsx:64–73` and `TerminalShowcase.tsx:37–45` are identical
`useLayoutEffect` + `ResizeObserver` blocks computing `Math.min(1, clientWidth / BODY_W)`.
→ `useStageScale(BODY_W)`.

**Roving tablist.** Both implement the same `tabRefs` + ArrowLeft/ArrowRight/Home/End handler.
→ `useRovingTabs(ids)`, shared with the five broken tablists in §3.

~120 lines, and the extracted hooks are exactly what the five inaccessible tablists need.

Minor: the two directories disagree on import style — `phone/` uses `"../../lib/motion"`,
`terminal/` uses `"@/lib/motion"`. Worth settling on one while they are both open.

---

## 8. Two count-up engines

- `hooks/useAnimatedNumber.ts` + `visual/AnimatedNumber.tsx` — spring-driven, reserves width
  against layout shift, keeps the true figure in an `sr-only` sibling. Used by three chart
  components.
- `visual/Numerals.tsx` — `CountUp` / `CountUpText`, rAF + expo-out easing. Only `CountUpText`
  has a call site (`Dashboard.tsx`).

Both files carry careful, well-argued comments about the same three rules (never animate to the
truth, never hand a screen reader an intermediate value, never let the last frame drift). Those
rules are now stated twice and enforced by two different mechanisms.

**Merge:** give `AnimatedNumber` the string-parsing entry point `CountUpText` provides — the
parser already exists as `parseFigure()` in `useAnimatedNumber.ts` — then delete
`visual/Numerals.tsx` entirely, since the rest of it (§2) is unreachable. ~370 lines, one
counting engine, one place the honesty rules live.

---

## 9. `SourceLine` → `ProvenanceLine`

`ProvenanceLine.tsx`'s own doc comment says it "extends the existing SourceLine convention
(which only ever named a source) with the full schema the three-tier provenance system
requires." The supersession was never completed: `ProvenanceLine` is used in 13 files,
`SourceLine` in 7, and both render the same footer chrome — same `<Database size={10}>` icon,
same `t-micro uppercase tracking-wider font-bold text-muted`, same padding.

**Merge:** `SourceLine`'s `detectSources()` text-matching is genuinely different and worth
keeping (it works from prose, where `ProvenanceLine` works from structured data). Keep the
detector; render its result through `ProvenanceLine`, so there is one footer.

---

## 10. Reader-facing: the same data presented twice, back to back

Not code duplication — content duplication, visible to the reader. In
`MarkdownViewer.tsx`'s heading registry, three headings mount stacked cards drawn from the same
source data:

**`evidence-sec-1-2-6`** — `<ElectoralHistoryPanel />` then `<ElectoralTimelineBlock />`.
A table of Kitui results by cycle, immediately followed by a chart of the governor race by
cycle. Same sources (`COURT_OF_APPEAL_2018`, `IEBC_2022_RESULTS`), two cards, two headers.

**`evidence-sec-1-2-7`** — `<FiscalAuditPanel />` then `<FiscalAuditChartBlock />`.
A table of Auditor-General queries and pending bills, then a chart of the same figures from the
same `data/fiscal-audit` module.

**`evidence-sec-1-2-3`** — `<WardCartogramBlock />`, `<PathTo200kBlock />`,
`<ConstituencyWeightBlock />`. Three cards under one heading, all three reading
`data/ward-register`.

**Merge:** one figure per heading with a table/chart (or cartogram/path/weight) toggle. Fewer
cards to scroll past, the numbers and their picture in the same frame instead of one after the
other, and — with §1 done — one dynamic boundary instead of two or three.

This is an editorial call as much as a technical one, so it belongs to whoever owns the
document's argument, not to a refactor.

**Also editorial:** `4e-team.md` is 1,860 words against a 49,754-word document — its own route,
its own tab, for the shortest section by a factor of two. `docs/restructure/04-target-architecture.md`
argues 4A–4E are parallel execution tracks and should present as parallel, which is a real
argument for leaving it alone. Flagged, not recommended.

---

## 11. The two stylesheets

`globals.css` (1,687 lines) imports `visual-fx.css` (1,241 lines) at line 3. The intended split
is structure vs. motion, but four selectors are styled in both files — `.prose`, `.callout`,
`.claim-badge`, `.card` — and the split does not hold at the boundary: `visual-fx.css:1122`
sets `border` on `.prose code`, `:1112` sets `background-color` on table rows, `:1083` restyles
blockquotes. Those are structural properties in the motion file.

So changing how a callout looks means editing two files 500 lines apart, and the cascade order
between them is load-bearing (`globals.css:226` carries a comment explaining that the scrollbar
rule in `visual-fx.css §19` supersedes the one above it).

**Merge:** either co-locate per component (all `.callout` rules together, whichever file wins)
or make the split real by moving the structural properties out of `visual-fx.css`. The first is
less work and removes the cascade-order dependency; the second preserves the documented mapping
to `docs/VISUAL-FEATURE-LEDGER.md`. Worth a decision either way — the current state is the cost
of both.

---

## 12. The one that should be split, not merged

`components/StrategicAids.tsx` — 560 lines, thirteen unrelated exported components: an audio
player, a focus-mode toggle, a flywheel schematic, a messaging playground, a radio dial, a
counter-messaging grid, a slogan builder, an SMS visualiser, a scheduler, a brand mark, a print
generator. Two are dead (§2). One line at the bottom re-exports a fourteenth component from
another file.

Every other directory in this repo is one component per file. This is the exception, and it
costs: `ClientPage` wants two small UI controls from it and gets all thirteen, including the
unused recharts import discussed in §1.

**Split** into `components/aids/*.tsx`, matching `components/markdown/`. It is listed here
because it is the same problem as everything above — things that do different jobs sharing a
home, rather than things that do the same job living apart.

---

## Suggested order

1. **§2 dead code** — no behaviour change, and it shrinks the surface of everything else.
2. **§1 wrappers + the recharts entry-chunk question** — measure with a build first; the answer
   decides whether §1 is a deletion or a real code-splitting fix.
3. **§6 verify scripts** — self-contained, no UI risk, immediate feedback on every later step.
4. **§3 + §4 shells, §7 device hooks** — the largest win, and §3 carries the accessibility fix.
   Do them together; §7's `useRovingTabs` is what §3's five broken tablists need.
5. **§5 position broker** — the highest-risk item, because scroll and observer behaviour is hard
   to diff by eye. Do it last, alone, with `scripts/measure-chrome-occlusion.mjs` as the check.
6. **§8, §9, §11** — independent, any time.
7. **§10** — needs the document's owner, not a refactor pass.

`npm run verify` covers content integrity, figures, mounts, deep links and visual coverage, so
items 1–4 have a real regression check behind them. Items 5 and 11 do not — they are visual and
behavioural, and want a browser.
