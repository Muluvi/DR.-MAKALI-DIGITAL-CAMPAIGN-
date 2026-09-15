import type { PlatformId } from "../components/brand/PlatformLogos";

/**
 * Where the document names a platform, and which mark that name takes.
 *
 * The proposal names these seven platforms 189 times across body copy, bullets and table cells.
 * Marking them one call site at a time was never going to hold: a mark would appear in the three
 * panels someone remembered to edit and nowhere else, which reads as an oversight rather than a
 * system. This module is the single pattern the whole document is matched against, so a mention
 * anywhere gets the same treatment, and adding a platform is one line here.
 *
 * SERVER-SAFE BY DESIGN. No React, no hooks, no DOM — the same discipline lib/highlight-patterns
 * follows and for the same reason. It lets a server component ask "does this string mention a
 * platform at all" before deciding what to render, so the large majority of text nodes stay
 * plain server-rendered markup and nothing crosses into the client tree to draw a logo.
 *
 * ON MATCHING A BARE "X"
 * ----------------------
 * A single capital X is the obvious trap in a corpus full of `1080x1920`, `*483*XX#` and
 * `STOP to 22XXX`. It turns out not to be one here, and the check is mechanical rather than
 * hopeful: `\bX\b` finds 23 matches in public/content, and all 23 are the platform. The near
 * misses all fail the word boundary — `22XXX` has no boundary between its X's, and the pixel
 * dimensions use a lowercase x. Re-run this before trusting it if the content changes:
 *
 *     grep -rohP "\bX\b" public/content/*.md | wc -l
 *     grep -rohP ".{0,30}\bX\b.{0,30}" public/content/*.md | sort -u
 *
 * "Meta" is deliberately absent. It is the parent company, not one of the marks, and §3.6.1
 * sizes "Meta (FB/IG)" as a single line covering two of them — so stamping it with Facebook's
 * glyph would assert a mapping the evidence base does not make.
 */

/** Source markdown hard-wraps near 80 columns, so a two-word name can carry a newline inside it. */
function ws(phrase: string): string {
  return phrase.replace(/ /g, "\\s+");
}

/**
 * Ordered alternation — longest and most specific first, because a regex alternation commits to
 * the first branch that matches. `X (Twitter)` has to precede the bare `X`, or the bare branch
 * wins and leaves a stranded "(Twitter)" behind the mark.
 */
const PATTERNS: { pattern: string; id: PlatformId }[] = [
  { pattern: ws("X \\(Twitter\\)"), id: "x" },
  { pattern: "WhatsApp", id: "whatsapp" },
  { pattern: "Facebook", id: "facebook" },
  { pattern: "Instagram", id: "instagram" },
  { pattern: "TikTok", id: "tiktok" },
  { pattern: "YouTube", id: "youtube" },
  { pattern: "LinkedIn", id: "linkedin" },
  { pattern: "Twitter", id: "x" },
  { pattern: "X", id: "x" },
];

const SOURCE = `\\b(${PATTERNS.map((p) => p.pattern).join("|")})\\b`;

/**
 * Case-SENSITIVE, unlike the highlight patterns. These are proper nouns with fixed casing, and
 * matching case-insensitively is what would turn every stray lowercase "x" — the multiplication
 * sign in `1080x1920`, the `x` in `(×2)` written as ASCII — into a platform logo.
 */
export const platformRegex = new RegExp(SOURCE, "g");

const probeRegex = new RegExp(SOURCE);

/** Which mark a matched name takes. Returns null for anything that is not an exact match. */
export function platformIdFor(match: string): PlatformId | null {
  const normalized = match.replace(/\s+/g, " ");
  for (const { pattern, id } of PATTERNS) {
    if (new RegExp(`^${pattern}$`).test(normalized)) return id;
  }
  return null;
}

/**
 * Server-side probe: is there anything in this string worth decorating?
 *
 * `.test()` on a global regex advances lastIndex and so alternates true/false across calls,
 * which is why this uses its own non-global copy — the same footgun lib/highlight-patterns
 * documents.
 */
export function hasPlatformMention(text: string): boolean {
  return probeRegex.test(text);
}
