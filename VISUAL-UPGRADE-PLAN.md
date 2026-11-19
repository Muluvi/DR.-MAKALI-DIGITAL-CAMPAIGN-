# Visual upgrade plan

Stage 1 of the visual-upgrade brief: the audit, the build plan and what I think should change in
the brief. **Nothing below is built yet.** I will build only what you approve, in the order and
pull requests set out in the section "Build order".

Read before planning: `AGENTS.md`, `ARCHITECTURE.md`, `MOTION-SYSTEM.md`, `CONTRIBUTING.md`,
`AUDIT-POLISH.md`, `docs/rivals-2026-11/DECISION.md`, `lib/visual.ts`, `components/visual/VisualFence.tsx`,
`lib/tools/meta.ts`, `data/registry.export.json`, `data/ussd-specimen.ts`, `lib/platform/collections.ts`.

---

## 1. Decisions I need from you first

Each of these is a point where the brief conflicts with the repo's own rules, or where the data
does not exist. The brief says to stop and ask in that case, so I have.

| # | Question | What I found | My recommendation |
|---|---|---|---|
| Q1 | **Custom icon set (D1) against "lucide-react only"** | `MOTION-SYSTEM.md` (Icons) says `lucide-react` only. Lucide has no goat, jerrycan, matatu, borehole, maize or feature phone. | Allow a small `components/icons/kitui.tsx` set drawn on Lucide's own grid (24px, stroke 1.5, round caps and joins, `currentColor`), used only for concepts Lucide lacks. Everything else stays Lucide. I add one paragraph to `MOTION-SYSTEM.md` saying so. |
| Q2 | **Ambient-loop budget of 3** | `MOTION-SYSTEM.md` caps looping motion at three and calls a blinking "live" signal a false claim. The brief asks for a scrolling ticker (B10), a pulsing ward on the command map (B11) and pulsing tap hints (A9). Together that is three new loops. | **Ticker:** a static strip you swipe or tap through, with no auto-scroll. **Command map:** a single ripple only when a real record is saved (an event, not a loop), and no "live" wording unless the data really is live. **Tap hint:** three pulses, then it stops for good. None of these counts against the budget. |
| Q3 | **"Phase 0 … Phase 3" in the timeline chapter** | Section numbers are already stripped from headings on screen (`lib/heading-slug.ts`). But the campaign's own phase names ("Phase 1: awareness, October–December 2026") are content, and they appear in headings, chips and data. Rule 2 names "Phase 4" as forbidden. | Leave the content as it is in this upgrade, because renaming it is a content change with its own ledger and anchor moves. No new visual or image will use a number as a label: they use the phase's name and dates ("Awareness · Oct–Dec 2026"). If you want the phases renamed across the site, that is a separate pass. |
| Q4 | **A4 output** | A PDF needs a library (for example `pdf-lib`, about 180 kB gzipped, server-only). | Print-ready PNG at 2480 × 3508 (A4 at 300 dpi) from the same `ImageResponse`. No new dependency. |
| Q5 | **Fonts for the image routes** | `next/og` cannot use `next/font`. It needs the font files themselves. | Commit subset TTFs of Bricolage Grotesque, Newsreader and JetBrains Mono (all SIL OFL), about 250 kB in total, server-side only, under `app/api/card/_fonts/`. They never ship to the browser. |
| Q6 | **"Before" post in Before and after (A5)** | A "typical current post" written by me would be invented content that reads as criticism of the existing team's work. | Either use a real post once the presence audit has coded one (with permission), or label both phones "Illustrative · not a real post" and make the "before" generic ("a post with no ward, no voter and no reason"). Please choose. |
| Q7 | **Lighthouse baseline** | This container cannot reach the production site (the network policy blocks it). | Measure a local production build of `main` against the branch build, both on mobile settings, and report both. If you want the production score itself, allow the site's host in the environment's network settings. |
| Q8 | **Data that does not exist** | See section 4. Five Part C visuals have no honest data behind them. | Skip them, or build the reduced versions noted, as you prefer. |

---

## 2. Audit: every `checklist`, `cards`, `stats` and `stepper` block

82 blocks: 31 `checklist`, 29 `cards`, 15 `stats`, 7 `stepper`. Chapter names are shown as the
reader sees them, without numbers. The line is the fence's line in `content/<file>.md`.

**How to read the "Plan" column**

