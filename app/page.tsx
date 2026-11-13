import fs from "node:fs";
import path from "node:path";
import { Nav } from "@/components/site/Nav";
import { ChapterLoader } from "@/components/site/ChapterLoader";
import { Island, type IslandName } from "@/components/site/Island";
import { PlatformIntro } from "@/components/site/PlatformIntro";
import { ChapterBody } from "@/components/story/ChapterBody";
import { STAGES, type Chapter } from "@/lib/story/stages";
import { compileChapter } from "@/lib/story/tokens";
import { PUBLIC_RETRIEVED, PUBLIC_SOURCES } from "@/lib/public-data";

/**
 * The whole site: one page, one story. Platform introduction first, then the campaign
 * opening narrative; each chapter, tool and dashboard loads as the reader nears it.
 */
export const dynamic = "force-static";

const read = (id: string) => fs.readFileSync(path.join(process.cwd(), "content", `${id}.md`), "utf8");

/** How tall a chapter will be on a phone, from its words and its figures, so its space is held. */
function estimate(source: string): number {
  const fences = source.match(/^```(figure|visual)/gm) ?? [];
  const prose = source.replace(/^```[\s\S]*?^```/gm, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.round(words * 3.9 + fences.length * 520 + 200);
}

/** The tools that sit beside the chapter whose data or strategy they act on. */
const AFTER: Record<string, { name: IslandName; reserve: number; label: string }[]> = {
  votes: [{ name: "ward-dossier", reserve: 980, label: "The ward dossier" }],
  needs: [{ name: "projects-register", reserve: 1100, label: "The service-delivery tracker" }],
  news: [{ name: "phone-mockup", reserve: 900, label: "The WhatsApp and USSD phone" }],
  race: [{ name: "race-calendar", reserve: 1100, label: "The race calendar" }],
  record: [{ name: "record-finder", reserve: 900, label: "The record finder" }],
  diagnosis: [{ name: "ward-priority", reserve: 1300, label: "The ward priority model" }],
  goal: [{ name: "winning-number", reserve: 1400, label: "The winning-number model" }],
  message: [{ name: "brief-mix", reserve: 1200, label: "The weekly brief mix model" }],
  channels: [{ name: "reach-by-channel", reserve: 1200, label: "The reach-by-channel model" }],
  timeline: [{ name: "nomination-path", reserve: 900, label: "The nomination path" }],
  rollout: [{ name: "rollout-planner", reserve: 1300, label: "The rollout planner" }],
  workstreams: [{ name: "polling-agents", reserve: 1300, label: "The polling-agent model" }],
  lawful: [{ name: "send-check", reserve: 1000, label: "The send check" }],
  response: [{ name: "response-tier", reserve: 1100, label: "The response-tier model" }],
};

const GAPS: [string, string][] = [
  ["Ward and station-level election results", "Not held. Request them from the IEBC Kitui office, or use the campaign's 2022 agent copies."],
  ["2013 and 2017 Kitui results by office", "Not yet collected from a primary source."],
  ["Agents allowed per polling station", "Check the current Elections (General) Regulations."],
  ["Governor nomination paperwork and qualifications", "Check current regulations and IEBC guidance."],
  ["Wiper's 2027 nomination rules", "Not found publicly. Obtain them from the party or the Registrar of Political Parties."],
  ["Ward-level register after 2022", "Not published. Every ward voter figure is from 2022."],
  ["Political SMS guidelines", "The 2017 text is the latest found. Confirm it is current with the Communications Authority."],
];

/** The figures a chapter draws, so a link to one can load its chapter first. */
const figureIds = (source: string) => [...source.matchAll(/^```figure\s*\nid:\s*([a-z0-9-]+)/gm)].map((m) => m[1]);

