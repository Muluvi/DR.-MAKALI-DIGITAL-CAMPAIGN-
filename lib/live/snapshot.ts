/**
 * Everything live the story shows, read in one go: who is signed in, every working record, the
 * team's charts and the latest changes. The story pages are static, so they ask for this from the
 * browser (/api/live) and draw it into each chapter; nothing here is in the static HTML.
 */
import { getSession, readStore } from "@/lib/platform/auth";
import { teamLoginEnabled } from "@/lib/platform/config";
import { COLLECTIONS } from "@/lib/platform/collections";
import { resolveOptions } from "@/lib/platform/options";
import { recordRows } from "@/components/platform/rows";
import type { Cell, Column } from "@/lib/platform/catalogue";
import type { Options } from "@/lib/platform/validate";
import { teamCharts, type TeamChart } from "./charts";

export interface LiveCollection {
  id: string; label: string; purpose: string; group: string;
  /** The field that names a record in a short list. */
  titleKey: string | null;
  columns: Column[]; rows: Record<string, Cell>[]; data: Record<string, Record<string, unknown>>;
  count: number; lastAt: string | null; lastBy: string | null;
}
export interface LiveChange { id: string; at: string; actor: string; title: string; where: string; action: string }
export interface LiveSnapshot {
  signedIn: boolean; loginEnabled: boolean; name: string | null; role: "team" | "firefly" | null; editable: boolean; options: Options;
  collections: Record<string, LiveCollection>; charts: Record<string, TeamChart>; changes: LiveChange[]; lastChange: LiveChange | null;
}

export async function liveSnapshot(): Promise<LiveSnapshot> {
  const store = readStore();
  const [session, all, audit] = await Promise.all([
    getSession().catch(() => null),
    store ? store.listAll().catch(() => []) : [],
    store ? store.audit(30).catch(() => []) : [],
  ]);
  const live = all.filter((r) => !r.archived);
  const collections = Object.fromEntries(COLLECTIONS.map((c) => {
    const records = live.filter((r) => r.collection === c.id);
    const { columns, rows } = recordRows(c, records);
    const last = [...records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    return [c.id, {
      id: c.id, label: c.label, purpose: c.purpose, group: c.group, columns, rows,
      titleKey: c.titleField ?? c.fields.find((f) => f.type === "text")?.key ?? null,
      data: Object.fromEntries(records.map((r) => [r.id, r.data])),
      count: records.length, lastAt: last?.updatedAt ?? null, lastBy: last?.updatedBy ?? null,
    } satisfies LiveCollection];
  }));
  const label = (id: string) => COLLECTIONS.find((c) => c.id === id)?.label ?? "Data pack";
  const changes: LiveChange[] = audit.map((e) => ({ id: e.id, at: e.at, actor: e.actor, title: e.title, where: e.layer === "pack" ? "Data pack" : label(e.collection), action: e.action }));
  return {
    signedIn: !!session, loginEnabled: teamLoginEnabled(), name: session?.name ?? null, role: session?.role ?? null, editable: !!store, options: resolveOptions(),
    collections, charts: Object.fromEntries(teamCharts(live).map((c) => [c.id, c])), changes, lastChange: changes[0] ?? null,
  };
}
