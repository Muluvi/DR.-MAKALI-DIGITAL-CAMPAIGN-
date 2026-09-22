/**
 * Every ```figure fence in public/content/ resolves to a figure that exists.
 *
 * WHY THIS GUARD EXISTS, IN ONE SENTENCE: it was written immediately after a malformed fence
 * shipped. The fence body must read `id: some-figure-id`; a bare id on its own line renders a
 * visible "Malformed figure fence" banner where the retired ASCII block used to be. That banner
 * is deliberate and it worked — but it worked in the browser, after the commit, and neither of
 * the guards that should have caught it could:
 *
 *   - verify-figure-retention passes, because the figures the block carried still live in the
 *     test file and the data modules. Retention asks whether a number survives SOMEWHERE, not
 *     whether the figure that is supposed to show it renders.
 *   - verify-content-integrity passes, because the retirement was properly declared. The
 *     declaration authorises removing the block; it cannot know the replacement is broken.
 *
 * So a block could be retired, its retirement correctly declared, and the figure that justified
 * the retirement silently replaced by an error banner. That is the exact failure mode rule 1a
 * exists to prevent, arriving through a typo. This guard closes it: the fence must parse, and the
 * id must be one the registry answers to.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "public", "content");
const REGISTRY = path.join(ROOT, "components", "figures", "registry.tsx");

/** The same shape MarkdownViewer accepts. Kept literal so the two cannot drift silently. */
const ID_LINE = /^\s*id:\s*([a-z0-9-]+)\s*$/im;

const markdownFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? markdownFiles(full) : e.name.endsWith(".md") ? [full] : [];
  });

/**
 * The registry's keys, read from its source.
 *
 * Importing registry.tsx would mean a bundler and a React runtime for a string list, so this
 * reads the keys of the FIGURES object instead. If the object's shape ever changes, the count
 * check below fails loudly rather than reporting an empty registry and passing everything.
 */
function registeredIds() {
  const src = fs.readFileSync(REGISTRY, "utf8");
  const body = src.slice(src.indexOf("export const FIGURES"));
  return new Set([...body.matchAll(/^\s{2}"([a-z0-9-]+)":\s*\{$/gm)].map((m) => m[1]));
}

const ids = registeredIds();
if (ids.size === 0) {
  console.error("verify-figure-fences: no figure ids found in registry.tsx — has FIGURES changed shape?");
  process.exit(1);
}

const problems = [];
let fences = 0;

for (const file of markdownFiles(CONTENT)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const rel = path.relative(ROOT, file);

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "```figure") continue;
    fences++;

    const close = lines.indexOf("```", i + 1);
    const body = close === -1 ? "" : lines.slice(i + 1, close).join("\n");
    const id = body.match(ID_LINE)?.[1];

    if (!id) {
      problems.push({
        rel,
        line: i + 1,
        why: `body does not parse. Expected a line reading "id: some-figure-id", found ${JSON.stringify(body.trim())}`,
      });
    } else if (!ids.has(id)) {
      problems.push({ rel, line: i + 1, why: `"${id}" is not in the figure registry` });
    }

    i = close === -1 ? i : close;
  }
}

if (problems.length > 0) {
  console.error(`\nFIGURE FENCES FAILED — ${problems.length} fence(s) would render an error banner:\n`);
  for (const p of problems) console.error(`  ${p.rel}:${p.line} — ${p.why}`);
  console.error(
    "\nA retired ASCII block is only retired if the figure that replaced it renders. Fix the\n" +
      "fence body, or register the id in components/figures/registry.tsx.\n"
  );
  process.exit(1);
}

console.log(
  `Figure fences passed: all ${fences} \`\`\`figure fence(s) in public/content/ resolve to one of ` +
    `${ids.size} registered figures.`
);
