#!/usr/bin/env node
// Build-time assertion for the 2022 IEBC ward register (Phase 2 of the provenance system).
// Runs as an npm `prebuild` step, independent of the Next.js/TypeScript toolchain, so the
// register's arithmetic is checked even for tooling that never imports data/ward-register.ts.
// The same invariant is re-checked at module-load time in that file, for defense in depth.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { wardRegisterProblems } from "../lib/data/rules.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registerPath = path.join(__dirname, "..", "data", "ward-register.json");
const register = JSON.parse(readFileSync(registerPath, "utf-8"));

// The arithmetic lives in lib/data/rules.ts, shared with the in-site data editor (which refuses an
// edit that would fail here). Run with Node's type stripping (Node 22).
const errors = wardRegisterProblems(register).map((p) => p.rule);

if (errors.length > 0) {
  console.error("Ward register integrity check FAILED:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(
  `Ward register integrity check passed: 40 wards across 8 constituencies sum to ${register.countyTotalWards} (${register.countyTotalWithPrisons} including ${register.prisonVoters} prison voters).`
);
