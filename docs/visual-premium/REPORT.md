# Premium visual pass: report

Brief: `claude-code-visual-overhaul-prompt.md` (Firefly, 24 September 2026). Phase 0 is in
[`PHASE-0.md`](PHASE-0.md); the part-visual audit is [`PART-VISUALS.md`](PART-VISUALS.md); the
ward-boundary record is [`GEOGRAPHY.md`](GEOGRAPHY.md). Firefly approved every Phase 0
recommendation on 24 September 2026 and asked for the whole pass to be completed and merged
without further checkpoints; this report records what was done against the brief, and what was not.

## 1. Branch, commits, preview

| | |
|---|---|
| Branch | `claude/new-session-tvsa47` (this session could push only there; the brief named `claude/visual-premium-pass`) |
| Phase 0 | `13e42e0` frames and evidence · `8a4f7e4` report |
| Phases 1–4 | `cf9f717` |
| Phase 5 | QA fixes (contrast, print, share card) and this report, in the commit that carries it |
| Preview (branch alias) | https://dr-makali-digital-campaign-git-cl-d04902-brian-muluvis-projects.vercel.app |
| Merge | into `main` by pull request, as Firefly instructed on 24 September 2026 |

## 2. Screenshots

- Before: every route at 360, 390 and 1440 px (top, middle, bottom) in [`phase-0/routes/`](phase-0/routes/);
  every D-item in [`phase-0/defects/`](phase-0/defects/).
- After: the same routes, same method, in [`after/routes/`](after/routes/); the key surfaces (hero,
  preface, act opener, prose, story, hero figure, callouts, station table, KPI tiles, results,
  next steps) in both themes at 390 and 1440 px in [`after/surfaces/`](after/surfaces/).

| D-item | Before | After |
|---|---|---|
| D-01, D-02 | `phase-0/defects/D-01_*`, `D-02_*` | retired (no derived chart): `after/surfaces/*_prose`, `PART-VISUALS.md` |
| D-03 | `D-03_station_table` | `after/surfaces/*_station-table` |
| D-04 | `D-04_2-6_scan` | label-above-value cards, `components/markdown/InteractiveTable.tsx` |
| D-05 | `D-05_ring_*` (not reproduced locally) | the ring was a derived donut, retired |
| D-06 | `D-06_protocol_*` | stage names wrap, chips wrap |
| D-07, D-08 | `D-07_*`, `D-08_after_jump_top_*` | dock reserves its band and hides on the way down; label from a probe |
| D-09 | `D-09_desktop_column` | `after/surfaces/*_1440_*` |
| D-10, D-13 | `D-10_D-13_dropcap_and_actmarker_390` | `after/surfaces/*_act`, `*_prose` |
| D-11, D-12 | `D-11_tilemap_names`, `D-12_reach_tiles` | `after/surfaces/*_preface`, `*_kpi-tiles` |
| D-14 | `D-14_hero_*` | `after/surfaces/*_top` |
| D-15 | `D-15_pullquotes` | `after/surfaces/*_finding`, `*_rule` |
| D-16 | `D-16_figure_cards` | `after/surfaces/*_funnel`, `*_results` |

## 3. The site, before and after

Same method both times: `next build && next start`, Playwright Chromium, dark theme, Brief mode,
reduced motion (so pinned stories are measured unpinned, as a reader who asked for that sees
them), every route walked so every lazy figure mounts. "Figures" counts `<figure>` elements: the
fall is the 77 retired part visuals; all 48 register figures remain.

