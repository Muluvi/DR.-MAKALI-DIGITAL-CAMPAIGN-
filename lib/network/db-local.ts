/**
 * Development store: one JSON file under .platform-local/ (git-ignored, never committed), the same
 * semantics as the production store. platformMode() refuses local mode on Vercel.
 */
import fs from "node:fs";
import path from "node:path";
import { objectDb, type NetDb, type Row, type Table } from "./db.ts";

const FILE = path.join(process.cwd(), ".platform-local", "network.json");

export function localDb(): NetDb {
  const state: Partial<Record<Table, Row[]>> = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : {};
  return objectDb(state, () => {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(state));
  });
}
