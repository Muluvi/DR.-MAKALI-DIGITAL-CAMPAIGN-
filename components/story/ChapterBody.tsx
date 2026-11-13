import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { rehypePlainLabels } from "@/lib/plain-labels";
import { REGISTER } from "@/lib/register/specs";
import { NOMINATION_WINDOW } from "@/lib/phases";
import { slugify } from "@/lib/story/stages";
import { Md } from "./Md";
import { Visual } from "./Visual";
import { RegisterFigure } from "./Figure";
import { RapidResponseFlowDiagram } from "./RapidResponseFlow";

const textOf = (node: ReactNode): string =>
  Children.toArray(node)
    .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement(c) ? textOf((c.props as { children?: ReactNode }).children) : ""))
    .join("");

/** The markdown as the renderer takes it: editor marks out, the nomination window in words. */
function prepare(source: string): string {
  return source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<model-embed[^>]*>\s*<\/model-embed>/g, "")
    .replace(/<ws-mark[^>]*>\s*<\/ws-mark>/g, "")
    .replace(/<window-chip>\s*<\/window-chip>/g, `(${NOMINATION_WINDOW.short})`)
    .replace(/^> \[!(WARNING|NOTE|TIP|IMPORTANT|CAUTION)\]\s*$/gm, ">")
    .replace(/\n{3,}/g, "\n\n");
}

/** One chapter's markdown as HTML-ready React, on the server. Headings get "<chapter>-<words>" ids. */
export function ChapterBody({ id, source }: { id: string; source: string }) {
  const seen = new Map<string, number>();
  const headingId = (children: ReactNode) => {
    const base = `${id}-${slugify(textOf(children))}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  };
  const H = (Tag: "h4" | "h5" | "h6") =>
    function Heading({ children }: { children?: ReactNode }) {
      return <Tag id={headingId(children)}>{children}</Tag>;
    };

  const components: Components = {
    // Stages are h2 and chapter titles h3 (app/page.tsx), so the markdown's headings sit below them.
    h1: H("h4"),
    h2: H("h4"),
    h3: H("h5"),
    h4: H("h6"),
    h5: H("h6"),
    h6: H("h6"),
    a: ({ href = "", children }) => (/^https?:/.test(href) ? <a href={href} target="_blank" rel="noreferrer">{children}</a> : <a href={href}>{children}</a>),
    table: ({ children }) => (
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Table">
        <table>{children}</table>
      </div>
    ),
    blockquote: ({ children }) => <aside className="callout">{children}</aside>,
    pre: ({ children }) => {
      const code = Children.toArray(children)[0] as ReactElement<{ className?: string; children?: ReactNode }> | undefined;
      const lang = /language-(\w+)/.exec(code?.props.className ?? "")?.[1];
      const body = textOf(code?.props.children).trim();
      if (lang === "figure") {
        const fid = /id:\s*([a-z0-9-]+)/.exec(body)?.[1];
        if (fid === "rapid-response-flow") return <RapidResponseFlowDiagram />;
        const spec = fid ? REGISTER[fid] : undefined;
        if (!spec) throw new Error(`${id}: unknown figure ${fid}`);
        return <RegisterFigure spec={spec} />;
      }
      if (lang === "visual") return <Visual json={body} />;
      if (lang === "textversion") return <details className="v-more"><summary>Text version</summary><Md text={body} /></details>;
      if (lang === "lead") return <div className="lead"><Md text={body} /></div>;
      return <pre>{children}</pre>;
    },
  };

  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypePlainLabels]} components={components}>
        {prepare(source)}
      </ReactMarkdown>
    </div>
  );
}
