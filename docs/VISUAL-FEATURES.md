# Visual Features Specification
## Dr. Makali Mulu Digital Campaign — Pitch Site

**Repo:** `Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-`
**Stack:** Next.js App Router · TypeScript · Tailwind · bun · Vercel
**Reader:** one person, on either a phone on mobile data or a laptop on wifi
**Job:** make the complete case without a meeting
**Scale:** ~46,000 words · 17 content files · 234 indexed sections · 40 bespoke visualisations
**Companion:** `docs/TRIAGE.md` — the triage this document's amendments come from
**Last amended:** 12 September 2026

---

## 0. How to use this document

**Amended 11 September 2026** against the repository, following the triage in
`docs/TRIAGE.md`. The original text of this document was written without read access to the
source. That access now exists, and the amendments below are the result. Entries F-01 to F-20
are preserved; where the triage contradicts one, the entry carries an **`AMENDED`** or
**`CUT`** note saying what changed and why. New entries continue from F-21.

### 0.1 What the repository turned out to be

Not a short pitch page. A **~46,000-word body of content** across 17 markdown files in
`public/content/`, rendered through one Next.js catch-all route as 17 sections, with **234 indexed
headings** (61 sub-sections, 173 parts) and **40 bespoke visualisation mount points** wired
through `HEADING_INSERTS` in `components/MarkdownViewer.tsx`. It opens on the situation analysis;
the cover page and executive summary were removed on 12 September as print conventions. Roughly 100 chart and panel
components already exist. The §3 inventory this document once asked you to run has been run;
its output is `docs/TRIAGE.md` §2.

That changes the emphasis of everything below. The substitution rule (§2.1) still governs, but
conversion cannot make this document shorter — only navigable. **Group G is therefore the
primary group, not the supporting one.**

### 0.2 Amendment log

| Entry | Change | Reason |
|---|---|---|
| §4.1 Palette | **AMENDED** — replaced with the shipped OKLCH tokens | The proposed dark palette does not exist; the shipped one encodes provenance and campaign phase and has survived a contrast audit. `TRIAGE.md` §5.6 |
| §4.2 Type | **AMENDED** — Montserrat / Newsreader / JetBrains Mono | Three families already self-hosted and subset. A fourth costs a download for no argument. `TRIAGE.md` §5.7 |
| §4.3 Motion | **AMENDED** — ambient-loop budget set to zero | Nothing on this page is live. `TRIAGE.md` §5.2 |
| F-01 Countdown | **AMENDED** — poll date still unverified | A date is a fact, not a feed; the date itself is not machine-checked |
| F-02 Progress rail | **AMENDED** — reading position, not a live phase readout | `TRIAGE.md` §5.2 |
| F-03 Ward map | **SHIPPED** — exists as `WardCartogram`, IEBC-verified on every build | `TRIAGE.md` §5.9 |
| F-05 Counters | **SHIPPED** — `CountUp`, `AnimatedNumber`, `Numerals` | |
| F-11 Live ticker | **CUT** | No real source exists. Constraint 3: a feature with no data source is cut, not faked |
| F-12 Scenario tool | **SHIPPED** — `PathTo200kCalculator`, `PollingTrajectorySimulator` | |
| F-13 Typographic hero | **SHIPPED**; width-axis animation demoted to conditional | |
| F-14 Grain and vignette | **CUT** | Fails the load-bearing test by its own admission; live today and rejected by the triage |
| §7 Performance budget | **AMENDED** — "0KB of new runtime dependencies" was false | Measured 289 KB of added runtime JS against a 150 KB budget. `TRIAGE.md` §5.1 |
| §8 Anti-patterns | **EXTENDED** — twelve rows added | Techniques found live in the repository that this specification rejects |
| §9 Build sequence | **REORDERED** | Group G first; the Recharts removal added as the budget-critical step |
| F-29, F-30, F-31 | **BUILT** — 11 September 2026 | Added runtime JS 289 KB → 163 KB. See §7.1 for the measured before and after |
| F-32 | **ADDED** | `motion/react`, 63 KB, is the whole remaining overrun |
| §2.1 Substitution rule | **AMENDED 12 Sep** — client override for print furniture only | A website needs no executive summary, and no pointers to elsewhere. Argument, evidence and figures are untouched |
| §1 front matter, §2 executive summary | **REMOVED 12 Sep** | Cover, confidentiality notice and contents deleted; the summary's claims redistributed into their owning sections |
| Section numbering | **REMOVED 12 Sep** | 259 headings de-numbered; ids are now slugs of the heading's own words, and survive a section moving |
| Cross-references | **REMOVED 12 Sep** | 177 in-prose pointers and 254 in-component ones replaced by the thing they pointed at |
| §10 Acceptance | **EXTENDED** | Two criteria satisfied with the command that satisfies them; four added |

### 0.3 How to read the entries

Section roles are now resolved to real files. Where an entry names a component, that component
exists at the path given unless the entry says **to build**.

Assumptions still open are flagged `⚑` and collected in `docs/TRIAGE.md` §7.

---

## 1. Organising concept

**The site should look like the thing it is proposing to build.**

Firefly is pitching to run a campaign's entire digital function. The most
efficient way to prove that capability is not to describe it — it is to hand Dr.
Mulu a working instrument panel and let him operate it. Every scroll should feel
like he is being shown the inside of a campaign nerve centre that already exists
and is already running on his behalf.

This reframes "more visual" away from illustration and toward **instrumentation**.
Not photographs of crowds. Live counters, ward-level maps he can tap, a message
pipeline he can watch move, a countdown that is genuinely counting. The medium
becomes the argument: a man who is deciding whether Firefly can build his digital
operation is, for four minutes, *using* it.

This also solves the minimal-text problem honestly. An instrument does not need
a paragraph explaining that it works. It just works, in front of you.

**Amended.** One word in the paragraph above has to go. The site should look like the thing it
is proposing to build — it must not look like a thing that is *already running*. Nothing here
is live: this is a proposal for work not yet commissioned, and `MOTION-SYSTEM.md` states the
rule correctly — *"a blinking 'Live' dot is a false claim however good it looks."* Constraint 3
makes simulated liveness the single largest risk in the project, and a nerve centre that
"appears to already be running on his behalf" is simulated liveness wearing a different word.

Keep the instrument; drop the liveness. He operates real controls over real, sourced figures —
the ward cartogram, the threshold calculator, the scope selector — and nothing pretends to be
receiving a feed. An instrument he can drive is more persuasive than a dashboard he can only
watch, because he can test the first and can only believe the second.

One consequence worth accepting up front: the site should feel restrained and
technical, not celebratory. Campaign-poster energy — flags, rosettes, rally
photography, exclamation — would undercut the positioning. Firefly is not the
candidate's supporter here. Firefly is the vendor with the control room.

---

## 2. The load-bearing test

Apply this to every feature before it earns a line of code:

> If this visual is removed, does the site lose **an argument**, or only lose
> **polish**?

Polish-only features are cut. Not deferred — cut. The site has one reader and a
minimal-text brief; there is no budget for decoration that a sceptical economist
would read as padding.

A feature passes if you can complete this sentence: *"This replaces the paragraph
that would otherwise have to say ______."*

### 2.1 The substitution rule — `AMENDED 12 September 2026`

> **Client override, and its exact boundary.** Firefly instructed that a website does not need
> an executive summary, and that the reader should be shown the data where it is relevant rather
> than told it lives somewhere else. That removes text no visual takes over, so it overrides the
> rule below — but only for **print-document furniture**: the cover page, the confidentiality
> notice, the table of contents, the executive summary's framing, in-prose cross-references,
> section numbering, and document voice.
>
> It does not touch argument, evidence or figures. The executive summary's *claims* were
> redistributed into the sections that own them rather than deleted, source and provenance lines
> stayed, and the evidence standard stayed. The substitution rule governs everything else
> unchanged.
>
> The word-for-word audit in §10 is amended accordingly: it now runs against the 12 September
> baseline, not against the original copy, and `scripts/verify-content-integrity.mjs` enforces
> it with **no allowances at all** — one differing body line fails the build.

**No text is removed without a visual taking over its job.**

This is the governing constraint on the whole exercise, and it runs in one
direction only:

- Prose whose claim a visual can carry → **converted.** The visual absorbs the
  job; the prose comes out of the main column.
- Prose whose claim no visual can carry → **stays.** Unchanged, in full.

There is no third category. "Too long" is not grounds for deletion. If a
paragraph cannot be converted, it has earned its place by default, and the
design's job is to find it a good home rather than to argue it away.

Two consequences follow, and both shape the catalogue:

