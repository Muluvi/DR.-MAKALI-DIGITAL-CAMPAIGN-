"use client";

import { useState } from "react";

import type { CardRef } from "../../../lib/card/spec";
import { SaveImage } from "../../visual/SaveImage";

const cell = (v: string | number) => { const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

/**
 * Copy-link, CSV download and, where the tool has a share card, Save as image (visual upgrade, E4).
 * The CSV never leaves the browser; the image is made on the site's server from the view's settings.
 */
export function ToolActions({ filename, rows, link = true, card, cardTitle }: { filename: string; rows: () => (string | number)[][]; link?: boolean; card?: CardRef; cardTitle?: string }) {
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
      {card ? <SaveImage card={card} title={cardTitle} /> : null}
      <button type="button" className="plat-btn plat-btn-sm" onClick={() => window.print()}>Print</button>
    </div>
  );
}
