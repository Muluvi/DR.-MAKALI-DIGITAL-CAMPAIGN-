"use client";

import { useCallback, useId, useRef, useState } from "react";

import { AnimatedNumber } from "../visual/AnimatedNumber";
import { SaveImage } from "../visual/SaveImage";

/**
 * What it takes, under the turnout you set (visual upgrade, C27 with C12 and C18).
 *
 * One dial controls the one input the Winning-Number Simulator starts from: county turnout. The
 * arithmetic is the simulator's own, and nothing else: ballots in a constituency are its 2022
 * registered voters × turnout; the even share is the one equal share across all eight that reaches
 * the benchmark; each constituency's contribution is its ballots × that share. So the eight
 * contributions always add up to the benchmark exactly, and the ballot box fills to the same line
 * whatever the dial says. What the dial changes is how full the box is with ballots overall, and so
 * how large a share of them the benchmark needs.
 *
 * None of it is a forecast: the share is arithmetic, not evidence of support.
 */
export type DialConstituency = { id: string; name: string; voters: number; pool: boolean };

const MIN = 40;
const MAX = 85;
/** The dial sweeps 270°, from 7:30 to 4:30, the way a real knob does. */
const SWEEP = 270;
const START = -135;

const angleOf = (t: number) => START + ((t - MIN) / (MAX - MIN)) * SWEEP;