1. **The site cannot get shorter by subtraction.** Density has to come entirely
   from conversion. Every word cut must be visible somewhere else on the page in
   another form.
2. **Retained prose needs somewhere to go.** If converted sections become
   visuals and unconverted sections stay as full paragraphs beneath them, the
   page reads as a gallery followed by a document. Group G exists to solve this:
   retained text lives *inside* the visuals as an inspectable layer, reachable on
   demand and out of the way until then.

Hiding is not removing. Every retained word stays reachable, in full, without
leaving the page.

Three worked examples:

| Feature | Verdict | Reason |
|---|---|---|
| Animated ward map of Kitui | **Passes** | Replaces prose claiming geographic granularity. Shows it instead. |
| Scroll-triggered fade on each section | **Fails** | Removes nothing. Adds ~15KB and a jank risk on low-end Android. |
| Live countdown to the August 2027 poll | **Passes** | Replaces a sentence about urgency with the actual number of days. |

---

## 3. Phase 0 — Repo inventory — `DONE`

This inventory has been run. Its output is **`docs/TRIAGE.md` §2**, which classifies all 68
sub-sections with word counts and current coverage. The method is kept below because it is how
the table should be regenerated when the content changes.

**Result, in one line:** 48 CONVERTIBLE · 19 RETAINED · 1 HOLLOW. Of the 48 convertible, 25
already carry a converting visual and 23 do not — and the 23 cluster almost entirely in the
operational half of the document (§8.11–§8.14, §11.2, §12.2–§12.4, §13.2–§13.5, §14.3–§14.6),
which between them hold 7,955 words and no figure at all.

### 3.1 The method, for regeneration

Produce this table before touching the catalogue:

| Route / section | File | Claim it makes | Word count | Currently carried by |
|---|---|---|---|---|
| | | | | text / visual / nothing |

Then flag three categories:

- **Over-texted / CONVERTIBLE:** sections above ~120 words whose claim is quantitative,
  geographic, sequential or comparative. These are the primary conversion
  targets — those four claim-types all render better than they read.
- **Unclaimed / HOLLOW:** sections that look substantial but assert nothing checkable.
  Do **not** visualise these — rendering an empty claim as a chart makes the
  emptiness more conspicuous, not less. They stay as prose. If a section reads as
  genuinely hollow, raise it as a copy question for Firefly to decide on. It is
  not a design decision, and it is not the designer's call to delete it.
- **Correctly prose / RETAINED:** argument, judgement, positioning, anything with an
  "if… then" structure. Leave these alone. Reasoning does not diagram well, and
  stripping text from them is how a pitch loses the case it was making.

The `⚑` assumption originally attached here — that `public/content/` holds copy as markdown —
is **confirmed**. Nineteen markdown files, one per top-level section, parsed into the index by
`lib/section-index.ts` at build time.

### 3.2 The one hollow section

**§14.2 "A lean core with a defined surge"** — 71 words, no figure, no table, no checkable
assertion. It restates §14.1's title and hands off to §14.3. Raised to Firefly as a copy
question: either it acquires a claim (what size is the core, what triggers a surge, on what
notice) or it merges into §14.1. Not a design decision.

### 3.3 Regenerating the inventory

The repository already automates most of it:

```
node scripts/visual-coverage.mjs        # per-section treatment table
node scripts/verify-mounts.mjs          # every mount resolves to a live heading
for f in public/content/*.md; do wc -w "$f"; done
```

---

## 4. Design tokens

### 4.1 Palette — `AMENDED`

The dark control-room palette originally specified here (`ink #12151C`, `dusk`, `bone`,
`ochre`, `sisal`, `signal`) was proposed without sight of the repository. It is withdrawn.
`app/globals.css` ships a light OKLCH palette whose contrast decisions are argued inline and
have already survived an audit — including a documented fix for a 3.25:1 failure, and a
deliberate split between `--accent` (text and stroke) and `--accent-solid` (fill, 6.31:1
against white). Rebuilding it dark would mean re-deriving every one of those ratios against a
new ground for an aesthetic reason. `TRIAGE.md` §5.6.

The shipped tokens, and what each is for:

| Token | Role |
|---|---|
| `--ink` | Primary text. `oklch(0.21 0.045 250)` |
| `--muted` | Secondary text |
| `--paper` | Page ground. `oklch(0.97 0.012 250)` |
| `--card` | Raised surfaces |
| `--line` | Hairline rules and borders |
| `--accent` | Wiper royal blue, as **text and stroke** |
| `--accent-solid` | The same blue as a **fill**, dark enough for white text at 6.31:1 |
| `--rival` / `--rival-solid` | The field. Cooler hue, a third of the chroma — a rival's number must never look more energetic than the campaign's own. Separated by lightness and chroma, not hue alone, so it survives deuteranopia |
| `--gold` | Wiper earth red, >4.6:1 as text |
| `--danger` | Errors and hard limits |
| `--phase-neg1` … `--phase-3` | One colour per campaign stage from §9.1, reused across the timeline, the phase-scoped charts and the section headers |

**Provenance tokens.** The palette carries a four-state evidence system, and this is the part
worth protecting: `verified` (green), `estimate` (amber), `unmeasured` (deliberately
colourless — the absence of a reading, not a status), and `disputed`. An economist looks for
the source before he looks at the number, and these tokens are how the page answers him
without a sentence.

**The accent rule survives the amendment.** `--accent` and `--gold` mark *this is the number
that matters*, never decoration. If either appears more than three times on a screen it has
stopped meaning anything.

### 4.2 Type — `AMENDED`

Bricolage Grotesque is withdrawn. `app/layout.tsx` already loads three variable families
through `next/font/google` — self-hosted, latin-subset, `display: 'swap'`, with
`adjustFontFallback: true` to hold layout shift at the swap. A fourth family costs a download
on a metered connection to change the character of the display face, and character is not an
argument. `TRIAGE.md` §5.7.

- **Display / UI — Montserrat.** Variable weight. Carries headings, labels and chart type.
- **Body — Newsreader.** Unchanged from the original specification, and correct: low contrast,
  open apertures, holds up at 15–17px on a phone.
- **Data / code — JetBrains Mono.** Carries the ASCII diagrams in `public/content/` (over 900
  lines of them across §3.4, §7.1, §8.3, §8.8, §11.2 and §13.1), which are content, not
  decoration, and need a monospace to stay aligned.

Avoid Inter, and avoid the high-contrast-serif-on-cream pairing that now reads as a machine
default.

**Scale.** Two ramps, both already in `@theme`, and they are deliberately separate: a reading
ramp (`--text-micro` … `--text-display`) and a chart ramp (`--text-chart-micro` …
`--text-chart-title`). Chart type that scales with body type ends up either unreadable or
overbearing; keeping them apart is what lets a 47,867-word document and a dense figure share a
page.

Body line length capped at 68 characters. Serif body gets 1.65 line-height.

### 4.3 Motion — `AMENDED`

One orchestrated moment per screen, maximum. A single reveal that lands beats six that
scatter. All motion behind `prefers-reduced-motion`. Motion that responds to a tap is always
welcome; motion that happens at you is usually not.

**Ambient loop budget: zero.** `MOTION-SYSTEM.md` permits three. The triage reduces it to
none, on the reasoning in §1 above: a loop implies a running system, and nothing here is
running. Of the three currently permitted, the hero marquee and the language swap both hide
peer content on a timer, and the field–digital cycle is carried better by the click-stepped
diagram at F-22, which the reader advances himself.

Loading states — skeleton, spinner, pre-hydration placeholder — are not ambient. They run
while something is pending and stop when it resolves, and they stay.

**The three rules from `MOTION-SYSTEM.md` stand unchanged and are restated here because every
entry below depends on them:**

1. **Transform and opacity only.** Never `width`, `height`, `top` or `left`. Height changes
   use a `grid-template-rows: 0fr → 1fr` collapse.
2. **Motion encodes meaning.** Counters count. Timelines draw forward. Bars grow from their
   baseline. Maps fill outward. Flows trace along their path.
3. **Never animate to the truth.** Under reduced motion a bar renders at its final proportion,
   not at zero. A bar caught at zero is showing false data, and this document cannot afford
   that.

---

## 5. Feature catalogue

Grouped by the job each group performs.

---

### Group A — Orientation: where the reader is, and how much time is left

#### F-01 — Live countdown to the general election
`AMENDED — the date is not machine-verified.`
A date is a fact, not a feed, so this entry survives §1's liveness correction unchanged in
substance. But `public/content/roadmap.md` and `objectives.md` both state 10 August 2027 from
copy, and unlike the ward register there is **no build-time guard on it**. `verify-figures.mjs`
checks that numeric literals trace to a source; it does not check this date against IEBC.
Until someone does, F-01 ships a number this repository cannot defend. Treat that as the
blocking item it is.
- **Replaces:** any sentence asserting that the timeline is short or that early
  investment matters.