| Route | Height 390, before | after | Height 1440, before | after | Figures | Tables | `<details>` | SVGs | Words |
|---|---:|---:|---:|---:|---|---|---|---|---|
| `/cover` | 4,163 | 4,338 | 3,052 | 3,287 | 2 → 2 | 2 → 2 | 2 → 2 | 6 → 5 | 629 → 629 |
| `/objectives` | 10,163 | 9,638 | 7,921 | 7,046 | 12 → 6 | 4 → 4 | 4 → 4 | 58 → 57 | 2,155 → 1,998 |
| `/data` | 36,307 | 35,314 | 24,116 | 24,240 | 9 → 9 | 19 → 19 | 10 → 10 | 79 → 81 | 6,272 → 6,397 |
| `/analysis` | 46,851 | 49,575 | 34,308 | 35,167 | 19 → 14 | 14 → 14 | 15 → 15 | 226 → 230 | 8,195 → 8,369 |
| `/strategy` | 47,418 | 46,061 | 35,284 | 32,678 | 35 → 22 | 19 → 19 | 19 → 19 | 270 → 267 | 11,990 → 11,715 |
| `/implementation` | 8,716 | 7,920 | 6,340 | 5,384 | 9 → 3 | 2 → 2 | 2 → 2 | 37 → 35 | 2,032 → 1,885 |
| `/workstreams-platforms` | 12,614 | 12,058 | 9,577 | 8,613 | 8 → 7 | 8 → 8 | 13 → 13 | 97 → 94 | 1,703 → 1,599 |
| `/workstreams-media` | 9,241 | 9,551 | 6,630 | 6,654 | 1 → 1 | 1 → 1 | 6 → 6 | 90 → 89 | 1,023 → 1,048 |
| `/workstreams-ground` | 14,817 | 14,424 | 10,977 | 10,408 | 6 → 6 | 8 → 8 | 11 → 11 | 121 → 120 | 2,272 → 2,239 |
| `/workstreams-data` | 17,133 | 16,756 | 11,933 | 11,111 | 8 → 6 | 7 → 7 | 10 → 10 | 127 → 126 | 2,559 → 2,467 |
| `/delivery` | 67,992 | 67,876 | 50,288 | 46,764 | 43 → 26 | 24 → 24 | 38 → 38 | 411 → 404 | 17,697 → 17,331 |
| `/nextsteps` | 10,617 | 10,207 | 7,817 | 7,268 | 7 → 2 | 2 → 2 | 3 → 3 | 37 → 36 | 2,527 → 2,449 |
| `/annex-evidence` | 5,111 | 5,137 | 3,964 | 3,970 | 5 → 4 | 5 → 5 | 3 → 3 | 24 → 23 | 1,041 → 1,031 |
| `/annex-county` | 12,581 | 13,006 | 9,078 | 8,845 | 1 → 0 | 2 → 2 | 0 → 0 | 82 → 81 | 1,976 → 1,947 |
| `/annex-polls` | 4,042 | 4,010 | 3,034 | 3,067 | 0 → 0 | 0 → 0 | 1 → 1 | 16 → 15 | 979 → 980 |
| `/annex-messages` | 2,767 | 2,744 | 2,124 | 2,106 | 2 → 2 | 4 → 4 | 3 → 3 | 11 → 10 | 1,769 → 1,770 |
| `/annex-cadence` | 2,305 | 2,365 | 1,838 | 1,924 | 1 → 1 | 1 → 1 | 2 → 2 | 10 → 9 | 569 → 570 |
| `/annex-runbooks` | 12,577 | 12,976 | 9,125 | 9,062 | 8 → 7 | 5 → 5 | 9 → 9 | 67 → 66 | 2,576 → 2,559 |
| `/annex-terms` | 1,864 | 2,068 | 1,489 | 1,531 | 0 → 0 | 0 → 0 | 0 → 0 | 7 → 6 | 275 → 276 |
| **Sum** | **327,279** | **326,024** | **238,895** | **229,125** | | | | | |

Every route has exactly one `<h1>`, and none scrolls sideways at 360, 390 or 1440 px, before or
after. **Reading time: Brief 93 min, Full 216 min, before and after** — no prose was converted
(§6 below), so the times the hero measures are unchanged.

## 4. Every register figure

Legacy registry figures (44 mounted, §4.1 of PHASE-0) and heading inserts are **restyled**: they
take the new tokens, type and table system; none was rebuilt. Two inserts were removed by owner
decision (O-5 `SMSFeedbackVisualizer`, O-6 `CommunityScheduler`); every mockup now carries an
"Illustrative mockup" label (O-8). The 48 register figures (`lib/register/specs`):

