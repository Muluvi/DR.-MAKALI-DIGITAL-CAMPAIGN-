# Decisions for Firefly

Each item has a **default already applied**, so nothing is blocked waiting for an answer. Changing
any of them is a small, contained edit — the point of writing them down is that they were choices,
not accidents, and Firefly should get to make them.

Two rules govern this file. **Nothing here changes a number, a claim or a tier** — those go to
`CONFLICTS.md` and stay untouched. And **no prose is deleted on a default**; where a default
collapses text, every word is still on the page, one tap away.

---

## D-1 — Duplicates: delete, or leave collapsed?

**Default applied: collapse to a `CrossRef`.** One line, a section link, and an expandable excerpt.
Nothing is deleted until Firefly says so, because rule 1b says a duplicate is collapsed and not cut.

The measured cost of leaving them: **718 words** across 11 blocks, all still rendered, plus the
component-level repetitions below which are not counted in that figure.

| # | Where | What | How close |
|---|---|---|---|
| 1 | §0.1 → §2.1 ¶3 | "Dr. Mulu is already in the conversation…" | **Verbatim** |
| 2 | §0.1 → §2.1 ¶4 | "Firefly supplies that layer…" | Near-verbatim |
| 3 | §0.1 → §2.4 opening | "What Firefly does not ask you to believe" | Near-verbatim |
| 4 | §0.2 → §3.3.2 | The counter-evidence the diagnosis must survive | Near-verbatim |
| 5 | §0.3 → §8.0.3 last ¶ | The Level 2 paragraph | Near-verbatim (also **D-3**) |
| 6 | §0.3, §2.4, §8.0 | six / six / two | Restated three times (also **C-12**) |
| 7 | §2.3 constraint 2 → §2.2 | The governing constraint | Restated |
| 8 | §3.3.3 → §3.4.3 Path A | "Mwingi bloc pivot" | Same finding, same numbers |
| 9 | §3.5 panel → §3.5.2 ¶1 | "Zone strategic imperative" | **Verbatim** |
| 10 | §13.2.2 → §13.4.2 | Both headed "Monitoring tools" | Same list, twice |
| 11 | §3.7.1 → §8.7.1 | Station ownership | Same table, twice |

Two statements repeat far more widely than the table shows, and both are load-bearing:

- **The Tier 3 "opinion poll, unconfirmed" statement — six places**: §0.1, §2.2, §2.3, §3.1, §3.1.1,
  §3.1.2. §3.1 becomes the canonical status card; the other five become a badge and a link.
- **The 86.4% / 13.6% statement — twelve chapters**, listed in **C-13**. This one cannot simply be
  collapsed, because the rate itself is disputed. It needs C-13 answered first.

**If you want deletion rather than collapse,** say which numbers above and it is one commit.

---

## D-2 — Reading mode default

**Default applied: Brief.**

Brief shows, per chapter: the blurb, each subsection's lead paragraph, every figure, every callout
(decision, caveat, tier status) and the bolded finding sentences. Everything else sits behind one
"Read the full section" disclosure per subsection. Full expands everything.

Nothing is removed in either mode — this is the mechanism that lets the document get shorter without
breaking the no-text-removed rule. Anchor links, search hits and print **always** open their target
in full, so a shared deep link never lands on a collapsed paragraph.

The choice persists in `localStorage`, guarded, and the hero carries both reading times, computed
from the segmentation the renderer actually uses rather than typed in:

> **Brief 121 min · Full 288 min**

Measured: Brief shows **26,438 of 63,337 words — 41.7%**. Nothing is deleted to get there.

**One honest compromise, which is Firefly's to overturn.** The brief asks for *one* "Read the full
section" disclosure per subsection. Where a folded block sat between two blocks Brief keeps — a
paragraph between two callouts, say — it moves below them, because one disclosure cannot hold
blocks interleaved with visible ones without either reordering them or splitting into several
controls. Several controls is worse: it turns a section into a row of drawers, which is the exact
failure the existing `DisclosureGroup` was written to avoid. Within the kept blocks and within the
folded blocks the document's order is untouched, and **Full restores the document's own order
exactly**. If Firefly would rather have strict order at the cost of several controls per
subsection, that is a change to one function (`splitBrief` in `lib/collapse-groups.ts`).

**The argument for Brief as the default:** this proposal is opened from a WhatsApp link, on a phone,
possibly on mobile data, by a reader deciding whether to spend an hour on it. 289 minutes is not an
invitation. **The argument against:** a reader who wanted everything now has to ask for it.

---

## D-3 — Hero order

**Default applied: race-first.** The gap, the window, the offline share, the threshold. The county
resource envelope (KSh13.79bn) moves into the strip rather than leading it.

The reasoning: the envelope is what the *office* is worth, and the hero's job is to say where the
*contest* stands. A reader who sees KSh13.79bn first has been told what winning is worth before
being told the race is 15.3 points behind.