- **Argument it carries:** urgency, stated as a fact rather than a claim.
- **Baseline:** static server-rendered day count, computed at request time. Large
  numeral in display face, `ochre`. Roughly 333 days as of September 2026.
- **Enhanced:** client-side tick to the second on the final segment only. The
  seconds moving is the whole effect; do not animate days.
- **Implementation:** server component computes days; a small client child
  handles the ticking segment. `app/` route-level, no library.
- **Dependencies:** none.
- **Data required:** the poll date. Kenyan general elections fall on the second
  Tuesday of August — 10 August 2027 — but **verify against IEBC before
  shipping**. A wrong date on the hero of a pitch to a sitting MP is fatal.
- **Effort:** S · **Priority:** P0

#### F-02 — Scroll progress as a campaign timeline
`AMENDED — reading position, not a live phase readout.`
Shipped as `components/PhaseRail.tsx` against `lib/phases.ts` (five stages, one colour each).
The label must read as *where you are in the document*, not as *what phase the campaign is
currently in* — the second is a claim about a live operation and §1 rules it out. Also carries
§9.2's coalition sequencing and §10.2's deliverables schedule, both of which are the same
calendar seen twice.
- **Replaces:** a conventional progress bar, and the navigation menu.
- **Argument it carries:** that Firefly thinks in campaign phases, not website
  pages. Reading position doubles as position in the campaign calendar.
- **Baseline:** thin fixed rule at the top, `ochre` fill, phase name as a small
  label at the left.
- **Enhanced:** phase markers along the rule; the active phase label crossfades
  on entry.
- **Implementation:** `hooks/useScrollPhase.ts`, IntersectionObserver against
  section boundaries. Do not use a scroll listener.
- **Dependencies:** none.
- **Data required:** phase names mapped to sections.
- **Effort:** M · **Priority:** P1

---

### Group B — Geography: proving the operation reaches the whole county

#### F-03 — Interactive Kitui ward map
`SHIPPED — and the IEBC verification is automated.`
Exists as `components/charts/WardCartogram.tsx` + `components/markdown/WardCartogramBlock.tsx`,
reading `data/ward-register.json` — all 40 wards across the 8 constituencies, sourced to IEBC's
*Registered Voters per County Assembly Ward*. `scripts/verify-ward-register.mjs` runs on every
`prebuild` and fails the build if the register and its totals drift apart:

```
Ward register integrity check passed: 40 wards across 8 constituencies
sum to 532758 (532833 including 75 prison voters).
```

The original entry's "verify the current ward count and boundaries against IEBC" is therefore
**satisfied, continuously, by a command**. This is the strongest single piece of work in the
repository. Remaining scope on F-03 is §11.3's message-lab zone coverage, which is the same
geometry with a different metric.
- **Replaces:** several paragraphs claiming county-wide, granular coverage. This
  is the single highest-value conversion in the document.
- **Argument it carries:** that Firefly's targeting model operates below
  constituency level. A candidate looks at a map of his own county and
  immediately tests it against what he knows. If it holds up, credibility
  transfers to everything else on the page.
- **Baseline:** pre-rendered SVG of Kitui's 8 constituencies — Mwingi North,
  Mwingi West, Mwingi Central, Kitui West, Kitui Rural, Kitui Central, Kitui
  East, Kitui South — with a static choropleth fill. No interaction, no JS.
- **Enhanced:** ward-level subdivisions, tap-to-inspect panel, animated fill
  transition when switching the displayed metric.
- **Implementation:** simplify boundary geometry to SVG paths at build time and
  commit the result to `public/`. Do **not** ship TopoJSON and parse it client-
  side; the file is the payload problem.
- **Dependencies:** none at runtime if paths are pre-baked. `d3-geo` as a build-
  time devDependency only.
- **Data required:** Kitui boundary geometry, plus one metric per unit. Verify
  the current ward count and boundaries against IEBC. Metric values are
  placeholders until sourced — **do not invent them**.
- **Effort:** L · **Priority:** P0

#### F-04 — Coverage density overlay
- **Replaces:** claims about reach of specific channels.
- **Argument it carries:** where the digital operation is strong and — more
  persuasively — where it is not yet. Showing a gap you intend to close reads as
  honest analysis. Showing uniform coverage reads as marketing.
- **Baseline:** static dot-density layer on the F-03 SVG.
- **Enhanced:** toggle between channel layers with a crossfade.
- **Dependencies:** none.
- **Effort:** M · **Priority:** P2 — depends entirely on F-03 landing first.

---

### Group C — Evidence: quantitative claims that should never be sentences

#### F-05 — Reach and penetration figures as animated counters
`SHIPPED.` `components/visual/Numerals.tsx` (`CountUp`, `CountUpText`),
`components/AnimatedMetric.tsx`, `hooks/useAnimatedNumber.ts`. The final value is exposed to
assistive technology from frame one. Extend to §2.4, §4.1 and §4.2, which state the five
commitment targets as prose today.
- **Replaces:** any sentence of the form "X% of voters in Kitui use Y."
- **Baseline:** final value rendered server-side. Present and readable with JS
  disabled.
- **Enhanced:** count-up on first view, 700ms, ease-out, once only. Never
  re-trigger on scroll-back — a number that recounts looks like an animation
  rather than a measurement.
- **Implementation:** `components/Counter.tsx`, `requestAnimationFrame`, guarded
  by IntersectionObserver and `prefers-reduced-motion`.
- **Dependencies:** none.
- **Data required:** cited figures only. Attach the source inline in small type
  beneath each figure. An economist will look for the source before he looks at
  the number.
- **Effort:** S · **Priority:** P0

#### F-06 — Channel comparison chart
`AMENDED — the rejection of Recharts is correct and the repository violates it.`
This entry's "explicitly reject Recharts and Chart.js" is right, and understated: measured at
**123 KB gzipped as actually imported here**, not 95 KB. Eleven components import it —
`ChartComponent`, `DataVisualizations`, `StrategicAids`, `VoterProjectionsChart`, `MatrixMarks`
and six under `components/charts/`. See **F-30**, which is the work of getting back inside the
budget.
- **Replaces:** a comparison table or a paragraph ranking channels by cost or
  reach.
- **Baseline:** static SVG bars, server-rendered, labelled directly on the bars
  rather than in a legend.
- **Enhanced:** bars grow from baseline on entry; tap a bar for detail.
- **Implementation:** hand-rolled SVG. A bar chart is ~40 lines of JSX and needs
  no library.
- **Dependencies:** **none — explicitly reject Recharts and Chart.js here.**
  Recharts is roughly 95KB gzipped and would consume most of the budget for one
  chart.
- **Effort:** M · **Priority:** P1

#### F-07 — Before/after audience growth curve
- **Replaces:** projections stated as prose.
- **Argument it carries:** trajectory. Two lines diverging is instantly legible
  in a way that "we project significant growth" is not.
- **Baseline:** static two-line SVG, endpoints labelled.
- **Enhanced:** `stroke-dashoffset` draw-on, 900ms, staggered by 150ms.
- **Dependencies:** none.
- **Data required:** a modelled projection, **clearly marked as a projection**.
  Label the axis. Do not present a model as a measurement.
- **Effort:** M · **Priority:** P1

---

### Group D — Process: showing the machine, not describing it

#### F-08 — Message pipeline diagram
- **Replaces:** the longest prose block in most digital-strategy pitches — the
  one explaining how content moves from decision to published post.
- **Argument it carries:** operational maturity. A named, staged pipeline is
  evidence of a system; a paragraph about "integrated content workflows" is not.
- **Baseline:** static SVG flow, left-to-right on desktop, stacked on mobile.
  Stage names, no motion.
- **Enhanced:** a single token animates along the path on a slow loop,
  demonstrating throughput. One token, one loop — not a swarm.
- **Implementation:** `components/Pipeline.tsx`. SVG path with
  `animateMotion`, or a CSS offset-path animation. Both are free.
- **Dependencies:** none.
- **Effort:** M · **Priority:** P0

#### F-09 — Rapid-response clock
- **Replaces:** a claim about response times to attacks or breaking stories.
- **Argument it carries:** speed, in the only unit that matters. A radial dial
  filling to "under 45 minutes" is a commitment; a sentence is a hope.
- **Baseline:** static radial arc with the figure at centre.
- **Enhanced:** arc sweeps on entry.
- **Dependencies:** none.
- **Data required:** the committed response SLA. This is a promise Firefly has to
  be able to keep — set it with the delivery team, not the design.
