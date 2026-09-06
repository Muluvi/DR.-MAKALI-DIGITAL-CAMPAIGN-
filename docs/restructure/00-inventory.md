# 00 — Inventory (Phase 0 recon)

Read-only pass. No source file was modified. Branch: `claude/restructure-logical-spine-ggafjj`
(clean tree, 47 commits ahead of `main`, 0 behind).

---

## 1. Toolchain — three of the brief's stated facts are wrong

| Brief says | Repo actually has | Consequence |
|---|---|---|
| Package manager **bun**, `bun.lock` present | **npm**, `package-lock.json` (226,950 bytes). No `bun.lock` anywhere in the tree or history. | Phase 8's `bun install --frozen-lockfile` must become `npm ci`. |
| `.eslintrc.json` + `eslint.config.mjs` | Both present. `.eslintrc.json` is 24 bytes and inert under ESLint 9 flat config; `eslint.config.mjs` is the live one. | No action; noted so it is not mistaken for a second config to keep in sync. |
| `assets/.aistudio` | Exists but contains only `.gitignore` with `*` — i.e. deliberately empty. | Nothing to review. |
| `hooks/`, `lib/`, `public/content/` | All present. Also present and unlisted in the brief: **`data/`** (13 files) and **`scripts/`** (3 build-guard scripts). | `data/` and `scripts/` are load-bearing; see §6. |

**Real script names** (`package.json`):

- `dev` — `next dev -H 0.0.0.0 -p 3000`
- `prebuild` — `node scripts/verify-ward-register.mjs && node scripts/verify-figures.mjs`
- `build` — `NODE_ENV=production next build`
- `lint` — `eslint .`
- `verify` — the two guard scripts, standalone
- **There is no `typecheck` script.** Types are checked inside `next build`
  (`typescript.ignoreBuildErrors: false`). Standalone check is `npx tsc --noEmit`.

**Baseline, run just now on a clean `npm ci`:**

```
npm ci          → added 541 packages in 25s
npm run build   → ✓ Compiled successfully in 19.6s; 4/4 static pages; / = 296 kB, 399 kB First Load
npm run lint    → exit 0, no output
npx tsc --noEmit→ exit 0, no output
```

The tree is green before I touch it.

---

## 2. Routing model — this is the single most consequential finding

**There is one route.** `app/` contains exactly four files: `globals.css`, `layout.tsx`,
`not-found.tsx`, `page.tsx`. No route groups, no `[slug]`, no per-part routes.

- `app/page.tsx` is a server component. It reads all ten markdown files from
  `public/content/`, builds the section index from them, renders each through
  `MarkdownViewer` **on the server**, and hands the ten rendered trees to `ClientPage`.
- `ClientPage` is a client component holding `activeTab` state. All ten parts are rendered
  into the tree at once; navigation is **tab switching plus scroll**, not routing.
- Deep links are **URL fragments only**: `#<tab>-sec-<slug>`, e.g. `#race-sec-1-3-2`.
  Resolved client-side on mount by reading `window.location.hash`.

### Why this breaks the brief's Phase 6 instruction

The brief says: *"Prefer `next.config.ts` redirects with a complete old→new mapping."*

**A `next.config.ts` redirect cannot preserve a single one of this document's deep links.**
The fragment is never transmitted to the server — browsers strip everything from `#` onward
before issuing the request. Every existing deep link is a fragment on `/`. There is nothing
for a server redirect to match on.

The repo already solved this the only way it can be solved: `resolveLegacySectionId()` in
`lib/heading-slug.ts` — a client-side old-id → new-id map, consulted on mount and on every
in-document cross-reference click. It currently holds **413 legacy ids** across two prior
renumberings (an `exec-/programme-/registers-` three-tab generation, and before that a
six-tab `strategy/operations/tactics/execution/appendix` generation, handled by a separate
`TAB_ALIASES` table).

`next.config.ts` today contains **no `redirects()` at all**. This is a Gate 1 decision:
I intend to extend `LEGACY_IDS` rather than add server redirects, and to add server
redirects only if the target architecture introduces real per-part routes. Confirm.

---

## 3. Content storage — markdown, not TSX. The brief's stop-condition does not fire.

Ten files under `public/content/`, one per top-level part, loaded by `fs.readFile` in
`app/page.tsx` and parsed by `react-markdown` + `remark-gfm` + `rehype-raw` on the server.

