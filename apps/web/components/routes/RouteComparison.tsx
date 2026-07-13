import { AlertTriangle, Loader2, Route } from "lucide-react";
import type { RouteAnalysis } from "@sentinelmesh/shared";
import { RouteSelection } from "./RouteSelection";

export function RouteComparison({
  routeAnalysis,
  selectedRouteId,
  loading,
  error,
  onSelect
}: {
  routeAnalysis: RouteAnalysis | null;
  selectedRouteId: string | null;
  loading: boolean;
  error: string | null;
  onSelect: (routeId: string) => void;
}) {
  return (
    <section className="border-y border-white/10 py-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Route className="text-violet" size={20} />
          <div>
            <div className="eyebrow text-violet">Step 04</div>
            <h2 className="mt-1 font-semibold text-ink">Route comparison</h2>
          </div>
        </div>
        {routeAnalysis?.recommendedRouteId && <span className="text-xs text-muted">Selection is committed into the report</span>}
      </div>

      {loading && (
        <div className="mt-5 flex items-center gap-2 border-l-2 border-[#22d3ee] pl-4 text-sm text-white/55">
          <Loader2 className="animate-spin text-teal" size={18} />
          Comparing route options...
        </div>
      )}

      {!loading && error && (
        <div className="mt-5 border-l-2 border-danger/70 pl-4 text-sm text-danger">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={17} />
            Route analysis failed
          </div>
          <p className="mt-2 text-xs text-danger/80">{error}</p>
        </div>
      )}

      {!loading && !error && !routeAnalysis && <p className="text-sm text-muted">Run risk analysis to compare route options.</p>}

      {!loading && !error && routeAnalysis && (
        <div className="mt-5 space-y-5">
          <div className="border-l-2 border-violet/70 pl-4 text-sm leading-6 text-white/60">
            {routeAnalysis.decisionSummary}
          </div>
          <RouteSelection routeAnalysis={routeAnalysis} selectedRouteId={selectedRouteId} onSelect={onSelect} />
        </div>
      )}
    </section>
  );
}
