import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  CircleGauge,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  Route,
  ShieldCheck,
  Sparkles
} from "lucide-react";

const proofChecks = [
  ["Intent scope", "PASS", "Swap · ETH → USDC"],
  ["Approval policy", "PASS", "Exact amount only"],
  ["Slippage bound", "PASS", "≤ 0.50%"]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030806] text-white">
      <section className="relative min-h-[calc(100svh-65px)] border-b border-white/8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(126,237,97,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(126,237,97,0.025)_1px,transparent_1px)] bg-[length:48px_48px]" />
        <div className="pointer-events-none absolute left-1/2 top-[46%] h-[720px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,255,134,0.30)_0%,rgba(33,179,94,0.15)_32%,rgba(5,20,12,0)_70%)] blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-[46%] h-80 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#63ff86]/20 blur-[100px]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-65px)] max-w-6xl flex-col items-center justify-center px-5 pb-16 pt-12 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7eed61]/25 bg-[#7eed61]/8 px-4 py-2 text-xs font-bold text-[#afff98] shadow-[0_0_32px_rgba(126,237,97,0.10)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7eed61] shadow-[0_0_12px_#7eed61]" />
            Proof of Safe Execution · Base Sepolia
          </div>

          <h1 className="mt-8 max-w-5xl text-6xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[96px]">
            Every intent.
            <span className="mt-2 block bg-gradient-to-b from-white via-[#dfffd7] to-[#71e96d] bg-clip-text text-transparent [text-shadow:0_0_60px_rgba(126,237,97,0.18)]">
              Proven before signing.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/55 sm:text-lg">
            SentinelMesh converts a plain-English DeFi action into deterministic safety constraints, verifies the wallet request, and saves tamper-evident proof.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/app" className="inline-flex items-center gap-2 rounded-xl bg-[#7eed61] px-6 py-3.5 text-sm font-black text-[#031007] shadow-[0_0_34px_rgba(126,237,97,0.30)] transition hover:-translate-y-0.5 hover:bg-[#9aff7e]">
              Run safety review <ArrowRight size={16} />
            </Link>
            <Link href="/reports" className="inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/[0.045] px-6 py-3.5 text-sm font-bold text-white/75 transition hover:border-[#7eed61]/35 hover:text-white">
              <FileCheck2 size={16} /> View evidence
            </Link>
          </div>

          <div className="mt-12 grid w-full max-w-2xl grid-cols-3 border-t border-white/10 pt-7">
            <HeroMetric icon={<Bot size={16} />} value="5" label="Specialized agents" />
            <HeroMetric icon={<CircleGauge size={16} />} value="7" label="Safety checks" />
            <HeroMetric icon={<LockKeyhole size={16} />} value="0" label="Funds in custody" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#7eed61]">Interactive proof</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">See what the wallet is really asking.</h2>
          </div>
          <Link href="/app" className="text-sm font-bold text-white/45 hover:text-[#a8ff8d]">Open control plane →</Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070b09] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-[#7eed61]"><Activity size={16} /></span>
              <div><div className="text-sm font-bold">Live safety review</div><div className="text-xs text-white/35">Deterministic fixture · no wallet required</div></div>
            </div>
            <span className="rounded-lg border border-[#7eed61]/20 bg-[#7eed61]/8 px-3 py-1.5 text-[11px] font-black text-[#a8ff8d]">ALLOW</span>
          </div>

          <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="border-b border-white/8 p-5 lg:border-b-0 lg:border-r">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Reviewed intent</div>
              <div className="mt-3 text-xl font-bold sm:text-2xl">Swap 0.2 ETH to USDC safely with low slippage.</div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {proofChecks.map(([label, status, detail]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-center justify-between gap-2"><span className="text-xs text-white/40">{label}</span><CheckCircle2 size={14} className="text-[#7eed61]" /></div>
                    <div className="mt-4 text-sm font-bold">{detail}</div>
                    <div className="mt-1 font-mono text-[10px] text-[#7eed61]">{status}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-5">
                <div><div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Recommended route</div><div className="mt-1 font-bold">Protected route simulation</div></div>
                <span className="inline-flex items-center gap-2 rounded-lg border border-[#7eed61]/20 bg-[#7eed61]/8 px-3 py-2 text-xs font-bold text-[#a8ff8d]"><Route size={14} /> Deep liquidity · exact approval</span>
              </div>
            </div>

            <div className="relative overflow-hidden p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(126,237,97,0.14),transparent_52%)]" />
              <div className="relative">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Safety delta</div>
                <div className="mt-5 flex items-end gap-4"><span className="text-6xl font-black">18</span><span className="mb-2 text-white/25">→</span><span className="text-6xl font-black text-[#7eed61]">18</span></div>
                <p className="mt-3 text-sm leading-6 text-white/45">Already inside the active policy. No artificial risk reduction claimed.</p>
                <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full w-[18%] rounded-full bg-[#7eed61] shadow-[0_0_16px_#7eed61]" /></div>
                <div className="mt-3 flex justify-between font-mono text-[10px] uppercase text-white/30"><span>Low risk</span><span>18 / 100</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <MetricPanel className="lg:col-span-2" label="Proof coverage" icon={<BadgeCheck size={18} />}>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-5"><div><span className="text-5xl font-black">7/7</span><span className="ml-3 text-white/30">constraints evaluated</span></div><span className="text-sm font-bold text-[#7eed61]">Certificate ready</span></div>
            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full w-full rounded-full bg-gradient-to-r from-[#287c45] to-[#7eed61]" /></div>
          </MetricPanel>
          <MetricPanel label="Registry" icon={<Fingerprint size={18} />}>
            <div className="mt-5 text-4xl font-black">SHA-256</div><p className="mt-3 text-sm text-white/40">Canonical report payload ready for testnet anchoring.</p>
          </MetricPanel>
          <MetricPanel label="Execution boundary" icon={<ShieldCheck size={18} />}>
            <div className="mt-5 text-4xl font-black">Non-custodial</div><p className="mt-3 text-sm text-white/40">SentinelMesh analyzes and attests. The user controls every signature.</p>
          </MetricPanel>
          <MetricPanel className="lg:col-span-2" label="Agent trace" icon={<Sparkles size={18} />}>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">{["Intent parsed", "Risk explained", "Policy verified"].map((item) => <div key={item} className="flex items-center gap-2 border-b border-white/8 pb-3 text-sm font-bold"><CheckCircle2 size={15} className="text-[#7eed61]" />{item}</div>)}</div>
          </MetricPanel>
        </div>
      </section>
    </main>
  );
}

function HeroMetric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="px-2 text-center"><div className="flex items-center justify-center gap-2 text-2xl font-black text-white">{icon}{value}</div><div className="mt-1 text-[11px] text-white/35">{label}</div></div>;
}

function MetricPanel({ label, icon, children, className = "" }: { label: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <div className={`min-h-52 rounded-2xl border border-white/10 bg-[#070b09] p-6 ${className}`}><div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/35"><span>{label}</span><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-white/55">{icon}</span></div>{children}</div>;
}
