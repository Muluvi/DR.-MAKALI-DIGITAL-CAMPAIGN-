# Consolidation pass, November 2026: decision log

Every judgement call this pass made, the rule it applied, and where the change landed. Steps follow
the consolidation brief: Step 0 set-up, Step 1 contradictions, Step 2 one source per number, Step 3
the legacy figure system, Step 4 section merges, Step 5 the model reads the site, Step 6 guards.

The owner's standing rules are cited by number:

1. No text is removed unless a visual or a link takes over its job.
2. No new polling or data collection.
3. No campaign-finance ceilings, Firefly budget tiers or fee figures.
4. No document-style numbering visible to readers.
5. One scrolling story, one general-election lens.
6. Every figure keeps its provenance.
7. The site stays open.
8. Visual-first, for high-end phones.

## Step 0: set-up

### Baseline (main at 2f29920, 1 November 2026)

| Check | Result |
|---|---|
| `npm ci` | pass |
| `npm run verify` | pass (all guards; `check:content` checks 3, 4, 5, 9 and the preservation guard) |
| `npm run lint` | pass |
| `npm run build` | pass (`/[[...slug]]` 91.3 kB, 384 kB first load) |

`main` was green, so Step 0 needed no repair.

### D0.1 The pass's content base is 2f29920

The brief asks for `CONTENT_BASE` set to the Step 0 commit. Step 0 changes no file under `content/`,
so the content at 2f29920 (the `main` it branched from) is byte-identical to the content at the Step 0
commit, and 2f29920 is a stable, already-published id. The base is set to 2f29920.
Rule applied: the check must weigh this pass's own changes, and nothing else.

### D0.2 The restructure's check keeps running, with this pass's ledger added to it

`check:content` already weighs the content against a767371 (the restructure) with
`docs/restructure-2026-11/ledger.json`. Rather than replace that run with a new base, this pass
**adds** a second run against 2f29920 and keeps the first one, feeding it both ledgers.
`scripts/declutter/sections.mjs` `loadCuts()` now accepts a comma-separated `CONTENT_LEDGER`. The
earlier check is no weaker: every entry it read before, it still reads.
Rule applied: never weaken a verification check.

### D0.3 Re-measured: there are no conflict markers left

The brief says to keep "the 27 conflict markers". Re-measured at 2f29920: content holds **0**
`[CONFLICT Cn: see open items]` markers. All eight (C1 to C8) were settled by logged decision in #47
(`docs/disputes-resolved.json`), and check 9 already fails if a settled marker returns or an
unsettled one moves. Nothing to preserve, and check 9 stays in the chain unchanged.
The figure fences are re-measured at **92**, and the text-version fences at **5**; both are held by
check 3.

### D0.4 What `scan-literals.mjs` counts, and why it reports fewer copies than the audit

The audit counted 269 of 629 registry figures restated as literals. That count included small
values (2, 3, 6, 40, 60.8 and similar), which match CSS weights, list counts, layout numbers and
percentages that are not copies of anything. A guard that fires on those cannot be made to pass
honestly, so the scan counts only literals of **1,000 or more**, excluding **years 1900 to 2100**,
in code, strings and prose, with comments, tests, generated files and the registry's own sources
skipped. A literal is graded `exact` (equals a registry value as printed) or `rounded` (equals a
registry value rounded to the nearest thousand, for values of 10,000 or more).

Baseline, written to `literals-before.json`:

- 293 files scanned, 299 distinct registry values of 1,000 or more
- **220 exact** and **20 rounded** copies, in **62 files**, of 81 distinct values

The small counted values the scan cannot see ("six risks", "four pillars", "five indicators") are
covered by the Step 6 contradiction check instead, which reads each count from its data source.
Rule applied: a guard must be satisfiable without suppressing true positives.
