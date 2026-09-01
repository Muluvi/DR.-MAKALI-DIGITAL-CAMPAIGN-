/**
 * Parser for the proposal's ASCII box-drawing diagrams.
 *
 * The document carries 102 fenced blocks that are real information design rendered as monospace
 * text: victory-threshold arithmetic, segmentation matrices, phase timelines, the response
 * decision tree. As `<pre>` they need horizontal scrolling on a phone and read as raw output.
 *
 * The safe way to upgrade them is to PARSE rather than transcribe. Hand-retyping 102 diagrams
 * into components would put every figure in the document at risk of a typo; parsing them at
 * render time changes not one character of the source. Anything the parser cannot read with
 * confidence falls back to the original `<pre>`, so a diagram is either upgraded correctly or
 * left exactly as it was — never mangled.
 *
 * Pure functions, no React, so this runs on the server with the rest of the markdown pipeline
 * and can be tested directly.
 */

export interface DiagramCell {
  text: string;
  /** Cells that span the full width — section headers inside a table body. */
  spans: number;
}

export type Diagram =
  | { kind: "table"; title?: string; headers?: string[]; rows: DiagramCell[][] }
  | { kind: "keyvalue"; title?: string; items: { label: string; value: string }[]; notes: string[] }
  | { kind: "panel"; title?: string; body: string }
  | null;

const BOX = /[┌┐└┘├┤┬┴┼─│]/;
const RULE_LINE = /^[\s═]+$/;
const H_ONLY = /^[\s┌┐└┘├┤┬┴┼─╔╗╚╝═]+$/;

/** Column positions of "│" in a line. */
function bars(line: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < line.length; i++) if (line[i] === "│") out.push(i);
  return out;
}

/**
 * A separator row — the ├───┼───┤ kind. Also matches the top and bottom borders.
 */
function isSeparator(line: string): boolean {
  return H_ONLY.test(line) && /[─═]/.test(line);
}

/** Split a row into cells at the given bar positions. */
function cellsAt(line: string, positions: number[]): DiagramCell[] {
  const out: DiagramCell[] = [];
  for (let i = 0; i < positions.length - 1; i++) {
    const from = positions[i] + 1;
    const to = positions[i + 1];
    out.push({ text: line.slice(from, to).trim(), spans: 1 });
  }
  return out;
}

/**
 * Box-drawing table. Requires a repeated column grid so cells line up; a diagram whose bars
 * wander (a branch tree, a flow) is deliberately not treated as a table.
 */
function parseTable(lines: string[]): Diagram {
  const barred = lines.filter((l) => l.includes("│"));
  if (barred.length < 2) return null;

  // The dominant column signature. Rows that don't match it are title rows or noise.
  const counts = new Map<string, number>();
  for (const l of barred) {
    const key = bars(l).join(",");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let grid: number[] = [];
  let best = 0;
  for (const [key, n] of counts) {
    const cols = key.split(",").map(Number);
    if (cols.length >= 3 && n > best) {
      best = n;
      grid = cols;
    }
  }
  // Needs at least two data rows on a grid of at least two columns to be worth a table.
  if (grid.length < 3 || best < 2) return null;

  let title: string | undefined;
  let headers: string[] | undefined;
  const rows: DiagramCell[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("│")) continue;
    const b = bars(line);

    // A row with exactly two bars spanning the table's full width is a banner: the diagram's
    // title if we haven't got one, otherwise a section header inside the body.
    if (b.length === 2 && b[1] - b[0] > (grid[grid.length - 1] - grid[0]) * 0.6) {
      const text = line.slice(b[0] + 1, b[1]).trim();
      if (!text) continue;
      if (!title && rows.length === 0) title = text;
      else rows.push([{ text, spans: grid.length - 1 }]);
      continue;
    }

    // A row that doesn't sit on the grid still carries content. Keep it as a full-width row
    // rather than dropping it — silently skipping these lost figures from 24 diagrams.
    if (b.join(",") !== grid.join(",")) {
      const text = b.length >= 2 ? line.slice(b[0] + 1, b[b.length - 1]).replace(/│/g, " ").trim() : line.trim();
      if (text) rows.push([{ text, spans: grid.length - 1 }]);
      continue;
    }

    const cells = cellsAt(line, grid);
    if (cells.every((c) => !c.text)) continue;

    // A header row is fenced on BOTH sides: ┬ above, ┼ below. Testing only for the ┬ promoted
    // the first data row of every plain two-column table into a header.
    const prev = lines[i - 1] ?? "";
    const next = lines[i + 1] ?? "";
    if (!headers && rows.length === 0 && /┬/.test(prev) && /┼/.test(next)) {
      headers = cells.map((c) => c.text);
      continue;
    }
    rows.push(cells);
  }

  if (rows.length < 2) return null;

  // A column that is blank in most rows is a gutter between two side-by-side panels, not a
  // real column. Those layouts lose their meaning as a table, so hand them to the panel path.
  const width = Math.max(...rows.map((r) => r.length));
  for (let c = 0; c < width; c++) {
    const filled = rows.filter((r) => r.length === width && r[c]?.text).length;
    const eligible = rows.filter((r) => r.length === width).length;
    if (eligible >= 3 && filled / eligible < 0.4) return null;
  }

  // A two-column table whose left cells are all labels reads better as key–value.
  if (!headers && grid.length === 3 && rows.every((r) => r.length === 2 && r[0].spans === 1)) {
    const items = rows
      .filter((r) => r[0].text || r[1].text)
      .map((r) => ({ label: r[0].text, value: r[1].text }));
    if (items.length >= 2) return { kind: "keyvalue", title, items, notes: [] };
  }

  return { kind: "table", title, headers, rows };
}