- **Replace:** the visual takes over the block's layout, and every word of the block moves into the
  new visual verbatim (labels shown, bodies behind the same disclosure), so the conservation checks
  still find all of it. Rule 3 holds: no text is removed.
- **Improve:** the block stays and gains a visual beside or inside it.
- **Keep:** stays as it is, for the reason given. Most of these are rules, commitments or legal
  text. Drawn as pictures they would lose precision and gain nothing.

### Welcome and platform

| Block | Chapter / heading | Contents | Plan |
|---|---|---|---|
| `welcome.md:7` cards | Welcome · What's inside | 8 things in the platform | **Improve:** a D1 icon per card, and Save as image (E4). |
| `welcome.md:24` stepper | Welcome · Your first ten minutes | 5 steps | **Keep:** already a sequence, and short. |
| `welcome.md:35` checklist | Welcome · Why it helps | 5 benefits | **Keep:** claims about the platform. A picture adds nothing. |
| `platform.md:21` stepper | The platform in one view | Edit, check, live, revert | **Keep:** already the right shape. |
| `platform.md:31` cards | The platform in one view | 6 jobs and their chapters | **Keep:** navigation, not data. |
| `platform.md:43` checklist | The platform in one view | What Firefly runs | **Keep:** commitments. |
| `brief.md:10` stats | The case on one screen | 1 stat: voters in the pool wards | **Improve:** `BigNumber` with a **C24 locator mini-map** shading the 21 pool wards. Save as image (E4: one-screen case summary). |

### The county (Kitui, needs, news, votes)

| Block | Chapter / heading | Contents | Plan |
|---|---|---|---|
| `kitui.md:11` stats | Who lives here | People, households, median age | **Keep**, with D1 icons. Three unrelated measures don't make an icon array. |
| `kitui.md:40` stats | The land and its three regions | Sixth-largest, % rural | **Improve:** C24 mini-map of the county in Kenya beside the stat. The **C15 scroll map story** opens in this chapter (the home of Map Studio). |
| `kitui.md:84` checklist | How the county is run | 4 county departments | **Keep**, with D1 icons (borehole, clinic, road, coin). |
| `needs.md:11` stats | How households live | Poverty, safe water, electricity, offline | **Replace with C13 people icon array:** four 10 × 10 grids, one per measure, each person one per cent, value and tier in the label. |
| `needs.md:46` stats | Water | Basic service, under 30 min, water points down, walk time | **Replace with C9 jerrycans:** rows of 10 cans (full against empty) for the three percentages. Walk time stays a number, because minutes are not a share. |
| `needs.md:103` stats | Food, farming and drought | Cattle, poultry | **Keep.** The **C10 goats** visual sits beside it (see section 4 for its reduced form). |
| `needs.md:196` stats | The cost of living | Food share, poverty, maize price, clean fuel | **Improve:** the two shares as zero-based proportion bars, maize price kept as a number with the maize icon. |
| `news.md:9` stats | Where people get information | Internet use, offline, phone ownership, money agents | **Replace with C13 people icon array** (phone, no phone, online) for the three county shares. The national agent count stays a stat, because it is a different unit. |
| `news.md:58` checklist | Who owns the airwaves | The three facts behind the radio plan | **Keep** the text. **B1 radio set** goes beside it. No owner is named: the data already says "politically affiliated ownership". |
| `news.md:148` cards | Reaching the offline majority | Radio, SMS/USSD, money agents, markets, churches | **Improve:** D1 icon per channel, and **A3 feature phone** beside the SMS/USSD card. |
| `votes.md:9` stats | The electorate and polling stations | Register 2022, wards, stations, register 2026, turnout | **Improve:** keep the stats, add the **C14 human chain** only if you want it (low value, see section 4). The 2026 figure keeps its Tier 3 label. |
| `votes.md:70` stats | The twelve largest wards | Share in the top 12, top 20, bottom 10 | **Replace with C7 battery bar:** "the register is 38% charged by 12 wards", stacked from zero, top 12, next 8 and the rest, with the bottom 10 marked. Every share is labelled calculated. |

### Diagnosis, goal and message

