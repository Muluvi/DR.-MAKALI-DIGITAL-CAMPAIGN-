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
| `markdown/PollingTrajectorySimulator.tsx` | `AlertTriangle` | `AlertCircle` | Target missed |
| `markdown/PathTo200kCalculator.tsx` | `AlertTriangle` | `AlertCircle` | Target missed |
| `markdown/PathTo200kCalculator.tsx` | `ShieldAlert` · gold | `Target` · inherited | A tactical requirement is a threshold, not a threat |
| `markdown/CommitmentFields.tsx` | `TriangleAlert` | `AlertCircle` | Escalation route; the danger token stays, the triangle does not |
| `markdown/ConstitutionalBranchNavigator.tsx` | `AlertTriangle` · amber banner | `Flag` · neutral banner | Both court outcomes are branches of an open decision. One is not an error state |
| `markdown/MediaRadioLandscapeCard.tsx` | `ShieldAlert` · amber banner | `Info` · neutral banner | Rival ownership of two networks is a finding, and it reads harder in plain type than in yellow |
| `markdown/PublicServiceDeliveryTracker.tsx` | `Info` · gold band | `Info` · neutral band | "This interface has not been built" is the document's most important trust signal. It should not look like a caution sticker |
| `terminal/screens/GroundPulseScreen.tsx` | `AlertTriangle` | `AlertCircle` | One attention glyph across the site |
| `terminal/screens/IncidentScreen.tsx` | `AlertOctagon` | `AlertCircle` | As above |

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

## 4. Accessibility

- Every decorative icon now carries `aria-hidden="true"` — 155 elements across 39 files that
  did not have it, plus the six rendered from a variable (`<Icon />` out of a config object).
  All 271 lucide elements in the codebase are now marked.
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

## The measurement that does not clear

> *Budget: under 15KB of icons on first load.* · *Perhaps thirty glyphs in total.*

The site is a single route, so effectively every icon it imports is in the first load.

| | Before | After |
|---|---|---|
| Distinct glyphs imported | 128 | 121 |
| Glyphs reaching the browser | — | 108 |
| Glyph data, uncompressed | — | 27.7 KB |
| Glyph data, gzipped | — | 7.3 KB |

Gzipped, the budget is met with room. Uncompressed it is not, and the count is roughly four
times what the register's honest note calls for. Imports are individual, so nothing is being
paid for that is not used — the payload is simply the number of distinct glyphs on the site.

Closing that gap is not an icon-hygiene change, it is a design decision about the card
components: most of the surplus is one icon per label inside interactive blocks
(`StrategicAids.tsx`, `ClientPage.tsx`, `ConstitutionalBranchNavigator.tsx`,
`MediaRadioLandscapeCard.tsx` and the phone and terminal mockups). It is left standing, and
named here, rather than taken unilaterally.

---

## A note on names

Installed is `lucide-react` 1.44.0 (`package.json` asks for `^1.34.0`). Both the legacy and
the current spellings resolve in this version — `AlertCircle`/`CircleAlert`,
`HelpCircle`/`CircleHelp`, `CheckCircle2`/`CircleCheckBig` — so this pass used the register's
own names where it introduced an icon and left the existing spellings alone. That will not
hold forever; the aliases are what Lucide keeps "only for a while".
