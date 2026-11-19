"use client";

import { useId, useState } from "react";

import { KituiIcon } from "../icons/kitui";

/**
 * A field day on a matatu's dashboard screen (visual upgrade, B5), and the boarding pass for its
 * first stop (C8).
 *
 * The stops are the Voter Density Finder's answer: the busiest polling centres in the constituency
 * the reader picks, by 2022 registered voters. The pass carries the ward, the centre and a QR code
 * to the ward's dossier on the site. The date is the field team's to set, so the pass leaves it
 * blank rather than inventing one.
 */
export type FieldStop = { centre: string; ward: string; wardCode: string; voters: number; streams: number };
export type FieldRoute = { constituency: string; stops: FieldStop[]; qr: string; link: string };

export function FieldDay({ routes }: { routes: FieldRoute[] }) {
  const [i, setI] = useState(0);
  const id = useId();
  const r = routes[i];
  const total = r.stops.reduce((n, s) => n + s.voters, 0);
  const first = r.stops[0];
  return (
    <div className="fd">
      <label className="fd__pick" htmlFor={id}>
        <span>Constituency</span>
        <select id={id} value={i} onChange={(e) => setI(Number(e.target.value))}>
          {routes.map((x, k) => <option key={x.constituency} value={k}>{x.constituency}</option>)}
        </select>
      </label>

      <div className="fd__dash" role="group" aria-label={`Illustrative matatu dashboard screen: a field day in ${r.constituency}`}>
        <div className="fd__screen">
          <p className="fd__head">
            <KituiIcon name="matatu" size={20} /> FIELD DAY · {r.constituency.toUpperCase()}
            <span className="fd__sum">{r.stops.length} stops · {total.toLocaleString("en-KE")} voters</span>
          </p>
          <ol className="fd__stops">
            {r.stops.map((s, k) => (
              <li key={`${s.wardCode}-${s.centre}`} className="fd__stop" data-first={k === 0 ? "true" : "false"}>
                <span className="fd__dot" aria-hidden="true" />
                <span className="fd__centre">{s.centre}</span>
                <span className="fd__ward">{s.ward} · {s.streams} {s.streams === 1 ? "stream" : "streams"}</span>
                <span className="fd__v">{s.voters.toLocaleString("en-KE")}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bp" role="group" aria-label={`Illustrative boarding pass for the first stop, ${first.centre}`}>
        <div className="bp__main">
          <p className="bp__k">FIELD DAY PASS</p>
          <p className="bp__route"><span>{r.constituency}</span><KituiIcon name="matatu" size={16} /><span>{first.ward}</span></p>
          <dl className="bp__grid">
            <div><dt>Centre</dt><dd>{first.centre}</dd></div>
            <div><dt>Ward</dt><dd>{first.ward}</dd></div>
            <div><dt>Registered</dt><dd>{first.voters.toLocaleString("en-KE")}</dd></div>
            <div><dt>Date</dt><dd className="bp__blank">set by the field team</dd></div>
          </dl>
        </div>
        <div className="bp__stub">
          <span className="bp__qr" dangerouslySetInnerHTML={{ __html: r.qr }} />
          <span className="bp__scan">Scan for the ward dossier</span>
        </div>
      </div>
    </div>
  );
}
