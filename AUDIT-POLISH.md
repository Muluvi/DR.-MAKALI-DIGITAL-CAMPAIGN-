# Polish pass: audit and baseline

Workstream 1 of the visual and performance polish (branch `polish/visual-performance`). No code
was changed for this audit. Nothing listed here has been deleted. Each item needs approval first.

Measured on 17 November 2026 against `795fce1` (main).

---

## 1. Baseline

### 1.1 Build

`npm run build` passes (prebuild checks included, `check-preservation: 259 protected files
present`). The working tree is clean after the build.

| Route | Route JS | First-load JS |
|---|---:|---:|
| `/[[...slug]]` (every chapter, `/` included) | 235 kB | **423 kB** |
| `/tools/[tool]` | 36 kB | 193 kB |
| `/dashboards` | 0.2 kB | 181 kB |
| `/tools/service-delivery` | 1.7 kB | 140 kB |
| `/tools` | 7.4 kB | 134 kB |
| Other platform routes | 0.1–7 kB | 104–125 kB |
| Shared by all | — | 103 kB |
| Middleware | — | 34.9 kB |

- Client JS emitted (`.next/static/**/*.js`): 111 files, 3,572,769 bytes raw.
- CSS emitted: 5 files, **433,191 B raw / 77,977 B gzip**, all five loaded on every chapter route.
- Source CSS: 12 files, 8,083 lines, 428,866 B, of which 92,123 B are comments.
- Prerendered HTML, heaviest: `/full` 4.15 MB, `/workstreams` 684 kB, `/` 456 kB,
  `/annex-evidence` 365 kB.

### 1.2 Lighthouse, mobile

Lighthouse 12, default mobile config: Moto G Power emulation, simulated throttling (150 ms RTT,
1.6 Mbps, 4× CPU). `next start` on the production build. Three runs per route, median shown.

The two chapter routes are the heaviest single chapters by HTML weight. (`/full` is the whole
document on one page, not a chapter.)

| Route | Score | LCP | FCP | CLS | TBT | Speed Index | Transfer | Runs |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `/` | **61** | **4.91 s** | 2.28 s | 0.000 | 775 ms | 2.44 s | 809 KB | 61 / 60 / 62 |
| `/workstreams` | **50** | **6.93 s** | 2.87 s | 0.000 | 964 ms | 2.87 s | 1,028 KB | 50 / 52 / 48 |
| `/annex-evidence` | **58** | **5.00 s** | 2.27 s | 0.000 | 943 ms | 2.56 s | 866 KB | 55 / 60 / 58 |

INP is a field metric, and lab Lighthouse does not report it. TBT is the lab proxy. For
workstream 9, I'll measure INP directly with the Event Timing API in Playwright under 4× CPU
throttling, and record it alongside TBT.

**Where the time goes** (run 1 of each route):

| | `/` | `/workstreams` | `/annex-evidence` |
|---|---|---|---|
| LCP element | hero portrait `img` | chapter `h1.flow-chap__label` | first lead `p.t-body` |
| Script | 16 req / 435 KB | 26 req / 527 KB | 19 req / 489 KB |
| **Fonts** | **2 req / 186 KB** | **4 req / 289 KB** | **3 req / 225 KB** |
| CSS | 5 req / 79 KB | 5 req / 79 KB | 5 req / 79 KB |
| Long tasks (count / longest) | 10 / 337 ms | 17 / 514 ms | 15 / 341 ms |
| Boot-up, largest | shared chunk `1255` 1.7 s | shared chunk `1255` **6.1 s** | route doc 2.9 s |
| Unused JS | 148 KB | 111 KB | 134 KB |
| Unused CSS | 23 KB | 24 KB | 25 KB |

What this shows for the later workstreams:

1. **Hydration of the 235 kB chapter bundle is the main cost.** Every chapter hydrates the same
   client tree, and TBT of 775–964 ms is what keeps the score at 50–61. Reaching ≥ 95 means turning
   static prose components into server components and deferring Recharts, d3 and the maps. CSS
   alone won't get there.
2. **Fonts are 186–289 KB per route**, more than all the CSS. Bricolage with two variable axes
   plus Newsreader roman and italic is heavy. Subsetting is the biggest single byte saving.
3. LCP on chapter routes is text, so it waits on fonts and CSS, not on an image.
4. CLS is already 0.000 on all three. It must stay there.

### 1.3 File counts

| | Count |
|---|---:|
| Tracked files | 1,140 |
| `components` + `hooks` + `lib` + `app` + `types` | 355 |
| CSS files under `app/` | 12 |

---

## 2. Method

**Code.** I built an import graph covering static `import`/`export … from`, dynamic `import()`,
`require()` and CSS `@import`, resolving `@/` through `tsconfig` paths. Roots are every file
under `app/`, plus `middleware.ts` and `next.config.ts`. Separately, I walked the graph from every
script named in `package.json` and in `.github/workflows/*.yml`. A file counts as unused only if
it's unreachable from both, and a full-text search finds its name nowhere except comments, docs
or `scripts/preservation-manifest.json`.

**Preservation guard.** `scripts/check-preservation.js` fails if any file under a protected tree
is missing: `components/phone`, `components/markdown`, `components/premium`, `components/tools`,
`components/charts`, `components/register`, `components/terminal`, `components/partviz`,
`app/tools`, `lib/data` and others. Unreachable files in those trees are therefore **not**
proposed for deletion. Deleting them would fail `prebuild`, and you told me not to edit the
manifest.

**CSS.** I extracted every leaf rule from the 12 files. A rule counts as dead only if every
selector in its list contains at least one class that appears **nowhere** in `components/`,
`app/`, `lib/`, `hooks/`, `content/`, `data/` or `scripts/`, either as a literal or behind a
dynamic prefix (`foo-${…}`, `'foo-' + …`). Library-generated classes (`recharts-*`, `lucide-*`)
and the theme class `dark` are treated as used. I spot-checked the dynamic-construction cases by
hand for the `rc-`/`rb-`/`rs-`/`rk-` families.

