# Master Visual Element Inventory & Verified Evidence Ledger

**Codebase:** `Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-`  
**Reference Document:** Comprehensive Visual & Structural System Audit  
**Date:** November 2026  
**Confidentiality:** Link-Only / Internal Campaign Engineering Baseline  

---

## 1. Verified Figure Status & Disputed Evidence Baseline

The following baseline consolidates all certified, disputed, and third-party benchmark figures following empirical audit verification:

| Item | Verified Figure | Status | Primary Authority & Evidence Notes |
| :--- | :--- | :--- | :--- |
| **Kitui Central 2019 population** | **153,099** | **Dispute resolved** | KNBS 2019 Kenya Population & Housing Census (Constituency enumeration). Resolves the divergence between administrative sub-county boundaries (105,991) and the unverified NG-CDF website claim (175,633). Tier 1. |
| **Musila 2022 runner-up votes** | **117,606** | **Dispute resolved** | IEBC Certified Form 37C (35.77% certified vote share). Replaces The Star's provisional early media total of 114,606. Tier 1. |
| **Kitui Q1 development absorption** | **12.44%** | **Dispute resolved** | Office of the Controller of Budget / County Budget Implementation Review Report (CBIRR). Resolves previous contradictory secondary press estimates (~5%) and preliminary quarterly projections. Tier 1 statutory baseline. |
| **Facebook Kenya (May 2026)** | **~23.1 M** | Third-party estimate | Meta Audience Insights / Geo-targeted Kenya 18+ active accounts. Tier 3 planning benchmark. |
| **Messenger Kenya (May 2026)** | **19.9 M** | Third-party estimate | Meta Advertising Reach / Kenya active reach. Tier 3 planning benchmark. |
| **TikTok Kenya (late 2025)** | **18.4 M (18+)** | Third-party estimate | ByteDance Advertising Reach data (Kenya adult segment). Tier 3 planning benchmark. |
| **LinkedIn Kenya** | **6.3 M (late 2025) – 7.59 M (Sept 2026)** | Third-party estimate, time-sensitive | LinkedIn Marketing Solutions / Professional network register Kenya. Rapidly growing urban professional audience. Tier 3 planning benchmark. |
| **Instagram Kenya (May 2026)** | **5.10 M** | Third-party estimate | Meta Audience Intelligence / Kenya 18+ active accounts. Tier 3 planning benchmark. |
| **KPI NW-01–NW-04** | **Not yet measured / awaiting party** | Internal, not externally researchable | Wiper Democratic Movement party nomination sprint baselines. Measured post-access grant during Campaign Week 1 internal audit. |

---

## 2. Site Architecture Overview

The site is a single-page, long-form analytical report served from the root route (`/`) of a Next.js App Router application (`app/[[...slug]]/page.tsx`).

Its catch-all route (`[[...slug]]`) and the `/full` route render the same document; `/full` is the no-JavaScript/open-on-one-page variant for print and archiving. Dedicated metadata routes (`app/robots.ts` and `app/sitemap.ts`) enforce `noindex, nofollow` to protect confidentiality while preventing 404 crawl errors.

The document is organised into six narrative parts:
1. **Kitui today** (Demographics, electorate baseline, poverty and connectivity realities)
2. **The contest** (Electoral arithmetic, 2022 certified returns, the 200,000-vote victory threshold)
3. **The strategy** (Audience segmentation, 3-language matrix, policy positioning, ground-digital bridge)
4. **How Firefly delivers** (14 workstreams, timeline, technical infrastructure, daily cadence)
5. **Proof and protection** (Legal compliance, IEBC clearance runbook, Data Protection Act 2019 protocols, risk matrix)
6. **The decision** (The ask, the sprint window, deliverables schedule)

Followed by a Reference shelf of evidence, playbooks, volunteers, technology, runbooks, and fine print (Annexes A through H). Navigation is anchor-based rather than page-based: chapter headings, a part-dot indicator, cross-reference chips, and an in-page index/dock carry the reader through the report. Visual elements are therefore concentrated inside section templates and reusable figure components rather than across discrete pages.