This is a presentation call on Firefly's own pitch, so it is flagged rather than assumed.

---

## D-4 — Theme default

**Default applied: follow the device setting** (`prefers-color-scheme`), with the existing toggle
kept.

`<html class="dark">` is currently hard-coded, so every reader gets dark regardless of their phone.
Kitui is bright, much of this document will be read outdoors, and dark-on-bright is the harder read
in sunlight. If Firefly wants dark as the fixed default it is a one-line revert.

---

## D-5 — The 3D "four stages" figure

**Default applied: 2D, with 3D as an explicit desktop opt-in** — never under `Save-Data`, never on
coarse pointers.

Three reasons, in order of weight:

1. **Its labels contradict the argument** — see **C-15**. That is a content problem, not a
   performance one, and it does not go away in 2D; it is logged for Firefly.
2. It is the heaviest thing on the page for a reader on mobile data, and it renders above the fold.
3. 3D tilt is on the Phase 6 deny list for reading surfaces.

---

## D-6 — Heading fixes

**Nothing to fix in the content. The headings were never wrong.**

The brief listed three heading defects to be corrected or proposed:

| Where | Rendered as | Recorded as |
|---|---|---|
| §7.3 | "Langua register and dialect" | a typo to fix |
| §11.1.1 | "**Sta:** the nomination-window scorecard" | a truncation to propose |
| §11.1.2 | "**Sta:** the general election scorecard" | a truncation to propose |

Checked against `public/content/`. The markdown reads **"7.3 Language, register and dialect"**,
**"11.1.1 Stage 1: the nomination-window scorecard"** and **"11.1.2 Stage 2: the general election
scorecard"** — all three correct, and always were.

All three were corrupted **on the way into `data/section-visuals.generated.json`** by one
character in `scripts/build-section-visuals.mjs`:

```js
.replace(/\s*\$?\\?ge\s*[\d,]+\$?/g, "")
//              ^^ the backslash was optional
```

The line exists to strip LaTeX `\ge 55` left over from the source document's display math. With
the backslash optional it also matched the letters **"ge" inside any ordinary word** whenever a
comma or a number followed:

```
"Language, register and dialect"        ->  "Langua register and dialect"
"Stage 1: the nomination-window..."     ->  "Sta: the nomination-window..."
```

and was waiting for more — `"Percentage 40"` → `"Percenta"`, `"Coverage 78.8%"` → `"Covera.8%"`,
`"Large 12 wards"` → `"Lar wards"`.

**Applied: the backslash is now required.** Regenerating the file restores all three titles, and
no content was touched. There is nothing here for Firefly to approve, and nothing to fix by hand —
which is the useful part, because hand-editing the headings would have left the generator free to
corrupt the next one.

(No `\ge` notation currently survives anywhere in `public/content/` — `scripts/notation-rewrites.json`
converted the display math during the restructure — so the guard is now inert as well as correct.)

**Stale numbering inside §3.6** — the subsections are numbered as though they still sat in §3.1:

```
3.1.1.1  Platform Sizing & Realistic In-County Reach        (inside 3.6.1)
3.1.1.2  What Digital CAN Do                                (inside 3.6.1)
3.1.1.3  What Digital CANNOT Do                             (inside 3.6.1)
3.1.2.1  Kikamba Vernacular Radio                           (inside 3.6.2)
3.1.2.2  Direct 2G Bulk SMS & USSD Service                  (inside 3.6.2)
3.1.2.3  Mobile-Money (M-Pesa) Agent Network Strategy       (inside 3.6.2)
3.1.2.4  Open-Air Market Day Barazas & Caravan Circuits     (inside 3.6.2)
3.1.2.5  Church Fellowships & Clergy Engagement             (inside 3.6.2)
```

Proposed: renumber to 3.6.1.1–3.6.1.3 and 3.6.2.1–3.6.2.5. **Not applied**, and not a small
decision: §1.3 says section numbers are the document's addressing system, and the repo's own
`lib/heading-slug.ts` and `scripts/verify-deep-links.mjs` maintain 837 deep links against them.
Renumbering means a legacy-id mapping, not a find-and-replace.

The banner labels "SECTION 3.6.1:" and "SECTION 3.6.2:" inside the same chapter are the same
question and are proposed together.

---

## D-7 — The config filename line

**Default applied: unchanged.** The sentence is in `scenario-benchmarks.json` and reads:

> "Every input is a placeholder assumption from config/assumptions.yaml."

**Proposed replacement:** *"Every input is a stated assumption (Section 15.3)."*

This keeps the honest half — the scenario is modelled, not measured — and drops the path to a file
on Firefly's own machine. See **C-11**. Not applied, because it is Firefly's text.

---

## D-8 — The Open Graph image

**Default applied: a typographic card, no photograph.**

