# Icon register — Kitui 2027 Strategy Portal

Every icon this site could reasonably need, organised by the job it does. Names follow the Lucide set, which is the most likely thing already installed — check `package.json` and verify each name against the installed version before importing, since Lucide renames icons between releases and keeps aliases only for a while.

Read Part 8 before Part 1. It is the part that decides whether the icons help or hurt.

---

## Part 1 — Navigation and document chrome

*The highest-value icons on the site. These replace words in places where words will not fit.*

| Job | Icon |
|---|---|
| Open the index | `List` or `Menu` |
| Close a sheet or overlay | `X` |
| Expand a section | `ChevronDown` |
| Collapse a section | `ChevronUp` |
| Open every section | `ChevronsDown` |
| Move between sections | `ChevronLeft` · `ChevronRight` |
| Back to top | `ArrowUp` |
| Settings sheet | `Settings2` |
| Reading view | `BookOpen` |
| Theme switch | `Sun` · `Moon` |
| Search within document | `Search` |
| Copy link to section | `Link2` |
| Share | `Share2` |
| Export or download | `Download` |
| Print | `Printer` |
| Resume where you left off | `Bookmark` or `History` |
| Section grid view | `LayoutGrid` |
| Progress through document | `CircleDashed` at partial fill |
| External destination | `ExternalLink` |
| More options | `MoreHorizontal` |

---

## Part 2 — Status, provenance and confidence

*This is the credibility system rendered as icons. Build these as one consistent set or not at all — five different visual languages for five kinds of certainty is worse than none.*

| Job | Icon |
|---|---|
| Verified figure | `BadgeCheck` or `ShieldCheck` |
| Source available | `FileText` |
| Confidence tier marker | `Circle` filled, half, outline — or plain T1/T2/T3 text |
| Not yet measured | `CircleDashed` |
| Data genuinely absent | `Minus` or `Slash` |
| Open decision | `Flag` |
| Gating dependency | `Lock` |
| Dependency satisfied | `CircleCheck` |
| In progress | `Clock` |
| Target met | `Check` |
| Target missed | `AlertCircle` |
| Definition available | `HelpCircle` — or better, a dotted underline with no icon |
| Assumption stated | `Info` |
| Question for counsel | `CircleQuestionMark` |

**One caution.** `AlertTriangle` and warning-yellow have no place on this site. The open questions are trust signals, not hazards. Anything that looks like an error state undercuts the effect you are going for.

---

## Part 3 — Channels and platforms

*Brand marks are the one category where recognition beats restraint. A reader scanning the channel mix identifies these faster than any label.*

| Job | Icon |
|---|---|
| WhatsApp | Official brand mark |
| SMS | `MessageSquare` |
| USSD | `Phone` or `Hash` — the `*#` glyph pair also works and is more literal |
| Voice note | `Mic` or `AudioLines` |
| Voice call | `PhoneCall` |
| Email | `Mail` |
| Facebook · TikTok · YouTube · X · Instagram | Official brand marks |
| Radio | `Radio` |
| Television | `Tv` |
| Public address, rally, baraza | `Megaphone` |
| Mobile money | Official M-Pesa mark |
| QR code | `QrCode` |

Brand marks come from each platform's own guidelines, not from a general icon set. Lucide's social icons were deprecated for trademark reasons and should not be relied on. Keep them monochrome and uniformly sized so no platform appears favoured.

---

## Part 4 — Devices and reach

| Job | Icon |
|---|---|
| Smartphone | `Smartphone` |
| Feature phone | Custom — no icon set has a decent one; draw a small candybar glyph |
| Desktop | `Monitor` |
| Printed material | `Printer` or `Newspaper` |
| Online | `Wifi` |
| Offline | `WifiOff` |
| Low bandwidth | `SignalLow` |
| Coverage | `RadioTower` |

`WifiOff` alongside the 86.4% figure is one of the few places where an icon adds genuine speed to comprehension.

---

## Part 5 — Data controls

*Icons on controls, never on the data itself.*

| Job | Icon |
|---|---|
| Switch to chart | `ChartLine` or `ChartColumn` |
| Switch to table | `Table` |
| Trend rising | `TrendingUp` |
| Trend falling | `TrendingDown` |
| Adjust a slider | `SlidersHorizontal` |
| Sort | `ArrowUpDown` |
| Filter | `Filter` |
| Reset view | `RotateCcw` |
| Expand a chart | `Maximize2` |
| Download the underlying data | `Download` |
| Target or threshold | `Target` |
| Measurement or indicator | `Activity` or `Gauge` |
| Share of a whole | `Percent` |

---

## Part 6 — Geography, time and people

### Places

