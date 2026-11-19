"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotionSafe } from "../../hooks/use-reduced-motion-safe";

/**
 * The Kitui chapter's map, told in steps as the reader scrolls (visual upgrade, C15).
 *
 * The county's real ward boundaries stay pinned while short captions scroll past; each caption
 * swaps the layer (voters, polling stations, county projects, the zones) and the last one closes in
 * on the pool, where he has never held office. Layers crossfade and the camera moves by transform
 * only. Under reduced motion nothing is pinned or scrubbed: every step is drawn as its own small map
 * beside its caption, which is the story's true final state.
 */
export type StoryWard = { id: string; name: string; path: string; q: Record<string, number>; zone: string; pool: boolean };
export type StoryStep = { layer: "voters" | "stations" | "projects" | "zones" | "pool"; title: string; text: string };

/** The camera for each step, in the map's 600 × 1000 box: scale about a centre point. */
type Cam = { s: number; cx: number; cy: number };

function Layer({ wards, layer, active }: { wards: StoryWard[]; layer: StoryStep["layer"]; active: boolean }) {
  return (
    <g className="ms__layer" data-on={active ? "true" : "false"}>
      {wards.map((w) => {
        const cls =
          layer === "zones" ? `ms-z--${w.zone}`
          : layer === "pool" ? (w.pool ? "ms-pool" : "ms-dim")
          : `ms-q${w.q[layer]}`;
        return <path key={w.id} d={w.path} className={cls} />;
      })}
    </g>
  );
}

function Legend({ layer }: { layer: StoryStep["layer"] }) {
  if (layer === "zones")
    return (
      <p className="ms__legend">
        <span className="ms-key ms-z--anchor" /> anchor <span className="ms-key ms-z--mwingi" /> Mwingi <span className="ms-key ms-z--arid" /> arid belt <span className="ms-key ms-z--none" /> in no zone
      </p>
    );
  if (layer === "pool")
    return (
      <p className="ms__legend">
        <span className="ms-key ms-pool" /> never held office
      </p>
    );
  return (
    <p className="ms__legend">
      fewest <span className="ms-key ms-q0" /><span className="ms-key ms-q1" /><span className="ms-key ms-q2" /><span className="ms-key ms-q3" /><span className="ms-key ms-q4" /> most, by fifths of the 40 wards
    </p>
  );
}

function Map({ wards, steps, active, cam, label }: { wards: StoryWard[]; steps: StoryStep[]; active: number; cam: Cam; label: string }) {
  return (
    <svg viewBox="0 0 600 1000" className="ms__map" role="img" aria-label={label}>
      <g className="ms__cam" style={{ transform: `translate(300px, 500px) scale(${cam.s}) translate(${-cam.cx}px, ${-cam.cy}px)` }}>
        {steps.map((s, i) => (
          <Layer key={s.layer} wards={wards} layer={s.layer} active={i === active} />
        ))}
      </g>
    </svg>
  );
}

export function MapStory({ wards, steps, poolCam }: { wards: StoryWard[]; steps: StoryStep[]; poolCam: Cam }) {
  const reduce = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const whole: Cam = { s: 1, cx: 300, cy: 500 };

  useEffect(() => {
    if (reduce || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [reduce]);

  if (reduce) {
    return (
      <ol className="ms ms--still">
        {steps.map((s, i) => (
          <li key={s.layer} className="ms__still">
            <Map wards={wards} steps={steps} active={i} cam={s.layer === "pool" ? poolCam : whole} label={`${s.title}. ${s.text}`} />
            <div>
              <h5 className="ms__title">{s.title}</h5>
              <p className="ms__text">{s.text}</p>
              <Legend layer={s.layer} />
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const step = steps[active];
  return (
    <div className="ms">
      <div className="ms__pin">
        <Map wards={wards} steps={steps} active={active} cam={step.layer === "pool" ? poolCam : whole} label={`${step.title}. ${step.text}`} />
        <Legend layer={step.layer} />
      </div>
      <ol className="ms__steps">
        {steps.map((s, i) => (
          <li key={s.layer} ref={(el) => { refs.current[i] = el; }} data-step={i} className="ms__step" data-on={i === active ? "true" : "false"}>
            <h5 className="ms__title">{s.title}</h5>
            <p className="ms__text">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
