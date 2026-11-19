import { BellRing } from "lucide-react";

import { NOMINATION_KPIS } from "../../data/kpis";
import { PILLARS } from "../../data/message-architecture";
import { USSD_MENU, USSD_SHORTCODE_PLACEHOLDER } from "../../data/ussd-specimen";
import { resolveFigure, type ResolvedFigure } from "../../lib/card/spec";
import { IDENTITY, YOUTUBE } from "../../lib/phone-showcase";
import { KituiIcon } from "../icons/kitui";
import { ExportableVisual } from "../visual/ExportableVisual";
import { TvSet, Watch } from "./Frames";

/**
 * Scenes for the offline and earned-media chapters (visual upgrade, B2, B4, B6, B7, B10).
 *
 * Every word on these screens and surfaces is copy the site already carries (the slogan, the
 * pledge, the pillars, the USSD menu, the YouTube feature's kicker) or a registry figure with its
 * tier. Nothing is a news story, an advert that ran, or a reading that exists. Each is labelled
 * illustrative where the reader looks first.
 */

/* ------------------------------------------------------------------------------- ticker */

/**
 * The latest figures in a slim strip (B10). It never scrolls by itself (MOTION-SYSTEM.md, the loop
 * budget): the reader swipes it, and every item carries its tier.
 */
