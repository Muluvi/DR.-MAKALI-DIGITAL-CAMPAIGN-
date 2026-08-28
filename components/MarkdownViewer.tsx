import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Volume2 } from "lucide-react";

import { InteractiveTable } from "./markdown/InteractiveTable";
import { MarkdownParagraph, MarkdownListItem } from "./markdown/MarkdownTextComponents";
import { AudioBriefingButton } from "./markdown/AudioBriefingButton";
import { SectionHeading } from "./markdown/SectionHeading";
import { headingSlug, sectionId, type TabId } from "../lib/heading-slug";

function getHeadingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getHeadingText).join("");
  return "";
}

// Markdown parsing runs here on the server at render time, so react-markdown
// and its remark/rehype plugins never ship to the client bundle.
export function MarkdownViewer({ content, tabId }: { content: string; tabId: TabId }) {
  return (
    <div className="relative bg-card rounded-none sm:rounded-3xl border-0 shadow-none sm:shadow-sm overflow-hidden p-0 sm:p-8 pt-4 pb-6 sm:py-8">
      {/* Dynamic Faded Watermark Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-10">
        <div className="absolute top-[20%] right-[-10%] text-[8rem] font-black text-accent/5 rotate-[-12deg] font-serif uppercase">
          Wiper Movement
        </div>
        <div className="absolute bottom-[20%] left-[-15%] text-[8rem] font-black text-gold/5 rotate-[8deg] font-serif uppercase">
          Democratic
        </div>
      </div>

      {/* Integrated Media Briefing Placard at the top of long strategic pages */}
      <div className="mx-4 sm:mx-0 mb-6 bg-gradient-to-r from-accent/[0.03] to-gold/[0.03] border border-line/25 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
            <Volume2 size={18} />
          </div>
          <div>
            <h4 className="font-serif text-xs font-black text-ink">Campaign Audio Strategy Briefing</h4>
            <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Listen to synthesized narrative breakdown (2:15 min)</p>
          </div>
        </div>
        <AudioBriefingButton />
      </div>

      <div className="prose max-w-none relative z-10 px-4 sm:px-0
        [&_p:first-of-type]:text-base [&_p:first-of-type]:sm:text-lg [&_p:first-of-type]:font-extrabold [&_p:first-of-type]:text-ink [&_p:first-of-type]:leading-relaxed [&_p:first-of-type]:border-b [&_p:first-of-type]:border-line/40 [&_p:first-of-type]:pb-4 [&_p:first-of-type]:mb-6
        [&_p:first-of-type::first-letter]:text-4xl [&_p:first-of-type::first-letter]:font-black [&_p:first-of-type::first-letter]:text-gold [&_p:first-of-type::first-letter]:mr-2 [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:leading-none
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            table: ({ children }) => (
              <InteractiveTable>{children}</InteractiveTable>
            ),
            p: ({ children }) => (
              <MarkdownParagraph tabId={tabId}>{children}</MarkdownParagraph>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-accent bg-accent/[0.03] px-5 py-4 rounded-r-2xl my-6 text-xs sm:text-sm font-semibold text-ink leading-relaxed shadow-sm italic relative text-pretty">
                {children}
              </blockquote>
            ),
            li: ({ children }) => (
              <MarkdownListItem tabId={tabId}>{children}</MarkdownListItem>
            ),
            h2: ({ children }) => {
              const text = getHeadingText(children);
              const slug = headingSlug(text);
              const id = slug ? sectionId(tabId, slug) : null;
              return <SectionHeading id={id} level={2}>{children}</SectionHeading>;
            },
            h3: ({ children }) => {
              const text = getHeadingText(children);
              const slug = headingSlug(text);
              const id = slug ? sectionId(tabId, slug) : null;
              return <SectionHeading id={id} level={3}>{children}</SectionHeading>;
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
