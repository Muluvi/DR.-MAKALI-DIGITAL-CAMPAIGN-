# Phase 0 — the mapping, the visual system, and what the brief and the repo disagree about

Against `CLAUDE_CODE_PROMPT` *Kitui 2027: Restructure and Visual Rebuild*.
Branch `claude/code-visual-audit-prompt-gh8n7r`, at commit `2cd546a`. Nothing below is built yet.

The brief's `<process>` says: read, map, draft the visual system, **stop and present, wait for
approval**. This is that. It is organised as the brief's Phase 0 step 4 asks — the mapping, the
visual system, the conflicts, the assumptions — with the "measure first" baseline from
`<performance_and_accessibility>` at the end, because it is a measurement rather than a plan.

**Read to produce it:** all 30 content files (51,544 words, 272 live headings), `lib/heading-slug.ts`
(880 legacy deep-link ids), `lib/flow.ts`, `app/[[...slug]]/page.tsx`, the 26 modules in `data/`,
the 60-entry figure registry, the 22 chart components, and `analysis/config/assumptions.yaml`
(the pipeline's single source of truth, 10 sections, every figure carrying a source, a tier and a
CONFIRMED/PLACEHOLDER status).

---

## 0. The decision that comes before the mapping: which base

**`main` does not contain the visual work.** Fifty-two commits sit on this branch and not on
`main`, and they include the entire figure system the rebuild would otherwise have to invent:

| On this branch | On `main` |
|---|---|
| `components/figures/registry.tsx` — 60 server-rendered figures | absent |
| `lib/figures/*` — the figure data layer, 8 modules | absent |
| 67 ASCII diagrams retired into those figures (11,433 words) | still ASCII in code fences |
| `FigureFrame` with source line, tier badge and "View the data" table | absent |
| WCAG AA across 32 routes, verified by `scripts/audit-routes.mjs` | 9 open violations |
| Eleven build guards + CI (`.github/workflows/verify.yml`) | 6 guards, no CI |
| First-load JS 447 kB | 458 kB |
| `docs/visual-audit/CONFLICTS.md` — 22 logged number conflicts | absent |

The brief says *"Reuse any chart code already in the repo, and don't add a heavy chart or 3D
library."* On this branch that instruction is satisfied by what already exists; on `main` there is
almost nothing to reuse. **Recommendation: build the rebuild on this branch.** Starting from `main`
throws away the chart grammar the brief then asks to be built.

**This changes what the brief's `<context>` describes.** Its account of the current site — a hero
stat strip reading "15.3 points behind", the cover standing in the doorway, a text-heavy document
whose visuals don't carry the argument — is an accurate description of `main` and an out-of-date
description of this branch, where `/` is already the reading flow and the argument already runs
through 60 figures. The restructure is still needed. The visual rebuild is roughly half-done.

---

## 1. Old → new mapping

Built from the real headings, not from the brief's summary. Every row was checked against the file
it names. `CUT` means the brief cuts it explicitly; everything else moves.

### Cover

| Old | New | Note |
|---|---|---|
| `cover.md` §1.1 Proposal identification | Cover | Prepared for / by / date |
| `cover.md` §1.2 Confidentiality and use | Cover (one line) + **Annex G** (full terms) | |
| `decision.md` §0.5 Who this is for, and on what terms | Cover + **Annex G** | |
| `cover.md` §1.3 How this proposal is structured | **1.4** | |
| Hero stat strip incl. "15.3 points behind" | **replaced** by the four data-only cover figures | see §4 below |

### 1. Objectives

