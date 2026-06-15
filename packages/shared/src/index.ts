import { z } from "zod";

export type AgentStatus = "pending" | "running" | "completed" | "warning" | "failed";

export type AgentResult<TOutput = unknown> = {
  agentName: string;
  status: AgentStatus;
  confidence: number;
  reasoning: string[];
  output: TOutput;
  timestamp: string;
};

export type DeFiAction = "swap" | "bridge" | "stake" | "analyze" | "unsupported";
export type DeFiPriority = "safety" | "speed" | "cost" | "yield";
export type RiskTolerance = "low" | "medium" | "high";

export type DeFiIntent = {
  action: DeFiAction;
  tokenIn?: string;
  tokenOut?: string;
  amount?: string;
  chain?: string;
  priority: DeFiPriority;
  constraints: {
    maxSlippage?: string;
    riskTolerance?: RiskTolerance;
  };
};

export const DeFiIntentSchema = z.object({
  action: z.enum(["swap", "bridge", "stake", "analyze", "unsupported"]),
  tokenIn: z.string().optional(),
  tokenOut: z.string().optional(),
  amount: z.string().optional(),
  chain: z.string().optional(),
  priority: z.enum(["safety", "speed", "cost", "yield"]),
  constraints: z.object({
    maxSlippage: z.string().optional(),
    riskTolerance: z.enum(["low", "medium", "high"]).optional()
  })
}) satisfies z.ZodType<DeFiIntent>;

export const IntentPromptSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt must be 1000 characters or fewer")
});

export type RiskFactors = {
  slippageRisk: number;
  liquidityRisk: number;
  priceImpactRisk: number;
  gasRisk: number;
  tokenRisk: number;
  routeComplexityRisk: number;
  mevExposureRisk: number;
};

export type RiskFactorExplanation = {
  key: keyof RiskFactors;
  label: string;
  score: number;
  explanation: string;
};

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type RiskAnalysis = {
  riskScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactors;
  factorExplanations: RiskFactorExplanation[];
  summary: string;
  dataSource: "fixture" | "deterministic";
};

export type RouteType =
  | "STANDARD_ROUTE"
  | "PROTECTED_ROUTE"
  | "DELAYED_EXECUTION"
  | "SPLIT_ORDER"
  | "BLOCKED_UNSAFE";

export type RouteRecommendation = {
  recommendedRoute: RouteType;
  alternatives: RouteType[];
  pros: string[];
  cons: string[];
  explanation: string;
};

export type ExecutionMode = "Simulation Only" | "Report On-chain";

export type SentinelReport = {
  id: string;
  userAddress?: string;
  originalPrompt: string;
  parsedIntent: DeFiIntent;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactors;
  riskFactorExplanations: RiskFactorExplanation[];
  recommendedRoute: RouteRecommendation;
  agentTrace: AgentResult[];
  modelVersion: string;
  reportHash: `0x${string}`;
  reportURI: string;
  chainTxHash?: `0x${string}`;
  verificationStatus: "pending" | "verified" | "mismatch" | "local-only";
  createdAt: string;
};

export type FixtureScenario = {
  id: string;
  label: string;
  prompt: string;
  parsedIntent: DeFiIntent;
  riskFactors: RiskFactors;
  notes: string[];
};

export const MODEL_VERSION = "sentinelmesh-risk-v0.1";

export const RISK_FACTOR_LABELS: Record<keyof RiskFactors, string> = {
  slippageRisk: "Slippage",
  liquidityRisk: "Liquidity",
  priceImpactRisk: "Price impact",
  gasRisk: "Gas volatility",
  tokenRisk: "Token safety",
  routeComplexityRisk: "Route complexity",
  mevExposureRisk: "MEV exposure"
};
