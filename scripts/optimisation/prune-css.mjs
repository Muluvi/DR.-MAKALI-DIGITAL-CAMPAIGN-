// Remove CSS rules whose selectors name classes nothing in the repo uses (visual-first pass).
//
//   node scripts/optimisation/prune-css.mjs app/visual-fx.css [--write]
//
// A selector is dead when it contains a class that appears in no component, lib, app, hook,
// content or data file and is not built at runtime (DYNAMIC). A rule loses its dead selectors and
// goes when none are left; @keyframes go when no declaration and no source file names them. Without
// --write it only reports.
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

const file = process.argv[2];
const write = process.argv.includes("--write");
// Class prefixes the components complete at runtime (`ichip--t${tier}`, `heat-${n}`), found by
// grepping for an identifier followed by a template expression. Any class starting with one is kept.
const DYNAMIC_PREFIXES = ["act-", "cell-", "chap-", "cols-", "f-", "fill-", "fx-in-", "fx-pattern-", "g-", "group-", "heat-", "ichip--t", "is-", "kx-", "l-", "label-", "makali-", "md-", "more-", "more-body-", "pf-bn--", "pf-fig--", "pf-pp--", "pf-tone-", "phone-tab-", "pillar-", "pillar-ink-", "sec-", "section-", "seq-", "tab-", "terminal-panel-", "terminal-tab-", "tier-badge-", "tier-card-", "tp-", "vz--", "vz-cards--", "vz-col--", "vz-seq--", "vz-tier--"];
// Classes a library writes into the DOM itself, which no source file here names: recharts' chart
// parts, remark-gfm's task lists and footnotes, highlighted code, lucide's icon class.
DYNAMIC_PREFIXES.push("recharts", "contains-task", "task-list", "footnote", "data-footnote", "language-", "lucide", "sr-only", "katex");
const DYNAMIC = DYNAMIC_PREFIXES.map((p) => new RegExp(`^${p.replace(/[-]/g, "\\-")}`));
const roots = ["components", "lib", "app", "hooks", "content", "data", "public"];
let source = "";
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|mjs|md|json|svg|html)$/.test(e.name)) source += fs.readFileSync(p, "utf8");
  }
};
roots.forEach((r) => fs.existsSync(r) && walk(r));
// Other stylesheets may compose with these classes too.
for (const f of fs.readdirSync("app")) if (f.endsWith(".css") && path.join("app", f) !== path.normalize(file)) source += fs.readFileSync(path.join("app", f), "utf8");

const used = (cls) => DYNAMIC.some((r) => r.test(cls)) || new RegExp(`(?<![\\w-])${cls.replace(/[-]/g, "\\-")}(?![\\w-])`).test(source);
const css = fs.readFileSync(file, "utf8");
const root = postcss.parse(css);
let removedRules = 0, removedSelectors = 0;
root.walkRules((rule) => {
  if (rule.parent?.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  const keep = rule.selectors.filter((sel) => {
    const classes = [...sel.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
    return classes.every(used);
  });
  if (keep.length === rule.selectors.length) return;
  removedSelectors += rule.selectors.length - keep.length;
  if (keep.length) rule.selectors = keep;
  else { rule.remove(); removedRules++; }
});
root.walkAtRules((at) => { if (!at.nodes || at.name.includes("keyframes")) return; if (at.nodes.length === 0) at.remove(); });
// Keyframes no longer named anywhere.
const remaining = root.toString();
let removedKeyframes = 0;
root.walkAtRules(/keyframes$/, (at) => {
  const name = at.params.trim();
  const re = new RegExp(`(?<![\\w-])${name.replace(/[-]/g, "\\-")}(?![\\w-])`, "g");
  const inCss = (remaining.match(re) || []).length; // the @keyframes line itself counts once
  if (inCss <= 1 && !re.test(source)) { at.remove(); removedKeyframes++; }
});
root.walkAtRules((at) => { if (at.nodes && at.nodes.length === 0) at.remove(); });
const out = root.toString();
console.log(`${file}: ${css.length} -> ${out.length} bytes; ${removedRules} rules and ${removedSelectors} selectors removed, ${removedKeyframes} keyframes`);
if (write) fs.writeFileSync(file, out);
