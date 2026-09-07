# 08 — Verification (Phase 8)

Run on the branch after the last implementation commit, from a clean `node_modules` and a
deleted `.next`. Output is copied verbatim.

**The brief's commands do not exist in this repo.** There is no `bun` and no `bun.lock`
(package manager is npm), and there is no `typecheck` script. The equivalents actually run are
`npm ci`, `npm run build`, `npm run lint`, `npx tsc --noEmit`, plus the four build guards.

---

## 1. Clean install

```
$ rm -rf .next && npm ci --no-audit --no-fund
added 541 packages in 29s
```

## 2. Build guards

```
$ npm run verify

Ward register integrity check passed: 40 wards across 8 constituencies sum to 532758 (532833 including 75 prison voters).
Figure verification passed: every numeric literal in the UI traces to the source,
and every illustrative interface number is declared in the phone-showcase register.
verify-mounts: 39 mount points all resolve (262 headings indexed).
verify-deep-links: 608 legacy ids and 262 live ids all resolve.
```

Two of those four are new (`verify-mounts`, `verify-deep-links`) and run in `prebuild`.

## 3. Production build

```
$ npm run build
 ✓ Compiled successfully in 14.9s
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (4/4)
   Finalizing page optimization ...

Route (app)                                 Size  First Load JS
┌ ○ /                                     298 kB         401 kB
└ ○ /_not-found                            124 B         103 kB
+ First Load JS shared by all             103 kB
```

Baseline before the restructure was 296 kB / 399 kB. **+2 kB**, all of it from disclosure and
fold bodies now rendering into the DOM so the printed briefing kit is complete.

## 4. Lint and typecheck

```
$ npm run lint
(no output)
lint exit: 0

$ npx tsc --noEmit
(no output)
tsc exit: 0
```

## 5. Every route resolves

One route, as before; the nine content files are static assets.

```
/                          200
/content/1-decision.md     200
/content/2-evidence.md     200
/content/3-strategy.md     200
/content/4a-publishing.md  200
/content/4b-ground.md      200
/content/4c-defence.md     200
/content/4d-technology.md  200
/content/4e-team.md        200
/content/5-delivery.md     200
```

## 6. Every old URL redirects — verified mechanically

`curl` against `npm start`, reading the status and `Location` header. Not inspected by eye.

```
/content/0-overview.md  308 -> /content/1-decision.md
/content/9-ask.md       308 -> /content/1-decision.md
/content/1-race.md      308 -> /content/2-evidence.md
/content/2-argument.md  308 -> /content/3-strategy.md
/content/3-channels.md  308 -> /content/4a-publishing.md
/content/4-ground.md    308 -> /content/4b-ground.md
/content/5-defence.md   308 -> /content/4c-defence.md
/content/6-data.md      308 -> /content/4d-technology.md
/content/7-team.md      308 -> /content/4e-team.md
/content/8-measure.md   308 -> /content/5-delivery.md
```

10 of 10.

## 7. Every old anchor resolves — verified mechanically

Fragments are never sent to the server, so these cannot be redirects. `verify-deep-links.mjs`
asserts both directions across the whole map, in `prebuild`:

```
verify-deep-links: 608 legacy ids and 262 live ids all resolve.
```

- every one of the **608** legacy ids resolves, through `resolveLegacySectionId`, to a heading
  that exists today (413 inherited entries re-pointed, 195 added for the ids this restructure
  retired);
- every one of the **262** live ids resolves to itself — i.e. no live id is accidentally
  captured by the compatibility map.

Spot-checked end-to-end in a real browser (Chromium, 390×844), cold load per link so the
mount-time hash effect actually fires:

```
ok   #programme-sec-31-7 -> #strategy-sec-8-5
ok   #exec-sec-1-1       -> #decision-sec-0-1
ok   #registers-sec-36   -> #evidence-sec-6-6
ok   #race-sec-1-3-2     -> #evidence-sec-1-3-2
ok   #ask-sec-9-2-5      -> #decision-sec-9-2-5
```

Three id generations, all landing.

## 8. No internal link points at a path that no longer exists

The document's internal links are its 173 in-prose `Section N.N` references. They are resolved
against the generated section index, so a reference can only fail if its number does not exist —
and all 262 numbers survive the move (§10). Rendered and counted in the browser:

```
in-prose "Section N.N" links rendered on the decision part: 34
```

**Before this branch that number was 0**, on every part: the link regex matched four section
numbers (22.14, 29.1, 31.1, 31.7) that no longer exist in the document. This is a fix, not a
regression.

## 9. Interactive components still mount and receive their data

Driven in Chromium at 390×844, navigating to each component's new home and asserting it renders
real content, not an empty shell.

