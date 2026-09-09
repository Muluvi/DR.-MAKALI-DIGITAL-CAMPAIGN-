# Visual feature ledger

Two questions this document answers, both of them checkable:

1. **Every one of the 262 sections** — what visual treatment does it get?
2. **Every technique in the brief** — was it shipped, was it already here, or was
   it considered and declined, and on what grounds?

Neither half is typed by hand. Part 1 is regenerated from `public/content/*.md`
and the renderer's own mount table; part 2 is regenerated from the brief. Run:

```
node   scripts/checks/visual-coverage.mjs --check          # part 1
python scripts/visual-feature-ledger.py <brief.md>  # part 2
```

---

## 0. What "262" is

It is not a count from the brief. It is this repository's own section count —
the number `scripts/checks/mounts.mjs` and `scripts/checks/deep-links.mjs` have
been printing on every build:

```
verify-mounts:     39 mount points all resolve (262 headings indexed).
verify-deep-links: 608 legacy ids and 262 live ids all resolve.
```

262 headings across nine content files: **50 sub-sections (h2)** and **212
parts (h3)**, of which **39** carry a bespoke visualisation.

The brief itself is a different count — 524 bullets, about 480 distinct
technique names, across 22 categories. Part 2 covers all of them.

---

## 1. Reach: how a decision gets to all 262 sections

The thing that made this tractable is that all 262 headings render through **one
component**, and all 262 bodies render through **one renderer**. So coverage is
structural rather than a matter of visiting 262 places:

| Layer | File | Reaches |
|---|---|---|
| Heading treatment | `components/markdown/SectionHeading.tsx` | all 262 |
| Prose surfaces | `.prose` rules in `app/visual-fx.css` | all 262 |
| Figure reveal | selector-driven `@supports (animation-timeline: view())` | every figure, table and mounted visualisation in all 262 |
| Bespoke figures | `HEADING_INSERTS` in `MarkdownViewer.tsx` | 39 |

### The two heading signatures

Deliberately two, not one, and deliberately not more:

- **h2 — a sub-section opens a new argument.** Clip wipe from the left, a left
  bar that is a brand gradient rather than a flat rule, a marker sweep under the
  title, and a hairline running out to the right margin.
- **h3 — a part is a step inside an argument already open.** A 6px rise over
  340ms, and nothing else.

212 of the 262 are h3. Anything stronger on those turns a long read into a
strobe, which is the failure this repository's previous audit was written about.

### What every section's body gets

Gradient rules. Links that draw their underline rather than carrying one. A
raised initial on each sub-section's lead paragraph, at reading widths only.
Blockquotes with a gradient bar and a real quote glyph. Sticky table headers,
with the row under the pointer marked. Figures that lift while the picture zooms
inside the frame, so the paragraph below never moves. A gold hairline under the
bold runs that carry this document's figures.

The test each of these had to pass: **would it still be welcome on the fortieth
section?** Anything that only worked as a one-off — a sweep, a bounce, a colour
cycle — was rejected here and kept for a single surface.

---

## 2. The three rules everything obeys

1. **Transform and opacity only.** Never width, height, top or left. The target
   device is a mid-range Android and those force layout on every frame.
2. **Motion encodes meaning.** A bar grows from its baseline; the cartogram fills
   in ward order; a counter counts.
3. **Never animate to the truth.** Under `prefers-reduced-motion` every effect
   resolves to its *final* state, never to zero. A bar caught at zero is showing
   false data, and Appendix A of this proposal — *"No figure has been invented to
   fill any of these"* — does not allow that.

Rule 3 is why the reduced-motion block sets `animation: none` on the chart and
map classes rather than zeroing a duration, and why `CountUp` derives its
displayed value from the source when motion is reduced instead of counting.

---

## 3. What the reduced-motion reader gets

A *different finished page*, not a degraded one.

| | Full | Reduced |
|---|---|---|
| Ambient loops (aurora, grain, marquee, Ken Burns) | running | **off** |
| Entrances | animate | resolved instantly |
| Charts, cartogram, rings | grow / fill | **at their true value from frame one** |
| Skeletons | sweep | flat placeholder |
| Spinners | spin | **still spin** — one that does not is a bug |
| Hover, press, focus | full | kept, shortened to 90ms |

Interaction feedback is deliberately exempt from the cull: a press state that
never appears is a bug, not a preference.

Print resolves every effect to its finished state, drops every field and every
piece of chrome, and un-collapses every fold.

---

## 4. Two defects this work exposed

Both were pre-existing and both are fixed:

- **Scroll-triggered entrances held at `opacity-0` would have printed blank.**
  IntersectionObserver never reports an element that was below the fold when a
  print is requested. The hold is now `.fx-preveal`, which both print and reduced
  motion override, so the visible state is the default and an observer only ever
  *confirms* it.
- **The per-heading copy-link button hid on hover, on a device with no hover.**
  A `group-hover:opacity-100` utility would have made it permanently invisible on
  a phone — the device this proposal is most likely to be read on. It is now
  gated inside `@media (hover: hover) and (pointer: fine)`.

Two more found on the way: `Dashboard`'s counter computed progress as
`(timestamp - timestamp % 1 + timestamp - startTime)`, close to double the real
elapsed time, so it finished in about half its stated duration; and its tilt card
called `setState` on every mousemove — a full React render per frame of a
gesture. Both were replaced by the shared primitives.

---

## 5. Cost

Measured against a build with the effects layer's import removed:

| | gzipped |
|---|---|
| Total CSS before this work | 23.7 KB |
| After the first pass (272 classes, 181 of them unreachable) | 37.0 KB |
| **After trimming to what is reachable** | **30.8 KB** |

The effects layer costs **7.1 KB gzipped**. The first pass cost 13.3 KB, and
almost half of that was rules no element matched. On a document whose own
argument is that its readers are on slow connections, a design-system library
that ships unused is not neutral — so where a technique was worth keeping it was
wired to a real surface, and where it was not it was deleted. **Dead rules that
imply a capability the site does not have are worse than no rules at all.**

No new JavaScript dependency was added. The client bundle is unchanged at 303 KB.

---

## 6. Feature-by-feature

Every bullet in the brief, in its original order, with one row each.

- **Live** — shipping now, with the surface named.
- **Already** — was in the repository before this work.
- **Declined** — considered and not shipped, with the reason.

A declined row is not a gap. Roughly two in five of the brief's techniques
presuppose something this document does not have — a product, a gallery, a video,
a form, a live feed, a drag surface, a geographic map — and the honest answer for
those is to say so rather than to invent a subject for the effect to act on.


### 1. Entrance & Reveal (Page Load / Hero)