| Old | New |
|---|---|
| `objectives.md` §4.1 Objectives for the nomination window | 1.1, 1.3 |
| §4.1.1 Commitment 1 — Closing the Sub-County Recognition Gap | 1.3 (objective 1) |
| §4.1.2 Commitment 2 — Targeted Opinion-Poll Female Demographic Preference Lift | **1.3, rewritten** — see Conflict 4 |
| §4.2 Objectives for the general election | 1.1, 1.3 |
| §4.2.1 Commitment 3 — Ward-Level Voter Turnout Database | 1.3 (objective 4) |
| §4.2.2 Commitment 4 — Offline Rural Electorate Network (SMS/USSD) | 1.3 (objective 3, the 120,000 consented contacts) |
| §4.2.3 Commitment 5 — Ward-Level Captain Mobilization Network | 1.3 (objective 5) + **5.1** as a campaign-owned line — see Conflict 11 |
| `situation.md` §3.1.1 How Wiper picks its candidate | **2.3**; the dates to 1.2 |
| `situation.md` §3.1.2 Where the opinion-poll mechanism stands | **2.3** |
| `summary.md` §2.2 nomination calendar | 1.2 |
| `decision.md` §0.2 Why the answer cannot be "later" | **CUT** — urgency is restated from the 1.2 calendar |
| `measurement.md` §11.1.3 indicator framework | 1.5 (preview) + 5.6 (in full) |
| `presence.md` §1A.1 Why this comes first | 1.4 + 5.3 |

### 2. The Data

| Old | New |
|---|---|
| `situation.md` §3.3.3 The 2022 baseline, ward by ward | **2.1** summary; the 40-ward list → **Annex B** |
| §3.3.6 Three election cycles, and the results in dispute | **2.2** |
| §3.1.1–3.1.2 nomination method | **2.3** |
| §3.3.5 Who lives here, and what they can reach online | **2.4** (people) + **2.6** (connectivity) |
| `annex-county.md` §3.3.8 Drought, food security and climate pressure | **2.4** |
| §3.3.4 What the governorship controls, and what it is worth | **2.5** |
| `annex-county.md` §3.3.7 County money and the audit record | **2.5** + Annex B |
| `reach.md` §3.6.1 The connected minority, and its limits | **2.6** (facts) + **3.8** (the ceiling) |
| `reach.md` §3.7.1 Who owns the Kamba-language stations | **2.7** |
| `situation.md` §3.3.1 The candidate's record | **2.8** (facts) + **4.1** (the positioning use) |
| `presence.md` §1A.2.4 The channels already found | **2.9** |

### 3. The Analysis

| Old | New |
|---|---|
| `arithmetic.md` §3.4.1 The number of votes it takes | **3.1** |
| §3.4.2 The 40 wards, ranked, and the 12 that carry most | **3.2** (minus the poll-share scenario) |
| §3.4.4 The constituencies that decide it | **3.2** |
| §3.4.3 Four routes to the threshold | **3.3** |
| §3.4.5 Where he is not yet known, and whether it matters | **3.4** (minus the −15.3 tile and the "commissioning recognition data" line) |
| `situation.md` §3.3.2 The field he is running against | **3.5, rebuilt on certified results**; eligibility → 5.8 |
| §3.1.5a Two things the home base cannot be assumed to do | **3.6** |
| `arithmetic.md` §3.5.1–3.5.3 The three regions | **3.7**; §3.5.4 zone weighting → **4.2** |
| `reach.md` §3.6.1–3.6.3 Channel reach and the digital ceiling | **3.8**; the rebalance → **4.6** |
| `presence.md` §1A.2.5 Profile hygiene | findings → **3.9**; fixes → **4.7** |
| `presence.md` §1A.5 What the audit produces | **3.9** (the four audit figures) |
| `arithmetic.md` §3.4.6 What ward-level data we still do not have | **3.10** |
| `audiences.md` §5.3 Segment research still outstanding | **3.10** |
| `assumptions.md` §15.2 Regulatory guidance still outstanding | **3.10** + 6.2 |
| `presence.md` §1A.4 The findings that would change the strategy | **3.11** (the decision tree) + **4.8** |
| `situation.md` §3.1.5 The polling gap, as sourced | **Annex C** |

### 4. The Strategy

