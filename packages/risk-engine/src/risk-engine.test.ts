import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzeRisk, calculateRiskScore, getRiskLevel, recommendRoute } from ".";
import type { DeFiIntent, RiskFactors } from "@sentinelmesh/shared";

const baseIntent: DeFiIntent = {
  action: "swap",
  tokenIn: "ETH",
  tokenOut: "USDC",
  amount: "0.2",
  chain: "Base Sepolia",
  priority: "safety",
  constraints: { maxSlippage: "0.5%", riskTolerance: "low" }
};

describe("risk scoring", () => {
  it("calculates the weighted score using the v0 model", () => {
    const factors: RiskFactors = {
      slippageRisk: 100,
      liquidityRisk: 50,
      priceImpactRisk: 50,
      gasRisk: 20,
      tokenRisk: 10,
      routeComplexityRisk: 0,
      mevExposureRisk: 100
    };

    assert.equal(calculateRiskScore(factors), 45);
  });

  it("maps risk level boundaries", () => {
    assert.equal(getRiskLevel(30), "Low");
    assert.equal(getRiskLevel(31), "Medium");
    assert.equal(getRiskLevel(60), "Medium");
    assert.equal(getRiskLevel(61), "High");
    assert.equal(getRiskLevel(80), "High");
    assert.equal(getRiskLevel(81), "Critical");
  });

  it("recommends standard route for low risk", () => {
    const analysis = analyzeRisk(baseIntent, {
      slippageRisk: 10,
      liquidityRisk: 10,
      priceImpactRisk: 10,
      gasRisk: 10,
      tokenRisk: 10,
      routeComplexityRisk: 10,
      mevExposureRisk: 20
    });

    assert.equal(recommendRoute(analysis).recommendedRoute, "STANDARD_ROUTE");
  });

  it("blocks critical routes above 85", () => {
    const analysis = analyzeRisk(baseIntent, {
      slippageRisk: 95,
      liquidityRisk: 95,
      priceImpactRisk: 95,
      gasRisk: 95,
      tokenRisk: 95,
      routeComplexityRisk: 95,
      mevExposureRisk: 95
    });

    assert.equal(recommendRoute(analysis).recommendedRoute, "BLOCKED_UNSAFE");
  });
});
