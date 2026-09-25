"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};
const DAY = 24 * 60 * 60 * 1000;

/**
 * Days to a fixed date, counted from the reader's own device date (brief §10, fig-1-1).
 *
 * Truthful, not "live": it is computed once when the page loads and never ticks, and it says what
 * it is counted from. The server cannot know the reader's date, so the server HTML carries nothing
 * here and the timeline beneath carries the date itself; with scripts off nothing is lost.
 */
export function Countdown({ to, label }: { to: string; label: string }) {
  const days = useSyncExternalStore(
    noSubscribe,
    () => {
      const [y, m, d] = to.split("-").map(Number);
      const now = new Date();
      const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      return Math.round((Date.UTC(y, m - 1, d || 1) - today) / DAY);
    },
    () => null
  );
  if (days === null || days < 0) return null;
  return (
    <p className="kx-countdown">
      <span className="kx-countdown__n pf-num">{days.toLocaleString("en-KE")}</span>
      <span className="kx-countdown__t">
        {days === 1 ? "day" : "days"} to the {label}, counted from today&rsquo;s date on this device
      </span>
    </p>
  );
}
