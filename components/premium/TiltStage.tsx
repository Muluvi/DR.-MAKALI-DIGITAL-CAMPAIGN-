"use client";

import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "motion/react";

import { useDeviceTilt } from "../../hooks/use-device-tilt";

/**
 * A lit stage for a device mockup (brief G-10): perspective, the shared pointer/scroll tilt, a
 * specular sheen that slides across the glass as the device turns, and a soft contact shadow.
 *
 * The device inside is drawn flat and complete; the stage only turns it. Under reduced motion the
 * tilt stays at zero and the sheen rests at its centre, so the render is the same object, square.
 */
export function TiltStage({
  children,
  maxX = 3,
  maxY = 7,
  radius = 24,
  className = "",
}: {
  children: ReactNode;
  maxX?: number;
  maxY?: number;
  /** The device's corner radius, so the sheen follows its outline. */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useDeviceTilt(ref, { maxX, maxY });
  const sheenX = useTransform(rotateY, [-maxY, maxY], ["12%", "88%"]);
  const sheen = useTransform(
    sheenX,
    (x) => `linear-gradient(115deg, transparent 0%, transparent calc(${x} - 24%), rgba(255,255,255,0.13) ${x}, transparent calc(${x} + 24%), transparent 100%)`
  );
  return (
    <div ref={ref} className={`pf-tilt ${className}`} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <motion.div className="pf-tilt__body" style={{ rotateX, rotateY, borderRadius: radius }}>
        {children}
        <motion.span aria-hidden="true" className="pf-tilt__sheen" style={{ background: sheen, borderRadius: radius }} />
      </motion.div>
      <span aria-hidden="true" className="pf-tilt__shadow" />
    </div>
  );
}
