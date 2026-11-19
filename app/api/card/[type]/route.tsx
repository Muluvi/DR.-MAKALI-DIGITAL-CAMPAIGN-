import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import QRCode from "qrcode";

import { buildCard, CARD_TYPES, type Params } from "@/lib/card/build";
import { CardImage } from "@/lib/card/render";
import { CARD_FORMATS, isCardFormat, sourceLine, type CardType } from "@/lib/card/spec";
import { CANONICAL_ORIGIN, SITE_HOST } from "@/lib/site";

/**
 * Share-card images, made on the server (visual upgrade, E2), so they look the same on every phone.
 *
 *   /api/card/<type>?<view state>&format=chat|status|square|a4
 *
 * The view state is the whole query, so every image has a stable address and its QR code points to
 * the same view on the site. Nothing about the person asking is read or stored.
 */
export const runtime = "nodejs";

const FONT_DIR = join(process.cwd(), "assets", "fonts");
let fonts: Promise<{ name: string; data: ArrayBuffer; weight: 400 | 500 | 700 | 800; style: "normal" | "italic" }[]> | null = null;
function loadFonts() {
  if (!fonts) {
    const f = (file: string) => readFile(join(FONT_DIR, file)).then((b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
    fonts = Promise.all([
      f("Bricolage-400.ttf").then((data) => ({ name: "Display", data, weight: 400 as const, style: "normal" as const })),
      f("Bricolage-700.ttf").then((data) => ({ name: "Display", data, weight: 700 as const, style: "normal" as const })),
      f("Bricolage-800.ttf").then((data) => ({ name: "Display", data, weight: 800 as const, style: "normal" as const })),
      f("Newsreader-400.ttf").then((data) => ({ name: "Serif", data, weight: 400 as const, style: "normal" as const })),
      f("Newsreader-400i.ttf").then((data) => ({ name: "Serif", data, weight: 400 as const, style: "italic" as const })),
      f("JetBrainsMono-500.ttf").then((data) => ({ name: "Mono", data, weight: 500 as const, style: "normal" as const })),
    ]);
  }
  return fonts;
}

/** Rows a ranked card shows per image, by format: what fits with every line at 28px or more. */
const PER_PAGE = { chat: 7, status: 13, square: 3, a4: 9 } as const;

export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!CARD_TYPES.includes(type as CardType)) return new Response("No such card.", { status: 404 });
  const url = new URL(req.url);
  const q: Params = Object.fromEntries(url.searchParams.entries());
  const format = isCardFormat(q.format) ? q.format : "chat";
  if (!q.per) q.per = String(PER_PAGE[format]);
  const model = await buildCard(type as CardType, q);
  if (!model) return new Response("That card has nothing to show for these settings.", { status: 404 });

  const target = new URL(model.path, CANONICAL_ORIGIN).toString();
  // ?as=json: the card's content without its layout (visual upgrade, E1), so the same data can be
  // checked, reused or made into another format.
  if (q.as === "json") {
    return Response.json({ ...model, source: model.source ?? sourceLine(model.figures), link: target, format }, { headers: { "Cache-Control": "public, max-age=3600" } });
  }
  const qrSvg = await QRCode.toString(target, { type: "svg", margin: 4, errorCorrectionLevel: "L", color: { dark: "#151f3eff", light: "#ffffffff" } });
  const link = `${SITE_HOST}${model.path.split("#")[0] === "/" ? "" : model.path.split(/[?#]/)[0]}`;
  const { w, h } = CARD_FORMATS[format];

  return new ImageResponse(<CardImage model={model} format={format} W={w} H={h} qrSvg={qrSvg} link={link} />, {
    width: w,
    height: h,
    fonts: await loadFonts(),
    headers: {
      // The data changes only when the site is redeployed; the countdown changes daily.
      "Cache-Control": type === "countdown" ? "public, max-age=3600, s-maxage=3600" : "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