| Technique | Status | Where / why |
|---|---|---|
| Fade in | **Live** | Hero header — ClientPage — `Reveal variant="fade"`, hero beats via `.fx-hero-seq` |
| Slide in | **Live** | Every figure/table in all 262 sections — selector-driven scroll reveal; `Reveal` up/down/left/right/diagonal |
| Scale up / pop in | **Live** | Metric cards — Dashboard — `Reveal variant="pop"`, 2.8% overshoot |
| Scale down / settle in | **Live** | Portrait / SectionPortrait — `Reveal variant="settle"`, distinct from pop so both can be used |
| Blur-to-sharp | **Live** | `Reveal variant="blur"` — 12px to sharp |
| Clip-path wipe | **Live** | All 262 headings — SectionHeading — every h2 wipes open from the left |
| Mask reveal | **Live** | Hero title — per-line overflow mask in `SplitText by="line"` |
| Curtain / shutter open | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. A curtain over the hero on every visit is the same cost as a preloader. |
| Iris open | **Live** | `Reveal variant="iris"` — circular aperture |
| Flip in on an axis | **Live** | `Reveal variant="flip-x" / "flip-y"` |
| Rotate in | **Live** | `Reveal variant="rotate"` |
| Unfold / origami expand | **Live** | `Reveal variant="unfold"` — rotateX from the top edge |
| Stagger cascade across siblings | **Live** | Metric cards — Dashboard and quick-jump chips — `Stagger`, index as `--fx-i` |
| Ripple stagger from a focal point | **Live** | `Stagger ripple={n}` — delay by distance from a focal child |
| Text reveal by line, word, or character | **Live** | `SplitText by="line"|"word"|"char"` — hero title; one unsplit accessible string kept |
| Typewriter effect | **Live** | `Typewriter` — CSS steps() width, full string in the DOM throughout |
| SVG path draw | Already | `drawPath` in lib/motion.ts, used by the existing chart components |
| Stroke-to-fill | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. No outlined mark in this document needs a second state. |
| Number count-up | **Live** | Metric cards — Dashboard — `CountUp`/`CountUpText`; final value exposed to AT from frame one |
| Skeleton resolving into real content | **Live** | SectionSkeleton / loading states — sweep replaces a whole-card pulse |
| Progressive image load | Already | next/image with `loading="lazy"` and a blur placeholder, plus LazyMount |
| Blur-In Animation | **Live** | `Reveal variant="blur"` — 12px to sharp |
| Ken Burns Effect | **Live** | Portrait / SectionPortrait — 22s, the only looping transform above the fold |
| Particle overlay | **Live** | `AmbientField motes={n}` — deterministic positions, no canvas, no rAF |
| High-resolution imagery | Already | next/image renditions with `sizes`; 89 lucide icons already in use |
| Split-screen hero animation | **Live** | Hero header — ClientPage — verdict enters from the left, illustration from the right |
| Fade-in sequence | **Live** | Hero header — ClientPage — `Reveal variant="fade"`, hero beats via `.fx-hero-seq` |
| Scale-up animation | **Live** | Metric cards — Dashboard — `Reveal variant="pop"`, 2.8% overshoot |
| Curtain reveal | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. A curtain over the hero on every visit is the same cost as a preloader. |
| Liquid / morphing background | **Live** | AmbientField — hero — three blurred wells on independent cycles (`.fx-aurora`); a fluid solver would be declined on cost: a continuous canvas/raf loop for a decorative result, on the device this is read on. |
| Parallax hero | **Live** | AmbientField — hero — the three wells parallax at 0.6/1.0/1.5, composited onto their own drift with `animation-composition: add` |
| Video background with overlay | Declined | Declined: no video. The proposal ships no video asset, and adding one to a link-only confidential document is a bandwidth cost with no argument behind it. |
| SVG line drawing animation | Already | `drawPath` in lib/motion.ts, used by the existing chart components |
| Glitch effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A digital-artefact aesthetic is off-message for a document about trust in figures. |
| Spotlight effect | **Live** | `SpotlightCard` — nomination verdict, metric cards, sidebar |
| Text bounce on load | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A bouncing headline undercuts the register of the document. |
| Logo animation | **Live** | Hero header — ClientPage — the Wiper umbrella floats on a 4.2s cycle |
| 3D text effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Extruded and outlined type fights the serif display face this document already has. |
| Lottie / Bodymovin animation | Declined | Declined on cost: the Lottie runtime plus JSON is bundle weight for animations CSS keyframes already produce here. |
| View Transitions API | **Live** | `@view-transition` in visual-fx.css, behind `prefers-reduced-motion: no-preference` |
| Animated preloader | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. |

### 2. Exit & Dismissal

| Technique | Status | Where / why |
|---|---|---|
| Fade out | **Live** | AnimatePresence on the section switch, the capsule panel and the index sheet |
| Slide out | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Scale and fade collapse | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Wipe out | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Shrink to origin point | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Fly to target | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. There is no cart and no destination to fly to. |
| Disintegrate / particle dissolve | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. |
| Reverse stagger | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Modal exit animations | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Drawer / sheet exit | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Toast / snackbar exit | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Roll out | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Light speed out | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Bounce out | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |
| Flip out | Declined | Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls. |

### 3. Scroll-Driven & Scroll-Triggered

| Technique | Status | Where / why |
|---|---|---|
| Viewport-triggered reveal (fires once) | **Live** | Every figure/table in all 262 sections — selector-driven scroll reveal; `useInView` once by default |
| Viewport-triggered re-fire on re-entry | Declined | Available (`Reveal repeat`, `CountUp repeat`) but not used: a counter that resets on every pass reads as a glitch on the fourth, in a document read by scrolling back. |
| Scroll-scrubbed animation | **Live** | ScrollProgressBar — `animation-timeline: scroll(root)`, JS only as fallback |
| Scroll progress bar or rail | **Live** | ScrollProgressBar — `animation-timeline: scroll(root)`, JS only as fallback |
| Parallax layers at differing depths | **Live** | AmbientField — hero — the three wells parallax at 0.6/1.0/1.5, composited onto their own drift with `animation-composition: add` |
| Sticky pinned section | **Live** | Sticky toolbar, sticky table headers, sticky sidebar |
| Horizontal scroll section | **Live** | Mobile metric rail and chip rows — real overflow rails with scroll-snap, so keyboard and trackpad both work |
| Scroll-snap between panels | **Live** | Tailwind `snap-x`/`snap-center` on the mobile metric rail |
| Image sequence scrub | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Scroll-velocity skew or stretch | **Live** | `useScrollShell` writes `--scroll-skew`, clamped at ±3deg; past that it reads as a rendering fault |
| Scroll-direction-aware header | **Live** | Toolbar — retreats on the way down, returns on the way up, and never while it holds focus |
| Scroll-linked colour or theme shift | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Colour carries claim-status and phase meaning here; moving it with scroll would break both. |
| Section-to-section crossfade | **Live** | AnimatePresence between sections in ClientPage |
| Scroll-triggered count-up | **Live** | Metric cards — Dashboard — `CountUp`/`CountUpText`; final value exposed to AT from frame one |
| Text highlighted line-by-line as you pass | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. |
| Scroll-linked 3D camera move | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| Infinite scroll append animation | Declined | Declined: no infinite scroll. The document is finite and indexed; appending would break the table of contents. |
| Slide-up & fade-in (scroll reveal) | **Live** | Every figure/table in all 262 sections — selector-driven scroll reveal; `Reveal` up/down/left/right/diagonal |
| Staggered animations | **Live** | Metric cards — Dashboard and quick-jump chips — `Stagger`, index as `--fx-i` |
| Navigation dots (NavDots) | **Live** | `NavDots` — IntersectionObserver over the real section elements, xl and up |
| Back-to-top button | **Live** | QuickNavCapsule — revealed via `.fx-backtotop` rather than mounted on threshold, so the row beside it does not shift |
| Header transparency effect | **Live** | Toolbar — retreats on the way down, returns on the way up, and never while it holds focus |
| Horizontal scroll sections | **Live** | Mobile metric rail and chip rows — real overflow rails with scroll-snap, so keyboard and trackpad both work |
| Sticky elements | **Live** | Sticky toolbar, sticky table headers, sticky sidebar |
| Zoom-in on scroll | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Figures already reveal on scroll; scaling them as well would make a 40-row ward table move twice on the way in. |
| Rotation on scroll | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Nothing in this document has a rotation that would mean anything. |
| Color shift on scroll | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Colour carries claim-status and phase meaning here; moving it with scroll would break both. |
| Scroll-triggered counter reset | Declined | Available (`Reveal repeat`, `CountUp repeat`) but not used: a counter that resets on every pass reads as a glitch on the fourth, in a document read by scrolling back. |
| Pin & unpin animations | **Live** | Sticky toolbar, sticky table headers, sticky sidebar |
| Scroll velocity detection | **Live** | `useScrollShell` writes `--scroll-skew`, clamped at ±3deg; past that it reads as a rendering fault |
| Slide-in from sides | **Live** | Every figure/table in all 262 sections — selector-driven scroll reveal; `Reveal` up/down/left/right/diagonal |
| Blur-out on scroll | Declined | Declined on reading grounds: blurring text as it leaves the viewport fights the reader who is scrolling back to re-read it, which is how a 55,000-word document is actually read. |
| Clip-path reveals | **Live** | All 262 headings — SectionHeading — every h2 wipes open from the left |
| Scroll-linked video playback | Declined | Declined: no video. The proposal ships no video asset, and adding one to a link-only confidential document is a bandwidth cost with no argument behind it. |
| Opacity fade zones | **Live** | `.fx-mask-fade-x` on the ticker. Not applied to reading matter, for the same reason as blur-out. |
| Content reveal via scroll | **Live** | Hero title — per-line overflow mask in `SplitText by="line"` |

