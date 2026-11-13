/**
 * Lets plain Node import the site's TypeScript data modules the way Next resolves them:
 * extensionless relative specifiers try ".ts" then "/index.ts", "@/x" maps to the repo root, and
 * JSON is imported with its attribute. Used only by the preservation check, never by the site.
 */
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export async function resolve(specifier, context, next) {
  let spec = specifier;
  if (spec.startsWith("@/")) spec = pathToFileURL(path.join(ROOT, spec.slice(2))).href;
  const isRel = spec.startsWith("./") || spec.startsWith("../") || spec.startsWith("file:");
  if (isRel && context.parentURL) {
    const base = new URL(spec, context.parentURL);
    const p = fileURLToPath(base);
    if (!path.extname(p) || !existsSync(p)) {
      for (const cand of [p + ".ts", p + ".tsx", path.join(p, "index.ts")]) {
        if (existsSync(cand)) return next(pathToFileURL(cand).href, context);
      }
    }
    if (p.endsWith(".json")) {
      const r = await next(base.href, context);
      return { ...r, importAttributes: { ...context.importAttributes, type: "json" } };
    }
    return next(base.href, context);
  }
  return next(spec, context);
}