```
ok   nomination simulator        (decision-sec-0-1)
ok   objectives index            (decision-sec-8-1)
ok   budget tier modeller        (decision-sec-9-2-5)
ok   ward charts                 (evidence-sec-1-2-3)
ok   reach architecture          (evidence-sec-3-1)
ok   media ownership             (evidence-sec-3-4-1)
ok   ethics charter              (strategy-sec-6-5)
ok   service-delivery tracker    (strategy-sec-8-5)
ok   phase rail                  (delivery-sec-8-3)
```

38 section anchors checked across all nine parts, all present. One JS console error:
`favicon.ico 404`. There is no favicon asset in `public/` and there never was — pre-existing,
unrelated to this work.

**Six components were found silently unmounted during implementation** — the audience matrix
(§2.4), reach architecture and phone showcase (§3.1), community scheduler (§2.7.4), media
ownership block (§3.4.1), ethics charter (§6.5) and service-delivery tracker (§8.5). The
production build was **green through all six**. `scripts/verify-mounts.mjs` was written for
exactly this and now fails the build on it.

## 10. No content lost — reconciled

| Measure | Before | After | Delta |
|---|---|---|---|
| Content files | 10 | 9 | −1 (`0-overview.md` dissolved into `1-decision.md` and `5-delivery.md`) |
| Words (`wc -w`) | 49,660 | **49,665** | **+5** |
| `##` sections | 50 | **50** | 0 |
| `###` sub-parts | 212 | **212** | 0 |
| Indexed headings | 262 | **262** | 0 |

Re-verified after the second pass (§6.1.2–.4 promoted into Part 2, `hashchange` handler added):
words 49,665, `##` 50, `###` 212, indexed headings 262, all guards green, full browser suite
passing including hashchange resolution on an already-open page.

**The +5 words, accounted exactly.** Each content file carries a one-line description of what
that part contains. Nine described the old grouping and were false after the move (e.g.
`2-evidence.md`'s said "four readings of the ground" for a part that now holds eight sections
including channel reach, segments, radio ownership and the statutory envelope). Eight were
rewritten and one was replaced by the document's title block: **224 words removed, 229 written.**

The migration script asserts the remainder mechanically and refuses to write otherwise:

```
48 whole sections + 2 split sections placed; none unplaced, none duplicated
words before=54381 after=54386 delta=5
  standfirsts: 224 words removed, 229 words written (9 part descriptions -> 8)
  body prose delta (should be 0): 0
```

**Body prose delta: 0.** Not one word of any section body was added, removed or altered.

Per-file after the move:

```
  6242 public/content/1-decision.md
 13502 public/content/2-evidence.md
  7291 public/content/3-strategy.md
  5924 public/content/4a-publishing.md
  3409 public/content/4b-ground.md
  3352 public/content/4c-defence.md
  4388 public/content/4d-technology.md
  1860 public/content/4e-team.md
  3697 public/content/5-delivery.md
```

## 11. `git diff --stat` — nothing unintended touched

35 files, +5,163 / −3,234. Grouped:

| Group | Files | Note |
|---|---|---|
| Content | 10 | 9 renames (git-detected) + `0-overview.md` dissolved |
| Docs | 7 | `docs/restructure/*` — Stage A artifacts |
| Nav / ids | `lib/heading-slug.ts`, `lib/collapse-groups.ts`, `lib/section-index.ts` (untouched) | `heading-slug` is +879/− almost entirely the regenerated 608-entry map |
| Components | 9 | `ClientPage`, `MarkdownViewer`, `MobileTOCModal`, `QuickNavCapsule`, `InteractiveToolsHubModal`, `DisclosureGroup`, `ProseFold`, `HighlightedText`, + 2 new |
| Build | `package.json`, `next.config.ts`, 2 new scripts | guards and redirects |
| Styling | `app/globals.css` | +12 lines, print rules only |

`components/charts/*` (14 files), all of `data/`, `hooks/`, `verify-ward-register.mjs`,
`verify-figures.mjs`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` and the design
system: **untouched**. No dependency added, removed or upgraded — `package.json`'s only change is
two script strings.

One near-miss worth recording: running `npx prettier --write` on `ClientPage.tsx` reformatted 894
lines. That was reverted and the edit redone by hand; the file's final diff is **+11 lines**.

---

## Summary against the brief's checklist

| Check | Result |
|---|---|
| `bun install --frozen-lockfile` | **N/A** — no bun in this repo. `npm ci` ✔ |
| lint and typecheck (real script names) | ✔ `npm run lint` 0, `npx tsc --noEmit` 0 |
| production build | ✔ 298 kB / 401 kB (+2 kB) |
| every route resolves | ✔ 10 of 10 |
| every old anchor and URL redirects, verified mechanically | ✔ 608 ids + 10 URLs, by script not inspection |
| no internal link points at a dead path | ✔ and 173 references now link for the first time |
| interactive components mount with data | ✔ 9 probed in-browser; 6 silent failures found and fixed |
| `git diff --stat` shows nothing unintended | ✔ |
| no content lost; counts reconciled | ✔ 50/50 sections, 262/262 headings, body prose delta 0 |
