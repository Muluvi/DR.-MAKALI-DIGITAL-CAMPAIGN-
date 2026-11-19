# Fonts for the share-card images

The image routes (`app/api/card/[type]/route.tsx`) draw with `next/og`, which cannot use
`next/font` and needs the font files themselves. These are static TTF instances of the site's own
three families, as served by Google Fonts, all under the SIL Open Font License 1.1:

| File | Family | Weight |
|---|---|---|
| `Bricolage-400.ttf`, `Bricolage-700.ttf`, `Bricolage-800.ttf` | Bricolage Grotesque | 400, 700, 800 |
| `Newsreader-400.ttf`, `Newsreader-400i.ttf` | Newsreader | 400, 400 italic |
| `JetBrainsMono-500.ttf` | JetBrains Mono | 500 |

They are read on the server only and never ship to the browser. Every file covers ĩ and ũ, which
Kikamba needs.
