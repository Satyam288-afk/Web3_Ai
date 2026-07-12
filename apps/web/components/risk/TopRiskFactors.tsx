"use client";

import type { RiskAnalysis } from "@sentinelmesh/shared";
import { RiskFactorCard } from "./RiskFactorCard";

export function TopRiskFactors({ analysis }: { analysis: RiskAnalysis }) {
  return (
    <section className="border-y border-white/10 bg-black py-6">
      <div className="eyebrow">Primary signals</div>
      <h2 className="mt-1 font-semibold text-ink">Top risk factors</h2>
      <div className="mt-4 grid gap-x-8 md:grid-cols-3">
        {analysis.topFactors.map((factor) => (
          <RiskFactorCard key={factor.key} label={factor.label} score={factor.score} explanation={factor.explanation} />
        ))}
      </div>
    </section>
  );
}
