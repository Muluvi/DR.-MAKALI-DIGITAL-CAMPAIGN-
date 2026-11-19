/**
 * The share card's layout (visual upgrade, E2 and E3), for next/og.
 *
 * Every card has the same frame: what it is (kicker), the finding (title), the body, then a foot
 * that carries the source line with tiers, "Built by Firefly Management", the site link and a QR
 * code to the exact view. Sizes are set for a 1080-wide card and scaled by `s` for A4, and no text
 * is ever smaller than 28px at 1080 wide (MIN). Colours are the site's tokens (lib/card/palette.ts).
 *
 * next/og lays out with flexbox only, so every element that holds more than one child says
 * `display: flex`.
 */
import type { ReactNode } from "react";

import type { Block, CardModel } from "./build";
import { C } from "./palette";
import { sourceLine, type CardFormat } from "./spec";
import { CHECK_SVG, CLOUD_SUN_SVG, countySvg, COUNTY_RATIO, dataUri, glyphSvg, iconArraySvg, SUN_SVG } from "./svg";

const MIN = 28;

type Ctx = { s: number; W: number; H: number; format: CardFormat; dense: boolean };

function Row({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: "flex", flexDirection: "row", ...style }}>{children}</div>;
}
function Col({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: "flex", flexDirection: "column", ...style }}>{children}</div>;
}

/* ------------------------------------------------------------------------------- blocks */

function Tiles({ items, c }: { items: { value: string; label: string; note?: string }[]; c: Ctx }) {
  const cols = items.length <= 2 ? items.length : c.format === "status" ? 2 : items.length === 4 ? 2 : 3;
  return (
    <Row style={{ flexWrap: "wrap", gap: 20 * c.s }}>
      {items.map((t, i) => (
        <Col key={i} style={{ width: `${100 / cols - 2.5}%`, padding: (c.dense ? 16 : 24) * c.s, borderRadius: 24 * c.s, backgroundColor: C.raised2 }}>
          <div style={{ display: "flex", fontSize: (c.dense ? 42 : 54) * c.s, fontWeight: 800, color: C.ink, lineHeight: 1.1 }}>{t.value}</div>
          <div style={{ display: "flex", fontSize: (c.dense ? MIN : 30) * c.s, color: C.ink, marginTop: 6 * c.s, lineHeight: 1.2 }}>{t.label}</div>
          {t.note && !c.dense ? <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted, marginTop: 6 * c.s, lineHeight: 1.25 }}>{t.note}</div> : null}
        </Col>
      ))}
    </Row>
  );
}

function Bars({ b, c }: { b: Extract<Block, { kind: "bars" }>; c: Ctx }) {
  const max = Math.max(...b.rows.map((r) => r.value), b.ref?.value ?? 0) || 1;
  const labelW = 380 * c.s;
  const valueW = 190 * c.s;
  return (
    <Col style={{ gap: (c.dense ? 8 : 12) * c.s }}>
      {b.rows.map((r, i) => {
        const color = r.mark === "pool" || r.mark === "below" || r.mark === "lit" ? C.earthSolid : C.accentSolid;
        return (
          <Row key={i} style={{ alignItems: "center", gap: 16 * c.s }}>
            <Col style={{ width: labelW }}>
              <div style={{ display: "flex", fontSize: 30 * c.s, fontWeight: 700, color: C.ink, lineHeight: 1.15 }}>{r.label}</div>
              {r.sub && !c.dense ? <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted, lineHeight: 1.15 }}>{r.sub}</div> : null}
            </Col>
            <Row style={{ flex: 1, height: 28 * c.s, borderRadius: 14 * c.s, backgroundColor: C.raised2, position: "relative" }}>
              <div style={{ display: "flex", width: `${(r.value / max) * 100}%`, height: "100%", borderRadius: 14 * c.s, backgroundColor: color }} />
              {b.ref ? <div style={{ display: "flex", position: "absolute", left: `${(b.ref.value / max) * 100}%`, top: -6 * c.s, width: 4 * c.s, height: 40 * c.s, backgroundColor: C.ink }} /> : null}
            </Row>
            <div style={{ display: "flex", width: valueW, justifyContent: "flex-end", fontSize: 30 * c.s, fontWeight: 700, color: C.ink }}>{r.display}</div>
          </Row>
        );
      })}
      {b.ref || b.zeroNote ? (
        <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted, marginTop: 4 * c.s }}>{[b.ref ? `Black line: ${b.ref.label}.` : "", b.zeroNote ?? ""].filter(Boolean).join(" ")}</div>
      ) : null}
    </Col>
  );
}

