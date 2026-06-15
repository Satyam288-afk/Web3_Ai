import {
  type DeFiIntent,
  RISK_FACTOR_LABELS,
  type RiskAnalysis,
  type RiskFactors,
  type RiskLevel,
  type RouteRecommendation,
  type RouteType
} from "@sentinelmesh/shared";

export const RISK_WEIGHTS: Record<Exclude<keyof RiskFactors, "mevExposureRisk">, number> = {
  slippageRisk: 0.2,
  liquidityRisk: 0.2,
  priceImpactRisk: 0.2,
  gasRisk: 0.15,
  tokenRisk: 0.15,
  routeComplexityRisk: 0.1
};

const KNOWN_TOKENS = new Set(["ETH", "WETH", "USDC", "USDT", "DAI", "WBTC"]);

export function clampRisk(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return "Low";
  if (score <= 60) return "Medium";
  if (score <= 80) return "High";
  return "Critical";
}

export function calculateRiskScore(factors: RiskFactors): number {
  const weighted =
    clampRisk(factors.slippageRisk) * RISK_WEIGHTS.slippageRisk +
    clampRisk(factors.liquidityRisk) * RISK_WEIGHTS.liquidityRisk +
    clampRisk(factors.priceImpactRisk) * RISK_WEIGHTS.priceImpactRisk +
    clampRisk(factors.gasRisk) * RISK_WEIGHTS.gasRisk +
    clampRisk(factors.tokenRisk) * RISK_WEIGHTS.tokenRisk +
    clampRisk(factors.routeComplexityRisk) * RISK_WEIGHTS.routeComplexityRisk;

  return clampRisk(weighted);
}

export function estimateRiskFactors(intent: DeFiIntent): RiskFactors {
  const amount = Number.parseFloat(intent.amount ?? "0");
  const tokenIn = intent.tokenIn?.toUpperCase();
  const tokenOut = intent.tokenOut?.toUpperCase();
  const maxSlippage = Number.parseFloat(intent.constraints.maxSlippage ?? "1");
  const isUnknownToken = Boolean(
    (tokenIn && !KNOWN_TOKENS.has(tokenIn)) || (tokenOut && !KNOWN_TOKENS.has(tokenOut))
  );
  const isBridge = intent.action === "bridge";
  const isUnsupported = intent.action === "unsupported";
  const isLargeTrade = amount >= 10;
  const speedPriority = intent.priority === "speed";

  return {
    slippageRisk: clampRisk(maxSlippage * 16 + (speedPriority ? 12 : 0) + (isUnknownToken ? 20 : 0)),
    liquidityRisk: clampRisk((isUnknownToken ? 72 : 18) + (isLargeTrade ? 30 : 0) + (isBridge ? 20 : 0)),
    priceImpactRisk: clampRisk((isLargeTrade ? 72 : 14) + (isUnknownToken ? 34 : 0)),
    gasRisk: clampRisk(22 + (isBridge ? 42 : 0) + (speedPriority ? 12 : 0)),
    tokenRisk: clampRisk(isUnknownToken ? 88 : isUnsupported ? 70 : 8),
    routeComplexityRisk: clampRisk(isBridge ? 92 : isUnsupported ? 80 : isLargeTrade ? 44 : 14),
    mevExposureRisk: clampRisk((isLargeTrade ? 82 : 22) + (speedPriority ? 18 : 0) + (maxSlippage > 3 ? 20 : 0))
  };
}

export function analyzeRisk(intent: DeFiIntent, fixtureFactors?: RiskFactors): RiskAnalysis {
  const factors = fixtureFactors ?? estimateRiskFactors(intent);
  const riskScore = calculateRiskScore(factors);
  const riskLevel = getRiskLevel(riskScore);

  return {
    riskScore,
    riskLevel,
    factors,
    factorExplanations: (Object.entries(factors) as Array<[keyof RiskFactors, number]>).map(([key, score]) => ({
      key,
      label: RISK_FACTOR_LABELS[key],
      score: clampRisk(score),
      explanation: explainFactor(key, score, intent)
    })),
    summary: buildRiskSummary(riskLevel, intent),
    dataSource: fixtureFactors ? "fixture" : "deterministic"
  };
}

export function recommendRoute(analysis: RiskAnalysis): RouteRecommendation {
  const score = analysis.riskScore;
  const mevRisk = analysis.factors.mevExposureRisk;
  const priceImpact = analysis.factors.priceImpactRisk;
  let recommendedRoute: RouteType;

  if (score > 85) {
    recommendedRoute = "BLOCKED_UNSAFE";
  } else if (score > 70) {
    recommendedRoute = mevRisk >= 75 || priceImpact >= 70 ? "SPLIT_ORDER" : "PROTECTED_ROUTE";
  } else if (score > 40) {
    recommendedRoute = "DELAYED_EXECUTION";
  } else {
    recommendedRoute = "STANDARD_ROUTE";
  }

  return {
    recommendedRoute,
    alternatives: buildAlternatives(recommendedRoute),
    pros: routePros(recommendedRoute),
    cons: routeCons(recommendedRoute),
    explanation: routeExplanation(recommendedRoute, analysis)
  };
}

