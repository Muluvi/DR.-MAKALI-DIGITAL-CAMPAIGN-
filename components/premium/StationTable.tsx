import { RADIO_STATIONS } from "../../data/media-ownership";
import { ProvPill } from "./ProvPill";

/**
 * The §2.7 station table in the G-6 system, fixing D-03 (one character per line on a phone).
 *
 * One markup, two layouts:
 *   wide    a real table: sticky header, the station column pinned if it ever has to scroll,
 *           reach drawn as a three-step glyph beside its word
 *   phone   each row becomes a card: the station as its heading, then label-above-value pairs,
 *           never right-aligned values wrapping into a ragged column
 *
 * The words and tiers are exactly those of data/media-ownership.ts and the component that renders
 * it today; reach stays a qualitative 1-3 reading, labelled as such, never a listenership figure.
 */
const TIER = { 1: "T1", 2: "T2", 3: "T3" } as const;

export function StationTable() {
  return (
    <div className="pf-g6">
      <div className="pf-table-wrap pf-table-wrap--pin" role="region" aria-label="Kikamba-language stations: ownership, frequency and reach" tabIndex={0}>
        <table className="pf-table pf-table--cards">
          <caption className="pf-table__caption">
            Kikamba-language stations: who owns them, where they broadcast, and how far they reach (a qualitative read, not a measured audience)
          </caption>
          <thead>
            <tr>
              <th scope="col">Station</th>
              <th scope="col">Frequency</th>
              <th scope="col">Reported alignment</th>
              <th scope="col">Reach (qualitative)</th>
              <th scope="col">Tier</th>
            </tr>
          </thead>
          <tbody>
            {RADIO_STATIONS.map((s) => {
              const reach = s.reachLabel.split(" (")[0];
              return (
                <tr key={s.name}>
                  <th scope="row">{s.name}</th>
                  <td data-label="Frequency" className="pf-num">{s.frequency ?? "Not published"}</td>
                  <td data-label="Reported alignment">{s.alignment}</td>
                  <td data-label="Reach (qualitative)">
                    <span className="pf-reach" aria-hidden="true">
                      {[1, 2, 3].map((n) => (
                        <i key={n} data-on={n <= s.reachTier ? "true" : "false"} />
                      ))}
                    </span>
                    {reach}
                  </td>
                  <td data-label="Tier">
                    <ProvPill p={{ tier: TIER[s.source.tier as 1 | 2 | 3] ?? null }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