---

## 3. Master Visual Element Inventory

*Implementation note:* "Confirmed" means the method is directly evidenced in the rendered HTML, a loaded stylesheet, or a JavaScript component. "Inferred" means the class or component is present but its rendering method could not be fully inspected because the site’s HTML and JS bundles are truncated by the audit tool. Counts marked "approx." are lower bounds, not exact totals.

### 2.1 Navigation & Wayfinding

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Skip link** | Global top | Navigational / accessibility | CSS-only text link | `.skip-link` | Clickable; jumps to `#content-area` |
| 2 | **Part-dot indicator** | Hero "act" and every chapter header | Progress / wayfinding | CSS-only dots with `data-state` states | `.part-dots`, `.part-dots__dot`, `data-state="here" \| "ahead"` | Static state display; reflects current part |
| 3 | **Chapter number + title header** | Every chapter | Wayfinding | HTML + CSS typography | `.flow-chap`, `.flow-chap__num`, `.flow-chap__top` | Static; scroll-target anchors |
| 4 | **In-page index / dock** | Persistent UI; exact section not fully verified | Navigation | Inferred CSS/JS component with Lucide row icons | `.pf-idx`, `.pf-idx__rowicon`, `.pf-idx__rowlabel`, `.pf-idx__rowmin`; CSS variable `--pf-dock-h` | Clickable; scroll-linked |
| 5 | **Chapter navigation links** | Throughout document | Wayfinding | Plain anchor links | `href="#..."` | Clickable |
| 6 | **Keyboard navigation hints** | Global | Navigation | JS behaviour, not a visual element | `?`, `j`, `k` key handlers | Keyboard-triggered |
| 7 | **Toast / status region** | Global | Feedback / wayfinding | JS-rendered status region | `.pf-toast-region`, `role="status"` | Appears on download, resume, and section-change events |

### 2.2 Data Visualization & Charts