### 4. Continuous & Looping

| Technique | Status | Where / why |
|---|---|---|
| Marquee / ticker | **Live** | MarqueeCarousel — CSS loop so `animation-play-state` can pause it on hover; class dropped entirely off-screen |
| Carousel autoplay | **Live** | MarqueeCarousel — CSS loop so `animation-play-state` can pause it on hover; class dropped entirely off-screen |
| Logo wall loop | **Live** | MarqueeCarousel — CSS loop so `animation-play-state` can pause it on hover; class dropped entirely off-screen |
| Pulse or breathe | **Live** | Confidentiality marker — 1.8s blink on the live dot |
| Float and drift | **Live** | Wiper umbrella in the hero banner |
| Rotate loop | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Nothing in this document orbits or spins meaningfully. |
| Gradient shift | **Live** | Part dividers and the scroll rail — `.fx-gradient-live` |
| Shimmer sweep | **Live** | SectionSkeleton / loading states, part dividers, and the index button |
| Wave or ripple field | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. |
| Particle field | **Live** | `AmbientField motes={n}` — deterministic positions, no canvas, no rAF |
| Noise or grain animation | **Live** | AmbientField — hero — one inline feTurbulence, no image request |
| Aurora or mesh gradient drift | **Live** | AmbientField — hero; `.fx-mesh` plates on the metric cards |
| Live-status blink | **Live** | Confidentiality marker — 1.8s blink on the live dot |
| Orbiting elements | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Nothing in this document orbits or spins meaningfully. |
| Conveyor or belt motion | **Live** | MarqueeCarousel — CSS loop so `animation-play-state` can pause it on hover; class dropped entirely off-screen |
| Audio-reactive motion | Declined | Declined: no audio. A confidential proposal that makes sound when scrolled is a liability, not a feature. |
| Animated gradient background | **Live** | Part dividers and the scroll rail — `.fx-gradient-live` |
| Liquid / fluid animation | **Live** | AmbientField — hero — three blurred wells on independent cycles (`.fx-aurora`); a fluid solver would be declined on cost: a continuous canvas/raf loop for a decorative result, on the device this is read on. |
| Caustics effect | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. |
| Mesh gradient animations | **Live** | AmbientField — hero; `.fx-mesh` plates on the metric cards |
| Displacement effects | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| WebGL shaders | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| Ray marching effects | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| Post-processing effects | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| Grain / noise loop | **Live** | AmbientField — hero — one inline feTurbulence, no image request |
| Animated CSS pattern | **Live** | Part dividers — creeping diagonal hatch; masked grid behind the hero |
| Weather-like background | **Live** | `AmbientField motes` — available and used only where falling is the subject, never as decoration |

### 5. Interaction-Driven (Hover, Focus, Cursor)

| Technique | Status | Where / why |
|---|---|---|
| Hover lift | **Live** | `.fx-lift` — cards, chips, figures, blockquotes |
| Hover tint / colour shift | **Live** | All 262 sections — .prose rules in visual-fx.css — table rows, links, badges |
| Hover scale | **Live** | Cartogram tiles, icons (`.fx-icon-rise`) |
| Underline draw or grow | **Live** | All 262 sections — .prose rules in visual-fx.css — every link draws its underline from 0% to 100% |
| Border draw on hover | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. The site already marks hover with lift, tint and glow; a fourth border treatment is redundant. |
| Icon swap or shift on hover | **Live** | `.fx-icon-nudge` — index rows in the mobile sheet |
| Image zoom within a frame | **Live** | Every image in all 262 sections — the frame lifts, the picture scales inside it |
| Reveal-on-hover overlay | **Live** | Image alt text rises over the figure on hover/focus |
| Press / active scale-down | **Live** | `.fx-press` — every button in the toolbar, dock, capsule and index |
| Focus ring animation | **Live** | `.fx-focus` — branded, and it still animates under reduced motion |
| Magnetic attraction to cursor | **Live** | `MagneticButton` — the Print control; window-level listener, so it pulls before the pointer arrives |
| Cursor-follow element or custom cursor | **Live** | `CustomCursor` — dot plus a lagging ring that is the trail; fine pointers only, never under reduced motion |
| Pointer tilt with 3D perspective | **Live** | `TiltCard` — metric cards and the hero illustration; writes two custom properties, never renders |
| Spotlight or glow tracking the pointer | **Live** | `SpotlightCard` — nomination verdict, metric cards, sidebar |
| Ripple from click point | **Live** | `RippleButton` and the per-heading copy-link control |
| Long-press progress fill | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. No action here is destructive enough to need confirming by holding. |
| Hold-to-confirm | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. No action here is destructive enough to need confirming by holding. |
| 3D tilt effect | **Live** | `TiltCard` — metric cards and the hero illustration; writes two custom properties, never renders |
| Border glow effect | **Live** | `SpotlightCard border` — mask-composite edge that tracks the pointer |
| Button & icon scaling | **Live** | Cartogram tiles, icons (`.fx-icon-rise`) |
| Icon float effect | **Live** | Wiper umbrella in the hero banner |
| Pulse effect | **Live** | Confidentiality marker — 1.8s blink on the live dot |
| Input field glow | **Live** | Native form controls, site-wide — focus glow on every text, search and number field |
| Copy-to-clipboard glow | **Live** | All 262 headings — SectionHeading — the tick draws itself and the button pops; 400ms, no toast needed |
| Custom cursor | **Live** | `CustomCursor` — dot plus a lagging ring that is the trail; fine pointers only, never under reduced motion |
| Cursor trail effect | **Live** | `CustomCursor` — dot plus a lagging ring that is the trail; fine pointers only, never under reduced motion |
| Magnetic buttons | **Live** | `MagneticButton` — the Print control; window-level listener, so it pulls before the pointer arrives |
| Ripple effect on click | **Live** | `RippleButton` and the per-heading copy-link control |
| Hover underline animation | **Live** | All 262 sections — .prose rules in visual-fx.css — every link draws its underline from 0% to 100% |
| Card lift effect | **Live** | `.fx-lift` — cards, chips, figures, blockquotes |
| Image zoom on hover | **Live** | Every image in all 262 sections — the frame lifts, the picture scales inside it |
| Color transition on hover | **Live** | All 262 sections — .prose rules in visual-fx.css — table rows, links, badges |
| Border animation | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. The site already marks hover with lift, tint and glow; a fourth border treatment is redundant. |
| Background slide | **Live** | Quick-jump chips — `.fx-bg-slide` from the left |
| Icon rotation on hover | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. |
| Text reveal on hover | **Live** | Image alt text rises over the figure on hover/focus |
| Gradient shift on hover | **Live** | Part dividers and the scroll rail — `.fx-gradient-live` |
| Shine / sweep effect | **Live** | SectionSkeleton / loading states, part dividers, and the index button |
| Neon glow effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Extruded and outlined type fights the serif display face this document already has. |
| Morphing shapes | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Parallax on hover | **Live** | `.fx-z-1` inside `TiltCard` — the figure sits proud, so tilt reads as depth |
| Focus outline animation | **Live** | `.fx-focus` — branded, and it still animates under reduced motion |
| Tooltip animations | Already | Existing chart and badge tooltips |
| Link arrow animation | **Live** | `.fx-icon-nudge` — index rows in the mobile sheet |
| State-change animations | **Live** | Copy-link idle/copied; toolbar toggles; fold open/closed |
| Hover-activated 3D object rotation | **Live** | `TiltCard` — metric cards and the hero illustration; writes two custom properties, never renders |