| Id | § | Chart | Status | What changed |
|---|---|---|---|---|
| `fig-cover-map` | Cover | tilemap + stats | Upgraded | hero treatment: full shell width, larger title, inner glow; its story told by the 3D county hero; the four figures as BigNumbers; tile map: full two-line ward names (D-11), pool in laterite with the kiondo weave |
| `fig-cover-spine` | Cover | spine | Restyled | open ruled frame instead of a card (D-16) |
| `fig-1-1-timeline` | 1.1–1.2 | timeline | Upgraded | hero treatment: full shell width, larger title, inner glow |
| `fig-1-3-objectives` | 1.3 | cards | Restyled | open ruled frame instead of a card (D-16) |
| `fig-1-4-flow` | 1.4 | steps | Restyled | open ruled frame instead of a card (D-16) |
| `fig-1-5-scorecard` | 1.5 | gauges | Restyled | new tokens, type and frame |
| `fig-2-1-register` | 2.1 | waterfall + bars | Upgraded | hero treatment: full shell width, larger title, inner glow |
| `fig-2-2-results` | 2.2 | multiples | Restyled | new tokens, type and frame |
| `fig-2-3-nomination` | 2.3 | cards + matrix | Restyled | open ruled frame instead of a card (D-16) |
| `fig-2-4-people` | 2.4 | icons + bars + cards | Restyled | new tokens, type and frame |
| `fig-2-5-budget` | 2.5 | stack | Restyled | new tokens, type and frame |
| `fig-2-6-connectivity` | 2.6 | slope | Restyled | new tokens, type and frame |
| `fig-2-7-media` | 2.7 | network + bars | Restyled | new tokens, type and frame |
| `fig-2-8-record` | 2.8 | timeline + stats | Restyled | new tokens, type and frame |
| `fig-2-9-channels` | 2.9 | matrix | Restyled | open ruled frame instead of a card (D-16) |
| `fig-3-1-funnel` | 3.1 | funnel | Upgraded | hero treatment: full shell width, larger title, inner glow; chart kit v2 renderer (FunnelV2); told again in the §3 Story, which links to it |
| `fig-3-2-register-map` | 3.2 | tilemap + pareto | Upgraded | tile map: full two-line ward names (D-11), pool in laterite with the kiondo weave; told again in the §3 Story, which links to it |
| `fig-3-3-paths` | 3.3 | paths | Restyled | told again in the §3 Story, which links to it |
| `fig-3-4-footprint` | 3.4 | tilemap + stats | Upgraded | tile map: full two-line ward names (D-11), pool in laterite with the kiondo weave; told again in the §3 Story, which links to it |
| `fig-3-5-field` | 3.5 | bars | Restyled | new tokens, type and frame |
| `fig-3-6-party-flow` | 3.6 | tilemap + stats | Upgraded | tile map: full two-line ward names (D-11), pool in laterite with the kiondo weave |
| `fig-3-7-zones` | 3.7 | tilemap + dumbbell | Upgraded | tile map: full two-line ward names (D-11), pool in laterite with the kiondo weave |
| `fig-3-8-ceiling` | 3.8 | stack | Restyled | new tokens, type and frame |
| `fig-3-9-audit` | 3.9 | mock + cards | Restyled | new tokens, type and frame |
| `fig-3-10-gaps` | 3.10 | matrix | Restyled | open ruled frame instead of a card (D-16) |
| `fig-3-11-evidence` | 3.11 | balance + decision | Upgraded | hero treatment: full shell width, larger title, inner glow |
| `fig-4-1-message-house` | 4.1 | house | Upgraded | hero treatment: full shell width, larger title, inner glow |
| `fig-4-2-effort` | 4.2 | tilemap + heatmap | Upgraded | tile map: full two-line ward names (D-11), pool in laterite with the kiondo weave |
| `fig-4-3-segments` | 4.3 | matrix | Restyled | open ruled frame instead of a card (D-16) |
| `fig-4-4-message-region` | 4.4 | matrix + cards | Restyled | open ruled frame instead of a card (D-16) |
| `fig-4-5-calendar` | 4.5 | calendar | Restyled | new tokens, type and frame |
| `fig-4-6-channel-shift` | 4.6 | slope + matrix | Restyled | new tokens, type and frame |
| `fig-4-7-profile-fixes` | 4.7 | cards | Restyled | open ruled frame instead of a card (D-16) |
| `fig-4-8-decision-rules` | 4.8 | decision | Restyled | open ruled frame instead of a card (D-16) |
| `fig-5-1-workstreams` | 5.1 | cards | Upgraded | hero treatment: full shell width, larger title, inner glow |
| `fig-5-2-workstream-panels` | 5.2 | cards | Restyled | open ruled frame instead of a card (D-16) |
| `fig-5-3-four-weeks` | 5.3 | steps + cards | Restyled | open ruled frame instead of a card (D-16) |
| `fig-5-4-phases` | 5.4 | timeline | Upgraded | hero treatment: full shell width, larger title, inner glow |
| `fig-5-5-cadence` | 5.5 | matrix + matrix | Restyled | open ruled frame instead of a card (D-16) |
| `fig-5-6-kpis` | 5.6 | gauges + tilemap | Upgraded | tile map: full two-line ward names (D-11), pool in laterite with the kiondo weave; reach layer drawn as a named "Week 1" gap (D-12) |
| `fig-5-7-approval` | 5.7 | steps + decision | Restyled | open ruled frame instead of a card (D-16) |
| `fig-5-8-risk` | 5.8 | risk | Restyled | new tokens, type and frame |
| `fig-5-9-team` | 5.9 | cards + cards + cards | Restyled | open ruled frame instead of a card (D-16) |
| `fig-5-2-1-report-flow` | 5.2.1.1 | steps | Restyled | open ruled frame instead of a card (D-16) |
| `fig-5-2-3-field-loop` | 5.2.3.2 | steps | Restyled | open ruled frame instead of a card (D-16) |
| `fig-5-2-3-ussd-menu` | 5.2.3.3 | mock | Restyled | new tokens, type and frame |
| `fig-6-1-dependencies` | 6.1 | steps | Restyled | open ruled frame instead of a card (D-16) |
| `fig-6-3-decision` | 6.3 | cards + steps | Upgraded | hero treatment: full shell width, larger title, inner glow |

