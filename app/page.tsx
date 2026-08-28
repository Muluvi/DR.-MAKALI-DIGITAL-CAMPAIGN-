import fs from "fs/promises";
import path from "path";
import { ClientPage } from "@/components/ClientPage";

export default async function Page() {
  const contentDir = path.join(process.cwd(), "public", "content");
  
  // Read markdown files
  const [exec, strategy, operations, tactics, execution, appendix] = await Promise.all([
    fs.readFile(path.join(contentDir, "exec.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "strategy.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "operations.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "tactics.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "execution.md"), "utf-8").catch(() => ""),
    fs.readFile(path.join(contentDir, "appendix.md"), "utf-8").catch(() => ""),
  ]);

  return (
    <ClientPage 
      exec={exec} 
      strategy={strategy} 
      operations={operations}
      tactics={tactics}
      execution={execution} 
      appendix={appendix} 
    />
  );
}
