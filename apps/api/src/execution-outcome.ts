import { createPublicClient, decodeEventLog, http, parseAbi, type Chain } from "viem";
import { baseSepolia, sepolia } from "viem/chains";
import type { ComplianceCheck, ExecutionOutcome, SentinelReport } from "@sentinelmesh/shared";
import { decodeRawTransaction } from "./transaction-decoder.js";

const transferEventAbi = parseAbi(["event Transfer(address indexed from,address indexed to,uint256 value)"]);

export async function analyzeExecutionOutcome({ report, transactionHash, rpcUrl }: { report: SentinelReport; transactionHash: `0x${string}`; rpcUrl?: string }): Promise<ExecutionOutcome> {
  const chainId = report.safetyAttestation?.chainId ?? report.firewallEvaluation?.safetyEnvelope.chainId;
  const chain = chainFromId(chainId);
  if (!rpcUrl || !chain) {
    return unavailable(transactionHash, chainId, "RPC evidence is not configured for the signed safety-envelope chain.");
  }

  try {
    const client = createPublicClient({ chain, transport: http(rpcUrl, { timeout: 12_000 }) });
    const [receipt, transaction] = await Promise.all([
      client.getTransactionReceipt({ hash: transactionHash }),
      client.getTransaction({ hash: transactionHash })
    ]);
    const decoded = decodeRawTransaction({
      to: transaction.to ?? undefined,
      data: transaction.input,
      valueWei: transaction.value.toString(),
      chain: chain.name,
      tokenSymbol: report.parsedIntent.tokenIn
    });
    const actualApproval = decoded.kind === "erc20-approve" ? (decoded.isUnlimitedApproval ? "unlimited" : "exact") : "none";
    const envelope = report.firewallEvaluation?.safetyEnvelope;
    const recipientStatus = !envelope?.authorizedRecipient || !decoded.recipient ? "warn" : decoded.recipient.toLowerCase() === envelope.authorizedRecipient.toLowerCase() ? "pass" : "fail";
    const targetStatus = !transaction.to || !envelope?.allowedTargets.length ? "warn" : envelope.allowedTargets.some((target) => target.toLowerCase() === transaction.to?.toLowerCase()) ? "pass" : "fail";
    const minimumStatus = decoded.minimumAmountOutRaw === undefined ? "warn" : decoded.minimumAmountOutRaw === "0" ? "fail" : "pass";
    const deadlineStatus = !decoded.deadline ? "warn" : BigInt(decoded.deadline) * 1000n <= BigInt(Date.now()) ? "fail" : "pass";
    const actualAmountOut = sumOutputTransfers(receipt.logs, decoded.tokenPath?.at(-1), decoded.recipient);
    const outputStatus = decoded.minimumAmountOutRaw === undefined || actualAmountOut === undefined ? "warn" : actualAmountOut >= BigInt(decoded.minimumAmountOutRaw) ? "pass" : "fail";
    const checks: ComplianceCheck[] = [
      check("execution-status", "Execution status", receipt.status === "success" ? "pass" : "fail", "successful transaction", receipt.status, receipt.status === "success" ? "The testnet transaction completed successfully." : "The transaction reverted on-chain."),
      check("execution-chain", "Execution chain", chain.id === chainId ? "pass" : "fail", String(chainId ?? "signed chain"), String(chain.id), "The receipt must come from the chain authorized by the envelope."),
      check("execution-approval", "Realized approval", actualApproval === "unlimited" ? "fail" : "pass", report.firewallEvaluation?.safetyEnvelope.approvalPolicy ?? "exact-only", actualApproval, "The confirmed calldata is decoded again after execution to detect approval drift."),
      check("execution-calldata", "Confirmed calldata", decoded.kind === "unknown" ? "warn" : "pass", "supported decoded call", decoded.functionName, decoded.kind === "unknown" ? "The transaction confirmed, but its selector is outside the v0 decoder allowlist." : "Confirmed calldata matches a supported decoder path."),
      check("execution-target", "Transaction target", targetStatus, envelope?.allowedTargets.join(", ") || "committed router allowlist", transaction.to ?? "contract creation", "The confirmed target must be committed into the signed safety envelope."),
      check("execution-recipient", "Output recipient", recipientStatus, envelope?.authorizedRecipient ?? "connected wallet", decoded.recipient ?? "not decoded", "The confirmed output recipient must match the wallet that signed the safety envelope."),
      check("execution-minimum-output", "Minimum output", minimumStatus, "non-zero minimum output", decoded.minimumAmountOutRaw ?? "not decoded", "The confirmed calldata must retain price protection."),
      check("execution-deadline", "Execution deadline", deadlineStatus, "unexpired deadline", decoded.deadline ?? "not decoded", "The confirmed calldata must remain inside its execution window.")
      , check("execution-realized-output", "Realized output", outputStatus, decoded.minimumAmountOutRaw ?? "signed minimum", actualAmountOut?.toString() ?? "transfer log not identified", "Confirmed ERC-20 Transfer logs must deliver at least the calldata minimum to the authorized recipient.")
    ];
    const failed = checks.filter((item) => item.status === "fail");
    return {
      status: failed.length ? "EXECUTION_DRIFT" : "VERIFIED_COMPLIANT",
      transactionHash,
      chainId: chain.id,
      blockNumber: receipt.blockNumber.toString(),
      transactionStatus: receipt.status,
      actualGasUsed: receipt.gasUsed.toString(),
      effectiveGasPriceWei: receipt.effectiveGasPrice.toString(),
      actualRecipient: decoded.recipient,
      actualTarget: transaction.to ?? undefined,
      actualApproval,
      actualAmountOutRaw: actualAmountOut?.toString(),
      minimumAmountOutRaw: decoded.minimumAmountOutRaw,
      outputMeetsMinimum: actualAmountOut === undefined || decoded.minimumAmountOutRaw === undefined ? undefined : actualAmountOut >= BigInt(decoded.minimumAmountOutRaw),
      driftChecks: checks,
      summary: failed.length ? `${failed.length} post-execution constraint${failed.length === 1 ? "" : "s"} failed.` : `${checks.filter((item) => item.status === "pass").length}/${checks.length} available post-execution checks passed.`,
      analyzedAt: new Date().toISOString(),
      source: "rpc"
    };
  } catch (error) {
    return unavailable(transactionHash, chainId, error instanceof Error ? `RPC outcome unavailable: ${error.message}` : "RPC outcome unavailable.");
  }
}

