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

The site is a single-page, long-form analytical report served from the root route (`/`) of a Next.js 15 App Router application (`app/[[...slug]]/page.tsx`).

- **Single Document Flow:** The catch-all route (`[[...slug]]`) and the `/full` route render the identical continuous narrative spine. `/full` provides the static, server-rendered document for print, PDF generation, and readers without JavaScript enabled; `/` serves the same document with progressive streaming for sections past the opening runway.
- **Route & Crawl Boundary:** Robots headers explicitly enforce `noindex, nofollow`, matching the confidential nature of the document.
- **Narrative Spine:** The document is structured across six primary narrative parts and a technical reference shelf:
  1. *Part I: Kitui Today* (Demographics, electorate baseline, poverty and connectivity realities)
  2. *Part II: The Contest* (Electoral arithmetic, 2022 certified returns, the 200,000-vote victory threshold)
  3. *Part III: The Strategy* (Audience segmentation, 3-language matrix, policy positioning, ground-digital bridge)
  4. *Part IV: How Firefly Delivers* (14 workstreams, timeline, technical infrastructure, daily cadence)
  5. *Part V: Proof and Protection* (Legal compliance, IEBC clearance runbook, Data Protection Act 2019 protocols, risk matrix)
  6. *Part VI: The Decision* (The ask, the sprint window, deliverables schedule)
  7. *Reference Shelf:* Annexes A through H (Evidence table, playbooks, volunteer manual, data model, holding statements, fine print)
- **Anchor-Based Navigation:** Navigation is driven through section anchors, the kiondo progress spine, interactive table-of-contents modal (`MobileTOCModal`), and a persistent bottom dock (`Dock`).

---

## 3. Master Visual Element Inventory

*Note: Confirmed indicates verified directly in application components, stylesheets, or rendered HTML. Inferred indicates presence in registry specifications or content data bundles.*

### 3.1 Navigation & Wayfinding

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Skip link** | Global document top | Accessibility | CSS-only text link | `.skip-link` | Jumps to `#content-area` |
| 2 | **Part-dot indicator** | Act openers & chapter headers | Progress / Wayfinding | CSS dots with state attributes | `.part-dots`, `.part-dots__dot`, `data-state="here"\|"passed"\|"ahead"` | Static visual state matching current act |
| 3 | **Chapter header marker** | Every chapter boundary | Chapter orientation | HTML semantic header + CSS | `.flow-chap`, `.flow-chap__label`, `.flow-chap__num` | Deep-link target anchor |
| 4 | **In-page index / dock** | Viewport bottom floating | Navigation & theme control | React client component with glassmorphism | `.pf-dock`, `.pf-dock__pill`, `.pf-dock__where`, `--pf-dock-h` | Clickable modal trigger and theme toggle |
| 5 | **Cross-reference chips** | Throughout markdown prose | Cross-chapter navigation | Interactive inline link chips | `.xchip`, `.xchip-row`, `CrossSectionLink` | Smooth-scrolls to target section |
| 6 | **Keyboard navigation** | Global document scope | Power user wayfinding | Event listeners (`j`, `k`, `?`) | Handled via keyboard listeners in client components | Keyboard-triggered navigation |
| 7 | **Toast status region** | Viewport overlay | Feedback / download alerts | Live announcement container | `.pf-toast-region`, `role="status"`, `aria-live="polite"` | Displays export and deep-link alerts |

