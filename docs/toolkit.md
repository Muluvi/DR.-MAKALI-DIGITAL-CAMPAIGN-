# Toolkit decisions — visual-first pass

Checked against the npm registry on 31 October 2026. Sizes are gzipped, as shipped by this build
(bundle analyzer) where the package is installed, or as published by the package where it is not.

## The four choices

| Role | Choice | Why |
|---|---|---|
| **Animation engine** | **Motion** (`motion/react`), already installed; **no secondary engine** | It already drives every component animation through `lib/motion.ts` and `MOTION-SYSTEM.md`. Scroll-scrubbed work is done with native CSS scroll-driven animations (already used in five places, behind `@supports`), with IntersectionObserver as the fallback. GSAP would duplicate this and adds a non-MIT licence. |
| **Chart approach** | **Hand-built SVG + individual D3 modules** (`d3-scale`, `d3-geo`, `d3-time`), the existing "register" figure system | This is the approach the brief recommends visx for, already built: server-renderable SVG, a data table and CSV per figure, tier badges. visx would be a second way to do the same thing. `recharts` remains in five legacy components and is scheduled for removal (see the plan). |
| **Icon set** | **lucide-react** only | Already the only set. `MOTION-SYSTEM.md` fixes sizes and strokes. |
| **Component base** | **The repo's own disclosure primitives** (`FoldBody`, `PanelFold`, `ReadMore`, `FigureDetails`), not shadcn/Radix | Every disclosure here keeps its content **in the DOM while closed**, so find-in-page, the site search, print and no-JS readers reach it. Radix Accordion and Collapsible unmount closed content unless every instance is given `forceMount` and re-styled. The repo's primitives already pass Lighthouse accessibility at 100 and the axe CI sweep. |

### Division of labour (one engine, two native mechanisms)

| Mechanism | Owns | Never |
|---|---|---|
| Motion | Component state changes: disclosures, toggles, tabs, flip cards, layout reorder, counters, staggered entrances on first view | Scroll-scrubbed progress |
| CSS scroll-driven animations (`animation-timeline: view()/scroll()`) | Scroll progress bar, Act colour shifts, clip-path reveals at Act transitions, Ken Burns on Act portraits | Anything carrying a data value |
| CSS transitions / `@keyframes` | Hover, focus rings, highlighter sweep, skeleton shimmer | Elements Motion already animates |

No element is animated by two of these. An element that Motion animates gets no CSS
`transition` on the same property.

## Packages

| Name | Repo | Version | Licence | Last release | Size (gz) | SSR/RSC notes | Reduced motion | Used for |
|---|---|---|---|---|---|---|---|---|
| motion | motiondivision/motion | 12.43.0 (14.9.0 current) | MIT | Oct 2026 | 54 kB in this build (motion + motion-dom + framer-motion shim) | Client only (`"use client"`) | `useReducedMotion`, wrapped by `useReducedMotionSafe()` | Every JS animation |
| lucide-react | lucide-icons/lucide | 1.41.0 | ISC | Oct 2026 | 21 kB (tree-shaken, ~50 icons) | RSC-safe | n/a | Icons |
| d3-scale | d3/d3-scale | 4.0.2 | ISC | Apr 2023 (stable, small) | 3 kB | Pure, runs on the server | n/a | Chart scales |
| d3-geo | d3/d3-geo | 3.1.1 | ISC | Mar 2024 (stable) | 8 kB | Pure | n/a | County outline paths |
| d3-time | d3/d3-time | 3.1.0 | ISC | Dec 2022 (stable, small) | 3 kB | Pure | n/a | Timeline axes |
| topojson-client | topojson/topojson-client | 3.1.0 | ISC | Jun 2022 (stable, small) | 1 kB | Pure | n/a | Ward geometry |
| react-markdown | remarkjs/react-markdown | 10.1.0 | MIT | Mar 2025 | 24 kB | Works in RSC; here it runs client-side (see plan, P-3) | n/a | Section prose |
| remark-gfm | remarkjs/remark-gfm | 4.0.1 | MIT | Feb 2025 | 9 kB | As above | n/a | Tables, strikethrough |
| rehype-raw | rehypejs/rehype-raw | 7.0.0 | MIT | Nov 2023 | 52 kB | As above | n/a | Inline HTML in content |
| recharts | recharts/recharts | 3.10.1 | MIT | Oct 2026 | ≈ 74 kB, lazy | Client only | Animation can be disabled per chart | **Legacy**, five components, to be replaced by register figures |

**Removed in this pass:** `three` 0.180 (MIT) and `@react-three/fiber` 9.8 (MIT), ≈ 300 kB
fetched on first view by the cover's WebGL county. WebGL is on the brief's reject list.

**Added in this pass:** none. Every effect adopted below is built from Motion, native CSS or an
existing component.

**Registry code copied:** none. Nothing from Magic UI, Motion Primitives, React Bits or
Aceternity is in the repo, so no Commons Clause or paid-tier code is present. If React Bits code
is ever copied, its **MIT + Commons Clause** licence must be recorded here and in the file header.

## Effects catalogue → implementation

