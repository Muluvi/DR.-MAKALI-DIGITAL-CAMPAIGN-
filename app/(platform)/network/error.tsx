"use client";

import Link from "next/link";

/**
 * Any refusal or failure inside the network tool. It shows no detail: an error from the service
 * can name a table, and a page must never echo a record it was refused.
 */
export default function NetworkError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="plat-card mx-auto max-w-md p-5">
      <p className="plat-kicker">Campaigner network</p>
      <h1 className="mt-2 font-serif text-[1.6rem] text-ink">This page is not available to you</h1>
      <p className="mt-2 text-muted">It may be outside your area, or something went wrong. Nothing was changed.</p>
      <div className="nw-actions mt-4">
        <Link className="plat-btn plat-btn-solid" href="/network">Back to my work</Link>
        <button type="button" className="plat-btn" onClick={() => reset()}>Try again</button>
      </div>
    </div>
  );
}
