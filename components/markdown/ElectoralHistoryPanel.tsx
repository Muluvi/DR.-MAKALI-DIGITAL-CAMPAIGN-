import { ELECTORAL_HISTORY } from "../../data/electoral-history";
import { DISPUTED_FIGURES } from "../../data/disputed-figures";
import { COURT_OF_APPEAL_2018, IEBC_2022_RESULTS, MEDIA_2022_DECLARATION } from "../../data/sources";
import { TierBadge } from "./TierBadge";
import { DisputedFigure } from "./DisputedFigure";
import { ProvenanceLine } from "./ProvenanceLine";

const musilaDispute = DISPUTED_FIGURES.find((d) => d.id === "musila-2022-governor-votes")!;

/**
 * Electoral history across 2013 / 2017 / 2022 (Section 4.6). Server component — no chart
 * library, so this renders directly rather than behind a dynamic() boundary; the Phase 6c
 * timeline chart sits alongside it in ElectoralTimelineBlock.
 */
export function ElectoralHistoryPanel() {
  return (
    <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm my-6 print-avoid-break">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
        <h4 className="font-serif text-sm font-bold text-ink">Kitui Governor, Senator and Woman Representative — Results by Cycle</h4>
      </div>
      <p className="text-[11px] text-muted mb-4 leading-relaxed pl-3.5">
        Three cycles, three different Governor-race winners. 2013 is shown as an explicit gap rather than filled in —
        see the note below and the Data Gaps Register.
      </p>

      <div className="space-y-4">
        {ELECTORAL_HISTORY.map((race, i) => (
          <div key={i} className="rounded-xl border border-line/60 bg-paper p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-ink">
                {race.year} · {race.office}
              </span>
            </div>

            {race.results ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-[9px] uppercase tracking-wider font-bold text-muted">
                      <th className="py-1 pr-3">Candidate</th>
                      <th className="py-1 pr-3">Party</th>
                      <th className="py-1 pr-3">Votes</th>
                      <th className="py-1">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {race.results.map((r, j) => (
                      <tr key={j} className="border-t border-line/40">
                        <td className="py-1.5 pr-3 font-bold text-ink">
                          {r.candidate}
                          {r.disputedFigureId && (
                            <span className="ml-1.5 text-[8px] font-black uppercase tracking-wider text-danger">Disputed ↓</span>
                          )}
                        </td>
                        <td className="py-1.5 pr-3 text-ink/70">{r.party ?? "—"}</td>
                        <td className="py-1.5 pr-3 font-black text-ink">{r.votes.toLocaleString()}</td>
                        <td className="py-1.5">
                          <TierBadge tier={r.source.tier} compact />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-muted italic">{race.gapNote}</p>
            )}
          </div>
        ))}
      </div>

      <DisputedFigure entry={musilaDispute} />

      <ProvenanceLine
        provenance={[
          { source: COURT_OF_APPEAL_2018, granularity: "county" },
          { source: IEBC_2022_RESULTS, granularity: "county" },
          { source: MEDIA_2022_DECLARATION, granularity: "county" },
        ]}
      />
    </div>
  );
}