- **Effort:** S · **Priority:** P1

#### F-10 — Channel architecture map
- **Replaces:** a bulleted list of platforms.
- **Argument it carries:** that the channels are a connected system with a
  centre, not a shopping list. Shows which feeds which.
- **Baseline:** static node diagram, hand-positioned. **Do not use a force
  simulation** — force layouts are nondeterministic, they thrash on mobile, and
  they make a considered architecture look accidental.
- **Enhanced:** tap a node to dim the unconnected ones.
- **Dependencies:** none.
- **Effort:** M · **Priority:** P1

---

### Group E — Proof of craft: the site demonstrating the capability

This group is where the organising concept pays out. These features are the
strongest available answer to "can you actually build things?" because they are
not claims at all.

#### F-11 — Live sentiment or mention ticker
`CUT.`
This entry's own escape clause fires: *"If no live source exists, cut this feature entirely."*
No live source exists in the repository — there is no monitoring feed, no ingestion route, and
`.env.example` wires nothing that would provide one. Under Constraint 3 a feature with no real
data source is cut, not faked. It returns only if Firefly stands up a real feed and is willing
to stand behind it publicly.

The capability claim §13.2 makes is carried instead by **F-22**, a click-stepped diagram of
the war room's shift coverage and escalation path — which asserts a *designed* system rather
than a *running* one, and is the honest version of the same argument.
- **Replaces:** a description of monitoring capability.
- **Argument it carries:** that the monitoring exists and is running now.
- **Baseline:** a static recent snapshot, server-rendered at build.
- **Enhanced:** polls a route handler on an interval, new items enter with a
  short slide.
- **Implementation:** `app/api/` route handler. `⚑ The repo contains .env.example,
  which suggests a server-side key is already wired — likely Gemini, given the AI
  Studio template origin. Confirm before designing around it.`
- **Dependencies:** none beyond the existing SDK.
- **Data required:** a real source. **If no live source exists, cut this feature
  entirely.** Simulated live data on a pitch site is the single worst risk in this
  document — if Dr. Mulu or an aide works out that the ticker is fabricated, every
  other number on the page becomes suspect.
- **Effort:** L · **Priority:** P2 — high value, conditional on real data.

#### F-12 — Interactive scenario tool
`SHIPPED.` `components/markdown/PathTo200kCalculator.tsx` (§3.4.3, four routes to the
threshold) and `PollingTrajectorySimulator.tsx` (§2.2). `ModelVariablesDrawer.tsx` puts the
assumptions on the page, which is what makes an economist's interrogation of the model go
well. This is the entry the organising concept rests on: he moves an input, the arithmetic
moves, and he is testing the model rather than reading about it.
- **Replaces:** a static projections table.
- **Argument it carries:** that Firefly's model responds to inputs — and it puts
  the candidate's hand on the controls. He adjusts a slider, the projection
  moves, and he is now using the product rather than reading about it.
- **Baseline:** three or four pre-computed scenarios as selectable cards.
- **Enhanced:** continuous slider, live-recomputed output, animated transition.
- **Implementation:** `components/ScenarioModel.tsx`. Pure client-side
  arithmetic; no round trip.
- **Dependencies:** none.
- **Data required:** a defensible model, with assumptions visible on the page. He
  is an economist. He will interrogate the model, and the assumptions being
  visible is what makes that interrogation go well.
- **Effort:** L · **Priority:** P1

---

### Group F — Texture and identity

#### F-13 — Typographic hero
`SHIPPED; the width-axis animation is demoted to conditional.`
The hero lands today without it. Montserrat's width axis surviving the `next/font` latin subset
is unconfirmed, and the entry's own framing — "restraint and confidence" — is character, not
argument. Ship the static hero; add the animation only if someone can state what prose it
absorbs.
- **Replaces:** a stock photograph or a generic gradient header.
- **Argument it carries:** restraint and confidence. Also loads instantly, which
  is itself a demonstration.
- **Baseline:** the proposition set large in Bricolage Grotesque at wide width,
  on `ink`, left-aligned. No image.
- **Enhanced:** the variable width axis animates from condensed to wide over
  1.2s on load. One orchestrated moment, once per session.
- **Implementation:** CSS `font-variation-settings` transition.
- **Dependencies:** none.
- **Effort:** S · **Priority:** P0

#### F-14 — Grain and vignette on dark surfaces
`CUT.`
The entry states its own verdict: *"Replaces nothing — this fails the load-bearing test as
decoration."* It is live anyway, as `.fx-grain` and `.fx-vignette` inside
`components/visual/AmbientField.tsx`, together with `.fx-aurora` (three blurred wells
parallaxing at 0.6/1.0/1.5), `.fx-motes` (a particle field) and `.fx-mesh`. All of it goes.
See **F-31**.
- **Replaces:** nothing — **this fails the load-bearing test as decoration.**
  Included only because a flat `#12151C` field reads as unfinished on a large
  display, and that impression costs credibility. If the desktop rendering already
  looks considered without it, cut it.
- **Baseline:** omitted on mobile.
- **Enhanced:** SVG `feTurbulence` at ~3% opacity, CSS-only.
- **Dependencies:** none.
- **Effort:** S · **Priority:** P2

#### F-15 — Section transitions as instrument state changes
- **Replaces:** conventional section dividers.
- **Argument it carries:** continuity — one instrument changing readout, rather
  than a series of separate pages.
- **Baseline:** hairline rule in `dusk`, with the phase label from F-02.
- **Enhanced:** the readout in the progress rule updates as the section changes.
- **Dependencies:** none.
- **Effort:** S · **Priority:** P2

---

### Group G — Retained text: where prose goes when it stays

Every feature in this group exists because of §2.1. None of them removes a word.
They give unconvertible prose a home that does not flatten the visuals it sits
beside. Treat this group as **P0 alongside the conversions** — building the
visuals without it produces a page that is half instrument, half essay.

#### F-16 — Annotation layer on every visual
`P0 — and the emphasis is now higher than this document originally set it.`
At 47,867 words across 241 sections, the text-housing group is not scaffolding for the
conversions; it **is** the product. Partly shipped as `components/markdown/ProseFold.tsx` and
`DisclosureGroup.tsx`. The native `<details>`/`<summary>` base is the right call and must
survive: it is keyboard-reachable, works with JS off, and — the part that matters under Rule 1
— browser in-page find reaches text inside it while collapsed.
- **Holds:** the explanatory prose belonging to a converted section — the
  sentences that gave context around the claim the visual now carries.
- **Argument it carries:** that the visual is backed by reasoning, available on
  demand rather than asserted.
- **Baseline:** prose rendered directly beneath the visual as a caption block, in
  Newsreader at 15px, `bone` at 80% opacity. Fully present, fully readable, no
  interaction required.
- **Enhanced:** the same text collapses into a single-line summary with an
  expand control. Expanded state persists per section for the session.
- **Implementation:** `components/Annotation.tsx`. Native `<details>`/`<summary>`
  as the base element — it is keyboard-accessible, works without JS, and is
  findable by browser in-page search even when collapsed.
- **Dependencies:** none.
- **Effort:** M · **Priority:** P0

#### F-17 — Tap-to-inspect on data points
- **Holds:** the sentence-level detail behind individual figures, wards, bars or
  pipeline stages.
- **Argument it carries:** depth. A reader who probes a specific ward and finds
  a real note behind it concludes the whole dataset is real.
- **Baseline:** the detail text rendered as a labelled list beneath the visual,
  so nothing is locked behind a gesture on a low-capability device.
- **Enhanced:** tap or focus a data point, detail appears in a fixed panel
  adjacent to the visual. Panel position stable — not a cursor-following tooltip.
- **Implementation:** extend F-03 and F-06 with a shared `InspectPanel`. Bind to
  both `click` and `focus` so keyboard reaches it.
- **Dependencies:** none.
- **Effort:** M · **Priority:** P1

#### F-18 — Margin notes on desktop
- **Holds:** qualifications, caveats, methodology notes and source statements
  that interrupt the argument if left inline.
- **Argument it carries:** rigour, without breaking reading flow. An economist
  reads the margin.
- **Baseline:** notes appear inline, directly after the passage they qualify, in
  smaller type. Full text, no interaction.
- **Enhanced:** at wide viewports the note moves to a right margin column,
  vertically aligned to its anchor.
- **Implementation:** CSS grid with a named margin track; the note is a sibling
  element repositioned by media query, never duplicated in the DOM.
- **Dependencies:** none.
- **Effort:** M · **Priority:** P1

