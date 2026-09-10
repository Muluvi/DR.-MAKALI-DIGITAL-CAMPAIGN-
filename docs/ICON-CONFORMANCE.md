# Icon conformance pass

`docs/ICON-REGISTER.md` arrived as a specification. This is the record of applying its
Part 8 rules to the code, what was left alone, and the one measurement that does not clear.

Read alongside the register. Where the two disagree, the register is the specification and
this file is the account of what was actually done about it.

---

## 1. The hazard vocabulary is gone

> *`AlertTriangle` and warning-yellow have no place on this site. The open questions are trust
> signals, not hazards.*

`AlertTriangle`, `TriangleAlert` and `AlertOctagon` no longer appear anywhere. Each site was
re-read for what it was actually saying, and given the register's Part 2 glyph for that job:

| File | Was | Now | Why |
|---|---|---|---|
| `markdown/RecognitionDeficitOverlay.tsx` | `AlertTriangle` · gold | `Info` · muted | Recognition status is derived, not surveyed — an assumption stated |
| `markdown/GeographicZoneMatrix.tsx` | `AlertTriangle` · gold | `Info` · muted | Sub-county and constituency do not nest — a method note |
| `markdown/AudienceSegmentationMatrix.tsx` | `AlertTriangle` · gold | `CircleDashed` · muted | A named data gap is *not yet measured*, not an error |
| `markdown/PollingTrajectorySimulator.tsx` | `AlertTriangle` | `CircleAlert` | Target missed |
| `markdown/PathTo200kCalculator.tsx` | `AlertTriangle` | `CircleAlert` | Target missed |
| `markdown/PathTo200kCalculator.tsx` | `ShieldAlert` · gold | `Target` · inherited | A tactical requirement is a threshold, not a threat |
| `markdown/CommitmentFields.tsx` | `TriangleAlert` | `CircleAlert` | Escalation route; the danger token stays, the triangle does not |
| `markdown/ConstitutionalBranchNavigator.tsx` | `AlertTriangle` · amber banner | `Flag` · neutral banner | Both court outcomes are branches of an open decision. One is not an error state |
| `markdown/MediaRadioLandscapeCard.tsx` | `ShieldAlert` · amber banner | `Info` · neutral banner | Rival ownership of two networks is a finding, and it reads harder in plain type than in yellow |
| `markdown/PublicServiceDeliveryTracker.tsx` | `Info` · gold band | `Info` · neutral band | "This interface has not been built" is the document's most important trust signal. It should not look like a caution sticker |
| `terminal/screens/GroundPulseScreen.tsx` | `AlertTriangle` | `CircleAlert` | One attention glyph across the site |
| `terminal/screens/IncidentScreen.tsx` | `AlertOctagon` | `CircleAlert` | As above |

## 2. `Sparkles` is gone

The register does not list it, in any of eight parts, for any job. Every use was decoration:

- `markdown/KeyTakeawayBanner.tsx`, `markdown/PollingTrajectorySimulator.tsx`,
  `MobileTOCModal.tsx`, `markdown/InteractiveTable.tsx`, `HeroVisual.tsx` (hint pill),
  `QuickNavCapsule.tsx` — **removed**. In each, the adjacent words already said it.
- `markdown/StrategicPillarsMatrix.tsx` — **→ `FileText`**. It labelled "Tangible Evidence",
  one of three cards the reader must tell apart; the register's glyph for a source is `FileText`.
- `HeroVisual.tsx` (3D Pillars toggle) — **→ `ChartColumn`**. It also collided with the
  `Layers` on the adjacent view switch; two neighbouring controls now read as two controls.

## 3. Icons off the places the register names

- **Section headings.** `ObjectivesIndex.tsx` had a `Target` above *"The rest of what is
  measured"* — the register's own example of the tell. Gone. `DataVisualizations.tsx` had a
  `CheckCircle2` above a scenario heading. Gone.
- **The nine indicators.** `charts/KpiScorecards.tsx` lost the `Gauge`/`Target` above its
  heading and the `Ruler`/`User`/`CalendarClock` beside "Measurement method", "Owner" and
  "Reporting cadence" — three labels that each already say what they are, in the densest part
  of the document. Dropping them also flattens the `dt` back to plain text.
- **Pull quotes.** `markdown/PullQuote.tsx` no longer sets an oversized `Quote` mark behind the
  text. The gold rule on the left already marks it.
- **The ask.** `DecisionPanel.tsx` had eight dependencies in eight coloured icon chips. The
  register asks for the quietest, plainest thing on the site: the chips are now the item
  numerals the closing paragraph already refers to ("Items 4, 5 and 6"), on one border, and
  the recommendation card is on the neutral line rather than the accent. The `ClaimBadge` on
  the long-lead item stays — it is the confidence system, not ornament.

## 4. The specification itself

The first two passes fixed *which* icons appear and *where*. This one fixes how they are drawn,
against the four measurable lines in Part 8's specification.

