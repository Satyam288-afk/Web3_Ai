import type { RouteAnalysis } from "@sentinelmesh/shared";
import { RouteCard } from "./RouteCard";

export function RouteSelection({
  routeAnalysis,
  selectedRouteId,
  onSelect
}: {
  routeAnalysis: RouteAnalysis;
  selectedRouteId: string | null;
  onSelect: (routeId: string) => void;
}) {
  return (
    <div className="sentinel-horizontal-strip sentinel-route-strip">
      {routeAnalysis.routes.map((route) => (
        <RouteCard key={route.routeId} route={route} selected={selectedRouteId === route.routeId} onSelect={onSelect} />
      ))}
    </div>
  );
}
