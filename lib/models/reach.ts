/**
 * Reach by channel: who a channel mix can reach, and who it cannot. Pure arithmetic, no imports.
 *
 * The register splits into three layers by connectivity, from two published rates:
 *   data layer       internet users                         (internet rate)
 *   SMS-only layer   phone owners without internet          (phone rate − internet rate)
 *   offline layer    no phone                               (100 − phone rate)
 * Each channel can reach only some layers: social and WhatsApp the data layer; SMS and USSD every
 * phone owner; radio and ground work everyone. Within the layers it can reach, a channel reaches
 * the share the user assumes. Channels are treated as independent, so a voter in a layer is missed
 * only when every channel in the mix that can reach that layer misses them:
 *   reached share of a layer = 1 − Π (1 − assumed reach) over the channels that reach it.
 * The rates are county-wide; no ward-level connectivity data exists, so every constituency gets
 * the same split.
 */

export type LayerKey = "data" | "smsOnly" | "offline";
export type ChannelKey = "social" | "sms" | "radio" | "ground";
export type ChannelSetting = { on: boolean; reach: number };
export type Mix = Record<ChannelKey, ChannelSetting>;

export const LAYERS: { key: LayerKey; label: string }[] = [
  { key: "data", label: "Internet users" },
  { key: "smsOnly", label: "Phone, no internet" },
  { key: "offline", label: "No phone" },
];

export const CHANNELS: { key: ChannelKey; label: string; reaches: LayerKey[]; note: string }[] = [
  { key: "social", label: "Social media and WhatsApp", reaches: ["data"], note: "Needs a phone with internet" },
  { key: "sms", label: "SMS and USSD", reaches: ["data", "smsOnly"], note: "Any phone, with or without internet" },
  { key: "radio", label: "Radio", reaches: ["data", "smsOnly", "offline"], note: "No Kitui listenership data exists: the reach is your assumption" },
  { key: "ground", label: "Ground work: barazas, markets, door to door", reaches: ["data", "smsOnly", "offline"], note: "Limited by people and days, not by phones" },
];

/** Layer shares of the register, in percent, from the internet and phone-ownership rates. */
export function layerShares(internetPct: number, phonePct: number): Record<LayerKey, number> {
  return { data: internetPct, smsOnly: Math.max(0, phonePct - internetPct), offline: Math.max(0, 100 - phonePct) };
}

const unit = (pct: number) => Math.min(1, Math.max(0, (Number.isFinite(pct) ? pct : 0) / 100));

/** The share of each layer the mix reaches, 0–1. */
export function layerReach(mix: Mix): Record<LayerKey, number> {
  const out = { data: 0, smsOnly: 0, offline: 0 } as Record<LayerKey, number>;
  for (const l of LAYERS) {
    let missed = 1;
    for (const c of CHANNELS) if (mix[c.key].on && c.reaches.includes(l.key)) missed *= 1 - unit(mix[c.key].reach);
    out[l.key] = 1 - missed;
  }
  return out;
}

export type ReachRow = { code: string; name: string; voters: number; reached: number; missed: number; byLayer: Record<LayerKey, { voters: number; reached: number }> };

export function reachByConstituency(rows: { code: string; name: string; voters: number }[], shares: Record<LayerKey, number>, mix: Mix): ReachRow[] {
  const r = layerReach(mix);
  return rows.map((c) => {
    const byLayer = Object.fromEntries(LAYERS.map((l) => {
      const v = (c.voters * shares[l.key]) / 100;
      return [l.key, { voters: v, reached: v * r[l.key] }];
    })) as ReachRow["byLayer"];
    const reached = LAYERS.reduce((a, l) => a + byLayer[l.key].reached, 0);
    return { code: c.code, name: c.name, voters: c.voters, reached, missed: c.voters - reached, byLayer };
  });
}