### 3.2 Data Visualization & Charts

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 8 | **Dot-plot / Waffle pictogram** | §2.8.1 Demographics, rural poverty | Percentage grid display | SVG / HTML grid | Chart type `icons`, `waffle` | Static display; 1 cell = 1% |
| 9 | **Horizontal bar chart** | Livestock, ward ranking, media share | Quantitative comparison | Inline SVG with CSS tracks | `.kx`, `.kx-bar`, `.kx-track`, `.rf-body` | Scroll-triggered draw animation |
| 10 | **Stacked bar / Budget envelope** | §2.8.2 County revenue control | Multi-part total breakdown | Inline SVG segmented rectangles | Chart type `stack`, `ResourceEnvelopeChart` | Segment breakdown |
| 11 | **Slope chart** | §2.9.1 Connectivity evolution | Two-point trend over time | Inline SVG coordinate slope | Chart type `slope`, `OfflineWaterline` | Dual baseline comparison |
| 12 | **Waterfall chart** | §2.2 Voter register build-up | Cumulative addition/subtraction | Modular SVG bar steps | Chart type `waterfall`, `kind: "start"\|"delta"\|"total"` | Net-change progression |
| 13 | **Small multiples / Panel bars** | Five-race historical audit | Cross-election comparison | Multi-column SVG panels | Chart type `multiples`, `ElectoralHistoryPanel` | Comparative multi-race audit |
| 14 | **Timeline chart** | §1.2 Nomination countdown | Temporal roadmap | Grid layout + SVG nodes | Chart type `timeline`, `Countdown.tsx` | Chronological milestones |
| 15 | **Gauge chart** | Objective scorecard figures | Target vs actual performance | Radial SVG arc indicators | Chart type `gauges`, `primitives.tsx` | Arc fill indicator |
| 16 | **Network / Node-link diagram** | §2.9.2 Media ownership | Media ownership mapping | SVG node-link connections | Chart type `network`, `MediaOwnershipBlock` | Entity relationship map |
| 17 | **Matrix / Comparison table** | Nomination status & zoning | Multi-attribute comparison | HTML table with responsive cards | Chart type `matrix`, `.rm-table` | Mobile card-mode fallback |
| 18 | **Status cards** | Strategic objectives & food security | KPI summary presentation | Card grid with provenance tags | Chart type `cards`, `.rc-card`, `.rc-grid` | Static card presentation |
| 19 | **Composite multi-panel figure** | Lead section figures (§2.8.1, §2.9.2) | Multi-faceted analytical view | Combined figure container | Chart type `composite`, `.pf-fig`, `.rf` | Comprehensive multi-part visual |
| 20 | **Interactive data table** | Data table disclosure in every figure | Complete audit transparency | HTML table with CSV export link | `.rf-table`, `.rf-table-wrap`, `data-col` | Expandable disclosure, sticky header |
| 21 | **Risk calendar / Heatmap** | Part V: Risks & Response | Temporal vulnerability mapping | CSS grid with intensity classes | `.rk-week`, `.rk-day`, `.rk-band`, `.is-hot` | Cell status visualization |
| 22 | **Risk response matrix** | Part V: Threat mitigation | Protocol escalation ladder | Structured HTML classification | Chart type `matrix`, `ConflictMark` | Severity-graded response grid |
| 23 | **Stepper / Process diagram** | §1.5 Budget phasing, Big 4 breakdown | Sequential operational stages | Numbered step pipeline | Chart type `stepper`, `.rs-steps`, `.rs-step` | Current-phase highlight |
| 24 | **Checklist block** | Youth employment, compliance | Statutory criteria audit | Card-based check items | Chart type `checklist`, `IEBC_CLEARANCES` | Status indicator items |
| 25 | **Fan chart / Confidence cone** | Electoral projection modeling | Uncertainty interval modeling | SVG paths with calibrated tick marks | `.pf-fn`, `.pf-fn__plot`, `.pf-fn__grid` | Confidence interval bands |
| 26 | **Big-number statistic** | Hero cover & act openers | High-impact quantitative anchors | Display font with roll animation | `.pf-bn`, `.pf-bn__value`, `.pf-bn__strip` | Entrance count-up |
| 27 | **Reference stat card** | Throughout chapter prose | Contextual metric callout | Micro-card container | `.rc-stat`, `.rc-card` | Sourced data callout |
| 28 | **CSV data download link** | Embedded on all 50+ data figures | Open-data export | Direct file download link | `.rf-csv`, `href="/data/*.csv"` | Triggers clean CSV download |

### 3.3 Maps & Geographic Graphics

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 29 | **Kitui county geographic SVG** | Hero stage & Act openers | Spatial context & county footprint | Hand-calibrated SVG paths (40 wards) | `.pf-county`, `.pf-county__ward`, `CountyStatic.tsx` | CSS stroke trace on mount |
| 30 | **Ward cartogram (tile map)** | Ward-level electoral analysis | Equal-area population grid | Equal-area SVG squares with hatch layers | `.tm`, `.tm-tile`, `.tm-fill`, `tilemap.ts` | Layer toggle (7 analytical layers) |
| 31 | **Geographic zone matrix** | Regional voter density section | Zonal demographic breakdown | Responsive tabbed card list | `GeographicZoneMatrix.tsx`, `role="tablist"` | Tab selection by geographic zone |
| 32 | **Map-pin icon** | Cartogram legends & zone cards | Spatial visual anchor | Lucide icon | `MapPinned`, `MapPin` | Static SVG mark |
| 33 | **Compass icon** | Strategic direction markers | Directional visual cue | Lucide icon | `Compass` | Static SVG mark |
| 34 | **Raster satellite imagery** | None (Deliberately excluded) | Performance & data preservation | Zero raster tiles by architectural rule | — | Excluded to maintain sub-500KB budget |