| Block | Chapter / heading | Contents | Plan |
|---|---|---|---|
| `known.md:15` stats | Where he is known, and where not | Pool voters, 5 of the 12 largest | **Improve:** C24 locator mini-map of the pool, and C1 league-table rows for the five large pool wards. |
| `known.md:63` cards | What his online presence shows | 3 outputs of the audit | **Keep:** describes work not yet done. |
| `diagnosis.md:53` cards | The assumptions the plan rests on | 11 assumptions | **Keep:** argument text, and the Assumptions Panel already tests them. |
| `goal.md:29, 46, 63, 81, 99` cards ×5 | Five objectives | One objective card each | **Keep.** Targets have no reading yet, and a gauge sitting at zero would show false data (`MOTION-SYSTEM.md`, rule 3). |
| `message.md:39` cards | One claim, three pillars, six themes | 3 pillars | **Keep**, with D1 icons. These are the pillars **A5 before and after** writes to. |
| `message.md:68` cards | Same | The needs-weighted formula, settled | **Keep:** one decision, with the allocation simulator beside it. |
| `message.md:93` cards | Same | 6 themes | **Improve:** D1 icons (jerrycan, maize, coin, phone, clinic, school). |
| `message.md:178` cards | Discipline and persuasion principles | 8 principles | **Keep.** Each already folds its body. A "Did you know?" reveal would only repeat the fold. |

### Voters, channels, the week

| Block | Chapter / heading | Contents | Plan |
|---|---|---|---|
| `channels.md:15` stats | Where the effort goes | % of reach effort and SMS onboarding in the pool | **Improve:** two zero-based share bars with the pool's share of the register marked as a reference line. That line is the comparison the text makes. |
| `channels.md:74` cards | The radio gatekeepers | 3 risks on air | **Keep:** argument text. |
| `channels.md:128` cards | Which language reaches which voters | Kikamba phrases and forms | **Keep.** These are the only finished Kikamba lines on the site, and the **A4 language switch** reuses them. |
| `channels.md:159` cards | Register, dialect and quality control | Language rules | **Keep:** rules. |
| `channels.md:183` cards | Platform playbooks | 7 platforms | **Improve:** **A2 swipe between apps** sits above the cards. Swiping the phone to a platform opens that platform's card. |
| `week.md:28` checklist | The weekly rhythm and approvals | 3 duties | **Keep.** **B12 clipboard memo** (the weekly brief) sits in this chapter. |

### Engagement, timeline, workstreams

| Block | Chapter / heading | Contents | Plan |
|---|---|---|---|
| `engagement.md:19` stepper | How the work is built | Analyse, Strategise, Direct | **Keep:** already a sequence. |
| `engagement.md:63` cards | Who owns what | 2 workstreams singled out | **Keep:** argument. |
| `engagement.md:192` cards | The strategy core, and Firefly's part | 3 roles | **Replace with B14 org chart:** the three roles as nodes over the four workstream groups. The card text moves into the node disclosures. Roles only, never people. |
| `timeline.md:87` checklist | Instrumentation phase · KPIs | 7 launch conditions | **Keep.** They carry no status. A progress card would invent one. |
| `timeline.md:202, 221, 239` checklist ×3 | Awareness, persuasion and mobilisation phases · Activities | 8–9 activities each | **Keep.** **C5 matatu route timeline** (the Gazette dates) sits at the top of the chapter and links to each phase. |
| `timeline.md:328` checklist | Endorsements and coalitions | 3 conduct rules | **Keep:** rules. |
| `timeline.md:338` stats | Same | 4 coalition targets | **Keep**, labelled "target" as now. |
| `workstreams.md:13` cards | The fourteen workstreams, in four groups | 4 groups | **Improve:** the B14 org chart's lower tier is these four groups, so the cards become its legend. |
| `workstreams.md:35, 47` checklist ×2 | Workstream groups | Workstream names | **Keep:** short lists. |
| `workstreams.md:90` checklist | Owned platforms and the service-delivery tracker | USSD, SMS, WhatsApp, web, ward champion | **Improve:** D1 icons, and the **A7 interactive USSD** phone beside it. |
| `workstreams.md:113, 130` checklist ×2 | Same | Tracker principles, four uses | **Keep:** rules. |
| `workstreams.md:154` checklist | The tracker's first questions | Q1–Q9 | **Keep.** These are open questions with no answers yet, so a reveal card would have nothing to reveal. |
| `workstreams.md:286` checklist | Creative testing and AI assistance | Testing rules | **Keep.** Its "30% / 70%" and "1.5% CTR" are literals in the text. Drawing them would first need them in the registry as targets. Say if you want that. |
| `workstreams.md:331` stats | Accessibility and inclusion | Women with no education, outside the internet | **Replace with C13 people icon array** (two 10 × 10 grids). |
| `workstreams.md:348` checklist | Accessibility · The commitments | 7 commitments | **Keep**, with D1 icons. |
| `workstreams.md:419` cards | Earned media, journalists and debates | Media tiers A–D | **Keep.** **B2 TV with ticker** and **B7 printed leaflet** sit in this chapter. |
| `workstreams.md:496` stats | Same | 5 earned-media targets | **Keep**, labelled "target". |
| `workstreams.md:553` cards | Ground-digital integration | What ward coordinators report | **Keep.** **B11 command map** goes here, the chapter where records are saved. |
| `workstreams.md:571` cards | Same | Boda stages, matatu routes, markets, barazas | **Improve:** D1 icons, and **B5 matatu screen** (a field-day route from the Voter Density Finder) beside them. |
| `workstreams.md:657` checklist | The field-to-digital loop | 3 data rules | **Keep:** rules. |
| `workstreams.md:733` checklist | SMS, USSD and voice · Operational discipline | 7 sending rules | **Keep.** A3 feature phone shows an SMS that obeys them. |
| `workstreams.md:785` cards | Same | Mobile-money agents | **Keep:** one card. |
| `workstreams.md:912` checklist | The data layer | 3 architecture principles | **Keep:** technical rules. |
| `workstreams.md:934` stepper | Predictive voter modelling | 4 stages | **Keep:** already a sequence. |