1200 × 630, carrying the title and "Prepared for Hon. Dr. Benson Makali Mulu — Confidential", drawn
from the existing brand tokens. There is currently **no `og:image` at all** while `twitter:card` is
`summary_large_image`, so the WhatsApp preview — which is how this document will actually be
opened — is text only.

No portrait is used without Firefly's approval. A confidential, link-only proposal that renders a
photograph of the candidate into every chat it is forwarded to is a different confidentiality
posture than the one §1.2 sets out, and that is Firefly's call, not the audit's.

---

## D-9 — The illustrative pledge in the §3.6 mockup

**Default applied: keep the mockup, flag it "Illustrative — wording not approved by the campaign".**

The SMS mockup reads: *"Dr. Makali Mulu guarantees Ksh 100M Ward Fund …"*

That is a specific monetary pledge placed in the candidate's mouth, in a specimen that looks exactly
like a real message because that is what a device mockup is for. It is also the one place in this
document where a figure appears that is not sourced to anything, in a proposal whose evidence
standard (Annex A) is one of its selling points.

The flag is the minimum. Firefly may prefer to change the specimen copy; the audit will not write
campaign pledges.

---

## D-10 — Three sets of pillars

**Default applied: name each set distinctly on every figure.**

| Set | Where | Count |
|---|---|---|
| Message pillars | §7.1.1 | three |
| Strategic pillars | §6.2 | four |
| Production pillars | §6A.1, §8.3.1 | four |

A reader meeting "the four pillars" in §8.3 has already met a different four in §6.2 and a three in
§7.1.1. Every figure now carries the qualifier in its headline. Renaming them in the content would
be cleaner and is Firefly's call.

---

## D-11 — Wording that sits against the no-budget rule

**Default applied: content unchanged; figure labels say "effort", never "spend".**

Hard rule 3 forbids introducing cost, budget or campaign-finance material. These are pre-existing
phrases in the content, listed so Firefly can decide whether they should stay — the audit neither
removed nor amplified them:

| Where | Phrase |
|---|---|
| §3.4.5 panel label | "Phase −1 geofenced **spend** 65%" |
| §3.1.1 | "before further **budget commits** against it" |
| §3.3.2 | "before significant **budget commits**" |
| §3.3.1 | "minimize redundant **budget expenditure**" |
| §3.6.1 | diaspora as "active campaign **donors**" |

The §3.4.5 panel label is the one the audit does change, and only the label: the source sentence
says the weighting is "on output and targeting, measured by R-02", which is effort, not money. The
figure now matches the sentence it draws.

The last one is the one to look at hardest. "Active campaign donors" is a campaign-finance
characterisation of a named group, in a jurisdiction with rules about it.

---

## D-12 — "Encrypted SMS delegate channel"

**Default applied: flagged for wording; text unchanged.**

§3.1.6 describes an *"encrypted SMS delegate channel"*. **SMS is not encrypted.** It traverses the
operator's network in plaintext, is retained by the operator, and is available to anyone with lawful
or unlawful access to it.

This matters more here than it would elsewhere: the channel described carries **delegate
coordination during a contested nomination**, and §12.5 commits the campaign to a data-protection
standard it invites the reader to hold it to. Describing an unencrypted channel as encrypted in the
same document is the kind of detail an opposition researcher reads carefully.

If an encrypted channel is genuinely intended, the proposal should name one (Signal, WhatsApp,
an operator's USSD session). If SMS is intended, the word "encrypted" should go.

---

## D-13 — Where the audit departed from the conversion map

Three cases where the brief's conversion map asked for a deletion that the content does not support.
The audit kept the text and recorded why; all three are reversible if Firefly disagrees.

| Where | Map asked for | What the content actually is | Applied |
|---|---|---|---|
| §3.1.5 bullets | Retire eleven provenance cards | The markdown has **no cards** — it has four bullets of *reasoning* ("across houses, the picture is less settled"; "undecideds are the movable block"). The cards are a component, retired in the component layer. | **KEEP-PROSE** |
| §3.3.6 | Retire the 2017/2022 paragraphs that "restate the tables number for number" | §3.3.6 has **no tables and no paragraphs** — it is one 180-word list, carrying the 2013 data gap, the Court of Appeal citation (*Malombe v Ngilu* [2018] KECA 460) and the Tier 2 117,606 figure against the certified 114,606. No bar chart draws those. | **COLLAPSE** |
| §3.4.2 concentration bullets | Retire "the restated numbers only" | Retiring part of a block means rewriting the block, which the negative constraints forbid. The third bullet ends on an argument no bar can draw — the bottom ten wards "cover vast geographic areas with severe logistical transit costs". | **COLLAPSE** |
| §1A.5 | Retire the list that restates figures 1–4 | Each item specifies what its figure will show, which is the only such specification while the figures are still empty. | **COLLAPSE** |

One correction in the other direction: the map described **§8.11** as "out of scope except metrics".
Checked — §8.11 is **Workstream 10, digital organising and volunteers**, and is in scope. The figure
must not say otherwise.
