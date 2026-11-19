/**
 * The site's colour tokens as hex, for the image routes: next/og cannot read oklch(). Each value
 * is the light theme's token converted exactly (app/globals.css, app/editorial.css). A share image
 * is always the light theme, because it is read on someone else's phone in daylight.
 */
export const C = {
  paper: "#f9f5ed",
  card: "#ffffff",
  ink: "#151f3e",
  muted: "#4d586c",
  line: "#dcd7cd",
  raised2: "#f3eee4",
  accent: "#173ebb",
  accentSolid: "#1e49ce",
  earth: "#a63c0c",
  earthSolid: "#b0451a",
  t1: "#09672e",
  t3: "#af2b25",
  neutral: "#8e8572",
  q: ["#dde8fd", "#acc5f2", "#7297e2", "#3a63cd", "#18349b"],
  onSolid: "#ffffff",
} as const;