### 6. Gesture & Drag

| Technique | Status | Where / why |
|---|---|---|
| Drag to reorder | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Drag to dismiss | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Swipe between panels | **Live** | Mobile metric rail — scroll-snap, which is the platform's own swipe |
| Pull-to-refresh | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Pinch to zoom | Already | `maximumScale: 5` in the viewport, deliberately not locked to 1 |
| Slider or range handle | **Live** | Native form controls, site-wide — thumbs scale and glow on hover, focus and drag |
| Split-view divider drag | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Before/after comparison slider | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Rubber-band overscroll | **Live** | `.fx-rubber` on the mobile rails |
| Fling with momentum | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Snap-back on release | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Dial or knob rotation | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Draggable elements | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Sortable list animations | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Animated toggles/switches | **Live** | Toolbar toggles — focus/density/zero-chrome, with press feedback |
| Drag-to-delete | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Scrollbar dragging | **Live** | Branded gradient scrollbar site-wide, with `.scrollbar-none` for rails with their own affordance |
| Shake-to-undo | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| 360° product viewer | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |

### 7. Layout & State Transitions

| Technique | Status | Where / why |
|---|---|---|
| Layout animation | **Live** | InteractiveTable — rows cascade on sort and filter, stagger capped at twelve |
| Shared element transition across views | **Live** | `@view-transition` plus AnimatePresence on the section switch |
| Page or route transition | **Live** | `@view-transition` plus AnimatePresence on the section switch |
| FLIP reflow | **Live** | InteractiveTable — rows cascade on sort and filter, stagger capped at twelve |
| Accordion expand and collapse | **Live** | ProseFold / disclosure — grid-template-rows 0fr→1fr, and `inert` while closed |
| Disclosure reveal | **Live** | ProseFold / disclosure — grid-template-rows 0fr→1fr, and `inert` while closed |
| Tab indicator slide | **Live** | Sidebar rail — one marker that slides, driven by the active index |
| Segmented control slide | **Live** | Sidebar rail — one marker that slides, driven by the active index |
| Toggle and switch | **Live** | Toolbar toggles — focus/density/zero-chrome, with press feedback |
| Checkbox and radio state | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Modal or dialog enter/exit | **Live** | Mobile index sheet — backdrop blurs in, panel rises from the edge it sits on |
| Drawer or sheet slide | **Live** | Mobile index sheet — `.fx-sheet-bottom` on phones, `.fx-modal` above sm |
| Bottom sheet with detents | **Live** | Mobile index sheet — `.fx-sheet-bottom` on phones, `.fx-modal` above sm |
| Popover and tooltip enter | **Live** | QuickNavCapsule — `.fx-menu` with a per-row cascade |
| Dropdown and menu open | **Live** | QuickNavCapsule — `.fx-menu` with a per-row cascade |
| Toast or snackbar in/out | Declined | Declined: nothing to announce. The one confirmation the site has — copy-link — resolves in place in 400ms, which is faster than a toast could appear. |
| Banner slide-down | Declined | Declined: the confidentiality marker is permanent, not an announcement to dismiss. |
| Command palette open | Declined | Declined as duplicate: the index modal already searches all 262 sections and is one tap from every screen. |
| List insert, remove, reorder | **Live** | InteractiveTable — rows cascade on sort and filter, stagger capped at twelve |
| Filter and sort reflow | **Live** | InteractiveTable — rows cascade on sort and filter, stagger capped at twelve |
| Crossfade between data states | **Live** | SectionSkeleton / loading states → content |
| Empty-state transition | **Live** | SectionSkeleton / loading states → content |
| Theme switch | Already | Existing `useTheme` with a `.theme-switching` paint guard |
| Expand card to full screen | **Live** | ProseFold / disclosure — grid-template-rows 0fr→1fr, and `inert` while closed |
| 3D card flip | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. No card here has a back worth hiding. |
| Expandable cards | **Live** | ProseFold / disclosure — grid-template-rows 0fr→1fr, and `inert` while closed |
| Animated badges | **Live** | Claim and tier badges lift on hover; the copied tick pops |
| Timeline animations | Already | The 52 bespoke visualisations, animating through lib/motion.ts |
| Animated data visualization | Already | The 52 bespoke visualisations, animating through lib/motion.ts |
| Loading bar transitions | **Live** | ScrollProgressBar |
| Slide-out panels | **Live** | Mobile index sheet — `.fx-sheet-bottom` on phones, `.fx-modal` above sm |
| Animated search expand | Declined | Declined: the index search is already visible in the sheet that contains it; hiding it behind an icon would add a step. |
| Notification bell animation | Declined | Declined: no notifications. This is a document, not an application. |
| Live typing indicator | Declined | Declined: no live data. Every figure here is a sourced static number; a live-updating stream would imply a feed that does not exist. |
| Pagination transitions | Declined | Declined: no pagination. The document is one scroll per part, indexed by the table of contents. |
| Image carousel/slider | **Live** | MarqueeCarousel — CSS loop so `animation-play-state` can pause it on hover; class dropped entirely off-screen |
| Grid layout animations | **Live** | InteractiveTable — rows cascade on sort and filter, stagger capped at twelve |
| Masonry layout | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. The grid this document needs is a reading grid; asymmetric layouts would fight the section numbering. |
| Bento box layout | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. The grid this document needs is a reading grid; asymmetric layouts would fight the section numbering. |
| CSS grid animations | **Live** | InteractiveTable — rows cascade on sort and filter, stagger capped at twelve |
| Aspect ratio containers | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. The grid this document needs is a reading grid; asymmetric layouts would fight the section numbering. |
| Floating elements | **Live** | Wiper umbrella in the hero banner |
| Split layout animations | **Live** | Hero header — ClientPage — verdict enters from the left, illustration from the right |
| Background attachment fixed | **Live** | AmbientField — hero — the three wells parallax at 0.6/1.0/1.5, composited onto their own drift with `animation-composition: add` |
| Card stack effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. The grid this document needs is a reading grid; asymmetric layouts would fight the section numbering. |
| Modal entry/exit | **Live** | Mobile index sheet — backdrop blurs in, panel rises from the edge it sits on |
| Tab switching animations | **Live** | Sidebar rail — one marker that slides, driven by the active index |
| Dropdown animations | **Live** | QuickNavCapsule — `.fx-menu` with a per-row cascade |
| Sidebar slide-in | **Live** | Mobile index sheet — `.fx-sheet-bottom` on phones, `.fx-modal` above sm |
| View Transitions API | **Live** | `@view-transition` in visual-fx.css, behind `prefers-reduced-motion: no-preference` |
| Animated infographics | Already | The 52 bespoke visualisations, animating through lib/motion.ts |

