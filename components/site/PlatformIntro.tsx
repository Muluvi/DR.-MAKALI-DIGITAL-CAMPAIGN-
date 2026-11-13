/**
 * Platform introduction shown before the campaign opening narrative.
 * Explains what the site is, the five stages, tools, audiences, navigation and limits.
 * Server component only — no client state required.
 */

const STAGES = [
  {
    id: "data",
    label: "Data",
    purpose: "Establish the information base",
    body: "Available datasets, ward information, public records, county and electoral information, source references and documented data gaps.",
    links: [
      { href: "#kitui", label: "County in numbers" },
      { href: "#votes", label: "How Kitui voted" },
      { href: "#dashboards", label: "Dashboards" },
      { href: "#explore", label: "Data explorer" },
      { href: "#sources", label: "Sources & gaps" },
    ],
  },
  {
    id: "analysis",
    label: "Analysis",
    purpose: "Examine the available evidence",
    body: "Analytical chapters, interpretation of the race and record, and interactive models for testing assumptions and exploring scenarios.",
    links: [
      { href: "#race", label: "The race for 2027" },
      { href: "#record", label: "Record and reach" },
      { href: "#diagnosis", label: "The diagnosis" },
      { href: "#ward-priority", label: "Ward priority model" },
    ],
  },
  {
    id: "objectives",
    label: "Objectives",
    purpose: "Document intended outcomes",
    body: "Translates analysis into defined priorities and measurable planning considerations for the nomination and the general election.",
    links: [
      { href: "#goal", label: "The goal" },
      { href: "#winning-number", label: "Winning-number model" },
    ],
  },
  {
    id: "strategies",
    label: "Strategies",
    purpose: "Document approaches and considerations",
    body: "Positioning, message architecture, audience segments, channels and language choices that inform the plan.",
    links: [
      { href: "#position", label: "The position" },
      { href: "#message", label: "The message" },
      { href: "#channels", label: "Channels & language" },
      { href: "#brief-mix", label: "Weekly brief mix" },
    ],
  },
  {
    id: "implementation",
    label: "Implementation",
    purpose: "Organise execution considerations",
    body: "Workstreams, timelines, rollout planning, operational resources, compliance, measurement and risk considerations.",
    links: [
      { href: "#timeline", label: "Timeline" },
      { href: "#rollout", label: "Rollout planner" },
      { href: "#workstreams", label: "Workstreams" },
      { href: "#lawful", label: "Lawful & ethical" },
    ],
  },
] as const;

const FEATURE_GROUPS = [
  {
    title: "Research and information resources",
    items: [
      { name: "Ward dossier", href: "#ward-dossier", use: "Browse ward-level context in one place to support local discussion and planning." },
      { name: "Service-delivery tracker", href: "#projects-register", use: "Review documented projects and service-delivery information tied to county needs." },
      { name: "Data explorer", href: "#explore", use: "Search, filter, sort and download the datasets that underpin the site." },
      { name: "Data dashboards", href: "#dashboards", use: "View register, project and analysis charts together with a turnout scenario." },
      { name: "Record finder", href: "#record-finder", use: "Locate documented items from the candidate’s public record." },
      { name: "Sources and data gaps", href: "#sources", use: "See provenance, retrieval dates and what is still missing or unverified." },
      { name: "Research chapters", href: "#data", use: "Read the structured chapters that organise county, vote, needs and media information." },
    ],
  },
  {
    title: "Data analysis and scenario tools",
    items: [
      { name: "Winning-number model", href: "#winning-number", use: "Explore the arithmetic of votes needed under different turnout and share assumptions. Outputs are scenarios, not forecasts." },
      { name: "Ward-priority model", href: "#ward-priority", use: "Examine relative priority signals across wards for planning discussion." },
      { name: "Register–turnout scenario", href: "#register-turnout", use: "Adjust turnout assumptions against the 2022 register to see illustrative vote ranges." },
      { name: "Polling-agent coverage model", href: "#polling-agents", use: "Model coverage of polling stations under different agent allocation choices." },
      { name: "Reach-by-channel model", href: "#reach-by-channel", use: "Compare illustrative reach across channels given offline and online population shares." },
    ],
  },
  {
    title: "Communications and operational resources",
    items: [
      { name: "Weekly brief mix", href: "#brief-mix", use: "Explore a weekly content mix across themes and formats for planning purposes." },
      { name: "Phone mockup (WhatsApp / SMS / USSD)", href: "#phone-mockup", use: "See how offline-first channels can be structured. Demonstrations only — no live messages are sent." },
      { name: "Send check", href: "#send-check", use: "Walk through a pre-send compliance checklist for messaging work." },
      { name: "Response-tier model", href: "#response-tier", use: "Map response severity to escalation and holding-line considerations." },
      { name: "Governor race calendar", href: "#race-calendar", use: "View key dates on the path to August 2027." },
      { name: "Nomination path", href: "#nomination-path", use: "See the high-level steps toward a party nomination." },
    ],
  },
  {
    title: "Planning and implementation resources",
    items: [
      { name: "Rollout planner", href: "#rollout-planner", use: "Explore a staged approach to reaching the 40 wards." },
      { name: "Workstreams", href: "#workstreams", use: "Review the fourteen workstreams, ownership and reporting cadence." },
      { name: "Implementation timeline", href: "#timeline", use: "Place phases against the electoral calendar." },
      { name: "Measurement resources", href: "#success", use: "Distinguish outcomes that count from vanity metrics." },
      { name: "Compliance and ethics", href: "#lawful", use: "Data-protection, charter and IEBC clearance considerations." },
      { name: "Risk and response", href: "#response", use: "Documented risks and a rehearsed response framework." },
      { name: "Technology notes", href: "#annex-technology", use: "Reference architecture and voter-model dictionary for the platform." },
    ],
  },
] as const;