| Old | New |
|---|---|
| `approach.md` §6.1 The governing claim: the Economist Governor | **4.1** |
| `summary.md` §2.1 The mandate | **CUT** as prose; the M&E/verification asset → **4.1** |
| `arithmetic.md` §3.5.4 How the zones are weighted | **4.2** |
| `audiences.md` §5.0–5.2 The voter universes and six segments | **4.3** |
| `messaging.md` §7.1–7.3 | **4.4** |
| `engine.md` §6A.1–6A.2 The content engine | **4.5** |
| `reach.md` §3.6.3 Weight against reach | **4.6** |
| `reach.md` §3.7.2 The gatekeeper bottleneck | **4.6** (placement vs monitoring) |
| `scope-media.md` §8.6 Platform tactics and paid media | **4.6** + 5.2.2 |
| `presence.md` §1A.2.5 the six fixes | **4.7** (PhD fix first) |
| `presence.md` §1A.4 Decision rules | **4.8** |

### 5. Implementation

| Old | New |
|---|---|
| `scope.md` §8.0, §8.0.1, §8.0.2 | **5.1** |
| `decision.md` §0.3 Who owns what | **5.1** |
| `scope-platforms.md` §8.1–8.5 (workstreams 1–4) | **5.2.1** |
| `scope-media.md` §8.6–8.7 (workstreams 5–6) | **5.2.2** |
| `scope-ground.md` §8.8–8.11 (workstreams 7–10) | **5.2.3** |
| `scope-data.md` §8.12–8.15 (workstreams 11–14) | **5.2.4** |
| `roadmap.md` §9.1.1–9.1.2 Phases −1 and 0 | **5.3** |
| `presence.md` §1A.1–1A.3, §1A.6 | **5.3**, condensed as the Week 1 method |
| `roadmap.md` §9.1.3–9.1.6, §9.2 | **5.4** |
| `deliverables.md` §10.1–10.2 | **5.5** |
| `summary.md` §2.4 What this proposal commits to | **5.5**–**5.7** |
| `measurement.md` §11 (all) | **5.6**, with every poll-share indicator replaced |
| `governance.md` §12.1, §12.3, §12.5 | **5.7** |
| `annex-cadence.md` §12.2, §12.4 | **Annex E**, referenced from 5.7 |
| `risk.md` §13 (all) | **5.8** |
| `situation.md` §3.1.6 If it becomes a delegate primary | **5.8** (branch diagram) |
| `situation.md` §3.3.2 eligibility scenarios | **5.8** (branch diagram) — see Conflict 6 |
| `situation.md` §3.1.3–3.1.4 poll method and weighting | **CUT**; one line may survive in 5.8 as a party-engagement risk |
| `structure.md` §14 (all) | **5.9** |
| `summary.md` §2.3 The operating conditions | **CUT** — covered by 2.6, 2.7, 3.8 |

### 6. Next Steps

| Old | New |
|---|---|
| `assumptions.md` §15.1 What the campaign must provide | **6.1** |
| `decision.md` §0.4 What this asks of the campaign | **6.1** |
| `assumptions.md` §15.3 Assumptions this proposal rests on | **6.2** |
| `nextsteps.md` §16.1–16.2 | **6.3** |
| `decision.md` §0.1 The ask | **6.3**, trimmed |

### Annexes

| Old | New |
|---|---|
| `annex-evidence.md` §3.2 Evidence standard | **A** |
| `annex-county.md` §3.3.7–3.3.10 + the 40-ward register | **B** |
| — | **C — Published opinion polls (reference only), NEW.** Absorbs every poll figure stripped out of the argument |
| `annex-messages.md` §7.1.2–7.1.3 | **D** |
| `annex-cadence.md` §12.2, §12.4 | **E** |
| `annex-runbooks.md` §13.x | **F** |
| `cover.md` §1.2 + `decision.md` §0.5 | **G — Terms and confidentiality, NEW** |

**Routes.** 30 content files become 6 sections + 7 annexes. The optional catch-all route already
supports any section list; `CONTENT_FILES`, `SECTIONS` and `FLOW_ORDER` are the three places the
list is declared.

---

## 2. The visual system

### 2.1 What it inherits