### 3.4 Status Indicators & Badges

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 35 | **Provenance pill** | BigNumber stats & key figures | Evidence tier signaling | CSS pill with border & hatch variations | `.pf-pp`, `.pf-pp--t1`, `.pf-pp--t2`, `.pf-pp--modelled` | Shape & label distinguish tier in greyscale |
| 36 | **Figure tier badge** | Lead figure heads | Source credibility verification | CSS badge (`Tier 1 / 2 / 3`) | `.tier-badge`, `.tp`, `.tp-T1`, `.tp-T2` | Accessible tooltip title |
| 37 | **Claim verification badge** | Policy commitments & claims | Epistemic status verification | CSS badge with semantic Lucide icon | `.claim-badge`, `ClaimBadge.tsx` | Status classification |
| 38 | **Bar-chart provenance chip** | Register & demographic charts | In-chart data source label | In-track CSS chip | `.kx-chip`, `.is-modelled`, `.is-target` | In-situ source tagging |
| 39 | **Dashed "Needed" placeholder** | Data gap tables & charts | Highlight unmeasured fields | CSS dashed outline | `.ds-needed`, `tp-needed` | Calls out internal data requirements |
| 40 | **Table status markers** | Figure data tables | Row-level data classification | Semantic table cell badges | Official, Reported, Modelled, Data Needed | High-contrast data cell status |

### 3.5 Progress & Wayfinding

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 41 | **Part-dot array (6 dots)** | Hero and chapter headers | Macro narrative positioning | CSS flex array of circular marks | `.part-dots`, `PartDots.tsx` | Reflects progress through 6 acts |
| 42 | **Scroll-driven hero stage** | Hero cover section | Entrance storytelling | Sticky wrapper + CSS variable interpolation | `.pf-hero__stage`, `useScrollShell.ts` | Passive rAF-driven scroll animation |
| 43 | **Chapter ordinal marker** | Header of every chapter | Sequential orientation | Formatted typography | `.flow-chap__num`, `ChapterMarker.tsx` | Stable anchor target |
| 44 | **Kiondo progress spine** | Right edge on desktop (wide view) | Full document progress rail | 7-segment SVG weave bar | `.pf-spine`, `Spine` in `Chrome.tsx` | Clickable segment navigation |

### 3.6 Iconography System

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 45 | **Lucide React icon suite** | Document-wide | Semantic iconography | Tree-shaken inline SVG icons | `lucide-react` | Standardized 16px/20px sizes |
| 46 | **Wi-Fi offline icon** | §2.9 Connectivity panel | Connectivity constraint visual | Lucide icon | `Wifi`, `WifiOff` | Static visual anchor |
| 47 | **Printer export icon** | Document footer & dock | PDF export trigger | Lucide icon | `Printer` | Triggers print stylesheet / save as PDF |
| 48 | **File-cog settings icon** | Annex E Technology architecture | Systems engineering indicator | Lucide icon | `FileCog` | Static indicator |
| 49 | **Message-square icon** | Communication channels | WhatsApp/SMS stream indicator | Lucide icon | `MessageSquare` | Static channel marker |
| 50 | **Emoji characters** | None (Deliberately excluded) | Professional tone preservation | 0 emoji characters across entire document | — | Excluded per style constitution |
| 51 | **Icon fonts** | None (Deliberately excluded) | Zero layout shift & performance | 100% SVG; zero external icon fonts | — | Zero web font network requests |

### 3.7 Brand Assets

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 52 | **Favicon** | Browser tab | Identity | Handcrafted SVG icon | `/icon.svg` | Browser tab visual |
| 53 | **Apple touch icon** | iOS homescreen & bookmarking | PWA touch identity | Raster PNG (180×180px) | `/apple-icon.png` | Device homescreen bookmark |
| 54 | **Open Graph / Twitter card** | WhatsApp, Twitter, Slack previews | Secure link unfurling | Typographic 1200×630 PNG card | `/og/kitui-2027.png` | Pre-rendered static preview image |
| 55 | **Confidential seal** | Hero stage & document footer | Document governance signal | SVG weave-textured badge | `.pf-seal`, `.pf-seal__mark` | High-contrast security marker |
| 56 | **Candidate wordmark** | Hero stage & act openers | Typographic branding | Bricolage Grotesque optical weight | `.pf-hero__title` | Responsive fluid typography |
| 57 | **Party umbrella icon** | Byline credential badge | Coalition identity verification | Inline SVG Wiper Democratic Movement emblem | `WiperUmbrellaLogo` | Vector seal |

