/**
 * "The county, measured": the palette as data, for the one consumer that cannot read CSS custom
 * properties — the WebGL scene. Every value here mirrors a token in app/style-frames/frames.css
 * (and, after Phase 1, app/globals.css). Contrast for each text/fill pair is recorded in
 * docs/visual-premium/PHASE-0.md.
 */
import { Color } from "three";

type Oklch = [number, number, number];

/** OKLCH to linear-light sRGB (Björn Ottosson's OKLab matrices), clamped to gamut. */
export function oklchToLinear([L, C, h]: Oklch): [number, number, number] {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  return [clamp(r), clamp(g), clamp(bl)];
}

const col = (v: Oklch) => {
  const [r, g, b] = oklchToLinear(v);
  return new Color().setRGB(r, g, b);
};

export type SceneTheme = "dark" | "light";

export interface SceneColors {
  held: Color;
  pool: Color;
  other: Color;
  weave: Color;
  edge: Color;
  sky: Color;
  groundLight: Color;
  sun: Color;
  /** A ward the story is pointing at, and one it is not (the §3 story). */
  highlight: Color;
  dim: Color;
}

export const SCENE_COLORS: Record<SceneTheme, SceneColors> = {
  dark: {
    held: col([0.56, 0.2, 265]),
    pool: col([0.58, 0.15, 40]),
    other: col([0.52, 0.03, 262]),
    weave: col([0.86, 0.06, 80]),
    edge: col([0.16, 0.03, 262]),
    sky: col([0.95, 0.02, 250]),
    groundLight: col([0.3, 0.03, 262]),
    sun: col([0.98, 0.02, 85]),
    highlight: col([0.86, 0.06, 85]),
    dim: col([0.32, 0.025, 262]),
  },
  light: {
    held: col([0.5, 0.21, 265]),
    pool: col([0.58, 0.15, 40]),
    other: col([0.64, 0.03, 85]),
    weave: col([0.97, 0.03, 85]),
    edge: col([0.97, 0.012, 85]),
    sky: col([1, 0, 0]),
    groundLight: col([0.7, 0.02, 85]),
    sun: col([1, 0.01, 85]),
    highlight: col([0.4, 0.06, 262]),
    dim: col([0.9, 0.012, 85]),
  },
};