### 8. Data & Chart Visualizations

| Technique | Status | Where / why |
|---|---|---|
| Bars growing from baseline | **Live** | Sidebar target bar and the existing charts — `growFromBaseline`; true proportion under reduced motion |
| Line draw | Already | `drawPath` in the existing chart components |
| Area fill sweep | Already | `drawPath` in the existing chart components |
| Radial or pie sweep | **Live** | `ProgressRing` — dash offset resolves to the true value under reduced motion, never to zero |
| Donut segment reveal | **Live** | `ProgressRing` — dash offset resolves to the true value under reduced motion, never to zero |
| Progress ring fill | **Live** | `ProgressRing` — dash offset resolves to the true value under reduced motion, never to zero |
| Linear progress fill | **Live** | Sidebar target bar and the existing charts — `growFromBaseline`; true proportion under reduced motion |
| Gauge needle sweep | **Live** | `ProgressRing gauge` — 270° arc |
| Value morph between numbers | **Live** | `CountUp` — eased, with the final value set from the source rather than from the interpolation |
| Odometer digit roll | **Live** | `Odometer` — per-digit wheels; only changed digits move |
| Point-by-point scatter drop-in | **Live** | `.fx-point`, `.fx-cell`, `.fx-datapoint` — the cartogram uses the fill; the others are available to the chart layer |
| Axis and gridline fade-in | Already | Recharts fades axes in with the chart body in the existing visualisations |
| Tooltip follow along a series | Already | Recharts interaction in the existing charts |
| Brush and zoom on a range | Already | Recharts interaction in the existing charts |
| Live-updating stream | Declined | Declined: no live data. Every figure here is a sourced static number; a live-updating stream would imply a feed that does not exist. |
| Heatmap cell fill | **Live** | `.fx-point`, `.fx-cell`, `.fx-datapoint` — the cartogram uses the fill; the others are available to the chart layer |
| Sankey or flow trace | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Node-graph physics settle | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Sparkline draw | Already | `drawPath` in lib/motion.ts, used by the existing chart components |
| Animated progress bars | **Live** | Sidebar target bar and the existing charts — `growFromBaseline`; true proportion under reduced motion |
| Circular progress indicators | **Live** | `ProgressRing` — dash offset resolves to the true value under reduced motion, never to zero |
| Animated counter | **Live** | Metric cards — Dashboard — `CountUp`/`CountUpText`; final value exposed to AT from frame one |
| Value morph | **Live** | `CountUp` — eased, with the final value set from the source rather than from the interpolation |
| Gauge animation | **Live** | `ProgressRing gauge` — 270° arc |
| Data highlighting | **Live** | `.fx-point`, `.fx-cell`, `.fx-datapoint` — the cartogram uses the fill; the others are available to the chart layer |

### 9. Map & Geography

| Technique | Status | Where / why |
|---|---|---|
| Progressive region fill | **Live** | Ward cartogram — 40 tiles — tiles fill in ward order; all 40 present at true colour under reduced motion |
| Pin drop with bounce | Declined | Declined: no geographic map. No ward-boundary geometry exists in this repository; the cartogram is a tile grid, and §9 techniques are applied to it in that form. |
| Route path trace | Declined | Declined: no geographic map. No ward-boundary geometry exists in this repository; the cartogram is a tile grid, and §9 techniques are applied to it in that form. |
| Zoom to region | Declined | Declined: no geographic map. No ward-boundary geometry exists in this repository; the cartogram is a tile grid, and §9 techniques are applied to it in that form. |
| Cluster expand and collapse | Declined | Declined: no geographic map. No ward-boundary geometry exists in this repository; the cartogram is a tile grid, and §9 techniques are applied to it in that form. |
| Choropleth value transition | **Live** | Ward cartogram — 40 tiles — tiles fill in ward order; all 40 present at true colour under reduced motion |
| Radius or catchment pulse | Declined | Declined: no geographic map. No ward-boundary geometry exists in this repository; the cartogram is a tile grid, and §9 techniques are applied to it in that form. |
| Flight-line arc animation | Declined | Declined: no geographic map. No ward-boundary geometry exists in this repository; the cartogram is a tile grid, and §9 techniques are applied to it in that form. |
| 3D map tilt | Declined | Declined: no geographic map. No ward-boundary geometry exists in this repository; the cartogram is a tile grid, and §9 techniques are applied to it in that form. |
| Heatmap animation | **Live** | `.fx-point`, `.fx-cell`, `.fx-datapoint` — the cartogram uses the fill; the others are available to the chart layer |

### 10. Feedback & Attention

| Technique | Status | Where / why |
|---|---|---|
| Shake on error | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Bounce | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Wobble or jiggle | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Highlight flash | Already | `:target` flash on arriving at a deep link — 2.2s, already in globals.css |
| Glow pulse | **Live** | Live status dot in the confidentiality marker |
| Checkmark draw on success | **Live** | Copy-link confirmation — the tick draws, it does not appear |
| Cross draw on failure | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Badge count pop | **Live** | Claim and tier badges lift on hover; the copied tick pops |
| Confetti or celebration burst | Declined | Declined on register: nothing in a confidential campaign proposal warrants confetti. |
| Attention nudge on an idle element | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Field validation shift | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Character-count warning | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Toast notifications | Declined | Declined: nothing to announce. The one confirmation the site has — copy-link — resolves in place in 400ms, which is faster than a toast could appear. |
| Success animation | **Live** | Copy-link confirmation — the tick draws, it does not appear |
| Error shake | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Flash effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Tada animation | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Heartbeat animation | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Jello effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Rubber band effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Swing animation | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Wobble effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |
| Attention seekers | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A proposal that jiggles to get attention is a proposal that has lost the argument. |

### 11. Loading & Progress

