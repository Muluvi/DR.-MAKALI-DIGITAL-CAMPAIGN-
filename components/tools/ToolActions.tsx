"use client";

const cell = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Download what the tool shows as a CSV, made in the browser. Nothing is sent anywhere. */
export function ToolActions({ filename, rows }: { filename: string; rows: () => (string | number)[][] }) {
  const download = () => {
    const blob = new Blob([rows().map((r) => r.map(cell).join(",")).join("\n") + "\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" className="btn btn-sm no-print" onClick={download}>Download CSV</button>
  );
}
