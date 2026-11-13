"use client";

import { useState } from "react";

const cell = (v: string | number) => { const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

/** Copy-link and CSV download. Nothing leaves the browser. */
export function ToolActions({ filename, rows, link = true }: { filename: string; rows: () => (string | number)[][]; link?: boolean }) {
  const [copied, setCopied] = useState(false);
  const download = () => {
    const blob = new Blob([rows().map((r) => r.map(cell).join(",")).join("\n") + "\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  const copy = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      {link && <button type="button" className="plat-btn plat-btn-sm" onClick={copy}>{copied ? "Copied" : "Copy link"}</button>}
      <button type="button" className="plat-btn plat-btn-sm" onClick={download}>Download CSV</button>
      <button type="button" className="plat-btn plat-btn-sm" onClick={() => window.print()}>Print</button>
    </div>
  );
}
