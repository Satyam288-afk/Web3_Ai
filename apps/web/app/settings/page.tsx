import { Settings, SlidersHorizontal } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-white/10 bg-panel/92 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-teal/30 bg-teal/10 text-teal">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Product Settings</h1>
            <p className="mt-1 text-sm text-slate-400">Default runtime configuration for the hackathon v0.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {[
            ["Execution mode", "Simulation Only or Report On-chain. SentinelMesh v0 anchors report hashes; it does not execute swaps."],
            ["Network selector", "Base Sepolia is the preferred registry network. Ethereum Sepolia is available for fallback deployments."],
            ["Registry address", "Set NEXT_PUBLIC_REPORT_REGISTRY_ADDRESS after deploying SentinelReportRegistry."],
            ["API URL", "Set NEXT_PUBLIC_API_URL for Vercel deployments. Local default is http://localhost:4000."]
          ].map(([title, body]) => (
            <div key={title} className="rounded-md border border-white/10 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <SlidersHorizontal className="text-violet" size={16} />
                {title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
