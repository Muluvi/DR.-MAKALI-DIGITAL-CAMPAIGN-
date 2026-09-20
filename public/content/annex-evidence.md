ANNEX A. The provenance rules every figure in this proposal is held to, the three source tiers, and the protocol for when two sources disagree. Referenced throughout; collected here so the method can be checked without interrupting the argument.

## 3.2 Evidence standard: provenance and source tiers

### 3.2.1 Every figure carries its provenance

To ensure zero "data drift" across the strategic command, every figure cited in memos, ad targeting budgets, field operations, and executive briefings must satisfy the **Tri-Partite Metadata Mandate**:

```figure
id: provenance-mandate
```

**Rule of Implementation:** Any metric presented without all three parameters is classified as **Unverified Draft Data** and is strictly prohibited from informing field allocations or financial expenditures.

### 3.2.2 The three source tiers

The campaign classifies all intelligence into three immutable evidential tiers:

```figure
id: tier-classification
```

#### Standard Implementation Rules:
*   *Tier 1 Data* (e.g., 532,758 registered voters, 40 wards, 198,004 winning vote baseline) is hardcoded into operational models and cannot be modified without gazetted IEBC addenda.
*   *Tier 2 Data* (e.g., Mizani Africa 7 August 2026 survey: Kasalu 37.4%, Mulu 22.1%) is treated as empirical snapshots carrying declared margins of error (±2.53%).
*   *Tier 3 Data* (e.g., informal reports that Wiper party primaries will use polling rather than delegates) is explicitly watermarked as single-source until validated by formal party communiques.

### 3.2.3 When two sources disagree

When multiple sources report conflicting metrics (e.g., voter registration counts, polling leads, or demographic proportions), the analytical unit applies a standardized **Four-Step Conflict Resolution Protocol**:

```figure
id: conflict-protocol
```

**Ban on Guesswork:** Under no circumstance will the analytics team interpolate, smooth, or invent numbers to fill gaps between conflicting datasets.

---

### 3.2.4 The standard applied to our own measurement

The presence audit in Section 1A is held to the same rules as every figure in this document.

*   **Provenance.** Every number carries its export date, its source system, and whether it came
    from a Page Insights export or a manual public tally. The two are not interchangeable and are
    never averaged.
*   **Tier.** Platform-reported metrics are **Tier 2**: they are the platform's own measurement of
    itself, they restate silently, and they are not audited. They are never presented as Tier 1
    alongside IEBC or KNBS figures.
*   **Coding, and its agreement rate.** Post coding is done twice, independently, with
    disagreements resolved by a third pass. **The inter-coder agreement rate is published with the
    findings.** A coding exercise that will not report its own agreement rate is an opinion wearing
    a table.
*   **Gaps.** A metric the export does not contain is marked `[DATA NEEDED]` with the method for
    obtaining it, exactly as elsewhere. Estimated engagement rates and inferred follower
    geographies are not used.
*   **Competitive figures** are public-source only, gathered the same way for all four candidates,
    in the same window.
