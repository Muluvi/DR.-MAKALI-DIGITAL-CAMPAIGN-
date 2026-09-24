"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

import type { SceneTheme } from "../../lib/premium/palette";
import { weaveDataUri } from "./weave";

/**
 * The frame page's two review controls: theme (dark default, light) and the display face
 * (Bricolage Grotesque, or the alternative, Mona Sans). They are review aids for Phase 0, not
 * features of the proposal, and they are scoped to this page: the live document is untouched.
 */
type Display = "bricolage" | "mona";

const Ctx = createContext<{ theme: SceneTheme; display: Display; setTheme: (t: SceneTheme) => void }>({
  theme: "dark",
  display: "bricolage",
  setTheme: () => {},
});
export const useFrames = () => useContext(Ctx);

const noSubscribe = () => () => {};
let queryCache: { theme: string | null; display: string | null } | null = null;
function readQuery() {
  if (!queryCache) {
    const p = new URLSearchParams(window.location.search);
    queryCache = { theme: p.get("theme"), display: p.get("display") };
  }
  return queryCache;
}

export function FramesShell({ children }: { children: ReactNode }) {
  // A review link can pin both: ?theme=light&display=mona. The server (and hydration) answer
  // null, so the HTML is always the default and the query applies in the same commit after.
  const q = useSyncExternalStore(noSubscribe, readQuery, () => null);
  const [themeChoice, setTheme] = useState<SceneTheme | null>(null);
  const [displayChoice, setDisplay] = useState<Display | null>(null);
  const theme: SceneTheme = themeChoice ?? (q?.theme === "light" ? "light" : "dark");
  const display: Display = displayChoice ?? (q?.display === "mona" ? "mona" : "bricolage");

  return (
    <Ctx.Provider value={{ theme, display, setTheme }}>
      <div
        className="pf"
        data-theme={theme}
        data-display={display}
        style={{ "--pf-weave-img": weaveDataUri(theme === "dark" ? "rgb(236,224,196)" : "rgb(58,44,30)", 1) } as React.CSSProperties}
      >
        <header className="pf-review">
          <p className="pf-review__title">
            <strong>Style frames</strong>
            <span> · Phase 0, for review. Illustrative frames of the proposed visual language; not the live document.</span>
          </p>
          <div className="pf-review__controls">
            <div className="pf-seg" role="group" aria-label="Theme">
              {(["dark", "light"] as const).map((t) => (
                <button key={t} type="button" aria-pressed={theme === t} onClick={() => setTheme(t)}>
                  {t === "dark" ? "Dark" : "Light"}
                </button>
              ))}
            </div>
            <div className="pf-seg" role="group" aria-label="Display typeface">
              {(["bricolage", "mona"] as const).map((d) => (
                <button key={d} type="button" aria-pressed={display === d} onClick={() => setDisplay(d)}>
                  {d === "bricolage" ? "Bricolage Grotesque" : "Mona Sans"}
                </button>
              ))}
            </div>
          </div>
        </header>
        <div className="pf-grain" aria-hidden="true" />
        {children}
      </div>
    </Ctx.Provider>
  );
}
