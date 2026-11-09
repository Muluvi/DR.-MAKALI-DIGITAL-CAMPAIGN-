"use client";

/**
 * The Campaigner Network in the story: the figures placed by ```figure fences in the chapters
 * (components/figures/registry.tsx). Each draws from the Act's reference data, the network's
 * configuration and, for live coverage, the open aggregate, which carries counts and states only.
 *
 * Nothing here is invented. While registration has not opened the figures say so and show what is
 * required, never an empty seat dressed as a measurement. Task, report and digest figures that only
 * Command and Dr. Makali may see live are drawn as their structure, with the numbers marked as
 * visible when signed in.
 */
import { useId, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { FieldSignal } from "./FieldSignal";

import { ACT_SOURCE, CONSTITUENCIES, VILLAGES, WARDS, WARD_MATCHES, WARD_BY_CODE, searchVillages, type Village } from "../../lib/network/reference";
import { LEVELS, ROLE_LABEL, seatsAt, spansOfControl, villageMinimum, fieldStructureMinimum, wardAverages, VILLAGE_MINIMUM } from "../../lib/network/structure";
import { GROUP_TYPES, GROUP_CHAIN } from "../../lib/network/groups";
import { SITE_OBJECTIVES } from "../../lib/network/objectives";
import { DEFAULT_TEMPLATES } from "../../lib/network/templates";
import { COVERAGE_STATES, type CoverageState, type PublicCoverage } from "../../lib/network/coverage";
import { CONSTITUENCY_BLOCKS, GRID, WARD_TILES } from "../../lib/geo/wards";
import { group } from "../../lib/data/format";
import { usePublicCoverage } from "./usePublicCoverage";
import { PhoneFrame } from "../phone/PhoneFrame";
import { ScreenShell } from "../phone/primitives";
import { BODY_H, BODY_W } from "../phone/device";

const REGISTER_SOURCE = "IEBC, Registered Voters per County Assembly Ward (2022)";

/* ------------------------------------------------------------------ shared pieces */

function Frame({ id, title, takeaway, sources, children, table, tableLabel }: { id: string; title: string; takeaway: string; sources: string[]; children: React.ReactNode; table?: React.ReactNode; tableLabel?: string }) {
  return (
    <figure id={id} className="rf not-prose nw-fig" aria-labelledby={`${id}-title`} aria-describedby={`${id}-takeaway`} data-figure={id}>
      <div className="rf-head">
        <h4 id={`${id}-title`} className="rf-title">{title}</h4>
      </div>
      <p id={`${id}-takeaway`} className="rf-takeaway">{takeaway}</p>
      <div className="rf-body">{children}</div>
      {table && (
        <div className="rf-foot rf-foot--data">
          <details className="rf-details print-open">
            <summary>View the data table</summary>
            <div className="rf-table-wrap" tabIndex={0} role="region" aria-label={tableLabel ?? `Data table: ${title}`}>{table}</div>
          </details>
        </div>
      )}
      <div className="rf-foot">
        <p className="rf-source">
          <span>Source:</span>
          {sources.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </p>
      </div>
    </figure>
  );
}

function LiveStatus({ data }: { data: PublicCoverage | null | undefined }) {
  if (data === undefined) return <p className="nw-status" aria-live="polite">Checking live coverage…</p>;
  if (data === null) return <p className="nw-status" aria-live="polite">Live coverage could not be reached. The seats required are shown.</p>;
  if (data.status === "not_recording")
    return (
      <p className="nw-status" aria-live="polite">
        <strong>Registration has not opened.</strong> Every seat is shown as required; gaps appear here as campaigners register.
      </p>
    );
  const t = new Date(data.generated_at);
  return (
    <p className="nw-status" aria-live="polite">
      <strong>Live.</strong> {group(data.county.filled_to_target)} of {group(data.county.required)} seats held at {t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" })} EAT. Counts only: no names.
    </p>
  );
}

function StateTag({ s }: { s: CoverageState }) {
  return <span className="nw-state" data-s={s}>{s}</span>;
}

const live = (d: PublicCoverage | null | undefined): d is PublicCoverage => !!d && d.status === "live";
const plural = (n: number, one: string, many: string) => `${group(n)} ${n === 1 ? one : many}`;

/* ------------------------------------------------------------------ Data: the units */

export function NetworkUnits() {
  const [q, setQ] = useState("");
  const hits = useMemo(() => (q.trim().length >= 2 ? searchVillages(q, [], 8) : []), [q]);
  const inputId = useId();
  return (
    <Frame
      id="network-units"
      title={`Kitui is organised into ${CONSTITUENCIES.length} constituencies, ${WARDS.length} wards and ${VILLAGES.length} villages`}
      takeaway="The network follows the county's own administrative units, so every campaigner has a village, every village a ward, and every ward a constituency."
      sources={[ACT_SOURCE]}
      table={
        <table className="rf-table">
          <thead><tr><th scope="col">Constituency</th><th scope="col" className="num">Wards</th><th scope="col" className="num">Villages</th></tr></thead>
          <tbody>
            {CONSTITUENCIES.map((c) => (
              <tr key={c}><th scope="row">{c}</th><td className="num">{WARDS.filter((w) => w.constituency === c).length}</td><td className="num">{VILLAGES.filter((v) => v.constituency === c).length}</td></tr>
            ))}
          </tbody>
        </table>
      }
    >
      <div className="nw-stats">
        <div className="nw-stat"><b>{CONSTITUENCIES.length}</b><span>constituencies</span></div>
        <div className="nw-stat"><b>{WARDS.length}</b><span>wards</span></div>
        <div className="nw-stat"><b>{VILLAGES.length}</b><span>villages</span></div>
      </div>
      <div className="nw-units" role="img" aria-label={`Each village as one mark, grouped by ward and constituency: ${CONSTITUENCIES.map((c) => `${c}, ${WARDS.filter((w) => w.constituency === c).length} wards and ${VILLAGES.filter((v) => v.constituency === c).length} villages`).join("; ")}.`}>
        {CONSTITUENCIES.map((c) => (
          <div key={c} className="nw-units-row">
            <span>{c}<small>{plural(VILLAGES.filter((v) => v.constituency === c).length, "village", "villages")}</small></span>
            <div className="nw-wardset">
              {WARDS.filter((w) => w.constituency === c).map((w) => (
                <span key={w.ward_code} className="nw-ward" title={`${w.ward}: ${plural(w.village_count, "village", "villages")}`}>
                  {Array.from({ length: w.village_count }, (_, i) => <i key={i} />)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="nw-search">
        <label htmlFor={inputId} className="rb-label !block">Find a village by name, part of a name, or a place inside it</label>
        <input id={inputId} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" placeholder="e.g. Kyanzai, Kwa-wewa, Mutanda" />
        {q.trim().length >= 2 && (
          <ul aria-live="polite">
            {hits.length ? hits.map((v) => (
              <li key={v.village_code}>{v.village_name} <small>· {v.ward} ward, {v.constituency} · village {v.village_code}</small></li>
            )) : <li><small>No village matches.</small></li>}
          </ul>
        )}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Analysis: seats, spans, gaps */

const SLUG_TO_CODE = new Map(WARD_MATCHES.map((m) => [`ward.${m.register_slug}`, m.act_ward_code]));
const AVG = new Map(wardAverages().map((a) => [a.ward_code, a]));
/** Five equal bands of 500 voters from 1,500: binning for the eye; every tile prints its own value. */
const AVG_BREAKS = [1, 2, 3, 4].map((i) => 1000 + 500 * i);
const AVG_LEGEND = [`under ${group(AVG_BREAKS[0])}`, ...AVG_BREAKS.slice(1).map((b, i) => `${group(AVG_BREAKS[i])}–${group(b - 1)}`), `${group(AVG_BREAKS[AVG_BREAKS.length - 1])} and over`];
const avgBin = (v: number) => 1 + AVG_BREAKS.filter((b) => v >= b).length;

/** A ward name as one line, or two when it will not fit a tile: split after a slash, else at the last space. */
function nameLines(name: string): string[] {
  if (name.length <= 11) return [name];
  const slash = name.indexOf("/");
  if (slash > 0) return [name.slice(0, slash + 1), name.slice(slash + 1)];
  const space = name.lastIndexOf(" ");
  return space > 0 ? [name.slice(0, space), name.slice(space + 1)] : [name];
}

function shareBin(held: number, required: number): number {
  if (!held) return 0;
  const s = held / required;
  return s >= 1 ? 5 : s >= 0.75 ? 4 : s >= 0.5 ? 3 : s >= 0.25 ? 2 : 1;
}

function WardHeatmap({ data }: { data: PublicCoverage | null | undefined }) {
  const [layer, setLayer] = useState<"gaps" | "avg">("gaps");
  const [picked, setPicked] = useState<number | null>(null);
  const T = 44, GAP = 3, ROW = T + 12;
  const W = GRID.cols * (T + GAP), H = GRID.rows * ROW + 12;
  const wardCov = new Map((data?.wards ?? []).map((w) => [w.ward_code, w]));
  const on = live(data);
  const required = (code: number) => 2 + (WARD_BY_CODE.get(code)?.village_count ?? 0) * VILLAGE_MINIMUM;
  const style = (code: number) => {
    if (layer === "avg") {
      const b = avgBin(AVG.get(code)!.average_per_village);
      return { fill: `var(--seq-${b})`, ink: b >= 3 ? "var(--seq-ink-dark)" : "var(--seq-ink-light)", label: `${(AVG.get(code)!.average_per_village / 1000).toFixed(1)}k`, dashed: false };
    }
    const c = wardCov.get(code);
    if (!on || !c) return { fill: "var(--card)", ink: "var(--ink)", label: String(required(code)), dashed: true };
    const b = shareBin(c.filled_to_target, c.required);
    return b === 0 ? { fill: "var(--card)", ink: "var(--ink)", label: `0/${c.required}`, dashed: true } : { fill: `var(--seq-${b})`, ink: b >= 3 ? "var(--seq-ink-dark)" : "var(--seq-ink-light)", label: `${c.filled_to_target}/${c.required}`, dashed: false };
  };
  const pickedRef = picked ? WARD_BY_CODE.get(picked) : null;
  const pickedCov = picked ? wardCov.get(picked) : null;
  return (
    <div className="nw-tm">
      <div className="nw-layers" role="group" aria-label="Map layer">
        <button type="button" className="nw-chip" aria-pressed={layer === "gaps"} onClick={() => setLayer("gaps")}>{on ? "Seats held" : "Seats required"}</button>
        <button type="button" className="nw-chip" aria-pressed={layer === "avg"} onClick={() => setLayer("avg")}>Voters per village (ward average, estimated)</button>
      </div>
      <svg viewBox={`-2 0 ${W + 4} ${H}`} role="group" aria-label={`Tile map of the 40 wards, schematic, not to scale. ${layer === "avg" ? "2022 registered voters divided by the ward's villages: a ward average, estimated, not a village figure." : on ? "Seats held against seats required in each ward." : "Seats required in each ward: two coordinators and two per village."} Select a ward for its figures.`}>
        {Object.entries(CONSTITUENCY_BLOCKS).map(([cid, b]) => (
          <text key={cid} x={b.col * (T + GAP) + 1} y={b.row * ROW + 9} className="tm-block-label">{WARD_TILES.find((t) => t.constituency === cid)?.constituencyName}</text>
        ))}
        {WARD_TILES.map((t) => {
          const code = SLUG_TO_CODE.get(t.id);
          if (!code) return null;
          const s = style(code);
          const ref = WARD_BY_CODE.get(code)!;
          return (
            <g key={t.id} className="nw-tile" transform={`translate(${t.col * (T + GAP)} ${t.row * ROW + 12})`} tabIndex={0} role="button" aria-pressed={picked === code}
              aria-label={`${ref.ward}, ${ref.constituency}: ${s.label}`}
              onClick={() => setPicked(code)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked(code); } }}>
              <rect width={T} height={T} rx={4} fill={s.fill} stroke={picked === code ? "var(--ink)" : s.dashed ? "var(--muted)" : "none"} strokeWidth={picked === code ? 2.5 : 1.3} strokeDasharray={s.dashed && picked !== code ? "3 2.5" : undefined} />
              <text x={T / 2} y={T / 2 - 1} textAnchor="middle" style={{ fill: s.ink, fontSize: 9, fontWeight: 700 }}>{s.label}</text>
              {/* The full name, never cut: long names break at their slash or last space, as the register's tile map does. */}
              <text x={T / 2} y={T - (nameLines(t.name).length > 1 ? 10 : 5)} textAnchor="middle" style={{ fill: "var(--ink)", fontSize: 5.4, paintOrder: "stroke", stroke: "var(--card)", strokeWidth: 2 }}>
                {nameLines(t.name).map((line, i) => <tspan key={i} x={T / 2} dy={i === 0 ? 0 : 5.6}>{line}</tspan>)}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="nw-legend">
        {layer === "avg" ? (
          AVG_LEGEND.map((l, i) => <li key={l}><span style={{ background: `var(--seq-${i + 1})` }} />{l}</li>)
        ) : on ? (
          <>
            <li><span style={{ border: "1.5px dashed var(--muted)" }} />none held</li>
            {["under a quarter", "a quarter to a half", "a half to three quarters", "three quarters or more", "every seat held"].map((l, i) => <li key={l}><span style={{ background: `var(--seq-${i + 1})` }} />{l}</li>)}
          </>
        ) : (
          <li><span style={{ border: "1.5px dashed var(--muted)" }} />seats required, none yet recorded</li>
        )}
      </ul>
      <p className="nw-status" aria-live="polite">
        {pickedRef ? (
          <>
            <strong>{pickedRef.ward}</strong>, {pickedRef.constituency}: {plural(pickedRef.village_count, "village", "villages")}, {group(required(pickedRef.ward_code))} seats at the minimum
            {pickedCov && on ? <>, {group(pickedCov.filled_to_target)} held · <StateTag s={pickedCov.state} /></> : null}
            {" "}· about {group(AVG.get(pickedRef.ward_code)!.average_per_village)} registered voters per village (ward average, estimated).
          </>
        ) : "Select a ward."}
      </p>
    </div>
  );
}

export function NetworkSeats() {
  const data = usePublicCoverage();
  const spans = spansOfControl();
  const field = LEVELS.filter((l) => l.field);
  const total = fieldStructureMinimum();
  return (
    <Frame
      id="network-seats"
      title={`At least ${group(villageMinimum())} village campaigners and ${group(total)} people in the field structure`}
      takeaway={`Two campaigners in each of ${VILLAGES.length} villages, under a coordinator and deputy in each ward and constituency. No coordinator directs more than ${Math.max(...spans.map((s) => s.max))} units.`}
      sources={[ACT_SOURCE, `${REGISTER_SOURCE}, for the ward average per village (estimated)`, "Seats: the network's default roles"]}
      table={
        <table className="rf-table is-long">
          <thead><tr><th scope="col">Ward</th><th scope="col">Constituency</th><th scope="col" className="num">Villages</th><th scope="col" className="num">Seats at minimum</th><th scope="col" className="num">Held</th><th scope="col">State</th><th scope="col" className="num">Voters per village (ward average, estimated)</th></tr></thead>
          <tbody>
            {WARDS.map((w) => {
              const c = data?.wards.find((x) => x.ward_code === w.ward_code);
              return (
                <tr key={w.ward_code}>
                  <th scope="row">{w.ward}</th><td>{w.constituency}</td><td className="num">{w.village_count}</td><td className="num">{2 + w.village_count * VILLAGE_MINIMUM}</td>
                  <td className="num">{live(data) && c ? c.filled_to_target : "—"}</td><td>{live(data) && c ? c.state : "Not recording"}</td><td className="num">{group(AVG.get(w.ward_code)!.average_per_village)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      }
    >
      <div className="nw-ladder" role="img" aria-label={`${field.map((l) => `${l.label}: ${l.units} × ${l.defaultRoles.length} = ${seatsAt(l.id)} seats`).join("; ")}; total ${total}.`}>
        {field.map((l) => (
          <div key={l.id} className="nw-ladder-row">
            <span>{l.label} <small className="text-muted">{l.units} × {l.defaultRoles.length}</small></span>
            <div className="nw-bar" style={{ width: `${(seatsAt(l.id) / total) * 100}%` }} />
            <b>{group(seatsAt(l.id))}</b>
          </div>
        ))}
        <div className="nw-ladder-row">
          <span><strong>Field structure</strong></span>
          <div className="nw-bar nw-bar--total" style={{ width: "100%" }} />
          <b>{group(total)}</b>
        </div>
      </div>
      <div className="nw-spans">
        {spans.map((s) => (
          <div key={s.level} className="nw-stat">
            <b>{s.min === s.max ? s.min : `${s.min}–${s.max}`}</b>
            <span>{s.of} per {s.level}</span>
          </div>
        ))}
      </div>
      <LiveStatus data={data} />
      <WardHeatmap data={data} />
    </Frame>
  );
}

/* ------------------------------------------------------------------ Objectives: who serves which */

const CONTRIBUTION: { role: string; cells: [string, string, string, string, string] }[] = [
  { role: "Campaign Command", cells: ["Raises village targets in the wards where he is least known", "Issues the ward briefs as tasks", "Runs consented sign-up tasks for the SMS and USSD line", "Codes every task by ward and objective", "Watches Kitui Central coverage every week"] },
  { role: "Constituency Coordinator", cells: ["Fills ward seats first where coverage is thinnest", "Schedules the briefs ward by ward", "Tracks consented sign-ups by ward", "Rolls ward signals up to Command", "Holds every ward seat filled"] },
  { role: "Ward Coordinator", cells: ["Recruits two campaigners in every village", "Hands each ward brief to village leads", "Signs up feature-phone voters with consent", "Checks each report carries its ward", "Replaces a lapsed campaigner within the week"] },
  { role: `${ROLE_LABEL.village_lead} and ${ROLE_LABEL.village_campaigner}`, cells: ["Introduces him household by household", "Shares the ward brief where it is welcome", "Explains the shortcode and the opt-in", "Reports the issue raised most", "Reports rumours early"] },
  { role: "Special-group representative", cells: ["Reaches members the village map misses", "Shares briefs with members who opt in", "Signs up members with consent", "Tags each report with its group type", "Brings group concerns to Command"] },
];

export function NetworkObjectives() {
  return (
    <Frame
      id="network-objectives"
      title="Every seat in the network serves the five objectives already set"
      takeaway="Each task Command issues names one objective; the field signal it produces is read against that objective."
      sources={["The five objectives: this document, The goal", "Contributions: the network's role definitions"]}
    >
      <div className="nw-matrix-wrap" tabIndex={0} role="region" aria-label="Contribution of each role to each objective">
        <table className="nw-matrix">
          <thead>
            <tr><th scope="col">Role</th>{SITE_OBJECTIVES.map((o) => <th key={o.n} scope="col">{o.title}</th>)}</tr>
          </thead>
          <tbody>
            {CONTRIBUTION.map((r) => (
              <tr key={r.role}><th scope="row">{r.role}</th>{r.cells.map((c, i) => <td key={i}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Strategies: the chain */

export function NetworkChain() {
  const [paused, setPaused] = useState(false);
  const units = (id: string) => LEVELS.find((l) => l.id === id)!;
  return (
    <Frame
      id="network-chain"
      title="One line of command: tasks travel down it, reports travel up it"
      takeaway="Dr. Makali directs Command; Command directs through coordinators to every village. Reports climb the same line and reach him as one screen."
      sources={["The network's line of command", ACT_SOURCE]}
    >
      <div className="flex justify-end mb-2">
        <button type="button" className="nw-chip inline-flex items-center gap-1.5" onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          {paused ? "Play" : "Pause"} the movement
        </button>
      </div>
      <div className="nw-chain" data-paused={paused} role="img" aria-label="A task moves down from Dr. Makali through Campaign Command, the constituency, the ward and the village. A report moves back up from the village to the ward, the constituency, Command and Dr. Makali's digest.">
        <div className="nw-lane nw-lane--down" aria-hidden="true"><span className="nw-lane-label">Task</span><span className="nw-token" /></div>
        <div className="nw-lane nw-lane--up" aria-hidden="true"><span className="nw-lane-label">Report</span><span className="nw-token" /></div>
        {LEVELS.map((l) => (
          <div key={l.id} className={`nw-node ${l.id === "candidate" ? "nw-node--him" : ""}`}>
            <b>{l.label}</b>
            <span>{l.id === "candidate" ? "Direction; a one-screen digest" : l.id === "command" ? "Named members of his team" : `${units(l.id).units} × ${l.defaultRoles.map((r) => ROLE_LABEL[r]).join(" and ")}`}</span>
          </div>
        ))}
      </div>
      <div className="nw-rules">
        <div className="nw-rule nw-rule--skip"><b>Urgent flag</b>Safety threats, misconduct or a coordinator not responding go straight to Command, with a named owner.</div>
        <div className="nw-rule nw-rule--bcast"><b>Broadcast</b>His message can reach every campaigner directly.</div>
        <div className="nw-rule nw-rule--reply"><b>Replies</b>Go to the sender&rsquo;s ward coordinator, never to his queue.</div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Strategies: the special-groups overlay */

export function NetworkGroups() {
  const data = usePublicCoverage();
  const on = live(data) && data.groups;
  return (
    <Frame
      id="network-groups"
      title="Special groups reach the people the village structure misses"
      takeaway="A parallel chain for ten kinds of group. Every local unit links to a ward, and a person holding a village seat and a group seat counts once."
      sources={["Group types: the network's configuration", on ? "Counts: the network's register of active local units" : "Counts: none recorded yet"]}
    >
      <ol className="nw-groupchain" aria-label="The group chain">
        {GROUP_CHAIN.map((g, i) => (
          <li key={g.label} className="contents">
            {i > 0 && <i aria-hidden="true">→</i>}
            <span>{g.label}</span>
          </li>
        ))}
      </ol>
      <LiveStatus data={data} />
      <div className="nw-matrix-wrap" tabIndex={0} role="region" aria-label="Active local units by group type and constituency">
        <table className="nw-matrix">
          <thead><tr><th scope="col">Group type</th>{CONSTITUENCIES.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>
            {GROUP_TYPES.map((g) => (
              <tr key={g.id}>
                <th scope="row">{g.label}</th>
                {CONSTITUENCIES.map((c) => {
                  const n = on ? data!.groups![g.id]?.[c] ?? 0 : null;
                  return <td key={c} className={`num ${n ? "" : "zero"}`}>{n === null ? "—" : n ? <span className="nw-cell-on">{n}</span> : 0}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rb-note mt-2">Clergy and community leaders take part as individuals who have opted in. No institutional endorsement is recorded unless confirmed in writing, and no task asks for partisan activity during worship.</p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Implementation: registration and the drill-down */

function SeatCards({ village, data }: { village: Village; data: PublicCoverage | null | undefined }) {
  const v = live(data) ? data.villages.find((x) => x.village_code === village.village_code) : undefined;
  const seats = v?.seats ?? [{ role: "village_lead" as const, filled: false }, { role: "village_campaigner" as const, filled: false }];
  return (
    <div className="nw-village">
      <h5>{village.village_name}{village.sub_areas.length ? <small>{plural(village.sub_areas.length, "place", "places")} inside it</small> : null}</h5>
      <div className="nw-seats">
        {seats.map((s, i) => (
          <div key={i} className="nw-seat" data-filled={s.filled}>
            <b>{s.filled ? "Filled" : "Vacant"}</b>
            <span>{ROLE_LABEL[s.role]}</span>
          </div>
        ))}
      </div>
      {v && <p className="mt-1.5"><StateTag s={v.state} /></p>}
    </div>
  );
}

export function NetworkDrilldown() {
  const data = usePublicCoverage();
  const [c, setC] = useState<string | null>(null);
  const [w, setW] = useState<number | null>(null);
  const on = live(data);
  const tally = (required: number, held?: number) => (on && held !== undefined ? `${group(held)} of ${group(required)} seats held` : `${group(required)} seats required`);
  const ward = w ? WARD_BY_CODE.get(w)! : null;
  return (
    <Frame
      id="network-drilldown"
      title="From the county to every village seat"
      takeaway="Each village shows its seats by role. An empty seat shows the role it needs, never a person."
      sources={[ACT_SOURCE, on ? "Seats held: the network's register (counts only)" : "Seats held: registration has not opened"]}
    >
      <ol className="nw-groupchain" aria-label="How a seat is filled">
        {["Consent recorded", "Public-officer declaration", "Seat in the line", "Seat counted"].map((s, i) => (
          <li key={s} className="contents">{i > 0 && <i aria-hidden="true">→</i>}<span>{s}</span></li>
        ))}
      </ol>
      <LiveStatus data={data} />
      <nav className="nw-crumbs" aria-label="Drill-down">
        <button type="button" onClick={() => { setC(null); setW(null); }} aria-current={!c ? "true" : undefined}>Kitui County</button>
        {c && <><span aria-hidden="true">›</span><button type="button" onClick={() => setW(null)} aria-current={!w ? "true" : undefined}>{c}</button></>}
        {ward && <><span aria-hidden="true">›</span><span aria-current="true">{ward.ward}</span></>}
      </nav>
      {!c && (
        <div className="nw-grid">
          {CONSTITUENCIES.map((name) => {
            const cov = data?.constituencies.find((x) => x.constituency === name);
            const required = 2 + WARDS.filter((x) => x.constituency === name).reduce((n, x) => n + 2 + x.village_count * VILLAGE_MINIMUM, 0);
            return (
              <button key={name} type="button" className="nw-unit" onClick={() => setC(name)}>
                <b>{name}</b>
                <small>{tally(cov?.required ?? required, cov?.filled_to_target)}</small>
                <span className="nw-meter" aria-hidden="true"><i style={{ width: `${on && cov ? (cov.filled_to_target / cov.required) * 100 : 0}%` }} /></span>
                {on && cov && <StateTag s={cov.state} />}
              </button>
            );
          })}
        </div>
      )}
      {c && !ward && (
        <div className="nw-grid">
          {WARDS.filter((x) => x.constituency === c).map((x) => {
            const cov = data?.wards.find((y) => y.ward_code === x.ward_code);
            return (
              <button key={x.ward_code} type="button" className="nw-unit" onClick={() => setW(x.ward_code)}>
                <b>{x.ward}</b>
                <small>{plural(x.village_count, "village", "villages")} · {tally(cov?.required ?? 2 + x.village_count * VILLAGE_MINIMUM, cov?.filled_to_target)}</small>
                <span className="nw-meter" aria-hidden="true"><i style={{ width: `${on && cov ? (cov.filled_to_target / cov.required) * 100 : 0}%` }} /></span>
                {on && cov && <StateTag s={cov.state} />}
              </button>
            );
          })}
        </div>
      )}
      {ward && (
        <div className="nw-grid">
          {VILLAGES.filter((v) => v.ward_code === ward.ward_code).map((v) => <SeatCards key={v.village_code} village={v} data={data} />)}
        </div>
      )}
      <ul className="nw-legend mt-3">{COVERAGE_STATES.map((s) => <li key={s}><StateTag s={s} /></li>)}</ul>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Implementation: tasks and the phone journeys */

const TEMPLATE = DEFAULT_TEMPLATES[0];

/** What the WhatsApp channel really does: it carries the task, and the link opens the phone-first tool. */
const WA_STEPS = ["message", "task", "report"] as const;

const USSD_STEPS: { input: string; screen: string }[] = [
  { input: "Dial the campaign shortcode", screen: "Kitui campaign network\n1. My tasks\n2. Send a report" },
  { input: "1", screen: `Your tasks:\n1. ${TEMPLATE.title.slice(0, 26)}` },
  { input: "1", screen: `${TEMPLATE.title}\n1. Acknowledge\n2. Done\n3. Blocked` },
  { input: "1", screen: "Marked acknowledged. Your ward coordinator can see it." },
];

function Stage({ children, label }: { children: React.ReactNode; label: string }) {
  // Drawn at true phone size and scaled as one transform, as the site's phone showcase does.
  const scale = 0.78;
  return (
    <div className="nw-phone-stage" style={{ maxWidth: BODY_W * scale, aspectRatio: `${BODY_W} / ${BODY_H}` }}>
      <div style={{ width: BODY_W, height: BODY_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <PhoneFrame label={label}>{children}</PhoneFrame>
      </div>
    </div>
  );
}

function WhatsAppJourney({ step }: { step: number }) {
  const screen = WA_STEPS[step];
  const btn = (label: string, solid = false) => (
    <span style={{ display: "block", textAlign: "center", borderRadius: 10, padding: "11px 0", fontSize: 15, fontWeight: 700, background: solid ? "#1d4ed8" : "#fff", color: solid ? "#fff" : "#1d4ed8", border: "1.5px solid #1d4ed8" }}>{label}</span>
  );
  if (screen === "message") {
    return (
      <ScreenShell tone="light" background="#efe7de" statusBarBackground="#008069">
        <div style={{ background: "#008069", color: "#fff", padding: "10px 14px", fontSize: 16, fontWeight: 600 }}>Kitui campaign network</div>
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ alignSelf: "flex-start", maxWidth: "86%", background: "#fff", color: "#111b21", borderRadius: 8, padding: "8px 10px", fontSize: 15, lineHeight: 1.4, boxShadow: "0 1px 0.5px rgba(11,20,26,.13)" }}>
            New campaign task: {TEMPLATE.title}. Due Friday. Open the campaign app, or dial the campaign shortcode, to acknowledge it.
            <span style={{ display: "block", marginTop: 6, color: "#027eb5" }}>Open my tasks</span>
          </div>
        </div>
      </ScreenShell>
    );
  }
  return (
    <ScreenShell tone="dark" background="#f7f5f0">
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e1d8", fontSize: 15, fontWeight: 700, color: "#1e1b4b" }}>{screen === "task" ? "My tasks" : "Field report"}</div>
      {screen === "task" ? (
        <div style={{ padding: 16, display: "grid", gap: 10, color: "#1e1b4b" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 14, border: "1px solid #e5e1d8" }}>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{TEMPLATE.title}</p>
            <p style={{ fontSize: 13, color: "#57534e", marginTop: 4 }}>Due Friday · {TEMPLATE.evidence}</p>
          </div>
          {btn("Acknowledge", true)}
          {btn("Done")}
          {btn("Blocked")}
        </div>
      ) : (
        <div style={{ padding: 16, display: "grid", gap: 10, color: "#1e1b4b", fontSize: 14 }}>
          {[["What did you do?", "Visited households"], ["People reached", "14"], ["Main issue raised", "Water"], ["Follow-up needed?", "Yes"]].map(([k, v]) => (
            <div key={k}><p style={{ fontSize: 12, color: "#57534e" }}>{k}</p><p style={{ background: "#fff", border: "1px solid #e5e1d8", borderRadius: 8, padding: "9px 10px", marginTop: 3 }}>{v}</p></div>
          ))}
          {btn("Send to my ward coordinator", true)}
        </div>
      )}
    </ScreenShell>
  );
}

function UssdJourney({ step }: { step: number }) {
  const s = USSD_STEPS[step];
  return (
    <ScreenShell tone="light" background="#12161d">
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: 16 }}>
        <div style={{ width: "100%", background: "#f1f1f1", borderRadius: 4, color: "#1a1a1a", padding: "16px 20px", fontFamily: "system-ui, sans-serif" }}>
          <p style={{ fontSize: 14, color: "#5f6368", marginBottom: 10 }}>{step === 0 ? "Campaign shortcode" : `You sent: ${s.input}`}</p>
          <p style={{ whiteSpace: "pre-line", fontSize: 16, lineHeight: 1.45 }}>{s.screen}</p>
        </div>
      </div>
    </ScreenShell>
  );
}

export function NetworkTasks() {
  const [channel, setChannel] = useState<"whatsapp" | "ussd">("whatsapp");
  const [step, setStep] = useState(0);
  const steps = channel === "whatsapp" ? WA_STEPS.length : USSD_STEPS.length;
  return (
    <Frame
      id="network-tasks"
      title="A task goes out, is acknowledged, is done, and comes back as a field signal"
      takeaway="Command sees each task move from Assigned to Acknowledged to Done. Campaigners answer by WhatsApp, the app, or USSD on any phone."
      sources={["The network's task states and channels", "Phone screens: a labelled preview, not a live send"]}
    >
      <div className="nw-funnel" role="img" aria-label="Task funnel: Assigned, then Acknowledged, then Done. Live counts are visible to Campaign Command when signed in.">
        {["Assigned", "Acknowledged", "Done"].map((s, i) => (
          <div key={s} style={{ width: `${100 - i * 22}%` }}>{s}<span>live count for Command</span></div>
        ))}
      </div>
      <p className="nw-status mt-3"><FieldSignal /> Every report is labelled as a field signal: what campaigners saw and heard. It is never opinion research, a vote estimate or official data.</p>
      <div className="mt-4">
        <div className="nw-layers" role="tablist" aria-label="Channel">
          {(["whatsapp", "ussd"] as const).map((c) => (
            <button key={c} type="button" role="tab" className="nw-chip" aria-selected={channel === c} onClick={() => { setChannel(c); setStep(0); }}>{c === "whatsapp" ? "WhatsApp" : "USSD, any phone"}</button>
          ))}
          <span className="nw-preview">Preview: not a live send</span>
        </div>
        <div className="nw-phones">
          <Stage label={channel === "whatsapp" ? "Preview of a campaign task arriving on WhatsApp" : "Preview of the USSD task menu"}>
            {channel === "whatsapp" ? <WhatsAppJourney step={step} /> : <UssdJourney step={step} />}
          </Stage>
        </div>
        <div className="nw-steps">
          <button type="button" className="nw-chip" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
          <span className="nw-status" aria-live="polite">Screen {step + 1} of {steps}</span>
          <button type="button" className="nw-chip" disabled={step === steps - 1} onClick={() => setStep(step + 1)}>Next screen</button>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Implementation: Dr. Makali's digest */

export function NetworkDigest() {
  const data = usePublicCoverage();
  const on = live(data);
  const locked = <p className="locked">Shown to Dr. Makali and Campaign Command when signed in.</p>;
  return (
    <Frame
      id="network-digest"
      title="Dr. Makali reads the network on one screen"
      takeaway="Totals and states only: coverage, people, tasks, field signals and open flags. He receives no individual campaigner queue."
      sources={[on ? "Coverage: the network's register (counts only)" : "Coverage: registration has not opened", "Everything else: visible when signed in"]}
    >
      <div className="nw-digest">
        <div>
          <h5>Seats held</h5>
          {on ? <p className="big">{group(data.county.filled_to_target)}<small className="text-muted text-[0.8rem]"> / {group(data.county.required)}</small></p> : <p className="big">—<small className="text-muted text-[0.8rem]"> / {group(fieldStructureMinimum())}</small></p>}
        </div>
        <div>
          <h5>Villages at minimum</h5>
          {on ? <p className="big">{group(data.county.villages["Minimum met"] + data.county.villages["Above minimum"])}<small className="text-muted text-[0.8rem]"> / {VILLAGES.length}</small></p> : <p className="big">—<small className="text-muted text-[0.8rem]"> / {VILLAGES.length}</small></p>}
        </div>
        <div><h5>People in the network</h5>{locked}</div>
        <div><h5>Tasks done</h5>{locked}</div>
        <div className="wide">
          <h5>Constituencies</h5>
          <ul className="nw-legend">
            {CONSTITUENCIES.map((c) => {
              const cov = data?.constituencies.find((x) => x.constituency === c);
              return <li key={c}>{c}: {on && cov ? <StateTag s={cov.state} /> : <span className="text-muted">not recording</span>}</li>;
            })}
          </ul>
        </div>
        <div className="wide"><h5><FieldSignal /> This week</h5>{locked}</div>
        <div className="wide"><h5>Open urgent flags</h5>{locked}</div>
      </div>
    </Frame>
  );
}