function MapBlock({ b, c, h }: { b: Extract<Block, { kind: "map" }>; c: Ctx; h: number }) {
  const svg = countySvg((id) => b.fills[id] ?? C.line);
  const mapH = Math.min(h, (b.side ? c.W * 0.5 : c.W * 0.8) / COUNTY_RATIO);
  return (
    <Row style={{ gap: 32 * c.s, alignItems: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUri(svg)} width={mapH * COUNTY_RATIO} height={mapH} alt="" />
      <Col style={{ flex: 1, gap: 12 * c.s }}>
        {(b.side ?? []).slice(0, c.dense ? 3 : undefined).map((t, i) => (
          <Col key={i}>
            <div style={{ display: "flex", fontSize: 44 * c.s, fontWeight: 800, color: C.ink, lineHeight: 1.1 }}>{t.value}</div>
            <div style={{ display: "flex", fontSize: MIN * c.s, color: C.ink }}>{t.label}</div>
            {t.note ? <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted }}>{t.note}</div> : null}
          </Col>
        ))}
        <Col style={{ gap: 8 * c.s, marginTop: 8 * c.s }}>
          {b.legend.map((l, i) => (
            <Row key={i} style={{ alignItems: "center", gap: 12 * c.s }}>
              <div style={{ display: "flex", width: 32 * c.s, height: 32 * c.s, borderRadius: 6 * c.s, backgroundColor: l.color }} />
              <div style={{ display: "flex", fontSize: MIN * c.s, color: C.ink }}>{l.label}</div>
            </Row>
          ))}
        </Col>
      </Col>
    </Row>
  );
}

function Icons({ b, c, room }: { b: Extract<Block, { kind: "icons" }>; c: Ctx; room: number }) {
  const per = c.format === "square" ? 3 : c.format === "status" ? 1 : 2;
  const size = c.dense ? Math.min(200 * c.s, room - 170 * c.s) : c.format === "status" ? 300 * c.s : 260 * c.s;
  return (
    <Col style={{ gap: 20 * c.s }}>
      <Row style={{ flexWrap: "wrap", gap: 28 * c.s }}>
        {b.items.map((it, i) => (
          <Row key={i} style={{ width: per === 1 ? "100%" : `${100 / per - 3}%`, gap: 20 * c.s, alignItems: "center", flexDirection: per === 3 ? "column" : "row" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUri(iconArraySvg(it.value, it.glyph))} width={size} height={size} alt="" />
            <Col style={c.dense ? { width: "100%" } : { flex: 1 }}>
              <div style={{ display: "flex", fontSize: (c.dense ? 44 : 56) * c.s, fontWeight: 800, color: C.ink }}>{it.display}</div>
              <div style={{ display: "flex", fontSize: (c.dense ? MIN : 30) * c.s, color: C.ink, lineHeight: 1.2 }}>{it.label}</div>
            </Col>
          </Row>
        ))}
      </Row>
      <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted }}>{b.key}</div>
    </Col>
  );
}

function Scale({ b, c, room }: { b: Extract<Block, { kind: "scale" }>; c: Ctx; room: number }) {
  const big = Math.max(...b.items.map((i) => i.value)) || 1;
  // The larger shape fills what the body leaves after its two caption lines.
  const MAX = Math.max(120 * c.s, Math.min(360 * c.s, room - 150 * c.s));
  return (
    <Col style={{ gap: 16 * c.s }}>
      <Row style={{ gap: 48 * c.s, alignItems: "flex-end" }}>
        {b.items.map((it, i) => {
          const side = MAX * Math.sqrt(it.value / big);
          return (
            <Col key={i} style={{ alignItems: "center", gap: 8 * c.s }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri(glyphSvg(b.glyph, i === b.items.length - 1 ? C.earthSolid : C.neutral))} width={side} height={side} alt="" />
              <div style={{ display: "flex", fontSize: 44 * c.s, fontWeight: 800, color: C.ink }}>{it.display}</div>
              <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted }}>{it.label}</div>
            </Col>
          );
        })}
      </Row>
      <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted }}>{b.title}. Drawn to scale by area.</div>
    </Col>
  );
}

