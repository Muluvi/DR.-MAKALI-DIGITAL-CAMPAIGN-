import Link from "next/link";
import { PageHead } from "@/components/platform/PageHead";
import { modelBySlug } from "@/lib/models/catalogue";
import { editingAvailable } from "@/lib/platform/auth";
import { SaveScenario } from "./SaveScenario";

/** The heading every model page opens with: the way back to the hub, then what the model answers. */
export function ModelHead({ slug, lead }: { slug: string; lead: string }) {
  const m = modelBySlug(slug);
  return (
    <>
      <p className="mb-3 text-[0.85rem] print:hidden"><Link className="underline" href="/models">All models</Link></p>
      <PageHead kicker="Model" title={m.name} lead={lead}>
        <p className="mt-3 text-[0.85rem] text-muted"><span className="font-semibold text-ink">{m.question}</span> Arithmetic on the data pack and the options you set: the same inputs always give the same outcome, and every scenario is a link you can share.</p>
      </PageHead>
      {editingAvailable() && <SaveScenario modelName={m.name} />}
    </>
  );
}