#### F-19 — Full-text reading mode
`P0 — promoted from P1.`
Promoted because of scale. With 241 sections and 39 converted mounts, "nothing was hidden from
him" stops being a courtesy and becomes the only way the substitution rule is checkable by the
reader rather than merely promised by the designer. It also covers the forwarding case
directly: an aide who wants the document, not the instrument, gets it from one control.

The repository already has the two things this depends on — the original prose is intact in
`public/content/`, and `scripts/verify-content-integrity.mjs` proves it, failing the build if
any of the 4,036 body lines drifts from its baseline commit. That guard is what makes F-19
honest.
- **Holds:** everything. The complete prose, including text that was converted
  into visuals.
- **Argument it carries:** that nothing was hidden from him. This is the feature
  that makes the substitution rule verifiable by the reader rather than merely
  promised by the designer. It also covers the case where Dr. Mulu forwards the
  link to an aide who wants the full text rather than the experience.
- **Baseline:** a single persistent control that expands every annotation,
  margin note and inspect panel on the page at once.
- **Enhanced:** the same control also swaps each visual for the prose it
  replaced, giving a continuous document view. Toggle state in the URL so the
  document view is directly linkable.
- **Implementation:** `hooks/useReadingMode.ts` with a context provider. Keep the
  original prose for each converted section in `public/content/` — converting a
  section must never mean deleting its source text from the repo.
- **Dependencies:** none.
- **Effort:** L · **Priority:** P1

#### F-20 — Progressive disclosure on long-form sections
- **Holds:** the unconvertible argument sections — positioning, judgement,
  anything with an "if… then" structure.
- **Argument it carries:** none by itself. It stops dense reasoning from making
  the page feel like a wall, without touching a word of it.
- **Baseline:** the full passage, set at a comfortable measure. No truncation.
- **Enhanced:** first paragraph visible, remainder behind an expand control
  labelled with what it contains — "the reasoning behind this", not "read more".
  Never truncate mid-sentence and never use a fade-out gradient over cut text.
- **Implementation:** `<details>` again, styled. Expanded by default when
  `prefers-reduced-motion` is set or JS is unavailable.
- **Dependencies:** none.
- **Effort:** S · **Priority:** P0

---

### Group H — Conversions for the operational half of the document

`docs/TRIAGE.md` §2.4 found that every one of the 39 existing mount points sits in the first
half of the document. Sections §8.11–§8.14, §11.2, §12.2–§12.4, §13.2–§13.5 and §14.3–§14.6
carry **7,955 words between them and not one bespoke visualisation**. A reader who reaches
§11.2 passes from an instrument panel into a plain document, at exactly the point where an
economist starts checking whether the operation is real. This group closes that gap.

#### F-21 — Matrix heatmap
- **Replaces:** ten cross-tabulations currently set as markdown tables — §3.2 source tiers,
  §3.5.4 zone weighting, §5.1 segment matrix, §7.1.2 message-by-segment, §7.3.4
  channel-by-language, §8.1 workstream boundaries, §8.14.2 procurement matrix, §11.2
  indicator framework, §12.3 decision rights, §14.3–14.4 team by phase and scope level.
- **Argument it carries:** that the assignments are systematic rather than listed. A reader
  scanning a filled grid sees the shape of the coverage — and, more usefully, the holes in it
  — without reading a cell.
- **Baseline (mobile/metered):** the markdown table, unchanged, with cells tinted by value.
  No JavaScript. Fully readable, fully searchable, correct at 320px with the table in its own
  `overflow-x: auto` container.
- **Enhanced (capable device):** cells fill on entry, staggered by row; tap or focus a cell
  for the note behind it in the stable inspect panel from F-17.
- **Implementation:** `components/markdown/MatrixHeatmap.tsx`, extending the existing
  `MatrixMarks.tsx`. Hand-rolled; **`MatrixMarks` currently imports Recharts and must stop**
  (F-30). One shared component, ten mount points.
- **Dependencies:** none.
- **Data required:** the existing table content. No new figures. Where a cell is empty today
  it stays empty and renders as `unmeasured` — the colourless provenance state, not zero.
- **Effort:** M · **Priority:** P0

#### F-22 — Click-stepped sequence diagram
- **Replaces:** the longest sequential prose in the document — §13.1.2's four-tier response
  decision tree, §13.2.1's shift coverage, §13.5.1's IEBC clearance checklist, §8.3.4's weekly
  production schedule, §8.4.3's testing cycle, §12.2's meeting rhythm, §1.3's structure
  explanation, §16.2's ask.
- **Argument it carries:** operational maturity, and — after §1's correction — a *designed*
  system rather than a running one. A named, staged sequence the reader advances himself is
  evidence of a system; a paragraph about integrated workflows is not. This is also the
  honest replacement for the cut F-11.
- **Baseline (mobile/metered):** every step rendered, stacked, numbered, all visible at once.
  The full prose of each step present beneath its label. No interaction required.
- **Enhanced (capable device):** steps advance on tap or arrow key; the current step's detail
  expands and the others collapse to their labels. **Never autoplays** — motion answering a
  tap, per §4.3. Numbered markers only here, because these are genuinely sequences.
- **Implementation:** `components/markdown/SequenceSteps.tsx`. SVG connector path with
  `stroke-dashoffset`, CSS only. Reuses `AsciiDiagram.tsx`'s existing content where §12.4 and
  §13.3 already hold the sequence as a code fence.
- **Dependencies:** none.
- **Data required:** the existing step content.
- **Effort:** M · **Priority:** P0

#### F-23 — Scope-level selector
- **Replaces / Holds:** §10.1.1's comparison of the three scope levels.
- **Argument it carries:** that the levels are one system at three settings, not three
  products. He picks a level and the deliverables list resolves to it.
- **Baseline:** all three levels rendered as a labelled table, every row visible.
- **Enhanced:** a segmented control filters the table in place.
- **Implementation:** **shipped** — `components/markdown/ServiceLevelSelector.tsx`.
- **Dependencies:** none.
- **Data required:** none new. **Carries no cost, fee or budget content** and must not acquire
  any — Constraint 1.
- **Effort:** — · **Priority:** shipped

#### F-24 — Provenance highlight in running prose
- **Holds:** §3.2.1's assertion that every figure carries its provenance.
- **Argument it carries:** the assertion, demonstrated instead of made. A reader who sees
  which figures are marked, and finds a real source behind one he picks, concludes the rest
  are real too.
- **Baseline:** the marked figure carries a visible source line beneath its paragraph, in
  small type. Full text, no interaction.
- **Enhanced:** the mark is a highlight sweep drawn once on entry; tap or focus opens the
  source in `FootnotePopover`, positioned stably rather than following a cursor.
- **Implementation:** **shipped** — `components/markdown/HighlightedText.tsx`,
  `lib/highlight-patterns.ts`, `ProvenanceLine.tsx`, `SourceLine.tsx`, `ClaimBadge.tsx`,
  `DisputedFigure.tsx`.
- **Dependencies:** none.
- **Data required:** `data/sources.ts`, already tiered 1–3.
- **Effort:** — · **Priority:** shipped

#### F-25 — Document navigation set
- **Replaces:** §1.3's list of what is in the document, and the navigation menu.
- **Argument it carries:** that 47,867 words are an organised instrument rather than a wall.
  Position, destination and continuity, from one set of devices.
- **Baseline:** the section index as a plain nested list of links; the section number visible
  at the top of the viewport; a back-to-top link at each section end. All server-rendered.
- **Enhanced:** scroll-spy highlights the active section; the tab indicator slides; route
  changes use the View Transitions API behind `prefers-reduced-motion: no-preference`; the
  sticky bar changes state on scroll direction; back-to-top appears after the first screen.
- **Implementation:** **largely shipped** — `SectionStickyBar.tsx`, `QuickNavCapsule.tsx`,
  `MobileBottomNav.tsx`, `MobileTOCModal.tsx`, `ScrollProgressBar.tsx`,
  `hooks/useSectionProgress.ts`, `@view-transition` in `visual-fx.css`.
- **Dependencies:** none.
- **Data required:** `lib/section-index.ts`, derived from the markdown at build time.
- **Effort:** S (remaining) · **Priority:** P0

#### F-26 — Methodology drawer
- **Holds:** §8.13.3–8.13.5's modelling methodology, variables and evaluation; §3.4.3's
  derived-figure workings; §3.2.3's rule for when two sources disagree.
- **Argument it carries:** rigour available on demand. An economist reads the method; a reader
  who does not want it should not have to scroll past it to reach §8.14.
- **Baseline:** the full methodology rendered inline beneath the claim it supports, in smaller
  type. Nothing behind a gesture.
- **Enhanced:** at wide viewports it moves to a right-hand drawer aligned to its anchor; the
  note is one element repositioned by media query, **never duplicated in the DOM**.
