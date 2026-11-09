import { Radio } from "lucide-react";

/**
 * The label every field report carries. A squared aqua tag with a pulse mark (app/network.css
 * .nw-signal): a different shape and colour from every evidence tier pill, so a field signal is
 * never read as polling, a vote estimate or official data.
 */
export function FieldSignal() {
  return (
    <span className="nw-signal" title="Reported by campaigners in the field. Not opinion research, not a vote estimate, not official data.">
      <Radio aria-hidden="true" />
      Field signal
    </span>
  );
}