All charts are rendered by custom figure components, not a third-party charting library. The main renderer receives a `chart.type` discriminator. The types below were found in the content bundle; several are confirmed visually in the rendered text, while others are present in content data.

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 8 | **Dot-plot / waffle pictogram** ("One square is 1% of residents") | §2.8.1 "Who lives in Kitui?"; rural-share and poverty-rate panels | Data visualization | Inferred HTML/CSS grid or inline SVG; last square part-filled | Chart type `icons`; labels in rendered text | Static |
| 9 | **Horizontal bar chart** | Multiple figures, incl. livestock counts, constituency register, radio share | Data visualization | Inline SVG and CSS-positioned bars | `.kx`, `.kx-bar`, `.kx-track`, `.kx-mark`, `.rb`, `.rb-bar`, `.rb-track` | Static; some scroll-triggered draw animation (`rx-draw`) |
| 10 | **Stacked bar / segmented envelope** | §2.8.2 "What does the next governor actually control?" | Data visualization | Inline SVG / CSS segments | Chart type `stack`; `.kx` segment styles | Static |
| 11 | **Slope chart** | §2.9.1 connectivity figure ("2019 → 2023/24") | Data visualization | Inline SVG | Chart type `slope` | Static |
| 12 | **Waterfall chart** | Voter-register build-up figure | Data visualization | Inline SVG / CSS | Chart type `waterfall`; `kind:"start" \| "delta" \| "total"` | Static |
| 13 | **Small multiples / panel bar chart** | Five-race comparison figure | Data visualization | Inline SVG panels | Chart type `multiples`; `panels`, `ref` | Static |
| 14 | **Timeline** | §1.2 "How long is there?"; election countdown | Data visualization | CSS grid + SVG timeline | Chart type `timeline`; countdown | Static; dates and events |
| 15 | **Gauge chart** | Objective scorecard figure | Data visualization | Inline SVG arcs | Chart type `gauges` | Static |
| 16 | **Network / node-link diagram** | §2.9.2 media-ownership figure | Data visualization | Inline SVG or CSS node graph | Chart type `network`; `owners`, `stations` | Static |
| 17 | **Matrix / comparison table** | Wiper nomination-status figure | Data visualization / comparison | HTML table | Chart type `matrix`; `.rm-table`, `.rm-scroll` | Static; responsive card mode on mobile |
| 18 | **Stat / status cards** | Objectives, drought status, food security | Data visualization / status | HTML/CSS cards | Chart type `cards`; `.rc-card`, `.rc-grid`, `.rc-kicker` | Static |
| 19 | **Composite multi-panel figure** | Many figures, incl. §2.8.1 and §2.9.2 | Data visualization | Wrapper combining multiple chart types | Chart type `composite`; `.pf-fig`, `.pf-fig__body` | Static |
| 20 | **Interactive data table** | Every figure with "View the data table" | Data display | HTML table with responsive card fallback | `.rf-table`, `.rf-table-wrap`, `data-col`; `.prose table` | `details`/`summary` expandable; sticky headers |
| 21 | **Risk calendar / heatmap** | "Risks & response" section | Data visualization | CSS grid with colour-coded cells | `.rk-week`, `.rk-day`, `.rk-band`, `.rk-risk`, `td.is-hot` | Static |
| 22 | **Risk matrix** | "Risks & response" section | Data visualization | HTML table with heat cells | `.rk-risk` | Static |
| 23 | **Stepper / process diagram** | §1.5 budget components; "Big Four" constituency breakdown | Data visualization / process | HTML/CSS numbered steps | `kind:"stepper"`; `.rs-steps`, `.rs-step`, `.rs-step.is-current` | Static |
| 24 | **Checklist block** | "Jobs and the young" | Data visualization / list | HTML/CSS | `kind:"checklist"` | Static |
| 25 | **Fan chart / line-with-grid chart** | Likely scenario or uncertainty figure | Data visualization | Inline SVG with CSS grid ticks | `.pf-fn`, `.pf-fn__plot`, `.pf-fn__grid`, `.pf-fn__tick`, `.pf-fn__rows` | Static; possibly toggle between series |
| 26 | **Big-number statistic** | Hero act; key-figure blocks | Data visualization / emphasis | HTML/CSS with animated count-up | `.pf-bn`, `.pf-bn__value`, `.pf-bn__strip`, `@keyframes pf-roll`; `.anim-num` | Scroll-triggered animation |
| 27 | **Reference stat card** | Many figure cards | Data visualization | HTML/CSS | `.rc-stat`, `.rc-card` | Static |
| 28 | **CSV download link** | Every data figure | Data access | HTML link | `.rf-csv`, `.pf-fig__csv`; `href="/data/*.csv"` | Clickable |

### 2.3 Maps & Geographic Graphics

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 29 | **Kitui county map** | Hero "act" background; likely map figures | Geographic / decorative | Inline SVG, `viewBox="0 0 600 1000"`; multiple ward paths, each rendered twice (solid fill + woven `<pattern>` overlay) | `.pf-county`, `.pf-county__ward`; `<pattern id="act-kitui-county-weave">` | Static; CSS-variable fills; no pan/zoom |
| 30 | **Ward tile-grid map (cartogram)** | Ward-level figures | Geographic / data visualization | Inline SVG rectangles plus CSS layout; layer radio controls | `.tm`, `.tm-tile`, `.tm-fill`, `.tm-hatch`, `.tm-legend`, `.tm-swatch`, `.tm-layers` | Interactive layer toggle (`register`, `largest`, `footprint`, `party-flow`, `zones`, `effort`, `reach-targets`) |
| 31 | **Geographic zone matrix** | "The land" / zoning section | Geographic comparison | HTML/CSS tabs + list; may include schematic map | Component `GeographicZoneMatrix`; `role="tablist"`; Lucide map-pin and compass icons | Clickable tabs |
| 32 | **Map-pin icon** | Zone matrix | Functional icon | Lucide SVG map-pin (Lucide) | `MapPin` | Static |
| 33 | **Compass icon** | Zone matrix | Functional icon | Lucide SVG compass (Lucide) | `Compass` | Static |
| 34 | **Raster map images** | None detected | — | — | — | — |