| Technique | Status | Where / why |
|---|---|---|
| Spinner | Declined | Declined: nothing here waits on a network. The page is statically generated and every section is present at build time; the only wait is component mount, which the skeleton covers. |
| Indeterminate progress bar | Declined | Declined: nothing here waits on a network. The page is statically generated and every section is present at build time; the only wait is component mount, which the skeleton covers. |
| Determinate progress bar | Declined | Declined: nothing here waits on a network. The page is statically generated and every section is present at build time; the only wait is component mount, which the skeleton covers. |
| Skeleton pulse | **Live** | SectionSkeleton / loading states — sweep replaces a whole-card pulse |
| Skeleton shimmer | **Live** | SectionSkeleton / loading states — sweep replaces a whole-card pulse |
| Step-by-step progress indicator | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Percentage counter | Declined | Declined: nothing here waits on a network. The page is statically generated and every section is present at build time; the only wait is component mount, which the skeleton covers. |
| Page-load orchestration sequence | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. |
| Splash or intro animation | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. |
| Optimistic UI placeholder | Declined | Declined: nothing here waits on a network. The page is statically generated and every section is present at build time; the only wait is component mount, which the skeleton covers. |
| Loading skeletons | **Live** | SectionSkeleton / loading states — sweep replaces a whole-card pulse |
| Skeleton screen shimmer | **Live** | SectionSkeleton / loading states — sweep replaces a whole-card pulse |
| Loading spinner variations | Declined | Declined: nothing here waits on a network. The page is statically generated and every section is present at build time; the only wait is component mount, which the skeleton covers. |
| Progress ring animation | **Live** | `ProgressRing` — dash offset resolves to the true value under reduced motion, never to zero |
| Step progress indicator | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Branded loading sequence | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. |
| Favicon animations | Declined | Declined: a moving favicon on a confidential link-only document draws attention to a tab that should not draw attention. |
| Animated preloader | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. |
| Toast with progress bar | Declined | Declined: nothing to announce. The one confirmation the site has — copy-link — resolves in place in 400ms, which is faster than a toast could appear. |

### 12. Typographic Effects

| Technique | Status | Where / why |
|---|---|---|
| Kinetic typography | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. |
| Variable font weight or width animation | **Live** | Montserrat is loaded as its variable axis, so weight is a real interpolation rather than synthesised bold |
| Variable optical size shift | **Live** | Montserrat is loaded as its variable axis, so weight is a real interpolation rather than synthesised bold |
| Letter-spacing on entry | **Live** | `.fx-tracking-in` — the one place a non-transform property animates, on a single short heading |
| Text scramble or decode | **Live** | `Scramble` — short labels only; never a figure, per for most of its run the effect displays a figure that is not the figure. Appendix A forbids exactly this. |
| Cycling word swap | **Live** | Hero header — ClientPage — `WordCycler`, its word list read from the section index so it cannot drift |
| Line-by-line mask reveal | **Live** | `SplitText by="line"|"word"|"char"` — hero title; one unsplit accessible string kept |
| Character stagger | **Live** | `SplitText by="line"|"word"|"char"` — hero title; one unsplit accessible string kept |
| Text along a path | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. |
| Marker-style underline draw | **Live** | All 262 headings — SectionHeading — `.fx-marker` sweep on h2 |
| Highlight sweep behind text | **Live** | All 262 headings — SectionHeading — `.fx-marker` sweep on h2 |
| Split-flap or flip-board | **Live** | `Odometer` — per-digit wheels; only changed digits move |
| Vertical digit roll | **Live** | `Odometer` — per-digit wheels; only changed digits move |
| Outline-to-fill text | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. No outlined mark in this document needs a second state. |
| Custom font pairing | Already | Montserrat display and body, set from one variable font file |
| Gradient text | **Live** | Hero header — ClientPage — the title is ink-to-accent-to-gold |
| Text shadow | Already | The Wiper mark carries `drop-shadow-sm`; body type deliberately carries none, because a shadow under 17px prose costs contrast and buys nothing. |
| Text stroke effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Extruded and outlined type fights the serif display face this document already has. |
| Text clipping with background | **Live** | Hero header — ClientPage — the title is ink-to-accent-to-gold |
| Animated text underline | **Live** | All 262 sections — .prose rules in visual-fx.css — every link draws its underline from 0% to 100% |
| Letter spacing animation | **Live** | `.fx-tracking-in` — the one place a non-transform property animates, on a single short heading |
| Split text animation | **Live** | `SplitText by="line"|"word"|"char"` — hero title; one unsplit accessible string kept |
| Text scramble effect | **Live** | `Scramble` — short labels only; never a figure, per for most of its run the effect displays a figure that is not the figure. Appendix A forbids exactly this. |
| Highlighted text effect | **Live** | All 262 headings — SectionHeading — `.fx-marker` sweep on h2 |
| Responsive text sizing | Already | The fluid clamp() scale plus the reading-density control |
| Drop cap styling | **Live** | All 262 sections — .prose rules in visual-fx.css — `.prose h2 + p::first-letter`, a raised initial on each sub-section's lead paragraph, at reading widths only |
| Text reveal via masks | **Live** | Hero title — per-line overflow mask in `SplitText by="line"` |
| Neon text effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Extruded and outlined type fights the serif display face this document already has. |
| 3D text effect | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Extruded and outlined type fights the serif display face this document already has. |
| Text bounce on load | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. A bouncing headline undercuts the register of the document. |
| Variable font animations | **Live** | Montserrat is loaded as its variable axis, so weight is a real interpolation rather than synthesised bold |
| Typewriter effect | **Live** | `Typewriter` — CSS steps() width, full string in the DOM throughout |
| Text scramble | **Live** | `Scramble` — short labels only; never a figure, per for most of its run the effect displays a figure that is not the figure. Appendix A forbids exactly this. |
| Split-flap / flip-board | **Live** | `Odometer` — per-digit wheels; only changed digits move |

### 13. Media (Images & Video)

| Technique | Status | Where / why |
|---|---|---|
| Ken Burns pan and zoom | **Live** | Portrait / SectionPortrait — 22s, the only looping transform above the fold |
| Image mask reveal | **Live** | `.fx-mask-fade-x` on the ticker; masked grid behind the hero |
| Image crossfade | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| Video autoplay on viewport entry | Declined | Declined: no video. The proposal ships no video asset, and adding one to a link-only confidential document is a bandwidth cost with no argument behind it. |
| Video scrub tied to scroll | Declined | Declined: no video. The proposal ships no video asset, and adding one to a link-only confidential document is a bandwidth cost with no argument behind it. |
| Lightbox open and close | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| Gallery transition | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| Focus rack | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| Duotone or colour-grade transition | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| Clip-path shape reveal | **Live** | `.fx-mask-fade-x` on the ticker; masked grid behind the hero |
| Image lazy loading | Already | next/image with `loading="lazy"` and a blur placeholder, plus LazyMount |
| Image comparison slider | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Image hover overlay | **Live** | Image alt text rises over the figure on hover/focus |
| Duotone image effect | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| Image border animations | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| Polaroid/photo frame effects | **Live** | `SectionPortrait` — a physical frame with a slight rotation that straightens on hover |
| Lightbox | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| Video autoplay on view | Declined | Declined: no video. The proposal ships no video asset, and adding one to a link-only confidential document is a bandwidth cost with no argument behind it. |
| Video scrub | Declined | Declined: no video. The proposal ships no video asset, and adding one to a link-only confidential document is a bandwidth cost with no argument behind it. |
| Gradient mesh backgrounds | **Live** | AmbientField — hero; `.fx-mesh` plates on the metric cards |
| Noise texture overlay | **Live** | AmbientField — hero — one inline feTurbulence, no image request |
| Neumorphism | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Soft-UI shadows lose the contrast this document's badges depend on. |
| Glassmorphism | **Live** | Glass chrome — toolbar, capsule, mobile dock, index sheet |
| Masked image gradients | **Live** | `.fx-mask-fade-x` on the ticker; masked grid behind the hero |
| Gradient dividers | **Live** | All 262 sections — .prose rules in visual-fx.css — every rule, plus the toolbar and footer edges |
| High-resolution logos & platform icons | Already | next/image renditions with `sizes`; 89 lucide icons already in use |
| Animated CSS pattern | **Live** | Part dividers — creeping diagonal hatch; masked grid behind the hero |
| Weather-like background | **Live** | `AmbientField motes` — available and used only where falling is the subject, never as decoration |

