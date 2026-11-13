/**
 * The document's routes, read from the document.
 *
 * Five build guards each kept their own copy of this list, which was fine while the route set
 * was stable and became five separate build failures the moment it was not. The list is now
 * derived from public/content itself: one .md file is one route, named after it, so a list can
 * no longer disagree with the directory it describes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CONTENT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "content");

/** `{ "analysis.md": "analysis", ... }` — filename to tab id, in directory order. */
export function contentTabs() {
  return Object.fromEntries(
    fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort().map((f) => [f, f.replace(/\.md$/, "")])
  );
}
