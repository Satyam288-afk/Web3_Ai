import Link from "next/link";
import { ArrowRight, Eye, FileCheck2, KeyRound, ScanLine, ShieldCheck, Wallet } from "lucide-react";
import { LazyAppControlPlane3D } from "@/components/hero/LazyAppControlPlane3D";

const trustSignals = [
  { icon: ShieldCheck, label: "Pre-sign checks" },
  { icon: Eye, label: "Explainable risk" },
  { icon: KeyRound, label: "Non-custodial" },
  { icon: FileCheck2, label: "Verifiable reports" }
];

const capabilities = ["Intent parsing", "Risk engine", "Route policy", "EIP-712", "SIWE", "Report evidence"];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020204] text-white">
      <section className="relative flex min-h-[calc(100svh-65px)] flex-col overflow-hidden">
        <div className="absolute inset-0 opacity-80">
          <LazyAppControlPlane3D />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(56,92,255,0.12),transparent_32%),linear-gradient(180deg,rgba(2,2,4,0.34)_0%,rgba(2,2,4,0.18)_45%,#020204_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,2,4,0.52),transparent_35%,transparent_65%,rgba(2,2,4,0.52))]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-20 text-center sm:px-8">
          <div className="landing-rise landing-delay-1 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-medium text-white/75 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
            Wallet safety, before the signature
          </div>

          <h1 className="landing-rise landing-delay-2 mt-8 max-w-5xl text-5xl font-bold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[84px]">
            Every transaction.
            <span className="mt-3 block bg-gradient-to-r from-white via-[#a9bcff] to-[#795cff] bg-clip-text text-transparent drop-shadow-[0_0_32px_rgba(88,99,255,0.22)]">
              Understood before signing.
            </span>
          </h1>

          <p className="landing-rise landing-delay-3 mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            SentinelMesh turns a plain-English DeFi action into an explainable risk decision, a safer route, and evidence you can verify later.
          </p>

          <div className="landing-rise landing-delay-4 mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/app" className="group relative inline-flex h-[52px] items-center justify-center gap-2 overflow-hidden rounded-full bg-[#5136f5] px-7 text-sm font-semibold text-white shadow-[0_0_40px_rgba(81,54,245,0.34)] transition hover:bg-[#674eff]">
              <span className="relative">Start risk review</span>
              <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/reports" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.045] px-6 text-sm font-medium text-white/70 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white">
              <FileCheck2 size={16} /> View reports
            </Link>
          </div>

          <div className="landing-rise landing-delay-5 mt-14 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {trustSignals.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-white/55">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] backdrop-blur-lg"><Icon size={18} /></span>
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="landing-rise landing-delay-5 mt-12 flex items-center gap-5 text-xs text-white/35">
            <span className="inline-flex items-center gap-2"><ScanLine size={14} /> Testnet analysis</span>
            <span className="h-3 w-px bg-white/15" />
            <span className="inline-flex items-center gap-2"><Wallet size={14} /> You approve every signature</span>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/[0.06] bg-black/25 py-5 backdrop-blur-sm">
          <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-[0.24em] text-white/25">Built around verifiable controls</p>
          <div className="capability-marquee overflow-hidden">
            <div className="capability-track flex w-max items-center gap-12 pr-12 text-xs font-medium text-white/38">
              {[...capabilities, ...capabilities].map((item, index) => <span key={`${item}-${index}`} className="whitespace-nowrap">{item}</span>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