function Receipt({ b, c }: { b: Extract<Block, { kind: "receipt" }>; c: Ctx }) {
  return (
    <Col style={{ alignSelf: "center", width: c.dense ? "100%" : "86%", padding: (c.dense ? 20 : 36) * c.s, backgroundColor: C.card, fontFamily: "Mono", color: C.ink, boxShadow: "0 12px 30px rgba(21,31,62,0.18)" }}>
      <div style={{ display: "flex", justifyContent: "center", fontSize: 34 * c.s, fontWeight: 500, paddingBottom: 16 * c.s, borderBottom: `${3 * c.s}px dashed ${C.ink}` }}>KITUI COUNTY · PER RESIDENT</div>
      {b.lines.map((l, i) => (
        <Row key={i} style={{ justifyContent: "space-between", paddingTop: (c.dense ? 8 : 16) * c.s, fontSize: (c.dense ? MIN : 30) * c.s }}>
          <Col><div style={{ display: "flex" }}>{c.dense ? `${l.label} (${l.note.startsWith("calculated") ? "calculated" : l.note})` : l.label}</div>{c.dense ? null : <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted }}>{l.note}</div>}</Col>
          <div style={{ display: "flex" }}>{l.amount}</div>
        </Row>
      ))}
      <Row style={{ justifyContent: "space-between", marginTop: 20 * c.s, paddingTop: 16 * c.s, borderTop: `${3 * c.s}px dashed ${C.ink}`, fontSize: 36 * c.s }}>
        <Col><div style={{ display: "flex" }}>{b.total.label}</div><div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted }}>{b.total.note}</div></Col>
        <div style={{ display: "flex" }}>{b.total.amount}</div>
      </Row>
      {c.dense ? null : <div style={{ display: "flex", marginTop: 16 * c.s, fontSize: MIN * c.s, color: C.muted }}>{b.foot}</div>}
    </Col>
  );
}

function Forecast({ b, c }: { b: Extract<Block, { kind: "forecast" }>; c: Ctx }) {
  const tone = (p: string) => (p === "Normal" ? "#dde8fd" : p === "Alert" ? "#f6dccf" : "#f4cbc8");
  return (
    <Col style={{ gap: 24 * c.s }}>
      <Row style={{ flexWrap: "wrap", gap: 16 * c.s }}>
        {b.days.map((d, i) => (
          <Col key={i} style={{ width: c.format === "status" ? "47%" : "23%", padding: 22 * c.s, borderRadius: 22 * c.s, backgroundColor: tone(d.phase), alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted, fontWeight: 700 }}>{d.when}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUri(d.phase === "Normal" ? CLOUD_SUN_SVG(C.accent) : SUN_SVG(C.earth))} width={72 * c.s} height={72 * c.s} alt="" style={{ margin: `${8 * c.s}px 0` }} />
            <div style={{ display: "flex", fontSize: 36 * c.s, fontWeight: 800, color: C.ink }}>{d.phase}</div>
          </Col>
        ))}
      </Row>
      <Col style={{ gap: 6 * c.s }}>
        {b.also.map((a, i) => <div key={i} style={{ display: "flex", fontSize: 32 * c.s, color: C.ink }}>{a}</div>)}
      </Col>
    </Col>
  );
}

function List({ b, c, limit }: { b: Extract<Block, { kind: "list" }>; c: Ctx; limit: number }) {
  const shown = b.items.slice(0, limit);
  return (
    <Col style={{ gap: 14 * c.s }}>
      {shown.map((it, i) => (
        <Row key={i} style={{ gap: 18 * c.s, alignItems: "flex-start" }}>
          <div style={{ display: "flex", width: 40 * c.s, height: 40 * c.s, marginTop: 2 * c.s, borderRadius: 10 * c.s, border: `${3 * c.s}px solid ${it.state === "done" ? C.t1 : C.muted}`, backgroundColor: it.state === "done" ? C.t1 : "transparent", justifyContent: "center", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {it.state === "done" ? <img src={dataUri(CHECK_SVG)} width={28 * c.s} height={28 * c.s} alt="" /> : null}
          </div>
          <Col style={{ flex: 1 }}>
            <div style={{ display: "flex", fontSize: 30 * c.s, color: C.ink, fontWeight: 700, lineHeight: 1.25 }}>{it.title}</div>
            {it.meta ? <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted, lineHeight: 1.25 }}>{it.meta}</div> : null}
          </Col>
        </Row>
      ))}
      {b.items.length > shown.length ? <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted }}>and {b.items.length - shown.length} more on the site</div> : null}
    </Col>
  );
}