### 14. Spatial & 3D

| Technique | Status | Where / why |
|---|---|---|
| Card flip | **Live** | `TiltCard` and the existing `.depth-card` stage |
| Perspective tilt | **Live** | `TiltCard` and the existing `.depth-card` stage |
| Depth layering with z-offsets | **Live** | AmbientField — hero — the three wells parallax at 0.6/1.0/1.5, composited onto their own drift with `animation-composition: add` |
| Axis rotation | **Live** | `TiltCard` and the existing `.depth-card` stage |
| Cube or carousel rotation in 3D | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Camera dolly or orbit | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Model or object rotation | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| SVG shape morph | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. |
| Path morphing between icons | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. |
| Blob or metaball morph | **Live** | AmbientField — hero — three blurred wells on independent cycles (`.fx-aurora`); a fluid solver would be declined on cost: a continuous canvas/raf loop for a decorative result, on the device this is read on. |
| Extrusion and depth reveal | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Fold and unfold | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Three.js 3D scenes | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| 3D card hover effects | **Live** | `TiltCard` — metric cards and the hero illustration; writes two custom properties, never renders |
| Depth of field blur | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. The document has three portraits, no gallery. |
| 3D text extrusion | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. Extruded and outlined type fights the serif display face this document already has. |
| Particle systems (3D) | **Live** | `AmbientField motes={n}` — deterministic positions, no canvas, no rAF |
| 3D model viewers | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Liquid/fluid simulations | **Live** | AmbientField — hero — three blurred wells on independent cycles (`.fx-aurora`); a fluid solver would be declined on cost: a continuous canvas/raf loop for a decorative result, on the device this is read on. |
| Caustics effects | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. |
| Mesh gradient animations | **Live** | AmbientField — hero; `.fx-mesh` plates on the metric cards |
| Ray marching effects | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| Post-processing effects | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| Displacement effects | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| WebGL shaders | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| Cube/carousel rotation | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| Fold & unfold | Declined | Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on. |
| 360° product viewer | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |

### 15. Navigation

| Technique | Status | Where / why |
|---|---|---|
| Menu open and close | **Live** | QuickNavCapsule — panel plus a per-row cascade |
| Full-screen overlay nav | Declined | Declined as duplicate: the index sheet and the bottom dock already reach every section, on every breakpoint. |
| Hamburger-to-close icon morph | Declined | Declined as duplicate: the index sheet and the bottom dock already reach every section, on every breakpoint. |
| Nav item stagger on open | **Live** | QuickNavCapsule — panel plus a per-row cascade |
| Active-link indicator slide | **Live** | Sidebar rail — one marker that slides, driven by the active index |
| Breadcrumb transition | Already | `SectionStickyBar` carries the running position |
| Sticky header state change | **Live** | Toolbar — retreats on the way down, returns on the way up, and never while it holds focus |
| Back-to-top reveal | **Live** | QuickNavCapsule — revealed via `.fx-backtotop` rather than mounted on threshold, so the row beside it does not shift |
| Tab bar switch | **Live** | Sidebar rail — one marker that slides, driven by the active index |
| Scroll-spy indicator | **Live** | `NavDots` — IntersectionObserver over the real section elements, xl and up |
| Navigation dots (NavDots) | **Live** | `NavDots` — IntersectionObserver over the real section elements, xl and up |
| Animated search expand | Declined | Declined: the index search is already visible in the sheet that contains it; hiding it behind an icon would add a step. |
| Notification bell animation | Declined | Declined: no notifications. This is a document, not an application. |
| Sidebar slide-in | **Live** | Mobile index sheet — `.fx-sheet-bottom` on phones, `.fx-modal` above sm |
| Dropdown animations | **Live** | QuickNavCapsule — `.fx-menu` with a per-row cascade |
| Mega menu animation | **Live** | QuickNavCapsule — `.fx-menu` with a per-row cascade |
| Off-canvas menu | **Live** | Mobile index sheet — `.fx-sheet-bottom` on phones, `.fx-modal` above sm |
| Dynamic island / notch animations | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. |

### 16. Form Interactions

| Technique | Status | Where / why |
|---|---|---|
| Floating label | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Input focus expand | Declined | Declined: a field that changes width on focus shifts the controls beside it under the reader's hand. The focus glow carries the same signal without moving anything. |
| Inline validation | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Error message slide-in | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Password strength meter | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Multi-step form transition | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Autocomplete list reveal | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Submit button to loading to success morph | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Field clearing | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| File upload progress and drop-zone state | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Floating input labels | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Input field glow | **Live** | Native form controls, site-wide — focus glow on every text, search and number field |
| Error shake | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Animated submit button | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| File upload progress | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Autocomplete reveal | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Character count warning | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Toggle switch animation | **Live** | Toolbar toggles — focus/density/zero-chrome, with press feedback |
| Checkbox/radio custom animation | Declined | Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument. |
| Slider handle animation | **Live** | Native form controls, site-wide — thumbs scale and glow on hover, focus and drag |
| Range fill animation | **Live** | Native form controls, site-wide — thumbs scale and glow on hover, focus and drag |
| Shake-to-undo | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |

### 17. Physics & Procedural

| Technique | Status | Where / why |
|---|---|---|
| Spring settle | **Live** | `SPRING` / `SPRING_SOFT` in lib/motion.ts, and the spring easing on press and pop |
| Damped oscillation | **Live** | `SPRING` / `SPRING_SOFT` in lib/motion.ts, and the spring easing on press and pop |
| Gravity drop | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. The perceptual result these produce is available as keyframes; the simulations are not worth the frame budget. |
| Collision and bounce | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. The perceptual result these produce is available as keyframes; the simulations are not worth the frame budget. |
| Inertia and momentum decay | **Live** | `SPRING` / `SPRING_SOFT` in lib/motion.ts, and the spring easing on press and pop |
| Elastic overshoot | **Live** | `SPRING` / `SPRING_SOFT` in lib/motion.ts, and the spring easing on press and pop |
| Chain or follow-the-leader lag | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. The perceptual result these produce is available as keyframes; the simulations are not worth the frame budget. |
| Soft-body or jelly deformation | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. The perceptual result these produce is available as keyframes; the simulations are not worth the frame budget. |
| Cloth or ribbon simulation | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. The perceptual result these produce is available as keyframes; the simulations are not worth the frame budget. |
| Flocking or swarm behaviour | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. The perceptual result these produce is available as keyframes; the simulations are not worth the frame budget. |
| Generative canvas or shader motion | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |
| Liquid/fluid simulations | **Live** | AmbientField — hero — three blurred wells on independent cycles (`.fx-aurora`); a fluid solver would be declined on cost: a continuous canvas/raf loop for a decorative result, on the device this is read on. |
| Particle field | **Live** | `AmbientField motes={n}` — deterministic positions, no canvas, no rAF |
| Wave or ripple field | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. |
| Noise or grain animation | **Live** | AmbientField — hero — one inline feTurbulence, no image request |
| Aurora or mesh gradient drift | **Live** | AmbientField — hero; `.fx-mesh` plates on the metric cards |
| Generative shader motion | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |

### 18. Orchestration Patterns

