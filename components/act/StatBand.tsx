"use client";

import React from "react";

import { CountUp } from "../visual/Numerals";
import { Scene } from "./Scene";

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  /** The line that stops the figure being decoration. */
  note?: string;
}

/**
 * Three or four figures, given room.
 *
 * The document states these inside sentences, where a reader skims past them. The act pulls the
 * ones the argument actually turns on out into their own band so the scroll has a place to stop.
 * Every figure keeps a note underneath, because a number the reader cannot source is a number
 * they cannot use in a meeting.
 */
export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <Scene>
      <div className="mx-auto max-w-5xl px-[var(--act-gutter)]">
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--act-hair)" }}>
          {stats.map((s) => (
            <div key={s.label} className="p-6 lg:p-7" style={{ background: "var(--act-ground)" }}>
              <p
                className="font-sans font-bold leading-none tracking-[-0.03em]"
                style={{ color: "var(--act-blue)", fontSize: "clamp(1.9rem, 1.4rem + 1.7vw, 2.6rem)" }}
              >
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </p>
              <p
                className="mt-3 font-sans uppercase tracking-[0.13em] text-[0.625rem] font-bold"
                style={{ color: "var(--act-text)" }}
              >
                {s.label}
              </p>
              {s.note ? (
                <p className="mt-2 text-[0.8125rem] leading-snug" style={{ color: "var(--act-dim)" }}>
                  {s.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}
