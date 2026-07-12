import Link from "next/link";
import { ArrowRight, Check, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative flex min-h-[calc(100svh-65px)] items-center">
        <div className="pointer-events-none absolute inset-0 landing-blue-field" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12">
          <div>
            <div className="mb-7 flex items-center gap-2 text-xs font-semibold tracking-wide text-white/55">
              <span className="h-1.5 w-1.5 rounded-full bg-[#72a7ff] shadow-[0_0_16px_#72a7ff]" />
              Pre-sign risk review for DeFi
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[88px]">
              Know what you’re signing.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
              SentinelMesh explains transaction risk, recommends a safer route, and saves verifiable evidence before your wallet signs.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/app" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#dce9ff]">
                Review a transaction <ArrowRight size={16} />
              </Link>
              <Link href="/reports" className="text-sm font-medium text-white/50 transition hover:text-white">
                View reports
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40">
              <span className="inline-flex items-center gap-2"><Check size={13} /> Non-custodial</span>
              <span className="inline-flex items-center gap-2"><Check size={13} /> Explainable risk</span>
              <span className="inline-flex items-center gap-2"><Check size={13} /> User-controlled signing</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-24 rounded-full bg-[#2563eb]/20 blur-[100px]" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#72a7ff]/12 text-[#8db8ff]"><Shield size={18} /></span>
                  <div><div className="text-sm font-medium">Transaction review</div><div className="mt-0.5 text-xs text-white/35">Before wallet confirmation</div></div>
                </div>
                <span className="rounded-full border border-[#72a7ff]/25 px-3 py-1 text-[11px] font-medium text-[#9bc0ff]">LOW RISK</span>
              </div>

              <div className="py-7">
                <div className="text-xs text-white/35">Intent</div>
                <div className="mt-2 text-xl font-medium leading-8">Swap 0.2 ETH to USDC with low slippage</div>
              </div>

              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                <ProofValue label="Risk score" value="18 / 100" />
                <ProofValue label="Route" value="Protected" />
                <ProofValue label="Slippage" value="0.5% max" />
                <ProofValue label="Custody" value="Never" />
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-white/40">
                <Check size={14} className="text-[#8db8ff]" /> 7 safety checks completed
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProofValue({ label, value }: { label: string; value: string }) {
  return <div className="bg-[#07090d] p-4"><div className="text-[11px] text-white/35">{label}</div><div className="mt-2 text-sm font-medium text-white/85">{value}</div></div>;
}