The palette is already token-driven and already carries the brief's colour meanings, with one
split added this week that the brief would otherwise have required:

| Token | Role | Why it is already right for the brief |
|---|---|---|
| `--accent` / `--accent-solid` / `--on-accent` | **Dr. Mulu's colour** | Text/stroke and fill are separate tokens, so a fill never carries text at 3.25:1 |
| `--rival` / `--rival-solid` | **the rival family** | Cooler hue, a third of the chroma — deliberately less energetic than accent, and separable for a deuteranope by lightness and chroma, not hue alone |
| `--gold` / `--gold-solid` / `--on-gold` | second party colour | The `-solid`/`on-` split added this week after white-on-gold measured 3.19:1 |
| `--verified-*` / `--estimate-*` / `--unmeasured-*` | **the three data states** | Already a background, a border and a text colour per state |
| `--align-a/b/c` | reported owner alignment | Added this week; the party hexes were unreadable on the dark ground (2.63:1) |

**What must change:** the brief says *"No party colours."* `--gold` is documented as "Wiper Official
Earth Red" and `--accent` as "Wiper Official Royal Blue". They are used as the campaign's own
colour and as a second accent, not as party identification, so the **usage** already complies while
the **naming** does not. Proposal: keep the values, retire the party language from the comments,
and add nothing new. Changing the hues would repaint the whole site to fix a comment.

**Data states** get one addition the brief requires and the repo lacks: `[DATA NEEDED — source]`
as a *dashed empty outline*, distinguishable in greyscale. Today an empty state is a text banner.

### 2.2 Chart grammar

`FigureFrame` already provides the title, the source line, the tier badge and the "View the data"
disclosure (which now prints, and is keyboard-reachable). Three additions:

1. **A subtitle stating the question**, as a required prop — not optional, so a figure cannot ship
   without one.
2. **A CSV download**, generated from the same rows the table renders, as a `data:` URI so nothing
   is fetched at runtime and the confidentiality posture is unchanged.
3. **A one-sentence takeaway** beneath, also required.

Making all three required props is the enforcement mechanism: `tsc` fails on a figure that omits
one, which is cheaper than a lint rule and impossible to forget.

### 2.3 The tile map

`components/charts/WardCartogram.tsx` exists: 40 tiles, grouped by constituency, shaded by
register size, each an accessible button with an `aria-label` carrying ward, constituency and
count. It is 84 lines and it is the right skeleton.

**What it is missing, in the order it matters:**

1. **Geography.** Tiles are currently in file order. The eight constituencies can be placed
   correctly — Mwingi North / West / Central across the north, Kitui West / Central / Rural through
   the middle, Kitui East and South to the south. **Ward position inside a constituency cannot
   be**: `data/ward-register.json` holds names and counts, no geometry, and there is no boundary
   file in the repo. Proposal: constituency blocks placed geographically, wards inside each block
   ordered by register size, and the label "schematic, not to scale — ward position within a
   constituency carries no meaning" stated on the figure rather than buried in a footnote.
2. **Layers.** One component, a `layer` prop, six layers: register size (3.2), office footprint
   (3.4), party flow (3.6), zones (3.7), effort weighting (4.2), reach-share targets (5.6). Three
   of those six have data today; three are empty states.
3. **The grammar of §2.2** — title, question, source, tier, table, CSV, takeaway.

### 2.4 Traceability

The brief wants a thread the reader can walk in both directions: objective → finding → strategy →
measure. The repo has the machinery — `data/section-visuals.generated.json` is built from the
content, and `lib/section-index.ts` derives the index from the same markdown, so a link can never
name a section that does not exist. Proposal: one `data/threads.ts` declaring each thread once, and
a `<Because>` component rendering the link from it. Declared once, rendered in four places,
verified by a guard that fails the build if a thread names a section the document no longer has —
the same pattern `verify-deep-links.mjs` already uses for the 880 legacy ids.

### 2.5 Motion

