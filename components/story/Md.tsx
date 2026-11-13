import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { rehypePlainLabels } from "@/lib/plain-labels";

/** Links inside chapter text: in-page anchors stay put; anything else opens in a new tab. */
function A({ href = "", children }: { href?: string; children?: React.ReactNode }) {
  const external = /^https?:/.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}

const TABLE: Components["table"] = ({ children }) => (
  <div className="table-wrap" tabIndex={0} role="region" aria-label="Table">
    <table>{children}</table>
  </div>
);

const BASE: Components = { a: A, table: TABLE };
const INLINE: Components = { ...BASE, p: ({ children }) => <>{children}</> };

/** A markdown string as block content (paragraphs, lists, tables). Server only. */
export function Md({ text }: { text?: string | null }) {
  if (!text) return null;
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePlainLabels]} components={BASE}>{text}</ReactMarkdown>;
}

/** A markdown string as inline content: no wrapping paragraph. */
export function MdInline({ text }: { text?: string | null }) {
  if (!text) return null;
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePlainLabels]} components={INLINE}>{text}</ReactMarkdown>;
}