| File | h2 | h3 | h4 | Words | Table rows | Fenced blocks |
|---|---|---|---|---|---|---|
| `0-overview.md` | 4 | 0 | 0 | 1,552 | 4 | 0 |
| `1-race.md` | 4 | 26 | 19 | 8,449 | 83 | 14 |
| `2-argument.md` | 9 | 27 | 12 | 8,115 | 35 | 34 |
| `3-channels.md` | 7 | 26 | 16 | 7,058 | 74 | 44 |
| `4-ground.md` | 5 | 24 | 5 | 3,409 | 53 | 16 |
| `5-defence.md` | 4 | 22 | 0 | 3,352 | 62 | 10 |
| `6-data.md` | 6 | 30 | 8 | 6,757 | 91 | 30 |
| `7-team.md` | 3 | 16 | 0 | 2,348 | 33 | 12 |
| `8-measure.md` | 5 | 25 | 2 | 4,597 | 86 | 18 |
| `9-ask.md` | 3 | 16 | 10 | 4,023 | 43 | 0 |
| **Total** | **50** | **212** | **72** | **49,660** | **564** | **178** |

**Word-count discrepancy vs the brief.** The brief states "approximately 43,000 words;
291 pages printed". The markdown corpus is **49,660 words** by `wc -w`. Neither "43,000"
nor "291" appears anywhere in the content or data. Not a blocker — but the 49,660 figure is
the one I will reconcile against in Phase 8, and no figure from the brief's preamble will
enter my output unless I can trace it to a numbered section.

**Prose is markdown; presentation is TSX.** No section prose is embedded in a component.
Components carry *derived* presentation of prose that also exists in the markdown (charts,
matrices, panels) — `DecisionPanel`, for instance, is explicit that its content is §9.3.5 and
§9.2.6 and that "nothing here is new". The one class of exception to watch: where a component
*replaces* a markdown table rather than sitting beside it (§4 below).

---

## 4. Section structure vs the brief's expected structure

I extracted every h2/h3 outside fenced blocks from all ten files and compared. **Every
numbered section the brief lists, 0.1 through 9.3.7, exists in the repo with the expected
number and sub-numbering.** No section is present in the repo but absent from the brief's
list, and none is absent from the repo.

Four headings differ in *wording* only (same content, same number):

| № | Brief's label | Repo's actual heading |
|---|---|---|
| 3.4 | Kamba-language radio ownership and gatekeepers | Earned media and the radio landscape |
| 3.6 | Language, register and production QC | Working in three languages |
| 7.2 | Team structure | The team and how it is structured |
| 1.2.5 | *(unlisted in brief detail)* | Who lives here, and what they can reach online |

Counts the brief implies and the repo confirms: 1.1 has .1–.6; 1.2 has .1–.10; 1.3 has .1–.6;
1.4 has .1–.4. §1.3.6 "What ward-level data we still do not have" is present, as promised.

**Numbering is fully derived, not hardcoded.** `lib/section-index.ts` parses the leading
number off each heading at build time; `lib/heading-slug.ts` turns `4.3.2` into `4-3-2`;
`sectionId(tab, slug)` produces `ground-sec-4-3-2`. The "Jump to" surfaces
(`MobileTOCModal`, `SectionStickyBar`, `MobileBottomNav`) all consume that derived index.
Renumbering the markdown headings automatically renumbers the index, the TOC and every id —
which is the good news and the trap, because of §5.

---

## 5. What is hardcoded to section numbers, and will break on renumbering

Three sites hold section ids as string literals. All three must be rewritten in lockstep with
any renumbering.

