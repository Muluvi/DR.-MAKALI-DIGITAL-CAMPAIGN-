> **The evidence standard (A.1) is in Annex A**, with the three source tiers every figure in
> this proposal is graded against and the protocol for when two sources disagree.

ANNEX A. The provenance rules every figure in this proposal is held to, the three source tiers, and the protocol for when two sources disagree. Referenced throughout; collected here so the method can be checked without interrupting the argument.

## A.1 Evidence standard: provenance and source tiers

<!-- restructure 2026-11: to be written from the verified data -->

### A.1.1 Every figure carries its provenance

To ensure zero "data drift" across the strategic command, every figure cited in memos, ad targeting budgets, field operations, and executive briefings must satisfy the **Tri-Partite Metadata Mandate**:

```figure
id: provenance-mandate
```

**Rule of Implementation:** Any metric presented without all three parameters is classified as **Unverified Draft Data** and is strictly prohibited from informing field allocations or financial expenditures.

### A.1.2 The three source tiers

The campaign classifies all intelligence into three evidential tiers:

```figure
id: tier-classification
```

```visual
kind: cards
preset: tier
title: "Standard Implementation Rules"
items:
  - title: "Tier 1 Data"
    text: "(e.g., {{register.2022}} registered voters in 2022, 40 wards) is hardcoded into operational models and cannot be modified without gazetted IEBC addenda."
  - title: "Tier 2 Data"
    text: "(e.g., the 2022 governor results as reported by The Star, the Nation and the Standard, pending the IEBC forms) is used with its source named, and where two published values disagree both are shown."
  - title: "Tier 3 Data"
    text: "(e.g., informal reports of the method the Wiper Patriotic Front will use to select its Kitui nominee, or the {{register.2026}} registered voters reported for July 2026) is explicitly watermarked as single-source until validated by the issuing body's own documents: for the method, an NEC resolution or the party's nomination rules as filed; for the register, IEBC's own July 2026 figure."
```

#### The Kitui source pack (October 2026), and how each document is tiered

| Document | Publisher, date | Basis | Tier |
|---|---|---|---|
| County Gender Data Sheet, Kitui | County Government of Kitui with KNBS and UN Women, October 2025 | KDHS 2022, the 2019 Census, KNBS projections | Tier 1: an official compilation of official statistics |
| Kitui County Statistical Abstract 2015 | KNBS | Administrative data for 2013–14, KDHS 2014 | Tier 1, but over ten years old: a historical baseline only |
| Kitui County 2025 Long Rains Food and Nutrition Security Assessment | Multi-agency team led by NDMA; fieldwork July 2025 | Field transects, sector checklists, IPC analysis | Tier 1 |
| Delivering the Kitui Promise: Three-Year Scorecard (Aug 2022 – Aug 2025) | County Government of Kitui | The executive's own account | Tier 1 as a record of what the county claims; not evidence that the claims are true |

### A.1.3 When two sources disagree

When multiple sources report conflicting metrics (e.g., voter registration counts, vote totals, or demographic proportions), the analytical unit applies a standardized **Four-Step Conflict Resolution Protocol**:

```figure
id: conflict-protocol
```

**Ban on Guesswork:** Under no circumstance will the analytics team interpolate, smooth, or invent numbers to fill gaps between conflicting datasets.

### A.1.4 The standard applied to our own measurement

```lead
The presence audit in Section 14.1 is held to the same rules as every figure in this document. Platform-reported metrics are **Tier 2**, and they are never presented as Tier 1 alongside IEBC or KNBS figures.
```

The presence audit in Section 14.1 is held to the same rules as every figure in this document.

```visual
kind: checklist
items:
  - label: "Provenance"
    body: "Every number carries its export date, its source system, and whether it came from a Page Insights export or a manual public tally. The two are not interchangeable and are never averaged."
  - label: "Tier"
    body: "Platform-reported metrics are **Tier 2**: they are the platform's own measurement of itself, they restate silently, and they are not audited. They are never presented as Tier 1 alongside IEBC or KNBS figures."
  - label: "Coding, and its agreement rate"
    text: "Post coding is done twice, independently, with disagreements resolved by a third pass."
    body: "**The inter-coder agreement rate is published with the findings.** A coding exercise that will not report its own agreement rate is an opinion wearing a table."
  - label: "Gaps"
    text: "A metric the export does not contain is reported as absent, not estimated."
    body: "Estimated engagement rates and inferred follower geographies are not used."
  - label: "Competitive figures"
    body: "are public-source only, gathered the same way for him and both nomination rivals, in the same window."
```

## A.2 Source table (new)

<!-- restructure 2026-11: to be written from the verified data -->
