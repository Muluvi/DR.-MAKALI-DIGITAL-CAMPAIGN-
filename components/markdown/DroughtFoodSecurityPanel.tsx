import { NDMA_DROUGHT_PHASE, IPC_FOOD_SECURITY_PHASE, FOOD_RESERVE_HOUSEHOLDS, MARCH_2026_FLOODING } from "../../data/drought-food-security";
import { TierBadge } from "./TierBadge";
import { FigureBlock } from "./FigureBlock";

const ITEMS = [NDMA_DROUGHT_PHASE, IPC_FOOD_SECURITY_PHASE, FOOD_RESERVE_HOUSEHOLDS, MARCH_2026_FLOODING];

function formatItemValue(value: string | number, unit: string): string {
  return typeof value === "number" ? `${value.toLocaleString()} ${unit}` : `${value}`;
}

/** Drought and food security (Section 4.8). Server component, no chart. */
export function DroughtFoodSecurityPanel() {
  return (
    <FigureBlock
      title="Drought, Food Security and Climate Volatility"
      provenance={ITEMS.map((i) => i.provenance)}
    >
      <p className="t-small text-muted mb-4 leading-relaxed pl-3.5">
        Climate volatility in Kitui now runs both directions — drought classification and flood exposure in the same
        reporting period.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ITEMS.map((item, i) => (
          <div key={i} className="rounded-xl border border-line/60 bg-paper p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="t-micro uppercase tracking-wider font-bold text-muted">{item.label}</span>
              <TierBadge tier={item.provenance.source.tier} compact />
            </div>
            <div className="font-serif text-sm font-black text-ink">{formatItemValue(item.value, item.unit)}</div>
            {item.provenance.note && <div className="t-label text-muted italic mt-1 leading-relaxed">{item.provenance.note}</div>}
          </div>
        ))}
      </div>
    </FigureBlock>
  );
}