- **Implementation:** **shipped** — `ModelVariablesDrawer.tsx`, `DerivedFigureDrawer.tsx`.
  Extend to §3.2.3.
- **Dependencies:** none.
- **Data required:** none new.
- **Effort:** S · **Priority:** P1

#### F-27 — Height-reserving skeleton
- **Replaces:** nothing. Enabling.
- **Argument it carries:** none directly — it is what holds CLS under 0.05 while 39 mounts
  hydrate, and a page that jumps under the reader's thumb costs credibility in a way no
  argument recovers.
- **Baseline:** a reserved box at the figure's final height, rendered server-side. No motion.
- **Enhanced:** a single sweep while the mount is pending, stopping when it resolves. This is
  a loading state, not an ambient loop, and is exempt from the zero-loop budget in §4.3.
- **Implementation:** **shipped** — `components/SectionSkeleton.tsx`, `LazyMount.tsx`.
- **Dependencies:** none.
- **Data required:** none.
- **Effort:** — · **Priority:** shipped

#### F-28 — Section portrait
- **Replaces:** nothing that prose was carrying. Present because §3.3.1 and §12.1 are about a
  person and a reporting relationship, and a face is the honest illustration of both.
- **Argument it carries:** none on its own. It is the one place this document permits an image
  at all, and the constraint is the point: **no rally photography, no crowds, no flags** —
  Constraint 5.
- **Baseline:** `next/image` at the 800px rendition, AVIF/WebP, `loading="lazy"`, blur
  placeholder, explicit dimensions.
- **Enhanced:** the 1600px rendition where `sizes` calls for it. **No Ken Burns** — the
  22-second looping zoom currently on these portraits is cut under §4.3.
- **Implementation:** `components/Portrait.tsx`, `markdown/SectionPortrait.tsx`. Remove
  `.fx-kenburns`.
- **Dependencies:** none.
- **Data required:** the four portraits already in `public/portraits/`.
- **Effort:** S · **Priority:** P1

#### F-29 — Ranked ward inspector
- **Replaces:** §3.4.2's prose ranking the 40 wards and naming the 12 that carry most — and
  replaces `WardRegisterTicker`, which currently scrolls the same figures past the reader at
  36px/s.
- **Argument it carries:** that the targeting model operates ward by ward, and that the
  campaign knows which twelve decide it. The rank order *is* the argument, so it has to hold
  still long enough to be read.
- **Baseline:** all 40 wards as a static ranked bar chart, server-rendered, labelled directly
  on the bars, with voter counts and share. Readable with JS disabled.
- **Enhanced:** tap or focus a bar for that ward's note in the F-17 inspect panel; the top
  twelve carry the accent, the rest the muted stroke.
- **Implementation:** replace `components/charts/WardRegisterTicker.tsx` with
  `WardRankedBars.tsx`. Keep the existing matrix view, drop the ticker view and its
  `useMarqueeActive` dependency.
- **Dependencies:** none — hand-rolled SVG, no Recharts.
- **Data required:** `data/ward-register.json`, already IEBC-sourced and build-verified.
- **Effort:** M · **Priority:** P0

#### F-30 — Hand-rolled chart primitives (the Recharts removal)
- **Replaces:** `recharts` — **123 KB gzipped as actually imported here**, measured with
  esbuild against the 18 named exports used across eleven components. This entry is what gets
  the project back inside Rule 4.
- **Argument it carries:** the same charts, at 1% of the weight. Also, directly: a site that
  loads fast on Kenyan mobile data is the most credible thing a digital vendor can hand a
  client, and it is an argument made without a sentence.
- **Baseline:** static SVG, server-rendered, labelled on the marks rather than in a legend.
  Identical output to today's charts at rest.
- **Enhanced:** bars grow from baseline, lines draw by `stroke-dashoffset`, rings fill — all
  from `lib/motion.ts`'s existing `growFromBaseline` and `drawPath` variants, which already
  exist and are already used.
- **Implementation:** `components/charts/primitives/` — `Bars.tsx`, `Line.tsx`, `Scatter.tsx`,
  `Axis.tsx`, `Ring.tsx`. Then convert the eleven importers: `ChartComponent`,
  `DataVisualizations`, `StrategicAids`, `VoterProjectionsChart`, `markdown/MatrixMarks`, and
  `charts/{CompetitiveQuadrantChart, PlatformSizingChart, ResourceLedgerBarChart,
  PathTo200kChart, MizaniSlopeChart, ConstituencyBarChart}`. A bar chart is ~40 lines of JSX.
- **Dependencies:** **removes** `recharts` and its eleven transitive `d3-*` packages.
- **Data required:** none new — the same props, a different renderer.
- **Effort:** L · **Priority:** **P0 — this is the budget.**

#### F-31 — Dead-rule and dependency removal
- **Replaces:** nothing. It removes.
- **Argument it carries:** none directly. It is the cost of the twenty-six rejections in
  `TRIAGE.md` §5.3, and it is what makes the §7 arithmetic true rather than aspirational.
- **What comes out:**
  - **`components/visual/AmbientField.tsx`** in full — `.fx-aurora` (three parallaxing wells),
    `.fx-motes` (particle field), `.fx-grain`, `.fx-mesh`, `.fx-vignette`.
  - **The custom cursor** — the dot and lagging ring in `components/visual/Chrome.tsx`, and
    their `pointermove` rAF loop.
  - **Pointer effects** — `TiltCard`, `SpotlightCard`, `.fx-magnetic`, `.fx-lift`,
    `hooks/use-pointer-fx.ts`. None of them exists on a phone, all of them ship to one.
  - **`.fx-loop-marquee`, `.fx-loop-float`, `.fx-loop-blink`** and the three permitted ambient
    loops, per §4.3.
  - **`TierComparisonCarousel`** — §10.1.2's table stays and is the accessible equivalent
    already.
  - **`Typewriter`** in `SplitText.tsx`; the typewriter in `ReachSplit.tsx` stays only if it
    is reproducing a real USSD session's own pacing, which is content, not effect.
  - **Eighteen unreachable CSS rules** — the eight unused `Reveal` variants (`blur`,
    `diagonal`, `down`, `flip-x`, `flip-y`, `iris`, `rotate`, `unfold`, `wipe-diag`,
    `wipe-up`; only `left`, `right` and `pop` are ever passed), plus `.fx-kenburns`,
    `.fx-loop-blink`, `.fx-mask-fade-x`, `.fx-pause-on-hover`, `.fx-text-gradient`.
  - **`framer-motion` from `package.json`** — 63 KB gzipped, **zero imports**; all 54 files
    import from `motion/react`.
- **Implementation:** deletion, plus `npm run verify` to confirm nothing referenced them.
- **Dependencies:** removes one.
- **Data required:** none.
- **Effort:** M · **Priority:** P0


#### F-32 — Remove `motion/react`
- **Replaces:** the last runtime dependency standing between this project and its own weight
  budget. 63 KB gzipped, measured with esbuild against the React-external build.
- **Argument it carries:** the same one F-30 carries. A proposal that argues its reader is on
  Kenyan mobile data, and then ships 63 KB of animation runtime to say so, is arguing against
  itself. This is the step that takes added runtime JS from 163 KB to roughly 100 KB and puts
  the project inside the 150 KB budget with headroom rather than on the line.
- **Baseline (mobile/metered):** identical. Every entrance this library drives is already
  specified as a CSS animation in `app/visual-fx.css`, and the CSS path is the one a reduced-
  motion or JS-disabled reader already takes.
- **Enhanced (capable device):** identical. `Reveal` and `Stagger` already do this work with
  `fx-in-*` and `--fx-delay`; `AnimatePresence` is the only genuine gap and is covered by a
  `@starting-style` enter plus a short exit timeout on the four surfaces that need it — the
  tab switch, the TOC sheet, the reading-settings sheet and the quick-nav capsule.
- **Implementation:** 54 files. The used surface is narrow and maps cleanly:
  | Import | Uses | Replacement |
  |---|---:|---|
  | `motion.*` | 49 | `Reveal` / `Stagger`, or a bare element with an `fx-in-*` class |
  | `AnimatePresence` | 19 | `@starting-style` + an exit timeout, per surface |
  | `useInView` | 14 | `hooks/use-in-view.ts`, which already exists and is already used |
  | `useTransform`, `useSpring`, `useMotionValue`, `useScroll` | 8 | `hooks/useSectionProgress.ts` and CSS custom properties written on pointer/scroll |
  | `LayoutGroup` | 1 | the one shared-element case; drop it or use the View Transitions API already wired in |