## 5. The auto-generated part visuals

114 entries audited one by one ([`PART-VISUALS.md`](PART-VISUALS.md)): **37 kept** (all 18
steppers, 17 checklists, 2 dated timelines), **77 retired** (every bars, bullet, contrast, donut,
gauge, stats and waterfall entry, and 13 "timelines" that were not in time). The generator can no
longer derive a quantitative kind from prose, and `scripts/visual-coverage.mjs` fails the build if
one reappears. This fixes D-01, D-02 and D-05. No retired entry needed a new register figure.

## 6. Prose → visual conversion

**Done in the follow-up pass.** Five conversions, each logged in
[`REPLACEMENTS.md`](REPLACEMENTS.md) with the prose's job, the figure that now does it and where
the original text lives: §3.3's route details, §5.2.4.3's five stack components, §5.4's three
phase KPI tables, §6.1.1's dependency list and §5.8's risk paragraphs. The prose sits under each
figure as "Read the text version", closed in Brief and open in Full and print. **Brief reading
time: 94 → 87 min; Full: 217 → 218 min** (the moved passages keep every word). Brief folds no
longer hide figures: three sections that showed no figure in Brief now do.

## 7. Geography

Real ward boundaries: Omare & Omare (2017), *Kenya County Assembly Boundaries*, CC BY 4.0,
digitised at 1:50,000 from the IEBC's 2012 ward delimitation; commit `7ee2ae5`; all 40 Kitui wards
joined to `data/ward-register.json` (two spelling aliases; one mislabelled Kiambu polygon
dropped); 11 KB TopoJSON. Full record in [`GEOGRAPHY.md`](GEOGRAPHY.md).

