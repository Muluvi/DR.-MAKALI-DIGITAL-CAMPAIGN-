# Disputed figures and versions: what was chosen, and why

Decided 1 November 2026, at the owner's instruction to choose the most appropriate value for every
area where the document stated a figure or a position two ways. Until now each dispute was shown
with both versions and an "under review" flag (`[CONFLICT Cn]` in the content, `UnderReview` on
figures). Each is now settled in the content and the figure data; the rejected version is recorded
here, so nothing is lost.

## How the choice was made

1. A certified or legal Tier 1 source beats a modelled, derived or reported one.
2. A value read from the register beats a summary of it.
3. On policy, the version consistent with the document's own headline commitments, and with the
   law, wins.
4. Where the law is unconfirmed, the reading that cannot get the nomination rejected is used, and
   the confirmation stays flagged.

## Content conflicts (C1–C8, from `docs/restructure-2026-10/OPEN-ITEMS.md`)

| | Dispute | Chosen | Rejected | Why |
|---|---|---|---|---|
| **C1** | Language: 50/30/20 content mix vs 76/16/8 reach vs 80/20 SMS vs ≥ 4 of 7 Kikamba-first | All four kept, each with its job stated: **50/30/20 governs what is published**; 76/16/8 describes who speaks what; SMS is Kiswahili/English; 4 of 7 (57%) sits above the 50% floor | — (they measured different things) | Rule 3. §12.4 now says which number governs |
| **C2** | Kikamba on 2G bulk SMS vs bulk political SMS in English/Kiswahili only | **English or Kiswahili only** | Kikamba on bulk SMS | Rule 1: Communications Authority rule (Tier 1), and GSM-7 cannot encode ĩ or ũ |
| **C3** | Workstream ownership 7/6/2 vs 6/6/2 | **7 Firefly / 6 your team / 2 outside, Workstream 1 shared** | "six Firefly operates" (§22) | Rule 2: the workstream register (`lib/register/specs/s5-implementation.ts`) assigns WS 1, 3, 4, 9, 11, 12, 14 to Firefly |
| **C4** | Firefly manages the owned platforms daily vs Firefly publishes nothing | **Firefly publishes nothing and holds no credentials**; your team runs the platforms to Firefly's brief | Firefly's daily management (§15.1 run-in) | Rule 3: the headline commitment in In brief, §13.2 and §13.3 |
| **C5** | Tracker scope: citizen-report register vs NG-CDF showcase + 2027–32 investment tracker + post-election dashboard | **Citizen-report register, with his verified NG-CDF record as proof**; the post-election dashboard is a pledge he may make, not a deliverable | The 2027–32 investment tracker and the Treasury-integrated dashboard as campaign deliverables | Rule 3: §15.1's own principle, "never implying powers he does not hold" |
| **C6** | Ward Development Equalization Fund: KSh 100m per ward guarantee vs needs-weighted formula | **One published, needs-weighted allocation formula** | The equal-ward guarantee (≈ KSh 4.0bn a year, 29% of the envelope), withdrawn from copy and kept in §10 as the option not taken | Rule 3: Firefly's recommendation, the verification pillar, and §10's own finding that the guarantee and the argument against equal-ward allocation cannot both be run |
| **C7** | Station lists differ | **The §4.2 ownership map** ("This table governs") | Sang'u FM, which appears in no ownership source, leaves the §11.2 and §20.2 operating lists; §20.2 monitors Syokimau FM, which the map marks "monitor closely" | Rules 1 and 2. Citizen Radio and Mwatu FM stay in §4.4 as measured audience shares |
| **C8** | 2022 ballots: 328,760 certified vs 328,712 modelled | **328,760 certified valid votes** (IEBC Form 37C) | 328,712 (register × 61.7%, a rounding artefact of the rate) | Rule 1. `ballots.2022` now equals the certified count; 200,000 is 60.83% of it, still printed as 60.8%. The modelled method stays for 2026 |

## Figure-level conflicts (from `docs/visual-audit/CONFLICTS.md`)

| | Dispute | Chosen | Why |
|---|---|---|---|
| **C-5** | "5 of top 8 wards" vs "5 of the top 11" | **5 of the top 11, 4 of them in the top 8** | Rule 2: Ikanga/Kyatune ranks 11th on the register |
| **C-6** | 51.72% vs 51.73% | **51.73%** | 275,570 / 532,758 = 51.7252%, correctly rounded |
| **C-7** | 24 vs 21 deficit wards | **21** | Rule 2: the pool (Mwingi + Kitui South) excludes the three Kitui East wards the 24 added |
| **C-21** | As C2 | As C2 | Rule 1 |
| **C-22** | 500 signatures per sub-county (4,000) vs 500 from at least 5 of 8 (500) | **500 from each of the 8 sub-counties, 4,000 in all** | Rule 4: a paper short of the statutory count is rejected, a surplus is not; the 10,000 Field Ops roll clears either reading. The statutory figure is still confirmed with counsel before filing |

## "Two published values — one preferred"

Three figures already had a preferred value with a stated reason; the choice stands and the panel
now shows only the chosen value, with the rejected one in a single "Not used" line:

| Figure | Chosen | Not used |
|---|---|---|
| Kitui Central population, 2019 | 105,991 (KNBS census, Tier 1) | 175,633 (NG-CDF website) |
| David Musila, 2022 governor votes | 117,606 (IEBC Form 37C via Nation Africa; matches the certified 35.77% share) | 114,606 (The Star, early media total) |
| Kitui FY2025/26 Q1 development absorption | 18% (Controller of Budget, the statutory source) | ≈ 5% (media reports) |

## What was not changed

- No figure value in `lib/data/figures.ts` changed except `ballots.2022` (now the certified count)
  and the benchmark share computed from it; every published rounded figure is unchanged.
- Policy and legal confirmations that remain open stay flagged: the statutory signature count,
  the Wiper nomination timelines (`[Requires legal confirmation]`), and every `[VERIFY]` item.

## How the checks were kept honest

- `scripts/declutter/check-content.mjs` check 9 now lets a `[CONFLICT Cn]` marker leave the content
  only when `docs/disputes-resolved.json` lists Cn as settled, and fails if a settled conflict is
  still marked anywhere. Checks 3 and 4 weigh the base text without retired markers (they are
  markup, not prose), and accept the one textversion edit the C5 decision required only as the
  exact text logged under `fenceEdits`.
- Wording a decision changed in prose is logged as a cut in `docs/restructure-2026-11/ledger.json`
  (the C6 SMS sample, the C8 universe row), so word conservation still balances section by section.
- `scripts/restructure-2026-11/check-preservation.mjs` excuses the word "CONFLICT" once conflicts
  are settled, and a figure token only in the file a decision names (`retiredTokens`: the ward-fund
  figure in the C6 SMS sample, still on record in §10).
- `lib/inline-marks.test.ts` asserts that no settled conflict is still marked, and still tests that
  an unsettled marker becomes a chip.

`npm run verify`, lint, the figure tests (35) and a production build pass. Scanning the full
document (`/full`) finds no "under review" or "two versions" flag left on any page.
