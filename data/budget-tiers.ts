// §9.2.5's three tiers, priced against the verified statutory ceiling.
//
// The point this file exists to make structural, because §9.2.5 makes it twice in prose and the
// interface should make it once properly: AD SPEND SITS INSIDE THE CEILING. It is regulated
// expenditure alongside transport, venues and personnel — not a budget added on top of them.
// Every tier's band is therefore a fraction of one bar, never a bar of its own.
//
// The KSh64.5m operational plan is a different quantity again: the campaign's own spending
// intent for the whole operation, where the ceiling is the legal limit on all regulated
// expenditure. Both appear, labelled, because §9.2.5 is explicit that they are not the same.
import { KITUI_SPENDING_CEILING } from "./spending-ceiling";

export const CEILING = KITUI_SPENDING_CEILING.value;

/** §9.2.5's operational budget for the whole campaign. Not a share of the ceiling. */
export const OPERATIONAL_PLAN = 64_500_000;

export interface BudgetTier {
  id: "lean" | "standard" | "premium";
  name: string;
  label: string;
  purpose: string;
  /** Ad-spend band as a percentage of the ceiling, as printed. */
  pctFrom: number;
  pctTo: number;
  /** The same band in shillings, as printed. */
  fromKsh: number;
  toKsh: number;
  /** §9.2.6's contact universe for this tier. */
  contactUniverse: string;
  team: string;
  ussd: string;
  tradeOff: string;
  recommended?: boolean;
}

export const BUDGET_TIERS: BudgetTier[] = [
  {
    id: "lean",
    name: "Tier 1",
    label: "Lean",
    purpose: "Win the nomination, hold the field, prove the model.",
    pctFrom: 15,
    pctTo: 20,
    fromKsh: 14_630_000,
    toKsh: 19_510_000,
    contactUniverse: "~60k",
    team: "3-person core + Kikamba producer only",
    ussd: "Not activated",
    tradeOff:
      "No predictive modelling, no attribution beyond last-click, arid-belt reach materially limited — strongest where Dr. Mulu is already strongest, which is this tier's central weakness.",
  },
  {
    id: "standard",
    name: "Tier 2",
    label: "Standard",
    purpose:
      "Close the recognition gap countywide and contest the general election competitively.",
    pctFrom: 30,
    pctTo: 40,
    fromKsh: 29_270_000,
    toKsh: 39_020_000,
    contactUniverse: "~150k",
    team: "Lean Firefly core + surge bench activated by phase and KPI",
    ussd: "Shared code, all networks",
    tradeOff:
      "No premium social listening licences; sign-language interpretation on flagship content only rather than all video.",
    recommended: true,
  },
  {
    id: "premium",
    name: "Tier 3",
    label: "Premium",
    purpose: "Dominate share of voice and run a fully instrumented operation.",
    pctFrom: 45,
    pctTo: 55,
    fromKsh: 43_900_000,
    toKsh: 53_660_000,
    contactUniverse: "~250k",
    team: "3-person core + full surge bench",
    ussd: "Dedicated short code, expanded WhatsApp Business API",
    tradeOff:
      "Approaches the statutory ceiling — requires disciplined headroom management, since the ceiling covers the whole campaign, not the digital function alone.",
  },
];

/** The other regulated expenditure the ceiling also has to cover, named in §9.2.5. */
export const OTHER_REGULATED = ["Transport", "Venues", "Personnel"];