**Dependencies.** Import sites counted across `.ts`, `.tsx`, `.mjs`, `.js` and `.css` (including
`@plugin`), plus `postcss.config.mjs`.

---

## 3. Proposed removals: for approval

Approve by group (A–F), or strike individual items.

### A. Unused application code: 11 files, 38,588 B

None of these is imported by any route, script or test, none is in a protected tree, and none is
named in content or a markdown directive.

| # | Path | Bytes | Evidence |
|---|---|---:|---|
| A1 | `components/ChartComponent.tsx` | 8,593 | No importer. The only mention is a comment in `StrategicAids.tsx:555` recording that the re-export was removed. |
| A2 | `components/ScrollProgressBar.tsx` | 4,948 | No importer. Named only in `scripts/visual-feature-ledger.py` (historical, run by nothing). |
| A3 | `components/figures/UnderReview.tsx` | 1,905 | No importer, no other mention. |
| A4 | `components/flow/ActMarker.tsx` | 1,489 | No importer. Only a comment in `premium/ActOpener.tsx:12` saying ActOpener replaced it. |
| A5 | `components/flow/FlowChrome.tsx` | 4,768 | No importer, no other mention. |
| A6 | `components/flow/FlowRail.tsx` | 1,519 | No importer, no other mention. |
| A7 | `components/visual/AmbientField.tsx` | 2,811 | Re-exported only by `visual/index.ts` (A9), which nothing imports. |
| A8 | `components/visual/Reveal.tsx` | 4,295 | Re-exported only by `visual/index.ts`. Every live "Reveal" match is the CSS class or a comment, not this module. |
| A9 | `components/visual/index.ts` | 1,150 | The barrel. Nothing imports `@/components/visual`; every consumer imports the file directly. |
| A10 | `hooks/use-marquee-active.ts` | 1,302 | No importer, no other mention. |
| A11 | `lib/figures/register.ts` | 5,808 | No importer. `figures.test.ts` imports `register-math.ts` directly, so that file stays. |

**Kept although unreachable from routes:**
- `components/markdown/NominationPathPanel.tsx`, `components/phone/OptInConsentPhoneMockup.tsx`,
  `components/phone/ServiceTrackerPhoneMockup.tsx` and `components/premium/FigureV2.tsx`. These
  are protected by the preservation manifest.
- `lib/visual-compile.ts` and `lib/data/allow.ts`, which scripts in `verify` use.
- The three `*.test.ts` files, run by `test:figures` and `test:declutter`.
- `types/js-yaml.d.ts`, the ambient type for `js-yaml`, which has no `@types` package.

### B. Unused public assets: 6 files, 352,828 B

`components/Portrait.tsx:82` is the only place a portrait is loaded. It always requests
`/portraits/${file}-1600.webp`, and next/image produces its own smaller renditions from that one
file. The four ids it maps are `hero-clasped-hands`, `seated-grey-cropped`, `three-piece-formal`
and `gesture-explaining`. `public/sw.js:115` caches by the `/portraits/` prefix only and names no
file.

| # | Path | Bytes | Evidence |
|---|---|---:|---|
| B1 | `public/portraits/01-hero-clasped-hands-800.webp` | 34,780 | No code references `-800`. |
| B2 | `public/portraits/02-seated-grey-800.webp` | 47,514 | Same, and the id isn't mapped. |
| B3 | `public/portraits/02-seated-grey-cropped-800.webp` | 54,270 | No code references `-800`. |
| B4 | `public/portraits/03-three-piece-formal-800.webp` | 40,528 | No code references `-800`. |
| B5 | `public/portraits/04-gesture-explaining-800.webp` | 41,438 | No code references `-800`. |
| B6 | `public/portraits/02-seated-grey-1600.webp` | 134,298 | The uncropped variant. `Portrait.tsx` maps only `02-seated-grey-cropped`. |

### C. Unused npm dependencies

