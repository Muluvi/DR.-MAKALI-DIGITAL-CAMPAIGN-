import fs from "node:fs";
import path from "node:path";
import { compileChapter } from "./tokens";

/** A chapter's markdown, tokens resolved and visuals compiled. Server and build only. */
export function loadChapter(id: string): string {
  const file = path.join(process.cwd(), "content", `${id}.md`);
  return compileChapter(fs.readFileSync(file, "utf8"), `content/${id}.md`);
}
