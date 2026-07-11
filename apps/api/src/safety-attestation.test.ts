import assert from "node:assert/strict";
import test from "node:test";
import { privateKeyToAccount } from "viem/accounts";
import { safetyEnvelopeTypedData } from "@sentinelmesh/web3";
import type { DeFiIntent, SafetyAttestation, SafetyEnvelope } from "@sentinelmesh/shared";
import { recomputeSafetyEnvelopeHash, verifySafetyAttestation } from "./safety-attestation.js";

const account = privateKeyToAccount("0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
const intent: DeFiIntent = { action: "swap", tokenIn: "ETH", tokenOut: "USDC", amount: "0.2", chain: "base", priority: "safety", constraints: { maxSlippage: "0.5%", riskTolerance: "low" } };

async function signedFixture() {
  const base = {
    version: "sentinelmesh-safety-envelope-v1" as const,
    chainId: 8453,
    action: "swap" as const,
    chain: "base",
    tokenIn: "ETH",
    tokenOut: "USDC",
    maxAmountIn: "0.2",
    minimumAmountOut: "600000000",
    maxSlippagePercent: 0.5,
    allowedProtocols: ["0x", "Uniswap"],
    allowedTargets: ["0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"] as `0x${string}`[],
    authorizedRecipient: account.address,
    approvalPolicy: "none" as const,
    nonce: `0x${"11".repeat(32)}` as `0x${string}`,
    expiresAt: new Date(Date.now() + 60_000).toISOString()
  };
  const envelope = { ...base, envelopeHash: "0x" as `0x${string}` };
  envelope.envelopeHash = recomputeSafetyEnvelopeHash(envelope);
  const signature = await account.signTypedData(safetyEnvelopeTypedData(envelope, account.address));
  const attestation: SafetyAttestation = { signer: account.address, chainId: envelope.chainId, envelopeHash: envelope.envelopeHash, signature, signedAt: new Date().toISOString(), verificationStatus: "verified" };
  return { envelope: envelope as SafetyEnvelope, attestation };
}

test("verifies an EIP-712 safety envelope bound to the reviewed intent", async () => {
  const fixture = await signedFixture();
  assert.equal(await verifySafetyAttestation({ ...fixture, expectedSigner: account.address, intent }), true);
});

test("rejects a safety envelope whose constraints were changed after signing", async () => {
  const fixture = await signedFixture();
  fixture.envelope.maxSlippagePercent = 5;
  await assert.rejects(() => verifySafetyAttestation({ ...fixture, expectedSigner: account.address, intent }), /hash does not match/);
});
