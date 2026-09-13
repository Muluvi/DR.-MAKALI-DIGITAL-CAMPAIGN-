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
