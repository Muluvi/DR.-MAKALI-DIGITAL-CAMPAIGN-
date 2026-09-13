import React from "react";

/** An anchor the chapter rail can point at. Nothing more — the id is the whole job. */
export function Chapter({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-0">
      {children}
    </section>
  );
}
