import assert from "node:assert/strict";
import test from "node:test";
import type { SentinelReport } from "@sentinelmesh/shared";
import { analyzeExecutionOutcome } from "./execution-outcome.js";

test("returns an honest unavailable outcome when the signed chain has no configured RPC", async () => {
  const report = { safetyAttestation: { chainId: 84532 } } as SentinelReport;
  const outcome = await analyzeExecutionOutcome({ report, transactionHash: `0x${"12".repeat(32)}` });
  assert.equal(outcome.status, "UNAVAILABLE");
  assert.equal(outcome.source, "local");
  assert.match(outcome.summary, /not configured/i);
});