- **Dependencies:** **removes one, adds none.**
- **Data required:** none.
- **Risk:** the highest of any step in this document. It touches 54 files, and the failure mode
  is silent — an entrance that no longer fires looks like a design choice rather than a bug.
  Do it after the conversions, one surface at a time, checking each against the degradation
  matrix rather than against how it looks on a laptop.
- **Effort:** L · **Priority:** **P0 — this is the remaining 13 KB.**

---

## 6. Degradation matrix

| Feature | 3G phone | 4G phone | Desktop wifi | Reduced motion | JS off |
|---|---|---|---|---|---|
| F-01 Countdown | static count | static count | digit roll | static count | static count |
| F-02 Progress rail | rule only | rule + labels | full | rule only | hidden |
| F-03 Ward map | static SVG | static + tap | full interactive | no transitions | static SVG |
| F-05 Counters | final value | final value | count-up | final value | final value |
| F-06 Bars | static SVG | static SVG | grow-in | final proportion | static SVG |
| F-08 Pipeline | static SVG | static SVG | path draw | complete path | static SVG |
| F-09 Response dial | static arc | static arc | arc sweep | static arc | static arc |
| F-12 Scenario tool | preset cards | slider | slider | slider, no anim | preset cards |
| F-13 Hero | static | static | line-mask reveal | static | static |
| F-16 Annotation | full caption | collapsible | collapsible | expanded | **expanded** |
| F-17 Inspect | list beneath | tap panel | tap/focus panel | no transition | list beneath |
| F-18 Margin notes | inline | inline | margin column | inline | inline |
| F-19 Reading mode | expand-all | expand-all | full swap | expand-all | **all expanded** |
| F-20 Disclosure | expanded | collapsible | collapsible | expanded | **expanded** |
| **F-21 Matrix heatmap** | tinted table | tinted table | cells fill + inspect | final tint | **tinted table** |
| **F-22 Sequence steps** | all steps open | all steps open | step on tap | all steps open | **all steps open** |
| **F-23 Scope selector** | full table | full table | segmented filter | filter, no anim | **full table** |
| **F-24 Provenance mark** | source line beneath | source line beneath | popover on tap/focus | static mark | **source line beneath** |
| **F-25 Navigation set** | index list | index + spy | full | no slide | **index list** |
| **F-26 Methodology drawer** | inline | inline | drawer | inline | **inline** |
| **F-27 Skeleton** | reserved box | reserved box | sweep | reserved box | reserved box |
| **F-28 Portrait** | 800px AVIF | 800px AVIF | 1600px | same | same |
| **F-29 Ward inspector** | static ranked bars | bars + tap | bars + inspect | final proportion | static ranked bars |
| **F-30 Chart primitives** | static SVG | static SVG | grow / draw | final proportion | static SVG |
| **F-31 Removals** | — | — | — | — | — |
| **F-32 Removals** | — | — | — | — | — |

**Cut, and therefore absent from every column:** F-11 (live ticker), F-14 (grain and vignette).

Detect tier with `navigator.connection.effectiveType` where available, falling back to a
viewport-and-pointer heuristic. Gate enhancements on that, not on screen width alone — a cheap
Android phone on 4G and a laptop on tethered 3G are not the same problem.

**The rule that matters:** every baseline cell must make the same argument as the enhanced
cell. A reader on 3G should reach the end of the site with the complete case, unaware anything
was withheld.

Note the direction the text-housing features degrade in — bolded above. Every one falls back to
**more text visible, not less**. Disclosure controls are an enhancement for capable devices;
where the enhancement is unavailable, the prose is simply there. No configuration of device,
connection or preference can leave a word unreachable.

---

## 7. Performance budget — `AMENDED`

The original text of this section read: *"Running total against the catalogue as specified: 0KB
of new runtime dependencies."* That was written without sight of `package.json` and it was not
true. F-30 and F-31 have since been built; both the before and after below are measured.

### 7.1 Measured

`npm install && npm run build`, then `gzip -9c .next/static/chunks/*.js`. Next's reported
"First Load JS" figures are gzipped — independently confirmed, since the gzipped chunk sum
matched Next's report exactly.

| | Before (11 Sep, am) | After F-29/30/31 | Change |
|---|---:|---:|---:|
| First Load JS | 421 KB | **296 KB** | **−125 KB** |
| — Next/React baseline | 132 KB | 133 KB | — |
| — **added runtime JS** | **289 KB** | **163 KB** | **−126 KB** |
| Stylesheet | 32.8 KB | **29.5 KB** | −3.3 KB |
| `visual-fx.css` source | 65,013 B | **42,901 B** | −34% |
| Unreachable `.fx-*` rules | 94 | **0** | −94 |
| Orphan keyframes | 25 | **0** | −25 |
| Runtime dependencies | 16 | **14** | −2 |
| npm packages installed | 576 | **541** | −35 |

**The budget is 150 KB. Added runtime JS is 163 KB. Still 13 KB over — see §7.3.**

### 7.2 Per-library, isolated

esbuild, `--bundle --minify --format=esm --platform=browser`, React external:

| Library | gzipped | Status |
|---|---:|---|
| `recharts`, as imported here | 123 KB | **removed — F-30** |
| `framer-motion` | 63 KB | **removed — zero imports** |
| `motion/react` | 63 KB | **kept — 54 files. The whole remaining overrun.** |
| `react-markdown` + `remark-gfm` + `rehype-raw` | 35 KB | **kept** — the document is markdown; load-bearing |
| `lucide-react`, 8 icons | 1 KB | **kept** — tree-shakes correctly |

Recharts was 82% of the entire budget on its own, for charts this document's §8 rejects it for.
Removing it took the eleven transitive `d3-*` packages with it.

### 7.3 What is left

| Step | Saving | Running total |
|---|---:|---:|
| As shipped, 11 Sep am | — | 289 KB |
| F-30 — Recharts out, hand-rolled primitives in | −123 KB | 166 KB |
| F-31 — effects layer, dead rules, `framer-motion` | −3 KB JS, −3.3 KB CSS | **163 KB** ← here |
| **F-32 — `motion/react` out** | **−63 KB** | **~100 KB** |
| **Budget** | | **150 KB** |

One item remains, and it is a real piece of work rather than a tidy-up: `motion/react` is
imported by 54 files. The surface actually used is narrow — `motion` (49), `AnimatePresence`
(19), `useInView` (14), and single-digit uses of `useTransform`, `useSpring`, `useMotionValue`,
`useScroll` and `LayoutGroup` — and the repository already has a CSS-driven `Reveal` and its own
`hooks/use-in-view.ts` covering most of it. Partial removal saves nothing: tree-shaking means the
library is either in the bundle or it is not.

**See F-32.** Until it ships, this document is 13 KB over its own budget and says so.

### 7.4 Other budget lines

| Metric | Target | Measured | How to verify |
|---|---|---|---|
| Added JS (gzipped) | < 150 KB | **163 KB — over by 13 KB** | `npm run build`; §7.1 |
| CSS (gzipped) | < 30 KB | **29.5 KB — passes** | `gzip -9c .next/static/css/*.css` |
| Unreachable CSS rules | 0 | **0 — passes** | the audit in §7.1 |
| LCP, simulated 3G | < 2.5s | not measured | Lighthouse mobile, throttled |
| CLS | < 0.05 | not measured | reserve height on every SVG — F-27 does this |
| Fonts | 3 families, subset latin | ✓ | `next/font`, `display: swap` |
| Images | AVIF/WebP via `next/image` | ✓ | 4 portraits, two renditions each |
| Total first load | < 500 KB | **326 KB** (296 JS + 30 CSS) | Vercel deployment summary |

Set `prefers-reduced-data` handling alongside `prefers-reduced-motion`. It has thin support
today but costs one media query.

---

## 8. Anti-patterns — considered and rejected

The first block is unchanged from the original specification. The second block is new: each
row is a technique found **live in this repository** that the triage rejects. Full list and
locations in `docs/TRIAGE.md` §5.3.

