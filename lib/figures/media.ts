/**
 * The gatekeeper-bypass architecture: four ways the campaign reaches voters without a commercial
 * station's permission (Media). The station roster and the "hostile stations" diagram this file
 * once carried were retired with their figures (consolidation pass, Step 3); who owns which
 * station is data/media-ownership.ts, the map the proposal says governs.
 */
import { regFmt } from "./from-registry";

/**
 * §4.5.6's four bypass pillars, at both the levels the document states them.
 *
 * §2.8.3 named the four routes in four lines and pointed at §4.5.6 for the protocol; §4.5.6 gave the
 * protocol in a table of its own. Both blocks are retired, so both levels live here: `summary` is
 * §2.8.3's line and `detail` is §4.5.6's cell, transcribed. The §2.8.3 figure prints the summary and
 * says where the full version is, exactly as the block it replaced did; the §4.5.6 figure prints
 * the protocol. Flattening them into one would either lose §4.5.6's operational detail or move it
 * four chapters earlier than the document puts it.
 */
export const BYPASS_PILLARS = [
  {
    label: "Faith-based, diocesan and community radio",
    summary: "Neutral and church-owned stations \u2014 Wikwatyo, Mang'elete, County FM",
    detail:
      "Direct media buying and civic issue programming on Radio Wikwatyo (Seventh-Day Adventist, Kitui), " +
      "County FM and Mang'elete. These stations hold the highest qualitative credibility among rural women, " +
      "church elders and farming chamas; strictly neutral and immune to commercial political vetoes.",
  },
  {
    label: `Direct 2G bulk SMS and USSD, to up to ${regFmt("reach.sms-only")} phone owners not online`,
    summary: "Zero-rated interactive USSD gateway (*[shortcode]#)",
    detail:
      "Deployment of the 2G SMS Engine (1.5M messages) and the zero-rated USSD gateway (*[shortcode]#) via " +
      "Africa's Talking. Bypasses radio entirely by landing 160-character localised policy alerts directly " +
      "onto voters' feature phones within minutes.",
  },
  {
    label: "8-sub-county mobile PA sound truck and caravan fleet",
    summary: "High-density market centre caravans",
    detail:
      "Daily deployment of 8 branded sound PA caravans across all major market centres \u2014 Nguni, Tseikuru, " +
      "Mutomo, Kabati, Migwani, Ikutha. Broadcasts 90-second benga audio jingles, verified candidate policy " +
      "addresses and live Q&A sessions directly to market crowds.",
  },
  {
    label: "Ward captain megaphone and WhatsApp audio network",
    summary: "Grassroots baraza audio \u2014 pre-loaded megaphones and WhatsApp voice",
    detail:
      "400 ward captains equipped with high-output portable megaphones and pre-loaded USB memory sticks " +
      "containing 45-second Kikamba policy tracks. Direct dispatch of Kikamba audio notes across 180+ local " +
      "WhatsApp groups for organic peer-to-peer sharing among teachers, youth and traders.",
  },
];