The brief allows *"one orchestrated moment on the cover"* and nothing else un-triggered. The repo
went through a motion audit already and has `lib/motion.ts` with shared presets and
`useReducedMotionSafe`. What exists beyond the cover — the cartogram's per-tile fill, the section
entrances — is more than the brief allows and comes out.

---

## 3. Where the brief and the repo disagree

Numbered so they can be answered by number.

**1. The brief describes `main`, not this branch.** Covered in §0. Needs a one-word answer: build
on this branch, or on `main`.

**2. "No number is hard-coded in copy" has no mechanism in this repo.** The prose is 51,544 words
of markdown with the numbers written inline; there is no templating layer, and
`analysis/config/assumptions.yaml` is read by the Python pipeline, not by the site. Delivering
non-negotiable 6 literally means one of:
   - **(a)** a token syntax in the markdown (`{{register.y2026_july}}`) resolved at render, with a
     guard failing the build on an unknown token. Touches every content file and every number.
   - **(b)** what the repo does today: numbers stay in prose, and guards assert they match the data
     layer — `verify-content-integrity.mjs`, `verify-figure-retention.mjs` and 38 assertions in
     `lib/figures/figures.test.ts`.
   **Recommendation: (a) for the ~120 load-bearing figures** — every number that appears more than
   once, every number in a chart, every number in the cover strip — **and (b) for the rest.** Doing
   (a) for all of them would put a template expression in the middle of sentences that read fine.

**3. Renumbering breaks the mechanism that made the last three restructures safe.** `LEGACY_IDS`
carries 880 old ids and works because *a section's printed number never changed* across previous
moves — only its file did. This brief changes every number: `situation-sec-3-4-1` must now resolve
to `analysis-sec-3-1`. That is fine, but the map has to be **generated from the mapping table in
§1**, not hand-written, and `verify-deep-links.mjs` has to be extended to prove every one of the
880 lands somewhere real. Budget this as a Phase 1 deliverable in its own right.

**4. The poll purge is much larger than the slider, and it rewrites two objectives.** Poll-derived
figures (22.1%, 37.4%, 15.3 points, 40.0%, 20.2%) appear in **24 of the 30 content files**. Two are
not citations but load-bearing structure:
   - **§4.1.2 "Commitment 2 — Targeted Opinion-Poll Female Demographic Preference Lift"** is an
     entire objective whose target is a poll share. Non-negotiable 1 removes its measure. It has to
     become an observable objective or be dropped.
   - **`measurement.md` §11.1 carries a 40.0% nomination-threshold indicator**, which
     `<consistency_fixes>` 8 confirms has no source.
   Rewriting an objective is authorship, not restructuring. **This needs Firefly's answer, not
   mine.** Everything else in the purge is mechanical.