### 2.4 Status Indicators & Badges

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 35 | **Provenance pill / tier badge** | Inline throughout prose and figure sources | Status / evidence tier | CSS-only with border, background, and woven pattern for "modelled" | `.pf-pp`, `.pf-pp--t1`, `.pf-pp--t2`, `.pf-pp--t3`, `.pf-pp--modelled`, `.pf-pp--target`, `.pf-pp--needed` | Static |
| 36 | **Compact tier badge** | Inline in prose | Status | CSS/Tailwind | `.tier-badge`, `.tier-badge-T1`, `.tier-badge-T2`, `.tier-badge-T3` | Static; tooltip via title |
| 37 | **Claim badge** | Inline in strategy/proof sections | Status | CSS + Lucide icon | `.claim-badge`, `.claim-badge-verified`, `.claim-badge-estimate`, `.claim-badge-awaiting`, `.claim-badge-unmeasured` | Static |
| 38 | **Provenance chip in charts** | Bar-chart labels | Status | CSS chip | `.kx-chip`, `.kx-chip.is-modelled`, `.is-target`, `.is-needed` | Static |
| 39 | **Dashed "needed" placeholder** | Charts and figures | Status | CSS dashed border | `.ds-needed`, `.ds-needed-box` | Static |
| 40 | **Status markers in tables** | Data tables | Status | HTML text / badge | Official, Reported, Unconfirmed, Modelled in table cells | Static |

### 2.5 Progress & Pagination

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 41 | **Part-dot indicator (6 dots)** | Hero and chapter headers | Progress | CSS-only dots | `.part-dots`, `.part-dots__dot` | Static state; updates with scroll |
| 42 | **Scroll-driven hero progress** | Hero section | Progress / storytelling | CSS custom properties `--p`, `--t`; sticky stage; JS scroll listener | `.pf-hero[data-story=true]`, `.pf-hero__stage`, `.pf-act__county` | Scroll-triggered |
| 43 | **Chapter numbering** | Chapter headers | Progress | Text + CSS | `.flow-chap__num` | Static |
| 44 | **Conventional pagination** | Absent | — | — | — | Single-page document; no page numbers or next/previous pagination |

### 2.6 Iconography

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 45 | **Lucide React icon set** | Global; navigation, index, badges, zone matrix, offline figure, print control | Functional | Lucide React (`createLucideIcon`, module 56479) | Confirmed icons include `wifi`, `map-pin`, `compass`, `printer`, `file-cog`, `message-square`; claim badges import additional status icons | Static unless inside a button |
| 46 | **Wi-Fi icon** | Connectivity figure "73.8% are offline" | Functional | Lucide SVG wifi | `Wifi`, `WifiOff` | Static |
| 47 | **Printer icon** | Print / export control | Functional | Lucide SVG printer | `Printer` | Clickable if wired to print |
| 48 | **File-cog icon** | Possibly reference / settings control | Functional | Lucide SVG file-cog | `FileCog` | Static or clickable |
| 49 | **Message-square icon** | Possibly contact / feedback | Functional | Lucide SVG message-square | `MessageSquare` | Static or clickable |
| 50 | **Emoji characters** | None detected | — | — | — | — |
| 51 | **Icon font** | None detected | — | — | — | — |

### 2.7 Brand Assets

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 52 | **Favicon** | Browser tab | Branding | SVG | `/icon.svg`; `rel="icon"` | Static |
| 53 | **Apple touch icon** | iOS home screen | Branding | Raster PNG, 180×180 | `/apple-icon.png` | Static |
| 54 | **Open Graph / Twitter card image** | Social sharing | Branding | Raster PNG, 1200×630 | `/og/kitui-2027.png` | Static |
| 55 | **Brand seal / pill** | Hero | Branding | CSS background with woven SVG data-URI mark | `.pf-seal`, `.pf-seal__mark` | Static |
| 56 | **Text wordmark / title** | Hero | Branding | HTML/CSS typography | `.pf-hero__title`; Bricolage Grotesque | Static |
| 57 | **Standalone logo file** | None identified beyond favicon/seal | — | — | — | — |

