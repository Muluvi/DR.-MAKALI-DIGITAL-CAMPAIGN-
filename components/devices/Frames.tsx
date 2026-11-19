import type { ReactNode } from "react";

/**
 * Generic device frames (visual upgrade, B3, B4 and B2): a laptop, a tablet, a smartwatch and a
 * television, from the same family as the phone (rounded glass, a dark bezel, the site's shadow).
 * No maker, no logo, no channel brand. Each frame only holds a screen; what is on the screen
 * decides whether the whole is labelled illustrative.
 */

export function Laptop({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="dv-laptop" role="group" aria-label={label}>
      <div className="dv-laptop__lid">
        <span className="dv-laptop__cam" aria-hidden="true" />
        <div className="dv-laptop__screen">{children}</div>
      </div>
      <div className="dv-laptop__base" aria-hidden="true"><span /></div>
    </div>
  );
}

export function Tablet({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="dv-tablet" role="group" aria-label={label}>
      <div className="dv-tablet__screen">{children}</div>
    </div>
  );
}

export function Watch({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="dv-watch" role="group" aria-label={label}>
      <span className="dv-watch__strap dv-watch__strap--top" aria-hidden="true" />
      <div className="dv-watch__case">
        <span className="dv-watch__crown" aria-hidden="true" />
        <div className="dv-watch__screen">{children}</div>
      </div>
      <span className="dv-watch__strap dv-watch__strap--bottom" aria-hidden="true" />
    </div>
  );
}

export function TvSet({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="dv-tv" role="group" aria-label={label}>
      <div className="dv-tv__screen">{children}</div>
      <div className="dv-tv__stand" aria-hidden="true"><span /></div>
    </div>
  );
}
