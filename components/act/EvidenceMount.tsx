"use client";

import React from "react";

import { LazyMount } from "../LazyMount";

/**
 * How the act streams.
 *
 * The document split into nineteen routes because rendering every section on one page shipped
 * 2.05 MB of markup for sections nobody was looking at. The act puts the reader back on one page,
 * so the same discipline has to be enforced a different way: the prose is server-rendered and
 * cheap, and every expensive thing — each chart, each interactive block, each of which pulls the
 * charting runtime — mounts only as it comes within 400px of the viewport.
 *
 * The reserved height is per-block rather than a single default, because an unreserved chart that
 * mounts mid-scroll shifts everything under it, and cumulative layout shift on a phone is the
 * fastest way to make a fluid page feel broken.
 */
export function EvidenceMount({
  children,
  minHeight = 420,
  className,
}: {
  children: React.ReactNode;
  minHeight?: number | string;
  className?: string;
}) {
  return (
    <LazyMount minHeight={minHeight} rootMargin="400px 0px" className={className}>
      {children}
    </LazyMount>
  );
}