const AUDIENCES = [
  {
    title: "Campaign leadership",
    body: "A central reference for the research base, documented priorities, planning framework and implementation resources.",
  },
  {
    title: "Research and data teams",
    body: "A workspace for examining datasets, references, source documentation, dashboards and information gaps.",
  },
  {
    title: "Planning and coordination teams",
    body: "Access to planning chapters, timelines, workstreams and exploratory tools in one place.",
  },
  {
    title: "Communications and operations teams",
    body: "Communications demonstrations, operational checklists and documented process considerations.",
  },
  {
    title: "Ward and constituency teams",
    body: "Ward-level information and related resources, subject to the verification status and gaps noted in the data.",
  },
  {
    title: "Researchers and interested readers",
    body: "An organised view of the platform’s information architecture, sources and documented planning approach.",
  },
] as const;

const STEPS = [
  { n: 1, text: "Start with this platform overview to understand scope, stages and tools." },
  { n: 2, text: "Explore the Data section for county, vote, needs and media information, then use dashboards and the data explorer." },
  { n: 3, text: "Move to Analysis to examine the race, record and diagnosis, and to try the interactive models." },
  { n: 4, text: "Review Objectives for documented priorities and the winning-number arithmetic." },
  { n: 5, text: "Explore Strategies for positioning, message, audiences, channels and language." },
  { n: 6, text: "Proceed to Implementation for workstreams, timelines, rollout, compliance and risk." },
  { n: 7, text: "Use dashboards and interactive tools where they sit beside the relevant chapters." },
  { n: 8, text: "Consult Sources and data gaps whenever you interpret figures or model outputs." },
] as const;

