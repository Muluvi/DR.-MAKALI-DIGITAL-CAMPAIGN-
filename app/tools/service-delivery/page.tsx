import { ProjectsRegister } from "@/components/tools/ProjectsRegister";

export const metadata = {
  title: "Service-delivery tracker | Kitui 2027",
  description: "The county scorecard's itemised projects, by constituency, ward, sector and status.",
};

export default function ServiceDeliveryPage() {
  return <ProjectsRegister />;
}
