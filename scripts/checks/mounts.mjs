#!/usr/bin/env node
/**
 * Build guard: every component mount point names a heading that exists.
 *
 * MarkdownViewer mounts bespoke visualisations by heading id. When a heading is renumbered, a
 * component silently stops rendering — no error, no failed build, no missing import. That has
 * happened before, which is why this runs on every build.
 */
import { liveIds, mountKeys } from "../lib/content.mjs";
import { fail, pass, runIfMain } from "../lib/report.mjs";

export const name = "mounts";

export function run() {
  const ids = liveIds();
  const keys = mountKeys();
  const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);

  const errors = [];
  for (const k of keys.filter((k) => !ids.has(k))) {
    errors.push(`HEADING_INSERTS key "${k}" names no heading in public/content.`);
  }
  for (const k of new Set(duplicates)) {
    errors.push(`HEADING_INSERTS key "${k}" is declared more than once.`);
  }

  if (errors.length) {
    return fail("component mount points do not match the document.", errors, `${keys.length} keys checked against ${ids.size} headings.`);
  }
  return pass(`${keys.length} mount points all resolve (${ids.size} headings indexed).`);
}

await runIfMain(import.meta.url, { name, run });