export function WinningDial({ cons, benchmark, turnout2022 }: { cons: DialConstituency[]; benchmark: number; turnout2022: number }) {
  const [t, setT] = useState(turnout2022);
  const knob = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const ballotsOf = (c: DialConstituency) => c.voters * (t / 100);
  const ballots = cons.reduce((n, c) => n + ballotsOf(c), 0);
  const share = ballots > 0 ? benchmark / ballots : 0;
  const reachable = share <= 1;
  const rows = [...cons]
    .map((c) => ({ c, ballots: ballotsOf(c), votes: ballotsOf(c) * Math.min(share, 1) }))
    .sort((a, b) => b.votes - a.votes);

  const set = useCallback((v: number) => setT(Math.round(Math.min(MAX, Math.max(MIN, v)) * 10) / 10), []);

  const fromPointer = (e: React.PointerEvent) => {
    const el = knob.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const a = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    const clamped = Math.max(START, Math.min(START + SWEEP, a));
    set(MIN + ((clamped - START) / SWEEP) * (MAX - MIN));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 0.5;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowUp" ? t + step
      : e.key === "ArrowLeft" || e.key === "ArrowDown" ? t - step
      : e.key === "PageUp" ? t + 5
      : e.key === "PageDown" ? t - 5
      : e.key === "Home" ? MIN
      : e.key === "End" ? MAX
      : null;
    if (to === null) return;
    e.preventDefault();
    set(to);
  };

  // The box: its full height is every ballot cast; the coloured layers are the benchmark's votes,
  // stacked by constituency, so the fill line is the benchmark as a share of the ballots.
  const BOX_H = 220;
  // Where each constituency's layer and step start: the running total of the ones before it.
  const starts = rows.map((_, i) => rows.slice(0, i).reduce((n, r) => n + r.votes, 0));
  const total = run(rows);

  return (
    <div className="wd">
      <div className="wd__control">
        <div
          ref={knob}
          className="wd__knob"
          role="slider"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={t}
          aria-valuetext={`${t.toFixed(1)}% turnout`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => {
            if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) fromPointer(e);
          }}
        >
          <svg viewBox="-60 -60 120 120" aria-hidden="true" className="wd__svg">
            <circle r="52" className="wd__ring" />
            {Array.from({ length: (MAX - MIN) / 5 + 1 }, (_, i) => {
              const a = ((angleOf(MIN + i * 5) - 90) * Math.PI) / 180;
              return <line key={i} x1={Math.cos(a) * 44} y1={Math.sin(a) * 44} x2={Math.cos(a) * 50} y2={Math.sin(a) * 50} className="wd__tick" />;
            })}
            {(() => {
              const a = ((angleOf(turnout2022) - 90) * Math.PI) / 180;
              return <circle cx={Math.cos(a) * 56} cy={Math.sin(a) * 56} r="3" className="wd__ref" />;
            })()}
            <g style={{ transform: `rotate(${angleOf(t)}deg)` }} className="wd__cap">
              <circle r="36" className="wd__face" />
              <line x1="0" y1="-30" x2="0" y2="-18" className="wd__pointer" />
            </g>
          </svg>
          <span className="wd__read">
            <AnimatedNumber value={t} decimals={1} suffix="%" className="wd__t" />
            <span id={labelId} className="wd__tl">turnout</span>
          </span>
        </div>
        <p className="wd__hint">
          Turn the dial, or use the arrow keys. The dot marks 2022&rsquo;s certified turnout.
        </p>
        <div className="wd__btns">
          <button type="button" className="plat-btn plat-btn-sm" onClick={() => setT(turnout2022)}>Back to 2022 turnout</button>
          <SaveImage card={{ type: "big-number", params: { view: "winning", turnout: t.toFixed(1) } }} title="What it takes to win Kitui" />
        </div>
      </div>

      <div className="wd__out">
        <dl className="wd__stats">
          <div>
            <dt>Ballots cast</dt>
            <dd><AnimatedNumber value={Math.round(ballots)} /></dd>
          </div>
          <div>
            <dt>Benchmark</dt>
            <dd><AnimatedNumber value={benchmark} /></dd>
          </div>
          <div data-tone={reachable ? "ok" : "warn"}>
            <dt>Share needed in every constituency</dt>
            <dd>{reachable ? <AnimatedNumber value={share * 100} decimals={1} suffix="%" /> : "More than every ballot"}</dd>
          </div>
        </dl>

        <div className="wd__viz">
          <div className="wd__box" role="img" aria-label={`Ballot box: ${Math.round(Math.min(share, 1) * 100)}% of the ballots must go to him to reach the benchmark.`}>
            <span className="wd__slot" aria-hidden="true" />
            <div className="wd__inside" style={{ height: BOX_H }}>
              {rows.map((r, i) => {
                const h = (r.votes / ballots) * BOX_H;
                const y = (starts[i] / ballots) * BOX_H;
                return (
                  <span
                    key={r.c.id}
                    className="wd__layer"
                    data-pool={r.c.pool ? "true" : "false"}
                    data-odd={i % 2 ? "true" : "false"}
                    style={{ height: BOX_H, transform: `translateY(${BOX_H - y - h}px) scaleY(${h / BOX_H})` }}
                  />
                );
              })}
              <span className="wd__line" style={{ transform: `translateY(${BOX_H - Math.min(share, 1) * BOX_H}px)` }}>
                <span>benchmark</span>
              </span>
            </div>
          </div>

          <ol className="wd__fall" aria-label="Each constituency's votes at the even share, adding up to the benchmark">
            {rows.map((r, i) => {
                const start = starts[i];
                return (
                  <li key={r.c.id} className="wd__step" data-pool={r.c.pool ? "true" : "false"}>
                    <span className="wd__name">{r.c.name}</span>
                    <span className="wd__track" aria-hidden="true">
                      <span className="wd__seg" style={{ transform: `translateX(${(start / benchmark) * 100}%) scaleX(${r.votes / benchmark})` }} />
                    </span>
                    <span className="wd__n"><AnimatedNumber value={Math.round(r.votes)} /></span>
                  </li>
                );
            })}
            <li className="wd__step wd__step--total">
              <span className="wd__name">Total</span>
              <span className="wd__track" aria-hidden="true"><span className="wd__seg" style={{ transform: `scaleX(${Math.min(1, total / benchmark)})` }} /></span>
              <span className="wd__n"><AnimatedNumber value={Math.round(total)} /></span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

const run = (rows: { votes: number }[]) => rows.reduce((n, r) => n + r.votes, 0);
