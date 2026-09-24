# Phase 0 recon: where the branch stands, the mapping, the visual system, and the conflicts

Against `kitui-rebuild-prompt.md` (*Kitui 2027 — Complete Rebuild Prompt*), Phase 0, step 9.
Branch `claude/kitui-2027-rebuild-m7aij6` at `a089642`. Written 23 September 2026.

Nothing in Phases 1–5 has been started by this pass. The brief says stop here and wait for approval,
so this document stops here. It supersedes `docs/rebuild/PHASE-0.md`, which was written against an
earlier brief on a different branch. That file stays for its history, but its facts are re-checked
below, and two of them have since changed.

---

## 0. Summary

1. **About half of Phase 1 has already landed on this branch.** The six-part order, the section
   titles and most subsection titles from brief §C are already in `public/content/`
   (`objectives.md`, `data.md`, `analysis.md`, `strategy.md`, `implementation.md`, the four
   `workstreams-*.md`, `delivery.md`, `nextsteps.md`), and the new annexes C and G exist. The
   rebuild is a completion and repair job, not a start from nothing.
2. **The branch does not build.** `next build` fails on HEAD with a type error in
   `components/StateOfTheRace.tsx:1` (an import declaration where every import is unused). A
   Vercel preview of this branch would fail to deploy. Six of the repo's eleven build guards also
   fail (§5).
3. **The last two commits (`3666b5a`, `a089642`) brought in figures that disagree with the
   sourced data layer.** Three matter:
   - **§2.5 budget.** The live text reads *KSh 12.38bn = 10.44 + 1.00 + 0.94*. The sourced
     record (`data/analysis/county-finance-2026-27.json`, CFSP FY2026/27 [S47, S48]) reads
     **KSh 13.79bn = 11.64 equitable + 1.12 own-source + 1.04 grants**, which leaves a
     **0.01bn rounding gap**, the segment brief §N asks for. No source in the repo carries the
     12.38 set. Its percentages (84.3 / 8.1 / 7.5) are the sourced set's shares. Its own
     own-source share would be 7.6%. **The sourced data wins.**
   - **605,703 tier.** `data/electoral-arithmetic.ts` labels it *"T3 uncertified"*.
     `analysis/config/assumptions.yaml` (`register.y2026_july`) has it as **Tier 1, CONFIRMED**,
     read off the IEBC ECVR county annex [S3]. **The sourced data wins: T1.** This settles
     consistency fix 5.
   - **Top-12 ward total.** `electoral-arithmetic.ts` has `top12WardsVoters: 201385`. Summed
     from `data/ward-register.json`, it is **201,267 (37.78%)**.
4. **Poll shares have come back into the argument.** Poll or pollster terms are in 14 of the 18 live files
   outside Annex C (§4), including a *"15.3 points behind"* in §3.9 and a *"40.0%+"* threshold in §5.6.
5. **Six ASCII diagrams are back in live content.** PR #12 had retired all of them into figures.
   The same six figures still exist in the registry, so converting them means pointing the
   content back at those figures (§3).