function Grid({ b, c, limit }: { b: Extract<Block, { kind: "grid" }>; c: Ctx; limit: number }) {
  const rows = b.rows.slice(0, limit);
  const cell = (t: string, i: number, head: boolean) => (
    <div key={i} style={{ display: "flex", flex: i === 0 ? 2 : 1, justifyContent: i === 0 ? "flex-start" : "flex-end", fontSize: (head ? MIN : 30) * c.s, fontWeight: head || i === 0 ? 700 : 400, color: head ? C.muted : C.ink, lineHeight: 1.2 }}>{t}</div>
  );
  return (
    <Col style={{ gap: 0 }}>
      <Row style={{ gap: 16 * c.s, paddingBottom: 10 * c.s, borderBottom: `${2 * c.s}px solid ${C.line}` }}>{b.columns.map((h, i) => cell(h, i, true))}</Row>
      {rows.map((r, k) => (
        <Row key={k} style={{ gap: 16 * c.s, padding: `${10 * c.s}px 0`, borderBottom: `${2 * c.s}px solid ${C.line}` }}>{r.map((t, i) => cell(t, i, false))}</Row>
      ))}
      {b.rows.length > rows.length ? <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted, marginTop: 10 * c.s }}>and {b.rows.length - rows.length} more on the site</div> : null}
    </Col>
  );
}

function Phone({ b, c }: { b: Extract<Block, { kind: "phone" }>; c: Ctx }) {
  const channels = c.dense ? b.channels.slice(0, 2) : b.channels;
  const n = channels.length;
  const w = n === 1 ? 560 * c.s : (c.W - 200 * c.s) / Math.min(n, 2);
  return (
    <Row style={{ flexWrap: "wrap", gap: 24 * c.s, justifyContent: "center" }}>
      {channels.map((ch) => (
        <Col key={ch} style={{ width: w, padding: 16 * c.s, borderRadius: 36 * c.s, backgroundColor: "#1b1f26" }}>
          <div style={{ display: "flex", padding: `${10 * c.s}px ${18 * c.s}px`, borderRadius: `${24 * c.s}px ${24 * c.s}px 0 0`, backgroundColor: ch === "WhatsApp" ? "#008069" : ch === "Radio" ? "#7a5a3c" : "#2f3540", color: "#fff", fontSize: MIN * c.s, fontWeight: 700 }}>{ch}</div>
          <div style={{ display: "flex", padding: 22 * c.s, borderRadius: `0 0 ${24 * c.s}px ${24 * c.s}px`, backgroundColor: ch === "SMS" || ch === "USSD" ? "#cfdcbf" : "#efe7de", color: "#111b21", fontSize: (n > 2 ? 28 : 34) * c.s, lineHeight: 1.35, whiteSpace: "pre-wrap", fontFamily: ch === "SMS" || ch === "USSD" ? "Mono" : "Display" }}>{ch === "USSD" ? b.text.slice(0, 182) : ch === "SMS" ? b.text.slice(0, 160) : b.text}</div>
        </Col>
      ))}
    </Row>
  );
}

function Hero({ b, c }: { b: Extract<Block, { kind: "hero" }>; c: Ctx }) {
  return (
    <Col style={{ gap: 8 * c.s }}>
      <div style={{ display: "flex", fontSize: (b.value.length > 9 || c.dense ? 120 : 170) * c.s, fontWeight: 800, color: C.earth, lineHeight: 1 }}>{b.value}</div>
      <div style={{ display: "flex", fontSize: 40 * c.s, color: C.ink, lineHeight: 1.2 }}>{b.label}</div>
      {b.note ? <div style={{ display: "flex", fontSize: 30 * c.s, color: C.muted, lineHeight: 1.25 }}>{b.note}</div> : null}
    </Col>
  );
}

