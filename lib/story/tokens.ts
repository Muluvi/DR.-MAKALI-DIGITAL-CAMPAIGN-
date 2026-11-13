import { FIGURES } from "../data/figures.ts";
import { formatFigure, type FormatMod } from "../data/format.ts";
import { compileVisuals } from "../visual-compile.ts";

/**
 * `{{figure-id}}` and `{{figure-id|mod}}` tokens in the chapter markdown, replaced by the figure's
 * printed value from the one figure registry (lib/data/figures.ts). An unknown id fails the build.
 */
const TOKEN = /\{\{\s*([a-z0-9][a-z0-9.\-]*)(?:\|([a-z0-9]+))?\s*\}\}/g;
const MODS = new Set(["", "bn", "m", "m1", "k", "abs", "d0", "d1", "d2"]);

function resolveTokens(source: string, file = "<string>"): string {
  return source.replace(TOKEN, (_, id: string, mod = "") => {
    const f = FIGURES[id];
    if (!f) throw new Error(`${file}: unknown figure "${id}"`);
    if (!MODS.has(mod)) throw new Error(`${file}: unknown modifier "${mod}" on "${id}"`);
    return formatFigure(f, mod as FormatMod);
  });
}

/** Chapter markdown with every token resolved and every ```visual fence compiled to one line of JSON. */
export function compileChapter(source: string, file: string): string {
  return compileVisuals(resolveTokens(source, file), file);
}