6. **Production could not be measured.** The session's network policy blocks
   `dr-makali-digital-campaign.vercel.app` (proxy CONNECT 403). The "before" numbers in §7 are
   from a local production build of the last merged commit, `6af5d18` (#12), on throttled mobile.
   This is a stand-in for production, not a production measurement.

---

## 1. Old → new mapping, against what is on disk

`✓` means the heading is in place at its new number. `△` means the content is there but out of
shape, and the note says how. `✗` means it is missing.

### Cover and §1

| Target | State | Where it is now / what's wrong |
|---|---|---|
| Cover: title, prepared for/by, date, one-line confidentiality | △ | `cover.md` is titled *"CAMPAIGN STRATEGY & DIGITAL ARCHITECTURE PROPOSAL"*, not the brief's cover title. It also sits **at the end** of `FLOW_ORDER`, as a colophon |
| Four cover figures | △ | `HeroVisual` / `StateOfTheRace` / `MiniScorecard` carry them in part. `StateOfTheRace` still imports poll constants, and that import is what breaks the build |
| 1.1–1.5 | ✓ | `objectives.md`; 1.3 has five sub-objectives, 1.3.1–1.3.5 |
| 1.5 "not poll shares" | △ | The 1.5 prose is clean, but it links to §5.6, which still carries a 40.0% share threshold and a tracking-poll design (§5.6.5) |

### §2 The Data (`data.md`)

| Target | State | Note |
|---|---|---|
| 2.0 standfirst | ✓ | |
| 2.1 electorate | △ | Contains the full 40-ward table. The brief puts that table in **Annex B**, with a summary in 2.1 |
| 2.2 results | ✓ | |
| 2.3 nomination | △ | 2.3.2 *"Where the opinion-poll mechanism stands"* carries the method, which is fine. The poll **shares** in it go to Annex C |
| 2.4 people | ✓ | |
| 2.5 budget | ✗ figure | Wrong figures. See §0.3 |
| 2.6 connectivity | △ | Subheadings still numbered **3.1.1.1–3.1.1.3**, left over from an old chapter. The *"remote family influencers / active campaign donors"* line is at `data.md:172`, and non-negotiables 2 and 3 cut it |
| 2.7 media | ✓ | |
| 2.8 record | ✓ | |
| 2.9 channels | ✓ | |

### §3 The Analysis (`analysis.md`)

| Target | State | Note |
|---|---|---|
| 3.1–3.3 | ✓ / △ | 3.3 Path B margin is register minus a vote threshold. See conflict 3 |
| 3.4 | △ | Section heading is right. The *"Candidate Recognition Baseline"* block still has to be checked for poll-derived recognition figures |
| 3.5 | △ | Stage-one/stage-two framing. Needs rebuilding on certified results only (brief §C cut table) |
| 3.6–3.7 | ✓ | |
| 3.8 | △ | Subheadings still numbered **3.1.2.1–3.1.2.5**. 3.8.2 "operating conditions" duplicates old §2.3, which the brief cuts |
| 3.9 | ✓ | The **six profile issues are all here** (table, `analysis.md:405–412`). Issue 6's explanation cites *"15.3 points behind"*; that clause goes |
| 3.10 | △ | Item 1 quotes Mizani shares (poll → Annex C). 3.10.1 says gaps are *"catalogued for commissioning in the Phase −1 baseline survey"*, a promise of new polling that non-negotiable 1 forbids. Each gap gets its closing document instead |
| 3.11 | ✓ heading | |

### §4 The Strategy (`strategy.md`)

| Target | State | Note |
|---|---|---|
| 4.1 | △ | Seven subsections (4.1.0–4.1.6), carried over from old §2.1 and §6. The mandate prose (4.1.0) is a **cut**, apart from the M&E/verification asset |
| 4.2–4.6 | ✓ | Money language concentrated here: 52 hits for budget/spend/cost/fee/price/KSh, mostly in 4.3 and 4.6. 4.1 KSh county figures are exempt |
| 4.7 | △ | The heading exists, but its body is the Page-vs-profile question. **The six fixes are in the §3.9 table's "Fix" column.** Move the fix column into 4.7, keep findings in 3.9, and put the PhD fix first |
| **4.8 When the plan changes** | ✗ | Missing. Source: old `presence.md` §1A.4 (still on disk) |
| "Because" links on every §4 strategy | ✗ | None yet |

### §5 Implementation

| Target | State | Note |
|---|---|---|
| 5.1 | ✓ | `implementation.md`. 5.1.4 *"How the levels change what runs"* and 5.1.6–5.1.7 carry scope-level (LEAN/STANDARD/PREMIUM) material |
| **5.2** heading + 5.2.1–5.2.4 groups | △ | The brief wants 5.2 with four groups: 5.2.1 Platforms and content through 5.2.4 Data and technology. On disk, **5.2.1–5.2.14 are the fourteen workstreams**, one number each, split across four files. So the brief's four group numbers are already taken by workstreams 1–4. See conflict 7 |
| 5.3–5.4 | ✓ | `implementation.md` |
| 5.5 | △ | `delivery.md`: *"The three scope levels — LEAN / STANDARD (recommended) / PREMIUM"* is a tiered offer, the shape of a price sheet without prices. Keep it as an **engagement-depth comparison** (fig-5-5-cadence allows that) and check it for cost language |
| 5.6 | ✗ content | 5.6.4 *"Re-anchored: recognition and persuasion"*, 5.6.5 *"Nomination Window Tracking Poll Design"* and the 40.0% line at `delivery.md:162` all break non-negotiable 1 |
| 5.7–5.9 | ✓ | 5.8.14 carries the delegate-primary contingency |

### §6 Next steps (`nextsteps.md`)

| Target | State | Note |
|---|---|---|
| 6.1–6.3 | ✓ | `nextsteps.md:244` still quotes *"15.3-point deficit … (Mizani Africa…)"* |

### Annexes

| Target | State | Note |
|---|---|---|
| A Evidence standard | △ | `annex-evidence.md` still headed **3.2 / 3.2.1** rather than A.1. It holds three of the six ASCII diagrams |
| B County reference | △ | Headed **3.3.7, 3.3.8, 3.3.10** (3.3.9 missing). The 40-ward list has to move in from 2.1 |
| C Polls | ✓ | C.3 *"Kitui Central's weight in the vote"* is not a poll. It is register arithmetic and belongs in 3.6 |
| D, E, F, G | ✓ | |

### Old files and routes still present

`situation.md`, `arithmetic.md`, `reach.md`, `audiences.md`, `approach.md`, `engine.md`,
`messaging.md`, `scope*.md`, `roadmap.md`, `deliverables.md`, `measurement.md`, `governance.md`,
`risk.md`, `presence.md` and `summary`/`decision` are all still on disk. They are still in
`CONTENT_FILES` and still in `SECTIONS`, which holds 31 old entries beside the 10 new ones. They
are not in `FLOW_ORDER`, but they are statically generated as routes. That leaves a **second,
contradictory copy of the proposal** reachable by URL: `approach.md` says 13.79bn where `data.md`
says 12.38bn. Phase 1 retires them. Their headings go into the anchor map, the files are deleted,
and `SECTIONS`/`PARTS` shrink to the six parts plus annexes.

---

## 2. Visual system (draft)

### 2.1 Palette: keep it, rename it, add three things

The identity is token-driven (`app/globals.css`, `:root` / `.dark` / a print "parchment" theme)
and already carries the brief's colour roles:

| Brief role | Token today | Keep / change |
|---|---|---|
| Neutrals | `--ink`, `--muted`, `--paper`, `--card`, `--line` | Keep |
| Accent: Dr. Mulu only | `--accent` (text/stroke) / `--accent-solid` (fill) / `--on-accent` | Keep the values. Strip *"Wiper Official Royal Blue"* from the comments (no party colours) |
| Rival neutral family | `--rival` / `--rival-solid` | Keep |
| Second warm hue | `--gold` (*"Wiper Official Earth Red"*) | Rename the role to **`--contrast`** (the categorical pair to the accent: blue and orange-red, a pair safe for colour-blind readers). Values unchanged |
| Semantic | `--verified-*`, `--estimate-*`, `--unmeasured-*` | Keep, but for **status only** (alerts, [DATA NEEDED] banner) |
| Categorical data | `--align-a/b/c` + accent + rival | Add **`--cat-1…--cat-8`** for the eight constituencies. The eight-hue set has to pass a CVD simulator in both themes; Phase 3 generates and checks it |
| Sequential | none | Add **`--seq-1…--seq-5`**, one blue hue from light to dark, for register size and effort. Values printed in the cells |
| Diverging | none | Add **`--div-neg` / `--div-mid` / `--div-pos`**, orange ↔ neutral ↔ blue, for deviation from 200,000 |

Three data states as SVG `<pattern>` defs shared by every chart: **sourced = solid fill**,
**modelled = 45° hatch**, **needed = dashed outline, no fill, with the `[DATA NEEDED — source]`
label**. The three are told apart by pattern, not hue, so they survive greyscale.

**Dark theme.** `--paper` is true black `oklch(0 0 0)` today. The brief asks for raised surfaces
slightly lighter than the page, so cards go to about `oklch(0.17 0.01 250)` with `--paper` at
`oklch(0.12 0.01 250)`. `--gold` dark is `oklch(0.68 0.21 22)`, saturated brand colour on
near-black and the failure brief §E.2 names. It drops to about 0.15 chroma. Every pair is
re-measured in Phase 4 (`scripts/audit-routes.mjs` already runs axe on every route).

### 2.2 Type

The site loads three families: Montserrat, Newsreader and JetBrains Mono. The brief allows two.
**Proposal:** Montserrat (variable) for UI, headings and numbers, and Newsreader for body prose.
JetBrains Mono comes out once the ASCII blocks are gone (its byte cost is measured in Phase 4).
Scale ratio **1.25**; body 17 px, line height 1.55, measure 68ch. `tabular-nums` in every table
and chart label. **No tracked-out ALL-CAPS eyebrows.** Several content headings are in caps
(*"The Defining Digital and Telecommunications Constraints"*, *"LEAN"*) and go to sentence case.

### 2.3 Spacing and grid

4/8 scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. Columns 12/8/4, gutter 16 (mobile) to 32 (desktop),
content maximum 1200 px, reading column 68ch. One grouping method per surface: whitespace first,
hairline border second, no gradient washes.

### 2.4 Chart grammar: one `FigureFrame`, required props

`components/figures/FigureFrame.tsx` already provides the title, source line, tier badge and a
"View the data" table. Brief §E.8 and §O add the rest, and all of it becomes required props, so a
figure that omits one fails `tsc`:

```
<FigureFrame id title question takeaway source tier rows columns>
  {svg}
</FigureFrame>
```

- The table lives in a native `<details>`, which works with JS off and is opened for print by one
  `beforeprint` listener.
- The CSV is **emitted at build** to `public/data/<id>.csv` and linked with a plain `<a download>`.
  There is no API route, and the filename shows on focus.
- `TierBadge` distinguishes tiers by shape: T1 solid pill, T2 outlined pill, T3 dashed pill.
- Takeaway: one sentence, directly beneath the figure.

### 2.5 The tile map

**`lib/geo/wards.ts` can be populated for all 40 wards and all seven appearances.** The data
comes from `data/ward-register.json` (40 wards, 8 constituencies, IEBC 2022, T1, reconciles to
532,758). The repo has **no ward boundary file**, so the map is tiles labelled **"Schematic, not
to scale."** Its first appearance also carries one line saying why tiles beat a choropleth for
Kitui, where ward areas vary enormously.

Layout (row, col), north to south, 8 columns × 9 rows:

```
rows 0–2  Mwingi North (5) · Mwingi West (4) · Mwingi Central (6)   — north
rows 3–5  Kitui West (4)   · Kitui Central (5) · Kitui Rural (4)    — middle
rows 6–8  Kitui East (6)   · Kitui South (6)                         — south
```

Within a constituency, wards are placed by register size, largest nearest the constituency's
centre. The map says so, so nobody reads ward position as geography.

Data by layer:

| Layer | Appearance | Data today |
|---|---|---|
| register | 3.2 | **Have**: T1 |
| footprint | cover, 3.4 | **Have**: derived. Kitui Central = held office (MP since 2013); the other 35 wards = never held office. The 275,570 pool is Mwingi ×3 + Kitui South (computed ✓) |
| party-flow | 3.6 | **Have**: MP party per constituency is in `data/competitors.ts`; still to check against the 2022 IEBC declared results |
| zones | 3.7 | **Have**: three zones from `analysis.md` §3.7 |
| effort | 4.2 | **Modelled**: `analysis/config/assumptions.yaml` zone weighting. Hatched |
| reach-targets | 5.6 | **Needed**: dashed empty tiles until the Week 1 export |

The existing `components/charts/WardTileMap.tsx` (389 lines, from `a089642`) is a client
component using `rgba()` literals, `toLocaleString`, and hard-coded label strings that fail
`verify-figures` (§5). It gets rebuilt as a **server-rendered SVG** with a small client layer
switcher, reading token colours only.

### 2.6 Motion

The repo has `framer-motion` **and** `motion` as dependencies. Brief §I.7 allows neither without
a measured justification. **Proposal: remove both.** Replace them with CSS transitions, the Web
Animations API and one shared IntersectionObserver (`lib/motion.ts` is the obvious home). Device
tiering and `saveData` go in the same module. The bytes saved count against the +25 kB ceiling.

---

## 3. ASCII and text-diagram inventory (live content only)

Six fenced text diagrams remain. Each already has a server-rendered replacement in
`components/figures/registry.tsx`, built in #12 and re-exposed by the two later commits.

| # | File:line | Shows | D.1/D.2 class | Web form | Existing registry id |
|---|---|---|---|---|---|
| 1 | `workstreams-platforms.md:44` | What happens to a service-delivery report | "First…then" → flowchart | stepper, horizontal → vertical | `delivery-tracker` |
| 2 | `workstreams-ground.md:99` | Field ↔ digital sync | Flow, two lanes | swimlane | `field-loop` |
| 3 | `workstreams-ground.md:225` | USSD menu tree (Kikamba/English) | Hierarchy | collapsible tree / phone specimen | `ussd-menu` |
| 4 | `annex-evidence.md:9` | Tri-partite provenance mandate | Comparison | comparison table | `provenance-mandate` |
| 5 | `annex-evidence.md:28` | Three-tier classification | Comparison | tier-badge table | `tier-classification` |
| 6 | `annex-evidence.md:58` | Four-step conflict protocol | "First…then" | stepper | `conflict-protocol` |

Inline `code` spans used as arithmetic (`analysis.md:143–144`, for example) are not diagrams.
They become the arithmetic line of fig-3-3-paths.

The **figure register (§N) needs 52 figures.** The registry holds 60 ids, but they are organised
by the old sections. About 20 map directly onto a register figure (`register-growth` →
fig-2-1-register, `threshold-build-up` → fig-3-1-funnel, `paths-to-threshold` → fig-3-3-paths,
`deficit-pool` → fig-3-4-footprint, `message-house` → fig-4-1-message-house, `org-chart` →
fig-5-9-team, and so on). The rest are new. Phase 3 produces the full id-to-id table.

---

## 4. Conflicts between this brief and the repo

Numbered so they can be answered by number. **Bold ones need a decision from you.** The rest I
will resolve as stated unless told otherwise.

1. **Build is broken on HEAD.** I will fix it in Phase 1, by removing the dead poll import, before
   anything else.
2. **§2.5 budget: 12.38bn (live text) vs 13.79bn (sourced).** The sourced record wins: 13.79 =
   11.64 + 1.12 + 1.04, with a 0.01 rounding segment. The Assembly's revised own-source revenue
   of **1.339bn** [S48] is a second value for the same line, so it is shown as a disputed pair,
   not collapsed. The total is T3/verify in the source JSON, so the badge reads T3 until the CFSP
   is cited directly.
3. **Path B's "+12,183 margin" subtracts a vote threshold from a register count.** 212,183
   registered voters is not 212,183 votes. At the 62% turnout constant the path yields about
   **131,550 votes**, or about **−68,450** against 200,000. That reverses the finding: Path B is
   short, not over. The old `arithmetic.md` had a third figure, 14,179. Consistency fix 3 says
   recompute from the model, so every path's margin becomes *model votes − 200,000*, with the
   formula printed on the figure. **This changes a headline finding in §3.3, so I am flagging it
   rather than just doing it.**
4. **Deficit-ward count (consistency fix 4) depends on what "never held office" means.** Top 12
   wards ∩ Mwingi + Kitui South pool = **5**. Top 12 ∩ every ward outside Kitui Central = **8**.
   The brief's own 51.7% figure uses the pool definition, and so do the objectives (`objectives.md:11`).
   **Proposal: pool definition, 5 of 12.** It is computed, not typed.
5. **605,703 tier.** T1, per the tier of the primary document cited (IEBC ECVR annex, S3). The
   "T3 uncertified" label in `electoral-arithmetic.ts` is wrong and gets corrected.
6. **Incumbency / Art. 180(7) (consistency fix 1).** `data/competitors.ts` states both readings
   and resolves neither. Brief rule: unclear → 5.8 only. **Goes to 5.8 as a two-branch risk,**
   and fig-5-8-risk shows the eligibility branch.
7. **§5.2 numbering.** The brief lists 5.2 with four *group* subsections (5.2.1 Platforms and
   content … 5.2.4 Data and technology). The repo numbers the fourteen *workstreams* 5.2.1–5.2.14.
   Both cannot hold. **Proposal: the brief's four groups become 5.2.1–5.2.4, and each workstream
   becomes 5.2.g.n** (Workstream 7 → 5.2.3.1, for example). Deep links to the current 5.2.x ids
   go into `ANCHOR_REDIRECTS`.
8. **5.5's three scope levels (LEAN / STANDARD / PREMIUM).** No prices appear, but it is the
   shape of a price sheet. **Proposal: keep it as the brief's "engagement-depth comparison" in
   fig-5-5-cadence, and cut any cost or fee wording.** If you would rather drop tiering entirely,
   say so.
9. **5.6.4–5.6.5 and the 40.0% / ≥55.0% thresholds.** Non-negotiable 1 and consistency fix 8
   remove them. The replacement indicators have to be observable: reach share by ward from Meta
   Insights, consented SMS contacts against 120,000, share-of-voice against rivals, and profile
   fixes shipped. **These are measures Firefly would be judged by, so please confirm the set**
   before I write it in.
10. **3.10.1 "commission in the Phase −1 baseline survey".** This is a promise of new polling and
    is removed. Each gap gets its closing existing document instead: KNBS agricultural census
    tables for pastoral sizing, TSC/county HR headcounts for the civil service, IEBC
    register-by-station for the diaspora.
11. **The cover title and position.** `cover.md` is titled *"CAMPAIGN STRATEGY & DIGITAL
    ARCHITECTURE PROPOSAL"* and sits at the end of the flow. The brief puts the cover first with
    its own title, and full terms in Annex G. I will do that.
12. **Portrait on the cover.** `public/portraits/` holds real photographs, which is allowed. The
    prior audit's D-8 kept the **share card** (OG image) typographic on purpose, so his face is
    not painted into every forwarded WhatsApp thread. **Proposal: portrait on the cover page,
    typographic OG card with the tile map.** Say if you want the portrait on the OG card too.
13. **Diaspora "campaign donors / remote influencers" line** (`data.md:172`). Campaign-finance
    material plus remote framing, so it is **cut**, not reworded.
14. **Brief §L.1 statistics** (23.4 m internet users, 40.5%, 77.5 m connections, 134%) are
    national figures that are not in the repo's data layer. Non-negotiable 5 bars an unsourced
    figure, so they either go into the data layer with a CA Q4-2025 citation or stay out of the
    site. They are only design context in the brief, so **I will keep them out of the site**.
15. **Vercel preview.** The session can't reach Vercel's deployment URL and has no project
    credentials. The Vercel connector is attached, so after pushing I will try to read the
    preview URL through it. If that fails, the preview appears in the PR's checks once a PR
    exists. The branch will not be merged.
16. **Mermaid (brief §D.5)** is not a dependency. Adding it at build is dev-only, so it costs 0 kB
    at runtime. But every diagram the brief lists already has a hand-rolled SVG in the registry.
    **Proposal: no Mermaid.** It would be a second diagram system beside the first.
17. **"Continue without stopping."** A previous instruction on this repo said not to stop for
    approvals, and this brief's Phase 0 says to stop. I have stopped, because items 3, 7, 8 and 9
    change what the document claims or commits Firefly to. **Answer those four and say "go", and
    I will run Phases 1–5 through to the report without stopping again.**

---

## 5. The repo's own guards, on HEAD

| Guard | Result |
|---|---|
| `verify-ward-register` | ✓ 40 wards, 8 constituencies, 532,758 |
| `verify-analysis-exports` | ✓ 9 exports, 96 values |
| `verify-figures` | ✗ 6 unsourced literals in `WardTileMap.tsx` |
| `verify-figure-fences` | ✗ |
| `find-duplicates --check` | ✗ |
| `verify-figure-retention` | ✗ (3.2) |
| `verify-content-integrity` | ✗ 97 lines lost, 3,301 added (the restructure was not logged as moves) |
| `verify-mounts` | ✓ 52 mounts |
| `verify-deep-links` | ✗ 11 legacy ids resolve to nothing |
| `visual-coverage --check` | ✓ |
| `next build` | ✗ type error, `StateOfTheRace.tsx:1` |

Brief §O asks for `scripts/check-figures.ts` and `scripts/build-anchors.ts`. They **replace**
`verify-figures.mjs` and `verify-deep-links.mjs` rather than sitting beside them, so there is one
guard per job. `verify-content-integrity` is retired in favour of `docs/rebuild/REPLACEMENTS.md`
plus the brief's removal rule. It was built for a verbatim-move restructure and cannot tell a
logged cut from a lost line.

**Anchor machinery:** `lib/heading-slug.ts` (1,177 lines) plus
`lib/legacy-ids.generated.json` (273 entries). Both named legacy anchors are present:
`decision-sec-0-1` and `situation-sec-3-1-5`. One of them currently points at a heading that no
longer exists. `build-anchors.ts` regenerates the map from the §1 mapping table and fails the
build on any orphan.

**Reading time:** the mechanism is `lib/reading-mode.tsx` plus `ReadingModeToggle`, with a
Brief/Full choice. Its header comment still says *63,433 words / 289 minutes*, which is stale.
Minutes are recomputed from the rebuilt content at build.

---

## 6. Consistency fixes: values from the data

| # | Value | Basis | Status |
|---|---|---|---|
| 1 | 5.8 only, two branches | `competitors.ts` states both readings | To apply |
| 2 | **26.2%** internet, **44.1%** phone (CA/KNBS 2023/24). 2019's 13.6% appears only in 2.6 | `electoral-arithmetic.ts` / `data.md` | Several live lines still say *"86% outside the internet"* (the 2019 complement, e.g. `analysis.md:399`). To fix |
| 3 | Every path margin = model votes − **200,000** | See conflict 3 | **Needs your nod** |
| 4 | **5 of the 12 largest wards** lie where he has never held office (pool definition) | Computed from `ward-register.json` | See conflict 4 |
| 5 | **T1** | `assumptions.yaml` `register.y2026_july`, S3 | Settled |
| 6 | Ward Captains, M-Pesa ambassadors, radio bookings, sound trucks, the 1,200 boda "Stage Champions" (`workstreams-ground.md`), and Workstream 10 → *campaign-owned, outside scope* in 5.1 | | To apply |
| 7 | "spend/budget" → "effort" in engagement sections; 2.5 and 2.8 exempt | | To apply |
| 8 | 40.0% removed | Unsourced; `assumptions.yaml` says `no_fixed_threshold: true` | To apply |

Every conflict in `docs/visual-audit/CONFLICTS.md` (C-1 to C-22) gets a row in
`docs/rebuild/CONFLICTS-RESOLVED.md` in Phase 2. C-1, C-2 and C-3 fall away with the slider.
C-4 is conflict 3 above, C-5 is conflict 4, C-6 is settled at 51.73%, and C-9 is conflict 5.

---

## 7. "Before" performance

**Substitute measurement, stated as such.** Production is blocked by network policy, and HEAD
does not build. Measured instead: a `next build && next start` of `6af5d18` (the last merged
commit, #12, the likely production build), Chromium via Playwright at 390×844 and DPR 2, with
150 ms RTT, 1.6 Mbps down and CPU slowed 4×.

| | `/` | `/full` |
|---|---|---|
| LCP | 2,056 ms | 2,140 ms |
| CLS | 0 | 0 |
| INP | not measurable without scripted interaction; Phase 4 measures it on the tile-map layer switch | — |
| First-load JS (Next) | **448 kB** | 448 kB |
| JS transferred | 487 kB | 487 kB |
| Total transferred | **766 kB** | **1,223 kB** |
| Page height at 390 px | **324,447 px** | 324,848 px |
| `noindex, nofollow` | present | present |
| `<h1>` count | 1 | **2** (fails J.4 "one H1") |

**Ceilings this sets:** first-load JS ≤ 448 + 25 = **473 kB**, total weight < 1.5 MB, LCP ≤ 2.5 s.
The brief's "JavaScript < 300 KB" line conflicts with the "baseline + 25 kB" line by about
175 kB. Removing framer-motion/motion (§2.6) is the lever. I will report against both
ceilings and not claim the 300 KB one unless it is met.

---

## 8. Assumptions (flagged, not verified)

1. The rebuild continues on this branch. Its content restructure is worth keeping, and
   `6af5d18`'s figure system is already in it.
2. The nomination window stays **T3, "reported"**. Nothing in the repo confirms it.
3. The Python pipeline (`analysis/`) is re-run only if a model input changes. Removing the
   poll-anchored `support.mulu_ward_*` inputs (old PHASE-0 conflict 5) does change one, so
   `data/analysis-exports.ts` will be regenerated, and I have not yet confirmed the pipeline runs
   here.
4. The old content files are deleted, not kept as archives. Git history is the archive.
5. `KSh` figures in §4 that cost a rival's pledge or quote the county envelope count as county
   data under the §2.5 carve-out. Firefly or campaign money figures are removed wherever they
   appear.
6. No prose is tightened for style. Text moves, is cut per the cut table, or is replaced by a
   figure plus a takeaway, and every removal is logged.
