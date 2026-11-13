import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-paper text-ink">
      <div className="max-w-md w-full border border-line/60 rounded-2xl p-8 bg-card shadow-sm">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase mb-3 inline-block">
          404 — Not Found
        </span>
        <h1 className="text-2xl font-black mb-3 tracking-tight">
          Page Not Located
        </h1>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          The requested strategy brief or operational section is not available. Please return to the executive dashboard.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Return to Strategy Portal
        </Link>
      </div>
    </div>
  );
}