| # | Package | Evidence | Saving |
|---|---|---|---|
| C1 | `zod` | 0 import sites anywhere in the repo. | install size only (never bundled) |
| C2 | `autoprefixer` | Listed in `postcss.config.mjs`. Tailwind v4's `@tailwindcss/postcss` already prefixes through Lightning CSS, so this second pass repeats work. I'll remove both the dependency and the config entry, then diff the built CSS to confirm nothing changes. | build time |
| C3 | `tw-animate-css` | Its only consumers are `animate-in` and `slide-in-from-bottom` in `components/phone/OptInConsentPhoneMockup.tsx:160,166`, a file no route renders (it's kept for preservation only, see A). I'll remove the `@import` in `globals.css:101` and the dependency. The protected file stays byte-identical; its two class names simply stop matching a rule. | CSS bytes, measured in workstream 2 |
| C4 | `@types/qrcode` | Not unused. It's a type package listed under `dependencies`. **Move** it to `devDependencies`. | none at runtime |

Every other dependency has at least one live import site: `@supabase/*`, `d3-geo`, `d3-scale`,
`d3-time` (one use, `utcYear`, in `register/charts.tsx`), `js-yaml`, `lucide-react` (71 files),
`motion` (39), `qrcode`, `react-markdown`, `recharts` (6), `rehype-raw`, `remark-gfm`,
`topojson-client` and `@tailwindcss/typography`.

### D. Dead CSS rules: 198 rules, about 30.3 kB of rule text

These selectors match nothing anywhere in the source (method in section 2). Deleting them is
part of the CSS consolidation in workstream 2. **Before** that work, every route gets a
before/after screenshot diff at 390, 1440 and 3840 px, light and dark. Any rule whose removal
changes a pixel goes back in and is reported to you.

**`globals.css`** (57 rules, 9.9 kB):
`.visual-overview*`, `.t-headline`, `.t-display`, `.t-chart-{micro,tick,axis,label,title}`,
`.density-{compact,balanced,generous}` and their descendants, `.measure-{narrow,balanced,wide}`,
`.marginalia-container`, `.prose-sidenote`, `.clean-editorial-section*`, `.grid-2`, `.grid-3`,
`.mobile-compact`, `.mobile-tight-stack`, `.hairline-border`, `.oled-shadow`,
`.gpu-accelerated`, `.text-oled-glow`, `.cv-auto-section*`, `.cv-auto-hero`,
`.zero-chrome-active`, `.print\:block`, `.print\:hidden` (both hand-written duplicates of
Tailwind utilities), `.decor-watermark`, `.tap-expand`, `.plane-3d`, `.sheen-3d`,
`.track-unmeasured*`, `.bottom-dock.fx-glass`, `.fx-figure-{bar,line,hatch}`.

> Note on `.t-display`, `.t-headline` and `.t-chart-*`: these are the type-scale classes
> workstream 4 will build on. They are dead as **classes**, but the `--fs-*` tokens they read are
> live. I'll delete the dead classes and refine the tokens. I won't revive the classes unless
> workstream 4 needs them, and I'll say so if it does.

**`register.css`** (56 rules, 5.7 kB): the `.rc-*` card grid, `.rb-*` bar list, `.rs-*` steps,
`.rk-*` week and risk table, `.rx-draw`, `.ds-needed*`. These are an earlier register renderer;
`components/register/*` now emits `.rf`, `.rb-n…` and `.rb-l…` only.

**`premium.css`** (37 rules, 4.9 kB): `.pf-scene`, `.pf-hero__steps`, `.pf-step*`,
`.pf-hero__pick`, `.pf-pick*`, `.pf-act__numeral`, `.pf-dock__hold`,
`.pf-story__{title,take,link}`, `.pf-idx__n`, `.pf-idx__rownum`, `.pf-slab`, `.pf-glass-screen`,
`.pf-xfade`, `.pf-bn__label` / `.pf-bn__note`.

**`part-visuals.css`** (25 rules, 4.2 kB): `.pv-steps__body`, `.pv-hub*`, `.pv-chap*`,
`.pv-quote*`, `.pv-statement*`, `.pv-shape*`.

**`story-live.css`** (9 rules, 1.3 kB): `.sx-top-btn--accent*`, `.sx-search-hint`,
`.sx-tour-pill*`, `.sx-hint-cycle`.

**`declutter.css`** (6 rules, 0.6 kB): `.ichip--t{1,2,3} .ichip__btn`, `.vz-seq__label*`,
`.vz-col__label`.

**`flow.css`** (4 rules, 0.9 kB): `.flow-chap__dot`, `.fx-scroll-cue*`.

**`visual-fx.css`** (4 rules, 2.8 kB): `.fx-glass`, `.dark .fx-glass`.

`chart-kit.css`, `motion-draw.css`, `streamline.css` and `platform.css` have no dead rules.

Beyond the dead rules, workstream 2 will merge the 12 files into fewer files, fold overrides into
the rules they override, and collapse duplicate tokens. That is consolidation, not deletion, so
it isn't itemised here. Comments make up 92 kB of the source CSS (34 kB in `globals.css`, 26 kB in
`visual-fx.css`). They don't ship, but they go with the rules they describe.

### E. Stale root-level documents: optional, your call

None of these is read by any build, verify or check script. They are records of earlier passes,
so deleting them is an editorial decision rather than a technical one. My recommendation is to
**keep them** (or move them under `docs/history/`), because CHANGE-LOG and the ledgers point back
to them. I'll delete them only if you say so explicitly.

