# Optimisation audit — visual-first pass (October 2026)

Measured before any change, on a local production build (`npm run build && next start`), commit `23543dc`.
The "after" column is filled in Phase 4. Lighthouse 12.8.2, headless Chromium 1243; mobile is the
default Lighthouse profile (Moto G Power, simulated slow 4G, 4× CPU slowdown), desktop is `--preset=desktop`.
Raw reports are not committed (they contain local paths); the scripts that produce every number
here are listed at the end.

## 1. Metrics

| Metric | Mobile before | Mobile after | Desktop before | Desktop after | Target |
|---|---|---|---|---|---|
| Lighthouse performance | **44** | 61 (checkpoint, median of 3) | 90 | 98 | ≥ 95 desktop |
| Lighthouse accessibility | 100 (dark only) | 100 light and dark | 100 | 100 | 100 |
| LCP | **9.15 s** | 5.2 s | 1.12 s | 1.0 s | < 2.5 s mobile |
| FCP | 1.83 s | | 0.42 s | | |
| TBT (lab proxy for INP) | **2,034 ms** | 736 ms | 226 ms | 96 ms | INP < 200 ms |
| CLS | 0.000 | | 0.000 | | < 0.05 |
| Speed Index | 4.25 s | | 0.79 s | | |
| JS transferred on load | **788 kB** | 461 kB | 788 kB | 461 kB | |
| Initial JS (First Load JS, `/`, gz) | **480 kB** | 388 kB | | | < 170 kB |
| Fonts transferred | **289 kB** | | 289 kB | | |
| Images transferred | 19 kB | | 19 kB | | |
| HTML document | 73 kB | | | | |
| DOM nodes, `/` on load | 5,940 | | | | |
| DOM nodes, `/full` (whole document) | 45,677 | | | | |
| `/full` HTML | 4.3 MB | | | | |

LCP breakdown, mobile: TTFB 466 ms · load delay 155 ms · **load time 5,916 ms** · render delay 2,612 ms.
The LCP element is the hero portrait, which is only 19 kB: it takes six seconds because it shares
the slow-4G pipe with 788 kB of script and 289 kB of fonts. The render delay is main-thread time.
JavaScript is the whole problem; the image is not.

### Bundle analysis (`@next/bundle-analyzer`, JSON mode, gzip)

| Chunk | gz | Contents |
|---|---|---|
| 63 | 157 kB | rehype-raw 52 · motion + motion-dom + framer-motion 54 · react-markdown 24 · lucide-react 21 · remark-gfm 9 |
| 971 | 137 kB | `MarkdownViewer` + 118 concatenated modules 102 (every block component, statically imported) · `lib/data` 17 |
| 4bd1b696 + 255 | 98 kB | Next.js / React runtime |
| 592 | 26 kB | register figures (`components/register`, `lib/register`) |
| page | 20 kB | `ClientPage` |
| 647 + 612 | 23 kB | d3-scale, d3-time(-format), d3-interpolate, d3-geo, topojson |
| **Lazy, but fetched on first view** | | |
| bd904a5c + b536a0f1 + 344 + aab1caab | ≈ 300 kB | `three` + `@react-three/fiber` for the cover's WebGL county (`CountyScene`), fetched the moment the hero mounts on any WebGL-capable device |

The markdown pipeline runs **in the browser**: `MarkdownViewer` is a client component, so every
section, including the server-rendered first one, ships react-markdown, remark-gfm and rehype-raw
and re-parses its markdown on hydration. Streamed sections (`StreamedSection`) fetch
`/content/<id>.md` and parse it client-side.

### Fonts

| File | Family | Axes | gz |
|---|---|---|---|
| 6f186b99… | Bricolage Grotesque | wght 200–800, **wdth 75–100, opsz** | 129 kB |
| 4b9bb515… | Newsreader italic | wght 200–800 | 63 kB |
| 5611c554… | Newsreader | wght 200–800 | 57 kB |
| bb3ef058… | JetBrains Mono | wght 100–800 | 40 kB |

All four are preloaded. Three families are within the brief's limit (two plus one for tabular
figures), but the display face carries two extra axes and the mono face is preloaded although
nothing above the fold uses it.

## 2. Screenshots

`docs/optimisation/screenshots/before/before-<w>x<h>.png` at 360, 390, 430, 768, 1280, 1440,
1920 and 844×390 (390 px phone in landscape). Dark theme, top of `/`.

No width scrolls horizontally (`scrollWidth === innerWidth` at all eight). Document height at
390 px: 450,138 px, about **533 phone screens**.

## 3. Inventories

**Fonts.** Bricolage Grotesque (display/UI), Newsreader (prose), JetBrains Mono (figures, labels),
all self-hosted via `next/font`, `display: swap`, fallback metrics adjusted.

**Type sizes.** 103 distinct `font-size` declarations across 8 stylesheets; 40+ distinct computed
sizes in the rendered document. The most frequent are 12 px (2,158 text nodes), 15.35 px, 14 px,
13 px, 12.5 px, 11 px. Fluid tokens exist (`--text-body`, `--text-lead`, `--text-chart-*` …) but most
components set sizes directly. Body copy in the prose column measured 15.35 px at 360 px, under the
16–17 px floor this brief sets.

**Colour.** 159 custom properties in `globals.css`; **210 distinct hex literals** across CSS and
components (`register.css` 60, `globals.css` 40, `premium.css` 12, the rest inline in TSX). Brand
anchor `#060d1a` (dark) and `#f9f5ed` (light). Data palettes exist (`lib/premium/palette.ts`,
`register.css`) but are not one set of semantic tokens.

