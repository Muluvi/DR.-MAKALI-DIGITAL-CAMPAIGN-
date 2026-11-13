## Every visual kind

This page renders one example of each ```visual kind, so a change to the renderer can be seen in one place. The text is placeholder copy written for the fixture; it is not proposal content.

### A section with a lead

```lead
A lead is drawn from the section's own sentences. The full text sits in the fold beneath it, with every word kept.
```

```visual
kind: stats
title: Stats show a handful of key numbers
source: "Source line for the fixture (Tier 1, a named publisher)"
items:
  - { value: "61.7%", label: Turnout, tier: 1, caption: One-line caption }
  - { value: "40", label: Wards, tier: 1 }
  - { value: "8", label: Constituencies, tier: 1, conflict: C8 }
```

The section's original prose stays here, behind "Read the full text". A lead is drawn from the section's own sentences, and the full text sits in the fold beneath it, with every word kept. It carries a tier parenthetical (Tier 2, a media report), a conflict marker [CONFLICT C3: see open items], a hidden citation mark Section 4.3 [CHECK REF] and a parenthesised reference (Section 2.5.2).

### Cards

```visual
kind: cards
title: Cards hold records with the same fields
items:
  - title: First record
    badge: campaign-owned
    head: { label: Target, text: "The headline field shows on the card." }
    chips: [NW-01, R-02]
    fields:
      - { label: Baseline, text: "Set in Week 1." }
      - { label: Owner, text: "Director of Communications." }
  - title: Second record
    tier: 3
    head: { label: Target, text: "Each card keeps the same order of fields." }
    body: "Free text behind the card's details, kept verbatim."
```

### Tabs

```visual
kind: tabs
title: Tabs show parallel profiles one at a time
items:
  - title: First profile
    text: Shown on load.
    fields: [{ label: Size, text: "Not stated." }, { label: Channels, text: "Radio, SMS." }]
  - title: Second profile
    text: Behind its tab; find in page still reaches it.
    fields: [{ label: Size, text: "Not stated." }]
```

### Sequences

```visual
kind: timeline
title: A timeline for dated or phased items
items:
  - { when: "Week 1", label: Analyse, text: "The audit." }
  - { when: "Weeks 2–3", label: Strategise, body: "The body sits behind the event's disclosure." }
```

```visual
kind: stepper
title: A stepper for an ordered process
items:
  - { label: Score, text: "Twelve words at most are visible on a step." }
  - { label: Evaluate, body: "The rest is in the step's disclosure." }
```

```visual
kind: checklist
title: A checklist for a commitment set
items:
  - { label: Named counterpart }
  - { label: Read-only analytics access, text: "Analyst role, no publishing rights." }
```

### Two columns

```visual
kind: inout
title: In and out of scope
in:
  - { label: The weekly brief }
out:
  - { label: Publishing to his accounts, text: "Firefly briefs, approves and measures.", body: "The rest of the bullet, verbatim." }
```

```visual
kind: contrast
title: What digital can and cannot do
left: { title: Can, items: [{ label: Reach the connected minority }] }
right: { title: Cannot, items: [{ label: Reach the offline majority }] }
```

### Panels

```visual
kind: hypothesis
title: A hypothesis, the evidence and the test
hypothesis: The gap is recognition, not credibility.
for: Evidence for, in the document's words.
against: Evidence against, in the document's words.
test: How Week 1 tests it.
```

```visual
kind: qa
title: An attack and its answer
attack: "\"The attack, quoted.\""
answer: The answer's first two sentences.
body: The rest of the answer, behind the disclosure.
```

### Tables

```visual
kind: crosswalk
title: How several frameworks map onto each other
columns: [Campaign pillar, Message pillar, Production pillar]
rows:
  - cells: [Fiscal discipline, Resources, P1]
  - cells: [Delivery, Proof, P2]
    body: A row's long cell, behind its disclosure.
```

```visual
kind: matrix
title: A matrix of criteria across items
columns: [Item, Cadence, Owner]
rows:
  - cells: [Weekly brief, Weekly, Firefly]
  - cells: [Field report, Daily, Campaign]
```

### Sets, weeks and charts

```visual
kind: nested
title: Nested sets
items:
  - label: Contact universe
    text: Everyone reachable by any owned channel.
    items:
      - { label: Consented SMS contacts, text: "Held with opt-in." }
```

```visual
kind: week
title: A week
items:
  - { day: Thu, items: [{ label: The brief }] }
  - { day: Fri, items: [{ label: The calendar }] }
  - { day: Mon, items: [{ label: The review, text: "Thirty minutes." }] }
```

```visual
kind: bars
title: Bars for comparable magnitudes
items:
  - { label: First, value: "62%" }
  - { label: Second, value: "38%" }
```

```visual
kind: donut
title: A donut for shares of a whole
items:
  - { label: Kikamba, value: "50%", conflict: C1 }
  - { label: Kiswahili, value: "30%" }
  - { label: English, value: "20%" }
```