**(a) `components/MarkdownViewer.tsx` — `HEADING_INSERTS`, 38 keys.** This is the mount table
for nearly every interactive component: a `Record<"<tab>-sec-<slug>", ReactNode>`. Its own
comment records that this map has already been corrupted once ("several components used to be
keyed at two or three ids at once… that guesswork rendered the same chart up to three times").
If a heading number changes and this key does not, the component **silently stops rendering** —
no error, no build failure. This is the single highest-risk surface in the restructure.

**(b) `components/QuickNavCapsule.tsx` (7 ids) and `components/ClientPage.tsx` lines 122–126
(5 ids).** Two near-duplicate hand-written "most-asked-for sections" shortcut lists, using
*current* ids.

**(c) `components/InteractiveToolsHubModal.tsx` — 16 `sectionTarget` values, all stale.**
Every one is a *legacy* id (`exec-sec-1-1`, `programme-sec-21-19`, …) that only resolves
because `resolveLegacySectionId` catches it. They work, but they are already one renumbering
behind, and they are the reason that map must not be dropped.

Additionally, `MarkdownViewer` has five behaviours keyed on *content patterns* rather than
ids — `tabId === "race"` plus table-header matching (§1.2.5 platform table → `PlatformSizingBlock`;
§1.2.1 asset table → `ClaimCards`), `tabId === "overview"` for the Mizani table and the three
governing realities, `tabId === "ask"` for the closing `DecisionPanel`. **If a section moves to
a different file, its `tabId` changes and these silently stop firing.** In two of the five cases
the component *replaces* the markdown table, so the failure mode is a table reappearing where a
chart used to be — visible, but only if someone looks.

---

## 6. Build guards, and what they mean for content integrity

Two `prebuild` scripts, both of which the restructure must keep passing:

- **`scripts/verify-ward-register.mjs`** — asserts the 2022 IEBC ward register's arithmetic in
  `data/ward-register.json` (wards sum to constituency; constituencies sum to
  `countyTotalWards` 532,758; + 75 prison voters = `countyTotalWithPrisons` 532,833).
  Content-agnostic. **Unaffected by any restructure.**
- **`scripts/verify-figures.mjs`** — scans every `.ts`/`.tsx` under `components/` for
  numeric literals that look like campaign figures and fails the build if the figure does not
  appear in a corpus built from `public/content/*.md` plus `data/`. Corpus-based, not
  section-based. **Also unaffected by moving content between files** — but it will fail loudly
  if content is *lost*, which makes it a useful second net under Phase 8's word-count reconciliation.

There is a third script, `scripts/verify-content-integrity.mjs`, that is **not wired into any
npm script**. Flagged, not touched.

---

## 7. Content-integrity assets the brief asks me to protect

- **Placeholders awaiting a campaign decision: 20 instances**, matched by
  `PLACEHOLDER_PATTERN = /^\[(insert|confirm)/i` in `MarkdownViewer` and rendered with an
  `awaiting` `ClaimBadge`. Distribution: §2 ×2, §3 ×2, §4 ×3, §5 ×2, §6 ×3, §7 ×1, §8 ×5, §9 ×2.
  All survive a move unchanged (the pattern is text-local, not id-keyed).
- **Unmeasured-baseline honesty.** The literal string "baseline not yet measured" does not
  appear; the document expresses it as `Not yet` in KPI table cells (three in `8-measure.md`,
  against `≥ 55`, `≥ 60`, `≥ 70` targets) and as prose ("against the baseline once it exists,
  not against an assumed starting point"). **This is quieter than the brief implies** and is a
  candidate for Phase 4's "make it more visible".
- **§1.3.6 data-gaps register** present in `1-race.md`.
- **Confidentiality framing**: `app/layout.tsx` sets `robots: { index: false, follow: false }`.
  Present and correct.
- **Cross-references in prose: 173 occurrences of "Section N.N", 82 distinct targets.** These
  are plain prose, resolved at render time by `crossSectionTarget()` reading the leading digit
  to pick the file. **Renumbering a section silently re-points every prose reference to it** —
  and, worse, a reference to old §6.5.4 (12 occurrences, the most-referenced target in the
  document) would resolve to whatever new §6.5.4 happens to be. This is the second highest-risk
  surface after `HEADING_INSERTS`.

---

## 8. Interactive components — where each lives today

The four the brief names in scope:

| Component | File | Mounted at | Reads |
|---|---|---|---|
| Nomination viability simulator (`PollingTrajectorySimulator`) | `markdown/PollingTrajectorySimulator.tsx` | `overview-sec-0-1` — §0.1 | inline; hub id `polling-sim` |
| Budget-tier reallocation slider (`BudgetScenarioModeler`) | `markdown/BudgetScenarioModeler.tsx` | `ask-sec-9-2-5` — §9.2.5 | inline; hub id `budget-modeler` |
| Ward-level charts (`WardCartogramBlock`, `PathTo200kBlock`, `ConstituencyWeightBlock`) | `markdown/` + `charts/` | `race-sec-1-2-3` — §1.2.3 (all three) | `data/ward-register.json` |
| Campaign Focus Mode | `StrategicAids.tsx:126` | `ClientPage` — per-section strip (suppressed on `overview`) + header toggle | local state |
| Print-to-briefing-kit | `StrategicAids.tsx:529` (`PrintReportGenerator`) | `ClientPage:368` — **only on the `ask` section**, and only when focus mode is off. Also a header `Print` button at `ClientPage:570` | `window.print()`; two `@media print` blocks in `globals.css` (lines 893, 1070) |

Full `HEADING_INSERTS` mount table (38 keys) is in `MarkdownViewer.tsx:196–295`; I will
reproduce it as a migration column in Phase 5 rather than duplicate it here.

Data sources under `data/`: `ward-register.json` (+ `.ts` wrapper with a load-time assertion),
`competitors`, `disputed-figures`, `drought-food-security`, `electoral-history`,
`external-figures`, `fiscal-audit`, `media-ownership`, `mui-basin`, `nomination-path`,
`sources`, `spending-ceiling`, `terminal-showcase`, `types`.

---

## 9. Progressive disclosure already exists

`lib/collapse-groups.ts` folds long sections at render time, **rule-driven, not by a section
list** (≥2 h4 panels and ≥150 words → disclosure group; no sub-headings but ≥250 words and a
≥6-line unbroken prose run → fold after the lead, if ≥150 words would be hidden). It has one
explicit carve-out: the closing section's final block — the ask — is never folded.

This matters for Phase 6: the existing mechanism is content-shape-driven and will re-derive
itself correctly after a restructure with no edits. Any new disclosure I propose should extend
these rules rather than add a hardcoded list, because — as the file's own comment says —
"every hardcoded section list in this repo had drifted out of date by the time anyone looked at it."

---

## 10. Confidentiality exposure

Four observations, one of which I consider material.

1. **`public/AUDIT-FINDINGS-PROMPTS-A-AND-B.md` is served publicly.** It is byte-identical to
   the root `AUDIT-FINDINGS-PROMPTS-A-AND-B.md`, an internal engineering audit naming the repo
   (`Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-`) and enumerating the codebase's defects. Anything in
   `public/` is a static asset on the deployed origin: it is retrievable at
   `/AUDIT-FINDINGS-PROMPTS-A-AND-B.md` by anyone with the link-only URL. **Recommend removing
   the `public/` copy** (the root copy stays; nothing imports the public one — verified).
   Out of scope for the restructure itself; raising it because the brief asks me to.
2. **The full confidential document is retrievable as raw markdown** at
   `/content/0-overview.md` … `/content/9-ask.md`. This is inherent to serving content from
   `public/`, and `noindex/nofollow` is a meta tag that does not apply to a raw `.md` fetch.
   Whether that matters depends on how strictly "link-only" is meant. Not a defect I would fix
   unilaterally — it would mean moving content out of `public/` and changing the loader, which
   is a scope decision for Gate 1.
3. **The repository is on GitHub as `Muluvi/DR.-MAKALI-DIGITAL-CAMPAIGN-`.** I have not been
   able to confirm its visibility setting from inside the working tree; if it is public, both
   items above are already public regardless of the deployment.
4. **No secrets.** `.gitignore` covers `.env*` with an `!.env.example` exception.
   `.env.example` contains no values — it explicitly documents that the inherited
   `GEMINI_API_KEY`/`APP_URL` were removed because nothing reads them. A filename scan across
   **all** history (`git log --all --name-only`) for `.env`, `secret`, `credential`, `*.pem`,
   `*.key` returns only `.env.example`. `metadata.json` still declares
   `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` from the AI Studio scaffold — inert, no key.

---

## 11. Branch discrepancy

The brief's Ground Rule 5 specifies branch `restructure/logical-spine`. The session's standing
instruction designates `claude/restructure-logical-spine-ggafjj`, which already exists locally
and on `origin`, is checked out, and is clean. **I am working on the designated branch** and
treating Rule 5 as satisfied in spirit. Say so if you want the other name.

---

## Blocking questions for Gate 1

1. **Deep-link preservation mechanism.** Confirm: extend `LEGACY_IDS` in `lib/heading-slug.ts`
   (the only mechanism that can work for fragment-only links), *not* `next.config.ts` redirects.
   Server redirects come into play only if you want real per-part routes — which is a separate,
   larger question I raise in Phase 6, not something I will introduce on my own.
2. **Single route or real routes?** The document is one page with ten tabs. A five-part spine
   could stay that way (cheapest, preserves everything) or become `/1-objectives` … `/5-execution`
   (better mobile deep-linking and print scoping, but every fragment link needs a path *and* a
   fragment, and the 413-entry legacy map needs a route-aware equivalent). I have a
   recommendation; I will make it in Phase 6. Flagging now because it changes Phase 4's shape.
3. **Renumbering vs re-ordering.** Renumbering headings re-points all 173 prose "Section N.N"
   cross-references *and* invalidates 38 `HEADING_INSERTS` keys, both silently. I can either
   (a) renumber and mechanically rewrite all three surfaces, or (b) keep the existing numbers
   as stable identifiers and change only order and grouping. These produce very different
   diffs and very different risk. I will argue one in Phase 3/4 — but if you have a preference,
   now is the cheapest moment to say it.
4. **`public/AUDIT-FINDINGS-PROMPTS-A-AND-B.md`** — remove the public copy? (Item 10.1.)
