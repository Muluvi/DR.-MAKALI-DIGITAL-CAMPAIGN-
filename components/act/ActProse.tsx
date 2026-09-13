import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * The act's prose renderer.
 *
 * Deliberately not MarkdownViewer. That pipeline exists to serve a numbered document: it assigns
 * "<tab>-sec-<slug>" ids from the leading digits of every heading, resolves "Section 8.1.1"
 * cross-references into links, and mounts sixty-odd blocks keyed to those ids. All of that is the
 * apparatus the act is built to remove, so the act renders markdown through a map that has no
 * concept of a section number and no way to point at another part of the document.
 *
 * Runs on the server. react-markdown and its remark plugins never reach the client bundle, which
 * is the same reason the document pipeline renders server-side — it matters more here, because
 * the act is one page rather than nineteen routes.
 */

const components: Components = {
  h1: ({ children }) => <h1 className="act-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="act-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="act-h2">{children}</h3>,

  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  li: ({ children }) => <li>{children}</li>,

  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,

  // A quote in the act is an emphasis device, not a callout box.
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 pl-5 my-10" style={{ borderColor: "var(--act-ember)" }}>
      {children}
    </blockquote>
  ),

  // Two tables survive into this act — the zone weighting and the effort rebalancing. Both are
  // wider than the reading measure, so each gets its own horizontal scroll rather than making
  // the page scroll sideways on a phone.
  table: ({ children }) => (
    <div className="act-tablewrap my-12">
      <div className="act-tablescroll">
        <table className="act-table">{children}</table>
      </div>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-dotted underline-offset-4"
      style={{ color: "var(--act-blue)" }}
    >
      {children}
    </a>
  ),

  hr: () => <hr className="my-14 border-0 h-px" style={{ background: "var(--act-hair)" }} />,
};

export function ActProse({ markdown }: { markdown: string }) {
  return (
    <div className="act-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
