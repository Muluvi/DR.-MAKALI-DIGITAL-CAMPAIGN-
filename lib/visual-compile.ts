import yaml from "js-yaml";

import { validateVisual } from "./visual.ts";

/**
 * Every ```visual fence's YAML body, replaced by the same spec as one line of JSON (lib/visual.ts).
 * Run on content whose {{tokens}} are already resolved. A fence that does not parse, or does not
 * fit its kind, throws with the file and line, which fails the content build.
 */
export function compileVisuals(resolved: string, file = "<string>"): string {
  const lines = resolved.split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!/^\s*```visual\s*$/.test(lines[i])) {
      out.push(lines[i]);
      continue;
    }
    const start = i + 1;
    let end = start;
    while (end < lines.length && !/^\s*```\s*$/.test(lines[end])) end += 1;
    if (end >= lines.length) throw new Error(`${file}:${i + 1}: unclosed visual fence`);
    let spec: unknown;
    try {
      spec = yaml.load(lines.slice(start, end).join("\n"));
    } catch (e) {
      throw new Error(`${file}:${i + 1}: visual fence is not valid YAML: ${(e as Error).message.split("\n")[0]}`);
    }
    const problems = validateVisual(spec);
    if (problems.length) throw new Error(`${file}:${i + 1}: visual fence: ${problems.join("; ")}`);
    out.push(lines[i], JSON.stringify(spec), lines[end]);
    i = end;
  }
  return out.join("\n");
}