**One stroke weight, and it is the specified one.** The register asks for a 24-pixel grid at a
1.5-pixel stroke. Lucide's own default is 2, and it scales the stroke with the icon, so nothing
on the site was at 1.5 and no two sizes matched: a 9-pixel badge mark rendered at 0.75px, a
14-pixel label mark at 1.17px, a 20-pixel control at 1.67px. Three of them then overrode it
upward again in Tailwind — `stroke-[3]` on the included/not-included marks, `stroke-[2.5]` on
the checklist bullet.

`components/IconDefaults.tsx` wraps the app in Lucide's `LucideProvider` with
`strokeWidth={1.5} absoluteStrokeWidth`, and the three Tailwind overrides are gone. Every icon
on the site now renders a true 1.5-pixel stroke at whatever size it is drawn — verified in the
browser across the nine sizes in use. `absoluteStrokeWidth` is what makes that true rather than
nominal: without it, "1.5" is a value on the 24-grid that thins as the icon shrinks, which is
how the small marks became faint in the first place. Any icon passing its own `strokeWidth`
still wins, which is how the device mockups keep the platform weights they are imitating.

**`currentColor`, checked.** No document-side icon hard-codes a colour; they inherit through
Tailwind text tokens, which is what the rule is asking for. The phone screens pass explicit
hex — that is the platform's own chrome colour inside a picture of that platform, and it is
listed under *What was deliberately left*.

**No fills except where a filled state carries meaning.** The one document-side fill was a
filled `Star` in a pill already reading "Recommended"; it went in pass 2. The fills that remain
are a filled play button and a filled heart inside the mockups, where filled *is* the state.

**Optical sizing.** After pass 2 no document-side icon is set above 18 pixels except the two
20-pixel transport controls in the audio player, which are controls rather than marks beside
body text. The register's case — a 24-pixel icon next to 16-pixel type — no longer occurs.

## 5. Accessibility

- Every decorative icon now carries `aria-hidden="true"` — 155 elements across 39 files that
  did not have it, plus the six rendered from a variable (`<Icon />` out of a config object).
  Every lucide element in the codebase is marked; 194 remain after the second pass.
- One standalone icon button was announced as nothing: the HeroVisual **Reset** control, whose
  label is `hidden sm:inline` and so is icon-only on a phone. It now has an `aria-label`.
  The 3D Pillars toggle, same pattern, gained an `aria-label` and `aria-pressed`.
- The other three flagged by the scan were false positives — visible text in a nested span.

---

## What was deliberately left

**The terminal showcase keeps its severity ramp.** `IncidentScreen.tsx` grades incidents
Tier 1 / Tier 2 / other in rose / amber / blue. That is a simulated field-operations console
where severity is the actual content, not the document's voice speaking about its own
evidence. The triangles and octagons are gone; the colour ramp stays.

**Data-state colour stays.** The recognition bands in `RecognitionDeficitOverlay.tsx`
(emerald/amber/rose), the report status pills in `PublicServiceDeliveryTracker.tsx`, and the
below-threshold banner in `PollingTrajectorySimulator.tsx` encode a value on a scale. The
register's caution is about hazard *signalling* attached to trust signals, which is what
sections 1 and 3 above removed.

**`text-gold` elsewhere stays.** Gold is the site's brand token — it is on `Moon`, `Sun`,
`Vote`, the pull-quote rule. It was removed only where it was dressing a caveat in the livery
of a warning.

---

## The count, and the second pass

> *Budget: under 15KB of icons on first load.* · *Perhaps thirty glyphs in total.*

The first pass met the budget gzipped and missed it uncompressed, at 121 imported glyphs
(108 of them reaching the browser) against an honest note asking for thirty. The second pass took the count down by removing what the
register's own three criteria do not justify — an icon earns its place only if it replaces a
word that will not fit, encodes a repeated state faster than text, or distinguishes members
of a set the reader must tell apart quickly.

| | Before the register | Pass 1 | Pass 2 | Now |
|---|---|---|---|---|
| Imported names | 128 | 121 | 97 | **96** |
| Distinct glyphs | 127 | 120 | 96 | **96** |
| — document and chrome | 100 | 92 | 64 | **64** |
| — device and terminal mockups | 54 | 53 | 53 | **53** |
| Icon elements in the codebase | 284 | 271 | 194 | **194** |
| Glyph data, uncompressed | 33.1 KB | 30.8 KB | 23.3 KB | **23.3 KB** |
| Glyph data, gzipped | 8.5 KB | 8.0 KB | 6.3 KB | **6.3 KB** |

The payload figures in the first two versions of this file were **understated** — 29.5, 27.7
and 21.3 KB where the true numbers are 33.1, 30.8 and 23.3. The measurement summed each
imported name's own module, and ten of those names were alias modules that re-export another
glyph and carry no path data of their own, so their weight was counted as zero. Resolving
aliases first (see *A note on names*) gives the figures above. The conclusion does not change,
and neither does what ships: gzipped, 6.3 KB against a 15 KB budget.

