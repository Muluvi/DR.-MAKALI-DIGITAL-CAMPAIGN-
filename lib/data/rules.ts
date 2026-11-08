/**
 * The data pack's rules, in one place, shared by `npm run verify` and the in-site data editor.
 *
 * scripts/check-figures.ts and scripts/verify-ward-register.mjs call these functions at build; the
 * editor's server actions (lib/platform/pack.ts) call the same functions before an edit is
 * accepted. So a rule cannot be enforced in one place and forgotten in the other, and the team
 * cannot save a figure or a register total that the build would reject.
 *
 * Each message is written twice over: `rule` is the build log's terse form, `plain` is what a
 * campaign team member reads on a phone when their edit is refused.
 */
import type { Figure } from "./schema";

export interface Problem {
  rule: string;
  plain: string;
}

const STATES = ["sourced", "modelled", "needed", "target"] as const;
const TIERS = ["T1", "T2", "T3"] as const;
const UNITS = ["voters", "votes", "people", "households", "count", "percent", "ksh", "km2", "per-km2", "persons"] as const;

/** Every rule a single figure must satisfy (the per-figure half of check-figures.ts). */
export function figureProblems(id: string, f: Figure): Problem[] {
  const out: Problem[] = [];
  const p = (rule: string, plain: string) => out.push({ rule: `${id}: ${rule}`, plain });
  if (f.id !== id) p(`id field "${f.id}" does not match its key`, "The figure's id cannot be changed.");
  if (!STATES.includes(f.state)) p(`unknown state "${f.state}"`, "Choose whether the figure is sourced, modelled, needed or a target.");
  if (!UNITS.includes(f.unit)) p(`unknown unit "${f.unit}"`, "Choose a unit from the list.");
  if (f.tier !== null && f.tier !== undefined && !TIERS.includes(f.tier)) p(`unknown tier "${f.tier}"`, "Reliability must be Official, Reported or Unconfirmed.");
  if (f.value !== null && !Number.isFinite(f.value)) p("value is not a number", "The value must be a number, without commas or units.");
  if (f.state === "needed" && f.value !== null) p("needed but has a value", "A figure marked 'needed' has no value yet. Clear the value, or change it to sourced.");
  if (f.state !== "needed" && f.value === null) p("no value but not marked needed", "Enter a value, or mark the figure as needed.");
  if (f.state === "needed" && !f.closesWith) p("needed, but names no document that would close it", "Name the document that would supply this figure.");
  if (f.state === "sourced" && !f.source) p("sourced with no source", "A sourced figure needs the name of the document it was read from.");
  if ((f.state === "sourced" || f.state === "modelled") && !f.tier) p(`${f.state} with no tier`, "Choose how reliable the source is: Official, Reported or Unconfirmed.");
  if (f.state === "modelled" && !f.note) p("modelled with no note", "Say how this figure was calculated.");
  if (f.state === "target" && !f.note) p("target with no note", "Say what this target commits to, and whose target it is.");
  if (f.alt && f.alt.value === f.value) p("alt equals primary — a dispute collapsed", "The disputed second value cannot equal the main value.");
  return out;
}

export interface WardRegister {
  prisonVoters: number;
  countyTotalWards: number;
  countyTotalWithPrisons: number;
  constituencies: { name: string; voters: number; wards: { name: string; voters: number }[] }[];
}

/** The register's arithmetic (verify-ward-register.mjs). */
export function wardRegisterProblems(register: WardRegister): Problem[] {
  const out: Problem[] = [];
  for (const c of register.constituencies) {
    for (const w of c.wards) {
      if (!Number.isInteger(w.voters) || w.voters < 0) out.push({ rule: `${c.name}/${w.name}: voters is not a whole number`, plain: `${w.name}: registered voters must be a whole number.` });
    }
    const wardSum = c.wards.reduce((sum, w) => sum + w.voters, 0);
    if (wardSum !== c.voters) {
      out.push({
        rule: `${c.name}: wards sum to ${wardSum}, but the constituency total is recorded as ${c.voters}.`,
        plain: `The wards of ${c.name} add up to ${wardSum.toLocaleString("en-KE")}, but the constituency total says ${c.voters.toLocaleString("en-KE")}. Update both so they agree.`,
      });
    }
  }
  const constituencySum = register.constituencies.reduce((sum, c) => sum + c.voters, 0);
  if (constituencySum !== register.countyTotalWards) {
    out.push({
      rule: `Constituency totals sum to ${constituencySum}, expected countyTotalWards ${register.countyTotalWards}.`,
      plain: `The constituencies add up to ${constituencySum.toLocaleString("en-KE")}, but the county total says ${register.countyTotalWards.toLocaleString("en-KE")}.`,
    });
  }
  if (register.countyTotalWards + register.prisonVoters !== register.countyTotalWithPrisons) {
    out.push({
      rule: `${register.countyTotalWards} + ${register.prisonVoters} prison voters !== countyTotalWithPrisons ${register.countyTotalWithPrisons}.`,
      plain: "The county total plus prison voters must equal the total including prisons.",
    });
  }
  const wardCount = register.constituencies.reduce((sum, c) => sum + c.wards.length, 0);
  if (wardCount !== 40) out.push({ rule: `Expected 40 wards across 8 constituencies, found ${wardCount}.`, plain: "Kitui has 40 wards; none can be added or removed here." });
  if (register.constituencies.length !== 8) out.push({ rule: `Expected 8 constituencies, found ${register.constituencies.length}.`, plain: "Kitui has 8 constituencies; none can be added or removed here." });
  return out;
}