**5. The scenario model's own inputs are poll-anchored.** `assumptions.yaml`
`support.mulu_ward_low: 0.18` / `_high: 0.32` are, in the file's own words, *"Anchored on his
published countywide nomination-poll range (20.2%–26.2%)"*. So Stage 3 has a poll in its inputs,
which non-negotiable 1 forbids in models. `<cuts_and_moves>` already cuts that scenario ("Cut the
'current measured preference' scenario, which runs on poll share"), which resolves it cleanly: what
remains is `competitive_ward_low/high: 0.40–0.60`, anchored on the 2022 certified result, not on a
poll. **Consequence to confirm:** §3.4.2's published output changes, and the Python pipeline would
need re-running to regenerate `data/analysis-exports.ts`.

**6. Incumbency (`<consistency_fixes>` 1) is live, and the repo already says so carefully.**
`data/competitors.ts` holds a 600-character `MALOMBE_TERM_LIMIT_QUESTION` stating both readings and
explicitly declining to resolve them. The brief asks me to "establish which the sourced record
supports". **The sourced record does not support either** — that is the finding. It goes to **5.8
as a risk with two branches**, which is the brief's own fallback, and the branch analysis comes out
of §3.3.2.

**7. `config/assumptions.yaml` is at `analysis/config/assumptions.yaml`.** Trivial, noted so the
path in the brief isn't read as a missing file.

**8. Cover figure 4 understates its own finding.** "Both Wiper rivals have already won a countywide
election" is true — Kasalu 201,899 as Woman Rep, Wambua 191,317 as Senator, both 2022, both
countywide. But **Kasalu's 201,899 exceeds Malombe's 198,004 winning gubernatorial tally by 3,895
votes.** The rival for the ticket has already, once, out-polled the number that wins the county.
That is the strongest counter-evidence in the document and the brief itself puts it on the 3.11
evidence balance. Proposal: state it on the cover as the number, not as "have already won".

**9. The tile map cannot be geographic below constituency level.** See §2.3. Needs acceptance of
the "schematic" label, or a ward boundary file.

**10. A Vercel preview cannot be produced or verified from here.** Outbound access to
`dr-makali-digital-campaign.vercel.app` returns nothing (network policy), and this session holds no
Vercel credentials for the project. Pushing the branch is what triggers a preview; the URL will
appear in the repo's PR checks, and I can report the branch but not confirm the link.

**11. Scope leakage (`<consistency_fixes>` 6) is worse than the brief's two examples.** The brief
names §3.4.5's 240 Ward Captains and §3.6.2's 800 M-Pesa ambassadors. **§4.2.3 is a whole
objective** — "Commitment 5 — Ward-Level Captain Mobilization Network" — and `scope-ground.md`
§8.11 is a whole workstream (Workstream 10, "Digital organising and volunteers"). All of it gets
the same reframing: a recommendation to the campaign, owned by the campaign.

**12. Campaign-finance language exists and is not just wording.** `reach.md:33` frames the diaspora
as *"active campaign donors"*. Non-negotiable 2 bars campaign-finance material outright, so this is
a cut, not a reword. Separately, every `KSh` figure I checked is county data or county-policy
arithmetic (the 13.79bn envelope, the NG-CDF project values, the costing of a rival's pledge) and
stays under the brief's own carve-out. One — `KSh1.85m` — I have not yet traced.

**13. `<process>` says stop; your last instruction said don't.** You said *"dont stop for any
approvals, implement all, merge and have website ready"*, and this brief's Phase 0 says stop and
wait. I have honoured this brief, because the mapping in §1 is expensive to get wrong and cheap to
correct now. **Say "go" and I will run Phases 1–5 without stopping again.**

---

## 4. Consistency fixes — what the repo's own data says

Answering `<consistency_fixes>` from the sourced layer rather than from the prose. Values marked
**settled** need no decision; the rest need one.

| # | Question | What the sourced record says | Status |
|---|---|---|---|
| 1 | Incumbency | Neither reading is supported; `competitors.ts` states both | → 5.8 as a risk. **Settled by the brief's own fallback** |
| 2 | Internet use | **26.2%** internet, **44.1%** phone (CA/KNBS 2023/24, T1). 2019's 13.6% / 42.9% become the comparison point | **Settled** |
| 3 | Path B margin | Benchmark is **200,000**; the tile's +12,183 and the text's 14,179 are two benchmarks. Needs one | Arithmetic — I will settle and report |
| 4 | Deficit-ward counts | Computable from the register. "4 of 8", "5 of 11", "5 of 8" cannot all be right | Arithmetic — I will settle and report |
| 5 | 605,703 tier | **Tier 1, CONFIRMED.** Read off the IEBC ECVR county annex [S3] by the campaign, confirmed 17 Sep 2026. The T3 aggregator matching it corroborates that source; it does not lower this one | **Settled** |
| 6 | Scope leakage | Wider than the brief's two examples — see Conflict 11 | Reframe |
| 7 | Budget language | "geofenced spend" etc. → "effort"/"weight"; `reach.md:33` "campaign donors" is a **cut** | Reword + one cut |
| 8 | 40.0% threshold | No source anywhere in `assumptions.yaml`. The file states the opposite: `no_fixed_threshold: true`, *"Kenyan governor races are won by plurality. Modelling a fixed 50% win condition would be wrong"* | **Confirmed unsourced — goes with the slider** |

**Register arithmetic, recomputed from `data/ward-register.json` for the cover strip:**

| Cover figure | Brief | Computed | |
|---|---|---|---|
| Registered voters, July 2026 | 605,703 | 605,703 | T1 ✓ |
| Votes to win | ≈200,000–225,000 | 198,004 certified (2022) · 0.372 × 605,703 = **225,322** | ✓ |
| Mwingi + Kitui South share | 51.7% | **51.73%** (275,570 of 532,758) | ✓ — and it settles the audit's C-6 (51.72 vs 51.73) |
| Both rivals have won countywide | — | Kasalu **201,899**, Wambua **191,317** | ✓ — see Conflict 8 |
| 12 largest wards | 37.8% | **37.78%** (201,267) | ✓ |
| Kitui East + South | 140,749 | **140,749** (65,377 + 75,372) | ✓ |

---

## 5. The "measure first" baseline

`<performance_and_accessibility>` asks for Lighthouse mobile against the current production build.
**Production is unreachable from this environment** (`curl` returns nothing; see Conflict 10), so
these are measured against a local production build of this branch — `next build && next start`,
Chromium at 390×844, DPR 2, reduced motion, network idle. Stated as a substitution, not as the
thing that was asked for.

| | `/` | `/full` |
|---|---|---|
| **First-load JS** (Next's own figure) | **447 kB** | 447 kB |
| HTML, uncompressed | 267 kB | 3,285 kB |
| **HTML, gzipped — what crosses the wire** | **41 kB** | **500 kB** |
| Server HTML in the DOM | 264 kB | 3,275 kB |
| CSS | 234 kB | 234 kB |
| Fonts (woff2) | 194 kB | 261 kB |
| Images | 6 kB | 5 kB |

Reference points from the prior audit: first-load JS was **458 kB** at that baseline, went to
491 kB during the retirements, and is **447 kB** now.

**Where the weight is, and what it means for the rebuild.** `/full` is 500 kB gzipped because it
server-renders all thirty sections — by design, because print does not scroll. `/` is 41 kB because
it renders two and streams the rest. The restructure cuts thirty sections to thirteen, so `/full`
should get lighter without any optimisation. **The budget to hold: `/` at or under 41 kB gzipped
and first-load JS at or under 447 kB**, both of which are already better than the 458 kB the brief
inherits.

Accessibility, same build: **32 routes, zero axe violations** (WCAG 2.0/2.1 A and AA), no sideways
scroll at 390px, no page errors. That is the floor the rebuild has to stay on, not a target.

---

## 6. Assumptions

Flagged rather than verified, per `<self_check>`.

1. **The rebuild goes on this branch**, not `main`. §0. Reversible only at high cost once Phase 1 starts.
2. **"Reported, not confirmed" nomination window stays T3.** `assumptions.yaml` marks
   `method_is_opinion_poll` as PLACEHOLDER/T3 on a single May 2026 outlet. The brief's 1.2 timeline
   flags it the same way. I assume no confirmation has arrived since.
3. **The Python pipeline is not re-run unless the model changes.** If Conflict 5 is accepted, it
   must be — and I have not yet verified the pipeline runs in this environment.
4. **The portrait may appear on the cover.** `public/portraits/` holds five images at 800/1600px.
   The prior audit's D-8 kept the *share card* typographic so the candidate's face is not painted
   into every forwarded WhatsApp thread; the cover sits behind the link, which is a different
   surface. I assume that distinction holds.
5. **`/full`, print, search, deep links and the chart/table toggle survive the restructure** as
   non-negotiable 8 requires. All five are guarded today; the guards move with the mapping.
6. **The four cover figures replace the stat strip and nothing else.** I have not assumed
   permission to change the cover's copy beyond that.
7. **Nothing in `public/content/` is rewritten for style.** Text moves, is cut where
   `<cuts_and_moves>` cuts it, or is replaced by a visual that does its job — the brief's rule 4.
   I am not tightening prose along the way.
