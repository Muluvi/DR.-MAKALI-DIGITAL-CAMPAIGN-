/**
 * Marks the first use of each term from the Fine print glossary (H.1) in a block of prose, so the
 * reader can tap it for the definition instead of leaving the chapter (story integration, November
 * 2026). The text is not changed: the term is wrapped in a <gloss-term> element that
 * components/story/GlossTerm.tsx renders as a button. Headings, links, code, figures' own labels
 * and the glossary itself are left alone.
 */
import mirrors from "./story/mirrors.generated.json";

type HastText = { type: "text"; value: string };
type HastElement = { type: "element"; tagName: string; properties: Record<string, unknown>; children: HastNode[] };
type HastNode = HastText | HastElement | { type: string; children?: HastNode[] };

const SKIP = new Set(["code", "pre", "script", "style", "a", "h1", "h2", "h3", "h4", "h5", "h6", "button", "gloss-term", "abbr", "svg"]);

/** Whole-word, case-sensitive for acronyms; the two lower-case terms of art match in any case. */
const TERMS = mirrors.terms
  .map((t) => t.term)
  .filter((t) => !/^IEBC Forms/.test(t))
  .map((term) => ({ term, re: new RegExp(`(?<![\\w-])${term.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")}(?![\\w-])`, /[a-z]/.test(term) ? "i" : "") }));

export function rehypeGlossary() {
  return (tree: HastNode) => {
    const used = new Set<string>();
    const walk = (node: HastNode) => {
      if (!("children" in node) || !node.children) return;
      if (node.type === "element" && SKIP.has((node as HastElement).tagName)) return;
      const out: HastNode[] = [];
      for (const child of node.children) {
        if (child.type !== "text") { walk(child); out.push(child); continue; }
        let rest = (child as HastText).value;
        // Split this text node at each first use, in order of position.
        for (;;) {
          let best: { term: string; index: number; length: number } | null = null;
          for (const t of TERMS) {
            if (used.has(t.term)) continue;
            const m = t.re.exec(rest);
            if (m && (!best || m.index < best.index)) best = { term: t.term, index: m.index, length: m[0].length };
          }
          if (!best) break;
          used.add(best.term);
          if (best.index > 0) out.push({ type: "text", value: rest.slice(0, best.index) });
          out.push({ type: "element", tagName: "gloss-term", properties: { term: best.term }, children: [{ type: "text", value: rest.slice(best.index, best.index + best.length) }] });
          rest = rest.slice(best.index + best.length);
        }
        if (rest) out.push({ type: "text", value: rest });
      }
      node.children = out;
    };
    walk(tree);
  };
}
