"use client";

import { BadgeCheck, Database, FileSignature, Loader2, Save } from "lucide-react";
import Link from "next/link";
import type { ExecutionMode, SafetyAttestation, SafetyEnvelope, SentinelReport } from "@sentinelmesh/shared";
import type { TransactionStateSnapshot, Web3NetworkMetadata } from "@sentinelmesh/web3";
import { cn, shortHash } from "@/lib/format";
import { TransactionStatePanel } from "./TransactionStatePanel";

export function ReportCreationPanel({
  mode,
  selectedNetwork,
  canCreate,
  onChainReady,
  creating,
  report,
  txState,
  onModeChange,
  onCreate,
  safetyEnvelope,
  safetyAttestation,
  signingEnvelope,
  canSignEnvelope,
  onSignEnvelope
}: {
  mode: ExecutionMode;
  selectedNetwork: Web3NetworkMetadata;
  canCreate: boolean;
  onChainReady: boolean;
  creating: boolean;
  report: SentinelReport | null;
  txState: TransactionStateSnapshot;
  onModeChange: (mode: ExecutionMode) => void;
  onCreate: () => void;
  safetyEnvelope?: SafetyEnvelope;
  safetyAttestation: SafetyAttestation | null;
  signingEnvelope: boolean;
  canSignEnvelope: boolean;
  onSignEnvelope: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 text-white shadow-[0_18px_70px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="flex items-center gap-2">
        <Database className="text-[#67e8f9]" size={18} />
        <div>
          <div className="text-[11px] font-black uppercase text-[#67e8f9]">Evidence</div>
          <h2 className="mt-1 font-black text-white">Generate report</h2>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Creates a deterministic report first, then optionally anchors only its hash in the testnet registry.
      </p>

      <div className="mt-4 grid grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1">
        {(["Simulation Only", "Report On-chain"] as ExecutionMode[]).map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onModeChange(option)}
            className={cn(
              "rounded-lg px-2 py-2 text-xs font-bold transition",
              mode === option ? "bg-[#22d3ee] text-black shadow-[0_0_18px_rgba(34,211,238,0.22)]" : "text-white/50 hover:text-white"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-white/50">
        Target adapter: <span className="font-semibold text-white">{selectedNetwork.label}</span>
        {selectedNetwork.isPlaceholder && <span> placeholder metadata</span>}
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-white/55">
        {mode === "Simulation Only"
          ? "Simulation mode saves a local report and recomputes its deterministic hash. It does not ask the wallet to sign."
          : "On-chain mode still creates the report locally first, then asks the wallet to anchor only the hash in the testnet registry."}
      </div>

      {mode === "Report On-chain" && !onChainReady && (
        <div className="mt-3 rounded-xl border border-amber-300/25 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
          Connect and authenticate a wallet, switch to {selectedNetwork.label}, and configure the deployed registry before anchoring.
        </div>
      )}

      {safetyEnvelope && (
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">EIP-712 safety envelope</div>
              <div className="mt-1 font-mono text-[10px] text-white/40">{shortHash(safetyEnvelope.envelopeHash)} · expires {new Date(safetyEnvelope.expiresAt).toLocaleTimeString()}</div>
            </div>
            {safetyAttestation && <BadgeCheck size={18} className="text-[#22d3ee]" />}
          </div>
          <button type="button" onClick={onSignEnvelope} disabled={!canSignEnvelope || signingEnvelope || Boolean(safetyAttestation)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#22d3ee]/25 bg-[#22d3ee]/10 px-3 py-2 text-xs font-bold text-[#67e8f9] disabled:opacity-45">
            {signingEnvelope ? <Loader2 className="animate-spin" size={14} /> : safetyAttestation ? <BadgeCheck size={14} /> : <FileSignature size={14} />}
            {safetyAttestation ? "Envelope signed" : signingEnvelope ? "Waiting for wallet..." : "Sign safety envelope"}
          </button>
          {!canSignEnvelope && <p className="mt-2 text-[10px] leading-4 text-white/35">Connect and authenticate a wallet to create cryptographic proof. Unsigned simulation reports remain available.</p>}
        </div>
      )}

      <button
        onClick={onCreate}
        disabled={!canCreate || creating}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#22d3ee] px-4 py-3 text-sm font-black text-black shadow-[0_0_24px_rgba(34,211,238,0.25)] hover:bg-[#67e8f9] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save size={17} />
        {creating ? "Creating..." : "Generate Report"}
      </button>

      <div className="mt-4">
        <TransactionStatePanel snapshot={txState} explorerTemplate={selectedNetwork.explorer?.txUrlTemplate} />
      </div>

      {report && (
        <div className="mt-4 rounded-xl border border-[#22d3ee]/25 bg-[#22d3ee]/10 p-3 text-sm text-[#67e8f9]">
          <div className="flex items-center gap-2 font-semibold">
            <BadgeCheck size={18} />
            Report saved
          </div>
          <div className="mt-2 text-xs">{shortHash(report.reportHash)}</div>
          <Link className="mt-3 inline-flex text-sm font-semibold text-white underline" href={`/reports/${report.id}`}>
            Open report detail
          </Link>
        </div>
      )}
    </div>
  );
}
