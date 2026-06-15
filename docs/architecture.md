# SentinelMesh Architecture

## Ownership

Satyam owns Solidity, Foundry tests, wallet/web3 integration, registry deployment, explorer links, and chain adapters.

Upanshi owns Next.js UI, API endpoints, agent orchestration, intent parsing, risk engine wiring, report storage, and demo polish.

Shared ownership includes product scope, integration, testing, README, demo flow, and final submission.

## Agent Contract

Every agent returns:

```ts
type AgentResult = {
  agentName: string;
  status: "pending" | "running" | "completed" | "warning" | "failed";
  confidence: number;
  reasoning: string[];
  output: unknown;
  timestamp: string;
};
```

Agents:

- `IntentAgent`: prompt to structured DeFi intent
- `RiskAgent`: explainable score and risk factors
- `RouteAgent`: route recommendation
- `ReportAgent`: deterministic report hash and report object
- `VerificationAgent`: local hash versus registry hash check

## Security Boundary

The report registry is intentionally narrow. It stores:

- user address
- report hash
- risk score
- recommendation
- report URI
- timestamp

It does not execute swaps, hold user funds, or make MEV guarantees.
