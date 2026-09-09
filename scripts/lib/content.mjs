/**
 * The document, loaded once.
 *
 * Six build guards used to each walk public/content themselves, and three of them re-derived the
 * heading index with their own copy of the same two regexes and the same title-cleaning rules.
 * Two more parsed components/MarkdownViewer.tsx as text to find the mount table. When those
 * copies drift, the guards stop agreeing about what the document contains — which is the one
 * thing they all have to agree about before any of their answers mean anything.
 *
 * So the parsing lives here, once, and every check reads it from here. Each loader memoises, so
 * running all six in one process reads each file exactly once.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const CONTENT_DIR = path.join(ROOT, "public", "content");
export const DATA_DIR = path.join(ROOT, "data");

/** One file per top-level section, in document order. Mirrors FILES in app/[[...slug]]/page.tsx. */
export const TABS = {
  "1-decision.md": "decision",
  "2-evidence.md": "evidence",
  "3-strategy.md": "strategy",
  "4a-publishing.md": "publishing",
  "4b-ground.md": "ground",
  "4c-defence.md": "defence",
  "4d-technology.md": "technology",
  "4e-team.md": "team",
  "5-delivery.md": "delivery",
};

export const HEADING = /^(#{2,3})\s+(.+?)\s*$/;
export const LEADING = /^(\d+(?:\.\d+)*)\.?\s/;

/** Strip the markup a heading carries so its number and title can be read. */
export function cleanTitle(raw) {
  return raw
    .replace(/\*\((new|updated)\)\*/gi, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\s*\$?\\?ge\s*[\d,]+\$?/g, "")
    .trim();
}

const memo = new Map();
const once = (key, fn) => {
  if (!memo.has(key)) memo.set(key, fn());
  return memo.get(key);
};

/** Raw text of every section file, keyed by filename, in document order. */
export const contentFiles = () =>
  once("files", () => {
    const out = {};
    for (const file of Object.keys(TABS)) {
      const full = path.join(CONTENT_DIR, file);
      if (!fs.existsSync(full)) throw new Error(`content file missing: public/content/${file}`);
      out[file] = fs.readFileSync(full, "utf8");
    }
    return out;
  });

/**
 * Every heading in document order.
 *
 * Fenced code blocks are skipped — a `### ` inside a diagram is not a section. `id` is null for
 * a heading that carries no leading section number, which is the same rule lib/section-index.ts
 * applies when it decides what is addressable.
 */
export const headings = () =>
  once("headings", () => {
    const out = [];
    for (const [file, tab] of Object.entries(TABS)) {
      let inFence = false;
      for (const line of contentFiles()[file].split("\n")) {
        if (/^\s*```/.test(line)) {
          inFence = !inFence;
          continue;
        }
        if (inFence) continue;
        const m = HEADING.exec(line);
        if (!m) continue;
        const title = cleanTitle(m[2]);
        const num = LEADING.exec(title.trim());
        out.push({
          file,
          tab,
          level: m[1].length,
          title,
          id: num ? `${tab}-sec-${num[1].replace(/\./g, "-")}` : null,
        });
      }
    }
    return out;
  });

/** Every id the document actually offers today. */
export const liveIds = () => once("liveIds", () => new Set(headings().filter((h) => h.id).map((h) => h.id)));

/** Read a source file relative to the repo root. */
export const source = (...rel) => once(`src:${rel.join("/")}`, () => fs.readFileSync(path.join(ROOT, ...rel), "utf8"));

/**
 * The keys of HEADING_INSERTS, read straight out of the renderer.
 *
 * Read as text rather than imported because the renderer is TSX: the guard has to see what
 * ships, and a parser that agreed with the bundler would be a second thing to keep in step.
 */
export const mountKeys = () =>
  once("mountKeys", () => {
    const src = source("components", "MarkdownViewer.tsx");
    const start = src.indexOf("const HEADING_INSERTS");
    const end = src.indexOf("\n};", start);
    if (start === -1 || end === -1) {
      throw new Error("could not find HEADING_INSERTS in components/MarkdownViewer.tsx");
    }
    return [...src.slice(start, end).matchAll(/^\s*"([a-z]+-sec-[\d-]+)":/gm)].map((m) => m[1]);
  });

/** An object literal in lib/heading-slug.ts, as a plain map. */
export const slugMap = (name) =>
  once(`slugMap:${name}`, () => {
    const src = source("lib", "heading-slug.ts");
    const start = src.indexOf(`const ${name}`);
    const end = src.indexOf("\n};", start);
    return Object.fromEntries(
      [...src.slice(start, end).matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]])
    );
  });
