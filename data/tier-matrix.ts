// §5.5.2 "The scope levels compared", transcribed exactly.
//
// Nine attributes across three tiers. Every string here is the cell as §5.5.2 prints it — the
// table is the record and this is a second rendering of it, never a re-derivation. The prose's
// ✓ and ✗ become `true`/`false` so the interface can render them as an icon with a screen-reader
// word instead of a bare glyph, which is the one change of representation in this file.
//
// The table itself stays in the document below the carousel, as the accessible equivalent and
// as the thing a reader quotes from.

export type Cell = string | boolean;

export interface TierAttribute {
  /** The row label, as §5.5.2 prints it. */
  label: string;
  lean: Cell;
  standard: Cell;
  premium: Cell;
  /** Rendered bold in §5.5.2 — the one cell in the matrix the source emphasises. */
  emphasise?: ("lean" | "standard" | "premium")[];
}

export const TIER_ATTRIBUTES: TierAttribute[] = [
  {
    label: "Team model",
    lean: "3-person Firefly core + mandatory Kikamba producer",
    standard: "3-person Firefly core + activated surge roles",
    premium: "3-person Firefly core + full surge bench",
  },
  {
    label: "Wards with active SMS/USSD",
    lean: "Partial",
    standard: "All 40",
    premium: "All 40 + diaspora",
    emphasise: ["standard"],
  },
  { label: "Predictive voter scoring", lean: false, standard: true, premium: true },
  { label: "Multi-touch attribution", lean: false, standard: true, premium: true },
  { label: "Focus groups", lean: false, standard: "Quarterly", premium: "Monthly" },
  { label: "Red-team drills", lean: "On trigger", standard: "Quarterly", premium: "Monthly" },
  { label: "Arid-belt reach", lean: "Weak", standard: "Strong", premium: "Strong" },
  {
    label: "Realistic Phase 3 contact universe",
    lean: "~60,000",
    standard: "~150,000",
    premium: "~250,000",
  },
  // Migrated out of components/DataVisualizations.tsx, which was the only place these three
  // shares existed. They were hard-coded there as a percentage "of verified ceiling" — a figure
  // the proposal no longer carries — so nothing could review them and the figure guard could not
  // tell them from invented ones. §5.5.2 now prints them, and this is the second rendering of
  // that row on the same terms as every other row in this file.
  {
    label: "Digital ad share of the agreed spend envelope",
    lean: "15–20%",
    standard: "30–40%",
    premium: "45–55%",
  },
];

export interface TierColumn {
  id: "lean" | "standard" | "premium";
  /** §5.5.1's tier number, so the carousel and the budget modeller name the same thing. */
  number: string;
  /** §5.5.2's column heading. */
  label: string;
  recommended?: boolean;
}

export const TIER_COLUMNS: TierColumn[] = [
  { id: "lean", number: "Level 1", label: "Lean" },
  { id: "standard", number: "Level 2", label: "Standard", recommended: true },
  { id: "premium", number: "Level 3", label: "Premium" },
];