| Effect | Implementation | Where used | Mobile | Laptop |
|---|---|---|---|---|
| A. Blur-in hero portrait | CSS `@keyframes` on `filter`/`opacity` (one-off, on load) | Cover | Same, 400 ms | 600 ms |
| A. Fade-in sequence, KPI | Motion `cascade()` from `lib/motion.ts` | Cover stats | Same | Same |
| A. Animated counters | `CountUp` (rAF + IntersectionObserver, no React renders per frame), lands on the exact printed string, once; the server HTML carries the exact value, so screen readers, print and no-JS readers meet it; one text node per figure (no `sr-only` copy, which doubled figures in copy and find-in-page, see `AnimatedNumber.tsx`) | KPI tiles | Same | Same |
| A. SVG line drawing, ward map | CSS `stroke-dashoffset` animation on the static county SVG | Cover | Same | Same |
| A. Ken Burns + parallax, Act portraits | CSS `animation-timeline: view()` on `transform` | Act openers | Ken Burns only; off under `prefers-reduced-data` | Both |
| B. Slide-up / stagger reveals | Motion `riseIn` + `cascade` (`VIEWPORT.once`) | Visual blocks | Shorter distance | Same |
| B. Scroll progress bar | CSS `animation-timeline: scroll(root)` with JS fallback (existing `FlowChrome`) | Global | Same | Same |
| B. Pin-and-unpin scrollytelling | `position: sticky` + IntersectionObserver (existing `Story`) | §2 four-step analysis | Stacked, short pin | Sticky graphic |
| B. Horizontal scroll sections | CSS `overflow-x` + `scroll-snap` | Timelines, the four Paths | Yes | Grid instead |
| B. Clip-path reveals at Act transitions | CSS `animation-timeline: view()` on `clip-path` | Act openers | Same | Same |
| B. Colour shift between Acts | `--act-accent` per Act, transition on scroll | Global | Same | Same |
| C. 3D tilt, card lift, magnetic buttons | CSS `transform` under `@media (hover:hover) and (pointer:fine)` | Cards, primary buttons | Off | On |
| C. Tooltips, tap-to-inspect | Existing tile/bar inspect (tap first, hover enhances) | Tile map, bars | Tap | Tap + hover |
| C. Focus ring animation | CSS `outline-offset` transition | Global | Same | Same |
| D. Progress bars, funnel fills | Motion `growFromBaseline` | Funnel, bars | Same | Same |
| D. Morphing 2022/2026 toggle | Motion `layout` | Register funnel | Same | Same |
| D. Toasts (CSV, link copy) | Native: one `aria-live` region + CSS, no library | Figure CSV, heading links | Bottom, above the dock | Bottom-left |
| D. Skeleton shimmer | Existing `SectionSkeleton` | Streamed sections | Same | Same |
| D. Sortable tables | Existing `InteractiveTable` | Data tables | Same | Same |
| E. Highlighter sweep | CSS `background-size` transition on `.fx-sweep` (the existing `HighlightedText` glossary popover stays on Motion) | Key-finding phrases | Same | Same |
| E. Drop caps | CSS `::first-letter` | First paragraph of each Act | Same | Same |
| F. Glassmorphism over portraits | CSS `backdrop-filter` with a solid fallback | Act openers | Same | Same |
| F. Blur-up images | `next/image` `placeholder="blur"` | Portraits | Same | Same |
| F. Noise texture | Inline SVG data URI, off under `prefers-reduced-data` | Dark surfaces | Off | On |
| J. Theme switch | View Transitions API, instant fallback | Dock | Same | Same |

## Rejected candidates

| Candidate | Reason |
|---|---|
| GSAP (+ ScrollTrigger, SplitText, DrawSVG) | Duplicates Motion and native scroll timelines already in use; non-MIT licence; ≈ 25–45 kB for the plugins this site would need. |
| Scrollama / react-scrollama | The sticky-graphic pattern is already built (`Story`) on IntersectionObserver. Last release Oct 2022. |
| Lenis | Smooth scrolling changes the feel of native scroll for a working document read daily; adds a scroll loop. No comprehension gain. |
| visx | Would duplicate the register figure system, which already renders SVG on the server with tables and CSV. |
| Observable Plot | Needs client-only loading; a second chart grammar. |
| NumberFlow | `CountUp` and `AnimatedNumber` already meet every counter rule (exact landing, once, tabular figures, the published value in the server HTML). NumberFlow renders per-digit spans, which would reintroduce the split-text problem `AnimatedNumber.tsx` documents. |
| React Flow | The flow diagrams are static sequences; plain SVG carries them. |
| Rough Notation | The hand-drawn look reads as playful against "The Economist Governor"; the CSS highlighter sweep does the job. Last release May 2022. |
| shadcn/ui + Radix | See "Component base". |
| Magic UI, Motion Primitives, React Bits, Aceternity, Cult UI | Every needed pattern already exists in the repo; copying registry code would add a second visual language to retokenise. |
| Sonner | Two toasts do not justify a dependency; one `aria-live` region does it. |
| Embla Carousel | CSS scroll-snap carries the swipeable Paths and segments with no JS. |
| react-compare-slider | The 2022/2026 comparison is a toggle of values, not two images. |
| @formkit/auto-animate | `InteractiveTable` already animates row changes with Motion `LayoutGroup`. |
| Lottie / Rive | No commissioned illustration. |
| Three.js / @react-three/fiber | Removed: WebGL is on the reject list. |
