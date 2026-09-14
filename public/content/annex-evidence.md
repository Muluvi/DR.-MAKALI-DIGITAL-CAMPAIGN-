ANNEX A. The provenance rules every figure in this proposal is held to, the three source tiers, and the protocol for when two sources disagree. Referenced throughout; collected here so the method can be checked without interrupting the argument.

## 3.2 Evidence standard: provenance and source tiers

### 3.2.1 Every figure carries its provenance

To ensure zero "data drift" across the strategic command, every figure cited in memos, ad targeting budgets, field operations, and executive briefings must satisfy the **Tri-Partite Metadata Mandate**:

```
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                    TRI-PARTITE PROVENANCE MANDATE                         │
  ├───────────────────┬───────────────────────────────────────────────────────┤
  │ 1. Primary Source │ Exact institutional publishing entity                 │
  │                   │ (e.g., "IEBC Certified Register", "KNBS 2019 Census") │
  ├───────────────────┼───────────────────────────────────────────────────────┤
  │ 2. Timestamp Date │ Exact date/year of survey or official gazettement     │
  │                   │ (e.g., "August 2022", "7 August 2026")                │
  ├───────────────────┼───────────────────────────────────────────────────────┤
  │ 3. Geographic Unit│ Exact administrative boundary to which data applies   │
  │                   │ (e.g., "Countywide", "Mwingi North", "Kyuso Ward")    │
  └───────────────────┴───────────────────────────────────────────────────────┘
```

**Rule of Implementation:** Any metric presented without all three parameters is classified as **Unverified Draft Data** and is strictly prohibited from informing field allocations or financial expenditures.

### 3.2.2 The three source tiers

The campaign classifies all intelligence into three immutable evidential tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE THREE-TIER EVIDENTIAL CLASSIFICATION                 │
├────────┬─────────────────────────────┬──────────────────────────────────────┤
│ Tier   │ Source Types                │ Authorized Strategic Use             │
├────────┼─────────────────────────────┼──────────────────────────────────────┤
│ TIER 1 │ Certified Official Records: │ Unconditional baseline for all       │
│        │ • IEBC Gazetted Registers   │ target mathematics, ward quotas,     │
│        │ • KNBS Census Bulletins     │ budgets, and statutory compliance.   │
│        │ • Auditor-General Reports   │ Absolute authority.                  │
├────────┼─────────────────────────────┼──────────────────────────────────────┤
│ TIER 2 │ Independent Field Research: │ Directional tracking of candidate    │
│        │ • Reputable Public Polls    │ popularity, issue salience, and      │
│        │ • Commissioned Survey Waves │ message resonance. Used with stated  │
│        │ • Academic Demographic Data │ confidence intervals and error bars. │
├────────┼─────────────────────────────┼──────────────────────────────────────┤
│ TIER 3 │ Internal / Unverified Intel:│ Hypothesis generation and field lead │
│        │ • Single-source field notes │ tracking ONLY. Strictly prohibited   │
│        │ • Campaign hearsay/rumors   │ from driving financial or resource   │
│        │ • Self-reported crowd counts│ reallocation without escalation.     │
└────────┴─────────────────────────────┴──────────────────────────────────────┘
```

#### Standard Implementation Rules:
*   *Tier 1 Data* (e.g., 532,758 registered voters, 40 wards, 198,004 winning vote baseline) is hardcoded into operational models and cannot be modified without gazetted IEBC addenda.
*   *Tier 2 Data* (e.g., Mizani Africa 7 August 2026 survey: Kasalu 37.4%, Mulu 22.1%) is treated as empirical snapshots carrying declared margins of error (±2.53%).
*   *Tier 3 Data* (e.g., informal reports that Wiper party primaries will use polling rather than delegates) is explicitly watermarked as single-source until validated by formal party communiques.

### 3.2.3 When two sources disagree

When multiple sources report conflicting metrics (e.g., voter registration counts, polling leads, or demographic proportions), the analytical unit applies a standardized **Four-Step Conflict Resolution Protocol**:

```
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                   FOUR-STEP CONFLICT RESOLUTION PROTOCOL                  │
 └───────────────────────────────────────────────────────────────────────────┘

   STEP 1: TIER HIERARCHY TEST
   └── Tier 1 always overrides Tier 2; Tier 2 always overrides Tier 3.

   STEP 2: METHODOLOGICAL AUDIT (FOR TIER-EQUIVALENT CONFLICTS)
   └── Audit sample sizes, sampling frame (IEBC register vs. random dial),
       fieldwork dates, and non-response bias.

   STEP 3: CONSERVATIVE BASELINE SELECTION
   └── In electoral modeling, adopt the lower, more demanding performance
       assumption to prevent operational complacency.

   STEP 4: EXPLICIT DUAL-LABELING
   └── If unreconciled, report both numbers explicitly side-by-side with 
       their respective sources rather than calculating an artificial average.
```

**Ban on Guesswork:** Under no circumstance will the analytics team interpolate, smooth, or invent numbers to fill gaps between conflicting datasets.