### 2.8 Typographic Visual Treatments

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 58 | **Variable display font** | Global | Brand / hierarchy | Web font (WOFF2) | Bricolage Grotesque (`--font-display`) | Static |
| 59 | **Serif reading font** | Body / figure titles | Hierarchy | Web font (WOFF2) | Newsreader (`--font-newsreader`) | Static |
| 60 | **Monospace font** | Data labels / code-like text | Data emphasis | System monospace stack | `--font-mono` | Static |
| 61 | **Big-number stat with roll animation** | Hero and key figures | Emphasis | CSS animation (`@keyframes pf-roll`) | `.pf-bn__value`, `.pf-bn__strip`, `.pf-bn__ghost` | Scroll-triggered |
| 62 | **Animated count-up** | Offline-waterline and figures | Emphasis | JS animation + CSS | `.anim-num`, `.anim-num__value` | Scroll-triggered |
| 63 | **Eyebrow label** | Figure headers | Hierarchy | CSS typography | `.eyebrow-label`, `.pf-fig__sec`, `.rc-kicker` | Static |
| 64 | **Pull-quote / "governing line" block** | Strategy sections | Emphasis | HTML/CSS block | `kind:"quote"`; associated figure styles | Static |
| 65 | **Callout / takeaway box** | Figures | Emphasis | CSS border / background | `.pf-fig__takeaway`, `.rf-takeaway` | Static |
| 66 | **Line-mask display typography** | Hero and act titles | Visual treatment | CSS overflow/mask | `.pf-line`, `.pf-line > span` | Static; scroll-driven transforms |

### 2.9 Imagery

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 67 | **Portrait of Dr. Mulu** | Hero / "act" section | Branding / candidate recognition | Raster WebP, responsive srcset, mask-image gradient fade | `/portraits/02-seated-grey-cropped-1600.webp`; `.pf-act__portrait` | Static |
| 68 | **Other candidate/campaign photography** | Not detected beyond portrait | — | — | — | — |
| 69 | **Illustrations** | None detected | — | — | — | — |
| 70 | **Background photography** | None detected | — | — | — | — |
| 71 | **OG social image** | Social sharing | Branding | Raster PNG | `/og/kitui-2027.png` | Static |

### 2.10 Interactive UI Controls

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 72 | **Theme toggle** | Global | User preference | JS + CSS class toggle | `localStorage.theme`; `html.dark` | Clickable; toggles light/dark/sepia |
| 73 | **Details / summary disclosure** | Tables and figure notes | Progressive disclosure | Native HTML `<details>` / `<summary>` | `.pf-fig__details`, `.rf-details` | Clickable; expands table |
| 74 | **Scenario toggle** | Figures with A/B states | Comparison | CSS-only toggle with radio inputs | `.pf-toggle`, `.pf-toggle__thumb` | Clickable; switches content |
| 75 | **Tile-map layer controls** | Ward cartogram | Data filtering | Radio inputs styled as pills | `.tm-layers`, `.tm-layers input:checked` | Clickable |
| 76 | **Zone matrix tabs** | "The land" | Data filtering | Buttons with `role="tab"` | `role="tablist"`, `aria-selected` | Clickable |
| 77 | **Expandable "more" controls** | Various sections | Progressive disclosure | JS/CSS | `.pf-more__btn`, `.vz-more__btn`, `.rf-more` | Clickable |
| 78 | **Tabs** | Various sections | Navigation / filtering | JS/CSS | `.vz-tabs__list`, `.pf-tabs` | Clickable |
| 79 | **Print control** | Global / figure | Export | Lucide printer icon + JS | `window.print` | Clickable |
| 80 | **CSV download** | Every data figure | Data access | Anchor link | `.rf-csv`, `.pf-fig__csv` | Clickable |
| 81 | **Carousel** | Not detected | — | — | — | — |
| 82 | **Canvas / WebGL visualisation** | Not detected | — | — | — | — |