| Rejected | Why |
|---|---|
| Recharts / Chart.js | **123 KB gzipped as imported here** — measured, not estimated — for charts that are 40 lines of SVG. 82% of the budget for no capability gain. |
| Three.js / WebGL hero | 150KB+ before a single scene, plus GPU cost on low-end Android. No argument it could carry that SVG cannot. |
| Framer Motion across the site | ~63 KB gzipped, measured. Justifiable for F-12's slider if it proves fiddly; not justifiable as the default motion layer. Try CSS first. |
| Fade-and-slide-up on every section | Adds nothing, reads as machine-generated, and is the most common tell in AI-produced sites. |
| Hover-lift on cards | No hover on the device this is most likely opened on. |
| Rally / crowd photography | Wrong register. Firefly is the vendor with the control room, not a supporter with a camera. |
| Identical rounded cards with soft grey shadows | Flattens hierarchy — everything reads as equally important, so nothing does. |
| All-caps tracked eyebrow labels | Template chrome. Encodes nothing. |
| Force-directed node layout | Nondeterministic, mobile-hostile, makes deliberate architecture look accidental. |
| Simulated live data | Catastrophic if detected. Unverifiable claims contaminate verifiable ones. |
| Carousels | Hide *peer* content behind interaction, with no indication of what is hidden or how much. Distinct from F-20, which puts subordinate detail under a visible, labelled summary. |
| Fade-out gradient over truncated text | Implies the text is optional and makes the cut point arbitrary. Use a labelled control against a clean paragraph break. |
| "Read more" as a label | Says nothing about what is behind it, so nobody opens it. Label the content: "the reasoning behind this". |
| **Ambient background field** (aurora wells, particle motes, grain, mesh) | **Live today** in `AmbientField.tsx`. Four rejected techniques in one component. Replaces nothing. |
| **Custom cursor with trailing ring** | **Live today** in `Chrome.tsx`. A `pointermove` rAF loop for an effect half the readers cannot see, on a document about fiscal discipline. |
| **3D pointer tilt and pointer spotlight** | **Live today** as `TiltCard` / `SpotlightCard`. Desktop-only effects that still ship their JavaScript to every phone. |
| **Magnetic buttons** | **Live today** as `.fx-magnetic`. An attention-seeker on a control that is already a control. |
| **Ken Burns on the candidate portraits** | **Live today** as `.fx-kenburns`, 22 seconds, above the fold. Campaign-poster register, and the only looping transform on the first screen. |
| **Ticker for the ward register** | **Live today** as `WardRegisterTicker`. The most checkable dataset in the document, moving at 36px/s past the reader most likely to want to stop on it. The single most damaging row in this table. |
| **Typewriter effect** | **Live today** in `SplitText.tsx`. Simulated typing in a document whose §3.2 is an evidence standard. |
| **Weather-like and time-of-day ambient effects** | **Live today** per the ledger. In a county whose §3.3.8 is about drought, animated weather is worse than decorative. |
| **Logo float and logo-wall loop** | **Live today**. The Wiper umbrella on a 4.2s cycle encodes nothing. |
| **Gradient text and drop caps** | **Live today** as `.fx-text-gradient` and the ledger's cat-12 rows. Template chrome. |
| **Unreachable CSS rules** | Eighteen remain. A rule that implies a capability the site does not have is worse than no rule — the repository's own ledger says so and it is still true. |
| **A declared dependency nothing imports** | `framer-motion` at 63 KB gzipped. Costs nothing today; costs the whole remaining budget the first time someone imports it by habit. |

---

## 9. Build sequence — `REORDERED`

Two changes from the original order. **Group G moves to the front**, because at 47,867 words
the text housing is the product rather than the scaffolding. **F-30 moves to the front**,
because until Recharts is out the project is at 193% of its weight budget and every later step
is spending money it does not have.

Each step leaves the site in a shippable state. Stop wherever the deadline lands.

1. ~~**F-31 — removals.**~~ **DONE.** Delete before building. `AmbientField`, the custom cursor, the pointer
   effects, the carousel, the ticker's marquee mode, the eighteen dead CSS rules, the
   `framer-motion` declaration. Nothing here needs design review, and the page gets faster and
   quieter the same afternoon.
2. ~~**F-30 — hand-rolled chart primitives.**~~ **DONE — −123 KB gzipped.** The budget. Eleven components, `Bars` / `Line` /
   `Scatter` / `Axis` / `Ring`, then remove `recharts`. Largest single win in the document at
   −123 KB gzipped, and the one step that makes §7 true.
3. **F-16 and F-20 — the disclosure scaffolding.** Build the containers for retained prose
   before converting anything. Convert first and the unconverted paragraphs pile up beneath the
   new visuals with nowhere to go. Partly shipped as `ProseFold` / `DisclosureGroup`.
4. **F-25 — the navigation set.** 241 sections need a position and a destination before they
   need better figures. Largely shipped; finish it.
5. **F-19 — full-text reading mode.** Promoted to here from last, because the substitution rule
   is unverifiable without it and every later conversion widens the gap it closes.
6. **F-21 — matrix heatmap.** One component, ten mount points, the highest
   conversions-per-hour ratio in the document.
7. **F-22 — click-stepped sequence diagrams.** The longest sequential prose blocks, and the
   honest replacement for the cut F-11.
8. ~~**F-29 — ranked ward inspector.**~~ **DONE.** Replaces the ticker with something that holds still. Brought forward because the ticker was actively damaging §3.4.2 and the component was dead code.
9. **F-05 counters + F-06 bars** extended to §2.4, §4.1, §4.2, §5.2, §8.11, §8.13.
10. **F-08 path draw** on §8.12, §12.4, §13.3, §14.6.
11. **F-03 extension** — §11.3's message-lab zone coverage on the existing cartogram.
12. **F-17, F-18, F-26.** The remaining text homes.
13. **F-01, F-02, F-09, F-28.** Structural devices with arguments attached. **F-01 does not
    ship until the poll date is verified against IEBC.**
14. **F-32 — remove `motion/react`.** The last 13 KB. Highest risk in the document: 54 files,
    and a failure mode that looks like a design choice rather than a bug.
15. **Conditionals**, only if their preconditions are confirmed: brush-and-zoom, zoom-to-region,
    variable-font axis, before/after slider, shape morph. Live-updating stream only if a real
    feed exists.

A note on stopping points. If the deadline lands mid-sequence, stop after a conversion, never
mid-conversion. A section that is half chart and half orphaned paragraph is worse than either
alternative.

---

## 10. Acceptance criteria

Testable. Do not call it done until all of these hold. Items marked ✓ are satisfied today,
with the command that satisfies them.

- [ ] Every shipped feature has a written answer to "what prose does this replace?"
- [ ] **Word-for-word audit passes:** diff the pre-build copy against the shipped site. Every
      sentence is either visible on the page, reachable through a disclosure control, or
      demonstrably carried by a named visual. Nothing is unaccounted for.
- [x] **Original prose for every converted section still present in `public/content/`** —
      enforced continuously by `scripts/verify-content-integrity.mjs`: *"all 4036 body lines
      are unchanged since a275e00."*
- [x] **Kitui boundaries and ward count verified against IEBC** —
      `scripts/verify-ward-register.mjs`: *"40 wards across 8 constituencies sum to 532758."*
- [x] **Every mount point resolves to a heading that exists** — `scripts/verify-mounts.mjs`:
      *"39 mount points all resolve (241 headings indexed)."*
- [x] **Every numeric literal in the UI traces to a source** — `scripts/verify-figures.mjs`.
- [x] **Every deep link resolves** — `scripts/verify-deep-links.mjs`: *"837 legacy ids and 241
      live ids all resolve."*
- [ ] Browser in-page search finds text inside collapsed containers
- [ ] With JS disabled, every disclosure container renders expanded
- [ ] Lighthouse mobile performance ≥ 90, throttled to slow 3G
- [ ] Full case comprehensible with JavaScript disabled
- [ ] Full case comprehensible with `prefers-reduced-motion: reduce`
- [ ] No horizontal scroll at 320px width
- [ ] Keyboard focus visible on every interactive element
- [ ] Every numeric claim carries a visible source, or is labelled a projection
- [ ] No cost, budget, fee or credentials content anywhere on the site
- [ ] **Poll date verified against IEBC** — still open. `roadmap.md` and `objectives.md` state
      10 August 2027 from copy, with **no build-time guard**, unlike the ward register. A wrong
      date on the hero of a pitch to a sitting MP is fatal.
- [ ] **Total added runtime JS under 150 KB gzipped, arithmetic shown** — was 289 KB, now
      **163 KB after F-30 and F-31**. Still 13 KB over. F-32 closes it; §7.3 shows the arithmetic.
- [x] **Zero ambient loops running** — `AmbientField`, the marquee, the logo float and the
      pulse loops are gone with F-31. Re-check with `grep -rn "repeat: Infinity"` and for CSS
      `animation-iteration-count: infinite` outside loading states.
- [x] **Zero unreachable CSS rules** — 94 removed with F-31; the audit in §7.1 now returns
      zero. Re-run it after any change that drops a class from markup.
- [x] **No declared dependency without an import** — `framer-motion` removed with F-31,
      `recharts` with F-30.
- [ ] Opened on an actual mid-range Android phone on actual mobile data before the link is sent

That last one is not optional. Everything in this document assumes a reader whose conditions
you have not personally tested.
