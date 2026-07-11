import { createHash } from "node:crypto";
import { isAddress, verifyTypedData } from "viem";
import { safetyEnvelopeTypedData } from "@sentinelmesh/web3";
import type { DeFiIntent, SafetyAttestation, SafetyEnvelope } from "@sentinelmesh/shared";

export function recomputeSafetyEnvelopeHash(envelope: SafetyEnvelope): `0x${string}` {
  const { envelopeHash: _ignored, ...hashable } = envelope;
  return hashPayload(hashable);
}

export function validateSafetyEnvelope(envelope: SafetyEnvelope, intent: DeFiIntent, now = Date.now()) {
  if (recomputeSafetyEnvelopeHash(envelope).toLowerCase() !== envelope.envelopeHash.toLowerCase()) {
    throw new Error("Safety envelope hash does not match its canonical constraints");
  }
  if (new Date(envelope.expiresAt).getTime() <= now) throw new Error("Safety envelope has expired");
  if (envelope.action !== intent.action) throw new Error("Safety envelope action does not match the reviewed intent");
  if (normalize(envelope.tokenIn) !== normalize(intent.tokenIn) || normalize(envelope.tokenOut) !== normalize(intent.tokenOut)) {
    throw new Error("Safety envelope token pair does not match the reviewed intent");
  }
  if ((envelope.maxAmountIn ?? "") !== (intent.amount ?? "")) throw new Error("Safety envelope amount does not match the reviewed intent");
  const intentSlippage = parsePercent(intent.constraints.maxSlippage);
  if (intentSlippage !== undefined && envelope.maxSlippagePercent > intentSlippage) {
    throw new Error("Safety envelope widens the reviewed slippage limit");
  }
}

export async function verifySafetyAttestation({
  envelope,
  attestation,
  expectedSigner,
  intent
}: {
  envelope: SafetyEnvelope;
  attestation: SafetyAttestation;
  expectedSigner: `0x${string}`;
  intent: DeFiIntent;
}) {
  validateSafetyEnvelope(envelope, intent);
  if (!isAddress(expectedSigner) || attestation.signer.toLowerCase() !== expectedSigner.toLowerCase()) {
    throw new Error("Safety envelope signer does not match the authenticated wallet");
  }
  if (attestation.envelopeHash.toLowerCase() !== envelope.envelopeHash.toLowerCase()) {
    throw new Error("Safety attestation is bound to a different envelope hash");
  }
  if (attestation.chainId !== envelope.chainId) throw new Error("Safety attestation chain does not match the envelope");

  const verified = await verifyTypedData({
    ...safetyEnvelopeTypedData(envelope, expectedSigner),
    address: expectedSigner,
    signature: attestation.signature
  });
  if (!verified) throw new Error("Safety envelope signature is invalid");
  return true;
}

function hashPayload(payload: unknown): `0x${string}` {
  return `0x${createHash("sha256").update(stableStringify(payload)).digest("hex")}`;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`).join(",")}}`;
}

function normalize(value?: string) {
  return (value ?? "").trim().toUpperCase();
}

function parsePercent(value?: string) {
  const parsed = Number.parseFloat((value ?? "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}