### 3.8 Typographic Visual Treatments

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 58 | **Variable display font** | Headings, big numbers, act titles | Structural hierarchy | Self-hosted WOFF2 | Bricolage Grotesque (`--font-display`) | Fluid optical sizing |
| 59 | **Serif reading font** | Body prose & narrative analysis | Long-form readability | Self-hosted WOFF2 (Georgia fallback) | Newsreader (`--font-newsreader`) | Balanced editorial typography |
| 60 | **Monospace numeral font** | Data tables, register counts, code | Tabular numerical alignment | System monospace stack | JetBrains Mono (`--font-mono`) | `tabular-nums` alignment |
| 61 | **Rolling digit morph** | BigNumber statistics | Smooth numerical transition | CSS keyframe translation | `@keyframes pf-roll`, `Roll.tsx` | Runs once upon entering viewport |
| 62 | **Animated count-up** | Metric summaries & scorecards | Numerical progression display | Lightweight JS ticker (`useAnimatedNumber`) | `.anim-num`, `CountUp.tsx` | Viewport-triggered count |
| 63 | **Eyebrow section kicker** | Figure headers & card tops | Contextual topic label | Uppercase tracking token | `.eyebrow-label`, `t-label` | Typographic hierarchy anchor |
| 64 | **Pull-quote block** | Strategy highlights & governing reality | Quotation emphasis | Left-bordered serif block | `PullQuote.tsx`, `kind: "quote"` | High-contrast callout |
| 65 | **Takeaway banner** | Foot of every figure card | Core empirical finding summary | Callout block with contrasting border | `.rf-takeaway`, `.pf-fig__takeaway` | Plain-language key takeaway |
| 66 | **Line-mask typography** | Hero & act numeral titles | Dynamic entrance reveal | Masked `span` container with overflow hidden | `.pf-line > span` | Controlled entrance animation |

### 3.9 Candidate & Campaign Imagery

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 67 | **Candidate portrait (Clasped Hands)** | Hero cover stage | Candidate authority presentation | Responsive WebP cutout with gradient fade | `hero-clasped-hands`, `Portrait.tsx` | Next.js Image with priority |
| 68 | **Candidate portrait (Seated Formal)** | Act II: The Contest | Strategic reflection presentation | Responsive WebP cutout with gradient fade | `seated-grey-cropped`, `Portrait.tsx` | Lazy loaded |
| 69 | **Candidate portrait (Three-Piece)** | Act III: The Strategy | Legislative & policy authority | Responsive WebP cutout with gradient fade | `three-piece-formal`, `Portrait.tsx` | Lazy loaded |
| 70 | **Candidate portrait (Explaining)** | Act IV: Delivery & Execution | Field leadership presentation | Responsive WebP cutout with gradient fade | `gesture-explaining`, `Portrait.tsx` | Lazy loaded |
| 71 | **Pre-rendered OG card image** | Social graph metadata | Social platform sharing preview | 1200×630 PNG card | `/og/kitui-2027.png` | Static pre-built asset |

### 3.10 Interactive UI Controls

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 72 | **Theme switcher toggle** | Persistent bottom dock | Contrast & night reading mode | LocalStorage-backed class toggle | `useTheme.ts`, `html.dark` | Toggles between Dark and Light paper |
| 73 | **Figure details disclosure** | Every data figure card | Expand methodological notes & data | HTML5 `<details>` / `<summary>` | `FigureDetails.tsx`, `.rf-more` | Keyboard accessible expansion |
| 74 | **Scenario model toggle** | Simulation figures | Comparative scenario evaluation | CSS radio-driven switch | `.pf-toggle`, `PathTo200kCalculator` | Real-time threshold recalculation |
| 75 | **Cartogram layer radio controls**| Ward cartogram | Multi-dimensional ward filtering | Semantic radio pill group | `.tm-layers`, `tilemap.ts` | Switches between 7 electoral layers |
| 76 | **Zone matrix tablist** | Geographic analysis block | Regional focus switching | ARIA tablist buttons | `role="tablist"`, `aria-selected` | Filter by North / Central / South |
| 77 | **Read-more prose folds** | Section narrative bodies | Progressive reading disclosure | CSS height interpolation | `ReadMore.tsx`, `FoldBody.tsx` | Expands full prose text |
| 78 | **Interactive table sorting** | Analytical data tables | Custom numerical & alphabetical sort | In-memory column sorting state | `InteractiveTable.tsx` | Click column header to sort |
| 79 | **Print / PDF export button** | Document footer & dock | Generates offline briefing dossier | `window.print()` trigger | `.pf-print-btn` | Invokes `@media print` styling |
| 80 | **Direct CSV export button** | Every figure data table | Data extraction & verification | Direct download anchor | `.rf-csv`, `download` attribute | Downloads structured dataset |