function ChapterSection({ chapter }: { chapter: Chapter }) {
  const source = read(chapter.id);
  const est = estimate(source);
  return (
    <section id={chapter.id} className="chapter" aria-labelledby={`${chapter.id}-title`}>
      <header className="chapter-head measure">
        <h3 id={`${chapter.id}-title`} className="h2">{chapter.title}</h3>
        <p className="lede">{chapter.summary}</p>
      </header>
      <ChapterLoader id={chapter.id} est={est} ids={figureIds(source)} />
      {(AFTER[chapter.id] ?? []).map((t) => <Island key={t.name} {...t} />)}
    </section>
  );
}

function Sources() {
  const day = new Date(`${PUBLIC_RETRIEVED}T00:00:00+03:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi" });
  return (
    <section id="sources" className="chapter" aria-labelledby="sources-title">
      <header className="chapter-head measure">
        <h3 id="sources-title" className="h2">Sources and data gaps</h3>
        <p className="lede">Where the election data comes from, and what is still missing. The data pack was retrieved on {day}.</p>
      </header>
      <div className="prose">
        <ul>
          {Object.values(PUBLIC_SOURCES).map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>)}
        </ul>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Data gaps">
          <table>
            <thead><tr><th scope="col">What is missing</th><th scope="col">How to close it</th></tr></thead>
            <tbody>{GAPS.map(([g, d]) => <tr key={g}><th scope="row">{g}</th><td>{d}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const items = [
    { id: "platform", label: "Platform" },
    ...STAGES.map((s) => ({ id: s.id, label: s.label })),
  ];
  return (
    <>
      <a className="skip" href="#platform">Skip to platform overview</a>
      <header className="site-head">
        <div className="wrap">
          <a className="brand" href="#top">Kitui 2027</a>
          <Nav items={items} />
        </div>
      </header>

      <main id="top" className="wrap">
        <PlatformIntro />

        <section id="opening" className="opening" aria-labelledby="opening-title">
          <p className="kicker">Hon. Dr. Makali Mulu · Kitui governor, 10 August 2027</p>
          <h1 id="opening-title" className="h1" style={{ marginTop: 10 }}>Close the recognition gap outside Kitui Central</h1>
          <p className="lede" style={{ marginTop: 14 }}>The data, the analysis, the objectives, the strategies and the plan, in one story.</p>
          <div style={{ marginTop: 20 }}>
            <ChapterBody id="opening" source={compileChapter(read("brief"), "content/brief.md")} />
          </div>
        </section>

        {STAGES.map((stage) => (
          <section key={stage.id} id={stage.id} className="stage" aria-labelledby={`${stage.id}-stage`}>
            <header className="stage-head">
              <p className="kicker">{stage.label}</p>
              <h2 id={`${stage.id}-stage`} className="h1">{stage.question}</h2>
            </header>
            {stage.chapters.map((c) => <ChapterSection key={c.id} chapter={c} />)}
            {stage.id === "data" && (
              <>
                <section id="dashboards" className="chapter" aria-labelledby="dashboards-title">
                  <header className="chapter-head measure">
                    <h3 id="dashboards-title" className="h2">Data dashboards</h3>
                    <p className="lede">The register, the county&rsquo;s projects and every analysis chart, with a turnout scenario on the register.</p>
                  </header>
                  <Island name="register-turnout" reserve={900} label="The turnout scenario" />
                  <ChapterLoader id="dashboards" est={5200} />
                </section>
                <section id="explore" className="chapter" aria-labelledby="explore-title">
                  <header className="chapter-head measure">
                    <h3 id="explore-title" className="h2">Explore the data</h3>
                    <p className="lede">Every dataset behind the site: search, filter, sort and download.</p>
                  </header>
                  <Island name="data-explorer" reserve={1000} label="The data explorer" />
                </section>
                <Sources />
              </>
            )}
          </section>
        ))}
      </main>

      <footer className="wrap" style={{ padding: "40px 16px 56px", borderTop: "1px solid var(--line)", marginTop: 48 }}>
        <p className="small muted" style={{ margin: 0 }}>Kitui 2027. Prepared for Hon. Dr. Makali Mulu&rsquo;s campaign team by Firefly Management. Every figure names its source; the models run in your browser and keep nothing once the page is refreshed.</p>
      </footer>
    </>
  );
}
