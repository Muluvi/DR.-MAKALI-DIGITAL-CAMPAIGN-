#!/usr/bin/env node
// Build-time assertion for the 2022 IEBC ward register (Phase 2 of the provenance system).
// Runs as an npm `prebuild` step, independent of the Next.js/TypeScript toolchain, so the
// register's arithmetic is checked even for tooling that never imports data/ward-register.ts.
// The same invariant is re-checked at module-load time in that file, for defense in depth.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registerPath = path.join(__dirname, "..", "data", "ward-register.json");
const register = JSON.parse(readFileSync(registerPath, "utf-8"));

const errors = [];

for (const c of register.constituencies) {
  const wardSum = c.wards.reduce((sum, w) => sum + w.voters, 0);
  if (wardSum !== c.voters) {
    errors.push(`${c.name}: wards sum to ${wardSum}, but the constituency total is recorded as ${c.voters}.`);
  }
}

const constituencySum = register.constituencies.reduce((sum, c) => sum + c.voters, 0);
if (constituencySum !== register.countyTotalWards) {
  errors.push(`Constituency totals sum to ${constituencySum}, expected countyTotalWards ${register.countyTotalWards}.`);
}

if (register.countyTotalWards + register.prisonVoters !== register.countyTotalWithPrisons) {
  errors.push(
    `${register.countyTotalWards} + ${register.prisonVoters} prison voters !== countyTotalWithPrisons ${register.countyTotalWithPrisons}.`
  );
}

const wardCount = register.constituencies.reduce((sum, c) => sum + c.wards.length, 0);
if (wardCount !== 40) {
  errors.push(`Expected 40 wards across 8 constituencies, found ${wardCount}.`);
}

if (register.constituencies.length !== 8) {
  errors.push(`Expected 8 constituencies, found ${register.constituencies.length}.`);
}

if (errors.length > 0) {
  console.error("Ward register integrity check FAILED:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(
  `Ward register integrity check passed: 40 wards across 8 constituencies sum to ${register.countyTotalWards} (${register.countyTotalWithPrisons} including ${register.prisonVoters} prison voters).`
);
