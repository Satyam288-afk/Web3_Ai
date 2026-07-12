"use client";

import { useRef } from "react";
import { AlertTriangle, ArrowUp, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";

export const intentExamples = [
  {
    label: "Safe swap",
    prompt: "Swap 0.2 ETH to USDC safely with low slippage",
    detail: "Low risk baseline"
  },
  {
    label: "High slippage",
    prompt: "Swap 1 ETH to USDC fast and allow high slippage",
    detail: "Warn on execution quality"
  },
  {
    label: "Unknown token",
    prompt: "Swap 0.5 ETH to MOONSAFE",
    detail: "Token and liquidity risk"
  },
  {
    label: "Large trade",
    prompt: "Swap 25 ETH to USDC with best price",
    detail: "Split-order recommendation"
  },
  {
    label: "Unsupported bridge",
    prompt: "Bridge 0.3 ETH from Ethereum to Solana",
    detail: "Analysis-only v0 path"
  },
  {
    label: "Critical block",
    prompt: "Swap 10 ETH to an unknown token with 20% slippage",
    detail: "Blocked unsafe route"
  }
];

export function IntentInput({
  prompt,
  loading,
  error,
  onPromptChange,
  onSubmit
}: {
  prompt: string;
  loading: boolean;
  error: string | null;
  onPromptChange: (prompt: string) => void;
  onSubmit: (prompt?: string) => void;
}) {
  const fixtureRailRef = useRef<HTMLDivElement>(null);

  function scrollFixtures(direction: -1 | 1) {
    fixtureRailRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <textarea
        aria-label="DeFi intent"
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") onSubmit();
        }}
        placeholder="Describe the DeFi action you want to assess..."
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.07] p-4 text-base leading-7 text-white outline-none placeholder:text-white/35 focus:border-[#22d3ee]/40"
      />
      <div className="mt-3 grid gap-3">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-[11px] font-black uppercase text-white/35">Demo fixtures</div>
            <div className="flex items-center gap-1">
              <span className="mr-1 hidden text-[10px] font-bold text-white/30 sm:inline">Scroll scenarios</span>
              <button type="button" aria-label="Previous demo fixtures" onClick={() => scrollFixtures(-1)} className="fixture-scroll-button">
                <ChevronLeft size={15} />
              </button>
              <button type="button" aria-label="Next demo fixtures" onClick={() => scrollFixtures(1)} className="fixture-scroll-button">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
          <div className="relative">
            <div ref={fixtureRailRef} className="sentinel-horizontal-strip" tabIndex={0} aria-label="Demo fixture scenarios">
              {intentExamples.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => onSubmit(item.prompt)}
                  disabled={loading}
                  title={item.prompt}
                  className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-left text-xs font-bold text-white/70 hover:border-[#22d3ee]/45 hover:bg-[#22d3ee]/10 hover:text-[#67e8f9] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="block text-white">{item.label}</span>
                  <span className="mt-1 block font-semibold text-white/40">{item.detail}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSubmit()}
          disabled={loading || !prompt.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#22d3ee] px-5 py-2.5 text-sm font-black text-black shadow-[0_0_24px_rgba(34,211,238,0.24)] hover:bg-[#67e8f9] disabled:cursor-not-allowed disabled:opacity-50 sm:justify-self-end"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowUp size={16} />}
          Review intent
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-white/40">
        <Sparkles size={13} className="text-[#67e8f9]" />
        AI-assisted when configured, deterministic fallback when unavailable. Press Cmd/Ctrl + Enter to submit.
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-300/25 bg-red-500/12 p-3 text-sm text-red-100">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
