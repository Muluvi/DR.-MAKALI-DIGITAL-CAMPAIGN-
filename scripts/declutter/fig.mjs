// Print figures from lib/data/figures.ts: id, value, tier, source. Usage: node --experimental-strip-types scripts/declutter/fig.mjs id...
const { FIGURES } = await import("../../lib/data/figures.ts");
for (const id of process.argv.slice(2)) {
  const f = FIGURES[id];
  console.log(id, f ? JSON.stringify({ v: f.value, tier: f.tier, state: f.state, src: f.source?.name ?? f.source, asOf: f.asOf }) : "MISSING");
}
