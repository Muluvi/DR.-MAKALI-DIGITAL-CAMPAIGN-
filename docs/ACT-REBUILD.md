# The act rebuild — decisions of record

The proposal is being rebuilt from a numbered document into five scrolling acts. Act one,
*The Terrain*, is built and lives at `/terrain`. The other four are not, and the nineteen
document routes still serve the whole proposal in the meantime.

## What was decided

| Decision | Ruling |
|---|---|
| Numbered headings (`3.4.5`, `§8.1.1`) | **Killed.** Headings are titles. |
| Prose cross-references ("see Section 8.10") | **Killed.** State the thing or drop it. |
| Self-referential framing ("this proposal is in sixteen sections") | **Killed.** |
| Citation / provenance layer | **Kept**, moved out of the sentences into one evidence footer per scene. |
| Print path (`/full`, print stylesheet) | **Kept.** A client may still want a PDF. |
| Content | Tightened, not gutted. Act one: 9,858 prose words → 6,046. |
| Ground | Dark by default, light toggle retained. Wiper royal blue and earth red kept; the paper/ink metaphor dropped. |
| Portraits | Full-bleed. |
| Structure | One scrolling page per act, cinematic at the act gate and on the big evidence, calm prose in between. Acts stream. |
| Primary device | Phone. Pinned panels degrade to full-bleed reveals below 1024px by design. |

## Component curation

Blocks that survive into act one, staged rather than framed:

- `WardCartogram` and `PathTo200kChart` — mounted bare on a pinned stage. The document's
  `WardCartogramBlock` / `PathTo200kBlock` wrappers are *not* used: their card chrome, titles and
  descriptions duplicate what the stage already says.
- `OfflineWaterline` — pinned, as-is. It is a designed object rather than a framed chart.
- `RecognitionDeficitOverlay`, `CompetitorFieldPanel`, `GeographicZoneMatrix`,
  `AudienceSegmentationMatrix`, `FiscalAuditChartBlock` — inline, full-bleed.

Report furniture that the act does not mount, and that is scheduled for deletion as the acts
that currently use it are rebuilt: `AsciiDiagram`, `DisclosureGroup`, `MatrixMarks`, `TierBadge`
(replaced by the act's own evidence footer), `SectionNumberMap`, `CrossSectionLink`,
`FootnotePopover`, `ProseFold`, `ObjectivesIndex`, `SectionHeading`, `MobileTOCModal`,
`QuickNavCapsule`, `PhaseRail`, `ReadingSettingsSheet` and the rest of the numbering-dependent
navigation.

**They are not deleted yet, deliberately.** Every one of them is still mounted by the seventeen
sections that have not been rebuilt. Deleting them now would break seventeen live routes and
destroy the comparison the slice exists to enable. Deletion happens per act, as each act lands.

## A correction carried into the act

The document's path-to-200k block states that the ~200,000 threshold "is reachable from that
bloc on its own". Read against turnout it is not: 200,198 registered voters in the three Mwingi
sub-counties produce roughly 124,100 ballots at the county's 62% baseline, about 74,000 short.
The act states Mwingi as necessary and not sufficient. The document block is unchanged and still
carries the original claim.

## Apparatus removed from shared components

Four blocks the act reuses rendered section references and self-referential framing in their own
copy — "§5.3", "Section 3.5 groups the county…", "this document does not estimate past its own
evidence". Those strings are plain text, not links, so they were rewritten at source rather than
forked: `CompetitorFieldPanel`, `GeographicZoneMatrix`, `AudienceSegmentationMatrix`,
`RecognitionDeficitOverlay`, and the notes in `data/competitors.ts`. The document routes render
the same copy without the numbers; nothing else changed.

## The visual layer

Act one was first built as a prose column with three staged charts. That is a document in a
dark suit. The figures below were added so the argument is carried by things you look at, not
only by things you read.

### Palette — computed, not chosen

The chart palette is validated rather than eyeballed. Every mark colour passes the six checks
(lightness band, chroma floor, CVD separation, normal-vision floor, contrast against surface)
in **both** modes, against the act's own surfaces — `#030711` dark, `#f8fafd` light.

The brand accents are not reused directly as marks. The act's UI blue sits at OKLCH L 0.72 and
the ember at 0.70, both above the dark band's 0.67 ceiling: correct for text on near-black,
too light to read as data against it. The mark palette is the same two hues (258 royal blue,
40 earth red) stepped into the band, plus two placed for separation. Values live in
`components/act/chart-tokens.ts`; hues attach to entities and are never cycled or reassigned
by rank.

### Figures

| Figure | Form | Why this form |
|---|---|---|
| `PollGap` | Grouped bars, identity colour | The 15.3-point deficit is a relationship between two bars, so the gap is annotated rather than plotted as a third |
| `ThresholdFunnel` | Ordered ramp + share ring | Each bar is true proportion of the one above; the ring carries 60.5%, the one job a radial does better than a bar |
| `PathRace` | Bars against a threshold rule | Three clear it, one stops short — the geometry is the argument |
| `CeilingBar` | Single proportional track | The empty remainder is the point: 126,004 votes digital cannot reach |
| `ChannelReach` | Ranked bars, one colour | One measure, so one hue — a value ramp would double-encode length as colour |
| `ForkDiagram` | Drawn SVG branch | Replaces the source's ASCII pipe-and-box art with real geometry, twice |
| `CredentialGrid` | Card board | Replaces an "Asset / Evidence / Application" table nobody reads |

Every figure has a **table-view twin** behind a toggle, so no value is reachable only by
hovering a mark. Sources stay visible rather than hiding in the toggle.

### Motion and environment

Gate: ambient aurora field, two separated pools of party colour, per-word title stagger,
mask-reveal standfirst, count-up hero, parallax recession on exit, scroll cue. Body:
scroll-linked wash migrating blue to ember across the act, film grain, gradient rules, drop
caps, a full-bleed ward-register marquee, nav dots on phone and a labelled rail on desktop,
back-to-top, branded scrollbar. Bars grow from the baseline on first approach; under reduced
motion every figure renders final immediately — nothing animates *to* the truth.

### Two defects this pass fixed in what shipped first

- `tabular-nums` on the hero and stat-tile values. Equal-width digits make a large standalone
  number look loose; proportional figures are correct there, and tabular is kept only where
  numbers align in columns.
- The staged charts had no table-view twin. They do now, via `Figure`.

### One trap worth recording

The gate title was briefly gradient-filled with `background-clip: text`. It rendered an empty
gate: the title splits into per-word spans for the stagger, Motion gives each span a
transform, and a transformed descendant paints outside the parent's clipped background — so
every word inherited `color: transparent` and drew nothing. Gradient text on this page goes on
static, unsplit elements only (`.act-gradient-text`).