### 2.11 Decorative Elements

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 83 | **Grain / noise overlay** | Fixed over entire page | Decorative texture | SVG data URI with `feTurbulence`; fixed positioned; opacity ~0.05 | `.pf-grain` | Static |
| 84 | **Woven pattern overlay** | Hero, act backgrounds, map wards, badges | Decorative / brand texture | SVG data URI pattern | `--pf-weave-img`; `.pf-act__weave` | Static |
| 85 | **Radial glow gradients** | Hero and act backgrounds | Decorative depth | CSS radial gradients | `.pf-hero__glow`, `.pf-act` | Static |
| 86 | **Chart grid lines** | Fan chart / line chart | Decorative / data guide | CSS borders | `.pf-fn__grid`, `.pf-fn__tick` | Static |
| 87 | **Dividers** | Chapter and figure boundaries | Structure | CSS borders | `.pf-line`, `.rf-foot` | Static |
| 88 | **Scrollbar treatment** | Not specifically detected | — | Browser default | — | — |

---

## 4. Implementation Technology Summary

| Method | Count / Evidence | Notes |
| :--- | :--- | :--- |
| **Inline SVG** | High | Kitui county map (40+ ward paths, each rendered twice with a woven overlay), favicon, chart SVGs, tile-grid map, Lucide icons rendered as inline SVG. |
| **CSS-only** | High | Part dots, provenance pills, tier badges, claim badges, cards, tables, stepper, risk matrix, toggle, grain background (data URI), weave background (data URI), responsive table card mode. |
| **Lucide React** | Confirmed | `createLucideIcon` module 56479; confirmed icons: `wifi`, `map-pin`, `compass`, `printer`, `file-cog`, `message-square`; additional status icons imported by claim badges. No Font Awesome, Heroicons, Tabler, or Material Symbols detected. |
| **Raster imagery** | Low | Candidate portrait (WebP, multiple responsive sizes), OG image (PNG, 1200×630), Apple touch icon (PNG, 180×180). |
| **Emoji** | None detected | No emoji characters found in the rendered text or source. |
| **Canvas / WebGL** | None detected | No `<canvas>` or WebGL contexts found. |
| **Charting library** | None | Charts are custom figure components driven by a `chart.type` discriminator. `topojson`/`d3-geo`-style geometry utilities appear in the bundle for map geometry, but no Recharts, Chart.js, D3 charting, or Highcharts library was identified. |
| **Animation** | Present | Motion/Framer-Motion-style animation utilities and CSS keyframes (`pf-roll`, `rx-draw`) for count-ups and scroll-triggered draw effects. |
| **CSS framework** | Confirmed | Tailwind CSS v4 in the loaded stylesheet, plus substantial custom CSS. |
| **Fonts** | Confirmed | Bricolage Grotesque (variable display), Newsreader (serif reading), system monospace. |

---

## 5. Gap Analysis

### Absent or under-represented visual categories
1. **Interactive geographic maps:** The county map is a static inline SVG. There is no pan, zoom, hover tooltip, ward click-through, or layer control on the geographic map itself (the tile-grid map has layer toggles, but the geographic map does not).
2. **Standard charting library:** No Recharts, Chart.js, D3 charting, or Highcharts. Custom charts are tailored and visually coherent, but they lack the accessibility, tooltip, and export features a charting library provides.
3. **Photographic breadth:** Only one candidate portrait is confirmed. There are no campaign-event photos, community photos, or county-context photography.
4. **Illustration system:** No custom illustrations or political/civic spot illustrations beyond Lucide functional icons.
5. **Social-media visual assets:** No embedded social posts, share cards beyond OG image, or platform-specific graphics.
6. **Video / audio:** No video or audio embeds, which is notable for a digital campaign proposal.
7. **Chart variety:** No donut, pie, scatter, box plot, area chart, or true heatmap (the risk calendar is a status grid, not a continuous heatmap). The content taxonomy lists donut and waffle, but the rendered/confirmed charts are predominantly bar, slope, waterfall, timeline, gauge, network, and dot-plot.
8. **Table interactivity:** Tables are expandable and responsive but have no search, sort, column filtering, or row selection.
9. **Icon consistency:** Multiple badge systems coexist (`pf-pp`, `tp`, `tier-badge`, `claim-badge`), plus multiple chip styles. This is a consistency and maintenance gap, not a missing category.
10. **Icon sizing tokens:** Icons use ad hoc `size={9}`, `size={11}`, `size={12}` values rather than a documented icon-size scale.
11. **Emoji:** None. If the campaign intends informal social content, this is an intentional absence rather than a gap.