| # | Path | Bytes | Referenced by |
|---|---|---:|---|
| E1 | `DR-MAKALI-PROPOSAL-REDESIGN-SPEC.md` | 127,936 | `CHANGE-LOG.md` (text only) |
| E2 | `kitui-rebuild-prompt.md` | 69,394 | `docs/rebuild/RECON.md`, `REPORT.md` (text only) |
| E3 | `WRITING-LOG.md` | 60,565 | two docs (text only) |
| E4 | `AUDIT-FINDINGS-PROMPTS-A-AND-B.md` | 22,785 | three docs (text only) |
| E5 | `metadata.json` | 367 | AI Studio app manifest (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`). Nothing in the build reads it, and the site doesn't use Gemini. |

**Not proposed:** `CHANGE-LOG.md` (read by `scripts/rivals-2026-11/build-ledger.mjs`, which runs
in `check:content`), `ARCHITECTURE.md`, `CONTRIBUTING.md`, `MOTION-SYSTEM.md`, `AGENTS.md`.

### F. Historical one-shot scripts: not proposed

Sixty-five code files under `scripts/` (plus nine JSON data files beside them) aren't reachable from any npm script or workflow. Examples are
`scripts/restructure-2026-1{0,11}/*.py`, `scripts/rebuild/*`, `scripts/declutter/stages/*.py`,
`scripts/optimisation/*`, `scripts/measure-*.mjs` and `renumber-citations.ts`. They are the
migrations that produced the current content and its ledgers, and several JSON files beside them
(`figure-migrations.json` and `figure-retirements.json`, 383 kB together) are data those ledgers
cite. None of them ships to the site. I recommend **keeping** them all. The full list is available
on request.

---

## 4. Totals if A–D are approved

| | Saving |
|---|---:|
| A. Application code | 11 files, 38.6 kB source |
| B. Portrait renditions | 6 files, 352.8 kB of deployed assets |
| C. Dependencies | 3 removed (`zod`, `autoprefixer`, `tw-animate-css`), 1 moved |
| D. Dead CSS | 198 rules, about 30.3 kB raw, plus the `tw-animate-css` import |
| E. Root docs (only if you opt in) | 5 files, 281 kB |

None of A–D reaches a page's critical path except D and C3, so the byte savings on the wire come
from D now and from workstreams 4 and 9 (fonts, hydration) later.

---

## 5. Findings for later workstreams (no action yet)

- **Caching headers live in `next.config.ts` `headers()`, not `vercel.json`.** `vercel.json`
  holds only an `ignoreCommand`. `/sw.js` is `no-cache`, and `/data` and `/content` are
  `max-age=300, stale-while-revalidate=86400`. `/_next/static` gets Next's immutable default.
  Workstream 9 will confirm these against the deployed preview.
- **Portrait sources top out at 1600 px tall**, with widths of 963–1243 px. The portrait comment
  says the 7.6 MB master PNGs are not in the repo. Workstream 7's srcset to 2560w and 3840w can't
  be served honestly from these files, so all four portraits will be listed as needing
  higher-resolution originals. They won't be upscaled.
  `next.config.ts` `deviceSizes` currently stops at 1920.
- `html` has the `dark` class hard-coded in `layout.tsx`, with an inline script that removes it
  for light readers. Dark mode exists and must meet the same contrast standard (workstream 5).
- The prompt describes 12 CSS layers "each over the one before". In practice 8 are imported in
  `layout.tsx` and 4 (`visual-fx`, `part-visuals`, `flow`, `declutter`) are `@import`ed **inside**
  `globals.css`. Tailwind therefore inlines them before `register.css`, `premium.css` and the rest
  of the files that layout.tsx imports after globals.css. The real cascade order is globals →
  visual-fx → part-visuals → flow → declutter → register → premium → chart-kit → motion-draw →
  streamline → platform → story-live. Consolidation keeps that order.

---

## 6. Assumptions and open points

1. **Branch.** You asked for `polish/visual-performance`, and that's the branch I'm using. This
   cloud session was set up with `claude/new-session-j4xf4g` as its default branch. I read your
   explicit instruction as permission to push to `polish/visual-performance` instead.
2. **Chapter routes for Lighthouse.** `/workstreams` and `/annex-evidence` are the two heaviest
   chapters by HTML weight. `/full` (4.15 MB, the whole document) isn't a chapter, so it wasn't
   used as one of the two targets.
3. **Lab environment.** Lighthouse ran in this container. Its benchmark index varied from 1,428 to
   2,507 between runs, which is why each route was run three times and the median used. The
   after-numbers will be taken the same way, in the same container, so the comparison is like
   for like.
4. **Performance target realism.** A score of ≥ 95 with LCP < 2.0 s on a 423 kB-first-load route
   that hydrates every chapter's client tree is a large move from 50–61. It's achievable only if
   workstream 9 can make most of the chapter tree server-rendered. I'll report the measured result
   honestly if it falls short.

---

## 7. Approval and what was done (workstream 2)

Approved on 17 November 2026: groups A, B, C and D, plus "remove what's not being used", which
I took to cover E and the free part of F. For F, a script was deleted only when no live file
names it: not the code, the configs, the workflows, `package.json`, the data or the JSON
ledgers. Files that only `docs/` and markdown mention count as free.

### Deleted

- **A.** All 11 files, as listed.
- **B.** All 6 portrait files, as listed.
- **E.** All 5 root documents, as listed.
- **F.** 54 files, listed below. `build-app-icon.mjs` stays: it regenerates the shipped
  `app/apple-icon.png`, like `build-og-image.mjs`. These 19 also stay because a live file
  still names them:
  - Live callers: `preservation-manifest.json`, `section-visual-overrides.json`,
    `figure-retirements.json`, `consolidation/literals-allow.json`, `preservation/loader.mjs`,
    `rebuild/routes.mjs`, `consolidation/ledger.mjs`.
  - Named by a live script's comments or anchors: `build-og-image.mjs`, `build-ward-keys.mjs`,
    `consolidation/live-check.mjs`, `consolidation/motion-check.mjs`,
    `consolidation/move-section.mjs`, `declutter/edit.py`, `measure-section-heights.mjs`,
    `rebuild/phase1.py`, `rebuild/snapshot-anchors.mjs`, `restructure-2026-10/build-moves.py`,
    `restructure-2026-11/build-moves.py`, `restructure-2026-11/build-preservation.py`.

F, deleted (54 files, 759,709 B):
`scripts/audit-additions.json`, `scripts/audit-rewrites.json`, `scripts/build-visual-inventory.mjs`, `scripts/consolidation/dedupe.mjs`, `scripts/consolidation/feature-check.mjs`, `scripts/consolidation/merge-chapter.mjs`, `scripts/declutter/fig.mjs`, `scripts/declutter/live-checks.mjs`, `scripts/declutter/measure-heights.mjs`, `scripts/declutter/screenshots.mjs`, `scripts/declutter/stage_helpers.py`, `scripts/declutter/stages/e1_source_pack.py`, `scripts/declutter/stages/s3_intros.py`, `scripts/declutter/stages/s3_register.py`, `scripts/declutter/stages/s3_window.py`, `scripts/declutter/stages/s4_decision.py`, `scripts/declutter/stages/s5_evidence.py`, `scripts/declutter/stages/s6_strategy.py`, `scripts/declutter/stages/s7_part4.py`, `scripts/declutter/stages/s8_measure_risks.py`, `scripts/declutter/stages/s9_annexes.py`, `scripts/figure-migrations.json`, `scripts/heading-inventory.ts`, `scripts/measure-chrome-occlusion.mjs`, `scripts/measure-text-load.mjs`, `scripts/measure-visual-baseline.mjs`, `scripts/notation-rewrites.json`, `scripts/optimisation/dom-probe.mjs`, `scripts/optimisation/lighthouse-summary.mjs`, `scripts/optimisation/prose-screens.mjs`, `scripts/optimisation/prune-css.mjs`, `scripts/optimisation/screen-coverage.mjs`, `scripts/optimisation/screenshots.mjs`, `scripts/rebuild/inventory.mjs`, `scripts/rebuild/mapping.mjs`, `scripts/rebuild/migrate.mjs`, `scripts/rebuild/tokenize.ts`, `scripts/renumber-citations.ts`, `scripts/restructure-2026-10/build-layout.py`, `scripts/restructure-2026-10/check-acceptance.py`, `scripts/restructure-2026-10/check-conservation.py`, `scripts/restructure-2026-10/live-checks.mjs`, `scripts/restructure-2026-10/parse-mapping.py`, `scripts/restructure-2026-10/update-keys.py`, `scripts/restructure-2026-11/build-layout.py`, `scripts/restructure-2026-11/inventory.py`, `scripts/restructure-2026-11/mapping.py`, `scripts/restructure-2026-11/render.py`, `scripts/restructure-2026-11/render_final.py`, `scripts/restructure-2026-11/renumber.py`, `scripts/restructure-2026-11/write_docs.py`, `scripts/start-dev.mjs`, `scripts/visual-feature-ledger.py`, `scripts/visual-inventory-plan.json`

### Dependencies (C)

`zod`, `autoprefixer` and `tw-animate-css` were removed, along with the `@import` in `globals.css`
and the `autoprefixer` entry in `postcss.config.mjs`. `@types/qrcode` moved to
`devDependencies`.

There is one visible effect of dropping autoprefixer. It had been stripping
`-webkit-backdrop-filter` from Tailwind's `transition-property` list, so that entry now ships.
Safari before 18 needs it, and it changes nothing in Chromium.

### CSS consolidation (D and the merge)

**12 files became 4**, in the exact cascade order the 12 had:

| New file | Holds, in order |
|---|---|
| `app/globals.css` | head of globals → visual-fx → part-visuals → flow → declutter → rest of globals (exactly where the four `@import`s used to inline them) |
| `app/editorial.css` | register → premium |
| `app/charts.css` | chart-kit → motion-draw |
| `app/story.css` | streamline → platform → story-live |

Each old file now opens with a banner that names it, so nothing that pointed at it is lost.

| Step | Count |
|---|---:|
| Dead rules removed | 192 |
| Comments removed: 16 directly above a removed rule, 8 inside a removed block | 24 |
| Later same-selector declarations folded into the earlier rule | 10 |
| Override rules emptied by folding and removed | 6 |

Folding moves a declaration from rule B up into an earlier rule A with the same selector and
context. It only does this when no rule anywhere between A and B sets a property of the same
family (`margin-top` and `margin` count as one family, for example), so the cascade result is
unchanged. It is restricted on purpose, to three conditions:
- A and B come from the same original file.
- B has no comment inside it or directly above it.
- Comments are never moved.

An unrestricted first run folded 376 declarations, and the style diff showed it was cascade-safe.
It still damaged the source. It moved the brand tokens out of their documented `:root` into an
earlier one, left their measured contrast-ratio notes ("6.6:1 on paper") behind to be dropped,
and lost the premium file's banner. A comment-by-comment audit against the original 12 files
caught this. In the final run, every comment that's gone described a rule that is gone.

The dead count is lower than the 198 in section 3D for two reasons:
- The detector now ignores class names inside `:not()`, `:is()`, `:where()` and `:has()`. A rule
  such as `.prose > :is(.not-prose, figure):not(.pf-wide-block)` matches even though
  `.pf-wide-block` is unused.
- It now treats any text directly before `${` as a dynamic prefix. This is what keeps
  `ichip--t${tier}`.

The first stage-2 run caught both mistakes, and the corrected run removed none of those rules.

Tailwind now scans only `app`, `components`, `hooks`, `lib`, `content` and `data`
(`source(none)` plus `@source`), instead of the whole repository.

**Verification.** I dumped the computed style and box of every element, including `::before` and
`::after`, for 85 properties, on all 31 static routes at 390 and 1440 px, light and dark: 124
dumps against the original build. Each stage was diffed against that baseline.

- The only differences left are run-to-run state: the toast region, the delayed "try me" cue,
  React `useId` values, the heading currently in view, and lazily mounted charts.
- Each of these differs between two runs of the same build, in both directions, and disappears
  when the route is run again.
- Stages 1 (merge), 2 (dead rules), 3 (folding) and 4 (Tailwind sources) each show zero
  differences outside that set.

### Result

| | Before | After |
|---|---:|---:|
| CSS source files | 12 | 4 |
| CSS source bytes | 428,866 | 403,711 |
| Built CSS, raw | 433,191 | 402,012 |
| Built CSS, gzip | 77,977 | 72,401 |
| Tracked files | 1,140 | 1,057 |

The cut in built CSS is 7%, not the large cut the brief hoped for. The rest of the hand-written
CSS is live: every remaining rule matches something the site renders. The 106 kB Tailwind
utilities layer is all used, which is why restricting the scan saved only 1.1 kB. Further
reductions now come from the later workstreams, which rewrite rather than delete: the type and
spacing scales (4 and 6) replace per-component one-offs.

`npm run lint`, `npm run verify` and `npm run build` pass. `check-preservation` prints the same
lines as on main: 259 protected files present, the same 73 edited since its baseline, and no
count below baseline. No file under `content/` or `public/content/` changed.

---

## 8. Workstream 3: section arrival

### What shipped

- **The arrival entrance.** As a chapter's head comes into view, its part label fades in, its name
  rises into place (60 ms later) and its blurb follows (120 ms). The rule under it then draws in.
  - Timing uses the `--pf-dur-entrance` token with `--pf-ease` (the expo-out
    `EASE_ENTRANCE`), and only transform and opacity animate. The rule's existing literal
    `900ms cubic-bezier(0.16, 1, 0.3, 1)` is now the same value as tokens: `--pf-dur-settle` and
    `--pf-ease`.
  - The entrance is armed only for a head still below the fold at mount
    (`components/flow/ChapterMarker.tsx`). The server HTML, a reader without script, a reader
    arriving from a link and a reader with reduced motion all see the head complete.
  - The transition applies to the in-view state only. Chapters sit in
    `content-visibility: auto` sections, where Chrome pauses transitions. A transition on
    arming had stalled at its first frame, which a browser probe caught. Now arming hides the
    head instantly while it's off screen, and only the arrival animates.
  - Measured on `/`, the label's opacity reads 0 → 0.26 → 0.88 → 0.98 → 1.00 in 120 ms samples
    after arrival, at 1440 px. At 390 px it reads 0 → 0.89 → 0.99 → 1.00.
- **Lighter on a phone.** On a phone the parts arrive together, the rise is smaller (0.2em
  instead of 0.35em), and the rule draws on the entrance token rather than the settle token.
- **Reduced motion.** The head is never armed and reads opacity 1 throughout.
- **Landing.** `--pf-chrome-top: 3rem` is the sticky header, measured at 48 px at 390, 768,
  1440, 1920 and 3840 px. `--pf-snap-top` adds 1.5rem of air, so a chapter head reached by
  link, route map or Page Down lands at 72 px, clear of the header. The style diff shows exactly
  this one change: `scroll-margin-top` 80 → 72 px on the chapter heads, and nothing else.

### What did not ship, and why: snap points

I built and measured snap points: the chapter heads, plus the act openers on wide screens, with
`scroll-snap-align: start` and `proximity`. Arrival worked. A scroll ending 140 px short of a head,
or 60 px past it, settled with the head at 72 px, and the page didn't jump on load.

But Chromium returns a proximity scroll that **starts on** a snap point to that same point
whenever the step is shorter than about 30% of the viewport. Starting from a settled head at
1440×900, wheel steps of 100, 180 and 260 px all came back to the head; 340 px and more escaped.
- On the home page, the chapter digests are 620 px apart, so a reader stepping one notch at a
  time stuck on the first head they reached: 12 steps of 180 px moved the page 0 px.
- On the phone it stuck after the fourth step.
- Arrow keys (40 px) still moved, and Page Down went to the next head. Touch gestures couldn't be
  synthesised in this headless build. Chromium snaps a drag on the same end-position rule, so a
  short drag from a head would come back too.

Every other geometry I tried failed one way or the other:

| Snap target | Arrives on the head | One notch down from a head | One notch up from a head |
|---|---|---|---|
| Chapter head | yes | pulled back | pulled back |
| Head extended with `scroll-margin-bottom: 100vh` (covers the snapport) | lands 60 px off | free | pulled back |
| Whole section | lands 60 px off | free | pulled back |

A magnet strong enough to pull a reader onto a head is also strong enough to hold one there, and
the brief rules out the JavaScript that could make it one-directional. You ranked "nothing traps
the reader" above the snap, so the snap targets are out. `html` keeps
`scroll-snap-type: y proximity`, with no vertical targets. The horizontal rails keep their own
x-axis snapping, unchanged. The full reasoning is in the comment at "section arrival" in
`app/globals.css`.

**This needs your decision.** If the pull is worth that cost, the change is two declarations:
`scroll-snap-align: start` on `.flow-chap`, and on `.pf-act` above 640 px.

After removing the targets, eight steps of 100 px (four down, then four up) move exactly 100 px
each, on `/` and `/workstreams`, on the phone and at 1440 px.

---

## 9. Workstream 4: typography

**Measured first.**
- **Reading prose.** On `/votes` at 1440 px the body is 18 px with a 29.7 px line (1.65) and a
  719 px measure, about 67 characters. At 390 px it's 16.1 px with the same 1.65 ratio, about
  35 characters (a phone's width). Measure and leading were already inside the brief's 60–72
  and 1.55–1.65, so they're unchanged. Headings already used `text-wrap: balance` and
  paragraphs `pretty`.
- **Fonts.** Fonts are self-hosted and Latin-subset by `next/font`. Only Bricolage Latin
  (131 KB) is preloaded. Newsreader and JetBrains Mono load on demand, and the fallbacks are
  metric-adjusted. CLS measured 0.000 on all three baseline routes.

**Changed.**
- **The lead step.** `--fs-lead` was 17 → 20 px, which put it 1 px above body on a phone and
  2 px above on a laptop. It's now 18 → 22 px, a step of 1.125 to 1.22.
- **Tabular, lining figures.** These now apply to every table, figure, SVG chart, `<output>`,
  `<data>`, `<time>`, register figure (`.rf`), counter (`.anim-num`) and stat surface
  (`.pf-num`, `.pf-numbers`, `.vz-stats`, `.kx-stats`, `.kx-countdown__n`, `.sx-count`,
  `.sx-count-card`, `.cd__stats`). The selector is `:where()`, so it has zero specificity and
  every surface that sets its own figures keeps them. Running prose keeps proportional figures.
- **Wrapping.** `text-wrap: balance` now also covers `h4`; `pretty` also covers `figcaption`
  and `dd`.
- **Bricolage's axes, by size.**
  - Chapter names and prose h1/h2 condense to `font-stretch: 94%`. Where the editorial layer
    already set 92% for prose h2, that more specific rule still wins.
  - The hero and act titles stay at `--pf-display-stretch` (88%).
  - Labels and small type stay at full width, with optical size on `auto` to open their
    spacing.
- **Not changed: the font files.** I built custom subsets (every character the content and UI
  use, plus ASCII and Latin-1, axes pinned to wght 300–800 and wdth 88–100, no hinting) and
  compared them with what `next/font` already ships:

  | Face | next/font Latin | Custom subset |
  |---|---:|---:|
  | Bricolage | 131.3 KB | 143.4 KB |
  | Newsreader | 58.2 KB | 58.6 KB |
  | Newsreader italic | 64.5 KB | 64.7 KB |
  | JetBrains Mono | 40.5 KB | 40.5 KB |

  The only gain would be on pages with Kikamba ĩ/ũ, which today also fetch Latin-ext files, and
  it would cost every page 12 KB. That's not worth it, so the Google subsets stay.
- **Large screens** are part of workstream 6.

**Diff against the baseline (124 dumps).**
- `font-variant-numeric` changed on 34,066 elements (tables, figures and SVG descendants).
- `font-size` and `line-height` changed on 4 lead paragraphs.
- Heights and widths shifted on 52 and 34 elements, following from the lead and the condensed
  headings.
- No other property changed.

---

## 10. Workstream 7: portraits sharp to 4K

You supplied four 2496 × 3744 originals. Three of the four site portraits now come from them, and
the one with no original has been retired.

| Portrait | Source | Cut-out (cropped to the subject) | Was |
|---|---|---:|---:|
| `hero-clasped-hands` | purple suit, hands at the cuff (263870) | 1959 × 3236 | 971 × 1600 |
| `three-piece-formal` | grey three-piece, 263868, the sharper of the two (face edge variance 81.0 against 78.6) | 2024 × 3432 | 963 × 1600 |
| `gesture-explaining` | purple suit, gesturing (263871) | 2142 × 3254 | 1055 × 1600 |
| `seated-grey-cropped` | no original above 1600 px | retired, as you asked | 1243 × 1600 |

- **The cut-outs.** They were matted with BiRefNet-portrait (rembg) and checked on both the light
  and the dark ground at the hairline and ears. They're cropped to the alpha bounds with 12 px of
  air, saved as WebP (q90, alpha q100), and nothing was upscaled. Each new aspect ratio is within
  2% of the cut-out it replaces, so no layout moves. The existing bottom fade still dissolves the
  straight cut at the jacket.
- **Serving.** `next/image` serves AVIF, then WebP, from these sources. `deviceSizes` now reaches
  2560w and 3840w for large high-DPR screens, and a phone still picks a small rendition through
  each placement's `sizes`.
- **Placements.**
  - The act openers rotate evenly through the three portraits (three-piece, gesture, hero, and
    again). Each appears twice, no neighbouring acts match, and the first act doesn't repeat the
    cover's portrait.
  - "The engagement model" (`/week`) now uses `hero-clasped-hands`. The candidate profile on
    `/record` keeps `gesture-explaining`.
- **Removed.** The four `-1600` files are gone, `02-seated-grey-cropped` among them. The
  service worker caches `/portraits/` by prefix and names no file.
- **Observation.** The supplied originals look AI-upscaled: skin and fabric texture are smoothed
  at full size. They are 2496 × 3744 pixels, but not that much optical detail. If camera originals
  exist, the same pipeline will take them.

---

## 11. Status tags removed from figures (your request, 17 November 2026)

Figures no longer carry status tags. The tier and state stay in the data, the CSVs and the
registry. Only the tag on screen is gone.

**Removed from view**

| Tag | Where it was | How |
|---|---|---|
| Official / Reported / Unconfirmed tier badges | panels, provenance lines, disputed figures, fiscal, drought and basin panels, the zone matrix | `TierBadge` renders nothing |
| Verified / Estimate / Awaiting campaign decision / Not yet measured | claim badges beside figures, placeholders and USSD copy | `ClaimBadge` renders nothing |
| Official / Reported / Unconfirmed / Modelled / Target / Data needed pills | register figures, beside "Show the details" and in each source line, and the map legend | `TierPill` renders nothing; the slot beside the details control is removed |
| Provenance pills | big numbers, the station table, the premium figures | `ProvPill` renders nothing |
| Inline tier chips in prose ("Official", "Unconfirmed") | 107 places | see below |
| Modelled / Target chips and "· modelled" words | register bar labels, stat tiles, segment legends and their screen-reader labels | removed |
| Funnel state chip | funnel stages | removed |
| Chapter-digest tier word | every chapter digest stat | removed |
| Visual tier tags, and the badges "not yet tiered" and "sources pending" | content visuals | removed; other content badges ("campaign-owned", "workstreams 1 to 4") stay |
| "Confirmed" / "Unverified" / "Provisional" chips | analysis figure rows | removed |
| "This block contains unconfirmed figures. Every one is marked below…" | analysis figures | removed, because it promised marks that no longer show |
| "Awaiting" chip on panel labels | disclosure groups | removed |
| Tier pill and "Unconfirmed ward match" chip | projects register cards | removed |
| "· reported · Unconfirmed" | the nomination-window chip | removed; the chip reads "Wiper decision: {window}" |
| "(Official)", "(Unconfirmed, …)", "- Official" in text drawn from data | register figures, hand-built panels | dropped on the way to the screen (`withoutTierTags`) |

**Citations are kept.**
- A tier parenthetical in the content, for example "(Tier 2, Nation, 4 July 2026)", used to be a
  chip labelled with the tier word. It's now a neutral **Source** chip, muted and with no tier
  colour, that opens to the same citation.
- A parenthetical that carries only the tier, or only a status word ("(Tier 3, unconfirmed)"), is
  removed together with the space in front of it. "authority (Tier 1); the" now reads
  "authority; the". A scan of every route finds no space left before punctuation, apart from one
  typo that's already in the county's own data ("water pan ,").

**Kept on purpose**
- **Method lines in analysis figures**, such as "Official figure · S2 · as at 2022" and
  "Modelled — not a measurement". These are source sentences, not chips. Tell me if they should
  go too.
- **Table columns that hold a tier or state per row**, such as the "Basis" column in register
  data tables. That's data. The team's editing form also keeps its Reliability select, because it
  is a working control.
- **"Awaiting campaign decision" written in the content** (five Procurement Status lines in the
  technology annex) and "not yet tiered" inside a content sentence. These are the content's own
  words, and the content is unchanged.
- **"Data needed" on the tools hub**, which describes a tool, not a figure.
- **The woven fill that marks a modelled segment inside a chart.** That's how the chart draws the
  data, not a tag.

**Unchanged.** Content and the published data are byte-identical. `content/`, `public/content/`
and `public/data/` all show no diff. The CSVs and registry are still built from the specs with
tiers, because the stripping happens only on the way to the screen. 43 CSS rules for the removed
tags are deleted. `check-preservation` passes with 82 protected files edited (73 on main); each of
the 9 new ones is a tag removal listed above.

---

## 12. Workstream 5: colour

**Method.** Two audits, after the status tags were removed:

1. **Every text element, on all 31 static routes, in light and dark (1440 px).** The audit reads
   each element's computed colour, its opacity through its ancestors, and its background,
   composited through every translucent layer behind it. It flags anything under 4.5:1, or 3:1
   for large text (24 px, or 18.66 px bold).
2. **Pixel sampling for what the first audit can't see.** This covers SVG chart labels, text on
   gradients, text whose background is a sibling (a sliding pill behind a tab) and light text in
   the light theme. The text is made transparent, its exact box is screenshotted to read the real
   background, and the median contrast against the text colour is taken.

**Found and fixed.** Every changed pair was re-measured.

| Where | Was | Now | Change |
|---|---:|---:|---|
| Language list (`/channels`), inactive rows | 1.83 (light), 2.32 (dark) | 6.6 (muted), 13+ (ink) | Rows were dimmed to 38% opacity. Now the text stays full strength and only the bar dims; the tick and the bar carry the meaning. |
| Tools hub and projects register, small `slate-500` text on #0f1622 / #060d1a | 3.80 / 4.08 | 6.90 / 7.40 | `slate-500` → `slate-400` |
| Phone mock-up: timestamps on the green bubble | 4.19 | 5.46 | #667781 → #54656f |
| Phone mock-up: message input text | 3.05 | 4.65 | #8696a0 → #667781 |
| Phone mock-up: chat-list subtitle, white on #008069 | 3.61 | 4.89 | 78% white → white |
| Segment rank numbers (`/voters`) | 3.47 / 3.94 / 4.38 | 6.6 / 6.30 / 7.24 | `opacity-70` removed |
| Budget envelope bar (`/position`), white on the gradient in dark | 2.58 | 5.36 (dark end), 7.44 (light end) | The gradient ends on `--accent-solid` mixed with 15% `--accent`, not on `--accent` (the bright text blue in dark). |

**Measured and exempt.**
- **"Submit Test Report" while disabled (50%).** WCAG 1.4.3 exempts inactive controls.
- **The "·" separators at 60%.** These are decorative.
- **Text at opacity 0.** It's folded or hidden, so no reader sees it.

**Result.** After the fixes, both audits find no failing text pair in light or dark, apart from
the exemptions above. 1,097 flagged elements came down to 0 real failures: 1,037 of them were
artefacts (zero-opacity folded text, or backgrounds the first audit couldn't see), and the pixel
check cleared those.

**The token set.** It already has the structure the brief asks for, so it's documented rather
than renamed:
- **Surfaces:** `--paper` (ground), `--card` (cards), and `--pf-raised` (= card) for raised
  chrome.
- **Lines:** `--line`.
- **Text levels:** `--ink`, `--prose-body`, `--muted`.
- **Accent states:** `--accent` (text and strokes), `--accent-solid` (fills) and `--on-accent`
  (text on fills), with the same three for laterite (`--gold`, `--gold-solid`, `--on-gold`).

Renaming the tokens would touch every component and change nothing a reader sees. The brand
values (Wiper blue, laterite, indigo ink, sisal paper) and their meanings are unchanged.

**Dark mode** meets the same standard, measured with the same two audits.

**Duplicate tokens collapsed.** The retired sepia theme's token block (`.sepia`, 1,551 bytes) is
deleted. `lib/useTheme.ts` only ever removes that class and has carried sepia readers to light
since the 2026 premium pass.

**Colour with intent.** Removing the status tags (section 11) took out the largest source of
colour noise on the page: three tier colours and four state colours on chips beside nearly every
figure. Blue now marks the campaign and laterite the gap, as the brand defines.

---

## 13. Workstream 6: space, layout and large screens

**1. Lengths in rem.** 1,118 CSS declarations, 128 Tailwind arbitrary classes and 13 chart font
sizes moved from px to rem.
- **What converted:** type, spacing, sizes, offsets and radii of 4 px and up.
- **What stayed px:** hairlines, borders, outlines, shadows, blurs, pattern sizes and media
  queries.
- **Check:** at the default 16 px root this is pixel-identical. The computed-style diff on all
  124 route × width × theme dumps showed **0** differing elements. It's what lets one root step
  scale the whole site on a large screen.

**2. One 4/8 spacing scale.** The scale is 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112,
128, 160, 192 px.
- **Hand-written CSS:** 571 of the 1,105 spacing values (margin, padding, gap) were off it
  (6, 10, 14, 9.6, 4.8, 14.4 px and so on), across 476 declarations. All are now on it.
- **Components:** 407 Tailwind half-step classes (`gap-1.5`, `py-2.5`, `pl-3.5` …) across 86
  files moved onto it. `-0.5` (2 px) stays as a hairline nudge.
- **Rounding:** on an exact tie, padding rounds up and margins and gaps round down. A control's
  padding never shrinks, and the page doesn't loosen.
- **Touch targets:** comparing all 2,331 interactive elements at 390 px before and after, none
  became shorter than 44 px because of this. Two links reflowed onto one line, which is wrapping,
  not size.

**3. Large screens.** The root steps up at **1920 px (18 px), 2560 (22), 3200 (26) and 3840
(32)**. Because everything is in rem, type, spacing, the reading column and the figures scale
together. The root is a percentage, so a reader's own browser text size still multiplies it.

| Width | Body | Prose column | Register figure |
|---:|---:|---:|---:|
| 390 | 16.1 px | 339 px | 358 px |
| 1440 | 18 px | 717 px | **1,024 px** (was 736) |
| 2560 | 24.75 px | 987 px | **1,408 px** |
| 3840 | 36 px | 1,437 px | **2,048 px** |

- **Prose** keeps its measure, about 67 characters, at every width.
- **Figures** break out from 1440 px: register figures and visuals widen to
  `min(64rem, 100vw − gutters)`, centred on the 46rem column. Hero and full-bleed figures are
  excluded. The chapter body's `overflow: hidden` clipped the breakout, so from 1440 px it's
  `overflow: visible` with `display: flow-root`, which keeps the same block formatting context.
- **No horizontal scroll:** a check of all 31 routes at 390, 1440, 1920, 2560 and 3840 found
  no page scrolling sideways.

**4. Mobile rhythm.** At 390 px every chapter opens on its title, its line and real content in
the first screen (checked on `/workstreams` and a mid-document chapter on `/`). The chapter head's
own spacing (`1.5rem / 1rem` on phones) was already tight, so it's unchanged.

**5. Fixed along the way.** The header tagline was clipped at 11rem (176 px) on every screen, and
because the span was a flex box its ellipsis never showed. The tagline now has the room it
needs: 12rem on phones, which fits the full 181 px line at 360 and 390 px, and no cap from
640 px. On a narrower phone it ends in a proper "…".

**Not done: unifying the `--space-*` names.** The scale is applied as values; there's no new
token set alongside the existing `--rhythm` and `--pf-gutter` tokens, because a token nothing
reads would be dead code.

`check-preservation` passes with 138 protected files edited (82 before this workstream). The 56
new ones are class-string edits only: Tailwind px → rem, and half-step spacing classes moved onto
the scale. No record, strategy or solution count changed, and no file under `content/`,
`public/content/` or `public/data/` changed.