### Success, lawful, receives, annexes

| Block | Chapter / heading | Contents | Plan |
|---|---|---|---|
| `success.md:41` stepper | Scorecards for each stage | Weekly, monthly, polling day | **Improve:** **B4 smartwatch** beside it, showing KPI alerts from the KPI Ladder. |
| `success.md:67` cards | Recognition where he is least known | 5 indicators | **Keep:** no readings yet. |
| `success.md:117` cards | Why vanity metrics are left out | 3 reasons | **Keep:** argument. |
| `success.md:138` checklist | How the presence audit works | 8 audit dimensions | **Keep:** method. |
| `success.md:212` stepper | Same | 7 steps | **Keep:** already a sequence. |
| `lawful.md` ×7 (35, 57, 87, 128, 247, 257, 331) | Data protection, the charter, open items | Law, safeguards, review process | **Keep all.** Legal text must stay word-exact, and the brief excludes this area from downloads. |
| `receives.md:131, 176` checklist ×2 | What Firefly commits to · What the campaign provides | Terms and gated items | **Keep:** contract terms. |
| `annex-evidence.md:27` cards | The three source tiers | Tier 1–3 | **Keep:** reference. |
| `annex-evidence.md:67` checklist | The standard applied to our own measurement | 4 rules | **Keep:** method. |
| `annex-technology.md:84` checklist | The voter model · Data sources | 5 sources | **Keep:** reference. |

**Totals:** 7 replace, 17 improve, 58 keep. The improvements are concentrated in the county,
needs and votes chapters, where the numbers live. That is where a picture can carry the argument.
Most checklists are rules and commitments, and they are clearer as text.

---

## 3. Build plan, item by item

Effort: **S** up to half a day, **M** one to two days, **L** three days or more. "New dep" lists
any new package. **No item below needs a new dependency** unless you approve one in section 1.

Shared plumbing that several items use:

- **New visual kinds** go into `lib/visual.ts` (`VISUAL_KINDS` and `validateVisual`),
  `components/visual/VisualFence.tsx` (render), `lib/visual.test.ts` (tests) and
  `scripts/build-content.ts` (no change expected: it already resolves `{{tokens}}` for every kind).
  Each kind's numbers come only from `{{registry.tokens}}`.
- **Heavy visuals** mount through `components/LazyMount.tsx` with a measured `minHeight`, recorded
  in `data/section-heights.json` where the existing system expects it.
- **Motion** comes only from `lib/motion.ts` variants through `variantsFor()` and
  `useReducedMotionSafe()`.

### Part D1 and E1: shared foundation (PR 1)

