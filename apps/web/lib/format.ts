import { clsx, type ClassValue } from "clsx";
import type { RiskLevel } from "@sentinelmesh/shared";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function riskColor(level: RiskLevel | string) {
  if (level === "Low") return "text-success border-success/30 bg-success/10";
  if (level === "Medium") return "text-warning border-warning/30 bg-warning/10";
  if (level === "High") return "text-orange-300 border-orange-300/30 bg-orange-400/10";
  return "text-danger border-danger/30 bg-danger/10";
}

export function shortHash(hash?: string) {
  if (!hash) return "Not anchored";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}
