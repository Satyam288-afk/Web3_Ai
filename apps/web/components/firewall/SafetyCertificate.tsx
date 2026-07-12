import { AlertTriangle, CheckCircle2, CircleDashed, ShieldCheck, XCircle } from "lucide-react";
import type { FirewallEvaluation } from "@sentinelmesh/shared";
import { cn, shortHash } from "@/lib/format";

export function SafetyCertificate({ evaluation }: { evaluation: FirewallEvaluation | null }) {
  if (!evaluation) return null;

  const { safetyEnvelope: envelope, intentCompliance: compliance, safetyDelta: delta } = evaluation;

  return (
    <section className="border-y border-[#22d3ee]/20 py-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#67e8f9]">
            <ShieldCheck size={15} /> Proof of safe execution
          </div>
          <h2 className="mt-2 text-xl font-black">Intent compliance certificate</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
            Deterministic constraints derived from the reviewed intent, active policy, quote evidence, and supplied calldata.
          </p>
        </div>
        <div className={cn("text-right", compliance.status === "BLOCKED" ? "text-red-300" : compliance.status === "COMPLIANT" ? "text-[#67e8f9]" : "text-amber-200")}>
          <div className="text-xs font-black uppercase tracking-wider">{compliance.status.replaceAll("_", " ")}</div>
          <div className="mt-1 text-3xl font-black">{compliance.passedChecks}/{compliance.totalChecks}</div>
          <div className="text-[11px] text-white/45">constraints proven</div>
        </div>
      </div>

      <div className="mt-6 grid gap-x-7 gap-y-3 md:grid-cols-2">
        {compliance.checks.map((check) => (
          <div key={check.checkId} className="flex items-start gap-3 border-b border-white/8 py-3">
            {check.status === "pass" ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#22d3ee]" size={17} />
            ) : check.status === "fail" ? (
              <XCircle className="mt-0.5 shrink-0 text-red-300" size={17} />
            ) : (
              <AlertTriangle className="mt-0.5 shrink-0 text-amber-200" size={17} />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                {check.label}
                <span className="text-[10px] font-semibold uppercase text-white/35">{check.observed}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-white/45">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-white/40">Safety envelope</div>
          <dl className="mt-3 space-y-2 text-xs">
            <Row label="Envelope hash" value={shortHash(envelope.envelopeHash)} />
            <Row label="Maximum amount" value={`${envelope.maxAmountIn ?? "-"} ${envelope.tokenIn ?? ""}`} />
            <Row label="Maximum slippage" value={`${envelope.maxSlippagePercent}%`} />
            <Row label="Approval policy" value={envelope.approvalPolicy} />
            <Row label="Expires" value={new Date(envelope.expiresAt).toLocaleTimeString()} />
          </dl>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] font-black uppercase tracking-wider text-white/40">Safety delta</div>
            <span className="text-sm font-black text-[#67e8f9]">−{delta.riskReduction} risk points</span>
          </div>
          <div className="mt-3 flex items-end gap-3">
            <div>
              <div className="text-[10px] uppercase text-white/35">Analyzed</div>
              <div className="text-3xl font-black text-white/60">{delta.originalRiskScore}</div>
            </div>
            <div className="pb-2 text-white/25">→</div>
            <div>
              <div className="text-[10px] uppercase text-[#67e8f9]/70">Policy-adjusted</div>
              <div className="text-3xl font-black text-[#67e8f9]">{delta.protectedRiskScore}</div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-xs leading-5 text-white/55">
            {delta.improvements.map((improvement) => (
              <li key={improvement} className="flex gap-2"><CircleDashed className="mt-1 shrink-0 text-[#22d3ee]" size={12} /> {improvement}</li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] leading-4 text-white/30">
            Safety Delta is a deterministic comparison, not a guarantee of execution outcome. Source: {delta.dataSource}.
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-2">
      <dt className="text-white/40">{label}</dt>
      <dd className="truncate font-semibold text-white/75">{value}</dd>
    </div>
  );
}
