// Summarise a Lighthouse JSON report: the numbers docs/optimisation-audit.md records.
//   node scripts/optimisation/lighthouse-summary.mjs report.json
import fs from "node:fs";

const f = process.argv[2];
const r = JSON.parse(fs.readFileSync(f, "utf8"));
const a = r.audits;
const g = (k, u = 1) => (a[k] && a[k].numericValue != null ? Math.round((a[k].numericValue / u) * 100) / 100 : "n/a");
const items = a["resource-summary"]?.details?.items || [];
const by = (t) => {
  const i = items.find((x) => x.resourceType === t);
  return i ? Math.round(i.transferSize / 1024) : "n/a";
};
console.log(
  JSON.stringify({
    file: f,
    perf: Math.round(r.categories.performance.score * 100),
    a11y: r.categories.accessibility ? Math.round(r.categories.accessibility.score * 100) : "n/a",
    FCP_s: g("first-contentful-paint", 1000),
    LCP_s: g("largest-contentful-paint", 1000),
    TBT_ms: g("total-blocking-time"),
    CLS: g("cumulative-layout-shift"),
    SI_s: g("speed-index", 1000),
    script_kB: by("script"),
    image_kB: by("image"),
    font_kB: by("font"),
    doc_kB: by("document"),
    total_kB: by("total"),
    dom: a["dom-size"]?.numericValue,
  })
);
