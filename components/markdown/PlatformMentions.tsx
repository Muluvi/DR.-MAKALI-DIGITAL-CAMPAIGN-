import React from "react";

import { InlinePlatformMark } from "../brand/PlatformLogos";
import { hasPlatformMention, platformIdFor, platformRegex } from "../../lib/platform-mentions";

/**
 * Puts the platform's mark in front of its name, wherever the document says it.
 *
 * Server component. It draws SVG and nothing else — no state, no handlers — so marking it
 * `"use client"` would ship a few hundred bytes of hydration per text node to draw something
 * that never changes. Roughly 190 mentions across the document makes that the difference
 * between free and not.
 *
 * The mark is additive: the matched word is re-emitted exactly as written, and the glyph is
 * aria-hidden, so the sentence is unchanged for a screen reader, in print, and with images off.
 * Nothing here rewrites the document's text — which matters because the body copy is under a
 * content-integrity guard, and this component never touches it.
 *
 * `whitespace-nowrap` on the pair is the one piece of layout that earns its place: without it a
 * line can break between the glyph and the word it belongs to, leaving an orphaned logo at the
 * end of a line.
 */
export function PlatformMentions({ text }: { text: string }) {
  if (!hasPlatformMention(text)) return <>{text}</>;

  // `split` on a regex with one capturing group yields [text, match, text, match, …], so every
  // odd index is a platform name and every even index is the prose between them.
  const parts = text.split(platformRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <React.Fragment key={i}>{part}</React.Fragment>;
        const id = platformIdFor(part);
        if (!id) return <React.Fragment key={i}>{part}</React.Fragment>;
        return (
          <span key={i} className="whitespace-nowrap">
            <InlinePlatformMark id={id} />
            {part}
          </span>
        );
      })}
    </>
  );
}

/**
 * The same decoration applied to any React subtree rather than to one string — used where the
 * text arrives already split into nodes, as it does in a markdown table cell whose content is a
 * mix of raw strings and `<strong>` elements.
 */
export function withPlatformMentions(node: React.ReactNode): React.ReactNode {
  return React.Children.map(node, (child) => {
    if (typeof child === "string") {
      return hasPlatformMention(child) ? <PlatformMentions text={child} /> : child;
    }
    if (React.isValidElement(child)) {
      const props = child.props as { children?: React.ReactNode };
      if (props?.children !== undefined) {
        return React.cloneElement(child, undefined, withPlatformMentions(props.children));
      }
    }
    return child;
  });
}
