"use client";

import { useId, useState } from "react";

/**
 * A radio set (visual upgrade, B1): slide the tuning dial across the eight Kikamba stations the
 * Radio Planner holds. The panel shows each station's frequency, ownership, the plan's posture,
 * its regional listener share where one is measured, and the Radio Planner's starting plan.
 *
 * No audio: no script has been recorded, and the site does not voice one for it. The caption
 * line shows the one line the plan's radio script fixes, the slogan.
 */
export type RadioStationView = {
  name: string;
  frequency: string | null;
  alignment: string;
  posture: string;
  reachLabel: string;
  share: string | null;
  spots: number;
};

export function RadioSet({ stations, slogan, sloganKikamba }: { stations: RadioStationView[]; slogan: string; sloganKikamba: string }) {
  const [i, setI] = useState(() => Math.max(0, stations.findIndex((s) => s.spots > 0)));
  const id = useId();
  const s = stations[i];
  const pos = stations.length > 1 ? i / (stations.length - 1) : 0;
  return (
    <div className="rs">
      <div className="rs__body">
        <div className="rs__grille" aria-hidden="true" />
        <div className="rs__panel">
          <div className="rs__scale" aria-hidden="true">
            {stations.map((st, k) => (
              <span key={st.name} className="rs__mark" data-on={k === i ? "true" : "false"} style={{ left: `${(k / (stations.length - 1)) * 100}%` }} />
            ))}
            <span className="rs__needle" style={{ transform: `translateX(calc(${pos} * (var(--rs-w) - 2px)))` }} />
          </div>
          <label className="rs__tune" htmlFor={id}>
            <span className="sr-only">Tune to a station</span>
            <input
              id={id}
              type="range"
              min={0}
              max={stations.length - 1}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              aria-valuetext={`${s.name}${s.frequency ? `, ${s.frequency}` : ""}`}
            />
          </label>
        </div>
      </div>
      <div className="rs__info" aria-live="polite">
        <p className="rs__name">
          {s.name} <span className="rs__freq">{s.frequency ?? "Kitui frequency not published"}</span>
        </p>
        <dl className="rs__facts">
          <div><dt>Ownership</dt><dd>{s.alignment}</dd></div>
          <div><dt>The plan says</dt><dd>{s.posture}</dd></div>
          <div><dt>Listener share</dt><dd>{s.share ? `${s.share} of Lower Eastern listeners (Tier 2)` : "Not measured"} · {s.reachLabel}</dd></div>
          <div><dt>Starting plan</dt><dd>{s.spots ? `${s.spots} spots a week` : "No spots: not a placement target"}</dd></div>
        </dl>
        <p className="rs__cap"><span className="rs__capk">Caption</span> {slogan} · <i>{sloganKikamba}</i></p>
      </div>
    </div>
  );
}