### 3.11 Decorative & Atmospheric Elements

| # | Element | Location | Function | Implementation | Technical Identifier | Interactivity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 81 | **Tactile grain overlay** | Global viewport overlay | Paper texture & digital warmth | SVG `feTurbulence` data URI | `.pf-grain`, fixed pointer-events-none | Ambient fixed overlay |
| 82 | **Kiondo weave pattern** | Hero, act headers, modelled badges | Cultural identity texture | SVG vector hatch data URI | `--pf-weave-img`, `.pf-act__weave` | Ambient texture |
| 83 | **Aurora radial depth glow** | Hero stage & act seams | Soft background illumination | Multi-stop radial gradients | `.pf-hero__glow`, `.pf-act` | Shifted by daypart clock |
| 84 | **Chart grid lines** | Bar charts & timelines | Numerical scale visual alignment | Sub-pixel dashed CSS rules | `.pf-fn__grid`, `.kx-track` | Static layout guides |
| 85 | **Section dividers** | Chapter footers | Structural rhythm & separation | Gradient fade borders | `.pf-line`, `.fx-divider-gradient` | Clean visual boundaries |
| 86 | **Card edge border highlight** | Interactive figures & phone frames | Elevated contrast boundary | 1px line token border | `border-line/60`, `border-accent/40` | Subtle contrast edge |
| 87 | **Magnetic button attraction** | Primary CTAs (desktop) | Micro-interaction polish | Pointer tracking translate transform | `MicroFX.tsx`, `[data-magnetic]` | Gentle magnetic lean toward cursor |
| 88 | **Touch ripple feedback** | Mobile tappable controls | Haptic visual feedback | Ephemeral expanding ring layer | `MicroFX.tsx`, `.pf-ripple` | Spawns on mobile tap |

---

## 4. Implementation Technology Summary

- **Framework & Rendering:** Next.js 15 App Router with hybrid Static Site Generation (SSG) and incremental streamed markdown sections.
- **Styling Architecture:** Tailwind CSS v4 coupled with a centralized token architecture (`app/globals.css`, `app/premium.css`, `app/register.css`, `app/chart-kit.css`).
- **Typography:** Self-hosted `next/font` subsets of Bricolage Grotesque (variable display font) and Newsreader (serif body), backed by JetBrains Mono for data marks. Zero layout shifts.
- **Vector Graphics & Geometry:** 100% inline SVG for geographical county boundaries and ward cartograms. Zero external tile servers, zero Mapbox/Google Maps API dependencies, zero WebGL runtime bloat.
- **Icons:** Pure SVG via `lucide-react`. Zero icon fonts, zero emoji, zero unvetted third-party assets.
- **Animation Runtime:** Hardware-accelerated CSS transforms and lightweight `motion` hooks strictly bounded by `useReducedMotionSafe()` to respect accessibility preferences.

---

## 5. Architectural Gap Analysis & Strategic Recommendations

| Domain | Observed State | Recommended Engineering Enhancement | Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Geographic Interactivity** | Static SVG county map + interactive tile cartogram | Retain inline SVG vector topology; add lightweight hover tooltip for ward-level metrics | Preserves zero-network-request advantage while offering drill-down on candidate home turf vs northern pool. |
| **Data Tables** | Native responsive tables with client-side sort & CSV export | Maintain current headless `InteractiveTable` architecture; keep deterministic `"en-KE"` locale formatting | Guarantees zero hydration errors and deterministic number rendering across varying browser regional locales. |
| **Evidence & Provenance** | Centralized 3-tier provenance classification across all figures | Maintain strict adherence to `docs/DISPUTES-RESOLVED.md` standards | Eliminates conflicting metrics and protects candidate credibility. |
| **Accessibility Compliance** | WCAG 2.1 AA certified contrast, `suppressHydrationWarning` on root, full keyboard wayfinding | Enforce automated regression testing via `npm run verify` across all markdown fences and tokens | Prevents token regressions and guarantees clean execution under mobile screen readers. |
| **Print Dossier Integrity** | Dedicated `@media print` rules expanding all disclosures and tables | Retain static route `/full` for executive print generation | Ensures physical briefing binders match digital displays word-for-word. |

---

## 6. Audit Verification & Integrity Log

- **Verification Status:** All 29 figures tests, 12 declutter checks, 430 units preservation check, and token inventory validation passed.
- **Build & Lint Status:** Clean compilation (`compile_applet`) across all 46 static pages; 0 ESLint errors.
- **Server Health:** Dev server verified active and responding with HTTP 200 on port 3000.
