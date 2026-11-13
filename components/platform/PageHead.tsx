export function PageHead({ kicker, title, lead, children }: { kicker: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="plat-kicker">{kicker}</p>
      <h1 className="mt-2 font-serif text-[2rem] leading-[1.05] tracking-tight text-ink sm:text-[2.6rem]">{title}</h1>
      {lead && <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-muted">{lead}</p>}
      {children}
    </div>
  );
}