`MapPin` for a ward · `Map` for the county · `Layers` for overlay switching · `Compass` for the locator inset · `Navigation` for a route · `LocateFixed` for a polling station · `Building2` for a party branch or county office.

### Time

`Calendar` for a date · `CalendarClock` for a deadline · `Timer` for the countdown · `Hourglass` for the window closing · `History` for a prior round · `Milestone` for a phase boundary.

### People and structure

`User` for the candidate · `Users` for a team · `UserCheck` for a verified supporter · `UserPlus` for recruitment · `Contact` for a consented contact · `Network` for the ward captain structure · `Workflow` for a process · `GitBranch` for a decision point · `Handshake` for an alliance or endorsement.

---

## Part 7 — Content, governance and policy

### Content types

`FileText` document · `Camera` photograph · `Video` video · `Play` playback · `Volume2` audio · `Image` still · `Files` an asset set · `ClipboardList` a form or roster · `Paperclip` an attachment.

### Governance and consent

*These survive the excision and now carry the whole "this vendor is careful" argument, so they matter more than they did.*

`ShieldCheck` data protection · `Lock` encrypted transmission · `KeyRound` access control · `FileCheck` consent record · `UserCheck` opt-in · `BellOff` opt-out · `EyeOff` confidentiality · `Fingerprint` identity verification · `ScrollText` the ethics charter.

### Accessibility

`Accessibility` general · `Languages` language switch · `Captions` subtitling · `Ear` audio description · `Contrast` contrast mode · `Type` text size. Sign language has no adequate glyph in any general set — commission a small custom mark or use a text label.

### Election operations

`Vote` the ballot · `ClipboardCheck` the results form · `Landmark` the county government · `Stamp` certification · `ListChecks` the register.

### Service delivery and policy

*The one place where a full icon family genuinely earns its keep, because these categories repeat across the tracker and the reader needs to distinguish them at a glance.*

`Droplets` water · `Wheat` or `Sprout` agriculture · `Stethoscope` health · `GraduationCap` education · `Route` roads · `Zap` electrification · `Briefcase` employment · `Coins` county revenue · `TrendingUp` economic growth · `Tractor` mechanisation · `Bus` transport · `TreePine` environment.

---

## Part 8 — How to use them, and where not to

### The specification

- **One family only.** Mixing two icon sets is visible immediately, even to people who cannot say why.
- **24-pixel grid, 1.5-pixel stroke, no fills** except where a filled state carries meaning.
- **`currentColor` always.** Icons inherit text colour. Never hard-code an icon colour.
- **Decorative icons get `aria-hidden="true"`.** An icon beside a word that already says the same thing must not be announced twice.
- **Standalone icon buttons get a real `aria-label`.** An unlabelled icon button is a guessing game for a screen reader and for a 60-year-old reader on a phone.
- **Never icon-only for a primary action.** The index trigger, the export, the section jump — all get a word or a tooltip.
- **Import individually**, never the whole set, or you will add well over a hundred kilobytes for eleven glyphs.
- **Optical sizing.** Icons set beside 16-pixel body text should render around 16 to 18 pixels, not 24. Align to the cap height, not the baseline.
- **Budget: under 15KB of icons on first load.**

### Do not put an icon on these

**Section headings.** A lightbulb above "Strategy", a target above "Objectives", a rocket above anything — this is the single most recognisable tell of generated design, and it makes a serious proposal look like a template.

**Every card.** An icon in the corner of each of nine identical rounded cards is decoration standing in for hierarchy.

**The ask.** The closing section should be the quietest, plainest thing on the site. No icon, no accent, no ornament.

**Pull quotes.** No oversized quotation marks.

**The nine indicators.** The bullet charts already carry the meaning. An icon beside each adds visual noise to the densest part of the document.

**Anything a word already says.** If the label reads "Download", the arrow is redundant — which is fine on a button and wasteful above a heading.

### National and political imagery

No flag graphics, no party symbols, and nothing borrowed from another country's political iconography — donkeys, elephants, eagles, star-spangled podiums. If a party mark is used at all, it comes from the party's own assets with permission, appears once, and is not restyled.

---

## The honest note

Icons genuinely improve a site when they do one of three things: replace a word that will not fit, encode a repeated state faster than text can, or distinguish members of a set the reader must tell apart quickly. On this site that means Part 1, Part 2, and the service-delivery family in Part 7. Perhaps thirty glyphs in total.

Everywhere else, an icon is a small tax on load, attention and credibility. The reader is a PhD economist and sitting MP deciding whether to trust a consultant's judgement, and a document that decorates every heading is making a claim about its own seriousness that the reader will notice.

Use them precisely and they will read as considered. Use them everywhere and they will read as generated.

---

*Prepared for Firefly Management · Kitui 2027 Strategy Portal · September 2026*
