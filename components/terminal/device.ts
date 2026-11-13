/**
 * Exact dimensions of the Rugged Field Terminal.
 *
 * Modeled as an industrial, high-durability field tablet deployed to Kitui County's
 * 40 Ward Coordinators. Designed at fixed native proportions (480 x 640 CSS px)
 * and scaled as a single transform for responsive screens, eliminating layout shift.
 */

export const SCREEN_W = 416;
export const SCREEN_H = 500;

export const BEZEL_X = 26;
export const BEZEL_TOP = 48; // Room for industrial antenna stub, hardware status LEDs & logo
export const BEZEL_BOTTOM = 38; // Room for heavy chin bumper and tactile hardware hotkeys

export const BODY_W = SCREEN_W + BEZEL_X * 2; // 468
export const BODY_H = SCREEN_H + BEZEL_TOP + BEZEL_BOTTOM; // 586

/** Concentric radii: Screen radius matches body minus inner bezel distance */
export const BODY_RADIUS = 28;
export const SCREEN_RADIUS = 10;
export const CORNER_BUMPER_RADIUS = 18;

/** Physical thickness for 3D preserve-3d rails */
export const THICKNESS = 22;

/** Perspective & tilt parameters */
export const PERSPECTIVE = 1500;
export const MAX_ROTATE_Y = 5;
export const MAX_ROTATE_X = 3;

/** Hardware LED indicators on the top bezel */
export const STATUS_LEDS = [
  { id: "pwr", label: "PWR", color: "#10b981", active: true },
  { id: "gsm", label: "2G/4G", color: "#3b82f6", active: true },
  { id: "gps", label: "GPS", color: "#f59e0b", active: true },
  { id: "sync", label: "SYNC", color: "#06b6d4", active: true },
] as const;