function Quote({ b, c }: { b: Extract<Block, { kind: "quote" }>; c: Ctx }) {
  return (
    <Col style={{ gap: 10 * c.s, padding: 32 * c.s, borderLeft: `${10 * c.s}px solid ${C.earthSolid}`, backgroundColor: C.raised2, borderRadius: 16 * c.s }}>
      {b.value ? <div style={{ display: "flex", fontSize: 110 * c.s, fontWeight: 800, color: C.earth, lineHeight: 1 }}>{b.value}</div> : null}
      <div style={{ display: "flex", fontSize: 42 * c.s, color: C.ink, lineHeight: 1.25, fontFamily: "Serif" }}>{b.text}</div>
    </Col>
  );
}

function Countdown({ b, c }: { b: Extract<Block, { kind: "countdown" }>; c: Ctx }) {
  const d = new Date(`${b.date}T00:00:00Z`);
  return (
    <Row style={{ gap: 36 * c.s, alignItems: "center" }}>
      <Col style={{ width: 230 * c.s, alignItems: "center", borderRadius: 20 * c.s, backgroundColor: C.card, border: `${3 * c.s}px solid ${C.line}`, overflow: "hidden" }}>
        <div style={{ display: "flex", width: "100%", justifyContent: "center", padding: 10 * c.s, backgroundColor: C.earthSolid, color: C.onSolid, fontSize: MIN * c.s, fontWeight: 800 }}>{d.toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" }).toUpperCase()}</div>
        <div style={{ display: "flex", fontSize: 110 * c.s, fontWeight: 800, color: C.ink, lineHeight: 1.1 }}>{d.getUTCDate()}</div>
        <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted, paddingBottom: 10 * c.s }}>{d.getUTCFullYear()}</div>
      </Col>
      <Col style={{ flex: 1, gap: 8 * c.s }}>
        <div style={{ display: "flex", fontSize: 96 * c.s, fontWeight: 800, color: C.earth, lineHeight: 1 }}>{b.days === null ? "" : `${b.days} ${b.days === 1 ? "day" : "days"}`}</div>
        <div style={{ display: "flex", fontSize: 36 * c.s, color: C.ink, lineHeight: 1.25, fontWeight: 700 }}>{b.event}</div>
        <div style={{ display: "flex", fontSize: MIN * c.s, color: C.muted }}>{b.who}</div>
      </Col>
    </Row>
  );
}

function BlockView({ b, c, room }: { b: Block; c: Ctx; room: number }) {
  const lineH = 56 * c.s;
  switch (b.kind) {
    case "hero": return <Hero b={b} c={c} />;
    case "tiles": return <Tiles items={b.items} c={c} />;
    case "bars": return <Bars b={b} c={c} />;
    case "map": return <MapBlock b={b} c={c} h={room} />;
    case "icons": return <Icons b={b} c={c} room={room} />;
    case "scale": return <Scale b={b} c={c} room={room} />;
    case "receipt": return <Receipt b={b} c={c} />;
    case "forecast": return <Forecast b={b} c={c} />;
    case "list": return <List b={b} c={c} limit={Math.max(2, Math.floor(room / (lineH * 1.6)))} />;
    case "grid": return <Grid b={b} c={c} limit={Math.max(3, Math.floor(room / lineH) - 1)} />;
    case "phone": return <Phone b={b} c={c} />;
    case "quote": return <Quote b={b} c={c} />;
    case "countdown": return <Countdown b={b} c={c} />;
    case "qr": return null;
  }
}

/**
 * The source line, shortened for the square card: each document's name cut at its first comma or
 * bracket, but its tier always kept, so the square card loses detail, never a tier label.
 */