function explainFactor(key: keyof RiskFactors, score: number, intent: DeFiIntent): string {
  const severity = score > 80 ? "critical" : score > 60 ? "high" : score > 30 ? "moderate" : "low";
  const pair = [intent.tokenIn, intent.tokenOut].filter(Boolean).join(" -> ") || "requested route";

  const map: Record<keyof RiskFactors, string> = {
    slippageRisk: `${severity} slippage risk based on the requested tolerance and ${intent.priority} priority.`,
    liquidityRisk: `${severity} liquidity risk for ${pair}; fallback data is used when live liquidity is unavailable.`,
    priceImpactRisk: `${severity} price impact risk inferred from amount, token profile, and route size.`,
    gasRisk: `${severity} gas risk based on expected network volatility and route complexity.`,
    tokenRisk: `${severity} token risk based on allowlist status and unsupported-asset detection.`,
    routeComplexityRisk: `${severity} route complexity risk for the requested action.`,
    mevExposureRisk: `${severity} MEV exposure signal; this informs routing but is not included in the v0 weighted score.`
  };

  return map[key];
}

function buildRiskSummary(level: RiskLevel, intent: DeFiIntent): string {
  if (intent.action === "bridge") {
    return "Bridge requests are analysis-only in v0; the registry records risk reports but does not execute cross-chain routes.";
  }
  if (level === "Low") return "The request fits the v0 safe path: known assets, manageable size, and low route complexity.";
  if (level === "Medium") return "The request can proceed in simulation, but route timing or slippage constraints should be tightened.";
  if (level === "High") return "The request needs protected routing or split execution before a user considers signing.";
  return "The request is too risky for v0 execution and should be blocked or rewritten.";
}

function buildAlternatives(route: RouteType): RouteType[] {
  const all: RouteType[] = [
    "STANDARD_ROUTE",
    "PROTECTED_ROUTE",
    "DELAYED_EXECUTION",
    "SPLIT_ORDER",
    "BLOCKED_UNSAFE"
  ];
  return all.filter((item) => item !== route).slice(0, 3);
}

function routePros(route: RouteType): string[] {
  const map: Record<RouteType, string[]> = {
    STANDARD_ROUTE: ["Lowest friction", "Works well for low-risk known pairs"],
    PROTECTED_ROUTE: ["Reduces public mempool exposure", "Better fit for safety-priority intents"],
    DELAYED_EXECUTION: ["Waits for safer gas/liquidity conditions", "Avoids rushing into moderate-risk routes"],
    SPLIT_ORDER: ["Reduces price impact", "Lowers single-transaction MEV exposure"],
    BLOCKED_UNSAFE: ["Protects the user from critical risk", "Creates a clear audit trail for the blocked recommendation"]
  };
  return map[route];
}

function routeCons(route: RouteType): string[] {
  const map: Record<RouteType, string[]> = {
    STANDARD_ROUTE: ["No special protection", "Not appropriate for high slippage or unknown tokens"],
    PROTECTED_ROUTE: ["May be slower or more expensive", "Still not guaranteed MEV protection"],
    DELAYED_EXECUTION: ["Execution is not immediate", "User must re-check conditions later"],
    SPLIT_ORDER: ["More operational complexity", "Multiple transactions may cost more gas"],
    BLOCKED_UNSAFE: ["No execution route is produced", "User must adjust the intent"]
  };
  return map[route];
}

function routeExplanation(route: RouteType, analysis: RiskAnalysis): string {
  const base = `Risk score ${analysis.riskScore}/100 (${analysis.riskLevel}).`;
  const map: Record<RouteType, string> = {
    STANDARD_ROUTE: `${base} Standard routing is acceptable for low-risk simulation and reporting.`,
    PROTECTED_ROUTE: `${base} Protected routing is recommended to reduce public-route exposure without claiming a guarantee.`,
    DELAYED_EXECUTION: `${base} Delayed execution is safer until slippage, gas, or liquidity conditions improve.`,
    SPLIT_ORDER: `${base} Splitting the order is recommended because price impact or MEV exposure is elevated.`,
    BLOCKED_UNSAFE: `${base} SentinelMesh should block this route in v0 and only generate a risk report.`
  };
  return map[route];
}