### Inconsistent, redundant, or under-optimised elements
* **Badge redundancy:** `pf-pp`, `tp`, `tier-badge`, and `claim-badge` all signal evidence/status but use different markup, classes, and visual rules. A single StatusBadge component with variants would reduce CSS and visual drift.
* **Hard-coded chart colours:** The budget chart historically used hard-coded hex values (`#0056a8`, `#338dfd`, `#e31d2b`, `#0b1a30`); recently refactored to CSS custom properties (`var(--accent-solid)`, `var(--color-accent)`, `var(--rival-solid)`, `var(--color-ink)`).
* **Map path duplication:** Each ward path is rendered twice (solid fill plus woven overlay). This doubles path count and DOM weight. A single path with a patterned fill or a `<use>` reference would be leaner.
* **Chart implementation method is mixed:** Some charts are SVG, some are CSS-positioned bars, and some are HTML grids. This makes responsive behaviour and accessibility auditing harder.
* **Accessibility risk in custom charts:** Dot-plot and bar charts rely on visual position; data tables are present for many figures.
* **No icon sprite:** Lucide icons are individually bundled. A local SVG sprite for the small, frequently reused icon set would reduce bundle requests and enable consistent `aria-hidden` handling.

---

## 6. Recommended Additions

| Gap | Recommended Tool / Asset | One-Sentence Justification |
| :--- | :--- | :--- |
| **Interactive maps** | MapLibre GL JS or react-simple-maps | Adds pan, zoom, tooltips, and ward click-through without replacing the existing SVG geometry. |
| **Accessible charting** | Visx or Recharts | Provides accessible primitives and tooltips while preserving the custom visual language. |
| **Table interactivity** | TanStack Table | Adds sorting, filtering, and column visibility to the existing data tables with a headless API. |
| **Icon consistency** | Lucide React + local SVG sprite for 15–20 key icons | Keeps the confirmed Lucide system but reduces bundle duplication and standardises sizing. |
| **Badge consistency** | Single `StatusBadge` component (`variant="tier" \| "claim" \| "provenance"`) | Replaces four parallel badge systems with one token-driven component. |
| **Photography** | Optimised AVIF/WebP campaign and county-context imagery | Fills the imagery gap while preserving performance. |
| **Social visuals** | Automated OG image generation (e.g. `@vercel/og`) | Produces chapter-specific share cards instead of one static OG image. |
| **Print/export** | SVG-to-PDF or print-specific chart styles | Makes the analytical figures portable for offline political briefings. |
| **Chart colour tokens** | Extend CSS custom-property system with `--chart-*` tokens | Replaces hard-coded hex values and keeps dark-mode behaviour consistent. |
| **Map performance** | Replace double-path ward rendering with `<use>` or single patterned fill | Reduces SVG path count and DOM size without changing the visual result. |

---

## 7. Assumptions and Limitations

1. **Traversal depth:** The site is a single long document. The root and `/full` routes serve the same report; `/full` provides the static variant.
2. **Page count:** No separate sub-routes were found. `robots.txt` and `sitemap.xml` return metadata routes. The catch-all route and `/full` route serve the same report.
3. **Chart implementation method:** Chart types are confirmed from the content bundle (`chart.type` values), with internal custom renderers.
4. **SVG path count:** The county map contains 40+ ward paths, each rendered twice.
5. **Icon count:** Lucide is confirmed, and distinct icons are directly identified (`wifi`, `map-pin`, `compass`, `printer`, `file-cog`, `message-square`, plus claim badges).
6. **Dynamic states:** Hover, active, expanded, and modal states are captured from CSS and component specifications.
7. **Zero fabrication:** Where the implementation could not be confirmed in rendered DOM, the inventory explicitly notes "inferred" or "method unconfirmed".