export function FigureTicker({ figures, label }: { figures: ResolvedFigure[]; label: string }) {
  return (
    <div className="tk" role="region" aria-label={label} tabIndex={0}>
      <ul className="tk__list">
        {figures.map((f) => (
          <li key={f.id} className="tk__item">
            <span className="tk__v">{f.display}</span>
            <span className="tk__l">{f.label}</span>
            <span className="tk__p">{f.provenance}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The chapter tickers, each a fixed list of registry ids. */
const TICKERS: Record<string, { id: string; label: string }[]> = {
  votes: [
    { id: "register.2022", label: "registered, 2022" },
    { id: "register.2026", label: "registered, July 2026" },
    { id: "register.polling-stations", label: "polling stations" },
    { id: "turnout.2022", label: "turnout, 2022" },
    { id: "benchmark", label: "votes to win (benchmark)" },
  ],
  needs: [
    { id: "poverty.2021", label: "in poverty" },
    { id: "water.points.down.share", label: "water points not working" },
    { id: "ict.offline", label: "of residents offline" },
    { id: "census.population", label: "people, 2019 census" },
  ],
};

export function ChapterTicker({ chapter }: { chapter: keyof typeof TICKERS }) {
  return <FigureTicker label="The chapter's figures, swipe for more" figures={TICKERS[chapter].map((t) => resolveFigure(t))} />;
}

/* ------------------------------------------------------------------------------- TV */

/** A television interview as earned media would carry it (B2): a generic channel, his name and
 * office in the lower third, the record feature's own line, and a strip of registry figures. */
export function TvNews() {
  const figs = [
    resolveFigure({ id: "register.2022", label: "registered voters, 2022" }),
    resolveFigure({ id: "budget.pending-bills.2021", label: "county pending bills, FY2020/21", mod: "bn", prefix: "KSh ", suffix: "bn" }),
    resolveFigure({ id: "water.points.down.share", label: "of water points not working" }),
  ];
  return (
    <ExportableVisual
      id="tv-news"
      illustrative
      title="On air: how a studio interview would frame the record"
      note="A generic channel. His name and office in the lower third; the ticker carries only the site's own figures."
      figures={figs}
    >
      <TvSet label="Illustrative television screen: a studio interview with Dr. Makali Mulu">
        <div className="tv">
          <span className="tv__bug">COUNTY CHANNEL</span>
          <div className="tv__studio" aria-hidden="true">
            <span className="tv__guest">{IDENTITY.initials}</span>
          </div>
          <div className="tv__lower">
            <span className="tv__name">{IDENTITY.fullName}</span>
            <span className="tv__role">{IDENTITY.office}</span>
            <span className="tv__head">{YOUTUBE.thumbnailKicker.value}</span>
          </div>
          <div className="tv__ticker">
            <span className="tv__live">FIGURES</span>
            <span className="tv__run">
              {figs.map((f) => `${f.label}: ${f.display} (${f.provenance})`).join("  •  ")}
            </span>
          </div>
        </div>
      </TvSet>
    </ExportableVisual>
  );
}

/* ------------------------------------------------------------------------------- watch */

/** Monday's KPI alerts on a wrist (B4): each indicator, its target, and that no reading is in yet. */
export function KpiWatches() {
  const kpis = NOMINATION_KPIS.slice(0, 3);
  return (
    <ExportableVisual
      id="kpi-watch"
      illustrative
      title="Monday's KPI alerts, at a glance"
      note="The nomination-stage indicators as short alerts. A target shows; a reading shows only once the team has entered one."
      source="Source: the plan's nomination scorecard (targets, not results)."
    >
      <div className="kw">
        {kpis.map((k) => (
          <Watch key={k.code} label={`Illustrative watch alert: ${k.code}, ${k.title}`}>
            <div className="kw__face">
              <span className="kw__app"><BellRing size={12} aria-hidden="true" /> KPI · {k.cadence}</span>
              <span className="kw__code">{k.code}</span>
              <span className="kw__title">{k.title}</span>
              <span className="kw__target">{k.target}</span>
              <span className="kw__state">{k.baseline.kind === "measured" ? k.baseline.display : "No reading yet"}</span>
            </div>
          </Watch>
        ))}
      </div>
    </ExportableVisual>
  );
}

/* ------------------------------------------------------------------------------- billboard */

/** The slogan on a roadside billboard in an illustrated Kitui street (B6). */
export function Billboard() {
  return (
    <ExportableVisual
      id="billboard"
      illustrative
      title="Out on the road: the slogan where people wait, walk and ride"
      note="An illustrated street. The words are the campaign's slogan, in English and Kikamba, and the USSD menu's dial line."
      source="Source: the slogan as the plan's radio script prints it; the shortcode is not yet allocated."
    >
      <svg viewBox="0 0 640 360" className="bb" role="img" aria-label={`Illustrated Kitui street with a billboard: ${IDENTITY.slogan}. ${IDENTITY.sloganKikamba}.`}>
        <rect width="640" height="360" className="bb__sky" />
        <circle cx="560" cy="64" r="26" className="bb__sun" />
        <path d="M0 250 Q160 225 320 240 T640 232 V360 H0 Z" className="bb__hill" />
        {/* Acacia */}
        <path d="M70 252 V200 M70 214 L52 196 M70 206 L92 188" className="bb__trunk" />
        <ellipse cx="72" cy="186" rx="52" ry="14" className="bb__canopy" />
        {/* Dukas */}
        <g className="bb__shops">
          <rect x="410" y="196" width="80" height="58" /><rect x="494" y="206" width="70" height="48" />
          <rect x="420" y="222" width="18" height="32" className="bb__door" /><rect x="510" y="226" width="16" height="28" className="bb__door" />
        </g>
        {/* Billboard: drawn large, so its words read at phone width. */}
        <rect x="132" y="236" width="10" height="64" className="bb__post" /><rect x="498" y="236" width="10" height="64" className="bb__post" />
        <rect x="56" y="34" width="528" height="208" rx="6" className="bb__board" />
        <rect x="66" y="44" width="508" height="188" rx="3" className="bb__face" />
        <text x="320" y="98" textAnchor="middle" className="bb__t1">{IDENTITY.slogan}</text>
        <text x="320" y="138" textAnchor="middle" className="bb__t2">{IDENTITY.sloganKikamba}</text>
        <text x="320" y="182" textAnchor="middle" className="bb__t3">{IDENTITY.displayName} · Kitui 2027</text>
        <text x="320" y="212" textAnchor="middle" className="bb__t4">Dial {USSD_SHORTCODE_PLACEHOLDER} on any phone</text>
        {/* Road and a matatu */}
        <path d="M0 300 H640 V360 H0 Z" className="bb__road" />
        <path d="M20 330 H80 M140 330 H200 M260 330 H320 M380 330 H440 M500 330 H560" className="bb__lane" />
        <g transform="translate(440 268) scale(2.4)" className="bb__matatu"><KituiIcon name="matatu" size={24} /></g>
      </svg>
    </ExportableVisual>
  );
}

/* ------------------------------------------------------------------------------- print */

/** Offline messaging as it would print (B7): a folded leaflet, and a paid advert on a newspaper
 * page. The newspaper is generic and the advert is marked as one; there is no news article. */
export function PrintPieces() {
  return (
    <ExportableVisual
      id="print-pieces"
      illustrative
      title="On paper: a leaflet for the market, an advert for the paper"
      note="Every line is the campaign's own copy: the slogan, the three pillars, the USSD menu and the record feature's headline."
      source="Source: the plan's pillars, the USSD menu and the record feature, word for word."
    >
      <div className="pr">
        <article className="pr__leaflet" aria-label="Illustrative leaflet">
          <header className="pr__lhead">
            <span className="pr__name">{IDENTITY.displayName}</span>
            <span className="pr__slogan">{IDENTITY.slogan}</span>
            <span className="pr__kik">{IDENTITY.sloganKikamba}</span>
          </header>
          <ol className="pr__pillars">
            {PILLARS.map((p) => <li key={p.title}>{p.title}</li>)}
          </ol>
          <div className="pr__ussd">
            <span className="pr__k">No internet? Dial {USSD_SHORTCODE_PLACEHOLDER}</span>
            {USSD_MENU.slice(0, 5).map((o) => (
              <span key={o.key}>{o.key}. {o.kikamba ?? o.english}</span>
            ))}
          </div>
        </article>
        <article className="pr__paper" aria-label="Illustrative newspaper page with a paid advert">
          <header className="pr__mast">THE COUNTY PAPER</header>
          <div className="pr__cols" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => <span key={i} />)}
          </div>
          <div className="pr__ad">
            <span className="pr__adk">ADVERTISEMENT</span>
            <p className="pr__adt">{YOUTUBE.title.value}</p>
            <p className="pr__adsub">{YOUTUBE.thumbnailKicker.value}</p>
            <span className="pr__ads">{IDENTITY.displayName} · {IDENTITY.slogan}</span>
          </div>
        </article>
      </div>
    </ExportableVisual>
  );
}
