"use client";

import { AnimatedNumber } from "./AnimatedNumber";

/**
 * A printed figure (a shilling amount, a percentage, a vote count) that glides between values as a tool's
 * inputs change (visual upgrade, D2): AnimatedNumber with the prefix, suffix, decimals and grouping
 * read off the string itself. Anything that is not one plain number (a range, a word, a negative)
 * is shown exactly as written.
 */
const ONE = /^([^\d−-]*?)(\d[\d,]*(?:\.\d+)?)([^\d]*)$/;

export function AnimatedText({ text, className }: { text: string; className?: string }) {
  const m = ONE.exec(text);
  if (!m) return <span className={className}>{text}</span>;
  const [, prefix, num, suffix] = m;
  const value = Number(num.replace(/,/g, ""));
  if (!Number.isFinite(value)) return <span className={className}>{text}</span>;
  const decimals = (num.split(".")[1] ?? "").length;
  return <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} separator={num.includes(",") || value >= 10000} className={className} />;
}
