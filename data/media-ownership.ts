// Phase 5d — media ownership map. Formalises the station list already carried in Section
// 17A.1's ownership table with explicit tiers, per the source-discipline rule that ownership
// claims are Tier 2/3 and must be labelled as such.
//
// No listenership or audience-reach figures were supplied by the research pass — "radio
// listenership figures" is itself a named row in the Data Gaps Register (Appendix C). The
// `reachTier` below is a qualitative 1–3 reading of §3.7.1's own "Campaign posture"
// column (Priority / party-sensitive / Secondary), the same treatment already used for the
// competitive-field quadrant chart's qualitative credibility axis — it is not measured data and
// is never rendered with the visual authority of a Tier 1 figure.
import type { Source } from "./types";
import { LOCAL_DIGITAL_MEDIA_OWNERSHIP } from "./sources";

const ROYAL_MEDIA: Source = { name: "Royal Media Services corporate ownership (public record)", publicationDate: "2026", tier: 2 };
const SDA_CHURCH: Source = { name: "Seventh-Day Adventist Church, Kitui (publicly known denominational ownership)", publicationDate: "2026", tier: 2 };
const KBC_STATE: Source = { name: "Kenya Broadcasting Corporation, state ownership (public record)", publicationDate: "2026", tier: 2 };
const INDEPENDENT_LAUNCH: Source = { name: "Reported independent ownership, launched 2023", publicationDate: "2023", tier: 2 };

export interface RadioStation {
  name: string;
  /**
   * Frequency as publicly listed for the Kitui/Mwingi service area, or null where the Kitui
   * frequency is not published and only a Nairobi/Machakos one is. Tier 3 (aggregator listings);
   * the Communications Authority broadcast frequency register is the Tier 1 confirmation and is
   * a named data request in §15.1.
   */
  frequency: string | null;
  alignment: string;
  source: Source;
  reachTier: 1 | 2 | 3;
  reachLabel: string;
  posture: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    name: "Mbaitu FM",
    frequency: "100.4 (Mwingi & Kitui)",
    alignment: "Reported: associated with Charity Ngilu",
    source: LOCAL_DIGITAL_MEDIA_OWNERSHIP,
    reachTier: 3,
    reachLabel: "High (qualitative read — monitoring target)",
    posture: "Monitor closely; expect unfavourable framing; do not rely on placement.",
  },
  {
    name: "Syokimau FM",
    frequency: null,
    alignment: "Reported: associated with Charity Ngilu",
    source: LOCAL_DIGITAL_MEDIA_OWNERSHIP,
    reachTier: 2,
    reachLabel: "Medium (qualitative read — monitoring target)",
    posture: "As above.",
  },
  {
    name: "Athiani FM",
    frequency: "97.7 (Kitui)",
    alignment: "Reported: associated with Kalonzo Musyoka, Wiper leader",
    source: LOCAL_DIGITAL_MEDIA_OWNERSHIP,
    reachTier: 2,
    reachLabel: "Medium (qualitative read — party gatekeeper)",
    posture: "Party-aligned, not neutral. Coverage may track party leadership sentiment.",
  },
  {
    name: "Musyi FM",
    frequency: "102.2 (Nairobi/Machakos); Kitui frequency not published",
    alignment: "Royal Media Services (commercial)",
    source: ROYAL_MEDIA,
    reachTier: 3,
    reachLabel: "High (qualitative read — priority placement)",
    posture: "Priority — commercially independent, broad Ukambani reach.",
  },
  {
    name: "Wikwatyo FM",
    frequency: "Kitui; frequency not published",
    alignment: "Seventh-Day Adventist Church, Kitui-based",
    source: SDA_CHURCH,
    reachTier: 2,
    reachLabel: "Medium (qualitative read — priority for community programming)",
    posture: "Priority for community and service-delivery programming.",
  },
  {
    name: "Akamba FM",
    frequency: "100.8 (Nairobi)",
    alignment: "Independent, launched 2023",
    source: INDEPENDENT_LAUNCH,
    reachTier: 1,
    reachLabel: "Emerging (qualitative read — newer station)",
    posture: "Secondary — newer, may be more accessible.",
  },
  {
    name: "County FM",
    frequency: "90.3 (Kitui), 91.8 (Mwingi)",
    alignment: "Kitui-based independent",
    source: LOCAL_DIGITAL_MEDIA_OWNERSHIP,
    reachTier: 2,
    reachLabel: "Medium (qualitative read — priority placement)",
    posture: "Priority — the only station carrying separate Kitui and Mwingi frequencies.",
  },
  {
    name: "KBC Mwatu FM",
    frequency: "93.1 (Machakos)",
    alignment: "State-owned (Kenya Broadcasting Corporation)",
    source: KBC_STATE,
    reachTier: 1,
    reachLabel: "Low in Kitui (qualitative read — Machakos service area)",
    posture: "Secondary — state broadcaster, Machakos-centred, limited Kitui service.",
  },
];