export function compactSource(text: string): string {
  if (!text) return text;
  const body = text.replace(/^Source: /, "").replace(/\.$/, "");
  const parts = body.split("; ").map((part) => {
    if (!part.includes(" · ")) return part.replace("shares and totals calculated by the site from these sources", "calculated by the site");
    const [name, ...rest] = part.split(" · ");
    const tier = rest.join(" · ");
    const short = name.length > 46 ? name.split(/,| \(/)[0].slice(0, 46) : name;
    return tier ? `${short} · ${tier}` : short;
  });
  return `Source: ${parts.join("; ")}.`;
}

/* ------------------------------------------------------------------------------- the card */

export function CardImage({ model, format, W, H, qrSvg, link }: { model: CardModel; format: CardFormat; W: number; H: number; qrSvg: string; link: string }) {
  const s = W / 1080;
  const dense = format === "square";
  const c: Ctx = { s, W, H, format, dense };
  const pad = 64 * s;
  const full = model.source ?? sourceLine(model.figures);
  const source = dense ? compactSource(full) : full;
  const isQr = model.blocks.some((b) => b.kind === "qr");
  const footH = (isQr ? 260 : dense ? 300 : 440) * s;
  const headH = (format === "square" ? 230 : 280) * s;
  const room = H - pad * 2 - headH - footH;
  return (
    <div style={{ display: "flex", flexDirection: "column", width: W, height: H, padding: pad, backgroundColor: C.paper, fontFamily: "Display", color: C.ink }}>
      <Col style={{ gap: 14 * s }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Row style={{ gap: 16 * s, alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: MIN * s, fontWeight: 800, color: C.earth, letterSpacing: 2 * s, textTransform: "uppercase" }}>{model.kicker}</div>
            {model.illustrative ? <div style={{ display: "flex", fontSize: MIN * s, color: C.muted, padding: `${4 * s}px ${14 * s}px`, border: `${2 * s}px dashed ${C.muted}`, borderRadius: 999 }}>Illustrative</div> : null}
          </Row>
          {model.page ? <div style={{ display: "flex", fontSize: 34 * s, fontWeight: 800, color: C.ink }}>{model.page}</div> : null}
        </Row>
        <div style={{ display: "flex", fontSize: (model.title.length > 60 ? 52 : 64) * s, fontWeight: 800, color: C.ink, lineHeight: 1.12, letterSpacing: -0.5 * s }}>{model.title}</div>
      </Col>

      <Col style={{ flex: 1, gap: 30 * s, marginTop: 36 * s, overflow: "hidden" }}>
        {isQr ? (
          <Col style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 24 * s }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUri(qrSvg)} width={Math.min(W - pad * 2, room) * 0.82} height={Math.min(W - pad * 2, room) * 0.82} alt="" />
            <div style={{ display: "flex", fontSize: 44 * s, fontWeight: 800 }}>{(model.blocks.find((b) => b.kind === "qr") as Extract<Block, { kind: "qr" }>).caption}</div>
          </Col>
        ) : (
          // A map takes most of the body; other blocks share what is left.
          // The square card drops a block its numbers already carry: the ward's bars repeat its side figures.
          model.blocks.filter((b) => !(dense && model.type === "ward" && b.kind === "bars")).map((b, i) => {
            const big = model.blocks.filter((x) => x.kind === "map" || x.kind === "scale").length;
            const share = model.blocks.length === 1 ? 1 : b.kind === "map" || b.kind === "scale" ? 0.68 : (big ? 0.32 : 1) / (model.blocks.length - big);
            return <BlockView key={i} b={b} c={c} room={room * share} />;
          })
        )}
      </Col>

      <Col style={{ gap: 14 * s, paddingTop: 22 * s, marginTop: 18 * s, borderTop: `${3 * s}px solid ${C.line}` }}>
        {/* The source runs the full width, so every document and its tier fit. */}
        {source ? <div style={{ display: "flex", fontSize: MIN * s, color: C.muted, lineHeight: 1.3, maxHeight: MIN * s * 1.3 * (dense ? 3 : 5), overflow: "hidden" }}>{source}</div> : null}
        <Row style={{ gap: 24 * s, alignItems: "center", justifyContent: "space-between" }}>
          <Col style={{ flex: 1, minWidth: 0, gap: 4 * s, fontSize: MIN * s }}>
            <div style={{ display: "flex", fontWeight: 800, color: C.ink }}>Built by Firefly Management</div>
            <div style={{ display: "flex", flexWrap: "wrap", color: C.accent, fontWeight: 700, wordBreak: "break-all" }}>{link}</div>
          </Col>
          {!isQr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUri(qrSvg)} width={(dense ? 170 : 220) * s} height={(dense ? 170 : 220) * s} alt="" style={{ flexShrink: 0, backgroundColor: C.card, borderRadius: 12 * s }} />
          ) : null}
        </Row>
      </Col>
    </div>
  );
}
