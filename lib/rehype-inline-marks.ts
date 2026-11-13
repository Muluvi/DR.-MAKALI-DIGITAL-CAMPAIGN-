import { tokenizeInline, hasInlineMark, type InlinePart } from "./inline-marks.ts";

/**
 * The renderer half of lib/inline-marks.ts: a rehype plugin that turns the working marks in each
 * text node into elements the markdown components map draws as chips (components/markdown/InlineMarks.tsx).
 *
 * Code and preformatted text are left alone, so a figure or visual fence is never touched, and so is
 * a mark the source puts in a code span on purpose.
 *
 * A citation followed by [CHECK REF] is held as plain text (a `nolink` span): that number was wrong
 * before the 2026 renumbering moved it, and linking it would send a reader to whatever carries it
 * now. The highlighter only links strings that are a paragraph's direct children, so the span is
 * enough to keep it from linking.
 */

type HastText = { type: "text"; value: string };
type HastElement = { type: "element"; tagName: string; properties: Record<string, unknown>; children: HastNode[] };
type HastNode = HastText | HastElement | { type: string; children?: HastNode[] };

const SKIP = new Set(["code", "pre", "script", "style"]);
const CITATION_TAIL = /((?:Sections?|§)\s*(?:\d+(?:\.\d+){0,3}|[A-H](?:\.\d+){1,2})(?:\s*(?:,|and|or|to|&|–)\s*(?:\d+(?:\.\d+){0,3}|[A-H](?:\.\d+){1,2}))*[)\s]*)$/;

const text = (value: string): HastText => ({ type: "text", value });
const el = (tagName: string, properties: Record<string, unknown>, children: HastNode[] = []): HastElement => ({
  type: "element",
  tagName,
  properties,
  children,
});

function toNodes(parts: InlinePart[]): HastNode[] {
  const out: HastNode[] = [];
  parts.forEach((p, i) => {
    const nextIsCheck = parts[i + 1]?.type === "checkref";
    switch (p.type) {
      case "text": {
        const tail = nextIsCheck ? CITATION_TAIL.exec(p.text) : null;
        if (tail) {
          const head = p.text.slice(0, tail.index);
          if (head) out.push(text(head));
          out.push(el("span", { className: ["nolink"] }, [text(tail[1])]));
        } else out.push(text(p.text));
        break;
      }
      case "tier":
        out.push(el("tier-mark", { tiers: p.tiers.join(","), head: p.head, rest: p.rest }));
        break;
      case "conflict":
        out.push(el("conflict-mark", { conflict: p.id }));
        break;
      case "checkref":
        out.push(el("checkref-mark", {}));
        break;
      case "status":
        out.push(el("status-mark", { status: p.status, note: p.note }));
        break;
      case "xref":
        if (nextIsCheck) out.push(el("span", { className: ["nolink"] }, [text(p.raw)]));
        else out.push(el("xref-mark", { refs: p.refs.join(","), raw: p.raw }));
        break;
    }
  });
  return out;
}

function walk(node: HastNode): void {
  const children = (node as { children?: HastNode[] }).children;
  if (!children) return;
  if (node.type === "element" && SKIP.has((node as HastElement).tagName)) return;
  const next: HastNode[] = [];
  for (const child of children) {
    if (child.type === "text" && hasInlineMark((child as HastText).value)) {
      next.push(...toNodes(tokenizeInline((child as HastText).value)));
    } else {
      walk(child);
      next.push(child);
    }
  }
  (node as { children: HastNode[] }).children = next;
}

export function rehypeInlineMarks() {
  return (tree: HastNode) => walk(tree);
}