function sumOutputTransfers(logs: readonly { address: `0x${string}`; data: `0x${string}`; topics: readonly `0x${string}`[] }[], outputToken?: `0x${string}`, recipient?: `0x${string}`) {
  if (!outputToken || !recipient) return undefined;
  let total = 0n;
  let matched = false;
  for (const log of logs) {
    if (log.address.toLowerCase() !== outputToken.toLowerCase()) continue;
    try {
      const topics = [...log.topics];
      if (!topics.length) continue;
      const decoded = decodeEventLog({ abi: transferEventAbi, data: log.data, topics: topics as [`0x${string}`, ...`0x${string}`[]], eventName: "Transfer" });
      if (decoded.args.to.toLowerCase() !== recipient.toLowerCase()) continue;
      total += decoded.args.value;
      matched = true;
    } catch {
      // Ignore unrelated logs from the output token contract.
    }
  }
  return matched ? total : undefined;
}

function unavailable(transactionHash: `0x${string}`, chainId: number | undefined, summary: string): ExecutionOutcome {
  return { status: "UNAVAILABLE", transactionHash, chainId, driftChecks: [], summary, analyzedAt: new Date().toISOString(), source: "local" };
}

function check(checkId: string, label: string, status: ComplianceCheck["status"], expected: string, observed: string, detail: string): ComplianceCheck {
  return { checkId, label, status, expected, observed, detail };
}

function chainFromId(chainId?: number): Chain | undefined {
  if (chainId === baseSepolia.id) return baseSepolia;
  if (chainId === sepolia.id) return sepolia;
  return undefined;
}