**Spacing.** 91 distinct padding/margin/gap lengths. No single 4 px scale is enforced.

**Animation.** 64 `@keyframes`. Motion (`motion/react` v12) is the JS engine, with shared tokens in
`lib/motion.ts` (documented in `MOTION-SYSTEM.md`): durations 140–620 ms, two easings, a 3-loop
ambient budget, reduced-motion handled in CSS and through `useReducedMotionSafe()`. CSS
scroll-driven animation (`animation-timeline: view()/scroll()`) is already used in 5 places, behind
`@supports`. A Three.js scene drives the cover and the §2.1 story.

**Words.** Using the page's own visibility rules (`lib/collapse-groups.ts`, which the hero's
reading time already uses): **58,472 words** in the document, **20,016 visible on load** (34%).
Per section, see `docs/text-to-visual-map.md`.

**Visual coverage on a phone.** *Superseded: `/full` opens every fold, so this measured the
expanded document. The like-for-like measure, per section route with folds in their default
state, is in `docs/text-to-visual-map.md`.* Walking `/full` at 390×844, one screen at a time, and asking whether
any figure, table, image, chart SVG or visual block (≥ 120×60 px) intersects it: **326 of 533
screens (61%) contain prose only.** Worst: §10 The message (36 of 47), §3 What voters need (20 of
28), §2 How Kitui voted (18 of 24), §5 The race (18 of 22), §19 Lawful (18 of 26).

**Dependencies.** Next.js 15.5 (App Router), React 19.2, Tailwind 4.1 (CSS-first, no
`tailwind.config`), no shadcn/ui and no Radix. Animation: `motion` 12. Charts: hand-built SVG with
`d3-scale`/`d3-geo`/`d3-time` (the register figures), plus `recharts` 3 in five components
(`ChartComponent`, `PathTo200kChart`, `ConstituencyBarChart`, `PlatformSizingChart`, `MatrixMarks`).
3D: `three` + `@react-three/fiber`. Icons: `lucide-react` only. Markdown: `react-markdown`,
`remark-gfm`, `rehype-raw`, `js-yaml` (build time).

**Already in place.** A large part of this brief was delivered by earlier passes and is kept:
"Read the full text" folds that keep prose in the HTML (`lib/collapse-groups.ts`); a visual-fence
DSL (`lib/visual.ts`) with 20+ kinds; evidence-tier badges with text; data tables and CSV on every
register figure; a reading-progress record in `localStorage`; a print route (`/full`) with folds
opened for no-JS and print; `content-visibility: auto` on 37 blocks; a light theme; View
Transitions for in-page jumps.

## 4. Suspected problems

| | Suspect | Verdict | Evidence |
|---|---|---|---|
| a | Hero and Act portraits requested at `w=1920` on phones | **Ruled out** | Hero requests `w=384` at 360–430 px, `w=640` at 768–1440, `w=828` at 1920. Act-divider portraits are lazy and carry `sizes`. |
| b | 40-ward tile map rendered several times with labels duplicated | **Confirmed** | 7 tile-map SVGs in `/full`, 308–348 nodes each (≈ 2,300 nodes); each is a separate render of the same 40-ward geometry. Ward names repeat in 22 figure-note nodes. |
| c | Off-screen sections hydrate eagerly | **Partly** | On `/`, sections after the first are fetched and mounted only within two screens of the viewport (`StreamedSection`). But a mounted section hydrates every block in it at once, and the cover hero downloads the Three.js scene immediately. |
| d | Chart libraries in the main bundle | **Partly** | `recharts` is lazy. `d3-*`, `topojson` and the register figure code (≈ 49 kB gz) are in the initial bundle, as are all 60+ block components through `MarkdownViewer`'s static imports. |
| e | Long ward names overflow tiles at 360 px | **Ruled out** | Tiles print short codes, full names live in the ward list and data table; zero overflowing leaf elements at 360 px across `/full`. |
| f | Tiers and map categories distinguished by colour alone | **Ruled out** | Tier badges carry "T1/T2/T3" text; tile-map layers use hatch, weave and dashed outlines plus printed labels (`TileMap.tsx`). |

### Further problems found

1. **WebGL on the cover** (`CountyScene`, Three.js): on the reject list, ≈ 300 kB of script on first view, and the main contributor to mobile TBT.
2. **Client-side markdown**: see bundle analysis.
3. **Theme**: `<html>` ships with `class="dark"` and `useTheme` applies a stored light choice only after hydration, so a light-theme reader sees a dark flash. `prefers-color-scheme` is not followed.
4. **Tap targets**: 73 of 889 interactive elements in `/full` are under 44 px in both dimensions or under 24 px tall, chiefly the tier-badge buttons (29×24).
5. **Body size on phones**: 15.35 px, under the 16 px floor.
6. **No service worker**: the team cannot reopen the document on weak signal.
7. **Token sprawl**: 103 font sizes, 210 hex literals, 91 spacing lengths.

## 5. How to reproduce

```bash
npm run build && npx next start -p 3100
```

- Lighthouse: `npx lighthouse http://localhost:3100/ [--preset=desktop] --only-categories=performance,accessibility`
- Bundle: temporarily wrap `next.config.ts` with `@next/bundle-analyzer` in `analyzerMode: 'json'`.
- Screenshots, screen coverage and DOM probes: `scripts/optimisation/*.mjs` (Playwright; the repo does not depend on it, so `npm i --no-save playwright` first).
- Lighthouse summary: `node scripts/optimisation/lighthouse-summary.mjs report.json`.
- Word counts: the `visibleWordCounts` the route already computes (`app/[[...slug]]/page.tsx`).