| Technique | Status | Where / why |
|---|---|---|
| Sequential chain | **Live** | `Stagger` and `.fx-hero-seq` — index-driven, so a whole group is retimed from one property |
| Parallel group | **Live** | `Reveal` siblings sharing a delay |
| Staggered timing | **Live** | `Stagger` and `.fx-hero-seq` — index-driven, so a whole group is retimed from one property |
| Delayed cascade | **Live** | `Stagger` and `.fx-hero-seq` — index-driven, so a whole group is retimed from one property |
| Timeline with keyframes | **Live** | Hero header — ClientPage — six elements on a single `--fx-beat` |
| State machine driven | Already | The existing tab, focus, density and zero-chrome state in ClientPage |
| Choreographed hero sequence | **Live** | Hero header — ClientPage — six elements on a single `--fx-beat` |
| Interruptible and reversible transitions | **Live** | Pointer effects are transitions, not animations, so a reversal mid-gesture picks up where it is |
| Loop with pause on hover | **Live** | `.fx-pause-on-hover` — the reason the ticker can carry real content |
| Reduced-motion fallback path | **Live** | A dedicated block in visual-fx.css plus `useReducedMotion`: loops stop, entrances resolve, charts render at the truth, interaction feedback survives shortened |
| Page-load orchestration sequence | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. |
| Interruptible transitions | **Live** | Pointer effects are transitions, not animations, so a reversal mid-gesture picks up where it is |
| Reduced-motion fallback | **Live** | A dedicated block in visual-fx.css plus `useReducedMotion`: loops stop, entrances resolve, charts render at the truth, interaction feedback survives shortened |

### 19. Accessibility & Performance (Enabling Features)

| Technique | Status | Where / why |
|---|---|---|
| Prefers-reduced-motion support | **Live** | A dedicated block in visual-fx.css plus `useReducedMotion`: loops stop, entrances resolve, charts render at the truth, interaction feedback survives shortened |
| Intersection Observer API | **Live** | `useInView`, `NavDots`, `LazySection`, `LazyMount` |
| Progressive enhancement | **Live** | Every scroll-driven rule sits inside `@supports`; unsupported means visible, never hidden |
| Hardware acceleration | **Live** | translate3d and `will-change` applied narrowly, only where an element is actively animating |
| Request animation frame | **Live** | `useScrollShell`, `CountUp` and the cursor chase, each coalesced into a single rAF |
| Debounced scroll handlers | **Live** | One rAF-coalesced page-level scroll listener replaces three per-component handlers |
| Web Animations API | Declined | Declined as unnecessary: these animations are declarative, so CSS keyframes and `motion` cover them without a third imperative API. |
| CSS containment | **Live** | `contain: strict` on the ambient field; existing `content-visibility` on sections |
| Lazy loading everything | Already | LazyMount, LazySection and next/image |
| Font loading strategies | Already | next/font self-hosting with `display: swap` and `adjustFontFallback` |
| Critical CSS | Already | Next inlines it |
| Image optimization | Already | next/image AVIF/WebP |
| Custom scrollbar styling | **Live** | Branded gradient scrollbar site-wide, with `.scrollbar-none` for rails with their own affordance |
| Theme persistence | Already | `useTheme` |

### 20. Brand & Theme Elements

| Technique | Status | Where / why |
|---|---|---|
| Dark/light mode toggle | Already | Toolbar and dock, both wired to `useTheme` |
| Color theme selector | Declined | Declined: the party's colours are fixed. Wiper royal blue and earth red are brand constants, not a palette to choose from. |
| Brand color animations | **Live** | Live gradients on the part dividers, scroll rail and title |
| Seasonal themes | Declined | Declined: the party's colours are fixed. Wiper royal blue and earth red are brand constants, not a palette to choose from. |
| Logo variations | Declined | Declined: the party's colours are fixed. Wiper royal blue and earth red are brand constants, not a palette to choose from. |
| Animated icons sets | Declined | Declined: the party's colours are fixed. Wiper royal blue and earth red are brand constants, not a palette to choose from. |
| Loading brand animation | Declined | Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything. |
| Favicon animations | Declined | Declined: a moving favicon on a confidential link-only document draws attention to a tab that should not draw attention. |
| Custom scrollbar styling | **Live** | Branded gradient scrollbar site-wide, with `.scrollbar-none` for rails with their own affordance |
| Theme persistence | Already | `useTheme` |
| Gradient dividers | **Live** | All 262 sections — .prose rules in visual-fx.css — every rule, plus the toolbar and footer edges |
| High-resolution logos & platform icons | Already | next/image renditions with `sizes`; 89 lucide icons already in use |
| Ambient time-of-day effects | **Live** | `useDaypart` — a few degrees of hue on the hero field only, never on text or data |

### 21. Emerging & Niche Effects

| Technique | Status | Where / why |
|---|---|---|
| Lottie / Bodymovin animations | Declined | Declined on cost: the Lottie runtime plus JSON is bundle weight for animations CSS keyframes already produce here. |
| View Transitions API | **Live** | `@view-transition` in visual-fx.css, behind `prefers-reduced-motion: no-preference` |
| CSS blend modes / filter animations | **Live** | Grain overlay uses `mix-blend-mode: overlay`; the tilt sheen uses soft-light |
| Animated CSS background patterns | **Live** | Part dividers — creeping diagonal hatch; masked grid behind the hero |
| Interactive 360° product viewers | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Scroll-triggered audio cues | Declined | Declined: no audio. A confidential proposal that makes sound when scrolled is a liability, not a feature. |
| Hover-activated 3D object rotation | **Live** | `TiltCard` — metric cards and the hero illustration; writes two custom properties, never renders |
| Animated infographics / interactive storytelling | Already | The 52 bespoke visualisations, animating through lib/motion.ts |
| Dynamic island / notch animations | Declined | Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section. |
| Animated notification toasts with a progress bar | Declined | Declined: nothing to announce. The one confirmation the site has — copy-link — resolves in place in 400ms, which is faster than a toast could appear. |
| Gesture-based animations like shake-to-undo | Declined | Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader. |
| Ambient light / time-of-day effects | **Live** | `useDaypart` — a few degrees of hue on the hero field only, never on text or data |
| Weather-like background effects | **Live** | `AmbientField motes` — available and used only where falling is the subject, never as decoration |
| Audio-reactive motion | Declined | Declined: no audio. A confidential proposal that makes sound when scrolled is a liability, not a feature. |
| Canvas-based generative art | Declined | Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection. |

### 22. Background & Environmental Effects

| Technique | Status | Where / why |
|---|---|---|
| Animated gradient mesh backgrounds | **Live** | AmbientField — hero; `.fx-mesh` plates on the metric cards |
| Noise texture overlay | **Live** | AmbientField — hero — one inline feTurbulence, no image request |
| Particle field | **Live** | `AmbientField motes={n}` — deterministic positions, no canvas, no rAF |
| Wave/ripple field | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. |
| Aurora / mesh gradient drift | **Live** | AmbientField — hero; `.fx-mesh` plates on the metric cards |
| Weather-like effects | **Live** | `AmbientField motes` — available and used only where falling is the subject, never as decoration |
| Time-of-day ambient shift | **Live** | `useDaypart` — a few degrees of hue on the hero field only, never on text or data |
| Animated CSS patterns | **Live** | Part dividers — creeping diagonal hatch; masked grid behind the hero |
| Liquid/fluid background | **Live** | AmbientField — hero — three blurred wells on independent cycles (`.fx-aurora`); a fluid solver would be declined on cost: a continuous canvas/raf loop for a decorative result, on the device this is read on. |
| Caustics effect | Declined | Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on. |

---
