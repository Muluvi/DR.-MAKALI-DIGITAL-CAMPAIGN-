import type { ReactNode } from "react";

/**
 * A basic keypad phone (visual upgrade, A3): the handset many Kitui voters actually carry, for SMS
 * and USSD. Generic on purpose: moulded plastic, a small monochrome panel, a twelve-key pad and
 * the two call keys. No maker, no network name.
 *
 * Drawn larger than a real handset's screen text so it stays readable on a phone of its own: the
 * panel type is 13px rather than a true 2G panel's 9, and every key is a 44px touch target.
 */
export function FeaturePhoneFrame({
  screen,
  keypad,
  label,
  status = "2G",
}: {
  screen: ReactNode;
  keypad?: ReactNode;
  /** What the screen shows, for assistive technology. */
  label: string;
  /** The signal label in the panel's status line. */
  status?: string;
}) {
  return (
    <div className="kp">
      <span className="kp__ear" aria-hidden="true" />
      <div className="kp__screen" role="group" aria-label={label}>
        <div className="kp__status" aria-hidden="true">
          <span className="kp__bars"><i /><i /><i /><i /></span>
          <span>{status}</span>
          <span className="kp__batt"><i /></span>
        </div>
        <div className="kp__panel">{screen}</div>
        <span className="kp__glass" aria-hidden="true" />
      </div>
      {keypad ? <div className="kp__pad">{keypad}</div> : null}
    </div>
  );
}
