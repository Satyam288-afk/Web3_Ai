import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, Database, FileCheck2, ShieldCheck, WalletCards } from "lucide-react";

const loop = ["Ask", "Parse", "Analyze", "Recommend", "Verify", "Save", "Share"];

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid min-h-[calc(100vh-66px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-teal/30 bg-teal/10 px-3 py-2 text-sm text-teal">
              <ShieldCheck size={16} />
              Multi-agent DeFi risk copilot
            </div>
            <h1 className="text-4xl font-semibold tracking-normal text-white sm:text-6xl">
              SentinelMesh
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Type a DeFi intent, get a structured risk assessment, choose a safer route, and anchor the report hash on testnet for verification.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-teal/90"
              >
                Open Copilot
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/reports"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/8"
              >
                View Reports
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-2">
              {loop.map((item) => (
                <span key={item} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-white/12 bg-panel shadow-glow">
              <Image
                src="/work-distribution.png"
                alt="SentinelMesh team work distribution"
                width={1400}
                height={850}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Intent parser", "Converts plain English into editable DeFi intent fields.", Bot],
            ["Risk engine", "Scores slippage, liquidity, price impact, token, gas, route, and MEV signals.", ShieldCheck],
            ["Report registry", "Stores only report hashes on testnet; it never executes swaps.", Database],
            ["Verification", "Checks local report hash against the anchored hash.", FileCheck2]
          ].map(([title, body, Icon]) => (
            <div key={String(title)} className="rounded-lg border border-white/10 bg-panel/86 p-5">
              <Icon className="mb-4 text-teal" size={24} />
              <h2 className="font-semibold text-white">{String(title)}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{String(body)}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-violet/25 bg-violet/10 p-5 text-sm leading-6 text-slate-300">
          <div className="mb-2 flex items-center gap-2 font-semibold text-violet">
            <WalletCards size={18} />
            V0 safety boundary
          </div>
          SentinelMesh recommends routes and anchors risk reports. It does not claim guaranteed MEV protection, does not custody funds, and does not execute mainnet swaps.
        </div>
      </section>
    </main>
  );
}
