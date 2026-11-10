/**
 * The reader's effects preferences, kept in this browser only.
 *
 * Every read and write is wrapped: blocked storage (a private window, a locked-down browser)
 * changes nothing except that the choice is not remembered. A change is broadcast as
 * `kitui:fx-prefs` so every effect reacts without a React tree in common.
 */

export type Palette = "wiper" | "jacaranda" | "acacia" | "rains" | "season";
const PALETTES: readonly Palette[] = ["wiper", "jacaranda", "acacia", "rains", "season"];

export type FxPrefs = {
  /** Subtle WebAudio feedback on taps. Off by default: sound is never assumed. */
  sound: boolean;
  /** The branded cursor and its trail (fine pointers only). */
  cursor: boolean;
  /** Ambient loops: the hero shader, particles, the aurora, the marquee. */
  ambient: boolean;
  /** Scales tilt, magnet, parallax and skew: 0 (none) to 100 (full). */
  intensity: number;
  palette: Palette;
};

export const FX_DEFAULTS: FxPrefs = { sound: false, cursor: true, ambient: true, intensity: 70, palette: "wiper" };

const KEY = "kitui2027:fx";
export const FX_EVENT = "kitui:fx-prefs";

export function readPrefs(): FxPrefs {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...FX_DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<FxPrefs>;
    if (!PALETTES.includes(parsed.palette as Palette)) delete parsed.palette;
    return { ...FX_DEFAULTS, ...parsed, intensity: Math.max(0, Math.min(100, Number(parsed.intensity ?? FX_DEFAULTS.intensity))) };
  } catch {
    return { ...FX_DEFAULTS };
  }
}

export function writePrefs(next: FxPrefs) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Not remembered; still applied for this visit.
  }
  applyPrefs(next);
  window.dispatchEvent(new CustomEvent<FxPrefs>(FX_EVENT, { detail: next }));
}

export function resetPrefs() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // As above.
  }
  applyPrefs(FX_DEFAULTS);
  window.dispatchEvent(new CustomEvent<FxPrefs>(FX_EVENT, { detail: { ...FX_DEFAULTS } }));
}

/**
 * Kenya's two rainy seasons set the seasonal palette: the long rains (March–May) are acacia
 * green, the short rains (October–December) rain-cloud teal, and the dry months the campaign's
 * own Wiper blue. (Laterite was considered and rejected: the maps use an earth tone for the pool
 * wards, and an accent of the same hue would erase the held/pool distinction.)
 */
export function seasonalPalette(month = new Date().getMonth()): Exclude<Palette, "season"> {
  if (month >= 2 && month <= 4) return "acacia";
  if (month >= 9 && month <= 11) return "rains";
  return "wiper";
}

/** Writes the preferences onto <html> as data attributes and one custom property the CSS reads. */
export function applyPrefs(p: FxPrefs) {
  const root = document.documentElement;
  const palette = p.palette === "season" ? seasonalPalette() : p.palette;
  if (palette === "wiper") root.removeAttribute("data-fx-palette");
  else root.setAttribute("data-fx-palette", palette);
  root.toggleAttribute("data-fx-still", !p.ambient);
  root.toggleAttribute("data-fx-cursor", p.cursor);
  root.style.setProperty("--fx-k", (p.intensity / 100).toFixed(2));
}

/** True when motion is welcome: no reduced-motion preference. */
export function motionOk(): boolean {
  try {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** A mouse or trackpad, not a finger. */
export function finePointer(): boolean {
  try {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  } catch {
    return false;
  }
}
