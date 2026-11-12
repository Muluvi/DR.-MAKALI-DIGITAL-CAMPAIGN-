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

/** Lighter starting point for constrained devices: no shader, aurora or cursor, gentler motion. */
export const FX_LITE: FxPrefs = { sound: false, cursor: false, ambient: false, intensity: 30, palette: "wiper" };

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };

/**
 * True on a device or connection where the ambient effects cost more than they give: data saver
 * on, a 2G or 3G connection, two CPU cores or fewer, or 2 GB of memory or less. Most of Kitui's
 * readers are on mid-range phones and mobile data, so this is the common case, not the exception.
 */
export function constrained(): boolean {
  try {
    const n = navigator as NavigatorHints;
    if (n.connection?.saveData) return true;
    if (n.connection?.effectiveType && /(^|-)(2g|3g)$/.test(n.connection.effectiveType)) return true;
    if (typeof n.deviceMemory === "number" && n.deviceMemory <= 2) return true;
    if (typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 2) return true;
    return false;
  } catch {
    return false;
  }
}

/** The defaults for this device: the full set, or the lighter one on a constrained device. */
export const deviceDefaults = (): FxPrefs => ({ ...(constrained() ? FX_LITE : FX_DEFAULTS) });

const KEY = "kitui2027:fx";
export const FX_EVENT = "kitui:fx-prefs";

export function readPrefs(): FxPrefs {
  try {
    const base = deviceDefaults();
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<FxPrefs>;
    if (!PALETTES.includes(parsed.palette as Palette)) delete parsed.palette;
    return { ...base, ...parsed, intensity: Math.max(0, Math.min(100, Number(parsed.intensity ?? base.intensity))) };
  } catch {
    return deviceDefaults();
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
  const defaults = deviceDefaults();
  applyPrefs(defaults);
  window.dispatchEvent(new CustomEvent<FxPrefs>(FX_EVENT, { detail: defaults }));
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