export function PlatformIntro() {
  return (
    <section id="platform" className="platform-intro" aria-labelledby="platform-title">
      {/* Hero */}
      <div className="platform-hero">
        <p className="kicker">Dr. Makali Digital Campaign Platform · Kitui 2027</p>
        <h1 id="platform-title" className="h1" style={{ marginTop: 10 }}>
          A Digital Research, Data and Planning Platform for Kitui 2027
        </h1>
        <p className="lede" style={{ marginTop: 14 }}>
          An integrated digital workspace bringing together research, public information, data analysis, strategic planning and implementation resources for the 2027 Kitui gubernatorial campaign.
        </p>
        <p className="platform-lead">
          The platform organises the information, analysis, objectives, documented strategies and implementation resources behind the campaign’s planning process. It enables authorised users and interested readers to explore available evidence, examine data, interact with analytical tools and navigate the different components of the platform from one central location.
        </p>
        <div className="platform-cta" role="group" aria-label="Primary destinations">
          <a className="btn btn-solid" href="#platform-overview">Explore the Platform</a>
          <a className="btn" href="#data">Explore Data and Research</a>
          <a className="btn" href="#dashboards">View Dashboards</a>
          <a className="btn" href="#implementation">Explore Planning and Implementation</a>
        </div>
      </div>

      {/* What is the platform */}
      <div id="platform-overview" className="platform-block">
        <h2 className="h2">What is the Dr. Makali Digital Campaign Platform?</h2>
        <p className="lede">
          A structured digital environment that consolidates research, information, data, analytical resources, planning tools and documentation into one accessible place.
        </p>
        <p>
          Content is organised into five stages — Data, Analysis, Objectives, Strategies and Implementation — so readers can move from the information base through examination of evidence, documented priorities and approaches, to execution considerations. Interactive tools sit beside the chapters they support. Every figure names its source; models run in the browser and keep nothing once the page is refreshed.
        </p>
      </div>

      {/* Five stages */}
      <div className="platform-block" aria-labelledby="stages-title">
        <h2 id="stages-title" className="h2">Five-stage platform architecture</h2>
        <p className="lede">Each stage has a clear purpose. Use the links to jump to the relevant chapters and tools.</p>
        <ol className="stage-cards">
          {STAGES.map((s, i) => (
            <li key={s.id} className="stage-card">
              <p className="stage-card-num">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="h3">
                <a href={`#${s.id}`}>{s.label}</a>
              </h3>
              <p className="stage-card-purpose">{s.purpose}</p>
              <p className="small muted">{s.body}</p>
              <ul className="stage-card-links">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      {/* Feature directory */}
      <div className="platform-block" aria-labelledby="features-title">
        <h2 id="features-title" className="h2">Feature directory</h2>
        <p className="lede">What each tool and resource does, and why it is useful. All links open the live section on this page.</p>
        <div className="feature-groups">
          {FEATURE_GROUPS.map((g) => (
            <div key={g.title} className="feature-group">
              <h3 className="h3">{g.title}</h3>
              <ul className="feature-list">
                {g.items.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="feature-name">{item.name}</a>
                    <p className="small muted">{item.use}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Who can use */}
      <div className="platform-block" aria-labelledby="audiences-title">
        <h2 id="audiences-title" className="h2">Who can use this platform?</h2>
        <p className="lede">The site is a public research and planning reference. Access is not role-gated; usefulness depends on the reader’s task.</p>
        <ul className="audience-cards">
          {AUDIENCES.map((a) => (
            <li key={a.title} className="audience-card">
              <h3 className="h3">{a.title}</h3>
              <p className="small muted">{a.body}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* How to navigate */}
      <div className="platform-block" aria-labelledby="how-title">
        <h2 id="how-title" className="h2">How to navigate the platform</h2>
        <ol className="nav-steps">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="nav-step-n" aria-hidden="true">{s.n}</span>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
        <p className="small muted" style={{ marginTop: 16 }}>
          The sticky navigation at the top lists the five stages. On smaller screens it collapses into a menu. Use the skip link or the stage links to move directly to content.
        </p>
      </div>

      {/* Scope and limitations */}
      <div className="platform-block platform-limits" aria-labelledby="limits-title">
        <h2 id="limits-title" className="h2">What this platform is — and what it is not</h2>
        <p className="lede">Transparency about capability builds trust. The following reflects the actual implementation.</p>
        <div className="limits-grid">
          <div>
            <h3 className="h3">What it is</h3>
            <ul>
              <li>A research, information, documentation and browser-based planning environment.</li>
              <li>A single-page workspace of chapters, dashboards and interactive models.</li>
              <li>A place where figures name their sources and data gaps are listed openly.</li>
              <li>Tools that run in the reader’s browser for exploratory analysis and demonstration.</li>
            </ul>
          </div>
          <div>
            <h3 className="h3">What it is not</h3>
            <ul>
              <li>Not a live CRM, task system or field-reporting platform.</li>
              <li>Not a voter-registration database or voter-file targeting system.</li>
              <li>Not a live SMS, WhatsApp or USSD dispatch gateway — phone interfaces are demonstrations only.</li>
              <li>Not a shared multi-user workspace: inputs are local to the browser and reset on refresh.</li>
              <li>Not a source of election results, forecasts or guaranteed outcomes — model outputs are scenarios only.</li>
            </ul>
          </div>
        </div>
        <p className="small muted" style={{ marginTop: 14 }}>
          Interpret every figure with its source, date, methodology and verification status. Data downloads are generated for local use. No claim is made about data freshness beyond the retrieval dates stated in Sources and data gaps.
        </p>
      </div>

      <p className="platform-continue">
        <a className="btn btn-solid" href="#opening">Continue to the campaign narrative</a>
      </p>
    </section>
  );
}