| Item | Files | New components | New dep | Effort |
|---|---|---|---|---|
| D1 Kitui icon set (subject to Q1) | `components/icons/kitui.tsx`, `MOTION-SYSTEM.md` (one paragraph) | 12 icons: goat, jerrycan, matatu, radio, ballot box, borehole, maize, school, clinic, road, phone, feature phone | none | M |
| E1 Export-ready wrapper | `lib/card/spec.ts` (types), `components/visual/ExportableVisual.tsx` | `ExportableVisual` takes `{ id, title, figures: {id, tier}[], source, asOf, labels, view }` and renders its children. The same spec feeds the image route in Part E. | none | M |

The `CardSpec` contract: a visual never formats its own figure. It passes registry ids. Both the
page and the image route resolve them through `lib/data/read.ts`, so a tier label can't go missing
in one place and not the other.

### Part A: phone mockup (PR 2)

| Item | Files | New components | New dep | Effort |
|---|---|---|---|---|
| A1 Animated feed | `components/phone/screens/*Screen.tsx`, `components/phone/primitives.tsx` | `TypeOn`, `TickState`, uses `AnimatedNumber` | none | M |
| A2 Swipe between apps | `components/phone/PhoneShowcase.tsx`, `lib/phone-showcase.ts` | `PhoneCarousel` (pointer swipe with `SPRING`, dots, arrow-key support) | none | M |
| A3 Feature phone frame | `components/phone/FeaturePhoneFrame.tsx`, reusing `components/charts/FeaturePhoneSpecimen.tsx` and `data/ussd-specimen.ts` | `FeaturePhoneFrame` | none | M |
| A4 Language switch | `components/phone/LanguageSwitch.tsx`, `data/ussd-specimen.ts` (read only) | Switch. Only the USSD menu, the slogan and the pillar names have Kikamba on the site. Every SMS/post Kikamba and Kiswahili line is at approval Stage 2 by the file's own rule, so those show the switch disabled with "translation needed". | none | S |
| A5 Before and after (subject to Q6) | `components/phone/BeforeAfter.tsx` | Two `PhoneFrame`s, pillar chips on the "after" | none | S |
| A6 Lock-screen notifications | `components/phone/screens/LockScreen.tsx` | Stacked alerts, generic sender names | none | S |
| A7 Interactive USSD | `components/phone/screens/UssdScreen.tsx`, `components/tools/kit/content.tsx` (read the USSD Flow Builder's menu) | Keypad state machine, a 182-character counter that blocks over-long screens | none | M |
| A8 WhatsApp Status and Channel | `components/phone/screens/WhatsAppScreen.tsx` | `StatusView`, `ChannelView` | none | S |
| A9 Tap hints (subject to Q2) | `components/phone/primitives.tsx` | `TapHint`: three pulses, then stops, and remembered once used (`localStorage`, wrapped in `try`) | none | S |

Every screen keeps `IllustrativeTag`. No new likeness is added beyond what the existing screens have.

### Part B: new devices and scenes (PR 3)

All are built on a shared `DeviceFrame` extracted from `PhoneFrame` (bezel, screen inset, tag slot),
so the phone, feature phone, laptop, tablet, watch and TV share one system.

| Item | Files | Data | Effort |
|---|---|---|---|
| Shared `DeviceFrame` | `components/devices/DeviceFrame.tsx`, `components/phone/PhoneFrame.tsx` (refactor to use it) | none | M |
| B1 Radio set | `components/devices/RadioSet.tsx` | 8 stations from the Radio Planner (`radio.*` figures, `data/media-ownership.ts`). Ownership is shown as the data has it. **No audio:** there is no recording, and making one would invent a script read as real. Captions-only "script" panel, labelled illustrative. | M |
| B2 TV with ticker | `components/devices/TvSet.tsx` | A generic channel name ("County Channel"), with no real station's look. Ticker items are site figures with tiers, never invented headlines. | S |
| B3 Laptop and tablet | `components/devices/Laptop.tsx`, `Tablet.tsx` | Existing dashboard and workspace screens | S |
| B4 Smartwatch | `components/devices/Watch.tsx` | KPI Ladder targets (`data/kpis.ts`), labelled "target" | S |
| B5 Matatu screen | `components/devices/MatatuScreen.tsx` | Voter Density Finder output (`data/kitui-stations.generated.json`) | M |
| B6 Billboard on a street scene | `components/scenes/Billboard.tsx` | An illustrated generic Kitui street (SVG). The message is the Message Studio text. | M |
| B7 Leaflet and newspaper page | `components/scenes/Print.tsx` | Leaflet: yes. Newspaper: **only as a paid advert placement** with a generic masthead, never as a news article, because a mock article reads as fabricated coverage. | M |
| B8 Illustrative ballot paper | `components/scenes/Ballot.tsx` | No names, photos or symbols. **The site has no voting-process steps to illustrate.** I need the steps from you, or a source to cite, or this item drops. | S |
| B9 Terminal screens | `components/terminal/screens/{DroughtWatch,RegisterGrowth,ContentPerformance}Screen.tsx`, `data/terminal-showcase.ts` | Drought and register figures exist. Content Performance has no readings yet, so it shows targets and "awaiting first export". | M |
| B10 Ticker bar (Q2) | `components/premium/TickerBar.tsx` | Tier 1 and 2 figures for the chapter | S |
| B11 Command map (Q2) | `components/register/CommandMap.tsx`, reuses `TileMap` geometry, reads saved `implementation` records | One ripple when a record is saved. If the records aren't public, it shows the last-saved state for signed-in users only. | M |
| B12 Clipboard memo | `components/workspace/BriefMemo.tsx` | The `briefs` collection (`lib/platform/collections.ts`) | S |
| B13 Kanban | `components/workspace/Kanban.tsx` | The `implementation` collection, grouped by `status`. Read-only on the story page. | M |
| B14 Org chart | `components/devices/OrgChart.tsx` | Roles from `engagement.md` and the workstream groups. Roles only, no personal names. | M |

### Part C: data visuals (PR 4, split by chapter)

| Item | Where | Files | Data | Effort |
|---|---|---|---|---|
| C1 League table | `known.md`, Ward Dossier | `components/dataviz/LeagueTable.tsx` | `ward.*` (40, T1). "Up/down" arrows need a second year at ward level. There is none (2026 is county-only, T3), so **no arrows**: position, voters and the gap to the ward above. | M |
| C2 Weather forecast + C11 rain gauge | `needs.md` Food, farming and drought | `components/dataviz/DroughtForecast.tsx` | **Drought phase is countywide only.** One forecast card for the county, with the phase as the weather, and a 5-step gauge marked by phase name (ordinal, not a quantity). Sub-county cards need NDMA sub-county data. | M |
| C3 Receipt | County Money Explainer, `needs.md` | `components/dataviz/Receipt.tsx` | `budget.*` per resident (calculated, labelled) | S |
| C4 Report card | — | — | **Recommend skip.** There is no grading scheme, so the grades would be my invention. The C23 heat table shows the same data without pretending to grade it. | — |
| C5 Matatu route timeline | `timeline.md` top | `components/dataviz/RouteTimeline.tsx` | Governor Race Calendar CSV | M |
| C6 Tear-off countdown | `timeline.md` | wraps `components/premium/Countdown.tsx` | Same CSV | S |
| C7 Battery bar | `votes.md` twelve largest wards | new visual kind `battery` | `pareto.*` (T1, calculated) | S |
| C8 Boarding pass | Voter Density Finder, Polling Agent Planner | `components/dataviz/FieldPass.tsx` | Station data plus a QR code to the ward link | S |
| C9 Jerrycans | `needs.md` Water | visual kind `pictogram` (icon: jerrycan) | `water.*` (T1) | M |
| C10 Goats | `needs.md` beside livestock | `components/dataviz/GoatPrice.tsx` | **No time series exists.** Only the latest goat price (`price.goat`) and its average (`price.goat.average`). Two goats, area to scale (the side scales as the square root of the ratio). | S |
| C12 Ballot box filling | `winning.md` | `components/dataviz/BallotBox.tsx` | Coalition Path Builder per-constituency votes (modelled). The fill is stacked by constituency, so it is to scale. | M |
| C13 People icon array | `needs.md`, `news.md`, `workstreams.md` | visual kind `pictogram` (icon: person) | Census and CA shares | M |
| C14 Human chain | `votes.md` | — | **Low value:** it repeats the register as decoration. Recommend skip. | — |
| C15 Scroll map story | `kitui.md` | `components/dataviz/MapStory.tsx`, reuses `components/register/TileMap.tsx` layers | Map Studio layers. Under reduced motion all four layers show as small multiples. | L |
| C16 Ward skyline | `votes.md` | `components/dataviz/WardSkyline.tsx` | `ward.*`. SVG isometric with an **orthographic** projection only, because perspective makes far bars look shorter and breaks rule 5. A flat sorted bar sits behind a toggle. No 3D library. | M |
| C17 Racing bars | — | — | **Skip.** No 2017 ward or constituency register, and no 2026 ward register. The races by candidate would show current rivals. | — |
| C18 Waterfall | `winning.md` | visual kind `waterfall`, reusing `ResourceEnvelopeChart`'s step logic | Eight constituency contributions to the winning number (modelled) | M |
| C19 Sankey | — | — | **Skip.** There is no zone × segment breakdown of votes. A Sankey would invent the flows. | — |
| C20 Split slider 2022/2026 | — | — | **Skip.** 2026 exists only as one county total (T3). A slider over one number says less than the Register Growth Tracker already does. | — |
| C21 Slope chart | — | — | **Skip.** No 2017 constituency results are in the record. | — |
| C22 Lollipop | `spend.md` | `components/dataviz/Lollipop.tsx` | Ward Equity spend per 1,000 voters (calculated) | S |
| C23 Heat table | `spend.md` / Ward Comparison | `components/dataviz/HeatTable.tsx` | 40 wards × voters, stations, density, project spend. Per-column scales, labelled. | M |
| C24 Locator mini-map | Every ward-level visual | `components/dataviz/Locator.tsx` (≈ 2 kB of path data from `public/geo`) | Geometry only | S |
| C25 Chat explainer | `news.md` (the offline majority) | `components/phone/screens/ChatExplainer.tsx` | Two generic voters, every number from the registry, labelled illustrative | S |
| C26 "Did you know?" | `brief.md` | `components/dataviz/RevealCard.tsx` | Question first, answer and source on tap | S |
| C27 Scenario dial | `winning.md` | `components/dataviz/Dial.tsx`, wired to the Winning-Number Simulator state | Turnout, youth turnout. Keyboard and screen-reader operable (`role="slider"`). | M |

### Part D: polish (PR 6)

| Item | Files | Effort |
|---|---|---|
| D1 icon sweep | Replace emoji and mixed icons in visuals with D1 or Lucide (`grep` for emoji ranges across `components/`) | S |
| D2 Number transitions | Every tool figure through `components/visual/AnimatedNumber.tsx` (`components/tools/kit/*.tsx`) | M |
| D3 Audio | Nothing to do if B1 ships without audio, as recommended. | — |
| D4 Loading | `LazyMount` around C15, C16, B1, B11, with skeletons sized from `data/section-heights.json` | S |
| D5 Contrast and sharpness | Re-run the measured pairs in `AUDIT-POLISH.md` for every new colour pair. All new graphics are SVG. | S |

### Part E: image downloads (PR 5)

| Item | Files | New dep | Effort |
|---|---|---|---|
| E2 Image route | `app/api/card/[type]/route.tsx` (`runtime = "nodejs"`, `next/og` is part of Next), `lib/card/formats.ts` (chat 1080×1350, status 1080×1920, square 1080×1080, a4 2480×3508), `lib/card/qr.ts` (existing `qrcode` package, SVG string to data URI), `app/api/card/_fonts/*` (Q5) | none | L |
| E3 Templates 1–18 | `lib/card/templates/*.tsx`, one per template, each taking a `CardSpec` | none | L |
| E4 Save as image button | `components/tools/public/ToolActions.tsx` (beside Download CSV), `components/tools/public/SaveImage.tsx` (format picker, preview `<img>`, `navigator.share({ files })` with download fallback) | none | M |
| E4 URL state | Each listed tool reads and writes its state in the query string, so the image and its QR code point to the exact view. **This is the largest hidden cost of Part E:** today most tools keep their state in memory. | none | L |
| E5 Share previews | `generateMetadata` in `app/(platform)/tools/[tool]/page.tsx` and `tools/ward-dossier/[code]/page.tsx`, pointing `openGraph.images` at `/api/card/…`. In-chapter tool views live behind a `#hash`, which WhatsApp never sees, so share links use `/tools/<slug>?…`. | none | S |
| E6 Status animations | Not planned until everything else ships, as the brief says. | — | — |

**Constraints I will hold the templates to:**

- **Text never under 28 px at 1080 wide.** At that size a 1350-tall card fits about 14 table rows.
  So the league table and roster cards show the top 12 plus the reader's ward, and the full 40 go
  out as a carousel set ("1/4" … "4/4"). The choropleth map card carries no in-map labels: a
  legend, plus a top-five list.
- Every card: title, figures with tier labels, source and date, "Built by Firefly Management", the
  site link and a QR code to the exact view.

**E4 placement, with two changes to your list:**

- **Swing Viewer: skip.** It shows the 2017 and 2022 governor results by candidate, and those
  include candidates who are declared 2027 rivals. The tool can stay on the page as history (as
  `DECISION.md` allows), but a shareable image would put a current rival's name into circulation.
- **Service-Delivery Tracker:** one card per project, as asked. Projects carry no personal data,
  so this is safe.

Everything else on your E4 list is buildable as written.

---

## 4. What I think is wrong, unsafe or not worth building

1. **Five Part C visuals have no honest data:** C17 racing bars, C19 Sankey, C20 split slider and
   C21 slope chart lack a second year or a breakdown. C4 report card has no grading scheme. Building
   them would mean inventing data. **Recommend skipping all five.** C2 (weather) and C10 (goats) are
   buildable only in the reduced county-wide and two-point forms described above.
2. **C14 human chain and C16 skyline are mostly decoration.** C14 restates one number. C16 is fine
   only in orthographic projection with a flat fallback. I'd build C16 last and drop C14.
3. **B8 ballot paper:** the site has no voting-process steps. Without a source this adds unsourced
   content.
4. **B7 newspaper page:** only as a paid-advert mock. A fake news article is the kind of
   "presents itself as real" content the brief forbids.
5. **B1 audio:** no recording exists. Captions-only, with no audio player.
6. **A4 language switch** will be mostly disabled, because almost no message copy is translated
   and approved. That is honest and correct, but you should expect it.
7. **Ticker, command-map pulse and tap hints** break the three-loop motion budget as written. See
   Q2 for versions that don't.
8. **Hard-coded literals inside existing blocks** ("30% testing, 70%", "1.5% CTR", and the
   objectives' "15 Mwingi wards and 6 Kitui South wards") predate this brief. I won't draw any of
   them until they are registry figures. Adding them as `target` figures is a small data change I
   can include if you approve.
9. **"No document numbering":** headings already hide their numbers. Two kinds remain in the
   content: the campaign's phase names (Q3) and in-text cross-references like "(Section 6.2)",
   which `SectionNumberMap` renders as heading names. I won't touch either in this upgrade unless
   you ask.
10. **E4 URL state is the real cost of Part E.** The image routes are fast to build. Making 25
    tools restore their exact view from a link is not. I'd do it tool by tool in priority order,
    top-priority tools first.

---

## 5. Build order (one pull request each)

1. **Foundation:** D1 icons (after Q1) and the E1 `ExportableVisual` and `CardSpec`.
2. **Phone:** A1–A9 and the shared `DeviceFrame`.
3. **Devices and scenes:** B1–B14, minus any you drop.
4. **Data visuals, chapter by chapter:** (a) votes and known: C1, C7, C16, C24; (b) needs and
   news: C2/C11, C9, C10, C13, C25; (c) winning and spend: C12, C18, C22, C23, C27; (d) Kitui and
   timeline: C15, C5, C6, C26.
5. **Image downloads:** E2, E3, E4 (top priority first), E5.
6. **Polish:** D2, D4, D5, and the D1 sweep.

## 6. Checks run before each pull request

- `npm run lint`, `npm run build`, `npm run verify`, `npm run check:preservation` and the tests, with
  no new warnings. No reference or snapshot file is edited to force a pass.
- `grep` of changed files for every 2027 rival name in the rivals ledger, for `\b\d+\.\d+\b` in
  user-facing strings, and for numeric literals in new components (`scripts/consolidation/scan-literals.mjs`
  already covers content). For images, the check runs on every template's rendered text input,
  because PNGs can't be searched directly. Results pasted into the pull request.
- Playwright screenshots at 390 × 844 and 1440 × 900, light and dark, plus reduced motion, for each
  new visual.
- One image per template per format, checked for legibility and for tier and source labels. The
  QR codes are decoded with Chromium's built-in `BarcodeDetector` in the Playwright run, so no
  decoder package is needed. Where it is unavailable, I scan them by hand with a phone.
- Pictograms checked to scale (area ratios asserted in unit tests). Every bar starts at zero.
- Lighthouse mobile on a local production build of `main` against the branch (Q7).