### What the second pass removed

**The card-header chip.** Sixteen interactive blocks opened with a 20-pixel glyph in a
rounded accent square beside the title — `Layers`, `Scale`, `Lock`, `Compass`, `Radio`,
`Database`, `Calculator`, `Brain`, `TrendingUp`, `Activity`, `Target`, `ShieldCheck`,
`Volume2`, `BookOpen`, `Calendar`, `FileText`. One icon in the corner of each of sixteen
identical rounded cards is the register's "decoration standing in for hierarchy", and it is
what made the document look templated when you scrolled it fast. All sixteen gone, chip
included.

**The sub-label glyph.** A 12-pixel accent icon beside "Connectivity & media", "Geographic
base", "Strategic Posture", "Zone strategic imperative", "Wiper Nomination Dynamics",
"Tangible Evidence", "Operational Delivery", "Largest wards by register", "Tactical
Requirement" and twenty more. Each label already said it. Gone.

**The closing-line glyph.** Every card ended on a rule with an `ArrowRight`, `Percent`,
`Info`, `CheckCircle2` or `ShieldCheck` before a sentence of prose. Gone.

**Icons on rows and tabs whose labels are complete.** The nine section cards under "What this
proposal covers" — the register's literal example, nine identical rounded cards. The four
pillar tabs. The six channel rows in the reach split ("Kikamba vernacular radio" needs no
radio). The two `Chip` fields in the commitment blocks ("Deadline", "Owner"). The three
diagram frames ("Matrix", "Summary", "Diagram"). The filled `Star` in a pill reading
"Recommended". The `Trophy` above a phase heading — unlisted in the register, in the same
category as `Sparkles`.

Twenty-four distinct glyphs left the codebase in this pass: `BookOpen`, `Brain`, `Building2`,
`Calendar`, `CalendarClock`, `CalendarDays`, `FileCheck2`, `FileCode2`, `GitBranch`,
`Languages`, `Lock`, `Percent`, `RefreshCw`, `Route`, `Scale`, `Sliders`, `Smartphone`,
`Star`, `Table2`, `Tag`, `Trophy`, `UserRound`, `VolumeX`, `Zap` — several of which were dead
imports that had never rendered anything.

### What the count still contains, and why

Of the 96 that remain, **53 are inside the device and terminal mockups** — the WhatsApp,
Facebook, TikTok, X, Instagram and YouTube screens, the feature-phone specimen, the field
terminal. Those illustrations depict interfaces, and in an interface the icons *are* the
content: a WhatsApp screen without a paperclip and a microphone is not a picture of WhatsApp.
Stripping them would not be icon hygiene, it would be falsifying the mockup. They stay, and
they are the single largest line in the payload.

The 64 on the document side are now, near enough, the three parts the register's honest note
endorses: navigation and document chrome (Part 1), the status and confidence set (Part 2),
the data controls (Part 5), the four service-delivery marks in the framing matrix (Part 7),
and the small sets of markers in the key-facts strip, the mini scorecard and the claim badges,
where three or four glyphs distinguish members of a set at a glance. Roughly thirty of those
are the document's own; the rest are controls the reader operates.

Uncompressed, 23.3 KB is still above the 15 KB line; gzipped, 6.3 KB clears it with room, and
gzip is what ships. Getting under 15 KB uncompressed means cutting the mockups, which is the
one thing above that would cost the document something real.

---

## A note on names

Installed is `lucide-react` 1.44.0 (`package.json` asks for `^1.34.0`). The first pass noted
that the codebase was importing ten glyphs under legacy spellings that survive only as alias
modules — a one-line re-export of the real icon — and that Lucide keeps those "only for a
while". They are now migrated to the canonical names:

| Was | Now | | Was | Now |
|---|---|---|---|---|
| `AlertCircle` | `CircleAlert` | | `CheckSquare` | `SquareCheckBig` |
| `BarChart2` | `ChartNoAxesColumn` | | `Filter` | `Funnel` |
| `BarChart3` | `ChartColumn` | | `HelpCircle` | `CircleQuestionMark` |
| `CheckCircle` | `CircleCheckBig` | | `Home` | `House` |
| `CheckCircle2` | `CircleCheck` | | `MoreHorizontal` | `Ellipsis` |

Three of those land on the register's own vocabulary rather than beside it: `CircleCheck` is
its "dependency satisfied", `CircleQuestionMark` its "question for counsel", `CircleAlert` its
"target missed". `BarChart3` and `ChartColumn` turn out to have been the same glyph imported
under two names, which is why 97 names became 96.

The payload is unchanged — aliases tree-shake to the same modules — so this buys no bytes. What
it buys is that the build does not break on a Lucide release that finally drops them, and that
the names in the code match the names in the register.
