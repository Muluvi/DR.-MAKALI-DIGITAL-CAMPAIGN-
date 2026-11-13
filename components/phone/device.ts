/**
 * Every dimension of the device, in one place.
 *
 * The screens are designed at true phone scale — 344 CSS px of screen width is what a real
 * handset gives you — so interface type inside them is set at the sizes the real apps use. The
 * whole device is then scaled as one transform. Nothing inside it reflows.
 */

/** Screen. 745 / 344 = 2.166, which is 19.5:9. */
export const SCREEN_W = 344;
export const SCREEN_H = 745;

/** Bezel. Even on three sides, slightly heavier at the chin, as the device family has it. */
export const BEZEL = 11;
export const CHIN = 14;

export const BODY_W = SCREEN_W + BEZEL * 2; // 366
export const BODY_H = SCREEN_H + BEZEL + CHIN; // 770

/**
 * Concentric radii. The screen's radius is the body's minus the bezel width — that identity is
 * what makes the two curves agree. Getting it wrong is the single most obvious tell of a fake
 * phone, so it is derived here rather than eyeballed.
 */
export const BODY_RADIUS = 52;
export const SCREEN_RADIUS = BODY_RADIUS - BEZEL; // 41

/** Side-rail depth. The rails sit on their own rotated planes, so this is real thickness. */
export const THICKNESS = 18;

/** Rotation limits. A phone that swings on mousemove looks like a toy. */
export const MAX_ROTATE_Y = 6;
export const MAX_ROTATE_X = 3;
export const PERSPECTIVE = 1400;

/** Rail buttons, as offsets from the top of the body. */
export const BUTTONS = {
  volumeUp: { top: 168, height: 54 },
  volumeDown: { top: 232, height: 54 },
  power: { top: 200, height: 82 },
} as const;

/** Dynamic-island style cutout. */
export const ISLAND = { width: 104, height: 30, top: 10 };
