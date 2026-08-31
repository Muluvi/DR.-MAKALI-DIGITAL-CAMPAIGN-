"use client";

import React from "react";

export function SectionSkeleton() {
  return (
    <div className="w-full bg-card/60 backdrop-blur-sm border border-line/70 rounded-2xl p-5 sm:p-7 space-y-6 shadow-sm overflow-hidden animate-pulse">
      {/* Header Skeleton Bar */}
      <div className="flex items-center justify-between border-b border-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
            <div className="w-4 h-4 rounded-md bg-accent/40" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-40 sm:w-56 bg-line/60 rounded-md" />
            <div className="h-2.5 w-24 sm:w-32 bg-line/40 rounded" />
          </div>
        </div>
        <div className="h-6 w-16 bg-line/40 rounded-full hidden sm:block" />
      </div>

      {/* Paragraph blocks skeleton matching real reading density */}
      <div className="space-y-3 pt-1">
        <div className="h-3.5 w-full bg-line/45 rounded" />
        <div className="h-3.5 w-[94%] bg-line/40 rounded" />
        <div className="h-3.5 w-[88%] bg-line/40 rounded" />
        <div className="h-3.5 w-[76%] bg-line/35 rounded" />
      </div>

      {/* Metric Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl border border-line/50 bg-card/40 space-y-2">
          <div className="h-2.5 w-20 bg-line/40 rounded" />
          <div className="h-5 w-28 bg-line/60 rounded" />
          <div className="h-1.5 w-full bg-line/30 rounded-full" />
        </div>
        <div className="p-3.5 rounded-xl border border-line/50 bg-card/40 space-y-2">
          <div className="h-2.5 w-24 bg-line/40 rounded" />
          <div className="h-5 w-32 bg-line/60 rounded" />
          <div className="h-1.5 w-full bg-line/30 rounded-full" />
        </div>
        <div className="p-3.5 rounded-xl border border-line/50 bg-card/40 space-y-2">
          <div className="h-2.5 w-16 bg-line/40 rounded" />
          <div className="h-5 w-20 bg-line/60 rounded" />
          <div className="h-1.5 w-full bg-line/30 rounded-full" />
        </div>
      </div>

      {/* Table Structure Skeleton */}
      <div className="border border-line/50 rounded-xl overflow-hidden pt-1">
        <div className="h-8 bg-line/30 flex items-center px-4 gap-4">
          <div className="h-2.5 w-20 bg-line/50 rounded" />
          <div className="h-2.5 w-28 bg-line/40 rounded" />
          <div className="h-2.5 w-16 bg-line/40 rounded ml-auto" />
        </div>
        <div className="p-4 space-y-2.5 bg-card/20">
          <div className="h-3 w-full bg-line/25 rounded" />
          <div className="h-3 w-[92%] bg-line/20 rounded" />
          <div className="h-3 w-[85%] bg-line/20 rounded" />
        </div>
      </div>
    </div>
  );
}