## 8. Dependencies and bundle

| Added | Why |
|---|---|
| `three`, `@react-three/fiber` | the 3D county (cover hero, §3 Story) |
| `d3-geo`, `topojson-client` | projecting the boundaries |
| `d3-scale` | chart kit v2 scales |
| `@types/*` for the above (dev) | types |

Not added: `gsap`, `lenis`, `@number-flow/react`, `@react-three/drei` (the scrubbed stories are one
scroll value and a ref; the number roll is a small component that keeps the final value in the
HTML). Recharts stays: six charts still use it.

| | Before | After |
|---|---:|---:|
| First-load JS, document route | 427 kB | 446 kB |
| three.js + R3F | — | a separate chunk, loaded only when WebGL is available and motion is allowed |

## 9. Measured quality

- **Guards:** `npm run verify` and `npm run build` pass. The money gate now also scans component and
  data copy (O-4); tested against the old code, it catches all four engagement prices.
- **Accessibility:** axe (WCAG 2.0/2.1/2.2 A and AA tags), every route, both themes, prose included,
  at 390 and 1440 px: **0 violations** after fixes. The light theme first showed 12 contrast
  failures (opacity-dimmed muted text, Tailwind 600 steps on pale fills, the mid teal heat step, a
  pale language-bar shade, three phase colours as text on their tints); all were fixed at the
  token level.
- **JavaScript off:** `/full` carries all 48 register figures with their tables open, the four hero
  figures at their true values, both static county maps and all four Story steps.
- **Reduced motion:** the hero and the Story render unpinned with the static county; the BigNumbers
  and count-ups never animate; act openers are never hidden.
- **Print:** light theme regardless of the screen theme; no grain, no dock, no WebGL (the static
  county prints); Story cards print as plain white cards.
- **Frame timing and vitals** (390 × 844, headless Chromium): with WebGL off, both scroll stories hold
  the headless 60 Hz vsync on every frame (median 16.7 ms, no frame over 33 ms); CLS 0; LCP 284 ms.
  With WebGL on, frames are 66–83 ms median because this environment renders WebGL in software
  (SwiftShader on the CPU); that number describes the environment, not a phone. **No trace was
  recorded on a real 120 Hz device** — that has to be done on an iPhone Pro or Galaxy S with
  Chrome DevTools remote profiling before anyone relies on it.

## 10. Needs Firefly's decision

- **O-7** (`data/tier-matrix.ts:54–57`): "Digital ad share of the agreed spend envelope · 15–20% /
  30–40% / 45–55%". Unchanged, as recommended, pending confirmation that a spend share belongs in an
  engagement scope.
- **§8.5** reference in `components/figures/registry.tsx` (the cultural advisor's appointment "§8.5
  places those appointments in Phase …"): the old number maps to five current sections and the
  sentence does not settle which. It is inside a data note that is closed by default.
- **Section 12 conversions** (§6 above): done; further candidates are argument rather than
  measurement, which no figure can carry without losing facts.

O-1, O-2, O-3, O-4, O-5, O-6, O-8, O-9 and O-10 were applied as recommended.

## 11. Not done, and why

The follow-up pass (commits `5eab750` onwards) delivered the items this list used to carry: chart
kit v2 across the register renderers (G-5), Story steps that embed their figures (G-4), lit device
stages with tilt (G-10), in-page view transitions and figure-shaped skeletons (G-11), magnetic
buttons, pointer light, tap ripples and number morphing on headline figures (§7.6), the full-screen
act index (G-7), the D-17 audit of legacy entrances, and the §12 conversions (§6).

Still not done:

- **Real-device 120 Hz traces** (§9): no iPhone Pro or Galaxy S was available to this environment.
  Headless Chromium holds its 60 Hz vsync with WebGL off; a remote-profiled trace on a 120 Hz phone
  is still owed before anyone relies on the frame-timing claim.
- **Section numbers** (D-19): the one ambiguous §8.5 reference in §10 stands.
