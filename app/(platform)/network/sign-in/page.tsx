import { redirect } from "next/navigation";
import { networkActor } from "@/lib/network/server";
import { PageHead } from "@/components/platform/PageHead";
import { SignInForm } from "@/components/network/tool";

export default async function NetworkSignIn() {
  const a = await networkActor();
  if (a.kind === "person") redirect("/network");
  return (
    <div className="mx-auto max-w-md">
      <PageHead kicker="Campaigner network" title="Sign in with your phone" lead="Use the number your coordinator registered. A one-time code comes by SMS." />
      <SignInForm />
      <p className="mt-4 text-[0.85rem] text-muted">On a phone without internet, dial the campaign shortcode to see your tasks and send a report.</p>
    </div>
  );
}
