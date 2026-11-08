import { library } from "@/lib/platform/library";
import { PageHead } from "@/components/platform/PageHead";
import { Library } from "@/components/platform/Library";

export const metadata = { title: "Strategies and solutions | Kitui 2027", robots: { index: false, follow: false } };

export default function Strategies() {
  const items = library();
  return (
    <>
      <PageHead kicker="Strategy library" title="Objectives, strategies and solutions" lead="Every objective, strategy, workstream and response the story sets out, with the figures behind it. Tap through to the argument, or to the data." />
      <Library items={items} />
    </>
  );
}
