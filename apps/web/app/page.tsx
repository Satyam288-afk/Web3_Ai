import Link from "next/link";
import { ArrowRight, Check, FileCheck2, ShieldCheck } from "lucide-react";
import { LazyAppControlPlane3D } from "@/components/hero/LazyAppControlPlane3D";

const flow = [
  { number: "01", title: "Describe", copy: "State the DeFi action in plain English. SentinelMesh translates it into structured transaction constraints." },
  { number: "02", title: "Review", copy: "We evaluate slippage, liquidity, price impact, token risk, route complexity, MEV exposure, and wallet policy." },
  { number: "03", title: "Decide", copy: "Receive a safer route recommendation and a tamper-evident report before your wallet signs." }
];

const checks = [
  ["Slippage limit", "0.50%", "pass"],
  ["Token & liquidity", "Known · deep", "pass"],
  ["Price impact", "0.08%", "pass"],
  ["MEV exposure", "Low", "pass"]
];

export default function LandingPage() {
  return (
    <main className="landing-editorial min-h-screen overflow-hidden bg-black text-white">
      <section className="relative flex min-h-[calc(100svh-65px)] items-center overflow-hidden border-b border-white/[0.07]">
        <div className="absolute inset-0 opacity-90"><LazyAppControlPlane3D /></div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28),rgba(0,0,0,0.22)_48%,#000_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(0,0,0,0.18)_40%,rgba(0,0,0,0.72)_88%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-24 text-center sm:px-8">
          <div className="landing-rise landing-delay-1 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            Pre-sign protection for DeFi
          </div>

          <h1 className="landing-rise landing-delay-2 mt-9 max-w-6xl text-5xl leading-[0.94] tracking-[-0.05em] sm:text-7xl lg:text-[92px]">
            <span className="landing-serif block">Understand every transaction.</span>
            <span className="landing-serif-italic mt-2 block text-[#7d8791]">Before you sign.</span>
          </h1>

          <p className="landing-rise landing-delay-3 mt-8 max-w-2xl text-base leading-7 text-[#89939d] sm:text-lg">
            SentinelMesh analyzes DeFi intent, transaction data, market conditions, and wallet policies before approval—then recommends a safer path and creates verifiable evidence of the decision.
          </p>

          <div className="landing-rise landing-delay-4 mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/app" className="group inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-black transition hover:bg-cyan-50">
              Analyze a transaction <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/reports" className="inline-flex h-[54px] items-center justify-center rounded-full border border-white/15 bg-black/20 px-7 text-sm font-medium text-white/75 backdrop-blur hover:border-white/30 hover:text-white">
              View risk reports
            </Link>
          </div>

          <div className="landing-rise landing-delay-5 mt-16 flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
            {["Pre-sign risk analysis", "Explainable decisions", "Non-custodial", "Verifiable reports"].map((item) => (
              <span key={item} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-white/[0.07] px-5 py-28 sm:px-8 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="The flow" title="Three steps between intent" italic="and signature." />
          <div className="mt-20 grid border border-white/[0.09] md:grid-cols-3">
            {flow.map((item) => (
              <article key={item.number} className="min-h-72 border-b border-white/[0.09] p-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:p-11">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#75808b]"><span>{item.number}</span><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /></div>
                <h3 className="landing-serif mt-14 text-3xl">{item.title}</h3>
                <p className="mt-5 text-sm leading-7 text-[#7d8791]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="analysis" className="border-b border-white/[0.07] px-5 py-28 sm:px-8 lg:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <SectionHeading eyebrow="Risk analysis" title="See the decision," italic="not a mystery score." />
            <p className="mt-8 max-w-lg text-base leading-8 text-[#7d8791]">Every score is broken into concrete signals. Change the reviewed intent, constraints, or route and SentinelMesh recalculates the decision deterministically.</p>
            <Link href="/app" className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-white/80 hover:text-cyan-300">Open the analyzer <ArrowRight size={15} /></Link>
          </div>

          <div className="overflow-hidden border border-white/[0.1] bg-[#030405]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35"><span>Transaction review</span><span className="text-cyan-400">Low risk</span></div>
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="border-b border-white/[0.08] p-7 lg:border-b-0 lg:border-r">
                <div className="text-xs text-white/35">Risk score</div>
                <div className="landing-serif mt-4 text-7xl">18</div>
                <div className="mt-1 text-sm text-white/30">out of 100</div>
                <div className="mt-8 h-px bg-white/10"><div className="h-px w-[18%] bg-cyan-400 shadow-[0_0_12px_#22d3ee]" /></div>
                <div className="mt-8 text-xs text-white/35">Recommended route</div>
                <div className="mt-2 text-sm font-medium">Protected route</div>
              </div>
              <div className="divide-y divide-white/[0.08]">
                {checks.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-6 px-6 py-5">
                    <span className="text-sm text-[#818b95]">{label}</span>
                    <span className="flex items-center gap-2 text-sm text-white/80"><Check size={13} className="text-cyan-400" />{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="evidence" className="border-b border-white/[0.07] px-5 py-28 sm:px-8 lg:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="order-2 overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#030405] p-7 font-mono text-xs leading-8 text-[#727d87] lg:order-1 lg:p-10">
            <div className="mb-5 text-white/75">report.sentinelmesh.json</div>
            <pre className="overflow-x-auto whitespace-pre-wrap">{`{
  "intent": "swap 0.2 ETH to USDC",
  "riskScore": 18,
  "decision": "PROTECTED_ROUTE",
  "signals": ["slippage", "liquidity", "mev"],
  "engine": "sentinelmesh-risk-v0.3",
  "reportHash": "0x6c2a...88db"
}`}</pre>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="Verifiable report" title="Evidence of the decision," italic="not just the outcome." />
            <p className="mt-8 max-w-xl text-base leading-8 text-[#7d8791]">Each review produces a canonical, tamper-evident report. Users and agents can independently inspect the signals, policy, recommendation, and deterministic report hash.</p>
            <div className="mt-9 space-y-4 text-sm text-[#9099a2]">
              {["Canonical deterministic hash", "Reproducible risk factors", "Portable across wallets and agents"].map((item) => <div key={item} className="flex items-center gap-4"><span className="h-px w-7 bg-cyan-400" />{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[680px] items-center justify-center overflow-hidden px-5 py-28 text-center sm:px-8">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.09] blur-[100px]" />
        <div className="relative max-w-4xl">
          <h2 className="text-5xl leading-[0.96] tracking-[-0.045em] sm:text-7xl"><span className="landing-serif block">See a transaction</span><span className="landing-serif-italic mt-2 block text-[#7d8791]">before it’s signed.</span></h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-[#7d8791]">Bring SentinelMesh into your wallet or agent workflow and turn every approval into an informed decision.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/app" className="inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-semibold text-black hover:bg-cyan-50">Analyze a transaction <ArrowRight size={16} /></Link>
            <Link href="/reports" className="inline-flex h-[54px] items-center justify-center rounded-full border border-white/15 px-7 text-sm text-white/70 hover:text-white">View reports</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-white/30 sm:flex-row">
          <span className="flex items-center gap-2 text-white/55"><ShieldCheck size={15} /> SentinelMesh</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Non-custodial · Testnet analysis · User-controlled signing</span>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({ eyebrow, title, italic }: { eyebrow: string; title: string; italic: string }) {
  return <div><div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#78838d]">{eyebrow}</div><h2 className="mt-7 text-4xl leading-[1.02] tracking-[-0.04em] sm:text-6xl"><span className="landing-serif block">{title}</span><span className="landing-serif-italic mt-1 block text-[#7d8791]">{italic}</span></h2></div>;
}
