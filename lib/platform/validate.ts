/**
 * Validates a working record against its collection, in the browser (instant feedback) and again
 * on the server (the check that counts). Returns the cleaned record, or plain-language problems
 * keyed by field ("_" for a rule across fields).
 */
import type { Collection, Field } from "./collections";

export type Options = Record<string, string[]>;
export type Result = { ok: true; data: Record<string, unknown> } | { ok: false; errors: Record<string, string> };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function clean(f: Field, raw: unknown, options: Options, errors: Record<string, string>): unknown {
  const empty = raw === undefined || raw === null || raw === "" || (Array.isArray(raw) && raw.length === 0);
  if (empty) {
    if (f.required && f.type !== "boolean") errors[f.key] = `${f.label} is required.`;
    return f.type === "boolean" ? false : f.type === "multiselect" ? [] : null;
  }
  const choices = f.options ? [...f.options] : f.source ? options[f.source] ?? [] : null;
  switch (f.type) {
    case "number": {
      const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[,\s]/g, ""));
      if (!Number.isFinite(n)) { errors[f.key] = `${f.label} must be a number.`; return null; }
      if (f.min !== undefined && n < f.min) errors[f.key] = `${f.label} cannot be less than ${f.min}.`;
      if (f.max !== undefined && n > f.max) errors[f.key] = `${f.label} cannot be more than ${f.max}.`;
      return n;
    }
    case "date": {
      const s = String(raw);
      if (!DATE.test(s) || Number.isNaN(Date.parse(s))) errors[f.key] = `${f.label} must be a date.`;
      return s;
    }
    case "boolean":
      return raw === true || raw === "true" || raw === "on";
    case "multiselect": {
      const list = (Array.isArray(raw) ? raw : [raw]).map(String);
      const bad = choices ? list.filter((x) => !choices.includes(x)) : [];
      if (bad.length) errors[f.key] = `${f.label}: "${bad[0]}" is not one of the choices.`;
      return list;
    }
    case "select": {
      const s = String(raw);
      if (choices && !choices.includes(s)) errors[f.key] = `${f.label}: choose one of the listed options.`;
      return s;
    }
    case "url": {
      const s = String(raw).trim();
      if (!/^https?:\/\/\S+$/.test(s)) errors[f.key] = `${f.label} must be a web link starting with http:// or https://.`;
      return s;
    }
    default: {
      const s = String(raw).trim();
      if (f.maxLength && s.length > f.maxLength) errors[f.key] = `${f.label} is ${s.length} characters; the limit is ${f.maxLength}.`;
      return s;
    }
  }
}

export function validateRecord(c: Collection, input: Record<string, unknown>, options: Options): Result {
  const errors: Record<string, string> = {};
  const data: Record<string, unknown> = {};
  for (const f of c.fields) data[f.key] = clean(f, input[f.key], options, errors);
  if (!Object.keys(errors).length) {
    for (const rule of c.rules ?? []) {
      const m = rule(data);
      if (m) { errors._ = m; break; }
    }
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
