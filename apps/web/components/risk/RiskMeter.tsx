"use client";

import type { RiskLevel } from "@sentinelmesh/shared";
import { cn, riskColor } from "@/lib/format";

const riskLabels: Record<RiskLevel, string> = {
  Low: "Low execution risk",
  Medium: "Moderate execution risk",
  High: "High execution risk",
  Critical: "Critical risk - review before proceeding"
};

export function RiskMeter({ score, level }: { score: number; level: RiskLevel }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className={cn("border-b border-white/10 bg-black p-6 lg:border-b-0 lg:border-r", riskColor(level))}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-white/80">Risk score</div>
          <div className="mt-1 text-xs text-white/40">{riskLabels[level]}</div>
        </div>
        <span className="rounded-md border border-current/30 px-2 py-1 text-xs font-semibold">{level}</span>
      </div>
      <div className="text-6xl font-semibold text-white">{clamped}<span className="ml-1 text-base font-medium text-white/30">/100</span></div>
      <div className="mt-5 h-px bg-white/10">
        <div className="h-px bg-current transition-all" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
