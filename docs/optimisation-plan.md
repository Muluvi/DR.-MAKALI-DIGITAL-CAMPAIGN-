# Optimisation plan — visual-first pass

Ordered by impact relative to effort. Numbers refer to `docs/optimisation-audit.md`. Toolkit
choices and licences are in `docs/toolkit.md`; the section-by-section conversion is in
`docs/text-to-visual-map.md`.

## Progress

| Step | State |
|---|---|
| Phase 1 audit | Done |
| Phase 2 documents | Done |
| Commit 1, toolkit | Done |
| Performance (P-1, P-2, P-4, P-7, P-8) | Done; P-3, P-5, P-6, P-9 open |
| Area commits, Acts I–III | See git log |
| Checkpoint after Acts I–III | Reached at the end of the first session |
| Acts IV–VI and annexes | Not started |

## 1. Performance (largest gap: mobile 44, LCP 9.2 s, 480 kB initial JS)

| # | Change | Files | Impact | Effort |
|---|---|---|---|---|
| P-1 | Remove the WebGL county (Three.js) from the cover and §2.1 story; keep the static SVG county, add a CSS line-draw. Drop `three`, `@react-three/fiber`, `@types/three` | `components/premium/CoverHero.tsx`, `Story.tsx`, `CountyScene.tsx` (deleted), `lib/premium/palette.ts`, `app/layout.tsx` (story-pin script), `package.json` | ≈ 300 kB less script on first view; most of mobile TBT | S |
| P-2 | Code-split every block component `MarkdownViewer` imports statically, with `next/dynamic` (SSR kept, so HTML is unchanged) | `components/MarkdownViewer.tsx` | ≈ 80–100 kB out of the initial bundle | S |
| P-3 | Move markdown parsing off the client: compile each section to a HAST JSON at build time and render it with `hast-util-to-jsx-runtime`; drops react-markdown, remark, micromark and rehype-raw (≈ 85 kB) from the browser | `scripts/build-content.ts`, `components/MarkdownViewer.tsx`, `components/flow/StreamedSection.tsx` | Needed to reach 170 kB | L (after the checkpoint) |
| P-4 | Fonts: stop preloading JetBrains Mono (not above the fold); drop Bricolage's `wdth` axis if unused at display sizes | `app/layout.tsx` | ≈ 40–90 kB less on the critical path | S |
| P-5 | Motion `LazyMotion` + `m` components | all `motion/react` imports | ≈ 30 kB | M |
| P-6 | Tile map: one shared `<symbol>` set for the 40 tiles, referenced by `<use>` in each of the 7 maps | `components/register/TileMap.tsx` | ≈ 1,500 DOM nodes on `/full` | M |
| P-7 | Lightweight service worker, stale-while-revalidate for `/`, `/content/*.md`, `/data/*.csv` | `public/sw.js`, registration in `ClientPage` | Reopen on weak signal | S |
| P-8 | `prefers-reduced-data`: no Ken Burns, noise or decorative motion | CSS | Data and battery | S |
| P-9 | Split the render-blocking stylesheet: section-specific CSS loads with its section | `app/*.css`, component imports | Mobile render delay | M |

### Measured after P-1, P-2, P-4, P-7, P-8 (same build, same machine as the audit)

| | Before | After |
|---|---|---|
| First Load JS, `/` | 480 kB | 388 kB |
| JS transferred on load | 788 kB | 461 kB |
| Mobile Lighthouse | 44 | 57 |
| Mobile TBT | 2,034 ms | 685 ms |
| Mobile LCP | 9.15 s | 6.71 s |
| Desktop Lighthouse | 90 | **98** (target ≥ 95 met) |

The mobile LCP is now render delay, not download: the portrait loads in 245 ms and paints 5.6 s
later, behind 70 kB gzipped of render-blocking CSS (one 265 kB stylesheet) and 1.7 s of style and
layout on a 6,000-node first screen. P-3 and a CSS split (P-9: load `register.css`,
`chart-kit.css` and `part-visuals.css` with the sections that use them) are what close it.

The 170 kB initial-JS target is **not reachable without P-3**: the framework runtime is 98 kB and
the client markdown pipeline another ≈ 85 kB. P-3 changes how every section renders, so it is
planned as its own commit after the checkpoint rather than mixed into the Act work.

## 2. Text-to-visual

| # | Change | Files |
|---|---|---|
| V-1 (G-1) | Register figures and frame figures show their marks on load; question, notes, item bodies, source names and the data table stay behind "Show the details" | `components/register/Figure.tsx`, `components/figures/FigureFrame.tsx`, `components/register/FigureDetails.tsx` |
| V-2 (G-2) | Panels open on load | `components/markdown/PanelFold.tsx` |
| V-3 (G-3) | A chapter intro that restates the lead folds | `lib/collapse-groups.ts` |
| V-4 | Per-section visual fences, Acts I–III | `content/*.md` (checked by `npm run verify`) |

V-1 and V-2 reverse the owner's instruction of 29 October 2026 (figures and panels closed by
default, to reach a phone-screen target). This brief's primary goal, that visuals carry the
argument, needs them open. Reverting is a one-line default in each of two components.

## 3. Visual aids, effects and animation

Adopted (each tied to comprehension, navigation or feedback):

| Effect | Job | Note |
|---|---|---|
| SVG line-draw of the county on the cover | Comprehension: the map is the subject | Replaces WebGL |
| Counters, once, exact | Comprehension | `CountUp`; screen readers get the final value at once |
| Bars grow from baseline; funnel fill; 2022/2026 toggle morph | Comprehension | Existing |
| Scroll progress, section indicator, resume reading | Navigation | Existing; resume added to the dock |
| Header blur after the hero | Navigation | Existing |
| Toasts on CSV download and link copy | Feedback | Native `aria-live` |
| Highlighter sweep on key findings | Comprehension | CSS |
| Card lift / tilt on fine pointers only | Feedback | `@media (hover:hover) and (pointer:fine)` |

Rejected: everything on the brief's reject list, unchanged. The WebGL county is removed for that
reason. No rejected effect is argued back in.

## 4. Typography

- Body text: raise the phone floor from 15.35 px to 16 px (`--text-body` clamp).
- Numbers in figures, tables and KPIs: `font-variant-numeric: tabular-nums lining-nums` globally on `.rf`, `table`, `.vz-*` stats.
- `text-wrap: balance` on headings, `pretty` on paragraphs (partly present; made global).
- `hyphens: auto` with `lang="en"` on table cells and tile labels.

## 5. Colour

- Theme follows `prefers-color-scheme` until the reader chooses; the choice persists (try/catch).
- No flash: a pre-paint script sets the class before first paint.
- Tier, constituency and three-state palettes collected as named tokens (documented in `docs/design-tokens.md`).

## 6. Spacing and layout

- Tier-badge buttons get a 44×44 hit area without changing their visual size (`::after` hit box).
- `scroll-margin-top` on every anchor target (present; verified).
- `env(safe-area-inset-*)` on the dock and the progress bar (present; verified).

## Rejected toolkit candidates

See `docs/toolkit.md`, "Rejected candidates".
