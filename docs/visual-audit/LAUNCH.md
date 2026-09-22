# What remains: merge, then launch

Everything below was checked against the branch as it stands at `d6de0c7`, not recalled from the
brief. Where a number appears, the command that produced it is named.

The list is ordered by **what blocks what**, not by size. Three things block the merge. Five block
sending the link to Dr. Mulu. The rest is work that can happen while the document is in his hands.

---

## A. Before merging to `main`

`main` deploys to Vercel on push. These three are the difference between a merge and a publication.

### A1. There is no CI. Nothing runs the guards. — **Firefly, 1 hour**

`.github/` does not exist. `npm run verify` — eleven guards and 38 arithmetic assertions — runs
only when somebody remembers to type it. The content-integrity guard, the figure-retention guard
and the duplicates guard exist precisely to catch a change nobody meant to make, and right now a
push that breaks all three deploys anyway.

**Do:** a GitHub Actions workflow on `pull_request` and on `push` to `main` running
`npm ci && npm run verify && npm run build`. Node 22 (the test script needs
`--experimental-strip-types`). Make it a required status check on `main`.

**Why first:** every other item on this list is easier to get wrong than to get right, and this is
the thing that notices.

### A2. First-load JS is 33 kB over the budget the audit set itself — **Firefly, half a day**

458 kB at baseline, **491 kB now** (`npm run build`). §2.7 of `REPORT.md` has the mechanism:
`MarkdownViewer` is a client component and imports the figure registry, which eagerly imports all
eight figure data modules, so ~258 kB of figure source is compiled into the client bundle to render
something the browser never changes.

**Do:** render the figures on the server and pass them into `MarkdownViewer` as a map of ready
React nodes. Contained change, obvious test — the build's First Load JS line must come back under
458 kB.

**Judgement call:** this is not a correctness bug and the site is fast (LCP 2,088 ms on `/`, INP
120 ms). If the link has to go out this week, merge without it and do it next — but do not let it
become permanent, because it gets harder as figures are added.

### A3. Decide whether the confidential document should be password-protected — **campaign decides**

There is no `middleware.ts` and no authentication. `noindex, nofollow` keeps the site out of search
results; it does nothing about a forwarded link. A document headed *"Confidential — personal,
link-only"* is currently readable by anyone who receives the URL, and WhatsApp forwards are the
distribution channel §3.6.2 builds the whole strategy on.

**Options, cheapest first:** Vercel Password Protection (a project setting, no code); a
`middleware.ts` checking a shared secret in a cookie or query string; or accept the risk explicitly
and record it in `DECISIONS.md`.

**This is a campaign decision, not an engineering one.** But it should be a decision, not an
oversight — and it belongs before the link exists, not after.

---

## B. Before the link goes to Dr. Mulu

### B1. Answer C-2 — **Firefly drafts, campaign approves**

The §2.2 simulator says +1.2 points a week over 14 weeks reaches 38.9% and overtakes Irene Kasalu.
The 14 weeks run from the 7 August poll; about 8.3 remain. At the same rate that reaches **32.0%**,
below her 37.4%, so *"overtakes Irene Kasalu … establishes an undeniable mandate"* does not hold as
written. Overtaking her from today needs +1.85 a week; the 40% benchmark needs +2.16, against a
slider whose maximum is 2.5.

This is the first thing a numerate reader will test, and the document currently loses that test.
Either the window is restated from today, or the claim is softened, or the rate is defended. All
three are fine; the current state is not.

### B2. Answer C-21 and C-22 — the two with statutory deadlines — **campaign, with counsel**

- **C-21:** §7.3.1 lists 2G bulk SMS among Kikamba's channels. §8.10.2 states, citing the
  Communications Authority at Tier 1, that political bulk SMS is restricted to English or Kiswahili
  and that an operator may **refuse** a non-compliant message, 48 hours after it was lodged. Six
  other places in the document agree with §8.10.2. §8.10.2's own wording — *"this changes the
  channel plan, not the language strategy"* — reads as the resolution already written down.
- **C-22:** §13.5 asks for 500 nomination endorsement signatures **per sub-county** (4,000 across
  eight); §13.5.1 asks for 500 **in total** across at least five. A nomination paper short of the
  statutory count is rejected, and the rejection is not appealable on the basis that the campaign's
  own brief said 500. The answer is in the Elections Act regulations §13.5.1 cites.

### B3. Read the other 19 conflicts and mark each: correct, or leave — **Firefly, 2 hours**

`CONFLICTS.md` carries 22, each checked against the source. Most are small — a rounding (C-6, C-18),
a stale heading number (C-19), a tier label that disagrees with itself (C-8, C-9). Every figure that
touches one already renders an **Under review** flag pointing at the entry, so the site is honest
today. But twenty-two visible flags is itself a statement, and the ones that are simply wrong should
be corrected rather than flagged.

**Suggestion:** C-6, C-18 and C-19 are arithmetic or typography with one right answer. Fixing those
three removes three flags for about twenty minutes of work.

### B4. Fill or defend the 32 placeholders — **campaign supplies, Firefly places**

Counted across `public/content/`:

| Placeholder | Count | Who can close it |
|---|---:|---|
| `[Insert shortcode]` / `[Insert sender ID]` | 7 | The aggregator, at contracting |
| `[DATA NEEDED …]` | 8 | Week 1 exports and instruments |
| Named appointments — counsel, facilitator, interpreter | 4 | The campaign |
| Thresholds and SLAs marked *recommend …* | 4 | Firefly recommends, campaign sets |
| Other `[Insert …]` / `[VERIFY …]` | 9 | Mixed |

**These are a feature, not a defect** — the document is scrupulous about marking what it does not
know, and §11.2.2 prints "pending the ledger" in the cell where a number would go rather than
estimating. That discipline is worth more to a professional reader than a confident-sounding gap.

**But some read badly to a candidate.** `[Insert additional authentic Kikamba proverbs … working
drafts, not verified copy]` sitting in the messaging annex is honest and is also the kind of thing
Dr. Mulu will notice first. Decide per placeholder: fill it, or add one clause saying who closes it
and when.

### B5. Give the site a favicon and an app icon — **Firefly, 20 minutes**

There is no `app/icon.*`, no `apple-icon`, no favicon. A link-only document opened from WhatsApp
shows a blank page icon in the tab and a generic glyph on a phone home screen. The `og:image` card
was built (1200×630, typographic, no third-party fetch); the icon was not.

---

## C. Worth doing before the campaign relies on it

### C1. Check the `og:image` host on the real domain — **Firefly, 15 minutes**

`app/layout.tsx` resolves `SITE_ORIGIN` from `process.env.VERCEL_URL`, falling back to
`dr-makali-digital-campaign.vercel.app`. On Vercel, `VERCEL_URL` is the **deployment** URL
(`…-abc123.vercel.app`), not the production domain. WhatsApp and Slack fetch `og:image` as an
absolute URL, so a preview card generated from a deployment host will point at a URL that may not
be the one the reader has.

**Do:** if a custom domain is used, set `NEXT_PUBLIC_SITE_ORIGIN` to it and prefer that over
`VERCEL_URL`. Then send the link to yourself on WhatsApp and look at the card. This is a
thirty-second test that catches a class of bug nothing else does.

### C2. Bring INP on `/full` under 200 ms — **Firefly, half a day**

Measured at 4× CPU throttle by `scripts/measure-visual-baseline.mjs`:

| Control | `/full` |
|---|---:|
| Open a figure's data table | **272 ms** |
| Brief → Full | 200 ms |
| Full → Brief | 160 ms |
| Open a cross-reference | 104 ms |
| Open a subsection disclosure | 88 ms |

`/` — the route a reader arrives on — is **120 ms** and fine. `/full` is **304 ms** because it holds
30 chapters and 60 figures in one DOM. A2 above will help: less client JS is less main-thread work.
Beyond that the remedies are a CSS-driven reading mode or virtualising `/full`.

**Not urgent.** `/full` exists for printing and for a reader who wants the whole thing; nobody
scrolls it on a phone deciding whether to hire Firefly.

### C3. Add automated accessibility checks — **Firefly, 2 hours**

There is no `eslint-plugin-jsx-a11y` and no axe run. The accessibility work in this pass was done by
hand and by reasoning — real tables with scoped headers, no colour-only encoding, labelled marks,
44 px targets — and hand work is exactly what regresses silently.

**Do:** `eslint-plugin-jsx-a11y` in the lint config, and `@axe-core/playwright` over the 23 routes
in the same sweep that already checks for sideways scroll and figure placeholders. Add both to A1's
workflow.

### C4. Delete two unused components — **Firefly, 5 minutes**

`components/AskButton.tsx` and `components/charts/ResourceLedgerBarChart.tsx` are imported nowhere.

### C5. Write a README — **Firefly, 30 minutes**

There is none. Somebody who is not Firefly will eventually open this repository, and what they need
is four paragraphs: what the site is, `npm install && npm run dev`, what `npm run verify` protects
and why it must stay green, and where `docs/visual-audit/` is. Pin Node 22 in an `engines` field
while you are there — the test script needs it.

---

## D. Standing, after launch

- **Verify the media ownership map before any placement is booked.** §3.7.1 already says so, and
  **C-20** is the reason it matters: §3.7 files Musyi FM under hostile gatekeepers while §3.7.1
  gives it the placement budget. Two stations the same diagram names, Sang'u FM and Mang'elete, are
  in no ownership map at all.
- **Re-run `node scripts/measure-section-heights.mjs` after any change that moves a lot of prose.**
  Stale reservations cost a deep link its landing position. They were stale for most of this pass
  because the script could not be run as its own documentation instructed.
- **Keep the guards green.** Four of the eleven were written or repaired by this work, two of them
  after a bug they should have caught had already shipped. `verify-figure-fences` exists because a
  malformed fence rendered an error banner where a retired ASCII block used to be, and neither
  existing guard could see it.
- **Every figure is one retirement declaration.** Adding one means a `figure` fence, a registry
  entry, and an entry in `figure-retirements.json` with the checklist of facts it is held to. The
  guards enforce the first two; the third is the discipline that makes the first two mean something.

---

## The short version

**To merge:** CI (A1). Decide on access (A3). Optionally fix the bundle first (A2).

**To send to Dr. Mulu:** C-2 (B1), C-21 and C-22 (B2), a pass over the other conflicts (B3), a
decision per placeholder (B4), a favicon (B5).

**Everything else can follow the link.**