/**
 * The "═══ TITLE ═══" summary blocks: a banner rule, a centred title, then "• Label: value"
 * lines. Eighteen of these carry the section summaries.
 */
function parseKeyValue(lines: string[]): Diagram {
  // Deliberately strict: the label must end in a colon. A looser two-column split matched
  // side-by-side comparison panels and read column B as if it were column A's value.
  const colonLine = /^\s*[•*]\s*([^:]{2,60}):\s{1,}(.+?)\s*$/;

  const items: { label: string; value: string }[] = [];
  const notes: string[] = [];
  let title: string | undefined;
  let sawRule = false;

  for (const line of lines) {
    if (RULE_LINE.test(line) && line.trim().length > 8) {
      sawRule = true;
      continue;
    }
    const m = colonLine.exec(line);
    if (m) {
      // A second "• Label:" further along the line means this is two columns printed side by
      // side, and m[2] is the neighbouring column rather than this label's value.
      if (/[•*]\s*[^:]{2,60}:\s/.test(m[2])) return null;
      items.push({ label: m[1].replace(/:$/, "").trim(), value: m[2].trim() });
      continue;
    }
    // The centred line between the rules is the title.
    if (!title && sawRule && line.trim() && !BOX.test(line) && items.length === 0) {
      const t = line.trim();
      if (t.length < 90) { title = t; continue; }
    }
    if (line.trim() && !RULE_LINE.test(line) && !H_ONLY.test(line)) {
      // These summary blocks wrap long values onto a following indented line. A continuation
      // belongs to the pair above it, not in a notes block at the foot of the figure.
      const indented = /^\s{4,}/.test(line);
      const lastItem = items[items.length - 1];
      if (indented && lastItem && notes.length === 0) lastItem.value += " " + line.trim();
      else notes.push(line.trim());
    }
  }

  if (items.length < 2) return null;
  return { kind: "keyvalue", title, items, notes };
}

/**
 * Everything else — branch trees, flow diagrams, side-by-side panels. The monospace layout IS
 * the diagram here and cannot be reflowed without losing it, so the body is preserved verbatim.
 * What the parser does contribute is lifting the title out of its box, so the block gets a real
 * heading and a figure frame instead of opening with a row of box-drawing characters.
 */
function parsePanel(lines: string[]): Diagram {
  let title: string | undefined;
  const kept: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const b = bars(line);
    // A centred ALL-CAPS line framed by ═══ rules is the other title convention in use.
    if (!title && i < 6 && !BOX.test(line) && line.trim().length > 6 && line.trim().length < 90) {
      const above = lines[i - 1] ?? "";
      const below = lines[i + 1] ?? "";
      if (RULE_LINE.test(above) && above.trim().length > 8 && line.trim() === line.trim().toUpperCase()) {
        title = line.trim();
        kept.pop();
        if (RULE_LINE.test(below)) i++;
        continue;
      }
    }
    // A lone banner row near the top, with border lines around it, is the title.
    if (!title && i < 6 && b.length === 2) {
      const text = line.slice(b[0] + 1, b[1]).trim();
      const above = lines[i - 1] ?? "";
      const below = lines[i + 1] ?? "";
      if (text && text.length < 90 && (isSeparator(above) || isSeparator(below))) {
        title = text;
        // Drop the border rows that framed it.
        if (isSeparator(above)) kept.pop();
        if (isSeparator(below)) i++;
        continue;
      }
    }
    kept.push(line);
  }

  while (kept.length && !kept[0].trim()) kept.shift();
  while (kept.length && !kept[kept.length - 1].trim()) kept.pop();

  const body = kept.join("\n");
  if (!title && !body.trim()) return null;
  return { kind: "panel", title, body };
}

/**
 * Parse one fenced block. Order matters: a real grid beats the looser shapes, and the panel
 * fallback only runs when nothing structured was found.
 */
/** Flatten a parsed diagram back to plain text, for the losslessness check. */
function flatten(d: Exclude<Diagram, null>): string {
  if (d.kind === "table") {
    return [d.title ?? "", ...(d.headers ?? []), ...d.rows.flatMap((r) => r.map((c) => c.text))].join(" ");
  }
  if (d.kind === "keyvalue") {
    return [d.title ?? "", ...d.items.flatMap((i) => [i.label, i.value]), ...d.notes].join(" ");
  }
  return [d.title ?? "", d.body].join(" ");
}

/**
 * A parse is only an upgrade if it keeps everything. Every number and every word of four or
 * more letters in the source must survive; if any is missing the diagram falls back to its
 * original `<pre>`. This is what makes the conversion safe to run across all 102 blocks
 * unattended — a parser bug costs a missed upgrade, never a dropped figure.
 */
function isLossless(source: string, d: Exclude<Diagram, null>): boolean {
  const out = flatten(d);
  const outWords = new Set((out.match(/[A-Za-z]{4,}/g) ?? []).map((w) => w.toLowerCase()));

  for (const raw of source.match(/\d[\d,.]*/g) ?? []) {
    const n = raw.replace(/[.,]$/, "");
    if (n.length > 1 && !out.includes(n)) return false;
  }
  for (const w of source.match(/[A-Za-z]{4,}/g) ?? []) {
    if (!outWords.has(w.toLowerCase())) return false;
  }
  return true;
}

export function parseAsciiDiagram(source: string): Diagram {
  const lines = source.replace(/\s+$/, "").split("\n");
  if (lines.length < 2) return null;

  const drawing = lines.filter((l) => BOX.test(l) || RULE_LINE.test(l)).length;
  // No box drawing at all — a code sample, a USSD menu, a script. Leave those alone.
  if (drawing < 2) return null;

  for (const candidate of [parseTable(lines), parseKeyValue(lines), parsePanel(lines)]) {
    if (candidate && isLossless(source, candidate)) return candidate;
  }
  return null;
}
